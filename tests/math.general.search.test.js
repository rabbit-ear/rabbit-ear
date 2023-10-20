import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("smallestVector2 easy", () => {
	expect(ear.math.smallestVector2()).toBe(undefined);
	expect(ear.math.smallestVector2([])).toBe(undefined);
	expect(ear.math.smallestVector2([[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]])).toBe(0);
	expect(ear.math.smallestVector2([[4, 0], [3, 0], [2, 0], [1, 0], [0, 0]])).toBe(4);
	expect(ear.math.smallestVector2([[2, 0], [1, 0], [0, 0], [4, 0], [3, 0]])).toBe(2);
});

test("smallestVector2 vertically aligned", () => {
	expect(ear.math.smallestVector2([[3, 0], [3, 1], [3, 2], [3, 3], [3, 4]])).toBe(0);
	expect(ear.math.smallestVector2([[3, 1], [3, 2], [3, 3], [3, 4], [3, 0]])).toBe(4);
	expect(ear.math.smallestVector2([[3, 2], [3, 3], [3, 4], [3, 0], [3, 1]])).toBe(3);
	expect(ear.math.smallestVector2([[3, 3], [3, 4], [3, 0], [3, 1], [3, 2]])).toBe(2);
});
