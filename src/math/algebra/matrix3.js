/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { resize, normalize } from './vectors.js';
import { makeMatrix2Reflect } from './matrix2.js';

const identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
const identity3x4 = Object.freeze(identity3x3.concat(0, 0, 0));
const isIdentity3x4 = m => identity3x4
	.map((n, i) => Math.abs(n - m[i]) < EPSILON)
	.reduce((a, b) => a && b, true);
const multiplyMatrix3Vector3 = (m, vector) => [
	m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
	m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
	m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11],
];
const multiplyMatrix3Line3 = (m, vector, origin) => ({
	vector: [
		m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2],
		m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2],
		m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2],
	],
	origin: [
		m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9],
		m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10],
		m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11],
	],
});
const multiplyMatrices3 = (m1, m2) => [
	m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2],
	m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2],
	m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2],
	m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5],
	m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5],
	m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5],
	m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8],
	m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8],
	m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8],
	m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9],
	m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10],
	m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11],
];
const determinant3 = m => (
	m[0] * m[4] * m[8]
	- m[0] * m[7] * m[5]
	- m[3] * m[1] * m[8]
	+ m[3] * m[7] * m[2]
	+ m[6] * m[1] * m[5]
	- m[6] * m[4] * m[2]
);
const invertMatrix3 = (m) => {
	const det = determinant3(m);
	if (Math.abs(det) < 1e-6 || Number.isNaN(det)
		|| !Number.isFinite(m[9]) || !Number.isFinite(m[10]) || !Number.isFinite(m[11])) {
		return undefined;
	}
	const inv = [
		m[4] * m[8] - m[7] * m[5],
		-m[1] * m[8] + m[7] * m[2],
		m[1] * m[5] - m[4] * m[2],
		-m[3] * m[8] + m[6] * m[5],
		m[0] * m[8] - m[6] * m[2],
		-m[0] * m[5] + m[3] * m[2],
		m[3] * m[7] - m[6] * m[4],
		-m[0] * m[7] + m[6] * m[1],
		m[0] * m[4] - m[3] * m[1],
		-m[3] * m[7] * m[11] + m[3] * m[8] * m[10] + m[6] * m[4] * m[11]
			- m[6] * m[5] * m[10] - m[9] * m[4] * m[8] + m[9] * m[5] * m[7],
		m[0] * m[7] * m[11] - m[0] * m[8] * m[10] - m[6] * m[1] * m[11]
			+ m[6] * m[2] * m[10] + m[9] * m[1] * m[8] - m[9] * m[2] * m[7],
		-m[0] * m[4] * m[11] + m[0] * m[5] * m[10] + m[3] * m[1] * m[11]
			- m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4],
	];
	const invDet = 1.0 / det;
	return inv.map(n => n * invDet);
};
const makeMatrix3Translate = (x = 0, y = 0, z = 0) => identity3x3.concat(x, y, z);
const singleAxisRotate = (angle, origin, i0, i1, sgn) => {
	const mat = identity3x3.concat([0, 1, 2].map(i => origin[i] || 0));
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	mat[i0 * 3 + i0] = cos;
	mat[i0 * 3 + i1] = (sgn ? +1 : -1) * sin;
	mat[i1 * 3 + i0] = (sgn ? -1 : +1) * sin;
	mat[i1 * 3 + i1] = cos;
	return mat;
};
const makeMatrix3RotateX = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 1, 2, true));
const makeMatrix3RotateY = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 2, false));
const makeMatrix3RotateZ = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 1, true));
const makeMatrix3Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	const pos = [0, 1, 2].map(i => origin[i] || 0);
	const [x, y, z] = resize(3, normalize(vector));
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	const t = 1 - c;
	const trans = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
	const trans_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
	return multiplyMatrices3(trans_inv, multiplyMatrices3([
		t * x * x + c,     t * y * x + z * s, t * z * x - y * s,
		t * x * y - z * s, t * y * y + c,     t * z * y + x * s,
		t * x * z + y * s, t * y * z - x * s, t * z * z + c,
		0, 0, 0], trans));
};
const makeMatrix3Scale = (scale = [1, 1, 1], origin = [0, 0, 0]) => [
	scale[0], 0, 0,
	0, scale[1], 0,
	0, 0, scale[2],
	scale[0] * -origin[0] + origin[0],
	scale[1] * -origin[1] + origin[1],
	scale[2] * -origin[2] + origin[2],
];
const makeMatrix3ReflectZ = (vector, origin = [0, 0]) => {
	const m = makeMatrix2Reflect(vector, origin);
	return [m[0], m[1], 0, m[2], m[3], 0, 0, 0, 1, m[4], m[5], 0];
};

export { determinant3, identity3x3, identity3x4, invertMatrix3, isIdentity3x4, makeMatrix3ReflectZ, makeMatrix3Rotate, makeMatrix3RotateX, makeMatrix3RotateY, makeMatrix3RotateZ, makeMatrix3Scale, makeMatrix3Translate, multiplyMatrices3, multiplyMatrix3Line3, multiplyMatrix3Vector3 };
