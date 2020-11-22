/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import { get_graph_keys_with_prefix } from "./fold_spec";
import merge_vertices from "./vertices_duplicate/merge";
import get_duplicate_edges from "./edges_duplicate";
import remove from "./remove";
import { make_edges_span } from "./make";

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
/**
 * the trivial case is sorting points horizontally (along the vector [1,0])
 * this generalizes this. sort an array of points along any direction.
 */
const sortVertexIndicesAlongVector = ({ vertices_coords }, indices, vector) => indices
  .map(i => ({
    i,
    d: math.core.dot(vertices_coords[i], vector[0])
    // d: vertices_coords[i][0] * vector[0] + vertices_coords[i][1] * vector[1]
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
 * this method compares every edge against every edge (n^2) to see if the
 * segments exclusively intersect each other (touching endpoints doesn't count)
 *
 * @returns a list for each edge containing the intersection points
 * 0 [ [0.25, 0.125] ]
 * 1 [ [0.25, 0.125], [0.99, 0.88] ]  // will become 3 segments
 * 2 [ ]  // will be unchanged.
 * 3 [ [0.99, 0.88] ]  // will become 2 segments
 *
 * if two edges end at the same endpoint this DOES NOT consider them touching
 *
 * VERY IMPORTANT DETAIL, because each intersection (xy point object) is placed in
 * two locations in the array, under both edges, it doesn't copy the object
 * as Javascript objects are stored by reference. this may or may not work to your
 * benefit. one advantage is that all intersections can easily be visited only once.
 * you can modify the object and mark a point as done.
 */
// if you provide edges_vector, edges_origin you don't need the other graph params.
const make_edges_edges_intersections = function (
  { vertices_coords, edges_vertices, edges_vector, edges_origin },
  epsilon = math.core.EPSILON
) {
  if (!edges_vector) {
    edges_vector = edges_vertices
      .map(ev => ev.map(v => vertices_coords[v]))
      .map(e => math.core.subtract(e[1], e[0]));
      // .map(e => [e[1][0] - e[0][0], e[1][1] - e[0][1]]);
  }
  if (!edges_origin) {
    edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
  }
  // this method builds an NxN matrix of comparisons, where each
  // intersection gets stored in 2 places, under both edges.
  // this intersection data is the SAME OBJECT. Javascript objects
  // are stored by reference. this is by design, and is used to the
  // larger algorithm's advantage.
  //
  //     0  1  2  3
  // 0 [  , x,  ,  ]
  // 1 [ x,  ,  , x]
  // 2 [  ,  ,  ,  ]
  // 3 [  , x,  ,  ]
  //
  // showing crossings between 0 and 1, and 1 and 3.
  // because the lower triangle is duplicate info, only store one half

  // allow for javascript arrays with holes
  // [{vec}, empty, {vec}, {vec}, empty, {vec}]
  const edges_intersections = edges_vector.map(() => []);

  const span = make_edges_span({ vertices_coords, edges_vertices }, epsilon);

  for (let i = 0; i < edges_vector.length - 1; i += 1) {
    for (let j = i + 1; j < edges_vector.length; j += 1) {
      if (span[i][j] !== true) { continue; }
      edges_intersections[i][j] = math.core.intersect_lines(
        edges_vector[i],
        edges_origin[i],
        edges_vector[j],
        edges_origin[j],
        math.core.exclude_s,
        math.core.exclude_s,
        epsilon
      );
      edges_intersections[j][i] = edges_intersections[i][j];
    }
  }
  return edges_intersections;
};

/**
 * edges_collinear_vertices is a list of lists where for every edge there is a
 * list filled with vertices that lies collinear to the edge, where
 * collinearity only counts if the vertex lies between the edge's endpoints,
 * excluding the endpoints themselves.
 * 
 * this is useful when an edge and its two vertices are added to a planar graph
 *
 * this method will inspect the new edge(s) endpoints for the specific
 * case that they lie collinear along an existing edge.
 * (we need to compare the new vertices against every edge)
 *
 * the intended result is the other edge should be split into two.
 *
 * this method will simply return an Array() size matched to the edges_
 * arrays, with mostly empty contents, but in the case of a collinear
 * vertex, this index in the array will contain that vertex's index.
 */
const make_edges_collinear_vertices = function (
  { vertices_coords, edges_vertices, edges_coords },
  epsilon = math.core.EPSILON
) {
  if (!edges_coords) {
    edges_coords = edges_vertices
      .map(ev => ev.map(v => vertices_coords[v]));
  }
  const vc_indices = vertices_coords.map((_, i) => i);
  return edges_coords
    .map(e => vc_indices
      .filter(i => math.core.point_on_segment_exclusive(
        vertices_coords[i], e[0], e[1], epsilon
      )))
  // as of now, an edge can contain its own vertices as collinear.
  // need to remove these.
  // todo: is there a better way? when we build the array originally?
    .map((cv, i) => cv
      .filter(vi => edges_vertices[i].indexOf(vi) === -1));
};

const fragment_graph = (graph, epsilon = math.core.EPSILON) => {
  const edges_coords = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]));
  // when we rebuild an edge we need the intersection points sorted
  // so we can walk down it and rebuild one by one. sort along vector
  const edges_vector = edges_coords
    .map(e => math.core.subtract(e[1], e[0]));
  const edges_origin = edges_coords
    .map(e => e[0]);

  // for each edge, get all the intersection points
  // this array will match edges_, each an array containing intersection
  // points (an [x,y] array), with an important detail, because each edge
  // intersects with another edge, this [x,y] point is a shallow pointer
  // to the same one in the other edge's intersection array.
  const edges_intersections = make_edges_edges_intersections({
    vertices_coords: graph.vertices_coords,
    edges_vertices: graph.edges_vertices,
    edges_vector,
    edges_origin
  }, 1e-6);

  // check the new edges' vertices against every edge, in case
  // one of the endpoints lies along an edge.
  const edges_collinear_vertices = make_edges_collinear_vertices({
    vertices_coords: graph.vertices_coords,
    edges_vertices: graph.edges_vertices,
    edges_coords
  }, epsilon);

  // remember, edges_intersections contains intersections [x,y] points
  // each one appears twice (both edges that intersect) and is the same
  // object, shallow pointer.
  //
  // iterate over this list and move each vertex into new_vertices_coords.
  // in their place put the index of this new vertex in the new array.
  // when we get to the second appearance of the same point, it will have
  // been replaced with the index, so we can skip it. (check length of
  // item, 2=point, 1=index)
  if (edges_intersections
    .reduce((a, b) => a.concat(b), [])
    .filter(a => a !== undefined).length === 0) {
    return;
  }

  // add new vertices (intersection points) to the graph
  edges_intersections
    .forEach(edge => edge
      .filter(a => a !== undefined)
      .filter(a => a.length === 2)
      .forEach((intersect) => {
        const newIndex = graph.vertices_coords.length;
        graph.vertices_coords.push([...intersect]);
        intersect.splice(0, 2);
        intersect.push(newIndex);
      }));
  // replace arrays with indices
  edges_intersections.forEach((edge, i) => {
    edge.forEach((intersect, j) => {
      if (intersect) {
        edges_intersections[i][j] = intersect[0];
      }
    })
  });

  const edges_intersections_flat = edges_intersections
    .map(arr => arr.filter(a => a !== undefined));

  graph.edges_vertices.forEach((verts, i) => verts
    .push(...edges_intersections_flat[i], ...edges_collinear_vertices[i]));
    // .push(...edges_intersections_flat[i]));

  graph.edges_vertices.forEach((edge, i) => {
    graph.edges_vertices[i] = sortVertexIndicesAlongVector({ vertices_coords: graph.vertices_coords }, edge, edges_vector[i]);
  })

  // edge_map is length edges_vertices in the new, fragmented graph.
  // the value at each index is the edge that this edge was formed from.
  const edge_map = graph.edges_vertices
    .map((edge, i) => Array(edge.length - 1).fill(i))
    .reduce((a, b) => a.concat(b), []);

  graph.edges_vertices = graph.edges_vertices
    .map(edge => Array.from(Array(edge.length - 1))
      .map((_, i, arr) => [edge[i], edge[i + 1]]))
    .reduce((a, b) => a.concat(b), []);
  // copy over edge metadata if it exists
  if (graph.edges_assignment) {
    graph.edges_assignment = edge_map.map(i => graph.edges_assignment[i] || "U");
  }
  if (graph.edges_foldAngle) {
    graph.edges_foldAngle = edge_map.map(i => graph.edges_foldAngle[i] || 0);
  }
  return graph;
};


const fragment = (graph, epsilon = math.core.EPSILON) => {
  // copy vertices, and project all vertices onto the XY plane
  graph.vertices_coords = graph.vertices_coords
    .map(coord => coord.slice(0, 2));
  // const edges_vertices = graph.edges_vertices.map(ev => ev.slice());
  delete graph.vertices_vertices;
  delete graph.vertices_edges;
  delete graph.vertices_faces;
  delete graph.edges_edges;
  delete graph.edges_faces;
  delete graph.faces_vertices;
  delete graph.faces_edges;
  delete graph.faces_faces;

  // merge duplicate vertices
  // const new_graph = {
  //   vertices_coords,
  //   edges_vertices,
  // };

  for (var i = 0; i < 100; i++) {
    const res = fragment_graph(graph, epsilon);
    if (res === undefined) { break; }
    merge_vertices(graph, epsilon / 2);
    remove(graph, "edges", get_duplicate_edges(graph));
  }

  // Object.keys(graph).forEach(key => delete graph[key]);
  // Object.assign(graph, new_graph);
  // return edge_map;
};

export default fragment;
