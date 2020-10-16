import math from "../math";
import split_edge from "./add_vertices/add_vertex_on_edge_and_rebuild";
import Diff from "./diff";
import { edge_assignment_to_foldAngle } from "./keys";
import remove from "./remove";
import { make_vertices_to_edge_bidirectional } from "./make";
import { intersect_face_with_line } from "./intersect";

const update_vertices_vertices = ({ vertices_vertices, edges_vertices }, edge) => {
  const a = edges_vertices[edge][0];
  const b = edges_vertices[edge][1];
  // todo: BIG TODO this does not preserve winding direction
  vertices_vertices[a].push(b);
  vertices_vertices[b].push(a);
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
  let edge_change = Array(graph.edges_vertices.length).fill(0);
  vertices.push(...intersect.edges.map((el, i, arr) => {
    el.edge += edge_change[el.edge];
    const result = split_edge(graph, el.coords, el.edge);
    // todo, apply directly to edge_change, get rid of "edge_change = "
    edge_change = Diff.merge_maps(edge_change, result.edges.map);
    return result.vertices.new[0];
  }))

  // construct data for our new edge (vertices, faces, assignent, foldAngle, length)
  const edge = graph.edges_vertices.length;
  const faces = [0, 1].map(i => graph.faces_vertices.length + i);

  const new_edge = make_edge(graph, vertices, faces);
  // ignoring any keys that aren't a part of our graph, add the new edge
  Object.keys(new_edge)
    .filter(key => graph[key] !== undefined)
    .forEach((key) => { graph[key][edge] = new_edge[key]; });

  // update data that has been changed by edges
  update_vertices_vertices(graph, edge);
  // todo: anything else we need to update?

  // inside our face's faces_vertices, get index location of our new vertices
  // this helps us build both faces_vertices and faces_edges arrays
  // update: now only to build faces_vertices. edges comes from a lookup table
  const new_face_v_indices = vertices
    .map(el => graph.faces_vertices[face].indexOf(el))
    .sort((a, b) => a - b);
  // table to build faces_edges
  const vertices_to_edge = make_vertices_to_edge_bidirectional(graph);

  // construct data for our new geometry: 2 faces (faces_vertices, faces_edges)
  const new_faces = [{}, {}];
  new_faces[0].index = graph.faces_vertices.length;
  new_faces[1].index = graph.faces_vertices.length + 1;
  new_faces[0].vertices = graph.faces_vertices[face]
    .slice(new_face_v_indices[1])
    .concat(graph.faces_vertices[face].slice(0, new_face_v_indices[0] + 1));
  new_faces[1].vertices = graph.faces_vertices[face]
    .slice(new_face_v_indices[0], new_face_v_indices[1] + 1);
  new_faces[0].edges = new_faces[0].vertices
    .map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
    .map(key => vertices_to_edge[key]);
  new_faces[1].edges = new_faces[1].vertices
    .map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
    .map(key => vertices_to_edge[key]);

  const faces_count = graph.faces_vertices.length;
  new_faces.forEach((face, i) => Object.keys(face)
    .filter(suffix => suffix !== "index")
    .forEach((suffix) => { graph[`faces_${suffix}`][faces_count + i] = face[suffix]; }));

  // rebuild edges_faces, vertices_faces
  // search inside vertices_faces for an occurence of the removed face,
  // determine which of our two new faces needs to be put in its place
  // by checking faces_vertices, by way of this map we build below:
  const v_f_map = {};
  graph.faces_vertices
    .map((face, i) => ({ face, i }))
    .filter(el => el.i === faces_count || el.i === faces_count + 1)
    .forEach(el => el.face.forEach((v) => {
      if (v_f_map[v] == null) { v_f_map[v] = []; }
      v_f_map[v].push(el.i);
    }));

  graph.vertices_faces
    .forEach((vf, i) => {
      let indexOf = vf.indexOf(face);
      while (indexOf !== -1) {
        graph.vertices_faces[i].splice(indexOf, 1, ...(v_f_map[i]));
        indexOf = vf.indexOf(face);
      }
    });
  // the same as above, but making a map of faces_edges to rebuild edges_faces
  const e_f_map = {};
  graph.faces_edges
    .map((face, i) => ({ face, i }))
    .filter(el => el.i === faces_count || el.i === faces_count + 1)
    .forEach(el => el.face.forEach((e) => {
      if (e_f_map[e] == null) { e_f_map[e] = []; }
      e_f_map[e].push(el.i);
    }));
  graph.edges_faces
    .forEach((ef, i) => {
      let indexOf = ef.indexOf(face);
      while (indexOf !== -1) {
        graph.edges_faces[i].splice(indexOf, 1, ...(e_f_map[i]));
        indexOf = ef.indexOf(face);
      }
    });

  // remove faces, adjust all relevant indices
  const faces_map = remove(graph, "faces", [face]);

  // return a diff of the geometry
  return {
    faces: {
      map: faces_map,
      replace: [{
        old: face,
        new: new_faces
      }]
    },
    edges: {
      new: [new_edge],
      map: edge_change
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
//       const diff = split_edge(graph, el.point, el.i_edges);
//       arr.slice(i + 1)
//         .filter(ell => diff.edges.map[ell.i_edges] != null)
//         .forEach((ell) => { ell.i_edges += diff.edges.map[ell.i_edges]; });
//       edge_map = Diff.merge_maps(edge_map, diff.edges.map);
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
