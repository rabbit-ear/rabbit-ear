import convert from "../../include/fold/convert";
import filter from "../../include/fold/filter";
import {
  remove_vertices,
  remove_edges,
  remove_faces,
} from "./remove";


export const fragment2 = function (graph, epsilon = math.core.EPSILON) {
  filter.subdivideCrossingEdges_vertices(graph);
  convert.edges_vertices_to_vertices_vertices_sorted(graph);
  convert.vertices_vertices_to_faces_vertices(graph);
  convert.faces_vertices_to_faces_edges(graph);
  console.log(graph);
  return graph;
};


/**
 * fragment splits overlapping edges at their intersections
 * and joins new edges at a new shared vertex.
 * this destroys and rebuilds all face data with face walking
 */
export const fragment = function (graph, epsilon = math.core.EPSILON) {
  const horizSort = function (a, b) { return a[0] - b[0]; };
  const vertSort = function (a, b) { return a[1] - b[1]; };
  // const horizSort2 = function (a,b){
  //  return a.intersection[0] - b.intersection[0]; }
  // const vertSort2 = function (a,b){
  //  return a.intersection[1] - b.intersection[1]; }

  const equivalent = function (a, b) {
    for (let i = 0; i < a.length; i += 1) {
      if (Math.abs(a[i] - b[i]) > epsilon) {
        return false;
      }
    }
    return true;
  };

  const edge_count = graph.edges_vertices.length;
  const edges = graph.edges_vertices.map(ev => [
    graph.vertices_coords[ev[0]],
    graph.vertices_coords[ev[1]],
  ]);

  const edges_vector = edges.map(e => [e[1][0] - e[0][0], e[1][1] - e[0][1]]);
  const edges_magnitude = edges_vector
    .map(e => Math.sqrt(e[0] * e[0] + e[1] * e[1]));
  const edges_normalized = edges_vector
    .map((e, i) => [e[0] / edges_magnitude[i], e[1] / edges_magnitude[i]]);
  const edges_horizontal = edges_normalized.map(e => Math.abs(e[0]) > 0.707);

  const crossings = Array.from(Array(edge_count - 1)).map(() => []);
  for (let i = 0; i < edges.length - 1; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      crossings[i][j] = math.core.intersection.edge_edge_exclusive(
        edges[i][0], edges[i][1],
        edges[j][0], edges[j][1],
      );
    }
  }

  const edges_intersections = Array.from(Array(edge_count)).map(() => []);
  for (let i = 0; i < edges.length - 1; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      if (crossings[i][j] != null) {
        // warning - these are shallow pointers
        edges_intersections[i].push(crossings[i][j]);
        edges_intersections[j].push(crossings[i][j]);
      }
    }
  }

  // let edges_intersections2 = Array.from(Array(edge_count)).map(_ => []);
  // for (let i = 0; i < edges.length-1; i++) {
  //  for (let j = i+1; j < edges.length; j++) {
  //    if (crossings[i][j] != null) {
  //      // warning - these are shallow pointers
  //      edges_intersections2[i].push({edge:j, intersection:crossings[i][j]});
  //      edges_intersections2[j].push({edge:i, intersection:crossings[i][j]});
  //    }
  //  }
  // }

  edges.forEach((e, i) => e.sort(edges_horizontal[i] ? horizSort : vertSort));

  edges_intersections.forEach((e, i) => e
    .sort(edges_horizontal[i] ? horizSort : vertSort));
  // edges_intersections2.forEach((e,i) =>
  //  e.sort(edges_horizontal[i] ? horizSort2 : vertSort2)
  // )

  let new_edges = edges_intersections
    .map((e, i) => [edges[i][0], ...e, edges[i][1]])
    .map(ev => Array.from(Array(ev.length - 1))
      .map((_, i) => [ev[i], ev[(i + 1)]]));

  // remove degenerate edges
  new_edges = new_edges
    .map(edgeGroup => edgeGroup
      .filter(e => false === e
        .map((_, i) => Math.abs(e[0][i] - e[1][i]) < epsilon)
        .reduce((a, b) => a && b, true)));

  // let edge_map = new_edges.map(edge => edge.map(_ => counter++));
  const edge_map = new_edges
    .map((edge, i) => edge.map(() => i))
    .reduce((a, b) => a.concat(b), []);

  const vertices_coords = new_edges
    .map(edge => edge.reduce((a, b) => a.concat(b), []))
    .reduce((a, b) => a.concat(b), []);
  let counter = 0;
  const edges_vertices = new_edges
    .map(edge => edge.map(() => [counter++, counter++]))
    .reduce((a, b) => a.concat(b), []);

  const vertices_equivalent = Array
    .from(Array(vertices_coords.length)).map(() => []);
  for (let i = 0; i < vertices_coords.length - 1; i += 1) {
    for (let j = i + 1; j < vertices_coords.length; j += 1) {
      vertices_equivalent[i][j] = equivalent(
        vertices_coords[i],
        vertices_coords[j],
      );
    }
  }

  // console.log(vertices_equivalent);

  const vertices_map = vertices_coords.map(() => undefined);
  vertices_equivalent
    .forEach((row, i) => row
      .forEach((eq, j) => {
        if (eq) {
          vertices_map[j] = vertices_map[i] === undefined
            ? i
            : vertices_map[i];
        }
      }));

  const vertices_remove = vertices_map.map(m => m !== undefined);
  vertices_map.forEach((map, i) => {
    if (map === undefined) { vertices_map[i] = i; }
  });

  // console.log("vertices_map", vertices_map);

  edges_vertices
    .forEach((edge, i) => edge
      .forEach((v, j) => {
        edges_vertices[i][j] = vertices_map[v];
      }));

  const flat = {
    vertices_coords,
    edges_vertices,
  };

  // console.log("edges_vertices", edges_vertices);
  // console.log("vertices_remove", vertices_remove);
  const vertices_remove_indices = vertices_remove
    .map((rm, i) => (rm ? i : undefined))
    .filter(i => i !== undefined);
  remove_vertices(flat, vertices_remove_indices);

  // console.log(flat);

  convert.edges_vertices_to_vertices_vertices_sorted(flat);
  convert.vertices_vertices_to_faces_vertices(flat);
  convert.faces_vertices_to_faces_edges(flat);

  return flat;
};
