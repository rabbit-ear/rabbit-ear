import { expect, test } from "vitest";
import fs from "fs";
import ear from "../rabbit-ear.js";

// test("write file", () => {
// const foldfile = fs.readFileSync("./tests/files/fold/five-panels.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	fs.writeFileSync(
// 		`./tests/tmp/folded-vertices.json`,
// 		JSON.stringify(ear.graph.makeVerticesCoordsFlatFolded(fold).map(p => p.map(n => ear.general.cleanNumber(n, 12))), null, 2),
// 	);
// });

test("tacosAndTortillas four panel square", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/panels-4x2.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);

	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
	} = ear.layer.makeTacosAndTortillas(folded);

	// only two taco-tacos, one on the top and one bottom
	expect(taco_taco).toMatchObject([
		[[0, 1], [2, 3]],
		[[4, 5], [6, 7]]
	]);

	expect(taco_tortilla).toMatchObject([
		{ taco: [1, 2], tortilla: 3 },
		{ taco: [5, 6], tortilla: 7 },
	]);

	// tortilla-tortilla between 4 sets of pairs, 0-4, 1-5, 2-6, 3-7
	expect(tortilla_tortilla).toMatchObject([
		[[0, 4], [1, 5]],
		[[0, 4], [2, 6]],
		[[0, 4], [3, 7]],
		[[1, 5], [2, 6]],
		[[1, 5], [3, 7]],
		[[2, 6], [3, 7]]
	]);
});


test("tacosAndTortillas five panels", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/panels-5.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);

	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
	} = ear.layer.makeTacosAndTortillas(folded);

	expect(taco_taco).toMatchObject([
		[[0, 4], [2, 3]],
		[[3, 4], [1, 2]],
	]);
	expect(taco_tortilla).toMatchObject([
		{ taco: [0, 4], tortilla: 1 },
		{ taco: [3, 4], tortilla: 0 },
		{ taco: [2, 3], tortilla: 1 },
		{ taco: [1, 2], tortilla: 0 },
	]);
	expect(tortilla_tortilla).toMatchObject([]);
});


test("tacosAndTortillas triangle strip", () => {
	const fileStrip1 = fs.readFileSync("./tests/files/fold/triangle-strip.fold", "utf-8");
	const fileStrip2 = fs.readFileSync("./tests/files/fold/triangle-strip-2.fold", "utf-8");
	const foldStrip1 = JSON.parse(fileStrip1);
	const foldStrip2 = JSON.parse(fileStrip2);
	const folded1 = ear.graph.getFramesByClassName(foldStrip1, "foldedForm")[0];
	const folded2 = ear.graph.getFramesByClassName(foldStrip2, "foldedForm")[0];
	ear.graph.populate(folded1);
	ear.graph.populate(folded2);

	const res1 = ear.layer.makeTacosAndTortillas(folded1);
	expect(res1.taco_taco.length).toBe(0);
	expect(res1.taco_tortilla.length).toBe(0);
	expect(res1.tortilla_tortilla.length).toBe(0);

	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
	} = ear.layer.makeTacosAndTortillas(folded2);

	expect(taco_taco).toMatchObject([
		[[15, 16], [4, 5]],
		[[17, 27], [6, 7]],
		[[25, 26], [8, 9]],
		[[23, 24], [10, 11]],
		[[21, 22], [12, 13]]
	]);

	expect(taco_tortilla.length).toBe(0);

	expect(tortilla_tortilla).toMatchObject([
		[[13, 19], [21, 20]],
		[[11, 21], [23, 22]],
		[[11, 21], [10, 13]],
		[[9, 23], [25, 24]],
		[[9, 23], [8, 11]],
		[[7, 25], [27, 26]],
		[[7, 25], [6, 9]],
		[[5, 27], [16, 17]],
		[[5, 27], [4, 7]],
		[[3, 16], [14, 15]],
		[[3, 16], [2, 5]],
		[[1, 14], [0, 3]],
		[[14, 15], [2, 5]],
		[[16, 17], [4, 7]],
		[[26, 27], [9, 6]],
		[[24, 25], [11, 8]],
		[[22, 23], [13, 10]]
	]);
});

test("tacosAndTortillas bird base", () => {
	const cp = ear.graph.bird();
	const folded = {
		...cp,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
	};
	ear.graph.populate(folded);

	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
	} = ear.layer.makeTacosAndTortillas(folded);

	expect(taco_taco).toMatchObject([
		// long 22.5 edges, one side, 8 faces
		// faces: 0-1, 5-6, 4-7, 8-11
		[[0, 1], [4, 7]],
		[[0, 1], [5, 6]],
		[[0, 1], [8, 11]],
		[[4, 7], [5, 6]],
		[[4, 7], [8, 11]],
		[[5, 6], [8, 11]],

		// long 22.5 edges, the other side, 8 faces
		// faces: 2-3, 13-14, 9-10, 12-15
		[[9, 10], [12, 15]],
		[[9, 10], [13, 14]],
		[[9, 10], [2, 3]],
		[[12, 15], [13, 14]],
		[[12, 15], [2, 3]],
		[[13, 14], [2, 3]],

		// inside reverse fold (under armpit), one side: 0-4, 5-8
		[[0, 4], [5, 8]],
		// top 45 triangle hypotenuse, one side: 6-16, 7-19
		[[7, 19], [6, 16]],
		// inside reverse fold (under armpit), the other side: 3-13, 9-12
		[[9, 12], [3, 13]],
		// top 45 triangle hypotenuse, the other side: 14-18, 15-17
		[[15, 17], [14, 18]]
	]);

	expect(taco_tortilla).toMatchObject([
		{ taco: [0, 4], tortilla: 1 },
		{ taco: [0, 4], tortilla: 11 },
		{ taco: [5, 8], tortilla: 1 },
		{ taco: [5, 8], tortilla: 11 },
		{ taco: [9, 12], tortilla: 2 },
		{ taco: [9, 12], tortilla: 10 },
		{ taco: [3, 13], tortilla: 2 },
		{ taco: [3, 13], tortilla: 10 },
		{ taco: [6, 7], tortilla: 1 },
		{ taco: [6, 7], tortilla: 19 },
		{ taco: [6, 7], tortilla: 11 },
		{ taco: [6, 7], tortilla: 16 },
		{ taco: [14, 15], tortilla: 2 },
		{ taco: [14, 15], tortilla: 18 },
		{ taco: [14, 15], tortilla: 10 },
		{ taco: [14, 15], tortilla: 17 },
		{ taco: [0, 4], tortilla: 6 },
		{ taco: [0, 4], tortilla: 7 },
		{ taco: [5, 8], tortilla: 6 },
		{ taco: [5, 8], tortilla: 7 },
		{ taco: [9, 12], tortilla: 14 },
		{ taco: [9, 12], tortilla: 15 },
		{ taco: [3, 13], tortilla: 14 },
		{ taco: [3, 13], tortilla: 15 }
	]);

	expect(tortilla_tortilla).toMatchObject([
		[[1, 2], [11, 10]],
		[[18, 19], [17, 16]],
		[[1, 19], [11, 16]],
		[[2, 18], [10, 17]],
		[[1, 19], [6, 6]],
		[[1, 19], [7, 7]],
		[[2, 18], [14, 14]],
		[[2, 18], [15, 15]],
		[[11, 16], [6, 6]],
		[[11, 16], [7, 7]],
		[[10, 17], [14, 14]],
		[[10, 17], [15, 15]]
	]);

});

test("tacosAndTortillas kabuto", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/kabuto.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);

	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
	} = ear.layer.makeTacosAndTortillas(folded);

 	expect(taco_taco).toMatchObject([
		[[0, 8], [1, 10]],
		[[0, 9], [1, 11]],
		[[10, 12], [0, 3]],
		[[10, 12], [1, 2]],
		[[10, 12], [6, 8]],
		[[10, 12], [4, 5]],
		[[0, 3], [11, 13]],
		[[0, 3], [1, 2]],
		[[0, 3], [6, 8]],
		[[0, 3], [7, 9]],
		[[0, 3], [4, 5]],
		[[11, 13], [1, 2]],
		[[11, 13], [7, 9]],
		[[11, 13], [4, 5]],
		[[1, 2], [6, 8]],
		[[1, 2], [7, 9]],
		[[1, 2], [4, 5]],
		[[6, 16], [12, 14]],
		[[7, 17], [13, 15]],
		[[6, 8], [4, 5]],
		[[7, 9], [4, 5]]
  ]);

	expect(taco_tortilla).toMatchObject([
		{ taco: [ 0, 8 ], tortilla: 14 },
		{ taco: [ 0, 8 ], tortilla: 16 },
		{ taco: [ 0, 9 ], tortilla: 15 },
		{ taco: [ 0, 9 ], tortilla: 17 },
		{ taco: [ 6, 16 ], tortilla: 0 },
		{ taco: [ 6, 16 ], tortilla: 1 },
		{ taco: [ 6, 16 ], tortilla: 2 },
		{ taco: [ 6, 16 ], tortilla: 3 },
		{ taco: [ 6, 16 ], tortilla: 4 },
		{ taco: [ 6, 16 ], tortilla: 5 },
		{ taco: [ 6, 16 ], tortilla: 8 },
		{ taco: [ 6, 16 ], tortilla: 10 },
		{ taco: [ 7, 17 ], tortilla: 0 },
		{ taco: [ 7, 17 ], tortilla: 1 },
		{ taco: [ 7, 17 ], tortilla: 2 },
		{ taco: [ 7, 17 ], tortilla: 3 },
		{ taco: [ 7, 17 ], tortilla: 4 },
		{ taco: [ 7, 17 ], tortilla: 5 },
		{ taco: [ 7, 17 ], tortilla: 9 },
		{ taco: [ 7, 17 ], tortilla: 11 },
		{ taco: [ 3, 4 ], tortilla: 0 },
		{ taco: [ 3, 4 ], tortilla: 1 },
		{ taco: [ 3, 4 ], tortilla: 2 },
		{ taco: [ 3, 4 ], tortilla: 5 },
		{ taco: [ 3, 4 ], tortilla: 6 },
		{ taco: [ 3, 4 ], tortilla: 7 },
		{ taco: [ 3, 4 ], tortilla: 8 },
		{ taco: [ 3, 4 ], tortilla: 9 },
		{ taco: [ 3, 4 ], tortilla: 10 },
		{ taco: [ 3, 4 ], tortilla: 11 },
		{ taco: [ 3, 4 ], tortilla: 12 },
		{ taco: [ 3, 4 ], tortilla: 13 },
		{ taco: [ 3, 4 ], tortilla: 14 },
		{ taco: [ 3, 4 ], tortilla: 15 },
		{ taco: [ 3, 4 ], tortilla: 16 },
		{ taco: [ 3, 4 ], tortilla: 17 },
		{ taco: [ 1, 11 ], tortilla: 15 },
		{ taco: [ 1, 11 ], tortilla: 17 },
		{ taco: [ 1, 10 ], tortilla: 14 },
		{ taco: [ 1, 10 ], tortilla: 16 },
		{ taco: [ 14, 16 ], tortilla: 0 },
		{ taco: [ 14, 16 ], tortilla: 1 },
		{ taco: [ 14, 16 ], tortilla: 2 },
		{ taco: [ 14, 16 ], tortilla: 3 },
		{ taco: [ 14, 16 ], tortilla: 4 },
		{ taco: [ 14, 16 ], tortilla: 5 },
		{ taco: [ 14, 16 ], tortilla: 6 },
		{ taco: [ 14, 16 ], tortilla: 8 },
		{ taco: [ 14, 16 ], tortilla: 10 },
		{ taco: [ 14, 16 ], tortilla: 12 },
		{ taco: [ 8, 10 ], tortilla: 0 },
		{ taco: [ 8, 10 ], tortilla: 1 },
		{ taco: [ 8, 10 ], tortilla: 2 },
		{ taco: [ 8, 10 ], tortilla: 3 },
		{ taco: [ 8, 10 ], tortilla: 4 },
		{ taco: [ 8, 10 ], tortilla: 5 },
		{ taco: [ 9, 11 ], tortilla: 0 },
		{ taco: [ 9, 11 ], tortilla: 1 },
		{ taco: [ 9, 11 ], tortilla: 2 },
		{ taco: [ 9, 11 ], tortilla: 3 },
		{ taco: [ 9, 11 ], tortilla: 4 },
		{ taco: [ 9, 11 ], tortilla: 5 },
		{ taco: [ 15, 17 ], tortilla: 0 },
		{ taco: [ 15, 17 ], tortilla: 1 },
		{ taco: [ 15, 17 ], tortilla: 2 },
		{ taco: [ 15, 17 ], tortilla: 3 },
		{ taco: [ 15, 17 ], tortilla: 4 },
		{ taco: [ 15, 17 ], tortilla: 5 },
		{ taco: [ 15, 17 ], tortilla: 7 },
		{ taco: [ 15, 17 ], tortilla: 9 },
		{ taco: [ 15, 17 ], tortilla: 11 },
		{ taco: [ 15, 17 ], tortilla: 13 },
		{ taco: [ 12, 14 ], tortilla: 0 },
		{ taco: [ 12, 14 ], tortilla: 1 },
		{ taco: [ 12, 14 ], tortilla: 2 },
		{ taco: [ 12, 14 ], tortilla: 3 },
		{ taco: [ 12, 14 ], tortilla: 4 },
		{ taco: [ 12, 14 ], tortilla: 5 },
		{ taco: [ 12, 14 ], tortilla: 8 },
		{ taco: [ 12, 14 ], tortilla: 10 },
		{ taco: [ 13, 15 ], tortilla: 0 },
		{ taco: [ 13, 15 ], tortilla: 1 },
		{ taco: [ 13, 15 ], tortilla: 2 },
		{ taco: [ 13, 15 ], tortilla: 3 },
		{ taco: [ 13, 15 ], tortilla: 4 },
		{ taco: [ 13, 15 ], tortilla: 5 },
		{ taco: [ 13, 15 ], tortilla: 9 },
		{ taco: [ 13, 15 ], tortilla: 11 }
	]);

	expect(tortilla_tortilla.length).toBe(0);

});

test("tacosAndTortillas crane", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);

	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
	} = ear.layer.makeTacosAndTortillas(folded);
	// console.log("taco_taco", taco_taco);
});

test("tacosAndTortillas Kraft bird", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/kraft-bird-base.fold", "utf-8");
	const cp = JSON.parse(foldfile);
	const folded = {
		...cp,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
	};
	ear.graph.populate(folded);

	// fs.writeFileSync(
	// 	`./tests/tmp/tacos-tortillas.json`,
	// 	JSON.stringify(res, null, 2),
	// );

	const resultFile = fs.readFileSync(
		"./tests/files/json/kraft-bird-tacos-tortillas.json",
		"utf-8"
	);
	const result = JSON.parse(resultFile);

	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
	} = ear.layer.makeTacosAndTortillas(folded);

	expect(taco_taco).toMatchObject(result.taco_taco);
	expect(taco_tortilla).toMatchObject(result.taco_tortilla);
	expect(tortilla_tortilla).toMatchObject(result.tortilla_tortilla);
});
