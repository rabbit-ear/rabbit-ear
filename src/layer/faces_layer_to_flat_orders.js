import { make_triangle_pairs } from "../graph/arrays";
/**
 * @param {number[][]} array of faces_layer solutions.
 * @returns {number[][]} array of rules where each rule is a 3-item array
 * the first two numbers are face indices, 3rd is direction +1, -1, or 0.
 */
const faces_layer_to_flat_orders = faces_layer =>
  make_triangle_pairs(Object.keys(faces_layer))
    .map(pair => pair.concat(
      Math.sign(faces_layer[pair[0]] - faces_layer[pair[1]])
    ));

export default faces_layer_to_flat_orders;

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
