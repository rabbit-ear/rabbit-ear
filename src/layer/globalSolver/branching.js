import { invertMap } from "../../graph/maps";
/**
 * @description For every face, gather all the other faces which appear alongside
 * this face inside any facePairsOrder key, and that order is currently unsolved (0).
 */
export const makeUnsolvedFaceOtherFaces = (facePairsOrder, overlap) => {
	const allFaces = {};
	Object.keys(facePairsOrder)
		.filter(key => facePairsOrder[key] === 0)
		.map(key => key.split(" "))
		.flat()
		.forEach(face => { allFaces[face] = true; });
	// for every face, only considering the unsolved facePairsOrder,
	// list all the other faces in pairs with this face.
	const otherFacesMap = {};
	Object.keys(allFaces).forEach(f => { otherFacesMap[f] = {}; });
	Object.keys(facePairsOrder)
		.filter(key => facePairsOrder[key] === 0)
		.map(key => key.split(" "))
		.forEach(pair => {
			if (otherFacesMap[pair[0]]) { otherFacesMap[pair[0]][pair[1]] = true; }
			if (otherFacesMap[pair[1]]) { otherFacesMap[pair[1]][pair[0]] = true; }
		});
	const otherFaces = Array.from(Array(overlap.length)).map(() => []);
	Object.keys(otherFacesMap).forEach(i => {
		otherFaces[i] = Object.keys(otherFacesMap[i]).map(s => parseInt(s, 10));
	});
	return otherFaces;
};
/**
 * @description Split each row into groups, where each group contains
 * faces which overlap any face in that group
 */
export const makeFaceGroups = (otherFaces, overlap) => {
	const faceGroups = {};
	Object.keys(otherFaces).forEach(face => {
		// const groups = [[1, 5, 7], [2, 4, 6], [8]];
		const groups = [];
		otherFaces[face].forEach(f => {
			for (let g = 0; g < groups.length; g += 1) {
				for (let gg = 0; gg < groups[g].length; gg += 1) {
					if (overlap[f][groups[g][gg]]) {
						groups[g].push(f);
						return;
					}
				}
			}
			groups.push([f]);
		});
		faceGroups[face] = groups;
	});
	return faceGroups;
};

export const makeFacePairsGroups = (facePairsOrder, faceGroups) => {
	// 0-index array with values face indices
	// which faceGroups have two or more categories (have face pairs which do not overlap).
	// we only care about these groups from now on
	const relevantGroups = Object.keys(faceGroups)
		.filter(key => faceGroups[key] && faceGroups[key].length > 1);
	// 0-index array with values of the first face
	const firstKeys = relevantGroups.map(key => faceGroups[key][0][0]);
	// const groupFirstKeys = {};
	// relevantGroups.forEach((g, i) => { groupFirstKeys[g] = firstKeys[i]; });
	// for each group, is it made of the exact same faces from another group? give
	// each unique group a new index, give each similar groups a shared index
	// eg: all unique groups: [0,1,2,3]. all similar: [0,0,0,0]
	const matchingGroups = relevantGroups.map((key, i) => {
		for (let j = 0; j < i; j += 1) {
			if (firstKeys[i] === firstKeys[j]) {
				const a = JSON.stringify(faceGroups[relevantGroups[i]]);
				const b = JSON.stringify(faceGroups[relevantGroups[j]]);
				if (a === b) { return j; }
			}
		}
		return i;
	});
	// Now we are grouping similar groups. Each group will have:
	// - parents: which sit atop faces from both groups.
	// - children: [left, right], face groups split into their group clusters
	//   (can be more than just two groups)
	const groups = invertMap(matchingGroups)
		.map(el => (el.constructor === Array ? el : [el]))
		.map((group, i) => ({
			parents: group.map(g => relevantGroups[g]).map(n => parseInt(n, 10)),
			children: faceGroups[relevantGroups[i]],
		})).filter(() => true);
	// now, match every combination of one parent with one child face, make a
	// facePairs key ("3 18"), and keep them separated by the groups the children
	// were in. only return facePairs which actually exist in the facePairOrders set
	const keycombos = groups.map(el => {
		const pairs = Array.from(Array(el.children.length)).map(() => []);
		for (let p = 0; p < el.parents.length; p += 1) {
			for (let side = 0; side < el.children.length; side += 1) {
				for (let c = 0; c < el.children[side].length; c += 1) {
					const key = [el.parents[p], el.children[side][c]]
						.sort((a, b) => a - b)
						.join(" ");
					if (facePairsOrder[key] !== undefined) {
						pairs[side].push(key);
					}
				}
			}
		}
		return pairs;
	});
	// console.log("relevantGroups", relevantGroups);
	// console.log("matchingGroups", matchingGroups);
	// console.log("inverted", invertMap(matchingGroups));
	// console.log("groups", groups);
	return keycombos;
};
/**
 * @param {} conditions is the set of face-pair conditions after round 1, where
 * all cases have been solved which are true for all layer arrangements.
 * @param {boolean[][]} overlap the face-face overlap matrix
 */
export const makeBranchingCompleteSets = (conditions, overlap) => {
	// console.log("CERTAIHN", conditions);
	// const bipartiteFaces = makeBipartiteFaces(conditions);
	// console.log("bipartiteFaces", bipartiteFaces);
	// const bipartiteGraph = makeBipartiteGraph(data.overlap, conditions);
	// console.log("bipartiteGraph", bipartiteGraph);
	// const processed = processGraph(bipartiteGraph, data.overlap, conditions);
	// console.log("processed", processed);
	const faceOtherFaces = makeUnsolvedFaceOtherFaces(conditions, overlap);
	const faceGroups = makeFaceGroups(faceOtherFaces, overlap);
	const facePairsByGroup = makeFacePairsGroups(conditions, faceGroups);
	// get all keys involved in branches
	const allBranchingKeys = {};
	facePairsByGroup
		.forEach(sides => sides
			.forEach(side => side
				.forEach(key => { allBranchingKeys[key] = true; })));
	// copy only the known conditions to a master object
	const knownConditions = {};
	Object.keys(conditions)
		// .filter(key => !allBranchingKeys[key]) // remove only branching key cases
		.filter(key => conditions[key] !== 0) // remove all unknown cases
		.forEach(key => { knownConditions[key] = conditions[key]; });
	console.log("faceOtherFaces", faceOtherFaces);
	console.log("faceGroups", faceGroups);
	console.log("facePairsByGroup", facePairsByGroup);
	console.log("allBranchingKeys", allBranchingKeys);
	console.log("knownConditions", knownConditions);
	return facePairsByGroup.map(sides => sides.map(side => {
		const copy = JSON.parse(JSON.stringify(knownConditions));
		side.forEach(key => { copy[key] = 0; });
		return copy;
	}));
};
/**
 * @param {} facePairsOrder is the set of face-pair facePairsOrder after round 1,
 * where all cases have been solved which are true for all layer arrangements.
 * @param {boolean[][]} overlap the face-face overlap matrix
 */
export const makeBranchingSets = (overlap, ...orders) => {
	const facePairsOrder = {};
	orders.forEach(ord => Object.keys(ord).forEach(key => {
		facePairsOrder[key] = facePairsOrder[key] || ord[key];
	}));

	const faceOtherFaces = makeUnsolvedFaceOtherFaces(facePairsOrder, overlap);
	const faceGroups = makeFaceGroups(faceOtherFaces, overlap);
	const facePairsByGroup = makeFacePairsGroups(facePairsOrder, faceGroups);
	// console.log("faceOtherFaces", faceOtherFaces);
	// console.log("faceGroups", faceGroups);
	// console.log("facePairsByGroup", facePairsByGroup);
	return facePairsByGroup.map(sides => sides.map(keyArray => {
		const object = {};
		keyArray.forEach(key => { object[key] = 0; });
		return object;
	}));
};

// const buildTree = (overlap, conditions) => {
// 	const recurse = (face) => {
// 		overlap[face]
// 			.map((f, i) => (f ? i : undefined))
// 			.filter(a => a !== undefined)
// 		const node = {};
// 		return node;
// 	};

// 	return recurse(0);
// };

// const processGraph = (graph, overlap, conditions) => {
// 	const faces = Object.keys(graph);
// 	const otherFaces = [];
// 	faces.forEach(face => {
// 		const res = [];
// 		overlap.forEach((_, f) => {
// 			if (conditions[`${face} ${f}`] === 0
// 				|| conditions[`${f} ${face}`] === 0) {
// 				res.push(f);
// 			}
// 		});
// 		otherFaces[face] = res;
// 	});
// 	return otherFaces;
// };

// const makeBipartiteGraph = (overlap, conditions) => {
// 	const visitedKeys = {};
// 	const recurse = (face_colors = {}, face = 0, color = false) => overlap[face]
// 		.map((bool, i) => (bool ? i : undefined))
// 		.filter(a => a !== undefined)
// 		.filter(f => conditions[`${face} ${f}`] === 0 || conditions[`${f} ${face}`] === 0)
// 		.map(f => {
// 			if (face_colors[f] !== undefined && face_colors[f] !== color) {
// 				return false;
// 			}
// 			if (face_colors[f] === color) { return true; }
// 			if (visitedKeys[f] !== undefined) { return false; }
// 			face_colors[f] = color;
// 			visitedKeys[f] = true;
// 			return recurse(face_colors, f, !color);
// 		})
// 		.reduce((a, b) => a && b, true);
// 	return overlap
// 		.map((_, f) => {
// 			const face_colors = {};
// 			const res = recurse(face_colors, f);
// 			return res ? face_colors : undefined;
// 		}).filter(a => a !== undefined)
// 		.filter(a => Object.keys(a).length)
// 		.shift();
// };

// const makeBipartiteFaces = (conditions) => {
// 	const allFaces = {};
// 	Object.keys(conditions)
// 		.filter(key => conditions[key] === 0)
// 		.map(key => key.split(" "))
// 		.flat()
// 		.forEach(face => { allFaces[face] = true; });
// 	// for every face, only considering the unsolved conditions,
// 	// list all the other faces in pairs with this face.
// 	const otherFaces = {};
// 	Object.keys(allFaces).forEach(f => { otherFaces[f] = {}; });
// 	Object.keys(conditions)
// 		// .filter(key => conditions[key] === 0)
// 		.forEach(key => {
// 			const pair = key.split(" ");
// 			if (otherFaces[pair[0]]) {
// 				otherFaces[pair[0]][pair[1]] = (conditions[key] === 0);
// 			}
// 			if (otherFaces[pair[1]]) {
// 				otherFaces[pair[1]][pair[0]] = (conditions[key] === 0);
// 			}
// 		});
// 	return otherFaces;
// };
