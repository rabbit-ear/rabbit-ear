import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("uniqueElements", () => {

});

test("nonUniqueElements", () => {

});

test("uniqueSortedNumbers", () => {
	const array = Array.from(Array(10000)).map(() => Math.floor(Math.random() * 1000));
	const result = ear.general.uniqueSortedNumbers(array);
	expect(result.length).toBeLessThan(array.length);
});

test("epsilonUniqueSortedNumbers", () => {

});

test("setDifferenceSortedEpsilonNumbers", () => {

});

test("flatSort", () => {
	const a = [undefined, "b", undefined, undefined, undefined, "f", "g", undefined, "i"];
	const b = [undefined, undefined, 3, undefined, 5, undefined, undefined, 8];
	a.forEach((v, i, arr) => { if (v === undefined) delete arr[i]; });
	b.forEach((v, i, arr) => { if (v === undefined) delete arr[i]; });
	const result = ear.general.mergeArraysWithHoles(a, b);
	const expected = JSON.stringify([null, "b", 3, null, 5, "f", "g", 8, "i"]);
	expect(JSON.stringify(result)).toBe(expected);
});

test("splitCircularArray", () => {

});

test("connectedComponentsPairs", () => {

});

test("clusterSortedGeneric", () => {

});

test("clusterScalars", () => {
	ear.general.clusterScalars([1, 2, 3, 6, 9, 13, 14, 15, 19, 21, 25, 26, 27], 1.5);
});

test("clusterScalars with holes", () => {
	const array = [1, 2, 3, 8, 9, 13, 14, 15, 19, 21, 25, 26, 27];
	delete array[0];
	delete array[1];
	delete array[7];
	delete array[13];
	ear.general.clusterScalars(array, 1.5);
});

test("clusterParallelVectors", () => {

});

test("chooseTwoPairs", () => {

});
