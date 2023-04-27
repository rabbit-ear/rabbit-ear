/**
 * Rabbit Ear (c) Kraft
 */
import { chooseTwoPairs } from "../../general/arrays.js";
import { EPSILON } from "../../math/general/constant.js";
import {
	dot,
	normalize,
	subtract,
} from "../../math/algebra/vector.js";
import { rangesOverlapExclusive } from "./general.js";
/**
 *
 */
const doEdgesOverlap = ({
	vertices_coords, edges_vertices,
}, edgePair, vector, epsilon = EPSILON) => {
	const pairCoords = edgePair
		.map(edge => edges_vertices[edge]
			.map(v => vertices_coords[v]));
	const pairCoordsDots = pairCoords
		.map(edge => edge
			.map(coord => dot(coord, vector)));
	const result = rangesOverlapExclusive(...pairCoordsDots, epsilon);
	return result;
};
/**
 * @description Not all planar sets will intersect but when they do,
 * they intersect along a line, and this line will have one or more edges.
 * Find the pairs of planar sets which do contain multiple edges along their
 * intersection and then find all pairwise combinations of those edges
 * which overlap. This creates a list of pairs of edges where the four adjacent
 * faces involved all create a tortilla-tortilla condition, albeit with a
 * non-zero dihedral angle along their shared line.
 * Note: this assumes the graph is a valid manifold (edges with <= 2 faces).
 * @param {FOLD} graph the modified fold graph
 * @param {number[][]} edges_sets which planar set is this edge a member of,
 * we have removed all edges which only inhabit one. all will contain two now.
 */
const get3DTortillaEdges = ({
	vertices_coords, edges_vertices,
}, edges_sets, epsilon = EPSILON) => {
	// crossingSets is a pair of planar-group-indices as a string: "3 15".
	// crossingSets_edges will be a dictionary with pair strings, and the
	// value is an array of all edges which lie along this intersection line.
	const crossingSets_edges = {};
	edges_sets.map(arr => arr.join(" ")).forEach((key, i) => {
		if (crossingSets_edges[key] === undefined) {
			crossingSets_edges[key] = [];
		}
		crossingSets_edges[key].push(i);
	});
	// we are looking for tortilla-tortilla cases, we need two or more edges
	// that overlap each other. remove an entry if it contains only one edge.
	Object.keys(crossingSets_edges)
		.filter(key => crossingSets_edges[key].length < 2)
		.forEach(key => delete crossingSets_edges[key]);
	// now, every intersection between two planes contains two or more edges.
	// make a new choose-two list with every pairwise edge combination,
	// then filter out any pairs which do not geometrically overlap.
	return Object.keys(crossingSets_edges).flatMap(key => {
		// each crossingSet has only one intersection line vector.
		// compute it here to prevent redundant work.
		const edgesPairs = chooseTwoPairs(crossingSets_edges[key]);
		const firstEdge = edgesPairs[0][0];
		const coords = edges_vertices[firstEdge].map(v => vertices_coords[v]);
		const vector = normalize(subtract(coords[1], coords[0]));
		// filter out the edge pairs which do not overlap.
		return edgesPairs.filter(pair => (
			doEdgesOverlap({ vertices_coords, edges_vertices }, pair, vector, epsilon)
		));
	});
};
/**
 * @description For a 3D folded model, this will find the places
 * where two planes meet along collinear edges, these joining of two
 * planes creates a tortilla-tortilla relationship.
 */
const makeBentTortillas = ({
	vertices_coords, edges_vertices, edges_faces,
}, faces_set, edges_set, faces_winding, epsilon = 1e-6) => {
	// all pairwise combinations of edges that create a 3D tortilla-tortilla
	const tortilla_edges = get3DTortillaEdges({
		vertices_coords, edges_vertices,
	}, edges_set, epsilon);
	// for each tortilla-tortilla edge, get the four adjacent faces involved
	const tortilla_faces = tortilla_edges
		.map(pair => pair
			.map(edge => edges_faces[edge]));
	// sort the faces of the tortillas on the correct side so that
	// the two faces in the same plane have the same index in their arrays.
	// [[A,B], [X,Y]], A and B are edge-connected faces, X and Y are connected,
	// and A and X are in the same plane, B and Y are in the same plane.
	tortilla_faces.forEach((tortillas, i) => {
		// if both [0] are not from the same set, reverse the second tortilla's faces
		if (faces_set[tortillas[0][0]] !== faces_set[tortillas[1][0]]) {
			tortilla_faces[i][1].reverse();
		}
	});
	// finally, each planar set chose a normal for that plane at random,
	// it's possible that either side of the tortilla have opposing normals,
	// the act of the solver placing a face "above" or "below" the other means
	// two different things for either side. we need to normalize this behavior.
	// determine a mismatch by checking two adjacent faces (two different sets)
	tortilla_faces
		.map(tortillas => [tortillas[0][0], tortillas[0][1]])
		.map(faces => faces.map(face => faces_winding[face]))
		.map((orients, i) => (orients[0] !== orients[1] ? i : undefined))
		.filter(a => a !== undefined)
		.forEach(i => {
			// two faces that are a member of the same planar set. swap them.
			const temp = tortilla_faces[i][0][1];
			tortilla_faces[i][0][1] = tortilla_faces[i][1][1];
			tortilla_faces[i][1][1] = temp;
		});
	// console.log("tortilla_edges", tortilla_edges);
	// console.log("tortilla_faces", tortilla_faces);
	return tortilla_faces;
};

export default makeBentTortillas;
