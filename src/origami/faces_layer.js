/**
 * Each of these should return an array of Edges
 *
 * Each of the axioms create full-page crease lines
 *  ending at the boundary; in non-convex paper, this
 *  could result in multiple edges
 */

// "re:boundaries_vertices" = [[5,3,9,7,6,8,1,2]];
// "faces_re:matrix" = [[1,0,0,1,0,0]];

/**
 * this builds a new faces_layer array. it first separates the folding
 * faces from the non-folding, using faces_folding, an array of [t,f].
 * it flips the folding faces over, appends them to the non-folding ordering,
 * and (re-indexes/normalizes) all the z-index values to be the minimum
 * whole number set starting with 0.
 */
export const foldLayers = function (faces_layer, faces_folding) {
  const folding_i = faces_layer
    .map((el, i) => (faces_folding[i] ? i : undefined))
    .filter(a => a !== undefined);
  const not_folding_i = faces_layer
    .map((el, i) => (!faces_folding[i] ? i : undefined))
    .filter(a => a !== undefined);
  const sorted_folding_i = folding_i.slice()
    .sort((a, b) => faces_layer[a] - faces_layer[b]);
  const sorted_not_folding_i = not_folding_i.slice()
    .sort((a, b) => faces_layer[a] - faces_layer[b]);
  const new_faces_layer = [];
  sorted_not_folding_i.forEach((layer, i) => { new_faces_layer[layer] = i; });
  const topLayer = sorted_not_folding_i.length;
  sorted_folding_i.reverse().forEach((layer, i) => {
    new_faces_layer[layer] = topLayer + i;
  });
  return new_faces_layer;
};


// let sector_angles = function(graph, vertex) {
//  let adjacent = origami.cp.vertices_vertices[vertex];
//  let vectors = adjacent.map(v => [
//    origami.cp.vertices_coords[v][0] - origami.cp.vertices_coords[vertex][0],
//    origami.cp.vertices_coords[v][1] - origami.cp.vertices_coords[vertex][1]
//  ]);
//  let vectors_as_angles = vectors.map(v => Math.atan2(v[1], v[0]));
//  return vectors.map((v,i,arr) => {
//    let nextV = arr[(i+1)%arr.length];
//    return math.core.counter_clockwise_angle2(v, nextV);
//  });
// }
