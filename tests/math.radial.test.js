const ear = require("../rabbit-ear");

const testEqualVectors = function (...args) {
  expect(ear.math.equivalent_vectors(...args)).toBe(true);
};

test("is_counter_clockwise_between", () => {
  expect(ear.math.is_counter_clockwise_between(0.5, 0, 1)).toBe(true);
  expect(ear.math.is_counter_clockwise_between(0.5, 1, 0)).toBe(false);
  expect(ear.math.is_counter_clockwise_between(11, 10, 12)).toBe(true);
  expect(ear.math.is_counter_clockwise_between(11, 12, 10)).toBe(false);
  expect(ear.math.is_counter_clockwise_between(Math.PI*2*4 + Math.PI/2, 0, Math.PI)).toBe(true);
  expect(ear.math.is_counter_clockwise_between(Math.PI*2*4 + Math.PI/2, Math.PI, 0)).toBe(false);
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

// test("subsect_radians", () => {
//   ear.math.subsect_radians(2, 0, Math.PI/2)
// });
// 
// test("subsect", () => {
//   ear.math.subsect(2, [1,0], [0,1]);
// });


