import math from "../../../include/math";

/**
 *
 * @returns a list for each edge containing the intersection points
 * 0 [ [0.25, 0.125] ]
 * 1 [ [0.25, 0.125], [0.99, 0.88] ]  // will become 3 segments
 * 2 [ ]  // will be unchanged.
 * 3 [ [0.99, 0.88] ]  // will become 2 segments
 *
 * if two edges end at the same endpoint this DOES NOT consider them touching
 *
 * careful with the pairs in separate locations - these are shallow pointers

 */
const make_edges_intersections = function (
  edges_vector, edges_origin, epsilon = math.core.EPSILON
) {
  // const edge_count = edges_vector.length;
  // const crossings = edges_vector.map(() => []);
  // "crossings" is an NxN matrix of edge crossings
  //     0  1  2  3
  // 0 [  , x,  ,  ]
  // 1 [ x,  ,  , x]
  // 2 [  ,  ,  ,  ]
  // 3 [  , x,  ,  ]
  // showing crossings between 0 and 1, and 1 and 3.
  // because the lower triangle is duplicate info, only store one half

  // allow for javascript arrays with holes
  // [{vec}, empty, {vec}, empty × 2, {vec}, empty × 7, {vec}]
  const indices = edges_vector.map((_, i) => i).filter(a => a !== null);

  const intersectFunc = math.intersect.lines.exclude_s_s;
  const edges_intersections = edges_vector.map(() => []);

  for (let ii = 0; ii < indices.length - 1; ii += 1) {
    for (let jj = ii + 1; jj < indices.length; jj += 1) {
      const i = indices[ii];
      const j = indices[jj];
      const crossing = math.intersect.lines.intersect_2D(
        edges_vector[i],
        edges_origin[i],
        edges_vector[j],
        edges_origin[j],
        intersectFunc,
        epsilon
      );
      if (crossing !== undefined) {
        edges_intersections[i][j] = crossing;
        edges_intersections[j][i] = crossing;
      }
    }
  }

  // for (let ii = 0; ii < indices.length - 1; ii += 1) {
  //   for (let jj = ii + 1; jj < indices.length; jj += 1) {
  //     const i = indices[ii];
  //     const j = indices[jj];
  //     crossings[i][j] = math.intersect.lines.intersect_2D(
  //       edges_vector[i],
  //       edges_origin[i],
  //       edges_vector[j],
  //       edges_origin[j],
  //       intersectFunc,
  //       epsilon
  //     );
  //   }
  // }
  // for (let ii = 0; ii < indices.length - 1; ii += 1) {
  //   for (let jj = ii + 1; jj < indices.length; jj += 1) {
  //     const i = indices[ii];
  //     const j = indices[jj];
  //     if (crossings[i][j] !== undefined) {
  //       edges_intersections[i][j] = crossings[i][j];
  //       edges_intersections[j][i] = crossings[i][j];
  //     }
  //   }
  // }
  return edges_intersections;
};

export default make_edges_intersections;
