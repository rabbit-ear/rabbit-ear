import { make_vertices_edges } from "../graph/make";

export const maekawa_check = ({ vertices_edges, edges_vertices, edges_assignment }, vertex) => {
  if (!vertices_edges) {
    vertices_edges = make_vertices_edges({ edges_vertices });
  }
  const edges = vertices_edges[vertex];
};
