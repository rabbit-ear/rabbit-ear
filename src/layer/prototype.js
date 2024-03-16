/**
 * Rabbit Ear (c) Kraft
 */

// each "branches" is an "and" group (containing a list of "andItem")
// each "andItem" is also a group, a "subgroup"
// each "subgroup" is an "or" group (containing a list of "orItem")
// to compile a solution, follow these rules:
// - encountering an "and" group, gather all branch results into the solution.
// - encountering an "or" group, only choose one branch to be in the solution.

const makePermutations = (counts) => {
	const totalLength = counts.reduce((a, b) => a * b, 1);
	const maxPlace = counts.slice();
	for (let i = maxPlace.length - 2; i >= 0; i -= 1) {
		maxPlace[i] *= maxPlace[i + 1];
	}
	maxPlace.push(1);
	maxPlace.shift();
	return Array.from(Array(totalLength))
		.map((_, i) => counts
			.map((c, j) => Math.floor(i / maxPlace[j]) % c));
};

const getBranchCountFirst = ({ branches }, counter) => {
	if (branches === undefined) { return counter.value++; }
	return branches.map(branch => branch.map(el => getBranchCountFirst(el, counter)));
};

const getBranchCountNotWorking = ({ branches }, counts = []) => {
	if (branches === undefined) { return counts; }
	branches.forEach(branch => {
		counts.push(branch.length);
		branch.forEach(el => getBranchCountNotWorking(el, counts))
	});
	return counts;
};

const getBranchCount = ({ branches }) => {
	if (!branches) { return "leaf"; }
	return branches.map(choices => ({
		choices: choices.length,
		branches: choices.flatMap(getBranchCount),
	}));
};

const getDecisionPoints = ({ branches }) => {
	if (branches === undefined) { return "leaf"; }
	return branches.map(choices => {
		const chooseOne = choices.map(getDecisionPoints);
		return { chooseOne };
	});
};

export const getBranchStructure = ({ branches }) => {
	if (branches === undefined) { return []; }
	return branches.map(branch => branch.map(getBranchStructure));
};

const getBranchLeafStructure = ({ branches }) => {
	if (branches === undefined) { return "leaf"; }
	return branches.map(branch => branch.map(getBranchLeafStructure));
};

export const gather = ({ orders, branches }, pattern = []) => [
	orders,
	...(branches || []).flatMap(branch => gather(branch[pattern.shift() || 0], pattern)),
];

export const compile = ({ orders, branches }, pattern) => (
	gather({ orders, branches }, pattern)
		.reduce((a, b) => Object.assign(a, b))
);

/**
 * @param {{ orders: {[key:string]: number}, branches?: LayerBranch[] } branch
 * @returns {{[key:string]: number}[][]}
 */
export const gatherAll = ({ orders, branches }) => {
	if (!branches) { return [[orders]]; }

	// each recursion returns an array of solution-lists, and we don't have to
	// maintain separation, so for each branch, we can flatten all recursion
	// results into a single array of solution-lists.
	const branchResults = branches.map(andItem => andItem.flatMap(gatherAll));

	// each branch contains a list of leaves. we have to "and" every branch
	// with every other branch, meaning we need to choose one leaf from every
	// branch when we pair it with another set of branches. the number of
	// permutations is the product of the lengths of all the branches.
	return makePermutations(branchResults.map(arr => arr.length))
		.map(indices => indices
			.flatMap((index, i) => branchResults[i][index]))
		.map(solution => [orders, ...solution]);
};

// const getBranchCount = ({ branches }) => {
// 	if (branches === undefined) { return undefined; }
// 	// return branches.map(branch => (!branch.length ? undefined : ({
// 	// 	count: branch.length,
// 	// 	branches: branch
// 	// 		.map(getBranchCount)
// 	// 		.filter(a => a !== undefined)
// 	// })));
// 	const outerResult = branches.map(branch => {
// 	// return branches.map(branch => {
// 		const innerResult = branch.map(getBranchCount).filter(a => a !== undefined);
// 		return (innerResult === undefined || !innerResult.length
// 			? undefined
// 			: ({ count: branch.length, branches: innerResult }));
// 	}).filter(a => a !== undefined && a.length !== 0);
// 	return outerResult;
// 	// console.log("outerResult", outerResult);
// 	// return outerResult === undefined || outerResult.length === 0 ? undefined : outerResult;
// };

export const LayerPrototype = {
	count: function () {
		return getBranchCount(this);
	},

	structure: function () {
		return getBranchStructure(this);
	},

	leaves: function () {
		return getBranchLeafStructure(this);
	},

	gather: function (...pattern) {
		return gather(this, pattern);
	},

	gatherAll: function () {
		return gatherAll(this);
	},

	compile: function (...pattern) {
		return compile(this, pattern);
	},
};
