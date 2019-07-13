import {
  make_faces_matrix,
  make_vertices_coords_folded
} from "./fold/make";
import {
  faces_containing_point,
  topmost_face,
} from "./fold/query";
import {
  axiom2
} from "./origami/axioms";

const build_folded_frame = function (graph, face_stationary = 0) {
  const faces_matrix = make_faces_matrix(graph, face_stationary);
  const vertices_coords = make_vertices_coords_folded(graph, face_stationary, faces_matrix);
  return {
    vertices_coords,
    "faces_re:matrix": faces_matrix
  };
};

const setup = function (origami, svg) {
  let cachedGraph = origami.copy(); // JSON.parse(JSON.stringify(origami));
  let touchFaceIndex = 0; // which faces the user touched, to begin folding
  svg.events.addEventListener("onMouseDown", (mouse) => {
    cachedGraph = origami.copy(); // JSON.parse(JSON.stringify(origami));
    // this shifts the folded coords into the vertices_coords position
    cachedGraph.fold();
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
      origami.load(cachedGraph);
      const instruction = axiom2(mouse.pressed, mouse.position);
      origami.valleyFold(instruction.solutions[0], touchFaceIndex);
    }
  });
};

export default setup;
