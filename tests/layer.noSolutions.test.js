import { expect, test } from "vitest";
import fs from "fs";
import ear from "../src/index.js";
import Messages from "../src/environment/messages.js";

/**
 * @description Build a flat-folded strip of paper, one unit tall, where
 * each panel is folded on top of the previous. Every panel begins at x=0,
 * so panels of different lengths overlap each other by different amounts.
 * @param {number[]} lengths the length of each panel, left to right
 * @param {string[]} assignments the assignment of each crease between
 * panels, one fewer than the number of panels.
 * @returns {FOLD} a FOLD object with folded vertices_coords
 */
const makeFoldedStrip = (lengths, assignments) => {
	const count = lengths.length;
	const xs = [0];
	lengths.forEach((length) => xs.push(xs[xs.length - 1] + length));
	// bottom row of vertices are 0...count, top row are count+1...2*count+1
	const vertices_coords = [...xs.map((x) => [x, 0]), ...xs.map((x) => [x, 1])];
	const top = count + 1;
	const edges_vertices = [];
	const edges_assignment = [];
	for (let i = 0; i < count; i += 1) {
		edges_vertices.push([i, i + 1], [top + i, top + i + 1]);
		edges_assignment.push("B", "B");
	}
	edges_vertices.push([0, top], [count, top + count]);
	edges_assignment.push("B", "B");
	assignments.forEach((assignment, i) => {
		edges_vertices.push([i + 1, top + i + 1]);
		edges_assignment.push(assignment);
	});
	const faces_vertices = lengths.map((_, i) => [i, i + 1, top + i + 1, top + i]);
	const graph = ear.graph.populate({
		vertices_coords,
		edges_vertices,
		edges_assignment,
		faces_vertices,
	});
	return {
		...graph,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(graph),
	};
};

/**
 * @description Walk a layer solution tree and count every "branches"
 * group which contains no options. A valid solution tree has none.
 * @param {LayerSolverSolution} solution
 * @returns {number}
 */
const countEmptyGroups = ({ branches }) =>
	branches === undefined
		? 0
		: branches
				.map((group) =>
					group.length === 0 ? 1 : group.map(countEmptyGroups).reduce((a, b) => a + b, 0),
				)
				.reduce((a, b) => a + b, 0);

test("strip with four solutions, choosing a solution", () => {
	const folded = makeFoldedStrip([2, 3, 3, 3, 2, 1, 2], ["V", "V", "V", "V", "M", "V"]);
	const solution = ear.layer(folded);

	// the solution is a tree. "orders" are true for every solution,
	// "branches" is a list of groups, a solution chooses one fork from
	// every group, each fork may contain more groups of its own.
	// here, one top-level group with two forks:
	// - the first fork contains one group with two forks.
	// - the second fork contains one group with one fork, which contains one
	//   group with one fork, which contains one group with two forks.
	expect(solution.leaves()).toMatchObject([
		[[["leaf", "leaf"]], [[[[[["leaf", "leaf"]]]]]]],
	]);

	// the solver explores some guesses which turn out to be dead ends.
	// these are removed, no group in the tree is left without options.
	expect(countEmptyGroups(solution)).toBe(0);

	// compile() with no arguments chooses the first fork in every group.
	// the result is a FOLD faceOrders array, [face, face, side]
	const first = solution.compile();
	expect(first).toEqual(solution.compile(0, 0));
	expect(first.every((order) => order.length === 3)).toBe(true);

	// faceOrders() is the same as compile(), the more descriptive name.
	expect(solution.faceOrders()).toEqual(first);

	// choose a fork in each group by index, one index for each group visited
	// in depth-first order, any unspecified group chooses its first fork (0).
	const chosen = [
		solution.compile(0, 0),
		solution.compile(0, 1),
		solution.compile(1, 0, 0, 0),
		solution.compile(1, 0, 0, 1),
	];
	expect(solution.compile(1)).toEqual(solution.compile(1, 0, 0, 0));

	// compileAll() returns every solution, the same four as above.
	const all = solution.compileAll();
	expect(all.length).toBe(4);
	const sortKey = (faceOrders) => JSON.stringify(faceOrders.slice().sort());
	expect(chosen.map(sortKey).sort()).toEqual(all.map(sortKey).sort());

	// each solution orders every overlapping pair of faces (7 faces, all
	// overlapping, is 21 pairs), the solutions differ in their values.
	all.forEach((faceOrders) => expect(faceOrders.length).toBe(21));
	expect(new Set(all.map(sortKey)).size).toBe(4);
});

test("strip with one solution, providing a matching faceOrders", () => {
	const folded = makeFoldedStrip(
		[3, 2, 2, 2, 2, 2, 1, 2],
		["M", "V", "V", "V", "M", "V", "M"],
	);
	const solution = ear.layer(folded);

	// every face pair was solved, there are no branches.
	expect(solution.leaves()).toMatchObject([["leaf"]]);
	expect(solution.compileAll().length).toBe(1);

	// in the only solution, face 1 is on the positive side of face 7
	const pair = solution.compile().filter(([a, b]) => a === 1 && b === 7);
	expect(pair).toEqual([[1, 7, 1]]);

	// requiring this face order is fine, the solution is unchanged.
	const constrained = ear.layer({ ...folded, faceOrders: [[1, 7, 1]] });
	expect(constrained.compileAll().length).toBe(1);
});

test("strip with no solutions, a conflict found only after guessing", () => {
	const folded = makeFoldedStrip(
		[3, 2, 2, 2, 2, 2, 1, 2],
		["M", "V", "V", "V", "M", "V", "M"],
	);

	// require face 1 to be on the negative side of face 7, the opposite of
	// the only solution (see the previous test). Nothing contradicts this
	// requirement until the solver starts guessing, every guess down one
	// group of face pairs ends in a dead end, so that group has no solution,
	// and so the entire model has no solution. The solver throws.
	const faceOrders = [[1, 7, -1]];
	expect(() => ear.layer({ ...folded, faceOrders })).toThrow(Messages.noLayerSolution);
	expect(() => ear.layer.solveLayerOrders({ ...folded, faceOrders })).toThrow(
		Messages.noLayerSolution,
	);

	// so, when using the solver on an unknown model, wrap it in a try/catch.
	let solution;
	try {
		solution = ear.layer({ ...folded, faceOrders });
	} catch (error) {
		solution = undefined;
	}
	expect(solution).toBe(undefined);
});

test("crease pattern with no solutions, a conflict found immediately", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/panels-3x3-invalid.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const cp = ear.graph.getFramesByClassName(fold, "creasePattern")[0];
	const folded = {
		...cp,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
	};

	// here, the conflict is found before any guessing begins. the error
	// is the same, and the "cause" says which constraint was violated.
	let error;
	try {
		ear.layer(folded);
	} catch (err) {
		error = err;
	}
	expect(error.message).toBe(Messages.noLayerSolution);
	expect(error.cause.message).toMatch(/^invalid /);
});
