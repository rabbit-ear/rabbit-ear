/**
 * Rabbit Ear (c) Kraft
 */
import {
	magnitude,
	dot,
	scale,
	subtract,
	rotate90,
	rotate270,
} from "./vector.js";

/**
 * @description Convert a 2D vector to an angle in radians.
 * @param {[number, number]} v a 2D vector
 * @returns {number} the angle in radians
 */
export const vectorToAngle = (v) => Math.atan2(v[1], v[0]);

/**
 * @description Convert an angle in radians to a 2D vector.
 * @param {number} a the angle in radians
 * @returns {[number, number]} a 2D vector
 */
export const angleToVector = (a) => [Math.cos(a), Math.sin(a)];

/**
 * @description Given two points, create a vector-origin line representation
 * of a line that passes through both points. This will work in n-dimensions.
 * If there are more than two points, the rest will be ignored.
 * @param {number[]} origin one point, itself an array of numbers
 * @param {number[]} point2 one point, itself an array of numbers
 * @returns {VecLine} an object with "vector" and "origin".
 */
export const pointsToLine = (origin, point2) => ({
	vector: subtract(point2, origin),
	origin,
});

/**
 * @description Convert a line from one parameterization into another.
 * Convert vector-origin where origin is a point on the line into
 * normal-distance form where distance the shortest length from the
 * origin to a point on the line.
 * @param {VecLine} line a line in vector origin form
 * @param {UniqueLine} line a line in normal distance form
 */
export const vecLineToUniqueLine = ({ vector, origin }) => {
	const mag = magnitude(vector);
	const normal = rotate90(vector);
	const distance = dot(origin, normal) / mag;
	return { normal: scale(normal, 1 / mag), distance };
};

/**
 * @description Convert a line from one parameterization into another.
 * Convert from normal-distance form where distance the shortest length
 * from the origin to a point on the line, to vector-origin where origin
 * is a point on the line.
 * @param {UniqueLine} line a line in normal distance form
 * @returns {VecLine} line a line in vector origin form
 */
export const uniqueLineToVecLine = ({ normal, distance }) => ({
	vector: rotate270(normal),
	origin: scale(normal, distance),
});
