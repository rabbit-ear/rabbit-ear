/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../../../general/strings.js";
import SVG from "../../../svg/index.js";

export const verticesCircle = (graph, attributes = {}) => {
	const g = SVG.g();
	if (!graph || !graph.vertices_coords) { return g; }
	graph.vertices_coords
		.map(v => SVG.circle(v[0], v[1], 0.01)) // radius overwritten in "style"
		.forEach(v => g.appendChild(v));
	// default style
	g.setAttributeNS(null, "fill", S._none);
	// style attributes on group container
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};
