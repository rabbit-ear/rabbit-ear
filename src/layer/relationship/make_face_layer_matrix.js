/**
 * Rabbit Ear (c) Robby Kraft
 */
import { walk_all_pleat_paths } from "./pleat_paths";
import {
  make_edges_overlap_face_orders,
  make_single_vertex_face_orders,
} from "./make_relationships";
import get_common_orders from "./common_relationships";
import make_groups_edges from "../../graph/make_groups_edges";
// import edge_stack_layer_solver from "./edge_stack_layer_solver";
import { invert_map } from "../../graph/maps";
/**
 * @description perform a layer solver on all vertices indipendently,
 * for each vertex, the result will be 1 or many solutions (hopefully not 0).
 * layer solutions come in the form of key/value: { face: layer }
 * and layers are only locally distributed 0...n.
 * gather all together and assign them to a matrix that relates NxN faces
 * with a value -1, 0, 1, declaring if face[i] is above face[i][j].
 */
const make_layer_matrix = (graph, face, epsilon) => {
  // todo: using faces_vertices to get face count?
  const matrix = Array
    .from(Array(graph.faces_vertices.length))
    .map(() => Array(graph.faces_vertices.length));
  // add rules to matrix
  make_single_vertex_face_orders(graph, face, epsilon)
    .forEach(group => group
      .forEach(order => { matrix[order[0]][order[1]] = order[2]; }));
  // next, walk adjacent faces down mountain-valley pleats.
  walk_all_pleat_paths(matrix);

  make_edges_overlap_face_orders(graph, matrix, epsilon)
    .forEach(order => { matrix[order[0]][order[1]] = order[2]; });

  walk_all_pleat_paths(matrix);




  // const groups_edges = make_groups_edges(graph, epsilon);
  // for (let i = 0; i < groups_edges.length; i++) {
  //   const relationships = edge_stack_layer_solver(graph, groups_edges[i], matrix)
  //     .map(invert_map);
  //   get_common_orders(relationships).forEach(rule => {
  //     matrix[rule[0]][rule[1]] = rule[2];
  //   });
  //   // console.log("relationships", relationships);
  // }
  // // console.log("groups_edges", groups_edges);




  return matrix;
};

export default make_layer_matrix;
