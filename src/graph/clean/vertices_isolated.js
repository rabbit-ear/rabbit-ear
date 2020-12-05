/**
 * Rabbit Ear (c) Robby Kraft
 */
export const get_edge_isolated_vertices = ({ vertices_coords, edges_vertices }) => {
  let count = vertices_coords.length;
  const seen = Array(count).fill(false);
  edges_vertices.forEach((ev) => {
    ev.filter(v => !seen[v]).forEach((v) => {
      seen[v] = true;
      count -= 1;
    });
  });
  return seen
    .map((s, i) => (s ? undefined : i))
    .filter(a => a !== undefined);
};

export const get_face_isolated_vertices = ({ vertices_coords, faces_vertices }) => {
  let count = vertices_coords.length;
  const seen = Array(count).fill(false);
  faces_vertices.forEach((fv) => {
    fv.filter(v => !seen[v]).forEach((v) => {
      seen[v] = true;
      count -= 1;
    });
  });
  return seen
    .map((s, i) => (s ? undefined : i))
    .filter(a => a !== undefined);
};

// todo this could be improved. for loop instead of forEach + filter.
// break the loop early.
export const get_isolated_vertices = ({ vertices_coords, edges_vertices, faces_vertices }) => {
  let count = vertices_coords.length;
  const seen = Array(count).fill(false);
  if (edges_vertices) {
    edges_vertices.forEach((ev) => {
      ev.filter(v => !seen[v]).forEach((v) => {
        seen[v] = true;
        count -= 1;
      });
    });
  }
  if (faces_vertices) {
    faces_vertices.forEach((fv) => {
      fv.filter(v => !seen[v]).forEach((v) => {
        seen[v] = true;
        count -= 1;
      });
    });
  }
  return seen
    .map((s, i) => (s ? undefined : i))
    .filter(a => a !== undefined);
};
