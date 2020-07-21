/* Math (c) Robby Kraft, MIT License */
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

var algebra = /*#__PURE__*/Object.freeze({
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

var matrix2 = /*#__PURE__*/Object.freeze({
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

var matrix3 = /*#__PURE__*/Object.freeze({
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

var Arguments = /*#__PURE__*/Object.freeze({
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

var equal = /*#__PURE__*/Object.freeze({
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

var query = /*#__PURE__*/Object.freeze({
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
const intersect_2D = (aVector, aOrigin, bVector, bOrigin, compFunc, epsilon = EPSILON) => {
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
const intersect = (a, b, compFunc, epsilon = EPSILON) => intersect_2D(
  a.vector, a.origin, b.vector, b.origin, compFunc, epsilon
);

var IntersectionLines = /*#__PURE__*/Object.freeze({
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
  intersect_2D: intersect_2D,
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

var geometry = /*#__PURE__*/Object.freeze({
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

var interpolation = /*#__PURE__*/Object.freeze({
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

var nearest = /*#__PURE__*/Object.freeze({
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

var origami = /*#__PURE__*/Object.freeze({
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

var IntersectionCircle = /*#__PURE__*/Object.freeze({
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
const intersect_seg_seg_exclude = (a0, a1, b0, b1) => {
  const a = { origin: a0, vector: [[a1[0] - a0[0]], [a1[1] - a0[1]]] };
  const b = { origin: b0, vector: [[b1[0] - b0[0]], [b1[1] - b0[1]]] };
  return intersect(a, b, exclude_s_s);
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
const convex_poly_segment = function (poly, segmentA, segmentB, epsilon = EPSILON) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
    .map(el => intersect_seg_seg_exclude(segmentA, segmentB, el[0], el[1]))
    .filter(el => el != null);
  const aInsideExclusive = point_in_convex_poly_exclusive(segmentA, poly, epsilon);
  const bInsideExclusive = point_in_convex_poly_exclusive(segmentB, poly, epsilon);
  const aInsideInclusive = point_in_convex_poly(segmentA, poly, epsilon);
  const bInsideInclusive = point_in_convex_poly(segmentB, poly, epsilon);
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

var IntersectionPolygon = /*#__PURE__*/Object.freeze({
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
  svgPath: function () {
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
      this.points = semi_flatten_arrays(arguments);
      this.sides = this.points
        .map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
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
      },
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
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0].forEach(m => this.push(m));
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
        const transform = make_matrix3_reflectionZ(vector, origin);
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
      transformLine: function (origin, vector) {
        return Constructors.line(multiply_matrix3_line3(this, origin, vector));
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
  Definitions[primitiveName].proto = Proto.prototype;
});
Constructors.__prototypes__ = {};
Object.keys(Definitions).forEach(primitiveName => {
  Constructors.__prototypes__[primitiveName] = Definitions[primitiveName].proto;
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

export default math;
