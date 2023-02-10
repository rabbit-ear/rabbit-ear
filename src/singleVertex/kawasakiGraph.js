/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";
import { kawasakiSolutionsVectors } from "./kawasakiMath.js";
import {
	makeEdgesVector,
	makeVerticesEdgesUnsorted,
} from "../graph/make.js";

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
export const kawasakiSolutions = ({ vertices_coords, vertices_edges, edges_vertices, edges_vectors }, vertex) => {
	// to calculate Kawasaki's theorem, we need the 3 edges
	// as vectors, and we need them sorted radially.
	if (!edges_vectors) {
		edges_vectors = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const vectors = vertices_edges[vertex].map(i => edges_vectors[i]);
	const sortedVectors = math.counterClockwiseOrder2(vectors)
		.map(i => vectors[i]);
	return kawasakiSolutionsVectors(sortedVectors);
};
