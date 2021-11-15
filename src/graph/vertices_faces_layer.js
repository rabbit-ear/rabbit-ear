/**
 * Rabbit Ear (c) Robby Kraft
 */
import make_vertex_faces_layer from "./vertex_faces_layer";
import { make_faces_coloring, make_vertices_sectors } from "./make";
import { invert_map } from "./maps";
/**
 * @description flip a faces_layer solution to reflect having turned
 * over the origami.
 * @param {number[][]} an array of one or more faces_layer solutions
 */
const flip_solutions = solutions => {
  const face = solutions.face;
  const flipped = solutions
    .map(invert_map)
    .map(list => list.reverse())
    .map(invert_map);
  flipped.face = face;
  return flipped;
};
/**
 * @description compute the faces_layer solutions for every vertex in the
 * graph, taking into considering which face the solver began with each
 * time, and for faces which are upsidedown, flip those solutions also,
 * this way all notion of "above/below" are global, not local to a face
 * according to that face's normal.
 * @param {object} a FOLD graph
 * @param {number} this face will remain fixed
 * @param {number} epsilon, HIGHLY recommended, like: 0.001
 */
const make_vertices_faces_layer = (graph, start_face = 0, epsilon) => {
  if (!graph.vertices_sectors) {
    graph.vertices_sectors = make_vertices_sectors(graph);
  }
  const faces_coloring = make_faces_coloring(graph, start_face);
  const vertices_faces_layer = graph.vertices_sectors
    .map((_, vertex) => make_vertex_faces_layer(graph, vertex, epsilon));
  const flip_all = faces_coloring[start_face];
  const faces_flip = vertices_faces_layer
    .map(solution => faces_coloring[solution.face])
    .map(flip_this_face => flip_this_face ^ flip_all);
  // console.log("faces_flip", faces_flip);
  return vertices_faces_layer
    .map((solutions, i) => faces_flip
      ? flip_solutions(solutions)
      : solution);
};

export default make_vertices_faces_layer;

// const make_vertices_faces_layer = (graph, start_face = 0, epsilon) => {
//   if (!graph.vertices_sectors) {
//     graph.vertices_sectors = make_vertices_sectors(graph);
//   }
//   // the recursion algorithm will use these as the boundaries.
//   // folded_sectors is the array with holes,
//   // sectors is the array which will always be referenced to get the length
//   const sectors = graph.vertices_sectors
//     .map((vertices, v) => vertices
//       .map((sectors, i) => graph.vertices_faces[v][i] === undefined
//         ? undefined
//         : sectors));
//   const assignments = graph.vertices_edges
//     .map(edges => edges
//       .map(edge => graph.edges_assignment[edge]));
//   const vertices_sector_layers = sectors
//     .map((sec, v) => layer_solver(sec, assignments[v], epsilon));
//   const stationary_faces = vertices_sector_layers
//     .map((solutions, v) => graph.vertices_faces[v][solutions.face]);
//   // console.log("stationary_faces", stationary_faces);

//   // const faces_coloring = make_faces_coloring_from_matrix(graph);
//   const faces_coloring = make_faces_coloring(graph, start_face);
//   // console.log("faces_coloring", faces_coloring);

//   return vertices_sector_layers
//     .map((layers, v) => layers
//       .map(invert_simple_map)
//       .map(list => list.map(f => graph.vertices_faces[v][f]))
//       // .map(list => {
//       //   console.log("should we flip?", faces_coloring[stationary_faces[v]]);
//       //   return faces_coloring[stationary_faces[v]] ? list : list.reverse()
//       // })
//       .map(list => faces_coloring[stationary_faces[v]] ? list : list.reverse())
//       .map(invert_simple_map))
// };

// export default make_vertices_faces_layer;
