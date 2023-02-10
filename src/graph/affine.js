/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";
import { filterKeysWithSuffix } from "../fold/spec.js";
/**
 * @name transform
 * @memberof graph
 * @description apply an affine transform to a graph; this includes
 * modifying the position of any key ending with "_coords" and multiplying
 * any matrix in keys that end with "_matrix".
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} matrix a 3x4 matrix as a 12 number array
 * @returns {FOLD} the same input graph, modified
 * @linkcode Origami ./src/graph/affine.js 15
 */
const apply_matrix_to_graph = function (graph, matrix) {
	// apply to anything with a coordinate value
	filterKeysWithSuffix(graph, "coords").forEach((key) => {
		graph[key] = graph[key]
			.map(v => math.resize(3, v))
			.map(v => math.multiplyMatrix3Vector3(matrix, v));
	});
	// update all matrix types
	// todo, are these being multiplied in the right order?
	filterKeysWithSuffix(graph, "matrix").forEach((key) => {
		graph[key] = graph[key]
			.map(m => math.multiplyMatrices3(m, matrix));
	});
	return graph;
};
/**
 * @name scale
 * @memberof graph
 * @description apply a uniform affine scale to a graph.
 * @param {FOLD} graph a FOLD graph
 * @param {number} scale the scale amount
 * @param {number[]} optional. an array or series of numbers, the center of scale.
 * @returns {FOLD} the same input graph, modified.
 * @linkcode Origami ./src/graph/affine.js 40
 */
const transform_scale = (graph, ...args) => {
	const scale = args.length === 1
		? [args[0], args[0], args[0]]
		: [1, 1, 1].map((n, i) => (args[i] === undefined ? n : args[i]));
	const matrix = math.makeMatrix3Scale(scale);
	return apply_matrix_to_graph(graph, matrix);
};
/**
 * @name translate
 * @memberof graph
 * @description apply a translation to a graph.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} optional. an array or series of numbers, the translation vector
 * @returns {FOLD} the same input graph, modified
 * @linkcode Origami ./src/graph/affine.js 56
 */
const transform_translate = (graph, ...args) => {
	const vector = math.getVector(...args);
	const vector3 = math.resize(3, vector);
	const matrix = math.makeMatrix3Translate(...vector3);
	return apply_matrix_to_graph(graph, matrix);
};
/**
 * @name rotateZ
 * @memberof graph
 * @description apply a rotation to a graph around the +Z axis.
 * @param {FOLD} graph a FOLD graph
 * @param {number} the rotation amount in radians
 * @param {number[]} optional. an array or series of numbers, the center of rotation
 * @returns {FOLD} the same input graph, modified
 * @linkcode Origami ./src/graph/affine.js 72
 */
const transform_rotateZ = (graph, angle, ...args) => {
	const vector = math.getVector(...args);
	const vector3 = math.resize(3, vector);
	const matrix = math.makeMatrix3RotateZ(angle, ...vector3);
	return apply_matrix_to_graph(graph, matrix);
};

// makeMatrix3Rotate
// makeMatrix3RotateX
// makeMatrix3RotateY
// makeMatrix3ReflectZ

export default {
	scale: transform_scale,
	translate: transform_translate,
	rotateZ: transform_rotateZ,
	transform: apply_matrix_to_graph,
};
