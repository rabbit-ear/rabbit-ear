/**
 * Rabbit Ear (c) Kraft
 */
import {
	makeVerticesToEdgeBidirectional,
} from "./make";

const triangulateVertices = (indices) => Array.from(Array(indices.length - 2))
	.map((_, i) => [indices[0], indices[i + 1], indices[i + 2]]);

export const triangulateConvexFacesVertices = ({ faces_vertices }) => faces_vertices
	.flatMap(vertices => (vertices.length < 4
		? [vertices]
		: triangulateVertices(vertices)));

const makeTriangulatedConvexFacesMap = ({ faces_vertices }) => {
	let i = 0;
	return faces_vertices.flatMap(vertices => {
		if (vertices.length < 4) { return [i++]; }
		const face = Array.from(Array(vertices.length - 2)).map(() => i);
		i += 1;
		return face;
	});
};
// todo, add earcut functionality, if the user provides a reference to the library
export const triangulate = (graph, earcut) => {
	if (!graph.faces_vertices) { return {}; }
	const edgeLookup = makeVerticesToEdgeBidirectional(graph);
	const facesMap = makeTriangulatedConvexFacesMap(graph);
	graph.faces_vertices = triangulateConvexFacesVertices(graph);
	let e = graph.edges_vertices.length;
	// as we traverse the new faces_edges, if we encounter a new edge, add
	// it here in the form of a new edges_vertices
	const newEdgesVertices = [];
	graph.faces_edges = graph.faces_vertices
		.map(vertices => vertices
			.map((v, i, arr) => {
				const edge_vertices = [v, arr[(i + 1) % arr.length]];
				const vertexPair = edge_vertices.join(" ");
				if (vertexPair in edgeLookup) { return edgeLookup[vertexPair]; }
				newEdgesVertices.push(edge_vertices);
				return e++;
			}));
	const newEdgeCount = newEdgesVertices.length;
	graph.edges_vertices.push(...newEdgesVertices);
	if (graph.edges_assignment) {
		graph.edges_assignment.push(...Array(newEdgeCount).fill("J"));
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle.push(...Array(newEdgeCount).fill(0));
	}
	if (graph.vertices_vertices) { delete graph.vertices_vertices; }
	if (graph.vertices_edges) { delete graph.vertices_edges; }
	if (graph.vertices_faces) { delete graph.vertices_faces; }
	if (graph.edges_faces) { delete graph.edges_faces; }
	if (graph.faces_faces) { delete graph.faces_faces; }
	if (graph.faceOrders) {
		console.log("triangulate() method on graph with faceOrders, do not use faceOrders");
	}
	return {
		faces: { map: facesMap },
	};
};
