import {
  vertices_count,
  edges_count,
  faces_count,
} from "./query";


const diff_template = {
  vertices: {
    new: [22, 23, 24], // indices in final array
    removed: [5, 2, 3], // indices in pre array
    map: [0, 0, 0, 0, 0, -1, -1, -1, -1, -1]
  },
  edges: {
    new: [
      { index: 11, _vertices: [1, 5], _faces: [5], _assignment: "M" },
      { index: 12, _vertices: [5, 8], _faces: [7], _assignment: "M" }
    ],
    new_vertices: [[1, 5], [5, 7], [0, 3], [11, 12], [12, 13]],
    new_faces: [[1, 5], [5, 7], [0, 3], [11, 12], [12, 13]],
    new_replace: [2, 2, null, 8, 8], // indices in pre array
    removed: [5, 2, 3], // indices in pre array
    map: [0, 0, 0, 0, 0, -1, -1, -1, -1, -1]
  },
  faces: {
    map: [0, 0]
  }
};


export const apply_diff_map = function (diff_map, array) {
  // an array whose value is the new index it will end up
  let index_map = diff_map.map((change,i) => i + change);
  // gather the removed element indices, remove them from index_map
  Array.from(Array(diff_map.length-1))
    .map((change, i) => diff_map[i] !== diff_map[(i+1)%diff_map.length])
    .map((remove, i) => remove ? i : undefined)
    .filter(a => a !== undefined)
    .forEach(i => delete index_map[i]);
  // fill the new array using index_map
  let new_array = [];
  index_map.forEach((newI, oldI) => new_array[newI] = array[oldI]);
  return new_array;
};

export const merge_maps = function (a, b) {
  // "a" came first
  let aRemoves = [];
  for (let i = 1; i < a.length; i++) {
    if (a[i] !== a[i-1]) { aRemoves.push(i); }
  }
  let bRemoves = [];
  for (let i = 1; i < b.length; i++) {
    if (b[i] !== b[i-1]) { bRemoves.push(i); }
  }
  let bCopy = b.slice();
  aRemoves.forEach(i => bCopy.splice(i, 0, (i === 0) ? 0 : bCopy[i-1] ));

  return a.map((v,i) => v + bCopy[i]);
};

export const diff_new_v = function (graph, newVertex) {
  let i = vertices_count(graph);
  Object.keys(newVertex).forEach(suffix => {
    let key = "vertices_" + suffix;
    // console.log("setting " + key + " at " + i + " with " + newVertex[suffix]);
    graph[key][i] = newVertex[suffix];
    if (newVertex[suffix] == null) {
      console.log("ERROR NEW VERTEX");
      console.log(key);
      console.log(i);
      console.log(graph[key]);
    }
  });
  return i;
};

export const diff_new_e = function (graph, newEdge) {
  let i = edges_count(graph);
  Object.keys(newEdge).forEach(suffix => {
    let key = "edges_" + suffix;
    console.log("setting " + key + " at " + i + " with " + newEdge[suffix]);
    graph[key][i] = newEdge[suffix];
    if (newEdge[suffix] == null) {
      console.log("ERROR new edge");
      console.log(key);
      console.log(i);
      console.log(graph[key]);
    }
  });
  return i;
};

export const diff_new_f = function (graph, newFace) {
  let i = faces_count(graph);
  Object.keys(newFace).forEach(suffix => {
    let key = "faces_" + suffix;
    // console.log("setting " + key + " at " + i + " with " + newFace[suffix]);
    graph[key][i] = newFace[suffix];
    if (newFace[suffix] == null) {
      console.log("ERROR new face");
      console.log(key);
      console.log(i);
      console.log(graph[key]);
    }
  });
  return i;
};

export const join_diff = function (a, b) {
  let c = {};
  if (a.vertices != null || b.vertices != null) {
    if (a.vertices == null) { a.vertices = {}; }
    if (b.vertices == null) { b.vertices = {}; }
    if (a.vertices.new == null) { a.vertices.new = []; }
    if (b.vertices.new == null) { b.vertices.new = []; }
    c.vertices = {};
    c.vertices.new = a.vertices.new.concat(b.vertices.new);
  }

  if (a.edges != null || b.edges != null) {
    if (a.edges == null) { a.edges = {}; }
    if (b.edges == null) { b.edges = {}; }
    if (a.edges.new == null) { a.edges.new = []; }
    if (b.edges.new == null) { b.edges.new = []; }
    c.edges = {};
    c.edges.new = a.edges.new.concat(b.edges.new);

    if (a.edges.replace == null) { a.edges.replace = []; }
    if (b.edges.replace == null) { b.edges.replace = []; }
    c.edges = {};
    c.edges.replace = a.edges.replace.concat(b.edges.replace);
  }

  if (a.faces != null || b.faces != null) {
    if (a.faces == null) { a.faces = {}; }
    if (b.faces == null) { b.faces = {}; }

    if (a.faces.replace == null) { a.faces.replace = []; }
    if (b.faces.replace == null) { b.faces.replace = []; }
    c.faces = {};
    c.faces.replace = a.faces.replace.concat(b.faces.replace);
  }
  return c;
};

export const apply_diff = function (graph, diff) {

  let remove_vertices = [];
  let remove_edges = [];
  let remove_faces = [];
  // should we remove all parts at the end of everything?
  if (diff.vertices != null) {
    if (diff.vertices.new != null) {
      diff.vertices.new.forEach(el => diff_new_v(graph, el))
    }
  }
  if (diff.edges != null) {
    if (diff.edges.replace != null) {
      diff.edges.replace.forEach(el => {
        // let oldAssignment = graph.edges_assignment[el.old_index];
        // el.new
        //  .filter(e => e.edges_assignment == null)
        //  .forEach(e => e.assignment = oldAssignment);
        el.new.forEach(newEdge => {
          let index = diff_new_e(graph, newEdge);
          // check the standard keys and infer any that were left out
          // ["vertices", "faces", "assignment", "foldAngle", "length"]
          // let allKeys = ["faces", "assignment"];
          let allKeys = ["foldAngle", "assignment", "faces"];
          allKeys.filter(suffix => newEdge[suffix] == null)
            .forEach(suffix => {
              let key = "edges_" + suffix;
              graph[key][index] = graph[key][el.old_index];
            });
          let e_coords = graph["edges_vertices"][index]
            .map(v => graph.vertices_coords[v]);
          let dX = e_coords[0][0]-e_coords[1][0];
          let dY = e_coords[0][1]-e_coords[1][1];
          let distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
          graph["edges_length"][index] = distance;
        })
      });
      remove_edges = remove_edges
        .concat(diff.edges.replace.map(el => el.old_index));
    }
    if (diff.edges.new != null) {
      diff.edges.new.forEach(el => {
        let index = diff_new_e(graph, el);
        // do the thing again. from above. infer left out things
        if (graph["edges_foldAngle"][index] == null) {
          graph["edges_foldAngle"][index] = 0;
        }
        if (graph["edges_assignment"][index] == null) {
          graph["edges_assignment"][index] = "F";
        }
        if (graph["edges_length"][index] == null) {
          graph["edges_length"][index] = 0;
          let e_coords = graph["edges_vertices"][index]
            .map(v => graph.vertices_coords[v]);
          let dX = e_coords[0][0]-e_coords[1][0];
          let dY = e_coords[0][1]-e_coords[1][1];
          let distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
          graph["edges_length"][index] = distance;
        }
        if (graph["edges_faces"][index] == null) {
          // something
        }
        if (graph["edges_vertices"][index] == null) {
          // something. maybe return something and say we need this
        }
      });
    }
  }
  if (diff.faces != null) {
    if (diff.faces.replace != null) {
      diff.faces.replace.forEach(el => {
        el.new.forEach(newFace => {
          let index = diff_new_f(graph, newFace);
          // check the standard keys and infer any that were left out
          // copyable attributes from the old values
          // with faces, there are none
          // let allKeys = ["vertices", "edges"];
          // allKeys.filter(suffix => newFace[suffix] == null)
          //  .forEach(suffix => {
          //    let key = "faces_" + suffix;
          //    graph[key][index] = graph[key][el.old_index];
          //  });
        })
      });
      remove_faces = remove_faces
        .concat(diff.faces.replace.map(el => el.old_index));
    }
  }

  return {
    vertices: remove_vertices,
    edges: remove_edges,
    faces: remove_faces
  };

};
