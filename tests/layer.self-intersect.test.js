const ear = require("rabbit-ear");

const inc = (arr, i, modlen) => arr[i] = (arr[i] + 1) % modlen;

const inc_layers = (layers_face, modlen) => {
	layers_face.forEach((el, i) => typeof el === "number"
		? inc(layers_face, i, modlen)
		: el.forEach((_, j) => inc(el, j, modlen)));
}

test("self_intersect", () => {
	const folded_faces = [[0,2],[2,0],[0,2],[2,0]];
	const layers_face = [0,1,2,3];
	const res1 = ear.layer.self_intersect(folded_faces, layers_face, false, 0.001);
	expect(res1).toBe(false);
	const res2 = ear.layer.self_intersect(folded_faces, layers_face, true, 0.001);
	expect(res2).toBe(false);
	// rotate the results, expecting the same result
	for (let i = 0; i < folded_faces.length; i++) {
		folded_faces.unshift(folded_faces.pop());
		inc_layers(layers_face, folded_faces.length);
		expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
			.toBe(false);
	}
});

test("self-intersect, with flat, no folds touching", () => {
	const folded_faces = [[0,2],[2,1],[1,3],[3,4],[4,0]];
	const layers_face = [4,0,1,[2,3]];
	expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
		.toBe(false);
	// rotate the results, expecting the same result
	for (let i = 0; i < folded_faces.length; i++) {
		folded_faces.unshift(folded_faces.pop());
		inc_layers(layers_face, folded_faces.length);
		// console.log("TESTING", i, folded_faces, layers_face);
		expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
			.toBe(false);
	}
});

test("self-intersect, with flat, folds touching", () => {
	const folded_faces = [[0,3],[3,4],[4,1],[1,2],[2,4],[4,0]];
	const layers_face = [5,[0,1],2,[3,4]];
	expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
		.toBe(false);
	// rotate the results, expecting the same result
	for (let i = 0; i < folded_faces.length; i++) {
		folded_faces.unshift(folded_faces.pop());
		inc_layers(layers_face, folded_faces.length);
		expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
			.toBe(false);
	}
});

test("self-intersect, taco taco intersecting odd one out", () => {
	const folded_faces = [[0,2],[2,0],[0,2],[2,0]];
	const layers_face = [0,3,1,2];
	expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
		.toBe(true);
	// rotate the results, expecting the same result
	for (let i = 0; i < folded_faces.length; i++) {
		folded_faces.unshift(folded_faces.pop());
		inc_layers(layers_face, folded_faces.length);
		expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
			.toBe(true);
	}
});

test("self-intersect, taco taco valid", () => {
	const folded_faces = [[0,2],[2,0],[0,2],[2,0]];
	const layers_face = [0,3,2,1];
	expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
		.toBe(false);
	// rotate the results, expecting the same result
	for (let i = 0; i < folded_faces.length; i++) {
		folded_faces.unshift(folded_faces.pop());
		inc_layers(layers_face, folded_faces.length);
		expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
			.toBe(false);
	}
});

test("self-intersect, taco tortilla intersecting, with common point", () => {
	const folded_faces = [[0,1],[1,0],[0,1],[1,2],[2,0]];
	const layers_face = [1,3,2,2,0];
	expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
		.toBe(true);
	// rotate the results, expecting the same result
	for (let i = 0; i < folded_faces.length; i++) {
		folded_faces.unshift(folded_faces.pop());
		inc_layers(layers_face, folded_faces.length);
		expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
			.toBe(true);
	}
});

test("self-intersect, taco tortilla intersecting, without common point", () => {
	const folded_faces = [[0,1],[1,0],[0,2],[2,0]];
	const layers_face = [1,3,2,0];
	expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
		.toBe(true);
	// rotate the results, expecting the same result
	for (let i = 0; i < folded_faces.length; i++) {
		folded_faces.unshift(folded_faces.pop());
		inc_layers(layers_face, folded_faces.length);
		expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
			.toBe(true);
	}
});

test("self-intersect, taco tortilla, valid (not loop)", () => {
	const folded_faces = [[0,1],[1,0],[0,1]];
	const layers_face = [0,2,1];
	const res = ear.layer.self_intersect(folded_faces, layers_face, false, 0.001);
	expect(res).toBe(false);
});

test("self_intersect boundary intersect", () => {
	const folded_faces = [[0,2],[2,-0.1],[-0.1,2],[2,0]];
	const layers_face = [0,1,2,3];
	const res1 = ear.layer.self_intersect(folded_faces, layers_face, false, 0.001);
	expect(res1).toBe(false);
	const res2 = ear.layer.self_intersect(folded_faces, layers_face, true, 0.001);
	expect(res2).toBe(true);

	// rotate the results, expecting the same result
	for (let i = 0; i < folded_faces.length; i++) {
		folded_faces.unshift(folded_faces.pop());
		inc_layers(layers_face, folded_faces.length);
		expect(ear.layer.self_intersect(folded_faces, layers_face, true, 0.001))
			.toBe(true);
	}
});
