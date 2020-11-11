
// todo, expand this to include edges, edges_faces, etc..
const explode_faces = (graph) => {
  const vertices_coords = graph.faces_vertices
    .map(face => face.map(v => graph.vertices_coords[v]))
    .reduce((a, b) => a.concat(b), []);
  let i = 0;
  const faces_vertices = graph.faces_vertices
    .map(face => face.map(v => i++));
  return {
    vertices_coords: JSON.parse(JSON.stringify(vertices_coords)),
    faces_vertices,
  }
};


export default explode_faces;
