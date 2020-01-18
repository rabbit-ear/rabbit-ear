const RabbitEar = require("../rabbit-ear");

test("FOLD object type detection", () => {
  const object1 = {
    vertices_coords: [],
    edges_vertices: [],
  };
  const object2 = {
    verticesCoords: [],
    edgesVertices: [],
  };
  const object3 = {
    verticesCoords: [],
    edges_vertices: [],
  };
  const rating1 = RabbitEar.core.possibleFoldObject(object1);
  const rating2 = RabbitEar.core.possibleFoldObject(object2);
  const rating3 = RabbitEar.core.possibleFoldObject(object3);
  expect(rating1).toBe(1);
  expect(rating2).toBe(0);
  expect(rating3).toBe(0.5);
  // potential for improving this method is to look inside of each key,
  // validate the contents, like if vertices_coords has a string instead of
  // an array of array of numbers...
});
