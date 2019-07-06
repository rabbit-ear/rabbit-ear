/**
 * SVG in Javascript (c) Robby Kraft
 */

import {
  svg,
  group,
  style,
} from "./elements/main";

import {
  line,
  circle,
  ellipse,
  rect,
  polygon,
  polyline,
  bezier,
  text,
  wedge,
  arc,
  setPoints,
  setArc,
} from "./elements/primitives";

import {
  regularPolygon,
} from "./elements/polygons";

import {
  straightArrow,
  arcArrow,
} from "./elements/arrows";

import {
  setViewBox,
  getViewBox,
  scaleViewBox,
  translateViewBox,
  convertToViewBox,
} from "./viewBox";

import {
  removeChildren,
  save,
  load,
} from "./DOM";

import image from "./image";
import { controls, controlPoint } from "./controls";

export {
  svg,
  group,
  style,
  line,
  circle,
  ellipse,
  rect,
  polygon,
  polyline,
  bezier,
  text,
  wedge,
  arc,
  setPoints,
  setArc,
  regularPolygon,
  straightArrow,
  arcArrow,
  setViewBox,
  getViewBox,
  scaleViewBox,
  translateViewBox,
  convertToViewBox,
  removeChildren,
  save,
  load,
  image,
  controls,
  controlPoint,
};
