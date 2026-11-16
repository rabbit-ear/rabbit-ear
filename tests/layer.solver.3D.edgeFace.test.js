import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

const readFold = (name) =>
	JSON.parse(fs.readFileSync(`./tests/files/fold/${name}.fold`, "utf-8"));

// These tests protect the 3D layer solver setup (makeSolverConstraints3D)
// against losing information that was computed in one of its sub-steps.

// crease pattern, fold its vertices
const foldedFramesOf = (name, frames) => {
	const file = readFold(name);
	return frames.map((i) => {
		const frame = ear.graph.flattenFrame(file, i);
		return {
			name: `${name} frame ${i}`,
			graph: { ...frame, vertices_coords: ear.graph.makeVerticesCoordsFolded(frame) },
		};
	});
};

// files which contain a "foldedForm" frame
// remove any existing faceOrders if they exist
const foldedFormsOf = (name) => {
	const file = readFold(name);
	return ear.graph
		.getFileFramesAsArray(file)
		.map((_, i) => ear.graph.flattenFrame(file, i))
		.map((frame, i) => ({ frame, i }))
		.filter(({ frame }) => (frame.frame_classes || []).includes("foldedForm"))
		.map(({ frame, i }) => {
			const { faceOrders, ...graph } = frame;
			return { name: `${name} frame ${i}`, graph };
		});
};

const fixtures = [
  // leaving out some of these frames which are purposefully invalid
	...foldedFramesOf("layers-3d-edge-face", [0, 1, 2, 3, 4, 5]),
	...foldedFramesOf("layers-3d-edge-edge", [0, 1, 2, 3, 4, 5, 6]),
	...foldedFramesOf("moosers-train-carriage", [0]),
	...foldedFramesOf("moosers-train-carriage-fourth", [0]),
	...foldedFramesOf("square-fish-3d", [0]),
	...foldedFormsOf("moosers-train"),
	...foldedFormsOf("moosers-train-engine"),
	...foldedFormsOf("maze-u"),
	...foldedFormsOf("maze-s"),
	...foldedFormsOf("cube-octagon"),
	...foldedFormsOf("crane-3d"),
	...foldedFormsOf("pleats-angle-3d"),
	...foldedFormsOf("disjoint-triangles-3d"),
];

const populated = (graph) => {
	const copy = structuredClone(graph);
	ear.graph.populate(copy);
	return copy;
};

// break out makeSolverConstraints3D subroutines
const standaloneSteps = (graph) => {
	const clusterInfo = ear.layer.constraints3DFaceClusters(graph);
	const edgeFace3DOverlaps = ear.layer.getOverlapFacesWith3DEdge(graph, clusterInfo);
	const edgeFaceOrders = ear.layer.solveOverlapFacesWith3DEdge(
		graph,
		edgeFace3DOverlaps,
		clusterInfo.faces_winding,
	);
	const edgeEdge = ear.layer.constraints3DEdges(graph, clusterInfo);
	return { clusterInfo, edgeFace3DOverlaps, edgeFaceOrders, edgeEdge };
};

const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/**
 * @description Using only geometry and the FOLD faceOrders definition,
 * for a 3D edge crossing the interior of a "tortilla" face, where
 * "coplanar" is the edge's face in the tortilla's plane, and "angled" is
 * the edge's other face (leaving the plane), the angled face leaves the
 * plane from the coplanar face's layer, heading towards one side. The
 * tortilla must therefore be on the other side of the coplanar face,
 * otherwise the angled face passes through the tortilla.
 * @returns {string|undefined} a description of the problem, or undefined if valid
 */
const checkEdgeFaceOverlap = (graph, faceOrders, { edge, tortilla, coplanar, angled }) => {
	const coords = graph.vertices_coords.map(ear.math.resize3);
	const normals = ear.graph.makeFacesNormal(graph);
	const centroid = (f) =>
		[0, 1, 2].map(
			(i) =>
				graph.faces_vertices[f].reduce((sum, v) => sum + coords[v][i], 0) /
				graph.faces_vertices[f].length,
		);
	const [a, b] = graph.edges_vertices[edge].map((v) => coords[v]);
	const midpoint = a.map((n, i) => (n + b[i]) / 2);
	const normal = normals[tortilla];

	// which side of the plane (along the tortilla's normal) the angled face goes
	const angledSide = Math.sign(
		dot3(
			centroid(angled).map((n, i) => n - midpoint[i]),
			normal,
		),
	);

	// [A, B, order]: order = +1 means A is above B in the direction of B's normal
	const order = faceOrders.find(
		([x, y]) => (x === coplanar && y === tortilla) || (x === tortilla && y === coplanar),
	);
	if (!order) {
		return `edge ${edge}: no faceOrder between ${coplanar} and ${tortilla}`;
	}
	const [x, y, s] = order;
	// the side of the tortilla that the coplanar face is on (along tortilla normal)
	const coplanarSide =
		x === coplanar ? s : -s * Math.sign(dot3(normals[coplanar], normal));
	return coplanarSide === angledSide
		? undefined
		: `edge ${edge}: angled face ${angled} pierces tortilla ${tortilla} (coplanar ${coplanar})`;
};

const cache = new Map();
const results = ({ name, graph }) => {
	if (cache.has(name)) {
		return cache.get(name);
	}
	const g = populated(graph);
	const before = JSON.stringify(g);
	const steps = standaloneSteps(g);
	const setup = ear.layer.makeSolverConstraints3D(g);
	const setupModifiedInput = JSON.stringify(g) !== before;
	const faceOrders = ear.layer.layer3D(g).faceOrders();
	const solverModifiedInput = JSON.stringify(g) !== before;
	const result = {
		g,
		steps,
		setup,
		faceOrders,
		setupModifiedInput,
		solverModifiedInput,
	};
	cache.set(name, result);
	return result;
};

test.each(fixtures)("makeSolverConstraints3D keeps every edge-face-3D order, $name", (fixture) => {
	const { steps, setup } = results(fixture);
	Object.entries(steps.edgeFaceOrders).forEach(([key, value]) =>
		expect([key, setup.orders[key]]).toEqual([key, value]),
	);
});

test.each(fixtures)(
	"makeSolverConstraints3D keeps every edge-edge-3D order and constraint, $name",
	(fixture) => {
		const { steps, setup } = results(fixture);
		const { edgeEdge } = steps;
		Object.entries(edgeEdge.orders).forEach(([key, value]) =>
			expect([key, setup.orders[key]]).toEqual([key, value]),
		);
		const tacoTortillas = new Set(setup.constraints.taco_tortilla.map((c) => c.join(" ")));
		const tortillaTortillas = new Set(
			setup.constraints.tortilla_tortilla.map((c) => c.join(" ")),
		);
		edgeEdge.taco_tortilla.forEach((c) =>
			expect(tacoTortillas.has(c.join(" "))).toBe(true),
		);
		edgeEdge.tortilla_tortilla.forEach((c) =>
			expect(tortillaTortillas.has(c.join(" "))).toBe(true),
		);
	},
);

test.each(fixtures)("makeSolverConstraints3D and layer3D do not modify the input, $name", (fixture) => {
	const { setupModifiedInput, solverModifiedInput } = results(fixture);
	expect(setupModifiedInput).toBe(false);
	expect(solverModifiedInput).toBe(false);
});

test.each(fixtures)("layer3D: no 3D edge pierces a face it crosses, $name", (fixture) => {
	const { g, steps, faceOrders } = results(fixture);
	const problems = steps.edgeFace3DOverlaps
		.map((overlap) => checkEdgeFaceOverlap(g, faceOrders, overlap))
		.filter((a) => a !== undefined);
	expect(problems).toEqual([]);
});

test("the fixtures exercise the 3D edge-face case", () => {
	const counts = fixtures.map((fixture) => results(fixture).steps.edgeFace3DOverlaps.length);
	expect(counts.reduce((a, b) => a + b, 0)).toBeGreaterThan(1000);
	const engine = fixtures.find(({ name }) => name === "moosers-train-engine frame 1");
	expect(results(engine).steps.edgeFace3DOverlaps.length).toBe(289);
});

test("Mooser's train engine, rear wheels do not pierce the underside", () => {
	const engine = fixtures.find(({ name }) => name === "moosers-train-engine frame 1");
	const { g, steps, faceOrders } = results(engine);

  // checking faces 84 and 148 in particular because the solver was placing them
  // out of order causing self intersection, sover is fixed, but checking these anyway
	const normals = ear.graph.makeFacesNormal(g);
	expect(normals[84][1]).toBeCloseTo(-1);
	expect(normals[148][1]).toBeCloseTo(-1);

	// 19 above 84 along 84's normal (-Y): face 19 is beneath 84.
	expect(faceOrders).toContainEqual([19, 84, 1]);

	const wheelOverlaps = steps.edgeFace3DOverlaps.filter(
		({ tortilla }) => tortilla === 84 || tortilla === 148,
	);
	expect(wheelOverlaps.length).toBeGreaterThan(0);
	wheelOverlaps.forEach((overlap) =>
		expect(checkEdgeFaceOverlap(g, faceOrders, overlap)).toBeUndefined(),
	);
});
