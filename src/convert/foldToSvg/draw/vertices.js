/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../../../general/strings.js";
import SVG from "../../../svg/index.js";

const drawVertices = (graph, attributes = {}) => {
	const g = SVG.g();
	if (!graph || !graph.vertices_coords) { return g; }
	// radius will be overwritten in "applyTopLevelOptions"
	graph.vertices_coords
		.map(v => SVG.circle(v[0], v[1], 0.01))
		.forEach(v => g.appendChild(v));
	// default style
	g.setAttributeNS(null, "fill", S._none);
	// style attributes on group container
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};

export default drawVertices;
