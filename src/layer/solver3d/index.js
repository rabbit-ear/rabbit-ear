/**
 * Rabbit Ear (c) Kraft
 */
import {
	makeFacesEdgesFromVertices,
	makeEdgesFacesUnsorted,
	makeEdgesAssignmentSimple,
	makeEdgesFoldAngle,
	makeFacesFaces,
} from "../../graph/make.js";
import { makeEpsilon } from "../general.js";
import { setup } from "./setup.js";
import solver2d from "../solver2d/solver.js";
import LayerPrototype from "../solver2d/prototype.js";
//
const emptyLayerSolution = () => ({ root: {}, branches: [], faces_winding: [] });
/**
 * @description This layer solver extends the taco/tortilla method by Jason Ku
 * into 3D by largely sorting faces into groups of coplanar-overlapping faces
 * and adding a few new types of constraints which join faces between groups.
 * This algorithm still requires faces be convex, and faces must be planar.
 * @param {FOLD} graph a 2D FOLD graph, where the
 * vertices_coords have already been folded
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {LayerPrototype} a layer solution object. todo: more documentation
 */
export const layer3d = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment,
	edges_foldAngle, faces_vertices, faces_edges, faces_faces, // edges_vector,
}, epsilon) => {
	if (!vertices_coords || !edges_vertices || !faces_vertices) {
		return Object.assign(Object.create(LayerPrototype), emptyLayerSolution());
	}
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	if (!edges_faces) {
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
	}
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	// edges_foldAngle needs to be present so we can ignore foldAngles
	// which are not flat when doing taco/tortilla things. if we need to
	// build it here, all of them are flat, but we need the array to exist
	if (!edges_foldAngle && edges_assignment) {
		edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
	}
	if (!edges_assignment) {
		edges_assignment = makeEdgesAssignmentSimple({ edges_foldAngle });
	}
	// find an appropriate epsilon, if it is not specified
	if (epsilon === undefined) {
		epsilon = makeEpsilon({ vertices_coords, edges_vertices });
	}
	// convert the graph into conditions for the solver
	const {
		constraints, lookup, facePairs, faces_winding, orders,
	} = setup({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_assignment,
		edges_foldAngle,
		faces_vertices,
		faces_edges,
		faces_faces,
		// edges_vector,
	}, epsilon);

	const { root, branches } = solver2d({ constraints, lookup, facePairs, orders });
	// console.log("constraints", constraints);
	// console.log("lookup", lookup);
	// console.log("facePairs", facePairs);
	// console.log("faces_winding", faces_winding);
	// console.log("orders", orders);
	return Object.assign(Object.create(LayerPrototype), {
		root,
		branches,
		faces_winding,
	});
};
