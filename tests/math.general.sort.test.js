const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

const equalTest = (a, b) => expect(JSON.stringify(a))
	.toBe(JSON.stringify(b));

test("sortPointsAlongVector", () => {
	const points = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	const result = ear.math.sortPointsAlongVector(points, [1, 0]);
	expect(result[0]).toBe(2);
	expect([result[1], result[2]].sort((a, b) => a - b).join(" ")).toBe("1 3");
	expect(result[3]).toBe(0);
});

test("clusterIndicesOfSortedNumbers", () => {
	const result = ear.math.clusterIndicesOfSortedNumbers([0, 1, 2, 3, 4, 5]);
	equalTest(result, [[0], [1], [2], [3], [4], [5]]);
	const result1 = ear.math.clusterIndicesOfSortedNumbers([0, 1, 2, 3, 4, 5], 1);
	equalTest(result1, [[0], [1], [2], [3], [4], [5]]);
	const result2 = ear.math.clusterIndicesOfSortedNumbers([0, 1, 2, 3, 4, 5], 1 + ear.math.EPSILON * 2);
	equalTest(result2, [[0, 1, 2, 3, 4, 5]]);
});

test("radialSortPointIndices2", () => {
	equalTest(ear.math.radialSortPointIndices2(), []);

	const result0 = ear.math.radialSortPointIndices2([[1, 0], [0, 1], [-1, 0]]);
	equalTest(result0, [[2], [0], [1]]);
	const result1 = ear.math.radialSortPointIndices2([[0, 1], [-1, 0], [1, 0]]);
	equalTest(result1, [[1], [2], [0]]);
	const result2 = ear.math.radialSortPointIndices2([[-1, 0], [1, 0], [0, 1]]);
	equalTest(result2, [[0], [1], [2]]);

	const result3 = ear.math.radialSortPointIndices2([[1, 0], [0, 1], [-1, 0]], 2);
	equalTest(result3, [[2], [1, 0]]);
	const result4 = ear.math.radialSortPointIndices2([[0, 1], [-1, 0], [1, 0]], 2);
	equalTest(result4, [[1], [0, 2]]);
	const result5 = ear.math.radialSortPointIndices2([[-1, 0], [1, 0], [0, 1]], 2);
	equalTest(result5, [[0], [2, 1]]);
});
