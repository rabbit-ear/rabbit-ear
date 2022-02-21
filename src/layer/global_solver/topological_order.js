import conditions_to_matrix from "./conditions_to_matrix";
import { invert_map } from "../../graph/maps";

export const topological_order = (conditions) => {
  if (!conditions) { return undefined; }
  // this matrix will be used to build the parent_face_counts,
  // this matrix itself will remain unchanged.
  const matrix = conditions_to_matrix(conditions);
  // for every row (face), how many parent faces does each face have?
  // as each face is added to the stack (and removed from the tree),
  // this array will update to reflect the current state of the remaining faces.
  const parent_face_counts = matrix
    .map((row, i) => row
      .map(n => n === -1 ? 1 : 0)
      .reduce((a, b) => a + b, 0));
  // the final layer stack.
  const layers_face = [];
  const num_faces = parent_face_counts.filter(a => a != null).length;
  // faces with no parent (top of stack) will be added to the stack first.
  for (let i = 0; i < num_faces; i++) {
    let top_face = parent_face_counts.indexOf(0);
    // this means two or more faces are co-parents of each other, or
    // there exists a cycle of dependencies.
    if (top_face === -1) {
      // throw "cycle detected";
      console.warn("cycle detected");
      return undefined;
    }
    layers_face.push(top_face);
    // before we remove top_face from the matrix, locate all of the
    // top_face's children and decrement their parent count.
    matrix[top_face].forEach((dir, i) => {
      if (dir === 1) { parent_face_counts[i]--; }
    });
    // it's unnecessary to update the matrix. if we did it would go like this:
    // matrix[top_face].forEach((_, i) => delete matrix[i][top_face]);
    delete parent_face_counts[top_face];
  }
  // the layer stack should be ordered bottom to top. we need to reverse it.
  return layers_face.reverse();
};

export const complete_topological_order = (graph, layers_face) => {
  const faces_layer = invert_map(layers_face);
  const missed_faces = graph.faces_vertices
    .map((_, f) => faces_layer[f] === undefined ? f : undefined)
    .filter(a => a !== undefined);
  const max = faces_layer.reduce((a, b) => a > b ? a : b, 0);
  missed_faces.forEach((face, i) => { faces_layer[face] = i + 1; });
  return faces_layer;
};
