/**
 * origami will be the typical entry-point for most users. it can take different
 * forms: webGL, svg, no-frontend node.
 *
 *
 *
 */

import svgView from "./views/svgView";
import glView from "./views/glView";
import NodeOrigami from "./node/nodeOrigami";

import {
  isBrowser,
  isNode,
  // isWebWorker,
} from "../include/svg/src/environment/detect";

const ViewOrigami = function (...args) {
  const typeOptions = args.filter(a => "type" in a === true).shift();
  if (typeOptions !== undefined) {
    switch (typeOptions.type) {
      case "gl":
      case "GL":
      case "webGL":
      case "WebGL":
        return glView(...args);
      case "svg":
      case "SVG":
      default:
        return svgView(...args);
    }
  }
  return svgView(...args);
};

const Origami = function (...args) {
  if (isNode) {
    return NodeOrigami(...args);
  }
  if (isBrowser) {
    return ViewOrigami(...args);
  }
  return {};
};

export default Origami;
