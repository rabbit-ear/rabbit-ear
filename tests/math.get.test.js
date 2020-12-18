const ear = require("../rabbit-ear");

const equalTest = (a, b) => expect(JSON.stringify(a))
  .toBe(JSON.stringify(b));

test("get with real types", () => {
  const vector = ear.vector(1,2,3);
  const matrix = ear.matrix(1,2,3,4);
  const line = ear.line(1,2);
  const ray = ear.ray(1,2);
  const segment = ear.segment([1,2],[3,4]);
  const circle = ear.circle(1);
  const rect = ear.rect(2,4);
  const ellipse = ear.ellipse(1,2);
  expect(ear.math.get_vector(vector)[2]).toBe(3);
  // expect(ear.math.get_vector_of_vectors(segment)[0]).toBe(1);
  expect(ear.math.get_segment(segment)[0][1]).toBe(2);
  expect(ear.math.get_line(line).vector[1]).toBe(2);
  expect(ear.math.get_rect(rect).height).toBe(4);
  expect(ear.math.get_matrix_3x4(matrix)[4]).toBe(4);
  expect(ear.math.get_matrix2(matrix)[1]).toBe(2);
});

test("get_vector", () => {
  equalTest(
    [1, 2, 3, 4],
    ear.math.get_vector([[[1, 2, 3, 4]]])
  );
  equalTest(
    [1, 2, 3, 4],
    ear.math.get_vector(1, 2, 3, 4)
  );
  equalTest(
    [1, 2, 3, 4, 2, 4],
    ear.math.get_vector([1, 2, 3, 4], [2, 4])
  );
  equalTest(
    [1, 2, 3, 4, 6, 7, 6],
    ear.math.get_vector([1, 2, 3, 4], [6, 7], 6)
  );
  equalTest(
    [1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
    ear.math.get_vector([1, 2, 3, 4], [6, 7], 6, 2, 4, 5)
  );
  equalTest(
    [5, 3],
    ear.math.get_vector({ x: 5, y: 3 })
  );
  equalTest(
    [5, 3],
    ear.math.get_vector([[[{ x: 5, y: 3 }]]])
  );
  equalTest(
    [5, 3],
    ear.math.get_vector([[[5, 3]]])
  );
  equalTest(
    [5, 3],
    ear.math.get_vector([[[5], [3]]])
  );
  equalTest(
    [5, 3],
    ear.math.get_vector([[[5]], [[3]]])
  );
  equalTest(
    [5, 3],
    ear.math.get_vector([[[5]]], [[[3]]])
  );
  equalTest(
    [5, 3],
    ear.math.get_vector([[[5]]], 3)
  );
});

test("get_line", () => {
  equalTest(ear.math.get_line(1), { vector: [1], origin: [] });
  equalTest(ear.math.get_line(1, 2), { vector: [1, 2], origin: [] });
  equalTest(ear.math.get_line(1, 2, 3), { vector: [1, 2, 3], origin: [] });
  equalTest(ear.math.get_line([1], [2]), { vector: [1], origin: [2] });
  equalTest(ear.math.get_line([1, 2], [2, 3]), { vector: [1, 2], origin: [2, 3] });
  equalTest(ear.math.get_line(), { vector: [], origin: [] });
  equalTest(ear.math.get_line({}), { vector: [], origin: [] });
});

test("get_vector_of_vectors", () => {
  equalTest([[1, 2], [3, 4]],
    ear.math.get_vector_of_vectors({ x: 1, y: 2 }, { x: 3, y: 4 }));
  equalTest([[1, 2], [3, 4]],
    ear.math.get_vector_of_vectors([[[{ x: 1, y: 2 }, { x: 3, y: 4 }]]]));
  equalTest([[1, 2], [3, 4]],
    ear.math.get_vector_of_vectors([[[1, 2], [3, 4]]]));
  equalTest([[1, 2], [3, 4]],
    ear.math.get_vector_of_vectors([[[1, 2]], [[3, 4]]]));
  equalTest([[1, 2], [3, 4]],
    ear.math.get_vector_of_vectors([[[1, 2]]], [[[3, 4]]]));
  equalTest([[1], [2], [3], [4]],
    ear.math.get_vector_of_vectors([[[1], [2], [3], [4]]]));
  equalTest([[1], [2], [3], [4]],
    ear.math.get_vector_of_vectors([[[1]], [[2]], [[3]], [[4]]]));
  equalTest([[1], [2], [3], [4]],
    ear.math.get_vector_of_vectors([[[1]]], 2, 3, 4));
  equalTest([[1], [2], [3], [4]],
    ear.math.get_vector_of_vectors([[[1, 2, 3, 4]]]));
});

test("get_segment", () => {
  equalTest([[1, 2], [3, 4]], ear.math.get_segment(1, 2, 3, 4));
  equalTest([[1, 2], [3, 4]], ear.math.get_segment([1, 2], [3, 4]));
  equalTest([[1, 2], [3, 4]], ear.math.get_segment([1, 2, 3, 4]));
  equalTest([[1, 2], [3, 4]], ear.math.get_segment([[1, 2], [3, 4]]));
});

test("get_matrix2", () => {
  equalTest(
    [1, 2, 3, 4, 5, 6],
    ear.math.get_matrix2([[[1, 2, 3, 4, 5, 6]]])
  );
  equalTest(
    [1, 2, 3, 4, 0, 0],
    ear.math.get_matrix2([[1, 2, 3, 4]])
  );
  equalTest(
    [1, 2, 3, 1, 0, 0],
    ear.math.get_matrix2(1, 2, 3)
  );
  equalTest(
    [1, 2, 3, 1, 0, 0],
    ear.math.get_matrix2(1, 2, 3, 1)
  );
});

test("get_matrix_3x4", () => {
  equalTest(
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    ear.math.get_matrix_3x4([[[]]]),
  );
  equalTest(
    [1, 2, 0, 3, 4, 0, 0, 0, 1, 0, 0, 0],
    ear.math.get_matrix_3x4([[[1, 2, 3, 4]]]),
  );
  equalTest(
    [1, 2, 0, 3, 4, 0, 0, 0, 1, 5, 6, 0],
    ear.math.get_matrix_3x4([[[1, 2, 3, 4, 5, 6]]]),
  );
  equalTest(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0],
    ear.math.get_matrix_3x4([[[1, 2, 3, 4, 5, 6, 7, 8, 9]]]),
  );
});
