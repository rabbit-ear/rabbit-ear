/* Math (c) Kraft, MIT License */
import general from './general/index.js';
import algebra from './algebra/index.js';
import geometry from './geometry/index.js';
import intersectMethods from './intersect/index.js';

/**
 * Math (c) Kraft
 */
// import primitives from "./primitives/index.js";

/**
 * @typedef line
 * @type {object}
 * @description a line primitive
 * @property {number[]} vector a vector which represents the direction of the line
 * @property {number[]} origin a point which the line passes through
 */

/**
 * @typedef circle
 * @type {object}
 * @description a circle primitive
 * @property {number} radius
 * @property {number[]} origin by default this will be the origin [0, 0]
 */

/**
 * @description A small math library with a focus on linear algebra,
 * computational geometry, and computing the intersection of shapes.
 */
const math = {
	...general,
	...algebra,
	...geometry,
	...intersectMethods,
};

export { math as default };
