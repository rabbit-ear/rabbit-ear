/**
 * Rabbit Ear (c) Kraft
 */
import { makePolygonCircumradius } from "../math/geometry/polygon.js";
import populate from "../graph/populate.js";

const make_rect_vertices_coords = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
/**
 * @description given an already initialized vertices_coords array,
 * create a fully-populated graph that sets these vertices to be
 * the closed boundary of a polygon.
 */
const make_closed_polygon = (vertices_coords) => populate({
	vertices_coords,
	edges_vertices: vertices_coords
		.map((_, i, arr) => [i, (i + 1) % arr.length]),
	edges_assignment: Array(vertices_coords.length).fill("B"),
});

// const polygon_names = [
// 	undefined,
// 	undefined,
// 	undefined,
// 	"triangle",
// 	undefined,
// 	"pentagon",
// 	"hexagon",
// 	"heptagon",
// 	"octagon",
// 	"nonagon",
// 	"decagon",
// 	"hendecagon",
// 	"dodecagon"
// ];
/**
 * create an array/object with only the keys and polygon names used below.
 */
// polygon_names
// 	.map((str, i) => str === undefined ? i : undefined)
// 	.filter(a => a !== undefined)
// 	.forEach(i => delete polygon_names[i]);
/**
 * fill the "Create" object with constructors under polygon-named keys.
 */
/**
 * @description make vertices_coords for a regular polygon,
 * centered at the origin and with side lengths of 1,
 * except for square, centered at [0.5, 0.5]
 * @param {number} number of sides of the desired regular polygon
 * @returns {number[][]} 2D vertices_coords, vertices of the polygon
 */
// polygon_names.forEach((name, i) => {
// 	Create[name] = () => make_closed_polygon(math
// 		.makePolygonSideLength(i));
// });
/**
 * special cases
 *
 * square and rectangle are axis-aligned with one vertex at (0, 0)
 * circle asks for # of sides, and also sets radius to be 1,
 *  instead of side-length to be 1.
 */
/**
 * @description Create a new FOLD object which contains one square face,
 * including vertices and boundary edges.
 * @param {number} [scale=1] the length of the sides.
 * @returns {FOLD} a FOLD object
 */
export const square = (scale = 1) => (
	make_closed_polygon(make_rect_vertices_coords(scale, scale)));
/**
 * @description Create a new FOLD object which contains one rectangular face,
 * including vertices and boundary edges.
 * @param {number} [width=1] the width of the rectangle
 * @param {number} [height=1] the height of the rectangle
 * @returns {FOLD} a FOLD object
 */
export const rectangle = (width = 1, height = 1) => (
	make_closed_polygon(make_rect_vertices_coords(width, height)));
/**
 * @description Create a new FOLD object with a regular-polygon shaped boundary.
 * @param {number} [sides=3] the number of sides to the polygon
 * @param {number} [circumradius=1] the circumradius of the polygon (the
 * distance from the center to any vertex)
 * @returns {FOLD} a FOLD object
 */
export const polygon = (sides = 3, circumradius = 1) => (
	make_closed_polygon(makePolygonCircumradius(sides, circumradius)));
/**
 * @description Create a kite base FOLD object in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
export const kite = () => populate({
	vertices_coords: [
		[0, 0], [1, 0], [1, Math.SQRT2 - 1], [1, 1], [Math.SQRT2 - 1, 1], [0, 1],
	],
	edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 2], [0, 4], [0, 3]],
	edges_assignment: Array.from("BBBBBBVVF"),
});
/**
 * @description Create a fish base FOLD object in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
export const fish = () => populate({
	vertices_coords: [
		[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.5], [1 - Math.SQRT1_2, Math.SQRT1_2],
		[Math.SQRT1_2, 1 - Math.SQRT1_2], [1, 1 - Math.SQRT1_2],
		[1 - Math.SQRT1_2, 1], [Math.SQRT1_2, 0], [0, Math.SQRT1_2],
	],
	edges_vertices: [
		[0, 4], [4, 2], [4, 5], [5, 3], [0, 5], [1, 6], [6, 4], [0, 6],
		[2, 5], [2, 6], [1, 7], [7, 2], [6, 7], [2, 8], [8, 3], [5, 8],
		[0, 9], [9, 1], [6, 9], [3, 10], [10, 0], [5, 10],
	],
	edges_assignment: Array.from("FFFVVVFVVVBBFBBFBBMBBM"),
});
