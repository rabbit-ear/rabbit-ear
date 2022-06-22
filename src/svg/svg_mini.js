/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../general/strings";
import window from "../environment/window";
/**
 * @description this is a stand-alone replacement for the SVG library
 * it contains all element constructors necessary for the
 * FOLD into SVG rendering methods contained in this library.
 */
const SVG_NS = "http://www.w3.org/2000/svg";

const svg = () => window().document.createElementNS(SVG_NS, "svg");

svg.g = () => window().document.createElementNS(SVG_NS, "g");

svg.path = function (d) {
	const p = window().document.createElementNS(SVG_NS, "path");
	p.setAttributeNS(null, "d", d);
	return p;
};

svg.polygon = function (pointsArray) {
	const shape = window().document.createElementNS(SVG_NS, "polygon");
	const pointsString = pointsArray.map(p => `${p[0]},${p[1]}`).join(" ");
	shape.setAttributeNS(null, "points", pointsString);
	return shape;
};

svg.circle = function (x, y, radius) {
	const shape = window().document.createElementNS(SVG_NS, "circle");
	shape.setAttributeNS(null, "cx", x);
	shape.setAttributeNS(null, "cy", y);
	shape.setAttributeNS(null, "r", radius);
	return shape;
};

svg.NS = SVG_NS;
svg.svg = svg;

export default svg;
