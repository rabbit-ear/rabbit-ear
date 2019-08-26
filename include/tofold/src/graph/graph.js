/**
 * for fast backwards lookup, this builds a dictionary with keys as vertices
 * that compose an edge "6 11" always sorted smallest to largest, with a space.
 * the value is the index of the edge.
 */
export const make_vertex_pair_to_edge_map = function ({ edges_vertices }) {
  const map = {};
  edges_vertices
    .map(ev => ev.sort((a, b) => a - b).join(" "))
    .forEach((key, i) => { map[key] = i; });
  return map;
};

export const make_vertices_edges = function ({ edges_vertices }) {
  const vertices_edges = [];
  edges_vertices.forEach((ev, i) => ev
    .forEach((v) => {
      if (vertices_edges[v] === undefined) {
        vertices_edges[v] = [];
      }
      vertices_edges[v].push(i);
    }));
  return vertices_edges;
};

export const make_vertices_vertices = function (graph) {
  // const vertices_edges = make_vertices_edges(graph);
  const edges_vectors = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]))
    .map(verts => [verts[0][1] - verts[0][0], verts[1][1] - verts[1][0]]);
  console.log(edges_vectors);
  // todo...
};
