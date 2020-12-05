/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../include/math";
import split_convex_polygon from "../core/split_face";
import { make_vertices_edges } from "../core/make";

const make_vertices_isBoundary = ({ edges_vertices, vertices_edges, edges_assignment }) => {
  if (!vertices_edges) {
    vertices_edges = make_vertices_edges({ edges_vertices });
  }
  const edges_isBoundary = edges_assignment
    .map(a => a === "b" || a === "B");
  return vertices_edges
    .map(edges => edges
      .map(edge => edges_isBoundary[edge])
      .reduce((a, b) => a || b, false));
};

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
    .map((v, i, arr) => math.core
      .counter_clockwise_angle2(arr[i], arr[(i + 1) % arr.length]));
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
    .map((_, i) => (vertices_isBoundary[i]
      ? [0, 0]
      : vertex_kawasaki_flatness(graph, i)));
  return vertices_flatness;
};

export const make_vertices_nudge_matrix = function (graph) {
  const arrayVerticesLength = Array.from(Array(graph.vertices_coords.length));
  const vertices_flatness = make_vertices_kawasaki(graph);
  const { vertices_vertices } = graph;
  const vertices_adjVecs = arrayVerticesLength
    .map((_, i) => vertex_adjacent_vectors(graph, i));
  const vertices_nudge_matrix = arrayVerticesLength.map(() => []);
  vertices_flatness.forEach((flatness, i) => {
    if (flatness[0] === 0) { return; }
    vertices_vertices[i].forEach((vv, vvi) => {
      // const vec = math.core.normalize(vertices_adjVecs[i][vvi]);
      // now side lengths no longer factor in equation
      // todo: i guessed at these 90 degree turn directions. check it
      vertices_nudge_matrix[i][vv] = [
        -vertices_adjVecs[i][vvi][1] * flatness[vvi % 2],
        vertices_adjVecs[i][vvi][0] * flatness[vvi % 2]
      ];
    });
  });
  return vertices_nudge_matrix;
};

export const kawasaki_test = function (graph, EPSILON = math.core.EPSILON) {
  if (graph.vertices_coords == null) { return false; } // false ? true ?
  if (graph.vertices_vertices == null) {
    // build vertices_vertices

  }
  return make_vertices_kawasaki(graph)
    .map(k => k
      .map(n => Math.abs(n) < EPSILON)
      .reduce((a, b) => a && b, true))
    .reduce((a, b) => a && b, true);
};


export const make_vertices_nudge = function (graph) {
  const matrix = make_vertices_nudge_matrix(graph);
  // const matrix_normalized = matrix
  //   .map(list => list.map(b => math.core.normalize(b)));
  // const vectorSum = matrix
  //   .map(list => list.reduce((a, b) => [a[0] + b[0], a[1] + b[1]]));
  const largestMagnitude = matrix
    .map(list => list.reduce((prev, b) => {
      const magnitude = b.length === 0 ? 0 : math.core.magnitude(b);
      return prev > magnitude ? prev : magnitude;
    }, 0));
  // todo, these are normalized to the largest of the vertices_vertices.
  // consider making each of these normalized globally.
  // each row is normalized
  const matrix_row_normalized = matrix
    .map((list, i) => list
      .map(el => math.core.magnitude(el) / largestMagnitude[i]));
  // values are inverted around 1
  const matrix_inverted = matrix_row_normalized.map(a => a.map(b => 1 / b));

  const matrix_weighted = matrix
    .map((row, i) => row
      .map((vec, j) => vec.map(n => n * matrix_inverted[i][j])));

  const vertices_nudge = matrix_weighted
    .map(row => row.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]));

  return vertices_nudge;
};


/**
 * this section regards using kawasaki's theorem to give solutions to
 * currently incomplete arrangements
 */

/**
 *
 *
 */
// export const kawasaki_solutions_radians = function (...vectors_radians) {
export const kawasaki_solutions_radians = function (vectors_radians) {
  return vectors_radians
    .map((v, i, ar) => math.core.counter_clockwise_angle_radians(
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
