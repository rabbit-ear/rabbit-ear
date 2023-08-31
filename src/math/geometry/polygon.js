/**
 * Math (c) Kraft
 */
import { EPSILON, TWO_PI } from "../general/constant.js";
import {
	cross2,
	scale2,
	add2,
	subtract,
	parallel,
} from "../algebra/vector.js";
/**
 * the radius parameter measures from the center to the midpoint of the edge
 * vertex-axis aligned
 * todo: also possible to parameterize the radius as the center to the points
 * todo: can be edge-aligned
 */
const angleArray = count => Array
	.from(Array(Math.floor(count)))
	.map((_, i) => TWO_PI * (i / count));

const anglesToVecs = (angles, radius) => angles
	.map(a => [radius * Math.cos(a), radius * Math.sin(a)]);
// a = 2r tan(π/n)
/**
 * @description Make a regular polygon from a circumradius,
 * the first point is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [circumradius=1] the polygon's circumradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 31
 */
export const makePolygonCircumradius = (sides = 3, circumradius = 1) => (
	anglesToVecs(angleArray(sides), circumradius)
);
/**
 * @description Make a regular polygon from a circumradius,
 * the middle of the first side is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [circumradius=1] the polygon's circumradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 42
 */
export const makePolygonCircumradiusSide = (sides = 3, circumradius = 1) => {
	const halfwedge = Math.PI / sides;
	const angles = angleArray(sides).map(a => a + halfwedge);
	return anglesToVecs(angles, circumradius);
};
/**
 * @description Make a regular polygon from a inradius,
 * the first point is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [inradius=1] the polygon's inradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 55
 */
export const makePolygonInradius = (sides = 3, inradius = 1) => (
	makePolygonCircumradius(sides, inradius / Math.cos(Math.PI / sides)));
/**
 * @description Make a regular polygon from a inradius,
 * the middle of the first side is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [inradius=1] the polygon's inradius
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 65
 */
export const makePolygonInradiusSide = (sides = 3, inradius = 1) => (
	makePolygonCircumradiusSide(sides, inradius / Math.cos(Math.PI / sides)));
/**
 * @description Make a regular polygon from a side length,
 * the first point is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [length=1] the polygon's side length
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 75
 */
export const makePolygonSideLength = (sides = 3, length = 1) => (
	makePolygonCircumradius(sides, (length / 2) / Math.sin(Math.PI / sides)));
/**
 * @description Make a regular polygon from a side length,
 * the middle of the first side is +X aligned.
 * @param {number} sides the number of sides in the polygon
 * @param {number} [length=1] the polygon's side length
 * @returns {number[][]} an array of points, each point as an arrays of numbers
 * @linkcode Math ./src/geometry/polygons.js 85
 */
export const makePolygonSideLengthSide = (sides = 3, length = 1) => (
	makePolygonCircumradiusSide(sides, (length / 2) / Math.sin(Math.PI / sides)));
/**
 * @description Remove any collinear vertices from a n-dimensional polygon.
 * @param {number[][]} polygon a polygon as an array of ordered points in array form
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} a copy of the polygon with collinear points removed
 * @linkcode Math ./src/geometry/polygons.js 94
 */
export const makePolygonNonCollinear = (polygon, epsilon = EPSILON) => {
	// index map [i] to [i, i+1]
	const edges_vector = polygon
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(pair => subtract(pair[1], pair[0]));
	// the vertex to be removed. true=valid, false=collinear.
	// ask if an edge is parallel to its predecessor, this way,
	// the edge index will match to the collinear vertex.
	const vertex_collinear = edges_vector
		.map((vector, i, arr) => [vector, arr[(i + arr.length - 1) % arr.length]])
		.map(pair => !parallel(pair[1], pair[0], epsilon));
	return polygon
		.filter((vertex, v) => vertex_collinear[v]);
};
/**
 * @description Calculates the circumcircle with a boundary that
 * lies on three points provided by the user.
 * @param {number[]} a one 2D point as an array of numbers
 * @param {number[]} b one 2D point as an array of numbers
 * @param {number[]} c one 2D point as an array of numbers
 * @returns {Circle} a circle in "radius" (number) "origin" (number[]) form
 * @linkcode Math ./src/geometry/polygons.js 117
 */
export const circumcircle = (a, b, c) => {
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
/**
 * @description Calculates the signed area of a polygon.
 * This requires the polygon be non-self-intersecting.
 * @param {number[][]} points an array of 2D points,
 * which are arrays of numbers
 * @returns {number} the area of the polygon
 * @example
 * var area = polygon.signedArea([ [1,2], [5,6], [7,0] ])
 * @linkcode Math ./src/geometry/polygons.js 152
 */
export const signedArea = points => 0.5 * points
	.map((el, i, arr) => [el, arr[(i + 1) % arr.length]])
	.map(pair => cross2(...pair))
	.reduce((a, b) => a + b, 0);
/**
 * @description Calculates the centroid or the center of mass of the polygon.
 * @param {number[][]} points an array of 2D points, which are arrays of numbers
 * @returns {number[]} one 2D point as an array of numbers
 * @example
 * var centroid = polygon.centroid([ [1,2], [8,9], [8,0] ])
 * @linkcode Math ./src/geometry/polygons.js 164
 */
export const centroid = (points) => {
	const sixthArea = 1 / (6 * signedArea(points));
	return points
		.map((el, i, arr) => [el, arr[(i + 1) % arr.length]])
		.map(pair => scale2(add2(...pair), cross2(...pair)))
		.reduce((a, b) => add2(a, b), [0, 0])
		.map(c => c * sixthArea);
};
/**
 * @description Make an axis-aligned bounding box that encloses a set of points.
 * the optional padding is used to make the bounding box inclusive / exclusive
 * by adding padding on all sides, or inset in the case of negative number.
 * (positive=inclusive boundary, negative=exclusive boundary)
 * @param {number[][]} points an array of unsorted points, in any dimension
 * @param {number} [padding=0] optionally add padding around the box
 * @returns {Box?} an object where "min" and "max" are two points and
 * "span" is the lengths. returns "undefined" if no points were provided.
 * @linkcode Math ./src/geometry/polygons.js 183
 */
export const boundingBox = (points, padding = 0) => {
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
