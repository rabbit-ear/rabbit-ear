import math from "../math";
import { fn_and } from "../arguments/functions";

const up_down_map = { V: 1, v: 1, M: -1, m: -1 };
/**
 * valley fold sets the paper above the previous sector, but a valley fold
 * AFTER a valley fold moves the paper below. up or down is based on i % 2 
 * @returns {number} unit directionality. +1 for up, -1 down
 */
const upOrDown = (mv, i) => i % 2 === 0 ? up_down_map[mv] : -up_down_map[mv];
/**
 * @returns {any[]} given two indices return the contents of the array between them
 */
const between = (arr, i, j) => (i < j) ? arr.slice(i + 1, j) : arr.slice(j + 1, i);
/**
 * @description sectors and assignments are fencepost aligned so that assignments
 *  precedes sectors sectors[0] is between assignments[0] and assignments[1].
 * @param {number[]} ordered sector angles, or length of paper between folds
 * @param {string[]} array of "M","V" (or "m","v"), assignment of fold between sectors
 * @returns {number[][]} array of solutions where each solution is an array of numbers
 *  where each index is the sector, and each value is the order in the layer stack.
 */
const get_sectors_layer = (sectors, assignments, epsilon = math.core.EPSILON) => {
  let pointer = 0;
  // globally, the location that each fold takes place along the +X
  const fold_location = sectors
    .map((sec, i) => i % 2 === 0 ? sec : -sec) // sectors as relative motions
    .map(move => pointer += move);
  // with epsilon for added permissive (folds can lie exactly on top of one another)
  const sector_mins = fold_location
    .map((sec, i, arr) => i % 2 === 0 ? arr[(i + arr.length - 1) % arr.length] : sec)
    .map(n => n + epsilon);
  const sector_maxs = fold_location
    .map((sec, i, arr) => i % 2 === 0 ? sec : arr[(i + arr.length - 1) % arr.length])
    .map(n => n - epsilon);

  const test = (layering) => {
    const index_of_index = [];
    layering.forEach((layer, i) => { index_of_index[layer] = i; });
    // we can't test a the loop back around when j==end and i==0 because they only
    // connect after the piece has been completed,
    // but we do need to test it when that happens
    const max = layering.length + (layering.length === sectors.length ? 0 : -1);
    for (let i = 0; i < max; i += 1) {
      const j = (i + 1) % layering.length;
      // todo consider prebuilding a table of comparing fold locations with sector mins and maxs
      const layers_between = between(layering, index_of_index[i], index_of_index[j]);
      // check if the fold line is (below/above) ALL of the sectors between it
      // it will be above if
      const all_below_min = layers_between
        .map(index => fold_location[i] < sector_mins[index])
        .reduce(fn_and, true);
      const all_above_max = layers_between
        .map(index => fold_location[i] > sector_maxs[index])
        .reduce(fn_and, true);
      // console.log("test ", i, layering, "between", index_of_index[i], index_of_index[j], "layers_between", layers_between, all_below_min, all_above_max);
      if (!all_below_min && !all_above_max) { return false; }
      // if (!all_beyond_min_max[0] && !all_beyond_min_max[1]) { return false; }
    }
    return true;
  };

  // sectors and assignments are fenceposted.
  // sectors[i] is bounded by assignment[i] assignment[i + 1]
  const recurse = (stack = [], iter = 0, currentLayer = 0) => {
    stack = stack.slice(0, currentLayer).concat(
      [iter],
      stack.slice(currentLayer, stack.length));
    // check for a violation
    if (!test(stack)) { return []; }
    // return if done
    if (iter >= sectors.length - 1) { return [stack]; }
    const next_dir = upOrDown(assignments[(iter + 1) % sectors.length], iter);
    const spliceIndices = next_dir === 1
      ? Array.from(Array(stack.length - currentLayer)).map((_, i) => currentLayer + i + 1)
      : Array.from(Array(currentLayer + 1)).map((_, i) => i);
    // if done
    return spliceIndices
      .map(i => recurse(stack, iter + 1, i))
      .reduce((a, b) => a.concat(b), []);
  };

  return recurse();
};

export default get_sectors_layer;
