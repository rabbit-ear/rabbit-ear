/**
 * Rabbit Ear (c) Kraft
 */
import { invertMap } from "../../graph/maps";
import topologicalOrder from "./topologicalOrder";

const keysToFaceOrders = (facePairs) => {
	const keys = Object.keys(facePairs);
	const faceOrders = keys.map(string => string.split(" ").map(n => parseInt(n, 10)));
	faceOrders.map((faces, i) => faces.push(facePairs[keys[i]]));
	return faceOrders;
};

const LayerPrototype = {
	/**
	 * @description For every branch, get the total number of states.
	 * @returns {number[]} the total number of states in each branch.
	 * @linkcode Origami ./src/layer/globalSolver/prototype.js 18
	 */
	count: function () {
		return this.branches.map(arr => arr.length);
	},
	/**
	 * @description Get one complete layer solution by merging the
	 * root solution with one state from each branch.
	 * @param {number[]} ...indices optionally specify which state from
	 * each branch, otherwise this will return index 0 from each branch.
	 * @returns {object} an object with space-separated face pair keys, with
	 * a value of +1 or -1, indicating the stacking order between the pair.
	 * @linkcode Origami ./src/layer/globalSolver/prototype.js 30
	 */
	solution: function (...indices) {
		// create an array of numbers the length of this.branches
		// if "indices" is provided, use these, otherwise fill it with 0.
		const option = Array(this.branches.length)
			.fill(0)
			.map((n, i) => (indices[i] != null ? indices[i] : n));
		// for each branch, get one state
		const branchesSolution = this.branches
			? this.branches.map((options, i) => options[option[i]])
			: [];
		// merge the root with all branches (one state from each branch)
		return Object.assign({}, this.root, ...branchesSolution);
	},
	/**
	 * @description Get one complete layer solution by merging the
	 * root solution with one state from each branch.
	 * @param {number[]} ...indices optionally specify which state from
	 * each branch, otherwise this will return index 0 from each branch.
	 * @returns {number[]} a faces_layer ordering, where, for each face (index),
	 * the value is that face's layer in the +Z order stack.
	 * @linkcode Origami ./src/layer/globalSolver/prototype.js 52
	 */
	facesLayer: function (...indices) {
		return invertMap(topologicalOrder(this.solution(...indices)));
	},
	/**
	 * @description Get one complete layer solution by merging the
	 * root solution with one state from each branch.
	 * @param {number[]} ...indices optionally specify which state from
	 * each branch, otherwise this will return index 0 from each branch.
	 * @returns {number[]} a faces_layer ordering, where, for each face (index),
	 * the value is that face's layer in the +Z order stack.
	 * @linkcode Origami ./src/layer/globalSolver/prototype.js 64
	 */
	faceOrders: function (...indices) {
		return keysToFaceOrders(this.solution(...indices));
	},
};

export default LayerPrototype;
