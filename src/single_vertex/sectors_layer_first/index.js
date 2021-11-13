/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import layers_intersect from "./layers_intersect";
import {
  fold_sectors_with_assignments,
  assignments_to_faces_vertical,
} from "./fold_assignments";
import { invert_simple_map } from "../../graph/maps";

// todo: the only thing remaining is that when the sectors layer
// returns, the 0 face is not indexed at the start of the array.
// it's possible that this is unnecessary anyway.

const is_boundary = { "B": true, "b": true };
/**
 * sectors and assignments are fencepost aligned so that assignments
 * precedes sectors sectors[0] is between assignments[0] and assignments[1].
 *
 * sectors: |-----(0)-----(1)-----(2)---- ... -(n-2)-------(n-1)-|
 * assigns: |-(0)-----(1)-----(2)-----(3) ... -------(n-1)-------|
 */
// remember layering is not layer_order. (it's reversed. order_layer)
// const final_test = (layering) => {
//   // last test: test the first assignment[0]. make sure the final crease turns
//   // the correct direction to connect back to the beginning.
//   const inverted_layering = invert_simple_map(layering);
//   // console.log("first", inverted_layering[0], "and last sector's layer", inverted_layering[inverted_layering.length - 1]);
//   const res = (inverted_layering[0] > inverted_layering[inverted_layering.length - 1]
//     ? assignments[0] === "M"
//     : assignments[0] === "V");
//   return res;
// };
/**
 * @description given an array containing undefineds, starting at index 0,
 * walk backwards (circularly around) to find the first index that isn't
 * undefined. similarly, from 0 increment to the final index that isn't
 * undefined. no undefineds results in [0, length].
 * @param {any[]} the array, which possibly contains holes
 * @param {number} the length of the array. this is required because
 * it's possible that the holes exist at the end of the array,
 * causing it to misreport the (intended) length.
 */
const circular_array_valid_range = (array, array_length) => {
  let start, end;
  for (start = array_length - 1;
    start >= 0 && array[start] !== undefined;
    start--);
  start = (start + 1) % array_length;
  for (end = 0;
    end < array_length && array[end] !== undefined;
    end++);
  return [start, end];
};
/**
 * @description sectors and assignments are fencepost aligned so that assignments
 *  precedes sectors sectors[0] is between assignments[0] and assignments[1].
 * @param {number[]} ordered sector angles, or length of paper between folds
 * @param {string[]} array of "M","V" (or "m","v"), assignment of fold between sectors
 * @returns {number[][]} array of solutions where each solution is an array of numbers
 *  where each index is the sector, and each value is the order in the layer layering.
 *  order numbers could be anything that increments, but we choose whole numbers
 *  starting with 0. which is the same as how indices work. so it may be confusing.
 *  if you flip them around, think [0.2, 0.1, 0.3] would still work, indices point to
 *  sector indices, and the values are the stacking order
 */
const make_sectors_layer = (sectors, assignments, epsilon = math.core.EPSILON) => {
  // globally, the location that each fold takes place along the numberline
  const folded_sectors = fold_sectors_with_assignments(sectors, assignments);
  const folded_sectors_updown = assignments_to_faces_vertical(assignments);
  const contains_boundary = assignments
    .map(a => !!(is_boundary[a]))
    .reduce((a, b) => a || b, false);
  // if the sector contains no boundary (or cuts), check if the folded state
  // start and end line up, if not, it's clear no solution is possible.
  if (!contains_boundary) {
    const start = folded_sectors[0][0];
    const end = folded_sectors[folded_sectors.length - 1][1]
    if (Math.abs(start - end) < epsilon) { return []; }
  };
  // the recursion algorithm will use these as the boundaries.
  // folded_sectors is the array with holes,
  // sectors is the array which will always be referenced to get the length
  const [
    start_face,
    end_face
  ] = circular_array_valid_range(folded_sectors, sectors.length);
  // start at the start index, end BEFORE the end index.
  // a for loop iteration would go: i = start, i < end, i++
  console.log("sect", sectors);
  console.log("Fodled sect", folded_sectors);
  console.log("start and end", start_face, end_face);

  /**
   * @description Consectively visit each face from 0...n, recursively
   * inserting it above or below the current position (in all slots above
   * or below). At the beginning of the recusive function check if there is a
   * violation where the newly-inserted face is causing a self-intersection.
   * @param {number[]} layering is an inverted form of the final return value.
   * the index is the z-layer (0...n, +Z) the value is the sector/face.
   * @param {number} iteration count, relates directly to the face index
   * @param {number} layer, the +Z index layer currently being added to.
   * 
   */
  const recurse = (layers_face = [], face = start_face, layer = 0) => {
    console.log("recurse face and layer", face, layer, "from start to end", start_face, end_face);
    // insert "face" into layers_face at the index: layer
    layers_face.splice(layer, 0, face);
    // check for a violation
    if (layers_intersect(folded_sectors, assignments, layers_face, epsilon)) {
      console.log("violation", layers_face);
      return [];
    }
    // return if done
    // todo: -1 or not?
    if (face === (end_face - 1 + sectors.length) % sectors.length) {
    // if (face === end_face) {
      // if the vertex is a boundary vertex it automatically passes this test
      // return final_test(layers_face) ? [layers_face] : [];
      console.log("solution", layers_face);
      if (!contains_boundary) {
        console.log("Todo: we need to test to make sure the final assignment curves back in the correct direction");
      }
      return [layers_face];
    }
    // layers_face is a stack of faces in the +Z direction, and we are
    // currently at some index ("layer") somewhere in that stack.
    // "next_dir" will tell us if our next face is above or below the
    // current position
    const next_dir = folded_sectors_updown[face];
    // given our current position (layer) and next_dir, gather all the
    // indices above or below the current position. in/exclusivity:
    // below: [0, layer]. (includes layer)
    // above: (layer, length]. (excludes layer. length is # of faces)
    // all indices (+1) are covered once, +1 index past the last index
    // is included. the "layer" index is included in the "below" set.

    // todo: make sure this +1 last index thing is good.
    const splice_indices = next_dir === 1
      ? Array.from(Array(layers_face.length - layer))
        .map((_, i) => layer + i + 1)
      : Array.from(Array(layer + 1))
        .map((_, i) => i);
    // recursively attempt to fit the next folded face in between all
    // the layers in the splice_indices set, above or below current layer.
    // return splice_indices
    //   .map(i => recurse(layers_face.slice(), (face + 1) % sectors.length, i))
    //   .reduce((a, b) => a.concat(b), [])
    //   .map(invert_simple_map);
    // the final step converts the layers_face into faces_layer.
    const res1 = splice_indices
      .map(i => recurse(layers_face.slice(), (face + 1) % sectors.length, i));
    const res2 = res1.reduce((a, b) => a.concat(b), []);
    const res3 = res2.map(invert_simple_map);
    console.log("res", res1, res2, res3);
    return res3;
  };

  return recurse();
};

export default make_sectors_layer;
