
/**
 * origami math
 */

// all entries should equal two pi
RabbitEar.core.make_vertices_sectorAngles(origami)
  .map(angles => angles.reduce((a, b) => a + b, 0));



testName("kawasaki's theorem math");
testEqual([16, 20], math.core.alternating_sum(1, 2, 3, 4, 5, 6, 7, 8));
testEqual([0, 0], math.core.kawasaki_sector_score(Math.PI, Math.PI));
testEqual([0, 0], math.core.kawasaki_sector_score(
  Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2
));
testEqual([1, -1],
  math.core.kawasaki_sector_score(Math.PI - 1, Math.PI + 1));
testEqual([1, -1],
  math.core.kawasaki_sector_score(
    Math.PI / 2 - 0.5,
    Math.PI / 2 + 0.5,
    Math.PI / 2 - 0.5,
    Math.PI / 2 + 0.5
  ));
testEqual([0, 0],
  math.core.kawasaki_sector_score(...math.core.interior_angles([1, 0], [0, 1], [-1, 0], [0, -1])));
testEqual(
  [undefined, undefined, 1.25 * Math.PI],
  math.core.kawasaki_solutions_radians(
    0, Math.PI / 2, Math.PI / 4 * 3
  )
);
testEqual(
  [[Math.cos(Math.PI * 1 / 3), Math.sin(Math.PI * 1 / 3)],
    [Math.cos(Math.PI * 3 / 3), Math.sin(Math.PI * 3 / 3)],
    [Math.cos(Math.PI * 5 / 3), Math.sin(Math.PI * 5 / 3)]],
  math.core.kawasaki_solutions(
    [Math.cos(0), Math.sin(0)],
    [Math.cos(Math.PI * 2 / 3), Math.sin(Math.PI * 2 / 3)],
    [Math.cos(Math.PI * 4 / 3), Math.sin(Math.PI * 4 / 3)]
  )
);
testEqual([undefined, undefined, [-sqrt05, -sqrt05]],
  math.core.kawasaki_solutions(
    [Math.cos(0), Math.sin(0)],
    [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)],
    [Math.cos(Math.PI / 2), Math.sin(Math.PI / 2)]
  ));
