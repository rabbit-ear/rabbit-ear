import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

// this is currently deprecated. maybe will be reintroduced
// in a future update.
test("empty", () => expect(true).toBe(true));

// test("make arrow coords", () => {
// 	const line = { vector: [0.4, 0.8], origin: [0.5, 0.5] }
// 	// ear.diagram.one_crease_arrow(ear.graph.square(), line);
// 	expect(true).toBe(true);

// });

// test("axiom 1 arrow coords", () => {
// 	// ear.diagram.axiom_arrows[1](
// 	ear.diagram.axiom_arrows(1,
// 		{points: [[0, 0], [1, 1]]},
// 		{vertices_coords: [[0,0], [0,1], [1,0], [1,1]]}
// 	);
// });
