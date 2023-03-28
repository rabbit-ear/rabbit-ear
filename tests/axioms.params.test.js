const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("axiom params", () => {
	ear.axiom.axiom(1, [0.75, 0.75], [0.15, 0.85]);
	ear.axiom.axiom(2, [0.75, 0.75], [0.15, 0.85]);
	ear.axiom.axiom(
		3,
		{ vector: [0.0, -0.5], origin: [0.25, 0.75] },
		{ vector: [0.5, 0.0], origin: [0.5, 0.75] },
	);
	ear.axiom.axiom(
		4,
		{ vector: [-0.10, 0.11], origin: [0.62, 0.37] },
		[0.83, 0.51],
	);
	ear.axiom.axiom(
		5,
		{ vector: [-0.37, -0.13], origin: [0.49, 0.71] },
		[0.75, 0.75],
		[0.15, 0.85],
	);
	ear.axiom.axiom(
		6,
		{ vector: [0.04, -0.52], origin: [0.43, 0.81] },
		{ vector: [0.05, -0.28], origin: [0.10, 0.52] },
		[0.75, 0.75],
		[0.15, 0.85],
	);
	ear.axiom.axiom(
		7,
		{ vector: [-0.20, -0.25], origin: [0.62, 0.93] },
		{ vector: [-0.42, 0.61], origin: [0.52, 0.25] },
		[0.25, 0.85],
	);
});
