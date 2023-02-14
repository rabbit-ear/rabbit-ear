const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

// export const sortPointsAlongVector = (points, vector) => points
// 	.map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
// 	.sort((a, b) => a.d - b.d)
// 	.map(a => a.point);

test("sortPointsAlongVector", () => {
	const points = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	const result = ear.math.sortPointsAlongVector(points, [1, 0]);
	expect(result[0]).toBe(2);
	expect([result[1], result[2]].sort((a, b) => a - b).join(" ")).toBe("1 3");
	expect(result[3]).toBe(0);
});
