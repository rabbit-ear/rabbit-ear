import { expect, test } from "vitest";
import fs from "fs";
import ear from "../rabbit-ear.js";

// test("write folded vertices", () => {
// const foldfile = fs.readFileSync("./tests/files/fold/strip-weave.fold", "utf-8");
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
		transitivity,
	} = ear.layer.makeTacosTortillasTransitivity(folded);

	// only two taco-tacos, one on the top and one bottom
	expect(taco_taco).toMatchObject([
		[0, 2, 1, 3],
		[4, 6, 5, 7]
	]);

	expect(taco_tortilla).toMatchObject([
		[1, 3, 2],
		[5, 7, 6],
	]);

	// tortilla-tortilla between 4 sets of pairs, 0-4, 1-5, 2-6, 3-7
	expect(tortilla_tortilla).toMatchObject([
		[0, 4, 1, 5],
		[0, 4, 2, 6],
		[0, 4, 3, 7],
		[1, 5, 2, 6],
		[1, 5, 3, 7],
		[2, 6, 3, 7]
	]);

	expect(transitivity).toMatchObject([]);
});

test("tacosAndTortillas strip weave", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/strip-weave.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);

	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
		transitivity,
		faces_winding,
		faces_facesOverlap,
	} = ear.layer.makeTacosTortillasTransitivity(folded);

	// interestingly, this model, which obviously has various different layer
	// solutions, results in no information for the solver.
	expect(taco_taco).toMatchObject([]);
	expect(taco_tortilla).toMatchObject([]);
	expect(tortilla_tortilla).toMatchObject([]);
	expect(transitivity).toMatchObject([[0, 1, 4]]);

	expect(faces_winding).toMatchObject([true, false, true, false, false, true, false ]);
	expect(faces_facesOverlap).toMatchObject([
		[1, 4],
		[0, 2, 4],
		[1, 3, 5],
		[2, 6],
		[0, 1, 5],
		[2, 4, 6],
		[3, 5],
	]);
});

test("tacosAndTortillas zig-zag panels", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/panels-zig-zag.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);

	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
		transitivity,
	} = ear.layer.makeTacosTortillasTransitivity(folded);

	expect(taco_taco).toMatchObject([
		[0, 2, 4, 3],
		[3, 1, 4, 2],
	]);

	expect(taco_tortilla).toMatchObject([
		[0, 1, 4],
		[3, 0, 4],
		[2, 1, 3],
		[1, 0, 2],
	]);

	expect(tortilla_tortilla).toMatchObject([]);

	expect(transitivity).toMatchObject([[0, 1, 3]]);
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

	const res1 = ear.layer.makeTacosTortillasTransitivity(folded1);
	expect(res1.taco_taco.length).toBe(0);
	expect(res1.taco_tortilla.length).toBe(0);
	expect(res1.tortilla_tortilla.length).toBe(0);
	expect(res1.transitivity.length).toBe(0);

	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
		transitivity,
	} = ear.layer.makeTacosTortillasTransitivity(folded2);

	expect(taco_taco).toMatchObject([
		[15, 4, 16, 5],
		[17, 6, 27, 7],
		[25, 8, 26, 9],
		[23, 10, 24, 11],
		[21, 12, 22, 13],
	]);

	expect(taco_tortilla.length).toBe(0);

	expect(tortilla_tortilla).toMatchObject([
		[13, 19, 21, 20],
		[11, 21, 23, 22],
		[11, 21, 10, 13],
		[9, 23, 25, 24],
		[9, 23, 8, 11],
		[7, 25, 27, 26],
		[7, 25, 6, 9],
		[5, 27, 16, 17],
		[5, 27, 4, 7],
		[3, 16, 14, 15],
		[3, 16, 2, 5],
		[1, 14, 0, 3],
		[14, 15, 2, 5],
		[16, 17, 4, 7],
		[26, 27, 9, 6],
		[24, 25, 11, 8],
		[22, 23, 13, 10],
	]);

	expect(transitivity).toMatchObject([[2, 3, 14], [18, 19, 20]]);
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
		transitivity,
	} = ear.layer.makeTacosTortillasTransitivity(folded);

	expect(taco_taco).toMatchObject([
		// long 22.5 edges, one side, 8 faces
		// faces: 0-1, 5-6, 4-7, 8-11
		[0, 4, 1, 7],
		[0, 5, 1, 6],
		[0, 8, 1, 11],
		[4, 5, 7, 6],
		[4, 8, 7, 11],
		[5, 8, 6, 11],

		// long 22.5 edges, the other side, 8 faces
		// faces: 2-3, 13-14, 9-10, 12-15
		[9, 12, 10, 15],
		[9, 13, 10, 14],
		[9, 2, 10, 3],
		[12, 13, 15, 14],
		[12, 2, 15, 3],
		[13, 2, 14, 3],

		// inside reverse fold (under armpit), one side: 0-4, 5-8
		[0, 5, 4, 8],
		// top 45 triangle hypotenuse, one side: 6-16, 7-19
		[7, 6, 19, 16],
		// inside reverse fold (under armpit), the other side: 3-13, 9-12
		[9, 3, 12, 13],
		// top 45 triangle hypotenuse, the other side: 14-18, 15-17
		[15, 14, 17, 18]
	]);

	expect(taco_tortilla).toMatchObject([
		[0, 1, 4],
		[0, 11, 4],
		[5, 1, 8],
		[5, 11, 8],
		[9, 2, 12],
		[9, 10, 12],
		[3, 2, 13],
		[3, 10, 13],
		[6, 1, 7],
		[6, 19, 7],
		[6, 11, 7],
		[6, 16, 7],
		[14, 2, 15],
		[14, 18, 15],
		[14, 10, 15],
		[14, 17, 15],
		[0, 6, 4],
		[0, 7, 4],
		[5, 6, 8],
		[5, 7, 8],
		[9, 14, 12],
		[9, 15, 12],
		[3, 14, 13],
		[3, 15, 13],
	]);

	expect(tortilla_tortilla).toMatchObject([
		[1, 2, 11, 10],
		[18, 19, 17, 16],
		[1, 19, 11, 16],
		[2, 18, 10, 17],
		[1, 19, 6, 6],
		[1, 19, 7, 7],
		[2, 18, 14, 14],
		[2, 18, 15, 15],
		[11, 16, 6, 6],
		[11, 16, 7, 7],
		[10, 17, 14, 14],
		[10, 17, 15, 15],
	]);

	expect(transitivity).toMatchObject([
		[0, 5, 7], [0, 5, 11], [0, 6, 7], [0, 6, 8], [0, 6, 11], [0, 7, 8],
		[0, 7, 11], [1, 4, 5], [1, 4, 6], [1, 4, 8], [1, 4, 11], [1, 5, 7],
		[1, 5, 11], [1, 6, 8], [1, 6, 11], [1, 7, 8], [1, 7, 11], [2, 9, 13],
		[2, 9, 14], [2, 9, 15], [2, 10, 12], [2, 10, 13], [2, 10, 14], [2, 10, 15],
		[2, 12, 13], [2, 12, 14], [2, 13, 15], [3, 9, 14], [3, 9, 15], [3, 10, 12],
		[3, 10, 14], [3, 10, 15], [3, 12, 14], [3, 14, 15], [4, 5, 11], [4, 6, 8],
		[4, 6, 11], [5, 7, 11], [6, 7, 8], [9, 13, 15], [9, 14, 15], [10, 12, 13],
		[10, 12, 14], [10, 13, 15]
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
		transitivity,
	} = ear.layer.makeTacosTortillasTransitivity(folded);

 	expect(taco_taco).toMatchObject([
		[0, 1, 8, 10],
		[0, 1, 9, 11],
		[10, 0, 12, 3],
		[10, 1, 12, 2],
		[10, 6, 12, 8],
		[10, 4, 12, 5],
		[0, 11, 3, 13],
		[0, 1, 3, 2],
		[0, 6, 3, 8],
		[0, 7, 3, 9],
		[0, 4, 3, 5],
		[11, 1, 13, 2],
		[11, 7, 13, 9],
		[11, 4, 13, 5],
		[1, 6, 2, 8],
		[1, 7, 2, 9],
		[1, 4, 2, 5],
		[6, 12, 16, 14],
		[7, 13, 17, 15],
		[6, 4, 8, 5],
		[7, 4, 9, 5],
  ]);

	expect(taco_tortilla).toMatchObject([
		[0, 14, 8],
		[0, 16, 8],
		[0, 15, 9],
		[0, 17, 9],
		[6, 0, 16],
		[6, 1, 16],
		[6, 2, 16],
		[6, 3, 16],
		[6, 4, 16],
		[6, 5, 16],
		[6, 8, 16],
		[6, 10, 16],
		[7, 0, 17],
		[7, 1, 17],
		[7, 2, 17],
		[7, 3, 17],
		[7, 4, 17],
		[7, 5, 17],
		[7, 9, 17],
		[7, 11, 17],
		[3, 0, 4],
		[3, 1, 4],
		[3, 2, 4],
		[3, 5, 4],
		[3, 6, 4],
		[3, 7, 4],
		[3, 8, 4],
		[3, 9, 4],
		[3, 10, 4],
		[3, 11, 4],
		[3, 12, 4],
		[3, 13, 4],
		[3, 14, 4],
		[3, 15, 4],
		[3, 16, 4],
		[3, 17, 4],
		[1, 15, 11],
		[1, 17, 11],
		[1, 14, 10],
		[1, 16, 10],
		[14, 0, 16],
		[14, 1, 16],
		[14, 2, 16],
		[14, 3, 16],
		[14, 4, 16],
		[14, 5, 16],
		[14, 6, 16],
		[14, 8, 16],
		[14, 10, 16],
		[14, 12, 16],
		[8, 0, 10],
		[8, 1, 10],
		[8, 2, 10],
		[8, 3, 10],
		[8, 4, 10],
		[8, 5, 10],
		[9, 0, 11],
		[9, 1, 11],
		[9, 2, 11],
		[9, 3, 11],
		[9, 4, 11],
		[9, 5, 11],
		[15, 0, 17],
		[15, 1, 17],
		[15, 2, 17],
		[15, 3, 17],
		[15, 4, 17],
		[15, 5, 17],
		[15, 7, 17],
		[15, 9, 17],
		[15, 11, 17],
		[15, 13, 17],
		[12, 0, 14],
		[12, 1, 14],
		[12, 2, 14],
		[12, 3, 14],
		[12, 4, 14],
		[12, 5, 14],
		[12, 8, 14],
		[12, 10, 14],
		[13, 0, 15],
		[13, 1, 15],
		[13, 2, 15],
		[13, 3, 15],
		[13, 4, 15],
		[13, 5, 15],
		[13, 9, 15],
		[13, 11, 15],
	]);

	expect(tortilla_tortilla.length).toBe(0);

	expect(transitivity).toMatchObject([
		[0, 1, 4], [0, 1, 5], [0, 1, 6], [0, 1, 7], [0, 1, 12], [0, 1, 13],
		[0, 1, 14], [0, 1, 15], [0, 1, 16], [0, 1, 17], [0, 2, 4], [0, 2, 5],
		[0, 2, 6], [0, 2, 7], [0, 2, 8], [0, 2, 9], [0, 2, 10], [0, 2, 11],
		[0, 2, 12], [0, 2, 13], [0, 2, 14], [0, 2, 15], [0, 2, 16], [0, 2, 17],
		[0, 3, 14], [0, 3, 15], [0, 3, 16], [0, 3, 17], [0, 4, 6], [0, 4, 7],
		[0, 4, 8], [0, 4, 9], [0, 4, 10], [0, 4, 11], [0, 4, 12], [0, 4, 13],
		[0, 4, 14], [0, 4, 15], [0, 4, 16], [0, 4, 17], [0, 5, 6], [0, 5, 7],
		[0, 5, 8], [0, 5, 9], [0, 5, 10], [0, 5, 11], [0, 5, 12], [0, 5, 13],
		[0, 5, 14], [0, 5, 15], [0, 5, 16], [0, 5, 17], [0, 6, 10], [0, 6, 12],
		[0, 6, 14], [0, 7, 11], [0, 7, 13], [0, 7, 15], [0, 8, 12], [0, 9, 13],
		[0, 10, 14], [0, 10, 16], [0, 11, 15], [0, 11, 17], [0, 12, 16], [0, 13, 17],
		[1, 2, 14], [1, 2, 15], [1, 2, 16], [1, 2, 17], [1, 3, 5], [1, 3, 6],
		[1, 3, 7], [1, 3, 8], [1, 3, 9], [1, 3, 10], [1, 3, 11], [1, 3, 12],
		[1, 3, 13], [1, 3, 14], [1, 3, 15], [1, 3, 16], [1, 3, 17], [1, 4, 6],
		[1, 4, 7], [1, 4, 8], [1, 4, 9], [1, 4, 10], [1, 4, 11], [1, 4, 12],
		[1, 4, 13], [1, 4, 14], [1, 4, 15], [1, 4, 16], [1, 4, 17], [1, 5, 6],
		[1, 5, 7], [1, 5, 8], [1, 5, 9], [1, 5, 10], [1, 5, 11], [1, 5, 12],
		[1, 5, 13], [1, 5, 14], [1, 5, 15], [1, 5, 16], [1, 5, 17], [1, 6, 10],
		[1, 6, 12], [1, 6, 14], [1, 7, 11], [1, 7, 13], [1, 7, 15], [1, 8, 12],
		[1, 8, 14], [1, 8, 16], [1, 9, 13], [1, 9, 15], [1, 9, 17], [1, 12, 16],
		[1, 13, 17], [2, 3, 5], [2, 3, 6], [2, 3, 7], [2, 3, 8], [2, 3, 9],
		[2, 3, 10], [2, 3, 11], [2, 3, 12], [2, 3, 13], [2, 3, 14], [2, 3, 15],
		[2, 3, 16], [2, 3, 17], [2, 4, 6], [2, 4, 7], [2, 4, 8], [2, 4, 9],
		[2, 4, 10], [2, 4, 11], [2, 4, 12], [2, 4, 13], [2, 4, 14], [2, 4, 15],
		[2, 4, 16], [2, 4, 17], [2, 5, 6], [2, 5, 7], [2, 5, 8], [2, 5, 9],
		[2, 5, 10], [2, 5, 11], [2, 5, 12], [2, 5, 13], [2, 5, 14], [2, 5, 15],
		[2, 5, 16], [2, 5, 17], [2, 6, 10], [2, 6, 12], [2, 6, 14], [2, 7, 11],
		[2, 7, 13], [2, 7, 15], [2, 8, 12], [2, 8, 14], [2, 8, 16], [2, 9, 13],
		[2, 9, 15], [2, 9, 17], [2, 10, 14], [2, 10, 16], [2, 11, 15], [2, 11, 17],
		[2, 12, 16], [2, 13, 17], [3, 5, 6], [3, 5, 7], [3, 5, 8], [3, 5, 9],
		[3, 5, 10], [3, 5, 11], [3, 5, 12], [3, 5, 13], [3, 5, 14], [3, 5, 15],
		[3, 5, 16], [3, 5, 17], [3, 6, 10], [3, 6, 12], [3, 6, 14], [3, 7, 11],
		[3, 7, 13], [3, 7, 15], [3, 8, 12], [3, 8, 14], [3, 8, 16], [3, 9, 13],
		[3, 9, 15], [3, 9, 17], [3, 10, 14], [3, 10, 16], [3, 11, 15], [3, 11, 17],
		[3, 12, 16], [3, 13, 17], [4, 5, 14], [4, 5, 15], [4, 5, 16], [4, 5, 17],
		[4, 6, 10], [4, 6, 12], [4, 6, 14], [4, 7, 11], [4, 7, 13], [4, 7, 15],
		[4, 8, 12], [4, 8, 14], [4, 8, 16], [4, 9, 13], [4, 9, 15], [4, 9, 17],
		[4, 10, 14], [4, 10, 16], [4, 11, 15], [4, 11, 17], [4, 12, 16], [4, 13, 17],
		[5, 6, 10], [5, 6, 12], [5, 6, 14], [5, 7, 11], [5, 7, 13], [5, 7, 15],
		[5, 8, 12], [5, 8, 14], [5, 8, 16], [5, 9, 13], [5, 9, 15], [5, 9, 17],
		[5, 10, 14], [5, 10, 16], [5, 11, 15], [5, 11, 17], [5, 12, 16], [5, 13, 17],
		[6, 8, 14], [6, 10, 14], [7, 9, 15], [7, 11, 15], [8, 10, 14], [8, 10, 16],
		[8, 12, 16], [9, 11, 15], [9, 11, 17], [9, 13, 17], [10, 12, 16], [11, 13, 17]
	]);
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
		transitivity,
	} = ear.layer.makeTacosTortillasTransitivity(folded);

	expect(taco_taco.length).toMatchObject(196);
	expect(taco_tortilla.length).toMatchObject(1033);
	expect(tortilla_tortilla.length).toMatchObject(0);
	expect(transitivity.length).toMatchObject(5344);
});

test("tacosAndTortillas Kraft bird", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/kraft-bird-base.fold", "utf-8");
	const cp = JSON.parse(foldfile);
	const folded = {
		...cp,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
	};
	ear.graph.populate(folded);

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
