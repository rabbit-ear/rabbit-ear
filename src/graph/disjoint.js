/**
 * Rabbit Ear (c) Kraft
 */
import { connectedComponents } from "./connectedComponents.js";
import {
	makeVerticesVerticesUnsorted,
	makeVerticesEdgesUnsorted,
	makeVerticesFacesUnsorted,
} from "./make.js";
import { invertArrayMap } from "./maps.js";
import { filterKeysWithPrefix } from "../fold/spec.js";
import { uniqueElements } from "../general/array.js";
/**
 * @description In the case that your graph is a disjoint union
 * of graphs, return an array of all graphs separated, where each
 * graph's components maintain their indices, the component arrays
 * will have holes.
 */
export const disjointGraphsIndices = (graph) => {
	const edges_vertices = graph.edges_vertices || [];
	const faces_vertices = graph.faces_vertices || [];
	const vertices_edges = graph.vertices_edges
		? graph.vertices_edges
		: makeVerticesEdgesUnsorted({ edges_vertices });
	const vertices_vertices = graph.vertices_vertices
		? graph.vertices_vertices
		: makeVerticesVerticesUnsorted({ vertices_edges, edges_vertices });
	const vertices_faces = graph.vertices_faces
		? graph.vertices_faces
		: makeVerticesFacesUnsorted({ vertices_edges, faces_vertices });
	// oh yeah this won't work. everything needs to come from just the one array,
	// whether it's vertices_vertices or faces_faces or whatever, we need to pick
	// just one.
	const vertices = invertArrayMap(connectedComponents(vertices_vertices));
	const edges = vertices
		.map(verts => verts.flatMap(v => vertices_edges[v]))
		.map(uniqueElements);
	const faces = vertices
		.map(verts => verts.flatMap(v => vertices_faces[v]))
		.map(uniqueElements);
	return Array.from(Array(vertices.length)).map((_, i) => ({
		vertices: vertices[i] || [],
		edges: edges[i] || [],
		faces: faces[i] || [],
	}));
};
/**
 * @description In the case that your graph is a disjoint union
 * of graphs, return an array of all graphs separated, where each
 * graph's components maintain their indices, the component arrays
 * will have holes.
 */
export const disjointGraphs = (graph) => {
	const graphs = disjointGraphsIndices(graph);
	const verticesKeys = filterKeysWithPrefix(graph, "vertices");
	const edgesKeys = filterKeysWithPrefix(graph, "edges");
	const facesKeys = filterKeysWithPrefix(graph, "faces");
	return graphs.map(({ vertices, edges, faces }) => {
		const subgraph = {};
		verticesKeys.forEach(key => {
			subgraph[key] = [];
			vertices.forEach(v => { subgraph[key][v] = graph[key][v]; });
		});
		edgesKeys.forEach(key => {
			subgraph[key] = [];
			edges.forEach(v => { subgraph[key][v] = graph[key][v]; });
		});
		facesKeys.forEach(key => {
			subgraph[key] = [];
			faces.forEach(v => { subgraph[key][v] = graph[key][v]; });
		});
		return subgraph;
	});
};
