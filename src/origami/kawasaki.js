import math from "../../include/math";
import split_convex_polygon from "../graph/split_face";

let vertex_adjacent_vectors = function(graph, vertex) {
  let adjacent = graph.vertices_vertices[vertex];
  return adjacent.map(v => [
    graph.vertices_coords[v][0] - graph.vertices_coords[vertex][0],
    graph.vertices_coords[v][1] - graph.vertices_coords[vertex][1]
  ]);
}

function kawasaki_from_even(array) {
  let even_sum = array.filter((_,i) => i%2 === 0).reduce((a,b) => a+b, 0);
  let odd_sum = array.filter((_,i) => i%2 === 1).reduce((a,b) => a+b, 0);
  // if (even_sum > Math.PI) { return undefined; }
  return [Math.PI - even_sum, Math.PI - odd_sum];
}

export function kawasaki_solutions(graph, vertex) {
  let vectors = vertex_adjacent_vectors(graph, vertex);
  let vectors_as_angles = vectors.map(v => Math.atan2(v[1], v[0]));
  // get the interior angles of sectors around a vertex
  return vectors.map((v,i,arr) => {
    let nextV = arr[(i+1)%arr.length];
    return math.core.counter_clockwise_angle2(v, nextV);
  }).map((_, i, arr) => {
    // for every sector, get an array of all the OTHER sectors
    let a = arr.slice();
    a.splice(i,1);
    return a;
  }).map(a => kawasaki_from_even(a))
  .map((kawasakis, i, arr) =>
    // change these relative angle solutions to absolute angles
    (kawasakis == null
      ? undefined
      : vectors_as_angles[i] + kawasakis[1])
  ).map(k => (k === undefined)
    // convert to vectors
    ? undefined
    : [Math.cos(k), Math.sin(k)]
  );
}

export function kawasaki_collapse(graph, vertex, face, crease_direction = "F") {
  let kawasakis = kawasaki_solutions(graph, vertex);
  let origin = graph.vertices_coords[vertex];
  split_convex_polygon(graph, face, origin, kawasakis[face], crease_direction);
}
