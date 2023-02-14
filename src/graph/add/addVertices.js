/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constants.js";
import { distance } from "../../math/algebra/vectors.js";
/**
 * @description add vertices to a graph by adding their vertices_coords only. This
 * will also compare against every existing vertex, only adding non-duplicate
 * vertices, as determined by an epsilon.
 * @param {FOLD} graph a FOLD graph, modified in place.
 * @param {number[][]} vertices_coords array of points to be added to the graph
 * @param {number} [epsilon=1e-6] optional epsilon to merge similar vertices
 * @returns {number[]} index of vertex in new vertices_coords array.
 * the size of this array matches array size of source vertices.
 * duplicate (non-added) vertices returns their pre-existing counterpart's index.
 * @linkcode Origami ./src/graph/add/addVertices.js 15
 */
const addVertices = (graph, vertices_coords, epsilon = EPSILON) => {
	if (!graph.vertices_coords) { graph.vertices_coords = []; }
	// the user messed up the input and only provided one vertex
	// it's easy to fix for them
	if (typeof vertices_coords[0] === "number") { vertices_coords = [vertices_coords]; }
	// make an array that matches the new vertices_coords where each entry is either
	// - undefined, if the vertex is unique
	// - number, index of duplicate vertex in source graph, if duplicate exists
	const vertices_equivalent_vertices = vertices_coords
		.map(vertex => graph.vertices_coords
			.map(v => distance(v, vertex) < epsilon)
			.map((on_vertex, i) => (on_vertex ? i : undefined))
			.filter(a => a !== undefined)
			.shift());
	// to be used in the return data array
	let index = graph.vertices_coords.length;
	// add the unique vertices to the destination graph
	const unique_vertices = vertices_coords
		.filter((vert, i) => vertices_equivalent_vertices[i] === undefined);
	graph.vertices_coords.push(...unique_vertices);
	// return the indices of the added vertices in the destination graph
	return vertices_equivalent_vertices
		.map(el => (el === undefined ? index++ : el));
};

export default addVertices;
