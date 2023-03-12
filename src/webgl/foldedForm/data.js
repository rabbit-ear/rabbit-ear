/**
 * Rabbit Ear (c) Kraft
 */
import { makeVerticesNormal } from "../../graph/normals.js";
import { makeEdgesVector } from "../../graph/make.js";
import { ASSIGNMENT_COLOR } from "../general/colors.js";

export const makeFacesVertexData = (graph, options = {}) => {
	const vertices_coords = graph.vertices_coords
		.map(coord => [...coord].concat(Array(3 - coord.length).fill(0)));
	const vertices_normal = makeVerticesNormal(graph);
	const vertices_barycentric = vertices_coords
		.map((_, i) => i % 3)
		.map(n => [n === 0 ? 1 : 0, n === 1 ? 1 : 0, n === 2 ? 1 : 0]);
	// // const rawEdges = graph.faces_rawEdge.flatMap(n => [n, n, n]);
	const facesEdgesIsJoined = graph.faces_edges
		.map(edges => edges
			.map(e => graph.edges_assignment[e])
			.map(a => a === "J" || a === "j"));
	if (!options.showTrianglulation) {
		for (let i = 0; i < facesEdgesIsJoined.length; i += 1) {
			if (facesEdgesIsJoined[i][0]) {
				vertices_barycentric[i * 3 + 0][2] = vertices_barycentric[i * 3 + 1][2] = 100;
			}
			if (facesEdgesIsJoined[i][1]) {
				vertices_barycentric[i * 3 + 1][0] = vertices_barycentric[i * 3 + 2][0] = 100;
			}
			if (facesEdgesIsJoined[i][2]) {
				vertices_barycentric[i * 3 + 0][1] = vertices_barycentric[i * 3 + 2][1] = 100;
			}
		}
	}
	return {
		vertices_coords,
		vertices_normal,
		vertices_barycentric,
	};
};

// thick edges
export const makeThickEdgesVertexData = (graph, assignment_color = ASSIGNMENT_COLOR) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) { return []; }
	const vertices_coords3D = graph.vertices_coords
		.map(coord => [...coord].concat(Array(3 - coord.length).fill(0)));
	const vertices_coords = graph.edges_vertices
		.flatMap(edge => edge
			.map(v => vertices_coords3D[v]))
		.flatMap(coord => [coord, coord, coord, coord]);
	const edgesVector = makeEdgesVector(graph);
	const vertices_color = graph.edges_assignment
		? graph.edges_assignment
			.flatMap(a => Array(8).fill(assignment_color[a]))
		: graph.edges_vertices
			.flatMap(() => Array(8).fill(assignment_color.U));
	const verticesEdgesVector = edgesVector
		.flatMap(el => [el, el, el, el, el, el, el, el]);
	const vertices_vector = graph.edges_vertices
		.flatMap(() => [
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],

			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
		]);
	return {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	};
};
