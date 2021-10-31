/**
 * Rabbit Ear (c) Robby Kraft
 */
import * as S from "../symbols/strings";
import DrawGroups from "./draw/index";
import fold_classes from "./classes";
// get the SVG library from its binding to the root of the library
import root from "../root";
/**
 * @description get a bounding box from a FOLD graph by inspecting its vertices.
 * @param {object} FOLD object with vertices_coords
 * @returns {number[] | undefined} bounding box as [x, y, width, height]
 *  or undefined if no vertices_coords exist.
 */
const bounding_rect = function ({ vertices_coords }) {
  if (vertices_coords == null || vertices_coords.length <= 0) {
    return undefined;
  }
  const min = Array(2).fill(Infinity);
  const max = Array(2).fill(-Infinity);
  vertices_coords.forEach(v => {
    if (v[0] < min[0]) { min[0] = v[0]; }
    if (v[0] > max[0]) { max[0] = v[0]; }
    if (v[1] < min[1]) { min[1] = v[1]; }
    if (v[1] > max[1]) { max[1] = v[1]; }
  });
  const invalid = isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1]);
  return (invalid
    ? undefined
    : [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
};
// const makeViewBox = function (x, y, width, height, padding = 0) {
//   const scale = 1.0;
//   const d = (width / scale) - width;
//   const X = (x - d) - padding;
//   const Y = (y - d) - padding;
//   const W = (width + d * 2) + padding * 2;
//   const H = (height + d * 2) + padding * 2;
//   return [X, Y, W, H].join(" ");
// };
/**
 * @description extract the relevant information from a FOLD graph and create
 * an object with keys and values for attributes for an SVG.
 * @param {object} FOLD object
 * @returns {object} svg attributes as keys and values.
 */
const make_svg_attributes = (graph, options, setViewBox = true) => {
  const attributes = {
    overflow: "visible",
  };
  if (!graph) { return attributes; }
  // get the dimensions of the graph (if they exist) and set two attributes:
  // viewBox, stroke-width
  const viewBox = bounding_rect(graph);
  if (viewBox && setViewBox) {
    attributes.viewBox = viewBox.join(" ");
    const vmin = Math.min(viewBox[2], viewBox[3]);
    attributes[S.stroke_width] = vmin / 100;
    attributes.width = viewBox[2];
    attributes.height = viewBox[3];
  }
  // add top level classes, "graph" and anything from the FOLD like "foldedForm"
  attributes[S._class] = ["origami"].concat(fold_classes(graph)).join(" ");
  return attributes;
};
/**
 * @description renders a FOLD object into an SVG, ensuring visibility by
 *  setting the viewBox and the stroke-width attributes on the SVG.
 * @param {SVGElement} an already initialized SVG DOM element.
 * @param {object} FOLD object
 * @param {object} options (optional)
 * @returns {SVGElement} the same SVG parameter object.
 */
const drawInto = (element, graph, ...args) => {
  const options = args.filter(el => typeof el === "object").shift() || {};
  const setViewBox = args.filter(el => typeof el === "boolean").shift();
  const attrs = make_svg_attributes(graph, options, setViewBox);
  Object.keys(attrs)
    .forEach(attr => element.setAttributeNS(null, attr, attrs[attr]));
  const groups = DrawGroups(graph, options);
  groups.filter(group => group.childNodes.length > 0)
    .forEach(group => element.appendChild(group));
  Object.keys(DrawGroups).forEach((key, i) =>
    Object.defineProperty(element, key, { get: () => groups[i] }));
  return element;
};
/**
 * @description renders a FOLD object as an SVG, ensuring visibility by
 *  setting the viewBox and the stroke-width attributes on the SVG.
 * @param {object} graph FOLD object
 * @param {object} options (optional)
 * @returns {SVGElement} SVG element, containing the rendering of the origami.
 */
const FOLDtoSVG = (graph, options, setViewBox) => (
  drawInto(root.svg(), graph, options, setViewBox)
);
/**
 * @description adding static-like methods to the main function, four for
 *  drawing the individual elements, and one drawInto for pre-initialized svgs.
 */
Object.keys(DrawGroups).forEach(key => { FOLDtoSVG[key] = DrawGroups[key]; });
FOLDtoSVG.drawInto = drawInto;

export default FOLDtoSVG;
