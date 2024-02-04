/**
 * Rabbit Ear (c) Kraft
 */
import {
	makeVerticesVertices,
	makeVerticesEdgesUnsorted,
	makeVerticesEdges, // todo resolve this duplicate work
	makeVerticesFaces,
	// makeEdgesEdges,
	makeEdgesFacesUnsorted,
	makeFacesFaces,
	makeFacesEdgesFromVertices,
	makeFacesVerticesFromEdges,
	makePlanarFaces,
} from "./make.js";
import {
	getDimension,
	edgeAssignmentToFoldAngle,
	edgeFoldAngleToAssignment,
} from "../fold/spec.js";
/**
 * @description The purpose of populate() is to take a FOLD graph in any state
 * and modify it to contain as many graph component fields as possible.
 * What constitutes as "populated" is subjective, if a graph only contains
 * vertices and edges,
 * has been one of the hardest methods to
 * nail down, not to write, moreso in what it should do, and what
 * function it serves in the greater library.
 * Currently, it is run once when a user imports their crease pattern
 * for the first time, preparing it for use with methods like
 * "splitFace" or "flatFold", which expect a well-populated graph.
 */
//
// big todo: populate assumes the graph is planar and rebuilds planar faces
//

// try best not to lose information
const buildAssignmentsIfNeeded = (graph) => {
	const len = graph.edges_vertices.length;
	// we know that edges_vertices exists
	if (!graph.edges_assignment) { graph.edges_assignment = []; }
	if (!graph.edges_foldAngle) { graph.edges_foldAngle = []; }
	// complete the shorter array to match the longer one
	if (graph.edges_assignment.length > graph.edges_foldAngle.length) {
		for (let i = graph.edges_foldAngle.length; i < graph.edges_assignment.length; i += 1) {
			graph.edges_foldAngle[i] = edgeAssignmentToFoldAngle(graph.edges_assignment[i]);
		}
	}
	if (graph.edges_foldAngle.length > graph.edges_assignment.length) {
		for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
			graph.edges_assignment[i] = edgeFoldAngleToAssignment(graph.edges_foldAngle[i]);
		}
	}
	// two arrays should be at the same length now. even if they are not complete
	for (let i = graph.edges_assignment.length; i < len; i += 1) {
		graph.edges_assignment[i] = "U";
		graph.edges_foldAngle[i] = 0;
	}
};
/**
 * @param {object} a FOLD object
 * @param {boolean} reface should be set to "true" to force the algorithm into
 * rebuilding the faces from scratch (walking edge to edge in the plane).
 */
const buildFacesIfNeeded = (graph, reface) => {
	// if faces_vertices does not exist, we need to build it.
	// todo: if faces_edges exists but not vertices (unusual but possible),
	// then build faces_vertices from faces_edges and call it done.
	if (reface === undefined
		&& !graph.faces_vertices
		&& !graph.faces_edges
		&& graph.vertices_coords
		&& getDimension(graph) === 2) {
		reface = true;
	}
	// build planar faces (no Z) if the user asks for it, OR if faces do not exist
	// and the graph is determined to be in 2D.
	if (reface && graph.vertices_coords) {
		const faces = makePlanarFaces(graph);
		graph.faces_vertices = faces.faces_vertices;
		graph.faces_edges = faces.faces_edges;
		// graph.faces_sectors = faces.faces_sectors;
		return;
	}
	// if both faces exist, and no request to be rebuilt, exit.
	if (graph.faces_vertices && graph.faces_edges) { return; }
	// between the two: faces_vertices and faces_edges,
	// if only one exists, build the other.
	if (graph.faces_vertices && !graph.faces_edges) {
		graph.faces_edges = makeFacesEdgesFromVertices(graph);
	} else if (graph.faces_edges && !graph.faces_vertices) {
		graph.faces_vertices = makeFacesVerticesFromEdges(graph);
	} else {
		// neither array exists, set placeholder empty arrays.
		graph.faces_vertices = [];
		graph.faces_edges = [];
	}
};
/**
 * this function attempts to rebuild useful geometries in your graph.
 * right now let's say it's important to have:
 * - vertices_coords
 * - either edges_vertices or faces_vertices - todo: this isn't true yet.
 * - either edges_foldAngle or edges_assignment
 *
 * this WILL REWRITE components that aren't the primary source keys,
 * like vertices_vertices.
 *
 * if you do have edges_assignment instead of edges_foldAngle the origami
 * will be limited to flat-foldable.
 */
/**
 * @description Populate all arrays in a FOLD graph. This includes building adjacency
 * components like vertices_vertices, making edges_assignments from foldAngles or
 * visa-versa, and building faces if they don't exist.
 * @param {FOLD} graph a FOLD object
 * @param {boolean} [reface=false] optional boolean, request to rebuild all faces
 * @return {FOLD} graph the same input graph object
 * @linkcode Origami ./src/graph/populate.js 114
 */
const populate = (graph, reface) => {
	if (typeof graph !== "object") { return graph; }
	if (!graph.edges_vertices) { return graph; }
	graph.vertices_edges = makeVerticesEdgesUnsorted(graph);
	graph.vertices_vertices = makeVerticesVertices(graph);
	graph.vertices_edges = makeVerticesEdges(graph);
	// make sure "edges_foldAngle" and "edges_assignment" are built
	buildAssignmentsIfNeeded(graph);
	// make sure "faces_vertices" and "faces_edges" are built
	buildFacesIfNeeded(graph, reface);
	// depending on the presence of vertices_vertices, this will
	// run the simple algorithm (no radial sorting) or the proper one.
	graph.vertices_faces = makeVerticesFaces(graph);
	graph.edges_faces = makeEdgesFacesUnsorted(graph);
	graph.faces_faces = makeFacesFaces(graph);
	return graph;
};

export default populate;
