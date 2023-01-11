/**
 * Rabbit Ear (c) Kraft
 */
import { makeEdgesVector } from "../../graph/make";

const ASSIGNMENT_COLOR = {
	B: [0.3, 0.3, 0.3],
	b: [0.3, 0.3, 0.3],
	V: [0.2, 0.4, 0.6],
	v: [0.2, 0.4, 0.6],
	M: [0.75, 0.25, 0.15],
	m: [0.75, 0.25, 0.15],
	F: [0.2, 0.2, 0.2],
	f: [0.2, 0.2, 0.2],
	U: [0.2, 0.2, 0.2],
	u: [0.2, 0.2, 0.2],
};

const make2D = (coords) => coords
	.map(coord => [0, 1]
		.map(i => coord[i] || 0));

export const makeCPEdgesVertexData = (graph, assignment_color = ASSIGNMENT_COLOR) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) { return []; }
	const vertices_coords = make2D(graph.edges_vertices
		.flatMap(edge => edge
			.map(v => graph.vertices_coords[v]))
		.flatMap(coord => [coord, coord]));
	const edgesVector = make2D(makeEdgesVector(graph));
	const vertices_color = graph.edges_assignment
		? graph.edges_assignment.flatMap(a => [
			assignment_color[a],
			assignment_color[a],
			assignment_color[a],
			assignment_color[a],
		])
		: graph.edges_vertices.flatMap(() => [
			assignment_color.U,
			assignment_color.U,
			assignment_color.U,
			assignment_color.U,
		]);
	const verticesEdgesVector = edgesVector
		.flatMap(el => [el, el, el, el]);
	const vertices_vector = graph.edges_vertices
		.flatMap(() => [[1, 0], [-1, 0], [-1, 0], [1, 0]]);
	return {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	};
};
