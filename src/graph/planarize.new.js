/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/general/constant.js";
import { epsilonEqual } from "../math/general/function.js";
import {
	normalize2,
	dot2,
	cross2,
	scale2,
	add2,
	subtract2,
} from "../math/algebra/vector.js";
import {
	edgeIsolatedVertices,
	removeIsolatedVertices,
} from "./vertices/isolated.js";
import { intersectLineLine } from "../math/intersect/intersect.js";
import { pointInBoundingBox } from "../math/intersect/encloses.js";
import { epsilonUniqueSortedNumbers } from "../general/arrays.js";
import { getEdgesLine } from "./edges/lines.js";
import { boundingBox } from "./boundary.js";
import { sweepValues } from "./sweep.js";

import {
	edgeAssignmentToFoldAngle,
	edgeFoldAngleToAssignment,
	filterKeysWithPrefix,
} from "../fold/spec.js";
import { removeDuplicateVertices } from "./vertices/duplicate.js";
import { removeDuplicateEdges } from "./edges/duplicate.js";
import { removeCircularEdges } from "./edges/circular.js";
import { getVerticesEdgesOverlap } from "./intersect/verticesEdges.js";
import { getEdgesEdgesIntersection } from "./intersect/edgesEdges.js";
import { sortVerticesAlongVector } from "./vertices/sort.js";
import {
	mergeNextmaps,
	invertMap,
} from "./maps.js";
import Messages from "../environment/messages.js";
import { makeVerticesEdgesUnsorted } from "./make.js";
/**
 *
 */
export const lineLine = (a, b, epsilon = EPSILON) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize2(a.vector), normalize2(b.vector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(a.vector, b.vector);
	const determinant1 = -determinant0;
	const a2b = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	return [
		cross2(a2b, b.vector) / determinant0,
		cross2(b2a, a.vector) / determinant1,
	];
};
/**
 *
 */
const getLinesIntersections = (lines, lines_range, epsilon = EPSILON) => {
	const isInside = (number, range) => (
		number > range[0] - epsilon && number < range[1] + epsilon
	);
	const linesIntersect = lines.map(() => []);
	for (let a = 0; a < lines.length - 1; a += 1) {
		for (let b = a + 1; b < lines.length; b += 1) {
			const intersection = lineLine(lines[a], lines[b], epsilon);
			// lines are parallel
			if (intersection === undefined) { continue; }
			const [t0, t1] = intersection;
			if (isInside(t0, lines_range[a])) { linesIntersect[a].push(t0); }
			if (isInside(t1, lines_range[b])) { linesIntersect[b].push(t1); }
		}
	}
	return linesIntersect;
};

/**
 * @description During the planarize process, faces will be entirely
 * re-constructed, edges will be chopped; we can remove most arrays from
 * the graph in preparation.
 * @param {FOLD} graph a FOLD graph. modified in place.
 */
const planarizePrepare = (graph) => {
	// project all vertices onto the XY plane
	graph.vertices_coords = graph.vertices_coords
		.map(coord => coord.slice(0, 2));
	// these arrays will stay in the graph.
	const planarKeepKeys = [
		"vertices_coords",
		"edges_vertices",
		"edges_assignment",
		"edges_foldAngle",
	];
	// remove arrays from graph
	["vertices", "edges", "faces"]
		.flatMap(key => filterKeysWithPrefix(graph, key))
		.filter(key => !(planarKeepKeys.includes(key)))
		.forEach(key => delete graph[key]);
};
/**
 * @description Return a modified version of set "a" that filters
 * out any number that exists in set "b".
 */
const sortedNumberSetDifference = (a, b, epsilon = EPSILON) => {
	const result = [];
	let ai = 0;
	let bi = 0;
	while (ai < a.length && bi < b.length) {
		if (epsilonEqual(a[ai], b[bi], epsilon)) {
			ai += 1;
			continue;
		}
		if (a[ai] > b[bi]) {
			bi += 1;
			continue;
		}
		if (b[bi] > a[ai]) {
			result.push(a[ai]);
			ai += 1;
			continue;
		}
	}
	return result;
};
/**
 * @description Planarize a graph into the 2D XY plane, split edges, rebuild faces.
 * The graph provided as a method argument will be modified in place.
 * @algorithm
 * - create an axis-aligned bounding box of all the vertices.
 * - create unique lines that represent all edges, with a mapping of
 * edges to lines and visa-versa (one line to many edges. one edge to one line).
 * - intersect all lines against each other, reject those which lie outside
 * of the bounding box enclosing the entire graph.
 * - for each line, gather all edges, project each endpoint down to the line,
 * each edge is now two numbers (sort these).
 * - add the set of intersection points to this set, for each line.
 * - also, sort the larger array of values by their start points.
 * - walk down the line and group edges into connected edge groups.
 * groups join connected edges and separate them from the empty spaces between.
 * as we walk, if an intersection point is in the empty space, ignore it.
 * - build each group into a connected set of segments (optional challenge:
 * do this by re-using the vertices in place).
 * do this for every line.
 * - somehow we need to apply the edge-assignment/fold angle/possibly
 * other attributes.
 * - if lines overlap, competing assignments will need to be resolved:
 * M/V above all, then perhaps Cut/Join, then unassigned, then boundary/flat.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a summary of changes to the graph
 * @linkcode Origami ./src/graph/fragment.js 174
 */
const planarize = ({
	vertices_coords,
	edges_vertices,
	edges_assignment,
	edges_foldAngle,
}, epsilon = EPSILON) => {
	if (!vertices_coords || !vertices_coords.length || !edges_vertices) {
		return undefined;
	}
	// flip y axis for debugging. remove later.
	vertices_coords.forEach((_, i) => { vertices_coords[i][1] *= -1; });
	console.time("planarize");
	// "compress" all edges down into a smaller set of infinite lines,
	const { lines, edges_line } = getEdgesLine({
		vertices_coords, edges_vertices,
	}, epsilon);
	// one to many mapping of a line and the edges along it.
	const lines_edges = invertMap(edges_line)
		.map(arr => (arr.constructor === Array ? arr : [arr]));
	// for each edge and its corresponding line, project the edge's endpoints
	// down onto the line as a scalar of the line's vector from its origin.
	const edges_scalars = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map((coords, i) => coords.map(point => dot2(
			subtract2(point, lines[edges_line[i]].origin),
			lines[edges_line[i]].vector,
		)));
	// using these numbers, sort the edges_vertices so that for every edge,
	// the first vertex comes first along the line's vector (is smaller than)
	edges_scalars.forEach((pair, i) => {
		if (pair[0] < pair[1]) {
			edges_vertices[i] = edges_vertices[i].slice().reverse();
			edges_scalars[i].reverse();
		}
	});
	// for each line, a flat sorted list of all scalars along that line
	// coming from all of the edges' endpoints.
	const lines_flatEdgeScalars = lines_edges
		.map(edges => edges.flatMap(edge => edges_scalars[edge]))
		.map(numbers => epsilonUniqueSortedNumbers(numbers, epsilon));
	const lines_range = lines_flatEdgeScalars
		.map(scalars => [scalars[0], scalars[scalars.length - 1]]);
	// "intersections" contains some intersections that are outside the
	// relevant areas. more filtering will happen when we start to apply them.
	// for every line, an array of sorted scalars of the line's vector
	// at the location of an intersection with another line.
	const lines_intersections = getLinesIntersections(lines, lines_range, epsilon)
		.map(numbers => epsilonUniqueSortedNumbers(numbers, epsilon));
	// for every line, the subset of all intersections along the line
	// that are not duplicates of endpoints of collinear edges to the line.
	const lines_uniqueIntersections = lines_intersections.map((sects, i) => (
		sortedNumberSetDifference(sects, lines_flatEdgeScalars[i], epsilon)
	));
	// walk the line
	// create an alternative form of the graph for the sweep method.
	const sweepScalars = lines_edges
		.map(edges => edges.flatMap(edge => edges_scalars[edge]));
	const sweepEdgesVertices = lines_edges.map(edges => {
		const lineEdges = [];
		edges.forEach((e, i) => { lineEdges[e] = [i * 2, i * 2 + 1]; });
		return lineEdges;
	});
	const lineSweeps = lines_edges.map((_, i) => sweepValues(sweepScalars[i], {
		edges_vertices: sweepEdgesVertices[i],
	}, epsilon));
	const lineSweeps_vertices = lineSweeps.map(sweep => sweep.map(el => el.t));
	const lineSweeps_edges = lineSweeps.map(sweep => {
		const current = [];
		const edges = sweep.map(el => {
			el.end.forEach(n => { delete current[n]; });
			el.start.forEach(n => { current[n] = true; });
			return Object.keys(current).map(n => parseInt(n, 10));
		});
		edges.pop();
		return edges;
	});
	lines_uniqueIntersections.forEach((points, i) => {
		const vertices = lineSweeps_vertices[i];
		const edges = lineSweeps_edges[i];
		// insert points into vertices (and make corresponding duplicate in edges)
		let pi = 0;
		let vi = 0;
		while (pi < points.length && vi < vertices.length - 1) {
			if (epsilonEqual(vertices[vi], points[pi], epsilon)) {
				throw new Error("bad algorithm");
			}
			if (points[pi] > vertices[vi + 1]) {
				vi += 1;
				continue;
			}
			vertices.splice(vi + 1, 0, points[pi]);
			edges.splice(vi + 1, 0, edges[vi]);
			pi += 1;
		}
		// return { vertices: newVertices, edges: newEdges };
	});

	// walk lineSweeps_vertices, lineSweeps_edges, remove edges which span
	// across the empty space in a line where no previous edges existed.

	const lines_vertices_coords = lineSweeps_vertices
		.map((scalars, i) => scalars
			.map(s => add2(lines[i].origin, scale2(lines[i].vector, s))));

	const lines_vertices = lineSweeps_vertices.map(() => []);
	let v = 0;
	lineSweeps_vertices
		.forEach((verts, i) => verts
			.forEach(() => lines_vertices[i].push(v++)));
	const lines_edges_verticesPrefilter = lineSweeps_edges
		.map((edges, i) => edges
			.map((_, j) => [lines_vertices[i][j], lines_vertices[i][j + 1]]));

	// create a connected list, for every line, until the new line.
	// [0,1] [1,2], [2,3] [3,4] then a new line [5, 6]... (don't connect 4-5)
	// let e = 0;
	// const lines_edges_verticesPrefilter = lineSweeps_edges.map(edges => {
	// 	const result = edges.map(() => [e, ++e]);
	// 	e += 1;
	// 	return result;
	// });
	const lines_edges_vertices = lines_edges_verticesPrefilter
		.map((edges, i) => edges
			.filter((_, j) => lineSweeps_edges[i][j].length));
	const lines_edges_prevEdge = lineSweeps_edges
		.map(edges => edges.filter(arr => arr.length));
	console.timeEnd("planarize");
	const edges_prevEdge = lines_edges_prevEdge.flat();
	const result = {
		vertices_coords: lines_vertices_coords.flat(),
		edges_vertices: lines_edges_vertices.flat(),
		edges_assignment: edges_prevEdge.map(prev => edges_assignment[prev[0]]),
		edges_foldAngle: edges_prevEdge.map(prev => edges_foldAngle[prev[0]]),
	};
	console.time("isolated vertices");
	// const isolated = edgeIsolatedVertices(result);
	// removeIsolatedVertices(result, isolated);
	console.timeEnd("isolated vertices");
	console.time("duplicate vertices");
	// removeDuplicateVertices(result, epsilon);
	console.timeEnd("duplicate vertices");
	// console.log("lines", lines);
	// console.log("edges_line", edges_line);
	// console.log("lines_edges", lines_edges);
	// console.log("edges_scalars", edges_scalars);
	// console.log("lines_flatEdgeScalars", lines_flatEdgeScalars);
	// console.log("lines_range", lines_range);
	// console.log("lines_intersections", lines_intersections);
	// console.log("lines_uniqueIntersections", lines_uniqueIntersections);
	// console.log("sweepScalars", sweepScalars);
	// console.log("sweepEdgesVertices", sweepEdgesVertices);
	console.log("lineSweeps", lineSweeps);
	console.log("lineSweeps_vertices", lineSweeps_vertices);
	console.log("lineSweeps_edges", lineSweeps_edges);
	console.log("lines_vertices_coords", lines_vertices_coords);
	// console.log("lines_vertices", lines_vertices);
	console.log("lines_edges_verticesPrefilter", lines_edges_verticesPrefilter);
	console.log("lines_edges_vertices", lines_edges_vertices);
	console.log("lines_edges_prevEdge", lines_edges_prevEdge);
	console.log("result", result);
	return result;
};

export default planarize;
