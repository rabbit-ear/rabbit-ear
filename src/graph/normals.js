/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";

export const makeFacesNormal = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(vertex => vertices_coords[vertex]))
	.map(polygon => {
		// cross product unit vectors from point 0 to point 1 and 2.
		// as long as the face winding data is consistent, this gives consistent face normals
		const a = math.core.resize(3, math.core.subtract(polygon[1], polygon[0]));
		const b = math.core.resize(3, math.core.subtract(polygon[2], polygon[0]));
		return math.core.normalize3(math.core.cross3(a, b));
	});

export const makeVerticesNormal = ({ vertices_coords, faces_vertices, faces_normal }) => {
	// add two 3D vectors, store result in first parameter
	const add3 = (a, b) => { a[0] += b[0]; a[1] += b[1]; a[2] += b[2]; };
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	const vertices_normals = vertices_coords.map(() => [0, 0, 0]);
	faces_vertices
		.forEach((vertices, f) => vertices
			.forEach(v => add3(vertices_normals[v], faces_normal[f])));
	return vertices_normals.map(v => math.core.normalize3(v));
};
