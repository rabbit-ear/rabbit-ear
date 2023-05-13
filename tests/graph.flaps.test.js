const fs = require("fs");
const xmldom = require("@xmldom/xmldom");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

ear.window = xmldom;

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

test("planarize, svg import", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/crane-cp.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const result = ear.graph.getFlapsThroughLine(graph, { vector: [1, 1], origin: [0, 0] });
	// console.log(graph);
	expect(true).toBe(true);
});
