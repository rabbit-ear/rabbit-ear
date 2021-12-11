/**
 * Rabbit Ear (c) Robby Kraft
 */
import { fn_cat } from "../../general/functions";
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
 * 
 * note: MUST be written using .forEach, it must accept arrays with holes
 * and skip over the indices which aren't used.
 */
export const faces_layer_to_relationships = faces_layer => faces_layer
  .map((_, i) => faces_layer
    .map((_, j) => ([i, j, Math.sign(faces_layer[i] - faces_layer[j])])))
  .reduce((a, b) => a.concat(b), [])
  .filter(el => el[0] !== el[1]);
// import { make_triangle_pairs } from "../general/arrays";
// const faces_layer_to_relationships = faces_layer =>
//   make_triangle_pairs(Object.keys(faces_layer))
//     .map(pair => pair.concat(
//       Math.sign(faces_layer[pair[0]] - faces_layer[pair[1]])
//     ));
/**
 * @description often a single-vertex can have multiple valid layer orderings
 * for its folded state. given a set of possible layer order solutions of a
 * folded single-vertex, and given that this is the complete set, extract all
 * the relationships between pairs of faces that are true for every case.
 * @param {number[][]} faces_layers, array of multiple faces_layer solutions.
 * @returns {number[][]} array of relationships where each relationship is an
 * array of 3 numbers. the first two are faces, the third is the relationship.
 * so for example, "index 8 is below index 20" looks like [8, 20, -1].
 */
export const common_relationships = (faces_layers) => {
  const orders = faces_layers
    .map(faces_layer_to_relationships)
    .reduce(fn_cat, []);
  // use this hashtable "rules" to ensure consistencies across all rules.
  const rules = [];
  // iterate all rules (these already include their inverses), store them in
  // the hashtable which checking for contradictions to the rule.
  for (let r = 0; r < orders.length; r++) {
    const rule = orders[r];
    // make sure these rows contain arrays
    if (!rules[rule[0]]) { rules[rule[0]] = []; }
    if (!rules[rule[1]]) { rules[rule[1]] = []; }
    // if the rule was already invalidated, skip.
    if (rules[rule[0]][rule[1]] === false) { continue; }
    // if the rule hasn't been set, set it and return.
    if (rules[rule[0]][rule[1]] === undefined) {
      rules[rule[0]][rule[1]] = rule[2];
      rules[rule[1]][rule[0]] = -rule[2];
      continue;
    }
    // if we uncover an inconsistency, invalidate both this rule and
    // the rule's inverse to prevent future contradictions.
    if (rules[rule[0]][rule[1]] !== rule[2]) {
      rules[rule[0]][rule[1]] = false;
      rules[rule[1]][rule[0]] = false;
    }
  }
  return rules
    .map((row, i) => row
      .map((direction, j) => ([i, j, direction])))
    .reduce((a, b) => a.concat(b), [])
    .filter(el => el[2] !== false);
};

// this has been incorporated directly into the one place it is being used,
// make_face_layer_matrix.js
//
// /**
//  * @returns {number[][][]} array of array of relationships: [f1, f2, dir]
//  */
// export const make_single_vertex_face_orders = (graph, face, epsilon) => {
//   const vertices_faces_layer = make_vertices_faces_layer(graph, face, epsilon);
//   // extract all the solutions at vertices where there is only one solution
//   // we can be absolutely certain about these rules. add them first.
//   const fixed_orders = vertices_faces_layer
//     .filter(solutions => solutions.length === 1)
//     .map(solutions => solutions[0])
//     .map(faces_layer_to_relationships)
//   // complex cases have more than one solution, but among all their solutions,
//   // there are consistent rules that are true among all solutions. find those.
//   const multiple_common_orders = vertices_faces_layer
//     .filter(solutions => solutions.length > 1)
//     .map(common_relationships);
//   // combine rules into one set of sets
//   return fixed_orders.concat(multiple_common_orders);
// };
