const ear = require("../rabbit-ear");

test("make edges_foldAngle", () => {
  const result = ear.core.make_edges_foldAngle({
    edges_assignment: ["M", "m", "f", "F", "V", "v"]
  });
  expect(result).toEqual(expect.arrayContaining([-180, -180, 0, 0, 180, 180]));
});

test("make edges_foldAngle undefineds", () => {
  const result = ear.core.make_edges_foldAngle({
    edges_assignment: ["M", undefined, undefined, "F", "V"]
  });
  expect(result).toEqual(expect.arrayContaining([-180, 0, 0, 0, 180]));
});

test("make edges_assignment", () => {
  const result = ear.core.make_edges_assignment({
    edges_foldAngle: [-180, -180, 0, 0, 180, 180]
  });
  expect(result).toEqual(expect.arrayContaining(["M", "M", "F", "F", "V", "V"]));
});

test("make edges_assignment", () => {
  const result = ear.core.make_edges_assignment({
    edges_foldAngle: [-Infinity, -1, -0.5, -1e-10, 0, 1e-10, 0.5, 1, Infinity]
  });
  expect(result).toEqual(expect.arrayContaining(["M", "M", "M", "M", "F", "V", "V", "V", "V"]));
});

test("make edges_length", () => {
  const result = ear.core.make_edges_length({
    vertices_coords: [[0,0], [1,0], [1,1], [0,1]],
    edges_vertices: [[0,1], [1,2], [2,3], [3,0], [0,2]],
  });
  expect(result[4]).toBeCloseTo(Math.sqrt(2));
  expect(result).toEqual(expect.arrayContaining([1, 1, 1, 1, result[4]]));
});
