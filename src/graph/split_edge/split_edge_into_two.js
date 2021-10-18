import math from "../../math";
import {
  EDGES_ASSIGNMENT,
  EDGES_FOLDANGLE,
} from "../fold_keys";
/**
 * this does not modify the graph. it builds 2 objects with keys
 * { edges_vertices, edges_assignment, edges_foldAngle, edges_faces, edges_length }
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
  // copy over relevant data if it exists
  new_edges.forEach((edge, i) => {
    [EDGES_ASSIGNMENT, EDGES_FOLDANGLE]
      .filter(key => graph[key] !== undefined && graph[key][edge_index] !== undefined)
      .forEach(key => edge[key] = graph[key][edge_index]);
    if (graph.edges_faces && graph.edges_faces[edge_index] !== undefined) {
      edge.edges_faces = [...graph.edges_faces[edge_index]];
    }
    if (graph.edges_vector) {
      const verts = edge.edges_vertices.map(v => graph.vertices_coords[v]);
      edge.edges_vector = math.core.subtract(verts[1], verts[0]);
    }
    if (graph.edges_length) {
      const verts = edge.edges_vertices.map(v => graph.vertices_coords[v]);
      edge.edges_length = math.core.distance2(...verts)
    }
    // todo: this does not rebuild edges_edges
    // not sure if there is a way to do this.
  });
  return new_edges;
};

export default split_edge_into_two;
