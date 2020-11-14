const ear = require("../../rabbit-ear");

test("collinear core, line", () => {
  const rect = ear.rect(1, 1);
  const lineHoriz1 = [[1, 0], [0.5, 0]];
  const lineHoriz2 = [[1, 0], [0.5, 1]];
  const lineVert1 = [[0, 1], [0, 0.5]];
  const lineVert2 = [[0, 1], [1, 0.5]];
  const result1 = ear.math.clip_line_in_convex_poly_inclusive(rect, ...lineHoriz1);
  const result2 = ear.math.clip_line_in_convex_poly_inclusive(rect, ...lineHoriz2);
  const result3 = ear.math.clip_line_in_convex_poly_inclusive(rect, ...lineVert1);
  const result4 = ear.math.clip_line_in_convex_poly_inclusive(rect, ...lineVert2);
  const result5 = ear.math.clip_line_in_convex_poly_exclusive(rect, ...lineHoriz1);
  const result6 = ear.math.clip_line_in_convex_poly_exclusive(rect, ...lineHoriz2);
  const result7 = ear.math.clip_line_in_convex_poly_exclusive(rect, ...lineVert1);
  const result8 = ear.math.clip_line_in_convex_poly_exclusive(rect, ...lineVert2);
});
test("collinear core, ray", () => {
  const rect = ear.rect(1, 1);
  const rayHoriz1 = [[1, 0], [0.5, 0]];
  const rayHoriz2 = [[1, 0], [0.5, 1]];
  const rayVert1 = [[0, 1], [0, 0.5]];
  const rayVert2 = [[0, 1], [1, 0.5]];
  const result1 = ear.math.clip_ray_in_convex_poly_inclusive(rect, ...rayHoriz1);
  const result2 = ear.math.clip_ray_in_convex_poly_inclusive(rect, ...rayHoriz2);
  const result3 = ear.math.clip_ray_in_convex_poly_inclusive(rect, ...rayVert1);
  const result4 = ear.math.clip_ray_in_convex_poly_inclusive(rect, ...rayVert2);
  const result5 = ear.math.clip_ray_in_convex_poly_exclusive(rect, ...rayHoriz1);
  const result6 = ear.math.clip_ray_in_convex_poly_exclusive(rect, ...rayHoriz2);
  const result7 = ear.math.clip_ray_in_convex_poly_exclusive(rect, ...rayVert1);
  const result8 = ear.math.clip_ray_in_convex_poly_exclusive(rect, ...rayVert2);
});
test("collinear core, segment", () => {
  const rect = ear.rect(1, 1);
  const segHoriz1 = [[1, 0], [0.5, 0]];
  const segHoriz2 = [[1, 0], [0.5, 1]];
  const segVert1 = [[0, 1], [0, 0.5]];
  const segVert2 = [[0, 1], [1, 0.5]];
  const result1 = ear.math.clip_segment_in_convex_poly_exclusive(rect, ...segHoriz1);
  const result2 = ear.math.clip_segment_in_convex_poly_exclusive(rect, ...segHoriz2);
  const result3 = ear.math.clip_segment_in_convex_poly_exclusive(rect, ...segVert1);
  const result4 = ear.math.clip_segment_in_convex_poly_exclusive(rect, ...segVert2);
});


test("math types, clip line in rect", () => {
  const rect = ear.rect(-1, -1, 2, 2);
  expect(rect.clipLine(ear.line(1, 1))).not.toBe(undefined);
  expect(rect.clipLine(ear.line([1, 0], [0, 1]))).toBe(undefined);
  expect(rect.clipLine(ear.line(1, -1))).not.toBe(undefined);

  // same as above, but inclusive test.
  const result1 = ear.math.clip_line_in_convex_poly_inclusive(
    rect,
    ear.line(1, 1).vector,
    ear.line(1, 1).origin,
  );
  expect(result1[0][0]).toBe(-1);
  expect(result1[0][1]).toBe(-1);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(1);
  const result2 = ear.math.clip_line_in_convex_poly_inclusive(
    rect,
    ear.line([1, 0], [0, 1]).vector,
    ear.line([1, 0], [0, 1]).origin,
  );
  expect(result2[0][0]).toBe(1);
  expect(result2[0][1]).toBe(1);
  expect(result2[1][0]).toBe(-1);
  expect(result2[1][1]).toBe(1);
  const result3 = ear.math.clip_line_in_convex_poly_inclusive(
    rect,
    ear.line(1, -1).vector,
    ear.line(1, -1).origin,
  );
  expect(result3[0][0]).toBe(1);
  expect(result3[0][1]).toBe(-1);
  expect(result3[1][0]).toBe(-1);
  expect(result3[1][1]).toBe(1);
});

test("math types, clip ray in rect", () => {
  const rect = ear.rect(-1, -1, 2, 2);
  const result1 = rect.clipRay(ear.ray(1, 1));
  expect(result1[0][0]).toBe(0);
  expect(result1[0][1]).toBe(0);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(1);
  // ray is exclusive by default
  const result2 = rect.clipRay(ear.ray([1, 0], [0, 1]));
  expect(result2).toBe(undefined);
  const result3 = rect.clipRay(ear.ray(1, -1));
  expect(result3[0][0]).toBe(0);
  expect(result3[0][1]).toBe(0);
  expect(result3[1][0]).toBe(1);
  expect(result3[1][1]).toBe(-1);
});

test("math types, clip segment in rect", () => {
  const rect = ear.rect(-1, -1, 2, 2);
  const result1 = rect.clipSegment(ear.segment([0, 0], [1, 1]));
  expect(result1[0][0]).toBe(0);
  expect(result1[0][1]).toBe(0);
  expect(result1[1][0]).toBe(1);
  expect(result1[1][1]).toBe(1);
  const result2 = rect.clipSegment(ear.segment([0, 0], [2, 2]));
  expect(result2[0][0]).toBe(0);
  expect(result2[0][1]).toBe(0);
  expect(result2[1][0]).toBe(1);
  expect(result2[1][1]).toBe(1);
  const result3 = rect.clipSegment(ear.segment([0, 0], [1, -1]));
  expect(result3[0][0]).toBe(0);
  expect(result3[0][1]).toBe(0);
  expect(result3[1][0]).toBe(1);
  expect(result3[1][1]).toBe(-1);
});

test("no clips", () => {
  const rect = ear.rect(-1, -1, 2, 2);
  const result1 = rect.clipLine(ear.line([-0.707, 0.707], [2, 0]));
  expect(result1).toBe(undefined);
});

test("core clip", () => {
  const poly = [...ear.rect(-1, -1, 2, 2)];
  const vector = [1, 1];
  const origin = [0, 0];
  [ ear.math.clip_line_in_convex_poly_inclusive(poly, vector, origin),
    ear.math.clip_ray_in_convex_poly_exclusive(poly, vector, origin),
    ear.math.clip_ray_in_convex_poly_inclusive(poly, vector, origin),
    ear.math.clip_segment_in_convex_poly_exclusive(poly, vector, origin),
    ear.math.clip_segment_in_convex_poly_inclusive(poly, vector, origin),
  ].forEach(res => expect(res).not.toBe(undefined));
});

test("core no clip", () => {
  const poly = [...ear.rect(-1, -1, 2, 2)];
  const vector = [1, 1];
  const origin = [10, 0];
  const seg0 = [10, 0];
  const seg1 = [0, 10];
  [ ear.math.clip_line_in_convex_poly_inclusive(poly, vector, origin),
    ear.math.clip_ray_in_convex_poly_exclusive(poly, vector, origin),
    ear.math.clip_ray_in_convex_poly_inclusive(poly, vector, origin),
    ear.math.clip_segment_in_convex_poly_exclusive(poly, seg0, seg1),
    ear.math.clip_segment_in_convex_poly_inclusive(poly, seg0, seg1),
  ].forEach(res => expect(res).toBe(undefined));
});

test("core clip segments exclusive", () => {
  const poly = [...ear.rect(-1, -1, 2, 2)];
  // all inside
  const seg0 = [[0, 0], [0.2, 0.2]];
  const result0 = ear.math.clip_segment_in_convex_poly_exclusive(poly, ...seg0);
  expect(ear.math.equivalent(seg0[0], result0[0])).toBe(true);
  expect(ear.math.equivalent(seg0[1], result0[1])).toBe(true);
  // all outside
  const seg1 = [[10, 10], [10.2, 10.2]];
  const result1 = ear.math.clip_segment_in_convex_poly_exclusive(poly, ...seg1);
  expect(result1).toBe(undefined);
  // inside and collinear
  const seg2 = [[0, 0], [1, 0]];
  const result2 = ear.math.clip_segment_in_convex_poly_exclusive(poly, ...seg2);
  expect(ear.math.equivalent(seg2[0], result2[0])).toBe(true);
  expect(ear.math.equivalent(seg2[1], result2[1])).toBe(true);
  // outside and collinear
  const seg3 = [[5, 0], [1, 0]];
  const result3 = ear.math.clip_segment_in_convex_poly_exclusive(poly, ...seg3);
  expect(result3).toBe(undefined);
  // inside and collinear
  // const seg4 = [[-1, 0], [1, 0]];
  // const result4 = ear.math.clip_segment_in_convex_poly_exclusive(poly, ...seg4);
  // expect(ear.math.equivalent(seg4[0], result4[0])).toBe(true);
  // expect(ear.math.equivalent(seg4[1], result4[1])).toBe(true);
});

test("core clip segments inclusive", () => {
  const poly = [...ear.rect(-1, -1, 2, 2)];
  // all inside
  const seg0 = [[0, 0], [0.2, 0.2]];
  const result0 = ear.math.clip_segment_in_convex_poly_inclusive(poly, ...seg0);
  expect(ear.math.equivalent(seg0[0], result0[0])).toBe(true);
  expect(ear.math.equivalent(seg0[1], result0[1])).toBe(true);
  // all outside
  const seg1 = [[10, 10], [10.2, 10.2]];
  const result1 = ear.math.clip_segment_in_convex_poly_inclusive(poly, ...seg1);
  expect(result1).toBe(undefined);
  // inside and collinear
  const seg2 = [[0, 0], [1, 0]];
  const result2 = ear.math.clip_segment_in_convex_poly_inclusive(poly, ...seg2);
  expect(ear.math.equivalent(seg2[0], result2[0])).toBe(true);
  expect(ear.math.equivalent(seg2[1], result2[1])).toBe(true);
  // outside and collinear
  const seg3 = [[5, 0], [1, 0]];
  const result3 = ear.math.clip_segment_in_convex_poly_inclusive(poly, ...seg3);
  expect(result3).toBe(undefined);
  // inside and collinear
  const seg4 = [[-1, 0], [1, 0]];
  const result4 = ear.math.clip_segment_in_convex_poly_inclusive(poly, ...seg4);
  expect(ear.math.equivalent(seg4[0], result4[0])).toBe(true);
  expect(ear.math.equivalent(seg4[1], result4[1])).toBe(true);
});
