const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

const equalTest = (a, b) => expect(JSON.stringify(a))
	.toBe(JSON.stringify(b));

test("getVector", () => {
	equalTest(
		[1, 2, 3, 4],
		ear.math.getVector([[[1, 2, 3, 4]]]),
	);
	equalTest(
		[1, 2, 3, 4],
		ear.math.getVector(1, 2, 3, 4),
	);
	equalTest(
		[1, 2, 3, 4, 2, 4],
		ear.math.getVector([1, 2, 3, 4], [2, 4]),
	);
	equalTest(
		[1, 2, 3, 4, 6, 7, 6],
		ear.math.getVector([1, 2, 3, 4], [6, 7], 6),
	);
	equalTest(
		[1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
		ear.math.getVector([1, 2, 3, 4], [6, 7], 6, 2, 4, 5),
	);
	equalTest(
		[5, 3],
		ear.math.getVector({ x: 5, y: 3 }),
	);
	equalTest(
		[5, 3],
		ear.math.getVector([[[{ x: 5, y: 3 }]]]),
	);
	equalTest(
		[5, 3],
		ear.math.getVector([[[5, 3]]]),
	);
	equalTest(
		[5, 3],
		ear.math.getVector([[[5], [3]]]),
	);
	equalTest(
		[5, 3],
		ear.math.getVector([[[5]], [[3]]]),
	);
	equalTest(
		[5, 3],
		ear.math.getVector([[[5]]], [[[3]]]),
	);
	equalTest(
		[5, 3],
		ear.math.getVector([[[5]]], 3),
	);
});

test("getLine", () => {
	equalTest(ear.math.getLine(1), { vector: [1], origin: [] });
	equalTest(ear.math.getLine(1, 2), { vector: [1, 2], origin: [] });
	equalTest(ear.math.getLine(1, 2, 3), { vector: [1, 2, 3], origin: [] });
	equalTest(ear.math.getLine([1], [2]), { vector: [1], origin: [2] });
	equalTest(ear.math.getLine([1, 2], [2, 3]), { vector: [1, 2], origin: [2, 3] });
	equalTest(ear.math.getLine(), { vector: [], origin: [] });
	equalTest(ear.math.getLine({}), { vector: [], origin: [] });
	equalTest(
		ear.math.getLine({ vector: [1], origin: [2] }),
		{ vector: [1], origin: [2] },
	);
	equalTest(
		ear.math.getLine({ vector: [1, 2], origin: [2, 3] }),
		{ vector: [1, 2], origin: [2, 3] },
	);
	equalTest(
		ear.math.getLine({ vector: [1] }),
		{ vector: [1], origin: [] },
	);
	// "getLine" only looks for a "vector" key,
	// this will result in an empty object
	equalTest(
		ear.math.getLine({ origin: [1] }),
		{ vector: [], origin: [] },
	);
});

test("getVectorOfVectors", () => {
	equalTest(
		[[1, 2], [3, 4]],
		ear.math.getVectorOfVectors({ x: 1, y: 2 }, { x: 3, y: 4 }),
	);
	equalTest(
		[[1, 2], [3, 4]],
		ear.math.getVectorOfVectors([[[{ x: 1, y: 2 }, { x: 3, y: 4 }]]]),
	);
	equalTest(
		[[1, 2], [3, 4]],
		ear.math.getVectorOfVectors([[[1, 2], [3, 4]]]),
	);
	equalTest(
		[[1, 2], [3, 4]],
		ear.math.getVectorOfVectors([[[1, 2]], [[3, 4]]]),
	);
	equalTest(
		[[1, 2], [3, 4]],
		ear.math.getVectorOfVectors([[[1, 2]]], [[[3, 4]]]),
	);
	equalTest(
		[[1], [2], [3], [4]],
		ear.math.getVectorOfVectors([[[1], [2], [3], [4]]]),
	);
	equalTest(
		[[1], [2], [3], [4]],
		ear.math.getVectorOfVectors([[[1]], [[2]], [[3]], [[4]]]),
	);
	equalTest(
		[[1], [2], [3], [4]],
		ear.math.getVectorOfVectors([[[1]]], 2, 3, 4),
	);
	equalTest(
		[[1], [2], [3], [4]],
		ear.math.getVectorOfVectors([[[1, 2, 3, 4]]]),
	);
});

test("getSegment", () => {
	equalTest([[1, 2], [3, 4]], ear.math.getSegment(1, 2, 3, 4));
	equalTest([[1, 2], [3, 4]], ear.math.getSegment([1, 2], [3, 4]));
	equalTest([[1, 2], [3, 4]], ear.math.getSegment([1, 2, 3, 4]));
	equalTest([[1, 2], [3, 4]], ear.math.getSegment([[1, 2], [3, 4]]));
});

// test("get_matrix2", () => {
//   equalTest(
//     [1, 2, 3, 4, 5, 6],
//     ear.math.get_matrix2([[[1, 2, 3, 4, 5, 6]]])
//   );
//   equalTest(
//     [1, 2, 3, 4, 0, 0],
//     ear.math.get_matrix2([[1, 2, 3, 4]])
//   );
//   equalTest(
//     [1, 2, 3, 1, 0, 0],
//     ear.math.get_matrix2(1, 2, 3)
//   );
//   equalTest(
//     [1, 2, 3, 1, 0, 0],
//     ear.math.get_matrix2(1, 2, 3, 1)
//   );
// });

test("getMatrix3x4", () => {
	equalTest(
		[1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
		ear.math.getMatrix3x4([[[]]]),
	);
	equalTest(
		[1, 2, 0, 3, 4, 0, 0, 0, 1, 0, 0, 0],
		ear.math.getMatrix3x4([[[1, 2, 3, 4]]]),
	);
	equalTest(
		[1, 2, 0, 3, 4, 0, 0, 0, 1, 5, 6, 0],
		ear.math.getMatrix3x4([[[1, 2, 3, 4, 5, 6]]]),
	);
	equalTest(
		[1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0],
		ear.math.getMatrix3x4([[[1, 2, 3, 4, 5, 6, 7, 8, 9]]]),
	);
});
