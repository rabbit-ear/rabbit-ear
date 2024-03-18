import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("valid", () => {
	const graphsViolations = [
		"disjoint-triangles-3d.fold",
		"two-bird-cp.fold",
	].map(filename => `./tests/files/fold/${filename}`)
		.map(path => fs.readFileSync(path, "utf-8"))
		.map(contents => JSON.parse(contents))
		.map(graph => ear.graph.validate(graph));

	graphsViolations
		.forEach(violations => expect(violations.length).toBe(0));
})

test("winding order violations", () => {
	const graphsViolations = [
		"invalid-box-pleat-3d.fold",
		"kissing-squares.fold",
	].map(filename => `./tests/files/fold/${filename}`)
		.map(path => fs.readFileSync(path, "utf-8"))
		.map(contents => JSON.parse(contents))
		.map(graph => ear.graph.validate(graph));

	const graphsNonWindingViolations = graphsViolations
		.map(violations => violations
			.filter(str => str.substring(0, 8) !== "windings"));

	graphsViolations
		.forEach(violations => expect(violations.length).not.toBe(0));
	graphsNonWindingViolations
		.forEach(violations => expect(violations.length).toBe(0));
});

test("invalid array lengths", () => {
	const fold = fs.readFileSync("./tests/files/fold/invalid-mismatch-length.fold", "utf-8");
	const graph = JSON.parse(fold);
	const result = ear.graph.validate(graph);
	expect(result.length).toBe(2);
});

test("invalid references", () => {
	const fold = fs.readFileSync("./tests/files/fold/invalid-mismatch-references.fold", "utf-8");
	const graph = JSON.parse(fold);
	const result = ear.graph.validate(graph);
	expect(result.length).toBe(1);
});
