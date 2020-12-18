const ear = require("../rabbit-ear");

const equalTest = (a, b) => expect(JSON.stringify(a))
  .toBe(JSON.stringify(b));

test("resize", () => {
  const a = [1, 2, 3];
  const _a = ear.math.resize(5, a);
  equalTest(_a, [1, 2, 3, 0, 0]);
});

test("resize empty", () => {
	const res = ear.math.resize(3, []);
	expect(ear.math.equivalent_vectors([0, 0, 0], res)).toBe(true);
});

test("resize undefined", () => {
	try {
		ear.math.resize(3);
	} catch(err) {
		expect(err).not.toBe(undefined);
	}
});

test("resize_up", () => {
  const a = [1, 2, 3];
  const b = [4, 5];
  expect(a.length).toBe(3);
  expect(b.length).toBe(2);
  const [_a, _b] = ear.math.resize_up(a, b);
  expect(_a.length).toBe(3);
  expect(_b.length).toBe(3);
});

test("resize_down", () => {
  const a = [1, 2, 3];
  const b = [4, 5];
  expect(a.length).toBe(3);
  expect(b.length).toBe(2);
  const [_a, _b] = ear.math.resize_down(a, b);
  expect(_a.length).toBe(2);
  expect(_b.length).toBe(2);
});

test("clean_number", () => {
  // this is the most decimal places javascript uses
  equalTest(ear.math.clean_number(0.12345678912345678), 0.12345678912345678);
  equalTest(ear.math.clean_number(0.12345678912345678, 5), 0.12345678912345678);
  equalTest(ear.math.clean_number(0.00000678912345678, 5), 0.00000678912345678);
  equalTest(ear.math.clean_number(0.00000078912345678, 5), 0);
  equalTest(ear.math.clean_number(0.00000000000000001), 0);
  equalTest(ear.math.clean_number(0.0000000000000001), 0);
  equalTest(ear.math.clean_number(0.000000000000001), 0.000000000000001);
  equalTest(ear.math.clean_number(0.00000000001, 9), 0);
  equalTest(ear.math.clean_number(0.0000000001, 9), 0);
  equalTest(ear.math.clean_number(0.000000001, 9), 0.000000001);
});

test("clean_number invalid input", () => {
  // this is the most decimal places javascript uses
  expect(ear.math.clean_number("50.00000000001")).toBe("50.00000000001");
  expect(ear.math.clean_number(undefined)).toBe(undefined);
  expect(ear.math.clean_number(true)).toBe(true);
  expect(ear.math.clean_number(false)).toBe(false);
  const arr = [];
  expect(ear.math.clean_number(arr)).toBe(arr);
});

/**
 * inputs and argument inference
 */
test("semi flatten arrays", () => {
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    ear.math.semi_flatten_arrays([0, 1, 2], [2, 3, 4])
  );
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    ear.math.semi_flatten_arrays([[0, 1, 2]], [[2, 3, 4]])
  );
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    ear.math.semi_flatten_arrays([[[0, 1, 2]], [[2, 3, 4]]])
  );
  equalTest(
    [[0, 1, 2], [2, 3, 4]],
    ear.math.semi_flatten_arrays([[[[0, 1, 2]], [[2, 3, 4]]]])
  );
  equalTest(
    [[[0], [1], [2]], [2, 3, 4]],
    ear.math.semi_flatten_arrays([[[[0], [1], [2]]], [[2, 3, 4]]])
  );
  equalTest(
    [[[0], [1], [2]], [2, 3, 4]],
    ear.math.semi_flatten_arrays([[[[[[0]]], [[[1]]], [2]]], [[2, 3, 4]]])
  );
});

test("flatten arrays", () => {
  equalTest(
    [1],
    ear.math.flatten_arrays([[[1]], []])
  );
  equalTest(
    [1, 2, 3, 4],
    ear.math.flatten_arrays([[[1, 2, 3, 4]]])
  );
  equalTest(
    [1, 2, 3, 4],
    ear.math.flatten_arrays(1, 2, 3, 4)
  );
  equalTest(
    [1, 2, 3, 4, 2, 4],
    ear.math.flatten_arrays([1, 2, 3, 4], [2, 4])
  );
  equalTest(
    [1, 2, 3, 4, 6, 7, 6],
    ear.math.flatten_arrays([1, 2, 3, 4], [6, 7], 6)
  );
  equalTest(
    [1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
    ear.math.flatten_arrays([1, 2, 3, 4], [6, 7], 6, 2, 4, 5)
  );
  equalTest(
    [{ x: 5, y: 3 }],
    ear.math.flatten_arrays({ x: 5, y: 3 })
  );
  equalTest(
    [{ x: 5, y: 3 }],
    ear.math.flatten_arrays([[{ x: 5, y: 3 }]])
  );
  equalTest(
    [1, 2, 3, 4, 5, 6],
    ear.math.flatten_arrays([[[1], [2, 3]]], 4, [5, 6])
  );
  equalTest(
    [undefined, undefined],
    ear.math.flatten_arrays([[[undefined, [[undefined]]]]])
  );
});
