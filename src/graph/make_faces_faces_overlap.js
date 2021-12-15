import math from "../math";
import { make_faces_winding, make_faces_center } from "./make";

const make_faces_faces_overlap = ({ vertices_coords, faces_vertices }, epsilon) => {
	const matrix = Array.from(Array(faces_vertices.length))
		.map(() => Array.from(Array(faces_vertices.length)));
  const faces_winding = make_faces_winding({ vertices_coords, faces_vertices });
  const faces_center = make_faces_center({ vertices_coords, faces_vertices });
  const faces_vertices_coords = faces_vertices
    .map(verts => verts.map(v => vertices_coords[v]))
    .map((polygon, f) => faces_winding[f] ? polygon : polygon.reverse());
	for (let i = 0; i < faces_vertices.length - 1; i++) {
		for (let j = i + 1; j < faces_vertices.length; j++) {
			const overlap = math.core.overlap_convex_polygons(
				faces_vertices_coords[i],
				faces_vertices_coords[j],
				math.core.exclude_s,
				math.core.exclude, // include
				epsilon);
			matrix[i][j] = overlap;
			matrix[j][i] = overlap;
			if (overlap) { continue; }
			const included = math.core.overlap_convex_polygon_point(
				faces_vertices_coords[i],
				faces_center[j],
				math.core.exclude,
				epsilon);
			matrix[i][j] = included;
			matrix[j][i] = included;
		}
	}
	return matrix;
};

export default make_faces_faces_overlap;
