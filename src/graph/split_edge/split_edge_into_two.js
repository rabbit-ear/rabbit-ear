import math from "../../math";
import * as S from "../../symbols/strings";
/**
 * @description this does not modify the graph. it builds 2 objects with:
 * { edges_vertices, edges_assignment, edges_foldAngle }
 * including external to the spec: { edges_length, edges_vector }
 * this does not rebuild edges_edges.
 * @param {object} FOLD object, modified in place
 * @param {number} the index of the edge that will be split by the new vertex
 * @param {number} the index of the new vertex
 * @returns {object[]} array of two edge objects, containing edge data as FOLD keys
 */
const split_edge_into_two = (graph, edge_index, new_vertex) => {
  const edge_vertices = graph.edges_vertices[edge_index];
  const new_edges = [
    { edges_vertices: [edge_vertices[0], new_vertex] },
    { edges_vertices: [new_vertex, edge_vertices[1]] },
  ];
  new_edges.forEach((edge, i) => [S.edges_assignment, S.edges_foldAngle]
    .filter(key => graph[key] && graph[key][edge_index] !== undefined)
    .forEach(key => { edge[key] = graph[key][edge_index]; }));
  // these are outside the spec values that are easy enough to calculate.
  // only update them if they exist!
  if (graph.vertices_coords && (graph.edges_length || graph.edges_vector)) {
    const coords = new_edges
      .map(edge => edge.edges_vertices
        .map(v => graph.vertices_coords[v]));
    if (graph.edges_vector) {
      new_edges.forEach((edge, i) => {
        edge.edges_vector = math.core.subtract(coords[i][1], coords[i][0]);
      });
    }
    if (graph.edges_length) {
      new_edges.forEach((edge, i) => {
        edge.edges_length = math.core.distance2(...coords[i]);
      });
    }
  }
  return new_edges;
};

export default split_edge_into_two;
