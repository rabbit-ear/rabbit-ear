const ear = require("../../rabbit-ear");

const equalTest = (a, b) => expect(JSON.stringify(a))
  .toBe(JSON.stringify(b));

test("prototype member variables accessing 'this'", () => {
  expect(ear.polygon.regularPolygon(4).sides.length).toBe(4);
  expect(ear.polygon.regularPolygon(4).area()).toBeCloseTo(1);
});

test("isConvex", () => {
  expect(ear.polygon.regularPolygon(4).isConvex).toBe(true);
});

test(".segments", () => {
  const polygon = ear.polygon.regularPolygon(4);
  const segments = polygon.segments();
  expect(segments.length).toBe(4);
  expect(polygon.sides[0]).toBe(polygon.segments()[0]);
});

test("polygon", () => {
  // equalTest(
  //   ear.polygon.regularPolygon(4).clipLine(ear.line(0.5, 0.5, 6, -11)),
  //   ear.convexPolygon.regularPolygon(4).clipLine(ear.line(0.5, 0.5, 6, -11))
  // );
  const segment = ear.polygon.regularPolygon(4).intersectLine(ear.line(1, 0));
  expect(Math.abs(segment[0][0])).toBeCloseTo(Math.sqrt(2)/2);
  expect(segment[0][1]).toBeCloseTo(0);
  expect(Math.abs(segment[1][0])).toBeCloseTo(Math.sqrt(2)/2);
  expect(segment[1][1]).toBeCloseTo(0);

  // equalTest(true, ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).sides);
  // equalTest(true, ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).split);
  // equalTest(true, ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).overlaps);
  // equalTest(true, ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).scale);
  // equalTest(true, ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).rotate);
});


test("area", () => {
  expect(ear.polygon([-0.5,-0.5], [0.5,-0.5], [0.5, 0.5], [-0.5, 0.5]).area()).toBeCloseTo(1);
});
test("convex Hull", () => {
  const result = ear.polygon.convexHull([[1,0], [0.5,0], [0,1], [0,-1]]);
  expect(result.points.length).toBe(3);
});

// test("midpoint", () => {
//   const result = ear.polygon([-0.5,-0.5], [0.5,-0.5], [0.5, 0.5], [-0.5, 0.5]).midpoint();
//   expect(result[0]).toBeCloseTo(0);
//   expect(result[1]).toBeCloseTo(0);
// });
test("centroid", () => {
  const result = ear.polygon([1,0], [0,1], [-1,0]).centroid();
  expect(result[0]).toBeCloseTo(0);
  expect(result[1]).toBeCloseTo(1/3);
});
test("enclosingRectangle", () => {
  const rect = ear.polygon([[1,0], [0,1], [-1,0], [0,-1]]).enclosingRectangle();
  expect(rect.x).toBe(-1);
  expect(rect.y).toBe(-1);
  expect(rect.width).toBe(2);
  expect(rect.height).toBe(2);
});
test("contains", () => {
  expect(ear.polygon([[1,0], [0,1], [-1,0], [0,-1]]).contains(0.49, 0.49))
    .toBe(true);
  expect(ear.polygon([[1,0], [0,1], [-1,0], [0,-1]]).contains(0.5, 0.5))
    .toBe(false);
  expect(ear.polygon([[1,0], [0,1], [-1,0], [0,-1]]).contains(0.51, 0.51))
    .toBe(false);
});
test("scale", () => {
  const result = ear.polygon([-0.5,-0.5], [0.5,-0.5], [0.5, 0.5], [-0.5, 0.5]).scale(2);
  expect(result.points[0][0]).toBeCloseTo(-1);
  expect(result.points[0][1]).toBeCloseTo(-1);
});
test("rotate", () => {
  const sq = Math.sqrt(2) / 2;
  const result = ear.polygon([-sq,-sq], [sq,-sq], [sq, sq], [-sq, sq]).rotate(Math.PI/4);
  expect(result.points[0][0]).toBeCloseTo(0);
  expect(result.points[0][1]).toBeCloseTo(-1);
});
test("translate", () => {
  const result = ear.polygon([[1,0], [0,1], [-1,0], [0,-1]]).translate(Math.PI/2);
});
test("transform", () => {
  const matrix = ear.matrix(1,0,0,0,1,0,0,0,1,4,5,0);
  const result = ear.polygon([-0.5,-0.5], [0.5,-0.5], [0.5, 0.5], [-0.5, 0.5]).transform(matrix);
  expect(result.points[0][0]).toBeCloseTo(3.5);
  expect(result.points[0][1]).toBeCloseTo(4.5);
});
// test("sectors", () => {
//   const result = ear.polygon([[1,0], [0,1], [-1,0], [0,-1]]).sectors();
//   console.log("sectors", result);
// });
test("nearest", () => {
  const result = ear.polygon([[1,0], [0,1], [-1,0], [0,-1]]).nearest(10, 10);
  expect(result.point[0]).toBe(0.5);
  expect(result.point[1]).toBe(0.5);
  expect(result.distance).toBeCloseTo(13.435028842544403);
  expect(result.edge[0][0]).toBeCloseTo(1);
  expect(result.edge[0][1]).toBeCloseTo(0);
});

test("overlaps", () => {
  const poly1 = ear.polygon([[1,0], [0,1], [-1,0]]);  // top
  const poly2 = ear.polygon([[0,1], [-1,0], [0,-1]]); // left
  const poly3 = ear.polygon([[1,0], [0,1], [0,-1]]);  // right
  const poly4 = ear.polygon([[1,0], [-1,0], [0,-1]]);  // bottom
  expect(poly1.overlaps(poly2)).toBe(true);
  expect(poly1.overlaps(poly3)).toBe(true);
  expect(poly4.overlaps(poly2)).toBe(true);
  expect(poly4.overlaps(poly3)).toBe(true);

  expect(poly2.overlaps(poly3)).toBe(false);
  expect(poly1.overlaps(poly4)).toBe(false);
});
test("split", () => {
  const poly = ear.polygon([[1,0], [0,1], [-1,0]]);
  const line1 = ear.line([1, 0], [0, 0.5]);
  const line2 = ear.line([1, 0], [0, -0.5]);
  const result1 = poly.split(line1);

  expect(result1[0][0][0]).toBe(-1);
  expect(result1[0][0][1]).toBe(0);

  expect(result1[0][1][0]).toBe(1);
  expect(result1[0][1][1]).toBe(0);

  expect(result1[0][2][0]).toBe(0.5);
  expect(result1[0][2][1]).toBe(0.5);

  expect(result1[0][3][0]).toBe(-0.5);
  expect(result1[0][3][1]).toBe(0.5);

  expect(result1[1][0][0]).toBe(0);
  expect(result1[1][0][1]).toBe(1);

  expect(result1[1][1][0]).toBe(-0.5);
  expect(result1[1][1][1]).toBe(0.5);

  expect(result1[1][2][0]).toBe(0.5);
  expect(result1[1][2][1]).toBe(0.5);
});

test("intersectLine", () => {
  const poly = ear.polygon([[1,0], [0,1], [-1,0], [0,-1]]);
  const line = ear.line([1,0], [0, 0.5]);
  const result = poly.intersectLine(line);
  expect(result[0][0]).toBeCloseTo(0.5);
  expect(result[0][1]).toBeCloseTo(0.5);
});
test("intersectRay", () => {
  const poly = ear.polygon([[1,0], [0,1], [-1,0], [0,-1]]);
  const ray = ear.ray([1,0], [0, 0.5]);
  const result = poly.intersectRay(ray);
});
test("intersectSegment", () => {
  const poly = ear.polygon([[1,0], [0,1], [-1,0], [0,-1]]);
  const segment = ear.segment([-2, 0.5], [2, 0.5]);
  const result = poly.intersectSegment(segment);
  expect(result[0][0]).toBeCloseTo(0.5);
  expect(result[0][1]).toBeCloseTo(0.5);
  expect(result[1][0]).toBeCloseTo(-0.5);
  expect(result[1][1]).toBeCloseTo(0.5);
});
// test("svgPath", () => {
//   svgPath: function () 
// });
// test("intersect", () => {
//   intersect: function (other
// });{