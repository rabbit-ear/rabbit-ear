/* Math (c) Kraft, MIT License */
import { identity3x4 } from '../algebra/matrix3.js';
import { flattenArrays, semiFlattenArrays } from './arrays.js';
import { fnNotUndefined } from './functions.js';
import { subtract, magnitude, rotate90, dot, scale, rotate270 } from '../algebra/vectors.js';

const getVector = function () {
	let list = flattenArrays(arguments);
	if (list.length > 0 && typeof list[0] === "object"
		&& list[0] !== null && !Number.isNaN(list[0].x)) {
		list = ["x", "y", "z"]
			.map(c => list[0][c])
			.filter(fnNotUndefined);
	}
	return list.filter(n => typeof n === "number");
};
const getVectorOfVectors = function () {
	return semiFlattenArrays(arguments)
		.map(el => getVector(el));
};
const getSegment = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 4) {
		return [
			[args[0], args[1]],
			[args[2], args[3]],
		];
	}
	return args.map(el => getVector(el));
};
const vectorOriginForm = (vector, origin) => (
	{ vector: vector || [], origin: origin || [] }
);
const getLine = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0) { return vectorOriginForm([], []); }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector || [], args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};
const maps3x4 = [
	[0, 1, 3, 4, 9, 10],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	[0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11],
];
[11, 7, 3].forEach(i => delete maps3x4[2][i]);
const matrixMap3x4 = len => (len < 8
	? maps3x4[0]
	: (len < 13 ? maps3x4[1] : maps3x4[2]));
const getMatrix3x4 = function () {
	const mat = flattenArrays(arguments);
	const matrix = [...identity3x4];
	matrixMap3x4(mat.length)
		.forEach((n, i) => { if (mat[i] != null) { matrix[n] = mat[i]; } });
	return matrix;
};
const pointsToLine = (...args) => {
	const points = getVectorOfVectors(...args);
	return {
		vector: subtract(points[1], points[0]),
		origin: points[0],
	};
};
const rayLineToUniqueLine = ({ vector, origin }) => {
	const mag = magnitude(vector);
	const normal = rotate90(vector);
	const distance = dot(origin, normal) / mag;
	return { normal: scale(normal, 1 / mag), distance };
};
const uniqueLineToRayLine = ({ normal, distance }) => (
	vectorOriginForm(rotate270(normal), scale(normal, distance))
);

export { getLine, getMatrix3x4, getSegment, getVector, getVectorOfVectors, pointsToLine, rayLineToUniqueLine, uniqueLineToRayLine };
