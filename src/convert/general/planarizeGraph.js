/**
 * Rabbit Ear (c) Kraft
 */
import { removeDuplicateVertices } from "../../graph/vertices/duplicate.js";
import planarize from "../../graph/planarize.js";
import {
	makeVerticesVertices,
	makePlanarFaces,
} from "../../graph/make.js";
/**
 * @description Resolve all crossing edges, build faces,
 * walk and discover the boundary.
 */
const planarizeGraph = (graph, epsilon) => {
	const planar = { ...graph };
	removeDuplicateVertices(planar, epsilon);
	planarize(planar, epsilon);
	planar.vertices_vertices = makeVerticesVertices(planar);
	const faces = makePlanarFaces(planar);
	planar.faces_vertices = faces.faces_vertices;
	planar.faces_edges = faces.faces_edges;
	return planar;
};

export default planarizeGraph;
