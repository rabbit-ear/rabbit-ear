/* Rabbit Ear v0.1.91 (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ear = factory());
}(this, (function () { 'use strict';

  const isNode = typeof process !== "undefined"
    && process.versions != null
    && process.versions.node != null;

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
  const fEqual = (a, b) => a === b;
  const fEpsilonEqual = (a, b) => Math.abs(a - b) < EPSILON;
  const array_similarity_test = (list, compFunc) => Array
    .from(Array(list.length - 1))
    .map((_, i) => compFunc(list[0], list[i + 1]))
    .reduce((a, b) => a && b, true);
  const equivalent_arrays_of_numbers = function () {
  };
  const equivalent_numbers = function () {
    if (arguments.length === 0) { return false; }
    if (arguments.length === 1 && arguments[0] !== undefined) {
      return equivalent_numbers(...arguments[0]);
    }
    return array_similarity_test(arguments, fEpsilonEqual);
  };
  const equivalent_vectors = function () {
    const args = Array.from(arguments);
    const length = args.map(a => a.length).reduce((a, b) => a > b ? a : b);
    const vecs = args.map(a => resize(length, a));
    return Array.from(Array(arguments.length - 1))
      .map((_, i) => vecs[0]
        .map((_, n) => Math.abs(vecs[0][n] - vecs[i + 1][n]) < EPSILON)
        .reduce((u, v) => u && v, true))
      .reduce((u, v) => u && v, true);
  };
  const equivalent = function () {
    const list = semi_flatten_arrays(...arguments);
    if (list.length < 1) { return false; }
    const typeofList = typeof list[0];
    if (typeofList === "undefined") { return false; }
    switch (typeofList) {
      case "number":
        return array_similarity_test(list, fEpsilonEqual);
      case "boolean":
      case "string":
        return array_similarity_test(list, fEqual);
      case "object":
        if (list[0].constructor === Array) { return equivalent_vectors(...list); }
        return array_similarity_test(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
      default: return undefined;
    }
  };
  var equal = Object.freeze({
    __proto__: null,
    EPSILON: EPSILON,
    equivalent_arrays_of_numbers: equivalent_arrays_of_numbers,
    equivalent_numbers: equivalent_numbers,
    equivalent_vectors: equivalent_vectors,
    equivalent: equivalent
  });
  const fn_square = n => n * n;
  const fn_add = (a, b) => a + b;
  const magnitude = v => Math.sqrt(v
    .map(fn_square)
    .reduce(fn_add, 0));
  const mag_squared = v => v
    .map(fn_square)
    .reduce(fn_add, 0);
  const normalize = (v) => {
    const m = magnitude(v);
    return m === 0 ? v : v.map(c => c / m);
  };
  const scale = (v, s) => v.map(n => n * s);
  const add = (v, u) => v.map((n, i) => n + u[i]);
  const subtract = (v, u) => v.map((n, i) => n - u[i]);
  const dot = (v, u) => v
    .map((_, i) => v[i] * u[i])
    .reduce(fn_add, 0);
  const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
  const average = function () {
    if (arguments.length === 0) { return []; }
    const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
    const sum = Array(dimension).fill(0);
    Array.from(arguments).forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
    return sum.map(n => n / arguments.length);
  };
  const lerp = (v, u, t) => {
    const inv = 1.0 - t;
    return v.map((n, i) => n * inv + u[i] * t);
  };
  const cross2 = (a, b) => a[0] * b[1] - a[1] * b[0];
  const cross3 = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[0] * b[2] - a[2] * b[0],
    a[0] * b[1] - a[1] * b[0],
  ];
  const distance2 = (a, b) => {
    const p = a[0] - b[0];
    const q = a[1] - b[1];
    return Math.sqrt((p * p) + (q * q));
  };
  const distance3 = (a, b) => {
    const c = a[0] - b[0];
    const d = a[1] - b[1];
    const e = a[2] - b[2];
    return Math.sqrt((c * c) + (d * d) + (e * e));
  };
  const distance = (a, b) => Math.sqrt(a
    .map((_, i) => (a[i] - b[i]) ** 2)
    .reduce((u, v) => u + v, 0));
  const flip = v => v.map(n => -n);
  const rotate90 = v => [-v[1], v[0]];
  const rotate270 = v => [v[1], -v[0]];
  const degenerate = (v) => Math
    .abs(v.reduce((a, b) => a + b, 0)) < EPSILON;
  const parallel = (a, b) => 1 - Math
    .abs(dot(normalize(a), normalize(b))) < EPSILON;
  var algebra = Object.freeze({
    __proto__: null,
    magnitude: magnitude,
    mag_squared: mag_squared,
    normalize: normalize,
    scale: scale,
    add: add,
    subtract: subtract,
    dot: dot,
    midpoint: midpoint,
    average: average,
    lerp: lerp,
    cross2: cross2,
    cross3: cross3,
    distance2: distance2,
    distance3: distance3,
    distance: distance,
    flip: flip,
    rotate90: rotate90,
    rotate270: rotate270,
    degenerate: degenerate,
    parallel: parallel
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
    const vec = resize(3, normalize(vector));
    const pos = [0, 1, 2].map(i => origin[i] || 0);
    const [a, b, c] = vec;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const d = Math.sqrt((vec[1] * vec[1]) + (vec[2] * vec[2]));
    const b_d = Math.abs(d) < 1e-6 ? 0 : b / d;
    const c_d = Math.abs(d) < 1e-6 ? 1 : c / d;
    const t     = identity3x3.concat(pos[0], pos[1], pos[2]);
    const t_inv = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
    const rx     = [1, 0, 0, 0, c_d, b_d, 0, -b_d, c_d, 0, 0, 0];
    const rx_inv = [1, 0, 0, 0, c_d, -b_d, 0, b_d, c_d, 0, 0, 0];
    const ry     = [d, 0, a, 0, 1, 0, -a, 0, d, 0, 0, 0];
    const ry_inv = [d, 0, -a, 0, 1, 0, a, 0, d, 0, 0, 0];
    const rz     = [cos, sin, 0, -sin, cos, 0, 0, 0, 1, 0, 0, 0];
    return multiply_matrices3(t,
      multiply_matrices3(rx,
        multiply_matrices3(ry,
          multiply_matrices3(rz,
            multiply_matrices3(ry_inv,
              multiply_matrices3(rx_inv, t_inv))))));
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
    return [a, b, 0, c, d, 0, 0, 0, 0, tx, ty, 0];
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
        .filter(a => a !== undefined);
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
    return get_vector_of_vectors(args);
  };
  const get_line = function () {
    const args = semi_flatten_arrays(arguments);
    if (args.length === 0) { return vector_origin_form([], []); }
    if (args[0] instanceof Constructors.line
      || args[0] instanceof Constructors.ray
      || args[0] instanceof Constructors.segment) { return args[0]; }
    if (args[0].constructor === Object) {
      return vector_origin_form(args[0].vector || [], args[0].origin || []);
    }
    return typeof args[0] === "number"
      ? vector_origin_form(get_vector(args))
      : vector_origin_form(...args.map(a => get_vector(a)));
  };
  const rect_form = (width = 0, height = 0, x = 0, y = 0) => ({
    width, height, x, y
  });
  const get_rect = function () {
    if (arguments[0] instanceof Constructors.rect) { return arguments[0]; }
    const list = flatten_arrays(arguments);
    if (list.length > 0
      && typeof list[0] === "object"
      && list[0] !== null
      && !isNaN(list[0].width)) {
      return rect_form(...["width", "height", "x", "y"]
        .map(c => list[0][c])
        .filter(a => a !== undefined));
    }
    return rect_form(...list.filter(n => typeof n === "number"));
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
  const get_matrix2 = function () {
    const m = get_vector(arguments);
    if (m.length === 6) { return m; }
    if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
    if (m.length < 6) {
      return identity2x3.map((n, i) => m[i] || n);
    }
  };
  var getters = Object.freeze({
    __proto__: null,
    get_vector: get_vector,
    get_vector_of_vectors: get_vector_of_vectors,
    get_segment: get_segment,
    get_line: get_line,
    rect_form: rect_form,
    get_rect: get_rect,
    get_matrix_3x4: get_matrix_3x4,
    get_matrix2: get_matrix2
  });
  const include_l = () => true;
  const include_r = (t, e=EPSILON) => t > -e;
  const include_s = (t, e=EPSILON) => t > -e && t < 1 + e;
  const exclude_l = () => true;
  const exclude_r = (t, e=EPSILON) => t > e;
  const exclude_s = (t, e=EPSILON) => t > e && t < 1 - e;
  const include_l_l = () => true;
  const include_l_r = (t0, t1, e=EPSILON) => t1 > -e;
  const include_l_s = (t0, t1, e=EPSILON) => t1 > -e && t1 < 1 + e;
  const include_r_r = (t0, t1, e=EPSILON) => t0 > -e && t1 > -e;
  const include_r_s = (t0, t1, e=EPSILON) => t0 > -e && t1 > -e && t1 < 1 + e;
  const include_s_s = (t0, t1, e=EPSILON) => t0 > -e && t0 < 1 + e && t1 > -e
    && t1 < 1 + e;
  const exclude_l_r = (t0, t1, e=EPSILON) => t1 > e;
  const exclude_l_s = (t0, t1, e=EPSILON) => t1 > e && t1 < 1 - e;
  const exclude_r_r = (t0, t1, e=EPSILON) => t0 > e && t1 > e;
  const exclude_r_s = (t0, t1, e=EPSILON) => t0 > e && t1 > e && t1 < 1 - e;
  const exclude_s_s = (t0, t1, e=EPSILON) => t0 > e && t0 < 1 - e && t1 > e
    && t1 < 1 - e;
  const intersect_lines = (aVector, aOrigin, bVector, bOrigin, compFunc, epsilon = EPSILON) => {
    const denominator0 = cross2(aVector, bVector);
    if (Math.abs(denominator0) < epsilon) { return undefined; }
    const denominator1 = -denominator0;
    const aOriX = aOrigin[0];
    const aOriY = aOrigin[1];
    const bOriX = bOrigin[0];
    const bOriY = bOrigin[1];
    const numerator0 = cross2([bOriX - aOriX, bOriY - aOriY], bVector);
    const numerator1 = cross2([aOriX - bOriX, aOriY - bOriY], aVector);
    const t0 = numerator0 / denominator0;
    const t1 = numerator1 / denominator1;
    if (compFunc(t0, t1, epsilon)) {
      return [aOriX + aVector[0] * t0, aOriY + aVector[1] * t0];
    }
    return undefined;
  };
  var intersect_lines$1 = Object.freeze({
    __proto__: null,
    include_l: include_l,
    include_r: include_r,
    include_s: include_s,
    exclude_l: exclude_l,
    exclude_r: exclude_r,
    exclude_s: exclude_s,
    include_l_l: include_l_l,
    include_l_r: include_l_r,
    include_l_s: include_l_s,
    include_r_r: include_r_r,
    include_r_s: include_r_s,
    include_s_s: include_s_s,
    exclude_l_r: exclude_l_r,
    exclude_l_s: exclude_l_s,
    exclude_r_r: exclude_r_r,
    exclude_r_s: exclude_r_s,
    exclude_s_s: exclude_s_s,
    intersect_lines: intersect_lines
  });
  const collinear = (point, vector, origin, compFunc, epsilon = EPSILON) => {
    const p2p = subtract(point, origin);
    const lineMagSq = mag_squared(vector);
    const p2pMagSq = mag_squared(p2p);
    if (p2pMagSq < epsilon) { return compFunc(p2pMagSq, epsilon); }
    if (lineMagSq < epsilon) { return false; }
    const cross = cross2(p2p, vector);
    const proj = dot(p2p, vector) / lineMagSq;
    return Math.abs(cross) < epsilon && compFunc(proj, epsilon);
  };
  const point_on_line = (point, vector, origin, epsilon = EPSILON) => {
    const pointToPoint = subtract(point, origin);
    return Math.abs(cross2(pointToPoint, vector)) < epsilon;
  };
  const point_on_ray_inclusive = (point, vector, origin, epsilon = EPSILON) => collinear(point, vector, origin, include_r, epsilon);
  const point_on_ray_exclusive = (point, vector, origin, epsilon = EPSILON) => collinear(point, vector, origin, exclude_r, epsilon);
  const point_on_segment_inclusive = (point, pt0, pt1, epsilon = EPSILON) => collinear(point, subtract(pt1, pt0), pt0, include_s, epsilon);
  const point_on_segment_exclusive = (point, pt0, pt1, epsilon = EPSILON) => collinear(point, subtract(pt1, pt0), pt0, exclude_s, epsilon);
  var overlap_point = Object.freeze({
    __proto__: null,
    collinear: collinear,
    point_on_line: point_on_line,
    point_on_ray_inclusive: point_on_ray_inclusive,
    point_on_ray_exclusive: point_on_ray_exclusive,
    point_on_segment_inclusive: point_on_segment_inclusive,
    point_on_segment_exclusive: point_on_segment_exclusive
  });
  const R2D = 180 / Math.PI;
  const D2R = Math.PI / 180;
  const TWO_PI = Math.PI * 2;
  const is_counter_clockwise_between = (angle, angleA, angleB) => {
    while (angleB < angleA) { angleB += TWO_PI; }
    while (angle > angleA) { angle -= TWO_PI; }
    while (angle < angleA) { angle += TWO_PI; }
    return angle < angleB;
  };
  const clockwise_angle2_radians = (a, b) => {
    while (a < 0) { a += TWO_PI; }
    while (b < 0) { b += TWO_PI; }
    while (a > TWO_PI) { a -= TWO_PI; }
    while (b > TWO_PI) { b -= TWO_PI; }
    const a_b = a - b;
    return (a_b >= 0)
      ? a_b
      : TWO_PI - (b - a);
  };
  const counter_clockwise_angle2_radians = (a, b) => {
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
  const counter_clockwise_vector_order = (...vectors) => {
    const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
    const counter_clockwise = Array.from(Array(vectors_radians.length))
      .map((_, i) => i)
      .sort((a, b) => vectors_radians[a] - vectors_radians[b]);
    return counter_clockwise
      .slice(counter_clockwise.indexOf(0), counter_clockwise.length)
      .concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
  };
  const interior_angles = (...vecs) => vecs
    .map((v, i, ar) => counter_clockwise_angle2(v, ar[(i + 1) % ar.length]));
  const bisect_vectors = (a, b) => {
    const aV = normalize(a);
    const bV = normalize(b);
    return dot(aV, bV) < (-1 + EPSILON)
      ? [-aV[1], aV[0]]
      : normalize(add(aV, bV));
  };
  const bisect_lines2 = (vectorA, pointA, vectorB, pointB) => {
    const denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
    if (Math.abs(denominator) < EPSILON) {
      const solution = [[vectorA[0], vectorA[1]], midpoint(pointA, pointB)];
      const array = [solution, solution];
      const dt = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
      delete array[(dt > 0 ? 1 : 0)];
      return array;
    }
    const numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
    const t = numerator / denominator;
    const origin = [
      pointA[0] + vectorA[0] * t,
      pointA[1] + vectorA[1] * t,
    ];
    const bisects = [bisect_vectors(vectorA, vectorB)];
    bisects[1] = rotate90(bisects[0]);
    return bisects.map(vector => ({ vector, origin }));
  };
  const subsect_radians = (divisions, angleA, angleB) => {
    const angle = counter_clockwise_angle2_radians(angleA, angleB) / divisions;
    return Array.from(Array(divisions - 1))
      .map((_, i) => angleA + angle * i);
  };
  const subsect = (divisions, vectorA, vectorB) => {
    const angleA = Math.atan2(vectorA[1], vectorA[0]);
    const angleB = Math.atan2(vectorB[1], vectorB[0]);
    return subsect_radians(divisions, angleA, angleB)
      .map(rad => [Math.cos(rad), Math.sin(rad)]);
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
    }).reduce((a, b) => a + b, 0);
  const centroid = (points) => {
    const sixthArea = 1 / (6 * signed_area(points));
    return points.map((el, i, arr) => {
      const next = arr[(i + 1) % arr.length];
      const mag = el[0] * next[1] - next[0] * el[1];
      return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
    }).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
      .map(c => c * sixthArea);
  };
  const enclosing_rectangle = (points) => {
    const mins = Array(points[0].length).fill(Infinity);
    const maxs = Array(points[0].length).fill(-Infinity);
    points.forEach(point => point
      .forEach((c, i) => {
        if (c < mins[i]) { mins[i] = c; }
        if (c > maxs[i]) { maxs[i] = c; }
      }));
    const lengths = maxs.map((max, i) => max - mins[i]);
    return rect_form(...lengths, ...mins);
  };
  const make_regular_polygon = (sides, radius = 1, x = 0, y = 0) => {
    const halfwedge = TWO_PI / sides / 2;
    const r = radius / 2 / Math.cos(halfwedge);
    return Array.from(Array(Math.floor(sides)))
      .map((_, i) => TWO_PI * (i / sides))
      .map(a => [x + r * Math.cos(a), y + r * Math.sin(a)])
      .map(p => p.map(n => clean_number(n, 14)));
  };
  const line_segment_exclusive = function (lineVector, linePoint, segmentA, segmentB) {
    const pt = segmentA;
    const vec = [segmentB[0] - segmentA[0], segmentB[1] - segmentA[1]];
    return intersect_lines(lineVector, linePoint, vec, pt, exclude_l_s);
  };
  const split_polygon = () => console.warn("split polygon not done");
  const split_convex_polygon = (poly, lineVector, linePoint) => {
    let vertices_intersections = poly.map((v, i) => {
      let intersection = point_on_line(v, lineVector, linePoint);
      return { point: intersection ? v : null, at_index: i };
    }).filter(el => el.point != null);
    let edges_intersections = poly.map((v, i, arr) => {
      let intersection = line_segment_exclusive(lineVector, linePoint, v, arr[(i + 1) % arr.length]);
      return { point: intersection, at_index: i };
    }).filter(el => el.point != null);
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
  var geometry = Object.freeze({
    __proto__: null,
    R2D: R2D,
    D2R: D2R,
    TWO_PI: TWO_PI,
    is_counter_clockwise_between: is_counter_clockwise_between,
    clockwise_angle2_radians: clockwise_angle2_radians,
    counter_clockwise_angle2_radians: counter_clockwise_angle2_radians,
    clockwise_angle2: clockwise_angle2,
    counter_clockwise_angle2: counter_clockwise_angle2,
    counter_clockwise_vector_order: counter_clockwise_vector_order,
    interior_angles: interior_angles,
    bisect_vectors: bisect_vectors,
    bisect_lines2: bisect_lines2,
    subsect_radians: subsect_radians,
    subsect: subsect,
    circumcircle: circumcircle,
    signed_area: signed_area,
    centroid: centroid,
    enclosing_rectangle: enclosing_rectangle,
    make_regular_polygon: make_regular_polygon,
    split_polygon: split_polygon,
    split_convex_polygon: split_convex_polygon,
    convex_hull: convex_hull
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
  const nearest_point_on_line = (lineVec, linePoint, point, limiterFunc, epsilon = EPSILON) => {
    const magSquared = (lineVec[0] ** 2) + (lineVec[1] ** 2);
    const vectorToPoint = [0, 1].map((_, i) => point[i] - linePoint[i]);
    const dot = [0, 1].map((_, i) => lineVec[i] * vectorToPoint[i])
      .reduce((a, b) => a + b, 0);
    const dist = dot / magSquared;
    const d = limiterFunc(dist, epsilon);
    return [0, 1].map((_, i) => linePoint[i] + lineVec[i] * d);
  };
  const segment_limiter = (dist) => {
    if (dist < -EPSILON) { return 0; }
    if (dist > 1 + EPSILON) { return 1; }
    return dist;
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
  var nearest = Object.freeze({
    __proto__: null,
    nearest_point2: nearest_point2,
    nearest_point: nearest_point,
    nearest_point_on_line: nearest_point_on_line,
    segment_limiter: segment_limiter,
    nearest_point_on_polygon: nearest_point_on_polygon,
    nearest_point_on_circle: nearest_point_on_circle,
    nearest_point_on_ellipse: nearest_point_on_ellipse
  });
  const overlap_lines = (aVec, aPt, bVec, bPt, compA, compB, epsilon = EPSILON) => {
    const denominator0 = cross2(aVec, bVec);
    const denominator1 = -denominator0;
    const numerator0 = cross2(subtract(bPt, aPt), bVec);
    const numerator1 = cross2(subtract(aPt, bPt), aVec);
    if (Math.abs(denominator0) < epsilon) {
      return false;
    }
    const t0 = numerator0 / denominator0;
    const t1 = numerator1 / denominator1;
    return compA(t0, epsilon) && compB(t1, epsilon);
  };
  const overlap_line_line_inclusive = (aV, aP, bV, bP, ep = EPSILON) =>
    overlap_lines(aV, aP, bV, bP, include_l, include_l, ep);
  const overlap_line_ray_inclusive = (aV, aP, bV, bP, ep = EPSILON) =>
    overlap_lines(aV, aP, bV, bP, include_l, include_r, ep);
  const overlap_line_segment_inclusive = (aV, aP, b0, b1, ep = EPSILON) =>
    overlap_lines(aV, aP, subtract(b1, b0), b0, include_l, include_s, ep);
  const overlap_ray_ray_inclusive = (aV, aP, bV, bP, ep = EPSILON) =>
    overlap_lines(aV, aP, bV, bP, include_r, include_r, ep);
  const overlap_ray_segment_inclusive = (aV, aP, b0, b1, ep = EPSILON) =>
    overlap_lines(aV, aP, subtract(b1, b0), b0, include_r, include_s, ep);
  const overlap_segment_segment_inclusive = (a0, a1, b0, b1, ep = EPSILON) =>
    overlap_lines(subtract(a1, a0), a0, subtract(b1, b0), b0, include_s, include_s, ep);
  const overlap_line_line_exclusive = (aV, aP, bV, bP, ep = EPSILON) =>
    overlap_lines(aV, aP, bV, bP, exclude_l, exclude_l, ep);
  const overlap_line_ray_exclusive = (aV, aP, bV, bP, ep = EPSILON) =>
    overlap_lines(aV, aP, bV, bP, exclude_l, exclude_r, ep);
  const overlap_line_segment_exclusive = (aV, aP, b0, b1, ep = EPSILON) =>
    overlap_lines(aV, aP, subtract(b1, b0), b0, exclude_l, exclude_s, ep);
  const overlap_ray_ray_exclusive = (aV, aP, bV, bP, ep = EPSILON) =>
    overlap_lines(aV, aP, bV, bP, exclude_r, exclude_r, ep);
  const overlap_ray_segment_exclusive = (aV, aP, b0, b1, ep = EPSILON) =>
    overlap_lines(aV, aP, subtract(b1, b0), b0, exclude_r, exclude_s, ep);
  const overlap_segment_segment_exclusive = (a0, a1, b0, b1, ep = EPSILON) =>
    overlap_lines(subtract(a1, a0), a0, subtract(b1, b0), b0, exclude_s, exclude_s, ep);
  var overlap_lines$1 = Object.freeze({
    __proto__: null,
    overlap_lines: overlap_lines,
    overlap_line_line_inclusive: overlap_line_line_inclusive,
    overlap_line_ray_inclusive: overlap_line_ray_inclusive,
    overlap_line_segment_inclusive: overlap_line_segment_inclusive,
    overlap_ray_ray_inclusive: overlap_ray_ray_inclusive,
    overlap_ray_segment_inclusive: overlap_ray_segment_inclusive,
    overlap_segment_segment_inclusive: overlap_segment_segment_inclusive,
    overlap_line_line_exclusive: overlap_line_line_exclusive,
    overlap_line_ray_exclusive: overlap_line_ray_exclusive,
    overlap_line_segment_exclusive: overlap_line_segment_exclusive,
    overlap_ray_ray_exclusive: overlap_ray_ray_exclusive,
    overlap_ray_segment_exclusive: overlap_ray_segment_exclusive,
    overlap_segment_segment_exclusive: overlap_segment_segment_exclusive
  });
  const point_in_convex_poly_inclusive = (point, poly, epsilon = EPSILON) => poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
    .map(s => cross2(subtract(s[1], s[0]), subtract(point, s[0])) > -epsilon)
    .map((s, _, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);
  const point_in_convex_poly_exclusive = (point, poly, epsilon = EPSILON) => poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
    .map(s => cross2(subtract(s[1], s[0]), subtract(point, s[0])) > epsilon)
    .map((s, _, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);
  const point_in_poly = (point, poly) => {
    let isInside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      if ((poly[i][1] > point[1]) != (poly[j][1] > point[1])
        && point[0] < (poly[j][0] - poly[i][0])
        * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1])
        + poly[i][0]) {
        isInside = !isInside;
      }
    }
    return isInside;
  };
  const overlap_convex_polygons = (poly1, poly2, seg_seg, pt_in_poly) => {
    const e1 = poly1.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
    const e2 = poly2.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
    for (let i = 0; i < e1.length; i += 1) {
      for (let j = 0; j < e2.length; j += 1) {
        if (seg_seg(e1[i][0], e1[i][1], e2[j][0], e2[j][1])) {
          return true;
        }
      }
    }
    if (pt_in_poly(poly2[0], poly1)) { return true; }
    if (pt_in_poly(poly1[0], poly2)) { return true; }
    return false;
  };
  const overlap_convex_polygons_inclusive = (poly1, poly2) => overlap_convex_polygons(
    poly1,
    poly2,
    overlap_segment_segment_inclusive,
    point_in_convex_poly_inclusive
  );
  const overlap_convex_polygons_exclusive = (poly1, poly2) => overlap_convex_polygons(
    poly1,
    poly2,
    overlap_segment_segment_exclusive,
    point_in_convex_poly_exclusive
  );
  const enclose_convex_polygons_inclusive = (outer, inner) => {
    const outerGoesInside = outer
      .map(p => point_in_convex_poly_inclusive(p, inner))
      .reduce((a, b) => a || b, false);
    const innerGoesOutside = inner
      .map(p => point_in_convex_poly_inclusive(p, inner))
      .reduce((a, b) => a && b, true);
    return (!outerGoesInside && innerGoesOutside);
  };
  var overlap_polygon = Object.freeze({
    __proto__: null,
    point_in_convex_poly_inclusive: point_in_convex_poly_inclusive,
    point_in_convex_poly_exclusive: point_in_convex_poly_exclusive,
    point_in_poly: point_in_poly,
    overlap_convex_polygons_inclusive: overlap_convex_polygons_inclusive,
    overlap_convex_polygons_exclusive: overlap_convex_polygons_exclusive,
    enclose_convex_polygons_inclusive: enclose_convex_polygons_inclusive
  });
  const overlap = Object.assign(Object.create(null),
    overlap_lines$1,
    overlap_point,
    overlap_polygon,
  );
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
  const acossafe = function (x) {
    if (x >= 1.0) return 0;
    if (x <= -1.0) return Math.PI;
    return Math.acos(x);
  };
  const rotatePoint = function (fp, pt, a) {
    const x = pt[0] - fp[0];
    const y = pt[1] - fp[1];
    const xRot = x * Math.cos(a) + y * Math.sin(a);
    const yRot = y * Math.cos(a) - x * Math.sin(a);
    return [fp[0] + xRot, fp[1] + yRot];
  };
  const circle_circle = function (c1, c2, epsilon = EPSILON) {
    const r = (c1.radius < c2.radius) ? c1.radius : c2.radius;
    const R = (c1.radius < c2.radius) ? c2.radius : c1.radius;
    const smCenter = (c1.radius < c2.radius) ? c1.origin : c2.origin;
    const bgCenter = (c1.radius < c2.radius) ? c2.origin : c1.origin;
    const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
    const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
    if (d < epsilon) { return undefined; }
    const point = vec.map((v, i) => v / d * R + bgCenter[i]);
    if (Math.abs((R + r) - d) < epsilon
      || Math.abs(R - (r + d)) < epsilon) { return [point]; }
    if ((d + r) < R || (R + r < d)) { return undefined; }
    const angle = acossafe((r * r - d * d - R * R) / (-2.0 * d * R));
    const pt1 = rotatePoint(bgCenter, point, +angle);
    const pt2 = rotatePoint(bgCenter, point, -angle);
    return [pt1, pt2];
  };
  const circle_line_func = function (circleRadius, circleOrigin, vector, origin, func, epsilon = EPSILON) {
    const magSq = vector[0] ** 2 + vector[1] ** 2;
    const mag = Math.sqrt(magSq);
    const norm = mag === 0 ? vector : vector.map(c => c / mag);
    const rot90 = [-norm[1], norm[0]];
    const bvec = [origin[0] - circleOrigin[0], origin[1] - circleOrigin[1]];
    const det = bvec[0] * norm[1] - norm[0] * bvec[1];
    if (Math.abs(det) > circleRadius + epsilon) { return undefined; }
    const side = Math.sqrt((circleRadius ** 2) - (det ** 2));
    const f = (s, i) => circleOrigin[i] - rot90[i] * det + norm[i] * s;
    const results = Math.abs(circleRadius - Math.abs(det)) < epsilon
      ? [side].map((s) => [s, s].map(f))
      : [-side, side].map((s) => [s, s].map(f));
    const ts = results.map(res => res.map((n, i) => n - origin[i]))
      .map(v => v[0] * vector[0] + vector[1] * v[1])
      .map(d => d / magSq);
    return results.filter((_, i) => func(ts[i], epsilon));
  };
  const line_func = () => true;
  const ray_func = (n, epsilon) => n > -epsilon;
  const segment_func = (n, epsilon) => n > -epsilon && n < 1 + epsilon;
  const circle_line = (circle, line, epsilon = EPSILON) => circle_line_func(
    circle.radius,
    circle.origin,
    line.vector,
    line.origin,
    line_func,
    epsilon
  );
  const circle_ray = (circle, ray, epsilon = EPSILON) => circle_line_func(
    circle.radius,
    circle.origin,
    ray.vector,
    ray.origin,
    ray_func,
    epsilon
  );
  const circle_segment = (circle, segment, epsilon = EPSILON) => circle_line_func(
    circle.radius,
    circle.origin,
    segment.vector,
    segment.origin,
    segment_func,
    epsilon
  );
  var intersect_circle = Object.freeze({
    __proto__: null,
    circle_circle: circle_circle,
    circle_line: circle_line,
    circle_ray: circle_ray,
    circle_segment: circle_segment
  });
  const intersect_line_seg = (vector, origin, pt0, pt1) => intersect_lines(
    vector, origin,
    subtract(pt1, pt0), pt0,
    include_l_s
  );
  const intersect_ray_seg_include = (vector, origin, pt0, pt1) => intersect_lines(
    vector, origin,
    subtract(pt1, pt0), pt0,
    include_r_s
  );
  const intersect_ray_seg_exclude = (vector, origin, pt0, pt1) => intersect_lines(
    vector, origin,
    subtract(pt1, pt0), pt0,
    exclude_r_s
  );
  const intersect_seg_seg_include = (a0, a1, b0, b1) => intersect_lines(
    subtract(a1, a0), a0,
    subtract(b1, b0), b0,
    include_s_s
  );
  const intersect_seg_seg_exclude = (a0, a1, b0, b1) => intersect_lines(
    subtract(a1, a0), a0,
    subtract(b1, b0), b0,
    exclude_s_s
  );
  const quick_equivalent_2 = function (a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
  };
  const convex_poly_line_intersect = (intersect_func, poly, line1, line2) => {
    const intersections = poly
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(el => intersect_func(line1, line2, el[0], el[1]))
      .filter(el => el != null);
    switch (intersections.length) {
      case 0: return undefined;
      case 1: return [intersections];
      default:
        for (let i = 1; i < intersections.length; i += 1) {
          if (!quick_equivalent_2(intersections[0], intersections[i])) {
            return [intersections[0], intersections[i]];
          }
        }
        return [intersections[0]];
    }
  };
  const convex_poly_line = (poly, vec, org, ep = EPSILON) =>
    convex_poly_line_intersect(intersect_line_seg, poly, vec, org);
  const convex_poly_ray_inclusive = (poly, vec, org, ep = EPSILON) =>
    convex_poly_line_intersect(intersect_ray_seg_include, poly, vec, org);
  const convex_poly_ray_exclusive = (poly, vec, org, ep = EPSILON) =>
    convex_poly_line_intersect(intersect_ray_seg_exclude, poly, vec, org);
  const convex_poly_segment_inclusive$1 = (poly, pt0, pt1, ep = EPSILON) =>
    convex_poly_line_intersect(intersect_seg_seg_include, poly, pt0, pt1);
  const convex_poly_segment_exclusive = (poly, pt0, pt1, ep = EPSILON) =>
    convex_poly_line_intersect(intersect_seg_seg_exclude, poly, pt0, pt1);
  var intersect_polygon = Object.freeze({
    __proto__: null,
    convex_poly_line: convex_poly_line,
    convex_poly_ray_inclusive: convex_poly_ray_inclusive,
    convex_poly_ray_exclusive: convex_poly_ray_exclusive,
    convex_poly_segment_inclusive: convex_poly_segment_inclusive$1,
    convex_poly_segment_exclusive: convex_poly_segment_exclusive
  });
  const line = (a, b, compFunc, epsilon) => intersect_lines(
    a.vector, a.origin, b.vector, b.origin, compFunc, epsilon
  );
  const convexPolyLine = (a, b) => convex_poly_line(
    a.constructor === Array ? a : a.points, b.vector, b.origin);
  const convexPolyRay = (a, b, fn) => fn(
    a.constructor === Array ? a : a.points, b.vector, b.origin);
  const convexPolySegment = (a, b, fn) => fn(
    a.constructor === Array ? a : a.points, b[0], b[1]);
  const intersect_func = {
    polygon: {
      line: convexPolyLine,
      ray: (a, b, c) => convexPolyRay(a, b, c === false
        ? convex_poly_ray_inclusive
        : convex_poly_ray_exclusive),
      segment: (a, b, c) => convexPolySegment(a, b, c === false
        ? convex_poly_segment_inclusive
        : convex_poly_segment_exclusive),
    },
    circle: {
      circle: circle_circle,
      line: circle_line,
      ray: circle_ray,
      segment: circle_segment,
    },
    line: {
      polygon: (a, b) => convexPolyLine(b, a),
      circle: (a, b) => circle_line(b, a),
      line: (a, b) => line(a, b, include_l_l),
      ray: (a, b, c) => line(a, b, c === false ? exclude_l_r : include_l_r),
      segment: (a, b, c) => line(a, b, c === false ? exclude_l_s : include_l_s),
    },
    ray: {
      polygon: (a, b, c) => convexPolyRay(b, a, c === false
        ? convex_poly_ray_inclusive
        : convex_poly_ray_exclusive),
      circle: (a, b) => circle_ray(b, a),
      line: (a, b, c) => line(b, a, c === false ? exclude_l_r : include_l_r),
      ray: (a, b, c) => line(a, b, c === false ? exclude_r_r : include_r_r),
      segment: (a, b, c) => line(a, b, c === false ? exclude_r_s : include_r_s),
    },
    segment: {
      polygon: (a, b, c) => convexPolySegment(b, a, c === false
        ? convex_poly_segment_inclusive
        : convex_poly_segment_exclusive),
      circle: (a, b) => circle_segment(b, a),
      line: (a, b, c) => line(b, a, c === false ? exclude_l_s : include_l_s),
      ray: (a, b, c) => line(b, a, c === false ? exclude_r_s : include_r_s),
      segment: (a, b, c) => line(a, b, c === false ? exclude_s_s : include_s_s),
    },
  };
  const intersect = function (a, b) {
    const aT = type_of(a);
    const bT = type_of(b);
    return intersect_func[aT][bT](...arguments);
  };
  const VectorArgs = function () {
    get_vector(arguments).forEach(n => this.push(n));
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
      dot: function () {
        return dot(...resize_up(this, get_vector(arguments)));
      },
      distanceTo: function () {
        return distance(...resize_up(this, get_vector(arguments)));
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
        return bisect_vectors(this, get_vector(arguments));
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
  const LineProto = {};
  LineProto.prototype = Object.create(Object.prototype);
  LineProto.prototype.constructor = LineProto;
  LineProto.prototype.isParallel = function () {
    const arr = resize_up(this.vector, get_line(...arguments).vector);
    return parallel(...arr);
  };
  LineProto.prototype.isDegenerate = function (epsilon = EPSILON) {
    return degenerate(this.vector);
  };
  LineProto.prototype.reflection = function () {
    return Constructors.matrix(make_matrix2_reflect(this.vector, this.origin));
  };
  LineProto.prototype.nearestPoint = function () {
    const point = get_vector(arguments);
    return Constructors.vector(
      nearest_point_on_line(this.vector, this.origin, point, this.clip_function)
    );
  };
  LineProto.prototype.transform = function () {
    const dim = this.dimension;
    const r = multiply_matrix3_line3(
      get_matrix_3x4(arguments),
      resize(3, this.vector),
      resize(3, this.origin)
    );
    return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
  };
  LineProto.prototype.intersect = function (other) {
    return intersect(this, other);
  };
  LineProto.prototype.bisect = function () {
    const line = get_line(arguments);
    return bisect_lines2(this.vector, this.origin, line.vector, line.origin);
  };
  Object.defineProperty(LineProto.prototype, "dimension", {
    get: function () {
      return [this.vector, this.origin]
        .map(p => p.length)
        .reduce((a, b) => Math.max(a, b), 0);
    }
  });
  var Static = {
    fromPoints: function () {
      const points = get_vector_of_vectors(arguments);
      return this.constructor({
        vector: subtract(points[1], points[0]),
        origin: points[0],
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
  var Line = {
    line: {
      P: LineProto.prototype,
      A: function () {
        const l = get_line(...arguments);
        this.vector = Constructors.vector(l.vector);
        this.origin = Constructors.vector(resize(this.vector.length, l.origin));
      },
      G: {
        length: () => Infinity,
      },
      M: {
        clip_function: dist => dist,
        svgPath: function (length = 20000) {
          const start = this.origin.add(this.vector.scale(-length / 2));
          const end = this.vector.scale(length);
          return `M${start[0]} ${start[1]}l${end[0]} ${end[1]}`;
        },
      },
      S: Static
    }
  };
  var Ray = {
    ray: {
      P: LineProto.prototype,
      A: function () {
        const ray = get_line(...arguments);
        this.vector = Constructors.vector(ray.vector);
        this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
      },
      G: {
        length: () => Infinity,
      },
      M: {
        rotate180: function () {
          return Constructors.ray(flip(this.vector), this.origin);
        },
        clip_function: dist => (dist < -EPSILON ? 0 : dist),
        svgPath: function (length = 10000) {
          const end = this.vector.scale(length);
          return `M${this.origin[0]} ${this.origin[1]}l${end[0]} ${end[1]}`;
        },
      },
      S: Static
    }
  };
  var Segment = {
    segment: {
      P: LineProto.prototype,
      A: function () {
        const args = get_segment(...arguments);
        this.points = [
          Constructors.vector(args[0]),
          Constructors.vector(args[1])
        ];
        this.vector = this.points[1].subtract(this.points[0]);
        this.origin = this.points[0];
      },
      G: {
        0: function () { return this.points[0]; },
        1: function () { return this.points[1]; },
        length: function () { return this.vector.magnitude(); }
      },
      M: {
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
        midpoint: function () {
          return Constructors.vector(average(this.points[0], this.points[1]));
        },
        svgPath: function () {
          const pointStrings = this.points.map(p => `${p[0]} ${p[1]}`);
          return ["M", "L"].map((cmd, i) => `${cmd}${pointStrings[i]}`)
            .join("");
        },
      },
      S: {
        fromPoints: function () {
          return this.constructor(...arguments);
        }
      }
    }
  };
  const CircleArgs = function () {
    const vectors = get_vector_of_vectors(arguments);
    const numbers = resize(3, flatten_arrays(arguments));
    if (vectors.length === 2) {
      this.radius = vectors[0].length === 1
        ? vectors[0][0] : distance2(...vectors);
      this.origin = vectors[0].length === 1
        ? Constructors.vector(...vectors[1])
        : Constructors.vector(...vectors[0]);
    } else {
      this.radius = numbers[0];
      this.origin = Constructors.vector(numbers[1], numbers[2]);
    }
  };
  const CircleGetters = {
    x: function () { return this.origin[0]; },
    y: function () { return this.origin[1]; },
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
      return intersect(this, object);
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
      return this.constructor(...arguments);
    },
    fromThreePoints: function () {
      const result = circumcircle(...arguments);
      return this.constructor(result.radius, ...result.origin);
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
  const methods = {
    area: function () {
      return signed_area(this);
    },
    centroid: function () {
      return Constructors.vector(centroid(this));
    },
    enclosingRectangle: function () {
      return Constructors.rect(enclosing_rectangle(this));
    },
    contains: function () {
      return point_in_poly(get_vector(arguments), this);
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
    overlaps: function () {
      const poly2Points = semi_flatten_arrays(arguments);
      return overlap_convex_polygons_exclusive(this, poly2Points);
    },
    split: function () {
      const line = get_line(...arguments);
      const split_func = this.isConvex ? split_convex_polygon : split_polygon;
      return split_func(this, line.vector, line.origin)
        .map(poly => Constructors.polygon(poly));
    },
    intersectLine: function () {
      const line = get_line(...arguments);
      return convex_poly_line(this, line.vector, line.origin);
    },
    intersectRay: function () {
      const line = get_line(...arguments);
      return convex_poly_ray_exclusive(this, line.vector, line.origin);
    },
    intersectSegment: function () {
      const edge = get_segment(...arguments);
      return convex_poly_segment_exclusive(this, edge[0], edge[1]);
    },
    svgPath: function () {
      const pre = Array(this.length).fill("L");
      pre[0] = "M";
      return `${this.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}z`;
    },
    intersect: function (other) {
      return intersect(this, other);
    },
  };
  const PolygonProto = {};
  PolygonProto.prototype = Object.create(Array.prototype);
  PolygonProto.prototype.constructor = PolygonProto;
  Object.keys(methods).forEach((key) => {
    PolygonProto.prototype[key] = methods[key];
  });
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
      P: PolygonProto.prototype,
      A: function () {
        const r = get_rect(...arguments);
        this.width = r.width;
        this.height = r.height;
        this.origin = Constructors.vector(r.x, r.y);
        this.push(...rectToPoints(this));
      },
      G: {
        x: function () { return this.origin[0]; },
        y: function () { return this.origin[1]; },
      },
      M: {
        area: function () { return this.width * this.height; },
        segments: function () { return rectToSides(this); },
      },
      S: {
        fromPoints: function () {
          return Constructors.rect(enclosing_rectangle(get_vector_of_vectors(arguments)));
        }
      }
    }
  };
  var Polygon = {
    polygon: {
      P: PolygonProto.prototype,
      A: function () {
        this.push(...semi_flatten_arrays(arguments));
        this.sides = this
          .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
        this.vectors = this.sides.map(side => subtract(side[1], side[0]));
      },
      G: {
        isConvex: function () {
          return true;
        },
        points: function () {
          return this;
        },
        edges: function () {
          return this.sides;
        },
      },
      M: {
        segments: function () {
          return this.sides;
        },
      },
      S: {
        fromPoints: function () {
          return this.constructor(...arguments);
        },
        regularPolygon: function (sides, radius = 1, x = 0, y = 0) {
          return this.constructor(make_regular_polygon(sides, radius, x, y));
        },
        convexHull: function (points, includeCollinear = false) {
          return this.constructor(convex_hull(points, includeCollinear));
        },
      }
    }
  };
  const assign = (thisMat, mat) => {
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
          return assign(this, get_matrix_3x4(arguments));
        },
        isIdentity: function () { return is_identity3x4(this); },
        multiply: function (mat) {
          return assign(this, multiply_matrices3(this, mat));
        },
        determinant: function () {
          return determinant3(this);
        },
        inverse: function () {
          return assign(this, invert_matrix3(this));
        },
        translate: function (x, y, z) {
          return assign(this,
            multiply_matrices3(this, make_matrix3_translate(x, y, z)));
        },
        rotateX: function (radians) {
          return assign(this,
            multiply_matrices3(this, make_matrix3_rotateX(radians)));
        },
        rotateY: function (radians) {
          return assign(this,
            multiply_matrices3(this, make_matrix3_rotateY(radians)));
        },
        rotateZ: function (radians) {
          return assign(this,
            multiply_matrices3(this, make_matrix3_rotateZ(radians)));
        },
        rotate: function (radians, vector, origin) {
          const transform = make_matrix3_rotate(radians, vector, origin);
          return assign(this, multiply_matrices3(this, transform));
        },
        scale: function (amount) {
          return assign(this,
            multiply_matrices3(this, make_matrix3_scale(amount)));
        },
        reflectZ: function (vector, origin) {
          const transform = make_matrix3_reflectZ(vector, origin);
          return assign(this, multiply_matrices3(this, transform));
        },
        transform: function (...innerArgs) {
          return Constructors.vector(
            multiply_matrix3_vector3(get_vector(innerArgs), this)
          );
        },
        transformVector: function (vector) {
          return Constructors.vector(multiply_matrix3_vector3(this, vector));
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
  const line$1 = function () { return create("line", arguments); };
  const ray = function () { return create("ray", arguments); };
  const segment = function () { return create("segment", arguments); };
  const matrix = function () { return create("matrix", arguments); };
  Object.assign(Constructors, {
    vector,
    circle,
    ellipse,
    rect,
    polygon,
    line: line$1,
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
    algebra,
    equal,
    geometry,
    matrix2,
    matrix3,
    nearest,
    overlap,
    getters,
    resizers,
    intersect_circle,
    intersect_lines$1,
    intersect_polygon,
  );
  math.typeof = type_of;
  math.intersect = intersect;

  var root = Object.create(null);

  const use = function (library) {
    if (typeof library !== "function"
      || library === null
      || typeof library.append !== "function") {
      return;
    }
    library.append(this);
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
  const ear_spec = {
    FACES_MATRIX: "faces_ear:matrix",
    FACES_LAYER: "faces_ear:layer",
    SECTORS_VERTICES: "ear:sectors_vertices",
    SECTORS_EDGES: "ear:sectors_edges",
    SECTORS_ANGLES: "ear:sectors_angles",
    VERTICES_SECTORS_VERTICES: "vertices_ear:sectors_vertices",
  };
  const file_classes = [
    "singleModel",
    "multiModel",
    "animation",
    "diagrams"
  ];
  const frame_classes = [
    "creasePattern",
    "foldedForm",
    "graph",
    "linkage"
  ];
  const frame_attributes = [
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
    "nonSelfIntersecting"
  ];
  const edges_assignment_values = [
    "M", "m", "V", "v", "B", "b", "F", "f", "U", "u"
  ];
  const edges_assignment_names = {
    M: "mountain",
    m: "mountain",
    V: "valley",
    v: "valley",
    B: "boundary",
    b: "boundary",
    F: "mark",
    f: "mark",
    U: "unassigned",
    u: "unassigned"
  };
  const assignment_angles = {
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
  const FOLDED_FORM = "foldedForm";
  const CREASE_PATTERN = "creasePattern";
  const VERTICES = "vertices";
  const EDGES = "edges";
  const FACES = "faces";
  const edge_assignment_to_foldAngle = assignment =>
    assignment_angles[assignment] || 0;
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
      .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
      .forEach(key => geometry
        .forEach((o, i) => { geometry[i][key.short] = graph[key.long][i]; }));
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
    matching_keys
      .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
      .forEach((key) => { geometry[key.short] = graph[key.long][index]; });
    return geometry;
  };

  var keys$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    file_spec: file_spec,
    file_creator: file_creator,
    fold_keys: fold_keys,
    keys: keys,
    ear_spec: ear_spec,
    file_classes: file_classes,
    frame_classes: frame_classes,
    frame_attributes: frame_attributes,
    edges_assignment_values: edges_assignment_values,
    edges_assignment_names: edges_assignment_names,
    FOLDED_FORM: FOLDED_FORM,
    CREASE_PATTERN: CREASE_PATTERN,
    VERTICES: VERTICES,
    EDGES: EDGES,
    FACES: FACES,
    edge_assignment_to_foldAngle: edge_assignment_to_foldAngle,
    filter_keys_with_suffix: filter_keys_with_suffix,
    filter_keys_with_prefix: filter_keys_with_prefix,
    get_graph_keys_with_prefix: get_graph_keys_with_prefix,
    get_graph_keys_with_suffix: get_graph_keys_with_suffix,
    transpose_graph_arrays: transpose_graph_arrays,
    transpose_graph_array_at_index: transpose_graph_array_at_index
  });

  const make_vertices_edges = function ({ edges_vertices }) {
    if (!edges_vertices) { return undefined; }
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
  const make_edges_vertices = function ({
    edges_vertices, faces_edges
  }) {
    if (!edges_vertices || !faces_edges) { return undefined; }
    const edges_faces = Array
      .from(Array(edges_vertices.length))
      .map(() => []);
    faces_edges.forEach((face, f) => {
      const hash = [];
      face.forEach((edge) => { hash[edge] = f; });
      hash.forEach((fa, e) => edges_faces[e].push(fa));
    });
    return edges_faces;
  };
  const make_faces_faces = function ({ faces_vertices }) {
    if (!faces_vertices) { return undefined; }
    const nf = faces_vertices.length;
    const faces_faces = Array.from(Array(nf)).map(() => []);
    const edgeMap = {};
    faces_vertices.forEach((vertices_index, idx1) => {
      if (vertices_index === undefined) { return; }
      const n = vertices_index.length;
      vertices_index.forEach((v1, i, vs) => {
        let v2 = vs[(i + 1) % n];
        if (v2 < v1) { [v1, v2] = [v2, v1]; }
        const key = `${v1} ${v2}`;
        if (key in edgeMap) {
          const idx2 = edgeMap[key];
          faces_faces[idx1].push(idx2);
          faces_faces[idx2].push(idx1);
        } else {
          edgeMap[key] = idx1;
        }
      });
    });
    return faces_faces;
  };
  const make_edges_edges = function ({
    edges_vertices, vertices_edges
  }) {
    if (!edges_vertices || !vertices_edges) { return undefined; }
    return edges_vertices.map((ev, i) => {
      const vert0 = ev[0];
      const vert1 = ev[1];
      const side0 = vertices_edges[vert0].filter(e => e !== i);
      const side1 = vertices_edges[vert1].filter(e => e !== i);
      return side0.concat(side1);
    });
  };
  const make_edges_faces = function ({
    edges_vertices, faces_edges
  }) {
    if (!edges_vertices || !faces_edges) { return undefined; }
    const edges_faces = Array
      .from(Array(edges_vertices.length))
      .map(() => []);
    faces_edges.forEach((face, f) => {
      const hash = [];
      face.forEach((edge) => { hash[edge] = f; });
      hash.forEach((fa, e) => edges_faces[e].push(fa));
    });
    return edges_faces;
  };
  const make_edges_length = function ({ vertices_coords, edges_vertices }) {
    if (!vertices_coords || !edges_vertices) { return undefined; }
    return edges_vertices
      .map(ev => ev.map(v => vertices_coords[v]))
      .map(edge => math.core.distance(...edge));
  };
  const assignment_angles$1 = {
    M: -180,
    m: -180,
    V: 180,
    v: 180
  };
  const make_edges_foldAngle = function ({ edges_assignment }) {
    if (!edges_assignment) { return undefined; }
    return edges_assignment.map(a => assignment_angles$1[a] || 0);
  };
  const make_vertex_pair_to_edge_map = function ({ edges_vertices }) {
    if (!edges_vertices) { return {}; }
    const map = {};
    edges_vertices
      .map(ev => ev.sort((a, b) => a - b).join(" "))
      .forEach((key, i) => { map[key] = i; });
    return map;
  };
  const make_vertices_faces = function ({
    vertices_coords, faces_vertices
  }) {
    if (!vertices_coords || !faces_vertices) { return undefined; }
    const vertices_faces = Array.from(Array(vertices_coords.length))
      .map(() => []);
    faces_vertices.forEach((face, f) => {
      const hash = [];
      face.forEach((vertex) => { hash[vertex] = f; });
      hash.forEach((fa, v) => vertices_faces[v].push(fa));
    });
    return vertices_faces;
  };
  const faces_common_vertices = (face_a_vertices, face_b_vertices) => {
    const map = {};
    face_b_vertices.forEach((v) => { map[v] = true; });
    const match = face_a_vertices.map((v, i) => map[v]);
    if (match[0] && match[match.length-1]) {
      let start = match.length - 1;
      let end = 0;
      for (; start > 0; start -= 1) { if (!match[start]) { break; } }
      for (; end < match.length - 1; end += 1) { if (!match[end]) { break; } }
      if (start < end) { return face_a_vertices; }
      return face_a_vertices.slice(start + 1, face_a_vertices.length)
        .concat(face_a_vertices.slice(0, end));
    }
    return face_a_vertices.filter((_, i) => match[i]);
  };
  const make_face_walk_tree = function (graph, root_face = 0) {
    const edge_map = make_vertex_pair_to_edge_map(graph);
    const new_faces_faces = graph.faces_faces
      ? graph.faces_faces
      : make_faces_faces(graph);
    if (new_faces_faces.length <= 0) {
      return [];
    }
    let visited = [root_face];
    const list = [[{
      face: root_face,
      parent: undefined,
      edge: undefined,
    }]];
    do {
      list[list.length] = list[list.length - 1].map((current) => {
        const unique_faces = new_faces_faces[current.face]
          .filter(f => visited.indexOf(f) === -1);
        visited = visited.concat(unique_faces);
        return unique_faces.map((f) => {
          const edge_vertices = faces_common_vertices(
            graph.faces_vertices[current.face],
            graph.faces_vertices[f]
          );
          const edge_key = edge_vertices
            .slice(0, 2)
            .sort((a, b) => a - b)
            .join(" ");
          const edge = edge_map[edge_key];
          return {
            face: f,
            parent: current.face,
            edge,
            edge_vertices,
          };
        });
      }).reduce((prev, curr) => prev.concat(curr), []);
    } while (list[list.length - 1].length > 0);
    if (list.length > 0 && list[list.length - 1].length === 0) { list.pop(); }
    return list;
  };
  const is_mark = (a => a === "f" || a === "F" || a === "u" || a === "U");
  const make_faces_matrix = function (graph, root_face) {
    const faces_matrix = graph.faces_vertices.map(() => math.core.identity3x4);
    make_face_walk_tree(graph, root_face).forEach((level) => {
      level.filter(entry => entry.parent != null).forEach((entry) => {
        const verts = entry.edge_vertices.map(v => graph.vertices_coords[v]);
        const edge_foldAngle = graph.edges_foldAngle[entry.edge] / 180 * Math.PI;
        const axis_vector = math.core.resize(3, math.core.subtract(verts[1], verts[0]));
        const axis_origin = math.core.resize(3, verts[0]);
        const local = math.core.make_matrix3_rotate(
          edge_foldAngle, axis_vector, axis_origin,
        );
        faces_matrix[entry.face] = math.core
          .multiply_matrices3(faces_matrix[entry.parent], local);
      });
    });
    return faces_matrix;
  };
  const make_faces_matrix_2D = function (graph, root_face) {
    if (graph.faces_vertices == null || graph.edges_vertices == null) {
      return undefined;
    }
    const skip_marks = ("edges_assignment" in graph === true);
    const edge_fold = skip_marks
      ? graph.edges_assignment.map(a => !is_mark(a))
      : graph.edges_vertices.map(() => true);
    const faces_matrix = graph.faces_vertices.map(() => [1, 0, 0, 1, 0, 0]);
    make_face_walk_tree(graph, root_face).forEach((level) => {
      level.filter(entry => entry.parent != null).forEach((entry) => {
        const verts = entry.edge_vertices.map(v => graph.vertices_coords[v]);
        const vec = [verts[1][0] - verts[0][0], verts[1][1] - verts[0][1]];
        const local = edge_fold[entry.edge]
          ? math.core.make_matrix2_reflect(vec, verts[0])
          : [1, 0, 0, 1, 0, 0];
        faces_matrix[entry.face] = math.core
          .multiply_matrices2(faces_matrix[entry.parent], local);
      });
    });
    return faces_matrix;
  };
  const make_faces_matrix_inv = function (graph, root_face) {
    const edge_fold = ("edges_assignment" in graph === true)
      ? graph.edges_assignment.map(a => !is_mark(a))
      : graph.edges_vertices.map(() => true);
    const faces_matrix = graph.faces_vertices.map(() => [1, 0, 0, 1, 0, 0]);
    make_face_walk_tree(graph, root_face).forEach((level) => {
      level.filter(entry => entry.parent != null).forEach((entry) => {
        const verts = entry.edge_vertices.map(v => graph.vertices_coords[v]);
        const vec = [verts[1][0] - verts[0][0], verts[1][1] - verts[0][1]];
        const local = edge_fold[entry.edge]
          ? math.core.make_matrix2_reflect(vec, verts[0])
          : [1, 0, 0, 1, 0, 0];
        faces_matrix[entry.face] = math.core
          .multiply_matrices2(local, faces_matrix[entry.parent]);
      });
    });
    return faces_matrix;
  };
  const make_vertices_coords_folded = function (graph, face_stationary, faces_matrix) {
    if (graph.vertices_coords == null || graph.faces_vertices == null) { return undefined; }
    if (face_stationary == null) { face_stationary = 0; }
    if (faces_matrix == null) {
      faces_matrix = make_faces_matrix(graph, face_stationary);
    } else {
      const face_array = graph.faces_vertices != null
        ? graph.faces_vertices : graph.faces_edges;
      const facesCount = face_array != null ? face_array.length : 0;
      if (faces_matrix.length !== facesCount) {
        faces_matrix = make_faces_matrix(graph, face_stationary);
      }
    }
    const vertex_in_face = graph.vertices_coords.map((v, i) => {
      for (let f = 0; f < graph.faces_vertices.length; f += 1) {
        if (graph.faces_vertices[f].includes(i)) { return f; }
      }
      return face_stationary;
    });
    return graph.vertices_coords.map((point, i) => math.core
      .multiply_matrix2_vector2(faces_matrix[vertex_in_face[i]], point)
      .map(n => math.core.clean_number(n)));
  };
  const make_vertices_isBoundary = function (graph) {
    const vertices_edges = make_vertices_edges(graph);
    const edges_isBoundary = graph.edges_assignment
      .map(a => a === "b" || a === "B");
    return vertices_edges
      .map(edges => edges.map(e => edges_isBoundary[e])
        .reduce((a, b) => a || b, false));
  };
  const make_faces_coloring_from_faces_matrix = function (faces_matrix) {
    return faces_matrix
      .map(m => m[0] * m[3] - m[1] * m[2])
      .map(c => c >= 0);
  };
  const make_faces_coloring = function (graph, root_face = 0) {
    const coloring = [];
    coloring[root_face] = true;
    make_face_walk_tree(graph, root_face)
      .forEach((level, i) => level
        .forEach((entry) => { coloring[entry.face] = (i % 2 === 0); }));
    return coloring;
  };

  var make = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_vertices_edges: make_vertices_edges,
    make_edges_vertices: make_edges_vertices,
    make_faces_faces: make_faces_faces,
    make_edges_edges: make_edges_edges,
    make_edges_faces: make_edges_faces,
    make_edges_length: make_edges_length,
    make_edges_foldAngle: make_edges_foldAngle,
    make_vertex_pair_to_edge_map: make_vertex_pair_to_edge_map,
    make_vertices_faces: make_vertices_faces,
    make_face_walk_tree: make_face_walk_tree,
    make_faces_matrix: make_faces_matrix,
    make_faces_matrix_2D: make_faces_matrix_2D,
    make_faces_matrix_inv: make_faces_matrix_inv,
    make_vertices_coords_folded: make_vertices_coords_folded,
    make_vertices_isBoundary: make_vertices_isBoundary,
    make_faces_coloring_from_faces_matrix: make_faces_coloring_from_faces_matrix,
    make_faces_coloring: make_faces_coloring
  });

  const core = Object.assign(Object.create(null),
    keys$1,
    make
  );
  const Ear = Object.assign(root, {
    math: math.core,
    core,
  });
  Ear.use = use.bind(Ear);
  Object.keys(math)
    .filter(key => key !== "core")
    .forEach((key) => { Ear[key] = math[key]; });

  return Ear;

})));
