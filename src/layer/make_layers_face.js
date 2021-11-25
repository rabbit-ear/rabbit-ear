import {
  fn_def,
  fn_add
} from "../symbols/functions";
import { invert_map } from "../graph/maps";
import get_layer_violations from "./get_layer_violations";

const fix_layer_violations = (layers_face, matrix) => {
  const faces_layer = invert_map(layers_face);
  const faces_adjust = faces_layer.map(() => []);
  const violations = get_layer_violations(matrix, faces_layer);
  violations.forEach(el => {
    const distance = (faces_layer[el[1]] - faces_layer[el[0]]);
    faces_adjust[el[0]].push(distance);
    faces_adjust[el[1]].push(-distance);
  });
  const layer_change = faces_adjust.map(arr => arr.length === 0
    ? 0
    : parseInt(arr.reduce((a, b) => a + b, 0) / arr.length));
  const new_faces_layer = faces_layer
    .map((layer, i) => layer + layer_change[i]);
  const new_layers_face = new_faces_layer
    .map((layer, face) => ({ layer, face }))
    .sort((a, b) => a.layer - b.layer)
    .map(el => el.face);
  new_layers_face.forEach((_, i) => layers_face[i] = new_layers_face[i]);
  return violations.length;
};

/**
 * works even with "sparse" matrices, containing undefined rows
 */
const make_layers_face = (matrix) => {
  // only consider faces which are contained inside the matrix
  // this allows for Javascript arrays with holes.
  const faces_knowns = matrix.map(row => row.filter(fn_def));
  const face_count = faces_knowns.length;
  const rows_sum = faces_knowns.map(row => row.reduce(fn_add, 0));
  // const faces_layer_approximation = rows_sum
  //   .map(layer => layer + face_count - 1);
  // const faces_layer_certainty = faces_knowns
  //   .map((row, i) => row.length / (face_count - 1));
  // a first guess at layes_face order can be approximated by adding up
  // all of a faces +1 and -1 relationships to other faces. in the case of
  // a fully-saturated matrix, i think this generates the final solution.
  // in non-saturated matrices, it's only an approximation and needs adjustment
  const layers_face = Object.keys(matrix)
    .sort((a, b) => rows_sum[a] - rows_sum[b])
    .map(n => parseInt(n));
  // search for violations between pairs of faces, use these as a guide to
  // swap these faces' layers to bring them closer to their proper index.
  // repeat this swap until done.
  let counter = 0;
  let violation_count = 0; // when this is zero, loop will end
  do {
    violation_count = fix_layer_violations(layers_face, matrix);
    counter++;
  } while (violation_count !== 0 && counter < matrix.length)
  return layers_face;
};

export default make_layers_face;


// const fix_layer_violations_first = (layers_face, matrix) => {
//   const faces_layer = invert_map(layers_face);
//   const violations = get_layer_violations(matrix, faces_layer);

//   const swap_layers = (layer1, layer2) => {
//     const face1 = layers_face[layer1];
//     const face2 = layers_face[layer2];
//     // swap layers
//     const swap_layers_face = layers_face[layer1];
//     layers_face[layer1] = layers_face[layer2];
//     layers_face[layer2] = swap_layers_face;
//     // swap faces
//     const swap_faces_layer = faces_layer[face1];
//     faces_layer[face1] = faces_layer[face2];
//     faces_layer[face2] = swap_faces_layer;
//   };

//   for (let i = 0; i < violations.length; i++) {
//     const face1 = violations[i][0];
//     const face2 = violations[i][1];
//     const direction = violations[i][2];
//     const layer1 = faces_layer[face1];
//     const layer2 = faces_layer[face2];
//     const layer1swap = layer1 + direction;
//     const layer2swap = layer2 - direction;
//     if (Math.abs(layer1 - layer2) === 1) {
//       swap_layers(layer1, layer1swap);
//     } else {
//       swap_layers(layer1, layer1swap);
//       swap_layers(layer2, layer2swap);
//     }
//   }
// };
