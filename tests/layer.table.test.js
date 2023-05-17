const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("layer table structure", () => {
	const keys = ["taco_taco", "taco_tortilla", "tortilla_tortilla", "transitivity"];
	Object.keys(ear.layer.table)
		.forEach((key, i) => expect(key).toBe(keys[i]));
	keys.forEach(key => expect(typeof ear.layer.table[key]).toBe("object"));
	const keysLength = [729, 27, 9, 27];
	keys.forEach((key, i) => expect(Object.keys(ear.layer.table[key]).length).toBe(keysLength[i]));
});

test("layer table elements", () => {
	expect(ear.layer.table.taco_taco["000000"]).toBe(true);
	expect(ear.layer.table.taco_taco["000122"]).toBe(false);
	expect(JSON.stringify(ear.layer.table.taco_taco["000011"]))
		.toBe(JSON.stringify([2, 2]));

	expect(ear.layer.table.taco_tortilla["000"]).toBe(true);
	expect(ear.layer.table.taco_tortilla["011"]).toBe(false);
	expect(JSON.stringify(ear.layer.table.taco_tortilla["110"]))
		.toBe(JSON.stringify([2, 2]));

	expect(ear.layer.table.tortilla_tortilla["00"]).toBe(true);
	expect(ear.layer.table.tortilla_tortilla["12"]).toBe(false);
	expect(JSON.stringify(ear.layer.table.tortilla_tortilla["10"]))
		.toBe(JSON.stringify([1, 1]));

	expect(ear.layer.table.transitivity["000"]).toBe(true);
	expect(ear.layer.table.transitivity["111"]).toBe(false);
	expect(JSON.stringify(ear.layer.table.transitivity["110"]))
		.toBe(JSON.stringify([2, 2]));
});
