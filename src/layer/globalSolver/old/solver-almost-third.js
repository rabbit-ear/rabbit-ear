import lookup from "./lookup";
import hashCode from "../../general/hashCode";
import { booleanMatrixToUniqueIndexPairs } from "../../general/arrays";
const taco_types = Object.freeze(Object.keys(lookup));
/**
 * @description a layer orientation between two faces is encoded as:
 * 0: unknown, 1: face A is above B, 2: face B is above A.
 * this map will flip 1 and 2, leaving 0 to be 0.
 */
const flip = {
  0: 0,
  1: 2,
  2: 1,
};
/**
 * @description given an encoding of all face-pair orientations,
 * find out how many face-pair relationships are unknown.
 */
const zero_count = obj => Object.keys(obj)
  .filter(key => obj[key] === 0)
  .length;
/**
 * @description this is the initial step for building a set of conditions.
 * store the relationships between all adjacent faces, taking into
 * consideration if a face has been flipped (clockwise winding), and
 * the crease assignment of the edge between the pair of faces.
 * @returns dictionary, keys are space-separated face pairs, like "3 17".
 * values are layer orientations, 0 (unknown) 1 (a above b) 2 (b above a).
 */
const init_conditions = (graph, overlap_matrix, faces_winding) => {
  const conditions = {};
  // set all conditions (every pair of overlapping faces) initially to 0
  booleanMatrixToUniqueIndexPairs(overlap_matrix)
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
  // const assignment_direction = { M: 1, m: 1, V: -1, v: -1 };
  const assignment_direction = { M: 1, m: 1, V: 2, v: 2 };
  graph.edges_faces.forEach((faces, edge) => {
    const assignment = graph.edges_assignment[edge];
    const direction = assignment_direction[assignment];
    if (faces.length < 2 || direction === undefined) { return; }
    const upright = faces_winding[faces[0]];
    const relationship = upright ? direction : flip[direction];
    const key1 = `${faces[0]} ${faces[1]}`;
    const key2 = `${faces[1]} ${faces[0]}`;
    if (key1 in conditions) { conditions[key1] = relationship; }
    if (key2 in conditions) { conditions[key2] = flip[relationship]; }
  });
  return conditions;
};

// on second thought, precheck will always succeed, because we tried
// both iterations last loop.
// const precheck = (layers, maps, face_pair_key, new_dir) => {
//   try {
//     taco_types.forEach(taco_type => layers.forEach((layer, i) => {
//       const map = maps[taco_type][i];
//       for (let m = 0; m < map.face_keys.length; m++) {
//         if (map.face_keys[m] === face_pair_key) {
//           const dir = map.keys_ordered[m] ? new_dir : flip[new_dir];
//           const new_layer = [...layer];
//           new_layer[m] = dir;
//           const new_layer_key = new_layer.join("");
//           if (lookup[taco_type][new_layer_key] === 0) {
//             console.log("precheck found a fail case", face_pair_key, taco_type, new_layer_key, lookup[type][new_layer_key]);
//             throw "precheck";
//           }
//         }
//       }
//     }));
//   } catch (error) {
//     return false;
//   }
//   return true;
// };

// const precheck_single_change = (conditions, layers, maps, face_pair_key, new_dir) => {
//   // console.log("precheck_single_change", conditions, layers, maps, face_pair_key, new_dir)
//   const types = ["taco_taco", "taco_tortilla", "tortilla_tortilla", "transitivity"];
//   for (let t = 0; t < types.length; t++) {
//     const type = types[t];
//     for (let i = 0; i < maps[type].length; i++) {
//       const map = maps[type][i];
//       for (let j = 0; j < map.face_keys.length; j++) {
//         if (map.face_keys[j] === face_pair_key) {
//           const dir = map.keys_ordered[j] ? new_dir : flip[new_dir];
//           const new_layer = [...layers[type][i]];
//           new_layer[j] = dir;
//           const new_layer_key = new_layer.join("");
//           // console.log("precheck", face_pair_key, type, new_layer_key, lookup[type][new_layer_key]);
//           if (lookup[type][new_layer_key] === 0) {
//             console.log("precheck found a fail case", face_pair_key, type, new_layer_key, lookup[type][new_layer_key]);
//             return false;
//           }
//         }
//       }
//     }
//   }
//   return true;
// };

const validate = (layers, lookup_table) => {
  for (let i = 0; i < layers.length; i++) {
    const key = layers[i].join("");
    const next_step = lookup_table[key];
    if (next_step === 0) { return false; }
  }
  return true;
};


// const fill_layer_maps = (maps, layers, conditions) => maps
//   .forEach((map, i) => map.face_keys
//     .forEach((key, j) => {
//       if (!(key in conditions)) {
//         console.warn(key, "not in conditions");
//         return;
//       }
//       if (conditions[key] !== 0) {
//         const orientation = map.keys_ordered[j]
//           ? conditions[key]
//           : flip[conditions[key]];
//         if (layers[i][j] !== 0 && layers[i][j] !== orientation) {
//           console.warn("rewrite conflict in fill_layer_maps");
//         }
//         layers[i][j] = orientation;
//         // convert above/below encoding (1, -1) to (1, 2)
//         // layers[i][j] = correct_flip === -1 ? 2 : 1;
//       }
//     }));

const fill_layers_from_conditions = (layers, maps, conditions) => layers
  .forEach((layer, i) => maps[i].face_keys
    .forEach((key, j) => {
      if (!(key in conditions)) { console.warn(key, "not in conditions"); return }
      if (conditions[key] !== 0) {
        const orientation = maps[i].keys_ordered[j]
          ? conditions[key]
          : flip[conditions[key]];
        if (layers[i][j] !== 0 && layers[i][j] !== orientation) {
          // console.warn("rewrite conflict. fill", i, key);
          throw "fill conflict";
        }
        layers[i][j] = orientation;
      }
    }));

const infer_next_steps = (layers, maps, lookup_table) => layers
  .map((layer, i) => {
    const map = maps[i];
    const key = layer.join("");
    const next_step = lookup_table[key];
    if (next_step === 0) { throw "unsolvable"; }
    if (next_step === 1) { return; }
    if (layer[next_step[0]] !== 0 && layer[next_step[0]] !== next_step[1]) {
      throw "infer conflict";
      // console.warn("rewrite conflict. infer");
    }
    layers[i][next_step[0]] = next_step[1];
    // format this next_step change into face-pair-key and above/below value
    // so that it can be added to the conditions object.
    const condition_key = map.face_keys[next_step[0]];
    const condition_value = map.keys_ordered[next_step[0]]
      ? next_step[1]
      : flip[next_step[1]];
    return [condition_key, condition_value];
  }).filter(a => a !== undefined);


// const infer_next_steps = (maps, layers, lookup_table) => {
//   // let type;
//   // if (lookup_table === lookup.taco_taco) type = "taco_taco";
//   // if (lookup_table === lookup.taco_tortilla) type = "taco_tortilla";
//   // if (lookup_table === lookup.tortilla_tortilla) type = "tortilla_tortilla";
//   // if (lookup_table === lookup.transitivity) type = "transitivity";

//   const next_steps = [];
//   for (let i = 0; i < maps.length; i++) {
//     const map = maps[i];
//     const key = layers[i].join("");
//     const next_step = lookup_table[key];
//     // if (lookup_table === lookup.tortilla_tortilla) {
//     //   console.log("key", key, "next_step", next_step);
//     // }
//     if (next_step === 0) {
//       // console.log("THROW UNSOLVABLE", type, key, map);
//       throw "unsolvable";
//     }
//     if (next_step === 1) { continue; }
//     // modify map with the suggestion, move it to the next state.
//     if (layers[i][next_step[0]] !== 0 && layers[i][next_step[0]] !== next_step[1]) {
//       console.warn("rewrite conflict");
//     }

//     layers[i][next_step[0]] = next_step[1];
//     // prepare the suggestion to be added to the global conditions
//     const next_step_key = map.face_keys[next_step[0]];
//     const next_step_key_ordered = map.keys_ordered[next_step[0]];
//     // convert above/below encoding (1, 2) to (1, -1)
//     // const next_step_solution_unordered = next_step[1] === 2 ? -1 : 1;
//     // const next_step_solution = next_step_key_ordered
//     const next_step_solution = next_step_key_ordered
//       ? next_step[1]
//       : flip[next_step[1]];
//     // console.log("next_step", next_step, next_step_key, next_step_solution);
//     // if (lookup_table === lookup.tortilla_tortilla) {
//     //   console.log("next_step_key", next_step_key);
//     //   console.log("next_step_solution", next_step_solution);
//     // }

//     // if (SOLUTION[next_step_key] !== next_step_solution) {
//     //   console.log(`mismatch ${type}`, next_step_key, next_step_solution);
//     // }
//     next_steps.push([next_step_key, next_step_solution]);
//   }
//   return next_steps.filter(a => a !== undefined);
// };

const completeSuggestionsLoop = (layers, maps, conditions) => {
  // given the current set of conditions, complete them as much as possible
  // only adding the determined results certain from the current state.
  let next_steps;
  do {
    // console.log("layers taco-taco 40", layers.taco_taco[40]);
    // console.log("layers taco-taco 97", layers.taco_taco[97]);
    // console.log("layers taco-tortilla 76", layers.taco_tortilla[76]);
    try {
      // for each: taco_taco, taco_tortilla, tortilla_tortilla, transitivity
      const types = Object.keys(lookup);
      for (let t = 0; t < types.length; t++) {
        const type = types[t];
        fill_layers_from_conditions(layers[type], maps[type], conditions);
      }
      next_steps = types
        .map(type => infer_next_steps(layers[type], maps[type], lookup[type]))
        .reduce((a, b) => a.concat(b), []);
      // next_steps = [
      //   infer_next_steps(maps.taco_taco, layers.taco_taco, lookup.taco_taco),
      //   infer_next_steps(maps.taco_tortilla, layers.taco_tortilla, lookup.taco_tortilla),
      //   infer_next_steps(maps.tortilla_tortilla, layers.tortilla_tortilla, lookup.tortilla_tortilla),
      //   infer_next_steps(maps.transitivity, layers.transitivity, lookup.transitivity),
      // ].reduce((a, b) => a.concat(b), []);
      next_steps.forEach(el => { conditions[el[0]] = el[1]; });
    } catch (error) { 
      // console.log("error thrown", error);
      return false;
    } // no solution on this branch
  } while (next_steps.length > 0);
  return true;
};

const duplicate_unsolved_layers = (layers) => {
  const duplicate = {};
  taco_types.forEach(type => { duplicate[type] = []; });
  taco_types.forEach(type => layers[type]
    .forEach((layer, i) => {
      if (layer.indexOf(0) !== -1) {
        duplicate[type][i] = [...layer];
      }
    }));
  return duplicate;
}

const store_solution = (solutions, conditions) => {
  const stringified = JSON.stringify(conditions);
  const hash = hashCode(stringified);
  // console.log("storing a solution", hash);
  if (hash in solutions) {
    if (JSON.stringify(solutions[hash]) !== stringified) {
      console.warn("hash function broken");
    }
  }
  solutions[hash] = conditions;
};

const find_similarities = (conditions, a, b) => {
  const zero_keys = Object.keys(conditions)
    .map(key => conditions[key] === 0 ? key : undefined)
    .filter(a => a !== undefined);
  const similar = [];
  zero_keys.forEach(key => {
    if (a[key] === b[key]) { similar.push(key); }
  });
  return similar;
};

// take all the conditions which HAVE been solved (filter out the zeros),
// make a hash of this, store it, with the intention that in the future
// you will be running all possible above/below on all unknowns.
// this way,
// if you ever encounter this hash again (the same set of solved and unknowns),
// we can revert this branch entirely.
// and this hash table can be stored "globally" for each run.

const solver = (graph, maps, overlap_matrix, faces_winding) => {
  // key: hash, value: conditions
  const solutions = {};
  // // key: hash, value: conditions
  // const progress_solutions = {};

  // successful conditions will often be duplicates of one another.
  // filter only a set of unique conditions. use a hash table to compare.
  const successes_hash = {};
  console.log("successes_hash", successes_hash);

  // // the subset of zero_keys which have been set by one or more recursion
  // const set_zero_keys = {};
  let recurse_count = 0;
  let clone_count = 0;

  const recurse = (layers, conditions) => {
    recurse_count++;
    const zero_keys = Object.keys(conditions)
      .map(key => conditions[key] === 0 ? key : undefined)
      .filter(a => a !== undefined);
    if (zero_keys.length === 0) { return store_solution(solutions, conditions); }
    const successes = zero_keys
      .map((key, i) => [1, 2]
        .map(dir => {
          const clone_conditions = JSON.parse(JSON.stringify(conditions));
          if (successes_hash[JSON.stringify(clone_conditions)]) {
            console.log("Early hash caught!"); return;
          }
          const clone_layers = duplicate_unsolved_layers(layers);
          clone_conditions[key] = dir;
          clone_count++;
          return completeSuggestionsLoop(clone_layers, maps, clone_conditions)
            ? { conditions: clone_conditions, layers: clone_layers }
            : undefined;
        })
        .filter(a => a !== undefined))
      .reduce((a, b) => a.concat(b), []);

    const unique_successes = successes
      .map(success => JSON.stringify(success.conditions))
      .map(string => hashCode(string))
      .map((hash, i) => {
        if (successes_hash[hash]) { return; }
        successes_hash[hash] = successes[i];
        return successes[i];
      })
      .filter(a => a !== undefined);

    // console.log("successes", successes);
    // console.log("successes_hash", successes_hash);
    // console.log("unique_successes", unique_successes);
    // console.log("unique_successes", unique_successes.length);

    unique_successes
      .forEach(success => recurse(success.layers, success.conditions));
  };

  // recursively uncover the remaining conditions
  const recurse_first = (conditions, layers, depth = 0) => {
    recurse_count++;
    // console.log("recursion depth", depth)
    // the subset of zero_keys which have been set by one or more recursion
    const set_zero_keys = {};

    const zero_keys = Object.keys(conditions)
      .map(key => conditions[key] === 0 ? key : undefined)
      .filter(a => a !== undefined);

    if (zero_keys.length === 0) {
      const one_last_test = [
        validate(layers.taco_taco, lookup.taco_taco),
        validate(layers.taco_tortilla, lookup.taco_tortilla),
        validate(layers.tortilla_tortilla, lookup.tortilla_tortilla),
        validate(layers.transitivity, lookup.transitivity),
      ];
      if (!one_last_test.reduce((a, b) => a && b, true)) {
        console.warn("not a successfully filled solution after all", one_last_test);
        return;
      }
      store_solution(solutions, conditions);
      return;
    }

    for (let i = 0; i < zero_keys.length; i++) {
      const successes = [];
      for (let dir = 1; dir <= 2; dir++) {
        if (!precheck_single_change(conditions, layers, maps, zero_keys[i], dir)) {
          continue;
        }
        if (set_zero_keys[zero_keys[i]] && set_zero_keys[zero_keys[i]][dir]) {
          continue;
        }
        clone_count++;
        ///////////////////
        /////////////////
        // todo: instead of json stringifying everything. make it so the conditions
        // is an array of VALUES only. index assumes to point to the keys since
        // they never change.
        //
        // do something similar with layers.
        const clone_conditions = JSON.parse(JSON.stringify(conditions));
        const clone_layers = JSON.parse(JSON.stringify(layers));
        clone_conditions[zero_keys[i]] = dir;
        if (completeSuggestionsLoop(clone_layers, maps, clone_conditions)) {
          successes.push({
            conditions: clone_conditions,
            layers: clone_layers,
            // zeros: zero_count(clone_conditions),
          });
        }
      }
      // successes.sort((a, b) => a.zeros - b.zeros);
      // if (successes.length === 2) {
      //   const similar = find_similarities(conditions, ...successes.map(el => el.conditions));
      //   if (similar.length) {
      //     // console.log("Opportunity use similarity", similar);
      //   }
      // }
      // const unique_successes = successes;
      const unique_successes = [];
      for (let j = 0; j < successes.length; j++) {
        // const hash = hashCode(JSON.stringify(successes[j].conditions));
        const value_string = Object.values(successes[j].conditions).join("");
        const hash = hashCode(value_string);
        if (progress_solutions[hash] === undefined) {
          // console.log("hash is unique! adding...");
          progress_solutions[hash] = successes[j];
          unique_successes.push(successes[j]);
        } else {
          // console.log("hash", hash, "already exists", progress_solutions);
        }
      }
      // if (depth < 1) {
      unique_successes.forEach(el => Object.keys(el.conditions).forEach(key => {
        if (conditions[key] === 0) {
          if (!set_zero_keys[key]) { set_zero_keys[key] = {}; }
          set_zero_keys[key][el.conditions[key]] = true;
        }
      }));
      // }
      // console.log("i", i, zero_keys[i], successes, successes.length);

      // // recurse only once, or...
      // if (successes.length !== 0) {
      //   if (zero_count(successes[0].conditions) < zero_keys.length) {
      //     // return recurse(successes[0].conditions, successes[0].layers);
      //     recurse(successes[0].conditions, successes[0].layers);
      //   }
      // }
      // recurse all paths.
      unique_successes.forEach(success => recurse(success.conditions, success.layers, depth + 1));
    }
  };

  // initialize conditions, set all to 0, set neighbor faces to either 1 or 2
  const conditions_start = init_conditions(graph, overlap_matrix, faces_winding);
  // console.log("conditions_start", conditions_start);

  const layers_start = {
    taco_taco: maps.taco_taco.map(el => Array(6).fill(0)),
    taco_tortilla: maps.taco_tortilla.map(el => Array(3).fill(0)),
    tortilla_tortilla: maps.tortilla_tortilla.map(el => Array(2).fill(0)),
    transitivity: maps.transitivity.map(el => Array(3).fill(0)),
  };

  const success = completeSuggestionsLoop(layers_start, maps, conditions_start);

  console.log("layers_start", layers_start);
  console.log("first success", success, "should we recurse?", zero_count(conditions_start));

  const layers_remaining = duplicate_unsolved_layers(layers_start);
  console.log("layers_remaining", layers_remaining);

  const result = recurse(layers_start, conditions_start);
  console.log("result", result);

  // console.log("set_zero_keys", set_zero_keys);
  console.log("recurse_count", recurse_count, "clone_count", clone_count);

  const solution_values = success ? Object.values(solutions) : [];
  solution_values.certain = JSON.parse(JSON.stringify(conditions_start));

  // convert solutions from (1,2) to (+1,-1)
  const conversion = {0:0, 1:1, 2:-1};
  for (let i = 0; i < solution_values.length; i++) {
    Object.keys(solution_values[i]).forEach(key => {
      solution_values[i][key] = conversion[solution_values[i][key]];
    });
  }
  Object.keys(solution_values.certain).forEach(key => {
    solution_values.certain[key] = conversion[solution_values.certain[key]];
  });

  // console.log("# zeros in conditions", zero_count(conditions_start));

  return solution_values;
};

export default solver;
