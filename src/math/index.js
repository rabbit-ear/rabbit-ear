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
 * @typedef VecLine
 * @type {{ vector: number[], origin: number[] }}
 * @description a line defined by a vector and a point along the line,
 * capable of representing a line in any dimension.
 * @property {number[]} vector - a vector describing the direction of the line
 * @property {number[]} origin - a point which the line passes through
 */
/**
 * @typedef UniqueLine
 * @type {{ normal: number[], distance: number }}
 * @description a 2D line defined by a unit normal vector and a value that
 * describes the shortest distance from the origin to a point on the line.
 * @property {number[]} normal - a unit vector that is normal to the line
 * @property {number} distance - the shortest distance
 * from the line to the origin
 */

/**
 * @typedef Box
 * @type {{ min: number[], max: number[], span?: number[] }}
 * @description an axis-aligned bounding box, capable of representing
 * a bounding box with any number of dimensions.
 * @property {number[]} min - the point representing the absolute minimum
 * for all axes.
 * @property {number[]} max - the point representing the absolute maximum
 * for all axes.
 */

/**
 * @typedef Circle
 * @type {{ radius: number, origin: number[] }}
 * @description a circle primitive in 2D
 * @property {number} radius - the radius of the circle
 * @property {number[]} origin - the center of the circle as an array of numbers
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
