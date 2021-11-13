import math from "../../math";
import { fn_and } from "../../symbols/functions";
/**
 * @description given two indices, return a copy of the array between them,
 * excluding the elements at the indices themselves.
 * @returns {any[]} the subarray exclusively between the two indices.
 */
const between = (arr, i, j) => (i < j)
  ? arr.slice(i + 1, j)
  : arr.slice(j + 1, i);

const is_boundary = { "B": true, "b": true };
/**
 * @params {[number, number][]} for every sector, "start" and "end" of each sector
 * this is the output of having run "fold_sectors_with_assignments"
 * @param {string[]} assignments.
 * @param {number[]} layers_face, index is z-layer, value is the sector/face.
 * @returns {boolean} does a violation occur. "false" means all good.
 */
const layers_intersect = (folded_faces, assignments, layers_face, epsilon = math.core.EPSILON) => {
  // for every sector/face, the value is its index in the layers_face array
  const faces_layer = [];
  layers_face.forEach((face, i) => { faces_layer[face] = i; });
  // for every sector, the location of the end of the sector after folding
  // (the far end, the second end visited by the walk)
  const fold_location = folded_faces
    .map(ends => ends[1]);
  // for every sector, the location of the end which lies nearest to -Infinity
  const faces_mins = folded_faces
    .map(ends => Math.min(...ends))
    .map(n => n + epsilon);
  // for every sector, the location of the end which lies nearest to +Infinity
  const faces_maxs = folded_faces
    .map(ends => Math.max(...ends))
    .map(n => n - epsilon);
  // true false, is an assignment a boundary
  const boundary_assignments = assignments.map(a => !!(is_boundary[a]));
  // true false, is a sector not accessible from index 0 by walking
  // without crossing a boundary crease.
  // these sectors should be marked as exceptions, not to be tested
  const separated_faces = assignments
    .map((_, i) => folded_faces[i] === undefined);

  // console.log("layers_intersect test", layers_face, "boundary_assignments", boundary_assignments, "separated_faces", separated_faces);

  // we can't test a the loop back around when j==end and i==0 because they only
  // connect after the piece has been completed,
  // but we do need to test it when that happens
  // const max = layers_face.length + (layers_face.length === sectors.length ? 0 : -1);
  const max = layers_face.length
    + (layers_face.length === folded_faces.length ? 0 : -1);
  // iterate through all the faces, take each face together with the next face,
  // establish the fold line between them, then check the layer stacking and
  // gather all faces that exist between this pair of faces, test each
  // of them to see if they cross through this pair's fold line.
  for (let i = 0; i < max; i += 1) {
    // this is the next face in the folding sequence
    const j = (i + 1) % layers_face.length;
    // if the face is cut-off from face #0 by boundary creases,
    // the test is useless, skip this iteration.
    if (separated_faces[i] || separated_faces[j]) { continue; }
    // todo consider prebuilding a table of comparing fold locations with face mins and maxs
    const layers_between = between(layers_face, faces_layer[i], faces_layer[j]);
    // check if the fold line is (below/above) ALL of the sectors between it
    // it will be above if
    const all_below_min = layers_between
      .map(index => fold_location[i] < faces_mins[index])
      .reduce(fn_and, true);
    const all_above_max = layers_between
      .map(index => fold_location[i] > faces_maxs[index])
      .reduce(fn_and, true);
    // console.log("test", i, layers_face, "assignment", assignments[i], "between", faces_layer[i], faces_layer[j], "layers_between", layers_between, all_below_min, all_above_max);
    // todo: random guess at a fix. does this work?

    // const is_boundary = assignments[i] === "b" || assignments[i] === "B";
    if (!all_below_min && !all_above_max) { return true; }
    // if (!all_beyond_min_max[0] && !all_beyond_min_max[1]) { return true; }
  }
  // last test: test the first assignment[0]. make sure the final crease turns
  // the correct direction to connect back to the beginning.
  return false;
};

export default layers_intersect;
