import { FOLDED_FORM, CREASE_PATTERN } from "../core/keys";
import isFoldedState from "../core/folded";
import populate from "../core/populate";
import {
  make_vertices_coords_folded,
  make_faces_matrix
} from "../core/make";

const VERTICES_FOLDED_COORDS = "vertices_re:foldedCoords";
const VERTICES_UNFOLDED_COORDS = "vertices_re:unfoldedCoords";
const FACES_MATRIX = "faces_re:matrix";

/**
 * setting the "folded state" does two things:
 * - assign the class of this object to be FOLDED_FORM or CREASE_PATTERN
 * - move (and cache) foldedCoords or unfoldedCoords into vertices_coords
 */
const setFoldedForm = function (graph, isFolded) {
  if (graph.frame_classes == null) { graph.frame_classes = []; }
  const wasFolded = isFoldedState(graph);
  if (isFolded === wasFolded) { return; } // graph is already folded / unfolded
  // update frame_classes
  graph.frame_classes = graph.frame_classes
    .filter(c => !([CREASE_PATTERN, FOLDED_FORM].includes(c)))
    .concat([isFolded ? FOLDED_FORM : CREASE_PATTERN]);
  // move unfolded_coords or folded_coords into the main vertices_coords spot
  if (isFolded) {
    // if folded coords do not exist, we need to build them.
    if (!(VERTICES_FOLDED_COORDS in graph)) {
      if (graph.faces_vertices == null) { populate(graph); }
      graph[FACES_MATRIX] = make_faces_matrix(graph, 0);
      graph[VERTICES_FOLDED_COORDS] = make_vertices_coords_folded(graph, null, graph[FACES_MATRIX]);
    }
    graph[VERTICES_UNFOLDED_COORDS] = graph.vertices_coords;
    graph.vertices_coords = graph[VERTICES_FOLDED_COORDS];
    delete graph[VERTICES_FOLDED_COORDS];
  } else {
    if (graph[VERTICES_UNFOLDED_COORDS] == null) { return; }
    // if unfolded coords do not exist, we need to build unfolded coords from a folded state?
    graph[VERTICES_FOLDED_COORDS] = graph.vertices_coords;
    graph.vertices_coords = graph[VERTICES_UNFOLDED_COORDS];
    delete graph[VERTICES_UNFOLDED_COORDS];
  }
};

export default setFoldedForm;
