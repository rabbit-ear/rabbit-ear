const { test, expect } = require("@jest/globals");
const fs = require("fs");
const ear = require("../rabbit-ear");

test("keys", () => {
	// expect(ear.graph.file_spec).toBe(1.1)
	// expect(ear.graph.keys.length).toBe(30);
	// expect(ear.graph.file_creator).toBe("Rabbit Ear");
});

test("edgeAssignmentToFoldAngle", () => {
	expect(ear.graph.edgeAssignmentToFoldAngle("")).toBe(0);
	// every letter besides "m", "v"
	"abcdefghijklnopqrstuwxyzABCDEFGHIJKLNOPQRSTUWXYZ.!@#$%^&*(){}[]-=_+"
		.split("")
		.forEach(ch => expect(ear.graph.edgeAssignmentToFoldAngle(ch))
			.toBe(0));
	expect(ear.graph.edgeAssignmentToFoldAngle("v")).toBe(180);
	expect(ear.graph.edgeAssignmentToFoldAngle("V")).toBe(180);
	expect(ear.graph.edgeAssignmentToFoldAngle("m")).toBe(-180);
	expect(ear.graph.edgeAssignmentToFoldAngle("M")).toBe(-180);
});

const key_test = {
	test: 0,
	testtest: 0,
	test_: 0,
	_test: 0,
	aaatestaaa: 0,
	aaatest: 0,
	testaaa: 0,
	test_test_test: 0,
	test_aaa: 0,
	aaa_test: 0,
	_test_test_test_: 0,
};

test("filterKeysWithSuffix", () => {
	const result = ear.graph.filterKeysWithSuffix(key_test, "test");
	expect(result.length).toBe(6);
});

test("filterKeysWithPrefix", () => {
	const result = ear.graph.filterKeysWithPrefix(key_test, "test");
	expect(result.length).toBe(6);
});

test("getGraphKeysWithPrefix", () => {
	const result = ear.graph.getGraphKeysWithPrefix(key_test, "test");
	expect(result.length).toBe(3);
});

test("getGraphKeysWithSuffix", () => {
	const result = ear.graph.getGraphKeysWithSuffix(key_test, "test");
	expect(result.length).toBe(3);
});

test("transposeGraphArrays", () => {
	const craneString = fs.readFileSync("./tests/files/crane.fold", "utf-8");
	const crane = JSON.parse(craneString);
	const result = ear.graph.transposeGraphArrays(crane, "edges");
	expect(result.length).toBe(crane.edges_vertices.length);
	expect(result[0].edges_vertices.length).toBe(2);
	expect(result[0].edges_assignment.length).toBe(1); // string, "M" or "V" or something
	// no key
	expect(ear.graph.transposeGraphArrays(crane, "nokey").length)
		.toBe(0);
});

test("transposeGraphArrayAtIndex", () => {
	const craneString = fs.readFileSync("./tests/files/crane.fold", "utf-8");
	const crane = JSON.parse(craneString);
	const result = ear.graph.transposeGraphArrayAtIndex(crane, "edges", 10);
	expect(result.edges_vertices.length).toBe(2);
	expect(result.edges_assignment.length).toBe(1); // string, "M" or "V" or something
	// no key
	expect(ear.graph.transposeGraphArrayAtIndex(crane, "nokey", 0))
		.toBe(undefined);
});
