// import { invert_map } from "./maps";
// import { make_edges_vector } from "./make";
// import { make_edges_edges_parallel_overlap } from "./edges_edges";
// import {
//   boolean_matrix_to_indexed_array,
//   make_unique_sets_from_self_relational_arrays,
// } from "../general/arrays";
// /**
//  * we want to include this case, where one edge may not overlap another
//  * but it still gets included because both are overlapped by a common edge.
//  * 
//  *  |----a-----|    |-------c------|
//  *          |-----b----|
//  * 
//  * "a" and "c" are included together because b causes them to be so.
//  */
// /**
//  * @description folds the graph then groups edges into categories if edges
//  * overlap and are parallel. groups are only formed for groups of 2 or more.
//  * any edges which is isolated in the folded form will be ignored.
//  */
// const make_groups_edges = (graph, epsilon) => {
//   // gather together all edges which lie on top of one another in the
//   // folded state. take each edge's two adjacent faces, 
//   const overlap_matrix = make_edges_edges_parallel_overlap(graph, epsilon)
//   const overlapping_edges = boolean_matrix_to_indexed_array(overlap_matrix);
//   // each index will be an edge, each value is a group, starting with 0,
//   // incrementing upwards. for all unique edges, array will be [0, 1, 2, 3...]
//   // if edges 0 and 3 share a group, array will be [0, 1, 2, 0, 3...]
//   const edges_group = make_unique_sets_from_self_relational_arrays(overlapping_edges);
//   // console.log("overlapping_edges", overlapping_edges);
//   // console.log("edges_group", edges_group);
//   // console.log("groups_edges", invert_map(edges_group));
//   // gather groups, but remove groups with only one edge, and from the
//   // remaining sets, remove any edges which lie on the boundary.
//   // finally, remove sets with only one edge (after removing).
//   return invert_map(edges_group)
//     .filter(el => typeof el === "object")
//     .map(edges => edges
//       .filter(edge => graph.edges_faces[edge].length === 2))
//     .filter(edges => edges.length > 1);
// };

// export default make_groups_edges;
