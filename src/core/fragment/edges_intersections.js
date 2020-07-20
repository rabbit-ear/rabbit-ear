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
const make_edges_intersections = function ({
  vertices_coords, edges_vertices
}, epsilon = math.core.EPSILON) {
  const edge_count = edges_vertices.length;
  const edges = edges_vertices
    .map(ev => ev.map(v => vertices_coords[v]));
  // todo this could already be cached on the object. like segment()
  const edgeObjects = edges.map(e => ({
    origin: e[0],
    vector: [e[1][0] - e[0][0], e[1][1] - e[0][1]]
  }));
  // "crossings" is an NxN matrix of edge crossings
  //     0  1  2  3
  // 0 [  , x,  ,  ]
  // 1 [ x,  ,  , x]
  // 2 [  ,  ,  ,  ]
  // 3 [  , x,  ,  ]
  // showing crossings between 0 and 1, and 1 and 3.
  // because the lower triangle is duplicate info, only store one half
  const crossings = Array.from(Array(edge_count - 1)).map(() => []);
  const intersectFunc = math.intersect.lines.exclude_s_s;
  for (let i = 0; i < edges.length - 1; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      crossings[i][j] = math.intersect.lines
        .intersect(edgeObjects[i], edgeObjects[j], intersectFunc, epsilon);
    }
  }
  const edges_intersections = Array.from(Array(edge_count)).map(() => []);
  for (let i = 0; i < edges.length - 1; i += 1) {
    for (let j = i + 1; j < edges.length; j += 1) {
      if (crossings[i][j] != null) {
        edges_intersections[i].push(crossings[i][j]);
        edges_intersections[j].push(crossings[i][j]);
      }
    }
  }
  return edges_intersections;
};

export default make_edges_intersections;
