/** FOLD file view
 * this is an SVG based front-end for the FOLD file format
 *  (FOLD file spec: https://github.com/edemaine/fold)
 *
 *  View constructor arguments:
 *   - FOLD file
 *   - DOM object, or "string" DOM id to attach to
 */

// import SVGImage from "../../../../SVG/src/image";
import drawFOLD from "../../../include/fold-draw";
import * as SVG from "../../../include/svg";
import { bounding_rect } from "../../fold/query";
import { shadowFilter } from "./filters";
import {
  drawDiagram,
  drawLabels,
  drawDebug
} from "./draw";
import window from "../../environment/window";

const SVG_NS = "http://www.w3.org/2000/svg";

// const DEFAULT_STYLE = `
// line.mountain { stroke: red; }
// line.valley { stroke: blue; }
// line.mark { stroke: lightgray; }
// polygon { stroke: none; stroke-linejoin: bevel; }
// .foldedForm polygon { fill: rgba(0, 0, 0, 0.1); }
// .foldedForm polygon.front { fill: white; }
// .foldedForm polygon.back { fill: lightgray; }
// .foldedForm line { stroke: none; }
// .foldedForm polygon { stroke: black; }
// `;
const DEFAULT_STYLE = `
line.mountain { stroke: red; }
line.mark { stroke: lightgray; }
line.valley { stroke: blue;
  stroke-dasharray: calc(var(--crease-width) * 2) calc(var(--crease-width) * 2);
}
polygon { stroke: none; stroke-linejoin: bevel; }
.foldedForm polygon { stroke: black; fill: #8881; }
.foldedForm polygon.front { fill: white; }
.foldedForm polygon.back { fill: lightgray; }
.creasePattern polygon { fill: white; stroke: none; }
.foldedForm .boundaries polygon { fill: none; stroke: none; }
.foldedForm line { stroke: none; }
`;

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
  // options
  autofit: true,
  padding: 0,
  shadows: false,
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

const View = function (fold_file, ...args) {
  const graph = fold_file;
  const svg = SVG.image(...args);
  const svgStyle = window.document.createElementNS(SVG_NS, "style");
  const defs = window.document.createElementNS(SVG_NS, "defs");
  svg.appendChild(svgStyle);
  svg.appendChild(defs);
  defs.appendChild(shadowFilter("faces_shadow"));
  svgStyle.innerHTML = DEFAULT_STYLE;

  // make SVG groups, containers for the crease pattern parts
  // the order of this list causes the layer order
  const groups = {};
  // additional diagram layer on top. for folding diagram arrows, etc...
  ["boundaries", "faces", "edges", "vertices", "diagram", "labels"
  ].forEach((key) => {
    groups[key] = svg.group();
    groups[key].setAttribute("class", key);
  });
  // default styles. no-fill faces, edges have a stroke..
  groups.edges.setAttribute("stroke-width", 1);
  groups.faces.setAttribute("stroke-width", 1);
  groups.boundaries.setAttribute("stroke-width", 1);
  groups.edges.setAttribute("stroke", "black");
  groups.faces.setAttribute("stroke", "none");
  groups.faces.setAttribute("fill", "none");
  groups.boundaries.setAttribute("fill", "none");
  Object.keys(groups).forEach((key) => {
    // pass touches through. faces/edges will not intercept events
    groups[key].setAttribute("pointer-events", "none");
  });

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
    // copy FOLD classes over to the SVG
    const file_classes = (graph.file_classes != null
      ? graph.file_classes : []).join(" ");
    const frame_classes = graph.frame_classes != null
      ? graph.frame_classes : [].join(" ");
    const top_level_classes = [file_classes, frame_classes]
      .filter(s => s !== "")
      .join(" ");
    svg.setAttribute("class", top_level_classes);

    // clear last draw
    Object.keys(groups).forEach(key => groups[key].removeChildren());

    // draw geometry into groups
    Object.keys(groups)
      .filter(key => options[key])
      .filter(key => drawFOLD.components.svg[key] !== undefined)
      .forEach(key => drawFOLD.components.svg[key](graph)
        .forEach(o => groups[key].appendChild(o)));

    // draw additional content
    if (options.autofit) { fit(); }
    if (options.diagram) { drawDiagram(graph, groups.diagram); }
    if (options.labels) { drawLabels(graph, groups.labels); }
    if (options.debug) { drawDebug(graph, groups.labels); }
    if (options.shadows) {
      Array.from(groups.faces.childNodes)
        .forEach(f => f.setAttribute("filter", "url(#faces_shadow)"));
    }

    // update styles
    const r = bounding_rect(graph);
    const vmin = r[2] > r[3] ? r[3] : r[2];
    const vmax = r[2] > r[3] ? r[2] : r[3];
    const vavg = (vmin + vmax) / 2;
    const strokeWidth = vavg * options.strokeWidth;
    ["boundaries", "faces", "edges", "vertices"]
      .forEach(key => groups[key].setAttribute("stroke-width", strokeWidth));
    if (options.style) {
      svgStyle.innerHTML = DEFAULT_STYLE + options.style;
    }
  };

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
