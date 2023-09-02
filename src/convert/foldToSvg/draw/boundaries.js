/**
 * Rabbit Ear (c) Kraft
 */
import { boundary } from "../../../graph/boundary.js";
import { isFoldedForm } from "../../../fold/spec.js";
import { addClass } from "../../../svg/general/dom.js";
import SVG from "../../../svg/index.js";

const FOLDED = {
	// stroke: "none",
	fill: "none",
};
const FLAT = {
	stroke: "black",
	fill: "white",
};

const applyBoundariesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));

// todo this needs to be able to handle multiple boundaries
const drawBoundaries = (graph, options = {}) => {
	const attributes = options && options.boundaries ? options.boundaries : {};
	const g = SVG.g();
	if (!graph) { return g; }
	const polygon = boundary(graph).polygon;
	if (!polygon.length) { return g; }
	const svgPolygon = SVG.polygon(polygon);
	addClass(svgPolygon, "boundary");
	g.appendChild(svgPolygon);
	// style attributes on group container
	applyBoundariesStyle(g, isFoldedForm(graph) ? FOLDED : FLAT);
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};

export default drawBoundaries;
