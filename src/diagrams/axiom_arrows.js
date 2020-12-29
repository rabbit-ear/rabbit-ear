import math from "../math";

const line_line_for_arrows = (a, b) => math.core.intersect_lines(
	a.vector, a.origin, b.vector, b.origin, math.core.include_l, math.core.include_l
);

const reflect_point = (foldLine, point) => {
  const intersect = math.core.intersect_lines(
		foldLine.vector,
		foldLine.origin,
		math.core.rotate270(foldLine.vector),
		point,
		math.core.include_l,
		math.core.include_l
	);
  const vec = math.core.subtract(intersect, point);
  return math.core.add(intersect, vec);
};

const boundary_for_arrows = ({ vertices_coords }) => math.core
	.convex_hull(vertices_coords);

const widest_perp = (graph, foldLine, point) => {
	const boundary = boundary_for_arrows(graph);
	if (point === undefined) {
		const foldSegment = math.core
			.clip_line_in_convex_poly_exclusive(boundary, foldLine.vector, foldLine.origin);
		point = math.core.midpoint(...foldSegment);
	}
  const perpVector = math.core.rotate270(foldLine.vector);
	const smallest = math.core
		.clip_line_in_convex_poly_exclusive(boundary, perpVector, point)
  	.map(pt => math.core.distance(point, pt))
    .sort((a, b) => a - b)
    .shift();
	const scaled = math.core.scale(math.core.normalize(perpVector), smallest);
	return [
		math.core.add(point, math.core.flip(scaled)),
		math.core.add(point, scaled)
	];
};

const axiom_1_arrows = (params, foldLine, graph) => [
	widest_perp(graph, foldLine)
];

// todo, this is flipped. everything is flipped...
const axiom_2_arrows = params => [params.points];
  // const arrowEnd = params.points[0];
  // const arrowStart = params.points[1];

const axiom_3_arrows = (params, foldLine, graph) => {
  var arrowStart, arrowEnd, arrowStart2, arrowEnd2;
	const boundary = boundary_for_arrows(graph);
	const paramSeg = params.lines.map(l => math.core
		.clip_line_in_convex_poly_exclusive(boundary, l.vector, l.origin));
  const paramIntersect = math.core.intersect_seg_seg_exclude(
		paramSeg[0][0], paramSeg[0][1], paramSeg[1][0], paramSeg[1][1]);
  if (!paramIntersect) {
    const midpoints = paramSeg
      .map(seg => math.core.midpoint(seg[0], seg[1]));
    const midpointLine = math.line.fromPoints(...midpoints);
    const origin = math.intersect(foldLine, midpointLine);
    const perpLine = math.line(foldLine.vector.rotate90(), origin);
    const arrowPoints = params.lines
      .map(line => math.intersect(line, perpLine));
    arrowStart = arrowPoints[0];
    arrowEnd = arrowPoints[1];
  } else {
    const paramVectors = params.lines.map(l => l.vector);
    const flippedVectors = paramVectors.map(math.core.flip);
    const paramRays = paramVectors
      .concat(flippedVectors)
      .map(vec => math.ray(vec, paramIntersect));
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
			.convex_poly_ray_exclusive(boundary, ray.vector, ray.origin)
			.shift().shift());
    const rayLengths = rayEndpoints
      .map(pt => math.core.distance(pt, paramIntersect));
    if (rayLengths[0] < rayLengths[1]) {
      arrowStart = rayEndpoints[0];
      arrowEnd = math.core.add(a2.origin, a2.vector.normalize().scale(rayLengths[0]));
    } else {
      arrowStart = rayEndpoints[1];
      arrowEnd = math.core.add(a1.origin, a1.vector.normalize().scale(rayLengths[1]));
    }
    if (rayLengths[2] < rayLengths[3]) {
      arrowStart2 = rayEndpoints[2];
      arrowEnd2 = math.core.add(b2.origin, b2.vector.normalize().scale(rayLengths[2]));
    } else {
      arrowStart2 = rayEndpoints[3];
      arrowEnd2 = math.core.add(b1.origin, b1.vector.normalize().scale(rayLengths[3]));
    }
	}
	return arrowStart2 === undefined
		? [[arrowStart, arrowEnd]]
		: [[arrowStart, arrowEnd], [arrowStart2, arrowEnd2]];
};

const axiom_4_arrows = (params, foldLine, graph) => [
	widest_perp(graph, foldLine, line_line_for_arrows(foldLine, params.lines[0]))
];

const axiom_5_arrows = (params, foldLine) => [
	[params.points[1], reflect_point(foldLine, params.points[1])],
];

const axiom_6_arrows = (params, foldLine) => params.points
	.map(pt => [pt, reflect_point(foldLine, pt)]);

const axiom_7_arrows = (params, foldLine, graph) => [
	[params.points[0], reflect_point(foldLine, params.points[0])],
	widest_perp(graph, foldLine, line_line_for_arrows(foldLine, params.lines[1]))
];

const axiom_arrows = [null,
	axiom_1_arrows,
	axiom_2_arrows,
	axiom_3_arrows,
	axiom_4_arrows,
	axiom_5_arrows,
	axiom_6_arrows,
	axiom_7_arrows,
];

delete axiom_arrows[0];

export default axiom_arrows;

