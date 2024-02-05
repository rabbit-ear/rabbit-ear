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
 * @description Create an array of breadth first minimum spanning trees which
 * fully cover a graph, the input being a self-referencing array, such as
 * vertices_vertices, faces_faces. The tree makes no decision about
 * which path to take, only by choosing the first adjacent index.
 * @param {number[][]} array_array an array of array of indices,
 * indices which are meant to reference this array itself, for example:
 * vertices_vertices or faces_faces or anything following that pattern.
 * @param {number} [rootIndex=0] the face index to be the root node.
 * In the case of a disjoint graph and multiple trees, rootIndex
 * will only apply to the first tree.
 * @returns {TreeNode[][][]} an array of trees, where each tree is
 * an array of array of TreeNode. Each tree is organized into depths,
 * where each array contains an array of tree nodes at that depth.
 * @linkcode Origami ./src/graph/faceSpanningTree.js 59
 */
export const minimumSpanningTrees = (array_array = [], rootIndex = 0) => {
	if (array_array.length === 0) { return []; }
	const trees = [];

	// this serves two functions: a hash lookup to ensure we aren't using the
	// same node twice, and when we need to start a new tree, query from here.
	const unvisited = {};
	array_array.forEach((_, i) => { unvisited[i] = true; });

	do {
		// pick a starting index. first, choose the user's rootIndex parameter,
		// then for every subsequent disjoint set, get the first unvisited index.
		const startIndex = rootIndex !== undefined && unvisited[rootIndex]
			? rootIndex
			: parseInt(Object.keys(unvisited).shift(), 10);

		// this also invalidates "rootIndex" for any subsequent disjoint sets.
		delete unvisited[startIndex];

		// each disjoint set starts a new tree
		const tree = [];
		let currentLevel = [{ index: startIndex }];

		// breadth first tree traversal. add the current level to the tree,
		// and iterate through all of the current level's children.
		do {
			tree.push(currentLevel);

			// for each current level's indices, gather all their children
			// but filter out any which already appeared in a previous level.
			const nextLevel = currentLevel
				.flatMap(current => array_array[current.index]
					.filter(i => unvisited[i])
					.map(index => ({ index, parent: current.index })));

			// the above list we just made might contain duplicates.
			// Iterate through the list and mark any duplicates to be removed
			// by also updating the "unvisited" list.
			const duplicates = {};
			nextLevel.forEach((el, i) => {
				if (!unvisited[el.index]) { duplicates[i] = true; }
				delete unvisited[el.index];
			});

			// filter out the next level's duplicates and set this to be "current".
			// if this list is empty we are done with the current tree.
			currentLevel = nextLevel.filter((_, i) => !duplicates[i]);
		} while (currentLevel.length);

		// this tree is done, add it to the list of trees
		// if there are no more unvisited keys, we are done with all trees.
		trees.push(tree);
	} while (Object.keys(unvisited).length);
	return trees;
};

/**
 * @description Create a single breadth first minimum spanning tree from a
 * self-referencing data set, such as vertices_vertices, faces_faces.
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
