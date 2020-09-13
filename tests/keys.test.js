const ear = require("../rabbit-ear.js");
const fs = require("fs");

test("keys", () => {
  expect(ear.core.file_spec).toBe(1.1)
  expect(ear.core.keys.length).toBe(30);
  expect(ear.core.file_creator).toBe("Rabbit Ear");
});

test("edge_assignment_to_foldAngle", () => {
  expect(ear.core.edge_assignment_to_foldAngle("")).toBe(0);
  // every letter besides "m", "v"
  "abcdefghijklnopqrstuwxyzABCDEFGHIJKLNOPQRSTUWXYZ.!@#$%^&*(){}[]-=_+"
    .split("")
    .forEach(ch => expect(ear.core.edge_assignment_to_foldAngle(ch))
      .toBe(0));
  expect(ear.core.edge_assignment_to_foldAngle("v")).toBe(180);
  expect(ear.core.edge_assignment_to_foldAngle("V")).toBe(180);
  expect(ear.core.edge_assignment_to_foldAngle("m")).toBe(-180);
  expect(ear.core.edge_assignment_to_foldAngle("M")).toBe(-180);
});

const key_test = {
  test: 0,
  testtest: 0,
  test_: 0,
  _test: 0,
  aaatestaaa: 0,
  aaatest: 0,
  testaaa: 0,
  test_test_test: 0,
  test_aaa: 0,
  aaa_test: 0,
  _test_test_test_: 0,
};

test("filter_keys_with_suffix", () => {
  const result = ear.core.filter_keys_with_suffix(key_test, "test")
  expect(result.length).toBe(6);
});

test("filter_keys_with_prefix", () => {
  const result = ear.core.filter_keys_with_prefix(key_test, "test")
  expect(result.length).toBe(6);
});

test("get_graph_keys_with_prefix", () => {
  const result = ear.core.get_graph_keys_with_prefix(key_test, "test")
  expect(result.length).toBe(3);
});

test("get_graph_keys_with_suffix", () => {
  const result = ear.core.get_graph_keys_with_suffix(key_test, "test")
  expect(result.length).toBe(3);
});

test("transpose_graph_arrays", () => {
  const craneString = fs.readFileSync("./tests/files/crane.fold", "utf-8");
  const crane = JSON.parse(craneString);
  const result = ear.core.transpose_graph_arrays(crane, "edges");
  expect(result.length).toBe(crane.edges_vertices.length);
  expect(result[0].edges_vertices.length).toBe(2);
  expect(result[0].edges_assignment.length).toBe(1); // string, "M" or "V" or something
  // no key
  expect(ear.core.transpose_graph_arrays(crane, "nokey").length)
    .toBe(0);
});

test("transpose_graph_array_at_index", () => {
  const craneString = fs.readFileSync("./tests/files/crane.fold", "utf-8");
  const crane = JSON.parse(craneString);
  const result = ear.core.transpose_graph_array_at_index(crane, "edges", 10);
  expect(result.edges_vertices.length).toBe(2);
  expect(result.edges_assignment.length).toBe(1); // string, "M" or "V" or something
  // no key
  expect(ear.core.transpose_graph_array_at_index(crane, "nokey", 0))
    .toBe(undefined);
});
