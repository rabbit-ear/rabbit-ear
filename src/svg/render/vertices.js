/**
 * fold to svg (c) Robby Kraft
 */
import * as K from "../keys";

import SVG from "../../extensions/svg";
const Libraries = { SVG };

export const vertices_circle = (graph, options) => {
	const g = Libraries.SVG.g();
  if (K.vertices_coords in graph === false) {
    return g;
  }
  const svg_vertices = graph[K.vertices_coords]
    .map(v => Libraries.SVG.circle(v[0], v[1], 0.01)) // radius overwritten in "style"
		.forEach(v => g[K.appendChild](v));
  // svg_vertices.forEach((c, i) => c[K.setAttributeNS](null, K.index, i));
	g[K.setAttributeNS](null, "fill", "none");
  return g;
};

