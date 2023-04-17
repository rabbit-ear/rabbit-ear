/**
 * Rabbit Ear (c) Kraft
 */
// import Messages from "../../environment/messages.js";
import LayerPrototype from "./prototype.js";
import solver from "./solver.js";
import setup from "./setup.js";
import solveEdgeAdjacent from "./edgeAdjacent.js";
import { unsignedToSignedOrders } from "./general.js";
import { makeEpsilon } from "../general.js";
/**
 * @description Find a layer ordering of the faces in a flat-folded
 * origami model.
 * @param {FOLD} graph a 2D FOLD graph, where the
 * vertices_coords have already been folded
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {LayerPrototype} a layer solution object. todo: more documentation
 */
export const layer = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment,
	faces_vertices, faces_edges, edges_vector,
}, epsilon) => {
	// find an appropriate epsilon, if it is not specified
	if (epsilon === undefined) {
		epsilon = makeEpsilon({ vertices_coords, edges_vertices });
	}
	// convert the graph into conditions for the solver
	const { constraints, lookup, facePairs, faces_winding } = setup({
		vertices_coords,
		edges_vertices,
		edges_faces,
		faces_vertices,
		faces_edges,
		edges_vector,
	}, epsilon);
	// solve all edge-adjacent face pairs where the assignment between them is known
	const orders = solveEdgeAdjacent({
		edges_faces,
		edges_assignment,
	}, facePairs, faces_winding);
	// the result of the solver, or undefined if no solution is possible
	const { root, branches } = solver({ constraints, lookup, facePairs, orders });
	// convert solutions from (1,2) to (+1,-1), both the root and each branch.
	// modify the objects in place.
	unsignedToSignedOrders(root);
	branches
		.forEach(branch => branch
			.forEach(solutions => unsignedToSignedOrders(solutions)));
	// wrap the result in the layer solution prototype
	return Object.assign(Object.create(LayerPrototype), {
		root,
		branches,
		faces_winding,
	});
};

// export const layerSync = (graph, epsilon) => {
// };
// export const layer = (graph, epsilon) => (
// 	new Promise((resolve, reject) => {
// 		// const scriptText = "";
// 		// const scriptBase64 = btoa(scriptText);
// 		// const scriptURL = `data:text/javascript;base64,${scriptBase64}`;
// 		// const myWorker = new Worker(scriptURL);
// 		const result = solver2d(graph, epsilon);
// 		if (result) {
// 			resolve(Object.assign(Object.create(LayerPrototype), result));
// 		} else {
// 			reject(new Error(Messages.noSolution));
// 		}
// 	})
// );
