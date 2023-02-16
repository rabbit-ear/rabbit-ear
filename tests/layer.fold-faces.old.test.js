const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

// test("foldStripWithAssignments, 4-vertex all permutations of boundaries", () => {
// 	const res1 = [], res2 = [], res3 = [], res4 = [];
// 	// no boundary
// 	res4.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("MMMM")));

// 	// one boundary: all resulting in 4
// 	res4.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("BMMM")));
// 	res4.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("MBMM")));
// 	res4.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("MMBM")));
// 	res4.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("MMMB")));

// 	// two boundaries
// 	// face 0 surrounded by boundaries
// 	res1.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("BBMM")));
// 	// face 0 and 1 surrounded
// 	res2.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("BMBM")));
// 	// face 0, 1, 2 connected
// 	res3.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("BMMB")));
// 	// face 0, connected to ends: 2, 3
// 	res3.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("MBBM")));
// 	// face 0 and 3 connected wrap around
// 	res2.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("MBMB")));
// 	// face 0 and 1, and wrap around to 3
// 	res3.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("MMBB")));

// 	// three boundaries
// 	// face 0 and 3 connected
// 	res2.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("MBBB")));
// 	// face 0 and 1
// 	res2.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("BMBB")));
// 	// isolated faces
// 	res1.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("BBMB")));
// 	res1.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("BBBM")));

// 	// four boundaries
// 	// isolated face
// 	res1.push(ear.layer.foldStripWithAssignments(
// 		[2, 2, 2, 2],
// 		Array.from("BBBB")));

// 	res1.forEach(el => expect(el.reduce((a, b) => a + 1, 0)).toBe(1));
// 	res2.forEach(el => expect(el.reduce((a, b) => a + 1, 0)).toBe(2));
// 	res3.forEach(el => expect(el.reduce((a, b) => a + 1, 0)).toBe(3));
// 	res4.forEach(el => expect(el.reduce((a, b) => a + 1, 0)).toBe(4));
// });

test("foldStripWithAssignments, 8-vertex", () => {
	const res1 = ear.layer.foldStripWithAssignments(
		[2, 2, 2, 2, 2, 2, 2, 2],
		Array.from("MVBMFBFM"),
	);
	expect(res1.filter(a => a !== undefined).length).toBe(2);

	const res2 = ear.layer.foldStripWithAssignments(
		[2, 2, 2, 2, 2, 2, 2, 2],
		Array.from("MVMVBBBB"),
	);
	expect(res2.filter(a => a !== undefined).length).toBe(4);
});

// test("sectors_layer", () => {
// 	ear.vertex.sectors_layer(
// 		[2, 2, 2, 2],
// 		Array.from("MVBB"));
// 	ear.vertex.sectors_layer(
// 		[2, 2, 2, 2],
// 		Array.from("BMVB"));
// 	expect(true).toBe(true);
// });

// test("", () => {
// 	const res1 = ear.vertex.sectors_layer(
// 		[2, 2, 2, 2, 2, 2, 2, 2],
// 		Array.from("MVMVBBBB"));
// 	expect(res1.reduce((a,b) => a + 1, 0)).toBe(5);
// });
