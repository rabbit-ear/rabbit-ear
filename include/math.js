/* Math (c) Robby Kraft, MIT License */
const magnitude = function (v) {
  const sum = v
    .map(component => component * component)
    .reduce((prev, curr) => prev + curr, 0);
  return Math.sqrt(sum);
};
const normalize = function (v) {
  const m = magnitude(v);
  return m === 0 ? v : v.map(c => c / m);
};
const dot = function (a, b) {
  return a
    .map((_, i) => a[i] * b[i])
    .reduce((prev, curr) => prev + curr, 0);
};
const average = function (...args) {
  const dimension = (args.length > 0) ? args[0].length : 0;
  const sum = Array(dimension).fill(0);
  args.forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
  return sum.map(n => n / args.length);
};
const cross2 = (a, b) => [a[0] * b[1], a[1] * b[0]];
const cross3 = function (a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[0] * b[2] - a[2] * b[0],
    a[0] * b[1] - a[1] * b[0],
  ];
};
const distance2 = function (a, b) {
  const p = a[0] - b[0];
  const q = a[1] - b[1];
  return Math.sqrt((p * p) + (q * q));
};
const distance3 = function (a, b) {
  const c = a[0] - b[0];
  const d = a[1] - b[1];
  const e = a[2] - b[2];
  return Math.sqrt((c * c) + (d * d) + (e * e));
};
const distance = function (a, b) {
  const dimension = a.length;
  let sum = 0;
  for (let i = 0; i < dimension; i += 1) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
};
const midpoint2 = (a, b) => a.map((_, i) => (a[i] + b[i]) / 2);

var algebra = /*#__PURE__*/Object.freeze({
  magnitude: magnitude,
  normalize: normalize,
  dot: dot,
  average: average,
  cross2: cross2,
  cross3: cross3,
  distance2: distance2,
  distance3: distance3,
  distance: distance,
  midpoint2: midpoint2
});

const multiply_vector2_matrix2 = function (vector, matrix) {
  return [
    vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4],
    vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5]
  ];
};
const multiply_line_matrix2 = function (point, vector, matrix) {
  const new_point = multiply_vector2_matrix2(point, matrix);
  const vec_point = vector.map((_, i) => vector[i] + point[i]);
  const new_vector = multiply_vector2_matrix2(vec_point, matrix)
    .map((vec, i) => vec - new_point[i]);
  return [new_point, new_vector];
};
const multiply_matrices2 = function (m1, m2) {
  const a = m1[0] * m2[0] + m1[2] * m2[1];
  const c = m1[0] * m2[2] + m1[2] * m2[3];
  const tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
  const b = m1[1] * m2[0] + m1[3] * m2[1];
  const d = m1[1] * m2[2] + m1[3] * m2[3];
  const ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
  return [a, b, c, d, tx, ty];
};
const make_matrix2_translation = function (x, y) {
  return [1, 0, 0, 1, x, y];
};
const make_matrix2_scale = function (ratio, origin = [0, 0]) {
  const tx = ratio * -origin[0] + origin[0];
  const ty = ratio * -origin[1] + origin[1];
  return [ratio, 0, 0, ratio, tx, ty];
};
const make_matrix2_rotation = function (angle, origin = [0, 0]) {
  const a = Math.cos(angle);
  const b = Math.sin(angle);
  const c = -b;
  const d = a;
  const tx = origin[0];
  const ty = origin[1];
  return [a, b, c, d, tx, ty];
};
const make_matrix2_reflection = function (vector, origin) {
  const origin_x = origin && origin[0] ? origin[0] : 0;
  const origin_y = origin && origin[1] ? origin[1] : 0;
  const angle = Math.atan2(vector[1], vector[0]);
  const cosAngle = Math.cos(angle);
  const sinAngle = Math.sin(angle);
  const cos_Angle = Math.cos(-angle);
  const sin_Angle = Math.sin(-angle);
  const a = cosAngle * cos_Angle + sinAngle * sin_Angle;
  const b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
  const c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
  const d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
  const tx = origin_x + a * -origin_x + -origin_y * c;
  const ty = origin_y + b * -origin_x + -origin_y * d;
  return [a, b, c, d, tx, ty];
};
const make_matrix2_inverse = function (m) {
  const det = m[0] * m[3] - m[1] * m[2];
  if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
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
const multiply_vector4_matrix4 = function (v, m) {
  const result = [];
  result[0] = m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3];
  result[1] = m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3];
  result[2] = m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3];
  result[3] = m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3];
  return result;
};
const make_matrix4_scale = function (ratio, origin = [0, 0, 0]) {
  const tx = ratio * -origin[0] + origin[0];
  const ty = ratio * -origin[1] + origin[1];
  const tz = ratio * -origin[2] + origin[2];
  return [ratio, 0, 0, 0, 0, ratio, 0, 0, 0, 0, ratio, 0, tx, ty, tz, 1];
};
const make_matrix4_inverse = function (m) {
  const inv = [];
  inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15]
    + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
  inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15]
    - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
  inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15]
    + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
  inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14]
    - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
  inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15]
    - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
  inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15]
    + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
  inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15]
    - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
  inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14]
    + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
  inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15]
    + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
  inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15]
    - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
  inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15]
    + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
  inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14]
    - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
  inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11]
    - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
  inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11]
    + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
  inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11]
    - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
  inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10]
    + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
  const det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
  if (det < 1e-6 && det > -1e-6) {
    return undefined;
  }
  const inverseDeterminant = 1.0 / det;
  return inv.map(n => n * inverseDeterminant);
};
const transpose_matrix4 = function (m) {
  return [
    m[0], m[4], m[8], m[12],
    m[1], m[5], m[9], m[13],
    m[2], m[6], m[10], m[14],
    m[3], m[7], m[11], m[15]
  ];
};
const multiply_matrices4 = function (a, b) {
  return [
    a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
    a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
    a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
    a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
    a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
    a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
    a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
    a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
    a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
    a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
    a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
    a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
    a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
    a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
    a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
    a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
  ];
};

var matrixCore = /*#__PURE__*/Object.freeze({
  multiply_vector2_matrix2: multiply_vector2_matrix2,
  multiply_line_matrix2: multiply_line_matrix2,
  multiply_matrices2: multiply_matrices2,
  make_matrix2_translation: make_matrix2_translation,
  make_matrix2_scale: make_matrix2_scale,
  make_matrix2_rotation: make_matrix2_rotation,
  make_matrix2_reflection: make_matrix2_reflection,
  make_matrix2_inverse: make_matrix2_inverse,
  multiply_vector4_matrix4: multiply_vector4_matrix4,
  make_matrix4_scale: make_matrix4_scale,
  make_matrix4_inverse: make_matrix4_inverse,
  transpose_matrix4: transpose_matrix4,
  multiply_matrices4: multiply_matrices4
});

const clean_number = function (num, places = 15) {
  return parseFloat(num.toFixed(places));
};
const is_number = (n => n != null && !isNaN(n));
const is_vector = (a => a != null && a[0] != null && !isNaN(a[0]));
const is_iterable = obj => obj != null
  && typeof obj[Symbol.iterator] === "function";
const flatten_input = function (...args) {
  switch (args.length) {
    case undefined:
    case 0: return args;
    case 1: return is_iterable(args[0]) && typeof args[0] !== "string"
      ? flatten_input(...args[0])
      : [args[0]];
    default:
      return Array.from(args)
        .map(a => (is_iterable(a)
          ? [...flatten_input(a)]
          : a))
        .reduce((a, b) => a.concat(b), []);
  }
};
const semi_flatten_input = function (...args) {
  let list = args;
  while (list.length === 1 && list[0].length) { [list] = list; }
  return list;
};
const get_vector = function (...args) {
  let list = flatten_input(args).filter(a => a !== undefined);
  if (list === undefined) { return undefined; }
  if (list.length === 0) { return undefined; }
  if (!isNaN(list[0].x)) {
    list = ["x", "y", "z"].map(c => list[0][c]).filter(a => a !== undefined);
  }
  return list.filter(n => typeof n === "number");
};
const get_vector_of_vectors = function (...args) {
  return semi_flatten_input(args)
    .map(el => get_vector(el));
};
const identity2 = [1, 0, 0, 1, 0, 0];
const identity4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const get_matrix2 = function (...args) {
  const m = get_vector(args);
  if (m === undefined) { return undefined; }
  if (m.length === 6) { return m; }
  if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
  if (m.length < 6) {
    return identity2.map((n, i) => m[i] || n);
  }
  return undefined;
};
const get_matrix4 = function (...args) {
  const m = get_vector(args);
  if (m === undefined) { return undefined; }
  if (m.length === 16) { return m; }
  if (m.length === 9) {
    return [
      m[0], m[1], m[2], 0,
      m[3], m[4], m[5], 0,
      m[6], m[7], m[8], 0,
      0, 0, 0, 1
    ];
  }
  if (m.length === 6) {
    return [
      m[0], m[1], 0, 0,
      m[2], m[3], 0, 0,
      0, 0, 1, 0,
      m[4], m[5], 0, 1
    ];
  }
  if (m.length === 4) {
    return [
      m[0], m[1], 0, 0,
      m[2], m[3], 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }
  if (m.length > 16) {
    return [
      m[0], m[1], m[2], m[3],
      m[4], m[5], m[6], m[7],
      m[8], m[9], m[10], m[11],
      m[12], m[13], m[14], m[15]
    ];
  }
  if (m.length < 16) {
    return identity4.map((n, i) => m[i] || n);
  }
  return undefined;
};
function get_segment(...args) {
  return get_vector_of_vectors(args);
}
function get_line() {
  let params = Array.from(arguments);
  let numbers = params.filter((param) => !isNaN(param));
  let arrays = params.filter((param) => param.constructor === Array);
  if (params.length === 0) { return { vector: [], point: [] }; }
  if (!isNaN(params[0]) && numbers.length >= 4) {
    return {
      point: [params[0], params[1]],
      vector: [params[2], params[3]]
    };
  }
  if (arrays.length > 0) {
    if (arrays.length === 1) {
      return get_line(...arrays[0]);
    }
    if (arrays.length === 2) {
      return {
        point: [arrays[0][0], arrays[0][1]],
        vector: [arrays[1][0], arrays[1][1]]
      };
    }
    if (arrays.length === 4) {
      return {
        point: [arrays[0], arrays[1]],
        vector: [arrays[2], arrays[3]]
      };
    }
  }
  if (params[0].constructor === Object) {
    let vector = [], point = [];
    if (params[0].vector != null)         { vector = get_vector(params[0].vector); }
    else if (params[0].direction != null) { vector = get_vector(params[0].direction); }
    if (params[0].point != null)       { point = get_vector(params[0].point); }
    else if (params[0].origin != null) { point = get_vector(params[0].origin); }
    return {point, vector};
  }
  return {point: [], vector: []};
}
function get_ray() {
  return get_line(...arguments);
}
function get_two_vec2(...args) {
  if (args.length === 0) { return undefined; }
  if (args.length === 1 && args[0] !== undefined) {
    return get_two_vec2(...args[0]);
  }
  const params = Array.from(args);
  const numbers = params.filter(param => !isNaN(param));
  const arrays = params.filter(o => typeof o === "object")
    .filter(param => param.constructor === Array);
  if (numbers.length >= 4) {
    return [
      [numbers[0], numbers[1]],
      [numbers[2], numbers[3]],
    ];
  }
  if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
    return arrays;
  }
  if (arrays.length === 1 && !isNaN(arrays[0][0][0])) {
    return arrays[0];
  }
  return undefined;
}
function get_array_of_vec(...args) {
  if (args.length === 0) { return undefined; }
  if (args.length === 1 && args[0] !== undefined) {
    return get_array_of_vec(...args[0]);
  }
  return Array.from(args);
}
function get_array_of_vec2() {
  let params = Array.from(arguments);
  let arrays = params.filter((param) => param.constructor === Array);
  if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
    return arrays;
  }
  if (arrays.length === 1 && arrays[0].length >= 1) {
    return arrays[0];
  }
  return params;
}

const EPSILON = 1e-6;
const array_similarity_test = function (list, compFunc) {
  return Array
    .from(Array(list.length - 1))
    .map((_, i) => compFunc(list[0], list[i + 1]))
    .reduce((a, b) => a && b, true);
};
const equivalent_numbers = function (...args) {
  if (args.length === 0) { return false; }
  if (args.length === 1 && args[0] !== undefined) {
    return equivalent_numbers(...args[0]);
  }
  return array_similarity_test(args, (a, b) => Math.abs(a - b) < EPSILON);
};
const equivalent_vectors = function (...args) {
  const list = get_vector_of_vectors(args);
  if (list.length === 0) { return false; }
  if (list.length === 1 && list[0] !== undefined) {
    return equivalent_vectors(...list[0]);
  }
  const dimension = list[0].length;
  const dim_array = Array.from(Array(dimension));
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
const equivalent = function (...args) {
  let list = semi_flatten_input(args);
  if (list.length < 1) { return false; }
  const typeofList = typeof list[0];
  if (typeofList === "undefined") { return false; }
  if (list[0].constructor === Array) {
    list = list.map(el => semi_flatten_input(el));
  }
  switch (typeofList) {
    case "number":
      return array_similarity_test(list, (a, b) => Math.abs(a - b) < EPSILON);
    case "boolean":
      return array_similarity_test(list, (a, b) => a === b);
    case "object":
      if (list[0].constructor === Array) { return equivalent_vectors(list); }
      console.warn("comparing array of objects for equivalency by slow stringify and no-epsilon");
      return array_similarity_test(list, (a, b) => JSON.stringify(a) === JSON.stringify(b));
    default:
      console.warn("incapable of determining comparison method");
      break;
  }
  return false;
};

var equal = /*#__PURE__*/Object.freeze({
  EPSILON: EPSILON,
  equivalent_numbers: equivalent_numbers,
  equivalent_vectors: equivalent_vectors,
  equivalent: equivalent
});

const overlap_function = function (aPt, aVec, bPt, bVec, compFunc) {
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
const segment_segment_overlap = function (a0, a1, b0, b1) {
  const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return overlap_function(a0, aVec, b0, bVec, segment_segment_comp);
};
const degenerate = function (v) {
  return Math.abs(v.reduce((a, b) => a + b, 0)) < EPSILON;
};
const parallel = function (a, b) {
  return 1 - Math.abs(dot(normalize(a), normalize(b))) < EPSILON;
};
const point_on_line = function (linePoint, lineVector, point, epsilon = EPSILON) {
  const pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
  const cross = pointPoint[0] * lineVector[1] - pointPoint[1] * lineVector[0];
  return Math.abs(cross) < epsilon;
};
const point_on_segment = function (seg0, seg1, point, epsilon = EPSILON) {
  const seg0_1 = [seg0[0] - seg1[0], seg0[1] - seg1[1]];
  const seg0_p = [seg0[0] - point[0], seg0[1] - point[1]];
  const seg1_p = [seg1[0] - point[0], seg1[1] - point[1]];
  const dEdge = Math.sqrt(seg0_1[0] * seg0_1[0] + seg0_1[1] * seg0_1[1]);
  const dP0 = Math.sqrt(seg0_p[0] * seg0_p[0] + seg0_p[1] * seg0_p[1]);
  const dP1 = Math.sqrt(seg1_p[0] * seg1_p[0] + seg1_p[1] * seg1_p[1]);
  return Math.abs(dEdge - dP0 - dP1) < epsilon;
};
const point_in_poly = function (point, poly) {
  let isInside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if ((poly[i][1] > point[1]) != (poly[j][1] > point[1])
      && point[0] < (poly[j][0] - poly[i][0]) * (point[1] - poly[i][1])
      / (poly[j][1] - poly[i][1]) + poly[i][0]) {
      isInside = !isInside;
    }
  }
  return isInside;
};
const point_in_convex_poly = function (point, poly, epsilon = EPSILON) {
  if (poly == null || !(poly.length > 0)) { return false; }
  return poly.map((p, i, arr) => {
    const nextP = arr[(i + 1) % arr.length];
    const a = [nextP[0] - p[0], nextP[1] - p[1]];
    const b = [point[0] - p[0], point[1] - p[1]];
    return a[0] * b[1] - a[1] * b[0] > -epsilon;
  }).map((s, i, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);
};
const point_in_convex_poly_exclusive = function (point, poly, epsilon = EPSILON) {
  if (poly == null || !(poly.length > 0)) { return false; }
  return poly.map((p, i, arr) => {
    const nextP = arr[(i + 1) % arr.length];
    const a = [nextP[0] - p[0], nextP[1] - p[1]];
    const b = [point[0] - p[0], point[1] - p[1]];
    return a[0] * b[1] - a[1] * b[0] > epsilon;
  }).map((s, i, arr) => s === arr[0])
    .reduce((prev, curr) => prev && curr, true);
};
const convex_polygons_overlap = function (ps1, ps2) {
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
const convex_polygon_is_enclosed = function (inner, outer) {
  const goesInside = outer
    .map(p => point_in_convex_poly(p, inner))
    .reduce((a, b) => a || b, false);
  if (goesInside) { return false; }
  return undefined;
};
const convex_polygons_enclose = function (inner, outer) {
  const outerGoesInside = outer
    .map(p => point_in_convex_poly(p, inner))
    .reduce((a, b) => a || b, false);
  const innerGoesOutside = inner
    .map(p => point_in_convex_poly(p, inner))
    .reduce((a, b) => a && b, true);
  return (!outerGoesInside && innerGoesOutside);
};
const is_counter_clockwise_between = function (angle, angleA, angleB) {
  while (angleB < angleA) { angleB += Math.PI * 2; }
  while (angle < angleA) { angle += Math.PI * 2; }
  return angle < angleB;
};

var query = /*#__PURE__*/Object.freeze({
  overlap_function: overlap_function,
  segment_segment_overlap: segment_segment_overlap,
  degenerate: degenerate,
  parallel: parallel,
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

const line_line_comp = () => true;
const line_ray_comp = (t0, t1) => t1 >= -EPSILON;
const line_segment_comp = (t0, t1) => t1 >= -EPSILON && t1 <= 1 + EPSILON;
const ray_ray_comp = (t0, t1) => t0 >= -EPSILON && t1 >= -EPSILON;
const ray_segment_comp = (t0, t1) => t0 >= -EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
const segment_segment_comp$1 = (t0, t1) => t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON
  && t1 <= 1 + EPSILON;
const line_ray_comp_exclusive = (t0, t1) => t1 > EPSILON;
const line_segment_comp_exclusive = (t0, t1) => t1 > EPSILON && t1 < 1 - EPSILON;
const ray_ray_comp_exclusive = (t0, t1) => t0 > EPSILON && t1 > EPSILON;
const ray_segment_comp_exclusive = (t0, t1) => t0 > EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
const segment_segment_comp_exclusive = (t0, t1) => t0 > EPSILON && t0 < 1 - EPSILON && t1 > EPSILON
  && t1 < 1 - EPSILON;
const limit_line = dist => dist;
const limit_ray = dist => (dist < -EPSILON ? 0 : dist);
const limit_segment = (dist) => {
  if (dist < -EPSILON) { return 0; }
  if (dist > 1 + EPSILON) { return 1; }
  return dist;
};
const intersection_function = function (aPt, aVec, bPt, bVec, compFunc, epsilon = EPSILON) {
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
const line_line = function (aPt, aVec, bPt, bVec, epsilon) {
  return intersection_function(aPt, aVec, bPt, bVec, line_line_comp, epsilon);
};
const line_ray = function (linePt, lineVec, rayPt, rayVec, epsilon) {
  return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp, epsilon);
};
const line_segment = function (point, vec, segment0, segment1, epsilon) {
  const segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
  return intersection_function(
    point, vec,
    segment0, segmentVec,
    line_segment_comp, epsilon
  );
};
const ray_ray = function (aPt, aVec, bPt, bVec, epsilon) {
  return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp, epsilon);
};
const ray_segment = function (rayPt, rayVec, segment0, segment1, epsilon) {
  const segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
  return intersection_function(
    rayPt, rayVec,
    segment0, segmentVec,
    ray_segment_comp, epsilon
  );
};
const segment_segment = function (a0, a1, b0, b1, epsilon) {
  const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return intersection_function(
    a0, aVec,
    b0, bVec,
    segment_segment_comp$1, epsilon
  );
};
const line_ray_exclusive = function (linePt, lineVec, rayPt, rayVec, epsilon) {
  return intersection_function(
    linePt, lineVec,
    rayPt, rayVec,
    line_ray_comp_exclusive, epsilon
  );
};
const line_segment_exclusive = function (point, vec, segment0, segment1, epsilon) {
  const segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
  return intersection_function(
    point, vec,
    segment0, segmentVec,
    line_segment_comp_exclusive, epsilon
  );
};
const ray_ray_exclusive = function (aPt, aVec, bPt, bVec, epsilon) {
  return intersection_function(
    aPt, aVec, bPt, bVec, ray_ray_comp_exclusive, epsilon
  );
};
const ray_segment_exclusive = function (rayPt, rayVec, segment0, segment1, epsilon) {
  const segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
  return intersection_function(
    rayPt, rayVec,
    segment0, segmentVec,
    ray_segment_comp_exclusive, epsilon
  );
};
const segment_segment_exclusive = function (a0, a1, b0, b1, epsilon) {
  const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return intersection_function(
    a0, aVec,
    b0, bVec,
    segment_segment_comp_exclusive, epsilon
  );
};
const circle_line = function (center, radius, p0, p1, epsilon = EPSILON) {
  const x1 = p0[0] - center[0];
  const y1 = p0[1] - center[1];
  const x2 = p1[0] - center[0];
  const y2 = p1[1] - center[1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const det = x1 * y2 - x2 * y1;
  const det_sq = det * det;
  const r_sq = radius * radius;
  const dr_sq = Math.abs(dx * dx + dy * dy);
  const delta = r_sq * dr_sq - det_sq;
  if (delta < -epsilon) { return undefined; }
  const suffix = Math.sqrt(r_sq * dr_sq - det_sq);
  function sgn(x) { return (x < -epsilon) ? -1 : 1; }
  const solutionA = [
    center[0] + (det * dy + sgn(dy) * dx * suffix) / dr_sq,
    center[1] + (-det * dx + Math.abs(dy) * suffix) / dr_sq,
  ];
  if (delta > epsilon) {
    const solutionB = [
      center[0] + (det * dy - sgn(dy) * dx * suffix) / dr_sq,
      center[1] + (-det * dx - Math.abs(dy) * suffix) / dr_sq,
    ];
    return [solutionA, solutionB];
  }
  return [solutionA];
};
const circle_ray = function (center, radius, p0, p1) {
  throw "circle_ray has not been written yet";
};
const circle_segment = function (center, radius, p0, p1) {
  const r_squared = radius ** 2;
  const x1 = p0[0] - center[0];
  const y1 = p0[1] - center[1];
  const x2 = p1[0] - center[0];
  const y2 = p1[1] - center[1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dr_squared = dx * dx + dy * dy;
  const D = x1 * y2 - x2 * y1;
  function sgn(x) { if (x < 0) { return -1; } return 1; }
  const x_1 = (D * dy + sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
  const x_2 = (D * dy - sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
  const y_1 = (-D * dx + Math.abs(dy) * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
  const y_2 = (-D * dx - Math.abs(dy) * Math.sqrt(r_squared * dr_squared - D * D)) / (dr_squared);
  const x1_NaN = isNaN(x_1);
  const x2_NaN = isNaN(x_2);
  if (!x1_NaN && !x2_NaN) {
    return [
      [x_1 + center[0], y_1 + center[1]],
      [x_2 + center[0], y_2 + center[1]],
    ];
  }
  if (x1_NaN && x2_NaN) { return undefined; }
  if (!x1_NaN) {
    return [[x_1 + center[0], y_1 + center[1]]];
  }
  if (!x2_NaN) {
    return [[x_2 + center[0], y_2 + center[1]]];
  }
  return undefined;
};
const quick_equivalent_2 = function (a, b) {
  return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
};
const convex_poly_line = function (poly, linePoint, lineVector) {
  const intersections = poly
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
    .map(el => line_segment(linePoint, lineVector, el[0], el[1]))
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
const convex_poly_ray = function (poly, linePoint, lineVector) {
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
const convex_poly_ray_exclusive = function (poly, linePoint, lineVector) {
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

var intersection = /*#__PURE__*/Object.freeze({
  limit_line: limit_line,
  limit_ray: limit_ray,
  limit_segment: limit_segment,
  intersection_function: intersection_function,
  line_line: line_line,
  line_ray: line_ray,
  line_segment: line_segment,
  ray_ray: ray_ray,
  ray_segment: ray_segment,
  segment_segment: segment_segment,
  line_ray_exclusive: line_ray_exclusive,
  line_segment_exclusive: line_segment_exclusive,
  ray_ray_exclusive: ray_ray_exclusive,
  ray_segment_exclusive: ray_segment_exclusive,
  segment_segment_exclusive: segment_segment_exclusive,
  circle_line: circle_line,
  circle_ray: circle_ray,
  circle_segment: circle_segment,
  convex_poly_line: convex_poly_line,
  convex_poly_ray: convex_poly_ray,
  convex_poly_segment: convex_poly_segment,
  convex_poly_ray_exclusive: convex_poly_ray_exclusive
});

const clockwise_angle2_radians = function (a, b) {
  while (a < 0) { a += Math.PI * 2; }
  while (b < 0) { b += Math.PI * 2; }
  const a_b = a - b;
  return (a_b >= 0)
    ? a_b
    : Math.PI * 2 - (b - a);
};
const counter_clockwise_angle2_radians = function (a, b) {
  while (a < 0) { a += Math.PI * 2; }
  while (b < 0) { b += Math.PI * 2; }
  const b_a = b - a;
  return (b_a >= 0)
    ? b_a
    : Math.PI * 2 - (a - b);
};
const clockwise_angle2 = function (a, b) {
  const dotProduct = b[0] * a[0] + b[1] * a[1];
  const determinant = b[0] * a[1] - b[1] * a[0];
  let angle = Math.atan2(determinant, dotProduct);
  if (angle < 0) { angle += Math.PI * 2; }
  return angle;
};
const counter_clockwise_angle2 = function (a, b) {
  const dotProduct = a[0] * b[0] + a[1] * b[1];
  const determinant = a[0] * b[1] - a[1] * b[0];
  let angle = Math.atan2(determinant, dotProduct);
  if (angle < 0) { angle += Math.PI * 2; }
  return angle;
};
const counter_clockwise_vector_order = function (...vectors) {
  const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
  const counter_clockwise = Array.from(Array(vectors_radians.length))
    .map((_, i) => i)
    .sort((a, b) => vectors_radians[a] - vectors_radians[b]);
  return counter_clockwise
    .slice(counter_clockwise.indexOf(0), counter_clockwise.length)
    .concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
const interior_angles2 = function (a, b) {
  const interior1 = counter_clockwise_angle2(a, b);
  const interior2 = Math.PI * 2 - interior1;
  return [interior1, interior2];
};
const interior_angles = function (...vectors) {
  return vectors
    .map((v, i, ar) => counter_clockwise_angle2(v, ar[(i + 1) % ar.length]));
};
const bisect_vectors = function (a, b) {
  const aV = normalize(a);
  const bV = normalize(b);
  const sum = aV.map((_, i) => aV[i] + bV[i]);
  const vecA = normalize(sum);
  const vecB = aV.map((_, i) => -aV[i] + -bV[i]);
  return [vecA, normalize(vecB)];
};
const bisect_lines2 = function (pointA, vectorA, pointB, vectorB) {
  const denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];
  if (Math.abs(denominator) < EPSILON) {
    const solution = [midpoint2(pointA, pointB), [vectorA[0], vectorA[1]]];
    const array = [solution, solution];
    const dot$$1 = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
    delete (dot$$1 > 0 ? array[1] : array[0]);
    return array;
  }
  const numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
  const t = numerator / denominator;
  const x = pointA[0] + vectorA[0] * t;
  const y = pointA[1] + vectorA[1] * t;
  const bisects = bisect_vectors(vectorA, vectorB);
  bisects[1] = [bisects[1][1], -bisects[1][0]];
  return bisects.map(el => [[x, y], el]);
};
const subsect_radians = function (divisions, angleA, angleB) {
  const angle = counter_clockwise_angle2(angleA, angleB) / divisions;
  return Array.from(Array(divisions - 1))
    .map((_, i) => angleA + angle * i);
};
const subsect = function (divisions, vectorA, vectorB) {
  const angleA = Math.atan2(vectorA[1], vectorA[0]);
  const angleB = Math.atan2(vectorB[1], vectorB[0]);
  return subsect_radians(divisions, angleA, angleB)
    .map(rad => [Math.cos(rad), Math.sin(rad)]);
};
const signed_area = function (points) {
  return 0.5 * points.map((el, i, arr) => {
    const next = arr[(i + 1) % arr.length];
    return el[0] * next[1] - next[0] * el[1];
  }).reduce((a, b) => a + b, 0);
};
const centroid = function (points) {
  const sixthArea = 1 / (6 * signed_area(points));
  return points.map((el, i, arr) => {
    const next = arr[(i + 1) % arr.length];
    const mag = el[0] * next[1] - next[0] * el[1];
    return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
  }).reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
    .map(c => c * sixthArea);
};
const enclosing_rectangle = function (points) {
  const l = points[0].length;
  const mins = Array.from(Array(l)).map(() => Infinity);
  const maxs = Array.from(Array(l)).map(() => -Infinity);
  points.forEach(point => point
    .forEach((c, i) => {
      if (c < mins[i]) { mins[i] = c; }
      if (c > maxs[i]) { maxs[i] = c; }
    }));
  const lengths = maxs.map((max, i) => max - mins[i]);
  return [mins, lengths];
};
const make_regular_polygon = function (sides, x = 0, y = 0, radius = 1) {
  const halfwedge = 2 * Math.PI / sides * 0.5;
  const r = radius / Math.cos(halfwedge);
  return Array.from(Array(Math.floor(sides))).map((_, i) => {
    const a = -2 * Math.PI * i / sides + halfwedge;
    const px = clean_number(x + r * Math.sin(a), 14);
    const py = clean_number(y + r * Math.cos(a), 14);
    return [px, py];
  });
};
const smallest_comparison_search = function (obj, array, compare_func) {
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
const nearest_point2 = function (point, array_of_points) {
  const index = smallest_comparison_search(point, array_of_points, distance2);
  return index === undefined ? undefined : array_of_points[index];
};
const nearest_point = function (point, array_of_points) {
  const index = smallest_comparison_search(point, array_of_points, distance);
  return index === undefined ? undefined : array_of_points[index];
};
const nearest_point_on_line = function (
  linePoint, lineVec, point, limiterFunc, epsilon = EPSILON
) {
  const magSquared = (lineVec[0] ** 2) + (lineVec[1] ** 2);
  const vectorToPoint = [0, 1].map((_, i) => point[i] - linePoint[i]);
  const dot$$1 = [0, 1].map((_, i) => lineVec[i] * vectorToPoint[i])
    .reduce((a, b) => a + b, 0);
  const dist = dot$$1 / magSquared;
  const d = limiterFunc(dist, epsilon);
  return [0, 1].map((_, i) => linePoint[i] + lineVec[i] * d);
};
const split_polygon = function (poly, linePoint, lineVector) {
  const vertices_intersections = poly.map((v, i) => {
    const intersection = point_on_line(linePoint, lineVector, v);
    return { type: "v", point: intersection ? v : null, at_index: i };
  }).filter(el => el.point != null);
  const edges_intersections = poly.map((v, i, arr) => {
    const intersection = line_segment_exclusive(
      linePoint,
      lineVector,
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
const split_convex_polygon = function (poly, linePoint, lineVector) {
  let vertices_intersections = poly.map((v,i) => {
    let intersection = point_on_line(linePoint, lineVector, v);
    return { point: intersection ? v : null, at_index: i };
  }).filter(el => el.point != null);
  let edges_intersections = poly.map((v,i,arr) => {
    let intersection = line_segment_exclusive(linePoint, lineVector, v, arr[(i+1)%arr.length]);
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
const convex_hull = function (points, include_collinear = false, epsilon = EPSILON) {
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
        let distance$$1 = Math.sqrt(((hull[h][0] - el.node[0]) ** 2) + ((hull[h][1] - el.node[1]) ** 2));
        el.distance = distance$$1;
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
  signed_area: signed_area,
  centroid: centroid,
  enclosing_rectangle: enclosing_rectangle,
  make_regular_polygon: make_regular_polygon,
  nearest_point2: nearest_point2,
  nearest_point: nearest_point,
  nearest_point_on_line: nearest_point_on_line,
  split_polygon: split_polygon,
  split_convex_polygon: split_convex_polygon,
  convex_hull: convex_hull
});

const VectorPrototype = function (subtype) {
  const proto = [];
  const Type = subtype;
  let that;
  const bind = function (theother) {
    that = theother;
  };
  const vecNormalize = function () {
    return Type(normalize(that));
  };
  const vecDot = function (...args) {
    const vec = get_vector(args);
    return this.length > vec.length
      ? dot(vec, that)
      : dot(that, vec);
  };
  const cross = function (...args) {
    const b = get_vector(args);
    const a = that.slice();
    if (a[2] == null) { a[2] = 0; }
    if (b[2] == null) { b[2] = 0; }
    return Type(cross3(a, b));
  };
  const distanceTo = function (...args) {
    const vec = get_vector(args);
    const length = (that.length < vec.length) ? that.length : vec.length;
    const sum = Array.from(Array(length))
      .map((_, i) => (that[i] - vec[i]) ** 2)
      .reduce((prev, curr) => prev + curr, 0);
    return Math.sqrt(sum);
  };
  const transform = function (...args) {
    const m = get_matrix2(args);
    return Type(multiply_vector2_matrix2(that, m));
  };
  const add = function (...args) {
    const vec = get_vector(args);
    return Type(that.map((v, i) => v + vec[i]));
  };
  const subtract = function (...args) {
    const vec = get_vector(args);
    return Type(that.map((v, i) => v - vec[i]));
  };
  const rotateZ = function (angle, origin) {
    const m = make_matrix2_rotation(angle, origin);
    return Type(multiply_vector2_matrix2(that, m));
  };
  const rotateZ90 = function () {
    return Type(-that[1], that[0]);
  };
  const rotateZ180 = function () {
    return Type(-that[0], -that[1]);
  };
  const rotateZ270 = function () {
    return Type(that[1], -that[0]);
  };
  const reflect = function (...args) {
    const ref = get_line(args);
    const m = make_matrix2_reflection(ref.vector, ref.point);
    return Type(multiply_vector2_matrix2(that, m));
  };
  const lerp = function (vector, pct) {
    const vec = get_vector(vector);
    const inv = 1.0 - pct;
    const length = (that.length < vec.length) ? that.length : vec.length;
    const components = Array.from(Array(length))
      .map((_, i) => that[i] * pct + vec[i] * inv);
    return Type(components);
  };
  const isEquivalent = function (...args) {
    const vec = get_vector(args);
    const sm = (that.length < vec.length) ? that : vec;
    const lg = (that.length < vec.length) ? vec : that;
    return equivalent(sm, lg);
  };
  const isParallel = function (...args) {
    const vec = get_vector(args);
    const sm = (that.length < vec.length) ? that : vec;
    const lg = (that.length < vec.length) ? vec : that;
    return parallel(sm, lg);
  };
  const scale = function (mag) {
    return Type(that.map(v => v * mag));
  };
  const midpoint = function (...args) {
    const vec = get_vector(args);
    const sm = (that.length < vec.length) ? that.slice() : vec;
    const lg = (that.length < vec.length) ? vec : that.slice();
    for (let i = sm.length; i < lg.length; i += 1) { sm[i] = 0; }
    return Type(lg.map((_, i) => (sm[i] + lg[i]) * 0.5));
  };
  const bisect = function (...args) {
    const vec = get_vector(args);
    return bisect_vectors(that, vec).map(b => Type(b));
  };
  Object.defineProperty(proto, "normalize", { value: vecNormalize });
  Object.defineProperty(proto, "dot", { value: vecDot });
  Object.defineProperty(proto, "cross", { value: cross });
  Object.defineProperty(proto, "distanceTo", { value: distanceTo });
  Object.defineProperty(proto, "transform", { value: transform });
  Object.defineProperty(proto, "add", { value: add });
  Object.defineProperty(proto, "subtract", { value: subtract });
  Object.defineProperty(proto, "rotateZ", { value: rotateZ });
  Object.defineProperty(proto, "rotateZ90", { value: rotateZ90 });
  Object.defineProperty(proto, "rotateZ180", { value: rotateZ180 });
  Object.defineProperty(proto, "rotateZ270", { value: rotateZ270 });
  Object.defineProperty(proto, "reflect", { value: reflect });
  Object.defineProperty(proto, "lerp", { value: lerp });
  Object.defineProperty(proto, "isEquivalent", { value: isEquivalent });
  Object.defineProperty(proto, "isParallel", { value: isParallel });
  Object.defineProperty(proto, "scale", { value: scale });
  Object.defineProperty(proto, "midpoint", { value: midpoint });
  Object.defineProperty(proto, "bisect", { value: bisect });
  Object.defineProperty(proto, "copy", { value: () => Type(...that) });
  Object.defineProperty(proto, "magnitude", { get: () => magnitude(that) });
  Object.defineProperty(proto, "bind", { value: bind });
  return proto;
};

const Vector = function (...args) {
  const proto = VectorPrototype(Vector);
  const vector = Object.create(proto);
  proto.bind(vector);
  get_vector(args).forEach(v => vector.push(v));
  Object.defineProperty(vector, "x", { get: () => vector[0] });
  Object.defineProperty(vector, "y", { get: () => vector[1] });
  Object.defineProperty(vector, "z", { get: () => vector[2] });
  return vector;
};

const Matrix2 = function (...args) {
  const matrix = [1, 0, 0, 1, 0, 0];
  const argsMatrix = get_matrix2(args);
  if (argsMatrix !== undefined) {
    argsMatrix.forEach((n, i) => { matrix[i] = n; });
  }
  const inverse = function () {
    return Matrix2(make_matrix2_inverse(matrix)
      .map(n => clean_number(n, 13)));
  };
  const multiply = function (...innerArgs) {
    const m2 = get_matrix2(innerArgs);
    return Matrix2(multiply_matrices2(matrix, m2)
      .map(n => clean_number(n, 13)));
  };
  const transform = function (...innerArgs) {
    const v = get_vector(innerArgs);
    return Vector(multiply_vector2_matrix2(v, matrix)
      .map(n => clean_number(n, 13)));
  };
  Object.defineProperty(matrix, "inverse", { value: inverse });
  Object.defineProperty(matrix, "multiply", { value: multiply });
  Object.defineProperty(matrix, "transform", { value: transform });
  return Object.freeze(matrix);
};
Matrix2.makeIdentity = () => Matrix2(1, 0, 0, 1, 0, 0);
Matrix2.makeTranslation = (tx, ty) => Matrix2(1, 0, 0, 1, tx, ty);
Matrix2.makeScale = (...args) => Matrix2(...make_matrix2_scale(...args));
Matrix2.makeRotation = ((angle, origin) => Matrix2(
  make_matrix2_rotation(angle, origin).map(n => clean_number(n, 13))
));
Matrix2.makeReflection = ((vector, origin) => Matrix2(
  make_matrix2_reflection(vector, origin).map(n => clean_number(n, 13))
));
const Matrix = function (...args) {
  const matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  const argsMatrix = get_matrix4(args);
  if (argsMatrix !== undefined) {
    argsMatrix.forEach((n, i) => { matrix[i] = n; });
  }
  const inverse = function () {
    return Matrix(make_matrix4_inverse(matrix)
      .map(n => clean_number(n, 13)));
  };
  const multiply = function (...innerArgs) {
    const m2 = get_matrix4(innerArgs);
    return Matrix(multiply_matrices4(matrix, m2)
      .map(n => clean_number(n, 13)));
  };
  const transform = function (...innerArgs) {
    const v = get_vector(innerArgs);
    return Vector(multiply_vector4_matrix4(v, matrix)
      .map(n => clean_number(n, 13)));
  };
  Object.defineProperty(matrix, "inverse", { value: inverse });
  Object.defineProperty(matrix, "multiply", { value: multiply });
  Object.defineProperty(matrix, "transform", { value: transform });
  return Object.freeze(matrix);
};
Matrix.makeIdentity = () => Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
Matrix.makeTranslation = (tx, ty, tz) => Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
Matrix.makeScale = (...args) => Matrix(...make_matrix4_scale(...args));

function Prototype (subtype, prototype) {
  const proto = (prototype != null) ? prototype : {};
  const compare_to_line = function (t0, t1, epsilon = EPSILON) {
    return this.compare_function(t0, epsilon) && true;
  };
  const compare_to_ray = function (t0, t1, epsilon = EPSILON) {
    return this.compare_function(t0, epsilon) && t1 >= -epsilon;
  };
  const compare_to_segment = function (t0, t1, epsilon = EPSILON) {
    return this.compare_function(t0, epsilon)
      && t1 >= -epsilon && t1 <= 1 + epsilon;
  };
  const isParallel = function (line, epsilon) {
    if (line.vector == null) {
      throw new Error("isParallel() argument is missing a vector");
    }
    const this_is_smaller = (this.vector.length < line.vector.length);
    const sm = this_is_smaller ? this.vector : line.vector;
    const lg = this_is_smaller ? line.vector : this.vector;
    return parallel(sm, lg, epsilon);
  };
  const isDegenerate = function (epsilon = EPSILON) {
    return degenerate(this.vector, epsilon);
  };
  const reflection = function () {
    return Matrix2.makeReflection(this.vector, this.point);
  };
  const nearestPoint = function (...args) {
    const point = get_vector(args);
    return Vector(nearest_point_on_line(this.point, this.vector, point, this.clip_function));
  };
  const intersect = function (other) {
    return intersection_function(this.point, this.vector, other.point,
      other.vector,
      ((t0, t1, epsilon = EPSILON) => this.compare_function(t0, epsilon)
        && other.compare_function(t1, epsilon)));
  };
  const intersectLine = function (...args) {
    const line = get_line(args);
    return intersection_function(this.point, this.vector, line.point,
      line.vector, compare_to_line.bind(this));
  };
  const intersectRay = function (...args) {
    const ray = get_ray(args);
    return intersection_function(this.point, this.vector, ray.point, ray.vector,
      compare_to_ray.bind(this));
  };
  const intersectEdge = function (...args) {
    const edge = get_segment(args);
    const edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
    return intersection_function(this.point, this.vector, edge[0], edgeVec,
      compare_to_segment.bind(this));
  };
  Object.defineProperty(proto, "isParallel", { value: isParallel });
  Object.defineProperty(proto, "isDegenerate", { value: isDegenerate });
  Object.defineProperty(proto, "nearestPoint", { value: nearestPoint });
  Object.defineProperty(proto, "reflection", { value: reflection });
  Object.defineProperty(proto, "intersect", { value: intersect });
  Object.defineProperty(proto, "intersectLine", { value: intersectLine });
  Object.defineProperty(proto, "intersectRay", { value: intersectRay });
  Object.defineProperty(proto, "intersectEdge", { value: intersectEdge });
  return Object.freeze(proto);
}

const Line = function (...args) {
  const { point, vector } = get_line(args);
  const transform = function (...innerArgs) {
    const mat = get_matrix2(innerArgs);
    const line = multiply_line_matrix2(point, vector, mat);
    return Line(line[0], line[1]);
  };
  const proto = Prototype.bind(this);
  const line = Object.create(proto(Line));
  const compare_function = function () { return true; };
  Object.defineProperty(line, "compare_function", { value: compare_function });
  Object.defineProperty(line, "clip_function", { value: limit_line });
  Object.defineProperty(line, "point", { get: () => Vector(point) });
  Object.defineProperty(line, "vector", { get: () => Vector(vector) });
  Object.defineProperty(line, "length", { get: () => Infinity });
  Object.defineProperty(line, "transform", { value: transform });
  return line;
};
Line.fromPoints = function (...args) {
  const points = get_two_vec2(args);
  return Line({
    point: points[0],
    vector: normalize([
      points[1][0] - points[0][0],
      points[1][1] - points[0][1],
    ]),
  });
};
Line.perpendicularBisector = function (...args) {
  const points = get_two_vec2(args);
  const vec = normalize([
    points[1][0] - points[0][0],
    points[1][1] - points[0][1],
  ]);
  return Line({
    point: average(points[0], points[1]),
    vector: [vec[1], -vec[0]],
  });
};

const Ray = function (...args) {
  const { point, vector } = get_line(args);
  const transform = function (...innerArgs) {
    const mat = get_matrix2(innerArgs);
    const new_point = multiply_vector2_matrix2(point, mat);
    const vec_point = vector.map((vec, i) => vec + point[i]);
    const new_vector = multiply_vector2_matrix2(vec_point, mat)
      .map((vec, i) => vec - new_point[i]);
    return Ray(new_point, new_vector);
  };
  const rotate180 = function () {
    return Ray(point[0], point[1], -vector[0], -vector[1]);
  };
  const proto = Prototype.bind(this);
  const ray = Object.create(proto(Ray));
  const compare_function = function (t0, ep) { return t0 >= -ep; };
  Object.defineProperty(ray, "point", { get: () => Vector(point) });
  Object.defineProperty(ray, "vector", { get: () => Vector(vector) });
  Object.defineProperty(ray, "length", { get: () => Infinity });
  Object.defineProperty(ray, "transform", { value: transform });
  Object.defineProperty(ray, "rotate180", { value: rotate180 });
  Object.defineProperty(ray, "compare_function", { value: compare_function });
  Object.defineProperty(ray, "clip_function", { value: limit_ray });
  return ray;
};
Ray.fromPoints = function (...args) {
  const points = get_two_vec2(args);
  return Ray({
    point: points[0],
    vector: normalize([
      points[1][0] - points[0][0],
      points[1][1] - points[0][1],
    ]),
  });
};

const Segment = function (...args) {
  const inputs = get_two_vec2(args);
  const proto = Prototype.bind(this);
  const segment = Object.create(proto(Segment, []));
  const vecPts = (inputs.length > 0 ? inputs.map(p => Vector(p)) : undefined);
  if (vecPts === undefined) { return undefined; }
  vecPts.forEach((p, i) => { segment[i] = p; });
  const transform = function (...innerArgs) {
    const mat = get_matrix2(innerArgs);
    const transformed_points = segment
      .map(point => multiply_vector2_matrix2(point, mat));
    return Segment(transformed_points);
  };
  const vector = function () {
    return Vector(segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]);
  };
  const midpoint = () => Vector(average(segment[0], segment[1]));
  const length = function () {
    return Math.sqrt(((segment[1][0] - segment[0][0]) ** 2)
                   + ((segment[1][1] - segment[0][1]) ** 2));
  };
  const compare_function = (t0, ep) => t0 >= -ep && t0 <= 1 + ep;
  Object.defineProperty(segment, "point", { get: () => segment[0] });
  Object.defineProperty(segment, "vector", { get: () => vector() });
  Object.defineProperty(segment, "midpoint", { value: midpoint });
  Object.defineProperty(segment, "length", { get: () => length() });
  Object.defineProperty(segment, "transform", { value: transform });
  Object.defineProperty(segment, "compare_function", { value: compare_function });
  Object.defineProperty(segment, "clip_function", {
    value: limit_segment,
  });
  return segment;
};

const Circle = function (...args) {
  let origin;
  let radius;
  const params = Array.from(args);
  const numbers = params.filter(param => !isNaN(param));
  if (numbers.length === 3) {
    origin = Vector(numbers[0], numbers[1]);
    [, , radius] = numbers;
  }
  const intersectionLine = function (...innerArgs) {
    const line = get_line(innerArgs);
    const p2 = [line.point[0] + line.vector[0], line.point[1] + line.vector[1]];
    const result = circle_line(origin, radius, line.point, p2);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };
  const intersectionRay = function (...innerArgs) {
    const ray = get_ray(innerArgs);
    const result = circle_ray(origin, radius, ray[0], ray[1]);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };
  const intersectionSegment = function (...innerArgs) {
    const segment = get_two_vec2(innerArgs);
    const result = circle_segment(origin, radius, segment[0], segment[1]);
    return (result === undefined ? undefined : result.map(i => Vector(i)));
  };
  return {
    intersectionLine,
    intersectionRay,
    intersectionSegment,
    get origin() { return origin; },
    get radius() { return radius; },
    set origin(innerArgs) { origin = Vector(innerArgs); },
    set radius(newRadius) { radius = newRadius; },
  };
};

const Sector = function (vectorA, vectorB, center = [0, 0]) {
  const vectors = [get_vector(vectorA), get_vector(vectorB)];
  const bisect = function () {
    const interior_angle = counter_clockwise_angle2(vectors[0], vectors[1]);
    const vectors_radians = vectors.map(el => Math.atan2(el[1], el[0]));
    const bisected = vectors_radians[0] + interior_angle * 0.5;
    return [Math.cos(bisected), Math.sin(bisected)];
  };
  const subsect_sector = function (divisions) {
    return subsect(divisions, vectors[0], vectors[1])
      .map(vec => [vec[0], vec[1]]);
  };
  const contains = function (...args) {
    const point = get_vector(args).map((n, i) => n + center[i]);
    const cross0 = (point[1] - vectors[0][1]) * -vectors[0][0]
                 - (point[0] - vectors[0][0]) * -vectors[0][1];
    const cross1 = point[1] * vectors[1][0] - point[0] * vectors[1][1];
    return cross0 < 0 && cross1 < 0;
  };
  return {
    contains,
    bisect,
    subsect: subsect_sector,
    get center() { return center; },
    get vectors() { return vectors; },
    get angle() { return counter_clockwise_angle2(vectors[0], vectors[1]); },
  };
};
Sector.fromVectors = function (vectorA, vectorB) {
  return Sector(vectorA, vectorB);
};
Sector.fromPoints = function (pointA, pointB, center = [0, 0]) {
  const vectors = [pointA, pointB].map(p => p.map((_, i) => p[i] - center[i]));
  return Sector(vectors[0], vectors[1], center);
};

function Prototype$1 (subtype) {
  const proto = {};
  const Type = subtype;
  const area = function () { return signed_area(this.points); };
  const midpoint = function () { return average(this.points); };
  const enclosingRectangle = function () {
    return enclosing_rectangle(this.points);
  };
  const sectors = function () {
    return this.points
      .map((p, i, a) => [
        a[(i + a.length - 1) % a.length],
        a[i],
        a[(i + 1) % a.length]])
      .map(points => Sector(points[1], points[2], points[0]));
  };
  const contains = function (...args) {
    return point_in_poly(get_vector(args), this.points);
  };
  const polyCentroid = function () {
    return centroid(this.points);
  };
  const nearest = function (...args) {
    const point = get_vector(args);
    const points = this.sides.map(edge => edge.nearestPoint(point));
    let lowD = Infinity;
    let lowI;
    points.map(p => distance2(point, p))
      .forEach((d, i) => { if (d < lowD) { lowD = d; lowI = i; } });
    return {
      point: points[lowI],
      edge: this.sides[lowI],
    };
  };
  const clipSegment = function (...args) {
    const edge = get_segment(args);
    const e = convex_poly_segment(this.points, edge[0], edge[1]);
    return e === undefined ? undefined : Segment(e);
  };
  const clipLine = function (...args) {
    const line = get_line(args);
    const e = convex_poly_line(this.points, line.point, line.vector);
    return e === undefined ? undefined : Segment(e);
  };
  const clipRay = function (...args) {
    const line = get_line(args);
    const e = convex_poly_ray(this.points, line.point, line.vector);
    return e === undefined ? undefined : Segment(e);
  };
  const split = function (...args) {
    const line = get_line(args);
    return split_polygon(this.points, line.point, line.vector)
      .map(poly => Type(poly));
  };
  const scale = function (magnitude$$1, center = centroid(this.points)) {
    const newPoints = this.points
      .map(p => [0, 1].map((_, i) => p[i] - center[i]))
      .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude$$1));
    return Type(newPoints);
  };
  const rotate = function (angle, centerPoint = centroid(this.points)) {
    const newPoints = this.points.map((p) => {
      const vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
      const mag = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
      const a = Math.atan2(vec[1], vec[0]);
      return [
        centerPoint[0] + Math.cos(a + angle) * mag,
        centerPoint[1] + Math.sin(a + angle) * mag,
      ];
    });
    return Type(newPoints);
  };
  const translate = function (...args) {
    const vec = get_vector(args);
    const newPoints = this.points.map(p => p.map((n, i) => n + vec[i]));
    return Type(newPoints);
  };
  const transform = function (...args) {
    const m = get_matrix2(args);
    const newPoints = this.points
      .map(p => Vector(multiply_vector2_matrix2(p, m)));
    return Type(newPoints);
  };
  Object.defineProperty(proto, "area", { value: area });
  Object.defineProperty(proto, "centroid", { value: polyCentroid });
  Object.defineProperty(proto, "midpoint", { value: midpoint });
  Object.defineProperty(proto, "enclosingRectangle", { value: enclosingRectangle });
  Object.defineProperty(proto, "contains", { value: contains });
  Object.defineProperty(proto, "nearest", { value: nearest });
  Object.defineProperty(proto, "clipSegment", { value: clipSegment });
  Object.defineProperty(proto, "clipLine", { value: clipLine });
  Object.defineProperty(proto, "clipRay", { value: clipRay });
  Object.defineProperty(proto, "split", { value: split });
  Object.defineProperty(proto, "scale", { value: scale });
  Object.defineProperty(proto, "rotate", { value: rotate });
  Object.defineProperty(proto, "translate", { value: translate });
  Object.defineProperty(proto, "transform", { value: transform });
  Object.defineProperty(proto, "edges", {
    get: function () { return this.sides; },
  });
  Object.defineProperty(proto, "sectors", {
    get: function () { return sectors(); },
  });
  Object.defineProperty(proto, "signedArea", { value: area });
  return Object.freeze(proto);
}

const Polygon = function (...args) {
  const points = get_vector_of_vectors(args).map(p => Vector(p));
  if (points === undefined) { return undefined; }
  const sides = points
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
    .map(ps => Segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
  const proto = Prototype$1.bind(this);
  const polygon = Object.create(proto());
  Object.defineProperty(polygon, "points", { get: () => points });
  Object.defineProperty(polygon, "sides", { get: () => sides });
  return polygon;
};
Polygon.regularPolygon = function (sides, x = 0, y = 0, radius = 1) {
  const points = make_regular_polygon(sides, x, y, radius);
  return Polygon(points);
};
Polygon.convexHull = function (points, includeCollinear = false) {
  const hull = convex_hull(points, includeCollinear);
  return Polygon(hull);
};

const ConvexPolygon = function (...args) {
  const points = get_array_of_vec(args).map(p => Vector(p));
  if (points === undefined) { return undefined; }
  const sides = points
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
    .map(ps => Segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));
  const proto = Prototype$1.bind(this);
  const polygon = Object.create(proto(ConvexPolygon));
  const split = function (...innerArgs) {
    const line = get_line(innerArgs);
    return split_convex_polygon(points, line.point, line.vector)
      .map(poly => ConvexPolygon(poly));
  };
  const overlaps = function (...innerArgs) {
    const poly2Points = get_array_of_vec(innerArgs);
    return convex_polygons_overlap(points, poly2Points);
  };
  const scale = function (magnitude, center = centroid(polygon.points)) {
    const newPoints = polygon.points
      .map(p => [0, 1].map((_, i) => p[i] - center[i]))
      .map(vec => vec.map((_, i) => center[i] + vec[i] * magnitude));
    return ConvexPolygon(newPoints);
  };
  const rotate = function (angle, centerPoint = centroid(polygon.points)) {
    const newPoints = polygon.points.map((p) => {
      const vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
      const mag = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
      const a = Math.atan2(vec[1], vec[0]);
      return [
        centerPoint[0] + Math.cos(a + angle) * mag,
        centerPoint[1] + Math.sin(a + angle) * mag,
      ];
    });
    return ConvexPolygon(newPoints);
  };
  Object.defineProperty(polygon, "points", { get: () => points });
  Object.defineProperty(polygon, "sides", { get: () => sides });
  Object.defineProperty(polygon, "split", { value: split });
  Object.defineProperty(polygon, "overlaps", { value: overlaps });
  Object.defineProperty(polygon, "scale", { value: scale });
  Object.defineProperty(polygon, "rotate", { value: rotate });
  return polygon;
};
ConvexPolygon.regularPolygon = function (sides, x = 0, y = 0, radius = 1) {
  const points = make_regular_polygon(sides, x, y, radius);
  return ConvexPolygon(points);
};
ConvexPolygon.convexHull = function (points, includeCollinear = false) {
  const hull = convex_hull(points, includeCollinear);
  return ConvexPolygon(hull);
};

const Rectangle = function (...args) {
  let origin;
  let width;
  let height;
  const params = Array.from(args);
  const numbers = params.filter(param => !isNaN(param));
  let arrays = params.filter(param => param.constructor === Array);
  if (numbers.length === 4) {
    origin = numbers.slice(0, 2);
    [, , width, height] = numbers;
  }
  if (arrays.length === 1) { arrays = arrays[0]; }
  if (arrays.length === 2) {
    if (typeof arrays[0][0] === "number") {
      origin = arrays[0].slice();
      width = arrays[1][0];
      height = arrays[1][1];
    }
  }
  const points = [
    [origin[0], origin[1]],
    [origin[0] + width, origin[1]],
    [origin[0] + width, origin[1] + height],
    [origin[0], origin[1] + height],
  ];
  const proto = Prototype$1.bind(this);
  const rect = Object.create(proto(Rectangle));
  const scale = function (magnitude, center_point) {
    const center = (center_point != null)
      ? center_point
      : [origin[0] + width, origin[1] + height];
    const x = origin[0] + (center[0] - origin[0]) * (1 - magnitude);
    const y = origin[1] + (center[1] - origin[1]) * (1 - magnitude);
    return Rectangle(x, y, width * magnitude, height * magnitude);
  };
  const rotate = function (...innerArgs) {
    return ConvexPolygon(points).rotate(...innerArgs);
  };
  const transform = function (...innerArgs) {
    return ConvexPolygon(points).transform(innerArgs);
  };
  Object.defineProperty(rect, "origin", { get: () => origin });
  Object.defineProperty(rect, "width", { get: () => width });
  Object.defineProperty(rect, "height", { get: () => height });
  Object.defineProperty(rect, "area", { get: () => width * height });
  Object.defineProperty(rect, "scale", { value: scale });
  Object.defineProperty(rect, "rotate", { value: rotate });
  Object.defineProperty(rect, "transform", { value: transform });
  return rect;
};

const Junction = function (...args) {
  const vectors = get_vector_of_vectors(args);
  if (vectors === undefined) {
    return undefined;
  }
  const sorted_order = counter_clockwise_vector_order(...vectors);
  const sectors = function () {
    return sorted_order.map(i => vectors[i])
      .map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
      .map(pair => Sector.fromVectors(pair[0], pair[1]));
  };
  const angles = function () {
    return sorted_order.map(i => vectors[i])
      .map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
      .map(pair => counter_clockwise_angle2(pair[0], pair[1]));
  };
  return {
    sectors,
    angles,
    get vectors() { return vectors; },
    get vectorOrder() { return [...sorted_order]; },
  };
};
Junction.fromVectors = function (...vectors) {
  return Junction(...vectors);
};
Junction.fromPoints = function (center, edge_adjacent_points) {
  const vectors = edge_adjacent_points
    .map(p => p.map((_, i) => p[i] - center[i]));
  return Junction.fromVectors(vectors);
};

const core = Object.create(null);
Object.assign(core, algebra, matrixCore, geometry, query, equal);
core.clean_number = clean_number;
core.is_number = is_number;
core.is_vector = is_vector;
core.is_iterable = is_iterable;
core.flatten_input = flatten_input;
core.semi_flatten_input = semi_flatten_input;
core.get_vector = get_vector;
core.get_vector_of_vectors = get_vector_of_vectors;
core.get_matrix2 = get_matrix2;
core.get_segment = get_segment;
core.get_line = get_line;
core.get_ray = get_ray;
core.get_two_vec2 = get_two_vec2;
core.get_array_of_vec = get_array_of_vec;
core.get_array_of_vec2 = get_array_of_vec2;
core.intersection = intersection;
Object.freeze(core);
const math = {
  vector: Vector,
  matrix2: Matrix2,
  matrix: Matrix,
  line: Line,
  ray: Ray,
  segment: Segment,
  circle: Circle,
  polygon: Polygon,
  convexPolygon: ConvexPolygon,
  rectangle: Rectangle,
  junction: Junction,
  sector: Sector,
  core,
};

export default math;
