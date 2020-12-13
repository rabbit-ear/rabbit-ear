// isomorphic
var window;
const math = (window !== undefined) ? window.math : require("../math");

const verbose = true;
const bar = "============================================================";
// globals keep track of tests for more information during a fail
let name = "beginning of tests";
let testNumber = 1;
const failedTests = [];

// math constants
const sqrt05 = Math.sqrt(0.5);


const testName = function (newName) {
  name = newName;
  testNumber = 1;
};
/**
 * test equal runs the equivalent() function which incorporates an epsilon
 * such that the test "1e-8 is equivalent to 0" will come back true
 */
const testEqual = function (...args) {
  if (!ear.math.equivalent(...args)) {
    // test failed
    const message = `xxx test failed. #${testNumber} of ${name}`;
    failedTests.push({ message, args });
    if (verbose) { console.log(message); }
  } else {
    // test passed
    if (verbose) {
      console.log(`... test passed #${testNumber} of ${name}`);
    }
  }
  testNumber += 1;
};

/**
 * number cleaning
 */
testName("clean number");
// this is the most decimal places javascript uses
testEqual(true, ear.math.clean_number(0.12345678912345678)
  === 0.12345678912345678);
testEqual(true, ear.math.clean_number(0.12345678912345678, 5)
  === 0.12345678912345678);
testEqual(true, ear.math.clean_number(0.00000678912345678, 5)
  === 0.00000678912345678);
testEqual(true, ear.math.clean_number(0.00000078912345678, 5)
  === 0);
testEqual(true, ear.math.clean_number(0.00000000000000001)
  === 0);
testEqual(true, ear.math.clean_number(0.0000000000000001)
  === 0);
testEqual(true, ear.math.clean_number(0.000000000000001)
  === 0.000000000000001);
testEqual(true, ear.math.clean_number(0.00000000001, 9)
  === 0);
testEqual(true, ear.math.clean_number(0.0000000001, 9)
  === 0);
testEqual(true, ear.math.clean_number(0.000000001, 9)
  === 0.000000001);

/**
 * inputs and argument inference
 */
testName("semi-flatten input");
testEqual([{ x: 5, y: 3 }], ear.math.semi_flatten_arrays({ x: 5, y: 3 }));
testEqual([{ x: 5, y: 3 }], ear.math.semi_flatten_arrays([[[{ x: 5, y: 3 }]]]));
testEqual([5, 3], ear.math.semi_flatten_arrays([[[5, 3]]]));
testEqual([[5], [3]], ear.math.semi_flatten_arrays([[[5], [3]]]));
testEqual([[[5]], [[3]]], ear.math.semi_flatten_arrays([[[5]], [[3]]]));
testEqual([[[[5]]], [[[3]]]], ear.math.semi_flatten_arrays([[[5]]], [[[3]]]));
testEqual(true, undefined === ear.math.get_vector(undefined, undefined));

testName("flatten input");
testEqual([1], ear.math.flatten_arrays([[[1]], []]));
testEqual([1, 2, 3, 4], ear.math.flatten_arrays([[[1, 2, 3, 4]]]));
testEqual([1, 2, 3, 4], ear.math.flatten_arrays(1, 2, 3, 4));
testEqual([1, 2, 3, 4, 2, 4],
  ear.math.flatten_arrays([1, 2, 3, 4], [2, 4]));
testEqual([1, 2, 3, 4, 6, 7, 6],
  ear.math.flatten_arrays([1, 2, 3, 4], [6, 7], 6));
testEqual([1, 2, 3, 4, 6, 7, 6, 2, 4, 5],
  ear.math.flatten_arrays([1, 2, 3, 4], [6, 7], 6, 2, 4, 5));
testEqual([{ x: 5, y: 3 }], ear.math.flatten_arrays({ x: 5, y: 3 }));
testEqual([{ x: 5, y: 3 }], ear.math.flatten_arrays([[{ x: 5, y: 3 }]]));
testEqual([1, 2, 3, 4, 5, 6],
  ear.math.flatten_arrays([[[1], [2, 3]]], 4, [5, 6]));

testName("get vector");
testEqual([1, 2, 3, 4], ear.math.get_vector([[[1, 2, 3, 4]]]));
testEqual([1, 2, 3, 4], ear.math.get_vector(1, 2, 3, 4));
testEqual([1, 2, 3, 4, 2, 4], ear.math.get_vector([1, 2, 3, 4], [2, 4]));
testEqual([1, 2, 3, 4, 6, 7, 6], ear.math.get_vector([1, 2, 3, 4], [6, 7], 6));
testEqual([1, 2, 3, 4, 6, 7, 6, 2, 4, 5], ear.math.get_vector([1, 2, 3, 4], [6, 7], 6, 2, 4, 5));
testEqual([5, 3], ear.math.get_vector({ x: 5, y: 3 }));
testEqual([5, 3], ear.math.get_vector([[[{ x: 5, y: 3 }]]]));
testEqual([5, 3], ear.math.get_vector([[[5, 3]]]));
testEqual([5, 3], ear.math.get_vector([[[5], [3]]]));
testEqual([5, 3], ear.math.get_vector([[[5]], [[3]]]));
testEqual([5, 3], ear.math.get_vector([[[5]]], [[[3]]]));
testEqual([5, 3], ear.math.get_vector([[[5]]], 3));

testName("get vector of vectors");
testEqual([[1, 2], [3, 4]],
  ear.math.get_vector_of_vectors({ x: 1, y: 2 }, { x: 3, y: 4 }));
testEqual([[1, 2], [3, 4]],
  ear.math.get_vector_of_vectors([[[{ x: 1, y: 2 }, { x: 3, y: 4 }]]]));
testEqual([[1, 2], [3, 4]],
  ear.math.get_vector_of_vectors([[[1, 2], [3, 4]]]));
testEqual([[1, 2], [3, 4]],
  ear.math.get_vector_of_vectors([[[1, 2]], [[3, 4]]]));
testEqual([[1, 2], [3, 4]],
  ear.math.get_vector_of_vectors([[[1, 2]]], [[[3, 4]]]));
testEqual([[1], [2], [3], [4]],
  ear.math.get_vector_of_vectors([[[1], [2], [3], [4]]]));
testEqual([[1], [2], [3], [4]],
  ear.math.get_vector_of_vectors([[[1]], [[2]], [[3]], [[4]]]));
testEqual([[1], [2], [3], [4]],
  ear.math.get_vector_of_vectors([[[1]]], 2, 3, 4));
testEqual([[1], [2], [3], [4]],
  ear.math.get_vector_of_vectors([[[1, 2, 3, 4]]]));

testName("get two vectors");
testEqual([[1, 2], [3, 4]], ear.segment(1, 2, 3, 4));
testEqual([[1, 2], [3, 4]], ear.segment([1, 2], [3, 4]));
testEqual([[1, 2], [3, 4]], ear.segment([1, 2, 3, 4]));
testEqual([[1, 2], [3, 4]], ear.segment([[1, 2], [3, 4]]));

testName("get matrix");
testEqual([1, 2, 3, 4, 5, 6], ear.math.get_matrix2([[[1, 2, 3, 4, 5, 6]]]));
testEqual([1, 2, 3, 4, 0, 0], ear.math.get_matrix2([[1, 2, 3, 4]]));
testEqual([1, 2, 3, 1, 0, 0], ear.math.get_matrix2(1, 2, 3));
testEqual([1, 2, 3, 1, 0, 0], ear.math.get_matrix2(ear.matrix2(1, 2, 3, 1)));

/**
 * queries
 */

testName("equivalent function");
testEqual(true, ear.math.equivalent(4, 4, 4));
testEqual(false, ear.math.equivalent(4, 4, 5));
testEqual(true, ear.math.equivalent([0], [0], [0]));
testEqual(false, ear.math.equivalent([0], [0, 0], [0]));
testEqual(false, ear.math.equivalent([0], [0], [1]));
testEqual(false, ear.math.equivalent([1], [0], [1]));
testEqual(true, ear.math.equivalent(1, 1, 0.99999999999));
testEqual(true, ear.math.equivalent([1], [1], [0.99999999999]));
testEqual(false, ear.math.equivalent([1], [1, 1], [1]));
testEqual(false, ear.math.equivalent([1], [1, 0], [1]));
testEqual(true, ear.math.equivalent(true, true, true, true));
testEqual(true, ear.math.equivalent(false, false, false, false));
testEqual(false, ear.math.equivalent(false, false, false, true));
// equivalency has not yet been made to work with other types.
// inside the equivalent function, it calls equivalent_vectors which calls
// get_vector_of_vectors, which is forcing the removal of data that isn't a number
// tests 1 and 2 work, 3 doesn't
// testEqual(true, ear.math.equivalent("hi", "hi", "hi"));
// testEqual(false, ear.math.equivalent("hi", "hi", "bye"));
// testEqual(false, ear.math.equivalent(["hi", "hi"], ["hi", "hi", "hi"]));

testName("equivalent numbers");
testEqual(true, ear.math.equivalent_numbers([[[1, 1, 1, 1, 1]]]));
testEqual(false, ear.math.equivalent_numbers([[[1, 1, 1, 1, 1, 4]]]));
testEqual(false, ear.math.equivalent_numbers([1, 1, 1, 1, 1, 1], [1, 2]));

/**
 * algebra core
 */

testName("average function");
testEqual([3.75, 4.75],
  ear.math.average([4, 1], [5, 6], [4, 6], [2, 6]));
testEqual([4, 5, 3],
  ear.math.average([1, 2, 3], [4, 5, 6], [7, 8]));
testEqual([4, 5, 6],
  ear.math.average([1, 2, 3], [4, 5, 6], [7, 8, 9]));

/**
 * vectors
 */

testName("vector normalize, scale");
testEqual([Math.sqrt(2), Math.sqrt(2)],
  ear.vector(10, 10).normalize().scale(2));

testName("vector dot");
testEqual(0, ear.vector(2, 1).normalize().dot(ear.vector(1, -2).normalize()));
testEqual(1, ear.vector(2, 1).normalize().dot(ear.vector(4, 2).normalize()));

testName("vector cross");
testEqual([0, 0, -5], ear.vector(2, 1).cross(ear.vector(1, -2)));

testName("vector parallel");
testEqual(true, ear.vector(3, 4).isParallel(ear.vector(-6, -8)));
testName("lines parallel");
testEqual(true, ear.line(100, 101, 3, 4).isParallel(ear.line(5, 5, -6, -8)));

testName("vector lerp");
testEqual([15.5, 3.5, 3], ear.vector(30, 5, 3).lerp([1, 2, 3], 0.5));

testName("vector copy");
testEqual([1, 2, 3], ear.vector(1, 2, 3).copy().copy());

/**
 * matrices
 */

// todo: test matrix3 methods (invert) with the translation component to make sure it carries over
testName("matrix core");
testEqual(12, ear.math.determinant3([1, 2, 3, 2, 4, 8, 7, 8, 9]));
testEqual(10, ear.math.determinant3([3, 2, 0, 0, 0, 1, 2, -2, 1, 0, 0, 0]));
testEqual([4, 5, -8, -5, -6, 9, -2, -2, 3, 0, 0, 0],
  ear.math.invert_matrix3([0, 1, -3, -3, -4, 4, -2, -2, 1, 0, 0, 0]));
testEqual([0.2, -0.2, 0.2, 0.2, 0.3, -0.3, 0, 1, 0, 0, 0, 0],
  ear.math.invert_matrix3([3, 2, 0, 0, 0, 1, 2, -2, 1, 0, 0, 0]));
const mat_3d_ref = ear.math.make_matrix3_reflectZ([1, -2], [12, 13]);
testEqual(ear.math.make_matrix2_reflect([1, -2], [12, 13]),
  [mat_3d_ref[0], mat_3d_ref[1], mat_3d_ref[3], mat_3d_ref[4], mat_3d_ref[9], mat_3d_ref[10]]);
// rotate 360 degrees about an arbitrary axis and origin
testEqual([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  ear.math.make_matrix3_rotate(Math.PI * 2,
    [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
    [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]));

testEqual(ear.math.make_matrix3_rotateX(Math.PI / 6),
  ear.math.make_matrix3_rotate(Math.PI / 6, [1, 0, 0]));
testEqual(ear.math.make_matrix3_rotateY(Math.PI / 6),
  ear.math.make_matrix3_rotate(Math.PI / 6, [0, 1, 0]));
testEqual(ear.math.make_matrix3_rotateZ(Math.PI / 6),
  ear.math.make_matrix3_rotate(Math.PI / 6, [0, 0, 1]));
// source wikipedia https://en.wikipedia.org/wiki/Rotation_matrix#Examples
testEqual([
  0.35612209405955486, -0.8018106071106572, 0.47987165414043453,
  0.47987165414043464, 0.5975763087872217, 0.6423595182829954,
  -0.8018106071106572, 0.0015183876574496047, 0.5975763087872216,
  0, 0, 0
], ear.math.make_matrix3_rotate(-74 / 180 * Math.PI, [-1 / 3, 2 / 3, 2 / 3]));

testEqual([1, 0, 0, 0, 0.8660254, 0.5, 0, -0.5, 0.8660254, 0, 0, 0],
  ear.math.make_matrix3_rotate(Math.PI / 6, [1, 0, 0]));

// source wolfram alpha
testEqual([-682, 3737, -5545, 2154, -549, -1951, 953, -3256, 4401, 0, 0, 0],
  ear.math.multiply_matrices3([5, -52, 85, 15, -9, -2, 32, 2, -50, 0, 0, 0],
    [-77, 25, -21, 3, 53, 42, 63, 2, 19, 0, 0, 0]));

testName("matrices");
const ident = ear.matrix();
testEqual(ident.rotateX(Math.PI / 2).translate(40, 20, 10),
  [1, 0, 0, 0, 0, 1, 0, -1, 0, 40, -10, 20]);
// top level types
testEqual([1, 2, 3, 4, 5, 6], ear.matrix2(1, 2, 3, 4, 5, 6));
testEqual([1, 0, 0, 1, 6, 7], ear.matrix2.makeTranslation(6, 7));
testEqual([3, 0, 0, 3, -2, 0], ear.matrix2.makeScale(3, 3, [1, 0]));
testEqual([0, 1, 1, -0, -8, 8], ear.matrix2.makeReflection([1, 1], [-5, 3]));
testEqual(
  [sqrt05, sqrt05, -sqrt05, sqrt05, 1, 1],
  ear.matrix2.makeRotation(Math.PI / 4, [1, 1])
);
testEqual(
  [sqrt05, -sqrt05, sqrt05, sqrt05, -sqrt05, sqrt05],
  ear.matrix2(sqrt05, sqrt05, -sqrt05, sqrt05, 1, 0).inverse()
);
testEqual(
  [Math.sqrt(4.5), sqrt05, -sqrt05, Math.sqrt(4.5), Math.sqrt(4.5), sqrt05],
  ear.matrix2(sqrt05, -sqrt05, sqrt05, sqrt05, 0, 0)
    .multiply(ear.matrix2(1, 2, -2, 1, 1, 2))
);
testEqual([0, 3], ear.matrix2(2, 1, -1, 2, -1, 0).transform(1, 1));
testEqual([-2, 3], ear.matrix2.makeScale(3, 3, [1, 0]).transform([0, 1]));
testEqual([-1, 2], ear.matrix2.makeScale(3, 3, [0.5, 0.5]).transform([0, 1]));
testEqual([1, 1], ear.matrix2.makeScale(0.5, 0.5, [1, 1]).transform([1, 1]));
testEqual([0.75, 0.75], ear.matrix2.makeScale(0.5, 0.5, [0.5, 0.5]).transform([1, 1]));

/**
 * lines, rays, segments
 */

testName("line ray segment intersections");
testEqual([5, 5], ear.line(0, 0, 1, 1).intersect(ear.line(10, 0, -1, 1)));
testEqual([5, 5], ear.line(0, 0, 1, 1).intersect(ear.ray(10, 0, -1, 1)));
testEqual([5, 5], ear.line(0, 0, 1, 1).intersect(ear.segment(10, 0, 0, 10)));

testName("line ray segment parallel");
testEqual(true, ear.line(0, 0, 1, 1).isParallel(ear.ray(10, 0, 1, 1)));
testEqual(true, ear.line(0, 0, -1, 1).isParallel(ear.segment(0, 0, -2, 2)));
testEqual(false, ear.line(0, 0, -1, 1).isParallel(ear.segment(10, 0, 1, 1)));

testName("line ray segment reflection matrices");
testEqual(
  ear.line(10, 0, -1, 1).reflection(),
  ear.ray(10, 0, -1, 1).reflection()
);
testEqual(
  ear.segment(10, 0, 0, 10).reflection(),
  ear.ray(10, 0, -1, 1).reflection()
);

testName("line ray segment nearest points");
testEqual([20, -10], ear.line(10, 0, -1, 1).nearestPoint([20, -10]));
testEqual([-50, 60], ear.line(10, 0, -1, 1).nearestPoint([-10, 100]));
testEqual([10, 0], ear.ray(10, 0, -1, 1).nearestPoint([20, -10]));
testEqual([-50, 60], ear.ray(10, 0, -1, 1).nearestPoint([-10, 100]));
testEqual([10, 0], ear.segment(10, 0, 0, 10).nearestPoint([20, -10]));
testEqual([0, 10], ear.segment(10, 0, 0, 10).nearestPoint([-10, 100]));
testEqual(
  ear.ray(10, 0, -1, 1).nearestPoint([0, 0]),
  ear.line(10, 0, -1, 1).nearestPoint([0, 0])
);
testEqual(
  ear.segment(10, 0, 0, 10).nearestPoint([0, 0]),
  ear.ray(10, 0, -1, 1).nearestPoint([0, 0])
);

/**
 * polygons
 */

testName("circle");
testEqual(5, ear.circle(1, 2, 5).radius);
testEqual([1, 2], ear.circle(1, 2, 5).origin);
testEqual(
  [[0.5, Math.sqrt(3) / 2], [0.5, -Math.sqrt(3) / 2]],
  ear.circle(0, 0, 1).intersectionLine(ear.line(0.5, 0, 0, 1))
);
// todo, this needs to be written
// testEqual(
//   [Math.sqrt(2) / 2, -Math.sqrt(2) / 2],
//   ear.circle(0, 0, 1).intersectionRay(ear.ray(0, 0, 0.1, 0.1))
// );
// testEqual(
//   [Math.sqrt(2) / 2, -Math.sqrt(2) / 2],
//   ear.circle(0, 0, 1).intersectionEdge(ear.segment(0, 0, 10, 10))
// );


testName("polygon");
testEqual(
  ear.polygon.regularPolygon(4).clipLine(ear.line(0.5, 0.5, 6, -11)),
  ear.convexPolygon.regularPolygon(4).clipLine(ear.line(0.5, 0.5, 6, -11))
);
testEqual([[-1, 0.5], [1, 0.5]],
  ear.polygon.regularPolygon(4).clipLine(ear.line(0.5, 0.5, 1, 0)));
testEqual([[1, 0], [0, 1.87], [-1, 0]], ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).points);

// testEqual(true, ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).sides);
// testEqual(true, ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).split);
// testEqual(true, ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).overlaps);
// testEqual(true, ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).scale);
// testEqual(true, ear.convexPolygon([1, 0], [0, 1.87], [-1, 0]).rotate);

// clipEdge
// clipLine
// clipRay

testName("prototype member variables accessing 'this'");
testEqual(4, ear.polygon.regularPolygon(4).edges.length);
testEqual(4, ear.polygon.regularPolygon(4).area());

/**
 * junctions, sectors, interior angles
 */

testName("interior angles");
testEqual(
  [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
  [[1, 0], [0, 1], [-1, 0], [0, -1]].map((v, i, ar) => ear.math
    .counter_clockwise_angle2(v, ar[(i + 1) % ar.length]))
);
testEqual(
  [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
  [[1, 1], [-1, 1], [-1, -1], [1, -1]].map((v, i, ar) => ear.math
    .counter_clockwise_angle2(v, ar[(i + 1) % ar.length]))
);

testName("counter-clockwise vector sorting");
testEqual(
  [0, 1, 2, 3],
  ear.math.counter_clockwise_vector_order([1, 1], [-1, 1], [-1, -1], [1, -1])
);
testEqual(
  [0, 3, 2, 1],
  ear.math.counter_clockwise_vector_order([1, -1], [-1, -1], [-1, 1], [1, 1])
);

testName("sectors");
testEqual(Math.PI / 2, ear.sector.fromVectors([1, 0], [0, 1]).angle);
testEqual(true, ear.sector.fromVectors([1, 0], [0, 1]).contains([1, 1]));
testEqual(false, ear.sector.fromVectors([1, 0], [0, 1]).contains([-1, 1]));
testEqual(false, ear.sector.fromVectors([1, 0], [0, 1]).contains([-1, -1]));
testEqual(false, ear.sector.fromVectors([1, 0], [0, 1]).contains([1, -1]));

testName("junctions");
testEqual([[1, 1], [1, -1], [-1, 1], [-1, -1]],
  ear.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectors);
testEqual([0, 2, 3, 1],
  ear.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectorOrder);
testEqual([Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
  ear.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).angles());

/**
 * origami math
 */
/**
 * origami math has been temporarily moved outside this project.
 * this might be re-included someday, or maybe it will be left out.
 */
/*
testName("kawasaki's theorem math");
testEqual([16, 20], ear.math.alternating_sum(1, 2, 3, 4, 5, 6, 7, 8));
testEqual([0, 0], ear.math.kawasaki_sector_score(Math.PI, Math.PI));
testEqual([0, 0], ear.math.kawasaki_sector_score(
  Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2
));
testEqual([1, -1],
  ear.math.kawasaki_sector_score(Math.PI - 1, Math.PI + 1));
testEqual([1, -1],
  ear.math.kawasaki_sector_score(
    Math.PI / 2 - 0.5,
    Math.PI / 2 + 0.5,
    Math.PI / 2 - 0.5,
    Math.PI / 2 + 0.5
  ));
testEqual([0, 0],
  ear.math.kawasaki_sector_score(...ear.math.interior_angles([1, 0], [0, 1], [-1, 0], [0, -1])));
testEqual(
  [undefined, undefined, 1.25 * Math.PI],
  ear.math.kawasaki_solutions_radians(
    0, Math.PI / 2, Math.PI / 4 * 3
  )
);
testEqual(
  [[Math.cos(Math.PI * 1 / 3), Math.sin(Math.PI * 1 / 3)],
    [Math.cos(Math.PI * 3 / 3), Math.sin(Math.PI * 3 / 3)],
    [Math.cos(Math.PI * 5 / 3), Math.sin(Math.PI * 5 / 3)]],
  ear.math.kawasaki_solutions(
    [Math.cos(0), Math.sin(0)],
    [Math.cos(Math.PI * 2 / 3), Math.sin(Math.PI * 2 / 3)],
    [Math.cos(Math.PI * 4 / 3), Math.sin(Math.PI * 4 / 3)]
  )
);
testEqual([undefined, undefined, [-sqrt05, -sqrt05]],
  ear.math.kawasaki_solutions(
    [Math.cos(0), Math.sin(0)],
    [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)],
    [Math.cos(Math.PI / 2), Math.sin(Math.PI / 2)]
  ));
*/

testName("nearest point");
testEqual([5, 5], ear.math.nearest_point2([10, 0],
  [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8], [9, 9]]));
testEqual([6, 6, 0], ear.math.nearest_point([10, 0, 0],
  [[0, 0, 0], [1, 1, 0], [2, 2, 0], [3, 3, 0], [4, 4, 1],
    [5, 5, 10], [6, 6, 0], [7, 7, 0], [8, 8, 0], [9, 9, 0]]));

if (failedTests.length) {
  console.log(`${bar}\nFailed tests and arguments\n`);
  failedTests.forEach(test => console.log(`${test.message}\n${test.args}\n${bar}`));
  throw new Error("tests failed");
} else {
  console.log(`${bar}\nall tests pass\n${bar}\n`);
}
