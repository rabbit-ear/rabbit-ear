/**
 * Rabbit Ear (c) Kraft
 */
import {
	cross2,
	subtract2,
} from "../math/vector.js";
import {
	pointsToLine,
} from "../math/convert.js";
import {
	edgeToLine,
} from "../graph/edges/lines.js";

/**
 * @description An edge is adjacent to one or two faces,
 * this is stored in its edges_faces entry. for each of these
 * faces, which side of the edge (using the edge's vector)
 * is each face on. each result is an array of length
 * matching the number of adjacent edges.
 * @param {FOLD} graph the fold object with edges_faces and faces_center
 * @returns {number[][]} for every edge, for each of its 1 or 2 adjacent faces,
 * a +1 or -1 for each face indicating which side of the edge the face lies on.
 */
export const makeEdgesFacesSide = ({
	vertices_coords, edges_vertices, edges_faces, faces_center,
}) => {
	// convert edges into a line form with a vector and origin
	const edgesLine = edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]))
		.map(points => pointsToLine(...points));

	// for each edge, for each of it's adjacent faces (either 1 or 2),
	// which side of the edge's vector does that face lie on?
	// compute the cross product of the edge's vector with the vector
	// from the edge origin to the face's center. return +1 or -1
	return edges_faces
		.map((faces, i) => faces
			.map(face => cross2(
				subtract2(faces_center[face], edgesLine[i].origin),
				edgesLine[i].vector,
			))
			.map(cross => Math.sign(cross)));
};

/**
 * @description having already pre-computed a the tacos in the form of
 * edges and the edges' adjacent faces, give each face a +1 or -1 based
 * on which side of the edge it is on. "side" determined by the cross-
 * product against the edge's vector.
 * @param {{
 *   vertices_coords: number[][],
 *   edges_vertices: number[][],
 *   faces_center: number[][],
 * }} graph the fold graph with faces_center
 * @param {[number, number][]} edgePairs
 * @returns {[[number,number],[number,number]][]}
 * @linkcode Origami ./src/layer/solver2d/tacos/facesSide.js 33
 */
export const makeEdgePairsFacesSide = (
	{ vertices_coords, edges_vertices, edges_faces, faces_center },
	edgePairs,
) => {
	// there are two edges involved in a taco, grab the first one.
	// we have to use the same origin/vector so that the face-sidedness is
	// consistent globally, not local to its edge.
	const edgePairsLine = edgePairs
		.map(([edge, _]) => edgeToLine({ vertices_coords, edges_vertices }, edge));

	return edgePairs
		// convert pairs of edges into pairs of face-pairs (two faces for each edge)
		.map(pair => pair.map(edge => edges_faces[edge]))
		// cross product of every edge-pair's line vector against
		// every face's vector (vector from edge origin to face center)
		.map((faces, i) => faces
				.map(face_pair => face_pair
					.map(face => faces_center[face])
					.map(center => cross2(
						subtract2(center, edgePairsLine[i].origin),
						edgePairsLine[i].vector,
					))
					.map(Math.sign)));
};