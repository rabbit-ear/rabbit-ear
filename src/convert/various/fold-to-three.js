/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";
import window from "../../environment/window.js";
// if three doesn't exist, throw an error
// const make_faces_geometry = (graph, material) => {
export const make_faces_geometry = (graph) => {
	const { THREE } = window();
	const vertices = graph.vertices_coords
		.map(v => [v[0], v[1], v[2] || 0])
		.flat();
	const normals = graph.vertices_coords
		.map(() => [0, 0, 1])
		.flat();
	const colors = graph.vertices_coords
		.map(() => [1, 1, 1])
		.flat();
	const faces = graph.faces_vertices
		.map(fv => fv
			.map((v, i, arr) => [arr[0], arr[i + 1], arr[i + 2]])
			.slice(0, fv.length - 2))
		.flat(2);
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
	geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
	geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
	geometry.setIndex(faces);
	return geometry;
};

const make_edge_cylinder = (edge_coords, edge_vector, radius, end_pad = 0) => {
	if (math.magSquared(edge_vector) < math.EPSILON) {
		return [];
	}
	const normalized = math.normalize(edge_vector);
	const perp = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
		.map(vec => math.cross3(vec, normalized))
		.sort((a, b) => math.magnitude(b) - math.magnitude(a))
		.shift();
	const rotated = [math.normalize(perp)];
	// const mat = math.make_matrix3_rotate(Math.PI/9, normalized);
	// for (let i = 1; i < 4; i += 1) {
	// 	rotated.push(math.multiply_matrix3_vector3(mat, rotated[i - 1]));
	// }
	for (let i = 1; i < 4; i += 1) {
		rotated.push(math.cross3(rotated[i - 1], normalized));
	}
	const dirs = rotated.map(v => math.scale(v, radius));
	const nudge = [-end_pad, end_pad].map(n => math.scale(normalized, n));
	const coords = end_pad === 0
		? edge_coords
		: edge_coords.map((coord, i) => math.add(coord, nudge[i]));
	// console.log(dirs);
	return coords
		.map(v => dirs.map(dir => math.add(v, dir)))
		.flat();
};

export const make_edges_geometry = function ({
	vertices_coords, edges_vertices, edges_assignment, edges_coords, edges_vector,
}, scale = 0.002, end_pad = 0) {
	const { THREE } = window();
	if (!edges_coords) {
		edges_coords = edges_vertices.map(edge => edge.map(v => vertices_coords[v]));
	}
	if (!edges_vector) {
		edges_vector = edges_coords.map(edge => math.subtract(edge[1], edge[0]));
	}
	// make sure they all have a z component. when z is implied it's 0
	edges_coords = edges_coords
		.map(edge => edge
			.map(coord => math.resize(3, coord)));
	edges_vector = edges_vector
		.map(vec => math.resize(3, vec));
	const colorAssignments = {
		B: [0.0, 0.0, 0.0],
		// M: [0.9, 0.31, 0.16],
		M: [0.0, 0.0, 0.0], // [34/255, 76/255, 117/255], //[0.6,0.2,0.11],
		F: [0.0, 0.0, 0.0], // [0.25,0.25,0.25],
		V: [0.0, 0.0, 0.0], // [227/255, 85/255, 54/255]//[0.12,0.35,0.50]
	};

	const colors = edges_assignment.map(e => [
		colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e],
		colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e],
	]).flat(3);

	const vertices = edges_coords
		.map((coords, i) => make_edge_cylinder(coords, edges_vector[i], scale, end_pad))
		.flat(2);

	const normals = edges_vector.map(vector => {
		if (math.magSquared(vector) < math.EPSILON) {
			throw new Error("degenerate edge");
		}
		const normalized = math.normalize(vector);
		// scale to line width
		// const scaled = math.scale(normalized, scale);
		// let scaled = [normalized[0]*scale, normalized[1]*scale, normalized[2]*scale];
		const c0 = math.scale(math.normalize(math.cross3(vector, [0, 0, -1])), scale);
		const c1 = math.scale(math.normalize(math.cross3(vector, [0, 0, 1])), scale);
		// let c0 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,-1])), scale);
		// let c1 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,1])), scale);
		return [
			c0, [-c0[2], c0[1], c0[0]],
			c1, [-c1[2], c1[1], c1[0]],
			c0, [-c0[2], c0[1], c0[0]],
			c1, [-c1[2], c1[1], c1[0]],
		];
	}).flat(2);

	const faces = edges_coords.map((e, i) => [
		// 8 triangles making the long cylinder
		i * 8 + 0, i * 8 + 4, i * 8 + 1,
		i * 8 + 1, i * 8 + 4, i * 8 + 5,
		i * 8 + 1, i * 8 + 5, i * 8 + 2,
		i * 8 + 2, i * 8 + 5, i * 8 + 6,
		i * 8 + 2, i * 8 + 6, i * 8 + 3,
		i * 8 + 3, i * 8 + 6, i * 8 + 7,
		i * 8 + 3, i * 8 + 7, i * 8 + 0,
		i * 8 + 0, i * 8 + 7, i * 8 + 4,
		// endcaps
		i * 8 + 0, i * 8 + 1, i * 8 + 3,
		i * 8 + 1, i * 8 + 2, i * 8 + 3,
		i * 8 + 5, i * 8 + 4, i * 8 + 7,
		i * 8 + 7, i * 8 + 6, i * 8 + 5,
	]).flat();

	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
	geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
	geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
	geometry.setIndex(faces);
	geometry.computeVertexNormals();
	return geometry;
};
