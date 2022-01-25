import math from "../math";
/**
 * @description This method converts the faces_vertices graph data into
 * lists of points. Additionally, it removes any collinear vertices
 * from each polygon because a few algorithms (polygon-intersection) require
 * polygons without adjacent collinear edges.
 * @param {object} a FOLD object.
 */
const make_faces_polygon = ({ vertices_coords, faces_vertices }, epsilon) => {
	return faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]))
		.map(polygon => math.core.make_polygon_non_collinear(polygon, epsilon));
};

export default make_faces_polygon;
