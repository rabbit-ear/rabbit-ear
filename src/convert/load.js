import { possibleFoldObject } from "../core/validate";
import window from "../environment/window";

const possibleFileName = function (string) {
  return string.length < 128 && string.indexOf(".") !== -1;
};

const possibleSVG = function (xml) {
  return xml.tagName === "svg"
    || xml.getElementsByTagName("svg").length > 0;
};

const possibleORIPA = function (xml) {
  // unsure what should constitulte an ORIPA file
  // it appears to include:
  //  <object class="oripa.DataSet">
  const objects = xml.getElementsByTagName("object");
  if (objects.length > 0) {
    return Array.from(objects)
      .filter(o => o.className === "oripa.DataSet").length > 0;
  }
  return false;
};

const supported = {
  SVG: "svg",
  Svg: "svg",
  svg: "svg",
  FOLD: "fold",
  Fold: "fold",
  fold: "fold",
  ORIPA: "oripa",
  Oripa: "oripa",
  oripa: "oripa",
  ".SVG": "svg",
  ".Svg": "svg",
  ".svg": "svg",
  ".FOLD": "fold",
  ".Fold": "fold",
  ".fold": "fold",
  ".ORIPA": "oripa",
  ".Oripa": "oripa",
  ".oripa": "oripa"
};

const load = function (...args) {
  if (args.length <= 0) {
    throw new Error("convert(), load(), missing a file as a parameter");
  }
  const data = args[0];
  let filetype;

  // they provided us with a second parameter, specifying the file type.
  if (args.length >= 2 && typeof args[1] === "string") {
    filetype = supported[args[1]];
    if (filetype === undefined) {
      throw new Error(`expected a file type (like 'svg'), ${args[1]} is unsupported`);
    }
  }
  if (filetype !== undefined) {
    if (typeof data === "string") {
      switch (filetype) {
        case "fold": return { data: JSON.parse(data), type: filetype };
        case "svg":
        case "oripa": return {
          data: (new window.DOMParser())
            .parseFromString(data, "text/xml").documentElement,
          type: filetype
        };
        default: return { data, type: filetype };
      }
    } else {
      return { data, type: filetype };
    }
  }
  // we have to infer the file type
  const datatype = typeof data;
  if (datatype === "string") {
    try {
      const fold = JSON.parse(data);
      if (possibleFoldObject(fold) > 0) {
        return { data: fold, type: "fold" };
      }
      // else, we need to do something with this JSON object that got parsed
    } catch (err) {
      const xml = (new window.DOMParser())
        .parseFromString(data, "text/xml").documentElement;
      if (xml.getElementsByTagName("parsererror").length > 0) {
        // error parsing xml. end of the line. throw error
        if (possibleFileName(data)) {
          throw new Error("did you provide a file name? please load the file first and pass in the data.");
        } else {
          throw new Error("unable to load file. tried XML, JSON");
        }
      } else {
        // valid xml! now to figure out what kind
        if (possibleSVG(xml)) { return { data: xml, type: "svg" }; }
        if (possibleORIPA(xml)) { return { data: xml, type: "oripa" }; }
        return undefined;
      }
    }
    return undefined;
  }
  if (datatype === "object") {
    try {
      const fold = JSON.parse(JSON.stringify(data));
      // silencing this, because it doesn't catch "{}". allowing empty obj.
      // if (possibleFoldObject(fold) > 0) {
      return { data: fold, type: "fold" };
      // }
      // else, we need to do something with this JSON object that got parsed
    } catch (err) {
      // valid xml! now to figure out what kind
      if (typeof data.getElementsByTagName === "function") {
        if (possibleSVG(data)) { return { data, type: "svg" }; }
        if (possibleORIPA(data)) { return { data, type: "oripa" }; }
        return undefined;
      }
      return undefined;
    }
  }
  return undefined;
};

export default load;
