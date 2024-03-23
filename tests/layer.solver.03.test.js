import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("Mooser's train layer solution", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/moosers-train.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const {
		orders,
		branches,
	} = ear.layer.layer3D(graph);

	expect(Object.keys(orders).length).toBe(1713);
	expect(branches).toMatchObject([
		[
			{ orders: [[52, 115, 1], [52, 131, 1], [52, 128, -1], [52, 113, -1]] },
			{ orders: [[52, 115, -1], [52, 131, -1], [52, 128, 1], [52, 113, 1]] },
		],
		[
			{ orders: [[108, 116, 1], [108, 137, 1], [108, 136, -1], [108, 114, -1]] },
			{ orders: [[108, 116, -1], [108, 137, -1], [108, 136, 1], [108, 114, 1]] },
		]
	]);
	// graph.faceOrders = solution.faceOrders();
	// fs.writeFileSync(`./tests/tmp/moosers-train-layer-solved.fold`, JSON.stringify(graph));
});

test("Maze-folding layer solution", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const foldedFrame = ear.graph.getFramesByClassName(graph, "foldedForm")[0];
	foldedFrame.faceOrders = ear.layer.layer3D(foldedFrame).faceOrders();
	fs.writeFileSync(`./tests/tmp/maze-u-layer-solved.fold`, JSON.stringify(foldedFrame));

	// every face has some order associated with it
	const facesFound = [];
	foldedFrame.faceOrders.forEach(order => {
		facesFound[order[0]] = true;
		facesFound[order[1]] = true;
	});
	expect(facesFound.filter(a => a !== undefined).length)
		.toBe(foldedFrame.faces_vertices.length);
});

// test("Maze-folding layer solution", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/maze-s.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const foldedFrame = ear.graph.getFramesByClassName(graph, "foldedForm")[0];
// 	const solution = ear.layer.layer3D(foldedFrame);
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
// 	foldedFrame.faceOrders = ear.layer.layer3D(foldedFrame).faceOrders();
// 	fs.writeFileSync(`./tests/tmp/maze-8x8-layer-solved.fold`, JSON.stringify(foldedFrame));
// 	expect(true).toBe(true);
// });
