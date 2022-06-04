/* Rabbit Ear 0.9.xx alpha 2022-05-13 (c) Kraft, MIT License */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ear = factory());
})(this, (function () { 'use strict';

	const _undefined = "undefined";
	const _number = "number";
	const _object = "object";
	const _class = "class";
	const _index = "index";
	const _vertices = "vertices";
	const _edges = "edges";
	const _faces = "faces";
	const _boundaries = "boundaries";
	const _vertices_coords = "vertices_coords";
	const _edges_vertices = "edges_vertices";
	const _faces_vertices = "faces_vertices";
	const _faces_edges = "faces_edges";
	const _edges_assignment = "edges_assignment";
	const _edges_foldAngle = "edges_foldAngle";
	const _faces_layer = "faces_layer";
	const _boundary = "boundary";
	const _front = "front";
	const _back = "back";
	const _foldedForm = "foldedForm";
	const _black = "black";
	const _white = "white";
	const _none = "none";

	const isBrowser = typeof window !== _undefined
		&& typeof window.document !== _undefined;
	const isNode = typeof process !== _undefined
		&& process.versions != null
		&& process.versions.node != null;
	const isWebWorker = typeof self === _object
		&& self.constructor
		&& self.constructor.name === "DedicatedWorkerGlobalScope";

	var root = Object.create(null);

	const type_of = function (obj) {
	  switch (obj.constructor.name) {
	    case "vector":
	    case "matrix":
	    case "segment":
	    case "ray":
	    case "line":
	    case "circle":
	    case "ellipse":
	    case "rect":
	    case "polygon": return obj.constructor.name;
	  }
	  if (typeof obj === "object") {
	    if (obj.radius != null) { return "circle"; }
	    if (obj.width != null) { return "rect"; }
	    if (obj.x != null || typeof obj[0] === "number") { return "vector"; }
	    if (obj[0] != null && obj[0].length && (typeof obj[0].x === "number" || typeof obj[0][0] === "number")) { return "segment"; }
	    if (obj.vector != null && obj.origin != null) { return "line"; }
	  }
	  return undefined;
	};
	const resize = (d, v) => (v.length === d
	  ? v
	  : Array(d).fill(0).map((z, i) => (v[i] ? v[i] : z)));
	const resize_up = (a, b) => {
	  const size = a.length > b.length ? a.length : b.length;
	  return [a, b].map(v => resize(size, v));
	};
	const resize_down = (a, b) => {
	  const size = a.length > b.length ? b.length : a.length;
	  return [a, b].map(v => resize(size, v));
	};
	const count_places = function (num) {
	  const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
	  if (!m) { return 0; }
	  return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
	};
	const clean_number = function (num, places = 15) {
	  if (typeof num !== "number") { return num; }
	  const crop = parseFloat(num.toFixed(places));
	  if (count_places(crop) === Math.min(places, count_places(num))) {
	    return num;
	  }
	  return crop;
	};
	const is_iterable = obj => obj != null
	  && typeof obj[Symbol.iterator] === "function";
	const semi_flatten_arrays = function () {
	  switch (arguments.length) {
	    case undefined:
	    case 0: return Array.from(arguments);
	    case 1: return is_iterable(arguments[0]) && typeof arguments[0] !== "string"
	      ? semi_flatten_arrays(...arguments[0])
	      : [arguments[0]];
	    default:
	      return Array.from(arguments).map(a => (is_iterable(a)
	        ? [...semi_flatten_arrays(a)]
	        : a));
	  }
	};
	const flatten_arrays = function () {
	  switch (arguments.length) {
	    case undefined:
	    case 0: return Array.from(arguments);
	    case 1: return is_iterable(arguments[0]) && typeof arguments[0] !== "string"
	      ? flatten_arrays(...arguments[0])
	      : [arguments[0]];
	    default:
	      return Array.from(arguments).map(a => (is_iterable(a)
	        ? [...flatten_arrays(a)]
	        : a)).reduce((a, b) => a.concat(b), []);
	  }
	};
	var resizers = Object.freeze({
	  __proto__: null,
	  resize: resize,
	  resize_up: resize_up,
	  resize_down: resize_down,
	  clean_number: clean_number,
	  semi_flatten_arrays: semi_flatten_arrays,
	  flatten_arrays: flatten_arrays
	});
	const EPSILON = 1e-6;
	const R2D = 180 / Math.PI;
	const D2R = Math.PI / 180;
	const TWO_PI = Math.PI * 2;
	var constants = Object.freeze({
	  __proto__: null,
	  EPSILON: EPSILON,
	  R2D: R2D,
	  D2R: D2R,
	  TWO_PI: TWO_PI
	});
	const fn_true = () => true;
	const fn_square = n => n * n;
	const fn_add = (a, b) => a + (b || 0);
	const fn_not_undefined = a => a !== undefined;
	const fn_and = (a, b) => a && b;
	const fn_cat = (a, b) => a.concat(b);
	const fn_vec2_angle = v => Math.atan2(v[1], v[0]);
	const fn_to_vec2 = a => [Math.cos(a), Math.sin(a)];
	const fn_equal = (a, b) => a === b;
	const fn_epsilon_equal = (a, b) => Math.abs(a - b) < EPSILON;
	const include = (n, epsilon = EPSILON) => n > -epsilon;
	const exclude = (n, epsilon = EPSILON) => n > epsilon;
	const include_l = fn_true;
	const exclude_l = fn_true;
	const include_r = include;
	const exclude_r = exclude;
	const include_s = (t, e = EPSILON) => t > -e && t < 1 + e;
	const exclude_s = (t, e = EPSILON) => t > e && t < 1 - e;
	const line_limiter = dist => dist;
	const ray_limiter = dist => (dist < -EPSILON ? 0 : dist);
	const segment_limiter = (dist) => {
	  if (dist < -EPSILON) { return 0; }
	  if (dist > 1 + EPSILON) { return 1; }
	  return dist;
	};
	var functions = Object.freeze({
	  __proto__: null,
	  fn_true: fn_true,
	  fn_square: fn_square,
	  fn_add: fn_add,
	  fn_not_undefined: fn_not_undefined,
	  fn_and: fn_and,
	  fn_cat: fn_cat,
	  fn_vec2_angle: fn_vec2_angle,
	  fn_to_vec2: fn_to_vec2,
	  fn_equal: fn_equal,
	  fn_epsilon_equal: fn_epsilon_equal,
	  include: include,
	  exclude: exclude,
	  include_l: include_l,
	  exclude_l: exclude_l,
	  include_r: include_r,
	  exclude_r: exclude_r,
	  include_s: include_s,
	  exclude_s: exclude_s,
	  line_limiter: line_limiter,
	  ray_limiter: ray_limiter,
	  segment_limiter: segment_limiter
	});
	var Constructors = Object.create(null);
	const identity2x2 = [1, 0, 0, 1];
	const identity2x3 = identity2x2.concat(0, 0);
	const multiply_matrix2_vector2 = (matrix, vector) => [
	  matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4],
	  matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]
	];
	const multiply_matrix2_line2 = (matrix, vector, origin) => ({
	  vector: [
	    matrix[0] * vector[0] + matrix[2] * vector[1],
	    matrix[1] * vector[0] + matrix[3] * vector[1]
	  ],
	  origin: [
	    matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4],
	    matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]
	  ],
	});
	const multiply_matrices2 = (m1, m2) => [
	  m1[0] * m2[0] + m1[2] * m2[1],
	  m1[1] * m2[0] + m1[3] * m2[1],
	  m1[0] * m2[2] + m1[2] * m2[3],
	  m1[1] * m2[2] + m1[3] * m2[3],
	  m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
	  m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
	];
	const determinant2 = m => m[0] * m[3] - m[1] * m[2];
	const invert_matrix2 = (m) => {
	  const det = determinant2(m);
	  if (Math.abs(det) < 1e-6 || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
	    return undefined;
	  }
	  return [
	    m[3] / det,
	    -m[1] / det,
	    -m[2] / det,
	    m[0] / det,
	    (m[2] * m[5] - m[3] * m[4]) / det,
	    (m[1] * m[4] - m[0] * m[5]) / det
	  ];
	};
	const make_matrix2_translate = (x = 0, y = 0) => identity2x2.concat(x, y);
	const make_matrix2_scale = (x, y, origin = [0, 0]) => [
	  x,
	  0,
	  0,
	  y,
	  x * -origin[0] + origin[0],
	  y * -origin[1] + origin[1]
	];
	const make_matrix2_rotate = (angle, origin = [0, 0]) => {
	  const cos = Math.cos(angle);
	  const sin = Math.sin(angle);
	  return [
	    cos,
	    sin,
	    -sin,
	    cos,
	    origin[0],
	    origin[1]
	  ];
	};
	const make_matrix2_reflect = (vector, origin = [0, 0]) => {
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
	var matrix2 = Object.freeze({
	  __proto__: null,
	  identity2x2: identity2x2,
	  identity2x3: identity2x3,
	  multiply_matrix2_vector2: multiply_matrix2_vector2,
	  multiply_matrix2_line2: multiply_matrix2_line2,
	  multiply_matrices2: multiply_matrices2,
	  determinant2: determinant2,
	  invert_matrix2: invert_matrix2,
	  make_matrix2_translate: make_matrix2_translate,
	  make_matrix2_scale: make_matrix2_scale,
	  make_matrix2_rotate: make_matrix2_rotate,
	  make_matrix2_reflect: make_matrix2_reflect
	});
	const magnitude = v => Math.sqrt(v
	  .map(fn_square)
	  .reduce(fn_add, 0));
	const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
	const mag_squared = v => v
	  .map(fn_square)
	  .reduce(fn_add, 0);
	const normalize = (v) => {
	  const m = magnitude(v);
	  return m === 0 ? v : v.map(c => c / m);
	};
	const normalize2 = (v) => {
	  const m = magnitude2(v);
	  return m === 0 ? v : [v[0] / m, v[1] / m];
	};
	const scale = (v, s) => v.map(n => n * s);
	const scale2 = (v, s) => [v[0] * s, v[1] * s];
	const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
	const add2 = (v, u) => [v[0] + u[0], v[1] + u[1]];
	const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
	const subtract2 = (v, u) => [v[0] - u[0], v[1] - u[1]];
	const dot = (v, u) => v
	  .map((_, i) => v[i] * u[i])
	  .reduce(fn_add, 0);
	const dot2 = (v, u) => v[0] * u[0] + v[1] * u[1];
	const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
	const midpoint2 = (v, u) => scale2(add2(v, u), 0.5);
	const average = function () {
	  if (arguments.length === 0) { return []; }
	  const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
	  const sum = Array(dimension).fill(0);
	  Array.from(arguments)
	    .forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
	  return sum.map(n => n / arguments.length);
	};
	const lerp = (v, u, t) => {
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
	  .reduce(fn_add, 0));
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
	  .reduce(fn_add, 0) < epsilon;
	const parallel = (v, u, epsilon = EPSILON) => 1 - Math
	  .abs(dot(normalize(v), normalize(u))) < epsilon;
	const parallel2 = (v, u, epsilon = EPSILON) => Math
	  .abs(cross2(v, u)) < epsilon;
	var algebra = Object.freeze({
	  __proto__: null,
	  magnitude: magnitude,
	  magnitude2: magnitude2,
	  mag_squared: mag_squared,
	  normalize: normalize,
	  normalize2: normalize2,
	  scale: scale,
	  scale2: scale2,
	  add: add,
	  add2: add2,
	  subtract: subtract,
	  subtract2: subtract2,
	  dot: dot,
	  dot2: dot2,
	  midpoint: midpoint,
	  midpoint2: midpoint2,
	  average: average,
	  lerp: lerp,
	  cross2: cross2,
	  cross3: cross3,
	  distance: distance,
	  distance2: distance2,
	  distance3: distance3,
	  flip: flip,
	  rotate90: rotate90,
	  rotate270: rotate270,
	  degenerate: degenerate,
	  parallel: parallel,
	  parallel2: parallel2
	});
	const identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
	const identity3x4 = Object.freeze(identity3x3.concat(0, 0, 0));
	const is_identity3x4 = m => identity3x4
	  .map((n, i) => Math.abs(n - m[i]) < EPSILON)
	  .reduce((a, b) => a && b, true);
	const multiply_matrix3_vector3 = (m, vector) => [
	  m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9],
	  m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10],
	  m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]
	];
	const multiply_matrix3_line3 = (m, vector, origin) => ({
	  vector: [
	    m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2],
	    m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2],
	    m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2]
	  ],
	  origin: [
	    m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9],
	    m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10],
	    m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11]
	  ],
	});
	const multiply_matrices3 = (m1, m2) => [
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
	  m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11]
	];
	const determinant3 = m => (
	    m[0] * m[4] * m[8]
	  - m[0] * m[7] * m[5]
	  - m[3] * m[1] * m[8]
	  + m[3] * m[7] * m[2]
	  + m[6] * m[1] * m[5]
	  - m[6] * m[4] * m[2]
	);
	const invert_matrix3 = (m) => {
	  const det = determinant3(m);
	  if (Math.abs(det) < 1e-6 || isNaN(det)
	    || !isFinite(m[9]) || !isFinite(m[10]) || !isFinite(m[11])) {
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
	      - m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4]
	  ];
	  const invDet = 1.0 / det;
	  return inv.map(n => n * invDet);
	};
	const make_matrix3_translate = (x = 0, y = 0, z = 0) => identity3x3.concat(x, y, z);
	const single_axis_rotate = (angle, origin, i0, i1, sgn) => {
	  const mat = identity3x3.concat([0, 1, 2].map(i => origin[i] || 0));
	  const cos = Math.cos(angle);
	  const sin = Math.sin(angle);
	  mat[i0*3 + i0] = cos;
	  mat[i0*3 + i1] = (sgn ? +1 : -1) * sin;
	  mat[i1*3 + i0] = (sgn ? -1 : +1) * sin;
	  mat[i1*3 + i1] = cos;
	  return mat;
	};
	const make_matrix3_rotateX = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 1, 2, true);
	const make_matrix3_rotateY = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 0, 2, false);
	const make_matrix3_rotateZ = (angle, origin = [0, 0, 0]) => single_axis_rotate(angle, origin, 0, 1, true);
	const make_matrix3_rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
	  const pos = [0, 1, 2].map(i => origin[i] || 0);
	  const [x, y, z] = resize(3, normalize(vector));
	  const c = Math.cos(angle);
	  const s = Math.sin(angle);
	  const t = 1 - c;
	  const trans     = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
	  const trans_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
	  return multiply_matrices3(trans_inv, multiply_matrices3([
	    t * x * x + c,     t * y * x + z * s, t * z * x - y * s,
	    t * x * y - z * s, t * y * y + c,     t * z * y + x * s,
	    t * x * z + y * s, t * y * z - x * s, t * z * z + c,
	    0, 0, 0], trans));
	};
	const make_matrix3_scale = (scale, origin = [0, 0, 0]) => [
	  scale,
	  0,
	  0,
	  0,
	  scale,
	  0,
	  0,
	  0,
	  scale,
	  scale * -origin[0] + origin[0],
	  scale * -origin[1] + origin[1],
	  scale * -origin[2] + origin[2]
	];
	const make_matrix3_reflectZ = (vector, origin = [0, 0]) => {
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
	  return [a, b, 0, c, d, 0, 0, 0, 1, tx, ty, 0];
	};
	var matrix3 = Object.freeze({
	  __proto__: null,
	  identity3x3: identity3x3,
	  identity3x4: identity3x4,
	  is_identity3x4: is_identity3x4,
	  multiply_matrix3_vector3: multiply_matrix3_vector3,
	  multiply_matrix3_line3: multiply_matrix3_line3,
	  multiply_matrices3: multiply_matrices3,
	  determinant3: determinant3,
	  invert_matrix3: invert_matrix3,
	  make_matrix3_translate: make_matrix3_translate,
	  make_matrix3_rotateX: make_matrix3_rotateX,
	  make_matrix3_rotateY: make_matrix3_rotateY,
	  make_matrix3_rotateZ: make_matrix3_rotateZ,
	  make_matrix3_rotate: make_matrix3_rotate,
	  make_matrix3_scale: make_matrix3_scale,
	  make_matrix3_reflectZ: make_matrix3_reflectZ
	});
	const vector_origin_form = (vector, origin) => ({
	  vector: vector || [],
	  origin: origin || []
	});
	const get_vector = function () {
	  if (arguments[0] instanceof Constructors.vector) { return arguments[0]; }
	  let list = flatten_arrays(arguments);
	  if (list.length > 0
	    && typeof list[0] === "object"
	    && list[0] !== null
	    && !isNaN(list[0].x)) {
	    list = ["x", "y", "z"]
	      .map(c => list[0][c])
	      .filter(fn_not_undefined);
	  }
	  return list.filter(n => typeof n === "number");
	};
	const get_vector_of_vectors = function () {
	  return semi_flatten_arrays(arguments)
	    .map(el => get_vector(el));
	};
	const get_segment = function () {
	  if (arguments[0] instanceof Constructors.segment) {
	    return arguments[0];
	  }
	  const args = semi_flatten_arrays(arguments);
	  if (args.length === 4) {
	    return [
	      [args[0], args[1]],
	      [args[2], args[3]]
	    ];
	  }
	  return args.map(el => get_vector(el));
	};
	const get_line = function () {
	  const args = semi_flatten_arrays(arguments);
	  if (args.length === 0) { return vector_origin_form([], []); }
	  if (args[0] instanceof Constructors.line
	    || args[0] instanceof Constructors.ray
	    || args[0] instanceof Constructors.segment) { return args[0]; }
	  if (args[0].constructor === Object && args[0].vector !== undefined) {
	    return vector_origin_form(args[0].vector || [], args[0].origin || []);
	  }
	  return typeof args[0] === "number"
	    ? vector_origin_form(get_vector(args))
	    : vector_origin_form(...args.map(a => get_vector(a)));
	};
	const get_ray = get_line;
	const get_rect_params = (x = 0, y = 0, width = 0, height = 0) => ({
	  x, y, width, height
	});
	const get_rect = function () {
	  if (arguments[0] instanceof Constructors.rect) { return arguments[0]; }
	  const list = flatten_arrays(arguments);
	  if (list.length > 0
	    && typeof list[0] === "object"
	    && list[0] !== null
	    && !isNaN(list[0].width)) {
	    return get_rect_params(...["x", "y", "width", "height"]
	      .map(c => list[0][c])
	      .filter(fn_not_undefined));
	  }
	  const numbers = list.filter(n => typeof n === "number");
	  const rect_params = numbers.length < 4
	    ? [, , ...numbers]
	    : numbers;
	  return get_rect_params(...rect_params);
	};
	const get_circle_params = (radius = 1, ...args) => ({
		radius,
		origin: [...args],
	});
	const get_circle = function () {
		if (arguments[0] instanceof Constructors.circle) { return arguments[0]; }
	  const vectors = get_vector_of_vectors(arguments);
	  const numbers = flatten_arrays(arguments).filter(a => typeof a === "number");
	  if (arguments.length === 2) {
	    if (vectors[1].length === 1) {
				return get_circle_params(vectors[1][0], ...vectors[0]);
	    } else if (vectors[0].length === 1) {
				return get_circle_params(vectors[0][0], ...vectors[1]);
	    } else if (vectors[0].length > 1 && vectors[1].length > 1) {
				return get_circle_params(distance2(...vectors), ...vectors[0]);
	    }
	  }
	  else {
	    switch (numbers.length) {
	      case 0: return get_circle_params(1, 0, 0, 0);
	      case 1: return get_circle_params(numbers[0], 0, 0, 0);
	      default: return get_circle_params(numbers.pop(), ...numbers);
	    }
	  }
		return get_circle_params(1, 0, 0, 0);
	};
	const maps_3x4 = [
	  [0, 1, 3, 4, 9, 10],
	  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
	  [0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11]
	];
	[11, 7, 3].forEach(i => delete maps_3x4[2][i]);
	const matrix_map_3x4 = len => {
	  let i;
	  if (len < 8) i = 0;
	  else if (len < 13) i = 1;
	  else i = 2;
	  return maps_3x4[i];
	};
	const get_matrix_3x4 = function () {
	  const mat = flatten_arrays(arguments);
	  const matrix = [...identity3x4];
	  matrix_map_3x4(mat.length)
	    .forEach((n, i) => { if (mat[i] != null) { matrix[n] = mat[i]; } });
	  return matrix;
	};
	var getters = Object.freeze({
	  __proto__: null,
	  get_vector: get_vector,
	  get_vector_of_vectors: get_vector_of_vectors,
	  get_segment: get_segment,
	  get_line: get_line,
	  get_ray: get_ray,
	  get_rect_params: get_rect_params,
	  get_rect: get_rect,
	  get_circle: get_circle,
	  get_matrix_3x4: get_matrix_3x4
	});
	const array_similarity_test = (list, compFunc) => Array
	  .from(Array(list.length - 1))
	  .map((_, i) => compFunc(list[0], list[i + 1]))
	  .reduce(fn_and, true);
	const equivalent_vector2 = (a, b) => [0, 1]
	  .map(i => fn_epsilon_equal(a[i], b[i]))
	  .reduce(fn_and, true);
	const equivalent_numbers = function () {
	  if (arguments.length === 0) { return false; }
	  if (arguments.length === 1 && arguments[0] !== undefined) {
	    return equivalent_numbers(...arguments[0]);
	  }
	  return array_similarity_test(arguments, fn_epsilon_equal);
	};
	const equivalent_vectors = function () {
	  const args = Array.from(arguments);
	  const length = args.map(a => a.length).reduce((a, b) => a > b ? a : b);
	  const vecs = args.map(a => resize(length, a));
	  return Array.from(Array(arguments.length - 1))
	    .map((_, i) => vecs[0]
	      .map((_, n) => Math.abs(vecs[0][n] - vecs[i + 1][n]) < EPSILON)
	      .reduce(fn_and, true))
	    .reduce(fn_and, true);
	};
	const equivalent = function () {
	  const list = semi_flatten_arrays(...arguments);
	  if (list.length < 1) { return false; }
	  const typeofList = typeof list[0];
	  if (typeofList === "undefined") { return false; }
	  switch (typeofList) {
	    case "number":
	      return array_similarity_test(list, fn_epsilon_equal);
	    case "boolean":
	    case "string":
	      return array_similarity_test(list, fn_equal);
	    case "object":
	      if (list[0].constructor === Array) { return equivalent_vectors(...list); }
	      return array_similarity_test(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
	    default: return undefined;
	  }
	};
	var equal = Object.freeze({
	  __proto__: null,
	  equivalent_vector2: equivalent_vector2,
	  equivalent_numbers: equivalent_numbers,
	  equivalent_vectors: equivalent_vectors,
	  equivalent: equivalent
	});
	const sort_points_along_vector2 = (points, vector) => points
	  .map(point => ({ point, d: point[0] * vector[0] + point[1] * vector[1] }))
	  .sort((a, b) => a.d - b.d)
	  .map(a => a.point);
	var sort$1 = Object.freeze({
	  __proto__: null,
	  sort_points_along_vector2: sort_points_along_vector2
	});
	const smallest_comparison_search = (obj, array, compare_func) => {
	  const objs = array.map((o, i) => ({ o, i, d: compare_func(obj, o) }));
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
	const nearest_point2 = (point, array_of_points) => {
	  const index = smallest_comparison_search(point, array_of_points, distance2);
	  return index === undefined ? undefined : array_of_points[index];
	};
	const nearest_point = (point, array_of_points) => {
	  const index = smallest_comparison_search(point, array_of_points, distance);
	  return index === undefined ? undefined : array_of_points[index];
	};
	const nearest_point_on_line = (vector, origin, point, limiterFunc, epsilon = EPSILON) => {
	  origin = resize(vector.length, origin);
	  point = resize(vector.length, point);
	  const magSquared = mag_squared(vector);
	  const vectorToPoint = subtract(point, origin);
	  const dotProd = dot(vector, vectorToPoint);
	  const dist = dotProd / magSquared;
	  const d = limiterFunc(dist, epsilon);
	  return add(origin, scale(vector, d))
	};
	const nearest_point_on_polygon = (polygon, point) => {
	  const v = polygon
	    .map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
	  return polygon
	    .map((p, i) => nearest_point_on_line(v[i], p, point, segment_limiter))
	    .map((p, i) => ({ point: p, i, distance: distance(p, point) }))
	    .sort((a, b) => a.distance - b.distance)
	    .shift();
	};
	const nearest_point_on_circle = (radius, origin, point) => add(
	  origin, scale(normalize(subtract(point, origin)), radius)
	);
	const nearest_point_on_ellipse = () => false;
	var nearest$1 = Object.freeze({
	  __proto__: null,
	  smallest_comparison_search: smallest_comparison_search,
	  nearest_point2: nearest_point2,
	  nearest_point: nearest_point,
	  nearest_point_on_line: nearest_point_on_line,
	  nearest_point_on_polygon: nearest_point_on_polygon,
	  nearest_point_on_circle: nearest_point_on_circle,
	  nearest_point_on_ellipse: nearest_point_on_ellipse
	});
	const is_counter_clockwise_between = (angle, angleA, angleB) => {
	  while (angleB < angleA) { angleB += TWO_PI; }
	  while (angle > angleA) { angle -= TWO_PI; }
	  while (angle < angleA) { angle += TWO_PI; }
	  return angle < angleB;
	};
	const clockwise_angle_radians = (a, b) => {
	  while (a < 0) { a += TWO_PI; }
	  while (b < 0) { b += TWO_PI; }
	  while (a > TWO_PI) { a -= TWO_PI; }
	  while (b > TWO_PI) { b -= TWO_PI; }
	  const a_b = a - b;
	  return (a_b >= 0)
	    ? a_b
	    : TWO_PI - (b - a);
	};
	const counter_clockwise_angle_radians = (a, b) => {
	  while (a < 0) { a += TWO_PI; }
	  while (b < 0) { b += TWO_PI; }
	  while (a > TWO_PI) { a -= TWO_PI; }
	  while (b > TWO_PI) { b -= TWO_PI; }
	  const b_a = b - a;
	  return (b_a >= 0)
	    ? b_a
	    : TWO_PI - (a - b);
	};
	const clockwise_angle2 = (a, b) => {
	  const dotProduct = b[0] * a[0] + b[1] * a[1];
	  const determinant = b[0] * a[1] - b[1] * a[0];
	  let angle = Math.atan2(determinant, dotProduct);
	  if (angle < 0) { angle += TWO_PI; }
	  return angle;
	};
	const counter_clockwise_angle2 = (a, b) => {
	  const dotProduct = a[0] * b[0] + a[1] * b[1];
	  const determinant = a[0] * b[1] - a[1] * b[0];
	  let angle = Math.atan2(determinant, dotProduct);
	  if (angle < 0) { angle += TWO_PI; }
	  return angle;
	};
	const clockwise_bisect2 = (a, b) => fn_to_vec2(
	  fn_vec2_angle(a) - clockwise_angle2(a, b) / 2
	);
	const counter_clockwise_bisect2 = (a, b) => fn_to_vec2(
	  fn_vec2_angle(a) + counter_clockwise_angle2(a, b) / 2
	);
	const clockwise_subsect_radians = (divisions, angleA, angleB) => {
	  const angle = clockwise_angle_radians(angleA, angleB) / divisions;
	  return Array.from(Array(divisions - 1))
	    .map((_, i) => angleA + angle * (i + 1));
	};
	const counter_clockwise_subsect_radians = (divisions, angleA, angleB) => {
	  const angle = counter_clockwise_angle_radians(angleA, angleB) / divisions;
	  return Array.from(Array(divisions - 1))
	    .map((_, i) => angleA + angle * (i + 1));
	};
	const clockwise_subsect2 = (divisions, vectorA, vectorB) => {
	  const angleA = Math.atan2(vectorA[1], vectorA[0]);
	  const angleB = Math.atan2(vectorB[1], vectorB[0]);
	  return clockwise_subsect_radians(divisions, angleA, angleB)
	    .map(fn_to_vec2);
	};
	const counter_clockwise_subsect2 = (divisions, vectorA, vectorB) => {
	  const angleA = Math.atan2(vectorA[1], vectorA[0]);
	  const angleB = Math.atan2(vectorB[1], vectorB[0]);
	  return counter_clockwise_subsect_radians(divisions, angleA, angleB)
	    .map(fn_to_vec2);
	};
	const bisect_lines2 = (vectorA, originA, vectorB, originB, epsilon = EPSILON) => {
	  const determinant = cross2(vectorA, vectorB);
	  const dotProd = dot(vectorA, vectorB);
	  const bisects = determinant > -epsilon
	    ? [counter_clockwise_bisect2(vectorA, vectorB)]
	    : [clockwise_bisect2(vectorA, vectorB)];
	  bisects[1] = determinant > -epsilon
	    ? rotate90(bisects[0])
	    : rotate270(bisects[0]);
	  const numerator = (originB[0] - originA[0]) * vectorB[1] - vectorB[0] * (originB[1] - originA[1]);
	  const t = numerator / determinant;
	  const normalized = [vectorA, vectorB].map(vec => normalize(vec));
	  const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	  const origin = isParallel
	    ? midpoint(originA, originB)
	    : [originA[0] + vectorA[0] * t, originA[1] + vectorA[1] * t];
	  const solution = bisects.map(vector => ({ vector, origin }));
	  if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
	  return solution;
	};
	const counter_clockwise_order_radians = function () {
	  const radians = flatten_arrays(arguments);
	  const counter_clockwise = radians
	    .map((_, i) => i)
	    .sort((a, b) => radians[a] - radians[b]);
	  return counter_clockwise
	    .slice(counter_clockwise.indexOf(0), counter_clockwise.length)
	    .concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
	};
	const counter_clockwise_order2 = function () {
	  return counter_clockwise_order_radians(
	    semi_flatten_arrays(arguments).map(fn_vec2_angle)
	  );
	};
	const counter_clockwise_sectors_radians = function () {
	  const radians = flatten_arrays(arguments);
	  const ordered = counter_clockwise_order_radians(radians)
	    .map(i => radians[i]);
	  return ordered.map((rad, i, arr) => [rad, arr[(i + 1) % arr.length]])
	    .map(pair => counter_clockwise_angle_radians(pair[0], pair[1]));
	};
	const counter_clockwise_sectors2 = function () {
	  return counter_clockwise_sectors_radians(
	    get_vector_of_vectors(arguments).map(fn_vec2_angle)
	  );
	};
	var radial = Object.freeze({
	  __proto__: null,
	  is_counter_clockwise_between: is_counter_clockwise_between,
	  clockwise_angle_radians: clockwise_angle_radians,
	  counter_clockwise_angle_radians: counter_clockwise_angle_radians,
	  clockwise_angle2: clockwise_angle2,
	  counter_clockwise_angle2: counter_clockwise_angle2,
	  clockwise_bisect2: clockwise_bisect2,
	  counter_clockwise_bisect2: counter_clockwise_bisect2,
	  clockwise_subsect_radians: clockwise_subsect_radians,
	  counter_clockwise_subsect_radians: counter_clockwise_subsect_radians,
	  clockwise_subsect2: clockwise_subsect2,
	  counter_clockwise_subsect2: counter_clockwise_subsect2,
	  bisect_lines2: bisect_lines2,
	  counter_clockwise_order_radians: counter_clockwise_order_radians,
	  counter_clockwise_order2: counter_clockwise_order2,
	  counter_clockwise_sectors_radians: counter_clockwise_sectors_radians,
	  counter_clockwise_sectors2: counter_clockwise_sectors2
	});
	const overlap_line_point = (vector, origin, point, func = exclude_l, epsilon = EPSILON) => {
	  const p2p = subtract(point, origin);
	  const lineMagSq = mag_squared(vector);
	  const lineMag = Math.sqrt(lineMagSq);
	  if (lineMag < epsilon) { return false; }
	  const cross = cross2(p2p, vector.map(n => n / lineMag));
	  const proj = dot(p2p, vector) / lineMagSq;
	  return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
	};
	const intersect_line_line = (
	  aVector, aOrigin,
	  bVector, bOrigin,
	  aFunction = include_l,
	  bFunction = include_l,
	  epsilon = EPSILON
	) => {
	  const det_norm = cross2(normalize(aVector), normalize(bVector));
	  if (Math.abs(det_norm) < epsilon) { return undefined; }
	  const determinant0 = cross2(aVector, bVector);
	  const determinant1 = -determinant0;
	  const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
	  const b2a = [-a2b[0], -a2b[1]];
	  const t0 = cross2(a2b, bVector) / determinant0;
	  const t1 = cross2(b2a, aVector) / determinant1;
	  if (aFunction(t0, epsilon / magnitude(aVector))
	    && bFunction(t1, epsilon / magnitude(bVector))) {
	    return add(aOrigin, scale(aVector, t0));
	  }
	  return undefined;
	};
	const circumcircle = function (a, b, c) {
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
	};
	const signed_area = points => 0.5 * points
	  .map((el, i, arr) => {
	    const next = arr[(i + 1) % arr.length];
	    return el[0] * next[1] - next[0] * el[1];
	  }).reduce(fn_add, 0);
	const centroid = (points) => {
	  const sixthArea = 1 / (6 * signed_area(points));
	  return points.map((el, i, arr) => {
	    const next = arr[(i + 1) % arr.length];
	    const mag = el[0] * next[1] - next[0] * el[1];
	    return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
	  }).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
	    .map(c => c * sixthArea);
	};
	const bounding_box = (points, epsilon = 0) => {
	  const min = Array(points[0].length).fill(Infinity);
	  const max = Array(points[0].length).fill(-Infinity);
	  points.forEach(point => point
	    .forEach((c, i) => {
	      if (c < min[i]) { min[i] = c - epsilon; }
	      if (c > max[i]) { max[i] = c + epsilon; }
	    }));
	  const span = max.map((max, i) => max - min[i]);
	  return { min, max, span };
	};
	const angle_array = count => Array
	  .from(Array(Math.floor(count)))
	  .map((_, i) => TWO_PI * (i / count));
	const angles_to_vecs = (angles, radius) => angles
	  .map(a => [radius * Math.cos(a), radius * Math.sin(a)])
	  .map(pt => pt.map(n => clean_number(n, 14)));
	const make_regular_polygon = (sides = 3, radius = 1) =>
	  angles_to_vecs(angle_array(sides), radius);
	const make_regular_polygon_side_aligned = (sides = 3, radius = 1) => {
	  const halfwedge = Math.PI / sides;
	  const angles = angle_array(sides).map(a => a + halfwedge);
	  return angles_to_vecs(angles, radius);
	};
	const make_regular_polygon_inradius = (sides = 3, radius = 1) =>
	  make_regular_polygon(sides, radius / Math.cos(Math.PI / sides));
	const make_regular_polygon_inradius_side_aligned = (sides = 3, radius = 1) =>
	  make_regular_polygon_side_aligned(sides, radius / Math.cos(Math.PI / sides));
	const make_regular_polygon_side_length = (sides = 3, length = 1) =>
	  make_regular_polygon(sides, (length / 2) / Math.sin(Math.PI / sides));
	const make_regular_polygon_side_length_side_aligned = (sides = 3, length = 1) =>
	  make_regular_polygon_side_aligned(sides, (length / 2) / Math.sin(Math.PI / sides));
	const make_polygon_non_collinear = (polygon, epsilon = EPSILON) => {
	  const edges_vector = polygon
	    .map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
	    .map(pair => subtract(pair[1], pair[0]));
	  const vertex_collinear = edges_vector
	    .map((vector, i, arr) => [vector, arr[(i + arr.length - 1) % arr.length]])
	    .map(pair => !parallel(pair[1], pair[0], epsilon));
	  return polygon
	    .filter((vertex, v) => vertex_collinear[v]);
	};
	const pleat_parallel = (count, a, b) => {
	  const origins = Array.from(Array(count - 1))
	    .map((_, i) => (i + 1) / count)
	    .map(t => lerp(a.origin, b.origin, t));
	  const vector = [...a.vector];
	  return origins.map(origin => ({ origin, vector }));
	};
	const pleat_angle = (count, a, b) => {
	  const origin = intersect_line_line(
	    a.vector, a.origin,
	    b.vector, b.origin);
	  const vectors = clockwise_angle2(a.vector, b.vector) < counter_clockwise_angle2(a.vector, b.vector)
	    ? clockwise_subsect2(count, a.vector, b.vector)
	    : counter_clockwise_subsect2(count, a.vector, b.vector);
	  return vectors.map(vector => ({ origin, vector }));
	};
	const pleat = (count, a, b) => {
	  const lineA = get_line(a);
	  const lineB = get_line(b);
	  return parallel(lineA.vector, lineB.vector)
	    ? pleat_parallel(count, lineA, lineB)
	    : pleat_angle(count, lineA, lineB);
	};
	const split_convex_polygon = (poly, lineVector, linePoint) => {
	  let vertices_intersections = poly.map((v, i) => {
	    let intersection = overlap_line_point(lineVector, linePoint, v, include_l);
	    return { point: intersection ? v : null, at_index: i };
	  }).filter(el => el.point != null);
	  let edges_intersections = poly.map((v, i, arr) => ({
	      point: intersect_line_line(
	        lineVector,
	        linePoint,
	        subtract(v, arr[(i + 1) % arr.length]),
	        arr[(i + 1) % arr.length],
	        exclude_l,
	        exclude_s),
	      at_index: i }))
	    .filter(el => el.point != null);
	  if (edges_intersections.length == 2) {
	    let sorted_edges = edges_intersections.slice()
	      .sort((a,b) => a.at_index - b.at_index);
	    let face_a = poly
	      .slice(sorted_edges[1].at_index+1)
	      .concat(poly.slice(0, sorted_edges[0].at_index+1));
	    face_a.push(sorted_edges[0].point);
	    face_a.push(sorted_edges[1].point);
	    let face_b = poly
	      .slice(sorted_edges[0].at_index+1, sorted_edges[1].at_index+1);
	    face_b.push(sorted_edges[1].point);
	    face_b.push(sorted_edges[0].point);
	    return [face_a, face_b];
	  } else if (edges_intersections.length == 1 && vertices_intersections.length == 1) {
	    vertices_intersections[0]["type"] = "v";
	    edges_intersections[0]["type"] = "e";
	    let sorted_geom = vertices_intersections.concat(edges_intersections)
	      .sort((a,b) => a.at_index - b.at_index);
	    let face_a = poly.slice(sorted_geom[1].at_index+1)
	      .concat(poly.slice(0, sorted_geom[0].at_index+1));
	    if (sorted_geom[0].type === "e") { face_a.push(sorted_geom[0].point); }
	    face_a.push(sorted_geom[1].point);
	    let face_b = poly
	      .slice(sorted_geom[0].at_index+1, sorted_geom[1].at_index+1);
	    if (sorted_geom[1].type === "e") { face_b.push(sorted_geom[1].point); }
	    face_b.push(sorted_geom[0].point);
	    return [face_a, face_b];
	  } else if (vertices_intersections.length == 2) {
	    let sorted_vertices = vertices_intersections.slice()
	      .sort((a,b) => a.at_index - b.at_index);
	    let face_a = poly
	      .slice(sorted_vertices[1].at_index)
	      .concat(poly.slice(0, sorted_vertices[0].at_index+1));
	    let face_b = poly
	      .slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index+1);
	    return [face_a, face_b];
	  }
	  return [poly.slice()];
	};
	const convex_hull = (points, include_collinear = false, epsilon = EPSILON) => {
	  let INFINITE_LOOP = 10000;
	  let sorted = points.slice().sort((a, b) =>
	    (Math.abs(a[1] - b[1]) < epsilon
	      ? a[0] - b[0]
	      : a[1] - b[1]));
	  let hull = [];
	  hull.push(sorted[0]);
	  let ang = 0;
	  let infiniteLoop = 0;
	  do {
	    infiniteLoop += 1;
	    let h = hull.length - 1;
	    let angles = sorted
	      .filter(el => !(Math.abs(el[0] - hull[h][0]) < epsilon
	        && Math.abs(el[1] - hull[h][1]) < epsilon))
	      .map((el) => {
	        let angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);
	        while (angle < ang) { angle += Math.PI * 2; }
	        return { node: el, angle, distance: undefined };
	      })
	      .sort((a, b) => ((a.angle < b.angle) ? -1 : (a.angle > b.angle) ? 1 : 0));
	    if (angles.length === 0) { return undefined; }
	    let rightTurn = angles[0];
	    angles = angles.filter(el => Math.abs(rightTurn.angle - el.angle) < epsilon)
	      .map((el) => {
	        let distance = Math.sqrt(((hull[h][0] - el.node[0]) ** 2) + ((hull[h][1] - el.node[1]) ** 2));
	        el.distance = distance;
	        return el;
	      })
	      .sort((a, b) => ((a.distance < b.distance) ? 1 : (a.distance > b.distance) ? -1 : 0));
	    if (hull.filter(el => el === angles[0].node).length > 0) {
	      return hull;
	    }
	    hull.push(angles[0].node);
	    ang = Math.atan2(hull[h][1] - angles[0].node[1], hull[h][0] - angles[0].node[0]);
	  } while (infiniteLoop < INFINITE_LOOP);
	};
	const recurse_skeleton = (points, lines, bisectors) => {
	  const intersects = points
	    .map((origin, i) => ({ vector: bisectors[i], origin }))
	    .map((ray, i, arr) => intersect_line_line(
	      ray.vector,
	      ray.origin,
	      arr[(i + 1) % arr.length].vector,
	      arr[(i + 1) % arr.length].origin,
	      exclude_r,
	      exclude_r));
	  const projections = lines.map((line, i) => nearest_point_on_line(
	    line.vector, line.origin, intersects[i], a => a));
	  if (points.length === 3) {
	    return points.map(p => ({ type:"skeleton", points: [p, intersects[0]] }))
	      .concat([{ type:"perpendicular", points: [projections[0], intersects[0]] }]);
	  }
	  const projectionLengths = intersects
	    .map((intersect, i) => distance(intersect, projections[i]));
	  let shortest = 0;
	  projectionLengths.forEach((len, i) => {
	    if (len < projectionLengths[shortest]) { shortest = i; }
	  });
	  const solutions = [
	    { type:"skeleton",
	      points: [points[shortest], intersects[shortest]] },
	    { type:"skeleton",
	      points: [points[(shortest + 1) % points.length], intersects[shortest]] },
	    { type:"perpendicular", points: [projections[shortest], intersects[shortest]] }
	  ];
	  const newVector = clockwise_bisect2(
	    flip(lines[(shortest + lines.length - 1) % lines.length].vector),
	    lines[(shortest + 1) % lines.length].vector
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
	  return solutions.concat(recurse_skeleton(points, lines, bisectors));
	};
	const straight_skeleton = (points) => {
	  const lines = points
	    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	    .map(side => ({ vector: subtract(side[1], side[0]), origin: side[0] }));
	  const bisectors = points
	    .map((_, i, ar) => [(i - 1 + ar.length) % ar.length, i, (i + 1) % ar.length]
	      .map(i => ar[i]))
	    .map(p => [subtract(p[0], p[1]), subtract(p[2], p[1])])
	    .map(v => clockwise_bisect2(...v));
	  return recurse_skeleton([...points], lines, bisectors);
	};
	var geometry = Object.freeze({
	  __proto__: null,
	  circumcircle: circumcircle,
	  signed_area: signed_area,
	  centroid: centroid,
	  bounding_box: bounding_box,
	  make_regular_polygon: make_regular_polygon,
	  make_regular_polygon_side_aligned: make_regular_polygon_side_aligned,
	  make_regular_polygon_inradius: make_regular_polygon_inradius,
	  make_regular_polygon_inradius_side_aligned: make_regular_polygon_inradius_side_aligned,
	  make_regular_polygon_side_length: make_regular_polygon_side_length,
	  make_regular_polygon_side_length_side_aligned: make_regular_polygon_side_length_side_aligned,
	  make_polygon_non_collinear: make_polygon_non_collinear,
	  pleat: pleat,
	  split_convex_polygon: split_convex_polygon,
	  convex_hull: convex_hull,
	  straight_skeleton: straight_skeleton
	});
	const vector_origin_to_ud = ({ vector, origin }) => {
	  const mag = magnitude(vector);
	  const u = rotate90(vector);
	  const d = dot(origin, u) / mag;
	  return { u: scale(u, 1 / mag), d };
	};
	const ud_to_vector_origin = ({ u, d }) => ({
	  vector: rotate270(u),
	  origin: scale(u, d),
	});
	var parameterize = Object.freeze({
	  __proto__: null,
	  vector_origin_to_ud: vector_origin_to_ud,
	  ud_to_vector_origin: ud_to_vector_origin
	});
	const acos_safe = (x) => {
	  if (x >= 1.0) return 0;
	  if (x <= -1.0) return Math.PI;
	  return Math.acos(x);
	};
	const rotate_vector2 = (center, pt, a) => {
	  const x = pt[0] - center[0];
	  const y = pt[1] - center[1];
	  const xRot = x * Math.cos(a) + y * Math.sin(a);
	  const yRot = y * Math.cos(a) - x * Math.sin(a);
	  return [center[0] + xRot, center[1] + yRot];
	};
	const intersect_circle_circle = (c1_radius, c1_origin, c2_radius, c2_origin, epsilon = EPSILON) => {
	  const r = (c1_radius < c2_radius) ? c1_radius : c2_radius;
	  const R = (c1_radius < c2_radius) ? c2_radius : c1_radius;
	  const smCenter = (c1_radius < c2_radius) ? c1_origin : c2_origin;
	  const bgCenter = (c1_radius < c2_radius) ? c2_origin : c1_origin;
	  const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
	  const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
	  if (d < epsilon) { return undefined; }
	  const point = vec.map((v, i) => v / d * R + bgCenter[i]);
	  if (Math.abs((R + r) - d) < epsilon
	    || Math.abs(R - (r + d)) < epsilon) { return [point]; }
	  if ((d + r) < R || (R + r < d)) { return undefined; }
	  const angle = acos_safe((r * r - d * d - R * R) / (-2.0 * d * R));
	  const pt1 = rotate_vector2(bgCenter, point, +angle);
	  const pt2 = rotate_vector2(bgCenter, point, -angle);
	  return [pt1, pt2];
	};
	const intersect_circle_line = (
	  circle_radius, circle_origin,
	  line_vector, line_origin,
	  line_func = include_l,
	  epsilon = EPSILON
	) => {
	  const magSq = line_vector[0] ** 2 + line_vector[1] ** 2;
	  const mag = Math.sqrt(magSq);
	  const norm = mag === 0 ? line_vector : line_vector.map(c => c / mag);
	  const rot90 = rotate90(norm);
	  const bvec = subtract(line_origin, circle_origin);
	  const det = cross2(bvec, norm);
	  if (Math.abs(det) > circle_radius + epsilon) { return undefined; }
	  const side = Math.sqrt((circle_radius ** 2) - (det ** 2));
	  const f = (s, i) => circle_origin[i] - rot90[i] * det + norm[i] * s;
	  const results = Math.abs(circle_radius - Math.abs(det)) < epsilon
	    ? [side].map((s) => [s, s].map(f))
	    : [-side, side].map((s) => [s, s].map(f));
	  const ts = results.map(res => res.map((n, i) => n - line_origin[i]))
	    .map(v => v[0] * line_vector[0] + line_vector[1] * v[1])
	    .map(d => d / magSq);
	  return results.filter((_, i) => line_func(ts[i], epsilon));
	};
	const overlap_convex_polygon_point = (poly, point, func = exclude, epsilon = EPSILON) => poly
	  .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	  .map(s => cross2(normalize(subtract(s[1], s[0])), subtract(point, s[0])))
	  .map(side => func(side, epsilon))
	  .map((s, _, arr) => s === arr[0])
	  .reduce((prev, curr) => prev && curr, true);
	const get_unique_pair = (intersections) => {
	  for (let i = 1; i < intersections.length; i += 1) {
	    if (!equivalent_vector2(intersections[0], intersections[i])) {
	      return [intersections[0], intersections[i]];
	    }
	  }
	};
	const intersect_convex_polygon_line_inclusive = (
	  poly,
	  vector, origin,
	  fn_poly = include_s,
	  fn_line = include_l,
	  epsilon = EPSILON
	) => {
	  const intersections = poly
	    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	    .map(side => intersect_line_line(
	      subtract(side[1], side[0]), side[0],
	      vector, origin,
	      fn_poly, fn_line,
	      epsilon))
	    .filter(a => a !== undefined);
	  switch (intersections.length) {
	    case 0: return undefined;
	    case 1: return [intersections];
	    default:
	      return get_unique_pair(intersections) || [intersections[0]];
	  }
	};
	const intersect_convex_polygon_line = (
	  poly,
	  vector, origin,
	  fn_poly = include_s,
	  fn_line = exclude_l,
	  epsilon = EPSILON
	) => {
	  const sects = intersect_convex_polygon_line_inclusive(poly, vector, origin, fn_poly, fn_line, epsilon);
	  let altFunc;
	  switch (fn_line) {
	    case exclude_r: altFunc = include_r; break;
	    case exclude_s: altFunc = include_s; break;
	    default: return sects;
	  }
	  const includes = intersect_convex_polygon_line_inclusive(poly, vector, origin, include_s, altFunc, epsilon);
	  if (includes === undefined) { return undefined; }
	  const uniqueIncludes = get_unique_pair(includes);
	  if (uniqueIncludes === undefined) {
	    switch (fn_line) {
	      case exclude_l: return undefined;
	      case exclude_r:
	        return overlap_convex_polygon_point(poly, origin, exclude, epsilon)
	          ? includes
	          : undefined;
	      case exclude_s:
	        return overlap_convex_polygon_point(poly, add(origin, vector), exclude, epsilon)
	          || overlap_convex_polygon_point(poly, origin, exclude, epsilon)
	          ? includes
	          : undefined;
	    }
	  }
	  return overlap_convex_polygon_point(poly, midpoint(...uniqueIncludes), exclude, epsilon)
	    ? uniqueIncludes
	    : sects;
	};
	const intersect_polygon_polygon = (polygon1, polygon2, epsilon = EPSILON) => {
		var cp1, cp2, s, e;
		const inside = (p) => {
			return ((cp2[0] - cp1[0]) * (p[1] - cp1[1]))
				> ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon);
		};
		const intersection = () => {
			var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
				dp = [ s[0] - e[0], s[1] - e[1] ],
				n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
				n2 = s[0] * e[1] - s[1] * e[0],
				n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
			return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
		};
		var outputList = polygon1;
		cp1 = polygon2[polygon2.length-1];
		for (var j in polygon2) {
			cp2 = polygon2[j];
			var inputList = outputList;
			outputList = [];
			s = inputList[inputList.length - 1];
			for (var i in inputList) {
				e = inputList[i];
				if (inside(e)) {
					if (!inside(s)) {
						outputList.push(intersection());
					}
					outputList.push(e);
				}
				else if (inside(s)) {
					outputList.push(intersection());
				}
				s = e;
			}
			cp1 = cp2;
		}
		return outputList.length === 0 ? undefined : outputList;
	};
	const intersect_param_form = {
	  polygon: a => [a],
	  rect: a => [a],
	  circle: a => [a.radius, a.origin],
	  line: a => [a.vector, a.origin],
	  ray: a => [a.vector, a.origin],
	  segment: a => [a.vector, a.origin],
	};
	const intersect_func = {
	  polygon: {
	    polygon: intersect_polygon_polygon,
	    line: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
	    ray: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
	    segment: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...a, ...b, include_s, fnB, ep),
	  },
	  circle: {
	    circle: (a, b, fnA, fnB, ep) => intersect_circle_circle(...a, ...b, ep),
	    line: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
	    ray: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
	    segment: (a, b, fnA, fnB, ep) => intersect_circle_line(...a, ...b, fnB, ep),
	  },
	  line: {
	    polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
	    circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
	    line: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
	    ray: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
	    segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
	  },
	  ray: {
	    polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
	    circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
	    line: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
	    ray: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
	    segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
	  },
	  segment: {
	    polygon: (a, b, fnA, fnB, ep) => intersect_convex_polygon_line(...b, ...a, include_s, fnA, ep),
	    circle: (a, b, fnA, fnB, ep) => intersect_circle_line(...b, ...a, fnA, ep),
	    line: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
	    ray: (a, b, fnA, fnB, ep) => intersect_line_line(...b, ...a, fnB, fnA, ep),
	    segment: (a, b, fnA, fnB, ep) => intersect_line_line(...a, ...b, fnA, fnB, ep),
	  },
	};
	const similar_intersect_types = {
	  polygon: "polygon",
	  rect: "polygon",
	  circle: "circle",
	  line: "line",
	  ray: "ray",
	  segment: "segment",
	};
	const default_intersect_domain_function = {
	  polygon: exclude,
	  rect: exclude,
	  circle: exclude,
	  line: exclude_l,
	  ray: exclude_r,
	  segment: exclude_s,
	};
	const intersect$1 = function (a, b, epsilon) {
	  const type_a = type_of(a);
	  const type_b = type_of(b);
	  const aT = similar_intersect_types[type_a];
	  const bT = similar_intersect_types[type_b];
	  const params_a = intersect_param_form[type_a](a);
	  const params_b = intersect_param_form[type_b](b);
	  const domain_a = a.domain_function || default_intersect_domain_function[type_a];
	  const domain_b = b.domain_function || default_intersect_domain_function[type_b];
	  return intersect_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
	};
	const overlap_convex_polygons = (poly1, poly2, epsilon = EPSILON) => {
	  for (let p = 0; p < 2; p++) {
	    const polyA = p === 0 ? poly1 : poly2;
	    const polyB = p === 0 ? poly2 : poly1;
	    for (let i = 0; i < polyA.length; i++) {
	      const origin = polyA[i];
	      const vector = rotate90(subtract(polyA[(i + 1) % polyA.length], polyA[i]));
	      const projected = polyB
	        .map(p => subtract(p, origin))
	        .map(v => dot(vector, v));
	      const other_test_point = polyA[(i + 2) % polyA.length];
	      const side_a = dot(vector, subtract(other_test_point, origin));
	      const side = side_a > 0;
	      const one_sided = projected
	        .map(dotProd => side ? dotProd < epsilon : dotProd > -epsilon)
	        .reduce((a, b) => a && b, true);
	      if (one_sided) { return false; }
	    }
	  }
	  return true;
	};
	const overlap_circle_point = (radius, origin, point, func = exclude, epsilon = EPSILON) =>
	  func(radius - distance2(origin, point), epsilon);
	const overlap_line_line = (
	  aVector, aOrigin,
	  bVector, bOrigin,
	  aFunction = exclude_l,
	  bFunction = exclude_l,
	  epsilon = EPSILON
	) => {
	  const denominator0 = cross2(aVector, bVector);
	  const denominator1 = -denominator0;
	  const a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
	  if (Math.abs(denominator0) < epsilon) {
	    if (Math.abs(cross2(a2b, aVector)) > epsilon) { return false; }
	    const bPt1 = a2b;
	    const bPt2 = add(bPt1, bVector);
	    const aProjLen = dot(aVector, aVector);
	    const bProj1 = dot(bPt1, aVector) / aProjLen;
	    const bProj2 = dot(bPt2, aVector) / aProjLen;
	    const bProjSm = bProj1 < bProj2 ? bProj1 : bProj2;
	    const bProjLg = bProj1 < bProj2 ? bProj2 : bProj1;
	    const bOutside1 = bProjSm > 1 - epsilon;
	    const bOutside2 = bProjLg < epsilon;
	    if (bOutside1 || bOutside2) { return false; }
	    return true;
	  }
	  const b2a = [-a2b[0], -a2b[1]];
	  const t0 = cross2(a2b, bVector) / denominator0;
	  const t1 = cross2(b2a, aVector) / denominator1;
	  return aFunction(t0, epsilon / magnitude(aVector))
	    && bFunction(t1, epsilon / magnitude(bVector));
	};
	const overlap_param_form = {
	  polygon: a => [a],
	  rect: a => [a],
	  circle: a => [a.radius, a.origin],
	  line: a => [a.vector, a.origin],
	  ray: a => [a.vector, a.origin],
	  segment: a => [a.vector, a.origin],
	  vector: a => [a],
	};
	const overlap_func = {
	  polygon: {
	    polygon: (a, b, fnA, fnB, ep) => overlap_convex_polygons(...a, ...b, ep),
	    vector: (a, b, fnA, fnB, ep) => overlap_convex_polygon_point(...a, ...b, fnA, ep),
	  },
	  circle: {
	    vector: (a, b, fnA, fnB, ep) => overlap_circle_point(...a, ...b, exclude, ep),
	  },
	  line: {
	    line: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
	    ray: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
	    segment: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
	    vector: (a, b, fnA, fnB, ep) => overlap_line_point(...a, ...b, fnA, ep),
	  },
	  ray: {
	    line: (a, b, fnA, fnB, ep) => overlap_line_line(...b, ...a, fnB, fnA, ep),
	    ray: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
	    segment: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
	    vector: (a, b, fnA, fnB, ep) => overlap_line_point(...a, ...b, fnA, ep),
	  },
	  segment: {
	    line: (a, b, fnA, fnB, ep) => overlap_line_line(...b, ...a, fnB, fnA, ep),
	    ray: (a, b, fnA, fnB, ep) => overlap_line_line(...b, ...a, fnB, fnA, ep),
	    segment: (a, b, fnA, fnB, ep) => overlap_line_line(...a, ...b, fnA, fnB, ep),
	    vector: (a, b, fnA, fnB, ep) => overlap_line_point(...a, ...b, fnA, ep),
	  },
	  vector: {
	    polygon: (a, b, fnA, fnB, ep) => overlap_convex_polygon_point(...b, ...a, fnB, ep),
	    circle: (a, b, fnA, fnB, ep) => overlap_circle_point(...b, ...a, exclude, ep),
	    line: (a, b, fnA, fnB, ep) => overlap_line_point(...b, ...a, fnB, ep),
	    ray: (a, b, fnA, fnB, ep) => overlap_line_point(...b, ...a, fnB, ep),
	    segment: (a, b, fnA, fnB, ep) => overlap_line_point(...b, ...a, fnB, ep),
	    vector: (a, b, fnA, fnB, ep) => equivalent_vector2(...a, ...b, ep),
	  },
	};
	const similar_overlap_types = {
	  polygon: "polygon",
	  rect: "polygon",
	  circle: "circle",
	  line: "line",
	  ray: "ray",
	  segment: "segment",
	  vector: "vector",
	};
	const default_overlap_domain_function = {
	  polygon: exclude,
	  rect: exclude,
	  circle: exclude,
	  line: exclude_l,
	  ray: exclude_r,
	  segment: exclude_s,
	  vector: exclude_l,
	};
	const overlap$1 = function (a, b, epsilon) {
	  const type_a = type_of(a);
	  const type_b = type_of(b);
	  const aT = similar_overlap_types[type_a];
	  const bT = similar_overlap_types[type_b];
	  const params_a = overlap_param_form[type_a](a);
	  const params_b = overlap_param_form[type_b](b);
	  const domain_a = a.domain_function || default_overlap_domain_function[type_a];
	  const domain_b = b.domain_function || default_overlap_domain_function[type_b];
	  return overlap_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
	};
	const enclose_convex_polygons_inclusive = (outer, inner) => {
	  const outerGoesInside = outer
	    .map(p => overlap_convex_polygon_point(inner, p, include))
	    .reduce((a, b) => a || b, false);
	  const innerGoesOutside = inner
	    .map(p => overlap_convex_polygon_point(inner, p, include))
	    .reduce((a, b) => a && b, true);
	  return (!outerGoesInside && innerGoesOutside);
	};
	const overlap_bounding_boxes = (box1, box2) => {
	  const dimensions = box1.min.length > box2.min.length
	    ? box2.min.length
	    : box1.min.length;
	  for (let d = 0; d < dimensions; d++) {
	    if (box1.min[d] > box2.max[d] || box1.max[d] < box2.min[d]) {
	      return false;
	    }
	  }
	  return true;
	};
	const line_line_parameter = (
	  line_vector, line_origin,
	  poly_vector, poly_origin,
	  poly_line_func = include_s,
	  epsilon = EPSILON
	) => {
	  const det_norm = cross2(normalize(line_vector), normalize(poly_vector));
	  if (Math.abs(det_norm) < epsilon) { return undefined; }
	  const determinant0 = cross2(line_vector, poly_vector);
	  const determinant1 = -determinant0;
	  const a2b = subtract(poly_origin, line_origin);
	  const b2a = flip(a2b);
	  const t0 = cross2(a2b, poly_vector) / determinant0;
	  const t1 = cross2(b2a, line_vector) / determinant1;
	  if (poly_line_func(t1, epsilon / magnitude(poly_vector))) {
	    return t0;
	  }
	  return undefined;
	};
	const line_point_from_parameter = (vector, origin, t) => add(origin, scale(vector, t));
	const get_intersect_parameters = (poly, vector, origin, poly_line_func, epsilon) => poly
	  .map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p])
	  .map(side => line_line_parameter(
	    vector, origin,
	    side[0], side[1],
	    poly_line_func,
	    epsilon))
	  .filter(fn_not_undefined)
	  .sort((a, b) => a - b);
	const get_min_max = (numbers, func, scaled_epsilon) => {
	  let a = 0;
	  let b = numbers.length - 1;
	  while (a < b) {
	    if (func(numbers[a+1] - numbers[a], scaled_epsilon)) { break; }
	    a++;
	  }
	  while (b > a) {
	    if (func(numbers[b] - numbers[b-1], scaled_epsilon)) { break; }
	    b--;
	  }
	  if (a >= b) { return undefined; }
	  return [numbers[a], numbers[b]];
	};
	const clip_line_in_convex_polygon = (
	  poly,
	  vector,
	  origin,
	  fn_poly = include,
	  fn_line = include_l,
	  epsilon = EPSILON
	) => {
	  const numbers = get_intersect_parameters(poly, vector, origin, include_s, epsilon);
	  if (numbers.length < 2) { return undefined; }
	  const scaled_epsilon = (epsilon * 2) / magnitude(vector);
	  const ends = get_min_max(numbers, fn_poly, scaled_epsilon);
	  if (ends === undefined) { return undefined; }
	  const ends_clip = ends.map((t, i) => fn_line(t) ? t : (t < 0.5 ? 0 : 1));
	  if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude(vector)) {
	    return undefined;
	  }
	  const mid = line_point_from_parameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
	  return overlap_convex_polygon_point(poly, mid, fn_poly, epsilon)
	    ? ends_clip.map(t => line_point_from_parameter(vector, origin, t))
	    : undefined;
	};
	const VectorArgs = function () {
	  this.push(...get_vector(arguments));
	};
	const VectorGetters = {
	  x: function () { return this[0]; },
	  y: function () { return this[1]; },
	  z: function () { return this[2]; },
	};
	const table = {
	  preserve: {
	    magnitude: function () { return magnitude(this); },
	    isEquivalent: function () {
	      return equivalent_vectors(this, get_vector(arguments));
	    },
	    isParallel: function () {
	      return parallel(...resize_up(this, get_vector(arguments)));
	    },
	    isCollinear: function (line) {
	      return overlap$1(this, line);
	    },
	    dot: function () {
	      return dot(...resize_up(this, get_vector(arguments)));
	    },
	    distanceTo: function () {
	      return distance(...resize_up(this, get_vector(arguments)));
	    },
	    overlap: function (other) {
	      return overlap$1(this, other);
	    },
	  },
	  vector: {
	    copy: function () { return [...this]; },
	    normalize: function () { return normalize(this); },
	    scale: function () { return scale(this, arguments[0]); },
	    flip: function () { return flip(this); },
	    rotate90: function () { return rotate90(this); },
	    rotate270: function () { return rotate270(this); },
	    cross: function () {
	      return cross3(
	        resize(3, this),
	        resize(3, get_vector(arguments))
	      );
	    },
	    transform: function () {
	      return multiply_matrix3_vector3(
	        get_matrix_3x4(arguments),
	        resize(3, this)
	      );
	    },
	    add: function () {
	      return add(this, resize(this.length, get_vector(arguments)));
	    },
	    subtract: function () {
	      return subtract(this, resize(this.length, get_vector(arguments)));
	    },
	    rotateZ: function (angle, origin) {
	      return multiply_matrix3_vector3(
	        get_matrix_3x4(make_matrix2_rotate(angle, origin)),
	        resize(3, this)
	      );
	    },
	    lerp: function (vector, pct) {
	      return lerp(this, resize(this.length, get_vector(vector)), pct);
	    },
	    midpoint: function () {
	      return midpoint(...resize_up(this, get_vector(arguments)));
	    },
	    bisect: function () {
	      return counter_clockwise_bisect2(this, get_vector(arguments));
	    },
	  }
	};
	const VectorMethods = {};
	Object.keys(table.preserve).forEach(key => {
	  VectorMethods[key] = table.preserve[key];
	});
	Object.keys(table.vector).forEach(key => {
	  VectorMethods[key] = function () {
	    return Constructors.vector(...table.vector[key].apply(this, arguments));
	  };
	});
	const VectorStatic = {
	  fromAngle: function (angle) {
	    return Constructors.vector(Math.cos(angle), Math.sin(angle));
	  },
	  fromAngleDegrees: function (angle) {
	    return Constructors.vector.fromAngle(angle * D2R);
	  },
	};
	var Vector = {
	  vector: {
	    P: Array.prototype,
	    A: VectorArgs,
	    G: VectorGetters,
	    M: VectorMethods,
	    S: VectorStatic,
	  }
	};
	var Static = {
	  fromPoints: function () {
	    const points = get_vector_of_vectors(arguments);
	    return this.constructor({
	      vector: subtract(points[1], points[0]),
	      origin: points[0],
	    });
	  },
	  fromAngle: function() {
	    const angle = arguments[0] || 0;
	    return this.constructor({
	      vector: [Math.cos(angle), Math.sin(angle)],
	      origin: [0, 0],
	    });
	  },
	  perpendicularBisector: function () {
	    const points = get_vector_of_vectors(arguments);
	    return this.constructor({
	      vector: rotate90(subtract(points[1], points[0])),
	      origin: average(points[0], points[1]),
	    });
	  },
	};
	const LinesMethods = {
	  isParallel: function () {
	    const arr = resize_up(this.vector, get_line(arguments).vector);
	    return parallel(...arr);
	  },
	  isCollinear: function () {
	    const line = get_line(arguments);
	    return overlap_line_point(this.vector, this.origin, line.origin)
	      && parallel(...resize_up(this.vector, line.vector));
	  },
	  isDegenerate: function (epsilon = EPSILON) {
	    return degenerate(this.vector, epsilon);
	  },
	  reflectionMatrix: function () {
	    return Constructors.matrix(make_matrix3_reflectZ(this.vector, this.origin));
	  },
	  nearestPoint: function () {
	    const point = get_vector(arguments);
	    return Constructors.vector(
	      nearest_point_on_line(this.vector, this.origin, point, this.clip_function)
	    );
	  },
	  transform: function () {
	    const dim = this.dimension;
	    const r = multiply_matrix3_line3(
	      get_matrix_3x4(arguments),
	      resize(3, this.vector),
	      resize(3, this.origin)
	    );
	    return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
	  },
	  translate: function () {
	    const origin = add(...resize_up(this.origin, get_vector(arguments)));
	    return this.constructor(this.vector, origin);
	  },
	  intersect: function () {
	    return intersect$1(this, ...arguments);
	  },
	  overlap: function () {
	    return overlap$1(this, ...arguments);
	  },
	  bisect: function (lineType, epsilon) {
	    const line = get_line(lineType);
	    return bisect_lines2(this.vector, this.origin, line.vector, line.origin, epsilon)
	      .map(line => this.constructor(line));
	  },
	};
	var Line = {
	  line: {
	    P: Object.prototype,
	    A: function () {
	      const l = get_line(...arguments);
	      this.vector = Constructors.vector(l.vector);
	      this.origin = Constructors.vector(resize(this.vector.length, l.origin));
	      const ud = vector_origin_to_ud({ vector: this.vector, origin: this.origin });
	      this.u = ud.u;
	      this.d = ud.d;
	      Object.defineProperty(this, "domain_function", { writable: true, value: include_l });
	    },
	    G: {
	      dimension: function () {
	        return [this.vector, this.origin]
	          .map(p => p.length)
	          .reduce((a, b) => Math.max(a, b), 0);
	      },
	    },
	    M: Object.assign({}, LinesMethods, {
	      inclusive: function () { this.domain_function = include_l; return this; },
	      exclusive: function () { this.domain_function = exclude_l; return this; },
	      clip_function: dist => dist,
	      svgPath: function (length = 20000) {
	        const start = add(this.origin, scale(this.vector, -length / 2));
	        const end = scale(this.vector, length);
	        return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
	      },
	    }),
	    S: Object.assign({
	      ud: function() {
	        return this.constructor(ud_to_vector_origin(arguments[0]));
	      },
	    }, Static)
	  }
	};
	var Ray = {
	  ray: {
	    P: Object.prototype,
	    A: function () {
	      const ray = get_line(...arguments);
	      this.vector = Constructors.vector(ray.vector);
	      this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
	      Object.defineProperty(this, "domain_function", { writable: true, value: include_r });
	    },
	    G: {
	      dimension: function () {
	        return [this.vector, this.origin]
	          .map(p => p.length)
	          .reduce((a, b) => Math.max(a, b), 0);
	      },
	    },
	    M: Object.assign({}, LinesMethods, {
	      inclusive: function () { this.domain_function = include_r; return this; },
	      exclusive: function () { this.domain_function = exclude_r; return this; },
	      flip: function () {
	        return Constructors.ray(flip(this.vector), this.origin);
	      },
	      scale: function (scale) {
	        return Constructors.ray(this.vector.scale(scale), this.origin);
	      },
	      normalize: function () {
	        return Constructors.ray(this.vector.normalize(), this.origin);
	      },
	      clip_function: ray_limiter,
	      svgPath: function (length = 10000) {
	        const end = this.vector.scale(length);
	        return `M${this.origin[0]} ${this.origin[1]}l${end[0]} ${end[1]}`;
	      },
	    }),
	    S: Static
	  }
	};
	var Segment = {
	  segment: {
	    P: Array.prototype,
	    A: function () {
	      const a = get_segment(...arguments);
	      this.push(...[a[0], a[1]].map(v => Constructors.vector(v)));
	      this.vector = Constructors.vector(subtract(this[1], this[0]));
	      this.origin = this[0];
	      Object.defineProperty(this, "domain_function", { writable: true, value: include_s });
	    },
	    G: {
	      points: function () { return this; },
	      magnitude: function () { return magnitude(this.vector); },
	      dimension: function () {
	        return [this.vector, this.origin]
	          .map(p => p.length)
	          .reduce((a, b) => Math.max(a, b), 0);
	      },
	    },
	    M: Object.assign({}, LinesMethods, {
	      inclusive: function () { this.domain_function = include_s; return this; },
	      exclusive: function () { this.domain_function = exclude_s; return this; },
	      clip_function: segment_limiter,
	      transform: function (...innerArgs) {
	        const dim = this.points[0].length;
	        const mat = get_matrix_3x4(innerArgs);
	        const transformed_points = this.points
	          .map(point => resize(3, point))
	          .map(point => multiply_matrix3_vector3(mat, point))
	          .map(point => resize(dim, point));
	        return Constructors.segment(transformed_points);
	      },
	      translate: function() {
	        const translate = get_vector(arguments);
	        const transformed_points = this.points
	          .map(point => add(...resize_up(point, translate)));
	        return Constructors.segment(transformed_points);
	      },
	      midpoint: function () {
	        return Constructors.vector(average(this.points[0], this.points[1]));
	      },
	      svgPath: function () {
	        const pointStrings = this.points.map(p => `${p[0]} ${p[1]}`);
	        return ["M", "L"].map((cmd, i) => `${cmd}${pointStrings[i]}`)
	          .join("");
	      },
	    }),
	    S: {
	      fromPoints: function () {
	        return this.constructor(...arguments);
	      }
	    }
	  }
	};
	const CircleArgs = function () {
	  const circle = get_circle(...arguments);
	  this.radius = circle.radius;
	  this.origin = Constructors.vector(...circle.origin);
	};
	const CircleGetters = {
	  x: function () { return this.origin[0]; },
	  y: function () { return this.origin[1]; },
	  z: function () { return this.origin[2]; },
	};
	const pointOnEllipse = function (cx, cy, rx, ry, zRotation, arcAngle) {
	  const cos_rotate = Math.cos(zRotation);
	  const sin_rotate = Math.sin(zRotation);
	  const cos_arc = Math.cos(arcAngle);
	  const sin_arc = Math.sin(arcAngle);
	  return [
	    cx + cos_rotate * rx * cos_arc + -sin_rotate * ry * sin_arc,
	    cy + sin_rotate * rx * cos_arc + cos_rotate * ry * sin_arc
	  ];
	};
	const pathInfo = function (cx, cy, rx, ry, zRotation, arcStart_, deltaArc_) {
	  let arcStart = arcStart_;
	  if (arcStart < 0 && !isNaN(arcStart)) {
	    while (arcStart < 0) {
	      arcStart += Math.PI * 2;
	    }
	  }
	  const deltaArc = deltaArc_ > Math.PI * 2 ? Math.PI * 2 : deltaArc_;
	  const start = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart);
	  const middle = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc / 2);
	  const end = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc);
	  const fa = ((deltaArc / 2) > Math.PI) ? 1 : 0;
	  const fs = ((deltaArc / 2) > 0) ? 1 : 0;
	  return {
	    x1: start[0],
	    y1: start[1],
	    x2: middle[0],
	    y2: middle[1],
	    x3: end[0],
	    y3: end[1],
	    fa,
	    fs
	  };
	};
	const cln = n => clean_number(n, 4);
	const ellipticalArcTo = (rx, ry, phi_degrees, fa, fs, endX, endY) =>
	  `A${cln(rx)} ${cln(ry)} ${cln(phi_degrees)} ${cln(fa)} ${cln(fs)} ${cln(endX)} ${cln(endY)}`;
	const CircleMethods = {
	  nearestPoint: function () {
	    return Constructors.vector(nearest_point_on_circle(
	      this.radius,
	      this.origin,
	      get_vector(arguments)
	    ));
	  },
	  intersect: function (object) {
	    return intersect$1(this, object);
	  },
	  overlap: function (object) {
	    return overlap$1(this, object);
	  },
	  svgPath: function (arcStart = 0, deltaArc = Math.PI * 2) {
	    const info = pathInfo(this.origin[0], this.origin[1], this.radius, this.radius, 0, arcStart, deltaArc);
	    const arc1 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x2, info.y2);
	    const arc2 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x3, info.y3);
	    return `M${info.x1} ${info.y1}${arc1}${arc2}`;
	  },
	  points: function (count = 128) {
	    return Array.from(Array(count))
	      .map((_, i) => ((2 * Math.PI) / count) * i)
	      .map(angle => [
	        this.origin[0] + this.radius * Math.cos(angle),
	        this.origin[1] + this.radius * Math.sin(angle)
	      ]);
	  },
	  polygon: function () {
	    return Constructors.polygon(this.points(arguments[0]));
	  },
	  segments: function () {
	    const points = this.points(arguments[0]);
	    return points.map((point, i) => {
	      const nextI = (i + 1) % points.length;
	      return [point, points[nextI]];
	    });
	  }
	};
	const CircleStatic = {
	  fromPoints: function () {
	    if (arguments.length === 3) {
	      const result = circumcircle(...arguments);
	      return this.constructor(result.radius, result.origin);
	    }
	    return this.constructor(...arguments);
	  },
	  fromThreePoints: function () {
	    const result = circumcircle(...arguments);
	    return this.constructor(result.radius, result.origin);
	  }
	};
	var Circle = {
	  circle: { A: CircleArgs, G: CircleGetters, M: CircleMethods, S: CircleStatic }
	};
	const getFoci = function (center, rx, ry, spin) {
	  const order = rx > ry;
	  const lsq = order ? (rx ** 2) - (ry ** 2) : (ry ** 2) - (rx ** 2);
	  const l = Math.sqrt(lsq);
	  const trigX = order ? Math.cos(spin) : Math.sin(spin);
	  const trigY = order ? Math.sin(spin) : Math.cos(spin);
	  return [
	    Constructors.vector(center[0] + l * trigX, center[1] + l * trigY),
	    Constructors.vector(center[0] - l * trigX, center[1] - l * trigY),
	  ];
	};
	var Ellipse = {
	  ellipse: {
	    A: function () {
	      const numbers = flatten_arrays(arguments).filter(a => !isNaN(a));
	      const params = resize(5, numbers);
	      this.rx = params[0];
	      this.ry = params[1];
	      this.origin = Constructors.vector(params[2], params[3]);
	      this.spin = params[4];
	      this.foci = getFoci(this.origin, this.rx, this.ry, this.spin);
	    },
	    G: {
	      x: function () { return this.origin[0]; },
	      y: function () { return this.origin[1]; },
	    },
	    M: {
	      svgPath: function (arcStart = 0, deltaArc = Math.PI * 2) {
	        const info = pathInfo(this.origin[0], this.origin[1], this.rx, this.ry, this.spin, arcStart, deltaArc);
	        const arc1 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI) * 180, info.fa, info.fs, info.x2, info.y2);
	        const arc2 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI) * 180, info.fa, info.fs, info.x3, info.y3);
	        return `M${info.x1} ${info.y1}${arc1}${arc2}`;
	      },
	      points: function (count = 128) {
	        return Array.from(Array(count))
	          .map((_, i) => ((2 * Math.PI) / count) * i)
	          .map(angle => pointOnEllipse(
	            this.origin.x, this.origin.y,
	            this.rx, this.ry,
	            this.spin, angle
	          ));
	      },
	      polygon: function () {
	        return Constructors.polygon(this.points(arguments[0]));
	      },
	      segments: function () {
	        const points = this.points(arguments[0]);
	        return points.map((point, i) => {
	          const nextI = (i + 1) % points.length;
	          return [point, points[nextI]];
	        });
	      }
	    },
	    S: {
	    }
	  }
	};
	const PolygonMethods = {
	  area: function () {
	    return signed_area(this);
	  },
	  centroid: function () {
	    return Constructors.vector(centroid(this));
	  },
	  boundingBox: function () {
	    return bounding_box(this);
	  },
	  straightSkeleton: function () {
	    return straight_skeleton(this);
	  },
	  scale: function (magnitude, center = centroid(this)) {
	    const newPoints = this
	      .map(p => [0, 1].map((_, i) => p[i] - center[i]))
	      .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
	    return this.constructor.fromPoints(newPoints);
	  },
	  rotate: function (angle, centerPoint = centroid(this)) {
	    const newPoints = this.map((p) => {
	      const vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
	      const mag = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
	      const a = Math.atan2(vec[1], vec[0]);
	      return [
	        centerPoint[0] + Math.cos(a + angle) * mag,
	        centerPoint[1] + Math.sin(a + angle) * mag,
	      ];
	    });
	    return Constructors.polygon(newPoints);
	  },
	  translate: function () {
	    const vec = get_vector(...arguments);
	    const newPoints = this.map(p => p.map((n, i) => n + vec[i]));
	    return this.constructor.fromPoints(newPoints);
	  },
	  transform: function () {
	    const m = get_matrix_3x4(...arguments);
	    const newPoints = this
	      .map(p => multiply_matrix3_vector3(m, resize(3, p)));
	    return Constructors.polygon(newPoints);
	  },
	  nearest: function () {
	    const point = get_vector(...arguments);
	    const result = nearest_point_on_polygon(this, point);
	    return result === undefined
	      ? undefined
	      : Object.assign(result, { edge: this.sides[result.i] });
	  },
	  split: function () {
	    const line = get_line(...arguments);
	    const split_func = split_convex_polygon;
	    return split_func(this, line.vector, line.origin)
	      .map(poly => Constructors.polygon(poly));
	  },
	  overlap: function () {
	    return overlap$1(this, ...arguments);
	  },
	  intersect: function () {
	    return intersect$1(this, ...arguments);
	  },
	  clip: function (line_type, epsilon) {
	    const fn_line = line_type.domain_function ? line_type.domain_function : include_l;
	    const segment = clip_line_in_convex_polygon(this,
	      line_type.vector,
	      line_type.origin,
	      this.domain_function,
	      fn_line,
	      epsilon);
	    return segment ? Constructors.segment(segment) : undefined;
	  },
	  svgPath: function () {
	    const pre = Array(this.length).fill("L");
	    pre[0] = "M";
	    return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}z`;
	  },
	};
	const rectToPoints = r => [
	  [r.x, r.y],
	  [r.x + r.width, r.y],
	  [r.x + r.width, r.y + r.height],
	  [r.x, r.y + r.height]
	];
	const rectToSides = r => [
	  [[r.x, r.y], [r.x + r.width, r.y]],
	  [[r.x + r.width, r.y], [r.x + r.width, r.y + r.height]],
	  [[r.x + r.width, r.y + r.height], [r.x, r.y + r.height]],
	  [[r.x, r.y + r.height], [r.x, r.y]],
	];
	var Rect = {
	  rect: {
	    P: Array.prototype,
	    A: function () {
	      const r = get_rect(...arguments);
	      this.width = r.width;
	      this.height = r.height;
	      this.origin = Constructors.vector(r.x, r.y);
	      this.push(...rectToPoints(this));
	      Object.defineProperty(this, "domain_function", { writable: true, value: include });
	    },
	    G: {
	      x: function () { return this.origin[0]; },
	      y: function () { return this.origin[1]; },
	      center: function () { return Constructors.vector(
	        this.origin[0] + this.width / 2,
	        this.origin[1] + this.height / 2,
	      ); },
	    },
	    M: Object.assign({}, PolygonMethods, {
	      inclusive: function () { this.domain_function = include; return this; },
	      exclusive: function () { this.domain_function = exclude; return this; },
	      area: function () { return this.width * this.height; },
	      segments: function () { return rectToSides(this); },
	      svgPath: function () {
	        return `M${this.origin.join(" ")}h${this.width}v${this.height}h${-this.width}Z`;
	      },
	    }),
	    S: {
	      fromPoints: function () {
	        const box = bounding_box(get_vector_of_vectors(arguments));
	        return Constructors.rect(box.min[0], box.min[1], box.span[0], box.span[1]);
	      }
	    }
	  }
	};
	var Polygon = {
	  polygon: {
	    P: Array.prototype,
	    A: function () {
	      this.push(...semi_flatten_arrays(arguments));
	      this.sides = this
	        .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
	      this.vectors = this.sides.map(side => subtract(side[1], side[0]));
	      Object.defineProperty(this, "domain_function", { writable: true, value: include });
	    },
	    G: {
	      isConvex: function () {
	        return true;
	      },
	      points: function () {
	        return this;
	      },
	    },
	    M: Object.assign({}, PolygonMethods, {
	      inclusive: function () { this.domain_function = include; return this; },
	      exclusive: function () { this.domain_function = exclude; return this; },
	      segments: function () {
	        return this.sides;
	      },
	    }),
	    S: {
	      fromPoints: function () {
	        return this.constructor(...arguments);
	      },
	      regularPolygon: function () {
	        return this.constructor(make_regular_polygon(...arguments));
	      },
	      convexHull: function () {
	        return this.constructor(convex_hull(...arguments));
	      },
	    }
	  }
	};
	const array_assign = (thisMat, mat) => {
	  for (let i = 0; i < 12; i += 1) {
	    thisMat[i] = mat[i];
	  }
	  return thisMat;
	};
	var Matrix = {
	  matrix: {
	    P: Array.prototype,
	    A: function () {
	      get_matrix_3x4(arguments).forEach(m => this.push(m));
	    },
	    G: {
	    },
	    M: {
	      copy: function () { return Constructors.matrix(...Array.from(this)); },
	      set: function () {
	        return array_assign(this, get_matrix_3x4(arguments));
	      },
	      isIdentity: function () { return is_identity3x4(this); },
	      multiply: function (mat) {
	        return array_assign(this, multiply_matrices3(this, mat));
	      },
	      determinant: function () {
	        return determinant3(this);
	      },
	      inverse: function () {
	        return array_assign(this, invert_matrix3(this));
	      },
	      translate: function (x, y, z) {
	        return array_assign(this,
	          multiply_matrices3(this, make_matrix3_translate(x, y, z)));
	      },
	      rotateX: function (radians) {
	        return array_assign(this,
	          multiply_matrices3(this, make_matrix3_rotateX(radians)));
	      },
	      rotateY: function (radians) {
	        return array_assign(this,
	          multiply_matrices3(this, make_matrix3_rotateY(radians)));
	      },
	      rotateZ: function (radians) {
	        return array_assign(this,
	          multiply_matrices3(this, make_matrix3_rotateZ(radians)));
	      },
	      rotate: function (radians, vector, origin) {
	        const transform = make_matrix3_rotate(radians, vector, origin);
	        return array_assign(this, multiply_matrices3(this, transform));
	      },
	      scale: function (amount) {
	        return array_assign(this,
	          multiply_matrices3(this, make_matrix3_scale(amount)));
	      },
	      reflectZ: function (vector, origin) {
	        const transform = make_matrix3_reflectZ(vector, origin);
	        return array_assign(this, multiply_matrices3(this, transform));
	      },
	      transform: function (...innerArgs) {
	        return Constructors.vector(
	          multiply_matrix3_vector3(this, resize(3, get_vector(innerArgs)))
	        );
	      },
	      transformVector: function (vector) {
	        return Constructors.vector(
	          multiply_matrix3_vector3(this, resize(3, get_vector(vector)))
	        );
	      },
	      transformLine: function (...innerArgs) {
	        const l = get_line(innerArgs);
	        return Constructors.line(multiply_matrix3_line3(this, l.vector, l.origin));
	      },
	    },
	    S: {
	    }
	  }
	};
	const Definitions = Object.assign({},
	  Vector,
	  Line,
	  Ray,
	  Segment,
	  Circle,
	  Ellipse,
	  Rect,
	  Polygon,
	  Matrix,
	);
	const create = function (primitiveName, args) {
	  const a = Object.create(Definitions[primitiveName].proto);
	  Definitions[primitiveName].A.apply(a, args);
	  return a;
	};
	const vector = function () { return create("vector", arguments); };
	const circle = function () { return create("circle", arguments); };
	const ellipse = function () { return create("ellipse", arguments); };
	const rect = function () { return create("rect", arguments); };
	const polygon = function () { return create("polygon", arguments); };
	const line = function () { return create("line", arguments); };
	const ray = function () { return create("ray", arguments); };
	const segment = function () { return create("segment", arguments); };
	const matrix = function () { return create("matrix", arguments); };
	Object.assign(Constructors, {
	  vector,
	  circle,
	  ellipse,
	  rect,
	  polygon,
	  line,
	  ray,
	  segment,
	  matrix,
	});
	Object.keys(Definitions).forEach(primitiveName => {
	  const Proto = {};
	  Proto.prototype = Definitions[primitiveName].P != null
	    ? Object.create(Definitions[primitiveName].P)
	    : Object.create(Object.prototype);
	  Proto.prototype.constructor = Proto;
	  Constructors[primitiveName].prototype = Proto.prototype;
	  Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];
	  Object.keys(Definitions[primitiveName].G)
	    .forEach(key => Object.defineProperty(Proto.prototype, key, {
	      get: Definitions[primitiveName].G[key],
	    }));
	  Object.keys(Definitions[primitiveName].M)
	    .forEach(key => Object.defineProperty(Proto.prototype, key, {
	      value: Definitions[primitiveName].M[key],
	    }));
	  Object.keys(Definitions[primitiveName].S)
	    .forEach(key => Object.defineProperty(Constructors[primitiveName], key, {
	      value: Definitions[primitiveName].S[key]
	        .bind(Constructors[primitiveName].prototype),
	    }));
	  Definitions[primitiveName].proto = Proto.prototype;
	});
	const math = Constructors;
	math.core = Object.assign(Object.create(null),
	  constants,
	  resizers,
	  getters,
	  functions,
	  algebra,
	  equal,
	  sort$1,
	  geometry,
	  radial,
	  matrix2,
	  matrix3,
	  nearest$1,
	  parameterize,
	  {
	    enclose_convex_polygons_inclusive,
	    intersect_convex_polygon_line,
	    intersect_polygon_polygon,
	    intersect_circle_circle,
	    intersect_circle_line,
	    intersect_line_line,
	    overlap_convex_polygons,
	    overlap_convex_polygon_point,
	    overlap_bounding_boxes,
	    overlap_line_line,
	    overlap_line_point,
	    clip_line_in_convex_polygon,
	  }
	);
	math.typeof = type_of;
	math.intersect = intersect$1;
	math.overlap = overlap$1;

	const vertex_degree = function (v, i) {
		const graph = this;
		Object.defineProperty(v, "degree", {
			get: () => (graph.vertices_vertices && graph.vertices_vertices[i]
				? graph.vertices_vertices[i].length
				: null)
		});
	};
	const edge_coords = function (e, i) {
		const graph = this;
		Object.defineProperty(e, "coords", {
			get: () => {
				if (!graph.edges_vertices
					|| !graph.edges_vertices[i]
					|| !graph.vertices_coords) {
					return undefined;
				}
				return graph.edges_vertices[i].map(v => graph.vertices_coords[v]);
			}
		});
	};
	const face_simple = function (f, i) {
		const graph = this;
		Object.defineProperty(f, "simple", {
			get: () => {
				if (!graph.faces_vertices || !graph.faces_vertices[i]) { return null; }
				for (let j = 0; j < f.length - 1; j += 1) {
					for (let k = j + 1; k < f.length; k += 1) {
						if (graph.faces_vertices[i][j] === graph.faces_vertices[i][k]) {
							return false;
						}
					}
				}
				return true;
			}
		});
	};
	const face_coords = function (f, i) {
		const graph = this;
		Object.defineProperty(f, "coords", {
			get: () => {
				if (!graph.faces_vertices
					|| !graph.faces_vertices[i]
					|| !graph.vertices_coords) {
					return undefined;
				}
				return graph.faces_vertices[i].map(v => graph.vertices_coords[v]);
			}
		});
	};
	const setup_vertex = function (v, i) {
		vertex_degree.call(this, v, i);
		return v;
	};
	const setup_edge = function (e, i) {
		edge_coords.call(this, e, i);
		return e;
	};
	const setup_face = function (f, i) {
		face_simple.call(this, f, i);
		face_coords.call(this, f, i);
		return f;
	};
	var setup = {
		vertices: setup_vertex,
		edges: setup_edge,
		faces: setup_face,
	};

	const file_spec = 1.1;
	const file_creator = "Rabbit Ear";
	const fold_keys = {
		file: [
			"file_spec",
			"file_creator",
			"file_author",
			"file_title",
			"file_description",
			"file_classes",
			"file_frames"
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
			"faces_faces"
		],
		orders: [
			"edgeOrders",
			"faceOrders"
		],
	};
	const keys = Object.freeze([]
		.concat(fold_keys.file)
		.concat(fold_keys.frame)
		.concat(fold_keys.graph)
		.concat(fold_keys.orders));
	const non_spec_keys = Object.freeze([
		"edges_vector",
		"vertices_sectors",
		"faces_sectors",
		"faces_matrix"
	]);
	const edges_assignment_values = Array.from("MmVvBbFfUu");

	const singularize = {
		vertices: "vertex",
		edges: "edge",
		faces: "face",
	};
	const edges_assignment_names = {
		b: "boundary",
		m: "mountain",
		v: "valley",
		f: "flat",
		u: "unassigned"
	};
	edges_assignment_values.forEach(key => {
		edges_assignment_names[key.toUpperCase()] = edges_assignment_names[key];
	});
	const edges_assignment_to_lowercase = {};
	edges_assignment_values.forEach(key => {
		edges_assignment_to_lowercase[key] = key.toLowerCase();
	});
	const edges_assignment_degrees = {
		M: -180,
		m: -180,
		V: 180,
		v: 180,
		B: 0,
		b: 0,
		F: 0,
		f: 0,
		U: 0,
		u: 0
	};
	const edge_assignment_to_foldAngle = assignment =>
		edges_assignment_degrees[assignment] || 0;
	const edge_foldAngle_to_assignment = (a) => {
		if (a > 0) { return "V"; }
		if (a < 0) { return "M"; }
		return "U";
	};
	const flat_angles = { 0: true, "-0": true, 180: true, "-180": true };
	const edge_foldAngle_is_flat = angle => flat_angles[angle] === true;
	const edges_foldAngle_all_flat = ({ edges_foldAngle }) => {
		if (!edges_foldAngle) { return true; }
		for (let i = 0; i < edges_foldAngle.length; i++) {
			if (!flat_angles[edges_foldAngle[i]]) { return false; }
		}
		return true;
	};
	const filter_keys_with_suffix = (graph, suffix) => Object
		.keys(graph)
		.map(s => (s.substring(s.length - suffix.length, s.length) === suffix
			? s : undefined))
		.filter(str => str !== undefined);
	const filter_keys_with_prefix = (graph, prefix) => Object
		.keys(graph)
		.map(str => (str.substring(0, prefix.length) === prefix
			? str : undefined))
		.filter(str => str !== undefined);
	const get_graph_keys_with_prefix = (graph, key) =>
		filter_keys_with_prefix(graph, `${key}_`);
	const get_graph_keys_with_suffix = (graph, key) =>
		filter_keys_with_suffix(graph, `_${key}`);
	const transpose_graph_arrays = (graph, geometry_key) => {
		const matching_keys = get_graph_keys_with_prefix(graph, geometry_key);
		if (matching_keys.length === 0) { return []; }
		const len = Math.max(...matching_keys.map(arr => graph[arr].length));
		const geometry = Array.from(Array(len))
			.map(() => ({}));
		matching_keys
			.forEach(key => geometry
				.forEach((o, i) => { geometry[i][key] = graph[key][i]; }));
		return geometry;
	};
	const transpose_graph_array_at_index = function (
		graph,
		geometry_key,
		index
	) {
		const matching_keys = get_graph_keys_with_prefix(graph, geometry_key);
		if (matching_keys.length === 0) { return undefined; }
		const geometry = {};
		matching_keys.forEach((key) => { geometry[key] = graph[key][index]; });
		return geometry;
	};
	const fold_object_certainty = (object = {}) => (
		Object.keys(object).length === 0
			? 0
			: [].concat(keys, non_spec_keys)
				.filter(key => object[key]).length / Object.keys(object).length);

	var fold_spec = /*#__PURE__*/Object.freeze({
		__proto__: null,
		singularize: singularize,
		edges_assignment_names: edges_assignment_names,
		edges_assignment_to_lowercase: edges_assignment_to_lowercase,
		edges_assignment_degrees: edges_assignment_degrees,
		edge_assignment_to_foldAngle: edge_assignment_to_foldAngle,
		edge_foldAngle_to_assignment: edge_foldAngle_to_assignment,
		edge_foldAngle_is_flat: edge_foldAngle_is_flat,
		edges_foldAngle_all_flat: edges_foldAngle_all_flat,
		filter_keys_with_suffix: filter_keys_with_suffix,
		filter_keys_with_prefix: filter_keys_with_prefix,
		get_graph_keys_with_prefix: get_graph_keys_with_prefix,
		get_graph_keys_with_suffix: get_graph_keys_with_suffix,
		transpose_graph_arrays: transpose_graph_arrays,
		transpose_graph_array_at_index: transpose_graph_array_at_index,
		fold_object_certainty: fold_object_certainty
	});

	const are_vertices_equivalent = (a, b, epsilon = math.core.EPSILON) => {
		const degree = a.length;
		for (let i = 0; i < degree; i += 1) {
			if (Math.abs(a[i] - b[i]) > epsilon) {
				return false;
			}
		}
		return true;
	};
	const get_vertices_clusters = ({ vertices_coords }, epsilon = math.core.EPSILON) => {
		if (!vertices_coords) { return []; }
		const equivalent_matrix = vertices_coords.map(() => []);
		for (let i = 0; i < vertices_coords.length - 1; i += 1) {
			for (let j = i + 1; j < vertices_coords.length; j += 1) {
				equivalent_matrix[i][j] = are_vertices_equivalent(
					vertices_coords[i],
					vertices_coords[j],
					epsilon
				);
			}
		}
		const vertices_equivalent = equivalent_matrix
			.map(equiv => equiv
				.map((el, j) => (el ? j : undefined))
				.filter(a => a !== undefined));
		const clusters = [];
		const visited = Array(vertices_coords.length).fill(false);
		let visitedCount = 0;
		const recurse = (cluster_index, i) => {
			if (visited[i] || visitedCount === vertices_coords.length) { return; }
			visited[i] = true;
			visitedCount += 1;
			if (!clusters[cluster_index]) { clusters[cluster_index] = []; }
			clusters[cluster_index].push(i);
			while (vertices_equivalent[i].length > 0) {
				recurse(cluster_index, vertices_equivalent[i][0]);
				vertices_equivalent[i].splice(0, 1);
			}
		};
		for (let i = 0; i < vertices_coords.length; i += 1) {
			recurse(i, i);
			if (visitedCount === vertices_coords.length) { break; }
		}
		return clusters.filter(a => a.length);
	};

	const max_arrays_length = (...arrays) => Math.max(0, ...(arrays
		.filter(el => el !== undefined)
		.map(el => el.length)));
	const count = (graph, key) => max_arrays_length(...get_graph_keys_with_prefix(graph, key).map(key => graph[key]));
	count.vertices = ({ vertices_coords, vertices_faces, vertices_vertices }) =>
		max_arrays_length(vertices_coords, vertices_faces, vertices_vertices);
	count.edges = ({ edges_vertices, edges_edges, edges_faces }) =>
		max_arrays_length(edges_vertices, edges_edges, edges_faces);
	count.faces = ({ faces_vertices, faces_edges, faces_faces }) =>
		max_arrays_length(faces_vertices, faces_edges, faces_faces);

	const unique_sorted_integers = (array) => {
		const keys = {};
		array.forEach((int) => { keys[int] = true; });
		return Object.keys(keys).map(n => parseInt(n)).sort((a, b) => a - b);
	};
	const split_circular_array = (array, indices) => {
		indices.sort((a, b) => a - b);
		return [
			array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
			array.slice(indices[0], indices[1] + 1)
		];
	};
	const get_longest_array = (arrays) => {
		if (arrays.length === 1) { return arrays[0]; }
		const lengths = arrays.map(arr => arr.length);
		let max = 0;
		for (let i = 0; i < arrays.length; i++) {
			if (lengths[i] > lengths[max]) {
				max = i;
			}
		}
		return arrays[max];
	};
	const remove_single_instances = (array) => {
		const count = {};
		array.forEach(n => {
			if (count[n] === undefined) { count[n] = 0; }
			count[n]++;
		});
		return array.filter(n => count[n] > 1);
	};
	const boolean_matrix_to_indexed_array = matrix => matrix
		.map(row => row
			.map((value, i) => value === true ? i : undefined)
			.filter(a => a !== undefined));
	const boolean_matrix_to_unique_index_pairs = matrix => {
		const pairs = [];
		for (let i = 0; i < matrix.length - 1; i++) {
			for (let j = i + 1; j < matrix.length; j++) {
				if (matrix[i][j]) {
					pairs.push([i, j]);
				}
			}
		}
		return pairs;
	};
	const make_unique_sets_from_self_relational_arrays = (matrix) => {
		const groups = [];
		const recurse = (index, current_group) => {
			if (groups[index] !== undefined) { return 0; }
			groups[index] = current_group;
			matrix[index].forEach(i => recurse(i, current_group));
			return 1;
		};
		for (let row = 0, group = 0; row < matrix.length; row++) {
			if (!(row in matrix)) { continue; }
			group += recurse(row, group);
		}
		return groups;
	};
	const make_triangle_pairs = (array) => {
		const pairs = Array((array.length * (array.length - 1)) / 2);
		let index = 0;
		for (let i = 0; i < array.length - 1; i++) {
			for (let j = i + 1; j < array.length; j++, index++) {
				pairs[index] = [array[i], array[j]];
			}
		}
		return pairs;
	};
	const circular_array_valid_ranges = (array) => {
		const not_undefineds = array.map(el => el !== undefined);
		if (not_undefineds.reduce((a, b) => a && b, true)) {
			return [[0, array.length - 1]];
		}
		const first_not_undefined = not_undefineds
			.map((el, i, arr) => el && !arr[(i - 1 + arr.length) % arr.length]);
		const total = first_not_undefined.reduce((a, b) => a + (b ? 1 : 0), 0);
		const starts = Array(total);
		const counts = Array(total).fill(0);
		let index = not_undefineds[0] && not_undefineds[array.length-1]
			? 0
			: (total - 1);
		not_undefineds.forEach((el, i) => {
			index = (index + (first_not_undefined[i] ? 1 : 0)) % counts.length;
			counts[index] += not_undefineds[i] ? 1 : 0;
			if (first_not_undefined[i]) { starts[index] = i; }
		});
		return starts.map((s, i) => [s, (s + counts[i] - 1) % array.length]);
	};

	var arrays = /*#__PURE__*/Object.freeze({
		__proto__: null,
		unique_sorted_integers: unique_sorted_integers,
		split_circular_array: split_circular_array,
		get_longest_array: get_longest_array,
		remove_single_instances: remove_single_instances,
		boolean_matrix_to_indexed_array: boolean_matrix_to_indexed_array,
		boolean_matrix_to_unique_index_pairs: boolean_matrix_to_unique_index_pairs,
		make_unique_sets_from_self_relational_arrays: make_unique_sets_from_self_relational_arrays,
		make_triangle_pairs: make_triangle_pairs,
		circular_array_valid_ranges: circular_array_valid_ranges
	});

	const remove_geometry_indices = (graph, key, removeIndices) => {
		const geometry_array_size = count(graph, key);
		const removes = unique_sorted_integers(removeIndices);
		const index_map = [];
		let i, j, walk;
		for (i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
			while (i === removes[walk]) {
				index_map[i] = undefined;
				i += 1;
				walk += 1;
			}
			if (i < geometry_array_size) { index_map[i] = j; }
		}
		get_graph_keys_with_suffix(graph, key)
			.forEach(sKey => graph[sKey]
				.forEach((_, i) => graph[sKey][i]
					.forEach((v, j) => { graph[sKey][i][j] = index_map[v]; })));
		removes.reverse();
		get_graph_keys_with_prefix(graph, key)
			.forEach((prefix_key) => removes
				.forEach(index => graph[prefix_key]
					.splice(index, 1)));
		return index_map;
	};

	const replace_geometry_indices = (graph, key, replaceIndices) => {
		const geometry_array_size = count(graph, key);
		const removes = Object.keys(replaceIndices).map(n => parseInt(n));
		const replaces = unique_sorted_integers(removes);
		const index_map = [];
		let i, j, walk;
		for (i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
			while (i === replaces[walk]) {
				index_map[i] = index_map[replaceIndices[replaces[walk]]];
				if (index_map[i] === undefined) {
					console.log("replace() found an undefined", index_map);
				}
				i += 1;
				walk += 1;
			}
			if (i < geometry_array_size) { index_map[i] = j; }
		}
		get_graph_keys_with_suffix(graph, key)
			.forEach(sKey => graph[sKey]
				.forEach((_, i) => graph[sKey][i]
					.forEach((v, j) => { graph[sKey][i][j] = index_map[v]; })));
		replaces.reverse();
		get_graph_keys_with_prefix(graph, key)
			.forEach((prefix_key) => replaces
				.forEach(index => graph[prefix_key]
					.splice(index, 1)));
		return index_map;
	};

	const get_duplicate_vertices = (graph, epsilon) => {
		return get_vertices_clusters(graph, epsilon)
			.filter(arr => arr.length > 1);
	};
	const get_edge_isolated_vertices = ({ vertices_coords, edges_vertices }) => {
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
	const get_face_isolated_vertices = ({ vertices_coords, faces_vertices }) => {
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
	const get_isolated_vertices = ({ vertices_coords, edges_vertices, faces_vertices }) => {
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
	const remove_isolated_vertices = (graph, remove_indices) => {
		if (!remove_indices) {
			remove_indices = get_isolated_vertices(graph);
		}
		return {
			map: remove_geometry_indices(graph, _vertices, remove_indices),
			remove: remove_indices,
		};
	};
	const remove_duplicate_vertices = (graph, epsilon = math.core.EPSILON) => {
		const replace_indices = [];
		const remove_indices = [];
		const clusters = get_vertices_clusters(graph, epsilon)
			.filter(arr => arr.length > 1);
		clusters.forEach(cluster => {
			for (let i = 1; i < cluster.length; i++) {
				replace_indices[cluster[i]] = cluster[0];
				remove_indices.push(cluster[i]);
			}
		});
		clusters
			.map(arr => arr.map(i => graph.vertices_coords[i]))
			.map(arr => math.core.average(...arr))
			.forEach((point, i) => { graph.vertices_coords[clusters[i][0]] = point; });
		return {
			map: replace_geometry_indices(graph, _vertices, replace_indices),
			remove: remove_indices,
		}
	};

	var vertices_violations = /*#__PURE__*/Object.freeze({
		__proto__: null,
		get_duplicate_vertices: get_duplicate_vertices,
		get_edge_isolated_vertices: get_edge_isolated_vertices,
		get_face_isolated_vertices: get_face_isolated_vertices,
		get_isolated_vertices: get_isolated_vertices,
		remove_isolated_vertices: remove_isolated_vertices,
		remove_duplicate_vertices: remove_duplicate_vertices
	});

	const array_in_array_max_number = (arrays) => {
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
	const implied_count = (graph, key) => Math.max(
		array_in_array_max_number(
			get_graph_keys_with_suffix(graph, key).map(str => graph[str])
		),
		graph[ordersArrayNames[key]]
			? max_num_in_orders(graph[ordersArrayNames[key]])
			: -1,
	) + 1;
	implied_count.vertices = graph => implied_count(graph, _vertices);
	implied_count.edges = graph => implied_count(graph, _edges);
	implied_count.faces = graph => implied_count(graph, _faces);

	const counter_clockwise_walk = ({ vertices_vertices, vertices_sectors }, v0, v1, walked_edges = {}) => {
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
	const planar_vertex_walk = ({ vertices_vertices, vertices_sectors }) => {
		const graph = { vertices_vertices, vertices_sectors };
		const walked_edges = {};
		return vertices_vertices
			.map((adj_verts, v) => adj_verts
				.map(adj_vert => counter_clockwise_walk(graph, v, adj_vert, walked_edges))
				.filter(a => a !== undefined))
			.reduce((a, b) => a.concat(b), [])
	};
	const filter_walked_boundary_face = walked_faces => walked_faces
		.filter(face => face.angles
			.map(a => Math.PI - a)
			.reduce((a,b) => a + b, 0) > 0);

	var walk = /*#__PURE__*/Object.freeze({
		__proto__: null,
		counter_clockwise_walk: counter_clockwise_walk,
		planar_vertex_walk: planar_vertex_walk,
		filter_walked_boundary_face: filter_walked_boundary_face
	});

	const sort_vertices_counter_clockwise = ({ vertices_coords }, vertices, vertex) =>
		vertices
			.map(v => vertices_coords[v])
			.map(coord => math.core.subtract(coord, vertices_coords[vertex]))
			.map(vec => Math.atan2(vec[1], vec[0]))
			.map(angle => angle > -math.core.EPSILON ? angle : angle + Math.PI * 2)
			.map((a, i) => ({a, i}))
			.sort((a, b) => a.a - b.a)
			.map(el => el.i)
			.map(i => vertices[i]);
	const sort_vertices_along_vector = ({ vertices_coords }, vertices, vector) =>
		vertices
			.map(i => ({ i, d: math.core.dot(vertices_coords[i], vector) }))
			.sort((a, b) => a.d - b.d)
			.map(a => a.i);

	var sort = /*#__PURE__*/Object.freeze({
		__proto__: null,
		sort_vertices_counter_clockwise: sort_vertices_counter_clockwise,
		sort_vertices_along_vector: sort_vertices_along_vector
	});

	const make_vertices_edges_unsorted = ({ edges_vertices }) => {
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
	const make_vertices_edges = ({ edges_vertices, vertices_vertices }) => {
		const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
		return vertices_vertices
			.map((verts, i) => verts
				.map(v => edge_map[`${i} ${v}`]));
	};
	const make_vertices_vertices = ({ vertices_coords, vertices_edges, edges_vertices }) => {
		if (!vertices_edges) {
			vertices_edges = make_vertices_edges_unsorted({ edges_vertices });
		}
		const vertices_vertices = vertices_edges
			.map((edges, v) => edges
				.map(edge => edges_vertices[edge]
					.filter(i => i !== v))
				.reduce((a, b) => a.concat(b), []));
		return vertices_coords === undefined
			? vertices_vertices
			: vertices_vertices
				.map((verts, i) => sort_vertices_counter_clockwise({ vertices_coords }, verts, i));
	};
	const make_vertices_faces_unsorted = ({ vertices_coords, faces_vertices }) => {
		if (!faces_vertices) { return vertices_coords.map(() => []); }
		const vertices_faces = vertices_coords !== undefined
			? vertices_coords.map(() => [])
			: Array.from(Array(implied_count.vertices({ faces_vertices }))).map(() => []);
		faces_vertices.forEach((face, f) => {
			const hash = [];
			face.forEach((vertex) => { hash[vertex] = f; });
			hash.forEach((fa, v) => vertices_faces[v].push(fa));
		});
		return vertices_faces;
	};
	const make_vertices_faces = ({ vertices_coords, vertices_vertices, faces_vertices }) => {
		if (!faces_vertices) { return vertices_coords.map(() => []); }
		if (!vertices_vertices) {
			return make_vertices_faces_unsorted({ vertices_coords, faces_vertices });
		}
		const face_map = make_vertices_to_face({ faces_vertices });
		return vertices_vertices
			.map((verts, v) => verts
				.map((vert, i, arr) => [arr[(i + 1) % arr.length], v, vert]
					.join(" ")))
			.map(keys => keys
				.map(key => face_map[key]));
	};
	const make_vertices_to_edge_bidirectional = ({ edges_vertices }) => {
		const map = {};
		edges_vertices
			.map(ev => ev.join(" "))
			.forEach((key, i) => { map[key] = i; });
		edges_vertices
			.map(ev => `${ev[1]} ${ev[0]}`)
			.forEach((key, i) => { map[key] = i; });
		return map;
	};
	const make_vertices_to_edge = ({ edges_vertices }) => {
		const map = {};
		edges_vertices
			.map(ev => ev.join(" "))
			.forEach((key, i) => { map[key] = i; });
		return map;
	};
	const make_vertices_to_face = ({ faces_vertices }) => {
		const map = {};
		faces_vertices
			.forEach((face, f) => face
				.map((_, i) => [0, 1, 2]
					.map(j => (i + j) % face.length)
					.map(i => face[i])
					.join(" "))
				.forEach(key => { map[key] = f; }));
		return map;
	};
	const make_vertices_vertices_vector = ({ vertices_coords, vertices_vertices, edges_vertices, edges_vector }) => {
		if (!edges_vector) {
			edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
		}
		const edge_map = make_vertices_to_edge({ edges_vertices });
		return vertices_vertices
			.map((_, a) => vertices_vertices[a]
				.map((b) => {
					const edge_a = edge_map[`${a} ${b}`];
					const edge_b = edge_map[`${b} ${a}`];
					if (edge_a !== undefined) { return edges_vector[edge_a]; }
					if (edge_b !== undefined) { return math.core.flip(edges_vector[edge_b]); }
				}));
	};
	const make_vertices_sectors = ({ vertices_coords, vertices_vertices, edges_vertices, edges_vector }) =>
		make_vertices_vertices_vector({ vertices_coords, vertices_vertices, edges_vertices, edges_vector })
			.map(vectors => vectors.length === 1
				? [math.core.TWO_PI]
				: math.core.counter_clockwise_sectors2(vectors));
	const make_edges_edges = ({ edges_vertices, vertices_edges }) =>
		edges_vertices.map((verts, i) => {
			const side0 = vertices_edges[verts[0]].filter(e => e !== i);
			const side1 = vertices_edges[verts[1]].filter(e => e !== i);
			return side0.concat(side1);
		});
	const make_edges_faces_unsorted = ({ edges_vertices, faces_edges }) => {
		const edges_faces = edges_vertices !== undefined
			? edges_vertices.map(() => [])
			: Array.from(Array(implied_count.edges({ faces_edges }))).map(() => []);
		faces_edges.forEach((face, f) => {
			const hash = [];
			face.forEach((edge) => { hash[edge] = f; });
			hash.forEach((fa, e) => edges_faces[e].push(fa));
		});
		return edges_faces;
	};
	const make_edges_faces = ({ vertices_coords, edges_vertices, edges_vector, faces_vertices, faces_edges, faces_center }) => {
		if (!edges_vertices) {
			return make_edges_faces_unsorted({ faces_edges });
		}
		if (!edges_vector) {
			edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
		}
		const edges_origin = edges_vertices.map(pair => vertices_coords[pair[0]]);
		if (!faces_center) {
			faces_center = make_faces_center({ vertices_coords, faces_vertices });
		}
		const edges_faces = edges_vertices.map(ev => []);
		faces_edges.forEach((face, f) => {
			const hash = [];
			face.forEach((edge) => { hash[edge] = f; });
			hash.forEach((fa, e) => edges_faces[e].push(fa));
		});
		edges_faces.forEach((faces, e) => {
			const faces_cross = faces
				.map(f => faces_center[f])
				.map(center => math.core.subtract2(center, edges_origin[e]))
				.map(vector => math.core.cross2(vector, edges_vector[e]));
			faces.sort((a, b) => faces_cross[a] - faces_cross[b]);
		});
		return edges_faces;
	};
	const assignment_angles = { M: -180, m: -180, V: 180, v: 180 };
	const make_edges_foldAngle = ({ edges_assignment }) => edges_assignment
		.map(a => assignment_angles[a] || 0);
	const make_edges_assignment = ({ edges_foldAngle }) => edges_foldAngle
		.map(a => {
			if (a === 0) { return "F"; }
			return a < 0 ? "M" : "V";
		});
	const make_edges_coords = ({ vertices_coords, edges_vertices }) =>
		edges_vertices
			.map(ev => ev.map(v => vertices_coords[v]));
	const make_edges_vector = ({ vertices_coords, edges_vertices }) =>
		make_edges_coords({ vertices_coords, edges_vertices })
			.map(verts => math.core.subtract(verts[1], verts[0]));
	const make_edges_length = ({ vertices_coords, edges_vertices }) =>
		make_edges_vector({ vertices_coords, edges_vertices })
			.map(vec => math.core.magnitude(vec));
	const make_edges_bounding_box = ({ vertices_coords, edges_vertices, edges_coords }, epsilon = 0) => {
		if (!edges_coords) {
			edges_coords = make_edges_coords({ vertices_coords, edges_vertices });
		}
		return edges_coords.map(coords => math.core.bounding_box(coords, epsilon))
	};
	const make_planar_faces = ({ vertices_coords, vertices_vertices, vertices_edges, vertices_sectors, edges_vertices, edges_vector }) => {
		if (!vertices_vertices) {
			vertices_vertices = make_vertices_vertices({ vertices_coords, edges_vertices, vertices_edges });
		}
		if (!vertices_sectors) {
			vertices_sectors = make_vertices_sectors({ vertices_coords, vertices_vertices, edges_vertices, edges_vector });
		}
		const vertices_edges_map = make_vertices_to_edge_bidirectional({ edges_vertices });
		return filter_walked_boundary_face(
				planar_vertex_walk({ vertices_vertices, vertices_sectors }))
			.map(f => ({ ...f, edges: f.edges.map(e => vertices_edges_map[e]) }));
	};
	const make_planar_faces_vertices = graph => make_planar_faces(graph)
		.map(face => face.vertices);
	const make_planar_faces_edges = graph => make_planar_faces(graph)
		.map(face => face.edges);
	const make_faces_vertices_from_edges = (graph) => {
		return graph.faces_edges
			.map(edges => edges
				.map(edge => graph.edges_vertices[edge])
				.map((pairs, i, arr) => {
					const next = arr[(i + 1) % arr.length];
					return (pairs[0] === next[0] || pairs[0] === next[1])
						? pairs[1]
						: pairs[0];
				}));
	};
	const make_faces_edges_from_vertices = (graph) => {
		const map = make_vertices_to_edge_bidirectional(graph);
		return graph.faces_vertices
			.map(face => face
				.map((v, i, arr) => [v, arr[(i + 1) % arr.length]].join(" ")))
			.map(face => face.map(pair => map[pair]));
	};
	const make_faces_faces = ({ faces_vertices }) => {
		const faces_faces = faces_vertices.map(() => []);
		const edgeMap = {};
		faces_vertices
			.map((face, f) => face
				.map((v0, i, arr) => {
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
				faces_faces[pair[0]].push(parseInt(pair[1]));
				faces_faces[pair[1]].push(parseInt(pair[0]));
			});
		return faces_faces;
	};
	const make_faces_polygon = ({ vertices_coords, faces_vertices }, epsilon) =>
		faces_vertices
			.map(verts => verts.map(v => vertices_coords[v]))
			.map(polygon => math.core.make_polygon_non_collinear(polygon, epsilon));
	const make_faces_polygon_quick = ({ vertices_coords, faces_vertices }) =>
		faces_vertices
			.map(verts => verts.map(v => vertices_coords[v]));
	const make_faces_center = ({ vertices_coords, faces_vertices }) => faces_vertices
		.map(fv => fv.map(v => vertices_coords[v]))
		.map(coords => math.core.centroid(coords));
	const make_faces_center_quick = ({ vertices_coords, faces_vertices }) =>
		faces_vertices
			.map(vertices => vertices
				.map(v => vertices_coords[v])
				.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
				.map(el => el / vertices.length));

	var make = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make_vertices_edges_unsorted: make_vertices_edges_unsorted,
		make_vertices_edges: make_vertices_edges,
		make_vertices_vertices: make_vertices_vertices,
		make_vertices_faces_unsorted: make_vertices_faces_unsorted,
		make_vertices_faces: make_vertices_faces,
		make_vertices_to_edge_bidirectional: make_vertices_to_edge_bidirectional,
		make_vertices_to_edge: make_vertices_to_edge,
		make_vertices_to_face: make_vertices_to_face,
		make_vertices_vertices_vector: make_vertices_vertices_vector,
		make_vertices_sectors: make_vertices_sectors,
		make_edges_edges: make_edges_edges,
		make_edges_faces_unsorted: make_edges_faces_unsorted,
		make_edges_faces: make_edges_faces,
		make_edges_foldAngle: make_edges_foldAngle,
		make_edges_assignment: make_edges_assignment,
		make_edges_coords: make_edges_coords,
		make_edges_vector: make_edges_vector,
		make_edges_length: make_edges_length,
		make_edges_bounding_box: make_edges_bounding_box,
		make_planar_faces: make_planar_faces,
		make_planar_faces_vertices: make_planar_faces_vertices,
		make_planar_faces_edges: make_planar_faces_edges,
		make_faces_vertices_from_edges: make_faces_vertices_from_edges,
		make_faces_edges_from_vertices: make_faces_edges_from_vertices,
		make_faces_faces: make_faces_faces,
		make_faces_polygon: make_faces_polygon,
		make_faces_polygon_quick: make_faces_polygon_quick,
		make_faces_center: make_faces_center,
		make_faces_center_quick: make_faces_center_quick
	});

	const get_circular_edges = ({ edges_vertices }) => {
		const circular = [];
		for (let i = 0; i < edges_vertices.length; i += 1) {
			if (edges_vertices[i][0] === edges_vertices[i][1]) {
				circular.push(i);
			}
		}
		return circular;
	};
	const get_duplicate_edges = ({ edges_vertices }) => {
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
	const splice_remove_values_from_suffixes = (graph, suffix, remove_indices) => {
		const remove_map = {};
		remove_indices.forEach(n => { remove_map[n] = true; });
		get_graph_keys_with_suffix(graph, suffix)
			.forEach(sKey => graph[sKey]
				.forEach((elem, i) => {
					for (let j = elem.length - 1; j >= 0; j--) {
						if (remove_map[elem[j]] === true) {
							graph[sKey][i].splice(j, 1);
						}
					}
				}));
	};
	const remove_circular_edges = (graph, remove_indices) => {
		if (!remove_indices) {
			remove_indices = get_circular_edges(graph);
		}
		if (remove_indices.length) {
			splice_remove_values_from_suffixes(graph, _edges, remove_indices);
		}
		return {
			map: remove_geometry_indices(graph, _edges, remove_indices),
			remove: remove_indices,
		};
	};
	const remove_duplicate_edges = (graph, replace_indices) => {
		if (!replace_indices) {
			replace_indices = get_duplicate_edges(graph);
		}
		const remove = Object.keys(replace_indices).map(n => parseInt(n));
		const map = replace_geometry_indices(graph, _edges, replace_indices);
		if (remove.length) {
			if (graph.vertices_edges || graph.vertices_vertices || graph.vertices_faces) {
				graph.vertices_edges = make_vertices_edges_unsorted(graph);
				graph.vertices_vertices = make_vertices_vertices(graph);
				graph.vertices_edges = make_vertices_edges(graph);
				graph.vertices_faces = make_vertices_faces(graph);
			}
		}
		return { map, remove };
	};

	var edges_violations = /*#__PURE__*/Object.freeze({
		__proto__: null,
		get_circular_edges: get_circular_edges,
		get_duplicate_edges: get_duplicate_edges,
		remove_circular_edges: remove_circular_edges,
		remove_duplicate_edges: remove_duplicate_edges
	});

	const merge_simple_nextmaps = (...maps) => {
		if (maps.length === 0) { return; }
		const solution = maps[0].map((_, i) => i);
		maps.forEach(map => solution.forEach((s, i) => { solution[i] = map[s]; }));
		return solution;
	};
	const merge_nextmaps = (...maps) => {
		if (maps.length === 0) { return; }
		const solution = maps[0].map((_, i) => [i]);
		maps.forEach(map => {
			solution.forEach((s, i) => s.forEach((indx,j) => { solution[i][j] = map[indx]; }));
			solution.forEach((arr, i) => {
				solution[i] = arr
					.reduce((a,b) => a.concat(b), [])
					.filter(a => a !== undefined);
			});
		});
		return solution;
	};
	const merge_simple_backmaps = (...maps) => {
		if (maps.length === 0) { return; }
		let solution = maps[0].map((_, i) => i);
		maps.forEach((map, i) => {
			const next = map.map(n => solution[n]);
			solution = next;
		});
		return solution;
	};
	const merge_backmaps = (...maps) => {
		if (maps.length === 0) { return; }
		let solution = maps[0].reduce((a, b) => a.concat(b), []).map((_, i) => [i]);
		maps.forEach((map, i) => {
			let next = [];
			map.forEach((el, j) => {
				if (typeof el === _number) { next[j] = solution[el]; }
				else { next[j] = el.map(n => solution[n]).reduce((a,b) => a.concat(b), []); }
			});
			solution = next;
		});
		return solution;
	};
	const invert_map = (map) => {
		const inv = [];
		map.forEach((n, i) => {
			if (n == null) { return; }
			if (typeof n === _number) {
				if (inv[n] !== undefined) {
					if (typeof inv[n] === _number) { inv[n] = [inv[n], i]; }
					else { inv[n].push(i); }
				}
				else { inv[n] = i; }
			}
			if (n.constructor === Array) { n.forEach(m => { inv[m] = i; }); }
		});
		return inv;
	};
	const invert_simple_map = (map) => {
		const inv = [];
		map.forEach((n, i) => { inv[n] = i; });
		return inv;
	};

	var maps = /*#__PURE__*/Object.freeze({
		__proto__: null,
		merge_simple_nextmaps: merge_simple_nextmaps,
		merge_nextmaps: merge_nextmaps,
		merge_simple_backmaps: merge_simple_backmaps,
		merge_backmaps: merge_backmaps,
		invert_map: invert_map,
		invert_simple_map: invert_simple_map
	});

	const clean = (graph, epsilon) => {
		const change_v1 = remove_duplicate_vertices(graph, epsilon);
		const change_e1 = remove_circular_edges(graph);
		const change_e2 = remove_duplicate_edges(graph);
		const change_v2 = remove_isolated_vertices(graph);
		const change_v1_backmap = invert_simple_map(change_v1.map);
		const change_v2_remove = change_v2.remove.map(e => change_v1_backmap[e]);
		const change_e1_backmap = invert_simple_map(change_e1.map);
		const change_e2_remove = change_e2.remove.map(e => change_e1_backmap[e]);
		return {
			vertices: {
				map: merge_simple_nextmaps(change_v1.map, change_v2.map),
				remove: change_v1.remove.concat(change_v2_remove),
			},
			edges: {
				map: merge_simple_nextmaps(change_e1.map, change_e2.map),
				remove: change_e1.remove.concat(change_e2_remove),
			},
		}
	};

	const validate_references = (graph) => {
		const counts = {
			vertices: count.vertices(graph),
			edges: count.edges(graph),
			faces: count.faces(graph),
		};
		const implied = {
			vertices: implied_count.vertices(graph),
			edges: implied_count.edges(graph),
			faces: implied_count.faces(graph),
		};
		return {
			vertices: counts.vertices >= implied.vertices,
			edges: counts.edges >= implied.edges,
			faces: counts.faces >= implied.faces,
		}
	};
	const validate = (graph, epsilon) => {
		const duplicate_edges = get_duplicate_edges(graph);
		const circular_edges = get_circular_edges(graph);
		const isolated_vertices = get_isolated_vertices(graph);
		const duplicate_vertices = get_duplicate_vertices(graph, epsilon);
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
			}
		};
	};

	const build_assignments_if_needed = (graph) => {
		const len = graph.edges_vertices.length;
		if (!graph.edges_assignment) { graph.edges_assignment = []; }
		if (!graph.edges_foldAngle) { graph.edges_foldAngle = []; }
		if (graph.edges_assignment.length > graph.edges_foldAngle.length) {
			for (let i = graph.edges_foldAngle.length; i < graph.edges_assignment.length; i += 1) {
				graph.edges_foldAngle[i] = edge_assignment_to_foldAngle(graph.edges_assignment[i]);
			}
		}
		if (graph.edges_foldAngle.length > graph.edges_assignment.length) {
			for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
				graph.edges_assignment[i] = edge_foldAngle_to_assignment(graph.edges_foldAngle[i]);
			}
		}
		for (let i = graph.edges_assignment.length; i < len; i += 1) {
			graph.edges_assignment[i] = "U";
			graph.edges_foldAngle[i] = 0;
		}
	};
	const build_faces_if_needed = (graph, reface) => {
		if (reface === undefined && !graph.faces_vertices && !graph.faces_edges) {
			reface = true;
		}
		if (reface && graph.vertices_coords) {
			const faces = make_planar_faces(graph);
			graph.faces_vertices = faces.map(face => face.vertices);
			graph.faces_edges = faces.map(face => face.edges);
			return;
		}
		if (graph.faces_vertices && graph.faces_edges) { return; }
		if (graph.faces_vertices && !graph.faces_edges) {
			graph.faces_edges = make_faces_edges_from_vertices(graph);
		} else if (graph.faces_edges && !graph.faces_vertices) {
			graph.faces_vertices = make_faces_vertices_from_edges(graph);
		} else {
			graph.faces_vertices = [];
			graph.faces_edges = [];
		}
	};
	const populate = (graph, reface) => {
		if (typeof graph !== "object") { return graph; }
		if (!graph.edges_vertices) { return graph; }
		graph.vertices_edges = make_vertices_edges_unsorted(graph);
		graph.vertices_vertices = make_vertices_vertices(graph);
		graph.vertices_edges = make_vertices_edges(graph);
		build_assignments_if_needed(graph);
		build_faces_if_needed(graph, reface);
		graph.vertices_faces = make_vertices_faces(graph);
		graph.edges_faces = make_edges_faces_unsorted(graph);
		graph.faces_faces = make_faces_faces(graph);
		return graph;
	};

	const get_edges_vertices_span = (graph, epsilon = math.core.EPSILON) =>
		make_edges_bounding_box(graph, epsilon)
			.map((min_max, e) => graph.vertices_coords
				.map((vert, v) => (
					vert[0] > min_max.min[0] - epsilon &&
					vert[1] > min_max.min[1] - epsilon &&
					vert[0] < min_max.max[0] + epsilon &&
					vert[1] < min_max.max[1] + epsilon)));
	const get_edges_edges_span = ({ vertices_coords, edges_vertices, edges_coords }, epsilon = math.core.EPSILON) => {
		const min_max = make_edges_bounding_box({ vertices_coords, edges_vertices, edges_coords }, epsilon);
		const span_overlaps = edges_vertices.map(() => []);
		for (let e0 = 0; e0 < edges_vertices.length - 1; e0 += 1) {
			for (let e1 = e0 + 1; e1 < edges_vertices.length; e1 += 1) {
				const outside_of =
					(min_max[e0].max[0] < min_max[e1].min[0] || min_max[e1].max[0] < min_max[e0].min[0])
				&&(min_max[e0].max[1] < min_max[e1].min[1] || min_max[e1].max[1] < min_max[e0].min[1]);
				span_overlaps[e0][e1] = !outside_of;
				span_overlaps[e1][e0] = !outside_of;
			}
		}
		for (let i = 0; i < edges_vertices.length; i += 1) {
			span_overlaps[i][i] = true;
		}
		return span_overlaps;
	};

	var span = /*#__PURE__*/Object.freeze({
		__proto__: null,
		get_edges_vertices_span: get_edges_vertices_span,
		get_edges_edges_span: get_edges_edges_span
	});

	const get_opposite_vertices$1 = (graph, vertex, edges) => {
		edges.forEach(edge => {
			if (graph.edges_vertices[edge][0] === vertex
				&& graph.edges_vertices[edge][1] === vertex) {
				console.warn("remove_planar_vertex circular edge");
			}
		});
		return edges.map(edge => graph.edges_vertices[edge][0] === vertex
			? graph.edges_vertices[edge][1]
			: graph.edges_vertices[edge][0]);
	};
	const is_vertex_collinear = (graph, vertex) => {
		const edges = graph.vertices_edges[vertex];
		if (edges === undefined || edges.length !== 2) { return false; }
		const vertices = get_opposite_vertices$1(graph, vertex, edges);
		const vectors = [[vertices[0], vertex], [vertex, vertices[1]]]
			.map(verts => verts.map(v => graph.vertices_coords[v]))
			.map(segment => math.core.subtract(segment[1], segment[0]))
			.map(vector => math.core.normalize(vector));
		const is_parallel = math.core
			.equivalent_numbers(1.0, math.core.dot(...vectors));
		return is_parallel;
	};
	const get_vertices_edges_overlap = ({ vertices_coords, edges_vertices, edges_coords }, epsilon = math.core.EPSILON) => {
		if (!edges_coords) {
			edges_coords = edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
		}
		const edges_span_vertices = get_edges_vertices_span({
			vertices_coords, edges_vertices, edges_coords
		}, epsilon);
		for (let e = 0; e < edges_coords.length; e += 1) {
			for (let v = 0; v < vertices_coords.length; v += 1) {
				if (!edges_span_vertices[e][v]) { continue; }
				edges_span_vertices[e][v] = math.core.overlap_line_point(
					math.core.subtract(edges_coords[e][1], edges_coords[e][0]),
					edges_coords[e][0],
					vertices_coords[v],
					math.core.exclude_s,
					epsilon
				);
			}
		}
		return edges_span_vertices
			.map(verts => verts
				.map((vert, i) => vert ? i : undefined)
				.filter(i => i !== undefined));
	};

	var vertices_collinear = /*#__PURE__*/Object.freeze({
		__proto__: null,
		is_vertex_collinear: is_vertex_collinear,
		get_vertices_edges_overlap: get_vertices_edges_overlap
	});

	const make_edges_line_parallel_overlap = ({ vertices_coords, edges_vertices }, vector, point, epsilon = math.core.EPSILON) => {
		const normalized = math.core.normalize2(vector);
		const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
		const edges_vector = edges_vertices
			.map(ev => ev.map(v => vertices_coords[v]))
			.map(edge => math.core.subtract2(edge[1], edge[0]));
		const overlap = edges_vector
			.map(vec => math.core.parallel2(vec, vector, epsilon));
		for (let e = 0; e < edges_vertices.length; e++) {
			if (!overlap[e]) { continue; }
			if (math.core.equivalent_vector2(edges_origin[e], point)) {
				overlap[e] = true;
				continue;
			}
			const vec = math.core.normalize2(math.core.subtract2(edges_origin[e], point));
			const dot = Math.abs(math.core.dot2(vec, normalized));
			overlap[e] = Math.abs(1.0 - dot) < epsilon;
		}
		return overlap;
	};
	const make_edges_segment_intersection = ({ vertices_coords, edges_vertices, edges_coords }, point1, point2, epsilon = math.core.EPSILON) => {
		if (!edges_coords) {
			edges_coords = make_edges_coords({ vertices_coords, edges_vertices });
		}
		const segment_box = math.core.bounding_box([point1, point2], epsilon);
		const segment_vector = math.core.subtract2(point2, point1);
		return make_edges_bounding_box({ vertices_coords, edges_vertices, edges_coords }, epsilon)
			.map(box => math.core.overlap_bounding_boxes(segment_box, box))
			.map((overlap, i) => overlap ? (math.core.intersect_line_line(
				segment_vector,
				point1,
				math.core.subtract2(edges_coords[i][1], edges_coords[i][0]),
				edges_coords[i][0],
				math.core.include_s,
				math.core.include_s,
				epsilon)) : undefined);
	};
	const make_edges_edges_intersection = function ({
		vertices_coords, edges_vertices, edges_vector, edges_origin
	}, epsilon = math.core.EPSILON) {
		if (!edges_vector) {
			edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
		}
		if (!edges_origin) {
			edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
		}
		const edges_intersections = edges_vector.map(() => []);
		const span = get_edges_edges_span({ vertices_coords, edges_vertices }, epsilon);
		for (let i = 0; i < edges_vector.length - 1; i += 1) {
			for (let j = i + 1; j < edges_vector.length; j += 1) {
				if (span[i][j] !== true) {
					edges_intersections[i][j] = undefined;
					continue;
				}
				edges_intersections[i][j] = math.core.intersect_line_line(
					edges_vector[i],
					edges_origin[i],
					edges_vector[j],
					edges_origin[j],
					math.core.exclude_s,
					math.core.exclude_s,
					epsilon
				);
				edges_intersections[j][i] = edges_intersections[i][j];
			}
		}
		return edges_intersections;
	};
	const intersect_convex_face_line = ({ vertices_coords, edges_vertices, faces_vertices, faces_edges }, face, vector, point, epsilon = math.core.EPSILON) => {
		const face_vertices_indices = faces_vertices[face]
			.map(v => vertices_coords[v])
			.map(coord => math.core.overlap_line_point(vector, point, coord, () => true, epsilon))
			.map((overlap, i) => overlap ? i : undefined)
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
			.map(seg => math.core.intersect_line_line(
				vector,
				point,
				math.core.subtract(seg[1], seg[0]),
				seg[0],
				math.core.include_l,
				math.core.exclude_s,
				epsilon
			)).map((coords, face_edge_index) => ({
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
	};

	var intersect = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make_edges_line_parallel_overlap: make_edges_line_parallel_overlap,
		make_edges_segment_intersection: make_edges_segment_intersection,
		make_edges_edges_intersection: make_edges_edges_intersection,
		intersect_convex_face_line: intersect_convex_face_line
	});

	const fragment_graph = (graph, epsilon = math.core.EPSILON) => {
		const edges_coords = graph.edges_vertices
			.map(ev => ev.map(v => graph.vertices_coords[v]));
		const edges_vector = edges_coords.map(e => math.core.subtract(e[1], e[0]));
		const edges_origin = edges_coords.map(e => e[0]);
		const edges_intersections = make_edges_edges_intersection({
			vertices_coords: graph.vertices_coords,
			edges_vertices: graph.edges_vertices,
			edges_vector,
			edges_origin
		}, 1e-6);
		const edges_collinear_vertices = get_vertices_edges_overlap({
			vertices_coords: graph.vertices_coords,
			edges_vertices: graph.edges_vertices,
			edges_coords
		}, epsilon);
		if (edges_intersections.flat().filter(a => a !== undefined).length === 0 &&
		edges_collinear_vertices.flat().filter(a => a !== undefined).length === 0) {
			return;
		}
		const counts = { vertices: graph.vertices_coords.length };
		edges_intersections
			.forEach(edge => edge
				.filter(a => a !== undefined)
				.filter(a => a.length === 2)
				.forEach((intersect) => {
					const newIndex = graph.vertices_coords.length;
					graph.vertices_coords.push([...intersect]);
					intersect.splice(0, 2);
					intersect.push(newIndex);
				}));
		edges_intersections.forEach((edge, i) => {
			edge.forEach((intersect, j) => {
				if (intersect) {
					edges_intersections[i][j] = intersect[0];
				}
			});
		});
		const edges_intersections_flat = edges_intersections
			.map(arr => arr.filter(a => a !== undefined));
		graph.edges_vertices.forEach((verts, i) => verts
			.push(...edges_intersections_flat[i], ...edges_collinear_vertices[i]));
		graph.edges_vertices.forEach((edge, i) => {
			graph.edges_vertices[i] = sort_vertices_along_vector({
				vertices_coords: graph.vertices_coords
			}, edge, edges_vector[i]);
		});
		const edge_map = graph.edges_vertices
			.map((edge, i) => Array(edge.length - 1).fill(i))
			.flat();
		graph.edges_vertices = graph.edges_vertices
			.map(edge => Array.from(Array(edge.length - 1))
				.map((_, i, arr) => [edge[i], edge[i + 1]]))
			.flat();
		if (graph.edges_assignment && graph.edges_foldAngle
			&& graph.edges_foldAngle.length > graph.edges_assignment.length) {
			for (let i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
				graph.edges_assignment[i] = edge_foldAngle_to_assignment(graph.edges_foldAngle[i]);
			}
		}
		if (graph.edges_assignment) {
			graph.edges_assignment = edge_map.map(i => graph.edges_assignment[i] || "U");
		}
		if (graph.edges_foldAngle) {
			graph.edges_foldAngle = edge_map
				.map(i => graph.edges_foldAngle[i])
				.map((a, i) => a === undefined
					? edge_assignment_to_foldAngle(graph.edges_assignment[i])
					: a);
		}
		return {
			vertices: {
				new: Array.from(Array(graph.vertices_coords.length - counts.vertices))
					.map((_, i) => counts.vertices + i),
			},
			edges: {
				backmap: edge_map
			}
		};
	};
	const fragment_keep_keys = [
		_vertices_coords,
		_edges_vertices,
		_edges_assignment,
		_edges_foldAngle,
	];
	const fragment = (graph, epsilon = math.core.EPSILON) => {
		graph.vertices_coords = graph.vertices_coords.map(coord => coord.slice(0, 2));
		[_vertices, _edges, _faces]
			.map(key => get_graph_keys_with_prefix(graph, key))
			.flat()
			.filter(key => !(fragment_keep_keys.includes(key)))
			.forEach(key => delete graph[key]);
		const change = {
			vertices: {},
			edges: {},
		};
		let i;
		for (i = 0; i < 20; i++) {
			const resVert = remove_duplicate_vertices(graph, epsilon / 2);
			const resEdgeDup = remove_duplicate_edges(graph);
			const resEdgeCirc = remove_circular_edges(graph);
			const resFrag = fragment_graph(graph, epsilon);
			if (resFrag === undefined) {
				change.vertices.map = (change.vertices.map === undefined
					? resVert.map
					: merge_nextmaps(change.vertices.map, resVert.map));
				change.edges.map = (change.edges.map === undefined
					? merge_nextmaps(resEdgeDup.map, resEdgeCirc.map)
					: merge_nextmaps(change.edges.map, resEdgeDup.map, resEdgeCirc.map));
				break;
			}
			const invert_frag = invert_map(resFrag.edges.backmap);
			const edgemap = merge_nextmaps(resEdgeDup.map, resEdgeCirc.map, invert_frag);
			change.vertices.map = (change.vertices.map === undefined
				? resVert.map
				: merge_nextmaps(change.vertices.map, resVert.map));
			change.edges.map = (change.edges.map === undefined
				? edgemap
				: merge_nextmaps(change.edges.map, edgemap));
		}
		if (i === 20) {
			console.warn("fragment reached max iterations");
		}
		return change;
	};

	const add_vertices = (graph, vertices_coords, epsilon = math.core.EPSILON) => {
		if (!graph.vertices_coords) { graph.vertices_coords = []; }
		if (typeof vertices_coords[0] === "number") { vertices_coords = [vertices_coords]; }
		const vertices_equivalent_vertices = vertices_coords
			.map(vertex => graph.vertices_coords
				.map(v => math.core.distance(v, vertex) < epsilon)
				.map((on_vertex, i) => on_vertex ? i : undefined)
				.filter(a => a !== undefined)
				.shift());
		let index = graph.vertices_coords.length;
		const unique_vertices = vertices_coords
			.filter((vert, i) => vertices_equivalent_vertices[i] === undefined);
		graph.vertices_coords.push(...unique_vertices);
		return vertices_equivalent_vertices
			.map(el => el === undefined ? index++ : el);
	};

	const vef = [_vertices, _edges, _faces];
	const make_vertices_map_and_consider_duplicates = (target, source, epsilon = math.core.EPSILON) => {
		let index = target.vertices_coords.length;
		return source.vertices_coords
			.map(vertex => target.vertices_coords
				.map(v => math.core.distance(v, vertex) < epsilon)
				.map((on_vertex, i) => on_vertex ? i : undefined)
				.filter(a => a !== undefined)
				.shift())
			.map(el => el === undefined ? index++ : el);
	};
	const get_edges_duplicate_from_source_in_target = (target, source) => {
		const source_duplicates = {};
		const target_map = {};
		for (let i = 0; i < target.edges_vertices.length; i += 1) {
			target_map[`${target.edges_vertices[i][0]} ${target.edges_vertices[i][1]}`] = i;
			target_map[`${target.edges_vertices[i][1]} ${target.edges_vertices[i][0]}`] = i;
		}
		for (let i = 0; i < source.edges_vertices.length; i += 1) {
			const index = target_map[`${source.edges_vertices[i][0]} ${source.edges_vertices[i][1]}`];
			if (index !== undefined) {
				source_duplicates[i] = index;
			}
		}
		return source_duplicates;
	};
	const update_suffixes = (source, suffixes, keys, maps) => keys
		.forEach(geom => suffixes[geom]
			.forEach(key => source[key]
				.forEach((arr, i) => arr
					.forEach((el, j) => { source[key][i][j] = maps[geom][el]; }))));
	const assign = (target, source, epsilon = math.core.EPSILON) => {
		const prefixes = {};
		const suffixes = {};
		const maps = {};
		vef.forEach(key => {
			prefixes[key] = get_graph_keys_with_prefix(source, key);
			suffixes[key] = get_graph_keys_with_suffix(source, key);
		});
		vef.forEach(geom => prefixes[geom].filter(key => !target[key]).forEach(key => {
			target[key] = [];
		}));
		maps.vertices = make_vertices_map_and_consider_duplicates(target, source, epsilon);
		update_suffixes(source, suffixes, [_vertices], maps);
		const target_edges_count = count.edges(target);
		maps.edges = Array.from(Array(count.edges(source)))
			.map((_, i) => target_edges_count + i);
		const edge_dups = get_edges_duplicate_from_source_in_target(target, source);
		Object.keys(edge_dups).forEach(i => { maps.edges[i] = edge_dups[i]; });
		const target_faces_count = count.faces(target);
		maps.faces = Array.from(Array(count.faces(source)))
			.map((_, i) => target_faces_count + i);
		update_suffixes(source, suffixes, [_edges, _faces], maps);
		vef.forEach(geom => prefixes[geom].forEach(key => source[key].forEach((el, i) => {
			const new_index = maps[geom][i];
			target[key][new_index] = el;
		})));
		return maps;
	};

	const subgraph = (graph, components) => {
		const remove_indices = {};
		const sorted_components = {};
		[_faces, _edges, _vertices].forEach(key => {
			remove_indices[key] = Array.from(Array(count[key](graph))).map((_, i) => i);
			sorted_components[key] = unique_sorted_integers(components[key] || []).reverse();
		});
		Object.keys(sorted_components)
			.forEach(key => sorted_components[key]
				.forEach(i => remove_indices[key].splice(i, 1)));
		Object.keys(remove_indices)
			.forEach(key => remove_geometry_indices(graph, key, remove_indices[key]));
		return graph;
	};

	const get_boundary_vertices = ({ edges_vertices, edges_assignment }) => {
		const vertices = {};
		edges_vertices.forEach((v, i) => {
			const boundary = edges_assignment[i] === "B" || edges_assignment[i] === "b";
			if (!boundary) { return; }
			vertices[v[0]] = true;
			vertices[v[1]] = true;
		});
		return Object.keys(vertices).map(str => parseInt(str));
	};
	const empty_get_boundary = () => ({ vertices: [], edges: [] });
	const get_boundary = ({ vertices_edges, edges_vertices, edges_assignment }) => {
		if (edges_assignment === undefined) { return empty_get_boundary(); }
		if (!vertices_edges) {
			vertices_edges = make_vertices_edges_unsorted({ edges_vertices });
		}
		const edges_vertices_b = edges_assignment
			.map(a => a === "B" || a === "b");
		const edge_walk = [];
		const vertex_walk = [];
		let edgeIndex = -1;
		for (let i = 0; i < edges_vertices_b.length; i += 1) {
			if (edges_vertices_b[i]) { edgeIndex = i; break; }
		}
		if (edgeIndex === -1) { return empty_get_boundary(); }
		edges_vertices_b[edgeIndex] = false;
		edge_walk.push(edgeIndex);
		vertex_walk.push(edges_vertices[edgeIndex][0]);
		let nextVertex = edges_vertices[edgeIndex][1];
		while (vertex_walk[0] !== nextVertex) {
			vertex_walk.push(nextVertex);
			edgeIndex = vertices_edges[nextVertex]
				.filter(v => edges_vertices_b[v])
				.shift();
			if (edgeIndex === undefined) { return empty_get_boundary(); }
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
		};
	};
	const get_planar_boundary = ({ vertices_coords, vertices_edges, vertices_vertices, edges_vertices }) => {
		if (!vertices_vertices) {
			vertices_vertices = make_vertices_vertices({ vertices_coords, vertices_edges, edges_vertices });
		}
		const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
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
		let protection = 0;
		while (protection < 10000) {
			const next_neighbors = vertices_vertices[this_vertex_i];
			const from_neighbor_i = next_neighbors.indexOf(prev_vertex_i);
			const next_neighbor_i = (from_neighbor_i + 1) % next_neighbors.length;
			const next_vertex_i = next_neighbors[next_neighbor_i];
			const next_edge_lookup = this_vertex_i < next_vertex_i
				? `${this_vertex_i} ${next_vertex_i}`
				: `${next_vertex_i} ${this_vertex_i}`;
			const next_edge_i = edge_map[next_edge_lookup];
			if (next_edge_i === edge_walk[0]) {
				return walk;
			}
			vertex_walk.push(this_vertex_i);
			edge_walk.push(next_edge_i);
			prev_vertex_i = this_vertex_i;
			this_vertex_i = next_vertex_i;
			protection += 1;
		}
		console.warn("calculate boundary potentially entered infinite loop");
		return walk;
	};

	var boundary = /*#__PURE__*/Object.freeze({
		__proto__: null,
		get_boundary_vertices: get_boundary_vertices,
		get_boundary: get_boundary,
		get_planar_boundary: get_planar_boundary
	});

	const apply_matrix_to_graph = function (graph, matrix) {
		filter_keys_with_suffix(graph, "coords").forEach((key) => {
			graph[key] = graph[key]
				.map(v => math.core.resize(3, v))
				.map(v => math.core.multiply_matrix3_vector3(matrix, v));
		});
		filter_keys_with_suffix(graph, "matrix").forEach((key) => {
			graph[key] = graph[key]
				.map(m => math.core.multiply_matrices3(m, matrix));
		});
		return graph;
	};
	const transform_scale = (graph, scale, ...args) => {
		const vector = math.core.get_vector(...args);
		const vector3 = math.core.resize(3, vector);
		const matrix = math.core.make_matrix3_scale(scale, vector3);
		return apply_matrix_to_graph(graph, matrix);
	};
	const transform_translate = (graph, ...args) => {
		const vector = math.core.get_vector(...args);
		const vector3 = math.core.resize(3, vector);
		const matrix = math.core.make_matrix3_translate(...vector3);
		return apply_matrix_to_graph(graph, matrix);
	};
	const transform_rotateZ = (graph, angle, ...args) => {
		const vector = math.core.get_vector(...args);
		const vector3 = math.core.resize(3, vector);
		const matrix = math.core.make_matrix3_rotateZ(angle, ...vector3);
		return apply_matrix_to_graph(graph, matrix);
	};
	var transform = {
		scale: transform_scale,
		translate: transform_translate,
		rotateZ: transform_rotateZ,
		transform: apply_matrix_to_graph,
	};

	const get_face_face_shared_vertices = (face_a_vertices, face_b_vertices) => {
		const hash = {};
		face_b_vertices.forEach((v) => { hash[v] = true; });
		const match = face_a_vertices.map(v => hash[v] ? true : false);
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
	};
	const make_face_spanning_tree = ({ faces_vertices, faces_faces }, root_face = 0) => {
		if (!faces_faces) {
			faces_faces = make_faces_faces({ faces_vertices });
		}
		if (faces_faces.length === 0) { return []; }
		const tree = [[{ face: root_face }]];
		const visited_faces = {};
		visited_faces[root_face] = true;
		do {
			const next_level_with_duplicates = tree[tree.length - 1]
				.map(current => faces_faces[current.face]
					.map(face => ({ face, parent: current.face })))
				.reduce((a, b) => a.concat(b), []);
			const dup_indices = {};
			next_level_with_duplicates.forEach((el, i) => {
				if (visited_faces[el.face]) { dup_indices[i] = true; }
				visited_faces[el.face] = true;
			});
			const next_level = next_level_with_duplicates
				.filter((_, i) => !dup_indices[i]);
			next_level
				.map(el => get_face_face_shared_vertices(
					faces_vertices[el.face],
					faces_vertices[el.parent]
				)).forEach((ev, i) => {
					const edge_vertices = ev.slice(0, 2);
					next_level[i].edge_vertices = edge_vertices;
				});
			tree[tree.length] = next_level;
		} while (tree[tree.length - 1].length > 0);
		if (tree.length > 0 && tree[tree.length - 1].length === 0) {
			tree.pop();
		}
		return tree;
	};

	var face_spanning_tree = /*#__PURE__*/Object.freeze({
		__proto__: null,
		get_face_face_shared_vertices: get_face_face_shared_vertices,
		make_face_spanning_tree: make_face_spanning_tree
	});

	const multiply_vertices_faces_matrix2 = ({ vertices_coords, vertices_faces, faces_vertices }, faces_matrix) => {
		if (!vertices_faces) {
			vertices_faces = make_vertices_faces({ faces_vertices });
		}
		const vertices_matrix = vertices_faces
			.map(faces => faces
				.filter(a => a != null)
				.shift())
			.map(face => face === undefined
				? math.core.identity2x3
				: faces_matrix[face]);
		return vertices_coords
			.map((coord, i) => math.core.multiply_matrix2_vector2(vertices_matrix[i], coord));
	};
	const unassigned_angle = { U: true, u: true };
	const make_faces_matrix = ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces }, root_face = 0) => {
		if (!edges_assignment && edges_foldAngle) {
			edges_assignment = make_edges_assignment({ edges_foldAngle });
		}
		if (!edges_foldAngle) {
			if (edges_assignment) {
				edges_foldAngle = make_edges_foldAngle({ edges_assignment });
			} else {
				edges_foldAngle = Array(edges_vertices.length).fill(0);
			}
		}
		const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
		const faces_matrix = faces_vertices.map(() => math.core.identity3x4);
		make_face_spanning_tree({ faces_vertices, faces_faces }, root_face)
			.slice(1)
			.forEach(level => level
				.forEach((entry) => {
					const coords = entry.edge_vertices.map(v => vertices_coords[v]);
					const edgeKey = entry.edge_vertices.join(" ");
					const edge = edge_map[edgeKey];
					const foldAngle = unassigned_angle[edges_assignment[edge]]
						? Math.PI
						: edges_foldAngle[edge] * Math.PI / 180;
					const local_matrix = math.core.make_matrix3_rotate(
						foldAngle,
						math.core.subtract(...math.core.resize_up(coords[1], coords[0])),
						coords[0],
					);
					faces_matrix[entry.face] = math.core
						.multiply_matrices3(faces_matrix[entry.parent], local_matrix);
				}));
		return faces_matrix;
	};
	const assignment_is_folded = {
		M: true, m: true, V: true, v: true, U: true, u: true,
		F: false, f: false, B: false, b: false,
	};
	const make_edges_is_flat_folded = ({ edges_vertices, edges_foldAngle, edges_assignment}) => {
		if (edges_assignment === undefined) {
			return edges_foldAngle === undefined
				? edges_vertices.map(_ => true)
				: edges_foldAngle.map(angle => angle < 0 || angle > 0);
		}
		return edges_assignment.map(a => assignment_is_folded[a]);
	};
	const make_faces_matrix2 = ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces }, root_face = 0) => {
		if (!edges_foldAngle) {
			if (edges_assignment) {
				edges_foldAngle = make_edges_foldAngle({ edges_assignment });
			} else {
				edges_foldAngle = Array(edges_vertices.length).fill(0);
			}
		}
		const edges_is_folded = make_edges_is_flat_folded({ edges_vertices, edges_foldAngle, edges_assignment });
		const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
		const faces_matrix = faces_vertices.map(() => math.core.identity2x3);
		make_face_spanning_tree({ faces_vertices, faces_faces }, root_face)
			.slice(1)
			.forEach(level => level
				.forEach((entry) => {
					const coords = entry.edge_vertices.map(v => vertices_coords[v]);
					const edgeKey = entry.edge_vertices.join(" ");
					const edge = edge_map[edgeKey];
					const reflect_vector = math.core.subtract2(coords[1], coords[0]);
					const reflect_origin = coords[0];
					const local_matrix = edges_is_folded[edge]
						? math.core.make_matrix2_reflect(reflect_vector, reflect_origin)
						: math.core.identity2x3;
					faces_matrix[entry.face] = math.core
						.multiply_matrices2(faces_matrix[entry.parent], local_matrix);
				}));
		return faces_matrix;
	};

	var faces_matrix = /*#__PURE__*/Object.freeze({
		__proto__: null,
		multiply_vertices_faces_matrix2: multiply_vertices_faces_matrix2,
		make_faces_matrix: make_faces_matrix,
		make_edges_is_flat_folded: make_edges_is_flat_folded,
		make_faces_matrix2: make_faces_matrix2
	});

	const make_vertices_coords_folded = ({ vertices_coords, vertices_faces, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces, faces_matrix }, root_face) => {
		faces_matrix = make_faces_matrix({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces }, root_face);
		if (!vertices_faces) {
			vertices_faces = make_vertices_faces({ faces_vertices });
		}
		const vertices_matrix = vertices_faces
			.map(faces => faces
				.filter(a => a != null)
				.shift())
			.map(face => face === undefined
				? math.core.identity3x4
				: faces_matrix[face]);
		return vertices_coords
			.map(coord => math.core.resize(3, coord))
			.map((coord, i) => math.core.multiply_matrix3_vector3(vertices_matrix[i], coord));
	};
	const make_vertices_coords_flat_folded = ({ vertices_coords, edges_vertices, edges_foldAngle, edges_assignment, faces_vertices, faces_faces }, root_face = 0) => {
		const edges_is_folded = make_edges_is_flat_folded({ edges_vertices, edges_foldAngle, edges_assignment });
		const vertices_coords_folded = [];
		faces_vertices[root_face]
			.forEach(v => { vertices_coords_folded[v] = [...vertices_coords[v]]; });
		const faces_flipped = [];
		faces_flipped[root_face] = false;
		const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
		make_face_spanning_tree({ faces_vertices, faces_faces }, root_face)
			.slice(1)
			.forEach((level, l) => level
				.forEach(entry => {
					const edge_key = entry.edge_vertices.join(" ");
					const edge = edge_map[edge_key];
					const coords = edges_vertices[edge].map(v => vertices_coords_folded[v]);
					if (coords[0] === undefined || coords[1] === undefined) { return; }
					const coords_cp = edges_vertices[edge].map(v => vertices_coords[v]);
					const origin_cp = coords_cp[0];
					const vector_cp = math.core.normalize2(math.core.subtract2(coords_cp[1], coords_cp[0]));
					const normal_cp = math.core.rotate90(vector_cp);
					faces_flipped[entry.face] = edges_is_folded[edge]
						? !faces_flipped[entry.parent]
						: faces_flipped[entry.parent];
					const vector_folded = math.core.normalize2(math.core.subtract2(coords[1], coords[0]));
					const origin_folded = coords[0];
					const normal_folded = faces_flipped[entry.face]
						? math.core.rotate270(vector_folded)
						: math.core.rotate90(vector_folded);
					faces_vertices[entry.face]
						.filter(v => vertices_coords_folded[v] === undefined)
						.forEach(v => {
							const coords_cp = vertices_coords[v];
							const to_point = math.core.subtract2(coords_cp, origin_cp);
							const project_norm = math.core.dot(to_point, normal_cp);
							const project_line = math.core.dot(to_point, vector_cp);
							const walk_up = math.core.scale2(vector_folded, project_line);
							const walk_perp = math.core.scale2(normal_folded, project_norm);
							const folded_coords = math.core.add2(math.core.add2(origin_folded, walk_up), walk_perp);
							vertices_coords_folded[v] = folded_coords;
						});
				}));
		return vertices_coords_folded;
	};

	var vertices_coords_folded = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make_vertices_coords_folded: make_vertices_coords_folded,
		make_vertices_coords_flat_folded: make_vertices_coords_flat_folded
	});

	const make_faces_winding_from_matrix = faces_matrix => faces_matrix
		.map(m => m[0] * m[4] - m[1] * m[3])
		.map(c => c >= 0);
	const make_faces_winding_from_matrix2 = faces_matrix => faces_matrix
		.map(m => m[0] * m[3] - m[1] * m[2])
		.map(c => c >= 0);
	const make_faces_winding = ({ vertices_coords, faces_vertices }) => {
		return faces_vertices
			.map(vertices => vertices
				.map(v => vertices_coords[v])
				.map((point, i, arr) => [point, arr[(i + 1) % arr.length]])
				.map(pts => (pts[1][0] - pts[0][0]) * (pts[1][1] + pts[0][1]) )
				.reduce((a, b) => a + b, 0))
			.map(face => face < 0);
	};

	var faces_winding = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make_faces_winding_from_matrix: make_faces_winding_from_matrix,
		make_faces_winding_from_matrix2: make_faces_winding_from_matrix2,
		make_faces_winding: make_faces_winding
	});

	const explode_faces = (graph) => {
		const vertices_coords = graph.faces_vertices
			.map(face => face.map(v => graph.vertices_coords[v]))
			.reduce((a, b) => a.concat(b), []);
		let i = 0;
		const faces_vertices = graph.faces_vertices
			.map(face => face.map(v => i++));
		return {
			vertices_coords: JSON.parse(JSON.stringify(vertices_coords)),
			faces_vertices,
		};
	};
	const explode_shrink_faces = ({ vertices_coords, faces_vertices }, shrink = 0.333) => {
		const graph = explode_faces({ vertices_coords, faces_vertices });
		const faces_winding = make_faces_winding(graph);
		const faces_vectors = graph.faces_vertices
			.map(vertices => vertices.map(v => graph.vertices_coords[v]))
			.map(points => points.map((p, i, arr) => math.core.subtract2(p, arr[(i+1) % arr.length])));
		const faces_centers = make_faces_center_quick({ vertices_coords, faces_vertices });
		const faces_point_distances = faces_vertices
			.map(vertices => vertices.map(v => vertices_coords[v]))
			.map((points, f) => points
				.map(point => math.core.distance2(point, faces_centers[f])));
		console.log("faces_point_distances", faces_point_distances);
		const faces_bisectors = faces_vectors
			.map((vectors, f) => vectors
				.map((vector, i, arr) => [
					vector,
					math.core.flip(arr[(i - 1 + arr.length) % arr.length])
				]).map(pair => faces_winding[f]
					? math.core.counter_clockwise_bisect2(...pair)
					: math.core.clockwise_bisect2(...pair)))
			.map((vectors, f) => vectors
				.map((vector, i) => math.core.scale(vector, faces_point_distances[f][i])));
		graph.faces_vertices
			.forEach((vertices, f) => vertices
				.forEach((v, i) => {
					graph.vertices_coords[v] = math.core.add2(
						graph.vertices_coords[v],
						math.core.scale2(faces_bisectors[f][i], -shrink),
					);
				}));
		return graph;
	};

	var explode_faces_methods = /*#__PURE__*/Object.freeze({
		__proto__: null,
		explode_faces: explode_faces,
		explode_shrink_faces: explode_shrink_faces
	});

	const nearest_vertex = ({ vertices_coords }, point) => {
		if (!vertices_coords) { return undefined; }
		const p = math.core.resize(vertices_coords[0].length, point);
		const nearest = vertices_coords
			.map((v, i) => ({ d: math.core.distance(p, v), i }))
			.sort((a, b) => a.d - b.d)
			.shift();
		return nearest ? nearest.i : undefined;
	};
	const nearest_edge = ({ vertices_coords, edges_vertices }, point) => {
		if (!vertices_coords || !edges_vertices) { return undefined; }
		const nearest_points = edges_vertices
			.map(e => e.map(ev => vertices_coords[ev]))
			.map(e => math.core.nearest_point_on_line(
				math.core.subtract(e[1], e[0]),
				e[0],
				point,
				math.core.segment_limiter));
		return math.core.smallest_comparison_search(point, nearest_points, math.core.distance);
	};
	const face_containing_point = ({ vertices_coords, faces_vertices }, point) => {
		if (!vertices_coords || !faces_vertices) { return undefined; }
		const face = faces_vertices
			.map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
			.filter(f => math.core.overlap_convex_polygon_point(f.face, point))
			.shift();
		return (face === undefined ? undefined : face.i);
	};
	const nearest_face = (graph, point) => {
		const face = face_containing_point(graph, point);
		if (face !== undefined) { return face; }
		if (graph.edges_faces) {
			const edge = nearest_edge(graph, point);
			const faces = graph.edges_faces[edge];
			if (faces.length === 1) { return faces[0]; }
			if (faces.length > 1) {
				const faces_center = make_faces_center_quick({
					vertices_coords: graph.vertices_coords,
					faces_vertices: faces.map(f => graph.faces_vertices[f])
				});
				const distances = faces_center
					.map(center => math.core.distance(center, point));
				let shortest = 0;
				for (let i = 0; i < distances.length; i++) {
					if (distances[i] < distances[shortest]) { shortest = i; }
				}
				return faces[shortest];
			}
		}
	};

	var nearest = /*#__PURE__*/Object.freeze({
		__proto__: null,
		nearest_vertex: nearest_vertex,
		nearest_edge: nearest_edge,
		face_containing_point: face_containing_point,
		nearest_face: nearest_face
	});

	const clone = function (o) {
		let newO;
		let i;
		if (typeof o !== _object) {
			return o;
		}
		if (!o) {
			return o;
		}
		if (Object.prototype.toString.apply(o) === "[object Array]") {
			newO = [];
			for (i = 0; i < o.length; i += 1) {
				newO[i] = clone(o[i]);
			}
			return newO;
		}
		newO = {};
		for (i in o) {
			if (o.hasOwnProperty(i)) {
				newO[i] = clone(o[i]);
			}
		}
		return newO;
	};

	const find_adjacent_faces_to_edge = ({ vertices_faces, edges_vertices, edges_faces, faces_edges, faces_vertices }, edge) => {
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
			let faces = [];
			for (let i = 0; i < faces_edges.length; i += 1) {
				for (let e = 0; e < faces_edges[i].length; e += 1) {
					if (faces_edges[i][e] === edge) { faces.push(i); }
				}
			}
			return faces;
		}
		if (faces_vertices) {
			console.warn("todo: find_adjacent_faces_to_edge");
		}
	};

	const split_edge_into_two = (graph, edge_index, new_vertex) => {
		const edge_vertices = graph.edges_vertices[edge_index];
		const new_edges = [
			{ edges_vertices: [edge_vertices[0], new_vertex] },
			{ edges_vertices: [new_vertex, edge_vertices[1]] },
		];
		new_edges.forEach((edge, i) => [_edges_assignment, _edges_foldAngle]
			.filter(key => graph[key] && graph[key][edge_index] !== undefined)
			.forEach(key => { edge[key] = graph[key][edge_index]; }));
		if (graph.vertices_coords && (graph.edges_length || graph.edges_vector)) {
			const coords = new_edges
				.map(edge => edge.edges_vertices
					.map(v => graph.vertices_coords[v]));
			if (graph.edges_vector) {
				new_edges.forEach((edge, i) => {
					edge.edges_vector = math.core.subtract(coords[i][1], coords[i][0]);
				});
			}
			if (graph.edges_length) {
				new_edges.forEach((edge, i) => {
					edge.edges_length = math.core.distance2(...coords[i]);
				});
			}
		}
		return new_edges;
	};

	const update_vertices_vertices$2 = ({ vertices_vertices }, vertex, incident_vertices) => {
		if (!vertices_vertices) { return; }
		vertices_vertices[vertex] = [...incident_vertices];
		incident_vertices.forEach((v, i, arr) => {
			const otherV = arr[(i + 1) % arr.length];
			const otherI = vertices_vertices[v].indexOf(otherV);
			vertices_vertices[v][otherI] = vertex;
		});
	};
	const update_vertices_sectors = ({ vertices_coords, vertices_vertices, vertices_sectors }, vertex) => {
		if (!vertices_sectors) { return; }
		vertices_sectors[vertex] = vertices_vertices[vertex].length === 1
			? [math.core.TWO_PI]
			: math.core.counter_clockwise_sectors2(vertices_vertices[vertex]
				.map(v => math.core
					.subtract2(vertices_coords[v], vertices_coords[vertex])));
	};
	const update_vertices_edges$2 = ({ vertices_edges }, old_edge, new_vertex, vertices, new_edges) => {
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
		new_edges.forEach(edge => edges_faces[edge] = [...faces]);
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
	const update_faces_edges_with_vertices = ({ edges_vertices, faces_vertices, faces_edges }, faces) => {
		const edge_map = make_vertices_to_edge_bidirectional({ edges_vertices });
		faces
			.map(f => faces_vertices[f]
				.map((vertex, i, arr) => [vertex, arr[(i + 1) % arr.length]])
				.map(pair => edge_map[pair.join(" ")]))
			.forEach((edges, i) => { faces_edges[faces[i]] = edges; });
	};

	const split_edge = (graph, old_edge, coords, epsilon = math.core.EPSILON) => {
		if (graph.edges_vertices.length < old_edge) { return {}; }
		const incident_vertices = graph.edges_vertices[old_edge];
		if (!coords) {
			coords = math.core.midpoint(...incident_vertices);
		}
		const similar = incident_vertices
			.map(v => graph.vertices_coords[v])
			.map(vert => math.core.distance(vert, coords) < epsilon);
		if (similar[0]) { return { vertex: incident_vertices[0], edges: {} }; }
		if (similar[1]) { return { vertex: incident_vertices[1], edges: {} }; }
		const vertex = graph.vertices_coords.length;
		graph.vertices_coords[vertex] = coords;
		const new_edges = [0, 1].map(i => i + graph.edges_vertices.length);
		split_edge_into_two(graph, old_edge, vertex)
			.forEach((edge, i) => Object.keys(edge)
				.forEach((key) => { graph[key][new_edges[i]] = edge[key]; }));
		update_vertices_vertices$2(graph, vertex, incident_vertices);
		update_vertices_sectors(graph, vertex);
		update_vertices_edges$2(graph, old_edge, vertex, incident_vertices, new_edges);
		const incident_faces = find_adjacent_faces_to_edge(graph, old_edge);
		if (incident_faces) {
			update_vertices_faces$1(graph, vertex, incident_faces);
			update_edges_faces$1(graph, new_edges, incident_faces);
			update_faces_vertices(graph, vertex, incident_vertices, incident_faces);
			update_faces_edges_with_vertices(graph, incident_faces);
		}
		const edge_map = remove_geometry_indices(graph, _edges, [ old_edge ]);
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
	};

	const make_edge = ({ vertices_coords }, vertices, face) => {
		const new_edge_coords = vertices
			.map(v => vertices_coords[v])
			.reverse();
		return {
			edges_vertices: [...vertices],
			edges_foldAngle: 0,
			edges_assignment: "U",
			edges_length: math.core.distance2(...new_edge_coords),
			edges_vector: math.core.subtract(...new_edge_coords),
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
	};

	const make_faces = ({ edges_vertices, faces_vertices, faces_edges, faces_faces }, face, vertices) => {
		const indices = vertices.map(el => faces_vertices[face].indexOf(el));
		const faces = split_circular_array(faces_vertices[face], indices)
			.map(fv => ({ faces_vertices: fv }));
		if (faces_edges) {
			const vertices_to_edge = make_vertices_to_edge_bidirectional({ edges_vertices });
			faces.map(face => face.faces_vertices
					.map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
					.map(key => vertices_to_edge[key]))
				.forEach((face_edges, i) => { faces[i].faces_edges = face_edges; });
		}
		return faces;
	};
	const build_faces = (graph, face, vertices) => {
		const faces = [0, 1].map(i => graph.faces_vertices.length + i);
		make_faces(graph, face, vertices)
			.forEach((face, i) => Object.keys(face)
				.forEach((key) => { graph[key][faces[i]] = face[key]; }));
		return faces;
	};

	const split_at_intersections = (graph, { vertices, edges }) => {
		let map;
		const split_results = edges.map((el) => {
			const res = split_edge(graph, map ? map[el.edge] : el.edge, el.coords);
			map = map ? merge_nextmaps(map, res.edges.map) : res.edges.map;
			return res;
		});
		vertices.push(...split_results.map(res => res.vertex));
		let bkmap;
		split_results.forEach(res => {
			res.edges.remove = bkmap ? bkmap[res.edges.remove] : res.edges.remove;
			const inverted = invert_simple_map(res.edges.map);
			bkmap = bkmap ? merge_backmaps(bkmap, inverted) : inverted;
		});
		return {
			vertices,
			edges: {
				map,
				remove: split_results.map(res => res.edges.remove),
			}
		};
	};

	const warning = "split_face potentially given a non-convex face";
	const update_vertices_vertices$1 = ({ vertices_coords, vertices_vertices, edges_vertices }, edge) => {
		const v0 = edges_vertices[edge][0];
		const v1 = edges_vertices[edge][1];
		vertices_vertices[v0] = sort_vertices_counter_clockwise({ vertices_coords }, vertices_vertices[v0].concat(v1), v0);
		vertices_vertices[v1] = sort_vertices_counter_clockwise({ vertices_coords }, vertices_vertices[v1].concat(v0), v1);
	};
	const update_vertices_edges$1 = ({ edges_vertices, vertices_edges, vertices_vertices }, edge) => {
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
			.forEach((f, i) => graph.faces_vertices[f]
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
				console.warn(warning);
				return;
			}
			graph.vertices_faces[v].splice(index, 1, ...replacements);
		});
	};
	const update_edges_faces = (graph, old_face, new_edge, new_faces) => {
		const edges_replacement_faces = {};
		new_faces
			.forEach((f, i) => graph.faces_edges[f]
				.forEach(e => {
					if (!edges_replacement_faces[e]) { edges_replacement_faces[e] = []; }
					edges_replacement_faces[e].push(f);
				}));
		const edges = [...graph.faces_edges[old_face], new_edge];
		edges.forEach(e => {
			const replacements = edges_replacement_faces[e];
			const indices = [];
			for (let i = 0; i < graph.edges_faces[e].length; i++) {
				if (graph.edges_faces[e][i] === old_face) { indices.push(i); }
			}
			if (indices.length === 0 || !replacements) {
				console.warn(warning);
				return;
			}
			indices.reverse().forEach(index => graph.edges_faces[e].splice(index, 1));
			const index = indices[indices.length - 1];
			graph.edges_faces[e].splice(index, 0, ...replacements);
		});
	};
	const update_faces_faces = ({ faces_vertices, faces_faces }, old_face, new_faces) => {
		const incident_faces = faces_faces[old_face];
		const new_faces_vertices = new_faces.map(f => faces_vertices[f]);
		const incident_face_face = incident_faces.map((f, i) => {
			const incident_face_vertices = faces_vertices[f];
			const score = [0, 0];
			for (let n = 0; n < new_faces_vertices.length; n++) {
				let count = 0;
				for (let j = 0; j < incident_face_vertices.length; j++) {
					if (new_faces_vertices[n].indexOf(incident_face_vertices[j]) !== -1) {
						count++;
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
			for (let j = 0; j < faces_faces[f].length; j++) {
				if (faces_faces[f][j] === old_face) {
					faces_faces[f][j] = incident_face_face[i];
					faces_faces[incident_face_face[i]].push(f);
				}
			}
		});
	};

	const split_convex_face = (graph, face, vector, point, epsilon) => {
		const intersect = intersect_convex_face_line(graph, face, vector, point, epsilon);
		if (intersect === undefined) { return undefined; }
		const result = split_at_intersections(graph, intersect);
		result.edges.new = rebuild_edge(graph, face, result.vertices);
		update_vertices_vertices$1(graph, result.edges.new);
		update_vertices_edges$1(graph, result.edges.new);
		const faces = build_faces(graph, face, result.vertices);
		update_vertices_faces(graph, face, faces);
		update_edges_faces(graph, face, result.edges.new, faces);
		update_faces_faces(graph, face, faces);
		const faces_map = remove_geometry_indices(graph, _faces, [face]);
		faces.forEach((_, i) => { faces[i] = faces_map[faces[i]]; });
		faces_map.splice(-2);
		faces_map[face] = faces;
		result.faces = {
			map: faces_map,
			new: faces,
			remove: face,
		};
		return result;
	};

	const Graph = {};
	Graph.prototype = Object.create(Object.prototype);
	Graph.prototype.constructor = Graph;
	const graphMethods = Object.assign({
		clean,
		validate,
		populate,
		fragment,
		subgraph,
		assign,
		addVertices: add_vertices,
		splitEdge: split_edge,
		faceSpanningTree: make_face_spanning_tree,
		explodeFaces: explode_faces,
		explodeShrinkFaces: explode_shrink_faces,
	},
		transform,
	);
	Object.keys(graphMethods).forEach(key => {
		Graph.prototype[key] = function () {
			return graphMethods[key](this, ...arguments);
		};
	});
	Graph.prototype.splitFace = function (face, ...args) {
		const line = math.core.get_line(...args);
		return split_convex_face(this, face, line.vector, line.origin);
	};
	Graph.prototype.copy = function () {
		return Object.assign(Object.create(this.__proto__), clone(this));
	};
	Graph.prototype.clear = function () {
		fold_keys.graph.forEach(key => delete this[key]);
		fold_keys.orders.forEach(key => delete this[key]);
		delete this.file_frames;
		return this;
	};
	Graph.prototype.boundingBox = function () {
		return math.rect.fromPoints(this.vertices_coords);
	};
	Graph.prototype.unitize = function () {
		if (!this.vertices_coords) { return; }
		const box = math.core.bounding_box(this.vertices_coords);
		const longest = Math.max(...box.span);
		const scale = longest === 0 ? 1 : (1 / longest);
		const origin = box.min;
		this.vertices_coords = this.vertices_coords
			.map(coord => math.core.subtract(coord, origin))
			.map(coord => coord.map((n, i) => n * scale));
		return this;
	};
	Graph.prototype.folded = function () {
		const vertices_coords = this.faces_matrix2
			? multiply_vertices_faces_matrix2(this, this.faces_matrix2)
			: make_vertices_coords_folded(this, ...arguments);
		return Object.assign(
			Object.create(this.__proto__),
			Object.assign(clone(this), {
				vertices_coords,
				frame_classes: [_foldedForm]
			}));
	};
	Graph.prototype.flatFolded = function () {
		const vertices_coords = this.faces_matrix2
			? multiply_vertices_faces_matrix2(this, this.faces_matrix2)
			: make_vertices_coords_flat_folded(this, ...arguments);
		return Object.assign(
			Object.create(this.__proto__),
			Object.assign(clone(this), {
				vertices_coords,
				frame_classes: [_foldedForm]
			}));
	};
	const shortenKeys = function (el, i, arr) {
		const object = Object.create(null);
		Object.keys(el).forEach((k) => {
			object[k.substring(this.length + 1)] = el[k];
		});
		return object;
	};
	const getComponent = function (key) {
		return transpose_graph_arrays(this, key)
			.map(shortenKeys.bind(key))
			.map(setup[key].bind(this));
	};
	[_vertices, _edges, _faces]
		.forEach(key => Object.defineProperty(Graph.prototype, key, {
			enumerable: true,
			get: function () { return getComponent.call(this, key); }
		}));
	Object.defineProperty(Graph.prototype, _boundary, {
		enumerable: true,
		get: function () {
			const boundary = get_boundary(this);
			const poly = math.polygon(boundary.vertices.map(v => this.vertices_coords[v]));
			Object.keys(boundary).forEach(key => { poly[key] = boundary[key]; });
			return Object.assign(poly, boundary);
		}
	});
	const nearestMethods = {
		vertices: nearest_vertex,
		edges: nearest_edge,
		faces: nearest_face,
	};
	Graph.prototype.nearest = function () {
		const point = math.core.get_vector(arguments);
		const nears = Object.create(null);
		const cache = {};
		[_vertices, _edges, _faces].forEach(key => {
			Object.defineProperty(nears, singularize[key], {
				enumerable: true,
				get: () => {
					if (cache[key] !== undefined) { return cache[key]; }
					cache[key] = nearestMethods[key](this, point);
					return cache[key];
				}
			});
			filter_keys_with_prefix(this, key).forEach(fold_key =>
				Object.defineProperty(nears, fold_key, {
					enumerable: true,
					get: () => this[fold_key][nears[singularize[key]]]
				}));
		});
		return nears;
	};
	var GraphProto = Graph.prototype;

	const clip = function (
		{vertices_coords, vertices_edges, edges_vertices, edges_assignment, boundaries_vertices},
		line) {
		if (!boundaries_vertices) {
			boundaries_vertices = get_boundary({
				vertices_edges, edges_vertices, edges_assignment
			}).vertices;
		}
		return math.polygon(boundaries_vertices.map(v => vertices_coords[v]))
			.clip(line);
	};

	const add_edges = (graph, edges_vertices) => {
		if (!graph.edges_vertices) { graph.edges_vertices = []; }
		if (typeof edges_vertices[0] === "number") { edges_vertices = [edges_vertices]; }
		const indices = edges_vertices.map((_, i) => graph.edges_vertices.length + i);
		graph.edges_vertices.push(...edges_vertices);
		const index_map = remove_duplicate_edges(graph).map;
		return indices.map(i => index_map[i]);
	};

	const add_segment_edges = (graph, segment_vertices, pre_edge_map) => {
		const unfiltered_segment_edges_vertices = Array
			.from(Array(segment_vertices.length - 1))
			.map((_, i) => [segment_vertices[i], segment_vertices[i + 1]]);
		const seg_not_exist_yet = unfiltered_segment_edges_vertices
			.map(verts => verts.join(" "))
			.map((str, i) => pre_edge_map[str] === undefined);
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
		for (let i = 0; i < segment_vertices.length; i++) {
			const vertex = segment_vertices[i];
			const prev = seg_not_exist_yet[i - 1] ? segment_vertices[i - 1] : undefined;
			const next = seg_not_exist_yet[i] ? segment_vertices[i + 1] : undefined;
			const new_adjacent_vertices = [prev, next].filter(a => a !== undefined);
			const previous_vertices_vertices = graph.vertices_vertices[vertex]
				? graph.vertices_vertices[vertex] : [];
			const unsorted_vertices_vertices = previous_vertices_vertices
				.concat(new_adjacent_vertices);
			graph.vertices_vertices[vertex] = sort_vertices_counter_clockwise(
				graph, unsorted_vertices_vertices, segment_vertices[i]);
		}
		const edge_map = make_vertices_to_edge_bidirectional(graph);
		for (let i = 0; i < segment_vertices.length; i++) {
			const vertex = segment_vertices[i];
			graph.vertices_edges[vertex] = graph.vertices_vertices[vertex]
				.map(v => edge_map[`${vertex} ${v}`]);
		}
		segment_vertices
			.map(center => graph.vertices_vertices[center].length === 1
			? [math.core.TWO_PI]
			: math.core.counter_clockwise_sectors2(graph.vertices_vertices[center]
				.map(v => math.core
					.subtract2(graph.vertices_coords[v], graph.vertices_coords[center]))))
			.forEach((sectors, i) => {
				graph.vertices_sectors[segment_vertices[i]] = sectors;
			});
		return segment_edges;
	};
	const add_planar_segment = (graph, point1, point2, epsilon = math.core.EPSILON) => {
		if (!graph.vertices_sectors) {
			graph.vertices_sectors = make_vertices_sectors(graph);
		}
		const segment = [point1, point2].map(p => [p[0], p[1]]);
		const segment_vector = math.core.subtract2(segment[1], segment[0]);
		const intersections = make_edges_segment_intersection(
			graph, segment[0], segment[1], epsilon);
		const intersected_edges = intersections
			.map((pt, e) => pt === undefined ? undefined : e)
			.filter(a => a !== undefined)
			.sort((a, b) => a - b);
		const faces_map = {};
		intersected_edges
			.forEach(e => graph.edges_faces[e]
				.forEach(f => { faces_map[f] = true; }));
		const intersected_faces = Object.keys(faces_map)
			.map(s => parseInt(s))
			.sort((a, b) => a - b);
		const split_edge_results = intersected_edges
			.reverse()
			.map(edge => split_edge(graph, edge, intersections[edge], epsilon));
		const split_edge_vertices = split_edge_results.map(el => el.vertex);
		const endpoint_vertices = add_vertices(graph, segment, epsilon);
		const new_vertex_hash = {};
		split_edge_vertices.forEach(v => { new_vertex_hash[v] = true; });
		endpoint_vertices.forEach(v => { new_vertex_hash[v] = true; });
		const new_vertices = Object.keys(new_vertex_hash).map(n => parseInt(n));
		const segment_vertices = sort_vertices_along_vector(graph, new_vertices, segment_vector);
		const edge_map = make_vertices_to_edge_bidirectional(graph);
		const segment_edges = add_segment_edges(graph, segment_vertices, edge_map);
		segment_edges.forEach(e => {
			const v = graph.edges_vertices[e];
			edge_map[`${v[0]} ${v[1]}`] = e;
			edge_map[`${v[1]} ${v[0]}`] = e;
		});
		const face_walk_start_pairs = segment_vertices
			.map((v, i) => graph.vertices_vertices[v]
				.map(adj_v => [[adj_v, v], [v, adj_v]]))
			.reduce((a, b) => a.concat(b), [])
			.reduce((a, b) => a.concat(b), []);
		const walked_edges = {};
		const all_walked_faces = face_walk_start_pairs
			.map(pair => counter_clockwise_walk(graph, pair[0], pair[1], walked_edges))
			.filter(a => a !== undefined);
		const walked_faces = filter_walked_boundary_face(all_walked_faces);
		remove_geometry_indices(graph, "faces", intersected_faces);
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
			graph.vertices_faces = make_vertices_faces(graph);
		}
		if (graph.edges_faces) {
			graph.edges_faces = make_edges_faces_unsorted(graph);
		}
		if (graph.faces_faces) {
			graph.faces_faces = make_faces_faces(graph);
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
	};

	const update_vertices_vertices = ({ vertices_vertices }, vertices) => {
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
		[faces[1], faces[0]];
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
		if (faces_vertices_index[0] === undefined || faces_vertices_index[1] === undefined) { console.warn("remove_planar_edge error joining faces"); }
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
	const remove_planar_edge = (graph, edge) => {
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
						already_added ? arr.splice(i, 1) : arr.splice(i, 1, new_face);
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
			remove_geometry_indices(graph, "faces", faces);
		}
		if (faces.length === 2 && faces[0] === faces[1] && remove_vertices.length) {
			const face = faces[0];
			graph.faces_vertices[face] = graph.faces_vertices[face]
				.filter(v => !remove_vertices.includes(v))
				.filter((v, i, arr) => v !== arr[(i+1)%arr.length]);
			graph.faces_edges[face] = graph.faces_edges[face]
				.filter(e => e !== edge);
		}
		remove_geometry_indices(graph, "edges", [edge]);
		remove_geometry_indices(graph, "vertices", remove_vertices);
	};

	const get_opposite_vertices = (graph, vertex, edges) => {
		edges.forEach(edge => {
			if (graph.edges_vertices[edge][0] === vertex
				&& graph.edges_vertices[edge][1] === vertex) {
				console.warn("remove_planar_vertex circular edge");
			}
		});
		return edges.map(edge => graph.edges_vertices[edge][0] === vertex
			? graph.edges_vertices[edge][1]
			: graph.edges_vertices[edge][0]);
	};
	const remove_planar_vertex = (graph, vertex) => {
		const edges = graph.vertices_edges[vertex];
		const faces = unique_sorted_integers(graph.vertices_faces[vertex]
			.filter(a => a != null));
		if (edges.length !== 2 || faces.length > 2) {
			console.warn("cannot remove non 2-degree vertex yet (e,f)", edges, faces);
			return;
		}
		const vertices = get_opposite_vertices(graph, vertex, edges);
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
				console.warn("remove_planar_vertex unknown vertex issue");
				return;
			}
			graph.vertices_vertices[v][index] = vertices_reverse[i];
		});
		graph.edges_vertices[edges[0]] = [...vertices];
		faces.forEach(face => {
			const index = graph.faces_vertices[face].indexOf(vertex);
			if (index === -1) {
				console.warn("remove_planar_vertex unknown face_vertex issue");
				return;
			}
			graph.faces_vertices[face].splice(index, 1);
		});
		faces.forEach(face => {
			const index = graph.faces_edges[face].indexOf(edges[1]);
			if (index === -1) {
				console.warn("remove_planar_vertex unknown face_edge issue");
				return;
			}
			graph.faces_edges[face].splice(index, 1);
		});
		remove_geometry_indices(graph, "vertices", [vertex]);
		remove_geometry_indices(graph, "edges", [edges[1]]);
	};

	const alternating_sum = (numbers) => [0, 1]
		.map(even_odd => numbers
			.filter((_, i) => i % 2 === even_odd)
			.reduce((a, b) => a + b, 0));
	const alternating_sum_difference = (sectors) => {
		const halfsum = sectors.reduce((a, b) => a + b, 0) / 2;
		return alternating_sum(sectors).map(s => s - halfsum);
	};
	const kawasaki_solutions_radians = (radians) => radians
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(pair => math.core.counter_clockwise_angle_radians(...pair))
		.map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
		.map(opposite_sectors => alternating_sum(opposite_sectors).map(s => Math.PI - s))
		.map((kawasakis, i) => radians[i] + kawasakis[0])
		.map((angle, i) => (math.core.is_counter_clockwise_between(angle,
			radians[i], radians[(i + 1) % radians.length])
			? angle
			: undefined));
	const kawasaki_solutions_vectors = (vectors) => {
		const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
		return kawasaki_solutions_radians(vectors_radians)
			.map(a => (a === undefined
				? undefined
				: [Math.cos(a), Math.sin(a)]));
	};

	var kawasaki_math = /*#__PURE__*/Object.freeze({
		__proto__: null,
		alternating_sum: alternating_sum,
		alternating_sum_difference: alternating_sum_difference,
		kawasaki_solutions_radians: kawasaki_solutions_radians,
		kawasaki_solutions_vectors: kawasaki_solutions_vectors
	});

	const flat_assignment = { B:true, b:true, F:true, f:true, U:true, u:true };
	const vertices_flat = ({ vertices_edges, edges_assignment }) => vertices_edges
		.map(edges => edges
			.map(e => flat_assignment[edges_assignment[e]])
			.reduce((a, b) => a && b, true))
		.map((valid, i) => valid ? i : undefined)
		.filter(a => a !== undefined);
	const folded_assignments = { M:true, m:true, V:true, v:true};
	const maekawa_signs = { M:-1, m:-1, V:1, v:1};
	const validate_maekawa = ({ edges_vertices, vertices_edges, edges_assignment }) => {
		if (!vertices_edges) {
			vertices_edges = make_vertices_edges_unsorted({ edges_vertices });
		}
		const is_valid = vertices_edges
			.map(edges => edges
				.map(e => maekawa_signs[edges_assignment[e]])
				.filter(a => a !== undefined)
				.reduce((a, b) => a + b, 0))
			.map(sum => sum === 2 || sum === -2);
		get_boundary_vertices({ edges_vertices, edges_assignment })
			.forEach(v => { is_valid[v] = true; });
		vertices_flat({ vertices_edges, edges_assignment })
			.forEach(v => { is_valid[v] = true; });
		return is_valid
			.map((valid, v) => !valid ? v : undefined)
			.filter(a => a !== undefined);
	};
	const validate_kawasaki = ({ vertices_coords, vertices_vertices, vertices_edges, edges_vertices, edges_assignment, edges_vector }, epsilon = math.core.EPSILON) => {
		if (!vertices_vertices) {
			vertices_vertices = make_vertices_vertices({ vertices_coords, vertices_edges, edges_vertices });
		}
		const is_valid = make_vertices_vertices_vector({ vertices_coords, vertices_vertices, edges_vertices, edges_vector })
			.map((vectors, v) => vectors
				.filter((_, i) => folded_assignments[edges_assignment[vertices_edges[v][i]]]))
			.map(vectors => vectors.length > 1
				? math.core.counter_clockwise_sectors2(vectors)
				: [0, 0])
			.map(sectors => alternating_sum(sectors))
			.map((pair, v) => Math.abs(pair[0] - pair[1]) < epsilon);
		get_boundary_vertices({ edges_vertices, edges_assignment })
			.forEach(v => { is_valid[v] = true; });
		vertices_flat({ vertices_edges, edges_assignment })
			.forEach(v => { is_valid[v] = true; });
		return is_valid
			.map((valid, v) => !valid ? v : undefined)
			.filter(a => a !== undefined);
	};

	var validate_single_vertex = /*#__PURE__*/Object.freeze({
		__proto__: null,
		validate_maekawa: validate_maekawa,
		validate_kawasaki: validate_kawasaki
	});

	const CreasePattern = {};
	CreasePattern.prototype = Object.create(GraphProto);
	CreasePattern.prototype.constructor = CreasePattern;
	const arcResolution = 96;
	const make_edges_array = function (array) {
		array.mountain = (degrees = -180) => {
			array.forEach(i => {
				this.edges_assignment[i] = "M";
				this.edges_foldAngle[i] = degrees;
			});
			return array;
		};
		array.valley = (degrees = 180) => {
			array.forEach(i => {
				this.edges_assignment[i] = "V";
				this.edges_foldAngle[i] = degrees;
			});
			return array;
		};
		array.flat = () => {
			array.forEach(i => {
				this.edges_assignment[i] = "F";
				this.edges_foldAngle[i] = 0;
			});
			return array;
		};
		return array;
	};
	["line", "ray", "segment"].forEach(type => {
		CreasePattern.prototype[type] = function () {
			const primitive = math[type](...arguments);
			if (!primitive) { return; }
			const segment = clip(this, primitive);
			if (!segment) { return; }
			const edges = add_planar_segment(this, segment[0], segment[1]);
			return make_edges_array.call(this, edges);
		};
	});
	["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
		CreasePattern.prototype[fName] = function () {
			const primitive = math[fName](...arguments);
			if (!primitive) { return; }
			const segments = primitive.segments(arcResolution)
				.map(segment => math.segment(segment))
				.map(segment => clip(this, segment))
				.filter(a => a !== undefined);
			if (!segments) { return; }
			const vertices = [];
			const edges = [];
			segments.forEach(segment => {
				const verts = add_vertices(this, segment);
				vertices.push(...verts);
				edges.push(...add_edges(this, verts));
			});
			const map = fragment(this).edges.map;
			populate(this);
			return make_edges_array.call(this, edges.map(e => map[e])
				.reduce((a, b) => a.concat(b), []));
		};
	});
	CreasePattern.prototype.removeEdge = function (edge) {
		const vertices = this.edges_vertices[edge];
		remove_planar_edge(this, edge);
		vertices
			.map(v => is_vertex_collinear(this, v))
			.map((collinear, i) => collinear ? vertices[i] : undefined)
			.filter(a => a !== undefined)
			.sort((a, b) => b - a)
			.forEach(v => remove_planar_vertex(this, v));
		return true;
	};
	CreasePattern.prototype.validate = function (epsilon) {
		const valid = validate(this, epsilon);
		valid.vertices.kawasaki = validate_kawasaki(this, epsilon);
		valid.vertices.maekawa = validate_maekawa(this);
		if (this.edges_foldAngle) {
			valid.edges.not_flat = this.edges_foldAngle
				.map((angle, i) => edge_foldAngle_is_flat(angle) ? undefined : i)
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
	var CreasePatternProto = CreasePattern.prototype;

	const fold_faces_layer = (faces_layer, faces_folding) => {
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
	};

	const make_face_side = (vector, origin, face_center, face_winding) => {
		const center_vector = math.core.subtract2(face_center, origin);
		const determinant = math.core.cross2(vector, center_vector);
		return face_winding ? determinant < 0 : determinant > 0;
	};
	const make_face_center = (graph, face) => !graph.faces_vertices[face]
		? [0, 0]
		: graph.faces_vertices[face]
			.map(v => graph.vertices_coords[v])
			.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
			.map(el => el / graph.faces_vertices[face].length);
	const unfolded_assignment = { F:true, f:true, U:true, u:true };
	const opposite_lookup = { M:"V", m:"V", V:"M", v:"M" };
	const get_opposite_assignment = assign => opposite_lookup[assign] || assign;
	const face_snapshot = (graph, face) => ({
		center: graph.faces_center[face],
		matrix: graph.faces_matrix2[face],
		winding: graph.faces_winding[face],
		crease: graph.faces_crease[face],
		side: graph.faces_side[face],
		layer: graph.faces_layer[face],
	});
	const flat_fold = (graph, vector, origin, assignment = "V", epsilon = math.core.EPSILON) => {
		const opposite_assignment = get_opposite_assignment(assignment);
		populate(graph);
		if (!graph.faces_layer) {
			graph.faces_layer = Array(graph.faces_vertices.length).fill(0);
		}
		graph.faces_center = graph.faces_vertices
			.map((_, i) => make_face_center(graph, i));
		if (!graph.faces_matrix2) {
			graph.faces_matrix2 = make_faces_matrix2(graph, 0);
		}
		graph.faces_winding = make_faces_winding_from_matrix2(graph.faces_matrix2);
		graph.faces_crease = graph.faces_matrix2
			.map(math.core.invert_matrix2)
			.map(matrix => math.core.multiply_matrix2_line2(matrix, vector, origin));
		graph.faces_side = graph.faces_vertices
			.map((_, i) => make_face_side(
				graph.faces_crease[i].vector,
				graph.faces_crease[i].origin,
				graph.faces_center[i],
				graph.faces_winding[i],
			));
		const vertices_coords_folded = multiply_vertices_faces_matrix2(graph,
			graph.faces_matrix2);
		const collinear_edges = make_edges_line_parallel_overlap({
			vertices_coords: vertices_coords_folded,
			edges_vertices: graph.edges_vertices,
		}, vector, origin, epsilon)
			.map((is_collinear, e) => is_collinear ? e : undefined)
			.filter(e => e !== undefined)
			.filter(e => unfolded_assignment[graph.edges_assignment[e]]);
		collinear_edges
			.map(e => graph.edges_faces[e].find(f => f != null))
			.map(f => graph.faces_winding[f])
			.map(winding => winding ? assignment : opposite_assignment)
			.forEach((assignment, e) => {
				graph.edges_assignment[collinear_edges[e]] = assignment;
				graph.edges_foldAngle[collinear_edges[e]] = edge_assignment_to_foldAngle(
					assignment);
			});
		const face0 = face_snapshot(graph, 0);
		const split_changes = graph.faces_vertices
			.map((_, i) => i)
			.reverse()
			.map((i) => {
				const face = face_snapshot(graph, i);
				const change = split_convex_face(
					graph,
					i,
					face.crease.vector,
					face.crease.origin,
					epsilon);
				if (change === undefined) { return undefined; }
				graph.edges_assignment[change.edges.new] = face.winding
					? assignment
					: opposite_assignment;
				graph.edges_foldAngle[change.edges.new] = edge_assignment_to_foldAngle(
					graph.edges_assignment[change.edges.new]);
				const new_faces = change.faces.map[change.faces.remove];
				new_faces.forEach(f => {
					graph.faces_center[f] = make_face_center(graph, f);
					graph.faces_side[f] = make_face_side(
						face.crease.vector,
						face.crease.origin,
						graph.faces_center[f],
						face.winding);
					graph.faces_layer[f] = face.layer;
				});
				return change;
			})
			.filter(a => a !== undefined);
		const faces_map = merge_nextmaps(...split_changes.map(el => el.faces.map));
		const edges_map = merge_nextmaps(...split_changes.map(el => el.edges.map)
			.filter(a => a !== undefined));
		const faces_remove = split_changes.map(el => el.faces.remove).reverse();
		graph.faces_layer = fold_faces_layer(
			graph.faces_layer,
			graph.faces_side,
		);
		const face0_was_split = faces_map && faces_map[0].length === 2;
		const face0_newIndex = (face0_was_split
			? faces_map[0].filter(f => graph.faces_side[f]).shift()
			: 0);
		let face0_preMatrix = face0.matrix;
		if (assignment !== opposite_assignment) {
			face0_preMatrix = (!face0_was_split && !graph.faces_side[0]
				? face0.matrix
				: math.core.multiply_matrices2(
						face0.matrix,
						math.core.make_matrix2_reflect(
							face0.crease.vector,
							face0.crease.origin))
			);
		}
		graph.faces_matrix2 = make_faces_matrix2(graph, face0_newIndex)
			.map(matrix => math.core.multiply_matrices2(face0_preMatrix, matrix));
		delete graph.faces_center;
		delete graph.faces_winding;
		delete graph.faces_crease;
		delete graph.faces_side;
		return {
			faces: { map: faces_map, remove: faces_remove },
			edges: { map: edges_map },
		}
	};

	const Origami = {};
	Origami.prototype = Object.create(GraphProto);
	Origami.prototype.constructor = Origami;
	Origami.prototype.flatFold = function () {
		const line = math.core.get_line(arguments);
		flat_fold(this, line.vector, line.origin);
		return this;
	};
	var OrigamiProto = Origami.prototype;

	const is_folded_form = (graph) => {
		return (graph.frame_classes && graph.frame_classes.includes("foldedForm"))
			|| (graph.file_classes && graph.file_classes.includes("foldedForm"));
	};

	var query = /*#__PURE__*/Object.freeze({
		__proto__: null,
		is_folded_form: is_folded_form
	});

	const make_edges_faces_overlap = ({ vertices_coords, edges_vertices, edges_vector, edges_faces, faces_edges, faces_vertices }, epsilon) => {
		if (!edges_vector) {
			edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
		}
		const faces_winding = make_faces_winding({ vertices_coords, faces_vertices });
		const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
		const matrix = edges_vertices
			.map(() => Array.from(Array(faces_vertices.length)));
		edges_faces.forEach((faces, e) => faces
			.forEach(f => { matrix[e][f] = false; }));
		const edges_vertices_coords = edges_vertices
			.map(verts => verts.map(v => vertices_coords[v]));
		const faces_vertices_coords = faces_vertices
			.map(verts => verts.map(v => vertices_coords[v]));
		for (let f = 0; f < faces_winding.length; f++) {
			if (!faces_winding[f]) { faces_vertices_coords[f].reverse(); }
		}
		matrix.forEach((row, e) => row.forEach((val, f) => {
			if (val === false) { return; }
			const point_in_poly = edges_vertices_coords[e]
				.map(point => math.core.overlap_convex_polygon_point(
					faces_vertices_coords[f],
					point,
					math.core.exclude,
					epsilon
				)).reduce((a, b) => a || b, false);
			if (point_in_poly) { matrix[e][f] = true; return; }
			const edge_intersect = math.core.intersect_convex_polygon_line(
				faces_vertices_coords[f],
				edges_vector[e],
				edges_origin[e],
				math.core.exclude_s,
				math.core.exclude_s,
				epsilon
			);
			if (edge_intersect) { matrix[e][f] = true; return; }
			matrix[e][f] = false;
		}));
		return matrix;
	};
	const make_faces_faces_overlap = ({ vertices_coords, faces_vertices }, epsilon = math.core.EPSILON) => {
		const matrix = Array.from(Array(faces_vertices.length))
			.map(() => Array.from(Array(faces_vertices.length)));
		const faces_polygon = make_faces_polygon({ vertices_coords, faces_vertices }, epsilon);
		for (let i = 0; i < faces_vertices.length - 1; i++) {
			for (let j = i + 1; j < faces_vertices.length; j++) {
				const overlap = math.core.overlap_convex_polygons(
					faces_polygon[i], faces_polygon[j], epsilon);
				matrix[i][j] = overlap;
				matrix[j][i] = overlap;
			}
		}
		return matrix;
	};

	var overlap = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make_edges_faces_overlap: make_edges_faces_overlap,
		make_faces_faces_overlap: make_faces_faces_overlap
	});

	const make_folded_strip_tacos = (folded_faces, is_circular, epsilon) => {
		const faces_center = folded_faces
			.map((ends) => ends ? (ends[0] + ends[1]) / 2 : undefined);
		const locations = [];
		folded_faces.forEach((ends, i) => {
			if (!ends) { return; }
			if (!is_circular && i === folded_faces.length - 1) { return; }
			const fold_end = ends[1];
			const min = fold_end - (epsilon * 2);
			const max = fold_end + (epsilon * 2);
			const faces = [i, (i+1) % folded_faces.length];
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
	};

	const between = (arr, i, j) => (i < j)
		? arr.slice(i + 1, j)
		: arr.slice(j + 1, i);
	const validate_taco_tortilla_strip = (faces_folded, layers_face, is_circular = true, epsilon = math.core.EPSILON) => {
		const faces_layer = invert_map(layers_face);
		const fold_location = faces_folded
			.map(ends => ends ? ends[1] : undefined);
		const faces_mins = faces_folded
			.map(ends => ends ? Math.min(...ends) : undefined)
			.map(n => n + epsilon);
		const faces_maxs = faces_folded
			.map(ends => ends ? Math.max(...ends) : undefined)
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
	};

	const validate_taco_taco_face_pairs = (face_pair_stack) => {
		const pair_stack = remove_single_instances(face_pair_stack);
		const pairs = {};
		let count = 0;
		for (let i = 0; i < pair_stack.length; i++) {
			if (pairs[pair_stack[i]] === undefined) {
				count++;
				pairs[pair_stack[i]] = count;
			}
			else if (pairs[pair_stack[i]] !== undefined) {
				if (pairs[pair_stack[i]] !== count) { return false; }
				count--;
				pairs[pair_stack[i]] = undefined;
			}
		}
		return true;
	};

	const build_layers = (layers_face, faces_pair) => layers_face
		.map(f => faces_pair[f])
		.filter(a => a !== undefined);
	const validate_layer_solver = (faces_folded, layers_face, taco_face_pairs, circ_and_done, epsilon) => {
		const flat_layers_face = math.core.flatten_arrays(layers_face);
		if (!validate_taco_tortilla_strip(
			faces_folded, layers_face, circ_and_done, epsilon
		)) { return false; }
		for (let i = 0; i < taco_face_pairs.length; i++) {
			const pair_stack = build_layers(flat_layers_face, taco_face_pairs[i]);
			if (!validate_taco_taco_face_pairs(pair_stack)) { return false; }
		}
		return true;
	};

	const change_map = { V: true, v: true, M: true, m: true };
	const assignments_to_faces_flip = (assignments) => {
		let counter = 0;
		const shifted_assignments = assignments.slice(1);
		return [false].concat(shifted_assignments
			.map(a => change_map[a] ? ++counter : counter)
			.map(count => count % 2 === 1));
	};
	const up_down = { V: 1, v: 1, M: -1, m: -1 };
	const upOrDown = (mv, i) => i % 2 === 0
		?  (up_down[mv] || 0)
		: -(up_down[mv] || 0);
	const assignments_to_faces_vertical = (assignments) => {
		let iterator = 0;
		return assignments
			.slice(1)
			.concat([assignments[0]])
			.map(a => {
				const updown = upOrDown(a, iterator);
				iterator += up_down[a] === undefined ? 0 : 1;
				return updown;
			});
	};
	const fold_strip_with_assignments = (faces, assignments) => {
		const faces_end = assignments_to_faces_flip(assignments)
			.map((flip, i) => faces[i] * (flip ? -1 : 1));
		const cumulative = faces.map(() => undefined);
		cumulative[0] = [0, faces_end[0]];
		for (let i = 1; i < faces.length; i++) {
			if (assignments[i] === "B" || assignments[i] === "b") { break; }
			const prev = (i - 1 + faces.length) % faces.length;
			const prev_end = cumulative[prev][1];
			cumulative[i] = [prev_end, prev_end + faces_end[i]];
		}
		return cumulative;
	};

	var fold_assignments = /*#__PURE__*/Object.freeze({
		__proto__: null,
		assignments_to_faces_flip: assignments_to_faces_flip,
		assignments_to_faces_vertical: assignments_to_faces_vertical,
		fold_strip_with_assignments: fold_strip_with_assignments
	});

	const is_boundary = { "B": true, "b": true };
	const single_vertex_solver = (ordered_scalars, assignments, epsilon = math.core.EPSILON) => {
		const faces_folded = fold_strip_with_assignments(ordered_scalars, assignments);
		const faces_updown = assignments_to_faces_vertical(assignments);
		const is_circular = assignments
			.map(a => !(is_boundary[a]))
			.reduce((a, b) => a && b, true);
		if (is_circular) {
			const start = faces_folded[0][0];
			const end = faces_folded[faces_folded.length - 1][1];
			if (Math.abs(start - end) > epsilon) { return []; }
		}	const taco_face_pairs = make_folded_strip_tacos(faces_folded, is_circular, epsilon)
			.map(taco => [taco.left, taco.right]
				.map(invert_map)
				.filter(arr => arr.length > 1))
			.reduce((a, b) => a.concat(b), []);
		const recurse = (layers_face = [0], face = 0, layer = 0) => {
			const next_face = face + 1;
			const next_dir = faces_updown[face];
			const is_done = face >= ordered_scalars.length - 1;
			const circ_and_done = is_circular && is_done;
			if (!validate_layer_solver(
				faces_folded, layers_face, taco_face_pairs, circ_and_done, epsilon
			)) {
				return [];
			}
			if (circ_and_done) {
				const faces_layer = invert_map(layers_face);
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
			const next_layers_faces = splice_layers.map(i => clone(layers_face));
			next_layers_faces
				.forEach((layers, i) => layers.splice(splice_layers[i], 0, next_face));
			return next_layers_faces
				.map((layers, i) => recurse(layers, next_face, splice_layers[i]))
				.reduce((a, b) => a.concat(b), []);
		};
		return recurse().map(invert_map);
	};

	const make_vertex_faces_layer = ({
		vertices_faces, vertices_sectors, vertices_edges, edges_assignment
	}, vertex, epsilon) => {
		const faces = vertices_faces[vertex];
		const range = get_longest_array(circular_array_valid_ranges(faces));
		if (range === undefined) { return; }
		while (range[1] < range[0]) { range[1] += faces.length; }
		const indices = Array
			.from(Array(range[1] - range[0] + 1))
			.map((_, i) => (range[0] + i) % faces.length);
		const sectors = indices
			.map(i => vertices_sectors[vertex][i]);
		const assignments = indices
			.map(i => vertices_edges[vertex][i])
			.map(edge => edges_assignment[edge]);
		const sectors_layer = single_vertex_solver(sectors, assignments, epsilon);
		const faces_layer = sectors_layer
			.map(invert_map)
			.map(arr => arr
				.map(face => typeof face !== "object"
					? faces[indices[face]]
					: face.map(f => faces[indices[f]])))
			.map(invert_map);
		faces_layer.face = faces[indices[0]];
		return faces_layer;
	};
	const flip_solutions = solutions => {
		const face = solutions.face;
		const flipped = solutions
			.map(invert_map)
			.map(list => list.reverse())
			.map(invert_map);
		flipped.face = face;
		return flipped;
	};
	const make_vertices_faces_layer = (graph, start_face = 0, epsilon) => {
		if (!graph.vertices_sectors) {
			graph.vertices_sectors = make_vertices_sectors(graph);
		}
		const faces_coloring = make_faces_winding(graph).map(c => !c);
		const vertices_faces_layer = graph.vertices_sectors
			.map((_, vertex) => make_vertex_faces_layer(graph, vertex, epsilon));
		const vertices_solutions_flip = vertices_faces_layer
			.map(solution => faces_coloring[solution.face]);
		return vertices_faces_layer
			.map((solutions, i) => vertices_solutions_flip[i]
				? flip_solutions(solutions)
				: solutions);
	};

	var faces_layer = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make_vertex_faces_layer: make_vertex_faces_layer,
		make_vertices_faces_layer: make_vertices_faces_layer
	});

	const make_edges_edges_parallel = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => {
		if (!edges_vector) {
			edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
		}
		const edge_count = edges_vector.length;
		const edges_edges_parallel = Array
			.from(Array(edge_count))
			.map(() => Array.from(Array(edge_count)));
		for (let i = 0; i < edge_count - 1; i++) {
			for (let j = i + 1; j < edge_count; j++) {
				const p = math.core.parallel(edges_vector[i], edges_vector[j], epsilon);
				edges_edges_parallel[i][j] = p;
				edges_edges_parallel[j][i] = p;
			}
		}
		return edges_edges_parallel;
	};
	const overwrite_edges_overlaps = (matrix, vectors, origins, func, epsilon) => {
		for (let i = 0; i < matrix.length - 1; i++) {
			for (let j = i + 1; j < matrix.length; j++) {
				if (!matrix[i][j]) { continue; }
				matrix[i][j] = math.core.overlap_line_line(
					vectors[i], origins[i],
					vectors[j], origins[j],
					func, func,
					epsilon);
				matrix[j][i] = matrix[i][j];
			}
		}
	};
	const make_edges_edges_crossing = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => {
		if (!edges_vector) {
			edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
		}
		const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
		const matrix = make_edges_edges_parallel({
			vertices_coords, edges_vertices, edges_vector
		}, epsilon)
			.map(row => row.map(b => !b));
		for (let i = 0; i < matrix.length; i++) {
			matrix[i][i] = undefined;
		}
		overwrite_edges_overlaps(matrix, edges_vector, edges_origin, math.core.exclude_s, epsilon);
		return matrix;
	};
	const make_edges_edges_parallel_overlap = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => {
		if (!edges_vector) {
			edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
		}
		const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
		const matrix = make_edges_edges_parallel({
			vertices_coords, edges_vertices, edges_vector
		}, epsilon);
		overwrite_edges_overlaps(matrix, edges_vector, edges_origin, math.core.exclude_s, epsilon);
		return matrix;
	};

	var edges_edges = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make_edges_edges_parallel: make_edges_edges_parallel,
		make_edges_edges_crossing: make_edges_edges_crossing,
		make_edges_edges_parallel_overlap: make_edges_edges_parallel_overlap
	});

	var graph_methods = Object.assign(Object.create(null), {
		count,
		implied: implied_count,
		validate,
		clean,
		populate,
		remove: remove_geometry_indices,
		replace: replace_geometry_indices,
		remove_planar_vertex,
		remove_planar_edge,
		add_vertices,
		add_edges,
		split_edge,
		split_face: split_convex_face,
		flat_fold,
		add_planar_segment,
		assign,
		subgraph,
		clip,
		fragment,
		get_vertices_clusters,
		clone,
	},
		make,
		boundary,
		walk,
		nearest,
		fold_spec,
		sort,
		span,
		maps,
		query,
		intersect,
		overlap,
		transform,
		vertices_violations,
		edges_violations,
		vertices_collinear,
		faces_layer,
		edges_edges,
		vertices_coords_folded,
		face_spanning_tree,
		faces_matrix,
		faces_winding,
		explode_faces_methods,
		arrays,
	);

	const Create = {};
	const make_rect_vertices_coords = (w, h) => [[0, 0], [w, 0], [w, h], [0, h]];
	const make_closed_polygon = (vertices_coords) => populate({
		vertices_coords,
		edges_vertices: vertices_coords
			.map((_, i, arr) => [i, (i + 1) % arr.length]),
		edges_assignment: Array(vertices_coords.length).fill("B"),
	});
	const polygon_names = [
		null,
		null,
		null,
		"triangle",
		"square",
		"pentagon",
		"hexagon",
		"heptagon",
		"octagon",
		"nonagon",
		"decagon",
		"hendecagon",
		"dodecagon"
	];
	polygon_names
		.map((str, i) => str === null ? i : undefined)
		.filter(a => a !== undefined)
		.forEach(i => delete polygon_names[i]);
	polygon_names.forEach((name, i) => {
		Create[name] = () => make_closed_polygon(math.core
			.make_regular_polygon_side_length(i));
	});
	Create.unit_square = () =>
		make_closed_polygon(make_rect_vertices_coords(1, 1));
	Create.rectangle = (width = 1, height = 1) =>
		make_closed_polygon(make_rect_vertices_coords(width, height));
	Create.circle = (sides = 90) =>
		make_closed_polygon(math.core.make_regular_polygon(sides));
	Create.kite = () => populate({
		vertices_coords: [[0,0], [Math.sqrt(2)-1,0], [1,0], [1,1-(Math.sqrt(2)-1)], [1,1], [0,1]],
		edges_vertices: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [5,1], [3,5], [5,2]],
		edges_assignment: Array.from("BBBBBBVVF")
	});

	const ObjectConstructors = Object.create(null);
	const ConstructorPrototypes = {
		graph: GraphProto,
		cp: CreasePatternProto,
		origami: OrigamiProto,
	};
	const default_graph = {
		graph: () => ({}),
		cp: Create.unit_square,
		origami: Create.unit_square,
	};
	Object.keys(ConstructorPrototypes).forEach(name => {
		ObjectConstructors[name] = function () {
			const argFolds = Array.from(arguments)
				.filter(a => fold_object_certainty(a))
				.map(obj => JSON.parse(JSON.stringify(obj)));
			return populate(Object.assign(
				Object.create(ConstructorPrototypes[name]),
				(argFolds.length ? {} : default_graph[name]()),
				...argFolds,
				{ file_spec, file_creator }
			));
		};
		ObjectConstructors[name].prototype = ConstructorPrototypes[name];
		ObjectConstructors[name].prototype.constructor = ObjectConstructors[name];
		Object.keys(Create).forEach(funcName => {
			ObjectConstructors[name][funcName] = function () {
				return ObjectConstructors[name](Create[funcName](...arguments));
			};
		});
	});
	Object.assign(ObjectConstructors.graph, graph_methods);

	const intersection_ud = (line1, line2) => {
		const det = math.core.cross2(line1.u, line2.u);
		if (Math.abs(det) < math.core.EPSILON) { return undefined; }
		const x = line1.d * line2.u[1] - line2.d * line1.u[1];
		const y = line2.d * line1.u[0] - line1.d * line2.u[0];
		return [x / det, y / det];
	};
	const axiom1ud = (point1, point2) => {
		const u = math.core.normalize2(math.core.rotate90(math.core.subtract2(point2, point1)));
		return { u, d: math.core.dot2(math.core.add2(point1, point2), u) / 2.0 };
	};
	const axiom2ud = (point1, point2) => {
		const u = math.core.normalize2(math.core.subtract2(point2, point1));
		return { u, d: math.core.dot2(math.core.add2(point1, point2), u) / 2.0 };
	};
	const axiom3ud = (line1, line2) => {
		const intersect = intersection_ud(line1, line2);
		return intersect === undefined
			? [{ u: line1.u, d: (line1.d + line2.d * math.core.dot2(line1.u, line2.u)) / 2.0 }]
			: [math.core.add2, math.core.subtract2]
				.map(f => math.core.normalize2(f(line1.u, line2.u)))
				.map(u => ({ u, d: math.core.dot2(intersect, u) }));
	};
	 const axiom4ud = (line, point) => {
		const u = math.core.rotate90(line.u);
		const d = math.core.dot2(point, u);
		return {u, d};
	};
	const axiom5ud = (line, point1, point2) => {
		const p1base = math.core.dot2(point1, line.u);
		const a = line.d - p1base;
		const c = math.core.distance2(point1, point2);
		if (a > c) { return []; }
		const b = Math.sqrt(c * c - a * a);
		const a_vec = math.core.scale2(line.u, a);
		const base_center = math.core.add2(point1, a_vec);
		const base_vector = math.core.scale2(math.core.rotate90(line.u), b);
		const mirrors = b < math.core.EPSILON
			? [base_center]
			: [math.core.add2(base_center, base_vector), math.core.subtract2(base_center, base_vector)];
		return mirrors
			.map(pt => math.core.normalize2(math.core.subtract2(point2, pt)))
			.map(u => ({ u, d: math.core.dot2(point1, u) }));
	};
	const cubrt = n => n < 0
		? -Math.pow(-n, 1/3)
		: Math.pow(n, 1/3);
	const polynomial = (degree, a, b, c, d) => {
		switch (degree) {
			case 1: return [-d / c];
			case 2: {
				let discriminant = Math.pow(c, 2.0) - (4.0 * b * d);
				if (discriminant < -math.core.EPSILON) { return []; }
				let q1 = -c / (2.0 * b);
				if (discriminant < math.core.EPSILON) { return [q1]; }
				let q2 = Math.sqrt(discriminant) / (2.0 * b);
				return [q1 + q2, q1 - q2];
			}
			case 3: {
				let a2 = b / a;
				let a1 = c / a;
				let a0 = d / a;
				let q = (3.0 * a1 - Math.pow(a2, 2.0)) / 9.0;
				let r = (9.0 * a2 * a1 - 27.0 * a0 - 2.0 * Math.pow(a2, 3.0)) / 54.0;
				let d0 = Math.pow(q, 3.0) + Math.pow(r, 2.0);
				let u = -a2 / 3.0;
				if (d0 > 0.0) {
					let sqrt_d0 = Math.sqrt(d0);
					let s = cubrt(r + sqrt_d0);
					let t = cubrt(r - sqrt_d0);
					return [u + s + t];
				}
				if (Math.abs(d0) < math.core.EPSILON) {
					let s = Math.pow(r, 1.0/3.0);
					if (r < 0.0) { return []; }
					return [u + 2.0 * s, u - s];
				}
				let sqrt_d0 = Math.sqrt(-d0);
				let phi = Math.atan2(sqrt_d0, r) / 3.0;
				let r_s = Math.pow((Math.pow(r, 2.0) - d0), 1.0/6.0);
				let s_r = r_s * Math.cos(phi);
				let s_i = r_s * Math.sin(phi);
				return [
					u + 2.0 * s_r,
					u - s_r - Math.sqrt(3.0) * s_i,
					u - s_r + Math.sqrt(3.0) * s_i
				];
			}
			default: return [];
		}
	};
	const axiom6ud = (line1, line2, point1, point2) => {
		if (Math.abs(1.0 - (math.core.dot2(line1.u, point1) / line1.d)) < 0.02) { return []; }
		const line_vec = math.core.rotate90(line1.u);
		const vec1 = math.core.subtract2(math.core.add2(point1, math.core.scale2(line1.u, line1.d)), math.core.scale2(point2, 2.0));
		const vec2 = math.core.subtract2(math.core.scale2(line1.u, line1.d), point1);
		const c1 = math.core.dot2(point2, line2.u) - line2.d;
		const c2 = 2.0 * math.core.dot2(vec2, line_vec);
		const c3 = math.core.dot2(vec2, vec2);
		const c4 = math.core.dot2(math.core.add2(vec1, vec2), line_vec);
		const c5 = math.core.dot2(vec1, vec2);
		const c6 = math.core.dot2(line_vec, line2.u);
		const c7 = math.core.dot2(vec2, line2.u);
		const a = c6;
		const b = c1 + c4 * c6 + c7;
		const c = c1 * c2 + c5 * c6 + c4 * c7;
		const d = c1 * c3 + c5 * c7;
		let polynomial_degree = 0;
		if (Math.abs(c) > math.core.EPSILON) { polynomial_degree = 1; }
		if (Math.abs(b) > math.core.EPSILON) { polynomial_degree = 2; }
		if (Math.abs(a) > math.core.EPSILON) { polynomial_degree = 3; }
		return polynomial(polynomial_degree, a, b, c, d)
			.map(n => math.core.add2(math.core.scale2(line1.u, line1.d), math.core.scale2(line_vec, n)))
			.map(p => ({ p, u: math.core.normalize2(math.core.subtract2(p, point1)) }))
			.map(el => ({ u: el.u, d: math.core.dot2(el.u, math.core.midpoint2(el.p, point1)) }));
	};
	const axiom7ud = (line1, line2, point) => {
		let u = math.core.rotate90(line1.u);
		let u_u = math.core.dot2(u, line2.u);
		if (Math.abs(u_u) < math.core.EPSILON) { return undefined; }
		let a = math.core.dot2(point, u);
		let b = math.core.dot2(point, line2.u);
		let d = (line2.d + 2.0 * a * u_u - b) / (2.0 * u_u);
		return {u, d};
	};

	var AxiomsUD = /*#__PURE__*/Object.freeze({
		__proto__: null,
		axiom1ud: axiom1ud,
		axiom2ud: axiom2ud,
		axiom3ud: axiom3ud,
		axiom4ud: axiom4ud,
		axiom5ud: axiom5ud,
		axiom6ud: axiom6ud,
		axiom7ud: axiom7ud
	});

	const axiom1 = (point1, point2) => ({
		vector: math.core.normalize2(math.core.subtract2(...math.core.resize_up(point2, point1))),
		origin: point1
	});
	const axiom2 = (point1, point2) => ({
		vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(...math.core.resize_up(point2, point1)))),
		origin: math.core.midpoint2(point1, point2)
	});
	const axiom3 = (line1, line2) => math.core.bisect_lines2(
		line1.vector, line1.origin, line2.vector, line2.origin
	);
	const axiom4 = (line, point) => ({
		vector: math.core.rotate90(math.core.normalize2(line.vector)),
		origin: point
	});
	const axiom5 = (line, point1, point2) => (math.core.intersect_circle_line(
			math.core.distance2(point1, point2),
			point1,
			line.vector,
			line.origin,
			math.core.include_l
		) || []).map(sect => ({
			vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(...math.core.resize_up(sect, point2)))),
			origin: math.core.midpoint2(point2, sect)
		}));
	const axiom6 = (line1, line2, point1, point2) => axiom6ud(
		math.core.vector_origin_to_ud(line1),
		math.core.vector_origin_to_ud(line2),
		point1, point2).map(math.core.ud_to_vector_origin);
	const axiom7 = (line1, line2, point) => {
		const intersect = math.core.intersect_line_line(
			line1.vector, line1.origin,
			line2.vector, point,
			math.core.include_l, math.core.include_l);
		return intersect === undefined
			? undefined
			: ({
					vector: math.core.normalize2(math.core.rotate90(math.core.subtract2(...math.core.resize_up(intersect, point)))),
					origin: math.core.midpoint2(point, intersect)
			});
	};

	var AxiomsVO = /*#__PURE__*/Object.freeze({
		__proto__: null,
		axiom1: axiom1,
		axiom2: axiom2,
		axiom3: axiom3,
		axiom4: axiom4,
		axiom5: axiom5,
		axiom6: axiom6,
		axiom7: axiom7
	});

	const reflect_point = (foldLine, point) => {
		const matrix = math.core.make_matrix2_reflect(foldLine.vector, foldLine.origin);
		return math.core.multiply_matrix2_vector2(matrix, point);
	};
	const validate_axiom1_2 = (params, boundary) => [params.points
		.map(p => math.core.overlap_convex_polygon_point(boundary, p, math.core.include))
		.reduce((a, b) => a && b, true)];
	const validate_axiom3 = (params, boundary, results) => {
		const segments = params.lines.map(line => math.core
			.clip_line_in_convex_polygon(boundary,
				line.vector,
				line.origin,
				math.core.include,
				math.core.include_l));
		if (segments[0] === undefined || segments[1] === undefined) {
			return [false, false];
		}
		if (!results) {
			results = axiom3(params.lines[0], params.lines[1]);
		}
		const results_clip = results
			.map(line => line === undefined ? undefined : math.core
			.clip_line_in_convex_polygon(
				boundary,
				line.vector,
				line.origin,
				math.core.include,
				math.core.include_l));
		const results_inside = [0, 1].map((i) => results_clip[i] !== undefined);
		const seg0Reflect = results
			.map((foldLine, i) => foldLine === undefined ? undefined : [
				reflect_point(foldLine, segments[0][0]),
				reflect_point(foldLine, segments[0][1])
			]);
		const reflectMatch = seg0Reflect
			.map((seg, i) => seg === undefined ? false : (
				math.core.overlap_line_point(math.core
					.subtract(segments[1][1], segments[1][0]),
					segments[1][0], seg[0], math.core.include_s) ||
				math.core.overlap_line_point(math.core
					.subtract(segments[1][1], segments[1][0]),
					segments[1][0], seg[1], math.core.include_s) ||
				math.core.overlap_line_point(math.core
					.subtract(seg[1], seg[0]), seg[0],
					segments[1][0], math.core.include_s) ||
				math.core.overlap_line_point(math.core
					.subtract(seg[1], seg[0]), seg[0],
					segments[1][1], math.core.include_s)
			));
		return [0, 1].map(i => reflectMatch[i] === true && results_inside[i] === true);
	};
	const validate_axiom4 = (params, boundary) => {
		const intersect = math.core.intersect_line_line(
			params.lines[0].vector, params.lines[0].origin,
			math.core.rotate90(params.lines[0].vector), params.points[0],
			math.core.include_l, math.core.include_l);
		return [
			[params.points[0], intersect]
				.filter(a => a !== undefined)
				.map(p => math.core.overlap_convex_polygon_point(boundary, p, math.core.include))
				.reduce((a, b) => a && b, true)
		];
	};
	const validate_axiom5 = (params, boundary, results) => {
		if (!results) {
			results = axiom5(params.lines[0], params.points[0], params.points[1]);
		}
		if (results.length === 0) { return []; }
		const testParamPoints = params.points
			.map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include))
			.reduce((a, b) => a && b, true);
		const testReflections = results
			.map(foldLine => reflect_point(foldLine, params.points[1]))
			.map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include));
		return testReflections.map(ref => ref && testParamPoints);
	};
	const validate_axiom6 = function (params, boundary, results) {
		if (!results) {
			results = axiom6(
				params.lines[0], params.lines[1],
				params.points[0], params.points[1]);
		}
		if (results.length === 0) { return []; }
		const testParamPoints = params.points
			.map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include))
			.reduce((a, b) => a && b, true);
		if (!testParamPoints) { return results.map(() => false); }
		const testReflect0 = results
			.map(foldLine => reflect_point(foldLine, params.points[0]))
			.map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include));
		const testReflect1 = results
			.map(foldLine => reflect_point(foldLine, params.points[1]))
			.map(point => math.core.overlap_convex_polygon_point(boundary, point, math.core.include));
		return results.map((_, i) => testReflect0[i] && testReflect1[i]);
	};
	const validate_axiom7 = (params, boundary, result) => {
		const paramPointTest = math.core
			.overlap_convex_polygon_point(boundary, params.points[0], math.core.include);
		if (!result) {
			result = axiom7(params.lines[1], params.lines[0], params.points[0]);
		}
		if (result === undefined) { return [false]; }
		const reflected = reflect_point(result, params.points[0]);
		const reflectTest = math.core.overlap_convex_polygon_point(boundary, reflected, math.core.include);
		const paramLineTest = (math.core.intersect_convex_polygon_line(boundary,
			params.lines[1].vector,
			params.lines[1].origin,
			math.core.include_s,
			math.core.include_l) !== undefined);
		return [paramPointTest && reflectTest && paramLineTest];
	};
	const validate_axiom_funcs = [null,
		validate_axiom1_2,
		validate_axiom1_2,
		validate_axiom3,
		validate_axiom4,
		validate_axiom5,
		validate_axiom6,
		validate_axiom7,
	];
	delete validate_axiom_funcs[0];
	const validate_axiom = (number, params, obj, solutions) => {
		const boundary = (typeof obj === "object" && obj.vertices_coords)
			? get_boundary(obj).vertices.map(v => obj.vertices_coords[v])
			: obj;
		return validate_axiom_funcs[number](params, boundary, solutions);
	};
	Object.keys(validate_axiom_funcs).forEach(number => {
		validate_axiom[number] = (...args) => validate_axiom(number, ...args);
	});

	const axiom_returns_array = (number) => {
		switch (number) {
			case 3: case "3":
			case 5: case "5":
			case 6: case "6": return true;
			default: return false;
		}
	};
	const check_params = (params) => ({
		points: (params.points || []).map(p => math.core.get_vector(p)),
		lines: (params.lines || []).map(l => math.core.get_line(l)),
		lines_ud: (params.lines || [])
			.map(l => l.u !== undefined && l.d !== undefined ? l : undefined)
			.filter(a => a !== undefined)
	});
	const axiom_vector_origin = (number, params) => {
		const result = AxiomsVO[`axiom${number}`](...params.lines, ...params.points);
		const array_results = axiom_returns_array(number)
			? result
			: [result].filter(a => a !== undefined);
		return array_results.map(line => math.line(line));
	};
	const axiom_normal_distance = (number, params) => {
		const result = AxiomsUD[`axiom${number}ud`](...params.lines_ud, ...params.points);
		const array_results = axiom_returns_array(number)
			? result
			: [result].filter(a => a !== undefined);
		return array_results.map(line => math.line.ud(line));
	};
	const axiom_boundaryless = (number, params) => {
		return params.lines_ud.length === params.lines.length
			? axiom_normal_distance(number, params)
			: axiom_vector_origin(number, params);
	};
	const filter_with_boundary = (number, params, solutions, boundary) => {
		if (boundary == null) { return; }
		validate_axiom(number, params, boundary, solutions)
			.forEach((valid, i) => { if (!valid) { delete solutions[i]; } });
	};
	const axiom = (number, params = {}, boundary) => {
		const parameters = check_params(params);
		const solutions = axiom_boundaryless(number, parameters);
		filter_with_boundary(number, parameters, solutions, boundary);
		return solutions;
	};
	Object.keys(AxiomsVO).forEach(key => { axiom[key] = AxiomsVO[key]; });
	Object.keys(AxiomsUD).forEach(key => { axiom[key] = AxiomsUD[key]; });
	[1, 2, 3, 4, 5, 6, 7].forEach(number => {
		axiom[number] = (...args) => axiom(number, ...args);
	});
	axiom.validate = validate_axiom;

	const line_line_for_arrows = (a, b) => math.core.intersect_line_line(
		a.vector, a.origin, b.vector, b.origin, math.core.include_l, math.core.include_l
	);
	const diagram_reflect_point = (foldLine, point) => {
		const matrix = math.core.make_matrix2_reflect(foldLine.vector, foldLine.origin);
		return math.core.multiply_matrix2_vector2(matrix, point);
	};
	const boundary_for_arrows = ({ vertices_coords }) => math.core
		.convex_hull(vertices_coords);
	const widest_perp = (graph, foldLine, point) => {
		const boundary = boundary_for_arrows(graph);
		if (point === undefined) {
			const foldSegment = math.core.clip_line_in_convex_polygon(boundary,
				foldLine.vector,
				foldLine.origin,
				math.core.exclude,
				math.core.include_l);
			point = math.core.midpoint(...foldSegment);
		}
		const perpVector = math.core.rotate270(foldLine.vector);
		const smallest = math.core
			.clip_line_in_convex_polygon(boundary,
				perpVector,
				point,
				math.core.exclude,
				math.core.include_l)
			.map(pt => math.core.distance(point, pt))
			.sort((a, b) => a - b)
			.shift();
		const scaled = math.core.scale(math.core.normalize(perpVector), smallest);
		return math.segment(
			math.core.add(point, math.core.flip(scaled)),
			math.core.add(point, scaled)
		);
	};
	const between_2_segments = (params, segments, foldLine) => {
		const midpoints = segments
			.map(seg => math.core.midpoint(seg[0], seg[1]));
		const midpointLine = math.line.fromPoints(...midpoints);
		const origin = math.intersect(foldLine, midpointLine);
		const perpLine = math.line(foldLine.vector.rotate90(), origin);
		return math.segment(params.lines.map(line => math.intersect(line, perpLine)));
	};
	const between_2_intersecting_segments = (params, intersect, foldLine, boundary) => {
		const paramVectors = params.lines.map(l => l.vector);
		const flippedVectors = paramVectors.map(math.core.flip);
		const paramRays = paramVectors
			.concat(flippedVectors)
			.map(vec => math.ray(vec, intersect));
		const a1 = paramRays.filter(ray =>
			math.core.dot(ray.vector, foldLine.vector) > 0 &&
			math.core.cross2(ray.vector, foldLine.vector) > 0
		).shift();
		const a2 = paramRays.filter(ray =>
			math.core.dot(ray.vector, foldLine.vector) > 0 &&
			math.core.cross2(ray.vector, foldLine.vector) < 0
		).shift();
		const b1 = paramRays.filter(ray =>
			math.core.dot(ray.vector, foldLine.vector) < 0 &&
			math.core.cross2(ray.vector, foldLine.vector) > 0
		).shift();
		const b2 = paramRays.filter(ray =>
			math.core.dot(ray.vector, foldLine.vector) < 0 &&
			math.core.cross2(ray.vector, foldLine.vector) < 0
		).shift();
		const rayEndpoints = [a1, a2, b1, b2].map(ray => math.core
			.intersect_convex_polygon_line(boundary, ray.vector, ray.origin, math.core.exclude_s, math.core.exclude_r)
			.shift()
			.shift());
		const rayLengths = rayEndpoints
			.map(pt => math.core.distance(pt, intersect));
		const arrowStart = (rayLengths[0] < rayLengths[1]
			? rayEndpoints[0]
			: rayEndpoints[1]);
		const arrowEnd = (rayLengths[0] < rayLengths[1]
			? math.core.add(a2.origin, a2.vector.normalize().scale(rayLengths[0]))
			: math.core.add(a1.origin, a1.vector.normalize().scale(rayLengths[1])));
		const arrowStart2 = (rayLengths[2] < rayLengths[3]
			? rayEndpoints[2]
			: rayEndpoints[3]);
		const arrowEnd2 = (rayLengths[2] < rayLengths[3]
			? math.core.add(b2.origin, b2.vector.normalize().scale(rayLengths[2]))
			: math.core.add(b1.origin, b1.vector.normalize().scale(rayLengths[3])));
		return [
			math.segment(arrowStart, arrowEnd),
			math.segment(arrowStart2, arrowEnd2)
		];
	};
	const axiom_1_arrows = (params, graph) => axiom(1, params)
		.map(foldLine => [widest_perp(graph, foldLine)]);
	const axiom_2_arrows = params => [
		[math.segment(params.points)]
	];
	const axiom_3_arrows = (params, graph) => {
		const boundary = boundary_for_arrows(graph);
		const segs = params.lines.map(l => math.core
			.clip_line_in_convex_polygon(boundary,
				l.vector,
				l.origin,
				math.core.exclude,
				math.core.include_l));
		const segVecs = segs.map(seg => math.core.subtract(seg[1], seg[0]));
		const intersect = math.core.intersect_line_line(
			segVecs[0], segs[0][0], segVecs[1], segs[1][0],
			math.core.exclude_s, math.core.exclude_s);
		return !intersect
			? [between_2_segments(params, segs, axiom(3, params)
				.filter(a => a !== undefined).shift())]
			: axiom(3, params).map(foldLine => between_2_intersecting_segments(
					params, intersect, foldLine, boundary
				));
	};
	const axiom_4_arrows = (params, graph) => axiom(4, params)
		.map(foldLine => [widest_perp(
			graph,
			foldLine,
			line_line_for_arrows(foldLine, params.lines[0])
		)]);
	const axiom_5_arrows = (params) => axiom(5, params)
		.map(foldLine => [math.segment(
			params.points[1],
			diagram_reflect_point(foldLine, params.points[1])
		)]);
	const axiom_6_arrows = (params) => axiom(6, params)
		.map(foldLine => params.points
			.map(pt => math.segment(pt, diagram_reflect_point(foldLine, pt))));
	const axiom_7_arrows = (params, graph) => axiom(7, params)
		.map(foldLine => [
			math.segment(params.points[0], diagram_reflect_point(foldLine, params.points[0])),
			widest_perp(graph, foldLine, line_line_for_arrows(foldLine, params.lines[1]))
		]);
	const arrow_functions = [null,
		axiom_1_arrows,
		axiom_2_arrows,
		axiom_3_arrows,
		axiom_4_arrows,
		axiom_5_arrows,
		axiom_6_arrows,
		axiom_7_arrows,
	];
	delete arrow_functions[0];
	const axiom_arrows = (number, params = {}, ...args) => {
		const points = params.points
			? params.points.map(p => math.core.get_vector(p))
			: undefined;
		const lines = params.lines
			? params.lines.map(l => math.core.get_line(l))
			: undefined;
		return arrow_functions[number]({ points, lines }, ...args);
	};
	Object.keys(arrow_functions).forEach(number => {
		axiom_arrows[number] = (...args) => axiom_arrows(number, ...args);
	});

	const widest_perpendicular = (polygon, foldLine, point) => {
		if (point === undefined) {
			const foldSegment = math.core.clip_line_in_convex_polygon(polygon,
				foldLine.vector,
				foldLine.origin,
				math.core.exclude,
				math.core.include_l);
			if (foldSegment === undefined) { return; }
			point = math.core.midpoint(...foldSegment);
		}
		const perpVector = math.core.rotate90(foldLine.vector);
		const smallest = math.core
			.clip_line_in_convex_polygon(polygon,
				perpVector,
				point,
				math.core.exclude,
				math.core.include_l)
			.map(pt => math.core.distance(point, pt))
			.sort((a, b) => a - b)
			.shift();
		const scaled = math.core.scale(math.core.normalize(perpVector), smallest);
		return math.segment(
			math.core.add(point, math.core.flip(scaled)),
			math.core.add(point, scaled)
		);
	};
	const simple_arrow = (graph, line) => {
		const hull = math.core.convex_hull(graph.vertices_coords);
		const box = math.core.bounding_box(hull);
		const segment = widest_perpendicular(hull, line);
		if (segment === undefined) { return undefined; }
		const vector = math.core.subtract(segment[1], segment[0]);
		const length = math.core.magnitude(vector);
		const direction = math.core.dot(vector, [1, 0]);
		const vmin = box.span[0] < box.span[1] ? box.span[0] : box.span[1];
		segment.head = {
			width: vmin * 0.1,
			height: vmin * 0.15,
		};
		segment.bend = direction > 0 ? 0.3 : -0.3;
		segment.padding = length * 0.05;
		return segment;
	};

	var diagram = Object.assign(Object.create(null),
		{
		axiom_arrows,
		simple_arrow,
	});

	const make_tortilla_tortilla_edges_crossing = (graph, edges_faces_side, epsilon) => {
		const tortilla_edge_indices = edges_faces_side
			.map(side => side.length === 2 && side[0] !== side[1])
			.map((bool, i) => bool ? i : undefined)
			.filter(a => a !== undefined);
		const edges_crossing_matrix = make_edges_edges_crossing(graph, epsilon);
		const edges_crossing = boolean_matrix_to_indexed_array(edges_crossing_matrix);
		const tortilla_edges_crossing = tortilla_edge_indices
			.map(i => edges_crossing[i]);
		return tortilla_edges_crossing.map((edges, i) => ({
			tortilla_edge: tortilla_edge_indices[i],
			crossing_edges: edges,
		})).filter(el => el.crossing_edges.length);
	};
	const make_tortillas_faces_crossing = (graph, edges_faces_side, epsilon) => {
		const faces_winding = make_faces_winding(graph);
		const faces_polygon = make_faces_polygon(graph, epsilon);
		for (let i = 0; i < faces_polygon.length; i++) {
			if (!faces_winding[i]) { faces_polygon[i].reverse(); }
		}
		const tortilla_edge_indices = edges_faces_side
			.map(side => side.length === 2 && side[0] !== side[1])
			.map((bool, i) => bool ? i : undefined)
			.filter(a => a !== undefined);
		const edges_coords = tortilla_edge_indices
			.map(e => graph.edges_vertices[e])
			.map(edge => edge
				.map(vertex => graph.vertices_coords[vertex]));
		const edges_vector = edges_coords
			.map(coords => math.core.subtract2(coords[1], coords[0]));
		const matrix = [];
		tortilla_edge_indices.forEach(e => { matrix[e] = []; });
		const result = tortilla_edge_indices
			.map((e, ei) => faces_polygon
				.map((poly, f) => math.core.clip_line_in_convex_polygon(
					poly,
					edges_vector[ei],
					edges_coords[ei][0],
					math.core.exclude,
					math.core.exclude_s,
					epsilon))
				.map((result, f) => result !== undefined));
		result.forEach((faces, ei) => faces
			.forEach((overlap, f) => {
				if (overlap) {
					matrix[tortilla_edge_indices[ei]].push(f);
				}
			}));
		return matrix;
	};
	const make_tortilla_tortilla_faces_crossing = (graph, edges_faces_side, epsilon) => {
		make_tortilla_tortilla_edges_crossing(graph, edges_faces_side, epsilon);
		const tortillas_faces_crossing = make_tortillas_faces_crossing(graph, edges_faces_side, epsilon);
		const tortilla_faces_results = tortillas_faces_crossing
			.map((faces, e) => faces.map(face => [graph.edges_faces[e], [face, face]]))
			.reduce((a, b) => a.concat(b), []);
		return tortilla_faces_results;
	};

	var tortilla_tortilla = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make_tortilla_tortilla_edges_crossing: make_tortilla_tortilla_edges_crossing,
		make_tortillas_faces_crossing: make_tortillas_faces_crossing,
		make_tortilla_tortilla_faces_crossing: make_tortilla_tortilla_faces_crossing
	});

	const make_edges_faces_side = (graph, faces_center) => {
		const edges_origin = graph.edges_vertices
			.map(vertices => graph.vertices_coords[vertices[0]]);
		const edges_vector = graph.edges_vertices
			.map(vertices => math.core.subtract2(
				graph.vertices_coords[vertices[1]],
				graph.vertices_coords[vertices[0]],
			));
		return graph.edges_faces
			.map((faces, i) => faces
				.map(face => math.core.cross2(
					math.core.subtract2(
						faces_center[face],
						edges_origin[i]),
						edges_vector[i]))
				.map(cross => Math.sign(cross)));
	};
	const make_tacos_faces_side = (graph, faces_center, tacos_edges, tacos_faces) => {
		const tacos_edge_coords = tacos_edges
			.map(edges => graph.edges_vertices[edges[0]]
				.map(vertex => graph.vertices_coords[vertex]));
		const tacos_edge_origin = tacos_edge_coords
			.map(coords => coords[0]);
		const tacos_edge_vector = tacos_edge_coords
			.map(coords => math.core.subtract2(coords[1], coords[0]));
		const tacos_faces_center = tacos_faces
			.map(faces => faces
				.map(face_pair => face_pair
					.map(face => faces_center[face])));
		return tacos_faces_center
			.map((faces, i) => faces
				.map(pairs => pairs
					.map(center => math.core.cross2(
						math.core.subtract2(
							center,
							tacos_edge_origin[i]),
							tacos_edge_vector[i]))
					.map(cross => Math.sign(cross))));
	};

	const classify_faces_pair = (pair) => {
		if ((pair[0] === 1 && pair[1] === -1) ||
			(pair[0] === -1 && pair[1] === 1)) {
			return "both";
		}
		if ((pair[0] === 1 && pair[1] === 1)) { return "right"; }
		if ((pair[0] === -1 && pair[1] === -1)) { return "left"; }
	};
	const is_taco_taco = (classes) => {
		return classes[0] === classes[1] && classes[0] !== "both";
	};
	const is_tortilla_tortilla = (classes) => {
		return classes[0] === classes[1] && classes[0] === "both";
	};
	const is_taco_tortilla = (classes) => {
		return classes[0] !== classes[1]
			&& (classes[0] === "both" || classes[1] === "both");
	};
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
	const make_tacos_tortillas = (graph, epsilon = math.core.EPSILON) => {
		const faces_center = make_faces_center(graph);
		const edges_faces_side = make_edges_faces_side(graph, faces_center);
		const edge_edge_overlap_matrix = make_edges_edges_parallel_overlap(graph, epsilon);
		const tacos_edges = boolean_matrix_to_unique_index_pairs(edge_edge_overlap_matrix)
			.filter(pair => pair
				.map(edge => graph.edges_faces[edge].length > 1)
				.reduce((a, b) => a && b, true));
		const tacos_faces = tacos_edges
			.map(pair => pair
				.map(edge => graph.edges_faces[edge]));
		const tacos_faces_side = make_tacos_faces_side(graph, faces_center, tacos_edges, tacos_faces);
		const tacos_types = tacos_faces_side
			.map((faces, i) => faces
				.map(classify_faces_pair));
		const taco_taco = tacos_types
			.map((pair, i) => is_taco_taco(pair) ? tacos_faces[i] : undefined)
			.filter(a => a !== undefined);
		const tortilla_tortilla_aligned = tacos_types
			.map((pair, i) => is_tortilla_tortilla(pair) ? tacos_faces[i] : undefined)
			.map((pair, i) => make_tortilla_tortilla(pair, tacos_faces_side[i]))
			.filter(a => a !== undefined);
		const tortilla_tortilla_crossing = make_tortilla_tortilla_faces_crossing(graph, edges_faces_side, epsilon);
		const tortilla_tortilla = tortilla_tortilla_aligned
			.concat(tortilla_tortilla_crossing);
		const taco_tortilla_aligned = tacos_types
			.map((pair, i) => is_taco_tortilla(pair)
				? make_taco_tortilla(tacos_faces[i], tacos_types[i], tacos_faces_side[i])
				: undefined)
			.filter(a => a !== undefined);
		const edges_faces_overlap = make_edges_faces_overlap(graph, epsilon);
		const edges_overlap_faces = boolean_matrix_to_indexed_array(edges_faces_overlap)
			.map((faces, e) => edges_faces_side[e].length > 1
				&& edges_faces_side[e][0] === edges_faces_side[e][1]
					? faces
					: []);
		const taco_tortillas_crossing = edges_overlap_faces
			.map((tortillas, edge) => ({ taco: graph.edges_faces[edge], tortillas }))
			.filter(el => el.tortillas.length);
		const taco_tortilla_crossing = taco_tortillas_crossing
			.map(el => el.tortillas
				.map(tortilla => ({ taco: [...el.taco], tortilla })))
			.reduce((a, b) => a.concat(b), []);
		const taco_tortilla = taco_tortilla_aligned
			.concat(taco_tortilla_crossing)
			.sort((a, b) => a.tortilla - b.tortilla);
		return {
			taco_taco,
			tortilla_tortilla,
			taco_tortilla,
		};
	};

	const make_transitivity_trios = (graph, overlap_matrix, faces_winding, epsilon = math.core.EPSILON) => {
		if (!overlap_matrix) {
			overlap_matrix = make_faces_faces_overlap(graph, epsilon);
		}
		if (!faces_winding) {
			faces_winding = make_faces_winding(graph);
		}
		const polygons = graph.faces_vertices
			.map(face => face
				.map(v => graph.vertices_coords[v]));
		polygons.forEach((face, i) => {
			if (!faces_winding[i]) { face.reverse(); }
		});
		const matrix = graph.faces_vertices.map(() => []);
		for (let i = 0; i < matrix.length - 1; i++) {
			for (let j = i + 1; j < matrix.length; j++) {
				if (!overlap_matrix[i][j]) { continue; }
				const polygon = math.core.intersect_polygon_polygon(polygons[i], polygons[j], epsilon);
				if (polygon) { matrix[i][j] = polygon; }
			}
		}
		const trios = [];
		for (let i = 0; i < matrix.length - 1; i++) {
			for (let j = i + 1; j < matrix.length; j++) {
				if (!matrix[i][j]) { continue; }
				for (let k = j + 1; k < matrix.length; k++) {
					if (i === k || j === k) { continue; }
					if (!overlap_matrix[i][k] || !overlap_matrix[j][k]) { continue; }
					const polygon = math.core.intersect_polygon_polygon(matrix[i][j], polygons[k], epsilon);
					if (polygon) { trios.push([i, j, k].sort((a, b) => a - b)); }
				}
			}
		}
		return trios;
	};

	const filter_transitivity = (transitivity_trios, tacos_tortillas) => {
		const tacos_trios = {};
		tacos_tortillas.taco_taco.map(tacos => [
			[tacos[0][0], tacos[0][1], tacos[1][0]],
			[tacos[0][0], tacos[0][1], tacos[1][1]],
			[tacos[0][0], tacos[1][0], tacos[1][1]],
			[tacos[0][1], tacos[1][0], tacos[1][1]],
		])
		.forEach(trios => trios
			.map(trio => trio
				.sort((a, b) => a - b)
				.join(" "))
			.forEach(key => { tacos_trios[key] = true; }));
		tacos_tortillas.taco_tortilla.map(el => [
			el.taco[0], el.taco[1], el.tortilla
		])
		.map(trio => trio
			.sort((a, b) => a - b)
			.join(" "))
		.forEach(key => { tacos_trios[key] = true; });
		return transitivity_trios
			.filter(trio => tacos_trios[trio.join(" ")] === undefined);
	};

	const to_signed_layer_convert = { 0:0, 1:1, 2:-1 };
	const to_unsigned_layer_convert = { 0:0, 1:1, "-1":2 };
	const unsigned_to_signed_conditions = (conditions) => {
		Object.keys(conditions).forEach(key => {
			conditions[key] = to_signed_layer_convert[conditions[key]];
		});
		return conditions;
	};
	const signed_to_unsigned_conditions = (conditions) => {
		Object.keys(conditions).forEach(key => {
			conditions[key] = to_unsigned_layer_convert[conditions[key]];
		});
		return conditions;
	};

	var general_global_solver = /*#__PURE__*/Object.freeze({
		__proto__: null,
		unsigned_to_signed_conditions: unsigned_to_signed_conditions,
		signed_to_unsigned_conditions: signed_to_unsigned_conditions
	});

	const refactor_pairs = (tacos_tortillas, transitivity_trios) => {
		const pairs = {};
		pairs.taco_taco = tacos_tortillas.taco_taco.map(el => [
			[el[0][0], el[0][1]],
			[el[1][0], el[1][1]],
			[el[1][0], el[0][1]],
			[el[0][0], el[1][1]],
			[el[0][0], el[1][0]],
			[el[0][1], el[1][1]],
		]);
		pairs.taco_tortilla = tacos_tortillas.taco_tortilla.map(el => [
			[el.taco[0], el.taco[1]],
			[el.taco[0], el.tortilla],
			[el.tortilla, el.taco[1]],
		]);
		pairs.tortilla_tortilla = tacos_tortillas.tortilla_tortilla.map(el => [
			[el[0][0], el[1][0]],
			[el[0][1], el[1][1]],
		]);
		pairs.transitivity = transitivity_trios.map(el => [
			[el[0], el[1]],
			[el[1], el[2]],
			[el[2], el[0]],
		]);
		return pairs;
	};
	const make_maps = tacos_face_pairs => tacos_face_pairs
		.map(face_pairs => {
			const keys_ordered = face_pairs.map(pair => pair[0] < pair[1]);
			const face_keys = face_pairs.map((pair, i) => keys_ordered[i]
				? `${pair[0]} ${pair[1]}`
				: `${pair[1]} ${pair[0]}`);
			return { face_keys, keys_ordered };
		});
	const make_taco_maps = (tacos_tortillas, transitivity_trios) => {
		const pairs = refactor_pairs(tacos_tortillas, transitivity_trios);
		return {
			taco_taco: make_maps(pairs.taco_taco),
			taco_tortilla: make_maps(pairs.taco_tortilla),
			tortilla_tortilla: make_maps(pairs.tortilla_tortilla),
			transitivity: make_maps(pairs.transitivity),
		};
	};

	const make_conditions = (graph, overlap_matrix, faces_winding) => {
		if (!faces_winding) {
			faces_winding = make_faces_winding(graph);
		}
		if (!overlap_matrix) {
			overlap_matrix = make_faces_faces_overlap(graph);
		}
		const conditions = {};
		const flip_condition = { 0:0, 1:2, 2:1 };
		boolean_matrix_to_unique_index_pairs(overlap_matrix)
			.map(pair => pair.join(" "))
			.forEach(key => { conditions[key] = 0; });
		const assignment_direction = { M: 1, m: 1, V: 2, v: 2 };
		graph.edges_faces.forEach((faces, edge) => {
			const assignment = graph.edges_assignment[edge];
			const local_order = assignment_direction[assignment];
			if (faces.length < 2 || local_order === undefined) { return; }
			const upright = faces_winding[faces[0]];
			const global_order = upright ? local_order : flip_condition[local_order];
			const key1 = `${faces[0]} ${faces[1]}`;
			const key2 = `${faces[1]} ${faces[0]}`;
			if (key1 in conditions) { conditions[key1] = global_order; }
			if (key2 in conditions) { conditions[key2] = flip_condition[global_order]; }
		});
		return conditions;
	};

	const taco_taco_valid_states = [
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
		const A = Array.from(key).map(char => parseInt(char));
		if (A.filter(x => x === 0).length !== t) { return; }
		states[t][key] = false;
		let solution = false;
		for (let i = 0; i < A.length; i++) {
			const modifications = [];
			if (A[i] !== 0) { continue; }
			for (let x = 1; x <= 2; x++) {
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
		const choose_count = valid_states[0].length;
		const states = Array
			.from(Array(choose_count + 1))
			.map(() => ({}));
		Array.from(Array( Math.pow(2, choose_count) ))
			.map((_, i) => i.toString(2))
			.map(str => Array.from(str).map(n => parseInt(n) + 1).join(""))
			.map(str => ("11111" + str).slice(-choose_count))
			.forEach(key => { states[0][key] = false; });
		valid_states.forEach(s => { states[0][s] = true; });
		Array.from(Array(choose_count))
			.map((_, i) => i + 1)
			.map(t => Array.from(Array( Math.pow(3, choose_count) ))
				.map((_, i) => i.toString(3))
				.map(str => ("000000" + str).slice(-choose_count))
				.forEach(key => check_state(states, t, key)));
		let outs = [];
		Array.from(Array(choose_count + 1))
			.map((_, i) => choose_count - i)
			.forEach(t => {
				const A = [];
				Object.keys(states[t]).forEach(key => {
					let out = states[t][key];
					if (out.constructor === Array) { out = out[0]; }
					A.push([key, out]);
				});
				outs = outs.concat(A);
			});
		outs.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
		const lookup = {};
		outs.forEach(el => { lookup[el[0]] = Object.freeze(el[1]); });
		return Object.freeze(lookup);
	};
	const slow_lookup = {
		taco_taco: make_lookup(taco_taco_valid_states),
		taco_tortilla: make_lookup(taco_tortilla_valid_states),
		tortilla_tortilla: make_lookup(tortilla_tortilla_valid_states),
		transitivity: make_lookup(transitivity_valid_states),
	};

	const taco_types$2 = Object.freeze(Object.keys(slow_lookup));
	const flip_conditions = { 0:0, 1:2, 2:1 };
	const fill_layers_from_conditions = (layers, maps, conditions, fill_indices) => {
		const changed = {};
		const iterators = fill_indices
			? fill_indices
			: Object.keys(layers);
		iterators.forEach(i => maps[i].face_keys
			.forEach((key, j) => {
				if (!(key in conditions)) {
					console.warn(key, "not in conditions");
					return;
				}
				if (conditions[key] !== 0) {
					const orientation = maps[i].keys_ordered[j]
						? conditions[key]
						: flip_conditions[conditions[key]];
					if (layers[i][j] !== 0 && layers[i][j] !== orientation) {
						throw "fill conflict";
					}
					layers[i][j] = orientation;
					changed[i] = true;
				}
			}));
		return changed;
	};
	const infer_next_steps = (layers, maps, lookup_table, changed_indices) => {
		const iterators = changed_indices
			? changed_indices
			: Object.keys(layers);
		return iterators.map(i => {
			const map = maps[i];
			const key = layers[i].join("");
			const next_step = lookup_table[key];
			if (next_step === false) { throw "unsolvable"; }
			if (next_step === true) { return; }
			if (layers[i][next_step[0]] !== 0 && layers[i][next_step[0]] !== next_step[1]) {
				throw "infer conflict";
			}
			layers[i][next_step[0]] = next_step[1];
			const condition_key = map.face_keys[next_step[0]];
			const condition_value = map.keys_ordered[next_step[0]]
				? next_step[1]
				: flip_conditions[next_step[1]];
			return [condition_key, condition_value];
		}).filter(a => a !== undefined);
	};
	const complete_suggestions_loop = (layers, maps, conditions, pair_layer_map) => {
		let next_steps;
		let next_steps_indices = {};
		do {
			try {
				const fill_changed = {};
				taco_types$2.forEach(taco_type => { fill_changed[taco_type] = {}; });
				for (let t = 0; t < taco_types$2.length; t++) {
					const type = taco_types$2[t];
					fill_changed[type] = fill_layers_from_conditions(layers[type], maps[type], conditions, next_steps_indices[type]);
				}
				taco_types$2.forEach(type => {
					fill_changed[type] = Object.keys(fill_changed[type]);
				});
				next_steps = taco_types$2
					.flatMap(type => infer_next_steps(layers[type], maps[type], slow_lookup[type], fill_changed[type]));
				next_steps.forEach(el => { conditions[el[0]] = el[1]; });
				taco_types$2.forEach(type => { next_steps_indices[type] = {}; });
				taco_types$2.forEach(taco_type => next_steps
					.forEach(el => pair_layer_map[taco_type][el[0]]
						.forEach(i => {
							next_steps_indices[taco_type][i] = true;
						})));
				taco_types$2.forEach(type => {
					next_steps_indices[type] = Object.keys(next_steps_indices[type]);
				});
			} catch (error) { return false; }
		} while (next_steps.length > 0);
		return true;
	};

	const hashCode = (string) => {
		let hash = 0;
		for (let i = 0; i < string.length; i++) {
			hash = ((hash << 5) - hash) + string.charCodeAt(i);
			hash |= 0;
		}
		return hash;
	};

	const count_zeros = conditions => Object
		.keys(conditions)
		.filter(key => conditions[key] === 0).length;
	const taco_types$1 = Object.freeze(Object.keys(slow_lookup));
	const duplicate_unsolved_layers$1 = (layers) => {
		const duplicate = {};
		taco_types$1.forEach(type => { duplicate[type] = []; });
		taco_types$1.forEach(type => layers[type]
			.forEach((layer, i) => {
				if (layer.indexOf(0) !== -1) {
					duplicate[type][i] = [...layer];
				}
			}));
		return duplicate;
	};
	const solver_single = (graph, maps, conditions) => {
		const startDate = new Date();
		let recurse_count = 0;
		let inner_loop_count = 0;
		const successes_hash = {};
		let layers = {
			taco_taco: maps.taco_taco.map(el => Array(6).fill(0)),
			taco_tortilla: maps.taco_tortilla.map(el => Array(3).fill(0)),
			tortilla_tortilla: maps.tortilla_tortilla.map(el => Array(2).fill(0)),
			transitivity: maps.transitivity.map(el => Array(3).fill(0)),
		};
		const pair_layer_map = {};
		taco_types$1.forEach(taco_type => { pair_layer_map[taco_type] = {}; });
		taco_types$1.forEach(taco_type => Object.keys(conditions)
			.forEach(pair => { pair_layer_map[taco_type][pair] = []; }));
		taco_types$1
			.forEach(taco_type => maps[taco_type]
				.forEach((el, i) => el.face_keys
					.forEach(pair => {
						pair_layer_map[taco_type][pair].push(i);
					})));
		if (!complete_suggestions_loop(layers, maps, conditions, pair_layer_map)) {
			return undefined;
		}
		let solution;
		do {
			recurse_count++;
			const zero_keys = Object.keys(conditions)
				.map(key => conditions[key] === 0 ? key : undefined)
				.filter(a => a !== undefined);
			if (zero_keys.length === 0) {
				solution = conditions;
				break;
			}
			const avoid = {};
			const successes = zero_keys
				.map((key, i) => [1, 2]
					.map(dir => {
						if (avoid[key] && avoid[key][dir]) { return; }
						const clone_conditions = JSON.parse(JSON.stringify(conditions));
						if (successes_hash[JSON.stringify(clone_conditions)]) {
							console.log("early hash caught!"); return;
						}
						const clone_layers = duplicate_unsolved_layers$1(layers);
						clone_conditions[key] = dir;
						inner_loop_count++;
						if (!complete_suggestions_loop(clone_layers, maps, clone_conditions, pair_layer_map)) {
							return undefined;
						}
						Object.keys(clone_conditions)
							.filter(key => conditions[key] === 0)
							.forEach(key => {
								if (!avoid[key]) { avoid[key] = {}; }
								avoid[key][dir] = true;
							});
						return {
							conditions: clone_conditions,
							layers: clone_layers,
							zero_count: count_zeros(clone_conditions),
						};
					})
					.filter(a => a !== undefined))
				.reduce((a, b) => a.concat(b), [])
				.sort((a, b) => b.zero_count - a.zero_count);
			const unique_successes = successes
				.map(success => JSON.stringify(success.conditions))
				.map(string => hashCode(string))
				.map((hash, i) => {
					if (successes_hash[hash]) { return; }
					successes_hash[hash] = successes[i];
					return successes[i];
				})
				.filter(a => a !== undefined);
			if (!unique_successes.length) {
				console.warn("layer solver, no solutions found");
				return;
			}
			conditions = unique_successes[0].conditions;
			layers = unique_successes[0].layers;
		} while (solution === undefined);
		unsigned_to_signed_conditions(solution);
		const duration = Date.now() - startDate;
		if (duration > 50) {
			console.log(`${duration}ms recurse_count`, recurse_count, "inner_loop_count", inner_loop_count);
		}
		return solution;
	};

	const taco_types = Object.freeze(Object.keys(slow_lookup));
	const duplicate_unsolved_layers = (layers) => {
		const duplicate = {};
		taco_types.forEach(type => { duplicate[type] = []; });
		taco_types.forEach(type => layers[type]
			.forEach((layer, i) => {
				if (layer.indexOf(0) !== -1) {
					duplicate[type][i] = [...layer];
				}
			}));
		return duplicate;
	};
	const recursive_solver = (graph, maps, conditions_start) => {
		const startDate = new Date();
		let recurse_count = 0;
		let inner_loop_count = 0;
		let avoidcount = 0;
		let failguesscount = 0;
		let clone_time = 0;
		let solve_time = 0;
		const pair_layer_map = {};
		taco_types.forEach(taco_type => { pair_layer_map[taco_type] = {}; });
		taco_types.forEach(taco_type => Object.keys(conditions_start)
			.forEach(pair => { pair_layer_map[taco_type][pair] = []; }));
		taco_types
			.forEach(taco_type => maps[taco_type]
				.forEach((el, i) => el.face_keys
					.forEach(pair => {
						pair_layer_map[taco_type][pair].push(i);
					})));
		const recurse = (layers, conditions) => {
			recurse_count++;
			const zero_keys = Object.keys(conditions)
				.map(key => conditions[key] === 0 ? key : undefined)
				.filter(a => a !== undefined);
			if (zero_keys.length === 0) { return [conditions]; }
			const avoid = {};
			const successes = zero_keys
				.map((key, i) => [1, 2]
					.map(dir => {
						if (avoid[key] && avoid[key][dir]) { avoidcount++; return; }
						const clone_start = new Date();
						const clone_conditions = JSON.parse(JSON.stringify(conditions));
						clone_time += (Date.now() - clone_start);
						const clone_layers = duplicate_unsolved_layers(layers);
						clone_conditions[key] = dir;
						inner_loop_count++;
						const solve_start = new Date();
						if (!complete_suggestions_loop(clone_layers, maps, clone_conditions, pair_layer_map)) {
							failguesscount++;
							solve_time += (Date.now() - solve_start);
							return;
						}
						solve_time += (Date.now() - solve_start);
						Object.keys(clone_conditions)
							.filter(key => conditions[key] === 0)
							.forEach(key => {
								if (!avoid[key]) { avoid[key] = {}; }
								avoid[key][dir] = true;
							});
						return { conditions: clone_conditions, layers: clone_layers };
					})
					.filter(a => a !== undefined))
				.reduce((a, b) => a.concat(b), []);
			return successes
				.map(success => recurse(success.layers, success.conditions))
				.reduce((a, b) => a.concat(b), []);
		};
		const layers_start = {
			taco_taco: maps.taco_taco.map(el => Array(6).fill(0)),
			taco_tortilla: maps.taco_tortilla.map(el => Array(3).fill(0)),
			tortilla_tortilla: maps.tortilla_tortilla.map(el => Array(2).fill(0)),
			transitivity: maps.transitivity.map(el => Array(3).fill(0)),
		};
		if (!complete_suggestions_loop(layers_start, maps, conditions_start, pair_layer_map)) {
			return [];
		}
		const solutions_before = recurse(layers_start, conditions_start);
		const successes_hash = {};
		const solutions = solutions_before
			.map(conditions => JSON.stringify(conditions))
			.map(string => hashCode(string))
			.map((hash, i) => {
				if (successes_hash[hash]) { return; }
				successes_hash[hash] = solutions_before[i];
				return solutions_before[i];
			})
			.filter(a => a !== undefined);
		for (let i = 0; i < solutions.length; i++) {
			unsigned_to_signed_conditions(solutions[i]);
		}
		const duration = Date.now() - startDate;
		if (duration > 50) {
			console.log(`${duration}ms recurses`, recurse_count, "inner loops", inner_loop_count, "avoided", avoidcount, "bad guesses", failguesscount, `solutions ${solutions_before.length}/${solutions.length}`, "durations: clone, solve", clone_time, solve_time);
		}
		return solutions;
	};

	const dividing_axis = (graph, line, conditions) => {
		const faces_side = make_faces_center_quick(graph)
			.map(center => math.core.subtract2(center, line.origin))
			.map(vector => math.core.cross2(line.vector, vector))
			.map(cross => Math.sign(cross));
		const sides = Object.keys(conditions)
			.map(key => {
				const pair = key.split(" ");
				if (conditions[key] === 0) { return }
				if (conditions[key] === 2) { pair.reverse(); }
				if (faces_side[pair[0]] === 1 && faces_side[pair[1]] === -1) {
					return true;
				}
				if (faces_side[pair[0]] === -1 && faces_side[pair[1]] === 1) {
					return false;
				}
			}).filter(a => a !== undefined);
		const is_valid = sides.reduce((a, b) => a && (b === sides[0]), true);
		if (!is_valid) { console.warn("line is not a dividing axis"); return; }
		const side = sides[0];
		Object.keys(conditions)
			.forEach(key => {
				const pair = key.split(" ");
				if (conditions[key] !== 0) { return }
				if (faces_side[pair[0]] === faces_side[pair[1]]) { return; }
				if (faces_side[pair[0]] === 1 && faces_side[pair[1]] === -1) {
					if (side) { conditions[key] = 1; }
					else      { conditions[key] = 2; }
				}
				if (faces_side[pair[0]] === -1 && faces_side[pair[1]] === 1) {
					if (side) { conditions[key] = 2; }
					else      { conditions[key] = 1; }
				}
			});
	};

	const make_maps_and_conditions = (graph, epsilon = 1e-6) => {
		const overlap_matrix = make_faces_faces_overlap(graph, epsilon);
		const faces_winding = make_faces_winding(graph);
		const conditions = make_conditions(graph, overlap_matrix, faces_winding);
		const tacos_tortillas = make_tacos_tortillas(graph, epsilon);
		const unfiltered_trios = make_transitivity_trios(graph, overlap_matrix, faces_winding, epsilon);
		const transitivity_trios = filter_transitivity(unfiltered_trios, tacos_tortillas);
		const maps = make_taco_maps(tacos_tortillas, transitivity_trios);
		return { maps, conditions };
	};
	const one_layer_conditions = (graph, epsilon = 1e-6) => {
		const data = make_maps_and_conditions(graph, epsilon);
		const solutions = solver_single(graph, data.maps, data.conditions);
		return solutions;
	};
	const all_layer_conditions = (graph, epsilon = 1e-6) => {
		const data = make_maps_and_conditions(graph, epsilon);
		const solutions = recursive_solver(graph, data.maps, data.conditions);
		solutions.certain = unsigned_to_signed_conditions(JSON.parse(JSON.stringify(data.conditions)));
		return solutions;
	};
	const make_maps_and_conditions_dividing_axis = (folded, cp, line, epsilon = 1e-6) => {
		const overlap_matrix = make_faces_faces_overlap(folded, epsilon);
		const faces_winding = make_faces_winding(folded);
		const conditions = make_conditions(folded, overlap_matrix, faces_winding);
		dividing_axis(cp, line, conditions);
		const tacos_tortillas = make_tacos_tortillas(folded, epsilon);
		const unfiltered_trios = make_transitivity_trios(folded, overlap_matrix, faces_winding, epsilon);
		const transitivity_trios = filter_transitivity(unfiltered_trios, tacos_tortillas);
		const maps = make_taco_maps(tacos_tortillas, transitivity_trios);
		return { maps, conditions };
	};
	const one_layer_conditions_with_axis = (folded, cp, line, epsilon = 1e-6) => {
		const data = make_maps_and_conditions_dividing_axis(folded, cp, line, epsilon);
		const solutions = solver_single(folded, data.maps, data.conditions);
		return solutions;
	};
	const all_layer_conditions_with_axis = (folded, cp, line, epsilon = 1e-6) => {
		const data = make_maps_and_conditions_dividing_axis(folded, cp, line, epsilon);
		const solutions = recursive_solver(folded, data.maps, data.conditions);
		solutions.certain = unsigned_to_signed_conditions(JSON.parse(JSON.stringify(data.conditions)));
		return solutions;
	};

	var global_layer_solvers = /*#__PURE__*/Object.freeze({
		__proto__: null,
		one_layer_conditions: one_layer_conditions,
		all_layer_conditions: all_layer_conditions,
		one_layer_conditions_with_axis: one_layer_conditions_with_axis,
		all_layer_conditions_with_axis: all_layer_conditions_with_axis
	});

	const topological_order = (conditions, graph) => {
		if (!conditions) { return []; }
		const faces_children = [];
		Object.keys(conditions).map(key => {
			const pair = key.split(" ").map(n => parseInt(n));
			if (conditions[key] === -1) { pair.reverse(); }
			if (faces_children[pair[0]] === undefined) {
				faces_children[pair[0]] = [];
			}
			faces_children[pair[0]].push(pair[1]);
		});
		if (graph && graph.faces_vertices) {
			graph.faces_vertices.forEach((_, f) => {
				if (faces_children[f] === undefined) {
					faces_children[f] = [];
				}
			});
		}
		const layers_face = [];
		const faces_visited = [];
		let protection = 0;
		for (let f = 0; f < faces_children.length; f++) {
			if (faces_visited[f]) { continue; }
			const stack = [f];
			while (stack.length && protection < faces_children.length * 2) {
				const stack_end = stack[stack.length - 1];
				if (faces_children[stack_end].length) {
					const next = faces_children[stack_end].pop();
					if (!faces_visited[next]) { stack.push(next); }
					continue;
				} else {
					layers_face.push(stack_end);
					faces_visited[stack_end] = true;
					stack.pop();
				}
				protection++;
			}
		}
		if (protection >= faces_children.length * 2) {
			console.warn("fix protection in topological order");
		}
		return layers_face;
	};

	const make_faces_layer = (graph, epsilon) => {
		const conditions = one_layer_conditions(graph, epsilon);
		return invert_map(topological_order(conditions, graph));
	};

	const make_faces_layers = (graph, epsilon) => {
		return all_layer_conditions(graph, epsilon)
			.map(conditions => topological_order(conditions, graph))
			.map(invert_map);
	};

	const flip_faces_layer = faces_layer => invert_map(
		invert_map(faces_layer).reverse()
	);

	const faces_layer_to_edges_assignments = (graph, faces_layer) => {
		const edges_assignment = [];
		const faces_winding = make_faces_winding(graph);
		const edges_faces = graph.edges_faces
			? graph.edges_faces
			: make_edges_faces(graph);
		edges_faces.forEach((faces, e) => {
			if (faces.length === 1) { edges_assignment[e] = "B"; }
			if (faces.length === 2) {
				const windings = faces.map(f => faces_winding[f]);
				if (windings[0] === windings[1]) { return "F"; }
				const layers = faces.map(f => faces_layer[f]);
				const local_dir = layers[0] < layers[1];
				const global_dir = windings[0] ? local_dir : !local_dir;
				edges_assignment[e] = global_dir ? "V" : "M";
			}
		});
		return edges_assignment;
	};

	var edges_assignments = /*#__PURE__*/Object.freeze({
		__proto__: null,
		faces_layer_to_edges_assignments: faces_layer_to_edges_assignments
	});

	const conditions_to_matrix = (conditions) => {
		const condition_keys = Object.keys(conditions);
		const face_pairs = condition_keys
			.map(key => key.split(" ").map(n => parseInt(n)));
		const faces = [];
		face_pairs
			.reduce((a, b) => a.concat(b), [])
			.forEach(f => faces[f] = undefined);
		const matrix = faces.map(() => []);
		face_pairs
			.map(([a, b]) => {
				matrix[a][b] = conditions[`${a} ${b}`];
				matrix[b][a] = -conditions[`${a} ${b}`];
			});
		return matrix;
	};

	const get_unassigned_indices = (edges_assignment) => edges_assignment
		.map((_, i) => i)
		.filter(i => edges_assignment[i] === "U" || edges_assignment[i] === "u");
	const maekawa_assignments = (vertices_edges_assignments) => {
		const unassigneds = get_unassigned_indices(vertices_edges_assignments);
		const permuts = Array.from(Array(2 ** unassigneds.length))
			.map((_, i) => i.toString(2))
			.map(l => Array(unassigneds.length - l.length + 1).join("0") + l)
			.map(str => Array.from(str).map(l => l === "0" ? "V" : "M"));
		const all = permuts.map(perm => {
			const array = vertices_edges_assignments.slice();
			unassigneds.forEach((index, i) => { array[index] = perm[i]; });
			return array;
		});
		if (vertices_edges_assignments.includes("B") ||
			vertices_edges_assignments.includes("b")) {
			return all;
		}
		const count_m = all.map(a => a.filter(l => l === "M" || l === "m").length);
		const count_v = all.map(a => a.filter(l => l === "V" || l === "v").length);
		return all.filter((_, i) => Math.abs(count_m[i] - count_v[i]) === 2);
	};

	const assignment_solver = (faces, assignments, epsilon) => {
		if (assignments == null) {
			assignments = faces.map(() => "U");
		}
		const all_assignments = maekawa_assignments(assignments);
		const layers = all_assignments
			.map(assigns => single_vertex_solver(faces, assigns, epsilon));
		return all_assignments
			.map((_, i) => i)
			.filter(i => layers[i].length > 0)
			.map(i => ({
				assignment: all_assignments[i],
				layer: layers[i],
			}));
	};

	var layer = Object.assign(Object.create(null), {
		make_faces_layer,
		make_faces_layers,
		flip_faces_layer,
		assignment_solver,
		single_vertex_solver,
		validate_layer_solver,
		validate_taco_taco_face_pairs,
		validate_taco_tortilla_strip,
		table: slow_lookup,
		make_conditions,
		dividing_axis,
		topological_order,
		conditions_to_matrix,
		make_tacos_tortillas,
		make_folded_strip_tacos,
		make_transitivity_trios,
	},
		global_layer_solvers,
		general_global_solver,
		edges_assignments,
		tortilla_tortilla,
		fold_assignments,
	);

	const odd_assignment = (assignments) => {
		let ms = 0;
		let vs = 0;
		for (let i = 0; i < assignments.length; i += 1) {
			if (assignments[i] === "M" || assignments[i] === "m") { ms += 1; }
			if (assignments[i] === "V" || assignments[i] === "v") { vs += 1; }
		}
		for (let i = 0; i < assignments.length; i += 1) {
			if (ms > vs && (assignments[i] === "V" || assignments[i] === "v")) { return i; }
			if (vs > ms && (assignments[i] === "M" || assignments[i] === "m")) { return i; }
		}
	};
	const single_vertex_fold_angles = (sectors, assignments, t = 0) => {
		const odd = odd_assignment(assignments);
		if (odd === undefined) { return; }
		const a = sectors[(odd + 1) % sectors.length];
		const b = sectors[(odd + 2) % sectors.length];
		const pbc = Math.PI * t;
		const cosE = -Math.cos(a)*Math.cos(b) + Math.sin(a)*Math.sin(b)*Math.cos(Math.PI - pbc);
		const res = Math.cos(Math.PI - pbc) - ((Math.sin(Math.PI - pbc) ** 2) * Math.sin(a) * Math.sin(b))/(1 - cosE);
		const pab = -Math.acos(res) + Math.PI;
		return odd % 2 === 0
			? [pab, pbc, pab, pbc].map((n, i) => odd === i ? -n : n)
			: [pbc, pab, pbc, pab].map((n, i) => odd === i ? -n : n);
	};

	const kawasaki_solutions = ({ vertices_coords, vertices_edges, edges_vertices, edges_vectors }, vertex) => {
		if (!edges_vectors) {
			edges_vectors = make_edges_vector({ vertices_coords, edges_vertices });
		}
		if (!vertices_edges) {
			vertices_edges = make_vertices_edges_unsorted({ edges_vertices });
		}
		const vectors = vertices_edges[vertex].map(i => edges_vectors[i]);
		const sortedVectors = math.core.counter_clockwise_order2(vectors)
			.map(i => vectors[i]);
		return kawasaki_solutions_vectors(sortedVectors);
	};

	var kawasaki_graph = /*#__PURE__*/Object.freeze({
		__proto__: null,
		kawasaki_solutions: kawasaki_solutions
	});

	var vertex = Object.assign(Object.create(null), {
		maekawa_assignments,
		fold_angles4: single_vertex_fold_angles,
	},
		kawasaki_math,
		kawasaki_graph,
		validate_single_vertex,
	);

	var ar = [
		null,
		"اصنع خطاً يمر بنقطتين",
		"اصنع خطاً عن طريق طي نقطة واحدة إلى أخرى",
		"اصنع خطاً عن طريق طي خط واحد على آخر",
		"اصنع خطاً يمر عبر نقطة واحدة ويجعل خطاً واحداً فوق نفسه",
		"اصنع خطاً يمر بالنقطة الأولى ويجعل النقطة الثانية على الخط",
		"اصنع خطاً يجلب النقطة الأولى إلى الخط الأول والنقطة الثانية إلى الخط الثاني",
		"اصنع خطاً يجلب نقطة إلى خط ويجعل خط ثاني فوق نفسه"
	];
	var de = [
		null,
		"Falte eine Linie durch zwei Punkte",
		"Falte zwei Punkte aufeinander",
		"Falte zwei Linien aufeinander",
		"Falte eine Linie auf sich selbst, falte dabei durch einen Punkt",
		"Falte einen Punkt auf eine Linie, falte dabei durch einen anderen Punkt",
		"Falte einen Punkt auf eine Linie und einen weiteren Punkt auf eine weitere Linie",
		"Falte einen Punkt auf eine Linie und eine weitere Linie in sich selbst zusammen"
	];
	var en$1 = [
		null,
		"fold a line through two points",
		"fold two points together",
		"fold two lines together",
		"fold a line on top of itself, creasing through a point",
		"fold a point to a line, creasing through another point",
		"fold a point to a line and another point to another line",
		"fold a point to a line and another line onto itself"
	];
	var es$1 = [
		null,
		"dobla una línea entre dos puntos",
		"dobla dos puntos juntos",
		"dobla y une dos líneas",
		"dobla una línea sobre sí misma, doblándola hacia un punto",
		"dobla un punto hasta una línea, doblándola a través de otro punto",
		"dobla un punto hacia una línea y otro punto hacia otra línea",
		"dobla un punto hacia una línea y otra línea sobre sí misma"
	];
	var fr = [
		null,
		"créez un pli passant par deux points",
		"pliez pour superposer deux points",
		"pliez pour superposer deux lignes",
		"rabattez une ligne sur elle-même à l'aide d'un pli qui passe par un point",
		"rabattez un point sur une ligne à l'aide d'un pli qui passe par un autre point",
		"rabattez un point sur une ligne et un autre point sur une autre ligne",
		"rabattez un point sur une ligne et une autre ligne sur elle-même"
	];
	var hi = [
		null,
		"एक क्रीज़ बनाएँ जो दो स्थानों से गुजरता है",
		"एक स्थान को दूसरे स्थान पर मोड़कर एक क्रीज़ बनाएँ",
		"एक रेखा पर दूसरी रेखा को मोड़कर क्रीज़ बनाएँ",
		"एक क्रीज़ बनाएँ जो एक स्थान से गुजरता है और एक रेखा को स्वयं के ऊपर ले आता है",
		"एक क्रीज़ बनाएँ जो पहले स्थान से गुजरता है और दूसरे स्थान को रेखा पर ले आता है",
		"एक क्रीज़ बनाएँ जो पहले स्थान को पहली रेखा पर और दूसरे स्थान को दूसरी रेखा पर ले आता है",
		"एक क्रीज़ बनाएँ जो एक स्थान को एक रेखा पर ले आता है और दूसरी रेखा को स्वयं के ऊपर ले आता है"
	];
	var jp = [
		null,
		"2点に沿って折り目を付けます",
		"2点を合わせて折ります",
		"2つの線を合わせて折ります",
		"点を通過させ、既にある線に沿って折ります",
		"点を線沿いに合わせ別の点を通過させ折ります",
		"線に向かって点を折り、同時にもう一方の線に向かってもう一方の点を折ります",
		"線に向かって点を折り、同時に別の線をその上に折ります"
	];
	var ko = [
		null,
		"두 점을 통과하는 선으로 접으세요",
		"두 점을 함께 접으세요",
		"두 선을 함께 접으세요",
		"그 위에 선을 접으면서 점을 통과하게 접으세요",
		"점을 선으로 접으면서, 다른 점을 지나게 접으세요",
		"점을 선으로 접고 다른 점을 다른 선으로 접으세요",
		"점을 선으로 접고 다른 선을 그 위에 접으세요"
	];
	var ms = [
		null,
		"lipat garisan melalui dua titik",
		"lipat dua titik bersama",
		"lipat dua garisan bersama",
		"lipat satu garisan di atasnya sendiri, melipat melalui satu titik",
		"lipat satu titik ke garisan, melipat melalui titik lain",
		"lipat satu titik ke garisan dan satu lagi titik ke garisan lain",
		"lipat satu titik ke garisan dan satu lagi garisan di atasnya sendiri"
	];
	var pt = [
		null,
		"dobre uma linha entre dois pontos",
		"dobre os dois pontos para uni-los",
		"dobre as duas linhas para uni-las",
		"dobre uma linha sobre si mesma, criando uma dobra ao longo de um ponto",
		"dobre um ponto até uma linha, criando uma dobra ao longo de outro ponto",
		"dobre um ponto até uma linha e outro ponto até outra linha",
		"dobre um ponto até uma linha e outra linha sobre si mesma"
	];
	var ru = [
		null,
		"сложите линию через две точки",
		"сложите две точки вместе",
		"сложите две линии вместе",
		"сверните линию сверху себя, сгибая через точку",
		"сложите точку в линию, сгибая через другую точку",
		"сложите точку в линию и другую точку в другую линию",
		"сложите точку в линию и другую линию на себя"
	];
	var tr = [
		null,
		"iki noktadan geçen bir çizgi boyunca katla",
		"iki noktayı birbirine katla",
		"iki çizgiyi birbirine katla",
		"bir noktadan kıvırarak kendi üzerindeki bir çizgi boyunca katla",
		"başka bir noktadan kıvırarak bir noktayı bir çizgiye katla",
		"bir noktayı bir çizgiye ve başka bir noktayı başka bir çizgiye katla",
		"bir noktayı bir çizgiye ve başka bir çizgiyi kendi üzerine katla"
	];
	var vi = [
		null,
		"tạo một nếp gấp đi qua hai điểm",
		"tạo nếp gấp bằng cách gấp một điểm này sang điểm khác",
		"tạo nếp gấp bằng cách gấp một đường lên một đường khác",
		"tạo một nếp gấp đi qua một điểm và đưa một đường lên trên chính nó",
		"tạo một nếp gấp đi qua điểm đầu tiên và đưa điểm thứ hai lên đường thẳng",
		"tạo một nếp gấp mang điểm đầu tiên đến đường đầu tiên và điểm thứ hai cho đường thứ hai",
		"tạo một nếp gấp mang lại một điểm cho một đường và đưa một đường thứ hai lên trên chính nó"
	];
	var zh$1 = [
		null,
		"通過兩點折一條線",
		"將兩點折疊起來",
		"將兩條線折疊在一起",
		"通過一個點折疊一條線在自身上面",
		"將一個點，通過另一個點折疊成一條線，",
		"將一個點折疊為一條線，再將另一個點折疊到另一條線",
		"將一個點折疊成一條線，另一條線折疊到它自身上"
	];
	var axioms = {
		ar: ar,
		de: de,
		en: en$1,
		es: es$1,
		fr: fr,
		hi: hi,
		jp: jp,
		ko: ko,
		ms: ms,
		pt: pt,
		ru: ru,
		tr: tr,
		vi: vi,
		zh: zh$1
	};

	var es = {
		fold: {
			verb: "",
			noun: "doblez"
		},
		valley: "doblez de valle",
		mountain: "doblez de montaña",
		inside: "",
		outside: "",
		open: "",
		closed: "",
		rabbit: "",
		rabbit2: "",
		petal: "",
		squash: "",
		flip: "dale la vuelta a tu papel"
	};
	var en = {
		fold: {
			verb: "fold",
			noun: "crease"
		},
		valley: "valley fold",
		mountain: "mountain fold",
		inside: "inside reverse fold",
		outside: "outside reverse fold",
		open: "open sink",
		closed: "closed sink",
		rabbit: "rabbit ear fold",
		rabbit2: "double rabbit ear fold",
		petal: "petal fold",
		squash: "squash fold",
		flip: "flip over"
	};
	var zh = {
		fold: {
			verb: "",
			noun: ""
		},
		valley: "谷摺",
		mountain: "山摺",
		inside: "內中割摺",
		outside: "外中割摺",
		open: "開放式沉壓摺",
		closed: "封閉式沉壓摺",
		rabbit: "兔耳摺",
		rabbit2: "雙兔耳摺",
		petal: "花瓣摺",
		blintz: "坐墊基",
		squash: "壓摺",
		flip: ""
	};
	var folds = {
		es: es,
		en: en,
		zh: zh
	};

	var text = {
		axioms,
		folds,
	};

	const use = function (library) {
		if (library == null || typeof library.linker !== "function") {
			return;
		}
		library.linker(this);
	};

	const vertices_circle = (graph, attributes = {}) => {
		const g = root.svg.g();
		if (!graph || !graph.vertices_coords) { return g; }
		graph.vertices_coords
			.map(v => root.svg.circle(v[0], v[1], 0.01))
			.forEach(v => g.appendChild(v));
		g.setAttributeNS(null, "fill", _none);
		Object.keys(attributes)
			.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
		return g;
	};

	const GROUP_FOLDED = {};
	const GROUP_FLAT = {
		stroke: _black,
	};
	const STYLE_FOLDED = {};
	const STYLE_FLAT = {
		M: { stroke: "red" },
		m: { stroke: "red" },
		V: { stroke: "blue" },
		v: { stroke: "blue" },
		F: { stroke: "lightgray" },
		f: { stroke: "lightgray" },
	};
	const edges_assignment_indices = (graph) => {
		const assignment_indices = { u:[], f:[], v:[], m:[], b:[] };
		const lowercase_assignment = graph[_edges_assignment]
			.map(a => edges_assignment_to_lowercase[a]);
		graph[_edges_vertices]
			.map((_, i) => lowercase_assignment[i] || "u")
			.forEach((a, i) => assignment_indices[a].push(i));
		return assignment_indices;
	};
	const edges_coords = ({ vertices_coords, edges_vertices }) => {
		if (!vertices_coords || !edges_vertices) { return []; }
		return edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
	};
	const segment_to_path = s => `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;
	const edges_path_data = (graph) => edges_coords(graph)
		.map(segment => segment_to_path(segment)).join("");
	const edges_path_data_assign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
		if (!vertices_coords || !edges_vertices) { return {}; }
		if (!edges_assignment) {
			return ({ u: edges_path_data({ vertices_coords, edges_vertices }) });
		}
		const data = edges_assignment_indices({ vertices_coords, edges_vertices, edges_assignment });
		Object.keys(data).forEach(key => {
			data[key] = edges_path_data({
				vertices_coords,
				edges_vertices: data[key].map(i => edges_vertices[i]),
			});
		});
		Object.keys(data).forEach(key => {
			if (data[key] === "") { delete data[key]; }
		});
		return data;
	};
	const edges_paths_assign = ({ vertices_coords, edges_vertices, edges_assignment }) => {
		const data = edges_path_data_assign({ vertices_coords, edges_vertices, edges_assignment });
		Object.keys(data).forEach(assignment => {
			const path = root.svg.path(data[assignment]);
			path.setAttributeNS(null, _class, edges_assignment_names[assignment]);
			data[assignment] = path;
		});
		return data;
	};
	const apply_style$2 = (el, attributes = {}) => Object.keys(attributes)
		.forEach(key => el.setAttributeNS(null, key, attributes[key]));
	const edges_paths = (graph, attributes = {}) => {
		const group = root.svg.g();
		if (!graph) { return group; }
		const isFolded = is_folded_form(graph);
		const paths = edges_paths_assign(graph);
		Object.keys(paths).forEach(key => {
			paths[key].setAttributeNS(null, _class, edges_assignment_names[key]);
			apply_style$2(paths[key], isFolded ? STYLE_FOLDED[key] : STYLE_FLAT[key]);
			apply_style$2(paths[key], attributes[key]);
			apply_style$2(paths[key], attributes[edges_assignment_names[key]]);
			group.appendChild(paths[key]);
			Object.defineProperty(group, edges_assignment_names[key], { get: () => paths[key] });
		});
		apply_style$2(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
		apply_style$2(group, attributes.stroke ? { stroke: attributes.stroke } : {});
		return group;
	};
	const angle_to_opacity = (foldAngle) => (Math.abs(foldAngle) / 180);
	const edges_lines = (graph, attributes = {}) => {
		const group = root.svg.g();
		if (!graph) { return group; }
		const isFolded = is_folded_form(graph);
		const edges_assignment = (graph.edges_assignment
			? graph.edges_assignment
			: make_edges_assignment(graph))
			.map(assign => edges_assignment_to_lowercase[assign]);
		const groups_by_key = {};
		["b", "m", "v", "f", "u"].forEach(k => {
			const child_group = root.svg.g();
			group.appendChild(child_group);
			child_group.setAttributeNS(null, _class, edges_assignment_names[k]);
			apply_style$2(child_group, isFolded ? STYLE_FOLDED[k] : STYLE_FLAT[k]);
			apply_style$2(child_group, attributes[edges_assignment_names[k]]);
			Object.defineProperty(group, edges_assignment_names[k], {
				get: () => child_group
			});
			groups_by_key[k] = child_group;
		});
		const lines = graph.edges_vertices
			.map(ev => ev.map(v => graph.vertices_coords[v]))
			.map(l => root.svg.line(l[0][0], l[0][1], l[1][0], l[1][1]));
		if (graph.edges_foldAngle) {
			lines.forEach((line, i) => {
				const angle = graph.edges_foldAngle[i];
				if (angle === 0 || angle === 180 || angle === -180) { return;}
				line.setAttributeNS(null, "opacity", angle_to_opacity(angle));
			});
		}
		lines.forEach((line, i) => groups_by_key[edges_assignment[i]]
			.appendChild(line));
		apply_style$2(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
		apply_style$2(group, attributes.stroke ? { stroke: attributes.stroke } : {});
		return group;
	};
	const draw_edges = (graph, attributes) => edges_foldAngle_all_flat(graph)
		? edges_paths(graph, attributes)
		: edges_lines(graph, attributes);

	const FACE_STYLE_FOLDED_ORDERED = {
		back: { fill: _white },
		front: { fill: "#ddd" }
	};
	const FACE_STYLE_FOLDED_UNORDERED = {
		back: { opacity: 0.1 },
		front: { opacity: 0.1 }
	};
	const FACE_STYLE_FLAT = {
	};
	const GROUP_STYLE_FOLDED_ORDERED = {
		stroke: _black,
		"stroke-linejoin": "bevel"
	};
	const GROUP_STYLE_FOLDED_UNORDERED = {
		stroke: _none,
		fill: _black,
		"stroke-linejoin": "bevel"
	};
	const GROUP_STYLE_FLAT = {
		fill: _none
	};
	const faces_sorted_by_layer = function (faces_layer) {
		return faces_layer.map((layer, i) => ({ layer, i }))
			.sort((a, b) => a.layer - b.layer)
			.map(el => el.i);
	};
	const apply_style$1 = (el, attributes = {}) => Object.keys(attributes)
		.forEach(key => el.setAttributeNS(null, key, attributes[key]));
	const finalize_faces = (graph, svg_faces, group, attributes) => {
		const isFolded = is_folded_form(graph);
		const orderIsCertain = graph[_faces_layer] != null
			&& graph[_faces_layer].length === graph[_faces_vertices].length;
		const classNames = [[_front], [_back]];
		const faces_winding = make_faces_winding(graph);
		faces_winding.map(w => (w ? classNames[0] : classNames[1]))
			.forEach((className, i) => {
				svg_faces[i].setAttributeNS(null, _class, className);
				apply_style$1(svg_faces[i], isFolded
					? (orderIsCertain
						? FACE_STYLE_FOLDED_ORDERED[className]
						: FACE_STYLE_FOLDED_UNORDERED[className])
					: FACE_STYLE_FLAT[className]);
				apply_style$1(svg_faces[i], attributes[className]);
			});
		const facesInOrder = (orderIsCertain
			? faces_sorted_by_layer(graph[_faces_layer]).map(i => svg_faces[i])
			: svg_faces);
		facesInOrder.forEach(face => group.appendChild(face));
		Object.defineProperty(group, _front, {
			get: () => svg_faces.filter((_, i) => faces_winding[i]),
		});
		Object.defineProperty(group, _back, {
			get: () => svg_faces.filter((_, i) => !faces_winding[i]),
		});
		apply_style$1(group, isFolded
			? (orderIsCertain ? GROUP_STYLE_FOLDED_ORDERED : GROUP_STYLE_FOLDED_UNORDERED)
			: GROUP_STYLE_FLAT);
		return group;
	};
	const faces_vertices_polygon = (graph, attributes = {}) => {
		const g = root.svg.g();
		if (!graph || !graph.vertices_coords || !graph.faces_vertices) { return g; }
		const svg_faces = graph.faces_vertices
			.map(fv => fv.map(v => [0, 1].map(i => graph.vertices_coords[v][i])))
			.map(face => root.svg.polygon(face));
		svg_faces.forEach((face, i) => face.setAttributeNS(null, _index, i));
		g.setAttributeNS(null, "fill", _white);
		return finalize_faces(graph, svg_faces, g, attributes);
	};
	const faces_edges_polygon = function (graph, attributes = {}) {
		const g = root.svg.g();
		if (!graph
			|| _faces_edges in graph === false
			|| _edges_vertices in graph === false
			|| _vertices_coords in graph === false) {
			return g;
		}
		const svg_faces = graph[_faces_edges]
			.map(face_edges => face_edges
				.map(edge => graph[_edges_vertices][edge])
				.map((vi, i, arr) => {
					const next = arr[(i + 1) % arr.length];
					return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
				}).map(v => [0, 1].map(i => graph[_vertices_coords][v][i])))
			.map(face => root.svg.polygon(face));
		svg_faces.forEach((face, i) => face.setAttributeNS(null, _index, i));
		g.setAttributeNS(null, "fill", "white");
		return finalize_faces(graph, svg_faces, g, attributes);
	};

	const FOLDED = {
		fill: _none,
	};
	const FLAT = {
		stroke: _black,
		fill: _white,
	};
	const apply_style = (el, attributes = {}) => Object.keys(attributes)
		.forEach(key => el.setAttributeNS(null, key, attributes[key]));
	const boundaries_polygon = (graph, attributes = {}) => {
		const g = root.svg.g();
		if (!graph || !graph.vertices_coords || !graph.edges_vertices || !graph.edges_assignment) { return g; }
		const boundary = get_boundary(graph)
			.vertices
			.map(v => [0, 1].map(i => graph.vertices_coords[v][i]));
		if (boundary.length === 0) { return g; }
		const poly = root.svg.polygon(boundary);
		poly.setAttributeNS(null, _class, _boundary);
		g.appendChild(poly);
		apply_style(g, is_folded_form(graph) ? FOLDED : FLAT);
		Object.keys(attributes)
			.forEach(attr => g.setAttributeNS(null, attr, attributes[attr]));
		return g;
	};

	const faces_draw_function = (graph, options) => (
		graph != null && graph[_faces_vertices] != null
			? faces_vertices_polygon(graph, options)
			: faces_edges_polygon(graph, options));
	const svg_draw_func = {
		vertices: vertices_circle,
		edges: draw_edges,
		faces: faces_draw_function,
		boundaries: boundaries_polygon
	};
	const draw_group = (key, graph, options) => {
		const group = options === false ? (root.svg.g()) : svg_draw_func[key](graph, options);
		group.setAttributeNS(null, _class, key);
		return group;
	};
	const DrawGroups = (graph, options = {}) => [
		_boundaries,
		_faces,
		_edges,
		_vertices].map(key => draw_group(key, graph, options[key]));
	[_boundaries,
		_faces,
		_edges,
		_vertices,
	].forEach(key => {
		DrawGroups[key] = function (graph, options = {}) {
			return draw_group(key, graph, options[key]);
		};
	});

	const linker = function (library) {
		library.graph.svg = this;
		const graphProtoMethods = {
			svg: this
		};
		Object.keys(graphProtoMethods).forEach(key => {
			library.graph.prototype[key] = function () {
				return graphProtoMethods[key](this, ...arguments);
			};
		});
	};

	const DEFAULT_STROKE_WIDTH = 1 / 100;
	const DEFAULT_CIRCLE_RADIUS = 1 / 50;
	const get_bounding_rect = ({ vertices_coords }) => {
		if (vertices_coords == null || vertices_coords.length === 0) {
			return undefined;
		}
		const min = Array(2).fill(Infinity);
		const max = Array(2).fill(-Infinity);
		vertices_coords.forEach(v => {
			if (v[0] < min[0]) { min[0] = v[0]; }
			if (v[0] > max[0]) { max[0] = v[0]; }
			if (v[1] < min[1]) { min[1] = v[1]; }
			if (v[1] > max[1]) { max[1] = v[1]; }
		});
		const invalid = isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1]);
		return (invalid
			? undefined
			: [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
	};
	const getViewBox$1 = (graph) => {
		const viewBox = get_bounding_rect(graph);
		return viewBox === undefined
			? ""
			: viewBox.join(" ");
	};
	const setR = (group, radius) => {
		for (let i = 0; i < group.childNodes.length; i++) {
			group.childNodes[i].setAttributeNS(null, "r", radius);
		}
	};
	const findSVGInParents = (element) => {
		if ((element.nodeName || "").toUpperCase() === "SVG") { return element; }
		return element.parentNode ? findSVGInParents(element.parentNode) : undefined;
	};
	const applyTopLevelOptions = (element, groups, graph, options) => {
		if (!(options.strokeWidth || options.viewBox || groups[3].length)) { return; }
		const bounds = get_bounding_rect(graph);
		const vmax = Math.max(bounds[2], bounds[3]);
		const svgElement = findSVGInParents(element);
		if (svgElement && options.viewBox) {
			const viewBoxValue = bounds ? bounds.join(" ") : "";
			svgElement.setAttributeNS(null, "viewBox", viewBoxValue);
		}
		if (options.strokeWidth || options["stroke-width"]) {
			const strokeWidth = options.strokeWidth ? options.strokeWidth : options["stroke-width"];
			const strokeWidthValue = typeof strokeWidth === "number"
				? vmax * strokeWidth
				: vmax * DEFAULT_STROKE_WIDTH;
			element.setAttributeNS(null, "stroke-width", strokeWidthValue);
		}
		if (groups[3].length) {
			const radius = typeof options.radius === "number"
				? vmax * options.radius
				: vmax * DEFAULT_CIRCLE_RADIUS;
			setR(groups[3], radius);
		}
	};
	const drawInto = (element, graph, options = {}) => {
		const groups = DrawGroups(graph, options);
		groups.filter(group => group.childNodes.length > 0)
			.forEach(group => element.appendChild(group));
		applyTopLevelOptions(element, groups, graph, options);
		Object.keys(DrawGroups)
			.filter(key => element[key] == null)
			.forEach((key, i) => Object.defineProperty(element, key, { get: () => groups[i] }));
		return element;
	};
	const FOLDtoSVG = (graph, options) => drawInto(root.svg(), graph, options);
	Object.keys(DrawGroups).forEach(key => { FOLDtoSVG[key] = DrawGroups[key]; });
	FOLDtoSVG.drawInto = drawInto;
	FOLDtoSVG.getViewBox = getViewBox$1;
	Object.defineProperty(FOLDtoSVG, "linker", {
		enumerable: false,
		value: linker.bind(FOLDtoSVG),
	});

	const SVG_Constructor = {
		init: () => {},
	};
	function SVG () {
		return SVG_Constructor.init(...arguments);
	}
	const str_class = "class";
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
	const str_tail = "tail";
	var detect = {
		isBrowser: typeof window !== str_undefined
			&& typeof window.document !== str_undefined,
		isNode: typeof process !== str_undefined
			&& process.versions != null
			&& process.versions.node != null,
		isWebWorker: typeof self === str_object
			&& self.constructor
			&& self.constructor.name === "DedicatedWorkerGlobalScope",
	};
	const SVGWindow = (function () {
		let win = {};
		if (detect.isNode) {
			const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");
			win.DOMParser = DOMParser;
			win.XMLSerializer = XMLSerializer;
			win.document = new DOMParser().parseFromString(
				"<!DOCTYPE html><title>.</title>", "text/html");
		} else if (detect.isBrowser) {
			win = window;
		}
		return win;
	}());
	var NS = "http://www.w3.org/2000/svg";
	var NodeNames = {
		s: [
			"svg",
		],
		d: [
			"defs",
		],
		h: [
			"desc",
			"filter",
			"metadata",
			"style",
			"script",
			"title",
			"view",
		],
		c: [
			"cdata",
		],
		g: [
			"g",
		],
		v: [
			"circle",
			"ellipse",
			"line",
			"path",
			"polygon",
			"polyline",
			"rect",
		],
		t: [
			"text",
		],
		i: [
			"marker",
			"symbol",
			"clipPath",
			"mask",
		],
		p: [
			"linearGradient",
			"radialGradient",
			"pattern",
		],
		cT: [
			"textPath",
			"tspan",
		],
		cG: [
			"stop",
		],
		cF: [
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
	};
	const vec = (a, d) => [Math.cos(a) * d, Math.sin(a) * d];
	const arcPath = (x, y, radius, startAngle, endAngle, includeCenter = false) => {
		if (endAngle == null) { return ""; }
		const start = vec(startAngle, radius);
		const end = vec(endAngle, radius);
		const arcVec = [end[0] - start[0], end[1] - start[1]];
		const py = start[0] * end[1] - start[1] * end[0];
		const px = start[0] * end[0] + start[1] * end[1];
		const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
		let d = (includeCenter
			? `M ${x},${y} l ${start[0]},${start[1]} `
			: `M ${x+start[0]},${y+start[1]} `);
		d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
		if (includeCenter) { d += " Z"; }
		return d;
	};
	const arcArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, false)];
	var Arc = {
		arc: {
			nodeName: str_path,
			attributes: ["d"],
			args: arcArguments,
			methods: {
				setArc: (el, ...args) => el.setAttribute("d", arcArguments(...args)),
			}
		}
	};
	const wedgeArguments = (a, b, c, d, e) => [arcPath(a, b, c, d, e, true)];
	var Wedge = {
		wedge: {
			nodeName: str_path,
			args: wedgeArguments,
			attributes: ["d"],
			methods: {
				setArc: (el, ...args) => el.setAttribute("d", wedgeArguments(...args)),
			}
		}
	};
	const COUNT = 128;
	const parabolaArguments = (x = -1, y = 0, width = 2, height = 1) => Array
		.from(Array(COUNT + 1))
		.map((_, i) => (i - (COUNT)) / COUNT * 2 + 1)
		.map(i => [
			x + (i + 1) * width * 0.5,
			y + (i ** 2) * height
		]);
	const parabolaPathString = (a, b, c, d) => [
		parabolaArguments(a, b, c, d).map(n => `${n[0]},${n[1]}`).join(" ")
	];
	var Parabola = {
		parabola: {
			nodeName: "polyline",
			attributes: [str_points],
			args: parabolaPathString
		}
	};
	const regularPolygonArguments = (sides, cX, cY, radius) => {
		const origin = [cX, cY];
		return Array.from(Array(sides))
			.map((el, i) => 2 * Math.PI * i / sides)
			.map(a => [Math.cos(a), Math.sin(a)])
			.map(pts => origin.map((o, i) => o + radius * pts[i]));
	};
	const polygonPathString = (sides, cX = 0, cY = 0, radius = 1) => [
		regularPolygonArguments(sides, cX, cY, radius)
			.map(a => `${a[0]},${a[1]}`).join(" ")
	];
	var RegularPolygon = {
		regularPolygon: {
			nodeName: "polygon",
			attributes: [str_points],
			args: polygonPathString
		}
	};
	const roundRectArguments = (x, y, width, height, cornerRadius = 0) => {
		if (cornerRadius > width / 2) { cornerRadius = width / 2; }
		if (cornerRadius > height / 2) { cornerRadius = height / 2; }
		const w = width - cornerRadius * 2;
		const h = height - cornerRadius * 2;
		const s = `A${cornerRadius} ${cornerRadius} 0 0 1`;
		return [[`M${x + (width - w) / 2},${y}`, `h${w}`, s, `${x + width},${y + (height - h) / 2}`, `v${h}`, s, `${x + width - cornerRadius},${y + height}`, `h${-w}`, s, `${x},${y + height - cornerRadius}`, `v${-h}`, s, `${x + cornerRadius},${y}`].join(" ")];
	};
	var RoundRect = {
		roundRect: {
			nodeName: str_path,
			attributes: ["d"],
			args: roundRectArguments
		}
	};
	var Case = {
		toCamel: s => s
			.replace(/([-_][a-z])/ig, $1 => $1
			.toUpperCase()
			.replace("-", "")
			.replace("_", "")),
		 toKebab: s => s
			 .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
			 .replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
			 .toLowerCase(),
		capitalized: s => s
			.charAt(0).toUpperCase() + s.slice(1)
	};
	const svg_is_iterable = (obj) => {
		return obj != null && typeof obj[Symbol.iterator] === str_function;
	};
	const svg_semi_flatten_arrays = function () {
		switch (arguments.length) {
			case undefined:
			case 0: return Array.from(arguments);
			case 1: return svg_is_iterable(arguments[0]) && typeof arguments[0] !== str_string
				? svg_semi_flatten_arrays(...arguments[0])
				: [arguments[0]];
			default:
				return Array.from(arguments).map(a => (svg_is_iterable(a)
					? [...svg_semi_flatten_arrays(a)]
					: a));
		}
	};
	var coordinates = (...args) => {
		return args.filter(a => typeof a === str_number)
			.concat(
				args.filter(a => typeof a === str_object && a !== null)
					.map((el) => {
						if (typeof el.x === str_number) { return [el.x, el.y]; }
						if (typeof el[0] === str_number) { return [el[0], el[1]]; }
						return undefined;
					}).filter(a => a !== undefined)
					.reduce((a, b) => a.concat(b), [])
			);
	};
	const svg_magnitudeSq2 = (a) => (a[0] ** 2) + (a[1] ** 2);
	const svg_magnitude2 = (a) => Math.sqrt(svg_magnitudeSq2(a));
	const svg_distanceSq2 = (a, b) => svg_magnitudeSq2(svg_sub2(a, b));
	const svg_distance2 = (a, b) => Math.sqrt(svg_distanceSq2(a, b));
	const svg_add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
	const svg_sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
	const svg_scale2 = (a, s) => [a[0] * s, a[1] * s];
	var svg_algebra = Object.freeze({
		__proto__: null,
		svg_magnitudeSq2: svg_magnitudeSq2,
		svg_magnitude2: svg_magnitude2,
		svg_distanceSq2: svg_distanceSq2,
		svg_distance2: svg_distance2,
		svg_add2: svg_add2,
		svg_sub2: svg_sub2,
		svg_scale2: svg_scale2
	});
	const ends = [str_tail, str_head];
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
	};
	const setArrowheadOptions = (element, options, which) => {
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
	const setArrowStyle = (element, options = {}, which) => {
		const path = element.getElementsByClassName(`${str_arrow}-${which}`)[0];
		Object.keys(options)
			.map(key => ({ key, fn: path[Case.toCamel(key)] }))
			.filter(el => typeof el.fn === str_function)
			.forEach(el => el.fn(options[el.key]));
	};
	const redraw = (element) => {
		const paths = makeArrowPaths(element.options);
		Object.keys(paths)
			.map(path => ({
				path,
				element: element.getElementsByClassName(`${str_arrow}-${path}`)[0]
			}))
			.filter(el => el.element)
			.map(el => { el.element.setAttribute("d", paths[el.path]); return el; })
			.filter(el => element.options[el.path])
			.forEach(el => el.element.setAttribute(
				"visibility",
				element.options[el.path].visible
					? "visible"
					: "hidden"));
		return element;
	};
	const setPoints$3 = (element, ...args) => {
		element.options.points = coordinates(...svg_semi_flatten_arrays(...args)).slice(0, 4);
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
	var ArrowMethods = {
		setPoints: setPoints$3,
		points: setPoints$3,
		bend: bend$1,
		pinch: pinch$1,
		padding,
		head,
		tail,
		getLine,
		getHead,
		getTail,
	};
	const endOptions = () => ({
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
	});
	const arrowKeys = Object.keys(makeArrowOptions());
	const matchingOptions = (...args) => {
		for (let a = 0; a < args.length; a++) {
			if (typeof args[a] !== str_object) { continue; }
			const keys = Object.keys(args[a]);
			for (let i = 0; i < keys.length; i++) {
				if (arrowKeys.includes(keys[i])) {
					return args[a];
				}
			}
		}
	};
	const init = function (element, ...args) {
		element.setAttribute(str_class, str_arrow);
		const paths = ["line", str_tail, str_head]
			.map(key => SVG.path().setClass(`${str_arrow}-${key}`).appendTo(element));
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
	};
	var Arrow = {
		arrow: {
			nodeName: "g",
			attributes: [],
			args: () => [],
			methods: ArrowMethods,
			init,
		}
	};
	const svg_flatten_arrays = function () {
		return svg_semi_flatten_arrays(arguments).reduce((a, b) => a.concat(b), []);
	};
	const makeCurvePath = (endpoints = [], bend = 0, pinch = 0.5) => {
		const tailPt = [endpoints[0] || 0, endpoints[1] || 0];
		const headPt = [endpoints[2] || 0, endpoints[3] || 0];
		const vector = svg_sub2(headPt, tailPt);
		const midpoint = svg_add2(tailPt, svg_scale2(vector, 0.5));
		const perpendicular = [vector[1], -vector[0]];
		const bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, bend));
		const tailControl = svg_add2(tailPt, svg_scale2(svg_sub2(bezPoint, tailPt), pinch));
		const headControl = svg_add2(headPt, svg_scale2(svg_sub2(bezPoint, headPt), pinch));
		return `M${tailPt[0]},${tailPt[1]}C${tailControl[0]},${tailControl[1]} ${headControl[0]},${headControl[1]} ${headPt[0]},${headPt[1]}`;
	};
	const curveArguments = (...args) => [
		makeCurvePath(coordinates(...svg_flatten_arrays(...args)))
	];
	const getNumbersFromPathCommand = str => str
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
			? [move[move.length-2], move[move.length-1]]
			: [0, 0];
		const end = curve
			? [curve[curve.length-2], curve[curve.length-1]]
			: [0, 0];
		return [...start, ...end];
	};
	const setPoints$2 = (element, ...args) => {
		const coords = coordinates(...svg_flatten_arrays(...args)).slice(0, 4);
		element.setAttribute("d", makeCurvePath(coords, element._bend, element._pinch));
		return element;
	};
	const bend = (element, amount) => {
		element._bend = amount;
		return setPoints$2(element, ...getCurveEndpoints(element.getAttribute("d")));
	};
	const pinch = (element, amount) => {
		element._pinch = amount;
		return setPoints$2(element, ...getCurveEndpoints(element.getAttribute("d")));
	};
	var curve_methods = {
		setPoints: setPoints$2,
		bend,
		pinch,
	};
	var Curve = {
		curve: {
			nodeName: str_path,
			attributes: ["d"],
			args: curveArguments,
			methods: curve_methods
		}
	};
	const nodes = {};
	Object.assign(nodes,
		Arc,
		Wedge,
		Parabola,
		RegularPolygon,
		RoundRect,
		Arrow,
		Curve
	);
	const customPrimitives = Object.keys(nodes);
	const headerStuff = [NodeNames.h, NodeNames.p, NodeNames.i];
	const drawingShapes = [NodeNames.g, NodeNames.v, NodeNames.t, customPrimitives];
	const folders = {
		svg: [NodeNames.s, NodeNames.d].concat(headerStuff).concat(drawingShapes),
		g: drawingShapes,
		text: [NodeNames.cT],
		linearGradient: [NodeNames.cG],
		radialGradient: [NodeNames.cG],
		defs: headerStuff,
		filter: [NodeNames.cF],
		marker: drawingShapes,
		symbol: drawingShapes,
		clipPath: drawingShapes,
		mask: drawingShapes,
	};
	const nodesAndChildren = Object.create(null);
	Object.keys(folders).forEach((key) => {
		nodesAndChildren[key] = folders[key].reduce((a, b) => a.concat(b), []);
	});
	const viewBoxValue = function (x, y, width, height, padding = 0) {
		const scale = 1.0;
		const d = (width / scale) - width;
		const X = (x - d) - padding;
		const Y = (y - d) - padding;
		const W = (width + d * 2) + padding * 2;
		const H = (height + d * 2) + padding * 2;
		return [X, Y, W, H].join(" ");
	};
	function viewBox$1 () {
		const numbers = coordinates(...svg_flatten_arrays(arguments));
		if (numbers.length === 2) { numbers.unshift(0, 0); }
		return numbers.length === 4 ? viewBoxValue(...numbers) : undefined;
	}
	const cdata = (textContent) => (new SVGWindow.DOMParser())
		.parseFromString("<root></root>", "text/xml")
		.createCDATASection(`${textContent}`);
	const removeChildren = (element) => {
		while (element.lastChild) {
			element.removeChild(element.lastChild);
		}
		return element;
	};
	const appendTo = (element, parent) => {
		if (parent != null) {
			parent.appendChild(element);
		}
		return element;
	};
	const setAttributes = (element, attrs) => Object.keys(attrs)
		.forEach(key => element.setAttribute(Case.toKebab(key), attrs[key]));
	const moveChildren = (target, source) => {
		while (source.childNodes.length > 0) {
			const node = source.childNodes[0];
			source.removeChild(node);
			target.appendChild(node);
		}
		return target;
	};
	const clearSVG = (element) => {
		Array.from(element.attributes)
			.filter(a => a !== "xmlns")
			.forEach(attr => element.removeAttribute(attr.name));
		return removeChildren(element);
	};
	const assignSVG = (target, source) => {
		Array.from(source.attributes)
			.forEach(attr => target.setAttribute(attr.name, attr.value));
		return moveChildren(target, source);
	};
	var dom = {
		removeChildren,
		appendTo,
		setAttributes,
	};
	const filterWhitespaceNodes = (node) => {
		if (node === null) { return node; }
		for (let i = node.childNodes.length - 1; i >= 0; i -= 1) {
			const child = node.childNodes[i];
			if (child.nodeType === 3 && child.data.match(/^\s*$/)) {
				node.removeChild(child);
			}
			if (child.nodeType === 1) {
				filterWhitespaceNodes(child);
			}
		}
		return node;
	};
	const parse = string => (new SVGWindow.DOMParser())
		.parseFromString(string, "text/xml");
	const checkParseError = xml => {
		const parserErrors = xml.getElementsByTagName("parsererror");
		if (parserErrors.length > 0) {
			throw new Error(parserErrors[0]);
		}
		return filterWhitespaceNodes(xml.documentElement);
	};
	const async = function (input) {
		return new Promise((resolve, reject) => {
			if (typeof input === str_string || input instanceof String) {
				fetch(input)
					.then(response => response.text())
					.then(str => checkParseError(parse(str)))
					.then(xml => xml.nodeName === str_svg
						? xml
						: xml.getElementsByTagName(str_svg)[0])
					.then(svg => (svg == null
							? reject("valid XML found, but no SVG element")
							: resolve(svg)))
					.catch(err => reject(err));
			}
			else if (input instanceof SVGWindow.Document) {
				return asyncDone(input);
			}
		});
	};
	const sync = function (input) {
		if (typeof input === str_string || input instanceof String) {
			try {
				return checkParseError(parse(input));
			} catch (error) {
				return error;
			}
		}
		if (input.childNodes != null) {
			return input;
		}
	};
	const isFilename = input => typeof input === str_string
		&& /^[\w,\s-]+\.[A-Za-z]{3}$/.test(input)
		&& input.length < 10000;
	const Load = input => (isFilename(input)
		&& detect.isBrowser
		&& typeof SVGWindow.fetch === str_function
		? async(input)
		: sync(input));
	function vkXML (text, step) {
	  const ar = text.replace(/>\s{0,}</g, "><")
	    .replace(/</g, "~::~<")
	    .replace(/\s*xmlns\:/g, "~::~xmlns:")
	    .split("~::~");
	  const len = ar.length;
	  let inComment = false;
	  let deep = 0;
	  let str = "";
	  const space = (step != null && typeof step === "string" ? step : "\t");
	  const shift = ["\n"];
	  for (let si = 0; si < 100; si += 1) {
	    shift.push(shift[si] + space);
	  }
	  for (let ix = 0; ix < len; ix += 1) {
	    if (ar[ix].search(/<!/) > -1) {
	      str += shift[deep] + ar[ix];
	      inComment = true;
	      if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1
	        || ar[ix].search(/!DOCTYPE/) > -1) {
	        inComment = false;
	      }
	    } else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
	      str += ar[ix];
	      inComment = false;
	    } else if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix])
	      && /^<[\w:\-\.\,]+/.exec(ar[ix - 1])
	      == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace("/", "")) {
	      str += ar[ix];
	      if (!inComment) { deep -= 1; }
	    } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) === -1
	      && ar[ix].search(/\/>/) === -1) {
	      str = !inComment ? str += shift[deep++] + ar[ix] : str += ar[ix];
	    } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
	      str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
	    } else if (ar[ix].search(/<\//) > -1) {
	      str = !inComment ? str += shift[--deep] + ar[ix] : str += ar[ix];
	    } else if (ar[ix].search(/\/>/) > -1) {
	      str = !inComment ? str += shift[deep] + ar[ix] : str += ar[ix];
	    } else if (ar[ix].search(/<\?/) > -1) {
	      str += shift[deep] + ar[ix];
	    } else if (ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1) {
	      str += shift[deep] + ar[ix];
	    } else {
	      str += ar[ix];
	    }
	  }
	  return (str[0] === "\n") ? str.slice(1) : str;
	}
	const SAVE_OPTIONS = () => ({
		download: false,
		output: str_string,
		windowStyle: false,
		filename: "image.svg"
	});
	const getWindowStylesheets = function () {
		const css = [];
		if (SVGWindow.document.styleSheets) {
			for (let s = 0; s < SVGWindow.document.styleSheets.length; s += 1) {
				const sheet = SVGWindow.document.styleSheets[s];
				try {
					const rules = ("cssRules" in sheet) ? sheet.cssRules : sheet.rules;
					for (let r = 0; r < rules.length; r += 1) {
						const rule = rules[r];
						if ("cssText" in rule) {
							css.push(rule.cssText);
						} else {
							css.push(`${rule.selectorText} {\n${rule.style.cssText}\n}\n`);
						}
					}
				} catch (error) {
					console.warn(error);
				}
			}
		}
		return css.join("\n");
	};
	const downloadInBrowser = function (filename, contentsAsString) {
		const blob = new SVGWindow.Blob([contentsAsString], { type: "text/plain" });
		const a = SVGWindow.document.createElement("a");
		a.setAttribute("href", SVGWindow.URL.createObjectURL(blob));
		a.setAttribute("download", filename);
		SVGWindow.document.body.appendChild(a);
		a.click();
		SVGWindow.document.body.removeChild(a);
	};
	const save = function (svg, options) {
		options = Object.assign(SAVE_OPTIONS(), options);
		if (options.windowStyle) {
			const styleContainer = SVGWindow.document.createElementNS(NS, str_style);
			styleContainer.setAttribute("type", "text/css");
			styleContainer.innerHTML = getWindowStylesheets();
			svg.appendChild(styleContainer);
		}
		const source = (new SVGWindow.XMLSerializer()).serializeToString(svg);
		const formattedString = vkXML(source);
		if (options.download && detect.isBrowser && !detect.isNode) {
			downloadInBrowser(options.filename, formattedString);
		}
		return (options.output === str_svg ? svg : formattedString);
	};
	const setViewBox = (element, ...args) => {
		const viewBox = args.length === 1 && typeof args[0] === str_string
			? args[0]
			: viewBox$1(...args);
		if (viewBox) {
			element.setAttribute(str_viewBox, viewBox);
		}
		return element;
	};
	const getViewBox = function (element) {
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
	var viewBox = Object.freeze({
		__proto__: null,
		setViewBox: setViewBox,
		getViewBox: getViewBox,
		convertToViewBox: convertToViewBox
	});
	const loadSVG = (target, data) => {
		const result = Load(data);
		if (result == null) { return; }
		return (typeof result.then === str_function)
			? result.then(svg => assignSVG(target, svg))
			: assignSVG(target, result);
	};
	const getFrame = function (element) {
		const viewBox = getViewBox(element);
		if (viewBox !== undefined) {
			return viewBox;
		}
		if (typeof element.getBoundingClientRect === str_function) {
			const rr = element.getBoundingClientRect();
			return [rr.x, rr.y, rr.width, rr.height];
		}
		return [];
	};
	const setPadding = function (element, padding) {
		const viewBox = getViewBox(element);
		if (viewBox !== undefined) {
			setViewBox(element, ...[-padding, -padding, padding * 2, padding * 2]
				.map((nudge, i) => viewBox[i] + nudge));
		}
		return element;
	};
	const bgClass = "svg-background-rectangle";
	const background = function (element, color) {
		let backRect = Array.from(element.childNodes)
			.filter(child => child.getAttribute(str_class) === bgClass)
			.shift();
		if (backRect == null) {
			backRect = this.Constructor("rect", ...getFrame(element));
			backRect.setAttribute(str_class, bgClass);
			backRect.setAttribute(str_stroke, str_none);
			element.insertBefore(backRect, element.firstChild);
		}
		backRect.setAttribute(str_fill, color);
		return element;
	};
	const findStyleSheet = function (element) {
		const styles = element.getElementsByTagName(str_style);
		return styles.length === 0 ? undefined : styles[0];
	};
	const stylesheet = function (element, textContent) {
		let styleSection = findStyleSheet(element);
		if (styleSection == null) {
			styleSection = this.Constructor(str_style);
			element.insertBefore(styleSection, element.firstChild);
		}
		styleSection.textContent = "";
		styleSection.appendChild(cdata(textContent));
		return styleSection;
	};
	var methods$1 = {
		clear: clearSVG,
		size: setViewBox,
		setViewBox,
		getViewBox,
		padding: setPadding,
		background,
		getWidth: el => getFrame(el)[2],
		getHeight: el => getFrame(el)[3],
		stylesheet: function (el, text) { return stylesheet.call(this, el, text); },
		load: loadSVG,
		save: save,
	};
	const libraries = {
		math: {
			vector: (...args) => [...args]
		}
	};
	const categories = {
		move: ["mousemove", "touchmove"],
		press: ["mousedown", "touchstart"],
		release: ["mouseup", "touchend"]
	};
	const handlerNames = Object.values(categories)
		.reduce((a, b) => a.concat(b), []);
	const off = (element, handlers) => handlerNames.forEach((handlerName) => {
		handlers[handlerName].forEach(func => element.removeEventListener(handlerName, func));
		handlers[handlerName] = [];
	});
	const defineGetter = (obj, prop, value) => Object.defineProperty(obj, prop, {
		get: () => value,
		enumerable: true,
		configurable: true,
	});
	const assignPress = (e, startPoint) => {
		["pressX", "pressY"].filter(prop => !e.hasOwnProperty(prop))
			.forEach((prop, i) => defineGetter(e, prop, startPoint[i]));
		if (!e.hasOwnProperty("press")) {
			defineGetter(e, "press", libraries.math.vector(...startPoint));
		}
	};
	const TouchEvents = function (element) {
		let startPoint = [];
		const handlers = [];
		Object.keys(categories).forEach((key) => {
			categories[key].forEach((handler) => {
				handlers[handler] = [];
			});
		});
		const removeHandler = category => categories[category]
			.forEach(handlerName => handlers[handlerName]
				.forEach(func => element.removeEventListener(handlerName, func)));
		const categoryUpdate = {
			press: (e, viewPoint) => {
				startPoint = viewPoint;
				assignPress(e, startPoint);
			},
			release: () => {},
			move: (e, viewPoint) => {
				if (e.buttons > 0 && startPoint[0] === undefined) {
					startPoint = viewPoint;
				} else if (e.buttons === 0 && startPoint[0] !== undefined) {
					startPoint = [];
				}
				assignPress(e, startPoint);
			}
		};
		Object.keys(categories).forEach((category) => {
			const propName = "on" + Case.capitalized(category);
			Object.defineProperty(element, propName, {
				set: (handler) => (handler == null)
					? removeHandler(category)
					: categories[category].forEach((handlerName) => {
							const handlerFunc = (e) => {
								const pointer = (e.touches != null
									? e.touches[0]
									: e);
								if (pointer !== undefined) {
									const viewPoint = convertToViewBox(element, pointer.clientX, pointer.clientY)
										.map(n => isNaN(n) ? undefined : n);
									["x", "y"]
										.filter(prop => !e.hasOwnProperty(prop))
										.forEach((prop, i) => defineGetter(e, prop, viewPoint[i]));
									if (!e.hasOwnProperty("position")) {
										defineGetter(e, "position", libraries.math.vector(...viewPoint));
									}
									categoryUpdate[category](e, viewPoint);
								}
								handler(e);
							};
							if (element.addEventListener) {
								handlers[handlerName].push(handlerFunc);
								element.addEventListener(handlerName, handlerFunc);
							}
						}),
				enumerable: true
			});
		});
		Object.defineProperty(element, "off", { value: () => off(element, handlers) });
	};
	var UUID = () => Math.random()
		.toString(36)
		.replace(/[^a-z]+/g, '')
		.concat("aaaaa")
		.substr(0, 5);
	const Animation = function (element) {
		let start;
		const handlers = {};
		let frame = 0;
		let requestId;
		const removeHandlers = () => {
			if (SVGWindow.cancelAnimationFrame) {
				SVGWindow.cancelAnimationFrame(requestId);
			}
			Object.keys(handlers)
				.forEach(uuid => delete handlers[uuid]);
			start = undefined;
			frame = 0;
		};
		Object.defineProperty(element, "play", {
			set: (handler) => {
				removeHandlers();
				if (handler == null) { return; }
				const uuid = UUID();
				const handlerFunc = (e) => {
					if (!start) {
						start = e;
						frame = 0;
					}
					const progress = (e - start) * 0.001;
					handler({ time: progress, frame });
					frame += 1;
					if (handlers[uuid]) {
						requestId = SVGWindow.requestAnimationFrame(handlers[uuid]);
					}
				};
				handlers[uuid] = handlerFunc;
				if (SVGWindow.requestAnimationFrame) {
					requestId = SVGWindow.requestAnimationFrame(handlers[uuid]);
				}
			},
			enumerable: true
		});
		Object.defineProperty(element, "stop", { value: removeHandlers, enumerable: true });
	};
	const removeFromParent = svg => (svg && svg.parentNode
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
			}
		});
		const setPosition = function (...args) {
			coordinates(...svg_flatten_arrays(...args))
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
				set: (v) => { cp[key] = v; }
			}));
		Object.defineProperty(position, "remove", {
			value: () => {
				removeFromParent(cp.svg);
				position.delegate = undefined;
			}
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
	};
	var svgDef = {
		svg: {
			args: (...args) => [viewBox$1(coordinates(...args))].filter(a => a != null),
			methods: methods$1,
			init: (element, ...args) => {
				args.filter(a => typeof a === str_string)
					.forEach(string => loadSVG(element, string));
				args.filter(a => a != null)
					.filter(el => typeof el.appendChild === str_function)
					.forEach(parent => parent.appendChild(element));
				TouchEvents(element);
				Animation(element);
				applyControlsToSVG(element);
			}
		}
	};
	const loadGroup = (group, ...sources) => {
		const elements = sources.map(source => sync(source))
			.filter(a => a !== undefined);
		elements.filter(element => element.tagName === str_svg)
			.forEach(element => moveChildren(group, element));
		elements.filter(element => element.tagName !== str_svg)
			.forEach(element => group.appendChild(element));
		return group;
	};
	var gDef = {
		g: {
			init: loadGroup,
			methods: {
				load: loadGroup,
			}
		}
	};
	var attributes = Object.assign(Object.create(null), {
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
		clipPath: [
			str_id,
			"clip-rule",
		],
		marker: [
			str_id,
			"markerHeight",
			"markerUnits",
			"markerWidth",
			"orient",
			"refX",
			"refY",
		],
		linearGradient: [
			"x1",
			"x2",
			"y1",
			"y2",
		],
		radialGradient: [
			"cx",
			"cy",
			"r",
			"fr",
			"fx",
			"fy",
		],
		stop: [
			"offset",
			"stop-color",
			"stop-opacity",
		],
		pattern: [
			"patternContentUnits",
			"patternTransform",
			"patternUnits",
		],
	});
	const setRadius = (el, r) => {
		el.setAttribute(attributes.circle[2], r);
		return el;
	};
	const setOrigin = (el, a, b) => {
		[...coordinates(...svg_flatten_arrays(a, b)).slice(0, 2)]
			.forEach((value, i) => el.setAttribute(attributes.circle[i], value));
		return el;
	};
	const fromPoints = (a, b, c, d) => [a, b, svg_distance2([a, b], [c, d])];
	var circleDef = {
		circle: {
			args: (a, b, c, d) => {
				const coords = coordinates(...svg_flatten_arrays(a, b, c, d));
				switch (coords.length) {
					case 0: case 1: return [, , ...coords]
					case 2: case 3: return coords;
					default: return fromPoints(...coords);
				}
			},
			methods: {
				radius: setRadius,
				setRadius,
				origin: setOrigin,
				setOrigin,
				center: setOrigin,
				setCenter: setOrigin,
				position: setOrigin,
				setPosition: setOrigin,
			}
		}
	};
	const setRadii = (el, rx, ry) => {
		[, , rx, ry].forEach((value, i) => el.setAttribute(attributes.ellipse[i], value));
		return el;
	};
	const setCenter = (el, a, b) => {
		[...coordinates(...svg_flatten_arrays(a, b)).slice(0, 2)]
			.forEach((value, i) => el.setAttribute(attributes.ellipse[i], value));
		return el;
	};
	var ellipseDef = {
		ellipse: {
			args: (a, b, c, d) => {
				const coords = coordinates(...svg_flatten_arrays(a, b, c, d)).slice(0, 4);
				switch (coords.length) {
					case 0: case 1: case 2: return [, , ...coords]
					default: return coords;
				}
			},
			methods: {
				radius: setRadii,
				setRadius: setRadii,
				origin: setCenter,
				setOrigin: setCenter,
				center: setCenter,
				setCenter,
				position: setCenter,
				setPosition: setCenter,
			}
		}
	};
	const Args$1 = (...args) => coordinates(...svg_semi_flatten_arrays(...args)).slice(0, 4);
	const setPoints$1 = (element, ...args) => { Args$1(...args)
		.forEach((value, i) => element.setAttribute(attributes.line[i], value)); return element; };
	var lineDef = {
		line: {
			args: Args$1,
			methods: {
				setPoints: setPoints$1,
			}
		}
	};
	const markerRegEx = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g;
	const digitRegEx = /-?[0-9]*\.?\d+/g;
	const pathCommands = {
		m: "move",
		l: "line",
		v: "vertical",
		h: "horizontal",
		a: "ellipse",
		c: "curve",
		s: "smoothCurve",
		q: "quadCurve",
		t: "smoothQuadCurve",
		z: "close"
	};
	Object.keys(pathCommands).forEach((key) => {
		const s = pathCommands[key];
		pathCommands[key.toUpperCase()] = s.charAt(0).toUpperCase() + s.slice(1);
	});
	const parsePathCommands = function (str) {
		const results = [];
		let match;
		while ((match = markerRegEx.exec(str)) !== null) {
			results.push(match);
		}
		return results.map(match => ({
			command: str[match.index],
			index: match.index
		}))
		.reduceRight((all, cur) => {
			const chunk = str.substring(cur.index, all.length ? all[all.length - 1].index : str.length);
			return all.concat([
				 { command: cur.command,
				 index: cur.index,
				 chunk: (chunk.length > 0) ? chunk.substr(1, chunk.length - 1) : chunk }
			]);
		}, [])
		.reverse()
		.map((el) => {
			const values = el.chunk.match(digitRegEx);
			el.en = pathCommands[el.command];
			el.values = values ? values.map(parseFloat) : [];
			delete el.chunk;
			return el;
		});
	};
	const getD = (el) => {
		const attr = el.getAttribute("d");
		return (attr == null) ? "" : attr;
	};
	const clear = element => {
		element.removeAttribute("d");
		return element;
	};
	const appendPathCommand = (el, command, ...args) => {
		el.setAttribute("d", `${getD(el)}${command}${svg_flatten_arrays(...args).join(" ")}`);
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
	};
	Object.keys(pathCommands).forEach((key) => {
		path_methods[pathCommands[key]] = (el, ...args) => appendPathCommand(el, key, ...args);
	});
	var pathDef = {
		path: {
			methods: path_methods
		}
	};
	const setRectSize = (el, rx, ry) => {
		[, , rx, ry]
			.forEach((value, i) => el.setAttribute(attributes.rect[i], value));
		return el;
	};
	const setRectOrigin = (el, a, b) => {
		[...coordinates(...svg_flatten_arrays(a, b)).slice(0, 2)]
			.forEach((value, i) => el.setAttribute(attributes.rect[i], value));
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
	var rectDef = {
		rect: {
			args: (a, b, c, d) => {
				const coords = coordinates(...svg_flatten_arrays(a, b, c, d)).slice(0, 4);
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
			}
		}
	};
	var styleDef = {
		style: {
			init: (el, text) => {
					el.textContent = "";
					el.appendChild(cdata(text));
			},
			methods: {
				setTextContent: (el, text) => {
					el.textContent = "";
					el.appendChild(cdata(text));
					return el;
				}
			}
		}
	};
	var textDef = {
		text: {
			args: (a, b, c) => coordinates(...svg_flatten_arrays(a, b, c)).slice(0, 2),
			init: (element, a, b, c, d) => {
				const text = [a,b,c,d].filter(a => typeof a === str_string).shift();
				if (text) {
					element.appendChild(SVGWindow.document.createTextNode(text));
				}
			}
		}
	};
	const makeIDString = function () {
		return Array.from(arguments)
			.filter(a => typeof a === str_string || a instanceof String)
			.shift() || UUID();
	};
	const args = (...args) => [makeIDString(...args)];
	var maskTypes = {
		mask: { args: args },
		clipPath: { args: args },
		symbol: { args: args },
		marker: {
			args: args,
			methods: {
				size: setViewBox,
				setViewBox: setViewBox
			}
		},
	};
	const getPoints = (el) => {
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
		polyString(...coordinates(...svg_semi_flatten_arrays(...args)))
	];
	const setPoints = (element, ...args) => {
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
	var polyDefs = {
		polyline: {
			args: Args,
			methods: {
				setPoints,
				addPoint
			}
		},
		polygon: {
			args: Args,
			methods: {
				setPoints,
				addPoint
			}
		}
	};
	var Spec = Object.assign({},
		svgDef,
		gDef,
		circleDef,
		ellipseDef,
		lineDef,
		pathDef,
		rectDef,
		styleDef,
		textDef,
		maskTypes,
		polyDefs,
	);
	var ManyElements = {
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
			"visibility"
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
	};
	Object.values(NodeNames)
		.reduce((a,b) => a.concat(b), [])
		.filter(nodeName => attributes[nodeName] === undefined)
		.forEach(nodeName => { attributes[nodeName] = []; });
	[ [[str_svg, "defs", "g"].concat(NodeNames.v, NodeNames.t), ManyElements.presentation],
		[["filter"], ManyElements.effects],
		[NodeNames.cT.concat("text"), ManyElements.text],
		[NodeNames.cF, ManyElements.effects],
		[NodeNames.cG, ManyElements.gradient],
	].forEach(pair => pair[0].forEach(key => {
		attributes[key] = attributes[key].concat(pair[1]);
	}));
	const getClassList = (element) => {
		if (element == null) { return []; }
		const currentClass = element.getAttribute(str_class);
		return (currentClass == null
			? []
			: currentClass.split(" ").filter(s => s !== ""));
	};
	var classMethods = {
		addClass: (element, newClass) => {
			const classes = getClassList(element)
				.filter(c => c !== newClass);
			classes.push(newClass);
			element.setAttributeNS(null, str_class, classes.join(" "));
		},
		removeClass: (element, removedClass) => {
			const classes = getClassList(element)
				.filter(c => c !== removedClass);
			element.setAttributeNS(null, str_class, classes.join(" "));
		},
		setClass: (element, className) => {
			element.setAttributeNS(null, str_class, className);
		},
		setId: (element, idName) => {
			element.setAttributeNS(null, str_id, idName);
		}
	};
	const getAttr = (element) => {
		const t = element.getAttribute(str_transform);
		return (t == null || t === "") ? undefined : t;
	};
	const TransformMethods = {
		clearTransform: (el) => { el.removeAttribute(str_transform); return el; }
	};
	["translate", "rotate", "scale", "matrix"].forEach(key => {
		TransformMethods[key] = (element, ...args) => element.setAttribute(
			str_transform,
			[getAttr(element), `${key}(${args.join(" ")})`]
				.filter(a => a !== undefined)
				.join(" "));
	});
	const findIdURL = function (arg) {
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
	const methods = {};
	["clip-path",
		"mask",
		"symbol",
		"marker-end",
		"marker-mid",
		"marker-start",
	].forEach(attr => {
		methods[Case.toCamel(attr)] = (element, parent) => element.setAttribute(attr, findIdURL(parent));
	});
	const Nodes = {};
	NodeNames.v.push(...Object.keys(nodes));
	Object.keys(nodes).forEach((node) => {
		nodes[node].attributes = (nodes[node].attributes === undefined
			? [...ManyElements.presentation]
			: nodes[node].attributes.concat(ManyElements.presentation));
	});
	Object.assign(Nodes, Spec, nodes);
	Object.keys(NodeNames)
		.forEach(key => NodeNames[key]
			.filter(nodeName => Nodes[nodeName] === undefined)
			.forEach((nodeName) => {
				Nodes[nodeName] = {};
			}));
	const passthrough = function () { return Array.from(arguments); };
	Object.keys(Nodes).forEach((key) => {
		if (!Nodes[key].nodeName) { Nodes[key].nodeName = key; }
		if (!Nodes[key].init) { Nodes[key].init = passthrough; }
		if (!Nodes[key].args) { Nodes[key].args = passthrough; }
		if (!Nodes[key].methods) { Nodes[key].methods = {}; }
		if (!Nodes[key].attributes) {
			Nodes[key].attributes = attributes[key] || [];
		}
	});
	const assignMethods = (groups, Methods) => {
		groups.forEach(n =>
			Object.keys(Methods).forEach((method) => {
				Nodes[n].methods[method] = function () {
					Methods[method](...arguments);
					return arguments[0];
				};
			}));
	};
	assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), classMethods);
	assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), dom);
	assignMethods(svg_flatten_arrays(NodeNames.v, NodeNames.g, NodeNames.s), TransformMethods);
	assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g), methods);
	const RequiredAttrMap = {
		svg: {
			version: "1.1",
			xmlns: NS,
		},
		style: {
			type: "text/css"
		}
	};
	const RequiredAttributes = (element, nodeName) => {
		if (RequiredAttrMap[nodeName]) {
			Object.keys(RequiredAttrMap[nodeName])
				.forEach(key => element.setAttribute(key, RequiredAttrMap[nodeName][key]));
		}
	};
	const bound = {};
	const constructor = (nodeName, parent, ...args) => {
		const element = SVGWindow.document.createElementNS(NS, Nodes[nodeName].nodeName);
		if (parent) { parent.appendChild(element); }
		RequiredAttributes(element, nodeName);
		Nodes[nodeName].init(element, ...args);
		Nodes[nodeName].args(...args).forEach((v, i) => {
			if (Nodes[nodeName].attributes[i] != null) {
				element.setAttribute(Nodes[nodeName].attributes[i], v);
			}
		});
		Nodes[nodeName].attributes.forEach((attribute) => {
			Object.defineProperty(element, Case.toCamel(attribute), {
				value: function () {
					element.setAttribute(attribute, ...arguments);
					return element;
				}
			});
		});
		Object.keys(Nodes[nodeName].methods).forEach(methodName =>
			Object.defineProperty(element, methodName, {
				value: function () {
					return Nodes[nodeName].methods[methodName].call(bound, element, ...arguments);
				}
			}));
		if (nodesAndChildren[nodeName]) {
			nodesAndChildren[nodeName].forEach((childNode) => {
				const value = function () { return constructor(childNode, element, ...arguments); };
				if (Nodes[childNode].static) {
					Object.keys(Nodes[childNode].static).forEach(key => {
						value[key] = function () {
							return Nodes[childNode].static[key](element, ...arguments);
						};
					});
				}
				Object.defineProperty(element, childNode, { value });
			});
		}
		return element;
	};
	bound.Constructor = constructor;
	const elements = {};
	Object.keys(NodeNames).forEach(key => NodeNames[key]
		.forEach((nodeName) => {
			elements[nodeName] = (...args) => constructor(nodeName, null, ...args);
		}));
	const link_rabbitear_math = (svg, ear) => {
		[ "segment",
			"circle",
			"ellipse",
			"rect",
			"polygon",
		].filter(key => ear[key] && ear[key].prototype)
			.forEach((key) => {
				ear[key].prototype.svg = function () { return svg.path(this.svgPath()); };
			});
		libraries.math.vector = ear.vector;
	};
	const link_rabbitear_graph = (svg, ear) => {
		const NODE_NAME = "origami";
		Nodes[NODE_NAME] = {
			nodeName: "g",
			init: function (element, ...args) {
				return ear.graph.svg.drawInto(element, ...args);
			},
			args: () => [],
			methods: Nodes.g.methods,
			attributes: Nodes.g.attributes,
			static: {},
		};
		Object.keys(ear.graph.svg).forEach(key => {
			Nodes[NODE_NAME].static[key] = (element, ...args) => {
				const child = ear.graph.svg[key](...args);
				element.appendChild(child);
				return child;
			};
		});
		nodesAndChildren[NODE_NAME] = [...nodesAndChildren.g];
		nodesAndChildren.svg.push(NODE_NAME);
		nodesAndChildren.g.push(NODE_NAME);
		svg[NODE_NAME] = (...args) => constructor(NODE_NAME, null, ...args);
		Object.keys(ear.graph.svg).forEach(key => {
			svg[NODE_NAME][key] = ear.graph.svg[key];
		});
	};
	const Linker = function (lib) {
		if (lib.graph && lib.origami) {
			lib.svg = this;
			link_rabbitear_math(this, lib);
			link_rabbitear_graph(this, lib);
		}
	};
	const initialize = function (svg, ...args) {
		args.filter(arg => typeof arg === str_function)
			.forEach(func => func.call(svg, svg));
	};
	SVG_Constructor.init = function () {
		const svg = constructor(str_svg, null, ...arguments);
		if (SVGWindow.document.readyState === "loading") {
			SVGWindow.document.addEventListener("DOMContentLoaded", () => initialize(svg, ...arguments));
		} else {
			initialize(svg, ...arguments);
		}
		return svg;
	};
	SVG.NS = NS;
	SVG.linker = Linker.bind(SVG);
	Object.assign(SVG, elements);
	SVG.core = Object.assign(Object.create(null), {
		load: Load,
		save,
		coordinates,
		flatten: svg_flatten_arrays,
		attributes,
		children: nodesAndChildren,
		cdata,
	}, Case, classMethods, dom, svg_algebra, TransformMethods, viewBox);

	const Window = (function () {
		let win = {};
		if (isNode) {
			const { DOMParser, XMLSerializer } = require("@xmldom/xmldom");
			win.DOMParser = DOMParser;
			win.XMLSerializer = XMLSerializer;
			win.document = new DOMParser().parseFromString(
				"<!DOCTYPE html><title>.</title>", "text/html");
		} else if (isBrowser) {
			win = window;
		}
		return win;
	}());

	const make_faces_geometry = (graph) => {
		const { THREE } = Window;
		const vertices = graph.vertices_coords
			.map(v => [v[0], v[1], v[2] || 0])
			.flat();
		const normals = graph.vertices_coords
			.map(v => [0, 0, 1])
			.flat();
		const colors = graph.vertices_coords
			.map(v => [1, 1, 1])
			.flat();
		const faces = graph.faces_vertices
			.map(fv => fv
				.map((v, i, arr) => [arr[0], arr[i+1], arr[i+2]])
				.slice(0, fv.length - 2))
			.flat(2);
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
		geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
		geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
		geometry.setIndex(faces);
		return geometry;
	};
	const make_edge_cylinder = (edge_coords, edge_vector, radius, end_pad = 0) => {
		if (math.core.mag_squared(edge_vector) < math.core.EPSILON) {
			return [];
		}
		const normalized = math.core.normalize(edge_vector);
		const perp = [ [1,0,0], [0,1,0], [0,0,1] ]
			.map(vec => math.core.cross3(vec, normalized))
			.sort((a, b) => math.core.magnitude(b) - math.core.magnitude(a))
			.shift();
		const rotated = [ math.core.normalize(perp) ];
		for (let i = 1; i < 4; i += 1) {
			rotated.push(math.core.cross3(rotated[i - 1], normalized));
		}
		const dirs = rotated.map(v => math.core.scale(v, radius));
		const nudge = [-end_pad, end_pad].map(n => math.core.scale(normalized, n));
		const coords = end_pad === 0
			? edge_coords
			: edge_coords.map((coord, i) => math.core.add(coord, nudge[i]));
		return coords
			.map(v => dirs.map(dir => math.core.add(v, dir)))
			.flat();
	};
	const make_edges_geometry = function ({
		vertices_coords, edges_vertices, edges_assignment, edges_coords, edges_vector
	}, scale=0.002, end_pad = 0) {
		const { THREE } = Window;
		if (!edges_coords) {
			edges_coords = edges_vertices.map(edge => edge.map(v => vertices_coords[v]));
		}
		if (!edges_vector) {
			edges_vector = edges_coords.map(edge => math.core.subtract(edge[1], edge[0]));
		}
		edges_coords = edges_coords
			.map(edge => edge
				.map(coord => math.core.resize(3, coord)));
		edges_vector = edges_vector
			.map(vec => math.core.resize(3, vec));
		const colorAssignments = {
			"B": [0.0,0.0,0.0],
			"M": [0.0,0.0,0.0],
			"F": [0.0,0.0,0.0],
			"V": [0.0,0.0,0.0],
		};
		const colors = edges_assignment.map(e =>
			[colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e],
			colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e]]
		).flat(3);
		const vertices = edges_coords
			.map((coords, i) => make_edge_cylinder(coords, edges_vector[i], scale, end_pad))
			.flat(2);
		const normals = edges_vector.map(vector => {
			if (math.core.mag_squared(vector) < math.core.EPSILON) { throw "degenerate edge"; }
			let normalized = math.core.normalize(vector);
			math.core.scale(normalized, scale);
			const c0 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0,0,-1])), scale);
			const c1 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0,0,1])), scale);
			return [
				c0, [-c0[2], c0[1], c0[0]],
				c1, [-c1[2], c1[1], c1[0]],
				c0, [-c0[2], c0[1], c0[0]],
				c1, [-c1[2], c1[1], c1[0]]
			]
		}).flat(2);
		let faces = edges_coords.map((e,i) => [
			i*8+0, i*8+4, i*8+1,
			i*8+1, i*8+4, i*8+5,
			i*8+1, i*8+5, i*8+2,
			i*8+2, i*8+5, i*8+6,
			i*8+2, i*8+6, i*8+3,
			i*8+3, i*8+6, i*8+7,
			i*8+3, i*8+7, i*8+0,
			i*8+0, i*8+7, i*8+4,
			i*8+0, i*8+1, i*8+3,
			i*8+1, i*8+2, i*8+3,
			i*8+5, i*8+4, i*8+7,
			i*8+7, i*8+6, i*8+5,
		]).flat();
		const geometry = new THREE.BufferGeometry();
		geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
		geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
		geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
		geometry.setIndex(faces);
		geometry.computeVertexNormals();
		return geometry;
	};

	var webgl = /*#__PURE__*/Object.freeze({
		__proto__: null,
		make_faces_geometry: make_faces_geometry,
		make_edges_geometry: make_edges_geometry
	});

	const ear = Object.assign(root, ObjectConstructors, {
		math: math.core,
		axiom,
		diagram,
		layer,
		vertex,
		text,
		webgl,
	});
	Object.keys(math)
		.filter(key => key !== "core")
		.forEach((key) => { ear[key] = math[key]; });
	Object.defineProperty(ear, "use", {
		enumerable: false,
		value: use.bind(ear),
	});
	if (!isWebWorker) {
		ear.use(FOLDtoSVG);
		ear.use(SVG);
	}

	return ear;

}));
