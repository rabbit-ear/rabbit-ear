/**
 * Rabbit Ear (c) Robby Kraft
 */
import {
  make_vertices_edges,
} from "./make";
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
