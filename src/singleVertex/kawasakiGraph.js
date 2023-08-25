/**
 * Rabbit Ear (c) Kraft
 */
import {
	dot2,
	normalize2,
	subtract2,
} from "../math/algebra/vector.js";
import { counterClockwiseOrder2 } from "../math/geometry/radial.js";
import { assignmentCanBeFolded } from "../fold/spec.js";
import { kawasakiSolutionsVectors } from "./kawasakiMath.js";
import { makeVerticesEdgesUnsorted } from "../graph/make.js";

// todo: this is doing too much work in preparation
/**
 * @description given a single vertex in a graph which does not yet satisfy Kawasaki's theorem,
 * find all possible single-ray additions which when added to the set, the set
 * satisfies Kawasaki's theorem.
 * @usage this is hard coded to work for flat-plane, where sectors sum to 360deg
 * @param {object} graph a FOLD object
 * @param {number} vertex the index of the vertex
 * @returns {number[][]} for every sector either one vector or
 * undefined if that sector contains no solution.
 * @linkcode Origami ./src/singleVertex/kawasakiGraph.js 21
 */
export const kawasakiSolutions = ({ vertices_coords, vertices_edges, edges_assignment, edges_vertices }, vertex) => {
	// to calculate Kawasaki's theorem, we need the 3 edges
	// as vectors, and we need them sorted radially.
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	// for each of the vertex's adjacent edges,
	// get the edge's vertices, order them such that
	// the vertex is in spot 0, the other is spot 1.
	const edges = edges_assignment
		? vertices_edges[vertex]
			.filter(e => assignmentCanBeFolded[edges_assignment[e]])
		: vertices_edges[vertex];
	if (edges.length % 2 === 0) { return []; }
	const vert_edges_vertices = edges
		.map(edge => (edges_vertices[edge][0] === vertex
			? edges_vertices[edge]
			: [edges_vertices[edge][1], edges_vertices[edge][0]]));
	const vert_edges_coords = vert_edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]));
	const vert_edges_vector = vert_edges_coords
		.map(coords => subtract2(coords[1], coords[0]));
	const sortedVectors = counterClockwiseOrder2(vert_edges_vector)
		.map(i => vert_edges_vector[i]);
	const result = kawasakiSolutionsVectors(sortedVectors);
	const normals = sortedVectors.map(normalize2);
	const filteredResults = result
		.filter(a => a !== undefined)
		.filter(vector => !normals
			.map(v => dot2(vector, v))
			.map(d => Math.abs(1 - d) < 1e-3)
			.reduce((a, b) => a || b, false));
	return filteredResults;
};
