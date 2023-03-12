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
