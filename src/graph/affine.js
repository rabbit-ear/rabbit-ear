/**
 * Rabbit Ear (c) Kraft
 */
import {
	makeMatrix3Translate,
	makeMatrix3Scale,
	makeMatrix3RotateZ,
	multiplyMatrix3Vector3,
	multiplyMatrices3,
} from "../math/algebra/matrix3.js";
import {
	subtract,
	resize,
} from "../math/algebra/vector.js";
import { getVector } from "../math/general/get.js";
import { boundingBox } from "../math/geometry/polygon.js";
import { filterKeysWithSuffix } from "../fold/spec.js";
/**
 * @name transform
 * @memberof graph
 * @description apply an affine transform to a graph; this includes
 * modifying the position of any key ending with "_coords" and multiplying
 * any matrix in keys that end with "_matrix".
 * @param {FOLD} graph a FOLD object, modified in place
 * @param {number[]} matrix a 3x4 matrix as a 12 number array
 * @returns {FOLD} the same input graph, modified
 * @linkcode Origami ./src/graph/affine.js 23
 */
const apply_matrix_to_graph = function (graph, matrix) {
	// apply to anything with a coordinate value
	filterKeysWithSuffix(graph, "coords").forEach((key) => {
		graph[key] = graph[key]
			.map(v => resize(3, v))
			.map(v => multiplyMatrix3Vector3(matrix, v));
	});
	// update all matrix types
	// todo, are these being multiplied in the right order?
	filterKeysWithSuffix(graph, "matrix").forEach((key) => {
		graph[key] = graph[key]
			.map(m => multiplyMatrices3(m, matrix));
	});
	return graph;
};
/**
 * @name scale
 * @memberof graph
 * @description apply a uniform affine scale to a graph.
 * @param {FOLD} graph a FOLD object, modified in place
 * @param {number} scale the scale amount
 * @param {number[]} optional. an array or series of numbers, the center of scale.
 * @returns {FOLD} the same input graph, modified.
 * @linkcode Origami ./src/graph/affine.js 48
 */
const transform_scale = (graph, ...args) => {
	const scale = args.length === 1
		? [args[0], args[0], args[0]]
		: [1, 1, 1].map((n, i) => (args[i] === undefined ? n : args[i]));
	const matrix = makeMatrix3Scale(scale);
	return apply_matrix_to_graph(graph, matrix);
};
/**
 * @name translate
 * @memberof graph
 * @description apply a translation to a graph.
 * @param {FOLD} graph a FOLD object, modified in place
 * @param {number[]} optional. an array or series of numbers, the translation vector
 * @returns {FOLD} the same input graph, modified
 * @linkcode Origami ./src/graph/affine.js 64
 */
const transform_translate = (graph, ...args) => {
	const vector = getVector(...args);
	const vector3 = resize(3, vector);
	const matrix = makeMatrix3Translate(...vector3);
	return apply_matrix_to_graph(graph, matrix);
};
/**
 * @name rotateZ
 * @memberof graph
 * @description apply a rotation to a graph around the +Z axis.
 * @param {FOLD} graph a FOLD object, modified in place
 * @param {number} the rotation amount in radians
 * @param {number[]} optional. an array or series of numbers, the center of rotation
 * @returns {FOLD} the same input graph, modified
 * @linkcode Origami ./src/graph/affine.js 80
 */
const transform_rotateZ = (graph, angle, ...args) => {
	const vector = getVector(...args);
	const vector3 = resize(3, vector);
	const matrix = makeMatrix3RotateZ(angle, ...vector3);
	return apply_matrix_to_graph(graph, matrix);
};
/**
 * @description alter the vertices by moving the corner of the graph
 * to the origin and shrink or expand the vertices until they
 * aspect fit inside the unit square.
 * @param {FOLD} graph a FOLD object, modified in place
 * @returns {FOLD} the same input graph, modified
 */
const unitize = function (graph) {
	if (!graph.vertices_coords) { return graph; }
	const box = boundingBox(graph.vertices_coords);
	const longest = Math.max(...box.span);
	const scale = longest === 0 ? 1 : (1 / longest);
	const origin = box.min;
	graph.vertices_coords = graph.vertices_coords
		.map(coord => subtract(coord, origin))
		.map(coord => coord.map(n => n * scale));
	return graph;
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
	unitize,
};
