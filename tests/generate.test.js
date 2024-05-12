import fs from "fs";
import { test } from "vitest";
import ear from "../src/index.js";

test("test can remain empty", () => {});

// test("write folded vertices", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/layers-cycle-nonconvex.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	// const graph = ear.graph.flattenFrame(fold, 1);
// 	const folded = ear.graph.makeVerticesCoordsFolded(fold, [0]);
// 	// const folded = ear.graph.makeVerticesCoordsFlatFolded(fold);
// 	const foldedVertices = folded.map(p => p.map(n => ear.general.cleanNumber(n, 12)));
// 	fs.writeFileSync(
// 		`./tests/tmp/folded-vertices.json`,
// 		JSON.stringify(foldedVertices, null, 2),
// 	);
// });

// test("write layer solution to file", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	const solution = ear.layer.solveLayerOrders(folded);

// 	// optional: delete faces_winding
// 	delete solution.faces_winding;

// 	fs.writeFileSync(
// 		`./tests/tmp/layer-solution.json`,
// 		JSON.stringify(solution, null, 2),
// 	);
// });

// test("write faceOrders", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/square-twist.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const foldedFrame = ear.graph.getFramesByClassName(graph, "foldedForm")[0];
// 	const faceOrders = ear.layer.layer3D(foldedFrame).faceOrders();
// 	fs.writeFileSync(`./tests/tmp/faceOrders.fold`, JSON.stringify(faceOrders));
// });

// test("generate a graph with random edges", () => {
// 	const COUNT = 500;
// 	const graph = {
// 		vertices_coords: Array.from(Array(COUNT * 2))
// 			.map(() => [Math.random(), Math.random()]),
// 		edges_vertices: Array.from(Array(COUNT))
// 			.map((_, i) => [i * 2, i * 2 + 1]),
// 		edges_assignment: Array.from(Array(COUNT))
// 			.map(() => ["V", "M", "F", "U"][Math.floor(Math.random() * 4)]),
// 	};
// 	fs.writeFileSync(
// 		`./tests/tmp/non-planar-${COUNT}-random-lines.fold`,
// 		JSON.stringify(graph),
// 	);
// });

// test("generate an un-planarized set of random fold lines", () => {
// 	const {
// 		vertices_coords,
// 		edges_vertices,
// 		edges_assignment,
// 	} = ear.graph.square();
// 	const graph = {
// 		frame_classes: ["creasePattern"],
// 		vertices_coords,
// 		edges_vertices,
// 		edges_assignment,
// 	};

// 	const COUNT = 100;

// 	const boundary = ear.graph.boundaryPolygon(graph);

// 	const matrix = ear.math.makeMatrix2Reflect([1, 1], [0, 0]);

// 	Array.from(Array(COUNT * 2)).forEach(() => {
// 		if (graph.edges_vertices.length >= COUNT) { return; }

// 		const { lines } = ear.graph.getEdgesLine(graph);
// 		const lineA = lines[Math.floor(Math.random() * lines.length)];
// 		const lineB = lines[Math.floor(Math.random() * lines.length)];
// 		const results = ear.axiom.axiom3InPolygon(boundary, lineA, lineB)
// 			.filter(a => a !== undefined);

// 		if (!results.length) { return; }
// 		const result = results[Math.floor(Math.random() * results.length)];

// 		const degrees = Math.atan2(result.vector[1], result.vector[0]) * (180 / Math.PI);
// 		if (!ear.math.epsilonEqual(Math.abs(degrees) % 22.5, 0)) { return; }

// 		if (lines.some(line => ear.math.collinearLines2(line, result))) { return; }

// 		const assignment = ["M", "V", "F", "U"][Math.floor(Math.random() * 4)];
// 		[result, ear.math.multiplyMatrix2Line2(matrix, result)].forEach(line => {
// 			const clip = ear.math.clipLineConvexPolygon(boundary, line);
// 			const vertices = ear.graph.addVertices(graph, clip);
// 			ear.graph.addEdge(graph, vertices, [], assignment);
// 		});
// 	});

// 	fs.writeFileSync(
// 		`./tests/tmp/non-planar-${COUNT}-lines.fold`,
// 		JSON.stringify(graph),
// 	);
// });
