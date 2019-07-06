import { load } from "../../include/svg/src/DOM";
import FOLD_SVG from "../../include/fold-svg";

// let FOLD_SVG = {
//   toFOLD: function (){},
//   toSVG: function (){}
// };


/** parser error to check against */
const pErr = (new window.DOMParser())
  .parseFromString("INVALID", "text/xml")
  .getElementsByTagName("parsererror")[0]
  .namespaceURI;

/**
 * this asynchronously or synchronously loads data from "input",
 * if necessary, converts into the FOLD format,
 * and calls "callback(fold)" with the data as the first argument.
 *
 * valid "input" arguments are:
 * - filenames ("pattern.svg")
 * - raw blob contents of a preloaded file (.fold, .oripa, .svg)
 * - SVG DOM objects (<svg> SVGElement)
 */
const load_file = async function (input) {
  const type = typeof input;
  if (type === "object") {
    try {
      const fold = JSON.parse(JSON.stringify(input));
      // todo different way of checking fold format validity
      if (fold.vertices_coords == null) {
        throw new Error("tried FOLD format, got empty object");
      }
      return fold; // asynchronous loading was not required
    } catch (err) {
      if (input instanceof Element) {
        FOLD_SVG.toFOLD(input, (fold) => { return fold; });
        return undefined; // asynchronous loading was not required
      } else {
        // console.warn("could not load file, object is either not valid FOLD or corrupt JSON.", err);
      }
    }
    // finally {
    //  return;  // currently not used. everything previous is already returning
    // }
  }
  // are they giving us a filename, or the data of an already loaded file?
  if (type === "string" || input instanceof String) {
    // try a FOLD format string
    try {
      // try .fold file format first
      let fold = JSON.parse(input);
      return fold;
    } catch (err) {
      // try rendering the XML string
      let xml = (new window.DOMParser()).parseFromString(input, "text/xml");
      if (xml.getElementsByTagNameNS(pErr, "parsererror").length === 0) {
        let parsedSVG = xml.documentElement;
        FOLD_SVG.toFOLD(parsedSVG, (fold) => { return fold; });
        return undefined;
      }

      let extension = input.substr((input.lastIndexOf(".") + 1));
      // filename. we need to upload
      switch (extension) {
        case "fold":
          fetch(input)
            .then(response => response.json())
            .then((data) => {
              return data; });
          break;
        case "svg":
          load(input, (svg) => {
            FOLD_SVG.toFOLD(input, (fold) => {
              return fold; });
          });
          break;
        case "oripa":
          // ORIPA.load(input, function (fold) {
          // return fold; });
          break;
        default: break;
      }
    }
  }
  return undefined;
};

export default load_file;
