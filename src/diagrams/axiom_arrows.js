import math from "../math";
import axiom from "../axioms/index";

const line_line_for_arrows = (a, b) => math.core.intersect_line_line(
	a.vector, a.origin, b.vector, b.origin, math.core.include_l, math.core.include_l
);

const reflect_point = (foldLine, point) => {
	const matrix = math.core.make_matrix2_reflect(foldLine.vector, foldLine.origin);
  return math.core.multiply_matrix2_vector2(matrix, point);
};

const boundary_for_arrows = ({ vertices_coords }) => math.core
	.convex_hull(vertices_coords);

const widest_perp = (graph, foldLine, point) => {
	const boundary = boundary_for_arrows(graph);
	if (point === undefined) {
		const foldSegment = math.core.clip_line_in_convex_polygon(boundary,
      foldLine.vector,
      foldLine.origin,
      math.core.exclude,
      math.core.include_l);
		point = math.core.midpoint(...foldSegment);
	}
  const perpVector = math.core.rotate270(foldLine.vector);
	const smallest = math.core
		.clip_line_in_convex_polygon(boundary,
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
 * like in axiom 3 when two segments don't intersect and the fold
 * line lies exactly between them
 */
const between_2_segments = (params, segments, foldLine) => {
	const midpoints = segments
		.map(seg => math.core.midpoint(seg[0], seg[1]));
	const midpointLine = math.line.fromPoints(...midpoints);
	const origin = math.intersect(foldLine, midpointLine);
	const perpLine = math.line(foldLine.vector.rotate90(), origin);
	return math.segment(params.lines.map(line => math.intersect(line, perpLine)));
};

const between_2_intersecting_segments = (params, intersect, foldLine, boundary) => {
  const paramVectors = params.lines.map(l => l.vector);
  const flippedVectors = paramVectors.map(math.core.flip);
  const paramRays = paramVectors
    .concat(flippedVectors)
    .map(vec => math.ray(vec, intersect));
  // 4 points based on quadrants
  const a1 = paramRays.filter(ray =>
    math.core.dot(ray.vector, foldLine.vector) > 0 &&
    math.core.cross2(ray.vector, foldLine.vector) > 0
  ).shift();
  const a2 = paramRays.filter(ray =>
    math.core.dot(ray.vector, foldLine.vector) > 0 &&
    math.core.cross2(ray.vector, foldLine.vector) < 0
  ).shift();
  const b1 = paramRays.filter(ray =>
    math.core.dot(ray.vector, foldLine.vector) < 0 &&
    math.core.cross2(ray.vector, foldLine.vector) > 0
  ).shift();
  const b2 = paramRays.filter(ray =>
    math.core.dot(ray.vector, foldLine.vector) < 0 &&
    math.core.cross2(ray.vector, foldLine.vector) < 0
  ).shift();
  const rayEndpoints = [a1, a2, b1, b2].map(ray => math.core
		.intersect_convex_polygon_line(boundary, ray.vector, ray.origin, math.core.exclude_s, math.core.exclude_r)
		.shift()
		.shift());
  const rayLengths = rayEndpoints
    .map(pt => math.core.distance(pt, intersect));
	const arrowStart = (rayLengths[0] < rayLengths[1]
		? rayEndpoints[0]
		: rayEndpoints[1]);
	const arrowEnd = (rayLengths[0] < rayLengths[1]
		? math.core.add(a2.origin, a2.vector.normalize().scale(rayLengths[0]))
		: math.core.add(a1.origin, a1.vector.normalize().scale(rayLengths[1])));
	const arrowStart2 = (rayLengths[2] < rayLengths[3]
		? rayEndpoints[2]
		: rayEndpoints[3]);
	const arrowEnd2 = (rayLengths[2] < rayLengths[3]
		? math.core.add(b2.origin, b2.vector.normalize().scale(rayLengths[2]))
		: math.core.add(b1.origin, b1.vector.normalize().scale(rayLengths[3])));
	return [
		math.segment(arrowStart, arrowEnd),
		math.segment(arrowStart2, arrowEnd2)
	];
};

const axiom_1_arrows = (params, graph) => axiom(1, params)
	.map(foldLine => [widest_perp(graph, foldLine)]);

const axiom_2_arrows = params => [
	[math.segment(params.points)]
];

const axiom_3_arrows = (params, graph) => {
	const boundary = boundary_for_arrows(graph);
	const segs = params.lines.map(l => math.core
		.clip_line_in_convex_polygon(boundary,
      l.vector,
      l.origin,
      math.core.exclude,
      math.core.include_l));
  const segVecs = segs.map(seg => math.core.subtract(seg[1], seg[0]));
  const intersect = math.core.intersect_line_line(
		segVecs[0], segs[0][0], segVecs[1], segs[1][0],
    math.core.exclude_s, math.core.exclude_s);
  return !intersect
		? [between_2_segments(params, segs, axiom(3, params)
			.filter(a => a !== undefined).shift())]
		: axiom(3, params).map(foldLine => between_2_intersecting_segments(
				params, intersect, foldLine, boundary
			));
};

const axiom_4_arrows = (params, graph) => axiom(4, params)
	.map(foldLine => [widest_perp(
		graph,
		foldLine,
		line_line_for_arrows(foldLine, params.lines[0])
	)]);

const axiom_5_arrows = (params) => axiom(5, params)
	.map(foldLine => [math.segment(
		params.points[1],
		reflect_point(foldLine, params.points[1])
	)]);

const axiom_6_arrows = (params) => axiom(6, params)
	.map(foldLine => params.points
		.map(pt => math.segment(pt, reflect_point(foldLine, pt))));

const axiom_7_arrows = (params, graph) => axiom(7, params)
	.map(foldLine => [
		math.segment(params.points[0], reflect_point(foldLine, params.points[0])),
		widest_perp(graph, foldLine, line_line_for_arrows(foldLine, params.lines[1]))
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

const axiom_arrows = (number, params = {}, ...args) => {
	const points = params.points
		? params.points.map(p => math.core.get_vector(p))
		: undefined;
	const lines = params.lines
    ? params.lines.map(l => math.core.get_line(l))
		: undefined;
	return arrow_functions[number]({ points, lines }, ...args);
};

Object.keys(arrow_functions).forEach(number => {
  axiom_arrows[number] = (...args) => axiom_arrows(number, ...args);
});

export default axiom_arrows;

