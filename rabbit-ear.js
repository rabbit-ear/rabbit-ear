/* Rabbit Ear v0.1.91 (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ear = factory());
}(this, (function () { 'use strict';

  const isBrowser = typeof window !== "undefined"
    && typeof window.document !== "undefined";
  const isNode = typeof process !== "undefined"
    && process.versions != null
    && process.versions.node != null;

  const htmlString = "<!DOCTYPE html><title> </title>";
  const win = (function () {
    let w = {};
    if (isNode) {
      const { DOMParser, XMLSerializer } = require("xmldom");
      w.DOMParser = DOMParser;
      w.XMLSerializer = XMLSerializer;
      w.document = new DOMParser().parseFromString(htmlString, "text/html");
    } else if (isBrowser) {
      w = window;
    }
    return w;
  }());

  const magnitude = v => Math.sqrt(v
    .map(n => n * n)
    .reduce((a, b) => a + b, 0));
  const normalize = (v) => {
    const m = magnitude(v);
    return m === 0 ? v : v.map(c => c / m);
  };
  const scale = (v, s) => v.map(n => n * s);
  const add = (v, u) => v.map((n, i) => n + u[i]);
  const subtract = (v, u) => v.map((n, i) => n - u[i]);
  const dot = (v, u) => v
    .map((_, i) => v[i] * u[i])
    .reduce((a, b) => a + b, 0);
  const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
  const average = function () {
    const dimension = (arguments.length > 0) ? arguments[0].length : 0;
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
  const distance = (a, b) => Math.sqrt(Array.from(Array(a.length))
    .map((_, i) => (a[i] - b[i]) ** 2)
    .reduce((u, v) => u + v, 0));
  const rotate90 = v => [-v[1], v[0]];
  const flip = v => v.map(n => -n);
  const rotate270 = v => [-v[1], v[0]];
  var algebra = Object.freeze({
    __proto__: null,
    magnitude: magnitude,
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
    rotate90: rotate90,
    flip: flip,
    rotate270: rotate270
  });
  var Constructors = {};
  const identity2x2 = [1, 0, 0, 1];
  const identity2x3 = [1, 0, 0, 1, 0, 0];
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
  const make_matrix2_translate = (x, y) => [1, 0, 0, 1, x, y];
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
  const make_matrix2_reflection = (vector, origin = [0, 0]) => {
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
    make_matrix2_reflection: make_matrix2_reflection
  });
  const identity3x3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const identity3x4 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
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
  const make_matrix3_translate = (x = 0, y = 0, z = 0) => [
    1, 0, 0, 0, 1, 0, 0, 0, 1, x, y, z
  ];
  const make_matrix3_rotateX = (angle, origin = [0, 0, 0]) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      1, 0, 0,
      0, cos, sin,
      0, -sin, cos,
      origin[0] || 0, origin[1] || 0, origin[2] || 0
    ];
  };
  const make_matrix3_rotateY = (angle, origin = [0, 0, 0]) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      cos, 0, -sin,
      0, 1, 0,
      sin, 0, cos,
      origin[0] || 0, origin[1] || 0, origin[2] || 0
    ];
  };
  const make_matrix3_rotateZ = (angle, origin = [0, 0, 0]) => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return [
      cos, sin, 0,
      -sin, cos, 0,
      0, 0, 1,
      origin[0] || 0, origin[1] || 0, origin[2] || 0
    ];
  };
  const make_matrix3_rotate = (angle, vector = [0, 0, 1], origin = [0, 0, 0]) => {
    const vec = normalize(vector);
    const pos = Array.from(Array(3)).map((n, i) => origin[i] || 0);
    const [a, b, c] = vec;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const d = Math.sqrt((vec[1] * vec[1]) + (vec[2] * vec[2]));
    const b_d = Math.abs(d) < 1e-6 ? 0 : b / d;
    const c_d = Math.abs(d) < 1e-6 ? 1 : c / d;
    const t     = [1, 0, 0, 0, 1, 0, 0, 0, 1, pos[0], pos[1], pos[2]];
    const t_inv = [1, 0, 0, 0, 1, 0, 0, 0, 1, -pos[0], -pos[1], -pos[2]];
    const rx     = [1, 0, 0, 0, c_d, b_d, 0, -b_d, c_d, 0, 0, 0];
    const rx_inv = [1, 0, 0, 0, c_d, -b_d, 0, b_d, c_d, 0, 0, 0];
    const ry     = [d, 0, a, 0, 1, 0, -a, 0, d, 0, 0, 0];
    const ry_inv = [d, 0, -a, 0, 1, 0, a, 0, d, 0, 0, 0];
    const rz     = [cos, sin, 0, -sin, cos, 0, 0, 0, 1, 0, 0, 0];
    return multiply_matrices3(t_inv,
      multiply_matrices3(rx_inv,
        multiply_matrices3(ry_inv,
          multiply_matrices3(rz,
            multiply_matrices3(ry,
              multiply_matrices3(rx, t))))));
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
  const make_matrix3_reflectionZ = (vector, origin = [0, 0]) => {
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
  const make_matrix3_reflection = (vector, origin = [0, 0, 0]) => {
    return [];
  };
  var matrix3 = Object.freeze({
    __proto__: null,
    identity3x3: identity3x3,
    identity3x4: identity3x4,
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
    make_matrix3_reflectionZ: make_matrix3_reflectionZ,
    make_matrix3_reflection: make_matrix3_reflection
  });
  const R2D = 180 / Math.PI;
  const D2R = Math.PI / 180;
  const Typeof = function (obj) {
    if (typeof obj === "object") {
      if (obj.radius != null) { return "circle"; }
      if (obj.width != null) { return "rectangle"; }
      if (obj.x != null) { return "vector"; }
      if (obj.rotate180 != null) { return "ray"; }
      if (obj[0] != null && obj[0].length && obj[0].x != null) { return "segment"; }
      if (obj.vector != null && obj.origin != null) { return "line"; }
    }
    return undefined;
  };
  const vector_origin_form = (vector, origin) => ({
    vector: vector || [],
    origin: origin || []
  });
  const lengthSort = (a, b) => [a, b].sort((m, n) => m.length - n.length);
  const resize = (d, v) => Array(d).fill(0).map((z, i) => (v[i] ? v[i] : z));
  const resizeUp = (a, b) => {
    const size = a.length > b.length ? a.length : b.length;
    return [a, b].map(v => resize(size, v));
  };
  const resizeDown = (a, b) => {
    const size = a.length > b.length ? b.length : a.length;
    return [a, b].map(v => resize(size, v));
  };
  const countPlaces = function (num) {
    const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!m) { return 0; }
    return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
  };
  const clean_number = function (num, places = 15) {
    if (typeof num !== "number") { return num; }
    const crop = parseFloat(num.toFixed(places));
    if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
      return num;
    }
    return crop;
  };
  const is_number = (n => n != null && !isNaN(n));
  const is_vector = (a => a != null && a[0] != null && !isNaN(a[0]));
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
    const arr = semi_flatten_arrays(arguments);
    return arr.length > 1
      ? arr.reduce((a, b) => a.concat(b), [])
      : arr;
  };
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
    if (arguments[0] instanceof Constructors.segment) { return arguments[0]; }
    if (arguments.length === 4) {
      return [
        [arguments[0], arguments[1]],
        [arguments[2], arguments[3]]
      ];
    }
    return get_vector_of_vectors(arguments);
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
      .filter((_, i) => mat[i] != null)
      .forEach((n, i) => { matrix[n] = mat[i]; });
    return matrix;
  };
  const get_matrix2 = function () {
    const m = get_vector(arguments);
    if (m === undefined) { return undefined; }
    if (m.length === 6) { return m; }
    if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
    if (m.length < 6) {
      return identity2x3.map((n, i) => m[i] || n);
    }
    return undefined;
  };
  var Arguments = Object.freeze({
    __proto__: null,
    R2D: R2D,
    D2R: D2R,
    Typeof: Typeof,
    lengthSort: lengthSort,
    resize: resize,
    resizeUp: resizeUp,
    resizeDown: resizeDown,
    clean_number: clean_number,
    is_number: is_number,
    is_vector: is_vector,
    is_iterable: is_iterable,
    semi_flatten_arrays: semi_flatten_arrays,
    flatten_arrays: flatten_arrays,
    get_vector: get_vector,
    get_vector_of_vectors: get_vector_of_vectors,
    get_segment: get_segment,
    get_line: get_line,
    rect_form: rect_form,
    get_rect: get_rect,
    get_matrix_3x4: get_matrix_3x4,
    get_matrix2: get_matrix2
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
  const equivalent_vectors = (a, b) => {
    const vecs = resizeUp(a, b);
    return vecs[0].map((_, i) => Math.abs(vecs[0][i] - vecs[1][i]) < EPSILON)
      .reduce((u, v) => u && v, true);
  };
  const equivalent_vectors_old = (...args) => {
    const list = get_vector_of_vectors(...args);
    if (list.length === 0) { return false; }
    if (list.length === 1 && list[0] !== undefined) {
      return equivalent_vectors(...list[0]);
    }
    const dimension = list[0].length;
    const dim_array = Array.from(Array(dimension));
    for (let i = 1; i < list.length; i += 1) {
      if (typeof list[i - 1] !== typeof list[i]) { return false; }
    }
    return Array
      .from(Array(list.length - 1))
      .map((element, i) => dim_array
        .map((_, di) => Math.abs(list[i][di] - list[i + 1][di]) < EPSILON)
        .reduce((prev, curr) => prev && curr, true))
      .reduce((prev, curr) => prev && curr, true)
    && Array
      .from(Array(list.length - 1))
      .map((_, i) => list[0].length === list[i + 1].length)
      .reduce((a, b) => a && b, true);
  };
  const equivalent = (...args) => {
    const list = semi_flatten_arrays(args);
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
        console.warn("comparing array of objects for equivalency by slow JSON.stringify with no epsilon check");
        return array_similarity_test(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
      default:
        console.warn("incapable of determining comparison method");
        break;
    }
    return false;
  };
  var equal = Object.freeze({
    __proto__: null,
    EPSILON: EPSILON,
    equivalent_arrays_of_numbers: equivalent_arrays_of_numbers,
    equivalent_numbers: equivalent_numbers,
    equivalent_vectors: equivalent_vectors,
    equivalent_vectors_old: equivalent_vectors_old,
    equivalent: equivalent
  });
  const overlap_function = (aPt, aVec, bPt, bVec, compFunc) => {
    const det = (a, b) => a[0] * b[1] - b[0] * a[1];
    const denominator0 = det(aVec, bVec);
    const denominator1 = -denominator0;
    const numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
    const numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);
    if (Math.abs(denominator0) < EPSILON) {
      return false;
    }
    const t0 = numerator0 / denominator0;
    const t1 = numerator1 / denominator1;
    return compFunc(t0, t1);
  };
  const segment_segment_comp = (t0, t1) => t0 >= -EPSILON && t0 <= 1 + EPSILON
    && t1 >= -EPSILON && t1 <= 1 + EPSILON;
  const segment_segment_overlap = (a0, a1, b0, b1) => {
    const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return overlap_function(a0, aVec, b0, bVec, segment_segment_comp);
  };
  const degenerate = (v) => Math
    .abs(v.reduce((a, b) => a + b, 0)) < EPSILON;
  const parallel = (a, b) => 1 - Math
    .abs(dot(normalize(a), normalize(b))) < EPSILON;
  const is_identity3x4 = m => identity3x4
    .map((n, i) => Math.abs(n - m[i]) < EPSILON)
    .reduce((a, b) => a && b, true);
  const point_on_line = (linePoint, lineVector, point, epsilon = EPSILON) => {
    const pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
    const cross = pointPoint[0] * lineVector[1] - pointPoint[1] * lineVector[0];
    return Math.abs(cross) < epsilon;
  };
  const point_on_segment = (seg0, seg1, point, epsilon = EPSILON) => {
    const seg0_1 = [seg0[0] - seg1[0], seg0[1] - seg1[1]];
    const seg0_p = [seg0[0] - point[0], seg0[1] - point[1]];
    const seg1_p = [seg1[0] - point[0], seg1[1] - point[1]];
    const dEdge = Math.sqrt(seg0_1[0] * seg0_1[0] + seg0_1[1] * seg0_1[1]);
    const dP0 = Math.sqrt(seg0_p[0] * seg0_p[0] + seg0_p[1] * seg0_p[1]);
    const dP1 = Math.sqrt(seg1_p[0] * seg1_p[0] + seg1_p[1] * seg1_p[1]);
    return Math.abs(dEdge - dP0 - dP1) < epsilon;
  };
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
  const point_in_convex_poly = (point, poly, epsilon = EPSILON) => {
    if (poly == null || !(poly.length > 0)) { return false; }
    return poly.map((p, i, arr) => {
      const nextP = arr[(i + 1) % arr.length];
      const a = [nextP[0] - p[0], nextP[1] - p[1]];
      const b = [point[0] - p[0], point[1] - p[1]];
      return a[0] * b[1] - a[1] * b[0] > -epsilon;
    }).map((s, i, arr) => s === arr[0])
      .reduce((prev, curr) => prev && curr, true);
  };
  const point_in_convex_poly_exclusive = (point, poly, epsilon = EPSILON) => {
    if (poly == null || !(poly.length > 0)) { return false; }
    return poly.map((p, i, arr) => {
      const nextP = arr[(i + 1) % arr.length];
      const a = [nextP[0] - p[0], nextP[1] - p[1]];
      const b = [point[0] - p[0], point[1] - p[1]];
      return a[0] * b[1] - a[1] * b[0] > epsilon;
    }).map((s, i, arr) => s === arr[0])
      .reduce((prev, curr) => prev && curr, true);
  };
  const convex_polygons_overlap = (ps1, ps2) => {
    const e1 = ps1.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
    const e2 = ps2.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
    for (let i = 0; i < e1.length; i += 1) {
      for (let j = 0; j < e2.length; j += 1) {
        if (segment_segment_overlap(e1[i][0], e1[i][1], e2[j][0], e2[j][1])) {
          return true;
        }
      }
    }
    if (point_in_poly(ps2[0], ps1)) { return true; }
    if (point_in_poly(ps1[0], ps2)) { return true; }
    return false;
  };
  const convex_polygon_is_enclosed = (inner, outer) => {
    const goesInside = outer
      .map(p => point_in_convex_poly(p, inner))
      .reduce((a, b) => a || b, false);
    if (goesInside) { return false; }
    return undefined;
  };
  const convex_polygons_enclose = (inner, outer) => {
    const outerGoesInside = outer
      .map(p => point_in_convex_poly(p, inner))
      .reduce((a, b) => a || b, false);
    const innerGoesOutside = inner
      .map(p => point_in_convex_poly(p, inner))
      .reduce((a, b) => a && b, true);
    return (!outerGoesInside && innerGoesOutside);
  };
  const is_counter_clockwise_between = (angle, angleA, angleB) => {
    while (angleB < angleA) { angleB += Math.PI * 2; }
    while (angle < angleA) { angle += Math.PI * 2; }
    return angle < angleB;
  };
  var query = Object.freeze({
    __proto__: null,
    overlap_function: overlap_function,
    segment_segment_overlap: segment_segment_overlap,
    degenerate: degenerate,
    parallel: parallel,
    is_identity3x4: is_identity3x4,
    point_on_line: point_on_line,
    point_on_segment: point_on_segment,
    point_in_poly: point_in_poly,
    point_in_convex_poly: point_in_convex_poly,
    point_in_convex_poly_exclusive: point_in_convex_poly_exclusive,
    convex_polygons_overlap: convex_polygons_overlap,
    convex_polygon_is_enclosed: convex_polygon_is_enclosed,
    convex_polygons_enclose: convex_polygons_enclose,
    is_counter_clockwise_between: is_counter_clockwise_between
  });
  const comp_l_l = () => true;
  const comp_l_r = (t0, t1) => t1 >= -EPSILON;
  const comp_l_s = (t0, t1) => t1 >= -EPSILON && t1 <= 1 + EPSILON;
  const comp_r_r = (t0, t1) => t0 >= -EPSILON && t1 >= -EPSILON;
  const comp_r_s = (t0, t1) => t0 >= -EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
  const comp_s_s = (t0, t1) => t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON
    && t1 <= 1 + EPSILON;
  const exclude_l_r = (t0, t1) => t1 > EPSILON;
  const exclude_l_s = (t0, t1) => t1 > EPSILON && t1 < 1 - EPSILON;
  const exclude_r_r = (t0, t1) => t0 > EPSILON && t1 > EPSILON;
  const exclude_r_s = (t0, t1) => t0 > EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
  const exclude_s_s = (t0, t1) => t0 > EPSILON && t0 < 1 - EPSILON && t1 > EPSILON
    && t1 < 1 - EPSILON;
  const intersect = (a, b, compFunc, epsilon = EPSILON) => {
    const denominator0 = cross2(a.vector, b.vector);
    if (Math.abs(denominator0) < epsilon) { return undefined; }
    const denominator1 = -denominator0;
    const numerator0 = cross2([
      b.origin[0] - a.origin[0],
      b.origin[1] - a.origin[1]],
    b.vector);
    const numerator1 = cross2([
      a.origin[0] - b.origin[0],
      a.origin[1] - b.origin[1]],
    a.vector);
    const t0 = numerator0 / denominator0;
    const t1 = numerator1 / denominator1;
    if (compFunc(t0, t1, epsilon)) {
      return [a.origin[0] + a.vector[0] * t0, a.origin[1] + a.vector[1] * t0];
    }
    return undefined;
  };
  var IntersectionLines = Object.freeze({
    __proto__: null,
    comp_l_l: comp_l_l,
    comp_l_r: comp_l_r,
    comp_l_s: comp_l_s,
    comp_r_r: comp_r_r,
    comp_r_s: comp_r_s,
    comp_s_s: comp_s_s,
    exclude_l_r: exclude_l_r,
    exclude_l_s: exclude_l_s,
    exclude_r_r: exclude_r_r,
    exclude_r_s: exclude_r_s,
    exclude_s_s: exclude_s_s,
    intersect: intersect
  });
  const clockwise_angle2_radians = (a, b) => {
    while (a < 0) { a += Math.PI * 2; }
    while (b < 0) { b += Math.PI * 2; }
    const a_b = a - b;
    return (a_b >= 0)
      ? a_b
      : Math.PI * 2 - (b - a);
  };
  const counter_clockwise_angle2_radians = (a, b) => {
    while (a < 0) { a += Math.PI * 2; }
    while (b < 0) { b += Math.PI * 2; }
    const b_a = b - a;
    return (b_a >= 0)
      ? b_a
      : Math.PI * 2 - (a - b);
  };
  const clockwise_angle2 = (a, b) => {
    const dotProduct = b[0] * a[0] + b[1] * a[1];
    const determinant = b[0] * a[1] - b[1] * a[0];
    let angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) { angle += Math.PI * 2; }
    return angle;
  };
  const counter_clockwise_angle2 = (a, b) => {
    const dotProduct = a[0] * b[0] + a[1] * b[1];
    const determinant = a[0] * b[1] - a[1] * b[0];
    let angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) { angle += Math.PI * 2; }
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
  const interior_angles2 = (a, b) => {
    const interior1 = counter_clockwise_angle2(a, b);
    const interior2 = Math.PI * 2 - interior1;
    return [interior1, interior2];
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
    const angle = counter_clockwise_angle2(angleA, angleB) / divisions;
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
  const make_regular_polygon = (sides, x = 0, y = 0, radius = 1) => {
    const halfwedge = (2 * Math.PI) / sides / 2;
    const r = radius / Math.cos(halfwedge);
    return Array.from(Array(Math.floor(sides))).map((_, i) => {
      const a = -(2 * Math.PI * i) / sides + halfwedge;
      const px = clean_number(x + r * Math.sin(a), 14);
      const py = clean_number(y + r * Math.cos(a), 14);
      return [px, py];
    });
  };
  const line_segment_exclusive = function (lineVector, linePoint, segmentA, segmentB) {
    const pt = segmentA;
    const vec = [segmentB[0] - segmentA[0], segmentB[1] - segmentA[1]];
    return intersect(linePoint, lineVector, pt, vec);
  };
  const split_polygon = (poly, lineVector, linePoint) => {
    const vertices_intersections = poly.map((v, i) => {
      const intersection = point_on_line(linePoint, lineVector, v);
      return { type: "v", point: intersection ? v : null, at_index: i };
    }).filter(el => el.point != null);
    const edges_intersections = poly.map((v, i, arr) => {
      const intersection = line_segment_exclusive(
        lineVector,
        linePoint,
        v,
        arr[(i + 1) % arr.length]
      );
      return { type: "e", point: intersection, at_index: i };
    }).filter(el => el.point != null);
    const sorted = vertices_intersections
      .concat(edges_intersections)
      .sort((a, b) => (Math.abs(a.point[0] - b.point[0]) < EPSILON
        ? a.point[1] - b.point[1]
        : a.point[0] - b.point[0]));
    console.log(sorted);
    return poly;
  };
  const split_convex_polygon = (poly, lineVector, linePoint) => {
    let vertices_intersections = poly.map((v, i) => {
      let intersection = point_on_line(linePoint, lineVector, v);
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
    return undefined;
  };
  var geometry = Object.freeze({
    __proto__: null,
    clockwise_angle2_radians: clockwise_angle2_radians,
    counter_clockwise_angle2_radians: counter_clockwise_angle2_radians,
    clockwise_angle2: clockwise_angle2,
    counter_clockwise_angle2: counter_clockwise_angle2,
    counter_clockwise_vector_order: counter_clockwise_vector_order,
    interior_angles2: interior_angles2,
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
  const lerp$1 = (a, b, t) => a * (1 - t) + b * t;
  const cosine = (a, b, t) => {
    const t2 = (1 - Math.cos(t * Math.PI)) / 2;
    return a * (1 - t2) + b * t2;
  };
  const cubic = (a, b, c, d, t) => {
    const t2 = t * t;
    const e0 = d - c - a + b;
    const e1 = a - b - e0;
    const e2 = c - a;
    const e3 = b;
    return e0 * t * t2 + e1 * t2 + e2 * t + e3;
  };
  const catmull_rom = (a, b, c, d, t) => {
    const t2 = t * t;
    const e0 = -0.5 * a + 1.5 * b - 1.5 * c + 0.5 * d;
    const e1 = a - 2.5 * b + 2 * c - 0.5 * d;
    const e2 = -0.5 * a + 0.5 * c;
    const e3 = b;
    return e0 * t * t2 + e1 * t2 + e2 * t + e3;
  };
  const hermite = (a, b, c, d, t, tension = 0, bias = 0) => {
    const t2 = t * t;
    const t3 = t2 * t;
    let m0 = (b - a) * (1 + bias) * (1 - tension) / 2;
    m0 += (c - b) * (1 - bias) * (1 - tension) / 2;
    let m1 = (c - b) * (1 + bias) * (1 - tension) / 2;
    m1 += (d - c) * (1 - bias) * (1 - tension) / 2;
    const e0 = 2 * t3 - 3 * t2 + 1;
    const e1 = t3 - 2 * t2 + t;
    const e2 = t3 - t2;
    const e3 = -2 * t3 + 3 * t2;
    return e0 * b + e1 * m0 + e2 * m1 + e3 * c;
  };
  var interpolation = Object.freeze({
    __proto__: null,
    lerp: lerp$1,
    cosine: cosine,
    cubic: cubic,
    catmull_rom: catmull_rom,
    hermite: hermite
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
  const seg_limiter = (dist) => {
    if (dist < -EPSILON) { return 0; }
    if (dist > 1 + EPSILON) { return 1; }
    return dist;
  };
  const nearest_point_on_polygon = (polygon, point) => {
    const v = polygon
      .map((p, i, arr) => subtract(arr[(i + 1) % arr.length], p));
    return polygon
      .map((p, i) => nearest_point_on_line(v[i], p, point, seg_limiter))
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
    nearest_point_on_polygon: nearest_point_on_polygon,
    nearest_point_on_circle: nearest_point_on_circle,
    nearest_point_on_ellipse: nearest_point_on_ellipse
  });
  const alternating_sum = (...angles) => [0, 1]
    .map(even_odd => angles
      .filter((_, i) => i % 2 === even_odd)
      .reduce((a, b) => a + b, 0));
  const kawasaki_sector_score = (...angles) => alternating_sum(...angles)
    .map(a => (a < 0 ? a + Math.PI * 2 : a))
    .map(s => Math.PI - s);
  const kawasaki_solutions_radians = (...radians) => radians
    .map((v, i, ar) => counter_clockwise_angle2_radians(
      v, ar[(i + 1) % ar.length]
    ))
    .map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
    .map(opposite_sectors => kawasaki_sector_score(...opposite_sectors))
    .map((kawasakis, i) => radians[i] + kawasakis[0])
    .map((angle, i) => (is_counter_clockwise_between(angle,
      radians[i], radians[(i + 1) % radians.length])
      ? angle
      : undefined));
  const kawasaki_solutions = (...vectors) => {
    const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
    return kawasaki_solutions_radians(...vectors_radians)
      .map(a => (a === undefined
        ? undefined
        : [clean_number(Math.cos(a), 14), clean_number(Math.sin(a), 14)]));
  };
  var origami = Object.freeze({
    __proto__: null,
    alternating_sum: alternating_sum,
    kawasaki_sector_score: kawasaki_sector_score,
    kawasaki_solutions_radians: kawasaki_solutions_radians,
    kawasaki_solutions: kawasaki_solutions
  });
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
  var IntersectionCircle = Object.freeze({
    __proto__: null,
    circle_circle: circle_circle,
    circle_line: circle_line,
    circle_ray: circle_ray,
    circle_segment: circle_segment
  });
  const determ2 = (a, b) => a[0] * b[1] - b[0] * a[1];
  const intersect_line_seg = (origin, vector, pt0, pt1) => {
    const a = { origin, vector };
    const b = { origin: pt0, vector: [[pt1[0] - pt0[0]], [pt1[1] - pt0[1]]] };
    return intersect(a, b, comp_l_s);
  };
  const quick_equivalent_2 = function (a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
  };
  const convex_poly_circle = function (poly, center, radius) {
    return [];
  };
  const convex_poly_line = function (poly, lineVector, linePoint) {
    const intersections = poly
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(el => intersect_line_seg(linePoint, lineVector, el[0], el[1]))
      .filter(el => el != null);
    switch (intersections.length) {
      case 0: return undefined;
      case 1: return [intersections[0], intersections[0]];
      case 2: return intersections;
      default:
        for (let i = 1; i < intersections.length; i += 1) {
          if (!quick_equivalent_2(intersections[0], intersections[i])) {
            return [intersections[0], intersections[i]];
          }
        }
        return undefined;
    }
  };
  const convex_poly_ray = function (poly, lineVector, linePoint) {
    const intersections = poly
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(el => ray_segment(linePoint, lineVector, el[0], el[1]))
      .filter(el => el != null);
    switch (intersections.length) {
      case 0: return undefined;
      case 1: return [linePoint, intersections[0]];
      case 2: return intersections;
      default:
        for (let i = 1; i < intersections.length; i += 1) {
          if (!quick_equivalent_2(intersections[0], intersections[i])) {
            return [intersections[0], intersections[i]];
          }
        }
        return undefined;
    }
  };
  const convex_poly_segment = function (poly, segmentA, segmentB) {
    const intersections = poly
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(el => segment_segment_exclusive(segmentA, segmentB, el[0], el[1]))
      .filter(el => el != null);
    const aInsideExclusive = point_in_convex_poly_exclusive(segmentA, poly);
    const bInsideExclusive = point_in_convex_poly_exclusive(segmentB, poly);
    const aInsideInclusive = point_in_convex_poly(segmentA, poly);
    const bInsideInclusive = point_in_convex_poly(segmentB, poly);
    if (intersections.length === 0
      && (aInsideExclusive || bInsideExclusive)) {
      return [segmentA, segmentB];
    }
    if (intersections.length === 0
      && (aInsideInclusive && bInsideInclusive)) {
      return [segmentA, segmentB];
    }
    switch (intersections.length) {
      case 0: return (aInsideExclusive
        ? [[...segmentA], [...segmentB]]
        : undefined);
      case 1: return (aInsideInclusive
        ? [[...segmentA], intersections[0]]
        : [[...segmentB], intersections[0]]);
      case 2: return intersections;
      default: throw new Error("clipping segment in a convex polygon resulting in 3 or more points");
    }
  };
  const convex_poly_ray_exclusive = function (poly, lineVector, linePoint) {
    const intersections = poly
      .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
      .map(el => ray_segment_exclusive(linePoint, lineVector, el[0], el[1]))
      .filter(el => el != null);
    switch (intersections.length) {
      case 0: return undefined;
      case 1: return [linePoint, intersections[0]];
      case 2: return intersections;
      default:
        for (let i = 1; i < intersections.length; i += 1) {
          if (!quick_equivalent_2(intersections[0], intersections[i])) {
            return [intersections[0], intersections[i]];
          }
        }
        return undefined;
    }
  };
  var IntersectionPolygon = Object.freeze({
    __proto__: null,
    determ2: determ2,
    convex_poly_circle: convex_poly_circle,
    convex_poly_line: convex_poly_line,
    convex_poly_ray: convex_poly_ray,
    convex_poly_segment: convex_poly_segment,
    convex_poly_ray_exclusive: convex_poly_ray_exclusive
  });
  const intersect_func = {
    circle: {
      circle: circle_circle,
      line: circle_line,
      ray: circle_ray,
      segment: circle_segment,
    },
    line: {
      poly: (a, b) => convex_poly_line(b, a),
      circle: (a, b) => circle_line(b, a),
      line: (a, b) => intersect(a, b, comp_l_l),
      ray: (a, b, c) => intersect(a, b, c === false ? exclude_l_r : comp_l_r),
      segment: (a, b, c) => intersect(a, b, c === false ? exclude_l_s : comp_l_s),
    },
    ray: {
      poly: (a, b) => convex_poly_ray(b, a),
      circle: (a, b) => circle_ray(b, a),
      line: (a, b, c) => intersect(b, a, c === false ? exclude_l_r : comp_l_r),
      ray: (a, b, c) => intersect(a, b, c === false ? exclude_r_r : comp_r_r),
      segment: (a, b, c) => intersect(a, b, c === false ? exclude_r_s : comp_r_s),
    },
    segment: {
      poly: (a, b) => convex_poly_segment(b, a),
      circle: (a, b) => circle_segment(b, a),
      line: (a, b, c) => intersect(b, a, c === false ? exclude_l_s : comp_l_s),
      ray: (a, b, c) => intersect(b, a, c === false ? exclude_r_s : comp_r_s),
      segment: (a, b, c) => intersect(a, b, c === false ? exclude_s_s : comp_s_s),
    },
  };
  const intersect$1 = function (a, b, c) {
    const aT = Typeof(a);
    const bT = Typeof(b);
    return intersect_func[aT][bT](a, b, c);
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
        return parallel(...resizeUp(this, get_vector(arguments)));
      },
      dot: function () {
        return dot(...resizeUp(this, get_vector(arguments)));
      },
      distanceTo: function () {
        return distance(...resizeUp(this, get_vector(arguments)));
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
        return cross3(resize(3, this), resize(3, get_vector(arguments)));
      },
      transform: function () {
        return multiply_matrix3_vector3(get_matrix_3x4(arguments), resize(3, this));
      },
      add: function () {
        return add(this, resize(this.length, get_vector(arguments)));
      },
      subtract: function () {
        return subtract(this, resize(this.length, get_vector(arguments)));
      },
      rotateZ: function (angle, origin) {
        return multiply_matrix3_vector3(get_matrix_3x4(make_matrix2_rotate(angle, origin)), this);
      },
      lerp: function (vector, pct) {
        return lerp(this, resize(this.length, get_vector(vector)), pct);
      },
      midpoint: function () {
        return midpoint(...resizeUp(this, get_vector(arguments)));
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
  const LineProto = function () {};
  LineProto.prototype.isParallel = function () {
    const arr = resizeUp(this.vector, get_line(...arguments).vector);
    console.log(arguments, this.vector, get_line(...arguments).vector, arr);
    return parallel(...arr);
  };
  LineProto.prototype.isDegenerate = function (epsilon = EPSILON) {
    return degenerate(this.vector);
  };
  LineProto.prototype.reflection = function () {
    return Constructors.matrix(make_matrix2_reflection(this.vector, this.origin));
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
    return intersect$1(this, other);
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
        path: function (length = 1000) {
          const start = this.origin.add(this.vector.scale(-length));
          const end = this.vector.scale(length * 2);
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
          return Constructors.ray(this.origin[0], this.origin[1], -this.vector[0], -this.vector[1]);
        },
        clip_function: dist => (dist < -EPSILON ? 0 : dist),
        path: function (length = 1000) {
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
        this.points = get_segment(...arguments)
          .map(p => Constructors.vector(p));
        this.vector = this.points[1].subtract(this.points[0]);
        this.origin = this.points[0];
      },
      G: {
        0: function () { return this.points[0]; },
        1: function () { return this.points[1]; },
        length: function () { return this.vector.magnitude(); }
      },
      M: {
        clip_function: (dist) => {
          if (dist < -EPSILON) { return 0; }
          if (dist > 1 + EPSILON) { return 1; }
          return dist;
        },
        transform: function (...innerArgs) {
          const dim = this.dimension;
          const mat = get_matrix_3x4(innerArgs);
          const transformed_points = this.points
            .map(point => resize(3, point))
            .map(point => multiply_matrix3_vector3(mat, point))
            .map(point => resize(dim, point));
          return Constructors.segment(transformed_points);
        },
        scale: function (magnitude) {
          const mid = average(this.points[0], this.points[1]);
          const transformed_points = this.points
            .map(p => p.lerp(mid, magnitude));
          return Constructors.segment(transformed_points);
        },
        midpoint: function () {
          return Constructors.vector(average(this.points[0], this.points[1]));
        },
        path: function () {
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
      this.radius = distance2(...vectors);
      this.origin = Constructors.vector(...vectors[0]);
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
      return intersect$1(this, object);
    },
    path: function (arcStart = 0, deltaArc = Math.PI * 2) {
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
      return this.constructor(...result.origin, result.radius);
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
        nearestPoint: function () {
          return Constructors.vector(nearest_point_on_ellipse(
            this.origin,
            this.radius,
            get_vector(arguments)
          ));
        },
        intersect: function (object) {
          return intersect$1(this, object);
        },
        path: function (arcStart = 0, deltaArc = Math.PI * 2) {
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
      return signed_area(this.points);
    },
    centroid: function () {
      return Constructors.vector(centroid(this.points));
    },
    enclosingRectangle: function () {
      return Constructors.rect(enclosing_rectangle(this.points));
    },
    contains: function () {
      return point_in_poly(get_vector(arguments), this.points);
    },
    scale: function (magnitude, center = centroid(this.points)) {
      const newPoints = this.points
        .map(p => [0, 1].map((_, i) => p[i] - center[i]))
        .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
      return this.constructor.fromPoints(newPoints);
    },
    rotate: function (angle, centerPoint = centroid(this.points)) {
      const newPoints = this.points.map((p) => {
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
      const vec = get_vector(arguments);
      const newPoints = this.points.map(p => p.map((n, i) => n + vec[i]));
      return this.constructor.fromPoints(newPoints);
    },
    transform: function () {
      const m = get_matrix_3x4(arguments);
      const newPoints = this.points
        .map(p => multiply_matrix3_vector3(m, resize(3, p)));
      return Constructors.polygon(newPoints);
    },
    sectors: function () {
      return this.points.map((p, i, arr) => {
        const prev = (i + arr.length - 1) % arr.length;
        const next = (i + 1) % arr.length;
        const center = p;
        const a = arr[prev].map((n, j) => n - center[j]);
        const b = arr[next].map((n, j) => n - center[j]);
        return Constructors.sector(b, a, center);
      });
    },
    nearest: function () {
      const point = get_vector(arguments);
      const points = this.sides.map(edge => edge.nearestPoint(point));
      let lowD = Infinity;
      let lowI;
      points.map(p => distance2(point, p))
        .forEach((d, i) => { if (d < lowD) { lowD = d; lowI = i; } });
      return {
        point: points[lowI],
        edge: this.sides[lowI],
      };
    },
    overlaps: function () {
      const poly2Points = semi_flatten_arrays(arguments);
      return convex_polygons_overlap(this.points, poly2Points);
    },
    split: function () {
      const line = get_line(arguments);
      const split_func = this.convex ? split_convex_polygon : split_polygon;
      return split_func(this.points, line.vector, line.origin)
        .map(poly => Constructors.polygon(poly));
    },
    clipSegment: function () {
      const edge = get_segment(arguments);
      const e = convex_poly_segment(this.points, edge[0], edge[1]);
      return e === undefined ? undefined : Constructors.segment(e);
    },
    clipLine: function () {
      const line = get_line(arguments);
      const e = convex_poly_line(this.points, line.vector, line.origin);
      return e === undefined ? undefined : Constructors.segment(e);
    },
    clipRay: function () {
      const line = get_line(arguments);
      const e = convex_poly_ray(this.points, line.vector, line.origin);
      return e === undefined ? undefined : Constructors.segment(e);
    },
    path: function () {
      const pre = Array(this.points.length).fill("L");
      pre[0] = "M";
      return `${this.points.map((p, i) => `${pre[i]}${p[0]} ${p[1]}`).join("")}z`;
    },
  };
  const PolygonProto = function () {
    this.points = [];
  };
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
        this.points = rectToPoints(this);
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
        this.points = semi_flatten_arrays(arguments)
          .map(v => Constructors.vector(v));
        this.sides = this.points
          .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
          .map(ps => Constructors.segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
      },
      G: {
        isConvex: function () {
          return true;
        },
        edges: function () {
          return this.sides;
        },
      },
      M: {
        segments: function () {
          return this.sides;
        }
      },
      S: {
        fromPoints: function () {
          return this.constructor(...arguments);
        },
        regularPolygon: function (sides, x = 0, y = 0, radius = 1) {
          return this.constructor(make_regular_polygon(sides, x, y, radius));
        },
        convexHull: function (points, includeCollinear = false) {
          return this.constructor(convex_hull(points, includeCollinear));
        },
      }
    }
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
        isIdentity: function () { return is_identity3x4(this); },
        multiply: function () {
          return Constructors.matrix(
            multiply_matrices3(this, get_matrix_3x4(arguments))
              .map(n => clean_number(n, 13))
          );
        },
        determinant: function () {
          return clean_number(determinant3(this), 13);
        },
        inverse: function () {
          return Constructors.matrix(invert_matrix3(this)
            .map(n => clean_number(n, 13)));
        },
        translate: function (x, y, z) {
          return Constructors.matrix(
            multiply_matrices3(this, make_matrix3_translate(x, y, z))
              .map(n => clean_number(n, 13))
          );
        },
        rotateX: function (radians) {
          return Constructors.matrix(
            multiply_matrices3(this, make_matrix3_rotateX(radians))
              .map(n => clean_number(n, 13))
          );
        },
        rotateY: function (radians) {
          return Constructors.matrix(
            multiply_matrices3(this, make_matrix3_rotateY(radians))
              .map(n => clean_number(n, 13))
          );
        },
        rotateZ: function (radians) {
          return Constructors.matrix(
            multiply_matrices3(this, make_matrix3_rotateZ(radians))
              .map(n => clean_number(n, 13))
          );
        },
        rotate: function (radians, vector, origin) {
          const transform = make_matrix3_rotate(radians, vector, origin);
          return Constructors.matrix(multiply_matrices3(this, transform)
            .map(n => clean_number(n, 13)));
        },
        scale: function (amount) {
          return Constructors.matrix(
            multiply_matrices3(this, make_matrix3_scale(amount))
              .map(n => clean_number(n, 13))
          );
        },
        reflectZ: function (vector, origin) {
          const transform = make_matrix3_reflectionZ(vector, origin);
          return Constructors.matrix(multiply_matrices3(this, transform)
            .map(n => clean_number(n, 13)));
        },
        transform: function (...innerArgs) {
          return Constructors.vector(
            multiply_matrix3_vector3(get_vector(innerArgs), this)
              .map(n => clean_number(n, 13))
          );
        },
        transformVector: function (vector) {
          return Constructors.matrix(multiply_matrix3_vector3(this, vector)
            .map(n => clean_number(n, 13)));
        },
        transformLine: function (origin, vector) {
          return Constructors.matrix(multiply_matrix3_line3(this, origin, vector)
            .map(n => clean_number(n, 13)));
        },
      },
      S: {
      }
    }
  };
  var Plane = {
    plane: {
      A: function () {
        const args = get_vector_of_vectors(...arguments);
        this.normal = Constructors.vector((args.length > 0 ? args[0] : null));
        this.origin = Constructors.vector((args.length > 1 ? args[1] : null));
      },
      G: {
        point: function () { return this.origin; },
      },
      M: {
        flip: function () {
          this.normal = this.normal.flip();
        },
        intersect: function (object) {
          return intersect$1(this, object);
        },
      },
      S: {
        fromPoints: function () {
        },
        fromLine: function () {
          const line = get_line(arguments);
          return this.constructor(line.vector, line.origin);
        },
        fromRay: function () {
          const line = get_line(arguments);
          return this.constructor(line.vector, line.origin);
        },
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
    Plane,
  );
  const create = function (primitiveName, args) {
    const a = Object.create(Definitions[primitiveName].proto);
    Definitions[primitiveName].A.apply(a, args);
    return Object.freeze(a);
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
  const plane = function () { return create("plane", arguments); };
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
    plane,
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
    Object.freeze(Proto.prototype);
    Definitions[primitiveName].proto = Proto.prototype;
  });
  const math = Constructors;
  math.core = Object.assign({},
    algebra,
    equal,
    geometry,
    interpolation,
    matrix2,
    matrix3,
    nearest,
    query,
    Arguments,
    origami,
  );
  math.intersect = intersect$1;
  math.intersect.circle = IntersectionCircle;
  math.intersect.lines = IntersectionLines;
  math.intersect.polygon = IntersectionPolygon;

  const file_spec = 1.1;
  const file_creator = "Rabbit Ear";
  const future_spec = {
    FACES_MATRIX: "faces_re:matrix",
    FACES_LAYER: "faces_re:layer",
    SECTORS_VERTICES: "re:sectors_vertices",
    SECTORS_EDGES: "re:sectors_edges",
    SECTORS_ANGLES: "re:sectors_angles",
    VERTICES_SECTORS_VERTICES: "vertices_re:sectors_vertices",
  };
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
  const keys = Object.freeze([]
    .concat(fold_keys.file)
    .concat(fold_keys.frame)
    .concat(fold_keys.graph)
    .concat(fold_keys.orders));
  const edges_assignment_values = [
    "B", "b", "M", "m", "V", "v", "F", "f", "U", "u"
  ];
  const edges_assignment_names = {
    B: "boundary",
    b: "boundary",
    M: "mountain",
    m: "mountain",
    V: "valley",
    v: "valley",
    F: "mark",
    f: "mark",
    U: "unassigned",
    u: "unassigned"
  };
  const assignment_angles = {
    M: -180,
    m: -180,
    V: 180,
    v: 180
  };
  const FOLDED_FORM = "foldedForm";
  const CREASE_PATTERN = "creasePattern";
  const edge_assignment_to_foldAngle = function (assignment) {
    return assignment_angles[assignment] || 0;
  };
  const get_graph_keys_with_prefix = function (graph, key) {
    const prefix = `${key}_`;
    return Object.keys(graph)
      .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
      .filter(str => str !== undefined);
  };
  const get_graph_keys_with_suffix = function (graph, key) {
    const suffix = `_${key}`;
    return Object.keys(graph)
      .map(s => (s.substring(s.length - suffix.length, s.length) === suffix
        ? s : undefined))
      .filter(str => str !== undefined);
  };
  const get_keys_with_ending = function (graph, string) {
    return Object.keys(graph)
      .map(s => (s.substring(s.length - string.length, s.length) === string
        ? s : undefined))
      .filter(str => str !== undefined);
  };
  const transpose_graph_arrays = function (graph, geometry_key) {
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
    if (matching_keys.length === 0) { return []; }
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
    future_spec: future_spec,
    fold_keys: fold_keys,
    file_classes: file_classes,
    frame_classes: frame_classes,
    frame_attributes: frame_attributes,
    keys: keys,
    edges_assignment_values: edges_assignment_values,
    edges_assignment_names: edges_assignment_names,
    FOLDED_FORM: FOLDED_FORM,
    CREASE_PATTERN: CREASE_PATTERN,
    edge_assignment_to_foldAngle: edge_assignment_to_foldAngle,
    get_graph_keys_with_prefix: get_graph_keys_with_prefix,
    get_graph_keys_with_suffix: get_graph_keys_with_suffix,
    get_keys_with_ending: get_keys_with_ending,
    transpose_graph_arrays: transpose_graph_arrays,
    transpose_graph_array_at_index: transpose_graph_array_at_index
  });

  const max_array_length = function (...arrays) {
    return Math.max(...(arrays
      .filter(el => el !== undefined)
      .map(el => el.length)));
  };
  const vertices_count = function ({
    vertices_coords, vertices_faces, vertices_vertices
  }) {
    return max_array_length([], vertices_coords,
      vertices_faces, vertices_vertices);
  };
  const edges_count = function ({
    edges_vertices, edges_faces
  }) {
    return max_array_length([], edges_vertices, edges_faces);
  };
  const faces_count = function ({
    faces_vertices, faces_edges
  }) {
    return max_array_length([], faces_vertices, faces_edges);
  };
  const get_geometry_length = {
    vertices: vertices_count,
    edges: edges_count,
    faces: faces_count
  };
  const remove_geometry_key_indices = function (graph, key, removeIndices) {
    const geometry_array_size = get_geometry_length[key](graph);
    const removes = Array(geometry_array_size).fill(false);
    removeIndices.forEach((v) => { removes[v] = true; });
    let s = 0;
    const index_map = removes.map(remove => (remove ? --s : s));
    if (removeIndices.length === 0) { return index_map; }
    const prefix = `${key}_`;
    const suffix = `_${key}`;
    const graph_keys = Object.keys(graph);
    const prefixKeys = graph_keys
      .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
      .filter(str => str !== undefined);
    const suffixKeys = graph_keys
      .map(str => (str.substring(str.length - suffix.length, str.length) === suffix
        ? str
        : undefined))
      .filter(str => str !== undefined);
    suffixKeys
      .forEach(sKey => graph[sKey]
        .forEach((_, i) => graph[sKey][i]
          .forEach((v, j) => { graph[sKey][i][j] += index_map[v]; })));
    prefixKeys.forEach((pKey) => {
      graph[pKey] = graph[pKey]
        .filter((_, i) => !removes[i]);
    });
    return index_map;
  };

  const are_vertices_equivalent = function (a, b, epsilon = math.core.EPSILON) {
    const max = a.length < 2 ? a.length : 2;
    for (let i = 0; i < max; i += 1) {
      if (Math.abs(a[i] - b[i]) > epsilon) {
        return false;
      }
    }
    return true;
  };
  const point_on_edge_exclusive = function (point, edge0, edge1, epsilon = math.core.EPSILON) {
    const edge0_1 = [edge0[0] - edge1[0], edge0[1] - edge1[1]];
    const edge0_p = [edge0[0] - point[0], edge0[1] - point[1]];
    const edge1_p = [edge1[0] - point[0], edge1[1] - point[1]];
    const dEdge = Math.sqrt(edge0_1[0] * edge0_1[0] + edge0_1[1] * edge0_1[1]);
    const dP0 = Math.sqrt(edge0_p[0] * edge0_p[0] + edge0_p[1] * edge0_p[1]);
    const dP1 = Math.sqrt(edge1_p[0] * edge1_p[0] + edge1_p[1] * edge1_p[1]);
    return Math.abs(dEdge - dP0 - dP1) < epsilon;
  };
  const edges_vertices_equivalent = function (a, b) {
    return (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0]);
  };
  const make_edges_collinearVertices = function ({
    vertices_coords, edges_vertices
  }, epsilon = math.core.EPSILON) {
    const edges = edges_vertices
      .map(ev => ev.map(v => vertices_coords[v]));
    return edges.map(e => vertices_coords
      .filter(v => point_on_edge_exclusive(v, e[0], e[1], epsilon)));
  };
  const make_edges_alignment = function ({ vertices_coords, edges_vertices }) {
    const edges = edges_vertices
      .map(ev => ev.map(v => vertices_coords[v]));
    const edges_vector = edges.map(e => [e[1][0] - e[0][0], e[1][1] - e[0][1]]);
    const edges_magnitude = edges_vector
      .map(e => Math.sqrt(e[0] * e[0] + e[1] * e[1]));
    const edges_normalized = edges_vector
      .map((e, i) => [e[0] / edges_magnitude[i], e[1] / edges_magnitude[i]]);
    return edges_normalized.map(e => Math.abs(e[0]) > 0.707);
  };
  const make_edges_intersections = function ({
    vertices_coords, edges_vertices
  }, epsilon = math.core.EPSILON) {
    const edge_count = edges_vertices.length;
    const edges = edges_vertices
      .map(ev => ev.map(v => vertices_coords[v]));
    const crossings = Array.from(Array(edge_count - 1)).map(() => []);
    const edgeObjects = edges.map(e => ({
      origin: e[0],
      vector: [e[1][0] - e[0][0], e[1][1] - e[0][1]]
    }));
    const intersectFunc = math.intersect.lines.exclude_s_s;
    for (let i = 0; i < edges.length - 1; i += 1) {
      for (let j = i + 1; j < edges.length; j += 1) {
        crossings[i][j] = math.intersect.lines
          .intersect(edgeObjects[i], edgeObjects[j], intersectFunc);
      }
    }
    const edges_intersections = Array.from(Array(edge_count)).map(() => []);
    for (let i = 0; i < edges.length - 1; i += 1) {
      for (let j = i + 1; j < edges.length; j += 1) {
        if (crossings[i][j] != null) {
          edges_intersections[i].push(crossings[i][j]);
          edges_intersections[j].push(crossings[i][j]);
        }
      }
    }
    return edges_intersections;
  };
  const fragment = function (graph, epsilon = math.core.EPSILON) {
    const horizSort = function (a, b) { return a[0] - b[0]; };
    const vertSort = function (a, b) { return a[1] - b[1]; };
    const edges_alignment = make_edges_alignment(graph);
    const edges = graph.edges_vertices
      .map(ev => ev.map(v => graph.vertices_coords[v]));
    edges.forEach((e, i) => e.sort(edges_alignment[i] ? horizSort : vertSort));
    const edges_intersections = make_edges_intersections(graph, epsilon);
    const edges_collinearVertices = make_edges_collinearVertices(graph, epsilon);
    const new_edges_vertices = edges_intersections
      .map((a, i) => a.concat(edges_collinearVertices[i]));
    new_edges_vertices.forEach((e, i) => e
      .sort(edges_alignment[i] ? horizSort : vertSort));
    const new_edges_vertices_cleaned = new_edges_vertices
      .map(ev => ev
        .filter((e, i, arr) => !are_vertices_equivalent(e, arr[(i + 1) % arr.length])))
      .filter(edge => edge.length);
    let new_edges = new_edges_vertices_cleaned
      .map(ev => Array.from(Array(ev.length - 1))
        .map((_, i) => [ev[i], ev[(i + 1)]]));
    const TEST_A = new_edges.length;
    new_edges = new_edges
      .map(edgeGroup => edgeGroup
        .filter(e => false === e
          .map((_, i) => Math.abs(e[0][i] - e[1][i]) < epsilon)
          .reduce((a, b) => a && b, true)));
    const TEST_B = new_edges.length;
    if (TEST_A !== TEST_B) { console.log("fragment() remove degenerate edges is needed!"); }
    const edge_map = new_edges
      .map((edge, i) => edge.map(() => i))
      .reduce((a, b) => a.concat(b), []);
    const vertices_coords = new_edges
      .map(edge => edge.reduce((a, b) => a.concat(b), []))
      .reduce((a, b) => a.concat(b), []);
    let counter = 0;
    const edges_vertices = new_edges
      .map(edge => edge.map(() => [counter++, counter++]))
      .reduce((a, b) => a.concat(b), []);
    const vertices_equivalent = Array
      .from(Array(vertices_coords.length)).map(() => []);
    for (let i = 0; i < vertices_coords.length - 1; i += 1) {
      for (let j = i + 1; j < vertices_coords.length; j += 1) {
        vertices_equivalent[i][j] = are_vertices_equivalent(
          vertices_coords[i],
          vertices_coords[j],
          epsilon
        );
      }
    }
    const vertices_map = vertices_coords.map(() => undefined);
    vertices_equivalent
      .forEach((row, i) => row
        .forEach((eq, j) => {
          if (eq) {
            vertices_map[j] = vertices_map[i] === undefined
              ? i
              : vertices_map[i];
          }
        }));
    const vertices_remove = vertices_map.map(m => m !== undefined);
    vertices_map.forEach((map, i) => {
      if (map === undefined) { vertices_map[i] = i; }
    });
    edges_vertices
      .forEach((edge, i) => edge
        .forEach((v, j) => {
          edges_vertices[i][j] = vertices_map[v];
        }));
    const edges_equivalent = Array
      .from(Array(edges_vertices.length)).map(() => []);
    for (let i = 0; i < edges_vertices.length - 1; i += 1) {
      for (let j = i + 1; j < edges_vertices.length; j += 1) {
        edges_equivalent[i][j] = edges_vertices_equivalent(
          edges_vertices[i],
          edges_vertices[j]
        );
      }
    }
    const edges_map = edges_vertices.map(() => undefined);
    edges_equivalent
      .forEach((row, i) => row
        .forEach((eq, j) => {
          if (eq) {
            edges_map[i] = edges_map[j] === undefined
              ? j
              : edges_map[j];
          }
        }));
    edges_map.forEach((e, i) => {
      if (e !== undefined) {
        if (["B", "b"].includes(graph.edges_assignment[i])) {
          graph.edges_assignment[e] = "B";
        }
      }
    });
    const edges_dont_remove = edges_map.map(m => m === undefined);
    edges_map.forEach((map, i) => {
      if (map === undefined) { edges_map[i] = i; }
    });
    const edges_vertices_cl = edges_vertices.filter((_, i) => edges_dont_remove[i]);
    const edge_map_cl = edge_map.filter((_, i) => edges_dont_remove[i]);
    const flat = {
      vertices_coords,
      edges_vertices: edges_vertices_cl
    };
    if (graph.edges_assignment != null) {
      flat.edges_assignment = edge_map_cl
        .map(i => graph.edges_assignment[i] || "U");
    }
    if (graph.edges_foldAngle != null) {
      flat.edges_foldAngle = edge_map_cl.map((i, j) => (
        graph.edges_foldAngle[i]
        || edge_assignment_to_foldAngle(flat.edges_assignment[j])));
    }
    const vertices_remove_indices = vertices_remove
      .map((rm, i) => (rm ? i : undefined))
      .filter(i => i !== undefined);
    remove_geometry_key_indices(flat, "vertices", vertices_remove_indices);
    fold_keys.graph.forEach(key => delete graph[key]);
    Object.assign(graph, flat);
    delete graph.faces_vertices;
    delete graph.faces_edges;
    delete graph.faces_faces;
    delete graph.edges_faces;
    delete graph.edges_length;
    delete graph.vertices_faces;
    delete graph.vertices_edges;
  };

  var geom = {},
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };
  geom.EPS = 0.000001;
  geom.sum = function(a, b) {
    return a + b;
  };
  geom.min = function(a, b) {
    if (a < b) {
      return a;
    } else {
      return b;
    }
  };
  geom.max = function(a, b) {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };
  geom.all = function(a, b) {
    return a && b;
  };
  geom.next = function(start, n, i) {
    if (i == null) {
      i = 1;
    }
    return modulo(start + i, n);
  };
  geom.rangesDisjoint = function(arg, arg1) {
    var a1, a2, b1, b2, ref, ref1;
    a1 = arg[0], a2 = arg[1];
    b1 = arg1[0], b2 = arg1[1];
    return ((b1 < (ref = Math.min(a1, a2)) && ref > b2)) || ((b1 > (ref1 = Math.max(a1, a2)) && ref1 < b2));
  };
  geom.topologicalSort = function(vs) {
    var k, l, len, len1, list, ref, v;
    for (k = 0, len = vs.length; k < len; k++) {
      v = vs[k];
      ref = [false, null], v.visited = ref[0], v.parent = ref[1];
    }
    list = [];
    for (l = 0, len1 = vs.length; l < len1; l++) {
      v = vs[l];
      if (!v.visited) {
        list = geom.visit(v, list);
      }
    }
    return list;
  };
  geom.visit = function(v, list) {
    var k, len, ref, u;
    v.visited = true;
    ref = v.children;
    for (k = 0, len = ref.length; k < len; k++) {
      u = ref[k];
      if (!(!u.visited)) {
        continue;
      }
      u.parent = v;
      list = geom.visit(u, list);
    }
    return list.concat([v]);
  };
  geom.magsq = function(a) {
    return geom.dot(a, a);
  };
  geom.mag = function(a) {
    return Math.sqrt(geom.magsq(a));
  };
  geom.unit = function(a, eps) {
    var length;
    if (eps == null) {
      eps = geom.EPS;
    }
    length = geom.magsq(a);
    if (length < eps) {
      return null;
    }
    return geom.mul(a, 1 / geom.mag(a));
  };
  geom.ang2D = function(a, eps) {
    if (eps == null) {
      eps = geom.EPS;
    }
    if (geom.magsq(a) < eps) {
      return null;
    }
    return Math.atan2(a[1], a[0]);
  };
  geom.mul = function(a, s) {
    var i, k, len, results;
    results = [];
    for (k = 0, len = a.length; k < len; k++) {
      i = a[k];
      results.push(i * s);
    }
    return results;
  };
  geom.linearInterpolate = function(t, a, b) {
    return geom.plus(geom.mul(a, 1 - t), geom.mul(b, t));
  };
  geom.plus = function(a, b) {
    var ai, i, k, len, results;
    results = [];
    for (i = k = 0, len = a.length; k < len; i = ++k) {
      ai = a[i];
      results.push(ai + b[i]);
    }
    return results;
  };
  geom.sub = function(a, b) {
    return geom.plus(a, geom.mul(b, -1));
  };
  geom.dot = function(a, b) {
    var ai, i;
    return ((function() {
      var k, len, results;
      results = [];
      for (i = k = 0, len = a.length; k < len; i = ++k) {
        ai = a[i];
        results.push(ai * b[i]);
      }
      return results;
    })()).reduce(geom.sum);
  };
  geom.distsq = function(a, b) {
    return geom.magsq(geom.sub(a, b));
  };
  geom.dist = function(a, b) {
    return Math.sqrt(geom.distsq(a, b));
  };
  geom.closestIndex = function(a, bs) {
    var b, dist, i, k, len, minDist, minI;
    minDist = 2e308;
    for (i = k = 0, len = bs.length; k < len; i = ++k) {
      b = bs[i];
      if (minDist > (dist = geom.dist(a, b))) {
        minDist = dist;
        minI = i;
      }
    }
    return minI;
  };
  geom.dir = function(a, b) {
    return geom.unit(geom.sub(b, a));
  };
  geom.ang = function(a, b) {
    var ref, ua, ub, v;
    ref = (function() {
      var k, len, ref, results;
      ref = [a, b];
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        v = ref[k];
        results.push(geom.unit(v));
      }
      return results;
    })(), ua = ref[0], ub = ref[1];
    if (!((ua != null) && (ub != null))) {
      return null;
    }
    return Math.acos(geom.dot(ua, ub));
  };
  geom.cross = function(a, b) {
    var i, j, ref, ref1;
    if ((a.length === (ref = b.length) && ref === 2)) {
      return a[0] * b[1] - a[1] * b[0];
    }
    if ((a.length === (ref1 = b.length) && ref1 === 3)) {
      return (function() {
        var k, len, ref2, ref3, results;
        ref2 = [[1, 2], [2, 0], [0, 1]];
        results = [];
        for (k = 0, len = ref2.length; k < len; k++) {
          ref3 = ref2[k], i = ref3[0], j = ref3[1];
          results.push(a[i] * b[j] - a[j] * b[i]);
        }
        return results;
      })();
    }
    return null;
  };
  geom.parallel = function(a, b, eps) {
    var ref, ua, ub, v;
    if (eps == null) {
      eps = geom.EPS;
    }
    ref = (function() {
      var k, len, ref, results;
      ref = [a, b];
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        v = ref[k];
        results.push(geom.unit(v));
      }
      return results;
    })(), ua = ref[0], ub = ref[1];
    if (!((ua != null) && (ub != null))) {
      return null;
    }
    return 1 - Math.abs(geom.dot(ua, ub)) < eps;
  };
  geom.rotate = function(a, u, t) {
    var ct, i, k, len, p, q, ref, ref1, results, st;
    u = geom.unit(u);
    if (u == null) {
      return null;
    }
    ref = [Math.cos(t), Math.sin(t)], ct = ref[0], st = ref[1];
    ref1 = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
    results = [];
    for (k = 0, len = ref1.length; k < len; k++) {
      p = ref1[k];
      results.push(((function() {
        var l, len1, ref2, results1;
        ref2 = [ct, -st * u[p[2]], st * u[p[1]]];
        results1 = [];
        for (i = l = 0, len1 = ref2.length; l < len1; i = ++l) {
          q = ref2[i];
          results1.push(a[p[i]] * (u[p[0]] * u[p[i]] * (1 - ct) + q));
        }
        return results1;
      })()).reduce(geom.sum));
    }
    return results;
  };
  geom.interiorAngle = function(a, b, c) {
    var ang;
    ang = geom.ang2D(geom.sub(a, b)) - geom.ang2D(geom.sub(c, b));
    return ang + (ang < 0 ? 2 * Math.PI : 0);
  };
  geom.turnAngle = function(a, b, c) {
    return Math.PI - geom.interiorAngle(a, b, c);
  };
  geom.triangleNormal = function(a, b, c) {
    return geom.unit(geom.cross(geom.sub(b, a), geom.sub(c, b)));
  };
  geom.polygonNormal = function(points, eps) {
    var i, p;
    if (eps == null) {
      eps = geom.EPS;
    }
    return geom.unit(((function() {
      var k, len, results;
      results = [];
      for (i = k = 0, len = points.length; k < len; i = ++k) {
        p = points[i];
        results.push(geom.cross(p, points[geom.next(i, points.length)]));
      }
      return results;
    })()).reduce(geom.plus), eps);
  };
  geom.twiceSignedArea = function(points) {
    var i, v0, v1;
    return ((function() {
      var k, len, results;
      results = [];
      for (i = k = 0, len = points.length; k < len; i = ++k) {
        v0 = points[i];
        v1 = points[geom.next(i, points.length)];
        results.push(v0[0] * v1[1] - v1[0] * v0[1]);
      }
      return results;
    })()).reduce(geom.sum);
  };
  geom.polygonOrientation = function(points) {
    return Math.sign(geom.twiceSignedArea(points));
  };
  geom.sortByAngle = function(points, origin, mapping) {
    if (origin == null) {
      origin = [0, 0];
    }
    if (mapping == null) {
      mapping = function(x) {
        return x;
      };
    }
    origin = mapping(origin);
    return points.sort(function(p, q) {
      var pa, qa;
      pa = geom.ang2D(geom.sub(mapping(p), origin));
      qa = geom.ang2D(geom.sub(mapping(q), origin));
      return pa - qa;
    });
  };
  geom.segmentsCross = function(arg, arg1) {
    var p0, p1, q0, q1;
    p0 = arg[0], q0 = arg[1];
    p1 = arg1[0], q1 = arg1[1];
    if (geom.rangesDisjoint([p0[0], q0[0]], [p1[0], q1[0]]) || geom.rangesDisjoint([p0[1], q0[1]], [p1[1], q1[1]])) {
      return false;
    }
    return geom.polygonOrientation([p0, q0, p1]) !== geom.polygonOrientation([p0, q0, q1]) && geom.polygonOrientation([p1, q1, p0]) !== geom.polygonOrientation([p1, q1, q0]);
  };
  geom.parametricLineIntersect = function(arg, arg1) {
    var denom, p1, p2, q1, q2;
    p1 = arg[0], p2 = arg[1];
    q1 = arg1[0], q2 = arg1[1];
    denom = (q2[1] - q1[1]) * (p2[0] - p1[0]) + (q1[0] - q2[0]) * (p2[1] - p1[1]);
    if (denom === 0) {
      return [null, null];
    } else {
      return [(q2[0] * (p1[1] - q1[1]) + q2[1] * (q1[0] - p1[0]) + q1[1] * p1[0] - p1[1] * q1[0]) / denom, (q1[0] * (p2[1] - p1[1]) + q1[1] * (p1[0] - p2[0]) + p1[1] * p2[0] - p2[1] * p1[0]) / denom];
    }
  };
  geom.segmentIntersectSegment = function(s1, s2) {
    var ref, s, t;
    ref = geom.parametricLineIntersect(s1, s2), s = ref[0], t = ref[1];
    if ((s != null) && ((0 <= s && s <= 1)) && ((0 <= t && t <= 1))) {
      return geom.linearInterpolate(s, s1[0], s1[1]);
    } else {
      return null;
    }
  };
  geom.lineIntersectLine = function(l1, l2) {
    var ref, s, t;
    ref = geom.parametricLineIntersect(l1, l2), s = ref[0], t = ref[1];
    if (s != null) {
      return geom.linearInterpolate(s, l1[0], l1[1]);
    } else {
      return null;
    }
  };
  geom.pointStrictlyInSegment = function(p, s, eps) {
    var v0, v1;
    if (eps == null) {
      eps = geom.EPS;
    }
    v0 = geom.sub(p, s[0]);
    v1 = geom.sub(p, s[1]);
    return geom.parallel(v0, v1, eps) && geom.dot(v0, v1) < 0;
  };
  geom.centroid = function(points) {
    return geom.mul(points.reduce(geom.plus), 1.0 / points.length);
  };
  geom.basis = function(ps, eps) {
    var d, ds, n, ns, p, x, y, z;
    if (eps == null) {
      eps = geom.EPS;
    }
    if (((function() {
      var k, len, results;
      results = [];
      for (k = 0, len = ps.length; k < len; k++) {
        p = ps[k];
        results.push(p.length !== 3);
      }
      return results;
    })()).reduce(geom.all)) {
      return null;
    }
    ds = (function() {
      var k, len, results;
      results = [];
      for (k = 0, len = ps.length; k < len; k++) {
        p = ps[k];
        if (geom.distsq(p, ps[0]) > eps) {
          results.push(geom.dir(p, ps[0]));
        }
      }
      return results;
    })();
    if (ds.length === 0) {
      return [];
    }
    x = ds[0];
    if (((function() {
      var k, len, results;
      results = [];
      for (k = 0, len = ds.length; k < len; k++) {
        d = ds[k];
        results.push(geom.parallel(d, x, eps));
      }
      return results;
    })()).reduce(geom.all)) {
      return [x];
    }
    ns = (function() {
      var k, len, results;
      results = [];
      for (k = 0, len = ds.length; k < len; k++) {
        d = ds[k];
        results.push(geom.unit(geom.cross(d, x)));
      }
      return results;
    })();
    ns = (function() {
      var k, len, results;
      results = [];
      for (k = 0, len = ns.length; k < len; k++) {
        n = ns[k];
        if (n != null) {
          results.push(n);
        }
      }
      return results;
    })();
    z = ns[0];
    y = geom.cross(z, x);
    if (((function() {
      var k, len, results;
      results = [];
      for (k = 0, len = ns.length; k < len; k++) {
        n = ns[k];
        results.push(geom.parallel(n, z, eps));
      }
      return results;
    })()).reduce(geom.all)) {
      return [x, y];
    }
    return [x, y, z];
  };
  geom.above = function(ps, qs, n, eps) {
    var pn, qn, ref, v, vs;
    if (eps == null) {
      eps = geom.EPS;
    }
    ref = (function() {
      var k, len, ref, results;
      ref = [ps, qs];
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        vs = ref[k];
        results.push((function() {
          var l, len1, results1;
          results1 = [];
          for (l = 0, len1 = vs.length; l < len1; l++) {
            v = vs[l];
            results1.push(geom.dot(v, n));
          }
          return results1;
        })());
      }
      return results;
    })(), pn = ref[0], qn = ref[1];
    if (qn.reduce(geom.max) - pn.reduce(geom.min) < eps) {
      return 1;
    }
    if (pn.reduce(geom.max) - qn.reduce(geom.min) < eps) {
      return -1;
    }
    return 0;
  };
  geom.separatingDirection2D = function(t1, t2, n, eps) {
    var i, j, k, l, len, len1, len2, m, o, p, q, ref, sign, t;
    if (eps == null) {
      eps = geom.EPS;
    }
    ref = [t1, t2];
    for (k = 0, len = ref.length; k < len; k++) {
      t = ref[k];
      for (i = l = 0, len1 = t.length; l < len1; i = ++l) {
        p = t[i];
        for (j = o = 0, len2 = t.length; o < len2; j = ++o) {
          q = t[j];
          if (!(i < j)) {
            continue;
          }
          m = geom.unit(geom.cross(geom.sub(p, q), n));
          if (m != null) {
            sign = geom.above(t1, t2, m, eps);
            if (sign !== 0) {
              return geom.mul(m, sign);
            }
          }
        }
      }
    }
    return null;
  };
  geom.separatingDirection3D = function(t1, t2, eps) {
    var i, j, k, l, len, len1, len2, len3, m, o, p, q1, q2, r, ref, ref1, sign, x1, x2;
    if (eps == null) {
      eps = geom.EPS;
    }
    ref = [[t1, t2], [t2, t1]];
    for (k = 0, len = ref.length; k < len; k++) {
      ref1 = ref[k], x1 = ref1[0], x2 = ref1[1];
      for (l = 0, len1 = x1.length; l < len1; l++) {
        p = x1[l];
        for (i = o = 0, len2 = x2.length; o < len2; i = ++o) {
          q1 = x2[i];
          for (j = r = 0, len3 = x2.length; r < len3; j = ++r) {
            q2 = x2[j];
            if (!(i < j)) {
              continue;
            }
            m = geom.unit(geom.cross(geom.sub(p, q1), geom.sub(p, q2)));
            if (m != null) {
              sign = geom.above(t1, t2, m, eps);
              if (sign !== 0) {
                return geom.mul(m, sign);
              }
            }
          }
        }
      }
    }
    return null;
  };
  geom.circleCross = function(d, r1, r2) {
    var x, y;
    x = (d * d - r2 * r2 + r1 * r1) / d / 2;
    y = Math.sqrt(r1 * r1 - x * x);
    return [x, y];
  };
  geom.creaseDir = function(u1, u2, a, b, eps) {
    var b1, b2, x, y, z, zmag;
    if (eps == null) {
      eps = geom.EPS;
    }
    b1 = Math.cos(a) + Math.cos(b);
    b2 = Math.cos(a) - Math.cos(b);
    x = geom.plus(u1, u2);
    y = geom.sub(u1, u2);
    z = geom.unit(geom.cross(y, x));
    x = geom.mul(x, b1 / geom.magsq(x));
    y = geom.mul(y, geom.magsq(y) < eps ? 0 : b2 / geom.magsq(y));
    zmag = Math.sqrt(1 - geom.magsq(x) - geom.magsq(y));
    z = geom.mul(z, zmag);
    return [x, y, z].reduce(geom.plus);
  };
  geom.quadSplit = function(u, p, d, t) {
    if (geom.magsq(p) > d * d) {
      throw new Error("STOP! Trying to split expansive quad.");
    }
    return geom.mul(u, (d * d - geom.magsq(p)) / 2 / (d * Math.cos(t) - geom.dot(u, p)));
  };

  var filter = {};
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
  filter.edgesAssigned = function(fold, target) {
    var assignment, i, k, len, ref, results;
    ref = fold.edges_assignment;
    results = [];
    for (i = k = 0, len = ref.length; k < len; i = ++k) {
      assignment = ref[i];
      if (assignment === target) {
        results.push(i);
      }
    }
    return results;
  };
  filter.mountainEdges = function(fold) {
    return filter.edgesAssigned(fold, 'M');
  };
  filter.valleyEdges = function(fold) {
    return filter.edgesAssigned(fold, 'V');
  };
  filter.flatEdges = function(fold) {
    return filter.edgesAssigned(fold, 'F');
  };
  filter.boundaryEdges = function(fold) {
    return filter.edgesAssigned(fold, 'B');
  };
  filter.unassignedEdges = function(fold) {
    return filter.edgesAssigned(fold, 'U');
  };
  filter.keysStartingWith = function(fold, prefix) {
    var key, results;
    results = [];
    for (key in fold) {
      if (key.slice(0, prefix.length) === prefix) {
        results.push(key);
      }
    }
    return results;
  };
  filter.keysEndingWith = function(fold, suffix) {
    var key, results;
    results = [];
    for (key in fold) {
      if (key.slice(-suffix.length) === suffix) {
        results.push(key);
      }
    }
    return results;
  };
  filter.remapField = function(fold, field, old2new) {
    var array, i, j, k, key, l, len, len1, len2, m, new2old, old, ref, ref1;
    new2old = [];
    for (i = k = 0, len = old2new.length; k < len; i = ++k) {
      j = old2new[i];
      if (j != null) {
        new2old[j] = i;
      }
    }
    ref = filter.keysStartingWith(fold, field + "_");
    for (l = 0, len1 = ref.length; l < len1; l++) {
      key = ref[l];
      fold[key] = (function() {
        var len2, m, results;
        results = [];
        for (m = 0, len2 = new2old.length; m < len2; m++) {
          old = new2old[m];
          results.push(fold[key][old]);
        }
        return results;
      })();
    }
    ref1 = filter.keysEndingWith(fold, "_" + field);
    for (m = 0, len2 = ref1.length; m < len2; m++) {
      key = ref1[m];
      fold[key] = (function() {
        var len3, n, ref2, results;
        ref2 = fold[key];
        results = [];
        for (n = 0, len3 = ref2.length; n < len3; n++) {
          array = ref2[n];
          results.push((function() {
            var len4, o, results1;
            results1 = [];
            for (o = 0, len4 = array.length; o < len4; o++) {
              old = array[o];
              results1.push(old2new[old]);
            }
            return results1;
          })());
        }
        return results;
      })();
    }
    return fold;
  };
  filter.remapFieldSubset = function(fold, field, keep) {
    var id, old2new, value;
    id = 0;
    old2new = (function() {
      var k, len, results;
      results = [];
      for (k = 0, len = keep.length; k < len; k++) {
        value = keep[k];
        if (value) {
          results.push(id++);
        } else {
          results.push(null);
        }
      }
      return results;
    })();
    filter.remapField(fold, field, old2new);
    return old2new;
  };
  filter.numType = function(fold, type) {
    var counts, key, value;
    counts = (function() {
      var k, len, ref, results;
      ref = filter.keysStartingWith(fold, type + "_");
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        key = ref[k];
        value = fold[key];
        if (value.length == null) {
          continue;
        }
        results.push(value.length);
      }
      return results;
    })();
    if (!counts.length) {
      counts = (function() {
        var k, len, ref, results;
        ref = filter.keysEndingWith(fold, "_" + type);
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          key = ref[k];
          results.push(1 + Math.max.apply(Math, fold[key]));
        }
        return results;
      })();
    }
    if (counts.length) {
      return Math.max.apply(Math, counts);
    } else {
      return 0;
    }
  };
  filter.numVertices = function(fold) {
    return filter.numType(fold, 'vertices');
  };
  filter.numEdges = function(fold) {
    return filter.numType(fold, 'edges');
  };
  filter.numFaces = function(fold) {
    return filter.numType(fold, 'faces');
  };
  filter.removeDuplicateEdges_vertices = function(fold) {
    var edge, id, key, old2new, seen, v, w;
    seen = {};
    id = 0;
    old2new = (function() {
      var k, len, ref, results;
      ref = fold.edges_vertices;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        edge = ref[k];
        v = edge[0], w = edge[1];
        if (v < w) {
          key = v + "," + w;
        } else {
          key = w + "," + v;
        }
        if (!(key in seen)) {
          seen[key] = id;
          id += 1;
        }
        results.push(seen[key]);
      }
      return results;
    })();
    filter.remapField(fold, 'edges', old2new);
    return old2new;
  };
  filter.edges_verticesIncident = function(e1, e2) {
    var k, len, v;
    for (k = 0, len = e1.length; k < len; k++) {
      v = e1[k];
      if (indexOf.call(e2, v) >= 0) {
        return v;
      }
    }
    return null;
  };
  var RepeatedPointsDS = (function() {
    function RepeatedPointsDS(vertices_coords, epsilon1) {
      var base, coord, k, len, name, ref, v;
      this.vertices_coords = vertices_coords;
      this.epsilon = epsilon1;
      this.hash = {};
      ref = this.vertices_coords;
      for (v = k = 0, len = ref.length; k < len; v = ++k) {
        coord = ref[v];
        ((base = this.hash)[name = this.key(coord)] != null ? base[name] : base[name] = []).push(v);
      }
    }
    RepeatedPointsDS.prototype.lookup = function(coord) {
      var k, key, l, len, len1, len2, m, ref, ref1, ref2, ref3, v, x, xr, xt, y, yr, yt;
      x = coord[0], y = coord[1];
      xr = Math.round(x / this.epsilon);
      yr = Math.round(y / this.epsilon);
      ref = [xr, xr - 1, xr + 1];
      for (k = 0, len = ref.length; k < len; k++) {
        xt = ref[k];
        ref1 = [yr, yr - 1, yr + 1];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          yt = ref1[l];
          key = xt + "," + yt;
          ref3 = (ref2 = this.hash[key]) != null ? ref2 : [];
          for (m = 0, len2 = ref3.length; m < len2; m++) {
            v = ref3[m];
            if (this.epsilon > geom.dist(this.vertices_coords[v], coord)) {
              return v;
            }
          }
        }
      }
      return null;
    };
    RepeatedPointsDS.prototype.key = function(coord) {
      var key, x, xr, y, yr;
      x = coord[0], y = coord[1];
      xr = Math.round(x / this.epsilon);
      yr = Math.round(y / this.epsilon);
      return key = xr + "," + yr;
    };
    RepeatedPointsDS.prototype.insert = function(coord) {
      var base, name, v;
      v = this.lookup(coord);
      if (v != null) {
        return v;
      }
      ((base = this.hash)[name = this.key(coord)] != null ? base[name] : base[name] = []).push(v = this.vertices_coords.length);
      this.vertices_coords.push(coord);
      return v;
    };
    return RepeatedPointsDS;
  })();
  filter.collapseNearbyVertices = function(fold, epsilon) {
    var coords, old2new, vertices;
    vertices = new RepeatedPointsDS([], epsilon);
    old2new = (function() {
      var k, len, ref, results;
      ref = fold.vertices_coords;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        coords = ref[k];
        results.push(vertices.insert(coords));
      }
      return results;
    })();
    return filter.remapField(fold, 'vertices', old2new);
  };
  filter.maybeAddVertex = function(fold, coords, epsilon) {
    var i;
    i = geom.closestIndex(coords, fold.vertices_coords);
    if ((i != null) && epsilon >= geom.dist(coords, fold.vertices_coords[i])) {
      return i;
    } else {
      return fold.vertices_coords.push(coords) - 1;
    }
  };
  filter.addVertexLike = function(fold, oldVertexIndex) {
    var k, key, len, ref, vNew;
    vNew = filter.numVertices(fold);
    ref = filter.keysStartingWith(fold, 'vertices_');
    for (k = 0, len = ref.length; k < len; k++) {
      key = ref[k];
      switch (key.slice(6)) {
        case 'vertices':
          break;
        default:
          fold[key][vNew] = fold[key][oldVertexIndex];
      }
    }
    return vNew;
  };
  filter.addEdgeLike = function(fold, oldEdgeIndex, v1, v2) {
    var eNew, k, key, len, ref;
    eNew = fold.edges_vertices.length;
    ref = filter.keysStartingWith(fold, 'edges_');
    for (k = 0, len = ref.length; k < len; k++) {
      key = ref[k];
      switch (key.slice(6)) {
        case 'vertices':
          fold.edges_vertices.push([v1 != null ? v1 : fold.edges_vertices[oldEdgeIndex][0], v2 != null ? v2 : fold.edges_vertices[oldEdgeIndex][1]]);
          break;
        case 'edges':
          break;
        default:
          fold[key][eNew] = fold[key][oldEdgeIndex];
      }
    }
    return eNew;
  };
  filter.addVertexAndSubdivide = function(fold, coords, epsilon) {
    var changedEdges, e, i, iNew, k, len, ref, s, u, v;
    v = filter.maybeAddVertex(fold, coords, epsilon);
    changedEdges = [];
    if (v === fold.vertices_coords.length - 1) {
      ref = fold.edges_vertices;
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        e = ref[i];
        if (indexOf.call(e, v) >= 0) {
          continue;
        }
        s = (function() {
          var l, len1, results;
          results = [];
          for (l = 0, len1 = e.length; l < len1; l++) {
            u = e[l];
            results.push(fold.vertices_coords[u]);
          }
          return results;
        })();
        if (geom.pointStrictlyInSegment(coords, s)) {
          iNew = filter.addEdgeLike(fold, i, v, e[1]);
          changedEdges.push(i, iNew);
          e[1] = v;
        }
      }
    }
    return [v, changedEdges];
  };
  filter.removeLoopEdges = function(fold) {
    var edge;
    return filter.remapFieldSubset(fold, 'edges', (function() {
      var k, len, ref, results;
      ref = fold.edges_vertices;
      results = [];
      for (k = 0, len = ref.length; k < len; k++) {
        edge = ref[k];
        results.push(edge[0] !== edge[1]);
      }
      return results;
    })());
  };
  filter.subdivideCrossingEdges_vertices = function(fold, epsilon, involvingEdgesFrom) {
    var addEdge, changedEdges, cross, crossI, e, e1, e2, i, i1, i2, k, l, len, len1, len2, len3, m, n, old2new, p, ref, ref1, ref2, ref3, s, s1, s2, u, v, vertices;
    changedEdges = [[], []];
    addEdge = function(v1, v2, oldEdgeIndex, which) {
      var eNew;
      eNew = filter.addEdgeLike(fold, oldEdgeIndex, v1, v2);
      return changedEdges[which].push(oldEdgeIndex, eNew);
    };
    i = involvingEdgesFrom != null ? involvingEdgesFrom : 0;
    while (i < fold.edges_vertices.length) {
      e = fold.edges_vertices[i];
      s = (function() {
        var k, len, results;
        results = [];
        for (k = 0, len = e.length; k < len; k++) {
          u = e[k];
          results.push(fold.vertices_coords[u]);
        }
        return results;
      })();
      ref = fold.vertices_coords;
      for (v = k = 0, len = ref.length; k < len; v = ++k) {
        p = ref[v];
        if (indexOf.call(e, v) >= 0) {
          continue;
        }
        if (geom.pointStrictlyInSegment(p, s)) {
          addEdge(v, e[1], i, 0);
          e[1] = v;
        }
      }
      i++;
    }
    vertices = new RepeatedPointsDS(fold.vertices_coords, epsilon);
    i1 = involvingEdgesFrom != null ? involvingEdgesFrom : 0;
    while (i1 < fold.edges_vertices.length) {
      e1 = fold.edges_vertices[i1];
      s1 = (function() {
        var l, len1, results;
        results = [];
        for (l = 0, len1 = e1.length; l < len1; l++) {
          v = e1[l];
          results.push(fold.vertices_coords[v]);
        }
        return results;
      })();
      ref1 = fold.edges_vertices.slice(0, i1);
      for (i2 = l = 0, len1 = ref1.length; l < len1; i2 = ++l) {
        e2 = ref1[i2];
        s2 = (function() {
          var len2, m, results;
          results = [];
          for (m = 0, len2 = e2.length; m < len2; m++) {
            v = e2[m];
            results.push(fold.vertices_coords[v]);
          }
          return results;
        })();
        if (!filter.edges_verticesIncident(e1, e2) && geom.segmentsCross(s1, s2)) {
          cross = geom.lineIntersectLine(s1, s2);
          if (cross == null) {
            continue;
          }
          crossI = vertices.insert(cross);
          if (!(indexOf.call(e1, crossI) >= 0 && indexOf.call(e2, crossI) >= 0)) {
            if (indexOf.call(e1, crossI) < 0) {
              addEdge(crossI, e1[1], i1, 0);
              e1[1] = crossI;
              s1[1] = fold.vertices_coords[crossI];
            }
            if (indexOf.call(e2, crossI) < 0) {
              addEdge(crossI, e2[1], i2, 1);
              e2[1] = crossI;
            }
          }
        }
      }
      i1++;
    }
    old2new = filter.removeDuplicateEdges_vertices(fold);
    ref2 = [0, 1];
    for (m = 0, len2 = ref2.length; m < len2; m++) {
      i = ref2[m];
      changedEdges[i] = (function() {
        var len3, n, ref3, results;
        ref3 = changedEdges[i];
        results = [];
        for (n = 0, len3 = ref3.length; n < len3; n++) {
          e = ref3[n];
          results.push(old2new[e]);
        }
        return results;
      })();
    }
    old2new = filter.removeLoopEdges(fold);
    ref3 = [0, 1];
    for (n = 0, len3 = ref3.length; n < len3; n++) {
      i = ref3[n];
      changedEdges[i] = (function() {
        var len4, o, ref4, results;
        ref4 = changedEdges[i];
        results = [];
        for (o = 0, len4 = ref4.length; o < len4; o++) {
          e = ref4[o];
          results.push(old2new[e]);
        }
        return results;
      })();
    }
    if (involvingEdgesFrom != null) {
      return changedEdges;
    } else {
      return changedEdges[0].concat(changedEdges[1]);
    }
  };
  filter.addEdgeAndSubdivide = function(fold, v1, v2, epsilon) {
    var changedEdges, changedEdges1, changedEdges2, e, i, iNew, k, len, ref, ref1, ref2, ref3, ref4;
    if (v1.length != null) {
      ref = filter.addVertexAndSubdivide(fold, v1, epsilon), v1 = ref[0], changedEdges1 = ref[1];
    }
    if (v2.length != null) {
      ref1 = filter.addVertexAndSubdivide(fold, v2, epsilon), v2 = ref1[0], changedEdges2 = ref1[1];
    }
    if (v1 === v2) {
      return [[], []];
    }
    ref2 = fold.edges_vertices;
    for (i = k = 0, len = ref2.length; k < len; i = ++k) {
      e = ref2[i];
      if ((e[0] === v1 && e[1] === v2) || (e[0] === v2 && e[1] === v1)) {
        return [[i], []];
      }
    }
    iNew = fold.edges_vertices.push([v1, v2]) - 1;
    if (iNew) {
      changedEdges = filter.subdivideCrossingEdges_vertices(fold, epsilon, iNew);
      if (indexOf.call(changedEdges[0], iNew) < 0) {
        changedEdges[0].push(iNew);
      }
    } else {
      changedEdges = [[iNew], []];
    }
    if (changedEdges1 != null) {
      (ref3 = changedEdges[1]).push.apply(ref3, changedEdges1);
    }
    if (changedEdges2 != null) {
      (ref4 = changedEdges[1]).push.apply(ref4, changedEdges2);
    }
    return changedEdges;
  };
  filter.cutEdges = function(fold, es) {
    var b1, b2, boundaries, e, e1, e2, ev, i, i1, i2, ie, ie1, ie2, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, n, neighbor, neighbors, o, q, r, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, t, u1, u2, v, v1, v2, ve, vertices_boundaries;
    vertices_boundaries = [];
    ref = filter.boundaryEdges(fold);
    for (k = 0, len = ref.length; k < len; k++) {
      e = ref[k];
      ref1 = fold.edges_vertices[e];
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        v = ref1[l];
        (vertices_boundaries[v] != null ? vertices_boundaries[v] : vertices_boundaries[v] = []).push(e);
      }
    }
    for (m = 0, len2 = es.length; m < len2; m++) {
      e1 = es[m];
      e2 = filter.addEdgeLike(fold, e1);
      ref2 = fold.edges_vertices[e1];
      for (i = n = 0, len3 = ref2.length; n < len3; i = ++n) {
        v = ref2[i];
        ve = fold.vertices_edges[v];
        ve.splice(ve.indexOf(e1) + i, 0, e2);
      }
      ref3 = fold.edges_vertices[e1];
      for (i = o = 0, len4 = ref3.length; o < len4; i = ++o) {
        v1 = ref3[i];
        u1 = fold.edges_vertices[e1][1 - i];
        u2 = fold.edges_vertices[e2][1 - i];
        boundaries = (ref4 = vertices_boundaries[v1]) != null ? ref4.length : void 0;
        if (boundaries >= 2) {
          if (boundaries > 2) {
            throw new Error(vertices_boundaries[v1].length + " boundary edges at vertex " + v1);
          }
          ref5 = vertices_boundaries[v1], b1 = ref5[0], b2 = ref5[1];
          neighbors = fold.vertices_edges[v1];
          i1 = neighbors.indexOf(b1);
          i2 = neighbors.indexOf(b2);
          if (i2 === (i1 + 1) % neighbors.length) {
            if (i2 !== 0) {
              neighbors = neighbors.slice(i2).concat(neighbors.slice(0, +i1 + 1 || 9e9));
            }
          } else if (i1 === (i2 + 1) % neighbors.length) {
            if (i1 !== 0) {
              neighbors = neighbors.slice(i1).concat(neighbors.slice(0, +i2 + 1 || 9e9));
            }
          } else {
            throw new Error("Nonadjacent boundary edges at vertex " + v1);
          }
          ie1 = neighbors.indexOf(e1);
          ie2 = neighbors.indexOf(e2);
          ie = Math.min(ie1, ie2);
          fold.vertices_edges[v1] = neighbors.slice(0, +ie + 1 || 9e9);
          v2 = filter.addVertexLike(fold, v1);
          fold.vertices_edges[v2] = neighbors.slice(1 + ie);
          ref6 = fold.vertices_edges[v2];
          for (q = 0, len5 = ref6.length; q < len5; q++) {
            neighbor = ref6[q];
            ev = fold.edges_vertices[neighbor];
            ev[ev.indexOf(v1)] = v2;
          }
        }
      }
      if ((ref7 = fold.edges_assignment) != null) {
        ref7[e1] = 'B';
      }
      if ((ref8 = fold.edges_assignment) != null) {
        ref8[e2] = 'B';
      }
      ref9 = fold.edges_vertices[e1];
      for (i = r = 0, len6 = ref9.length; r < len6; i = ++r) {
        v = ref9[i];
        (vertices_boundaries[v] != null ? vertices_boundaries[v] : vertices_boundaries[v] = []).push(e1);
      }
      ref10 = fold.edges_vertices[e2];
      for (i = t = 0, len7 = ref10.length; t < len7; i = ++t) {
        v = ref10[i];
        (vertices_boundaries[v] != null ? vertices_boundaries[v] : vertices_boundaries[v] = []).push(e2);
      }
    }
    delete fold.vertices_vertices;
    return fold;
  };
  filter.edges_vertices_to_vertices_vertices = function(fold) {
    var edge, k, len, numVertices, ref, v, vertices_vertices, w;
    numVertices = filter.numVertices(fold);
    vertices_vertices = (function() {
      var k, ref, results;
      results = [];
      for (v = k = 0, ref = numVertices; 0 <= ref ? k < ref : k > ref; v = 0 <= ref ? ++k : --k) {
        results.push([]);
      }
      return results;
    })();
    ref = fold.edges_vertices;
    for (k = 0, len = ref.length; k < len; k++) {
      edge = ref[k];
      v = edge[0], w = edge[1];
      while (v >= vertices_vertices.length) {
        vertices_vertices.push([]);
      }
      while (w >= vertices_vertices.length) {
        vertices_vertices.push([]);
      }
      vertices_vertices[v].push(w);
      vertices_vertices[w].push(v);
    }
    return vertices_vertices;
  };

  var convert = {},
    modulo$1 = function(a, b) { return (+a % (b = +b) + b) % b; },
    hasProp = {}.hasOwnProperty;
  convert.edges_vertices_to_vertices_vertices_unsorted = function(fold) {
    fold.vertices_vertices = filter.edges_vertices_to_vertices_vertices(fold);
    return fold;
  };
  convert.edges_vertices_to_vertices_vertices_sorted = function(fold) {
    convert.edges_vertices_to_vertices_vertices_unsorted(fold);
    return convert.sort_vertices_vertices(fold);
  };
  convert.edges_vertices_to_vertices_edges_sorted = function(fold) {
    convert.edges_vertices_to_vertices_vertices_sorted(fold);
    return convert.vertices_vertices_to_vertices_edges(fold);
  };
  convert.sort_vertices_vertices = function(fold) {
    var neighbors, ref, ref1, ref2, v;
    if (((ref = fold.vertices_coords) != null ? (ref1 = ref[0]) != null ? ref1.length : void 0 : void 0) !== 2) {
      console.log("fold.vertices_coords", fold.vertices_coords);
      throw new Error("sort_vertices_vertices: Vertex coordinates missing or not two dimensional");
    }
    if (fold.vertices_vertices == null) {
      convert.edges_vertices_to_vertices_vertices(fold);
    }
    ref2 = fold.vertices_vertices;
    for (v in ref2) {
      neighbors = ref2[v];
      geom.sortByAngle(neighbors, v, function(x) {
        return fold.vertices_coords[x];
      });
    }
    return fold;
  };
  convert.vertices_vertices_to_faces_vertices = function(fold) {
    var face, i, j, k, key, l, len, len1, len2, neighbors, next, ref, ref1, ref2, ref3, u, uv, v, w, x;
    next = {};
    ref = fold.vertices_vertices;
    for (v = j = 0, len = ref.length; j < len; v = ++j) {
      neighbors = ref[v];
      for (i = k = 0, len1 = neighbors.length; k < len1; i = ++k) {
        u = neighbors[i];
        next[u + "," + v] = neighbors[modulo$1(i - 1, neighbors.length)];
      }
    }
    fold.faces_vertices = [];
    ref1 = (function() {
      var results;
      results = [];
      for (key in next) {
        results.push(key);
      }
      return results;
    })();
    for (l = 0, len2 = ref1.length; l < len2; l++) {
      uv = ref1[l];
      w = next[uv];
      if (w == null) {
        continue;
      }
      next[uv] = null;
      ref2 = uv.split(','), u = ref2[0], v = ref2[1];
      u = parseInt(u);
      v = parseInt(v);
      face = [u, v];
      while (w !== face[0]) {
        if (w == null) {
          console.warn("Confusion with face " + face);
          break;
        }
        face.push(w);
        ref3 = [v, w], u = ref3[0], v = ref3[1];
        w = next[u + "," + v];
        next[u + "," + v] = null;
      }
      next[face[face.length - 1] + "," + face[0]] = null;
      if ((w != null) && geom.polygonOrientation((function() {
        var len3, m, results;
        results = [];
        for (m = 0, len3 = face.length; m < len3; m++) {
          x = face[m];
          results.push(fold.vertices_coords[x]);
        }
        return results;
      })()) > 0) {
        fold.faces_vertices.push(face);
      }
    }
    return fold;
  };
  convert.vertices_edges_to_faces_vertices_edges = function(fold) {
    var e, e1, e2, edges, i, j, k, l, len, len1, len2, len3, m, neighbors, next, nexts, ref, ref1, v, vertex, vertices, x;
    next = [];
    ref = fold.vertices_edges;
    for (v = j = 0, len = ref.length; j < len; v = ++j) {
      neighbors = ref[v];
      next[v] = {};
      for (i = k = 0, len1 = neighbors.length; k < len1; i = ++k) {
        e = neighbors[i];
        next[v][e] = neighbors[modulo$1(i - 1, neighbors.length)];
      }
    }
    fold.faces_vertices = [];
    fold.faces_edges = [];
    for (vertex = l = 0, len2 = next.length; l < len2; vertex = ++l) {
      nexts = next[vertex];
      for (e1 in nexts) {
        e2 = nexts[e1];
        if (e2 == null) {
          continue;
        }
        e1 = parseInt(e1);
        nexts[e1] = null;
        edges = [e1];
        vertices = [filter.edges_verticesIncident(fold.edges_vertices[e1], fold.edges_vertices[e2])];
        if (vertices[0] == null) {
          throw new Error("Confusion at edges " + e1 + " and " + e2);
        }
        while (e2 !== edges[0]) {
          if (e2 == null) {
            console.warn("Confusion with face containing edges " + edges);
            break;
          }
          edges.push(e2);
          ref1 = fold.edges_vertices[e2];
          for (m = 0, len3 = ref1.length; m < len3; m++) {
            v = ref1[m];
            if (v !== vertices[vertices.length - 1]) {
              vertices.push(v);
              break;
            }
          }
          e1 = e2;
          e2 = next[v][e1];
          next[v][e1] = null;
        }
        if ((e2 != null) && geom.polygonOrientation((function() {
          var len4, n, results;
          results = [];
          for (n = 0, len4 = vertices.length; n < len4; n++) {
            x = vertices[n];
            results.push(fold.vertices_coords[x]);
          }
          return results;
        })()) > 0) {
          fold.faces_vertices.push(vertices);
          fold.faces_edges.push(edges);
        }
      }
    }
    return fold;
  };
  convert.edges_vertices_to_faces_vertices = function(fold) {
    convert.edges_vertices_to_vertices_vertices_sorted(fold);
    return convert.vertices_vertices_to_faces_vertices(fold);
  };
  convert.edges_vertices_to_faces_vertices_edges = function(fold) {
    convert.edges_vertices_to_vertices_edges_sorted(fold);
    return convert.vertices_edges_to_faces_vertices_edges(fold);
  };
  convert.vertices_vertices_to_vertices_edges = function(fold) {
    var edge, edgeMap, i, j, len, ref, ref1, v1, v2, vertex, vertices;
    edgeMap = {};
    ref = fold.edges_vertices;
    for (edge = j = 0, len = ref.length; j < len; edge = ++j) {
      ref1 = ref[edge], v1 = ref1[0], v2 = ref1[1];
      edgeMap[v1 + "," + v2] = edge;
      edgeMap[v2 + "," + v1] = edge;
    }
    return fold.vertices_edges = (function() {
      var k, len1, ref2, results;
      ref2 = fold.vertices_vertices;
      results = [];
      for (vertex = k = 0, len1 = ref2.length; k < len1; vertex = ++k) {
        vertices = ref2[vertex];
        results.push((function() {
          var l, ref3, results1;
          results1 = [];
          for (i = l = 0, ref3 = vertices.length; 0 <= ref3 ? l < ref3 : l > ref3; i = 0 <= ref3 ? ++l : --l) {
            results1.push(edgeMap[vertex + "," + vertices[i]]);
          }
          return results1;
        })());
      }
      return results;
    })();
  };
  convert.faces_vertices_to_faces_edges = function(fold) {
    var edge, edgeMap, face, i, j, len, ref, ref1, v1, v2, vertices;
    edgeMap = {};
    ref = fold.edges_vertices;
    for (edge = j = 0, len = ref.length; j < len; edge = ++j) {
      ref1 = ref[edge], v1 = ref1[0], v2 = ref1[1];
      edgeMap[v1 + "," + v2] = edge;
      edgeMap[v2 + "," + v1] = edge;
    }
    return fold.faces_edges = (function() {
      var k, len1, ref2, results;
      ref2 = fold.faces_vertices;
      results = [];
      for (face = k = 0, len1 = ref2.length; k < len1; face = ++k) {
        vertices = ref2[face];
        results.push((function() {
          var l, ref3, results1;
          results1 = [];
          for (i = l = 0, ref3 = vertices.length; 0 <= ref3 ? l < ref3 : l > ref3; i = 0 <= ref3 ? ++l : --l) {
            results1.push(edgeMap[vertices[i] + "," + vertices[(i + 1) % vertices.length]]);
          }
          return results1;
        })());
      }
      return results;
    })();
  };
  convert.faces_vertices_to_edges = function(mesh) {
    var edge, edgeMap, face, i, key, ref, v1, v2, vertices;
    mesh.edges_vertices = [];
    mesh.edges_faces = [];
    mesh.faces_edges = [];
    mesh.edges_assignment = [];
    edgeMap = {};
    ref = mesh.faces_vertices;
    for (face in ref) {
      vertices = ref[face];
      face = parseInt(face);
      mesh.faces_edges.push((function() {
        var j, len, results;
        results = [];
        for (i = j = 0, len = vertices.length; j < len; i = ++j) {
          v1 = vertices[i];
          v1 = parseInt(v1);
          v2 = vertices[(i + 1) % vertices.length];
          if (v1 <= v2) {
            key = v1 + "," + v2;
          } else {
            key = v2 + "," + v1;
          }
          if (key in edgeMap) {
            edge = edgeMap[key];
          } else {
            edge = edgeMap[key] = mesh.edges_vertices.length;
            if (v1 <= v2) {
              mesh.edges_vertices.push([v1, v2]);
            } else {
              mesh.edges_vertices.push([v2, v1]);
            }
            mesh.edges_faces.push([null, null]);
            mesh.edges_assignment.push('B');
          }
          if (v1 <= v2) {
            mesh.edges_faces[edge][0] = face;
          } else {
            mesh.edges_faces[edge][1] = face;
          }
          results.push(edge);
        }
        return results;
      })());
    }
    return mesh;
  };
  convert.deepCopy = function(fold) {
    var copy, item, j, key, len, ref, results, value;
    if ((ref = typeof fold) === 'number' || ref === 'string' || ref === 'boolean') {
      return fold;
    } else if (Array.isArray(fold)) {
      results = [];
      for (j = 0, len = fold.length; j < len; j++) {
        item = fold[j];
        results.push(convert.deepCopy(item));
      }
      return results;
    } else {
      copy = {};
      for (key in fold) {
        if (!hasProp.call(fold, key)) continue;
        value = fold[key];
        copy[key] = convert.deepCopy(value);
      }
      return copy;
    }
  };
  convert.toJSON = function(fold) {
    var key, obj, value;
    return "{\n" + ((function() {
      var results;
      results = [];
      var keys = Object.keys(fold);
      for(var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        key = keys[keyIndex];
        value = fold[key];
        results.push(("  " + (JSON.stringify(key)) + ": ") + (Array.isArray(value) ? "[\n" + ((function() {
          var j, len, results1;
          results1 = [];
          for (j = 0, len = value.length; j < len; j++) {
            obj = value[j];
            results1.push("    " + (JSON.stringify(obj)));
          }
          return results1;
        })()).join(',\n') + "\n  ]" : JSON.stringify(value)));
      }
      return results;
    })()).join(',\n') + "\n}\n";
  };
  convert.extensions = {};
  convert.converters = {};
  convert.getConverter = function(fromExt, toExt) {
    if (fromExt === toExt) {
      return function(x) {
        return x;
      };
    } else {
      return convert.converters["" + fromExt + toExt];
    }
  };
  convert.setConverter = function(fromExt, toExt, converter) {
    convert.extensions[fromExt] = true;
    convert.extensions[toExt] = true;
    return convert.converters["" + fromExt + toExt] = converter;
  };
  convert.convertFromTo = function(data, fromExt, toExt) {
    var converter;
    if (fromExt[0] !== '.') {
      fromExt = "." + fromExt;
    }
    if (toExt[0] !== '.') {
      toExt = "." + toExt;
    }
    converter = convert.getConverter(fromExt, toExt);
    if (converter == null) {
      if (fromExt === toExt) {
        return data;
      }
      throw new Error("No converter from " + fromExt + " to " + toExt);
    }
    return converter(data);
  };
  convert.convertFrom = function(data, fromExt) {
    return convert.convertFromTo(data, fromExt, '.fold');
  };
  convert.convertTo = function(data, toExt) {
    return convert.convertFromTo(data, '.fold', toExt);
  };

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
  const make_face_walk_tree = function (graph, root_face = 0) {
    const edge_map = make_vertex_pair_to_edge_map(graph);
    const new_faces_faces = make_faces_faces(graph);
    if (new_faces_faces.length <= 0) {
      return [];
    }
    let visited = [root_face];
    const list = [[{
      face: root_face,
      parent: undefined,
      edge: undefined,
      level: 0,
    }]];
    do {
      list[list.length] = list[list.length - 1].map((current) => {
        const unique_faces = new_faces_faces[current.face]
          .filter(f => visited.indexOf(f) === -1);
        visited = visited.concat(unique_faces);
        return unique_faces.map((f) => {
          const edge_vertices = graph.faces_vertices[f]
            .filter(v => graph.faces_vertices[current.face].indexOf(v) !== -1)
            .sort((a, b) => a - b);
          const edge = edge_map[edge_vertices.join(" ")];
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
          ? math.core.make_matrix2_reflection(vec, verts[0])
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
          ? math.core.make_matrix2_reflection(vec, verts[0])
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
    make_faces_matrix_inv: make_faces_matrix_inv,
    make_vertices_coords_folded: make_vertices_coords_folded,
    make_vertices_isBoundary: make_vertices_isBoundary,
    make_faces_coloring_from_faces_matrix: make_faces_coloring_from_faces_matrix,
    make_faces_coloring: make_faces_coloring
  });

  const need = function (graph, ...keys) {
    return keys.map((key) => {
      switch (key) {
        case "vertices_coords":
        case "edges_vertices":
          return graph[key] != null;
        case "vertices_vertices":
          convert.edges_vertices_to_vertices_vertices_sorted(graph);
          return true;
        case "vertices_edges":
          graph.vertices_edges = make_vertices_edges(graph);
          return true;
        default: return false;
      }
    }).reduce((a, b) => a && b, true);
  };

  const collinear_vertices = function (graph, point, vector) {
    return graph.vertices_coords
      .map(vert => vert.map((n, i) => n - point[i]))
      .map(vert => vert[0] * vector[1] - vert[1] * vector[0])
      .map((det, i) => (Math.abs(det) < math.core.EPSILON ? i : undefined))
      .filter(a => a !== undefined);
  };
  const collinear_edges = function (graph, point, vector) {
    const hash = {};
    collinear_vertices(graph, point, vector)
      .forEach((v) => { hash[v] = true; });
    convert.edges_vertices_to_vertices_vertices_sorted(graph);
    return graph.edges_vertices
      .map(ev => hash[ev[0]] && hash[ev[1]] && graph.vertices_vertices[ev[0]].includes(ev[1]))
      .map((collinear, i) => (collinear ? i : undefined))
      .filter(a => a !== undefined);
  };
  const are_vertices_collinear = function (graph, verts) {
    if (verts.length < 3) { return false; }
    const coords = verts.map(v => graph.vertices_coords[v]);
    const dimension = Array.from(Array(coords[0].length));
    const a = dimension.map((_, i) => coords[1][i] - coords[0][i]);
    const b = dimension.map((_, i) => coords[2][i] - coords[0][i]);
    return Math.abs(a[0] * b[1] - a[1] * b[0]) < math.core.EPSILON;
  };
  const remove_collinear_vertices = function (graph, collinear) {
    const new_edges = [];
    collinear.forEach((co) => {
      const { vertices, edges } = co;
      const assignment = co.assignments[0];
      remove_geometry_key_indices(graph, "edges", edges);
      new_edges.push({ vertices, assignment });
    });
    new_edges.forEach((el) => {
      const index = graph.edges_vertices.length;
      graph.edges_vertices[index] = el.vertices;
      graph.edges_assignment[index] = el.assignment;
    });
    remove_geometry_key_indices(graph, "vertices", collinear.map(c => c.vertex));
  };
  const remove_all_collinear_vertices = function (graph) {
    need(graph, "vertices_vertices", "vertices_edges");
    const pairs_verts = graph.vertices_vertices
      .map((adj, i) => (adj.length === 2 ? i : undefined))
      .filter(a => a !== undefined);
    const collinear_verts = pairs_verts
      .map(v => [v].concat(graph.vertices_vertices[v]))
      .map(verts => (are_vertices_collinear(graph, verts)
        ? ({ vertex: verts[0], vertices: [verts[1], verts[2]], edges: graph.vertices_edges[verts[0]] })
        : undefined))
      .filter(a => a !== undefined);
    collinear_verts.forEach((v) => {
      v.assignments = v.edges.map(e => graph.edges_assignment[e].toUpperCase());
    });
    collinear_verts.forEach((v) => {
      v.valid = v.assignments.map(a => a === v.assignments[0]).reduce((a, b) => a && b, true);
    });
    const toRemove = collinear_verts.filter(v => v.valid);
    remove_collinear_vertices(graph, toRemove);
    return toRemove.length > 0;
  };

  var collinear = /*#__PURE__*/Object.freeze({
    __proto__: null,
    collinear_vertices: collinear_vertices,
    collinear_edges: collinear_edges,
    remove_all_collinear_vertices: remove_all_collinear_vertices
  });

  const find_edge_isolated_vertices = function (graph) {
    if (graph.vertices_coords == null) { return []; }
    let count = graph.vertices_coords.length;
    const seen = Array(count).fill(false);
    if (graph.edges_vertices) {
      graph.edges_vertices.forEach((ev) => {
        ev.filter(v => !seen[v]).forEach((v) => {
          seen[v] = true;
          count -= 1;
        });
      });
    }
    return seen
      .map((s, i) => (s ? undefined : i))
      .filter(a => a !== undefined);
  };
  const find_face_isolated_vertices = function (graph) {
    if (graph.vertices_coords == null) { return []; }
    let count = graph.vertices_coords.length;
    const seen = Array(count).fill(false);
    if (graph.faces_vertices) {
      graph.faces_vertices.forEach((fv) => {
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
  const find_isolated_vertices = function (graph) {
    if (graph.vertices_coords == null) { return []; }
    let count = graph.vertices_coords.length;
    const seen = Array(count).fill(false);
    if (graph.edges_vertices) {
      graph.edges_vertices.forEach((ev) => {
        ev.filter(v => !seen[v]).forEach((v) => {
          seen[v] = true;
          count -= 1;
        });
      });
    }
    if (graph.faces_vertices) {
      graph.faces_vertices.forEach((fv) => {
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

  var isolated = /*#__PURE__*/Object.freeze({
    __proto__: null,
    find_edge_isolated_vertices: find_edge_isolated_vertices,
    find_face_isolated_vertices: find_face_isolated_vertices,
    find_isolated_vertices: find_isolated_vertices
  });

  const DEFAULTS = Object.freeze({
    circular: true,
    duplicate: true,
  });
  const removeCircularEdges = function (graph) {
    const circular = graph.edges_vertices
      .map((ev, i) => (ev[0] === ev[1] ? i : undefined))
      .filter(a => a !== undefined);
    remove_geometry_key_indices(graph, "edges", circular);
  };
  const edges_similar = function (graph, e0, e1) {
    return ((graph.edges_vertices[e0][0] === graph.edges_vertices[e1][0]
      && graph.edges_vertices[e0][1] === graph.edges_vertices[e1][1])
      || (graph.edges_vertices[e0][0] === graph.edges_vertices[e1][1]
      && graph.edges_vertices[e0][1] === graph.edges_vertices[e1][0]));
  };
  const removeDuplicateEdges = function (graph) {
    const duplicates = graph.edges_vertices.map((ev, i) => {
      for (let j = i + 1; j < graph.edges_vertices.length; j += 1) {
        if (edges_similar(graph, i, j)) { return j; }
      }
      return undefined;
    }).filter(a => a !== undefined);
    remove_geometry_key_indices(graph, "edges", duplicates);
  };
  const clean = function (graph, options) {
    if (typeof options !== "object") { options = {}; }
    Object.keys(DEFAULTS)
      .filter(key => !(key in options))
      .forEach((key) => { options[key] = DEFAULTS[key]; });
    if (options.circular === true) { removeCircularEdges(graph); }
    if (options.duplicate === true) { removeDuplicateEdges(graph); }
    if (options.collinear === true) {
      remove_all_collinear_vertices(graph);
      if (options.circular === true) { removeCircularEdges(graph); }
      if (options.duplicate === true) { removeDuplicateEdges(graph); }
    }
    if (options.isolated === true) {
      remove_geometry_key_indices(graph, "vertices", find_isolated_vertices(graph));
    }
  };

  const are_vertices_equivalent$1 = function (a, b, epsilon = math.core.EPSILON) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i += 1) {
      if (Math.abs(a[i] - b[i]) > epsilon) {
        return false;
      }
    }
    return true;
  };
  const similar_vertices_coords = function (target, source, epsilon) {
    const sourceMap = source.vertices_coords.map(() => undefined);
    for (let i = 0; i < target.vertices_coords.length; i += 1) {
      for (let j = 0; j < source.vertices_coords.length; j += 1) {
        if (are_vertices_equivalent$1(target.vertices_coords[i], source.vertices_coords[j], epsilon)) {
          sourceMap[j] = i;
          j = source.vertices_coords.length;
        }
      }
    }
    return sourceMap;
  };

  var similar = /*#__PURE__*/Object.freeze({
    __proto__: null,
    similar_vertices_coords: similar_vertices_coords
  });

  const populate = function (graph) {
    if (typeof graph !== "object") { return; }
    if (graph.vertices_vertices == null) {
      if (graph.vertices_coords && graph.edges_vertices) {
        convert.edges_vertices_to_vertices_vertices_sorted(graph);
      } else if (graph.edges_vertices) {
        convert.edges_vertices_to_vertices_vertices_unsorted(graph);
      }
    }
    if (graph.faces_vertices == null) {
      if (graph.vertices_coords && graph.vertices_vertices) {
        convert.vertices_vertices_to_faces_vertices(graph);
      }
    }
    if (graph.faces_edges == null) {
      if (graph.faces_vertices) {
        convert.faces_vertices_to_faces_edges(graph);
      }
    }
    if (graph.edges_faces == null) {
      const edges_faces = make_edges_faces(graph);
      if (edges_faces !== undefined) {
        graph.edges_faces = edges_faces;
      }
    }
    if (graph.vertices_faces == null) {
      const vertices_faces = make_vertices_faces(graph);
      if (vertices_faces !== undefined) {
        graph.vertices_faces = vertices_faces;
      }
    }
    if (graph.edges_length == null) {
      const edges_length = make_edges_length(graph);
      if (edges_length !== undefined) {
        graph.edges_length = edges_length;
      }
    }
    if (graph.edges_foldAngle == null
      && graph.edges_assignment != null) {
      graph.edges_foldAngle = graph.edges_assignment
        .map(a => edge_assignment_to_foldAngle(a));
    }
    if (graph.edges_assignment == null
      && graph.edges_foldAngle != null) {
      graph.edges_assignment = graph.edges_foldAngle.map((a) => {
        if (a === 0) { return "F"; }
        if (a < 0) { return "M"; }
        if (a > 0) { return "V"; }
        return "U";
      });
    }
    if (graph.faces_faces == null) {
      const faces_faces = make_faces_faces(graph);
      if (faces_faces !== undefined) {
        graph.faces_faces = faces_faces;
      }
    }
    if (graph.vertices_edges == null) {
      const vertices_edges = make_vertices_edges(graph);
      if (vertices_edges !== undefined) {
        graph.vertices_edges = vertices_edges;
      }
    }
    if (graph.edges_edges == null) {
      const edges_edges = make_edges_edges(graph);
      if (edges_edges !== undefined) {
        graph.edges_edges = edges_edges;
      }
    }
  };

  const join = function (target, source, epsilon = math.core.EPSILON) {
    const sourceMap = similar_vertices_coords(target, source, epsilon);
    const additional_vertices_coords = source.vertices_coords
      .filter((_, i) => sourceMap[i] === undefined);
    let new_index = target.vertices_coords.length;
    for (let i = 0; i < sourceMap.length; i += 1) {
      if (sourceMap[i] === undefined) {
        sourceMap[i] = new_index;
        new_index += 1;
      }
    }
    const additional_edges_vertices = source.edges_vertices
      .map(ev => ev.map(v => sourceMap[v]));
    target.vertices_coords = target.vertices_coords.concat(additional_vertices_coords);
    target.edges_vertices = target.edges_vertices.concat(additional_edges_vertices);
    delete target.vertices_vertices;
    delete target.vertices_edges;
    delete target.vertices_faces;
    delete target.edges_edges;
    delete target.edges_faces;
    delete target.faces_vertices;
    delete target.faces_edges;
    delete target.faces_faces;
    clean(target);
    fragment(target);
    populate(target);
    return target;
  };

  const rebuild = function (graph, epsilon = math.core.EPSILON) {
    fold_keys.orders.forEach(key => delete graph[key]);
    fold_keys.graph
      .filter(key => key !== "vertices_coords")
      .filter(key => key !== "edges_vertices")
      .filter(key => key !== "edges_assignment")
      .filter(key => key !== "edges_foldAngle")
      .forEach(key => delete graph[key]);
    Object.keys(graph)
      .filter(s => s.includes("re:"))
      .forEach(key => delete graph[key]);
    if (graph.edges_assignment != null && graph.edges_foldAngle != null) {
      delete graph.edges_foldAngle;
    }
    populate(graph);
  };

  const max_array_length$1 = function (...arrays) {
    return Math.max(...(arrays
      .filter(el => el !== undefined)
      .map(el => el.length)));
  };
  const vertices_count$1 = function ({
    vertices_coords, vertices_faces, vertices_vertices
  }) {
    return max_array_length$1([], vertices_coords,
      vertices_faces, vertices_vertices);
  };
  const edges_count$1 = function ({
    edges_vertices, edges_faces
  }) {
    return max_array_length$1([], edges_vertices, edges_faces);
  };
  const faces_count$1 = function ({
    faces_vertices, faces_edges
  }) {
    return max_array_length$1([], faces_vertices, faces_edges);
  };
  const implied_vertices_count = function ({
    faces_vertices, edges_vertices
  }) {
    let max = -1;
    [faces_vertices, edges_vertices]
      .filter(a => a !== undefined)
      .forEach(arr => arr
        .forEach(el => el
          .forEach((e) => {
            if (e > max) { max = e; }
          })));
    return max + 1;
  };
  const implied_edges_count = function ({
    faces_edges, vertices_edges, edgeOrders
  }) {
    let max = -1;
    [faces_edges, vertices_edges]
      .filter(a => a !== undefined)
      .forEach(arr => arr
        .forEach(el => el
          .forEach((e) => {
            if (e > max) { max = e; }
          })));
    if (edgeOrders !== undefined) {
      edgeOrders.forEach(eo => eo.forEach((e, i) => {
        if (i !== 2 && e > max) { max = e; }
      }));
    }
    return max + 1;
  };
  const implied_faces_count = function ({
    vertices_faces, edges_faces, facesOrders
  }) {
    let max = -1;
    [vertices_faces, edges_faces]
      .filter(a => a !== undefined)
      .forEach(arr => arr
        .forEach(el => el
          .forEach((f) => {
            if (f > max) { max = f; }
          })));
    if (facesOrders !== undefined) {
      facesOrders.forEach(fo => fo.forEach((f, i) => {
        if (i !== 2 && f > max) { max = f; }
      }));
    }
    return max + 1;
  };
  const nearest_vertex = function ({ vertices_coords }, point) {
    if (vertices_coords === undefined
      || vertices_coords.length === 0) {
      return undefined;
    }
    const p = [...point];
    if (p[2] == null) { p[2] = 0; }
    return vertices_coords
      .map(v => v
        .map((n, i) => (n - p[i]) ** 2)
        .reduce((a, b) => a + b, 0))
      .map((n, i) => ({ d: Math.sqrt(n), i }))
      .sort((a, b) => a.d - b.d)
      .shift()
      .i;
  };
  const nearest_edge = function ({
    vertices_coords, edges_vertices
  }, point) {
    if (vertices_coords == null || vertices_coords.length === 0
      || edges_vertices == null || edges_vertices.length === 0) {
      return undefined;
    }
    const edge_limit = (dist) => {
      if (dist < -math.core.EPSILON) { return 0; }
      if (dist > 1 + math.core.EPSILON) { return 1; }
      return dist;
    };
    const nearest_points = edges_vertices
      .map(e => e.map(ev => vertices_coords[ev]))
      .map(e => [e[0], [e[1][0] - e[0][0], e[1][1] - e[0][1]]])
      .map(line => math.core.nearest_point_on_line(line[0], line[1], point, edge_limit))
      .map((p, i) => ({ p, i, d: math.core.distance2(point, p) }));
    let shortest_index;
    let shortest_distance = Infinity;
    for (let i = 0; i < nearest_points.length; i += 1) {
      if (nearest_points[i].d < shortest_distance) {
        shortest_index = i;
        shortest_distance = nearest_points[i].d;
      }
    }
    return shortest_index;
  };
  const face_containing_point = function ({
    vertices_coords, faces_vertices
  }, point) {
    if (vertices_coords == null || vertices_coords.length === 0
      || faces_vertices == null || faces_vertices.length === 0) {
      return undefined;
    }
    const face = faces_vertices
      .map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
      .filter(f => math.core.point_in_poly(point, f.face))
      .shift();
    return (face == null ? undefined : face.i);
  };
  const folded_faces_containing_point = function ({
    vertices_coords, faces_vertices
  }, point, faces_matrix) {
    const transformed_points = faces_matrix
      .map(m => math.core.multiply_matrix2_vector2(m, point));
    return faces_vertices
      .map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
      .filter((f, i) => math.core.intersection
        .point_in_poly(transformed_points[i], f.face))
      .map(f => f.i);
  };
  const faces_containing_point = function ({
    vertices_coords, faces_vertices
  }, point) {
    return faces_vertices
      .map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
      .filter(f => math.core.point_in_poly(point, f.face))
      .map(f => f.i);
  };
  const topmost_face = function (graph, faces) {
    if (faces == null) {
      faces = Array.from(Array(faces_count$1(graph)))
        .map((_, i) => i);
    }
    if (faces.length === 0) { return undefined; }
    if (faces.length === 1) { return faces[0]; }
    const faces_in_order = graph["faces_re:layer"]
      .map((layer, i) => ({ layer, i }))
      .sort((a, b) => b.layer - a.layer)
      .map(el => el.i);
    for (let i = 0; i < faces_in_order.length; i += 1) {
      if (faces.includes(faces_in_order[i])) {
        return faces_in_order[i];
      }
    }
    return undefined;
  };
  const get_collinear_vertices = function ({
    edges_vertices, vertices_coords
  }) {
    const vertices_edges = make_vertices_edges({ edges_vertices });
    return Array.from(Array(vertices_coords.length))
      .map((_, i) => i)
      .filter(() => vertices_edges.length === 2)
      .map((v) => {
        const edges = vertices_edges[v];
        const a = edges[0][0] === v ? edges[0][1] : edges[0][0];
        const b = edges[1][0] === v ? edges[1][1] : edges[1][0];
        const av = math.core.distance2(vertices_coords[a], vertices_coords[v]);
        const bv = math.core.distance2(vertices_coords[b], vertices_coords[v]);
        const ab = math.core.distance2(vertices_coords[a], vertices_coords[b]);
        return Math.abs(ab - av - bv) < math.core.EPSILON ? v : undefined;
      })
      .filter(a => a !== undefined);
  };
  const get_isolated_vertices = function ({
    edges_vertices, vertices_coords
  }) {
    const vertices_size = vertices_coords.length;
    const isolated = Array(vertices_size).fill(true);
    let set_count = vertices_size;
    for (let i = 0; i < edges_vertices.length && set_count > 0; i += 1) {
      for (let e = 0; e < edges_vertices[i].length; e += 1) {
        const v = edges_vertices[i][e];
        if (isolated[v]) {
          set_count -= 1;
          isolated[v] = false;
        }
      }
    }
    if (set_count === 0) { return []; }
    return isolated
      .map((el, i) => (el ? i : undefined))
      .filter(el => el !== undefined);
  };
  const get_duplicate_vertices = function ({ vertices_coords }) {
    const vertices_equivalent = Array.from(Array(vertices_coords.length))
      .map(() => []);
    for (let i = 0; i < vertices_coords.length - 1; i += 1) {
      for (let j = i + 1; j < vertices_coords.length; j += 1) {
        vertices_equivalent[i][j] = math.core.equivalent_vectors(
          vertices_coords[i],
          vertices_coords[j]
        );
      }
    }
    const vertices_map = vertices_coords.map(() => undefined);
    vertices_equivalent
      .forEach((row, i) => row
        .forEach((eq, j) => {
          if (eq) {
            vertices_map[j] = vertices_map[i] === undefined ? i : vertices_map[i];
          }
        }));
    const vertices_remove = vertices_map.map(m => m !== undefined);
    vertices_map.forEach((map, i) => {
      if (map === undefined) { vertices_map[i] = i; }
    });
    return vertices_remove
      .map((rm, i) => (rm ? i : undefined))
      .filter(i => i !== undefined);
  };
  const get_duplicate_edges = function ({ edges_vertices }) {
    const equivalent2 = function (a, b) {
      return (a[0] === b[0] && a[1] === b[1])
          || (a[0] === b[1] && a[1] === b[0]);
    };
    const edges_equivalent = Array.from(Array(edges_vertices.length))
      .map(() => []);
    for (let i = 0; i < edges_vertices.length - 1; i += 1) {
      for (let j = i + 1; j < edges_vertices.length; j += 1) {
        edges_equivalent[i][j] = equivalent2(
          edges_vertices[i],
          edges_vertices[j]
        );
      }
    }
    const edges_map = [];
    edges_equivalent
      .forEach((row, i) => row
        .forEach((eq, j) => {
          if (eq) {
            edges_map[j] = edges_map[i] === undefined ? i : edges_map[i];
          }
        }));
    return edges_map;
  };
  const get_duplicate_edges_old = function (graph) {
    const equivalent2 = function (a, b) {
      return (a[0] === b[0] && a[1] === b[1])
          || (a[0] === b[1] && a[1] === b[0]);
    };
    const edges_equivalent = Array
      .from(Array(graph.edges_vertices.length)).map(() => []);
    for (let i = 0; i < graph.edges_vertices.length - 1; i += 1) {
      for (let j = i + 1; j < graph.edges_vertices.length; j += 1) {
        edges_equivalent[i][j] = equivalent2(
          graph.edges_vertices[i],
          graph.edges_vertices[j],
        );
      }
    }
    const edges_map = graph.edges_vertices.map(() => undefined);
    edges_equivalent
      .forEach((row, i) => row
        .forEach((eq, j) => {
          if (eq) {
            edges_map[j] = edges_map[i] === undefined ? i : edges_map[i];
          }
        }));
    const edges_remove = edges_map.map(m => m !== undefined);
    edges_map.forEach((map, i) => {
      if (map === undefined) { edges_map[i] = i; }
    });
    return edges_remove
      .map((rm, i) => (rm ? i : undefined))
      .filter(i => i !== undefined);
  };
  const find_collinear_face_edges = function (edge, face_vertices,
    vertices_coords) {
    const face_edge_geometry = face_vertices
      .map(v => vertices_coords[v])
      .map((v, i, arr) => [v, arr[(i + 1) % arr.length]]);
    return edge.map((endPt) => {
      const i = face_edge_geometry
        .map((edgeVerts, edgeI) => ({ index: edgeI, edge: edgeVerts }))
        .filter(e => math.core.intersection
          .point_on_edge(e.edge[0], e.edge[1], endPt))
        .shift()
        .index;
      return [face_vertices[i], face_vertices[(i + 1) % face_vertices.length]]
        .sort((a, b) => a - b);
    });
  };

  var query$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    vertices_count: vertices_count$1,
    edges_count: edges_count$1,
    faces_count: faces_count$1,
    implied_vertices_count: implied_vertices_count,
    implied_edges_count: implied_edges_count,
    implied_faces_count: implied_faces_count,
    nearest_vertex: nearest_vertex,
    nearest_edge: nearest_edge,
    face_containing_point: face_containing_point,
    folded_faces_containing_point: folded_faces_containing_point,
    faces_containing_point: faces_containing_point,
    topmost_face: topmost_face,
    get_collinear_vertices: get_collinear_vertices,
    get_isolated_vertices: get_isolated_vertices,
    get_duplicate_vertices: get_duplicate_vertices,
    get_duplicate_edges: get_duplicate_edges,
    get_duplicate_edges_old: get_duplicate_edges_old,
    find_collinear_face_edges: find_collinear_face_edges
  });

  const bounding_rect = function ({ vertices_coords }) {
    if (vertices_coords == null
      || vertices_coords.length <= 0) {
      return [0, 0, 0, 0];
    }
    const dimension = vertices_coords[0].length;
    const min = Array(dimension).fill(Infinity);
    const max = Array(dimension).fill(-Infinity);
    vertices_coords.forEach(v => v.forEach((n, i) => {
      if (n < min[i]) { min[i] = n; }
      if (n > max[i]) { max[i] = n; }
    }));
    return (isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1])
      ? [0, 0, 0, 0]
      : [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
  };
  const get_boundary = function (graph) {
    if (graph.edges_assignment == null) { return { vertices: [], edges: [] }; }
    const edges_vertices_b = graph.edges_assignment
      .map(a => a === "B" || a === "b");
    const vertices_edges = make_vertices_edges(graph);
    const edge_walk = [];
    const vertex_walk = [];
    let edgeIndex = -1;
    for (let i = 0; i < edges_vertices_b.length; i += 1) {
      if (edges_vertices_b[i]) { edgeIndex = i; break; }
    }
    if (edgeIndex === -1) {
      return { vertices: [], edges: [] };
    }
    edges_vertices_b[edgeIndex] = false;
    edge_walk.push(edgeIndex);
    vertex_walk.push(graph.edges_vertices[edgeIndex][0]);
    let nextVertex = graph.edges_vertices[edgeIndex][1];
    while (vertex_walk[0] !== nextVertex) {
      vertex_walk.push(nextVertex);
      edgeIndex = vertices_edges[nextVertex]
        .filter(v => edges_vertices_b[v])
        .shift();
      if (edgeIndex === undefined) { return { vertices: [], edges: [] }; }
      if (graph.edges_vertices[edgeIndex][0] === nextVertex) {
        [, nextVertex] = graph.edges_vertices[edgeIndex];
      } else {
        [nextVertex] = graph.edges_vertices[edgeIndex];
      }
      edges_vertices_b[edgeIndex] = false;
      edge_walk.push(edgeIndex);
    }
    return {
      vertices: vertex_walk,
      edges: edge_walk,
    };
  };
  const remove_non_boundary_edges = function (graph) {
    const remove_indices = graph.edges_assignment
      .map(a => !(a === "b" || a === "B"))
      .map((a, i) => (a ? i : undefined))
      .filter(a => a !== undefined);
    const edge_map = remove_geometry_key_indices(graph, "edges", remove_indices);
    const face = get_boundary(graph);
    graph.faces_edges = [face.edges];
    graph.faces_vertices = [face.vertices];
    remove_geometry_key_indices(graph, "vertices", get_isolated_vertices(graph));
  };
  const make_boundary = function (graph) {
    const edge_map = make_vertex_pair_to_edge_map(graph);
    const edge_walk = [];
    const vertex_walk = [];
    const walk = {
      vertices: vertex_walk,
      edges: edge_walk,
    };
    let largestX = -Infinity;
    let first_vertex_i = -1;
    graph.vertices_coords.forEach((v, i) => {
      if (v[0] > largestX) {
        largestX = v[0];
        first_vertex_i = i;
      }
    });
    if (first_vertex_i === -1) { return walk; }
    vertex_walk.push(first_vertex_i);
    const first_vc = graph.vertices_coords[first_vertex_i];
    const first_neighbors = graph.vertices_vertices[first_vertex_i];
    const counter_clock_first_i = first_neighbors
      .map(i => graph.vertices_coords[i])
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
      const next_neighbors = graph.vertices_vertices[this_vertex_i];
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
    bounding_rect: bounding_rect,
    get_boundary: get_boundary,
    remove_non_boundary_edges: remove_non_boundary_edges,
    make_boundary: make_boundary
  });

  const apply_matrix_to_graph = function (graph, matrix) {
    get_keys_with_ending(graph, "coords").forEach((key) => {
      graph[key] = graph[key]
        .map(v => math.core.multiply_matrix2_vector2(matrix, v));
    });
    get_keys_with_ending(graph, "matrix").forEach((key) => {
      graph[key] = graph[key]
        .map(m => math.core.multiply_matrices2(m, matrix));
    });
  };
  const transform_scale = function (graph, sx, sy) {
    if (typeof sx === "number" && sy === undefined) { sy = sx; }
    const matrix = math.core.make_matrix2_scale(sx, sy);
    apply_matrix_to_graph(graph, matrix);
  };
  const transform_translate = function (graph, dx, dy) {
    const matrix = math.core.make_matrix2_translate(dx, dy);
    apply_matrix_to_graph(graph, matrix);
  };
  const transform_matrix = function (graph, matrix) {
    apply_matrix_to_graph(graph, matrix);
  };

  var affine = /*#__PURE__*/Object.freeze({
    __proto__: null,
    transform_scale: transform_scale,
    transform_translate: transform_translate,
    transform_matrix: transform_matrix
  });

  const clone = function (o) {
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
  const recursive_freeze = function (input) {
    Object.freeze(input);
    if (input === undefined) {
      return input;
    }
    Object.getOwnPropertyNames(input).filter(prop => input[prop] !== null
      && (typeof input[prop] === "object" || typeof input[prop] === "function")
      && !Object.isFrozen(input[prop]))
      .forEach(prop => recursive_freeze(input[prop]));
    return input;
  };

  var object = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clone: clone,
    recursive_freeze: recursive_freeze
  });

  const Changed = function () {
    let isPaused = false;
    const changed = {};
    changed.update = function (...args) {
      if (isPaused) { return; }
      changed.handlers.forEach(f => f(...args));
    };
    changed.handlers = [];
    Object.defineProperty(changed, "pause", {
      get: () => isPaused,
      set: (pause) => {
        isPaused = pause;
        if (!isPaused) {
          changed.update();
        }
      }
    });
    return Object.freeze(changed);
  };

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
  };
  const setup_edge = function (e, i) {
    edge_coords.call(this, e, i);
  };
  const setup_face = function (f, i) {
    face_simple.call(this, f, i);
    face_coords.call(this, f, i);
  };
  const GraphProto = {};
  GraphProto.changed = Changed();
  GraphProto.load = function (object, options = {}) {
    if (typeof object !== "object") { return; }
    if (options.append !== true) {
      keys.forEach(key => delete this[key]);
    }
    Object.assign(this, { file_spec, file_creator }, clone(object));
    this.changed.update(this.load);
  };
  GraphProto.join = function (object, epsilon) {
    join(this, object, epsilon);
    this.changed.update(this.join);
  };
  GraphProto.clear = function () {
    fold_keys.graph.forEach(key => delete this[key]);
    fold_keys.orders.forEach(key => delete this[key]);
    this.changed.update(this.clear);
  };
  GraphProto.copy = function () {
    return Object.assign(Object.create(GraphProto), clone(this));
  };
  GraphProto.clean = function (options) {
    clean(this, options);
    this.changed.update(this.clean);
  };
  GraphProto.populate = function () {
    populate(this);
    this.changed.update(this.populate);
  };
  GraphProto.fragment = function (epsilon = math.core.EPSILON) {
    fragment(this, epsilon);
    this.changed.update(this.fragment);
  };
  GraphProto.rebuild = function (epsilon = math.core.EPSILON) {
    rebuild(this, epsilon);
    this.changed.update(this.rebuild);
  };
  GraphProto.translate = function (...args) {
    transform_translate(this, ...args);
    this.changed.update(this.translate);
  };
  GraphProto.scale = function (...args) {
    transform_scale(this, ...args);
    this.changed.update(this.scale);
  };
  const getVertices = function () {
    const transposed = transpose_graph_arrays(this, "vertices");
    const vertices = transposed.length !== 0
      ? transposed
      : Array.from(Array(implied_vertices_count(this))).map(() => ({}));
    vertices.forEach(setup_vertex.bind(this));
    return vertices;
  };
  const getEdges = function () {
    const edges = transpose_graph_arrays(this, "edges");
    edges.forEach(setup_edge.bind(this));
    return edges;
  };
  const getFaces = function () {
    const faces = transpose_graph_arrays(this, "faces");
    faces.forEach(setup_face.bind(this));
    return faces;
  };
  const getBounds = function () {
    return math.rect(...bounding_rect(this));
  };
  GraphProto.nearestVertex = function (...args) {
    const index = nearest_vertex(this, math.core.get_vector(...args));
    const result = transpose_graph_array_at_index(this, "vertices", index);
    setup_vertex.call(this, result, index);
    result.index = index;
    return result;
  };
  GraphProto.nearestEdge = function (...args) {
    const index = nearest_edge(this, math.core.get_vector(...args));
    const result = transpose_graph_array_at_index(this, "edges", index);
    setup_edge.call(this, result, index);
    result.index = index;
    return result;
  };
  GraphProto.nearestFace = function (...args) {
    const index = face_containing_point(this, math.core.get_vector(...args));
    if (index === undefined) { return undefined; }
    const result = transpose_graph_array_at_index(this, "faces", index);
    setup_face.call(this, result, index);
    result.index = index;
    return result;
  };
  GraphProto.nearest = function (...args) {
    const target = math.core.get_vector(...args);
    const nears = {
      vertex: this.nearestVertex(this, target),
      edge: this.nearestEdge(this, target),
      face: this.nearestFace(this, target)
    };
    Object.keys(nears)
      .filter(key => nears[key] == null)
      .forEach(key => delete nears[key]);
    return nears;
  };
  Object.defineProperty(GraphProto, "vertices", { get: getVertices });
  Object.defineProperty(GraphProto, "edges", { get: getEdges });
  Object.defineProperty(GraphProto, "faces", { get: getFaces });
  Object.defineProperty(GraphProto, "bounds", { get: getBounds });

  const apply_run_diff = function (graph, diff) {
    const lengths = {
      vertices: vertices_count$1(graph),
      edges: edges_count$1(graph),
      faces: faces_count$1(graph)
    };
    if (diff.new) {
      Object.keys(diff.new)
        .forEach(type => diff.new[type]
          .forEach((newElem, i) => Object.keys(newElem)
            .forEach((key) => {
              if (graph[key] === undefined) { graph[key] = []; }
              graph[key][lengths[type] + i] = newElem[key];
              diff.new[type][i].index = lengths[type] + i;
            })));
    }
    if (diff.update) {
      Object.keys(diff.update)
        .forEach(i => Object.keys(diff.update[i])
          .forEach((key) => {
            if (graph[key] === undefined) { graph[key] = []; }
            graph[key][i] = diff.update[i][key];
          }));
    }
    if (diff.remove) {
      if (diff.remove.faces) { remove_geometry_key_indices(graph, "faces", diff.remove.faces); }
      if (diff.remove.edges) { remove_geometry_key_indices(graph, "edges", diff.remove.edges); }
      if (diff.remove.vertices) { remove_geometry_key_indices(graph, "vertices", diff.remove.vertices); }
    }
    return diff;
  };
  const merge_run_diffs = function (graph, target, source) {
    const vertices_length = vertices_count$1(graph);
    const edges_length = edges_count$1(graph);
    const faces_length = faces_count$1(graph);
    let target_new_vertices_length = 0;
    let target_new_edges_length = 0;
    let target_new_faces_length = 0;
    if (target.new !== undefined) {
      if (target.new.vertices !== undefined) {
        target_new_vertices_length = target.new.vertices.length;
      }
      if (target.new.edges !== undefined) {
        target_new_edges_length = target.new.edges.length;
      }
      if (target.new.faces !== undefined) {
        target_new_faces_length = target.new.faces.length;
      }
    }
    const augment_map = {
      vertices: {
        length: vertices_length,
        change: target_new_vertices_length
      },
      edges: {
        length: edges_length,
        change: target_new_edges_length
      },
      faces: {
        length: faces_length,
        change: target_new_faces_length
      },
    };
    let all_source = [];
    if (source.new !== undefined) {
      Object.keys(source.new).forEach((category) => {
        source.new[category].forEach((newEl, i) => {
          ["vertices", "edges", "faces"].forEach((key) => {
            const suffix = `_${key}`;
            const suffixKeys = Object.keys(newEl)
              .map(str => (str.substring(str.length - suffix.length, str.length) === suffix
                ? str
                : undefined))
              .filter(str => str !== undefined);
            suffixKeys.forEach((suffixKey) => {
              source.new[category][i][suffixKey].forEach((n, j) => {
                if (source.new[category][i][suffixKey][j] >= augment_map[category].length) {
                  source.new[category][i][suffixKey][j] += augment_map[category].change;
                }
              });
            });
          });
        });
        all_source = all_source.concat(source.new.vertices);
      });
    }
    const merge = {};
    if (target.new !== undefined) { merge.new = target.new; }
    if (target.update !== undefined) { merge.update = target.update; }
    if (target.remove !== undefined) { merge.remove = target.remove; }
    if (source.new !== undefined) {
      if (source.new.vertices !== undefined) {
        if (merge.new.vertices === undefined) { merge.new.vertices = []; }
        merge.new.vertices = merge.new.vertices.concat(source.new.vertices);
      }
      if (source.new.edges !== undefined) {
        if (merge.new.edges === undefined) { merge.new.edges = []; }
        merge.new.edges = merge.new.edges.concat(source.new.edges);
      }
      if (source.new.faces !== undefined) {
        if (merge.new.faces === undefined) { merge.new.faces = []; }
        merge.new.faces = merge.new.faces.concat(source.new.faces);
      }
    }
    if (source.update !== undefined) {
      Object.keys(source.update).forEach((i) => {
        if (merge.update[i] == null) {
          merge.update[i] = source.update[i];
        }
        else {
          const keys1 = Object.keys(merge.update[i]);
          const keys2 = Object.keys(source.update[i]);
          const overlap = keys1.filter(key1key => keys2.includes(key1key));
          if (overlap.length > 0) {
            const str = overlap.join(", ");
            console.warn(`cannot merge. two diffs contain overlap at ${str}`);
            return;
          }
          Object.assign(merge.update[i], source.update[i]);
        }
      });
    }
    if (source.remove !== undefined) {
      if (source.remove.vertices !== undefined) {
        if (merge.remove.vertices === undefined) { merge.remove.vertices = []; }
        merge.remove.vertices = merge.remove.vertices.concat(source.remove.vertices);
      }
      if (source.remove.edges !== undefined) {
        if (merge.remove.edges === undefined) { merge.remove.edges = []; }
        merge.remove.edges = merge.remove.edges.concat(source.remove.edges);
      }
      if (source.remove.faces !== undefined) {
        if (merge.remove.faces === undefined) { merge.remove.faces = []; }
        merge.remove.faces = merge.remove.faces.concat(source.remove.faces);
      }
    }
    Object.assign(target, source);
  };

  const copy_properties = function (graph, geometry_prefix, index) {
    const prefixKeys = get_graph_keys_with_prefix(graph, geometry_prefix);
    const result = {};
    prefixKeys.forEach((key) => { result[key] = graph[key][index]; });
    return result;
  };
  const add_edge_options = () => ({
    edges_assignment: "U",
    edges_foldAngle: 0,
  });
  const add_edge = function (graph, a, b, c, d, options = add_edge_options()) {
    const edge = math.segment(a, b, c, d);
    const endpoints_vertex_equivalent = [0, 1].map(ei => graph.vertices_coords
      .map(v => Math.sqrt(((edge[ei][0] - v[0]) ** 2)
                        + ((edge[ei][1] - v[1]) ** 2)))
      .map((dist, i) => (dist < math.core.EPSILON ? i : undefined))
      .filter(el => el !== undefined)
      .shift());
    const edges = graph.edges_vertices
      .map(ev => ev.map(v => graph.vertices_coords[v]));
    const endpoints_edge_collinear = [0, 1].map(ei => edges
      .map(e => math.core.point_on_segment(e[0], e[1], edge[ei]))
      .map((on_edge, i) => (on_edge ? i : undefined))
      .filter(e => e !== undefined)
      .shift());
    const vertices_origin = [0, 1].map((i) => {
      if (endpoints_vertex_equivalent[i] !== undefined) { return "vertex"; }
      if (endpoints_edge_collinear[i] !== undefined) { return "edge"; }
      return "new";
    });
    const result = {
      new: {
        vertices: [],
        edges: [
          { edges_vertices: [] }
        ]
      },
      remove: { edges: [] }
    };
    let vertices_length = vertices_count$1(graph);
    const append_vertex = function (i) {
      result.new.vertices.push({
        vertices_coords: [edge[i][0], edge[i][1]]
      });
      vertices_length += 1;
      result.new.edges[0].edges_vertices[i] = vertices_length - 1;
    };
    [0, 1].forEach((i) => {
      switch (vertices_origin[i]) {
        case "vertex":
          result.new.edges[0].edges_vertices[i] = endpoints_vertex_equivalent[i];
          break;
        case "edge": {
          append_vertex(i);
          const e = copy_properties(graph, "edges", endpoints_edge_collinear[i]);
          [clone(e), clone(e)].forEach((o, j) => {
            o.edges_vertices = [
              graph.edges_vertices[endpoints_edge_collinear[i]][j],
              vertices_length - 1
            ];
            result.new.edges.push(o);
          });
          result.remove.edges.push(endpoints_edge_collinear[i]);
        }
          break;
        default: append_vertex(i); break;
      }
    });
    const option_keys = Object.keys(options);
    result.new.edges
      .forEach(e => option_keys
        .filter(key => e[key] === undefined)
        .forEach((key) => { e[key] = options[key]; }));
    return apply_run_diff(graph, result);
  };

  const crop = (graph, polygon) => {
    const vertices_edges = make_vertices_edges(graph);
    const vertices = graph.vertices_coords.map(vc => polygon.contains(vc));
    const crop_edges = Array.from(Array(graph.edges_vertices.length))
      .map(() => false);
    vertices
      .map((vert, i) => (vert ? undefined : i))
      .filter(a => a !== undefined)
      .forEach(i => vertices_edges[i]
        .forEach((edge) => { crop_edges[edge] = true; }));
    const remove_edges = crop_edges
      .map((a, i) => (a ? i : undefined))
      .filter(a => a !== undefined);
    remove_geometry_key_indices(graph, "edges", remove_edges);
  };

  const makeExistArray = (obj, key) => {
    if (obj[key] === undefined) { obj[key] = []; }
  };
  const makeCrease = (graph, a, b, c, d, options) => {
    ["vertices_coords",
      "edges_vertices",
      "edges_assignment"].forEach(key => makeExistArray(graph, key));
    const p = math.core.get_vector_of_vectors([a, b], [c, d]);
    if (p.length === 2) {
      graph.isClean = false;
      return add_edge(graph, p[0][0], p[0][1], p[1][0], p[1][1], options);
    }
    return undefined;
  };
  const CPProto = Object.create(GraphProto);
  let isClean = true;
  Object.defineProperty(CPProto, "isClean", {
    get: () => isClean,
    set: (c) => { isClean = c; },
    enumerable: false
  });
  ["circle", "ellipse", "rect", "polygon"].forEach((fName) => {
    CPProto[fName] = function () {
      const obj = math[fName](...arguments);
      if (!obj) { return; }
      const s = obj.segments();
      s.forEach(seg => this.mountain(
        seg[0][0],
        seg[0][1],
        seg[1][0],
        seg[1][1]
      ));
    };
  });
  ["line", "ray", "segment"].forEach((fName) => {
    CPProto[fName] = function () {
      if (!this.clip && (fName === "line" || fName === "ray")) {
        console.warn("line and ray are infinite and require a boundary to clip.");
        return;
      }
      const obj = math[fName](...arguments);
      if (!obj) { return; }
      const s = obj.segments();
      s.forEach(seg => this.mountain(
        seg[0][0],
        seg[0][1],
        seg[1][0],
        seg[1][1]
      ));
    };
  });
  CPProto.makeBoundary = function () {
    if (!this.isClean) { this.clean(); }
    const boundary = make_boundary(this);
    boundary.edges.forEach((edge) => {
      this.edges_assignment[edge] = "B";
      this.edges_foldAngle[edge] = 0;
    });
  };
  CPProto.clean = function (epsilon = math.core.EPSILON) {
    this.fragment(epsilon);
    this.populate();
    this.isClean = true;
  };
  CPProto.mountain = function (a, b, c, d) {
    const crease = makeCrease(this, a, b, c, d, {
      edges_assignment: "M",
      edges_foldAngle: -180
    });
    const that = this;
    return crease.new.edges.map((e) => {
      const res = transpose_graph_array_at_index(this, "edges", e.index);
      return new Proxy(res, {
        set: function set(target, property, value, receiver) {
          target[property] = value;
          that[`edges_${property}`][e.index] = value;
          return true;
        }
      });
    }).shift();
  };
  CPProto.valley = function (a, b, c, d) {
    const crease = makeCrease(this, a, b, c, d, {
      edges_assignment: "V",
      edges_foldAngle: 180
    });
    const that = this;
    return crease.new.edges.map((e) => {
      const res = transpose_graph_array_at_index(this, "edges", e.index);
      return new Proxy(res, {
        set: function set(target, property, value, receiver) {
          target[property] = value;
          that[`edges_${property}`][e.index] = value;
          return true;
        }
      });
    }).shift();
  };
  CPProto.mark = function (a, b, c, d) {
    return makeCrease(this, a, b, c, d, { edges_assignment: "F", edges_foldAngle: 0 });
  };
  CPProto.crop = function (polygon) {
    crop(this, polygon);
    this.isClean = false;
    this.clean();
  };

  var root = Object.assign(
    Object.create({
      __prototypes__: {
        graph: GraphProto,
        cp: CPProto,
      }
    })
  );

  const arrayOfType = function (array, type = "number") {
    let test = true;
    array.forEach((a) => {
      if (typeof a !== type) {
        test = false;
        return;
      }
    });
    return test;
  };
  const arrayOfArrayOfType = function (array, type = "number") {
    let test = true;
    array.forEach((arr) => {
      arr.forEach((a) => {
        if (typeof a !== type) {
          test = false;
          return;
        }
      });
    });
    return test;
  };
  const arrayOfArrayOfIsNotNaN = function (array) {
    return array
      .map(arr => arr
        .map(n => !isNaN(n))
        .reduce((a, b) => a && b, true))
      .reduce((a, b) => a && b, true);
  };
  const arrayOfArrayCompareFunc = function (array, func) {
    return array
      .map(arr => arr
        .map(n => func(n))
        .reduce((a, b) => a && b, true))
      .reduce((a, b) => a && b, true);
  };
  const Validate = {};
  Validate.vertices_coords = function ({ vertices_coords }) {
    return vertices_coords != null
      && arrayOfArrayOfType(vertices_coords, "number")
      && arrayOfArrayOfIsNotNaN(vertices_coords);
  };
  Validate.vertices_vertices = function ({ vertices_coords, vertices_vertices, edges_vertices }) {
    if (vertices_vertices == null) { return false; }
    const vert_vert_count = vertices_vertices.map(a => a.length).reduce((a, b) => a + b, 0);
    if (Math.abs(vert_vert_count * 1 - edges_vertices.length * 2) > 1) {
      console.warn("Validate.vertices_vertices, expected array length deviated by more than 1");
    }
    if (vertices_vertices != null) {
      if (vertices_vertices.length !== vertices_coords.length) { return false; }
      const vv_edge_test = vertices_vertices
        .map((vv, i) => vv.map(v2 => [i, v2]))
        .reduce((a, b) => a.concat(b), []);
      return vv_edge_test
        .map(ve => edges_vertices.filter(e => (ve[0] === e[0]
          && ve[1] === e[1]) || (ve[0] === e[1] && ve[1] === e[0])).length > 0)
        .map((b, i) => ({ test: b, i }))
        .filter(el => !el.test)
        .length === 0;
    }
    return false;
  };
  Validate.vertices_faces = function ({ vertices_faces, faces_vertices }) {
    return faces_vertices != null
      && vertices_faces != null
      && vertices_faces
        .map((vert, i) => vert
          .map(vf => ({
            test: faces_vertices[vf].indexOf(i) !== -1,
            face: vf,
            i
          }))
          .filter(el => !el.test))
        .reduce((a, b) => a.concat(b), [])
        .length === 0;
  };
  Validate.edges_vertices = function ({ vertices_coords, edges_vertices }) {
    if (vertices_coords == null) { return true; }
    const vert_size = vertices_coords.length;
    return edges_vertices != null
      && arrayOfArrayOfType(edges_vertices, "number")
      && arrayOfArrayOfIsNotNaN(edges_vertices)
      && arrayOfArrayCompareFunc(edges_vertices, n => n < vert_size);
  };
  Validate.edges_faces = function ({ edges_faces, faces_edges }) {
    return false;
  };
  Validate.faces_faces = function (graph) {
    return false;
  };
  Validate.vertices_edges = function (graph) {
    return false;
  };
  Validate.edges_assignment = function ({ edges_vertices, edges_assignment }) {
    return edges_vertices != null
      && edges_assignment != null
      && edges_assignment.length === edges_vertices.length
      && edges_assignment
        .filter(v => edges_assignment_values.includes(v))
        .reduce((a, b) => a && b, true);
  };
  Validate.edges_foldAngle = function (graph) {
    return false;
  };
  Validate.edges_length = function (graph) {
    return false;
  };
  Validate.faces_vertices = function ({ vertices_faces, faces_vertices }) {
    if (vertices_faces != null) {
      return faces_vertices
        .map((face, i) => face
          .map(vf => ({
            test: vertices_faces[vf].indexOf(i) !== -1,
            face: vf,
            i
          }))
          .filter(el => !el.test))
        .reduce((a, b) => a.concat(b), [])
        .length === 0;
    }
    return false;
  };
  Validate.faces_edges = function (graph) {
    return false;
  };
  const possibleFoldObject = function (input) {
    if (typeof input !== "object" || input === null) { return 0; }
    const inputKeys = Object.keys(input);
    if (inputKeys.length === 0) { return 0; }
    return inputKeys.map(key => keys.includes(key))
      .reduce((a, b) => a + (b ? 1 : 0), 0) / inputKeys.length;
  };
  const validate_first = function (graph) {
    const prefix_suffix = {
      vertices: ["coords", "vertices", "faces"],
      edges: ["vertices", "faces", "assignment", "foldAngle", "length"],
      faces: ["vertices", "edges"],
    };
    ["vertices_coords", "vertices_vertices", "vertices_faces",
      "edges_vertices", "edges_faces",
      "faces_vertices", "faces_edges"].filter(a => a in graph).forEach((key) => {
      if (graph[key]
        .map(a => a.filter(b => b == null).length > 0)
        .reduce((a, b) => a || b, false)) {
        throw new Error(`${key} contains a null`);
      }
    });
    ["edges_assignment", "edges_foldAngle", "edges_length"].filter(a => a in graph).forEach((key) => {
      if (graph[key].filter(a => a == null).length > 0) {
        throw new Error(`${key} contains a null`);
      }
    });
    const arraysLengthTest = Object.keys(prefix_suffix)
      .map(key => ({ prefix: key, suffixes: prefix_suffix[key] }))
      .map(el => el.suffixes
        .map(suffix => `${el.prefix}_${suffix}`)
        .filter(key => graph[key] != null)
        .map((key, _, arr) => graph[key].length === graph[arr[0]].length)
        .reduce((a, b) => a && b, true))
      .reduce((a, b) => a && b, true);
    if (!arraysLengthTest) {
      throw new Error("validate failed: arrays with common keys have mismatching lengths");
    }
    const l = {
      vertices: graph.vertices_coords.length,
      edges: graph.edges_vertices.length,
      faces: graph.faces_vertices.length || graph.faces_edges.length
    };
    const arraysIndexTest = Object.keys(prefix_suffix)
      .map(key => ({ prefix: key, suffixes: prefix_suffix[key] }))
      .map(el => el.suffixes
        .map(suffix => ({ key: `${el.prefix}_${suffix}`, suffix }))
        .filter(ell => graph[ell.key] != null && l[ell.suffix] != null)
        .map(ell => ({
          key: ell.key,
          test: graph[ell.key]
            .reduce((prev, curr) => curr
              .reduce((a, b) => a && (b < l[ell.suffix]), true), true)
        })))
      .reduce((a, b) => a.concat(b), []);
    arraysIndexTest
      .filter(el => !el.test)
      .forEach((el) => {
        console.log(graph);
        throw new Error(`${el.key} contains a index too large, larger than the reference array to which it points`);
      });
    if ("vertices_vertices" in graph) {
      const vv_edge_test = graph.vertices_vertices
        .map((vv, i) => vv.map(v2 => [i, v2]))
        .reduce((a, b) => a.concat(b), []);
      const ev_test_fails = vv_edge_test
        .map(ve => graph.edges_vertices.filter(e => (ve[0] === e[0]
          && ve[1] === e[1]) || (ve[0] === e[1] && ve[1] === e[0])).length > 0)
        .map((b, i) => ({ test: b, i }))
        .filter(el => !el.test);
      if (ev_test_fails.length > 0) {
        throw new Error(`vertices_vertices at index ${ev_test_fails[0].i} declares an edge that doesn't exist in edges_vertices`);
      }
    }
    if ("vertices_faces" in graph) {
      const v_f_test = graph.vertices_faces
        .map((vert, i) => vert
          .map(vf => ({
            test: graph.faces_vertices[vf].indexOf(i) !== -1,
            face: vf,
            i
          }))
          .filter(el => !el.test))
        .reduce((a, b) => a.concat(b), []);
      if (v_f_test.length > 0) {
        throw new Error(`vertex ${v_f_test[0].i} in vertices_faces connects to face ${v_f_test[0].face}, whereas in faces_vertices this same connection in reverse doesn't exist.`);
      }
    }
    if ("edges_faces" in graph) {
      const e_f_test = graph.edges_faces
        .map((edge, i) => edge
          .map(ef => ({
            test: graph.faces_edges[ef].indexOf(i) !== -1,
            face: ef,
            i
          }))
          .filter(el => !el.test))
        .reduce((a, b) => a.concat(b), []);
      if (e_f_test.length > 0) {
        throw new Error(`edges_faces ${e_f_test[0].i} connects to face ${e_f_test[0].face}, whereas in faces_edges this same connection in reverse doesn't exist.`);
      }
    }
    if ("faces_vertices" in graph && "vertices_faces" in graph) {
      const f_v_test = graph.faces_vertices
        .map((face, i) => face
          .map(vf => ({
            test: graph.vertices_faces[vf].indexOf(i) !== -1,
            face: vf,
            i
          }))
          .filter(el => !el.test))
        .reduce((a, b) => a.concat(b), []);
    }
    return true;
  };

  var validate = /*#__PURE__*/Object.freeze({
    __proto__: null,
    arrayOfType: arrayOfType,
    arrayOfArrayOfType: arrayOfArrayOfType,
    possibleFoldObject: possibleFoldObject,
    'default': Validate,
    validate_first: validate_first
  });

  const possibleFileName = function (string) {
    return string.length < 128 && string.indexOf(".") !== -1;
  };
  const possibleSVG = function (xml) {
    return xml.tagName === "svg"
      || xml.getElementsByTagName("svg").length > 0;
  };
  const possibleORIPA = function (xml) {
    const objects = xml.getElementsByTagName("object");
    if (objects.length > 0) {
      return Array.from(objects)
        .filter(o => o.className === "oripa.DataSet").length > 0;
    }
    return false;
  };
  const supported = {
    SVG: "svg",
    Svg: "svg",
    svg: "svg",
    FOLD: "fold",
    Fold: "fold",
    fold: "fold",
    ORIPA: "oripa",
    Oripa: "oripa",
    oripa: "oripa",
    ".SVG": "svg",
    ".Svg": "svg",
    ".svg": "svg",
    ".FOLD": "fold",
    ".Fold": "fold",
    ".fold": "fold",
    ".ORIPA": "oripa",
    ".Oripa": "oripa",
    ".oripa": "oripa"
  };
  const load = function (...args) {
    if (args.length <= 0) {
      throw new Error("convert(), load(), missing a file as a parameter");
    }
    const data = args[0];
    let filetype;
    if (args.length >= 2 && typeof args[1] === "string") {
      filetype = supported[args[1]];
      if (filetype === undefined) {
        throw new Error(`expected a file type (like 'svg'), ${args[1]} is unsupported`);
      }
    }
    if (filetype !== undefined) {
      if (typeof data === "string") {
        switch (filetype) {
          case "fold": return { data: JSON.parse(data), type: filetype };
          case "svg":
          case "oripa": return {
            data: (new win.DOMParser())
              .parseFromString(data, "text/xml").documentElement,
            type: filetype
          };
          default: return { data, type: filetype };
        }
      } else {
        return { data, type: filetype };
      }
    }
    const datatype = typeof data;
    if (datatype === "string") {
      try {
        const fold = JSON.parse(data);
        if (possibleFoldObject(fold) > 0) {
          return { data: fold, type: "fold" };
        }
      } catch (err) {
        const xml = (new win.DOMParser())
          .parseFromString(data, "text/xml").documentElement;
        if (xml.getElementsByTagName("parsererror").length > 0) {
          if (possibleFileName(data)) {
            throw new Error("did you provide a file name? please load the file first and pass in the data.");
          } else {
            throw new Error("unable to load file. tried XML, JSON");
          }
        } else {
          if (possibleSVG(xml)) { return { data: xml, type: "svg" }; }
          if (possibleORIPA(xml)) { return { data: xml, type: "oripa" }; }
          return undefined;
        }
      }
      return undefined;
    }
    if (datatype === "object") {
      try {
        const fold = JSON.parse(JSON.stringify(data));
        return { data: fold, type: "fold" };
      } catch (err) {
        if (typeof data.getElementsByTagName === "function") {
          if (possibleSVG(data)) { return { data, type: "svg" }; }
          if (possibleORIPA(data)) { return { data, type: "oripa" }; }
          return undefined;
        }
        return undefined;
      }
    }
    return undefined;
  };

  const coords = "coords";
  const vertices = "vertices";
  const edges = "edges";
  const faces = "faces";
  const boundaries = "boundaries";
  const frame = "frame";
  const file = "file";
  const vertices_coords = `${vertices}_${coords}`;
  const edges_vertices = `${edges}_${vertices}`;
  const faces_vertices = `${faces}_${vertices}`;
  const faces_edges = `${faces}_${edges}`;
  const edges_assignment = `${edges}_assignment`;
  const faces_re_coloring = `${faces}_re:coloring`;
  const faces_re_matrix = `${faces}_re:matrix`;
  const faces_re_layer = `${faces}_re:layer`;
  const frame_parent = `${frame}_parent`;
  const frame_inherit = `${frame}_inherit`;
  const frame_classes$1 = `${frame}_classes`;
  const file_frames = `${file}_frames`;
  const file_classes$1 = `${file}_classes`;
  const boundary$1 = "boundary";
  const mountain = "mountain";
  const valley = "valley";
  const mark = "mark";
  const unassigned = "unassigned";
  const creasePattern = "creasePattern";
  const front = "front";
  const back = "back";
  const _class = "class";
  const index = "index";
  const object$1 = "object";
  const string = "string";
  const _function = "function";
  const _undefined = "undefined";
  const black = "black";
  const white = "white";
  const lightgray = "lightgray";
  const stroke_width = "stroke-width";
  const createElementNS = "createElementNS";
  const setAttributeNS = "setAttributeNS";
  const appendChild = "appendChild";
  const isBrowser$1 = typeof window !== _undefined
    && typeof window.document !== _undefined;
  const isNode$1 = typeof process !== _undefined
    && process.versions != null
    && process.versions.node != null;
  const htmlString$1 = "<!DOCTYPE html><title>.</title>";
  const win$1 = (function () {
    let w = {};
    if (isNode$1) {
      const { DOMParser, XMLSerializer } = require("xmldom");
      w.DOMParser = DOMParser;
      w.XMLSerializer = XMLSerializer;
      w.document = new DOMParser().parseFromString(htmlString$1, "text/html");
    } else if (isBrowser$1) {
      w = window;
    }
    return w;
  }());
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = function () {
    const svgImage = win$1.document[createElementNS](svgNS, "svg");
    svgImage.setAttribute("version", "1.1");
    svgImage.setAttribute("xmlns", svgNS);
    return svgImage;
  };
  const group = function (parent) {
    const g = win$1.document[createElementNS](svgNS, "g");
    if (parent) { parent[appendChild](g); }
    return g;
  };
  const defs = function (parent) {
    const defs = win$1.document[createElementNS](svgNS, "defs");
    if (parent) { parent[appendChild](defs); }
    return defs;
  };
  const style = function (parent) {
    const s = win$1.document[createElementNS](svgNS, "style");
    s[setAttributeNS](null, "type", "text/css");
    if (parent) { parent[appendChild](s); }
    return s;
  };
  const setViewBox = function (svg, x, y, width, height, padding = 0) {
    const scale = 1.0;
    const d = (width / scale) - width;
    const X = (x - d) - padding;
    const Y = (y - d) - padding;
    const W = (width + d * 2) + padding * 2;
    const H = (height + d * 2) + padding * 2;
    const viewBoxString = [X, Y, W, H].join(" ");
    svg[setAttributeNS](null, "viewBox", viewBoxString);
  };
  const line$1 = function (x1, y1, x2, y2) {
    const shape = win$1.document[createElementNS](svgNS, "line");
    shape[setAttributeNS](null, "x1", x1);
    shape[setAttributeNS](null, "y1", y1);
    shape[setAttributeNS](null, "x2", x2);
    shape[setAttributeNS](null, "y2", y2);
    return shape;
  };
  const circle$1 = function (x, y, radius) {
    const shape = win$1.document[createElementNS](svgNS, "circle");
    shape[setAttributeNS](null, "cx", x);
    shape[setAttributeNS](null, "cy", y);
    shape[setAttributeNS](null, "r", radius);
    return shape;
  };
  const polygon$1 = function (pointsArray) {
    const shape = win$1.document[createElementNS](svgNS, "polygon");
    const pointsString = pointsArray.map(p => `${p[0]},${p[1]}`).join(" ");
    shape[setAttributeNS](null, "points", pointsString);
    return shape;
  };
  const path = function (d) {
    const p = win$1.document[createElementNS](svgNS, "path");
    p[setAttributeNS](null, "d", d);
    return p;
  };
  const vertices_circle = function (graph, options) {
    if (vertices_coords in graph === false) {
      return [];
    }
    const radius = options && options.radius ? options.radius : 0.01;
    const svg_vertices = graph[vertices_coords]
      .map(v => circle$1(v[0], v[1], radius));
    svg_vertices.forEach((c, i) => c[setAttributeNS](null, index, i));
    return svg_vertices;
  };
  const edges_assignment_names$1 = {
    B: boundary$1,
    b: boundary$1,
    M: mountain,
    m: mountain,
    V: valley,
    v: valley,
    F: mark,
    f: mark,
    U: unassigned,
    u: unassigned
  };
  const edges_assignment_to_lowercase = {
    B: "b",
    b: "b",
    M: "m",
    m: "m",
    V: "v",
    v: "v",
    F: "f",
    f: "f",
    U: "u",
    u: "u",
  };
  const edges_coords = function ({ vertices_coords, edges_vertices }) {
    if (edges_vertices == null || vertices_coords == null) {
      return [];
    }
    return edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
  };
  const edges_indices_classes = function (graph) {
    const assignment_indices = { u:[], f:[], v:[], m:[], b:[] };
    graph[edges_assignment].map(a => edges_assignment_to_lowercase[a])
      .forEach((a, i) => assignment_indices[a].push(i));
    return assignment_indices;
  };
  const make_edges_assignment_names = function (graph) {
    return (graph[edges_vertices] == null || graph[edges_assignment] == null
      || graph[edges_vertices].length !== graph[edges_assignment].length
      ? []
      : graph[edges_assignment].map(a => edges_assignment_names$1[a]));
  };
  const segment_to_path = function (s) {
    return `M${s[0][0]} ${s[0][1]}L${s[1][0]} ${s[1][1]}`;
  };
  const edges_path_data = function (graph) {
    const path_data = edges_coords(graph).map(segment => segment_to_path(segment)).join("");
    return path_data === "" ? undefined : path_data;
  };
  const edges_by_assignment_paths_data = function (graph) {
    if (graph[edges_vertices] == null
      || graph[vertices_coords] == null
      || graph[edges_assignment] == null) {
      return [];
    }
    const segments = edges_coords(graph);
    const assignment_sorted_edges = edges_indices_classes(graph);
    const paths = Object.keys(assignment_sorted_edges)
      .map(assignment => assignment_sorted_edges[assignment].map(i => segments[i]))
      .map(segments => segments.map(segment => segment_to_path(segment)).join(""));
    const result = {};
    Object.keys(assignment_sorted_edges).map((key, i) => {
      if (paths[i] !== "") {
        result[key] = paths[i];
      }
    });
    return result;
  };
  const edges_path = function (graph) {
    if (graph[edges_assignment] == null) {
      const d = edges_path_data(graph);
      return d === undefined ? [] : [path(d)];
    }
    const ds = edges_by_assignment_paths_data(graph);
    return Object.keys(ds).map(assignment => {
      const p = path(ds[assignment]);
      p[setAttributeNS](null, _class, edges_assignment_names$1[assignment]);
      return p;
    });
  };
  const edges_line = function (graph) {
    const lines = edges_coords(graph).map(e => line$1(e[0][0], e[0][1], e[1][0], e[1][1]));
    lines.forEach((l, i) => l[setAttributeNS](null, index, i));
    make_edges_assignment_names(graph)
      .forEach((a, i) => lines[i][setAttributeNS](null, _class, a));
    return lines;
  };
  const make_vertices_edges$1 = function ({ edges_vertices }) {
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
  const make_faces_faces$1 = function ({ faces_vertices }) {
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
  const make_vertex_pair_to_edge_map$1 = function ({ edges_vertices }) {
    if (!edges_vertices) { return {}; }
    const map = {};
    edges_vertices
      .map(ev => ev.sort((a, b) => a - b).join(" "))
      .forEach((key, i) => { map[key] = i; });
    return map;
  };
  const make_face_walk_tree$1 = function (graph, root_face = 0) {
    const edge_map = make_vertex_pair_to_edge_map$1(graph);
    const new_faces_faces = make_faces_faces$1(graph);
    if (new_faces_faces.length <= 0) {
      return [];
    }
    let visited = [root_face];
    const list = [[{
      face: root_face,
      parent: undefined,
      edge: undefined,
      level: 0,
    }]];
    do {
      list[list.length] = list[list.length - 1].map((current) => {
        const unique_faces = new_faces_faces[current.face]
          .filter(f => visited.indexOf(f) === -1);
        visited = visited.concat(unique_faces);
        return unique_faces.map((f) => {
          const edge_vertices = graph.faces_vertices[f]
            .filter(v => graph.faces_vertices[current.face].indexOf(v) !== -1)
            .sort((a, b) => a - b);
          const edge = edge_map[edge_vertices.join(" ")];
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
  const make_faces_coloring_from_faces_matrix$1 = function (faces_matrix) {
    return faces_matrix
      .map(m => m[0] * m[3] - m[1] * m[2])
      .map(c => c >= 0);
  };
  const make_faces_coloring$1 = function (graph, root_face = 0) {
    const coloring = [];
    coloring[root_face] = true;
    make_face_walk_tree$1(graph, root_face)
      .forEach((level, i) => level
        .forEach((entry) => { coloring[entry.face] = (i % 2 === 0); }));
    return coloring;
  };
  const faces_sorted_by_layer = function (faces_layer) {
    return faces_layer.map((layer, i) => ({ layer, i }))
      .sort((a, b) => a.layer - b.layer)
      .map(el => el.i);
  };
  const make_faces_sidedness = function (graph) {
    let coloring = graph[faces_re_coloring];
    if (coloring == null) {
      coloring = (faces_re_matrix in graph)
        ? make_faces_coloring_from_faces_matrix$1(graph[faces_re_matrix])
        : make_faces_coloring$1(graph, 0);
    }
    return coloring.map(c => (c ? front : back));
  };
  const finalize_faces = function (graph, svg_faces) {
    const isFoldedForm = typeof graph.frame_classes === object$1
      && graph.frame_classes !== null
      && !(graph.frame_classes.includes(creasePattern));
    const orderIsCertain = graph[faces_re_layer] != null
      && graph[faces_re_layer].length === graph[faces_vertices].length;
    if (orderIsCertain && isFoldedForm) {
      make_faces_sidedness(graph)
        .forEach((side, i) => svg_faces[i][setAttributeNS](null, _class, side));
    }
    return (orderIsCertain
      ? faces_sorted_by_layer(graph[faces_re_layer]).map(i => svg_faces[i])
      : svg_faces);
  };
  const faces_vertices_polygon = function (graph) {
    if (faces_vertices in graph === false
      || vertices_coords in graph === false) {
      return [];
    }
    const svg_faces = graph[faces_vertices]
      .map(fv => fv.map(v => graph[vertices_coords][v]))
      .map(face => polygon$1(face));
    svg_faces.forEach((face, i) => face[setAttributeNS](null, index, i));
    return finalize_faces(graph, svg_faces);
  };
  const faces_edges_polygon = function (graph) {
    if (faces_edges in graph === false
      || edges_vertices in graph === false
      || vertices_coords in graph === false) {
      return [];
    }
    const svg_faces = graph[faces_edges]
      .map(face_edges => face_edges
        .map(edge => graph[edges_vertices][edge])
        .map((vi, i, arr) => {
          const next = arr[(i + 1) % arr.length];
          return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
        }).map(v => graph[vertices_coords][v]))
      .map(face => polygon$1(face));
    svg_faces.forEach((face, i) => face[setAttributeNS](null, index, i));
    return finalize_faces(graph, svg_faces);
  };
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
  const bounding_rect$1 = function (graph) {
    if (graph[vertices_coords] == null
      || graph[vertices_coords].length <= 0) {
      return [0, 0, 0, 0];
    }
    const dimension = graph[vertices_coords][0].length;
    const min = Array(dimension).fill(Infinity);
    const max = Array(dimension).fill(-Infinity);
    graph[vertices_coords].forEach(v => v.forEach((n, i) => {
      if (n < min[i]) { min[i] = n; }
      if (n > max[i]) { max[i] = n; }
    }));
    return (isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1])
      ? [0, 0, 0, 0]
      : [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
  };
  const get_boundary$1 = function (graph) {
    if (graph[edges_assignment] == null) { return { vertices: [], edges: [] }; }
    const edges_vertices_b = graph[edges_assignment]
      .map(a => a === "B" || a === "b");
    const vertices_edges = make_vertices_edges$1(graph);
    const edge_walk = [];
    const vertex_walk = [];
    let edgeIndex = -1;
    for (let i = 0; i < edges_vertices_b.length; i += 1) {
      if (edges_vertices_b[i]) { edgeIndex = i; break; }
    }
    if (edgeIndex === -1) {
      return { vertices: [], edges: [] };
    }
    edges_vertices_b[edgeIndex] = false;
    edge_walk.push(edgeIndex);
    vertex_walk.push(graph[edges_vertices][edgeIndex][0]);
    let nextVertex = graph[edges_vertices][edgeIndex][1];
    while (vertex_walk[0] !== nextVertex) {
      vertex_walk.push(nextVertex);
      edgeIndex = vertices_edges[nextVertex]
        .filter(v => edges_vertices_b[v])
        .shift();
      if (edgeIndex === undefined) { return { vertices: [], edges: [] }; }
      if (graph[edges_vertices][edgeIndex][0] === nextVertex) {
        [, nextVertex] = graph[edges_vertices][edgeIndex];
      } else {
        [nextVertex] = graph[edges_vertices][edgeIndex];
      }
      edges_vertices_b[edgeIndex] = false;
      edge_walk.push(edgeIndex);
    }
    return {
      vertices: vertex_walk,
      edges: edge_walk,
    };
  };
  const clone$1 = function (o) {
    let newO;
    let i;
    if (typeof o !== object$1) {
      return o;
    }
    if (!o) {
      return o;
    }
    if (Object.prototype.toString.apply(o) === "[object Array]") {
      newO = [];
      for (i = 0; i < o.length; i += 1) {
        newO[i] = clone$1(o[i]);
      }
      return newO;
    }
    newO = {};
    for (i in o) {
      if (o.hasOwnProperty(i)) {
        newO[i] = clone$1(o[i]);
      }
    }
    return newO;
  };
  const recursive_freeze$1 = function (input) {
    Object.freeze(input);
    if (input === undefined) {
      return input;
    }
    Object.getOwnPropertyNames(input).filter(prop => input[prop] !== null
      && (typeof input[prop] === object$1 || typeof input[prop] === _function)
      && !Object.isFrozen(input[prop]))
      .forEach(prop => recursive_freeze$1(input[prop]));
    return input;
  };
  const flatten_frame = function (fold_file, frame_num) {
    if (file_frames in fold_file === false
      || fold_file[file_frames].length < frame_num) {
      return fold_file;
    }
    const dontCopy = [frame_parent, frame_inherit];
    const memo = { visited_frames: [] };
    const recurse = function (recurse_fold, frame, orderArray) {
      if (memo.visited_frames.indexOf(frame) !== -1) {
        throw new Error("flatten error:cycle");
      }
      memo.visited_frames.push(frame);
      orderArray = [frame].concat(orderArray);
      if (frame === 0) { return orderArray; }
      if (recurse_fold[file_frames][frame - 1].frame_inherit
         && recurse_fold[file_frames][frame - 1].frame_parent != null) {
        return recurse(recurse_fold, recurse_fold[file_frames][frame - 1].frame_parent, orderArray);
      }
      return orderArray;
    };
    return recurse(fold_file, frame_num, []).map((frame) => {
      if (frame === 0) {
        const swap = fold_file[file_frames];
        fold_file[file_frames] = null;
        const copy = clone$1(fold_file);
        fold_file[file_frames] = swap;
        delete copy[file_frames];
        dontCopy.forEach(key => delete copy[key]);
        return copy;
      }
      const outerCopy = clone$1(fold_file[file_frames][frame - 1]);
      dontCopy.forEach(key => delete outerCopy[key]);
      return outerCopy;
    }).reduce((prev, curr) => Object.assign(prev, curr), {});
  };
  const all_classes = function (graph) {
    const file_classes$1$1 = (graph[file_classes$1] != null
      ? graph[file_classes$1] : []).join(" ");
    const frame_classes$1$1 = (graph[frame_classes$1] != null
      ? graph[frame_classes$1] : []).join(" ");
    return [file_classes$1$1, frame_classes$1$1]
      .filter(s => s !== "")
      .join(" ");
  };
  const { document } = win$1;
  const shadow_defaults = Object.freeze({
    blur: 0.005,
    opacity: 0.3,
    color: black,
  });
  const result = "result";
  const _in = "in";
  const blur = "blur";
  const offsetColor = "offsetColor";
  const offsetBlur = "offsetBlur";
  const feMergeNode = "feMergeNode";
  const two_hundred = "200%";
  const shadowFilter = function (options = shadow_defaults) {
    const id_name = "shadow";
    if (typeof options !== object$1 || options === null) { options = {}; }
    Object.keys(shadow_defaults)
      .filter(key => !(key in options))
      .forEach((key) => { options[key] = shadow_defaults[key]; });
    const filter = document[createElementNS](svgNS, "filter");
    filter[setAttributeNS](null, "width", two_hundred);
    filter[setAttributeNS](null, "height", two_hundred);
    filter[setAttributeNS](null, "id", id_name);
    const gaussian = document[createElementNS](svgNS, "feGaussianBlur");
    gaussian[setAttributeNS](null, _in, "SourceAlpha");
    gaussian[setAttributeNS](null, "stdDeviation", options.blur);
    gaussian[setAttributeNS](null, result, blur);
    const offset = document[createElementNS](svgNS, "feOffset");
    offset[setAttributeNS](null, _in, blur);
    offset[setAttributeNS](null, result, offsetBlur);
    const flood = document[createElementNS](svgNS, "feFlood");
    flood[setAttributeNS](null, "flood-color", options.color);
    flood[setAttributeNS](null, "flood-opacity", options.opacity);
    flood[setAttributeNS](null, result, offsetColor);
    const composite = document[createElementNS](svgNS, "feComposite");
    composite[setAttributeNS](null, _in, offsetColor);
    composite[setAttributeNS](null, "in2", offsetBlur);
    composite[setAttributeNS](null, "operator", _in);
    composite[setAttributeNS](null, result, offsetBlur);
    const merge = document[createElementNS](svgNS, "feMerge");
    const mergeNode1 = document[createElementNS](svgNS, feMergeNode);
    const mergeNode2 = document[createElementNS](svgNS, feMergeNode);
    mergeNode2[setAttributeNS](null, _in, "SourceGraphic");
    merge[appendChild](mergeNode1);
    merge[appendChild](mergeNode2);
    filter[appendChild](gaussian);
    filter[appendChild](offset);
    filter[appendChild](flood);
    filter[appendChild](composite);
    filter[appendChild](merge);
    return filter;
  };
  const none = "none";
  const five_hundred_px = "500px";
  var Options = (vmin = 1) => recursive_freeze$1({
    input: string,
    output: string,
    padding: null,
    file_frame: null,
    stylesheet: null,
    shadows: null,
    boundaries: true,
    faces: true,
    edges: true,
    vertices: false,
    attributes: {
      svg: {
        width: five_hundred_px,
        height: five_hundred_px,
        stroke: black,
        fill: none,
        "stroke-linejoin": "bevel",
        "stroke-width": vmin / 200,
      },
      boundaries: {
        fill: white,
      },
      faces: {
        stroke: none,
        front: { stroke: black, fill: lightgray },
        back: { stroke: black, fill: white },
      },
      edges: {
        boundary: {},
        mountain: { stroke: "red" },
        valley: { stroke: "blue" },
        mark: { stroke: lightgray },
        unassigned: { stroke: lightgray },
      },
      vertices: {
        stroke: none,
        fill: black,
        r: vmin / 200
      }
    }
  });
  const recursive_fill = function (target, source) {
    Object.keys(source).forEach((key) => {
      if (typeof source[key] === object$1 && source[key] !== null) {
        if (!(key in target)) { target[key] = {}; }
        recursive_fill(target[key], source[key]);
      } else if (typeof target === object$1 && !(key in target)) {
        target[key] = source[key];
      }
    });
  };
  const boundaries_polygon = function (graph) {
    if (vertices_coords in graph === false
      || edges_vertices in graph === false
      || edges_assignment in graph === false) {
      return [];
    }
    const boundary$1$1 = get_boundary$1(graph)
      .vertices
      .map(v => graph[vertices_coords][v]);
    if (boundary$1$1.length === 0) { return []; }
    const p = polygon$1(boundary$1$1);
    p[setAttributeNS](null, _class, boundary$1);
    return [p];
  };
  const faces_draw_function = function (graph) {
    return graph[faces_vertices] != null
      ? faces_vertices_polygon(graph)
      : faces_edges_polygon(graph);
  };
  const component_draw_function = {
    vertices: vertices_circle,
    edges: edges_path,
    faces: faces_draw_function,
    boundaries: boundaries_polygon
  };
  const fold_to_svg = function (input, options = {}) {
    const graph = (typeof options.file_frame === "number"
      ? flatten_frame(input, options.file_frame)
      : input);
    const bounds = bounding_rect$1(graph);
    const vmin = Math.min(bounds[2], bounds[3]);
    recursive_fill(options, Options(vmin));
    const svg$1 = svg();
    setViewBox(svg$1, ...bounds, options.padding);
    const classValue = all_classes(graph);
    if (classValue !== "") { svg$1[setAttributeNS](null, _class, classValue); }
    Object.keys(options.attributes.svg)
      .forEach(style => svg$1[setAttributeNS](null, style, options.attributes.svg[style]));
    const defs$1 = (options.stylesheet != null || options.shadows != null
      ? defs(svg$1)
      : undefined);
    if (options.stylesheet != null) {
      const style$1 = style(defs$1);
      const strokeVar = options.attributes.svg[stroke_width]
        ? options.attributes.svg[stroke_width] : vmin / 200;
      const cdata = (new win$1.DOMParser())
        .parseFromString("<xml></xml>", "application/xml")
        .createCDATASection(`\n* { --${stroke_width}: ${strokeVar}; }\n${options.stylesheet}`);
      style$1[appendChild](cdata);
    }
    if (options.shadows != null) {
      const shadowOptions = (typeof options.shadows === object$1 && options.shadows !== null
        ? options.shadows
        : { blur: vmin / 200 });
      defs$1[appendChild](shadowFilter(shadowOptions));
    }
    const groups = { };
    [boundaries, edges, faces, vertices].filter(key => options[key] === true)
      .forEach((key) => {
        groups[key] = group();
        groups[key][setAttributeNS](null, _class, key);
      });
    Object.keys(groups)
      .filter(key => component_draw_function[key] !== undefined)
      .forEach(key => component_draw_function[key](graph, options)
        .forEach(a => groups[key][appendChild](a)));
    Object.keys(groups)
      .filter(key => groups[key].childNodes.length > 0)
      .forEach(key => svg$1[appendChild](groups[key]));
    if (groups.edges) {
      const edgeClasses = [unassigned, mark, valley, mountain, boundary$1];
      Object.keys(options.attributes.edges)
        .filter(key => !edgeClasses.includes(key))
        .forEach(key => groups.edges[setAttributeNS](null, key, options.attributes.edges[key]));
      Array.from(groups.edges.childNodes)
        .forEach(child => Object.keys(options.attributes.edges[child.getAttribute(_class)] || {})
          .forEach(key => child[setAttributeNS](null, key, options.attributes.edges[child.getAttribute(_class)][key])));
    }
    if (groups.faces) {
      const faceClasses = [front, back];
      Object.keys(options.attributes.faces)
        .filter(key => !faceClasses.includes(key))
        .forEach(key => groups.faces[setAttributeNS](null, key, options.attributes.faces[key]));
      Array.from(groups.faces.childNodes)
        .forEach(child => Object.keys(options.attributes.faces[child.getAttribute(_class)] || {})
          .forEach(key => child[setAttributeNS](null, key, options.attributes.faces[child.getAttribute(_class)][key])));
      if (options.shadows != null) {
        Array.from(groups.faces.childNodes).forEach(f => f[setAttributeNS](null, "filter", "url(#shadow)"));
      }
    }
    if (groups.vertices) {
      Object.keys(options.attributes.vertices)
        .filter(key => key !== "r")
        .forEach(key => groups.vertices[setAttributeNS](null, key, options.attributes.vertices[key]));
      Array.from(groups.vertices.childNodes)
        .forEach(child => child[setAttributeNS](null, "r", options.attributes.vertices.r));
    }
    if (groups.boundaries) {
      Object.keys(options.attributes.boundaries)
        .forEach(key => groups.boundaries[setAttributeNS](null, key, options.attributes.boundaries[key]));
    }
    if (options.output === "svg") { return svg$1; }
    const stringified = (new win$1.XMLSerializer()).serializeToString(svg$1);
    const beautified = vkXML(stringified);
    return beautified;
  };
  const getObject = function (input) {
    if (input == null) {
      return {};
    }
    if (typeof input === object$1 && input !== null) {
      return input;
    }
    if (typeof input === string || input instanceof String) {
      try {
        const obj = JSON.parse(input);
        return obj;
      } catch (error) {
        throw error;
      }
    }
    throw new TypeError(`input requires ${string} or ${object$1}`);
  };
  const FoldToSvg = function (input, options) {
    try {
      const fold = getObject(input);
      return fold_to_svg(fold, options);
    } catch (error) {
      throw error;
    }
  };
  FoldToSvg.vertices_circle = vertices_circle;
  FoldToSvg.edges_path_data = edges_path_data;
  FoldToSvg.edges_by_assignment_paths_data = edges_by_assignment_paths_data;
  FoldToSvg.edges_path = edges_path;
  FoldToSvg.edges_line = edges_line;
  FoldToSvg.faces_vertices_polygon = faces_vertices_polygon;
  FoldToSvg.faces_edges_polygon = faces_edges_polygon;

  let oripa = {};
  oripa.type2fold = {
    0: 'F',
    1: 'B',
    2: 'M',
    3: 'V'
  };
  oripa.fold2type = {};
  let ref = oripa.type2fold;
  for (let x in ref) {
    let y = ref[x];
    oripa.fold2type[y] = x;
  }
  oripa.fold2type_default = 0;
  oripa.prop_xml2fold = {
    'editorName': 'frame_author',
    'originalAuthorName': 'frame_designer',
    'reference': 'frame_reference',
    'title': 'frame_title',
    'memo': 'frame_description',
    'paperSize': null,
    'mainVersion': null,
    'subVersion': null
  };
  oripa.POINT_EPS = 1.0;
  oripa.toFold = function(oripaStr, isDOMObject) {
    var children, fold, j, k, l, len, len1, len2, len3, len4, line, lines, m, n, nodeSpec, object, oneChildSpec, oneChildText, prop, property, ref1, ref2, ref3, ref4, ref5, subproperty, top, type, vertex, x0, x1, xml, y0, y1;
    fold = {
      vertices_coords: [],
      edges_vertices: [],
      edges_assignment: [],
      file_creator: 'oripa2fold'
    };
    vertex = function(x, y) {
      var v;
      v = fold.vertices_coords.length;
      fold.vertices_coords.push([parseFloat(x), parseFloat(y)]);
      return v;
    };
    nodeSpec = function(node, type, key, value) {
      if ((type != null) && node.tagName !== type) {
        console.warn("ORIPA file has " + node.tagName + " where " + type + " was expected");
        return null;
      } else if ((key != null) && (!node.hasAttribute(key) || ((value != null) && node.getAttribute(key) !== value))) {
        console.warn("ORIPA file has " + node.tagName + " with " + key + " = " + (node.getAttribute(key)) + " where " + value + " was expected");
        return null;
      } else {
        return node;
      }
    };
    children = function(node) {
      var child, j, len, ref1, results;
      if (node) {
        ref1 = node.childNodes;
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          child = ref1[j];
          if (child.nodeType === 1) {
            results.push(child);
          }
        }
        return results;
      } else {
        return [];
      }
    };
    oneChildSpec = function(node, type, key, value) {
      var sub;
      sub = children(node);
      if (sub.length !== 1) {
        console.warn("ORIPA file has " + node.tagName + " with " + node.childNodes.length + " children, not 1");
        return null;
      } else {
        return nodeSpec(sub[0], type, key, value);
      }
    };
    oneChildText = function(node) {
      var child;
      if (node.childNodes.length > 1) {
        console.warn("ORIPA file has " + node.tagName + " with " + node.childNodes.length + " children, not 0 or 1");
        return null;
      } else if (node.childNodes.length === 0) {
        return '';
      } else {
        child = node.childNodes[0];
        if (child.nodeType !== 3) {
          return console.warn("ORIPA file has nodeType " + child.nodeType + " where 3 (text) was expected");
        } else {
          return child.data;
        }
      }
    };
    xml = (isDOMObject === true)
      ? oripaStr
      : new DOMParser().parseFromString(oripaStr, 'text/xml').documentElement;
    ref1 = children(xml);
    for (j = 0, len = ref1.length; j < len; j++) {
      top = ref1[j];
      if (nodeSpec(top, 'object', 'class', 'oripa.DataSet')) {
        ref2 = children(top);
        for (k = 0, len1 = ref2.length; k < len1; k++) {
          property = ref2[k];
          if (property.getAttribute('property') === 'lines') {
            lines = oneChildSpec(property, 'array', 'class', 'oripa.OriLineProxy');
            ref3 = children(lines);
            for (l = 0, len2 = ref3.length; l < len2; l++) {
              line = ref3[l];
              if (nodeSpec(line, 'void', 'index')) {
                ref4 = children(line);
                for (m = 0, len3 = ref4.length; m < len3; m++) {
                  object = ref4[m];
                  if (nodeSpec(object, 'object', 'class', 'oripa.OriLineProxy')) {
                    x0 = x1 = y0 = y1 = type = 0;
                    ref5 = children(object);
                    for (n = 0, len4 = ref5.length; n < len4; n++) {
                      subproperty = ref5[n];
                      if (nodeSpec(subproperty, 'void', 'property')) {
                        switch (subproperty.getAttribute('property')) {
                          case 'x0':
                            x0 = oneChildText(oneChildSpec(subproperty, 'double'));
                            break;
                          case 'x1':
                            x1 = oneChildText(oneChildSpec(subproperty, 'double'));
                            break;
                          case 'y0':
                            y0 = oneChildText(oneChildSpec(subproperty, 'double'));
                            break;
                          case 'y1':
                            y1 = oneChildText(oneChildSpec(subproperty, 'double'));
                            break;
                          case 'type':
                            type = oneChildText(oneChildSpec(subproperty, 'int'));
                        }
                      }
                    }
                    if ((x0 != null) && (x1 != null) && (y0 != null) && (y1 != null)) {
                      fold.edges_vertices.push([vertex(x0, y0), vertex(x1, y1)]);
                      if (type != null) {
                        type = parseInt(type);
                      }
                      fold.edges_assignment.push(oripa.type2fold[type]);
                    } else {
                      console.warn("ORIPA line has missing data: " + x0 + " " + x1 + " " + y0 + " " + y1 + " " + type);
                    }
                  }
                }
              }
            }
          } else if (property.getAttribute('property') in oripa.prop_xml2fold) {
            prop = oripa.prop_xml2fold[property.getAttribute('property')];
            if (prop != null) {
              fold[prop] = oneChildText(oneChildSpec(property, 'string'));
            }
          } else {
            console.warn("Ignoring " + property.tagName + " " + (top.getAttribute('property')) + " in ORIPA file");
          }
        }
      }
    }
    filter.collapseNearbyVertices(fold, oripa.POINT_EPS);
    filter.subdivideCrossingEdges_vertices(fold, oripa.POINT_EPS);
    convert.edges_vertices_to_faces_vertices(fold);
    return fold;
  };
  oripa.fromFold = function(fold) {
    var coord, edge, ei, fp, i, j, len, line, lines, ref1, s, vertex, vs, xp;
    if (typeof fold === 'string') {
      fold = JSON.parse(fold);
    }
    s = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n<java version=\"1.5.0_05\" class=\"java.beans.XMLDecoder\"> \n <object class=\"oripa.DataSet\"> \n  <void property=\"mainVersion\"> \n   <int>1</int> \n  </void> \n  <void property=\"subVersion\"> \n   <int>1</int> \n  </void> \n  <void property=\"paperSize\"> \n   <double>400.0</double> \n  </void> \n";
    ref1 = oripa.prop_xml2fold;
    for (xp in ref1) {
      fp = ref1[xp];
      s += (".\n  <void property=\"" + xp + "\"> \n   <string>" + (fold[fp] || '') + "</string> \n  </void> \n").slice(2);
    }
    lines = (function() {
      var j, len, ref2, results;
      ref2 = fold.edges_vertices;
      results = [];
      for (ei = j = 0, len = ref2.length; j < len; ei = ++j) {
        edge = ref2[ei];
        vs = (function() {
          var k, l, len1, len2, ref3, results1;
          results1 = [];
          for (k = 0, len1 = edge.length; k < len1; k++) {
            vertex = edge[k];
            ref3 = fold.vertices_coords[vertex].slice(2);
            for (l = 0, len2 = ref3.length; l < len2; l++) {
              coord = ref3[l];
            }
            results1.push(fold.vertices_coords[vertex]);
          }
          return results1;
        })();
        results.push({
          x0: vs[0][0],
          y0: vs[0][1],
          x1: vs[1][0],
          y1: vs[1][1],
          type: oripa.fold2type[fold.edges_assignment[ei]] || oripa.fold2type_default
        });
      }
      return results;
    })();
    s += (".\n  <void property=\"lines\"> \n   <array class=\"oripa.OriLineProxy\" length=\"" + lines.length + "\"> \n").slice(2);
    for (i = j = 0, len = lines.length; j < len; i = ++j) {
      line = lines[i];
      s += (".\n    <void index=\"" + i + "\"> \n     <object class=\"oripa.OriLineProxy\"> \n      <void property=\"type\"> \n       <int>" + line.type + "</int> \n      </void> \n      <void property=\"x0\"> \n       <double>" + line.x0 + "</double> \n      </void> \n      <void property=\"x1\"> \n       <double>" + line.x1 + "</double> \n      </void> \n      <void property=\"y0\"> \n       <double>" + line.y0 + "</double> \n      </void> \n      <void property=\"y1\"> \n       <double>" + line.y1 + "</double> \n      </void> \n     </object> \n    </void> \n").slice(2);
    }
    s += ".\n   </array> \n  </void> \n </object> \n</java> \n".slice(2);
    return s;
  };

  const isBrowser$2 = typeof window !== "undefined"
    && typeof window.document !== "undefined";
  const isNode$2 = typeof process !== "undefined"
    && process.versions != null
    && process.versions.node != null;

  const htmlString$2 = "<!DOCTYPE html><title> </title>";
  const win$2 = (function () {
    let w = {};
    if (isNode$2) {
      const { DOMParser, XMLSerializer } = require("xmldom");
      w.DOMParser = DOMParser;
      w.XMLSerializer = XMLSerializer;
      w.document = new DOMParser().parseFromString(htmlString$2, "text/html");
    } else if (isBrowser$2) {
      w = window;
    }
    return w;
  }());

  var css_colors = {
    "black": "#000000",
    "silver": "#c0c0c0",
    "gray": "#808080",
    "white": "#ffffff",
    "maroon": "#800000",
    "red": "#ff0000",
    "purple": "#800080",
    "fuchsia": "#ff00ff",
    "green": "#008000",
    "lime": "#00ff00",
    "olive": "#808000",
    "yellow": "#ffff00",
    "navy": "#000080",
    "blue": "#0000ff",
    "teal": "#008080",
    "aqua": "#00ffff",
    "orange": "#ffa500",
    "aliceblue": "#f0f8ff",
    "antiquewhite": "#faebd7",
    "aquamarine": "#7fffd4",
    "azure": "#f0ffff",
    "beige": "#f5f5dc",
    "bisque": "#ffe4c4",
    "blanchedalmond": "#ffebcd",
    "blueviolet": "#8a2be2",
    "brown": "#a52a2a",
    "burlywood": "#deb887",
    "cadetblue": "#5f9ea0",
    "chartreuse": "#7fff00",
    "chocolate": "#d2691e",
    "coral": "#ff7f50",
    "cornflowerblue": "#6495ed",
    "cornsilk": "#fff8dc",
    "crimson": "#dc143c",
    "cyan": "#00ffff",
    "darkblue": "#00008b",
    "darkcyan": "#008b8b",
    "darkgoldenrod": "#b8860b",
    "darkgray": "#a9a9a9",
    "darkgreen": "#006400",
    "darkgrey": "#a9a9a9",
    "darkkhaki": "#bdb76b",
    "darkmagenta": "#8b008b",
    "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00",
    "darkorchid": "#9932cc",
    "darkred": "#8b0000",
    "darksalmon": "#e9967a",
    "darkseagreen": "#8fbc8f",
    "darkslateblue": "#483d8b",
    "darkslategray": "#2f4f4f",
    "darkslategrey": "#2f4f4f",
    "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3",
    "deeppink": "#ff1493",
    "deepskyblue": "#00bfff",
    "dimgray": "#696969",
    "dimgrey": "#696969",
    "dodgerblue": "#1e90ff",
    "firebrick": "#b22222",
    "floralwhite": "#fffaf0",
    "forestgreen": "#228b22",
    "gainsboro": "#dcdcdc",
    "ghostwhite": "#f8f8ff",
    "gold": "#ffd700",
    "goldenrod": "#daa520",
    "greenyellow": "#adff2f",
    "grey": "#808080",
    "honeydew": "#f0fff0",
    "hotpink": "#ff69b4",
    "indianred": "#cd5c5c",
    "indigo": "#4b0082",
    "ivory": "#fffff0",
    "khaki": "#f0e68c",
    "lavender": "#e6e6fa",
    "lavenderblush": "#fff0f5",
    "lawngreen": "#7cfc00",
    "lemonchiffon": "#fffacd",
    "lightblue": "#add8e6",
    "lightcoral": "#f08080",
    "lightcyan": "#e0ffff",
    "lightgoldenrodyellow": "#fafad2",
    "lightgray": "#d3d3d3",
    "lightgreen": "#90ee90",
    "lightgrey": "#d3d3d3",
    "lightpink": "#ffb6c1",
    "lightsalmon": "#ffa07a",
    "lightseagreen": "#20b2aa",
    "lightskyblue": "#87cefa",
    "lightslategray": "#778899",
    "lightslategrey": "#778899",
    "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0",
    "limegreen": "#32cd32",
    "linen": "#faf0e6",
    "magenta": "#ff00ff",
    "mediumaquamarine": "#66cdaa",
    "mediumblue": "#0000cd",
    "mediumorchid": "#ba55d3",
    "mediumpurple": "#9370db",
    "mediumseagreen": "#3cb371",
    "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a",
    "mediumturquoise": "#48d1cc",
    "mediumvioletred": "#c71585",
    "midnightblue": "#191970",
    "mintcream": "#f5fffa",
    "mistyrose": "#ffe4e1",
    "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead",
    "oldlace": "#fdf5e6",
    "olivedrab": "#6b8e23",
    "orangered": "#ff4500",
    "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa",
    "palegreen": "#98fb98",
    "paleturquoise": "#afeeee",
    "palevioletred": "#db7093",
    "papayawhip": "#ffefd5",
    "peachpuff": "#ffdab9",
    "peru": "#cd853f",
    "pink": "#ffc0cb",
    "plum": "#dda0dd",
    "powderblue": "#b0e0e6",
    "rosybrown": "#bc8f8f",
    "royalblue": "#4169e1",
    "saddlebrown": "#8b4513",
    "salmon": "#fa8072",
    "sandybrown": "#f4a460",
    "seagreen": "#2e8b57",
    "seashell": "#fff5ee",
    "sienna": "#a0522d",
    "skyblue": "#87ceeb",
    "slateblue": "#6a5acd",
    "slategray": "#708090",
    "slategrey": "#708090",
    "snow": "#fffafa",
    "springgreen": "#00ff7f",
    "steelblue": "#4682b4",
    "tan": "#d2b48c",
    "thistle": "#d8bfd8",
    "tomato": "#ff6347",
    "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3",
    "whitesmoke": "#f5f5f5",
    "yellowgreen": "#9acd32"
  };

  const css_color_names = Object.keys(css_colors);
  const hexToComponents = function (h) {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 255;
    if (h.length === 4) {
      r = `0x${h[1]}${h[1]}`;
      g = `0x${h[2]}${h[2]}`;
      b = `0x${h[3]}${h[3]}`;
    } else if (h.length === 7) {
      r = `0x${h[1]}${h[2]}`;
      g = `0x${h[3]}${h[4]}`;
      b = `0x${h[5]}${h[6]}`;
    } else if (h.length === 5) {
      r = `0x${h[1]}${h[1]}`;
      g = `0x${h[2]}${h[2]}`;
      b = `0x${h[3]}${h[3]}`;
      a = `0x${h[4]}${h[4]}`;
    } else if (h.length === 9) {
      r = `0x${h[1]}${h[2]}`;
      g = `0x${h[3]}${h[4]}`;
      b = `0x${h[5]}${h[6]}`;
      a = `0x${h[7]}${h[8]}`;
    }
    return [+(r / 255), +(g / 255), +(b / 255), +(a / 255)];
  };
  const color_to_assignment = function (string) {
    if (string == null || typeof string !== "string") {
      return "U";
    }
    let c = [0, 0, 0, 1];
    if (string[0] === "#") {
      c = hexToComponents(string);
    } else if (css_color_names.indexOf(string) !== -1) {
      c = hexToComponents(css_colors[string]);
    }
    const ep = 0.05;
    if (c[0] < ep && c[1] < ep && c[2] < ep) { return "U"; }
    if (c[0] > c[1] && (c[0] - c[2]) > ep) { return "M"; }
    if (c[2] > c[1] && (c[2] - c[0]) > ep) { return "V"; }
    return "U";
  };

  const EPSILON$1 = 1e-6;
  const magnitude$1 = function (v) {
    const sum = v
      .map(component => component * component)
      .reduce((prev, curr) => prev + curr, 0);
    return Math.sqrt(sum);
  };
  const normalize$1 = function (v) {
    const m = magnitude$1(v);
    return m === 0 ? v : v.map(c => c / m);
  };
  const equivalent$1 = function (a, b, epsilon = EPSILON$1) {
    for (let i = 0; i < a.length; i += 1) {
      if (Math.abs(a[i] - b[i]) > epsilon) {
        return false;
      }
    }
    return true;
  };
  const segment_segment_comp_exclusive = (t0, t1) => t0 > EPSILON$1 && t0 < 1 - EPSILON$1 && t1 > EPSILON$1
    && t1 < 1 - EPSILON$1;
  const intersection_function = function (aPt, aVec, bPt, bVec, compFunc, epsilon = EPSILON$1) {
    function det(a, b) { return a[0] * b[1] - b[0] * a[1]; }
    const denominator0 = det(aVec, bVec);
    if (Math.abs(denominator0) < epsilon) { return undefined; }
    const denominator1 = -denominator0;
    const numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
    const numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);
    const t0 = numerator0 / denominator0;
    const t1 = numerator1 / denominator1;
    if (compFunc(t0, t1, epsilon)) {
      return [aPt[0] + aVec[0] * t0, aPt[1] + aVec[1] * t0];
    }
    return undefined;
  };
  const segment_segment_exclusive$1 = function (a0, a1, b0, b1, epsilon) {
    const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return intersection_function(a0, aVec, b0, bVec, segment_segment_comp_exclusive, epsilon);
  };
  const point_on_edge_exclusive$1 = function (point, edge0, edge1, epsilon = EPSILON$1) {
    const edge0_1 = [edge0[0] - edge1[0], edge0[1] - edge1[1]];
    const edge0_p = [edge0[0] - point[0], edge0[1] - point[1]];
    const edge1_p = [edge1[0] - point[0], edge1[1] - point[1]];
    const dEdge = Math.sqrt(edge0_1[0] * edge0_1[0] + edge0_1[1] * edge0_1[1]);
    const dP0 = Math.sqrt(edge0_p[0] * edge0_p[0] + edge0_p[1] * edge0_p[1]);
    const dP1 = Math.sqrt(edge1_p[0] * edge1_p[0] + edge1_p[1] * edge1_p[1]);
    return Math.abs(dEdge - dP0 - dP1) < epsilon;
  };
  var math$1 = {
    core: {
      EPSILON: EPSILON$1,
      magnitude: magnitude$1,
      normalize: normalize$1,
      equivalent: equivalent$1,
      point_on_edge_exclusive: point_on_edge_exclusive$1,
      intersection: {
        segment_segment_exclusive: segment_segment_exclusive$1
      }
    }
  };

  const max_array_length$2 = function (...arrays) {
    return Math.max(...(arrays
      .filter(el => el !== undefined)
      .map(el => el.length)));
  };
  const vertices_count$2 = function ({
    vertices_coords, vertices_faces, vertices_vertices
  }) {
    return max_array_length$2([], vertices_coords,
      vertices_faces, vertices_vertices);
  };
  const edges_count$2 = function ({
    edges_vertices, edges_faces
  }) {
    return max_array_length$2([], edges_vertices, edges_faces);
  };
  const faces_count$2 = function ({
    faces_vertices, faces_edges
  }) {
    return max_array_length$2([], faces_vertices, faces_edges);
  };
  const get_geometry_length$1 = {
    vertices: vertices_count$2,
    edges: edges_count$2,
    faces: faces_count$2
  };
  const remove_geometry_key_indices$1 = function (graph, key, removeIndices) {
    const geometry_array_size = get_geometry_length$1[key](graph);
    const removes = Array(geometry_array_size).fill(false);
    removeIndices.forEach((v) => { removes[v] = true; });
    let s = 0;
    const index_map = removes.map(remove => (remove ? --s : s));
    if (removeIndices.length === 0) { return index_map; }
    const prefix = `${key}_`;
    const suffix = `_${key}`;
    const graph_keys = Object.keys(graph);
    const prefixKeys = graph_keys
      .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
      .filter(str => str !== undefined);
    const suffixKeys = graph_keys
      .map(str => (str.substring(str.length - suffix.length, str.length) === suffix
        ? str
        : undefined))
      .filter(str => str !== undefined);
    suffixKeys
      .forEach(sKey => graph[sKey]
        .forEach((_, i) => graph[sKey][i]
          .forEach((v, j) => { graph[sKey][i][j] += index_map[v]; })));
    prefixKeys.forEach((pKey) => {
      graph[pKey] = graph[pKey]
        .filter((_, i) => !removes[i]);
    });
    return index_map;
  };

  const edges_vertices_equivalent$1 = function (a, b) {
    return (a[0] === b[0] && a[1] === b[1]) || (a[0] === b[1] && a[1] === b[0]);
  };
  const make_edges_collinearVertices$1 = function ({
    vertices_coords, edges_vertices
  }, epsilon = math$1.core.EPSILON) {
    const edges = edges_vertices
      .map(ev => ev.map(v => vertices_coords[v]));
    return edges.map(e => vertices_coords
      .filter(v => math$1.core.point_on_edge_exclusive(v, e[0], e[1], epsilon)));
  };
  const make_edges_alignment$1 = function ({ vertices_coords, edges_vertices }) {
    const edges = edges_vertices
      .map(ev => ev.map(v => vertices_coords[v]));
    const edges_vector = edges.map(e => [e[1][0] - e[0][0], e[1][1] - e[0][1]]);
    const edges_magnitude = edges_vector
      .map(e => Math.sqrt(e[0] * e[0] + e[1] * e[1]));
    const edges_normalized = edges_vector
      .map((e, i) => [e[0] / edges_magnitude[i], e[1] / edges_magnitude[i]]);
    return edges_normalized.map(e => Math.abs(e[0]) > 0.707);
  };
  const make_edges_intersections$1 = function ({
    vertices_coords, edges_vertices
  }, epsilon = math$1.core.EPSILON) {
    const edge_count = edges_vertices.length;
    const edges = edges_vertices
      .map(ev => ev.map(v => vertices_coords[v]));
    const crossings = Array.from(Array(edge_count - 1)).map(() => []);
    for (let i = 0; i < edges.length - 1; i += 1) {
      for (let j = i + 1; j < edges.length; j += 1) {
        crossings[i][j] = math$1.core.intersection.segment_segment_exclusive(
          edges[i][0], edges[i][1],
          edges[j][0], edges[j][1],
          epsilon
        );
      }
    }
    const edges_intersections = Array.from(Array(edge_count)).map(() => []);
    for (let i = 0; i < edges.length - 1; i += 1) {
      for (let j = i + 1; j < edges.length; j += 1) {
        if (crossings[i][j] != null) {
          edges_intersections[i].push(crossings[i][j]);
          edges_intersections[j].push(crossings[i][j]);
        }
      }
    }
    return edges_intersections;
  };
  const fragment$1 = function (graph, epsilon = math$1.core.EPSILON) {
    const horizSort = function (a, b) { return a[0] - b[0]; };
    const vertSort = function (a, b) { return a[1] - b[1]; };
    const edges_alignment = make_edges_alignment$1(graph);
    const edges = graph.edges_vertices
      .map(ev => ev.map(v => graph.vertices_coords[v]));
    edges.forEach((e, i) => e.sort(edges_alignment[i] ? horizSort : vertSort));
    const edges_intersections = make_edges_intersections$1(graph, epsilon);
    const edges_collinearVertices = make_edges_collinearVertices$1(graph, epsilon);
    const new_edges_vertices = edges_intersections
      .map((a, i) => a.concat(edges_collinearVertices[i]));
    new_edges_vertices.forEach((e, i) => e
      .sort(edges_alignment[i] ? horizSort : vertSort));
    let new_edges = new_edges_vertices
      .map(ev => Array.from(Array(ev.length - 1))
        .map((_, i) => [ev[i], ev[(i + 1)]]));
    new_edges = new_edges
      .map(edgeGroup => edgeGroup
        .filter(e => false === e
          .map((_, i) => Math.abs(e[0][i] - e[1][i]) < epsilon)
          .reduce((a, b) => a && b, true)));
    const edge_map = new_edges
      .map((edge, i) => edge.map(() => i))
      .reduce((a, b) => a.concat(b), []);
    const vertices_coords = new_edges
      .map(edge => edge.reduce((a, b) => a.concat(b), []))
      .reduce((a, b) => a.concat(b), []);
    let counter = 0;
    const edges_vertices = new_edges
      .map(edge => edge.map(() => [counter++, counter++]))
      .reduce((a, b) => a.concat(b), []);
    const vertices_equivalent = Array
      .from(Array(vertices_coords.length)).map(() => []);
    for (let i = 0; i < vertices_coords.length - 1; i += 1) {
      for (let j = i + 1; j < vertices_coords.length; j += 1) {
        vertices_equivalent[i][j] = math$1.core.equivalent(
          vertices_coords[i],
          vertices_coords[j],
          epsilon
        );
      }
    }
    const vertices_map = vertices_coords.map(() => undefined);
    vertices_equivalent
      .forEach((row, i) => row
        .forEach((eq, j) => {
          if (eq) {
            vertices_map[j] = vertices_map[i] === undefined
              ? i
              : vertices_map[i];
          }
        }));
    const vertices_remove = vertices_map.map(m => m !== undefined);
    vertices_map.forEach((map, i) => {
      if (map === undefined) { vertices_map[i] = i; }
    });
    edges_vertices
      .forEach((edge, i) => edge
        .forEach((v, j) => {
          edges_vertices[i][j] = vertices_map[v];
        }));
    const edges_equivalent = Array
      .from(Array(edges_vertices.length)).map(() => []);
    for (let i = 0; i < edges_vertices.length - 1; i += 1) {
      for (let j = i + 1; j < edges_vertices.length; j += 1) {
        edges_equivalent[i][j] = edges_vertices_equivalent$1(
          edges_vertices[i],
          edges_vertices[j]
        );
      }
    }
    const edges_map = edges_vertices.map(() => undefined);
    edges_equivalent
      .forEach((row, i) => row
        .forEach((eq, j) => {
          if (eq) {
            edges_map[i] = edges_map[j] === undefined
              ? j
              : edges_map[j];
          }
        }));
    const edges_dont_remove = edges_map.map(m => m === undefined);
    edges_map.forEach((map, i) => {
      if (map === undefined) { edges_map[i] = i; }
    });
    const edges_vertices_cl = edges_vertices.filter((_, i) => edges_dont_remove[i]);
    const edge_map_cl = edge_map.filter((_, i) => edges_dont_remove[i]);
    const flat = {
      vertices_coords,
      edges_vertices: edges_vertices_cl
    };
    if ("edges_assignment" in graph === true) {
      flat.edges_assignment = edge_map_cl.map(i => graph.edges_assignment[i]);
    }
    if ("edges_foldAngle" in graph === true) {
      flat.edges_foldAngle = edge_map_cl.map(i => graph.edges_foldAngle[i]);
    }
    const vertices_remove_indices = vertices_remove
      .map((rm, i) => (rm ? i : undefined))
      .filter(i => i !== undefined);
    remove_geometry_key_indices$1(flat, "vertices", vertices_remove_indices);
    return flat;
  };

  const make_vertex_pair_to_edge_map$2 = function ({ edges_vertices }) {
    const map = {};
    edges_vertices
      .map(ev => ev.sort((a, b) => a - b).join(" "))
      .forEach((key, i) => { map[key] = i; });
    return map;
  };

  const boundary_vertex_walk = function ({ vertices_vertices }, startIndex, neighbor_index) {
    const walk = [startIndex, neighbor_index];
    while (walk[0] !== walk[walk.length - 1]
      && walk[walk.length - 1] !== walk[walk.length - 2]
    ) {
      const next_v_v = vertices_vertices[walk[walk.length - 1]];
      const next_i_v_v = next_v_v.indexOf(walk[walk.length - 2]);
      const next_v = next_v_v[(next_i_v_v + 1) % next_v_v.length];
      walk.push(next_v);
    }
    walk.pop();
    return walk;
  };
  const search_boundary = function (graph) {
    if (graph.vertices_coords == null || graph.vertices_coords.length < 1) {
      return [];
    }
    let startIndex = 0;
    for (let i = 1; i < graph.vertices_coords.length; i += 1) {
      if (graph.vertices_coords[i][1] < graph.vertices_coords[startIndex][1]) {
        startIndex = i;
      }
    }
    if (startIndex === -1) { return []; }
    const adjacent = graph.vertices_vertices[startIndex];
    const adjacent_vectors = adjacent.map(a => [
      graph.vertices_coords[a][0] - graph.vertices_coords[startIndex][0],
      graph.vertices_coords[a][1] - graph.vertices_coords[startIndex][1]
    ]);
    const adjacent_dot_products = adjacent_vectors
      .map(v => math$1.core.normalize(v))
      .map(v => v[0]);
    let neighbor_index = -1;
    let counter_max = -Infinity;
    for (let i = 0; i < adjacent_dot_products.length; i += 1) {
      if (adjacent_dot_products[i] > counter_max) {
        neighbor_index = i;
        counter_max = adjacent_dot_products[i];
      }
    }
    const vertices = boundary_vertex_walk(graph, startIndex, adjacent[neighbor_index]);
    const edgeMap = make_vertex_pair_to_edge_map$2(graph);
    const vertices_pairs = vertices
      .map((_, i, arr) => [arr[i], arr[(i + 1) % arr.length]]
        .sort((a, b) => a - b)
        .join(" "));
    const edges = vertices_pairs.map(p => edgeMap[p]);
    return edges;
  };

  function vkXML$1 (text, step) {
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
  const isBrowser$3 = typeof window !== "undefined"
    && typeof window.document !== "undefined";
  const isNode$3 = typeof process !== "undefined"
    && process.versions != null
    && process.versions.node != null;
    const htmlString$3 = "<!DOCTYPE html><title> </title>";
  const win$3 = (function () {
    let w = {};
    if (isNode$3) {
      const { DOMParser, XMLSerializer } = require("xmldom");
      w.DOMParser = DOMParser;
      w.XMLSerializer = XMLSerializer;
      w.document = new DOMParser().parseFromString(htmlString$3, "text/html");
    } else if (isBrowser$3) {
      w = window;
    }
    return w;
  }());
  var length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0};
  var segment$1 = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
  function parse(path) {
    var data = [];
    path.replace(segment$1, function(_, command, args){
      var type = command.toLowerCase();
      args = parseValues(args);
      if (type === 'm' && args.length > 2) {
        data.push([command].concat(args.splice(0, 2)));
        type = 'l';
        command = command === 'm' ? 'l' : 'L';
      }
      while (args.length >= 0) {
        if (args.length === length[type]) {
          args.unshift(command);
          return data.push(args);
        }
        if (args.length < length[type]) {
          throw new Error('malformed path data');
        }
        data.push([command].concat(args.splice(0, length[type])));
      }
    });
    return data;
  }
  var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig;
  function parseValues(args) {
    var numbers = args.match(number);
    return numbers ? numbers.map(Number) : [];
  }
  function Bezier(ax, ay, bx, by, cx, cy, dx, dy) {
    return new Bezier$1(ax, ay, bx, by, cx, cy, dx, dy);
  }
  function Bezier$1(ax, ay, bx, by, cx, cy, dx, dy) {
    this.a = {x:ax, y:ay};
    this.b = {x:bx, y:by};
    this.c = {x:cx, y:cy};
    this.d = {x:dx, y:dy};
    if(dx !== null && dx !== undefined && dy !== null && dy !== undefined){
      this.getArcLength = getCubicArcLength;
      this.getPoint = cubicPoint;
      this.getDerivative = cubicDerivative;
    } else {
      this.getArcLength = getQuadraticArcLength;
      this.getPoint = quadraticPoint;
      this.getDerivative = quadraticDerivative;
    }
    this.init();
  }
  Bezier$1.prototype = {
    constructor: Bezier$1,
    init: function() {
      this.length = this.getArcLength([this.a.x, this.b.x, this.c.x, this.d.x],
                                      [this.a.y, this.b.y, this.c.y, this.d.y]);
    },
    getTotalLength: function() {
      return this.length;
    },
    getPointAtLength: function(length) {
      var t = t2length(length, this.length, this.getArcLength,
                      [this.a.x, this.b.x, this.c.x, this.d.x],
                      [this.a.y, this.b.y, this.c.y, this.d.y]);
      return this.getPoint([this.a.x, this.b.x, this.c.x, this.d.x],
                                      [this.a.y, this.b.y, this.c.y, this.d.y],
                                    t);
    },
    getTangentAtLength: function(length){
      var t = t2length(length, this.length, this.getArcLength,
                      [this.a.x, this.b.x, this.c.x, this.d.x],
                      [this.a.y, this.b.y, this.c.y, this.d.y]);
      var derivative = this.getDerivative([this.a.x, this.b.x, this.c.x, this.d.x],
                      [this.a.y, this.b.y, this.c.y, this.d.y], t);
      var mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
      var tangent;
      if (mdl > 0){
        tangent = {x: derivative.x/mdl, y: derivative.y/mdl};
      } else {
        tangent = {x: 0, y: 0};
      }
      return tangent;
    },
    getPropertiesAtLength: function(length){
      var t = t2length(length, this.length, this.getArcLength,
                      [this.a.x, this.b.x, this.c.x, this.d.x],
                      [this.a.y, this.b.y, this.c.y, this.d.y]);
      var derivative = this.getDerivative([this.a.x, this.b.x, this.c.x, this.d.x],
                      [this.a.y, this.b.y, this.c.y, this.d.y], t);
      var mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
      var tangent;
      if (mdl > 0){
        tangent = {x: derivative.x/mdl, y: derivative.y/mdl};
      } else {
        tangent = {x: 0, y: 0};
      }
      var point = this.getPoint([this.a.x, this.b.x, this.c.x, this.d.x],
                                      [this.a.y, this.b.y, this.c.y, this.d.y],
                                    t);
      return {x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y};
    }
  };
  function quadraticDerivative(xs, ys, t){
    return {x: (1 - t) * 2*(xs[1] - xs[0]) +t * 2*(xs[2] - xs[1]),
      y: (1 - t) * 2*(ys[1] - ys[0]) +t * 2*(ys[2] - ys[1])
    };
  }
  function cubicDerivative(xs, ys, t){
    var derivative = quadraticPoint(
              [3*(xs[1] - xs[0]), 3*(xs[2] - xs[1]), 3*(xs[3] - xs[2])],
              [3*(ys[1] - ys[0]), 3*(ys[2] - ys[1]), 3*(ys[3] - ys[2])],
              t);
    return derivative;
  }
  function t2length(length, total_length, func, xs, ys){
    var error = 1;
    var t = length/total_length;
    var step = (length - func(xs, ys, t))/total_length;
    var numIterations = 0;
    while (error > 0.001){
      var increasedTLength = func(xs, ys, t + step);
      var decreasedTLength = func(xs, ys, t - step);
      var increasedTError = Math.abs(length - increasedTLength) / total_length;
      var decreasedTError = Math.abs(length - decreasedTLength) / total_length;
      if (increasedTError < error) {
        error = increasedTError;
        t += step;
      } else if (decreasedTError < error) {
        error = decreasedTError;
        t -= step;
      } else {
        step /= 2;
      }
      numIterations++;
      if(numIterations > 500){
        break;
      }
    }
    return t;
  }
  function quadraticPoint(xs, ys, t){
    var x = (1 - t) * (1 - t) * xs[0] + 2 * (1 - t) * t * xs[1] + t * t * xs[2];
    var y = (1 - t) * (1 - t) * ys[0] + 2 * (1 - t) * t * ys[1] + t * t * ys[2];
    return {x: x, y: y};
  }
  function cubicPoint(xs, ys, t){
    var x = (1 - t) * (1 - t) * (1 - t) * xs[0] + 3 * (1 - t) * (1 - t) * t * xs[1] +
    3 * (1 - t) * t * t * xs[2] + t * t * t * xs[3];
    var y = (1 - t) * (1 - t) * (1 - t) * ys[0] + 3 * (1 - t) * (1 - t) * t * ys[1] +
    3 * (1 - t) * t * t * ys[2] + t * t * t * ys[3];
    return {x: x, y: y};
  }
  function getQuadraticArcLength(xs, ys, t) {
    if (t === undefined) {
      t = 1;
    }
     var ax = xs[0] - 2 * xs[1] + xs[2];
     var ay = ys[0] - 2 * ys[1] + ys[2];
     var bx = 2 * xs[1] - 2 * xs[0];
     var by = 2 * ys[1] - 2 * ys[0];
     var A = 4 * (ax * ax + ay * ay);
     var B = 4 * (ax * bx + ay * by);
     var C = bx * bx + by * by;
     if(A === 0){
       return t * Math.sqrt(Math.pow(xs[2] - xs[0], 2) + Math.pow(ys[2] - ys[0], 2));
     }
     var b = B/(2*A);
     var c = C/A;
     var u = t + b;
     var k = c - b*b;
     var uuk = (u*u+k)>0?Math.sqrt(u*u+k):0;
     var bbk = (b*b+k)>0?Math.sqrt(b*b+k):0;
     var term = ((b+Math.sqrt(b*b+k)))!==0?k*Math.log(Math.abs((u+uuk)/(b+bbk))):0;
     return (Math.sqrt(A)/2)*(
       u*uuk-b*bbk+
       term
     );
  }
  var tValues = [
    [],
    [],
    [-0.5773502691896257,0.5773502691896257],
    [0,-0.7745966692414834,0.7745966692414834],
    [-0.33998104358485626,0.33998104358485626,-0.8611363115940526,0.8611363115940526],
    [0,-0.5384693101056831,0.5384693101056831,-0.906179845938664,0.906179845938664],
    [0.6612093864662645,-0.6612093864662645,-0.2386191860831969,0.2386191860831969,-0.932469514203152,0.932469514203152],
    [0,0.4058451513773972,-0.4058451513773972,-0.7415311855993945,0.7415311855993945,-0.9491079123427585,0.9491079123427585],
    [-0.1834346424956498,0.1834346424956498,-0.525532409916329,0.525532409916329,-0.7966664774136267,0.7966664774136267,-0.9602898564975363,0.9602898564975363],
    [0,-0.8360311073266358,0.8360311073266358,-0.9681602395076261,0.9681602395076261,-0.3242534234038089,0.3242534234038089,-0.6133714327005904,0.6133714327005904],
    [-0.14887433898163122,0.14887433898163122,-0.4333953941292472,0.4333953941292472,-0.6794095682990244,0.6794095682990244,-0.8650633666889845,0.8650633666889845,-0.9739065285171717,0.9739065285171717],
    [0,-0.26954315595234496,0.26954315595234496,-0.5190961292068118,0.5190961292068118,-0.7301520055740494,0.7301520055740494,-0.8870625997680953,0.8870625997680953,-0.978228658146057,0.978228658146057],
    [-0.1252334085114689,0.1252334085114689,-0.3678314989981802,0.3678314989981802,-0.5873179542866175,0.5873179542866175,-0.7699026741943047,0.7699026741943047,-0.9041172563704749,0.9041172563704749,-0.9815606342467192,0.9815606342467192],
    [0,-0.2304583159551348,0.2304583159551348,-0.44849275103644687,0.44849275103644687,-0.6423493394403402,0.6423493394403402,-0.8015780907333099,0.8015780907333099,-0.9175983992229779,0.9175983992229779,-0.9841830547185881,0.9841830547185881],
    [-0.10805494870734367,0.10805494870734367,-0.31911236892788974,0.31911236892788974,-0.5152486363581541,0.5152486363581541,-0.6872929048116855,0.6872929048116855,-0.827201315069765,0.827201315069765,-0.9284348836635735,0.9284348836635735,-0.9862838086968123,0.9862838086968123],
    [0,-0.20119409399743451,0.20119409399743451,-0.3941513470775634,0.3941513470775634,-0.5709721726085388,0.5709721726085388,-0.7244177313601701,0.7244177313601701,-0.8482065834104272,0.8482065834104272,-0.937273392400706,0.937273392400706,-0.9879925180204854,0.9879925180204854],
    [-0.09501250983763744,0.09501250983763744,-0.2816035507792589,0.2816035507792589,-0.45801677765722737,0.45801677765722737,-0.6178762444026438,0.6178762444026438,-0.755404408355003,0.755404408355003,-0.8656312023878318,0.8656312023878318,-0.9445750230732326,0.9445750230732326,-0.9894009349916499,0.9894009349916499],
    [0,-0.17848418149584785,0.17848418149584785,-0.3512317634538763,0.3512317634538763,-0.5126905370864769,0.5126905370864769,-0.6576711592166907,0.6576711592166907,-0.7815140038968014,0.7815140038968014,-0.8802391537269859,0.8802391537269859,-0.9506755217687678,0.9506755217687678,-0.9905754753144174,0.9905754753144174],
    [-0.0847750130417353,0.0847750130417353,-0.2518862256915055,0.2518862256915055,-0.41175116146284263,0.41175116146284263,-0.5597708310739475,0.5597708310739475,-0.6916870430603532,0.6916870430603532,-0.8037049589725231,0.8037049589725231,-0.8926024664975557,0.8926024664975557,-0.9558239495713977,0.9558239495713977,-0.9915651684209309,0.9915651684209309],
    [0,-0.16035864564022537,0.16035864564022537,-0.31656409996362983,0.31656409996362983,-0.46457074137596094,0.46457074137596094,-0.600545304661681,0.600545304661681,-0.7209661773352294,0.7209661773352294,-0.8227146565371428,0.8227146565371428,-0.9031559036148179,0.9031559036148179,-0.96020815213483,0.96020815213483,-0.9924068438435844,0.9924068438435844],
    [-0.07652652113349734,0.07652652113349734,-0.22778585114164507,0.22778585114164507,-0.37370608871541955,0.37370608871541955,-0.5108670019508271,0.5108670019508271,-0.636053680726515,0.636053680726515,-0.7463319064601508,0.7463319064601508,-0.8391169718222188,0.8391169718222188,-0.912234428251326,0.912234428251326,-0.9639719272779138,0.9639719272779138,-0.9931285991850949,0.9931285991850949],
    [0,-0.1455618541608951,0.1455618541608951,-0.2880213168024011,0.2880213168024011,-0.4243421202074388,0.4243421202074388,-0.5516188358872198,0.5516188358872198,-0.6671388041974123,0.6671388041974123,-0.7684399634756779,0.7684399634756779,-0.8533633645833173,0.8533633645833173,-0.9200993341504008,0.9200993341504008,-0.9672268385663063,0.9672268385663063,-0.9937521706203895,0.9937521706203895],
    [-0.06973927331972223,0.06973927331972223,-0.20786042668822127,0.20786042668822127,-0.34193582089208424,0.34193582089208424,-0.469355837986757,0.469355837986757,-0.5876404035069116,0.5876404035069116,-0.6944872631866827,0.6944872631866827,-0.7878168059792081,0.7878168059792081,-0.8658125777203002,0.8658125777203002,-0.926956772187174,0.926956772187174,-0.9700604978354287,0.9700604978354287,-0.9942945854823992,0.9942945854823992],
    [0,-0.1332568242984661,0.1332568242984661,-0.26413568097034495,0.26413568097034495,-0.3903010380302908,0.3903010380302908,-0.5095014778460075,0.5095014778460075,-0.6196098757636461,0.6196098757636461,-0.7186613631319502,0.7186613631319502,-0.8048884016188399,0.8048884016188399,-0.8767523582704416,0.8767523582704416,-0.9329710868260161,0.9329710868260161,-0.9725424712181152,0.9725424712181152,-0.9947693349975522,0.9947693349975522],
    [-0.06405689286260563,0.06405689286260563,-0.1911188674736163,0.1911188674736163,-0.3150426796961634,0.3150426796961634,-0.4337935076260451,0.4337935076260451,-0.5454214713888396,0.5454214713888396,-0.6480936519369755,0.6480936519369755,-0.7401241915785544,0.7401241915785544,-0.820001985973903,0.820001985973903,-0.8864155270044011,0.8864155270044011,-0.9382745520027328,0.9382745520027328,-0.9747285559713095,0.9747285559713095,-0.9951872199970213,0.9951872199970213]
  ];
  var cValues = [
    [],
    [],
    [1,1],
    [0.8888888888888888,0.5555555555555556,0.5555555555555556],
    [0.6521451548625461,0.6521451548625461,0.34785484513745385,0.34785484513745385],
    [0.5688888888888889,0.47862867049936647,0.47862867049936647,0.23692688505618908,0.23692688505618908],
    [0.3607615730481386,0.3607615730481386,0.46791393457269104,0.46791393457269104,0.17132449237917036,0.17132449237917036],
    [0.4179591836734694,0.3818300505051189,0.3818300505051189,0.27970539148927664,0.27970539148927664,0.1294849661688697,0.1294849661688697],
    [0.362683783378362,0.362683783378362,0.31370664587788727,0.31370664587788727,0.22238103445337448,0.22238103445337448,0.10122853629037626,0.10122853629037626],
    [0.3302393550012598,0.1806481606948574,0.1806481606948574,0.08127438836157441,0.08127438836157441,0.31234707704000286,0.31234707704000286,0.26061069640293544,0.26061069640293544],
    [0.29552422471475287,0.29552422471475287,0.26926671930999635,0.26926671930999635,0.21908636251598204,0.21908636251598204,0.1494513491505806,0.1494513491505806,0.06667134430868814,0.06667134430868814],
    [0.2729250867779006,0.26280454451024665,0.26280454451024665,0.23319376459199048,0.23319376459199048,0.18629021092773426,0.18629021092773426,0.1255803694649046,0.1255803694649046,0.05566856711617366,0.05566856711617366],
    [0.24914704581340277,0.24914704581340277,0.2334925365383548,0.2334925365383548,0.20316742672306592,0.20316742672306592,0.16007832854334622,0.16007832854334622,0.10693932599531843,0.10693932599531843,0.04717533638651183,0.04717533638651183],
    [0.2325515532308739,0.22628318026289723,0.22628318026289723,0.2078160475368885,0.2078160475368885,0.17814598076194574,0.17814598076194574,0.13887351021978725,0.13887351021978725,0.09212149983772845,0.09212149983772845,0.04048400476531588,0.04048400476531588],
    [0.2152638534631578,0.2152638534631578,0.2051984637212956,0.2051984637212956,0.18553839747793782,0.18553839747793782,0.15720316715819355,0.15720316715819355,0.12151857068790319,0.12151857068790319,0.08015808715976021,0.08015808715976021,0.03511946033175186,0.03511946033175186],
    [0.2025782419255613,0.19843148532711158,0.19843148532711158,0.1861610000155622,0.1861610000155622,0.16626920581699392,0.16626920581699392,0.13957067792615432,0.13957067792615432,0.10715922046717194,0.10715922046717194,0.07036604748810812,0.07036604748810812,0.03075324199611727,0.03075324199611727],
    [0.1894506104550685,0.1894506104550685,0.18260341504492358,0.18260341504492358,0.16915651939500254,0.16915651939500254,0.14959598881657674,0.14959598881657674,0.12462897125553388,0.12462897125553388,0.09515851168249279,0.09515851168249279,0.062253523938647894,0.062253523938647894,0.027152459411754096,0.027152459411754096],
    [0.17944647035620653,0.17656270536699264,0.17656270536699264,0.16800410215645004,0.16800410215645004,0.15404576107681028,0.15404576107681028,0.13513636846852548,0.13513636846852548,0.11188384719340397,0.11188384719340397,0.08503614831717918,0.08503614831717918,0.0554595293739872,0.0554595293739872,0.02414830286854793,0.02414830286854793],
    [0.1691423829631436,0.1691423829631436,0.16427648374583273,0.16427648374583273,0.15468467512626524,0.15468467512626524,0.14064291467065065,0.14064291467065065,0.12255520671147846,0.12255520671147846,0.10094204410628717,0.10094204410628717,0.07642573025488905,0.07642573025488905,0.0497145488949698,0.0497145488949698,0.02161601352648331,0.02161601352648331],
    [0.1610544498487837,0.15896884339395434,0.15896884339395434,0.15276604206585967,0.15276604206585967,0.1426067021736066,0.1426067021736066,0.12875396253933621,0.12875396253933621,0.11156664554733399,0.11156664554733399,0.09149002162245,0.09149002162245,0.06904454273764123,0.06904454273764123,0.0448142267656996,0.0448142267656996,0.019461788229726478,0.019461788229726478],
    [0.15275338713072584,0.15275338713072584,0.14917298647260374,0.14917298647260374,0.14209610931838204,0.14209610931838204,0.13168863844917664,0.13168863844917664,0.11819453196151841,0.11819453196151841,0.10193011981724044,0.10193011981724044,0.08327674157670475,0.08327674157670475,0.06267204833410907,0.06267204833410907,0.04060142980038694,0.04060142980038694,0.017614007139152118,0.017614007139152118],
    [0.14608113364969041,0.14452440398997005,0.14452440398997005,0.13988739479107315,0.13988739479107315,0.13226893863333747,0.13226893863333747,0.12183141605372853,0.12183141605372853,0.10879729916714838,0.10879729916714838,0.09344442345603386,0.09344442345603386,0.0761001136283793,0.0761001136283793,0.057134425426857205,0.057134425426857205,0.036953789770852494,0.036953789770852494,0.016017228257774335,0.016017228257774335],
    [0.13925187285563198,0.13925187285563198,0.13654149834601517,0.13654149834601517,0.13117350478706238,0.13117350478706238,0.12325237681051242,0.12325237681051242,0.11293229608053922,0.11293229608053922,0.10041414444288096,0.10041414444288096,0.08594160621706773,0.08594160621706773,0.06979646842452049,0.06979646842452049,0.052293335152683286,0.052293335152683286,0.03377490158481415,0.03377490158481415,0.0146279952982722,0.0146279952982722],
    [0.13365457218610619,0.1324620394046966,0.1324620394046966,0.12890572218808216,0.12890572218808216,0.12304908430672953,0.12304908430672953,0.11499664022241136,0.11499664022241136,0.10489209146454141,0.10489209146454141,0.09291576606003515,0.09291576606003515,0.07928141177671895,0.07928141177671895,0.06423242140852585,0.06423242140852585,0.04803767173108467,0.04803767173108467,0.030988005856979445,0.030988005856979445,0.013411859487141771,0.013411859487141771],
    [0.12793819534675216,0.12793819534675216,0.1258374563468283,0.1258374563468283,0.12167047292780339,0.12167047292780339,0.1155056680537256,0.1155056680537256,0.10744427011596563,0.10744427011596563,0.09761865210411388,0.09761865210411388,0.08619016153195327,0.08619016153195327,0.0733464814110803,0.0733464814110803,0.05929858491543678,0.05929858491543678,0.04427743881741981,0.04427743881741981,0.028531388628933663,0.028531388628933663,0.0123412297999872,0.0123412297999872]
  ];
  var binomialCoefficients = [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]];
  function binomials(n, k) {
    return binomialCoefficients[n][k];
  }
  function getDerivative(derivative, t, vs) {
    var n = vs.length - 1,
        _vs,
        value,
        k;
    if (n === 0) {
      return 0;
    }
    if (derivative === 0) {
      value = 0;
      for (k = 0; k <= n; k++) {
        value += binomials(n, k) * Math.pow(1 - t, n - k) * Math.pow(t, k) * vs[k];
      }
      return value;
    } else {
      _vs = new Array(n);
      for (k = 0; k < n; k++) {
        _vs[k] = n * (vs[k + 1] - vs[k]);
      }
      return getDerivative(derivative - 1, t, _vs);
    }
  }
  function B(xs, ys, t) {
    var xbase = getDerivative(1, t, xs);
    var ybase = getDerivative(1, t, ys);
    var combined = xbase * xbase + ybase * ybase;
    return Math.sqrt(combined);
  }
  function getCubicArcLength(xs, ys, t) {
    var z, sum, i, correctedT;
    if (t === undefined) {
      t = 1;
    }
    var n = 20;
    z = t / 2;
    sum = 0;
    for (i = 0; i < n; i++) {
      correctedT = z * tValues[n][i] + z;
      sum += cValues[n][i] * B(xs, ys, correctedT);
    }
    return z * sum;
  }
  function Arc(x0, y0, rx,ry, xAxisRotate, LargeArcFlag,SweepFlag, x,y) {
    return new Arc$1(x0, y0, rx,ry, xAxisRotate, LargeArcFlag,SweepFlag, x,y);
  }
  function Arc$1(x0, y0,rx,ry, xAxisRotate, LargeArcFlag, SweepFlag,x1,y1) {
    this.x0 = x0;
    this.y0 = y0;
    this.rx = rx;
    this.ry = ry;
    this.xAxisRotate = xAxisRotate;
    this.LargeArcFlag = LargeArcFlag;
    this.SweepFlag = SweepFlag;
    this.x1 = x1;
    this.y1 = y1;
    var lengthProperties = approximateArcLengthOfCurve(300, function(t) {
      return pointOnEllipticalArc({x: x0, y:y0}, rx, ry, xAxisRotate,
                                   LargeArcFlag, SweepFlag, {x: x1, y:y1}, t);
    });
    this.length = lengthProperties.arcLength;
  }
  Arc$1.prototype = {
    constructor: Arc$1,
    init: function() {
    },
    getTotalLength: function() {
      return this.length;
    },
    getPointAtLength: function(fractionLength) {
      if(fractionLength < 0){
        fractionLength = 0;
      } else if(fractionLength > this.length){
        fractionLength = this.length;
      }
      var position = pointOnEllipticalArc({x: this.x0, y:this.y0},
        this.rx, this.ry, this.xAxisRotate,
        this.LargeArcFlag, this.SweepFlag,
        {x: this.x1, y: this.y1},
        fractionLength/this.length);
      return {x: position.x, y: position.y};
    },
    getTangentAtLength: function(fractionLength) {
      if(fractionLength < 0){
          fractionLength = 0;
          } else if(fractionLength > this.length){
          fractionLength = this.length;
          }
          var position = pointOnEllipticalArc({x: this.x0, y:this.y0},
            this.rx, this.ry, this.xAxisRotate,
            this.LargeArcFlag, this.SweepFlag,
            {x: this.x1, y: this.y1},
            fractionLength/this.length);
          return {x: position.x, y: position.y};
    },
    getPropertiesAtLength: function(fractionLength){
      var tangent = this.getTangentAtLength(fractionLength);
      var point = this.getPointAtLength(fractionLength);
      return {x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y};
    }
  };
  function pointOnEllipticalArc(p0, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, p1, t) {
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    xAxisRotation = mod(xAxisRotation, 360);
    var xAxisRotationRadians = toRadians(xAxisRotation);
    if(p0.x === p1.x && p0.y === p1.y) {
      return p0;
    }
    if(rx === 0 || ry === 0) {
      return this.pointOnLine(p0, p1, t);
    }
    var dx = (p0.x-p1.x)/2;
    var dy = (p0.y-p1.y)/2;
    var transformedPoint = {
      x: Math.cos(xAxisRotationRadians)*dx + Math.sin(xAxisRotationRadians)*dy,
      y: -Math.sin(xAxisRotationRadians)*dx + Math.cos(xAxisRotationRadians)*dy
    };
    var radiiCheck = Math.pow(transformedPoint.x, 2)/Math.pow(rx, 2) + Math.pow(transformedPoint.y, 2)/Math.pow(ry, 2);
    if(radiiCheck > 1) {
      rx = Math.sqrt(radiiCheck)*rx;
      ry = Math.sqrt(radiiCheck)*ry;
    }
    var cSquareNumerator = Math.pow(rx, 2)*Math.pow(ry, 2) - Math.pow(rx, 2)*Math.pow(transformedPoint.y, 2) - Math.pow(ry, 2)*Math.pow(transformedPoint.x, 2);
    var cSquareRootDenom = Math.pow(rx, 2)*Math.pow(transformedPoint.y, 2) + Math.pow(ry, 2)*Math.pow(transformedPoint.x, 2);
    var cRadicand = cSquareNumerator/cSquareRootDenom;
    cRadicand = cRadicand < 0 ? 0 : cRadicand;
    var cCoef = (largeArcFlag !== sweepFlag ? 1 : -1) * Math.sqrt(cRadicand);
    var transformedCenter = {
      x: cCoef*((rx*transformedPoint.y)/ry),
      y: cCoef*(-(ry*transformedPoint.x)/rx)
    };
    var center = {
      x: Math.cos(xAxisRotationRadians)*transformedCenter.x - Math.sin(xAxisRotationRadians)*transformedCenter.y + ((p0.x+p1.x)/2),
      y: Math.sin(xAxisRotationRadians)*transformedCenter.x + Math.cos(xAxisRotationRadians)*transformedCenter.y + ((p0.y+p1.y)/2)
    };
    var startVector = {
      x: (transformedPoint.x-transformedCenter.x)/rx,
      y: (transformedPoint.y-transformedCenter.y)/ry
    };
    var startAngle = angleBetween({
      x: 1,
      y: 0
    }, startVector);
    var endVector = {
      x: (-transformedPoint.x-transformedCenter.x)/rx,
      y: (-transformedPoint.y-transformedCenter.y)/ry
    };
    var sweepAngle = angleBetween(startVector, endVector);
    if(!sweepFlag && sweepAngle > 0) {
      sweepAngle -= 2*Math.PI;
    }
    else if(sweepFlag && sweepAngle < 0) {
      sweepAngle += 2*Math.PI;
    }
    sweepAngle %= 2*Math.PI;
    var angle = startAngle+(sweepAngle*t);
    var ellipseComponentX = rx*Math.cos(angle);
    var ellipseComponentY = ry*Math.sin(angle);
    var point = {
      x: Math.cos(xAxisRotationRadians)*ellipseComponentX - Math.sin(xAxisRotationRadians)*ellipseComponentY + center.x,
      y: Math.sin(xAxisRotationRadians)*ellipseComponentX + Math.cos(xAxisRotationRadians)*ellipseComponentY + center.y
    };
    point.ellipticalArcStartAngle = startAngle;
    point.ellipticalArcEndAngle = startAngle+sweepAngle;
    point.ellipticalArcAngle = angle;
    point.ellipticalArcCenter = center;
    point.resultantRx = rx;
    point.resultantRy = ry;
    return point;
  }
  function approximateArcLengthOfCurve(resolution, pointOnCurveFunc) {
    resolution = resolution ? resolution : 500;
    var resultantArcLength = 0;
    var arcLengthMap = [];
    var approximationLines = [];
    var prevPoint = pointOnCurveFunc(0);
    var nextPoint;
    for(var i = 0; i < resolution; i++) {
      var t = clamp(i*(1/resolution), 0, 1);
      nextPoint = pointOnCurveFunc(t);
      resultantArcLength += distance$1(prevPoint, nextPoint);
      approximationLines.push([prevPoint, nextPoint]);
      arcLengthMap.push({
        t: t,
        arcLength: resultantArcLength
      });
      prevPoint = nextPoint;
    }
    nextPoint = pointOnCurveFunc(1);
    approximationLines.push([prevPoint, nextPoint]);
    resultantArcLength += distance$1(prevPoint, nextPoint);
    arcLengthMap.push({
      t: 1,
      arcLength: resultantArcLength
    });
    return {
      arcLength: resultantArcLength,
      arcLengthMap: arcLengthMap,
      approximationLines: approximationLines
    };
  }
  function mod(x, m) {
    return (x%m + m)%m;
  }
  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }
  function distance$1(p0, p1) {
    return Math.sqrt(Math.pow(p1.x-p0.x, 2) + Math.pow(p1.y-p0.y, 2));
  }
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
  function angleBetween(v0, v1) {
    var p = v0.x*v1.x + v0.y*v1.y;
    var n = Math.sqrt((Math.pow(v0.x, 2)+Math.pow(v0.y, 2)) * (Math.pow(v1.x, 2)+Math.pow(v1.y, 2)));
    var sign = v0.x*v1.y - v0.y*v1.x < 0 ? -1 : 1;
    var angle = sign*Math.acos(p/n);
    return angle;
  }
  function LinearPosition(x0, x1, y0, y1) {
    return new LinearPosition$1(x0, x1, y0, y1);
  }
  function LinearPosition$1(x0, x1, y0, y1){
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
  }
  LinearPosition$1.prototype.getTotalLength = function(){
    return Math.sqrt(Math.pow(this.x0 - this.x1, 2) +
           Math.pow(this.y0 - this.y1, 2));
  };
  LinearPosition$1.prototype.getPointAtLength = function(pos){
    var fraction = pos/ (Math.sqrt(Math.pow(this.x0 - this.x1, 2) +
           Math.pow(this.y0 - this.y1, 2)));
    var newDeltaX = (this.x1 - this.x0)*fraction;
    var newDeltaY = (this.y1 - this.y0)*fraction;
    return { x: this.x0 + newDeltaX, y: this.y0 + newDeltaY };
  };
  LinearPosition$1.prototype.getTangentAtLength = function(){
    var module = Math.sqrt((this.x1 - this.x0) * (this.x1 - this.x0) +
                (this.y1 - this.y0) * (this.y1 - this.y0));
    return { x: (this.x1 - this.x0)/module, y: (this.y1 - this.y0)/module };
  };
  LinearPosition$1.prototype.getPropertiesAtLength = function(pos){
    var point = this.getPointAtLength(pos);
    var tangent = this.getTangentAtLength();
    return {x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y};
  };
  function PathProperties(svgString) {
    var length = 0;
    var partial_lengths = [];
    var functions = [];
    function svgProperties(string){
      if(!string){return null;}
      var parsed = parse(string);
      var cur = [0, 0];
      var prev_point = [0, 0];
      var curve;
      var ringStart;
      for (var i = 0; i < parsed.length; i++){
        if(parsed[i][0] === "M"){
          cur = [parsed[i][1], parsed[i][2]];
          ringStart = [cur[0], cur[1]];
          functions.push(null);
        } else if(parsed[i][0] === "m"){
          cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
          ringStart = [cur[0], cur[1]];
          functions.push(null);
        }
        else if(parsed[i][0] === "L"){
          length = length + Math.sqrt(Math.pow(cur[0] - parsed[i][1], 2) + Math.pow(cur[1] - parsed[i][2], 2));
          functions.push(new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2]));
          cur = [parsed[i][1], parsed[i][2]];
        } else if(parsed[i][0] === "l"){
          length = length + Math.sqrt(Math.pow(parsed[i][1], 2) + Math.pow(parsed[i][2], 2));
          functions.push(new LinearPosition(cur[0], parsed[i][1] + cur[0], cur[1], parsed[i][2] + cur[1]));
          cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
        } else if(parsed[i][0] === "H"){
          length = length + Math.abs(cur[0] - parsed[i][1]);
          functions.push(new LinearPosition(cur[0], parsed[i][1], cur[1], cur[1]));
          cur[0] = parsed[i][1];
        } else if(parsed[i][0] === "h"){
          length = length + Math.abs(parsed[i][1]);
          functions.push(new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1]));
          cur[0] = parsed[i][1] + cur[0];
        } else if(parsed[i][0] === "V"){
          length = length + Math.abs(cur[1] - parsed[i][1]);
          functions.push(new LinearPosition(cur[0], cur[0], cur[1], parsed[i][1]));
          cur[1] = parsed[i][1];
        } else if(parsed[i][0] === "v"){
          length = length + Math.abs(parsed[i][1]);
          functions.push(new LinearPosition(cur[0], cur[0], cur[1], cur[1] + parsed[i][1]));
          cur[1] = parsed[i][1] + cur[1];
        }  else if(parsed[i][0] === "z" || parsed[i][0] === "Z"){
          length = length + Math.sqrt(Math.pow(ringStart[0] - cur[0], 2) + Math.pow(ringStart[1] - cur[1], 2));
          functions.push(new LinearPosition(cur[0], ringStart[0], cur[1], ringStart[1]));
          cur = [ringStart[0], ringStart[1]];
        }
        else if(parsed[i][0] === "C"){
          curve = new Bezier(cur[0], cur[1] , parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4] , parsed[i][5], parsed[i][6]);
          length = length + curve.getTotalLength();
          cur = [parsed[i][5], parsed[i][6]];
          functions.push(curve);
        } else if(parsed[i][0] === "c"){
          curve = new Bezier(cur[0], cur[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4] , cur[0] + parsed[i][5], cur[1] + parsed[i][6]);
          if(curve.getTotalLength() > 0){
            length = length + curve.getTotalLength();
            functions.push(curve);
            cur = [parsed[i][5] + cur[0], parsed[i][6] + cur[1]];
          } else {
            functions.push(new LinearPosition(cur[0], cur[0], cur[1], cur[1]));
          }
        } else if(parsed[i][0] === "S"){
          if(i>0 && ["C","c","S","s"].indexOf(parsed[i-1][0]) > -1){
            curve = new Bezier(cur[0], cur[1] , 2*cur[0] - parsed[i-1][parsed[i-1].length - 4], 2*cur[1] - parsed[i-1][parsed[i-1].length - 3], parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
          } else {
            curve = new Bezier(cur[0], cur[1] , cur[0], cur[1], parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
          }
          length = length + curve.getTotalLength();
          cur = [parsed[i][3], parsed[i][4]];
          functions.push(curve);
        }  else if(parsed[i][0] === "s"){
          if(i>0 && ["C","c","S","s"].indexOf(parsed[i-1][0]) > -1){
            curve = new Bezier(cur[0], cur[1] , cur[0] + curve.d.x - curve.c.x, cur[1] + curve.d.y - curve.c.y, cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
          } else {
            curve = new Bezier(cur[0], cur[1] , cur[0], cur[1], cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
          }
          length = length + curve.getTotalLength();
          cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
          functions.push(curve);
        }
        else if(parsed[i][0] === "Q"){
          if(cur[0] == parsed[i][1] && cur[1] == parsed[i][2]){
            curve = new LinearPosition(parsed[i][1], parsed[i][3], parsed[i][2], parsed[i][4]);
          } else {
            curve = new Bezier(cur[0], cur[1] , parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
          }
          length = length + curve.getTotalLength();
          functions.push(curve);
          cur = [parsed[i][3], parsed[i][4]];
          prev_point = [parsed[i][1], parsed[i][2]];
        }  else if(parsed[i][0] === "q"){
          if(!(parsed[i][1] == 0 && parsed[i][2] == 0)){
            curve = new Bezier(cur[0], cur[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
          } else {
            curve = new LinearPosition(cur[0] + parsed[i][1], cur[0] + parsed[i][3], cur[1] + parsed[i][2], cur[1] + parsed[i][4]);
          }
          length = length + curve.getTotalLength();
          prev_point = [cur[0] + parsed[i][1], cur[1] + parsed[i][2]];
          cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
          functions.push(curve);
        } else if(parsed[i][0] === "T"){
          if(i>0 && ["Q","q","T","t"].indexOf(parsed[i-1][0]) > -1){
            curve = new Bezier(cur[0], cur[1] , 2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1] , parsed[i][1], parsed[i][2]);
          } else {
            curve = new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2]);
          }
          functions.push(curve);
          length = length + curve.getTotalLength();
          prev_point = [2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1]];
          cur = [parsed[i][1], parsed[i][2]];
        } else if(parsed[i][0] === "t"){
          if(i>0 && ["Q","q","T","t"].indexOf(parsed[i-1][0]) > -1){
            curve = new Bezier(cur[0], cur[1] , 2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2]);
          } else {
            curve = new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1] + parsed[i][2]);
          }
          length = length + curve.getTotalLength();
          prev_point = [2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1]];
          cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[0]];
          functions.push(curve);
        } else if(parsed[i][0] === "A"){
          curve = new Arc(cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4], parsed[i][5], parsed[i][6], parsed[i][7]);
          length = length + curve.getTotalLength();
          cur = [parsed[i][6], parsed[i][7]];
          functions.push(curve);
        } else if(parsed[i][0] === "a"){
          curve = new Arc(cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4], parsed[i][5], cur[0] + parsed[i][6], cur[1] + parsed[i][7]);
          length = length + curve.getTotalLength();
          cur = [cur[0] + parsed[i][6], cur[1] + parsed[i][7]];
          functions.push(curve);
        }
        partial_lengths.push(length);
      }
      return svgProperties;
    }
   svgProperties.getTotalLength = function(){
      return length;
    };
    svgProperties.getPointAtLength = function(fractionLength){
      var fractionPart = getPartAtLength(fractionLength);
      return functions[fractionPart.i].getPointAtLength(fractionPart.fraction);
    };
    svgProperties.getTangentAtLength = function(fractionLength){
      var fractionPart = getPartAtLength(fractionLength);
      return functions[fractionPart.i].getTangentAtLength(fractionPart.fraction);
    };
    svgProperties.getPropertiesAtLength = function(fractionLength){
      var fractionPart = getPartAtLength(fractionLength);
      return functions[fractionPart.i].getPropertiesAtLength(fractionPart.fraction);
    };
    svgProperties.getParts = function(){
      var parts = [];
      for(var i = 0; i< functions.length; i++){
        if(functions[i] != null){
          var properties = {};
          properties['start'] = functions[i].getPointAtLength(0);
          properties['end'] = functions[i].getPointAtLength(partial_lengths[i] - partial_lengths[i-1]);
          properties['length'] = partial_lengths[i] - partial_lengths[i-1];
          (function(func){
            properties['getPointAtLength'] = function(d){return func.getPointAtLength(d);};
            properties['getTangentAtLength'] = function(d){return func.getTangentAtLength(d);};
            properties['getPropertiesAtLength'] = function(d){return func.getPropertiesAtLength(d);};
          })(functions[i]);
          parts.push(properties);
        }
      }
      return parts;
    };
    var getPartAtLength = function(fractionLength){
      if(fractionLength < 0){
        fractionLength = 0;
      } else if(fractionLength > length){
        fractionLength = length;
      }
      var i = partial_lengths.length - 1;
      while(partial_lengths[i] >= fractionLength && partial_lengths[i] > 0){
        i--;
      }
      i++;
      return {fraction: fractionLength-partial_lengths[i-1], i: i};
    };
    return svgProperties(svgString);
  }
  const emptyValue = { value: 0 };
  const pointStringToArray = function (str) {
    return str.split(" ")
      .filter(s => s !== "")
      .map(p => p.split(",")
        .map(n => parseFloat(n)));
  };
  const getAttributes = function (element, attributeList) {
    const indices = attributeList.map((attr) => {
      for (let i = 0; i < element.attributes.length; i += 1) {
        if (element.attributes[i].nodeName === attr) {
          return i;
        }
      }
      return undefined;
    });
    return indices
      .map(i => (i === undefined ? emptyValue : element.attributes[i]))
      .map(attr => (attr.value !== undefined ? attr.value : attr.baseVal.value));
  };
  const svg_line_to_segments = function (line) {
    return [getAttributes(line, ["x1", "y1", "x2", "y2"])];
  };
  const svg_rect_to_segments = function (rect) {
    const attrs = getAttributes(rect, ["x", "y", "width", "height"]);
    const x = parseFloat(attrs[0]);
    const y = parseFloat(attrs[1]);
    const width = parseFloat(attrs[2]);
    const height = parseFloat(attrs[3]);
    return [
      [x, y, x + width, y],
      [x + width, y, x + width, y + height],
      [x + width, y + height, x, y + height],
      [x, y + height, x, y],
    ];
  };
  const svg_circle_to_segments = function (circle, RESOLUTION = 64) {
    const attrs = getAttributes(circle, ["cx", "cy", "r"]);
    const cx = parseFloat(attrs[0]);
    const cy = parseFloat(attrs[1]);
    const r = parseFloat(attrs[2]);
    return Array.from(Array(RESOLUTION))
      .map((_, i) => [
        cx + r * Math.cos(i / RESOLUTION * Math.PI * 2),
        cy + r * Math.sin(i / RESOLUTION * Math.PI * 2),
      ]).map((_, i, arr) => [
        arr[i][0],
        arr[i][1],
        arr[(i + 1) % arr.length][0],
        arr[(i + 1) % arr.length][1],
      ]);
  };
  const svg_ellipse_to_segments = function (ellipse, RESOLUTION = 64) {
    const attrs = getAttributes(ellipse, ["cx", "cy", "rx", "ry"]);
    const cx = parseFloat(attrs[0]);
    const cy = parseFloat(attrs[1]);
    const rx = parseFloat(attrs[2]);
    const ry = parseFloat(attrs[3]);
    return Array.from(Array(RESOLUTION))
      .map((_, i) => [
        cx + rx * Math.cos(i / RESOLUTION * Math.PI * 2),
        cy + ry * Math.sin(i / RESOLUTION * Math.PI * 2),
      ]).map((_, i, arr) => [
        arr[i][0],
        arr[i][1],
        arr[(i + 1) % arr.length][0],
        arr[(i + 1) % arr.length][1],
      ]);
  };
  const svg_polygon_to_segments = function (polygon) {
    let points = "";
    for (let i = 0; i < polygon.attributes.length; i += 1) {
      if (polygon.attributes[i].nodeName === "points") {
        points = polygon.attributes[i].value;
        break;
      }
    }
    return pointStringToArray(points)
      .map((_, i, a) => [
        a[i][0],
        a[i][1],
        a[(i + 1) % a.length][0],
        a[(i + 1) % a.length][1],
      ]);
  };
  const svg_polyline_to_segments = function (polyline) {
    const circularPath = svg_polygon_to_segments(polyline);
    circularPath.pop();
    return circularPath;
  };
  const svg_path_to_segments = function (path, RESOLUTION = 128) {
    const d = path.getAttribute("d");
    const prop = PathProperties(d);
    const length = prop.getTotalLength();
    const isClosed = (d[d.length - 1] === "Z" || d[d.length - 1] === "z");
    const segmentLength = (isClosed
      ? length / RESOLUTION
      : length / (RESOLUTION - 1));
    const pathsPoints = Array.from(Array(RESOLUTION))
      .map((_, i) => prop.getPointAtLength(i * segmentLength))
      .map(p => [p.x, p.y]);
    const segments = pathsPoints.map((_, i, a) => [
      a[i][0],
      a[i][1],
      a[(i + 1) % a.length][0],
      a[(i + 1) % a.length][1],
    ]);
    if (!isClosed) { segments.pop(); }
    return segments;
  };
  const parsers = {
    line: svg_line_to_segments,
    rect: svg_rect_to_segments,
    circle: svg_circle_to_segments,
    ellipse: svg_ellipse_to_segments,
    polygon: svg_polygon_to_segments,
    polyline: svg_polyline_to_segments,
    path: svg_path_to_segments,
  };
  var attributes = {
    line: ["x1", "y1", "x2", "y2"],
    rect: ["x", "y", "width", "height"],
    circle: ["cx", "cy", "r"],
    ellipse: ["cx", "cy", "rx", "ry"],
    polygon: ["points"],
    polyline: ["points"],
    path: ["d"],
  };
  const flattenTree = function (element) {
    if (element.tagName === "g" || element.tagName === "svg") {
      if (element.childNodes == null) { return []; }
      return Array.from(element.childNodes)
        .map(child => flattenTree(child))
        .reduce((a, b) => a.concat(b), []);
    }
    return [element];
  };
  const multiply_line_matrix2 = function (line, matrix) {
    return [
      line[0] * matrix[0] + line[1] * matrix[2] + matrix[4],
      line[0] * matrix[1] + line[1] * matrix[3] + matrix[5],
      line[2] * matrix[0] + line[3] * matrix[2] + matrix[4],
      line[2] * matrix[1] + line[3] * matrix[3] + matrix[5],
    ];
  };
  const multiply_matrices2$1 = function (m1, m2) {
    return [
      m1[0] * m2[0] + m1[2] * m2[1],
      m1[1] * m2[0] + m1[3] * m2[1],
      m1[0] * m2[2] + m1[2] * m2[3],
      m1[1] * m2[2] + m1[3] * m2[3],
      m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
      m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
    ];
  };
  const parseTransform = function (transform) {
    const parsed = transform.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?\s*)+\))+/g);
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
    const cos_p = Math.cos(params[0] / 180 * Math.PI);
    const sin_p = Math.sin(params[0] / 180 * Math.PI);
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
    return [1, 0, Math.tan(params[0] / 180 * Math.PI), 1, 0, 0];
  };
  const matrixFormSkewY = function (params) {
    return [1, Math.tan(params[0] / 180 * Math.PI), 0, 1, 0, 0];
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
      .reduce((a, b) => multiply_matrices2$1(a, b), [1, 0, 0, 1, 0, 0]);
  };
  const get_transform_as_matrix = function (element) {
    if (typeof element.getAttribute !== "function") {
      return [1, 0, 0, 1, 0, 0];
    }
    const transformAttr = element.getAttribute("transform");
    if (transformAttr != null && transformAttr !== "") {
      return transformStringToMatrix(transformAttr);
    }
    return [1, 0, 0, 1, 0, 0];
  };
  const apply_nested_transforms = function (element, stack = [1, 0, 0, 1, 0, 0]) {
    const local = multiply_matrices2$1(stack, get_transform_as_matrix(element));
    element.matrix = local;
    if (element.tagName === "g" || element.tagName === "svg") {
      if (element.childNodes == null) { return; }
      Array.from(element.childNodes)
        .forEach(child => apply_nested_transforms(child, local));
    }
  };
  const parseable = Object.keys(parsers);
  const attribute_list = function (element) {
    return Array.from(element.attributes)
      .filter(a => attributes[element.tagName].indexOf(a.name) === -1);
  };
  const objectifyAttributeList = function (list) {
    const obj = {};
    list.forEach((a) => { obj[a.nodeName] = a.value; });
    return obj;
  };
  const segmentize = function (input, options = {}) {
    const RESOLUTION = typeof options.resolution === "object"
      ? options.resolution
      : {};
    if (typeof options.resolution === "number") {
      ["circle", "ellipse", "path"].forEach((k) => {
        RESOLUTION[k] = options.resolution;
      });
    }
    apply_nested_transforms(input);
    const elements = flattenTree(input);
    const lineSegments = elements
      .filter(el => parseable.indexOf(el.tagName) !== -1)
      .map(el => parsers[el.tagName](el, RESOLUTION[el.tagName])
        .map(unit => multiply_line_matrix2(unit, el.matrix))
        .map(unit => [...unit, attribute_list(el)]))
      .reduce((a, b) => a.concat(b), []);
    lineSegments
      .filter(a => a[4] !== undefined)
      .forEach((seg) => {
        const noTransforms = seg[4].filter(a => a.nodeName !== "transform");
        seg[4] = objectifyAttributeList(noTransforms);
      });
    return lineSegments;
  };
  var svgNS$1 = "http://www.w3.org/2000/svg";
  const svgAttributes = [
    "version",
    "xmlns",
    "contentScriptType",
    "contentStyleType",
    "baseProfile",
    "class",
    "externalResourcesRequired",
    "x",
    "y",
    "width",
    "height",
    "viewBox",
    "preserveAspectRatio",
    "zoomAndPan",
    "style",
  ];
  const headerTagNames = {
    "defs": true,
    "metadata": true,
    "title": true,
    "desc": true,
    "style": true,
  };
  const segmentsToSVG = function (lineSegments, inputSVG) {
    const newSVG = win$3.document.createElementNS(svgNS$1, "svg");
    if (inputSVG !== undefined) {
      svgAttributes.map(a => ({ attribute: a, value: inputSVG.getAttribute(a) }))
        .filter(obj => obj.value != null && obj.value !== "")
        .forEach(obj => newSVG.setAttribute(obj.attribute, obj.value));
    }
    if (newSVG.getAttribute("xmlns") === null) {
      newSVG.setAttribute("xmlns", svgNS$1);
    }
    Array.from(inputSVG.childNodes)
      .filter(el => headerTagNames[el.tagName])
      .map(el => el.cloneNode(true))
      .forEach(el => newSVG.appendChild(el));
    lineSegments.forEach((s) => {
      const line = win$3.document.createElementNS(svgNS$1, "line");
      attributes.line.forEach((attr, i) => line.setAttributeNS(null, attr, s[i]));
      if (s[4] != null) {
        Object.keys(s[4]).forEach(key => line.setAttribute(key, s[4][key]));
      }
      newSVG.appendChild(line);
    });
    return newSVG;
  };
  const defaults = Object.freeze({
    input: "string",
    output: "string",
    resolution: Object.freeze({
      circle: 64,
      ellipse: 64,
      path: 128
    })
  });
  const xmlStringToDOM = function (input) {
    return (typeof input === "string" || input instanceof String
      ? (new win$3.DOMParser()).parseFromString(input, "text/xml").documentElement
      : input);
  };
  const Segmentize = function (input, options = defaults) {
    const inputSVG = options.input === "svg"
      ? input
      : xmlStringToDOM(input);
    const lineSegments = segmentize(inputSVG, options);
    if (options.output === "data") {
      return lineSegments;
    }
    const newSVG = segmentsToSVG(lineSegments, inputSVG);
    if (options.output === "svg") {
      return newSVG;
    }
    const stringified = new win$3.XMLSerializer().serializeToString(newSVG);
    return vkXML$1(stringified);
  };

  const FOLD = { convert };
  const assignment_foldAngle = {
    V: 180, v: 180, M: -180, m: -180
  };
  const assignment_to_foldAngle = function (assignment) {
    return assignment_foldAngle[assignment] || 0;
  };
  const emptyFOLD = function () {
    return {
      file_spec: 1.1,
      file_creator: "Rabbit Ear",
      file_classes: ["singleModel"],
      frame_title: "",
      frame_classes: ["creasePattern"],
      frame_attributes: ["2D"],
      vertices_coords: [],
      vertices_vertices: [],
      vertices_faces: [],
      edges_vertices: [],
      edges_faces: [],
      edges_assignment: [],
      edges_foldAngle: [],
      edges_length: [],
      faces_vertices: [],
      faces_edges: []
    };
  };
  const svg_to_fold = function (svg, options) {
    const pre_frag = emptyFOLD();
    const v0 = pre_frag.vertices_coords.length;
    const segments = Segmentize(svg, { output: "data" });
    pre_frag.vertices_coords = segments
      .map(s => [[s[0], s[1]], [s[2], s[3]]])
      .reduce((a, b) => a.concat(b), pre_frag.vertices_coords);
    pre_frag.edges_vertices = segments.map((_, i) => [v0 + i * 2, v0 + i * 2 + 1]);
    pre_frag.edges_assignment = segments
      .map(a => a[4])
      .map(attrs => (attrs != null ? color_to_assignment(attrs.stroke) : "U"));
    const graph = fragment$1(pre_frag, options.epsilon);
    FOLD.convert.edges_vertices_to_vertices_vertices_sorted(graph);
    FOLD.convert.vertices_vertices_to_faces_vertices(graph);
    FOLD.convert.faces_vertices_to_faces_edges(graph);
    graph.edges_foldAngle = graph.edges_assignment.map(a => assignment_to_foldAngle(a));
    if (options.boundary !== false) {
      search_boundary(graph).forEach((edgeIndex) => {
        graph.edges_assignment[edgeIndex] = "B";
      });
    }
    return graph;
  };

  const SVGtoFOLD = function (input, options = {}) {
    if (typeof input === "string") {
      const svg = (new win$2.DOMParser())
        .parseFromString(input, "text/xml").documentElement;
      return svg_to_fold(svg, options);
    }
    return svg_to_fold(input, options);
  };
  SVGtoFOLD.core = {
    segmentize: () => { },
    fragment: fragment$1
  };

  const from_to = function (data, from, to, ...args) {
    switch (from) {
      case "fold":
        switch (to) {
          case "fold": return data;
          case "oripa": return oripa.fromFold(data);
          case "svg": return FoldToSvg(data, ...args);
        }
        break;
      case "oripa":
        switch (to) {
          case "fold": return oripa.toFold(data, true);
          case "oripa": return data;
          case "svg": return FoldToSvg(oripa.toFold(data, true), ...args);
        }
        break;
      case "svg":
        switch (to) {
          case "fold": return SVGtoFOLD(data, ...args);
          case "oripa": return oripa.fromFold(SVGtoFOLD(data, ...args));
          case "svg": return data;
        }
        break;
    }
    return undefined;
  };

  const capitalized = s => s.charAt(0).toUpperCase() + s.slice(1);
  const permute = function (string) {
    const lower = string.toLowerCase();
    const upper = string.toUpperCase();
    const capital = capitalized(lower);
    const variations = [lower, upper, capital];
    const prefixes = ["", "to", "into"];
    return prefixes.map(pre => variations.map(v => pre + v))
      .reduce((a, b) => a.concat(b), []);
  };
  const convert$1 = function (...file) {
    const loaded = load(...file);
    const c = {};
    ["fold", "svg", "oripa"].forEach(filetype => permute(filetype)
      .forEach(key => Object.defineProperty(c, key, {
        value: (...o) => from_to(loaded.data, loaded.type, filetype, ...o)
      })));
    return c;
  };

  const metadata = function (complete = false) {
    return !complete
      ? {
        file_spec,
        file_creator
      }
      : {
        file_spec,
        file_creator,
        file_author: "",
        file_title: "",
        file_description: "",
        file_classes: [],
        file_frames: [],
        frame_description: "",
        frame_attributes: [],
        frame_classes: [],
        frame_unit: "",
      };
  };
  const default_re_extensions = function (number_faces = 1) {
    return {
      "faces_re:layer": Array.from(Array(number_faces)).map((_, i) => i),
      "faces_re:matrix": Array.from(Array(number_faces)).map(() => [1, 0, 0, 1, 0, 0])
    };
  };
  const cp_type = function () {
    return {
      file_classes: ["singleModel"],
      frame_attributes: ["2D"],
      frame_classes: ["creasePattern"],
    };
  };
  const square_graph = function () {
    return {
      vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
      vertices_vertices: [[1, 3], [2, 0], [3, 1], [0, 2]],
      vertices_faces: [[0], [0], [0], [0]],
      edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0]],
      edges_faces: [[0], [0], [0], [0]],
      edges_assignment: ["B", "B", "B", "B"],
      edges_foldAngle: [0, 0, 0, 0],
      edges_length: [1, 1, 1, 1],
      faces_vertices: [[0, 1, 2, 3]],
      faces_edges: [[0, 1, 2, 3]],
    };
  };
  const empty = function (prototype = null) {
    return Object.assign(
      Object.create(prototype),
      metadata()
    );
  };
  const square = function (prototype = null) {
    return Object.assign(
      Object.create(prototype),
      metadata(),
      cp_type(),
      square_graph(),
      default_re_extensions(1)
    );
  };
  const rectangle = function (width = 1, height = 1) {
    const graph = square_graph();
    graph.vertices_coords = [[0, 0], [width, 0], [width, height], [0, height]];
    graph.edges_length = [width, height, width, height];
    return Object.assign(
      Object.create(null),
      metadata(),
      cp_type(),
      graph,
      default_re_extensions(1)
    );
  };
  const regular_polygon = function (sides, radius = 1) {
    const arr = Array.from(Array(sides));
    const angle = 2 * Math.PI / sides;
    const sideLength = math.core.clean_number(Math.sqrt(
      ((radius - radius * Math.cos(angle)) ** 2)
      + ((radius * Math.sin(angle)) ** 2),
    ));
    const graph = {
      vertices_coords: arr.map((_, i) => angle * i).map(a => [
        math.core.clean_number(radius * Math.cos(a)),
        math.core.clean_number(radius * Math.sin(a)),
      ]),
      vertices_vertices: arr
        .map((_, i) => [(i + 1) % arr.length, (i + arr.length - 1) % arr.length]),
      vertices_faces: arr.map(() => [0]),
      edges_vertices: arr.map((_, i) => [i, (i + 1) % arr.length]),
      edges_faces: arr.map(() => [0]),
      edges_assignment: arr.map(() => "B"),
      edges_foldAngle: arr.map(() => 0),
      edges_length: arr.map(() => sideLength),
      faces_vertices: [arr.map((_, i) => i)],
      faces_edges: [arr.map((_, i) => i)],
    };
    return Object.assign(
      Object.create(null),
      metadata(),
      cp_type(),
      graph,
      default_re_extensions(1)
    );
  };

  const new_vertex = function (graph, x, y) {
    if (graph.vertices_coords === undefined) { return undefined; }
    const vertices_count = graph.vertices_coords.length;
    graph.vertices_coords[vertices_count] = [x, y];
    return vertices_count;
  };
  const add_vertex_on_edge = function (graph, x, y, old_edge_index) {
    if (graph.edges_vertices.length < old_edge_index) { return undefined; }
    const new_vertex_index = new_vertex(graph, x, y);
    const incident_vertices = graph.edges_vertices[old_edge_index];
    if (graph.vertices_vertices == null) { graph.vertices_vertices = []; }
    graph.vertices_vertices[new_vertex_index] = clone(incident_vertices);
    incident_vertices.forEach((v, i, arr) => {
      const otherV = arr[(i + 1) % arr.length];
      const otherI = graph.vertices_vertices[v].indexOf(otherV);
      graph.vertices_vertices[v][otherI] = new_vertex_index;
    });
    if (graph.edges_faces != null && graph.edges_faces[old_edge_index] != null) {
      graph.vertices_faces[new_vertex_index] = clone(
        graph.edges_faces[old_edge_index],
      );
    }
    const new_edges = [
      { edges_vertices: [incident_vertices[0], new_vertex_index] },
      { edges_vertices: [new_vertex_index, incident_vertices[1]] },
    ];
    new_edges.forEach((e, i) => { e.i = graph.edges_vertices.length + i; });
    ["edges_faces", "edges_assignment", "edges_foldAngle"]
      .filter(key => graph[key] != null && graph[key][old_edge_index] != null)
      .forEach((key) => {
        new_edges[0][key] = clone(graph[key][old_edge_index]);
        new_edges[1][key] = clone(graph[key][old_edge_index]);
      });
    new_edges.forEach((el, i) => {
      const verts = el.edges_vertices.map(v => graph.vertices_coords[v]);
      new_edges[i].edges_length = math.core.distance2(...verts);
    });
    new_edges.forEach(edge => Object.keys(edge)
      .filter(key => key !== "i")
      .filter(key => graph[key] !== undefined)
      .forEach((key) => { graph[key][edge.i] = edge[key]; }));
    const incident_faces_indices = graph.edges_faces[old_edge_index];
    const incident_faces_vertices = incident_faces_indices
      .map(i => graph.faces_vertices[i]);
    const incident_faces_edges = incident_faces_indices
      .map(i => graph.faces_edges[i]);
    incident_faces_vertices.forEach(face => face
      .map((fv, i, arr) => {
        const nextI = (i + 1) % arr.length;
        return (fv === incident_vertices[0]
                && arr[nextI] === incident_vertices[1])
                || (fv === incident_vertices[1]
                && arr[nextI] === incident_vertices[0])
          ? nextI : undefined;
      }).filter(el => el !== undefined)
      .sort((a, b) => b - a)
      .forEach(i => face.splice(i, 0, new_vertex_index)));
    incident_faces_edges.forEach((face) => {
      const edgeIndex = face.indexOf(old_edge_index);
      const prevEdge = face[(edgeIndex + face.length - 1) % face.length];
      const nextEdge = face[(edgeIndex + 1) % face.length];
      const vertices = [
        [prevEdge, old_edge_index],
        [old_edge_index, nextEdge],
      ].map((pairs) => {
        const verts = pairs.map(e => graph.edges_vertices[e]);
        return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1]
          ? verts[0][0] : verts[0][1];
      }).reduce((a, b) => a.concat(b), []);
      const edges = [
        [vertices[0], new_vertex_index],
        [new_vertex_index, vertices[1]],
      ].map((verts) => {
        const in0 = verts.map(v => new_edges[0].edges_vertices.indexOf(v) !== -1)
          .reduce((a, b) => a && b, true);
        const in1 = verts.map(v => new_edges[1].edges_vertices.indexOf(v) !== -1)
          .reduce((a, b) => a && b, true);
        if (in0) { return new_edges[0].i; }
        if (in1) { return new_edges[1].i; }
        throw new Error("something wrong with input graph's faces_edges construction");
      });
      if (edgeIndex === face.length - 1) {
        face.splice(edgeIndex, 1, edges[0]);
        face.unshift(edges[1]);
      } else {
        face.splice(edgeIndex, 1, ...edges);
      }
      return edges;
    });
    const edge_map = remove_geometry_key_indices(graph, "edges", [old_edge_index]);
    return {
      vertices: {
        new: [{ index: new_vertex_index }],
      },
      edges: {
        map: edge_map,
        replace: [{
          old: old_edge_index,
          new: new_edges.map(el => el.i),
        }],
      },
    };
  };

  const merge_maps = function (a, b) {
    let aRemoves = [];
    for (let i = 1; i < a.length; i++) {
      if (a[i] !== a[i-1]) { aRemoves.push(i); }
    }
    for (let i = 1; i < b.length; i++) {
      if (b[i] !== b[i-1]) ;
    }
    let bCopy = b.slice();
    aRemoves.forEach(i => bCopy.splice(i, 0, (i === 0) ? 0 : bCopy[i-1] ));
    return a.map((v,i) => v + bCopy[i]);
  };

  const split_convex_polygon$1 = function (
    graph,
    faceIndex,
    linePoint,
    lineVector,
    crease_assignment = "F"
  ) {
    const vertices_intersections = graph.faces_vertices[faceIndex]
      .map(fv => graph.vertices_coords[fv])
      .map(v => (math.core.point_on_line(linePoint, lineVector, v)
        ? v
        : undefined))
      .map((point, i) => ({
        point,
        i_face: i,
        i_vertices: graph.faces_vertices[faceIndex][i]
      }))
      .filter(el => el.point !== undefined);
    const edges_intersections = graph.faces_edges[faceIndex]
      .map(ei => graph.edges_vertices[ei])
      .map(edge => edge.map(e => graph.vertices_coords[e]))
      .map(edge => math.core.intersection.line_segment_exclusive(
        linePoint, lineVector, edge[0], edge[1]
      ))
      .map((point, i) => ({
        point,
        i_face: i,
        i_edges: graph.faces_edges[faceIndex][i]
      }))
      .filter(el => el.point !== undefined);
    let new_v_indices = [];
    let edge_map = Array(graph.edges_vertices.length).fill(0);
    if (edges_intersections.length === 2) {
      new_v_indices = edges_intersections.map((el, i, arr) => {
        const diff = add_vertex_on_edge(
          graph, el.point[0], el.point[1], el.i_edges
        );
        arr.slice(i + 1)
          .filter(ell => diff.edges.map[ell.i_edges] != null)
          .forEach((ell) => { ell.i_edges += diff.edges.map[ell.i_edges]; });
        edge_map = merge_maps(edge_map, diff.edges.map);
        return diff.vertices.new[0].index;
      });
    } else if (edges_intersections.length === 1
            && vertices_intersections.length === 1) {
      const a = vertices_intersections.map(el => el.i_vertices);
      const b = edges_intersections.map((el, i, arr) => {
        const diff = add_vertex_on_edge(
          graph, el.point[0], el.point[1], el.i_edges
        );
        arr.slice(i + 1)
          .filter(ell => diff.edges.map[ell.i_edges] != null)
          .forEach((ell) => { ell.i_edges += diff.edges.map[ell.i_edges]; });
        edge_map = diff.edges.map;
        return diff.vertices.new[0].index;
      });
      new_v_indices = a.concat(b);
    } else if (vertices_intersections.length === 2) {
      new_v_indices = vertices_intersections.map(el => el.i_vertices);
      const face_v = graph.faces_vertices[faceIndex];
      const v_i = vertices_intersections;
      const match_a = face_v[(v_i[0].i_face + 1) % face_v.length] === v_i[1].i_vertices;
      const match_b = face_v[(v_i[1].i_face + 1) % face_v.length] === v_i[0].i_vertices;
      if (match_a || match_b) { return {}; }
    } else {
      return {};
    }
    const new_face_v_indices = new_v_indices
      .map(el => graph.faces_vertices[faceIndex].indexOf(el))
      .sort((a, b) => a - b);
    const new_faces = [{}, {}];
    new_faces[0].vertices = graph.faces_vertices[faceIndex]
      .slice(new_face_v_indices[1])
      .concat(graph.faces_vertices[faceIndex].slice(0, new_face_v_indices[0] + 1));
    new_faces[1].vertices = graph.faces_vertices[faceIndex]
      .slice(new_face_v_indices[0], new_face_v_indices[1] + 1);
    new_faces[0].edges = graph.faces_edges[faceIndex]
      .slice(new_face_v_indices[1])
      .concat(graph.faces_edges[faceIndex].slice(0, new_face_v_indices[0]))
      .concat([graph.edges_vertices.length]);
    new_faces[1].edges = graph.faces_edges[faceIndex]
      .slice(new_face_v_indices[0], new_face_v_indices[1])
      .concat([graph.edges_vertices.length]);
    new_faces[0].index = graph.faces_vertices.length;
    new_faces[1].index = graph.faces_vertices.length + 1;
    const new_edges = [{
      index: graph.edges_vertices.length,
      vertices: [...new_v_indices],
      assignment: crease_assignment,
      foldAngle: edge_assignment_to_foldAngle(crease_assignment),
      length: math.core.distance2(
        ...(new_v_indices.map(v => graph.vertices_coords[v]))
      ),
      faces: [graph.faces_vertices.length, graph.faces_vertices.length + 1]
    }];
    const edges_count = graph.edges_vertices.length;
    const faces_count = graph.faces_vertices.length;
    new_faces.forEach((face, i) => Object.keys(face)
      .filter(suffix => suffix !== "index")
      .forEach((suffix) => { graph[`faces_${suffix}`][faces_count + i] = face[suffix]; }));
    new_edges.forEach((edge, i) => Object.keys(edge)
      .filter(suffix => suffix !== "index")
      .filter(suffix => graph[`edges_${suffix}`] !== undefined)
      .forEach((suffix) => { graph[`edges_${suffix}`][edges_count + i] = edge[suffix]; }));
    new_edges.forEach((edge) => {
      const a = edge.vertices[0];
      const b = edge.vertices[1];
      graph.vertices_vertices[a].push(b);
      graph.vertices_vertices[b].push(a);
    });
    const v_f_map = {};
    graph.faces_vertices
      .map((face, i) => ({ face, i }))
      .filter(el => el.i === faces_count || el.i === faces_count + 1)
      .forEach(el => el.face.forEach((v) => {
        if (v_f_map[v] == null) { v_f_map[v] = []; }
        v_f_map[v].push(el.i);
      }));
    graph.vertices_faces
      .forEach((vf, i) => {
        let indexOf = vf.indexOf(faceIndex);
        while (indexOf !== -1) {
          graph.vertices_faces[i].splice(indexOf, 1, ...(v_f_map[i]));
          indexOf = vf.indexOf(faceIndex);
        }
      });
    const e_f_map = {};
    graph.faces_edges
      .map((face, i) => ({ face, i }))
      .filter(el => el.i === faces_count || el.i === faces_count + 1)
      .forEach(el => el.face.forEach((e) => {
        if (e_f_map[e] == null) { e_f_map[e] = []; }
        e_f_map[e].push(el.i);
      }));
    graph.edges_faces
      .forEach((ef, i) => {
        let indexOf = ef.indexOf(faceIndex);
        while (indexOf !== -1) {
          graph.edges_faces[i].splice(indexOf, 1, ...(e_f_map[i]));
          indexOf = ef.indexOf(faceIndex);
        }
      });
    const faces_map = remove_geometry_key_indices(graph, "faces", [faceIndex]);
    return {
      faces: {
        map: faces_map,
        replace: [{
          old: faceIndex,
          new: new_faces
        }]
      },
      edges: {
        new: new_edges,
        map: edge_map
      }
    };
  };

  const foldLayers = function (faces_layer, faces_folding) {
    const folding_i = faces_layer
      .map((el, i) => (faces_folding[i] ? i : undefined))
      .filter(a => a !== undefined);
    const not_folding_i = faces_layer
      .map((el, i) => (!faces_folding[i] ? i : undefined))
      .filter(a => a !== undefined);
    const sorted_folding_i = folding_i.slice()
      .sort((a, b) => faces_layer[a] - faces_layer[b]);
    const sorted_not_folding_i = not_folding_i.slice()
      .sort((a, b) => faces_layer[a] - faces_layer[b]);
    const new_faces_layer = [];
    sorted_not_folding_i.forEach((layer, i) => { new_faces_layer[layer] = i; });
    const topLayer = sorted_not_folding_i.length;
    sorted_folding_i.reverse().forEach((layer, i) => {
      new_faces_layer[layer] = topLayer + i;
    });
    return new_faces_layer;
  };

  const construction_flip = function (direction_vector) {
    return {
      type: "flip",
      direction: direction_vector
    };
  };

  const get_face_sidedness = function (point, vector, face_center, face_color) {
    const vec2 = [face_center[0] - point[0], face_center[1] - point[1]];
    const det = vector[0] * vec2[1] - vector[1] * vec2[0];
    return face_color ? det > 0 : det < 0;
  };
  const make_face_center_fast = function (graph, face_index) {
    return graph.faces_vertices[face_index]
      .map(v => graph.vertices_coords[v])
      .reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
      .map(el => el / graph.faces_vertices[face_index].length);
  };
  const prepare_to_fold = function (graph, point, vector, face_index) {
    const faceCount = faces_count$1(graph);
    graph["faces_re:preindex"] = Array.from(Array(faceCount)).map((_, i) => i);
    if ("faces_re:matrix" in graph === false) {
      graph["faces_re:matrix"] = make_faces_matrix(graph, face_index);
    }
    graph["faces_re:coloring"] = make_faces_coloring_from_faces_matrix(
      graph["faces_re:matrix"]
    );
    graph["faces_re:creases"] = graph["faces_re:matrix"]
      .map(mat => math.core.invert_matrix2(mat))
      .map(mat => math.core.multiply_matrix2_line2(mat, point, vector));
    graph["faces_re:center"] = Array.from(Array(faceCount))
      .map((_, i) => make_face_center_fast(graph, i));
    graph["faces_re:sidedness"] = Array.from(Array(faceCount))
      .map((_, i) => get_face_sidedness(
        graph["faces_re:creases"][i].origin,
        graph["faces_re:creases"][i].vector,
        graph["faces_re:center"][i],
        graph["faces_re:coloring"][i]
      ));
  };
  const prepare_extensions = function (graph) {
    const facesCount = faces_count$1(graph);
    if (graph["faces_re:layer"] == null) {
      graph["faces_re:layer"] = Array(facesCount).fill(0);
    }
  };
  const two_furthest_points = function (points) {
    let top = [0, -Infinity];
    let left = [Infinity, 0];
    let right = [-Infinity, 0];
    let bottom = [0, Infinity];
    points.forEach((p) => {
      if (p[0] < left[0]) { left = p; }
      if (p[0] > right[0]) { right = p; }
      if (p[1] < bottom[1]) { bottom = p; }
      if (p[1] > top[1]) { top = p; }
    });
    const t_to_b = Math.abs(top[1] - bottom[1]);
    const l_to_r = Math.abs(right[0] - left[0]);
    return t_to_b > l_to_r ? [bottom, top] : [left, right];
  };
  const opposite_assignment = { "M":"V", "m":"V", "V":"M", "v":"M" };
  const opposingCrease = function (assignment) {
    return opposite_assignment[assignment] || assignment;
  };
  const fold_through = function (
    graph,
    point,
    vector,
    face_index,
    assignment = "V"
  ) {
    const opposite_crease = opposingCrease(assignment);
    if (face_index == null) {
      const containing_point = face_containing_point(graph, point);
      face_index = (containing_point === undefined) ? 0 : containing_point;
    }
    prepare_extensions(graph);
    prepare_to_fold(graph, point, vector, face_index);
    const folded = clone(graph);
    const faces_split = Array.from(Array(faces_count$1(graph)))
      .map((_, i) => i)
      .reverse()
      .map((i) => {
        const diff = split_convex_polygon$1(
          folded, i,
          folded["faces_re:creases"][i].origin,
          folded["faces_re:creases"][i].vector,
          folded["faces_re:coloring"][i] ? assignment : opposite_crease
        );
        if (diff == null || diff.faces == null) { return undefined; }
        diff.faces.replace.forEach(replace => replace.new
          .map(el => el.index)
          .map(index => index + diff.faces.map[index])
          .forEach((i) => {
            folded["faces_re:center"][i] = make_face_center_fast(folded, i);
            folded["faces_re:sidedness"][i] = get_face_sidedness(
              graph["faces_re:creases"][replace.old].origin,
              graph["faces_re:creases"][replace.old].vector,
              folded["faces_re:center"][i],
              graph["faces_re:coloring"][replace.old]
            );
            folded["faces_re:layer"][i] = graph["faces_re:layer"][replace.old];
            folded["faces_re:preindex"][i] =
              graph["faces_re:preindex"][replace.old];
          }));
        return {
          index: i,
          length: diff.edges.new[0].length,
          edge: diff.edges.new[0].vertices.map(v => folded.vertices_coords[v])
        };
      })
      .reverse();
    folded["faces_re:layer"] = foldLayers(
      folded["faces_re:layer"],
      folded["faces_re:sidedness"]
    );
    const face_0_newIndex = (faces_split[0] === undefined
      ? 0
      : folded["faces_re:preindex"]
        .map((pre, i) => ({ pre, new: i }))
        .filter(obj => obj.pre === 0)
        .filter(obj => folded["faces_re:sidedness"][obj.new])
        .shift().new);
    let face_0_preMatrix = graph["faces_re:matrix"][0];
    if (assignment === "M" || assignment === "m"
      || assignment === "V" || assignment === "v") {
      face_0_preMatrix = (faces_split[0] === undefined
        && !graph["faces_re:sidedness"][0]
        ? graph["faces_re:matrix"][0]
        : math.core.multiply_matrices2(
          graph["faces_re:matrix"][0],
          math.core.make_matrix2_reflection(
            graph["faces_re:creases"][0].vector,
            graph["faces_re:creases"][0].origin
          )
        )
      );
    }
    const folded_faces_matrix = make_faces_matrix(folded, face_0_newIndex)
      .map(m => math.core.multiply_matrices2(face_0_preMatrix, m));
    folded["faces_re:coloring"] = make_faces_coloring_from_faces_matrix(
      folded_faces_matrix
    );
    const crease_0 = math.core.multiply_matrix2_line2(
      face_0_preMatrix,
      graph["faces_re:creases"][0].origin,
      graph["faces_re:creases"][0].vector
    );
    const fold_direction = math.core
      .normalize([crease_0.vector[1], -crease_0.vector[0]]);
    const split_points = faces_split
      .map((el, i) => (el === undefined ? undefined : el.edge.map(p => math.core
        .multiply_matrix2_vector2(graph["faces_re:matrix"][i], p))))
      .filter(a => a !== undefined)
      .reduce((a, b) => a.concat(b), []);
    folded["re:construction"] = (split_points.length === 0
      ? construction_flip(fold_direction)
      : {
        type: "fold",
        assignment,
        direction: fold_direction,
        edge: two_furthest_points(split_points)
      });
    folded["vertices_re:foldedCoords"] = make_vertices_coords_folded(
      folded,
      face_0_newIndex,
      folded_faces_matrix
    );
    folded["faces_re:matrix"] = folded_faces_matrix;
    delete graph["faces_re:creases"];
    delete folded["faces_re:creases"];
    delete graph["faces_re:sidedness"];
    delete folded["faces_re:sidedness"];
    delete graph["faces_re:preindex"];
    delete folded["faces_re:preindex"];
    delete graph["faces_re:coloring"];
    delete folded["faces_re:coloring"];
    delete graph["faces_re:center"];
    delete folded["faces_re:center"];
    return folded;
  };

  var text_axioms = "{\n  \"ar\": [null,\n    \"اصنع خطاً يمر بنقطتين\",\n    \"اصنع خطاً عن طريق طي نقطة واحدة إلى أخرى\",\n    \"اصنع خطاً عن طريق طي خط واحد على آخر\",\n    \"اصنع خطاً يمر عبر نقطة واحدة ويجعل خطاً واحداً فوق نفسه\",\n    \"اصنع خطاً يمر بالنقطة الأولى ويجعل النقطة الثانية على الخط\",\n    \"اصنع خطاً يجلب النقطة الأولى إلى الخط الأول والنقطة الثانية إلى الخط الثاني\",\n    \"اصنع خطاً يجلب نقطة إلى خط ويجعل خط ثاني فوق نفسه\"\n  ],\n  \"de\": [null,\n    \"Falte eine Linie durch zwei Punkte\",\n    \"Falte zwei Punkte aufeinander\",\n    \"Falte zwei Linien aufeinander\",\n    \"Falte eine Linie auf sich selbst, falte dabei durch einen Punkt\",\n    \"Falte einen Punkt auf eine Linie, falte dabei durch einen anderen Punkt\",\n    \"Falte einen Punkt auf eine Linie und einen weiteren Punkt auf eine weitere Linie\",\n    \"Falte einen Punkt auf eine Linie und eine weitere Linie in sich selbst zusammen\"\n  ],\n  \"en\": [null,\n    \"fold a line through two points\",\n    \"fold two points together\",\n    \"fold two lines together\",\n    \"fold a line on top of itself, creasing through a point\",\n    \"fold a point to a line, creasing through another point\",\n    \"fold a point to a line and another point to another line\",\n    \"fold a point to a line and another line onto itself\"\n  ],\n  \"es\": [null,\n    \"dobla una línea entre dos puntos\",\n    \"dobla dos puntos juntos\",\n    \"dobla y une dos líneas\",\n    \"dobla una línea sobre sí misma, doblándola hacia un punto\",\n    \"dobla un punto hasta una línea, doblándola a través de otro punto\",\n    \"dobla un punto hacia una línea y otro punto hacia otra línea\",\n    \"dobla un punto hacia una línea y otra línea sobre sí misma\"\n  ],\n  \"fr\":[null,\n    \"créez un pli passant par deux points\",\n    \"pliez pour superposer deux points\",\n    \"pliez pour superposer deux lignes\",\n    \"rabattez une ligne sur elle-même à l'aide d'un pli qui passe par un point\",\n    \"rabattez un point sur une ligne à l'aide d'un pli qui passe par un autre point\",\n    \"rabattez un point sur une ligne et un autre point sur une autre ligne\",\n    \"rabattez un point sur une ligne et une autre ligne sur elle-même\"\n  ],\n  \"hi\": [null,\n    \"एक क्रीज़ बनाएँ जो दो स्थानों से गुजरता है\",\n    \"एक स्थान को दूसरे स्थान पर मोड़कर एक क्रीज़ बनाएँ\",\n    \"एक रेखा पर दूसरी रेखा को मोड़कर क्रीज़ बनाएँ\",\n    \"एक क्रीज़ बनाएँ जो एक स्थान से गुजरता है और एक रेखा को स्वयं के ऊपर ले आता है\",\n    \"एक क्रीज़ बनाएँ जो पहले स्थान से गुजरता है और दूसरे स्थान को रेखा पर ले आता है\",\n    \"एक क्रीज़ बनाएँ जो पहले स्थान को पहली रेखा पर और दूसरे स्थान को दूसरी रेखा पर ले आता है\",\n    \"एक क्रीज़ बनाएँ जो एक स्थान को एक रेखा पर ले आता है और दूसरी रेखा को स्वयं के ऊपर ले आता है\"\n  ],\n  \"jp\": [null,\n    \"2点に沿って折り目を付けます\",\n    \"2点を合わせて折ります\",\n    \"2つの線を合わせて折ります\",\n    \"点を通過させ、既にある線に沿って折ります\",\n    \"点を線沿いに合わせ別の点を通過させ折ります\",\n    \"線に向かって点を折り、同時にもう一方の線に向かってもう一方の点を折ります\",\n    \"線に向かって点を折り、同時に別の線をその上に折ります\"\n  ],\n  \"ko\": [null,\n    \"두 점을 통과하는 선으로 접으세요\",\n    \"두 점을 함께 접으세요\",\n    \"두 선을 함께 접으세요\",\n    \"그 위에 선을 접으면서 점을 통과하게 접으세요\",\n    \"점을 선으로 접으면서, 다른 점을 지나게 접으세요\",\n    \"점을 선으로 접고 다른 점을 다른 선으로 접으세요\",\n    \"점을 선으로 접고 다른 선을 그 위에 접으세요\"\n  ],\n  \"ms\": [null,\n    \"lipat garisan melalui dua titik\",\n    \"lipat dua titik bersama\",\n    \"lipat dua garisan bersama\",\n    \"lipat satu garisan di atasnya sendiri, melipat melalui satu titik\",\n    \"lipat satu titik ke garisan, melipat melalui titik lain\",\n    \"lipat satu titik ke garisan dan satu lagi titik ke garisan lain\",\n    \"lipat satu titik ke garisan dan satu lagi garisan di atasnya sendiri\"\n  ],\n  \"pt\": [null,\n    \"dobre uma linha entre dois pontos\",\n    \"dobre os dois pontos para uni-los\",\n    \"dobre as duas linhas para uni-las\",\n    \"dobre uma linha sobre si mesma, criando uma dobra ao longo de um ponto\",\n    \"dobre um ponto até uma linha, criando uma dobra ao longo de outro ponto\",\n    \"dobre um ponto até uma linha e outro ponto até outra linha\",\n    \"dobre um ponto até uma linha e outra linha sobre si mesma\"\n  ],\n  \"ru\": [null,\n    \"сложите линию через две точки\",\n    \"сложите две точки вместе\",\n    \"сложите две линии вместе\",\n    \"сверните линию сверху себя, сгибая через точку\",\n    \"сложите точку в линию, сгибая через другую точку\",\n    \"сложите точку в линию и другую точку в другую линию\",\n    \"сложите точку в линию и другую линию на себя\"\n  ],\n  \"tr\": [null,\n    \"iki noktadan geçen bir çizgi boyunca katla\",\n    \"iki noktayı birbirine katla\",\n    \"iki çizgiyi birbirine katla\",\n    \"bir noktadan kıvırarak kendi üzerindeki bir çizgi boyunca katla\",\n    \"başka bir noktadan kıvırarak bir noktayı bir çizgiye katla\",\n    \"bir noktayı bir çizgiye ve başka bir noktayı başka bir çizgiye katla\",\n    \"bir noktayı bir çizgiye ve başka bir çizgiyi kendi üzerine katla\"\n  ],\n  \"vi\": [null,\n    \"tạo một nếp gấp đi qua hai điểm\",\n    \"tạo nếp gấp bằng cách gấp một điểm này sang điểm khác\",\n    \"tạo nếp gấp bằng cách gấp một đường lên một đường khác\",\n    \"tạo một nếp gấp đi qua một điểm và đưa một đường lên trên chính nó\",\n    \"tạo một nếp gấp đi qua điểm đầu tiên và đưa điểm thứ hai lên đường thẳng\",\n    \"tạo một nếp gấp mang điểm đầu tiên đến đường đầu tiên và điểm thứ hai cho đường thứ hai\",\n    \"tạo một nếp gấp mang lại một điểm cho một đường và đưa một đường thứ hai lên trên chính nó\"\n  ],\n  \"zh\": [null,\n    \"通過兩點折一條線\",\n    \"將兩點折疊起來\",\n    \"將兩條線折疊在一起\",\n    \"通過一個點折疊一條線在自身上面\",\n    \"將一個點，通過另一個點折疊成一條線，\",\n    \"將一個點折疊為一條線，再將另一個點折疊到另一條線\",\n    \"將一個點折疊成一條線，另一條線折疊到它自身上\"\n  ]\n}\n";

  const axiom_instructions = JSON.parse(text_axioms);
  const get_instructions_for_axiom = function (axiom_number) {
    if (isNaN(axiom_number) || axiom_number == null
      || axiom_number < 1 || axiom_number > 7) {
      return undefined;
    }
    const instructions = {};
    Object.keys(axiom_instructions).forEach((key) => {
      instructions[key] = axiom_instructions[key][axiom_number];
    });
    return instructions;
  };
  const make_instructions = function (construction) {
    const axiom = construction.axiom || 0;
    if (!isNaN(axiom) && axiom != null && axiom > 0 && axiom < 8) {
      return get_instructions_for_axiom(axiom);
    }
    if ("assignment" in construction) {
      return { en: `${edges_assignment_names[construction.assignment]} fold` };
    }
    return { en: "" };
  };
  const make_arrow_coords = function (construction, graph) {
    const axiom = construction.axiom || 0;
    const crease_edge = construction.edge;
    const arrow_vector = construction.direction;
    const axiom_frame = construction;
    if (axiom === 2) {
      return [axiom_frame.parameters.points[1], axiom_frame.parameters.points[0]];
    }
    if (axiom === 5) {
      return [axiom_frame.parameters.points[1], axiom_frame.test.points_reflected[1]];
    }
    if (axiom === 7) {
      return [axiom_frame.parameters.points[0], axiom_frame.test.points_reflected[0]];
    }
    const crease_vector = [
      crease_edge[1][0] - crease_edge[0][0],
      crease_edge[1][1] - crease_edge[0][1]
    ];
    let crossing;
    switch (axiom) {
      case 4:
        crossing = math.core.nearest_point_on_line(
          crease_edge[0], crease_vector, axiom_frame.parameters.lines[0][0], (a => a)
        );
        break;
      case 7:
        crossing = math.core.nearest_point_on_line(
          crease_edge[0], crease_vector, axiom_frame.parameters.points[0], (a => a)
        );
        break;
      default:
        crossing = math.core.average(crease_edge[0], crease_edge[1]);
        break;
    }
    const boundary = get_boundary(graph).vertices
      .map(v => graph.vertices_coords[v]);
    const perpClipEdge = math.core.intersection.convex_poly_line(
      boundary, crossing, arrow_vector
    );
    if (perpClipEdge === undefined) {
      return [];
    }
    let short_length = [perpClipEdge[0], perpClipEdge[1]]
      .map(n => math.core.distance2(n, crossing))
      .sort((a, b) => a - b)
      .shift();
    if (axiom === 7) {
      short_length = math.core.distance2(construction.parameters.points[0], crossing);
    }
    const short_vector = arrow_vector.map(v => v * short_length);
    return [
      crossing.map((c, i) => c - short_vector[i]),
      crossing.map((c, i) => c + short_vector[i])
    ];
  };
  const build_diagram_frame = function (graph) {
    const c = graph["re:construction"];
    if (c == null) {
      console.warn("couldn't build diagram. construction info doesn't exist");
      return {};
    }
    switch (c.type) {
      case "flip":
        return {
          "re:diagram_arrows": [{
            "re:diagram_arrow_classes": ["flip"],
            "re:diagram_arrow_coords": []
          }],
          "re:diagram_instructions": { en: "flip over" }
        };
      case "fold":
        return {
          "re:diagram_lines": [{
            "re:diagram_line_classes": [edges_assignment_names[c.assignment]],
            "re:diagram_line_coords": c.edge,
          }],
          "re:diagram_arrows": [{
            "re:diagram_arrowClasses": [],
            "re:diagram_arrow_coords": make_arrow_coords(c, graph)
          }],
          "re:diagram_instructions": make_instructions(c)
        };
      case "squash":
      case "sink":
      case "pleat":
      default:
        return { error: `construction type (${c.type}) not yet defined` };
    }
  };

  const isFoldedState = function (graph) {
    if (graph == null
      || graph.frame_classes == null
      || typeof graph.frame_classes !== "object") { return undefined; }
    if (graph.frame_classes.includes(FOLDED_FORM)) { return true; }
    if (graph.frame_classes.includes(CREASE_PATTERN)) { return false; }
    return undefined;
  };

  const test_axiom1_2 = function (axiom_frame, poly) {
    const { points } = axiom_frame.parameters;
    axiom_frame.valid = math.core.point_in_convex_poly(points[0], poly)
      && math.core.point_in_convex_poly(points[1], poly);
    axiom_frame.valid_solutions = [axiom_frame.valid];
  };
  const test_axiom3 = function (axiom_frame, poly) {
    const Xing = math.core.intersection;
    const { lines } = axiom_frame.parameters;
    const a = Xing.convex_poly_line(poly, lines[0][0], lines[0][1]);
    const b = Xing.convex_poly_line(poly, lines[1][0], lines[1][1]);
    axiom_frame.valid = (a !== undefined && b !== undefined);
    axiom_frame.valid_solutions = axiom_frame.solutions
      .map(s => (s === undefined
        ? false
        : Xing.convex_poly_line(poly, s[0], s[1]) !== undefined));
  };
  const test_axiom4 = function (axiom_frame, poly) {
    const params = axiom_frame.parameters;
    const overlap = math.core.intersection.line_line(
      params.lines[0][0], params.lines[0][1],
      params.points[0], [params.lines[0][1][1], -params.lines[0][1][0]],
    );
    if (overlap === undefined) {
      axiom_frame.valid = false;
      axiom_frame.valid_solutions = [false];
    }
    axiom_frame.valid = math.core.point_in_convex_poly(overlap, poly)
      && math.core.point_in_convex_poly(params.points[0], poly);
    axiom_frame.valid_solutions = [axiom_frame.valid];
  };
  const test_axiom5 = function (axiom_frame, poly) {
    if (axiom_frame.solutions.length === 0) {
      axiom_frame.valid = false;
      axiom_frame.valid_solutions = [false, false];
      return;
    }
    const params = axiom_frame.parameters;
    axiom_frame.test = {};
    axiom_frame.test.points_reflected = axiom_frame.solutions
      .map(s => math.core.make_matrix2_reflection(s[1], s[0]))
      .map(m => math.core.multiply_matrix2_vector2(m, params.points[1]));
    axiom_frame.valid = math.core.point_in_convex_poly(params.points[0], poly)
      && math.core.point_in_convex_poly(params.points[1], poly);
    axiom_frame.valid_solutions = axiom_frame.test.points_reflected
      .map(p => math.core.point_in_convex_poly(p, poly));
  };
  const test_axiom6 = function (axiom_frame, poly) {
    const Xing = math.core.intersection;
    const solutions_inside = axiom_frame.solutions.map(s => Xing.convex_poly_line(poly, s[0], s[1])).filter(a => a !== undefined);
    if (solutions_inside.length === 0) {
      axiom_frame.valid = false;
      axiom_frame.valid_solutions = [false, false, false];
      return;
    }
    const { lines } = axiom_frame.parameters;
    const a = Xing.convex_poly_line(poly, lines[0][0], lines[0][1]);
    const b = Xing.convex_poly_line(poly, lines[1][0], lines[1][1]);
    const params = axiom_frame.parameters;
    axiom_frame.test = {};
    axiom_frame.test.points_reflected = axiom_frame.solutions
      .map(s => math.core.make_matrix2_reflection(s[1], s[0]))
      .map(m => params.points
        .map(p => math.core.multiply_matrix2_vector2(m, p)))
      .reduce((prev, curr) => prev.concat(curr), []);
    axiom_frame.valid = a !== undefined && b !== undefined
      && math.core.point_in_convex_poly(params.points[0], poly)
      && math.core.point_in_convex_poly(params.points[1], poly);
    axiom_frame.valid_solutions = axiom_frame.solutions
      .map((solution, i) => [
        axiom_frame.test.points_reflected[(i * 2)],
        axiom_frame.test.points_reflected[(i * 2) + 1]
      ])
      .map(p => math.core.point_in_convex_poly(p[0], poly)
        && math.core.point_in_convex_poly(p[1], poly));
    while (axiom_frame.valid_solutions.length < 3) {
      axiom_frame.valid_solutions.push(false);
    }
  };
  const test_axiom7 = function (axiom_frame, poly) {
    if (axiom_frame.solutions.length === 0) {
      axiom_frame.valid = false;
      axiom_frame.valid_solutions = [false];
    }
    const solution = axiom_frame.solutions[0];
    const params = axiom_frame.parameters;
    const m = math.core.make_matrix2_reflection(solution[1], solution[0]);
    const reflected = math.core.multiply_matrix2_vector2(m, params.points[0]);
    const intersect = math.core.intersection.line_line(
      params.lines[1][0], params.lines[1][1],
      solution[0], solution[1],
    );
    axiom_frame.test = {
      points_reflected: [reflected],
    };
    axiom_frame.valid = math.core.point_in_convex_poly(params.points[0], poly)
      && math.core.point_in_convex_poly(reflected, poly)
      && math.core.point_in_convex_poly(intersect, poly);
    axiom_frame.valid_solutions = [axiom_frame.valid];
  };
  const test = [null,
    test_axiom1_2,
    test_axiom1_2,
    test_axiom3,
    test_axiom4,
    test_axiom5,
    test_axiom6,
    test_axiom7,
  ];
  const apply_axiom_in_polygon = function (axiom_frame, poly) {
    test[axiom_frame.axiom].call(null, axiom_frame, poly);
    return axiom_frame;
  };

  const make_axiom_frame = function (axiom, solutions, parameters) {
    const solution = {
      axiom,
      parameters,
      solutions,
    };
    Object.defineProperty(solution, "apply", {
      value: (...args) => apply_axiom_in_polygon(solution, ...args)
    });
    return solution;
  };

  const Params = function (number, ...args) {
    const params = math.core.semi_flatten_input(...args);
    switch (number) {
      case 1:
      case 2: {
        if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
          if (params[0].points == null) { throw new Error("axiom .points property needed"); }
          return params[0].points.map(p => math.core.get_vector(p));
        }
        if (params.length === 2) {
          return params.map(p => math.core.get_vector(p))
        }
        if (params.length === 4 && typeof params[0] === "number") {
          return [[params[0], params[1]], [params[2], params[3]]];
        }
      }
        break;
      case 3: {
        if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
          if (params[0].lines != null && params[0].lines.length > 0) {
            const lines = params[0].lines.map(l => math.core.get_line(l));
            return [lines[0].origin, lines[0].vector, lines[1].origin, lines[1].vector];
          }
          if (params[0].points != null && params[0].vectors != null) {
            const points = params[0].points.map(p => math.core.get_vector(p));
            const vectors = params[0].vectors.map(p => math.core.get_vector(p));
            return [points[0], vectors[0], points[1], vectors[1]];
          }
        }
      }
        break;
      case 4: {
        if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
          if (params[0].lines != null && params[0].lines.length > 0
            && params[0].points != null && params[0].points.length > 0) {
            const lines = params[0].lines.map(l => math.core.get_line(l));
            const points = params[0].points.map(p => math.core.get_vector(p));
            return [lines[0].origin, lines[0].vector, points[0]];
          }
        }
      }
      break;
      case 5: {
        if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
          if (params[0].lines != null && params[0].lines.length > 0
            && params[0].points != null && params[0].points.length > 0) {
            const lines = params[0].lines.map(l => math.core.get_line(l));
            const points = params[0].points.map(p => math.core.get_vector(p));
            return [lines[0].origin, lines[0].vector, points[0], points[1]];
          }
        }
      }
      break;
      case 6: {
        if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
          if (params[0].lines != null && params[0].lines.length > 0
            && params[0].points != null && params[0].points.length > 0) {
            const lines = params[0].lines.map(l => math.core.get_line(l));
            const points = params[0].points.map(p => math.core.get_vector(p));
            return [lines[0].origin, lines[0].vector, lines[1].origin, lines[1].vector, points[0], points[1]];
          }
        }
      }
      break;
      case 7: {
        if (params.length === 1 && typeof params[0] === "object" && params[0] !== null) {
          if (params[0].lines != null && params[0].lines.length > 0
            && params[0].points != null && params[0].points.length > 0) {
            const lines = params[0].lines.map(l => math.core.get_line(l));
            const points = params[0].points.map(p => math.core.get_vector(p));
            return [lines[0].origin, lines[0].vector, lines[1].origin, lines[1].vector, points[0]];
          }
        }
      }
      break;
    }
    return args;
  };

  const axiom1 = function (pointA, pointB) {
    const dimensions = Math.min(pointA.length, pointB.length);
    const vector = Array.from(Array(dimensions))
      .map((_, i) => pointB[i] - pointA[i]);
    const normalized = math.core.normalize(vector);
    const solution = math.line(pointA, normalized);
    const parameters = { points: [math.vector(pointA), math.vector(pointB)] };
    return make_axiom_frame(1, [solution], parameters);
  };
  const axiom2 = function (pointA, pointB) {
    const mid = [(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2];
    const vector = Array.from(Array(2)).map((_, i) => pointB[i] - pointA[i]);
    const normalized = math.core.normalize(vector);
    const solution = math.line(mid, [normalized[1], -normalized[0]]);
    const parameters = { points: [math.vector(pointA), math.vector(pointB)] };
    return make_axiom_frame(2, [solution], parameters);
  };
  const axiom3 = function (pointA, vectorA, pointB, vectorB) {
    const parameters = {
      lines: [math.line(pointA, vectorA), math.line(pointB, vectorB)]
    };
    const solutions = math.core.bisect_lines2(pointA, vectorA, pointB, vectorB)
      .map(l => math.line(l[0], l[1]));
    return make_axiom_frame(3, solutions, parameters);
  };
  const axiom4 = function (pointA, vectorA, pointB) {
    const norm = math.core.normalize(vectorA);
    const solution = math.line([...pointB], [norm[1], -norm[0]]);
    const parameters = {
      points: [math.vector(pointB)],
      lines: [math.line(pointA, vectorA)]
    };
    return make_axiom_frame(4, [solution], parameters);
  };
  const axiom5 = function (pointA, vectorA, pointB, pointC) {
    const radius = Math.sqrt(((pointB[0] - pointC[0]) ** 2) + ((pointB[1] - pointC[1]) ** 2));
    const pointA2 = [pointA[0] + vectorA[0], pointA[1] + vectorA[1]];
    const sect = math.core.intersection.circle_line(pointB, radius, pointA, pointA2) || [];
    const solutions = sect.map((s) => {
      const mid = math.core.midpoint2(pointC, s);
      const vec = math.core.normalize(s.map((_, i) => s[i] - pointC[i]));
      return math.line(mid, [-vec[1], vec[0]]);
    });
    const parameters = {
      points: [math.vector(pointB), math.vector(pointC)],
      lines: [math.line(pointA, vectorA)]
    };
    return make_axiom_frame(5, solutions, parameters);
  };
  const axiom7 = function (pointA, vectorA, pointB, vectorB, pointC) {
    const parameters = {
      points: [math.vector(pointC)],
      lines: [math.line(pointA, vectorA), math.line(pointB, vectorB)]
    };
    const sect = math.core.intersection.line_line(pointB, vectorB, pointC, vectorA);
    if (sect === undefined) {
      return make_axiom_frame(7, parameters, []);
    }
    const mid = math.core.midpoint2(pointC, sect);
    const vec = math.core.normalize(pointC.map((_, i) => sect[i] - pointC[i]));
    const solution = math.line(mid, [-vec[1], vec[0]]);
    return make_axiom_frame(7, [solution], parameters);
  };
  const cuberoot = function (x) {
    const y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };
  const solveCubic = function (a, b, c, d) {
    if (Math.abs(a) < 1e-8) {
      a = b; b = c; c = d;
      if (Math.abs(a) < 1e-8) {
        a = b; b = c;
        if (Math.abs(a) < 1e-8) {
          return [];
        }
        return [-b / a];
      }
      const D = b * b - 4 * a * c;
      if (Math.abs(D) < 1e-8) {
        return [-b / (2 * a)];
      }
      if (D > 0) {
        return [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)];
      }
      return [];
    }
    const p = (3 * a * c - b * b) / (3 * a * a);
    const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    let roots;
    if (Math.abs(p) < 1e-8) {
      roots = [cuberoot(-q)];
    } else if (Math.abs(q) < 1e-8) {
      roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
    } else {
      const D = q * q / 4 + p * p * p / 27;
      if (Math.abs(D) < 1e-8) {
        roots = [-1.5 * q / p, 3 * q / p];
      } else if (D > 0) {
        const u = cuberoot(-q / 2 - Math.sqrt(D));
        roots = [u - p / (3 * u)];
      } else {
        const u = 2 * Math.sqrt(-p / 3);
        const t = Math.acos(3 * q / p / u) / 3;
        const k = 2 * Math.PI / 3;
        roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
      }
    }
    for (let i = 0; i < roots.length; i += 1) {
      roots[i] -= b / (3 * a);
    }
    return roots;
  };
  const axiom6 = function (pointA, vecA, pointB, vecB, pointC, pointD) {
    var p1 = pointC[0];
    var q1 = pointC[1];
    if (Math.abs(vecA[0]) > math.core.EPSILON) {
      var m1 = vecA[1] / vecA[0];
      var h1 = pointA[1] - m1 * pointA[0];
    }
    else {
      var k1 = pointA[0];
    }
    var p2 = pointD[0];
    var q2 = pointD[1];
    if (Math.abs(vecB[0]) > math.core.EPSILON) {
      var m2 = vecB[1] / vecB[0];
      var h2 = pointB[1] - m2 * pointB[0];
    }
    else {
      var k2 = pointB[0];
    }
    if (m1 !== undefined && m2 !== undefined) {
      var a1 = m1*m1 + 1;
      var b1 = 2*m1*h1;
      var c1 = h1*h1 - p1*p1 - q1*q1;
      var a2 = m2*m2 + 1;
      var b2 = 2*m2*h2;
      var c2 =  h2*h2 - p2*p2 - q2*q2;
      var a0 = m2*p1 + (h1 - q1);
      var b0 = p1*(h2 - q2) - p2*(h1 - q1);
      var c0 = m2 - m1;
      var d0 = m1*p2 + (h2 - q2);
      var z = m1*p1 + (h1 - q1);
    }
    else if (m1 === undefined && m2 === undefined) {
      a1 = 1;
      b1 = 0;
      c1 = k1*k1 - p1*p1 - q1*q1;
      a2 = 1;
      b2 = 0;
      c2 = k2*k2 - p2*p2 - q2*q2;
      a0 = k1 - p1;
      b0 = q1*(k2 - p2) - q2*(k1 - p1);
      c0 = 0;
      d0 = k2 - p2;
      z = a0;
    }
    else {
      if (m1 === undefined) {
        var p3 = p1;
        p1 = p2;
        p2 = p3;
        var q3 = q1;
        q1 = q2;
        q2 = q3;
        m1 = m2;
        m2 = undefined;
        h1 = h2;
        h2 = undefined;
        k2 = k1;
        k1 = undefined;
      }
      a1 = m1*m1 + 1;
      b1 = 2*m1*h1;
      c1 = h1*h1 - p1*p1 - q1*q1;
      a2 = 1;
      b2 = 0;
      c2 = k2*k2 - p2*p2 - q2*q2;
      a0 = p1;
      b0 = (h1 - q1)*(k2 - p2) - p1*q2;
      c0 = 1;
      d0 = -m1*(k2 - p2) - q2;
      z = m1*p1 + (h1 - q1);
    }
    var a3 = a1*a0*a0 + b1*a0*c0 + c1*c0*c0;
    var b3 = 2*a1*a0*b0 + b1*(a0*d0 + b0*c0) + 2*c1*c0*d0;
    var c3 = a1*b0*b0 + b1*b0*d0 + c1*d0*d0;
    var a4 = a2*c0*z;
    var b4 = (a2*d0 + b2*c0) * z - a3;
    var c4 = (b2*d0 + c2*c0) * z - b3;
    var d4 =  c2*d0*z - c3;
    var roots = solveCubic(a4,b4,c4,d4);
    var solutions = [];
    if (roots != undefined && roots.length > 0) {
      for (var i = 0; i < roots.length; ++i) {
        if (m1 !== undefined && m2 !== undefined) {
          var u2 = roots[i];
          var v2 = m2*u2 + h2;
        }
        else if (m1 === undefined && m2 === undefined) {
          v2 = roots[i];
          u2 = k2;
        }
        else {
          v2 = roots[i];
          u2 = k2;
        }
        if (v2 != q2) {
          var mF = -1*(u2 - p2)/(v2 - q2);
          var hF = (v2*v2 - q2*q2 + u2*u2 - p2*p2) / (2 * (v2 - q2));
          solutions.push(math.line([0, hF], [1, mF]));
        }
        else {
          var kG = (u2 + p2)/2;
          solutions.push(math.line([kG, 0], [0, 1]));
        }
      }
    }
    const parameters = {
      points: [math.vector(pointC), math.vector(pointD)],
      lines: [math.line(pointA, vecA), math.line(pointB, vecB)]
    };
    return make_axiom_frame(6, solutions, parameters);
  };
  var order, irootMax, q1, q2, S, Sr, Si, U;
  const CubeRoot = function (x) {
    return (x >= 0) ? Math.pow(x, 1/3) : -Math.pow(-x, 1/3);
  };
  const axiom6RefFinder = function (
    pointA, vecA, pointB, vecB, pointC, pointD
  ) {
    order = 0;
    irootMax = 0;
    q1 = 0;
    q2 = 0;
    S = 0;
    Sr = 0;
    Si = 0;
    U = 0;
    let results = [
      axiom6RefFinderFunc(pointA, vecA, pointB, vecB, pointC, pointD, 0),
      axiom6RefFinderFunc(pointA, vecA, pointB, vecB, pointC, pointD, 1),
      axiom6RefFinderFunc(pointA, vecA, pointB, vecB, pointC, pointD, 2)
    ];
    return results.filter(c => c != null);
  };
  const axiom6RefFinderFunc = function (
    pointA, vecA, pointB, vecB, pointC, pointD, iroot
  ) {
    let pA = math.core.get_vector(pointA);
    let pB = math.core.get_vector(pointB);
    let pC = math.core.get_vector(pointC);
    let pD = math.core.get_vector(pointD);
    let vA = math.core.get_vector(vecA);
    let vB = math.core.get_vector(vecB);
    let p1 = pC;
    let l1 = math.line(pA, vA);
    let u1 = [-vA[1], vA[0]];
    let d1 = l1.nearestPoint(0,0).magnitude;
    let p2 = pD;
    let l2 = math.line(pB, vB);
    let u2 = [-vB[1], vB[0]];
    let d2 = l2.nearestPoint(0,0).magnitude;
    if (math.core.dot(u1,l1.nearestPoint(0,0)) < 0) {
      u1 = [vA[1], -vA[0]];
    }
    if (math.core.dot(u2,l2.nearestPoint(0,0)) < 0) {
      u2 = [vB[1], -vB[0]];
    }
    let u1p = [u1[1], -u1[0]];
    if (Math.abs(p1[0] - p2[0]) < math.core.EPSILON &&
        Math.abs(p1[1] - p2[1]) < math.core.EPSILON) { return; }
    let rc = 0;
    switch (iroot) {
      case 0:
        let v1 = [
          p1[0] + d1 * u1[0] - 2 * p2[0],
          p1[1] + d1 * u1[1] - 2 * p2[1]
        ];
        let v2 = [
          d1 * u1[0] - p1[0],
          d1 * u1[1] - p1[1]
        ];
        let c1 = math.core.dot(p2, u2) - d2;
        let c2 = math.core.dot(v2, u1p) * 2;
        let c3 = math.core.dot(v2, v2);
        let c4 = math.core.dot(v1.map((_,i) => v1[i]+v2[i]), u1p);
        let c5 = math.core.dot(v1, v2);
        let c6 = math.core.dot(u1p, u2);
        let c7 = math.core.dot(v2, u2);
        let a = c6;
        let b = c1 + c4 * c6 + c7;
        let c = c1 * c2 + c5 * c6 + c4 * c7;
        let d = c1 * c3 + c5 * c7;
        if (Math.abs(a) > math.core.EPSILON) { order = 3; }
        else if (Math.abs(b) > math.core.EPSILON) { order = 2; }
        else if (Math.abs(c) > math.core.EPSILON) { order = 1; }
        else { order = 0; }
        switch(order) {
          case 0: return;
          case 1: rc = -d / c; break;
          case 2:
            let disc = Math.pow(c, 2) - 4 * b * d;
            q1 = -c / (2 * b);
            if (disc < 0) {
              irootMax = -1;
              return;
            }
            else if (Math.abs(disc) < math.core.EPSILON) {
              irootMax = 0;
              rc = q1;
            }
            else {
              irootMax = 1;
              q2 = Math.sqrt(disc) / (2 * b);
              rc = q1 + q2;
            }
            break;
          case 3:
              let a2 = b / a;
              let a1 = c / a;
              let a0 = d / a;
              let Q = (3 * a1 - Math.pow(a2, 2)) / 9;
              let R = (9 * a2 * a1 - 27 * a0 - 2 * Math.pow(a2, 3)) / 54;
              let D = Math.pow(Q, 3) + Math.pow(R, 2);
              U = -a2 / 3;
              if (D > 0) {
                irootMax = 0;
                let rD = Math.sqrt(D);
                S = CubeRoot(R + rD);
                let T = CubeRoot(R - rD);
                rc = U + S + T;
              }
              else if (Math.abs(D) < math.core.EPSILON) {
                irootMax = 1;
                S = Math.pow(R, 1/3);
                rc = U + 2 * S;
              }
              else {
                irootMax = 2;
                let rD = Math.sqrt(-D);
                let phi = Math.atan2(rD, R) / 3;
                let rS = Math.pow(Math.pow(R, 2) - D, 1/6);
                Sr = rS * Math.cos(phi);
                Si = rS * Math.sin(phi);
                rc = U + 2 * Sr;
              }
            break;
          }
        break;
      case 1:
        if (irootMax < 1) { return; }
        switch(order) {
          case 2:
            rc = q1 - q2;
            break;
          case 3:
            if (irootMax === 1) { rc = U - S; }
            else { rc = U - Sr - Math.sqrt(3) * Si; }
            break;
        }
        break;
      case 2:
        if (irootMax < 2) return;
        switch(order) {
          case 3:
            rc = U - Sr + Math.sqrt(3) * Si;
            break;
        }
        break;
    }
    let p1p = [
      d1 * u1[0] + rc * u1p[0],
      d1 * u1[1] + rc * u1p[1]
    ];
    let l_u = math.core.normalize([p1p[0]-p1[0], p1p[1]-p1[1]]);
    let l_d = math.core.dot(l_u, math.core.midpoint2(p1p, p1));
    let creasePoint = [l_d * l_u[0], l_d * l_u[1]];
    let creaseVector = [-l_u[1], l_u[0]];
    return [creasePoint, creaseVector];
  };
  const axiom = function (number, ...parameters) {
    const params = Params(number, ...parameters);
    switch (number) {
      case 1: return axiom1(...params);
      case 2: return axiom2(...params);
      case 3: return axiom3(...params);
      case 4: return axiom4(...params);
      case 5: return axiom5(...params);
      case 6: return axiom6(...params);
      case 7: return axiom7(...params);
      default: return undefined;
    }
  };

  var Axioms = /*#__PURE__*/Object.freeze({
    __proto__: null,
    axiom1: axiom1,
    axiom2: axiom2,
    axiom3: axiom3,
    axiom4: axiom4,
    axiom5: axiom5,
    axiom7: axiom7,
    axiom6: axiom6,
    axiom6RefFinder: axiom6RefFinder,
    axiom6RefFinderFunc: axiom6RefFinderFunc,
    axiom: axiom
  });

  const prepareGraph = function (graph) {
    if ("faces_re:matrix" in graph === false) {
      graph["faces_re:matrix"] = make_faces_matrix(graph, 0);
    }
  };
  const setup = function (origami, svg) {
    prepareGraph(origami);
    let touchFaceIndex = 0;
    let cachedGraph = clone(origami);
    let was_folded = origami.isFolded;
    let viewBox = svg.getViewBox();
    svg.mouseReleased = mouse => undefined;
    svg.mousePressed = (mouse) => {
      viewBox = svg.getViewBox();
      was_folded = origami.isFolded;
      cachedGraph = clone(origami);
      const param = {
        faces_vertices: origami.faces_vertices,
        "faces_re:layer": origami["faces_re:layer"]
      };
      param.vertices_coords = was_folded
        ? (origami["vertices_re:foldedCoords"] || origami.vertices_coords)
        : (origami["vertices_re:unfoldedCoords"] || origami.vertices_coords);
      const faces_containing = faces_containing_point(param, mouse);
      const top_face = topmost_face(param, faces_containing);
      touchFaceIndex = (top_face == null)
        ? 0
        : top_face;
      if (was_folded) {
        cachedGraph.vertices_coords = origami["vertices_re:unfoldedCoords"].slice();
      }
    };
    svg.mouseMoved = (mouse) => {
      if (mouse.isPressed) {
        origami.load(cachedGraph);
        const instruction = axiom2([mouse.position[0], mouse.position[1]], [mouse.pressed[0], mouse.pressed[1]]);
        origami.fold(instruction.solutions[0], touchFaceIndex);
        if (was_folded) {
          origami["vertices_re:unfoldedCoords"] = origami.vertices_coords;
          origami.vertices_coords = origami["vertices_re:foldedCoords"];
          delete origami["vertices_re:foldedCoords"];
          origami.draw();
          svg.setViewBox(...viewBox);
        }
      }
    };
  };

  const FoldToSvgOptionKeys = [
    "input", "output", "padding", "file_frame", "stylesheet", "shadows",
    "boundaries", "faces", "edges", "vertices", "attributes"
  ];
  const possibleFoldToSvgOptions = function (input) {
    if (typeof input !== "object" || input === null) { return 0; }
    const inputKeys = Object.keys(input);
    if (inputKeys.length === 0) { return 0; }
    return inputKeys.map(key => FoldToSvgOptionKeys.includes(key))
      .reduce((a, b) => a + (b ? 1 : 0), 0) / inputKeys.length;
  };
  const parseOptionsForFoldToSvg = function (...args) {
    return args.filter(a => possibleFoldToSvgOptions(a) > 0.1)
      .sort((a, b) => possibleFoldToSvgOptions(b) - possibleFoldToSvgOptions(a))
      .shift();
  };
  const interpreter = {
    gl: "webgl",
    GL: "webgl",
    webGL: "webgl",
    WebGL: "webgl",
    webgl: "webgl",
    Webgl: "webgl",
    svg: "svg",
    SVG: "svg",
    "2d": "svg",
    "2D": "svg",
    "3d": "webgl",
    "3D": "webgl",
  };
  const parseOptionsForView = function (...args) {
    const viewOptions = args
      .filter(a => typeof a === "object")
      .filter(a => "view" in a === true)
      .shift();
    if (viewOptions === undefined) {
      if (isNode) { return undefined; }
      if (isBrowser) { return "svg"; }
    }
    return interpreter[viewOptions.view];
  };
  const SVGView = function (origami, ...args) {
    const noCallbackArgs = args.filter(arg => typeof arg !== "function");
    const svg = root.svg(...noCallbackArgs);
    const argumentOptions = parseOptionsForFoldToSvg(...args);
    const options = argumentOptions == null
      ? { output: "svg" }
      : Object.assign(argumentOptions, { output: "svg" });
    const layerNames = ["boundaries", "edges", "faces", "vertices"];
    const fit = function () {
      const r = bounding_rect(origami);
      svg.setViewBox(...r);
    };
    const getComponent = function (component) {
      const group = Array.from(svg.childNodes)
        .filter(node => component === node.getAttribute("class"))
        .shift();
      return group === undefined
        ? []
        : Array.from(group.childNodes);
    };
    const draw = function (innerArgumentOptions) {
      const drawOptions = innerArgumentOptions == null
        ? options
        : Object.assign(innerArgumentOptions, { output: "svg" });
      const newSVG = FoldToSvg(origami, JSON.parse(JSON.stringify(drawOptions)));
      const newSVGChildren = Array.from(newSVG.childNodes);
      const newSVGGroups = layerNames
        .map(string => newSVGChildren
          .filter(node => string === node.getAttribute("class"))
          .shift())
        .filter(node => node !== undefined);
      const oldSVGChildren = Array.from(svg.childNodes);
      const oldSVGGroups = layerNames
        .map(string => oldSVGChildren
          .filter(node => string === node.getAttribute("class"))
          .shift())
        .filter(node => node !== undefined);
      if (oldSVGGroups.length > 0) {
        newSVGGroups.forEach(node => svg.insertBefore(node, oldSVGGroups[0]));
      } else {
        newSVGGroups.forEach(node => svg.appendChild(node));
      }
      oldSVGGroups.forEach(node => svg.removeChild(node));
      newSVGGroups.forEach(node => node.setAttribute("pointer-events", "none"));
      Array.from(newSVG.attributes)
        .forEach(attr => svg.setAttribute(attr.name, attr.value));
    };
    fit();
    draw();
    origami.changed.handlers.push(caller => draw());
    Object.defineProperty(origami, "draw", { value: draw });
    Object.defineProperty(origami, "svg", { get: () => svg });
    Object.defineProperty(svg, "vertices", { get: () => getComponent("vertices") });
    Object.defineProperty(svg, "edges", { get: () => getComponent("edges") });
    Object.defineProperty(svg, "faces", { get: () => getComponent("faces") });
    Object.defineProperty(svg, "boundaries", { get: () => getComponent("boundaries") });
    if (options.touchFold === true) {
      setup(origami, origami.svg);
    }
    const sendCallback = function () {
      args.filter(arg => typeof arg === "function")
        .forEach(func => func.call(origami, origami));
    };
    if (win.document.readyState === "loading") {
      win.document.addEventListener("DOMContentLoaded", sendCallback);
    } else {
      sendCallback();
    }
  };
  const View = function (origami, ...args) {
    switch (parseOptionsForView(...args)) {
      case "svg": SVGView(origami, ...args); break;
    }
  };

  const get_assignment = function (...args) {
    return args.filter(a => typeof a === "string")
      .filter(a => a.length === 1)
      .shift();
  };

  const boundary_clips = function (b, i) {
    const graph = this;
    Object.defineProperty(b, "clipLine", {
      value: (...args) => [math.core.intersection.convex_poly_line(
            b.vertices.map(v => graph.vertices_coords[v]),
            math.core.get_line(...args).origin,
            math.core.get_line(...args).vector)]});
    Object.defineProperty(b, "clipRay", {
      value: (...args) => [math.core.intersection.convex_poly_ray(
            b.vertices.map(v => graph.vertices_coords[v]),
            math.core.get_line(...args).origin,
            math.core.get_line(...args).vector)]});
    Object.defineProperty(b, "clipSegment", {
      value: (...args) => [math.core.intersection.convex_poly_segment(
            b.vertices.map(v => graph.vertices_coords[v]),
            ...math.core.get_vector_of_vectors(...args))]});
  };
  const boundary_coords = function (b, i) {
    const graph = this;
    Object.defineProperty(b, "coords", {
      get: () => {
        if (!b.vertices || !graph.vertices_coords) { return undefined; }
        return b.vertices.map(v => graph.vertices_coords[v]);
      }
    });
  };
  const setup_boundary = function (b, i) {
    boundary_coords.call(this, b, i);
    boundary_clips.call(this, b, i);
  };
  const getBoundaries = function () {
    const boundaries = [get_boundary(this)];
    boundaries.forEach(setup_boundary.bind(this));
    return boundaries;
  };

  const FACES_MATRIX = "faces_re:matrix";
  const FACES_LAYER = "faces_re:layer";
  const removeLayerInformation = function (graph) {
    if (graph[FACES_LAYER]) { delete graph[FACES_LAYER]; }
    if (graph[FACES_MATRIX]) { delete graph[FACES_MATRIX]; }
  };
  const get_assignment$1 = function (...args) {
    return args.filter(a => typeof a === "string")
      .filter(a => a.length === 1)
      .shift();
  };
  let lastTriggerUpdate = (new Date()).getTime();
  let triggerUpdateTimer;
  const triggerUpdate = () => {
    const now = (new Date()).getTime();
    if (now - lastTriggerUpdate < 100) {
      lastTriggerUpdate = now;
      triggerUpdateTimer = setTimeout(triggerUpdate, 200);
      clearTimeout(triggerUpdateTimer);
    }
  };
  const addLineType = function (getFunc, clipFunc, ...args) {
    const l = getFunc(...args);
    const assignment = get_assignment$1(...args) || "F";
    const poly = get_boundary(this).vertices.map(v => this.vertices_coords[v]);
    const c = clipFunc(poly, l);
    if (c === undefined) { return false; }
    this.vertices_coords.push(c[0], c[1]);
    this.edges_vertices.push([this.vertices_coords.length - 2, this.vertices_coords.length - 1]);
    this.edges_assignment.push(assignment);
    if (triggerUpdate()) { return false; }
    fragment(this);
    populate(this);
    removeLayerInformation(this);
    return true;
  };
  const segment$2 = function (...args) {
    return addLineType.call(this,
      math.core.get_segment,
      (poly, l) => math.core.intersection.convex_poly_segment(poly, l[0], l[1]),
      ...args);
  };
  const ray$1 = function (...args) {
    return addLineType.call(this,
      math.core.get_line,
      (poly, r) => math.core.intersection.convex_poly_ray(poly, r.origin, r.vector),
      ...args);
  };
  const line$2 = function (...args) {
    return addLineType.call(this,
      math.core.get_line,
      (poly, l) => math.core.intersection.convex_poly_line(poly, l.origin, l.vector),
      ...args);
  };

  const VERTICES_FOLDED_COORDS = "vertices_re:foldedCoords";
  const VERTICES_UNFOLDED_COORDS = "vertices_re:unfoldedCoords";
  const FACES_MATRIX$1 = "faces_re:matrix";
  const setFoldedForm = function (graph, isFolded) {
    if (graph.frame_classes == null) { graph.frame_classes = []; }
    const wasFolded = isFoldedState(graph);
    if (isFolded === wasFolded) { return; }
    graph.frame_classes = graph.frame_classes
      .filter(c => !([CREASE_PATTERN, FOLDED_FORM].includes(c)))
      .concat([isFolded ? FOLDED_FORM : CREASE_PATTERN]);
    if (isFolded) {
      if (!(VERTICES_FOLDED_COORDS in graph)) {
        if (graph.faces_vertices == null) { populate(graph); }
        graph[FACES_MATRIX$1] = make_faces_matrix(graph, 0);
        graph[VERTICES_FOLDED_COORDS] = make_vertices_coords_folded(graph, null, graph[FACES_MATRIX$1]);
      }
      graph[VERTICES_UNFOLDED_COORDS] = graph.vertices_coords;
      graph.vertices_coords = graph[VERTICES_FOLDED_COORDS];
      delete graph[VERTICES_FOLDED_COORDS];
    } else {
      if (graph[VERTICES_UNFOLDED_COORDS] == null) { return; }
      graph[VERTICES_FOLDED_COORDS] = graph.vertices_coords;
      graph.vertices_coords = graph[VERTICES_UNFOLDED_COORDS];
      delete graph[VERTICES_UNFOLDED_COORDS];
    }
  };

  const svg_to_png = function (svgElement, callback, options) {
    if (isNode) { return; }
    const canvas = win.document.createElement("canvas");
    canvas.setAttribute("width", "2048");
    canvas.setAttribute("height", "2048");
    const ctx = canvas.getContext("2d");
    const DOMURL = (win.URL || win.webkitURL);
    svgElement.setAttribute("width", "2048");
    svgElement.setAttribute("height", "2048");
    const svgString = (new win.XMLSerializer()).serializeToString(svgElement);
    const svg = new win.Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const img = new win.Image();
    const url = DOMURL.createObjectURL(svg);
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        if (typeof callback === "function") { callback(blob); }
        DOMURL.revokeObjectURL(url);
      }, "image/png");
    };
    img.src = url;
  };
  const export_object = function (graph) {
    const exportObject = function (...args) {
      if (args.length === 0) { return JSON.stringify(graph); }
      switch (args[0]) {
        case "oripa": return convert$1(graph, "fold").oripa();
        case "svg": return convert$1(graph, "fold").svg();
        case "png": return (function () {
          let callback = undefined;
          const promise = { then: function (async) {
            if (isNode) {
              async("png rendering requires running in the browser. unsupported in node js");
            }
            callback = async;
          }};
          svg_to_png(convert$1(graph, "fold").svg({output: "svg"}), function (png) {
            if (png === undefined) { return; }
            promise.data = png;
            if (typeof callback === "function") { callback(png); }
          });
          return promise;
        }());
        default: return JSON.stringify(graph);
      }
    };
    exportObject.json = function () { return JSON.stringify(graph); };
    exportObject.fold = function () { return JSON.stringify(graph); };
    exportObject.svg = function () { return convert$1(graph, "fold").svg(); };
    exportObject.oripa = function () { return convert$1(graph, "fold").oripa(); };
    exportObject.png = function (...args) {
      return (function() {
          let callback = undefined;
          const promise = { then: function (async) {
            if (isNode) {
              async("png rendering requires running in the browser. unsupported in node js");
            }
            callback = async;
          }};
          svg_to_png(convert$1(graph, "fold").svg({output: "svg"}), function (png) {
            if (png === undefined) { return; }
            promise.data = png;
            if (typeof callback === "function") { callback(png); }
          });
          return promise;
        }());
    };
    return exportObject;
  };

  const extensions = ["faces_re:matrix", "faces_re:layer"];
  const DEFAULTS$1 = Object.freeze({
    touchFold: false,
  });
  const parseOptions = function (...args) {
    const keys = Object.keys(DEFAULTS$1);
    const prefs = {};
    Array(...args)
      .filter(obj => typeof obj === "object")
      .forEach(obj => Object.keys(obj)
        .filter(key => keys.includes(key))
        .forEach((key) => { prefs[key] = obj[key]; }));
    return prefs;
  };
  const Origami = function (...args) {
    const origami = Object.assign(
      Object.create(GraphProto),
      args.filter(a => possibleFoldObject(a) > 0)
        .sort((a, b) => possibleFoldObject(b) - possibleFoldObject(a))
        .shift() || square()
    );
    const load = function (object, options = {}) {
      const foldObject = convert$1(object).fold();
      if (options.append !== true) {
        keys.forEach(key => delete origami[key]);
        extensions.forEach(key => delete origami[key]);
      }
      Object.assign(origami, { file_spec, file_creator }, clone(foldObject));
      origami.changed.update(origami.load);
    };
    const crease = function (...methodArgs) {
      const objects = methodArgs.filter(p => typeof p === "object");
      const line = math.core.get_line(methodArgs);
      const assignment = get_assignment(...methodArgs) || "V";
      const face_index = methodArgs.filter(a => a !== null && !isNaN(a)).shift();
      if (!math.core.is_vector(line.origin) || !math.core.is_vector(line.vector)) {
        console.warn("fold was not supplied the correct parameters");
        return;
      }
      const folded = fold_through(origami,
        line.origin,
        line.vector,
        face_index,
        assignment);
      Object.keys(folded)
        .filter(key => typeof origami[key] !== "function")
        .forEach((key) => { origami[key] = folded[key]; });
      if ("re:construction" in origami === true) {
        if (objects.length > 0 && "axiom" in objects[0] === true) {
          origami["re:construction"].axiom = objects[0].axiom;
          origami["re:construction"].parameters = objects[0].parameters;
        }
        origami["re:diagrams"] = [
         build_diagram_frame(origami)
        ];
      }
    };
    const line = function (...methodArgs) {
      if (line$2.call(origami, ...methodArgs)) {
        origami.changed.update(line);
      }
    };
    const ray = function (...methodArgs) {
      if (ray$1.call(origami, ...methodArgs)) {
        origami.changed.update(ray);
      }
    };
    const segment = function (...methodArgs) {
      if (segment$2.call(origami, ...methodArgs)) {
        origami.changed.update(segment);
      }
    };
    const fold = function (...methodArgs) {
      if (methodArgs.length > 0) {
        crease(...methodArgs);
        origami.changed.update(origami.fold);
        return origami;
      } else {
        setFoldedForm(origami, true);
        origami.changed.update(origami.fold);
        return origami;
      }
    };
    const unfold = function () {
      setFoldedForm(origami, false);
      origami.changed.update(origami.unfold);
      return origami;
    };
    const options = {};
    Object.assign(options, DEFAULTS$1);
    const userDefaults = parseOptions(...args);
    Object.keys(userDefaults)
      .forEach((key) => { options[key] = userDefaults[key]; });
    Object.defineProperty(origami, "boundaries", {
      get: () => getBoundaries.call(origami) });
    Object.defineProperty(origami, "load", { value: load });
    Object.defineProperty(origami, "isFolded", { get: () => isFoldedState(origami) });
    Object.defineProperty(origami, "fold", { value: fold });
    Object.defineProperty(origami, "unfold", { value: unfold });
    Object.defineProperty(origami, "export", { get: () => export_object(origami) });
    Object.defineProperty(origami, "line", { value: line });
    Object.defineProperty(origami, "ray", { value: ray });
    Object.defineProperty(origami, "segment", { value: segment });
    View(origami, ...args);
    return origami;
  };
  Origami.empty = (...args) => Origami(empty(), ...args);
  Origami.square = (...args) => Origami(square(), ...args);
  Origami.rectangle = (width, height, ...args) => Origami(rectangle(width, height), ...args);
  Origami.regularPolygon = (sides = 3, radius = 1, ...args) => Origami(regular_polygon(sides, radius), ...args);

  const Graph = function (object = {}) {
    return Object.assign(
      Object.create(GraphProto),
      empty(),
      object,
      { file_spec, file_creator }
    );
  };

  const regularPolygon = (n) => {
    const r = 0.5 / Math.sin(Math.PI / n);
    return Array.from(Array(n))
      .map((_, i) => (i / n) * (2 * Math.PI))
      .map(a => [r * Math.cos(a), r * Math.sin(a)]);
  };
  const finishBoundary = (cp) => {
    cp.clean();
    cp.edges_assignment = cp.edges_assignment.map(() => "B");
    cp.edges_foldAngle = cp.edges_foldAngle.map(() => 0);
    return cp;
  };
  const Static$1 = (func) => {
    const set = [
      null, null, null, "triangle", null, "pentagon", "hexagon", "heptagon", "octogon", "nonagon", "decagon", null, "dodecagon"
    ];
    delete set[0];
    delete set[1];
    delete set[2];
    set.forEach((key, i) => {
      func[key] = function () {
        const cp = func(...arguments);
        cp.polygon(regularPolygon(i));
        return finishBoundary(cp);
      };
    });
    func.square = function () {
      const cp = func(...arguments);
      cp.rect(1, 1);
      return finishBoundary(cp);
    };
  };

  const CP = function () {
    const imported = !!(possibleFoldObject(arguments[0]))
      ? arguments[0]
      : {};
    const cp = Object.assign(
      Object.create(CPProto),
      empty(),
      imported,
      { file_spec, file_creator }
    );
    return cp;
  };
  Static$1(CP);

  const use = function (library) {
    if (typeof library !== "function"
      || library === null
      || typeof library.append !== "function") {
      return;
    }
    library.append(this);
  };

  const flatten_frame$1 = function (fold_file, frame_num) {
    if ("file_frames" in fold_file === false
      || fold_file.file_frames.length < frame_num) {
      return fold_file;
    }
    const dontCopy = ["frame_parent", "frame_inherit"];
    const memo = { visited_frames: [] };
    const recurse = function (recurse_fold, frame, orderArray) {
      if (memo.visited_frames.indexOf(frame) !== -1) {
        throw new Error("encountered a cycle in file_frames. can't flatten.");
      }
      memo.visited_frames.push(frame);
      orderArray = [frame].concat(orderArray);
      if (frame === 0) { return orderArray; }
      if (recurse_fold.file_frames[frame - 1].frame_inherit
         && recurse_fold.file_frames[frame - 1].frame_parent != null) {
        return recurse(recurse_fold, recurse_fold.file_frames[frame - 1].frame_parent, orderArray);
      }
      return orderArray;
    };
    return recurse(fold_file, frame_num, []).map((frame) => {
      if (frame === 0) {
        const swap = fold_file.file_frames;
        fold_file.file_frames = null;
        const copy = clone(fold_file);
        fold_file.file_frames = swap;
        delete copy.file_frames;
        dontCopy.forEach(key => delete copy[key]);
        return copy;
      }
      const outerCopy = clone(fold_file.file_frames[frame - 1]);
      dontCopy.forEach(key => delete outerCopy[key]);
      return outerCopy;
    }).reduce((prev, curr) => Object.assign(prev, curr), {});
  };
  const merge_frame = function (fold_file, frame) {
    const dontCopy = ["frame_parent", "frame_inherit"];
    const copy = clone(frame);
    dontCopy.forEach(key => delete copy[key]);
    const swap = fold_file.file_frames;
    fold_file.file_frames = null;
    const fold = clone(fold_file);
    fold_file.file_frames = swap;
    delete fold.file_frames;
    Object.assign(fold, frame);
    return fold;
  };

  var frames = /*#__PURE__*/Object.freeze({
    __proto__: null,
    flatten_frame: flatten_frame$1,
    merge_frame: merge_frame
  });

  const are_vertices_equivalent$2 = function (a, b, epsilon = math.core.EPSILON) {
    const max = a.length < 2 ? a.length : 2;
    for (let i = 0; i < max; i += 1) {
      if (Math.abs(a[i] - b[i]) > epsilon) {
        return false;
      }
    }
    return true;
  };
  const remove_duplicate_vertices = (g, epsilon = math.core.EPSILON) => {
    const vertices_equivalent = Array
      .from(Array(g.vertices_coords.length)).map(() => []);
    for (let i = 0; i < g.vertices_coords.length - 1; i += 1) {
      for (let j = i + 1; j < g.vertices_coords.length; j += 1) {
        vertices_equivalent[i][j] = are_vertices_equivalent$2(
          g.vertices_coords[i],
          g.vertices_coords[j],
          epsilon
        );
      }
    }
    const vertices_map = g.vertices_coords.map(() => undefined);
    vertices_equivalent
      .forEach((row, i) => row
        .forEach((eq, j) => {
          if (eq) {
            vertices_map[j] = vertices_map[i] === undefined
              ? i
              : vertices_map[i];
          }
        }));
    vertices_map.forEach((map, i) => {
      if (map === undefined) { vertices_map[i] = i; }
    });
    console.log("vertices_equivalent", vertices_equivalent);
    console.log("vertices_map", vertices_map);
  };

  const copy_without_marks = function (graph) {
    const edges_vertices = graph.edges_vertices
      .filter((_, i) => graph.edges_assignment[i] !== "F"
        && graph.edges_assignment[i] !== "f");
    const edges_assignment = graph.edges_assignment
      .filter(ea => ea !== "F" && ea !== "f");
    const copy = clone(graph);
    Object.keys(copy).filter(key => key.substring(0, 9) === "vertices_")
      .forEach(key => delete copy[key]);
    Object.keys(copy).filter(key => key.substring(0, 6) === "edges_")
      .forEach(key => delete copy[key]);
    Object.keys(copy).filter(key => key.substring(0, 6) === "faces_")
      .forEach(key => delete copy[key]);
    const rebuilt = Object.assign(copy, {
      vertices_coords: graph.vertices_coords,
      edges_vertices,
      edges_assignment
    });
    convert.edges_vertices_to_vertices_vertices_sorted(rebuilt);
    convert.vertices_vertices_to_faces_vertices(rebuilt);
    convert.faces_vertices_to_faces_edges(rebuilt);
    rebuilt.edges_faces = make_edges_faces(rebuilt);
    rebuilt.vertices_faces = make_vertices_faces(rebuilt);
    return rebuilt;
  };

  var marks = /*#__PURE__*/Object.freeze({
    __proto__: null,
    copy_without_marks: copy_without_marks
  });

  const select_vertices = function (graph, poly_points) {
    const polygon = math.convexPolygon(poly_points);
    const contains = graph.vertices_coords.map(v => polygon.contains(v));
    return graph.vertices_coords.map((_, i) => i).filter(i => contains[i]);
  };
  const select_edges = function (graph, poly_points) {
    const segments = graph.edges_vertices.map(ev => ev.map(v => graph.vertices_coords[v]));
    const polygon = math.convexPolygon(poly_points);
    const overlaps = segments.map(s => polygon.overlaps(s));
    return segments.map((_, i) => i).filter(i => overlaps[i]);
  };

  var select = /*#__PURE__*/Object.freeze({
    __proto__: null,
    select_vertices: select_vertices,
    select_edges: select_edges
  });

  const alternating_sum$1 = function (...numbers) {
    return [0, 1].map(even_odd => numbers
      .filter((_, i) => i % 2 === even_odd)
      .reduce((a, b) => a + b, 0));
  };
  const kawasaki_flatness = function (...sectorAngles) {
    return alternating_sum$1(...sectorAngles)
      .map(a => (a < 0 ? a + Math.PI * 2 : a))
      .map(a => Math.PI - a)
      .map(n => math.core.clean_number(n, 14));
  };
  const vertex_adjacent_vectors = function (graph, vertex) {
    return graph.vertices_vertices[vertex].map(v => [
      graph.vertices_coords[v][0] - graph.vertices_coords[vertex][0],
      graph.vertices_coords[v][1] - graph.vertices_coords[vertex][1]
    ]);
  };
  const vertex_sectorAngles = function (graph, vertex) {
    return vertex_adjacent_vectors(graph, vertex)
      .map((v, i, arr) => math.core
        .counter_clockwise_angle2(arr[i], arr[(i + 1) % arr.length]));
  };
  const vertex_kawasaki_flatness = function (graph, vertex) {
    return kawasaki_flatness(...vertex_sectorAngles(graph, vertex));
  };
  const make_vertices_sectorAngles = function (graph) {
    return Array.from(Array(graph.vertices_coords.length))
      .map((_, i) => vertex_sectorAngles(graph, i));
  };
  const make_vertices_kawasaki_flatness = function (graph) {
    return Array.from(Array(graph.vertices_coords.length))
      .map((_, i) => vertex_kawasaki_flatness(graph, i));
  };
  const make_vertices_kawasaki = function (graph) {
    const vertices_isBoundary = make_vertices_isBoundary(graph);
    const vertices_flatness = Array.from(Array(graph.vertices_coords.length))
      .map((_, i) => (vertices_isBoundary[i]
        ? [0, 0]
        : vertex_kawasaki_flatness(graph, i)));
    return vertices_flatness;
  };
  const make_vertices_nudge_matrix = function (graph) {
    const arrayVerticesLength = Array.from(Array(graph.vertices_coords.length));
    const vertices_flatness = make_vertices_kawasaki(graph);
    const { vertices_vertices } = graph;
    const vertices_adjVecs = arrayVerticesLength
      .map((_, i) => vertex_adjacent_vectors(graph, i));
    const vertices_nudge_matrix = arrayVerticesLength.map(() => []);
    vertices_flatness.forEach((flatness, i) => {
      if (flatness[0] === 0) { return; }
      vertices_vertices[i].forEach((vv, vvi) => {
        vertices_nudge_matrix[i][vv] = [
          -vertices_adjVecs[i][vvi][1] * flatness[vvi % 2],
          vertices_adjVecs[i][vvi][0] * flatness[vvi % 2]
        ];
      });
    });
    return vertices_nudge_matrix;
  };
  const kawasaki_test = function (graph, EPSILON = math.core.EPSILON) {
    if (graph.vertices_coords == null) { return false; }
    if (graph.vertices_vertices == null) ;
    return make_vertices_kawasaki(graph)
      .map(k => k
        .map(n => Math.abs(n) < EPSILON)
        .reduce((a, b) => a && b, true))
      .reduce((a, b) => a && b, true);
  };
  const make_vertices_nudge = function (graph) {
    const matrix = make_vertices_nudge_matrix(graph);
    const largestMagnitude = matrix
      .map(list => list.reduce((prev, b) => {
        const magnitude = b.length === 0 ? 0 : math.core.magnitude(b);
        return prev > magnitude ? prev : magnitude;
      }, 0));
    const matrix_row_normalized = matrix
      .map((list, i) => list
        .map(el => math.core.magnitude(el) / largestMagnitude[i]));
    const matrix_inverted = matrix_row_normalized.map(a => a.map(b => 1 / b));
    const matrix_weighted = matrix
      .map((row, i) => row
        .map((vec, j) => vec.map(n => n * matrix_inverted[i][j])));
    const vertices_nudge = matrix_weighted
      .map(row => row.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]));
    return vertices_nudge;
  };
  const kawasaki_solutions_radians$1 = function (vectors_radians) {
    return vectors_radians
      .map((v, i, ar) => math.core.counter_clockwise_angle2_radians(
        v, ar[(i + 1) % ar.length]
      ))
      .map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
      .map(opposite_sectors => kawasaki_flatness(...opposite_sectors))
      .map((kawasakis, i) => vectors_radians[i] + kawasakis[0])
      .map((angle, i) => (math.core.is_counter_clockwise_between(angle,
        vectors_radians[i], vectors_radians[(i + 1) % vectors_radians.length])
        ? angle
        : undefined));
  };
  const kawasaki_solutions$1 = function (...vectors) {
    const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
    return kawasaki_solutions_radians$1(...vectors_radians)
      .map(a => (a === undefined
        ? undefined
        : [math.core.clean_number(Math.cos(a), 14), math.core.clean_number(Math.sin(a), 14)]));
  };
  function kawasaki_collapse(graph, vertex, face, crease_direction = "F") {
    const kawasakis = kawasaki_solutions$1(graph, vertex);
    const origin = graph.vertices_coords[vertex];
    split_convex_polygon$1(graph, face, origin, kawasakis[face], crease_direction);
  }

  var kawasaki = /*#__PURE__*/Object.freeze({
    __proto__: null,
    alternating_sum: alternating_sum$1,
    kawasaki_flatness: kawasaki_flatness,
    vertex_adjacent_vectors: vertex_adjacent_vectors,
    vertex_sectorAngles: vertex_sectorAngles,
    vertex_kawasaki_flatness: vertex_kawasaki_flatness,
    make_vertices_sectorAngles: make_vertices_sectorAngles,
    make_vertices_kawasaki_flatness: make_vertices_kawasaki_flatness,
    make_vertices_kawasaki: make_vertices_kawasaki,
    make_vertices_nudge_matrix: make_vertices_nudge_matrix,
    kawasaki_test: kawasaki_test,
    make_vertices_nudge: make_vertices_nudge,
    kawasaki_solutions_radians: kawasaki_solutions_radians$1,
    kawasaki_solutions: kawasaki_solutions$1,
    kawasaki_collapse: kawasaki_collapse
  });

  const replace_edge = function (graph, edge_index, ...new_edges) {
    const prefix = "edges_";
    const prefixKeys = Object.keys(graph)
      .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
      .filter(str => str !== undefined);
    const edges = Array.from(Array(new_edges.length)).map(() => ({}));
    new_edges.forEach((_, i) => prefixKeys
      .filter(pKey => graph[pKey][edge_index] !== undefined)
      .forEach((pKey) => {
        edges[i][pKey] = graph[pKey][edge_index];
      }));
    new_edges.forEach((edge, i) => Object.keys(edge)
      .forEach((key) => { edges[i][key] = new_edges[i][key]; }));
    return edges;
  };
  const edge_split_rebuild_vertices_vertices = function (
    graph,
    edge_vertices,
    new_vertex_index
  ) {
    const update = [];
    edge_vertices.forEach((vert) => { update[vert] = {}; });
    const edges_vertices_other_vertex = ([1, 0].map(i => edge_vertices[i]));
    edge_vertices.forEach((vert, i) => {
      update[vert].vertices_vertices = graph.vertices_vertices[vert]
      !== undefined
        ? [...graph.vertices_vertices[vert]]
        : [edges_vertices_other_vertex[i]];
    });
    const other_index_of = edge_vertices
      .map((v, i) => update[v].vertices_vertices
        .indexOf(edges_vertices_other_vertex[i]));
    edge_vertices.forEach((vert, i) => {
      update[vert].vertices_vertices[other_index_of[i]] = new_vertex_index;
    });
    return update;
  };
  const face_insert_vertex_between_edge = function (
    face_vertices,
    edge_vertices,
    new_vertex_index
  ) {
    const len = face_vertices.length;
    const spliceIndices = face_vertices.map((fv, i, arr) => (
      (fv === edge_vertices[0] && arr[(i + 1) % len] === edge_vertices[1])
      || (fv === edge_vertices[1] && arr[(i + 1) % len] === edge_vertices[0])
        ? (i + 1) % len : undefined))
      .filter(el => el !== undefined);
    const new_face_vertices = [];
    let modI = 0;
    for (let i = 0; i < len + spliceIndices.length; i += 1) {
      if (spliceIndices.includes(i)) {
        modI -= 1;
        new_face_vertices[i] = new_vertex_index;
      } else {
        new_face_vertices[i] = face_vertices[i + modI];
      }
    }
    return new_face_vertices;
  };
  const edges_common_vertex = function (graph, ...edges) {
    const v = edges.map(e => graph.edges_vertices[e]);
    return v[0][0] === v[1][0] || v[0][0] === v[1][1]
      ? v[0][0]
      : v[0][1];
  };
  const face_replace_edge_with_two_edges = function (
    graph,
    face_edges,
    old_edge_index,
    new_vertex_index,
    new_edge_index_0,
    new_edge_index_1,
    new_edge_vertices_0,
    new_edge_vertices_1,
  ) {
    const len = face_edges.length;
    const edge_in_face_edges_index = face_edges.indexOf(old_edge_index);
    const three_edges = [
      face_edges[(edge_in_face_edges_index + len - 1) % len],
      old_edge_index,
      face_edges[(edge_in_face_edges_index + 1) % len]
    ];
    const ordered_verts = ([0, 1]
      .map(i => edges_common_vertex(graph, three_edges[i], three_edges[i + 1])));
    const new_edges_indices = (new_edge_vertices_0[0] === ordered_verts[0]
      || new_edge_vertices_0[1] === ordered_verts[0]
      ? [new_edge_index_0, new_edge_index_1]
      : [new_edge_index_1, new_edge_index_0]);
    const new_face_edges = face_edges.slice();
    if (edge_in_face_edges_index === len - 1) {
      new_face_edges.splice(edge_in_face_edges_index, 1, new_edges_indices[0]);
      new_face_edges.unshift(new_edges_indices[1]);
    } else {
      new_face_edges.splice(edge_in_face_edges_index, 1, ...new_edges_indices);
    }
    return new_face_edges;
  };
  const add_vertex_on_edge$1 = function (
    graph,
    x, y,
    old_edge_index
  ) {
    const vertices_length = graph.vertices_coords.length;
    const edges_length = graph.edges_vertices.length;
    if (edges_length < old_edge_index) { return undefined; }
    const result = {
      remove: {
        edges: [old_edge_index],
      },
      update: edge_split_rebuild_vertices_vertices(graph,
        graph.edges_vertices[old_edge_index], vertices_length),
      new: {
        vertices: [{
          vertices_coords: [x, y],
          vertices_vertices: [...graph.edges_vertices[old_edge_index]],
          vertices_faces: (graph.edges_faces ? graph.edges_faces[old_edge_index] : undefined)
        }],
        edges: replace_edge(graph, old_edge_index,
          ...graph.edges_vertices[old_edge_index]
            .map(ev => ({ edges_vertices: [ev, vertices_length] }))),
        faces: []
      }
    };
    if (graph.edges_faces) {
      graph.edges_faces[old_edge_index].forEach((i) => {
        if (result.update[i] === undefined) { result.update[i] = {}; }
        result.update[i].faces_vertices = face_insert_vertex_between_edge(
          graph.faces_vertices[i],
          graph.edges_vertices[old_edge_index],
          vertices_length
        );
        result.update[i].faces_edges = face_replace_edge_with_two_edges(
          graph,
          graph.faces_edges[i],
          old_edge_index,
          vertices_length,
          edges_length,
          edges_length + 1,
          result.new.edges[0].edges_vertices,
          result.new.edges[1].edges_vertices,
        );
      });
    }
    return result;
  };

  var empty$1 = "{\n  \"file_spec\": 1.1,\n  \"file_creator\": \"\",\n  \"file_author\": \"\",\n  \"file_title\": \"\",\n  \"file_description\": \"\",\n  \"file_classes\": [],\n  \"file_frames\": [],\n\n  \"frame_author\": \"\",\n  \"frame_title\": \"\",\n  \"frame_description\": \"\",\n  \"frame_attributes\": [],\n  \"frame_classes\": [],\n  \"frame_unit\": \"\",\n\n  \"vertices_coords\": [],\n  \"vertices_vertices\": [],\n  \"vertices_faces\": [],\n\n  \"edges_vertices\": [],\n  \"edges_faces\": [],\n  \"edges_assignment\": [],\n  \"edges_foldAngle\": [],\n  \"edges_length\": [],\n\n  \"faces_vertices\": [],\n  \"faces_edges\": [],\n\n  \"edgeOrders\": [],\n  \"faceOrders\": []\n}\n";

  var square$1 = "{\n  \"file_spec\": 1.1,\n  \"file_creator\": \"Rabbit Ear\",\n  \"file_classes\": [\"singleModel\"],\n  \"frame_attributes\": [\"2D\"],\n  \"frame_classes\": [\"creasePattern\"],\n  \"vertices_coords\": [[0,0], [1,0], [1,1], [0,1]],\n  \"vertices_vertices\": [[1,3], [2,0], [3,1], [0,2]],\n  \"vertices_faces\": [[0], [0], [0], [0]],\n  \"edges_vertices\": [[0,1], [1,2], [2,3], [3,0]],\n  \"edges_faces\": [[0], [0], [0], [0]],\n  \"edges_assignment\": [\"B\",\"B\",\"B\",\"B\"],\n  \"edges_foldAngle\": [0, 0, 0, 0],\n  \"edges_length\": [1, 1, 1, 1],\n  \"faces_vertices\": [[0,1,2,3]],\n  \"faces_edges\": [[0,1,2,3]]\n}";

  var book = "{\n  \"file_spec\": 1.1,\n  \"file_creator\": \"Rabbit Ear\",\n  \"file_classes\": [\"singleModel\"],\n  \"frame_attributes\": [\"2D\"],\n  \"frame_classes\": [\"creasePattern\"],\n  \"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,1], [0.5,1], [0,1]],\n  \"vertices_vertices\": [[1,5], [2,4,0], [3,1], [4,2], [5,1,3], [0,4]],\n  \"vertices_faces\": [[0], [0,1], [1], [1], [1,0], [0]],\n  \"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [1,4]],\n  \"edges_faces\": [[0], [1], [1], [1], [0], [0], [0,1]],\n  \"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\"],\n  \"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180],\n  \"edges_length\": [0.5, 0.5, 1, 0.5, 0.5, 1, 1],\n  \"faces_vertices\": [[1,4,5,0], [4,1,2,3]],\n  \"faces_edges\": [[6,4,5,0], [6,1,2,3]]\n}";

  var blintz = "{\n  \"file_spec\": 1.1,\n  \"file_creator\": \"Rabbit Ear\",\n  \"file_classes\": [\"singleModel\"],\n  \"frame_attributes\": [\"2D\"],\n  \"frame_classes\": [\"creasePattern\"],\n  \"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,0.5], [1,1], [0.5,1], [0,1], [0,0.5]],\n  \"vertices_vertices\": [[1,7], [2,3,7,0], [3,1], [4,5,1,2], [5,3], [6,7,3,4], [7,5], [0,1,5,6]],\n  \"vertices_faces\": [[0], [1,4,0], [1], [2,4,1], [2], [3,4,2], [3], [0,4,3]],\n  \"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,3], [3,5], [5,7], [7,1]],\n  \"edges_faces\": [[0], [1], [1], [2], [2], [3], [3], [0], [1,4], [2,4], [3,4], [0,4]],\n  \"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\",\"V\",\"V\",\"V\"],\n  \"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n  \"edges_length\": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.7071067811865476, 0.7071067811865476, 0.7071067811865476, 0.7071067811865476],\n  \"faces_vertices\": [[0,1,7], [2,3,1], [4,5,3], [6,7,5], [1,3,5,7]],\n  \"faces_edges\": [[0,11,7], [2,8,1], [4,9,3], [6,10,5], [8,9,10,11]],\n  \"file_frames\": [{\n    \"frame_classes\": [\"foldedForm\"],\n    \"frame_parent\": 0,\n    \"frame_inherit\": true,\n    \"vertices_coords\": [[0.5,0.5], [0.5,0.0], [0.5,0.5], [1.0,0.5], [0.5,0.5], [0.5,1.0], [0.5,0.5], [0.0,0.5]],\n    \"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 180, 180, 180, 180],\n    \"faceOrders\": [[0,4,1], [1,4,1], [2,4,1], [3,4,1]]\n  }]\n}";

  var kite = "{\n  \"file_spec\": 1.1,\n  \"file_creator\": \"Rabbit Ear\",\n  \"file_classes\": [\"singleModel\"],\n  \"frame_attributes\": [\"2D\"],\n  \"frame_classes\": [\"creasePattern\"],\n  \"vertices_coords\": [\n    [0,0],\n    [0.414213562373095,0],\n    [1,0],\n    [1,0.585786437626905],\n    [1,1],\n    [0,1]\n  ],\n  \"vertices_vertices\": [ [1,5], [2,5,0], [3,5,1], [4,5,2], [5,3], [0,1,2,3,4] ],\n  \"vertices_faces\": [ [0], [1,0], [2,1], [3,2], [3], [0,1,2,3] ],\n  \"edges_vertices\": [\n    [0,1],\n    [1,2],\n    [2,3],\n    [3,4],\n    [4,5],\n    [5,0],\n    [5,1],\n    [3,5],\n    [5,2]\n  ],\n  \"edges_faces\": [[0], [1], [2], [3], [3], [0], [0,1], [3,2], [1,2]],\n  \"edges_assignment\": [\"B\", \"B\", \"B\", \"B\", \"B\", \"B\", \"V\", \"V\", \"F\"],\n  \"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180, 180, 0],\n  \"edges_length\": [0.414213562373095, 0.585786437626905, 0.585786437626905, 0.414213562373095, 1, 1, 1.082392200292394, 1.082392200292394, 1.414213562373095],\n  \"faces_vertices\": [\n    [0,1,5],\n    [1,2,5],\n    [2,3,5],\n    [3,4,5]\n  ],\n  \"faces_edges\": [\n    [0,6,5],\n    [1,8,6],\n    [2,7,8],\n    [3,4,7]\n  ],\n  \"file_frames\": [{\n    \"frame_classes\": [\"foldedForm\"],\n    \"frame_parent\": 0,\n    \"frame_inherit\": true,\n    \"vertices_coords\": [\n      [0.707106781186548,0.292893218813452],\n      [1,0],\n      [0.707106781186548,0.292893218813452],\n      [0,1],\n      [0.414213562373095,0],\n      [1,0.585786437626905]\n    ],\n    \"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180, 180, 0],\n    \"faceOrders\": [[0,1,1], [3,2,1]]\n  }]\n}";

  var fish = "{\n  \"file_spec\": 1.1,\n  \"file_creator\": \"Rabbit Ear\",\n  \"file_classes\": [\"singleModel\"],\n  \"frame_attributes\": [\"2D\"],\n  \"frame_classes\": [\"creasePattern\"],\n  \"vertices_coords\": [\n    [0,0],\n    [1,0],\n    [1,1],\n    [0,1],\n    [0.292893218813452,0.292893218813452],\n    [0.707106781186548,0.707106781186548],\n    [0.292893218813452,0],\n    [1,0.707106781186548]\n  ],\n  \"edges_vertices\": [\n  \t[2,3], [3,0], [3,1], [0,4], [1,4], [3,4], [1,5], [2,5], [3,5], [4,6], [0,6], [6,1], [5,7], [1,7], [7,2]\n  ],\n  \"edges_assignment\": [\n  \t\"B\", \"B\", \"F\", \"M\", \"M\", \"M\", \"M\", \"M\", \"M\", \"V\", \"B\", \"B\", \"V\", \"B\", \"B\"\n  ],\n  \"file_frames\": [{\n    \"frame_classes\": [\"foldedForm\"],\n    \"frame_parent\": 0,\n    \"frame_inherit\": true,\n    \"vertices_coords\":[[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.5,0.5],[0.5,0.5]]\n  }],\n  \"vertices_vertices\": [\n    [6,4,3],\n    [7,5,3,4,6],\n    [5,7,3],\n    [0,4,1,5,2],\n    [0,6,1,3],\n    [1,7,2,3],\n    [1,4,0],\n    [1,2,5]\n  ],\n  \"faces_vertices\": [\n    [4,0,6],\n    [3,0,4],\n    [5,1,7],\n    [3,1,5],\n    [4,1,3],\n    [6,1,4],\n    [5,2,3],\n    [7,2,5]\n  ],\n  \"faces_edges\": [\n    [3,10,9],\n    [1,3,5],\n    [6,13,12],\n    [2,6,8],\n    [4,2,5],\n    [11,4,9],\n    [7,0,8],\n    [14,7,12]\n  ],\n  \"edges_faces\": [[6], [1], [3,4], [0,1], [4,5], [1,4], [2,3], [6,7], [3,6], [0,5], [0], [5], [2,7], [2], [7]],\n  \"vertices_faces\": [[0,1], [2,3,4,5], [6,7], [1,3,4,6], [0,1,4,5], [2,3,6,7], [0,5], [2,7]],\n  \"edges_length\": [1, 1, 1.4142135623730951, 0.41421356237309437, 0.7653668647301798, 0.7653668647301798, 0.7653668647301798, 0.41421356237309437, 0.7653668647301798, 0.292893218813452, 0.292893218813452, 0.707106781186548, 0.292893218813452, 0.707106781186548, 0.292893218813452],\n  \"edges_foldAngle\": [0, 0, 0, -180, -180, -180, -180, -180, -180, 180, 0, 0, 180, 0, 0],\n  \"faces_faces\": [\n  \t[1,5], [0,4], [3,7], [2,4,6], [3,1,5], [4,0], [3,7], [6,2]\n  ],\n  \"vertices_edges\": [\n    [1,3,10],\n    [2,4,6,11,13],\n    [0,7,14],\n    [0,1,2,5,8],\n    [3,4,5,9],\n    [6,7,8,12],\n    [9,10,11],\n    [12,13,14]\n  ]\n}\n";

  var bird = "{\n  \"file_spec\": 1.1,\n  \"file_creator\": \"Rabbit Ear\",\n  \"file_classes\": [\"singleModel\"],\n  \"frame_attributes\": [\"2D\"],\n  \"frame_classes\": [\"creasePattern\"],\n  \"vertices_coords\": [\n    [0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.207106781186548,0.5],[0.5,0.207106781186548],[0.792893218813452,0.5],[0.5,0.792893218813452],[0.353553390593274,0.646446609406726],[0.646446609406726,0.646446609406726],[0.646446609406726,0.353553390593274],[0.353553390593274,0.353553390593274],[0,0.5],[0.5,0],[1,0.5],[0.5,1]\n  ],\n  \"edges_vertices\": [\n    [3,5],[5,9],[3,9],[3,13],[5,13],[0,5],[0,13],[0,12],[5,12],[4,5],[4,12],[4,9],[0,6],[6,12],[0,14],[6,14],[1,6],[1,14],[1,11],[6,11],[4,6],[4,11],[1,7],[7,11],[1,15],[7,15],[2,7],[2,15],[2,10],[7,10],[4,7],[4,10],[2,8],[8,10],[2,16],[8,16],[3,8],[3,16],[8,9],[4,8]\n  ],\n  \"edges_faces\": [\n    [0,1],[0,5],[21,0],[1],[2,1],[2,3],[2],[3,6],[4,3],[4,5],[11,4],[5,22],[6,7],[6,11],[7],[8,7],[8,9],[8],[9,12],[10,9],[10,11],[17,10],[12,13],[12,17],[13],[14,13],[14,15],[14],[15,18],[16,15],[16,17],[23,16],[18,19],[18,23],[19],[20,19],[20,21],[20],[22,21],[22,23]\n  ],\n  \"edges_assignment\": [\n    \"M\",\"F\",\"V\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"V\",\"F\",\"M\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"M\"\n  ],\n  \"faces_vertices\": [\n    [3,5,9],[5,3,13],[0,5,13],[5,0,12],[4,5,12],[5,4,9],[0,6,12],[6,0,14],[1,6,14],[6,1,11],[4,6,11],[6,4,12],[1,7,11],[7,1,15],[2,7,15],[7,2,10],[4,7,10],[7,4,11],[2,8,10],[8,2,16],[3,8,16],[8,3,9],[4,8,9],[8,4,10]\n  ],\n  \"faces_edges\": [\n    [0,1,2],[0,3,4],[5,4,6],[5,7,8],[9,8,10],[9,11,1],[12,13,7],[12,14,15],[16,15,17],[16,18,19],[20,19,21],[20,10,13],[22,23,18],[22,24,25],[26,25,27],[26,28,29],[30,29,31],[30,21,23],[32,33,28],[32,34,35],[36,35,37],[36,2,38],[39,38,11],[39,31,33]\n  ],\n  \"vertices_vertices\": [\n    [14,6,12,5,13],[15,7,11,6,14],[8,10,7,15,16],[13,5,9,8,16],[12,6,11,7,10,8,9,5],[0,12,4,9,3,13],[0,14,1,11,4,12],[11,1,15,2,10,4],[9,4,10,2,16,3],[5,4,8,3],[4,7,2,8],[6,1,7,4],[0,6,4,5],[0,5,3],[1,6,0],[1,2,7],[8,2,3]\n  ],\n  \"vertices_faces\": [\n    [2,3,6,7],[8,9,12,13],[14,15,18,19],[0,1,20,21],[4,5,10,11,16,17,22,23],[0,1,2,3,4,5],[6,7,8,9,10,11],[12,13,14,15,16,17],[18,19,20,21,22,23],[0,5,21,22],[15,16,18,23],[9,10,12,17],[3,4,6,11],[1,2],[7,8],[13,14],[19,20]\n  ],\n  \"edges_length\": [\n    0.5411961001461971,0.20710678118654724,0.5,0.5,0.207106781186548,0.5411961001461971,0.5,0.5,0.2071067811865472,0.292893218813452,0.20710678118654718,0.2071067811865472,0.5411961001461971,0.2071067811865472,0.5,0.207106781186548,0.5411961001461971,0.5,0.5,0.20710678118654724,0.292893218813452,0.2071067811865472,0.5411961001461971,0.20710678118654713,0.5,0.20710678118654802,0.5411961001461971,0.5,0.5,0.20710678118654718,0.292893218813452,0.20710678118654727,0.5411961001461971,0.20710678118654718,0.5,0.20710678118654802,0.5411961001461971,0.5,0.20710678118654713,0.292893218813452\n  ],\n  \"edges_foldAngle\": [\n    -180,0,180,0,180,-180,0,0,0,-180,0,180,-180,0,0,180,-180,0,180,0,-180,180,-180,0,0,180,-180,0,0,0,-180,0,-180,0,0,180,-180,0,0,-180\n  ],\n  \"faces_faces\": [\n    [1,5,21],[0,2],[1,3],[2,4,6],[3,5,11],[4,0,22],[3,7,11],[6,8],[7,9],[8,10,12],[9,11,17],[10,4,6],[9,13,17],[12,14],[13,15],[14,16,18],[15,17,23],[16,10,12],[15,19,23],[18,20],[19,21],[20,0,22],[21,5,23],[22,16,18]\n  ],\n  \"vertices_edges\": [\n    [5,6,7,12,14],[16,17,18,22,24],[26,27,28,32,34],[0,2,3,36,37],[9,10,11,20,21,30,31,39],[0,1,4,5,8,9],[12,13,15,16,19,20],[22,23,25,26,29,30],[32,33,35,36,38,39],[1,2,11,38],[28,29,31,33],[18,19,21,23],[7,8,10,13],[3,4,6],[14,15,17],[24,25,27],[34,35,37]\n  ],\n  \"edges_edges\": [\n    [2,3,36,37,1,4,5,8,9],[0,4,5,8,9,2,11,38],[0,3,36,37,1,11,38],[0,2,36,37,4,6],[0,1,5,8,9,3,6],[6,7,12,14,0,1,4,8,9],[5,7,12,14,3,4],[5,6,12,14,8,10,13],[0,1,4,5,9,7,10,13],[10,11,20,21,30,31,39,0,1,4,5,8],[9,11,20,21,30,31,39,7,8,13],[9,10,20,21,30,31,39,1,2,38],[5,6,7,14,13,15,16,19,20],[12,15,16,19,20,7,8,10],[5,6,7,12,15,17],[12,13,16,19,20,14,17],[17,18,22,24,12,13,15,19,20],[16,18,22,24,14,15],[16,17,22,24,19,21,23],[12,13,15,16,20,18,21,23],[9,10,11,21,30,31,39,12,13,15,16,19],[9,10,11,20,30,31,39,18,19,23],[16,17,18,24,23,25,26,29,30],[22,25,26,29,30,18,19,21],[16,17,18,22,25,27],[22,23,26,29,30,24,27],[27,28,32,34,22,23,25,29,30],[26,28,32,34,24,25],[26,27,32,34,29,31,33],[22,23,25,26,30,28,31,33],[9,10,11,20,21,31,39,22,23,25,26,29],[9,10,11,20,21,30,39,28,29,33],[26,27,28,34,33,35,36,38,39],[32,35,36,38,39,28,29,31],[26,27,28,32,35,37],[32,33,36,38,39,34,37],[0,2,3,37,32,33,35,38,39],[0,2,3,36,34,35],[32,33,35,36,39,1,2,11],[9,10,11,20,21,30,31,32,33,35,36,38]\n  ]\n}";

  var frog = "{\n  \"file_spec\": 1.1,\n  \"file_creator\": \"Rabbit Ear\",\n  \"file_classes\": [\"singleModel\"],\n  \"frame_attributes\": [\"2D\"],\n  \"frame_classes\": [\"creasePattern\"],\n  \"vertices_coords\": [\n    [0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0,0.5],[0.5,0],[1,0.5],[0.5,1],[0.146446609406726,0.353553390593274],[0.353553390593274,0.146446609406726],[0.646446609406726,0.146446609406726],[0.853553390593274,0.353553390593274],[0.853553390593274,0.646446609406726],[0.646446609406726,0.853553390593274],[0.353553390593274,0.853553390593274],[0.146446609406726,0.646446609406726],[0,0.353553390593274],[0,0.646446609406726],[0.353553390593274,0],[0.646446609406726,0],[1,0.353553390593274],[1,0.646446609406726],[0.646446609406726,1],[0.353553390593274,1]\n  ],\n  \"edges_vertices\": [\n    [0,4],[4,9],[0,9],[0,10],[4,10],[2,4],[2,14],[4,14],[4,13],[2,13],[3,4],[4,15],[3,15],[3,16],[4,16],[1,4],[1,12],[4,12],[4,11],[1,11],[4,5],[5,9],[5,16],[4,6],[6,11],[6,10],[4,7],[7,13],[7,12],[4,8],[8,15],[8,14],[9,17],[0,17],[5,17],[0,19],[10,19],[6,19],[11,20],[1,20],[6,20],[1,21],[12,21],[7,21],[13,22],[2,22],[7,22],[2,23],[14,23],[8,23],[15,24],[3,24],[8,24],[3,18],[16,18],[5,18]\n  ],\n  \"edges_faces\": [\n    [0,1],[0,8],[16,0],[1,18],[11,1],[3,2],[2,26],[15,2],[3,12],[24,3],[4,5],[4,14],[28,4],[5,30],[9,5],[7,6],[6,22],[13,6],[7,10],[20,7],[8,9],[8,17],[31,9],[10,11],[10,21],[19,11],[12,13],[12,25],[23,13],[14,15],[14,29],[27,15],[16,17],[16],[17],[18],[19,18],[19],[20,21],[20],[21],[22],[23,22],[23],[24,25],[24],[25],[26],[27,26],[27],[28,29],[28],[29],[30],[31,30],[31]\n  ],\n  \"edges_assignment\": [\n    \"F\",\"M\",\"M\",\"M\",\"M\",\"F\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\"\n  ],\n  \"faces_vertices\": [\n    [0,4,9],[4,0,10],[4,2,14],[2,4,13],[3,4,15],[4,3,16],[4,1,12],[1,4,11],[4,5,9],[5,4,16],[4,6,11],[6,4,10],[4,7,13],[7,4,12],[4,8,15],[8,4,14],[0,9,17],[9,5,17],[10,0,19],[6,10,19],[1,11,20],[11,6,20],[12,1,21],[7,12,21],[2,13,22],[13,7,22],[14,2,23],[8,14,23],[3,15,24],[15,8,24],[16,3,18],[5,16,18]\n  ],\n  \"faces_edges\": [\n    [0,1,2],[0,3,4],[5,6,7],[5,8,9],[10,11,12],[10,13,14],[15,16,17],[15,18,19],[20,21,1],[20,14,22],[23,24,18],[23,4,25],[26,27,8],[26,17,28],[29,30,11],[29,7,31],[2,32,33],[21,34,32],[3,35,36],[25,36,37],[19,38,39],[24,40,38],[16,41,42],[28,42,43],[9,44,45],[27,46,44],[6,47,48],[31,48,49],[12,50,51],[30,52,50],[13,53,54],[22,54,55]\n  ],\n  \"vertices_vertices\": [\n    [19,10,4,9,17],[21,12,4,11,20],[14,4,13,22,23],[18,16,4,15,24],[9,0,10,6,11,1,12,7,13,2,14,8,15,3,16,5],[17,9,4,16,18],[20,11,4,10,19],[12,21,22,13,4],[15,4,14,23,24],[0,4,5,17],[0,19,6,4],[6,20,1,4],[1,21,7,4],[4,7,22,2],[4,2,23,8],[4,8,24,3],[5,4,3,18],[0,9,5],[5,16,3],[6,10,0],[1,11,6],[1,7,12],[7,2,13],[14,2,8],[15,8,3]\n  ],\n  \"vertices_faces\": [\n    [0,1,16,18],[6,7,20,22],[2,3,24,26],[4,5,28,30],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],[8,9,17,31],[10,11,19,21],[12,13,23,25],[14,15,27,29],[0,8,16,17],[1,11,18,19],[7,10,20,21],[6,13,22,23],[3,12,24,25],[2,15,26,27],[4,14,28,29],[5,9,30,31],[16,17],[30,31],[18,19],[20,21],[22,23],[24,25],[26,27],[28,29]\n  ],\n  \"edges_length\": [\n    0.7071067811865476,0.3826834323650899,0.3826834323650899,0.3826834323650899,0.3826834323650899,0.7071067811865476,0.3826834323650899,0.3826834323650899,0.3826834323650899,0.3826834323650899,0.7071067811865476,0.38268343236508984,0.38268343236508995,0.38268343236508984,0.38268343236508995,0.7071067811865476,0.38268343236508995,0.38268343236508984,0.38268343236508995,0.38268343236508984,0.5,0.20710678118654718,0.2071067811865472,0.5,0.2071067811865472,0.20710678118654718,0.5,0.20710678118654727,0.2071067811865472,0.5,0.2071067811865472,0.20710678118654727,0.146446609406726,0.353553390593274,0.146446609406726,0.353553390593274,0.146446609406726,0.146446609406726,0.146446609406726,0.35355339059327395,0.14644660940672605,0.353553390593274,0.14644660940672605,0.146446609406726,0.14644660940672605,0.35355339059327395,0.14644660940672605,0.35355339059327395,0.14644660940672605,0.14644660940672605,0.14644660940672605,0.353553390593274,0.146446609406726,0.35355339059327395,0.146446609406726,0.14644660940672605\n  ],\n  \"edges_foldAngle\": [\n    0,-180,-180,-180,-180,0,-180,-180,-180,-180,180,-180,-180,-180,-180,180,-180,-180,-180,-180,180,-180,-180,180,-180,-180,180,-180,-180,180,-180,-180,180,0,0,0,180,0,180,0,0,0,180,0,180,0,0,0,180,0,180,0,0,0,180,0\n  ],\n  \"faces_faces\": [\n    [1,8,16],[0,11,18],[3,15,26],[2,12,24],[5,14,28],[4,9,30],[7,13,22],[6,10,20],[0,9,17],[8,5,31],[7,11,21],[10,1,19],[3,13,25],[12,6,23],[4,15,29],[14,2,27],[0,17],[8,16],[1,19],[11,18],[7,21],[10,20],[6,23],[13,22],[3,25],[12,24],[2,27],[15,26],[4,29],[14,28],[5,31],[9,30]\n  ],\n  \"vertices_edges\": [\n    [0,2,3,33,35],[15,16,19,39,41],[5,6,9,45,47],[10,12,13,51,53],[0,1,4,5,7,8,10,11,14,15,17,18,20,23,26,29],[20,21,22,34,55],[23,24,25,37,40],[26,27,28,43,46],[29,30,31,49,52],[1,2,21,32],[3,4,25,36],[18,19,24,38],[16,17,28,42],[8,9,27,44],[6,7,31,48],[11,12,30,50],[13,14,22,54],[32,33,34],[53,54,55],[35,36,37],[38,39,40],[41,42,43],[44,45,46],[47,48,49],[50,51,52]\n  ],\n  \"edges_edges\": [\n    [2,3,33,35,1,4,5,7,8,10,11,14,15,17,18,20,23,26,29],[0,4,5,7,8,10,11,14,15,17,18,20,23,26,29,2,21,32],[0,3,33,35,1,21,32],[0,2,33,35,4,25,36],[0,1,5,7,8,10,11,14,15,17,18,20,23,26,29,3,25,36],[6,9,45,47,0,1,4,7,8,10,11,14,15,17,18,20,23,26,29],[5,9,45,47,7,31,48],[0,1,4,5,8,10,11,14,15,17,18,20,23,26,29,6,31,48],[0,1,4,5,7,10,11,14,15,17,18,20,23,26,29,9,27,44],[5,6,45,47,8,27,44],[12,13,51,53,0,1,4,5,7,8,11,14,15,17,18,20,23,26,29],[0,1,4,5,7,8,10,14,15,17,18,20,23,26,29,12,30,50],[10,13,51,53,11,30,50],[10,12,51,53,14,22,54],[0,1,4,5,7,8,10,11,15,17,18,20,23,26,29,13,22,54],[16,19,39,41,0,1,4,5,7,8,10,11,14,17,18,20,23,26,29],[15,19,39,41,17,28,42],[0,1,4,5,7,8,10,11,14,15,18,20,23,26,29,16,28,42],[0,1,4,5,7,8,10,11,14,15,17,20,23,26,29,19,24,38],[15,16,39,41,18,24,38],[0,1,4,5,7,8,10,11,14,15,17,18,23,26,29,21,22,34,55],[20,22,34,55,1,2,32],[20,21,34,55,13,14,54],[0,1,4,5,7,8,10,11,14,15,17,18,20,26,29,24,25,37,40],[23,25,37,40,18,19,38],[23,24,37,40,3,4,36],[0,1,4,5,7,8,10,11,14,15,17,18,20,23,29,27,28,43,46],[26,28,43,46,8,9,44],[26,27,43,46,16,17,42],[0,1,4,5,7,8,10,11,14,15,17,18,20,23,26,30,31,49,52],[29,31,49,52,11,12,50],[29,30,49,52,6,7,48],[1,2,21,33,34],[0,2,3,35,32,34],[20,21,22,55,32,33],[0,2,3,33,36,37],[3,4,25,35,37],[23,24,25,40,35,36],[18,19,24,39,40],[15,16,19,41,38,40],[23,24,25,37,38,39],[15,16,19,39,42,43],[16,17,28,41,43],[26,27,28,46,41,42],[8,9,27,45,46],[5,6,9,47,44,46],[26,27,28,43,44,45],[5,6,9,45,48,49],[6,7,31,47,49],[29,30,31,52,47,48],[11,12,30,51,52],[10,12,13,53,50,52],[29,30,31,49,50,51],[10,12,13,51,54,55],[13,14,22,53,55],[20,21,22,34,53,54]\n  ]\n}";

  const core = Object.create(null);
  Object.assign(core,
    frames,
    object,
    collinear,
    isolated,
    keys$1,
    affine,
    validate,
    boundary,
    similar,
    make,
    marks,
    select,
    query$1,
    kawasaki,
    Axioms);
  core.build_diagram_frame = build_diagram_frame;
  core.add_edge = add_edge;
  core.split_edge_run = add_vertex_on_edge$1;
  core.apply_run = apply_run_diff;
  core.merge_run = merge_run_diffs;
  core.apply_axiom = make_axiom_frame;
  core.fragment = fragment;
  core.clean = clean;
  core.join = join;
  core.remove = remove_geometry_key_indices;
  core.rebuild = rebuild;
  core.populate = populate;
  core.validate = Validate;
  core.remove_duplicate_vertices = remove_duplicate_vertices;
  const b = {
    empty: JSON.parse(empty$1),
    square: JSON.parse(square$1),
    book: JSON.parse(book),
    blintz: JSON.parse(blintz),
    kite: JSON.parse(kite),
    fish: JSON.parse(fish),
    bird: JSON.parse(bird),
    frog: JSON.parse(frog),
  };
  const bases = Object.create(null);
  Object.defineProperty(bases, "empty", { get: () => core.clone(b.empty) });
  Object.defineProperty(bases, "square", { get: () => core.clone(b.square) });
  Object.defineProperty(bases, "book", { get: () => core.clone(b.book) });
  Object.defineProperty(bases, "blintz", { get: () => core.clone(b.blintz) });
  Object.defineProperty(bases, "kite", { get: () => core.clone(b.kite) });
  Object.defineProperty(bases, "fish", { get: () => core.clone(b.fish) });
  Object.defineProperty(bases, "bird", { get: () => core.clone(b.bird) });
  Object.defineProperty(bases, "frog", { get: () => core.clone(b.frog) });
  const rabbitEar = Object.assign(root, {
    origami: Origami,
    graph: Graph,
    cp: CP,
    fold: fold_through,
    convert: convert$1,
    core,
    bases,
    text: { axioms: JSON.parse(text_axioms) },
    math: math.core,
    axiom: axiom,
  });
  Object.keys(math)
    .filter(key => key !== "core")
    .forEach((key) => { rabbitEar[key] = math[key]; });
  rabbitEar.use = use.bind(rabbitEar);
  win.RabbitEar = rabbitEar;

  return rabbitEar;

})));
