import math from "../math";
import { invert_map } from "./maps";
import {
  make_edges_vector,
  make_vertices_coords_folded,
} from "./make";
/**
 * we want to include this case, where one edge may not overlap another
 * but it still gets included because both are overlapped by a common edge.
 * 
 *  |----a-----|    |-------c------|
 *          |-----b----|
 * 
 * "a" and "c" are included together because b causes them to be so.
 */
/**
 * @returns {number[][]} first array is length=#edges, matches edge index
 * each inner array is a list of edges which match
 */
const overlapping_folded_edges = (graph, epsilon) => {
  // use these whenever reference a vertex, the folded state's vertices_coords
  // const vertices_coords = graph.vertices_coords;
  const vertices_coords = make_vertices_coords_folded(graph);
  // use folded vertices_coords for edges vertices
  const vectors = make_edges_vector({
    vertices_coords,
    edges_vertices: graph.edges_vertices
  });
  // use folded vertices_coords for edges vertices
  const origins = graph.edges_vertices.map(verts => vertices_coords[verts[0]]);
  // relationship between i and j is non-directional.
  // only iterate over one half of the triangle, but set the full matrix.
  const matrix = Array
    .from(Array(graph.edges_vertices.length))
    .map(() => []);
  // iterate triangle matrix
  for (let i = 0; i < matrix.length - 1; i++) {
  	for (let j = i + 1; j < matrix.length; j++) {
  		// "overlapping" edges must be both parallel and overlapping
  		let overlapping = math.core.parallel(vectors[i], vectors[j], epsilon);
  		// only if lines are parallel, then run the more expsensive overlap method
  		if (overlapping) {
  			overlapping &= math.core.overlap_line_line(
	        vectors[i], origins[i],
	        vectors[j], origins[j],
	        math.core.include_s, math.core.include_s,
	        epsilon);
  		}
  		matrix[i][j] = overlapping;
  		matrix[j][i] = overlapping;
  	}
  }
  // convert a non-sparse matrix containing true/false/undefined.
  return matrix
    .map(rows => rows
      .map((res, i) => res ? i : undefined)
      .filter(a => a !== undefined));
};

const make_groups_from_matrix = (matrix) => {
  const groups = [];
  const recurse = (index, current_group) => {
    if (groups[index] !== undefined) { return 0; }
    groups[index] = current_group;
    matrix[index].forEach(i => recurse(i, current_group));
    return 1; // increment group # for next round
  }
  for (let row = 0, group = 0; row < matrix.length; row++) {
    group += recurse(row, group);
  }
  return groups;
};
/**
 * @description folds the graph then groups edges into categories if edges
 * overlap and are parallel. groups are only formed for groups of 2 or more.
 * any edges which is isolated in the folded form will be ignored.
 */
const make_folded_groups_edges = (graph, epsilon = math.core.EPSILON) => {
  // gather together all edges which lie on top of one another in the
  // folded state. take each edge's two adjacent faces, 
  const overlapping_edges = overlapping_folded_edges(graph, epsilon);
  // each index will be an edge, each value is a group, starting with 0,
  // incrementing upwards. for all unique edges, array will be [0, 1, 2, 3...]
  // if edges 0 and 3 share a group, array will be [0, 1, 2, 0, 3...]
  const edges_group = make_groups_from_matrix(overlapping_edges);
  // console.log("overlapping_edges", overlapping_edges);
  // console.log("edges_group", edges_group);
  // console.log("groups_edges", invert_map(edges_group));
  // gather groups, but remove groups with only one edge, and from the
  // remaining sets, remove any edges which lie on the boundary.
  // finally, remove sets with only one edge (after removing).
  return invert_map(edges_group)
    .filter(el => typeof el === "object")
    .map(edges => edges
      .filter(edge => graph.edges_faces[edge].length === 2))
    .filter(edges => edges.length > 1);
};

export default make_folded_groups_edges;
