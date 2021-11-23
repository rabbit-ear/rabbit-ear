import { fn_cat } from "../symbols/functions";
import faces_layer_to_flat_orders from "./faces_layer_to_flat_orders";
/**
 * @description given a set of solutions for layer ordering of a folded
 * single-vertex, and given that this is the complete set, extract all the
 * rules (relationships between pairs of faces) that are true for every case.
 * @param {number[][]} faces_layers array of multiple faces_layer solutions
 * @returns {number[][]} rules are an array of 3 numbers, 2 indices and a relation.
 * so for example, "index 8 is below index 20" looks like [8, 20, -1]
 */
const get_common_rules = (faces_layers) => {
  const orders = faces_layers
    .map(faces_layer_to_flat_orders)
    .reduce(fn_cat, []);
  // inverted orders is necessary in uncovering consistencies.
  const both_way_orders = orders
    .concat(orders.map(rule => [rule[1], rule[0], -rule[2]]));
  // use this hashtable "rules" to ensure consistencies across all rules.
  // keys are indices of two faces in a string: "2 5"
  // values are -1,0,1 for a valid rule, "false" for invalid rule.
  const rules = [];
  // iterate all rules (these already include their inverses), store them in
  // the hashtable which checking for contradictions to the rule.
  for (let r = 0; r < both_way_orders.length; r++) {
    const rule = both_way_orders[r];
    if (!rules[rule[0]]) { rules[rule[0]] = []; }
    // const key = `${rule[0]} ${rule[1]}`;
    // if the rule was already invalidated, skip.
    if (rules[rule[0]][rule[1]] === false) { continue; }
    // if the rule hasn't been set, set it and return.
    if (rules[rule[0]][rule[1]] === undefined) {
      rules[rule[0]][rule[1]] = rule[2];
      continue;
    }
    // if we uncover an inconsistency, invalidate both this rule and
    // the rule's inverse to prevent future contradictions.
    if (rules[rule[0]][rule[1]] !== rule[2]) {
      rules[rule[0]][rule[1]] = false;
      if (!rules[rule[1]]) { rules[rule[1]] = []; }
      rules[rule[1]][rule[0]] = false;
    }
  }

  return rules
    .map((row, i) => row
      .map((direction, j) => ([i, j, direction])))
    .reduce((a, b) => a.concat(b), [])
    .filter(el => el[2] !== false);
};

export default get_common_rules;
