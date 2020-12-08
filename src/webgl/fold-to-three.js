import math from "../math";
import window from "../environment/window"
import { fn_cat } from "../arguments/functions";

const { THREE } = window;
// if three doesn't exist, throw an error

// const make_faces_geometry = (graph, material) => {
const make_faces_geometry = (graph) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = graph.vertices_coords
    .map(v => [v[0], v[1], v[2] || 0])
    .reduce(fn_cat, []);
  const normals = graph.vertices_coords
    .map(v => [0, 0, 1])
    .reduce(fn_cat, []);
  const colors = graph.vertices_coords
    .map(v => [1, 1, 1])
    .reduce(fn_cat, []);
  const faces = graph.faces_vertices
    .map(fv => fv
      .map((v, i, arr) => [arr[0], arr[i+1], arr[i+2]])
      .slice(0, fv.length - 2))
    .reduce(fn_cat, [])
    .reduce(fn_cat, []);
  geometry.addAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.addAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(faces);
  return geometry;
};
  // if (material == undefined) { material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide}); }
  // return new THREE.Mesh(geometry, material);

const make_edge_cylinder = (edge_coords, edge_vector, radius) => {
  if (math.core.magSq(edge_vector) < math.core.EPSILON) { throw "degenerate edge"; }
  const normalized = ear.math.normalize(edge_vector);
  const perp = [ [1,0,0], [0,1,0], [0,0,1] ]
    .map(vec => ear.math.normalize(math.core.cross3(normalized, vec)))
    .map((v,i) => ({ i, v, mag: math.core.magnitude(v) }))
    .filter(el => el.mag > math.core.EPSILON)
    .map(obj => obj.v)
    .shift()
  const rotated = [perp];
  for (let i = 1; i < 4; i += 1) {
    rotated.push(ear.math.normalize(math.core.cross3(rotated[i-1], normalized)));
  }
  const dirs = rotated
    .map(v => ear.math.scale(v, radius));
  return edge
    .map(v => dirs.map(dir => math.core.add(v, dir)))
    .reduce(fn_cat, []);
}

const make_edges_geometry = function ({
  vertices_coords, edges_vertices, edges_assignment, edges_coords, edges_vector
}, scale=0.002) {
  if (!edges_coords) {
    edges_coords = edges_vertices.map(edge => edge.map(v => vertices_coords[v]));
  }
  if (!edges_vector) {
    edges_vector = edges_coords.map(edge => math.core.subtract(edge[1], edge[0]));
  }
  // make sure they all have a z component. when z is implied it's 0
  edges_coords = edges_coords
    .map(edge => edge
      .map(coord => math.core.resize(3, coord)));
  const colorAssignments = {
    "B": [0.0,0.0,0.0],
 // "M": [0.9,0.31,0.16],
    "M": [0.0,0.0,0.0],//[34/255, 76/255, 117/255], //[0.6,0.2,0.11],
    "F": [0.0,0.0,0.0],//[0.25,0.25,0.25],
    "V": [0.0,0.0,0.0],//[227/255, 85/255, 54/255]//[0.12,0.35,0.50]
  };

  const colors = edges_assignment.map(e => 
    [colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e],
    colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e]]
  ).reduce(fn_cat, [])
   .reduce(fn_cat, [])
   .reduce(fn_cat, []);

  const vertices = edges_coords
    .map((coords, i) => make_edge_cylinder(coords, edges_vector[i], scale))
    .reduce(fn_cat, [])
    .reduce(fn_cat, []);

  const normals = edges_vector.map(vector => {
    if (math.core.magSq(vector) < math.core.EPSILON) { throw "degenerate edge"; }
    let normalized = math.core.normalize(vector);
    // scale to line width
    const scaled = math.core.scale(normalized, scale);
    // let scaled = [normalized[0]*scale, normalized[1]*scale, normalized[2]*scale];
    const c0 = math.core.scale(math.core.normalize(math.core.cross3(vec, [0,0,-1])), scale);
    const c1 = math.core.scale(math.core.normalize(math.core.cross3(vec, [0,0,1])), scale);
    // let c0 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,-1])), scale);
    // let c1 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,1])), scale);
    return [
      c0, [-c0[2], c0[1], c0[0]],
      c1, [-c1[2], c1[1], c1[0]],
      c0, [-c0[2], c0[1], c0[0]],
      c1, [-c1[2], c1[1], c1[0]]
    ]
  }).reduce(fn_cat, [])
    .reduce(fn_cat, []);

  let faces = edges_coords.map((e,i) => [
    // 8 triangles making the long cylinder
    i*8+0, i*8+4, i*8+1,
    i*8+1, i*8+4, i*8+5,
    i*8+1, i*8+5, i*8+2,
    i*8+2, i*8+5, i*8+6,
    i*8+2, i*8+6, i*8+3,
    i*8+3, i*8+6, i*8+7,
    i*8+3, i*8+7, i*8+0,
    i*8+0, i*8+7, i*8+4,
    // endcaps
    i*8+0, i*8+1, i*8+3,
    i*8+1, i*8+2, i*8+3,
    i*8+5, i*8+4, i*8+7,
    i*8+7, i*8+6, i*8+5,
  ]).reduce(fn_cat, []);

  const geometry = new THREE.BufferGeometry();
  geometry.addAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.addAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(faces);
  geometry.computeVertexNormals();
  return geometry;
};

//   var material = new THREE.MeshToonMaterial( {
//       shininess: 0,
//       side: THREE.DoubleSide, vertexColors: THREE.VertexColors
//   } );
//   return new THREE.Mesh(geometry, material);
// }