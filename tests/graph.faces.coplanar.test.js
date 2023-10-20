import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("coplanar faces groups", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const planes = ear.graph.coplanarFacesGroups(foldedFrame);
	fs.writeFileSync(`./tests/tmp/coplanar-planes.json`, JSON.stringify(planes, null, 2));

	// ensure all faces are accounted for.
	const totalFaceCount = foldedFrame.faces_vertices.length;
	const faceFound = [];
	planes.forEach(el => el.faces.forEach(f => { faceFound[f] = true; }));
	expect(faceFound.filter(a => a !== undefined).length).toBe(totalFaceCount);

	// ensure face normals directions match.
	const facesNormal = ear.graph.makeFacesNormal(foldedFrame);
	planes.forEach(el => {
		const planeFacesDot = el.faces
			.map(f => ear.math.dot(el.plane.normal, facesNormal[f]));
		// if aligned is true, dot product should be 1. if false, should be -1.
		el.facesAligned.forEach((a, i) => (a
			? expect(planeFacesDot[i]).toBeCloseTo(1)
			: expect(planeFacesDot[i]).toBeCloseTo(-1)));
	});
});

test("coplanarOverlappingFacesGroups", () => {
	const foldFile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const foldObject = JSON.parse(foldFile);
	const foldedFrame = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
	const groups = ear.graph.coplanarOverlappingFacesGroups(foldedFrame);
	fs.writeFileSync(
		`./tests/tmp/coplanar-overlapping-faces.json`,
		JSON.stringify(groups, null, 2),
	);

	// ensure all faces are accounted for.
	const totalFaceCount = foldedFrame.faces_vertices.length;
	const faceFound = [];
	groups.sets_faces.forEach(set => set.forEach(f => { faceFound[f] = true; }));
	expect(faceFound.filter(a => a !== undefined).length).toBe(totalFaceCount);
});
