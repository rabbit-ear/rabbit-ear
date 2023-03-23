/**
 * Rabbit Ear (c) Kraft
 */
import vertices from "./vertices.js";
import edges, { edgesPaths, edgesLines } from "./edges.js";
import faces, { facesVerticesPolygon, facesEdgesPolygon } from "./faces.js";
import boundaries from "./boundaries.js";

export default {
	// draw a graph component
	vertices,
	edges,
	faces,
	boundaries,
	// subroutines, multiple paths for each component type
	edgesPaths,
	edgesLines,
	facesVerticesPolygon,
	facesEdgesPolygon,
};
