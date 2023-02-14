/* Math (c) Kraft, MIT License */
const identity2x2 = [1, 0, 0, 1];
const identity2x3 = identity2x2.concat(0, 0);
const multiplyMatrix2Vector2 = (matrix, vector) => [
	matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
	matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5],
];
const multiplyMatrix2Line2 = (matrix, vector, origin) => ({
	vector: [
		matrix[0] * vector[0] + matrix[2] * vector[1],
		matrix[1] * vector[0] + matrix[3] * vector[1],
	],
	origin: [
		matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
		matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5],
	],
});
const multiplyMatrices2 = (m1, m2) => [
	m1[0] * m2[0] + m1[2] * m2[1],
	m1[1] * m2[0] + m1[3] * m2[1],
	m1[0] * m2[2] + m1[2] * m2[3],
	m1[1] * m2[2] + m1[3] * m2[3],
	m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
	m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];
const determinant2 = m => m[0] * m[3] - m[1] * m[2];
const invertMatrix2 = (m) => {
	const det = determinant2(m);
	if (Math.abs(det) < 1e-6
		|| Number.isNaN(det)
		|| !Number.isFinite(m[4])
		|| !Number.isFinite(m[5])) {
		return undefined;
	}
	return [
		m[3] / det,
		-m[1] / det,
		-m[2] / det,
		m[0] / det,
		(m[2] * m[5] - m[3] * m[4]) / det,
		(m[1] * m[4] - m[0] * m[5]) / det,
	];
};
const makeMatrix2Translate = (x = 0, y = 0) => identity2x2.concat(x, y);
const makeMatrix2Scale = (scale = [1, 1], origin = [0, 0]) => [
	scale[0],
	0,
	0,
	scale[1],
	scale[0] * -origin[0] + origin[0],
	scale[1] * -origin[1] + origin[1],
];
const makeMatrix2Rotate = (angle, origin = [0, 0]) => {
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return [
		cos,
		sin,
		-sin,
		cos,
		origin[0],
		origin[1],
	];
};
const makeMatrix2Reflect = (vector, origin = [0, 0]) => {
	const angle = Math.atan2(vector[1], vector[0]);
	const cosAngle = Math.cos(angle);
	const sinAngle = Math.sin(angle);
	const cos_Angle = Math.cos(-angle);
	const sin_Angle = Math.sin(-angle);
	const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
	const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
	const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
	const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
	const tx = origin[0] + a * -origin[0] + -origin[1] * c;
	const ty = origin[1] + b * -origin[0] + -origin[1] * d;
	return [a, b, c, d, tx, ty];
};

export { determinant2, identity2x2, identity2x3, invertMatrix2, makeMatrix2Reflect, makeMatrix2Rotate, makeMatrix2Scale, makeMatrix2Translate, multiplyMatrices2, multiplyMatrix2Line2, multiplyMatrix2Vector2 };
