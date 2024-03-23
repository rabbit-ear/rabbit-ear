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
	expect(solverConstraints).toMatchObject(expected);
});

test("makeSolverConstraints3D maze-u", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);

	const expectedJSON = fs.readFileSync("./tests/files/json/maze-u-constraints.json", "utf-8");
	const expected = JSON.parse(expectedJSON);

	// these fields are tested.
	// - constraints: { taco_taco, taco_tortilla, tortilla_tortilla, transitivity }
	// - lookup
	// - facePairs
	// - faces_winding
	// - orders
	const solverConstraints = ear.layer.makeSolverConstraints3D(folded);
	expect(solverConstraints).toMatchObject(expected);
});

test("makeSolverConstraints3D maze-u 3D-only setup", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);

	const expectedJSON = fs.readFileSync("./tests/files/json/maze-u-constraints.json", "utf-8");
	const expected = JSON.parse(expectedJSON);

	const {
		// planes,
		planes_transform,
		faces_winding,
		// planes_faces,
		// faces_plane,
		// planes_clusters,
		clusters_plane,
		clusters_faces,
		faces_cluster,
	} = ear.graph.getCoplanarAdjacentOverlappingFaces(folded);

	// for every cluster, make a shallow copy of the input graph, containing
	// only the faces included in that cluster, and by extension, all edges and
	// vertices which are used by this subset of faces.
	const clusters_graph = clusters_faces
		.map(faces => ear.graph.subgraphWithFaces(folded, faces));

	// ensure all vertices_coords are 3D (make a copy array here) for use in
	// multiplyMatrix4Vector3, which requires points to be in 3D.
	const vertices_coords3D = folded.vertices_coords
		.map(coord => ear.math.resize(3, coord));

	// for each cluster, get the transform which, when applied, brings
	// all points into the XY plane.
	const clusters_transform = clusters_plane.map(p => planes_transform[p]);

	// transform all vertices_coords by the inverse transform
	// to bring them all into the XY plane. convert back into a 2D point.
	clusters_graph.forEach(({ vertices_coords: coords }, i) => {
		clusters_graph[i].vertices_coords = coords
			.map((_, v) => ear.math.multiplyMatrix4Vector3(
				clusters_transform[i],
				vertices_coords3D[v],
			))
			.map(([a, b]) => [a, b]);
	});

	// get a list of all edge indices which are non-flat edges.
	// non-flat edges are anything other than 0, -180, or +180 fold angles.
	const nonFlatEdges = folded.edges_foldAngle
		.map(ear.graph.edgeFoldAngleIsFlat)
		.map((flat, i) => (!flat ? i : undefined))
		.filter(a => a !== undefined);

	// remove any non-flat edges from the shallow copies.
	["edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle"]
		.forEach(key => clusters_graph
			.forEach(graph => nonFlatEdges
				.forEach(e => delete graph[key][e])));

	// now, any arrays referencing edges (_edges) are out of sync with
	// the edge arrays themselves (edges_). Therefore this method really
	// isn't intended to be used outside of this higly specific context.

	// faces_polygon is a flat array of polygons in 2D, where every face
	// is re-oriented into 2D via each set's transformation.
	// collinear vertices (if exist) are removed from every polygon.
	const faces_polygon = ear.general.mergeArraysWithHoles(...clusters_graph
		.map(copy => ear.graph.makeFacesPolygon(copy)));

	// ensure that all faces are counter-clockwise, flip winding if necessary.
	faces_winding
		.map((upright, i) => (upright ? undefined : i))
		.filter(a => a !== undefined)
		.forEach(f => faces_polygon[f].reverse());

	// for every face, a list of face indices which overlap this face.
	// compute face-face-overlap for every cluster's graph one at a time,
	// this is important because vertices have been translated into 2D now,
	// and it's possible that faces from other clusters overlap each other
	// in this transformed state; we don't want that. After we compute face-face
	// overlap information separately, we can merge all of the results into
	// a flat array since none of the resulting arrays will overlap.
	const facesFacesOverlap = ear.general.mergeArraysWithHoles(...clusters_graph
		.map(graph => ear.graph.getFacesFacesOverlap(graph)));

	// simple faces center by averaging all the face's vertices.
	// we don't have to be precise here, these are used to tell which
	// side of a face's edge the face is (assuming all faces are convex).
	const faces_center = faces_polygon.map(coords => ear.math.average2(...coords));

	// populate individual graph copies with faces_center data.
	clusters_graph.forEach(({ faces_vertices: fv }, c) => {
		clusters_graph[c].faces_center = fv.map((_, f) => faces_center[f]);
	});

	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	const facePairsInts = ear.graph.connectedComponentsPairs(facesFacesOverlap);
	const facePairs = facePairsInts.map(pair => pair.join(" "));

	const {
		tortillas3D,
		orders,
	} = ear.layer.makeSolverConstraints3DBetweenClusters(
		{
			...folded,
			faces_winding,
			faces_center,
		},
		clusters_faces,
		clusters_transform,
		faces_cluster,
		faces_polygon,
		facePairs,
		facePairsInts,
	);

	// all tortilla_tortilla constraints come from the bent 3D tortillas.
	// no tortilla_tortillas come from the 2D calculation.
	expect(tortillas3D).toMatchObject(expected.constraints.tortilla_tortilla);
});
