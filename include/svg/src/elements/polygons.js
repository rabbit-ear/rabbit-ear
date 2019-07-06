/**
 * SVG in Javascript (c) Robby Kraft
 *
 * arrows!
 */

import { polygon } from "./primitives";

const regularPolygon = function (cX, cY, radius, sides) {
  const halfwedge = 2 * Math.PI / sides * 0.5;
  const r = Math.cos(halfwedge) * radius;
  const points = Array.from(Array(sides)).map((el, i) => {
    const a = -2 * Math.PI * i / sides + halfwedge;
    const x = cX + r * Math.sin(a);
    const y = cY + r * Math.cos(a);
    return [x, y];
  });
  return polygon(points);
};

export { regularPolygon };
