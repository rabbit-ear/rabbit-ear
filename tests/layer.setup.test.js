import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("3D off for now", () => {});

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
// 	const clusters_graphs = ear.layer.graphGroupCopies(graph, clusters_faces, clusters_transformXY);
// 	const faces_polygon = ear.general.mergeArraysWithHoles(...clusters_graphs
// 		.map(copy => ear.graph.makeFacesPolygon(copy)));
// 	fs.writeFileSync(`./tests/tmp/sets_graphs.json`, JSON.stringify(clusters_graphs, null, 2));
// 	fs.writeFileSync(`./tests/tmp/faces_polygon.json`, JSON.stringify(faces_polygon, null, 2));
// 	expect(true).toBe(true);
// });
