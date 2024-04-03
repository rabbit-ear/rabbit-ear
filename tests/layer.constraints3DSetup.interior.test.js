import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

const constraints3DSetupInterior = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges, faces_faces,
}) => {
	const epsilon = 1e-6;
	const {
		planes_transform,
		faces_plane,
		faces_cluster,
		faces_winding,
		faces_polygon,
		faces_center,
		clusters_faces,
		clusters_graph,
		clusters_transform,
		facesFacesOverlap,
		facePairs,
	} = ear.layer.constraints3DFaceClusters({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_assignment,
		edges_foldAngle,
		faces_vertices,
		faces_edges,
		faces_faces,
	}, epsilon);

	//
	const {
		pairs_data,
		edges_clusters,
	} = ear.layer.constraints3DEdgeClusters({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_foldAngle,
	}, {
		faces_center,
		faces_cluster,
		clusters_transform,
	}, epsilon);

	// conditions where two collinear edges overlap each other and the
	// four faces involved align in planes in ways which can be classified
	// into four categories, three of which result in face-order solutions
	// and one (bentTortillaTortillaEdges) result in more conditions for
	// the solver to solve.
	const {
		YJunctions,
		TJunctions,
		bentFlatTortillas,
		bentTortillaTortillaEdges,
	} = ear.layer.constraints3DSolverCases({ edges_faces, pairs_data });

	// convert bentTortillaTortillaEdges into well-formatted tortilla-tortilla
	// conditions ready to pass off to the solver.
	const bentTortillaTortillas = ear.layer.makeBentTortillas(
		{ edges_faces },
		{ faces_cluster, faces_winding, bentTortillaTortillaEdges },
	);

	// solutions where an edge with a 3D fold angle is crossing somewhere
	// in the interior of another face, where one of the edge's face's is
	// co-planar with the face, this results in a known layer ordering
	// between two faces.
	const ordersEdgeFace = ear.layer.solveEdgeFaceOverlapOrders(
		{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
		clusters_transform,
		clusters_faces,
		faces_cluster,
		faces_polygon,
		faces_winding,
		edges_clusters,
		epsilon,
	);

	// solutions where two collinear edges overlap each other, and the
	// four faces involved
	const ordersEdgeEdge = ear.layer.solveEdgeEdgeOverlapOrders(
		{ edges_foldAngle, faces_winding },
		YJunctions,
		TJunctions,
		bentFlatTortillas,
	);

	return {
		planes_transform,
		faces_plane,
		faces_cluster,
		faces_winding,
		faces_polygon,
		faces_center,
		clusters_faces,
		clusters_graph,
		clusters_transform,
		facesFacesOverlap,
		facePairs,
		//
		pairs_data,
		edges_clusters,
		//
		YJunctions,
		TJunctions,
		bentFlatTortillas,
		bentTortillaTortillaEdges,
		//
		bentTortillaTortillas,
		ordersEdgeFace,
		ordersEdgeEdge,
	};
};

test("constraints3DSetup, all 3D special cases", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/layer3d-cases.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const frames = ear.graph.getFileFramesAsArray(fold);
	const foldedForms = frames.map(frame => ({
		...frame,
		vertices_coords: ear.graph.makeVerticesCoordsFolded(frame),
	}));
	foldedForms.forEach(folded => ear.graph.populate(folded));

	const folded = foldedForms[3];

	const {
		lines,
		edges_line,
	} = ear.graph.getEdgesLine(folded);

	const {
		planes_transform,
		faces_plane,
		// faces_cluster,
		faces_winding,
		// faces_polygon,
		// faces_center,
		// clusters_faces,
		// clusters_graph,
		// clusters_transform,
		facesFacesOverlap,
		// facePairs,
	} = ear.layer.constraints3DFaceClusters(folded);

	// lines_planes,
	// edges_planes,
	// edgesEdgesOverlap,
	// edgePairs,
	// edgePairs_facePlanes,
	// edges_facesSide,
	const result = ear.layer.constraints3DEdgeClustersNew(folded, {
		lines,
		edges_line,
		planes_transform,
		faces_plane,
		faces_winding,
		facesFacesOverlap,
	});

	console.log(result);

	// [
	// 	{
	// 		edges: [13,17],
	// 		sets: {
	// 			"0":{edges: [13],"faces":[0],"facesSides":[1],"facesSameSide":true},
	// 			"1":{edges: [17],"faces":[5],"facesSides":[-1],"facesSameSide":true},
	// 			"2":{edges: [13,17],"faces":[1,4],"facesSides":[-1,-1],"facesSameSide":true}
	// 		}
	// 	}
	// ]

	// T junction edges 13-17 with faces 0-5 (T top) 1-4 (T base)
	// console.log("pairs_data", JSON.stringify(pairs_data));
	// console.log("TJunctions", TJunctions);
	// console.log("YJunctions", YJunctions);
});

// test("constraints3DSetup, all 3D special cases", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/layer3d-cases.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const frames = ear.graph.getFileFramesAsArray(fold);
// 	const foldedForms = frames.map(frame => ({
// 		...frame,
// 		vertices_coords: ear.graph.makeVerticesCoordsFolded(frame),
// 	}));
// 	foldedForms.forEach(folded => ear.graph.populate(folded));
// 	const results = foldedForms.map(graph => constraints3DSetupInterior(graph));
// 	// expect(ordersEdgeEdge).toMatchObject({ "0 4": 1 });

// 	expect(results[0].facePairs).toMatchObject(["0 4"]);
// 	expect(results[0].edges_clusters).toMatchObject([
// 		,,,,,,,,,,,, [0, 1], [1, 2], [2, 0],,
// 	]);
// 	expect(results[0].pairs_data).toHaveLength(0);
// 	expect(results[0].YJunctions).toHaveLength(0);
// 	expect(results[0].TJunctions).toHaveLength(0);
// 	expect(results[0].bentFlatTortillas).toMatchObject([]);
// 	expect(results[0].bentTortillaTortillaEdges).toHaveLength(0);
// 	expect(results[0].bentTortillaTortillas).toHaveLength(0);
// 	expect(results[0].ordersEdgeFace).toMatchObject({});
// 	expect(results[0].ordersEdgeEdge).toMatchObject({});

// 	expect(results[1].facePairs).toMatchObject(["1 4", "2 3"]);
// 	expect(results[1].edges_clusters).toMatchObject([
// 		,,,,,,,,,,,,, [0, 2],,,, [2, 1],,
// 	]);
// 	expect(results[1].pairs_data).toHaveLength(1);
// 	expect(results[1].YJunctions).toHaveLength(1);
// 	expect(results[1].TJunctions).toHaveLength(0);
// 	expect(results[1].bentFlatTortillas).toMatchObject([]);
// 	expect(results[1].bentTortillaTortillaEdges).toHaveLength(0);
// 	expect(results[1].bentTortillaTortillas).toHaveLength(0);
// 	expect(results[1].ordersEdgeFace).toMatchObject({});
// 	expect(results[1].ordersEdgeEdge).toMatchObject({});

// 	expect(results[2].facePairs).toMatchObject(["1 4", "2 3"]);
// 	expect(results[2].edges_clusters).toMatchObject([
// 		,,,,,,,,,,,,, [0, 1],,,, [1, 2],,
// 	]);
// 	expect(results[2].pairs_data).toHaveLength(1);
// 	expect(results[2].YJunctions).toHaveLength(1);
// 	expect(results[2].TJunctions).toHaveLength(0);
// 	expect(results[2].bentFlatTortillas).toMatchObject([]);
// 	expect(results[2].bentTortillaTortillaEdges).toHaveLength(0);
// 	expect(results[2].bentTortillaTortillas).toHaveLength(0);
// 	expect(results[2].ordersEdgeFace).toMatchObject({});
// 	expect(results[2].ordersEdgeEdge).toMatchObject({});

// 	expect(results[3].facePairs).toMatchObject(["0 5", "1 4", "2 3"]);
// 	expect(results[3].edges_clusters).toMatchObject([
// 		,,,,,,,,,,,,, [0, 1],,,, [1, 0],,
// 	]);
// 	expect(results[3].pairs_data).toHaveLength(1);
// 	expect(results[3].YJunctions).toHaveLength(0);
// 	expect(results[3].TJunctions).toHaveLength(0);
// 	expect(results[3].bentFlatTortillas).toMatchObject([]);
// 	expect(results[3].bentTortillaTortillaEdges).toHaveLength(1);
// 	expect(results[3].bentTortillaTortillas).toHaveLength(1);
// 	expect(results[3].ordersEdgeFace).toMatchObject({});
// 	expect(results[3].ordersEdgeEdge).toMatchObject({});

// 	// the invalid cases
// 	expect(results[6].facePairs).toMatchObject(["1 5"]);
// 	expect(results[6].edges_clusters).toMatchObject([
// 		,,,,,,,,,,,,,,,,, [0, 1], [1, 3], [3, 0], [0, 2],,
// 	]);
// 	expect(results[6].pairs_data).toHaveLength(0);
// 	expect(results[6].YJunctions).toHaveLength(0);
// 	expect(results[6].TJunctions).toHaveLength(0);
// 	expect(results[6].bentFlatTortillas).toMatchObject([]);
// 	expect(results[6].bentTortillaTortillaEdges).toHaveLength(0);
// 	expect(results[6].bentTortillaTortillas).toHaveLength(0);
// 	expect(results[6].ordersEdgeFace).toMatchObject({});
// 	expect(results[6].ordersEdgeEdge).toMatchObject({});

// 	expect(results[7].facePairs).toMatchObject([]);
// 	expect(results[7].edges_clusters).toMatchObject([
// 		,,,,,,,,,,,, [0, 1], [1, 2],,,
// 	]);
// 	expect(results[7].pairs_data).toHaveLength(0);
// 	expect(results[7].YJunctions).toHaveLength(0);
// 	expect(results[7].TJunctions).toHaveLength(0);
// 	expect(results[7].bentFlatTortillas).toMatchObject([]);
// 	expect(results[7].bentTortillaTortillaEdges).toHaveLength(0);
// 	expect(results[7].bentTortillaTortillas).toHaveLength(0);
// 	expect(results[7].ordersEdgeFace).toMatchObject({});
// 	expect(results[7].ordersEdgeEdge).toMatchObject({});

// 	expect(results[8].facePairs).toMatchObject(["1 4", "2 3"]);
// 	expect(results[8].edges_clusters).toMatchObject([
// 		,,,,,,,,,,,,, [0, 2],,,, [2, 1],,
// 	]);
// 	expect(results[8].pairs_data).toHaveLength(1);
// 	expect(results[8].YJunctions).toHaveLength(1);
// 	expect(results[8].TJunctions).toHaveLength(0);
// 	expect(results[8].bentFlatTortillas).toMatchObject([]);
// 	expect(results[8].bentTortillaTortillaEdges).toHaveLength(0);
// 	expect(results[8].bentTortillaTortillas).toHaveLength(0);
// 	expect(results[8].ordersEdgeFace).toMatchObject({});
// 	expect(results[8].ordersEdgeEdge).toMatchObject({});

// 	expect(results[9].facePairs).toMatchObject(["1 4", "2 3"]);
// 	expect(results[9].edges_clusters).toMatchObject([
// 		,,,,,,,,,,,,, [0, 1],,,, [1, 2],,
// 	]);
// 	expect(results[9].pairs_data).toHaveLength(1);
// 	expect(results[9].YJunctions).toHaveLength(1);
// 	expect(results[9].TJunctions).toHaveLength(0);
// 	expect(results[9].bentFlatTortillas).toMatchObject([]);
// 	expect(results[9].bentTortillaTortillaEdges).toHaveLength(0);
// 	expect(results[9].bentTortillaTortillas).toHaveLength(0);
// 	expect(results[9].ordersEdgeFace).toMatchObject({});
// 	expect(results[9].ordersEdgeEdge).toMatchObject({});
// });


// test("constraints3DSetup, maze-u", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	ear.graph.populate(folded);

// 	const {
// 		// faces_cluster,
// 		// faces_winding,
// 		// faces_polygon,
// 		// faces_center,
// 		clusters_faces,
// 		clusters_graph,
// 		clusters_transform,
// 		// facesFacesOverlap,
// 		facePairs,
// 		//
// 		pairs_data,
// 		edges_clusters,
// 		//
// 		YJunctions,
// 		TJunctions,
// 		bentFlatTortillas,
// 		bentTortillaTortillaEdges,
// 		//
// 		bentTortillaTortillas,
// 		ordersEdgeFace,
// 		ordersEdgeEdge,
// 	} = constraints3DSetupInterior(folded);

// 	expect(facePairs).toHaveLength(467);
// 	expect(pairs_data).toHaveLength(152);
// 	expect(clusters_faces).toHaveLength(4);
// 	expect(clusters_graph).toHaveLength(4);
// 	expect(clusters_transform).toHaveLength(4);
// 	expect(edges_clusters.filter(() => true)).toHaveLength(48);
// 	expect(YJunctions).toHaveLength(0);
// 	expect(TJunctions).toHaveLength(82);
// 	expect(bentFlatTortillas).toHaveLength(0);
// 	expect(bentTortillaTortillaEdges).toHaveLength(70);

// 	expect(edges_clusters).toMatchObject([,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,[0,3],,,,,,,,,,,,,,,,,,,[0,1],[0,1],[0,1],[1,0],[1,0],[3,1],,,,[0,3],[0,3],[0,3],[3,0],[3,0],[0,1],[1,3],,,,,,,,,,,,,,,,,,[0,1],[0,1],[0,1],[0,1],,,,,,,,,,,,,,[0,1],[0,1],[1,0],[0,1],,,,,,,,,,,,[0,1],[0,1],,,,,,,,,,[0,2],,,,,,,,,,,,,,,,,,,[3,0],[0,3],[0,3],[3,0],[3,0],[2,3],,,,[0,2],[2,0],[0,2],[2,0],[2,0],[0,3],[2,3],,,,,,,,,,,,,,,,,,[0,2],[0,2],[0,2],[0,2],,,,,,,,,,,,,,[0,2],[0,2],[2,0],[2,0],,,,,,,,,,,,[0,2],[0,2],,,,,,,]);

// 	expect(TJunctions.map(({ edges }) => edges)).toMatchObject([
// 		[39, 68], [39, 69], [39, 70], [39, 71], [58, 62], [58, 72], [59, 62], [59, 72], [60, 62], [60, 72], [61, 62], [61, 72], [67, 68], [67, 69], [67, 70], [67, 71], [91, 108], [91, 109], [91, 110], [91, 111], [91, 124], [92, 108], [92, 109], [92, 110], [92, 111], [92, 124], [93, 108], [93, 109], [93, 110], [93, 111], [93, 124], [94, 108], [94, 109], [94, 110], [94, 111], [94, 124], [108, 123], [109, 123], [110, 123], [111, 123], [123, 124], [134, 163], [134, 164], [134, 165], [134, 166], [153, 157], [153, 167], [154, 157], [154, 167], [155, 157], [155, 167], [156, 157], [156, 167], [162, 163], [162, 164], [162, 165], [162, 166], [186, 203], [186, 204], [186, 205], [186, 206], [186, 219], [187, 203], [187, 204], [187, 205], [187, 206], [187, 219], [188, 203], [188, 204], [188, 205], [188, 206], [188, 219], [189, 203], [189, 204], [189, 205], [189, 206], [189, 219], [203, 218], [204, 218], [205, 218], [206, 218], [218, 219],
// 	]);

// 	expect(bentTortillaTortillaEdges.map(({ edges }) => edges)).toMatchObject([
// 		[39, 67], [58, 59], [58, 60], [58, 61], [59, 60], [59, 61], [60, 61], [62, 72], [63, 73], [68, 69], [68, 70], [68, 71], [69, 70], [69, 71], [70, 71], [91, 92], [91, 93], [91, 94], [91, 123], [92, 93], [92, 94], [92, 123], [93, 94], [93, 123], [94, 123], [108, 109], [108, 110], [108, 111], [108, 124], [109, 110], [109, 111], [109, 124], [110, 111], [110, 124], [111, 124], [134, 162], [153, 154], [153, 155], [153, 156], [154, 155], [154, 156], [155, 156], [157, 167], [158, 168], [163, 164], [163, 165], [163, 166], [164, 165], [164, 166], [165, 166], [186, 187], [186, 188], [186, 189], [186, 218], [187, 188], [187, 189], [187, 218], [188, 189], [188, 218], [189, 218], [203, 204], [203, 205], [203, 206], [203, 219], [204, 205], [204, 206], [204, 219], [205, 206], [205, 219], [206, 219],
// 	]);

// 	expect(bentTortillaTortillas).toMatchObject([
// 		[6,10,18,21],[4,12,5,31],[4,13,11,31],[4,14,16,31],[5,13,11,12],[5,14,16,12],[11,14,16,13],[15,18,7,6],[21,32,10,9],[22,28,26,23],[22,29,30,23],[22,33,35,23],[26,29,30,28],[26,33,35,28],[29,35,33,30],[40,46,39,47],[40,49,48,47],[40,31,4,47],[40,44,43,47],[39,49,48,46],[39,31,4,46],[39,44,43,46],[48,31,4,49],[48,44,43,49],[4,44,43,31],[57,60,58,61],[57,60,62,50],[57,60,6,7],[57,60,41,45],[58,61,62,50],[58,61,6,7],[58,61,41,45],[50,62,7,6],[50,62,45,41],[6,7,41,45],[6,78,72,64],[33,63,69,35],[33,67,70,35],[33,73,71,35],[63,70,67,69],[63,71,73,69],[67,71,73,70],[68,72,10,6],[78,66,64,88],[77,79,85,82],[77,79,84,86],[77,79,87,90],[82,85,86,84],[82,85,90,87],[84,86,87,90],[59,97,58,98],[59,99,62,98],[59,64,6,98],[59,95,94,98],[58,99,62,97],[58,64,6,97],[58,95,94,97],[62,64,6,99],[62,95,94,99],[6,95,94,64],[105,107,106,108],[105,107,109,100],[105,107,90,87],[105,107,92,96],[106,108,109,100],[106,108,90,87],[106,108,92,96],[100,109,87,90],[100,109,96,92],[87,90,96,92]
// 	]);

// 	expect(ordersEdgeFace).toMatchObject({
// 		"6 17":1,"4 17":1,"5 17":1,"11 17":1,"16 17":1,"17 18":2,"17 22":2,"17 26":2,"17 30":2,"17 35":2,"40 42":1,"40 51":1,"39 42":1,"39 51":1,"42 48":2,"48 51":1,"4 42":1,"4 51":1,"42 57":2,"51 57":2,"42 58":2,"51 58":2,"42 62":2,"51 62":2,"6 42":1,"6 51":1,"42 43":2,"43 51":1,"41 42":1,"41 51":1,"6 74":1,"35 74":1,"63 74":1,"67 74":1,"73 74":1,"72 74":1,"74 79":2,"74 82":2,"74 86":2,"74 90":2,"59 93":1,"59 101":1,"58 93":1,"58 101":1,"62 93":1,"62 101":1,"6 93":1,"6 101":1,"93 105":2,"101 105":2,"93 106":2,"101 106":2,"93 109":2,"101 109":2,"90 93":1,"90 101":1,"93 94":2,"94 101":1,"92 93":1,"92 101":1
// 	});

// 	expect(ordersEdgeEdge).toMatchObject({
// 		"10 23":1,"10 28":1,"10 29":1,"10 33":1,"15 31":1,"7 31":1,"12 15":2,"7 12":1,"13 15":2,"7 13":1,"14 15":2,"7 14":1,"21 23":1,"21 28":1,"21 29":1,"21 33":1,"47 60":2,"47 61":2,"47 50":2,"7 47":1,"45 47":1,"46 60":2,"46 61":2,"46 50":2,"7 46":1,"45 46":1,"49 60":2,"49 61":2,"49 50":2,"7 49":1,"45 49":1,"31 60":2,"31 61":2,"31 50":2,"31 45":2,"44 60":2,"44 61":2,"44 50":2,"7 44":1,"44 45":2,"64 77":2,"64 85":2,"64 84":2,"64 87":2,"33 68":2,"68 69":1,"10 69":1,"68 70":1,"10 70":1,"68 71":1,"10 71":1,"77 78":1,"78 85":2,"78 84":2,"78 87":2,"98 107":2,"98 108":2,"98 100":2,"87 98":1,"96 98":1,"97 107":2,"97 108":2,"97 100":2,"87 97":1,"96 97":1,"99 107":2,"99 108":2,"99 100":2,"87 99":1,"96 99":1,"64 107":2,"64 108":2,"64 100":2,"64 96":2,"95 107":2,"95 108":2,"95 100":2,"87 95":1,"95 96":2
// 	});
// });

// test("constraints3DSetup, mooser's train", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/moosers-train.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	ear.graph.populate(folded);

// 	const {
// 		// faces_cluster,
// 		// faces_winding,
// 		// faces_polygon,
// 		// faces_center,
// 		clusters_faces,
// 		clusters_graph,
// 		clusters_transform,
// 		// facesFacesOverlap,
// 		facePairs,
// 		//
// 		pairs_data,
// 		edges_clusters,
// 		//
// 		YJunctions,
// 		TJunctions,
// 		bentFlatTortillas,
// 		bentTortillaTortillaEdges,
// 		//
// 		bentTortillaTortillas,
// 		ordersEdgeFace,
// 		ordersEdgeEdge,
// 	} = constraints3DSetupInterior(folded);

// 	expect(facePairs).toHaveLength(1721);
// 	expect(pairs_data).toHaveLength(386);
// 	expect(clusters_faces).toHaveLength(87);
// 	expect(clusters_graph).toHaveLength(87);
// 	expect(clusters_transform).toHaveLength(87);
// 	expect(edges_clusters.filter(() => true)).toHaveLength(332);
// 	expect(YJunctions).toHaveLength(52);
// 	expect(TJunctions).toHaveLength(100);
// 	expect(bentFlatTortillas).toHaveLength(0);
// 	expect(bentTortillaTortillaEdges).toHaveLength(234);
// 	expect(bentTortillaTortillas).toHaveLength(234);
// 	expect(Object.keys(ordersEdgeFace)).toHaveLength(457);
// 	expect(Object.keys(ordersEdgeEdge)).toHaveLength(112);
// });

// test("constraints3DSetup, cube octagon", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/cube-octagon.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	ear.graph.populate(folded);

// 	const {
// 		// faces_cluster,
// 		// faces_winding,
// 		// faces_polygon,
// 		// faces_center,
// 		clusters_faces,
// 		clusters_graph,
// 		clusters_transform,
// 		// facesFacesOverlap,
// 		facePairs,
// 		//
// 		pairs_data,
// 		edges_clusters,
// 		//
// 		YJunctions,
// 		TJunctions,
// 		bentFlatTortillas,
// 		bentTortillaTortillaEdges,
// 		//
// 		bentTortillaTortillas,
// 		ordersEdgeFace,
// 		ordersEdgeEdge,
// 	} = constraints3DSetupInterior(folded);

// 	expect(facePairs).toHaveLength(84);
// 	expect(pairs_data).toHaveLength(24);
// 	expect(clusters_faces).toHaveLength(6);
// 	expect(clusters_graph).toHaveLength(6);
// 	expect(clusters_transform).toHaveLength(6);
// 	expect(edges_clusters.filter(() => true)).toHaveLength(28);
// 	expect(YJunctions).toHaveLength(0);
// 	expect(TJunctions).toHaveLength(0);
// 	expect(bentFlatTortillas).toHaveLength(0);
// 	expect(bentTortillaTortillaEdges).toHaveLength(24);
// 	expect(bentTortillaTortillas).toHaveLength(24);
// 	expect(Object.keys(ordersEdgeFace)).toHaveLength(0);
// 	expect(Object.keys(ordersEdgeEdge)).toHaveLength(0);
// });

// test("makeSolverConstraints 3D", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/coplanar-angles-3d.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = {
// 		...fold,
// 		vertices_coords: ear.graph.makeVerticesCoordsFolded(fold),
// 	};
// 	ear.graph.populate(folded);

// 	const {
// 		facePairs,
// 		facesFacesOverlap,
// 		pairs_data,
// 		edges_clusters,
// 	} = constraints3DSetupInterior(folded);

// 	expect(facePairs).toMatchObject(["1 3", "1 4", "1 5", "3 4", "3 5", "4 5"]);
// 	expect(facesFacesOverlap).toMatchObject([
// 		[], [3, 4, 5], [], [1, 4, 5], [1, 3, 5], [1, 3, 4],
// 	]);

// 	expect(pairs_data).toMatchObject([]);
// 	expect(edges_clusters).toMatchObject([
// 		,,,,,, [2, 1], [0, 1], [0, 2],,,,,,,
// 	]);
// });
