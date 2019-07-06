import FOLD_SVG from "../../include/fold-svg";

/** parser error to check against */
const pErr = (new window.DOMParser())
  .parseFromString("INVALID", "text/xml")
  .getElementsByTagName("parsererror")[0]
  .namespaceURI;

/**
 * this synchronously loads data from "input",
 * if necessary, converts into the FOLD format,
 *
 * valid "input" arguments are:
 * - raw blob contents of a preloaded file (.fold, .oripa, .svg)
 * - SVG DOM objects (<svg> SVGElement)
 */
const load_file = function (input) {
  const type = typeof input;
  if (type === "object") {
    try {
      const fold = JSON.parse(JSON.stringify(input));
      // todo different way of checking fold format validity
      if (fold.vertices_coords == null) {
        throw new Error("tried FOLD format, got empty object");
      }
      return fold;
    } catch (err) {
      if (input instanceof Element) {
        FOLD_SVG.toFOLD(input, fold => fold);
        return undefined;
      }
      console.warn("could not load file, object is either not valid FOLD or corrupt JSON.", err);
      return undefined;
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
      const fold = JSON.parse(input);
      return fold;
    } catch (err) {
      // try rendering the XML string
      const xml = (new window.DOMParser()).parseFromString(input, "text/xml");
      if (xml.getElementsByTagNameNS(pErr, "parsererror").length === 0) {
        const parsedSVG = xml.documentElement;
        FOLD_SVG.toFOLD(parsedSVG, fold => fold);
        return undefined;
      }
      // let extension = input.substr((input.lastIndexOf(".") + 1));
      // filename. please use a asynchronous file loader before passing data here
    }
  }
  return undefined;
};

export default load_file;
