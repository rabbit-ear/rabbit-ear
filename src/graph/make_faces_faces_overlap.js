import math from "../math";

const make_faces_faces_overlap = ({ vertices_coords, faces_vertices }, epsilon = math.core.EPSILON) => {
	const matrix = Array.from(Array(faces_vertices.length))
		.map(() => Array.from(Array(faces_vertices.length)));
  const faces_vertices_coords = faces_vertices
    .map(verts => verts.map(v => vertices_coords[v]))
	for (let i = 0; i < faces_vertices.length - 1; i++) {
		for (let j = i + 1; j < faces_vertices.length; j++) {
			const overlap = math.core.overlap_convex_polygons(
				faces_vertices_coords[i],
				faces_vertices_coords[j],
				// math.core.exclude,
				epsilon);
			matrix[i][j] = overlap;
			matrix[j][i] = overlap;
		}
	}
	return matrix;
};

export default make_faces_faces_overlap;
