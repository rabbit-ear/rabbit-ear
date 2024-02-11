/**
 * Rabbit Ear (c) Kraft
 */
import {
	normalize3,
	cross3,
	subtract3,
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
 * @param {FOLD} graph a FOLD object
 * @returns {number[][]} an array of 3D vectors, one for every face
 */
export const makeFacesNormal = ({ vertices_coords, faces_vertices }) => {
	// ensure that all points are in 3D
	const vertices_coords3D = vertices_coords
		.map(coord => resize(3, coord));

	return faces_vertices
		.map(vertices => vertices
			.map(vertex => vertices_coords3D[vertex]))
		.map(polygon => {
			// we have to ensure that the two edges we choose are not parallel
			let a;
			let b;
			let i = 0;
			do {
				a = subtract3(polygon[(i + 1) % polygon.length], polygon[i]);
				b = subtract3(polygon[(i + 2) % polygon.length], polygon[i]);
				i += 1;
			} while (i < polygon.length && parallel(a, b));

			// cross product unit vectors from point 0 to point 1 and 2.
			// as long as the face winding data is consistent,
			// this gives consistent face normals.
			return normalize3(cross3(a, b));
		});
};

/**
 * @description Make one vector for every vertex that represents the
 * vertex's normal direction. In this case a vertex normal is the average
 * of all of the face's normals incident to this vertex.
 * @param {FOLD} graph a FOLD object
 * @returns {number[][]} an array of 3D vectors, one for every vertex
 */
export const makeVerticesNormal = ({ vertices_coords, faces_vertices, faces_normal }) => {
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}

	// add method that modifies the input parameter to save memory
	const add3 = (a, b) => {
		a[0] += b[0];
		a[1] += b[1];
		a[2] += b[2];
	};

	// for every vertex's face, add the vector to the vertex's vector
	const vertices_normals = vertices_coords.map(() => [0, 0, 0]);
	faces_vertices
		.forEach((vertices, f) => vertices
			.forEach(v => add3(vertices_normals[v], faces_normal[f])));

	// normalize all summed vectors and return them
	return vertices_normals.map(v => normalize3(v));
};
