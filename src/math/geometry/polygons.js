/* Math (c) Kraft, MIT License */
import { TWO_PI, EPSILON } from '../general/constants.js';
import { fnAdd } from '../general/functions.js';
import { subtract, parallel } from '../algebra/vectors.js';

const angleArray = count => Array
	.from(Array(Math.floor(count)))
	.map((_, i) => TWO_PI * (i / count));
const anglesToVecs = (angles, radius) => angles
	.map(a => [radius * Math.cos(a), radius * Math.sin(a)]);
const makePolygonCircumradius = (sides = 3, radius = 1) => (
	anglesToVecs(angleArray(sides), radius)
);
const makePolygonCircumradiusSide = (sides = 3, radius = 1) => {
	const halfwedge = Math.PI / sides;
	const angles = angleArray(sides).map(a => a + halfwedge);
	return anglesToVecs(angles, radius);
};
const makePolygonInradius = (sides = 3, radius = 1) => (
	makePolygonCircumradius(sides, radius / Math.cos(Math.PI / sides)));
const makePolygonInradiusSide = (sides = 3, radius = 1) => (
	makePolygonCircumradiusSide(sides, radius / Math.cos(Math.PI / sides)));
const makePolygonSideLength = (sides = 3, length = 1) => (
	makePolygonCircumradius(sides, (length / 2) / Math.sin(Math.PI / sides)));
const makePolygonSideLengthSide = (sides = 3, length = 1) => (
	makePolygonCircumradiusSide(sides, (length / 2) / Math.sin(Math.PI / sides)));
const makePolygonNonCollinear = (polygon, epsilon = EPSILON) => {
	const edges_vector = polygon
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(pair => subtract(pair[1], pair[0]));
	const vertex_collinear = edges_vector
		.map((vector, i, arr) => [vector, arr[(i + arr.length - 1) % arr.length]])
		.map(pair => !parallel(pair[1], pair[0], epsilon));
	return polygon
		.filter((vertex, v) => vertex_collinear[v]);
};
const circumcircle = (a, b, c) => {
	const A = b[0] - a[0];
	const B = b[1] - a[1];
	const C = c[0] - a[0];
	const D = c[1] - a[1];
	const E = A * (a[0] + b[0]) + B * (a[1] + b[1]);
	const F = C * (a[0] + c[0]) + D * (a[1] + c[1]);
	const G = 2 * (A * (c[1] - b[1]) - B * (c[0] - b[0]));
	if (Math.abs(G) < EPSILON) {
		const minx = Math.min(a[0], b[0], c[0]);
		const miny = Math.min(a[1], b[1], c[1]);
		const dx = (Math.max(a[0], b[0], c[0]) - minx) * 0.5;
		const dy = (Math.max(a[1], b[1], c[1]) - miny) * 0.5;
		return {
			origin: [minx + dx, miny + dy],
			radius: Math.sqrt(dx * dx + dy * dy),
		};
	}
	const origin = [(D * E - B * F) / G, (A * F - C * E) / G];
	const dx = origin[0] - a[0];
	const dy = origin[1] - a[1];
	return {
		origin,
		radius: Math.sqrt(dx * dx + dy * dy),
	};
};
const signedArea = points => 0.5 * points
	.map((el, i, arr) => {
		const next = arr[(i + 1) % arr.length];
		return el[0] * next[1] - next[0] * el[1];
	}).reduce(fnAdd, 0);
const centroid = (points) => {
	const sixthArea = 1 / (6 * signedArea(points));
	return points.map((el, i, arr) => {
		const next = arr[(i + 1) % arr.length];
		const mag = el[0] * next[1] - next[0] * el[1];
		return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
	}).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
		.map(c => c * sixthArea);
};
const boundingBox = (points, padding = 0) => {
	if (!points || !points.length) { return undefined; }
	const min = Array(points[0].length).fill(Infinity);
	const max = Array(points[0].length).fill(-Infinity);
	points.forEach(point => point
		.forEach((c, i) => {
			if (c < min[i]) { min[i] = c - padding; }
			if (c > max[i]) { max[i] = c + padding; }
		}));
	const span = max.map((m, i) => m - min[i]);
	return { min, max, span };
};

export { boundingBox, centroid, circumcircle, makePolygonCircumradius, makePolygonCircumradiusSide, makePolygonInradius, makePolygonInradiusSide, makePolygonNonCollinear, makePolygonSideLength, makePolygonSideLengthSide, signedArea };
