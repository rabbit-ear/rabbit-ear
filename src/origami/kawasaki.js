import math from "../../include/math";
import split_convex_polygon from "../fold/split_face";
import { make_vertices_isBoundary } from "../fold/make";

/**
 * two varieties: vectors, radians, with a very important difference!:
 *
 * 1. the vectors describe the direction of the edge (length doesn't matter)
 * 2. the angles in radians are the INTERIOR ANGLES between the edges, not
 * the radians form of the vectors in case 1.
 *
 * case 2. is generally the faster way, vectors have to be turned into interior
 * angles.
 */

/**
 * provide a list of numbers and this will split them into even and odd and
 * sum each of the pairs of lists
 * @returns {[number, number]} two sums, corresponding to even, odd
 */
export const alternating_sum = function (...numbers) {
  return [0, 1].map(even_odd => numbers
    .filter((_, i) => i % 2 === even_odd)
    .reduce((a, b) => a + b, 0));
};

/**
 * for a flat foldable
 */
export const kawasaki_flatness = function (...sectorAngles) {
  return alternating_sum(...sectorAngles)
    .map(a => (a < 0 ? a + Math.PI * 2 : a))
    .map(a => Math.PI - a)
    .map(n => math.core.clean_number(n, 14));
};

export const vertex_adjacent_vectors = function (graph, vertex) {
  return graph.vertices_vertices[vertex].map(v => [
    graph.vertices_coords[v][0] - graph.vertices_coords[vertex][0],
    graph.vertices_coords[v][1] - graph.vertices_coords[vertex][1]
  ]);
};

export const vertex_sectorAngles = function (graph, vertex) {
  return vertex_adjacent_vectors(graph, vertex)
    .map((v, i, arr) => math.core.counter_clockwise_angle2(arr[i], arr[(i + 1) % arr.length]));
};

export const vertex_kawasaki_flatness = function (graph, vertex) {
  return kawasaki_flatness(...vertex_sectorAngles(graph, vertex));
};

export const make_vertices_sectorAngles = function (graph) {
  return Array.from(Array(graph.vertices_coords.length))
    .map((_, i) => vertex_sectorAngles(graph, i));
};

export const make_vertices_kawasaki_flatness = function (graph) {
  return Array.from(Array(graph.vertices_coords.length))
    .map((_, i) => vertex_kawasaki_flatness(graph, i));
};

export const make_vertices_kawasaki = function (graph) {
  const vertices_isBoundary = make_vertices_isBoundary(graph);
  const vertices_flatness = Array.from(Array(graph.vertices_coords.length))
    .map((v, i) => vertices_isBoundary[i]
      ? [0, 0]
      : vertex_kawasaki_flatness(graph, i));
  
};

export const make_vertices_nudge_matrix = function (graph) {

};


/**
 * this section regards using kawasaki's theorem to give solutions to
 * currently incomplete arrangements
 */

/**
 *
 *
 */
export const kawasaki_solutions_radians = function (...vectors_radians) {
  return vectors_radians
    .map((v, i, ar) => math.core.counter_clockwise_angle2_radians(
      v, ar[(i + 1) % ar.length]
    ))
    // for every sector, make an array of all the OTHER sectors
    .map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
    // for every sector, use the sector score from the OTHERS two to split it
    .map(opposite_sectors => kawasaki_flatness(...opposite_sectors))
    .map((kawasakis, i) => vectors_radians[i] + kawasakis[0])
    .map((angle, i) => (math.core.is_counter_clockwise_between(angle,
      vectors_radians[i], vectors_radians[(i + 1) % vectors_radians.length])
      ? angle
      : undefined));
  // or should we remove the indices so the array reports [ empty x2, ...]
  // solutions.forEach((angle, i) => {
  //   if (math.core.is_counter_clockwise_between(angle,
  //     vectors_radians[i],
  //     vectors_radians[(i + 1) % vectors_radians.length])) {
  //     delete solutions[i];
  //   }
  // });
  // return solutions;
};

export const kawasaki_solutions = function (...vectors) {
  const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
  return kawasaki_solutions_radians(...vectors_radians)
    .map(a => (a === undefined
      ? undefined
      : [math.core.clean_number(Math.cos(a), 14), math.core.clean_number(Math.sin(a), 14)]));
};

export function kawasaki_collapse(graph, vertex, face, crease_direction = "F") {
  const kawasakis = kawasaki_solutions(graph, vertex);
  const origin = graph.vertices_coords[vertex];
  split_convex_polygon(graph, face, origin, kawasakis[face], crease_direction);
}


// /////////////////////////////
//
//   build a kawasaki frame
//
// /////////////////////////////

// export const make_vertices_sectorAngles = function (graph) {
//   const vertexLength = graph.vertices_coords.length;
//   const vertices_adjacentVectors = Array.from(Array(vertexLength))
//     .map((_, i) => vertex_adjacent_vectors(graph, i));
//   vertices_adjacentVectors
//     .map((v, i, arr) => math.core.counter_clockwise_angle2(arr[i], arr[(i + 1) % arr.length]));

//   return vertices_adjacentAngles
//     .map(angles => kawasaki_flatness(...angles));
// };

// export function kawasaki_solutions(graph, vertex) {
//   return math.core.kawasaki_solutions(...vertex_adjacent_vectors(graph, vertex));
// }

// const kawasaki = function (graph, vertex) {
//   // if there is a vertices_vertices, the edges and adjacent vertices
//   // will be arranged in that order.
//   const kawasakis = kawasaki_solutions(graph, vertex);
//   return kawasakis;
// };

// export default kawasaki;
