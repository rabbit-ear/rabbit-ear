/**
 * Rabbit Ear (c) Robby Kraft
 */
/**
 * @description
 * @param {object} FOLD graph
 * @param {number} starting vertex
 * @param {number} second vertex, this sets the direction of the walk
 * @param {object} to prevent walking down duplicate paths, or finding duplicate
 * faces, this dictionary will store and check against vertex pairs "i j".
 */
export const counter_clockwise_walk = ({ vertices_vertices, vertices_sectors }, v0, v1, walked_edges = {}) => {
  // each time we visit an edge (vertex pair as string, "4 9") add it here.
  // this gives us a quick lookup to see if we've visited this edge before.
  const this_walked_edges = {};
  // return the face: { vertices, edges, angles }
  const face = { vertices: [v0], edges: [], angles: [] };
  // walking the graph, we look at 3 vertices at a time. in sequence:
  // prev_vertex, this_vertex, next_vertex
  let prev_vertex = v0;
  let this_vertex = v1;
  while (true) {
    // even though vertices_vertices are sorted counter-clockwise,
    // to make a counter-clockwise wound face, when we visit a vertex's
    // vertices_vertices array we have to select the [n-1] vertex, not [n+1],
    // it's a little counter-intuitive.
    const v_v = vertices_vertices[this_vertex];
    const from_neighbor_i = v_v.indexOf(prev_vertex);
    const next_neighbor_i = (from_neighbor_i + v_v.length - 1) % v_v.length;
    const next_vertex = v_v[next_neighbor_i];
    const next_edge_vertices = `${this_vertex} ${next_vertex}`;
    // check if this edge was already walked 2 ways:
    // 1. if we visited this edge while making this face, we are done.
    if (this_walked_edges[next_edge_vertices]) {
      Object.assign(walked_edges, this_walked_edges);
      face.vertices.pop();
      return face;
    }
    this_walked_edges[next_edge_vertices] = true;
    // 2. if we visited this edge (with vertices in the same sequence),
    // because of the counterclockwise winding, we are looking at a face
    // that has already been built.
    if (walked_edges[next_edge_vertices]) {
      return undefined;
    }
    face.vertices.push(this_vertex);
    face.edges.push(next_edge_vertices);
    if (vertices_sectors) {
      face.angles.push(vertices_sectors[this_vertex][next_neighbor_i]);
    }
    prev_vertex = this_vertex;
    this_vertex = next_vertex;
  }
};

export const planar_vertex_walk = ({ vertices_vertices, vertices_sectors }) => {
  const graph = { vertices_vertices, vertices_sectors };
  const walked_edges = {};
  return vertices_vertices
    .map((adj_verts, v) => adj_verts
      .map(adj_vert => counter_clockwise_walk(graph, v, adj_vert, walked_edges))
      .filter(a => a !== undefined))
    .reduce((a, b) => a.concat(b), [])
};
/**
 * @description 180 - sector angle = the turn angle. counter clockwise
 * turns are +, clockwise will be -, this removes the one face that
 * outlines the piece with opposite winding enclosing Infinity.
 * @param {object} walked_faces, the result from calling "planar_vertex_walk"
 */
export const filter_walked_boundary_face = walked_faces => walked_faces
  .filter(face => face.angles
    .map(a => Math.PI - a)
    .reduce((a,b) => a + b, 0) > 0);
