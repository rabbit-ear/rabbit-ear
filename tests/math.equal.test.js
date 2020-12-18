const ear = require("../rabbit-ear");

/**
 * queries
 */
test("equivalent", () => {
  expect(ear.math.equivalent(4, 4, 4)).toBe(true);
  expect(ear.math.equivalent(4, 4, 5)).toBe(false);
  expect(ear.math.equivalent([0], [0], [0])).toBe(true);
  // equivalent is permissive with trailing zeros
  expect(ear.math.equivalent([0], [0, 0], [0])).toBe(true);
  expect(ear.math.equivalent([1], [1, 0], [1])).toBe(true);
  // should be false
  expect(ear.math.equivalent([0], [0, 1], [0])).toBe(false);
  expect(ear.math.equivalent([0], [0], [1])).toBe(false);
  expect(ear.math.equivalent([1], [0], [1])).toBe(false);
  // epsilon
  expect(ear.math.equivalent(1, 1, 0.99999999999)).toBe(true);
  expect(ear.math.equivalent([1], [1], [0.99999999999])).toBe(true);
  expect(ear.math.equivalent([1], [1, 1], [1])).toBe(false);
  expect(ear.math.equivalent(true, true, true, true)).toBe(true);
  expect(ear.math.equivalent(false, false, false, false)).toBe(true);
  expect(ear.math.equivalent(false, false, false, true)).toBe(false);
});

// // equivalency has not yet been made to work with other types.
// // inside the equivalent function, it calls equivalent_vectors which calls
// // get_vector_of_vectors, which is forcing the removal of data that isn't a number
// test("equivalent with strings", () => {
//   expect(ear.math.equivalent("hi", "hi", "hi")).toBe(true);
//   expect(ear.math.equivalent("hi", "hi", "bye")).toBe(false);
//   expect(ear.math.equivalent(["hi", "hi"], ["hi", "hi", "hi"])).toBe(false);
// });

test("equivalent with functions", () => {
  expect(ear.math.equivalent(() => {}, () => {})).toBe(undefined);
});

test("equivalent with objects", () => {
  expect(ear.math.equivalent({hi: 5}, {hi: 5})).toBe(true);
  expect(ear.math.equivalent({hi: 5}, {hello: 5})).toBe(false);
});

test("equivalent numbers", () => {
  expect(ear.math.equivalent_numbers()).toBe(false);
  expect(ear.math.equivalent_numbers([[[1, 1, 1, 1, 1]]])).toBe(true);
  expect(ear.math.equivalent_numbers([[[1, 1, 1, 1, 1, 4]]])).toBe(false);
  expect(ear.math.equivalent_numbers([1, 1, 1, 1, 1, 1], [1, 2])).toBe(false);
});

test("equivalent vectors", () => {
	const smEp = ear.math.EPSILON / 10; // smaller than epsilon
	const bgEp = ear.math.EPSILON * 10; // larger than epsilon
	expect(ear.math.equivalent_vectors([1, 2, 3], [1, 2, 3])).toBe(true);
	expect(ear.math.equivalent_vectors([1, 2 + smEp], [1, 2 - smEp])).toBe(true);
	expect(ear.math.equivalent_vectors([1, 2 + bgEp], [1, 2 - bgEp])).toBe(false);
});


