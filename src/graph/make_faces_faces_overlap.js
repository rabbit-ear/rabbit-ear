import math from "../math";
import make_faces_polygon from "./faces_polygon";

// const make_faces_faces_overlap = ({ vertices_coords, faces_vertices }, epsilon = math.core.EPSILON) => {
// 	const matrix = Array.from(Array(faces_vertices.length))
// 		.map(() => Array.from(Array(faces_vertices.length)));
//   const faces_polygon = make_faces_polygon({ vertices_coords, faces_vertices }, epsilon);
// 	for (let i = 0; i < faces_vertices.length - 1; i++) {
// 		for (let j = i + 1; j < faces_vertices.length; j++) {
// 			const intersection = math.core.intersect_polygon_polygon(
// 				faces_polygon[i],
// 				faces_polygon[j],
// 				// math.core.exclude,
// 				epsilon);
// 			console.log("testing", faces_polygon[i], faces_polygon[j], intersection, epsilon);
// 			const overlap = intersection.length !== 0;
// 			matrix[i][j] = overlap;
// 			matrix[j][i] = overlap;
// 		}
// 	}
// 	return matrix;
// };

const make_faces_faces_overlap = ({ vertices_coords, faces_vertices }, epsilon = math.core.EPSILON) => {
	const matrix = Array.from(Array(faces_vertices.length))
		.map(() => Array.from(Array(faces_vertices.length)));
  const faces_polygon = make_faces_polygon({ vertices_coords, faces_vertices }, epsilon);
	for (let i = 0; i < faces_vertices.length - 1; i++) {
		for (let j = i + 1; j < faces_vertices.length; j++) {
			const overlap = math.core.overlap_convex_polygons(
				faces_polygon[i],
				faces_polygon[j],
				// math.core.exclude,
				epsilon);
			matrix[i][j] = overlap;
			matrix[j][i] = overlap;
		}
	}
	return matrix;
};

export default make_faces_faces_overlap;
