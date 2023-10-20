import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("make faces_faces, square", () => {
	const result = ear.graph.makeFacesFaces({
		faces_vertices: [[0, 1, 3], [2, 3, 1]],
	});
	expect(result.length).toBe(2);
	expect(result[0]).toEqual(expect.arrayContaining([1]));
	expect(result[1]).toEqual(expect.arrayContaining([0]));
});

test("make faces_faces, invalid faces", () => {
	const res1 = ear.graph.makeFacesFaces({
		faces_vertices: [[undefined], [undefined]],
	});
	expect(res1[0]).toEqual(expect.arrayContaining([1]));
	expect(res1[1]).toEqual(expect.arrayContaining([0]));
	// lol. look, it will match anything including strings
	const res2 = ear.graph.makeFacesFaces({ faces_vertices: [["hi"], ["hi"]] });
	expect(res2[0]).toEqual(expect.arrayContaining([1]));
	expect(res2[1]).toEqual(expect.arrayContaining([0]));
	const res3 = ear.graph.makeFacesFaces({ faces_vertices: [["hi"], ["bye"]] });
	expect(res3[0].length).toBe(0);
	expect(res3[1].length).toBe(0);
});

test("make faces_faces, degenerate", () => {
	// technically these edges are invalid
	const res0 = ear.graph.makeFacesFaces({
		faces_vertices: [[0, 0]],
	});
	// should be one empty face_face array
	expect(res0.length).toBe(1);
	expect(res0[0].length).toBe(0);
});

test("make faces_faces 4", () => new Promise(done => {
	try {
		const result = ear.graph.makeFacesFaces({
			faces_vertices: [[0], [1], undefined, [2]],
		});
	} catch (error) {
		expect(error).not.toBe(undefined);
		done();
	}
}));

test("make faces_faces 5", () => new Promise(done => {
	try {
		const result = ear.graph.makeFacesFaces();
	} catch (error) {
		expect(error).not.toBe(undefined);
		done();
	}
}));

test("make faces_faces 6", () => new Promise(done => {
	try {
		const result = ear.graph.makeFacesFaces({});
	} catch (error) {
		expect(error).not.toBe(undefined);
		done();
	}
}));

test("make faces_faces 7", () => {
	const result = ear.graph.makeFacesFaces({ faces_vertices: [] });
	expect(result.length).toBe(0);
});

test("kabuto", () => {
	const kabutoJSON = `{"vertices_coords": [[0.5,0],[0.5,0.5],[1,0.5],[0.25,0.25],[0,0.5],[0.5,1],[0.75,0.75],[0.14644660940672669,0],[1,0.8535533905932734],[0.625,0],[1,0.375],[0,0],[1,1],[0.75,0],[1,0.25],[0,0.14644660940672669],[0.8535533905932734,1],[0,1],[1,0]],"edges_vertices": [[0,1],[1,2],[3,4],[0,2],[5,6],[5,4],[3,7],[6,8],[9,10],[1,5],[4,1],[0,3],[11,3],[3,1],[6,2],[1,6],[6,12],[13,14],[3,15],[6,16],[5,17],[17,4],[13,18],[18,14],[11,7],[7,0],[2,8],[8,12],[4,15],[15,11],[0,9],[9,13],[14,10],[10,2],[12,16],[16,5]],"edges_assignment": ["V","V","V","V","V","V","V","V","V","M","M","M","M","M","M","M","M","M","M","M","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B","B"],"faces_vertices": [[1,0,2],[5,4,1],[4,5,17],[2,0,9,10],[10,9,13,14],[14,13,18],[3,7,0],[8,6,2],[0,1,3],[1,2,6],[4,3,1],[6,5,1],[3,4,15],[5,6,16],[11,3,15],[6,12,16],[7,3,11],[6,8,12]]}`;
	const kabuto = JSON.parse(kabutoJSON);
	const faces_faces = ear.graph.makeFacesFaces(kabuto);
	const answer = [
		[8, 3, 9], [2, 10, 11], [1], [0, 4], [3, 5], [4], [16, 8], [17, 9],
		[0, 6, 10], [0, 7, 11], [1, 8, 12], [1, 9, 13], [10, 14], [11, 15],
		[12, 16], [13, 17], [6, 14], [7, 15],
	];
	faces_faces.forEach((faces, f) => faces
		.forEach(face => expect(answer[f].includes(face)).toBe(true)));
});

test("face that repeats an edge", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.5]],
		edges_vertices: [[0, 1], [1, 2], [2, 4], [4, 2], [2, 3], [3, 0]],
		edges_assignment: ["B", "B", "B", "B", "B", "B"],
		faces_vertices: [[0, 1, 2, 4, 2, 3]],
		faces_edges: [[0, 1, 2, 3, 4, 5]],
	};
	ear.graph.populate(graph);
	expect(graph.faces_faces.length).toBe(1);
	expect(graph.faces_faces[0].length).toBe(0);
});
