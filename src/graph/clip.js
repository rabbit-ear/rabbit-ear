/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import { getBoundary } from "./boundary";

// convex poly only!
const clip = function (
	{vertices_coords, vertices_edges, edges_vertices, edges_assignment, boundaries_vertices},
	line) {
	if (!boundaries_vertices) {
		boundaries_vertices = getBoundary({
			vertices_edges, edges_vertices, edges_assignment
		}).vertices;
	}
	return math.polygon(boundaries_vertices.map(v => vertices_coords[v]))
		.clip(line);
};

export default clip;
