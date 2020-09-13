export const get_edge_isolated_vertices = function (graph) {
  if (!graph.vertices_coords) { return []; }
  let count = graph.vertices_coords.length;
  const seen = Array(count).fill(false);
  if (graph.edges_vertices) {
    graph.edges_vertices.forEach((ev) => {
      ev.filter(v => !seen[v]).forEach((v) => {
        seen[v] = true;
        count -= 1;
      });
    });
  }
  return seen
    .map((s, i) => (s ? undefined : i))
    .filter(a => a !== undefined);
};

export const get_face_isolated_vertices = function (graph) {
  if (!graph.vertices_coords) { return []; }
  let count = graph.vertices_coords.length;
  const seen = Array(count).fill(false);
  if (graph.faces_vertices) {
    graph.faces_vertices.forEach((fv) => {
      fv.filter(v => !seen[v]).forEach((v) => {
        seen[v] = true;
        count -= 1;
      });
    });
  }
  return seen
    .map((s, i) => (s ? undefined : i))
    .filter(a => a !== undefined);
};

export const get_isolated_vertices = function (graph) {
  if (!graph.vertices_coords) { return []; }
  let count = graph.vertices_coords.length;
  const seen = Array(count).fill(false);
  if (graph.edges_vertices) {
    graph.edges_vertices.forEach((ev) => {
      ev.filter(v => !seen[v]).forEach((v) => {
        seen[v] = true;
        count -= 1;
      });
    });
  }
  if (graph.faces_vertices) {
    graph.faces_vertices.forEach((fv) => {
      fv.filter(v => !seen[v]).forEach((v) => {
        seen[v] = true;
        count -= 1;
      });
    });
  }
  return seen
    .map((s, i) => (s ? undefined : i))
    .filter(a => a !== undefined);
};
