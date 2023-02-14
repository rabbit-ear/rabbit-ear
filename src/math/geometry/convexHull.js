/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { radialSortPointIndices2 } from '../general/sort.js';
import { threePointTurnDirection } from './radial.js';

const mirrorArray = (arr) => arr.concat(arr.slice(0, -1).reverse());
const convexHullIndices = (points = [], includeCollinear = false, epsilon = EPSILON) => {
	if (points.length < 2) { return []; }
	const order = radialSortPointIndices2(points, epsilon)
		.map(arr => (arr.length === 1 ? arr : mirrorArray(arr)))
		.flat();
	order.push(order[0]);
	const stack = [order[0]];
	let i = 1;
	const funcs = {
		"-1": () => stack.pop(),
		1: (next) => { stack.push(next); i += 1; },
		undefined: () => { i += 1; },
	};
	funcs[0] = includeCollinear ? funcs["1"] : funcs["-1"];
	while (i < order.length) {
		if (stack.length < 2) {
			stack.push(order[i]);
			i += 1;
			continue;
		}
		const prev = stack[stack.length - 2];
		const curr = stack[stack.length - 1];
		const next = order[i];
		const turn = threePointTurnDirection(...[prev, curr, next].map(j => points[j]), epsilon);
		funcs[turn](next);
	}
	stack.pop();
	return stack;
};
const convexHull = (points = [], includeCollinear = false, epsilon = EPSILON) => (
	convexHullIndices(points, includeCollinear, epsilon)
		.map(i => points[i]));

export { convexHull, convexHullIndices };
