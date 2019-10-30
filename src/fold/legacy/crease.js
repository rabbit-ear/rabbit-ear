import math from "../../../include/math";
import split_convex_polygon from "../split_face";
// import * as Makers from "../graph/makers";

export function add_edge_between_points(graph, x0, y0, x1, y1) {
  // this creates 2 new edges vertices indices.
  // or grabs old ones if a vertex already exists
  const edge = [[x0, y0], [x1, y1]];
  const edge_vertices = edge
    .map(ep => graph.vertices_coords
      // for both of the new points, iterate over every vertex,
      // return an index if it matches a new point, undefined if not
      .map(v => Math.sqrt(((ep[0] - v[0]) ** 2) + ((ep[1] - v[1]) ** 2)))
      .map((d, i) => (d < math.EPSILON ? i : undefined))
      .filter(el => el !== undefined)
      .shift())
    .map((v, i) => {
      if (v !== undefined) { return v; }
      // else
      graph.vertices_coords.push(edge[i]);
      return graph.vertices_coords.length - 1;
    });
  graph.edges_vertices.push(edge_vertices);
  graph.edges_assignment.push("F");
  graph.edges_length.push(Math.sqrt(((x0 - x1) ** 2) + ((y0 - y1) ** 2)));
  return [graph.edges_vertices.length - 1];
}


export function crease_line(graph, point, vector) {
  // let boundary = Graph.make_boundary_vertices(graph);
  // let poly = boundary.map(v => graph.vertices_coords[v]);
  // let edge_map = Array.from(Array(graph.edges_vertices.length)).map(_=>0);
  let new_edges = [];
  const arr = Array.from(Array(graph.faces_vertices.length))
    .map((_, i) => i).reverse();
  arr.forEach((i) => {
    const diff = split_convex_polygon(graph, i, point, vector);
    if (diff.edges != null && diff.edges.new != null) {
      // a new crease line was added
      const newEdgeIndex = diff.edges.new[0].index;
      new_edges = new_edges.map(edge => edge + (diff.edges.map[edge] == null
        ? 0
        : diff.edges.map[edge]));
      new_edges.push(newEdgeIndex);
    }
  });
  return new_edges;
}

export function crease_ray(graph, point, vector) {
  let new_edges = [];
  const arr = Array.from(Array(graph.faces_vertices.length))
    .map((_, i) => i).reverse();
  arr.forEach((i) => {
    const diff = split_convex_polygon(graph, i, point, vector);
    if (diff.edges != null && diff.edges.new != null) {
      // a new crease line was added
      const newEdgeIndex = diff.edges.new[0].index;
      new_edges = new_edges.map(edge => edge
        + (diff.edges.map[edge] == null ? 0 : diff.edges.map[edge]));
      new_edges.push(newEdgeIndex);
    }
  });
  return new_edges;
}

// export function creaseLine(graph, point, vector) {
//  // todo idk if this is done
//  let ray = math.line(point, vector);
//  graph.faces_vertices.forEach(face => {
//    let points = face.map(v => graph.vertices_coords[v]);
//    math.core.intersection.convex_poly_line(points, point, vector);
//  })
//  return crease_line(graph, line[0], line[1]);
// }

export function creaseRay(graph, point, vector) {
  // todo idk if this is done
  const ray = math.ray(point, vector);
  graph.faces_vertices.forEach((face) => {
    const points = face.map(v => graph.vertices_coords[v]);
    math.core.intersection.convex_poly_ray(points, point, vector);
  });
  return crease_line(graph, line[0], line[1]);
}
