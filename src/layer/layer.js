/**
 * Rabbit Ear (c) Kraft
 */
import {
	makeFacesEdgesFromVertices,
	makeEdgesFacesUnsorted,
} from "../graph/make.js";
import {
	makeEpsilon,
} from "../graph/epsilon.js";
import {
	makeSolverConstraints,
} from "./constraints.js";
import {
	solveEdgeAdjacent,
	solve,
} from "./solver.js";
import LayerPrototype from "./prototype.js";

/**
 * @description Find all possible layer orderings of the faces
 * in a flat-foldable origami model. The result contains all possible
 * solutions, use the prototype methods available on this return object
 * to choose one solution, among other available options.
 * @param {FOLD} graph a FOLD object with folded vertices in 2D
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{
 *   root: {[key:string]: number},
 *   branches: {[key:string]: number}[][],
 *   faces_winding: number[],
 * }} an object that describes all layer orderings, where the "root" orders
 * are true for all solutions, and each object in "branches" can be appended
 * to the root object to create a complete solution.
 */
const solveLayer = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment,
	faces_vertices, faces_edges, edges_vector,
}, epsilon) => {
	// necessary conditions for the layer solver to work
	if (!vertices_coords || !edges_vertices || !faces_vertices) {
		return { root: {}, branches: [], faces_winding: [] };
	}
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	if (!edges_faces) {
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
	}

	// find an appropriate epsilon, but only if it is not specified
	if (epsilon === undefined) {
		epsilon = makeEpsilon({ vertices_coords, edges_vertices });
	}

	// convert the graph into conditions for the solver
	const {
		constraints,
		lookup,
		facePairs,
		faces_winding,
	} = makeSolverConstraints({
		vertices_coords,
		edges_vertices,
		edges_faces,
		faces_vertices,
		faces_edges,
		edges_vector,
	}, epsilon);

	// before we run the solver, solve all of the conditions that we can.
	// at this point, this means adjacent faces with an M or V edge between them.
	const orders = solveEdgeAdjacent({
		edges_faces,
		edges_assignment,
	}, faces_winding);

	// the result of the solver, or undefined if no solution is possible
	const { root, branches } = solve({ constraints, lookup, facePairs, orders });

	// wrap the result in the layer solution prototype
	return {
		root,
		branches,
		faces_winding,
	};
};

/**
 * @description Find all possible layer orderings of the faces
 * in a flat-foldable origami model. The result contains all possible
 * solutions, use the prototype methods available on this return object
 * to choose one solution, among other available options.
 * @param {FOLD} graph a FOLD object with folded vertices in 2D
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {LayerPrototype} a layer solution object
 */
export const layer = (graph, epsilon) => Object.assign(
	Object.create(LayerPrototype),
	solveLayer(graph, epsilon),
);

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
