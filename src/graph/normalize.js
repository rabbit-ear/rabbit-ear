import { invertMap } from "./maps.js";
import {
	filterKeysWithPrefix,
	filterKeysWithSuffix,
} from "../fold/spec.js";

const remapKey = (graph, key, indexMap) => {
	const invertedMap = invertMap(indexMap);
	// update every component that points to vertices_coords
	// these arrays do not change their size, only their contents
	filterKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => graph[sKey][ii]
				.forEach((v, jj) => { graph[sKey][ii][jj] = indexMap[v]; })));
	// if a key was not included in indexMap for whatever reason,
	// it will be registered as "undefined". remove these.
	// the upcoming "prefix" step will automatically do this as well.
	filterKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => {
				graph[sKey][ii] = graph[sKey][ii].filter(a => a !== undefined);
			}));
	// set the top-level arrays
	filterKeysWithPrefix(graph, key).forEach(prefix => {
		graph[prefix] = invertedMap.map(old => graph[prefix][old]);
	});
};
/**
 * @description This works on graphs with component arrays with holes.
 * Arrays with holes are a result of some methods, like subgraph, for the
 * purpose of being able to re-merge subgraphs. This method will take
 * those graphs and close up all holes in the arrays by re-numbering
 * components to be from 0...N, ensuring wider compatibility for the graph.
 * @param {FOLD} graph a FOLD graph
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
