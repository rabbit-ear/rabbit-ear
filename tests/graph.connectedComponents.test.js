const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("connectedComponents", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const graph = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const faceOrders = ear.layer.layer3d(graph).faceOrders();
	const faces_sets = ear.graph.connectedComponents(ear.graph.makeVerticesVerticesUnsorted({
		edges_vertices: faceOrders.map(ord => [ord[0], ord[1]]),
	}));
	fs.writeFileSync(
		`./tests/tmp/connectedFaces.json`,
		JSON.stringify(faces_sets, null, 2),
	);
});
