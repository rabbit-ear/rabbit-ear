/* Math (c) Kraft, MIT License */
import { EPSILON } from './constants.js';

const fnTrue = () => true;
const fnSquare = n => n * n;
const fnAdd = (a, b) => a + (b || 0);
const fnNotUndefined = a => a !== undefined;
const fnVecToAngle = v => Math.atan2(v[1], v[0]);
const fnAngleToVec = a => [Math.cos(a), Math.sin(a)];
const fnEpsilonEqual = (a, b, epsilon = EPSILON) => Math.abs(a - b) < epsilon;
const fnEpsilonCompare = (a, b, epsilon = EPSILON) => (
	fnEpsilonEqual(a, b, epsilon) ? 0 : Math.sign(b - a)
);
const fnEpsilonEqualVectors = (a, b, epsilon = EPSILON) => {
	for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
		if (!fnEpsilonEqual(a[i] || 0, b[i] || 0, epsilon)) { return false; }
	}
	return true;
};
const include = (n, epsilon = EPSILON) => n > -epsilon;
const exclude = (n, epsilon = EPSILON) => n > epsilon;
const includeL = fnTrue;
const excludeL = fnTrue;
const includeR = include;
const excludeR = exclude;
const includeS = (t, e = EPSILON) => t > -e && t < 1 + e;
const excludeS = (t, e = EPSILON) => t > e && t < 1 - e;
const clampLine = dist => dist;
const clampRay = dist => (dist < -EPSILON ? 0 : dist);
const clampSegment = (dist) => {
	if (dist < -EPSILON) { return 0; }
	if (dist > 1 + EPSILON) { return 1; }
	return dist;
};

export { clampLine, clampRay, clampSegment, exclude, excludeL, excludeR, excludeS, fnAdd, fnAngleToVec, fnEpsilonCompare, fnEpsilonEqual, fnEpsilonEqualVectors, fnNotUndefined, fnSquare, fnTrue, fnVecToAngle, include, includeL, includeR, includeS };
