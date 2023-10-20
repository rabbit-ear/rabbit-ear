import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("symmetry lines, crane", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane-cp.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const lines = ear.graph.findSymmetryLines(fold);
	const matches = lines.filter(el => el.error < 0.25);
	// should be around 65, but the exact number doesn't really matter here.
	expect(lines.length > 10).toBe(true);
	expect(matches.length).toBe(1);
	expect(ear.math.parallel([1, 1], matches[0].line.vector)).toBe(true);
});

test("symmetry lines, book-symmetry, no collinear edge", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const lines = ear.graph.findSymmetryLines(fold);
	const matches = lines.filter(el => el.error < 0.25);
	// should be around 65, but the exact number doesn't really matter here.

	// why do some lines have error with negative values?
	expect(true).toBe(false);
});

