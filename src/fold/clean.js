/**
 * At the expense of runtime, this method should fix all issues
 *
 * each step of the way this method will verify the existence, and
 * the alignment of indices in the graph. if it detects a mismatch
 * it will rebuild relevant arrays.
 *
 */

import Validate from "./validate";
import {
  make_faces_matrix,
  make_vertices_edges,
  make_vertices_faces,
  make_edges_faces,
  make_edges_length,
  make_edges_foldAngle,
  make_faces_faces,
} from "./make";
import { clone } from "./object";

import FOLDConvert from "../../include/fold/convert";


const clean_abstract_graph = function (graph) {
  // todo
};

const clean_vertices_coords = function (graph) {
  if (graph.vertices_coords.length === 0) { return; }
  graph.vertices_coords = graph.vertices_coords
    .map(vert => vert
      .map(num => parseFloat(num)));
  graph.vertices_coords.forEach((vert, v) => vert.forEach((num, n) => {
    if (isNaN(num) || num == null) {
      delete graph.vertices_coords[v][n];
    }
  }));
};

const clean = function (fold) {
  const graph = clone(fold);
  // no vertices means abstract graph
  if (graph.vertices_coords == null || graph.vertices_coords.length === 0) {
    return clean_abstract_graph(graph);
  }
  // here on, vertices_coords definitely exists
  if (!Validate.vertices_coords(graph)) {
    // need to clean vertices...
    // - it's possible they contain null
    clean_vertices_coords(graph);
  }

  FOLDConvert.edges_vertices_to_vertices_vertices_sorted(graph);
  FOLDConvert.vertices_vertices_to_faces_vertices(graph);
  graph.faces_edges = FOLDConvert.faces_vertices_to_faces_edges(graph);
  graph.edges_faces = make_edges_faces(graph);
  graph.vertices_faces = make_vertices_faces(graph);
  graph.edges_length = make_edges_length(graph);
  graph.faces_faces = make_faces_faces(graph);
  graph.vertices_edges = make_vertices_edges(graph);
  if (graph.edges_assignment != null) {
    graph.edges_foldAngle = make_edges_foldAngle(graph);
  }
  return graph;
};


const cleanWithValidate = function (graph) {
  // no vertices means abstract graph
  if (graph.vertices_coords == null || graph.vertices_coords.length === 0) {
    return clean_abstract_graph(graph);
  }
  // here on, vertices_coords definitely exists
  // check if faces or edges exist
  if (!Validate.vertices_coords(graph)) {
    // need to clean vertices...
    // - it's possible they contain null
    clean_vertices_coords(graph);
  }
  if (graph.edges_vertices == null
    && graph.faces_vertices == null
    && graph.faces_edges == null) {
    // no face or edge data to test
    return;
  }
  // these are the 3 arrays that will be used to build the rest of the graph
  const validate_edges_vertices = Validate.edges_vertices(graph);
  const validate_faces_vertices = Validate.faces_vertices(graph);
  const validate_faces_edges = Validate.faces_edges(graph);

  // todo later
  // skip below
  if (!validate_edges_vertices) {
    // rebuild edges_vertices referencing some other array
    if (validate_faces_edges) {
      // graph.edges_vertices = make_edges_vertices_from_faces_edges(graph);
    } else if (validate_faces_vertices) {
      // todo
    }
  }
  // skip to here
  // from here on let's assume vertices_coords and edges_vertices exist.
  if (!Validate.vertices_vertices(graph)) {
    FOLDConvert.edges_vertices_to_vertices_vertices_sorted(graph);
  }
  if (!validate_faces_vertices) {
    FOLDConvert.vertices_vertices_to_faces_vertices(graph);
  }
  if (!validate_faces_edges) {
    graph.faces_edges = FOLDConvert.faces_vertices_to_faces_edges(graph);
  }
  if (!Validate.edges_faces(graph)) {
    graph.edges_faces = make_edges_faces(graph);
  }
  if (!Validate.vertices_faces(graph)) {
    graph.vertices_faces = make_vertices_faces(graph);
  }
  if (!Validate.edges_length(graph)) {
    graph.edges_length = make_edges_length(graph);
  }
  if (!Validate.faces_faces(graph)) {
    graph.faces_faces = make_faces_faces(graph);
  }
  if (!Validate.vertices_edges(graph)) {
    graph.vertices_edges = make_vertices_edges(graph);
  }

  // now we can guarantee that edges_vertices and faces_vertices exist and are good
};


const clean_old = function (fold) {
  // const verticesCount = vertices_count(fold);
  // const edgesCount = edges_count(fold);
  if (fold.vertices_coords != null && fold.vertices_vertices != null) {
    FOLDConvert.sort_vertices_vertices(fold);
  }
  const facesCount = faces_count(fold);
  if (facesCount > 0) {
    if (fold["faces_re:matrix"] == null) {
      fold["faces_re:matrix"] = make_faces_matrix(fold);
    } else if (fold["faces_re:matrix"].length !== facesCount) {
      fold["faces_re:matrix"] = make_faces_matrix(fold);
    }

    if (fold["faces_re:layer:"] == null) {
      // fold["faces_re:layer"] = []
    }
  }
};

export default clean;
