import {
  make_faces_matrix,
  make_vertices_coords_folded,
} from "./fold/make";
import {
  faces_containing_point,
  topmost_face,
} from "./fold/query";
import {
  axiom2
} from "./origami/axioms";
import { keys_types } from "./fold/keys";
import { clone } from "./fold/object";

const build_folded_frame = function (graph, face_stationary = 0) {
  const faces_matrix = make_faces_matrix(graph, face_stationary);
  const vertices_coords = make_vertices_coords_folded(graph, face_stationary, faces_matrix);
  return {
    vertices_coords,
    "faces_re:matrix": faces_matrix
  };
};

const cache = function (graph) {
  const cached = {};
  keys_types.graph.forEach((key) => { cached[key] = graph[key]; });
  if ("faces_re:matrix" in graph === true) {
    cached["faces_re:matrix"] = graph["faces_re:matrix"];
  }
  if ("faces_re:layer" in graph === true) {
    cached["faces_re:layer"] = graph["faces_re:layer"];
  }
  return clone(cached);
};

const prepareGraph = function (graph) {
  if ("faces_re:matrix" in graph === false) {
    graph["faces_re:matrix"] = make_faces_matrix(graph, 0);
  }
};

const setup = function (origami, svg) {
  prepareGraph(origami);

  let touchFaceIndex = 0; // which faces the user touched, to begin folding
  let cachedGraph = cache(origami);
  let was_folded = false;
  svg.events.addEventListener("onMouseDown", (mouse) => {
    cachedGraph = cache(origami);
    // this shifts the folded coords into the vertices_coords position
    if ("vertices_re:unfoldedCoords" in origami === true) {
      was_folded = true;
      cachedGraph.vertices_coords = origami["vertices_re:unfoldedCoords"].slice();
      // delete origami["vertices_re:unfoldedCoords"];
    }
    // cachedGraph.fold();
    // vertices_coords: graph.vertices_coords,
    // vertices_coords: graph["vertices_re:foldedCoords"],
    // vertices_coords: graph["vertices_re:unfoldedCoords"],
    // build_folded_frame(prevCP, 0);
    const faces_containing = faces_containing_point(cachedGraph, mouse);
    const top_face = topmost_face(origami, faces_containing);
    touchFaceIndex = (top_face == null)
      ? 0 // get bottom most face
      : top_face;
  });
  svg.events.addEventListener("onMouseMove", (mouse) => {
    if (mouse.isPressed) {
      // if (was_folded) { origami.unfold(); }

      origami.load(cachedGraph);
      const instruction = axiom2(mouse.pressed, mouse.position);
      origami.valleyFold(instruction.solutions[0], touchFaceIndex);

      if (was_folded) { origami.fold(); }
    }
  });
};

export default setup;
