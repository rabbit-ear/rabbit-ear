/**
 * Rabbit Ear (c) Kraft
 */
/**
 * in SVG a list of points is a SPACE-separated string, where each point is
 * COMMA-separated. example: 0.5,0.5 2,3 10,1
 */
import LineToSegments from "./line.js";
import RectToSegments from "./rect.js";
import PolygonToSegments from "./polygon.js";
import PolylineToSegments from "./polyline.js";
import PathToSegments from "./path.js";
/**
 * @description Given an svg drawing element, convert
 * it into an array of line segments {number[][]} where
 * each segment is an array of 4 values: x1, y1, x2, y2.
 * @param {Element[]} elements a flat array of svg drawing elements
 * @returns {object[]} an array of line segement objects, each with
 * "segment" and "attributes" properties.
 */
const parsers = {
	line: LineToSegments,
	rect: RectToSegments,
	polygon: PolygonToSegments,
	polyline: PolylineToSegments,
	path: PathToSegments,
	// circle: CircleToSegments,
	// ellipse: EllipseToSegments,
};

export default parsers;
