/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @typedef TreeNode
 * @type {{ index: number, parent: number }}
 * @description A node in a tree specifically intended to map edge-
 * connected faces.
 * @property {number} index - the index of this index
 * @property {number} parent - this node's parent node's index
 */
/**
 * @description Create an array of minimum spanning trees which fully
 * cover a graph, the input being a self-referencing array, such as
 * vertices_vertices, faces_faces. The tree makes no decision about
 * which path to take, only by choosing the first adjacent index.
 * @param {number[][]} array_array an array of array of indices,
 * indices which are meant to reference this array itself.
 * @param {number} [rootIndex=0] the face index to be the root node.
 * In the case of a disjoint graph and multiple trees, rootIndex
 * will only apply to the first tree.
 * @returns {TreeNode[][]} a tree of nodes, arranged as an array of arrays,
 * where the top level contains an array of nodes, each inner array representing
 * one depth in the tree.
 * @linkcode Origami ./src/graph/faceSpanningTree.js 59
 */
export const minimumSpanningTrees = (array_array = [], rootIndex = 0) => {
	if (array_array.length === 0) { return []; }
	const trees = [];
	const unvisited = {};
	array_array.forEach((_, i) => { unvisited[i] = true; });
	do {
		// pick a starting index. first, choose the user's rootIndex parameter,
		// then for every subsequent disjoint set, get the first unvisited index.
		const startIndex = rootIndex !== undefined && unvisited[rootIndex]
			? rootIndex
			: parseInt(Object.keys(unvisited).shift(), 10);
		// unset the input parameter to only allow it to be used once.
		rootIndex = undefined;
		// each disjoint set starts a new tree
		const tree = [];
		delete unvisited[startIndex];
		let previousLevel = [{ index: startIndex }];
		do {
			tree.push(previousLevel);
			// for each previous level's indices, gather all their children
			// but filter out any which already appeared in a previous level.
			const currentLevel = previousLevel
				.flatMap(current => array_array[current.index]
					.filter(i => unvisited[i])
					.map(index => ({ index, parent: current.index })));
			// filter the current level once again, in the case of multiple
			// branches leading to the same index, only allow the first through.
			const duplicates = {};
			currentLevel.forEach((el, i) => {
				if (!unvisited[el.index]) { duplicates[i] = true; }
				delete unvisited[el.index];
			});
			previousLevel = currentLevel.filter((_, i) => !duplicates[i]);
		} while (previousLevel.length);
		trees.push(tree);
	} while (Object.keys(unvisited).length);
	return trees;
};
/**
 * @description Create a single minimum spanning tree. If you are
 * confident that your graph is connected, and there are no disjoint
 * components, then you can use this method instead of minimumSpanningTrees.
 * @param {number[][]} array_array an array of array of indices,
 * indices which are meant to reference this array itself.
 * @param {number} [rootIndex=0] the face index to be the root node.
 * In the case of a disjoint graph and multiple trees, rootIndex
 * will only apply to the first tree.
 * @returns {TreeNode[][]} a tree of nodes, arranged as an array of arrays,
 * where the top level contains an array of nodes, each inner array representing
 * one depth in the tree.
 * @linkcode Origami ./src/graph/faceSpanningTree.js 59
 */
export const minimumSpanningTree = (array_array, rootIndex) => (
	minimumSpanningTrees(array_array, rootIndex).shift()
);
