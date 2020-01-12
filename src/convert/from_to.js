import FoldToSvg from "../../include/fold-to-svg";
import ORIPA from "../../include/fold/oripa";
import SVGtoFOLD from "../../include/tofold/src/index";
// const SVGtoFOLD = window.tofold || require("tofold");

const from_to = function (data, from, to, ...args) {
  // console.log("From to", ...args);
  // console.log(`converting ${from} to ${to}, with options`, args ? args[0] : null, data);
  switch (from) {
    case "fold":
      switch (to) {
        case "fold": return data;
        case "oripa": return ORIPA.fromFold(data);
        case "svg": return FoldToSvg(data);
        default: break;
      }
      break;
    case "oripa":
      switch (to) {
        case "fold": return ORIPA.toFold(data, true);
        case "oripa": return data;
        case "svg": return FoldToSvg(ORIPA.toFold(data, true));
        default: break;
      }
      break;
    case "svg":
      switch (to) {
        case "fold": return SVGtoFOLD(data, ...args);
        case "oripa": return ORIPA.fromFold(SVGtoFOLD(data, ...args));
        case "svg": return data;
        default: break;
      }
      break;
    default: break;
  }
  return undefined;
};

export default from_to;
