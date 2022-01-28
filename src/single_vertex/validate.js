/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import {
  make_vertices_vertices,
  make_vertices_edges,
  make_vertices_sectors,
} from "../graph/make";
import { get_boundary_vertices } from "../graph/boundary";
import { alternating_sum } from "./kawasaki_math";

const maekawa_add = { M:-1, m:-1, V:1, v:1};
/**
 * @description these methods will check the entire graph and return
 * indices of vertices which have issues.
 */
export const validate_maekawa = ({ edges_vertices, vertices_edges, edges_assignment }) => {
  if (!vertices_edges) {
    vertices_edges = make_vertices_edges({ edges_vertices });
  }
  const vertices_is_boundary = Array(vertices_edges.length).fill(false);
  get_boundary_vertices({ edges_vertices, edges_assignment })
    .forEach(v => { vertices_is_boundary[v] = true; });
  const is_valid = vertices_edges
    .map(edges => edges
      .map(e => maekawa_add[edges_assignment[e]])
      .reduce((a, b) => a + b, 0))
    .map((sum, e) => vertices_is_boundary[e] || sum === 2 || sum === -2);
  return is_valid
    .map((valid, v) => !valid ? v : undefined)
    .filter(a => a !== undefined);
};

export const validate_kawasaki = ({ vertices_coords, vertices_vertices, vertices_edges, edges_vertices, edges_assignment, edges_vector }, epsilon = math.core.EPSILON) => {
  if (!vertices_vertices) {
    vertices_vertices = make_vertices_vertices({ vertices_coords, vertices_edges, edges_vertices });
  }
  const vertices_is_boundary = Array(vertices_coords.length).fill(false);
  get_boundary_vertices({ edges_vertices, edges_assignment })
    .forEach(v => { vertices_is_boundary[v] = true; });
  const is_valid = make_vertices_sectors({ vertices_coords, vertices_vertices, edges_vertices, edges_vector })
    .map(sectors => alternating_sum(sectors))
    .map((pair, v) => vertices_is_boundary[v] || Math.abs(pair[0] - pair[1]) < epsilon);
  return is_valid
    .map((valid, v) => !valid ? v : undefined)
    .filter(a => a !== undefined);
};
