import FoldToSvg from "../../include/fold-to-svg";
import SVG from "../../include/svg";
import { bounding_rect } from "../FOLD/boundary";
import {
  isBrowser,
  isNode
} from "../environment/detect";
import window from "../environment/window";
import touchToFold from "./touchToFold";

// const DEFAULTS = Object.freeze({
//   // are layers visible
//   // if a group is invisible the system will skip drawing and save time
//   boundaries: true,
//   faces: true,
//   edges: true,
//   vertices: false,
//   diagram: false,
//   labels: false,
//   debug: false,
//   // delaunay: false,
//   // options
//   autofit: true,
//   padding: 0,
//   // shadows: false,
//   // style
//   strokeWidth: 0.01, // as a percent of the page.
//   // added recently
//   style: undefined,
//   arrowColor: undefined,
// });

const interpreter = {
  gl: "webgl",
  GL: "webgl",
  webGL: "webgl",
  WebGL: "webgl",
  webgl: "webgl",
  Webgl: "webgl",
  svg: "svg",
  SVG: "svg",
  "2d": "svg",
  "2D": "svg",
  "3d": "webgl",
  "3D": "webgl",
};

const parseOptionsForView = function (...args) {
  // ignores other objects, only ends up with one.
  const viewOptions = args
    .filter(a => typeof a === "object")
    .filter(a => "view" in a === true)
    .shift();
  if (viewOptions === undefined) {
    // do nothing
    if (isNode) { return undefined; }
    if (isBrowser) { return "svg"; }
  }
  return interpreter[viewOptions.view];
};

const SVGView = function (origami, ...args) {
  const noCallbackArgs = args.filter(arg => typeof arg !== "function");
  const svg = SVG(...noCallbackArgs);

  const options = {};
  const layerNames = ["boundaries", "edges", "faces", "vertices"];

  const fit = function () {
    const r = bounding_rect(origami);
    svg.setViewBox(...r);
    // const vmin = r[2] > r[3] ? r[3] : r[2];
    // SVG.setViewBox(svg, r[0], r[1], r[2], r[3], options.padding * vmin);
  };

  const draw = function () {
    const drawOptions = { output: "svg" };//(origami.frame_classes && origami.frame_classes.includes("foldedForm")
      // ? { output: "svg", edges: false, boundaries: false }
      // : { output: "svg" });
    if (options.padding) { drawOptions.padding = options.padding; }
    const newSVG = FoldToSvg(origami, drawOptions);
    const newSVGChildren = Array.from(newSVG.childNodes);
    const newSVGGroups = layerNames
      .map(string => newSVGChildren
        .filter(node => string === node.getAttribute("class"))
        .shift())
      .filter(node => node !== undefined);
    const oldSVGChildren = Array.from(svg.childNodes);
    const oldSVGGroups = layerNames
      .map(string => oldSVGChildren
        .filter(node => string === node.getAttribute("class"))
        .shift())
      .filter(node => node !== undefined);
    if (oldSVGGroups.length > 0) {
      newSVGGroups.forEach(node => svg.insertBefore(node, oldSVGGroups[0]));
    } else {
      newSVGGroups.forEach(node => svg.appendChild(node));
    }
    oldSVGGroups.forEach(node => parent.removeChild(node));
    newSVGGroups.forEach(node => node.setAttribute("pointerEvents", "none"));
    Array.from(newSVG.attributes)
      .forEach(attr => svg.setAttribute(attr.name, attr.value));
  };

  if (origami.options.touchFold === true) {
    touchToFold(origami, origami.svg);
  }
  // view specific initializers
  fit();
  draw();
  origami.didChange.push(draw);
  Object.defineProperty(origami, "draw", { value: draw });
  Object.defineProperty(origami, "svg", { get: () => view });

  const sendCallback = function () {
    args.filter(arg => typeof arg === "function")
      .forEach(func => func.call(origami, origami));
  };
  // call sendCallback as soon as possible. check if page has loaded
  if (window.document.readyState === "loading") {
    // wait until after the <body> has rendered
    window.document.addEventListener("DOMContentLoaded", sendCallback);
  } else {
    sendCallback();
  }
};

const View = function (origami, ...args) {
  switch (parseOptionsForView(...args)) {
    case "svg": SVGView(origami, ...args); break;
    case "webgl":
      // view = glView(origami, ...args);
      // Object.defineProperty(origami, "canvas", { get: () => view });
    break;
  }

};

export default View;
