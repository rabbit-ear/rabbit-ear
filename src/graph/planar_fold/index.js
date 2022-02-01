/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import {
  make_edges_segment_intersection,
} from "../intersect";
import split_edge from "../split_edge/index";
import remove from "../remove";
import { merge_nextmaps } from "../maps";
import {
  sort_vertices_along_vector,
  sort_vertices_counter_clockwise,
} from "../sort";
import {
  make_vertices_to_edge_bidirectional,
  make_vertices_faces,
  make_edges_faces_unsorted,
  make_faces_faces,
} from "../make";
import add_vertices from "../add/add_vertices";
import { counter_clockwise_walk } from "../walk";


/**
 * @description given a list of vertices in a graph which:
 * - these vertices have alreaddy been added to the graph
 * - this list of vertices has already been sorted along the vector
 * create a set of edges in the graph that connect these vertices.
 * appending: edges_vertices, edges_assignment ("U"), edges_foldAngle (0).
 * rebuilding: vertices_vertices, vertices_edges.
 * ignoring face data. faces will be walked and rebuilt later.
 */
const add_segment_edges = (graph, segment_vertices) => {
  // now build the data for the edges which compose the new segment.
  // the new edges' edges_ indices.
  const segment_edges = Array
    .from(Array(segment_vertices.length - 1))
    .map((_, i) => graph.edges_vertices.length + i);
  // the new edges' edges_vertices data.
  const segment_edges_vertices = segment_edges
    .map((_, i) => [segment_vertices[i], segment_vertices[i + 1]]);
  // add new edges to the graph, these edges compose the new segment.
  // add edges_vertices.
  segment_edges.forEach((e, i) => {
    graph.edges_vertices[e] = segment_edges_vertices[i];
  });
  // only update these arrays if they exist.
  if (graph.edges_assignment) {
    segment_edges.forEach(e => { graph.edges_assignment[e] = "U"; });
  }
  if (graph.edges_foldAngle) {
    segment_edges.forEach(e => { graph.edges_foldAngle[e] = 0; });
  }
  // build vertices_vertices
  for (let i = 0; i < segment_vertices.length; i++) {
    const vertex = segment_vertices[i];
    const prev = segment_vertices[i - 1];
    const next = segment_vertices[i + 1];
    const new_adjacent_vertices = [prev, next].filter(a => a !== undefined);
    // for the two vertices that are the segment's endpoints, if they are
    // not collinear vertices, they will not yet have a vertices_vertices.
    const previous_vertices_vertices = graph.vertices_vertices[vertex]
      ? graph.vertices_vertices[vertex] : [];
    const unsorted_vertices_vertices = previous_vertices_vertices
      .concat(new_adjacent_vertices);
    graph.vertices_vertices[vertex] = sort_vertices_counter_clockwise(
      graph, unsorted_vertices_vertices, segment_vertices[i]);
  }
  // build vertices_edges from vertices_vertices
  const edge_map = make_vertices_to_edge_bidirectional(graph);
  for (let i = 0; i < segment_vertices.length; i++) {
    const vertex = segment_vertices[i];
    graph.vertices_edges[vertex] = graph.vertices_vertices[vertex]
      .map(v => edge_map[`${vertex} ${v}`]);
  }
  return segment_edges;
};
/**
 * fragment_edges is the fragment operation but will only operate on a
 * subset of edges.
 */
const add_segment_to_planar_graph = (graph, point1, point2, epsilon = math.core.EPSILON) => {
  // flatten input points to the Z=0 plane
  const segment = [point1, point2].map(p => [p[0], p[1]]);
  const segment_vector = math.core.subtract2(segment[1], segment[0]);
  // const graph = JSON.parse(JSON.stringify(graph_original));
  // project all vertices onto the XY plane
  graph.vertices_coords = graph.vertices_coords.map(coord => coord.slice(0, 2));

  const intersections = make_edges_segment_intersection(graph, segment[0], segment[1], epsilon);
  // get all edges which intersect the segment.
  const intersected_edges = intersections
    .map((pt, e) => pt === undefined ? undefined : e)
    .filter(a => a !== undefined)
    .sort((a, b) => a - b);
  // using edges_faces_ get all faces which have an edge intersected.
  const faces_map = {};
  intersected_edges
    .forEach(e => graph.edges_faces[e]
      .forEach(f => { faces_map[f] = true; }));
  const intersected_faces = Object.keys(faces_map)
    .map(s => parseInt(s))
    .sort((a, b) => a - b);
  // todo: a sometimes bug, when slicing faces that have a pointy-in
  // edge. i think what's going on is split_edge encounters a face
  // with faces_edges having a repeat of the same edge. in the process
  // of rebuilding the face it deletes the edge, but re-encounters the
  // deleted edge, which is now "undefined". 
  const split_edge_results = intersected_edges
    .reverse()
    .map(edge => split_edge(graph, edge, intersections[edge], epsilon))
  const split_edge_vertices = split_edge_results.map(el => el.vertex);
  // todo, should this list be reversed?
  const split_edge_maps = split_edge_results.map(el => el.edges.map);
  const split_edge_map = split_edge_maps
    .splice(1)
    .reduce((a, b) => merge_nextmaps(a, b), split_edge_maps[0]);
  // now that all edges have been split their new vertices have been
  // added to the graph, add the original segment's two endpoints.
  // we waited until here because this method will search all existing
  // vertices, and avoid adding a duplicate, which will happen in the
  // case of an endpoint lies collinear along a split edge.
  const endpoint_vertices = add_vertices(graph, segment, epsilon);
  // use a hash as an intermediary, make sure new vertices are unique.
  // duplicate vertices will occur in the case of a collinear endpoint.
  const new_vertex_hash = {};
  split_edge_vertices.forEach(v => { new_vertex_hash[v] = true; });
  endpoint_vertices.forEach(v => { new_vertex_hash[v] = true; });
  const new_vertices = Object.keys(new_vertex_hash).map(n => parseInt(n));
  // these vertices are sorted in the direction of the segment
  const segment_vertices = sort_vertices_along_vector(graph, new_vertices, segment_vector);

  const edge_map = make_vertices_to_edge_bidirectional(graph);
  const segment_edges = add_segment_edges(graph, segment_vertices, edge_map);
  // update the edge_map with the new segment edges
  segment_edges.forEach(e => {
    const v = graph.edges_vertices[e];
    edge_map[`${v[0]} ${v[1]}`] = e;
    edge_map[`${v[1]} ${v[0]}`] = e;
  });

  // get all pairs of adjacent vertices (both ways) of the vertices
  // in the segment we just added
  const segment_vertex_pairs = Array
    .from(Array(segment_vertices.length - 1))
    .map((_, i) => [
      [segment_vertices[i], segment_vertices[i + 1]],
      [segment_vertices[i + 1], segment_vertices[i]],
    ]).reduce((a, b) => a.concat(b), []);
  
  // what about this case where an edge comes to meet a face, splitting
  // one of the faces edges, but no edge of this new segment exists INSIDE
  // this face, so by walking all edges of the segment, no reconstruction
  // of this face will happen.
  // __________
  // [        ]   segment
  // [  face  O-------------
  // [        ]
  // ----------
  //
  // prevent duplicate faces
  const walked_edges = {};
  // using vertices_vertices, walk and always turn the same direction
  // to uncover faces
  const walked_faces = segment_vertex_pairs
    .map(pair => counter_clockwise_walk(graph, pair[0], pair[1], walked_edges))
    .filter(a => a !== undefined);
  remove(graph, "faces", intersected_faces);
  // todo: assuming faces_vertices exists when it's possible only
  // faces_edges exists.
  const new_faces = walked_faces
    .map((_, i) => graph.faces_vertices.length + i);
  // add each array, only if they exist.
  if (graph.faces_vertices) {
    new_faces.forEach((f, i) => {
      graph.faces_vertices[f] = walked_faces[i].vertices;
    });
  }
  if (graph.faces_edges) {
    new_faces.forEach((f, i) => {
      graph.faces_edges[f] = walked_faces[i].edges
        .map(pair => edge_map[pair]);
    });
  }
  if (graph.faces_angles) {
    new_faces.forEach((f, i) => {
      graph.faces_angles[f] = walked_faces[i].faces_angles;
    });
  }
  // update all the arrays which reference face arrays
  if (graph.vertices_faces) {
    graph.vertices_faces = make_vertices_faces(graph);
  }
  if (graph.edges_faces) {
    graph.edges_faces = make_edges_faces_unsorted(graph);
  }
  if (graph.faces_faces) {
    graph.faces_faces = make_faces_faces(graph);
  }

  if (graph.vertices_coords.length !== graph.vertices_vertices.length
    || graph.vertices_coords.length !== graph.vertices_edges.length
    || graph.vertices_coords.length !== graph.vertices_faces.length) {
    console.warn("vertices mismatch", JSON.parse(JSON.stringify(graph)));
  }
  if (graph.edges_vertices.length !== graph.edges_faces.length
    || graph.edges_vertices.length !== graph.edges_assignment.length) {
    console.warn("edges mismatch", JSON.parse(JSON.stringify(graph)));
  }
  if (graph.faces_vertices.length !== graph.faces_edges.length
    || graph.faces_vertices.length !== graph.faces_faces.length) {
    console.warn("faces mismatch", JSON.parse(JSON.stringify(graph)));
  }
  // console.log("intersected_edges", intersected_edges);
  // console.log("intersected_faces", intersected_faces);
  // console.log("split_edge_results", split_edge_results);
  // console.log("split_edge_map", split_edge_map);
  // console.log("split_edge_vertices", split_edge_vertices);
  // console.log("vertices_vertices", split_edge_vertices
  //   .map(v => graph.vertices_vertices[v]));
  // console.log("endpoint_vertices", endpoint_vertices);
  // console.log("new_vertices", new_vertices);
  // console.log("segment_vertices", segment_vertices);
  // console.log("segment_vertex_pairs", segment_vertex_pairs);
  // console.log("walked_faces", walked_faces);
  return segment_edges;
};

export default add_segment_to_planar_graph;
