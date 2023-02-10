/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";
import axiom from "../axioms/index.js";

const line_line_for_arrows = (a, b) => math.intersectLineLine(
	a.vector,
	a.origin,
	b.vector,
	b.origin,
	math.includeL,
	math.includeL,
);

const diagram_reflect_point = (foldLine, point) => {
	const matrix = math.makeMatrix2Reflect(foldLine.vector, foldLine.origin);
	return math.multiplyMatrix2Vector2(matrix, point);
};

const boundary_for_arrows = ({ vertices_coords }) => math
	.convexHull(vertices_coords);

const widest_perp = (graph, foldLine, point) => {
	const boundary = boundary_for_arrows(graph);
	if (point === undefined) {
		const foldSegment = math.clipLineConvexPolygon(
			boundary,
			foldLine.vector,
			foldLine.origin,
			math.exclude,
			math.includeL,
		);
		point = math.midpoint(...foldSegment);
	}
	const perpVector = math.rotate270(foldLine.vector);
	const smallest = math
		.clipLineConvexPolygon(
			boundary,
			perpVector,
			point,
			math.exclude,
			math.includeL,
		).map(pt => math.distance(point, pt))
		.sort((a, b) => a - b)
		.shift();
	const scaled = math.scale(math.normalize(perpVector), smallest);
	return math.segment(
		math.add(point, math.flip(scaled)),
		math.add(point, scaled),
	);
};
/**
 * like in axiom 3 when two segments don't intersect and the fold
 * line lies exactly between them
 */
const between_2_segments = (params, segments, foldLine) => {
	const midpoints = segments
		.map(seg => math.midpoint(seg[0], seg[1]));
	const midpointLine = math.line.fromPoints(...midpoints);
	const origin = math.intersect(foldLine, midpointLine);
	const perpLine = math.line(foldLine.vector.rotate90(), origin);
	return math.segment(params.lines.map(line => math.intersect(line, perpLine)));
};

const between_2_intersecting_segments = (params, intersect, foldLine, boundary) => {
	const paramVectors = params.lines.map(l => l.vector);
	const flippedVectors = paramVectors.map(math.flip);
	const paramRays = paramVectors
		.concat(flippedVectors)
		.map(vec => math.ray(vec, intersect));
	// 4 points based on quadrants
	const a1 = paramRays.filter(ray => (
		math.dot(ray.vector, foldLine.vector) > 0
		&& math.cross2(ray.vector, foldLine.vector) > 0))
		.shift();
	const a2 = paramRays.filter(ray => (
		math.dot(ray.vector, foldLine.vector) > 0
		&& math.cross2(ray.vector, foldLine.vector) < 0))
		.shift();
	const b1 = paramRays.filter(ray => (
		math.dot(ray.vector, foldLine.vector) < 0
		&& math.cross2(ray.vector, foldLine.vector) > 0))
		.shift();
	const b2 = paramRays.filter(ray => (
		math.dot(ray.vector, foldLine.vector) < 0
		&& math.cross2(ray.vector, foldLine.vector) < 0))
		.shift();
	const rayEndpoints = [a1, a2, b1, b2]
		.map(ray => math.intersectConvexPolygonLine(
			boundary,
			ray.vector,
			ray.origin,
			math.excludeS,
			math.excludeR,
		).shift()
			.shift());
	const rayLengths = rayEndpoints
		.map(pt => math.distance(pt, intersect));
	const arrowStart = (rayLengths[0] < rayLengths[1]
		? rayEndpoints[0]
		: rayEndpoints[1]);
	const arrowEnd = (rayLengths[0] < rayLengths[1]
		? math.add(a2.origin, a2.vector.normalize().scale(rayLengths[0]))
		: math.add(a1.origin, a1.vector.normalize().scale(rayLengths[1])));
	const arrowStart2 = (rayLengths[2] < rayLengths[3]
		? rayEndpoints[2]
		: rayEndpoints[3]);
	const arrowEnd2 = (rayLengths[2] < rayLengths[3]
		? math.add(b2.origin, b2.vector.normalize().scale(rayLengths[2]))
		: math.add(b1.origin, b1.vector.normalize().scale(rayLengths[3])));
	return [
		math.segment(arrowStart, arrowEnd),
		math.segment(arrowStart2, arrowEnd2),
	];
};

const axiom_1_arrows = (params, graph) => axiom(1, params)
	.map(foldLine => [widest_perp(graph, foldLine)]);

const axiom_2_arrows = params => [
	[math.segment(params.points)],
];

const axiom_3_arrows = (params, graph) => {
	const boundary = boundary_for_arrows(graph);
	const segs = params.lines.map(l => math
		.clipLineConvexPolygon(
			boundary,
			l.vector,
			l.origin,
			math.exclude,
			math.includeL,
		));
	const segVecs = segs.map(seg => math.subtract(seg[1], seg[0]));
	const intersect = math.intersectLineLine(
		segVecs[0],
		segs[0][0],
		segVecs[1],
		segs[1][0],
		math.excludeS,
		math.excludeS,
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
	.map(foldLine => [math.segment(
		params.points[1],
		diagram_reflect_point(foldLine, params.points[1]),
	)]);

const axiom_6_arrows = (params) => axiom(6, params)
	.map(foldLine => params.points
		.map(pt => math.segment(pt, diagram_reflect_point(foldLine, pt))));

const axiom_7_arrows = (params, graph) => axiom(7, params)
	.map(foldLine => [
		math.segment(params.points[0], diagram_reflect_point(foldLine, params.points[0])),
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
		? params.points.map(p => math.getVector(p))
		: undefined;
	const lines = params.lines
		? params.lines.map(l => math.getLine(l))
		: undefined;
	return arrow_functions[number]({ points, lines }, ...args);
};

Object.keys(arrow_functions).forEach(number => {
	axiomArrows[number] = (...args) => axiomArrows(number, ...args);
});

export default axiomArrows;
