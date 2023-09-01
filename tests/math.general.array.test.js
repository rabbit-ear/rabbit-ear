const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("removed", () => expect(true).toBe(true));

// const equalTest = (a, b) => expect(JSON.stringify(a))
// 	.toBe(JSON.stringify(b));

// /**
//  * inputs and argument inference
//  */
// test("semiFlattenArrays", () => {
// 	equalTest(
// 		[[0, 1, 2], [2, 3, 4]],
// 		ear.math.semiFlattenArrays([0, 1, 2], [2, 3, 4]),
// 	);
// 	equalTest(
// 		[[0, 1, 2], [2, 3, 4]],
// 		ear.math.semiFlattenArrays([[0, 1, 2]], [[2, 3, 4]]),
// 	);
// 	equalTest(
// 		[[0, 1, 2], [2, 3, 4]],
// 		ear.math.semiFlattenArrays([[[0, 1, 2]], [[2, 3, 4]]]),
// 	);
// 	equalTest(
// 		[[0, 1, 2], [2, 3, 4]],
// 		ear.math.semiFlattenArrays([[[[0, 1, 2]], [[2, 3, 4]]]]),
// 	);
// 	equalTest(
// 		[[[0], [1], [2]], [2, 3, 4]],
// 		ear.math.semiFlattenArrays([[[[0], [1], [2]]], [[2, 3, 4]]]),
// 	);
// 	equalTest(
// 		[[[0], [1], [2]], [2, 3, 4]],
// 		ear.math.semiFlattenArrays([[[[[[0]]], [[[1]]], [2]]], [[2, 3, 4]]]),
// 	);
// 	equalTest(
// 		[{ x: 5, y: 3 }],
// 		ear.math.semiFlattenArrays({ x: 5, y: 3 }),
// 	);
// 	equalTest(
// 		[{ x: 5, y: 3 }],
// 		ear.math.semiFlattenArrays([[[{ x: 5, y: 3 }]]]),
// 	);
// 	equalTest(
// 		[5, 3],
// 		ear.math.semiFlattenArrays([[[5, 3]]]),
// 	);
// 	equalTest(
// 		[[5], [3]],
// 		ear.math.semiFlattenArrays([[[5], [3]]]),
// 	);
// 	equalTest(
// 		[[5], [3]],
// 		ear.math.semiFlattenArrays([[[5]], [[3]]]),
// 	);
// 	equalTest(
// 		[[5], [3]],
// 		ear.math.semiFlattenArrays([[[5]]], [[[3]]]),
// 	);
// });

// test("flattenArrays", () => {
// 	equalTest(
// 		[1],
// 		ear.math.flattenArrays([[[1]], []]),
// 	);
// 	equalTest(
// 		[1, 2, 3, 4],
// 		ear.math.flattenArrays([[[1, 2, 3, 4]]]),
// 	);
// 	equalTest(
// 		[1, 2, 3, 4],
// 		ear.math.flattenArrays(1, 2, 3, 4),
// 	);
// 	equalTest(
// 		[1, 2, 3, 4, 2, 4],
// 		ear.math.flattenArrays([1, 2, 3, 4], [2, 4]),
// 	);
// 	equalTest(
// 		[1, 2, 3, 4, 6, 7, 6],
// 		ear.math.flattenArrays([1, 2, 3, 4], [6, 7], 6),
// 	);
// 	equalTest(
// 		[1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
// 		ear.math.flattenArrays([1, 2, 3, 4], [6, 7], 6, 2, 4, 5),
// 	);
// 	equalTest(
// 		[{ x: 5, y: 3 }],
// 		ear.math.flattenArrays({ x: 5, y: 3 }),
// 	);
// 	equalTest(
// 		[{ x: 5, y: 3 }],
// 		ear.math.flattenArrays([[{ x: 5, y: 3 }]]),
// 	);
// 	equalTest(
// 		[1, 2, 3, 4, 5, 6],
// 		ear.math.flattenArrays([[[1], [2, 3]]], 4, [5, 6]),
// 	);
// 	equalTest(
// 		[undefined, undefined],
// 		ear.math.flattenArrays([[[undefined, [[undefined]]]]]),
// 	);
// });
