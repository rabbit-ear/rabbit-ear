/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	includeS,
} from "../math/compare.js";
import {
	magSquared2,
	scale2,
	dot2,
	add2,
	subtract2,
	resize2,
} from "../math/vector.js";
import {
	intersectLineLine,
} from "../math/intersect.js";
import {
	epsilonUniqueSortedNumbers,
	setDifferenceSortedEpsilonNumbers,
} from "../general/array.js";
import {
	sweepValues,
} from "./sweep.js";
import {
	invertFlatToArrayMap,
	invertFlatMap,
} from "./maps.js";
import {
	remove,
} from "./remove.js";
import {
	edgeIsolatedVertices,
	removeIsolatedVertices,
} from "./vertices/isolated.js";
import {
	isVertexCollinear,
	// removeCollinearVertex, // this method could move here someday
} from "./vertices/collinear.js";
import {
	removeDuplicateVertices,
} from "./vertices/duplicate.js";
import {
	getEdgesLine,
} from "./edges/lines.js";
import {
	duplicateEdges,
	removeDuplicateEdges,
} from "./edges/duplicate.js";
import {
	circularEdges,
	removeCircularEdges,
} from "./edges/circular.js";
import {
	makeVerticesEdgesUnsorted,
} from "./make/verticesEdges.js";

/**
 *
 */
const getLinesIntersections = (lines, epsilon = EPSILON) => {
	const linesIntersect = lines.map(() => []);
	for (let i = 0; i < lines.length - 1; i += 1) {
		for (let j = i + 1; j < lines.length; j += 1) {
			const { a, b, point } = intersectLineLine(
				lines[i],
				lines[j],
				includeS,
				includeS,
				epsilon,
			);
			// lines are parallel
			if (point === undefined) { continue; }
			linesIntersect[i].push(a);
			linesIntersect[j].push(b);
		}
	}
	return linesIntersect;
};

/**
 * @description NOTICE this method is used internally and not yet ready for
 * general use. It only works on graphs with no faces and requires cleanup later.
 * @param {FOLD} graph a FOLD object
 * @param {number} vertex
 * @returns {number}
 */
const removeCollinearVertex = ({ edges_vertices, vertices_edges }, vertex) => {
	// edges[0] will remain. edges[1] will be removed
	const edges = vertices_edges[vertex].sort((a, b) => a - b);
	const otherVertices = edges
		.flatMap(e => edges_vertices[e])
		.filter(v => v !== vertex)
	/** @type {[number, number]} */
	const newEdgeVertices = [otherVertices[0], otherVertices[1]];
	edges_vertices[edges[0]] = newEdgeVertices;
	edges_vertices[edges[1]] = undefined;
	newEdgeVertices.forEach(v => {
		const oldEdgeIndex = vertices_edges[v].indexOf(edges[1]);
		if (oldEdgeIndex === -1) { return; }
		vertices_edges[v][oldEdgeIndex] = edges[0];
	});
	return edges[1];
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
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {FOLD} a planarized FOLD object
 */
export const planarize = ({
	vertices_coords,
	edges_vertices,
	edges_assignment,
	edges_foldAngle,
}, epsilon = EPSILON) => {
	const {
		lines,
		edges_line,
	} = getEdgesLine({ vertices_coords, edges_vertices }, epsilon);

	// "compress" all edges down into a smaller set of infinite lines,
	// we will be projecting points down onto non-normalized vectors,
	// the dot products will be scaled by this much, we need to divide
	// by this to convert the parameters back into coordinate space.
	const linesSquareLength = lines.map(({ vector }) => magSquared2(vector));

	// one to many mapping of a line and the edges along it.
	const lines_edges = invertFlatToArrayMap(edges_line);

	// for each edge and its corresponding line, project the edge's endpoints
	// onto the line as a scalar of the line's vector from its origin.
	const edges_scalars = edges_vertices
		.map((verts, e) => verts
			.map(v => vertices_coords[v])
			.map(point => dot2(
				subtract2(point, lines[edges_line[e]].origin),
				lines[edges_line[e]].vector,
			)));

	// for each line, a flat sorted list of all scalars along that line
	// coming from all of the edges' endpoints.
	const lines_flatEdgeScalars = lines_edges
		.map(edges => edges.flatMap(edge => edges_scalars[edge]))
		.map(numbers => epsilonUniqueSortedNumbers(numbers, epsilon));

	// for each line, get the smallest and largest value (defining the range)
	// compare every line against every other, gather all intersections.
	// "intersections" contains some intersections that are outside the
	// relevant areas. more filtering will happen when we start to apply them.
	// for every line, an array of sorted scalars of the line's vector
	// at the location of an intersection with another line.
	const lines_intersections = getLinesIntersections(lines, epsilon)
		.map(numbers => epsilonUniqueSortedNumbers(numbers, epsilon))
		.map((numbers, i) => numbers.map(n => n * linesSquareLength[i]))
		// for every line, the subset of all intersections along the line
		// that are not duplicates of endpoints of collinear edges to the line.
		.map((sects, i) => (
			setDifferenceSortedEpsilonNumbers(sects, lines_flatEdgeScalars[i], epsilon)
		));

	// walk the line
	// create an alternative form of the graph for the sweep method.
	const sweepScalars = lines_edges
		.map(edges => edges.flatMap(edge => edges_scalars[edge]));
	/** @type {[number, number][][]} */
	const sweepEdgesVertices = lines_edges
		.map(edges => invertFlatMap(edges)
			.map(e => [e * 2, e * 2 + 1]));
	const lineSweeps = lines_edges.map((_, i) => sweepValues(
		{ edges_vertices: sweepEdgesVertices[i] },
		sweepScalars[i],
		epsilon,
	));
	const lineSweeps_vertices = lineSweeps.map(sweep => sweep.map(el => el.t));
	const lineSweeps_edges = lineSweeps.map(sweep => {
		const current = {};
		const edges = sweep.map(el => {
			el.start.forEach(n => { current[n] = true; });
			el.end.forEach(n => { delete current[n]; });
			return Object.keys(current).map(n => parseInt(n, 10));
		});
		edges.pop();
		return edges;
	});
	lines_intersections.forEach((points, i) => {
		const vertices = lineSweeps_vertices[i];
		const edges = lineSweeps_edges[i];
		// insert points into vertices (and make corresponding duplicate in edges)
		let pi = 0;
		let vi = 0;
		while (pi < points.length && vi < vertices.length - 1) {
			if (points[pi] <= vertices[vi]) { throw new Error("bad algorithm"); }
			if (points[pi] > vertices[vi + 1]) { vi += 1; continue; }
			vertices.splice(vi + 1, 0, points[pi]);
			edges.splice(vi + 1, 0, edges[vi]);
			pi += 1;
		}
	});

	// walk lineSweeps_vertices, lineSweeps_edges, remove edges which span
	// across the empty space in a line where no previous edges existed.
	const new_vertices_coords = lineSweeps_vertices
		.flatMap((scalars, i) => scalars
			.map(s => s / linesSquareLength[i])
			.map(s => add2(lines[i].origin, scale2(lines[i].vector, s))));

	// create a connected list of vertices, for every line, until the new line.
	// [0,1] [1,2], [2,3] [3,4] then a new line [5, 6]... (don't connect 4-5)
	// console.log("new_vertices_coords", new_vertices_coords);
	// console.log("new_vertices_coords2", new_vertices_coords2);
	let e = 0;
	const new_edges_vertices = lineSweeps_edges
		.map(edges => {
			const vertices = edges.map(() => [e, ++e]);
			e += 1;
			return vertices;
		})
		.flatMap((edges, i) => edges
			.filter((_, j) => lineSweeps_edges[i][j].length))
		.map(resize2);
	const result = {
		vertices_coords: new_vertices_coords,
		edges_vertices: new_edges_vertices,
	};
	if (edges_assignment || edges_foldAngle) {
		const edges_prevEdge = lineSweeps_edges
			.flatMap(edges => edges.filter(arr => arr.length));
		if (edges_assignment) {
			result.edges_assignment = edges_prevEdge
				.map(prev => edges_assignment[prev[0]]);
		}
		if (edges_foldAngle) {
			result.edges_foldAngle = edges_prevEdge
				.map(prev => edges_foldAngle[prev[0]]);
		}
	}
	removeIsolatedVertices(result, edgeIsolatedVertices(result));

	// this single method call takes up the majority of the time of this method.
	removeDuplicateVertices(result, epsilon);
	removeCircularEdges(result);

	// remove collinear vertices
	// these vertices_edges are unsorted and will be removed at the end.
	result.vertices_edges = makeVerticesEdgesUnsorted(result);
	const collinearVertices = result.vertices_edges
		.map((edges, i) => (edges.length === 2 ? i : undefined))
		.filter(a => a !== undefined)
		.filter(v => isVertexCollinear(result, v, epsilon))
		.reverse();
	const edgesToRemove = collinearVertices
		.map(v => removeCollinearVertex(result, v));
	remove(result, "edges", edgesToRemove);
	remove(result, "vertices", collinearVertices);
	const dupEdges = duplicateEdges(result);
	if (dupEdges.length) {
		removeDuplicateEdges(result, dupEdges);
	}
	if (circularEdges(result).length) {
		console.error("planarize: found circular edges");
	}
	delete result.vertices_edges;
	return result;
};
