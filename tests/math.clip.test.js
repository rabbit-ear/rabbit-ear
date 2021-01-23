const ear = require("../rabbit-ear");

const exclude = ear.math.exclude;
const include = ear.math.include;
const include_l = ear.math.include_l;
const exclude_l = ear.math.exclude_l;
const include_r = ear.math.include_r;
const exclude_r = ear.math.exclude_r;
const include_s = ear.math.include_s;
const exclude_s = ear.math.exclude_s;

const clip_line_in_convex_poly_inclusive = function () {
  return ear.math.clip_line_in_convex_polygon(...arguments,
    ear.math.include, ear.math.include_l);
};
const clip_line_in_convex_poly_exclusive = function () {
  return ear.math.clip_line_in_convex_polygon(...arguments,
    ear.math.exclude, ear.math.exclude_l);
};
const clip_ray_in_convex_poly_inclusive = function () {
  return ear.math.clip_line_in_convex_polygon(...arguments,
    ear.math.include, ear.math.include_r);
};
const clip_ray_in_convex_poly_exclusive = function () {
  return ear.math.clip_line_in_convex_polygon(...arguments,
    ear.math.exclude, ear.math.exclude_r);
};
const clip_segment_in_convex_poly_inclusive = function (poly, s0, s1) {
  const vector = [s1[0] - s0[0], s1[1] - s0[1]];
  return ear.math.clip_line_in_convex_polygon(poly, vector, s0,
    ear.math.include, ear.math.include_s);
};
const clip_segment_in_convex_poly_exclusive = function (poly, s0, s1) {
  const vector = [s1[0] - s0[0], s1[1] - s0[1]];
  return ear.math.clip_line_in_convex_polygon(poly, vector, s0,
    ear.math.exclude, ear.math.exclude_s);
};

test("collinear line", () => {
  // all inclusive cases will return a segment with unique endpoints
  // all exclusive cases will return undefined
  const rect = ear.rect(1, 1);
  const lineHoriz1 = [[1, 0], [0.5, 0]];
  const lineHoriz2 = [[1, 0], [0.5, 1]];
  const lineVert1 = [[0, 1], [0, 0.5]];
  const lineVert2 = [[0, 1], [1, 0.5]];
  const result1 = ear.math.clip_line_in_convex_polygon(rect, ...lineHoriz1, include, include_l);
  const result2 = ear.math.clip_line_in_convex_polygon(rect, ...lineHoriz2, include, include_l);
  const result3 = ear.math.clip_line_in_convex_polygon(rect, ...lineVert1, include, include_l);
  const result4 = ear.math.clip_line_in_convex_polygon(rect, ...lineVert2, include, include_l);
  const result5 = ear.math.clip_line_in_convex_polygon(rect, ...lineHoriz1, exclude, exclude_l);
  const result6 = ear.math.clip_line_in_convex_polygon(rect, ...lineHoriz2, exclude, exclude_l);
  const result7 = ear.math.clip_line_in_convex_polygon(rect, ...lineVert1, exclude, exclude_l);
  const result8 = ear.math.clip_line_in_convex_polygon(rect, ...lineVert2, exclude, exclude_l);
  expect(result1.length).toBe(2);
  expect(result2.length).toBe(2);
  expect(result3.length).toBe(2);
  expect(result4.length).toBe(2);
  expect(result5).toBe(undefined);
  expect(result6).toBe(undefined);
  expect(result7).toBe(undefined);
  expect(result8).toBe(undefined);
  expect(JSON.stringify(result1[0])).not.toBe(JSON.stringify(result1[1]));
  expect(JSON.stringify(result2[0])).not.toBe(JSON.stringify(result2[1]));
  expect(JSON.stringify(result3[0])).not.toBe(JSON.stringify(result3[1]));
  expect(JSON.stringify(result4[0])).not.toBe(JSON.stringify(result4[1]));
});

test("vertex-incident line", () => {
  // all cases will return undefined
  const quad = ear.polygon([1,0], [0,1], [-1,0], [0,-1]);
  const lineHoriz1 = [[1, 0], [-1, 1]];
  const lineHoriz2 = [[1, 0], [-1, -1]];
  const lineVert1 = [[0, 1], [-1, -1]];
  const lineVert2 = [[0, 1], [1, -1]];
  const results = [
    ear.math.clip_line_in_convex_polygon(quad, ...lineHoriz1, include, include_l),
    ear.math.clip_line_in_convex_polygon(quad, ...lineHoriz2, include, include_l),
    ear.math.clip_line_in_convex_polygon(quad, ...lineVert1, include, include_l),
    ear.math.clip_line_in_convex_polygon(quad, ...lineVert2, include, include_l),
    ear.math.clip_line_in_convex_polygon(quad, ...lineHoriz1, exclude, exclude_l),
    ear.math.clip_line_in_convex_polygon(quad, ...lineHoriz2, exclude, exclude_l),
    ear.math.clip_line_in_convex_polygon(quad, ...lineVert1, exclude, exclude_l),
    ear.math.clip_line_in_convex_polygon(quad, ...lineVert2, exclude, exclude_l),
  ];
  results.forEach(res => expect(res).toBe(undefined));
});

test("collinear core, segment", () => {
  const rect = ear.rect(1, 1);
  // remember these are VECTORS, ORIGIN
  const segHoriz1 = [[1, 0], [0.5, 0]];
  const segHoriz2 = [[1, 0], [-0.5, 0]];
  const segVert1 = [[0, 1], [0, 0.5]];
  const segVert2 = [[0, 1], [1, 0.5]];
  const result1 = ear.math.clip_line_in_convex_polygon(rect, ...segHoriz1, include, include_s);
  const result2 = ear.math.clip_line_in_convex_polygon(rect, ...segHoriz2, include, include_s);
  const result3 = ear.math.clip_line_in_convex_polygon(rect, ...segVert1, include, include_s);
  const result4 = ear.math.clip_line_in_convex_polygon(rect, ...segVert2, include, include_s);
  const result5 = ear.math.clip_line_in_convex_polygon(rect, ...segHoriz1, exclude, exclude_s);
  const result6 = ear.math.clip_line_in_convex_polygon(rect, ...segHoriz2, exclude, exclude_s);
  const result7 = ear.math.clip_line_in_convex_polygon(rect, ...segVert1, exclude, exclude_s);
  const result8 = ear.math.clip_line_in_convex_polygon(rect, ...segVert2, exclude, exclude_s);
  expect(result1.length).toBe(2);
  expect(result2.length).toBe(2);
  expect(result3.length).toBe(2);
  expect(result4.length).toBe(2);
  expect(result5).toBe(undefined);
  expect(result6).toBe(undefined);
  expect(result7).toBe(undefined);
  expect(result8).toBe(undefined);
  expect(JSON.stringify(result1[0])).not.toBe(JSON.stringify(result1[1]));
  expect(JSON.stringify(result2[0])).not.toBe(JSON.stringify(result2[1]));
  expect(JSON.stringify(result3[0])).not.toBe(JSON.stringify(result3[1]));
  expect(JSON.stringify(result4[0])).not.toBe(JSON.stringify(result4[1]));
  expect(result1[0][0]).toBe(0.5);
  expect(result1[0][1]).toBe(0);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(0);
  expect(result2[0][0]).toBe(0);
  expect(result2[0][1]).toBe(0);
  expect(result2[1][0]).toBe(0.5);
  expect(result2[1][1]).toBe(0);
  // remember these are VECTORS, ORIGIN
  const segHoriz3 = [[0.5, 0], [0.25, 0]];
  const segVert3 = [[0, 2], [0, -0.5]];
  const result9 = ear.math.clip_line_in_convex_polygon(rect, ...segHoriz3, include, include_s);
  const result10 = ear.math.clip_line_in_convex_polygon(rect, ...segVert3, include, include_s);
  const result11 = ear.math.clip_line_in_convex_polygon(rect, ...segHoriz3, exclude, exclude_s);
  const result12 = ear.math.clip_line_in_convex_polygon(rect, ...segVert3, exclude, exclude_s);
  expect(result9[0][0]).toBe(0.25);
  expect(result9[0][1]).toBe(0);
  expect(result9[1][0]).toBe(0.75);
  expect(result9[1][1]).toBe(0);
  expect(result10[0][0]).toBe(0);
  expect(result10[0][1]).toBe(0);
  expect(result10[1][0]).toBe(0);
  expect(result10[1][1]).toBe(1);
});

test("vertex-incident segment", () => {
  // all cases will return undefined
  const quad = ear.polygon([1,0], [0,1], [-1,0], [0,-1]);
  const horiz1 = [[1, 0], [-1, 1]];
  const horiz2 = [[1, 0], [-1, -1]];
  const vert1 = [[0, 1], [-1, -1]];
  const vert2 = [[0, 1], [1, -1]];
  const results = [
    ear.math.clip_line_in_convex_polygon(quad, ...horiz1, include, include_s),
    ear.math.clip_line_in_convex_polygon(quad, ...horiz2, include, include_s),
    ear.math.clip_line_in_convex_polygon(quad, ...vert1, include, include_s),
    ear.math.clip_line_in_convex_polygon(quad, ...vert2, include, include_s),
    ear.math.clip_line_in_convex_polygon(quad, ...horiz1, exclude, exclude_s),
    ear.math.clip_line_in_convex_polygon(quad, ...horiz2, exclude, exclude_s),
    ear.math.clip_line_in_convex_polygon(quad, ...vert1, exclude, exclude_s),
    ear.math.clip_line_in_convex_polygon(quad, ...vert2, exclude, exclude_s),
  ];
  results.forEach(res => expect(res).toBe(undefined));
});


test("collinear core, ray", () => {
  const rect = ear.rect(1, 1);
  const rayHoriz1 = [[1, 0], [0.5, 0]];
  const rayHoriz2 = [[1, 0], [0.5, 1]];
  const rayVert1 = [[0, 1], [0, 0.5]];
  const rayVert2 = [[0, 1], [1, 0.5]];
  const result1 = ear.math.clip_line_in_convex_polygon(rect, ...rayHoriz1, include, include_r);
  const result2 = ear.math.clip_line_in_convex_polygon(rect, ...rayHoriz2, include, include_r);
  const result3 = ear.math.clip_line_in_convex_polygon(rect, ...rayVert1, include, include_r);
  const result4 = ear.math.clip_line_in_convex_polygon(rect, ...rayVert2, include, include_r);
  const result5 = ear.math.clip_line_in_convex_polygon(rect, ...rayHoriz1, exclude, exclude_r);
  const result6 = ear.math.clip_line_in_convex_polygon(rect, ...rayHoriz2, exclude, exclude_r);
  const result7 = ear.math.clip_line_in_convex_polygon(rect, ...rayVert1, exclude, exclude_r);
  const result8 = ear.math.clip_line_in_convex_polygon(rect, ...rayVert2, exclude, exclude_r);
  expect(result1.length).toBe(2);
  expect(result2.length).toBe(2);
  expect(result3.length).toBe(2);
  expect(result4.length).toBe(2);
  expect(result5).toBe(undefined);
  expect(result6).toBe(undefined);
  expect(result7).toBe(undefined);
  expect(result8).toBe(undefined);
  expect(JSON.stringify(result1[0])).not.toBe(JSON.stringify(result1[1]));
  expect(JSON.stringify(result2[0])).not.toBe(JSON.stringify(result2[1]));
  expect(JSON.stringify(result3[0])).not.toBe(JSON.stringify(result3[1]));
  expect(JSON.stringify(result4[0])).not.toBe(JSON.stringify(result4[1]));
});

test("vertex-incident ray", () => {
  // all cases will return undefined
  const quad = ear.polygon([1,0], [0,1], [-1,0], [0,-1]);
  const horiz1 = [[1, 0], [-1, 1]];
  const horiz2 = [[1, 0], [-1, -1]];
  const vert1 = [[0, 1], [-1, -1]];
  const vert2 = [[0, 1], [1, -1]];
  const results = [
    ear.math.clip_line_in_convex_polygon(quad, ...horiz1, include, include_r),
    ear.math.clip_line_in_convex_polygon(quad, ...horiz2, include, include_r),
    ear.math.clip_line_in_convex_polygon(quad, ...vert1, include, include_r),
    ear.math.clip_line_in_convex_polygon(quad, ...vert2, include, include_r),
    ear.math.clip_line_in_convex_polygon(quad, ...horiz1, exclude, exclude_r),
    ear.math.clip_line_in_convex_polygon(quad, ...horiz2, exclude, exclude_r),
    ear.math.clip_line_in_convex_polygon(quad, ...vert1, exclude, exclude_r),
    ear.math.clip_line_in_convex_polygon(quad, ...vert2, exclude, exclude_r),
  ];
  results.forEach(res => expect(res).toBe(undefined));
});

test("collinear core, segment", () => {
  const rect = ear.rect(1, 1);
  const segHoriz1 = [[1, 0], [0.5, 0]];
  const segHoriz2 = [[1, 0], [0.5, 1]];
  const segVert1 = [[0, 1], [0, 0.5]];
  const segVert2 = [[0, 1], [1, 0.5]];
  const result1 = clip_segment_in_convex_poly_exclusive(rect, ...segHoriz1);
  const result2 = clip_segment_in_convex_poly_exclusive(rect, ...segHoriz2);
  const result3 = clip_segment_in_convex_poly_exclusive(rect, ...segVert1);
  const result4 = clip_segment_in_convex_poly_exclusive(rect, ...segVert2);
});

test("collinear core, segment, spanning multiple points", () => {
	const poly = [[0, 0], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [0, 5]];
	const seg = [[5, -1], [5, 6]];
	const res = ear.math.clip_line_in_convex_polygon(poly,
    ear.math.subtract(seg[1], seg[0]),
    seg[0],
    ear.math.include,
    ear.math.include_s);
	expect(res[0][0]).toBe(5);
	expect(res[0][1]).toBe(0);
	expect(res[1][0]).toBe(5);
	expect(res[1][1]).toBe(5);
});

test("collinear core, segment, spanning multiple points, inside", () => {
	const poly = [[0, 0], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4], [5, 5], [0, 5]];
	const seg = [[5, 0.5], [5, 4.5]];
	const res = clip_segment_in_convex_poly_inclusive(poly, ...seg);
	expect(res[0][0]).toBe(5);
	expect(res[0][1]).toBe(0.5);
	expect(res[1][0]).toBe(5);
	expect(res[1][1]).toBe(4.5);
});

test("math types, clip line in rect", () => {
  const rect = ear.rect(-1, -1, 2, 2);
  rect.exclusive();
  expect(rect.clip(ear.line(1, 1))).not.toBe(undefined);
  expect(rect.clip(ear.line([1, 0], [0, 1]))).toBe(undefined);
  expect(rect.clip(ear.line(1, -1))).not.toBe(undefined);
  rect.inclusive();
  expect(rect.clip(ear.line([1, 0], [0, 1]))).not.toBe(undefined);

  // same as above, but inclusive test.
  const result1 = clip_line_in_convex_poly_inclusive(
    rect,
    ear.line(1, 1).vector,
    ear.line(1, 1).origin,
  );
  expect(result1[0][0]).toBe(-1);
  expect(result1[0][1]).toBe(-1);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(1);
  const result2 = clip_line_in_convex_poly_inclusive(
    rect,
    ear.line([1, 0], [0, 1]).vector,
    ear.line([1, 0], [0, 1]).origin,
  );
  expect(result2[0][0]).toBe(-1);
  expect(result2[0][1]).toBe(1);
  expect(result2[1][0]).toBe(1);
  expect(result2[1][1]).toBe(1);
  const result3 = clip_line_in_convex_poly_inclusive(
    rect,
    ear.line(1, -1).vector,
    ear.line(1, -1).origin,
  );
  expect(result3[0][0]).toBe(-1);
  expect(result3[0][1]).toBe(1);
  expect(result3[1][0]).toBe(1);
  expect(result3[1][1]).toBe(-1);
});

test("math types, clip ray in rect", () => {
  const rect = ear.rect(-1, -1, 2, 2);
  const result1 = rect.clip(ear.ray(1, 1));
  expect(result1[0][0]).toBe(0);
  expect(result1[0][1]).toBe(0);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(1);
  rect.inclusive();
  expect(rect.clip(ear.ray([1, 0], [0, 1]))).not.toBe(undefined);
  rect.exclusive();
  expect(rect.clip(ear.ray([1, 0], [0, 1]))).toBe(undefined);
  const result3 = rect.clip(ear.ray(1, -1));
  expect(result3[0][0]).toBe(0);
  expect(result3[0][1]).toBe(0);
  expect(result3[1][0]).toBe(1);
  expect(result3[1][1]).toBe(-1);
});

test("math types, clip segment in rect", () => {
  const rect = ear.rect(-1, -1, 2, 2);
  const result1 = rect.clip(ear.segment([0, 0], [1, 1]));
  expect(result1[0][0]).toBe(0);
  expect(result1[0][1]).toBe(0);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(1);
  const result2 = rect.clip(ear.segment([0, 0], [2, 2]));
  expect(result2[0][0]).toBe(0);
  expect(result2[0][1]).toBe(0);
  expect(result2[1][0]).toBe(1);
  expect(result2[1][1]).toBe(1);
  const result3 = rect.clip(ear.segment([0, 0], [1, -1]));
  expect(result3[0][0]).toBe(0);
  expect(result3[0][1]).toBe(0);
  expect(result3[1][0]).toBe(1);
  expect(result3[1][1]).toBe(-1);
});

test("no clips", () => {
  const rect = ear.rect(-1, -1, 2, 2);
  const result1 = rect.clip(ear.line([-0.707, 0.707], [2, 0]));
  expect(result1).toBe(undefined);
});

test("core clip", () => {
  const poly = [...ear.rect(-1, -1, 2, 2)];
  const vector = [1, 1];
  const origin = [0, 0];
  [ clip_line_in_convex_poly_inclusive(poly, vector, origin),
    clip_ray_in_convex_poly_exclusive(poly, vector, origin),
    clip_ray_in_convex_poly_inclusive(poly, vector, origin),
    clip_segment_in_convex_poly_exclusive(poly, vector, origin),
    clip_segment_in_convex_poly_inclusive(poly, vector, origin),
  ].forEach(res => expect(res).not.toBe(undefined));
});

test("core no clip", () => {
  const poly = [...ear.rect(-1, -1, 2, 2)];
  const vector = [1, 1];
  const origin = [10, 0];
  const seg0 = [10, 0];
  const seg1 = [0, 10];
  [ clip_line_in_convex_poly_inclusive(poly, vector, origin),
    clip_ray_in_convex_poly_exclusive(poly, vector, origin),
    clip_ray_in_convex_poly_inclusive(poly, vector, origin),
    clip_segment_in_convex_poly_exclusive(poly, seg0, seg1),
    clip_segment_in_convex_poly_inclusive(poly, seg0, seg1),
  ].forEach(res => expect(res).toBe(undefined));
});

test("core clip segments exclusive", () => {
  const poly = [...ear.rect(-1, -1, 2, 2)];
  // all inside
  const seg0 = [[0, 0], [0.2, 0.2]];
  const result0 = clip_segment_in_convex_poly_exclusive(poly, ...seg0);
  expect(ear.math.equivalent(seg0[0], result0[0])).toBe(true);
  expect(ear.math.equivalent(seg0[1], result0[1])).toBe(true);
  // all outside
  const seg1 = [[10, 10], [10.2, 10.2]];
  // const result1 = clip_segment_in_convex_poly_exclusive(poly, ...seg1);
  const result1 = ear.math.clip_line_in_convex_polygon(
    [[-1, -1], [1, -1], [1, 1], [-1, 1]],
    [0.2, 0.2],
    [10, 10],
    ear.math.include,
    ear.math.include_s);
  expect(result1).toBe(undefined);
  // inside and collinear
  const seg2 = [[0, 0], [1, 0]];
  const result2 = ear.math.clip_line_in_convex_polygon(
    poly,
    [1, 0],
    [0, 0],
    ear.math.include,
    ear.math.include_s);
  expect(ear.math.equivalent(seg2[0], result2[0])).toBe(true);
  expect(ear.math.equivalent(seg2[1], result2[1])).toBe(true);
  // outside and collinear
  const seg3 = [[5, 0], [1, 0]];
  // const result3 = clip_segment_in_convex_poly_exclusive(poly, ...seg3);
  const result3 = ear.math.clip_line_in_convex_polygon(
    poly,
    [5, 0],
    [1, 0],
    ear.math.exclude,
    ear.math.exclude_s);
  expect(result3).toBe(undefined);

  // inside and collinear
  const seg4 = [[-1, 0], [1, 0]];
  const result4 = clip_segment_in_convex_poly_exclusive(poly, ...seg4);
  expect(ear.math.equivalent(seg4[0], result4[0])).toBe(true);
  expect(ear.math.equivalent(seg4[1], result4[1])).toBe(true);
});

test("core clip segments inclusive", () => {
  const poly = [...ear.rect(-1, -1, 2, 2)];
  // all inside
  const seg0 = [[0, 0], [0.2, 0.2]];
  const result0 = clip_segment_in_convex_poly_inclusive(poly, ...seg0);
  expect(ear.math.equivalent(seg0[0], result0[0])).toBe(true);
  expect(ear.math.equivalent(seg0[1], result0[1])).toBe(true);
  // all outside
  const seg1 = [[10, 10], [10.2, 10.2]];
  const result1 = clip_segment_in_convex_poly_inclusive(poly, ...seg1);
  expect(result1).toBe(undefined);
  // inside and collinear
  const seg2 = [[0, 0], [1, 0]];
  const result2 = clip_segment_in_convex_poly_inclusive(poly, ...seg2);
  expect(ear.math.equivalent(seg2[0], result2[0])).toBe(true);
  expect(ear.math.equivalent(seg2[1], result2[1])).toBe(true);
  // outside and collinear
  // const seg3 = [[5, 0], [1, 0]];
  // const result3 = clip_segment_in_convex_poly_inclusive(poly, ...seg3);
  const result3 = ear.math.clip_line_in_convex_polygon(
    poly,
    [5, 0],
    [1, 0],
    ear.math.include,
    ear.math.include_s);
  expect(result3).toBe(undefined);
  // inside and collinear
  const seg4 = [[-1, 0], [1, 0]];
  const result4 = clip_segment_in_convex_poly_inclusive(poly, ...seg4);
  expect(ear.math.equivalent(seg4[0], result4[0])).toBe(true);
  expect(ear.math.equivalent(seg4[1], result4[1])).toBe(true);
});

