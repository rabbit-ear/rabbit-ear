import { FOLDED_FORM, CREASE_PATTERN } from "./keys";

/**
 * @returns {boolean} is the graph in a folded form? undefined if there is no indication either way.
 */
const isFoldedState = function (graph) {
  if (graph == null
    || graph.frame_classes == null
    || typeof graph.frame_classes !== "object") { return undefined; }
  if (graph.frame_classes.includes(FOLDED_FORM)) { return true; }
  if (graph.frame_classes.includes(CREASE_PATTERN)) { return false; }
  // inconclusive
  return undefined;
};

export default isFoldedState;
