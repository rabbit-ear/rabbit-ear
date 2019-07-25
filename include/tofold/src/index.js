import window from "./environment/window";
import svg_to_fold from "./svg_to_fold";
import fragment from "./graph/fragment";

const SVGtoFOLD = function (input, options = {}) {
  if (typeof input === "string") {
    const svg = (new window.DOMParser())
      .parseFromString(input, "text/xml").documentElement;
    return svg_to_fold(svg, options);
  }
  // if (input instanceof Document) {
  return svg_to_fold(input, options);
  // let fold = svg_to_fold(result, options);
};

SVGtoFOLD.core = {
  segmentize: () => { },
  fragment
};

export default SVGtoFOLD;
