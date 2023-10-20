import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("maekawaSolver, no U", () => {
	const result = ear.singleVertex.maekawaSolver(Array.from("MMVM"));
	expect(result.length).toBe(1);
	expect(result[0].join("")).toBe("MMVM");
});

test("maekawaSolver one solution", () => {
	const result = ear.singleVertex.maekawaSolver(Array.from("MMVMUVMV"));
	expect(result.length).toBe(1);
	expect(result[0].join("")).toBe("MMVMMVMV");
});

test("maekawaSolver two solutions", () => {
	const result = ear.singleVertex.maekawaSolver(Array.from("MMVUUVMV"));
	expect(result.length).toBe(2);
	expect(result[0].join("")).toBe("MMVVVVMV");
	expect(result[1].join("")).toBe("MMVMMVMV");
});

test("maekawaSolver with boundary", () => {
	const result = ear.singleVertex.maekawaSolver(Array.from("UUBV"));
	expect(result.length).toBe(4);
	expect(result[0].join("")).toBe("VVBV");
	expect(result[3].join("")).toBe("MMBV");
});

test("maekawaSolver with cut", () => {
	const result = ear.singleVertex.maekawaSolver(Array.from("UUCV"));
	expect(result.length).toBe(4);
	expect(result[0].join("")).toBe("VVCV");
	expect(result[3].join("")).toBe("MMCV");
});

test("maekawaSolver various", () => {
	// if the set contains a boundary ("B" or "C"), then it returns all possible
	// permutations, including just the one. if it doesn't incude a boundary it
	// runs maekawa and if M-V=+/-2 is not satisfied it returns an empty array.
	expect(ear.singleVertex.maekawaSolver(Array.from("BBBB"))[0].join("")).toBe("BBBB");
	expect(ear.singleVertex.maekawaSolver(Array.from("CCCC"))[0].join("")).toBe("CCCC");
	expect(ear.singleVertex.maekawaSolver(Array.from("JJJJ")).length).toBe(0);
	expect(ear.singleVertex.maekawaSolver(Array.from("FFFF")).length).toBe(0);
	expect(ear.singleVertex.maekawaSolver(Array.from("BCJF"))[0].join("")).toBe("BCJF");
});
