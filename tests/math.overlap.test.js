const ear = require("../rabbit-ear");

test("point on line", () => {
  expect(ear.math.overlap_line_point([5, 5], [0, 0], [2, 2])).toBe(true);
  expect(ear.math.overlap_line_point([1, 1], [0, 0], [2, 2])).toBe(true);
  expect(ear.math.overlap_line_point([2, 2], [0, 0], [2.1, 2.1])).toBe(true);
  expect(ear.math.overlap_line_point([2, 2], [0, 0], [2.000000001, 2.000000001])).toBe(true);
  expect(ear.math.overlap_line_point([2, 2], [0, 0], [-1, -1])).toBe(true);

  expect(ear.math.overlap_line_point(
    [5, 5], [0, 0], [2, 2], ear.math.include_r)).toBe(true);
  expect(ear.math.overlap_line_point(
    [1, 1], [0, 0], [2, 2], ear.math.include_r)).toBe(true);
  expect(ear.math.overlap_line_point(
    [2, 2], [0, 0], [2.1, 2.1], ear.math.include_r)).toBe(true);
  expect(ear.math.overlap_line_point(
    [2, 2], [0, 0], [2.000000001, 2.000000001], ear.math.include_r)).toBe(true);
  expect(ear.math.overlap_line_point(
    [-1, -1], [0, 0], [2, 2], ear.math.include_r)).toBe(false);
  expect(ear.math.overlap_line_point(
    [1, 1], [0, 0], [-0.1, -0.1], ear.math.include_r)).toBe(false);
  expect(ear.math.overlap_line_point(
    [1, 1], [0, 0], [-0.000000001, -0.000000001], ear.math.include_r)).toBe(true);
  expect(ear.math.overlap_line_point(
    [1, 1], [0, 0], [-0.000000001, -0.000000001], ear.math.exclude_r)).toBe(false);

  expect(ear.math.overlap_line_point(
    [5, 5], [0, 0], [2, 2], ear.math.include_s)).toBe(true);
  expect(ear.math.overlap_line_point(
    [1, 1], [0, 0], [2, 2], ear.math.include_s)).toBe(false);
  expect(ear.math.overlap_line_point(
    [2, 2], [0, 0], [2.1, 2.1], ear.math.include_s)).toBe(false);
  expect(ear.math.overlap_line_point(
    [2, 2], [0, 0], [2.000000001, 2.000000001], ear.math.include_s)).toBe(true);
  expect(ear.math.overlap_line_point(
    [-1, -1], [0, 0], [2, 2], ear.math.include_s)).toBe(false);
  expect(ear.math.overlap_line_point(
    [2, 2], [0, 0], [2.000000001, 2.000000001], ear.math.exclude_s)).toBe(false);
});

test("overlap.point_on_segment_inclusive", () => {
  expect(ear.math.overlap_line_point(
    [3, 0], [3, 3], [4, 3], ear.math.include_s
  )).toBe(true);
  expect(ear.math.overlap_line_point(
    [3, 0], [3, 3], [3, 3], ear.math.include_s
  )).toBe(true);
  expect(ear.math.overlap_line_point(
    [3, 0], [3, 3], [2.9, 3], ear.math.include_s
  )).toBe(false);
  expect(ear.math.overlap_line_point(
    [3, 0], [3, 3], [2.9999999999, 3], ear.math.include_s
  )).toBe(true);
  expect(ear.math.overlap_line_point(
    [3, 0], [3, 3], [6.1, 3], ear.math.include_s
  )).toBe(false);
  expect(ear.math.overlap_line_point(
    [3, 0], [3, 3], [6.0000000001, 3], ear.math.include_s
  )).toBe(true);

  expect(ear.math.overlap_line_point(
    [2, 2], [2, 2], [3.5, 3.5], ear.math.include_s
  )).toBe(true);
  expect(ear.math.overlap_line_point(
    [2, 2], [2, 2], [2.9, 3.1], ear.math.include_s
  )).toBe(false);
  expect(ear.math.overlap_line_point(
    [2, 2], [2, 2], [2.99999999, 3.000000001], ear.math.include_s
  )).toBe(true);
  // degenerate edge returns false
  expect(ear.math.overlap_line_point(
    [0, 0], [2, 2], [2, 2], ear.math.include_s
  )).toBe(false);
  expect(ear.math.overlap_line_point(
    [0, 0], [2, 2], [2.1, 2.1], ear.math.include_s
  )).toBe(false);
  expect(ear.math.overlap_line_point(
    [0, 0], [2, 2], [2.000000001, 2.00000001], ear.math.include_s
  )).toBe(false);
});


test("point on line epsilon", () => {

});

test("point in poly", () => {
  const poly = [[1,0], [0,1], [-1,0], [0,-1]];
  expect(ear.math.overlap_convex_polygon_point(poly, [0.0, 0.0])).toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.999, 0.0])).toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.9999999999, 0.0])).toBe(false);
  // edge collinear
  expect(ear.math.overlap_convex_polygon_point(poly, [0.5, 0.5])).toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.49, 0.49])).toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.51, 0.51])).toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.500000001, 0.500000001])).toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.5, -0.5])).toBe(false);
  // expect(ear.math.overlap_convex_polygon_point(poly, [-0.5, 0.5])).toBe(false);
  // expect(ear.math.overlap_convex_polygon_point(poly, [-0.5, -0.5])).toBe(false);
  // polygon points
  expect(ear.math.overlap_convex_polygon_point(poly, [1.0, 0.0])).toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.0, 1.0])).toBe(false);
  // expect(ear.math.overlap_convex_polygon_point(poly, [-1.0, 0.0])).toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.0, -1.0])).toBe(false);
});

test("convex point in poly inclusive", () => {
  const poly = [[1,0], [0,1], [-1,0], [0,-1]];
  expect(ear.math.overlap_convex_polygon_point(poly, [0.0, 0.0], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.999, 0.0], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.9999999999, 0.0], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [1.1, 0.0], ear.math.include))
    .toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [1.000000001, 0.0], ear.math.include))
    .toBe(true);
  // edge collinear
  expect(ear.math.overlap_convex_polygon_point(poly, [0.5, 0.5], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.49, 0.49], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.499999999, 0.499999999], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.51, 0.51], ear.math.include))
    .toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.500000001, 0.500000001], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.5, -0.5], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [-0.5, 0.5], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [-0.5, -0.5], ear.math.include))
    .toBe(true);
  // polygon points
  expect(ear.math.overlap_convex_polygon_point(poly, [1.0, 0.0], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.0, 1.0], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [-1.0, 0.0], ear.math.include))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.0, -1.0], ear.math.include))
    .toBe(true);
});

test("convex point in poly exclusive", () => {
  const poly = [[1,0], [0,1], [-1,0], [0,-1]];
  expect(ear.math.overlap_convex_polygon_point(poly, [0.0, 0.0], ear.math.exclude))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.999, 0.0], ear.math.exclude))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.9999999999, 0.0], ear.math.exclude))
    .toBe(false);
  // edge collinear
  expect(ear.math.overlap_convex_polygon_point(poly, [0.5, 0.5], ear.math.exclude))
    .toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.49, 0.49], ear.math.exclude))
    .toBe(true);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.499999999, 0.499999999], ear.math.exclude))
    .toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.51, 0.51], ear.math.exclude))
    .toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.5, -0.5], ear.math.exclude))
    .toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [-0.5, 0.5], ear.math.exclude))
    .toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [-0.5, -0.5], ear.math.exclude))
    .toBe(false);
  // polygon points
  expect(ear.math.overlap_convex_polygon_point(poly, [1.0, 0.0], ear.math.exclude))
    .toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.0, 1.0], ear.math.exclude))
    .toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [-1.0, 0.0], ear.math.exclude))
    .toBe(false);
  expect(ear.math.overlap_convex_polygon_point(poly, [0.0, -1.0], ear.math.exclude))
    .toBe(false);
});

test("overlap lines", () => {
  const aV = [2, 3];
  const aP = [-1, 1];
  const bV = [-3, 2];
  const bP = [5, 0];

  const a0 = [-1, 1];
  const a1 = [1, 4];
  const b0 = [5, 0];
  const b1 = [2, 2];

  expect(ear.math.overlap_line_line(aV, aP, bV, bP, ear.math.include_l, ear.math.include_l)).toBe(true);
  expect(ear.math.overlap_line_line(aV, aP, bV, bP, ear.math.include_l, ear.math.include_r)).toBe(true);
  expect(ear.math.overlap_line_line(aV, aP, ear.math.subtract(b1, b0), b0, ear.math.include_l, ear.math.include_s)).toBe(false);
  expect(ear.math.overlap_line_line(aV, aP, bV, bP, ear.math.include_r, ear.math.include_r)).toBe(true);
  expect(ear.math.overlap_line_line(aV, aP, ear.math.subtract(b1, b0), b0, ear.math.include_r, ear.math.include_s)).toBe(false);
  expect(ear.math.overlap_line_line(ear.math.subtract(a1, a0), a0, ear.math.subtract(b1, b0), b0, ear.math.include_s, ear.math.include_s)).toBe(false);
  expect(ear.math.overlap_line_line(aV, aP, bV, bP, ear.math.exclude_l, ear.math.exclude_l)).toBe(true);
  expect(ear.math.overlap_line_line(aV, aP, bV, bP, ear.math.exclude_l, ear.math.exclude_r)).toBe(true);
  expect(ear.math.overlap_line_line(aV, aP, ear.math.subtract(b1, b0), b0, ear.math.exclude_l, ear.math.exclude_s)).toBe(false);
  expect(ear.math.overlap_line_line(aV, aP, bV, bP, ear.math.exclude_r, ear.math.exclude_r)).toBe(true);
  expect(ear.math.overlap_line_line(aV, aP, ear.math.subtract(b1, b0), b0, ear.math.exclude_r, ear.math.exclude_s)).toBe(false);
  expect(ear.math.overlap_line_line(ear.math.subtract(a1, a0), a0, ear.math.subtract(b1, b0), b0, ear.math.exclude_s, ear.math.exclude_s)).toBe(false);
});

test("convex polygons overlap with point inside each other", () => {
	const poly1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
	const polyA = [[0.5, 0.5], [10, 10], [10, 0]];
	const polyB = [[-10, -10], [10, -10], [10, 10], [-10, 10]];
	expect(ear.math.overlap_convex_polygons(poly1, polyA, ear.math.include_s, ear.math.include)).toBe(true);
	expect(ear.math.overlap_convex_polygons(poly1, polyB, ear.math.include_s, ear.math.include)).toBe(true);
	expect(ear.math.overlap_convex_polygons(polyA, poly1, ear.math.include_s, ear.math.include)).toBe(true);
	expect(ear.math.overlap_convex_polygons(polyB, poly1, ear.math.include_s, ear.math.include)).toBe(true);
});

test("convex polygons overlap", () => {
  const poly1 = [[1,0], [0,1], [-1,0]];  // top
  const poly2 = [[0,1], [-1,0], [0,-1]]; // left
  const poly3 = [[1,0], [0,1], [0,-1]];  // right
  // inclusive
  expect(ear.math.overlap_convex_polygons(poly1, poly2, ear.math.include_s, ear.math.include)).toBe(true);
  expect(ear.math.overlap_convex_polygons(poly2, poly3, ear.math.include_s, ear.math.include)).toBe(true);
  expect(ear.math.overlap_convex_polygons(poly1, poly3, ear.math.include_s, ear.math.include)).toBe(true);
  // exclusive
  expect(ear.math.overlap_convex_polygons(poly1, poly2, ear.math.exclude_s, ear.math.exclude)).toBe(true);
  expect(ear.math.overlap_convex_polygons(poly2, poly3, ear.math.exclude_s, ear.math.exclude)).toBe(false);
  expect(ear.math.overlap_convex_polygons(poly1, poly3, ear.math.exclude_s, ear.math.exclude)).toBe(true);
});

test("enclose_convex_polygons_inclusive", () => {
  const poly1 = [[1,0], [0,1], [-1,0], [0,-1]];
  const poly2 = [[10,0], [0,10], [-10,0], [0,-10]];
  const poly3 = [[8,8], [-8,8], [-8,-8], [8,-8]];
  expect(ear.math.enclose_convex_polygons_inclusive(poly2, poly1)).toBe(true);
  expect(ear.math.enclose_convex_polygons_inclusive(poly3, poly1)).toBe(true);
  // todo, this should be false i think
  // expect(ear.math.enclose_convex_polygons_inclusive(poly2, poly3)).toBe(false);
  expect(ear.math.enclose_convex_polygons_inclusive(poly1, poly2)).toBe(false);
  expect(ear.math.enclose_convex_polygons_inclusive(poly1, poly3)).toBe(false);
});

