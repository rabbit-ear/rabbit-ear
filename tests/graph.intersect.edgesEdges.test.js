const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("overlapping and parallel should have no intersection", () => {
	// overlapping parallel edges should be ignored
	expect(ear.graph.getEdgesEdgesIntersection(ear.origami.fish().flatFolded()).length)
		.toBe(0);
	expect(ear.graph.makeEdgesEdgesCrossing(ear.origami.fish().flatFolded()).flat().length)
		.toBe(0);
});

test("", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/kraft-bird-base.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const origami = ear.origami(graph);
	const folded = origami.flatFolded();
	console.time("new");
	const res1 = ear.graph.getEdgesEdgesIntersection(folded)
		.map(arr => arr.map((_, i) => i).filter(() => true));
	console.timeEnd("new");
	console.time("old");
	const res2 = ear.graph.makeEdgesEdgesCrossing(folded);
	console.timeEnd("old");
	console.log(res1.flat().length, res2.flat().length);
	// console.log(res2.flat());
	// console.log(res1);
});

//         [ 258, 259, 270, 271, 405, 433 ],
//         [ 258, 259, 270, 271, 405, 433 ],
//         [
//            88,  89, 210, 211,
//           342, 351, 419, 449,
//           476, 501
//         ],
//         [
//            88,  89, 210, 211,
//           342, 351, 419, 449,
//           476, 501
//         ],
//         [
//           55,  56,  88,  89,  90,
//           91, 306, 313, 419, 449
//         ],



//         [ 258, 259, 270, 271, 405, 433 ],
//         [ 258, 259, 270, 271, 405, 433 ],
//         [
//            88,  89,  94,  95, 210,
//           211, 342, 351, 419, 449,
//           476, 501
//         ],
//         [
//            88,  89,  94,  95, 210,
//           211, 342, 351, 419, 449,
//           476, 501
//         ],
//         [
//           55,  56,  88,  89,  90,
//           91, 306, 313, 419, 449
//         ],
//         [
//           55,  56,  88,  89,  90,
//           91, 306, 313, 419, 449
//         ],

// [0.6789321881345255,1.0177669529663727], [0.5753787975412497,0.974873734152913]

// [0.5753787975412522,0.8890872965260213], [0.6360389693210793,1.0355339059327426]
