const RabbitEar = require("../rabbit-ear");

test("similar vertices", () => {
  const test1 = RabbitEar.core.similar_vertices_coords(
    RabbitEar.bases.kite,
    RabbitEar.bases.bird
  );
  const test2 = RabbitEar.core.similar_vertices_coords(
    RabbitEar.bases.bird,
    RabbitEar.bases.kite
  );

  expect(test1[0]).toBe(0);
  expect(test1[1]).toBe(2);
  expect(test1[2]).toBe(4);
  expect(test1[3]).toBe(5);
  expect(test1[4]).toBe(undefined);

  expect(test2[0]).toBe(0);
  expect(test2[1]).toBe(undefined);
  expect(test2[2]).toBe(1);
  expect(test2[3]).toBe(undefined);
  expect(test2[4]).toBe(2);
  expect(test2[5]).toBe(3);
});
