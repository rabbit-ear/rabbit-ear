import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("radialSortUnitVectors2", () => {
	const vectors = [
		[1, 0.5],
		[1, 1.5],
		[1, -1.5],
		[-1, -1.5],
		[-2, -5],
		[-2, 5],
		[-2, 2.2],
		[-2, 1],
		[2, -1.2],
	].map(ear.math.normalize);
	const result = ear.general.radialSortUnitVectors2(vectors);
	expect(JSON.stringify(result))
		.toBe(JSON.stringify([0, 1, 5, 6, 7, 3, 4, 2, 8]));
});
