/**
 * Rabbit Ear (c) Robby Kraft
 */
const get_layer_violations = (matrix, faces_layer) => {
  const violations = [];
  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = i + 1; j < matrix[i].length; j++) {
      if (i === j) { continue; }
      const rule = matrix[i][j];
      if (rule === undefined) { continue; }
      const face_direction = Math.sign(faces_layer[i] - faces_layer[j]);
      if (rule !== face_direction) {
        violations.push([i, j, matrix[i][j]]);
      }
    }
  }
  return violations
};

export default get_layer_violations;
