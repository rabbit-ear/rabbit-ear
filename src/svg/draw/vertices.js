/**
 * fold to svg (c) Robby Kraft
 */
import * as K from "../keys";

import SVG from "../../extensions/svg";
const Libraries = { SVG };

export const vertices_circle = (graph, attributes = {}) => {
	const g = Libraries.SVG.g();
	if (!graph || !graph.vertices_coords) { return g; }
  const svg_vertices = graph.vertices_coords
    .map(v => Libraries.SVG.circle(v[0], v[1], 0.01)) // radius overwritten in "style"
		.forEach(v => g[K.appendChild](v));
	// default style
	g[K.setAttributeNS](null, "fill", "none");
	// style attributes on group container
	Object.keys(attributes)
		.forEach(attr => g[K.setAttributeNS](null, attr, attributes[attr]));
  return g;
};
