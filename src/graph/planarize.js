/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/general/constant.js";
import { subtract } from "../math/algebra/vector.js";
import * as S from "../general/strings.js";
import {
	edgeAssignmentToFoldAngle,
	edgeFoldAngleToAssignment,
	filterKeysWithPrefix,
} from "../fold/spec.js";
import { removeDuplicateVertices } from "./vertices/duplicate.js";
import { removeDuplicateEdges } from "./edges/duplicate.js";
import { removeCircularEdges } from "./edges/circular.js";
import { getVerticesEdgesOverlap } from "./vertices/collinear.js";
import { makeEdgesEdgesIntersection } from "./intersect.js";
import { sortVerticesAlongVector } from "./sort.js";
import {
	mergeNextmaps,
	invertMap,
} from "./maps.js";
import Messages from "../environment/messages.js";
/**
 * Fragment converts a graph into a planar graph. it flattens all the
 * coordinates onto the 2D plane.
 *
 * it modifies edges and vertices. splitting overlapping edges
 * at their intersections, merging vertices that lie too near to one another.
 * # of edges may increase. # of vertices may decrease. (is that for sure?)
 *
 * This function requires an epsilon (1e-6), for example a busy
 * edge crossing should be able to resolve to one point
 *
 * 1. merge vertices that are within the epsilon.
 *
 * 2. gather all intersections, for every line.
 *    for example, the first line in the list gets compared to other lines
 *    resulting in a list of intersection points,
 *
 * 3. replace the edge with a new, rebuilt, sequence of edges, with
 *    new vertices.
 */
const fragment_graph = (graph, epsilon = EPSILON) => {
	const edges_coords = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]));
	// when we rebuild an edge we need the intersection points sorted
	// so we can walk down it and rebuild one by one. sort along vector
	const edges_vector = edges_coords.map(e => subtract(e[1], e[0]));
	const edges_origin = edges_coords.map(e => e[0]);
	// for each edge, get all the intersection points
	// this array will match edges_, each an array containing intersection
	// points (an [x,y] array), with an important detail, because each edge
	// intersects with another edge, this [x,y] point is a shallow pointer
	// to the same one in the other edge's intersection array.
	const edges_intersections = makeEdgesEdgesIntersection({
		vertices_coords: graph.vertices_coords,
		edges_vertices: graph.edges_vertices,
		edges_vector,
		edges_origin,
	}, 1e-6);
	// check the new edges' vertices against every edge, in case
	// one of the endpoints lies along an edge.
	const edges_collinear_vertices = getVerticesEdgesOverlap({
		vertices_coords: graph.vertices_coords,
		edges_vertices: graph.edges_vertices,
		edges_coords,
	}, epsilon);
	// exit early
	if (edges_intersections.flat().filter(a => a !== undefined).length === 0
		&& edges_collinear_vertices.flat().filter(a => a !== undefined).length === 0) {
		return undefined;
	}
	// remember, edges_intersections contains intersections [x,y] points
	// each one appears twice (both edges that intersect) and is the same
	// object, shallow pointer.
	//
	// iterate over this list and move each vertex into new_vertices_coords.
	// in their place put the index of this new vertex in the new array.
	// when we get to the second appearance of the same point, it will have
	// been replaced with the index, so we can skip it. (check length of
	// item, 2=point, 1=index)
	const counts = { vertices: graph.vertices_coords.length };
	// add new vertices (intersection points) to the graph
	edges_intersections
		.forEach(edge => edge
			.filter(a => a !== undefined)
			.filter(a => a.length === 2)
			.forEach((intersect) => {
				const newIndex = graph.vertices_coords.length;
				graph.vertices_coords.push([...intersect]);
				intersect.splice(0, 2);
				intersect.push(newIndex);
			}));
	// replace arrays with indices
	edges_intersections.forEach((edge, i) => {
		edge.forEach((intersect, j) => {
			if (intersect) {
				edges_intersections[i][j] = intersect[0];
			}
		});
	});

	const edges_intersections_flat = edges_intersections
		.map(arr => arr.filter(a => a !== undefined));
	// add lists of vertices into each element in edges_vertices
	// edges verts now contains an illegal arrangement of more than 2 verts
	// to be resolved below
	graph.edges_vertices.forEach((verts, i) => verts
		.push(...edges_intersections_flat[i], ...edges_collinear_vertices[i]));
	// .push(...edges_intersections_flat[i]));

	graph.edges_vertices.forEach((edge, i) => {
		graph.edges_vertices[i] = sortVerticesAlongVector({
			vertices_coords: graph.vertices_coords,
		}, edge, edges_vector[i]);
	});

	// edge_map is length edges_vertices in the new, fragmented graph.
	// the value at each index is the edge that this edge was formed from.
	const edge_map = graph.edges_vertices
		.map((edge, i) => Array(edge.length - 1).fill(i))
		.flat();

	graph.edges_vertices = graph.edges_vertices
		.map(edge => Array.from(Array(edge.length - 1))
			.map((_, i, arr) => [edge[i], edge[i + 1]])) // todo, is this supposed to be % arr.length
		.flat();
	// copy over edge metadata if it exists
	// make foldAngles and assignments match if foldAngle is longer
	if (graph.edges_assignment && graph.edges_foldAngle
		&& graph.edges_foldAngle.length > graph.edges_assignment.length) {
		for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
			graph.edges_assignment[i] = edgeFoldAngleToAssignment(graph.edges_foldAngle[i]);
		}
	}
	// copy over assignments and fold angle and base fold angle off assigments if it's shorter
	if (graph.edges_assignment) {
		graph.edges_assignment = edge_map.map(i => graph.edges_assignment[i] || "U");
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle = edge_map
			.map(i => graph.edges_foldAngle[i])
			.map((a, i) => (a === undefined
				? edgeAssignmentToFoldAngle(graph.edges_assignment[i])
				: a));
	}
	return {
		vertices: {
			new: Array.from(Array(graph.vertices_coords.length - counts.vertices))
				.map((_, i) => counts.vertices + i),
		},
		edges: {
			backmap: edge_map,
		},
	};
};

const fragment_keep_keys = [
	S._vertices_coords,
	S._edges_vertices,
	S._edges_assignment,
	S._edges_foldAngle,
];
/**
 * @description Planarize a graph into the 2D XY plane, split edges, rebuild faces.
 * The graph provided as a method argument will be modified in place.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a summary of changes to the graph
 * @linkcode Origami ./src/graph/fragment.js 174
 */
const fragment = (graph, epsilon = EPSILON) => {
	// project all vertices onto the XY plane
	graph.vertices_coords = graph.vertices_coords.map(coord => coord.slice(0, 2));

	[S._vertices, S._edges, S._faces]
		.map(key => filterKeysWithPrefix(graph, key))
		.flat()
		.filter(key => !(fragment_keep_keys.includes(key)))
		.forEach(key => delete graph[key]);

	const change = {
		vertices: {},
		edges: {},
	};
	let i;
	// most of the time this will loop twice, but exit early during the second
	// iteration due to all checks being passed. rarely, but still possible,
	// the merging of two vertices will bring one of the vertices over another
	// vertex junction, creating more edge-edge overlaps which requires another
	// iteration through this loop. at most, this has only ever been
	// observed to require one or two more loops, about 3 loops in total.
	for (i = 0; i < 20; i += 1) {
		const resVert = removeDuplicateVertices(graph, epsilon / 2);
		const resEdgeDup = removeDuplicateEdges(graph);
		const resEdgeCirc = removeCircularEdges(graph);
		const resFrag = fragment_graph(graph, epsilon);
		if (resFrag === undefined) {
			change.vertices.map = (change.vertices.map === undefined
				? resVert.map
				: mergeNextmaps(change.vertices.map, resVert.map));
			change.edges.map = (change.edges.map === undefined
				? mergeNextmaps(resEdgeDup.map, resEdgeCirc.map)
				: mergeNextmaps(change.edges.map, resEdgeDup.map, resEdgeCirc.map));
			break;
		}
		const invert_frag = invertMap(resFrag.edges.backmap);
		const edgemap = mergeNextmaps(resEdgeDup.map, resEdgeCirc.map, invert_frag);
		change.vertices.map = (change.vertices.map === undefined
			? resVert.map
			: mergeNextmaps(change.vertices.map, resVert.map));
		change.edges.map = (change.edges.map === undefined
			? edgemap
			: mergeNextmaps(change.edges.map, edgemap));
	}
	if (i === 20) {
		throw new Error(Messages.fragment);
	}
	return change;
};

export default fragment;
