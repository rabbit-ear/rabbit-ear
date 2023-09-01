/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/constant.js";
import {
	distance,
	resize,
} from "../math/vector.js";
import count from "./count.js";
import {
	singularize,
	filterKeysWithPrefix,
	filterKeysWithSuffix,
} from "../fold/spec.js";
/**
 * @description Join two planar graphs, creating new vertices, edges, faces.
 */
// const joinPlanarGraphs = (...graphs) => {
// export const joinPlanarGraphs = (graph) => {

// };

const VEF = Object.keys(singularize);
/**
 *
 */
const makeVerticesMapAndConsiderDuplicates = (target, source, epsilon = EPSILON) => {
	let index = target.vertices_coords.length;
	return source.vertices_coords
		.map(vertex => target.vertices_coords
			.map(v => distance(v, vertex) < epsilon)
			.map((onVertex, i) => (onVertex ? i : undefined))
			.filter(a => a !== undefined)
			.shift())
		.map(el => (el === undefined ? index++ : el));
};
/**
 *
 */
const getEdgesDuplicateFromSourceInTarget = (target, source) => {
	const source_duplicates = {};
	const target_map = {};
	for (let i = 0; i < target.edges_vertices.length; i += 1) {
		// we need to store both, but only need to test one
		target_map[`${target.edges_vertices[i][0]} ${target.edges_vertices[i][1]}`] = i;
		target_map[`${target.edges_vertices[i][1]} ${target.edges_vertices[i][0]}`] = i;
	}
	for (let i = 0; i < source.edges_vertices.length; i += 1) {
		const index = target_map[`${source.edges_vertices[i][0]} ${source.edges_vertices[i][1]}`];
		if (index !== undefined) {
			source_duplicates[i] = index;
		}
	}
	return source_duplicates;
};
/**
 * @description updateSuffixes
 * @param {object} FOLD graph
 * @param {string[]} array of strings like "vertices_edges"
 * @param {string[]} array of any combination of "vertices", "edges", or "faces"
 * @param {object} object with keys VEF each with an array of index maps
 */
const updateSuffixes = (source, suffixes, keys, maps) => keys
	.forEach(geom => suffixes[geom]
		.forEach(key => source[key]
			.forEach((arr, i) => arr
				.forEach((el, j) => { source[key][i][j] = maps[geom][el]; }))));
/**
 * @description join graphs
 */
// todo, make the second param ...sources
export const joinGraphs = (target, source, epsilon = EPSILON) => {
	// these all relate to the source, not target
	const prefixes = {};
	const suffixes = {};
	const maps = {};
	const dimensions = [target, source]
		.map(g => g.vertices_coords)
		.map(coords => (coords && coords.length ? coords[0].length : 0))
		.reduce((a, b) => Math.max(a, b));
	target.vertices_coords = target.vertices_coords
		.map(coord => resize(dimensions, coord));
	// gather info
	VEF.forEach(key => {
		prefixes[key] = filterKeysWithPrefix(source, key);
		suffixes[key] = filterKeysWithSuffix(source, key);
	});
	// if source keys don't exist in the target, create empty arrays
	VEF.forEach(geom => prefixes[geom].filter(key => !target[key]).forEach(key => {
		target[key] = [];
	}));
	// vertex map
	maps.vertices = makeVerticesMapAndConsiderDuplicates(target, source, epsilon);
	// correct indices in all vertex suffixes, like "faces_vertices", "edges_vertices"
	updateSuffixes(source, suffixes, ["vertices"], maps);
	// edge map
	const target_edges_count = count.edges(target);
	maps.edges = Array.from(Array(count.edges(source)))
		.map((_, i) => target_edges_count + i);
	const edge_dups = getEdgesDuplicateFromSourceInTarget(target, source);
	Object.keys(edge_dups).forEach(i => { maps.edges[i] = edge_dups[i]; });
	// faces map
	const target_faces_count = count.faces(target);
	maps.faces = Array.from(Array(count.faces(source)))
		.map((_, i) => target_faces_count + i);
	// todo find duplicate faces, correct map
	// correct indices in all edges and faces suffixes
	updateSuffixes(source, suffixes, ["edges", "faces"], maps);
	// copy all geometry arrays from source to target
	VEF.forEach(geom => prefixes[geom].forEach(key => source[key].forEach((el, i) => {
		const new_index = maps[geom][i];
		target[key][new_index] = el;
	})));
	return maps;
};
