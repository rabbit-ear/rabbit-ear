import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("invalid array lengths", () => {
	const fold = fs.readFileSync("./tests/files/fold/invalid-mismatch-length.fold", "utf-8");
	const graph = JSON.parse(fold);
	ear.graph.validateGraph(graph);
	expect(true).toBe(false);
});

test("invalid references", () => {
	const fold = fs.readFileSync("./tests/files/fold/invalid-mismatch-references.fold", "utf-8");
	const graph = JSON.parse(fold);
	ear.graph.validateGraph(graph);
	expect(true).toBe(false);
});
