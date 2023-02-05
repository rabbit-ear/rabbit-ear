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
	// makeEdgesFoldAngle,
	// makeEdgesAssignment,
	// makeEdgesVector,
	makeFacesFaces,
	makeFacesEdgesFromVertices,
	makeFacesVerticesFromEdges,
	makePlanarFaces,
} from "./make.js";
import {
	edgeAssignmentToFoldAngle,
	edgeFoldAngleToAssignment,
} from "../fold/spec.js";
/**
 * @description populate() has been one of the hardest methods to
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
const build_assignments_if_needed = (graph) => {
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
const build_faces_if_needed = (graph, reface) => {
	// if faces_vertices does not exist, we need to build it.
	// todo: if faces_edges exists but not vertices (unusual but possible),
	// then build faces_vertices from faces_edges and call it done.
	if (reface === undefined && !graph.faces_vertices && !graph.faces_edges) {
		reface = true;
	}
	// build planar faces (no Z) if the user asks for it or if faces do not exist.
	// todo: this is making a big assumption that the faces are even planar
	// to begin with.
	if (reface && graph.vertices_coords) {
		const faces = makePlanarFaces(graph);
		graph.faces_vertices = faces.map(face => face.vertices);
		graph.faces_edges = faces.map(face => face.edges);
		// graph.faces_sectors = faces.map(face => face.angles);
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
 * @param {FOLD} graph a FOLD graph
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
	// todo consider adding vertices_sectors, these are used for
	// planar graphs (crease patterns) for walking faces
	// todo, what is the reason to have edges_vector?
	// if (graph.vertices_coords) {
	//   graph.edges_vector = makeEdgesVector(graph);
	// }
	// make sure "edges_foldAngle" and "edges_assignment" are done.
	build_assignments_if_needed(graph);
	// make sure "faces_vertices" and "faces_edges" are built.
	build_faces_if_needed(graph, reface);
	// depending on the presence of vertices_vertices, this will
	// run the simple algorithm (no radial sorting) or the proper one.
	graph.vertices_faces = makeVerticesFaces(graph);
	graph.edges_faces = makeEdgesFacesUnsorted(graph);
	graph.faces_faces = makeFacesFaces(graph);
	return graph;
};

/**
 * old description:
 * populate() will assess each graph component that is missing and
 * attempt to create as many as possible.
 *
 * this WILL NOT rewrite components, if a key exists, it will leave it alone
 *
 * example: to make populate() rebuild faces_vertices, run ahead of time:
 *  - delete graph.faces_vertices
 * so that the query evalutes to == null (undefined)
 */

// const populate = function (graph) {
//   if (typeof graph !== "object") { return; }
//   if (graph.vertices_vertices == null) {
//     if (graph.vertices_coords && graph.edges_vertices) {
//       FOLDConvert.edges_vertices_to_vertices_vertices_sorted(graph);
//     } else if (graph.edges_vertices) {
//       FOLDConvert.edges_vertices_to_vertices_vertices_unsorted(graph);
//     }
//   }
//   if (graph.faces_vertices == null) {
//     if (graph.vertices_coords && graph.vertices_vertices) {
//       // todo, this can be rebuilt to remove vertices_coords dependency
//       FOLDConvert.vertices_vertices_to_faces_vertices(graph);
//     }
//   }
//   if (graph.faces_edges == null) {
//     if (graph.faces_vertices) {
//       FOLDConvert.faces_vertices_to_faces_edges(graph);
//     }
//   }
//   if (graph.edges_faces == null) {
//     const edges_faces = makeEdgesFaces(graph);
//     if (edges_faces !== undefined) {
//       graph.edges_faces = edges_faces;
//     }
//   }
//   if (graph.vertices_faces == null) {
//     const vertices_faces = makeVerticesFaces(graph);
//     if (vertices_faces !== undefined) {
//       graph.vertices_faces = vertices_faces;
//     }
//   }
//   if (graph.edges_length == null) {
//     const edges_length = makeEdgesLength(graph);
//     if (edges_length !== undefined) {
//       graph.edges_length = edges_length;
//     }
//   }
//   if (graph.edges_foldAngle == null
//     && graph.edges_assignment != null) {
//     graph.edges_foldAngle = graph.edges_assignment
//       .map(a => edgeAssignmentToFoldAngle(a));
//   }
//   if (graph.edges_assignment == null
//     && graph.edges_foldAngle != null) {
//     graph.edges_assignment = graph.edges_foldAngle.map((a) => {
//       if (a === 0) { return "F"; }
//       if (a < 0) { return "M"; }
//       if (a > 0) { return "V"; }
//       return "U";
//     });
//     // todo, this does not find borders, we need an algorithm to walk around
//   }
//   if (graph.faces_faces == null) {
//     const faces_faces = makeFacesFaces(graph);
//     if (faces_faces !== undefined) {
//       graph.faces_faces = faces_faces;
//     }
//   }
//   if (graph.vertices_edges == null) {
//     const vertices_edges = makeVerticesEdgesUnsorted(graph);
//     if (vertices_edges !== undefined) {
//       graph.vertices_edges = vertices_edges;
//     }
//   }
//   if (graph.edges_edges == null) {
//     const edges_edges = makeEdgesEdges(graph);
//     if (edges_edges !== undefined) {
//       graph.edges_edges = edges_edges;
//     }
//   }
// };

export default populate;
