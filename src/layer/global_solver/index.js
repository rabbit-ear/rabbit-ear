import make_tacos_tortillas from "../tacos/make_tacos_tortillas";
import make_transitivity_trios from "../tacos/make_transitivity_trios";
import filter_transitivity from "../tacos/filter_transitivity";
import { make_faces_faces_overlap } from "../../graph/overlap";
import { make_faces_winding } from "../../graph/faces_winding";
import { unsigned_to_signed_conditions } from "./general";

import make_taco_maps from "./make_taco_maps";
import make_conditions from "./make_conditions";
import single_solver from "./single_solver";
import recursive_solver from "./recursive_solver";
import { dividing_axis } from "./dividing_axis";

const make_maps_and_conditions = (graph, epsilon = 1e-6) => {
  const overlap_matrix = make_faces_faces_overlap(graph, epsilon);
  const faces_winding = make_faces_winding(graph);
  // conditions encodes every pair of overlapping faces as a space-separated
  // string, low index first, as the keys of an object.
  // initialize all values to 0, but set neighbor faces to either 1 or 2.
  const conditions = make_conditions(graph, overlap_matrix, faces_winding);
  // get all taco/tortilla/transitivity events.
  const tacos_tortillas = make_tacos_tortillas(graph, epsilon);
  const unfiltered_trios = make_transitivity_trios(graph, overlap_matrix, faces_winding, epsilon);
  const transitivity_trios = filter_transitivity(unfiltered_trios, tacos_tortillas);
  // format the tacos and transitivity data into maps that relate to the
  // lookup table at the heart of the algorithm, located at "table.js"
  const maps = make_taco_maps(tacos_tortillas, transitivity_trios);
  // console.log("overlap_matrix", overlap_matrix);
  // console.log("faces_winding", faces_winding);
  // console.log("tacos_tortillas", tacos_tortillas);
  // console.log("unfiltered_trios", unfiltered_trios);
  // console.log("transitivity_trios", transitivity_trios);
  // console.log("maps", maps);
  // console.log("conditions", conditions);
  return { maps, conditions };
};

export const one_layer_conditions = (graph, epsilon = 1e-6) => {
  const data = make_maps_and_conditions(graph, epsilon);
  const solutions = single_solver(graph, data.maps, data.conditions);
  return solutions;
};

export const all_layer_conditions = (graph, epsilon = 1e-6) => {
  const data = make_maps_and_conditions(graph, epsilon);
  const solutions = recursive_solver(graph, data.maps, data.conditions);
  solutions.certain = unsigned_to_signed_conditions(JSON.parse(JSON.stringify(data.conditions)));
  return solutions;
};


const make_maps_and_conditions_dividing_axis = (folded, cp, line, epsilon = 1e-6) => {
  const overlap_matrix = make_faces_faces_overlap(folded, epsilon);
  const faces_winding = make_faces_winding(folded);
  const conditions = make_conditions(folded, overlap_matrix, faces_winding);
  dividing_axis(cp, line, conditions);
  // get all taco/tortilla/transitivity events.
  const tacos_tortillas = make_tacos_tortillas(folded, epsilon);
  const unfiltered_trios = make_transitivity_trios(folded, overlap_matrix, faces_winding, epsilon);
  const transitivity_trios = filter_transitivity(unfiltered_trios, tacos_tortillas);
  // format the tacos and transitivity data into maps that relate to the
  // lookup table at the heart of the algorithm, located at "table.js"
  const maps = make_taco_maps(tacos_tortillas, transitivity_trios);
  return { maps, conditions };
};

export const one_layer_conditions_with_axis = (folded, cp, line, epsilon = 1e-6) => {
  const data = make_maps_and_conditions_dividing_axis(folded, cp, line, epsilon);
  const solutions = single_solver(folded, data.maps, data.conditions);
  return solutions;
};

export const all_layer_conditions_with_axis = (folded, cp, line, epsilon = 1e-6) => {
  const data = make_maps_and_conditions_dividing_axis(folded, cp, line, epsilon);
  const solutions = recursive_solver(folded, data.maps, data.conditions);
  solutions.certain = unsigned_to_signed_conditions(JSON.parse(JSON.stringify(data.conditions)));
  return solutions;
};
