/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import split_edge from "./split_edge";
import { merge_maps, reverse_maps } from "../maps";
import { edge_assignment_to_foldAngle } from "../keys";
import remove from "../remove";
import {
  make_vertices_to_edge_bidirectional,
  make_vertices_faces,
  make_edges_faces,
  make_faces_faces,
} from "../make";
import { intersect_face_with_line } from "../intersect";
import { sort_vertices_counter_clockwise } from "../sort";
import { find_adjacent_faces_to_face } from "../find";

const update_vertices_vertices = ({ vertices_coords, vertices_vertices, edges_vertices }, edge) => {
  const v0 = edges_vertices[edge][0];
  const v1 = edges_vertices[edge][1];
  vertices_vertices[v0] = sort_vertices_counter_clockwise({ vertices_coords }, vertices_vertices[v0].concat(v1), v0);
  vertices_vertices[v1] = sort_vertices_counter_clockwise({ vertices_coords }, vertices_vertices[v1].concat(v0), v1);
};

/**
 * the graph is not modified
 * @param {object} FOLD graph
 * @param {number[]} two incident vertices that make up this edge
 * @param {number[]} two edge-adjacent faces to this new edge
 */
const make_edge = ({ vertices_coords }, vertices, faces) => {
  // coords reversed for "vector", so index [0] comes last in subtract
  const new_edge_coords = vertices
    .map(v => vertices_coords[v])
    .reverse();
  return {
    edges_vertices: [...vertices],
    edges_foldAngle: 0,
    edges_assignment: "U",
    edges_length: math.core.distance2(...new_edge_coords),
    edges_vector: math.core.subtract(...new_edge_coords),
    // todo, unclear if these are ordered with respect to the vertices
    edges_faces: [...faces],
  };
};

/**
 * a circular array (data wraps around) needs 2 indices to be split.
 * "indices" will be sorted, smaller index first.
 * @param {any[]} an array that is meant to be thought of as circular
 * @param {number[]} two numbers, indices that divide the array into 2 parts.
 */
const split_circular_array = (array, indices) => {
  indices.sort((a, b) => a - b);
  return [
    array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
    array.slice(indices[0], indices[1] + 1)
  ];
};
/**
 * this must be done AFTER edges_vertices has been updated with the new edge.
 *
 * @param {object} FOLD graph
 * @param {number} the face that will be replaced by these 2 new
 * @param {number[]} vertices (in the face) that split the face into 2 sides
 */
const make_faces = ({ edges_vertices, faces_vertices }, face, vertices) => {
  // table to build faces_edges
  const vertices_to_edge = make_vertices_to_edge_bidirectional({ edges_vertices });
  // inside our face's faces_vertices, get index location of our new vertices
  // this helps us build both faces_vertices and faces_edges arrays
  // update: now only to build faces_vertices. edges comes from a lookup table
  const indices = vertices
    .map(el => faces_vertices[face].indexOf(el));
  return split_circular_array(faces_vertices[face], indices)
    .map(face_vertices => ({
      faces_vertices: face_vertices,
      faces_edges: face_vertices
        .map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
        .map(key => vertices_to_edge[key])
    }));
};

const split_convex_face = (graph, face, vector, origin) => {
  // survey face for any intersections which cross directly over a vertex
  const intersect = intersect_face_with_line(graph, face, vector, origin);
  if (intersect === undefined) { return undefined; }
  // vertices, from "intersect", at the moment only contains pre-existing
  // vertices that were intersected (line directly crossed a vertex)
  // but will soon be appended to contain exactly 2 vertices,
  // by adding any new vertices made by edge intersections
  const vertices = intersect.vertices.map(el => el.vertex);
  // begin modifying the graphy by splitting edges at any intersections,
  // this will change edges' indices. edge_change keeps track of this.
  // let edge_change = Array(graph.edges_vertices.length).fill(0);
  // vertices.push(...intersect.edges.map((el, i, arr) => {
  //   el.edge += edge_change[el.edge];
  //   const result = split_edge(graph, el.edge, el.coords);
  //   // todo, apply directly to edge_change, get rid of "edge_change = "
  //   edge_change = Diff.merge_change_maps(edge_change, result.edges.map);
  //   return result.vertex;
  // }));

  // const intersectClone = JSON.parse(JSON.stringify(intersect));

  const changes = [];
  intersect.edges.map((el, i, arr) => {
    const edge_map = changes.length
      ? merge_maps(...changes.map(r => r.edges.map))
      : Array.from(Array(graph.edges_vertices.length)).map((_, i) => i);
    // update the edge's index if this is the second loop and the index changed.
    el.edge = edge_map[el.edge];
    // split the edge (modifying the graph), and store the changes so that during
    // the next loop the second edge to split will be updated to the new index
    const result = split_edge(graph, el.edge, el.coords);
    // store changes to the graph for future iterations
    changes.push(result);
    // update the other details of the changes
    // "old" is the index before the operation. update it to relate to the current graph
    result.edges.replace.old = edge_map.indexOf(result.edges.replace.old);
    // these update normally
    changes.forEach(prev => [0, 1].forEach((_, i) => {
      prev.edges.replace.new[i] = result.edges.map[result.edges.replace.new[i]];
    }));
  });
  vertices.push(...changes.map(result => result.vertex));
  // the indices of our new components
  const edge = graph.edges_vertices.length;
  const faces = [0, 1].map(i => graph.faces_vertices.length + i - 1);
  // construct data for our new edge (vertices, faces, assignent, foldAngle...)
  const new_edge = make_edge(graph, vertices, faces);
  // ignoring any keys that aren't a part of our graph, add the new edge
  Object.keys(new_edge)
    .filter(key => graph[key] !== undefined)
    .forEach((key) => { graph[key][edge] = new_edge[key]; });
  // update data that has been changed by edges
  // todo: anything else we need to update?
  update_vertices_vertices(graph, edge);
  // construct data for our new geometry: 2 faces (faces_vertices, faces_edges)
  const new_faces = make_faces(graph, face, vertices);
  // remove our face before we add any new faces to the graph so that the
  // face map reflects the state of the graph before faces were added
  const faces_map = remove(graph, "faces", [face]);
  // ignoring any keys that aren't a part of our graph, add the new faces
  new_faces.forEach((new_face, i) => Object.keys(new_face)
    .filter(key => graph[key] !== undefined)
    .forEach((key) => { graph[key][faces[i]] = new_face[key]; }));

  graph.vertices_faces = make_vertices_faces(graph);
  graph.edges_faces = make_edges_faces(graph);
  graph.faces_faces = make_faces_faces(graph);

  // including these two new faces
  // const incident_faces = find_adjacent_faces_to_face(graph, face)
  //   .concat(faces);

  // const incident_face_graph = {
  //   faces_vertices: [],
  //   faces_edges: [],
  // };
  // incident_faces.forEach(i => {
  //   incident_face_graph.faces_vertices[i] = graph.faces_vertices[i];
  //   incident_face_graph.faces_edges[i] = graph.faces_edges[i];
  // });

  // incident_faces.forEach((f, i) => { incident_faces[i] += faces_map[i]; });
  // console.log("incident_faces", incident_faces);

  // if (incident_faces.includes(face)) {
  //   console.log("BAD NEWS incident faces includes old face");
  // }

  // const incident_f_v_map = {};
  // const incident_f_e_map = {};
  // incident_faces.forEach((f) => {
  //   graph.faces_vertices[f].forEach(v => { incident_f_v_map[v] = true; });
  //   graph.faces_edges[f].forEach(e => { incident_f_e_map[e] = true; });
  // });
  // const incident_faces_vertices = Object.keys(incident_f_v_map);
  // const incident_faces_edges = Object.keys(incident_f_e_map);

  // remove faces, adjust all relevant indices

  // make_vertices_faces(incident_face_graph)
  //   // .forEach((v_f, i) => { graph.vertices_faces[i] = v_f; });
  //   .forEach((v_f, i) => { graph.vertices_faces[i] = [...v_f]; });
  // make_edges_faces(incident_face_graph)
  //   // .forEach((e_f, i) => { graph.edges_faces[i] = e_f; });
  //   .forEach((e_f, i) => { graph.edges_faces[i] = [...e_f]; });
  // make_faces_faces(incident_face_graph)
  //   .forEach((f_f, i) => { graph.faces_faces[i] = f_f; });
  // //   .forEach((f_f, i) => { graph.faces_faces[i] = [...f_f]; });
  // console.log("faces_vertices before", JSON.parse(JSON.stringify(graph.faces_vertices)));
  // graph.faces_faces = make_faces_faces(graph);
  // console.log("NEW FACES FACES", make_faces_faces(incident_face_graph));

  // console.log("incident_face_graph", incident_face_graph);
  // console.log("graph", graph);

  // console.log("faces faces before", JSON.parse(JSON.stringify(graph.faces_faces)));

  // console.log("faces faces after", JSON.parse(JSON.stringify(graph.faces_faces)));

  // make_vertices_faces({ faces_vertices: incident_faces.map(i => graph.faces_vertices[i]) })
  //   .forEach((v_f, i) => { graph.vertices_faces[incident_faces[i]] = v_f; });
  // make_edges_faces({ faces_edges: incident_faces.map(i => graph.faces_edges[i])  })
  //   .forEach((e_f, i) => { graph.edges_faces[incident_faces[i]] = e_f; });

  // rebuild edges_faces, vertices_faces
  // search inside vertices_faces for an occurence of the removed face,
  // determine which of our two new faces needs to be put in its place
  // by checking faces_vertices, by way of this map we build below:
  // const v_f_map = {};
  // graph.faces_vertices
  //   .map((f, i) => ({ f, i }))
  //   .filter(el => el.i === faces[0] || el.i === faces[1])
  //   .forEach(el => el.f.forEach((v) => {
  //     if (v_f_map[v] == null) { v_f_map[v] = []; }
  //     v_f_map[v].push(el.i);
  //   }));

  // graph.vertices_faces
  //   .forEach((vf, i) => {
  //     let indexOf = vf.indexOf(face);
  //     while (indexOf !== -1) {
  //       graph.vertices_faces[i].splice(indexOf, 1, ...(v_f_map[i]));
  //       indexOf = vf.indexOf(face);
  //     }
  //   });
  // // the same as above, but making a map of faces_edges to rebuild edges_faces
  // const e_f_map = {};
  // graph.faces_edges
  //   .map((f, i) => ({ f, i }))
  //   .filter(el => el.i === faces[0] || el.i === faces[1])
  //   .forEach(el => el.f.forEach((e) => {
  //     if (e_f_map[e] == null) { e_f_map[e] = []; }
  //     e_f_map[e].push(el.i);
  //   }));
  // graph.edges_faces
  //   .forEach((ef, i) => {
  //     let indexOf = ef.indexOf(face);
  //     while (indexOf !== -1) {
  //       graph.edges_faces[i].splice(indexOf, 1, ...(e_f_map[i]));
  //       indexOf = ef.indexOf(face);
  //     }
  //   });



  // const graphClone = JSON.parse(JSON.stringify(graph));

  // const changesClone = [];
  // intersectClone.edges.map((el, i, arr) => {
  //   const edge_map = changesClone.length
  //     ? merge_maps(...changesClone.map(r => r.edges.map))
  //     : Array.from(Array(graphClone.edges_vertices.length)).map((_, i) => i);
  //   el.edge = edge_map[el.edge];
  //   const result = split_edge(graphClone, el.edge, el.coords);
  //   changesClone.push(result);
  // });

  // results.forEach(result => {
  //   result.edges.replace.old = edge_map.indexOf(result.edges.replace.old);
  //   // 
  //   changesClone.forEach(prev => [0, 1].forEach((_, i) => {
  //     prev.edges.replace.new[i] = result.edges.map[result.edges.replace.new[i]];
  //   }));
  // });

  // return a diff of the geometry
  return {
    vertices,
    faces: {
      map: faces_map,
      replace: [{
        old: face,
        new: faces,
      }]
    },
    edges: {
      new: [edge],
      map: merge_maps(...changes.map(res => res.edges.map)),
      // map: edge_map,
      replace: changes
        .map(res => res.edges.replace)
        .reduce((a, b) => a.concat(b), []),
    }
  };
};

export default split_convex_face;

// const split_convex_polygon = function (
//   graph,
//   faceIndex,
//   lineVector,
//   linePoint,
//   crease_assignment = "F"
// ) {
//   // the only cases we care about are
//   // - 2 edge intersections
//   // - 2 vertices intersections
//   // - 1 edge intersection and 1 vertex intersection
//   // resolve each case by either gatering vertices (v-intersections) or
//   // splitting edges and making new vertices (e-intersections)
//   let new_v_indices = [];
//   let edge_map = Array(graph.edges_vertices.length).fill(0);
//   if (edges_intersections.length === 2) {
//     new_v_indices = edges_intersections.map((el, i, arr) => {
//       console.log("splitting edge", graph, el.i_edges, el.point);
//       const diff = split_edge(graph, el.i_edges, el.point);
//       arr.slice(i + 1)
//         .filter(ell => diff.edges.map[ell.i_edges] != null)
//         .forEach((ell) => { ell.i_edges += diff.edges.map[ell.i_edges]; });
//       edge_map = Diff.merge_change_maps(edge_map, diff.edges.map);
//       return diff.vertices.new[0].index;
//     });
//   } else if (edges_intersections.length === 1
//           && vertices_intersections.length === 1) {
//     const a = vertices_intersections.map(el => el.i_vertices);
//     const b = edges_intersections.map((el, i, arr) => {
//       console.log("splitting edge", graph, el.point, el.i_edges);
//       const diff = split_edge(graph, el.i_edges, el.point);
//       arr.slice(i + 1)
//         .filter(ell => diff.edges.map[ell.i_edges] != null)
//         .forEach((ell) => { ell.i_edges += diff.edges.map[ell.i_edges]; });
//       edge_map = diff.edges.map;
//       return diff.vertices.new[0].index;
//     });
//     new_v_indices = a.concat(b);
//   } else if (vertices_intersections.length === 2) {
//     new_v_indices = vertices_intersections.map(el => el.i_vertices);
//     // check if the proposed edge is collinear to an already existing edge
//     const face_v = graph.faces_vertices[faceIndex];
//     const v_i = vertices_intersections;
//     const match_a = face_v[(v_i[0].i_face + 1) % face_v.length] === v_i[1].i_vertices;
//     const match_b = face_v[(v_i[1].i_face + 1) % face_v.length] === v_i[0].i_vertices;
//     if (match_a || match_b) { return {}; }
//   } else {
//     return {};
//   }
//   // this results in a possible removal of edges. we now have edge_map marking this change
//   // example: [0,0,0,-1,-1,-1,-1,-2,-2,-2]
//   // where 2 vertices were removed, each indicates how many indices it shifts

//   // connect an edge splitting the polygon into two, joining the two vertices
//   // 1. rebuild the two faces
//   //    (a) faces_vertices
//   //    (b) faces_edges
//   // 2. build the new edge

//   // inside our face's faces_vertices, get index location of our new vertices
//   // this helps us build both faces_vertices and faces_edges arrays
//   const new_face_v_indices = new_v_indices
//     .map(el => graph.faces_vertices[faceIndex].indexOf(el))
//     .sort((a, b) => a - b);

//   // construct data for our new geometry: 2 faces (faces_vertices, faces_edges)
//   const new_faces = [{}, {}];
//   new_faces[0].vertices = graph.faces_vertices[faceIndex]
//     .slice(new_face_v_indices[1])
//     .concat(graph.faces_vertices[faceIndex].slice(0, new_face_v_indices[0] + 1));
//   new_faces[1].vertices = graph.faces_vertices[faceIndex]
//     .slice(new_face_v_indices[0], new_face_v_indices[1] + 1);
//   new_faces[0].edges = graph.faces_edges[faceIndex]
//     .slice(new_face_v_indices[1])
//     .concat(graph.faces_edges[faceIndex].slice(0, new_face_v_indices[0]))
//     .concat([graph.edges_vertices.length]);
//   new_faces[1].edges = graph.faces_edges[faceIndex]
//     .slice(new_face_v_indices[0], new_face_v_indices[1])
//     .concat([graph.edges_vertices.length]);
//   new_faces[0].index = graph.faces_vertices.length;
//   new_faces[1].index = graph.faces_vertices.length + 1;

//   // construct data for our new edge (vertices, faces, assignent, foldAngle, length)
//   const new_edge_coords = new_v_indices.map(v => graph.vertices_coords[v])
//   const new_edges = [{
//     index: graph.edges_vertices.length,
//     vertices: [...new_v_indices],
//     assignment: crease_assignment,
//     foldAngle: edge_assignment_to_foldAngle(crease_assignment),
//     length: math.core.distance2(...new_edge_coords),
//     vector: math.core.subtract(new_edge_coords[1], new_edge_coords[0]),
//     // todo, unclear if these are ordered with respect to the vertices
//     faces: [graph.faces_vertices.length, graph.faces_vertices.length + 1]
//   }];

//   // add 1 new edge and 2 new faces to our graph
//   const edges_count = graph.edges_vertices.length;
//   const faces_count = graph.faces_vertices.length;
//   new_faces.forEach((face, i) => Object.keys(face)
//     .filter(suffix => suffix !== "index")
//     .forEach((suffix) => { graph[`faces_${suffix}`][faces_count + i] = face[suffix]; }));
//   console.log("HERE IS NEW EDGe", new_edges);
//   new_edges.forEach((edge, i) => Object.keys(edge)
//     .filter(suffix => suffix !== "index")
//     .filter(suffix => graph[`edges_${suffix}`] !== undefined)
//     .forEach((suffix) => {
//       console.log("setting new component edges_" + suffix, edge[suffix]);
//       graph[`edges_${suffix}`][edges_count + i] = edge[suffix];
//     }));
//   // update data that has been changed by edges
//   new_edges.forEach((edge) => {
//     const a = edge.vertices[0];
//     const b = edge.vertices[1];
//     // todo, it appears these are going in counter-clockwise order, but i don't know why
//     graph.vertices_vertices[a].push(b);
//     graph.vertices_vertices[b].push(a);
//   });

//   // rebuild edges_faces, vertices_faces
//   // search inside vertices_faces for an occurence of the removed face,
//   // determine which of our two new faces needs to be put in its place
//   // by checking faces_vertices, by way of this map we build below:
//   const v_f_map = {};
//   graph.faces_vertices
//     .map((face, i) => ({ face, i }))
//     .filter(el => el.i === faces_count || el.i === faces_count + 1)
//     .forEach(el => el.face.forEach((v) => {
//       if (v_f_map[v] == null) { v_f_map[v] = []; }
//       v_f_map[v].push(el.i);
//     }));
//   console.log("just built v_f_map", v_f_map);
//   graph.vertices_faces
//     .forEach((vf, i) => {
//       let indexOf = vf.indexOf(faceIndex);
//       while (indexOf !== -1) {
//         console.log("accessing", i);
//         graph.vertices_faces[i].splice(indexOf, 1, ...(v_f_map[i]));
//         indexOf = vf.indexOf(faceIndex);
//       }
//     });
//   // the same as above, but making a map of faces_edges to rebuild edges_faces
//   const e_f_map = {};
//   graph.faces_edges
//     .map((face, i) => ({ face, i }))
//     .filter(el => el.i === faces_count || el.i === faces_count + 1)
//     .forEach(el => el.face.forEach((e) => {
//       if (e_f_map[e] == null) { e_f_map[e] = []; }
//       e_f_map[e].push(el.i);
//     }));
//   graph.edges_faces
//     .forEach((ef, i) => {
//       let indexOf = ef.indexOf(faceIndex);
//       while (indexOf !== -1) {
//         graph.edges_faces[i].splice(indexOf, 1, ...(e_f_map[i]));
//         indexOf = ef.indexOf(faceIndex);
//       }
//     });

//   // remove faces, adjust all relevant indices
//   const faces_map = remove(graph, "faces", [faceIndex]);

//   // return a diff of the geometry
//   return {
//     faces: {
//       map: faces_map,
//       replace: [{
//         old: faceIndex,
//         new: new_faces
//       }]
//     },
//     edges: {
//       new: new_edges,
//       map: edge_map
//     }
//   };
// };

// export default split_convex_polygon;
