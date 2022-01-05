import lookup from "./lookup";
import make_tacos_tortillas from "./make_tacos_tortillas";
import make_faces_faces_overlap from "../../graph/make_faces_faces_overlap";
import {
  make_faces_winding
} from "../../graph/make";
import {
  boolean_matrix_to_unique_index_pairs
} from "../../general/arrays";

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
    return {
      keys_ordered,
      face_keys,
      layer_map: Array(face_pairs.length).fill(0),
    };
  });

const fill_layer_maps = (maps, conditions) => maps
  .forEach(map => map.face_keys
    .forEach((key, i) => {
      if (!(key in conditions)) {
        console.warn(key, "not in conditions");
        return;
      }
      if (conditions[key] !== 0) {
        const correct_flip = map.keys_ordered[i]
          ? conditions[key]
          : -conditions[key];
        // convert above/below encoding (1, -1) to (1, 2)
        map.layer_map[i] = correct_flip === -1 ? 2 : 1;
      }
    }));

const infer_next_steps = (maps, lookup_table) => maps
  .map((map, i) => {
    const key = map.layer_map.join("");
    const next_step = lookup_table[key];
    if (next_step === 0) {
      console.warn("error, unsolvable", maps, i);
      return;
    }
    if (next_step === 1) { return; }
    // modify map with the suggestion, move it to the next state.
    map.layer_map[next_step[0]] = next_step[1];
    // prepare the suggestion to be added to the global conditions
    const next_step_key = map.face_keys[next_step[0]];
    const next_step_key_ordered = map.keys_ordered[next_step[0]];
    // convert above/below encoding (1, 2) to (1, -1)
    const next_step_solution_unordered = next_step[1] === 2 ? -1 : 1;
    const next_step_solution = next_step_key_ordered
      ? next_step_solution_unordered
      : -next_step_solution_unordered;
    // console.log("next_step", next_step, next_step_key, next_step_solution);
    // return suggestion
    return [next_step_key, next_step_solution];
  })
  .filter(a => a !== undefined);

const make_conditions = (graph, epsilon = 1e-6) => {
  // overlap conditions
  // todo: turn this back into "const"
  let conditions = {};
  // const fail_conditions = {};
  const overlap_matrix = make_faces_faces_overlap(graph, epsilon);
  boolean_matrix_to_unique_index_pairs(half_matrix(overlap_matrix))
    .map(pair => pair.join(" "))
    .forEach(key => { conditions[key] = 0; });
  
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
    if (key1 in conditions) { conditions[key1] = relationship; }
    if (key2 in conditions) { conditions[key2] = -relationship; }
  });

  // console.log("conditions count, neighbor faces", count_conditions(conditions));

  // each single-vertex layer order, individually
  // const vertices_faces_layer = ear.graph.make_vertices_faces_layer(graph, 0, epsilon);
  // vertices_faces_layer
  //   .filter(solutions => solutions.length === 1)
  //   .map(solutions => solutions[0])
  //   .map(ear.layer.faces_layer_to_relationships)
  //   .forEach(group => group.forEach(order => {
  //     const key = `${order[0]} ${order[1]}`;
  //     if (key in conditions) { conditions[key] = order[2]; }
  //   }));
  // vertices_faces_layer
  //   .filter(solutions => solutions.length > 1)
  //   .map(ear.layer.common_relationships)
  //   .forEach(group => group.forEach(order => {
  //     const key = `${order[0]} ${order[1]}`;
  //     if (key in conditions) { conditions[key] = order[2]; }
  //   }));
  // console.log("conditions count, single-vertices", count_conditions(conditions));

  const tacos_tortillas = make_tacos_tortillas(graph, epsilon);
  console.log("tacos_tortillas", tacos_tortillas);

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

  const taco_taco_map = prepare_maps(taco_taco_pairs);
  const taco_tortilla_map = prepare_maps(taco_tortilla_pairs);
  const tortilla_tortilla_map = prepare_maps(tortilla_tortilla_pairs);
  // console.log("taco_taco_map", taco_taco_map);
  // console.log("taco_tortilla_map", taco_tortilla_map);
  // console.log("tortilla_tortilla_map", tortilla_tortilla_map);

  let next_steps;
  let round = 0;
  do {
    fill_layer_maps(taco_taco_map, conditions);
    fill_layer_maps(taco_tortilla_map, conditions);
    fill_layer_maps(tortilla_tortilla_map, conditions);

    next_steps = [
      infer_next_steps(taco_taco_map, lookup.taco_taco),
      infer_next_steps(taco_tortilla_map, lookup.taco_tortilla),
      infer_next_steps(tortilla_tortilla_map, lookup.tortilla_tortilla),
    ].reduce((a, b) => a.concat(b), []);

    console.log("solver loop", round, next_steps);

    next_steps.forEach(el => { conditions[el[0]] = el[1]; });
    round++;
  } while (next_steps.length > 0);

  return conditions;
};

export default make_conditions;
