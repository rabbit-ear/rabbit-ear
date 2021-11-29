import get_common_orders from "./get_common_orders";
import make_edge_layer_matrix from "./make_edge_layer_matrix";
import faces_layer_to_flat_orders from "./faces_layer_to_flat_orders";
import make_vertices_faces_layer from "../graph/vertices_faces_layer";
/**
 * @returns {number[][]} array of relationships: [f1, f2, dir]
 */
export const make_edges_overlap_face_orders = (graph, matrix, epsilon) => {
  const orders = [];
  make_edge_layer_matrix(graph, matrix, epsilon)
    .forEach((row, e1) => row
      .forEach((rule, e2) => graph.edges_faces[e1]
        .forEach(f1 => graph.edges_faces[e2]
          .forEach(f2 => orders.push([f1, f2, rule], [f2, f1, -rule])))));
  return orders;
};
/**
 * @returns {number[][][]} array of array of relationships: [f1, f2, dir]
 */
export const make_single_vertex_face_orders = (graph, face, epsilon) => {
  const vertices_faces_layer = make_vertices_faces_layer(graph, face, epsilon);
  // extract all the solutions at vertices where there is only one solution
  // we can be absolutely certain about these rules. add them first.
  const fixed_orders = vertices_faces_layer
    .filter(solutions => solutions.length === 1)
    .map(solutions => solutions[0])
    .map(faces_layer_to_flat_orders)
  // complex cases have more than one solution, but among all their solutions,
  // there are consistent rules that are true among all solutions. find those.
  const multiple_common_orders = vertices_faces_layer
    .filter(solutions => solutions.length > 1)
    .map(get_common_orders);
  // combine rules into one set of sets
  return fixed_orders.concat(multiple_common_orders);
};
