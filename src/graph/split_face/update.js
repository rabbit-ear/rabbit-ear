/**
 * Rabbit Ear (c) Robby Kraft
 */
import { sort_vertices_counter_clockwise } from "../sort";
import {
  make_vertices_edges_sorted,
  make_vertices_faces,
  make_edges_faces,
  make_faces_faces,
  make_vertices_to_edge_bidirectional,
} from "../make";
import { find_adjacent_faces_to_face } from "../find";
/**
 * @description a newly-added edge needs to update its two endpoints'
 * vertices_vertices. each vertices_vertices gains one additional
 * vertex, then the whole array is re-sorted counter-clockwise
 * @param {object} FOLD object
 * @param {number} index of the newly-added edge
 */
export const update_vertices_vertices = ({ vertices_coords, vertices_vertices, edges_vertices }, edge) => {
  const v0 = edges_vertices[edge][0];
  const v1 = edges_vertices[edge][1];
  vertices_vertices[v0] = sort_vertices_counter_clockwise({ vertices_coords }, vertices_vertices[v0].concat(v1), v0);
  vertices_vertices[v1] = sort_vertices_counter_clockwise({ vertices_coords }, vertices_vertices[v1].concat(v0), v1);
};
/**
 * vertices_vertices was just run before this method. use it.
 * vertices_edges should be up to date, except for the addition
 * of this one new edge at both ends of 
 */
export const update_vertices_edges = ({ edges_vertices, vertices_edges, vertices_vertices }, edge) => {
  // the expensive way, rebuild all arrays
  // graph.vertices_edges = make_vertices_edges_sorted(graph);
  if (!vertices_edges || !vertices_vertices) { return; }
  const vertices = edges_vertices[edge];
  // for each of the two vertices, check its vertices_vertices for the
  // index of the opposite vertex. this is the edge. return its position
  // in the vertices_vertices to be used to insert into vertices_edges.
  vertices
    .map(v => vertices_vertices[v])
    .map((vert_vert, i) => vert_vert
      .indexOf(vertices[(i + 1) % vertices.length]))
    .forEach((radial_index, i) => vertices_edges[vertices[i]]
      .splice(radial_index, 0, edge));
};
/**
 * 
 * search inside vertices_faces for an occurence of the removed face,
 * determine which of our two new faces needs to be put in its place
 * by checking faces_vertices, by way of this map we build below:
 */
export const update_vertices_faces = (graph, old_face, new_faces) => {
  // give each vertex (key) an array value containing
  // one or two face indices (only the new_faces).
  const vertex_face_map = {};
  new_faces
    .forEach((f, i) => graph.faces_vertices[f]
      .forEach(v => {
        if (!vertex_face_map[v]) { vertex_face_map[v] = []; }
        vertex_face_map[v].push(f);
      }));
  // these vertices need updating
  graph.faces_vertices[old_face].forEach(v => {
    const index = graph.vertices_faces[v].indexOf(old_face);
    const replacements = vertex_face_map[v];
    if (index === -1 || !replacements) {
      console.warn("update_vertices_faces not supposed to be here");
      return;
    }
    graph.vertices_faces[v].splice(index, 1, ...replacements);
  });
};
/**
 * 
 */
export const update_edges_faces = (graph, old_face, new_edge, new_faces) => {
  // give each edge (key) an array value containing
  // one or two face indices (only the new_faces).
  const edge_face_map = {};
  new_faces
    .forEach((f, i) => graph.faces_edges[f]
      .forEach(e => {
        if (!edge_face_map[e]) { edge_face_map[e] = []; }
        edge_face_map[e].push(f);
      }));
  // these edges need updating
  const edges = [...graph.faces_edges[old_face], new_edge];
  edges.forEach(e => {
    const replacements = edge_face_map[e];
    // basically rewriting .indexOf(), but supporting multiple results.
    const indices = [];
    for (let i = 0; i < graph.edges_faces[e].length; i++) {
      if (graph.edges_faces[e][i] === old_face) { indices.push(i); }
    }
    if (indices.length === 0 || !replacements) {
      console.warn("update_edges_faces not supposed to be here", index, replacements, JSON.parse(JSON.stringify(graph.edges_faces[e])));
      return;
    }
    indices.reverse().forEach(index => graph.edges_faces[e].splice(index, 1));
    const index = indices[indices.length - 1];
    graph.edges_faces[e].splice(index, 0, ...replacements);
  });
};
/**
 * @description one face was removed and two faces put in its place.
 * regarding the faces_faces array, updates need to be made to the two
 * new faces, as well as all the previously neighboring faces of
 * the removed face.
 */
export const update_faces_faces = ({ faces_vertices, faces_faces }, old_face, new_faces) => {
  // this is presuming that new_faces have their updated faces_vertices by now
  const incident_faces = faces_faces[old_face];
  const new_faces_vertices = new_faces.map(f => faces_vertices[f]);
  // for each of the incident faces (to the old face), set one of two
  // indices, one of the two new faces. this is the new incident face.
  const incident_face_face = incident_faces.map((f, i) => {
    const incident_face_vertices = faces_vertices[f];
    const score = [0, 0];
    for (let n = 0; n < new_faces_vertices.length; n++) {
      let count = 0;
      for (let j = 0; j < incident_face_vertices.length; j++) {
        if (new_faces_vertices[n].indexOf(incident_face_vertices[j]) !== -1) {
          count++;
        }
      }
      score[n] = count;
    }
    if (score[0] >= 2) { return new_faces[0]; }
    if (score[1] >= 2) { return new_faces[1]; }
  });
  // prepare the new faces' face_faces empty arrays, filled with one
  // face, the opposite of the pair of the new faces.
  new_faces.forEach((f, i, arr) => {
    faces_faces[f] = [arr[(i + 1) % new_faces.length]];
  });
  // 2 things, fill the new face's arrays and update each of the
  // incident faces to point to the correct of the two new faces.
  incident_faces.forEach((f, i) => {
    for (let j = 0; j < faces_faces[f].length; j++) {
      if (faces_faces[f][j] === old_face) {
        faces_faces[f][j] = incident_face_face[i];
        faces_faces[incident_face_face[i]].push(f);
      }
    }
  });
};
