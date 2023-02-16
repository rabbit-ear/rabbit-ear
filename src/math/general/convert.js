/* Math (c) Kraft, MIT License */
import { getArrayOfVectors } from './get.js';
import { subtract, magnitude, rotate90, dot, scale, rotate270 } from '../algebra/vectors.js';

/**
 * Math (c) Kraft
 */
/**
 * @description Convert a 2D vector to an angle in radians.
 * @param {number[]} v an input vector
 * @returns {number} the angle in radians
 * @linkcode Math ./src/algebra/functions.js 56
 */
const vectorToAngle = v => Math.atan2(v[1], v[0]);
/**
 * @description Convert an angle in radians to a 2D vector.
 * @param {number} a the angle in radians
 * @returns {number[]} a 2D vector
 * @linkcode Math ./src/algebra/functions.js 63
 */
const angleToVector = a => [Math.cos(a), Math.sin(a)];
/**
 * @description Given two points, create a vector-origin line representation
 * of a line that passes through both points. This will work in n-dimensions.
 * If there are more than two points, the rest will be ignored.
 * @param {number[][]} points two points, each point being an array of numbers.
 * @returns {RayLine} an object with "vector" and "origin".
 */
const pointsToLine = (...args) => {
	const points = getArrayOfVectors(...args);
	return {
		vector: subtract(points[1], points[0]),
		origin: points[0],
	};
};
/**
 * @description Convert a line from one parameterization into another.
 * Convert vector-origin where origin is a point on the line into
 * normal-distance form where distance the shortest length from the
 * origin to a point on the line.
 * @linkcode Math ./src/types/parameterize.js 34
 */
const rayLineToUniqueLine = ({ vector, origin }) => {
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
 * @linkcode Math ./src/types/parameterize.js 47
 */
const uniqueLineToRayLine = ({ normal, distance }) => ({
	vector: rotate270(normal),
	origin: scale(normal, distance),
});

export { angleToVector, pointsToLine, rayLineToUniqueLine, uniqueLineToRayLine, vectorToAngle };
