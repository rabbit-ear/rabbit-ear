import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("excluding primitives", () => expect(true).toBe(true));

// test("vector", () => {
// 	const v = JSON.stringify(ear.math.vector(1, 2, 3));
// 	expect(v).toBe(`{"0":1,"1":2,"2":3,"length":3}`);
// });

// test("circle", () => {
// 	const c = JSON.stringify(ear.math.circle(1, 2, 3));
// 	expect(c).toBe(`{"radius":3,"origin":{"0":1,"1":2,"length":2}}`);
// });
