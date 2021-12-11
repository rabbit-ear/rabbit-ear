/**
 * Rabbit Ear (c) Robby Kraft
 */
import get_splice_indices from "./get_splice_indices";
const empty_fn = () => true;
const overflow_protection = () => ({ count: 0 })
/**
 * @description given a +1/-1 face relationship matrix, find all
 * valid possible layers_face arrangements.
 * @param {number[][]} +1/-1 face relationship matrix
 * @param not required (initialized during recursion)
 * @param not required (initialized during recursion)
 * @param {function} a test function that runs on all layer orders as they
 * are being built recursivly, as a way of filtering out the large set.
 * @returns
 */
const matrix_to_layers = (matrix, faces, layers_face = [], test_fn = empty_fn, overflow = overflow_protection()) => {
  // for the first time running this recursive method, user is allowed to leave
  // out "faces", and it will be built from the keys of the matrix.
  if (!faces) { faces = Object.keys(matrix); }
  overflow.count++;
  if (overflow.count > 10000) {
    console.warn("matrix_to_layers overflow protection");
    return [];
  }
  const next_face = faces[0];
  if (next_face === undefined) { return [layers_face]; }
  // convert every face in the current layer stack to a "1" or "-1",
  // indicating this new face's relationship to that layer's face.
  const layers_face_relative = layers_face
    .map(face => matrix[next_face][face]);
  // find the lowest "-1" and the highest "1", all valid places
  // for this face will be the layers between these two.
  const splice_indices = get_splice_indices(layers_face_relative);
  // prepare next recursion, duplicate in memory the layer_face so that
  // future recursive calls aren't modifying the same memory location
  const layer_permutations = splice_indices.map(() => layers_face.slice());
  // splice in this face into each permutation at the valid index location
  layer_permutations.forEach((layers, i) => layers
    .splice(splice_indices[i], 0, next_face));
  // filter out the permutations which violate taco-taco intersection
  // test layer for self-intersections
  return layer_permutations
    .filter(test_fn)
    .map(layers => matrix_to_layers(matrix, faces.slice(1), layers, test_fn, overflow))
    .reduce((a, b) => a.concat(b), []);
};

export default matrix_to_layers;
