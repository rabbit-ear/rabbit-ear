/**
 * Rabbit Ear (c) Kraft
 */
// import planarize from "../../graph/planarize.js";
import planarizeNew from "../../graph/planarize.new.js";
import {
	makeVerticesVertices,
	makePlanarFaces,
} from "../../graph/make.js";
/**
 * @description Resolve all crossing edges, build faces,
 * walk and discover the boundary.
 */
const planarizeGraph = (graph, epsilon) => {
	// const planar = { ...graph };
	// planarize(planar, epsilon);
	const planar = planarizeNew(graph, epsilon);
	planar.vertices_vertices = makeVerticesVertices(planar);
	const faces = makePlanarFaces(planar);
	planar.faces_vertices = faces.faces_vertices;
	planar.faces_edges = faces.faces_edges;
	delete planar.vertices_edges;
	return planar;
};

export default planarizeGraph;
