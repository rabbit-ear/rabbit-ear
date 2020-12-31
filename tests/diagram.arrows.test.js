const ear = require("../rabbit-ear");

test("make arrow coords", () => {
	const line = { vector: [0.4, 0.8], origin: [0.5, 0.5] }
	ear.diagram.one_crease_arrow(ear.graph.square(), line);

});

test("axiom 1 arrow coords", () => {
	ear.diagram.axiom_arrows[1](
		{points: [[0, 0], [1, 1]]},
		{vector:[1,1], origin:[0.5, 0.5]},
		{vertices_coords: [[0,0], [0,1], [1,0], [1,1]]}
	);
});
