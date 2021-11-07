/**
 * Rabbit Ear (c) Robby Kraft
 */
import * as S from "../../symbols/strings";
// get the SVG library from its binding to the root of the library
import root from "../../root";

export const vertices_circle = (graph, attributes = {}) => {
	const g = root.svg.g();
	if (!graph || !graph.vertices_coords) { return g; }
  const svg_vertices = graph.vertices_coords
    .map(v => root.svg.circle(v[0], v[1], 0.01)) // radius overwritten in "style"
		.forEach(v => g.appendChild(v));
	// default style
	g.setAttributeNS(null, "fill", S._none);
	// style attributes on group container
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
  return g;
};
