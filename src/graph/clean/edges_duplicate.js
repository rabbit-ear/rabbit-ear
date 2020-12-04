/**
 * Rabbit Ear (c) Robby Kraft
 */

/**
 * an edge is considered to be a duplicate of another edge if they both contain
 * the same vertices indices in their edges_vertices.
 * order is not important. [5,9] and [9,5] are still duplicate.
 *
 * @param {object} a FOLD object
 * @returns {number[]} an array where indices are duplicate edge indices, and
 * the values are the edges they become "merged" into, the edge that persists.
 */
const get_duplicate_edges = ({ edges_vertices }) => {
  if (!edges_vertices) { return []; }
  const duplicates = [];
  const map = {};
  for (let i = 0; i < edges_vertices.length; i += 1) {
    // we need to store both, but only need to test one
    const a = `${edges_vertices[i][0]} ${edges_vertices[i][1]}`;
    const b = `${edges_vertices[i][1]} ${edges_vertices[i][0]}`;
    if (map[a] !== undefined) { // instead of (map[a] || map[b])
      duplicates[i] = map[a];
    } else {
      // only update the map. if an edge exists as two vertices, it will only
      // be set once, this prevents chains of duplicate relationships where
      // A points to B points to C points to D...
      map[a] = i;
      map[b] = i;
    }
  }
  return duplicates;
};

export default get_duplicate_edges;
