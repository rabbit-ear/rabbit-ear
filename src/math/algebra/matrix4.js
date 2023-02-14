/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { resize, normalize, normalize3, subtract3, cross3 } from './vectors.js';
import { makeMatrix2Reflect } from './matrix2.js';

const identity4x4 = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
const isIdentity4x4 = m => identity4x4
	.map((n, i) => Math.abs(n - m[i]) < EPSILON)
	.reduce((a, b) => a && b, true);
const multiplyMatrix4Vector3 = (m, vector) => [
	m[0] * vector[0] + m[4] * vector[1] + m[8] * vector[2] + m[12],
	m[1] * vector[0] + m[5] * vector[1] + m[9] * vector[2] + m[13],
	m[2] * vector[0] + m[6] * vector[1] + m[10] * vector[2] + m[14],
];
const multiplyMatrix4Line3 = (m, vector, origin) => ({
	vector: [
		m[0] * vector[0] + m[4] * vector[1] + m[8] * vector[2],
		m[1] * vector[0] + m[5] * vector[1] + m[9] * vector[2],
		m[2] * vector[0] + m[6] * vector[1] + m[10] * vector[2],
	],
	origin: [
		m[0] * origin[0] + m[4] * origin[1] + m[8] * origin[2] + m[12],
		m[1] * origin[0] + m[5] * origin[1] + m[9] * origin[2] + m[13],
		m[2] * origin[0] + m[6] * origin[1] + m[10] * origin[2] + m[14],
	],
});
const multiplyMatrices4 = (m1, m2) => [
	m1[0] * m2[0] + m1[4] * m2[1] + m1[8] * m2[2] + m1[12] * m2[3],
	m1[1] * m2[0] + m1[5] * m2[1] + m1[9] * m2[2] + m1[13] * m2[3],
	m1[2] * m2[0] + m1[6] * m2[1] + m1[10] * m2[2] + m1[14] * m2[3],
	m1[3] * m2[0] + m1[7] * m2[1] + m1[11] * m2[2] + m1[15] * m2[3],
	m1[0] * m2[4] + m1[4] * m2[5] + m1[8] * m2[6] + m1[12] * m2[7],
	m1[1] * m2[4] + m1[5] * m2[5] + m1[9] * m2[6] + m1[13] * m2[7],
	m1[2] * m2[4] + m1[6] * m2[5] + m1[10] * m2[6] + m1[14] * m2[7],
	m1[3] * m2[4] + m1[7] * m2[5] + m1[11] * m2[6] + m1[15] * m2[7],
	m1[0] * m2[8] + m1[4] * m2[9] + m1[8] * m2[10] + m1[12] * m2[11],
	m1[1] * m2[8] + m1[5] * m2[9] + m1[9] * m2[10] + m1[13] * m2[11],
	m1[2] * m2[8] + m1[6] * m2[9] + m1[10] * m2[10] + m1[14] * m2[11],
	m1[3] * m2[8] + m1[7] * m2[9] + m1[11] * m2[10] + m1[15] * m2[11],
	m1[0] * m2[12] + m1[4] * m2[13] + m1[8] * m2[14] + m1[12] * m2[15],
	m1[1] * m2[12] + m1[5] * m2[13] + m1[9] * m2[14] + m1[13] * m2[15],
	m1[2] * m2[12] + m1[6] * m2[13] + m1[10] * m2[14] + m1[14] * m2[15],
	m1[3] * m2[12] + m1[7] * m2[13] + m1[11] * m2[14] + m1[15] * m2[15],
];
const determinant4 = (m) => {
	const A2323 = m[10] * m[15] - m[11] * m[14];
	const A1323 = m[9] * m[15] - m[11] * m[13];
	const A1223 = m[9] * m[14] - m[10] * m[13];
	const A0323 = m[8] * m[15] - m[11] * m[12];
	const A0223 = m[8] * m[14] - m[10] * m[12];
	const A0123 = m[8] * m[13] - m[9] * m[12];
	return (
			m[0] * (m[5] * A2323 - m[6] * A1323 + m[7] * A1223)
		- m[1] * (m[4] * A2323 - m[6] * A0323 + m[7] * A0223)
		+ m[2] * (m[4] * A1323 - m[5] * A0323 + m[7] * A0123)
		- m[3] * (m[4] * A1223 - m[5] * A0223 + m[6] * A0123)
	);
};
const invertMatrix4 = (m) => {
	const det = determinant4(m);
	if (Math.abs(det) < 1e-6 || Number.isNaN(det)
		|| !Number.isFinite(m[12]) || !Number.isFinite(m[13]) || !Number.isFinite(m[14])) {
		return undefined;
	}
	const A2323 = m[10] * m[15] - m[11] * m[14];
	const A1323 = m[9] * m[15] - m[11] * m[13];
	const A1223 = m[9] * m[14] - m[10] * m[13];
	const A0323 = m[8] * m[15] - m[11] * m[12];
	const A0223 = m[8] * m[14] - m[10] * m[12];
	const A0123 = m[8] * m[13] - m[9] * m[12];
	const A2313 = m[6] * m[15] - m[7] * m[14];
	const A1313 = m[5] * m[15] - m[7] * m[13];
	const A1213 = m[5] * m[14] - m[6] * m[13];
	const A2312 = m[6] * m[11] - m[7] * m[10];
	const A1312 = m[5] * m[11] - m[7] * m[9];
	const A1212 = m[5] * m[10] - m[6] * m[9];
	const A0313 = m[4] * m[15] - m[7] * m[12];
	const A0213 = m[4] * m[14] - m[6] * m[12];
	const A0312 = m[4] * m[11] - m[7] * m[8];
	const A0212 = m[4] * m[10] - m[6] * m[8];
	const A0113 = m[4] * m[13] - m[5] * m[12];
	const A0112 = m[4] * m[9] - m[5] * m[8];
	const inv = [
		+(m[5] * A2323 - m[6] * A1323 + m[7] * A1223),
		-(m[1] * A2323 - m[2] * A1323 + m[3] * A1223),
		+(m[1] * A2313 - m[2] * A1313 + m[3] * A1213),
		-(m[1] * A2312 - m[2] * A1312 + m[3] * A1212),
		-(m[4] * A2323 - m[6] * A0323 + m[7] * A0223),
		+(m[0] * A2323 - m[2] * A0323 + m[3] * A0223),
		-(m[0] * A2313 - m[2] * A0313 + m[3] * A0213),
		+(m[0] * A2312 - m[2] * A0312 + m[3] * A0212),
		+(m[4] * A1323 - m[5] * A0323 + m[7] * A0123),
		-(m[0] * A1323 - m[1] * A0323 + m[3] * A0123),
		+(m[0] * A1313 - m[1] * A0313 + m[3] * A0113),
		-(m[0] * A1312 - m[1] * A0312 + m[3] * A0112),
		-(m[4] * A1223 - m[5] * A0223 + m[6] * A0123),
		+(m[0] * A1223 - m[1] * A0223 + m[2] * A0123),
		-(m[0] * A1213 - m[1] * A0213 + m[2] * A0113),
		+(m[0] * A1212 - m[1] * A0212 + m[2] * A0112),
	];
	const invDet = 1.0 / det;
	return inv.map(n => n * invDet);
};
const identity4x3 = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]);
const makeMatrix4Translate = (x = 0, y = 0, z = 0) => [...identity4x3, x, y, z, 1];
const singleAxisRotate4 = (angle, origin, i0, i1, sgn) => {
	const mat = makeMatrix4Translate(...origin);
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	mat[i0 * 4 + i0] = cos;
	mat[i0 * 4 + i1] = (sgn ? +1 : -1) * sin;
	mat[i1 * 4 + i0] = (sgn ? -1 : +1) * sin;
	mat[i1 * 4 + i1] = cos;
	return mat;
};
const makeMatrix4RotateX = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 1, 2, true));
const makeMatrix4RotateY = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 0, 2, false));
const makeMatrix4RotateZ = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 0, 1, true));
const makeMatrix4Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	const pos = [0, 1, 2].map(i => origin[i] || 0);
	const [x, y, z] = resize(3, normalize(vector));
	const c = Math.cos(angle);
	const s = Math.sin(angle);
	const t = 1 - c;
	const trans = makeMatrix4Translate(-pos[0], -pos[1], -pos[2]);
	const trans_inv = makeMatrix4Translate(pos[0], pos[1], pos[2]);
	return multiplyMatrices4(trans_inv, multiplyMatrices4([
		t * x * x + c,     t * y * x + z * s, t * z * x - y * s, 0,
		t * x * y - z * s, t * y * y + c,     t * z * y + x * s, 0,
		t * x * z + y * s, t * y * z - x * s, t * z * z + c, 0,
		0, 0, 0, 1], trans));
};
const makeMatrix4Scale = (scale = [1, 1, 1], origin = [0, 0, 0]) => [
	scale[0], 0, 0, 0,
	0, scale[1], 0, 0,
	0, 0, scale[2], 0,
	scale[0] * -origin[0] + origin[0],
	scale[1] * -origin[1] + origin[1],
	scale[2] * -origin[2] + origin[2],
	1,
];
const makeMatrix4ReflectZ = (vector, origin = [0, 0]) => {
	const m = makeMatrix2Reflect(vector, origin);
	return [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, m[4], m[5], 0, 1];
};
const makePerspectiveMatrix4 = (FOV, aspect, near, far) => {
	const f = Math.tan(Math.PI * 0.5 - 0.5 * FOV);
	const rangeInv = 1.0 / (near - far);
	return [
		f / aspect, 0, 0, 0,
		0, f, 0, 0,
		0, 0, (near + far) * rangeInv, -1,
		0, 0, near * far * rangeInv * 2, 0,
	];
};
const makeOrthographicMatrix4 = (top, right, bottom, left, near, far) => [
	2 / (right - left), 0, 0, 0,
	0, 2 / (top - bottom), 0, 0,
	0, 0, 2 / (near - far), 0,
	(left + right) / (left - right),
	(bottom + top) / (bottom - top),
	(near + far) / (near - far),
	1,
];
const makeLookAtMatrix4 = (position, target, up) => {
	const zAxis = normalize3(subtract3(position, target));
	const xAxis = normalize3(cross3(up, zAxis));
	const yAxis = normalize3(cross3(zAxis, xAxis));
	return [
		xAxis[0], xAxis[1], xAxis[2], 0,
		yAxis[0], yAxis[1], yAxis[2], 0,
		zAxis[0], zAxis[1], zAxis[2], 0,
		position[0], position[1], position[2], 1,
	];
};

export { determinant4, identity4x4, invertMatrix4, isIdentity4x4, makeLookAtMatrix4, makeMatrix4ReflectZ, makeMatrix4Rotate, makeMatrix4RotateX, makeMatrix4RotateY, makeMatrix4RotateZ, makeMatrix4Scale, makeMatrix4Translate, makeOrthographicMatrix4, makePerspectiveMatrix4, multiplyMatrices4, multiplyMatrix4Line3, multiplyMatrix4Vector3 };
