import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

// test("make folded coords", () => {
// 	const foldFile = fs.readFileSync("./tests/files/fold/strip-with-angle.fold", "utf-8");
// 	const foldObject = JSON.parse(foldFile);

// 	fs.writeFileSync(`./tests/tmp/folded-coords.json`, JSON.stringify(ear.graph.makeVerticesCoordsFolded(foldObject, [2]).map(p => p.map(n => ear.general.cleanNumber(n, 12))), null, 2));
// });

test("getFacesPlane, disjoint", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/disjoint-triangles-3d.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const {
		planes,
		planes_faces,
		faces_plane,
		faces_winding,
	} = ear.graph.getFacesPlane(foldedFrame);
	fs.writeFileSync(`./tests/tmp/coplanar-planes-disjoint.json`, JSON.stringify({
		planes,
		planes_faces,
		faces_plane,
		faces_winding,
	}, null, 2));

	expect(planes.length).toBe(3);

	// plane 0
	expect(JSON.stringify(planes_faces[0]))
		.toBe(JSON.stringify([0, 1, 4, 5, 8, 11]));
	expect(JSON.stringify(planes_faces[0].map(face => faces_winding[face])))
		.toBe(JSON.stringify([true, true, true, true, true, false]));
	expect(planes[0].origin[0]).toBeCloseTo(0);
	expect(planes[0].origin[1]).toBeCloseTo(0);
	expect(planes[0].origin[2]).toBeCloseTo(0);
	expect(planes[0].normal[0]).toBeCloseTo(0);
	expect(planes[0].normal[1]).toBeCloseTo(0);
	expect(planes[0].normal[2]).toBeCloseTo(1);

	// plane 1
	expect(JSON.stringify(planes_faces[1]))
		.toBe(JSON.stringify([13]));
	expect(JSON.stringify(planes_faces[1].map(face => faces_winding[face])))
		.toBe(JSON.stringify([true]));
	expect(planes[1].origin[0]).toBeCloseTo(0);
	expect(planes[1].origin[1]).toBeCloseTo(0);
	expect(planes[1].origin[2]).toBeCloseTo(0.5);
	expect(planes[1].normal[0]).toBeCloseTo(0);
	expect(planes[1].normal[1]).toBeCloseTo(0);
	expect(planes[1].normal[2]).toBeCloseTo(1);

	// plane 2
	expect(JSON.stringify(planes_faces[2]))
		.toBe(JSON.stringify([2, 3, 6, 7, 9, 10, 12]));
	expect(JSON.stringify(planes_faces[2].map(face => faces_winding[face])))
		.toBe(JSON.stringify([true, true, true, true, true, true, false]));
	expect(planes[2].origin[0]).toBeCloseTo(0);
	expect(planes[2].origin[1]).toBeCloseTo(0);
	expect(planes[2].origin[2]).toBeCloseTo(0);
	expect(planes[2].normal[0]).toBeCloseTo(0);
	expect(planes[2].normal[1]).toBeCloseTo(1);
	expect(planes[2].normal[2]).toBeCloseTo(0);
});


test("getFacesPlane, disjoint and separated", () => {
	// fold this from the crease pattern, a lot fewer faces are now overlapping
	const foldFile = fs.readFileSync("./tests/files/fold/disjoint-triangles-3d.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const creasePattern = ear.graph.getFramesByClassName(foldObject, "creasePattern")[0];
	const foldedForm = {
		...creasePattern,
		vertices_coords: ear.graph.makeVerticesCoordsFolded(creasePattern),
	}
	const {
		planes,
		planes_faces,
		faces_plane,
		faces_winding,
	} = ear.graph.getFacesPlane(foldedForm);
	fs.writeFileSync(`./tests/tmp/coplanar-planes-disjoint-separated.json`, JSON.stringify({
		planes,
		planes_faces,
		faces_plane,
		faces_winding,
	}, null, 2));

	expect(planes.length).toBe(2);

	// plane 0
	expect(JSON.stringify(planes_faces[0]))
		.toBe(JSON.stringify([0, 1, 4, 5, 8, 10, 12]));
	expect(JSON.stringify(planes_faces[0].map(face => faces_winding[face])))
		.toBe(JSON.stringify([true, true, true, true, true, true, true]));
	expect(planes[0].origin[0]).toBeCloseTo(0);
	expect(planes[0].origin[1]).toBeCloseTo(0);
	expect(planes[0].origin[2]).toBeCloseTo(0);
	expect(planes[0].normal[0]).toBeCloseTo(0);
	expect(planes[0].normal[1]).toBeCloseTo(0);
	expect(planes[0].normal[2]).toBeCloseTo(1);

	// plane 1
	expect(JSON.stringify(planes_faces[1]))
		.toBe(JSON.stringify([2, 3, 6, 7, 9, 11, 13]));
	expect(JSON.stringify(planes_faces[1].map(face => faces_winding[face])))
		.toBe(JSON.stringify([true, true, true, true, true, true, true]));
	expect(planes[1].origin[0]).toBeCloseTo(0);
	expect(planes[1].origin[1]).toBeCloseTo(0);
	expect(planes[1].origin[2]).toBeCloseTo(0);
	expect(planes[1].normal[0]).toBeCloseTo(0);
	expect(planes[1].normal[1]).toBeCloseTo(1);
	expect(planes[1].normal[2]).toBeCloseTo(0);
});

test("getFacesPlane, maze", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.getFacesPlane(foldedFrame);
	fs.writeFileSync(`./tests/tmp/coplanar-planes-maze-u.json`, JSON.stringify(result, null, 2));

	// ensure all faces are accounted for.
	const totalFaceCount = foldedFrame.faces_vertices.length;
	const faceFound = [];
	result.planes_faces.forEach(el => el.forEach(f => { faceFound[f] = true; }));
	expect(faceFound.filter(a => a !== undefined).length).toBe(totalFaceCount);

	// ensure face normals directions match.
	const facesNormal = ear.graph.makeFacesNormal(foldedFrame);
	result.faces_plane.forEach((plane, f) => {
		const planeFacesDot = ear.math.dot(result.planes[plane].normal, facesNormal[f]);
		// if aligned is true, dot product should be 1. if false, should be -1.
		expect(planeFacesDot).toBeCloseTo(result.faces_winding[f] ? 1 : -1);
	});
});


test("getCoplanarAdjacentOverlappingFaces", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/disjoint-triangles-3d.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.getCoplanarAdjacentOverlappingFaces(foldedFrame);
	fs.writeFileSync(
		`./tests/tmp/coplanar-overlapping-faces-disjoint-triangles.json`,
		JSON.stringify(result, null, 2),
	);

	// ensure all faces are accounted for.
	const totalFaceCount = foldedFrame.faces_vertices.length;
	const faceFound = [];
	result.clusters_faces.forEach(set => set.forEach(f => { faceFound[f] = true; }));
	expect(faceFound.filter(a => a !== undefined).length).toBe(totalFaceCount);
});

test("getCoplanarAdjacentOverlappingFaces", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.getCoplanarAdjacentOverlappingFaces(foldedFrame);
	fs.writeFileSync(
		`./tests/tmp/coplanar-overlapping-faces.json`,
		JSON.stringify(result, null, 2),
	);

	// ensure all faces are accounted for.
	const totalFaceCount = foldedFrame.faces_vertices.length;
	const faceFound = [];
	result.clusters_faces.forEach(set => set.forEach(f => { faceFound[f] = true; }));
	expect(faceFound.filter(a => a !== undefined).length).toBe(totalFaceCount);
});

test("coplanar and overlapping disjoint faces", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/disjoint-triangles-3d.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.getCoplanarAdjacentOverlappingFaces(foldedFrame);
	fs.writeFileSync(`./tests/tmp/coplanar-overlapping-planes-disjoint.json`, JSON.stringify(result, null, 2));

	const {
		planes,
		planes_transform,
		faces_winding,
		planes_faces,
		faces_plane,
		planes_clusters,
		clusters_plane,
		clusters_faces,
		faces_cluster,
	} = result;

	expect(planes.length).toBe(3);

	// plane 0
	expect(JSON.stringify(planes_faces[0]))
		.toBe(JSON.stringify([0, 1, 4, 5, 8, 11]));
	expect(JSON.stringify(planes_faces[0].map(f => faces_winding[f])))
		.toBe(JSON.stringify([true, true, true, true, true, false]));
	expect(planes[0].origin[0]).toBeCloseTo(0);
	expect(planes[0].origin[1]).toBeCloseTo(0);
	expect(planes[0].origin[2]).toBeCloseTo(0);
	expect(planes[0].normal[0]).toBeCloseTo(0);
	expect(planes[0].normal[1]).toBeCloseTo(0);
	expect(planes[0].normal[2]).toBeCloseTo(1);

	// plane 1
	expect(JSON.stringify(planes_faces[1]))
		.toBe(JSON.stringify([13]));
	expect(JSON.stringify(planes_faces[1].map(f => faces_winding[f])))
		.toBe(JSON.stringify([true]));
	expect(planes[1].origin[0]).toBeCloseTo(0);
	expect(planes[1].origin[1]).toBeCloseTo(0);
	expect(planes[1].origin[2]).toBeCloseTo(0.5);
	expect(planes[1].normal[0]).toBeCloseTo(0);
	expect(planes[1].normal[1]).toBeCloseTo(0);
	expect(planes[1].normal[2]).toBeCloseTo(1);

	// plane 2
	expect(JSON.stringify(planes_faces[2]))
		.toBe(JSON.stringify([2, 3, 6, 7, 9, 10, 12]));
	expect(JSON.stringify(planes_faces[2].map(f => faces_winding[f])))
		.toBe(JSON.stringify([true, true, true, true, true, true, false]));
	expect(planes[2].origin[0]).toBeCloseTo(0);
	expect(planes[2].origin[1]).toBeCloseTo(0);
	expect(planes[2].origin[2]).toBeCloseTo(0);
	expect(planes[2].normal[0]).toBeCloseTo(0);
	expect(planes[2].normal[1]).toBeCloseTo(1);
	expect(planes[2].normal[2]).toBeCloseTo(0);
});

test("coplanar and overlapping faces, command strip", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/command-strip.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);

	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.getCoplanarAdjacentOverlappingFaces(foldedFrame);
	fs.writeFileSync(`./tests/tmp/coplanar-overlapping-command-strip.json`, JSON.stringify(result, null, 2));

	const {
		planes,
		planes_transform,
		faces_winding,
		planes_faces,
		faces_plane,
		planes_clusters,
		clusters_plane,
		clusters_faces,
		faces_cluster,
	} = result;

	expect(planes.length).toBe(8);
	expect(planes_transform.length).toBe(8);
	expect(faces_winding.length).toBe(foldedFrame.faces_vertices.length);

	// 4 planes contain 2 faces, 4 planes contain 3 faces
	expect(planes_faces.filter(arr => arr.length === 2).length).toBe(4);
	expect(planes_faces.filter(arr => arr.length === 3).length).toBe(4);

	expect(JSON.stringify(faces_plane))
		.toBe(JSON.stringify([0, 6, 1, 5, 0, 4, 1, 5, 2, 4, 3, 5, 2, 6, 3, 7, 2, 6, 1, 7]));

	// all clusters have one face only, so here, clusters should match faces
	// 4 planes contain 2 clusters, 4 planes contain 3 clusters
	expect(planes_clusters.filter(arr => arr.length === 2).length).toBe(4);
	expect(planes_clusters.filter(arr => arr.length === 3).length).toBe(4);

	expect(JSON.stringify(clusters_plane))
		.toBe(JSON.stringify([0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7]));

	// every cluster should only contain one face
	clusters_faces.forEach(faces => expect(faces.length).toBe(1));

	// faces and clusters should be 1:1. 20 unique clusters
	expect(Array.from(new Set(faces_cluster)).length).toBe(20);
});

test("coplanar and overlapping faces, command strip with back", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/command-strip-with-back.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);

	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.getCoplanarAdjacentOverlappingFaces(foldedFrame);
	fs.writeFileSync(`./tests/tmp/coplanar-overlapping-command-strip-with-back.json`, JSON.stringify(result, null, 2));

	const {
		planes,
		planes_transform,
		faces_winding,
		planes_faces,
		faces_plane,
		planes_clusters,
		clusters_plane,
		clusters_faces,
		faces_cluster,
	} = result;

	expect(planes.length).toBe(9);
	expect(planes_transform.length).toBe(9);
	expect(faces_winding.length).toBe(54);

	// 4 planes contain 2 faces, 4 planes contain 3 faces
	// 54 (total) - (2*4) - (3*4)
	expect(planes_faces.filter(arr => arr.length === 2).length).toBe(4);
	expect(planes_faces.filter(arr => arr.length === 3).length).toBe(4);
	expect(planes_faces.filter(arr => arr.length === 34).length).toBe(1);

	expect(JSON.stringify(faces_plane))
		.toBe(JSON.stringify([0, 6, 1, 5, 0, 4, 1, 5, 2, 4, 3, 5, 2, 6, 3, 7, 2, 6, 1, 7,
			8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
			8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]));
	// all clusters have one face only, so here, clusters should match faces
	// 4 planes contain 2 clusters, 4 planes contain 3 clusters
	expect(planes_clusters.filter(arr => arr.length === 2).length).toBe(4);
	expect(planes_clusters.filter(arr => arr.length === 3).length).toBe(4);
	expect(planes_clusters.filter(arr => arr.length === 1).length).toBe(1);

	expect(JSON.stringify(clusters_plane))
		.toBe(JSON.stringify([0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 8]));

	// // every cluster should only contain one face
	// clusters_faces.forEach(faces => expect(faces.length).toBe(1));

	// // faces and clusters should be 1:1. 20 unique clusters
	// expect(Array.from(new Set(faces_cluster)).length).toBe(20);
});

test("coplanar and overlapping faces, square tube with overlap", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/square-tube-with-overlap.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);

	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.getCoplanarAdjacentOverlappingFaces(foldedFrame);
	fs.writeFileSync(`./tests/tmp/coplanar-overlapping-square-tube-with-overlap.json`, JSON.stringify(result, null, 2));

	const {
		planes,
		planes_transform,
		faces_winding,
		planes_faces,
		faces_plane,
		planes_clusters,
		clusters_plane,
		clusters_faces,
		faces_cluster,
	} = result;

	expect(planes.length).toBe(4);
	expect(planes_transform.length).toBe(4);
	expect(faces_winding.length).toBe(foldedFrame.faces_vertices.length);

	expect(JSON.stringify(planes_faces))
		.toBe(JSON.stringify([[0, 4, 5, 6], [2, 8], [1, 9], [3, 7]]));
	expect(JSON.stringify(faces_plane))
		.toBe(JSON.stringify([0, 2, 1, 3, 0, 0, 0, 3, 1, 2]));
	expect(JSON.stringify(planes_clusters))
		.toBe(JSON.stringify([[0], [1], [2], [3]]));
	expect(JSON.stringify(clusters_plane))
		.toBe(JSON.stringify([0, 1, 2, 3]));
	expect(JSON.stringify(clusters_faces))
		.toBe(JSON.stringify([[0, 5, 4, 6], [2, 8], [1, 9], [3, 7]]));
	expect(JSON.stringify(faces_cluster))
		.toBe(JSON.stringify([0, 2, 1, 3, 0, 0, 0, 3, 1, 2]));
});

test("coplanar and overlapping faces, strip with angle", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/strip-with-angle.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);

	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.getCoplanarAdjacentOverlappingFaces(foldedFrame);
	fs.writeFileSync(
		`./tests/tmp/coplanar-overlapping-strip-with-angle.json`,
		JSON.stringify(result, null, 2),
	);

	const {
		planes,
		planes_transform,
		faces_winding,
		planes_faces,
		faces_plane,
		planes_clusters,
		clusters_plane,
		clusters_faces,
		faces_cluster,
	} = result;

	expect(planes.length).toBe(4);
	expect(planes_transform.length).toBe(4);
	expect(faces_winding.length).toBe(foldedFrame.faces_vertices.length);

	expect(JSON.stringify(planes_faces))
		.toBe(JSON.stringify([[0, 5], [2, 3], [1], [4]]));
	expect(JSON.stringify(faces_plane))
		.toBe(JSON.stringify([0, 2, 1, 1, 3, 0]));
	expect(JSON.stringify(planes_clusters))
		.toBe(JSON.stringify([[0], [1], [2], [3]]));
	expect(JSON.stringify(clusters_plane))
		.toBe(JSON.stringify([0, 1, 2, 3]));
	expect(JSON.stringify(clusters_faces))
		.toBe(JSON.stringify([[0, 5], [2, 3], [1], [4]]));
	expect(JSON.stringify(faces_cluster))
		.toBe(JSON.stringify([0, 2, 1, 1, 3, 0]));
});

test("coplanar and overlapping faces, Mooser's train", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/moosers-train.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.getCoplanarAdjacentOverlappingFaces(foldedFrame);
	fs.writeFileSync(`./tests/tmp/coplanar-overlapping-faces-mooser.json`, JSON.stringify(result, null, 2));

	const {
		planes,
		planes_transform,
		faces_winding,
		planes_faces,
		faces_plane,
		planes_clusters,
		clusters_plane,
		clusters_faces,
		faces_cluster,
	} = result;

	// expect(planes.length).toBe(3);

	// // plane 0
	// expect(JSON.stringify(planes_faces[0]))
	// 	.toBe(JSON.stringify([0, 1, 4, 5, 8, 11]));
	// expect(JSON.stringify(planes_faces[0].map(f => faces_winding[f])))
	// 	.toBe(JSON.stringify([true, true, true, true, true, false]));
	// expect(planes[0].origin[0]).toBeCloseTo(0);
	// expect(planes[0].origin[1]).toBeCloseTo(0);
	// expect(planes[0].origin[2]).toBeCloseTo(0);
	// expect(planes[0].normal[0]).toBeCloseTo(0);
	// expect(planes[0].normal[1]).toBeCloseTo(0);
	// expect(planes[0].normal[2]).toBeCloseTo(1);

});


test("coplanar and overlapping disjoint faces and separated", () => {
	// fold this from the crease pattern, a lot fewer faces are now overlapping
	const foldFile = fs.readFileSync("./tests/files/fold/disjoint-triangles-3d.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const creasePattern = ear.graph.getFramesByClassName(foldObject, "creasePattern")[0];
	const foldedForm = {
		...creasePattern,
		vertices_coords: ear.graph.makeVerticesCoordsFolded(creasePattern),
	}
	const planes = ear.graph.getCoplanarAdjacentOverlappingFaces(foldedForm);
	fs.writeFileSync(`./tests/tmp/coplanar-overlapping-planes-disjoint-separated.json`, JSON.stringify(planes, null, 2));
});
