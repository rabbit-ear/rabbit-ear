/**
 * Rabbit Ear (c) Kraft
 */
import {
	exclude,
	excludeS,
	excludeR,
	includeL,
} from "../math/general/functions.js";
import {
	getVector,
	getLine,
	pointsToLine,
} from "../math/general/types.js";
import {
	dot,
	cross2,
	normalize,
	scale,
	distance,
	add,
	subtract,
	midpoint,
	rotate270,
	flip,
} from "../math/algebra/vectors.js";
import {
	makeMatrix2Reflect,
	multiplyMatrix2Vector2,
} from "../math/algebra/matrix2.js";
import {
	convexHull,
} from "../math/geometry/convexHull.js";
import {
	intersectLineLine,
	intersectConvexPolygonLine,
} from "../math/intersect/intersect.js";
import { clipLineConvexPolygon } from "../math/intersect/clip.js";
import axiom from "../axioms/index.js";

const line_line_for_arrows = (a, b) => intersectLineLine(
	a,
	b,
	includeL,
	includeL,
);

const diagram_reflect_point = (foldLine, point) => {
	const matrix = makeMatrix2Reflect(foldLine.vector, foldLine.origin);
	return multiplyMatrix2Vector2(matrix, point);
};

const boundary_for_arrows = ({ vertices_coords }) => convexHull(vertices_coords);

const widest_perp = (graph, foldLine, point) => {
	const boundary = boundary_for_arrows(graph);
	if (point === undefined) {
		const foldSegment = clipLineConvexPolygon(
			boundary,
			foldLine,
			exclude,
			includeL,
		);
		point = midpoint(...foldSegment);
	}
	const perpVector = rotate270(foldLine.vector);
	const smallest = clipLineConvexPolygon(
		boundary,
		{ vector: perpVector, origin: point },
		exclude,
		includeL,
	).map(pt => distance(point, pt))
		.sort((a, b) => a - b)
		.shift();
	const scaled = scale(normalize(perpVector), smallest);
	return [
		add(point, flip(scaled)),
		add(point, scaled),
	];
};
/**
 * like in axiom 3 when two segments don't intersect and the fold
 * line lies exactly between them
 */
const between_2_segments = (params, segments, foldLine) => {
	const midpoints = segments
		.map(seg => midpoint(seg[0], seg[1]));
	const midpointLine = pointsToLine(...midpoints);
	const origin = intersect(foldLine, midpointLine);
	const perpLine = { vector: foldLine.vector.rotate90(), origin };
	return segment(params.lines.map(line => intersect(line, perpLine)));
};

const between_2_intersecting_segments = (params, intersect, foldLine, boundary) => {
	const paramVectors = params.lines.map(l => l.vector);
	const flippedVectors = paramVectors.map(flip);
	const paramRays = paramVectors
		.concat(flippedVectors)
		.map(vec => ray(vec, intersect));
	// 4 points based on quadrants
	const a1 = paramRays.filter(ray => (
		dot(ray.vector, foldLine.vector) > 0
		&& cross2(ray.vector, foldLine.vector) > 0))
		.shift();
	const a2 = paramRays.filter(ray => (
		dot(ray.vector, foldLine.vector) > 0
		&& cross2(ray.vector, foldLine.vector) < 0))
		.shift();
	const b1 = paramRays.filter(ray => (
		dot(ray.vector, foldLine.vector) < 0
		&& cross2(ray.vector, foldLine.vector) > 0))
		.shift();
	const b2 = paramRays.filter(ray => (
		dot(ray.vector, foldLine.vector) < 0
		&& cross2(ray.vector, foldLine.vector) < 0))
		.shift();
	const rayEndpoints = [a1, a2, b1, b2]
		.map(ray => intersectConvexPolygonLine(
			boundary,
			ray,
			excludeS,
			excludeR,
		).shift()
			.shift());
	const rayLengths = rayEndpoints
		.map(pt => distance(pt, intersect));
	const arrowStart = (rayLengths[0] < rayLengths[1]
		? rayEndpoints[0]
		: rayEndpoints[1]);
	const arrowEnd = (rayLengths[0] < rayLengths[1]
		? add(a2.origin, a2.vector.normalize().scale(rayLengths[0]))
		: add(a1.origin, a1.vector.normalize().scale(rayLengths[1])));
	const arrowStart2 = (rayLengths[2] < rayLengths[3]
		? rayEndpoints[2]
		: rayEndpoints[3]);
	const arrowEnd2 = (rayLengths[2] < rayLengths[3]
		? add(b2.origin, b2.vector.normalize().scale(rayLengths[2]))
		: add(b1.origin, b1.vector.normalize().scale(rayLengths[3])));
	return [
		[arrowStart, arrowEnd],
		[arrowStart2, arrowEnd2],
	];
};

const axiom_1_arrows = (params, graph) => axiom(1, params)
	.map(foldLine => [widest_perp(graph, foldLine)]);

const axiom_2_arrows = params => [
	[...params.points],
];

const axiom_3_arrows = (params, graph) => {
	const boundary = boundary_for_arrows(graph);
	const segs = params.lines
		.map(line => clipLineConvexPolygon(boundary, line, exclude, includeL));
	const segVecs = segs.map(seg => subtract(seg[1], seg[0]));
	const intersect = intersectLineLine(
		{ vector: segVecs[0], origin: segs[0][0] },
		{ vector: segVecs[1], origin: segs[1][0] },
		excludeS,
		excludeS,
	);
	return !intersect
		? [between_2_segments(params, segs, axiom(3, params)
			.filter(a => a !== undefined).shift())]
		: axiom(3, params).map(foldLine => between_2_intersecting_segments(
			params,
			intersect,
			foldLine,
			boundary,
		));
};

const axiom_4_arrows = (params, graph) => axiom(4, params)
	.map(foldLine => [widest_perp(
		graph,
		foldLine,
		line_line_for_arrows(foldLine, params.lines[0]),
	)]);

const axiom_5_arrows = (params) => axiom(5, params)
	.map(foldLine => [
		params.points[1],
		diagram_reflect_point(foldLine, params.points[1]),
	]);

const axiom_6_arrows = (params) => axiom(6, params)
	.map(foldLine => params.points
		.map(pt => [pt, diagram_reflect_point(foldLine, pt)]));

const axiom_7_arrows = (params, graph) => axiom(7, params)
	.map(foldLine => [
		[params.points[0], diagram_reflect_point(foldLine, params.points[0])],
		widest_perp(graph, foldLine, line_line_for_arrows(foldLine, params.lines[1])),
	]);

const arrow_functions = [null,
	axiom_1_arrows,
	axiom_2_arrows,
	axiom_3_arrows,
	axiom_4_arrows,
	axiom_5_arrows,
	axiom_6_arrows,
	axiom_7_arrows,
];

delete arrow_functions[0];

const axiomArrows = (number, params = {}, ...args) => {
	const points = params.points
		? params.points.map(p => getVector(p))
		: undefined;
	const lines = params.lines
		? params.lines.map(l => getLine(l))
		: undefined;
	return arrow_functions[number]({ points, lines }, ...args);
};

Object.keys(arrow_functions).forEach(number => {
	axiomArrows[number] = (...args) => axiomArrows(number, ...args);
});

export default axiomArrows;
