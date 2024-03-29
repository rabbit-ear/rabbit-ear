import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("makeSolverConstraints3D cube octagon", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/cube-octagon.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);

	const expectedJSON = fs.readFileSync("./tests/files/json/cube-octagon-constraints.json", "utf-8");
	const expected = JSON.parse(expectedJSON);

	const solverConstraints = ear.layer.makeSolverConstraints3D(folded);
	// console.log(JSON.stringify(solverConstraints));
	expect(solverConstraints).toMatchObject(expected);
});

test("makeSolverConstraints3D layer 3D test cases", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/layer3d-cases.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const frames = ear.graph.getFileFramesAsArray(fold);
	const foldedForms = frames.map(frame => ({
		...frame,
		vertices_coords: ear.graph.makeVerticesCoordsFolded(frame),
	}));
	foldedForms.forEach(folded => ear.graph.populate(folded));

	const results = foldedForms
		.map(folded => ear.layer.makeSolverConstraints3D(folded));

	expect(results[0].constraints).toMatchObject({
		taco_taco: [], taco_tortilla: [], tortilla_tortilla: [], transitivity: [],
	});
	expect(results[0].facePairs).toMatchObject(["0 4"]);
	// expect(results[0].orders).toMatchObject({ "0 4": 1 }); // todo

	expect(results[1].constraints).toMatchObject({
		taco_taco: [],
		taco_tortilla: [],
		tortilla_tortilla: [[1, 2, 4, 3]],
		transitivity: [],
	});
	expect(results[1].facePairs).toMatchObject(["1 4", "2 3"]);
	expect(results[1].orders).toMatchObject({ "1 4": 2, "2 3": 2 });

	expect(results[2].constraints).toMatchObject({
		taco_taco: [],
		taco_tortilla: [],
		tortilla_tortilla: [[1, 2, 4, 3]],
		transitivity: [],
	});
	expect(results[2].facePairs).toMatchObject(["1 4", "2 3"]);
	expect(results[2].orders).toMatchObject({ "1 4": 2, "2 3": 2 });

	expect(results[3].constraints).toMatchObject({
		taco_taco: [],
		taco_tortilla: [],
		tortilla_tortilla: [[1, 2, 4, 3], [0, 1, 5, 4]],
		transitivity: [],
	});
	expect(results[3].facePairs).toMatchObject(["0 5", "1 4", "2 3"]);
	expect(results[3].orders).toMatchObject({ "2 3": 2 });

	// only 3 pairs of faces overlap each other: 1-9, 2-8, 3-7
	// - 2 tortilla_tortilla between the overlapping 3 sets.
	expect(results[4].constraints).toMatchObject({
		taco_taco: [],
		taco_tortilla: [],
		tortilla_tortilla: [[1, 2, 9, 8], [2, 3, 8, 7]],
		transitivity: [],
	});
	expect(results[4].facePairs).toMatchObject(["1 9", "2 8", "3 7"]);
	// 1-9 via the 3d overlapping edges algorithm
	// 3-7 via the 3d overlapping edges algorithm
	expect(results[4].orders).toMatchObject({ "1 9": 1 }); // , "3 7": 1 });

	// 3 pairs of faces overlap each other: 1-10, 2-9, 3-8
	// then another group of 4 faces all overlap each other: 4, 5, 6, 7
	// - 1 taco_taco in the group of overlapping 4 faces
	// - 2 taco_tortilla faces 4 and 7 have a "F" edge
	// - 3 tortilla_tortilla where 1-2-10-9 and 3-4-8-7 are "F" tortillas
	//   and 2-3-9-8 is a 3D-bent-tortilla at 90 degrees
	expect(results[5].constraints).toMatchObject({
		taco_taco: [[4, 6, 5, 7]],
		taco_tortilla: [[5, 4, 6], [5, 7, 6]],
		tortilla_tortilla: [[1, 2, 10, 9], [3, 4, 8, 7], [2, 3, 9, 8]],
		transitivity: [],
	});
	expect(results[5].facePairs).toMatchObject([
		"1 10", "2 9", "3 8", "4 5", "4 6", "4 7", "5 6", "5 7", "6 7"
	]);
	// 1-10 is known via the 3d overlapping edges algorithm
	// 4-5, 5-6, 6-7 are simply flat adjacent faces
	expect(results[5].orders).toMatchObject({
		"1 10": 1, "4 5": 2, "5 6": 1, "6 7": 1
	});
});

test("makeSolverConstraints3D coplanar angles 3D", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/coplanar-angles-3d.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const frame2 = ear.graph.flattenFrame(fold, 1);
	const folded1 = {
		...fold,
		vertices_coords: ear.graph.makeVerticesCoordsFolded(fold),
	};
	ear.graph.populate(folded1);

	const folded2 = {
		...frame2,
		vertices_coords: ear.graph.makeVerticesCoordsFolded(frame2),
	};
	ear.graph.populate(folded1);
	ear.graph.populate(folded2);

	// frame 2 has a longer side length that crosses one of the faces,
	// but everything should remain consistent
	expect(ear.layer.makeSolverConstraints3D(folded1))
		.toMatchObject(ear.layer.makeSolverConstraints3D(folded2));

	const {
		constraints: { taco_taco, taco_tortilla, tortilla_tortilla, transitivity },
		facePairs,
		faces_winding,
		orders,
	} = ear.layer.makeSolverConstraints3D(folded1);

	// faces 1, 3, 4, 5 are all coplanar.
	// face 0 is base plane
	// face 1 is angled plane
	expect(facePairs).toMatchObject(["1 3", "1 4", "1 5", "3 4", "3 5", "4 5"]);
	expect(faces_winding).toMatchObject([true, true, true, false, true, false]);
	expect(orders).toMatchObject({ "3 4": 1, "4 5": 2, "1 5": 1 });
	expect(taco_taco).toMatchObject([[3, 1, 4, 5]]);
	expect(taco_tortilla).toMatchObject([[4, 1, 5], [4, 3, 5]]);
	expect(tortilla_tortilla).toMatchObject([]);
	expect(transitivity).toMatchObject([]);

	// const result = ear.layer.getOverlappingParallelEdgePairs()
});

test("makeSolverConstraints3D panels 6x2", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/panels-6x2-90deg.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);

	const {
		constraints: { taco_taco, taco_tortilla, tortilla_tortilla, transitivity },
		facePairs,
		faces_winding,
		orders,
	} = ear.layer.makeSolverConstraints3D(folded);

	expect(facePairs).toMatchObject([
		// every permutation of pairs of these:
		// 0, 1, 2, 3, 4, 5
		"0 1", "0 2", "0 3", "0 4", "0 5", "1 2", "1 3", "1 4", "1 5",
		"2 3", "2 4", "2 5", "3 4", "3 5", "4 5",
		// every permutation of pairs of these:
		// 6, 7, 8, 9, 10, 11
		"6 7", "6 8", "6 9", "6 10", "6 11", "7 8", "7 9", "7 10", "7 11",
		"8 9", "8 10", "8 11", "9 10", "9 11", "10 11"
	]);
	expect(faces_winding).toMatchObject([
		true, false, true, false, true, false, true, false, true, false, true, false
	]);
	expect(orders).toMatchObject({
		"0 1": 2, "1 2": 2, "2 3": 2, "3 4": 1, "4 5": 1, "6 7": 2, "7 8": 2, "8 9": 2, "9 10": 1, "10 11": 1
	});

	expect(taco_taco).toMatchObject([
		[0, 2, 1, 3],
		[0, 4, 1, 5],
		[1, 3, 2, 4],
		[2, 4, 3, 5],
		[6, 8, 7, 9],
		[6, 10, 7, 11],
		[7, 9, 8, 10],
		[8, 10, 9, 11],
	]);

	expect(taco_tortilla).toMatchObject([]);

	expect(tortilla_tortilla).toMatchObject([
		[0, 6, 1, 7],
		[0, 6, 2, 8],
		[0, 6, 3, 9],
		[0, 6, 4, 10],
		[0, 6, 5, 11],
		[1, 7, 2, 8],
		[1, 7, 3, 9],
		[1, 7, 4, 10],
		[1, 7, 5, 11],
		[2, 8, 3, 9],
		[2, 8, 4, 10],
		[2, 8, 5, 11],
		[3, 9, 4, 10],
		[3, 9, 5, 11],
		[4, 10, 5, 11],
	]);

	expect(transitivity).toMatchObject([
		[0, 2, 4],
		[0, 2, 5],
		[0, 3, 4],
		[0, 3, 5],
		[1, 2, 5],
		[1, 3, 5],
		[6, 8, 10],
		[6, 8, 11],
		[6, 9, 10],
		[6, 9, 11],
		[7, 8, 11],
		[7, 9, 11],
	]);
});

// test("makeSolverConstraints3D maze-u", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	ear.graph.populate(folded);

// 	const expectedJSON = fs.readFileSync("./tests/files/json/maze-u-constraints.json", "utf-8");
// 	const expected = JSON.parse(expectedJSON);

// 	// these fields are tested.
// 	// - constraints: { taco_taco, taco_tortilla, tortilla_tortilla, transitivity }
// 	// - lookup
// 	// - facePairs
// 	// - faces_winding
// 	// - orders
// 	const solverConstraints = ear.layer.makeSolverConstraints3D(folded);
// 	expect(solverConstraints).toMatchObject(expected);
// });

// test("makeSolverConstraints3D maze-u 3D-only setup", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	ear.graph.populate(folded);

// 	const expectedJSON = fs.readFileSync("./tests/files/json/maze-u-constraints.json", "utf-8");
// 	const expected = JSON.parse(expectedJSON);

// 	const {
// 		// planes,
// 		planes_transform,
// 		faces_winding,
// 		// planes_faces,
// 		// faces_plane,
// 		// planes_clusters,
// 		clusters_plane,
// 		clusters_faces,
// 		faces_cluster,
// 	} = ear.graph.getCoplanarAdjacentOverlappingFaces(folded);

// 	// for every cluster, make a shallow copy of the input graph, containing
// 	// only the faces included in that cluster, and by extension, all edges and
// 	// vertices which are used by this subset of faces.
// 	const clusters_graph = clusters_faces
// 		.map(faces => ear.graph.subgraphWithFaces(folded, faces));

// 	// ensure all vertices_coords are 3D (make a copy array here) for use in
// 	// multiplyMatrix4Vector3, which requires points to be in 3D.
// 	const vertices_coords3D = folded.vertices_coords
// 		.map(coord => ear.math.resize(3, coord));

// 	// for each cluster, get the transform which, when applied, brings
// 	// all points into the XY plane.
// 	const clusters_transform = clusters_plane.map(p => planes_transform[p]);

// 	// transform all vertices_coords by the inverse transform
// 	// to bring them all into the XY plane. convert back into a 2D point.
// 	clusters_graph.forEach(({ vertices_coords: coords }, i) => {
// 		clusters_graph[i].vertices_coords = coords
// 			.map((_, v) => ear.math.multiplyMatrix4Vector3(
// 				clusters_transform[i],
// 				vertices_coords3D[v],
// 			))
// 			.map(([a, b]) => [a, b]);
// 	});

// 	// get a list of all edge indices which are non-flat edges.
// 	// non-flat edges are anything other than 0, -180, or +180 fold angles.
// 	const nonFlatEdges = folded.edges_foldAngle
// 		.map(ear.graph.edgeFoldAngleIsFlat)
// 		.map((flat, i) => (!flat ? i : undefined))
// 		.filter(a => a !== undefined);

// 	// remove any non-flat edges from the shallow copies.
// 	["edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle"]
// 		.forEach(key => clusters_graph
// 			.forEach(graph => nonFlatEdges
// 				.forEach(e => delete graph[key][e])));

// 	// now, any arrays referencing edges (_edges) are out of sync with
// 	// the edge arrays themselves (edges_). Therefore this method really
// 	// isn't intended to be used outside of this higly specific context.

// 	// faces_polygon is a flat array of polygons in 2D, where every face
// 	// is re-oriented into 2D via each set's transformation.
// 	// collinear vertices (if exist) are removed from every polygon.
// 	const faces_polygon = ear.general.mergeArraysWithHoles(...clusters_graph
// 		.map(copy => ear.graph.makeFacesPolygon(copy)));

// 	// ensure that all faces are counter-clockwise, flip winding if necessary.
// 	faces_winding
// 		.map((upright, i) => (upright ? undefined : i))
// 		.filter(a => a !== undefined)
// 		.forEach(f => faces_polygon[f].reverse());

// 	// for every face, a list of face indices which overlap this face.
// 	// compute face-face-overlap for every cluster's graph one at a time,
// 	// this is important because vertices have been translated into 2D now,
// 	// and it's possible that faces from other clusters overlap each other
// 	// in this transformed state; we don't want that. After we compute face-face
// 	// overlap information separately, we can merge all of the results into
// 	// a flat array since none of the resulting arrays will overlap.
// 	const facesFacesOverlap = ear.general.mergeArraysWithHoles(...clusters_graph
// 		.map(graph => ear.graph.getFacesFacesOverlap(graph)));

// 	// simple faces center by averaging all the face's vertices.
// 	// we don't have to be precise here, these are used to tell which
// 	// side of a face's edge the face is (assuming all faces are convex).
// 	const faces_center = faces_polygon.map(coords => ear.math.average2(...coords));

// 	// populate individual graph copies with faces_center data.
// 	clusters_graph.forEach(({ faces_vertices: fv }, c) => {
// 		clusters_graph[c].faces_center = fv.map((_, f) => faces_center[f]);
// 	});

// 	// these are all the variables we need to solve- all overlapping faces in
// 	// pairwise combinations, as a space-separated string, smallest index first
// 	const facePairsInts = ear.graph.connectedComponentsPairs(facesFacesOverlap);
// 	const facePairs = facePairsInts.map(pair => pair.join(" "));

// 	const {
// 		tortillas3D,
// 		orders,
// 	} = ear.layer.makeSolverConstraints3DBetweenClusters(
// 		{
// 			...folded,
// 			faces_winding,
// 			faces_center,
// 		},
// 		clusters_faces,
// 		clusters_transform,
// 		faces_cluster,
// 		faces_polygon,
// 		facePairs,
// 		facePairsInts,
// 	);

// 	// all tortilla_tortilla constraints come from the bent 3D tortillas.
// 	// no tortilla_tortillas come from the 2D calculation.
// 	expect(tortillas3D).toMatchObject(expected.constraints.tortilla_tortilla);
// });

// test("Graph group copies", () => {
// 	const foldFile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
// 	const foldObject = JSON.parse(foldFile);
// 	const graph = ear.graph.getFramesByClassName(foldObject, "foldedForm")[0];
// 	const {
// 		clusters_faces,
// 		clusters_plane,
// 		planes_transform,
// 		faces_cluster,
// 		faces_winding,
// 		// facesFacesOverlap,
// 	} = ear.graph.getCoplanarAdjacentOverlappingFaces(graph);
// 	const clusters_transformXY = clusters_plane.map(p => planes_transform[p]);
// 	// all vertices_coords will become 2D
// 	// const clusters_graphs = ear.layer.graphGroupCopies(graph, clusters_faces, clusters_transformXY);
// 	// const faces_polygon = ear.general.mergeArraysWithHoles(...clusters_graphs
// 	// 	.map(copy => ear.graph.makeFacesPolygon(copy)));
// 	// fs.writeFileSync(`./tests/tmp/sets_graphs.json`, JSON.stringify(clusters_graphs, null, 2));
// 	// fs.writeFileSync(`./tests/tmp/faces_polygon.json`, JSON.stringify(faces_polygon, null, 2));
// 	expect(true).toBe(true);
// });
