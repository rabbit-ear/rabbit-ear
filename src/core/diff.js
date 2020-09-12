const Diff = {};

import count from "./count";
import remove from "../core/remove";

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

// everything in "new" and "remove" are 0-indexed array. excempt is "update"
const final_draft = {
  new: { vertices: [], edges: [], faces: [] },
  remove: { vertices: [], edges: [4, 7], faces: [] }, // indices, not elements
  update: [ // dimension of array matches graph
    // empty x 5
    { edges_vertices: [5, 6], vertices_vertices: [4, 1] },
    // empty x 2
    { vertices_vertices: [0, 4] }
  ]
};

// everything in "new" and "remove" are 0-indexed array. excempt is "update"
const final_draft_2 = {
  new: { vertices: [], edges: [], faces: [] },
  remove: { vertices: [], edges: [4, 7], faces: [] },
  update: {
    vertices_vertices: {
      5: [4, 1], // keys in object indicates array indices
      8: [0, 4]
    },
    edges_vertices: {
      5: [5, 6]
    }
  }
};

// delete the middle of arrays using "delete"... compress at the end

const rough_draft_1 = {
  vertices: { new: [], update: [], remove: [] },
  edges: { new: [], update: [], remove: [] },
  faces: { new: [], update: [], remove: [] }
};

// each of the { new } entries come with an index
// which will change during this function, if { remove } entries exist
Diff.apply = (graph, diff) => {
  // this will fill up with { vertices: #, edges: #, faces: # }
  const lengths = {};
  Object.keys(count).forEach((key) => {
    lengths[key] = count[key](graph);
  });
  // for each new geometry type, append new element to the end of their arrays
  if (diff.new) {
    Object.keys(diff.new)
      .forEach(type => diff.new[type]
        .forEach((newElem, i) => Object.keys(newElem)
          .forEach((key) => {
            if (graph[key] === undefined) { graph[key] = []; }
            graph[key][lengths[type] + i] = newElem[key];
            diff.new[type][i].index = lengths[type] + i;
          })));
  }
  // object keys to get the array indices.
  // example: overwrite faces_vertices, index 4, with new array [1,5,7,4]
  if (diff.update) {
    Object.keys(diff.update)
      .forEach(i => Object.keys(diff.update[i])
        .forEach((key) => {
          if (graph[key] === undefined) { graph[key] = []; }
          graph[key][i] = diff.update[i][key];
        }));
  }
  // these should be done in a particular order... is that right?
  if (diff.remove) {
    if (diff.remove.faces) {
      const map = remove(graph, "faces", diff.remove.faces);
      diff.new.faces.forEach((face, i) => {
        diff.new.faces[i].index += map[face.index];
      });
    }
    if (diff.remove.edges) {
      const map = remove(graph, "edges", diff.remove.edges);
      diff.new.edges.forEach((edge, i) => {
        diff.new.edges[i].index += map[edge.index];
      });
    }
    if (diff.remove.vertices) {
      const map = remove(graph, "vertices", diff.remove.vertices);
      diff.new.vertices.forEach((vertex, i) => {
        diff.new.vertices[i].index += map[vertex.index];
      });
    }
  }
  return diff;
};


/**
 * NEVERMIND - this DOES modify target. Object.assign
 *
 * source is merged into target, but not in the memory sense, neither of
 * the arguments are modified in place, it only returns a copy.
 */
Diff.merge = (graph, target, source) => {
  const vertices_length = vertices_count(graph);
  const edges_length = edges_count(graph);
  const faces_length = faces_count(graph);

  // each diff was built expecting new geometry to be appended right at
  // the end of the old arrays. this is not the case if target is going to
  // merge before it.
  let target_new_vertices_length = 0;
  let target_new_edges_length = 0;
  let target_new_faces_length = 0;

  if (target.new !== undefined) {
    if (target.new.vertices !== undefined) {
      target_new_vertices_length = target.new.vertices.length;
    }
    if (target.new.edges !== undefined) {
      target_new_edges_length = target.new.edges.length;
    }
    if (target.new.faces !== undefined) {
      target_new_faces_length = target.new.faces.length;
    }
  }

  const augment_map = {
    vertices: {
      length: vertices_length,
      change: target_new_vertices_length
    },
    edges: {
      length: edges_length,
      change: target_new_edges_length
    },
    faces: {
      length: faces_length,
      change: target_new_faces_length
    },
  };

  let all_source = [];
  if (source.new !== undefined) {
    Object.keys(source.new).forEach((category) => {
      // category is either "vertices", "edges", or "faces"
      source.new[category].forEach((newEl, i) => {
        // newEl is something like {vertices_coords: [], vertices_vertices: []}
        // const prefix = `${key}_`;
        ["vertices", "edges", "faces"].forEach((key) => {
          const suffix = `_${key}`;
          // get all keys like vertices_coords
          const suffixKeys = Object.keys(newEl)
            .map(str => (str.substring(str.length - suffix.length, str.length) === suffix
              ? str
              : undefined))
            .filter(str => str !== undefined);
          suffixKeys.forEach((suffixKey) => {
            source.new[category][i][suffixKey].forEach((n, j) => {
              if (source.new[category][i][suffixKey][j] >= augment_map[category].length) {
                source.new[category][i][suffixKey][j] += augment_map[category].change;
              }
            });
          });
        });
      });
      all_source = all_source.concat(source.new.vertices);
    });
  }
  const merge = {};
  if (target.new !== undefined) { merge.new = target.new; }
  if (target.update !== undefined) { merge.update = target.update; }
  if (target.remove !== undefined) { merge.remove = target.remove; }
  if (source.new !== undefined) {
    if (source.new.vertices !== undefined) {
      if (merge.new.vertices === undefined) { merge.new.vertices = []; }
      merge.new.vertices = merge.new.vertices.concat(source.new.vertices);
    }
    if (source.new.edges !== undefined) {
      if (merge.new.edges === undefined) { merge.new.edges = []; }
      merge.new.edges = merge.new.edges.concat(source.new.edges);
    }
    if (source.new.faces !== undefined) {
      if (merge.new.faces === undefined) { merge.new.faces = []; }
      merge.new.faces = merge.new.faces.concat(source.new.faces);
    }
  }

  if (source.update !== undefined) {
    Object.keys(source.update).forEach((i) => {
      if (merge.update[i] == null) {
        merge.update[i] = source.update[i];
      }
      else {
        const keys1 = Object.keys(merge.update[i]);
        const keys2 = Object.keys(source.update[i]);
        const overlap = keys1.filter(key1key => keys2.includes(key1key));
        if (overlap.length > 0) {
          const str = overlap.join(", ");
          console.warn(`cannot merge. two diffs contain overlap at ${str}`);
          return;
        }
        Object.assign(merge.update[i], source.update[i]);
      }
    });
  }
  if (source.remove !== undefined) {
    if (source.remove.vertices !== undefined) {
      if (merge.remove.vertices === undefined) { merge.remove.vertices = []; }
      merge.remove.vertices = merge.remove.vertices.concat(source.remove.vertices);
    }
    if (source.remove.edges !== undefined) {
      if (merge.remove.edges === undefined) { merge.remove.edges = []; }
      merge.remove.edges = merge.remove.edges.concat(source.remove.edges);
    }
    if (source.remove.faces !== undefined) {
      if (merge.remove.faces === undefined) { merge.remove.faces = []; }
      merge.remove.faces = merge.remove.faces.concat(source.remove.faces);
    }
  }
  Object.assign(target, source);
};

export default Diff;

const apply_run_diff_draft_1 = function (graph, diff) {
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

  remove(graph, "faces", diff.faces.remove);
  remove(graph, "edges", diff.edges.remove);
  remove(graph, "vertices", diff.vertices.remove);
};
