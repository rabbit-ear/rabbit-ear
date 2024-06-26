/**
 * Rabbit Ear (c) Kraft
 */
import {
	normalize3,
	dot3,
	scale3,
	subtract3,
	resize3,
} from "./vector.js";

/**
 * @description Project a point onto a plane in 3D.
 * @param {[number, number] | [number, number, number]} point a point as an array of numbers
 * @param {[number, number, number]} [vector=[1, 0, 0]] a vector that defines a plane's normal
 * @param {[number, number, number]} [origin=[0, 0, 0]] a point that the plane passes through
 * @returns {[number, number, number]} the transformed point
 */
export const projectPointOnPlane = (point, vector = [1, 0, 0], origin = [0, 0, 0]) => {
	const point3 = resize3(point);
	const originToPoint = subtract3(point3, resize3(origin));
	const normalized = normalize3(resize3(vector));
	const magnitude = dot3(normalized, originToPoint);
	const planeToPoint = scale3(normalized, magnitude);
	return subtract3(point3, planeToPoint);
};
