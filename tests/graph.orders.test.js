const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("coplanar faces groups", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const graph = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	graph.faceOrders = ear.layer.layer3d(graph).faceOrders();
	const faces_nudge = ear.graph.nudgeFacesWithFaceOrders(graph);
	fs.writeFileSync(`./tests/tmp/faces_nudge.json`, JSON.stringify(faces_nudge, null, 2));
});
