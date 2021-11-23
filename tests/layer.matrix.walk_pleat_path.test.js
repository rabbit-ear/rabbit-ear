const ear = require("rabbit-ear");

test("walk_pleat_path", () => {
	const matrix = [
		[1, undefined, 1],
		[undefined, undefined, -1],
		[-1, undefined, undefined],
	];
	ear.layer.walk_pleat_path(matrix, 0, 2, 1);
});
