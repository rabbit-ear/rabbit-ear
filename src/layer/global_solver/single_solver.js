import table from "./table";
import complete_suggestions_loop from "./complete_suggestions_loop";
import hashCode from "../../general/hashCode";
import { unsigned_to_signed_conditions } from "./general";

const count_zeros = conditions => Object
  .keys(conditions)
  .filter(key => conditions[key] === 0).length;

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
};

// take all the conditions which HAVE been solved (filter out the zeros),
// make a hash of this, store it, with the intention that in the future
// you will be running all possible above/below on all unknowns.
// this way,
// if you ever encounter this hash again (the same set of solved and unknowns),
// we can revert this branch entirely.
// and this hash table can be stored "globally" for each run.

const solver_single = (graph, maps, conditions) => {
  const startDate = new Date();
  let recurse_count = 0;
  let inner_loop_count = 0;
  // successful conditions will often be duplicates of one another.
  // filter only a set of unique conditions. use a hash table to compare.
  const successes_hash = {};
  let certain_conditions = {};

  let layers = {
    taco_taco: maps.taco_taco.map(el => Array(6).fill(0)),
    taco_tortilla: maps.taco_tortilla.map(el => Array(3).fill(0)),
    tortilla_tortilla: maps.tortilla_tortilla.map(el => Array(2).fill(0)),
    transitivity: maps.transitivity.map(el => Array(3).fill(0)),
  };

  complete_suggestions_loop(layers, maps, conditions)
  certain_conditions = conditions;

  let solution;

  do {
    const this_recurse_count = recurse_count;
    // console.time(`recurse ${this_recurse_count}`);
    recurse_count++;
    const zero_keys = Object.keys(conditions)
      .map(key => conditions[key] === 0 ? key : undefined)
      .filter(a => a !== undefined);
    // solution found. exit.
    if (zero_keys.length === 0) {
      solution = conditions;
      break;
    }
    // console.log("recurse. # zero keys", zero_keys.length);
    // for every unknown face-pair relationship (zero_keys), try setting both
    // above/below cases, test it out, and if it's a success the inner loop
    // will either encounter a fail state, in which case reject it, or it
    // reaches a stable state where all suggestions have been satisfied.
    const avoid = {};

    const successes = zero_keys
      .map((key, i) => [1, 2]
        .map(dir => {
          if (avoid[key] && avoid[key][dir]) { return; }
          // if (precheck(layers, maps, key, dir)) {
          //   console.log("precheck caught!"); return;
          // }
          const clone_conditions = JSON.parse(JSON.stringify(conditions));
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
          return {
            conditions: clone_conditions,
            layers: clone_layers,
            zero_count: count_zeros(clone_conditions),
          };
        })
        .filter(a => a !== undefined))
      .reduce((a, b) => a.concat(b), [])
      .sort((a, b) => b.zero_count - a.zero_count);

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
    // console.log("unique_successes", unique_successes);
    // console.log("unique_successes", unique_successes.length);

    // console.timeEnd(`recurse ${this_recurse_count}`);
    if (!unique_successes.length) {
      console.warn("ran out of successes");
      return;
    }
    conditions = unique_successes[0].conditions;
    layers = unique_successes[0].layers;

  } while (solution === undefined);

  // convert solutions from (1,2) to (+1,-1)
  unsigned_to_signed_conditions(solution);

  // console.log("solutions", solutions);
  // console.log("successes_hash", successes_hash);
  // console.log("avoid", avoid);
  console.log(`${Date.now() - startDate}ms recurse_count`, recurse_count, "inner_loop_count", inner_loop_count);

  return solution;
};

export default solver_single;
