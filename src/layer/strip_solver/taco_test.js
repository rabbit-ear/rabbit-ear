/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import taco_face_test from "./taco_face_test";
import taco_taco_test from "./taco_taco_test";
/**
 * @params {[number, number][]} for every sector, "start" and "end" of each sector
 * this is the output of having run "fold_faces_with_assignments"
 * @param {number[]} layers_face, index is z-layer, value is the sector/face.
 * @param {boolean} do assignments contain a boundary? (to test for loop around)
 * @returns {boolean} test pass. "true" means all good.
 */
const taco_test = (folded_faces, layers_face, is_circular = true, epsilon = math.core.EPSILON) => {
  if (!taco_face_test(folded_faces, layers_face, is_circular, epsilon)) {
    // console.log("faces fail");
    return false;
  }
  if (!taco_taco_test(folded_faces, layers_face, is_circular, epsilon)) {
    return false;
  }
  return true;
};

export default taco_test;
