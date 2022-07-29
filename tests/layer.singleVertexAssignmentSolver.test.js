const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear");

// test("solver", () => {
// 	const sectors = [12, 11, 6, 2, 3, 4, 5, 9];
// 	const assignments = ["V", "V", "V", "M", "V", "V", "M", "M"];
// 	ear.layer.singleVertexSolver(sectors, assignments);
// });

test("layer solver, simple staircase", () => {
	// one solution
	const res = ear.layer.singleVertexAssignmentSolver([3, 2, 3, 2, 3], Array.from("BVUUMB"));
	expect(res.length).toBe(1);

	// two solutions
	const res1 = ear.layer.singleVertexAssignmentSolver([3, 2, 3, 2, 3], Array.from("BVUUUB"));
	expect(res1.length).toBe(2);

	// two solutions
	const res2 = ear.layer.singleVertexAssignmentSolver([3, 2, 3, 2, 3], Array.from("BUUUMB"));
	expect(res2.length).toBe(2);

	// four solutions
	const res3 = ear.layer.singleVertexAssignmentSolver([3, 2, 3, 2, 3], Array.from("BUUUUB"));
	expect(res3.length).toBe(4);
});
