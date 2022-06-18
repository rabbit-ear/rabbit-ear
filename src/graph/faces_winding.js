/**
 * Rabbit Ear (c) Kraft
 */
/**
 * true/false: which face shares color with root face
 * the root face (and any similar-color face) will be marked as true
 *
 * this face coloring skips marks joining the two faces separated by it.
 * it relates directly to if a face is flipped or not (determinant > 0)
 */
export const make_faces_winding_from_matrix = faces_matrix => faces_matrix
	.map(m => m[0] * m[4] - m[1] * m[3])
	.map(c => c >= 0);
// the 2D matrix
export const make_faces_winding_from_matrix2 = faces_matrix => faces_matrix
	.map(m => m[0] * m[3] - m[1] * m[2])
	.map(c => c >= 0);

// cool trick from https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
/**
 * @returns {boolean[]} true if a face is counter-clockwise. this should also
 * mean a true face is upright, false face is flipped.
 */
export const make_faces_winding = ({ vertices_coords, faces_vertices }) => {
	return faces_vertices
		.map(vertices => vertices
			.map(v => vertices_coords[v])
			.map((point, i, arr) => [point, arr[(i + 1) % arr.length]])
			.map(pts => (pts[1][0] - pts[0][0]) * (pts[1][1] + pts[0][1]) )
			.reduce((a, b) => a + b, 0))
		.map(face => face < 0);
};
