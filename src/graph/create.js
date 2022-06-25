/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import populate from "./populate";
/**
 * @description a set of constructors which make a new simple FOLD graph,
 * like a single-face boundary-only polygon, or a traditional origami base.
 * @returns {object} a populated FOLD object
 */
const Create = {};
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
// 	Create[name] = () => make_closed_polygon(math.core
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
Create.square = (scale = 1) =>
	make_closed_polygon(make_rect_vertices_coords(scale, scale));
/**
 * @description Create a new FOLD object which contains one rectangular face,
 * including vertices and boundary edges.
 * @param {number} [width=1] the width of the rectangle
 * @param {number} [height=1] the height of the rectangle
 * @returns {FOLD} a FOLD object
 */
Create.rectangle = (width = 1, height = 1) =>
	make_closed_polygon(make_rect_vertices_coords(width, height));
// Create.circle = (sides = 90) =>
// 	make_closed_polygon(math.core.makePolygon(sides));
// origami bases. todo: more
/**
 * @description Create a kite base FOLD object, in crease pattern form.
 * @returns {FOLD} a FOLD object
 */
Create.kite = () => populate({
	vertices_coords: [[0,0], [Math.sqrt(2)-1,0], [1,0], [1,1-(Math.sqrt(2)-1)], [1,1], [0,1]],
	edges_vertices: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,1], [3,5], [5,2]],
	edges_assignment: Array.from("BBBBBBVVF")
});

export default Create;
