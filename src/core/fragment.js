/**
 * Fragment converts a graph into a planar graph. it flattens all the
 * coordinates onto the 2D plane.
 *
 * it modifies edges and vertices. splitting overlapping edges
 * at their intersections, merging vertices that lie too near to one another.
 * # of edges may increase. # of vertices may decrease. (is that for sure?)
 *
 * This function requires an epsilon (1e-6), for example a busy
 * edge crossing should be able to resolve to one point
 *
 * 1. merge vertices that are within the epsilon.
 *
 * 2. gather all intersections, for every line.
 *    for example, the first line in the list gets compared to other lines
 *    resulting in a list of intersection points,
 *
 * 3. replace the edge with a new, rebuilt, sequence of edges, with
 *    new vertices.
 */

import math from "../math";
import { get_graph_keys_with_prefix } from "./keys";
import {
  make_edges_edges_intersections,
  make_edges_collinear_vertices,
} from "./make";
import mergeDuplicateVertices from "./vertices_duplicate/merge";

/**
 * the trivial case is sorting points horizontally (along the vector [1,0])
 * this generalizes this. sort an array of points along any direction.
 */
const sortVertexIndicesAlongVector = (graph, indices, vector) => indices
  .map(i => ({
    i,
    d: graph.vertices_coords[i][0] * vector[0] + graph.vertices_coords[i][1] * vector[1]
  }))
  .sort((a, b) => a.d - b.d)
  .map(a => a.i);

const getUniqueVerticesIndicesFromEdges = ({ edges_vertices }, edges_indices) => {
  const nonunique = edges_indices
    .map(e => edges_vertices[e])
    .reduce((a, b) => a.concat(b), [])
    .sort((a, b) => a - b);
  const uniqueVertices = nonunique.length ? [nonunique[0]] : [];
  for (let i = 1; i < nonunique.length; i += 1) {
    if (nonunique[i] !== nonunique[i - 1]) {
      uniqueVertices.push(nonunique[i]);
    }
  }
  return uniqueVertices;
};

/**
 * new fragment function will operate on a subset of the graph.
 * specify the new edges, this will compute a Euclidean intersection
 * against all the other graph edges to limit the edges and vertices.
 */
const fragment = function (
  graph,
  epsilon = math.core.EPSILON,
  unset_edges_indices = undefined,
) {
  delete graph.faces_vertices;
  delete graph.faces_edges;
  delete graph.faces_faces;
  delete graph.edges_edges;
  delete graph.edges_faces;
  delete graph.edges_length;
  delete graph.vertices_faces;
  delete graph.vertices_edges;
  // this is required for both new and old vertices.
  // new edges may have been added whose endpoints match another existing
  // vertex. additionally, if the graph is already planar but the epsilon
  // has increased this time around, we need to merge vertices before
  // anything else.
  mergeDuplicateVertices(graph, epsilon);
  // at this point, the length of the vertex array may have changed.
  // however, the length of the edges array will be the same.
  // though the contents of edges_vertices might have changed due to
  // vertices being merged.
  if (unset_edges_indices === undefined) {
    unset_edges_indices = graph.edges_vertices.map((_, i) => i);
  }
  // these new edges contain vertices which could be sitting collinear
  // along an existing edge
  const unset_vertices_indices = getUniqueVerticesIndicesFromEdges(
    graph, unset_edges_indices
  );
  const edges_coords = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]));
  // when we rebuild an edge we need the intersection points sorted
  // so we can walk down it and rebuild one by one. sort along vector
  const edges_vector = edges_coords
    .map(e => [e[1][0] - e[0][0], e[1][1] - e[0][1]]);
  const edges_origin = edges_coords
    .map(e => e[0]);

  // for each edge, get all the intersection points
  // this array will match edges_, each an array containing intersection
  // points (an [x,y] array), with an important detail, because each edge
  // intersects with another edge, this [x,y] point is a shallow pointer
  // to the same one in the other edge's intersection array.
  const edges_intersections = make_edges_edges_intersections({ edges_vector, edges_origin }, 1e-6);

  // check the new edges' vertices against every edge, in case
  // one of the endpoints lies along an edge.
  const edges_collinear_vertices = make_edges_collinear_vertices({
    vertices_coords: graph.vertices_coords,
    edges_vertices: graph.edges_vertices,
    edges_coords
  }, unset_vertices_indices, epsilon);

  // remember, edges_intersections contains intersections [x,y] points
  // each one appears twice (both edges that intersect) and is the same
  // object, shallow pointer.
  //
  // iterate over this list and move each vertex into new_vertices_coords.
  // in their place put the index of this new vertex in the new array.
  // when we get to the second appearance of the same point, it will have
  // been replaced with the index, so we can skip it. (check length of
  // item, 2=point, 1=index)
  const new_vertices_coords = [];
  // add new vertices (intersection points) to the graph
  edges_intersections.forEach(edge => edge
    .forEach((intersect) => {
      if (intersect.length === 2) {
        const newIndex = graph.vertices_coords.length + new_vertices_coords.length;
        new_vertices_coords.push([...intersect]);
        intersect.splice(0, intersect.length);
        intersect.push(newIndex);
      }
    }));

  // remove holes from edges_intersections
  const edges_new_intersection_vertex_indices = edges_intersections
    .map(arr => arr
      .filter(() => true)
      .reduce((c, d) => c.concat(d), []));

  // modify graph
  // add new intersection points to the vertices_coords array
  new_vertices_coords.forEach(coords => graph.vertices_coords.push(coords));

  // 2 things
  // for every edge, join together collinear + new intersection points
  // then, sort the new points along the edge_vector direction
  const sorted_added_edges_vertices = edges_new_intersection_vertex_indices
    .map((a, i) => a.concat(edges_collinear_vertices[i]))
    .map((verts, i) => sortVertexIndicesAlongVector(graph, verts, edges_vector[i]));

  // edges_with_added_vertices is an expanded form of
  // sorted_added_edges_vertices, but with the original endpoints added
  // along either side. each edge will look something like
  // [2, 53, 59, 41, 3] where [2, 3] was the original edge.
  const edges_with_added_vertices = [];
  sorted_added_edges_vertices.forEach((new_verts, i) => {
    if (new_verts.length) {
      edges_with_added_vertices[i] = [graph.edges_vertices[i][0]]
        .concat(new_verts)
        .concat([graph.edges_vertices[i][1]]);
    }
  });

  // new edges_vertices are currently in this form: [2, 53, 59, 41, 3]
  // leave in place the first pair ([2, 53]), and for every additional
  // pair create a new entry for the edge in new_edges_vertices
  const new_edges_vertices = [];
  const new_edges_prev_index = [];
  edges_with_added_vertices.forEach((verts, i) => {
    for (let j = 2; j < verts.length; j += 1) {
      new_edges_vertices.push([verts[j - 1], verts[j]]);
      new_edges_prev_index.push(i);
    }
    verts.splice(2, verts.length - 2);
  });
  // at this point, new edge definitions are spread across in 2 places.
  // (1) edges_with_added_vertices, the first portion of the new edge
  // (2) new_edges_vertices, all the additional parts of each new edge

  // update (1) the first portion of the new edges
  edges_with_added_vertices.forEach((ev, i) => {
    graph.edges_vertices[i] = ev;
  });

  // before we add new edges, bring along any other definitions from the
  // other flat arrays, like edges_foldAngle, edges_assignment.
  // these get copied (shallow copy) to the new index.
  // todo this might become a problem with objects, not strings or numbers.
  const edges_keys = get_graph_keys_with_prefix(graph, "edges")
    .filter(a => a !== "edges_vertices");
  // update (2) the new edges from new_edges_vertices, along with their
  // additional edges_ keys
  const edges_length = graph.edges_vertices.length;
  new_edges_vertices.forEach((ev, i) => {
    const newI = i + edges_length;
    const refI = new_edges_prev_index[i];
    graph.edges_vertices[newI] = ev;
    // todo, this is a shallow copy if the element is an array.
    edges_keys.forEach((key) => { graph[key][newI] = graph[key][refI]; });
  });
  mergeDuplicateVertices(graph, epsilon);
};

export default fragment;
