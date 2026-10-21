import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

test("makeFacesNormal crease pattern", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane-cp.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	const faceNormals = ear.graph.makeFacesNormal(FOLD);
	faceNormals
		.map((normal) => ear.math.dot(normal, [0, 0, 1]))
		.forEach((dot) => expect(dot).toBeCloseTo(1));
});

test("makeFacesNormal non-convex face, first corner is reflex", () => {
	// an L-shape (counter-clockwise), starting at the reflex corner [1, 1]
	const lShape = [
		[1, 1],
		[1, 2],
		[0, 2],
		[0, 0],
		[2, 0],
		[2, 1],
	];
	const graph = {
		vertices_coords: lShape,
		faces_vertices: [
			[0, 1, 2, 3, 4, 5],
			[5, 4, 3, 2, 1, 0],
		],
	};
	const faceNormals = ear.graph.makeFacesNormal(graph);
	expect(ear.math.dot(faceNormals[0], [0, 0, 1])).toBeCloseTo(1);
	expect(ear.math.dot(faceNormals[1], [0, 0, -1])).toBeCloseTo(1);
});

test("makeFacesNormal non-convex face in 3D, with a collinear vertex", () => {
	// the same L-shape rotated into the XZ plane, with an extra collinear
	// vertex [1.5, 1] next to the reflex corner. the normal is -Y.
	const lShape = [
		[1, 1],
		[1, 2],
		[0, 2],
		[0, 0],
		[2, 0],
		[2, 1],
		[1.5, 1],
	];
	const graph = {
		vertices_coords: lShape.map(([x, y]) => [x, 4, y]),
		faces_vertices: [[0, 1, 2, 3, 4, 5, 6]],
	};
	const [normal] = ear.graph.makeFacesNormal(graph);
	expect(ear.math.dot(normal, [0, -1, 0])).toBeCloseTo(1);
});

test("makeFacesNormal folded frame, top ring planarized", () => {
	// planarizing the overlapping top ring of the frame creates non-convex
	// faces, some begin at a reflex corner. all normals should match.
	const fold = JSON.parse(fs.readFileSync("./tests/files/fold/frame.fold", "utf-8"));
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const { planes_faces, planes_transform } = ear.graph.getFacesPlane(folded);
	const graph3 = {
		...folded,
		vertices_coords: folded.vertices_coords.map(ear.math.resize3),
	};
	const subgraph = ear.graph.subgraphWithFaces(graph3, planes_faces[0]);
	const graphXY = {
		...subgraph,
		vertices_coords: subgraph.vertices_coords.map((coord) =>
			ear.math.resize2(ear.math.multiplyMatrix4Vector3(planes_transform[0], coord)),
		),
	};
	const planar = ear.graph.planarize(graphXY);
	const faceNormals = ear.graph.makeFacesNormal(planar);
	expect(faceNormals).toHaveLength(12);
	faceNormals.forEach((normal) => expect(ear.math.dot(normal, [0, 0, 1])).toBeCloseTo(1));
});

test("makeVerticesNormal crease pattern", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane-cp.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	const verticesNormal = ear.graph.makeVerticesNormal(FOLD);
	verticesNormal
		.map((normal) => ear.math.dot(normal, [0, 0, 1]))
		.forEach((dot) => expect(dot).toBeCloseTo(1));
});

test("makeFacesNormal flat folded form", () => {
	const foldfile = fs.readFileSync(
		"./tests/files/fold/preliminary-offset-cp.fold",
		"utf-8",
	);
	const graph = JSON.parse(foldfile);
	const vertices_coords = ear.graph.makeVerticesCoordsFlatFolded(graph);
	const folded = { ...graph, vertices_coords };
	const faceNormals = ear.graph.makeFacesNormal(folded);
	expect(ear.math.dot(faceNormals[0], [0, 0, 1])).toBeCloseTo(1);
	expect(ear.math.dot(faceNormals[1], [0, 0, -1])).toBeCloseTo(1);
	expect(ear.math.dot(faceNormals[2], [0, 0, -1])).toBeCloseTo(1);
	expect(ear.math.dot(faceNormals[3], [0, 0, 1])).toBeCloseTo(1);
	expect(ear.math.dot(faceNormals[4], [0, 0, 1])).toBeCloseTo(1);
	expect(ear.math.dot(faceNormals[5], [0, 0, -1])).toBeCloseTo(1);
});

test("makeFacesNormal 3d form", () => {
	const sphere = fs.readFileSync("./tests/files/obj/sphere-with-holes.obj", "utf-8");
	const FOLD = ear.convert.objToFold(sphere);
	const facesNormals = ear.graph.makeFacesNormal(FOLD);
	const m1 = facesNormals.filter((normal) => ear.math.dot(normal, [1, 0, 0]) > 0.999);
	const m2 = facesNormals.filter((normal) => ear.math.dot(normal, [-1, 0, 0]) > 0.999);
	const m3 = facesNormals.filter((normal) => ear.math.dot(normal, [0, 1, 0]) > 0.999);
	const m4 = facesNormals.filter((normal) => ear.math.dot(normal, [0, -1, 0]) > 0.999);
	const m5 = facesNormals.filter((normal) => ear.math.dot(normal, [0, 0, 1]) > 0.999);
	const m6 = facesNormals.filter((normal) => ear.math.dot(normal, [0, 0, -1]) > 0.999);
	expect(m1.length).toBe(0);
	expect(m2.length).toBe(0);
	expect(m3.length).toBe(0);
	expect(m4.length).toBe(0);
	expect(m5.length).toBe(0);
	expect(m6.length).toBe(0);
});

test("makeVerticesNormal 3d form", () => {
	const sphere = fs.readFileSync("./tests/files/obj/sphere-with-holes.obj", "utf-8");
	const FOLD = ear.convert.objToFold(sphere);
	const verticesNormal = ear.graph.makeVerticesNormal(FOLD);

	const m1 = verticesNormal.filter((normal) => ear.math.dot(normal, [0, 1, 0]) > 0.999);
	const m2 = verticesNormal.filter((normal) => ear.math.dot(normal, [0, -1, 0]) > 0.999);
	const m3 = verticesNormal.filter((normal) => ear.math.dot(normal, [0, 0, -1]) > 0.999);
	expect(m1.length).toBe(1);
	expect(m2.length).toBe(1);
	expect(m3.length).toBe(1);
});

test("normals 3D many planes", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/square-fish-3d.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const vertices_coords = ear.graph.makeVerticesCoordsFolded(graph);
	const folded = { ...graph, vertices_coords };
	const faces_normal = ear.graph.makeFacesNormal(folded);
	const normals = [
		[0, 0, 1],
		[0, 0, -1],
		[0, 0, -1],
		[0, 0, 1],
		[0.9238795325112866, -0.38268343236509034, 0],
		[-0.9238795325112866, 0.38268343236509034, 0],
		[0.9238795325112863, 0.3826834323650909, 0],
		[-0.923879532511287, -0.38268343236508917, 0],
		[0, 0, -1],
		[0, 0, -1],
		[0, -1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[0, 0, 1],
		[0, 0, 1],
		[0, -1, 0],
	];
	normals.forEach((normal, i) =>
		normal.forEach((n, j) => expect(faces_normal[i][j]).toBeCloseTo(n)),
	);
});
