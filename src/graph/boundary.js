/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import { uniqueIntegers } from "../general/arrays";
import {
	makeVerticesEdgesUnsorted,
	makeVerticesVertices,
	makeVerticesToEdgeBidirectional,
} from "./make";

export const getBoundingBox = ({ vertices_coords }, padding) => math.core
	.boundingBox(vertices_coords, padding);
/**
 * @description For every vertex return a true if the vertex lies along a boundary
 * edge, as defined by edges_assignment. If edges_assignment is not present,
 * or does not contain boundary edges, this will return an empty array.
 * @param {FOLD} graph a FOLD graph
 * @returns {number[]} unsorted list of vertex indices which lie along the boundary.
 * @linkcode Origami ./src/graph/boundary.js 20
 */
export const getBoundaryVertices = ({ edges_vertices, edges_assignment }) => (
	uniqueIntegers(edges_vertices
		.filter((_, i) => edges_assignment[i] === "B" || edges_assignment[i] === "b")
		.flat()));
// export const getBoundaryVertices = ({ edges_vertices, edges_assignment }) => {
// 	// assign vertices to a hash table to make sure they are unique.
// 	const vertices = {};
// 	edges_vertices.forEach((v, i) => {
// 		const boundary = edges_assignment[i] === "B" || edges_assignment[i] === "b";
// 		if (!boundary) { return; }
// 		vertices[v[0]] = true;
// 		vertices[v[1]] = true;
// 	});
// 	return Object.keys(vertices).map(str => parseInt(str));
// };

const emptyBoundaryObject = () => ({ vertices: [], edges: [] });
/**
 * @description Get the boundary of a FOLD graph in terms of both vertices and edges.
 * This works by walking the boundary edges as defined by edges_assignment ("B" or "b").
 * If edges_assignment doesn't exist, or contains errors, this will not work, and you
 * will need the more robust algorithm getPlanarBoundary() which walks the graph, but
 * only works in 2D.
 * @param {FOLD} graph a FOLD graph
 * @returns {object} with "vertices" and "edges" with arrays of indices.
 * @linkcode Origami ./src/graph/boundary.js 47
 */
export const getBoundary = ({ vertices_edges, edges_vertices, edges_assignment }) => {
	if (edges_assignment === undefined) { return emptyBoundaryObject(); }
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edges_vertices_b = edges_assignment
		.map(a => a === "B" || a === "b");
	const edge_walk = [];
	const vertex_walk = [];
	let edgeIndex = -1;
	for (let i = 0; i < edges_vertices_b.length; i += 1) {
		if (edges_vertices_b[i]) { edgeIndex = i; break; }
	}
	if (edgeIndex === -1) { return emptyBoundaryObject(); }
	edges_vertices_b[edgeIndex] = false;
	edge_walk.push(edgeIndex);
	vertex_walk.push(edges_vertices[edgeIndex][0]);
	let nextVertex = edges_vertices[edgeIndex][1];
	while (vertex_walk[0] !== nextVertex) {
		vertex_walk.push(nextVertex);
		edgeIndex = vertices_edges[nextVertex]
			.filter(v => edges_vertices_b[v])
			.shift();
		if (edgeIndex === undefined) { return emptyBoundaryObject(); }
		if (edges_vertices[edgeIndex][0] === nextVertex) {
			[, nextVertex] = edges_vertices[edgeIndex];
		} else {
			[nextVertex] = edges_vertices[edgeIndex];
		}
		edges_vertices_b[edgeIndex] = false;
		edge_walk.push(edgeIndex);
	}
	return {
		vertices: vertex_walk,
		edges: edge_walk,
	};
};
/**
 * @description Get the boundary as two arrays of vertices and edges
 * by walking the boundary edges in 2D and uncovering the concave hull.
 * Does not consult edges_assignment, but does require vertices_coords.
 * For repairing crease patterns, this will uncover boundary edges_assignments.
 * @param {FOLD} graph a FOLD graph
 * (vertices_coords, vertices_vertices, edges_vertices)
 * (vertices edges only required in case vertices_vertices needs to be built)
 * @returns {object} "vertices" and "edges" with arrays of indices.
 * @usage call populate() before to ensure this works.
 * @linkcode Origami ./src/graph/boundary.js 96
 */
export const getPlanarBoundary = ({
	vertices_coords, vertices_edges, vertices_vertices, edges_vertices,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, vertices_edges, edges_vertices });
	}
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const edge_walk = [];
	const vertex_walk = [];
	const walk = {
		vertices: vertex_walk,
		edges: edge_walk,
	};

	let largestX = -Infinity;
	let first_vertex_i = -1;
	vertices_coords.forEach((v, i) => {
		if (v[0] > largestX) {
			largestX = v[0];
			first_vertex_i = i;
		}
	});

	if (first_vertex_i === -1) { return walk; }
	vertex_walk.push(first_vertex_i);
	const first_vc = vertices_coords[first_vertex_i];
	const first_neighbors = vertices_vertices[first_vertex_i];
	// sort adjacent vertices by next most clockwise vertex;
	const counter_clock_first_i = first_neighbors
		.map(i => vertices_coords[i])
		.map(vc => [vc[0] - first_vc[0], vc[1] - first_vc[1]])
		.map(vec => Math.atan2(vec[1], vec[0]))
		.map(angle => (angle < 0 ? angle + Math.PI * 2 : angle))
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.shift()
		.i;
	const second_vertex_i = first_neighbors[counter_clock_first_i];
	// find this edge that connects these 2 vertices
	const first_edge_lookup = first_vertex_i < second_vertex_i
		? `${first_vertex_i} ${second_vertex_i}`
		: `${second_vertex_i} ${first_vertex_i}`;
	const first_edge = edge_map[first_edge_lookup];
	// vertex_walk.push(second_vertex_i);
	edge_walk.push(first_edge);

	// now we begin the loop

	// walking the graph, we look at 3 vertices at a time. in sequence:
	// prev_vertex, this_vertex, next_vertex
	let prev_vertex_i = first_vertex_i;
	let this_vertex_i = second_vertex_i;
	let protection = 0;
	while (protection < 10000) {
		const next_neighbors = vertices_vertices[this_vertex_i];
		const from_neighbor_i = next_neighbors.indexOf(prev_vertex_i);
		const next_neighbor_i = (from_neighbor_i + 1) % next_neighbors.length;
		const next_vertex_i = next_neighbors[next_neighbor_i];
		const next_edge_lookup = this_vertex_i < next_vertex_i
			? `${this_vertex_i} ${next_vertex_i}`
			: `${next_vertex_i} ${this_vertex_i}`;
		const next_edge_i = edge_map[next_edge_lookup];
		// exit loop condition
		if (next_edge_i === edge_walk[0]) {
			return walk;
		}
		vertex_walk.push(this_vertex_i);
		edge_walk.push(next_edge_i);
		prev_vertex_i = this_vertex_i;
		this_vertex_i = next_vertex_i;
		protection += 1;
	}
	console.warn("calculate boundary potentially entered infinite loop");
	return walk;
};
