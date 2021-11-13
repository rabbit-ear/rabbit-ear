/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import { fn_and } from "../../symbols/functions";
import { invert_map } from "../../graph/maps";
/**
 * @description given two indices, return a copy of the array between them,
 * excluding the elements at the indices themselves.
 * @returns {any[]} the subarray exclusively between the two indices.
 */
const between = (arr, i, j) => (i < j)
  ? arr.slice(i + 1, j)
  : arr.slice(j + 1, i);
/**
 * @params {[number, number][]} for every sector, "start" and "end" of each sector
 * this is the output of having run "fold_faces_with_assignments"
 * @param {number[]} layers_face, index is z-layer, value is the sector/face.
 * @param {boolean} do assignments contain a boundary? (to test for loop around)
 * @returns {boolean} does a violation occur. "false" means all good.
 */
const self_intersect_faces = (folded_faces, layers_face, is_circular = true, epsilon = math.core.EPSILON) => {
  // for every sector/face, the value is its index in the layers_face array
  const faces_layer = invert_map(layers_face);
  // for every sector, the location of the end of the sector after folding
  // (the far end, the second end visited by the walk)
  const fold_location = folded_faces
    .map(ends => ends ? ends[1] : undefined);
  // for every sector, the location of the end which lies nearest to -Infinity
  const faces_mins = folded_faces
    .map(ends => ends ? Math.min(...ends) : undefined)
    .map(n => n + epsilon);
  // for every sector, the location of the end which lies nearest to +Infinity
  const faces_maxs = folded_faces
    .map(ends => ends ? Math.max(...ends) : undefined)
    .map(n => n - epsilon);
  // we can't test the loop back around when j==end and i==0 because they only
  // connect after the piece has been completed,
  // but we do need to test it when that happens
  // const max = layers_face.length + (layers_face.length === sectors.length ? 0 : -1);
  const faces_array_circular = is_circular
    && faces_layer.length === folded_faces.length;
  const max = faces_layer.length + (faces_array_circular ? 0 : -1);
  // iterate through all the faces, take each face together with the next face,
  // establish the fold line between them, then check the layer stacking and
  // gather all faces that exist between this pair of faces, test each
  // of them to see if they cross through this pair's fold line.
  // console.log("mins, maxs", fold_location, faces_mins, faces_maxs);
  // console.log("is circular?, max faces", faces_array_circular, max);
  for (let i = 0; i < max; i += 1) {
    // this is the next face in the folding sequence
    const j = (i + 1) % faces_layer.length;
    // if two adjacent faces are in the same layer, they will not be causing an
    // overlap, at least not at their crease (because there is no crease).
    if (faces_layer[i] === faces_layer[j]) { continue; }
    // todo consider prebuilding a table of comparing fold locations with face mins and maxs
    // result of between contains both numbers and arrays: [5,[0,1],2,[3,4]]
    // the reduce will bring everything to the top level: [5,0,1,2,3,4]
    const layers_between = between(layers_face, faces_layer[i], faces_layer[j])
      .reduce((a, b) => a.concat(b), []);
    // check if the fold line is (below/above) ALL of the sectors between it
    // it will be above if
    const all_below_min = layers_between
      .map(index => fold_location[i] < faces_mins[index])
      .reduce(fn_and, true);
    const all_above_max = layers_between
      .map(index => fold_location[i] > faces_maxs[index])
      .reduce(fn_and, true);
    // console.log(i, "fold locations. below/above", fold_location,
    //   layers_between.map(index => fold_location[i] < faces_mins[index]),
    //   layers_between.map(index => fold_location[i] > faces_maxs[index]) );
    if (!all_below_min && !all_above_max) {
      // console.log("fail test at", i, j, all_below_min, all_above_max);
      return true;
    }
  }
  // last test: test the first assignment[0]. make sure the final crease turns
  // the correct direction to connect back to the beginning.
  return false;
};

export default self_intersect_faces;
