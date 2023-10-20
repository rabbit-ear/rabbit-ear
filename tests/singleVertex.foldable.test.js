import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("verticesFoldable", () => {
	const testfile = fs.readFileSync("./tests/files/fold/box-pleat-3d-invalid.fold", "utf-8");
	const graph = JSON.parse(testfile);
	const verts = ear.singleVertex.verticesFoldable(graph);
	const expected = [
		true, true, true, true, true, true, true, false, true, true, true, true,
	];
	expected.forEach((valid, i) => expect(verts[i]).toBe(valid));
});
