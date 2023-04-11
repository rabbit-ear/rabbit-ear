/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description For every face, return a boolean indicating if the face has
 * been flipped over or not (false=flipped), by using the faces_matrix and
 * checking the determinant.
 * @param {number[][]} faces_matrix for every face, a 3x4 transform matrix
 * @returns {boolean[]} true if a face is counter-clockwise.
 * @linkcode Origami ./src/graph/facesWinding.js 10
 */
export const makeFacesWindingFromMatrix = faces_matrix => faces_matrix
	.map(m => m[0] * m[4] - m[1] * m[3])
	.map(c => c >= 0);
/**
 * @description For every face, return a boolean indicating if the face has
 * been flipped over or not (false=flipped), by using a faces_matrix containing
 * 2D matrices.
 * @param {number[][]} faces_matrix2 for every face, a 2x3 transform matrix
 * @returns {boolean[]} true if a face is counter-clockwise.
 * @linkcode Origami ./src/graph/facesWinding.js 21
 */
export const makeFacesWindingFromMatrix2 = faces_matrix2 => faces_matrix2
	.map(m => m[0] * m[3] - m[1] * m[2])
	.map(c => c >= 0);
/**
 * @description For every face, return a boolean if the face's vertices are
 * in counter-clockwise winding. For origami models, this translates to
 * true meaning the face is upright, false meaning the face is flipped over.
 * @param {FOLD} graph a FOLD graph
 * @returns {boolean[]} boolean for every face, true if face is counter-clockwise.
 * @attribution cool trick from https://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
 * @linkcode Origami ./src/graph/facesWinding.js 33
 */
export const makeFacesWinding = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(v => vertices_coords[v])
		.map((point, i, arr) => [point, arr[(i + 1) % arr.length]])
		.map(pts => (pts[1][0] - pts[0][0]) * (pts[1][1] + pts[0][1]))
		.reduce((a, b) => a + b, 0))
	.map(face => face < 0);
