/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	includeS,
	epsilonEqual,
} from "../math/compare.js";
import {
	dot2,
	scale2,
	add2,
	subtract2,
	resize2,
} from "../math/vector.js";
import {
	intersectLineLine,
} from "../math/intersect.js";
import {
	uniqueElements,
} from "../general/array.js";
import {
	clusterSortedGeneric,
} from "../general/cluster.js";
import {
	sweepValues,
} from "./sweep.js";
import {
	removeDuplicateVertices,
} from "./vertices/duplicate.js";
import {
	duplicateEdges,
	removeDuplicateEdges,
} from "./edges/duplicate.js";
import {
	circularEdges,
	removeCircularEdges,
} from "./edges/circular.js";
import {
	invertFlatToArrayMap,
	invertArrayMap,
	invertFlatMap,
	invertArrayToFlatMap,
} from "./maps.js";
import {
	edgeToLine2,
	edgesToLines2,
} from "./edges/lines.js";
import {
	makeVerticesEdgesUnsorted,
} from "./make/verticesEdges.js";
import {
	planarizeCollinearEdges,
} from "./planarizeCollinear.js";

/**
 * @param {FOLD} graph a FOLD object
 * @todo line sweep
 */
export const intersectAllEdges = ({
	vertices_coords,
	vertices_edges,
	edges_vertices,
}, epsilon = EPSILON) => {
	const edgesEdgesLookup = edges_vertices.map(() => ({}));
	edges_vertices.forEach((vertices, e) => vertices
		.flatMap(v => vertices_edges[v])
		.forEach(edge => {
			edgesEdgesLookup[e][edge] = true;
			edgesEdgesLookup[edge][e] = true;
		}));
	const lines = edgesToLines2({ vertices_coords, edges_vertices });
	const results = [];
	// todo: line sweep
	for (let i = 0; i < edges_vertices.length - 1; i += 1) {
		for (let j = i + 1; j < edges_vertices.length; j += 1) {
			if (edgesEdgesLookup[i][j]) { continue; }
			const { a, b, point } = intersectLineLine(
				lines[i],
				lines[j],
				includeS,
				includeS,
				epsilon,
			);
			if (point) {
				if ((epsilonEqual(a, 0) || epsilonEqual(a, 1))
					&& (epsilonEqual(b, 0) || epsilonEqual(b, 1))) {
					continue;
				}
				results.push({ i, j, a, b, point });
			}
		}
	}
	return results;
};

// the face-matching algorithm should go like this:
// prerequisite: vertex map
// the data structure should do something like
// - for every face, here is a list of its vertices.
// - using the vertex-map, find a face with 3 or more matching vertices
// we can't depend on them being in order, because it's possible that for
// every vertex in the face, each edge was split inserting new vertices
// between every pair of old vertices.

/**
 *
 */
export const planarizeNew = (graph, epsilon = EPSILON) => {
	const {
		graph: graphNonCollinear,
		info: infoNonCollinear,
	} = planarizeCollinearEdges(graph, epsilon);

	if (!graphNonCollinear.vertices_edges) {
		graphNonCollinear.vertices_edges = makeVerticesEdgesUnsorted(graphNonCollinear);
	}

	const edgesParams = graphNonCollinear.edges_vertices.map(() => []);

	const intersections = intersectAllEdges(graphNonCollinear);

	intersections
		.filter(({ a }) => !epsilonEqual(a, 0) && !epsilonEqual(a, 1))
		.forEach(({ i, a }) => edgesParams[i].push(a));
	intersections
		.filter(({ b }) => !epsilonEqual(b, 0) && !epsilonEqual(b, 1))
		.forEach(({ j, b }) => edgesParams[j].push(b));

	edgesParams.forEach(points => points.sort((a, b) => a - b));

	const edgesPointClusters = edgesParams
		.map(points => clusterSortedGeneric(points, epsilonEqual))

	/** @param {number[]} numbers */
	const average = (numbers) => (numbers.length
		? numbers.reduce((a, b) => a + b, 0) / numbers.length
		: 0);

	const edgesSplitParams = edgesPointClusters
		.map((clusters, e) => clusters
			.map(cluster => cluster.map(i => edgesParams[e][i]))
			.map(average));

	let newEdgeIndex = 0;
	const edgeNextmap = edgesSplitParams
		.map(params => Array.from(Array(params.length + 1)).map(() => newEdgeIndex++));
	const edgeBackmap = invertArrayToFlatMap(edgeNextmap);

	// this new edges_vertices array will entirely replace the old one.
	let newVertexIndex = graphNonCollinear.vertices_coords.length;
	/** @type {[number, number][]} */
	const edges_verticesNew = edgesSplitParams
		.map(params => params.map(() => newVertexIndex++))
		.map((verts, e) => [
			graphNonCollinear.edges_vertices[e][0],
			...verts,
			graphNonCollinear.edges_vertices[e][1],
		])
		.flatMap(vertices => Array.from(Array(vertices.length - 1))
			.map((_, i) => [vertices[i], vertices[i + 1]]))
		.map(([a, b]) => [a, b]);

	// this vertices_coords array is meant to be appended to the existing
	// vertices_coords array, this only contains the new vertices.
	const additionalVertices_coords = edgesSplitParams.flatMap((params, edge) => {
		if (!params.length) { return []; }
		const line = edgeToLine2(graphNonCollinear, edge);
		return params.map(t => add2(line.origin, scale2(line.vector, t)));
	});

	const vertices_coordsNew = graphNonCollinear.vertices_coords
		.concat(additionalVertices_coords)
		.map(resize2);

	const result = {
		vertices_coords: vertices_coordsNew,
		edges_vertices: edges_verticesNew,
	};

	if (graphNonCollinear.edges_assignment) {
		result.edges_assignment = edgeBackmap
			.map(e => graphNonCollinear.edges_assignment[e]);
	}
	if (graphNonCollinear.edges_foldAngle) {
		result.edges_foldAngle = edgeBackmap
			.map(e => graphNonCollinear.edges_foldAngle[e]);
	}

	removeDuplicateVertices(result);
	removeCircularEdges(result);

	// todo, rebuild faces, match new faces with old faces.

	return result;
};
