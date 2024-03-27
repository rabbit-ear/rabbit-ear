import { expect, test } from "vitest";
import fs from "fs";
import ear from "../rabbit-ear.js";

test("shh", () => {});

// test("write folded vertices", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/strip-weave.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	fs.writeFileSync(
// 		`./tests/tmp/folded-vertices.json`,
// 		JSON.stringify(ear.graph.makeVerticesCoordsFlatFolded(fold)
// 			.map(p => p.map(n => ear.general.cleanNumber(n, 12))), null, 2),
// 	);
// });

// test("tacosAndTortillas Kraft bird", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/kraft-bird-base.fold", "utf-8");
// 	const cp = JSON.parse(foldfile);
// 	const folded = {
// 		...cp,
// 		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
// 	};
// 	ear.graph.populate(folded);

// 	const resultFile = fs.readFileSync(
// 		"./tests/files/json/kraft-bird-tacos-tortillas.json",
// 		"utf-8",
// 	);
// 	const result = JSON.parse(resultFile);

// 	const {
// 		taco_taco,
// 		taco_tortilla,
// 		tortilla_tortilla,
// 	} = ear.layer.makeTacosAndTortillas(folded);

// 	expect(taco_taco).toMatchObject(result.taco_taco);
// 	expect(taco_tortilla).toMatchObject(result.taco_tortilla);
// 	expect(tortilla_tortilla).toMatchObject(result.tortilla_tortilla);
// });
