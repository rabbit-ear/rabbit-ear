import math from "../../include/math";
import { clone } from "../fold_format/object";
import { remove_edges } from "./remove";
import { apply_run_diff } from "../origami/diff";

// /////////////////////
// big untested change below: key => key !== "i"
// /////////////////////

/**
 * these should trigger a re-build on the other arrays
 */
export const new_vertex = function (graph, x, y) {
  if (graph.vertices_coords === undefined) { return undefined; }
  const vertices_count = graph.vertices_coords.length;
  graph.vertices_coords[vertices_count] = [x, y];
  return vertices_count;
  // // mark unclean data
  // unclean.vertices_vertices[new_index] = true;
  // unclean.vertices_faces[new_index] = true;
};

export const new_edge = function (graph, node1, node2) {
  if (graph.edges_vertices === undefined) { return undefined; }
  const edges_count = graph.edges_vertices.length;
  graph.edges_vertices[edges_count] = [node1, node2];
  return edges_count;
  // // mark unclean data
  // unclean.edges_vertices[new_index] = true;
  // unclean.edges_faces[new_index] = true;
  // unclean.edges_assignment[new_index] = true;
  // unclean.edges_foldAngle[new_index] = true;
  // unclean.edges_length[new_index] = true;
};

/**
 * create new edges by replacing an old edge (edge_index) so that
 * any data not defined the new edges will be inherited.
 *
 * each object in new_edges should contain key:value pair matching the spec
 * for example {edges_vertices: [2,5]}, {edges_vertices: [5,7]}
 */
export const replace_edge = function (graph, edge_index, ...new_edges) {
  // get all arrays in the graph that start with "edges_"
  const prefix = "edges_";
  const prefixKeys = Object.keys(graph)
    .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
    .filter(str => str !== undefined);

  const edges = Array.from(Array(new_edges.length)).map(() => ({}));
  new_edges.forEach((_, i) => prefixKeys
    .filter(pKey => graph[pKey][edge_index] !== undefined)
    .forEach((pKey) => {
      edges[i][pKey] = graph[pKey][edge_index];
    }));
  new_edges.forEach((edge, i) => Object.keys(edge)
    .forEach((key) => { edges[i][key] = new_edges[i][key]; }));
  // new_edges.forEach((edge, i) => { edges[i].edges_vertices = e_v; });
  return edges;
};

/**
 * this is a very specific case: an edge has been split into 2 edges with
 * the addition of a new vertex (new_vertex_index). rebuild vertices_vertices
 * for both the original edge's vertices by adding the new_vertex_index
 * in the correct place.
 */
export const edge_split_rebuild_vertices_vertices = function (
  graph,
  edge_vertices,
  new_vertex_index
) {
  const update = [];
  edge_vertices.forEach((vert) => { update[vert] = {}; });
  const edges_vertices_other_vertex = ([1, 0].map(i => edge_vertices[i]));
  edge_vertices.forEach((vert, i) => {
    update[vert].vertices_vertices = graph.vertices_vertices[vert]
    !== undefined
      ? [...graph.vertices_vertices[vert]]
      : [edges_vertices_other_vertex[i]];
  });
  const other_index_of = edge_vertices
    .map((v, i) => update[v].vertices_vertices
      .indexOf(edges_vertices_other_vertex[i]));
  edge_vertices.forEach((vert, i) => {
    update[vert].vertices_vertices[other_index_of[i]] = new_vertex_index;
  });
  return update;
};

/**
 * modify (return a copy of) a face (face_vertices) after one of its
 * edges (edge_vertices) was just split into 2 with the addition of a
 * new vertex (new_vertex_index).
 */
export const face_insert_vertex_between_edge = function (
  face_vertices,
  edge_vertices,
  new_vertex_index
) {
  const len = face_vertices.length;
  // locate the spot in the face_vertices array between the two edge_vertices
  const spliceIndices = face_vertices.map((fv, i, arr) => (
    (fv === edge_vertices[0] && arr[(i + 1) % len] === edge_vertices[1])
    || (fv === edge_vertices[1] && arr[(i + 1) % len] === edge_vertices[0])
      ? (i + 1) % len : undefined))
    .filter(el => el !== undefined);
  // 1. using splice - speed test 1 and 2 someday
    // .sort((a, b) => b - a);
  // const new_face_vertices = [...face_vertices];
  // spliceIndices.forEach(i => new_face_vertices.splice(i, 0, new_vertex_index));

  // 2. substitute for splice
  const new_face_vertices = [];
  let modI = 0;
  for (let i = 0; i < len + spliceIndices.length; i += 1) {
    if (spliceIndices.includes(i)) {
      modI -= 1;
      new_face_vertices[i] = new_vertex_index;
    } else {
      new_face_vertices[i] = face_vertices[i + modI];
    }
  }
  // end of 1 and 2
  return new_face_vertices;
};

/**
 * "...edges" should be two indices of the edges_ arrays
 */
const edges_common_vertex = function (graph, ...edges) {
  const v = edges.map(e => graph.edges_vertices[e]);
  return v[0][0] === v[1][0] || v[0][0] === v[1][1]
    ? v[0][0]
    : v[0][1];
};

/**
 * this is counting on a counter-clockwise edge arrangement in the face
 * otherwise it inserts the two edges in the wrong order
 */
export const face_replace_edge_with_two_edges = function (
  graph,
  face_edges,
  old_edge_index,
  new_vertex_index,
  new_edge_index_0,
  new_edge_index_1,
  new_edge_vertices_0,
  new_edge_vertices_1,
) {
  const len = face_edges.length;
  // find the location of the removed edge in this face
  // todo: this is only asking for one index. this needs to be expanded
  // to include faces which double back on themselves and revist an edge.
  const edge_in_face_edges_index = face_edges.indexOf(old_edge_index);
  // the previous and next edge in this face, counter-clockwise
  const three_edges = [
    face_edges[(edge_in_face_edges_index + len - 1) % len], // previous edge
    old_edge_index,
    face_edges[(edge_in_face_edges_index + 1) % len] // next edge
  ];
  const ordered_verts = ([0, 1]
    .map(i => edges_common_vertex(graph, three_edges[i], three_edges[i + 1])));
  const new_edges_vertices = [
    [ordered_verts[0], new_vertex_index],
    [new_vertex_index, ordered_verts[1]]
  ];
  const new_edges_indices = (new_edge_vertices_0[0] === ordered_verts[0]
    || new_edge_vertices_0[1] === ordered_verts[0]
    ? [new_edge_index_0, new_edge_index_1]
    : [new_edge_index_1, new_edge_index_0]);

  const new_face_edges = face_edges.slice();
  if (edge_in_face_edges_index === len - 1) {
    // replacing the edge at the end of the array, we have to be careful
    // to put the first at the end, the second at the beginning
    new_face_edges.splice(edge_in_face_edges_index, 1, new_edges_indices[0]);
    new_face_edges.unshift(new_edges_indices[1]);
  } else {
    new_face_edges.splice(edge_in_face_edges_index, 1, ...new_edges_indices);
  }
  return new_face_edges;

  // const vertices = [
  //   [prevEdge, old_edge_index],
  //   [old_edge_index, nextEdge],
  // ].map((pairs) => {
  //   const verts = pairs.map(e => graph.edges_vertices[e]);
  //   return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1]
  //     ? verts[0][0] : verts[0][1];
  // }).reduce((a, b) => a.concat(b), []);



  // const edges = [
  //   [vertices[0], new_vertex_index],
  //   [new_vertex_index, vertices[1]],
  // ].map((verts) => {
  //   const in0 = verts.map(v => new_edge_vertices_0.indexOf(v) !== -1)
  //     .reduce((a, b) => a && b, true);
  //   const in1 = verts.map(v => new_edge_vertices_1.indexOf(v) !== -1)
  //     .reduce((a, b) => a && b, true);
  //   if (in0) { return new_edge_index_0; }
  //   if (in1) { return new_edge_index_1; }
  //   throw "something wrong with input graph's faces_edges construction";
  // });
  // if (edge_in_face_edges_index === len - 1) {
  //   // replacing the edge at the end of the array, we have to be careful
  //   // to put the first at the end, the second at the beginning
  //   face_edges.splice(edge_in_face_edges_index, 1, edges[0]);
  //   face_edges.unshift(edges[1]);
  // } else {
  //   face_edges.splice(edge_in_face_edges_index, 1, ...edges);
  // }
  // return edges;
};

/**
 * appends a vertex along an edge. causing a rebuild on all arrays
 * including edges and faces.
 * requires edges_vertices to be defined
 */
export const add_vertex_on_edge_functional = function (
  graph,
  x, y,
  old_edge_index
) {
  const vertices_length = graph.vertices_coords.length;
  const edges_length = graph.edges_vertices.length;
  if (edges_length < old_edge_index) { return undefined; }

  const result = {
    remove: {
      // vertices: [],
      edges: [old_edge_index],
      // faces: []
    },
    update: edge_split_rebuild_vertices_vertices(graph,
      graph.edges_vertices[old_edge_index], vertices_length),
    new: {
      vertices: [{
        vertices_coords: [x, y],
        vertices_vertices: [...graph.edges_vertices[old_edge_index]],
        vertices_faces: (graph.edges_faces ? graph.edges_faces[old_edge_index] : undefined)
      }],
      edges: replace_edge(graph, old_edge_index,
        ...graph.edges_vertices[old_edge_index]
          .map(ev => ({ edges_vertices: [ev, vertices_length] }))),
      faces: []
    }
  };

  // faces_vertices and faces_edges
  if (graph.edges_faces) {
    graph.edges_faces[old_edge_index].forEach((i) => {
      // faces_vertices
      if (result.update[i] === undefined) { result.update[i] = {}; }
      result.update[i].faces_vertices = face_insert_vertex_between_edge(
        graph.faces_vertices[i],
        graph.edges_vertices[old_edge_index],
        vertices_length
      );
      // faces_edges
      result.update[i].faces_edges = face_replace_edge_with_two_edges(
        graph,
        graph.faces_edges[i],
        old_edge_index,
        vertices_length,
        edges_length,
        edges_length + 1,
        result.new.edges[0].edges_vertices,
        result.new.edges[1].edges_vertices,
      );
    });
  }
  apply_run_diff(graph, result);
  // return result;
  return graph;
};


/**
 * appends a vertex along an edge. causing a rebuild on all arrays
 * including edges and faces.
 * requires edges_vertices to be defined
 */
export const add_vertex_on_edge = function (graph, x, y, old_edge_index) {
  if (graph.edges_vertices.length < old_edge_index) { return undefined; }
  // new vertex entries
  // vertices_coords
  const new_vertex_index = new_vertex(graph, x, y);
  const incident_vertices = graph.edges_vertices[old_edge_index];
  // vertices_vertices, new vertex
  if (graph.vertices_vertices == null) { graph.vertices_vertices = []; }
  graph.vertices_vertices[new_vertex_index] = clone(incident_vertices);
  // vertices_vertices, update incident vertices with new vertex
  incident_vertices.forEach((v, i, arr) => {
    const otherV = arr[(i + 1) % arr.length];
    const otherI = graph.vertices_vertices[v].indexOf(otherV);
    graph.vertices_vertices[v][otherI] = new_vertex_index;
  });
  // vertices_faces
  if (graph.edges_faces != null && graph.edges_faces[old_edge_index] != null) {
    graph.vertices_faces[new_vertex_index] = clone(
      graph.edges_faces[old_edge_index],
    );
  }
  // new edges entries
  // set edges_vertices
  const new_edges = [
    { edges_vertices: [incident_vertices[0], new_vertex_index] },
    { edges_vertices: [new_vertex_index, incident_vertices[1]] },
  ];
  // set new index in edges_ arrays
  new_edges.forEach((e, i) => { e.i = graph.edges_vertices.length + i; });
  // copy over relevant data if it exists
  ["edges_faces", "edges_assignment", "edges_foldAngle"]
    .filter(key => graph[key] != null && graph[key][old_edge_index] != null)
    .forEach((key) => {
      // todo, copy these arrays
      new_edges[0][key] = clone(graph[key][old_edge_index]);
      new_edges[1][key] = clone(graph[key][old_edge_index]);
    });
  // calculate length
  new_edges.forEach((el, i) => {
    const verts = el.edges_vertices.map(v => graph.vertices_coords[v]);
    new_edges[i].edges_length = math.core.distance2(...verts);
  });
  // todo: copy over edgeOrders. don't need to do this with faceOrders
  new_edges.forEach((edge, i) => Object.keys(edge)
    .filter(key => key !== "i")
    // .filter(key => key !== i)
    .forEach((key) => { graph[key][edge.i] = edge[key]; }));
  const incident_faces_indices = graph.edges_faces[old_edge_index];
  const incident_faces_vertices = incident_faces_indices
    .map(i => graph.faces_vertices[i]);
  const incident_faces_edges = incident_faces_indices
    .map(i => graph.faces_edges[i]);

  // faces_vertices
  // because Javascript, this is a pointer and modifies the master graph
  incident_faces_vertices.forEach(face => face
    .map((fv, i, arr) => {
      const nextI = (i + 1) % arr.length;
      return (fv === incident_vertices[0]
              && arr[nextI] === incident_vertices[1])
              || (fv === incident_vertices[1]
              && arr[nextI] === incident_vertices[0])
        ? nextI : undefined;
    }).filter(el => el !== undefined)
    .sort((a, b) => b - a)
    .forEach(i => face.splice(i, 0, new_vertex_index)));

  // faces_edges
  incident_faces_edges.forEach((face) => {
    // there should be 2 faces in this array, incident to the removed edge
    // find the location of the removed edge in this face
    const edgeIndex = face.indexOf(old_edge_index);
    // the previous and next edge in this face, counter-clockwise
    const prevEdge = face[(edgeIndex + face.length - 1) % face.length];
    const nextEdge = face[(edgeIndex + 1) % face.length];
    const vertices = [
      [prevEdge, old_edge_index],
      [old_edge_index, nextEdge],
    ].map((pairs) => {
      const verts = pairs.map(e => graph.edges_vertices[e]);
      return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1]
        ? verts[0][0] : verts[0][1];
    }).reduce((a, b) => a.concat(b), []);
    const edges = [
      [vertices[0], new_vertex_index],
      [new_vertex_index, vertices[1]],
    ].map((verts) => {
      const in0 = verts.map(v => new_edges[0].edges_vertices.indexOf(v) !== -1)
        .reduce((a, b) => a && b, true);
      const in1 = verts.map(v => new_edges[1].edges_vertices.indexOf(v) !== -1)
        .reduce((a, b) => a && b, true);
      if (in0) { return new_edges[0].i; }
      if (in1) { return new_edges[1].i; }
      throw "something wrong with input graph's faces_edges construction";
    });
    if (edgeIndex === face.length - 1) {
      // replacing the edge at the end of the array, we have to be careful
      // to put the first at the end, the second at the beginning
      face.splice(edgeIndex, 1, edges[0]);
      face.unshift(edges[1]);
    } else {
      face.splice(edgeIndex, 1, ...edges);
    }
    return edges;
  });
  // remove old data
  const edge_map = remove_edges(graph, [old_edge_index]);
  return {
    vertices: {
      new: [{ index: new_vertex_index }],
    },
    edges: {
      map: edge_map,
      replace: [{
        old: old_edge_index,
        new: new_edges.map(el => el.i),
      }],
    },
  };
};
