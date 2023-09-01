const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

// ear.layer.setup()

test("Graph group copies", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const graph = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const {
		sets_faces,
		sets_plane,
		sets_transformXY,
		faces_set,
		faces_winding,
		// facesFacesOverlap,
	} = ear.graph.coplanarOverlappingFacesGroups(graph);
	// all vertices_coords will become 2D
	const sets_graphs = ear.layer.graphGroupCopies(graph, sets_faces, sets_transformXY);
	const faces_polygon = ear.general.zipperArrays(...sets_graphs
		.map(copy => ear.graph.makeFacesPolygon(copy)));
	fs.writeFileSync(`./tests/tmp/sets_graphs.json`, JSON.stringify(sets_graphs, null, 2));
	fs.writeFileSync(`./tests/tmp/faces_polygon.json`, JSON.stringify(faces_polygon, null, 2));
	expect(true).toBe(true);
});
