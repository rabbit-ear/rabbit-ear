/**
 * fragment splits overlapping edges at their intersections
 * and joins new edges at a new shared vertex.
 *
 * this destroys and rebuilds all face data, leaving only:
 * - vertices_coords
 * - edges_vertices, edges_assignment, edges_foldAngle
 */

import math from "../../include/math";
import remove from "./remove";
import {
  fold_keys,
  edge_assignment_to_foldAngle
} from "./keys";

// permissively ignores anything above 2D
const are_vertices_equivalent = function (a, b, epsilon = math.core.EPSILON) {
  const max = a.length < 2 ? a.length : 2;
  for (let i = 0; i < max; i += 1) {
    if (Math.abs(a[i] - b[i]) > epsilon) {
      return false;
    }
  }
  return true;
};

const point_on_edge_exclusive = function (point, edge0, edge1, epsilon = math.core.EPSILON) {
  const edge0_1 = [edge0[0] - edge1[0], edge0[1] - edge1[1]];
  const edge0_p = [edge0[0] - point[0], edge0[1] - point[1]];
  const edge1_p = [edge1[0] - point[0], edge1[1] - point[1]];
  const dEdge = Math.sqrt(edge0_1[0] * edge0_1[0] + edge0_1[1] * edge0_1[1]);
  const dP0 = Math.sqrt(edge0_p[0] * edge0_p[0] + edge0_p[1] * edge0_p[1]);
  const dP1 = Math.sqrt(edge1_p[0] * edge1_p[0] + edge1_p[1] * edge1_p[1]);
  return Math.abs(dEdge - dP0 - dP1) < epsilon;
};

const edges_vertices_equivalent = function (a, b) {
  return (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0]);
};

const make_edges_collinearVertices = function ({
  vertices_coords, edges_vertices
}, epsilon = math.core.EPSILON) {
  const edges = edges_vertices
    .map(ev => ev.map(v => vertices_coords[v]));
  return edges.map(e => vertices_coords
    .filter(v => point_on_edge_exclusive(v, e[0], e[1], epsilon)));
};

const make_edges_alignment = function ({ vertices_coords, edges_vertices }) {
  const edges = edges_vertices
    .map(ev => ev.map(v => vertices_coords[v]));
  const edges_vector = edges.map(e => [e[1][0] - e[0][0], e[1][1] - e[0][1]]);
  const edges_magnitude = edges_vector
    .map(e => Math.sqrt(e[0] * e[0] + e[1] * e[1]));
  const edges_normalized = edges_vector
    .map((e, i) => [e[0] / edges_magnitude[i], e[1] / edges_magnitude[i]]);
  return edges_normalized.map(e => Math.abs(e[0]) > 0.707);
};

const make_edges_intersections = function ({
  vertices_coords, edges_vertices
}, epsilon = math.core.EPSILON) {
  const edge_count = edges_vertices.length;
  const edges = edges_vertices
    .map(ev => ev.map(v => vertices_coords[v]));
  // build an NxN matrix of edge crossings
  //     0  1  2  3
  // 0 [  , x,  ,  ]
  // 1 [ x,  ,  , x]
  // 2 [  ,  ,  ,  ]
  // 3 [  , x,  ,  ]
  //
  // this example has crossings between 0 and 1, and 1 and 3.
  // because the lower triangle is duplicate info, we only store one half
  //
  // if two edges end at the same endpoint this DOES NOT consider them touching

  const crossings = Array.from(Array(edge_count - 1)).map(() => []);
  // todo this could already be cached on the object. like segment()
  const edgeObjects = edges.map(e => ({
    origin: e[0],
    vector: [e[1][0] - e[0][0], e[1][1] - e[0][1]]
  }));
  const intersectFunc = math.intersect.lines.exclude_s_s;
  for (let i = 0; i < edges.length - 1; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      crossings[i][j] = math.intersect.lines
        .intersect(edgeObjects[i], edgeObjects[j], intersectFunc);
      // crossings[i][j] = math.intersect.lines.intersect(
      //   { origin: edges[i][0], vector: edges[i][1] },
      //   { origin: edges[j][0], vector: edges[j][1] },
      //   math.intersect.lines.exclude_s_s
      // );
      // crossings[i][j] = math.core.intersection.segment_segment_exclusive(
      //   edges[i][0], edges[i][1],
      //   edges[j][0], edges[j][1],
      //   epsilon
      // );
    }
  }

  // math.core.intersect.lines.intersect(edges[i], edges[j], math.core.intersect.lines.exclude_s_s);

  // build a list for each edge containing the intersection points
  // 0 [ [0.25, 0.125] ]
  // 1 [ [0.25, 0.125], [0.99, 0.88] ]
  // 2 [ ]
  // 3 [ [0.99, 0.88] ]
  const edges_intersections = Array.from(Array(edge_count)).map(() => []);
  for (let i = 0; i < edges.length - 1; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      if (crossings[i][j] != null) {
        edges_intersections[i].push(crossings[i][j]);
        edges_intersections[j].push(crossings[i][j]);
      }
    }
  }
  // careful with the pairs in separate locations - these are shallow pointers
  return edges_intersections;
};


const fragment = function (graph, epsilon = math.core.EPSILON) {
  const horizSort = function (a, b) { return a[0] - b[0]; };
  const vertSort = function (a, b) { return a[1] - b[1]; };
  // when we rebuild an edge we need the intersection points sorted so we can
  // walk down it and rebuild one by one. should the walk proceed
  // horizontally or vertically?
  const edges_alignment = make_edges_alignment(graph);
  const edges = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]));
  edges.forEach((e, i) => e.sort(edges_alignment[i] ? horizSort : vertSort));
  // for each edge, get all the intersection points
  const edges_intersections = make_edges_intersections(graph, epsilon);
  // this does 2 very important things
  // 1) gather all the intersection points (that don't count as crossings)
  //    where an edge ends somewhere along the middle of this edge.
  // 2) get the edges endpoints. needed for when we re-build the edge.
  const edges_collinearVertices = make_edges_collinearVertices(graph, epsilon);
  const new_edges_vertices = edges_intersections
    .map((a, i) => a.concat(edges_collinearVertices[i]));
  new_edges_vertices.forEach((e, i) => e
    .sort(edges_alignment[i] ? horizSort : vertSort));
  // there are duplicate vertices.
  // since vertices are sorted we can remove duplicates by checking the array neighbor
  const new_edges_vertices_cleaned = new_edges_vertices
    .map(ev => ev
      .filter((e, i, arr) => !are_vertices_equivalent(e, arr[(i + 1) % arr.length])))
    .filter(edge => edge.length);

  let new_edges = new_edges_vertices_cleaned
    // .map((e, i) => [edges[i][0], ...e, edges[i][1]])
    .map(ev => Array.from(Array(ev.length - 1))
      .map((_, i) => [ev[i], ev[(i + 1)]]));
  // remove degenerate edges
  const TEST_A = new_edges.length;
  new_edges = new_edges
    .map(edgeGroup => edgeGroup
      .filter(e => false === e
        .map((_, i) => Math.abs(e[0][i] - e[1][i]) < epsilon)
        .reduce((a, b) => a && b, true)));
  const TEST_B = new_edges.length;
  // if this message never shows up, we can probably remove the reconstruction above
  if (TEST_A !== TEST_B) { console.log("fragment() remove degenerate edges is needed!"); }
  // let edge_map = new_edges.map(edge => edge.map(_ => counter++));
  const edge_map = new_edges
    .map((edge, i) => edge.map(() => i))
    .reduce((a, b) => a.concat(b), []);
  // remove duplicate vertices
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
      vertices_equivalent[i][j] = are_vertices_equivalent(
        vertices_coords[i],
        vertices_coords[j],
        epsilon
      );
    }
  }
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
  edges_vertices
    .forEach((edge, i) => edge
      .forEach((v, j) => {
        edges_vertices[i][j] = vertices_map[v];
      }));
  // remove duplicate edges
  const edges_equivalent = Array
    .from(Array(edges_vertices.length)).map(() => []);
  for (let i = 0; i < edges_vertices.length - 1; i += 1) {
    for (let j = i + 1; j < edges_vertices.length; j += 1) {
      edges_equivalent[i][j] = edges_vertices_equivalent(
        edges_vertices[i],
        edges_vertices[j]
      );
    }
  }
  const edges_map = edges_vertices.map(() => undefined);
  edges_equivalent
    .forEach((row, i) => row
      .forEach((eq, j) => {
        if (eq) {
          // edges_map[j] = edges_map[i] === undefined
          //   ? i
          //   : edges_map[i];
          // save the last ones in the array, not the first
          edges_map[i] = edges_map[j] === undefined
            ? j
            : edges_map[j];
        }
      }));
  // if ANY edge from a set of duplicates is assignment BOUNDARY it takes precedent.
  // force the remaining one to be boundary.
  // todo: this fix is currently modifying the input graph.
  // make it leave the input graph untouched.
  edges_map.forEach((e, i) => {
    if (e !== undefined) {
      if (["B", "b"].includes(graph.edges_assignment[i])) {
        graph.edges_assignment[e] = "B";
      }
    }
  });
  const edges_dont_remove = edges_map.map(m => m === undefined);
  edges_map.forEach((map, i) => {
    if (map === undefined) { edges_map[i] = i; }
  });
  const edges_vertices_cl = edges_vertices.filter((_, i) => edges_dont_remove[i]);
  const edge_map_cl = edge_map.filter((_, i) => edges_dont_remove[i]);

  const flat = {
    vertices_coords,
    edges_vertices: edges_vertices_cl
  };
  if (graph.edges_assignment != null) {
    flat.edges_assignment = edge_map_cl
      .map(i => graph.edges_assignment[i] || "U");
  }
  if (graph.edges_foldAngle != null) {
    flat.edges_foldAngle = edge_map_cl.map((i, j) => (
      graph.edges_foldAngle[i]
      || edge_assignment_to_foldAngle(flat.edges_assignment[j])));
  }
  const vertices_remove_indices = vertices_remove
    .map((rm, i) => (rm ? i : undefined))
    .filter(i => i !== undefined);
  remove(flat, "vertices", vertices_remove_indices);

  // done. we can return a copy of the changes, or modify directly
  fold_keys.graph.forEach(key => delete graph[key]);
  Object.assign(graph, flat);
  delete graph.faces_vertices;
  delete graph.faces_edges;
  delete graph.faces_faces;
  delete graph.edges_faces;
  delete graph.edges_length;
  delete graph.vertices_faces;
  delete graph.vertices_edges;
  // Object.keys(flat).forEach((key) => { graph[key] = flat[key]; });
  // return flat;
};

export default fragment;
