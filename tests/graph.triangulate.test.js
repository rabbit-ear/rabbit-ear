import fs from "fs";
import { expect, test } from "vitest";
import earcut from "earcut";
import ear from "../src/index.js";

const convexHexagon = {
	vertices_coords: [
		[0, 0],
		[1, 1],
		[1, 2],
		[0, 3],
		[-1, 2],
		[-1, 1],
	],
	edges_vertices: [
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 4],
		[4, 5],
		[5, 0],
	],
	edges_assignment: ["B", "B", "B", "B", "B", "B"],
	faces_vertices: [[0, 1, 2, 3, 4, 5]],
};

const blintz = {
	vertices_coords: [
		[0, 0],
		[0.5, 0],
		[1, 0],
		[1, 0.5],
		[1, 1],
		[0.5, 1],
		[0, 1],
		[0, 0.5],
	],
	edges_vertices: [
		[0, 1],
		[1, 2],
		[2, 3],
		[3, 4],
		[4, 5],
		[5, 6],
		[6, 7],
		[7, 0],
		[1, 3],
		[3, 5],
		[5, 7],
		[7, 1],
	],
	edges_assignment: ["B", "B", "B", "B", "B", "B", "B", "B", "V", "V", "V", "V"],
	faces_vertices: [
		[1, 3, 5, 7],
		[0, 1, 7],
		[2, 3, 1],
		[4, 5, 3],
		[6, 7, 5],
	],
};

test("triangulate", () => {
	const fold = JSON.parse(JSON.stringify(convexHexagon));
	const { result, changes } = ear.graph.triangulate(fold);
	expect(result.edges_assignment.length).toBe(9);
	expect(result.edges_assignment[6]).toBe("J");
	expect(result.edges_assignment[7]).toBe("J");
	expect(result.edges_assignment[8]).toBe("J");
	expect(result.faces_vertices.length).toBe(4);
	expect(result.faces_edges.length).toBe(4);
	// all indices in the map will be 0. all came from face 0.
	expect(JSON.stringify(changes.faces.map)).toBe(JSON.stringify([[0, 1, 2, 3]]));
	expect(JSON.stringify(changes.edges.new)).toBe(JSON.stringify([6, 7, 8]));
});

test("triangulate with and without earcut 1", () => {
	const fold1 = JSON.parse(JSON.stringify(blintz));
	const fold2 = JSON.parse(JSON.stringify(blintz));
	const { changes: changes1 } = ear.graph.triangulate(fold1);
	const { changes: changes2 } = ear.graph.triangulate(fold2, earcut);
	expect(JSON.stringify(changes1.faces.map)).toBe(JSON.stringify(changes2.faces.map));
	expect(changes1.edges.new).toHaveLength(1);
	expect(JSON.stringify(changes1.edges.new)).toBe(JSON.stringify(changes2.edges.new));
});

test("triangulate with and without earcut 2", () => {
	const bird = JSON.parse(fs.readFileSync("./tests/files/fold/kraft-bird-base.fold"));
	const fold1 = JSON.parse(JSON.stringify(bird));
	const fold2 = JSON.parse(JSON.stringify(bird));
	const { result: result1, changes: changes1 } = ear.graph.triangulate(fold1);
	const { result: result2, changes: changes2 } = ear.graph.triangulate(fold2, earcut);
	expect(JSON.stringify(changes1.faces.map)).toBe(JSON.stringify(changes2.faces.map));
	expect(JSON.stringify(changes1.edges.new)).toBe(JSON.stringify(changes2.edges.new));
	expect(result1.edges_assignment.filter((a) => a === "J").length).toBe(112);
	expect(result1.edges_assignment.filter((a) => a === "J").length).toBe(
		result2.edges_assignment.filter((a) => a === "J").length,
	);
});

test("triangulate with only faces_vertices", () => {
	const graph = {
		faces_vertices: [
			[1, 3, 5, 7],
			[0, 1, 7],
			[2, 3, 1],
			[4, 5, 3],
			[6, 7, 5],
		],
	};
	const { result } = ear.graph.triangulate(graph);
	expect(result.faces_edges.length).toBe(result.faces_vertices.length);
	expect(result.edges_vertices.length).not.toBe(0);
});

test("triangulate with only faces_vertices, with earcut", () => {
	const graph = {
		faces_vertices: [
			[1, 3, 5, 7],
			[0, 1, 7],
			[2, 3, 1],
			[4, 5, 3],
			[6, 7, 5],
		],
	};
	let err;
	try {
		ear.graph.triangulate(graph, earcut);
	} catch (error) {
		err = error;
	}
	expect(err).not.toBe(undefined);
});

// the area-weighted normal of a polygon in 3D (Newell's method).
// its magnitude is the area of the polygon.
const polygonAreaNormal3 = (points) =>
	points
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		.reduce(
			(n, [a, b]) => [
				n[0] + (a[1] - b[1]) * (a[2] + b[2]),
				n[1] + (a[2] - b[2]) * (a[0] + b[0]),
				n[2] + (a[0] - b[0]) * (a[1] + b[1]),
			],
			[0, 0, 0],
		)
		.map((n) => n / 2);

const facesAreaNormal3 = ({ vertices_coords, faces_vertices }) =>
	faces_vertices.map((fv) => polygonAreaNormal3(fv.map((v) => vertices_coords[v])));

// an L-shaped (non-convex) hexagon, with the vertices starting at a corner
// such that a triangle fan would create triangles outside of the polygon.
const lShape = [
	[2, 1],
	[1, 1],
	[1, 2],
	[0, 2],
	[0, 0],
	[2, 0],
];

// two copies of the L-shape in two different 3D planes, both tilted away
// from the XY plane: one tilted around the X axis, and one in a vertical
// plane (the XZ plane offset along Y) with its winding reversed.
const lShapes3D = () => {
	const angle = Math.PI / 5;
	const tilted = lShape.map(([x, y]) => [
		x,
		y * Math.cos(angle),
		y * Math.sin(angle) + 3,
	]);
	const vertical = lShape.map(([x, y]) => [x + 5, -2, y]);
	return {
		vertices_coords: tilted.concat(vertical),
		faces_vertices: [
			[0, 1, 2, 3, 4, 5],
			[11, 10, 9, 8, 7, 6],
		],
	};
};

test("triangulateEarcut3D, non-convex faces in multiple 3D planes", () => {
	const graph = lShapes3D();
	const triangles = ear.graph.triangulateEarcut3D(graph, earcut);
	// a 6-gon becomes 4 triangles. face order is maintained.
	expect(triangles).toHaveLength(8);
	triangles.slice(0, 4).forEach((tri) => tri.forEach((v) => expect(v).toBeLessThan(6)));
	triangles.slice(4).forEach((tri) => tri.forEach((v) => expect(v).toBeGreaterThan(5)));

	// the triangles exactly cover each face (L-shape area is 3), and
	// each triangle's winding matches the winding of its face.
	const facesNormal = facesAreaNormal3(graph);
	const trianglesNormal = facesAreaNormal3({ ...graph, faces_vertices: triangles });
	[0, 1].forEach((f) => {
		const faceTriangles = trianglesNormal.slice(f * 4, f * 4 + 4);
		const area = faceTriangles.reduce((sum, n) => sum + ear.math.magnitude3(n), 0);
		expect(area).toBeCloseTo(3);
		expect(ear.math.magnitude3(facesNormal[f])).toBeCloseTo(3);
		faceTriangles.forEach((n) =>
			expect(ear.math.dot3(n, facesNormal[f])).toBeGreaterThan(0),
		);
	});
});

test("triangulateEarcut3D, triangle fan fails on the same graph", () => {
	// confirm the test above is meaningful, a triangle fan does not cover the face
	const graph = lShapes3D();
	const triangles = ear.graph.triangulateConvexFacesVertices(graph);
	const area = facesAreaNormal3({ ...graph, faces_vertices: triangles })
		.slice(0, 4)
		.reduce((sum, n) => sum + ear.math.magnitude3(n), 0);
	expect(area).not.toBeCloseTo(3);
});

test("triangulate with earcut, 3D graph uses triangulateEarcut3D", () => {
	const graph = lShapes3D();
	const { result } = ear.graph.triangulate(graph, earcut);
	expect(JSON.stringify(result.faces_vertices)).toBe(
		JSON.stringify(ear.graph.triangulateEarcut3D(graph, earcut)),
	);
});

test("triangulateEarcut3D, folded frame", () => {
	const fold = JSON.parse(fs.readFileSync("./tests/files/fold/frame.fold", "utf-8"));
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const { result, changes } = ear.graph.triangulate(folded, earcut);
	// every face is replaced by (number of vertices - 2) triangles
	changes.faces.map.forEach((triangles, f) =>
		expect(triangles).toHaveLength(folded.faces_vertices[f].length - 2),
	);
	const facesNormal = facesAreaNormal3(folded);
	const trianglesNormal = facesAreaNormal3(result);
	changes.faces.map.forEach((triangles, f) => {
		const area = triangles.reduce(
			(sum, t) => sum + ear.math.magnitude3(trianglesNormal[t]),
			0,
		);
		expect(area).toBeCloseTo(ear.math.magnitude3(facesNormal[f]));
		// some faces contain collinear vertices, ignore degenerate triangles
		triangles
			.filter((t) => ear.math.magnitude3(trianglesNormal[t]) > 1e-6)
			.forEach((t) =>
				expect(ear.math.dot3(trianglesNormal[t], facesNormal[f])).toBeGreaterThan(0),
			);
	});
});
