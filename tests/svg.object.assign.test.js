import { expect, test } from "vitest";

const test1 = {
	a: {
		one: {
			what: true,
		},
		two: {
			whatagain: true,
		},
	},
	b: {
		a: {
			what: true,
		},
	},
};

const test2 = {
	a: {
		three: {
			hi: true,
		},
		four: {
			whatagain: true,
		},
	},
	b: {
		b: {
			okay: true,
		},
	},
};

test("object assign", () => {
	Object.assign(test1, test2);

	expect(test1.a.one == null).toBe(true);
	expect(test1.a.two == null).toBe(true);
	expect(test1.a.three != null).toBe(true);
	expect(test1.a.four != null).toBe(true);
	expect(test1.b.a == null).toBe(true);
	expect(test1.b.b != null).toBe(true);
});
