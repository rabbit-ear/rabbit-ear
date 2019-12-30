
export const find_isolated_vertices = function (graph) {
  let count = graph.vertices_coords.length;
  const seen = Array(count).fill(false);
  graph.edges_vertices.forEach((ev) => {
    ev.filter(v => !seen[v]).forEach((v) => {
      seen[v] = true;
      count -= 1;
    });
  });
  return seen
    .map((s, i) => (s ? undefined : i))
    .filter(a => a !== undefined);
};
