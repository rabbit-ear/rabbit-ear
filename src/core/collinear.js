import math from "../../include/math";
import FOLDConvert from "../../include/fold/convert";
import remove from "./remove";
import need from "./need";

// import { make_vertices_edges } from "./make";

export const collinear_vertices = function (graph, point, vector) {
  return graph.vertices_coords
    .map(vert => vert.map((n, i) => n - point[i]))
    .map(vert => vert[0] * vector[1] - vert[1] * vector[0])
    .map((det, i) => (Math.abs(det) < math.core.EPSILON ? i : undefined))
    .filter(a => a !== undefined);
};

export const collinear_edges = function (graph, point, vector) {
  const hash = {};
  collinear_vertices(graph, point, vector)
    .forEach((v) => { hash[v] = true; });
  // graph.vertices_edges = make_vertices_edges(graph);
  FOLDConvert.edges_vertices_to_vertices_vertices_sorted(graph);
  return graph.edges_vertices
    .map(ev => hash[ev[0]] && hash[ev[1]] && graph.vertices_vertices[ev[0]].includes(ev[1]))
    .map((collinear, i) => (collinear ? i : undefined))
    .filter(a => a !== undefined);
};


// works in 2 or 3 dimensions
// (can be n dimensions if cross product can generalize)
// and works for any number of vertices
// const are_vertices_collinear = function (graph, verts) {
//   if (verts.length < 3) { return false; }
//   const coords = verts.map(v => graph.vertices_coords[v]);
//   const dimension = Array.from(Array(coords[0].length));
//   const cross = dimension === 3 ? math.core.cross3
//   const a_b = dimension.map((_, i) => coords[1][i] - coords[0][i]);
//   for (let v = 1; v < verts.length; v += 1) {
//     const vec = dimension.map((_, i) => coords[v][i] - coords[0][i]);
//   }
// };

// works in 2 dimensions and 3 vertices
const are_vertices_collinear = function (graph, verts) {
  if (verts.length < 3) { return false; }
  const coords = verts.map(v => graph.vertices_coords[v]);
  const dimension = Array.from(Array(coords[0].length));
  const a = dimension.map((_, i) => coords[1][i] - coords[0][i]);
  const b = dimension.map((_, i) => coords[2][i] - coords[0][i]);
  return Math.abs(a[0] * b[1] - a[1] * b[0]) < math.core.EPSILON;
};

// 1. find the collinear vertices
// 2. is the vertext between a common assignment? mountain/valley/border/...
// 3. only if 2 is true, remove vertex

const remove_collinear_vertices_old = function (graph, vertices) {
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
    const foldAngle = graph.edges_foldAngle[edges_indices[0]];
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
  return vertices.length > 0;
};

const remove_collinear_vertices = function (graph, collinear) {
  const new_edges = [];
  collinear.forEach((co) => {
    // const vert = co.vertex;
    const { vertices, edges } = co;
    const assignment = co.assignments[0];
    remove(graph, "edges", edges);
    new_edges.push({ vertices, assignment });
  });
  new_edges.forEach((el) => {
    const index = graph.edges_vertices.length;
    graph.edges_vertices[index] = el.vertices;
    graph.edges_assignment[index] = el.assignment;
    // graph.edges_foldAngle[index] = el.foldAngle;
  });
  remove(graph, "vertices", collinear.map(c => c.vertex));
};

export const remove_all_collinear_vertices = function (graph) {
  need(graph, "vertices_vertices", "vertices_edges");
  const pairs_verts = graph.vertices_vertices
    .map((adj, i) => (adj.length === 2 ? i : undefined))
    .filter(a => a !== undefined);
  const collinear_verts = pairs_verts
    .map(v => [v].concat(graph.vertices_vertices[v]))
    .map(verts => (are_vertices_collinear(graph, verts)
      ? ({ vertex: verts[0], vertices: [verts[1], verts[2]], edges: graph.vertices_edges[verts[0]] })
      : undefined))
    .filter(a => a !== undefined);
  collinear_verts.forEach((v) => {
    v.assignments = v.edges.map(e => graph.edges_assignment[e].toUpperCase());
  });
  collinear_verts.forEach((v) => {
    v.valid = v.assignments.map(a => a === v.assignments[0]).reduce((a, b) => a && b, true);
  });
  const toRemove = collinear_verts.filter(v => v.valid);
  remove_collinear_vertices(graph, toRemove);
  return toRemove.length > 0;
};
