import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("valid", () => {
	const results = [
		"disjoint-triangles-3d.fold",
		"box-pleat-3d-invalid.fold",
		"two-bird-cp.fold",
		"kissing-squares.fold",
	].map(filename => `./tests/files/fold/${filename}`)
		.map(path => fs.readFileSync(path, "utf-8"))
		.map(contents => JSON.parse(contents))
		.flatMap(graph => ear.graph.validate(graph));
	expect(results.length).toBe(0);
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
