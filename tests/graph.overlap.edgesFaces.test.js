import { expect, test } from "vitest";
import fs from "fs";
import ear from "../rabbit-ear.js";

// test("edges-faces, two adjacent faces one point overlap", () => {
// 	const graph = ear.graph.populate({
// 		vertices_coords: [[0, 0], [0.5, 0.5], [0, 1], [0, 1]],
// 		edges_vertices: [[0, 3], [3, 1], [1, 2], [2, 0], [0, 1]],
// 		edges_assignment: Array.from("BBBBV"),
// 		faces_vertices: [[0, 2, 1], [0, 1, 3]],
// 	});
// 	const edgesFaces = ear.graph.getEdgesFacesOverlapCalculate(graph);

// 	expect(edgesFaces).toMatchObject([
// 		[{ v: [2], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [2], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [3], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [3], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 	]);
// });

// test("edges-faces, two adjacent faces no overlap points, two crossing edges", () => {
// 	const graph = ear.graph.populate({
// 		vertices_coords: [[0, 0], [0.5, 0.5], [0, 1], [-0.1, 0.9]],
// 		edges_vertices: [[0, 3], [3, 1], [1, 2], [2, 0], [0, 1]],
// 		edges_assignment: Array.from("BBBBV"),
// 		faces_vertices: [[0, 2, 1], [0, 1, 3]],
// 	});
// 	const edgesFaces = ear.graph.getEdgesFacesOverlapCalculate(graph);

// 	expect(edgesFaces).toMatchObject([
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [3], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [1], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 	]);
// });

// test("edges-faces, two separate faces, identical", () => {
// 	const graph = ear.graph.populate({
// 		vertices_coords: [[0, 0], [0.5, 0.5], [0, 1], [0, 0], [0.5, 0.5], [0, 1]],
// 		edges_vertices: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]],
// 		edges_assignment: Array.from("BBBBBB"),
// 		faces_vertices: [[0, 1, 2], [3, 4, 5]],
// 	});
// 	const edgesFaces = ear.graph.getEdgesFacesOverlapCalculate(graph);

// 	expect(edgesFaces).toMatchObject([
// 		// [{ v: [], e: [], p: [] }, { v: [3, 4], e: [], p: [] }],
// 		// [{ v: [], e: [], p: [] }, { v: [4, 5], e: [], p: [] }],
// 		// [{ v: [], e: [], p: [] }, { v: [3, 5], e: [], p: [] }],
// 		// [{ v: [0, 1], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		// [{ v: [1, 2], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		// [{ v: [0, 2], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 	]);
// });

// test("edges-faces, two separate faces, one point in common", () => {
// 	// one upside down triangle (point at origin)
// 	// copy of other triangle, scaled shorter in the Y axis (point at origin)
// 	// the second triangle's top line cuts through the other triangle's sides
// 	const graph = ear.graph.populate({
// 		vertices_coords: [[0, 0], [1, 1], [-1, 1], [0, 0], [1, 0.5], [-1, 0.5]],
// 		edges_vertices: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]],
// 		edges_assignment: Array.from("BBBBBB"),
// 		faces_vertices: [[0, 1, 2], [3, 4, 5]],
// 	});
// 	const edgesFaces = ear.graph.getEdgesFacesOverlapCalculate(graph);

// 	expect(edgesFaces).toMatchObject([
// 		[{ v: [], e: [], p: [] }, { v: [3], e: [4], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [], p: [] }, { v: [3], e: [4], p: [] }],
// 		[{ v: [0], e: [], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [], e: [0, 2], p: [] }, { v: [], e: [], p: [] }],
// 		[{ v: [0], e: [], p: [] }, { v: [], e: [], p: [] }],
// 	]);
// });


test("edges-faces kite base", () => {
	const cp = ear.graph.kite();
	const folded = {
		...cp,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
	};
	ear.graph.populate(folded);

	const facesEdges = ear.graph.getFacesEdgesOverlapAllData(folded);

	fs.writeFileSync("./tests/tmp/facesEdges.json", JSON.stringify(facesEdges, null, 2));

	console.log(facesEdges);

	// expect(edgesFaces.flat().length).toBe(0);
	//

	// edge 1 overlaps face 1
	// edge 4 overlaps face 2

	expect(facesEdges).toMatchObject([
		[
			{v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[1],e:[],p:[]}, {v:[1],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[1],e:[],p:[]}
		],
		[
			{v:[],e:[8],p:[]}, {v:[],e:[8],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[8],p:[]}, {v:[],e:[8],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}
		],
		[
			{v:[],e:[8],p:[]}, {v:[],e:[8],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[8],p:[]}, {v:[],e:[8],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}
		],
		[
			{v:[5],e:[],p:[]}, {v:[5],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[],e:[],p:[]}, {v:[5],e:[],p:[]}
		],
	]);

});


// test("edges-faces bird base", () => {
// 	const cp = ear.graph.bird();
// 	const folded = {
// 		...cp,
// 		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
// 	};
// 	ear.graph.populate(folded);

// 	const edgesFaces = ear.graph.getEdgesFacesOverlap(folded);

// 	fs.writeFileSync("./tests/tmp/edgesFaces.json", JSON.stringify(edgesFaces, null, 2));

// 	console.log(edgesFaces);

// 	expect(edgesFaces.flat().length).toBe(16);

// 	expect(edgesFaces).toMatchObject([
// 		[,,,,,, { v: [2],"e":[24],"p":[]}, { v: [2],"e":[24],"p":[]},,,,,,, { v: [6],"e":[25],"p":[]}, { v: [6],"e":[25],"p":[]},,,,],
// 		[,,,,,,,,,,,,,, { v: [6],"e":[25],"p":[]}, { v: [6],"e":[25],"p":[]},,,,],
// 		[,,,,,,,,,,,,,, { v: [6],"e":[25],"p":[]}, { v: [6],"e":[25],"p":[]},,,,],
// 		[,,,,,, { v: [2],"e":[24],"p":[]}, { v: [2],"e":[24],"p":[]},,,,,,, { v: [6],"e":[25],"p":[]}, { v: [6],"e":[25],"p":[]},,,,],
// 		[,,,,,, { v: [2],"e":[24],"p":[]}, { v: [2],"e":[24],"p":[]},,,,,,, { v: [6],"e":[25],"p":[]}, { v: [6],"e":[25],"p":[]},,,,],
// 		[,,,,,, { v: [2],"e":[24],"p":[]}, { v: [2],"e":[24],"p":[]},,,,,,,,,,,,],
// 		[,,,,,, { v: [2],"e":[24],"p":[]}, { v: [2],"e":[24],"p":[]},,,,,,,,,,,,],
// 		[,,,,,, { v: [2],"e":[24],"p":[]}, { v: [2],"e":[24],"p":[]},,,,,,, { v: [6],"e":[25],"p":[]}, { v: [6],"e":[25],"p":[]},,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,, { v: [10],"e":[24],"p":[]},,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,, { v: [9],"e":[24],"p":[]},,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,, { v: [12],"e":[25],"p":[]},,,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,, { v: [11],"e":[25],"p":[]},,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[{ v: [0,1],"e":[],"p":[]}, { v: [0,13],"e":[],"p":[]}, { v: [0,13],"e":[],"p":[]}, { v: [0,7],"e":[],"p":[]},,,,, { v: [4,3],"e":[],"p":[]}, { v: [4,5],"e":[],"p":[]}, { v: [4,14],"e":[],"p":[]}, { v: [4,14],"e":[],"p":[]}, { v: [6,5],"e":[],"p":[]}, { v: [6,7],"e":[],"p":[]},,,,,,],
// 		[{ v: [0,1],"e":[],"p":[]}, { v: [0,13],"e":[],"p":[]}, { v: [0,13],"e":[],"p":[]}, { v: [0,7],"e":[],"p":[]}, { v: [2,1],"e":[],"p":[]}, { v: [2,3],"e":[],"p":[]},,, { v: [4,3],"e":[],"p":[]}, { v: [4,5],"e":[],"p":[]}, { v: [4,14],"e":[],"p":[]}, { v: [4,14],"e":[],"p":[]},,,,,,,,],
// 		[,,,,,, { v: [2],"e":[24],"p":[]}, { v: [2],"e":[24],"p":[]},,,,,,, { v: [6],"e":[25],"p":[]}, { v: [6],"e":[25],"p":[]},,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,, { v: [10],"e":[24],"p":[]},,,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,,, { v: [11],"e":[25],"p":[]},,,,],
// 		[,,,,,, { v: [2],"e":[24],"p":[]}, { v: [2],"e":[24],"p":[]},,,,,,, { v: [6],"e":[25],"p":[]}, { v: [6],"e":[25],"p":[]},,,,],
// 		[,,,,,,,,,,,,,,,,,,,],
// 		[,,,,,,, { v: [9],"e":[24],"p":[]},,,,,,,,,,,,],
// 		[,,,,,,,,,,,,,, { v: [12],"e":[25],"p":[]},,,,,]
// 	]);

// });

// test("edges-faces", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	ear.graph.populate(folded);
// 	console.log(ear.graph.getEdgesFacesOverlap(folded));
// 	expect(ear.graph.getEdgesFacesOverlap(folded).flat().length).toBe(1167);
// });
