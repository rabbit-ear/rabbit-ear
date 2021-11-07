/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import window from "../environment/window"
import { fn_cat } from "../symbols/functions";

// if three doesn't exist, throw an error

// const make_faces_geometry = (graph, material) => {
export const make_faces_geometry = (graph) => {
	const { THREE } = window;
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
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(faces);
  return geometry;
};

const make_edge_cylinder = (edge_coords, edge_vector, radius, end_pad = 0) => {
  if (math.core.mag_squared(edge_vector) < math.core.EPSILON) {
		return [];
	}
  const normalized = math.core.normalize(edge_vector);
  const perp = [ [1,0,0], [0,1,0], [0,0,1] ]
    .map(vec => math.core.cross3(vec, normalized))
		.sort((a, b) => math.core.magnitude(b) - math.core.magnitude(a))
		.shift();
  const rotated = [ math.core.normalize(perp) ];
	// const mat = math.core.make_matrix3_rotate(Math.PI/9, normalized);
  // for (let i = 1; i < 4; i += 1) {
	// 	rotated.push(math.core.multiply_matrix3_vector3(mat, rotated[i - 1]));
  // }
	for (let i = 1; i < 4; i += 1) {
		rotated.push(math.core.cross3(rotated[i - 1], normalized));
	}
  const dirs = rotated.map(v => math.core.scale(v, radius));
	const nudge = [-end_pad, end_pad].map(n => math.core.scale(normalized, n));
	const coords = end_pad === 0
		? edge_coords
		: edge_coords.map((coord, i) => math.core.add(coord, nudge[i]));
	//console.log(dirs);
  return coords
    .map(v => dirs.map(dir => math.core.add(v, dir)))
    .reduce(fn_cat, []);
};

export const make_edges_geometry = function ({
  vertices_coords, edges_vertices, edges_assignment, edges_coords, edges_vector
}, scale=0.002, end_pad = 0) {
	const { THREE } = window;
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
	edges_vector = edges_vector
		.map(vec => math.core.resize(3, vec));
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
    .map((coords, i) => make_edge_cylinder(coords, edges_vector[i], scale, end_pad))
    .reduce(fn_cat, [])
    .reduce(fn_cat, []);

	const normals = edges_vector.map(vector => {
    if (math.core.mag_squared(vector) < math.core.EPSILON) { throw "degenerate edge"; }
    let normalized = math.core.normalize(vector);
    // scale to line width
    const scaled = math.core.scale(normalized, scale);
    // let scaled = [normalized[0]*scale, normalized[1]*scale, normalized[2]*scale];
    const c0 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0,0,-1])), scale);
    const c1 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0,0,1])), scale);
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
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setIndex(faces);
  geometry.computeVertexNormals();
  return geometry;
};
