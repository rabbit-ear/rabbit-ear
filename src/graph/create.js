/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import populate from "./populate";
import Constructors from "../constructors";

// this square is unique, it's a unit square, between x and y, 0 and 1.
const make_polygon_vertices = i => (i === 4
  ? [[0, 0], [1, 0], [1, 1], [0, 1]]
  : math.core.make_regular_polygon(i, 0.5 / Math.sin(Math.PI / i)));

const Create = {};

const polygon_names = [ null, null, null, "triangle", "square", "pentagon", "hexagon", "heptagon", "octogon", "nonagon", "decagon", "hendecagon", "dodecagon"];

[0, 1, 2].forEach(i => { delete polygon_names[i]; });

// const create_init = graph => Constructors.graph(populate(graph));
const create_init = graph => populate(graph);

// these are all polygons centered at the origin with side-lengths 1.
polygon_names.forEach((name, i) => {
  const arr = Array.from(Array(i));
  Create[name] = () => create_init({
    vertices_coords: make_polygon_vertices(i),
    edges_vertices: arr.map((_, i) => [i, (i + 1) % arr.length]),
    edges_assignment: arr.map(() => "B"),
  });
});

Create.kite = () => create_init({
  vertices_coords: [[0,0], [Math.sqrt(2)-1,0], [1,0], [1,1-(Math.sqrt(2)-1)], [1,1], [0,1]],
  edges_vertices: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,1], [3,5], [5,2]],
  edges_assignment: ["B","B","B","B","B","B","V","V","F"],
});

export default Create;
