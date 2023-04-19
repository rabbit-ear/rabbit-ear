const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("taco tortilla transitivity", () => {
	const graph = ear.graph.fish().flatFolded();
	const faces_winding = ear.graph.makeFacesWinding(graph);
	const faces_polygon = ear.graph.makeFacesPolygon(graph);
	faces_polygon.forEach((polygon, i) => {
		if (!faces_winding[i]) { polygon.reverse(); }
	});
	const facesFacesOverlap = ear.graph.getFacesFacesOverlap(graph);
	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
		transitivity,
	} = ear.layer.makeRelationships({ ...graph, faces_polygon }, facesFacesOverlap);
	expect(JSON.stringify(tortilla_tortilla[0]))
		.toBe(JSON.stringify([[2, 7], [11, 6]]));
	expect(JSON.stringify(tortilla_tortilla[1]))
		.toBe(JSON.stringify([[1, 8], [4, 9]]));
});
