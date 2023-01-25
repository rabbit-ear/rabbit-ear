/**
 * Rabbit Ear (c) Kraft
 */
import { getAttributesFloatValue } from "./attributes";

const LineToSegments = (line) => [
	getAttributesFloatValue(line, ["x1", "y1", "x2", "y2"]),
];

export default LineToSegments;
