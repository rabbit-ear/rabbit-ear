const ear = require("../rabbit-ear");

test("smart detection", () => {
  expect(ear.typeof({ x: 1, y: 2 })).toBe("vector");
});

test("primitive constructor function names", () => {
  const vector = ear.vector();
  const matrix = ear.matrix();
  const segment = ear.segment();
  const ray = ear.ray();
  const line = ear.line();
  const circle = ear.circle();
  const ellipse = ear.ellipse();
  const rect = ear.rect();
  const polygon = ear.polygon();

  expect(vector.constructor.name).toBe("vector");
  expect(matrix.constructor.name).toBe("matrix");
  expect(segment.constructor.name).toBe("segment");
  expect(ray.constructor.name).toBe("ray");
  expect(line.constructor.name).toBe("line");
  expect(circle.constructor.name).toBe("circle");
  expect(ellipse.constructor.name).toBe("ellipse");
  expect(rect.constructor.name).toBe("rect");
  expect(polygon.constructor.name).toBe("polygon");
});

test("primitives Typeof", () => {
  const vector = ear.vector();
  const matrix = ear.matrix();
  const line = ear.line();
  const ray = ear.ray();
  const segment = ear.segment();
  const circle = ear.circle();
  const rect = ear.rect();
  const ellipse = ear.ellipse();
	// const junction = ear.junction();

  expect(ear.typeof(vector)).toBe("vector");
  expect(ear.typeof(matrix)).toBe("matrix");
  expect(ear.typeof(line)).toBe("line");
  expect(ear.typeof(ray)).toBe("ray");
  expect(ear.typeof(segment)).toBe("segment");
  expect(ear.typeof(circle)).toBe("circle");
  expect(ear.typeof(rect)).toBe("rect");
  expect(ear.typeof(ellipse)).toBe("ellipse");
	// expect(ear.typeof(junction)).toBe("junction");
});

test("primitives instanceof", () => {
  const vector = ear.vector();
  const matrix = ear.matrix();
  const line = ear.line();
  const ray = ear.ray();
  const segment = ear.segment();
  const circle = ear.circle();
  const rect = ear.rect();
  const ellipse = ear.ellipse();
	// const junction = ear.junction();

  expect(vector instanceof ear.vector).toBe(true);
  expect(matrix instanceof ear.matrix).toBe(true);
  expect(line instanceof ear.line).toBe(true);
  expect(ray instanceof ear.ray).toBe(true);
  expect(segment instanceof ear.segment).toBe(true);
  expect(circle instanceof ear.circle).toBe(true);
  expect(rect instanceof ear.rect).toBe(true);
  expect(ellipse instanceof ear.ellipse).toBe(true);
	// expect(junction instanceof ear.junction).toBe(true);
});

test("primitives constructor", () => {
  const vector = ear.vector();
  const matrix = ear.matrix();
  const line = ear.line();
  const ray = ear.ray();
  const segment = ear.segment();
  const circle = ear.circle();
  const rect = ear.rect();
  const ellipse = ear.ellipse();
	// const junction = ear.junction();

  expect(vector.constructor === ear.vector).toBe(true);
  expect(matrix.constructor === ear.matrix).toBe(true);
  expect(line.constructor === ear.line).toBe(true);
  expect(ray.constructor === ear.ray).toBe(true);
  expect(segment.constructor === ear.segment).toBe(true);
  expect(circle.constructor === ear.circle).toBe(true);
  expect(rect.constructor === ear.rect).toBe(true);
  expect(ellipse.constructor === ear.ellipse).toBe(true);
	// expect(junction.constructor === ear.junction).toBe(true);
});

test("type guessing", () => {
  const vector1 = { x: 1, y: 2, z: 3};
  const vector2 = [1, 2, 3];
  const line = { vector: [1, 1], origin: [0.5, 0.5]};
  const segment = [[1,2], [4,5]];
  const circle = {radius: 1};
  const rect = { width: 2, height: 1 };

  expect(ear.typeof(vector1)).toBe("vector");
  expect(ear.typeof(vector2)).toBe("vector");
  expect(ear.typeof(line)).toBe("line");
  expect(ear.typeof(segment)).toBe("segment");
  expect(ear.typeof(circle)).toBe("circle");
  expect(ear.typeof(rect)).toBe("rect");
  expect(ear.typeof({})).toBe(undefined);
  expect(ear.typeof(4)).toBe(undefined);
  expect(ear.typeof(true)).toBe(undefined);
  expect(ear.typeof("s")).toBe(undefined);
});

