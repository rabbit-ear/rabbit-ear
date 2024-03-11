import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("3D off for now", () => {});

// test("Mooser's train layer solution", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/moosers-train.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const solution = ear.layer.layer3d(graph);
// 	// console.log("solution", solution);
// 	// console.log("solution", solution.count());
// 	// console.log("solution 0", solution.compile());
// 	// console.log("dag", solution.directedPairs());
// 	// console.log("linearize", solution.linearize());
// 	// console.log("faceOrders", solution.faceOrders());
// 	graph.faceOrders = solution.faceOrders();
// 	fs.writeFileSync(`./tests/tmp/moosers-train-layer-solved.fold`, JSON.stringify(graph));
// 	expect(true).toBe(true);
// });

// test("Maze-folding layer solution", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const foldedFrame = ear.graph.getFramesByClassName(graph, "foldedForm")[0];
// 	foldedFrame.faceOrders = ear.layer.layer3d(foldedFrame).faceOrders();
// 	fs.writeFileSync(`./tests/tmp/maze-u-layer-solved.fold`, JSON.stringify(foldedFrame));

// 	// every face has some order associated with it
// 	const facesFound = [];
// 	foldedFrame.faceOrders.forEach(order => {
// 		facesFound[order[0]] = true;
// 		facesFound[order[1]] = true;
// 	});
// 	expect(facesFound.filter(a => a !== undefined).length)
// 		.toBe(foldedFrame.faces_vertices.length);
// });

// test("Maze-folding layer solution", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/maze-s.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const foldedFrame = ear.graph.getFramesByClassName(graph, "foldedForm")[0];
// 	const solution = ear.layer.layer3d(foldedFrame);
// 	const solutionCounts = solution.count();
// 	foldedFrame.faceOrders = solution.faceOrders();
// 	foldedFrame.file_frames = solutionCounts
// 		.flatMap((count, i) => Array.from(Array(count))
// 			.map((_, j) => {
// 				const solutionIndices = solutionCounts.map(() => 0);
// 				solutionIndices[i] = j;
// 				return solutionIndices;
// 			})
// 			.map(solutionIndices => ({
// 				frame_parent: 0,
// 				frame_inherit: true,
// 				faceOrders: solution.faceOrders(...solutionIndices),
// 			})));
// 	fs.writeFileSync(`./tests/tmp/maze-s-layer-solved.fold`, JSON.stringify(foldedFrame));
// 	expect(true).toBe(true);
// });

// test("Maze-folding 8x8 maze", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/maze-8x8.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const foldedFrame = ear.graph.getFramesByClassName(graph, "foldedForm")[0];
// 	foldedFrame.faceOrders = ear.layer.layer3d(foldedFrame).faceOrders();
// 	fs.writeFileSync(`./tests/tmp/maze-8x8-layer-solved.fold`, JSON.stringify(foldedFrame));
// 	expect(true).toBe(true);
// });
