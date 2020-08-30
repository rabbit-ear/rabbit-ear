/**
 * an edge is considered to be a duplicate of another edge if they both contain
 * the same vertices indices in their edges_vertices.
 * order is not important. [5,9] and [9,5] are still duplicate.
 *
 * @param {object} a FOLD object
 * @returns {number[]} an array of indices of edges that are duplicated
 * somewhere else in the graph.
 */
const get_duplicate_edges = (graph) => {
  if (!graph.edges_vertices) { return []; }
  const duplicates = [];
  const map = {};
  for (let i = 0; i < graph.edges_vertices.length; i += 1) {
    // we need to store both, but only need to test one
    const a = `${graph.edges_vertices[i][0]} ${graph.edges_vertices[i][1]}`;
    const b = `${graph.edges_vertices[i][1]} ${graph.edges_vertices[i][0]}`;
    if (map[a]) { // instead of (map[a] || map[b])
      duplicates.push(i);
    } else {
      map[a] = true;
      map[b] = true;
    }
  }
  return duplicates;
};

export default get_duplicate_edges;
