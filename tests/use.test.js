const ear = require("../rabbit-ear.js");
const svg = require("../../SVG/svg.js");

test("use", () => {
  ear.use(svg);
  expect(true).toBe(true);
});

test("use, invalid", () => {
  ear.use({});
  ear.use(() => {});
  expect(true).toBe(true);
});