/**
 * Rabbit Ear (c) Robby Kraft
 */
import get_splice_indices from "./get_splice_indices";

const shrink_collection = (indices) => {
  while (indices.length > 2) {
    const i = Math.random() * indices.length;
    indices.splice(i, 1);
  }
  return indices;
};

// const counter = { count: 0 };
const matrix_to_layers_permutations = (matrix, faces, layers_face = []) => {
  // for the first time running this recursive method, user is allowed to leave
  // out "faces", and it will be built from the keys of the matrix.
  if (!faces) { faces = Object.keys(matrix); }
  // counter.count++;
  // if (counter.count > 10000) { return []; }
  const next_face = faces[0];
  if (next_face === undefined) { return [layers_face]; }
  // convert every face in the current layer stack to a "1" or "-1",
  // indicating this new face's relationship to that layer's face.
  const layers_face_relative = layers_face
    .map(face => matrix[next_face][face]);
  // find the lowest "-1" and the highest "1", all valid places
  // for this face will be the layers between these two.
  const splice_indices = get_splice_indices(layers_face_relative);

  const splice_indices_sm = shrink_collection(splice_indices);
  // prepare next recursion, duplicate in memory the layer_face so that
  // future recursive calls aren't modifying the same memory location
  const layer_permutations = splice_indices_sm.map(() => layers_face.slice());
  // splice in this face into each permutation at the valid index location
  layer_permutations.forEach((layers, i) => layers
    .splice(splice_indices_sm[i], 0, next_face));
  // test layer for self-intersections
  return layer_permutations
    .map(layers => matrix_to_layers_permutations(matrix, faces.slice(1), layers))
    .reduce((a, b) => a.concat(b), []);
};

export default matrix_to_layers_permutations;
