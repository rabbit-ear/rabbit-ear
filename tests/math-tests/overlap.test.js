const ear = require("../../rabbit-ear");

test("point on line", () => {
  expect(ear.math.point_on_line([2, 2], [5, 5], [0, 0])).toBe(true);
  expect(ear.math.point_on_line([2, 2], [1, 1], [0, 0])).toBe(true);
  expect(ear.math.point_on_line([2.1, 2.1], [2, 2], [0, 0])).toBe(true);
  expect(ear.math.point_on_line([2.000000001, 2.000000001], [2, 2], [0, 0])).toBe(true);
  expect(ear.math.point_on_line([2, 2], [-1, -1], [0, 0])).toBe(true);

  expect(ear.math.point_on_ray_inclusive(
    [2, 2], [5, 5], [0, 0])).toBe(true);
  expect(ear.math.point_on_ray_inclusive(
    [2, 2], [1, 1], [0, 0])).toBe(true);
  expect(ear.math.point_on_ray_inclusive(
    [2.1, 2.1], [2, 2], [0, 0])).toBe(true);
  expect(ear.math.point_on_ray_inclusive(
    [2.000000001, 2.000000001], [2, 2], [0, 0])).toBe(true);
  expect(ear.math.point_on_ray_inclusive(
    [2, 2], [-1, -1], [0, 0])).toBe(false);
  expect(ear.math.point_on_ray_inclusive(
    [-0.1, -0.1], [1, 1], [0, 0])).toBe(false);
  expect(ear.math.point_on_ray_inclusive(
    [-0.000000001, -0.000000001], [1, 1], [0, 0])).toBe(true);
  expect(ear.math.point_on_ray_exclusive(
    [-0.000000001, -0.000000001], [1, 1], [0, 0])).toBe(false);

  expect(ear.math.point_on_segment_inclusive(
    [2, 2], [5, 5], [0, 0])).toBe(true);
  expect(ear.math.point_on_segment_inclusive(
    [2, 2], [1, 1], [0, 0])).toBe(false);
  expect(ear.math.point_on_segment_inclusive(
    [2.1, 2.1], [2, 2], [0, 0])).toBe(false);
  expect(ear.math.point_on_segment_inclusive(
    [2.000000001, 2.000000001], [2, 2], [0, 0])).toBe(true);
  expect(ear.math.point_on_segment_inclusive(
    [2, 2], [-1, -1], [0, 0])).toBe(false);
  expect(ear.math.point_on_segment_exclusive(
    [2.000000001, 2.000000001], [2, 2], [0, 0])).toBe(false);
});

test("overlap.point_on_segment_inclusive", () => {
  expect(ear.math.point_on_segment_inclusive(
    [4, 3], [3, 3], [6, 3])
  ).toBe(true);
  expect(ear.math.point_on_segment_inclusive(
    [3, 3], [3, 3], [6, 3])
  ).toBe(true);
  expect(ear.math.point_on_segment_inclusive(
    [2.9, 3], [3, 3], [6, 3])
  ).toBe(false);
  expect(ear.math.point_on_segment_inclusive(
    [2.9999999999, 3], [3, 3], [6, 3])
  ).toBe(true);
  expect(ear.math.point_on_segment_inclusive(
    [6.1, 3], [3, 3], [6, 3])
  ).toBe(false);
  expect(ear.math.point_on_segment_inclusive(
    [6.0000000001, 3], [3, 3], [6, 3])
  ).toBe(true);

  expect(ear.math.point_on_segment_inclusive(
    [3.5, 3.5], [2, 2], [4, 4])
  ).toBe(true);
  expect(ear.math.point_on_segment_inclusive(
    [2.9, 3.1], [2, 2], [4, 4])
  ).toBe(false);
  expect(ear.math.point_on_segment_inclusive(
    [2.99999999, 3.000000001], [2, 2], [4, 4])
  ).toBe(true);
  // degenerate edge still tests positive if the point is in common
  expect(ear.math.point_on_segment_inclusive(
    [2, 2], [2, 2], [2, 2])
  ).toBe(true);
  expect(ear.math.point_on_segment_inclusive(
    [2.1, 2.1], [2, 2], [2, 2])
  ).toBe(false);
  expect(ear.math.point_on_segment_inclusive(
    [2.000000001, 2.00000001], [2, 2], [2, 2])
  ).toBe(true);
});


test("point on line epsilon", () => {

});

test("point in poly", () => {
  const poly = [[1,0], [0,1], [-1,0], [0,-1]];
  expect(ear.math.point_in_poly([0.0, 0.0], poly)).toBe(true);
  expect(ear.math.point_in_poly([0.999, 0.0], poly)).toBe(true);
  expect(ear.math.point_in_poly([0.9999999999, 0.0], poly)).toBe(true);
  // edge collinear
  expect(ear.math.point_in_poly([0.5, 0.5], poly)).toBe(false);
  expect(ear.math.point_in_poly([0.49, 0.49], poly)).toBe(true);
  expect(ear.math.point_in_poly([0.51, 0.51], poly)).toBe(false);
  expect(ear.math.point_in_poly([0.500000001, 0.500000001], poly)).toBe(false);
  expect(ear.math.point_in_poly([0.5, -0.5], poly)).toBe(false);
  // expect(ear.math.point_in_poly([-0.5, 0.5], poly)).toBe(false);
  // expect(ear.math.point_in_poly([-0.5, -0.5], poly)).toBe(false);
  // polygon points
  expect(ear.math.point_in_poly([1.0, 0.0], poly)).toBe(false);
  expect(ear.math.point_in_poly([0.0, 1.0], poly)).toBe(false);
  // expect(ear.math.point_in_poly([-1.0, 0.0], poly)).toBe(false);
  expect(ear.math.point_in_poly([0.0, -1.0], poly)).toBe(false);
});

test("convex point in poly inclusive", () => {
  const poly = [[1,0], [0,1], [-1,0], [0,-1]];
  expect(ear.math.point_in_convex_poly_inclusive([0.0, 0.0], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([0.999, 0.0], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([0.9999999999, 0.0], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([1.1, 0.0], poly))
    .toBe(false);
  expect(ear.math.point_in_convex_poly_inclusive([1.000000001, 0.0], poly))
    .toBe(true);
  // edge collinear
  expect(ear.math.point_in_convex_poly_inclusive([0.5, 0.5], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([0.49, 0.49], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([0.499999999, 0.499999999], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([0.51, 0.51], poly))
    .toBe(false);
  expect(ear.math.point_in_convex_poly_inclusive([0.500000001, 0.500000001], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([0.5, -0.5], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([-0.5, 0.5], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([-0.5, -0.5], poly))
    .toBe(true);
  // polygon points
  expect(ear.math.point_in_convex_poly_inclusive([1.0, 0.0], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([0.0, 1.0], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([-1.0, 0.0], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_inclusive([0.0, -1.0], poly))
    .toBe(true);
});

test("convex point in poly exclusive", () => {
  const poly = [[1,0], [0,1], [-1,0], [0,-1]];
  expect(ear.math.point_in_convex_poly_exclusive([0.0, 0.0], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_exclusive([0.999, 0.0], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_exclusive([0.9999999999, 0.0], poly))
    .toBe(false);
  // edge collinear
  expect(ear.math.point_in_convex_poly_exclusive([0.5, 0.5], poly))
    .toBe(false);
  expect(ear.math.point_in_convex_poly_exclusive([0.49, 0.49], poly))
    .toBe(true);
  expect(ear.math.point_in_convex_poly_exclusive([0.499999999, 0.499999999], poly))
    .toBe(false);
  expect(ear.math.point_in_convex_poly_exclusive([0.51, 0.51], poly))
    .toBe(false);
  expect(ear.math.point_in_convex_poly_exclusive([0.5, -0.5], poly))
    .toBe(false);
  expect(ear.math.point_in_convex_poly_exclusive([-0.5, 0.5], poly))
    .toBe(false);
  expect(ear.math.point_in_convex_poly_exclusive([-0.5, -0.5], poly))
    .toBe(false);
  // polygon points
  expect(ear.math.point_in_convex_poly_exclusive([1.0, 0.0], poly))
    .toBe(false);
  expect(ear.math.point_in_convex_poly_exclusive([0.0, 1.0], poly))
    .toBe(false);
  expect(ear.math.point_in_convex_poly_exclusive([-1.0, 0.0], poly))
    .toBe(false);
  expect(ear.math.point_in_convex_poly_exclusive([0.0, -1.0], poly))
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

  expect(ear.math.overlap_line_line_inclusive(aV, aP, bV, bP)).toBe(true);
  expect(ear.math.overlap_line_ray_inclusive(aV, aP, bV, bP)).toBe(true);
  expect(ear.math.overlap_line_segment_inclusive(aV, aP, b0, b1)).toBe(false);
  expect(ear.math.overlap_ray_ray_inclusive(aV, aP, bV, bP)).toBe(true);
  expect(ear.math.overlap_ray_segment_inclusive(aV, aP, b0, b1)).toBe(false);
  expect(ear.math.overlap_segment_segment_inclusive(a0, a1, b0, b1)).toBe(false);
  expect(ear.math.overlap_line_line_exclusive(aV, aP, bV, bP)).toBe(true);
  expect(ear.math.overlap_line_ray_exclusive(aV, aP, bV, bP)).toBe(true);
  expect(ear.math.overlap_line_segment_exclusive(aV, aP, b0, b1)).toBe(false);
  expect(ear.math.overlap_ray_ray_exclusive(aV, aP, bV, bP)).toBe(true);
  expect(ear.math.overlap_ray_segment_exclusive(aV, aP, b0, b1)).toBe(false);
  expect(ear.math.overlap_segment_segment_exclusive(a0, a1, b0, b1)).toBe(false);
});

test("convex polygons overlap", () => {
  const poly1 = [[1,0], [0,1], [-1,0]];  // top
  const poly2 = [[0,1], [-1,0], [0,-1]]; // left
  const poly3 = [[1,0], [0,1], [0,-1]];  // right
  // inclusive
  expect(ear.math.overlap_convex_polygons_inclusive(poly1, poly2)).toBe(true);
  expect(ear.math.overlap_convex_polygons_inclusive(poly2, poly3)).toBe(true);
  expect(ear.math.overlap_convex_polygons_inclusive(poly1, poly3)).toBe(true);
  // exclusive
  expect(ear.math.overlap_convex_polygons_exclusive(poly1, poly2)).toBe(true);
  expect(ear.math.overlap_convex_polygons_exclusive(poly2, poly3)).toBe(false);
  expect(ear.math.overlap_convex_polygons_exclusive(poly1, poly3)).toBe(true);
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
})