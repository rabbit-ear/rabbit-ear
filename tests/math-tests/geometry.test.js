const ear = require("../../rabbit-ear");

const testEqualVectors = function (...args) {
  expect(ear.math.equivalent_vectors(...args)).toBe(true);
};

test("nearest point", () => {
  testEqualVectors([5, 5], ear.math.nearest_point2([10, 0],
    [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9]]));
  testEqualVectors([6, 6, 0], ear.math.nearest_point([10, 0, 0],
    [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [4, 4, 1],
      [5, 5, 10], [6, 6, 0], [7, 7, 0], [8, 8, 0], [9, 9, 0]]));
});

test("interior angles", () => {
  testEqualVectors(
    [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
    [[1, 0], [0, 1], [-1, 0], [0, -1]].map((v, i, ar) => ear.math
      .counter_clockwise_angle2(v, ar[(i + 1) % ar.length]))
  );
  testEqualVectors(
    [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
    [[1, 1], [-1, 1], [-1, -1], [1, -1]].map((v, i, ar) => ear.math
      .counter_clockwise_angle2(v, ar[(i + 1) % ar.length]))
  );
});

test("counter-clockwise vector sorting", () => {
  testEqualVectors(
    [0, 1, 2, 3],
    ear.math.counter_clockwise_vector_order([1, 1], [-1, 1], [-1, -1], [1, -1])
  );
  testEqualVectors(
    [0, 3, 2, 1],
    ear.math.counter_clockwise_vector_order([1, -1], [-1, -1], [-1, 1], [1, 1])
  );
});

// test("sectors", () => {
//   testEqual(Math.PI / 2, ear.sector.fromVectors([1, 0], [0, 1]).angle);
//   testEqual(true, ear.sector.fromVectors([1, 0], [0, 1]).contains([1, 1]));
//   testEqual(false, ear.sector.fromVectors([1, 0], [0, 1]).contains([-1, 1]));
//   testEqual(false, ear.sector.fromVectors([1, 0], [0, 1]).contains([-1, -1]));
//   testEqual(false, ear.sector.fromVectors([1, 0], [0, 1]).contains([1, -1]));
// });

// test("junctions", () => {
//   testEqual([[1, 1], [1, -1], [-1, 1], [-1, -1]],
//     ear.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectors);
//   testEqual([0, 2, 3, 1],
//     ear.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectorOrder);
//   testEqual([Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
//     ear.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).angles());
// });

test("clockwise_angle_radians", () => {
  expect(ear.math.clockwise_angle_radians(Math.PI, Math.PI/2))
    .toBeCloseTo(Math.PI*1/2);
  expect(ear.math.clockwise_angle_radians(Math.PI/2, Math.PI))
    .toBeCloseTo(Math.PI*3/2);
  // same as above with negative numbers
  expect(ear.math.clockwise_angle_radians(Math.PI + Math.PI*2*4, Math.PI/2 - Math.PI*2*8))
    .toBeCloseTo(Math.PI*1/2);
  expect(ear.math.clockwise_angle_radians(Math.PI/2 - Math.PI*2*3, Math.PI + Math.PI*2*4))
    .toBeCloseTo(Math.PI*3/2);
  expect(ear.math.clockwise_angle_radians(Math.PI - Math.PI*2*4, Math.PI/2 - Math.PI*2*8))
    .toBeCloseTo(Math.PI*1/2);
  expect(ear.math.clockwise_angle_radians(Math.PI/2 - Math.PI*2*3, Math.PI - Math.PI*2*4))
    .toBeCloseTo(Math.PI*3/2);
});

test("counter_clockwise_angle_radians", () => {
  expect(ear.math.counter_clockwise_angle_radians(Math.PI, Math.PI/2))
    .toBeCloseTo(Math.PI*3/2);
  expect(ear.math.counter_clockwise_angle_radians(Math.PI/2, Math.PI))
    .toBeCloseTo(Math.PI*1/2);
  // same as above with negative numbers
  expect(ear.math.counter_clockwise_angle_radians(Math.PI - Math.PI*2*4, Math.PI/2 - Math.PI*2*5))
    .toBeCloseTo(Math.PI*3/2);
  expect(ear.math.counter_clockwise_angle_radians(Math.PI + Math.PI*2*4, Math.PI/2 + Math.PI*2*5))
    .toBeCloseTo(Math.PI*3/2);
  expect(ear.math.counter_clockwise_angle_radians(Math.PI/2 - Math.PI*2*7, Math.PI - Math.PI*2*3))
    .toBeCloseTo(Math.PI*1/2);
});

test("clockwise_angle2", () => {
  expect(ear.math.clockwise_angle2([1,0], [0,1])).toBeCloseTo(Math.PI*3/2);
  expect(ear.math.clockwise_angle2([0,1], [1,0])).toBeCloseTo(Math.PI*1/2);
});

test("counter_clockwise_angle2", () => {
  expect(ear.math.counter_clockwise_angle2([1,0], [0,1]))
    .toBeCloseTo(Math.PI*1/2);
  expect(ear.math.counter_clockwise_angle2([0,1], [1,0]))
    .toBeCloseTo(Math.PI*3/2);
});

// test("counter_clockwise_vector_order", () => {
//   ear.math.counter_clockwise_vector_order(...vectors)
// });

test("interior_angles", () => {
  expect(ear.math.interior_angles([1,0], [0,1], [-1,0])[0]).toBeCloseTo(Math.PI/2);
  expect(ear.math.interior_angles([1,0], [0,1], [-1,0])[1]).toBeCloseTo(Math.PI/2);
  expect(ear.math.interior_angles([1,0], [0,1], [-1,0])[2]).toBeCloseTo(Math.PI);

  expect(ear.math.interior_angles([1,0], [-1,0], [0,-1])[0]).toBeCloseTo(Math.PI);
  expect(ear.math.interior_angles([1,0], [-1,0], [0,-1])[1]).toBeCloseTo(Math.PI/2);
  expect(ear.math.interior_angles([1,0], [-1,0], [0,-1])[2]).toBeCloseTo(Math.PI/2);
});

test("clockwise bisect", () => {
  expect(ear.math.clockwise_bisect2([1,0], [0,-1])[0]).toBeCloseTo(Math.sqrt(2)/2);
  expect(ear.math.clockwise_bisect2([1,0], [0,-1])[1]).toBeCloseTo(-Math.sqrt(2)/2);
  expect(ear.math.clockwise_bisect2([1,0], [-1,0])[0]).toBeCloseTo(0);
  expect(ear.math.clockwise_bisect2([1,0], [-1,0])[1]).toBeCloseTo(-1);
  expect(ear.math.clockwise_bisect2([1,0], [0,1])[0]).toBeCloseTo(-Math.sqrt(2)/2);
  expect(ear.math.clockwise_bisect2([1,0], [0,1])[1]).toBeCloseTo(-Math.sqrt(2)/2);
  expect(ear.math.clockwise_bisect2([1,0], [1,0])[0]).toBeCloseTo(1);
  expect(ear.math.clockwise_bisect2([1,0], [1,0])[1]).toBeCloseTo(0);
});

test("counter-clockwise bisect", () => {
  expect(ear.math.counter_clockwise_bisect2([1,0], [0,1])[0]).toBeCloseTo(Math.sqrt(2)/2);
  expect(ear.math.counter_clockwise_bisect2([1,0], [0,1])[1]).toBeCloseTo(Math.sqrt(2)/2);
  expect(ear.math.counter_clockwise_bisect2([1,0], [-1,0])[0]).toBeCloseTo(0);
  expect(ear.math.counter_clockwise_bisect2([1,0], [-1,0])[1]).toBeCloseTo(1);
  expect(ear.math.counter_clockwise_bisect2([1,0], [0,-1])[0]).toBeCloseTo(-Math.sqrt(2)/2);
  expect(ear.math.counter_clockwise_bisect2([1,0], [0,-1])[1]).toBeCloseTo(Math.sqrt(2)/2);
  expect(ear.math.counter_clockwise_bisect2([1,0], [1,0])[0]).toBeCloseTo(1);
  expect(ear.math.counter_clockwise_bisect2([1,0], [1,0])[1]).toBeCloseTo(0);
});

test("bisect_vectors", () => {
  expect(ear.math.bisect_vectors([1,0], [0,1])[0])
    .toBeCloseTo(Math.sqrt(2)/2);
  expect(ear.math.bisect_vectors([1,0], [0,1])[1])
    .toBeCloseTo(Math.sqrt(2)/2);
  expect(ear.math.bisect_vectors([0,1], [-1,0])[0])
    .toBeCloseTo(-Math.sqrt(2)/2);
  expect(ear.math.bisect_vectors([0,1], [-1,0])[1])
    .toBeCloseTo(Math.sqrt(2)/2);
  // flipped vectors
  expect(ear.math.bisect_vectors([1,0], [-1,0])[0]).toBeCloseTo(0);
  expect(ear.math.bisect_vectors([1,0], [-1,0])[1]).toBeCloseTo(1);
});

test("bisect_lines2", () => {
  expect(ear.math.bisect_lines2([0,1], [0,0], [0,1], [1,0])[1])
    .toBe(undefined);
  expect(ear.math.bisect_lines2([0,1], [0,0], [0,1], [1,0])[0][0][0])
    .toBeCloseTo(0);
  expect(ear.math.bisect_lines2([0,1], [0,0], [0,1], [1,0])[0][0][1])
    .toBeCloseTo(1);
  expect(ear.math.bisect_lines2([0,1], [0,0], [0,1], [1,0])[0][1][0])
    .toBeCloseTo(0.5);
  expect(ear.math.bisect_lines2([0,1], [0,0], [0,1], [1,0])[0][1][1])
    .toBeCloseTo(0);
  
  expect(ear.math.bisect_lines2([0,1], [0,0], [1,1], [1,0])[0].vector[0])
    .toBeCloseTo(0.3826834323650897);
  expect(ear.math.bisect_lines2([0,1], [0,0], [1,1], [1,0])[0].vector[1])
    .toBeCloseTo(0.9238795325112867);
  expect(ear.math.bisect_lines2([0,1], [0,0], [1,1], [1,0])[0].origin[0])
    .toBeCloseTo(0);
  expect(ear.math.bisect_lines2([0,1], [0,0], [1,1], [1,0])[0].origin[1])
    .toBeCloseTo(-1);

});

test("subsect_radians", () => {
  ear.math.subsect_radians(2, 0, Math.PI/2)
});

test("subsect", () => {
  ear.math.subsect(2, [1,0], [0,1]);
});

test("circumcircle", () => {
  const circle = ear.math.circumcircle([1,0], [0,1], [-1,0]);
  expect(circle.origin[0]).toBeCloseTo(0);
  expect(circle.origin[1]).toBeCloseTo(0);
  expect(circle.radius).toBeCloseTo(1);
  // todo, this is the degenerate case. not sure why the result is such
  const circle2 = ear.math.circumcircle([1,0], [0,0], [-1,0]);
  expect(circle2.origin[0]).toBeCloseTo(0);
  expect(circle2.origin[1]).toBeCloseTo(0);
  expect(circle2.radius).toBeCloseTo(1);
});

test("signed_area", () => {
  expect(ear.math.signed_area([[1,0], [0,1], [-1,0], [0,-1]])).toBeCloseTo(2);
  expect(ear.math.signed_area([[1,0], [0,1], [-1,0]])).toBeCloseTo(1);
});

test("centroid", () => {
  expect(ear.math.centroid([[1,0], [0,1], [-1,0], [0,-1]])[0]).toBeCloseTo(0);
  expect(ear.math.centroid([[1,0], [0,1], [-1,0], [0,-1]])[1]).toBeCloseTo(0);
  expect(ear.math.centroid([[1,0], [0,1], [-1,0]])[0]).toBeCloseTo(0);
  expect(ear.math.centroid([[1,0], [0,1], [-1,0]])[1]).toBeCloseTo(1/3);

});

test("enclosing_rectangle", () => {
  const rect = ear.math.enclosing_rectangle([[1,0], [0,1], [-1,0], [0,-1]]);
  expect(rect.x).toBe(-1);
  expect(rect.y).toBe(-1);
  expect(rect.width).toBe(2);
  expect(rect.height).toBe(2);
});

test("make_regular_polygon", () => {
  const tri1 = ear.math.make_regular_polygon(3);
  const tri2 = ear.math.make_regular_polygon(3, 2);
  // first coord (1,0)
  expect(tri1[0][0]).toBeCloseTo(1);
  expect(tri1[0][1]).toBeCloseTo(0);
  expect(tri1[1][0]).toBeCloseTo(-0.5);
  expect(tri1[1][1]).toBeCloseTo(Math.sqrt(3)/2);
  expect(tri1[2][0]).toBeCloseTo(-0.5);
  expect(tri1[2][1]).toBeCloseTo(-Math.sqrt(3)/2);
  //2
  expect(tri2[0][0]).toBeCloseTo(2);
  expect(tri2[1][0]).toBeCloseTo(-1);

});

// test("split_polygon", () => {
//   ear.math.split_polygon(poly, lineVector, linePoint)
// });

test("split_convex_polygon", () => {
  const rect_counter = [
    [-1, -1],
    [+1, -1],
    [+1, +1],
    [-1, +1],
  ];
  const rect_clock = [
    [-1, -1],
    [-1, +1],
    [+1, +1],
    [+1, -1],
  ];
  const res0 = ear.math.split_convex_polygon(rect_counter, [1,2], [0,0]);
  [[-1,1], [-1,-1], [-0.5,-1], [0.5,1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[0][i]));
  });
  [[1,-1], [1,1], [0.5,1], [-0.5,-1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[1][i]));
  });
});

test("split_convex_polygon no overlap", () => {
  const rect_counter = [
    [-1, -1],
    [+1, -1],
    [+1, +1],
    [-1, +1],
  ];
  const result = ear.math.split_convex_polygon(rect_counter, [1,2], [10,0]);
  rect_counter.forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(result[0][i]));
  });
});

test("split_convex_polygon vertex collinear", () => {
  const rect_counter = [
    [-1, -1],
    [+1, -1],
    [+1, +1],
    [-1, +1],
  ];
  const res0 = ear.math.split_convex_polygon(rect_counter, [1,1], [0,0]);
  [[1,1],[-1,1],[-1,-1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[0][i]));
  });
  [[-1,-1],[1,-1],[1,1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[1][i]));
  });
});

test("split_convex_polygon 1 edge and 1 vertex collinear", () => {
  const rect_counter = [
    [-1, -1],
    [+1, -1],
    [+1, +1],
    [-1, +1],
  ];
  const res0 = ear.math.split_convex_polygon(rect_counter, [1,2], [-1, -1]);
  [[-1,1],[-1,-1],[0,1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[0][i]));
  });
  [[1,-1],[1,1],[0,1],[-1,-1]].forEach((expected, i) => {
    expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[1][i]));
  });
});

test("convex_hull", () => {
  const rect = [
    [1,0],
    [0,0],
    [1,1],
    [0,1],
  ];
  const rect_collinear = [
    [1,0],
    [0,0],
    [0.5, 0],
    [1,1],
    [0, 0.5],
    [0,1],
  ];
  const res0 = ear.math.convex_hull(rect);
  const res1 = ear.math.convex_hull(rect_collinear);
  // todo this second parameter has been muted
  const res0b = ear.math.convex_hull(rect, true);
  const res1b = ear.math.convex_hull(rect_collinear, true);

  expect(res0.length).toBe(4);
  expect(res1.length).toBe(4);
  expect(res0b.length).toBe(4);
  // expect(res1b.length).toBe(6);
});
