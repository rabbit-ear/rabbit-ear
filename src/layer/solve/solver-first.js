import lookup from "./lookup";
import { boolean_matrix_to_unique_index_pairs } from "../../general/arrays";

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
/**
 * @description this is the initial step for building a set of conditions.
 * store the relationships between all adjacent faces, taking into
 * consideration if a face has been flipped (clockwise winding), and
 * the crease assignment of the edge between the pair of faces.
 */
const init_conditions = (graph, overlap_matrix, faces_winding) => {
  const conditions = {};
  // set all conditions (every pair of overlapping faces) initially to 0
  boolean_matrix_to_unique_index_pairs(overlap_matrix)
    .map(pair => pair.join(" "))
    .forEach(key => { conditions[key] = 0; });
  // todo: unclear if this section needs to be included.
  // tortilla-tortilla
  // complete the cases which weren't inserted due to faces not overlapping.
  // tacos_tortillas.tortilla_tortilla.forEach(el => {
  //   const key1 = [el[0][0], el[0][1]].sort((a, b) => a - b).join(" ");
  //   if (!(key1 in conditions)) {
  //     // console.log("adding new key", key1);
  //     conditions[key1] = 0;
  //   }
  //   const key2 = [el[1][0], el[1][1]].sort((a, b) => a - b).join(" ");
  //   if (!(key2 in conditions)) {
  //     // console.log("adding new key", key2);
  //     conditions[key2] = 0;
  //   }
  // });
  // neighbor faces determined by crease between them
  const assignment_direction = { M: 1, m: 1, V: -1, v: -1 };
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
  return conditions;
};

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
    if (lookup_table === lookup.tortilla_tortilla) {
      console.log("key", key, "next_step", next_step);
    }
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
    if (lookup_table === lookup.tortilla_tortilla) {
      console.log("next_step_key", next_step_key);
      console.log("next_step_solution_unordered", next_step_solution_unordered);
      console.log("next_step_solution", next_step_solution);
    }
    return [next_step_key, next_step_solution];
  })
  .filter(a => a !== undefined);

const solver = (graph, maps, overlap_matrix, faces_winding) => {
  // key: hash, value: conditions
  const solutions = {};

  let recurse_count = 0;
  // recursively uncover the remaining conditions
  const recurse = (conditions, layers) => {
    if (recurse_count < 10) {
      console.log(recurse_count, "recurse", Object.values(conditions).filter(n => n === 0).length);
    }
    recurse_count++;
    // given the current set of conditions, complete them as much as possible
    // only adding the determined results certain from the current state.
    let inner_loop_count = 0;
    let next_steps;
    do {
      try {
        fill_layer_maps(maps.taco_taco, layers.taco_taco, conditions);
        fill_layer_maps(maps.taco_tortilla, layers.taco_tortilla, conditions);
        fill_layer_maps(maps.tortilla_tortilla, layers.tortilla_tortilla, conditions);
        fill_layer_maps(maps.transitivity, layers.transitivity, conditions);
        next_steps = [
          infer_next_steps(maps.taco_taco, layers.taco_taco, lookup.taco_taco),
          infer_next_steps(maps.taco_tortilla, layers.taco_tortilla, lookup.taco_tortilla),
          infer_next_steps(maps.tortilla_tortilla, layers.tortilla_tortilla, lookup.tortilla_tortilla),
          infer_next_steps(maps.transitivity, layers.transitivity, lookup.transitivity),
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

  // initialize conditions, set all to 0, set neighbor faces to either +1/-1.
  const start_conditions = init_conditions(graph, overlap_matrix, faces_winding);

  const start_layers = {
    taco_taco: maps.taco_taco.map(el => Array(6).fill(0)),
    taco_tortilla: maps.taco_tortilla.map(el => Array(3).fill(0)),
    tortilla_tortilla: maps.tortilla_tortilla.map(el => Array(2).fill(0)),
    transitivity: maps.transitivity.map(el => Array(3).fill(0)),
  };

  // console.log("tacos_tortillas", tacos_tortillas);
  // console.log("unfiltered_trios", unfiltered_trios);
  // console.log("transitivity_trios", transitivity_trios);
  // console.log("pairs", pairs);
  // console.log("maps", maps);
  // console.log("layers", start_layers);

  recurse(start_conditions, start_layers);

  const solution_values = Object.values(solutions);
  solution_values.conditions = start_conditions;
  
  console.log(recurse_count, "recursion count");
  console.log("# zeros in conditions", Object
    .keys(start_conditions)
    .filter(key => start_conditions[key] === 0)
    .length);

  return solution_values;
};

export default solver;
