const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("flatSort", () => {
	const a = [undefined, "b", undefined, undefined, undefined, "f", "g", undefined, "i"];
	const b = [undefined, undefined, 3, undefined, 5, undefined, undefined, 8];
	a.forEach((v, i, arr) => { if (v === undefined) delete arr[i]; });
	b.forEach((v, i, arr) => { if (v === undefined) delete arr[i]; });
	const result = ear.graph.flatSort(a, b);
	const expected = JSON.stringify([null, "b", 3, null, 5, "f", "g", 8, "i"]);
	expect(JSON.stringify(result)).toBe(expected);
});
