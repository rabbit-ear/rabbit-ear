import FoldToSvg from "../../include/fold-to-svg";
import SVG from "../../include/svg";
import { bounding_rect } from "../FOLD/boundary";
import {
  isBrowser,
  isNode
} from "../environment/detect";
import window from "../environment/window";
import touchToFold from "./touchToFold";

const FoldToSvgOptionKeys = [
  "input", "output", "padding", "file_frame", "stylesheet", "shadows",
  "boundaries", "faces", "edges", "vertices", "attributes"
];

const possibleFoldToSvgOptions = function (input) {
  if (typeof input !== "object" || input === null) { return 0; }
  const inputKeys = Object.keys(input);
  if (inputKeys.length === 0) { return 0; }
  return inputKeys.map(key => FoldToSvgOptionKeys.includes(key))
    .reduce((a, b) => a + (b ? 1 : 0), 0) / inputKeys.length;
};

const parseOptionsForFoldToSvg = function (...args) {
  return args.filter(a => possibleFoldToSvgOptions(a) > 0.1)
    .sort((a, b) => possibleFoldToSvgOptions(b) - possibleFoldToSvgOptions(a))
    .shift();
};

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

  const argumentOptions = parseOptionsForFoldToSvg(...args);
  const options = argumentOptions == null
    ? { output: "svg" }
    : Object.assign(argumentOptions, { output: "svg" });
  const layerNames = ["boundaries", "edges", "faces", "vertices"];

  const fit = function () {
    const r = bounding_rect(origami);
    svg.setViewBox(...r);
    // const vmin = r[2] > r[3] ? r[3] : r[2];
    // SVG.setViewBox(svg, r[0], r[1], r[2], r[3], options.padding * vmin);
  };

  const getComponent = function (component) {
    const group = Array.from(svg.childNodes)
      .filter(node => component === node.getAttribute("class"))
      .shift();
    return group === undefined
      ? []
      : Array.from(group.childNodes);
  };

  const draw = function (innerArgumentOptions) {
    const drawOptions = innerArgumentOptions == null
      ? options
      : Object.assign(innerArgumentOptions, { output: "svg" });

    // (origami.frame_classes && origami.frame_classes.includes("foldedForm")
      // ? { output: "svg", edges: false, boundaries: false }
      // : { output: "svg" });
    const newSVG = FoldToSvg(origami, JSON.parse(JSON.stringify(drawOptions)));
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
    oldSVGGroups.forEach(node => svg.removeChild(node));
    newSVGGroups.forEach(node => node.setAttribute("pointer-events", "none"));
    Array.from(newSVG.attributes)
      .forEach(attr => svg.setAttribute(attr.name, attr.value));
  };

  // view specific initializers
  fit();
  draw();
  origami.changed.handlers.push(caller => draw());
  Object.defineProperty(origami, "draw", { value: draw });  // todo: do we want this?
  Object.defineProperty(origami, "svg", { get: () => svg });
  Object.defineProperty(svg, "vertices", { get: () => getComponent("vertices") });
  Object.defineProperty(svg, "edges", { get: () => getComponent("edges") });
  Object.defineProperty(svg, "faces", { get: () => getComponent("faces") });
  Object.defineProperty(svg, "boundaries", { get: () => getComponent("boundaries") });

  if (options.touchFold === true) {
    touchToFold(origami, origami.svg);
  }

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
    // case "webgl": GLView(origami, ...args); break;
  }

};

export default View;
