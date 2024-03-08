import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("clusterSortedGeneric", () => {

});

test("clusterScalars", () => {
	expect(ear.general.clusterScalars([1, 2, 3, 6, 9, 13, 14, 15, 19, 21, 25, 26, 27], 1.5))
		.toMatchObject([[0, 1, 2], [3], [4], [5, 6, 7], [8], [9], [10, 11, 12]]);

	expect(ear.general.clusterScalars([, , 3, 8, 9, 13, 14, , 19, 21, 25, 26, 27], 1.5))
		.toMatchObject([[2], [3, 4], [5, 6], [8], [9], [10, 11, 12]]);
});

test("clusterParallelVectors", () => {

});
