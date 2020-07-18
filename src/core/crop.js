import { make_vertices_edges } from "./make";
import remove from "./remove";

const crop = (graph, polygon) => {
  const vertices_edges = make_vertices_edges(graph);
  const vertices = graph.vertices_coords.map(vc => polygon.contains(vc));
  const crop_edges = Array.from(Array(graph.edges_vertices.length))
    .map(() => false);
  vertices
    .map((vert, i) => (vert ? undefined : i))
    .filter(a => a !== undefined)
    .forEach(i => vertices_edges[i]
      .forEach((edge) => { crop_edges[edge] = true; }));
  const remove_edges = crop_edges
    .map((a, i) => (a ? i : undefined))
    .filter(a => a !== undefined);
  remove(graph, "edges", remove_edges);
};

export default crop;
