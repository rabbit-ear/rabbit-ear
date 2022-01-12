import math from "../../math";
import solver from "./solver";
import make_tacos_tortillas from "../tacos/make_tacos_tortillas";
import make_transitivity_trios from "../tacos/make_transitivity_trios";
// import walk_pleat_paths from "./walk_pleat_paths";
import make_faces_faces_overlap from "../../graph/make_faces_faces_overlap";
import {
  make_faces_winding
} from "../../graph/make";

// const set_pleat_walk_paths = (conditions) => {
//   console.log("BEFORE", JSON.parse(JSON.stringify(conditions)));
//   const pairs = walk_pleat_paths(graph, undefined, epsilon);
//   console.log("pairs", pairs);
//   pairs
//     .map(pair => pair.join(" "))
//     .filter(key => conditions[key] === 0)
//     .forEach(key => { conditions[key] = 1; });
//   pairs
//     .map(pair => pair.slice().reverse().join(" "))
//     .filter(key => conditions[key] === 0)
//     .forEach(key => { conditions[key] = -1; });
//   console.log("AFTER", JSON.parse(JSON.stringify(conditions)));  
// };

/**
 * @description given a full set of trios of faces which overlap each other,
 * remove the three which are already covered in the taco-taco case.
 */
const filter_transitivity = (transitivity_trios, tacos_tortillas) => {
  // using the list of all taco-taco conditions, store all permutations of
  // the three faces (sorted low to high) into a dictionary for quick lookup.
  // store them as space-separated strings.
  const tacos_trios = {};
  tacos_tortillas.taco_taco.map(tacos => [
    [tacos[0][0], tacos[0][1], tacos[1][0]], // a b c
    [tacos[0][0], tacos[0][1], tacos[1][1]], // a b d
    [tacos[0][0], tacos[1][0], tacos[1][1]], // a c d
    [tacos[0][1], tacos[1][0], tacos[1][1]], // b c d
  ])
  .forEach(trios => trios
    .map(trio => trio
      .sort((a, b) => a - b)
      .join(" "))
    .forEach(key => { tacos_trios[key] = true; }));
  // convert all taco-tortilla cases into similarly-formatted,
  // space-separated strings.
  tacos_tortillas.taco_tortilla.map(el => [
    el.taco[0], el.taco[1], el.tortilla
  ])
  .map(trio => trio
    .sort((a, b) => a - b)
    .join(" "))
  .forEach(key => { tacos_trios[key] = true; });
  // return the filtered set of trios.
  return transitivity_trios
    .filter(trio => tacos_trios[trio.join(" ")] === undefined);
};

// const count_conditions = conditions => Object
//   .keys(conditions)
//   .filter(key => conditions[key] !== 0)
//   .length;

const prepare_maps = tacos_face_pairs => tacos_face_pairs
  .map(face_pairs => {
    const keys_ordered = face_pairs.map(pair => pair[0] < pair[1]);
    const face_keys = face_pairs.map((pair, i) => keys_ordered[i]
      ? `${pair[0]} ${pair[1]}`
      : `${pair[1]} ${pair[0]}`);
    return { keys_ordered, face_keys };
  });

const refactor_pairs = (tacos_tortillas, transitivity_trios) => {
  const pairs = {};
  // A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
  // "(A,C) (B,D) (B,C) (A,D) (A,B) (C,D)"
  pairs.taco_taco = tacos_tortillas.taco_taco.map(el => [
    [el[0][0], el[0][1]],
    [el[1][0], el[1][1]],
    [el[1][0], el[0][1]],
    [el[0][0], el[1][1]],
    [el[0][0], el[1][0]],
    [el[0][1], el[1][1]],
  ]);
  // A-C is the taco, B is the tortilla. A:taco[0] C:taco[1] B:tortilla
  // (A,C) (A,B) (B,C)
  pairs.taco_tortilla = tacos_tortillas.taco_tortilla.map(el => [
    [el.taco[0], el.taco[1]],
    [el.taco[0], el.tortilla],
    [el.tortilla, el.taco[1]],
  ]);
  // A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
  // (A,C) (B,D)
  pairs.tortilla_tortilla = tacos_tortillas.tortilla_tortilla.map(el => [
    [el[0][0], el[0][1]],
    [el[1][0], el[1][1]],
  ]);
  // transitivity
  // (A,B) (B,C) (C,A)
  pairs.transitivity = transitivity_trios.map(el => [
    [el[0], el[1]],
    [el[1], el[2]],
    [el[2], el[0]],
  ]);
  return pairs;
};

const solve_layer_order = (graph, epsilon = 1e-6) => {
  const overlap_matrix = make_faces_faces_overlap(graph, epsilon);
  const faces_winding = make_faces_winding(graph);
  const tacos_tortillas = make_tacos_tortillas(graph, epsilon);
  const unfiltered_trios = make_transitivity_trios(graph, overlap_matrix, faces_winding, epsilon);
  const transitivity_trios = filter_transitivity(unfiltered_trios, tacos_tortillas);

  const pairs = refactor_pairs(tacos_tortillas, transitivity_trios);
  // keys_ordered answers "is the first face < than second face" regarding
  // how this will be used to reference the conditions lookup table.
  const maps = {
    taco_taco: prepare_maps(pairs.taco_taco),
    taco_tortilla: prepare_maps(pairs.taco_tortilla),
    tortilla_tortilla: prepare_maps(pairs.tortilla_tortilla),
    transitivity: prepare_maps(pairs.transitivity),
  };

  // console.log("tacos_tortillas", tacos_tortillas);
  // console.log("unfiltered_trios", unfiltered_trios);
  // console.log("transitivity_trios", transitivity_trios);
  // console.log("pairs", pairs);
  // console.log("maps", maps);

  return solver(graph, maps, overlap_matrix, faces_winding);
};

export default solve_layer_order;
