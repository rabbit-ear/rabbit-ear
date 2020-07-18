import math from "../../include/math";
import { get_boundary } from "../core/boundary";
import { edges_assignment_names } from "../core/keys";
import axiom_instructions_data from "../text/axioms.json";

// the diagram frame IS little fold files.
// each arrow has vertices_coords. the arrow path is an edges_vertices: [0, 1]

const axiom_instructions = JSON.parse(axiom_instructions_data);

const get_instructions_for_axiom = function (axiom_number) {
  if (isNaN(axiom_number) || axiom_number == null
    || axiom_number < 1 || axiom_number > 7) {
    return undefined;
  }
  const instructions = {};
  Object.keys(axiom_instructions).forEach((key) => {
    instructions[key] = axiom_instructions[key][axiom_number];
  });
  return instructions;
};

// "re:diagrams" example (these are objects inside arrays):
// [{
//  "re:diagram_lines": [{
//    "re:diagram_line_classes": ["valley"],
//    "re:diagram_line_coords": [[0,0.2], [1,0.5]]
//  }],
//  "re:diagram_arrows": [{
//    "re:diagram_arrow_classes": [],
//    "re:diagram_arrow_coords": [[0.6,0], [0.3,1]]
//  }]
// }]

const make_instructions = function (construction) {
  const axiom = construction.axiom || 0;
  // const axiom_frame = construction["re:axiom"];
  // axiom 2, simplest case
  if (!isNaN(axiom) && axiom != null && axiom > 0 && axiom < 8) {
    return get_instructions_for_axiom(axiom);
  }
  if ("assignment" in construction) {
    return { en: `${edges_assignment_names[construction.assignment]} fold` };
  }
  return { en: "" };
};

// todo: make_arrow_coords is asking for graph to calculate the
// bounding box, to clip the arrow nicely in frame. this should be
// pre-calculated


// intersect is a point on the line,
// the point which the arrow should be cast perpendicularly across
// when left undefined, intersect will be the midpoint of the line.
// const drawArrowAcross = function(crease, crossing){
// "construction" is an object that contains {
//  axiom: #number#          // which axiom was used
//  edge: [[x,y], [x,y]]     // the fold line
//  direction: [x,y]         // the normal to the fold line, direction of fold
// }
const make_arrow_coords = function (construction, graph) {
  const axiom = construction.axiom || 0;
  const crease_edge = construction.edge;
  const arrow_vector = construction.direction;

  const axiom_frame = construction;
  // axiom 2, simplest case
  if (axiom === 2) {
    // todo: these are reversed
    return [axiom_frame.parameters.points[1], axiom_frame.parameters.points[0]];
  }
  if (axiom === 5) {
    // todo: these are reversed
    // axiom_frame.test.points_reflected[0]
    return [axiom_frame.parameters.points[1], axiom_frame.test.points_reflected[1]];
  }
  if (axiom === 7) {
    // todo: these are reversed
    // axiom_frame.test.points_reflected[0]
    return [axiom_frame.parameters.points[0], axiom_frame.test.points_reflected[0]];
  }
  const crease_vector = [
    crease_edge[1][0] - crease_edge[0][0],
    crease_edge[1][1] - crease_edge[0][1]
  ];
  let crossing;
  switch (axiom) {
    // case 1:
    //   crossing = math.core.average(axiom_frame.parameters.points);
    //   break;
    case 4:
      crossing = math.core.nearest_point_on_line(
        crease_vector, crease_edge[0], axiom_frame.parameters.lines[0][0], (a => a)
      );
      break;
    case 7:
      crossing = math.core.nearest_point_on_line(
        crease_vector, crease_edge[0], axiom_frame.parameters.points[0], (a => a)
      );
      break;
    default:
      crossing = math.core.average(crease_edge[0], crease_edge[1]);
      break;
  }
  const perpLine = { point: crossing, vector: arrow_vector };

  const boundary = get_boundary(graph).vertices
    .map(v => graph.vertices_coords[v]);
  const perpClipEdge = math.core.intersection.convex_poly_line(
    boundary, crossing, arrow_vector
  );
  if (perpClipEdge === undefined) {
    // todo: something is causing this to happen. when you flip over the page,
    // far from where it started, then perform folds. when your fold starts
    // and ends outside the bounds of the piece on one side of it.
    return [];
  }
  let short_length = [perpClipEdge[0], perpClipEdge[1]]
    .map(n => math.core.distance2(n, crossing))
    .sort((a, b) => a - b)
    .shift();
  if (axiom === 7) {
    short_length = math.core.distance2(construction.parameters.points[0], crossing);
  }
  const short_vector = arrow_vector.map(v => v * short_length);
  return [
    crossing.map((c, i) => c - short_vector[i]),
    crossing.map((c, i) => c + short_vector[i])
  ];
};

const build_diagram_frame = function (graph) {
  const c = graph["re:construction"];
  if (c == null) {
    console.warn("couldn't build diagram. construction info doesn't exist");
    return {};
  }
  switch (c.type) {
    case "flip":
      return {
        "re:diagram_arrows": [{
          "re:diagram_arrow_classes": ["flip"],
          "re:diagram_arrow_coords": []
        }],
        "re:diagram_instructions": { en: "flip over" }
      };
    case "fold":
      return {
        "re:diagram_lines": [{
          "re:diagram_line_classes": [edges_assignment_names[c.assignment]],
          "re:diagram_line_coords": c.edge,
        }],
        "re:diagram_arrows": [{
          "re:diagram_arrowClasses": [],
          "re:diagram_arrow_coords": make_arrow_coords(c, graph)
        }],
        "re:diagram_instructions": make_instructions(c)
      };
    case "squash":
    case "sink":
    case "pleat":
    default:
      return { error: `construction type (${c.type}) not yet defined` };
  }
};

export default build_diagram_frame;
