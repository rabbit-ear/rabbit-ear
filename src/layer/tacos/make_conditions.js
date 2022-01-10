import math from "../../math";
import lookup from "./lookup";
import make_tacos_tortillas from "./make_tacos_tortillas";
import walk_pleat_paths from "./walk_pleat_paths";
import make_faces_faces_overlap from "../../graph/make_faces_faces_overlap";
import {
  make_faces_winding
} from "../../graph/make";
import {
  boolean_matrix_to_unique_index_pairs
} from "../../general/arrays";

const make_overlapping_face_trios = (graph, overlap_matrix, epsilon = 1e-6) => {
  // console.log("make_overlapping_face_trios");
  const faces_winding = make_faces_winding(graph);
  // prepare a list of all faces in the graph as lists of vertices
  // also, make sure they all have the same winding (reverse if necessary)
  const polygons = graph.faces_vertices
    .map(face => face
      .map(v => graph.vertices_coords[v]));
  polygons.forEach((face, i) => {
    if (!faces_winding[i]) { face.reverse(); }
  });
  const matrix = graph.faces_vertices.map(() => []);
  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      if (!overlap_matrix[i][j]) { continue; }
      const polygon = math.core.intersect_polygon_polygon(polygons[i], polygons[j]);
      if (polygon.length !== 0) { matrix[i][j] = polygon; }
    }
  }
  const trios = [];
  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      if (!matrix[i][j]) { continue; }
      for (let k = j + 1; k < matrix.length; k++) {
        if (i === k || j === k) { continue; }
        if (!overlap_matrix[i][k] || !overlap_matrix[j][k]) { continue; }
        const polygon = math.core.intersect_polygon_polygon(matrix[i][j], polygons[k]);
        if (polygon.length !== 0) { trios.push([i, j, k].sort((a, b) => a - b)); }
      }
    }
  }
  return trios;
};

const filter_transitivity = (overlapping_face_trios, tacos_tortillas) => {
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
  
  tacos_tortillas.taco_tortilla.map(el => [
    el.taco[0], el.taco[1], el.tortilla
  ])
  .map(trio => trio
    .sort((a, b) => a - b)
    .join(" "))
  .forEach(key => { tacos_trios[key] = true; });
  console.log("tacos_trios", tacos_trios);

  return overlapping_face_trios
    .filter(trio => tacos_trios[trio.join(" ")] === undefined);
}


// pretty fast hash function for Javascript strings
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
const stringToHash = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

// const count_conditions = conditions => Object
//   .keys(conditions)
//   .filter(key => conditions[key] !== 0)
//   .length;

const half_matrix = (matrix) => {
  const half = JSON.parse(JSON.stringify(matrix));
  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      half[j][i] = undefined;
    }
  }
  return half;
};

const prepare_maps = tacos_face_pairs => tacos_face_pairs
  .map(face_pairs => {
    const keys_ordered = face_pairs.map(pair => pair[0] < pair[1]);
    const face_keys = face_pairs.map((pair, i) => keys_ordered[i]
      ? `${pair[0]} ${pair[1]}`
      : `${pair[1]} ${pair[0]}`);
    return { keys_ordered, face_keys };
  });

const fill_layer_maps = (maps, layers, conditions) => maps
  .forEach((map, i) => map.face_keys
    .forEach((key, j) => {
      if (!(key in conditions)) {
        console.warn(key, "not in conditions");
        return;
      }
      if (conditions[key] !== 0) {
        const correct_flip = map.keys_ordered[j]
          ? conditions[key]
          : -conditions[key];
        // convert above/below encoding (1, -1) to (1, 2)
        layers[i][j] = correct_flip === -1 ? 2 : 1;
      }
    }));

const infer_next_steps = (maps, layers, lookup_table) => maps
  .map((map, i) => {
    const key = layers[i].join("");
    const next_step = lookup_table[key];
    if (next_step === 0) {
      throw "unsolvable";
    }
    if (next_step === 1) { return; }
    // modify map with the suggestion, move it to the next state.
    layers[i][next_step[0]] = next_step[1];
    // prepare the suggestion to be added to the global conditions
    const next_step_key = map.face_keys[next_step[0]];
    const next_step_key_ordered = map.keys_ordered[next_step[0]];
    // convert above/below encoding (1, 2) to (1, -1)
    const next_step_solution_unordered = next_step[1] === 2 ? -1 : 1;
    const next_step_solution = next_step_key_ordered
      ? next_step_solution_unordered
      : -next_step_solution_unordered;
    // console.log("next_step", next_step, next_step_key, next_step_solution);
    return [next_step_key, next_step_solution];
  })
  .filter(a => a !== undefined);

const make_conditions = (graph, epsilon = 1e-6) => {
  const start_conditions = {};

  const overlap_matrix = make_faces_faces_overlap(graph, epsilon);
  boolean_matrix_to_unique_index_pairs(half_matrix(overlap_matrix))
    .map(pair => pair.join(" "))
    .forEach(key => { start_conditions[key] = 0; });

  // kabuto_test_file(conditions);
  
  // neighbor faces determined by crease between them
  const assignment_direction = { M: 1, m: 1, V: -1, v: -1 };
  const faces_winding = make_faces_winding(graph);
  // console.log("faces_winding", faces_winding);
  graph.edges_faces.forEach((faces, edge) => {
    const assignment = graph.edges_assignment[edge];
    const direction = assignment_direction[assignment];
    if (faces.length < 2 || direction === undefined) { return; }
    const upright = faces_winding[faces[0]];
    const relationship = upright ? direction : -direction;
    const key1 = `${faces[0]} ${faces[1]}`;
    const key2 = `${faces[1]} ${faces[0]}`;
    if (key1 in start_conditions) { start_conditions[key1] = relationship; }
    if (key2 in start_conditions) { start_conditions[key2] = -relationship; }
  });

  // console.log("BEFORE", JSON.parse(JSON.stringify(start_conditions)));

  // const pairs = walk_pleat_paths(graph, undefined, epsilon);
  // console.log("pairs", pairs);
  // pairs
  //   .map(pair => pair.join(" "))
  //   .filter(key => start_conditions[key] === 0)
  //   .forEach(key => { start_conditions[key] = 1; });

  // pairs
  //   .map(pair => pair.slice().reverse().join(" "))
  //   .filter(key => start_conditions[key] === 0)
  //   .forEach(key => { start_conditions[key] = -1; });

  // console.log("AFTER", JSON.parse(JSON.stringify(start_conditions)));

  const tacos_tortillas = make_tacos_tortillas(graph, epsilon);
  const overlapping_face_trios = make_overlapping_face_trios(graph, overlap_matrix, epsilon);
  console.log("tacos_tortillas", tacos_tortillas);
  const transitivity_trios = filter_transitivity(overlapping_face_trios, tacos_tortillas);
  console.log("overlapping_face_trios", overlapping_face_trios);
  console.log("transitivity_trios", transitivity_trios);
  // const pleat_paths = walk_all_pleat_paths(graph);
  // console.log("tacos_tortillas", tacos_tortillas);

  // keys_ordered answers "is the first face < than second face" regarding
  // how this will be used to reference the conditions lookup table.

  // A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
  // "(A,C) (B,D) (B,C) (A,D) (A,B) (C,D)"
  const taco_taco_pairs = tacos_tortillas.taco_taco.map(el => [
    [el[0][0], el[0][1]],
    [el[1][0], el[1][1]],
    [el[1][0], el[0][1]],
    [el[0][0], el[1][1]],
    [el[0][0], el[1][0]],
    [el[0][1], el[1][1]],
  ]);
  // A-C is the taco, B is the tortilla. A:taco[0] C:taco[1] B:tortilla
  // (A,C) (A,B) (B,C)
  const taco_tortilla_pairs = tacos_tortillas.taco_tortilla.map(el => [
    [el.taco[0], el.taco[1]],
    [el.taco[0], el.tortilla],
    [el.tortilla, el.taco[1]],
  ]);
  // A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
  // (A,C) (B,D)
  const tortilla_tortilla_pairs = tacos_tortillas.tortilla_tortilla.map(el => [
    [el[0][0], el[0][1]],
    [el[1][0], el[1][1]],
  ]);
  // transitivity
  // (A,B) (B,C) (C,A)
  const transitivity_pairs = transitivity_trios.map(el => [
    [el[0], el[1]],
    [el[1], el[2]],
    [el[2], el[0]],
  ]);

  const taco_taco_map = prepare_maps(taco_taco_pairs);
  const taco_tortilla_map = prepare_maps(taco_tortilla_pairs);
  const tortilla_tortilla_map = prepare_maps(tortilla_tortilla_pairs);
  const transitivity_map = prepare_maps(transitivity_pairs);

  const start_layers = {
    taco_taco: taco_taco_pairs.map(el => Array(el.length).fill(0)),
    taco_tortilla: taco_tortilla_pairs.map(el => Array(el.length).fill(0)),
    tortilla_tortilla: tortilla_tortilla_pairs.map(el => Array(el.length).fill(0)),
    transitivity: transitivity_pairs.map(el => Array(el.length).fill(0)),
  };

  // console.log("taco_taco_pairs", taco_taco_pairs);
  // console.log("taco_tortilla_pairs", taco_tortilla_pairs);
  // console.log("tortilla_tortilla_pairs", tortilla_tortilla_pairs);
  // console.log("taco_taco_map", taco_taco_map);
  // console.log("taco_tortilla_map", taco_tortilla_map);
  // console.log("tortilla_tortilla_map", tortilla_tortilla_map);
  // console.log("layers", start_layers);

  // key: hash, value: conditions
  const solutions = {};

  let recurse_count = 0;
  // recursively uncover the remaining conditions
  const recurse = (conditions, layers) => {
    if (recurse_count < 10)
      console.log(recurse_count, "recurse", Object.values(conditions).filter(n => n === 0).length);
    recurse_count++;
    // given the current set of conditions, complete them as much as possible
    // only adding the determined results certain from the current state.
    let inner_loop_count = 0;
    let next_steps;
    do {
      try {
        fill_layer_maps(taco_taco_map, layers.taco_taco, conditions);
        fill_layer_maps(taco_tortilla_map, layers.taco_tortilla, conditions);
        fill_layer_maps(tortilla_tortilla_map, layers.tortilla_tortilla, conditions);
        fill_layer_maps(transitivity_map, layers.transitivity, conditions);
        next_steps = [
          infer_next_steps(taco_taco_map, layers.taco_taco, lookup.taco_taco),
          infer_next_steps(taco_tortilla_map, layers.taco_tortilla, lookup.taco_tortilla),
          infer_next_steps(tortilla_tortilla_map, layers.tortilla_tortilla, lookup.tortilla_tortilla),
          infer_next_steps(transitivity_map, layers.transitivity, lookup.transitivity),
        ].reduce((a, b) => a.concat(b), []);
        // console.log("solver loop", inner_loop_count, next_steps);
        next_steps.forEach(el => { conditions[el[0]] = el[1]; });
        inner_loop_count++;
      } catch (error) {
        // console.warn(recurse_count, error);
        return; // no solution on this branch
      }
    } while (next_steps.length > 0);
    // console.log("inner loop", inner_loop_count);

    const zero_keys = Object.keys(conditions)
      .map(key => conditions[key] === 0 ? key : undefined)
      .filter(a => a !== undefined);

    if (zero_keys.length === 0) {
      const stringified = JSON.stringify(conditions);
      const hash = stringToHash(stringified);
      if (hash in solutions) {
        if (JSON.stringify(solutions[hash]) !== stringified) {
          console.warn("hash function broken");
        }
      }
      solutions[hash] = conditions;
      return;
    }
    // console.log("zero_keys", zero_keys);

    // return zero_keys.map(key => [-1, 1].map(dir => {
    //   const clone_conditions = JSON.parse(JSON.stringify(conditions));
    //   const clone_layers = JSON.parse(JSON.stringify(layers));
    //   clone_conditions[key] = dir;
    //   return recurse(clone_conditions, clone_layers);
    // }));
  };

  recurse(start_conditions, start_layers);

  console.log(recurse_count, "recursion count");

  return Object.values(solutions);
};

const kabuto_test_file = conditions => Object.assign(conditions, { "0 1": 1, "0 3": -1, "0 4": -1, "0 5": 0, "0 8": 1, "0 9": 1, "0 10": -1, "0 11": -1, "0 14": 0, "0 15": -1, "0 17": 0, "1 2": -1, "1 3": -1, "1 4": -1, "1 5": -1, "1 6": -1, "1 7": -1, "1 8": 1, "1 9": 1, "1 10": -1, "1 11": -1, "1 12": -1, "1 13": -1, "1 14": -1, "1 15": -1, "1 16": -1, "1 17": -1, "2 5": 0, "2 6": -1, "2 7": -1, "2 8": 1, "2 9": 1, "2 12": -1, "2 13": -1, "2 14": 0, "2 16": -1, "2 17": 0, "3 4": 1, "3 5": 0, "3 8": 1, "3 9": 1, "3 10": -1, "3 11": -1, "3 14": 0, "3 15": -1, "3 17": 0, "4 5": 0, "4 8": 1, "4 9": 1, "4 10": -1, "4 11": -1, "4 14": 0, "4 15": -1, "4 17": 0, "5 6": 0, "5 7": 0, "5 8": 1, "5 9": 1, "5 10": 0, "5 11": 0, "5 12": 0, "5 13": 0, "5 14": 1, "5 15": 0, "5 16": 0, "5 17": 1, "6 7": 1, "6 8": 1, "6 9": 1, "6 12": -1, "6 13": -1, "6 14": 0, "6 16": -1, "6 17": 0, "7 8": 1, "7 9": 1, "7 12": -1, "7 13": -1, "7 14": 0, "7 16": -1, "7 17": 0, "8 9": 1, "8 10": -1, "8 11": -1, "8 12": -1, "8 13": -1, "8 14": -1, "8 15": -1, "8 16": -1, "8 17": -1, "9 10": -1, "9 11": -1, "9 12": -1, "9 13": -1, "9 14": -1, "9 15": -1, "9 16": -1, "9 17": -1, "10 11": -1, "10 14": 0, "10 15": -1, "10 17": 0, "11 14": 0, "11 15": -1, "11 17": 0, "12 13": 1, "12 14": 0, "12 16": -1, "12 17": 0, "13 14": 0, "13 16": -1, "13 17": 0, "14 15": 0, "14 16": 0, "14 17": 1, "15 17": 0, "16 17": 0});

export default make_conditions;
