const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("taco tortilla transitivity", () => {
	const graph = ear.graph.fish().flatFolded();
	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
	} = ear.layer.makeTacosAndTortillas({ ...graph });
	expect(JSON.stringify(tortilla_tortilla[0]))
		.toBe(JSON.stringify([[5, 6], [1, 9]]));
	expect(JSON.stringify(tortilla_tortilla[1]))
		.toBe(JSON.stringify([[7, 10], [8, 2]]));
});

test("taco tortilla transitivity", () => {
	const graph = ear.graph.fish().flatFolded();
	const faces_winding = ear.graph.makeFacesWinding(graph);
	const faces_polygon = ear.graph.makeFacesPolygon(graph);
	faces_polygon.forEach((polygon, i) => {
		if (!faces_winding[i]) { polygon.reverse(); }
	});
	const facesFacesOverlap = ear.graph.getFacesFacesOverlap(graph);
	const unfilteredTrans = ear.layer
		.makeTransitivity({ faces_polygon }, facesFacesOverlap);
});
