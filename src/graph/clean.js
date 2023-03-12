/**
 * Rabbit Ear (c) Kraft
 */
import { removeDuplicateVertices } from "./vertices/duplicate.js";
import { removeIsolatedVertices } from "./vertices/isolated.js";
import { removeDuplicateEdges } from "./edges/duplicate.js";
import { removeCircularEdges } from "./edges/circular.js";
import {
	mergeSimpleNextmaps,
	invertSimpleMap,
} from "./maps.js";
/**
 * @description clean will remove bad graph data. this includes:
 * - duplicate (Euclidean distance) and isolated vertices
 * - circular and duplicate edges.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} summary of changes, a nextmap and the indices removed.
 * @linkcode Origami ./src/graph/clean.js 24
 */
const clean = (graph, epsilon) => {
	// duplicate vertices has to be done first as it's possible that
	// this will create circular/duplicate edges.
	const change_v1 = removeDuplicateVertices(graph, epsilon);
	const change_e1 = removeCircularEdges(graph);
	const change_e2 = removeDuplicateEdges(graph);
	// isolated vertices is last. removing edges can create isolated vertices
	const change_v2 = removeIsolatedVertices(graph);
	// todo: it's possible that an edges_vertices now contains undefineds,
	// like [4, undefined]. but this should not be happening

	// return a summary of changes.
	// use the maps to update the removed indices from the second step
	// to their previous index before change 1 occurred.
	const change_v1_backmap = invertSimpleMap(change_v1.map);
	const change_v2_remove = change_v2.remove.map(e => change_v1_backmap[e]);
	const change_e1_backmap = invertSimpleMap(change_e1.map);
	const change_e2_remove = change_e2.remove.map(e => change_e1_backmap[e]);
	return {
		vertices: {
			map: mergeSimpleNextmaps(change_v1.map, change_v2.map),
			remove: change_v1.remove.concat(change_v2_remove),
		},
		edges: {
			map: mergeSimpleNextmaps(change_e1.map, change_e2.map),
			remove: change_e1.remove.concat(change_e2_remove),
		},
	};
};

export default clean;
