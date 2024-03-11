/**
 * Rabbit Ear (c) Kraft
 */
const match = (listA, listB) => {
	const res = [];
	for (let i = 0; i < listA.length; i += 1) {
		for (let j = 0; j < listB.length; j += 1) {
			res.push([listA[i], listB[j]]);
		}
	}
	return res;
};

// const linearizeSolutions = (solution) => {
// 	const solutions = [];
// 	const recurse = (node, list = []) => {
// 		if (node.faceOrders) {
// 			list.push(node.faceOrders);
// 		}
// 		if (node.branches) {
// 			node.branches.forEach(child => recurse(child, [...list]));
// 		} else {
// 			solutions.push(list);
// 		}
// 	};
// 	recurse(solution);
// 	return solutions.map(arr => arr.flat());
// 	// return solutions;
// };

// const mergeUnfinished = (...items) => {
// 	const itemCount = items.length;
// 	const eachTotal = items.map(arr => arr.length);
// 	const total = eachTotal.reduce((a, b) => a + b, 0);
// 	Array.from(Array(total))
// 		.map((_, i) => )
// 	if (items.length === 1) {
// 		return items[0];
// 	}
// };

// const linearizeSolutions = (solution) => {
// 	const recurse = (node) => {
// 		const solutions = [];
// 		const finished = node.finished
// 			? node.finished.map(el => [el])
// 			: [];
// 		solutions.push(...finished);
// 		if (node.unfinished) {
// 			const unf = node.unfinished.map(el => recurse(el));
// 			const unfinished = (unf.length > 1) ? match(...unf) : unf;
// 			solutions.push(unfinished);
// 		}
// 		// if (node.faceOrders) {
// 		// 	solutions.forEach(orders => orders.push(...node.faceOrders));
// 		// }
// 		return solutions;
// 	};
// 	return recurse(solution);
// };

// const linearizeSolutions = (solution) => {
// 	const recurse = (node) => {
// 		const solutions = node.finished
// 			? node.finished.map(fin => fin.faceOrders)
// 			: [node.faceOrders];
// 		if (node.unfinished) {
// 			const un = node.unfinished.map(el => recurse(el));
// 			return match(un, solutions);
// 		}
// 		return solutions;
// 	};
// 	return recurse(solution);
// };

// const mergePair = (a, b) => {
// 	const solutions = [];
// 	for (let i = 0; i < a.length; i += 1) {
// 		for (let j = 0; j < b.length; j += 1) {
// 			solutions.push([a[i], b[j]]);
// 		}
// 	}
// 	console.log("merging", a.length, b.length, solutions.length);
// 	return solutions;
// };

// const linearizeSolutions = (solution) => {
// 	const recurse = (node) => {
// 		if (node.faceOrders) { return node.faceOrders; }
// 		const solutions = node.finished
// 			.map(fin => (node.faceOrders
// 				? node.faceOrders, recurse(fin)]
// 				: recurse(fin)]));
// 		if (node.unfinished) {
// 			const res = node.unfinished.map(unf => recurse(unf));
// 			return mergePair(res, solutions);
// 		}
// 		return solutions;
// 	};
// 	const solutions = recurse(solution);
// 	return solutions;
// };

const linearizeSolutions = (solution) => {
	const recurse = (node, stack = []) => {
		if (node.faceOrders) { stack.push(node.faceOrders); }
		const finished = node.finished
			? node.finished.map(fin => [...stack, fin.faceOrders])
			: undefined;
		if (node.unfinished) {
			const unf = node.unfinished.map(el => recurse(el, JSON.parse(JSON.stringify(stack))));
			const unfinished = (unf.length > 1) ? match(...unf) : unf;
			unfinished.forEach(el => { el.branch = true; });
			// finished.push(...unfinished);
			finished.forEach(el => el.push(...unfinished));
		}
		// if (node.faceOrders) {
		// 	solutions.forEach(orders => orders.push(...node.faceOrders));
		// }
		finished.finished = true;
		return finished;
	};
	return recurse(solution);
};

const LayerPrototype = {
	facesLayer: function () {
		return topologicalOrder(this.faceOrders);
	},
	allSolutions: function () {
		return linearizeSolutions(this);
	},
};

export default LayerPrototype;
