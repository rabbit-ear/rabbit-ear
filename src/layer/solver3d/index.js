/**
 * Rabbit Ear (c) Kraft
 */
import { makeEpsilon } from "../../graph/epsilon.js";
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
	// console.time("index.js solver2d()");
	const { root, branches } = solver2d({ constraints, lookup, facePairs, orders });
	// console.timeEnd("index.js solver2d()");
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
