const ear = require("rabbit-ear");

test("layer solver, simple staircase", () => {
	const res = ear.vertex.layer_solver([3,2,3,2,3], Array.from("BVMVMB"));
	expect(res.length).toBe(1);
	expect(JSON.stringify(res)).toBe(JSON.stringify([[0,1,2,3,4]]));
});

test("layer solver, simple staircase, wraparound", () => {
	const res = ear.vertex.layer_solver([3,2,3,2,3,5], Array.from("VVMVMV"));
	expect(res.length).toBe(1);
	expect(JSON.stringify(res)).toBe(JSON.stringify([[0,1,2,3,4,5]]));
});

test("layer solver, simple staircase, wraparound, too short/long", () => {
	const tooShort = ear.vertex.layer_solver([3,2,3,2,3,4], Array.from("VVMVMV"));
	expect(tooShort.length).toBe(0);
	expect(JSON.stringify(tooShort)).toBe(JSON.stringify([]));

	const tooLong = ear.vertex.layer_solver([3,2,3,2,3,6], Array.from("VVMVMV"));
	expect(tooLong.length).toBe(0);
	expect(JSON.stringify(tooLong)).toBe(JSON.stringify([]));
});

test("layer solver, pleat, wraparound", () => {
	const res = ear.vertex.layer_solver([4,1,1,3,3,4], Array.from("MVMVMM"));
	expect(res.length).toBe(1);
	expect(JSON.stringify(res)).toBe(JSON.stringify([[1,2,3,4,5,0]]));
});

test("layer solver, pleat, wraparound 4-vertex", () => {
	const res1 = ear.vertex.layer_solver([2,2,2,2], Array.from("VMMV"));
	expect(res1.length).toBe(0);
	expect(JSON.stringify(res1)).toBe(JSON.stringify([]));
	const res2 = ear.vertex.layer_solver([2,2,2,2], Array.from("MVVM"));
	expect(res2.length).toBe(0);
	expect(JSON.stringify(res2)).toBe(JSON.stringify([]));
	const res3 = ear.vertex.layer_solver([2,2,2,2], Array.from("MMVV"));
	expect(res3.length).toBe(0);
	expect(JSON.stringify(res3)).toBe(JSON.stringify([]));
	const res4 = ear.vertex.layer_solver([2,2,2,2], Array.from("VVMM"));
	expect(res4.length).toBe(0);
	expect(JSON.stringify(res4)).toBe(JSON.stringify([]));
});

test("layer solver, flat", () => {
	const res = ear.vertex.layer_solver([2,2,2,2], Array.from("VFVF"));
	expect(res.length).toBe(1);
	expect(JSON.stringify(res)).toBe(JSON.stringify([[0,0,1,1]]));
});

test("layer solver, pleat, flat", () => {
	const res = ear.vertex.layer_solver([3,3,5,2,3], Array.from("MVMMF"));
	expect(res.length).toBe(1);
	expect(JSON.stringify(res)).toBe(JSON.stringify([[1,2,3,0,0]]));
});

test("layer solver, 2-fold simple", () => {
	const res1 = ear.vertex.layer_solver([4, 4], Array.from("MM"));
	expect(res1.length).toBe(1);
	expect(JSON.stringify(res1)).toBe(JSON.stringify([[1,0]]));

	const res2 = ear.vertex.layer_solver([4, 4], Array.from("VV"));
	expect(res2.length).toBe(1);
	expect(JSON.stringify(res2)).toBe(JSON.stringify([[0,1]]));
});

test("layer solver, wrong final crease direction 1", () => {
	const res = ear.vertex.layer_solver([4, 4], Array.from("MV"));
	expect(res.length).toBe(0);
	expect(JSON.stringify(res)).toBe(JSON.stringify([]));
});

test("layer solver, wrong final crease direction 2", () => {
	const success = ear.vertex.layer_solver([4, 2, 2, 4], Array.from("VMVV"));
	expect(success.length).toBe(1);
	expect(JSON.stringify(success)).toBe(JSON.stringify([[2, 1, 0, 3]]));

	const invalid = ear.vertex.layer_solver([4, 2, 3, 5], Array.from("MMVV"));
	expect(invalid.length).toBe(0);
	expect(JSON.stringify(invalid)).toBe(JSON.stringify([]));
});

test("layer solver, wrong final crease direction3, invalid edge-crossing", () => {
	// taco taco problem:
	//
	//  [f0:l3, f1:l1, f2:l0, f3:l2]
	//  f3-f0:M f0-f1:M f1-f2:V f2-f3:V
	//
	//                   v--- these creases are at the same place
	//
	//    (------0------)
	//    (             )       l3: f0: 4  -\___ intersection
	//    (------3------)-)     l2: f3: 4  -/
	//                  ) )     l1: f1: 2
	//           (---1--) )     l0: f2: 2
	//           (        )
	//           (----2---)
	//	
	const invalid = ear.vertex.layer_solver([4, 2, 2, 4], Array.from("MMVV"));
	expect(invalid.length).toBe(0);
	expect(JSON.stringify(invalid)).toBe(JSON.stringify([]));
});


test("layer solver, simple staircase, wraparound, final crease wrong direction 2", () => {
	const res = ear.vertex.layer_solver([3,2,3,2,3,5], Array.from("MVMVMV"));
	expect(res.length).toBe(0);
	expect(JSON.stringify(res)).toBe(JSON.stringify([]));
});

// test("layer solver, incident touching, valid", () => {
// 	const res = ear.vertex.layer_solver([6,3,3,6,3,3], Array.from("VVMVVM"));
// 	expect(res.length).toBe(6);
// 	expect(JSON.stringify(res)).toBe(JSON.stringify([
// 		[ 0, 3, 4, 5, 2, 1 ],
// 		[ 0, 2, 4, 5, 3, 1 ],
// 		[ 0, 1, 4, 5, 3, 2 ],
// 		[ 0, 2, 3, 5, 4, 1 ],
// 		[ 0, 1, 3, 5, 4, 2 ],
// 		[ 0, 1, 2, 5, 4, 3 ]
// 	]));
// });

test("layer solver, simple fold", () => {
	const res1 = ear.vertex.layer_solver([2,2,2,2], Array.from("VVVM"));
	const res2 = ear.vertex.layer_solver([2,2,2,2], Array.from("VVMV"));
	const res3 = ear.vertex.layer_solver([2,2,2,2], Array.from("VMVV"));
	const res4 = ear.vertex.layer_solver([2,2,2,2], Array.from("MVVV"));

	expect(JSON.stringify(res1)).toBe(JSON.stringify([[0,3,2,1]]));
	expect(JSON.stringify(res2)).toBe(JSON.stringify([[0,1,2,3]]));
	expect(JSON.stringify(res3)).toBe(JSON.stringify([[2,1,0,3]]));
	expect(JSON.stringify(res4)).toBe(JSON.stringify([[2,3,0,1]]));
});


test("layer_solver, loop around", () => {
	const faces = [2, 2, 4, 4];
	const assignments = ["M","V","V","V"];
	const res = ear.vertex.layer_solver(faces, assignments);
	expect(res.length).toBe(1);

	expect(ear.vertex.layer_solver([2, 4, 4, 2], ["V","M","V","V"]).length)
		.toBe(1);

	expect(ear.vertex.layer_solver([4, 4, 2, 2], ["V","V","M","V"]).length)
		.toBe(1);

	expect(ear.vertex.layer_solver([4, 2, 2, 4], ["V","V","V","M"]).length)
		.toBe(1);
});


test("layer_solver. from crane", () => {
	const faces = [
		1.3744384258850593,
		1.3744555531232394,
		1.7671436689993407,
		1.7671476591719468
	];
	const assignments = ["M","V","V","V"];
	const res = ear.vertex.layer_solver(faces, assignments, 0.001);
	expect(JSON.stringify(res)).toBe(JSON.stringify([[2,3,0,1]]));
});



