import math from "../../math";
/**
 * @param {object} destination FOLD graph, new vertices will be added to this graph
 * @param {object} source FOLD graph, vertices from here will be added to the other graph
 * @returns {array} index of vertex in new vertices_coords array. matches array size of source vertices.
 */
const add_vertices = (graph, { vertices_coords }) => {
  if (!graph.vertices_coords) { graph.vertices_coords = []; }
  const original_length = graph.vertices_coords.length;
  graph.vertices_coords.push(...vertices_coords);
  return vertices_coords.map((_, i) => original_length + i);
};

export default add_vertices;
