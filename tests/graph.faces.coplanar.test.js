import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("coplanar disjoint faces", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/disjoint-triangles-3d.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const {
		planes,
		planes_faces,
		faces_plane,
		faces_winding,
	} = ear.graph.coplanarFacesGroups(foldedFrame);
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


test("coplanar disjoint faces and separated", () => {
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
	} = ear.graph.coplanarFacesGroups(foldedForm);
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

test("coplanar faces groups", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.coplanarFacesGroups(foldedFrame);
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


test("coplanarOverlappingFacesGroups", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/disjoint-triangles-3d.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const result = ear.graph.coplanarOverlappingFacesGroups(foldedFrame);
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

// test("coplanarOverlappingFacesGroups", () => {
// 	const foldFile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
// 	const foldObject = JSON.parse(foldFile);
// 	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
// 	const groups = ear.graph.coplanarOverlappingFacesGroups(foldedFrame);
// 	fs.writeFileSync(
// 		`./tests/tmp/coplanar-overlapping-faces.json`,
// 		JSON.stringify(groups, null, 2),
// 	);

// 	// ensure all faces are accounted for.
// 	const totalFaceCount = foldedFrame.faces_vertices.length;
// 	const faceFound = [];
// 	groups.sets_faces.forEach(set => set.forEach(f => { faceFound[f] = true; }));
// 	expect(faceFound.filter(a => a !== undefined).length).toBe(totalFaceCount);
// });

// test("coplanar and overlapping disjoint faces", () => {
// 	const foldFile = fs.readFileSync("./tests/files/fold/disjoint-triangles-3d.fold", "utf-8");
// 	const foldObject = JSON.parse(foldFile);
// 	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
// 	const planes = ear.graph.coplanarOverlappingFacesGroups(foldedFrame);
// 	fs.writeFileSync(`./tests/tmp/coplanar-overlapping-planes-disjoint.json`, JSON.stringify(planes, null, 2));

// 	expect(planes.length).toBe(3);

// 	// plane 0
// 	expect(JSON.stringify(planes[0].faces))
// 		.toBe(JSON.stringify([0, 1, 4, 5, 8, 11]));
// 	expect(JSON.stringify(planes[0].facesAligned))
// 		.toBe(JSON.stringify([true, true, true, true, true, false]));
// 	expect(planes[0].plane.origin[0]).toBeCloseTo(0);
// 	expect(planes[0].plane.origin[1]).toBeCloseTo(0);
// 	expect(planes[0].plane.origin[2]).toBeCloseTo(0);
// 	expect(planes[0].plane.normal[0]).toBeCloseTo(0);
// 	expect(planes[0].plane.normal[1]).toBeCloseTo(0);
// 	expect(planes[0].plane.normal[2]).toBeCloseTo(1);

// 	// plane 1
// 	expect(JSON.stringify(planes[1].faces))
// 		.toBe(JSON.stringify([13]));
// 	expect(JSON.stringify(planes[1].facesAligned))
// 		.toBe(JSON.stringify([true]));
// 	expect(planes[1].plane.origin[0]).toBeCloseTo(0);
// 	expect(planes[1].plane.origin[1]).toBeCloseTo(0);
// 	expect(planes[1].plane.origin[2]).toBeCloseTo(0.5);
// 	expect(planes[1].plane.normal[0]).toBeCloseTo(0);
// 	expect(planes[1].plane.normal[1]).toBeCloseTo(0);
// 	expect(planes[1].plane.normal[2]).toBeCloseTo(1);

// 	// plane 2
// 	expect(JSON.stringify(planes[2].faces))
// 		.toBe(JSON.stringify([2, 3, 6, 7, 9, 10, 12]));
// 	expect(JSON.stringify(planes[2].facesAligned))
// 		.toBe(JSON.stringify([true, true, true, true, true, true, false]));
// 	expect(planes[2].plane.origin[0]).toBeCloseTo(0);
// 	expect(planes[2].plane.origin[1]).toBeCloseTo(0);
// 	expect(planes[2].plane.origin[2]).toBeCloseTo(0);
// 	expect(planes[2].plane.normal[0]).toBeCloseTo(0);
// 	expect(planes[2].plane.normal[1]).toBeCloseTo(1);
// 	expect(planes[2].plane.normal[2]).toBeCloseTo(0);
// });


// test("coplanar and overlapping disjoint faces and separated", () => {
// 	// fold this from the crease pattern, a lot fewer faces are now overlapping
// 	const foldFile = fs.readFileSync("./tests/files/fold/disjoint-triangles-3d.fold", "utf-8");
// 	const foldObject = JSON.parse(foldFile);
// 	const creasePattern = ear.graph.getFramesByClassName(foldObject, "creasePattern")[0];
// 	const foldedForm = {
// 		...creasePattern,
// 		vertices_coords: ear.graph.makeVerticesCoordsFolded(creasePattern),
// 	}
// 	const planes = ear.graph.coplanarOverlappingFacesGroups(foldedForm);
// 	fs.writeFileSync(`./tests/tmp/coplanar-overlapping-planes-disjoint-separated.json`, JSON.stringify(planes, null, 2));
// });
