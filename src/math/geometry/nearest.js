/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { clampLine, clampSegment } from '../general/functions.js';
import { smallestComparisonSearch } from '../general/search.js';
import { distance2, distance, resize, magSquared, subtract, dot, add, scale, normalize } from '../algebra/vectors.js';

const nearestPoint2 = (array_of_points, point) => {
	const index = smallestComparisonSearch(array_of_points, point, distance2);
	return index === undefined ? undefined : array_of_points[index];
};
const nearestPoint = (array_of_points, point) => {
	const index = smallestComparisonSearch(array_of_points, point, distance);
	return index === undefined ? undefined : array_of_points[index];
};
const nearestPointOnLine = (
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
	const d = clampFunc(dist, epsilon);
	return add(origin, scale(vector, d));
};
const nearestPointOnPolygon = (polygon, point) => polygon
	.map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p))
	.map((vector, i) => ({ vector, origin: polygon[i] }))
	.map(line => nearestPointOnLine(line, point, clampSegment))
	.map((p, edge) => ({ point: p, edge, distance: distance(p, point) }))
	.sort((a, b) => a.distance - b.distance)
	.shift();
const nearestPointOnCircle = ({ radius, origin }, point) => (
	add(origin, scale(normalize(subtract(point, origin)), radius)));

export { nearestPoint, nearestPoint2, nearestPointOnCircle, nearestPointOnLine, nearestPointOnPolygon };
