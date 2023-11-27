/* Rabbit Ear 0.9.33 alpha 2023-02-21 (c) Kraft, MIT License */

(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f():typeof define==='function'&&define.amd?define(f):(g=typeof globalThis!=='undefined'?globalThis:g||self,g.ear=f());})(this,(function(){'use strict';const isBrowser$1 = typeof window !== "undefined"
	&& typeof window.document !== "undefined";
const isNode = typeof process !== "undefined"
	&& process.versions != null
	&& process.versions.node != null;const Messages$1 = {
	planarize: "graph could not planarize",
	manifold: "valid manifold required",
	graphCycle: "cycle not allowed",
	planarBoundary: "planar boundary detection error, bad graph",
	circularEdge: "circular edges not allowed",
	replaceModifyParam: "replace() index < value. indices parameter modified",
	replaceUndefined: "replace() generated undefined",
	flatFoldAngles: "foldAngles cannot be determined from flat-folded faces without an assignment",
	noWebGL: "WebGl not Supported",
	convexFace: "only convex faces are supported",
	window: "window not set; if using node/deno include package @xmldom/xmldom and set ear.window = xmldom",
	nonConvexTriangulation: "non-convex triangulation requires vertices_coords",
	backendStylesheet: "svgToFold found <style> in <svg>. rendering will be incomplete unless run in a major browser.",
	noLayerSolution: "LayerSolver bad input. no solution possible",
};const windowContainer = { window: undefined };
const buildDocument = (newWindow) => new newWindow.DOMParser()
	.parseFromString("<!DOCTYPE html><title>.</title>", "text/html");
const setWindow = (newWindow) => {
	if (!newWindow.document) { newWindow.document = buildDocument(newWindow); }
	windowContainer.window = newWindow;
	return windowContainer.window;
};
if (isBrowser$1) { windowContainer.window = window; }
const RabbitEarWindow = () => {
	if (windowContainer.window === undefined) {
		throw new Error(Messages$1.window);
	}
	return windowContainer.window;
};const EPSILON = 1e-6;
const R2D = 180 / Math.PI;
const D2R = Math.PI / 180;
const TWO_PI = Math.PI * 2;const constant=/*#__PURE__*/Object.freeze({__proto__:null,D2R,EPSILON,R2D,TWO_PI});const safeAdd = (a, b) => a + (b || 0);
const magnitude = v => Math.sqrt(v
	.map(n => n * n)
	.reduce(safeAdd, 0));
const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
const magnitude3 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
const magSquared2 = v => v[0] * v[0] + v[1] * v[1];
const magSquared = v => v
	.map(n => n * n)
	.reduce(safeAdd, 0);
const normalize$1 = (v) => {
	const m = magnitude(v);
	return m === 0 ? v : v.map(c => c / m);
};
const normalize2 = (v) => {
	const m = magnitude2(v);
	return m === 0 ? v : [v[0] / m, v[1] / m];
};
const normalize3 = (v) => {
	const m = magnitude3(v);
	return m === 0 ? v : [v[0] / m, v[1] / m, v[2] / m];
};
const scale$1 = (v, s) => v.map(n => n * s);
const scale2 = (v, s) => [v[0] * s, v[1] * s];
const scale3 = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
const add2 = (v, u) => [v[0] + u[0], v[1] + u[1]];
const add3 = (v, u) => [v[0] + u[0], v[1] + u[1], v[2] + u[2]];
const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
const subtract2 = (v, u) => [v[0] - u[0], v[1] - u[1]];
const subtract3 = (v, u) => [v[0] - u[0], v[1] - u[1], v[2] - u[2]];
const dot = (v, u) => v
	.map((_, i) => v[i] * u[i])
	.reduce(safeAdd, 0);
const dot2 = (v, u) => v[0] * u[0] + v[1] * u[1];
const dot3 = (v, u) => v[0] * u[0] + v[1] * u[1] + v[2] * u[2];
const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
const midpoint2 = (v, u) => scale2(add2(v, u), 0.5);
const midpoint3 = (v, u) => scale3(add3(v, u), 0.5);
const average = function () {
	if (arguments.length === 0) { return undefined; }
	const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
	const sum = Array(dimension).fill(0);
	Array.from(arguments)
		.forEach(vec => sum
			.forEach((_, i) => { sum[i] += vec[i] || 0; }));
	return sum.map(n => n / arguments.length);
};
const average2 = (...vectors) => {
	if (!vectors || !vectors.length) { return undefined; }
	const inverseLength = 1 / vectors.length;
	return vectors
		.reduce((a, b) => add2(a, b), [0, 0])
		.map(c => c * inverseLength);
};
const lerp = (v, u, t = 0) => {
	const inv = 1.0 - t;
	return v.map((n, i) => n * inv + (u[i] || 0) * t);
};
const cross2 = (v, u) => v[0] * u[1] - v[1] * u[0];
const cross3 = (v, u) => [
	v[1] * u[2] - v[2] * u[1],
	v[2] * u[0] - v[0] * u[2],
	v[0] * u[1] - v[1] * u[0],
];
const distance = (v, u) => Math.sqrt(v
	.map((_, i) => (v[i] - u[i]) ** 2)
	.reduce(safeAdd, 0));
const distance2 = (v, u) => {
	const p = v[0] - u[0];
	const q = v[1] - u[1];
	return Math.sqrt((p * p) + (q * q));
};
const distance3 = (v, u) => {
	const a = v[0] - u[0];
	const b = v[1] - u[1];
	const c = v[2] - u[2];
	return Math.sqrt((a * a) + (b * b) + (c * c));
};
const flip = v => v.map(n => -n);
const rotate90 = v => [-v[1], v[0]];
const rotate270 = v => [v[1], -v[0]];
const degenerate = (v, epsilon = EPSILON) => v
	.map(n => Math.abs(n))
	.reduce(safeAdd, 0) < epsilon;
const parallelNormalized = (v, u, epsilon = EPSILON) => 1 - Math
	.abs(dot(v, u)) < epsilon;
const parallel = (v, u, epsilon = EPSILON) => parallelNormalized(
	normalize$1(v),
	normalize$1(u),
	epsilon,
);
const parallel2 = (v, u, epsilon = EPSILON) => Math
	.abs(cross2(v, u)) < epsilon;
const resize = (dimension, vector) => (vector.length === dimension
	? vector
	: Array(dimension).fill(0).map((z, i) => (vector[i] ? vector[i] : z)));
const resizeUp = (a, b) => [a, b]
	.map(v => resize(Math.max(a.length, b.length), v));
const basisVectors2 = (vector = [1, 0]) => {
	const normalized = normalize2(vector);
	return [normalized, rotate90(normalized)];
};
const basisVectors3 = (vector = [1, 0, 0]) => {
	const normalized = normalize3(vector);
	const crosses = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
		.map(v => cross3(v, normalized));
	const index = crosses
		.map(magnitude3)
		.map((n, i) => ({ n, i }))
		.sort((a, b) => b.n - a.n)
		.map(el => el.i)
		.shift();
	const perpendicular = normalize3(crosses[index]);
	return [normalized, perpendicular, cross3(normalized, perpendicular)];
};
const basisVectors = (vector) => (vector.length === 2
	? basisVectors2(vector)
	: basisVectors3(vector)
);const vector=/*#__PURE__*/Object.freeze({__proto__:null,add,add2,add3,average,average2,basisVectors,basisVectors2,basisVectors3,cross2,cross3,degenerate,distance,distance2,distance3,dot,dot2,dot3,flip,lerp,magSquared,magSquared2,magnitude,magnitude2,magnitude3,midpoint,midpoint2,midpoint3,normalize:normalize$1,normalize2,normalize3,parallel,parallel2,parallelNormalized,resize,resizeUp,rotate270,rotate90,scale:scale$1,scale2,scale3,subtract,subtract2,subtract3});const identity2x2 = [1, 0, 0, 1];
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
	if (Math.abs(det) < 1e-12
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
const makeMatrix2UniformScale = (scale = 1, origin = [0, 0]) => (
	makeMatrix2Scale([scale, scale], origin)
);
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
};const matrix2=/*#__PURE__*/Object.freeze({__proto__:null,determinant2,identity2x2,identity2x3,invertMatrix2,makeMatrix2Reflect,makeMatrix2Rotate,makeMatrix2Scale,makeMatrix2Translate,makeMatrix2UniformScale,multiplyMatrices2,multiplyMatrix2Line2,multiplyMatrix2Vector2});const identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
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
	if (Math.abs(det) < 1e-12 || Number.isNaN(det)
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
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const rotate = identity3x3.concat([0, 0, 0]);
	rotate[i0 * 3 + i0] = cos;
	rotate[i0 * 3 + i1] = (sgn ? +1 : -1) * sin;
	rotate[i1 * 3 + i0] = (sgn ? -1 : +1) * sin;
	rotate[i1 * 3 + i1] = cos;
	const origin3 = [0, 1, 2].map(i => origin[i] || 0);
	const trans = identity3x3.concat(flip(origin3));
	const trans_inv = identity3x3.concat(origin3);
	return multiplyMatrices3(trans_inv, multiplyMatrices3(rotate, trans));
};
const makeMatrix3RotateX = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 1, 2, true));
const makeMatrix3RotateY = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 2, false));
const makeMatrix3RotateZ = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate(angle, origin, 0, 1, true));
const makeMatrix3Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	const pos = [0, 1, 2].map(i => origin[i] || 0);
	const [x, y, z] = resize(3, normalize$1(vector));
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
const makeMatrix3UniformScale = (scale = 1, origin = [0, 0, 0]) => (
	makeMatrix3Scale([scale, scale, scale], origin)
);
const makeMatrix3ReflectZ = (vector, origin = [0, 0]) => {
	const m = makeMatrix2Reflect(vector, origin);
	return [m[0], m[1], 0, m[2], m[3], 0, 0, 0, 1, m[4], m[5], 0];
};const matrix3=/*#__PURE__*/Object.freeze({__proto__:null,determinant3,identity3x3,identity3x4,invertMatrix3,isIdentity3x4,makeMatrix3ReflectZ,makeMatrix3Rotate,makeMatrix3RotateX,makeMatrix3RotateY,makeMatrix3RotateZ,makeMatrix3Scale,makeMatrix3Translate,makeMatrix3UniformScale,multiplyMatrices3,multiplyMatrix3Line3,multiplyMatrix3Vector3});const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";
const semiFlattenArrays = function () {
	switch (arguments.length) {
	case 0: return Array.from(arguments);
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? semiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...semiFlattenArrays(a)]
			: a));
	}
};
const flattenArrays = function () {
	switch (arguments.length) {
	case 0: return Array.from(arguments);
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? flattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...flattenArrays(a)]
			: a)).flat();
	}
};
const getVector = function () {
	let list = flattenArrays(arguments);
	const a = list[0];
	if (typeof a === "object" && a !== null && !Number.isNaN(a.x)) {
		list = ["x", "y", "z"].map(c => a[c]).filter(b => b !== undefined);
	}
	return list.filter(n => typeof n === "number");
};
const getArrayOfVectors = function () {
	return semiFlattenArrays(arguments).map(el => getVector(el));
};
const getSegment = function () {
	const args = semiFlattenArrays(arguments);
	return args.length === 4
		? [[0, 1], [2, 3]].map(s => s.map(i => args[i]))
		: args.map(el => getVector(el));
};
const vectorOriginForm = (vector, origin = []) => ({ vector, origin });
const getLine$1 = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0 || args[0] == null) { return vectorOriginForm([], []); }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector, args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};const getMethods=/*#__PURE__*/Object.freeze({__proto__:null,getArrayOfVectors,getLine:getLine$1,getSegment,getVector});const angleArray = count => Array
	.from(Array(Math.floor(count)))
	.map((_, i) => TWO_PI * (i / count));
const anglesToVecs = (angles, radius) => angles
	.map(a => [radius * Math.cos(a), radius * Math.sin(a)]);
const makePolygonCircumradius = (sides = 3, circumradius = 1) => (
	anglesToVecs(angleArray(sides), circumradius)
);
const makePolygonCircumradiusSide = (sides = 3, circumradius = 1) => {
	const halfwedge = Math.PI / sides;
	const angles = angleArray(sides).map(a => a + halfwedge);
	return anglesToVecs(angles, circumradius);
};
const makePolygonInradius = (sides = 3, inradius = 1) => (
	makePolygonCircumradius(sides, inradius / Math.cos(Math.PI / sides)));
const makePolygonInradiusSide = (sides = 3, inradius = 1) => (
	makePolygonCircumradiusSide(sides, inradius / Math.cos(Math.PI / sides)));
const makePolygonSideLength = (sides = 3, length = 1) => (
	makePolygonCircumradius(sides, (length / 2) / Math.sin(Math.PI / sides)));
const makePolygonSideLengthSide = (sides = 3, length = 1) => (
	makePolygonCircumradiusSide(sides, (length / 2) / Math.sin(Math.PI / sides)));
const makePolygonNonCollinear = (polygon, epsilon = EPSILON) => {
	const edges_vector = polygon
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(pair => subtract(pair[1], pair[0]));
	const vertex_collinear = edges_vector
		.map((vector, i, arr) => [vector, arr[(i + arr.length - 1) % arr.length]])
		.map(pair => !parallel(pair[1], pair[0], epsilon));
	return polygon
		.filter((vertex, v) => vertex_collinear[v]);
};
const signedArea = points => 0.5 * points
	.map((el, i, arr) => [el, arr[(i + 1) % arr.length]])
	.map(pair => cross2(...pair))
	.reduce((a, b) => a + b, 0);
const centroid = (points) => {
	const sixthArea = 1 / (6 * signedArea(points));
	return points
		.map((el, i, arr) => [el, arr[(i + 1) % arr.length]])
		.map(pair => scale2(add2(...pair), cross2(...pair)))
		.reduce((a, b) => add2(a, b), [0, 0])
		.map(c => c * sixthArea);
};
const getDimension$1 = (points) => {
	for (let i = 0; i < points.length; i += 1) {
		if (points[i] && points[i].length) { return points[i].length; }
	}
	return 0;
};
const boundingBox$1 = (points, padding = 0) => {
	if (!points || !points.length) { return undefined; }
	const dimension = getDimension$1(points);
	const min = Array(dimension).fill(Infinity);
	const max = Array(dimension).fill(-Infinity);
	points
		.filter(p => p !== undefined)
		.forEach(point => point
			.forEach((c, i) => {
				if (c < min[i]) { min[i] = c - padding; }
				if (c > max[i]) { max[i] = c + padding; }
			}));
	const span = max.map((m, i) => m - min[i]);
	return { min, max, span };
};const polygonMethods=/*#__PURE__*/Object.freeze({__proto__:null,boundingBox:boundingBox$1,centroid,makePolygonCircumradius,makePolygonCircumradiusSide,makePolygonInradius,makePolygonInradiusSide,makePolygonNonCollinear,makePolygonSideLength,makePolygonSideLengthSide,signedArea});const epsilonEqual = (a, b, epsilon = EPSILON) => Math.abs(a - b) < epsilon;
const epsilonCompare = (a, b, epsilon = EPSILON) => (
	epsilonEqual(a, b, epsilon) ? 0 : Math.sign(a - b)
);
const epsilonEqualVectors = (a, b, epsilon = EPSILON) => {
	for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
		if (!epsilonEqual(a[i] || 0, b[i] || 0, epsilon)) { return false; }
	}
	return true;
};
const include = (n, epsilon = EPSILON) => n > -epsilon;
const exclude = (n, epsilon = EPSILON) => n > epsilon;
const includeL = () => true;
const excludeL = () => true;
const includeR = include;
const excludeR = exclude;
const includeS = (n, e = EPSILON) => n > -e && n < 1 + e;
const excludeS = (n, e = EPSILON) => n > e && n < 1 - e;const compare=/*#__PURE__*/Object.freeze({__proto__:null,epsilonCompare,epsilonEqual,epsilonEqualVectors,exclude,excludeL,excludeR,excludeS,include,includeL,includeR,includeS});const foldKeys = {
	file: [
		"file_spec",
		"file_creator",
		"file_author",
		"file_title",
		"file_description",
		"file_classes",
		"file_frames",
	],
	frame: [
		"frame_author",
		"frame_title",
		"frame_description",
		"frame_attributes",
		"frame_classes",
		"frame_unit",
		"frame_parent",
		"frame_inherit",
	],
	graph: [
		"vertices_coords",
		"vertices_vertices",
		"vertices_faces",
		"edges_vertices",
		"edges_faces",
		"edges_assignment",
		"edges_foldAngle",
		"edges_length",
		"faces_vertices",
		"faces_edges",
		"vertices_edges",
		"edges_edges",
		"faces_faces",
	],
	orders: [
		"edgeOrders",
		"faceOrders",
	],
};
const foldFileClasses = [
	"singleModel",
	"multiModel",
	"animation",
	"diagrams",
];
const foldFrameClasses = [
	"creasePattern",
	"foldedForm",
	"graph",
	"linkage",
];
const foldFrameAttributes = [
	"2D",
	"3D",
	"abstract",
	"manifold",
	"nonManifold",
	"orientable",
	"nonOrientable",
	"selfTouching",
	"nonSelfTouching",
	"selfIntersecting",
	"nonSelfIntersecting",
];const foldKeyMethods=/*#__PURE__*/Object.freeze({__proto__:null,foldFileClasses,foldFrameAttributes,foldFrameClasses,foldKeys});const singularize = {
	vertices: "vertex",
	edges: "edge",
	faces: "face",
};
const pluralize = {
	vertex: "vertices",
	edge: "edges",
	face: "faces",
};
const edgesAssignmentValues = Array.from("BbMmVvFfJjCcUu");
const edgesAssignmentNames = {
	B: "boundary",
	M: "mountain",
	V: "valley",
	F: "flat",
	J: "join",
	C: "cut",
	U: "unassigned",
};
Object.keys(edgesAssignmentNames).forEach(key => {
	edgesAssignmentNames[key.toLowerCase()] = edgesAssignmentNames[key];
});
const assignmentFlatFoldAngle = {
	B: 0,
	b: 0,
	M: -180,
	m: -180,
	V: 180,
	v: 180,
	F: 0,
	f: 0,
	J: 0,
	j: 0,
	C: 0,
	c: 0,
	U: 0,
	u: 0,
};
const assignmentCanBeFolded = {
	B: false,
	b: false,
	M: true,
	m: true,
	V: true,
	v: true,
	F: false,
	f: false,
	J: false,
	j: false,
	C: false,
	c: false,
	U: true,
	u: true,
};
const assignmentIsBoundary = {
	B: true,
	b: true,
	M: false,
	m: false,
	V: false,
	v: false,
	F: false,
	f: false,
	J: false,
	j: false,
	C: true,
	c: true,
	U: false,
	u: false,
};
const edgeAssignmentToFoldAngle = assignment => (
	assignmentFlatFoldAngle[assignment] || 0
);
const edgeFoldAngleToAssignment = (angle) => {
	if (angle > EPSILON) { return "V"; }
	if (angle < -EPSILON) { return "M"; }
	return "U";
};
const edgeFoldAngleIsFlat = angle => epsilonEqual(0, angle)
 || epsilonEqual(-180, angle)
 || epsilonEqual(180, angle);
const edgesFoldAngleAreAllFlat = ({ edges_foldAngle }) => {
	if (!edges_foldAngle) { return true; }
	for (let i = 0; i < edges_foldAngle.length; i += 1) {
		if (!edgeFoldAngleIsFlat(edges_foldAngle[i])) { return false; }
	}
	return true;
};
const filterKeys = (obj, matchFunction) => Object
	.keys(obj)
	.filter(key => matchFunction(key));
const filterKeysWithPrefix = (obj, prefix) => filterKeys(
	obj,
	s => s.substring(0, prefix.length + 1) === `${prefix}_`,
);
const filterKeysWithSuffix = (obj, suffix) => filterKeys(
	obj,
	s => s.substring(s.length - suffix.length - 1, s.length) === `_${suffix}`,
);
const transposeGraphArrays = (graph, geometry_key) => {
	const matching_keys = filterKeysWithPrefix(graph, geometry_key);
	if (matching_keys.length === 0) { return []; }
	const len = Math.max(...matching_keys.map(arr => graph[arr].length));
	const geometry = Array.from(Array(len))
		.map(() => ({}));
	matching_keys
		.forEach(key => geometry
			.forEach((o, i) => { geometry[i][key] = graph[key][i]; }));
	return geometry;
};
const transposeGraphArrayAtIndex = (
	graph,
	geometry_key,
	index,
) => {
	const matching_keys = filterKeysWithPrefix(graph, geometry_key);
	if (matching_keys.length === 0) { return undefined; }
	const geometry = {};
	matching_keys.forEach((key) => { geometry[key] = graph[key][index]; });
	return geometry;
};
const flatFoldKeys = Object.freeze([]
	.concat(foldKeys.file)
	.concat(foldKeys.frame)
	.concat(foldKeys.graph)
	.concat(foldKeys.orders));
const isFoldObject = (object = {}) => (
	Object.keys(object).length === 0
		? 0
		: flatFoldKeys
			.filter(key => object[key]).length / Object.keys(object).length);
const isFoldedForm = ({ frame_classes, file_classes }) => (
	(frame_classes && frame_classes.includes("foldedForm"))
		|| (file_classes && file_classes.includes("foldedForm"))
);
const getDimension = ({ vertices_coords }, epsilon = EPSILON) => {
	for (let i = 0; i < vertices_coords.length; i += 1) {
		if (vertices_coords[i] && vertices_coords[i].length === 3
			&& !epsilonEqual(0, vertices_coords[i][2], epsilon)) {
			return 3;
		}
	}
	return 2;
};
const getDimensionQuick = ({ vertices_coords }) => {
	if (vertices_coords[0] !== undefined) {
		return vertices_coords[0].length;
	}
	const vertex = vertices_coords.filter(() => true).shift();
	if (!vertex) { return undefined; }
	return vertex.length;
};
const makeEdgesIsFolded = ({ edges_vertices, edges_foldAngle, edges_assignment }) => {
	if (edges_assignment === undefined) {
		return edges_foldAngle === undefined
			? edges_vertices.map(() => true)
			: edges_foldAngle.map(angle => angle < -EPSILON || angle > EPSILON);
	}
	return edges_assignment.map(a => assignmentCanBeFolded[a]);
};
const flipAssignmentLookup = { M: "V", m: "v", V: "M", v: "m" };
const invertAssignment = (assign) => (
	flipAssignmentLookup[assign] || assign
);
const invertAssignments = (graph) => {
	if (graph.edges_assignment) {
		graph.edges_assignment = graph.edges_assignment
			.map(a => (flipAssignmentLookup[a] ? flipAssignmentLookup[a] : a));
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle = graph.edges_foldAngle.map(n => -n);
	}
	return graph;
};
const getFileMetadata = (FOLD = {}) => {
	const metadata = {};
	foldKeys.file
		.filter(key => key !== "file_frames")
		.filter(key => FOLD[key] !== undefined)
		.forEach(key => { metadata[key] = FOLD[key]; });
	return metadata;
};const foldSpecMethods=/*#__PURE__*/Object.freeze({__proto__:null,assignmentCanBeFolded,assignmentFlatFoldAngle,assignmentIsBoundary,edgeAssignmentToFoldAngle,edgeFoldAngleIsFlat,edgeFoldAngleToAssignment,edgesAssignmentNames,edgesAssignmentValues,edgesFoldAngleAreAllFlat,filterKeysWithPrefix,filterKeysWithSuffix,getDimension,getDimensionQuick,getFileMetadata,invertAssignment,invertAssignments,isFoldObject,isFoldedForm,makeEdgesIsFolded,pluralize,singularize,transposeGraphArrayAtIndex,transposeGraphArrays});const transform = function (graph, matrix) {
	filterKeysWithSuffix(graph, "coords").forEach((key) => {
		graph[key] = graph[key]
			.map(v => resize(3, v))
			.map(v => multiplyMatrix3Vector3(matrix, v));
	});
	filterKeysWithSuffix(graph, "matrix").forEach((key) => {
		graph[key] = graph[key]
			.map(m => multiplyMatrices3(m, matrix));
	});
	return graph;
};
const scale = (graph, ...args) => {
	const values = args.flat();
	const vec3 = values.length === 1
		? [values[0], values[0], values[0]]
		: [1, 1, 1].map((n, i) => (values[i] === undefined ? n : values[i]));
	const matrix = makeMatrix3Scale(vec3);
	return transform(graph, matrix);
};
const translate = (graph, ...args) => {
	const vector = getVector(...args);
	const vector3 = resize(3, vector);
	const matrix = makeMatrix3Translate(...vector3);
	return transform(graph, matrix);
};
const rotate = (graph, angle, vector, origin) => transform(
	graph,
	makeMatrix3Rotate(angle, vector, origin),
);
const rotateZ = (graph, angle, ...args) => {
	const origin = getVector(...args);
	const origin3 = resize(3, origin);
	const matrix = makeMatrix3RotateZ(angle, origin3);
	return transform(graph, matrix);
};
const unitize = function (graph) {
	if (!graph.vertices_coords) { return graph; }
	const box = boundingBox$1(graph.vertices_coords);
	const longest = Math.max(...box.span);
	const sc = longest === 0 ? 1 : (1 / longest);
	const origin = box.min;
	graph.vertices_coords = graph.vertices_coords
		.map(coord => subtract(coord, origin))
		.map(coord => coord.map(n => n * sc));
	return graph;
};const transform$1=/*#__PURE__*/Object.freeze({__proto__:null,rotate,rotateZ,scale,transform,translate,unitize});const getVerticesClusters = ({ vertices_coords }, epsilon = EPSILON) => {
	if (!vertices_coords) { return []; }
	const dimensions = getDimensionQuick({ vertices_coords });
	const dimensionArray = Array.from(Array(dimensions));
	const clusters = [];
	const finished = [];
	const vertices = vertices_coords
		.map((point, i) => ({ i, d: point[0] }))
		.sort((a, b) => a.d - b.d)
		.map(a => a.i);
	let rangeStart = 0;
	const ranges = dimensionArray.map(() => [0, 0]);
	const isInsideCluster = (index) => dimensionArray
		.map((_, d) => vertices_coords[index][d] > ranges[d][0]
			&& vertices_coords[index][d] < ranges[d][1])
		.reduce((a, b) => a && b, true);
	const updateRange = (cluster) => {
		const newVertex = cluster[cluster.length - 1];
		while (vertices_coords[newVertex][0] - vertices_coords[cluster[rangeStart]][0] > epsilon) {
			rangeStart += 1;
		}
		const points = cluster.slice(rangeStart, cluster.length)
			.map(v => vertices_coords[v]);
		ranges[0] = [
			points[0][0] - epsilon,
			points[points.length - 1][0] + epsilon,
		];
		for (let d = 1; d < dimensions; d += 1) {
			const scalars = points.map(p => p[d]);
			ranges[d] = [
				Math.min(...scalars) - epsilon,
				Math.max(...scalars) + epsilon,
			];
		}
	};
	while (finished.length !== vertices_coords.length) {
		const cluster = [];
		const startVertex = vertices.shift();
		cluster.push(startVertex);
		finished.push(startVertex);
		rangeStart = 0;
		updateRange(cluster);
		let walk = 0;
		while (walk < vertices.length && vertices_coords[vertices[walk]][0] < ranges[0][1]) {
			if (isInsideCluster(vertices[walk])) {
				const newVertex = vertices.splice(walk, 1).shift();
				cluster.push(newVertex);
				finished.push(newVertex);
				updateRange(cluster);
			} else {
				walk += 1;
			}
		}
		clusters.push(cluster);
	}
	return clusters;
};const verticesClusters=/*#__PURE__*/Object.freeze({__proto__:null,getVerticesClusters});const max_arrays_length = (...arrays) => Math.max(0, ...(arrays
	.filter(el => el !== undefined)
	.map(el => el.length)));
const count = (graph, key) => (
	max_arrays_length(...filterKeysWithPrefix(graph, key).map(k => graph[k])));
count.vertices = ({ vertices_coords, vertices_faces, vertices_vertices }) => (
	max_arrays_length(vertices_coords, vertices_faces, vertices_vertices));
count.edges = ({ edges_vertices, edges_edges, edges_faces }) => (
	max_arrays_length(edges_vertices, edges_edges, edges_faces));
count.faces = ({ faces_vertices, faces_edges, faces_faces }) => (
	max_arrays_length(faces_vertices, faces_edges, faces_faces));const mirrorArray = (arr) => arr.concat(arr.slice(0, -1).reverse());
const mergeArraysWithHoles = (...arrays) => {
	const flattened = [];
	arrays.forEach(array => array.forEach((value, i) => {
		flattened[i] = value;
	}));
	return flattened;
};
const splitCircularArray = (array, indices) => {
	indices.sort((a, b) => a - b);
	return [
		array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
		array.slice(indices[0], indices[1] + 1),
	];
};
const uniqueElements = (array) => Array.from(new Set(array));
const nonUniqueElements = (array) => {
	const count = {};
	array.forEach(n => {
		if (count[n] === undefined) { count[n] = 0; }
		count[n] += 1;
	});
	return array.filter(n => count[n] > 1);
};
const uniqueSortedNumbers = (array) => {
	const hash = {};
	array.forEach(n => { hash[n] = true; });
	return Object.keys(hash).map(parseFloat);
};
const epsilonUniqueSortedNumbers = (array, epsilon = EPSILON) => {
	const numbers = array.slice().sort((a, b) => a - b);
	if (numbers.length < 2) { return numbers; }
	const keep = [true];
	for (let i = 1; i < numbers.length; i += 1) {
		keep[i] = !epsilonEqual(numbers[i], numbers[i - 1], epsilon);
	}
	return numbers.filter((_, i) => keep[i]);
};
const setDifferenceSortedIntegers = (a, b) => {
	const result = [];
	let ai = 0;
	let bi = 0;
	while (ai < a.length && bi < b.length) {
		if (a[ai] === b[bi]) {
			ai += 1;
			continue;
		}
		if (a[ai] > b[bi]) {
			bi += 1;
			continue;
		}
		if (b[bi] > a[ai]) {
			result.push(a[ai]);
			ai += 1;
			continue;
		}
	}
	return result;
};
const setDifferenceSortedNumbers = (a, b, epsilon = EPSILON) => {
	const result = [];
	let ai = 0;
	let bi = 0;
	while (ai < a.length && bi < b.length) {
		if (epsilonEqual(a[ai], b[bi], epsilon)) {
			ai += 1;
			continue;
		}
		if (a[ai] > b[bi]) {
			bi += 1;
			continue;
		}
		if (b[bi] > a[ai]) {
			result.push(a[ai]);
			ai += 1;
			continue;
		}
	}
	return result;
};
const chooseTwoPairs = (array) => {
	const pairs = Array((array.length * (array.length - 1)) / 2);
	let index = 0;
	for (let i = 0; i < array.length - 1; i += 1) {
		for (let j = i + 1; j < array.length; j += 1, index += 1) {
			pairs[index] = [array[i], array[j]];
		}
	}
	return pairs;
};
const arrayMinimum = (array, conversion) => {
	const objs = conversion === undefined
		? array.map((value, i) => ({ i, value }))
		: array.map((value, i) => ({ i, value: conversion(value) }));
	let index;
	let smallest_value = Infinity;
	for (let i = 0; i < objs.length; i += 1) {
		if (objs[i].value < smallest_value) {
			index = i;
			smallest_value = objs[i].value;
		}
	}
	return index;
};
const arrayMinIndex = (array) => {
	let index = 0;
	for (let i = 1; i < array.length; i += 1) {
		if (array[i] < array[index]) { index = i; }
	}
	return index;
};
const arrayMaxIndex = (array) => {
	let index = 0;
	for (let i = 1; i < array.length; i += 1) {
		if (array[i] > array[index]) { index = i; }
	}
	return index;
};const arrayMethods=/*#__PURE__*/Object.freeze({__proto__:null,arrayMaxIndex,arrayMinIndex,arrayMinimum,chooseTwoPairs,epsilonUniqueSortedNumbers,mergeArraysWithHoles,mirrorArray,nonUniqueElements,setDifferenceSortedIntegers,setDifferenceSortedNumbers,splitCircularArray,uniqueElements,uniqueSortedNumbers});const mergeSimpleNextmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	const solution = maps[0].map((_, i) => i);
	maps.forEach(map => solution.forEach((s, i) => { solution[i] = map[s]; }));
	return solution;
};
const mergeNextmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	const solution = maps[0].map((_, i) => [i]);
	maps.forEach(map => {
		solution.forEach((s, i) => s.forEach((indx, j) => { solution[i][j] = map[indx]; }));
		solution.forEach((arr, i) => {
			solution[i] = arr
				.reduce((a, b) => a.concat(b), [])
				.filter(a => a !== undefined);
		});
	});
	return solution;
};
const mergeSimpleBackmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	let solution = maps[0].map((_, i) => i);
	maps.forEach(map => {
		const next = map.map(n => solution[n]);
		solution = next;
	});
	return solution;
};
const mergeBackmaps = (...maps) => {
	if (maps.length === 0) { return []; }
	let solution = maps[0].reduce((a, b) => a.concat(b), []).map((_, i) => [i]);
	maps.forEach(map => {
		const next = [];
		map.forEach((el, j) => {
			if (typeof el === "number") {
				next[j] = solution[el];
			} else {
				next[j] = el.map(n => solution[n]).reduce((a, b) => a.concat(b), []);
			}
		});
		solution = next;
	});
	return solution;
};
const invertSimpleMap = (map) => {
	const inv = [];
	map.forEach((n, i) => { inv[n] = i; });
	return inv;
};
const invertSimpleMapNoReplace = (map) => {
	const inv = [];
	map.forEach((n, i) => { inv[n] = inv[n] === undefined ? i : inv[n]; });
	return inv;
};
const invertArrayMap = (map) => {
	const inv = [];
	const setIndexValue = (index, value) => {
		if (inv[index] === undefined) { inv[index] = []; }
		inv[index].push(value);
	};
	map.forEach((n, i) => {
		if (n == null) { return; }
		if (typeof n === "number") { setIndexValue(n, i); }
		if (n.constructor === Array) {
			n.forEach(m => setIndexValue(m, i));
		}
	});
	return inv;
};
const invertMap = (map) => {
	const inv = [];
	const setIndexValue = (index, value) => {
		if (inv[index] !== undefined) {
			if (typeof inv[index] === "number") {
				inv[index] = [inv[index], value];
			} else {
				inv[index].push(value);
			}
		} else {
			inv[index] = value;
		}
	};
	map.forEach((n, i) => {
		if (n == null) { return; }
		if (typeof n === "number") { setIndexValue(n, i); }
		if (n.constructor === Array) {
			n.forEach(m => setIndexValue(m, i));
		}
	});
	return inv;
};
const remapComponent = (graph, component, indexMap = []) => {
	filterKeysWithSuffix(graph, component)
		.forEach(key => graph[key]
			.forEach((_, ii) => graph[key][ii]
				.forEach((v, jj) => { graph[key][ii][jj] = indexMap[v]; })));
	const inverted = invertSimpleMap(indexMap);
	filterKeysWithPrefix(graph, component)
		.forEach(key => { graph[key] = inverted.map(i => graph[key][i]); });
};
const remapKey = (graph, key, indexMap) => {
	const invertedMap = invertSimpleMapNoReplace(indexMap);
	filterKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => graph[sKey][ii]
				.forEach((v, jj) => { graph[sKey][ii][jj] = indexMap[v]; })));
	filterKeysWithSuffix(graph, key)
		.forEach(sKey => graph[sKey]
			.forEach((_, ii) => {
				graph[sKey][ii] = graph[sKey][ii].filter(a => a !== undefined);
			}));
	filterKeysWithPrefix(graph, key).forEach(prefix => {
		graph[prefix] = invertedMap.map(old => graph[prefix][old]);
	});
};const maps=/*#__PURE__*/Object.freeze({__proto__:null,invertArrayMap,invertMap,invertSimpleMap,invertSimpleMapNoReplace,mergeBackmaps,mergeNextmaps,mergeSimpleBackmaps,mergeSimpleNextmaps,remapComponent,remapKey});const makeIndexMap$1 = (graph, key, replaceIndices, replaces) => {
	const geometry_array_size = count(graph, key);
	const index_map = [];
	for (let i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
		while (i === replaces[walk]) {
			index_map[i] = index_map[replaceIndices[replaces[walk]]];
			if (index_map[i] === undefined) {
				throw new Error(Messages$1.replaceUndefined);
			}
			i += 1;
			walk += 1;
		}
		if (i < geometry_array_size) { index_map[i] = j; }
	}
	return index_map;
};
const replaceGeometryIndices = (graph, key, replaceIndices) => {
	Object.entries(replaceIndices)
		.filter(([index, value]) => index < value)
		.forEach(([index, value]) => {
			delete replaceIndices[index];
			replaceIndices[value] = index;
		});
	const removes = Object.keys(replaceIndices).map(n => parseInt(n, 10));
	const replaces = uniqueSortedNumbers(removes);
	const indexMap = makeIndexMap$1(graph, key, replaceIndices, replaces);
	remapKey(graph, key, indexMap);
	return indexMap;
};const duplicateVertices = (graph, epsilon) => (
	getVerticesClusters(graph, epsilon)
		.filter(arr => arr.length > 1)
);
const removeDuplicateVertices = (graph, epsilon = EPSILON, makeAverage = true) => {
	const replace_indices = [];
	const remove_indices = [];
	const clusters = getVerticesClusters(graph, epsilon)
		.filter(arr => arr.length > 1);
	clusters.forEach(cluster => {
		if (Math.min(...cluster) !== cluster[0]) {
			cluster.sort((a, b) => a - b);
		}
		for (let i = 1; i < cluster.length; i += 1) {
			replace_indices[cluster[i]] = cluster[0];
			remove_indices.push(cluster[i]);
		}
	});
	if (makeAverage) {
		clusters
			.map(arr => arr.map(i => graph.vertices_coords[i]))
			.map(arr => average(...arr))
			.forEach((point, i) => { graph.vertices_coords[clusters[i][0]] = point; });
	}
	return {
		map: replaceGeometryIndices(graph, "vertices", replace_indices),
		remove: remove_indices,
	};
};const verticesDuplicate=/*#__PURE__*/Object.freeze({__proto__:null,duplicateVertices,removeDuplicateVertices});const makeIndexMap = (graph, key, removeIndices) => {
	const sortedIndices = uniqueSortedNumbers(removeIndices);
	const arrayLength = count(graph, key);
	const indexMap = [];
	for (let i = 0, j = 0, walk = 0; i < arrayLength; i += 1, j += 1) {
		while (i === sortedIndices[walk]) {
			indexMap[i] = undefined;
			i += 1;
			walk += 1;
		}
		if (i < arrayLength) { indexMap[i] = j; }
	}
	return indexMap;
};
const removeGeometryIndices = (graph, key, removeIndices) => {
	const indexMap = makeIndexMap(graph, key, removeIndices);
	remapKey(graph, key, indexMap);
	return indexMap;
};const edgeIsolatedVertices = ({ vertices_coords, edges_vertices }) => {
	if (!vertices_coords || !edges_vertices) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	edges_vertices.forEach((ev) => {
		ev.filter(v => !seen[v]).forEach((v) => {
			seen[v] = true;
			count -= 1;
		});
	});
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};
const faceIsolatedVertices = ({ vertices_coords, faces_vertices }) => {
	if (!vertices_coords || !faces_vertices) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	faces_vertices.forEach((fv) => {
		fv.filter(v => !seen[v]).forEach((v) => {
			seen[v] = true;
			count -= 1;
		});
	});
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};
const isolatedVertices = ({ vertices_coords, edges_vertices, faces_vertices }) => {
	if (!vertices_coords) { return []; }
	let count = vertices_coords.length;
	const seen = Array(count).fill(false);
	if (edges_vertices) {
		edges_vertices.forEach((ev) => {
			ev.filter(v => !seen[v]).forEach((v) => {
				seen[v] = true;
				count -= 1;
			});
		});
	}
	if (faces_vertices) {
		faces_vertices.forEach((fv) => {
			fv.filter(v => !seen[v]).forEach((v) => {
				seen[v] = true;
				count -= 1;
			});
		});
	}
	return seen
		.map((s, i) => (s ? undefined : i))
		.filter(a => a !== undefined);
};
const removeIsolatedVertices = (graph, remove_indices) => {
	if (!remove_indices) {
		remove_indices = isolatedVertices(graph);
	}
	return {
		map: removeGeometryIndices(graph, "vertices", remove_indices),
		remove: remove_indices,
	};
};const verticesIsolated=/*#__PURE__*/Object.freeze({__proto__:null,edgeIsolatedVertices,faceIsolatedVertices,isolatedVertices,removeIsolatedVertices});const vectorToAngle = v => Math.atan2(v[1], v[0]);
const angleToVector = a => [Math.cos(a), Math.sin(a)];
const pointsToLine = (origin, point2) => ({
	vector: subtract(point2, origin),
	origin,
});
const vecLineToUniqueLine = ({ vector, origin }) => {
	const mag = magnitude(vector);
	const normal = rotate90(vector);
	const distance = dot(origin, normal) / mag;
	return { normal: scale$1(normal, 1 / mag), distance };
};
const uniqueLineToVecLine = ({ normal, distance }) => ({
	vector: rotate270(normal),
	origin: scale$1(normal, distance),
});const convert$2=/*#__PURE__*/Object.freeze({__proto__:null,angleToVector,pointsToLine,uniqueLineToVecLine,vecLineToUniqueLine,vectorToAngle});const isCounterClockwiseBetween = (angle, floor, ceiling) => {
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
const clockwiseBisect2 = (a, b) => (
	angleToVector(vectorToAngle(a) - clockwiseAngle2(a, b) / 2)
);
const counterClockwiseBisect2 = (a, b) => (
	angleToVector(vectorToAngle(a) + counterClockwiseAngle2(a, b) / 2)
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
		.map(angleToVector);
};
const counterClockwiseSubsect2 = (vectorA, vectorB, divisions) => {
	const angleA = Math.atan2(vectorA[1], vectorA[0]);
	const angleB = Math.atan2(vectorB[1], vectorB[0]);
	return counterClockwiseSubsectRadians(angleA, angleB, divisions)
		.map(angleToVector);
};
const counterClockwiseOrderRadians = (radians) => {
	const counter_clockwise = radians
		.map((_, i) => i)
		.sort((a, b) => radians[a] - radians[b]);
	return counter_clockwise
		.slice(counter_clockwise.indexOf(0), counter_clockwise.length)
		.concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
const counterClockwiseOrder2 = (vectors) => (
	counterClockwiseOrderRadians(vectors.map(vectorToAngle))
);
const counterClockwiseSectorsRadians = (radians) => (
	counterClockwiseOrderRadians(radians)
		.map(i => radians[i])
		.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
		.map(pair => counterClockwiseAngleRadians(pair[0], pair[1]))
);
const counterClockwiseSectors2 = (vectors) => (
	counterClockwiseSectorsRadians(vectors.map(vectorToAngle))
);
const threePointTurnDirection = (p0, p1, p2, epsilon = EPSILON) => {
	const v = normalize2(subtract2(p1, p0));
	const u = normalize2(subtract2(p2, p0));
	const cross = cross2(v, u);
	if (!epsilonEqual(cross, 0, epsilon)) {
		return Math.sign(cross);
	}
	return epsilonEqual(distance2(p0, p1) + distance2(p1, p2), distance2(p0, p2))
		? 0
		: undefined;
};const radialMethods=/*#__PURE__*/Object.freeze({__proto__:null,clockwiseAngle2,clockwiseAngleRadians,clockwiseBisect2,clockwiseSubsect2,clockwiseSubsectRadians,counterClockwiseAngle2,counterClockwiseAngleRadians,counterClockwiseBisect2,counterClockwiseOrder2,counterClockwiseOrderRadians,counterClockwiseSectors2,counterClockwiseSectorsRadians,counterClockwiseSubsect2,counterClockwiseSubsectRadians,isCounterClockwiseBetween,threePointTurnDirection});const array_in_array_max_number = (arrays) => {
	let max = -1;
	arrays
		.filter(a => a !== undefined)
		.forEach(arr => arr
			.forEach(el => el
				.forEach((e) => {
					if (e > max) { max = e; }
				})));
	return max;
};
const max_num_in_orders = (array) => {
	let max = -1;
	array.forEach(el => {
		if (el[0] > max) { max = el[0]; }
		if (el[1] > max) { max = el[1]; }
	});
	return max;
};
const ordersArrayNames = {
	edges: "edgeOrders",
	faces: "faceOrders",
};
const countImplied = (graph, key) => Math.max(
	array_in_array_max_number(
		filterKeysWithSuffix(graph, key).map(str => graph[str]),
	),
	graph[ordersArrayNames[key]]
		? max_num_in_orders(graph[ordersArrayNames[key]])
		: -1,
) + 1;
countImplied.vertices = graph => countImplied(graph, "vertices");
countImplied.edges = graph => countImplied(graph, "edges");
countImplied.faces = graph => countImplied(graph, "faces");const counterClockwiseWalk = ({
	vertices_vertices, vertices_sectors,
}, v0, v1, walked_edges = {}) => {
	const this_walked_edges = {};
	const face = { vertices: [v0], edges: [], angles: [] };
	let prev_vertex = v0;
	let this_vertex = v1;
	while (true) {
		const v_v = vertices_vertices[this_vertex];
		const from_neighbor_i = v_v.indexOf(prev_vertex);
		const next_neighbor_i = (from_neighbor_i + v_v.length - 1) % v_v.length;
		const next_vertex = v_v[next_neighbor_i];
		const next_edge_vertices = `${this_vertex} ${next_vertex}`;
		if (this_walked_edges[next_edge_vertices]) {
			Object.assign(walked_edges, this_walked_edges);
			face.vertices.pop();
			return face;
		}
		this_walked_edges[next_edge_vertices] = true;
		if (walked_edges[next_edge_vertices]) {
			return undefined;
		}
		face.vertices.push(this_vertex);
		face.edges.push(next_edge_vertices);
		if (vertices_sectors) {
			face.angles.push(vertices_sectors[this_vertex][next_neighbor_i]);
		}
		prev_vertex = this_vertex;
		this_vertex = next_vertex;
	}
};
const planarVertexWalk = ({ vertices_vertices, vertices_sectors }) => {
	const graph = { vertices_vertices, vertices_sectors };
	const walked_edges = {};
	return vertices_vertices
		.map((adj_verts, v) => adj_verts
			.map(adj_vert => counterClockwiseWalk(graph, v, adj_vert, walked_edges))
			.filter(a => a !== undefined))
		.flat();
};
const filterWalkedBoundaryFace = walked_faces => walked_faces
	.filter(face => face.angles
		.map(a => Math.PI - a)
		.reduce((a, b) => a + b, 0) > 0);const walk=/*#__PURE__*/Object.freeze({__proto__:null,counterClockwiseWalk,filterWalkedBoundaryFace,planarVertexWalk});const projectPointOnPlane = (point, vector = [1, 0, 0], origin = [0, 0, 0]) => {
	const point3 = resize(3, point);
	const originToPoint = subtract3(point3, resize(3, origin));
	const normalized = normalize3(resize(3, vector));
	const magnitude = dot3(normalized, originToPoint);
	const planeToPoint = scale3(normalized, magnitude);
	return subtract3(point3, planeToPoint);
};const planeMethods=/*#__PURE__*/Object.freeze({__proto__:null,projectPointOnPlane});const sortAgainstItem = (array, item, compareFn) => array
	.map((el, i) => ({ i, n: compareFn(el, item) }))
	.sort((a, b) => a.n - b.n)
	.map(a => a.i);
const sortPointsAlongVector = (points, vector) => (
	sortAgainstItem(points, vector, dot)
);
const radialSortUnitVectors2 = (vectors) => {
	const quadrantConditions = [
		v => v[0] >= 0 && v[1] >= 0,
		v => v[0] < 0 && v[1] >= 0,
		v => v[0] < 0 && v[1] < 0,
		v => v[0] >= 0 && v[1] < 0,
	];
	const quadrantSorts = [
		(a, b) => vectors[b][0] - vectors[a][0],
		(a, b) => vectors[b][0] - vectors[a][0],
		(a, b) => vectors[a][0] - vectors[b][0],
		(a, b) => vectors[a][0] - vectors[b][0],
	];
	const vectorsQuadrant = vectors
		.map(vec => quadrantConditions
			.map((fn, i) => (fn(vec) ? i : undefined))
			.filter(a => a !== undefined)
			.shift());
	const quadrantsVectors = [[], [], [], []];
	vectorsQuadrant.forEach((q, v) => { quadrantsVectors[q].push(v); });
	return quadrantsVectors
		.flatMap((indices, i) => indices.sort(quadrantSorts[i]));
};
const radialSortPointIndices3 = (
	points,
	vector = [1, 0, 0],
	origin = [0, 0, 0],
) => {
	const threeVectors = basisVectors3(vector);
	const basis = [threeVectors[1], threeVectors[2], threeVectors[0]];
	const projectedPoints = points
		.map(point => projectPointOnPlane(point, vector, origin));
	const projectedVectors = projectedPoints
		.map(point => subtract(point, origin));
	const pointsUV = projectedVectors
		.map(vec => [dot(vec, basis[0]), dot(vec, basis[1])]);
	const vectorsUV = pointsUV.map(normalize2);
	return radialSortUnitVectors2(vectorsUV);
};const sortMethods=/*#__PURE__*/Object.freeze({__proto__:null,radialSortPointIndices3,radialSortUnitVectors2,sortAgainstItem,sortPointsAlongVector});const sortVerticesCounterClockwise = ({ vertices_coords }, vertices, vertex) => (
	vertices
		.map(v => vertices_coords[v])
		.map(coord => subtract(coord, vertices_coords[vertex]))
		.map(vec => Math.atan2(vec[1], vec[0]))
		.map(angle => (angle > -EPSILON ? angle : angle + Math.PI * 2))
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.map(i => vertices[i])
);
const sortVerticesAlongVector = ({ vertices_coords }, vertices, vector) => (
	sortPointsAlongVector(
		vertices.map(v => vertices_coords[v]),
		vector,
	).map(i => vertices[i])
);const verticesSort=/*#__PURE__*/Object.freeze({__proto__:null,sortVerticesAlongVector,sortVerticesCounterClockwise});const makeFacesNormal = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(vertex => vertices_coords[vertex]))
	.map(polygon => {
		let a;
		let b;
		let i = 0;
		do {
			a = subtract(polygon[(i + 1) % polygon.length], polygon[i]);
			b = subtract(polygon[(i + 2) % polygon.length], polygon[i]);
			i += 1;
		} while (i < polygon.length && parallel(a, b));
		return normalize3(cross3(resize(3, a), resize(3, b)));
	});
const makeVerticesNormal = ({ vertices_coords, faces_vertices, faces_normal }) => {
	const add3 = (a, b) => { a[0] += b[0]; a[1] += b[1]; a[2] += b[2]; };
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	const vertices_normals = vertices_coords.map(() => [0, 0, 0]);
	faces_vertices
		.forEach((vertices, f) => vertices
			.forEach(v => add3(vertices_normals[v], faces_normal[f])));
	return vertices_normals.map(v => normalize3(v));
};const normals=/*#__PURE__*/Object.freeze({__proto__:null,makeFacesNormal,makeVerticesNormal});const makeVerticesEdgesUnsorted = ({ edges_vertices }) => {
	const vertices_edges = [];
	edges_vertices.forEach((ev, i) => ev
		.forEach((v) => {
			if (vertices_edges[v] === undefined) {
				vertices_edges[v] = [];
			}
			vertices_edges[v].push(i);
		}));
	return vertices_edges;
};
const makeVerticesEdges = ({ edges_vertices, vertices_vertices }) => {
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	return vertices_vertices
		.map((verts, i) => verts
			.map(v => edge_map[`${i} ${v}`]));
};
const makeVerticesVertices2D = ({ vertices_coords, vertices_edges, edges_vertices }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const vertices_vertices = vertices_edges
		.map((edges, v) => edges
			.map(edge => edges_vertices[edge]
				.filter(i => i !== v))
			.reduce((a, b) => a.concat(b), []));
	return vertices_coords === undefined
		? vertices_vertices
		: vertices_vertices
			.map((verts, i) => sortVerticesCounterClockwise({ vertices_coords }, verts, i));
};
const makeVerticesVerticesFromFaces = ({
	vertices_coords, vertices_faces, faces_vertices,
}) => {
	if (!vertices_faces) {
		vertices_faces = makeVerticesFacesUnsorted({ vertices_coords, faces_vertices });
	}
	const vertices_faces_vertices = vertices_faces
		.map(faces => faces.map(f => faces_vertices[f]));
	const vertices_faces_indexOf = vertices_faces_vertices
		.map((faces, vertex) => faces.map(verts => verts.indexOf(vertex)));
	const vertices_faces_threeIndices = vertices_faces_vertices
		.map((faces, vertex) => faces.map((verts, j) => [
			(vertices_faces_indexOf[vertex][j] + verts.length - 1) % verts.length,
			vertices_faces_indexOf[vertex][j],
			(vertices_faces_indexOf[vertex][j] + 1) % verts.length,
		]));
	const vertices_faces_threeVerts = vertices_faces_threeIndices
		.map((faces, vertex) => faces
			.map((indices, j) => indices
				.map(index => vertices_faces_vertices[vertex][j][index])));
	const vertices_verticesLookup = vertices_faces_threeVerts.map(faces => {
		const facesVerts = faces
			.map(verts => [[0, 1], [1, 2]]
				.map(p => p.map(x => verts[x]).join(" ")));
		const from = {};
		const to = {};
		facesVerts.forEach((keys, i) => {
			from[keys[0]] = i;
			to[keys[1]] = i;
		});
		return { facesVerts, to, from };
	});
	return vertices_verticesLookup.map(lookup => {
		const toKeys = Object.keys(lookup.to);
		const toKeysInverse = toKeys
			.map(key => key.split(" ").reverse().join(" "));
		const holeKeys = toKeys
			.filter((_, i) => !(toKeysInverse[i] in lookup.from));
		if (holeKeys.length > 2) {
			console.warn("vertices_vertices found an unsolvable vertex");
			return [];
		}
		const startKeys = holeKeys.length
			? holeKeys
			: [toKeys[0]];
		const vertex_vertices = [];
		const visited = {};
		for (let s = 0; s < startKeys.length; s += 1) {
			const startKey = startKeys[s];
			const walk = [startKey];
			visited[startKey] = true;
			let isDone = false;
			do {
				const prev = walk[walk.length - 1];
				const faceIndex = lookup.to[prev];
				if (!(faceIndex in lookup.facesVerts)) { break; }
				let nextKey;
				if (lookup.facesVerts[faceIndex][0] === prev) {
					nextKey = lookup.facesVerts[faceIndex][1];
				}
				if (lookup.facesVerts[faceIndex][1] === prev) {
					nextKey = lookup.facesVerts[faceIndex][0];
				}
				if (nextKey === undefined) { return "not found"; }
				const nextKeyFlipped = nextKey.split(" ").reverse().join(" ");
				walk.push(nextKey);
				isDone = (nextKeyFlipped in visited);
				if (!isDone) { walk.push(nextKeyFlipped); }
				visited[nextKey] = true;
				visited[nextKeyFlipped] = true;
			} while (!isDone);
			const vertexKeys = walk
				.filter((_, i) => i % 2 === 0)
				.map(key => key.split(" ")[1])
				.map(str => parseInt(str, 10));
			vertex_vertices.push(...vertexKeys);
		}
		return vertex_vertices;
	});
};
const makeVerticesVertices = (graph) => {
	if (!graph.vertices_coords || !graph.vertices_coords.length) { return []; }
	const dimensions = graph.vertices_coords.filter(() => true).shift().length;
	switch (dimensions) {
	case 3:
		return makeVerticesVerticesFromFaces(graph);
	default:
		return makeVerticesVertices2D(graph);
	}
};
const makeVerticesVerticesUnsorted = ({ vertices_edges, edges_vertices }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	return vertices_edges
		.map((edges, v) => edges
			.flatMap(edge => edges_vertices[edge].filter(i => i !== v)));
};
const makeVerticesFacesUnsorted = ({ vertices_coords, vertices_edges, faces_vertices }) => {
	const vertArray = vertices_coords || vertices_edges;
	if (!faces_vertices) { return (vertArray || []).map(() => []); }
	const vertices_faces = vertArray !== undefined
		? vertArray.map(() => [])
		: Array.from(Array(countImplied.vertices({ faces_vertices }))).map(() => []);
	faces_vertices.forEach((face, f) => {
		const hash = [];
		face.forEach((vertex) => { hash[vertex] = f; });
		hash.forEach((fa, v) => vertices_faces[v].push(fa));
	});
	return vertices_faces;
};
const makeVerticesFaces = ({ vertices_coords, vertices_vertices, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	if (!vertices_vertices) {
		return makeVerticesFacesUnsorted({ vertices_coords, faces_vertices });
	}
	const face_map = makeVerticesToFace({ faces_vertices });
	return vertices_vertices
		.map((verts, v) => verts
			.map((vert, i, arr) => [arr[(i + 1) % arr.length], v, vert]
				.join(" ")))
		.map(keys => keys
			.map(key => face_map[key]));
};
const makeVerticesToEdgeBidirectional = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	edges_vertices
		.map(ev => `${ev[1]} ${ev[0]}`)
		.forEach((key, i) => { map[key] = i; });
	return map;
};
const makeVerticesToEdge = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	return map;
};
const makeVerticesToFace = ({ faces_vertices }) => {
	const map = {};
	faces_vertices
		.forEach((face, f) => face
			.map((_, i) => [0, 1, 2]
				.map(j => (i + j) % face.length)
				.map(n => face[n])
				.join(" "))
			.forEach(key => { map[key] = f; }));
	return map;
};
const makeVerticesVerticesVector = ({
	vertices_coords, vertices_vertices, vertices_edges, vertices_faces,
	edges_vertices, edges_vector, faces_vertices,
}) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({
			vertices_coords, vertices_edges, vertices_faces, edges_vertices, faces_vertices,
		});
	}
	const edge_map = makeVerticesToEdge({ edges_vertices });
	return vertices_vertices
		.map((_, a) => vertices_vertices[a]
			.map((b) => {
				const edge_a = edge_map[`${a} ${b}`];
				const edge_b = edge_map[`${b} ${a}`];
				if (edge_a !== undefined) { return edges_vector[edge_a]; }
				if (edge_b !== undefined) { return flip(edges_vector[edge_b]); }
			}));
};
const makeVerticesSectors = ({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
}) => makeVerticesVerticesVector({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
})
	.map(vectors => (vectors.length === 1
		? [TWO_PI]
		: counterClockwiseSectors2(vectors)));
const makeEdgesEdges = ({ edges_vertices, vertices_edges }) =>
	edges_vertices.map((verts, i) => {
		const side0 = vertices_edges[verts[0]].filter(e => e !== i);
		const side1 = vertices_edges[verts[1]].filter(e => e !== i);
		return side0.concat(side1);
	});
const makeEdgesFacesUnsorted = ({ edges_vertices, faces_edges }) => {
	const edges_faces = edges_vertices !== undefined
		? edges_vertices.map(() => [])
		: Array.from(Array(countImplied.edges({ faces_edges }))).map(() => []);
	faces_edges.forEach((face, f) => {
		const hash = [];
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	return edges_faces;
};
const makeEdgesFaces = ({
	vertices_coords, edges_vertices, edges_vector, faces_vertices, faces_edges, faces_center,
}) => {
	if (!edges_vertices || (!faces_vertices && !faces_edges)) {
		return makeEdgesFacesUnsorted({ faces_edges });
	}
	if (!faces_vertices) {
		faces_vertices = makeFacesVerticesFromEdges({ edges_vertices, faces_edges });
	}
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(pair => vertices_coords[pair[0]]);
	if (!faces_center) {
		faces_center = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	}
	const edges_faces = edges_vertices.map(() => []);
	faces_edges.forEach((face, f) => {
		const hash = [];
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	edges_faces.forEach((faces, e) => {
		const faces_cross = faces
			.map(f => faces_center[f])
			.map(center => subtract2(center, edges_origin[e]))
			.map(vector => cross2(vector, edges_vector[e]));
		faces.sort((a, b) => faces_cross[a] - faces_cross[b]);
	});
	return edges_faces;
};
const assignment_angles = {
	M: -180, m: -180, V: 180, v: 180,
};
const makeEdgesAssignmentSimple = ({ edges_foldAngle }) => edges_foldAngle
	.map(a => {
		if (a === 0) { return "F"; }
		return a < 0 ? "M" : "V";
	});
const makeEdgesAssignment = ({
	edges_vertices, edges_foldAngle, edges_faces, faces_vertices, faces_edges,
}) => {
	if (edges_vertices && !edges_faces) {
		if (!faces_edges && faces_vertices) {
			faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
		}
		if (faces_edges) {
			edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
		}
	}
	if (edges_foldAngle) {
		return edges_faces
			? edges_foldAngle.map((a, i) => {
				if (edges_faces[i].length < 2) { return "B"; }
				if (a === 0) { return "F"; }
				return a < 0 ? "M" : "V";
			})
			: makeEdgesAssignmentSimple({ edges_foldAngle });
	}
	return edges_vertices.map(() => "U");
};
const makeEdgesFoldAngle = ({ edges_assignment }) => edges_assignment
	.map(a => assignment_angles[a] || 0);
const makeEdgesFoldAngleFromFaces = ({
	vertices_coords,
	edges_vertices,
	edges_faces,
	edges_assignment,
	faces_vertices,
	faces_edges,
	faces_normal,
	faces_center,
}) => {
	if (!edges_faces) {
		if (!faces_edges) {
			faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
		}
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
	}
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	if (!faces_center) {
		faces_center = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	}
	return edges_faces.map((faces, e) => {
		if (faces.length > 2) { throw new Error(Messages$1.manifold); }
		if (faces.length < 2) { return 0; }
		const a = faces_normal[faces[0]];
		const b = faces_normal[faces[1]];
		const a2b = normalize$1(subtract(
			faces_center[faces[1]],
			faces_center[faces[0]],
		));
		let sign = Math.sign(dot(a, a2b));
		if (sign === 0) {
			if (edges_assignment && edges_assignment[e]) {
				if (edges_assignment[e] === "F" || edges_assignment[e] === "F") { sign = 0; }
				if (edges_assignment[e] === "M" || edges_assignment[e] === "m") { sign = -1; }
				if (edges_assignment[e] === "V" || edges_assignment[e] === "v") { sign = 1; }
			} else {
				throw new Error(Messages$1.flatFoldAngles);
			}
		}
		return (Math.acos(dot(a, b)) * (180 / Math.PI)) * sign;
	});
};
const makeEdgesCoords = ({ vertices_coords, edges_vertices }) => edges_vertices
	.map(ev => ev.map(v => vertices_coords[v]));
const makeEdgesVector = ({ vertices_coords, edges_vertices }) => makeEdgesCoords({
	vertices_coords, edges_vertices,
}).map(verts => subtract(verts[1], verts[0]));
const makeEdgesLength = ({ vertices_coords, edges_vertices }) => makeEdgesVector({
	vertices_coords, edges_vertices,
}).map(vec => magnitude(vec));
const makeEdgesBoundingBox = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = 0) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	return edges_coords.map(coords => boundingBox$1(coords, epsilon));
};
const makePlanarFaces = ({
	vertices_coords, vertices_vertices, vertices_edges,
	vertices_sectors, edges_vertices, edges_vector,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, edges_vertices, vertices_edges });
	}
	if (!vertices_sectors) {
		vertices_sectors = makeVerticesSectors({
			vertices_coords, vertices_vertices, edges_vertices, edges_vector,
		});
	}
	const vertices_edges_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const res = filterWalkedBoundaryFace(planarVertexWalk({
		vertices_vertices, vertices_sectors,
	})).map(f => ({ ...f, edges: f.edges.map(e => vertices_edges_map[e]) }));
	return {
		faces_vertices: res.map(el => el.vertices),
		faces_edges: res.map(el => el.edges),
		faces_sectors: res.map(el => el.angles),
	};
};
const makeFacesVerticesFromEdges = ({ edges_vertices, faces_edges }) => faces_edges
	.map(edges => edges
		.map(edge => edges_vertices[edge])
		.map((pairs, i, arr) => {
			const next = arr[(i + 1) % arr.length];
			return (pairs[0] === next[0] || pairs[0] === next[1])
				? pairs[1]
				: pairs[0];
		}));
const makeFacesEdgesFromVertices = ({ edges_vertices, faces_vertices }) => {
	const map = makeVerticesToEdgeBidirectional({ edges_vertices });
	return faces_vertices
		.map(face => face
			.map((v, i, arr) => [v, arr[(i + 1) % arr.length]].join(" ")))
		.map(face => face.map(pair => map[pair]));
};
const makeFacesFaces = ({ faces_vertices }) => {
	const faces_faces = faces_vertices.map(() => []);
	const edgeMap = {};
	faces_vertices
		.forEach((face, f) => face
			.forEach((v0, i, arr) => {
				let v1 = arr[(i + 1) % face.length];
				if (v1 < v0) { [v0, v1] = [v1, v0]; }
				const key = `${v0} ${v1}`;
				if (edgeMap[key] === undefined) { edgeMap[key] = {}; }
				edgeMap[key][f] = true;
			}));
	Object.values(edgeMap)
		.map(obj => Object.keys(obj))
		.filter(arr => arr.length > 1)
		.forEach(pair => {
			faces_faces[pair[0]].push(parseInt(pair[1], 10));
			faces_faces[pair[1]].push(parseInt(pair[0], 10));
		});
	return faces_faces;
};
const makeFacesPolygon = ({ vertices_coords, faces_vertices }, epsilon) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]))
	.map(polygon => makePolygonNonCollinear(polygon, epsilon));
const makeFacesPolygonQuick = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]));
const makeFacesCenter2D = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(fv => fv.map(v => vertices_coords[v]))
	.map(coords => centroid(coords));
const makeFacesConvexCenter = ({ vertices_coords, faces_vertices }) => {
	const oneVertex = vertices_coords.filter(() => true).shift();
	if (!oneVertex) { return faces_vertices.map(() => []); }
	const dimensions = oneVertex.length;
	return faces_vertices.map(vertices => vertices
		.map(v => vertices_coords[v])
		.reduce((a, b) => add(a, b), Array(dimensions).fill(0))
		.map(el => el / vertices.length));
};const make=/*#__PURE__*/Object.freeze({__proto__:null,makeEdgesAssignment,makeEdgesAssignmentSimple,makeEdgesBoundingBox,makeEdgesCoords,makeEdgesEdges,makeEdgesFaces,makeEdgesFacesUnsorted,makeEdgesFoldAngle,makeEdgesFoldAngleFromFaces,makeEdgesLength,makeEdgesVector,makeFacesCenter2D,makeFacesConvexCenter,makeFacesEdgesFromVertices,makeFacesFaces,makeFacesPolygon,makeFacesPolygonQuick,makeFacesVerticesFromEdges,makePlanarFaces,makeVerticesEdges,makeVerticesEdgesUnsorted,makeVerticesFaces,makeVerticesFacesUnsorted,makeVerticesSectors,makeVerticesToEdge,makeVerticesToEdgeBidirectional,makeVerticesToFace,makeVerticesVertices,makeVerticesVertices2D,makeVerticesVerticesFromFaces,makeVerticesVerticesUnsorted,makeVerticesVerticesVector});const duplicateEdges = ({ edges_vertices }) => {
	if (!edges_vertices) { return []; }
	const duplicates = [];
	const map = {};
	for (let i = 0; i < edges_vertices.length; i += 1) {
		const a = `${edges_vertices[i][0]} ${edges_vertices[i][1]}`;
		const b = `${edges_vertices[i][1]} ${edges_vertices[i][0]}`;
		if (map[a] !== undefined) {
			duplicates[i] = map[a];
		} else {
			map[a] = i;
			map[b] = i;
		}
	}
	return duplicates;
};
const removeDuplicateEdges = (graph, replace_indices) => {
	if (!replace_indices) {
		replace_indices = duplicateEdges(graph);
	}
	const removeObject = Object.keys(replace_indices).map(n => parseInt(n, 10));
	const map = replaceGeometryIndices(graph, "edges", replace_indices);
	if (removeObject.length) {
		if (graph.vertices_edges || graph.vertices_vertices || graph.vertices_faces) {
			graph.vertices_edges = makeVerticesEdgesUnsorted(graph);
			graph.vertices_vertices = makeVerticesVertices(graph);
			graph.vertices_edges = makeVerticesEdges(graph);
			graph.vertices_faces = makeVerticesFaces(graph);
		}
	}
	return { map, remove: removeObject };
};const edgesDuplicate=/*#__PURE__*/Object.freeze({__proto__:null,duplicateEdges,removeDuplicateEdges});const circularEdges = ({ edges_vertices }) => {
	if (!edges_vertices) { return []; }
	const circular = [];
	for (let i = 0; i < edges_vertices.length; i += 1) {
		if (edges_vertices[i][0] === edges_vertices[i][1]) {
			circular.push(i);
		}
	}
	return circular;
};
const spliceRemoveValuesFromSuffixes = (graph, suffix, remove_indices) => {
	const remove_map = {};
	remove_indices.forEach(n => { remove_map[n] = true; });
	filterKeysWithSuffix(graph, suffix)
		.forEach(sKey => graph[sKey]
			.forEach((elem, i) => {
				for (let j = elem.length - 1; j >= 0; j -= 1) {
					if (remove_map[elem[j]] === true) {
						graph[sKey][i].splice(j, 1);
					}
				}
			}));
};
const removeCircularEdges = (graph, remove_indices) => {
	if (!remove_indices) {
		remove_indices = circularEdges(graph);
	}
	if (remove_indices.length) {
		spliceRemoveValuesFromSuffixes(graph, "edges", remove_indices);
	}
	return {
		map: removeGeometryIndices(graph, "edges", remove_indices),
		remove: remove_indices,
	};
};const edgesCircular=/*#__PURE__*/Object.freeze({__proto__:null,circularEdges,removeCircularEdges});const clean = (graph, epsilon) => {
	const change_v1 = removeDuplicateVertices(graph, epsilon);
	const change_e1 = removeCircularEdges(graph);
	const change_e2 = removeDuplicateEdges(graph);
	const change_v2 = removeIsolatedVertices(graph);
	const change_v1_backmap = invertSimpleMap(change_v1.map);
	const change_v2_remove = change_v2.remove.map(e => change_v1_backmap[e]);
	const change_e1_backmap = invertSimpleMap(change_e1.map);
	const change_e2_remove = change_e2.remove.map(e => change_e1_backmap[e]);
	return {
		vertices: {
			map: mergeSimpleNextmaps(change_v1.map, change_v2.map),
			remove: change_v1.remove.concat(change_v2_remove),
		},
		edges: {
			map: mergeSimpleNextmaps(change_e1.map, change_e2.map),
			remove: change_e1.remove.concat(change_e2_remove),
		},
	};
};const explodeFaces = ({
	vertices_coords, edges_vertices, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges,
}) => {
	if (!faces_vertices) { return undefined; }
	let e = 0;
	let f = 0;
	const result = {
		faces_vertices: faces_vertices
			.map(face => face.map(() => f++)),
	};
	if (!vertices_coords) { return result; }
	result.vertices_coords = structuredClone(faces_vertices
		.flatMap(face => face.map(v => vertices_coords[v])));
	if (!edges_vertices) { return result; }
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	result.edges_vertices = faces_edges.flatMap(face => face
		.map((_, i, arr) => (i === arr.length - 1
			? [e, (++e - arr.length)]
			: [e, (++e)])));
	const edgesMap = faces_edges.flatMap(edges => edges);
	if (edges_assignment) {
		result.edges_assignment = structuredClone(edgesMap
			.map(i => edges_assignment[i]));
	}
	if (edges_foldAngle) {
		result.edges_foldAngle = structuredClone(edgesMap
			.map(i => edges_foldAngle[i]));
	}
	return result;
};
const explodeEdges = ({
	vertices_coords, edges_vertices, edges_assignment, edges_foldAngle,
}) => {
	if (!edges_vertices) { return undefined; }
	let e = 0;
	const result = {
		edges_vertices: edges_vertices.map(edge => edge.map(() => e++)),
	};
	if (edges_assignment) { result.edges_assignment = edges_assignment; }
	if (edges_foldAngle) { result.edges_foldAngle = edges_foldAngle; }
	if (vertices_coords) {
		result.vertices_coords = structuredClone(edges_vertices
			.flatMap(edge => edge.map(v => vertices_coords[v])));
	}
	return result;
};const explodeMethods=/*#__PURE__*/Object.freeze({__proto__:null,explodeEdges,explodeFaces});const clampLine = dist => dist;
const clampRay = dist => (dist < -EPSILON ? 0 : dist);
const clampSegment = (dist) => {
	if (dist < -EPSILON) { return 0; }
	if (dist > 1 + EPSILON) { return 1; }
	return dist;
};
const collinearBetween = (p0, p1, p2, inclusive = false, epsilon = EPSILON) => {
	const similar = [p0, p2]
		.map(p => epsilonEqualVectors(p1, p, epsilon))
		.reduce((a, b) => a || b, false);
	if (similar) { return inclusive; }
	const vectors = [[p0, p1], [p1, p2]]
		.map(segment => subtract(segment[1], segment[0]))
		.map(vector => normalize$1(vector));
	return epsilonEqual(1.0, dot(...vectors), EPSILON);
};
const lerpLines = (a, b, t) => {
	const vector = lerp(a.vector, b.vector, t);
	const origin = lerp(a.origin, b.origin, t);
	return { vector, origin };
};
const pleat$1 = (a, b, count, epsilon = EPSILON) => {
	const dotProd = dot(a.vector, b.vector);
	const determinant = cross2(a.vector, b.vector);
	const numerator = cross2(subtract2(b.origin, a.origin), b.vector);
	const t = numerator / determinant;
	const normalized = [a.vector, b.vector].map(vec => normalize$1(vec));
	const sides = determinant > -epsilon
		? [[a.vector, b.vector], [flip(b.vector), a.vector]]
		: [[b.vector, a.vector], [flip(a.vector), b.vector]];
	const pleatVectors = sides
		.map(pair => counterClockwiseSubsect2(pair[0], pair[1], count));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	const intersection = isParallel
		? undefined
		: add2(a.origin, scale2(a.vector, t));
	const iter = Array.from(Array(count - 1));
	const origins = isParallel
		? iter.map((_, i) => lerp(a.origin, b.origin, (i + 1) / count))
		: iter.map(() => intersection);
	const solution = pleatVectors
		.map(side => side.map((vector, i) => ({
			vector,
			origin: [...origins[i]],
		})));
	if (isParallel) { solution[(dotProd > -epsilon ? 1 : 0)] = []; }
	return solution;
};
const bisectLines2 = (a, b, epsilon = EPSILON) => {
	const solution = pleat$1(a, b, 2, epsilon).map(arr => arr[0]);
	solution.forEach((val, i) => {
		if (val === undefined) { delete solution[i]; }
	});
	return solution;
};const lineMethods=/*#__PURE__*/Object.freeze({__proto__:null,bisectLines2,clampLine,clampRay,clampSegment,collinearBetween,lerpLines,pleat:pleat$1});const nearestPoint2 = (points, point) => {
	const index = arrayMinimum(points, el => distance2(el, point));
	return index === undefined ? undefined : points[index];
};
const nearestPoint = (points, point) => {
	const index = arrayMinimum(points, el => distance(el, point));
	return index === undefined ? undefined : points[index];
};
const nearestPointOnLine = (
	{ vector, origin },
	point,
	clampFunc = clampLine,
	epsilon = EPSILON,
) => {
	origin = resize(vector.length, origin);
	point = resize(vector.length, point);
	const magSq = magSquared(vector);
	const vectorToPoint = subtract(point, origin);
	const dotProd = dot(vector, vectorToPoint);
	const dist = dotProd / magSq;
	const d = clampFunc(dist, epsilon);
	return add(origin, scale$1(vector, d));
};
const nearestPointOnPolygon = (polygon, point) => polygon
	.map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p))
	.map((vector, i) => ({ vector, origin: polygon[i] }))
	.map(line => nearestPointOnLine(line, point, clampSegment))
	.map((p, edge) => ({ point: p, edge, distance: distance(p, point) }))
	.sort((a, b) => a.distance - b.distance)
	.shift();
const nearestPointOnCircle = ({ radius, origin }, point) => (
	add(origin, scale$1(normalize$1(subtract(point, origin)), radius))
);const nearestMethods$1=/*#__PURE__*/Object.freeze({__proto__:null,nearestPoint,nearestPoint2,nearestPointOnCircle,nearestPointOnLine,nearestPointOnPolygon});const overlapLinePoint = (
	{ vector, origin },
	point,
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	const p2p = subtract2(point, origin);
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	if (lineMag < epsilon) { return false; }
	const cross = cross2(p2p, vector.map(n => n / lineMag));
	const proj = dot2(p2p, vector) / lineMagSq;
	return Math.abs(cross) < epsilon && lineDomain(proj, epsilon / lineMag);
};
const overlapLineLine = (
	a,
	b,
	aDomain = includeL,
	bDomain = includeL,
	epsilon = EPSILON,
) => {
	const denominator0 = cross2(a.vector, b.vector);
	const denominator1 = -denominator0;
	const a2b = subtract2(b.origin, a.origin);
	const b2a = [-a2b[0], -a2b[1]];
	if (Math.abs(denominator0) < epsilon) {
		if (Math.abs(cross2(a2b, a.vector)) > epsilon) { return false; }
		const aPt1 = b2a;
		const aPt2 = add2(aPt1, a.vector);
		const aPt3 = midpoint2(aPt1, aPt2);
		const bPt1 = a2b;
		const bPt2 = add2(bPt1, b.vector);
		const bPt3 = midpoint2(bPt1, bPt2);
		const aProjLen = dot2(a.vector, a.vector);
		const bProjLen = dot2(b.vector, b.vector);
		const aProj1 = dot2(aPt1, b.vector) / bProjLen;
		const aProj2 = dot2(aPt2, b.vector) / bProjLen;
		const aProj3 = dot2(aPt3, b.vector) / bProjLen;
		const bProj1 = dot2(bPt1, a.vector) / aProjLen;
		const bProj2 = dot2(bPt2, a.vector) / aProjLen;
		const bProj3 = dot2(bPt3, a.vector) / aProjLen;
		return aDomain(bProj1, epsilon) || aDomain(bProj2, epsilon)
			|| bDomain(aProj1, epsilon) || bDomain(aProj2, epsilon)
			|| aDomain(bProj3, epsilon) || bDomain(aProj3, epsilon);
	}
	const t0 = cross2(a2b, b.vector) / denominator0;
	const t1 = cross2(b2a, a.vector) / denominator1;
	return aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector));
};
const overlapCirclePoint = (
	{ radius, origin },
	point,
	circleDomain = exclude,
	epsilon = EPSILON,
) => (
	circleDomain(radius - distance2(origin, point), epsilon)
);
const overlapConvexPolygonPoint = (
	polygon,
	point,
	polyDomain = exclude,
	normalizedEpsilon = EPSILON,
) => polygon
	.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	.map(s => cross2(normalize2(subtract2(s[1], s[0])), subtract2(point, s[0])))
	.map(side => polyDomain(side, normalizedEpsilon))
	.map((s, _, arr) => s === arr[0])
	.reduce((prev, curr) => prev && curr, true);
const overlapConvexPolygonPointNew = (
	polygon,
	point,
	polyDomain = exclude,
	normalizedEpsilon = EPSILON,
) => {
	const t = polygon
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		.map(([a, b]) => [subtract2(b, a), subtract2(point, a)])
		.map(([a, b]) => cross2(a, b));
	const sign = Math.sign(t.reduce((a, b) => a + b, 0));
	const overlap = t
		.map(n => n * sign)
		.map(side => polyDomain(side, normalizedEpsilon))
		.map((s, _, arr) => s === arr[0])
		.reduce((prev, curr) => prev && curr, true);
	return { overlap, t };
};
const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
	for (let p = 0; p < 2; p += 1) {
		const polyA = p === 0 ? poly1 : poly2;
		const polyB = p === 0 ? poly2 : poly1;
		for (let i = 0; i < polyA.length; i += 1) {
			const origin = polyA[i];
			const vector = rotate90(subtract2(polyA[(i + 1) % polyA.length], polyA[i]));
			const projected = polyB
				.map(point => subtract2(point, origin))
				.map(v => dot2(vector, v));
			const other_test_point = polyA[(i + 2) % polyA.length];
			const side_a = dot2(vector, subtract2(other_test_point, origin));
			const side = side_a > 0;
			const one_sided = projected
				.map(dotProd => (side ? dotProd < epsilon : dotProd > -epsilon))
				.reduce((a, b) => a && b, true);
			if (one_sided) { return false; }
		}
	}
	return true;
};
const overlapBoundingBoxes = (box1, box2, epsilon = EPSILON) => {
	const dimensions = Math.min(box1.min.length, box2.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (box1.min[d] > box2.max[d] + epsilon
			|| box1.max[d] < box2.min[d] - epsilon) {
			return false;
		}
	}
	return true;
};const overlapMethods=/*#__PURE__*/Object.freeze({__proto__:null,overlapBoundingBoxes,overlapCirclePoint,overlapConvexPolygonPoint,overlapConvexPolygonPointNew,overlapConvexPolygons,overlapLineLine,overlapLinePoint});const nearestVertex = ({ vertices_coords }, point) => {
	if (!vertices_coords) { return undefined; }
	const dimension = getDimensionQuick({ vertices_coords });
	if (dimension === undefined) { return undefined; }
	const p = resize(dimension, point);
	const nearest = vertices_coords
		.map((v, i) => ({ d: distance(p, v), i }))
		.sort((a, b) => a.d - b.d)
		.shift();
	return nearest ? nearest.i : undefined;
};
const nearestEdge = ({ vertices_coords, edges_vertices }, point) => {
	if (!vertices_coords || !edges_vertices) { return undefined; }
	const nearest_points = edges_vertices
		.map(e => e.map(ev => vertices_coords[ev]))
		.map(e => nearestPointOnLine(
			{ vector: subtract(e[1], e[0]), origin: e[0] },
			point,
			clampSegment,
		));
	return arrayMinimum(nearest_points, p => distance(p, point));
};
const facesContainingPoint = (
	{ vertices_coords, faces_vertices },
	point,
	polyFunc = exclude,
) => (!vertices_coords || !faces_vertices
	? []
	: faces_vertices
		.map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
		.filter(f => overlapConvexPolygonPoint(f.face, point, polyFunc))
		.map(el => el.i)
);
const faceContainingPoint = ({ vertices_coords, faces_vertices }, point) => {
	const faces = facesContainingPoint({ vertices_coords, faces_vertices }, point);
	return faces.length ? faces.shift() : undefined;
};
const nearestFace = (graph, point) => {
	const face = faceContainingPoint(graph, point);
	if (face !== undefined) { return face; }
	if (graph.edges_faces) {
		const edge = nearestEdge(graph, point);
		if (edge === undefined) { return undefined; }
		const faces = graph.edges_faces[edge];
		if (faces.length === 1) { return faces[0]; }
		if (faces.length > 1) {
			const faces_center = makeFacesConvexCenter({
				vertices_coords: graph.vertices_coords,
				faces_vertices: faces.map(f => graph.faces_vertices[f]),
			});
			const distances = faces_center
				.map(center => distance(center, point));
			let shortest = 0;
			for (let i = 0; i < distances.length; i += 1) {
				if (distances[i] < distances[shortest]) { shortest = i; }
			}
			return faces[shortest];
		}
	}
	return undefined;
};
const nearest = (graph, ...args) => {
	const nearestMethods = {
		vertices: nearestVertex,
		edges: nearestEdge,
		faces: nearestFace,
	};
	const point = getVector(...args);
	const nears = Object.create(null);
	["vertices", "edges", "faces"].forEach(key => {
		Object.defineProperty(nears, singularize[key], {
			enumerable: true,
			get: () => nearestMethods[key](graph, point),
		});
		filterKeysWithPrefix(graph, key)
			.forEach(fold_key => Object.defineProperty(nears, fold_key, {
				enumerable: true,
				get: () => graph[fold_key][nears[singularize[key]]],
			}));
	});
	return nears;
};const nearestMethods=/*#__PURE__*/Object.freeze({__proto__:null,faceContainingPoint,facesContainingPoint,nearest,nearestEdge,nearestFace,nearestVertex});const intersectLineLine = (
	a,
	b,
	aDomain = includeL,
	bDomain = includeL,
	epsilon = EPSILON,
) => {
	const det_norm = cross2(normalize2(a.vector), normalize2(b.vector));
	if (Math.abs(det_norm) < epsilon) {
		return { a: undefined, b: undefined, point: undefined };
	}
	const determinant0 = cross2(a.vector, b.vector);
	const determinant1 = -determinant0;
	const a2b = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / determinant0;
	const t1 = cross2(b2a, a.vector) / determinant1;
	if (aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector))) {
		return { a: t0, b: t1, point: add2(a.origin, scale2(a.vector, t0)) };
	}
	return { a: undefined, b: undefined, point: undefined };
};
const intersectCircleLine = (
	circle,
	line,
	circleDomain = include,
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	const magSq = line.vector[0] ** 2 + line.vector[1] ** 2;
	const mag = Math.sqrt(magSq);
	const norm = mag === 0 ? line.vector : line.vector.map(c => c / mag);
	const rot90 = rotate90(norm);
	const bvec = subtract2(line.origin, circle.origin);
	const det = cross2(bvec, norm);
	if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
	const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
	const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
	const results = Math.abs(circle.radius - Math.abs(det)) < epsilon
		? [side].map((s) => [s, s].map(f))
		: [-side, side].map((s) => [s, s].map(f));
	const ts = results.map(res => res.map((n, i) => n - line.origin[i]))
		.map(v => v[0] * line.vector[0] + line.vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => lineDomain(ts[i], epsilon));
};
const acosSafe = (x) => {
	if (x >= 1.0) return 0;
	if (x <= -1.0) return Math.PI;
	return Math.acos(x);
};
const rotateVector2 = (center, pt, a) => {
	const x = pt[0] - center[0];
	const y = pt[1] - center[1];
	const xRot = x * Math.cos(a) + y * Math.sin(a);
	const yRot = y * Math.cos(a) - x * Math.sin(a);
	return [center[0] + xRot, center[1] + yRot];
};
const intersectCircleCircle = (
	c1,
	c2,
	c1Domain = include,
	c2Domain = include,
	epsilon = EPSILON,
) => {
	const r = (c1.radius < c2.radius) ? c1.radius : c2.radius;
	const R = (c1.radius < c2.radius) ? c2.radius : c1.radius;
	const smCenter = (c1.radius < c2.radius) ? c1.origin : c2.origin;
	const bgCenter = (c1.radius < c2.radius) ? c2.origin : c1.origin;
	const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
	const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
	if (d < epsilon) { return undefined; }
	const point = vec.map((v, i) => (v / d) * R + bgCenter[i]);
	if (Math.abs((R + r) - d) < epsilon
		|| Math.abs(R - (r + d)) < epsilon) { return [point]; }
	if ((d + r) < R || (R + r < d)) { return undefined; }
	const angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
	const pt1 = rotateVector2(bgCenter, point, +angle);
	const pt2 = rotateVector2(bgCenter, point, -angle);
	return [pt1, pt2];
};
const getUniquePair = (intersections) => {
	for (let i = 1; i < intersections.length; i += 1) {
		if (!epsilonEqualVectors(intersections[0], intersections[i])) {
			return [intersections[0], intersections[i]];
		}
	}
	return undefined;
};
const intersectConvexPolygonLineInclusive = (
	poly,
	{ vector, origin },
	fn_poly = includeS,
	fn_line = includeL,
	epsilon = EPSILON,
) => {
	const intersections = poly
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		.map(side => intersectLineLine(
			{ vector: subtract2(side[1], side[0]), origin: side[0] },
			{ vector, origin },
			fn_poly,
			fn_line,
			epsilon,
		).point)
		.filter(a => a !== undefined);
	switch (intersections.length) {
	case 0: return undefined;
	case 1: return [intersections];
	default:
		return getUniquePair(intersections) || [intersections[0]];
	}
};
const intersectConvexPolygonLine = (
	poly,
	{ vector, origin },
	fn_poly = includeS,
	fn_line = excludeL,
	epsilon = EPSILON,
) => {
	const sects = intersectConvexPolygonLineInclusive(
		poly,
		{ vector, origin },
		fn_poly,
		fn_line,
		epsilon,
	);
	let altFunc;
	switch (fn_line) {
	case excludeR: altFunc = includeR; break;
	case excludeS: altFunc = includeS; break;
	default: return sects;
	}
	const includes = intersectConvexPolygonLineInclusive(
		poly,
		{ vector, origin },
		includeS,
		altFunc,
		epsilon,
	);
	if (includes === undefined) { return undefined; }
	const uniqueIncludes = getUniquePair(includes);
	if (uniqueIncludes === undefined) {
		switch (fn_line) {
		case excludeR:
			return overlapConvexPolygonPoint(poly, origin, exclude, 1e-3)
				? includes
				: undefined;
		case excludeS:
			return overlapConvexPolygonPoint(poly, add2(origin, vector), exclude, 1e-3)
				|| overlapConvexPolygonPoint(poly, origin, exclude, 1e-3)
				? includes
				: undefined;
		case excludeL: return undefined;
		default: return undefined;
		}
	}
	return overlapConvexPolygonPoint(poly, midpoint2(...uniqueIncludes), exclude, 1e-3)
		? uniqueIncludes
		: sects;
};const intersectMethods=/*#__PURE__*/Object.freeze({__proto__:null,intersectCircleCircle,intersectCircleLine,intersectConvexPolygonLine,intersectLineLine});const minimumCluster = (elements, comparison) => {
	let smallSet = [0];
	for (let i = 1; i < elements.length; i += 1) {
		switch (comparison(elements[smallSet[0]], elements[i])) {
		case 0: smallSet.push(i); break;
		case 1: smallSet = [i]; break;
		}
	}
	return smallSet;
};
const clusterSortedGeneric = (elements, comparison) => {
	if (!elements.length) { return []; }
	const indices = elements.map((_, i) => i);
	const groups = [[indices[0]]];
	for (let i = 1; i < indices.length; i += 1) {
		const index = indices[i];
		if (index === undefined) { continue; }
		const g = groups.length - 1;
		const prev = groups[g][groups[g].length - 1];
		if (comparison(elements[prev], elements[index])) {
			groups[g].push(index);
		} else {
			groups.push([index]);
		}
	}
	return groups;
};
const clusterScalars = (numbers, epsilon = EPSILON) => {
	const indices = numbers
		.map((v, i) => ({ v, i }))
		.sort((a, b) => a.v - b.v)
		.map(el => el.i);
	const sortedNumbers = indices.map(i => numbers[i]);
	const compFn = (a, b) => Math.abs(a - b) < epsilon;
	return clusterSortedGeneric(sortedNumbers, compFn)
		.map(arr => arr.map(i => indices[i]));
};
const clusterParallelVectors = (vectors, epsilon = EPSILON) => {
	const groups = [[0]];
	for (let i = 1; i < vectors.length; i += 1) {
		let found = false;
		for (let g = 0; g < groups.length; g += 1) {
			const groupFirstIndex = groups[g][0];
			if (parallel(vectors[i], vectors[groupFirstIndex], epsilon)) {
				groups[g].push(i);
				found = true;
				break;
			}
		}
		if (!found) {
			groups.push([i]);
		}
	}
	return groups;
};const clusterMethods=/*#__PURE__*/Object.freeze({__proto__:null,clusterParallelVectors,clusterScalars,clusterSortedGeneric,minimumCluster});const edgeifyFaces = ({ vertices_coords, faces_vertices }, axis = 0) => faces_vertices
	.map(vertices => [
		vertices
			.reduce((a, b) => (vertices_coords[a][axis] < vertices_coords[b][axis] ? a : b)),
		vertices
			.reduce((a, b) => (vertices_coords[a][axis] > vertices_coords[b][axis] ? a : b)),
	]);
const sweepVertices = ({ vertices_coords }, axis = 0, epsilon = EPSILON) => (
	clusterScalars(vertices_coords.map(p => p[axis]), epsilon)
		.map(vertices => ({
			vertices,
			t: vertices.reduce((p, c) => p + vertices_coords[c][axis], 0) / vertices.length,
		}))
);
const sweepValues = (values, { edges_vertices, vertices_edges }, epsilon = EPSILON) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edgesValues = edges_vertices.map(edge => edge.map(e => values[e]));
	const isDegenerate = edgesValues.map(pair => epsilonEqual(...pair, epsilon));
	const edgesDirection = edgesValues.map(([a, b]) => Math.sign(a - b));
	const edgesVertexSide = edges_vertices
		.map(([v1, v2], i) => (isDegenerate[i]
			? { [v1]: 0, [v2]: 0 }
			: { [v1]: edgesDirection[i], [v2]: -edgesDirection[i] }));
	return clusterScalars(values, epsilon)
		.map(vertices => vertices.filter(v => vertices_edges[v]))
		.filter(vertices => vertices.length)
		.map(vertices => ({
			vertices,
			t: vertices.reduce((p, c) => p + values[c], 0) / vertices.length,
			start: uniqueElements(vertices.flatMap(v => vertices_edges[v]
				.filter(edge => edgesVertexSide[edge][v] <= 0))),
			end: uniqueElements(vertices.flatMap(v => vertices_edges[v]
				.filter(edge => edgesVertexSide[edge][v] >= 0))),
		}));
};
const sweepEdges = ({
	vertices_coords, edges_vertices, vertices_edges,
}, axis = 0, epsilon = EPSILON) => (
	sweepValues(vertices_coords.map(p => p[axis]), { edges_vertices, vertices_edges }, epsilon)
);
const sweepFaces = ({
	vertices_coords, faces_vertices,
}, axis = 0, epsilon = EPSILON) => sweepValues(
	vertices_coords.map(p => p[axis]),
	{ edges_vertices: edgeifyFaces({ vertices_coords, faces_vertices }, axis) },
	epsilon,
);
const sweep = ({
	vertices_coords, edges_vertices, faces_vertices,
}, axis = 0, epsilon = EPSILON) => {
	const values = vertices_coords.map(p => p[axis]);
	const faces_edgeVertices = edgeifyFaces({ vertices_coords, faces_vertices }, axis);
	const vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	const vertices_faces = makeVerticesEdgesUnsorted({ edges_vertices: faces_edgeVertices });
	const edgesValues = edges_vertices.map(edge => edge.map(e => values[e]));
	const facesValues = faces_edgeVertices.map(face => face.map(e => values[e]));
	const edgesDegenerate = edgesValues.map(pair => epsilonEqual(...pair, epsilon));
	const facesDegenerate = facesValues.map(pair => epsilonEqual(...pair, epsilon));
	const edgesDirection = edgesValues.map(([a, b]) => Math.sign(a - b));
	const facesDirection = facesValues.map(([a, b]) => Math.sign(a - b));
	const edgesVertexSide = edges_vertices
		.map(([v1, v2], i) => (edgesDegenerate[i]
			? { [v1]: 0, [v2]: 0 }
			: { [v1]: edgesDirection[i], [v2]: -edgesDirection[i] }));
	const facesVertexSide = faces_vertices
		.map(([v1, v2], i) => (facesDegenerate[i]
			? { [v1]: 0, [v2]: 0 }
			: { [v1]: facesDirection[i], [v2]: -facesDirection[i] }));
	return clusterScalars(values, epsilon)
		.map(vertices => ({
			vertices,
			t: vertices.reduce((p, c) => p + values[c], 0) / vertices.length,
			edges: {
				start: uniqueElements(vertices
					.filter(v => vertices_edges[v] !== undefined)
					.flatMap(v => vertices_edges[v]
						.filter(edge => edgesVertexSide[edge][v] <= 0))),
				end: uniqueElements(vertices
					.filter(v => vertices_edges[v] !== undefined)
					.flatMap(v => vertices_edges[v]
						.filter(edge => edgesVertexSide[edge][v] >= 0))),
			},
			faces: {
				start: uniqueElements(vertices
					.filter(v => vertices_faces[v] !== undefined)
					.flatMap(v => vertices_faces[v]
						.filter(face => facesVertexSide[face][v] <= 0))),
				end: uniqueElements(vertices
					.filter(v => vertices_faces[v] !== undefined)
					.flatMap(v => vertices_faces[v]
						.filter(face => facesVertexSide[face][v] >= 0))),
			},
		}));
};const sweep$1=/*#__PURE__*/Object.freeze({__proto__:null,sweep,sweepEdges,sweepFaces,sweepValues,sweepVertices});const getOtherVerticesInEdges = ({ edges_vertices }, vertex, edges) => edges
	.map(edge => (edges_vertices[edge][0] === vertex
		? edges_vertices[edge][1]
		: edges_vertices[edge][0]));const edgesGeneral=/*#__PURE__*/Object.freeze({__proto__:null,getOtherVerticesInEdges});const isVertexCollinear = ({
	vertices_coords, vertices_edges, edges_vertices,
}, vertex, epsilon = EPSILON) => {
	if (!vertices_coords || !edges_vertices) { return false; }
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edges = vertices_edges[vertex];
	if (edges === undefined || edges.length !== 2) { return false; }
	const vertices = getOtherVerticesInEdges({ edges_vertices }, vertex, edges);
	const points = [vertices[0], vertex, vertices[1]]
		.map(v => vertices_coords[v]);
	return collinearBetween(...points, false, epsilon);
};const verticesCollinear=/*#__PURE__*/Object.freeze({__proto__:null,isVertexCollinear});const edgeToLine = ({ vertices_coords, edges_vertices }, edge) => (
	pointsToLine(
		vertices_coords[edges_vertices[edge][0]],
		vertices_coords[edges_vertices[edge][1]],
	));
const getEdgesLine = ({ vertices_coords, edges_vertices }, epsilon = EPSILON) => {
	if (!vertices_coords
		|| !edges_vertices
		|| !edges_vertices.length) {
		return { edges_line: [], lines: [] };
	}
	const edgesCoords = makeEdgesCoords({ vertices_coords, edges_vertices });
	const edgesVector = edgesCoords
		.map(verts => subtract(verts[1], verts[0]))
		.map(normalize$1);
	const edgesLine = edgesVector
		.map((vector, i) => ({ vector, origin: edgesCoords[i][0] }));
	const edgesOriginDistances = edgesLine
		.map(line => nearestPointOnLine(line, [0, 0, 0], clampLine))
		.map(point => magnitude(point));
	const distanceClusters = clusterScalars(edgesOriginDistances, epsilon);
	const parallelDistanceClusters = distanceClusters
		.map(cluster => cluster.map(i => edgesVector[i]))
		.map(cluster => clusterParallelVectors(cluster, 1e-3))
		.map((clusters, i) => clusters
			.map(cluster => cluster
				.map(index => distanceClusters[i][index])));
	const collinearParallelDistanceClusters = parallelDistanceClusters
		.map(clusters => clusters.map(cluster => {
			if (Math.abs(edgesOriginDistances[cluster[0]]) < epsilon) {
				return [cluster];
			}
			const clusterVector = edgesLine[cluster[0]].vector;
			const clusterPoints = cluster
				.map(e => vertices_coords[edges_vertices[e][0]])
				.map(point => projectPointOnPlane(point, clusterVector));
			const sortedIndices = radialSortPointIndices3(clusterPoints, clusterVector);
			const compareFn = (i, j) => (
				epsilonEqualVectors(clusterPoints[i], clusterPoints[j], epsilon)
			);
			const remap = cl => cl.map(i => sortedIndices[i]).map(i => cluster[i]);
			const clusterResult = clusterSortedGeneric(sortedIndices, compareFn);
			if (clusterResult.length === 1) { return clusterResult.map(remap); }
			const firstFirst = clusterResult[0][0];
			const last = clusterResult[clusterResult.length - 1];
			const lastLast = last[last.length - 1];
			const endIndices = [firstFirst, lastLast].map(i => sortedIndices[i]);
			if (compareFn(...endIndices)) {
				const lastCluster = clusterResult.pop();
				clusterResult[0] = lastCluster.concat(clusterResult[0]);
			}
			return clusterResult.map(remap);
		}));
	const lines_edges = collinearParallelDistanceClusters
		.flatMap(clusterOfClusters => clusterOfClusters
			.flatMap(clusters => clusters));
	const edges_line = invertMap(lines_edges);
	const lines_vertices = lines_edges
		.map(edges => edges.flatMap(e => edges_vertices[e]))
		.map(uniqueElements);
	const lines_firstVector = lines_edges.map(edges => edgesVector[edges[0]]);
	const lines_vertProjects = lines_vertices
		.map((vertices, i) => vertices
			.map(v => dot(lines_firstVector[i], vertices_coords[v])));
	const lines_vertProjectsMin = lines_vertProjects
		.map((projections, i) => lines_vertices[i][arrayMinIndex(projections)]);
	const lines_vertProjectsMax = lines_vertProjects
		.map((projections, i) => lines_vertices[i][arrayMaxIndex(projections)]);
	const lines_vector = lines_vertices.map((_, i) => subtract(
		vertices_coords[lines_vertProjectsMax[i]],
		vertices_coords[lines_vertProjectsMin[i]],
	));
	const lines_origin = lines_vertProjectsMin.map(v => vertices_coords[v]);
	const lines = lines_vector
		.map((vector, i) => ({ vector, origin: lines_origin[i] }));
	return {
		lines,
		edges_line,
	};
};const edgesLines$1=/*#__PURE__*/Object.freeze({__proto__:null,edgeToLine,getEdgesLine});const getLinesIntersections = (lines, epsilon = EPSILON) => {
	const linesIntersect = lines.map(() => []);
	for (let i = 0; i < lines.length - 1; i += 1) {
		for (let j = i + 1; j < lines.length; j += 1) {
			const { a, b, point } = intersectLineLine(
				lines[i],
				lines[j],
				includeS,
				includeS,
				epsilon,
			);
			if (point === undefined) { continue; }
			linesIntersect[i].push(a);
			linesIntersect[j].push(b);
		}
	}
	return linesIntersect;
};
const removeCollinearVertex = ({ edges_vertices, vertices_edges }, vertex) => {
	const edges = vertices_edges[vertex].sort((a, b) => a - b);
	const newEdgeVertices = edges
		.flatMap(e => edges_vertices[e])
		.filter(v => v !== vertex)
		.slice(0, 2);
	edges_vertices[edges[0]] = newEdgeVertices;
	edges_vertices[edges[1]] = undefined;
	newEdgeVertices.forEach(v => {
		const oldEdgeIndex = vertices_edges[v].indexOf(edges[1]);
		if (oldEdgeIndex === -1) { return; }
		vertices_edges[v][oldEdgeIndex] = edges[0];
	});
	return edges[1];
};
const planarize = ({
	vertices_coords,
	edges_vertices,
	edges_assignment,
	edges_foldAngle,
}, epsilon = EPSILON) => {
	const {
		lines,
		edges_line,
	} = getEdgesLine({ vertices_coords, edges_vertices }, epsilon);
	const linesSquareLength = lines.map(({ vector }) => magSquared2(vector));
	const lines_edges = invertArrayMap(edges_line);
	const edges_scalars = edges_vertices
		.map((verts, e) => verts
			.map(v => vertices_coords[v])
			.map(point => dot2(
				subtract2(point, lines[edges_line[e]].origin),
				lines[edges_line[e]].vector,
			)));
	const lines_flatEdgeScalars = lines_edges
		.map(edges => edges.flatMap(edge => edges_scalars[edge]))
		.map(numbers => epsilonUniqueSortedNumbers(numbers, epsilon));
	const lines_intersections = getLinesIntersections(lines, epsilon)
		.map(numbers => epsilonUniqueSortedNumbers(numbers, epsilon))
		.map((numbers, i) => numbers.map(n => n * linesSquareLength[i]))
		.map((sects, i) => (
			setDifferenceSortedNumbers(sects, lines_flatEdgeScalars[i], epsilon)
		));
	const sweepScalars = lines_edges
		.map(edges => edges.flatMap(edge => edges_scalars[edge]));
	const sweepEdgesVertices = lines_edges
		.map(edges => invertSimpleMap(edges)
			.map(e => [e * 2, e * 2 + 1]));
	const lineSweeps = lines_edges.map((_, i) => sweepValues(sweepScalars[i], {
		edges_vertices: sweepEdgesVertices[i],
	}, epsilon));
	const lineSweeps_vertices = lineSweeps.map(sweep => sweep.map(el => el.t));
	const lineSweeps_edges = lineSweeps.map(sweep => {
		const current = {};
		const edges = sweep.map(el => {
			el.start.forEach(n => { current[n] = true; });
			el.end.forEach(n => { delete current[n]; });
			return Object.keys(current).map(n => parseInt(n, 10));
		});
		edges.pop();
		return edges;
	});
	lines_intersections.forEach((points, i) => {
		const vertices = lineSweeps_vertices[i];
		const edges = lineSweeps_edges[i];
		let pi = 0;
		let vi = 0;
		while (pi < points.length && vi < vertices.length - 1) {
			if (points[pi] <= vertices[vi]) { throw new Error("bad algorithm"); }
			if (points[pi] > vertices[vi + 1]) { vi += 1; continue; }
			vertices.splice(vi + 1, 0, points[pi]);
			edges.splice(vi + 1, 0, edges[vi]);
			pi += 1;
		}
	});
	const new_vertices_coords = lineSweeps_vertices
		.flatMap((scalars, i) => scalars
			.map(s => s / linesSquareLength[i])
			.map(s => add2(lines[i].origin, scale2(lines[i].vector, s))));
	let e = 0;
	const new_edges_vertices = lineSweeps_edges
		.map(edges => {
			const vertices = edges.map(() => [e, ++e]);
			e += 1;
			return vertices;
		})
		.flatMap((edges, i) => edges
			.filter((_, j) => lineSweeps_edges[i][j].length));
	const result = {
		vertices_coords: new_vertices_coords,
		edges_vertices: new_edges_vertices,
	};
	if (edges_assignment || edges_foldAngle) {
		const edges_prevEdge = lineSweeps_edges
			.flatMap(edges => edges.filter(arr => arr.length));
		if (edges_assignment) {
			result.edges_assignment = edges_prevEdge
				.map(prev => edges_assignment[prev[0]]);
		}
		if (edges_foldAngle) {
			result.edges_foldAngle = edges_prevEdge
				.map(prev => edges_foldAngle[prev[0]]);
		}
	}
	removeIsolatedVertices(result, edgeIsolatedVertices(result));
	removeDuplicateVertices(result, epsilon);
	removeCircularEdges(result);
	result.vertices_edges = makeVerticesEdgesUnsorted(result);
	const collinearVertices = result.vertices_edges
		.map((edges, i) => (edges.length === 2 ? i : undefined))
		.filter(a => a !== undefined)
		.filter(v => isVertexCollinear(result, v, epsilon))
		.reverse();
	const edgesToRemove = collinearVertices
		.map(v => removeCollinearVertex(result, v));
	removeGeometryIndices(result, "edges", edgesToRemove);
	removeGeometryIndices(result, "vertices", collinearVertices);
	const dupEdges = duplicateEdges(result);
	if (dupEdges.length) {
		removeDuplicateEdges(result, dupEdges);
	}
	if (circularEdges(result).length) {
		console.error("planarize: found circular edges");
	}
	delete result.vertices_edges;
	return result;
};const buildAssignmentsIfNeeded = (graph) => {
	const len = graph.edges_vertices.length;
	if (!graph.edges_assignment) { graph.edges_assignment = []; }
	if (!graph.edges_foldAngle) { graph.edges_foldAngle = []; }
	if (graph.edges_assignment.length > graph.edges_foldAngle.length) {
		for (let i = graph.edges_foldAngle.length; i < graph.edges_assignment.length; i += 1) {
			graph.edges_foldAngle[i] = edgeAssignmentToFoldAngle(graph.edges_assignment[i]);
		}
	}
	if (graph.edges_foldAngle.length > graph.edges_assignment.length) {
		for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
			graph.edges_assignment[i] = edgeFoldAngleToAssignment(graph.edges_foldAngle[i]);
		}
	}
	for (let i = graph.edges_assignment.length; i < len; i += 1) {
		graph.edges_assignment[i] = "U";
		graph.edges_foldAngle[i] = 0;
	}
};
const buildFacesIfNeeded = (graph, reface) => {
	if (reface === undefined
		&& !graph.faces_vertices
		&& !graph.faces_edges
		&& graph.vertices_coords
		&& getDimension(graph) === 2) {
		reface = true;
	}
	if (reface && graph.vertices_coords) {
		const faces = makePlanarFaces(graph);
		graph.faces_vertices = faces.faces_vertices;
		graph.faces_edges = faces.faces_edges;
		return;
	}
	if (graph.faces_vertices && graph.faces_edges) { return; }
	if (graph.faces_vertices && !graph.faces_edges) {
		graph.faces_edges = makeFacesEdgesFromVertices(graph);
	} else if (graph.faces_edges && !graph.faces_vertices) {
		graph.faces_vertices = makeFacesVerticesFromEdges(graph);
	} else {
		graph.faces_vertices = [];
		graph.faces_edges = [];
	}
};
const populate = (graph, reface) => {
	if (typeof graph !== "object") { return graph; }
	if (!graph.edges_vertices) { return graph; }
	graph.vertices_edges = makeVerticesEdgesUnsorted(graph);
	graph.vertices_vertices = makeVerticesVertices(graph);
	graph.vertices_edges = makeVerticesEdges(graph);
	buildAssignmentsIfNeeded(graph);
	buildFacesIfNeeded(graph, reface);
	graph.vertices_faces = makeVerticesFaces(graph);
	graph.edges_faces = makeEdgesFacesUnsorted(graph);
	graph.faces_faces = makeFacesFaces(graph);
	return graph;
};const update_vertices_vertices$2 = ({ vertices_vertices }, vertex, incident_vertices) => {
	if (!vertices_vertices) { return; }
	vertices_vertices[vertex] = [...incident_vertices];
	incident_vertices.forEach((v, i, arr) => {
		const otherV = arr[(i + 1) % arr.length];
		const otherI = vertices_vertices[v].indexOf(otherV);
		vertices_vertices[v][otherI] = vertex;
	});
};
const update_vertices_sectors = ({
	vertices_coords, vertices_vertices, vertices_sectors,
}, vertex) => {
	if (!vertices_sectors) { return; }
	vertices_sectors[vertex] = vertices_vertices[vertex].length === 1
		? [TWO_PI]
		: counterClockwiseSectors2(vertices_vertices[vertex]
			.map(v => subtract2(vertices_coords[v], vertices_coords[vertex])));
};
const update_vertices_edges$2 = ({
	vertices_edges,
}, old_edge, new_vertex, vertices, new_edges) => {
	if (!vertices_edges) { return; }
	vertices_edges[new_vertex] = [...new_edges];
	vertices
		.map(v => vertices_edges[v].indexOf(old_edge))
		.forEach((index, i) => {
			vertices_edges[vertices[i]][index] = new_edges[i];
		});
};
const update_vertices_faces$1 = ({ vertices_faces }, vertex, faces) => {
	if (!vertices_faces) { return; }
	vertices_faces[vertex] = [...faces];
};
const update_edges_faces$1 = ({ edges_faces }, new_edges, faces) => {
	if (!edges_faces) { return; }
	new_edges.forEach(edge => { edges_faces[edge] = [...faces]; });
};
const update_faces_vertices = ({ faces_vertices }, new_vertex, incident_vertices, faces) => {
	if (!faces_vertices) { return; }
	faces
		.map(i => faces_vertices[i])
		.forEach(face => face
			.map((fv, i, arr) => {
				const nextI = (i + 1) % arr.length;
				return (fv === incident_vertices[0]
								&& arr[nextI] === incident_vertices[1])
								|| (fv === incident_vertices[1]
								&& arr[nextI] === incident_vertices[0])
					? nextI : undefined;
			}).filter(el => el !== undefined)
			.sort((a, b) => b - a)
			.forEach(i => face.splice(i, 0, new_vertex)));
};
const update_faces_edges_with_vertices = ({
	edges_vertices, faces_vertices, faces_edges,
}, faces) => {
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	faces
		.map(f => faces_vertices[f]
			.map((vertex, i, arr) => [vertex, arr[(i + 1) % arr.length]])
			.map(pair => edge_map[pair.join(" ")]))
		.forEach((edges, i) => { faces_edges[faces[i]] = edges; });
};const findAdjacentFacesToEdge = ({
	vertices_faces, edges_vertices, edges_faces, faces_edges, faces_vertices,
}, edge) => {
	if (edges_faces && edges_faces[edge]) {
		return edges_faces[edge];
	}
	const vertices = edges_vertices[edge];
	if (vertices_faces !== undefined) {
		const faces = [];
		for (let i = 0; i < vertices_faces[vertices[0]].length; i += 1) {
			for (let j = 0; j < vertices_faces[vertices[1]].length; j += 1) {
				if (vertices_faces[vertices[0]][i] === vertices_faces[vertices[1]][j]) {
					if (vertices_faces[vertices[0]][i] === undefined) { continue; }
					faces.push(vertices_faces[vertices[0]][i]);
				}
			}
		}
		return faces;
	}
	if (faces_edges) {
		const faces = [];
		for (let i = 0; i < faces_edges.length; i += 1) {
			for (let e = 0; e < faces_edges[i].length; e += 1) {
				if (faces_edges[i][e] === edge) { faces.push(i); }
			}
		}
		return faces;
	}
	if (faces_vertices) {
		console.warn("todo: findAdjacentFacesToEdge");
	}
};
const splitEdgeIntoTwo = (graph, edge_index, new_vertex) => {
	const edge_vertices = graph.edges_vertices[edge_index];
	const new_edges = [
		{ edges_vertices: [edge_vertices[0], new_vertex] },
		{ edges_vertices: [new_vertex, edge_vertices[1]] },
	];
	new_edges.forEach(edge => ["edges_assignment", "edges_foldAngle"]
		.filter(key => graph[key] && graph[key][edge_index] !== undefined)
		.forEach(key => { edge[key] = graph[key][edge_index]; }));
	return new_edges;
};
const splitEdge = (graph, old_edge, coords, epsilon = EPSILON) => {
	if (graph.edges_vertices.length < old_edge) { return {}; }
	const incident_vertices = graph.edges_vertices[old_edge];
	if (!coords) {
		coords = midpoint(...incident_vertices.map(v => graph.vertices_coords[v]));
	}
	const similar = incident_vertices
		.map(v => graph.vertices_coords[v])
		.map(vert => distance(vert, coords) < epsilon);
	if (similar[0]) { return { vertex: incident_vertices[0], edges: {} }; }
	if (similar[1]) { return { vertex: incident_vertices[1], edges: {} }; }
	const vertex = graph.vertices_coords.length;
	graph.vertices_coords[vertex] = coords;
	const new_edges = [0, 1].map(i => i + graph.edges_vertices.length);
	splitEdgeIntoTwo(graph, old_edge, vertex)
		.forEach((edge, i) => Object.keys(edge)
			.forEach((key) => { graph[key][new_edges[i]] = edge[key]; }));
	update_vertices_vertices$2(graph, vertex, incident_vertices);
	update_vertices_sectors(graph, vertex);
	update_vertices_edges$2(graph, old_edge, vertex, incident_vertices, new_edges);
	const incident_faces = findAdjacentFacesToEdge(graph, old_edge);
	if (incident_faces) {
		update_vertices_faces$1(graph, vertex, incident_faces);
		update_edges_faces$1(graph, new_edges, incident_faces);
		update_faces_vertices(graph, vertex, incident_vertices, incident_faces);
		update_faces_edges_with_vertices(graph, incident_faces);
	}
	const edge_map = removeGeometryIndices(graph, "edges", [old_edge]);
	new_edges.forEach((_, i) => { new_edges[i] = edge_map[new_edges[i]]; });
	edge_map.splice(-2);
	edge_map[old_edge] = new_edges;
	return {
		vertex,
		edges: {
			map: edge_map,
			new: new_edges,
			remove: old_edge,
		},
	};
};const make_edge = ({ vertices_coords }, vertices, face) => {
	const new_edge_coords = vertices
		.map(v => vertices_coords[v])
		.reverse();
	return {
		edges_vertices: [...vertices],
		edges_foldAngle: 0,
		edges_assignment: "U",
		edges_length: distance(...new_edge_coords),
		edges_vector: subtract(...new_edge_coords),
		edges_faces: [face, face],
	};
};
const rebuild_edge = (graph, face, vertices) => {
	const edge = graph.edges_vertices.length;
	const new_edge = make_edge(graph, vertices, face);
	Object.keys(new_edge)
		.filter(key => graph[key] !== undefined)
		.forEach((key) => { graph[key][edge] = new_edge[key]; });
	return edge;
};const make_faces = ({
	edges_vertices, faces_vertices, faces_edges,
}, face, vertices) => {
	const indices = vertices.map(el => faces_vertices[face].indexOf(el));
	const faces = splitCircularArray(faces_vertices[face], indices)
		.map(fv => ({ faces_vertices: fv }));
	if (faces_edges) {
		const vertices_to_edge = makeVerticesToEdgeBidirectional({ edges_vertices });
		faces
			.map(this_face => this_face.faces_vertices
				.map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
				.map(key => vertices_to_edge[key]))
			.forEach((face_edges, i) => { faces[i].faces_edges = face_edges; });
	}
	return faces;
};
const build_faces = (graph, face, vertices) => {
	const faces = [0, 1].map(i => graph.faces_vertices.length + i);
	make_faces(graph, face, vertices)
		.forEach((newface, i) => Object.keys(newface)
			.forEach((key) => { graph[key][faces[i]] = newface[key]; }));
	return faces;
};const split_at_intersections = (graph, { vertices, edges }) => {
	let map;
	const split_results = edges.map((el) => {
		const res = splitEdge(graph, map ? map[el.edge] : el.edge, el.coords);
		map = map ? mergeNextmaps(map, res.edges.map) : res.edges.map;
		return res;
	});
	vertices.push(...split_results.map(res => res.vertex));
	let bkmap;
	split_results.forEach(res => {
		res.edges.remove = bkmap ? bkmap[res.edges.remove] : res.edges.remove;
		const inverted = invertSimpleMap(res.edges.map);
		bkmap = bkmap ? mergeBackmaps(bkmap, inverted) : inverted;
	});
	return {
		vertices,
		edges: {
			map,
			remove: split_results.map(res => res.edges.remove),
		},
	};
};const update_vertices_vertices$1 = ({
	vertices_coords, vertices_vertices, edges_vertices,
}, edge) => {
	const v0 = edges_vertices[edge][0];
	const v1 = edges_vertices[edge][1];
	vertices_vertices[v0] = sortVerticesCounterClockwise(
		{ vertices_coords },
		vertices_vertices[v0].concat(v1),
		v0,
	);
	vertices_vertices[v1] = sortVerticesCounterClockwise(
		{ vertices_coords },
		vertices_vertices[v1].concat(v0),
		v1,
	);
};
const update_vertices_edges$1 = ({
	edges_vertices, vertices_edges, vertices_vertices,
}, edge) => {
	if (!vertices_edges || !vertices_vertices) { return; }
	const vertices = edges_vertices[edge];
	vertices
		.map(v => vertices_vertices[v])
		.map((vert_vert, i) => vert_vert
			.indexOf(vertices[(i + 1) % vertices.length]))
		.forEach((radial_index, i) => vertices_edges[vertices[i]]
			.splice(radial_index, 0, edge));
};
const update_vertices_faces = (graph, old_face, new_faces) => {
	const vertices_replacement_faces = {};
	new_faces
		.forEach(f => graph.faces_vertices[f]
			.forEach(v => {
				if (!vertices_replacement_faces[v]) {
					vertices_replacement_faces[v] = [];
				}
				vertices_replacement_faces[v].push(f);
			}));
	graph.faces_vertices[old_face].forEach(v => {
		const index = graph.vertices_faces[v].indexOf(old_face);
		const replacements = vertices_replacement_faces[v];
		if (index === -1 || !replacements) {
			throw new Error(Messages$1.convexFace);
		}
		graph.vertices_faces[v].splice(index, 1, ...replacements);
	});
};
const update_edges_faces = (graph, old_face, new_edge, new_faces) => {
	const edges_replacement_faces = {};
	new_faces
		.forEach(f => graph.faces_edges[f]
			.forEach(e => {
				if (!edges_replacement_faces[e]) { edges_replacement_faces[e] = []; }
				edges_replacement_faces[e].push(f);
			}));
	const edges = [...graph.faces_edges[old_face], new_edge];
	edges.forEach(e => {
		const replacements = edges_replacement_faces[e];
		const indices = [];
		for (let i = 0; i < graph.edges_faces[e].length; i += 1) {
			if (graph.edges_faces[e][i] === old_face) { indices.push(i); }
		}
		if (indices.length === 0 || !replacements) {
			throw new Error(Messages$1.convexFace);
		}
		indices.reverse().forEach(index => graph.edges_faces[e].splice(index, 1));
		const index = indices[indices.length - 1];
		graph.edges_faces[e].splice(index, 0, ...replacements);
	});
};
const update_faces_faces = ({ faces_vertices, faces_faces }, old_face, new_faces) => {
	const incident_faces = faces_faces[old_face];
	const new_faces_vertices = new_faces.map(f => faces_vertices[f]);
	const incident_face_face = incident_faces.map(f => {
		const incident_face_vertices = faces_vertices[f];
		const score = [0, 0];
		for (let n = 0; n < new_faces_vertices.length; n += 1) {
			let count = 0;
			for (let j = 0; j < incident_face_vertices.length; j += 1) {
				if (new_faces_vertices[n].indexOf(incident_face_vertices[j]) !== -1) {
					count += 1;
				}
			}
			score[n] = count;
		}
		if (score[0] >= 2) { return new_faces[0]; }
		if (score[1] >= 2) { return new_faces[1]; }
	});
	new_faces.forEach((f, i, arr) => {
		faces_faces[f] = [arr[(i + 1) % new_faces.length]];
	});
	incident_faces.forEach((f, i) => {
		for (let j = 0; j < faces_faces[f].length; j += 1) {
			if (faces_faces[f][j] === old_face) {
				faces_faces[f][j] = incident_face_face[i];
				faces_faces[incident_face_face[i]].push(f);
			}
		}
	});
};const signLine = () => 0;
const signRay = (n, epsilon) => (n < -epsilon ? -1 : 0);
const signSegment = (n, epsilon) => (n < -epsilon ? -1 : (n > 1 + epsilon ? 1 : 0));
const facesLineTypeOverlap = (
	{ vertices_coords, faces_vertices },
	{ vector, origin },
	signFunc = signLine,
	epsilon = EPSILON,
) => {
	const magSq = dot2(vector, vector);
	const unitVector = normalize2(vector);
	const verticesCrossSide = vertices_coords
		.map(coord => subtract2(coord, origin))
		.map(vec => normalize2(vec))
		.map(vec => cross2(unitVector, vec))
		.map(s => (Math.abs(s) < epsilon ? 0 : Math.sign(s)));
	const verticesDotSide = vertices_coords
		.map(coord => subtract2(coord, origin))
		.map(vec => dot2(vec, vector))
		.map(dot => dot / magSq)
		.map(s => signFunc(s, epsilon));
	const crossSideOverlap = faces_vertices
		.map(fv => fv
			.map(v => verticesCrossSide[v])
			.map((side, _, arr) => side === arr[0])
			.reduce((a, b) => a && b, true))
		.map(b => !b);
	const dotSideOverlap = faces_vertices
		.map(fv => fv
			.map(v => verticesDotSide[v])
			.map((side, _, arr) => side === arr[0])
			.reduce((a, b) => a && b, true))
		.map(b => !b)
		.map((b, i) => b || verticesDotSide[faces_vertices[i][0]] === 0);
	return faces_vertices
		.map((_, i) => i)
		.filter(i => crossSideOverlap[i] && dotSideOverlap[i]);
};
const getFacesLineOverlap = (graph, { vector, origin }, epsilon = EPSILON) => (
	facesLineTypeOverlap(graph, { vector, origin }, signLine, epsilon)
);
const getFacesRayOverlap = (graph, { vector, origin }, epsilon = EPSILON) => (
	facesLineTypeOverlap(graph, { vector, origin }, signRay, epsilon)
);
const getFacesSegmentOverlap = (graph, segment, epsilon = EPSILON) => {
	const vector = subtract2(segment[1], segment[0]);
	const origin = segment[0];
	return facesLineTypeOverlap(graph, { vector, origin }, signSegment, epsilon);
};
const intersectConvexFaceLine = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges,
}, face, { vector, origin }, epsilon = EPSILON) => {
	const face_vertices_indices = faces_vertices[face]
		.map(v => vertices_coords[v])
		.map(coord => overlapLinePoint({ vector, origin }, coord, () => true, epsilon))
		.map((overlap, i) => (overlap ? i : undefined))
		.filter(i => i !== undefined);
	const vertices = face_vertices_indices.map(i => faces_vertices[face][i]);
	const vertices_are_neighbors = face_vertices_indices
		.concat(face_vertices_indices.map(i => i + faces_vertices[face].length))
		.map((n, i, arr) => arr[i + 1] - n === 1)
		.reduce((a, b) => a || b, false);
	if (vertices_are_neighbors) { return undefined; }
	if (vertices.length > 1) { return { vertices, edges: [] }; }
	const edges = faces_edges[face]
		.map(edge => edges_vertices[edge]
			.map(v => vertices_coords[v]))
		.map(seg => intersectLineLine(
			{ vector, origin },
			{ vector: subtract2(seg[1], seg[0]), origin: seg[0] },
			includeL,
			excludeS,
			epsilon,
		).point).map((coords, face_edge_index) => ({
			coords,
			edge: faces_edges[face][face_edge_index],
		}))
		.filter(el => el.coords !== undefined)
		.filter(el => !(vertices
			.map(v => edges_vertices[el.edge].includes(v))
			.reduce((a, b) => a || b, false)));
	return (edges.length + vertices.length === 2
		? { vertices, edges }
		: undefined);
};const intersectFaces=/*#__PURE__*/Object.freeze({__proto__:null,facesLineTypeOverlap,getFacesLineOverlap,getFacesRayOverlap,getFacesSegmentOverlap,intersectConvexFaceLine});const splitFace = (graph, face, line, epsilon) => {
	const intersect = intersectConvexFaceLine(graph, face, line, epsilon);
	if (intersect === undefined) { return undefined; }
	const result = split_at_intersections(graph, intersect);
	result.edges.new = rebuild_edge(graph, face, result.vertices);
	update_vertices_vertices$1(graph, result.edges.new);
	update_vertices_edges$1(graph, result.edges.new);
	const faces = build_faces(graph, face, result.vertices);
	update_vertices_faces(graph, face, faces);
	update_edges_faces(graph, face, result.edges.new, faces);
	update_faces_faces(graph, face, faces);
	const faces_map = removeGeometryIndices(graph, "faces", [face]);
	faces.forEach((_, i) => { faces[i] = faces_map[faces[i]]; });
	faces_map.splice(-2);
	faces_map[face] = faces;
	result.faces = {
		map: faces_map,
		new: faces,
		remove: face,
	};
	return result;
};const selfRelationalArraySubset = (array_array, indices) => {
	const hash = {};
	indices.forEach(f => { hash[f] = true; });
	const array_arraySubset = [];
	indices.forEach(i => {
		array_arraySubset[i] = array_array[i].filter(j => hash[j]);
	});
	return array_arraySubset;
};
const subgraphExclusive = (graph, indicesToKeep = {}) => {
	const indices = {
		vertices: [],
		edges: [],
		faces: [],
		...indicesToKeep,
	};
	const components = Object.keys(indices);
	const copy = { ...graph };
	foldKeys.graph.forEach(key => delete copy[key]);
	delete copy.file_frames;
	const lookup = {};
	components.forEach(component => { lookup[component] = {}; });
	components.forEach(component => indices[component].forEach(i => {
		lookup[component][i] = true;
	}));
	const keys = {};
	components.forEach(c => {
		filterKeysWithPrefix(graph, c).forEach(key => { keys[key] = {}; });
		filterKeysWithSuffix(graph, c).forEach(key => { keys[key] = {}; });
	});
	components.forEach(c => {
		filterKeysWithPrefix(graph, c).forEach(key => { keys[key].prefix = c; });
		filterKeysWithSuffix(graph, c).forEach(key => { keys[key].suffix = c; });
	});
	Object.keys(keys).forEach(key => { copy[key] = []; });
	Object.keys(keys).forEach(key => {
		const { prefix, suffix } = keys[key];
		if (prefix && suffix) {
			indices[prefix].forEach(i => {
				copy[key][i] = graph[key][i].filter(j => lookup[suffix][j]);
			});
		} else if (prefix) {
			indices[prefix].forEach(i => { copy[key][i] = graph[key][i]; });
		} else if (suffix) {
			copy[key] = graph[key].map(arr => arr.filter(j => lookup[suffix][j]));
		} else {
			copy[key] = graph[key];
		}
	});
	return copy;
};
const subgraph = (graph, indicesToKeep = {}) => {
	const indices = {
		vertices: [],
		edges: [],
		faces: [],
		...indicesToKeep,
	};
	const lookup = { vertices: {}, edges: {}, faces: {} };
	indices.vertices.forEach(v => { lookup.vertices[v] = true; });
	indices.edges.forEach(e => { lookup.edges[e] = true; });
	indices.edges
		.forEach(edge => graph.edges_vertices[edge]
			.forEach(v => { lookup.vertices[v] = true; }));
	indices.faces.forEach(f => { lookup.faces[f] = true; });
	indices.faces
		.forEach(face => graph.faces_vertices[face]
			.forEach(v => { lookup.vertices[v] = true; }));
	graph.faces_vertices
		.map((_, f) => f)
		.filter(f => graph.faces_vertices[f]
			.map(v => lookup.vertices[v])
			.reduce((a, b) => a && b, true))
		.forEach(f => { lookup.faces[f] = true; });
	graph.edges_vertices
		.map((_, e) => e)
		.filter(e => graph.edges_vertices[e]
			.map(v => lookup.vertices[v])
			.reduce((a, b) => a && b, true))
		.forEach(e => { lookup.edges[e] = true; });
	return subgraphExclusive(graph, {
		vertices: Object.keys(lookup.vertices),
		edges: Object.keys(lookup.edges),
		faces: Object.keys(lookup.faces),
	});
};
const subgraphWithFaces = (graph, faces) => {
	let vertices = [];
	if (graph.faces_vertices) {
		vertices = uniqueSortedNumbers(
			faces.flatMap(f => graph.faces_vertices[f]),
		);
	}
	let edges = [];
	if (graph.faces_edges) {
		edges = uniqueSortedNumbers(
			faces.flatMap(f => graph.faces_edges[f]),
		);
	} else if (graph.edges_vertices) {
		const vertices_lookup = {};
		vertices.forEach(v => { vertices_lookup[v] = true; });
		edges = graph.edges_vertices
			.map((v, i) => (vertices_lookup[v[0]] && vertices_lookup[v[1]]
				? i
				: undefined))
			.filter(a => a !== undefined);
	}
	return subgraphExclusive(graph, {
		vertices,
		edges,
		faces,
	});
};
const subgraphWithVertices = (graph, vertices = []) => {
	const components = { vertices: [], edges: [] };
	vertices.forEach(v => { components.vertices[v] = true; });
	if (graph.vertices_edges) {
		components.vertices
			.forEach((_, v) => graph.vertices_edges[v]
				.forEach(e => { components.edges[e] = true; }));
	}
	if (graph.edges_vertices) {
		components.edges
			.forEach((_, e) => graph.edges_vertices[e]
				.forEach(v => { components.vertices[v] = true; }));
	}
	return subgraphExclusive(graph, {
		vertices: components.vertices
			.map((v, i) => (v ? i : undefined))
			.filter(a => a !== undefined),
		edges: components.edges
			.map((e, i) => (e ? i : undefined))
			.filter(a => a !== undefined),
	});
};const subgraphMethods=/*#__PURE__*/Object.freeze({__proto__:null,selfRelationalArraySubset,subgraph,subgraphExclusive,subgraphWithFaces,subgraphWithVertices});const validate_references = (graph) => {
	const counts = {
		vertices: count.vertices(graph),
		edges: count.edges(graph),
		faces: count.faces(graph),
	};
	const implied = {
		vertices: countImplied.vertices(graph),
		edges: countImplied.edges(graph),
		faces: countImplied.faces(graph),
	};
	return {
		vertices: counts.vertices >= implied.vertices,
		edges: counts.edges >= implied.edges,
		faces: counts.faces >= implied.faces,
	};
};
const validate = (graph, epsilon) => {
	const duplicate_edges = duplicateEdges(graph);
	const circular_edges = circularEdges(graph);
	const isolated_vertices = isolatedVertices(graph);
	const duplicate_vertices = duplicateVertices(graph, epsilon);
	const references = validate_references(graph);
	const is_perfect = duplicate_edges.length === 0
		&& circular_edges.length === 0
		&& isolated_vertices.length === 0
		&& references.vertices && references.edges && references.faces;
	const summary = is_perfect ? "valid" : "problematic";
	return {
		summary,
		vertices: {
			isolated: isolated_vertices,
			duplicate: duplicate_vertices,
			references: references.vertices,
		},
		edges: {
			circular: circular_edges,
			duplicate: duplicate_edges,
			references: references.edges,
		},
		faces: {
			references: references.faces,
		},
	};
};const connectedComponents = (array_array) => {
	const groups = [];
	const recurse = (index, current_group) => {
		if (groups[index] !== undefined) { return 0; }
		groups[index] = current_group;
		array_array[index].forEach(i => recurse(i, current_group));
		return 1;
	};
	for (let row = 0, group = 0; row < array_array.length; row += 1) {
		if (!(row in array_array)) { continue; }
		group += recurse(row, group);
	}
	return groups;
};
const connectedComponentsPairs = (array_array) => {
	const circular = [];
	const pairs = [];
	array_array.forEach((arr, i) => arr.forEach(j => {
		if (i < j) { pairs.push([i, j]); }
		if (i === j && !circular[i]) {
			circular[i] = true;
			pairs.push([i, j]);
		}
	}));
	return pairs;
};const connectedComponents$1=/*#__PURE__*/Object.freeze({__proto__:null,connectedComponents,connectedComponentsPairs});const disjointGraphsIndices = (graph) => {
	const edges_vertices = graph.edges_vertices || [];
	const faces_vertices = graph.faces_vertices || [];
	const vertices_edges = graph.vertices_edges
		? graph.vertices_edges
		: makeVerticesEdgesUnsorted({ edges_vertices });
	const vertices_vertices = graph.vertices_vertices
		? graph.vertices_vertices
		: makeVerticesVerticesUnsorted({ vertices_edges, edges_vertices });
	const vertices_faces = graph.vertices_faces
		? graph.vertices_faces
		: makeVerticesFacesUnsorted({ vertices_edges, faces_vertices });
	const vertices = invertArrayMap(connectedComponents(vertices_vertices));
	const edges = vertices
		.map(verts => verts.flatMap(v => vertices_edges[v]))
		.map(uniqueElements);
	const faces = vertices
		.map(verts => verts.flatMap(v => vertices_faces[v]))
		.map(uniqueElements);
	return Array.from(Array(vertices.length)).map((_, i) => ({
		vertices: vertices[i] || [],
		edges: edges[i] || [],
		faces: faces[i] || [],
	}));
};
const disjointGraphs = (graph) => {
	const graphs = disjointGraphsIndices(graph);
	const verticesKeys = filterKeysWithPrefix(graph, "vertices");
	const edgesKeys = filterKeysWithPrefix(graph, "edges");
	const facesKeys = filterKeysWithPrefix(graph, "faces");
	return graphs.map(({ vertices, edges, faces }) => {
		const subgraph = {};
		verticesKeys.forEach(key => {
			subgraph[key] = [];
			vertices.forEach(v => { subgraph[key][v] = graph[key][v]; });
		});
		edgesKeys.forEach(key => {
			subgraph[key] = [];
			edges.forEach(v => { subgraph[key][v] = graph[key][v]; });
		});
		facesKeys.forEach(key => {
			subgraph[key] = [];
			faces.forEach(v => { subgraph[key][v] = graph[key][v]; });
		});
		return subgraph;
	});
};const disjoint=/*#__PURE__*/Object.freeze({__proto__:null,disjointGraphs,disjointGraphsIndices});const boundingBox = ({ vertices_coords }, padding) => (
	boundingBox$1(vertices_coords, padding)
);
const boundaryVertices = ({ edges_vertices, edges_assignment = [] }) => (
	uniqueElements(edges_vertices
		.filter((_, i) => assignmentIsBoundary[edges_assignment[i]])
		.flat()));
const emptyBoundaryObject = () => ({ vertices: [], edges: [], polygon: [] });
const boundary = ({ vertices_coords, vertices_edges, edges_vertices, edges_assignment }) => {
	if (!edges_assignment || !edges_vertices) { return emptyBoundaryObject(); }
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edges_vertices_b = edges_assignment
		.map(a => a === "B" || a === "b");
	const edge_walk = [];
	const vertex_walk = [];
	let edgeIndex = -1;
	for (let i = 0; i < edges_vertices_b.length; i += 1) {
		if (edges_vertices_b[i]) { edgeIndex = i; break; }
	}
	if (edgeIndex === -1) { return emptyBoundaryObject(); }
	edges_vertices_b[edgeIndex] = false;
	edge_walk.push(edgeIndex);
	vertex_walk.push(edges_vertices[edgeIndex][0]);
	let nextVertex = edges_vertices[edgeIndex][1];
	while (vertex_walk[0] !== nextVertex) {
		vertex_walk.push(nextVertex);
		edgeIndex = vertices_edges[nextVertex]
			.filter(v => edges_vertices_b[v])
			.shift();
		if (edgeIndex === undefined) { return emptyBoundaryObject(); }
		if (edges_vertices[edgeIndex][0] === nextVertex) {
			[, nextVertex] = edges_vertices[edgeIndex];
		} else {
			[nextVertex] = edges_vertices[edgeIndex];
		}
		edges_vertices_b[edgeIndex] = false;
		edge_walk.push(edgeIndex);
	}
	return {
		vertices: vertex_walk,
		edges: edge_walk,
		polygon: vertices_coords ? vertex_walk.map(v => vertices_coords[v]) : [],
	};
};
const boundaries = () => console.error("todo");
const planarBoundary = ({
	vertices_coords, vertices_edges, vertices_vertices, edges_vertices,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices2D({
			vertices_coords, vertices_edges, edges_vertices,
		});
	}
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const edge_walk = [];
	const vertex_walk = [];
	const walk = {
		vertices: vertex_walk,
		edges: edge_walk,
	};
	let largestX = -Infinity;
	let first_vertex_i = -1;
	vertices_coords.forEach((v, i) => {
		if (v[0] > largestX) {
			largestX = v[0];
			first_vertex_i = i;
		}
	});
	if (first_vertex_i === -1) { return walk; }
	vertex_walk.push(first_vertex_i);
	const first_vc = vertices_coords[first_vertex_i];
	const first_neighbors = vertices_vertices[first_vertex_i];
	if (!first_neighbors) { return walk; }
	const counter_clock_first_i = first_neighbors
		.map(i => vertices_coords[i])
		.map(vc => [vc[0] - first_vc[0], vc[1] - first_vc[1]])
		.map(vec => Math.atan2(vec[1], vec[0]))
		.map(angle => (angle < 0 ? angle + Math.PI * 2 : angle))
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.shift()
		.i;
	const second_vertex_i = first_neighbors[counter_clock_first_i];
	const first_edge_lookup = first_vertex_i < second_vertex_i
		? `${first_vertex_i} ${second_vertex_i}`
		: `${second_vertex_i} ${first_vertex_i}`;
	const first_edge = edge_map[first_edge_lookup];
	edge_walk.push(first_edge);
	let prev_vertex_i = first_vertex_i;
	let this_vertex_i = second_vertex_i;
	const visitedVertexPairs = { [`${prev_vertex_i} ${this_vertex_i}`]: true };
	while (true) {
		const next_neighbors = vertices_vertices[this_vertex_i];
		const from_neighbor_i = next_neighbors.indexOf(prev_vertex_i);
		const next_neighbor_i = (from_neighbor_i + 1) % next_neighbors.length;
		const next_vertex_i = next_neighbors[next_neighbor_i];
		const next_edge_lookup = this_vertex_i < next_vertex_i
			? `${this_vertex_i} ${next_vertex_i}`
			: `${next_vertex_i} ${this_vertex_i}`;
		const next_edge_i = edge_map[next_edge_lookup];
		if (visitedVertexPairs[`${this_vertex_i} ${next_vertex_i}`]) {
			if (next_edge_i !== edge_walk[0]) { console.warn("bad boundary"); }
			return walk;
		}
		visitedVertexPairs[`${this_vertex_i} ${next_vertex_i}`] = true;
		vertex_walk.push(this_vertex_i);
		edge_walk.push(next_edge_i);
		prev_vertex_i = this_vertex_i;
		this_vertex_i = next_vertex_i;
	}
};
const planarBoundaries = ({
	vertices_coords, vertices_edges, vertices_vertices, edges_vertices,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices2D({
			vertices_coords, vertices_edges, edges_vertices,
		});
	}
	return disjointGraphs({
		vertices_coords, vertices_vertices, edges_vertices,
	}).map(planarBoundary);
};const boundary$1=/*#__PURE__*/Object.freeze({__proto__:null,boundaries,boundary,boundaryVertices,boundingBox,planarBoundaries,planarBoundary});const getFaceFaceSharedVertices = (face_a_vertices, face_b_vertices) => {
	const hash = {};
	face_b_vertices.forEach((v) => { hash[v] = true; });
	const match = face_a_vertices.map(v => !!hash[v]);
	const shared_vertices = [];
	const notShared = match.indexOf(false);
	const already_added = {};
	for (let i = notShared + 1; i < match.length; i += 1) {
		if (match[i] && !already_added[face_a_vertices[i]]) {
			shared_vertices.push(face_a_vertices[i]);
			already_added[face_a_vertices[i]] = true;
		}
	}
	for (let i = 0; i < notShared; i += 1) {
		if (match[i] && !already_added[face_a_vertices[i]]) {
			shared_vertices.push(face_a_vertices[i]);
			already_added[face_a_vertices[i]] = true;
		}
	}
	return shared_vertices;
};const facesGeneral=/*#__PURE__*/Object.freeze({__proto__:null,getFaceFaceSharedVertices});const minimumSpanningTrees = (array_array = [], rootIndex = 0) => {
	if (array_array.length === 0) { return []; }
	const trees = [];
	const unvisited = {};
	array_array.forEach((_, i) => { unvisited[i] = true; });
	do {
		const startIndex = rootIndex !== undefined && unvisited[rootIndex]
			? rootIndex
			: parseInt(Object.keys(unvisited).shift(), 10);
		rootIndex = undefined;
		const tree = [];
		delete unvisited[startIndex];
		let previousLevel = [{ index: startIndex }];
		do {
			tree.push(previousLevel);
			const currentLevel = previousLevel
				.flatMap(current => array_array[current.index]
					.filter(i => unvisited[i])
					.map(index => ({ index, parent: current.index })));
			const duplicates = {};
			currentLevel.forEach((el, i) => {
				if (!unvisited[el.index]) { duplicates[i] = true; }
				delete unvisited[el.index];
			});
			previousLevel = currentLevel.filter((_, i) => !duplicates[i]);
		} while (previousLevel.length);
		trees.push(tree);
	} while (Object.keys(unvisited).length);
	return trees;
};
const minimumSpanningTree = (array_array, rootIndex) => (
	minimumSpanningTrees(array_array, rootIndex).shift()
);const trees=/*#__PURE__*/Object.freeze({__proto__:null,minimumSpanningTree,minimumSpanningTrees});const multiplyVerticesFacesMatrix2 = ({
	vertices_coords, vertices_faces, faces_vertices,
}, faces_matrix) => {
	if (!vertices_faces) {
		vertices_faces = makeVerticesFaces({ faces_vertices });
	}
	const vertices_matrix = vertices_faces
		.map(faces => faces
			.filter(a => a != null)
			.shift())
		.map(face => (face === undefined
			? identity2x3
			: faces_matrix[face]));
	return vertices_coords
		.map((coord, i) => multiplyMatrix2Vector2(vertices_matrix[i], coord));
};
const unassigned_angle = { U: true, u: true };
const makeFacesMatrix = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	if (!edges_assignment && edges_foldAngle) {
		edges_assignment = makeEdgesAssignmentSimple({ edges_foldAngle });
	}
	if (!edges_foldAngle) {
		if (edges_assignment) {
			edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
		} else {
			edges_foldAngle = Array(edges_vertices.length).fill(0);
		}
	}
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const faces_matrix = faces_vertices.map(() => identity3x4);
	minimumSpanningTrees(faces_faces, root_face)
		.forEach(tree => tree
			.slice(1)
			.forEach(level => level
				.forEach((entry) => {
					const edge_vertices = getFaceFaceSharedVertices(
						faces_vertices[entry.index],
						faces_vertices[entry.parent],
					).slice(0, 2);
					const coords = edge_vertices.map(v => vertices_coords[v]);
					const edgeKey = edge_vertices.join(" ");
					const edge = edge_map[edgeKey];
					const foldAngle = unassigned_angle[edges_assignment[edge]]
						? Math.PI
						: (edges_foldAngle[edge] * Math.PI) / 180;
					const local_matrix = makeMatrix3Rotate(
						foldAngle,
						subtract(...resizeUp(coords[1], coords[0])),
						coords[0],
					);
					faces_matrix[entry.index] = multiplyMatrices3(faces_matrix[entry.parent], local_matrix);
				})));
	return faces_matrix;
};
const makeFacesMatrix2 = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	if (!edges_foldAngle) {
		if (edges_assignment) {
			edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
		} else {
			edges_foldAngle = Array(edges_vertices.length).fill(0);
		}
	}
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	const edges_is_folded = makeEdgesIsFolded({ edges_vertices, edges_foldAngle, edges_assignment });
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	const faces_matrix = faces_vertices.map(() => identity2x3);
	minimumSpanningTrees(faces_faces, root_face)
		.forEach(tree => tree
			.slice(1)
			.forEach(level => level
				.forEach((entry) => {
					const edge_vertices = getFaceFaceSharedVertices(
						faces_vertices[entry.index],
						faces_vertices[entry.parent],
					).slice(0, 2);
					const coords = edge_vertices.map(v => vertices_coords[v]);
					const edgeKey = edge_vertices.join(" ");
					const edge = edge_map[edgeKey];
					const reflect_vector = subtract2(coords[1], coords[0]);
					const reflect_origin = coords[0];
					const local_matrix = edges_is_folded[edge]
						? makeMatrix2Reflect(reflect_vector, reflect_origin)
						: identity2x3;
					faces_matrix[entry.index] = multiplyMatrices2(faces_matrix[entry.parent], local_matrix);
				})));
	return faces_matrix;
};const facesMatrix=/*#__PURE__*/Object.freeze({__proto__:null,makeFacesMatrix,makeFacesMatrix2,multiplyVerticesFacesMatrix2});const makeVerticesCoordsFolded = ({
	vertices_coords, vertices_faces, edges_vertices, edges_foldAngle,
	edges_assignment, faces_vertices, faces_faces, faces_matrix,
}, root_face) => {
	if (!vertices_coords || !vertices_coords.length) { return []; }
	if (!faces_vertices || !faces_vertices.length) { return vertices_coords; }
	faces_matrix = makeFacesMatrix({
		vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
	}, root_face);
	if (!vertices_faces) {
		vertices_faces = makeVerticesFaces({ faces_vertices });
	}
	const vertices_matrix = vertices_faces
		.map(faces => faces
			.filter(a => a != null)
			.shift())
		.map(face => (face === undefined
			? identity3x4
			: faces_matrix[face]));
	return vertices_coords
		.map(coord => resize(3, coord))
		.map((coord, i) => multiplyMatrix3Vector3(vertices_matrix[i], coord));
};
const makeVerticesCoordsFlatFolded = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces,
}, root_face = 0) => {
	if (!vertices_coords || !vertices_coords.length) { return []; }
	if (!faces_vertices || !faces_vertices.length) { return vertices_coords; }
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	const edges_is_folded = makeEdgesIsFolded({ edges_vertices, edges_foldAngle, edges_assignment });
	const vertices_coords_folded = [];
	const faces_flipped = [];
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	minimumSpanningTrees(faces_faces, root_face).forEach(tree => {
		const rootRow = tree.shift();
		if (!rootRow || !rootRow.length) { return; }
		const root = rootRow[0];
		faces_flipped[root.index] = false;
		faces_vertices[root.index]
			.forEach(v => { vertices_coords_folded[v] = [...vertices_coords[v]]; });
		tree.forEach(level => level
			.forEach(entry => {
				const edge_key = getFaceFaceSharedVertices(
					faces_vertices[entry.index],
					faces_vertices[entry.parent],
				).slice(0, 2).join(" ");
				const edge = edge_map[edge_key];
				const coords = edges_vertices[edge].map(v => vertices_coords_folded[v]);
				if (coords[0] === undefined || coords[1] === undefined) { return; }
				const coords_cp = edges_vertices[edge].map(v => vertices_coords[v]);
				const origin_cp = coords_cp[0];
				const vector_cp = normalize2(subtract2(coords_cp[1], coords_cp[0]));
				const normal_cp = rotate90(vector_cp);
				faces_flipped[entry.index] = edges_is_folded[edge]
					? !faces_flipped[entry.parent]
					: faces_flipped[entry.parent];
				const vector_folded = normalize2(subtract2(coords[1], coords[0]));
				const origin_folded = coords[0];
				const normal_folded = faces_flipped[entry.index]
					? rotate270(vector_folded)
					: rotate90(vector_folded);
				faces_vertices[entry.index]
					.filter(v => vertices_coords_folded[v] === undefined)
					.forEach(v => {
						const to_point = subtract2(vertices_coords[v], origin_cp);
						const project_norm = dot(to_point, normal_cp);
						const project_line = dot(to_point, vector_cp);
						const walk_up = scale2(vector_folded, project_line);
						const walk_perp = scale2(normal_folded, project_norm);
						const folded_coords = add2(add2(origin_folded, walk_up), walk_perp);
						vertices_coords_folded[v] = folded_coords;
					});
			}));
	});
	return vertices_coords_folded;
};const verticesFolded=/*#__PURE__*/Object.freeze({__proto__:null,makeVerticesCoordsFlatFolded,makeVerticesCoordsFolded});const clonePolyfill = function (o) {
	let newO;
	let i;
	if (typeof o !== "object") {
		return o;
	}
	if (!o) {
		return o;
	}
	if (Object.prototype.toString.apply(o) === "[object Array]") {
		newO = [];
		for (i = 0; i < o.length; i += 1) {
			newO[i] = clonePolyfill(o[i]);
		}
		return newO;
	}
	newO = {};
	for (i in o) {
		if (o.hasOwnProperty(i)) {
			newO[i] = clonePolyfill(o[i]);
		}
	}
	return newO;
};
const clone = (typeof structuredClone === "function"
	? structuredClone
	: clonePolyfill);const str_class = "class";
const str_function = "function";
const str_undefined = "undefined";
const str_boolean = "boolean";
const str_number = "number";
const str_string = "string";
const str_object = "object";
const str_svg = "svg";
const str_path = "path";
const str_id = "id";
const str_style = "style";
const str_viewBox = "viewBox";
const str_transform = "transform";
const str_points = "points";
const str_stroke = "stroke";
const str_fill = "fill";
const str_none = "none";
const str_arrow = "arrow";
const str_head = "head";
const str_tail = "tail";const isBrowser = typeof window !== str_undefined
	&& typeof window.document !== str_undefined;
typeof process !== str_undefined
	&& process.versions != null
	&& process.versions.node != null;const Messages = {
	window: "window not set; svg.window = @xmldom/xmldom",
};const svgWindowContainer = { window: undefined };
const buildHTMLDocument = (newWindow) => new newWindow.DOMParser()
	.parseFromString("<!DOCTYPE html><title>.</title>", "text/html");
const setSVGWindow = (newWindow) => {
	if (!newWindow.document) { newWindow.document = buildHTMLDocument(newWindow); }
	svgWindowContainer.window = newWindow;
	return svgWindowContainer.window;
};
if (isBrowser) { svgWindowContainer.window = window; }
const SVGWindow = () => {
	if (svgWindowContainer.window === undefined) {
		throw Messages.window;
	}
	return svgWindowContainer.window;
};const NS = "http://www.w3.org/2000/svg";
const classes_attributes = {
	presentation: [
		"color",
		"color-interpolation",
		"cursor",
		"direction",
		"display",
		"fill",
		"fill-opacity",
		"fill-rule",
		"font-family",
		"font-size",
		"font-size-adjust",
		"font-stretch",
		"font-style",
		"font-variant",
		"font-weight",
		"image-rendering",
		"letter-spacing",
		"opacity",
		"overflow",
		"paint-order",
		"pointer-events",
		"preserveAspectRatio",
		"shape-rendering",
		"stroke",
		"stroke-dasharray",
		"stroke-dashoffset",
		"stroke-linecap",
		"stroke-linejoin",
		"stroke-miterlimit",
		"stroke-opacity",
		"stroke-width",
		"tabindex",
		"transform-origin",
		"user-select",
		"vector-effect",
		"visibility",
	],
	animation: [
		"accumulate",
		"additive",
		"attributeName",
		"begin",
		"by",
		"calcMode",
		"dur",
		"end",
		"from",
		"keyPoints",
		"keySplines",
		"keyTimes",
		"max",
		"min",
		"repeatCount",
		"repeatDur",
		"restart",
		"to",
		"values",
	],
	effects: [
		"azimuth",
		"baseFrequency",
		"bias",
		"color-interpolation-filters",
		"diffuseConstant",
		"divisor",
		"edgeMode",
		"elevation",
		"exponent",
		"filter",
		"filterRes",
		"filterUnits",
		"flood-color",
		"flood-opacity",
		"in",
		"in2",
		"intercept",
		"k1",
		"k2",
		"k3",
		"k4",
		"kernelMatrix",
		"lighting-color",
		"limitingConeAngle",
		"mode",
		"numOctaves",
		"operator",
		"order",
		"pointsAtX",
		"pointsAtY",
		"pointsAtZ",
		"preserveAlpha",
		"primitiveUnits",
		"radius",
		"result",
		"seed",
		"specularConstant",
		"specularExponent",
		"stdDeviation",
		"stitchTiles",
		"surfaceScale",
		"targetX",
		"targetY",
		"type",
		"xChannelSelector",
		"yChannelSelector",
	],
	text: [
		"dx",
		"dy",
		"alignment-baseline",
		"baseline-shift",
		"dominant-baseline",
		"lengthAdjust",
		"method",
		"overline-position",
		"overline-thickness",
		"rotate",
		"spacing",
		"startOffset",
		"strikethrough-position",
		"strikethrough-thickness",
		"text-anchor",
		"text-decoration",
		"text-rendering",
		"textLength",
		"underline-position",
		"underline-thickness",
		"word-spacing",
		"writing-mode",
	],
	gradient: [
		"gradientTransform",
		"gradientUnits",
		"spreadMethod",
	],
};const classes_nodes = {
	svg: [
		"svg",
	],
	defs: [
		"defs",
	],
	header: [
		"desc",
		"filter",
		"metadata",
		"style",
		"script",
		"title",
		"view",
	],
	cdata: [
		"cdata",
	],
	group: [
		"g",
	],
	visible: [
		"circle",
		"ellipse",
		"line",
		"path",
		"polygon",
		"polyline",
		"rect",
		"arc",
		"arrow",
		"curve",
		"parabola",
		"roundRect",
		"wedge",
		"origami",
	],
	text: [
		"text",
	],
	invisible: [
		"marker",
		"symbol",
		"clipPath",
		"mask",
	],
	patterns: [
		"linearGradient",
		"radialGradient",
		"pattern",
	],
	childrenOfText: [
		"textPath",
		"tspan",
	],
	gradients: [
		"stop",
	],
	filter: [
		"feBlend",
		"feColorMatrix",
		"feComponentTransfer",
		"feComposite",
		"feConvolveMatrix",
		"feDiffuseLighting",
		"feDisplacementMap",
		"feDistantLight",
		"feDropShadow",
		"feFlood",
		"feFuncA",
		"feFuncB",
		"feFuncG",
		"feFuncR",
		"feGaussianBlur",
		"feImage",
		"feMerge",
		"feMergeNode",
		"feMorphology",
		"feOffset",
		"fePointLight",
		"feSpecularLighting",
		"feSpotLight",
		"feTile",
		"feTurbulence",
	],
};const nodes_attributes = {
	svg: [str_viewBox],
	line: ["x1", "y1", "x2", "y2"],
	rect: ["x", "y", "width", "height"],
	circle: ["cx", "cy", "r"],
	ellipse: ["cx", "cy", "rx", "ry"],
	polygon: [str_points],
	polyline: [str_points],
	path: ["d"],
	text: ["x", "y"],
	mask: [str_id],
	symbol: [str_id],
	clipPath: [str_id, "clip-rule"],
	marker: [
		str_id,
		"markerHeight",
		"markerUnits",
		"markerWidth",
		"orient",
		"refX",
		"refY",
	],
	linearGradient: ["x1", "x2", "y1", "y2"],
	radialGradient: ["cx", "cy", "r", "fr", "fx", "fy"],
	stop: ["offset", "stop-color", "stop-opacity"],
	pattern: ["patternContentUnits", "patternTransform", "patternUnits"],
};
const additionalNodeAttributes = [{
	nodes: [str_svg, "defs", "g"].concat(classes_nodes.visible, classes_nodes.text),
	attr: classes_attributes.presentation,
}, {
	nodes: ["filter"],
	attr: classes_attributes.effects,
}, {
	nodes: classes_nodes.childrenOfText.concat("text"),
	attr: classes_attributes.text,
}, {
	nodes: classes_nodes.filter,
	attr: classes_attributes.effects,
}, {
	nodes: classes_nodes.gradients,
	attr: classes_attributes.gradient,
}];
additionalNodeAttributes
	.forEach(el => el.nodes
		.forEach(nodeName => {
			if (!nodes_attributes[nodeName]) { nodes_attributes[nodeName] = []; }
			nodes_attributes[nodeName].push(...el.attr);
		}));const headerStuff = [
	classes_nodes.header,
	classes_nodes.invisible,
	classes_nodes.patterns,
].flat();
const drawingShapes = [
	classes_nodes.group,
	classes_nodes.visible,
	classes_nodes.text,
].flat();
const nodes_children = {
	svg: [["svg", "defs"], headerStuff, drawingShapes].flat(),
	defs: headerStuff,
	filter: classes_nodes.filter,
	g: drawingShapes,
	text: classes_nodes.childrenOfText,
	marker: drawingShapes,
	symbol: drawingShapes,
	clipPath: drawingShapes,
	mask: drawingShapes,
	linearGradient: classes_nodes.gradients,
	radialGradient: classes_nodes.gradients,
};const nodeNames = Object.values(classes_nodes).flat();const cssColors = {
	black: "#000000",
	silver: "#c0c0c0",
	gray: "#808080",
	white: "#ffffff",
	maroon: "#800000",
	red: "#ff0000",
	purple: "#800080",
	fuchsia: "#ff00ff",
	green: "#008000",
	lime: "#00ff00",
	olive: "#808000",
	yellow: "#ffff00",
	navy: "#000080",
	blue: "#0000ff",
	teal: "#008080",
	aqua: "#00ffff",
	orange: "#ffa500",
	aliceblue: "#f0f8ff",
	antiquewhite: "#faebd7",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	blanchedalmond: "#ffebcd",
	blueviolet: "#8a2be2",
	brown: "#a52a2a",
	burlywood: "#deb887",
	cadetblue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerblue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkblue: "#00008b",
	darkcyan: "#008b8b",
	darkgoldenrod: "#b8860b",
	darkgray: "#a9a9a9",
	darkgreen: "#006400",
	darkgrey: "#a9a9a9",
	darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b",
	darkolivegreen: "#556b2f",
	darkorange: "#ff8c00",
	darkorchid: "#9932cc",
	darkred: "#8b0000",
	darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f",
	darkslateblue: "#483d8b",
	darkslategray: "#2f4f4f",
	darkslategrey: "#2f4f4f",
	darkturquoise: "#00ced1",
	darkviolet: "#9400d3",
	deeppink: "#ff1493",
	deepskyblue: "#00bfff",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1e90ff",
	firebrick: "#b22222",
	floralwhite: "#fffaf0",
	forestgreen: "#228b22",
	gainsboro: "#dcdcdc",
	ghostwhite: "#f8f8ff",
	gold: "#ffd700",
	goldenrod: "#daa520",
	greenyellow: "#adff2f",
	grey: "#808080",
	honeydew: "#f0fff0",
	hotpink: "#ff69b4",
	indianred: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	lavender: "#e6e6fa",
	lavenderblush: "#fff0f5",
	lawngreen: "#7cfc00",
	lemonchiffon: "#fffacd",
	lightblue: "#add8e6",
	lightcoral: "#f08080",
	lightcyan: "#e0ffff",
	lightgoldenrodyellow: "#fafad2",
	lightgray: "#d3d3d3",
	lightgreen: "#90ee90",
	lightgrey: "#d3d3d3",
	lightpink: "#ffb6c1",
	lightsalmon: "#ffa07a",
	lightseagreen: "#20b2aa",
	lightskyblue: "#87cefa",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#b0c4de",
	lightyellow: "#ffffe0",
	limegreen: "#32cd32",
	linen: "#faf0e6",
	magenta: "#ff00ff",
	mediumaquamarine: "#66cdaa",
	mediumblue: "#0000cd",
	mediumorchid: "#ba55d3",
	mediumpurple: "#9370db",
	mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee",
	mediumspringgreen: "#00fa9a",
	mediumturquoise: "#48d1cc",
	mediumvioletred: "#c71585",
	midnightblue: "#191970",
	mintcream: "#f5fffa",
	mistyrose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajowhite: "#ffdead",
	oldlace: "#fdf5e6",
	olivedrab: "#6b8e23",
	orangered: "#ff4500",
	orchid: "#da70d6",
	palegoldenrod: "#eee8aa",
	palegreen: "#98fb98",
	paleturquoise: "#afeeee",
	palevioletred: "#db7093",
	papayawhip: "#ffefd5",
	peachpuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderblue: "#b0e0e6",
	rosybrown: "#bc8f8f",
	royalblue: "#4169e1",
	saddlebrown: "#8b4513",
	salmon: "#fa8072",
	sandybrown: "#f4a460",
	seagreen: "#2e8b57",
	seashell: "#fff5ee",
	sienna: "#a0522d",
	skyblue: "#87ceeb",
	slateblue: "#6a5acd",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#fffafa",
	springgreen: "#00ff7f",
	steelblue: "#4682b4",
	tan: "#d2b48c",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	whitesmoke: "#f5f5f5",
	yellowgreen: "#9acd32",
};const roundF = n => Math.round(n * 100) / 100;
const hslToRgb = (hue, saturation, lightness, alpha) => {
	const s = saturation / 100;
	const l = lightness / 100;
	const k = n => (n + hue / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = n => (
		l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
	);
	return alpha === undefined
		? [f(0) * 255, f(8) * 255, f(4) * 255]
		: [f(0) * 255, f(8) * 255, f(4) * 255, alpha];
};
const mapHexNumbers = (numbers, map) => {
	const chars = Array.from(Array(map.length))
		.map((_, i) => numbers[i] || "0");
	return numbers.length <= 4
		? map.map(i => chars[i]).join("")
		: chars.join("");
};
const hexToRgb = (string) => {
	const numbers = string.replace(/#(?=\S)/g, "");
	const hasAlpha = numbers.length === 4 || numbers.length === 8;
	const hexString = hasAlpha
		? mapHexNumbers(numbers, [0, 0, 1, 1, 2, 2, 3, 3])
		: mapHexNumbers(numbers, [0, 0, 1, 1, 2, 2]);
	const c = parseInt(hexString, 16);
	return hasAlpha
		? [(c >> 24) & 255, (c >> 16) & 255, (c >> 8) & 255, roundF((c & 255) / 256)]
		: [(c >> 16) & 255, (c >> 8) & 255, c & 255];
};
const rgbToHex = (red, green, blue, alpha) => {
	const to16 = n => `00${Math.max(0, Math.min(Math.round(n), 255)).toString(16)}`
		.slice(-2);
	const hex = `#${[red, green, blue].map(to16).join("")}`;
	return alpha === undefined
		? hex
		: `${hex}${to16(alpha * 255)}`;
};const convert$1=/*#__PURE__*/Object.freeze({__proto__:null,hexToRgb,hslToRgb,rgbToHex});const getParenNumbers = str => {
	const match = str.match(/\(([^\)]+)\)/g);
	if (match == null || !match.length) { return []; }
	return match[0]
		.substring(1, match[0].length - 1)
		.split(/[\s,]+/)
		.map(parseFloat);
};
const parseColorToRgb = (string) => {
	if (cssColors[string]) { return hexToRgb(cssColors[string]); }
	if (string[0] === "#") { return hexToRgb(string); }
	if (string.substring(0, 4) === "rgba"
		|| string.substring(0, 3) === "rgb") {
		const values = getParenNumbers(string);
		[0, 1, 2]
			.filter(i => values[i] === undefined)
			.forEach(i => { values[i] = 0; });
		return values;
	}
	if (string.substring(0, 4) === "hsla"
		|| string.substring(0, 3) === "hsl") {
		const values = getParenNumbers(string);
		[0, 1, 2]
			.filter(i => values[i] === undefined)
			.forEach(i => { values[i] = 0; });
		return hslToRgb(...values);
	}
	return undefined;
};
const parseColorToHex = (string) => {
	if (cssColors[string]) { return cssColors[string].toUpperCase(); }
	if (string[0] === "#") { return rgbToHex(...hexToRgb(string)); }
	if (string.substring(0, 4) === "rgba"
		|| string.substring(0, 3) === "rgb") {
		return rgbToHex(...getParenNumbers(string));
	}
	if (string.substring(0, 4) === "hsla"
		|| string.substring(0, 3) === "hsl") {
		const values = getParenNumbers(string);
		[0, 1, 2]
			.filter(i => values[i] === undefined)
			.forEach(i => { values[i] = 0; });
		const rgb = hslToRgb(...values);
		if (values.length === 4) { rgb.push(values[3]); }
		return rgbToHex(...rgb);
	}
	return undefined;
};const parseColor=/*#__PURE__*/Object.freeze({__proto__:null,parseColorToHex,parseColorToRgb});const colors = {
	cssColors,
	...convert$1,
	...parseColor,
};const svg_add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
const svg_sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
const svg_scale2 = (a, s) => [a[0] * s, a[1] * s];
const svg_magnitudeSq2 = (a) => (a[0] ** 2) + (a[1] ** 2);
const svg_magnitude2 = (a) => Math.sqrt(svg_magnitudeSq2(a));
const svg_distanceSq2 = (a, b) => svg_magnitudeSq2(svg_sub2(a, b));
const svg_distance2 = (a, b) => Math.sqrt(svg_distanceSq2(a, b));
const svg_polar_to_cart = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];
const svg_multiplyMatrices2 = (m1, m2) => [
	m1[0] * m2[0] + m1[2] * m2[1],
	m1[1] * m2[0] + m1[3] * m2[1],
	m1[0] * m2[2] + m1[2] * m2[3],
	m1[1] * m2[2] + m1[3] * m2[3],
	m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
	m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
];const algebra=/*#__PURE__*/Object.freeze({__proto__:null,svg_add2,svg_distance2,svg_distanceSq2,svg_magnitude2,svg_magnitudeSq2,svg_multiplyMatrices2,svg_polar_to_cart,svg_scale2,svg_sub2});const parseTransform = function (transform) {
	const parsed = transform.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?\s*)+\))+/g);
	if (!parsed) { return []; }
	const listForm = parsed.map(a => a.match(/[\w\.\-]+/g));
	return listForm.map(a => ({
		transform: a.shift(),
		parameters: a.map(p => parseFloat(p)),
	}));
};
const matrixFormTranslate = function (params) {
	switch (params.length) {
	case 1: return [1, 0, 0, 1, params[0], 0];
	case 2: return [1, 0, 0, 1, params[0], params[1]];
	default: console.warn(`improper translate, ${params}`);
	}
	return undefined;
};
const matrixFormRotate = function (params) {
	const cos_p = Math.cos(params[0] / (180 * Math.PI));
	const sin_p = Math.sin(params[0] / (180 * Math.PI));
	switch (params.length) {
	case 1: return [cos_p, sin_p, -sin_p, cos_p, 0, 0];
	case 3: return [cos_p, sin_p, -sin_p, cos_p,
		-params[1] * cos_p + params[2] * sin_p + params[1],
		-params[1] * sin_p - params[2] * cos_p + params[2]];
	default: console.warn(`improper rotate, ${params}`);
	}
	return undefined;
};
const matrixFormScale = function (params) {
	switch (params.length) {
	case 1: return [params[0], 0, 0, params[0], 0, 0];
	case 2: return [params[0], 0, 0, params[1], 0, 0];
	default: console.warn(`improper scale, ${params}`);
	}
	return undefined;
};
const matrixFormSkewX = function (params) {
	return [1, 0, Math.tan(params[0] / (180 * Math.PI)), 1, 0, 0];
};
const matrixFormSkewY = function (params) {
	return [1, Math.tan(params[0] / (180 * Math.PI)), 0, 1, 0, 0];
};
const matrixForm = function (transformType, params) {
	switch (transformType) {
	case "translate": return matrixFormTranslate(params);
	case "rotate": return matrixFormRotate(params);
	case "scale": return matrixFormScale(params);
	case "skewX": return matrixFormSkewX(params);
	case "skewY": return matrixFormSkewY(params);
	case "matrix": return params;
	default: console.warn(`unknown transform type ${transformType}`);
	}
	return undefined;
};
const transformStringToMatrix = function (string) {
	return parseTransform(string)
		.map(el => matrixForm(el.transform, el.parameters))
		.filter(a => a !== undefined)
		.reduce((a, b) => svg_multiplyMatrices2(a, b), [1, 0, 0, 1, 0, 0]);
};const transforms=/*#__PURE__*/Object.freeze({__proto__:null,parseTransform,transformStringToMatrix});const xmlStringToElement = (input, mimeType = "text/xml") => {
	const result = (new (SVGWindow().DOMParser)()).parseFromString(input, mimeType);
	return result ? result.documentElement : null;
};
const getRootParent = (el) => {
	let parent = el;
	while (parent.parentNode != null) {
		parent = parent.parentNode;
	}
	return parent;
};
const findElementTypeInParents = (element, nodeName) => {
	if ((element.nodeName || "") === nodeName) {
		return element;
	}
	return element.parentNode
		? findElementTypeInParents(element.parentNode, nodeName)
		: undefined;
};
const polyfillClassListAdd = (el, ...classes) => {
	const hash = {};
	const getClass = el.getAttribute("class");
	const classArray = getClass ? getClass.split(" ") : [];
	classArray.push(...classes);
	classArray.forEach(str => { hash[str] = true; });
	const classString = Object.keys(hash).join(" ");
	el.setAttribute("class", classString);
};
const addClass = (el, ...classes) => {
	if (!el || !classes.length) { return undefined; }
	return el.classList
		? el.classList.add(...classes)
		: polyfillClassListAdd(el, ...classes);
};
const flattenDomTree = (el) => (
	el.childNodes == null || !el.childNodes.length
		? [el]
		: Array.from(el.childNodes).flatMap(child => flattenDomTree(child))
);
const nodeSpecificAttrs = {
	svg: ["viewBox", "xmlns", "version"],
	line: ["x1", "y1", "x2", "y2"],
	rect: ["x", "y", "width", "height"],
	circle: ["cx", "cy", "r"],
	ellipse: ["cx", "cy", "rx", "ry"],
	polygon: ["points"],
	polyline: ["points"],
	path: ["d"],
};
const getAttributes = element => {
	const attributeValue = element.attributes;
	if (attributeValue == null) { return []; }
	const attributes = Array.from(attributeValue);
	return nodeSpecificAttrs[element.nodeName]
		? attributes
			.filter(a => !nodeSpecificAttrs[element.nodeName].includes(a.name))
		: attributes;
};
const objectifyAttributes = (list) => {
	const obj = {};
	list.forEach((a) => { obj[a.nodeName] = a.value; });
	return obj;
};
const attrAssign = (parentAttrs, element) => {
	const attrs = objectifyAttributes(getAttributes(element));
	if (!attrs.transform && !parentAttrs.transform) {
		return { ...parentAttrs, ...attrs };
	}
	const elemTransform = attrs.transform || "";
	const parentTransform = parentAttrs.transform || "";
	const elemMatrix = transformStringToMatrix(elemTransform);
	const parentMatrix = transformStringToMatrix(parentTransform);
	const matrix = svg_multiplyMatrices2(parentMatrix, elemMatrix);
	const transform = `matrix(${matrix.join(", ")})`;
	return { ...parentAttrs, ...attrs, transform };
};
const flattenDomTreeWithStyle = (element, attributes = {}) => (
	element.childNodes == null || !element.childNodes.length
		? [{ element, attributes }]
		: Array.from(element.childNodes)
			.flatMap(child => flattenDomTreeWithStyle(child, attrAssign(attributes, child)))
);const dom$1=/*#__PURE__*/Object.freeze({__proto__:null,addClass,findElementTypeInParents,flattenDomTree,flattenDomTreeWithStyle,getRootParent,xmlStringToElement});const makeCDATASection = (text) => (new (SVGWindow()).DOMParser())
	.parseFromString("<root></root>", "text/xml")
	.createCDATASection(text);const markerRegEx = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g;
const digitRegEx = /-?[0-9]*\.?\d+/g;
const pathCommandNames = {
	m: "move",
	l: "line",
	v: "vertical",
	h: "horizontal",
	a: "ellipse",
	c: "curve",
	s: "smoothCurve",
	q: "quadCurve",
	t: "smoothQuadCurve",
	z: "close",
};
Object.keys(pathCommandNames).forEach((key) => {
	const s = pathCommandNames[key];
	pathCommandNames[key.toUpperCase()] = s.charAt(0).toUpperCase() + s.slice(1);
});
const add2path = (a, b) => [a[0] + (b[0] || 0), a[1] + (b[1] || 0)];
const getEndpoint = (command, values, offset = [0, 0]) => {
	const upper = command.toUpperCase();
	let origin = command === upper ? [0, 0] : offset;
	if (command === "V") { origin = [offset[0], 0]; }
	if (command === "H") { origin = [0, offset[1]]; }
	switch (upper) {
	case "V": return add2path(origin, [0, values[0]]);
	case "H": return add2path(origin, [values[0], 0]);
	case "M":
	case "L":
	case "T": return add2path(origin, values);
	case "A": return add2path(origin, [values[5], values[6]]);
	case "C": return add2path(origin, [values[4], values[5]]);
	case "S":
	case "Q": return add2path(origin, [values[2], values[3]]);
	case "Z": return undefined;
	default: return origin;
	}
};
const parsePathCommands = (d) => {
	const results = [];
	let match;
	while ((match = markerRegEx.exec(d)) !== null) {
		results.push(match);
	}
	return results
		.map((result, i, arr) => [
			result[0],
			result.index,
			i === arr.length - 1
				? d.length - 1
				: arr[(i + 1) % arr.length].index - 1,
		])
		.map(el => {
			const command = el[0];
			const valueString = d.substring(el[1] + 1, el[2] + 1);
			const strings = valueString.match(digitRegEx);
			const values = strings ? strings.map(parseFloat) : [];
			return { command, values };
		});
};
const parsePathCommandsWithEndpoints = (d) => {
	let pen = [0, 0];
	const commands = parsePathCommands(d);
	if (!commands.length) { return commands; }
	commands.forEach((command, i) => {
		commands[i].end = getEndpoint(command.command, command.values, pen);
		commands[i].start = i === 0 ? pen : commands[i - 1].end;
		pen = commands[i].end;
	});
	const last = commands[commands.length - 1];
	const firstDrawCommand = commands
		.filter(el => el.command.toUpperCase() !== "M"
			&& el.command.toUpperCase() !== "Z")
		.shift();
	if (last.command.toUpperCase() === "Z") {
		last.end = [...firstDrawCommand.start];
	}
	return commands;
};const path=/*#__PURE__*/Object.freeze({__proto__:null,parsePathCommands,parsePathCommandsWithEndpoints,pathCommandNames});const makeCoordinates = (...args) => args
	.filter(a => typeof a === str_number)
	.concat(args
		.filter(a => typeof a === str_object && a !== null)
		.map((el) => {
			if (typeof el.x === str_number) { return [el.x, el.y]; }
			if (typeof el[0] === str_number) { return [el[0], el[1]]; }
			return undefined;
		}).filter(a => a !== undefined)
		.reduce((a, b) => a.concat(b), []));const viewBoxValuesToString = function (x, y, width, height, padding = 0) {
	const scale = 1.0;
	const d = (width / scale) - width;
	const X = (x - d) - padding;
	const Y = (y - d) - padding;
	const W = (width + d * 2) + padding * 2;
	const H = (height + d * 2) + padding * 2;
	return [X, Y, W, H].join(" ");
};
const makeViewBox = (...args) => {
	const numbers = makeCoordinates(...args.flat());
	if (numbers.length === 2) { numbers.unshift(0, 0); }
	return numbers.length === 4 ? viewBoxValuesToString(...numbers) : undefined;
};const setViewBox = (element, ...args) => {
	const viewBox = args.length === 1 && typeof args[0] === str_string
		? args[0]
		: makeViewBox(...args);
	if (viewBox) {
		element.setAttribute(str_viewBox, viewBox);
	}
	return element;
};
const getViewBox$1 = function (element) {
	const vb = element.getAttribute(str_viewBox);
	return (vb == null
		? undefined
		: vb.split(" ").map(n => parseFloat(n)));
};
const convertToViewBox = function (svg, x, y) {
	const pt = svg.createSVGPoint();
	pt.x = x;
	pt.y = y;
	const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
	return [svgPoint.x, svgPoint.y];
};
const foldToViewBox = ({ vertices_coords }) => {
	if (!vertices_coords) { return undefined; }
	const min = [Infinity, Infinity];
	const max = [-Infinity, -Infinity];
	vertices_coords.forEach(coord => [0, 1].forEach(i => {
		min[i] = Math.min(coord[i], min[i]);
		max[i] = Math.max(coord[i], max[i]);
	}));
	return [min[0], min[1], max[0] - min[0], max[1] - min[1]].join(" ");
};const viewBox=/*#__PURE__*/Object.freeze({__proto__:null,convertToViewBox,foldToViewBox,getViewBox:getViewBox$1,setViewBox});const general$2 = {
	...algebra,
	...dom$1,
	makeCDATASection,
	...path,
	...transforms,
	...viewBox,
};const getSVGFrame = function (element) {
	const viewBox = getViewBox$1(element);
	if (viewBox !== undefined) {
		return viewBox;
	}
	if (typeof element.getBoundingClientRect === str_function) {
		const rr = element.getBoundingClientRect();
		return [rr.x, rr.y, rr.width, rr.height];
	}
	return [];
};const bgClass = "svg-background-rectangle";
const makeBackground = function (element, color) {
	let backRect = Array.from(element.childNodes)
		.filter(child => child.getAttribute(str_class) === bgClass)
		.shift();
	if (backRect == null) {
		backRect = SVGWindow().document.createElementNS(NS, "rect");
		getSVGFrame(element).forEach((n, i) => backRect.setAttribute(nodes_attributes.rect[i], n));
		backRect.setAttribute(str_class, bgClass);
		backRect.setAttribute(str_stroke, str_none);
		element.insertBefore(backRect, element.firstChild);
	}
	backRect.setAttribute(str_fill, color);
	return element;
};const getAttr = (element) => {
	const t = element.getAttribute(str_transform);
	return (t == null || t === "") ? undefined : t;
};
const TransformMethods = {
	clearTransform: (el) => { el.removeAttribute(str_transform); return el; },
};
["translate", "rotate", "scale", "matrix"].forEach(key => {
	TransformMethods[key] = (element, ...args) => {
		element.setAttribute(
			str_transform,
			[getAttr(element), `${key}(${args.join(" ")})`]
				.filter(a => a !== undefined)
				.join(" "),
		);
		return element;
	};
});const toCamel$1 = (s) => s
	.replace(/([-_][a-z])/ig, $1 => $1
		.toUpperCase()
		.replace("-", "")
		.replace("_", ""));
const toKebab$1 = (s) => s
	.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
	.replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
	.toLowerCase();
const capitalized$1 = (s) => s
	.charAt(0).toUpperCase() + s.slice(1);const removeChildren = (element) => {
	while (element.lastChild) {
		element.removeChild(element.lastChild);
	}
	return element;
};
const appendTo = (element, parent) => {
	if (parent && parent.appendChild) {
		parent.appendChild(element);
	}
	return element;
};
const setAttributes = (element, attrs) => {
	Object.keys(attrs)
		.forEach(key => element.setAttribute(toKebab$1(key), attrs[key]));
	return element;
};const dom=/*#__PURE__*/Object.freeze({__proto__:null,appendTo,removeChildren,setAttributes});const setPadding = function (element, padding) {
	const viewBox = getViewBox$1(element);
	if (viewBox !== undefined) {
		setViewBox(element, ...[-padding, -padding, padding * 2, padding * 2]
			.map((nudge, i) => viewBox[i] + nudge));
	}
	return element;
};
const findOneElement = function (element, nodeName) {
	const styles = element.getElementsByTagName(nodeName);
	return styles.length ? styles[0] : null;
};
const stylesheet = function (element, textContent) {
	let styleSection = findOneElement(element, str_style);
	if (styleSection == null) {
		styleSection = SVGWindow().document.createElementNS(NS, str_style);
		styleSection.setTextContent = (text) => {
			styleSection.textContent = "";
			styleSection.appendChild(makeCDATASection(text));
			return styleSection;
		};
		element.insertBefore(styleSection, element.firstChild);
	}
	styleSection.textContent = "";
	styleSection.appendChild(makeCDATASection(textContent));
	return styleSection;
};
const clearSVG = (element) => {
	Array.from(element.attributes)
		.filter(attr => attr.name !== "xmlns" && attr.name !== "version")
		.forEach(attr => element.removeAttribute(attr.name));
	return removeChildren(element);
};
const methods$2 = {
	clear: clearSVG,
	size: setViewBox,
	setViewBox,
	getViewBox: getViewBox$1,
	padding: setPadding,
	background: makeBackground,
	getWidth: el => getSVGFrame(el)[2],
	getHeight: el => getSVGFrame(el)[3],
	stylesheet: function (el, text) { return stylesheet.call(this, el, text); },
	...TransformMethods,
	...dom,
};const eventNameCategories = {
	move: ["mousemove", "touchmove"],
	press: ["mousedown", "touchstart"],
	release: ["mouseup", "touchend"],
	leave: ["mouseleave", "touchcancel"],
};
const off = (el, handlers) => Object.values(eventNameCategories)
	.flat()
	.forEach((handlerName) => {
		handlers[handlerName].forEach(func => el
			.removeEventListener(handlerName, func));
		handlers[handlerName] = [];
	});
const defineGetter = (obj, prop, value) => Object
	.defineProperty(obj, prop, {
		get: () => value,
		enumerable: true,
		configurable: true,
	});
const TouchEvents = function (element) {
	const handlers = [];
	Object.keys(eventNameCategories).forEach((key) => {
		eventNameCategories[key].forEach((handler) => {
			handlers[handler] = [];
		});
	});
	const removeHandler = category => eventNameCategories[category]
		.forEach(handlerName => handlers[handlerName]
			.forEach(func => element.removeEventListener(handlerName, func)));
	Object.keys(eventNameCategories).forEach((category) => {
		Object.defineProperty(element, `on${capitalized$1(category)}`, {
			set: (handler) => {
				if (!element.addEventListener) { return; }
				if (handler == null) {
					removeHandler(category);
					return;
				}
				eventNameCategories[category].forEach((handlerName) => {
					const handlerFunc = (e) => {
						const pointer = (e.touches != null ? e.touches[0] : e);
						if (pointer !== undefined) {
							const { clientX, clientY } = pointer;
							const [x, y] = convertToViewBox(element, clientX, clientY);
							defineGetter(e, "x", x);
							defineGetter(e, "y", y);
						}
						handler(e);
					};
					handlers[handlerName].push(handlerFunc);
					element.addEventListener(handlerName, handlerFunc);
				});
			},
			enumerable: true,
		});
	});
	Object.defineProperty(element, "off", { value: () => off(element, handlers) });
};const makeUUID = () => Math.random()
	.toString(36)
	.replace(/[^a-z]+/g, "")
	.concat("aaaaa")
	.substr(0, 5);const Animation = function (element) {
	let start;
	let frame = 0;
	let requestId;
	const handlers = {};
	const stop = () => {
		if (SVGWindow().cancelAnimationFrame) {
			SVGWindow().cancelAnimationFrame(requestId);
		}
		Object.keys(handlers).forEach(uuid => delete handlers[uuid]);
	};
	const play = (handler) => {
		stop();
		if (!handler || !(SVGWindow().requestAnimationFrame)) { return; }
		start = performance.now();
		frame = 0;
		const uuid = makeUUID();
		handlers[uuid] = (now) => {
			const time = (now - start) * 1e-3;
			handler({ time, frame });
			frame += 1;
			if (handlers[uuid]) {
				requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
			}
		};
		requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
	};
	Object.defineProperty(element, "play", { set: play, enumerable: true });
	Object.defineProperty(element, "stop", { value: stop, enumerable: true });
};const removeFromParent = svg => (svg && svg.parentNode
	? svg.parentNode.removeChild(svg)
	: undefined);
const possiblePositionAttributes = [["cx", "cy"], ["x", "y"]];
const controlPoint = function (parent, options = {}) {
	const position = [0, 0];
	const cp = {
		selected: false,
		svg: undefined,
		updatePosition: input => input,
	};
	const updateSVG = () => {
		if (!cp.svg) { return; }
		if (!cp.svg.parentNode) {
			parent.appendChild(cp.svg);
		}
		possiblePositionAttributes
			.filter(coords => cp.svg[coords[0]] != null)
			.forEach(coords => coords.forEach((attr, i) => {
				cp.svg.setAttribute(attr, position[i]);
			}));
	};
	const proxy = new Proxy(position, {
		set: (target, property, value) => {
			target[property] = value;
			updateSVG();
			return true;
		},
	});
	const setPosition = function (...args) {
		makeCoordinates(...args.flat())
			.forEach((n, i) => { position[i] = n; });
		updateSVG();
		if (typeof position.delegate === str_function) {
			position.delegate.apply(position.pointsContainer, [proxy, position.pointsContainer]);
		}
	};
	position.delegate = undefined;
	position.setPosition = setPosition;
	position.onMouseMove = mouse => (cp.selected
		? setPosition(cp.updatePosition(mouse))
		: undefined);
	position.onMouseUp = () => { cp.selected = false; };
	position.distance = mouse => Math.sqrt(svg_distanceSq2(mouse, position));
	["x", "y"].forEach((prop, i) => Object.defineProperty(position, prop, {
		get: () => position[i],
		set: (v) => { position[i] = v; }
	}));
	[str_svg, "updatePosition", "selected"].forEach(key => Object
		.defineProperty(position, key, {
			get: () => cp[key],
			set: (v) => { cp[key] = v; },
		}));
	Object.defineProperty(position, "remove", {
		value: () => {
			removeFromParent(cp.svg);
			position.delegate = undefined;
		},
	});
	return proxy;
};
const controls = function (svg, number, options) {
	let selected;
	let delegate;
	const points = Array.from(Array(number))
		.map(() => controlPoint(svg, options));
	const protocol = point => (typeof delegate === str_function
		? delegate.call(points, point, selected, points)
		: undefined);
	points.forEach((p) => {
		p.delegate = protocol;
		p.pointsContainer = points;
	});
	const mousePressedHandler = function (mouse) {
		if (!(points.length > 0)) { return; }
		selected = points
			.map((p, i) => ({ i, d: svg_distanceSq2(p, [mouse.x, mouse.y]) }))
			.sort((a, b) => a.d - b.d)
			.shift()
			.i;
		points[selected].selected = true;
	};
	const mouseMovedHandler = function (mouse) {
		points.forEach(p => p.onMouseMove(mouse));
	};
	const mouseReleasedHandler = function () {
		points.forEach(p => p.onMouseUp());
		selected = undefined;
	};
	svg.onPress = mousePressedHandler;
	svg.onMove = mouseMovedHandler;
	svg.onRelease = mouseReleasedHandler;
	Object.defineProperty(points, "selectedIndex", { get: () => selected });
	Object.defineProperty(points, "selected", { get: () => points[selected] });
	Object.defineProperty(points, "add", {
		value: (opt) => {
			points.push(controlPoint(svg, opt));
		},
	});
	points.removeAll = () => {
		while (points.length > 0) {
			points.pop().remove();
		}
	};
	const functionalMethods = {
		onChange: (func, runOnceAtStart) => {
			delegate = func;
			if (runOnceAtStart === true) {
				const index = points.length - 1;
				func.call(points, points[index], index, points);
			}
		},
		position: func => points.forEach((p, i) => p.setPosition(func.call(points, p, i, points))),
		svg: func => points.forEach((p, i) => { p.svg = func.call(points, p, i, points); }),
	};
	Object.keys(functionalMethods).forEach((key) => {
		points[key] = function () {
			if (typeof arguments[0] === str_function) {
				functionalMethods[key](...arguments);
			}
			return points;
		};
	});
	points.parent = function (parent) {
		if (parent != null && parent.appendChild != null) {
			points.forEach((p) => { parent.appendChild(p.svg); });
		}
		return points;
	};
	return points;
};
const applyControlsToSVG = (svg) => {
	svg.controls = (...args) => controls.call(svg, svg, ...args);
};const svgDef = {
	svg: {
		args: (...args) => [makeViewBox(makeCoordinates(...args))].filter(a => a != null),
		methods: methods$2,
		init: (...args) => {
			const element = SVGWindow().document.createElementNS(NS, "svg");
			element.setAttribute("version", "1.1");
			element.setAttribute("xmlns", NS);
			args.filter(a => a != null)
				.filter(el => el.appendChild)
				.forEach(parent => parent.appendChild(element));
			TouchEvents(element);
			Animation(element);
			applyControlsToSVG(element);
			return element;
		},
	},
};const findIdURL = function (arg) {
	if (arg == null) { return ""; }
	if (typeof arg === str_string) {
		return arg.slice(0, 3) === "url"
			? arg
			: `url(#${arg})`;
	}
	if (arg.getAttribute != null) {
		const idString = arg.getAttribute(str_id);
		return `url(#${idString})`;
	}
	return "";
};
const methods$1 = {};
["clip-path",
	"mask",
	"symbol",
	"marker-end",
	"marker-mid",
	"marker-start",
].forEach(attr => {
	methods$1[toCamel$1(attr)] = (element, parent) => {
		element.setAttribute(attr, findIdURL(parent));
		return element;
	};
});const gDef = {
	g: {
		methods: {
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const setRadius = (el, r) => {
	el.setAttribute(nodes_attributes.circle[2], r);
	return el;
};
const setOrigin$1 = (el, a, b) => {
	[...makeCoordinates(...[a, b].flat()).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(nodes_attributes.circle[i], value));
	return el;
};
const fromPoints = (a, b, c, d) => [a, b, svg_distance2([a, b], [c, d])];
const circleDef = {
	circle: {
		args: (a, b, c, d) => {
			const coords = makeCoordinates(...[a, b, c, d].flat());
			switch (coords.length) {
			case 0: case 1: return [, , ...coords];
			case 2: case 3: return coords;
			default: return fromPoints(...coords);
			}
		},
		methods: {
			radius: setRadius,
			setRadius,
			origin: setOrigin$1,
			setOrigin: setOrigin$1,
			center: setOrigin$1,
			setCenter: setOrigin$1,
			position: setOrigin$1,
			setPosition: setOrigin$1,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const setRadii = (el, rx, ry) => {
	[, , rx, ry].forEach((value, i) => el.setAttribute(nodes_attributes.ellipse[i], value));
	return el;
};
const setOrigin = (el, a, b) => {
	[...makeCoordinates(...[a, b].flat()).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(nodes_attributes.ellipse[i], value));
	return el;
};
const ellipseDef = {
	ellipse: {
		args: (a, b, c, d) => {
			const coords = makeCoordinates(...[a, b, c, d].flat()).slice(0, 4);
			switch (coords.length) {
			case 0: case 1: case 2: return [, , ...coords];
			default: return coords;
			}
		},
		methods: {
			radius: setRadii,
			setRadius: setRadii,
			origin: setOrigin,
			setOrigin,
			center: setOrigin,
			setCenter: setOrigin,
			position: setOrigin,
			setPosition: setOrigin,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const svgIsIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === str_function;
const svgSemiFlattenArrays = function () {
	switch (arguments.length) {
	case 0: return Array.from(arguments);
	case 1: return svgIsIterable(arguments[0]) && typeof arguments[0] !== str_string
		? svgSemiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (svgIsIterable(a)
			? [...svgSemiFlattenArrays(a)]
			: a));
	}
};const Args$1 = (...args) => makeCoordinates(...svgSemiFlattenArrays(...args)).slice(0, 4);
const setPoints$3 = (element, ...args) => {
	Args$1(...args).forEach((value, i) => element.setAttribute(nodes_attributes.line[i], value));
	return element;
};
const lineDef = {
	line: {
		args: Args$1,
		methods: {
			setPoints: setPoints$3,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const getD = (el) => {
	const attr = el.getAttribute("d");
	return (attr == null) ? "" : attr;
};
const clear = element => {
	element.removeAttribute("d");
	return element;
};
const appendPathCommand = (el, command, ...args) => {
	el.setAttribute("d", `${getD(el)}${command}${args.flat().join(" ")}`);
	return el;
};
const getCommands = element => parsePathCommands(getD(element));
const path_methods = {
	addCommand: appendPathCommand,
	appendCommand: appendPathCommand,
	clear,
	getCommands: getCommands,
	get: getCommands,
	getD: el => el.getAttribute("d"),
	...TransformMethods,
	...methods$1,
	...dom,
};
Object.keys(pathCommandNames).forEach((key) => {
	path_methods[pathCommandNames[key]] = (el, ...args) => appendPathCommand(el, key, ...args);
});
const pathDef = {
	path: {
		methods: path_methods,
	},
};const setRectSize = (el, rx, ry) => {
	[, , rx, ry]
		.forEach((value, i) => el.setAttribute(nodes_attributes.rect[i], value));
	return el;
};
const setRectOrigin = (el, a, b) => {
	[...makeCoordinates(...[a, b].flat()).slice(0, 2)]
		.forEach((value, i) => el.setAttribute(nodes_attributes.rect[i], value));
	return el;
};
const fixNegatives = function (arr) {
	[0, 1].forEach(i => {
		if (arr[2 + i] < 0) {
			if (arr[0 + i] === undefined) { arr[0 + i] = 0; }
			arr[0 + i] += arr[2 + i];
			arr[2 + i] = -arr[2 + i];
		}
	});
	return arr;
};
const rectDef = {
	rect: {
		args: (a, b, c, d) => {
			const coords = makeCoordinates(...[a, b, c, d].flat()).slice(0, 4);
			switch (coords.length) {
			case 0: case 1: case 2: case 3: return fixNegatives([, , ...coords]);
			default: return fixNegatives(coords);
			}
		},
		methods: {
			origin: setRectOrigin,
			setOrigin: setRectOrigin,
			center: setRectOrigin,
			setCenter: setRectOrigin,
			size: setRectSize,
			setSize: setRectSize,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const styleDef = {
	style: {
		init: (text) => {
			const el = SVGWindow().document.createElementNS(NS, "style");
			el.setAttribute("type", "text/css");
			el.textContent = "";
			el.appendChild(makeCDATASection(text));
			return el;
		},
		methods: {
			setTextContent: (el, text) => {
				el.textContent = "";
				el.appendChild(makeCDATASection(text));
				return el;
			},
		},
	},
};const textDef = {
	text: {
		args: (a, b, c) => makeCoordinates(...[a, b, c].flat()).slice(0, 2),
		init: (a, b, c, d) => {
			const element = SVGWindow().document.createElementNS(NS, "text");
			const text = [a, b, c, d].filter(el => typeof el === str_string).shift();
			element.appendChild(SVGWindow().document.createTextNode(text || ""));
			return element;
		},
		methods: {
			...TransformMethods,
			...methods$1,
			appendTo,
			setAttributes,
		},
	},
};const makeIDString = function () {
	return Array.from(arguments)
		.filter(a => typeof a === str_string || a instanceof String)
		.shift() || makeUUID();
};
const maskArgs = (...args) => [makeIDString(...args)];
const maskTypes = {
	mask: {
		args: maskArgs,
		methods: {
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
	clipPath: {
		args: maskArgs,
		methods: {
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
	symbol: {
		args: maskArgs,
		methods: {
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
	marker: {
		args: maskArgs,
		methods: {
			size: setViewBox,
			setViewBox: setViewBox,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const getPoints = (el) => {
	const attr = el.getAttribute(str_points);
	return (attr == null) ? "" : attr;
};
const polyString = function () {
	return Array
		.from(Array(Math.floor(arguments.length / 2)))
		.map((_, i) => `${arguments[i * 2 + 0]},${arguments[i * 2 + 1]}`)
		.join(" ");
};
const stringifyArgs = (...args) => [
	polyString(...makeCoordinates(...svgSemiFlattenArrays(...args))),
];
const setPoints$2 = (element, ...args) => {
	element.setAttribute(str_points, stringifyArgs(...args)[0]);
	return element;
};
const addPoint = (element, ...args) => {
	element.setAttribute(str_points, [getPoints(element), stringifyArgs(...args)[0]]
		.filter(a => a !== "")
		.join(" "));
	return element;
};
const Args = function (...args) {
	return args.length === 1 && typeof args[0] === str_string
		? [args[0]]
		: stringifyArgs(...args);
};
const polyDefs = {
	polyline: {
		args: Args,
		methods: {
			setPoints: setPoints$2,
			addPoint,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
	polygon: {
		args: Args,
		methods: {
			setPoints: setPoints$2,
			addPoint,
			...TransformMethods,
			...methods$1,
			...dom,
		},
	},
};const arcPath = (x, y, radius, startAngle, endAngle, includeCenter = false) => {
	if (endAngle == null) { return ""; }
	const start = svg_polar_to_cart(startAngle, radius);
	const end = svg_polar_to_cart(endAngle, radius);
	const arcVec = [end[0] - start[0], end[1] - start[1]];
	const py = start[0] * end[1] - start[1] * end[0];
	const px = start[0] * end[0] + start[1] * end[1];
	const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
	let d = (includeCenter
		? `M ${x},${y} l ${start[0]},${start[1]} `
		: `M ${x + start[0]},${y + start[1]} `);
	d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
	if (includeCenter) { d += " Z"; }
	return d;
};const arcArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, false)];
const arcDef = {
	arc: {
		nodeName: str_path,
		attributes: ["d"],
		args: arcArguments,
		methods: {
			setArc: (el, ...args) => el.setAttribute("d", arcArguments(...args)),
			...TransformMethods,
		},
	},
};const ends = [str_tail, str_head];
const stringifyPoint = p => p.join(",");
const pointsToPath = (points) => "M" + points.map(pt => pt.join(",")).join("L") + "Z";
const makeArrowPaths = function (options) {
	let pts = [[0,1], [2,3]].map(pt => pt.map(i => options.points[i] || 0));
	let vector = svg_sub2(pts[1], pts[0]);
	let midpoint = svg_add2(pts[0], svg_scale2(vector, 0.5));
	const len = svg_magnitude2(vector);
	const minLength = ends
		.map(s => (options[s].visible
			? (1 + options[s].padding) * options[s].height * 2.5
			: 0))
		.reduce((a, b) => a + b, 0);
	if (len < minLength) {
		const minVec = len === 0 ? [minLength, 0] : svg_scale2(vector, minLength / len);
		pts = [svg_sub2, svg_add2].map(f => f(midpoint, svg_scale2(minVec, 0.5)));
		vector = svg_sub2(pts[1], pts[0]);
	}
	let perpendicular = [vector[1], -vector[0]];
	let bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, options.bend));
	const bezs = pts.map(pt => svg_sub2(bezPoint, pt));
	const bezsLen = bezs.map(v => svg_magnitude2(v));
	const bezsNorm = bezs.map((bez, i) => bezsLen[i] === 0
		? bez
		: svg_scale2(bez, 1 / bezsLen[i]));
	const vectors = bezsNorm.map(norm => svg_scale2(norm, -1));
	const normals = vectors.map(vec => [vec[1], -vec[0]]);
	const pad = ends.map((s, i) => options[s].padding
		? options[s].padding
		: (options.padding ? options.padding : 0.0));
	const scales = ends
		.map((s, i) => options[s].height * (options[s].visible ? 1 : 0))
		.map((n, i) => n + pad[i]);
	const arcs = pts.map((pt, i) => svg_add2(pt, svg_scale2(bezsNorm[i], scales[i])));
	vector = svg_sub2(arcs[1], arcs[0]);
	perpendicular = [vector[1], -vector[0]];
	midpoint = svg_add2(arcs[0], svg_scale2(vector, 0.5));
	bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, options.bend));
	const controls = arcs
		.map((arc, i) => svg_add2(arc, svg_scale2(svg_sub2(bezPoint, arc), options.pinch)));
	const polyPoints = ends.map((s, i) => [
		svg_add2(arcs[i], svg_scale2(vectors[i], options[s].height)),
		svg_add2(arcs[i], svg_scale2(normals[i], options[s].width / 2)),
		svg_add2(arcs[i], svg_scale2(normals[i], -options[s].width / 2)),
	]);
	return {
		line: `M${stringifyPoint(arcs[0])}C${stringifyPoint(controls[0])},${stringifyPoint(controls[1])},${stringifyPoint(arcs[1])}`,
		tail: pointsToPath(polyPoints[0]),
		head: pointsToPath(polyPoints[1]),
	};
};const setArrowheadOptions = (element, options, which) => {
	if (typeof options === str_boolean) {
		element.options[which].visible = options;
	} else if (typeof options === str_object) {
		Object.assign(element.options[which], options);
		if (options.visible == null) {
			element.options[which].visible = true;
		}
	} else if (options == null) {
		element.options[which].visible = true;
	}
};
const setArrowStyle = (element, options = {}, which = str_head) => {
	const path = element.getElementsByClassName(`${str_arrow}-${which}`)[0];
	Object.keys(options)
		.map(key => ({ key, fn: path[toCamel$1(key)] }))
		.filter(el => typeof el.fn === str_function && el.key !== "class")
		.forEach(el => el.fn(options[el.key]));
	Object.keys(options)
		.filter(key => key === "class")
		.forEach(key => path.classList.add(options[key]));
};
const redraw = (element) => {
	const paths = makeArrowPaths(element.options);
	Object.keys(paths)
		.map(path => ({
			path,
			element: element.getElementsByClassName(`${str_arrow}-${path}`)[0],
		}))
		.filter(el => el.element)
		.map(el => { el.element.setAttribute("d", paths[el.path]); return el; })
		.filter(el => element.options[el.path])
		.forEach(el => el.element.setAttribute(
			"visibility",
			element.options[el.path].visible
				? "visible"
				: "hidden",
		));
	return element;
};
const setPoints$1 = (element, ...args) => {
	element.options.points = makeCoordinates(...svgSemiFlattenArrays(...args)).slice(0, 4);
	return redraw(element);
};
const bend$1 = (element, amount) => {
	element.options.bend = amount;
	return redraw(element);
};
const pinch$1 = (element, amount) => {
	element.options.pinch = amount;
	return redraw(element);
};
const padding = (element, amount) => {
	element.options.padding = amount;
	return redraw(element);
};
const head = (element, options) => {
	setArrowheadOptions(element, options, str_head);
	setArrowStyle(element, options, str_head);
	return redraw(element);
};
const tail = (element, options) => {
	setArrowheadOptions(element, options, str_tail);
	setArrowStyle(element, options, str_tail);
	return redraw(element);
};
const getLine = element => element.getElementsByClassName(`${str_arrow}-line`)[0];
const getHead = element => element.getElementsByClassName(`${str_arrow}-${str_head}`)[0];
const getTail = element => element.getElementsByClassName(`${str_arrow}-${str_tail}`)[0];
const ArrowMethods = {
	setPoints: setPoints$1,
	points: setPoints$1,
	bend: bend$1,
	pinch: pinch$1,
	padding,
	head,
	tail,
	getLine,
	getHead,
	getTail,
	...TransformMethods,
};const endOptions = () => ({
	visible: false,
	width: 8,
	height: 10,
	padding: 0.0,
});
const makeArrowOptions = () => ({
	head: endOptions(),
	tail: endOptions(),
	bend: 0.0,
	padding: 0.0,
	pinch: 0.618,
	points: [],
});const arrowKeys = Object.keys(makeArrowOptions());
const matchingOptions = (...args) => {
	for (let a = 0; a < args.length; a += 1) {
		if (typeof args[a] !== str_object) { continue; }
		const keys = Object.keys(args[a]);
		for (let i = 0; i < keys.length; i += 1) {
			if (arrowKeys.includes(keys[i])) {
				return args[a];
			}
		}
	}
	return undefined;
};
const init$1 = function (...args) {
	const element = SVGWindow().document.createElementNS(NS, "g");
	element.setAttribute(str_class, str_arrow);
	const paths = ["line", str_tail, str_head].map(key => {
		const path = SVGWindow().document.createElementNS(NS, str_path);
		path.setAttribute(str_class, `${str_arrow}-${key}`);
		element.appendChild(path);
		return path;
	});
	paths[0].setAttribute(str_style, "fill:none;");
	paths[1].setAttribute(str_stroke, str_none);
	paths[2].setAttribute(str_stroke, str_none);
	element.options = makeArrowOptions();
	ArrowMethods.setPoints(element, ...args);
	const options = matchingOptions(...args);
	if (options) {
		Object.keys(options)
			.filter(key => ArrowMethods[key])
			.forEach(key => ArrowMethods[key](element, options[key]));
	}
	return element;
};const arrowDef = {
	arrow: {
		nodeName: "g",
		attributes: [],
		args: () => [],
		methods: ArrowMethods,
		init: init$1,
	},
};const makeCurvePath = (endpoints = [], bend = 0, pinch = 0.5) => {
	const tailPt = [endpoints[0] || 0, endpoints[1] || 0];
	const headPt = [endpoints[2] || 0, endpoints[3] || 0];
	const vector = svg_sub2(headPt, tailPt);
	const midpoint = svg_add2(tailPt, svg_scale2(vector, 0.5));
	const perpendicular = [vector[1], -vector[0]];
	const bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, bend));
	const tailControl = svg_add2(tailPt, svg_scale2(svg_sub2(bezPoint, tailPt), pinch));
	const headControl = svg_add2(headPt, svg_scale2(svg_sub2(bezPoint, headPt), pinch));
	return `M${tailPt[0]},${tailPt[1]}C${tailControl[0]},${tailControl[1]} ${headControl[0]},${headControl[1]} ${headPt[0]},${headPt[1]}`;
};const curveArguments = (...args) => [
	makeCurvePath(makeCoordinates(...args.flat())),
];const getNumbersFromPathCommand = str => str
	.slice(1)
	.split(/[, ]+/)
	.map(s => parseFloat(s));
const getCurveTos = d => d
	.match(/[Cc][(0-9), .-]+/)
	.map(curve => getNumbersFromPathCommand(curve));
const getMoveTos = d => d
	.match(/[Mm][(0-9), .-]+/)
	.map(curve => getNumbersFromPathCommand(curve));
const getCurveEndpoints = (d) => {
	const move = getMoveTos(d).shift();
	const curve = getCurveTos(d).shift();
	const start = move
		? [move[move.length - 2], move[move.length - 1]]
		: [0, 0];
	const end = curve
		? [curve[curve.length - 2], curve[curve.length - 1]]
		: [0, 0];
	return [...start, ...end];
};const setPoints = (element, ...args) => {
	const coords = makeCoordinates(...args.flat()).slice(0, 4);
	element.setAttribute("d", makeCurvePath(coords, element._bend, element._pinch));
	return element;
};
const bend = (element, amount) => {
	element._bend = amount;
	return setPoints(element, ...getCurveEndpoints(element.getAttribute("d")));
};
const pinch = (element, amount) => {
	element._pinch = amount;
	return setPoints(element, ...getCurveEndpoints(element.getAttribute("d")));
};
const curve_methods = {
	setPoints,
	bend,
	pinch,
	...TransformMethods,
};const curveDef = {
	curve: {
		nodeName: str_path,
		attributes: ["d"],
		args: curveArguments,
		methods: curve_methods,
	},
};const wedgeArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, true)];
const wedgeDef = {
	wedge: {
		nodeName: str_path,
		args: wedgeArguments,
		attributes: ["d"],
		methods: {
			setArc: (el, ...args) => el.setAttribute("d", wedgeArguments(...args)),
			...TransformMethods,
		},
	},
};const lib = {};const init = (graph, ...args) => {
	const g = SVGWindow().document.createElementNS(NS, "g");
	lib.ear.convert.foldToSvg.render(graph, g, ...args);
	return g;
};const methods = {
	...TransformMethods,
	...methods$1,
	...dom,
};const origamiDef = {
	origami: {
		nodeName: "g",
		init,
		args: () => [],
		methods,
	},
};const extensions = {
	...svgDef,
	...gDef,
	...circleDef,
	...ellipseDef,
	...lineDef,
	...pathDef,
	...rectDef,
	...styleDef,
	...textDef,
	...maskTypes,
	...polyDefs,
	...arcDef,
	...arrowDef,
	...curveDef,
	...wedgeDef,
	...origamiDef,
};const passthroughArgs = (...args) => args;
const Constructor = (name, parent, ...initArgs) => {
	const nodeName = extensions[name] && extensions[name].nodeName
		? extensions[name].nodeName
		: name;
	const { init, args, methods } = extensions[name] || {};
	const attributes = nodes_attributes[nodeName] || [];
	const children = nodes_children[nodeName] || [];
	const element = init
		?	init(...initArgs)
		: SVGWindow().document.createElementNS(NS, nodeName);
	if (parent) { parent.appendChild(element); }
	const processArgs = args || passthroughArgs;
	processArgs(...initArgs).forEach((v, i) => {
		element.setAttribute(nodes_attributes[nodeName][i], v);
	});
	if (methods) {
		Object.keys(methods)
			.forEach(methodName => Object.defineProperty(element, methodName, {
				value: function () {
					return methods[methodName](element, ...arguments);
				},
			}));
	}
	attributes.forEach((attribute) => {
		const attrNameCamel = toCamel$1(attribute);
		if (element[attrNameCamel]) { return; }
		Object.defineProperty(element, attrNameCamel, {
			value: function () {
				element.setAttribute(attribute, ...arguments);
				return element;
			},
		});
	});
	children.forEach((childNode) => {
		if (element[childNode]) { return; }
		const value = function () { return Constructor(childNode, element, ...arguments); };
		Object.defineProperty(element, childNode, { value });
	});
	return element;
};const SVG = (...args) => {
	const svg = Constructor(str_svg, null, ...args);
	const initialize = () => args
		.filter(arg => typeof arg === str_function)
		.forEach(func => func.call(svg, svg));
	if (SVGWindow().document.readyState === "loading") {
		SVGWindow().document.addEventListener("DOMContentLoaded", initialize);
	} else {
		initialize();
	}
	return svg;
};
Object.assign(SVG, {
	NS,
	nodes_attributes,
	nodes_children,
	extensions,
	...colors,
	...general$2,
});
nodeNames.forEach(nodeName => {
	SVG[nodeName] = (...args) => Constructor(nodeName, null, ...args);
});
Object.defineProperty(SVG, "window", {
	enumerable: false,
	set: setSVGWindow,
});const boundingBoxToViewBox = (box) => [box.min, box.span]
	.flatMap(p => [p[0], p[1]])
	.join(" ");
const getViewBox = (graph) => {
	const box = boundingBox(graph);
	return box === undefined ? "" : boundingBoxToViewBox(box);
};
const getNthPercentileEdgeLength = (
	{ vertices_coords, edges_vertices, edges_length },
	n = 0.1,
) => {
	if (!vertices_coords || !edges_vertices) {
		return undefined;
	}
	if (!edges_length) {
		edges_length = makeEdgesLength({ vertices_coords, edges_vertices });
	}
	const sortedLengths = edges_length
		.slice()
		.sort((a, b) => a - b);
	const index_tenth_percent = Math.max(
		0,
		Math.min(
			Math.floor(sortedLengths.length * n),
			sortedLengths.length - 1,
		),
	);
	return sortedLengths[index_tenth_percent];
};
const unitBounds$1 = { min: [0, 0], span: [1, 1] };
const DEFAULT_STROKE_WIDTH = 1 / 100;
const getStrokeWidth = (graph, { vmax } = {}) => {
	if (!vmax) {
		const box = boundingBox(graph) || unitBounds$1;
		vmax = Math.max(...box.span);
	}
	const edgeTenthPercent = getNthPercentileEdgeLength(graph, 0.1);
	return edgeTenthPercent
		? edgeTenthPercent * DEFAULT_STROKE_WIDTH * 10
		: vmax * DEFAULT_STROKE_WIDTH;
};const drawVertices = (graph, options = {}) => {
	const attributes = options && options.vertices ? options.vertices : {};
	const g = SVG.g();
	if (!graph || !graph.vertices_coords) { return g; }
	graph.vertices_coords
		.map(v => SVG.circle(v[0], v[1], 0.01))
		.forEach(v => g.appendChild(v));
	g.setAttributeNS(null, "fill", "none");
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};const assignmentColor = {
	B: "black",
	M: "crimson",
	V: "royalblue",
	F: "lightgray",
	J: "gold",
	C: "limegreen",
	U: "orchid",
};
Object.keys(assignmentColor).forEach(key => {
	assignmentColor[key.toLowerCase()] = assignmentColor[key];
});
const DESATURATION_RATIO = 4;
const colorMatchNormalized = {
	M: [1, 0, 0],
	V: [0, 0, 1],
	J: [1, 1, 0],
	U: [1, 0, 1],
	C: [0, 1, 0],
};
const rgbToAssignment = (red = 0, green = 0, blue = 0) => {
	const color = scale3([red, green, blue], 1 / 255);
	const blackDistance = magnitude3(color);
	if (blackDistance < 0.05) { return "B"; }
	const grayscale = color.reduce((a, b) => a + b, 0) / 3;
	const grayDistance = distance3(color, [grayscale, grayscale, grayscale]);
	const nearestColor = Object.keys(colorMatchNormalized)
		.map(key => ({ key, dist: distance3(color, colorMatchNormalized[key]) }))
		.sort((a, b) => a.dist - b.dist)
		.shift();
	if (nearestColor.dist < grayDistance * DESATURATION_RATIO) {
		return nearestColor.key;
	}
	return blackDistance < 0.1 ? "B" : "F";
};const foldColors=/*#__PURE__*/Object.freeze({__proto__:null,assignmentColor,rgbToAssignment});const GROUP_FOLDED = {};
const GROUP_FLAT = { stroke: "black" };
const STYLE_FOLDED = {};
const STYLE_FLAT = {};
Object.keys(assignmentColor).forEach(key => {
	STYLE_FLAT[key] = { stroke: assignmentColor[key] };
});
const setDataValue$1 = (el, key, value) => el.setAttribute(`data-${key}`, value);
const edgesAssignmentIndices = (graph) => {
	const assignment_indices = {
		u: [], c: [], j: [], f: [], v: [], m: [], b: [],
	};
	const lowercase_assignment = graph.edges_assignment
		.map(a => a.toLowerCase());
	graph.edges_vertices
		.map((_, i) => lowercase_assignment[i] || "u")
		.forEach((a, i) => assignment_indices[a].push(i));
	return assignment_indices;
};
const edgesCoords = ({ vertices_coords, edges_vertices }) => {
	if (!vertices_coords || !edges_vertices) { return []; }
	return edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
};
const segmentToPath = s => `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;
const edgesPathData = (graph) => edgesCoords(graph)
	.map(segment => segmentToPath(segment)).join("");
const edgesPathDataAssign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	if (!vertices_coords || !edges_vertices) { return {}; }
	if (!edges_assignment) {
		return ({ u: edgesPathData({ vertices_coords, edges_vertices }) });
	}
	const data = edgesAssignmentIndices({ vertices_coords, edges_vertices, edges_assignment });
	Object.keys(data).forEach(key => {
		data[key] = edgesPathData({
			vertices_coords,
			edges_vertices: data[key].map(i => edges_vertices[i]),
		});
	});
	Object.keys(data).forEach(key => {
		if (data[key] === "") { delete data[key]; }
	});
	return data;
};
const edgesPathsAssign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
	const data = edgesPathDataAssign({ vertices_coords, edges_vertices, edges_assignment });
	Object.keys(data).forEach(assignment => {
		const path = SVG.path(data[assignment]);
		addClass(path, edgesAssignmentNames[assignment]);
		data[assignment] = path;
	});
	return data;
};
const applyEdgesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));
const edgesPaths = (graph, options = {}) => {
	const attributes = options && options.edges ? options.edges : {};
	const group = SVG.g();
	if (!graph) { return group; }
	const isFolded = isFoldedForm(graph);
	const groupStyle = JSON.parse(JSON.stringify(isFolded
		? GROUP_FOLDED
		: GROUP_FLAT));
	const pathStyle = JSON.parse(JSON.stringify(isFolded
		? STYLE_FOLDED
		: STYLE_FLAT));
	const override = {};
	if (attributes.stroke) { override.stroke = attributes.stroke; }
	Object.assign(groupStyle, override);
	Object.keys(pathStyle).forEach(key => {
		pathStyle[key] = { ...pathStyle[key], ...override };
	});
	const paths = edgesPathsAssign(graph);
	Object.keys(paths).forEach(key => {
		addClass(paths[key], edgesAssignmentNames[key]);
		applyEdgesStyle(paths[key], pathStyle[key]);
		applyEdgesStyle(paths[key], attributes[key]);
		applyEdgesStyle(paths[key], attributes[edgesAssignmentNames[key]]);
		group.appendChild(paths[key]);
		Object.defineProperty(group, edgesAssignmentNames[key], { get: () => paths[key] });
	});
	applyEdgesStyle(group, groupStyle);
	Object.keys(paths)
		.forEach(assign => setDataValue$1(paths[assign], "assignment", assign));
	Object.keys(paths)
		.forEach(assign => setDataValue$1(paths[assign], "foldAngle", assignmentFlatFoldAngle[assign]));
	return group;
};
const angleToOpacity = (foldAngle) => (Math.abs(foldAngle) / 180);
const edgesLines = (graph, options = {}) => {
	const attributes = options && options.edges ? options.edges : {};
	const group = SVG.g();
	if (!graph) { return group; }
	const isFolded = isFoldedForm(graph);
	const groupStyle = JSON.parse(JSON.stringify(isFolded
		? GROUP_FOLDED
		: GROUP_FLAT));
	const lineStyle = JSON.parse(JSON.stringify(isFolded
		? STYLE_FOLDED
		: STYLE_FLAT));
	const override = {};
	if (attributes.stroke) { override.stroke = attributes.stroke; }
	Object.assign(groupStyle, override);
	edgesAssignmentValues.forEach(key => {
		if (lineStyle[key] === undefined) { lineStyle[key] = {}; }
		lineStyle[key] = { ...lineStyle[key], ...override };
	});
	const groups_by_key = {};
	Array.from(new Set(edgesAssignmentValues.map(s => s.toLowerCase())))
		.forEach(k => {
			const child_group = SVG.g();
			group.appendChild(child_group);
			addClass(child_group, edgesAssignmentNames[k]);
			applyEdgesStyle(child_group, lineStyle[k]);
			applyEdgesStyle(child_group, attributes[edgesAssignmentNames[k]]);
			Object.defineProperty(group, edgesAssignmentNames[k], {
				get: () => child_group,
			});
			groups_by_key[k] = child_group;
		});
	const lines = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		.map(l => SVG.line(l[0][0], l[0][1], l[1][0], l[1][1]));
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle
			.forEach((angle, i) => setDataValue$1(lines[i], "foldAngle", angle));
	}
	if (graph.edges_assignment) {
		graph.edges_assignment
			.forEach((assign, i) => setDataValue$1(lines[i], "assignment", assign));
	}
	if (graph.edges_foldAngle) {
		lines.forEach((line, i) => {
			const angle = graph.edges_foldAngle[i];
			if (angle === 0 || angle === 180 || angle === -180) { return; }
			line.setAttributeNS(null, "opacity", angleToOpacity(angle));
		});
	}
	const edges_assignment = (graph.edges_assignment
		? graph.edges_assignment
		: makeEdgesAssignment(graph))
		.map(assign => assign.toLowerCase());
	lines.forEach((line, i) => groups_by_key[edges_assignment[i]]
		.appendChild(line));
	applyEdgesStyle(group, groupStyle);
	return group;
};
const drawEdges = (graph, options) => (
	edgesFoldAngleAreAllFlat(graph)
		? edgesPaths(graph, options)
		: edgesLines(graph, options)
);const makeFacesWindingFromMatrix = faces_matrix => faces_matrix
	.map(m => m[0] * m[4] - m[1] * m[3])
	.map(c => c >= 0);
const makeFacesWindingFromMatrix2 = faces_matrix2 => faces_matrix2
	.map(m => m[0] * m[3] - m[1] * m[2])
	.map(c => c >= 0);
const makeFacesWinding = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(vertices => vertices
		.map(v => vertices_coords[v])
		.map((point, i, arr) => [point, arr[(i + 1) % arr.length]])
		.map(pts => (pts[1][0] - pts[0][0]) * (pts[1][1] + pts[0][1]))
		.reduce((a, b) => a + b, 0))
	.map(face => face < 0);const facesWinding=/*#__PURE__*/Object.freeze({__proto__:null,makeFacesWinding,makeFacesWindingFromMatrix,makeFacesWindingFromMatrix2});const topologicalSort = (directedEdges) => {
	const vertices = uniqueSortedNumbers(directedEdges.flat());
	const verticesParents = [];
	vertices.forEach(v => { verticesParents[v] = []; });
	directedEdges.forEach(edge => { verticesParents[edge[1]].push(edge[0]); });
	const ordering = [];
	const visited = {};
	const recurse = (vertex) => {
		if (visited[vertex]) { return; }
		visited[vertex] = true;
		verticesParents[vertex].forEach(recurse);
		ordering.push(vertex);
	};
	vertices.forEach(recurse);
	return ordering;
};const directedGraph=/*#__PURE__*/Object.freeze({__proto__:null,topologicalSort});const faceOrdersSubset = (faceOrders, faces) => {
	const facesHash = {};
	faces.forEach(f => { facesHash[f] = true; });
	return faceOrders
		.filter(order => facesHash[order[0]] && facesHash[order[1]]);
};
const linearizeFaceOrders = ({ faceOrders, faces_normal }, rootFace) => {
	if (!faceOrders || !faceOrders.length) { return []; }
	if (!faces_normal) {
		throw new Error("linearizeFaceOrders: faces_normal required");
	}
	const faces = uniqueSortedNumbers(faceOrders
		.flatMap(order => [order[0], order[1]]));
	const normal = rootFace !== undefined && faces.includes(rootFace)
		? faces_normal[rootFace]
		: faces_normal[faces[0]];
	const facesNormalMatch = [];
	faces.forEach(f => {
		facesNormalMatch[f] = dot(faces_normal[f], normal) > 0;
	});
	const directedEdges = faceOrders
		.map(order => ((order[2] === -1) ^ (!facesNormalMatch[order[1]])
			? [order[0], order[1]]
			: [order[1], order[0]]));
	return topologicalSort(directedEdges);
};
const fillInMissingFaces = ({ faces_vertices }, faces_layer) => {
	if (!faces_vertices) { return faces_layer; }
	const missingFaces = faces_vertices
		.map((_, i) => i)
		.filter(i => faces_layer[i] == null);
	return missingFaces.concat(invertMap(faces_layer));
};
const linearize2DFaces = ({
	vertices_coords, faces_vertices, faceOrders, faces_layer, faces_normal,
}, rootFace) => {
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	if (faceOrders) {
		return fillInMissingFaces(
			{ faces_vertices },
			invertMap(linearizeFaceOrders({ faceOrders, faces_normal }, rootFace)),
		);
	}
	if (faces_layer) {
		return fillInMissingFaces({ faces_vertices }, faces_layer);
	}
	return faces_vertices.map((_, i) => i).filter(() => true);
};
const nudgeFacesWithFaceOrders = ({
	vertices_coords, faces_vertices, faceOrders, faces_normal,
}) => {
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	const faces_sets = connectedComponents(makeVerticesVerticesUnsorted({
		edges_vertices: faceOrders.map(ord => [ord[0], ord[1]]),
	}));
	const sets_faces = invertArrayMap(faces_sets);
	const sets_layers_face = sets_faces
		.map(faces => faceOrdersSubset(faceOrders, faces))
		.map(orders => linearizeFaceOrders({ faceOrders: orders, faces_normal }));
	const sets_normals = sets_faces.map(faces => faces_normal[faces[0]]);
	const faces_nudge = [];
	sets_layers_face.forEach((set, i) => set.forEach((face, index) => {
		faces_nudge[face] = {
			vector: sets_normals[i],
			layer: index,
		};
	}));
	return faces_nudge;
};
const nudgeFacesWithFacesLayer = ({ faces_layer }) => {
	const faces_nudge = [];
	const layers_face = invertMap(faces_layer);
	layers_face.forEach((face, layer) => {
		faces_nudge[face] = {
			vector: [0, 0, 1],
			layer,
		};
	});
	return faces_nudge;
};
const makeFacesLayer = ({ vertices_coords, faces_vertices, faceOrders, faces_normal }) => {
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	return invertMap(linearizeFaceOrders({ faceOrders, faces_normal }));
};const orders=/*#__PURE__*/Object.freeze({__proto__:null,faceOrdersSubset,linearize2DFaces,linearizeFaceOrders,makeFacesLayer,nudgeFacesWithFaceOrders,nudgeFacesWithFacesLayer});const FACE_STYLE_FOLDED_ORDERED = {
	back: { fill: "white" },
	front: { fill: "#ddd" },
};
const FACE_STYLE_FOLDED_UNORDERED = {
	back: { opacity: 0.1 },
	front: { opacity: 0.1 },
};
const FACE_STYLE_FLAT = {
};
const GROUP_STYLE_FOLDED_ORDERED = {
	stroke: "black",
	"stroke-linejoin": "bevel",
};
const GROUP_STYLE_FOLDED_UNORDERED = {
	stroke: "none",
	fill: "black",
	"stroke-linejoin": "bevel",
};
const GROUP_STYLE_FLAT = {
	fill: "none",
};
const setDataValue = (el, key, value) => el.setAttribute(`data-${key}`, value);
const applyFacesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));
const finalize_faces = (graph, svg_faces, group, options = {}) => {
	const attributes = options && options.faces ? options.faces : {};
	const isFolded = isFoldedForm(graph);
	const orderIsCertain = !!(graph.faceOrders || graph.faces_layer);
	const classNames = [["front"], ["back"]];
	const faces_winding = makeFacesWinding(graph);
	faces_winding.map(w => (w ? classNames[0] : classNames[1]))
		.forEach((className, i) => {
			addClass(svg_faces[i], className);
			setDataValue(svg_faces[i], "side", className);
			applyFacesStyle(svg_faces[i], (isFolded
				? (orderIsCertain
					? FACE_STYLE_FOLDED_ORDERED[className]
					: FACE_STYLE_FOLDED_UNORDERED[className])
				: FACE_STYLE_FLAT[className]));
			applyFacesStyle(svg_faces[i], attributes[className]);
		});
	linearize2DFaces(graph).forEach(f => group.appendChild(svg_faces[f]));
	Object.defineProperty(group, "front", {
		get: () => svg_faces.filter((_, i) => faces_winding[i]),
	});
	Object.defineProperty(group, "back", {
		get: () => svg_faces.filter((_, i) => !faces_winding[i]),
	});
	applyFacesStyle(group, (isFolded
		? (orderIsCertain
			? GROUP_STYLE_FOLDED_ORDERED
			: GROUP_STYLE_FOLDED_UNORDERED)
		: GROUP_STYLE_FLAT));
	return group;
};
const facesVerticesPolygon = (graph, options) => {
	const g = SVG.g();
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return g; }
	const svg_faces = graph.faces_vertices
		.map(fv => fv.map(v => [0, 1].map(i => graph.vertices_coords[v][i])))
		.map(face => SVG.polygon(face));
	svg_faces.forEach((face, i) => face.setAttributeNS(null, "index", i));
	g.setAttributeNS(null, "fill", "white");
	return finalize_faces(graph, svg_faces, g, options);
};
const facesEdgesPolygon = function (graph, options) {
	const g = SVG.g();
	if (!graph
		|| "faces_edges" in graph === false
		|| "edges_vertices" in graph === false
		|| "vertices_coords" in graph === false) {
		return g;
	}
	const svg_faces = graph["faces_edges"]
		.map(face_edges => face_edges
			.map(edge => graph["edges_vertices"][edge])
			.map((vi, i, arr) => {
				const next = arr[(i + 1) % arr.length];
				return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
			}).map(v => [0, 1].map(i => graph["vertices_coords"][v][i])))
		.map(face => SVG.polygon(face));
	svg_faces.forEach((face, i) => face.setAttributeNS(null, "index", i));
	g.setAttributeNS(null, "fill", "white");
	return finalize_faces(graph, svg_faces, g, options);
};
const drawFaces = (graph, options) => {
	if (graph && graph["faces_vertices"]) {
		return facesVerticesPolygon(graph, options);
	}
	if (graph && graph["faces_edges"]) {
		return facesEdgesPolygon(graph, options);
	}
	return SVG.g();
};const FOLDED = {
	fill: "none",
};
const FLAT = {
	stroke: "black",
	fill: "white",
};
const applyBoundariesStyle = (el, attributes = {}) => Object.keys(attributes)
	.forEach(key => el.setAttributeNS(null, key, attributes[key]));
const drawBoundaries = (graph, options = {}) => {
	const attributes = options && options.boundaries ? options.boundaries : {};
	const g = SVG.g();
	if (!graph) { return g; }
	const polygon = boundary(graph).polygon;
	if (!polygon.length) { return g; }
	const svgPolygon = SVG.polygon(polygon);
	addClass(svgPolygon, "boundary");
	g.appendChild(svgPolygon);
	applyBoundariesStyle(g, isFoldedForm(graph) ? FOLDED : FLAT);
	Object.keys(attributes)
		.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
	return g;
};const draw = {
	vertices: drawVertices,
	edges: drawEdges,
	faces: drawFaces,
	boundaries: drawBoundaries,
	edgesPaths,
	edgesLines,
	facesVerticesPolygon,
	facesEdgesPolygon,
};const DEFAULT_CIRCLE_RADIUS = 1 / 50;
const unitBounds = { min: [0, 0], span: [1, 1] };
const groupNames = ["boundaries", "faces", "edges", "vertices"];
const setR = (group, radius) => {
	for (let i = 0; i < group.childNodes.length; i += 1) {
		group.childNodes[i].setAttributeNS(null, "r", radius);
	}
};
const applyTopLevelOptions = (element, groups, graph, options) => {
	const hasVertices = groups[3] && groups[3].childNodes.length;
	if (!(options.strokeWidth || options.viewBox || hasVertices)) { return; }
	const box = boundingBox(graph) || unitBounds;
	const vmax = Math.max(...box.span);
	const svgElement = findElementTypeInParents(element, "svg");
	if (svgElement && options.viewBox) {
		const viewBoxValue = boundingBoxToViewBox(box);
		svgElement.setAttributeNS(null, "viewBox", viewBoxValue);
	}
	if (svgElement && options.padding) {
		const viewBoxString = svgElement.getAttribute("viewBox");
		if (viewBoxString != null) {
			const pad = options.padding * vmax;
			const viewBox = viewBoxString.split(" ").map(n => parseFloat(n));
			const newViewBox = [-pad, -pad, pad * 2, pad * 2]
				.map((nudge, i) => viewBox[i] + nudge)
				.join(" ");
			svgElement.setAttributeNS(null, "viewBox", newViewBox);
		}
	}
	if (options.strokeWidth || options["stroke-width"]) {
		const strokeWidth = options.strokeWidth
			? options.strokeWidth
			: options["stroke-width"];
		const strokeWidthValue = typeof strokeWidth === "number"
			? vmax * strokeWidth
			: getStrokeWidth(graph);
		element.setAttributeNS(null, "stroke-width", strokeWidthValue);
	}
	if (hasVertices) {
		const userRadius = options.vertices && options.vertices.radius != null
			? options.vertices.radius
			: options.radius;
		const radius = typeof userRadius === "string" ? parseFloat(userRadius) : userRadius;
		const r = typeof radius === "number" && !Number.isNaN(radius)
			? vmax * radius
			: vmax * DEFAULT_CIRCLE_RADIUS;
		setR(groups[3], r);
	}
};
const DrawGroups = (graph, options = {}) => groupNames
	.map(key => (options[key] === false ? (SVG.g()) : draw[key](graph, options)))
	.map((group, i) => {
		addClass(group, groupNames[i]);
		return group;
	});
const render = (graph, element, options = {}) => {
	if (!isFoldedForm(graph)) {
		if (options.faces === undefined) {
			options.faces = false;
		}
	}
	const groups = DrawGroups(graph, options);
	groups.filter(group => group.childNodes.length > 0)
		.forEach(group => element.appendChild(group));
	applyTopLevelOptions(element, groups, graph, options);
	addClass(
		element,
		...[graph.file_classes || [], graph.frame_classes || []].flat(),
	);
	return element;
};const foldToSvg = (file, options = {}) => {
	const element = render(
		typeof file === "string" ? JSON.parse(file) : file,
		SVG.svg(),
		{
			viewBox: true,
			strokeWidth: true,
			...options,
		},
	);
	return options && options.string
		? (new (RabbitEarWindow().XMLSerializer)()).serializeToString(element)
		: element;
};
Object.assign(foldToSvg, {
	...draw,
	render,
	getViewBox,
	getStrokeWidth,
	boundingBoxToViewBox,
});const getMetadata = (graph) => {
	const metadata = [
		"file_title",
		"file_author",
		"file_description",
		"frame_title",
		"frame_author",
		"frame_description",
	];
	return metadata
		.filter(key => graph[key])
		.map(key => `# ${key.split("_")[1]}: ${graph[key]}`)
		.join("\n");
};
const foldToObj = (file) => {
	const graph = typeof file === "string" ? JSON.parse(file) : file;
	const metadata = getMetadata(graph);
	const vertices = (graph.vertices_coords || [])
		.map(coords => coords.join(" "))
		.map(str => `v ${str}`)
		.join("\n");
	const faces = (graph.faces_vertices || [])
		.map(verts => verts.map(v => v + 1).join(" "))
		.map(str => `f ${str}`)
		.join("\n");
	const fileString = [metadata, vertices, faces]
		.filter(s => s !== "")
		.join("\n");
	return `${fileString}\n`;
};const Graph = {};
Graph.prototype = Object.create(Object.prototype);
Graph.prototype.constructor = Graph;
Object.entries({
	clean,
	validate,
	populate,
	subgraph,
	boundary,
	boundingBox,
	nearest,
	splitEdge,
	splitFace,
	invertAssignments,
	svg: foldToSvg,
	obj: foldToObj,
	...explodeMethods,
	...transform$1,
}).forEach(([key, value]) => {
	Graph.prototype[key] = function () {
		return value(this, ...arguments);
	};
});
Graph.prototype.clone = function () {
	return Object.assign(Object.create(Object.getPrototypeOf(this)), clone(this));
};
Graph.prototype.folded = function () {
	const vertices_coords = this.faces_matrix2
		? multiplyVerticesFacesMatrix2(this, this.faces_matrix2)
		: makeVerticesCoordsFolded(this, ...arguments);
	return {
		...this,
		vertices_coords,
		frame_classes: ["foldedForm"],
	};
};
Graph.prototype.flatFolded = function () {
	const vertices_coords = this.faces_matrix2
		? multiplyVerticesFacesMatrix2(this, this.faces_matrix2)
		: makeVerticesCoordsFlatFolded(this, ...arguments);
	return {
		...this,
		vertices_coords,
		frame_classes: ["foldedForm"],
	};
};
const setAssignment = (graph, edges, assignment, foldAngle) => {
	edges.forEach(edge => {
		graph.edges_assignment[edge] = assignment;
		graph.edges_foldAngle[edge] = foldAngle;
	});
	return edges;
};
Graph.prototype.setValley = function (edges = [], degrees = 180) {
	return setAssignment(this, edges, "V", Math.abs(degrees));
};
Graph.prototype.setMountain = function (edges = [], degrees = -180) {
	return setAssignment(this, edges, "M", -Math.abs(degrees));
};
Graph.prototype.setFlat = function (edges = []) {
	return setAssignment(this, edges, "F", 0);
};
Graph.prototype.setUnassigned = function (edges = []) {
	return setAssignment(this, edges, "U", 0);
};
Graph.prototype.setCut = function (edges = []) {
	return setAssignment(this, edges, "C", 0);
};
const graphProto = Graph.prototype;const lineLineParameter = (
	lineVector,
	lineOrigin,
	polyVector,
	polyOrigin,
	polyLineFunc = includeS,
	epsilon = EPSILON,
) => {
	const det_norm = cross2(normalize2(lineVector), normalize2(polyVector));
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(lineVector, polyVector);
	const determinant1 = -determinant0;
	const a2b = subtract2(polyOrigin, lineOrigin);
	const b2a = flip(a2b);
	const t0 = cross2(a2b, polyVector) / determinant0;
	const t1 = cross2(b2a, lineVector) / determinant1;
	if (polyLineFunc(t1, epsilon / magnitude2(polyVector))) {
		return t0;
	}
	return undefined;
};
const linePointFromParameter = (vector, origin, t) => (
	add2(origin, scale2(vector, t))
);
const getIntersectParameters = (poly, vector, origin, polyLineFunc, epsilon) => poly
	.map((p, i, arr) => [subtract2(arr[(i + 1) % arr.length], p), p])
	.map(side => lineLineParameter(
		vector,
		origin,
		side[0],
		side[1],
		polyLineFunc,
		epsilon,
	))
	.filter(a => a !== undefined)
	.sort((a, b) => a - b);
const getMinMax = (numbers, func, scaled_epsilon) => {
	let a = 0;
	let b = numbers.length - 1;
	while (a < b) {
		if (func(numbers[a + 1] - numbers[a], scaled_epsilon)) { break; }
		a += 1;
	}
	while (b > a) {
		if (func(numbers[b] - numbers[b - 1], scaled_epsilon)) { break; }
		b -= 1;
	}
	if (a >= b) { return undefined; }
	return [numbers[a], numbers[b]];
};
const clipLineConvexPolygon = (
	poly,
	{ vector, origin },
	fnPoly = include,
	fnLine = includeL,
	epsilon = EPSILON,
) => {
	const numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
	if (numbers.length < 2) { return undefined; }
	const scaled_epsilon = (epsilon * 2) / magnitude2(vector);
	const ends = getMinMax(numbers, fnPoly, scaled_epsilon);
	if (ends === undefined) { return undefined; }
	const clip_fn = (t) => {
		if (fnLine(t)) { return t; }
		return t < 0.5 ? 0 : 1;
	};
	const ends_clip = ends.map(clip_fn);
	if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude2(vector)) {
		return undefined;
	}
	const mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
	return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon)
		? ends_clip.map(t => linePointFromParameter(vector, origin, t))
		: undefined;
};
const clipPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
	const inside = (p, cp1, cp2) => (
		(cp2[0] - cp1[0]) * (p[1] - cp1[1])) > ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon
	);
	const intersection = (cp1, cp2, e, s) => {
		const dc = subtract2(cp1, cp2);
		const dp = subtract2(s, e);
		const n1 = cross2(cp1, cp2);
		const n2 = cross2(s, e);
		const n3 = 1.0 / cross2(dc, dp);
		return scale2(subtract2(scale2(dp, n1), scale2(dc, n2)), n3);
	};
	let outputList = polygon1;
	let cp1 = polygon2[polygon2.length - 1];
	for (let j = 0; j < polygon2.length; j += 1) {
		const cp2 = polygon2[j];
		const inputList = outputList;
		outputList = [];
		let s = inputList[inputList.length - 1];
		for (let i = 0; i < inputList.length; i += 1) {
			const e = inputList[i];
			if (inside(e, cp1, cp2)) {
				if (!inside(s, cp1, cp2)) {
					outputList.push(intersection(cp1, cp2, e, s));
				}
				outputList.push(e);
			} else if (inside(s, cp1, cp2)) {
				outputList.push(intersection(cp1, cp2, e, s));
			}
			s = e;
		}
		cp1 = cp2;
	}
	return outputList.length === 0 ? undefined : outputList;
};const clip$1=/*#__PURE__*/Object.freeze({__proto__:null,clipLineConvexPolygon,clipPolygonPolygon});const joinCollinearSegments = (segments, { vector, origin }, epsilon) => {
	if (segments.length < 2) { return segments; }
	const segmentIsFlipped = segments
		.map(pts => subtract2(pts[1], pts[0]))
		.map(vec => dot2(vec, vector) < epsilon);
	segments
		.map((_, i) => i)
		.filter(i => segmentIsFlipped[i])
		.forEach(i => { segments[i] = [segments[i][1], segments[i][0]]; });
	const normalized = normalize2(vector);
	const segmentsScalars = segments
		.map(pts => pts.map(point => dot2(subtract2(point, origin), normalized)))
		.sort((a, b) => a[0] - b[0]);
	const joined = [
		[segmentsScalars[0][0], segmentsScalars[0][1]],
	];
	for (let i = 1; i < segmentsScalars.length; i += 1) {
		const curr = segmentsScalars[i];
		if ((curr[0] - epsilon) < (joined[joined.length - 1][1] + epsilon)) {
			joined[joined.length - 1][1] = Math.max(curr[1], joined[joined.length - 1][1]);
		} else {
			joined.push([curr]);
		}
	}
	return joined.map(seg => seg.map(s => add2(origin, scale2(normalized, s))));
};const clipAndJoin = (graph, faces, line, func = includeL, epsilon = EPSILON) => {
	const clippings = faces
		.map(f => graph.faces_vertices[f].map(v => graph.vertices_coords[v]))
		.map(poly => clipLineConvexPolygon(poly, line, include, func, epsilon))
		.filter(a => a !== undefined);
	return joinCollinearSegments(clippings, line, epsilon);
};
const clipLine = (graph, line, epsilon = EPSILON) => {
	const faces = getFacesLineOverlap(graph, line, epsilon);
	return clipAndJoin(graph, faces, line, includeL, epsilon);
};
const clipRay = (graph, ray, epsilon = EPSILON) => {
	const faces = getFacesRayOverlap(graph, ray, epsilon);
	return clipAndJoin(graph, faces, ray, includeR, epsilon);
};
const clipSegment = (graph, segment, epsilon = EPSILON) => {
	const vector = subtract2(segment[1], segment[0]);
	const origin = segment[0];
	const faces = getFacesSegmentOverlap(graph, segment, epsilon);
	return clipAndJoin(graph, faces, { vector, origin }, includeS, epsilon);
};const clip=/*#__PURE__*/Object.freeze({__proto__:null,clipLine,clipRay,clipSegment});const getVerticesCollinearToLine = (
	{ vertices_coords },
	{ vector, origin },
	epsilon = EPSILON,
) => {
	const normalizedLineVec = normalize$1(vector);
	const pointIsCollinear = (point) => {
		const originToPoint = subtract(point, origin);
		const mag = magnitude(originToPoint);
		if (Math.abs(mag) < epsilon) { return true; }
		const originToPointUnit = originToPoint.map(n => n / mag);
		const dotprod = Math.abs(dot(originToPointUnit, normalizedLineVec));
		return Math.abs(1.0 - dotprod) < epsilon;
	};
	return vertices_coords
		.map(pointIsCollinear)
		.map((a, i) => ({ a, i }))
		.filter(el => el.a)
		.map(el => el.i);
};const intersectVertices=/*#__PURE__*/Object.freeze({__proto__:null,getVerticesCollinearToLine});const getEdgesCollinearToLine = (
	{ vertices_coords, edges_vertices, vertices_edges },
	{ vector, origin },
	epsilon = EPSILON,
) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const verticesCollinear = getVerticesCollinearToLine(
		{ vertices_coords },
		{ vector, origin },
		epsilon,
	);
	const edgesCollinearCount = edges_vertices.map(() => 0);
	verticesCollinear
		.forEach(vertex => vertices_edges[vertex]
			.forEach(edge => { edgesCollinearCount[edge] += 1; }));
	return edgesCollinearCount
		.map((count, i) => ({ count, i }))
		.filter(el => el.count === 2)
		.map(el => el.i);
};
const getEdgesRectOverlap = (
	{ vertices_coords, edges_vertices },
	{ min, max },
	epsilon = EPSILON,
) => {
	const coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	const boxMin = min.map(n => n - epsilon);
	const boxMax = max.map(n => n + epsilon);
	return edges_vertices
		.map((_, i) => i)
		.filter(e => !(coords[e][0][0] < boxMin[0] && coords[e][1][0] < boxMin[0]))
		.filter(e => !(coords[e][0][0] > boxMax[0] && coords[e][1][0] > boxMax[0]))
		.filter(e => !(coords[e][0][1] < boxMin[1] && coords[e][1][1] < boxMin[1]))
		.filter(e => !(coords[e][0][1] > boxMax[1] && coords[e][1][1] > boxMax[1]));
};
const getEdgesSegmentIntersection = ({
	vertices_coords, edges_vertices,
}, point1, point2, epsilon = EPSILON) => {
	const segmentBox = boundingBox$1([point1, point2]);
	const segmentVector = subtract2(point2, point1);
	const segmentLine = { vector: segmentVector, origin: point1 };
	const edges = getEdgesRectOverlap({ vertices_coords, edges_vertices }, segmentBox, epsilon);
	const intersections = [];
	edges.forEach(e => {
		const edgeCoords = edges_vertices[e].map(v => vertices_coords[v]);
		const edgeVector = subtract2(edgeCoords[1], edgeCoords[0]);
		const edgeLine = { vector: edgeVector, origin: edgeCoords[0] };
		const intersect = intersectLineLine(segmentLine, edgeLine, includeS, includeS, epsilon).point;
		if (!intersect) { return; }
		intersections[e] = intersect;
	});
	return intersections;
};
const getEdgesLineIntersection = ({
	vertices_coords, edges_vertices,
}, { vector, origin }, epsilon = EPSILON, segmentFunc = includeS) => edges_vertices
	.map(vertices => {
		const edgeCoords = vertices.map(v => vertices_coords[v]);
		const edgeVector = subtract2(edgeCoords[1], edgeCoords[0]);
		const edgeLine = { vector: edgeVector, origin: edgeCoords[0] };
		return intersectLineLine(
			edgeLine,
			{ vector, origin },
			segmentFunc,
			includeL,
			epsilon,
		);
	});const intersectEdges=/*#__PURE__*/Object.freeze({__proto__:null,getEdgesCollinearToLine,getEdgesLineIntersection,getEdgesRectOverlap,getEdgesSegmentIntersection});const addVertices = (graph, vertices_coords, epsilon = EPSILON) => {
	if (!graph.vertices_coords) { graph.vertices_coords = []; }
	if (typeof vertices_coords[0] === "number") { vertices_coords = [vertices_coords]; }
	const vertices_equivalent_vertices = vertices_coords
		.map(vertex => graph.vertices_coords
			.map(v => distance(v, vertex) < epsilon)
			.map((on_vertex, i) => (on_vertex ? i : undefined))
			.filter(a => a !== undefined)
			.shift());
	let index = graph.vertices_coords.length;
	const unique_vertices = vertices_coords
		.filter((vert, i) => vertices_equivalent_vertices[i] === undefined);
	graph.vertices_coords.push(...unique_vertices);
	return vertices_equivalent_vertices
		.map(el => (el === undefined ? index++ : el));
};const add_segment_edges = (graph, segment_vertices, pre_edge_map) => {
	const unfiltered_segment_edges_vertices = Array
		.from(Array(segment_vertices.length - 1))
		.map((_, i) => [segment_vertices[i], segment_vertices[i + 1]]);
	const seg_not_exist_yet = unfiltered_segment_edges_vertices
		.map(verts => verts.join(" "))
		.map(str => pre_edge_map[str] === undefined);
	const segment_edges_vertices = unfiltered_segment_edges_vertices
		.filter((_, i) => seg_not_exist_yet[i]);
	const segment_edges = Array
		.from(Array(segment_edges_vertices.length))
		.map((_, i) => graph.edges_vertices.length + i);
	segment_edges.forEach((e, i) => {
		graph.edges_vertices[e] = segment_edges_vertices[i];
	});
	if (graph.edges_assignment) {
		segment_edges.forEach(e => { graph.edges_assignment[e] = "U"; });
	}
	if (graph.edges_foldAngle) {
		segment_edges.forEach(e => { graph.edges_foldAngle[e] = 0; });
	}
	for (let i = 0; i < segment_vertices.length; i += 1) {
		const vertex = segment_vertices[i];
		const prev = seg_not_exist_yet[i - 1] ? segment_vertices[i - 1] : undefined;
		const next = seg_not_exist_yet[i] ? segment_vertices[i + 1] : undefined;
		const new_adjacent_vertices = [prev, next].filter(a => a !== undefined);
		const previous_vertices_vertices = graph.vertices_vertices[vertex]
			? graph.vertices_vertices[vertex] : [];
		const unsorted_vertices_vertices = previous_vertices_vertices
			.concat(new_adjacent_vertices);
		graph.vertices_vertices[vertex] = sortVerticesCounterClockwise(
			graph,
			unsorted_vertices_vertices,
			segment_vertices[i],
		);
	}
	const edge_map = makeVerticesToEdgeBidirectional(graph);
	for (let i = 0; i < segment_vertices.length; i += 1) {
		const vertex = segment_vertices[i];
		graph.vertices_edges[vertex] = graph.vertices_vertices[vertex]
			.map(v => edge_map[`${vertex} ${v}`]);
	}
	segment_vertices
		.map(center => (graph.vertices_vertices[center].length === 1
			? [TWO_PI]
			: counterClockwiseSectors2(graph.vertices_vertices[center]
				.map(v => subtract2(
					graph.vertices_coords[v],
					graph.vertices_coords[center],
				)))))
		.forEach((sectors, i) => {
			graph.vertices_sectors[segment_vertices[i]] = sectors;
		});
	return segment_edges;
};
const addPlanarSegment = (graph, point1, point2, epsilon = EPSILON) => {
	if (!graph.vertices_sectors) {
		graph.vertices_sectors = makeVerticesSectors(graph);
	}
	const segment = [point1, point2].map(p => [p[0], p[1]]);
	const segment_vector = subtract2(segment[1], segment[0]);
	const intersections = getEdgesSegmentIntersection(
		graph,
		segment[0],
		segment[1],
		epsilon,
	);
	const intersected_edges = intersections.map((_, e) => e).filter(includeL);
	const faces_map = {};
	intersected_edges
		.forEach(e => graph.edges_faces[e]
			.forEach(f => { faces_map[f] = true; }));
	const intersected_faces = Object.keys(faces_map)
		.map(s => parseInt(s, 10))
		.sort((a, b) => a - b);
	const splitEdge_results = intersected_edges
		.reverse()
		.map(edge => splitEdge(graph, edge, intersections[edge], epsilon));
	const splitEdge_vertices = splitEdge_results.map(el => el.vertex);
	const endpoint_vertices = addVertices(graph, segment, epsilon);
	const new_vertex_hash = {};
	splitEdge_vertices.forEach(v => { new_vertex_hash[v] = true; });
	endpoint_vertices.forEach(v => { new_vertex_hash[v] = true; });
	const new_vertices = Object.keys(new_vertex_hash).map(n => parseInt(n, 10));
	const segment_vertices = sortVerticesAlongVector(graph, new_vertices, segment_vector);
	const edge_map = makeVerticesToEdgeBidirectional(graph);
	const segment_edges = add_segment_edges(graph, segment_vertices, edge_map);
	segment_edges.forEach(e => {
		const v = graph.edges_vertices[e];
		edge_map[`${v[0]} ${v[1]}`] = e;
		edge_map[`${v[1]} ${v[0]}`] = e;
	});
	const face_walk_start_pairs = segment_vertices
		.map(v => graph.vertices_vertices[v]
			.map(adj_v => [[adj_v, v], [v, adj_v]]))
		.reduce((a, b) => a.concat(b), [])
		.reduce((a, b) => a.concat(b), []);
	const walked_edges = {};
	const all_walked_faces = face_walk_start_pairs
		.map(pair => counterClockwiseWalk(graph, pair[0], pair[1], walked_edges))
		.filter(a => a !== undefined);
	const walked_faces = filterWalkedBoundaryFace(all_walked_faces);
	removeGeometryIndices(graph, "faces", intersected_faces);
	const new_faces = walked_faces
		.map((_, i) => graph.faces_vertices.length + i);
	if (graph.faces_vertices) {
		new_faces.forEach((f, i) => {
			graph.faces_vertices[f] = walked_faces[i].vertices;
		});
	}
	if (graph.faces_edges) {
		new_faces.forEach((f, i) => {
			graph.faces_edges[f] = walked_faces[i].edges
				.map(pair => edge_map[pair]);
		});
	}
	if (graph.faces_angles) {
		new_faces.forEach((f, i) => {
			graph.faces_angles[f] = walked_faces[i].faces_angles;
		});
	}
	if (graph.vertices_faces) {
		graph.vertices_faces = makeVerticesFaces(graph);
	}
	if (graph.edges_faces) {
		graph.edges_faces = makeEdgesFacesUnsorted(graph);
	}
	if (graph.faces_faces) {
		graph.faces_faces = makeFacesFaces(graph);
	}
	if (graph.vertices_coords.length !== graph.vertices_vertices.length
		|| graph.vertices_coords.length !== graph.vertices_edges.length
		|| graph.vertices_coords.length !== graph.vertices_faces.length) {
		console.warn("vertices mismatch", JSON.parse(JSON.stringify(graph)));
	}
	if (graph.edges_vertices.length !== graph.edges_faces.length
		|| graph.edges_vertices.length !== graph.edges_assignment.length) {
		console.warn("edges mismatch", JSON.parse(JSON.stringify(graph)));
	}
	if (graph.faces_vertices.length !== graph.faces_edges.length
		|| graph.faces_vertices.length !== graph.faces_faces.length) {
		console.warn("faces mismatch", JSON.parse(JSON.stringify(graph)));
	}
	return segment_edges;
};const update_vertices_vertices = ({ vertices_vertices }, vertices) => {
	const other = [vertices[1], vertices[0]];
	vertices
		.map((v, i) => vertices_vertices[v].indexOf(other[i]))
		.forEach((index, i) => vertices_vertices[vertices[i]].splice(index, 1));
};
const update_vertices_edges = ({ vertices_edges }, edge, vertices) => {
	vertices
		.map((v, i) => vertices_edges[v].indexOf(edge))
		.forEach((index, i) => vertices_edges[vertices[i]].splice(index, 1));
};
const join_faces = (graph, faces, edge, vertices) => {
	const faces_edge_index = faces
		.map(f => graph.faces_edges[f].indexOf(edge));
	const faces_vertices_index = [];
	faces.forEach((face, f) => graph.faces_vertices[face]
		.forEach((v, i, arr) => {
			const next = arr[(i + 1) % arr.length];
			if ((v === vertices[0] && next === vertices[1])
				|| (v === vertices[1] && next === vertices[0])) {
				faces_vertices_index[f] = i;
			}
		}));
	if (faces_vertices_index[0] === undefined || faces_vertices_index[1] === undefined) { console.warn("removePlanarEdge error joining faces"); }
	const edges_len_before = faces
		.map(f => graph.faces_edges[f].length);
	const vertices_len_before = faces
		.map(f => graph.faces_vertices[f].length);
	const edges_len_after = edges_len_before.map(len => len - 1);
	const vertices_len_after = vertices_len_before.map(len => len - 1);
	const faces_edge_keep = faces_edge_index
		.map((e, i) => (e + 1) % edges_len_before[i]);
	const faces_vertex_keep = faces_vertices_index
		.map((v, i) => (v + 1) % vertices_len_before[i]);
	const new_faces_edges = faces
		.map((face, f) => Array.from(Array(edges_len_after[f]))
			.map((_, i) => (faces_edge_keep[f] + i) % edges_len_before[f])
			.map(index => graph.faces_edges[face][index]));
	const new_faces_vertices = faces
		.map((face, f) => Array.from(Array(vertices_len_after[f]))
			.map((_, i) => (faces_vertex_keep[f] + i) % vertices_len_before[f])
			.map(index => graph.faces_vertices[face][index]));
	const new_faces_faces = faces
		.map(f => graph.faces_faces[f])
		.reduce((a, b) => a.concat(b), [])
		.filter(f => f !== faces[0] && f !== faces[1]);
	return {
		vertices: new_faces_vertices[0].concat(new_faces_vertices[1]),
		edges: new_faces_edges[0].concat(new_faces_edges[1]),
		faces: new_faces_faces,
	};
};
const removePlanarEdge = (graph, edge) => {
	const vertices = [...graph.edges_vertices[edge]]
		.sort((a, b) => b - a);
	const faces = [...graph.edges_faces[edge]];
	update_vertices_vertices(graph, vertices);
	update_vertices_edges(graph, edge, vertices);
	const vertices_should_remove = vertices
		.map(v => graph.vertices_vertices[v].length === 0);
	const remove_vertices = vertices
		.filter((vertex, i) => vertices_should_remove[i]);
	if (faces.length === 2 && faces[0] !== faces[1]) {
		const new_face = graph.faces_vertices.length;
		const new_face_data = join_faces(graph, faces, edge, vertices);
		graph.faces_vertices.push(new_face_data.vertices);
		graph.faces_edges.push(new_face_data.edges);
		graph.faces_faces.push(new_face_data.faces);
		graph.vertices_faces.forEach((arr, i) => {
			let already_added = false;
			arr.forEach((face, j) => {
				if (face === faces[0] || face === faces[1]) {
					graph.vertices_faces[i][j] = new_face;
					const params = already_added ? [i, 1] : [i, 1, new_face];
					arr.splice(...params);
					already_added = true;
				}
			});
		});
		graph.edges_faces.forEach((arr, i) => arr.forEach((face, j) => {
			if (face === faces[0] || face === faces[1]) {
				graph.edges_faces[i][j] = new_face;
			}
		}));
		graph.faces_faces.forEach((arr, i) => arr.forEach((face, j) => {
			if (face === faces[0] || face === faces[1]) {
				graph.faces_faces[i][j] = new_face;
			}
		}));
		graph.faces_vertices.forEach(fv => fv.forEach(f => {
			if (f === undefined) {
				console.log("FOUND ONE before remove", graph.faces_vertices);
			}
		}));
		removeGeometryIndices(graph, "faces", faces);
	}
	if (faces.length === 2 && faces[0] === faces[1] && remove_vertices.length) {
		const face = faces[0];
		graph.faces_vertices[face] = graph.faces_vertices[face]
			.filter(v => !remove_vertices.includes(v))
			.filter((v, i, arr) => v !== arr[(i + 1) % arr.length]);
		graph.faces_edges[face] = graph.faces_edges[face]
			.filter(e => e !== edge);
	}
	removeGeometryIndices(graph, "edges", [edge]);
	removeGeometryIndices(graph, "vertices", remove_vertices);
};const removePlanarVertex = (graph, vertex) => {
	const edges = graph.vertices_edges[vertex];
	const faces = uniqueSortedNumbers(graph.vertices_faces[vertex]
		.filter(a => a != null));
	if (edges.length !== 2 || faces.length > 2) {
		console.warn("cannot remove non 2-degree vertex yet (e,f)", edges, faces);
		return;
	}
	const vertices = getOtherVerticesInEdges(graph, vertex, edges);
	const vertices_reverse = vertices.slice().reverse();
	edges.sort((a, b) => a - b);
	vertices.forEach(v => {
		const index = graph.vertices_edges[v].indexOf(edges[1]);
		if (index === -1) { return; }
		graph.vertices_edges[v][index] = edges[0];
	});
	vertices.forEach((v, i) => {
		const index = graph.vertices_vertices[v].indexOf(vertex);
		if (index === -1) {
			console.warn("removePlanarVertex unknown vertex issue");
			return;
		}
		graph.vertices_vertices[v][index] = vertices_reverse[i];
	});
	graph.edges_vertices[edges[0]] = [...vertices];
	faces.forEach(face => {
		const index = graph.faces_vertices[face].indexOf(vertex);
		if (index === -1) {
			console.warn("removePlanarVertex unknown face_vertex issue");
			return;
		}
		graph.faces_vertices[face].splice(index, 1);
	});
	faces.forEach(face => {
		const index = graph.faces_edges[face].indexOf(edges[1]);
		if (index === -1) {
			console.warn("removePlanarVertex unknown face_edge issue");
			return;
		}
		graph.faces_edges[face].splice(index, 1);
	});
	removeGeometryIndices(graph, "vertices", [vertex]);
	removeGeometryIndices(graph, "edges", [edges[1]]);
};const alternatingSum = (numbers) => [0, 1]
	.map(even_odd => numbers
		.filter((_, i) => i % 2 === even_odd)
		.reduce((a, b) => a + b, 0));
const alternatingSumDifference = (sectors) => {
	const halfsum = sectors.reduce((a, b) => a + b, 0) / 2;
	return alternatingSum(sectors).map(s => s - halfsum);
};
const kawasakiSolutionsRadians = (radians) => radians
	.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
	.map(pair => counterClockwiseAngleRadians(...pair))
	.map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
	.map(opposite_sectors => alternatingSum(opposite_sectors).map(s => Math.PI - s))
	.map((kawasakis, i) => radians[i] + kawasakis[0])
	.map((angle, i) => (isCounterClockwiseBetween(
		angle,
		radians[i],
		radians[(i + 1) % radians.length],
	)
		? angle
		: undefined));
const kawasakiSolutionsVectors = (vectors) => {
	const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
	return kawasakiSolutionsRadians(vectors_radians)
		.map(a => (a === undefined
			? undefined
			: [Math.cos(a), Math.sin(a)]));
};
const kawasakiSolutions = ({ vertices_coords, vertices_edges, edges_assignment, edges_vertices }, vertex) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edges = edges_assignment
		? vertices_edges[vertex]
			.filter(e => assignmentCanBeFolded[edges_assignment[e]])
		: vertices_edges[vertex];
	if (edges.length % 2 === 0) { return []; }
	const vert_edges_vertices = edges
		.map(edge => (edges_vertices[edge][0] === vertex
			? edges_vertices[edge]
			: [edges_vertices[edge][1], edges_vertices[edge][0]]));
	const vert_edges_coords = vert_edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]));
	const vert_edges_vector = vert_edges_coords
		.map(coords => subtract2(coords[1], coords[0]));
	const sortedVectors = counterClockwiseOrder2(vert_edges_vector)
		.map(i => vert_edges_vector[i]);
	const result = kawasakiSolutionsVectors(sortedVectors);
	const normals = sortedVectors.map(normalize2);
	const filteredResults = result
		.filter(a => a !== undefined)
		.filter(vector => !normals
			.map(v => dot2(vector, v))
			.map(d => Math.abs(1 - d) < 1e-3)
			.reduce((a, b) => a || b, false));
	return filteredResults;
};const kawasaki=/*#__PURE__*/Object.freeze({__proto__:null,alternatingSum,alternatingSumDifference,kawasakiSolutions,kawasakiSolutionsRadians,kawasakiSolutionsVectors});const getAllFlatVertices = ({ vertices_edges, edges_assignment }) => vertices_edges
	.map(edges => edges
		.map(e => !assignmentCanBeFolded[edges_assignment[e]])
		.reduce((a, b) => a && b, true))
	.map((valid, i) => (valid ? i : undefined))
	.filter(a => a !== undefined);
const validateMaekawa = ({ edges_vertices, vertices_edges, edges_assignment }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const is_valid = vertices_edges
		.map(edges => edges
			.map(e => assignmentFlatFoldAngle[edges_assignment[e]])
			.filter(a => a !== 0)
			.map(Math.sign)
			.reduce((a, b) => a + b, 0))
		.map(sum => sum === 2 || sum === -2);
	boundaryVertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	getAllFlatVertices({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => (!valid ? v : undefined))
		.filter(a => a !== undefined);
};
const validateKawasaki = ({
	vertices_coords,
	vertices_vertices,
	vertices_edges,
	edges_vertices,
	edges_assignment,
}, epsilon = EPSILON) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, vertices_edges, edges_vertices });
	}
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const is_valid = makeVerticesVerticesVector({
		vertices_coords, vertices_vertices, edges_vertices,
	})
		.map((vectors, v) => vectors
			.filter((_, i) => assignmentCanBeFolded[edges_assignment[vertices_edges[v][i]]]))
		.map(vectors => (vectors.length > 1
			? counterClockwiseSectors2(vectors)
			: [0, 0]))
		.map(sectors => alternatingSum(sectors))
		.map(pair => Math.abs(pair[0] - pair[1]) < epsilon);
	boundaryVertices({ edges_vertices, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	getAllFlatVertices({ vertices_edges, edges_assignment })
		.forEach(v => { is_valid[v] = true; });
	return is_valid
		.map((valid, v) => (!valid ? v : undefined))
		.filter(a => a !== undefined);
};const validateSingleVertex=/*#__PURE__*/Object.freeze({__proto__:null,validateKawasaki,validateMaekawa});const CP = {};
CP.prototype = Object.create(graphProto);
CP.prototype.constructor = CP;
const makeEdgesReturnObject = function (edges) {
	edges.valley = (degrees) => this.setValley(edges, degrees);
	edges.mountain = (degrees) => this.setMountain(edges, degrees);
	edges.flat = () => this.setFlat(edges);
	edges.unassigned = () => this.setUnassigned(edges);
	edges.cut = () => this.setCut(edges);
	return edges;
};
CP.prototype.line = function (...args) {
	const primitive = getLine$1(...args);
	if (!primitive) { return undefined; }
	const segments = clipLine(this, primitive);
	const edges = segments
		.flatMap(segment => addPlanarSegment(this, segment[0], segment[1]));
	return makeEdgesReturnObject.call(this, edges);
};
CP.prototype.ray = function (...args) {
	const primitive = getLine$1(...args);
	if (!primitive) { return undefined; }
	const segments = clipRay(this, primitive);
	const edges = segments
		.flatMap(segment => addPlanarSegment(this, segment[0], segment[1]));
	return makeEdgesReturnObject.call(this, edges);
};
CP.prototype.segment = function (...args) {
	const primitive = getSegment(...args);
	if (!primitive) { return undefined; }
	const segments = clipSegment(this, primitive);
	const edges = segments
		.flatMap(segment => addPlanarSegment(this, segment[0], segment[1]));
	return makeEdgesReturnObject.call(this, edges);
};
CP.prototype.polygon = function (...args) {
	const points = getArrayOfVectors(...args);
	if (!points) { return undefined; }
	const polygonSegments = points
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
	const segments = polygonSegments
		.flatMap(segment => clipSegment(this, segment));
	const edges = segments
		.flatMap(segment => addPlanarSegment(this, segment[0], segment[1]));
	return makeEdgesReturnObject.call(this, edges);
};
CP.prototype.removeEdge = function (edge) {
	const vertices = this.edges_vertices[edge];
	removePlanarEdge(this, edge);
	vertices
		.map(v => isVertexCollinear(this, v))
		.map((collinear, i) => (collinear ? vertices[i] : undefined))
		.filter(a => a !== undefined)
		.sort((a, b) => b - a)
		.forEach(v => removePlanarVertex(this, v));
	return true;
};
CP.prototype.validate = function (epsilon) {
	const valid = validate(this, epsilon);
	valid.vertices.kawasaki = validateKawasaki(this, epsilon);
	valid.vertices.maekawa = validateMaekawa(this);
	if (this.edges_foldAngle) {
		valid.edges.not_flat = this.edges_foldAngle
			.map((angle, i) => (edgeFoldAngleIsFlat(angle) ? undefined : i))
			.filter(a => a !== undefined);
	}
	if (valid.summary === "valid") {
		if (valid.vertices.kawasaki.length || valid.vertices.maekawa.length) {
			valid.summary = "invalid";
		} else if (valid.edges.not_flat.length) {
			valid.summary = "not flat";
		}
	}
	return valid;
};
CP.prototype.defer = false;
const cpProto = CP.prototype;const foldFacesLayer = (faces_layer, faces_folding) => {
	const new_faces_layer = [];
	const arr = faces_layer.map((_, i) => i);
	const folding = arr.filter(i => faces_folding[i]);
	const not_folding = arr.filter(i => !faces_folding[i]);
	not_folding
		.sort((a, b) => faces_layer[a] - faces_layer[b])
		.forEach((face, i) => { new_faces_layer[face] = i; });
	folding
		.sort((a, b) => faces_layer[b] - faces_layer[a])
		.forEach((face, i) => { new_faces_layer[face] = not_folding.length + i; });
	return new_faces_layer;
};const getContainingFace = (graph, point, vector, epsilon = EPSILON) => {
	const faces = facesContainingPoint(graph, point);
	if (faces.length === 0) { return undefined; }
	if (faces.length === 1) { return faces[0]; }
	return faces[0];
};
const make_face_side = (vector, origin, face_center, face_winding) => {
	const center_vector = subtract2(face_center, origin);
	const determinant = cross2(vector, center_vector);
	return face_winding ? determinant > 0 : determinant < 0;
};
const make_face_center = (graph, face) => (!graph.faces_vertices[face]
	? [0, 0]
	: graph.faces_vertices[face]
		.map(v => graph.vertices_coords[v])
		.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
		.map(el => el / graph.faces_vertices[face].length));
const unfolded_assignment = {
	F: true, f: true, U: true, u: true,
};
const opposite_lookup = {
	M: "V", m: "V", V: "M", v: "M",
};
const get_opposite_assignment = assign => opposite_lookup[assign] || assign;
const face_snapshot = (graph, face) => ({
	center: graph.faces_center[face],
	matrix: graph.faces_matrix2[face],
	winding: graph.faces_winding[face],
	crease: graph.faces_crease[face],
	side: graph.faces_side[face],
	layer: graph.faces_layer[face],
});
const flatFold = (
	graph,
	{ vector, origin },
	assignment = "V",
	epsilon = EPSILON,
) => {
	const opposite_assignment = get_opposite_assignment(assignment);
	populate(graph);
	if (!graph.faces_layer) {
		graph.faces_layer = Array(graph.faces_vertices.length).fill(0);
	}
	graph.faces_center = graph.faces_vertices
		.map((_, i) => make_face_center(graph, i));
	if (!graph.faces_matrix2) {
		graph.faces_matrix2 = makeFacesMatrix2(
			graph,
			getContainingFace(graph, origin, vector, epsilon),
		);
	}
	graph.faces_winding = makeFacesWindingFromMatrix2(graph.faces_matrix2);
	graph.faces_crease = graph.faces_matrix2
		.map(invertMatrix2)
		.map(matrix => multiplyMatrix2Line2(matrix, vector, origin));
	graph.faces_side = graph.faces_vertices
		.map((_, i) => make_face_side(
			graph.faces_crease[i].vector,
			graph.faces_crease[i].origin,
			graph.faces_center[i],
			graph.faces_winding[i],
		));
	const vertices_coords_folded = multiplyVerticesFacesMatrix2(
		graph,
		graph.faces_matrix2,
	);
	const collinear_edges = getEdgesCollinearToLine({
		vertices_coords: vertices_coords_folded,
		edges_vertices: graph.edges_vertices,
	}, { vector, origin }, epsilon)
		.filter(e => unfolded_assignment[graph.edges_assignment[e]]);
	collinear_edges
		.map(e => graph.edges_faces[e].find(f => f != null))
		.map(f => graph.faces_winding[f])
		.map(winding => (winding ? assignment : opposite_assignment))
		.forEach((assign, e) => {
			graph.edges_assignment[collinear_edges[e]] = assign;
			graph.edges_foldAngle[collinear_edges[e]] = edgeAssignmentToFoldAngle(
				assign,
			);
		});
	const face0 = face_snapshot(graph, 0);
	const split_changes = graph.faces_vertices
		.map((_, i) => i)
		.reverse()
		.map((i) => {
			const face = face_snapshot(graph, i);
			const change = splitFace(graph, i, face.crease, epsilon);
			if (change === undefined) { return undefined; }
			graph.edges_assignment[change.edges.new] = face.winding
				? assignment
				: opposite_assignment;
			graph.edges_foldAngle[change.edges.new] = edgeAssignmentToFoldAngle(
				graph.edges_assignment[change.edges.new],
			);
			const new_faces = change.faces.map[change.faces.remove];
			new_faces.forEach(f => {
				graph.faces_center[f] = make_face_center(graph, f);
				graph.faces_side[f] = make_face_side(
					face.crease.vector,
					face.crease.origin,
					graph.faces_center[f],
					face.winding,
				);
				graph.faces_layer[f] = face.layer;
			});
			return change;
		})
		.filter(a => a !== undefined);
	const faces_map = mergeNextmaps(...split_changes.map(el => el.faces.map));
	const edges_map = mergeNextmaps(...split_changes.map(el => el.edges.map)
		.filter(a => a !== undefined));
	const faces_remove = split_changes.map(el => el.faces.remove).reverse();
	graph.faces_layer = foldFacesLayer(
		graph.faces_layer,
		graph.faces_side,
	);
	const face0_was_split = faces_map && faces_map[0] && faces_map[0].length === 2;
	const face0_newIndex = (face0_was_split
		? faces_map[0].filter(f => graph.faces_side[f]).shift()
		: 0);
	let face0_preMatrix = face0.matrix;
	if (assignment !== opposite_assignment) {
		face0_preMatrix = (!face0_was_split && !graph.faces_side[0]
			? face0.matrix
			: multiplyMatrices2(
				face0.matrix,
				makeMatrix2Reflect(
					face0.crease.vector,
					face0.crease.origin,
				),
			)
		);
	}
	graph.faces_matrix2 = makeFacesMatrix2(graph, face0_newIndex)
		.map(matrix => multiplyMatrices2(face0_preMatrix, matrix));
	delete graph.faces_center;
	delete graph.faces_winding;
	delete graph.faces_crease;
	delete graph.faces_side;
	return {
		faces: { map: faces_map, remove: faces_remove },
		edges: { map: edges_map },
	};
};const Origami = {};
Origami.prototype = Object.create(graphProto);
Origami.prototype.constructor = Origami;
Origami.prototype.flatFold = function () {
	flatFold(this, getLine$1(arguments));
	return this;
};
const origamiProto = Origami.prototype;const file_spec = 1.1;
const file_creator = "Rabbit Ear";const makeRectCoords = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
const makeGraphWithBoundaryCoords = (vertices_coords) => populate({
	vertices_coords,
	edges_vertices: vertices_coords
		.map((_, i, arr) => [i, (i + 1) % arr.length]),
	edges_assignment: Array(vertices_coords.length).fill("B"),
});
const square = (scale = 1) => (
	makeGraphWithBoundaryCoords(makeRectCoords(scale, scale)));
const rectangle = (width = 1, height = 1) => (
	makeGraphWithBoundaryCoords(makeRectCoords(width, height)));
const polygon = (sides = 3, circumradius = 1) => (
	makeGraphWithBoundaryCoords(makePolygonCircumradius(sides, circumradius)));
const kite = () => populate({
	vertices_coords: [
		[0, 0], [1, 0], [1, Math.SQRT2 - 1], [1, 1], [Math.SQRT2 - 1, 1], [0, 1],
	],
	edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 2], [0, 4], [0, 3]],
	edges_assignment: Array.from("BBBBBBVVF"),
});
const fish = () => populate({
	vertices_coords: [
		[0, 0],
		[Math.SQRT1_2, 0],
		[1, 0],
		[1, 1 - Math.SQRT1_2],
		[1, 1],
		[1 - Math.SQRT1_2, 1],
		[0, 1],
		[0, Math.SQRT1_2],
		[0.5, 0.5],
		[Math.SQRT1_2, 1 - Math.SQRT1_2],
		[1 - Math.SQRT1_2, Math.SQRT1_2],
	],
	edges_vertices: [
		[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
		[9, 0], [9, 2], [9, 4], [10, 0], [10, 6], [10, 4],
		[9, 1], [10, 7], [9, 3], [10, 5],
		[8, 0], [8, 9], [8, 4], [8, 10],
	],
	edges_assignment: Array.from("BBBBBBBBVVVVVVMMFFFFFF"),
});
const bird = () => populate({
	vertices_coords: [
		[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5],
		[0.5, 0.5],
		[0.5, (Math.SQRT2 - 1) / 2],
		[(3 - Math.SQRT2) / 2, 0.5],
		[0.5, (3 - Math.SQRT2) / 2],
		[(Math.SQRT2 - 1) / 2, 0.5],
		[Math.SQRT1_2 / 2, Math.SQRT1_2 / 2],
		[1 - (Math.SQRT1_2 / 2), 1 - (Math.SQRT1_2 / 2)],
	],
	edges_vertices: [
		[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
		[0, 9], [9, 2], [2, 10], [10, 4], [4, 11], [11, 6], [6, 12], [12, 0],
		[1, 9], [9, 8], [3, 10], [10, 8], [5, 11], [11, 8], [7, 12], [12, 8],
		[2, 8], [6, 8],
		[0, 13], [13, 8], [13, 9], [13, 12],
		[4, 14], [14, 8], [14, 10], [14, 11],
	],
	edges_assignment: Array
		.from("BBBBBBBBVVVVVVVVMVMVMVMVMMFFFFFFFF"),
});
const frog = () => populate({
	vertices_coords: [
		[0, 1], [0, Math.SQRT1_2], [0, 0.5], [0, 1 - Math.SQRT1_2], [0, 0],
		[0.5, 0.5], [1, 1], [(1 - Math.SQRT1_2) / 2, Math.SQRT1_2 / 2],
		[Math.SQRT1_2 / 2, (1 - Math.SQRT1_2) / 2], [1 - Math.SQRT1_2, 0],
		[0.5, 0], [Math.SQRT1_2, 0], [1, 0], [0.5, (1 - Math.SQRT1_2) / 2],
		[1 - (Math.SQRT1_2 / 2), (1 - Math.SQRT1_2) / 2],
		[(1 - Math.SQRT1_2) / 2, 1 - (Math.SQRT1_2 / 2)],
		[(1 - Math.SQRT1_2) / 2, 0.5],
		[(1 + Math.SQRT1_2) / 2, 1 - (Math.SQRT1_2 / 2)], [1, Math.SQRT1_2],
		[Math.SQRT1_2, 1], [1 - (Math.SQRT1_2 / 2), (1 + Math.SQRT1_2) / 2],
		[Math.SQRT1_2 / 2, (1 + Math.SQRT1_2) / 2], [0.5, 1], [1, 0.5],
		[(1 + Math.SQRT1_2) / 2, Math.SQRT1_2 / 2],
		[0.5, (1 + Math.SQRT1_2) / 2],
		[(1 + Math.SQRT1_2) / 2, 0.5],
		[1 - Math.SQRT1_2, 1], [1, 1 - Math.SQRT1_2],
	],
	edges_vertices: [
		[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [4, 7], [4, 8], [4, 9],
		[9, 10], [10, 11], [11, 12], [8, 13], [13, 14], [15, 16], [16, 7], [3, 7],
		[7, 5], [5, 17], [17, 18], [19, 20], [20, 5], [5, 8], [8, 9], [2, 15],
		[14, 10], [21, 22], [23, 24], [10, 8], [7, 2], [12, 14], [0, 15], [22, 25],
		[25, 5], [5, 13], [13, 10], [2, 16], [16, 5], [5, 26], [26, 23], [6, 17],
		[6, 20], [11, 14], [14, 5], [5, 21], [21, 27], [28, 24], [24, 5], [5, 15],
		[15, 1], [12, 5], [5, 0], [20, 25], [25, 21], [24, 26], [26, 17], [12, 24],
		[0, 21], [12, 28], [28, 23], [23, 18], [18, 6], [6, 19], [19, 22],
		[22, 27], [27, 0], [22, 20], [17, 23],
	],
	edges_assignment: Array
		.from("BBBBFFVVBBBBMMMMFVVFFVVFVVVVVVVVVMMVVMMVVVFVVFFVVFMMMMMMVVBBBBBBBBVV"),
});
const windmill = () => populate({
	vertices_coords: [
		[0, 0], [0.25, 0], [0.5, 0], [0.75, 0], [1, 0], [0, 1], [0, 0.75],
		[0, 0.5], [0, 0.25], [0.25, 0.25], [0.5, 0.5], [0.75, 0.75], [1, 1],
		[0.25, 1], [0.25, 0.75], [0.25, 0.5], [1, 0.25], [0.75, 0.25], [0.5, 0.25],
		[0.5, 1], [1, 0.5], [0.5, 0.75], [0.75, 0.5], [0.75, 1], [1, 0.75],
	],
	edges_vertices: [
		[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [7, 8], [8, 0],
		[0, 9], [9, 10], [10, 11], [11, 12], [13, 14], [14, 15], [15, 9],
		[9, 1], [16, 17], [17, 18], [18, 9], [9, 8], [7, 14], [14, 19],
		[20, 17], [17, 2], [2, 9], [9, 7], [19, 21], [21, 10], [10, 18],
		[18, 2], [20, 22], [22, 10], [10, 15], [15, 7], [4, 17], [17, 10],
		[10, 14], [14, 5], [23, 11], [11, 22], [22, 17], [17, 3], [6, 14],
		[14, 21], [21, 11], [11, 24], [12, 23], [23, 19], [19, 13], [13, 5],
		[4, 16], [16, 20], [20, 24], [24, 12], [19, 11], [11, 20],
	],
	edges_assignment: Array
		.from("BBBBBBBBVFFVFVVFFVVFMFMFMFFFFFFFFFVFFVFVVFFVVFBBBBBBBBMF"),
});
const base1 = () => populate({
	vertices_coords: [
		[0, 0], [2 - Math.SQRT2, 0], [1, 0], [0, 1], [0, 2 - Math.SQRT2],
		[0.5, 0.5], [Math.SQRT1_2, Math.SQRT1_2], [1, 1],
		[Math.SQRT1_2, 1 - Math.SQRT1_2], [1, Math.SQRT2 - 1],
		[1 - Math.SQRT1_2, Math.SQRT1_2], [Math.SQRT2 - 1, 1],
		[Math.SQRT1_2, 1], [1, Math.SQRT1_2],
	],
	edges_vertices: [
		[0, 1], [1, 2], [3, 4], [4, 0], [0, 5], [5, 6], [6, 7], [0, 8], [8, 9],
		[0, 10], [10, 11], [8, 1], [10, 4], [8, 6], [6, 12], [3, 10], [10, 5],
		[5, 8], [8, 2], [10, 6], [6, 13], [7, 12], [12, 11], [11, 3], [11, 6],
		[6, 9], [2, 9], [9, 13], [13, 7],
	],
	edges_assignment: Array.from("BBBBFFFVFVFMMVVVFFVVVBBBMMBBB"),
});const bases=/*#__PURE__*/Object.freeze({__proto__:null,base1,bird,fish,frog,kite,polygon,rectangle,square,windmill});const graph = (...args) => populate(
	Object.assign(Object.create(graphProto), {
		...args.reduce((a, b) => ({ ...a, ...b }), ({})),
		file_spec,
		file_creator,
	}),
);
const cp = (...args) => populate(
	Object.assign(Object.create(cpProto), {
		...(args.length
			? args.reduce((a, b) => ({ ...a, ...b }), ({}))
			: square()),
		file_spec,
		file_creator,
		frame_classes: ["creasePattern"],
	}),
);
const origami = (...args) => populate(
	Object.assign(Object.create(origamiProto), {
		...(args.length
			? args.reduce((a, b) => ({ ...a, ...b }), ({}))
			: square()),
		file_spec,
		file_creator,
		frame_classes: ["foldedForm"],
	}),
);
graph.prototype = graphProto;
graph.prototype.constructor = graph;
cp.prototype = cpProto;
cp.prototype.constructor = cp;
origami.prototype = origamiProto;
origami.prototype.constructor = origami;
Object.keys(bases).forEach(fnName => {
	graph[fnName] = (...args) => graph(bases[fnName](...args));
	cp[fnName] = (...args) => cp(bases[fnName](...args));
	origami[fnName] = (...args) => origami(bases[fnName](...args));
});const intersectionUD = (line1, line2) => {
	const det = cross2(line1.normal, line2.normal);
	if (Math.abs(det) < EPSILON) { return undefined; }
	const x = line1.distance * line2.normal[1] - line2.distance * line1.normal[1];
	const y = line2.distance * line1.normal[0] - line1.distance * line2.normal[0];
	return [x / det, y / det];
};
const normalAxiom1 = (point1, point2) => {
	const normal = normalize2(rotate90(subtract2(point2, point1)));
	return [{
		normal,
		distance: dot2(add2(point1, point2), normal) / 2.0,
	}];
};
const normalAxiom2 = (point1, point2) => {
	const normal = normalize2(subtract2(point2, point1));
	return [{
		normal,
		distance: dot2(add2(point1, point2), normal) / 2.0,
	}];
};
const normalAxiom3 = (line1, line2) => {
	const intersect = intersectionUD(line1, line2);
	return intersect === undefined
		? [{
			normal: line1.normal,
			distance: (line1.distance + line2.distance * dot2(line1.normal, line2.normal)) / 2,
		}]
		: [add2, subtract2]
			.map(f => normalize2(f(line1.normal, line2.normal)))
			.map(normal => ({ normal, distance: dot2(intersect, normal) }));
};
const normalAxiom4 = (line, point) => {
	const normal = rotate90(line.normal);
	const distance = dot2(point, normal);
	return [{ normal, distance }];
};
const normalAxiom5 = (line, point1, point2) => {
	const p1base = dot2(point1, line.normal);
	const a = line.distance - p1base;
	const c = distance2(point1, point2);
	if (a > c) { return []; }
	const b = Math.sqrt(c * c - a * a);
	const a_vec = scale2(line.normal, a);
	const base_center = add2(point1, a_vec);
	const base_vector = scale2(rotate90(line.normal), b);
	const mirrors = b < EPSILON
		? [base_center]
		: [add2(base_center, base_vector), subtract2(base_center, base_vector)];
	return mirrors
		.map(pt => normalize2(subtract2(point2, pt)))
		.map(normal => ({ normal, distance: dot2(point1, normal) }));
};
const cubrt = n => (n < 0 ? -((-n) ** (1 / 3)) : (n ** (1 / 3)));
const polynomial = (degree, a, b, c, d) => {
	switch (degree) {
	case 1: return [-d / c];
	case 2: {
		const discriminant = (c ** 2) - (4 * b * d);
		if (discriminant < -EPSILON) { return []; }
		const q1 = -c / (2 * b);
		if (discriminant < EPSILON) { return [q1]; }
		const q2 = Math.sqrt(discriminant) / (2 * b);
		return [q1 + q2, q1 - q2];
	}
	case 3: {
		const a2 = b / a;
		const a1 = c / a;
		const a0 = d / a;
		const q = (3 * a1 - (a2 ** 2)) / 9;
		const r = (9 * a2 * a1 - 27 * a0 - 2 * (a2 ** 3)) / 54;
		const d0 = (q ** 3) + (r ** 2);
		const u = -a2 / 3;
		if (d0 > 0) {
			const sqrt_d0 = Math.sqrt(d0);
			const s = cubrt(r + sqrt_d0);
			const t = cubrt(r - sqrt_d0);
			return [u + s + t];
		}
		if (Math.abs(d0) < EPSILON) {
			const s = (r ** (1 / 3));
			if (r < 0) { return []; }
			return [u + 2 * s, u - s];
		}
		const sqrt_d0 = Math.sqrt(-d0);
		const phi = Math.atan2(sqrt_d0, r) / 3;
		const r_s = ((r ** 2) - d0) ** (1 / 6);
		const s_r = r_s * Math.cos(phi);
		const s_i = r_s * Math.sin(phi);
		return [
			u + 2 * s_r,
			u - s_r - Math.sqrt(3) * s_i,
			u - s_r + Math.sqrt(3) * s_i,
		];
	}
	default: return [];
	}
};
const normalAxiom6 = (line1, line2, point1, point2) => {
	if (Math.abs(1 - (dot2(line1.normal, point1) / line1.distance)) < 0.02) { return []; }
	const line_vec = rotate90(line1.normal);
	const vec1 = subtract2(
		add2(point1, scale2(line1.normal, line1.distance)),
		scale2(point2, 2),
	);
	const vec2 = subtract2(scale2(line1.normal, line1.distance), point1);
	const c1 = dot2(point2, line2.normal) - line2.distance;
	const c2 = 2 * dot2(vec2, line_vec);
	const c3 = dot2(vec2, vec2);
	const c4 = dot2(add2(vec1, vec2), line_vec);
	const c5 = dot2(vec1, vec2);
	const c6 = dot2(line_vec, line2.normal);
	const c7 = dot2(vec2, line2.normal);
	const a = c6;
	const b = c1 + c4 * c6 + c7;
	const c = c1 * c2 + c5 * c6 + c4 * c7;
	const d = c1 * c3 + c5 * c7;
	let polynomial_degree = 0;
	if (Math.abs(c) > EPSILON) { polynomial_degree = 1; }
	if (Math.abs(b) > EPSILON) { polynomial_degree = 2; }
	if (Math.abs(a) > EPSILON) { polynomial_degree = 3; }
	return polynomial(polynomial_degree, a, b, c, d)
		.map(n => add2(
			scale2(line1.normal, line1.distance),
			scale2(line_vec, n),
		))
		.map(p => ({ p, normal: normalize2(subtract2(p, point1)) }))
		.map(el => ({
			normal: el.normal,
			distance: dot2(el.normal, midpoint2(el.p, point1)),
		}));
};
const normalAxiom7 = (line1, line2, point) => {
	const normal = rotate90(line1.normal);
	const norm_norm = dot2(normal, line2.normal);
	if (Math.abs(norm_norm) < EPSILON) { return undefined; }
	const a = dot2(point, normal);
	const b = dot2(point, line2.normal);
	const distance = (line2.distance + 2.0 * a * norm_norm - b) / (2.0 * norm_norm);
	return [{ normal, distance }];
};
const normalAxiom = (number, ...args) => [
	null,
	normalAxiom1,
	normalAxiom2,
	normalAxiom3,
	normalAxiom4,
	normalAxiom5,
	normalAxiom6,
	normalAxiom7,
][number](...args);const AxiomsUniqueLine=/*#__PURE__*/Object.freeze({__proto__:null,normalAxiom,normalAxiom1,normalAxiom2,normalAxiom3,normalAxiom4,normalAxiom5,normalAxiom6,normalAxiom7});const axiom1 = (point1, point2) => [{
	vector: normalize2(subtract2(...resizeUp(point2, point1))),
	origin: point1,
}];
const axiom2 = (point1, point2) => [{
	vector: normalize2(rotate90(subtract2(
		...resizeUp(point2, point1),
	))),
	origin: midpoint2(point1, point2),
}];
const axiom3 = (line1, line2) => bisectLines2(line1, line2);
const axiom4 = (line, point) => [{
	vector: rotate90(normalize2(line.vector)),
	origin: point,
}];
const axiom5 = (line, point1, point2) => (
	intersectCircleLine(
		{ radius: distance2(point1, point2), origin: point1 },
		line,
	) || []).map(sect => ({
	vector: normalize2(rotate90(subtract2(
		...resizeUp(sect, point2),
	))),
	origin: midpoint2(point2, sect),
}));
const axiom6 = (line1, line2, point1, point2) => normalAxiom6(
	vecLineToUniqueLine(line1),
	vecLineToUniqueLine(line2),
	point1,
	point2,
).map(uniqueLineToVecLine);
const axiom7 = (line1, line2, point) => {
	const intersect = intersectLineLine(
		line1,
		{ vector: line2.vector, origin: point },
		includeL,
		includeL,
	).point;
	return intersect === undefined
		? []
		: [{
			vector: normalize2(rotate90(subtract2(
				...resizeUp(intersect, point),
			))),
			origin: midpoint2(point, intersect),
		}];
};
const axiom$1 = (number, ...args) => [
	null, axiom1, axiom2, axiom3, axiom4, axiom5, axiom6, axiom7,
][number](...args);const AxiomsVecLine=/*#__PURE__*/Object.freeze({__proto__:null,axiom:axiom$1,axiom1,axiom2,axiom3,axiom4,axiom5,axiom6,axiom7});const reflectPoint = (foldLine, point) => {
	const matrix = makeMatrix2Reflect(foldLine.vector, foldLine.origin);
	return multiplyMatrix2Vector2(matrix, point);
};
const validateAxiom1 = (boundary, solutions, point1, point2) => [
	[point1, point2]
		.map(p => overlapConvexPolygonPoint(boundary, p, include))
		.reduce((a, b) => a && b, true),
];
const validateAxiom2 = validateAxiom1;
const validateAxiom3 = (boundary, solutions, line1, line2) => {
	const segments = [line1, line2]
		.map(line => clipLineConvexPolygon(
			boundary,
			line,
			include,
			includeL,
		));
	if (segments[0] === undefined || segments[1] === undefined) {
		return [false, false];
	}
	const results_clip = solutions.map(line => (line === undefined
		? undefined
		: clipLineConvexPolygon(
			boundary,
			line,
			include,
			includeL,
		)));
	const results_inside = [0, 1].map((i) => results_clip[i] !== undefined);
	const seg0Reflect = solutions.map(foldLine => (foldLine === undefined
		? undefined
		: [
			reflectPoint(foldLine, segments[0][0]),
			reflectPoint(foldLine, segments[0][1]),
		]));
	const reflectMatch = seg0Reflect.map(seg => (seg === undefined
		? false
		: (overlapLinePoint(
			{ vector: subtract(segments[1][1], segments[1][0]), origin: segments[1][0] },
			seg[0],
			includeS,
		)
		|| overlapLinePoint(
			{ vector: subtract(segments[1][1], segments[1][0]), origin: segments[1][0] },
			seg[1],
			includeS,
		)
		|| overlapLinePoint(
			{ vector: subtract(seg[1], seg[0]), origin: seg[0] },
			segments[1][0],
			includeS,
		)
		|| overlapLinePoint(
			{ vector: subtract(seg[1], seg[0]), origin: seg[0] },
			segments[1][1],
			includeS,
		))));
	return [0, 1].map(i => reflectMatch[i] === true && results_inside[i] === true);
};
const validateAxiom4 = (boundary, solutions, line, point) => {
	const intersect = intersectLineLine(
		line,
		{ vector: rotate90(line.vector), origin: point },
		includeL,
		includeL,
	).point;
	return [
		[point, intersect]
			.filter(a => a !== undefined)
			.map(p => overlapConvexPolygonPoint(boundary, p, include))
			.reduce((a, b) => a && b, true),
	];
};
const validateAxiom5 = (boundary, solutions, line, point1, point2) => {
	if (solutions.length === 0) { return []; }
	const testParamPoints = [point1, point2]
		.map(point => overlapConvexPolygonPoint(boundary, point, include))
		.reduce((a, b) => a && b, true);
	const testReflections = solutions
		.map(foldLine => reflectPoint(foldLine, point2))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	return testReflections.map(ref => ref && testParamPoints);
};
const validateAxiom6 = function (boundary, solutions, line1, line2, point1, point2) {
	if (solutions.length === 0) { return []; }
	const testParamPoints = [point1, point2]
		.map(point => overlapConvexPolygonPoint(boundary, point, include))
		.reduce((a, b) => a && b, true);
	if (!testParamPoints) { return solutions.map(() => false); }
	const testReflect0 = solutions
		.map(foldLine => reflectPoint(foldLine, point1))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	const testReflect1 = solutions
		.map(foldLine => reflectPoint(foldLine, point2))
		.map(point => overlapConvexPolygonPoint(boundary, point, include));
	return solutions.map((_, i) => testReflect0[i] && testReflect1[i]);
};
const validateAxiom7 = (boundary, solutions, line1, line2, point) => {
	const paramPointTest = overlapConvexPolygonPoint(
		boundary,
		point,
		include,
	);
	if (!solutions.length) { return [false]; }
	const reflected = reflectPoint(solutions[0], point);
	const reflectTest = overlapConvexPolygonPoint(boundary, reflected, include);
	const paramLineTest = (intersectConvexPolygonLine(
		boundary,
		line2,
		includeS,
		includeL,
	) !== undefined);
	const intersect = intersectLineLine(
		line2,
		solutions[0],
		includeL,
		includeL,
	).point;
	const intersectInsideTest = intersect
		? overlapConvexPolygonPoint(boundary, intersect, include)
		: false;
	return [paramPointTest && reflectTest && paramLineTest && intersectInsideTest];
};
const validateAxiom = (number, boundary, solutions, ...args) => [null,
	validateAxiom1,
	validateAxiom2,
	validateAxiom3,
	validateAxiom4,
	validateAxiom5,
	validateAxiom6,
	validateAxiom7,
][number](boundary, solutions, ...args);const ValidateAxioms=/*#__PURE__*/Object.freeze({__proto__:null,validateAxiom,validateAxiom1,validateAxiom2,validateAxiom3,validateAxiom4,validateAxiom5,validateAxiom6,validateAxiom7});const paramsToUniqueLine = (args) => args
	.map(arg => (typeof arg === "object" && arg.vector
		? uniqueLineToVecLine(arg)
		: arg));
const axiomWithBoundary = (number, boundary, ...args) => {
	const solutions = axiom$1(number, ...args);
	validateAxiom(number, boundary, solutions, ...args)
		.map((valid, i) => (!valid ? i : undefined))
		.filter(a => a !== undefined)
		.forEach(i => delete solutions[i]);
	return solutions;
};
const normalAxiomWithBoundary = (number, boundary, ...args) => {
	const solutions = normalAxiom(number, ...args).map(uniqueLineToVecLine);
	validateAxiom(number, boundary, solutions, ...paramsToUniqueLine(args))
		.map((valid, i) => (!valid ? i : undefined))
		.filter(a => a !== undefined)
		.forEach(i => delete solutions[i]);
	return solutions;
};const AxiomsBoundary=/*#__PURE__*/Object.freeze({__proto__:null,axiomWithBoundary,normalAxiomWithBoundary});const axiom = {
	...AxiomsVecLine,
	...AxiomsUniqueLine,
	...AxiomsBoundary,
	...ValidateAxioms,
};const newFoldFile = () => {
	const graph = {};
	graph.file_spec = file_spec;
	graph.file_creator = file_creator;
	graph.file_classes = ["singleModel"];
	graph.frame_classes = [];
	graph.frame_attributes = [];
	graph.vertices_coords = [];
	graph.faces_vertices = [];
	return graph;
};
const updateMetadata = (graph) => {
	if (!graph.edges_foldAngle || !graph.edges_foldAngle.length) { return; }
	let is2D = true;
	for (let i = 0; i < graph.edges_foldAngle.length; i += 1) {
		if (graph.edges_foldAngle[i] !== 0
			&& graph.edges_foldAngle[i] !== -180
			&& graph.edges_foldAngle[i] !== 180) {
			is2D = false;
			break;
		}
	}
	graph.frame_classes.push(is2D ? "creasePattern" : "foldedForm");
	graph.frame_attributes.push(is2D ? "2D" : "3D");
};
const pairify = (list) => list.map((val, i, arr) => [val, arr[(i + 1) % arr.length]]);
const makeEdgesVertices = ({ faces_vertices }) => {
	const edgeExists = {};
	const edges_vertices = [];
	faces_vertices
		.flatMap(pairify)
		.forEach(edge => {
			const keys = [edge.join(" "), `${edge[1]} ${edge[0]}`];
			if (keys[0] in edgeExists || keys[1] in edgeExists) { return; }
			edges_vertices.push(edge);
			edgeExists[keys[0]] = true;
		});
	return edges_vertices;
};
const parseFace = (face) => face
	.slice(1)
	.map(str => parseInt(str, 10) - 1);
const parseVertex = (vertex) => vertex
	.slice(1)
	.map(str => parseFloat(str));
const objToFold = (file) => {
	const lines = file.split("\n").map(line => line.trim().split(/\s+/));
	const graph = newFoldFile();
	for (let i = 0; i < lines.length; i += 1) {
		switch (lines[i][0].toLowerCase()) {
		case "f": graph.faces_vertices.push(parseFace(lines[i])); break;
		case "v": graph.vertices_coords.push(parseVertex(lines[i])); break;
		}
	}
	graph.faces_normal = makeFacesNormal(graph);
	graph.faces_center = makeFacesConvexCenter(graph);
	graph.edges_vertices = makeEdgesVertices(graph);
	graph.faces_edges = makeFacesEdgesFromVertices(graph);
	graph.edges_faces = makeEdgesFacesUnsorted(graph);
	graph.edges_foldAngle = makeEdgesFoldAngleFromFaces(graph);
	graph.edges_assignment = makeEdgesAssignment(graph);
	graph.vertices_vertices = makeVerticesVerticesFromFaces(graph);
	delete graph.faces_normal;
	delete graph.faces_center;
	delete graph.edges_faces;
	updateMetadata(graph);
	return graph;
};const planarizeGraph = (graph, epsilon) => {
	const planar = planarize(graph, epsilon);
	planar.vertices_vertices = makeVerticesVertices(planar);
	const faces = makePlanarFaces(planar);
	planar.faces_vertices = faces.faces_vertices;
	planar.faces_edges = faces.faces_edges;
	delete planar.vertices_edges;
	return planar;
};const shortestEdgeLength$1 = ({ vertices_coords, edges_vertices }) => {
	const lengths = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map(segment => distance(...segment))
		.filter(len => len > 1e-4);
	const minLen = lengths
		.reduce((a, b) => Math.min(a, b), Infinity);
	return minLen === Infinity ? undefined : minLen;
};
const makeEpsilon$1 = ({ vertices_coords, edges_vertices }) => {
	const shortest = shortestEdgeLength$1({ vertices_coords, edges_vertices });
	const bounds = boundingBox({ vertices_coords });
	const graphSpan = bounds && bounds.span ? Math.max(...bounds.span) : 1;
	const spanScale = graphSpan * 1e-2;
	const edgeScale = shortest / 20;
	return shortest === undefined ? spanScale : Math.min(spanScale, edgeScale);
};const countPlaces = function (num) {
	const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};
const cleanNumber = function (number, places = 15) {
	const num = typeof number === "number" ? number : parseFloat(number);
	if (Number.isNaN(num)) { return number; }
	const crop = parseFloat(num.toFixed(places));
	if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
		return num;
	}
	return crop;
};const numberMethods=/*#__PURE__*/Object.freeze({__proto__:null,cleanNumber});const findEpsilonInObject = (graph, object, key = "epsilon") => {
	if (typeof object === "object" && typeof object[key] === "number") {
		return object[key];
	}
	return typeof object === "number"
		? object
		: makeEpsilon$1(graph);
};
const invertVertical = (vertices_coords) => {
	const box = boundingBox({ vertices_coords });
	const center = box.min[1] + box.span[1] / 2;
	const invMin = Math.min(-box.min[1], -box.max[1]);
	const invMax = Math.max(-box.min[1], -box.max[1]);
	const invSpan = invMax - invMin;
	const invCenter = invMin + invSpan / 2;
	const difference = center - invCenter;
	const yTranslate = cleanNumber(difference, 8);
	for (let i = 0; i < vertices_coords.length; i += 1) {
		vertices_coords[i][1] = -vertices_coords[i][1] + yTranslate;
	}
};const getContainingValue = (oripa, value) => (oripa == null
	? null
	: Array.from(oripa.childNodes)
		.filter(el => el.attributes && el.attributes.length)
		.filter(el => Array.from(el.attributes)
			.filter(attr => attr.nodeValue === value)
			.shift() !== undefined)
		.shift());
const getMetadataValue = (oripa, value) => {
	const parentNode = getContainingValue(oripa, value);
	const node = parentNode
		? Array.from(parentNode.childNodes).shift()
		: null;
	return node
		? node.textContent
		: undefined;
};
const getLines = (oripa) => {
	const linesParent = getContainingValue(oripa, "lines");
	const linesNode = linesParent
		? Array.from(linesParent.childNodes)
			.filter(el => el.getAttribute)
			.filter(el => el.getAttribute("class").split(" ").includes("oripa.OriLineProxy"))
			.shift()
		: undefined;
	return linesNode ? Array.from(linesNode.childNodes) : [];
};
const parseLines = (lines) => lines
	.filter(line => line.nodeName === "void")
	.filter(line => line.childNodes)
	.map(line => getContainingValue(line, "oripa.OriLineProxy"))
	.filter(lineData => lineData)
	.map(lineData => ["type", "x0", "x1", "y0", "y1"]
		.map(key => getContainingValue(lineData, key))
		.map(el => (el ? Array.from(el.childNodes) : []))
		.map(children => children
			.filter(child => child.nodeName === "double" || child.nodeName === "int")
			.shift())
		.map(node => (node && node.childNodes[0] ? node.childNodes[0].data : "0"))
		.map(parseFloat));
const opxAssignment = ["F", "B", "M", "V", "U"];
const makeFOLD = (lines) => {
	const fold = {};
	fold.vertices_coords = lines
		.flatMap(line => [[line[1], line[3]], [line[2], line[4]]]);
	fold.edges_vertices = lines.map((_, i) => [i * 2, i * 2 + 1]);
	fold.edges_assignment = lines.map(line => opxAssignment[line[0]]);
	fold.edges_foldAngle = makeEdgesFoldAngle(fold);
	return fold;
};
const opxEdgeGraph = (file) => {
	const parsed = xmlStringToElement(file, "text/xml");
	const oripa = Array.from(parsed.childNodes)
		.filter(el => el.getAttribute)
		.filter(el => el.getAttribute("class").split(" ").includes("oripa.DataSet"))
		.shift();
	return makeFOLD(parseLines(getLines(oripa)));
};
const setMetadata = (oripa, fold) => {
	const metadata = {
		file_description: "memo",
		file_author: "originalAuthorName",
		file_title: "title",
	};
	Object.keys(metadata).forEach(key => {
		metadata[key] = getMetadataValue(oripa, metadata[key]);
	});
	Object.keys(metadata)
		.filter(key => metadata[key])
		.forEach(key => { fold[key] = metadata[key]; });
	fold.file_classes = ["singleModel"];
	fold.frame_classes = ["creasePattern"];
};
const opxToFold = (file, options) => {
	const parsed = xmlStringToElement(file, "text/xml");
	const children = parsed && parsed.childNodes
		? Array.from(parsed.childNodes)
		: [];
	const oripa = children
		.filter(el => el.getAttribute)
		.filter(el => el.getAttribute("class").split(" ").includes("oripa.DataSet"))
		.shift();
	const graph = makeFOLD(parseLines(getLines(oripa)));
	if (options && options.invertVertical && graph.vertices_coords) {
		invertVertical(graph.vertices_coords);
	}
	const epsilon = findEpsilonInObject(graph, options);
	const planarGraph = planarizeGraph(graph, epsilon);
	setMetadata(oripa, planarGraph);
	return planarGraph;
};
Object.assign(opxToFold, {
	opxEdgeGraph,
});const colorToAssignment = (color, customAssignments) => {
	const hex = parseColorToHex(color).toUpperCase();
	return customAssignments && customAssignments[hex]
		? customAssignments[hex]
		: rgbToAssignment(...parseColorToRgb(color));
};
const opacityToFoldAngle = (opacity, assignment) => {
	switch (assignment) {
	case "M": case "m": return -180 * opacity;
	case "V": case "v": return 180 * opacity;
	default: return 0;
	}
};
const getEdgeStroke = (element, attributes) => {
	const computedStroke = RabbitEarWindow().getComputedStyle != null
		? RabbitEarWindow().getComputedStyle(element).stroke
		: "";
	if (computedStroke !== "" && computedStroke !== "none") {
		return computedStroke;
	}
	if (attributes.stroke !== undefined) {
		return attributes.stroke;
	}
	return undefined;
};
const getEdgeOpacity = (element, attributes) => {
	const computedOpacity = RabbitEarWindow().getComputedStyle != null
		? RabbitEarWindow().getComputedStyle(element).opacity
		: "";
	if (computedOpacity !== "") {
		const floatOpacity = parseFloat(computedOpacity);
		if (!Number.isNaN(floatOpacity)) { return floatOpacity; }
	}
	if (attributes.opacity !== undefined) {
		const floatOpacity = parseFloat(attributes.opacity);
		if (!Number.isNaN(floatOpacity)) { return floatOpacity; }
	}
	return undefined;
};const edgeParsers=/*#__PURE__*/Object.freeze({__proto__:null,colorToAssignment,getEdgeOpacity,getEdgeStroke,opacityToFoldAngle});const getAttributesFloatValue = (element, attributes) => attributes
	.map(attr => element.getAttribute(attr))
	.map(str => (str == null ? 0 : str))
	.map(parseFloat);const LineToSegments = (line) => [
	getAttributesFloatValue(line, ["x1", "y1", "x2", "y2"]),
];const RectToSegments = function (rect) {
	const [x, y, w, h] = getAttributesFloatValue(
		rect,
		["x", "y", "width", "height"],
	);
	return [
		[x, y, x + w, y],
		[x + w, y, x + w, y + h],
		[x + w, y + h, x, y + h],
		[x, y + h, x, y],
	];
};const pointsStringToArray = str => {
	const list = str.split(/[\s,]+/).map(parseFloat);
	return Array
		.from(Array(Math.floor(list.length / 2)))
		.map((_, i) => [list[i * 2 + 0], list[i * 2 + 1]]);
};
const PolygonToSegments = (poly) => (
	pointsStringToArray(poly.getAttribute("points") || "")
		.map((_, i, arr) => [
			arr[i][0],
			arr[i][1],
			arr[(i + 1) % arr.length][0],
			arr[(i + 1) % arr.length][1],
		])
);const PolylineToSegments = function (polyline) {
	const circularPath = PolygonToSegments(polyline);
	circularPath.pop();
	return circularPath;
};const straightPathLines = {
	L: true, V: true, H: true, Z: true,
};
const PathToSegments = (path) => (
	parsePathCommandsWithEndpoints(path.getAttribute("d") || "")
		.filter(command => straightPathLines[command.command.toUpperCase()])
		.map(el => [el.start, el.end])
		.filter(seg => !epsilonEqualVectors(...seg))
		.map(seg => seg.flat())
);const parsers = {
	line: LineToSegments,
	rect: RectToSegments,
	polygon: PolygonToSegments,
	polyline: PolylineToSegments,
	path: PathToSegments,
};const transformSegment = (segment, transform) => {
	const seg = [[segment[0], segment[1]], [segment[2], segment[3]]];
	if (!transform) { return seg; }
	const matrix = transformStringToMatrix(transform);
	return matrix
		? seg.map(p => multiplyMatrix2Vector2(matrix, p))
		: seg;
};
const flatSegments = (svgElement) => flattenDomTreeWithStyle(svgElement)
	.filter(el => parsers[el.element.nodeName])
	.flatMap(el => parsers[el.element.nodeName](el.element)
		.map(segment => transformSegment(segment, el.attributes.transform))
		.map(segment => ({ ...el, segment })));const invisibleParent = (child) => {
	if (!RabbitEarWindow().document.body) { return undefined; }
	const parent = RabbitEarWindow().document.createElement("div");
	parent.setAttribute("display", "none");
	RabbitEarWindow().document.body.appendChild(parent);
	parent.appendChild(child);
	return parent;
};const containsStylesheet = (svgElement) => flattenDomTree(svgElement)
	.map(el => el.nodeName === "style")
	.reduce((a, b) => a || b, false);
const svgSegments = (svg) => {
	const svgElement = typeof svg === "string"
		? xmlStringToElement(svg, "image/svg+xml")
		: svg;
	if (containsStylesheet(svgElement) && isNode) {
		console.warn(Messages$1.backendStylesheet);
	}
	const parent = getRootParent(svgElement) === RabbitEarWindow().document
		? undefined
		: invisibleParent(svgElement);
	const segments = flatSegments(svgElement);
	segments.map(el => ({
		data: {
			assignment: el.attributes["data-assignment"],
			foldAngle: el.attributes["data-foldAngle"],
		},
		stroke: getEdgeStroke(el.element, el.attributes),
		opacity: getEdgeOpacity(el.element, el.attributes),
	})).forEach((addition, i) => {
		segments[i] = {
			...segments[i],
			...addition,
		};
	});
	if (parent && parent.parentNode) {
		parent.parentNode.removeChild(parent);
	}
	return segments;
};const getUserAssignmentOptions = (options) => {
	if (!options || !options.assignments) { return undefined; }
	const assignments = {};
	Object.keys(options.assignments).forEach(key => {
		const hex = parseColorToHex(key).toUpperCase();
		assignments[hex] = options.assignments[key];
	});
	return assignments;
};
const getEdgeAssignment = (dataAssignment, stroke = "#f0f", customAssignments = undefined) => {
	if (dataAssignment) { return dataAssignment; }
	return colorToAssignment(stroke, customAssignments);
};
const getEdgeFoldAngle = (dataFoldAngle, opacity = 1, assignment = undefined) => {
	if (dataFoldAngle) { return parseFloat(dataFoldAngle); }
	return opacityToFoldAngle(opacity, assignment);
};
const makeAssignmentFoldAngle = (segments, options) => {
	const customAssignments = getUserAssignmentOptions(options);
	if (customAssignments) {
		segments.forEach(seg => {
			delete seg.data.assignment;
			delete seg.data.foldAngle;
		});
	}
	const edges_assignment = segments.map(segment => getEdgeAssignment(
		segment.data.assignment,
		segment.stroke,
		customAssignments,
	));
	const edges_foldAngle = segments.map((segment, i) => getEdgeFoldAngle(
		segment.data.foldAngle,
		segment.opacity,
		edges_assignment[i],
	));
	return {
		edges_assignment,
		edges_foldAngle,
	};
};
const svgEdgeGraph = (svg, options) => {
	const segments = svgSegments(svg);
	const {
		edges_assignment,
		edges_foldAngle,
	} = makeAssignmentFoldAngle(segments, options);
	const fixNumber = options && options.fast ? n => n : cleanNumber;
	const vertices_coords = segments
		.flatMap(el => el.segment)
		.map(coord => coord.map(n => fixNumber(n, 12)));
	const edges_vertices = segments.map((_, i) => [i * 2, i * 2 + 1]);
	return {
		vertices_coords,
		edges_vertices,
		edges_assignment,
		edges_foldAngle,
	};
};const svgToFold = (file, options) => {
	const graph = svgEdgeGraph(file, options);
	const epsilon = findEpsilonInObject(graph, options);
	if (options && options.invertVertical && graph.vertices_coords) {
		invertVertical(graph.vertices_coords);
	}
	const planarGraph = planarizeGraph(graph, epsilon);
	const fixNumber = options && options.fast ? n => n : cleanNumber;
	planarGraph.vertices_coords = planarGraph.vertices_coords
		.map(coord => coord.map(n => fixNumber(n, 12)));
	if (typeof options !== "object" || options.boundary !== false) {
		planarGraph.edges_assignment
			.map((_, i) => i)
			.filter(i => planarGraph.edges_assignment[i] === "B"
				|| planarGraph.edges_assignment[i] === "b")
			.forEach(i => { planarGraph.edges_assignment[i] = "F"; });
		const { edges } = planarBoundary(planarGraph);
		edges.forEach(e => { planarGraph.edges_assignment[e] = "B"; });
	}
	return {
		file_spec: 1.1,
		file_creator: "Rabbit Ear",
		frame_classes: ["creasePattern"],
		...planarGraph,
	};
};
Object.assign(svgToFold, {
	...edgeParsers,
	svgSegments,
	svgEdgeGraph,
	planarizeGraph,
	makeEpsilon: makeEpsilon$1,
});const convert = {
	objToFold,
	opxToFold,
	svgToFold,
	foldToSvg,
	foldToObj,
};const toCamel = (s) => s
	.replace(/([-_][a-z])/ig, $1 => $1
		.toUpperCase()
		.replace("-", "")
		.replace("_", ""));
const toKebab = (s) => s
	.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
	.replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
	.toLowerCase();
const capitalized = (s) => s
	.charAt(0).toUpperCase() + s.slice(1);const stringMethods=/*#__PURE__*/Object.freeze({__proto__:null,capitalized,toCamel,toKebab});const general$1 = {
	...arrayMethods,
	...clusterMethods,
	...getMethods,
	...numberMethods,
	...sortMethods,
	...stringMethods,
};const countFrames = (graph) => (!graph.file_frames
	? 1
	: graph.file_frames.length + 1);
const flattenFrame = (graph, frame_num = 1) => {
	if (!graph.file_frames || graph.file_frames.length < frame_num) {
		return graph;
	}
	const dontCopy = ["frame_parent", "frame_inherit"];
	const memo = { visited_frames: [] };
	const fileMetadata = {};
	filterKeysWithPrefix(graph, "file")
		.filter(key => key !== "file_frames")
		.forEach(key => { fileMetadata[key] = graph[key]; });
	const recurse = (recurse_graph, frame, orderArray) => {
		if (memo.visited_frames.indexOf(frame) !== -1) {
			throw new Error(Messages$1.graphCycle);
		}
		memo.visited_frames.push(frame);
		orderArray = [frame].concat(orderArray);
		if (frame === 0) { return orderArray; }
		if (recurse_graph.file_frames[frame - 1].frame_inherit
			&& recurse_graph.file_frames[frame - 1].frame_parent != null) {
			return recurse(
				recurse_graph,
				recurse_graph.file_frames[frame - 1].frame_parent,
				orderArray,
			);
		}
		return orderArray;
	};
	return recurse(graph, frame_num, []).map((frame) => {
		if (frame === 0) {
			const swap = graph.file_frames;
			graph.file_frames = null;
			const copy = clone(graph);
			graph.file_frames = swap;
			delete copy.file_frames;
			dontCopy.forEach(key => delete copy[key]);
			return copy;
		}
		const outerCopy = clone(graph.file_frames[frame - 1]);
		dontCopy.forEach(key => delete outerCopy[key]);
		return outerCopy;
	}).reduce((a, b) => Object.assign(a, b), fileMetadata);
};
const getTopLevelFrame = (graph) => {
	const copy = { ...graph };
	delete copy.file_frames;
	return copy;
};
const getFramesAsFlatArray = (graph) => {
	if (!graph) { return []; }
	if (!graph.file_frames || !graph.file_frames.length) {
		return [graph];
	}
	return [
		getTopLevelFrame(graph),
		...graph.file_frames,
	];
};
const getFramesByClassName = (graph, className) => Array
	.from(Array(countFrames(graph)))
	.map((_, i) => flattenFrame(graph, i))
	.filter(frame => frame.frame_classes
		&& frame.frame_classes.includes(className));const foldFileFrames=/*#__PURE__*/Object.freeze({__proto__:null,countFrames,flattenFrame,getFramesAsFlatArray,getFramesByClassName});const getEdgesSide = ({ vertices_coords, edges_vertices }, line, epsilon = EPSILON) => {
	const edgeSide = (edge_vertices) => edge_vertices
		.map(v => vertices_coords[v])
		.map(coord => subtract2(coord, line.origin))
		.map(vec => cross2(line.vector, vec))
		.sort((a, b) => Math.abs(b) - Math.abs(a))
		.map(Math.sign)
		.shift();
	const edgesIntersection = getEdgesLineIntersection({
		vertices_coords, edges_vertices,
	}, line, epsilon, excludeS);
	const edgesCollinear = {};
	getEdgesCollinearToLine({ vertices_coords, edges_vertices }, line, epsilon)
		.forEach(e => { edgesCollinear[e] = true; });
	return edges_vertices.map((edge_vertices, e) => {
		if (edgesCollinear[e] === true) { return 2; }
		if (edgesIntersection[e].point !== undefined) { return 0; }
		return edgeSide(edge_vertices);
	});
};
const getFacesSide = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges,
}, line, epsilon = EPSILON) => {
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	const edgesSide = getEdgesSide({ vertices_coords, edges_vertices }, line, epsilon);
	const facesEdgesSide = faces_edges
		.map(edges => edges
			.map(e => edgesSide[e])
			.filter(side => side !== 2));
	const facesOverlapLine = facesEdgesSide
		.map(sides => sides.includes(0));
	const facesEdgesSameSide = facesEdgesSide
		.map((sides, i) => (facesOverlapLine[i]
			? false
			: sides.reduce((a, b) => a && (b === sides[0]), true)));
	return facesEdgesSameSide
		.map((sameSide, f) => (sameSide ? facesEdgesSide[f][0] : 0));
};
const getFlapsThroughLine = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges, faceOrders,
}, line, epsilon = EPSILON) => {
	if (!faceOrders) { throw new Error("faceOrders required"); }
	const facesSide = getFacesSide({
		vertices_coords, edges_vertices, faces_vertices, faces_edges,
	}, line, epsilon);
	const sidesFaces = [-1, 1]
		.map(side => facesSide
			.map((s, f) => ({ s, f }))
			.filter(el => el.s === side || el.s === 0)
			.map(el => el.f));
	const sidesFaceOrders = sidesFaces
		.map(faces => faceOrdersSubset(faceOrders, faces));
	console.log("facesSide", facesSide);
	console.log("sidesFaces", sidesFaces);
	console.log("sidesFaceOrders", sidesFaceOrders);
	const faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	const sidesLayersFace = sidesFaceOrders.map(orders => linearizeFaceOrders({
		faceOrders: orders, faces_normal,
	}));
	console.log("sidesLayersFace", sidesLayersFace);
};const flaps=/*#__PURE__*/Object.freeze({__proto__:null,getEdgesSide,getFacesSide,getFlapsThroughLine});const intersectVerticesLineFunc = (
	{ vertices_coords },
	{ vector, origin },
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	if (lineMag < epsilon) {
		return vertices_coords.map(() => false);
	}
	return vertices_coords
		.map(coord => subtract2(coord, origin))
		.map(vec => Math.abs(cross2(vec, vector)) < epsilon
			&& lineDomain(dot2(vec, vector) / lineMagSq, epsilon / lineMag));
};
const intersectEdgesLineFunc = (
	{ vertices_coords, edges_vertices },
	line,
	lineFunc = includeL,
	epsilon = EPSILON,
) => {
	if (!vertices_coords || !edges_vertices) {
		return { vertices: [], edges: [] };
	}
	const vertices = intersectVerticesLineFunc(
		{ vertices_coords },
		line,
		lineFunc,
		epsilon,
	);
	const overlapVertexCount = edges_vertices
		.map(ev => vertices[ev[0]] + vertices[ev[1]]);
	const intersected = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map((seg, e) => (overlapVertexCount[e] === 0
			? intersectLineLine(pointsToLine(...seg), line, includeS, lineFunc)
			: ({})));
	intersected
		.map((_, i) => i)
		.filter(i => !intersected[i].point)
		.forEach(i => delete intersected[i]);
	const collinear = overlapVertexCount.map(count => count === 2);
	return {
		vertices,
		edges: {
			collinear,
			intersected,
		},
	};
};
const intersectGraphLineFunc = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	line,
	lineFunc = includeL,
	epsilon = EPSILON,
) => {
	if (!faces_vertices) { return { vertices: [], edges: [] }; }
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	const {
		vertices,
		edges: {
			collinear,
			intersected,
		},
	} = intersectEdgesLineFunc(
		{ vertices_coords, edges_vertices },
		line,
		lineFunc,
		epsilon,
	);
	const facesWithOverlappedEdges = faces_edges
		.map(fe => fe.filter(e => collinear[e]));
	const facesWithCrossedEdges = faces_edges
		.map(fe => fe.filter(e => intersected[e]));
	const facesWithVertices = faces_vertices
		.map(fv => fv.filter(v => vertices[v]));
	const faces = faces_vertices.map((_, f) => {
		if (facesWithOverlappedEdges[f].length) { return undefined; }
		const faceEdges = facesWithCrossedEdges[f];
		const faceVertices = facesWithVertices[f];
		return faceEdges.length + faceVertices.length
			? { edges: faceEdges, vertices: faceVertices }
			: undefined;
	});
	Object.keys(faces)
		.filter(f => faces[f] === undefined)
		.forEach(f => delete faces[f]);
	return {
		faces,
		edges: {
			intersected,
			collinear: collinear
				.map((overlap, e) => (overlap ? e : undefined))
				.filter(a => a !== undefined),
		},
		vertices: vertices
			.map((overlap, i) => (overlap ? i : undefined))
			.filter(a => a !== undefined),
	};
};
const intersectGraphLine = (graph, line, epsilon = EPSILON) => (
	intersectGraphLineFunc(graph, line, includeL, epsilon)
);
const intersectGraphRay = (graph, ray, epsilon = EPSILON) => (
	intersectGraphLineFunc(graph, ray, includeR, epsilon)
);
const intersectGraphSegment = (graph, segment, epsilon = EPSILON) => (
	intersectGraphLineFunc(
		graph,
		pointsToLine(...segment),
		includeS,
		epsilon,
	)
);const intersect$1=/*#__PURE__*/Object.freeze({__proto__:null,intersectEdgesLineFunc,intersectGraphLine,intersectGraphLineFunc,intersectGraphRay,intersectGraphSegment,intersectVerticesLineFunc});const join = (target, source) => {
	const VEF = Object.keys(singularize);
	const sourceDimension = getDimensionQuick(source);
	const targetDimension = getDimensionQuick(target);
	const sourceKeyArrays = {};
	VEF.forEach(key => {
		const arrayName = filterKeysWithPrefix(source, key).shift();
		sourceKeyArrays[key] = (arrayName !== undefined ? source[arrayName] : []);
	});
	const keyCount = {};
	VEF.forEach(key => { keyCount[key] = count(target, key); });
	const indexMaps = { vertices: [], edges: [], faces: [] };
	VEF.forEach(key => sourceKeyArrays[key]
		.forEach((_, i) => { indexMaps[key][i] = keyCount[key]++; }));
	const sourceClone = clone(source);
	VEF.forEach(key => remapComponent(sourceClone, key, indexMaps[key]));
	Object.keys(sourceClone)
		.filter(key => sourceClone[key].constructor === Array)
		.filter(key => !(key in target))
		.forEach(key => { target[key] = []; });
	Object.keys(sourceClone)
		.filter(key => sourceClone[key].constructor === Array)
		.forEach(key => sourceClone[key]
			.forEach((v, i) => { target[key][i] = v; }));
	const summary = {};
	const targetKeyArrays = {};
	VEF.forEach(key => {
		const arrayName = filterKeysWithPrefix(target, key).shift();
		targetKeyArrays[key] = (arrayName !== undefined ? target[arrayName] : []);
	});
	VEF.forEach(key => {
		const map = targetKeyArrays[key].map(() => 0);
		indexMaps[key].forEach(v => { map[v] = 1; });
		summary[key] = invertArrayMap(map);
	});
	const target2DVertices = sourceDimension !== targetDimension
		? (target.vertices_coords || [])
			.map((coords, i) => (coords.length === 2 ? i : undefined))
			.filter(a => a !== undefined)
		: [];
	target2DVertices.forEach(v => { target.vertices_coords[v][2] = 0; });
	return summary;
};const join$1=/*#__PURE__*/Object.freeze({__proto__:null,join});const pleat=/*#__PURE__*/Object.freeze({__proto__:null});const getEdgesVerticesOverlappingSpan = (graph, epsilon = EPSILON) => (
	makeEdgesBoundingBox(graph, epsilon)
		.map(min_max => graph.vertices_coords
			.map(vert => (
				vert[0] > min_max.min[0]
				&& vert[1] > min_max.min[1]
				&& vert[0] < min_max.max[0]
				&& vert[1] < min_max.max[1])))
);
const getEdgesEdgesOverlapingSpans = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = EPSILON) => {
	const min_max = makeEdgesBoundingBox({ vertices_coords, edges_vertices, edges_coords }, epsilon);
	const span_overlaps = edges_vertices.map(() => []);
	for (let e0 = 0; e0 < edges_vertices.length - 1; e0 += 1) {
		for (let e1 = e0 + 1; e1 < edges_vertices.length; e1 += 1) {
			const outside_of = (
				(min_max[e0].max[0] < min_max[e1].min[0] || min_max[e1].max[0] < min_max[e0].min[0])
				&& (min_max[e0].max[1] < min_max[e1].min[1] || min_max[e1].max[1] < min_max[e0].min[1]));
			span_overlaps[e0][e1] = !outside_of;
			span_overlaps[e1][e0] = !outside_of;
		}
	}
	for (let i = 0; i < edges_vertices.length; i += 1) {
		span_overlaps[i][i] = true;
	}
	return span_overlaps;
};const span=/*#__PURE__*/Object.freeze({__proto__:null,getEdgesEdgesOverlapingSpans,getEdgesVerticesOverlappingSpan});const splitGraphLineFunc = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	line,
	userPoints = [],
	lineFunc = includeL,
	epsilon = EPSILON,
) => {
	if (!vertices_coords || !edges_vertices || !faces_vertices) {
		return { vertices: [], edges: [] };
	}
	const { faces, edges, vertices } = intersectGraphLineFunc(
		{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
		line,
		lineFunc,
		epsilon,
	);
	if (userPoints.length) {
		faces.forEach((_, f) => {
			const poly = faces_vertices[f].map(v => vertices_coords[v]);
			const points = userPoints.map(point => ({
				...overlapConvexPolygonPointNew(poly, point),
				point,
			})).filter(el => el.overlap);
			faces[f].points = points;
		});
	}
	faces.forEach((face, f) => {
		const count = (faces[f].points
			? faces[f].vertices.length + faces[f].edges.length + faces[f].points.length
			: faces[f].vertices.length + faces[f].edges.length);
		if (count < 2) { delete faces[f]; }
	});
	return { faces, edges, vertices };
};
const splitLineWithGraph = (graph, line, epsilon = EPSILON) => (
	splitGraphLineFunc(graph, line, [], includeL, epsilon)
);
const splitRayWithGraph = (graph, ray, epsilon = EPSILON) => (
	splitGraphLineFunc(graph, ray, [ray.origin], includeR, epsilon)
);
const splitSegmentWithGraph = (graph, segment, epsilon = EPSILON) => (
	splitGraphLineFunc(
		graph,
		pointsToLine(...segment),
		segment,
		includeS,
		epsilon,
	)
);const split$1=/*#__PURE__*/Object.freeze({__proto__:null,splitLineWithGraph,splitRayWithGraph,splitSegmentWithGraph});const fixLineDirection = ({ normal, distance }) => (distance < 0
	? ({ normal: flip(normal), distance: -distance })
	: ({ normal, distance }));
const findSymmetryLines = (graph, epsilon = EPSILON) => {
	const { lines } = getEdgesLine(graph, epsilon);
	const uniqueLines = lines.map(vecLineToUniqueLine).map(fixLineDirection);
	const linesMatrices = lines
		.map(({ vector, origin }) => makeMatrix2Reflect(vector, origin));
	const reflectionsLines = linesMatrices
		.map(matrix => lines
			.map(({ vector, origin }) => multiplyMatrix2Line2(matrix, vector, origin)));
	const reflectionsUniqueLines = reflectionsLines
		.map(group => group.map(line => (line.vector[0] < 0
			? ({ vector: flip(line.vector), origin: line.origin })
			: line)))
		.map(group => group.map(vecLineToUniqueLine).map(fixLineDirection))
		.map(group => group.concat(uniqueLines));
	const groupsClusters = reflectionsUniqueLines
		.map(group => clusterScalars(group.map(el => el.distance)));
	const groupsClusterClustersUnindexed = groupsClusters
		.map((clusters, g) => clusters
			.map(cluster => cluster.map(i => reflectionsUniqueLines[g][i].normal))
			.map(cluster => clusterParallelVectors(cluster, epsilon)));
	const groupsClusterClusters = groupsClusterClustersUnindexed
		.map((group, g) => group
			.flatMap((clusters, c) => clusters
				.map(cluster => cluster
					.map(index => groupsClusters[g][c][index]))));
	const groupsError = groupsClusterClusters
		.map(group => (group.length - lines.length) / lines.length);
	return groupsError
		.map((error, i) => ({ error, i }))
		.map(el => ({ line: lines[el.i], error: el.error }))
		.sort((a, b) => a.error - b.error);
};
const findSymmetryLine = (graph, epsilon = EPSILON) => (
	findSymmetryLines(graph, epsilon)[0]
);const symmetry=/*#__PURE__*/Object.freeze({__proto__:null,findSymmetryLine,findSymmetryLines});const makeTriangleFan = (indices) => Array.from(Array(indices.length - 2))
	.map((_, i) => [indices[0], indices[i + 1], indices[i + 2]]);
const triangulateConvexFacesVertices = ({ faces_vertices }) => faces_vertices
	.flatMap(vertices => (vertices.length < 4
		? [vertices]
		: makeTriangleFan(vertices)));
const groupByThree = (array) => (array.length === 3 ? [array] : Array
	.from(Array(Math.floor(array.length / 3)))
	.map((_, i) => [i * 3 + 0, i * 3 + 1, i * 3 + 2]
		.map(j => array[j])));
const triangulateNonConvexFacesVertices = ({ vertices_coords, faces_vertices }, earcut) => {
	if (!vertices_coords || !vertices_coords.length) {
		throw new Error(Messages$1.nonConvexTriangulation);
	}
	const dimensions = vertices_coords.filter(() => true).shift().length;
	return faces_vertices
		.map(fv => fv.flatMap(v => vertices_coords[v]))
		.map(polygon => earcut(polygon, null, dimensions))
		.map((vertices, i) => vertices
			.map(j => faces_vertices[i][j]))
		.flatMap(res => groupByThree(res));
};
const rebuildWithNewFaces = (graph) => {
	if (!graph.edges_vertices) { graph.edges_vertices = []; }
	const edgeLookup = makeVerticesToEdgeBidirectional(graph);
	let e = graph.edges_vertices.length;
	const newEdgesVertices = [];
	graph.faces_edges = graph.faces_vertices
		.map(vertices => vertices
			.map((v, i, arr) => {
				const edge_vertices = [v, arr[(i + 1) % arr.length]];
				const vertexPair = edge_vertices.join(" ");
				if (vertexPair in edgeLookup) { return edgeLookup[vertexPair]; }
				newEdgesVertices.push(edge_vertices);
				edgeLookup[vertexPair] = e;
				edgeLookup[edge_vertices.reverse().join(" ")] = e;
				return e++;
			}));
	const newEdgeCount = newEdgesVertices.length;
	graph.edges_vertices.push(...newEdgesVertices);
	if (graph.edges_assignment) {
		graph.edges_assignment.push(...Array(newEdgeCount).fill("J"));
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle.push(...Array(newEdgeCount).fill(0));
	}
	if (graph.vertices_vertices) { delete graph.vertices_vertices; }
	if (graph.vertices_edges) { delete graph.vertices_edges; }
	if (graph.vertices_faces) { delete graph.vertices_faces; }
	if (graph.edges_faces) { delete graph.edges_faces; }
	if (graph.faces_faces) { delete graph.faces_faces; }
	if (graph.faceOrders) { delete graph.faceOrders; }
	return graph;
};
const makeTriangulatedFacesNextMap = ({ faces_vertices }) => {
	let count = 0;
	return faces_vertices
		.map(verts => Math.max(3, verts.length))
		.map(length => Array.from(Array(length - 2)).map(() => count++));
};
const triangulate = (graph, earcut) => {
	if (!graph.faces_vertices) { return {}; }
	const edgeCount = graph.edges_vertices ? graph.edges_vertices.length : 0;
	const nextMap = makeTriangulatedFacesNextMap(graph);
	graph.faces_vertices = earcut
		? triangulateNonConvexFacesVertices(graph, earcut)
		: triangulateConvexFacesVertices(graph);
	rebuildWithNewFaces(graph);
	const newEdges = Array
		.from(Array(graph.edges_vertices.length - edgeCount))
		.map((_, i) => edgeCount + i);
	return {
		faces: { map: nextMap },
		edges: { new: newEdges },
	};
};const triangulateMethods=/*#__PURE__*/Object.freeze({__proto__:null,triangulate,triangulateConvexFacesVertices,triangulateNonConvexFacesVertices});const identity4x4 = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
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
	if (Math.abs(det) < 1e-12 || Number.isNaN(det)
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
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const rotate = [...identity4x4];
	rotate[i0 * 4 + i0] = cos;
	rotate[i0 * 4 + i1] = (sgn ? +1 : -1) * sin;
	rotate[i1 * 4 + i0] = (sgn ? -1 : +1) * sin;
	rotate[i1 * 4 + i1] = cos;
	const origin3 = [0, 1, 2].map(i => origin[i] || 0);
	const trans = [...identity4x4];
	const trans_inv = [...identity4x4];
	[12, 13, 14].forEach((i, j) => {
		trans[i] = -origin3[j];
		trans_inv[i] = origin3[j];
	});
	return multiplyMatrices4(trans_inv, multiplyMatrices4(rotate, trans));
};
const makeMatrix4RotateX = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 1, 2, true));
const makeMatrix4RotateY = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 0, 2, false));
const makeMatrix4RotateZ = (angle, origin = [0, 0, 0]) => (
	singleAxisRotate4(angle, origin, 0, 1, true));
const makeMatrix4Rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	const pos = [0, 1, 2].map(i => origin[i] || 0);
	const [x, y, z] = resize(3, normalize$1(vector));
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
const makeMatrix4UniformScale = (scale = 1, origin = [0, 0, 0]) => (
	makeMatrix4Scale([scale, scale, scale], origin)
);
const makeMatrix4ReflectZ = (vector, origin = [0, 0]) => {
	const m = makeMatrix2Reflect(vector, origin);
	return [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, m[4], m[5], 0, 1];
};
const makePerspectiveMatrix4 = (FOV, aspect, near, far) => {
	const f = Math.tan(Math.PI * 0.5 - 0.5 * FOV);
	const rangeInv = 1.0 / (near - far);
	const x = aspect < 1 ? f : f / aspect;
	const y = aspect < 1 ? f * aspect : f;
	return [
		x, 0, 0, 0,
		0, y, 0, 0,
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
};const matrix4=/*#__PURE__*/Object.freeze({__proto__:null,determinant4,identity4x4,invertMatrix4,isIdentity4x4,makeLookAtMatrix4,makeMatrix4ReflectZ,makeMatrix4Rotate,makeMatrix4RotateX,makeMatrix4RotateY,makeMatrix4RotateZ,makeMatrix4Scale,makeMatrix4Translate,makeMatrix4UniformScale,makeOrthographicMatrix4,makePerspectiveMatrix4,multiplyMatrices4,multiplyMatrix4Line3,multiplyMatrix4Vector3});const quaternionFromTwoVectors = (u, v) => {
	const w = cross3(u, v);
	const q = [w[0], w[1], w[2], dot(u, v)];
	q[3] += magnitude(q);
	return normalize$1(q);
};
const matrix4FromQuaternion = (quaternion) => multiplyMatrices4([
	quaternion[3], quaternion[2], -quaternion[1], quaternion[0],
	-quaternion[2], quaternion[3], quaternion[0], quaternion[1],
	quaternion[1], -quaternion[0], quaternion[3], quaternion[2],
	-quaternion[0], -quaternion[1], -quaternion[2], quaternion[3],
], [
	quaternion[3], quaternion[2], -quaternion[1], -quaternion[0],
	-quaternion[2], quaternion[3], quaternion[0], -quaternion[1],
	quaternion[1], -quaternion[0], quaternion[3], -quaternion[2],
	quaternion[0], quaternion[1], quaternion[2], quaternion[3],
]);const quaternion=/*#__PURE__*/Object.freeze({__proto__:null,matrix4FromQuaternion,quaternionFromTwoVectors});const coplanarFacesGroups = ({
	vertices_coords, faces_vertices,
}, epsilon = EPSILON) => {
	const faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	const facesNormalMatch = faces_vertices.map(() => []);
	for (let a = 0; a < faces_vertices.length - 1; a += 1) {
		for (let b = a + 1; b < faces_vertices.length; b += 1) {
			if (a === b) { continue; }
			if (parallelNormalized(faces_normal[a], faces_normal[b], epsilon)) {
				facesNormalMatch[a].push(b);
				facesNormalMatch[b].push(a);
			}
		}
	}
	const facesNormalMatchCluster = connectedComponents(facesNormalMatch);
	const normalClustersFaces = invertMap(facesNormalMatchCluster)
		.map(el => (typeof el === "number" ? [el] : el));
	const normalClustersNormal = normalClustersFaces
		.map(faces => faces_normal[faces[0]]);
	const faces_clusterAligned = [];
	normalClustersFaces.forEach((faces, i) => faces.forEach(f => {
		faces_clusterAligned[f] = dot3(faces_normal[f], normalClustersNormal[i]) > 0;
	}));
	const facesOneVertex = faces_vertices
		.map(fv => vertices_coords[fv[0]])
		.map(point => resize(3, point));
	const normalClustersFacesDot = normalClustersFaces
		.map((faces, i) => faces
			.map(f => dot3(normalClustersNormal[i], facesOneVertex[f])));
	const clustersClusters = normalClustersFacesDot
		.map((dots, i) => clusterScalars(dots)
			.map(cluster => cluster.map(index => normalClustersFaces[i][index])));
	const clustersNormal = clustersClusters
		.flatMap((cluster, i) => cluster
			.map(() => [...normalClustersNormal[i]]));
	const clusters = clustersClusters.flat();
	const clustersOrigin = clusters
		.map(faces => faces[0])
		.map(face => facesOneVertex[face])
		.map((point, i) => dot3(clustersNormal[i], point))
		.map((mag, i) => scale3(clustersNormal[i], mag));
	const clustersPlane = clusters.map((_, i) => ({
		normal: clustersNormal[i],
		origin: clustersOrigin[i],
	}));
	return clusters.map((faces, i) => ({
		faces,
		facesAligned: faces.map(f => faces_clusterAligned[f]),
		plane: clustersPlane[i],
	}));
};
const makeFacesPolygon2D = (graph, coplanarFaces, transforms, epsilon) => {
	const vertices_coords3D = graph.vertices_coords
		.map(coord => resize(3, coord));
	const planarSets_polygons3D = coplanarFaces
		.map(cluster => cluster.faces
			.map((f, i) => (cluster.facesAligned[i]
				? graph.faces_vertices[f]
				: graph.faces_vertices[f].slice().reverse()))
			.map(verts => verts.map(v => vertices_coords3D[v]))
			.map(polygon => makePolygonNonCollinear(polygon, epsilon)));
	const faces_polygon = [];
	const planarSets_polygons2D = planarSets_polygons3D
		.map((cluster, i) => cluster
			.map(points => points
				.map(point => multiplyMatrix4Vector3(transforms[i], point))
				.map(point => [point[0], point[1]])));
	coplanarFaces
		.map(cluster => cluster.faces)
		.forEach((faces, i) => faces
			.forEach((face, j) => {
				faces_polygon[face] = planarSets_polygons2D[i][j];
			}));
	return faces_polygon;
};
const coplanarOverlappingFacesGroups = ({
	vertices_coords, faces_vertices, faces_faces,
}, epsilon = EPSILON) => {
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	const coplanarFaces = coplanarFacesGroups(
		{ vertices_coords, faces_vertices },
		epsilon,
	);
	const faces_winding = [];
	coplanarFaces.forEach(cluster => cluster.facesAligned
		.forEach((aligned, j) => { faces_winding[cluster.faces[j]] = aligned; }));
	const targetVector = [0, 0, 1];
	const transforms = coplanarFaces
		.map(cluster => cluster.plane.normal)
		.map(normal => {
			const d = dot(normal, targetVector);
			return (Math.abs(d + 1) < 1e-2)
				? makeMatrix4Rotate(Math.PI, [1, 0, 0])
				: matrix4FromQuaternion(quaternionFromTwoVectors(normal, targetVector));
		});
	const faces_polygon = makeFacesPolygon2D(
		{ vertices_coords, faces_vertices },
		coplanarFaces,
		transforms,
		epsilon,
	);
	const planarSets_faces_faces = coplanarFaces
		.map(el => el.faces)
		.map(faces => selfRelationalArraySubset(faces_faces, faces));
	const planarSets_faces_set = planarSets_faces_faces
		.map(f_f => connectedComponents(f_f));
	const planarSets_sets_faces = planarSets_faces_set
		.map(faces => invertMap(faces)
			.map(res => (res.constructor === Array ? res : [res])));
	const planarSets_disjointSetsOtherFaces = planarSets_faces_set
		.map(faces_group => {
			const faces = faces_group.map((_, i) => i);
			return faces_group.map(groupIndex => faces
				.filter(face => faces_group[face] !== groupIndex));
		});
	const faces_facesOverlap = faces_vertices.map(() => []);
	planarSets_disjointSetsOtherFaces
		.forEach(planarSet => planarSet.forEach((otherFaces, face) => {
			for (let f = 0; f < otherFaces.length; f += 1) {
				const otherFace = otherFaces[f];
				const polygons = [face, otherFace]
					.map(i => faces_polygon[i]);
				const overlap = overlapConvexPolygons(...polygons, epsilon);
				if (overlap) {
					faces_facesOverlap[face][otherFace] = true;
					faces_facesOverlap[otherFace][face] = true;
				}
			}
		}));
	const planarSets_overlapping_faces_faces = planarSets_disjointSetsOtherFaces
		.map(group => group.map((faces, f) => faces.filter(face => faces_facesOverlap[f][face])));
	const planarSets_overlapping_sets_sets = [];
	planarSets_overlapping_faces_faces
		.forEach((overlapFaces_faces, s) => {
			planarSets_overlapping_sets_sets[s] = [];
			overlapFaces_faces.forEach((values, key) => {
				const thisSet = planarSets_faces_set[s][key];
				const otherSets = values.map(f => planarSets_faces_set[s][f]);
				if (!planarSets_overlapping_sets_sets[s][thisSet]) {
					planarSets_overlapping_sets_sets[s][thisSet] = new Set();
				}
				otherSets.forEach(v => {
					if (!planarSets_overlapping_sets_sets[s][v]) {
						planarSets_overlapping_sets_sets[s][v] = new Set();
					}
				});
				otherSets.forEach(v => {
					planarSets_overlapping_sets_sets[s][thisSet].add(v);
					planarSets_overlapping_sets_sets[s][v].add(thisSet);
				});
			});
		});
	planarSets_overlapping_sets_sets
		.forEach((sets, i) => sets
			.forEach((set, j) => {
				planarSets_overlapping_sets_sets[i][j] = [...set];
			}));
	const planarSets_disjointSetsSets = planarSets_overlapping_sets_sets
		.map(set_set => invertMap(connectedComponents(set_set))
			.map(sets => (sets.constructor === Array ? sets : [sets])));
	const newSets_originalSet = planarSets_disjointSetsSets
		.flatMap((arrays, i) => arrays.map(() => i));
	const planarSets_faces = coplanarFaces
		.map((el, i) => planarSets_disjointSetsSets[i]
			.map(set => set.flatMap(s => planarSets_sets_faces[i][s])));
	const coplanarOverlappingFaces = planarSets_faces
		.flatMap((set, s) => set
			.map(faces => ({
				faces,
				facesAligned: faces.map(f => faces_winding[f]),
				plane: coplanarFaces[s].plane,
			})));
	const sets_plane = newSets_originalSet.map(i => coplanarFaces[i].plane);
	const sets_transformXY = newSets_originalSet.map(i => transforms[i]);
	const sets_faces = coplanarOverlappingFaces.map(sets => sets.faces);
	const faces_set = invertMap(sets_faces);
	return {
		sets_faces,
		sets_plane,
		sets_transformXY,
		faces_set,
		faces_winding,
	};
};const facesCoplanar=/*#__PURE__*/Object.freeze({__proto__:null,coplanarFacesGroups,coplanarOverlappingFacesGroups});const makeEdgesEdgesParallel = ({
	vertices_coords, edges_vertices, edges_vector,
}, normalizedEpsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const normalized = edges_vector.map(vec => normalize$1(vec));
	const edgesEdgesParallel = edges_vertices.map(() => []);
	normalized.forEach((_, i) => {
		normalized.forEach((__, j) => {
			if (j >= i) { return; }
			if ((1 - Math.abs(dot(normalized[i], normalized[j])) < normalizedEpsilon)) {
				edgesEdgesParallel[i].push(j);
				edgesEdgesParallel[j].push(i);
			}
		});
	});
	return edgesEdgesParallel;
};
const makeEdgesEdgesParallelOverlap = ({
	vertices_coords, edges_vertices, edges_vector,
}, epsilon) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	const edges_line = edges_vector
		.map((vector, i) => ({ vector, origin: edges_origin[i] }));
	return makeEdgesEdgesParallel({
		vertices_coords, edges_vertices, edges_vector,
	}, 1e-3).map((arr, i) => arr.filter(j => overlapLineLine(
		edges_line[i],
		edges_line[j],
		excludeS,
		excludeS,
		epsilon,
	)));
};const intersectEdgesEdges=/*#__PURE__*/Object.freeze({__proto__:null,makeEdgesEdgesParallelOverlap});const booleanMatrixToIndexedArray = matrix => matrix
	.map(row => row
		.map((value, i) => (value === true ? i : undefined))
		.filter(a => a !== undefined));
const makeEdgesEdgesSimilar = ({
	vertices_coords, edges_vertices, edges_coords, edges_boundingBox,
}, epsilon = EPSILON) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	if (!edges_boundingBox) {
		edges_boundingBox = makeEdgesBoundingBox({
			vertices_coords, edges_vertices, edges_coords,
		});
	}
	const indexFirst = edges_vertices.map((_, i) => i).shift();
	const matrix = Array.from(Array(edges_coords.length)).map(() => []);
	if (indexFirst === undefined) { return booleanMatrixToIndexedArray(matrix); }
	const dimensions = edges_boundingBox[indexFirst].min.length;
	for (let i = 0; i < edges_coords.length - 1; i += 1) {
		if (!edges_boundingBox[i]) { continue; }
		for (let j = i + 1; j < edges_coords.length; j += 1) {
			if (!edges_boundingBox[j]) { continue; }
			let similar = true;
			for (let d = 0; d < dimensions; d += 1) {
				if (!epsilonEqual(
					edges_boundingBox[i].min[d],
					edges_boundingBox[j].min[d],
					epsilon,
				) || !epsilonEqual(
					edges_boundingBox[i].max[d],
					edges_boundingBox[j].max[d],
					epsilon,
				)) {
					similar = false;
				}
			}
			matrix[i][j] = similar;
			matrix[j][i] = similar;
		}
	}
	for (let i = 0; i < edges_coords.length - 1; i += 1) {
		for (let j = i + 1; j < edges_coords.length; j += 1) {
			if (!matrix[i][j]) { continue; }
			const test0 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][0], epsilon)
				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][1], epsilon);
			const test1 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][1], epsilon)
				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][0], epsilon);
			const similar = test0 || test1;
			matrix[i][j] = similar;
			matrix[j][i] = similar;
		}
	}
	return booleanMatrixToIndexedArray(matrix);
};
const getEdgesFacesOverlap = ({
	vertices_coords, edges_vertices, edges_vector, edges_faces, faces_vertices,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
	const matrix = edges_vertices
		.map(() => Array.from(Array(faces_vertices.length)));
	edges_faces.forEach((faces, e) => faces
		.forEach(f => { matrix[e][f] = false; }));
	const edges_coords = edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	const faces_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	makeFacesWinding({ vertices_coords, faces_vertices })
		.map((winding, i) => (!winding ? i : undefined))
		.filter(f => f !== undefined)
		.forEach(f => faces_coords[f].reverse());
	const edges_boundingBox = makeEdgesBoundingBox({ edges_coords });
	const faces_bounds = faces_coords.map(coords => boundingBox$1(coords));
	for (let e = 0; e < matrix.length; e += 1) {
		if (!edges_boundingBox[e]) { continue; }
		for (let f = 0; f < matrix[e].length; f += 1) {
			if (matrix[e][f] === false) { continue; }
			if (!faces_bounds[f]) { continue; }
			if (!overlapBoundingBoxes(faces_bounds[f], edges_boundingBox[e], epsilon)) {
				matrix[e][f] = false;
				continue;
			}
		}
	}
	const edges_similar = makeEdgesEdgesSimilar({
		vertices_coords, edges_vertices, edges_coords, edges_boundingBox,
	});
	const finished_edges = {};
	for (let e = 0; e < matrix.length; e += 1) {
		if (finished_edges[e]) { continue; }
		if (!edges_coords[e]) { continue; }
		for (let f = 0; f < matrix[e].length; f += 1) {
			if (matrix[e][f] !== undefined) { continue; }
			if (!faces_coords[f]) { continue; }
			const point_in_poly = edges_coords[e]
				.map(point => overlapConvexPolygonPoint(
					faces_coords[f],
					point,
					exclude,
					1e-3,
				)).reduce((a, b) => a || b, false);
			if (point_in_poly) { matrix[e][f] = true; continue; }
			const edge_intersect = intersectConvexPolygonLine(
				faces_coords[f],
				{ vector: edges_vector[e], origin: edges_origin[e] },
				excludeS,
				excludeS,
				epsilon,
			);
			if (edge_intersect) { matrix[e][f] = true; continue; }
			matrix[e][f] = false;
		}
		edges_similar[e].forEach(adjacent_edge => {
			matrix[adjacent_edge] = matrix[e].slice();
			finished_edges[adjacent_edge] = true;
		});
	}
	return matrix
		.map(faces => faces
			.map((overlap, i) => (overlap ? i : undefined))
			.filter(i => i !== undefined));
};const intersectEdgesFaces=/*#__PURE__*/Object.freeze({__proto__:null,getEdgesFacesOverlap});const getFacesFacesOverlap = ({
	vertices_coords, faces_vertices,
}, epsilon = EPSILON) => {
	const facesPolygon = makeFacesPolygon({ vertices_coords, faces_vertices });
	const facesBounds = facesPolygon.map(polygon => boundingBox$1(polygon));
	const intersections = [];
	const setOfFaces = [];
	sweepFaces({ vertices_coords, faces_vertices }, 0, epsilon)
		.forEach(event => {
			event.start.forEach(e => { setOfFaces[e] = true; });
			setOfFaces
				.forEach((_, f1) => event.start
					.forEach(f2 => {
						if (f1 === f2) { return; }
						if (!overlapBoundingBoxes(facesBounds[f1], facesBounds[f2], epsilon)
							|| !overlapConvexPolygons(facesPolygon[f1], facesPolygon[f2], epsilon)) {
							return;
						}
						if (!intersections[f1]) { intersections[f1] = []; }
						if (!intersections[f2]) { intersections[f2] = []; }
						intersections[f1][f2] = true;
						intersections[f2][f1] = true;
					}));
			event.end.forEach(e => delete setOfFaces[e]);
		});
	return intersections.map(faces => Object.keys(faces).map(n => parseInt(n, 10)));
};const intersectFacesFaces=/*#__PURE__*/Object.freeze({__proto__:null,getFacesFacesOverlap});const addVertex = (graph, coords) => {
	if (!graph.vertices_coords) {
		graph.vertices_coords = [];
	}
	const index = graph.vertices_coords.length;
	filterKeysWithPrefix(graph, "vertices")
		.forEach(key => { graph[key][index] = []; });
	graph.vertices_coords[index] = coords;
	return index;
};const addNonPlanarEdge = (graph, vertices) => {
	if (vertices.length !== 2) { return undefined; }
	if (!graph.edges_vertices) {
		graph.edges_vertices = [];
	}
	const index = graph.edges_vertices.length;
	filterKeysWithPrefix(graph, "edges")
		.forEach(key => { graph[key][index] = []; });
	graph.edges_vertices[index] = vertices;
	if (graph.edges_assignment) {
		graph.edges_assignment[index] = "U";
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle[index] = 0;
	}
	if (graph.vertices_edges) {
		vertices.forEach(v => {
			graph.vertices_edges[v] = graph.vertices_edges[v]
				.filter(e => e !== index);
			graph.vertices_edges[v].push(index);
		});
	}
	if (graph.vertices_vertices) {
		const opposite = [vertices[1], vertices[0]];
		vertices.forEach((v, i) => {
			graph.vertices_vertices[v] = graph.vertices_vertices[v]
				.filter(vert => vert !== opposite[i]);
			graph.vertices_vertices[v].push(opposite[i]);
		});
	}
	return index;
};const addPlanarLine = (graph, { vector, origin }, epsilon = EPSILON) => {
	const points = getEdgesLineIntersection(graph, { vector, origin }, epsilon)
		.map(el => el.point)
		.filter(Boolean);
	const dots = points
		.map(p => subtract(p, origin))
		.map(vec => dot(vec, vector));
	const uniqueParams = epsilonUniqueSortedNumbers(dots);
	const uniquePoints = uniqueParams
		.map(t => add(scale$1(vector, t), origin));
	const results = Array.from(Array(uniquePoints.length - 1))
		.map((_, i) => [uniquePoints[i], uniquePoints[i + 1]])
		.map(seg => addPlanarSegment(graph, seg[0], seg[1], epsilon));
	return results;
};const addSegmentInsideFace = (graph, face, segment, epsilon = EPSILON) => {
	graph.faces_vertices[face]
		.map(v => graph.vertices_coords[v])
		.map(point => segment.map(p => epsilonEqualVectors(point, p, epsilon)));
	graph.faces_vertices[face]
		.map(v => graph.vertices_coords[v])
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(seg => pointsToLine(...seg))
		.map(line => segment
			.map(point => overlapLinePoint(line, point, excludeS, epsilon)));
};
const makeFacesSegment = (graph, segment, epsilon = EPSILON) => {
	const vector = subtract2(segment[1], segment[0]);
	const origin = segment[0];
	const faces = getFacesSegmentOverlap(graph, segment, epsilon);
	const clippings = faces
		.map(f => graph.faces_vertices[f].map(v => graph.vertices_coords[v]))
		.map(poly => clipLineConvexPolygon(poly, { vector, origin }, include, includeS, epsilon));
	const facesSegment = [];
	faces.forEach((f, i) => {
		if (clippings[i]) {
			facesSegment[f] = clippings[i];
		}
	});
	return facesSegment;
};
const addPlanarSegmentNew = (graph, segment, epsilon = EPSILON) => {
	const facesSegment = makeFacesSegment(graph, segment, epsilon);
	console.log("facesSegment", facesSegment);
	const result = facesSegment
		.map((seg, face) => addSegmentInsideFace(graph, face, seg, epsilon));
	return result;
};const normalize = (graph) => {
	const maps = { vertices: [], edges: [], faces: [] };
	let v = 0;
	let e = 0;
	let f = 0;
	graph.vertices_coords.forEach((_, i) => { maps.vertices[i] = v++; });
	graph.edges_vertices.forEach((_, i) => { maps.edges[i] = e++; });
	graph.faces_vertices.forEach((_, i) => { maps.faces[i] = f++; });
	remapKey(graph, "vertices", maps.vertices);
	remapKey(graph, "edges", maps.edges);
	remapKey(graph, "faces", maps.faces);
	return graph;
};const getFaceContainingPoint = (
	{ vertices_coords, faces_vertices },
	point,
	vector,
) => {
	const facesInclusive = facesContainingPoint(
		{ vertices_coords, faces_vertices },
		point,
		include,
	);
	switch (facesInclusive.length) {
	case 0: return undefined;
	case 1: return facesInclusive[0];
	}
	if (!vector) { return facesInclusive[0]; }
	const nudgePoint = add2(point, scale2(vector, 1e-2));
	const polygons = facesInclusive
		.map(face => faces_vertices[face]
			.map(v => vertices_coords[v]));
	const facesExclusive = facesInclusive
		.filter((face, i) => overlapConvexPolygonPoint(polygons[i], nudgePoint, exclude));
	switch (facesExclusive.length) {
	case 0: return facesInclusive
		.filter((face, i) => overlapConvexPolygonPoint(polygons[i], nudgePoint, include))
		.shift();
	case 1: return facesExclusive[0];
	default: return facesExclusive[0];
	}
};const repeatFoldLine = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment,
	faces_vertices, faces_edges, faces_faces,
}, { vector, origin }, assignment = "V", epsilon = EPSILON) => {
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	const startFace = getFaceContainingPoint(
		{ vertices_coords, faces_vertices },
		origin,
		vector,
	);
	const oppositeAssignment = invertAssignment(assignment);
	const vertices_coordsFolded = makeVerticesCoordsFlatFolded({
		vertices_coords,
		edges_vertices,
		edges_foldAngle,
		edges_assignment,
		faces_vertices,
		faces_faces,
	}, startFace);
	const faces_winding = makeFacesWinding({
		vertices_coords: vertices_coordsFolded,
		faces_vertices,
	});
	if (!faces_winding[startFace]) {
		faces_winding.forEach((w, i) => { faces_winding[i] = !w; });
	}
	const edgesIntersections = getEdgesLineIntersection(
		{ vertices_coords: vertices_coordsFolded, edges_vertices },
		{ vector, origin },
		epsilon,
	).map((el, edge) => (el.point === undefined ? undefined : { ...el, edge }));
	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	const edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	const facesPreCluster = [];
	faces_edges
		.map(edges => edges
			.map(edge => edgesIntersections[edge])
			.filter(a => a !== undefined))
		.forEach((solutions, f) => {
			switch (solutions.length) {
			case 0:
			case 1: break;
			default: facesPreCluster[f] = solutions; break;
			}
		});
	const epsilonEqual = (a, b) => Math.abs(a.b - b.b) < epsilon * 2;
	const faces_solution = [];
	facesPreCluster
		.map(solutions => solutions.sort((a, b) => a.b - b.b))
		.map(solutions => clusterSortedGeneric(solutions, epsilonEqual)
			.map(cluster => cluster.map(index => solutions[index])))
		.forEach((clusters, f) => {
			if (clusters.length === 2) {
				faces_solution[f] = [clusters[0][0], clusters[clusters.length - 1][0]];
			}
			if (clusters.length > 2) {
				console.log("repeatFoldLine, non-convex polygons.");
			}
		});
	return faces_solution.map((solutions, f) => ({
		edges: solutions.map(el => el.edge),
		assignment: faces_winding[f] ? assignment : oppositeAssignment,
		points: solutions.map(solution => add2(
			scale2(edges_vector[solution.edge], solution.a),
			edges_origin[solution.edge],
		)),
	}));
};const graphMethods = {
	count,
	countImplied,
	validate,
	clean,
	populate,
	remove: removeGeometryIndices,
	replace: replaceGeometryIndices,
	removePlanarVertex,
	removePlanarEdge,
	splitEdge,
	splitFace,
	flatFold,
	normalize,
	repeatFold: repeatFoldLine,
	addVertex,
	addNonPlanarEdge,
	addPlanarLine,
	addPlanarSegment,
	addPlanarSegmentNew,
	planarize,
	...connectedComponents$1,
	...foldColors,
	...foldFileFrames,
	...foldKeyMethods,
	...foldSpecMethods,
	...boundary$1,
	...clip,
	...explodeMethods,
	...flaps,
	...intersect$1,
	...join$1,
	...make,
	...maps,
	...nearestMethods,
	...normals,
	...orders,
	...pleat,
	...span,
	...split$1,
	...subgraphMethods,
	...sweep$1,
	...symmetry,
	...directedGraph,
	...disjoint,
	...transform$1,
	...trees,
	...triangulateMethods,
	...walk,
	...verticesClusters,
	...verticesCollinear,
	...verticesDuplicate,
	...verticesFolded,
	...verticesIsolated,
	...verticesSort,
	...edgesCircular,
	...edgesDuplicate,
	...edgesGeneral,
	...edgesLines$1,
	...facesCoplanar,
	...facesGeneral,
	...facesMatrix,
	...facesWinding,
	...intersectVertices,
	...intersectEdges,
	...intersectEdgesEdges,
	...intersectEdgesFaces,
	...intersectFaces,
	...intersectFacesFaces,
};const smallestVector2 = (points, epsilon = EPSILON) => {
	if (!points || !points.length) { return undefined; }
	const comparison = (a, b) => epsilonCompare(a[0], b[0], epsilon);
	const smallSet = minimumCluster(points, comparison);
	let sm = 0;
	for (let i = 1; i < smallSet.length; i += 1) {
		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
	}
	return smallSet[sm];
};
const convexHullRadialSortPoints = (points, epsilon = EPSILON) => {
	const first = smallestVector2(points, epsilon);
	if (first === undefined) { return []; }
	const angles = points
		.map(p => subtract2(p, points[first]))
		.map(v => normalize2(v))
		.map(vec => dot2([0, 1], vec));
	const rawOrder = angles
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.filter(i => i !== first);
	return [[first]]
		.concat(clusterScalars(rawOrder.map(i => angles[i]), epsilon)
			.map(arr => arr.map(i => rawOrder[i]))
			.map(cluster => (cluster.length === 1 ? cluster : cluster
				.map(i => ({ i, len: distance2(points[i], points[first]) }))
				.sort((a, b) => a.len - b.len)
				.map(el => el.i))));
};
const convexHull = (points = [], includeCollinear = false, epsilon = EPSILON) => {
	if (points.length < 2) { return []; }
	const order = convexHullRadialSortPoints(points, epsilon)
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
};const convexHullMethods=/*#__PURE__*/Object.freeze({__proto__:null,convexHull,convexHullRadialSortPoints,smallestVector2});const recurseSkeleton = (points, lines, bisectors) => {
	const intersects = points
		.map((origin, i) => ({ vector: bisectors[i], origin }))
		.map((ray, i, arr) => intersectLineLine(
			ray,
			arr[(i + 1) % arr.length],
			excludeR,
			excludeR,
		).point);
	const projections = lines.map((line, i) => (
		nearestPointOnLine(line, intersects[i], a => a)
	));
	if (points.length === 3) {
		return points.map(p => ({ type: "skeleton", points: [p, intersects[0]] }))
			.concat([{ type: "perpendicular", points: [projections[0], intersects[0]] }]);
	}
	const projectionLengths = intersects
		.map((intersect, i) => distance(intersect, projections[i]));
	let shortest = 0;
	projectionLengths.forEach((len, i) => {
		if (len < projectionLengths[shortest]) { shortest = i; }
	});
	const solutions = [
		{
			type: "skeleton",
			points: [points[shortest], intersects[shortest]],
		},
		{
			type: "skeleton",
			points: [points[(shortest + 1) % points.length], intersects[shortest]],
		},
		{ type: "perpendicular", points: [projections[shortest], intersects[shortest]] },
	];
	const newVector = clockwiseBisect2(
		flip(lines[(shortest + lines.length - 1) % lines.length].vector),
		lines[(shortest + 1) % lines.length].vector,
	);
	const shortest_is_last_index = shortest === points.length - 1;
	points.splice(shortest, 2, intersects[shortest]);
	lines.splice(shortest, 1);
	bisectors.splice(shortest, 2, newVector);
	if (shortest_is_last_index) {
		points.splice(0, 1);
		bisectors.splice(0, 1);
		lines.push(lines.shift());
	}
	return solutions.concat(recurseSkeleton(points, lines, bisectors));
};
const straightSkeleton = (points) => {
	const lines = points
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
		.map(side => ({ vector: subtract(side[1], side[0]), origin: side[0] }));
	const bisectors = points
		.map((_, i, ar) => [(i - 1 + ar.length) % ar.length, i, (i + 1) % ar.length]
			.map(j => ar[j]))
		.map(p => [subtract(p[0], p[1]), subtract(p[2], p[1])])
		.map(v => clockwiseBisect2(...v));
	return recurseSkeleton([...points], lines, bisectors);
};const trilateration = (pts, radii) => {
	if (pts[0] === undefined || pts[1] === undefined || pts[2] === undefined) {
		return undefined;
	}
	const ex = scale2(subtract2(pts[1], pts[0]), 1 / distance2(pts[1], pts[0]));
	const i = dot2(ex, subtract2(pts[2], pts[0]));
	const exi = scale2(ex, i);
	const p2p0exi = subtract2(subtract2(pts[2], pts[0]), exi);
	const ey = scale2(p2p0exi, (1 / magnitude2(p2p0exi)));
	const d = distance2(pts[1], pts[0]);
	const j = dot2(ey, subtract2(pts[2], pts[0]));
	const x = ((radii[0] ** 2) - (radii[1] ** 2) + (d ** 2)) / (2 * d);
	const y = ((radii[0] ** 2) - (radii[2] ** 2) + (i ** 2) + (j ** 2)) / (2 * j) - ((i * x) / j);
	return add2(add2(pts[0], scale2(ex, x)), scale2(ey, y));
};
const circumcircle = (a, b, c) => {
	const A = b[0] - a[0];
	const B = b[1] - a[1];
	const C = c[0] - a[0];
	const D = c[1] - a[1];
	const E = A * (a[0] + b[0]) + B * (a[1] + b[1]);
	const F = C * (a[0] + c[0]) + D * (a[1] + c[1]);
	const G = 2 * (A * (c[1] - b[1]) - B * (c[0] - b[0]));
	if (Math.abs(G) < EPSILON) {
		const minx = Math.min(a[0], b[0], c[0]);
		const miny = Math.min(a[1], b[1], c[1]);
		const dx = (Math.max(a[0], b[0], c[0]) - minx) * 0.5;
		const dy = (Math.max(a[1], b[1], c[1]) - miny) * 0.5;
		return {
			origin: [minx + dx, miny + dy],
			radius: Math.sqrt(dx * dx + dy * dy),
		};
	}
	const origin = [(D * E - B * F) / G, (A * F - C * E) / G];
	const dx = origin[0] - a[0];
	const dy = origin[1] - a[1];
	return {
		origin,
		radius: Math.sqrt(dx * dx + dy * dy),
	};
};const triangle=/*#__PURE__*/Object.freeze({__proto__:null,circumcircle,trilateration});const pointInBoundingBox = (point, box, epsilon = EPSILON) => {
	for (let d = 0; d < point.length; d += 1) {
		if (point[d] < box.min[d] - epsilon
			|| point[d] > box.max[d] + epsilon) {
			return false;
		}
	}
	return true;
};
const enclosingBoundingBoxes = (outer, inner, epsilon = EPSILON) => {
	const dimensions = Math.min(outer.min.length, inner.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (inner.min[d] < outer.min[d] - epsilon
			|| inner.max[d] > outer.max[d] + epsilon) {
			return false;
		}
	}
	return true;
};const encloses=/*#__PURE__*/Object.freeze({__proto__:null,enclosingBoundingBoxes,pointInBoundingBox});const splitConvexPolygon = (poly, line) => {
	const vertices_intersections = poly.map((v, i) => {
		const intersection = overlapLinePoint(line, v, includeL);
		return { point: intersection ? v : null, at_index: i };
	}).filter(el => el.point != null);
	const edges_intersections = poly
		.map((v, i, arr) => ({
			vector: subtract(v, arr[(i + 1) % arr.length]),
			origin: arr[(i + 1) % arr.length],
		}))
		.map((polyLine, i) => ({
			point: intersectLineLine(line, polyLine, excludeL, excludeS).point,
			at_index: i,
		}))
		.filter(el => el.point != null);
	if (edges_intersections.length === 2) {
		const sorted_edges = edges_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly
			.slice(sorted_edges[1].at_index + 1)
			.concat(poly.slice(0, sorted_edges[0].at_index + 1));
		face_a.push(sorted_edges[0].point);
		face_a.push(sorted_edges[1].point);
		const face_b = poly
			.slice(sorted_edges[0].at_index + 1, sorted_edges[1].at_index + 1);
		face_b.push(sorted_edges[1].point);
		face_b.push(sorted_edges[0].point);
		return [face_a, face_b];
	}
	if (edges_intersections.length === 1 && vertices_intersections.length === 1) {
		vertices_intersections[0].type = "v";
		edges_intersections[0].type = "e";
		const sorted_geom = vertices_intersections.concat(edges_intersections)
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly.slice(sorted_geom[1].at_index + 1)
			.concat(poly.slice(0, sorted_geom[0].at_index + 1));
		if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
		face_a.push(sorted_geom[1].point);
		const face_b = poly
			.slice(sorted_geom[0].at_index + 1, sorted_geom[1].at_index + 1);
		if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
		face_b.push(sorted_geom[0].point);
		return [face_a, face_b];
	}
	if (vertices_intersections.length === 2) {
		const sorted_vertices = vertices_intersections.slice()
			.sort((a, b) => a.at_index - b.at_index);
		const face_a = poly
			.slice(sorted_vertices[1].at_index)
			.concat(poly.slice(0, sorted_vertices[0].at_index + 1));
		const face_b = poly
			.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index + 1);
		return [face_a, face_b];
	}
	return [poly.slice()];
};const split=/*#__PURE__*/Object.freeze({__proto__:null,splitConvexPolygon});const typeOf = (obj) => {
	if (typeof obj !== "object") { return typeof obj; }
	if (obj.radius !== undefined) { return "circle"; }
	if (obj.min && obj.max && obj.span) { return "box"; }
	if (typeof obj[0] === "number") { return "vector"; }
	if (obj.vector !== undefined && obj.origin !== undefined) { return "line"; }
	if (obj[0] !== undefined && obj[0].length && typeof obj[0][0] === "number") {
		return obj.length === 2 ? "segment" : "polygon";
	}
	return "object";
};const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
const defaultDomain = {
	polygon: includeS,
	circle: include,
	line: includeL,
	ray: includeR,
	segment: includeS,
};
const intersect = (a, b, epsilon = EPSILON) => {
	const nameType = s => (s === "polygon" ? "ConvexPolygon" : capitalize(s));
	const types = [a, b].map(typeOf);
	const methods = [types, types.slice().reverse()]
		.map(pair => pair.map(nameType).join(""))
		.map(str => intersectMethods[`intersect${str}`]);
	const doms = [a.domain, b.domain]
		.map((d, i) => d || defaultDomain[types[i]]);
	const parameters = [[a, b, ...doms], [b, a, ...doms.slice().reverse()]];
	const match = methods
		.map((fn, i) => ({ fn, params: parameters[i] }))
		.filter(el => el.fn)
		.shift();
	return match ? match.fn(...match.params, epsilon) : undefined;
};const math = {
	...constant,
	...convert$2,
	...compare,
	...vector,
	...matrix2,
	...matrix3,
	...matrix4,
	...quaternion,
	...convexHullMethods,
	...lineMethods,
	...nearestMethods$1,
	...planeMethods,
	...polygonMethods,
	...radialMethods,
	straightSkeleton,
	...triangle,
	...encloses,
	...overlapMethods,
	...intersectMethods,
	...clip$1,
	...split,
	intersect,
};const oddAssignmentIndex = (assignments) => {
	const assigns = assignments.map(a => a.toUpperCase());
	const mountainCount = assigns.filter(a => a === "M").length;
	const valleyCount = assigns.filter(a => a === "V").length;
	return mountainCount > valleyCount
		? assigns.indexOf("V")
		: assigns.indexOf("M");
};
const foldDegree4 = (sectors, assignments, foldAngle = 0) => {
	const odd = oddAssignmentIndex(assignments);
	if (odd === -1) { return undefined; }
	const a = sectors[(odd + 1) % sectors.length];
	const b = sectors[(odd + 2) % sectors.length];
	const pbc = Math.max(-Math.PI, Math.min(Math.PI, foldAngle));
	const cosE = -Math.cos(a) * Math.cos(b)
		+ Math.sin(a) * Math.sin(b) * Math.cos(Math.PI - pbc);
	const res = Math.cos(Math.PI - pbc)
		- ((Math.sin(Math.PI - pbc) ** 2) * Math.sin(a) * Math.sin(b))
		/ (1 - cosE);
	const pab = -Math.acos(res) + Math.PI;
	return (odd % 2 === 0
		? [pab, pbc, pab, pbc].map((n, i) => (odd === i ? -n : n))
		: [pbc, pab, pbc, pab].map((n, i) => (odd === i ? -n : n)));
};const degree4=/*#__PURE__*/Object.freeze({__proto__:null,foldDegree4});const verticesFoldable = ({
	vertices_coords, vertices_vertices, vertices_edges, vertices_faces,
	edges_vertices, edges_foldAngle, edges_vector, faces_vertices,
}, epsilon = EPSILON) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({
			vertices_coords, vertices_edges, vertices_faces, edges_vertices, faces_vertices,
		});
	}
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdges({ edges_vertices, vertices_vertices });
	}
	if (!vertices_faces) {
		vertices_faces = makeVerticesFaces({ vertices_coords, vertices_vertices, faces_vertices });
	}
	const vertices_vectors = makeVerticesVerticesVector({
		vertices_coords,
		vertices_vertices,
		vertices_edges,
		vertices_faces,
		edges_vertices,
		edges_vector,
		faces_vertices,
	});
	return vertices_coords.map((_, v) => {
		if (vertices_faces[v].includes(undefined)
			|| vertices_faces[v].includes(null)) { return true; }
		const edgesAngles = vertices_vectors[v]
			.map(vec => Math.atan2(vec[1], vec[0]));
		const edgesFoldAngle = vertices_edges[v]
			.map(e => edges_foldAngle[e])
			.map(angle => angle * D2R);
		const aM = edgesAngles.map(a => makeMatrix3RotateZ(a));
		const aiM = aM.map(m => invertMatrix3(m));
		const fM = edgesFoldAngle.map(a => makeMatrix3RotateX(a));
		const localMatrices = vertices_vectors[v].map((__, i) => multiplyMatrices3(
			aM[i],
			multiplyMatrices3(fM[i], aiM[i]),
		));
		let matrix = identity3x4;
		localMatrices.forEach(m => { matrix = multiplyMatrices3(matrix, m); });
		return Array.from(Array(9))
			.map((__, i) => Math.abs(matrix[i] - identity3x4[i]) < epsilon)
			.reduce((a, b) => a && b, true);
	});
};const foldable=/*#__PURE__*/Object.freeze({__proto__:null,verticesFoldable});const unassignedAssignment = { U: true, u: true };
const getUnassignedIndices = (edges_assignment) => edges_assignment
	.map((_, i) => i)
	.filter(i => unassignedAssignment[edges_assignment[i]]);
const maekawaSolver = (vertices_edgesAssignments) => {
	const unassigneds = getUnassignedIndices(vertices_edgesAssignments);
	const permuts = Array.from(Array(2 ** unassigneds.length))
		.map((_, i) => i.toString(2))
		.map(l => Array(unassigneds.length - l.length + 1).join("0") + l)
		.map(str => Array.from(str).map(l => (l === "0" ? "V" : "M")));
	const all = permuts.map(perm => {
		const array = vertices_edgesAssignments.slice();
		unassigneds.forEach((index, i) => { array[index] = perm[i]; });
		return array;
	});
	const boundaryCount = vertices_edgesAssignments
		.filter(a => assignmentIsBoundary[a])
		.length;
	if (boundaryCount > 0) { return all; }
	const count_m = all.map(a => a.filter(l => l === "M" || l === "m").length);
	const count_v = all.map(a => a.filter(l => l === "V" || l === "v").length);
	return all.filter((_, i) => Math.abs(count_m[i] - count_v[i]) === 2);
};const maekawa=/*#__PURE__*/Object.freeze({__proto__:null,maekawaSolver});const singleVertex = {
	...degree4,
	...foldable,
	...kawasaki,
	...maekawa,
	...validateSingleVertex,
};const compileShader = (gl, shaderSource, shaderType) => {
	const shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderSource);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader));
	}
	return shader;
};
const createProgramAndAttachShaders = (gl, vertexShader, fragmentShader) => {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(gl.getProgramInfoLog(program));
	}
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);
	return program;
};
const createProgram = (gl, vertexSource, fragmentSource) => {
	const vertexShader = compileShader(gl, vertexSource, gl.VERTEX_SHADER);
	const fragmentShader = compileShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
	return createProgramAndAttachShaders(gl, vertexShader, fragmentShader);
};const initializeWebGL = (canvasElement, preferredVersion) => {
	const contextName = [null, "webgl", "webgl2"];
	const devicePixelRatio = window.devicePixelRatio || 1;
	canvasElement.width = canvasElement.clientWidth * devicePixelRatio;
	canvasElement.height = canvasElement.clientHeight * devicePixelRatio;
	if (preferredVersion) {
		return ({
			gl: canvasElement.getContext(contextName[preferredVersion]),
			version: preferredVersion,
		});
	}
	const gl2 = canvasElement.getContext(contextName[2]);
	if (gl2) { return { gl: gl2, version: 2 }; }
	const gl1 = canvasElement.getContext(contextName[1]);
	if (gl1) { return { gl: gl1, version: 1 }; }
	throw new Error(Messages$1.noWebGL);
};const rebuildViewport = (gl, canvas) => {
	if (!gl) { return; }
	const devicePixelRatio = window.devicePixelRatio || 1;
	const size = [canvas.clientWidth, canvas.clientHeight]
		.map(n => n * devicePixelRatio);
	if (canvas.width !== size[0] || canvas.height !== size[1]) {
		canvas.width = size[0];
		canvas.height = size[1];
	}
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};
const makeProjectionMatrix = (canvas, perspective = "perspective", fov = 45) => {
	if (!canvas) { return identity4x4; }
	const Z_NEAR = 0.1;
	const Z_FAR = 20;
	const ORTHO_FAR = -100;
	const ORTHO_NEAR = 100;
	const bounds = [canvas.clientWidth, canvas.clientHeight];
	const vmin = Math.min(...bounds);
	const padding = [0, 1].map(i => ((bounds[i] - vmin) / vmin) / 2);
	const side = padding.map(p => p + 0.5);
	return perspective === "orthographic"
		? makeOrthographicMatrix4(side[1], side[0], -side[1], -side[0], ORTHO_FAR, ORTHO_NEAR)
		: makePerspectiveMatrix4(fov * (Math.PI / 180), bounds[0] / bounds[1], Z_NEAR, Z_FAR);
};
const makeModelMatrix = (graph) => {
	if (!graph) { return identity4x4; }
	const bounds = boundingBox(graph);
	if (!bounds) { return identity4x4; }
	const scale = Math.max(...bounds.span);
	if (scale === 0) { return identity4x4; }
	const center = resize(3, midpoint(bounds.min, bounds.max));
	const scalePositionMatrix = [scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, ...center, 1];
	return invertMatrix4(scalePositionMatrix) || identity4x4;
};const view=/*#__PURE__*/Object.freeze({__proto__:null,makeModelMatrix,makeProjectionMatrix,rebuildViewport});const uniformFunc = (gl, i, func, value) => {
	switch (func) {
	case "uniformMatrix4fv": gl[func](i, false, value); break;
	default: gl[func](i, value); break;
	}
};
const drawProgram = (gl, version, bundle, uniforms = {}) => {
	gl.useProgram(bundle.program);
	bundle.flags.forEach(flag => gl.enable(flag));
	const uniformCount = gl.getProgramParameter(bundle.program, gl.ACTIVE_UNIFORMS);
	for (let i = 0; i < uniformCount; i += 1) {
		const uniformName = gl.getActiveUniform(bundle.program, i).name;
		const uniform = uniforms[uniformName];
		if (uniform) {
			const index = gl.getUniformLocation(bundle.program, uniformName);
			uniformFunc(gl, index, uniform.func, uniform.value);
		}
	}
	bundle.vertexArrays.forEach(el => {
		gl.bindBuffer(gl.ARRAY_BUFFER, el.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
		gl.vertexAttribPointer(el.location, el.length, el.type, false, 0, 0);
		gl.enableVertexAttribArray(el.location);
	});
	bundle.elementArrays.forEach(el => {
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, el.buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
		gl.drawElements(
			el.mode,
			el.data.length,
			version === 2 ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT,
			el.buffer,
		);
	});
	bundle.flags.forEach(flag => gl.disable(flag));
};
const deallocProgram = (gl, bundle) => {
	bundle.vertexArrays.forEach(vert => gl.disableVertexAttribArray(vert.location));
	bundle.vertexArrays.forEach(vert => gl.deleteBuffer(vert.buffer));
	bundle.elementArrays.forEach(elements => gl.deleteBuffer(elements.buffer));
	gl.deleteProgram(bundle.program);
};const program=/*#__PURE__*/Object.freeze({__proto__:null,deallocProgram,drawProgram});const dark = {
	B: [0.5, 0.5, 0.5],
	b: [0.5, 0.5, 0.5],
	V: [0.2, 0.4, 0.6],
	v: [0.2, 0.4, 0.6],
	M: [0.75, 0.25, 0.15],
	m: [0.75, 0.25, 0.15],
	F: [0.3, 0.3, 0.3],
	f: [0.3, 0.3, 0.3],
	J: [0.3, 0.2, 0.0],
	j: [0.3, 0.2, 0.0],
	C: [0.5, 0.8, 0.1],
	c: [0.5, 0.8, 0.1],
	U: [0.6, 0.25, 0.9],
	u: [0.6, 0.25, 0.9],
};
const light = {
	B: [0.0, 0.0, 0.0],
	b: [0.0, 0.0, 0.0],
	V: [0.2, 0.5, 0.8],
	v: [0.2, 0.5, 0.8],
	M: [0.75, 0.25, 0.15],
	m: [0.75, 0.25, 0.15],
	F: [0.75, 0.75, 0.75],
	f: [0.75, 0.75, 0.75],
	J: [1.0, 0.75, 0.25],
	j: [1.0, 0.75, 0.25],
	C: [0.5, 0.8, 0.1],
	c: [0.5, 0.8, 0.1],
	U: [0.6, 0.25, 0.9],
	u: [0.6, 0.25, 0.9],
};
const parseColorToWebGLRgb = (color) => (
	color !== undefined && color.constructor === Array
		? color.slice(0, 3)
		: parseColorToRgb(color).slice(0, 3).map(n => n / 255)
);const makeFacesVertexData = ({
	vertices_coords, edges_assignment, faces_vertices, faces_edges, faces_normal,
}, options = {}) => {
	const vertices_coords3 = vertices_coords
		.map(coord => [...coord].concat(Array(3 - coord.length).fill(0)));
	const vertices_normal = makeVerticesNormal({
		vertices_coords: vertices_coords3, faces_vertices, faces_normal,
	});
	const vertices_barycentric = vertices_coords3
		.map((_, i) => i % 3)
		.map(n => [n === 0 ? 1 : 0, n === 1 ? 1 : 0, n === 2 ? 1 : 0]);
	const facesEdgesIsJoined = faces_edges
		.map(edges => edges
			.map(e => edges_assignment[e])
			.map(a => a === "J" || a === "j"));
	if (!options.showTrianglulation) {
		for (let i = 0; i < facesEdgesIsJoined.length; i += 1) {
			if (facesEdgesIsJoined[i][0]) {
				vertices_barycentric[i * 3 + 0][2] = vertices_barycentric[i * 3 + 1][2] = 100;
			}
			if (facesEdgesIsJoined[i][1]) {
				vertices_barycentric[i * 3 + 1][0] = vertices_barycentric[i * 3 + 2][0] = 100;
			}
			if (facesEdgesIsJoined[i][2]) {
				vertices_barycentric[i * 3 + 0][1] = vertices_barycentric[i * 3 + 2][1] = 100;
			}
		}
	}
	return {
		vertices_coords: vertices_coords3,
		vertices_normal,
		vertices_barycentric,
	};
};
const makeThickEdgesVertexData = (graph, options) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) { return []; }
	const assignmentColors = options && options.dark ? dark : light;
	const assignment_color = {
		...assignmentColors,
		...options,
	};
	const vertices_coords3D = graph.vertices_coords
		.map(coord => [...coord].concat(Array(3 - coord.length).fill(0)));
	const vertices_coords = graph.edges_vertices
		.flatMap(edge => edge
			.map(v => vertices_coords3D[v]))
		.flatMap(coord => [coord, coord, coord, coord]);
	const edgesVector = makeEdgesVector(graph);
	const vertices_color = graph.edges_assignment
		? graph.edges_assignment
			.flatMap(a => Array(8).fill(assignment_color[a]))
		: graph.edges_vertices
			.flatMap(() => Array(8).fill(assignment_color.U));
	const verticesEdgesVector = edgesVector
		.flatMap(el => [el, el, el, el, el, el, el, el]);
	const vertices_vector = graph.edges_vertices
		.flatMap(() => [
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1],
		]);
	return {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	};
};const foldedData=/*#__PURE__*/Object.freeze({__proto__:null,makeFacesVertexData,makeThickEdgesVertexData});const makeFoldedVertexArrays = (gl, program, {
	vertices_coords, edges_vertices, edges_assignment,
	faces_vertices, faces_edges, faces_normal,
} = {}, options = {}) => {
	if (!vertices_coords || !faces_vertices) {
		return [];
	}
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	const {
		vertices_coords: vertices_coords3,
		vertices_normal,
		vertices_barycentric,
	} = makeFacesVertexData({
		vertices_coords, edges_assignment, faces_vertices, faces_edges, faces_normal,
	}, options);
	return [{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_coords3.length ? vertices_coords3[0].length : 3,
		data: new Float32Array(vertices_coords3.flat()),
	}, {
		location: gl.getAttribLocation(program, "v_normal"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_normal.length ? vertices_normal[0].length : 3,
		data: new Float32Array(vertices_normal.flat()),
	}, {
		location: gl.getAttribLocation(program, "v_barycentric"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: 3,
		data: new Float32Array(vertices_barycentric.flat()),
	},
	].filter(el => el.location !== -1);
};
const makeFoldedElementArrays = (gl, version = 1, graph = {}) => {
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return []; }
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: version === 2
			? new Uint32Array(graph.faces_vertices.flat())
			: new Uint16Array(graph.faces_vertices.flat()),
	}];
};
const makeThickEdgesVertexArrays = (gl, program, graph, options = {}) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) {
		return [];
	}
	const {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	} = makeThickEdgesVertexData(graph, options.assignment_color);
	return [{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_coords.length ? vertices_coords[0].length : 3,
		data: new Float32Array(vertices_coords.flat()),
	}, {
		location: gl.getAttribLocation(program, "v_color"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_color.length ? vertices_color[0].length : 3,
		data: new Float32Array(vertices_color.flat()),
	}, {
		location: gl.getAttribLocation(program, "edge_vector"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: verticesEdgesVector.length ? verticesEdgesVector[0].length : 3,
		data: new Float32Array(verticesEdgesVector.flat()),
	}, {
		location: gl.getAttribLocation(program, "vertex_vector"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_vector.length ? vertices_vector[0].length : 3,
		data: new Float32Array(vertices_vector.flat()),
	}].filter(el => el.location !== -1);
};
const makeThickEdgesElementArrays = (gl, version = 1, graph = {}) => {
	if (!graph || !graph.edges_vertices) { return []; }
	const edgesTriangles = graph.edges_vertices
		.map((_, i) => i * 8)
		.flatMap(i => [
			i + 0, i + 1, i + 4,
			i + 4, i + 1, i + 5,
			i + 1, i + 2, i + 5,
			i + 5, i + 2, i + 6,
			i + 2, i + 3, i + 6,
			i + 6, i + 3, i + 7,
			i + 3, i + 0, i + 7,
			i + 7, i + 0, i + 4,
		]);
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: version === 2
			? new Uint32Array(edgesTriangles)
			: new Uint16Array(edgesTriangles),
	}];
};const foldedArrays=/*#__PURE__*/Object.freeze({__proto__:null,makeFoldedElementArrays,makeFoldedVertexArrays,makeThickEdgesElementArrays,makeThickEdgesVertexArrays});const LAYER_NUDGE = 5e-6;
const makeExplodedGraph = (graph, layerNudge = LAYER_NUDGE) => {
	const copy = clone(graph);
	if (!copy.edges_assignment) {
		const edgeCount = count.edges(copy) || countImplied.edges(copy);
		copy.edges_assignment = Array(edgeCount).fill("U");
	}
	let faces_nudge = [];
	if (copy.faceOrders) {
		faces_nudge = nudgeFacesWithFaceOrders(copy);
	} else if (copy.faces_layer) {
		faces_nudge = nudgeFacesWithFacesLayer(copy);
	}
	const change = triangulate(copy);
	const exploded = explodeFaces(copy);
	if (change.faces) {
		const backmap = invertMap(change.faces.map);
		backmap.forEach((oldFace, face) => {
			const nudge = faces_nudge[oldFace];
			if (!nudge) { return; }
			exploded.faces_vertices[face].forEach(v => {
				const vec = scale$1(nudge.vector, nudge.layer * layerNudge);
				exploded.vertices_coords[v] = add(
					resize(3, exploded.vertices_coords[v]),
					vec,
				);
			});
		});
	}
	return exploded;
};const makeUniforms$1 = (gl, {
	projectionMatrix,
	modelViewMatrix,
	frontColor,
	backColor,
	outlineColor,
	strokeWidth,
	opacity,
}) => ({
	u_matrix: {
		func: "uniformMatrix4fv",
		value: multiplyMatrices4(
			projectionMatrix || identity4x4,
			modelViewMatrix || identity4x4,
		),
	},
	u_projection: {
		func: "uniformMatrix4fv",
		value: projectionMatrix || identity4x4,
	},
	u_modelView: {
		func: "uniformMatrix4fv",
		value: modelViewMatrix || identity4x4,
	},
	u_frontColor: {
		func: "uniform3fv",
		value: parseColorToWebGLRgb(frontColor || "gray"),
	},
	u_backColor: {
		func: "uniform3fv",
		value: parseColorToWebGLRgb(backColor || "white"),
	},
	u_outlineColor: {
		func: "uniform3fv",
		value: parseColorToWebGLRgb(outlineColor || "black"),
	},
	u_strokeWidth: {
		func: "uniform1f",
		value: strokeWidth !== undefined ? strokeWidth : 0.05,
	},
	u_opacity: {
		func: "uniform1f",
		value: opacity !== undefined ? opacity : 1,
	},
});const model_300_vert = `#version 300 es
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;
in vec3 v_position;
in vec3 v_normal;
out vec3 front_color;
out vec3 back_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	vec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));
	float brightness = 0.5 + light.x * 0.15 + light.z * 0.35;
	front_color = u_frontColor * brightness;
	back_color = u_backColor * brightness;
}
`;
const thick_edges_300_vert$1 = `#version 300 es
uniform mat4 u_matrix;
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform float u_strokeWidth;
in vec3 v_position;
in vec3 v_color;
in vec3 edge_vector;
in vec2 vertex_vector;
out vec3 blend_color;
void main () {
	vec3 edge_norm = normalize(edge_vector);
	// axis most dissimilar to edge_vector
	vec3 absNorm = abs(edge_norm);
	vec3 xory = absNorm.x < absNorm.y ? vec3(1,0,0) : vec3(0,1,0);
	vec3 axis = absNorm.x > absNorm.z && absNorm.y > absNorm.z ? vec3(0,0,1) : xory;
	// two perpendiculars. with edge_vector these make basis vectors
	vec3 one = cross(axis, edge_norm);
	vec3 two = cross(one, edge_norm);
	vec3 displaceNormal = normalize(
		one * vertex_vector.x + two * vertex_vector.y
	);
	vec3 displace = displaceNormal * (u_strokeWidth * 0.5);
	gl_Position = u_matrix * vec4(v_position + displace, 1);
	blend_color = v_color;
}
`;
const outlined_model_300_frag = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
uniform float u_opacity;
in vec3 front_color;
in vec3 back_color;
in vec3 outline_color;
in vec3 barycentric;
out vec4 outColor;
float edgeFactor(vec3 barycenter) {
	vec3 d = fwidth(barycenter);
	vec3 a3 = smoothstep(vec3(0.0), d*3.5, barycenter);
	return min(min(a3.x, a3.y), a3.z);
}
void main () {
	gl_FragDepth = gl_FragCoord.z;
	vec3 color = gl_FrontFacing ? front_color : back_color;
	// vec4 color4 = gl_FrontFacing
	// 	? vec4(front_color, u_opacity)
	// 	: vec4(back_color, u_opacity);
	// vec4 outline4 = vec4(outline_color, 1);
	// outColor = vec4(mix(vec3(0.0), color, edgeFactor(barycentric)), u_opacity);
	outColor = vec4(mix(outline_color, color, edgeFactor(barycentric)), u_opacity);
	// outColor = mix(outline4, color4, edgeFactor(barycentric));
}
`;
const outlined_model_100_frag = `#version 100
precision mediump float;
uniform float u_opacity;
varying vec3 barycentric;
varying vec3 front_color;
varying vec3 back_color;
varying vec3 outline_color;
void main () {
	vec3 color = gl_FrontFacing ? front_color : back_color;
	// vec3 boundary = vec3(0.0, 0.0, 0.0);
	vec3 boundary = outline_color;
	// gl_FragDepth = 0.5;
	gl_FragColor = any(lessThan(barycentric, vec3(0.02)))
		? vec4(boundary, u_opacity)
		: vec4(color, u_opacity);
}
`;
const model_100_vert = `#version 100
attribute vec3 v_position;
attribute vec3 v_normal;
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;
varying vec3 normal_color;
varying vec3 front_color;
varying vec3 back_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	vec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));
	float brightness = 0.5 + light.x * 0.15 + light.z * 0.35;
	front_color = u_frontColor * brightness;
	back_color = u_backColor * brightness;
}
`;
const thick_edges_100_vert$1 = `#version 100
attribute vec3 v_position;
attribute vec3 v_color;
attribute vec3 edge_vector;
attribute vec2 vertex_vector;
uniform mat4 u_matrix;
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform float u_strokeWidth;
varying vec3 blend_color;
void main () {
	vec3 edge_norm = normalize(edge_vector);
	// axis most dissimilar to edge_vector
	vec3 absNorm = abs(edge_norm);
	vec3 xory = absNorm.x < absNorm.y ? vec3(1,0,0) : vec3(0,1,0);
	vec3 axis = absNorm.x > absNorm.z && absNorm.y > absNorm.z ? vec3(0,0,1) : xory;
	// two perpendiculars. with edge_vector these make basis vectors
	vec3 one = cross(axis, edge_norm);
	vec3 two = cross(one, edge_norm);
	vec3 displaceNormal = normalize(
		one * vertex_vector.x + two * vertex_vector.y
	);
	vec3 displace = displaceNormal * (u_strokeWidth * 0.5);
	gl_Position = u_matrix * vec4(v_position + displace, 1);
	blend_color = v_color;
}
`;
const model_100_frag = `#version 100
precision mediump float;
uniform float u_opacity;
varying vec3 front_color;
varying vec3 back_color;
void main () {
	vec3 color = gl_FrontFacing ? front_color : back_color;
	gl_FragColor = vec4(color, u_opacity);
}
`;
const simple_300_frag = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
in vec3 blend_color;
out vec4 outColor;
 
void main() {
	outColor = vec4(blend_color.rgb, 1);
}
`;
const outlined_model_100_vert = `#version 100
attribute vec3 v_position;
attribute vec3 v_normal;
attribute vec3 v_barycentric;
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;
uniform vec3 u_outlineColor;
varying vec3 normal_color;
varying vec3 barycentric;
varying vec3 front_color;
varying vec3 back_color;
varying vec3 outline_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	barycentric = v_barycentric;
	vec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));
	float brightness = 0.5 + light.x * 0.15 + light.z * 0.35;
	front_color = u_frontColor * brightness;
	back_color = u_backColor * brightness;
	outline_color = u_outlineColor;
}
`;
const outlined_model_300_vert = `#version 300 es
uniform mat4 u_modelView;
uniform mat4 u_matrix;
uniform vec3 u_frontColor;
uniform vec3 u_backColor;
uniform vec3 u_outlineColor;
in vec3 v_position;
in vec3 v_normal;
in vec3 v_barycentric;
in float v_rawEdge;
out vec3 front_color;
out vec3 back_color;
out vec3 outline_color;
out vec3 barycentric;
// flat out int rawEdge;
flat out int provokedVertex;
void main () {
	gl_Position = u_matrix * vec4(v_position, 1);
	provokedVertex = gl_VertexID;
	barycentric = v_barycentric;
	// rawEdge = int(v_rawEdge);
	vec3 light = abs(normalize((vec4(v_normal, 1) * u_modelView).xyz));
	float brightness = 0.5 + light.x * 0.15 + light.z * 0.35;
	front_color = u_frontColor * brightness;
	back_color = u_backColor * brightness;
	outline_color = u_outlineColor;
}
`;
const model_300_frag = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
uniform float u_opacity;
in vec3 front_color;
in vec3 back_color;
out vec4 outColor;
void main () {
	gl_FragDepth = gl_FragCoord.z;
	vec3 color = gl_FrontFacing ? front_color : back_color;
	outColor = vec4(color, u_opacity);
}
`;
const simple_100_frag = `#version 100
precision mediump float;
varying vec3 blend_color;
void main () {
	gl_FragColor = vec4(blend_color.rgb, 1);
}
`;const foldedFormFaces = (gl, version = 1, graph = {}, options = {}) => {
	const exploded = makeExplodedGraph(graph, options.layerNudge);
	const program = version === 1
		? createProgram(gl, model_100_vert, model_100_frag)
		: createProgram(gl, model_300_vert, model_300_frag);
	return {
		program,
		vertexArrays: makeFoldedVertexArrays(gl, program, exploded, options),
		elementArrays: makeFoldedElementArrays(gl, version, exploded),
		flags: [gl.DEPTH_TEST],
		makeUniforms: makeUniforms$1,
	};
};
const foldedFormEdges = (gl, version = 1, graph = {}, options = {}) => {
	const program = version === 1
		? createProgram(gl, thick_edges_100_vert$1, simple_100_frag)
		: createProgram(gl, thick_edges_300_vert$1, simple_300_frag);
	return {
		program,
		vertexArrays: makeThickEdgesVertexArrays(gl, program, graph, options),
		elementArrays: makeThickEdgesElementArrays(gl, version, graph),
		flags: [gl.DEPTH_TEST],
		makeUniforms: makeUniforms$1,
	};
};
const foldedFormFacesOutlined = (gl, version = 1, graph = {}, options = {}) => {
	const exploded = makeExplodedGraph(graph, options.layerNudge);
	const program = version === 1
		? createProgram(gl, outlined_model_100_vert, outlined_model_100_frag)
		: createProgram(gl, outlined_model_300_vert, outlined_model_300_frag);
	return {
		program,
		vertexArrays: makeFoldedVertexArrays(gl, program, exploded, options),
		elementArrays: makeFoldedElementArrays(gl, version, exploded),
		flags: [gl.DEPTH_TEST],
		makeUniforms: makeUniforms$1,
	};
};const foldedPrograms=/*#__PURE__*/Object.freeze({__proto__:null,foldedFormEdges,foldedFormFaces,foldedFormFacesOutlined});const WebGLFoldedForm = (gl, version = 1, graph = {}, options = {}) => {
	const programs = [];
	if (options.faces !== false) {
		if (options.outlines === false) {
			programs.push(foldedFormFaces(gl, version, graph, options));
		} else {
			programs.push(foldedFormFacesOutlined(gl, version, graph, options));
		}
	}
	if (options.edges === true) {
		programs.push(foldedFormEdges(gl, version, graph, options));
	}
	return programs;
};const make2D$1 = (coords) => coords
	.map(coord => [0, 1]
		.map(i => coord[i] || 0));
const makeCPEdgesVertexData = (graph, options) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) { return []; }
	const assignmentColors = options && options.dark ? dark : light;
	const assignment_color = {
		...assignmentColors,
		...options,
	};
	const vertices_coords = make2D$1(graph.edges_vertices
		.flatMap(edge => edge
			.map(v => graph.vertices_coords[v]))
		.flatMap(coord => [coord, coord]));
	const edgesVector = make2D$1(makeEdgesVector(graph));
	const vertices_color = graph.edges_assignment
		? graph.edges_assignment.flatMap(a => [
			assignment_color[a],
			assignment_color[a],
			assignment_color[a],
			assignment_color[a],
		])
		: graph.edges_vertices.flatMap(() => [
			assignment_color.U,
			assignment_color.U,
			assignment_color.U,
			assignment_color.U,
		]);
	const verticesEdgesVector = edgesVector
		.flatMap(el => [el, el, el, el]);
	const vertices_vector = graph.edges_vertices
		.flatMap(() => [[1, 0], [-1, 0], [-1, 0], [1, 0]]);
	return {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	};
};const cpData=/*#__PURE__*/Object.freeze({__proto__:null,makeCPEdgesVertexData});const makeCPEdgesVertexArrays = (gl, program, graph, options) => {
	if (!graph || !graph.vertices_coords || !graph.edges_vertices) {
		return [];
	}
	const {
		vertices_coords,
		vertices_color,
		verticesEdgesVector,
		vertices_vector,
	} = makeCPEdgesVertexData(graph, options);
	return [{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: 2,
		data: new Float32Array(vertices_coords.flat()),
	}, {
		location: gl.getAttribLocation(program, "v_color"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_color.length ? vertices_color[0].length : 2,
		data: new Float32Array(vertices_color.flat()),
	}, {
		location: gl.getAttribLocation(program, "edge_vector"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: verticesEdgesVector.length ? verticesEdgesVector[0].length : 2,
		data: new Float32Array(verticesEdgesVector.flat()),
	}, {
		location: gl.getAttribLocation(program, "vertex_vector"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: vertices_vector.length ? vertices_vector[0].length : 2,
		data: new Float32Array(vertices_vector.flat()),
	}].filter(el => el.location !== -1);
};
const makeCPEdgesElementArrays = (gl, version = 1, graph = {}) => {
	if (!graph || !graph.edges_vertices) { return []; }
	const edgesTriangles = graph.edges_vertices
		.map((_, i) => i * 4)
		.flatMap(i => [i + 0, i + 1, i + 2, i + 2, i + 3, i + 0]);
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: version === 2
			? new Uint32Array(edgesTriangles)
			: new Uint16Array(edgesTriangles),
	}];
};
const make2D = (coords) => coords
	.map(coord => [0, 1]
		.map(i => coord[i] || 0));
const makeCPFacesVertexArrays = (gl, program, graph) => {
	if (!graph || !graph.vertices_coords) { return []; }
	return [{
		location: gl.getAttribLocation(program, "v_position"),
		buffer: gl.createBuffer(),
		type: gl.FLOAT,
		length: 2,
		data: new Float32Array(make2D(graph.vertices_coords).flat()),
	}].filter(el => el.location !== -1);
};
const makeCPFacesElementArrays = (gl, version = 1, graph = {}) => {
	if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return []; }
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: version === 2
			? new Uint32Array(triangulateConvexFacesVertices(graph).flat())
			: new Uint16Array(triangulateConvexFacesVertices(graph).flat()),
	}];
};const cpArrays=/*#__PURE__*/Object.freeze({__proto__:null,makeCPEdgesElementArrays,makeCPEdgesVertexArrays,makeCPFacesElementArrays,makeCPFacesVertexArrays});const makeUniforms = (gl, {
	projectionMatrix,
	modelViewMatrix,
	cpColor,
	strokeWidth,
}) => ({
	u_matrix: {
		func: "uniformMatrix4fv",
		value: multiplyMatrices4(
			projectionMatrix || identity4x4,
			modelViewMatrix || identity4x4,
		),
	},
	u_projection: {
		func: "uniformMatrix4fv",
		value: projectionMatrix || identity4x4,
	},
	u_modelView: {
		func: "uniformMatrix4fv",
		value: modelViewMatrix || identity4x4,
	},
	u_cpColor: {
		func: "uniform3fv",
		value: parseColorToWebGLRgb(cpColor || "white"),
	},
	u_strokeWidth: {
		func: "uniform1f",
		value: strokeWidth || 0.05,
	},
});const cp_300_frag = `#version 300 es
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
in vec3 blend_color;
out vec4 outColor;
void main() {
	outColor = vec4(blend_color.rgb, 1);
}
`;
const cp_100_frag = `#version 100
precision mediump float;
varying vec3 blend_color;
void main () {
	gl_FragColor = vec4(blend_color.rgb, 1);
}
`;
const thick_edges_300_vert = `#version 300 es
uniform mat4 u_matrix;
uniform float u_strokeWidth;
in vec2 v_position;
in vec3 v_color;
in vec2 edge_vector;
in vec2 vertex_vector;
out vec3 blend_color;
void main () {
	float sign = vertex_vector[0];
	float halfWidth = u_strokeWidth * 0.5;
	vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * halfWidth;
	gl_Position = u_matrix * vec4(side + v_position, 0, 1);
	blend_color = v_color;
}
`;
const thick_edges_100_vert = `#version 100
uniform mat4 u_matrix;
uniform float u_strokeWidth;
attribute vec2 v_position;
attribute vec3 v_color;
attribute vec2 edge_vector;
attribute vec2 vertex_vector;
varying vec3 blend_color;
void main () {
	float sign = vertex_vector[0];
	float halfWidth = u_strokeWidth * 0.5;
	vec2 side = normalize(vec2(edge_vector.y * sign, -edge_vector.x * sign)) * halfWidth;
	gl_Position = u_matrix * vec4(side + v_position, 0, 1);
	blend_color = v_color;
}
`;
const cp_100_vert = `#version 100
uniform mat4 u_matrix;
uniform vec3 u_cpColor;
attribute vec2 v_position;
varying vec3 blend_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 0, 1);
	blend_color = u_cpColor;
}
`;
const cp_300_vert = `#version 300 es
uniform mat4 u_matrix;
uniform vec3 u_cpColor;
in vec2 v_position;
out vec3 blend_color;
void main () {
	gl_Position = u_matrix * vec4(v_position, 0, 1);
	blend_color = u_cpColor;
}
`;const cpFacesV1 = (gl, graph = {}, options = undefined) => {
	const program = createProgram(gl, cp_100_vert, cp_100_frag);
	return {
		program,
		vertexArrays: makeCPFacesVertexArrays(gl, program, graph),
		elementArrays: makeCPFacesElementArrays(gl, 1, graph),
		flags: [],
		makeUniforms,
	};
};
const cpEdgesV1 = (gl, graph = {}, options = undefined) => {
	const program = createProgram(gl, thick_edges_100_vert, cp_100_frag);
	return {
		program,
		vertexArrays: makeCPEdgesVertexArrays(gl, program, graph, options),
		elementArrays: makeCPEdgesElementArrays(gl, 1, graph),
		flags: [],
		makeUniforms,
	};
};
const cpFacesV2 = (gl, graph = {}, options = undefined) => {
	const program = createProgram(gl, cp_300_vert, cp_300_frag);
	return {
		program,
		vertexArrays: makeCPFacesVertexArrays(gl, program, graph),
		elementArrays: makeCPFacesElementArrays(gl, 2, graph),
		flags: [],
		makeUniforms,
	};
};
const cpEdgesV2 = (gl, graph = {}, options = undefined) => {
	const program = createProgram(gl, thick_edges_300_vert, cp_300_frag);
	return {
		program,
		vertexArrays: makeCPEdgesVertexArrays(gl, program, graph, options),
		elementArrays: makeCPEdgesElementArrays(gl, 2, graph),
		flags: [],
		makeUniforms,
	};
};const cpPrograms=/*#__PURE__*/Object.freeze({__proto__:null,cpEdgesV1,cpEdgesV2,cpFacesV1,cpFacesV2});const WebGLCreasePattern = (gl, version = 1, graph = {}, options = undefined) => {
	switch (version) {
	case 1:
		return [cpFacesV1(gl, graph, options), cpEdgesV1(gl, graph, options)];
	case 2:
	default:
		return [cpFacesV2(gl, graph, options), cpEdgesV2(gl, graph, options)];
	}
};const webgl = Object.assign(
	Object.create(null),
	{
		createProgram,
		initialize: initializeWebGL,
		foldedForm: WebGLFoldedForm,
		creasePattern: WebGLCreasePattern,
	},
	view,
	program,
	foldedArrays,
	foldedData,
	foldedPrograms,
	cpArrays,
	cpData,
	cpPrograms,
);const shortestEdgeLength = ({ vertices_coords, edges_vertices }) => {
	const lengths = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map(segment => distance(...segment));
	const minLen = lengths
		.reduce((a, b) => Math.min(a, b), Infinity);
	return minLen === Infinity ? undefined : minLen;
};
const makeEpsilon = ({ vertices_coords, edges_vertices }) => {
	const shortest = shortestEdgeLength({ vertices_coords, edges_vertices });
	if (shortest) { return Math.max(shortest * 1e-4, 1e-10); }
	const bounds = boundingBox({ vertices_coords });
	return bounds && bounds.span
		? Math.max(1e-6 * Math.max(...bounds.span), 1e-10)
		: 1e-6;
};
const flipFacesLayer = faces_layer => invertMap(
	invertMap(faces_layer).reverse(),
);
const facesLayerToEdgesAssignments = (graph, faces_layer) => {
	const edges_assignment = [];
	const faces_winding = makeFacesWinding(graph);
	const edges_faces = graph.edges_faces
		? graph.edges_faces
		: makeEdgesFaces(graph);
	edges_faces.forEach((faces, e) => {
		if (faces.length === 1) { edges_assignment[e] = "B"; }
		if (faces.length === 2) {
			const windings = faces.map(f => faces_winding[f]);
			if (windings[0] === windings[1]) {
				edges_assignment[e] = "F";
				return;
			}
			const layers = faces.map(f => faces_layer[f]);
			const local_dir = layers[0] < layers[1];
			const global_dir = windings[0] ? local_dir : !local_dir;
			edges_assignment[e] = global_dir ? "V" : "M";
		}
	});
	return edges_assignment;
};
const faceOrdersToMatrix = (faceOrders) => {
	const faces = [];
	faceOrders.forEach(order => {
		faces[order[0]] = undefined;
		faces[order[1]] = undefined;
	});
	const matrix = faces.map(() => []);
	faceOrders
		.forEach(([a, b, c]) => {
			matrix[a][b] = c;
			matrix[b][a] = -c;
		});
	return matrix;
};const general=/*#__PURE__*/Object.freeze({__proto__:null,faceOrdersToMatrix,facesLayerToEdgesAssignments,flipFacesLayer,makeEpsilon});const constraintToFacePairs = ({
	taco_taco: f => [
		[f[0], f[2]],
		[f[1], f[3]],
		[f[1], f[2]],
		[f[0], f[3]],
		[f[0], f[1]],
		[f[2], f[3]],
	],
	taco_tortilla: f => [[f[0], f[2]], [f[0], f[1]], [f[1], f[2]]],
	tortilla_tortilla: f => [[f[0], f[2]], [f[1], f[3]]],
	transitivity: f => [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]],
});
const pairArrayToSortedPairString = pair => (pair[0] < pair[1]
	? `${pair[0]} ${pair[1]}`
	: `${pair[1]} ${pair[0]}`);
const constraintToFacePairsStrings = ({
	taco_taco: f => [
		pairArrayToSortedPairString([f[0], f[2]]),
		pairArrayToSortedPairString([f[1], f[3]]),
		pairArrayToSortedPairString([f[1], f[2]]),
		pairArrayToSortedPairString([f[0], f[3]]),
		pairArrayToSortedPairString([f[0], f[1]]),
		pairArrayToSortedPairString([f[2], f[3]]),
	],
	taco_tortilla: f => [
		pairArrayToSortedPairString([f[0], f[2]]),
		pairArrayToSortedPairString([f[0], f[1]]),
		pairArrayToSortedPairString([f[1], f[2]]),
	],
	tortilla_tortilla: f => [
		pairArrayToSortedPairString([f[0], f[2]]),
		pairArrayToSortedPairString([f[1], f[3]]),
	],
	transitivity: f => [
		pairArrayToSortedPairString([f[0], f[1]]),
		pairArrayToSortedPairString([f[1], f[2]]),
		pairArrayToSortedPairString([f[2], f[0]]),
	],
});
const signedLayerSolverValue = { 0: 0, 1: 1, 2: -1 };
const solverSolutionToFaceOrders = (facePairOrders, faces_winding) => {
	const keys = Object.keys(facePairOrders);
	const faceOrders = keys.map(string => string.split(" ").map(n => parseInt(n, 10)));
	faceOrders.forEach((faces, i) => {
		const value = signedLayerSolverValue[facePairOrders[keys[i]]];
		const side = (!faces_winding[faces[1]]) ? -value : value;
		faces.push(side);
	});
	return faceOrders;
};const general2d=/*#__PURE__*/Object.freeze({__proto__:null,constraintToFacePairs,constraintToFacePairsStrings,solverSolutionToFaceOrders});const makeConstraints = ({
	taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
}) => {
	const constraints = {};
	constraints.taco_taco = taco_taco.map(el => [
		el[0][0], el[1][0], el[0][1], el[1][1],
	]);
	constraints.taco_tortilla = taco_tortilla.map(el => [
		el.taco[0], el.tortilla, el.taco[1],
	]);
	constraints.tortilla_tortilla = tortilla_tortilla.map(el => [
		el[0][0], el[0][1], el[1][0], el[1][1],
	]);
	constraints.transitivity = transitivity.map(el => [
		el[0], el[1], el[2],
	]);
	return constraints;
};
const makeConstraintsLookup = (constraints) => {
	const lookup = {};
	Object.keys(constraints).forEach(key => { lookup[key] = {}; });
	Object.keys(constraints).forEach(type => {
		constraints[type]
			.forEach((constraint, i) => constraintToFacePairsStrings[type](constraint)
				.forEach(key => {
					if (lookup[type][key] === undefined) {
						lookup[type][key] = [];
					}
					lookup[type][key].push(i);
				}));
	});
	return lookup;
};const makeEdgesFacesSide = ({
	vertices_coords, edges_vertices, edges_faces, faces_center,
}) => {
	const edges_origin = edges_vertices
		.map(vertices => vertices_coords[vertices[0]]);
	const edges_vector = edges_vertices
		.map(vertices => subtract2(
			vertices_coords[vertices[1]],
			vertices_coords[vertices[0]],
		));
	return edges_faces
		.map((faces, i) => faces
			.map(face => cross2(
				subtract2(faces_center[face], edges_origin[i]),
				edges_vector[i],
			))
			.map(cross => Math.sign(cross)));
};
const makeTacosFacesSide = ({
	vertices_coords, edges_vertices, faces_center,
}, tacos_edges, tacos_faces) => {
	const tacos_edge_coords = tacos_edges
		.map(edges => edges_vertices[edges[0]]
			.map(vertex => vertices_coords[vertex]));
	const tacos_edge_origin = tacos_edge_coords
		.map(coords => coords[0]);
	const tacos_edge_vector = tacos_edge_coords
		.map(coords => subtract2(coords[1], coords[0]));
	const tacos_faces_center = tacos_faces
		.map(faces => faces
			.map(face_pair => face_pair
				.map(face => faces_center[face])));
	return tacos_faces_center
		.map((faces, i) => faces
			.map(pairs => pairs
				.map(center => cross2(
					subtract2(
						center,
						tacos_edge_origin[i],
					),
					tacos_edge_vector[i],
				))
				.map(cross => Math.sign(cross))));
};const classify_faces_pair = (pair) => {
	if ((pair[0] === 1 && pair[1] === -1)
		|| (pair[0] === -1 && pair[1] === 1)) {
		return "both";
	}
	if ((pair[0] === 1 && pair[1] === 1)) { return "right"; }
	if ((pair[0] === -1 && pair[1] === -1)) { return "left"; }
	return undefined;
};
const is_taco_taco = (classes) => classes[0] === classes[1]
	&& classes[0] !== "both";
const is_tortilla_tortilla = (classes) => classes[0] === classes[1]
	&& classes[0] === "both";
const is_taco_tortilla = (classes) => classes[0] !== classes[1]
	&& (classes[0] === "both" || classes[1] === "both");
const make_taco_tortilla = (face_pairs, types, faces_side) => {
	const direction = types[0] === "left" || types[1] === "left" ? -1 : 1;
	const taco = types[0] === "both" ? [...face_pairs[1]] : [...face_pairs[0]];
	const index = types[0] === "both" ? 0 : 1;
	const tortilla = faces_side[index][0] === direction
		? face_pairs[index][0]
		: face_pairs[index][1];
	return { taco, tortilla };
};
const make_tortilla_tortilla = (face_pairs, tortillas_sides) => {
	if (face_pairs === undefined) { return undefined; }
	return (tortillas_sides[0][0] === tortillas_sides[1][0])
		? face_pairs
		: [face_pairs[0], [face_pairs[1][1], face_pairs[1][0]]];
};
const makeTortillaTortillaFacesCrossing = (
	edges_faces,
	edges_faces_side,
	edges_faces_overlap,
) => {
	const tortilla_edge_indices = edges_faces_side
		.map(side => side.length === 2 && side[0] !== side[1])
		.map((isTortilla, i) => (isTortilla ? i : undefined))
		.filter(a => a !== undefined);
	const tortillas_faces_crossing = [];
	tortilla_edge_indices.forEach(edge => {
		tortillas_faces_crossing[edge] = edges_faces_overlap[edge];
	});
	const tortilla_faces_results = tortillas_faces_crossing
		.map((faces, e) => faces.map(face => [edges_faces[e], [face, face]]))
		.reduce((a, b) => a.concat(b), []);
	return tortilla_faces_results;
};
const makeTacosAndTortillas = ({
	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_center,
	edges_vector,
}, epsilon = EPSILON) => {
	if (!faces_center) {
		faces_center = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	}
	const edges_faces_side = makeEdgesFacesSide({
		vertices_coords, edges_vertices, edges_faces, faces_center,
	});
	const edge_edge_overlap_matrix = makeEdgesEdgesParallelOverlap({
		vertices_coords, edges_vertices, edges_vector,
	}, epsilon);
	const edges_faces_overlap = getEdgesFacesOverlap({
		vertices_coords, edges_vertices, edges_faces, faces_vertices,
	}, epsilon);
	const tacos_edges = connectedComponentsPairs(edge_edge_overlap_matrix)
		.filter(pair => pair
			.map(edge => edges_faces[edge].length > 1)
			.reduce((a, b) => a && b, true));
	const tacos_faces = tacos_edges
		.map(pair => pair
			.map(edge => edges_faces[edge]));
	const tacos_faces_side = makeTacosFacesSide({
		vertices_coords, edges_vertices, faces_center,
	}, tacos_edges, tacos_faces);
	const tacos_types = tacos_faces_side
		.map(faces => faces
			.map(classify_faces_pair));
	const taco_taco = tacos_types
		.map((pair, i) => (is_taco_taco(pair) ? tacos_faces[i] : undefined))
		.filter(a => a !== undefined);
	const tortilla_tortilla_aligned = tacos_types
		.map((pair, i) => (is_tortilla_tortilla(pair) ? tacos_faces[i] : undefined))
		.map((pair, i) => make_tortilla_tortilla(pair, tacos_faces_side[i]))
		.filter(a => a !== undefined);
	const tortilla_tortilla_crossing = makeTortillaTortillaFacesCrossing(
		edges_faces,
		edges_faces_side,
		edges_faces_overlap);
	const tortilla_tortilla = tortilla_tortilla_aligned
		.concat(tortilla_tortilla_crossing);
	const taco_tortilla_aligned = tacos_types
		.map((pair, i) => (is_taco_tortilla(pair)
			? make_taco_tortilla(tacos_faces[i], tacos_types[i], tacos_faces_side[i])
			: undefined))
		.filter(a => a !== undefined);
	const edges_overlap_faces = edges_faces_overlap
		.map((faces, e) => (edges_faces_side[e].length > 1
			&& edges_faces_side[e][0] === edges_faces_side[e][1]
			? faces
			: []));
	const taco_tortillas_crossing = edges_overlap_faces
		.map((tortillas, edge) => ({ taco: edges_faces[edge], tortillas }))
		.filter(el => el.tortillas.length);
	const taco_tortilla_crossing = taco_tortillas_crossing
		.flatMap(el => el.tortillas
			.map(tortilla => ({ taco: [...el.taco], tortilla })));
	const taco_tortilla = taco_tortilla_aligned.concat(taco_tortilla_crossing);
	return {
		taco_taco,
		tortilla_tortilla,
		taco_tortilla,
	};
};const makeTransitivity = (
	{ faces_polygon },
	facesFacesOverlap,
	epsilon = EPSILON,
) => {
	const overlap_matrix = facesFacesOverlap.map(() => []);
	facesFacesOverlap.forEach((faces, i) => faces.forEach(j => {
		overlap_matrix[i][j] = true;
		overlap_matrix[j][i] = true;
	}));
	const facesFacesIntersection = [];
	facesFacesOverlap.forEach((faces, i) => faces.forEach(j => {
		const polygon = clipPolygonPolygon(faces_polygon[i], faces_polygon[j], epsilon);
		if (polygon) {
			if (!facesFacesIntersection[i]) { facesFacesIntersection[i] = []; }
			if (!facesFacesIntersection[j]) { facesFacesIntersection[j] = []; }
			facesFacesIntersection[i][j] = polygon;
			facesFacesIntersection[j][i] = polygon;
		}
	}));
	const trios = [];
	for (let i = 0; i < facesFacesIntersection.length - 1; i += 1) {
		if (!facesFacesIntersection[i]) { continue; }
		for (let j = i + 1; j < facesFacesIntersection.length; j += 1) {
			if (!facesFacesIntersection[i][j]) { continue; }
			for (let k = j + 1; k < facesFacesIntersection.length; k += 1) {
				if (i === k || j === k) { continue; }
				if (!overlap_matrix[i][k] || !overlap_matrix[j][k]) { continue; }
				const polygon = clipPolygonPolygon(
					facesFacesIntersection[i][j],
					faces_polygon[k],
					epsilon,
				);
				if (polygon) { trios.push([i, j, k].sort((a, b) => a - b)); }
			}
		}
	}
	return trios;
};
const filterTransitivity = (transitivity_trios, { taco_taco, taco_tortilla }) => {
	const tacos_trios = {};
	taco_taco
		.map(tacos => [tacos[0][0], tacos[0][1], tacos[1][0], tacos[1][1]]
			.sort((a, b) => a - b))
		.forEach(taco => [
			`${taco[0]} ${taco[1]} ${taco[2]}`,
			`${taco[0]} ${taco[1]} ${taco[3]}`,
			`${taco[0]} ${taco[2]} ${taco[3]}`,
			`${taco[1]} ${taco[2]} ${taco[3]}`,
		].forEach(key => { tacos_trios[key] = true; }));
	taco_tortilla
		.map(el => [el.taco[0], el.taco[1], el.tortilla]
			.sort((a, b) => a - b).join(" "))
		.forEach(key => { tacos_trios[key] = true; });
	return transitivity_trios
		.filter(trio => tacos_trios[trio.join(" ")] === undefined);
};const transitivity=/*#__PURE__*/Object.freeze({__proto__:null,filterTransitivity,makeTransitivity});const setup$1 = ({
	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges,
	edges_vector,
}, epsilon = EPSILON) => {
	const faces_winding = makeFacesWinding({ vertices_coords, faces_vertices });
	const faces_polygon = makeFacesPolygon({ vertices_coords, faces_vertices }, epsilon);
	faces_winding
		.map((upright, i) => (upright ? undefined : i))
		.filter(a => a !== undefined)
		.forEach(f => faces_polygon[f].reverse());
	const facesFacesOverlap = getFacesFacesOverlap({
		vertices_coords, faces_vertices,
	}, epsilon);
	const {
		taco_taco, taco_tortilla, tortilla_tortilla,
	} = makeTacosAndTortillas({
		vertices_coords,
		edges_vertices,
		edges_faces,
		faces_vertices,
		faces_edges,
		edges_vector,
	}, epsilon);
	const unfilteredTrans = makeTransitivity({ faces_polygon }, facesFacesOverlap, epsilon);
	const transitivity = filterTransitivity(unfilteredTrans, { taco_taco, taco_tortilla });
	const facePairs = connectedComponentsPairs(facesFacesOverlap)
		.map(pair => pair.join(" "));
	const constraints = makeConstraints({
		taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
	});
	const lookup = makeConstraintsLookup(constraints);
	return {
		constraints,
		lookup,
		facePairs,
		faces_winding,
	};
};const setup$2=/*#__PURE__*/Object.freeze({__proto__:null,setup:setup$1});const solveEdgeAdjacent = ({
	edges_faces, edges_assignment,
}, facePairs, faces_winding) => {
	const flipCondition = { 0: 0, 1: 2, 2: 1 };
	const assignmentOrder = { M: 1, m: 1, V: 2, v: 2 };
	const facePairsHash = {};
	facePairs.forEach(key => { facePairsHash[key] = true; });
	const solution = {};
	edges_faces.forEach((faces, edge) => {
		const assignment = edges_assignment[edge];
		const localOrder = assignmentOrder[assignment];
		if (faces.length < 2 || localOrder === undefined) { return; }
		const upright = faces_winding[faces[0]];
		const globalOrder = upright
			? localOrder
			: flipCondition[localOrder];
		const key1 = `${faces[0]} ${faces[1]}`;
		const key2 = `${faces[1]} ${faces[0]}`;
		if (key1 in facePairsHash) { solution[key1] = globalOrder; }
		if (key2 in facePairsHash) {
			solution[key2] = flipCondition[globalOrder];
		}
	});
	return solution;
};const taco_taco_valid_states = [
	"111112",
	"111121",
	"111222",
	"112111",
	"121112",
	"121222",
	"122111",
	"122212",
	"211121",
	"211222",
	"212111",
	"212221",
	"221222",
	"222111",
	"222212",
	"222221",
];
const taco_tortilla_valid_states = ["112", "121", "212", "221"];
const tortilla_tortilla_valid_states = ["11", "22"];
const transitivity_valid_states = [
	"112",
	"121",
	"122",
	"211",
	"212",
	"221",
];
const check_state = (states, t, key) => {
	const A = Array.from(key).map(char => parseInt(char, 10));
	if (A.filter(x => x === 0).length !== t) { return; }
	states[t][key] = false;
	let solution = false;
	for (let i = 0; i < A.length; i += 1) {
		const modifications = [];
		if (A[i] !== 0) { continue; }
		for (let x = 1; x <= 2; x += 1) {
			A[i] = x;
			if (states[t - 1][A.join("")] !== false) {
				modifications.push([i, x]);
			}
		}
		A[i] = 0;
		if (modifications.length > 0 && solution === false) {
			solution = [];
		}
		if (modifications.length === 1) {
			solution.push(modifications[0]);
		}
	}
	if (solution !== false && solution.length === 0) {
		solution = true;
	}
	states[t][key] = solution;
};
const make_lookup = (valid_states) => {
	const chooseCount = valid_states[0].length;
	const states = Array
		.from(Array(chooseCount + 1))
		.map(() => ({}));
	Array.from(Array(2 ** chooseCount))
		.map((_, i) => i.toString(2))
		.map(str => Array.from(str).map(n => parseInt(n, 10) + 1).join(""))
		.map(str => (`11111${str}`).slice(-chooseCount))
		.forEach(key => { states[0][key] = false; });
	valid_states.forEach(s => { states[0][s] = true; });
	Array.from(Array(chooseCount))
		.map((_, i) => i + 1)
		.map(t => Array.from(Array(3 ** chooseCount))
			.map((_, i) => i.toString(3))
			.map(str => (`000000${str}`).slice(-chooseCount))
			.forEach(key => check_state(states, t, key)));
	let outs = [];
	Array.from(Array(chooseCount + 1))
		.map((_, i) => chooseCount - i)
		.forEach(t => {
			const A = [];
			Object.keys(states[t]).forEach(key => {
				let out = states[t][key];
				if (out.constructor === Array) { out = out[0]; }
				A.push([key, out]);
			});
			outs = outs.concat(A);
		});
	outs.sort((a, b) => parseInt(a[0], 10) - parseInt(b[0], 10));
	const lookup = {};
	outs.forEach(el => { lookup[el[0]] = Object.freeze(el[1]); });
	return Object.freeze(lookup);
};
const layerTable = {
	taco_taco: make_lookup(taco_taco_valid_states),
	taco_tortilla: make_lookup(taco_tortilla_valid_states),
	tortilla_tortilla: make_lookup(tortilla_tortilla_valid_states),
	transitivity: make_lookup(transitivity_valid_states),
};const taco_types = Object.freeze(Object.keys(layerTable));
const buildRuleAndLookup = (type, constraint, ...orders) => {
	const flipFacePairOrder = { 0: 0, 1: 2, 2: 1 };
	const facePairsArray = constraintToFacePairs[type](constraint);
	const flipped = facePairsArray.map(pair => pair[1] < pair[0]);
	const facePairs = facePairsArray.map((pair, i) => (flipped[i]
		? `${pair[1]} ${pair[0]}`
		: `${pair[0]} ${pair[1]}`));
	const key = facePairs.map((facePair, i) => {
		for (let o = 0; o < orders.length; o += 1) {
			if (orders[o][facePair]) {
				return flipped[i]
					? flipFacePairOrder[orders[o][facePair]]
					: orders[o][facePair];
			}
		}
		return 0;
	}).join("");
	if (layerTable[type][key] === true || layerTable[type][key] === false) {
		return layerTable[type][key];
	}
	const implication = layerTable[type][key];
	const implicationFacePair = facePairs[implication[0]];
	const implicationOrder = flipped[implication[0]]
		? flipFacePairOrder[implication[1]]
		: implication[1];
	return [implicationFacePair, implicationOrder];
};
const getConstraintIndicesFromFacePairs = (
	constraints,
	lookup,
	facePairsSubsetArray,
) => {
	const constraintIndices = {};
	taco_types.forEach(type => {
		const constraintIndicesWithDups = facePairsSubsetArray
			.flatMap(facePair => lookup[type][facePair]);
		constraintIndices[type] = uniqueElements(constraintIndicesWithDups)
			.filter(i => constraints[type][i]);
	});
	return constraintIndices;
};
const propagate = (
	constraints,
	constraintsLookup,
	initiallyModifiedFacePairs,
	...orders
) => {
	let modifiedFacePairs = initiallyModifiedFacePairs;
	const newOrders = {};
	do {
		const modifiedConstraintIndices = getConstraintIndicesFromFacePairs(
			constraints,
			constraintsLookup,
			modifiedFacePairs,
		);
		const roundModificationsFacePairs = {};
		for (let t = 0; t < taco_types.length; t += 1) {
			const type = taco_types[t];
			const indices = modifiedConstraintIndices[type];
			for (let i = 0; i < indices.length; i += 1) {
				const lookupResult = buildRuleAndLookup(
					type,
					constraints[type][indices[i]],
					...orders,
					newOrders,
				);
				if (lookupResult === true) { continue; }
				if (lookupResult === false) {
					throw new Error(`invalid ${type} ${indices[i]}:${constraints[type][indices[i]]}`);
				}
				if (newOrders[lookupResult[0]]) {
					if (newOrders[lookupResult[0]] !== lookupResult[1]) {
						throw new Error(`conflict ${type} ${indices[i]}:${constraints[type][indices[i]]}`);
					}
				} else {
					const [key, value] = lookupResult;
					roundModificationsFacePairs[key] = true;
					newOrders[lookupResult[0]] = value;
				}
			}
		}
		modifiedFacePairs = Object.keys(roundModificationsFacePairs);
	} while (modifiedFacePairs.length);
	return newOrders;
};const getBranches = (
	remainingKeys,
	constraints,
	lookup,
) => {
	const taco_types = Object.keys(constraints);
	const keys = {};
	remainingKeys.forEach(key => { keys[key] = true; });
	let i = 0;
	const groups = [];
	while (i < remainingKeys.length) {
		if (!keys[remainingKeys[i]]) { i += 1; continue; }
		const group = [];
		const stack = [remainingKeys[i]];
		const stackHash = { [remainingKeys[i]]: true };
		do {
			const key = stack.pop();
			delete keys[key];
			group.push(key);
			const neighborsHash = {};
			taco_types.forEach(type => {
				const indices = lookup[type][key];
				if (!indices) { return; }
				indices
					.map(c => constraints[type][c])
					.map(faces => constraintToFacePairsStrings[type](faces)
						.forEach(facePair => { neighborsHash[facePair] = true; }));
			});
			const neighbors = Object.keys(neighborsHash)
				.filter(facePair => keys[facePair])
				.filter(facePair => !stackHash[facePair]);
			stack.push(...neighbors);
			neighbors.forEach(facePair => { stackHash[facePair] = true; });
		} while (stack.length);
		i += 1;
		groups.push(group);
	}
	return groups;
};const solveBranch = (
	constraints,
	lookup,
	unsolvedKeys,
	...orders
) => {
	if (!unsolvedKeys.length) { return []; }
	const guessKey = unsolvedKeys[0];
	const completedSolutions = [];
	const unfinishedSolutions = [];
	[1, 2].forEach(b => {
		let result;
		try {
			result = propagate(
				constraints,
				lookup,
				[guessKey],
				...orders,
				{ [guessKey]: b },
			);
		} catch (error) {
			return;
		}
		result[guessKey] = b;
		if (Object.keys(result).length === unsolvedKeys.length) {
			completedSolutions.push(result);
		} else {
			unfinishedSolutions.push(result);
		}
	});
	const recursed = unfinishedSolutions
		.map(order => solveBranch(
			constraints,
			lookup,
			unsolvedKeys.filter(key => !(key in order)),
			...orders,
			order,
		));
	return completedSolutions
		.map(order => ([...orders, order]))
		.concat(...recursed);
};
const solver2d = ({ constraints, lookup, facePairs, orders }) => {
	let initialResult;
	try {
		initialResult = propagate(constraints, lookup, Object.keys(orders), orders);
	} catch (error) {
		throw new Error(Messages$1.noLayerSolution, { cause: error });
	}
	const remainingKeys = facePairs
		.filter(key => !(key in orders))
		.filter(key => !(key in initialResult));
	let branchResults;
	try {
		branchResults = getBranches(remainingKeys, constraints, lookup)
			.map(unsolvedKeys => solveBranch(
				constraints,
				lookup,
				unsolvedKeys,
				orders,
				initialResult,
			));
	} catch (error) {
		throw new Error(Messages$1.noLayerSolution, { cause: error });
	}
	const root = { ...orders, ...initialResult };
	const branches = branchResults
		.map(branch => branch
			.map(solution => Object.assign({}, ...solution)));
	return { root, branches };
};const makePermutations = (counts) => {
	const totalLength = counts.reduce((a, b) => a * b, 1);
	const maxPlace = counts.slice();
	for (let i = maxPlace.length - 2; i >= 0; i -= 1) {
		maxPlace[i] *= maxPlace[i + 1];
	}
	maxPlace.push(1);
	maxPlace.shift();
	return Array.from(Array(totalLength))
		.map((_, i) => counts
			.map((c, j) => Math.floor(i / maxPlace[j]) % c));
};
const LayerPrototype = {
	count: function () {
		return this.branches.map(arr => arr.length);
	},
	faceOrders: function (...indices) {
		return solverSolutionToFaceOrders(
			this.compile(...indices),
			this.faces_winding,
		);
	},
	facesLayer: function (...indices) {
		return invertMap(this.linearize(...indices).reverse());
	},
	compile: function (...indices) {
		const option = Array(this.branches.length)
			.fill(0)
			.map((n, i) => (indices[i] != null ? indices[i] : n));
		const branchesSolution = this.branches
			? this.branches.map((options, i) => options[option[i]])
			: [];
		return Object.assign({}, this.root, ...branchesSolution);
	},
	directedPairs: function (...indices) {
		const orders = this.compile(...indices);
		return Object.keys(orders)
			.map(pair => (orders[pair] === 1
				? pair.split(" ")
				: pair.split(" ").reverse()))
			.map(pair => pair.map(n => parseInt(n, 10)));
	},
	linearize: function (...indices) {
		return topologicalSort(this.directedPairs(...indices));
	},
	allSolutions: function () {
		return makePermutations(this.count())
			.map(count => this.compile(...count));
	},
	allFacesLayers: function () {
		return makePermutations(this.count())
			.map(count => this.facesLayer(...count));
	},
};const emptyLayerSolution$1 = () => ({ root: {}, branches: [], faces_winding: [] });
const layer = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment,
	faces_vertices, faces_edges, edges_vector,
}, epsilon) => {
	if (!vertices_coords || !edges_vertices || !faces_vertices) {
		return Object.assign(Object.create(LayerPrototype), emptyLayerSolution$1());
	}
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	if (!edges_faces) {
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
	}
	if (epsilon === undefined) {
		epsilon = makeEpsilon({ vertices_coords, edges_vertices });
	}
	const { constraints, lookup, facePairs, faces_winding } = setup$1({
		vertices_coords,
		edges_vertices,
		edges_faces,
		faces_vertices,
		faces_edges,
		edges_vector,
	}, epsilon);
	const orders = solveEdgeAdjacent({
		edges_faces,
		edges_assignment,
	}, facePairs, faces_winding);
	const { root, branches } = solver2d({ constraints, lookup, facePairs, orders });
	return Object.assign(Object.create(LayerPrototype), {
		root,
		branches,
		faces_winding,
	});
};const doRangesOverlap = (a, b, epsilon = EPSILON) => {
	const r1 = a[0] < a[1] ? a : [a[1], a[0]];
	const r2 = b[0] < b[1] ? b : [b[1], b[0]];
	const overlap = Math.min(r1[1], r2[1]) - Math.max(r1[0], r2[0]);
	return overlap > epsilon;
};
const doEdgesOverlap = ({
	vertices_coords, edges_vertices,
}, edgePair, vector, epsilon = EPSILON) => {
	const pairCoords = edgePair
		.map(edge => edges_vertices[edge]
			.map(v => vertices_coords[v]));
	const pairCoordsDots = pairCoords
		.map(edge => edge
			.map(coord => dot(coord, vector)));
	const result = doRangesOverlap(...pairCoordsDots, epsilon);
	return result;
};
const reformatSolution = (solution, faces_winding) => {
	if (solution.orders) {
		solution.orders = solution.orders
			.flatMap(order => solverSolutionToFaceOrders(order, faces_winding));
	}
	if (solution.leaves) {
		solution.leaves = solution.leaves
			.map(order => solverSolutionToFaceOrders(order, faces_winding));
	}
	if (solution.partitions) {
		solution.partitions
			.forEach(child => reformatSolution(child, faces_winding));
	}
	if (solution.node) {
		solution.node
			.forEach(child => reformatSolution(child, faces_winding));
	}
	return solution;
};const general3d=/*#__PURE__*/Object.freeze({__proto__:null,doEdgesOverlap,doRangesOverlap,reformatSolution});const getOverlappingCollinearEdges = ({
	vertices_coords, edges_vertices,
}, epsilon = EPSILON) => {
	const {
		lines,
		edges_line,
	} = getEdgesLine({ vertices_coords, edges_vertices }, epsilon);
	const edges_vector = edges_line.map(line => lines[line].vector);
	const edges_dots = makeEdgesCoords({ vertices_coords, edges_vertices })
		.map((points, e) => points
			.map(point => dot(edges_vector[e], point)));
	return invertMap(edges_line)
		.map(el => (el.constructor === Array ? el : [el]))
		.flatMap(edges => chooseTwoPairs(edges)
			.filter(pair => (doRangesOverlap(...pair.map(n => edges_dots[n])))));
};
const getOverlappingParallelEdgePairs = ({
	vertices_coords, edges_vertices, edges_faces, edges_foldAngle, faces_center,
}, edges_sets, faces_set, sets_transformXY, epsilon = EPSILON) => {
	const edgesFlat = edges_foldAngle.map(edgeFoldAngleIsFlat);
	const pairs_edges = getOverlappingCollinearEdges(
		{ vertices_coords, edges_vertices },
		epsilon,
	).map(pair => (pair[0] < pair[1] ? pair : pair.slice().reverse()))
		.filter(p => !(edgesFlat[p[0]] && edgesFlat[p[1]]))
		.filter(pair => pair
			.map(edge => edges_faces[edge].length === 2)
			.reduce((a, b) => a && b, true))
		.filter(pair => pair
			.map(edge => edges_sets[edge] !== undefined)
			.reduce((a, b) => a && b, true))
		.filter(pair => Array
			.from(new Set(pair.flatMap(e => edges_sets[e]))).length !== 4);
	const pairs_edges_sets = pairs_edges
		.map(pair => pair.map(e => edges_sets[e]));
	const pairs_sets = pairs_edges_sets
		.map(sets => Array.from(new Set(sets.flat())));
	const pairs_sets_edges = pairs_edges_sets.map((pair, i) => {
		const hash = {};
		pair.flat().forEach(s => { hash[s] = []; });
		pair.forEach((sets, j) => sets
			.forEach(s => hash[s].push(pairs_edges[i][j])));
		return hash;
	});
	const pairs_edges_faces = pairs_edges
		.map(pair => pair.map(e => edges_faces[e]));
	const pairs_sets_faces = pairs_edges_faces
		.map((faces, i) => {
			const hash = {};
			pairs_sets[i].forEach(s => { hash[s] = []; });
			faces.flat().forEach(f => hash[faces_set[f]].push(f));
			return hash;
		});
	const edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	const pairs_sets_2dEdges = pairs_sets.map((sets, i) => {
		const segment3D = edges_coords[pairs_edges[i][0]];
		const hash = {};
		sets.forEach(set => {
			hash[set] = segment3D
				.map(p => multiplyMatrix4Vector3(sets_transformXY[set], p))
				.map(p => [p[0], p[1]]);
		});
		return hash;
	});
	const pairs_sets_facesSides = pairs_sets_faces.map((pair, i) => {
		const hash = {};
		pairs_sets[i].forEach(set => {
			const origin = pairs_sets_2dEdges[i][set][0];
			hash[set] = pair[set].map(f => cross2(
				subtract2(faces_center[f], origin),
				subtract2(pairs_sets_2dEdges[i][set][1], origin),
			)).map(cross => Math.sign(cross));
		});
		return hash;
	});
	const pairs_sets_facesSidesSameSide = pairs_sets_facesSides
		.map((pair, i) => {
			const hash = {};
			pairs_sets[i].forEach(set => {
				hash[set] = pair[set].reduce((a, b) => a && (b === pair[set][0]), true);
			});
			return hash;
		});
	const pairs_data = pairs_edges.map((edges, i) => {
		const sets = {};
		Object.keys(pairs_sets_edges[i]).forEach(set => {
			sets[set] = {
				edges: pairs_sets_edges[i][set],
				faces: pairs_sets_faces[i][set],
				facesSides: pairs_sets_facesSides[i][set],
				facesSameSide: pairs_sets_facesSidesSameSide[i][set],
			};
		});
		return { edges, sets };
	});
	const tortillaTortillaEdges = pairs_data.filter(data => {
		const testA = Object.values(data.sets)
			.map(el => el.faces.length === 2)
			.reduce((a, b) => a && b, true);
		const testB = Object.values(data.sets)
			.map(el => el.facesSameSide)
			.reduce((a, b) => a && b, true);
		return testA && testB;
	});
	const solvable1 = pairs_data.filter(data => {
		const testA = Object.values(data.sets).length === 3;
		const testB = Object.values(data.sets)
			.map(el => el.facesSameSide)
			.reduce((a, b) => a && b, true);
		return testA && testB;
	});
	const solvable2 = pairs_data.filter(data => {
		const testA = Object.values(data.sets)
			.map(el => el.faces.length === 2)
			.reduce((a, b) => a && b, true);
		const sameSide = Object.values(data.sets)
			.map(el => el.facesSameSide);
		const testB = sameSide[0] !== sameSide[1];
		return testA && testB;
	});
	const solvable3 = pairs_data.filter(data => {
		const threeInPlane = Object.values(data.sets)
			.filter(el => el.faces.length === 3)
			.shift();
		const testA = threeInPlane !== undefined;
		if (!testA) { return false; }
		const sum = threeInPlane.facesSides.reduce((a, b) => a + b, 0);
		const testB = Math.abs(sum) === 1;
		if (!testB) { return false; }
		const sameSideFaces = threeInPlane.faces
			.filter((_, i) => threeInPlane.facesSides[i] === sum);
		const isAdjacent = threeInPlane.edges
			.map(e => edges_faces[e]
				.map(f => sameSideFaces.includes(f))
				.reduce((a, b) => a && b, true))
			.reduce((a, b) => a || b, false);
		const testC = !isAdjacent;
		return testA && testB && testC;
	});
	if (solvable3.length) {
		console.log("This model contains the third case", solvable3);
	}
	return {
		tortillaTortillaEdges,
		solvable1,
		solvable2,
		solvable3: [],
	};
};const makeBentTortillas = ({
	edges_faces,
}, tortillaTortillaEdges, faces_set, faces_winding) => {
	const tortilla_faces = tortillaTortillaEdges
		.map(el => el.edges)
		.map(pair => pair
			.map(edge => edges_faces[edge].slice()));
	tortilla_faces.forEach((tortillas, i) => {
		if (faces_set[tortillas[0][0]] !== faces_set[tortillas[1][0]]) {
			tortilla_faces[i][1].reverse();
		}
	});
	tortilla_faces
		.map(tortillas => [tortillas[0][0], tortillas[0][1]])
		.map(faces => faces.map(face => faces_winding[face]))
		.map((orients, i) => (orients[0] !== orients[1] ? i : undefined))
		.filter(a => a !== undefined)
		.forEach(i => {
			const temp = tortilla_faces[i][0][1];
			tortilla_faces[i][0][1] = tortilla_faces[i][1][1];
			tortilla_faces[i][1][1] = temp;
		});
	return tortilla_faces;
};const polygonSegmentOverlap = (polygon, segment, epsilon = EPSILON) => {
	const pointInPolygon = segment
		.map(point => overlapConvexPolygonPoint(
			polygon,
			point,
			exclude,
			epsilon,
		)).reduce((a, b) => a || b, false);
	if (pointInPolygon) { return true; }
	const edgeClip = clipLineConvexPolygon(
		polygon,
		{ vector: subtract2(segment[1], segment[0]), origin: segment[0] },
		exclude,
		excludeS,
		epsilon,
	);
	return edgeClip !== undefined;
};
const solveEdgeFaceOverlapOrders = (
	{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
	sets_facePairs,
	sets_transformXY,
	sets_faces,
	faces_set,
	faces_polygon,
	faces_winding,
	edges_sets,
	epsilon = EPSILON,
) => {
	const sets_facesBunch = sets_faces.slice();
	sets_facesBunch.forEach((arr, i) => {
		if (arr.length < 2) { delete sets_facesBunch[i]; }
	});
	const edges_facesLookup = edges_faces.map(faces => {
		const lookup = {};
		faces.forEach(face => { lookup[face] = true; });
		return lookup;
	});
	const edgesSetsFaces = edges_sets
		.map(sets => sets
			.filter(set => sets_facesBunch[set] !== undefined)
			.map(set => sets_facesBunch[set]));
	edges_sets
		.map((_, i) => i)
		.filter(e => edgesSetsFaces[e].length < 2)
		.forEach(e => delete edgesSetsFaces[e]);
	const edgesSetsFacesAdjacent = edgesSetsFaces
		.map((sets, edge) => sets
			.map(faces => faces
				.filter(face => edges_facesLookup[edge][face])));
	const edgesSetsFacesAllNonAdjacent = edgesSetsFaces
		.map((sets, edge) => sets
			.map(faces => faces
				.filter(face => !edges_facesLookup[edge][face])));
	const edgesSegment3D = edgesSetsFaces
		.map((_, e) => edges_vertices[e]
			.map(v => vertices_coords[v]));
	const edgesSetsFacesNonAdjacent = edgesSetsFacesAllNonAdjacent
		.map((sets, edge) => sets
			.map(faces => faces
				.map(face => {
					const segmentTransform = edgesSegment3D[edge]
						.map(point => multiplyMatrix4Vector3(
							sets_transformXY[faces_set[face]],
							point,
						));
					const segment2D = segmentTransform.map(p => [p[0], p[1]]);
					return polygonSegmentOverlap(faces_polygon[face], segment2D, epsilon)
						? face
						: undefined;
				})
				.filter(a => a !== undefined)));
	const tacoTortillas3D = edgesSetsFaces
		.flatMap((_, edge) => edgesSetsFacesNonAdjacent[edge]
			.flatMap((faces, setIndex) => {
				const otherSetIndex = 1 - setIndex;
				const adjacent = edgesSetsFacesAdjacent[edge];
				return faces.map(face => ({
					edge,
					faces: [adjacent[setIndex][0], adjacent[otherSetIndex][0]],
					overlap: face,
					set: faces_set[face],
				}));
			}));
	const tacoTortillas3DFacePairs = tacoTortillas3D
		.map(el => [el.faces[0], el.overlap]);
	const tacoTortillas3DFacePairsCorrect = tacoTortillas3DFacePairs
		.map(pair => pair[0] < pair[1]);
	tacoTortillas3DFacePairsCorrect.forEach((correct, i) => {
		if (!correct) { tacoTortillas3DFacePairs[i].reverse(); }
	});
	const tacoTortillas3DAligned = tacoTortillas3D
		.map(el => faces_winding[el.faces[0]]);
	const tacoTortillas3DBendDir = tacoTortillas3D
		.map(el => edges_foldAngle[el.edge])
		.map(Math.sign)
		.map(n => n === 1);
	const tacoTortillas3DXOR = tacoTortillas3D
		.map((_, i) => tacoTortillas3DAligned[i] ^ tacoTortillas3DBendDir[i]);
	const tacoTortillas3DSolution = tacoTortillas3DXOR
		.map((xor, i) => (tacoTortillas3DFacePairsCorrect[i] ? xor : 1 - xor))
		.map(xor => xor + 1);
	const orders = {};
	tacoTortillas3DFacePairs.forEach((pair, i) => {
		orders[pair.join(" ")] = tacoTortillas3DSolution[i];
	});
	return orders;
};
const solveFacePair3D = ({
	edges_foldAngle, faces_winding,
}, tortillaEdges, tortillaFaces) => {
	const tortillaEdgesFoldAngle = tortillaEdges
		.map(edges => edges
			.map(edge => edges_foldAngle[edge]));
	const tortillaFacesAligned = tortillaFaces
		.map(faces => faces
			.map(f => faces_winding[f]));
	const tortillaEdgesFoldAngleAligned = tortillaEdgesFoldAngle
		.map((angles, i) => angles
			.map((angle, j) => (tortillaFacesAligned[i][j] ? angle : -angle)));
	const indicesInOrder = tortillaEdgesFoldAngleAligned
		.map(angles => angles[0] > angles[1]);
	const facesInOrder = tortillaFaces.map(faces => faces[0] < faces[1]);
	const switchNeeded = tortillaFaces
		.map((faces, i) => indicesInOrder[i] ^ facesInOrder[i]);
	const result = {};
	const faceKeys = tortillaFaces
		.map((pair, i) => (facesInOrder[i] ? pair : pair.slice().reverse()))
		.map(pair => pair.join(" "));
	switchNeeded
		.map(n => n + 1)
		.forEach((order, i) => { result[faceKeys[i]] = order; });
	return result;
};
const solveType1 = ({ edges_foldAngle, faces_winding }, edgePairData) => {
	const tortilla = edgePairData
		.map(el => Object.values(el.sets)
			.sort((a, b) => b.faces.length - a.faces.length)
			.shift());
	const tortillaEdges = tortilla.map(el => el.edges);
	const tortillaFaces = tortilla.map(el => el.faces);
	return solveFacePair3D({ edges_foldAngle, faces_winding }, tortillaEdges, tortillaFaces);
};
const solveType2 = ({ edges_foldAngle, faces_winding }, edgePairData) => {
	const tortilla = edgePairData
		.map(el => Object.values(el.sets)
			.filter(row => row.facesSameSide)
			.shift());
	const tortillaEdges = tortilla.map(el => el.edges);
	const tortillaFaces = tortilla.map(el => el.faces);
	return solveFacePair3D({ edges_foldAngle, faces_winding }, tortillaEdges, tortillaFaces);
};
const solveType3 = ({ edges_foldAngle, faces_winding }, edgePairData) => {
	return {};
};
const solveEdgeEdgeOverlapOrders = ({
	edges_foldAngle, faces_winding,
}, solvable1, solvable2, solvable3) => {
	const result1 = solveType1({ edges_foldAngle, faces_winding }, solvable1);
	const result2 = solveType2({ edges_foldAngle, faces_winding }, solvable2);
	const result3 = solveType3({ edges_foldAngle, faces_winding });
	return {
		...result1,
		...result2,
		...result3,
	};
};const graphGroupCopies = (graph, sets_faces, sets_transform) => {
	const transformTo2D = (matrix, point) => {
		const p = multiplyMatrix4Vector3(matrix, point);
		return [p[0], p[1]];
	};
	const vertices_coords_3d = graph.vertices_coords
		.map(coord => resize(3, coord));
	const copies = sets_faces.map(faces => subgraphWithFaces(graph, faces));
	sets_transform.forEach((matrix, i) => {
		copies[i].vertices_coords = copies[i].vertices_coords
			.map((_, v) => transformTo2D(matrix, vertices_coords_3d[v]));
	});
	const nonFlatEdges = graph.edges_foldAngle
		.map(edgeFoldAngleIsFlat)
		.map((flat, i) => (!flat ? i : undefined))
		.filter(a => a !== undefined);
	const edgesKeys = filterKeysWithPrefix(graph, "edges");
	copies.forEach(copy => nonFlatEdges
		.forEach(e => edgesKeys
			.forEach(key => { delete copy[key][e]; })));
	return copies;
};const copyGraph=/*#__PURE__*/Object.freeze({__proto__:null,graphGroupCopies});const getEdgesSets = ({ edges_vertices, faces_edges }, faces_set) => {
	const edges_sets_lookup = edges_vertices.map(() => ({}));
	faces_set
		.forEach((set, face) => faces_edges[face]
			.forEach(edge => { edges_sets_lookup[edge][set] = true; }));
	const edges_sets = edges_sets_lookup
		.map(o => Object.keys(o)
			.map(n => parseInt(n, 10))
			.sort((a, b) => a - b));
	return edges_sets;
};
const setup3d = ({
	vertices_coords, edges_vertices, edges_faces, edges_foldAngle, faces_edges,
	faces_winding, faces_center,
}, sets_faces, sets_transformXY, faces_set, faces_polygon, facePairs, facePairsInts, epsilon) => {
	const facePairsIndex_set = facePairsInts
		.map(pair => faces_set[pair[0]]);
	const sets_facePairsIndex = invertMap(facePairsIndex_set)
		.map(el => (el.constructor === Array ? el : [el]));
	const sets_facePairs = sets_facePairsIndex
		.map(indices => indices.map(i => facePairs[i]));
	const edges_sets = getEdgesSets({ edges_vertices, faces_edges }, faces_set);
	edges_sets
		.map((arr, i) => (arr.length !== 2 ? i : undefined))
		.filter(e => e !== undefined)
		.forEach(e => delete edges_sets[e]);
	const {
		tortillaTortillaEdges,
		solvable1,
		solvable2,
		solvable3,
	} = getOverlappingParallelEdgePairs({
		vertices_coords, edges_vertices, edges_faces, edges_foldAngle, faces_center,
	}, edges_sets, faces_set, sets_transformXY, epsilon);
	const tortillas3D = makeBentTortillas(
		{ edges_faces },
		tortillaTortillaEdges,
		faces_set,
		faces_winding,
	);
	const ordersEdgeFace = solveEdgeFaceOverlapOrders(
		{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
		sets_facePairs,
		sets_transformXY,
		sets_faces,
		faces_set,
		faces_polygon,
		faces_winding,
		edges_sets,
		epsilon,
	);
	const ordersEdgeEdge = solveEdgeEdgeOverlapOrders({
		edges_foldAngle, faces_winding,
	}, solvable1, solvable2);
	const orders = {
		...ordersEdgeFace,
		...ordersEdgeEdge,
	};
	return {
		tortillas3D,
		orders,
	};
};
const setup = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges, faces_faces,
}, epsilon = EPSILON) => {
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	if (!edges_faces) {
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
	}
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	if (!edges_foldAngle && edges_assignment) {
		edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
	}
	if (!edges_assignment) {
		edges_assignment = makeEdgesAssignmentSimple({ edges_foldAngle });
	}
	const {
		sets_faces,
		sets_transformXY,
		faces_set,
		faces_winding,
	} = coplanarOverlappingFacesGroups({
		vertices_coords, faces_vertices, faces_faces,
	}, epsilon);
	const sets_graphs = graphGroupCopies({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_assignment,
		edges_foldAngle,
		faces_vertices,
		faces_edges,
		faces_faces,
	}, sets_faces, sets_transformXY);
	const faces_polygon = mergeArraysWithHoles(...sets_graphs
		.map(copy => makeFacesPolygon(copy, epsilon)));
	faces_winding
		.map((upright, i) => (upright ? undefined : i))
		.filter(a => a !== undefined)
		.forEach(f => faces_polygon[f].reverse());
	const facesFacesOverlap = mergeArraysWithHoles(...sets_graphs
		.map(graph => getFacesFacesOverlap(graph, epsilon)));
	const faces_center = faces_polygon.map(coords => average2(...coords));
	sets_graphs.forEach(el => {
		el.faces_center = el.faces_vertices.map((_, f) => faces_center[f]);
	});
	const setsTacosAndTortillas = sets_graphs
		.map(el => makeTacosAndTortillas(el, epsilon));
	const taco_taco = setsTacosAndTortillas.flatMap(set => set.taco_taco);
	const taco_tortilla = setsTacosAndTortillas.flatMap(set => set.taco_tortilla);
	const tortilla_tortilla = setsTacosAndTortillas.flatMap(set => set.tortilla_tortilla);
	const unfilteredTrans = makeTransitivity({ faces_polygon }, facesFacesOverlap, epsilon);
	const transitivity = filterTransitivity(unfilteredTrans, { taco_taco, taco_tortilla });
	const facePairsInts = connectedComponentsPairs(facesFacesOverlap);
	const facePairs = facePairsInts.map(pair => pair.join(" "));
	const {
		tortillas3D,
		orders,
	} = setup3d({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_foldAngle,
		faces_edges,
		faces_winding,
		faces_center,
	}, sets_faces, sets_transformXY, faces_set, faces_polygon, facePairs, facePairsInts, epsilon);
	tortilla_tortilla.push(...tortillas3D);
	const constraints = makeConstraints({
		taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
	});
	const lookup = makeConstraintsLookup(constraints);
	sets_graphs
		.map(el => solveEdgeAdjacent(el, facePairs, faces_winding))
		.forEach(el => Object.assign(orders, el));
	return {
		constraints,
		lookup,
		facePairs,
		faces_winding,
		orders,
	};
};const setup3d$1=/*#__PURE__*/Object.freeze({__proto__:null,setup});const emptyLayerSolution = () => ({ root: {}, branches: [], faces_winding: [] });
const layer3d = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment,
	edges_foldAngle, faces_vertices, faces_edges, faces_faces,
}, epsilon) => {
	if (!vertices_coords || !edges_vertices || !faces_vertices) {
		return Object.assign(Object.create(LayerPrototype), emptyLayerSolution());
	}
	if (epsilon === undefined) {
		epsilon = makeEpsilon({ vertices_coords, edges_vertices });
	}
	const {
		constraints, lookup, facePairs, faces_winding, orders,
	} = setup({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_assignment,
		edges_foldAngle,
		faces_vertices,
		faces_edges,
		faces_faces,
	}, epsilon);
	const { root, branches } = solver2d({ constraints, lookup, facePairs, orders });
	return Object.assign(Object.create(LayerPrototype), {
		root,
		branches,
		faces_winding,
	});
};const makeFoldedStripTacos = (folded_faces, is_circular, epsilon) => {
	const faces_center = folded_faces
		.map((ends) => (ends ? (ends[0] + ends[1]) / 2 : undefined));
	const locations = [];
	folded_faces.forEach((ends, i) => {
		if (!ends) { return; }
		if (!is_circular && i === folded_faces.length - 1) { return; }
		const fold_end = ends[1];
		const min = fold_end - (epsilon * 2);
		const max = fold_end + (epsilon * 2);
		const faces = [i, (i + 1) % folded_faces.length];
		const sides = faces
			.map(f => faces_center[f])
			.map(center => center > fold_end);
		const taco_type = (!sides[0] && !sides[1]) * 1 + (sides[0] && sides[1]) * 2;
		const match = locations
			.filter(el => el.min < fold_end && el.max > fold_end)
			.shift();
		const entry = { faces, taco_type };
		if (match) {
			match.pairs.push(entry);
		} else {
			locations.push({ min, max, pairs: [entry] });
		}
	});
	return locations
		.map(el => el.pairs)
		.filter(pairs => pairs.length > 1)
		.map(pairs => ({
			both: pairs.filter(el => el.taco_type === 0).map(el => el.faces),
			left: pairs.filter(el => el.taco_type === 1).map(el => el.faces),
			right: pairs.filter(el => el.taco_type === 2).map(el => el.faces),
		}));
};const between = (arr, i, j) => (i < j
	? arr.slice(i + 1, j)
	: arr.slice(j + 1, i));
const validateTacoTortillaStrip = (
	faces_folded,
	layers_face,
	is_circular = true,
	epsilon = EPSILON,
) => {
	const faces_layer = invertMap(layers_face);
	const fold_location = faces_folded
		.map(ends => (ends ? ends[1] : undefined));
	const faces_mins = faces_folded
		.map(ends => (ends ? Math.min(...ends) : undefined))
		.map(n => n + epsilon);
	const faces_maxs = faces_folded
		.map(ends => (ends ? Math.max(...ends) : undefined))
		.map(n => n - epsilon);
	const max = faces_layer.length + (is_circular ? 0 : -1);
	for (let i = 0; i < max; i += 1) {
		const j = (i + 1) % faces_layer.length;
		if (faces_layer[i] === faces_layer[j]) { continue; }
		const layers_between = between(layers_face, faces_layer[i], faces_layer[j])
			.flat();
		const all_below_min = layers_between
			.map(index => fold_location[i] < faces_mins[index])
			.reduce((a, b) => a && b, true);
		const all_above_max = layers_between
			.map(index => fold_location[i] > faces_maxs[index])
			.reduce((a, b) => a && b, true);
		if (!all_below_min && !all_above_max) { return false; }
	}
	return true;
};const validateTacoTacoFacePairs = (face_pair_stack) => {
	const pair_stack = nonUniqueElements(face_pair_stack);
	const pairs = {};
	let count = 0;
	for (let i = 0; i < pair_stack.length; i += 1) {
		if (pairs[pair_stack[i]] === undefined) {
			count += 1;
			pairs[pair_stack[i]] = count;
		} else if (pairs[pair_stack[i]] !== undefined) {
			if (pairs[pair_stack[i]] !== count) { return false; }
			count -= 1;
			pairs[pair_stack[i]] = undefined;
		}
	}
	return true;
};const build_layers = (layers_face, faces_pair) => layers_face
	.map(f => faces_pair[f])
	.filter(a => a !== undefined);
const validateLayerSolver = (
	faces_folded,
	layers_face,
	taco_face_pairs,
	circ_and_done,
	epsilon,
) => {
	const flat_layers_face = layers_face.flat();
	if (!validateTacoTortillaStrip(
		faces_folded,
		layers_face,
		circ_and_done,
		epsilon,
	)) { return false; }
	for (let i = 0; i < taco_face_pairs.length; i += 1) {
		const pair_stack = build_layers(flat_layers_face, taco_face_pairs[i]);
		if (!validateTacoTacoFacePairs(pair_stack)) { return false; }
	}
	return true;
};const change_map = {
	V: true, v: true, M: true, m: true,
};
const assignmentsToFacesFlip = (assignments) => {
	let counter = 0;
	const shifted_assignments = assignments.slice(1);
	return [false].concat(shifted_assignments
		.map(a => (change_map[a] ? ++counter : counter))
		.map(count => count % 2 === 1));
};
const up_down = {
	V: 1, v: 1, M: -1, m: -1,
};
const upOrDown = (mv, i) => (i % 2 === 0
	? (up_down[mv] || 0)
	: -(up_down[mv] || 0));
const assignmentsToFacesVertical = (assignments) => {
	let iterator = 0;
	return assignments
		.slice(1)
		.concat([assignments[0]])
		.map(a => {
			const updown = upOrDown(a, iterator);
			iterator += up_down[a] === undefined ? 0 : 1;
			return updown;
		});
};const foldStripWithAssignments = (faces, assignments) => {
	const faces_end = assignmentsToFacesFlip(assignments)
		.map((flip, i) => faces[i] * (flip ? -1 : 1));
	const cumulative = faces.map(() => undefined);
	cumulative[0] = [0, faces_end[0]];
	for (let i = 1; i < faces.length; i += 1) {
		if (assignments[i] === "B" || assignments[i] === "b") { break; }
		const prev = (i - 1 + faces.length) % faces.length;
		const prev_end = cumulative[prev][1];
		cumulative[i] = [prev_end, prev_end + faces_end[i]];
	}
	return cumulative;
};const is_boundary = { B: true, b: true };
const singleVertexSolver = (ordered_scalars, assignments, epsilon = EPSILON) => {
	const faces_folded = foldStripWithAssignments(ordered_scalars, assignments);
	const faces_updown = assignmentsToFacesVertical(assignments);
	const is_circular = assignments
		.map(a => !(is_boundary[a]))
		.reduce((a, b) => a && b, true);
	if (is_circular) {
		const start = faces_folded[0][0];
		const end = faces_folded[faces_folded.length - 1][1];
		if (Math.abs(start - end) > epsilon) { return []; }
	}
	const taco_face_pairs = makeFoldedStripTacos(faces_folded, is_circular, epsilon)
		.map(taco => [taco.left, taco.right]
			.map(invertMap)
			.filter(arr => arr.length > 1))
		.reduce((a, b) => a.concat(b), []);
	const recurse = (layers_face = [0], face = 0, layer = 0) => {
		const next_face = face + 1;
		const next_dir = faces_updown[face];
		const is_done = face >= ordered_scalars.length - 1;
		const circ_and_done = is_circular && is_done;
		if (!validateLayerSolver(
			faces_folded,
			layers_face,
			taco_face_pairs,
			circ_and_done,
			epsilon,
		)) {
			return [];
		}
		if (circ_and_done) {
			const faces_layer = invertMap(layers_face);
			const first_face_layer = faces_layer[0];
			const last_face_layer = faces_layer[face];
			if (next_dir > 0 && last_face_layer > first_face_layer) { return []; }
			if (next_dir < 0 && last_face_layer < first_face_layer) { return []; }
		}
		if (is_done) { return [layers_face]; }
		if (next_dir === 0) {
			layers_face[layer] = [next_face].concat(layers_face[layer]);
			return recurse(layers_face, next_face, layer);
		}
		const splice_layers = next_dir === 1
			? Array.from(Array(layers_face.length - layer))
				.map((_, i) => layer + i + 1)
			: Array.from(Array(layer + 1))
				.map((_, i) => i);
		const next_layers_faces = splice_layers.map(() => clone(layers_face));
		next_layers_faces
			.forEach((layers, i) => layers.splice(splice_layers[i], 0, next_face));
		return next_layers_faces
			.map((layers, i) => recurse(layers, next_face, splice_layers[i]))
			.reduce((a, b) => a.concat(b), []);
	};
	return recurse().map(invertMap);
};const assignmentSolver = (orderedScalars, assignments, epsilon) => {
	if (assignments == null) {
		assignments = orderedScalars.map(() => "U");
	}
	const all_assignments = maekawaSolver(assignments);
	const layers = all_assignments
		.map(assigns => singleVertexSolver(orderedScalars, assigns, epsilon));
	return all_assignments
		.map((_, i) => i)
		.filter(i => layers[i].length > 0)
		.map(i => ({
			assignment: all_assignments[i],
			layer: layers[i],
		}));
};Object.assign(layer, {
	table: layerTable,
	makeTacosAndTortillas,
	...transitivity,
	...general,
	...general2d,
	...setup$2,
	layer3d,
	...setup3d$1,
	...general3d,
	...copyGraph,
	singleVertexSolver,
	singleVertexAssignmentSolver: assignmentSolver,
	foldStripWithAssignments,
});Object.assign(graph, graphMethods);
const ear = {
	graph,
	cp,
	origami,
	axiom,
	convert,
	general: general$1,
	math,
	singleVertex,
	svg: SVG,
	webgl,
	layer,
};
lib.ear = ear;
Object.defineProperty(ear, "window", {
	enumerable: false,
	set: value => { SVG.window = setWindow(value); },
});return ear;}));