/**
 * Math (c) Kraft
 */
import {
	normalize3,
	dot3,
	scale3,
	subtract3,
	resize,
} from "./vector.js";

/**
 * @description Project a point onto a plane in 3D.
 * @param {number[]} point a point as an array of numbers
 * @param {number[]} vector a vector that defines a plane's normal
 * @param {number[]} origin a point that the plane passes through
 * @returns {number[]} the transformed point
 */
export const projectPointOnPlane = (point, vector = [1, 0, 0], origin = [0, 0, 0]) => {
	const point3 = resize(3, point);
	const originToPoint = subtract3(point3, resize(3, origin));
	const normalized = normalize3(resize(3, vector));
	const magnitude = dot3(normalized, originToPoint);
	const planeToPoint = scale3(normalized, magnitude);
	return subtract3(point3, planeToPoint);
};
