/**
 * Rabbit Ear (c) Kraft
 */
import { chooseTwoPairs } from "../../general/arrays.js";
import { EPSILON } from "../../math/general/constant.js";
import {
	normalize,
	dot,
	subtract,
} from "../../math/algebra/vector.js";
import {
	doEdgesOverlap,
	doRangesOverlap,
} from "./general.js";
import { getEdgesLine } from "../../graph/edges/lines.js";
import { invertMap } from "../../graph/maps.js";
import { makeEdgesCoords } from "../../graph/make.js";
/**
 *
 */
const getOverlappingCollinearEdges = ({
	vertices_coords, edges_vertices,
}, epsilon = EPSILON) => {
	const {
		lines,
		edges_line,
	} = getEdgesLine({ vertices_coords, edges_vertices }, epsilon);
	// this is not the unique vector for each line, for every edge that is
	// inside a shared collinear group they all have the same vector (important).
	const edges_vector = edges_line.map(line => lines[line].vector);
	const edges_dots = makeEdgesCoords({ vertices_coords, edges_vertices })
		.map((points, e) => points
			.map(point => dot(edges_vector[e], point)));
	// todo: n^2. line sweep can improve. could be only in rare cases though
	// that this is really an issue. inside each lines_edges group is typically
	// only a small number of edges anyway. this is what is being n^2 compared.
	return invertMap(edges_line)
		.map(el => (el.constructor === Array ? el : [el]))
		.flatMap(edges => chooseTwoPairs(edges)
			.filter(pair => (doRangesOverlap(...pair.map(n => edges_dots[n])))));
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
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} an array of tortilla-tortilla edge pairs, where each
 * is an array of two collinear edges that overlap each other in 3D space.
 */
export const getOverlappingCollinearEdgePairs = ({
	vertices_coords, edges_vertices,
}, edges_sets, epsilon = EPSILON) => {
	// all overlapping collinear pairs of edges (in 2D or 3D)
	const allOverlappingEdges = getOverlappingCollinearEdges({
		vertices_coords, edges_vertices,
	}, epsilon).map(pair => (pair[0] < pair[1] ? pair : pair.slice().reverse()));
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
	const lEdges = Object.keys(crossingSets_edges).flatMap(key => {
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
	}).map(pair => (pair[0] < pair[1] ? pair : pair.slice().reverse()));
	// now remove the intersection of coplanar edges from allOverlappingEdges.
	// the result will be waterbomb edges (3)
	// todo: need to filter out so that waterbomb edges contains at least some
	// faces which are in the same plane.
	// console.log("crossingSets_edges", crossingSets_edges);
	const allOverlapKeys = {};
	allOverlappingEdges.forEach((pair, i) => { allOverlapKeys[pair.join(" ")] = i; });
	// console.log("allOverlapKeys", allOverlapKeys);
	lEdges.forEach(pair => delete allOverlapKeys[pair.join(" ")]);
	const tEdges = Object.values(allOverlapKeys)
		.map(i => allOverlappingEdges[i]);
	// console.log("allOverlap", allOverlappingEdges);
	return {
		lEdges,
		tEdges,
	};
};
