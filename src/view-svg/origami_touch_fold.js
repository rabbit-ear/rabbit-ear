/**
 * this gets applied to the parent of the SVG. the Origami() object.
 *
 */

import {
  make_faces_matrix,
  make_vertices_coords_folded,
} from "../FOLD/make";
import {
  faces_containing_point,
  topmost_face,
} from "../FOLD/query";
import {
  axiom2
} from "../axioms";
import { clone } from "../FOLD/object";

const build_folded_frame = function (graph, face_stationary = 0) {
  const faces_matrix = make_faces_matrix(graph, face_stationary);
  const vertices_coords = make_vertices_coords_folded(graph, face_stationary, faces_matrix);
  return {
    vertices_coords,
    "faces_re:matrix": faces_matrix
  };
};

const prepareGraph = function (graph) {
  if ("faces_re:matrix" in graph === false) {
    graph["faces_re:matrix"] = make_faces_matrix(graph, 0);
  }
};

const setup = function (origami, svg) {
  prepareGraph(origami);

  let touchFaceIndex = 0; // which faces the user touched, to begin folding
  let cachedGraph = clone(origami);
  let was_folded = ("vertices_re:unfoldedCoords" in origami === true);
  // svg.events.addEventListener("onMouseDown", (mouse) => {
  svg.mousePressed = (mouse) => {
    was_folded = ("vertices_re:unfoldedCoords" in origami === true);
    cachedGraph = clone(origami);
    const param = {
      faces_vertices: origami.faces_vertices,
      "faces_re:layer": origami["faces_re:layer"]
    };
    param.vertices_coords = was_folded
      ? (origami["vertices_re:foldedCoords"] || origami.vertices_coords)
      : (origami["vertices_re:unfoldedCoords"] || origami.vertices_coords);
    const faces_containing = faces_containing_point(param, mouse);
    const top_face = topmost_face(param, faces_containing);
    touchFaceIndex = (top_face == null)
      ? 0 // get bottom most face
      : top_face;
    // this shifts the folded coords into the vertices_coords position
    if (was_folded) {
      cachedGraph.vertices_coords = origami["vertices_re:unfoldedCoords"].slice();
    }
    // cachedGraph.fold();
    // vertices_coords: graph.vertices_coords,
    // vertices_coords: graph["vertices_re:foldedCoords"],
    // vertices_coords: graph["vertices_re:unfoldedCoords"],
    // build_folded_frame(prevCP, 0);
  };
  // svg.events.addEventListener("onMouseMove", (mouse) => {
  svg.mouseMoved = (mouse) => {
    if (mouse.isPressed) {
      // if (was_folded) { origami.unfold(); }

      origami.load(cachedGraph);
      const instruction = axiom2(mouse.pressed[0], mouse.pressed[1], mouse.position[0], mouse.position[1]);
      origami.crease(instruction.solutions[0], touchFaceIndex);

      if (was_folded) { origami.fold(); }
    }
  };
};

export default setup;
