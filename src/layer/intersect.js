/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	exclude,
	excludeS,
	epsilonEqual,
	epsilonEqualVectors,
} from "../math/compare.js";
import {
	overlapLineLine,
	overlapBoundingBoxes,
	overlapConvexPolygonPoint,
} from "../math/overlap.js";
import {
	normalize,
	dot,
} from "../math/vector.js";
import {
	makeEdgesVector,
	makeEdgesBoundingBox,
	makeEdgesCoords,
} from "../graph/make.js";
import {
	boundingBox,
} from "../math/polygon.js";
import {
	intersectConvexPolygonLine,
} from "../math/intersect.js";
import {
	makeFacesWinding,
} from "../graph/faces/winding.js";

/**
 * @description Create an NxN matrix (N number of edges) that relates edges to each other,
 * inside each entry is true/false, true if the two edges are parallel within an epsilon.
 * Both sides of the matrix are filled, the diagonal is left undefined.
 * @param {FOLD} graph a FOLD object
 * @param {number} [normalizedEpsilon=1e-6] an optional epsilon used in dot()
 * for normalized vectors. this epsilon should be small.
 * @returns {boolean[][]} a boolean matrix, are two edges parallel?
 * @todo wait, no, this is not setting the main diagonal undefined now. what is up?
 * @linkcode Origami ./src/graph/edgesEdges.js 82
 */
const makeEdgesEdgesParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, normalizedEpsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const normalized = edges_vector.map(vec => normalize(vec));
	const edgesEdgesParallel = edges_vertices.map(() => []);
	normalized.forEach((_, i) => {
		normalized.forEach((__, j) => {
			if (j >= i) { return; }
			if ((1 - Math.abs(dot(normalized[i], normalized[j])) < normalizedEpsilon)) {
				edgesEdgesParallel[i].push(j);
				edgesEdgesParallel[j].push(i);
			}
		});
	});
	return edgesEdgesParallel;
};

/**
 * @description
 * @param {FOLD}
 * @param {{ lines: VecLine[], edges_line: number[] }}
 * @returns {boolean[][]}
 */
export const getParallelOverlappingEdges = (
	{ vertices_coords, edges_vertices },
	{ lines, edges_line },
	epsilon = EPSILON,
) => {
	const edges_projections = edges_vertices
		.map(vertices => vertices.map(v => vertices_coords[v]))
		.map((points, e) => points
			.map(point => dot(lines[edges_line[e]].vector, point)));

};

/**
 * @description Find all edges which are parallel to each other AND they overlap.
 * The epsilon space around vertices is not considered, so, edges must be
 * overlapping beyond just their endpoints for them to be considered.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean[][]} a boolean matrix, do two edges cross each other?
 */
export const makeEdgesEdgesParallelOverlap = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	const edges_line = edges_vector
		.map((vector, i) => ({ vector, origin: edges_origin[i] }));
	// start with edges-edges parallel matrix
	// only if lines are parallel, then run the more expensive overlap method
	return makeEdgesEdgesParallel({
		vertices_coords, edges_vertices, edges_vector,
	}, 1e-3).map((arr, i) => arr.filter(j => overlapLineLine(
		edges_line[i],
		edges_line[j],
		excludeS,
		excludeS,
		epsilon,
	)));
};

const booleanMatrixToIndexedArray = matrix => matrix
	.map(row => row
		.map((value, i) => (value === true ? i : undefined))
		.filter(a => a !== undefined));

const makeEdgesEdgesSimilar = ({
	vertices_coords, edges_vertices, edges_coords, edges_boundingBox,
}, epsilon = EPSILON) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	if (!edges_boundingBox) {
		edges_boundingBox = makeEdgesBoundingBox({
			vertices_coords, edges_vertices, edges_coords,
		});
	}
	const indexFirst = edges_vertices.map((_, i) => i).shift();
	const matrix = Array.from(Array(edges_coords.length)).map(() => []);
	if (indexFirst === undefined) { return booleanMatrixToIndexedArray(matrix); }
	const dimensions = edges_boundingBox[indexFirst].min.length;
	for (let i = 0; i < edges_coords.length - 1; i += 1) {
		if (!edges_boundingBox[i]) { continue; }
		for (let j = i + 1; j < edges_coords.length; j += 1) {
			if (!edges_boundingBox[j]) { continue; }
			let similar = true;
			for (let d = 0; d < dimensions; d += 1) {
				if (!epsilonEqual(
					edges_boundingBox[i].min[d],
					edges_boundingBox[j].min[d],
					epsilon,
				) || !epsilonEqual(
					edges_boundingBox[i].max[d],
					edges_boundingBox[j].max[d],
					epsilon,
				)) {
					similar = false;
				}
			}
			matrix[i][j] = similar;
			matrix[j][i] = similar;
		}
	}
	for (let i = 0; i < edges_coords.length - 1; i += 1) {
		for (let j = i + 1; j < edges_coords.length; j += 1) {
			if (!matrix[i][j]) { continue; }
			const test0 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][0], epsilon)
				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][1], epsilon);
			const test1 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][1], epsilon)
				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][0], epsilon);
			const similar = test0 || test1;
			matrix[i][j] = similar;
			matrix[j][i] = similar;
		}
	}
	return booleanMatrixToIndexedArray(matrix);
};

/**
 * @description For every edge, a list of face indices which overlap the edge.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} for every edge, an array of face indices
 * which overlap this edge or an empty if no faces overlap the edge.
 */
export const getEdgesFacesOverlap = ({
	vertices_coords, edges_vertices, edges_vector, edges_faces, faces_vertices,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	// use graph vertices_coords for edges vertices
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	const matrix = edges_vertices
		.map(() => Array.from(Array(faces_vertices.length)));
	edges_faces.forEach((faces, e) => faces
		.forEach(f => { matrix[e][f] = false; }));
	const edges_coords = edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	// todo: is this okay if it contains adjacent collinear edges?
	const faces_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	makeFacesWinding({ vertices_coords, faces_vertices })
		.map((winding, i) => (!winding ? i : undefined))
		.filter(f => f !== undefined)
		.forEach(f => faces_coords[f].reverse());
	const edges_boundingBox = makeEdgesBoundingBox({ edges_coords });
	const faces_bounds = faces_coords.map(coords => boundingBox(coords));
	// should be inclusive, positive epsilon, we are filtering out
	// edge face pairs which DEFINITELY don't overlap.
	for (let e = 0; e < matrix.length; e += 1) {
		if (!edges_boundingBox[e]) { continue; }
		for (let f = 0; f < matrix[e].length; f += 1) {
			if (matrix[e][f] === false) { continue; }
			if (!faces_bounds[f]) { continue; }
			if (!overlapBoundingBoxes(faces_bounds[f], edges_boundingBox[e], epsilon)) {
				matrix[e][f] = false;
				continue;
			}
		}
	}
	// edges similar. able to duplicate solutions to other edges if they exist.
	const edges_similar = makeEdgesEdgesSimilar({
		vertices_coords, edges_vertices, edges_coords, edges_boundingBox,
	});
	// compute overlap
	const finished_edges = {};
	for (let e = 0; e < matrix.length; e += 1) {
		if (finished_edges[e]) { continue; }
		if (!edges_coords[e]) { continue; }
		for (let f = 0; f < matrix[e].length; f += 1) {
			if (matrix[e][f] !== undefined) { continue; }
			if (!faces_coords[f]) { continue; }
			const point_in_poly = edges_coords[e]
				.map(point => overlapConvexPolygonPoint(
					faces_coords[f],
					point,
					exclude,
					1e-3,
				).overlap).reduce((a, b) => a || b, false);
			if (point_in_poly) { matrix[e][f] = true; continue; }
			const edge_intersect = intersectConvexPolygonLine(
				faces_coords[f],
				{ vector: edges_vector[e], origin: edges_origin[e] },
				excludeS,
				excludeS,
				epsilon,
			);
			if (edge_intersect) { matrix[e][f] = true; continue; }
			matrix[e][f] = false;
		}
		edges_similar[e].forEach(adjacent_edge => {
			matrix[adjacent_edge] = matrix[e].slice();
			finished_edges[adjacent_edge] = true;
		});
	}
	return matrix
		.map(faces => faces
			.map((overlap, i) => (overlap ? i : undefined))
			.filter(i => i !== undefined));
};
