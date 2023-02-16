const { test, expect } = require("@jest/globals");
const fs = require("fs");
const ear = require("../rabbit-ear.js");

// tree object is an array inside an array, looks like:
// [
//   [ { face: 0 } ],
//   [
//     { face: 1, parent: 0, edge_vertices: [Array] },
//     { face: 2, parent: 0, edge_vertices: [Array] },
//     { face: 5, parent: 0, edge_vertices: [Array] }
//   ],
//   [
//     { face: 3, parent: 1, edge_vertices: [Array] },
//     { face: 38, parent: 1, edge_vertices: [Array] },
//     { face: 39, parent: 1, edge_vertices: [Array] },
//     { face: 4, parent: 2, edge_vertices: [Array] },
//     { face: 11, parent: 5, edge_vertices: [Array] },
//     { face: 20, parent: 5, edge_vertices: [Array] }
//   ],
//   ...
// ]

test("face walk tree, crane", () => {
	const craneJSON = fs.readFileSync("./tests/files/crane.fold");
	const crane = JSON.parse(craneJSON);

	const startingFace = 0;
	const tree = ear.graph.makeFaceSpanningTree(crane, startingFace);

	expect(tree[0].length).toBe(1);
	expect(tree[1].length).toBe(3);
	expect(tree[2].length).toBe(6);
	expect(tree[3].length).toBe(7);
	expect(tree[4].length).toBe(7);
	expect(tree[5].length).toBe(8);
	expect(tree[6].length).toBe(9);
	expect(tree[7].length).toBe(10);
	expect(tree[8].length).toBe(7);
	expect(tree[9].length).toBe(1);

	// test that every face and edge was only ever visited once
	const uniqueFace = {};
	uniqueFace[startingFace] = true;
	tree.slice(1).forEach(level => level
		.forEach(el => {
			expect(uniqueFace[el.parent]).toBe(true);
			expect(uniqueFace[el.face]).toBe(undefined);
			uniqueFace[el.face] = true;
		}));

	// try to check edges vertices data
	tree.slice(1)
		.forEach(level => level
			.forEach(el => expect(el.edge_vertices.length).toBe(2)));
});

test("face walk tree, no param", (done) => {
	try {
		ear.graph.makeFaceSpanningTree();
	} catch (error) {
		expect(error).not.toBe(undefined);
		done();
	}
});

test("face walk tree, empty graph", (done) => {
	try {
		ear.graph.makeFaceSpanningTree({});
	} catch (error) {
		expect(error).not.toBe(undefined);
		done();
	}
});

test("face walk tree, empty graph", () => {
	const result = ear.graph.makeFaceSpanningTree({
		edges_vertices: [],
		faces_vertices: [],
	});
	expect(result.length).toBe(0);
});

test("face walk tree, no edges_vertices", () => {
	const result = ear.graph.makeFaceSpanningTree({
		faces_vertices: [[0, 1, 3], [2, 3, 1]],
	});
	expect(result.length).toBe(2);
	expect(result[1].length).toBe(1);
	expect(result[1][0].face).toBe(1);
	expect(result[1][0].parent).toBe(0);
	// this edge order: [3, 1] needs to match order of these indices in
	// the second face. 3, then 1.
	expect(result[1][0].edge_vertices[0]).toBe(3);
	expect(result[1][0].edge_vertices[1]).toBe(1);
});

test("face walk tree, empty edges_vertices. same as test above", () => {
	const result = ear.graph.makeFaceSpanningTree({
		edges_vertices: [],
		faces_vertices: [[0, 1, 3], [2, 3, 1]],
	});
	expect(result.length).toBe(2);
	expect(result[1].length).toBe(1);
	expect(result[1][0].face).toBe(1);
	expect(result[1][0].parent).toBe(0);
	// this edge order: [3, 1] needs to match order of these indices in
	// the second face. 3, then 1.
	expect(result[1][0].edge_vertices[0]).toBe(3);
	expect(result[1][0].edge_vertices[1]).toBe(1);
});

test("face walk tree, empty edges_vertices. same as test above", () => {
	const result = ear.graph.makeFaceSpanningTree({
		edges_vertices: [],
		faces_vertices: [[0, 1, 3], [2, 3, 1]],
	});
	expect(result.length).toBe(2);
	expect(result[1].length).toBe(1);
	expect(result[1][0].face).toBe(1);
	expect(result[1][0].parent).toBe(0);
	// this edge order: [3, 1] needs to match order of these indices in
	// the second face. 3, then 1.
	expect(result[1][0].edge_vertices[0]).toBe(3);
	expect(result[1][0].edge_vertices[1]).toBe(1);
});

test("face walk tree, finding an edge match. bad edge formations", () => {
	// good edge
	const result0 = ear.graph.makeFaceSpanningTree({
		edges_vertices: [[1, 3]],
		faces_vertices: [[0, 1, 3], [2, 3, 1]],
	});
	expect(result0[1][0].edge_vertices[0]).toBe(3);
	expect(result0[1][0].edge_vertices[1]).toBe(1);

	// bad edge formation
	const result1 = ear.graph.makeFaceSpanningTree({
		edges_vertices: [[3, 1, 0]],
		faces_vertices: [[0, 1, 3], [2, 3, 1]],
	});
	expect(result1[1][0].edge_vertices[0]).toBe(3);
	expect(result1[1][0].edge_vertices[1]).toBe(1);
	const result2 = ear.graph.makeFaceSpanningTree({
		edges_vertices: [[3, 0, 1]],
		faces_vertices: [[0, 1, 3], [2, 3, 1]],
	});
	expect(result2[1][0].edge_vertices[0]).toBe(3);
	expect(result2[1][0].edge_vertices[1]).toBe(1);
});
