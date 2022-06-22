/**
 * Rabbit Ear (c) Kraft
 */
import singleVertexSolver from "../layer/singleVertexSolver/index";
import { invertMap } from "./maps";
import {
	getLongestArray,
	circularArrayValidRanges
} from "../general/arrays";
import { makeVerticesSectors } from "./make";
import { makeFacesWinding } from "./facesWinding";

export const makeVertexFacesLayer = ({
	vertices_faces, vertices_sectors, vertices_edges, edges_assignment
}, vertex, epsilon) => {
	// vertices_faces will contain "undefined" for sectors outside the boundary
	const faces = vertices_faces[vertex];
	// valid ranges might return multiple occurences, assume the longest
	// is the one we want. get that one.
	const range = getLongestArray(circularArrayValidRanges(faces));
	if (range === undefined) { return; }
	// convert a range [start, end] into an array of indices, for example:
	// [4,1] into [4,5,6,7,0,1]
	while (range[1] < range[0]) { range[1] += faces.length; }
	const indices = Array
		.from(Array(range[1] - range[0] + 1))
		.map((_, i) => (range[0] + i) % faces.length);
	// use "indices" to get the sectors and assignments for the layer_solver
	const sectors = indices
		.map(i => vertices_sectors[vertex][i]);
	const assignments = indices
		.map(i => vertices_edges[vertex][i])
		.map(edge => edges_assignment[edge]);
	const sectors_layer = singleVertexSolver(sectors, assignments, epsilon);
	// sectors_layer gives us solutions relating the sectors to indices 0...n
	// relate these to the original faces, in 2 steps:
	// 1. map back to vertices_faces, due to valid_array (avoiding undefineds)
	// 2. map back to the faces in vertices_faces, instead of [0...n], a vertex's
	// faces will be anywhere in the graph. like [25, 56, 43, 19...]
	const faces_layer = sectors_layer
		.map(invertMap)
		.map(arr => arr
			.map(face => typeof face !== "object"
				? faces[indices[face]]
				: face.map(f => faces[indices[f]])))
		.map(invertMap);
	// send along the starting, this face is positioned with its normal upwards.
	faces_layer.face = faces[indices[0]];
	return faces_layer;
};

/**
 * @description flip a faces_layer solution to reflect having turned
 * over the origami.
 * @param {number[][]} an array of one or more faces_layer solutions
 */
const flip_solutions = solutions => {
	const face = solutions.face;
	const flipped = solutions
		.map(invertMap)
		.map(list => list.reverse())
		.map(invertMap);
	flipped.face = face;
	return flipped;
};
/**
 * @description compute the faces_layer solutions for every vertex in the
 * graph, taking into considering which face the solver began with each
 * time, and for faces which are upsidedown, flip those solutions also,
 * this way all notion of "above/below" are global, not local to a face
 * according to that face's normal.
 * @param {object} a FOLD graph
 * @param {number} this face will remain fixed
 * @param {number} epsilon, HIGHLY recommended, like: 0.001
 */
export const makeVerticesFacesLayer = (graph, start_face = 0, epsilon) => {
	if (!graph.vertices_sectors) {
		graph.vertices_sectors = makeVerticesSectors(graph);
	}
	// root face, and all faces with the same color, will be false
	const faces_coloring = makeFacesWinding(graph).map(c => !c);
	// the faces_layer solutions for every vertex and its adjacent faces
	const vertices_faces_layer = graph.vertices_sectors
		.map((_, vertex) => makeVertexFacesLayer(graph, vertex, epsilon));
	// is each face flipped or not? (should the result be flipped too.)
	// if this face is flipped in the graph, flip the solution too.
	const vertices_solutions_flip = vertices_faces_layer
		.map(solution => faces_coloring[solution.face])
	return vertices_faces_layer
		.map((solutions, i) => vertices_solutions_flip[i]
			? flip_solutions(solutions)
			: solutions);
};
