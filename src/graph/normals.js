/**
 * Rabbit Ear (c) Kraft
 */
import {
	normalize3,
	cross3,
	subtract,
	parallel,
	resize,
} from "../math/vector.js";
/**
 * @description Make one vector for every face that represents the
 * face's normal direction. This assumes that the faces are planar
 * and convex. It works by taking the first 3 adjacent non-parallel
 * vertices and compute the cross product from 0 to 1 and 0 to 2.
 * The windings may be flipped if faces are non-convex, otherwise
 * they will still be correct.
 */
export const makeFacesNormal = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(vertex => vertices_coords[vertex]))
	.map(polygon => {
		// we have to verify that the two edges are not parallel
		let a;
		let b;
		let i = 0;
		do {
			a = subtract(polygon[(i + 1) % polygon.length], polygon[i]);
			b = subtract(polygon[(i + 2) % polygon.length], polygon[i]);
			i += 1;
		} while (i < polygon.length && parallel(a, b));
		// cross product unit vectors from point 0 to point 1 and 2.
		// as long as the face winding data is consistent,
		// this gives consistent face normals.
		return normalize3(cross3(resize(3, a), resize(3, b)));
	});
/**
 *
 */
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
	return vertices_normals.map(v => normalize3(v));
};
