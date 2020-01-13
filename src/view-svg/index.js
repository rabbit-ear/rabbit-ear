/** FOLD file view
 * this is an SVG based front-end for the FOLD file format
 *  (FOLD file spec: https://github.com/edemaine/fold)
 *
 *  View constructor arguments:
 *   - FOLD file
 *   - DOM object, or "string" DOM id to attach to
 */

import FoldToSvg from "../../include/fold-to-svg";
import SVG from "../../include/svg";
import { bounding_rect } from "../FOLD/boundary";
import {
  drawDiagram,
  drawLabels,
  drawDebug,
  // drawDelaunay
} from "./draw";

const options = {
  attributes: {
    edges: {
      valley: { "stroke-dasharray": "0.04 0.02" },
      mark: { stroke: "lightgray" }
    },
    faces: {
      fill: "#0002",
      front: { fill: "white" },
      back: { fill: "lightgray" }
    }
  }
}

const DEFAULTS = Object.freeze({
  // are layers visible
  // if a group is invisible the system will skip drawing and save time
  boundaries: true,
  faces: true,
  edges: true,
  vertices: false,
  diagram: false,
  labels: false,
  debug: false,
  // delaunay: false,
  // options
  autofit: true,
  padding: 0,
  // shadows: false,
  // style
  strokeWidth: 0.01, // as a percent of the page.
  // added recently
  style: undefined,
  arrowColor: undefined,
});

const parseOptions = function (...args) {
  const keys = Object.keys(DEFAULTS);
  const options = {};
  Array(...args)
    .filter(obj => typeof obj === "object")
    .forEach(obj => Object.keys(obj)
      .filter(key => keys.includes(key))
      .forEach((key) => { options[key] = obj[key]; }));
  return options;
};

const View = function (graph, ...args) {
  const svg = SVG(...args);

  // const graph = fold_file;
  // const svgStyle = svg.stylesheet(DEFAULT_STYLE);
  // const defs = svg.defs();
  // defs.appendChild(shadowFilter("faces_shadow"));

  // make SVG groups, containers for the crease pattern parts
  // the order of this list causes the layer order
  const groups = {};
  // additional diagram layer on top. for folding diagram arrows, etc...
  ["boundaries", "faces", "edges", "vertices", "diagram", "labels"
  ].forEach((key) => {
    groups[key] = svg.group();
    groups[key].setAttribute("class", key);
    // pass touches through. faces/edges will not intercept events
    groups[key].pointerEvents("none");
  });
  // default styles. no-fill faces, edges have a stroke..
  // groups.edges.strokeWidth(1);
  // groups.faces.strokeWidth(1);
  // groups.boundaries.strokeWidth(1);
  // groups.delaunay.fill("none");
  // groups.delaunay.strokeWidth(0.1);
  // groups.delaunay.stroke("red");
  // groups.edges.setAttribute("stroke", "black");
  // groups.faces.setAttribute("stroke", "none");
  // groups.faces.setAttribute("fill", "none");
  // groups.boundaries.setAttribute("fill", "none");
  // Object.keys(groups).forEach((key) => {
  //   // pass touches through. faces/edges will not intercept events
  //   groups[key].pointerEvents("none");
  // });

  const options = {};
  Object.assign(options, DEFAULTS);
  const userDefaults = parseOptions(...args);
  Object.keys(userDefaults).forEach((key) => {
    options[key] = userDefaults[key];
  });

  const fit = function () {
    const r = bounding_rect(graph);
    const vmin = r[2] > r[3] ? r[3] : r[2];
    SVG.setViewBox(svg, r[0], r[1], r[2], r[3], options.padding * vmin);
  };

  const draw = function () {
    const drawOptions = (graph.frame_classes && graph.frame_classes.includes("foldedForm")
      ? { output: "svg", edges: false, boundaries: false }
      : { output: "svg" });
    console.log(options);
    if (options.padding) { drawOptions.padding = options.padding; }
    const newSVG = FoldToSvg(graph, drawOptions);
    // remove old data
    while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }
    // transfer everything over to our SVG
    Array.from(newSVG.childNodes).forEach(group => {
      newSVG.removeChild(group);
      svg.appendChild(group);
    });
    Array.from(newSVG.attributes)
      .forEach(attr => svg.setAttribute(attr.name, attr.value));
  };
  // const draw = function () {
  //   // copy FOLD classes over to the SVG
  //   const file_classes = (graph.file_classes != null
  //     ? graph.file_classes : []).join(" ");
  //   const frame_classes = graph.frame_classes != null
  //     ? graph.frame_classes : [].join(" ");
  //   const top_level_classes = [file_classes, frame_classes]
  //     .filter(s => s !== "")
  //     .join(" ");
  //   svg.setAttribute("class", top_level_classes);

  //   // clear last draw
  //   Object.keys(groups).forEach(key => groups[key].removeChildren());

  //   // draw geometry into groups
  //   Object.keys(groups)
  //     .filter(key => options[key])
  //     .filter(key => FoldToSvg.components.svg[key] !== undefined)
  //     .forEach(key => FoldToSvg.components.svg[key](graph)
  //       .forEach(o => groups[key].appendChild(o)));

  //   // draw additional content
  //   if (options.autofit) { fit(); }
  //   if (options.diagram) { drawDiagram(graph, groups.diagram); }
  //   if (options.labels) { drawLabels(graph, groups.labels); }
  //   if (options.debug) { drawDebug(graph, groups.labels); }
  //   // if (options.delaunay) { drawDelaunay(graph, groups.delaunay); }
  //   // if (options.shadows) {
  //   //   Array.from(groups.faces.childNodes)
  //   //     .forEach(f => f.setAttribute("filter", "url(#faces_shadow)"));
  //   // }

  //   // update styles
  //   const r = bounding_rect(graph);
  //   const vmin = r[2] > r[3] ? r[3] : r[2];
  //   const vmax = r[2] > r[3] ? r[2] : r[3];
  //   const vavg = (vmin + vmax) / 2;
  //   const strokeWidth = vavg * options.strokeWidth;
  //   ["boundaries", "faces", "edges"]
  //   // ["boundaries", "faces", "edges", "vertices"]
  //     .forEach(key => groups[key].strokeWidth(strokeWidth));
  //   // if (options.style) {
  //   //   svgStyle.setTextContent(DEFAULT_STYLE + options.style);
  //   // }
  // };

  Object.defineProperty(svg, "draw", { value: draw });
  Object.defineProperty(svg, "fit", { value: fit });
  Object.defineProperty(svg, "setViewBox", {
    value: (x, y, w, h, padding) => SVG.setViewBox(svg, x, y, w, h, padding)
  });
  Object.defineProperty(svg, "options", { get: () => options });
  Object.defineProperty(svg, "groups", { get: () => groups });

  return svg;
};

export default View;
