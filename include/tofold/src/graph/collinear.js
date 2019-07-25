import remove from "./remove";

// 1. find the collinear vertices
// 2. is the vertext between a common assignment? mountain/valley/border/...
// 3. only if 2 is true, remove vertex

const remove_collinear_vertices = function (graph, vertices) {
  const new_edges = [];
  vertices.forEach((vert) => {
    const edges_indices = graph.edges_vertices
      .map((ev, i) => (ev[0] === vert || ev[1] === vert ? i : undefined))
      .filter(a => a !== undefined);
    const edges = edges_indices.map(i => graph.edges_vertices[i]);
    if (edges.length !== 2) { return; }
    const a = edges[0][0] === vert ? edges[0][1] : edges[0][0];
    const b = edges[1][0] === vert ? edges[1][1] : edges[1][0];
    const assignment = graph.edges_assignment[edges_indices[0]];
    const foldAngle = graph.edges_assignment[edges_indices[0]];
    remove(graph, "edges", edges_indices);
    new_edges.push({ vertices: [a, b], assignment, foldAngle });
  });
  new_edges.forEach((el) => {
    const index = graph.edges_vertices.length;
    graph.edges_vertices[index] = el.vertices;
    graph.edges_assignment[index] = el.assignment;
    graph.edges_foldAngle[index] = el.foldAngle;
  });
  remove(graph, "vertices", vertices);
};

export default remove_collinear_vertices;
