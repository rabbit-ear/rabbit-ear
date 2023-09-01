/**
 * Rabbit Ear (c) Kraft
 */
import {
	exclude,
	includeL,
} from "../math/compare.js";
import { boundingBox } from "../math/polygon.js";
import {
	dot,
	magnitude,
	scale,
	normalize,
	add,
	subtract,
	distance,
	midpoint,
	flip,
	rotate90,
} from "../math/vector.js";
import { convexHull } from "../math/convexHull.js";
import { clipLineConvexPolygon } from "../math/clip.js";

const boundary_for_arrows = ({ vertices_coords }) => (
	convexHull(vertices_coords).map(v => vertices_coords[v])
);

const widest_perpendicular = (polygon, foldLine, point) => {
	if (point === undefined) {
		const foldSegment = clipLineConvexPolygon(
			polygon,
			foldLine,
			exclude,
			includeL,
		);
		if (foldSegment === undefined) { return undefined; }
		point = midpoint(...foldSegment);
	}
	const perpVector = rotate90(foldLine.vector);
	const smallest = clipLineConvexPolygon(
		polygon,
		{ vector: perpVector, origin: point },
		exclude,
		includeL,
	)
		.map(pt => distance(point, pt))
		.sort((a, b) => a - b)
		.shift();
	const scaled = scale(normalize(perpVector), smallest);
	return [
		add(point, flip(scaled)),
		add(point, scaled),
	];
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
	const box = boundingBox(hull);
	const segment = widest_perpendicular(hull, line);
	if (segment === undefined) { return undefined; }
	const vector = subtract(segment[1], segment[0]);
	const length = magnitude(vector);
	const direction = dot(vector, [1, 0]);
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
