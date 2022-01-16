import lookup from "./lookup";
import hashCode from "../../general/hashCode";
import { boolean_matrix_to_unique_index_pairs } from "../../general/arrays";
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

const fill_layer_maps = (maps, layers, conditions) => maps
  .forEach((map, i) => map.face_keys
    .forEach((key, j) => {
      if (!(key in conditions)) {
        console.warn(key, "not in conditions");
        return;
      }
      if (conditions[key] !== 0) {
        const orientation = map.keys_ordered[j]
          ? conditions[key]
          : flip[conditions[key]];
        if (layers[i][j] !== 0 && layers[i][j] !== orientation) {
          console.warn("rewrite conflict in fill_layer_maps");
        }
        layers[i][j] = orientation;
        // convert above/below encoding (1, -1) to (1, 2)
        // layers[i][j] = correct_flip === -1 ? 2 : 1;
      }
    }));

const validate = (layers, lookup_table) => {
  for (let i = 0; i < layers.length; i++) {
    const key = layers[i].join("");
    const next_step = lookup_table[key];
    if (next_step === 0) { return false; }
  }
  return true;
};

const infer_next_steps = (maps, layers, lookup_table) => {
  // let type;
  // if (lookup_table === lookup.taco_taco) type = "taco_taco";
  // if (lookup_table === lookup.taco_tortilla) type = "taco_tortilla";
  // if (lookup_table === lookup.tortilla_tortilla) type = "tortilla_tortilla";
  // if (lookup_table === lookup.transitivity) type = "transitivity";

  const next_steps = [];
  for (let i = 0; i < maps.length; i++) {
    const map = maps[i];
    const key = layers[i].join("");
    const next_step = lookup_table[key];
    // if (lookup_table === lookup.tortilla_tortilla) {
    //   console.log("key", key, "next_step", next_step);
    // }
    if (next_step === 0) {
      // console.log("THROW UNSOLVABLE", type, key, map);
      throw "unsolvable";
    }
    if (next_step === 1) { continue; }
    // modify map with the suggestion, move it to the next state.
    if (layers[i][next_step[0]] !== 0 && layers[i][next_step[0]] !== next_step[1]) {
      console.warn("rewrite conflict");
    }

    layers[i][next_step[0]] = next_step[1];
    // prepare the suggestion to be added to the global conditions
    const next_step_key = map.face_keys[next_step[0]];
    const next_step_key_ordered = map.keys_ordered[next_step[0]];
    // convert above/below encoding (1, 2) to (1, -1)
    // const next_step_solution_unordered = next_step[1] === 2 ? -1 : 1;
    // const next_step_solution = next_step_key_ordered
    const next_step_solution = next_step_key_ordered
      ? next_step[1]
      : flip[next_step[1]];
    // console.log("next_step", next_step, next_step_key, next_step_solution);
    // if (lookup_table === lookup.tortilla_tortilla) {
    //   console.log("next_step_key", next_step_key);
    //   console.log("next_step_solution", next_step_solution);
    // }

    // if (SOLUTION[next_step_key] !== next_step_solution) {
    //   console.log(`mismatch ${type}`, next_step_key, next_step_solution);
    // }
    next_steps.push([next_step_key, next_step_solution]);
  }
  return next_steps.filter(a => a !== undefined);
};

const complete_suggestions_loop = (conditions, maps, layers) => {
  // given the current set of conditions, complete them as much as possible
  // only adding the determined results certain from the current state.
  let next_steps;
  do {
    // console.log("layers taco-taco 40", layers.taco_taco[40]);
    // console.log("layers taco-taco 97", layers.taco_taco[97]);
    // console.log("layers taco-tortilla 76", layers.taco_tortilla[76]);
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
      next_steps.forEach(el => { conditions[el[0]] = el[1]; });
    } catch (error) { 
      console.log("error thrown", error);
      return false;
    } // no solution on this branch
  } while (next_steps.length > 0);
  return true;
};

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

const solver = (graph, maps, overlap_matrix, faces_winding) => {
  // key: hash, value: conditions
  const solutions = {};
  // key: hash, value: conditions
  const progress_solutions = {};

  // // the subset of zero_keys which have been set by one or more recursion
  // const set_zero_keys = {};
  let recurse_count = 0;

  // recursively uncover the remaining conditions
  const recurse = (conditions, layers, depth = 0) => {
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
        if (set_zero_keys[zero_keys[i]] && set_zero_keys[zero_keys[i]][dir]) {
          continue;
        }
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
        if (complete_suggestions_loop(clone_conditions, maps, clone_layers)) {
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

  const success = complete_suggestions_loop(conditions_start, maps, layers_start);

  console.log("layers_start", layers_start);
  console.log("first success", success, "should we recurse?", zero_count(conditions_start));
  recurse(conditions_start, layers_start);

  // console.log("set_zero_keys", set_zero_keys);
  console.log("recurse_count", recurse_count);

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

// const SOLUTION = { "0 1": 1, "0 2": 1, "0 3": 1, "0 4": 1, "0 5": 1, "0 6": 1, "0 7": 1, "0 8": 1, "0 9": 1, "0 10": 1, "0 11": 1, "0 12": 1, "0 13": 1, "0 23": 1, "0 35": 1, "1 2": 2, "1 3": 2, "1 4": 1, "1 5": 1, "1 6": 1, "1 7": 1, "1 8": 1, "1 9": 1, "1 10": 1, "1 11": 1, "1 12": 1, "1 13": 1, "1 23": 1, "1 35": 1, "2 3": 2, "2 4": 1, "2 5": 1, "2 6": 1, "2 7": 1, "2 8": 1, "2 9": 1, "2 10": 1, "2 11": 1, "2 12": 1, "2 13": 1, "2 23": 1, "2 35": 1, "3 4": 1, "3 5": 1, "3 6": 1, "3 7": 1, "3 8": 1, "3 9": 1, "3 10": 1, "3 11": 1, "3 12": 1, "3 13": 1, "3 23": 1, "3 35": 1, "4 5": 2, "4 6": 1, "4 7": 1, "4 8": 1, "4 9": 1, "4 10": 1, "4 11": 1, "4 12": 1, "4 13": 1, "4 14": 1, "4 15": 1, "4 16": 1, "4 17": 1, "4 18": 1, "4 19": 2, "4 20": 2, "4 21": 2, "4 22": 1, "4 23": 1, "4 24": 2, "4 25": 2, "4 26": 1, "4 27": 1, "4 28": 1, "4 29": 1, "4 30": 1, "4 31": 1, "4 32": 1, "4 33": 1, "4 34": 1, "4 35": 1, "5 6": 1, "5 7": 1, "5 8": 1, "5 9": 1, "5 10": 1, "5 11": 1, "5 12": 1, "5 13": 1, "5 23": 1, "5 35": 1, "6 7": 2, "6 8": 1, "6 9": 1, "6 10": 1, "6 11": 1, "6 12": 1, "6 13": 1, "6 23": 1, "6 35": 1, "7 8": 1, "7 9": 1, "7 10": 1, "7 11": 1, "7 12": 1, "7 13": 1, "7 14": 1, "7 15": 1, "7 16": 1, "7 17": 1, "7 18": 1, "7 19": 2, "7 20": 2, "7 21": 2, "7 22": 1, "7 23": 1, "7 24": 2, "7 25": 2, "7 26": 1, "7 27": 1, "7 28": 1, "7 29": 1, "7 30": 1, "7 31": 1, "7 32": 1, "7 33": 1, "7 34": 1, "7 35": 1, "8 9": 1, "8 10": 1, "8 11": 2, "8 12": 1, "8 13": 2, "8 14": 1, "8 15": 1, "8 16": 2, "8 17": 1, "8 18": 2, "8 19": 2, "8 20": 2, "8 21": 2, "8 22": 1, "8 23": 1, "8 24": 2, "8 25": 2, "8 26": 1, "8 27": 2, "8 28": 2, "8 29": 2, "8 30": 2, "8 31": 2, "8 32": 2, "8 33": 2, "8 34": 2, "8 35": 1, "9 10": 1, "9 11": 2, "9 12": 1, "9 13": 2, "9 23": 2, "9 35": 2, "10 11": 2, "10 12": 1, "10 13": 2, "10 23": 2, "10 35": 2, "11 12": 1, "11 13": 2, "11 14": 1, "11 15": 1, "11 16": 2, "11 17": 1, "11 18": 2, "11 19": 2, "11 20": 2, "11 21": 2, "11 22": 1, "11 23": 1, "11 24": 2, "11 25": 2, "11 26": 1, "11 27": 2, "11 28": 2, "11 29": 2, "11 30": 2, "11 31": 2, "11 32": 2, "11 33": 2, "11 34": 2, "11 35": 1, "12 13": 2, "12 23": 2, "12 35": 2, "13 23": 1, "13 35": 1, "14 15": 1, "14 16": 2, "14 17": 1, "14 18": 2, "14 19": 2, "14 20": 2, "14 21": 2, "14 22": 2, "14 24": 2, "14 25": 2, "14 26": 2, "14 27": 2, "14 28": 2, "14 29": 2, "14 30": 2, "14 31": 2, "14 32": 2, "14 33": 2, "14 34": 2, "15 16": 2, "15 17": 1, "15 18": 2, "15 19": 2, "15 20": 2, "15 21": 2, "15 22": 2, "15 24": 2, "15 25": 2, "15 26": 2, "15 27": 2, "15 28": 2, "15 29": 2, "15 30": 2, "15 31": 2, "15 32": 2, "15 33": 2, "15 34": 2, "16 17": 1, "16 18": 2, "16 19": 2, "16 20": 2, "16 21": 2, "16 22": 1, "16 24": 2, "16 25": 2, "16 26": 1, "16 27": 2, "16 28": 2, "16 29": 2, "16 30": 2, "16 31": 2, "16 32": 2, "16 33": 2, "16 34": 2, "17 18": 2, "17 19": 2, "17 20": 2, "17 21": 2, "17 22": 2, "17 24": 2, "17 25": 2, "17 26": 2, "17 27": 2, "17 28": 2, "17 29": 2, "17 30": 2, "17 31": 2, "17 32": 2, "17 33": 2, "17 34": 2, "18 19": 2, "18 20": 2, "18 21": 2, "18 22": 1, "18 24": 2, "18 25": 2, "18 26": 1, "18 27": 1, "18 28": 1, "18 29": 1, "18 30": 1, "18 31": 1, "18 32": 1, "18 33": 1, "18 34": 1, "19 20": 2, "19 21": 1, "19 22": 1, "19 24": 1, "19 25": 1, "19 26": 1, "19 27": 1, "19 28": 1, "19 29": 1, "19 30": 1, "19 31": 1, "19 32": 1, "19 33": 1, "19 34": 1, "20 21": 1, "20 22": 1, "20 24": 1, "20 25": 1, "20 26": 1, "20 27": 1, "20 28": 1, "20 29": 1, "20 30": 1, "20 31": 1, "20 32": 1, "20 33": 1, "20 34": 1, "21 22": 1, "21 24": 1, "21 25": 1, "21 26": 1, "21 27": 1, "21 28": 1, "21 29": 1, "21 30": 1, "21 31": 1, "21 32": 1, "21 33": 1, "21 34": 1, "22 24": 2, "22 25": 2, "22 26": 2, "22 27": 2, "22 28": 2, "22 29": 2, "22 30": 2, "22 31": 2, "22 32": 2, "22 33": 2, "22 34": 2, "23 35": 2, "24 25": 1, "24 26": 1, "24 27": 1, "24 28": 1, "24 29": 1, "24 30": 1, "24 31": 1, "24 32": 1, "24 33": 1, "24 34": 1, "25 26": 1, "25 27": 1, "25 28": 1, "25 29": 1, "25 30": 1, "25 31": 1, "25 32": 1, "25 33": 1, "25 34": 1, "26 27": 2, "26 28": 2, "26 29": 2, "26 30": 2, "26 31": 2, "26 32": 2, "26 33": 2, "26 34": 2, "27 28": 2, "27 29": 2, "27 30": 1, "27 31": 2, "27 32": 2, "27 33": 2, "27 34": 2, "28 29": 2, "28 30": 1, "28 31": 2, "28 32": 2, "28 33": 2, "28 34": 2, "29 30": 1, "29 31": 2, "29 32": 2, "29 33": 2, "29 34": 2, "30 31": 2, "30 32": 2, "30 33": 2, "30 34": 2, "31 32": 1, "31 33": 1, "31 34": 1, "32 33": 2, "32 34": 2, "33 34": 2 };

