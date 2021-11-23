/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import self_intersect_faces from "./self_intersect_faces";
import self_intersect_tacos from "./self_intersect_tacos";
/**
 * @params {[number, number][]} for every sector, "start" and "end" of each sector
 * this is the output of having run "fold_faces_with_assignments"
 * @param {number[]} layers_face, index is z-layer, value is the sector/face.
 * @param {boolean} do assignments contain a boundary? (to test for loop around)
 * @returns {boolean} does a violation occur. "false" means all good.
 */
const self_intersect = (folded_faces, layers_face, is_circular = true, epsilon = math.core.EPSILON) => {
  if (self_intersect_faces(folded_faces, layers_face, is_circular, epsilon)) {
    // console.log("faces fail");
    return true;
  }
  if (self_intersect_tacos(folded_faces, layers_face, is_circular, epsilon)) {
    return true;
  }
  return false;
};

export default self_intersect;
