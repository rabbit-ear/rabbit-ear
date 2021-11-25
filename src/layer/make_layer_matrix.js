import make_vertices_faces_layer from "../graph/vertices_faces_layer";
import faces_layer_to_flat_orders from "./faces_layer_to_flat_orders";
import get_common_orders from "./get_common_orders";
import walk_pleat_path from "./walk_pleat_path";
/**
 * @description perform a layer solver on all vertices indipendently,
 * for each vertex, the result will be 1 or many solutions (hopefully not 0).
 * layer solutions come in the form of key/value: { face: layer }
 * and layers are only locally distributed 0...n.
 * gather all together and assign them to a matrix that relates NxN faces
 * with a value -1, 0, 1, declaring if face[i] is above face[i][j].
 */
const make_layer_matrix = (graph, face, epsilon) => {
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
  const orders = fixed_orders.concat(multiple_common_orders);
  // todo: using faces_vertices to get face count?
  const matrix = Array
    .from(Array(graph.faces_vertices.length))
    .map(() => Array(graph.faces_vertices.length));
  // add rules to matrix
  orders.forEach(group => group.forEach(order => {
    matrix[order[0]][order[1]] = order[2];
  }));
  // at this point, all single-vertex local layer ordering have been
  // individually added to the relationship matrix. 
  // next,
  // starting from every face, for both "above" and "below" walk by only
  // visiting one of each kind. this is analogous to walking from face to
  // face down a mountain-valley pleating, where we can be certain that
  // faces are above/below the starting face.
  //
  // this all only works with simple folds, origami without cycles.
  // todo: "cycles", what is the word i'm looking for?
  const visited = {};
  matrix.forEach((_, from) => [-1, 0, 1]
    .forEach(direction => matrix[from]
      .map((dir, i) => dir === direction ? i : undefined)
      .filter(a => a !== undefined)
      .forEach(to => walk_pleat_path(matrix, from, to, direction, visited))));
  return matrix;
};

export default make_layer_matrix;
