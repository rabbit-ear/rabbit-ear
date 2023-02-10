/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";

const boundary_for_arrows = ({ vertices_coords }) => math
	.convexHull(vertices_coords);

const widest_perpendicular = (polygon, foldLine, point) => {
	if (point === undefined) {
		const foldSegment = math.clipLineConvexPolygon(
			polygon,
			foldLine.vector,
			foldLine.origin,
			math.exclude,
			math.includeL,
		);
		if (foldSegment === undefined) { return; }
		point = math.midpoint(...foldSegment);
	}
	const perpVector = math.rotate90(foldLine.vector);
	const smallest = math
		.clipLineConvexPolygon(
			polygon,
			perpVector,
			point,
			math.exclude,
			math.includeL,
		)
		.map(pt => math.distance(point, pt))
		.sort((a, b) => a - b)
		.shift();
	const scaled = math.scale(math.normalize(perpVector), smallest);
	return math.segment(
		math.add(point, math.flip(scaled)),
		math.add(point, scaled)
	);
};
/**
 * @description given an origami model and a fold line, without knowing
 * any of the parameters that determined the fold line, find an arrow
 * that best fits the origami as a diagram step.
 * @param {object} graph a FOLD object
 * @param {object} a line specifying the crease.
 * @returns {SVGElement} one SVG element containing an arrow that matches
 * the dimensions of the FOLD graph.
 */
const simpleArrow = (graph, line) => {
	const hull = boundary_for_arrows(graph);
	const box = math.boundingBox(hull);
	const segment = widest_perpendicular(hull, line);
	if (segment === undefined) { return undefined; }
	const vector = math.subtract(segment[1], segment[0]);
	const length = math.magnitude(vector);
	const direction = math.dot(vector, [1, 0]);
	const vmin = box.span[0] < box.span[1] ? box.span[0] : box.span[1];

	segment.head = {
		width: vmin * 0.1,
		height: vmin * 0.15,
	};
	segment.bend = direction > 0 ? 0.3 : -0.3;
	segment.padding = length * 0.05;
	return segment;
};

export default simpleArrow;
