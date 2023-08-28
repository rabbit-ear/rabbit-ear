/**
 *
 */
export const minimumSpanningTrees = (array_array = [], rootIndex = 0) => {
	if (array_array.length === 0) { return []; }
	const trees = [];
	const unvisited = {};
	array_array.forEach((_, i) => { unvisited[i] = true; });
	do {
		// pick a starting index. first, choose the user's rootIndex parameter,
		// then for every subsequent disjoint set, get the first unvisited index.
		const startIndex = rootIndex !== undefined
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

// export const minimumSpanningTree = (array_array, rootIndex = 0) => {
// 	if (array_array.length === 0) { return []; }
// 	const tree = [];
// 	let previousLevel = [{ index: rootIndex }];
// 	const visited = {};
// 	visited[rootIndex] = true;
// 	do {
// 		tree.push(previousLevel);
// 		// for each previous level's indices, gather all their children
// 		// but filter out any which already appeared in a previous level.
// 		const currentLevel = previousLevel
// 			.flatMap(current => array_array[current.index]
// 				.filter(i => !visited[i])
// 				.map(index => ({ index, parent: current.index })));
// 		// filter the current level once again, in the case of multiple
// 		// branches leading to the same index, only allow the first through.
// 		const duplicates = {};
// 		currentLevel.forEach((el, i) => {
// 			if (visited[el.index]) { duplicates[i] = true; }
// 			visited[el.index] = true;
// 		});
// 		previousLevel = currentLevel.filter((_, i) => !duplicates[i]);
// 	} while (previousLevel.length);
// 	return tree;
// };

export const minimumSpanningTree = (array_array, rootIndex) => (
	minimumSpanningTrees(array_array, rootIndex).shift()
);
