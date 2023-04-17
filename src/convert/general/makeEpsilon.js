/**
 * Rabbit Ear (c) Kraft
 */
import { boundingBox } from "../../graph/boundary.js";
import { distance } from "../../math/algebra/vector.js";

const shortestEdgeLength = ({ vertices_coords, edges_vertices }) => {
	const lengths = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map(segment => distance(...segment));
	const minLen = lengths
		.reduce((a, b) => Math.min(a, b), Infinity);
	return minLen === Infinity ? undefined : minLen;
};

const makeEpsilon = ({ vertices_coords, edges_vertices }) => {
	const shortest = shortestEdgeLength({ vertices_coords, edges_vertices });
	if (shortest) { return shortest / 4; }
	const bounds = boundingBox({ vertices_coords });
	return bounds && bounds.span
		? 1e-3 * Math.max(...bounds.span)
		: 1e-3;
};

export default makeEpsilon;
