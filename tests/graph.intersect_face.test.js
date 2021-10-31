const ear = require("../rabbit-ear");

// ear.graph.intersect_convex_face_line(graph, face, vector, point);

test("intersect face test, 2 vertices", () => {
  const graph = ear.graph.octogon();
  const res = ear.graph.intersect_convex_face_line(graph, 0, [1, 0], [0, 0]);
  expect(res.vertices.length).toBe(2);
  expect(res.edges.length).toBe(0);
  expect(res.vertices[0]).toBe(0);
  expect(res.vertices[1]).toBe(4);
});

test("intersect face test, 1 vertex, 1 edge", () => {
  const graph = ear.graph.nonagon();
  const res = ear.graph.intersect_convex_face_line(graph, 0, [1, 0], [0, 0]);
  expect(res.vertices.length).toBe(1);
  expect(res.edges.length).toBe(1);
});

test("intersect face test, 2 edges", () => {
  const graph = ear.graph.nonagon();
  const vector = [1, 0];
  const point = [0, 0.01];
  const res = ear.graph.intersect_convex_face_line(graph, 0, vector, point);
  expect(res.vertices.length).toBe(0);
  expect(res.edges.length).toBe(2);
  expect(res.edges[0].coords[1]).toBeCloseTo(0.01);
  expect(res.edges[1].coords[1]).toBeCloseTo(0.01);
  expect(res.edges[0].edge).toBe(4);
  expect(res.edges[1].edge).toBe(0);
  // i feel like reversing the direction of the vector should reverse the results
  const reverse = ear.graph.intersect_convex_face_line(graph, 0, ear.math.flip(vector), point, 1e-6);
  // expect(reverse.edges[0].edge).toBe(0);
  // expect(reverse.edges[1].edge).toBe(4);
});

test("intersect face test, 2 vertices, large epsilon", () => {
  const graph = ear.graph.octogon();
  const point = [0, 0.01];
  const res = ear.graph.intersect_convex_face_line(graph, 0, [1, 0], point, 0.03);
  expect(res.vertices.length).toBe(2);
  expect(res.edges.length).toBe(0);
  expect(res.vertices[0]).toBe(0);
  expect(res.vertices[1]).toBe(4);
});

test("intersect face test, collinear to edge", () => {
  const graph = ear.graph.square();
  [ ear.graph.intersect_convex_face_line(graph, 0, [1, 0], [0, 0]),
    ear.graph.intersect_convex_face_line(graph, 0, [0, 1], [1, 0]),
    ear.graph.intersect_convex_face_line(graph, 0, [1, 0], [1, 1]),
    ear.graph.intersect_convex_face_line(graph, 0, [0, 1], [0, 1])
  ].forEach(res => expect(res).toBe(undefined));
});

test("epsilon-close to both edge and vertex intersection", () => {
  // this one previously failed before refactoring
  // the intersection was close to both a vertex and its edge
  const line = ear.line([-1, 1.01], [0.999, 0.015]);
  const res = ear.graph.intersect_convex_face_line(
    ear.graph.square(), 0, line.vector, line.origin, 0.01
  );
  expect(res.vertices.length).toBe(1);
  expect(res.edges.length).toBe(1);
});

test("outside the polygon", () => {
  const line = ear.line([1, 0], [0, 10]);
  const res = ear.graph.intersect_convex_face_line(
    ear.graph.square(), 0, line.vector, line.origin
  );
  expect(res).toBe(undefined);
});
