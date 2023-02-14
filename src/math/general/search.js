/* Math (c) Kraft, MIT License */
import { EPSILON } from './constants.js';
import { fnEpsilonCompare } from './functions.js';

const smallestComparisonSearch = (array, obj, compare_func) => {
	const objs = array.map((o, i) => ({ i, d: compare_func(obj, o) }));
	let index;
	let smallest_value = Infinity;
	for (let i = 0; i < objs.length; i += 1) {
		if (objs[i].d < smallest_value) {
			index = i;
			smallest_value = objs[i].d;
		}
	}
	return index;
};
const smallestVectorSearch = (vectors, axis = 0, compFn = fnEpsilonCompare, epsilon = EPSILON) => {
	let smallSet = [0];
	for (let i = 1; i < vectors.length; i += 1) {
		switch (compFn(vectors[i][axis], vectors[smallSet[0]][axis], epsilon)) {
		case 0: smallSet.push(i); break;
		case 1: smallSet = [i]; break;
		}
	}
	return smallSet;
};
const minimum2DPointIndex = (points, epsilon = EPSILON) => {
	if (!points.length) { return undefined; }
	const smallSet = smallestVectorSearch(points, 0, fnEpsilonCompare, epsilon);
	let sm = 0;
	for (let i = 1; i < smallSet.length; i += 1) {
		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
	}
	return smallSet[sm];
};

export { minimum2DPointIndex, smallestComparisonSearch };
