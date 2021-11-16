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
  // root face, and all faces with the same color, will be false
  const faces_coloring = make_faces_coloring(graph, start_face).map(c => !c);
  // if the initial face is flipped in the 
  const flip_all = faces_coloring[start_face];
  // the faces_layer solutions for every vertex and its adjacent faces
  const vertices_faces_layer = graph.vertices_sectors
    .map((_, vertex) => make_vertex_faces_layer(graph, vertex, epsilon));

  console.log("vertices_faces_layer", JSON.parse(JSON.stringify(vertices_faces_layer)));
  console.log("vertices_faces_layer solution star faces", JSON.parse(JSON.stringify(vertices_faces_layer
    .map(solution => solution.face))));
  // is each face flipped or not? (should the result be flipped too.)
  // each solution was built from a starting face (solution.face),
  // if this face is flipped in the coloring, flip the solution too.
  // however, we also have to take into consideration the start_face,
  // if this face is flipped the entire solution set needs to flip again.
  // XOR with (start_face) and each face's (solution.face):
  // 0 0 : 0 (no flip)
  // 1 0 : 1 (flipped)
  // 0 1 : 1 (flipped)
  // 1 1 : 0 (no flip, because, 2 flips = no flips)
  const vertices_solutions_flip = vertices_faces_layer
    .map(solution => faces_coloring[solution.face])
    .map(solution_flipped => solution_flipped ^ flip_all);

  // console.log("flip all", flip_all);
  // console.log("specific solution, start face", vertices_faces_layer
  //   .map(solution => solution.face));
  // console.log("specific solution, flip", vertices_faces_layer
  //   .map(solution => faces_coloring[solution.face]));
  // console.log("vertices_solutions_flip", vertices_solutions_flip);

  return vertices_faces_layer
    .map((solutions, i) => vertices_solutions_flip[i]
      ? flip_solutions(solutions)
      : solutions);
};

export default make_vertices_faces_layer;
