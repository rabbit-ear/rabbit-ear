/**
 * Rabbit Ear (c) Robby Kraft
 */
/**
 * @description given a faces_layer N-length, create an NxN list of
 * pairs relating each index to another as an array, where the first two
 * elements are the two indices, and the third is the direction the one index
 * is to the other, where +1 is above, -1 below, 0 is the same level, and
 * is read as "[0] is (above/below) index [1]". the set includes both ways
 * of each rule is set face1-face2 and face2-face1, but not the diagonal,
 * face1-face1.
 * @param {number[]} faces_layer solutions.
 * @returns {number[][]} array of rules where each rule is a 3-item array
 * the first two numbers are face indices, 3rd is direction +1, -1, or 0.
 */
const faces_layer_to_relationships = faces_layer => faces_layer
  .map((_, i) => faces_layer
    .map((_, j) => ([i, j, Math.sign(faces_layer[i] - faces_layer[j])])))
  .reduce((a, b) => a.concat(b), [])
  .filter(el => el[0] !== el[1]);

export default faces_layer_to_relationships;

// import { make_triangle_pairs } from "../graph/arrays";

// const faces_layer_to_relationships = faces_layer =>
//   make_triangle_pairs(Object.keys(faces_layer))
//     .map(pair => pair.concat(
//       Math.sign(faces_layer[pair[0]] - faces_layer[pair[1]])
//     ));

/**
 * @param {number[][]} array of faces_layer solutions.
 * @returns {number[][]} array of rules where each rule is a 3-item array
 * the first two numbers are face indices, 3rd is direction +1, -1, or 0.
 */
// export const faces_layers_to_orders = faces_layers => faces_layers
//   .map(Object.keys)
//   .map(make_triangle_pairs)
//   .map((pairs, i) => pairs
//     .map(pair => pair.concat(
//       Math.sign(faces_layers[i][pair[0]] - faces_layers[i][pair[1]])
//     )));
