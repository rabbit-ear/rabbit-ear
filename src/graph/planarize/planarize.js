/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../../math/constant.js";
import {
	invertArrayMap,
	mergeNextmaps,
} from "../maps.js";
import {
	planarizeCollinearEdges,
} from "./planarizeCollinearEdges.js";
import {
	planarizeOverlaps,
} from "./planarizeOverlaps.js";
import {
	planarizeCollinearVertices,
} from "./planarizeCollinearVertices.js";
import {
	planarizeMakeFaces
} from "./planarizeMakeFaces.js";

/**
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{ result: FOLD, changes: object }}
 */
export const planarizeEdges = (graph, epsilon = EPSILON) => {
	// first step: resolve all collinear and overlapping edges,
	// after this point, no two edges parallel-overlap each other.
	const {
		result: graphNonCollinear,
		changes: {
			vertices: { map: verticesMap1 },
			edges: { map: edgesMap1 },
			// edges_line,
			// lines,
		},
	} = planarizeCollinearEdges(graph, epsilon);

	// second step: resolve all crossing edges,
	// after this point the graph is planar, no two edges overlap.
	const {
		result: graphNoOverlaps,
		changes: {
			vertices: { map: verticesMap2 },
			edges: { map: edgesMap2 },
		}
	} = planarizeOverlaps(graphNonCollinear, epsilon);

	// third step: remove all degree-2 vertices which lie between
	// two parallel edges of the same assignment (currently, any assignment)
	const {
		result: planarGraph,
		changes: {
			vertices: { map: verticesMap3 },
			edges: { map: edgesMap3 }
		}
	} = planarizeCollinearVertices(graphNoOverlaps, epsilon);

	const vertexNextMap = mergeNextmaps(verticesMap1, verticesMap2, verticesMap3);
	const edgeNextMap = mergeNextmaps(edgesMap1, edgesMap2, edgesMap3);

	return {
		result: planarGraph,
		changes: {
			vertices: { map: vertexNextMap },
			edges: { map: edgeNextMap },
		}
	};
};

/**
 * @description To be renamed to "planarize" and replace the current method
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{ result: FOLD, changes: object }}
 */
export const planarizeVEF = (graph, epsilon = EPSILON) => {
	const {
		result,
		changes: {
			vertices: { map: vertexNextMap },
			edges: { map: edgeNextMap },
		}
	} = planarizeEdges(graph, epsilon);

	// const vertexBackMap = invertArrayMap(vertexNextMap);
	const edgeBackMap = invertArrayMap(edgeNextMap);

	const {
		faces_vertices,
		faces_edges,
		faceMap,
	} = planarizeMakeFaces(graph, result, edgeBackMap);

	result.faces_vertices = faces_vertices;
	result.faces_edges = faces_edges;

	return {
		result,
		changes: {
			vertices: { map: vertexNextMap },
			edges: { map: edgeNextMap },
			faces: { map: faceMap },
		}
	};
};
