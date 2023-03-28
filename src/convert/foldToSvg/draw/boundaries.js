/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../../../general/strings.js";
import { boundary } from "../../../graph/boundary.js";
import { isFoldedForm } from "../../../fold/spec.js";
import { addClass } from "../../../svg/general/dom.js";
import SVG from "../../../svg/index.js";

const FOLDED = {
	// stroke: "none",
	fill: S._none,
};
const FLAT = {
	stroke: S._black,
	fill: S._white,
};

const applyBoundariesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

// todo this needs to be able to handle multiple boundaries
const drawBoundaries = (graph, attributes = {}) => {
	const g = SVG.g();
	if (!graph) { return g; }
	const polygon = boundary(graph).polygon;
	if (!polygon.length) { return g; }
	const svgPolygon = SVG.polygon(polygon);
	addClass(svgPolygon, S._boundary);
	g.appendChild(svgPolygon);
	// style attributes on group container
	applyBoundariesStyle(g, isFoldedForm(graph) ? FOLDED : FLAT);
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};

export default drawBoundaries;
