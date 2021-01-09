import { edges_assignment_names } from "../graph/fold_spec";
import axiom_instructions_data from "../text/axioms.json";

// the diagram frame IS little fold files.
// each arrow has vertices_coords. the arrow path is an edges_vertices: [0, 1]
const axiom_instructions = JSON.parse(axiom_instructions_data);
/**
 * given an axiom number 1-7 get the instruction step in all languages
 */
const get_instructions_for_axiom = (axiom) => {
  const instructions = {};
  Object.keys(axiom_instructions).forEach((key) => {
    instructions[key] = axiom_instructions[key][axiom];
  });
  return instructions;
};

const make_instructions = (construction) => {
  const axiom = construction.axiom || 0;
  if (!isNaN(axiom) && axiom != null && axiom > 0 && axiom < 8) {
    return get_instructions_for_axiom(axiom);
  }
  return construction.assignment
		? { en: `${edges_assignment_names[construction.assignment]} fold` }
		: { en: "" };
};

const diagram_step = (construction) => {
  switch (construction.type) {
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
          "re:diagram_line_classes": [edges_assignment_names[construction.assignment]],
          "re:diagram_line_coords": construction.edge,
        }],
        "re:diagram_arrows": [{
          "re:diagram_arrowClasses": [],
          "re:diagram_arrow_coords": make_arrow_coords(construction, graph)
        }],
        "re:diagram_instructions": make_instructions(construction)
      };
    case "squash":
    case "sink":
    case "pleat":
    default:
      return { error: `construction type (${construction.type}) not yet defined` };
  }
};

export default diagram_step;

