/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";

const boundary_for_arrows = ({ vertices_coords }) => math.core
	.convex_hull(vertices_coords);

const widest_perpendicular = (polygon, foldLine, point) => {
	if (point === undefined) {
		const foldSegment = math.core.clip_line_in_convex_polygon(polygon,
			foldLine.vector,
			foldLine.origin,
			math.core.exclude,
			math.core.include_l);
		if (foldSegment === undefined) { return; }
		point = math.core.midpoint(...foldSegment);
	}
	const perpVector = math.core.rotate90(foldLine.vector);
	const smallest = math.core
		.clip_line_in_convex_polygon(polygon,
			perpVector,
			point,
			math.core.exclude,
			math.core.include_l)
		.map(pt => math.core.distance(point, pt))
		.sort((a, b) => a - b)
		.shift();
	const scaled = math.core.scale(math.core.normalize(perpVector), smallest);
	return math.segment(
		math.core.add(point, math.core.flip(scaled)),
		math.core.add(point, scaled)
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
const simple_arrow = (graph, line) => {
	const hull = math.core.convex_hull(graph.vertices_coords);
	const box = math.core.bounding_box(hull);
	const segment = widest_perpendicular(hull, line);
	if (segment === undefined) { return undefined; }
	const vector = math.core.subtract(segment[1], segment[0]);
	const length = math.core.magnitude(vector);
	const direction = math.core.dot(vector, [1, 0]);
	const vmin = box.span[0] < box.span[1] ? box.span[0] : box.span[1];

	segment.head = {
		width: vmin * 0.1,
		height: vmin * 0.15,
	};
	segment.bend = direction > 0 ? 0.3 : -0.3;
	segment.padding = length * 0.05;
	return segment;
};

export default simple_arrow;
