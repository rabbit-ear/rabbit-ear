/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constant.js";
import {
	clampLine,
	clampSegment,
} from "../general/function.js";
import { smallestComparisonSearch } from "../general/search.js";
import {
	magSquared,
	distance,
	distance2,
	add,
	subtract,
	normalize,
	dot,
	scale,
	resize,
} from "../algebra/vector.js";
/**
 * @description find the one point in an array of 2D points closest to a 2D point.
 * @param {number[][]} array_of_points an array of 2D points to test against
 * @param {number[]} point the 2D point to test nearness to
 * @returns {number[]} one point from the array of points
 * @linkcode Math ./src/geometry/nearest.js 26
 */
export const nearestPoint2 = (array_of_points, point) => {
	// todo speed up with partitioning
	const index = smallestComparisonSearch(array_of_points, point, distance2);
	return index === undefined ? undefined : array_of_points[index];
};
/**
 * @description find the one point in an array of points closest to a point.
 * @param {number[][]} array_of_points an array of points to test against
 * @param {number[]} point the point to test nearness to
 * @returns {number[]} one point from the array of points
 * @linkcode Math ./src/geometry/nearest.js 38
 */
export const nearestPoint = (array_of_points, point) => {
	// todo speed up with partitioning
	const index = smallestComparisonSearch(array_of_points, point, distance);
	return index === undefined ? undefined : array_of_points[index];
};
/**
 * @description find the nearest point on a line, ray, or segment.
 * @param {number[]} vector the vector of the line
 * @param {number[]} origin a point that the line passes through
 * @param {number[]} point the point to test nearness to
 * @param {function} limiterFunc a clamp function to bound a calculation between 0 and 1
 * for segments, greater than 0 for rays, or unbounded for lines.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[]} a point
 * @linkcode Math ./src/geometry/nearest.js 54
 */
export const nearestPointOnLine = (
	{ vector, origin },
	point,
	clampFunc = clampLine,
	epsilon = EPSILON,
) => {
	origin = resize(vector.length, origin);
	point = resize(vector.length, point);
	const magSq = magSquared(vector);
	const vectorToPoint = subtract(point, origin);
	const dotProd = dot(vector, vectorToPoint);
	const dist = dotProd / magSq;
	// clamp depending on line, ray, segment
	const d = clampFunc(dist, epsilon);
	return add(origin, scale(vector, d));
};
/**
 * @description given a polygon and a point, in 2D, find a point on the boundary of the polygon
 * that is closest to the provided point.
 * @param {number[][]} polygon an array of points (which are arrays of numbers)
 * @param {number[]} point the point to test nearness to
 * @returns {number[]} a point
 * edge index matches vertices such that edge(N) = [vert(N), vert(N + 1)]
 * @linkcode Math ./src/geometry/nearest.js 79
 */
export const nearestPointOnPolygon = (polygon, point) => polygon
	.map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p))
	.map((vector, i) => ({ vector, origin: polygon[i] }))
	.map(line => nearestPointOnLine(line, point, clampSegment))
	.map((p, edge) => ({ point: p, edge, distance: distance(p, point) }))
	.sort((a, b) => a.distance - b.distance)
	.shift();
/**
 * @description find the nearest point on the boundary of a circle to another point
 * that is closest to the provided point.
 * @param {Circle} circle object with "radius" (number) and "origin" (number[])
 * @param {number[]} origin the origin of the circle as an array of numbers.
 * @param {number[]} point the point to test nearness to
 * @returns {number[]} a point
 * @linkcode Math ./src/geometry/nearest.js 95
 */
export const nearestPointOnCircle = ({ radius, origin }, point) => (
	add(origin, scale(normalize(subtract(point, origin)), radius))
);

// todo
// const nearestPointOnEllipse = () => false;
