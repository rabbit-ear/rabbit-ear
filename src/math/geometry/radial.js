/* Math (c) Kraft, MIT License */
import { TWO_PI, EPSILON } from '../general/constants.js';
import { semiFlattenArrays } from '../general/arrays.js';
import { fnToVec2, fnVec2Angle, fnEpsilonEqual } from '../general/functions.js';
import { normalize2, subtract2, cross2, distance2 } from '../algebra/vectors.js';

const isCounterClockwiseBetween = (angle, floor, ceiling) => {
	while (ceiling < floor) { ceiling += TWO_PI; }
	while (angle > floor) { angle -= TWO_PI; }
	while (angle < floor) { angle += TWO_PI; }
	return angle < ceiling;
};
const clockwiseAngleRadians = (a, b) => {
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const a_b = a - b;
	return (a_b >= 0)
		? a_b
		: TWO_PI - (b - a);
};
const counterClockwiseAngleRadians = (a, b) => {
	while (a < 0) { a += TWO_PI; }
	while (b < 0) { b += TWO_PI; }
	while (a > TWO_PI) { a -= TWO_PI; }
	while (b > TWO_PI) { b -= TWO_PI; }
	const b_a = b - a;
	return (b_a >= 0)
		? b_a
		: TWO_PI - (a - b);
};
const clockwiseAngle2 = (a, b) => {
	const dotProduct = b[0] * a[0] + b[1] * a[1];
	const determinant = b[0] * a[1] - b[1] * a[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
const counterClockwiseAngle2 = (a, b) => {
	const dotProduct = a[0] * b[0] + a[1] * b[1];
	const determinant = a[0] * b[1] - a[1] * b[0];
	let angle = Math.atan2(determinant, dotProduct);
	if (angle < 0) { angle += TWO_PI; }
	return angle;
};
const clockwiseBisect2 = (a, b) => fnToVec2(fnVec2Angle(a) - clockwiseAngle2(a, b) / 2);
const counterClockwiseBisect2 = (a, b) => (
	fnToVec2(fnVec2Angle(a) + counterClockwiseAngle2(a, b) / 2)
);
const clockwiseSubsectRadians = (angleA, angleB, divisions) => {
	const angle = clockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
const counterClockwiseSubsectRadians = (angleA, angleB, divisions) => {
	const angle = counterClockwiseAngleRadians(angleA, angleB) / divisions;
	return Array.from(Array(divisions - 1))
		.map((_, i) => angleA + angle * (i + 1));
};
const clockwiseSubsect2 = (vectorA, vectorB, divisions) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return clockwiseSubsectRadians(angleA, angleB, divisions)
		.map(fnToVec2);
};
const counterClockwiseSubsect2 = (vectorA, vectorB, divisions) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return counterClockwiseSubsectRadians(angleA, angleB, divisions)
		.map(fnToVec2);
};
const counterClockwiseOrderRadians = function () {
	const radians = Array.from(arguments).flat();
	const counter_clockwise = radians
		.map((_, i) => i)
		.sort((a, b) => radians[a] - radians[b]);
	return counter_clockwise
		.slice(counter_clockwise.indexOf(0), counter_clockwise.length)
		.concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
const counterClockwiseOrder2 = function () {
	return counterClockwiseOrderRadians(
		semiFlattenArrays(arguments).map(fnVec2Angle),
	);
};
const counterClockwiseSectorsRadians = function () {
	const radians = Array.from(arguments).flat();
	const ordered = counterClockwiseOrderRadians(radians)
		.map(i => radians[i]);
	return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
		.map(pair => counterClockwiseAngleRadians(pair[0], pair[1]));
};
const counterClockwiseSectors2 = function () {
	return counterClockwiseSectorsRadians(
		semiFlattenArrays(arguments).map(fnVec2Angle),
	);
};
const threePointTurnDirection = (p0, p1, p2, epsilon = EPSILON) => {
	const v = normalize2(subtract2(p1, p0));
	const u = normalize2(subtract2(p2, p0));
	const cross = cross2(v, u);
	if (!fnEpsilonEqual(cross, 0, epsilon)) {
		return Math.sign(cross);
	}
	return fnEpsilonEqual(distance2(p0, p1) + distance2(p1, p2), distance2(p0, p2))
		? 0
		: undefined;
};

export { clockwiseAngle2, clockwiseAngleRadians, clockwiseBisect2, clockwiseSubsect2, clockwiseSubsectRadians, counterClockwiseAngle2, counterClockwiseAngleRadians, counterClockwiseBisect2, counterClockwiseOrder2, counterClockwiseOrderRadians, counterClockwiseSectors2, counterClockwiseSectorsRadians, counterClockwiseSubsect2, counterClockwiseSubsectRadians, isCounterClockwiseBetween, threePointTurnDirection };
