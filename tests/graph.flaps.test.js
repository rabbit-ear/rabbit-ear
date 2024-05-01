import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

test("flaps", () => expect(true).toBe(true));

test("flaps, waterbomb", () => {
	const graph = ear.graph.waterbomb();
	const folded = {
		...graph,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(graph),
	};

});

/*
test("getEdgesSide", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/crane-step.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const result0 = ear.graph.getEdgesSide(graph, { vector: [1, 1], origin: [0, 0] });
	const result1 = ear.graph.getEdgesSide(graph, { vector: [1, -1], origin: [0, 1] });
	const positiveCount0 = result0.filter(a => a === 1).length;
	const negativeCount0 = result0.filter(a => a === -1).length;
	const intersectCount0 = result0.filter(a => a === 0).length;
	const collinearCount0 = result0.filter(a => a === 2).length;
	const positiveCount1 = result1.filter(a => a === 1).length;
	const negativeCount1 = result1.filter(a => a === -1).length;
	const intersectCount1 = result1.filter(a => a === 0).length;
	const collinearCount1 = result1.filter(a => a === 2).length;
	expect(positiveCount0).toBe(negativeCount0);
	expect(positiveCount1).toBe(negativeCount1);
	expect(intersectCount0).toBe(2);
	expect(collinearCount0).toBe(0);
	expect(intersectCount1).toBe(0);
	expect(collinearCount1).toBe(4);
});

test("getFacesSide", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/crane-step.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const result0 = ear.graph.getFacesSide(graph, { vector: [1, 1], origin: [0, 0] });
	const result1 = ear.graph.getFacesSide(graph, { vector: [1, -1], origin: [0, 1] });
	const positiveCount0 = result0.filter(a => a === 1).length;
	const negativeCount0 = result0.filter(a => a === -1).length;
	const intersectCount0 = result0.filter(a => a === 0).length;
	const positiveCount1 = result1.filter(a => a === 1).length;
	const negativeCount1 = result1.filter(a => a === -1).length;
	const intersectCount1 = result1.filter(a => a === 0).length;
	expect(positiveCount0).toBe(negativeCount0);
	expect(positiveCount1).toBe(negativeCount1);
	expect(intersectCount0).toBe(4);
	expect(intersectCount1).toBe(0);
});

test("crane flaps", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const origin = graph.vertices_coords[39];
	const vector = ear.math.subtract2(...graph.edges_vertices[59].map(v => graph.vertices_coords[v]));
	// const vector = [1, -1];
	console.log(origin, vector);
	const result = ear.graph.getFlapsThroughLine(graph, { vector, origin });
	// console.log(graph);
	expect(true).toBe(true);
});

*/
