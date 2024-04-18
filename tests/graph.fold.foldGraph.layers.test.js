import { expect, test } from "vitest";
import fs from "fs";
import ear from "../src/index.js";

test("foldGraph, faceOrders, square folding", () => {
	const graph = ear.graph.square();

	ear.graph.foldGraph(graph, { vector: [3, 1], origin: [0.5, 0.5] });
	graph.faceOrders = [[0, 1, 1]];

	expect(graph.faceOrders).toMatchObject([[0, 1, 1]]);

	ear.graph.foldGraph(graph, { vector: [-1, 5], origin: [0.5, 0.5] });

	// splitFace (first): 0 becomes 2, 3
	// [0, 1, 1] becomes two rules: [2, 1, 1], [3, 1, 1].
	// remap: 0->X 1->0 2->1 3->2
	// rules become: [1, 0, 1] and [2, 0, 1]
	// splitFace (second): 0 becomes 3, 4
	// [1, 0, 1] becomes [1, 3, 1] and [1, 4, 1]
	// [2, 0, 1] becomes [2, 3, 1] and [2, 4, 1], the order should be:
	// [1, 3, 1], [2, 3, 1], [1, 4, 1], [2, 4, 1]
	// faces get remapped, 0->X, 1->0, 2->1, 3->2, 4->3
	// [0, 2, 1], [1, 2, 1], [0, 3, 1], [1, 3, 1]
	expect(graph.faceOrders).toMatchObject([
		[0, 2, 1], [1, 2, 1], [0, 3, 1], [1, 3, 1], [0, 1, 1], [2, 3, -1],
	]);
	// expect(graph.faceOrders).toMatchObject([
	// 	[0, 2, 1], [1, 2, 1], [0, 3, 1], [1, 3, 1],
	// ]);

	// ear.graph.foldGraph(graph, { vector: [4, -1], origin: [0.25, 0.25] });

	// // did not check this yet.
	// expect(graph.faceOrders).toMatchObject([
	// 	[0, 4, 1], [2, 4, 1], [0, 6, 1], [2, 6, 1], [1, 4, 1], [1, 6, 1],
	// 	[3, 4, 1], [3, 6, 1], [0, 5, 1], [2, 5, 1], [1, 5, 1], [3, 5, 1],
	// 	[0, 7, 1], [2, 7, 1], [1, 7, 1], [3, 7, 1],
	// ]);

	// console.log(JSON.stringify(graph.faceOrders));
});


test("foldGraph, faceOrders, square folding", () => {
	const graph = ear.graph.square();

	const sequence = {
		...structuredClone(graph),
		file_frames: [],
	};

	// fold step
	ear.graph.foldGraph(graph, { vector: [3, 1], origin: [0.5, 0.5] });
	sequence.file_frames.push(structuredClone(graph));
	sequence.file_frames.push({
		...structuredClone(graph),
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(graph),
		frame_classes: ["foldedForm"],
	});

	expect(graph.faceOrders).toMatchObject([[0, 1, 1]]);

	// fold step
	ear.graph.foldGraph(graph, { vector: [-1, 5], origin: [0.5, 0.5] });
	sequence.file_frames.push(structuredClone(graph));
	sequence.file_frames.push({
		...structuredClone(graph),
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(graph),
		frame_classes: ["foldedForm"],
	});

	// splitFace (first): 0 becomes 2, 3
	// [0, 1, 1] becomes two rules: [2, 1, 1], [3, 1, 1].
	// remap: 0->X 1->0 2->1 3->2
	// rules become: [1, 0, 1] and [2, 0, 1]
	// splitFace (second): 0 becomes 3, 4
	// [1, 0, 1] becomes [1, 3, 1] and [1, 4, 1]
	// [2, 0, 1] becomes [2, 3, 1] and [2, 4, 1], the order should be:
	// [1, 3, 1], [2, 3, 1], [1, 4, 1], [2, 4, 1]
	// faces get remapped, 0->X, 1->0, 2->1, 3->2, 4->3
	// [0, 2, 1], [1, 2, 1], [0, 3, 1], [1, 3, 1]
	expect(graph.faceOrders).toMatchObject([
		[0, 2, 1], [1, 2, 1], [0, 3, 1], [1, 3, 1], [0, 1, 1], [2, 3, -1],
	]);

	// fold step
	ear.graph.foldGraph(graph, { vector: [4, -1], origin: [0.25, 0.25] });
	sequence.file_frames.push(structuredClone(graph));
	sequence.file_frames.push({
		...structuredClone(graph),
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(graph),
		frame_classes: ["foldedForm"],
	});

	// fold step
	ear.graph.foldGraph(graph, { vector: [1, 4], origin: [0.25, 0.25] });
	sequence.file_frames.push(structuredClone(graph));
	sequence.file_frames.push({
		...structuredClone(graph),
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(graph),
		frame_classes: ["foldedForm"],
	});

	// fold step
	ear.graph.foldGraph(graph, { vector: [1, 0], origin: [0.125, 0.125] });
	sequence.file_frames.push(structuredClone(graph));
	sequence.file_frames.push({
		...structuredClone(graph),
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(graph),
		frame_classes: ["foldedForm"],
	});

	// fold step
	ear.graph.foldGraph(graph, { vector: [0, 1], origin: [0.125, 0.125] });
	sequence.file_frames.push(structuredClone(graph));
	sequence.file_frames.push({
		...structuredClone(graph),
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(graph),
		frame_classes: ["foldedForm"],
	});

	// fold step
	ear.graph.foldGraph(graph, { vector: [1, 1], origin: [0.05, 0.05] });
	sequence.file_frames.push(structuredClone(graph));
	sequence.file_frames.push({
		...structuredClone(graph),
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(graph),
		frame_classes: ["foldedForm"],
	});

	// fold step
	ear.graph.foldGraph(graph, { vector: [-1, 1], origin: [0.05, 0.05] });
	sequence.file_frames.push(structuredClone(graph));
	sequence.file_frames.push({
		...structuredClone(graph),
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(graph),
		frame_classes: ["foldedForm"],
	});

	fs.writeFileSync(
		"./tests/tmp/foldGraph-fold-sequence.fold",
		JSON.stringify(sequence),
		"utf8",
	);
});

test("foldGraph, faceOrders, panels", () => {
	const FOLD = fs.readFileSync("tests/files/fold/panels-simple.fold", "utf-8");
	const graph = JSON.parse(FOLD);

	// no faceOrders exist at this point
	ear.graph.foldLine(graph, { vector: [1, 0.1], origin: [0.5, 0.5] });
	ear.graph.foldLine(graph.file_frames[0], { vector: [1, -0.1], origin: [0.5, 0.5] });
	ear.graph.foldLine(graph.file_frames[1], { vector: [1, 0.1], origin: [0.5, 0.5] });
	ear.graph.foldLine(graph.file_frames[2], { vector: [1, -0.1], origin: [0.5, 0.5] });
	ear.graph.foldLine(graph.file_frames[3], { vector: [1, 0.1], origin: [0.5, 0.5] });

	expect(graph.faceOrders)
		.toMatchObject([[0, 1, 1], [2, 3, -1]]);
	expect(graph.file_frames[0].faceOrders)
		.toMatchObject([[0, 1, 1], [2, 3, -1], [4, 5, 1]]);
	expect(graph.file_frames[1].faceOrders)
		.toMatchObject([[0, 1, 1], [2, 3, -1], [4, 5, 1], [6, 7, -1]]);
	expect(graph.file_frames[2].faceOrders)
		.toMatchObject([[0, 1, 1], [2, 3, -1], [4, 5, 1], [6, 7, -1], [8, 9, 1]]);
	expect(graph.file_frames[3].faceOrders)
		.toMatchObject([[0, 1, 1], [2, 3, -1], [4, 5, 1], [6, 7, -1], [8, 9, 1], [10, 11, -1]]);

	fs.writeFileSync(
		`./tests/tmp/foldGraph-panels.fold`,
		JSON.stringify(graph),
		"utf8",
	);
});

test("foldGraph, faceOrders, panels", () => {
	const FOLD = fs.readFileSync("tests/files/fold/panels-simple.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	graph.faceOrders = [[0, 1, 1]];
	graph.file_frames[0].faceOrders = [[0, 1, 1], [1, 2, -1]];
	graph.file_frames[1].faceOrders = [[0, 1, 1], [1, 2, -1], [2, 3, 1]];
	graph.file_frames[2].faceOrders = [[0, 1, 1], [1, 2, -1], [2, 3, 1], [3, 4, -1]];
	graph.file_frames[3].faceOrders = [[0, 1, 1], [1, 2, -1], [2, 3, 1], [3, 4, -1], [4, 5, 1]];

	ear.graph.foldLine(graph, { vector: [1, 0.1], origin: [0.5, 0.5] });
	ear.graph.foldLine(graph.file_frames[0], { vector: [1, -0.1], origin: [0.5, 0.5] });
	ear.graph.foldLine(graph.file_frames[1], { vector: [1, 0.1], origin: [0.5, 0.5] });
	ear.graph.foldLine(graph.file_frames[2], { vector: [1, -0.1], origin: [0.5, 0.5] });
	ear.graph.foldLine(graph.file_frames[3], { vector: [1, 0.1], origin: [0.5, 0.5] });

	// in splitFace (first): face 0 turns into face 2 and 3.
	// [0, 1, 1] becomes two rules: [2, 1, 1], [3, 1, 1].
	// faces get remapped, 0->X, 1->0, 2->1, 3->2.
	// rules become: [1, 0, 1] and [2, 0, 1]
	// then, splitFace (second): face 0 turns into face 3 and 4
	// [1, 0, 1] becomes [1, 3, 1] and [1, 4, 1]
	// [2, 0, 1] becomes [2, 3, 1] and [2, 4, 1], the order should be:
	// [1, 3, 1], [2, 3, 1], [1, 4, 1], [2, 4, 1]
	// faces get remapped, 0->X, 1->0, 2->1, 3->2, 4->3
	// [0, 2, 1], [1, 2, 1], [0, 3, 1], [1, 3, 1], YES! this matches.
	// finally,
	// then [0, 1, 1], [2, 3, -1] get calculated and added at the end
	expect(graph.faceOrders).toMatchObject([
		[0, 2, 1], [1, 2, 1], [0, 3, 1], [1, 3, 1], [0, 1, 1], [2, 3, -1],
	]);

	// console.log(JSON.stringify(graph.faceOrders));

	fs.writeFileSync(
		`./tests/tmp/foldGraph-panels.fold`,
		JSON.stringify(graph),
		"utf8",
	);
});
