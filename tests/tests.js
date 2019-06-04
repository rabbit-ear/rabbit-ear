// isomorphic
var window;
const re = (window !== undefined && window.re)
  ? window.re
  : require("../rabbit-ear");

const verbose = true;
const bar = "============================================================";
// globals keep track of tests for more information during a fail
let name = "beginning of tests";
let testNumber = 1;

const testName = function (newName) {
  name = newName;
  testNumber = 1;
};
/**
 * test equal runs the equivalent() function which incorporates an epsilon
 * such that the test "1e-8 is equivalent to 0" will come back true
 */
const testEqual = function (...args) {
  if (!re.math.equivalent(...args)) {
    console.log(`${bar}\ntest failed. #${testNumber} of ${name}\n${bar}`);
    throw args;
  }
  if (verbose) {
    console.log(`...test passed #${testNumber} of ${name}`);
  }
  testNumber += 1;
};

/**
 * inputs and argument inference
 */
testName("array lengths");
testEqual(6, re.core.vertices_count(re.bases.kite));
testEqual(9, re.core.edges_count(re.bases.kite));
testEqual(4, re.core.faces_count(re.bases.kite));

let aa = re.core.add_vertex_on_edge_functional(re.bases.kite, 0.44, 0.44, 6);
console.log(aa);

let e = re.core.replace_edge(re.bases.kite, 6, [0.5, 0.5], [0.6, 0.6], [0.7, 0.7]);
console.log(e);


// //////////////////////////
// let bb = re.bases.frog;
// bb.vertices_coords.push([12, 12]);
// get_isolated_vertices(bb);
// should equal [25]


const collinearSquare = {
  vertices_coords: [[0, 0], [0.1, 0], [0.2, 0], [0.3, 0], [0.4, 0], [0.5, 0],
    [0.6, 0], [0.7, 0], [0.8, 0], [1, 0], [1, 1], [0, 1]],
  vertices_vertices: [[11, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6],
    [5, 7], [6, 8], [7, 9], [8, 10], [9, 11], [10, 0]],
  vertices_faces: [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
  edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
    [7, 8], [8, 9], [9, 10], [10, 11], [11, 0]],
  edges_faces: [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
  edges_assignment: ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B"],
  edges_foldAngle: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  faces_vertices: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
  faces_edges: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]]
};

let verts = re.core.get_collinear_vertices(collinearSquare);
