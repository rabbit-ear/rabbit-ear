// import Segmentize from "../include/svg-segmentize";
import color_to_assignment from "./color_to_assignment";
import get_fold_angle from "./get_fold_angle";
import fragment from "./graph/fragment";
// import convert from "../include/fold/convert";
// import remove_collinear_vertices from "./graph/collinear";
// import window from "./environment/window";
import findBoundary from "./graph/boundary";

// const Segmentize = window.Segmentize || require("svg-segmentize");
// const FOLD = window.FOLD || require("fold");
import Segmentize from "../../svg-segmentize";
import convert from "../../fold/convert";

const FOLD = { convert };

const assignment_foldAngle = {
  V: 180, v: 180, M: -180, m: -180
};

const assignment_to_foldAngle = function (assignment) {
  return assignment_foldAngle[assignment] || 0;
};

const emptyFOLD = function () {
  return {
    file_spec: 1.1,
    file_creator: "Rabbit Ear",
    file_classes: ["singleModel"],
    frame_title: "",
    frame_classes: ["creasePattern"],
    frame_attributes: ["2D"],
    vertices_coords: [],
    vertices_vertices: [],
    vertices_faces: [],
    edges_vertices: [],
    edges_faces: [],
    edges_assignment: [],
    edges_foldAngle: [],
    edges_length: [],
    faces_vertices: [],
    faces_edges: []
  };
};

const svg_to_fold = function (svg, options) {
  const pre_frag = emptyFOLD();
  const v0 = pre_frag.vertices_coords.length;
  const segments = Segmentize(svg, { output: "data" });

  pre_frag.vertices_coords = segments
    .map(s => [[s[0], s[1]], [s[2], s[3]]])
    .reduce((a, b) => a.concat(b), pre_frag.vertices_coords);
  pre_frag.edges_vertices = segments.map((_, i) => [v0 + i * 2, v0 + i * 2 + 1]);
  pre_frag.edges_assignment = segments
    .map(a => a[4])
    .map(attrs => (attrs != null ? color_to_assignment(attrs.stroke) : "U"));

  // here
  // console.log("look for opacity here", segments.map(a => a[4]));
  // here

  const graph = fragment(pre_frag, options.epsilon);
  // remove_collinear_vertices(graph);
  FOLD.convert.edges_vertices_to_vertices_vertices_sorted(graph);
  FOLD.convert.vertices_vertices_to_faces_vertices(graph);
  FOLD.convert.faces_vertices_to_faces_edges(graph);
  graph.edges_foldAngle = graph.edges_assignment.map(a => assignment_to_foldAngle(a));
  // graph.edges_assignment = walkBoundary(graph);
  if (options.boundary !== false) {
    findBoundary(graph).forEach((edgeIndex) => {
      graph.edges_assignment[edgeIndex] = "B";
    });
  }

  return graph;
};

export default svg_to_fold;
