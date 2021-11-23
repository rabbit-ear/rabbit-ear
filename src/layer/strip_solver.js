/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import self_intersect from "./validate/self_intersect";
import {
  fold_faces_with_assignments,
  assignments_to_faces_vertical,
} from "./fold_assignments";
import { invert_map } from "../graph/maps";
import { circular_array_valid_ranges } from "../graph/arrays";
import clone from "../graph/clone";
/**
 * faces and assignments are fencepost aligned. assignments precedes faces.
 *       faces: |-----(0)-----(1)-----(2)---- ... -(n-2)-------(n-1)-|
 * assignments: |-(0)-----(1)-----(2)-----(3) ... -------(n-1)-------|
 */
const is_boundary = { "B": true, "b": true };
/**
 * @description given an ordered set of faces and crease assignments
 * between the faces, this recursive algorithm finds every combination
 * of layer orderings that work without causing any self-intersections.
 * "faces" could be 1D lines, the term could be switched out here.
 * @param {number[]} ordered scalars, the length of paper between folds
 * @param {string[]} array of "M","V", assignment of fold between faces
 * @returns {number[][]} array of arrays. each inner array is a solution.
 * each solution is an ordering of faces_order, where each index is a
 * face and each value is the layer the face occupies.
 */
const strip_layer_solver = (ordered_scalars, assignments, epsilon = math.core.EPSILON) => {
  const faces_folded = fold_faces_with_assignments(ordered_scalars, assignments);
  const faces_updown = assignments_to_faces_vertical(assignments);
  // todo: we only really need to check index [0] and [length-1]
  const is_circular = assignments
    .map(a => !(is_boundary[a]))
    .reduce((a, b) => a && b, true);
  // if the sector contains no boundary (cuts), check if the folded state
  // start and end line up, if not, it's clear no solution is possible.
  if (is_circular) {
    const start = faces_folded[0][0];
    const end = faces_folded[faces_folded.length - 1][1];
    if (Math.abs(start - end) > epsilon) {
      // console.log("easy fail, loop does not meet at beginning");
      return [];
    }
  };
  /**
   * @description Consectively visit each face from 0...n, recursively
   * inserting it above or below the current position (in all slots above
   * or below). At the beginning of the recusive function check if there is a
   * violation where the newly-inserted face is causing a self-intersection.
   * @param {number[]} layering is an inverted form of the final return value.
   * indices represent layers, from 0 to N, moving upwards in +Z space,
   * and faces will be inserted into layers as we search for a layer ordering.
   * @param {number} iteration count, relates directly to the face index
   * @param {number} layer, the +Z index layer currently being added to,
   * this is the splice index of layers_face we will be adding the face to.
   */
  const recurse = (layers_faces = [0], face = 0, layer = 0) => {
    const next_face = face + 1;
    // will the next face be above or below the current face's position?
    const next_dir = faces_updown[face];
    // test for any self-intersections throughout the entire layering
    // console.log("RECURSE", face, layer);
    if (self_intersect(faces_folded, layers_faces, is_circular, epsilon)) {
      // console.log("intersection: face, layer, layers_faces", face, layer, layers_faces);
      return [];
    }
    // Exit case: exit once we traverse through all faces.
    if (face >= ordered_scalars.length - 1) {
      // if a boundary vertex is present, we don't need to verify the ends meet
      if (is_circular) {
        // next_dir is now indicating the direction from the final face to the
        // first face, test if this also matches the orientation of the faces.
        const faces_layer = invert_map(layers_faces);
        const first_face_layer = faces_layer[0];
        const last_face_layer = faces_layer[face];
        if (next_dir > 0 && last_face_layer > first_face_layer) {
          // console.log("EXIT FAIL circular closing direction mismatch");
          return [];
        }
        if (next_dir < 0 && last_face_layer < first_face_layer) {
          // console.log("EXIT FAIL circular closing direction mismatch");
          return [];
        }
        // todo: what about === 0 ?
      }
      // console.log("EXIT case ", layers_faces);
      return [layers_faces];
    }
    // Continue case:
    // depending on the direction of the next face (above, below, same level),
    // insert the face into one or many places, then repeat the recursive call.
    // note: causing a self-intersection is possible, hence, check at beginning
    if (next_dir === 0) {
      // append the next face into this layer (making it an array if necessary)
      // and repeat the recursion with no additional layers, just this one.
      layers_faces[layer] = [next_face].concat(layers_faces[layer]);
      // no need to call .slice() on layers_face. only one path forward.
      return recurse(layers_faces, next_face, layer);
    }
    // given our current position (layer) and next_dir (up or down),
    // get the subarray that's either above or below the current layer.
    // these are all the indices we will attempt to insert the new face.
    // - below: [0, layer]. includes layer
    // - above: (layer, length]. excludes layer. includes length (# of faces)
    // this way all indices (including +1 at the end) are covered once.
    // these are used in the splice() method, 0...Length, inserting an element
    // will place the new element before the old element at that same index.
    // so, we need +1 indices (at the end) to be able to append to the end.
    const splice_layers = next_dir === 1
      ? Array.from(Array(layers_faces.length - layer))
        .map((_, i) => layer + i + 1)
      : Array.from(Array(layer + 1))
        .map((_, i) => i);
    // recursively attempt to fit the next folded face at all possible layers.
    // make a deep copy of the layers_faces arrays.
    const next_layers_faces = splice_layers.map(i => clone(layers_faces));
    // insert the next_face into all possible valid locations (above or below)
    next_layers_faces
      .forEach((layers, i) => layers.splice(splice_layers[i], 0, next_face));
    // recursively call 
    return next_layers_faces
      .map((layers, i) => recurse(layers, next_face, splice_layers[i]))
      .reduce((a, b) => a.concat(b), []);
  };
  // the final map converts the layers_faces into faces_layer.
  return recurse().map(invert_map);
};

export default strip_layer_solver;
