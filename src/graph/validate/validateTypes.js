/**
 * Rabbit Ear (c) Kraft
 */
import {
	foldKeys,
} from "../../fold/spec.js";
import {
	duplicateEdges,
} from "../edges/duplicate.js";
import {
	circularEdges,
} from "../edges/circular.js";

/**
 * @returns {number[]} indices
 */
const noNulls = (array) => array
	.map((el, i) => (el === null || el === undefined ? i : undefined))
	.filter(a => a !== undefined);

/**
 * @description
 * @param {FOLD} graph a FOLD object
 * @returns {string[]} a list of errors if they exist
 */
export const validateTypes = (graph) => {
	const errors = [];
	// check if any graph array has null values at the top level
	foldKeys.graph
		.filter(key => graph[key])
		.forEach(key => errors.push(...noNulls(graph[key])
			.map(i => `${key}[${i}] is undefined or null`)));

	try {
		[
			"vertices_coords",
			"vertices_vertices",
			"vertices_edges",
			"edges_vertices",
			"faces_vertices",
			"faces_edges",
		].filter(key => graph[key])
			.flatMap(key => graph[key]
				.map(noNulls)
				.flatMap((indices, i) => indices.map(j => `${key}[${i}][${j}] is undefined or null`)))
			.forEach(error => errors.push(error));
	} catch (error) {
		errors.push("inner array null validation failed due to bad index access");
	}

	if (graph.vertices_coords) {
		errors.push(...graph.vertices_coords
			.map((coords, v) => (coords.length !== 2 && coords.length !== 3
				? v
				: undefined))
			.filter(a => a !== undefined)
			.map(e => `vertices_coords[${e}] is not length 2 or 3`));
	}

	if (graph.edges_vertices) {
		errors.push(...graph.edges_vertices
			.map((vertices, e) => (vertices.length !== 2 ? e : undefined))
			.filter(a => a !== undefined)
			.map(e => `edges_vertices[${e}] is not length 2`));

		const circular_edges = circularEdges(graph);
		if (circular_edges.length !== 0) {
			errors.push(`circular edges_vertices: ${circular_edges.join(", ")}`);
		}

		const duplicate_edges = duplicateEdges(graph);
		if (duplicate_edges.length !== 0) {
			const dups = duplicate_edges
				.map((dup, e) => `${e}(${dup})`)
				.filter(a => a)
				.join(", ");
			errors.push(`duplicate edges_vertices: ${dups}`);
		}
	}

	if (graph.faces_vertices) {
		errors.push(...graph.faces_vertices
			.map((vertices, f) => (vertices.length === 0 ? f : undefined))
			.filter(a => a !== undefined)
			.map(f => `faces_vertices[${f}] contains no vertices`));
	}

	if (graph.faces_edges) {
		errors.push(...graph.faces_edges
			.map((edges, f) => (edges.length === 0 ? f : undefined))
			.filter(a => a !== undefined)
			.map(f => `faces_edges[${f}] contains no edges`));
	}
	return errors;
};
