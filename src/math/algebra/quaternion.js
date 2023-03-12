/* Math (c) Kraft, MIT License */
import { cross3, dot, magnitude, normalize } from './vector.js';
import { multiplyMatrices4 } from './matrix4.js';

/**
 * Math (c) Kraft
 */
/**
 * @description Create a quaternion which represents a rotation from
 * one 3D vector to another. Quaternion encoded as 0:x, 1:y, 2:z, 3:w.
 * @param {number[]} u a 3D vector
 * @param {number[]} v a 3D vector
 * @returns {number[]} a quaternion representing a rotation
 */
const quaternionFromTwoVectors = (u, v) => {
	const w = cross3(u, v);
	const q = [w[0], w[1], w[2], dot(u, v)];
	q[3] += magnitude(q);
	return normalize(q);
};
/**
 * @description Create a 4x4 matrix from a quaternion,
 * the quaternion encoded as 0:x, 1:y, 2:z, 3:w.
 * @param {number[]} quaternion a quaternion
 * @returns {number[]} a 4x4 matrix (array of 16 numbers)
 */
const matrix4FromQuaternion = (quaternion) => multiplyMatrices4([
	quaternion[3], quaternion[2], -quaternion[1], quaternion[0],
	-quaternion[2], quaternion[3], quaternion[0], quaternion[1],
	quaternion[1], -quaternion[0], quaternion[3], quaternion[2],
	-quaternion[0], -quaternion[1], -quaternion[2], quaternion[3],
], [
	quaternion[3], quaternion[2], -quaternion[1], -quaternion[0],
	-quaternion[2], quaternion[3], quaternion[0], -quaternion[1],
	quaternion[1], -quaternion[0], quaternion[3], -quaternion[2],
	quaternion[0], quaternion[1], quaternion[2], quaternion[3],
]);

export { matrix4FromQuaternion, quaternionFromTwoVectors };
