const ear = require("rabbit-ear");

test("assignments_to_faces_flip, empty", () => {
	const res1 = ear.math.equivalent(ear.vertex
		.assignments_to_faces_flip([]),
		[]);
	try {
		ear.vertex.assignments_to_faces_flip(undefined)
	} catch(error) {
		expect(error).not.toBe(undefined);
	}
	expect([res1].reduce((a, b) => a && b, true)).toBe(true);
});

test("assignments_to_faces_flip, mv only", () => {
	const res1 = ear.math.equivalent(ear.vertex
		.assignments_to_faces_flip(Array.from("mmmm")),
		[false, true, false, true]);
	const res2 = ear.math.equivalent(ear.vertex
		.assignments_to_faces_flip(Array.from("mVvM")),
		[false, true, false, true]);
	const res3 = ear.math.equivalent(ear.vertex
		.assignments_to_faces_flip(Array.from("m")),
		[false]);
	const res4 = ear.math.equivalent(ear.vertex
		.assignments_to_faces_flip(Array.from("V")),
		[false]);
	expect([res1, res2, res3, res4].reduce((a, b) => a && b, true))
		.toBe(true);
});

test("assignments_to_faces_flip, with flat folds", () => {
	const res1 = ear.math.equivalent(ear.vertex
		.assignments_to_faces_flip(Array.from("ffff")),
		[false, false, false, false]);
	const res2 = ear.math.equivalent(ear.vertex
		.assignments_to_faces_flip(Array.from("mfff")),
		[false, false, false, false]);
	const res3 = ear.math.equivalent(ear.vertex
		.assignments_to_faces_flip(Array.from("ffffm")),
		[false, false, false, false, true]);
	const res4 = ear.math.equivalent(ear.vertex
		.assignments_to_faces_flip(Array.from("vvffff")),
		[false, true, true, true, true, true]);
	expect([res1, res2, res3, res4].reduce((a, b) => a && b, true))
		.toBe(true);
});

test("assignments_to_faces_vertical, MV", () => {
	const res1 = ear.vertex.assignments_to_faces_vertical(Array.from("MMMM"));
	expect(JSON.stringify(res1)).toBe(JSON.stringify([-1,1,-1,1]));

	const res2 = ear.vertex.assignments_to_faces_vertical(Array.from("MMMV"));
	expect(JSON.stringify(res2)).toBe(JSON.stringify([-1,1,1,1]));

	const res3 = ear.vertex.assignments_to_faces_vertical(Array.from("MMVM"));
	expect(JSON.stringify(res3)).toBe(JSON.stringify([-1,-1,-1,1]));

	const res4 = ear.vertex.assignments_to_faces_vertical(Array.from("MVMM"));
	expect(JSON.stringify(res4)).toBe(JSON.stringify([1,1,-1,1]));

	const res5 = ear.vertex.assignments_to_faces_vertical(Array.from("VMMM"));
	expect(JSON.stringify(res5)).toBe(JSON.stringify([-1,1,-1,-1]));
});

test("assignments_to_faces_vertical, with flat", () => {
	const res1 = ear.vertex.assignments_to_faces_vertical(Array.from("ffff"));
	expect(JSON.stringify(res1)).toBe(JSON.stringify([0,0,0,0]));

	const res2 = ear.vertex.assignments_to_faces_vertical(Array.from("fffm"));
	expect(JSON.stringify(res2)).toBe(JSON.stringify([0,0,-1,-0]));

	const res3 = ear.vertex.assignments_to_faces_vertical(Array.from("ffmf"));
	expect(JSON.stringify(res3)).toBe(JSON.stringify([0,-1,-0,-0]));

	const res4 = ear.vertex.assignments_to_faces_vertical(Array.from("fmff"));
	expect(JSON.stringify(res4)).toBe(JSON.stringify([-1,-0,-0,-0]));

	const res5 = ear.vertex.assignments_to_faces_vertical(Array.from("mfff"));
	expect(JSON.stringify(res5)).toBe(JSON.stringify([0,0,0,-1]));

	const res6 = ear.vertex.assignments_to_faces_vertical(Array.from("ffvf"));
	expect(JSON.stringify(res6)).toBe(JSON.stringify([0,1,0,0]));

	const res7 = ear.vertex.assignments_to_faces_vertical(Array.from("fffv"));
	expect(JSON.stringify(res7)).toBe(JSON.stringify([0,0,1,0]));
});

test("assignments_to_faces_vertical, with boundary", () => {
	const res1 = ear.vertex.assignments_to_faces_vertical(Array.from("bbbb"));
	expect(JSON.stringify(res1)).toBe(JSON.stringify([0,0,0,0]));

	const res2 = ear.vertex.assignments_to_faces_vertical(Array.from("bbbm"));
	expect(JSON.stringify(res2)).toBe(JSON.stringify([0,0,-1,-0]));

	const res3 = ear.vertex.assignments_to_faces_vertical(Array.from("bbmb"));
	expect(JSON.stringify(res3)).toBe(JSON.stringify([0,-1,-0,-0]));

	const res4 = ear.vertex.assignments_to_faces_vertical(Array.from("bmbb"));
	expect(JSON.stringify(res4)).toBe(JSON.stringify([-1,-0,-0,-0]));

	const res5 = ear.vertex.assignments_to_faces_vertical(Array.from("mbbb"));
	expect(JSON.stringify(res5)).toBe(JSON.stringify([0,0,0,-1]));

	const res6 = ear.vertex.assignments_to_faces_vertical(Array.from("bbvb"));
	expect(JSON.stringify(res6)).toBe(JSON.stringify([0,1,0,0]));

	const res7 = ear.vertex.assignments_to_faces_vertical(Array.from("bbbv"));
	expect(JSON.stringify(res7)).toBe(JSON.stringify([0,0,1,0]));
});
