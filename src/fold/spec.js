/**
 * Rabbit Ear (c) Kraft
 */
import {
	keys,
	keysOutOfSpec,
	edgesAssignmentValues,
} from "./keys";
import math from "../math";
/**
 * this contains two types of methods.
 * 1. methods that are mostly references, including lists of keys
 *    that match the FOLD 1.1 specification (anytime FOLD is updated
 *    we need to update here too.)
 * 2. methods that operate on a FOLD object, searching and gathering
 *    and re-arranging keys or values based on key queries.
 */
/**
 * @description English conversion of the names of graph components from plural to singular.
 */
export const singularize = {
	vertices: "vertex",
	edges: "edge",
	faces: "face",
};
/**
 * @description English conversion of the names of graph components from singular to plural.
 */
export const pluralize = {
	vertex: "vertices",
	edge: "edges",
	face: "faces",
};
/**
 * @description get the English word for every FOLD spec assignment character (like "M", or "b")
 */
export const edgesAssignmentNames = {
	b: "boundary",
	m: "mountain",
	v: "valley",
	f: "flat",
	u: "unassigned"
};
edgesAssignmentValues.forEach(key => {
	edgesAssignmentNames[key.toUpperCase()] = edgesAssignmentNames[key];
});
/**
 * @description get the foldAngle in degrees for every FOLD assignment spec character (like "M", or "b"). **this assumes the creases are flat folded.**
 */
export const edgesAssignmentDegrees = {
	M: -180,
	m: -180,
	V: 180,
	v: 180,
	B: 0,
	b: 0,
	F: 0,
	f: 0,
	U: 0,
	u: 0
};
/**
 * @description Convert an assignment character to a foldAngle in degrees. This assumes
 * that all assignments are flat folds.
 * @param {string} assignment one edge assignment letter: M V B F U
 * @returns {number} fold angle in degrees. M/V are assumed to be flat-folded.
 */
export const edgeAssignmentToFoldAngle = assignment =>
	edgesAssignmentDegrees[assignment] || 0;
/**
 * @description Convert a foldAngle to an edge assignment character.
 * @param {number} angle fold angle in degrees
 * @returns {string} one edge assignment letter: M V or U, no boundary detection
 * @todo should "U" be "F" instead, if so, we are assigning potental "B" edges to "F".
 */
export const edgeFoldAngleToAssignment = (a) => {
	if (a > math.core.EPSILON) { return "V"; }
	if (a < -math.core.EPSILON) { return "M"; }
	// if (math.core.fnEpsilonEqual(0, a)) { return "F"; }
	return "U";
};
/**
 * @description Test if a fold angle is a flat fold, which includes -180, 0, 180,
 * and the +/- epsilon around each number.
 * @param {number} angle fold angle in degrees
 * @returns {boolean} true if the fold angle is flat
 */
export const edgeFoldAngleIsFlat = angle => math.core.fnEpsilonEqual(0, angle)
 || math.core.fnEpsilonEqual(-180, angle)
 || math.core.fnEpsilonEqual(180, angle);
/**
 * @description Provide a FOLD graph and determine if all edges_foldAngle
 * angles are flat, which includes -180, 0, 180, and the +/- epsilon
 * around each number. If a graph contains no "edges_foldAngle",
 * the angles are considered flat, and the method returns "true".
 * @param {FOLD} graph a FOLD graph
 * @returns {boolean} is the graph flat-foldable according to foldAngles.
 */
export const edgesFoldAngleAreAllFlat = ({ edges_foldAngle }) => {
	if (!edges_foldAngle) { return true; }
	for (let i = 0; i < edges_foldAngle.length; i++) {
		if (!edgeFoldAngleIsFlat(edges_foldAngle[i])) { return false; }
	}
	return true;
};
/**
 * @description Get all keys in an object that end with the provided suffix.
 * @param {object} obj an object
 * @param {string} suffix a suffix to match against the keys
 * @returns {string[]} array of keys that end with the suffix
 */
export const filterKeysWithSuffix = (graph, suffix) => Object
	.keys(graph)
	.map(s => (s.substring(s.length - suffix.length, s.length) === suffix
		? s : undefined))
	.filter(str => str !== undefined);
/**
 * @description Get all keys in an object that start with the provided prefix.
 * @param {object} obj an object
 * @param {string} prefix a prefix to match against the keys
 * @returns {string[]} array of keys that start with the prefix
 */
export const filterKeysWithPrefix = (obj, prefix) => Object
	.keys(obj)
	.map(str => (str.substring(0, prefix.length) === prefix
		? str : undefined))
	.filter(str => str !== undefined);
/**
 * @description Get all keys in a graph which contain a "_" prefixed by the provided string.
 * @param {FOLD} graph a FOLD object
 * @param {string} prefix a prefix to match against the keys
 * @returns {string[]} array of keys that start with the prefix
 * for example: "vertices" will return:
 * vertices_coords, vertices_faces,
 * but not edges_vertices, or verticesCoords (must end with _)
 */
export const getGraphKeysWithPrefix = (graph, key) =>
	filterKeysWithPrefix(graph, `${key}_`);
/**
 * @description Get all keys in a graph which contain a "_" followed by the provided suffix.
 * @param {FOLD} graph a FOLD object
 * @param {string} suffix a suffix to match against the keys
 * @returns {string[]} array of keys that end with the suffix
 * for example: "vertices" will return:
 * edges_vertices, faces_vertices,
 * but not vertices_coords, or edgesvertices (must prefix with _)
 */
export const getGraphKeysWithSuffix = (graph, key) =>
	filterKeysWithSuffix(graph, `_${key}`);
/**
 * @description This takes in a geometry_key (vectors, edges, faces), and flattens
 * across all related arrays, creating one object with the keys for every index.
 * @param {FOLD} graph a FOLD object
 * @param {string} geometry_key a geometry item like "vertices"
 * @returns {object[]} an array of objects with FOLD keys but the values are from this single element
 */
export const transposeGraphArrays = (graph, geometry_key) => {
	const matching_keys = getGraphKeysWithPrefix(graph, geometry_key);
	if (matching_keys.length === 0) { return []; }
	const len = Math.max(...matching_keys.map(arr => graph[arr].length));
	const geometry = Array.from(Array(len))
		.map(() => ({}));
	// approach 1: this removes the geometry name from the geometry key
	// since it should be implied
	// matching_keys
	//   .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
	//   .forEach(key => geometry
	//     .forEach((o, i) => { geometry[i][key.short] = graph[key.long][i]; }));
	// approach 2: preserve geometry key
	matching_keys
		.forEach(key => geometry
			.forEach((o, i) => { geometry[i][key] = graph[key][i]; }));
	return geometry;
};
/**
 * @description This takes in a geometry_key (vectors, edges, faces), and flattens
 * across all related arrays, creating one object with the keys.
 * @param {FOLD} graph a FOLD object
 * @param {string} geometry_key a geometry item like "vertices"
 * @param {number} the index of an element
 * @returns {object} an object with FOLD keys but the values are from this single element
 */
export const transposeGraphArrayAtIndex = function (
	graph,
	geometry_key,
	index
) {
	const matching_keys = getGraphKeysWithPrefix(graph, geometry_key);
	if (matching_keys.length === 0) { return undefined; }
	const geometry = {};
	// matching_keys
	//   .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
	//   .forEach((key) => { geometry[key.short] = graph[key.long][index]; });
	matching_keys.forEach((key) => { geometry[key] = graph[key][index]; });
	return geometry;
};
/**
 * @description Using heuristics, try to determine if an object is a FOLD object.
 * @param {FOLD} graph a FOLD object
 * @returns {number} value between 0 and 1, zero meaning no chance, one meaning 100% chance
 */
export const isFoldObject = (object = {}) => (
	Object.keys(object).length === 0
		? 0
		: [].concat(keys, keysOutOfSpec)
			.filter(key => object[key]).length / Object.keys(object).length);
