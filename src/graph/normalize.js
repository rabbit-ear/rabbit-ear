/**
 * Rabbit Ear (c) Kraft
 */
import { remapKey } from "./maps.js";
/**
 * @description This works on graphs with component arrays with holes.
 * Arrays with holes are a result of some methods, like subgraph, for the
 * purpose of being able to re-merge subgraphs. This method will take
 * those graphs and close up all holes in the arrays by re-numbering
 * components to be from 0...N, ensuring wider compatibility for the graph.
 * @param {FOLD} graph a FOLD object
 * @returns {FOLD} a copy of the input FOLD graph, with no array holes.
 */
const normalize = (graph) => {
	const maps = { vertices: [], edges: [], faces: [] };
	let v = 0;
	let e = 0;
	let f = 0;
	graph.vertices_coords.forEach((_, i) => { maps.vertices[i] = v++; });
	graph.edges_vertices.forEach((_, i) => { maps.edges[i] = e++; });
	graph.faces_vertices.forEach((_, i) => { maps.faces[i] = f++; });
	remapKey(graph, "vertices", maps.vertices);
	remapKey(graph, "edges", maps.edges);
	remapKey(graph, "faces", maps.faces);
	return graph;
};

export default normalize;
