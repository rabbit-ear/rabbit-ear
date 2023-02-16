const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

// no longer a method
test("get_splice_indices", () => {
	expect(true).toBe(true);
	// expect(JSON.stringify(ear.layer
	// 	.get_splice_indices([1, 1, undefined, 1, undefined, -1, -1])))
	// 	.toBe(JSON.stringify([4, 5]));
	// expect(JSON.stringify(ear.layer
	// 	.get_splice_indices([1, 1, undefined, 1, undefined, 1, 1])))
	// 	.toBe(JSON.stringify([7]));
	// expect(JSON.stringify(ear.layer
	// 	.get_splice_indices([-1, -1, undefined, -1, undefined, -1, -1])))
	// 	.toBe(JSON.stringify([0]));
	// expect(JSON.stringify(ear.layer
	// 	.get_splice_indices([1, -1, undefined, -1, undefined, -1, -1])))
	// 	.toBe(JSON.stringify([1]));
	// expect(JSON.stringify(ear.layer
	// 	.get_splice_indices([undefined, -1, undefined, -1, undefined, -1, -1])))
	// 	.toBe(JSON.stringify([0,1]));
	// expect(JSON.stringify(ear.layer
	// 	.get_splice_indices([1, 1, undefined, 1, undefined, 1, -1])))
	// 	.toBe(JSON.stringify([6]));
	// expect(JSON.stringify(ear.layer
	// 	.get_splice_indices([1, -1, undefined, 1, undefined, 1, -1])))
	// 	.toBe(JSON.stringify([]));
});
