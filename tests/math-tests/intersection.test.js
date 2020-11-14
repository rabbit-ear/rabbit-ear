const ear = require("../../rabbit-ear");

test("intersections", () => {
  const polygon = ear.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
  const circle = ear.circle(1);
  const line = ear.line([1, 2], [0.5, 0]);
  const ray = ear.ray([-1, 2], [0.5, -0.1]);
  const segment = ear.segment([-2, 0.5], [2, 0.5]);

  const polygon2 = ear.polygon([0, -1.15], [1, 0.577], [-1, 0.577]);
  const circle2 = ear.circle(1, [0.5, 0]);
  const line2 = ear.line([-1, 2], [0.5, 0]);
  const ray2 = ear.ray([1, 2], [-0.5, 0]);
  const segment2 = ear.segment([0.5, -2], [0.5, 2]);

  [
    // polygon.intersect(polygon2),
    // polygon.intersect(circle),
    polygon.intersect(line),
    polygon.intersect(ray),
    polygon.intersect(segment),
    // circle.intersect(polygon),
    circle.intersect(circle2),
    circle.intersect(line),
    circle.intersect(ray),
    circle.intersect(segment),
    line.intersect(polygon),
    line.intersect(circle),
    line.intersect(line2),
    line.intersect(ray),
    line.intersect(segment),
    ray.intersect(polygon),
    ray.intersect(circle),
    ray.intersect(line),
    ray.intersect(ray2),
    ray.intersect(segment),
    segment.intersect(polygon),
    segment.intersect(circle),
    segment.intersect(line),
    segment.intersect(ray),
    segment.intersect(segment2),
  ].forEach(intersect => expect(intersect).not.toBe(undefined));
});

test("core polygon intersection lines", () => {
  const poly = [[0,0], [1,0], [0.5, 0.866]];
  const vector = [1, 1];
  const point = [0.5, 0.866 / 2];
  const segmentA = [...point];
  const segmentB = [point[0] + 4, point[1] + 4];

  expect(ear.math.convex_poly_line_exclusive(poly, vector, point).length)
    .toBe(2);
  expect(ear.math.convex_poly_ray_inclusive(poly, vector, point).length)
    .toBe(1);
  expect(ear.math.convex_poly_ray_exclusive(poly, vector, point).length)
    .toBe(1);
  expect(ear.math.convex_poly_segment_inclusive(poly, segmentA, segmentB).length)
    .toBe(1);
  expect(ear.math.convex_poly_segment_exclusive(poly, segmentA, segmentB).length)
    .toBe(1);
});

test("core polygon intersection lines, collinear to edge", () => {
  const poly = [[0,0], [1,0], [0.5, 0.866]];
  const vector = [1, 0];
  const point = [-5, 0];
  const segmentA = [0, 0];
  const segmentB = [1, 0];

  expect(ear.math.convex_poly_line_inclusive(poly, vector, point).length)
    .toBe(2);
  expect(ear.math.convex_poly_line_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(ear.math.convex_poly_ray_inclusive(poly, vector, point).length)
    .toBe(2);
  expect(ear.math.convex_poly_ray_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(ear.math.convex_poly_segment_inclusive(poly, segmentA, segmentB).length)
    .toBe(2);
  expect(ear.math.convex_poly_segment_exclusive(poly, segmentA, segmentB))
    .toBe(undefined);
});

test("core polygon intersection lines, collinear to vertex", () => {
  const poly = [[0,0], [1,0], [0.5, 0.866]];
  const vector = [1, 0];
  const point = [-5, 0.866];
  const segmentA = [0, 0.866];
  const segmentB = [1, 0.866];

  expect(ear.math.convex_poly_line_inclusive(poly, vector, point).length)
    .toBe(1);
  expect(ear.math.convex_poly_line_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(ear.math.convex_poly_ray_inclusive(poly, vector, point).length)
    .toBe(1);
  expect(ear.math.convex_poly_ray_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(ear.math.convex_poly_segment_inclusive(poly, segmentA, segmentB).length)
    .toBe(1);
  expect(ear.math.convex_poly_segment_exclusive(poly, segmentA, segmentB))
    .toBe(undefined);
});

test("core polygon intersection lines, collinear to polygon vertices", () => {
  const lineSeg = ear.polygon.regularPolygon(4).intersectLine(ear.line([1, 0]));
  expect(Math.abs(lineSeg[0][0])).toBeCloseTo(Math.sqrt(2)/2);
  expect(lineSeg[0][1]).toBeCloseTo(0);
  expect(Math.abs(lineSeg[1][0])).toBeCloseTo(Math.sqrt(2)/2);
  expect(lineSeg[1][1]).toBeCloseTo(0);

  const raySeg1 = ear.polygon.regularPolygon(4).intersectRay(ear.ray([1, 0]));
  expect(raySeg1.length).toBe(1);
  expect(Math.abs(raySeg1[0][0])).toBeCloseTo(Math.sqrt(2)/2);
  expect(raySeg1[0][1]).toBeCloseTo(0);
  const raySeg2 = ear.polygon.regularPolygon(4).intersectRay(ear.ray([1, 0], [-10, 0]));
  expect(raySeg2.length).toBe(2);
  expect(Math.abs(raySeg2[0][0])).toBeCloseTo(Math.sqrt(2)/2);
  expect(raySeg2[0][1]).toBeCloseTo(0);
  expect(Math.abs(raySeg2[1][0])).toBeCloseTo(Math.sqrt(2)/2);
  expect(raySeg2[1][1]).toBeCloseTo(0);
  const raySeg3 = ear.polygon.regularPolygon(4).intersectRay(ear.ray([1, 0], [10, 0]));
  expect(raySeg3).toBe(undefined);
});

test("core polygon intersection lines, no intersections", () => {
  const poly = [[0,0], [1,0], [0.5, 0.866]];
  const vector = [1, 0];
  const point = [-5, 10];
  const segmentA = [0, 10];
  const segmentB = [1, 10];

  expect(ear.math.convex_poly_line_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(ear.math.convex_poly_ray_inclusive(poly, vector, point))
    .toBe(undefined);
  expect(ear.math.convex_poly_ray_exclusive(poly, vector, point))
    .toBe(undefined);
  expect(ear.math.convex_poly_segment_inclusive(poly, segmentA, segmentB))
    .toBe(undefined);
  expect(ear.math.convex_poly_segment_exclusive(poly, segmentA, segmentB))
    .toBe(undefined);
});

// test("core polygon intersection circle", () => {
//   convex_poly_circle(poly, center, radius)  
// });

test("collinear line intersections", () => {
  const intersect = ear.math.intersect_lines;
  [
    // INCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.include_l, ear.math.include_l),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      ear.math.include_l, ear.math.include_l),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.include_l, ear.math.include_l),
    // INCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      ear.math.include_l, ear.math.include_l),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      ear.math.include_l, ear.math.include_l),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      ear.math.include_l, ear.math.include_l),
    // INCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      ear.math.include_l, ear.math.include_l),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      ear.math.include_l, ear.math.include_l),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      ear.math.include_l, ear.math.include_l),
    // EXCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.exclude_l, ear.math.exclude_l),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      ear.math.exclude_l, ear.math.exclude_l),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.exclude_l, ear.math.exclude_l),
    // EXCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      ear.math.exclude_l, ear.math.exclude_l),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      ear.math.exclude_l, ear.math.exclude_l),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      ear.math.exclude_l, ear.math.exclude_l),
    // EXCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      ear.math.exclude_l, ear.math.exclude_l),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      ear.math.exclude_l, ear.math.exclude_l),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      ear.math.exclude_l, ear.math.exclude_l),
  ].forEach(res => expect(res).toBe(undefined));
});

test("collinear ray intersections", () => {
  const intersect = ear.math.intersect_lines;
  [
    // INCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.include_r, ear.math.include_r),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      ear.math.include_r, ear.math.include_r),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.include_r, ear.math.include_r),
    // INCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      ear.math.include_r, ear.math.include_r),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      ear.math.include_r, ear.math.include_r),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      ear.math.include_r, ear.math.include_r),
    // INCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      ear.math.include_r, ear.math.include_r),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      ear.math.include_r, ear.math.include_r),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      ear.math.include_r, ear.math.include_r),
    // EXCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.exclude_r, ear.math.exclude_r),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      ear.math.exclude_r, ear.math.exclude_r),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.exclude_r, ear.math.exclude_r),
    // EXCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      ear.math.exclude_r, ear.math.exclude_r),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      ear.math.exclude_r, ear.math.exclude_r),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      ear.math.exclude_r, ear.math.exclude_r),
    // EXCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      ear.math.exclude_r, ear.math.exclude_r),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      ear.math.exclude_r, ear.math.exclude_r),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      ear.math.exclude_r, ear.math.exclude_r),
  ].forEach(res => expect(res).toBe(undefined));
});

test("collinear segment intersections", () => {
  const intersect = ear.math.intersect_lines;
  [
    // INCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.include_s, ear.math.include_s),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      ear.math.include_s, ear.math.include_s),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.include_s, ear.math.include_s),
    // INCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      ear.math.include_s, ear.math.include_s),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      ear.math.include_s, ear.math.include_s),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      ear.math.include_s, ear.math.include_s),
    // INCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      ear.math.include_s, ear.math.include_s),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      ear.math.include_s, ear.math.include_s),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      ear.math.include_s, ear.math.include_s),
    // EXCLUDE horizontal
    intersect([1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.exclude_s, ear.math.exclude_s),
    intersect([1, 0], [2, 2], [-1, 0], [-1, 2],
      ear.math.exclude_s, ear.math.exclude_s),
    intersect([-1, 0], [2, 2], [1, 0], [-1, 2],
      ear.math.exclude_s, ear.math.exclude_s),
    // EXCLUDE vertical
    intersect([0, 1], [3, 0], [0, 1], [3, 3],
      ear.math.exclude_s, ear.math.exclude_s),
    intersect([0, 1], [3, 0], [0, -1], [3, 3],
      ear.math.exclude_s, ear.math.exclude_s),
    intersect([0, -1], [3, 0], [0, 1], [3, 3],
      ear.math.exclude_s, ear.math.exclude_s),
    // EXCLUDE diagonal
    intersect([1, 1], [2, 2], [1, 1], [-1, -1],
      ear.math.exclude_s, ear.math.exclude_s),
    intersect([-1, -1], [2, 2], [1, 1], [-1, -1],
      ear.math.exclude_s, ear.math.exclude_s),
    intersect([1, 1], [2, 2], [-1, -1], [-1, -1],
      ear.math.exclude_s, ear.math.exclude_s),
  ].forEach(res => expect(res).toBe(undefined));
});

test("collinear segment intersections, types not core", () => {
  [ // horizontal
    ear.segment([0, 2], [2, 2]).intersect(ear.segment([-1, 2], [10, 2])),
    ear.segment([0, 2], [2, 2]).intersect(ear.segment([10, 2], [-1, 2])),
    // vertical
    ear.segment([2, 0], [2, 2]).intersect(ear.segment([2, -1], [2, 10])),
    ear.segment([2, 0], [2, 2]).intersect(ear.segment([2, 10], [2, -1])),
    // diagonal
    ear.segment([0, 0], [2, 2]).intersect(ear.segment([-1, -1], [5, 5])),
    ear.segment([0, 0], [2, 2]).intersect(ear.segment([5, 5], [-1, -1])),
  ].forEach(res => expect(res).toBe(undefined));
});
