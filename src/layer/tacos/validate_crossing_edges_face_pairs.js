import { remove_single_instances } from "../../general/arrays";
/**
 * @param {number[]} stacking order of each face where each face is
 * encoded as its pair number identifier.
 * @returns {boolean} true if the stack passes this test. false if fails.
 */
const validate_crossing_edges_face_pairs = (face_pair_stack) => {
  const pair_stack = remove_single_instances(face_pair_stack);
  let last_seen = undefined;
  for (let i = 0; i < pair_stack.length; i++) {
    if (last_seen === undefined) {
      last_seen = pair_stack[i];
    } else {
      if (last_seen !== pair_stack[i]) { return false; }
      last_seen = undefined;
    }
  }
  return true;
};

export default validate_crossing_edges_face_pairs;
