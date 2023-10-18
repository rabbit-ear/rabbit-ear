/**
 * Rabbit Ear (c) Kraft
 */
import { boundingBox } from "../../graph/boundary.js";
import { distance } from "../../math/vector.js";
/**
 * @description We ignore any segment lengths which are smaller than 1e-4,
 * assuming that these are errors, circular edges, etc...
 */
const shortestEdgeLength = ({ vertices_coords, edges_vertices }) => {
	const lengths = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map(segment => distance(...segment))
		.filter(len => len > 1e-4);
	const minLen = lengths
		.reduce((a, b) => Math.min(a, b), Infinity);
	return minLen === Infinity ? undefined : minLen;
};
/**
 * @description Epsilon will be based on a factor of the edge lengths
 * and a factor of the size of the total crease pattern, whichever is
 * smaller
 */
const makeEpsilon = ({ vertices_coords, edges_vertices }) => {
	const shortest = shortestEdgeLength({ vertices_coords, edges_vertices });
	const bounds = boundingBox({ vertices_coords });
	const graphSpan = bounds && bounds.span ? Math.max(...bounds.span) : 1;
	const spanScale = graphSpan * 1e-2;
	const edgeScale = shortest / 20;
	return shortest === undefined ? spanScale : Math.min(spanScale, edgeScale);
};

export default makeEpsilon;
