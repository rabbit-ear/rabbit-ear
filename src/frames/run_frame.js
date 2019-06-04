import {
  vertices_count,
  edges_count,
  faces_count,
} from "../graph/query";

import {
  remove_vertices,
  remove_edges,
  remove_faces
} from "../graph/remove";

// ///////////////////////////////////////
// new diff sketches
// vertices_coords
// const diff_template = {
//   vertices: {
//     new: [22, 23, 24], // indices in final array
//     removed: [5, 2, 3], // indices in pre array
//     map: [0, 0, 0, 0, 0, -1, -1, -1, -1, -1]
//   },
//   edges: {
//     new: [14, 15, 16, 17, 18], // indices in final array
//     new_vertices: [[1, 5], [5, 7], [0, 3], [11, 12], [12, 13]],
//     new_faces: [[1, 5], [5, 7], [0, 3], [11, 12], [12, 13]],
//     new_replace: [2, 2, null, 8, 8], // indices in pre array
//     removed: [5, 2, 3], // indices in pre array
//     map: [0, 0, 0, 0, 0, -1, -1, -1, -1, -1]
//   },
//   faces: {
//     map: [0, 0]
//   }
// };

const draft1 = {
  vertices: { new: [], update: [], remove: [] },
  edges: { new: [], update: [], remove: [4] },
  faces: { new: [], update: [], remove: [] }
};

// everything in "new" and "remove" are 0-indexed array. excempt is "update"
const draft2 = {
  new: { vertices: [], edges: [], faces: [] },
  remove: { vertices: [], edges: [4], faces: [] },
  update: [ // dimension of array matches graph
    // empty x 5
    { edges_vertices: [5, 6], vertices_vertices: [4, 1] },
    // empty x 2
    { vertices_vertices: [0, 4] }
  ]
};


export const apply_run_diff = function (graph, diff) {
  const lengths = {
    vertices: graph.vertices_coords.length,
    edges: graph.edges_vertices.length,
    faces: graph.faces_vertices.length
  };
  // for each new geometry type, append new element to the end of their arrays
  Object.keys(diff.new)
    .forEach(type => diff.new[type]
      .forEach((newElem, i) => Object.keys(newElem)
        .forEach((key) => { graph[key][lengths[type] + i] = newElem[key]; })));
  // object keys to get the array indices.
  // example: overwrite faces_vertices, index 4, with new array [1,5,7,4]
  Object.keys(diff.update)
    .forEach(i => Object.keys(diff.update[i])
      .forEach((key) => { graph[key][i] = diff.update[i][key]; }));
  // these should be done in a particular order... is that right?
  if (diff.remove) {
    if (diff.remove.faces) { remove_faces(graph, diff.remove.faces); }
    if (diff.remove.edges) { remove_edges(graph, diff.remove.edges); }
    if (diff.remove.vertices) { remove_vertices(graph, diff.remove.vertices); }
  }
};

export const apply_run_diff_draft_1 = function (graph, diff) {
  const vertices_length = graph.vertices_coords.length;
  const edges_length = graph.edges_vertices.length;
  const faces_length = graph.faces_vertices.length;

  diff.vertices.new
    .forEach((vert, i) => Object.keys(vert, i)
      .forEach((key) => { graph[key][vertices_length + i] = vert[key]; }));
  diff.edges.new
    .forEach((edge, i) => Object.keys(edge, i)
      .forEach((key) => { graph[key][edges_length + i] = edge[key]; }));
  diff.faces.new
    .forEach((face, i) => Object.keys(face, i)
      .forEach((key) => { graph[key][faces_length + i] = face[key]; }));
  // object keys to get the array indices.
  // example: overwrite faces_vertices, index 4, with new array [1,5,7,4]
  Object.keys(diff.vertices.update)
    .forEach(i => Object.keys(diff.vertices.update[i])
      .forEach((key) => { graph[key][i] = diff.vertices.update[i][key]; }));
  Object.keys(diff.edges.update)
    .forEach(i => Object.keys(diff.edges.update[i])
      .forEach((key) => { graph[key][i] = diff.edges.update[i][key]; }));
  Object.keys(diff.faces.update)
    .forEach(i => Object.keys(diff.faces.update[i])
      .forEach((key) => { graph[key][i] = diff.faces.update[i][key]; }));

  remove_faces(graph, diff.faces.remove);
  remove_edges(graph, diff.edges.remove);
  remove_vertices(graph, diff.vertices.remove);
};
