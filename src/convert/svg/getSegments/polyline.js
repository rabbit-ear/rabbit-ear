/**
 * Rabbit Ear (c) Kraft
 */
import PolygonToSegments from "./polygon";

const PolylineToSegments = function (polyline) {
	const circularPath = PolygonToSegments(polyline);
	circularPath.pop();
	return circularPath;
};

export default PolylineToSegments;
