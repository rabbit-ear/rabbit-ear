/**
 * split edge
 *
 * insert a vertex between two vertices where an edge existed and
 * replace the edge with two edges connecting to the new vertex.
 *
 * this DOES NOT MODIFY the graph. it returns a RUN diff
 *
 */


/**
 * create new edges by replacing an old edge (edge_index) so that
 * any data not defined the new edges will be inherited.
 *
 * each object in new_edges should contain key:value pair matching the spec
 * for example {edges_vertices: [2,5]}, {edges_vertices: [5,7]}
 */
const replace_edge = function (graph, edge_index, ...new_edges) {
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
const edge_split_rebuild_vertices_vertices = function (
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
const face_insert_vertex_between_edge = function (
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
const face_replace_edge_with_two_edges = function (
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
  // const new_edges_vertices = [
  //   [ordered_verts[0], new_vertex_index],
  //   [new_vertex_index, ordered_verts[1]]
  // ];
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
};

/**
 * appends a vertex along an edge. causing a rebuild on all arrays
 * including edges and faces.
 * requires edges_vertices to be defined
 */
const add_vertex_on_edge = function (
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
  return result;
  // apply_run_diff(graph, result);
  // return graph;
};

export default add_vertex_on_edge;
