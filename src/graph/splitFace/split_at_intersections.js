/**
 * Rabbit Ear (c) Kraft
 */
import splitEdge from "../splitEdge/index.js";
import {
	mergeNextmaps,
	mergeBackmaps,
	invertSimpleMap,
} from "../maps.js";
/**
 * @description this is a highly specific method, it takes in the output
 * from intersectConvexFaceLine and applies it to a graph by splitting
 * the edges (in the case of edge, not vertex intersection),
 * @param {object} a FOLD object. modified in place.
 * @param {object} the result from calling "intersectConvexFaceLine".
 * each value must be an array. these will be modified in place.
 * @returns {object} with "vertices" and "edges" keys where
 * - vertices is an array of indices (the new vertices)
 * - edges is an object with keys "map", the changes to edge array, and
 * "remove", the indices of edges that have been removed.
 * look inside of "map" at the indices from "removed" for the indices
 * of the new edges which replaced them.
 */
const split_at_intersections = (graph, { vertices, edges }) => {
	// intersection will contain 2 items, either in "vertices" or "edges",
	// however we will split edges and store their new vertex in "vertices"
	// so in the end, "vertices" will contain 2 items.
	let map;
	// split the edge (modifying the graph), and store the changes so that during
	// the next loop the second edge to split will be updated to the new index
	const split_results = edges.map((el) => {
		const res = splitEdge(graph, map ? map[el.edge] : el.edge, el.coords);
		map = map ? mergeNextmaps(map, res.edges.map) : res.edges.map;
		return res;
	});
	vertices.push(...split_results.map(res => res.vertex));
	// if two edges were split, the second one contains a "remove" key that was
	// based on the mid-operation graph, update this value to match the graph
	// before any changes occurred.
	let bkmap;
	// todo: if we extend this to include non-convex polygons, this is the
	// only part of the code we need to test. cumulative backmap merge.
	// this was written without any testing, as convex polygons never have
	// more than 2 intersections
	split_results.forEach(res => {
		res.edges.remove = bkmap ? bkmap[res.edges.remove] : res.edges.remove;
		const inverted = invertSimpleMap(res.edges.map);
		bkmap = bkmap ? mergeBackmaps(bkmap, inverted) : inverted;
	});
	return {
		vertices,
		edges: {
			map,
			remove: split_results.map(res => res.edges.remove),
		},
	};
};

export default split_at_intersections;
