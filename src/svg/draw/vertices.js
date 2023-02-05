/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../../general/strings.js";
// get the SVG library from its binding to the root of the library
import root from "../../root.js";

export const verticesCircle = (graph, attributes = {}) => {
	const g = root.svg.g();
	if (!graph || !graph.vertices_coords) { return g; }
	graph.vertices_coords
		.map(v => root.svg.circle(v[0], v[1], 0.01)) // radius overwritten in "style"
		.forEach(v => g.appendChild(v));
	// default style
	g.setAttributeNS(null, "fill", S._none);
	// style attributes on group container
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};
