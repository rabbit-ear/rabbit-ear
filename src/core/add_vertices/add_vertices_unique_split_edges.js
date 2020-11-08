import math from "../../math";
import add_vertices from "./add_vertices";
import diff from "../diff";
import { transpose_graph_array_at_index } from "../keys";
import { clone } from "../javascript";
import remove from "../remove";
/**
 * @param {object} destination FOLD graph, new vertices will be added to this graph
 * @param {object} source FOLD graph, vertices from here will be added to the other graph
 * @returns {array} index of vertex in new vertices_coords array. matches array size of source vertices.
 */
const add_vertices_unique_split_edges = (graph, { vertices_coords }) => {
  const new_indices = add_vertices(graph, { vertices_coords });
  // determine if any vertex lies collinear along an edge
  // if so, we must split existing edge at the vertex point
  const edges = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]));

  const vertices_edge_collinear = vertices_coords
    .map(v => edges
      .map(edge => math.core.point_on_segment_exclusive(v, edge[0], edge[1]))
      .map((on_edge, i) => (on_edge ? i : undefined))
      .filter(a => a !== undefined)
      .shift());

  const remove_indices = vertices_edge_collinear
    .filter(vert_edge => vert_edge !== undefined);

  // create new edges: 2 edges for every 1 split edge
  const new_edges = vertices_edge_collinear
    .map((e, i) => ({ e, i }))
    .filter(el => el.e !== undefined)
    .map(el => {
      // new edges will retain old edge's properties (foldAngle, assignment...)
      const edge = transpose_graph_array_at_index(graph, "edges", el.e);
      // return new edges (copy of old edge) with updated edges_vertices
      return [edge, clone(edge)]
        .map((obj, i) => Object.assign(obj, {
          edges_vertices: [ graph.edges_vertices[el.e][i], new_indices[el.i] ]
        }));
    })
    .reduce((a,b) => a.concat(b), []);

  // add new edges to the graph
  diff.apply(graph, { new: { edges: new_edges }});

  // remove edges that have now been split
  remove(graph, "edges", remove_indices);
  return new_indices;
};

export default add_vertices_unique_split_edges;
