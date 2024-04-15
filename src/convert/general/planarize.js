/**
 * Rabbit Ear (c) Kraft
 */
import {
	planarize,
} from "../../graph/planarize.js";
import {
	makeVerticesVertices,
} from "../../graph/make/verticesVertices.js";
import {
	makePlanarFaces,
} from "../../graph/make/faces.js";

/**
 * @description Resolve all crossing edges, build faces,
 * walk and discover the boundary.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {FOLD}
 */
export const planarizeGraph = (graph, epsilon) => {
	const planar = planarize(graph, epsilon);
	planar.vertices_vertices = makeVerticesVertices(planar);
	const faces = makePlanarFaces(planar);
	planar.faces_vertices = faces.faces_vertices;
	planar.faces_edges = faces.faces_edges;
	delete planar.vertices_edges;
	return planar;
};
