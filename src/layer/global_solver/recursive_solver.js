import table from "./table";
import complete_suggestions_loop from "./complete_suggestions_loop";
import hashCode from "../../general/hashCode";
import { unsigned_to_signed_layers } from "./general";

const taco_types = Object.freeze(Object.keys(table));

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

// on second thought, precheck will always succeed, because we tried
// both iterations last loop.
const precheck = (layers, maps, face_pair_key, new_dir) => {
  try {
    taco_types.forEach(taco_type => layers.forEach((layer, i) => {
      const map = maps[taco_type][i];
      for (let m = 0; m < map.face_keys.length; m++) {
        if (map.face_keys[m] === face_pair_key) {
          const dir = map.keys_ordered[m] ? new_dir : flip[new_dir];
          const new_layer = [...layer];
          new_layer[m] = dir;
          const new_layer_key = new_layer.join("");
          if (table[taco_type][new_layer_key] === false) {
            console.log("precheck found a fail case", face_pair_key, taco_type, new_layer_key, table[type][new_layer_key]);
            throw "precheck";
          }
        }
      }
    }));
  } catch (error) {
    return false;
  }
  return true;
};

// take all the conditions which HAVE been solved (filter out the zeros),
// make a hash of this, store it, with the intention that in the future
// you will be running all possible above/below on all unknowns.
// this way,
// if you ever encounter this hash again (the same set of solved and unknowns),
// we can revert this branch entirely.
// and this hash table can be stored "globally" for each run.

const recursive_solver = (graph, maps, conditions_start) => {
  const startDate = new Date();
  let recurse_count = 0;
  let inner_loop_count = 0;
  // successful conditions will often be duplicates of one another.
  // filter only a set of unique conditions. use a hash table to compare.
  // not only do we store hashes of the final solutions, but,
  // each round of the recurse involves guessing, and, after we complete
  // the conditions as much as possible after each guess, store these
  // partially-completed conditions here too. this dramatically reduces the
  // number of recursive branches.
  const successes_hash = {};
  /**
   * the input parameters will not be modified. they will be copied,
   * their copies modified, then passed along to the next recurse.
   */
  const recurse = (layers, conditions) => {
    const this_recurse_count = recurse_count;
    // console.time(`recurse ${this_recurse_count}`);
    recurse_count++;
    const zero_keys = Object.keys(conditions)
      .map(key => conditions[key] === 0 ? key : undefined)
      .filter(a => a !== undefined);
    // solution found. exit.
    if (zero_keys.length === 0) { return [conditions]; }
    // console.log("recurse. # zero keys", zero_keys.length);
    // for every unknown face-pair relationship (zero_keys), try setting both
    // above/below cases, test it out, and if it's a success the inner loop
    // will either encounter a fail state, in which case reject it, or it
    // reaches a stable state where all suggestions have been satisfied.
    // "avoid":
    // within this one recursive round, we can be sure that all of our guesses
    // only need to happen once, since the source data is the same. so, if inside
    // one guess, more face relationships are uncovered, store those newly found
    // relationships inside "avoid". later as we continue our guessing, we can
    // avoid any guesses which are stored inside "avoid", as the outcome
    // has already been determined.
    const avoid = {};
    const successes = zero_keys
      .map((key, i) => [1, 2]
        .map(dir => {
          if (avoid[key] && avoid[key][dir]) { return; }
          // todo: it appears that this never happens. remove after testing.
          if (precheck(layers, maps, key, dir)) {
            console.log("precheck caught!"); return;
          }
          const clone_conditions = JSON.parse(JSON.stringify(conditions));
          // todo: it appears that this never happens. remove after testing.
          if (successes_hash[JSON.stringify(clone_conditions)]) {
            console.log("early hash caught!"); return;
          }
          const clone_layers = duplicate_unsolved_layers(layers);
          clone_conditions[key] = dir;
          inner_loop_count++;
          if (!complete_suggestions_loop(clone_layers, maps, clone_conditions)) {
            return undefined;
          }
          Object.keys(clone_conditions)
            .filter(key => conditions[key] === 0)
            .forEach(key => {
              if (!avoid[key]) { avoid[key] = {}; }
              avoid[key][dir] = true;
            });
          return { conditions: clone_conditions, layers: clone_layers };
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

    // console.timeEnd(`recurse ${this_recurse_count}`);
    return unique_successes
      .map(success => recurse(success.layers, success.conditions))
      .reduce((a, b) => a.concat(b), []);
  };

  const layers_start = {
    taco_taco: maps.taco_taco.map(el => Array(6).fill(0)),
    taco_tortilla: maps.taco_tortilla.map(el => Array(3).fill(0)),
    tortilla_tortilla: maps.tortilla_tortilla.map(el => Array(2).fill(0)),
    transitivity: maps.transitivity.map(el => Array(3).fill(0)),
  };

  // this could be left out and simply starting the recursion. however,
  // we want to capture the "certain" relationships, the ones decided
  // after consulting the table before any guessing or recursion is done.
  complete_suggestions_loop(layers_start, maps, conditions_start);
  // the face orders that must be for every case.
  const certain = conditions_start;
  // the set of solutions as an array, with the certain values
  // under the key "certain".
  const solutions = recurse(layers_start, conditions_start);
  solutions.certain = JSON.parse(JSON.stringify(certain));
  // algorithm is done!
  // convert solutions from (1,2) to (+1,-1)
  for (let i = 0; i < solutions.length; i++) {
    unsigned_to_signed_layers(solutions[i]);
  }
  unsigned_to_signed_layers(solutions.certain);
  // console.log("solutions", solutions);
  // console.log("successes_hash", successes_hash);
  // console.log("avoid", avoid);
  console.log(`${Date.now() - startDate}ms recurse_count`, recurse_count, "inner_loop_count", inner_loop_count);

  return solutions;
};

export default recursive_solver;
