/**
 * Rabbit Ear (c) Kraft
 */
import { disjointGraphs } from "../disjoint.js";
import { makeVerticesVertices2D } from "../make/verticesVertices.js";
import { makeVerticesToEdge } from "../make/lookup.js";

/**
 * @description Use this method when you know there is only one connected
 * boundary in the graph. If there are more than one, use "planarBoundaries".
 * When a graph does not have boundary assignment information,
 * this method is used to uncover the boundary, so long as the graph is planar.
 * Get the boundary as two arrays of vertices and edges
 * by walking the boundary edges in 2D and uncovering the concave hull.
 * Does not consult edges_assignment, but does require vertices_coords.
 * For repairing crease patterns, this will uncover boundary edges_assignments.
 * @param {FOLD} graph a FOLD object
 * (vertices_coords, vertices_vertices, edges_vertices)
 * (vertices edges only required in case vertices_vertices needs to be built)
 * @returns {{
 *   vertices: number[],
 *   edges: number[],
 * }} "vertices" and "edges" with arrays of indices.
 * @usage call populate() before to ensure this works.
 */
export const planarBoundary = ({
	vertices_coords,
	vertices_edges,
	vertices_vertices,
	edges_vertices,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices2D({
			vertices_coords,
			vertices_edges,
			edges_vertices,
		});
	}
	const edge_map = makeVerticesToEdge({ edges_vertices });
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

	if (first_vertex_i === -1) {
		return walk;
	}
	vertex_walk.push(first_vertex_i);
	const first_vc = vertices_coords[first_vertex_i];
	const first_neighbors = vertices_vertices[first_vertex_i];
	if (!first_neighbors) {
		return walk;
	}
	// sort adjacent vertices by next most clockwise vertex;
	const counter_clock_first_i = first_neighbors
		.map((i) => vertices_coords[i])
		.map((vc) => [vc[0] - first_vc[0], vc[1] - first_vc[1]])
		.map((vec) => Math.atan2(vec[1], vec[0]))
		.map((angle) => (angle < 0 ? angle + Math.PI * 2 : angle))
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.shift().i;
	const second_vertex_i = first_neighbors[counter_clock_first_i];
	// find this edge that connects these 2 vertices
	const first_edge_lookup =
		first_vertex_i < second_vertex_i
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
	// because this is an infinite loop, and it relies on vertices_vertices
	// being well formed (if it was user-made, we cannot guarantee), we will
	// break the loop if we walk past the same pair of vertices (in the same dir)
	const visitedVertexPairs = { [`${prev_vertex_i} ${this_vertex_i}`]: true };
	while (true) {
		const next_neighbors = vertices_vertices[this_vertex_i];
		const from_neighbor_i = next_neighbors.indexOf(prev_vertex_i);
		const next_neighbor_i = (from_neighbor_i + 1) % next_neighbors.length;
		const next_vertex_i = next_neighbors[next_neighbor_i];
		const next_edge_lookup =
			this_vertex_i < next_vertex_i
				? `${this_vertex_i} ${next_vertex_i}`
				: `${next_vertex_i} ${this_vertex_i}`;
		const next_edge_i = edge_map[next_edge_lookup];
		// exit loop condition
		if (visitedVertexPairs[`${this_vertex_i} ${next_vertex_i}`]) {
			// if the first and upcoming edge do not match, this means we somehow
			// walked around the boundary and ended up somewhere in the middle,
			// which would put us in a never ending cycle, so we need to break
			// out anyway, but at least warn the user the result is poorly formed.
			// todo: we can get rid of this message if we modify the structure
			// of the return object so that it traverses the circular part only,
			// or, includes a there-and-back traversal of the branch(es).
			if (next_edge_i !== edge_walk[0]) {
				console.warn("bad boundary");
			}
			return walk;
		}
		visitedVertexPairs[`${this_vertex_i} ${next_vertex_i}`] = true;
		vertex_walk.push(this_vertex_i);
		edge_walk.push(next_edge_i);
		prev_vertex_i = this_vertex_i;
		this_vertex_i = next_vertex_i;
	}
};

/**
 * @description When a graph does not have boundary assignment information,
 * this method is used to uncover the boundaries, so long as the graph is planar.
 * This works for disjoint graphs, the return value is an array of results.
 * Each boundary result is two arrays of vertices and edges, discovered
 * by walking the boundary edges in 2D and uncovering the concave hull.
 * Does not consult edges_assignment, but does require vertices_coords.
 * @param {FOLD} graph a FOLD object
 * (vertices_coords, vertices_vertices, edges_vertices)
 * (vertices edges only required in case vertices_vertices needs to be built)
 * @returns {{
 *   vertices: number[],
 *   edges: number[],
 * }[]} array of objects with "vertices" and "edges" with arrays of indices.
 * @usage call populate() before to ensure this works.
 */
export const planarBoundaries = ({
	vertices_coords,
	vertices_edges,
	vertices_vertices,
	edges_vertices,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices2D({
			vertices_coords,
			vertices_edges,
			edges_vertices,
		});
	}
	return disjointGraphs({
		vertices_coords,
		vertices_vertices,
		edges_vertices,
	}).map(planarBoundary);
};
