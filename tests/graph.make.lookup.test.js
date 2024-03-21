import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("makeVerticesToEdge", () => {
	const graph = ear.graph.blintz();
	expect(ear.graph.makeVerticesToEdge(graph)).toMatchObject({
		"0 1": 0,
		"1 2": 1,
		"2 3": 2,
		"3 4": 3,
		"4 5": 4,
		"5 6": 5,
		"6 7": 6,
		"7 0": 7,
		"7 1": 8,
		"1 3": 9,
		"3 5": 10,
		"5 7": 11,
		"1 0": 0,
		"2 1": 1,
		"3 2": 2,
		"4 3": 3,
		"5 4": 4,
		"6 5": 5,
		"7 6": 6,
		"0 7": 7,
		"1 7": 8,
		"3 1": 9,
		"5 3": 10,
		"7 5": 11,
	});
});

test("makeVerticesToFace", () => {
	const graph = ear.graph.blintz();
	const faceMap = ear.graph.makeVerticesToFace(graph);
	expect(faceMap).toMatchObject({
		"1 3": 0,
		"3 5": 0,
		"5 7": 0,
		"7 1": 0,
		"1 7": 1,
		"0 1": 1,
		"7 0": 1,
		"1 2": 2,
		"2 3": 2,
		"3 1": 2,
		"3 4": 3,
		"4 5": 3,
		"5 3": 3,
		"5 6": 4,
		"6 7": 4,
		"7 5": 4,
	});
});

test("makeEdgesToFace", () => {
	const graph = ear.graph.blintz();
	const faceMap = ear.graph.makeEdgesToFace(graph);
	expect(faceMap).toMatchObject({
		"8 9": 0,
		"9 10": 0,
		"10 11": 0,
		"11 8": 0,
		"0 8": 1,
		"7 0": 1,
		"8 7": 1,
		"9 1": 2,
		"1 2": 2,
		"2 9": 2,
		"10 3": 3,
		"3 4": 3,
		"4 10": 3,
		"11 5": 4,
		"5 6": 4,
		"6 11": 4,
	});
});
