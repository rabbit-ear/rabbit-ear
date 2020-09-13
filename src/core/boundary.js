// boundary detection, removal, cleanup

// import { get_isolated_vertices } from "./query";
import {
  make_vertices_edges,
  // make_vertex_pair_to_edge_map,
} from "./make";
// import remove from "./remove";

// export const bounding_rect = function ({ vertices_coords }) {
//   if (vertices_coords == null
//     || vertices_coords.length <= 0) {
//     return [0, 0, 0, 0];
//   }
//   const dimension = vertices_coords[0].length;
//   const min = Array(dimension).fill(Infinity);
//   const max = Array(dimension).fill(-Infinity);
//   vertices_coords.forEach(v => v.forEach((n, i) => {
//     if (n < min[i]) { min[i] = n; }
//     if (n > max[i]) { max[i] = n; }
//   }));
//   return (isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1])
//     ? [0, 0, 0, 0]
//     : [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
// };

/**
 * get the boundary face defined in vertices and edges by walking boundary
 * edges, defined by edges_assignment. no planar calculations
 */
export const get_boundary = ({ vertices_edges, edges_vertices, edges_assignment }) => {
  if (edges_assignment === undefined) {
    return { vertices: [], edges: [] };
  }
  if (!vertices_edges) {
    vertices_edges = make_vertices_edges({ edges_vertices });
  }
  const edges_vertices_b = edges_assignment
    .map(a => a === "B" || a === "b");
  const edge_walk = [];
  const vertex_walk = [];
  let edgeIndex = -1;
  for (let i = 0; i < edges_vertices_b.length; i += 1) {
    if (edges_vertices_b[i]) { edgeIndex = i; break; }
  }
  if (edgeIndex === -1) {
    return { vertices: [], edges: [] };
  }
  edges_vertices_b[edgeIndex] = false;
  edge_walk.push(edgeIndex);
  vertex_walk.push(edges_vertices[edgeIndex][0]);
  let nextVertex = edges_vertices[edgeIndex][1];
  while (vertex_walk[0] !== nextVertex) {
    vertex_walk.push(nextVertex);
    edgeIndex = vertices_edges[nextVertex]
      .filter(v => edges_vertices_b[v])
      .shift();
    if (edgeIndex === undefined) { return { vertices: [], edges: [] }; }
    if (edges_vertices[edgeIndex][0] === nextVertex) {
      [, nextVertex] = edges_vertices[edgeIndex];
    } else {
      [nextVertex] = edges_vertices[edgeIndex];
    }
    edges_vertices_b[edgeIndex] = false;
    edge_walk.push(edgeIndex);
  }
  return {
    vertices: vertex_walk,
    edges: edge_walk,
  };
};

// /**
//  * this removes all edges except for "B", boundary creases.
//  * rebuilds the face, and
//  * todo: removes a collinear vertex and merges the 2 boundary edges
//  */
// export const remove_non_boundary_edges = function (graph) {
//   const remove_indices = graph.edges_assignment
//     .map(a => !(a === "b" || a === "B"))
//     .map((a, i) => (a ? i : undefined))
//     .filter(a => a !== undefined);
//   const edge_map = remove(graph, "edges", remove_indices);
//   const face = get_boundary(graph);
//   graph.faces_edges = [face.edges];
//   graph.faces_vertices = [face.vertices];
//   remove(graph, "vertices", get_isolated_vertices(graph));
// };

// /**
//  * get the 2D boundary face defined in vertices and edges by walking boundary
//  * edges (in 2D!), with no regard to assignment. this will discover a boundary
//  * when before there was none.
//  *
//  * this requires a FOLD format graph with entries:
//  * - vertices_coords, vertices_vertices,
//  * - (edges_vertices) (maybe not this one...)
//  *
//  * call the method populate() to fill the necessary arrays.
//  */
// export const find_planar_boundary = function (graph) {
//   const edge_map = make_vertex_pair_to_edge_map(graph);
//   const edge_walk = [];
//   const vertex_walk = [];
//   const walk = {
//     vertices: vertex_walk,
//     edges: edge_walk,
//   };

//   let largestX = -Infinity;
//   let first_vertex_i = -1;
//   graph.vertices_coords.forEach((v, i) => {
//     if (v[0] > largestX) {
//       largestX = v[0];
//       first_vertex_i = i;
//     }
//   });

//   if (first_vertex_i === -1) { return walk; }
//   vertex_walk.push(first_vertex_i);
//   const first_vc = graph.vertices_coords[first_vertex_i];
//   const first_neighbors = graph.vertices_vertices[first_vertex_i];
//   // sort adjacent vertices by next most clockwise vertex;
//   const counter_clock_first_i = first_neighbors
//     .map(i => graph.vertices_coords[i])
//     .map(vc => [vc[0] - first_vc[0], vc[1] - first_vc[1]])
//     .map(vec => Math.atan2(vec[1], vec[0]))
//     .map(angle => (angle < 0 ? angle + Math.PI * 2 : angle))
//     .map((a, i) => ({ a, i }))
//     .sort((a, b) => a.a - b.a)
//     .shift()
//     .i;
//   const second_vertex_i = first_neighbors[counter_clock_first_i];
//   // find this edge that connects these 2 vertices
//   const first_edge_lookup = first_vertex_i < second_vertex_i
//     ? `${first_vertex_i} ${second_vertex_i}`
//     : `${second_vertex_i} ${first_vertex_i}`;
//   const first_edge = edge_map[first_edge_lookup];
//   // vertex_walk.push(second_vertex_i);
//   edge_walk.push(first_edge);

//   // now we begin the loop

//   // walking the graph, we look at 3 vertices at a time. in sequence:
//   // prev_vertex, this_vertex, next_vertex
//   let prev_vertex_i = first_vertex_i;
//   let this_vertex_i = second_vertex_i;
//   let protection = 0;
//   while (protection < 10000) {
//     const next_neighbors = graph.vertices_vertices[this_vertex_i];
//     const from_neighbor_i = next_neighbors.indexOf(prev_vertex_i);
//     const next_neighbor_i = (from_neighbor_i + 1) % next_neighbors.length;
//     const next_vertex_i = next_neighbors[next_neighbor_i];
//     const next_edge_lookup = this_vertex_i < next_vertex_i
//       ? `${this_vertex_i} ${next_vertex_i}`
//       : `${next_vertex_i} ${this_vertex_i}`;
//     const next_edge_i = edge_map[next_edge_lookup];
//     // exit loop condition
//     if (next_edge_i === edge_walk[0]) {
//       return walk;
//     }
//     vertex_walk.push(this_vertex_i);
//     edge_walk.push(next_edge_i);
//     prev_vertex_i = this_vertex_i;
//     this_vertex_i = next_vertex_i;
//     protection += 1;
//   }
//   console.warn("calculate boundary potentially entered infinite loop");
//   return walk;
// };
