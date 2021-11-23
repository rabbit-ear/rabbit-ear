/**
 * @param {number[][]} matrix of relationships between faces.
 * @param {number} from. index of face. will be "above/below" the "to" face.
 * @param {number} to. index of face. the other face in the comparison.
 * @param {number} 1 or -1. there are two ways to walk through the faces,
 *  either always down or always up. 1 means walking down because
 *  face "from" will be set to be above face "to".
 * @returns {undefined} nothing. "matrix" is modified in place.
 */
const walk_pleat_path = (matrix, from, to, direction, visited = {}) => {
  const visited_key = `${from} ${to}`;
  if (visited[visited_key]) { return; }
  visited[visited_key] = true;
  // set matrix for both directions between face pair
  matrix[from][to] = direction;
  matrix[to][from] = -direction;
  // gather the next iteration's indices, recurse.
  matrix[to]
    .map((dir, index) => dir === direction ? index : undefined)
    .filter(a => a !== undefined)
    .map(index => walk_pleat_path(matrix, from, index, direction, visited));
};

export default walk_pleat_path;
