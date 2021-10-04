/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import populate from "./populate";
/**
 * @description a set of constructors which make a new simple FOLD graph,
 * like a single-face boundary-only polygon, or a traditional origami base.
 * @returns {object} a populated FOLD object
 */
const Create = {};
/**
 * @description make vertices_coords for a regular polygon,
 * centered at the origin and with side lengths of 1,
 * except for a square (unit square), centered at [0.5, 0.5]
 * @param {number} number of sides of the desired regular polygon
 * @returns {number[][]} 2D vertices_coords, vertices of the polygon
 */
const make_polygon_vertices = i => (i === 4
  ? [[0, 0], [1, 0], [1, 1], [0, 1]]
  : math.core.make_regular_polygon(i, 0.5 / Math.sin(Math.PI / i)));

const polygon_names = [
  null,
  null,
  null,
  "triangle",
  "square",
  "pentagon",
  "hexagon",
  "heptagon",
  "octogon",
  "nonagon",
  "decagon",
  "hendecagon",
  "dodecagon"
];
// "circle" is, of course, the regular polygon with 90 sides.
polygon_names[90] = "circle";

[0, 1, 2].forEach(i => { delete polygon_names[i]; });

const create_init = graph => populate(graph);

// for every polygon_names, make a constructor on the default export
polygon_names.forEach((name, i) => {
  Create[name] = () => create_init({
    vertices_coords: make_polygon_vertices(i),
    edges_vertices: Array.from(Array(i)).map((_, i, arr) => [i, (i + 1) % arr.length]),
    edges_assignment: Array(i).fill("B"),
  });
});

// the special case for rectangle
Create.rectangle = (width = 1, height = 1) => create_init({
	vertices_coords: [[0, 0], [0, width], [width, height], [0, height]],
	edges_vertices: Array.from(Array(4)).map((_, i, arr) => [i, (i + 1) % arr.length]),
	edges_assignment: Array(4).fill("B"),
});

// origami bases
// todo: more
Create.kite = () => create_init({
  vertices_coords: [[0,0], [Math.sqrt(2)-1,0], [1,0], [1,1-(Math.sqrt(2)-1)], [1,1], [0,1]],
  edges_vertices: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,1], [3,5], [5,2]],
  edges_assignment: "BBBBBBVVF".split("")
});

export default Create;
