import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../rabbit-ear.js";

ear.svg.window = xmldom;

test("all methods that return the graph itself", () => {
	const graph = ear.graph.fish();
	const result = graph
		.populate()
		.invertAssignments()
		.transform([2, 0, 0, 0, 2, 0, 0, 0, 2, 1, 2, 3])
		.scale(2)
		.scale([1, 2, 3])
		.translate([1, 2])
		.rotate(Math.PI / 2, [0, 0, 1], [0.5, 0.5])
		.rotateZ(Math.PI / 2, [0.5, 0.5])
		.unitize();
	expect(result instanceof ear.graph).toBe(true);
});

test("all methods that return something else", () => {
	const graph = ear.graph.fish();

	graph.clean();
	graph.subgraph({ vertices: [0, 1, 2, 3] });
	graph.boundary();
	graph.boundaries();
	graph.planarBoundary();
	graph.planarBoundaries();
	graph.boundingBox();
	graph.nearest([0.5, 0.5]);
	graph.splitEdge(0, [0, 0.1]);
	graph.splitFace(0, { vector: [0.707, -0.707], origin: [0.1, 0.1] });
	graph.svg();
	graph.obj();
	graph.explodeFaces();
	graph.explodeEdges();
	graph.validate();

	expect(true).toBe(true);
});
