/**
 * Rabbit Ear (c) Robby Kraft
 */

/**
 * an edge is considered circular if both of its edges_vertices are the same.
 *
 * @param {object} a FOLD graph
 * @returns {number[]} array of indices of circular edges. empty array if none.
 */
const get_circular_edges = ({ edges_vertices }) => {
  const circular = [];
  for (let i = 0; i < edges_vertices.length; i += 1) {
    if (edges_vertices[i][0] === edges_vertices[i][1]) {
      circular.push(i);
    }
  }
  return circular;
};

export default get_circular_edges;
