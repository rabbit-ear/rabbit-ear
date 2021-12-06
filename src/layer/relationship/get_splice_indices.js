/**
 * Rabbit Ear (c) Robby Kraft
 */
import { fn_def } from "../../symbols/functions";
/**
 * @param {number[]} one of the set [-1, 0, 1, undefined]. indicates
 * the relative location of a face we are attempting to splice, where
 * this face is allowed to splice, 1:above this index, -1:below this index.
 * this is NOT a row from a relationship matrix. rather, it is a
 * layers_face converted into if that face is above or below.
 * examples:
 * [1, 1, undefined, 1, undefined, -1, -1]... valid to insert: [4, 5]
 * [1, 1, undefined, 1, -1, -1, 1]... invalid. no solution.
 * [1, 1, -1, -1]... only one solution: [2]
 * [1, 1, 1, undefined, undefined]: valid to insert: [3, 4, 5]
 */
const get_splice_indices = (layers_face_relative) => {
  const highest_positive = layers_face_relative
    .map((v, i) => v === 1 ? i : undefined)
    .filter(fn_def)
    .pop();
  const lowest_negative = layers_face_relative
    .map((v, i) => v === -1 ? i : undefined)
    .filter(fn_def)
    .shift();
  const bottom_index = highest_positive === undefined
    ? -1
    : highest_positive;
  const top_index = lowest_negative === undefined
    ? layers_face_relative.length
    : lowest_negative;
  if (highest_positive > lowest_negative) { return []; }
  const valid_length = top_index - bottom_index;
  return Array
    .from(Array(valid_length))
    .map((_, i) => i + bottom_index + 1);
};

export default get_splice_indices;
