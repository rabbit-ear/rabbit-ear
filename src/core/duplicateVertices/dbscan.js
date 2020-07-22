import math from "../../../include/math";

// todo, generalize to n-dimensions
// permissively ignores anything above 2D
const are_vertices_equivalent = function (a, b, epsilon = math.core.EPSILON) {
  const degree = a.length;
  for (let i = 0; i < degree; i += 1) {
    if (Math.abs(a[i] - b[i]) > epsilon) {
      return false;
    }
  }
  return true;
};

// equivalent is an NxN matrix. only top triangle is used
//
//             j  j  j
//          0  1  2  3
//   i  0 [ x,  ,  ,  ]
//   i  1 [ x, x,  ,  ]
//   i  2 [ x, x, x,  ]
//      3 [ x, x, x, x]
// showing crossings between 0 and 1, and 1 and 3.
// because the lower triangle is duplicate info, only store one half
const dbscan = (graph, epsilon = math.core.EPSILON) => {
  const equivalent = graph.vertices_coords.map(() => []);
  for (let i = 0; i < graph.vertices_coords.length - 1; i += 1) {
    for (let j = i + 1; j < graph.vertices_coords.length; j += 1) {
      equivalent[i][j] = are_vertices_equivalent(
        graph.vertices_coords[i],
        graph.vertices_coords[j],
        epsilon
      );
    }
  }
  // clusters is an array of arrays of numbers
  // each entry in clusters is an array of vertex indices
  const clusters = [];
  const visited = Array(graph.vertices_coords.length).fill(false);
  let visitedCount = 0;
  const squashed = equivalent
    .map(equiv => equiv
      .map((el, j) => (el ? j : undefined))
      .filter(a => a !== undefined));
  const recurse = (cluster_index, i) => {
    if (visited[i] || visitedCount === graph.vertices_coords.length) { return; }
    visited[i] = true;
    visitedCount += 1;
    if (!clusters[cluster_index]) { clusters[cluster_index] = []; }
    clusters[cluster_index].push(i);
    while (squashed[i].length > 0) {
      recurse(cluster_index, squashed[i][0]);
      squashed[i].splice(0, 1);
    }
  };
  for (let i = 0; i < graph.vertices_coords.length; i += 1) {
    recurse(i, i);
    if (visitedCount === graph.vertices_coords.length) { break; }
  }
  return clusters.filter(a => a.length);
};

export default dbscan;
