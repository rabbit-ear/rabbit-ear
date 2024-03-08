import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

const arraysMatch = (a, b) => a.forEach((_, i) => expect(a[i]).toBe(b[i]));

test("uniqueElements", () => {
	// Test case 1: Array with duplicate elements
	const testArray1 = [1, 2, 3, 4, 4, 5, 5];
	const result1 = ear.general.uniqueElements(testArray1);
	expect(JSON.stringify(result1)).toBe(JSON.stringify([1, 2, 3, 4, 5]));

	// Test case 2: Array with all unique elements
	const testArray2 = [6, 7, 8, 9, 10];
	const result2 = ear.general.uniqueElements(testArray2);
	expect(JSON.stringify(result2)).toBe(JSON.stringify([6, 7, 8, 9, 10]));

	// Test case 3: Array with all duplicate elements
	const testArray3 = [11, 11, 11, 11, 11];
	const result3 = ear.general.uniqueElements(testArray3);
	expect(JSON.stringify(result3)).toBe(JSON.stringify([11]));

	// Test case 4: Array with mixed data types
	const testArray4 = ["a", "b", "c", "b", "d", "a", 1, 2, 3, 2];
	const result4 = ear.general.uniqueElements(testArray4);
	expect(JSON.stringify(result4)).toBe(JSON.stringify(["a", "b", "c", "d", 1, 2, 3]));

	// Test case 5: Array with objects
	const testArray5 = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 1 }];
	const result5 = ear.general.uniqueElements(testArray5);
	expect(JSON.stringify(result5))
		.toBe(JSON.stringify([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 1 }]));
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

test("array intersection", () => {
	arraysMatch([1, 7, 9, 15], ear.general.arrayIntersection(
		[1, 2, 4, 5, 7, 9, 11, 15, 18],
		[19, 15, 14, 12, 9, 7, 3, 1],
	));
	arraysMatch([1, 7, 9, 15, 18], ear.general.arrayIntersection(
		[1, 2, 4, 5, 7, 9, 11, 15, 18],
		[18, 15, 14, 12, 9, 7, 3, 1],
	));
	arraysMatch([7, 9, 15, 18], ear.general.arrayIntersection(
		[0, 1, 2, 4, 5, 7, 9, 11, 15, 18],
		[18, 15, 14, 12, 9, 7, 3],
	));
	arraysMatch([6, 9], ear.general.arrayIntersection(
		[1, 5, 6, 9, 13],
		[16, 9, 6, 4, 2],
	));
	arraysMatch([3, 5, 7, 9], ear.general.arrayIntersection(
		[3, 5, 7, 9],
		[9, 7, 5, 3],
	));
	arraysMatch([3, 5, 7, 9], ear.general.arrayIntersection(
		[3, 5, 7, 9],
		[9, 7, 5, 3, 2],
	));
	arraysMatch([3, 5, 7, 9], ear.general.arrayIntersection(
		[3, 5, 7, 9],
		[11, 9, 7, 5, 3],
	));
	arraysMatch([3, 5, 7, 9], ear.general.arrayIntersection(
		[3, 5, 7, 9, 11],
		[9, 7, 5, 3],
	));
	arraysMatch([3, 5, 7, 9], ear.general.arrayIntersection(
		[2, 3, 5, 7, 9],
		[9, 7, 5, 3],
	));
	arraysMatch([1, 2], ear.general.arrayIntersection(
		[1, 2, 3, 4],
		[0, 1, 2, 6, 7],
	));
	arraysMatch([1, 2, 7], ear.general.arrayIntersection(
		[1, 2, 3, 4, 7],
		[0, 1, 2, 6, 7],
	));
});

test("rotateCircularArray", () => {
	expect(ear.general.rotateCircularArray([0, 1, 2, 3, 4, 5], 2))
		.toMatchObject([2, 3, 4, 5, 0, 1]);

	expect(ear.general.rotateCircularArray([0, 1, 2, 3, 4, 5], -1))
		.toMatchObject([0, 1, 2, 3, 4, 5]);

	expect(ear.general.rotateCircularArray([0, 1, 2, 3, 4, 5], 8))
		.toMatchObject([0, 1, 2, 3, 4, 5]);

	expect(ear.general.rotateCircularArray([0, 1, , , 4, 5], 0))
		.toMatchObject([0, 1, , , 4, 5]);

	expect(ear.general.rotateCircularArray([0, 1, , , 4, 5], 2))
		.toMatchObject([, , 4, 5, 0, 1]);

	expect(ear.general.rotateCircularArray([0, 1, , , 4, 5], 5))
		.toMatchObject([5, 0, 1, , , 4]);
});

test("chooseTwoPairs", () => {

});

test("setDifferenceSortedNumbers", () => {

});

test("setDifferenceSortedEpsilonNumbers", () => {

});

test("arrayMinimumIndex", () => {
	const array1 = [99, 0, 1, , , , 5, 6, 7];
	expect(ear.general.arrayMinimumIndex(array1)).toBe(1);

	const array2 = [99, , , , , , 5, 6, 7];
	expect(ear.general.arrayMinimumIndex(array2)).toBe(6);

	const array3 = [97, 98, 99, , , , , , 5, 6, 7];
	expect(ear.general.arrayMinimumIndex(array3, n => -n)).toBe(2);

	const array4 = [0, 1, 2, , , , , , 99, 98, 97];
	expect(ear.general.arrayMinimumIndex(array4, n => -n)).toBe(8);
});

test("arrayMaximumIndex", () => {

});

test("mergeArraysWithHoles", () => {
	expect(ear.general.mergeArraysWithHoles(
		[0, 1, , , 4, 5],
		[, , 2, 3, , , 6, 7],
	)).toMatchObject([0, 1, 2, 3, 4, 5, 6, 7]);

	expect(ear.general.mergeArraysWithHoles(
		[0, 1, , , 4, 5],
		[, , 2, 3],
	)).toMatchObject([0, 1, 2, 3, 4, 5]);

	expect(ear.general.mergeArraysWithHoles(
		[0, 1, , 4, 5],
		[, 2, 3, , 6, 7],
	)).toMatchObject([0, 2, 3, 4, 6, 7]);

	expect(ear.general.mergeArraysWithHoles(
		[, "b", , , , "f", "g", , "i"],
		[, , 3, , 5, , , 8],
	)).toMatchObject([, "b", 3, , 5, "f", "g", 8, "i"]);
});
