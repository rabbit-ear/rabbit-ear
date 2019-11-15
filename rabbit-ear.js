/* Rabbit Ear v0.1.91 (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.RabbitEar = factory());
}(this, function () { 'use strict';

  const isBrowser = typeof window !== "undefined"
    && typeof window.document !== "undefined";
  const isNode = typeof process !== "undefined"
    && process.versions != null
    && process.versions.node != null;

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
  var algebra = Object.freeze({
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
  var matrixCore = Object.freeze({
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
  var equal = Object.freeze({
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
  var query = Object.freeze({
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
  var intersection = Object.freeze({
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
  var geometry = Object.freeze({
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
      return parallel(sm, lg);
    };
    const isDegenerate = function (epsilon = EPSILON) {
      return degenerate(this.vector);
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

  const CleanPrototype = function () {
    const proto = Object.create(null);
    const join = function (report) {
      if (report == null) { return this; }
      this.nodes.total += report.nodes.total;
      this.edges.total += report.edges.total;
      this.nodes.isolated += report.nodes.isolated;
      this.edges.duplicate += report.edges.duplicate;
      this.edges.circular += report.edges.circular;
      return this;
    };
    const isolatedNodes = function (num) {
      this.nodes.isolated = num;
      this.nodes.total += num;
      return this;
    };
    const duplicateEdges = function (num) {
      this.edges.duplicate = num;
      this.edges.total += num;
      return this;
    };
    const circularEdges = function (num) {
      this.edges.circular = num;
      this.edges.total += num;
      return this;
    };
    Object.defineProperty(proto, "join", { value: join });
    Object.defineProperty(proto, "isolatedNodes", { value: isolatedNodes });
    Object.defineProperty(proto, "duplicateEdges", { value: duplicateEdges });
    Object.defineProperty(proto, "circularEdges", { value: circularEdges });
    return Object.freeze(proto);
  };
  const GraphClean = function (numNodes, numEdges) {
    const clean = Object.create(CleanPrototype());
    clean.nodes = { total: 0, isolated: 0 };
    clean.edges = { total: 0, duplicate: 0, circular: 0 };
    if (numNodes != null) { clean.nodes.total = numNodes; }
    if (numEdges != null) { clean.edges.total = numEdges; }
    return clean;
  };

  const Node = function (graph) {
    const node = Object.create(null);
    node.graph = graph;
    const adjacentEdges = function () {
      return node.graph.edges
        .filter(el => el.nodes[0] === node || el.nodes[1] === node);
    };
    const adjacentNodes = function () {
      const checked = [];
      return adjacentEdges()
        .filter(el => !el.isCircular)
        .map(el => (el.nodes[0] === node
          ? el.nodes[1]
          : el.nodes[0]))
        .filter(el => (checked.indexOf(el) >= 0 ? false : checked.push(el)));
    };
    const adjacent = function () {
      const adj = Object.create(null);
      adj.edges = adjacentEdges();
      const checked = [];
      adj.nodes = adj.edges.filter(el => !el.isCircular)
        .map(el => (el.nodes[0] === node
          ? el.nodes[1]
          : el.nodes[0]))
        .filter(el => (checked.indexOf(el) >= 0
          ? false
          : checked.push(el)));
      return adj;
    };
    const isAdjacentToNode = function (n) {
      return adjacentNodes.filter(el => el === n).length > 0;
    };
    const degree = function () {
      return node.graph.edges
        .map(el => el.nodes
          .map(n => (n === node ? 1 : 0))
          .reduce((a, b) => a + b, 0))
        .reduce((a, b) => a + b, 0);
    };
    Object.defineProperty(node, "adjacent", {
      get: function () { return adjacent(); }
    });
    Object.defineProperty(node, "degree", { get: () => degree() });
    Object.defineProperty(node, "isAdjacentToNode", { value: isAdjacentToNode });
    return node;
  };

  const Edge = function (graph, node1, node2) {
    const edge = Object.create(null);
    edge.graph = graph;
    edge.nodes = [node1, node2];
    const adjacentEdges = function () {
      return edge.graph.edges.filter(e => e !== edge
        && (e.nodes[0] === edge.nodes[0]
        || e.nodes[0] === edge.nodes[1]
        || e.nodes[1] === edge.nodes[0]
        || e.nodes[1] === edge.nodes[1]));
    };
    const adjacentNodes = function () { return [...edge.nodes]; };
    const adjacent = function () {
      const adj = Object.create(null);
      adj.nodes = adjacentNodes();
      adj.edges = adjacentEdges();
      return adj;
    };
    const isAdjacentToEdge = function (e) {
      return ((edge.nodes[0] === e.nodes[0]) || (edge.nodes[1] === e.nodes[1])
        || (edge.nodes[0] === e.nodes[1]) || (edge.nodes[1] === e.nodes[0]));
    };
    const isSimilarToEdge = function (e) {
      return ((edge.nodes[0] === e.nodes[0] && edge.nodes[1] === e.nodes[1])
        || (edge.nodes[0] === e.nodes[1] && edge.nodes[1] === e.nodes[0]));
    };
    const otherNode = function (n) {
      if (edge.nodes[0] === n) { return edge.nodes[1]; }
      if (edge.nodes[1] === n) { return edge.nodes[0]; }
      return undefined;
    };
    const isCircular = function () {
      return edge.nodes[0] === edge.nodes[1];
    };
    const duplicateEdges = function () {
      return edge.graph.edges.filter(el => edge.isSimilarToEdge(el));
    };
    const commonNodeWithEdge = function (otherEdge) {
      if (edge === otherEdge) {
        return undefined;
      }
      if (edge.nodes[0] === otherEdge.nodes[0]
        || edge.nodes[0] === otherEdge.nodes[1]) {
        return edge.nodes[0];
      }
      if (edge.nodes[1] === otherEdge.nodes[0]
        || edge.nodes[1] === otherEdge.nodes[1]) {
        return edge.nodes[1];
      }
      return undefined;
    };
    const uncommonNodeWithEdge = function (otherEdge) {
      if (edge === otherEdge) { return undefined; }
      if (edge.nodes[0] === otherEdge.nodes[0]
        || edge.nodes[0] === otherEdge.nodes[1]) {
        return edge.nodes[1];
      }
      if (edge.nodes[1] === otherEdge.nodes[0]
        || edge.nodes[1] === otherEdge.nodes[1]) {
        return edge.nodes[0];
      }
      return undefined;
    };
    Object.defineProperty(edge, "adjacent", {
      get: function () { return adjacent(); }
    });
    Object.defineProperty(edge, "isAdjacentToEdge", { value: isAdjacentToEdge });
    Object.defineProperty(edge, "isSimilarToEdge", { value: isSimilarToEdge });
    Object.defineProperty(edge, "otherNode", { value: otherNode });
    Object.defineProperty(edge, "isCircular", {
      get: function () { return isCircular(); }
    });
    Object.defineProperty(edge, "duplicateEdges", { value: duplicateEdges });
    Object.defineProperty(edge, "commonNodeWithEdge", {
      value: commonNodeWithEdge
    });
    Object.defineProperty(edge, "uncommonNodeWithEdge", {
      value: uncommonNodeWithEdge
    });
    return edge;
  };

  const Graph = function () {
    const graph = Object.create(null);
    graph.nodes = [];
    graph.edges = [];
    graph.types = {
      node: Node,
      edge: Edge
    };
    const newNode = function (...args) {
      const node = graph.types.node(graph);
      Object.assign(node, ...args);
      node.graph = graph;
      graph.nodes.push(node);
      return node;
    };
    const newEdge = function (node1, node2) {
      const edge = graph.types.edge(graph, node1, node2);
      edge.graph = graph;
      graph.edges.push(edge);
      return edge;
    };
    const copyNode = function (node) {
      return Object.assign(graph.newNode(), node);
    };
    const copyEdge = function (edge) {
      return Object.assign(graph.newEdge(edge.nodes[0], edge.nodes[1]), edge);
    };
    const clear = function () {
      graph.nodes = [];
      graph.edges = [];
      return graph;
    };
    const removeEdge = function (edge) {
      const edgesLength = graph.edges.length;
      graph.edges = graph.edges.filter(el => el !== edge);
      return GraphClean(undefined, edgesLength - graph.edges.length);
    };
    const removeEdgeBetween = function (node1, node2) {
      const edgesLength = graph.edges.length;
      graph.edges = graph.edges.filter(el => !((el.nodes[0] === node1
        && el.nodes[1] === node2) || (el.nodes[0] === node2
        && el.nodes[1] === node1)));
      return GraphClean(undefined, edgesLength - graph.edges.length);
    };
    const removeNode = function (node) {
      const nodesLength = graph.nodes.length;
      const edgesLength = graph.edges.length;
      graph.nodes = graph.nodes.filter(n => n !== node);
      graph.edges = graph.edges
        .filter(e => e.nodes[0] !== node && e.nodes[1] !== node);
      return GraphClean(
        nodesLength - graph.nodes.length,
        edgesLength - graph.edges.length
      );
    };
    const mergeNodes = function (node1, node2) {
      if (node1 === node2) { return undefined; }
      graph.edges.forEach((edge) => {
        if (edge.nodes[0] === node2) { edge.nodes[0] = node1; }
        if (edge.nodes[1] === node2) { edge.nodes[1] = node1; }
      });
      const nodesLength = graph.nodes.length;
      graph.nodes = graph.nodes.filter(n => n !== node2);
      return GraphClean(nodesLength - graph.nodes.length).join(clean());
    };
    const removeIsolatedNodes = function () {
      const nodeDegree = Array(graph.nodes.length).fill(false);
      graph.nodes.forEach((n, i) => { n._memo = i; });
      graph.edges.forEach((e) => {
        nodeDegree[e.nodes[0]._memo] = true;
        nodeDegree[e.nodes[1]._memo] = true;
      });
      graph.nodes.forEach(n => delete n._memo);
      const nodeLength = graph.nodes.length;
      graph.nodes = graph.nodes.filter((el, i) => nodeDegree[i]);
      return GraphClean().isolatedNodes(nodeLength - graph.nodes.length);
    };
    const removeCircularEdges = function () {
      const edgesLength = graph.edges.length;
      graph.edges = graph.edges.filter(el => el.nodes[0] !== el.nodes[1]);
      return GraphClean().circularEdges(edgesLength - graph.edges.length);
    };
    const removeDuplicateEdges = function () {
      let count = 0;
      for (let i = 0; i < graph.edges.length - 1; i += 1) {
        for (let j = graph.edges.length - 1; j > i; j -= 1) {
          if (graph.edges[i].isSimilarToEdge(graph.edges[j])) {
            graph.edges.splice(j, 1);
            count += 1;
          }
        }
      }
      return GraphClean().duplicateEdges(count);
    };
    const clean = function () {
      return removeDuplicateEdges()
        .join(removeCircularEdges());
    };
    const getEdgeConnectingNodes = function (node1, node2) {
      const { edges } = graph;
      for (let i = 0; i < edges.length; i += 1) {
        if ((edges[i].nodes[0] === node1 && edges[i].nodes[1] === node2)
          || (edges[i].nodes[0] === node2 && edges[i].nodes[1] === node1)) {
          return edges[i];
        }
      }
      return undefined;
    };
    const getEdgesConnectingNodes = function (node1, node2) {
      return graph.edges.filter(e => (e.nodes[0] === node1
        && e.nodes[1] === node2) || (e.nodes[0] === node2
        && e.nodes[1] === node1));
    };
    const copy = function () {
      graph.nodes.forEach((node, i) => { node._memo = i; });
      const g = Graph();
      for (let i = 0; i < graph.nodes.length; i += 1) {
        const n = g.newNode();
        Object.assign(n, graph.nodes[i]);
        n.graph = g;
      }
      for (let i = 0; i < graph.edges.length; i += 1) {
        const indices = graph.edges[i].nodes.map(n => n._memo);
        const e = g.newEdge(g.nodes[indices[0]], g.nodes[indices[1]]);
        Object.assign(e, graph.edges[i]);
        e.graph = g;
        e.nodes = [g.nodes[indices[0]], g.nodes[indices[1]]];
      }
      graph.nodes.forEach(node => delete node._memo);
      g.nodes.forEach(node => delete node._memo);
      return g;
    };
    const eulerianPaths = function () {
      const cp = copy();
      cp.clean();
      cp.removeIsolatedNodes();
      cp.nodes.forEach((node, i) => {
        node._memo = {
          index: i,
          adj: node.adjacent.edges.length
        };
      });
      const graphs = [];
      while (cp.edges.length > 0) {
        const subGraph = Graph();
        subGraph.nodes = cp.nodes.map(node => Object
          .assign(subGraph.types.node(subGraph), node));
        subGraph.nodes.forEach((n) => { n.graph = subGraph; });
        let node = cp.nodes.slice().sort((a, b) => b._memo.adj - a._memo.adj)[0];
        let adj = node.adjacent.edges;
        while (adj.length > 0) {
          const smartList = adj
            .filter(el => el.otherNode(node)._memo.adj % 2 === 0);
          if (smartList.length === 0) { smartList = adj; }
          const nextEdge = smartList.sort((a, b) => b.otherNode(node)._memo.adj
            - a.otherNode(node)._memo.adj)[0];
          const nextNode = nextEdge.otherNode(node);
          const makeEdge = Object.assign(subGraph.types
            .edge(subGraph, undefined, undefined), nextEdge);
          makeEdge.nodes = [
            subGraph.nodes[node._memo.index],
            subGraph.nodes[nextNode._memo.index]
          ];
          subGraph.edges.push(makeEdge);
          node._memo.adj -= 1;
          nextNode._memo.adj -= 1;
          cp.edges = cp.edges.filter((el) => el !== nextEdge);
          node = nextNode;
          adj = node.adjacent.edges;
        }
        subGraph.removeIsolatedNodes();
        graphs.push(subGraph);
      }
      return graphs;
    };
    Object.defineProperty(graph, "newNode", { value: newNode });
    Object.defineProperty(graph, "newEdge", { value: newEdge });
    Object.defineProperty(graph, "copyNode", { value: copyNode });
    Object.defineProperty(graph, "copyEdge", { value: copyEdge });
    Object.defineProperty(graph, "clear", { value: clear });
    Object.defineProperty(graph, "removeEdge", { value: removeEdge });
    Object.defineProperty(graph, "removeEdgeBetween", {
      value: removeEdgeBetween
    });
    Object.defineProperty(graph, "removeNode", { value: removeNode });
    Object.defineProperty(graph, "mergeNodes", { value: mergeNodes });
    Object.defineProperty(graph, "removeIsolatedNodes", {
      value: removeIsolatedNodes
    });
    Object.defineProperty(graph, "removeCircularEdges", {
      value: removeCircularEdges
    });
    Object.defineProperty(graph, "removeDuplicateEdges", {
      value: removeDuplicateEdges
    });
    Object.defineProperty(graph, "clean", { value: clean });
    Object.defineProperty(graph, "getEdgeConnectingNodes", {
      value: getEdgeConnectingNodes
    });
    Object.defineProperty(graph, "getEdgesConnectingNodes", {
      value: getEdgesConnectingNodes
    });
    Object.defineProperty(graph, "copy", { value: copy });
    Object.defineProperty(graph, "eulerianPaths", { value: eulerianPaths });
    return graph;
  };

  const isBrowser$1 = typeof window !== "undefined"
    && typeof window.document !== "undefined";
  const isNode$1 = typeof process !== "undefined"
    && process.versions != null
    && process.versions.node != null;
  const htmlString = "<!DOCTYPE html><title> </title>";
  const win = (function () {
    let w = {};
    if (isNode$1) {
      const { DOMParser, XMLSerializer } = require("xmldom");
      w.DOMParser = DOMParser;
      w.XMLSerializer = XMLSerializer;
      w.document = new DOMParser().parseFromString(htmlString, "text/html");
    } else if (isBrowser$1) {
      w = window;
    }
    return w;
  }());
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
  var NS = "http://www.w3.org/2000/svg";
  const downloadInBrowser = function (filename, contentsAsString) {
    const blob = new window.Blob([contentsAsString], { type: "text/plain" });
    const a = document.createElement("a");
    a.setAttribute("href", window.URL.createObjectURL(blob));
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const getPageCSS = function () {
    const css = [];
    for (let s = 0; s < document.styleSheets.length; s += 1) {
      const sheet = document.styleSheets[s];
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
    return css.join("\n");
  };
  const save = function (svg, filename = "image.svg", includeDOMCSS = false) {
    if (includeDOMCSS) {
      const styleContainer = document.createElementNS(NS, "style");
      styleContainer.setAttribute("type", "text/css");
      styleContainer.innerHTML = getPageCSS();
      svg.appendChild(styleContainer);
    }
    const source = (new XMLSerializer()).serializeToString(svg);
    const formattedString = vkXML(source);
    if (window != null) {
      downloadInBrowser(filename, formattedString);
    }
    return formattedString;
  };
  const load = function (input, callback) {
    if (typeof input === "string" || input instanceof String) {
      const xml = (new DOMParser()).parseFromString(input, "text/xml");
      const parserErrors = xml.getElementsByTagName("parsererror");
      if (parserErrors.length === 0) {
        const parsedSVG = xml.documentElement;
        if (callback != null) {
          callback(parsedSVG);
        }
        return parsedSVG;
      }
      fetch(input)
        .then(response => response.text())
        .then(str => (new DOMParser())
          .parseFromString(str, "text/xml"))
        .then((svgData) => {
          const allSVGs = svgData.getElementsByTagName("svg");
          if (allSVGs == null || allSVGs.length === 0) {
            throw new Error("error, valid XML found, but no SVG element");
          }
          if (callback != null) {
            callback(allSVGs[0]);
          }
          return allSVGs[0];
        });
    } else if (input instanceof Document) {
      callback(input);
      return input;
    }
  };
  var File = Object.freeze({
    __proto__: null,
    save: save,
    load: load
  });
  const bindSVGMethodsTo = function (svg, environment) {
    Object.getOwnPropertyNames(svg)
      .filter(p => typeof svg[p] === "function")
      .forEach((name) => { environment[name] = svg[name].bind(svg); });
    const forbidden = ["svg", "style", "setPoints", "setArc", "setEllipticalArc", "setBezier"];
    Object.keys(win.SVG)
      .filter(key => environment[key] === undefined)
      .filter(key => forbidden.indexOf(key) === -1)
      .forEach((key) => { environment[key] = win.SVG[key]; });
    Object.defineProperty(win, "mousePressed", {
      set: (value) => { svg.mousePressed = value; },
      get: () => svg.mousePressed
    });
    Object.defineProperty(win, "mouseReleased", {
      set: (value) => { svg.mouseReleased = value; },
      get: () => svg.mouseReleased
    });
    Object.defineProperty(win, "mouseMoved", {
      set: (value) => { svg.mouseMoved = value; },
      get: () => svg.mouseMoved
    });
    Object.defineProperty(win, "scroll", {
      set: (value) => { svg.scroll = value; },
      get: () => svg.scroll
    });
    Object.defineProperty(win, "animate", {
      set: (value) => { svg.animate = value; },
      get: () => svg.animate
    });
    Object.defineProperty(win, "fps", {
      set: (value) => { svg.fps = value; },
      get: () => svg.fps
    });
  };
  const globalize = function (svg, ...args) {
    let element = svg;
    if (element == null) {
      element = win.SVG(...args);
    }
    bindSVGMethodsTo(element, win);
    return element;
  };
  const getViewBox = function (svg) {
    const vb = svg.getAttribute("viewBox");
    return (vb == null
      ? undefined
      : vb.split(" ").map(n => parseFloat(n)));
  };
  const setViewBox = function (svg, x, y, width, height, padding = 0) {
    const scale = 1.0;
    const d = (width / scale) - width;
    const X = (x - d) - padding;
    const Y = (y - d) - padding;
    const W = (width + d * 2) + padding * 2;
    const H = (height + d * 2) + padding * 2;
    const viewBoxString = [X, Y, W, H].join(" ");
    svg.setAttributeNS(null, "viewBox", viewBoxString);
  };
  const setDefaultViewBox = function (svg) {
    const size = svg.getBoundingClientRect();
    const width = (size.width === 0 ? 640 : size.width);
    const height = (size.height === 0 ? 480 : size.height);
    setViewBox(svg, 0, 0, width, height);
  };
  const convertToViewBox = function (svg, x, y) {
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    const array = [svgPoint.x, svgPoint.y];
    array.x = svgPoint.x;
    array.y = svgPoint.y;
    return array;
  };
  const translateViewBox = function (svg, dx, dy) {
    const viewBox = getViewBox(svg);
    if (viewBox == null) {
      setDefaultViewBox(svg);
    }
    viewBox[0] += dx;
    viewBox[1] += dy;
    svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
  };
  const scaleViewBox = function (svg, scale, origin_x = 0, origin_y = 0) {
    if (Math.abs(scale) < 1e-8) { scale = 0.01; }
    const matrix = svg.createSVGMatrix()
      .translate(origin_x, origin_y)
      .scale(1 / scale)
      .translate(-origin_x, -origin_y);
    const viewBox = getViewBox(svg);
    if (viewBox == null) {
      setDefaultViewBox(svg);
    }
    const top_left = svg.createSVGPoint();
    const bot_right = svg.createSVGPoint();
    [top_left.x, top_left.y] = viewBox;
    bot_right.x = viewBox[0] + viewBox[2];
    bot_right.y = viewBox[1] + viewBox[3];
    const new_top_left = top_left.matrixTransform(matrix);
    const new_bot_right = bot_right.matrixTransform(matrix);
    setViewBox(svg,
      new_top_left.x,
      new_top_left.y,
      new_bot_right.x - new_top_left.x,
      new_bot_right.y - new_top_left.y);
  };
  var ViewBox = Object.freeze({
    __proto__: null,
    getViewBox: getViewBox,
    setViewBox: setViewBox,
    convertToViewBox: convertToViewBox,
    translateViewBox: translateViewBox,
    scaleViewBox: scaleViewBox
  });
  const Pointer = function (node) {
    const pointer = Object.create(null);
    Object.assign(pointer, {
      isPressed: false,
      position: [0, 0],
      pressed: [0, 0],
      drag: [0, 0],
      prev: [0, 0],
      x: 0,
      y: 0
    });
    const copyPointer = function () {
      const m = pointer.position.slice();
      Object.keys(pointer)
        .filter(key => typeof key === "object")
        .forEach((key) => { m[key] = pointer[key].slice(); });
      Object.keys(pointer)
        .filter(key => typeof key !== "object")
        .forEach((key) => { m[key] = pointer[key]; });
      return Object.freeze(m);
    };
    const setPosition = function (clientX, clientY) {
      pointer.position = convertToViewBox(node, clientX, clientY);
      [pointer.x, pointer.y] = pointer.position;
    };
    const updateDrag = function () {
      pointer.drag = [
        pointer.position[0] - pointer.pressed[0],
        pointer.position[1] - pointer.pressed[1]
      ];
      [pointer.drag.x, pointer.drag.y] = pointer.drag;
    };
    const thisPointer = {};
    const move = function (clientX, clientY) {
      pointer.prev = pointer.position;
      setPosition(clientX, clientY);
      if (pointer.isPressed) {
        updateDrag();
      }
      return thisPointer;
    };
    const down = function (clientX, clientY) {
      pointer.isPressed = true;
      pointer.pressed = convertToViewBox(node, clientX, clientY);
      setPosition(clientX, clientY);
      return thisPointer;
    };
    const up = function () {
      pointer.isPressed = false;
      return thisPointer;
    };
    const pressed = function (isPressed) {
      pointer.isPressed = isPressed;
      return thisPointer;
    };
    Object.defineProperty(thisPointer, "up", { value: up });
    Object.defineProperty(thisPointer, "pressed", { value: pressed });
    Object.defineProperty(thisPointer, "move", { value: move });
    Object.defineProperty(thisPointer, "down", { value: down });
    Object.defineProperty(thisPointer, "get", { value: copyPointer });
    return thisPointer;
  };
  const Touches = function (node) {
    const pointer = Pointer(node);
    const handlers = {
      mousemove: [],
      touchmove: [],
      mousedown: [],
      touchstart: [],
      mouseup: [],
      touchend: [],
      scroll: []
    };
    const clear = () => {
      Object.keys(handlers)
        .forEach(key => handlers[key]
          .forEach(f => node.removeEventListener(key, f)));
      Object.keys(handlers).forEach((key) => { handlers[key] = []; });
    };
    const onMouseMove = (handler, event) => {
      event.preventDefault();
      const e = pointer
        .move(event.clientX, event.clientY)
        .pressed(event.buttons > 0)
        .get();
      handler(e);
      return e;
    };
    const onTouchMove = (handler, event) => {
      event.preventDefault();
      const e = pointer
        .move(event.touches[0].clientX, event.touches[0].clientY)
        .pressed(true)
        .get();
      handler(e);
      return e;
    };
    const onMouseDown = (handler, event) => {
      event.preventDefault();
      const e = pointer
        .down(event.clientX, event.clientY)
        .get();
      handler(e);
      return e;
    };
    const onTouchStart = (handler, event) => {
      event.preventDefault();
      const e = pointer
        .down(event.touches[0].clientX, event.touches[0].clientY)
        .get();
      handler(e);
      return e;
    };
    const onEnd = (handler, event) => {
      event.preventDefault();
      const e = pointer.pressed(false).get();
      handler(e);
      return e;
    };
    const onScroll = function (handler, event) {
      const e = {
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaZ: event.deltaZ,
      };
      e.position = convertToViewBox(node, event.clientX, event.clientY);
      [e.x, e.y] = e.position;
      event.preventDefault();
      handler(e);
      return e;
    };
    Object.defineProperty(node, "mouse", {
      get: () => pointer.get(),
      enumerable: true
    });
    Object.defineProperty(node, "mouseMoved", {
      set: (handler) => {
        const mouseFunc = event => onMouseMove(handler, event);
        const touchFunc = event => onTouchMove(handler, event);
        handlers.mousemove.push(mouseFunc);
        handlers.touchmove.push(mouseFunc);
        node.addEventListener("mousemove", mouseFunc);
        node.addEventListener("touchmove", touchFunc);
      },
      enumerable: true
    });
    Object.defineProperty(node, "mousePressed", {
      set: (handler) => {
        const mouseFunc = event => onMouseDown(handler, event);
        const touchFunc = event => onTouchStart(handler, event);
        handlers.mousedown.push(mouseFunc);
        handlers.touchstart.push(touchFunc);
        node.addEventListener("mousedown", mouseFunc);
        node.addEventListener("touchstart", touchFunc);
      },
      enumerable: true
    });
    Object.defineProperty(node, "mouseReleased", {
      set: (handler) => {
        const mouseFunc = event => onEnd(handler, event);
        const touchFunc = event => onEnd(handler, event);
        handlers.mouseup.push(mouseFunc);
        handlers.touchend.push(touchFunc);
        node.addEventListener("mouseup", mouseFunc);
        node.addEventListener("touchend", touchFunc);
      },
      enumerable: true
    });
    Object.defineProperty(node, "scroll", {
      set: (handler) => {
        const scrollFunc = event => onScroll(handler, event);
        handlers.mouseup.push(scrollFunc);
        node.addEventListener("scroll", scrollFunc);
      },
      enumerable: true
    });
    return {
      clear,
      pointer
    };
  };
  const DEFAULT_DELAY = 1000 / 60;
  const Animate = function (node) {
    const timers = [];
    let frameNumber;
    let delay = DEFAULT_DELAY;
    let func;
    const clear = () => {
      while (timers.length > 0) {
        clearInterval(timers.shift());
      }
      func = undefined;
    };
    const start = () => {
      if (typeof func !== "function") { return; }
      timers.push(setInterval(() => {
        func({
          time: node.getCurrentTime(),
          frame: frameNumber += 1
        });
      }, delay));
    };
    const setLoop = (handler) => {
      clear();
      func = handler;
      if (typeof func === "function") {
        frameNumber = 0;
        start();
      }
    };
    const validateMillis = (m) => {
      const parsed = parseFloat(m);
      if (!isNaN(parsed) && isFinite(parsed)) {
        return parsed;
      }
      return DEFAULT_DELAY;
    };
    const setFPS = (fps) => {
      clear();
      delay = validateMillis(1000 / fps);
      start();
    };
    Object.defineProperty(node, "animate", {
      set: handler => setLoop(handler),
      enumerable: true
    });
    Object.defineProperty(node, "clear", {
      value: () => clear(),
      enumerable: true,
    });
    return {
      clear,
      setLoop,
      setFPS
    };
  };
  const Events = function (node) {
    const animate = Animate(node);
    const touches = Touches(node);
    Object.defineProperty(node, "stopAnimations", {
      value: animate.clear,
      enumerated: true
    });
    Object.defineProperty(node, "freeze", {
      value: () => {
        touches.clear();
        animate.clear();
      },
      enumerated: true
    });
    Object.defineProperty(node, "fps", {
      set: fps => animate.setFPS(fps),
      enumerated: true
    });
  };
  const controlPoint = function (parent, options = {}) {
    const position = [0, 0];
    let selected = false;
    let svg;
    const updateSVG = () => {
      if (svg != null) {
        if (svg.parentNode == null) { parent.appendChild(svg); }
        svg.setAttribute("cx", position[0]);
        svg.setAttribute("cy", position[1]);
      }
    };
    const proxy = new Proxy(position, {
      set: (target, property, value, receiver) => {
        target[property] = value;
        updateSVG();
        return true;
      }
    });
    const setPosition = function (...args) {
      if (args.length === 0) { return; }
      const root = typeof args[0];
      if (root === "number") {
        position[0] = args[0];
        position[1] = args[1];
        updateSVG();
      }
      if (root === "object") {
        if (typeof args[0][0] === "number") {
          position[0] = args[0][0];
          position[1] = args[0][1];
          updateSVG();
        } else if (typeof args[0].x === "number") {
          position[0] = args[0].x;
          position[1] = args[0].y;
          updateSVG();
        }
      }
      if (typeof position.delegate === "function") {
        position.delegate(proxy);
      }
    };
    setPosition(options.position);
    let updatePosition = input => input;
    const onMouseMove = function (mouse) {
      if (selected) {
        setPosition(updatePosition(mouse));
      }
    };
    const onMouseUp = () => { selected = false; };
    const distance = mouse => ([0, 1]
      .map(i => mouse[i] - position[i])
      .map(e => e ** 2)
      .reduce((a, b) => a + b, 0));
    position.delegate = undefined;
    position.setPosition = setPosition;
    position.onMouseMove = onMouseMove;
    position.onMouseUp = onMouseUp;
    position.distance = distance;
    Object.defineProperty(position, "svg", {
      get: () => svg,
      set: (newSVG) => { svg = newSVG; }
    });
    Object.defineProperty(position, "positionDidUpdate", {
      set: (method) => { updatePosition = method; }
    });
    Object.defineProperty(position, "selected", {
      set: (value) => { selected = value; }
    });
    Object.defineProperty(position, "remove", {
      value: () => {
        if (svg != null) { svg.remove(); }
      }
    });
    return proxy;
  };
  const controls = function (svg, number, options) {
    let selected;
    let delegate;
    const points = Array.from(Array(number))
      .map(() => controlPoint(svg, options));
    points.forEach((pt, i) => {
      if (typeof options === "object"
        && typeof options.position === "function") {
        pt.setPosition(options.position(i));
      }
    });
    const protocol = function (point) {
      if (typeof delegate === "function") {
        delegate.call(points, point);
      }
    };
    points.forEach((p) => { p.delegate = protocol; });
    const mousePressedHandler = function (mouse) {
      if (!(points.length > 0)) { return; }
      selected = points
        .map((p, i) => ({ i, d: p.distance(mouse) }))
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
    svg.mousePressed = mousePressedHandler;
    svg.mouseMoved = mouseMovedHandler;
    svg.mouseReleased = mouseReleasedHandler;
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
    points.changed = function (func, runOnceAtStart) {
      if (typeof func === "function") {
        delegate = func;
        if (runOnceAtStart === true) { delegate.call(points); }
      }
      return points;
    };
    points.position = function (func) {
      if (typeof func === "function") {
        points.forEach((p, i) => p.setPosition(func(i)));
      }
      return points;
    };
    points.svg = function (func) {
      if (typeof func === "function") {
        points.forEach((p, i) => { p.svg = func(i); });
      }
      return points;
    };
    points.parent = function (parent) {
      if (parent != null && parent.appendChild != null) {
        points.forEach((p) => { parent.appendChild(p.svg); });
      }
      return points;
    };
    return points;
  };
  const is_iterable$1 = obj => obj != null
    && typeof obj[Symbol.iterator] === "function";
  const flatten_input$1 = function (...args) {
    switch (args.length) {
      case undefined:
      case 0: return args;
      case 1: return is_iterable$1(args[0]) && typeof args[0] !== "string"
        ? flatten_input$1(...args[0])
        : [args[0]];
      default:
        return Array.from(args)
          .map(a => (is_iterable$1(a)
            ? [...flatten_input$1(a)]
            : a))
          .reduce((a, b) => a.concat(b), []);
    }
  };
  const setPoints = function (shape, ...pointsArray) {
    const flat = flatten_input$1(...pointsArray);
    let pointsString = "";
    if (typeof flat[0] === "number") {
      pointsString = Array.from(Array(Math.floor(flat.length / 2)))
        .reduce((a, b, i) => `${a}${flat[i * 2]},${flat[i * 2 + 1]} `, "");
    }
    if (typeof flat[0] === "object") {
      if (typeof flat[0].x === "number") {
        pointsString = flat.reduce((prev, curr) => `${prev}${curr.x},${curr.y} `, "");
      }
      if (typeof flat[0][0] === "number") {
        pointsString = flat.reduce((prev, curr) => `${prev}${curr[0]},${curr[1]} `, "");
      }
    }
    shape.setAttributeNS(null, "points", pointsString);
    return shape;
  };
  const setLinePoints = function (shape, ...pointsArray) {
    const flat = flatten_input$1(...pointsArray);
    let points = [];
    if (typeof flat[0] === "number") {
      points = flat;
    }
    if (typeof flat[0] === "object") {
      if (typeof flat[0].x === "number") {
        points = flat.map(p => [p[0], p[1]]).reduce((a, b) => a.concat(b), []);
      }
      if (typeof flat[0][0] === "number") {
        points = flat.reduce((a, b) => a.concat(b), []);
      }
    }
    if (points[0] != null) { shape.setAttributeNS(null, "x1", points[0]); }
    if (points[1] != null) { shape.setAttributeNS(null, "y1", points[1]); }
    if (points[2] != null) { shape.setAttributeNS(null, "x2", points[2]); }
    if (points[3] != null) { shape.setAttributeNS(null, "y2", points[3]); }
    return shape;
  };
  const setCenter = function (shape, ...args) {
    const flat = flatten_input$1(...args);
    if (typeof flat[0] === "number") {
      if (flat[0] != null) { shape.setAttributeNS(null, "cx", flat[0]); }
      if (flat[1] != null) { shape.setAttributeNS(null, "cy", flat[1]); }
    }
    if (typeof flat.x === "number") {
      if (flat.x != null) { shape.setAttributeNS(null, "cx", flat.x); }
      if (flat.y != null) { shape.setAttributeNS(null, "cy", flat.y); }
    }
    return shape;
  };
  const setArc = function (shape, x, y, radius,
    startAngle, endAngle, includeCenter = false) {
    if (endAngle == null) { return undefined; }
    const start = [
      x + Math.cos(startAngle) * radius,
      y + Math.sin(startAngle) * radius];
    const vecStart = [
      Math.cos(startAngle) * radius,
      Math.sin(startAngle) * radius];
    const vecEnd = [
      Math.cos(endAngle) * radius,
      Math.sin(endAngle) * radius];
    const arcVec = [vecEnd[0] - vecStart[0], vecEnd[1] - vecStart[1]];
    const py = vecStart[0] * vecEnd[1] - vecStart[1] * vecEnd[0];
    const px = vecStart[0] * vecEnd[0] + vecStart[1] * vecEnd[1];
    const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
    let d = (includeCenter
      ? `M ${x},${y} l ${vecStart[0]},${vecStart[1]} `
      : `M ${start[0]},${start[1]} `);
    d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
    if (includeCenter) { d += " Z"; }
    shape.setAttributeNS(null, "d", d);
    return shape;
  };
  const setEllipticalArc = function (shape, x, y, rX, rY,
    startAngle, endAngle, includeCenter = false) {
    if (endAngle == null) { return undefined; }
    const start = [
      x + Math.cos(startAngle) * rX,
      y + Math.sin(startAngle) * rY];
    const vecStart = [
      Math.cos(startAngle) * rX,
      Math.sin(startAngle) * rY];
    const vecEnd = [
      Math.cos(endAngle) * rX,
      Math.sin(endAngle) * rY];
    const arcVec = [vecEnd[0] - vecStart[0], vecEnd[1] - vecStart[1]];
    const py = vecStart[0] * vecEnd[1] - vecStart[1] * vecEnd[0];
    const px = vecStart[0] * vecEnd[0] + vecStart[1] * vecEnd[1];
    const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
    let d = (includeCenter
      ? `M ${x},${y} l ${vecStart[0]},${vecStart[1]} `
      : `M ${start[0]},${start[1]} `);
    d += ["a ", rX, rY, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
    if (includeCenter) { d += " Z"; }
    shape.setAttributeNS(null, "d", d);
    return shape;
  };
  const setBezier = function (shape, fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
    if (toY == null) { return undefined; }
    const pts = [[fromX, fromY], [c1X, c1Y], [c2X, c2Y], [toX, toY]]
      .map(p => p.join(","));
    const d = `M ${pts[0]} C ${pts[1]} ${pts[2]} ${pts[3]}`;
    shape.setAttributeNS(null, "d", d);
    return shape;
  };
  const setArrowPoints = function (shape, ...args) {
    const children = Array.from(shape.childNodes);
    const path = children.filter(node => node.tagName === "path").shift();
    const polys = ["svg-arrow-head", "svg-arrow-tail"]
      .map(c => children.filter(n => n.getAttribute("class") === c).shift());
    const flat = flatten_input$1(...args);
    let endpoints = [];
    if (typeof flat[0] === "number") {
      endpoints = flat;
    }
    if (typeof flat[0] === "object") {
      if (typeof flat[0].x === "number") {
        endpoints = flat.map(p => [p[0], p[1]]).reduce((a, b) => a.concat(b), []);
      }
      if (typeof flat[0][0] === "number") {
        endpoints = flat.reduce((a, b) => a.concat(b), []);
      }
    }
    if (!endpoints.length && shape.endpoints != null) {
      endpoints = shape.endpoints;
    }
    if (!endpoints.length) { return shape; }
    shape.endpoints = endpoints;
    const o = shape.options;
    let tailPt = [endpoints[0], endpoints[1]];
    let headPt = [endpoints[2], endpoints[3]];
    let vector = [headPt[0] - tailPt[0], headPt[1] - tailPt[1]];
    let midpoint = [tailPt[0] + vector[0] / 2, tailPt[1] + vector[1] / 2];
    const len = Math.sqrt((vector[0] ** 2) + (vector[1] ** 2));
    const minLength = (
      (o.tail.visible ? (1 + o.tail.padding) * o.tail.height * 2.5 : 0)
    + (o.head.visible ? (1 + o.head.padding) * o.head.height * 2.5 : 0)
    );
    if (len < minLength) {
      const minVec = len === 0
        ? [minLength, 0]
        : [vector[0] / len * minLength, vector[1] / len * minLength];
      tailPt = [midpoint[0] - minVec[0] * 0.5, midpoint[1] - minVec[1] * 0.5];
      headPt = [midpoint[0] + minVec[0] * 0.5, midpoint[1] + minVec[1] * 0.5];
      vector = [headPt[0] - tailPt[0], headPt[1] - tailPt[1]];
    }
    let perpendicular = [vector[1], -vector[0]];
    let bezPoint = [
      midpoint[0] + perpendicular[0] * o.curve,
      midpoint[1] + perpendicular[1] * o.curve
    ];
    const bezTail = [bezPoint[0] - tailPt[0], bezPoint[1] - tailPt[1]];
    const bezHead = [bezPoint[0] - headPt[0], bezPoint[1] - headPt[1]];
    const bezTailLen = Math.sqrt((bezTail[0] ** 2) + (bezTail[1] ** 2));
    const bezHeadLen = Math.sqrt((bezHead[0] ** 2) + (bezHead[1] ** 2));
    const bezTailNorm = bezTailLen === 0
      ? bezTail
      : [bezTail[0] / bezTailLen, bezTail[1] / bezTailLen];
    const bezHeadNorm = bezTailLen === 0
      ? bezHead
      : [bezHead[0] / bezHeadLen, bezHead[1] / bezHeadLen];
    const tailVector = [-bezTailNorm[0], -bezTailNorm[1]];
    const headVector = [-bezHeadNorm[0], -bezHeadNorm[1]];
    const tailNormal = [tailVector[1], -tailVector[0]];
    const headNormal = [headVector[1], -headVector[0]];
    const tailArc = [
      tailPt[0] + bezTailNorm[0] * o.tail.height * ((o.tail.visible ? 1 : 0) + o.tail.padding),
      tailPt[1] + bezTailNorm[1] * o.tail.height * ((o.tail.visible ? 1 : 0) + o.tail.padding)
    ];
    const headArc = [
      headPt[0] + bezHeadNorm[0] * o.head.height * ((o.head.visible ? 1 : 0) + o.head.padding),
      headPt[1] + bezHeadNorm[1] * o.head.height * ((o.head.visible ? 1 : 0) + o.head.padding)
    ];
    vector = [headArc[0] - tailArc[0], headArc[1] - tailArc[1]];
    perpendicular = [vector[1], -vector[0]];
    midpoint = [tailArc[0] + vector[0] / 2, tailArc[1] + vector[1] / 2];
    bezPoint = [
      midpoint[0] + perpendicular[0] * o.curve,
      midpoint[1] + perpendicular[1] * o.curve
    ];
    const tailControl = [
      tailArc[0] + (bezPoint[0] - tailArc[0]) * o.pinch,
      tailArc[1] + (bezPoint[1] - tailArc[1]) * o.pinch
    ];
    const headControl = [
      headArc[0] + (bezPoint[0] - headArc[0]) * o.pinch,
      headArc[1] + (bezPoint[1] - headArc[1]) * o.pinch
    ];
    const tailPolyPts = [
      [tailArc[0] + tailNormal[0] * -o.tail.width, tailArc[1] + tailNormal[1] * -o.tail.width],
      [tailArc[0] + tailNormal[0] * o.tail.width, tailArc[1] + tailNormal[1] * o.tail.width],
      [tailArc[0] + tailVector[0] * o.tail.height, tailArc[1] + tailVector[1] * o.tail.height]
    ];
    const headPolyPts = [
      [headArc[0] + headNormal[0] * -o.head.width, headArc[1] + headNormal[1] * -o.head.width],
      [headArc[0] + headNormal[0] * o.head.width, headArc[1] + headNormal[1] * o.head.width],
      [headArc[0] + headVector[0] * o.head.height, headArc[1] + headVector[1] * o.head.height]
    ];
    path.setAttribute("d", `M${tailArc[0]},${tailArc[1]}C${tailControl[0]},${tailControl[1]},${headControl[0]},${headControl[1]},${headArc[0]},${headArc[1]}`);
    if (o.head.visible) {
      polys[0].removeAttribute("display");
      setPoints(polys[0], headPolyPts);
    } else {
      polys[0].setAttribute("display", "none");
    }
    if (o.tail.visible) {
      polys[1].removeAttribute("display");
      setPoints(polys[1], tailPolyPts);
    } else {
      polys[1].setAttribute("display", "none");
    }
    return shape;
  };
  var geometryMods = Object.freeze({
    __proto__: null,
    setPoints: setPoints,
    setLinePoints: setLinePoints,
    setCenter: setCenter,
    setArc: setArc,
    setEllipticalArc: setEllipticalArc,
    setBezier: setBezier,
    setArrowPoints: setArrowPoints
  });
  var attributes = [
    "accumulate",
    "additive",
    "alignment-baseline",
    "allowReorder",
    "amplitude",
    "attributeName",
    "autoReverse",
    "azimuth",
    "BSection",
    "baseFrequency",
    "baseline-shift",
    "baseProfile",
    "bbox",
    "begin",
    "bias",
    "by",
    "CSection",
    "calcMode",
    "cap-height",
    "clip",
    "clip-rule",
    "color",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "contentScriptType",
    "contentStyleType",
    "cursor",
    "DSection",
    "decelerate",
    "descent",
    "diffuseConstant",
    "direction",
    "display",
    "divisor",
    "dominant-baseline",
    "dur",
    "ESection",
    "edgeMode",
    "elevation",
    "enable-background",
    "end",
    "exponent",
    "externalResourcesRequired",
    "FSection",
    "fill",
    "fill-opacity",
    "fill-rule",
    "filter",
    "filterRes",
    "filterUnits",
    "flood-color",
    "flood-opacity",
    "font-family",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-variant",
    "font-weight",
    "format",
    "from",
    "fr",
    "fx",
    "fy",
    "GSection",
    "g1",
    "g2",
    "glyph-name",
    "glyph-orientation-horizontal",
    "glyph-orientation-vertical",
    "glyphRef",
    "gradientTransform",
    "gradientUnits",
    "HSection",
    "hanging",
    "href",
    "hreflang",
    "horiz-adv-x",
    "horiz-origin-x",
    "ISection",
    "ideographic",
    "image-rendering",
    "in",
    "in2",
    "intercept",
    "KSection",
    "k",
    "k1",
    "k2",
    "k3",
    "k4",
    "kernelMatrix",
    "kernelUnitLength",
    "kerning",
    "keyPoints",
    "keySplines",
    "keyTimes",
    "LSection",
    "lang",
    "letter-spacing",
    "lighting-color",
    "limitingConeAngle",
    "local",
    "MSection",
    "marker-end",
    "marker-mid",
    "marker-start",
    "markerHeight",
    "markerUnits",
    "markerWidth",
    "mathematical",
    "max",
    "media",
    "method",
    "min",
    "mode",
    "NSection",
    "name",
    "numOctaves",
    "OSection",
    "offset",
    "opacity",
    "operator",
    "order",
    "orient",
    "orientation",
    "origin",
    "overflow",
    "overline-position",
    "overline-thickness",
    "PSection",
    "paint-order",
    "patternContentUnits",
    "patternTransform",
    "patternUnits",
    "ping",
    "pointer-events",
    "pointsAtX",
    "pointsAtY",
    "pointsAtZ",
    "preserveAlpha",
    "preserveAspectRatio",
    "primitiveUnits",
    "RSection",
    "radius",
    "referrerPolicy",
    "refX",
    "refY",
    "rel",
    "rendering-intent",
    "repeatCount",
    "repeatDur",
    "requiredFeatures",
    "restart",
    "result",
    "SSection",
    "seed",
    "shape-rendering",
    "slope",
    "spacing",
    "specularConstant",
    "specularExponent",
    "speed",
    "spreadMethod",
    "startOffset",
    "stdDeviation",
    "stemh",
    "stemv",
    "stitchTiles",
    "stop-color",
    "stop-opacity",
    "strikethrough-position",
    "strikethrough-thickness",
    "string",
    "stroke",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "surfaceScale",
    "TSection",
    "tabindex",
    "tableValues",
    "target",
    "targetX",
    "targetY",
    "text-anchor",
    "text-decoration",
    "text-rendering",
    "to",
    "transform-origin",
    "type",
    "USection",
    "u1",
    "u2",
    "underline-position",
    "underline-thickness",
    "unicode",
    "unicode-bidi",
    "unicode-range",
    "units-per-em",
    "VSection",
    "v-alphabetic",
    "v-hanging",
    "v-ideographic",
    "v-mathematical",
    "values",
    "vector-effect",
    "version",
    "vert-adv-y",
    "vert-origin-x",
    "vert-origin-y",
    "viewBox",
    "viewTarget",
    "visibility",
    "WSection",
    "widths",
    "word-spacing",
    "writing-mode",
    "XSection",
    "x-height",
    "xChannelSelector",
    "YSection",
    "yChannelSelector",
    "ZSection",
    "zoomAndPan"
  ];
  const removeChildren = function (parent) {
    while (parent.lastChild) {
      parent.removeChild(parent.lastChild);
    }
  };
  const appendTo = function (element, parent) {
    if (parent != null) {
      element.remove();
      parent.appendChild(element);
    }
    return element;
  };
  const toKebab = string => string
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
    .toLowerCase();
  const setAttributes = function (element, attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(toKebab(key), attributes[key]);
    });
    return element;
  };
  const getClassList = function (xmlNode) {
    const currentClass = xmlNode.getAttribute("class");
    return (currentClass == null
      ? []
      : currentClass.split(" ").filter(s => s !== ""));
  };
  const addClass = function (xmlNode, newClass) {
    if (xmlNode == null) {
      return xmlNode;
    }
    const classes = getClassList(xmlNode)
      .filter(c => c !== newClass);
    classes.push(newClass);
    xmlNode.setAttributeNS(null, "class", classes.join(" "));
    return xmlNode;
  };
  const removeClass = function (xmlNode, removedClass) {
    if (xmlNode == null) {
      return xmlNode;
    }
    const classes = getClassList(xmlNode)
      .filter(c => c !== removedClass);
    xmlNode.setAttributeNS(null, "class", classes.join(" "));
    return xmlNode;
  };
  const setClass = function (xmlNode, className) {
    xmlNode.setAttributeNS(null, "class", className);
    return xmlNode;
  };
  const setID = function (xmlNode, idName) {
    xmlNode.setAttributeNS(null, "id", idName);
    return xmlNode;
  };
  var DOM = Object.freeze({
    __proto__: null,
    removeChildren: removeChildren,
    appendTo: appendTo,
    setAttributes: setAttributes,
    addClass: addClass,
    removeClass: removeClass,
    setClass: setClass,
    setID: setID
  });
  const setTransform = function (element, transform) {
    if (typeof transform === "object") {
      element.setAttribute("transform", transform.join(" "));
    } else if (typeof transform === "string") {
      element.setAttribute("transform", transform);
    }
  };
  const getTransform = function (element) {
    const trans = element.getAttribute("transform");
    return (trans == null
      ? undefined
      : trans.split(" "));
  };
  const translate = function (element, tx, ty) {
    const trans = getTransform(element) || [];
    trans.push(`translate(${tx}, ${ty})`);
    setTransform(element, trans);
    return element;
  };
  const rotate = function (element, angle) {
    const trans = getTransform(element) || [];
    trans.push(`rotate(${angle})`);
    setTransform(element, trans);
    return element;
  };
  const scale = function (element, sx, sy) {
    const trans = getTransform(element) || [];
    trans.push(`scale(${sx}, ${sy})`);
    setTransform(element, trans);
    return element;
  };
  const clearTransforms = function (element) {
    element.setAttribute("transform", "");
    return element;
  };
  var Transform = Object.freeze({
    __proto__: null,
    translate: translate,
    rotate: rotate,
    scale: scale,
    clearTransforms: clearTransforms
  });
  const is_iterable$1$1 = obj => obj != null
    && typeof obj[Symbol.iterator] === "function";
  const flatten_input$1$1 = function (...args) {
    switch (args.length) {
      case undefined:
      case 0: return args;
      case 1: return is_iterable$1$1(args[0]) && typeof args[0] !== "string"
        ? flatten_input$1$1(...args[0])
        : [args[0]];
      default:
        return Array.from(args)
          .map(a => (is_iterable$1$1(a)
            ? [...flatten_input$1$1(a)]
            : a))
          .reduce((a, b) => a.concat(b), []);
    }
  };
  const d = function (element) {
    let attr = element.getAttribute("d");
    if (attr == null) { attr = ""; }
    return attr;
  };
  const append = function (element, command, ...args) {
    const params = flatten_input$1$1(args).join(",");
    element.setAttribute("d", `${d(element)}${command}${params}`);
    return element;
  };
  const command = (element, cmd, ...args) => append(element, cmd, ...args);
  const moveTo = (element, ...args) => append(element, "M", ...args);
  const _moveTo = (element, ...args) => append(element, "m", ...args);
  const lineTo = (element, ...args) => append(element, "L", ...args);
  const _lineTo = (element, ...args) => append(element, "l", ...args);
  const verticalLineTo = (element, y) => append(element, "V", y);
  const _verticalLineTo = (element, y) => append(element, "v", y);
  const horizontalLineTo = (element, x) => append(element, "H", x);
  const _horizontalLineTo = (element, x) => append(element, "h", x);
  const ellipseTo = (element, ...args) => append(element, "A", ...args);
  const _ellipseTo = (element, ...args) => append(element, "a", ...args);
  const curveTo = (element, ...args) => append(element, "C", ...args);
  const _curveTo = (element, ...args) => append(element, "c", ...args);
  const smoothCurveTo = (element, ...args) => append(element, "S", ...args);
  const _smoothCurveTo = (element, ...args) => append(element, "s", ...args);
  const quadCurveTo = (element, ...args) => append(element, "Q", ...args);
  const _quadCurveTo = (element, ...args) => append(element, "q", ...args);
  const smoothQuadCurveTo = (element, ...args) => append(element, "T", ...args);
  const _smoothQuadCurveTo = (element, ...args) => append(element, "t", ...args);
  const close = element => append(element, "Z");
  const clear = (element) => {
    element.setAttribute("d", "");
    return element;
  };
  var Path = Object.freeze({
    __proto__: null,
    command: command,
    moveTo: moveTo,
    _moveTo: _moveTo,
    lineTo: lineTo,
    _lineTo: _lineTo,
    verticalLineTo: verticalLineTo,
    _verticalLineTo: _verticalLineTo,
    horizontalLineTo: horizontalLineTo,
    _horizontalLineTo: _horizontalLineTo,
    ellipseTo: ellipseTo,
    _ellipseTo: _ellipseTo,
    curveTo: curveTo,
    _curveTo: _curveTo,
    smoothCurveTo: smoothCurveTo,
    _smoothCurveTo: _smoothCurveTo,
    quadCurveTo: quadCurveTo,
    _quadCurveTo: _quadCurveTo,
    smoothQuadCurveTo: smoothQuadCurveTo,
    _smoothQuadCurveTo: _smoothQuadCurveTo,
    close: close,
    clear: clear
  });
  const attachStyleMethods = function (element) {
    element.appendTo = arg => appendTo(element, arg);
  };
  const attachAppendableMethods = function (element, methods) {
    Object.keys(methods)
      .filter(key => element[key] === undefined)
      .forEach((key) => {
        element[key] = function (...args) {
          const g = methods[key](...args);
          element.appendChild(g);
          return g;
        };
      });
  };
  const attachArrowMethods = function (element) {
    element.head = (options) => {
      if (typeof options === "object") {
        Object.assign(element.options.head, options);
        if (options.visible === undefined) {
          element.options.head.visible = true;
        }
      } else if (typeof options === "boolean") {
        element.options.head.visible = options;
      } else if (options == null) {
        element.options.head.visible = true;
      }
      setArrowPoints(element);
      return element;
    };
    element.tail = (options) => {
      if (typeof options === "object") {
        Object.assign(element.options.tail, options);
        if (options.visible === undefined) {
          element.options.tail.visible = true;
        }
        element.options.tail.visible = true;
      } else if (typeof options === "boolean") {
        element.options.tail.visible = options;
      } else if (options == null) {
        element.options.tail.visible = true;
      }
      setArrowPoints(element);
      return element;
    };
    element.curve = (amount) => {
      element.options.curve = amount;
      setArrowPoints(element);
      return element;
    };
    element.pinch = (amount) => {
      element.options.pinch = amount;
      setArrowPoints(element);
      return element;
    };
  };
  const attachPathMethods = function (element) {
    Object.keys(Path).forEach((key) => {
      element[key] = (...args) => Path[key](element, ...args);
    });
  };
  const attachDOMMethods = function (element) {
    Object.keys(DOM).filter(key => element[key] === undefined).forEach((key) => {
      element[key] = (...args) => DOM[key](element, ...args);
    });
  };
  const attachTransformMethods = function (element) {
    Object.keys(Transform).forEach((key) => {
      element[key] = (...args) => Transform[key](element, ...args);
    });
  };
  const attachViewBoxMethods = function (element) {
    Object.keys(ViewBox).filter(key => element[key] === undefined).forEach((key) => {
      element[key] = (...args) => ViewBox[key](element, ...args);
    });
  };
  const toCamel = s => s
    .replace(/([-_][a-z])/ig, $1 => $1
      .toUpperCase()
      .replace("-", "")
      .replace("_", ""));
  const attachFunctionalStyleSetters = function (element) {
    attributes.filter(key => element[toCamel(key)] === undefined)
      .forEach((key) => {
        element[toCamel(key)] = (...args) => {
          element.setAttribute(key, ...args);
          return element;
        };
      });
  };
  const attachClipMaskMakers = function (element, primitives) {
    if (element.clipPath === undefined) {
      element.clipPath = (...args) => {
        const c = primitives.clipPath(...args);
        element.appendChild(c);
        return c;
      };
    }
    if (element.mask === undefined) {
      element.mask = (...args) => {
        const m = primitives.mask(...args);
        element.appendChild(m);
        return m;
      };
    }
  };
  const findIdURL = function (arg) {
    if (arg == null) { return undefined; }
    if (typeof arg === "string") {
      return arg.slice(0, 3) === "url"
        ? arg
        : `url(#${arg})`;
    }
    if (arg.getAttribute != null) {
      const idString = arg.getAttribute("id");
      return `url(#${idString})`;
    }
    return "url(#)";
  };
  const attachClipMaskAttributes = function (element) {
    if (element.clipPath === undefined) {
      element.clipPath = function (parent) {
        const value = findIdURL(parent);
        if (value === undefined) { return element; }
        element.setAttribute("clip-path", value);
        return element;
      };
    }
    if (element.mask === undefined) {
      element.mask = function (parent) {
        const value = findIdURL(parent);
        if (value === undefined) { return element; }
        element.setAttribute("mask", value);
        return element;
      };
    }
  };
  const preparePrimitive = function (element) {
    attachFunctionalStyleSetters(element);
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachClipMaskAttributes(element);
    if (element.tagName === "path") {
      attachPathMethods(element);
    }
  };
  const prepareArrow = function (element) {
    attachFunctionalStyleSetters(element);
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachClipMaskAttributes(element);
    attachArrowMethods(element);
  };
  const prepareText = function (element) {
    attachFunctionalStyleSetters(element);
    attachDOMMethods(element);
    attachClipMaskAttributes(element);
  };
  const prepareSVG = function (element, primitives) {
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachViewBoxMethods(element);
    attachFunctionalStyleSetters(element);
    attachClipMaskMakers(element, primitives);
    attachAppendableMethods(element, primitives);
  };
  const prepareGroup = function (element, primitives) {
    attachFunctionalStyleSetters(element);
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachClipMaskAttributes(element);
    attachAppendableMethods(element, primitives);
  };
  const prepareMaskClipPath = function (element, primitives) {
    attachFunctionalStyleSetters(element);
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachClipMaskAttributes(element);
    attachAppendableMethods(element, primitives);
  };
  const prepareStyle = function (element) {
    attachStyleMethods(element);
  };
  const prepare = function (type, element, primitiveList) {
    switch (type) {
      case "svg": prepareSVG(element, primitiveList); break;
      case "primitive": preparePrimitive(element); break;
      case "arrow": prepareArrow(element); break;
      case "defs":
      case "group": prepareGroup(element, primitiveList); break;
      case "text": prepareText(element); break;
      case "clipPath":
      case "mask": prepareMaskClipPath(element, primitiveList); break;
      case "style": prepareStyle(element); break;
      default: console.warn("prepare missing valid type (svg, group.."); break;
    }
  };
  const line = function (...endpoints) {
    const shape = win.document.createElementNS(NS, "line");
    setLinePoints(shape, ...endpoints);
    prepare("primitive", shape);
    shape.setPoints = (...args) => setLinePoints(shape, ...args);
    return shape;
  };
  const circle = function (x, y, radius) {
    const shape = win.document.createElementNS(NS, "circle");
    setCenter(shape, x, y);
    if (radius != null) { shape.setAttributeNS(null, "r", radius); }
    prepare("primitive", shape);
    shape.setCenter = (...args) => setCenter(shape, ...args);
    shape.setRadius = (r) => { shape.setAttributeNS(null, "r", r); return shape; };
    return shape;
  };
  const ellipse = function (x, y, rx, ry) {
    const shape = win.document.createElementNS(NS, "ellipse");
    if (x != null) { shape.setAttributeNS(null, "cx", x); }
    if (y != null) { shape.setAttributeNS(null, "cy", y); }
    if (rx != null) { shape.setAttributeNS(null, "rx", rx); }
    if (ry != null) { shape.setAttributeNS(null, "ry", ry); }
    prepare("primitive", shape);
    return shape;
  };
  const rect = function (x, y, width, height) {
    const shape = win.document.createElementNS(NS, "rect");
    if (x != null) { shape.setAttributeNS(null, "x", x); }
    if (y != null) { shape.setAttributeNS(null, "y", y); }
    if (width != null) { shape.setAttributeNS(null, "width", width); }
    if (height != null) { shape.setAttributeNS(null, "height", height); }
    prepare("primitive", shape);
    return shape;
  };
  const polygon = function (...pointsArray) {
    const shape = win.document.createElementNS(NS, "polygon");
    setPoints(shape, ...pointsArray);
    prepare("primitive", shape);
    shape.setPoints = (...args) => setPoints(shape, ...args);
    return shape;
  };
  const polyline = function (...pointsArray) {
    const shape = win.document.createElementNS(NS, "polyline");
    setPoints(shape, ...pointsArray);
    prepare("primitive", shape);
    shape.setPoints = (...args) => setPoints(shape, ...args);
    return shape;
  };
  const path = function (d) {
    const shape = win.document.createElementNS(NS, "path");
    if (d != null) { shape.setAttributeNS(null, "d", d); }
    prepare("primitive", shape);
    return shape;
  };
  const bezier = function (fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
    const shape = win.document.createElementNS(NS, "path");
    setBezier(shape, fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY);
    prepare("primitive", shape);
    shape.setBezier = (...args) => setBezier(shape, ...args);
    return shape;
  };
  const text = function (textString, x, y) {
    const shape = win.document.createElementNS(NS, "text");
    shape.innerHTML = textString;
    if (x) { shape.setAttributeNS(null, "x", x); }
    if (y) { shape.setAttributeNS(null, "y", y); }
    prepare("text", shape);
    return shape;
  };
  const arc = function (x, y, radius, angleA, angleB) {
    const shape = win.document.createElementNS(NS, "path");
    setArc(shape, x, y, radius, angleA, angleB, false);
    prepare("primitive", shape);
    shape.setArc = (...args) => setArc(shape, ...args);
    return shape;
  };
  const wedge = function (x, y, radius, angleA, angleB) {
    const shape = win.document.createElementNS(NS, "path");
    setArc(shape, x, y, radius, angleA, angleB, true);
    prepare("primitive", shape);
    shape.setArc = (...args) => setArc(shape, ...args);
    return shape;
  };
  const arcEllipse = function (x, y, rx, ry, angleA, angleB) {
    const shape = win.document.createElementNS(NS, "path");
    setEllipticalArc(shape, x, y, rx, ry, angleA, angleB, false);
    prepare("primitive", shape);
    shape.setArc = (...args) => setEllipticalArc(shape, ...args);
    return shape;
  };
  const wedgeEllipse = function (x, y, rx, ry, angleA, angleB) {
    const shape = win.document.createElementNS(NS, "path");
    setEllipticalArc(shape, x, y, rx, ry, angleA, angleB, true);
    prepare("primitive", shape);
    shape.setArc = (...args) => setEllipticalArc(shape, ...args);
    return shape;
  };
  const parabola = function (x, y, width, height) {
    const COUNT = 128;
    const iter = Array.from(Array(COUNT + 1))
      .map((_, i) => (i - (COUNT)) / COUNT * 2 + 1);
    const ptsX = iter.map(i => x + (i + 1) * width * 0.5);
    const ptsY = iter.map(i => y + (i ** 2) * height);
    const points = iter.map((_, i) => [ptsX[i], ptsY[i]]);
    return polyline(points);
  };
  const regularPolygon = function (cX, cY, radius, sides) {
    const halfwedge = 2 * Math.PI / sides * 0.5;
    const r = Math.cos(halfwedge) * radius;
    const points = Array.from(Array(sides)).map((el, i) => {
      const a = -2 * Math.PI * i / sides + halfwedge;
      const x = cX + r * Math.sin(a);
      const y = cY + r * Math.cos(a);
      return [x, y];
    });
    return polygon(points);
  };
  const roundRect = function (x, y, width, height, cornerRadius = 0) {
    if (cornerRadius > width / 2) { cornerRadius = width / 2; }
    if (cornerRadius > height / 2) { cornerRadius = height / 2; }
    const w = width - cornerRadius * 2;
    const h = height - cornerRadius * 2;
    const pathString = `M${x + (width - w) / 2} ${y} h${w} A${cornerRadius} ${cornerRadius} 0 0 1 ${x + width} ${y + (height - h) / 2} v${h} A${cornerRadius} ${cornerRadius} 0 0 1 ${x + width - cornerRadius} ${y + height} h${-w} A${cornerRadius} ${cornerRadius} 0 0 1 ${x} ${y + height - cornerRadius} v${-h} A${cornerRadius} ${cornerRadius} 0 0 1 ${x + cornerRadius} ${y} `;
    return path(pathString);
  };
  const arrow = function (...args) {
    const shape = win.document.createElementNS(NS, "g");
    const tailPoly = win.document.createElementNS(NS, "polygon");
    const headPoly = win.document.createElementNS(NS, "polygon");
    const arrowPath = win.document.createElementNS(NS, "path");
    tailPoly.setAttributeNS(null, "class", "svg-arrow-tail");
    headPoly.setAttributeNS(null, "class", "svg-arrow-head");
    arrowPath.setAttributeNS(null, "class", "svg-arrow-path");
    tailPoly.setAttributeNS(null, "style", "stroke: none; pointer-events: none;");
    headPoly.setAttributeNS(null, "style", "stroke: none; pointer-events: none;");
    arrowPath.setAttributeNS(null, "style", "fill: none;");
    shape.appendChild(arrowPath);
    shape.appendChild(tailPoly);
    shape.appendChild(headPoly);
    shape.options = {
      head: { width: 0.5, height: 2, visible: false, padding: 0.0 },
      tail: { width: 0.5, height: 2, visible: false, padding: 0.0 },
      curve: 0.0,
      pinch: 0.618,
      endpoints: [],
    };
    setArrowPoints(shape, ...args);
    prepare("arrow", shape);
    shape.setPoints = (...a) => setArrowPoints(shape, ...a);
    return shape;
  };
  var primitives = Object.freeze({
    __proto__: null,
    line: line,
    circle: circle,
    ellipse: ellipse,
    rect: rect,
    polygon: polygon,
    polyline: polyline,
    path: path,
    bezier: bezier,
    text: text,
    arc: arc,
    wedge: wedge,
    arcEllipse: arcEllipse,
    wedgeEllipse: wedgeEllipse,
    parabola: parabola,
    regularPolygon: regularPolygon,
    roundRect: roundRect,
    arrow: arrow
  });
  const constructorsSVG = {};
  const constructorsGroup = {};
  const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomString = function (count = 0) {
    return Array.from(Array(count))
      .map(() => Math.floor(Math.random() * abc.length))
      .map(i => abc[i]).reduce((a, b) => `${a}${b}`, "");
  };
  const generateUUID = function (count = 16, prefix = "") {
    return prefix + randomString(count);
  };
  const svg = function () {
    const svgImage = win.document.createElementNS(NS, "svg");
    svgImage.setAttribute("version", "1.1");
    svgImage.setAttribute("xmlns", NS);
    prepare("svg", svgImage, constructorsSVG);
    return svgImage;
  };
  const group = function () {
    const g = win.document.createElementNS(NS, "g");
    prepare("group", g, constructorsGroup);
    return g;
  };
  const defs = function () {
    const d = win.document.createElementNS(NS, "defs");
    prepare("defs", d, constructorsGroup);
    return d;
  };
  const cdata = function (textContent) {
    const c = (new win.DOMParser())
      .parseFromString("<root></root>", "text/xml")
      .createCDATASection(`${textContent}`);
    return c;
  };
  const style = function (textContent) {
    const s = win.document.createElementNS(NS, "style");
    s.setAttribute("type", "text/css");
    prepare("style", s);
    s.setTextContent = (newText) => { s.textContent = ""; s.appendChild(cdata(newText)); };
    s.appendChild(cdata(textContent));
    return s;
  };
  const clipPath = function (id = generateUUID(8, "clip-")) {
    const clip = win.document.createElementNS(NS, "clipPath");
    clip.setAttribute("id", id);
    prepare("clipPath", clip, constructorsGroup);
    return clip;
  };
  const mask = function (id = generateUUID(8, "mask-")) {
    const msk = win.document.createElementNS(NS, "mask");
    msk.setAttribute("id", id);
    prepare("mask", msk, constructorsGroup);
    return msk;
  };
  const createElement = function (tagName) {
    return win.document.createElementNS(NS, tagName);
  };
  const setConstructors = function (elements) {
    Object.keys(elements)
      .filter(key => key !== "svg")
      .forEach((key) => { constructorsSVG[key] = elements[key]; });
    Object.keys(elements)
      .filter(key => key !== "svg")
      .filter(key => key !== "defs")
      .filter(key => key !== "style")
      .filter(key => key !== "clipPath")
      .filter(key => key !== "mask")
      .forEach((key) => { constructorsGroup[key] = elements[key]; });
  };
  var root = Object.freeze({
    __proto__: null,
    setConstructors: setConstructors,
    svg: svg,
    group: group,
    defs: defs,
    clipPath: clipPath,
    mask: mask,
    style: style,
    createElement: createElement
  });
  const findWindowBooleanParam = function (...params) {
    const objects = params
      .filter(arg => typeof arg === "object")
      .filter(o => typeof o.window === "boolean");
    return objects.reduce((a, b) => a.window || b.window, false);
  };
  const findElementInParams = function (...params) {
    const element = params.filter(arg => arg instanceof HTMLElement).shift();
    const idElement = params
      .filter(a => typeof a === "string" || a instanceof String)
      .map(str => win.document.getElementById(str))
      .shift();
    if (element != null) { return element; }
    return (idElement != null
      ? idElement
      : win.document.body);
  };
  const initSize = function (svgElement, params) {
    const numbers = params.filter(arg => !isNaN(arg));
    const viewBox = svgElement.getAttribute("viewBox");
    if (numbers.length >= 2) {
      svgElement.setAttributeNS(null, "width", numbers[0]);
      svgElement.setAttributeNS(null, "height", numbers[1]);
      setViewBox(svgElement, 0, 0, numbers[0], numbers[1]);
    } else if (viewBox == null) {
      const frame = svgElement.getBoundingClientRect();
      setViewBox(svgElement, 0, 0, frame.width, frame.height);
    } else if (viewBox.split(" ").filter(n => n === "0" || n === 0).length === 4) {
      const frame = svgElement.getBoundingClientRect();
      setViewBox(svgElement, 0, 0, frame.width, frame.height);
    }
  };
  const getWidth = function (element) {
    const viewBox = getViewBox(element);
    if (viewBox == null) { return undefined; }
    return viewBox[2];
  };
  const getHeight = function (element) {
    const viewBox = getViewBox(element);
    if (viewBox == null) { return undefined; }
    return viewBox[3];
  };
  const setWidth = function (element, w) {
    const viewBox = getViewBox(element);
    viewBox[2] = w;
    return setViewBox(element, ...viewBox);
  };
  const setHeight = function (element, h) {
    const viewBox = getViewBox(element);
    viewBox[3] = h;
    return setViewBox(element, ...viewBox);
  };
  const size = function (element, ...args) {
    if (args.length === 2
      && typeof args[0] === "number"
      && typeof args[1] === "number"
    ) {
      setViewBox(element, 0, 0, ...args);
    } else if (args.length === 4
      && typeof args.map(a => typeof a === "number")
        .reduce((a, b) => a && b, true)
    ) {
      setViewBox(element, ...args);
    }
  };
  const getFrame = function (element) {
    let frame = [0, 0, 0, 0];
    if (element.viewBox != null) {
      const viewBox = element.viewBox.baseVal;
      frame = [viewBox.x, viewBox.y, viewBox.width, viewBox.height];
    } else if (typeof element.getBoundingClientRect === "function") {
      const rr = element.getBoundingClientRect();
      frame = [rr.x, rr.y, rr.width, rr.height];
    }
    return frame;
  };
  const background = function (element, color, setParent = false) {
    if (setParent === true) {
      const parent = element.parentElement;
      if (parent != null) {
        parent.setAttribute("style", `background-color: ${color}`);
      }
    }
    let backRect = Array.from(element.childNodes)
      .filter(child => child.getAttribute("class") === "svg-background-rectangle")
      .shift();
    if (backRect != null) {
      backRect.setAttribute("fill", color);
    } else {
      backRect = rect(...getFrame(element))
        .fill(color)
        .setClass("svg-background-rectangle");
      element.insertBefore(backRect, element.firstChild);
    }
  };
  const findStyleSheet = function (element) {
    const children = Array.from(element.childNodes);
    const topLevel = children
      .filter(child => child.getAttribute("tagName") === "style")
      .shift();
    if (topLevel) { return topLevel; }
    const defs = children
      .filter(child => child.getAttribute("tagName") === "defs")
      .shift();
    if (defs == null) { return defs; }
    const insideDefs = Array.from(defs.childNodes)
      .filter(child => child.getAttribute("tagName") === "style")
      .shift();
    if (insideDefs != null) { return insideDefs; }
    return undefined;
  };
  const stylesheet = function (element, textContent) {
    let styleSection = findStyleSheet(element);
    if (styleSection == null) {
      styleSection = style(textContent);
      element.insertBefore(styleSection, element.firstChild);
    } else {
      styleSection.setTextContent(textContent);
    }
    return styleSection;
  };
  const replaceWithSVG = function (oldSVG, newSVG) {
    Array.from(oldSVG.attributes)
      .forEach(attr => oldSVG.removeAttribute(attr.name));
    removeChildren(oldSVG);
    Array.from(newSVG.children).forEach((node) => {
      node.remove();
      oldSVG.appendChild(node);
    });
    Array.from(newSVG.attributes)
      .forEach(attr => oldSVG.setAttribute(attr.name, attr.value));
  };
  const SVG = function (...params) {
    const element = svg();
    Events(element);
    element.controls = (...args) => controls(element, ...args);
    element.getWidth = () => getWidth(element);
    element.getHeight = () => getHeight(element);
    element.setWidth = (...args) => setWidth(element, ...args);
    element.setHeight = (...args) => setHeight(element, ...args);
    element.background = (...args) => background(element, ...args);
    element.size = (...args) => size(element, ...args);
    element.save = function (filename = "image.svg") {
      return save(element, filename);
    };
    element.load = function (data, callback) {
      load(data, (newSVG, error) => {
        if (newSVG != null) { replaceWithSVG(element, newSVG); }
        if (callback != null) { callback(element, error); }
      });
    };
    element.stylesheet = textContent => stylesheet(element, textContent);
    const initialize = function () {
      const parent = findElementInParams(...params);
      if (parent != null) { parent.appendChild(element); }
      initSize(element, params);
      if (findWindowBooleanParam(...params)) {
        globalize(element);
      }
      params.filter(arg => typeof arg === "function")
        .forEach(func => func());
    };
    if (win.document.readyState === "loading") {
      win.document.addEventListener("DOMContentLoaded", initialize);
    } else {
      initialize();
    }
    return element;
  };
  const constructors = {};
  Object.assign(constructors, root, primitives);
  delete constructors.setConstructors;
  setConstructors(constructors);
  const elements = {};
  Object.keys(primitives).forEach((key) => { elements[key] = primitives[key]; });
  Object.keys(root)
    .filter(key => key !== "setConstructors")
    .forEach((key) => { elements[key] = root[key]; });
  delete elements.svg;
  Object.keys(elements).forEach((key) => { SVG[key] = elements[key]; });
  Object.keys(geometryMods).forEach((key) => { SVG[key] = geometryMods[key]; });
  Object.keys(ViewBox).forEach((key) => { SVG[key] = ViewBox[key]; });
  Object.keys(File).forEach((key) => { SVG[key] = File[key]; });
  SVG.NS = NS;

  const make_vertices_edges = function ({ edges_vertices }) {
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
  const make_edges_faces = function ({
    edges_vertices, faces_edges
  }) {
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
  const make_edges_length = function (graph) {
    return graph.edges_vertices
      .map(ev => ev.map(v => graph.vertices_coords[v]))
      .map(edge => math.core.distance(...edge));
  };
  const assignment_angles = {
    M: -180,
    m: -180,
    V: 180,
    v: 180
  };
  const make_edges_foldAngle = function ({ edges_assignment }) {
    return edges_assignment.map(a => assignment_angles[a] || 0);
  };
  const make_vertex_pair_to_edge_map$1 = function ({ edges_vertices }) {
    const map = {};
    edges_vertices
      .map(ev => ev.sort((a, b) => a - b).join(" "))
      .forEach((key, i) => { map[key] = i; });
    return map;
  };
  const make_vertices_faces = function ({
    vertices_coords, faces_vertices
  }) {
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
    const edge_map = make_vertex_pair_to_edge_map$1(graph);
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
    if (graph.vertices_coords == null) { return undefined; }
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
      .multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]])
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
  const faces_coloring_from_faces_matrix = function (faces_matrix) {
    return faces_matrix
      .map(m => m[0] * m[3] - m[1] * m[2])
      .map(c => c >= 0);
  };

  var make = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_vertices_edges: make_vertices_edges,
    make_edges_vertices: make_edges_vertices,
    make_faces_faces: make_faces_faces,
    make_edges_faces: make_edges_faces,
    make_edges_length: make_edges_length,
    make_edges_foldAngle: make_edges_foldAngle,
    make_vertex_pair_to_edge_map: make_vertex_pair_to_edge_map$1,
    make_vertices_faces: make_vertices_faces,
    make_face_walk_tree: make_face_walk_tree,
    make_faces_matrix: make_faces_matrix,
    make_faces_matrix_inv: make_faces_matrix_inv,
    make_vertices_coords_folded: make_vertices_coords_folded,
    make_vertices_isBoundary: make_vertices_isBoundary,
    faces_coloring_from_faces_matrix: faces_coloring_from_faces_matrix
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
  const implied_vertices_count = function ({
    faces_vertices, edges_vertices
  }) {
    let max = 0;
    [faces_vertices, edges_vertices]
      .filter(a => a !== undefined)
      .forEach(arr => arr
        .forEach(el => el
          .forEach((e) => {
            if (e > max) { max = e; }
          })));
    return max;
  };
  const implied_edges_count = function ({
    faces_edges, vertices_edges, edgeOrders
  }) {
    let max = 0;
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
    return max;
  };
  const implied_faces_count = function ({
    vertices_faces, edges_faces, facesOrders
  }) {
    let max = 0;
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
    return max;
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
      .map(m => math.core.multiply_vector2_matrix2(point, m));
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
      faces = Array.from(Array(faces_count(graph)))
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
    vertices_count: vertices_count,
    edges_count: edges_count,
    faces_count: faces_count,
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
  const get_geometry_length = {
    vertices: vertices_count$1,
    edges: edges_count$1,
    faces: faces_count$1
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

  var remove = /*#__PURE__*/Object.freeze({
    __proto__: null,
    'default': remove_geometry_key_indices
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
  const get_boundary = function ({
    edges_vertices, edges_assignment
  }) {
    const edges_vertices_b = edges_assignment
      .map(a => a === "B" || a === "b");
    const vertices_edges = make_vertices_edges({ edges_vertices });
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
    vertex_walk.push(edges_vertices[edgeIndex][0]);
    let nextVertex = edges_vertices[edgeIndex][1];
    while (vertex_walk[0] !== nextVertex) {
      vertex_walk.push(nextVertex);
      edgeIndex = vertices_edges[nextVertex]
        .filter(v => edges_vertices_b[v])
        .shift();
      if (edgeIndex === undefined) { return { vertices: [], edges: [] }; }
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
      .map(m => math.core.multiply_vector2_matrix2(params.points[1], m));
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
        .map(p => math.core.multiply_vector2_matrix2(p, m)))
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
    const reflected = math.core.multiply_vector2_matrix2(params.points[0], m);
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
    switch (number) {
      case 1:
      case 2: {
        const flat = math.core.semi_flatten_input(...args);
        if (flat.length === 4) {
          return flat;
        }
        if (flat.length === 2) {
          if (flat[0].length > 1 && flat[1].length > 1) {
            return [flat[0][0], flat[0][1], flat[1][0], flat[1][1]];
          }
        }
      }
        break;
      case 3: {
        const flat = math.core.semi_flatten_input(...args);
        if (flat.length === 8) {
          return flat;
        }
        if (flat.length === 4) {
          if (flat[0].length >= 2 && flat[1].length >= 2 && flat[2].length >= 2 && flat[3].length >= 2) {
            return [flat[0][0], flat[0][1], flat[1][0], flat[1][1], flat[2][0], flat[2][1], flat[3][0], flat[3][1]];
          }
        }
        if (flat.length === 2) {
          if (flat[0].length >= 4 && flat[1].length >= 4) {
            return [flat[0][0], flat[0][1], flat[0][2], flat[0][3], flat[1][0], flat[1][1], flat[1][2], flat[1][3]];
          }
          return [...math.core.flatten_input(flat[0]), ...math.core.flatten_input(flat[1])];
        }
      }
        break;
      case 4: break;
      case 5: break;
      case 6: break;
      case 7: break;
      default: break;
    }
    return args;
  };

  const axiom1 = function (x1, y1, x2, y2) {
    const point = [x1, y1];
    const vector = math.core.normalize([x2 - x1, y2 - y1]);
    const solution = [point, vector];
    const parameters = { points: [[x1, y1], [x2, y2]] };
    return make_axiom_frame(1, [solution], parameters);
  };
  const axiom2 = function (x1, y1, x2, y2) {
    const mid = [(x1 + x2) / 2, (y1 + y2) / 2];
    const vec = math.core.normalize([x2 - x1, y2 - y1]);
    const solution = [mid, [vec[1], -vec[0]]];
    const parameters = { points: [[x1, y1], [x2, y2]] };
    return make_axiom_frame(2, [solution], parameters);
  };
  const axiom3 = function (pt1x, pt1y, vec1x, vec1y, pt2x, pt2y, vec2x, vec2y) {
    const parameters = {
      lines: [[[pt1x, pt1y], [vec1x, vec1y]], [[pt2x, pt2y], [vec2x, vec2y]]]
    };
    const solutions = math.core.bisect_lines2([pt1x, pt1y], [vec1x, vec1y], [pt2x, pt2y], [vec2x, vec2y]);
    return make_axiom_frame(3, solutions, parameters);
  };
  const axiom4 = function (pointA, vectorA, pointB) {
    const norm = math.core.normalize(vectorA);
    const solution = [[...pointB], [norm[1], -norm[0]]];
    const parameters = { points: [pointB], lines: [[pointA, vectorA]] };
    return make_axiom_frame(4, [solution], parameters);
  };
  const axiom5 = function (pointA, vectorA, pointB, pointC) {
    const pA = math.core.get_vector(pointA);
    const vA = math.core.get_vector(vectorA);
    const pB = math.core.get_vector(pointB);
    const pC = math.core.get_vector(pointC);
    const radius = Math.sqrt(((pB[0] - pC[0]) ** 2) + ((pB[1] - pC[1]) ** 2));
    const pA2 = [pA[0] + vA[0], pA[1] + vA[1]];
    const sect = math.core.intersection.circle_line(pB, radius, pA, pA2) || [];
    const solutions = sect.map((s) => {
      const mid = math.core.midpoint2(pC, s);
      const vec = math.core.normalize(s.map((_, i) => s[i] - pC[i]));
      return [mid, [-vec[1], vec[0]]];
    });
    const parameters = { points: [pB, pC], lines: [[pA, vA]] };
    return make_axiom_frame(5, solutions, parameters);
  };
  const axiom7 = function (pointA, vectorA, pointB, vectorB, pointC) {
    const pA = math.core.get_vector(pointA);
    const pB = math.core.get_vector(pointB);
    const pC = math.core.get_vector(pointC);
    const vA = math.core.get_vector(vectorA);
    const vB = math.core.get_vector(vectorB);
    const parameters = { points: [pC], lines: [[pA, vA], [pB, vB]] };
    const sect = math.core.intersection.line_line(pA, vA, pC, vB);
    if (sect === undefined) {
      return make_axiom_frame(7, parameters, []);
    }
    const mid = math.core.midpoint2(pC, sect);
    const vec = math.core.normalize(pC.map((_, i) => sect[i] - pC[i]));
    const solution = [mid, [-vec[1], vec[0]]];
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
          solutions.push([[0, hF], [1, mF]]);
        }
        else {
          var kG = (u2 + p2)/2;
          solutions.push([[kG, 0], [0, 1]]);
        }
      }
    }
    const parameters = {
      points: [pointC, pointD],
      lines: [[pointA, vecA], [pointB, vecB]]
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
  const axiom = function (number, ...args) {
    const params = Params(number, ...args);
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
      "faces_edges"
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
  const assignment_angles$1 = {
    M: -180,
    m: -180,
    V: 180,
    v: 180
  };
  const edge_assignment_to_foldAngle = function (assignment) {
    return assignment_angles$1[assignment] || 0;
  };
  const get_geometry_keys_with_prefix = function (graph, key) {
    const prefix = `${key}_`;
    return Object.keys(graph)
      .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
      .filter(str => str !== undefined);
  };
  const get_geometry_keys_with_suffix = function (graph, key) {
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
  const transpose_geometry_arrays = function (graph, geometry_key) {
    const matching_keys = get_geometry_keys_with_prefix(graph, geometry_key);
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
  const transpose_geometry_array_at_index = function (
    graph,
    geometry_key,
    index
  ) {
    const matching_keys = get_geometry_keys_with_prefix(graph, geometry_key);
    if (matching_keys.length === 0) { return []; }
    const geometry = {};
    matching_keys
      .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
      .forEach((key) => { geometry[key.short] = graph[key.long][index]; });
    return geometry;
  };

  var keys$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    future_spec: future_spec,
    fold_keys: fold_keys,
    file_classes: file_classes,
    frame_classes: frame_classes,
    frame_attributes: frame_attributes,
    keys: keys,
    edges_assignment_values: edges_assignment_values,
    edges_assignment_names: edges_assignment_names,
    edge_assignment_to_foldAngle: edge_assignment_to_foldAngle,
    get_geometry_keys_with_prefix: get_geometry_keys_with_prefix,
    get_geometry_keys_with_suffix: get_geometry_keys_with_suffix,
    get_keys_with_ending: get_keys_with_ending,
    transpose_geometry_arrays: transpose_geometry_arrays,
    transpose_geometry_array_at_index: transpose_geometry_array_at_index
  });

  const apply_matrix_to_fold = function (fold, matrix) {
    get_keys_with_ending("coords").forEach((key) => {
      fold[key] = fold[key]
        .map(v => math.core.multiply_vector2_matrix2(v, matrix));
    });
    get_keys_with_ending("matrix").forEach((key) => {
      fold[key] = fold[key]
        .map(m => math.core.multiply_matrices2(m, matrix));
    });
  };
  const transform_scale = function (fold, ratio, homothetic_center) {
    const matrix = math.core.make_matrix2_scale(ratio, homothetic_center);
    apply_matrix_to_fold(fold, matrix);
  };
  const transform_translate = function (fold, dx, dy) {
    const matrix = math.core.make_matrix2_translation(dx, dy);
    apply_matrix_to_fold(fold, matrix);
  };
  const transform_matrix = function (fold, matrix) {
    apply_matrix_to_fold(fold, matrix);
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

  const flatten_frame = function (fold_file, frame_num) {
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
    flatten_frame: flatten_frame,
    merge_frame: merge_frame
  });

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

  var collinear = /*#__PURE__*/Object.freeze({
    __proto__: null,
    collinear_vertices: collinear_vertices,
    collinear_edges: collinear_edges
  });

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
  const possibleFoldObject = function (fold) {
    if (typeof fold !== "object" || fold === null) { return false; }
    const argKeys = Object.keys(fold);
    for (let i = 0; i < argKeys.length; i += 1) {
      if (keys.includes(argKeys[i])) { return true; }
    }
    return false;
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

  const equivalent_vertices = function (a, b, epsilon = math.core.EPSILON) {
    for (let i = 0; i < a.length; i += 1) {
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
    for (let i = 0; i < edges.length - 1; i += 1) {
      for (let j = i + 1; j < edges.length; j += 1) {
        crossings[i][j] = math.core.intersection.segment_segment_exclusive(
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
        vertices_equivalent[i][j] = equivalent_vertices(
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
      flat.edges_foldAngle = edge_map_cl
        .map((i, j) => (graph.edges_foldAngle[i] || edge_assignment_to_foldAngle(flat.edges_assignment[j])));
    }
    const vertices_remove_indices = vertices_remove
      .map((rm, i) => (rm ? i : undefined))
      .filter(i => i !== undefined);
    remove_geometry_key_indices(flat, "vertices", vertices_remove_indices);
    return flat;
  };

  const clean_abstract_graph = function (graph) {
  };
  const clean_vertices_coords = function (graph) {
    if (graph.vertices_coords.length === 0) { return; }
    graph.vertices_coords = graph.vertices_coords
      .map(vert => vert
        .map(num => parseFloat(num)));
    graph.vertices_coords.forEach((vert, v) => vert.forEach((num, n) => {
      if (isNaN(num) || num == null) {
        delete graph.vertices_coords[v][n];
      }
    }));
  };
  const clean = function (fold) {
    const graph = clone(fold);
    if (graph.vertices_coords == null || graph.vertices_coords.length === 0) {
      return clean_abstract_graph();
    }
    if (!Validate.vertices_coords(graph)) {
      clean_vertices_coords(graph);
    }
    convert.edges_vertices_to_vertices_vertices_sorted(graph);
    convert.vertices_vertices_to_faces_vertices(graph);
    graph.faces_edges = convert.faces_vertices_to_faces_edges(graph);
    graph.edges_faces = make_edges_faces(graph);
    graph.vertices_faces = make_vertices_faces(graph);
    graph.edges_length = make_edges_length(graph);
    graph.faces_faces = make_faces_faces(graph);
    graph.vertices_edges = make_vertices_edges(graph);
    if (graph.edges_assignment != null) {
      graph.edges_foldAngle = make_edges_foldAngle(graph);
    }
    return graph;
  };

  const htmlString$1 = "<!DOCTYPE html><title> </title>";
  const win$1 = isNode ? {} : window;
  if (isNode) {
    const { DOMParser, XMLSerializer } = require("xmldom");
    win$1.DOMParser = DOMParser;
    win$1.XMLSerializer = XMLSerializer;
    win$1.document = new DOMParser().parseFromString(htmlString$1, "text/html");
  }

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
  const load$1 = function (...args) {
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
            data: (new win$1.DOMParser())
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
        if (possibleFoldObject(fold)) {
          return { data: fold, type: "fold" };
        }
      } catch (err) {
        const xml = (new win$1.DOMParser())
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

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }
    return _typeof(obj);
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
      return arr2;
    }
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }
  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }
  var make_vertices_edges$1 = function make_vertices_edges(graph) {
    var vertices_edges = graph.vertices_coords.map(function () {
      return [];
    });
    graph.edges_vertices.forEach(function (ev, i) {
      return ev.forEach(function (v) {
        return vertices_edges[v].push(i);
      });
    });
    return vertices_edges;
  };
  var get_boundary$1 = function get_boundary(graph) {
    var edges_vertices_b = graph.edges_assignment.map(function (a) {
      return a === "B" || a === "b";
    });
    var vertices_edges = make_vertices_edges$1(graph);
    var edge_walk = [];
    var vertex_walk = [];
    var edgeIndex = -1;
    for (var i = 0; i < edges_vertices_b.length; i += 1) {
      if (edges_vertices_b[i]) {
        edgeIndex = i;
        break;
      }
    }
    if (edgeIndex === -1) {
      return {
        vertices: [],
        edges: []
      };
    }
    edges_vertices_b[edgeIndex] = false;
    edge_walk.push(edgeIndex);
    vertex_walk.push(graph.edges_vertices[edgeIndex][0]);
    var nextVertex = graph.edges_vertices[edgeIndex][1];
    while (vertex_walk[0] !== nextVertex) {
      vertex_walk.push(nextVertex);
      edgeIndex = vertices_edges[nextVertex].filter(function (v) {
        return edges_vertices_b[v];
      }).shift();
      if (edgeIndex === undefined) {
        return {
          vertices: [],
          edges: []
        };
      }
      if (graph.edges_vertices[edgeIndex][0] === nextVertex) {
        var _graph$edges_vertices = _slicedToArray(graph.edges_vertices[edgeIndex], 2);
        nextVertex = _graph$edges_vertices[1];
      } else {
        var _graph$edges_vertices2 = _slicedToArray(graph.edges_vertices[edgeIndex], 1);
        nextVertex = _graph$edges_vertices2[0];
      }
      edges_vertices_b[edgeIndex] = false;
      edge_walk.push(edgeIndex);
    }
    return {
      vertices: vertex_walk,
      edges: edge_walk
    };
  };
  var bounding_rect$1 = function bounding_rect(graph) {
    if ("vertices_coords" in graph === false || graph.vertices_coords.length <= 0) {
      return [0, 0, 0, 0];
    }
    var dimension = graph.vertices_coords[0].length;
    var min = Array(dimension).fill(Infinity);
    var max = Array(dimension).fill(-Infinity);
    graph.vertices_coords.forEach(function (v) {
      return v.forEach(function (n, i) {
        if (n < min[i]) {
          min[i] = n;
        }
        if (n > max[i]) {
          max[i] = n;
        }
      });
    });
    return isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1]) ? [0, 0, 0, 0] : [min[0], min[1], max[0] - min[0], max[1] - min[1]];
  };
  var make_faces_faces$1 = function make_faces_faces(graph) {
    var nf = graph.faces_vertices.length;
    var faces_faces = Array.from(Array(nf)).map(function () {
      return [];
    });
    var edgeMap = {};
    graph.faces_vertices.forEach(function (vertices_index, idx1) {
      if (vertices_index === undefined) {
        return;
      }
      var n = vertices_index.length;
      vertices_index.forEach(function (v1, i, vs) {
        var v2 = vs[(i + 1) % n];
        if (v2 < v1) {
          var _ref = [v2, v1];
          v1 = _ref[0];
          v2 = _ref[1];
        }
        var key = "".concat(v1, " ").concat(v2);
        if (key in edgeMap) {
          var idx2 = edgeMap[key];
          faces_faces[idx1].push(idx2);
          faces_faces[idx2].push(idx1);
        } else {
          edgeMap[key] = idx1;
        }
      });
    });
    return faces_faces;
  };
  var faces_coloring_from_faces_matrix$1 = function faces_coloring_from_faces_matrix(faces_matrix) {
    return faces_matrix.map(function (m) {
      return m[0] * m[3] - m[1] * m[2];
    }).map(function (c) {
      return c >= 0;
    });
  };
  var faces_coloring = function faces_coloring(graph) {
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var coloring = [];
    coloring[root_face] = true;
    make_face_walk_tree$1(graph, root_face).forEach(function (level, i) {
      level.forEach(function (entry) {
        coloring[entry.face] = i % 2 === 0;
      });
    });
    return coloring;
  };
  var make_face_walk_tree$1 = function make_face_walk_tree(graph) {
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var edge_map = make_vertex_pair_to_edge_map(graph);
    var new_faces_faces = make_faces_faces$1(graph);
    if (new_faces_faces.length <= 0) {
      return [];
    }
    var visited = [root_face];
    var list = [[{
      face: root_face,
      parent: undefined,
      edge: undefined,
      level: 0
    }]];
    do {
      list[list.length] = list[list.length - 1].map(function (current) {
        var unique_faces = new_faces_faces[current.face].filter(function (f) {
          return visited.indexOf(f) === -1;
        });
        visited = visited.concat(unique_faces);
        return unique_faces.map(function (f) {
          var edge_vertices = graph.faces_vertices[f].filter(function (v) {
            return graph.faces_vertices[current.face].indexOf(v) !== -1;
          }).sort(function (a, b) {
            return a - b;
          });
          var edge = edge_map[edge_vertices.join(" ")];
          return {
            face: f,
            parent: current.face,
            edge: edge,
            edge_vertices: edge_vertices
          };
        });
      }).reduce(function (prev, curr) {
        return prev.concat(curr);
      }, []);
    } while (list[list.length - 1].length > 0);
    if (list.length > 0 && list[list.length - 1].length === 0) {
      list.pop();
    }
    return list;
  };
  var clone$1 = function clone(o) {
    var newO;
    var i;
    if (_typeof(o) !== "object") {
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
  var flatten_frame$1 = function flatten_frame(fold_file, frame_num) {
    if ("file_frames" in fold_file === false || fold_file.file_frames.length < frame_num) {
      return fold_file;
    }
    var dontCopy = ["frame_parent", "frame_inherit"];
    var memo = {
      visited_frames: []
    };
    var recurse = function recurse(recurse_fold, frame, orderArray) {
      if (memo.visited_frames.indexOf(frame) !== -1) {
        throw new Error("encountered a cycle in file_frames. can't flatten.");
      }
      memo.visited_frames.push(frame);
      orderArray = [frame].concat(orderArray);
      if (frame === 0) {
        return orderArray;
      }
      if (recurse_fold.file_frames[frame - 1].frame_inherit && recurse_fold.file_frames[frame - 1].frame_parent != null) {
        return recurse(recurse_fold, recurse_fold.file_frames[frame - 1].frame_parent, orderArray);
      }
      return orderArray;
    };
    return recurse(fold_file, frame_num, []).map(function (frame) {
      if (frame === 0) {
        var swap = fold_file.file_frames;
        fold_file.file_frames = null;
        var copy = clone$1(fold_file);
        fold_file.file_frames = swap;
        delete copy.file_frames;
        dontCopy.forEach(function (key) {
          return delete copy[key];
        });
        return copy;
      }
      var outerCopy = clone$1(fold_file.file_frames[frame - 1]);
      dontCopy.forEach(function (key) {
        return delete outerCopy[key];
      });
      return outerCopy;
    }).reduce(function (prev, curr) {
      return Object.assign(prev, curr);
    }, {});
  };
  var isBrowser$2 = typeof window !== "undefined" && typeof window.document !== "undefined";
  var isNode$2 = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
  var isWebWorker = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";
  var htmlString$2 = "<!DOCTYPE html><title>a</title>";
  var win$2 = !isNode$2 && isBrowser$2 ? window : {};
  if (isNode$2) {
    var _require = require("xmldom"),
        DOMParser$1 = _require.DOMParser,
        XMLSerializer$1 = _require.XMLSerializer;
    win$2.DOMParser = DOMParser$1;
    win$2.XMLSerializer = XMLSerializer$1;
    win$2.document = new DOMParser$1().parseFromString(htmlString$2, "text/html");
  }
  var svgNS = "http://www.w3.org/2000/svg";
  var svg$1 = function svg() {
    var svgImage = win$2.document.createElementNS(svgNS, "svg");
    svgImage.setAttribute("version", "1.1");
    svgImage.setAttribute("xmlns", svgNS);
    return svgImage;
  };
  var group$1 = function group() {
    var g = win$2.document.createElementNS(svgNS, "g");
    return g;
  };
  var style$1 = function style() {
    var s = win$2.document.createElementNS(svgNS, "style");
    s.setAttribute("type", "text/css");
    return s;
  };
  var setViewBox$1 = function setViewBox(SVG, x, y, width, height) {
    var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var scale = 1.0;
    var d = width / scale - width;
    var X = x - d - padding;
    var Y = y - d - padding;
    var W = width + d * 2 + padding * 2;
    var H = height + d * 2 + padding * 2;
    var viewBoxString = [X, Y, W, H].join(" ");
    SVG.setAttributeNS(null, "viewBox", viewBoxString);
  };
  var line$1 = function line(x1, y1, x2, y2) {
    var shape = win$2.document.createElementNS(svgNS, "line");
    shape.setAttributeNS(null, "x1", x1);
    shape.setAttributeNS(null, "y1", y1);
    shape.setAttributeNS(null, "x2", x2);
    shape.setAttributeNS(null, "y2", y2);
    return shape;
  };
  var circle$1 = function circle(x, y, radius) {
    var shape = win$2.document.createElementNS(svgNS, "circle");
    shape.setAttributeNS(null, "cx", x);
    shape.setAttributeNS(null, "cy", y);
    shape.setAttributeNS(null, "r", radius);
    return shape;
  };
  var polygon$1 = function polygon(pointsArray) {
    var shape = win$2.document.createElementNS(svgNS, "polygon");
    var pointsString = pointsArray.reduce(function (a, b) {
      return "".concat(a).concat(b[0], ",").concat(b[1], " ");
    }, "");
    shape.setAttributeNS(null, "points", pointsString);
    return shape;
  };
  var bezier$1 = function bezier(fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
    var pts = [[fromX, fromY], [c1X, c1Y], [c2X, c2Y], [toX, toY]].map(function (p) {
      return p.join(",");
    });
    var d = "M ".concat(pts[0], " C ").concat(pts[1], " ").concat(pts[2], " ").concat(pts[3]);
    var shape = win$2.document.createElementNS(svgNS, "path");
    shape.setAttributeNS(null, "d", d);
    return shape;
  };
  var arcArrow = function arcArrow(start, end, options) {
    var p = {
      color: "#000",
      strokeWidth: 0.5,
      width: 0.5,
      length: 2,
      bend: 0.3,
      pinch: 0.618,
      padding: 0.5,
      side: true,
      start: false,
      end: true,
      strokeStyle: "",
      fillStyle: ""
    };
    if (_typeof(options) === "object" && options !== null) {
      Object.assign(p, options);
    }
    var arrowFill = ["stroke:none", "fill:".concat(p.color), p.fillStyle].filter(function (a) {
      return a !== "";
    }).join(";");
    var arrowStroke = ["fill:none", "stroke:".concat(p.color), "stroke-width:".concat(p.strokeWidth), p.strokeStyle].filter(function (a) {
      return a !== "";
    }).join(";");
    var startPoint = start;
    var endPoint = end;
    var vector = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]];
    var midpoint = [startPoint[0] + vector[0] / 2, startPoint[1] + vector[1] / 2];
    var len = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
    var minLength = (p.start ? 1 + p.padding : 0 + p.end ? 1 + p.padding : 0) * p.length * 2.5;
    if (len < minLength) {
      var minVec = [vector[0] / len * minLength, vector[1] / len * minLength];
      startPoint = [midpoint[0] - minVec[0] * 0.5, midpoint[1] - minVec[1] * 0.5];
      endPoint = [midpoint[0] + minVec[0] * 0.5, midpoint[1] + minVec[1] * 0.5];
      vector = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]];
    }
    var perpendicular = [vector[1], -vector[0]];
    var bezPoint = [midpoint[0] + perpendicular[0] * (p.side ? 1 : -1) * p.bend, midpoint[1] + perpendicular[1] * (p.side ? 1 : -1) * p.bend];
    var bezStart = [bezPoint[0] - startPoint[0], bezPoint[1] - startPoint[1]];
    var bezEnd = [bezPoint[0] - endPoint[0], bezPoint[1] - endPoint[1]];
    var bezStartLen = Math.sqrt(bezStart[0] * bezStart[0] + bezStart[1] * bezStart[1]);
    var bezEndLen = Math.sqrt(bezEnd[0] * bezEnd[0] + bezEnd[1] * bezEnd[1]);
    var bezStartNorm = [bezStart[0] / bezStartLen, bezStart[1] / bezStartLen];
    var bezEndNorm = [bezEnd[0] / bezEndLen, bezEnd[1] / bezEndLen];
    var startHeadVec = [-bezStartNorm[0], -bezStartNorm[1]];
    var endHeadVec = [-bezEndNorm[0], -bezEndNorm[1]];
    var startNormal = [startHeadVec[1], -startHeadVec[0]];
    var endNormal = [endHeadVec[1], -endHeadVec[0]];
    var arcStart = [startPoint[0] + bezStartNorm[0] * p.length * ((p.start ? 1 : 0) + p.padding), startPoint[1] + bezStartNorm[1] * p.length * ((p.start ? 1 : 0) + p.padding)];
    var arcEnd = [endPoint[0] + bezEndNorm[0] * p.length * ((p.end ? 1 : 0) + p.padding), endPoint[1] + bezEndNorm[1] * p.length * ((p.end ? 1 : 0) + p.padding)];
    vector = [arcEnd[0] - arcStart[0], arcEnd[1] - arcStart[1]];
    perpendicular = [vector[1], -vector[0]];
    midpoint = [arcStart[0] + vector[0] / 2, arcStart[1] + vector[1] / 2];
    bezPoint = [midpoint[0] + perpendicular[0] * (p.side ? 1 : -1) * p.bend, midpoint[1] + perpendicular[1] * (p.side ? 1 : -1) * p.bend];
    var controlStart = [arcStart[0] + (bezPoint[0] - arcStart[0]) * p.pinch, arcStart[1] + (bezPoint[1] - arcStart[1]) * p.pinch];
    var controlEnd = [arcEnd[0] + (bezPoint[0] - arcEnd[0]) * p.pinch, arcEnd[1] + (bezPoint[1] - arcEnd[1]) * p.pinch];
    var startHeadPoints = [[arcStart[0] + startNormal[0] * -p.width, arcStart[1] + startNormal[1] * -p.width], [arcStart[0] + startNormal[0] * p.width, arcStart[1] + startNormal[1] * p.width], [arcStart[0] + startHeadVec[0] * p.length, arcStart[1] + startHeadVec[1] * p.length]];
    var endHeadPoints = [[arcEnd[0] + endNormal[0] * -p.width, arcEnd[1] + endNormal[1] * -p.width], [arcEnd[0] + endNormal[0] * p.width, arcEnd[1] + endNormal[1] * p.width], [arcEnd[0] + endHeadVec[0] * p.length, arcEnd[1] + endHeadVec[1] * p.length]];
    var arrowGroup = win$2.document.createElementNS(svgNS, "g");
    var arrowArc = bezier$1(arcStart[0], arcStart[1], controlStart[0], controlStart[1], controlEnd[0], controlEnd[1], arcEnd[0], arcEnd[1]);
    arrowArc.setAttribute("style", arrowStroke);
    arrowGroup.appendChild(arrowArc);
    if (p.start) {
      var startHead = polygon$1(startHeadPoints);
      startHead.setAttribute("style", arrowFill);
      arrowGroup.appendChild(startHead);
    }
    if (p.end) {
      var endHead = polygon$1(endHeadPoints);
      endHead.setAttribute("style", arrowFill);
      arrowGroup.appendChild(endHead);
    }
    return arrowGroup;
  };
  var CREASE_NAMES = {
    B: "boundary",
    b: "boundary",
    M: "mountain",
    m: "mountain",
    V: "valley",
    v: "valley",
    F: "mark",
    f: "mark",
    U: "mark",
    u: "mark"
  };
  var faces_sorted_by_layer = function faces_sorted_by_layer(faces_layer) {
    return faces_layer.map(function (layer, i) {
      return {
        layer: layer,
        i: i
      };
    }).sort(function (a, b) {
      return a.layer - b.layer;
    }).map(function (el) {
      return el.i;
    });
  };
  var make_faces_sidedness = function make_faces_sidedness(graph) {
    var coloring = graph["faces_re:coloring"];
    if (coloring == null) {
      coloring = "faces_re:matrix" in graph ? faces_coloring_from_faces_matrix$1(graph["faces_re:matrix"]) : faces_coloring(graph, 0);
    }
    return coloring.map(function (c) {
      return c ? "front" : "back";
    });
  };
  var finalize_faces = function finalize_faces(graph, svg_faces) {
    var orderIsCertain = graph["faces_re:layer"] != null && graph["faces_re:layer"].length === graph.faces_vertices.length;
    if (orderIsCertain) {
      make_faces_sidedness(graph).forEach(function (side, i) {
        return svg_faces[i].setAttribute("class", side);
      });
    }
    return orderIsCertain ? faces_sorted_by_layer(graph["faces_re:layer"]).map(function (i) {
      return svg_faces[i];
    }) : svg_faces;
  };
  var make_edge_assignment_names = function make_edge_assignment_names(graph) {
    return graph.edges_vertices == null || graph.edges_assignment == null || graph.edges_vertices.length !== graph.edges_assignment.length ? [] : graph.edges_assignment.map(function (a) {
      return CREASE_NAMES[a];
    });
  };
  var svgBoundaries = function svgBoundaries(graph) {
    if ("vertices_coords" in graph === false || "edges_vertices" in graph === false || "edges_assignment" in graph === false) {
      return [];
    }
    var boundary = get_boundary$1(graph).vertices.map(function (v) {
      return graph.vertices_coords[v];
    });
    var p = polygon$1(boundary);
    p.setAttribute("class", "boundary");
    return [p];
  };
  var svgVertices = function svgVertices(graph, options) {
    if ("vertices_coords" in graph === false) {
      return [];
    }
    var radius = options && options.radius ? options.radius : 0.01;
    var svg_vertices = graph.vertices_coords.map(function (v) {
      return circle$1(v[0], v[1], radius);
    });
    svg_vertices.forEach(function (c, i) {
      return c.setAttribute("id", "".concat(i));
    });
    return svg_vertices;
  };
  var svgEdges = function svgEdges(graph) {
    if ("edges_vertices" in graph === false || "vertices_coords" in graph === false) {
      return [];
    }
    var svg_edges = graph.edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return graph.vertices_coords[v];
      });
    }).map(function (e) {
      return line$1(e[0][0], e[0][1], e[1][0], e[1][1]);
    });
    svg_edges.forEach(function (edge, i) {
      return edge.setAttribute("id", "".concat(i));
    });
    make_edge_assignment_names(graph).forEach(function (a, i) {
      return svg_edges[i].setAttribute("class", a);
    });
    return svg_edges;
  };
  var svgFacesVertices = function svgFacesVertices(graph) {
    if ("faces_vertices" in graph === false || "vertices_coords" in graph === false) {
      return [];
    }
    var svg_faces = graph.faces_vertices.map(function (fv) {
      return fv.map(function (v) {
        return graph.vertices_coords[v];
      });
    }).map(function (face) {
      return polygon$1(face);
    });
    svg_faces.forEach(function (face, i) {
      return face.setAttribute("id", "".concat(i));
    });
    return finalize_faces(graph, svg_faces);
  };
  var svgFacesEdges = function svgFacesEdges(graph) {
    if ("faces_edges" in graph === false || "edges_vertices" in graph === false || "vertices_coords" in graph === false) {
      return [];
    }
    var svg_faces = graph.faces_edges.map(function (face_edges) {
      return face_edges.map(function (edge) {
        return graph.edges_vertices[edge];
      }).map(function (vi, i, arr) {
        var next = arr[(i + 1) % arr.length];
        return vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1];
      }).map(function (v) {
        return graph.vertices_coords[v];
      });
    }).map(function (face) {
      return polygon$1(face);
    });
    svg_faces.forEach(function (face, i) {
      return face.setAttribute("id", "".concat(i));
    });
    return finalize_faces(graph, svg_faces);
  };
  var defaultStyle = "svg * {\n  stroke-width: var(--crease-width);\n  stroke-linecap: round;\n  stroke: black;\n}\nline.mountain { stroke: red; }\nline.mark { stroke: lightgray; }\nline.valley { stroke: blue;\n  stroke-dasharray: calc(var(--crease-width) * 2) calc(var(--crease-width) * 2);\n}\npolygon { stroke: none; stroke-linejoin: bevel; }\n.foldedForm polygon { stroke: black; fill: #8881; }\n.foldedForm polygon.front { fill: white; }\n.foldedForm polygon.back { fill: lightgray; }\n.creasePattern polygon { fill: white; stroke: none; }\n.foldedForm .boundaries polygon { fill: none; stroke: none; }\n.foldedForm line { stroke: none; }\n";
  function vkXML$1 (text, step) {
    var ar = text.replace(/>\s{0,}</g, "><").replace(/</g, "~::~<").replace(/\s*xmlns\:/g, "~::~xmlns:").split("~::~");
    var len = ar.length;
    var inComment = false;
    var deep = 0;
    var str = "";
    var space = step != null && typeof step === "string" ? step : "\t";
    var shift = ["\n"];
    for (var si = 0; si < 100; si += 1) {
      shift.push(shift[si] + space);
    }
    for (var ix = 0; ix < len; ix += 1) {
      if (ar[ix].search(/<!/) > -1) {
        str += shift[deep] + ar[ix];
        inComment = true;
        if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1) {
          inComment = false;
        }
      } else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
        str += ar[ix];
        inComment = false;
      } else if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix]) && /^<[\w:\-\.\,]+/.exec(ar[ix - 1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace("/", "")) {
        str += ar[ix];
        if (!inComment) {
          deep -= 1;
        }
      } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) === -1 && ar[ix].search(/\/>/) === -1) {
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
    return str[0] === "\n" ? str.slice(1) : str;
  }
  var document$1 = win$2.document;
  var svgNS$1 = "http://www.w3.org/2000/svg";
  var shadowFilter = function shadowFilter() {
    var id_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "shadow";
    var defs = document$1.createElementNS(svgNS$1, "defs");
    var filter = document$1.createElementNS(svgNS$1, "filter");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    filter.setAttribute("id", id_name);
    var blur = document$1.createElementNS(svgNS$1, "feGaussianBlur");
    blur.setAttribute("in", "SourceAlpha");
    blur.setAttribute("stdDeviation", "0.005");
    blur.setAttribute("result", "blur");
    var offset = document$1.createElementNS(svgNS$1, "feOffset");
    offset.setAttribute("in", "blur");
    offset.setAttribute("result", "offsetBlur");
    var flood = document$1.createElementNS(svgNS$1, "feFlood");
    flood.setAttribute("flood-color", "#000");
    flood.setAttribute("flood-opacity", "0.3");
    flood.setAttribute("result", "offsetColor");
    var composite = document$1.createElementNS(svgNS$1, "feComposite");
    composite.setAttribute("in", "offsetColor");
    composite.setAttribute("in2", "offsetBlur");
    composite.setAttribute("operator", "in");
    composite.setAttribute("result", "offsetBlur");
    var merge = document$1.createElementNS(svgNS$1, "feMerge");
    var mergeNode1 = document$1.createElementNS(svgNS$1, "feMergeNode");
    var mergeNode2 = document$1.createElementNS(svgNS$1, "feMergeNode");
    mergeNode2.setAttribute("in", "SourceGraphic");
    merge.appendChild(mergeNode1);
    merge.appendChild(mergeNode2);
    defs.appendChild(filter);
    filter.appendChild(blur);
    filter.appendChild(offset);
    filter.appendChild(flood);
    filter.appendChild(composite);
    filter.appendChild(merge);
    return defs;
  };
  function renderDiagrams (graph, renderGroup) {
    if (graph["re:diagrams"] === undefined) {
      return;
    }
    if (graph["re:diagrams"].length === 0) {
      return;
    }
    Array.from(graph["re:diagrams"]).forEach(function (instruction) {
      if ("re:diagram_lines" in instruction === true) {
        instruction["re:diagram_lines"].forEach(function (crease) {
          var creaseClass = "re:diagram_line_classes" in crease ? crease["re:diagram_line_classes"].join(" ") : "valley";
          var pts = crease["re:diagram_line_coords"];
          if (pts !== undefined) {
            var l = line$1(pts[0][0], pts[0][1], pts[1][0], pts[1][1]);
            l.setAttribute("class", creaseClass);
            renderGroup.appendChild(l);
          }
        });
      }
      if ("re:diagram_arrows" in instruction === true) {
        var r = bounding_rect$1(graph);
        var vmin = r[2] > r[3] ? r[3] : r[2];
        var prefs = {
          length: vmin * 0.09,
          width: vmin * 0.035,
          strokeWidth: vmin * 0.02
        };
        instruction["re:diagram_arrows"].forEach(function (arrowInst) {
          if (arrowInst["re:diagram_arrow_coords"].length === 2) {
            var p = arrowInst["re:diagram_arrow_coords"];
            var side = p[0][0] < p[1][0];
            if (Math.abs(p[0][0] - p[1][0]) < 0.1) {
              side = p[0][1] < p[1][1] ? p[0][0] < 0.5 : p[0][0] > 0.5;
            }
            if (Math.abs(p[0][1] - p[1][1]) < 0.1) {
              side = p[0][0] < p[1][0] ? p[0][1] > 0.5 : p[0][1] < 0.5;
            }
            prefs.side = side;
            var arrow = arcArrow(p[0], p[1], prefs);
            renderGroup.appendChild(arrow);
          }
        });
      }
    });
  }
  var DISPLAY_NAME = {
    vertices: "vertices",
    edges: "creases",
    faces: "faces",
    boundaries: "boundaries"
  };
  var svgFaces = function svgFaces(graph) {
    if ("faces_vertices" in graph === true) {
      return svgFacesVertices(graph);
    }
    if ("faces_edges" in graph === true) {
      return svgFacesEdges(graph);
    }
    return [];
  };
  var components = {
    vertices: svgVertices,
    edges: svgEdges,
    faces: svgFaces,
    boundaries: svgBoundaries
  };
  var all_classes = function all_classes(graph) {
    var file_classes = (graph.file_classes != null ? graph.file_classes : []).join(" ");
    var frame_classes = (graph.frame_classes != null ? graph.frame_classes : []).join(" ");
    return [file_classes, frame_classes].filter(function (s) {
      return s !== "";
    }).join(" ");
  };
  var clean_number$1 = function clean_number(num) {
    var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 14;
    return parseFloat(num.toFixed(places));
  };
  var fold_to_svg = function fold_to_svg(fold) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var graph = fold;
    if (graph.vertices_coords != null) {
      graph.vertices_coordsPreClean = graph.vertices_coords;
      graph.vertices_coords = JSON.parse(JSON.stringify(graph.vertices_coords)).map(function (v) {
        return v.map(function (n) {
          return clean_number$1(n);
        });
      });
    }
    var o = {
      defaults: true,
      width: "500px",
      height: "500px",
      inlineStyle: true,
      stylesheet: defaultStyle,
      shadows: false,
      padding: 0,
      viewBox: null,
      diagram: true,
      boundaries: true,
      faces: true,
      edges: true,
      vertices: false
    };
    Object.assign(o, options);
    if (o.frame != null) {
      graph = flatten_frame$1(fold, o.frame);
    }
    if (o.svg == null) {
      o.svg = svg$1();
    }
    o.svg.setAttribute("class", all_classes(graph));
    o.svg.setAttribute("width", o.width);
    o.svg.setAttribute("height", o.height);
    var styleElement = style$1();
    o.svg.appendChild(styleElement);
    var groups = {};
    ["boundaries", "faces", "edges", "vertices"].filter(function (key) {
      return o[key];
    }).forEach(function (key) {
      groups[key] = group$1();
      groups[key].setAttribute("class", DISPLAY_NAME[key]);
      o.svg.appendChild(groups[key]);
    });
    Object.keys(groups).forEach(function (key) {
      return components[key](graph).forEach(function (a) {
        return groups[key].appendChild(a);
      });
    });
    if ("re:diagrams" in graph && o.diagram) {
      var instructionLayer = group$1();
      o.svg.appendChild(instructionLayer);
      renderDiagrams(graph, instructionLayer);
    }
    if (o.shadows) {
      var shadow_id = "face_shadow";
      var filter = shadowFilter(shadow_id);
      o.svg.appendChild(filter);
      Array.from(groups.faces.childNodes).forEach(function (f) {
        return f.setAttribute("filter", "url(#".concat(shadow_id, ")"));
      });
    }
    var rect = bounding_rect$1(graph);
    if (o.viewBox != null) {
      setViewBox$1.apply(void 0, [o.svg].concat(_toConsumableArray(o.viewBox), [o.padding]));
    } else {
      setViewBox$1.apply(void 0, [o.svg].concat(_toConsumableArray(rect), [o.padding]));
    }
    if (graph.vertices_coordsPreClean != null) {
      graph.vertices_coords = graph.vertices_coordsPreClean;
      delete graph.vertices_coordsPreClean;
    }
    if (o.inlineStyle) {
      var vmin = rect[2] > rect[3] ? rect[3] : rect[2];
      var innerStyle = "\nsvg { --crease-width: ".concat(vmin * 0.005, "; }\n").concat(o.stylesheet);
      var docu = new win$2.DOMParser().parseFromString("<xml></xml>", "application/xml");
      var cdata = docu.createCDATASection(innerStyle);
      styleElement.appendChild(cdata);
    }
    var stringified = new win$2.XMLSerializer().serializeToString(o.svg);
    var beautified = vkXML$1(stringified);
    return beautified;
  };
  var getObject = function getObject(input) {
    if (_typeof(input) === "object" && input !== null) {
      return input;
    }
    if (typeof input === "string" || input instanceof String) {
      try {
        var obj = JSON.parse(input);
        return obj;
      } catch (error) {
        throw error;
      }
    }
    throw new Error("couldn't recognize input. looking for string or object");
  };
  var svg$1$1 = function svg(input, options) {
    try {
      var fold = getObject(input);
      return fold_to_svg(fold, options);
    } catch (error) {
      throw error;
    }
  };
  var webGL = function webGL() {};
  var drawFOLD = {
    svg: svg$1$1,
    webGL: webGL,
    components: {
      svg: {
        boundaries: svgBoundaries,
        vertices: svgVertices,
        edges: svgEdges,
        faces: svgFacesVertices,
        faces_vertices: svgFacesVertices,
        faces_edges: svgFacesEdges
      },
      webGL: {}
    }
  };

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

  const isBrowser$3 = typeof window !== "undefined"
    && typeof window.document !== "undefined";
  const isNode$3 = typeof process !== "undefined"
    && process.versions != null
    && process.versions.node != null;

  const htmlString$3 = "<!DOCTYPE html><title>a</title>";
  const win$3 = !isNode$3 && isBrowser$3 ? window : {};
  if (isNode$3) {
    const { DOMParser, XMLSerializer } = require("xmldom");
    win$3.DOMParser = DOMParser;
    win$3.XMLSerializer = XMLSerializer;
    win$3.document = new DOMParser().parseFromString(htmlString$3, "text/html");
  }

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
  const edge_edge_comp_exclusive = (t0, t1) => t0 > EPSILON$1 && t0 < 1 - EPSILON$1 && t1 > EPSILON$1
    && t1 < 1 - EPSILON$1;
  const intersection_function$1 = function (aPt, aVec, bPt, bVec, compFunc, epsilon = EPSILON$1) {
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
  const edge_edge_exclusive = function (a0, a1, b0, b1, epsilon) {
    const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return intersection_function$1(a0, aVec, b0, bVec, edge_edge_comp_exclusive, epsilon);
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
        edge_edge_exclusive
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

  function _toConsumableArray$1(arr) {
    return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _nonIterableSpread$1();
  }
  function _arrayWithoutHoles$1(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
      return arr2;
    }
  }
  function _iterableToArray$1(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }
  function _nonIterableSpread$1() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }
  var length = {
    a: 7,
    c: 6,
    h: 1,
    l: 2,
    m: 2,
    q: 4,
    s: 4,
    t: 2,
    v: 1,
    z: 0
  };
  var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
  function parse (path) {
    var data = [];
    path.replace(segment, function (_, command, args) {
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
  function Bezier (ax, ay, bx, by, cx, cy, dx, dy) {
    return new Bezier$1(ax, ay, bx, by, cx, cy, dx, dy);
  }
  function Bezier$1(ax, ay, bx, by, cx, cy, dx, dy) {
    this.a = {
      x: ax,
      y: ay
    };
    this.b = {
      x: bx,
      y: by
    };
    this.c = {
      x: cx,
      y: cy
    };
    this.d = {
      x: dx,
      y: dy
    };
    if (dx !== null && dx !== undefined && dy !== null && dy !== undefined) {
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
    init: function init() {
      this.length = this.getArcLength([this.a.x, this.b.x, this.c.x, this.d.x], [this.a.y, this.b.y, this.c.y, this.d.y]);
    },
    getTotalLength: function getTotalLength() {
      return this.length;
    },
    getPointAtLength: function getPointAtLength(length) {
      var t = t2length(length, this.length, this.getArcLength, [this.a.x, this.b.x, this.c.x, this.d.x], [this.a.y, this.b.y, this.c.y, this.d.y]);
      return this.getPoint([this.a.x, this.b.x, this.c.x, this.d.x], [this.a.y, this.b.y, this.c.y, this.d.y], t);
    },
    getTangentAtLength: function getTangentAtLength(length) {
      var t = t2length(length, this.length, this.getArcLength, [this.a.x, this.b.x, this.c.x, this.d.x], [this.a.y, this.b.y, this.c.y, this.d.y]);
      var derivative = this.getDerivative([this.a.x, this.b.x, this.c.x, this.d.x], [this.a.y, this.b.y, this.c.y, this.d.y], t);
      var mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
      var tangent;
      if (mdl > 0) {
        tangent = {
          x: derivative.x / mdl,
          y: derivative.y / mdl
        };
      } else {
        tangent = {
          x: 0,
          y: 0
        };
      }
      return tangent;
    },
    getPropertiesAtLength: function getPropertiesAtLength(length) {
      var t = t2length(length, this.length, this.getArcLength, [this.a.x, this.b.x, this.c.x, this.d.x], [this.a.y, this.b.y, this.c.y, this.d.y]);
      var derivative = this.getDerivative([this.a.x, this.b.x, this.c.x, this.d.x], [this.a.y, this.b.y, this.c.y, this.d.y], t);
      var mdl = Math.sqrt(derivative.x * derivative.x + derivative.y * derivative.y);
      var tangent;
      if (mdl > 0) {
        tangent = {
          x: derivative.x / mdl,
          y: derivative.y / mdl
        };
      } else {
        tangent = {
          x: 0,
          y: 0
        };
      }
      var point = this.getPoint([this.a.x, this.b.x, this.c.x, this.d.x], [this.a.y, this.b.y, this.c.y, this.d.y], t);
      return {
        x: point.x,
        y: point.y,
        tangentX: tangent.x,
        tangentY: tangent.y
      };
    }
  };
  function quadraticDerivative(xs, ys, t) {
    return {
      x: (1 - t) * 2 * (xs[1] - xs[0]) + t * 2 * (xs[2] - xs[1]),
      y: (1 - t) * 2 * (ys[1] - ys[0]) + t * 2 * (ys[2] - ys[1])
    };
  }
  function cubicDerivative(xs, ys, t) {
    var derivative = quadraticPoint([3 * (xs[1] - xs[0]), 3 * (xs[2] - xs[1]), 3 * (xs[3] - xs[2])], [3 * (ys[1] - ys[0]), 3 * (ys[2] - ys[1]), 3 * (ys[3] - ys[2])], t);
    return derivative;
  }
  function t2length(length, total_length, func, xs, ys) {
    var error = 1;
    var t = length / total_length;
    var step = (length - func(xs, ys, t)) / total_length;
    var numIterations = 0;
    while (error > 0.001) {
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
      if (numIterations > 500) {
        break;
      }
    }
    return t;
  }
  function quadraticPoint(xs, ys, t) {
    var x = (1 - t) * (1 - t) * xs[0] + 2 * (1 - t) * t * xs[1] + t * t * xs[2];
    var y = (1 - t) * (1 - t) * ys[0] + 2 * (1 - t) * t * ys[1] + t * t * ys[2];
    return {
      x: x,
      y: y
    };
  }
  function cubicPoint(xs, ys, t) {
    var x = (1 - t) * (1 - t) * (1 - t) * xs[0] + 3 * (1 - t) * (1 - t) * t * xs[1] + 3 * (1 - t) * t * t * xs[2] + t * t * t * xs[3];
    var y = (1 - t) * (1 - t) * (1 - t) * ys[0] + 3 * (1 - t) * (1 - t) * t * ys[1] + 3 * (1 - t) * t * t * ys[2] + t * t * t * ys[3];
    return {
      x: x,
      y: y
    };
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
    if (A === 0) {
      return t * Math.sqrt(Math.pow(xs[2] - xs[0], 2) + Math.pow(ys[2] - ys[0], 2));
    }
    var b = B / (2 * A);
    var c = C / A;
    var u = t + b;
    var k = c - b * b;
    var uuk = u * u + k > 0 ? Math.sqrt(u * u + k) : 0;
    var bbk = b * b + k > 0 ? Math.sqrt(b * b + k) : 0;
    var term = b + Math.sqrt(b * b + k) !== 0 ? k * Math.log(Math.abs((u + uuk) / (b + bbk))) : 0;
    return Math.sqrt(A) / 2 * (u * uuk - b * bbk + term);
  }
  var tValues = [[], [], [-0.5773502691896257, 0.5773502691896257], [0, -0.7745966692414834, 0.7745966692414834], [-0.33998104358485626, 0.33998104358485626, -0.8611363115940526, 0.8611363115940526], [0, -0.5384693101056831, 0.5384693101056831, -0.906179845938664, 0.906179845938664], [0.6612093864662645, -0.6612093864662645, -0.2386191860831969, 0.2386191860831969, -0.932469514203152, 0.932469514203152], [0, 0.4058451513773972, -0.4058451513773972, -0.7415311855993945, 0.7415311855993945, -0.9491079123427585, 0.9491079123427585], [-0.1834346424956498, 0.1834346424956498, -0.525532409916329, 0.525532409916329, -0.7966664774136267, 0.7966664774136267, -0.9602898564975363, 0.9602898564975363], [0, -0.8360311073266358, 0.8360311073266358, -0.9681602395076261, 0.9681602395076261, -0.3242534234038089, 0.3242534234038089, -0.6133714327005904, 0.6133714327005904], [-0.14887433898163122, 0.14887433898163122, -0.4333953941292472, 0.4333953941292472, -0.6794095682990244, 0.6794095682990244, -0.8650633666889845, 0.8650633666889845, -0.9739065285171717, 0.9739065285171717], [0, -0.26954315595234496, 0.26954315595234496, -0.5190961292068118, 0.5190961292068118, -0.7301520055740494, 0.7301520055740494, -0.8870625997680953, 0.8870625997680953, -0.978228658146057, 0.978228658146057], [-0.1252334085114689, 0.1252334085114689, -0.3678314989981802, 0.3678314989981802, -0.5873179542866175, 0.5873179542866175, -0.7699026741943047, 0.7699026741943047, -0.9041172563704749, 0.9041172563704749, -0.9815606342467192, 0.9815606342467192], [0, -0.2304583159551348, 0.2304583159551348, -0.44849275103644687, 0.44849275103644687, -0.6423493394403402, 0.6423493394403402, -0.8015780907333099, 0.8015780907333099, -0.9175983992229779, 0.9175983992229779, -0.9841830547185881, 0.9841830547185881], [-0.10805494870734367, 0.10805494870734367, -0.31911236892788974, 0.31911236892788974, -0.5152486363581541, 0.5152486363581541, -0.6872929048116855, 0.6872929048116855, -0.827201315069765, 0.827201315069765, -0.9284348836635735, 0.9284348836635735, -0.9862838086968123, 0.9862838086968123], [0, -0.20119409399743451, 0.20119409399743451, -0.3941513470775634, 0.3941513470775634, -0.5709721726085388, 0.5709721726085388, -0.7244177313601701, 0.7244177313601701, -0.8482065834104272, 0.8482065834104272, -0.937273392400706, 0.937273392400706, -0.9879925180204854, 0.9879925180204854], [-0.09501250983763744, 0.09501250983763744, -0.2816035507792589, 0.2816035507792589, -0.45801677765722737, 0.45801677765722737, -0.6178762444026438, 0.6178762444026438, -0.755404408355003, 0.755404408355003, -0.8656312023878318, 0.8656312023878318, -0.9445750230732326, 0.9445750230732326, -0.9894009349916499, 0.9894009349916499], [0, -0.17848418149584785, 0.17848418149584785, -0.3512317634538763, 0.3512317634538763, -0.5126905370864769, 0.5126905370864769, -0.6576711592166907, 0.6576711592166907, -0.7815140038968014, 0.7815140038968014, -0.8802391537269859, 0.8802391537269859, -0.9506755217687678, 0.9506755217687678, -0.9905754753144174, 0.9905754753144174], [-0.0847750130417353, 0.0847750130417353, -0.2518862256915055, 0.2518862256915055, -0.41175116146284263, 0.41175116146284263, -0.5597708310739475, 0.5597708310739475, -0.6916870430603532, 0.6916870430603532, -0.8037049589725231, 0.8037049589725231, -0.8926024664975557, 0.8926024664975557, -0.9558239495713977, 0.9558239495713977, -0.9915651684209309, 0.9915651684209309], [0, -0.16035864564022537, 0.16035864564022537, -0.31656409996362983, 0.31656409996362983, -0.46457074137596094, 0.46457074137596094, -0.600545304661681, 0.600545304661681, -0.7209661773352294, 0.7209661773352294, -0.8227146565371428, 0.8227146565371428, -0.9031559036148179, 0.9031559036148179, -0.96020815213483, 0.96020815213483, -0.9924068438435844, 0.9924068438435844], [-0.07652652113349734, 0.07652652113349734, -0.22778585114164507, 0.22778585114164507, -0.37370608871541955, 0.37370608871541955, -0.5108670019508271, 0.5108670019508271, -0.636053680726515, 0.636053680726515, -0.7463319064601508, 0.7463319064601508, -0.8391169718222188, 0.8391169718222188, -0.912234428251326, 0.912234428251326, -0.9639719272779138, 0.9639719272779138, -0.9931285991850949, 0.9931285991850949], [0, -0.1455618541608951, 0.1455618541608951, -0.2880213168024011, 0.2880213168024011, -0.4243421202074388, 0.4243421202074388, -0.5516188358872198, 0.5516188358872198, -0.6671388041974123, 0.6671388041974123, -0.7684399634756779, 0.7684399634756779, -0.8533633645833173, 0.8533633645833173, -0.9200993341504008, 0.9200993341504008, -0.9672268385663063, 0.9672268385663063, -0.9937521706203895, 0.9937521706203895], [-0.06973927331972223, 0.06973927331972223, -0.20786042668822127, 0.20786042668822127, -0.34193582089208424, 0.34193582089208424, -0.469355837986757, 0.469355837986757, -0.5876404035069116, 0.5876404035069116, -0.6944872631866827, 0.6944872631866827, -0.7878168059792081, 0.7878168059792081, -0.8658125777203002, 0.8658125777203002, -0.926956772187174, 0.926956772187174, -0.9700604978354287, 0.9700604978354287, -0.9942945854823992, 0.9942945854823992], [0, -0.1332568242984661, 0.1332568242984661, -0.26413568097034495, 0.26413568097034495, -0.3903010380302908, 0.3903010380302908, -0.5095014778460075, 0.5095014778460075, -0.6196098757636461, 0.6196098757636461, -0.7186613631319502, 0.7186613631319502, -0.8048884016188399, 0.8048884016188399, -0.8767523582704416, 0.8767523582704416, -0.9329710868260161, 0.9329710868260161, -0.9725424712181152, 0.9725424712181152, -0.9947693349975522, 0.9947693349975522], [-0.06405689286260563, 0.06405689286260563, -0.1911188674736163, 0.1911188674736163, -0.3150426796961634, 0.3150426796961634, -0.4337935076260451, 0.4337935076260451, -0.5454214713888396, 0.5454214713888396, -0.6480936519369755, 0.6480936519369755, -0.7401241915785544, 0.7401241915785544, -0.820001985973903, 0.820001985973903, -0.8864155270044011, 0.8864155270044011, -0.9382745520027328, 0.9382745520027328, -0.9747285559713095, 0.9747285559713095, -0.9951872199970213, 0.9951872199970213]];
  var cValues = [[], [], [1, 1], [0.8888888888888888, 0.5555555555555556, 0.5555555555555556], [0.6521451548625461, 0.6521451548625461, 0.34785484513745385, 0.34785484513745385], [0.5688888888888889, 0.47862867049936647, 0.47862867049936647, 0.23692688505618908, 0.23692688505618908], [0.3607615730481386, 0.3607615730481386, 0.46791393457269104, 0.46791393457269104, 0.17132449237917036, 0.17132449237917036], [0.4179591836734694, 0.3818300505051189, 0.3818300505051189, 0.27970539148927664, 0.27970539148927664, 0.1294849661688697, 0.1294849661688697], [0.362683783378362, 0.362683783378362, 0.31370664587788727, 0.31370664587788727, 0.22238103445337448, 0.22238103445337448, 0.10122853629037626, 0.10122853629037626], [0.3302393550012598, 0.1806481606948574, 0.1806481606948574, 0.08127438836157441, 0.08127438836157441, 0.31234707704000286, 0.31234707704000286, 0.26061069640293544, 0.26061069640293544], [0.29552422471475287, 0.29552422471475287, 0.26926671930999635, 0.26926671930999635, 0.21908636251598204, 0.21908636251598204, 0.1494513491505806, 0.1494513491505806, 0.06667134430868814, 0.06667134430868814], [0.2729250867779006, 0.26280454451024665, 0.26280454451024665, 0.23319376459199048, 0.23319376459199048, 0.18629021092773426, 0.18629021092773426, 0.1255803694649046, 0.1255803694649046, 0.05566856711617366, 0.05566856711617366], [0.24914704581340277, 0.24914704581340277, 0.2334925365383548, 0.2334925365383548, 0.20316742672306592, 0.20316742672306592, 0.16007832854334622, 0.16007832854334622, 0.10693932599531843, 0.10693932599531843, 0.04717533638651183, 0.04717533638651183], [0.2325515532308739, 0.22628318026289723, 0.22628318026289723, 0.2078160475368885, 0.2078160475368885, 0.17814598076194574, 0.17814598076194574, 0.13887351021978725, 0.13887351021978725, 0.09212149983772845, 0.09212149983772845, 0.04048400476531588, 0.04048400476531588], [0.2152638534631578, 0.2152638534631578, 0.2051984637212956, 0.2051984637212956, 0.18553839747793782, 0.18553839747793782, 0.15720316715819355, 0.15720316715819355, 0.12151857068790319, 0.12151857068790319, 0.08015808715976021, 0.08015808715976021, 0.03511946033175186, 0.03511946033175186], [0.2025782419255613, 0.19843148532711158, 0.19843148532711158, 0.1861610000155622, 0.1861610000155622, 0.16626920581699392, 0.16626920581699392, 0.13957067792615432, 0.13957067792615432, 0.10715922046717194, 0.10715922046717194, 0.07036604748810812, 0.07036604748810812, 0.03075324199611727, 0.03075324199611727], [0.1894506104550685, 0.1894506104550685, 0.18260341504492358, 0.18260341504492358, 0.16915651939500254, 0.16915651939500254, 0.14959598881657674, 0.14959598881657674, 0.12462897125553388, 0.12462897125553388, 0.09515851168249279, 0.09515851168249279, 0.062253523938647894, 0.062253523938647894, 0.027152459411754096, 0.027152459411754096], [0.17944647035620653, 0.17656270536699264, 0.17656270536699264, 0.16800410215645004, 0.16800410215645004, 0.15404576107681028, 0.15404576107681028, 0.13513636846852548, 0.13513636846852548, 0.11188384719340397, 0.11188384719340397, 0.08503614831717918, 0.08503614831717918, 0.0554595293739872, 0.0554595293739872, 0.02414830286854793, 0.02414830286854793], [0.1691423829631436, 0.1691423829631436, 0.16427648374583273, 0.16427648374583273, 0.15468467512626524, 0.15468467512626524, 0.14064291467065065, 0.14064291467065065, 0.12255520671147846, 0.12255520671147846, 0.10094204410628717, 0.10094204410628717, 0.07642573025488905, 0.07642573025488905, 0.0497145488949698, 0.0497145488949698, 0.02161601352648331, 0.02161601352648331], [0.1610544498487837, 0.15896884339395434, 0.15896884339395434, 0.15276604206585967, 0.15276604206585967, 0.1426067021736066, 0.1426067021736066, 0.12875396253933621, 0.12875396253933621, 0.11156664554733399, 0.11156664554733399, 0.09149002162245, 0.09149002162245, 0.06904454273764123, 0.06904454273764123, 0.0448142267656996, 0.0448142267656996, 0.019461788229726478, 0.019461788229726478], [0.15275338713072584, 0.15275338713072584, 0.14917298647260374, 0.14917298647260374, 0.14209610931838204, 0.14209610931838204, 0.13168863844917664, 0.13168863844917664, 0.11819453196151841, 0.11819453196151841, 0.10193011981724044, 0.10193011981724044, 0.08327674157670475, 0.08327674157670475, 0.06267204833410907, 0.06267204833410907, 0.04060142980038694, 0.04060142980038694, 0.017614007139152118, 0.017614007139152118], [0.14608113364969041, 0.14452440398997005, 0.14452440398997005, 0.13988739479107315, 0.13988739479107315, 0.13226893863333747, 0.13226893863333747, 0.12183141605372853, 0.12183141605372853, 0.10879729916714838, 0.10879729916714838, 0.09344442345603386, 0.09344442345603386, 0.0761001136283793, 0.0761001136283793, 0.057134425426857205, 0.057134425426857205, 0.036953789770852494, 0.036953789770852494, 0.016017228257774335, 0.016017228257774335], [0.13925187285563198, 0.13925187285563198, 0.13654149834601517, 0.13654149834601517, 0.13117350478706238, 0.13117350478706238, 0.12325237681051242, 0.12325237681051242, 0.11293229608053922, 0.11293229608053922, 0.10041414444288096, 0.10041414444288096, 0.08594160621706773, 0.08594160621706773, 0.06979646842452049, 0.06979646842452049, 0.052293335152683286, 0.052293335152683286, 0.03377490158481415, 0.03377490158481415, 0.0146279952982722, 0.0146279952982722], [0.13365457218610619, 0.1324620394046966, 0.1324620394046966, 0.12890572218808216, 0.12890572218808216, 0.12304908430672953, 0.12304908430672953, 0.11499664022241136, 0.11499664022241136, 0.10489209146454141, 0.10489209146454141, 0.09291576606003515, 0.09291576606003515, 0.07928141177671895, 0.07928141177671895, 0.06423242140852585, 0.06423242140852585, 0.04803767173108467, 0.04803767173108467, 0.030988005856979445, 0.030988005856979445, 0.013411859487141771, 0.013411859487141771], [0.12793819534675216, 0.12793819534675216, 0.1258374563468283, 0.1258374563468283, 0.12167047292780339, 0.12167047292780339, 0.1155056680537256, 0.1155056680537256, 0.10744427011596563, 0.10744427011596563, 0.09761865210411388, 0.09761865210411388, 0.08619016153195327, 0.08619016153195327, 0.0733464814110803, 0.0733464814110803, 0.05929858491543678, 0.05929858491543678, 0.04427743881741981, 0.04427743881741981, 0.028531388628933663, 0.028531388628933663, 0.0123412297999872, 0.0123412297999872]];
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
  function Arc (x0, y0, rx, ry, xAxisRotate, LargeArcFlag, SweepFlag, x, y) {
    return new Arc$1(x0, y0, rx, ry, xAxisRotate, LargeArcFlag, SweepFlag, x, y);
  }
  function Arc$1(x0, y0, rx, ry, xAxisRotate, LargeArcFlag, SweepFlag, x1, y1) {
    this.x0 = x0;
    this.y0 = y0;
    this.rx = rx;
    this.ry = ry;
    this.xAxisRotate = xAxisRotate;
    this.LargeArcFlag = LargeArcFlag;
    this.SweepFlag = SweepFlag;
    this.x1 = x1;
    this.y1 = y1;
    var lengthProperties = approximateArcLengthOfCurve(300, function (t) {
      return pointOnEllipticalArc({
        x: x0,
        y: y0
      }, rx, ry, xAxisRotate, LargeArcFlag, SweepFlag, {
        x: x1,
        y: y1
      }, t);
    });
    this.length = lengthProperties.arcLength;
  }
  Arc$1.prototype = {
    constructor: Arc$1,
    init: function init() {},
    getTotalLength: function getTotalLength() {
      return this.length;
    },
    getPointAtLength: function getPointAtLength(fractionLength) {
      if (fractionLength < 0) {
        fractionLength = 0;
      } else if (fractionLength > this.length) {
        fractionLength = this.length;
      }
      var position = pointOnEllipticalArc({
        x: this.x0,
        y: this.y0
      }, this.rx, this.ry, this.xAxisRotate, this.LargeArcFlag, this.SweepFlag, {
        x: this.x1,
        y: this.y1
      }, fractionLength / this.length);
      return {
        x: position.x,
        y: position.y
      };
    },
    getTangentAtLength: function getTangentAtLength(fractionLength) {
      if (fractionLength < 0) {
        fractionLength = 0;
      } else if (fractionLength > this.length) {
        fractionLength = this.length;
      }
      var position = pointOnEllipticalArc({
        x: this.x0,
        y: this.y0
      }, this.rx, this.ry, this.xAxisRotate, this.LargeArcFlag, this.SweepFlag, {
        x: this.x1,
        y: this.y1
      }, fractionLength / this.length);
      return {
        x: position.x,
        y: position.y
      };
    },
    getPropertiesAtLength: function getPropertiesAtLength(fractionLength) {
      var tangent = this.getTangentAtLength(fractionLength);
      var point = this.getPointAtLength(fractionLength);
      return {
        x: point.x,
        y: point.y,
        tangentX: tangent.x,
        tangentY: tangent.y
      };
    }
  };
  function pointOnEllipticalArc(p0, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, p1, t) {
    rx = Math.abs(rx);
    ry = Math.abs(ry);
    xAxisRotation = mod(xAxisRotation, 360);
    var xAxisRotationRadians = toRadians(xAxisRotation);
    if (p0.x === p1.x && p0.y === p1.y) {
      return p0;
    }
    if (rx === 0 || ry === 0) {
      return this.pointOnLine(p0, p1, t);
    }
    var dx = (p0.x - p1.x) / 2;
    var dy = (p0.y - p1.y) / 2;
    var transformedPoint = {
      x: Math.cos(xAxisRotationRadians) * dx + Math.sin(xAxisRotationRadians) * dy,
      y: -Math.sin(xAxisRotationRadians) * dx + Math.cos(xAxisRotationRadians) * dy
    };
    var radiiCheck = Math.pow(transformedPoint.x, 2) / Math.pow(rx, 2) + Math.pow(transformedPoint.y, 2) / Math.pow(ry, 2);
    if (radiiCheck > 1) {
      rx = Math.sqrt(radiiCheck) * rx;
      ry = Math.sqrt(radiiCheck) * ry;
    }
    var cSquareNumerator = Math.pow(rx, 2) * Math.pow(ry, 2) - Math.pow(rx, 2) * Math.pow(transformedPoint.y, 2) - Math.pow(ry, 2) * Math.pow(transformedPoint.x, 2);
    var cSquareRootDenom = Math.pow(rx, 2) * Math.pow(transformedPoint.y, 2) + Math.pow(ry, 2) * Math.pow(transformedPoint.x, 2);
    var cRadicand = cSquareNumerator / cSquareRootDenom;
    cRadicand = cRadicand < 0 ? 0 : cRadicand;
    var cCoef = (largeArcFlag !== sweepFlag ? 1 : -1) * Math.sqrt(cRadicand);
    var transformedCenter = {
      x: cCoef * (rx * transformedPoint.y / ry),
      y: cCoef * (-(ry * transformedPoint.x) / rx)
    };
    var center = {
      x: Math.cos(xAxisRotationRadians) * transformedCenter.x - Math.sin(xAxisRotationRadians) * transformedCenter.y + (p0.x + p1.x) / 2,
      y: Math.sin(xAxisRotationRadians) * transformedCenter.x + Math.cos(xAxisRotationRadians) * transformedCenter.y + (p0.y + p1.y) / 2
    };
    var startVector = {
      x: (transformedPoint.x - transformedCenter.x) / rx,
      y: (transformedPoint.y - transformedCenter.y) / ry
    };
    var startAngle = angleBetween({
      x: 1,
      y: 0
    }, startVector);
    var endVector = {
      x: (-transformedPoint.x - transformedCenter.x) / rx,
      y: (-transformedPoint.y - transformedCenter.y) / ry
    };
    var sweepAngle = angleBetween(startVector, endVector);
    if (!sweepFlag && sweepAngle > 0) {
      sweepAngle -= 2 * Math.PI;
    } else if (sweepFlag && sweepAngle < 0) {
      sweepAngle += 2 * Math.PI;
    }
    sweepAngle %= 2 * Math.PI;
    var angle = startAngle + sweepAngle * t;
    var ellipseComponentX = rx * Math.cos(angle);
    var ellipseComponentY = ry * Math.sin(angle);
    var point = {
      x: Math.cos(xAxisRotationRadians) * ellipseComponentX - Math.sin(xAxisRotationRadians) * ellipseComponentY + center.x,
      y: Math.sin(xAxisRotationRadians) * ellipseComponentX + Math.cos(xAxisRotationRadians) * ellipseComponentY + center.y
    };
    point.ellipticalArcStartAngle = startAngle;
    point.ellipticalArcEndAngle = startAngle + sweepAngle;
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
    for (var i = 0; i < resolution; i++) {
      var t = clamp(i * (1 / resolution), 0, 1);
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
    return (x % m + m) % m;
  }
  function toRadians(angle) {
    return angle * (Math.PI / 180);
  }
  function distance$1(p0, p1) {
    return Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
  }
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
  function angleBetween(v0, v1) {
    var p = v0.x * v1.x + v0.y * v1.y;
    var n = Math.sqrt((Math.pow(v0.x, 2) + Math.pow(v0.y, 2)) * (Math.pow(v1.x, 2) + Math.pow(v1.y, 2)));
    var sign = v0.x * v1.y - v0.y * v1.x < 0 ? -1 : 1;
    var angle = sign * Math.acos(p / n);
    return angle;
  }
  function LinearPosition (x0, x1, y0, y1) {
    return new LinearPosition$1(x0, x1, y0, y1);
  }
  function LinearPosition$1(x0, x1, y0, y1) {
    this.x0 = x0;
    this.x1 = x1;
    this.y0 = y0;
    this.y1 = y1;
  }
  LinearPosition$1.prototype.getTotalLength = function () {
    return Math.sqrt(Math.pow(this.x0 - this.x1, 2) + Math.pow(this.y0 - this.y1, 2));
  };
  LinearPosition$1.prototype.getPointAtLength = function (pos) {
    var fraction = pos / Math.sqrt(Math.pow(this.x0 - this.x1, 2) + Math.pow(this.y0 - this.y1, 2));
    var newDeltaX = (this.x1 - this.x0) * fraction;
    var newDeltaY = (this.y1 - this.y0) * fraction;
    return {
      x: this.x0 + newDeltaX,
      y: this.y0 + newDeltaY
    };
  };
  LinearPosition$1.prototype.getTangentAtLength = function () {
    var module = Math.sqrt((this.x1 - this.x0) * (this.x1 - this.x0) + (this.y1 - this.y0) * (this.y1 - this.y0));
    return {
      x: (this.x1 - this.x0) / module,
      y: (this.y1 - this.y0) / module
    };
  };
  LinearPosition$1.prototype.getPropertiesAtLength = function (pos) {
    var point = this.getPointAtLength(pos);
    var tangent = this.getTangentAtLength();
    return {
      x: point.x,
      y: point.y,
      tangentX: tangent.x,
      tangentY: tangent.y
    };
  };
  function PathProperties (svgString) {
    var length = 0;
    var partial_lengths = [];
    var functions = [];
    function svgProperties(string) {
      if (!string) {
        return null;
      }
      var parsed = parse(string);
      var cur = [0, 0];
      var prev_point = [0, 0];
      var curve;
      var ringStart;
      for (var i = 0; i < parsed.length; i++) {
        if (parsed[i][0] === "M") {
          cur = [parsed[i][1], parsed[i][2]];
          ringStart = [cur[0], cur[1]];
          functions.push(null);
        } else if (parsed[i][0] === "m") {
          cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
          ringStart = [cur[0], cur[1]];
          functions.push(null);
        } else if (parsed[i][0] === "L") {
          length = length + Math.sqrt(Math.pow(cur[0] - parsed[i][1], 2) + Math.pow(cur[1] - parsed[i][2], 2));
          functions.push(new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2]));
          cur = [parsed[i][1], parsed[i][2]];
        } else if (parsed[i][0] === "l") {
          length = length + Math.sqrt(Math.pow(parsed[i][1], 2) + Math.pow(parsed[i][2], 2));
          functions.push(new LinearPosition(cur[0], parsed[i][1] + cur[0], cur[1], parsed[i][2] + cur[1]));
          cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
        } else if (parsed[i][0] === "H") {
          length = length + Math.abs(cur[0] - parsed[i][1]);
          functions.push(new LinearPosition(cur[0], parsed[i][1], cur[1], cur[1]));
          cur[0] = parsed[i][1];
        } else if (parsed[i][0] === "h") {
          length = length + Math.abs(parsed[i][1]);
          functions.push(new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1]));
          cur[0] = parsed[i][1] + cur[0];
        } else if (parsed[i][0] === "V") {
          length = length + Math.abs(cur[1] - parsed[i][1]);
          functions.push(new LinearPosition(cur[0], cur[0], cur[1], parsed[i][1]));
          cur[1] = parsed[i][1];
        } else if (parsed[i][0] === "v") {
          length = length + Math.abs(parsed[i][1]);
          functions.push(new LinearPosition(cur[0], cur[0], cur[1], cur[1] + parsed[i][1]));
          cur[1] = parsed[i][1] + cur[1];
        } else if (parsed[i][0] === "z" || parsed[i][0] === "Z") {
          length = length + Math.sqrt(Math.pow(ringStart[0] - cur[0], 2) + Math.pow(ringStart[1] - cur[1], 2));
          functions.push(new LinearPosition(cur[0], ringStart[0], cur[1], ringStart[1]));
          cur = [ringStart[0], ringStart[1]];
        } else if (parsed[i][0] === "C") {
          curve = new Bezier(cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4], parsed[i][5], parsed[i][6]);
          length = length + curve.getTotalLength();
          cur = [parsed[i][5], parsed[i][6]];
          functions.push(curve);
        } else if (parsed[i][0] === "c") {
          curve = new Bezier(cur[0], cur[1], cur[0] + parsed[i][1], cur[1] + parsed[i][2], cur[0] + parsed[i][3], cur[1] + parsed[i][4], cur[0] + parsed[i][5], cur[1] + parsed[i][6]);
          if (curve.getTotalLength() > 0) {
            length = length + curve.getTotalLength();
            functions.push(curve);
            cur = [parsed[i][5] + cur[0], parsed[i][6] + cur[1]];
          } else {
            functions.push(new LinearPosition(cur[0], cur[0], cur[1], cur[1]));
          }
        } else if (parsed[i][0] === "S") {
          if (i > 0 && ["C", "c", "S", "s"].indexOf(parsed[i - 1][0]) > -1) {
            curve = new Bezier(cur[0], cur[1], 2 * cur[0] - parsed[i - 1][parsed[i - 1].length - 4], 2 * cur[1] - parsed[i - 1][parsed[i - 1].length - 3], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4]);
          } else {
            curve = new Bezier(cur[0], cur[1], cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4]);
          }
          length = length + curve.getTotalLength();
          cur = [parsed[i][3], parsed[i][4]];
          functions.push(curve);
        } else if (parsed[i][0] === "s") {
          if (i > 0 && ["C", "c", "S", "s"].indexOf(parsed[i - 1][0]) > -1) {
            curve = new Bezier(cur[0], cur[1], cur[0] + curve.d.x - curve.c.x, cur[1] + curve.d.y - curve.c.y, cur[0] + parsed[i][1], cur[1] + parsed[i][2], cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
          } else {
            curve = new Bezier(cur[0], cur[1], cur[0], cur[1], cur[0] + parsed[i][1], cur[1] + parsed[i][2], cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
          }
          length = length + curve.getTotalLength();
          cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
          functions.push(curve);
        } else if (parsed[i][0] === "Q") {
          if (cur[0] == parsed[i][1] && cur[1] == parsed[i][2]) {
            curve = new LinearPosition(parsed[i][1], parsed[i][3], parsed[i][2], parsed[i][4]);
          } else {
            curve = new Bezier(cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4]);
          }
          length = length + curve.getTotalLength();
          functions.push(curve);
          cur = [parsed[i][3], parsed[i][4]];
          prev_point = [parsed[i][1], parsed[i][2]];
        } else if (parsed[i][0] === "q") {
          if (!(parsed[i][1] == 0 && parsed[i][2] == 0)) {
            curve = new Bezier(cur[0], cur[1], cur[0] + parsed[i][1], cur[1] + parsed[i][2], cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
          } else {
            curve = new LinearPosition(cur[0] + parsed[i][1], cur[0] + parsed[i][3], cur[1] + parsed[i][2], cur[1] + parsed[i][4]);
          }
          length = length + curve.getTotalLength();
          prev_point = [cur[0] + parsed[i][1], cur[1] + parsed[i][2]];
          cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
          functions.push(curve);
        } else if (parsed[i][0] === "T") {
          if (i > 0 && ["Q", "q", "T", "t"].indexOf(parsed[i - 1][0]) > -1) {
            curve = new Bezier(cur[0], cur[1], 2 * cur[0] - prev_point[0], 2 * cur[1] - prev_point[1], parsed[i][1], parsed[i][2]);
          } else {
            curve = new LinearPosition(cur[0], parsed[i][1], cur[1], parsed[i][2]);
          }
          functions.push(curve);
          length = length + curve.getTotalLength();
          prev_point = [2 * cur[0] - prev_point[0], 2 * cur[1] - prev_point[1]];
          cur = [parsed[i][1], parsed[i][2]];
        } else if (parsed[i][0] === "t") {
          if (i > 0 && ["Q", "q", "T", "t"].indexOf(parsed[i - 1][0]) > -1) {
            curve = new Bezier(cur[0], cur[1], 2 * cur[0] - prev_point[0], 2 * cur[1] - prev_point[1], cur[0] + parsed[i][1], cur[1] + parsed[i][2]);
          } else {
            curve = new LinearPosition(cur[0], cur[0] + parsed[i][1], cur[1], cur[1] + parsed[i][2]);
          }
          length = length + curve.getTotalLength();
          prev_point = [2 * cur[0] - prev_point[0], 2 * cur[1] - prev_point[1]];
          cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[0]];
          functions.push(curve);
        } else if (parsed[i][0] === "A") {
          curve = new Arc(cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4], parsed[i][5], parsed[i][6], parsed[i][7]);
          length = length + curve.getTotalLength();
          cur = [parsed[i][6], parsed[i][7]];
          functions.push(curve);
        } else if (parsed[i][0] === "a") {
          curve = new Arc(cur[0], cur[1], parsed[i][1], parsed[i][2], parsed[i][3], parsed[i][4], parsed[i][5], cur[0] + parsed[i][6], cur[1] + parsed[i][7]);
          length = length + curve.getTotalLength();
          cur = [cur[0] + parsed[i][6], cur[1] + parsed[i][7]];
          functions.push(curve);
        }
        partial_lengths.push(length);
      }
      return svgProperties;
    }
    svgProperties.getTotalLength = function () {
      return length;
    };
    svgProperties.getPointAtLength = function (fractionLength) {
      var fractionPart = getPartAtLength(fractionLength);
      return functions[fractionPart.i].getPointAtLength(fractionPart.fraction);
    };
    svgProperties.getTangentAtLength = function (fractionLength) {
      var fractionPart = getPartAtLength(fractionLength);
      return functions[fractionPart.i].getTangentAtLength(fractionPart.fraction);
    };
    svgProperties.getPropertiesAtLength = function (fractionLength) {
      var fractionPart = getPartAtLength(fractionLength);
      return functions[fractionPart.i].getPropertiesAtLength(fractionPart.fraction);
    };
    svgProperties.getParts = function () {
      var parts = [];
      for (var i = 0; i < functions.length; i++) {
        if (functions[i] != null) {
          var properties = {};
          properties['start'] = functions[i].getPointAtLength(0);
          properties['end'] = functions[i].getPointAtLength(partial_lengths[i] - partial_lengths[i - 1]);
          properties['length'] = partial_lengths[i] - partial_lengths[i - 1];
          (function (func) {
            properties['getPointAtLength'] = function (d) {
              return func.getPointAtLength(d);
            };
            properties['getTangentAtLength'] = function (d) {
              return func.getTangentAtLength(d);
            };
            properties['getPropertiesAtLength'] = function (d) {
              return func.getPropertiesAtLength(d);
            };
          })(functions[i]);
          parts.push(properties);
        }
      }
      return parts;
    };
    var getPartAtLength = function getPartAtLength(fractionLength) {
      if (fractionLength < 0) {
        fractionLength = 0;
      } else if (fractionLength > length) {
        fractionLength = length;
      }
      var i = partial_lengths.length - 1;
      while (partial_lengths[i] >= fractionLength && partial_lengths[i] > 0) {
        i--;
      }
      i++;
      return {
        fraction: fractionLength - partial_lengths[i - 1],
        i: i
      };
    };
    return svgProperties(svgString);
  }
  var RES_CIRCLE = 64;
  var RES_PATH = 128;
  var emptyValue = {
    value: 0
  };
  var pointStringToArray = function pointStringToArray(str) {
    return str.split(" ").filter(function (s) {
      return s !== "";
    }).map(function (p) {
      return p.split(",").map(function (n) {
        return parseFloat(n);
      });
    });
  };
  var getAttributes = function getAttributes(element, attributeList) {
    var indices = attributeList.map(function (attr) {
      for (var i = 0; i < element.attributes.length; i += 1) {
        if (element.attributes[i].nodeName === attr) {
          return i;
        }
      }
      return undefined;
    });
    return indices.map(function (i) {
      return i === undefined ? emptyValue : element.attributes[i];
    }).map(function (attr) {
      return attr.value !== undefined ? attr.value : attr.baseVal.value;
    });
  };
  var svg_line_to_segments = function svg_line_to_segments(line) {
    return [getAttributes(line, ["x1", "y1", "x2", "y2"])];
  };
  var svg_rect_to_segments = function svg_rect_to_segments(rect) {
    var attrs = getAttributes(rect, ["x", "y", "width", "height"]);
    var x = parseFloat(attrs[0]);
    var y = parseFloat(attrs[1]);
    var width = parseFloat(attrs[2]);
    var height = parseFloat(attrs[3]);
    return [[x, y, x + width, y], [x + width, y, x + width, y + height], [x + width, y + height, x, y + height], [x, y + height, x, y]];
  };
  var svg_circle_to_segments = function svg_circle_to_segments(circle) {
    var attrs = getAttributes(circle, ["cx", "cy", "r"]);
    var cx = parseFloat(attrs[0]);
    var cy = parseFloat(attrs[1]);
    var r = parseFloat(attrs[2]);
    return Array.from(Array(RES_CIRCLE)).map(function (_, i) {
      return [cx + r * Math.cos(i / RES_CIRCLE * Math.PI * 2), cy + r * Math.sin(i / RES_CIRCLE * Math.PI * 2)];
    }).map(function (_, i, arr) {
      return [arr[i][0], arr[i][1], arr[(i + 1) % arr.length][0], arr[(i + 1) % arr.length][1]];
    });
  };
  var svg_ellipse_to_segments = function svg_ellipse_to_segments(ellipse) {
    var attrs = getAttributes(ellipse, ["cx", "cy", "rx", "ry"]);
    var cx = parseFloat(attrs[0]);
    var cy = parseFloat(attrs[1]);
    var rx = parseFloat(attrs[2]);
    var ry = parseFloat(attrs[3]);
    return Array.from(Array(RES_CIRCLE)).map(function (_, i) {
      return [cx + rx * Math.cos(i / RES_CIRCLE * Math.PI * 2), cy + ry * Math.sin(i / RES_CIRCLE * Math.PI * 2)];
    }).map(function (_, i, arr) {
      return [arr[i][0], arr[i][1], arr[(i + 1) % arr.length][0], arr[(i + 1) % arr.length][1]];
    });
  };
  var svg_polygon_to_segments = function svg_polygon_to_segments(polygon) {
    var points = "";
    for (var i = 0; i < polygon.attributes.length; i += 1) {
      if (polygon.attributes[i].nodeName === "points") {
        points = polygon.attributes[i].value;
        break;
      }
    }
    return pointStringToArray(points).map(function (_, i, a) {
      return [a[i][0], a[i][1], a[(i + 1) % a.length][0], a[(i + 1) % a.length][1]];
    });
  };
  var svg_polyline_to_segments = function svg_polyline_to_segments(polyline) {
    var circularPath = svg_polygon_to_segments(polyline);
    circularPath.pop();
    return circularPath;
  };
  var svg_path_to_segments = function svg_path_to_segments(path) {
    var d = path.getAttribute("d");
    var prop = PathProperties(d);
    var length = prop.getTotalLength();
    var isClosed = d[d.length - 1] === "Z" || d[d.length - 1] === "z";
    var segmentLength = isClosed ? length / RES_PATH : length / (RES_PATH - 1);
    var pathsPoints = Array.from(Array(RES_PATH)).map(function (_, i) {
      return prop.getPointAtLength(i * segmentLength);
    }).map(function (p) {
      return [p.x, p.y];
    });
    var segments = pathsPoints.map(function (_, i, a) {
      return [a[i][0], a[i][1], a[(i + 1) % a.length][0], a[(i + 1) % a.length][1]];
    });
    if (!isClosed) {
      segments.pop();
    }
    return segments;
  };
  var parsers = {
    line: svg_line_to_segments,
    rect: svg_rect_to_segments,
    circle: svg_circle_to_segments,
    ellipse: svg_ellipse_to_segments,
    polygon: svg_polygon_to_segments,
    polyline: svg_polyline_to_segments,
    path: svg_path_to_segments
  };
  function vkXML$2 (text, step) {
    var ar = text.replace(/>\s{0,}</g, "><").replace(/</g, "~::~<").replace(/\s*xmlns\:/g, "~::~xmlns:").split("~::~");
    var len = ar.length;
    var inComment = false;
    var deep = 0;
    var str = "";
    var space = step != null && typeof step === "string" ? step : "\t";
    var shift = ["\n"];
    for (var si = 0; si < 100; si += 1) {
      shift.push(shift[si] + space);
    }
    for (var ix = 0; ix < len; ix += 1) {
      if (ar[ix].search(/<!/) > -1) {
        str += shift[deep] + ar[ix];
        inComment = true;
        if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1) {
          inComment = false;
        }
      } else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
        str += ar[ix];
        inComment = false;
      } else if (/^<\w/.exec(ar[ix - 1]) && /^<\/\w/.exec(ar[ix]) && /^<[\w:\-\.\,]+/.exec(ar[ix - 1]) == /^<\/[\w:\-\.\,]+/.exec(ar[ix])[0].replace("/", "")) {
        str += ar[ix];
        if (!inComment) {
          deep -= 1;
        }
      } else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) === -1 && ar[ix].search(/\/>/) === -1) {
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
    return str[0] === "\n" ? str.slice(1) : str;
  }
  var isBrowser$4 = function isBrowser() {
    return typeof window !== "undefined";
  };
  var isNode$4 = function isNode() {
    return typeof window === "undefined" && typeof process !== "undefined";
  };
  var htmlString$4 = "<!DOCTYPE html><title> </title>";
  var win$4 = {};
  if (isNode$4()) {
    var _require$1 = require("xmldom"),
        DOMParser$2 = _require$1.DOMParser,
        XMLSerializer$2 = _require$1.XMLSerializer;
    win$4.DOMParser = DOMParser$2;
    win$4.XMLSerializer = XMLSerializer$2;
    win$4.document = new DOMParser$2().parseFromString(htmlString$4, "text/html");
  } else if (isBrowser$4()) {
    win$4.DOMParser = window.DOMParser;
    win$4.XMLSerializer = window.XMLSerializer;
    win$4.document = window.document;
  }
  var parseTransform = function parseTransform(transform) {
    var parsed = transform.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?\s*)+\))+/g);
    var listForm = parsed.map(function (a) {
      return a.match(/[\w\.\-]+/g);
    });
    return listForm.map(function (a) {
      return {
        transform: a.shift(),
        parameters: a.map(function (p) {
          return parseFloat(p);
        })
      };
    });
  };
  var multiply_line_matrix2$1 = function multiply_line_matrix2(line, matrix) {
    return [line[0] * matrix[0] + line[1] * matrix[2] + matrix[4], line[0] * matrix[1] + line[1] * matrix[3] + matrix[5], line[2] * matrix[0] + line[3] * matrix[2] + matrix[4], line[2] * matrix[1] + line[3] * matrix[3] + matrix[5]];
  };
  var multiply_matrices2$1 = function multiply_matrices2(m1, m2) {
    return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
  };
  var matrixFormTranslate = function matrixFormTranslate(params) {
    switch (params.length) {
      case 1:
        return [1, 0, 0, 1, params[0], 0];
      case 2:
        return [1, 0, 0, 1, params[0], params[1]];
      default:
        console.warn("improper translate, ".concat(params));
    }
    return undefined;
  };
  var matrixFormRotate = function matrixFormRotate(params) {
    var cos_p = Math.cos(params[0] / 180 * Math.PI);
    var sin_p = Math.sin(params[0] / 180 * Math.PI);
    switch (params.length) {
      case 1:
        return [cos_p, sin_p, -sin_p, cos_p, 0, 0];
      case 3:
        return [cos_p, sin_p, -sin_p, cos_p, -params[1] * cos_p + params[2] * sin_p + params[1], -params[1] * sin_p - params[2] * cos_p + params[2]];
      default:
        console.warn("improper rotate, ".concat(params));
    }
    return undefined;
  };
  var matrixFormScale = function matrixFormScale(params) {
    switch (params.length) {
      case 1:
        return [params[0], 0, 0, params[0], 0, 0];
      case 2:
        return [params[0], 0, 0, params[1], 0, 0];
      default:
        console.warn("improper scale, ".concat(params));
    }
    return undefined;
  };
  var matrixFormSkewX = function matrixFormSkewX(params) {
    return [1, 0, Math.tan(params[0] / 180 * Math.PI), 1, 0, 0];
  };
  var matrixFormSkewY = function matrixFormSkewY(params) {
    return [1, Math.tan(params[0] / 180 * Math.PI), 0, 1, 0, 0];
  };
  var matrixForm = function matrixForm(transformType, params) {
    switch (transformType) {
      case "translate":
        return matrixFormTranslate(params);
      case "rotate":
        return matrixFormRotate(params);
      case "scale":
        return matrixFormScale(params);
      case "skewX":
        return matrixFormSkewX(params);
      case "skewY":
        return matrixFormSkewY(params);
      case "matrix":
        return params;
      default:
        console.warn("unknown transform type ".concat(transformType));
    }
    return undefined;
  };
  var transformIntoMatrix = function transformIntoMatrix(string) {
    return parseTransform(string).map(function (el) {
      return matrixForm(el.transform, el.parameters);
    }).filter(function (a) {
      return a !== undefined;
    }).reduce(function (a, b) {
      return multiply_matrices2$1(a, b);
    }, [1, 0, 0, 1, 0, 0]);
  };
  var getElementsTransform = function getElementsTransform(element) {
    if (typeof element.getAttribute !== "function") {
      return [1, 0, 0, 1, 0, 0];
    }
    var transformAttr = element.getAttribute("transform");
    if (transformAttr != null && transformAttr !== "") {
      return transformIntoMatrix(transformAttr);
    }
    return [1, 0, 0, 1, 0, 0];
  };
  var apply_nested_transforms = function apply_nested_transforms(element) {
    var stack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [1, 0, 0, 1, 0, 0];
    var local = multiply_matrices2$1(stack, getElementsTransform(element));
    element.matrix = local;
    if (element.tagName === "g" || element.tagName === "svg") {
      if (element.childNodes == null) {
        return;
      }
      Array.from(element.childNodes).forEach(function (child) {
        return apply_nested_transforms(child, local);
      });
    }
  };
  var parseable = Object.keys(parsers);
  var svgNS$2 = "http://www.w3.org/2000/svg";
  var DEFAULTS = {
    string: true,
    svg: false
  };
  var svgAttributes = ["version", "xmlns", "contentScriptType", "contentStyleType", "baseProfile", "class", "externalResourcesRequired", "x", "y", "width", "height", "viewBox", "preserveAspectRatio", "zoomAndPan", "style"];
  var shape_attr = {
    line: ["x1", "y1", "x2", "y2"],
    rect: ["x", "y", "width", "height"],
    circle: ["cx", "cy", "r"],
    ellipse: ["cx", "cy", "rx", "ry"],
    polygon: ["points"],
    polyline: ["points"],
    path: ["d"]
  };
  var stringToDomTree = function stringToDomTree(input) {
    return typeof input === "string" || input instanceof String ? new win$4.DOMParser().parseFromString(input, "text/xml").documentElement : input;
  };
  var flatten_tree = function flatten_tree(element) {
    if (element.tagName === "g" || element.tagName === "svg") {
      if (element.childNodes == null) {
        return [];
      }
      return Array.from(element.childNodes).map(function (child) {
        return flatten_tree(child);
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
    }
    return [element];
  };
  var attribute_list = function attribute_list(element) {
    return Array.from(element.attributes).filter(function (a) {
      return shape_attr[element.tagName].indexOf(a.name) === -1;
    });
  };
  var objectifyAttributeList = function objectifyAttributeList(list) {
    var obj = {};
    list.forEach(function (a) {
      obj[a.nodeName] = a.value;
    });
    return obj;
  };
  var Segmentize = function Segmentize(input, options) {
    var inputSVG = stringToDomTree(input);
    apply_nested_transforms(inputSVG);
    var elements = flatten_tree(inputSVG);
    var lineSegments = elements.filter(function (e) {
      return parseable.indexOf(e.tagName) !== -1;
    }).map(function (e) {
      return parsers[e.tagName](e).map(function (unit) {
        return multiply_line_matrix2$1(unit, e.matrix);
      }).map(function (unit) {
        return [].concat(_toConsumableArray$1(unit), [attribute_list(e)]);
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    lineSegments.filter(function (a) {
      return a[4] !== undefined;
    }).forEach(function (seg) {
      var noTransforms = seg[4].filter(function (a) {
        return a.nodeName !== "transform";
      });
      seg[4] = objectifyAttributeList(noTransforms);
    });
    var o = Object.assign(Object.assign({}, DEFAULTS), options);
    if (o.svg) {
      var newSVG = win$4.document.createElementNS(svgNS$2, "svg");
      svgAttributes.map(function (a) {
        return {
          attribute: a,
          value: inputSVG.getAttribute(a)
        };
      }).filter(function (obj) {
        return obj.value != null && obj.value !== "";
      }).forEach(function (obj) {
        return newSVG.setAttribute(obj.attribute, obj.value);
      });
      if (newSVG.getAttribute("xmlns") === null) {
        newSVG.setAttribute("xmlns", svgNS$2);
      }
      var styles = elements.filter(function (e) {
        return e.tagName === "style" || e.tagName === "defs";
      });
      if (styles.length > 0) {
        styles.map(function (style) {
          return style.cloneNode(true);
        }).forEach(function (style) {
          return newSVG.appendChild(style);
        });
      }
      lineSegments.forEach(function (s) {
        var line = win$4.document.createElementNS(svgNS$2, "line");
        line.setAttributeNS(null, "x1", s[0]);
        line.setAttributeNS(null, "y1", s[1]);
        line.setAttributeNS(null, "x2", s[2]);
        line.setAttributeNS(null, "y2", s[3]);
        if (s[4] != null) {
          Object.keys(s[4]).forEach(function (key) {
            return line.setAttribute(key, s[4][key]);
          });
        }
        newSVG.appendChild(line);
      });
      if (o.string === false) {
        return newSVG;
      }
      var stringified = new win$4.XMLSerializer().serializeToString(newSVG);
      var beautified = vkXML$2(stringified);
      return beautified;
    }
    return lineSegments;
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
    const segments = Segmentize(svg);
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
      const svg = (new win$3.DOMParser())
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
    console.log("From to", ...args);
    switch (from) {
      case "fold":
        switch (to) {
          case "fold": return data;
          case "oripa": return oripa.fromFold(data);
          case "svg": return drawFOLD.svg(data);
          default: break;
        }
        break;
      case "oripa":
        switch (to) {
          case "fold": return oripa.toFold(data, true);
          case "oripa": return data;
          case "svg": return drawFOLD.svg(oripa.toFold(data, true));
          default: break;
        }
        break;
      case "svg":
        switch (to) {
          case "fold": return SVGtoFOLD(data, ...args);
          case "oripa": return oripa.fromFold(SVGtoFOLD(data, ...args));
          case "svg": return data;
          default: break;
        }
        break;
      default: break;
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
    const loaded = load$1(...file);
    const c = {};
    ["fold", "svg", "oripa"].forEach(filetype => permute(filetype)
      .forEach(key => Object.defineProperty(c, key, {
        value: (...o) => from_to(loaded.data, loaded.type, filetype, ...o)
      })));
    return c;
  };

  const complete = function (graph) {
    if (graph.vertices_coords == null
      || graph.edges_vertices == null) { return; }
    if (graph.vertices_vertices == null) {
      convert.edges_vertices_to_vertices_vertices_sorted(graph);
    }
    if (graph.faces_vertices == null) {
      convert.vertices_vertices_to_faces_vertices(graph);
    }
    if (graph.faces_edges == null) {
      convert.faces_vertices_to_faces_edges(graph);
    }
    if (graph.edges_faces == null) {
      graph.edges_faces = make_edges_faces(graph);
    }
    if (graph.vertices_faces == null) {
      graph.vertices_faces = make_vertices_faces(graph);
    }
    if (graph.edges_length == null) {
      graph.edges_length = make_edges_length(graph);
    }
    if (graph.edges_foldAngle == null
      && graph.edges_assignment != null) {
      graph.edges_foldAngle = graph.edges_assignment
        .map(a => edge_assignment_to_foldAngle(a));
    }
    if (graph.edges_assignment == null
      && graph.edges_foldAngle != null) {
      graph.edges_assignment = graph.edges_foldAngle.map((a) => {
        if (a === 0) return "F";
        if (a < 0) return "M";
        if (a > 0) return "V";
        return "U";
      });
    }
    if (graph.faces_faces == null) {
      graph.faces_faces = make_faces_faces(graph);
    }
    if (graph.vertices_edges == null) {
      graph.vertices_edges = make_vertices_edges(graph);
    }
  };
  const rebuild = function (graph, epsilon = math.core.EPSILON) {
    ["vertices_vertices", "vertices_edges", "vertices_faces",
      "edges_faces", "edges_edges",
      "faces_vertices", "faces_edges", "faces_faces"].filter(a => a in graph)
      .forEach(key => delete graph[key]);
    Object.keys(graph)
      .filter(s => s.includes("re:"))
      .forEach(key => delete graph[key]);
    const rebuilt = fragment(graph, epsilon);
    remove_geometry_key_indices(rebuilt, "edges", get_duplicate_edges_old(rebuilt));
    convert.edges_vertices_to_vertices_vertices_sorted(rebuilt);
    convert.vertices_vertices_to_faces_vertices(rebuilt);
    convert.faces_vertices_to_faces_edges(rebuilt);
    rebuilt.edges_faces = make_edges_faces(rebuilt);
    rebuilt.vertices_faces = make_vertices_faces(rebuilt);
    rebuilt.edges_length = make_edges_length(rebuilt);
    Object.assign(graph, rebuilt);
    if (!Validate.edges_assignment(graph)) {
      graph.edges_assignment = Array(graph.edges_vertices.length).fill("F");
    }
    if ("file_spec" in graph === false) { graph.file_spec = 1.1; }
    if ("frame_attributes" in graph === false) {
      graph.frame_attributes = ["2D"];
    }
    if ("frame_classes" in graph === false) {
      graph.frame_classes = ["creasePattern"];
    }
  };

  var rebuild$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    complete: complete,
    rebuild: rebuild
  });

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
    const faceCount = faces_count(graph);
    graph["faces_re:preindex"] = Array.from(Array(faceCount)).map((_, i) => i);
    if ("faces_re:matrix" in graph === false) {
      graph["faces_re:matrix"] = make_faces_matrix(graph, face_index);
    }
    graph["faces_re:coloring"] = faces_coloring_from_faces_matrix(
      graph["faces_re:matrix"]
    );
    graph["faces_re:creases"] = graph["faces_re:matrix"]
      .map(mat => math.core.make_matrix2_inverse(mat))
      .map(mat => math.core.multiply_line_matrix2(point, vector, mat));
    graph["faces_re:center"] = Array.from(Array(faceCount))
      .map((_, i) => make_face_center_fast(graph, i));
    graph["faces_re:sidedness"] = Array.from(Array(faceCount))
      .map((_, i) => get_face_sidedness(
        graph["faces_re:creases"][i][0],
        graph["faces_re:creases"][i][1],
        graph["faces_re:center"][i],
        graph["faces_re:coloring"][i]
      ));
  };
  const prepare_extensions = function (graph) {
    const facesCount = faces_count(graph);
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
  const fold_through = function (
    graph,
    point,
    vector,
    face_index,
    assignment = "V"
  ) {
    let opposite_crease = assignment;
    if (assignment === "M" || assignment === "m") {
      opposite_crease = "V";
    } else if (assignment === "V" || assignment === "v") {
      opposite_crease = "M";
    }
    if (face_index == null) {
      const containing_point = face_containing_point(graph, point);
      face_index = (containing_point === undefined) ? 0 : containing_point;
    }
    prepare_extensions(graph);
    prepare_to_fold(graph, point, vector, face_index);
    const folded = clone(graph);
    const faces_split = Array.from(Array(faces_count(graph)))
      .map((_, i) => i)
      .reverse()
      .map((i) => {
        const diff = split_convex_polygon$1(
          folded, i,
          folded["faces_re:creases"][i][0],
          folded["faces_re:creases"][i][1],
          folded["faces_re:coloring"][i] ? assignment : opposite_crease
        );
        if (diff == null || diff.faces == null) { return undefined; }
        diff.faces.replace.forEach(replace => replace.new
          .map(el => el.index)
          .map(index => index + diff.faces.map[index])
          .forEach((i) => {
            folded["faces_re:center"][i] = make_face_center_fast(folded, i);
            folded["faces_re:sidedness"][i] = get_face_sidedness(
              graph["faces_re:creases"][replace.old][0],
              graph["faces_re:creases"][replace.old][1],
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
            graph["faces_re:creases"][0][1],
            graph["faces_re:creases"][0][0]
          )
        )
      );
    }
    const folded_faces_matrix = make_faces_matrix(folded, face_0_newIndex)
      .map(m => math.core.multiply_matrices2(face_0_preMatrix, m));
    folded["faces_re:coloring"] = faces_coloring_from_faces_matrix(
      folded_faces_matrix
    );
    const crease_0 = math.core.multiply_line_matrix2(
      graph["faces_re:creases"][0][0],
      graph["faces_re:creases"][0][1],
      face_0_preMatrix
    );
    const fold_direction = math.core
      .normalize([crease_0[1][1], -crease_0[1][0]]);
    const split_points = faces_split
      .map((el, i) => (el === undefined ? undefined : el.edge.map(p => math.core
        .multiply_vector2_matrix2(p, graph["faces_re:matrix"][i]))))
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
    folded["faces_re:matrix"] = folded_faces_matrix.map(m => m.map(n => math.core.clean_number(n, 14)));
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

  const alternating_sum = function (...numbers) {
    return [0, 1].map(even_odd => numbers
      .filter((_, i) => i % 2 === even_odd)
      .reduce((a, b) => a + b, 0));
  };
  const kawasaki_flatness = function (...sectorAngles) {
    return alternating_sum(...sectorAngles)
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
  const kawasaki_solutions_radians = function (...vectors_radians) {
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
  const kawasaki_solutions = function (...vectors) {
    const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
    return kawasaki_solutions_radians(...vectors_radians)
      .map(a => (a === undefined
        ? undefined
        : [math.core.clean_number(Math.cos(a), 14), math.core.clean_number(Math.sin(a), 14)]));
  };
  function kawasaki_collapse(graph, vertex, face, crease_direction = "F") {
    const kawasakis = kawasaki_solutions(graph, vertex);
    const origin = graph.vertices_coords[vertex];
    split_convex_polygon$1(graph, face, origin, kawasakis[face], crease_direction);
  }

  var kawasaki = /*#__PURE__*/Object.freeze({
    __proto__: null,
    alternating_sum: alternating_sum,
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
    kawasaki_solutions_radians: kawasaki_solutions_radians,
    kawasaki_solutions: kawasaki_solutions,
    kawasaki_collapse: kawasaki_collapse
  });

  var axiom_instructions_data = "{\n  \"ar\": [null,\n    \"اصنع خطاً يمر بنقطتين\",\n    \"اصنع خطاً عن طريق طي نقطة واحدة إلى أخرى\",\n    \"اصنع خطاً عن طريق طي خط واحد على آخر\",\n    \"اصنع خطاً يمر عبر نقطة واحدة ويجعل خطاً واحداً فوق نفسه\",\n    \"اصنع خطاً يمر بالنقطة الأولى ويجعل النقطة الثانية على الخط\",\n    \"اصنع خطاً يجلب النقطة الأولى إلى الخط الأول والنقطة الثانية إلى الخط الثاني\",\n    \"اصنع خطاً يجلب نقطة إلى خط ويجعل خط ثاني فوق نفسه\"\n  ],\n  \"de\": [null,\n    \"Falte eine Linie durch zwei Punkte\",\n    \"Falte zwei Punkte aufeinander\",\n    \"Falte zwei Linien aufeinander\",\n    \"Falte eine Linie auf sich selbst, falte dabei durch einen Punkt\",\n    \"Falte einen Punkt auf eine Linie, falte dabei durch einen anderen Punkt\",\n    \"Falte einen Punkt auf eine Linie und einen weiteren Punkt auf eine weitere Linie\",\n    \"Falte einen Punkt auf eine Linie und eine weitere Linie in sich selbst zusammen\"\n  ],\n  \"en\": [null,\n    \"fold a line through two points\",\n    \"fold two points together\",\n    \"fold two lines together\",\n    \"fold a line on top of itself, creasing through a point\",\n    \"fold a point to a line, creasing through another point\",\n    \"fold a point to a line and another point to another line\",\n    \"fold a point to a line and another line onto itself\"\n  ],\n  \"es\": [null,\n    \"dobla una línea entre dos puntos\",\n    \"dobla dos puntos juntos\",\n    \"dobla y une dos líneas\",\n    \"dobla una línea sobre sí misma, doblándola hacia un punto\",\n    \"dobla un punto hasta una línea, doblándola a través de otro punto\",\n    \"dobla un punto hacia una línea y otro punto hacia otra línea\",\n    \"dobla un punto hacia una línea y otra línea sobre sí misma\"\n  ],\n  \"fr\":[null,\n    \"créez un pli passant par deux points\",\n    \"pliez pour superposer deux points\",\n    \"pliez pour superposer deux lignes\",\n    \"rabattez une ligne sur elle-même à l'aide d'un pli qui passe par un point\",\n    \"rabattez un point sur une ligne à l'aide d'un pli qui passe par un autre point\",\n    \"rabattez un point sur une ligne et un autre point sur une autre ligne\",\n    \"rabattez un point sur une ligne et une autre ligne sur elle-même\"\n  ],\n  \"hi\": [null,\n    \"एक क्रीज़ बनाएँ जो दो स्थानों से गुजरता है\",\n    \"एक स्थान को दूसरे स्थान पर मोड़कर एक क्रीज़ बनाएँ\",\n    \"एक रेखा पर दूसरी रेखा को मोड़कर क्रीज़ बनाएँ\",\n    \"एक क्रीज़ बनाएँ जो एक स्थान से गुजरता है और एक रेखा को स्वयं के ऊपर ले आता है\",\n    \"एक क्रीज़ बनाएँ जो पहले स्थान से गुजरता है और दूसरे स्थान को रेखा पर ले आता है\",\n    \"एक क्रीज़ बनाएँ जो पहले स्थान को पहली रेखा पर और दूसरे स्थान को दूसरी रेखा पर ले आता है\",\n    \"एक क्रीज़ बनाएँ जो एक स्थान को एक रेखा पर ले आता है और दूसरी रेखा को स्वयं के ऊपर ले आता है\"\n  ],\n  \"jp\": [null,\n    \"2点に沿って折り目を付けます\",\n    \"2点を合わせて折ります\",\n    \"2つの線を合わせて折ります\",\n    \"点を通過させ、既にある線に沿って折ります\",\n    \"点を線沿いに合わせ別の点を通過させ折ります\",\n    \"線に向かって点を折り、同時にもう一方の線に向かってもう一方の点を折ります\",\n    \"線に向かって点を折り、同時に別の線をその上に折ります\"\n  ],\n  \"ko\": [null,\n    \"두 점을 통과하는 선으로 접으세요\",\n    \"두 점을 함께 접으세요\",\n    \"두 선을 함께 접으세요\",\n    \"그 위에 선을 접으면서 점을 통과하게 접으세요\",\n    \"점을 선으로 접으면서, 다른 점을 지나게 접으세요\",\n    \"점을 선으로 접고 다른 점을 다른 선으로 접으세요\",\n    \"점을 선으로 접고 다른 선을 그 위에 접으세요\"\n  ],\n  \"ms\": [null,\n    \"lipat garisan melalui dua titik\",\n    \"lipat dua titik bersama\",\n    \"lipat dua garisan bersama\",\n    \"lipat satu garisan di atasnya sendiri, melipat melalui satu titik\",\n    \"lipat satu titik ke garisan, melipat melalui titik lain\",\n    \"lipat satu titik ke garisan dan satu lagi titik ke garisan lain\",\n    \"lipat satu titik ke garisan dan satu lagi garisan di atasnya sendiri\"\n  ],\n  \"pt\": [null,\n    \"dobre uma linha entre dois pontos\",\n    \"dobre os dois pontos para uni-los\",\n    \"dobre as duas linhas para uni-las\",\n    \"dobre uma linha sobre si mesma, criando uma dobra ao longo de um ponto\",\n    \"dobre um ponto até uma linha, criando uma dobra ao longo de outro ponto\",\n    \"dobre um ponto até uma linha e outro ponto até outra linha\",\n    \"dobre um ponto até uma linha e outra linha sobre si mesma\"\n  ],\n  \"ru\": [null,\n    \"сложите линию через две точки\",\n    \"сложите две точки вместе\",\n    \"сложите две линии вместе\",\n    \"сверните линию сверху себя, сгибая через точку\",\n    \"сложите точку в линию, сгибая через другую точку\",\n    \"сложите точку в линию и другую точку в другую линию\",\n    \"сложите точку в линию и другую линию на себя\"\n  ],\n  \"tr\": [null,\n    \"iki noktadan geçen bir çizgi boyunca katla\",\n    \"iki noktayı birbirine katla\",\n    \"iki çizgiyi birbirine katla\",\n    \"bir noktadan kıvırarak kendi üzerindeki bir çizgi boyunca katla\",\n    \"başka bir noktadan kıvırarak bir noktayı bir çizgiye katla\",\n    \"bir noktayı bir çizgiye ve başka bir noktayı başka bir çizgiye katla\",\n    \"bir noktayı bir çizgiye ve başka bir çizgiyi kendi üzerine katla\"\n  ],\n  \"vi\": [null,\n    \"tạo một nếp gấp đi qua hai điểm\",\n    \"tạo nếp gấp bằng cách gấp một điểm này sang điểm khác\",\n    \"tạo nếp gấp bằng cách gấp một đường lên một đường khác\",\n    \"tạo một nếp gấp đi qua một điểm và đưa một đường lên trên chính nó\",\n    \"tạo một nếp gấp đi qua điểm đầu tiên và đưa điểm thứ hai lên đường thẳng\",\n    \"tạo một nếp gấp mang điểm đầu tiên đến đường đầu tiên và điểm thứ hai cho đường thứ hai\",\n    \"tạo một nếp gấp mang lại một điểm cho một đường và đưa một đường thứ hai lên trên chính nó\"\n  ],\n  \"zh\": [null,\n    \"通過兩點折一條線\",\n    \"將兩點折疊起來\",\n    \"將兩條線折疊在一起\",\n    \"通過一個點折疊一條線在自身上面\",\n    \"將一個點，通過另一個點折疊成一條線，\",\n    \"將一個點折疊為一條線，再將另一個點折疊到另一條線\",\n    \"將一個點折疊成一條線，另一條線折疊到它自身上\"\n  ]\n}\n";

  const axiom_instructions = JSON.parse(axiom_instructions_data);
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

  const apply_run_diff = function (graph, diff) {
    const lengths = {
      vertices: vertices_count(graph),
      edges: edges_count(graph),
      faces: faces_count(graph)
    };
    if (diff.new) {
      Object.keys(diff.new)
        .forEach(type => diff.new[type]
          .forEach((newElem, i) => Object.keys(newElem)
            .forEach((key) => { graph[key][lengths[type] + i] = newElem[key]; })));
    }
    if (diff.update) {
      Object.keys(diff.update)
        .forEach(i => Object.keys(diff.update[i])
          .forEach((key) => { graph[key][i] = diff.update[i][key]; }));
    }
    if (diff.remove) {
      if (diff.remove.faces) { remove_geometry_key_indices(graph, "faces", diff.remove.faces); }
      if (diff.remove.edges) { remove_geometry_key_indices(graph, "edges", diff.remove.edges); }
      if (diff.remove.vertices) { remove_geometry_key_indices(graph, "vertices", diff.remove.vertices); }
    }
    return diff;
  };
  const merge_run_diffs = function (graph, target, source) {
    const vertices_length = vertices_count(graph);
    const edges_length = edges_count(graph);
    const faces_length = faces_count(graph);
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
    const prefixKeys = get_geometry_keys_with_prefix(graph, geometry_prefix);
    const result = {};
    prefixKeys.forEach((key) => { result[key] = graph[key][index]; });
    return result;
  };
  const add_edge = function (graph, a, b, c, d, assignment = "U") {
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
    let vertices_length = vertices_count(graph);
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
    result.new.edges
      .filter(e => e.edges_assignment === undefined)
      .forEach((e) => { e.edges_assignment = assignment; });
    result.apply = () => apply_run_diff(graph, result);
    return result;
  };

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

  var empty = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_title\": \"\",\n\t\"file_description\": \"\",\n\t\"file_classes\": [],\n\t\"file_frames\": [],\n\n\t\"frame_author\": \"\",\n\t\"frame_title\": \"\",\n\t\"frame_description\": \"\",\n\t\"frame_attributes\": [],\n\t\"frame_classes\": [],\n\t\"frame_unit\": \"\",\n\n\t\"vertices_coords\": [],\n\t\"vertices_vertices\": [],\n\t\"vertices_faces\": [],\n\n\t\"edges_vertices\": [],\n\t\"edges_faces\": [],\n\t\"edges_assignment\": [],\n\t\"edges_foldAngle\": [],\n\t\"edges_length\": [],\n\n\t\"faces_vertices\": [],\n\t\"faces_edges\": [],\n\n\t\"edgeOrders\": [],\n\t\"faceOrders\": []\n}\n";

  var square = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [1,0], [1,1], [0,1]],\n\t\"vertices_vertices\": [[1,3], [2,0], [3,1], [0,2]],\n\t\"vertices_faces\": [[0], [0], [0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,0]],\n\t\"edges_faces\": [[0], [0], [0], [0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0],\n\t\"edges_length\": [1, 1, 1, 1],\n\t\"faces_vertices\": [[0,1,2,3]],\n\t\"faces_edges\": [[0,1,2,3]]\n}";

  var book = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,1], [0.5,1], [0,1]],\n\t\"vertices_vertices\": [[1,5], [2,4,0], [3,1], [4,2], [5,1,3], [0,4]],\n\t\"vertices_faces\": [[0], [0,1], [1], [1], [1,0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [1,4]],\n\t\"edges_faces\": [[0], [1], [1], [1], [0], [0], [0,1]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180],\n\t\"edges_length\": [0.5, 0.5, 1, 0.5, 0.5, 1, 1],\n\t\"faces_vertices\": [[1,4,5,0], [4,1,2,3]],\n\t\"faces_edges\": [[6,4,5,0], [6,1,2,3]]\n}";

  var blintz = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"blintz base\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,0.5], [1,1], [0.5,1], [0,1], [0,0.5]],\n\t\"vertices_vertices\": [[1,7], [2,3,7,0], [3,1], [4,5,1,2], [5,3], [6,7,3,4], [7,5], [0,1,5,6]],\n\t\"vertices_faces\": [[0], [1,4,0], [1], [2,4,1], [2], [3,4,2], [3], [0,4,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,3], [3,5], [5,7], [7,1]],\n\t\"edges_faces\": [[0], [1], [1], [2], [2], [3], [3], [0], [1,4], [2,4], [3,4], [0,4]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\",\"V\",\"V\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.7071067811865476, 0.7071067811865476, 0.7071067811865476, 0.7071067811865476],\n\t\"faces_vertices\": [[0,1,7], [2,3,1], [4,5,3], [6,7,5], [1,3,5,7]],\n\t\"faces_edges\": [[0,11,7], [2,8,1], [4,9,3], [6,10,5], [8,9,10,11]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedForm\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.5,0.5], [0.5,0.0], [0.5,0.5], [1.0,0.5], [0.5,0.5], [0.5,1.0], [0.5,0.5], [0.0,0.5]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 180, 180, 180, 180],\n\t\t\"faceOrders\": [[0,4,1], [1,4,1], [2,4,1], [3,4,1]]\n\t}]\n}";

  var kite = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"kite base\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [\n\t\t[0,0],\n\t\t[0.414213562373095,0],\n\t\t[1,0],\n\t\t[1,0.585786437626905],\n\t\t[1,1],\n\t\t[0,1]\n\t],\n\t\"vertices_vertices\": [ [1,5], [2,5,0], [3,5,1], [4,5,2], [5,3], [0,1,2,3,4] ],\n\t\"vertices_faces\": [ [0], [1,0], [2,1], [3,2], [3], [0,1,2,3] ],\n\t\"edges_vertices\": [\n\t\t[0,1],\n\t\t[1,2],\n\t\t[2,3],\n\t\t[3,4],\n\t\t[4,5],\n\t\t[5,0],\n\t\t[5,1],\n\t\t[3,5],\n\t\t[5,2]\n\t],\n\t\"edges_faces\": [[0], [1], [2], [3], [3], [0], [0,1], [3,2], [1,2]],\n\t\"edges_assignment\": [\"B\", \"B\", \"B\", \"B\", \"B\", \"B\", \"V\", \"V\", \"F\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.414213562373095, 0.585786437626905, 0.585786437626905, 0.414213562373095, 1, 1, 1.082392200292394, 1.082392200292394, 1.414213562373095],\n\t\"faces_vertices\": [\n\t\t[0,1,5],\n\t\t[1,2,5],\n\t\t[2,3,5],\n\t\t[3,4,5]\n\t],\n\t\"faces_edges\": [\n\t\t[0,6,5],\n\t\t[1,8,6],\n\t\t[2,7,8],\n\t\t[3,4,7]\n\t],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedForm\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [\n\t\t\t[0.707106781186548,0.292893218813452],\n\t\t\t[1,0],\n\t\t\t[0.707106781186548,0.292893218813452],\n\t\t\t[0,1],\n\t\t\t[0.414213562373095,0],\n\t\t\t[1,0.585786437626905]\n\t\t],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180, 180, 0],\n\t\t\"faceOrders\": [[0,1,1], [3,2,1]]\n\t}]\n}";

  var fish = "{\n  \"file_spec\": 1.1,\n  \"file_creator\": \"\",\n  \"file_author\": \"\",\n  \"file_classes\": [\"singleModel\"],\n  \"frame_title\": \"\",\n  \"frame_classes\": [\"creasePattern\"],\n  \"frame_attributes\": [\"2D\"],\n  \"vertices_coords\": [\n    [0,0],\n    [1,0],\n    [1,1],\n    [0,1],\n    [0.292893218813452,0.292893218813452],\n    [0.707106781186548,0.707106781186548],\n    [0.292893218813452,0],\n    [1,0.707106781186548]\n  ],\n  \"edges_vertices\": [\n  \t[2,3], [3,0], [3,1], [0,4], [1,4], [3,4], [1,5], [2,5], [3,5], [4,6], [0,6], [6,1], [5,7], [1,7], [7,2]\n  ],\n  \"edges_assignment\": [\n  \t\"B\", \"B\", \"F\", \"M\", \"M\", \"M\", \"M\", \"M\", \"M\", \"V\", \"B\", \"B\", \"V\", \"B\", \"B\"\n  ],\n  \"file_frames\": [{\n    \"frame_classes\": [\"foldedForm\"],\n    \"frame_parent\": 0,\n    \"frame_inherit\": true,\n    \"vertices_coords\":[[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.5,0.5],[0.5,0.5]]\n  }],\n  \"vertices_vertices\": [\n    [6,4,3],\n    [7,5,3,4,6],\n    [5,7,3],\n    [0,4,1,5,2],\n    [0,6,1,3],\n    [1,7,2,3],\n    [1,4,0],\n    [1,2,5]\n  ],\n  \"faces_vertices\": [\n    [4,0,6],\n    [3,0,4],\n    [5,1,7],\n    [3,1,5],\n    [4,1,3],\n    [6,1,4],\n    [5,2,3],\n    [7,2,5]\n  ],\n  \"faces_edges\": [\n    [3,10,9],\n    [1,3,5],\n    [6,13,12],\n    [2,6,8],\n    [4,2,5],\n    [11,4,9],\n    [7,0,8],\n    [14,7,12]\n  ],\n  \"edges_faces\": [[6], [1], [3,4], [0,1], [4,5], [1,4], [2,3], [6,7], [3,6], [0,5], [0], [5], [2,7], [2], [7]],\n  \"vertices_faces\": [[0,1], [2,3,4,5], [6,7], [1,3,4,6], [0,1,4,5], [2,3,6,7], [0,5], [2,7]],\n  \"edges_length\": [1, 1, 1.4142135623730951, 0.41421356237309437, 0.7653668647301798, 0.7653668647301798, 0.7653668647301798, 0.41421356237309437, 0.7653668647301798, 0.292893218813452, 0.292893218813452, 0.707106781186548, 0.292893218813452, 0.707106781186548, 0.292893218813452],\n  \"edges_foldAngle\": [0, 0, 0, -180, -180, -180, -180, -180, -180, 180, 0, 0, 180, 0, 0],\n  \"faces_faces\": [\n  \t[1,5], [0,4], [3,7], [2,4,6], [3,1,5], [4,0], [3,7], [6,2]\n  ],\n  \"vertices_edges\": [\n    [1,3,10],\n    [2,4,6,11,13],\n    [0,7,14],\n    [0,1,2,5,8],\n    [3,4,5,9],\n    [6,7,8,12],\n    [9,10,11],\n    [12,13,14]\n  ]\n}\n";

  var bird = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.207106781186548,0.5],[0.5,0.207106781186548],[0.792893218813452,0.5],[0.5,0.792893218813452],[0.353553390593274,0.646446609406726],[0.646446609406726,0.646446609406726],[0.646446609406726,0.353553390593274],[0.353553390593274,0.353553390593274],[0,0.5],[0.5,0],[1,0.5],[0.5,1]],\n\t\"edges_vertices\": [[3,5],[5,9],[3,9],[3,13],[5,13],[0,5],[0,13],[0,12],[5,12],[4,5],[4,12],[4,9],[0,6],[6,12],[0,14],[6,14],[1,6],[1,14],[1,11],[6,11],[4,6],[4,11],[1,7],[7,11],[1,15],[7,15],[2,7],[2,15],[2,10],[7,10],[4,7],[4,10],[2,8],[8,10],[2,16],[8,16],[3,8],[3,16],[8,9],[4,8]],\n\t\"edges_faces\": [[0,1],[0,5],[21,0],[1],[2,1],[2,3],[2],[3,6],[4,3],[4,5],[11,4],[5,22],[6,7],[6,11],[7],[8,7],[8,9],[8],[9,12],[10,9],[10,11],[17,10],[12,13],[12,17],[13],[14,13],[14,15],[14],[15,18],[16,15],[16,17],[23,16],[18,19],[18,23],[19],[20,19],[20,21],[20],[22,21],[22,23]],\n\t\"edges_assignment\": [\"M\",\"F\",\"V\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"V\",\"F\",\"M\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"M\"],\n\t\"faces_vertices\": [[3,5,9],[5,3,13],[0,5,13],[5,0,12],[4,5,12],[5,4,9],[0,6,12],[6,0,14],[1,6,14],[6,1,11],[4,6,11],[6,4,12],[1,7,11],[7,1,15],[2,7,15],[7,2,10],[4,7,10],[7,4,11],[2,8,10],[8,2,16],[3,8,16],[8,3,9],[4,8,9],[8,4,10]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,4,6],[5,7,8],[9,8,10],[9,11,1],[12,13,7],[12,14,15],[16,15,17],[16,18,19],[20,19,21],[20,10,13],[22,23,18],[22,24,25],[26,25,27],[26,28,29],[30,29,31],[30,21,23],[32,33,28],[32,34,35],[36,35,37],[36,2,38],[39,38,11],[39,31,33]]\n}";

  var frog = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0,0.5],[0.5,0],[1,0.5],[0.5,1],[0.146446609406726,0.353553390593274],[0.353553390593274,0.146446609406726],[0.646446609406726,0.146446609406726],[0.853553390593274,0.353553390593274],[0.853553390593274,0.646446609406726],[0.646446609406726,0.853553390593274],[0.353553390593274,0.853553390593274],[0.146446609406726,0.646446609406726],[0,0.353553390593274],[0,0.646446609406726],[0.353553390593274,0],[0.646446609406726,0],[1,0.353553390593274],[1,0.646446609406726],[0.646446609406726,1],[0.353553390593274,1]],\n\t\"edges_vertices\": [[0,4],[4,9],[0,9],[0,10],[4,10],[2,4],[2,14],[4,14],[4,13],[2,13],[3,4],[4,15],[3,15],[3,16],[4,16],[1,4],[1,12],[4,12],[4,11],[1,11],[4,5],[5,9],[5,16],[4,6],[6,11],[6,10],[4,7],[7,13],[7,12],[4,8],[8,15],[8,14],[9,17],[0,17],[5,17],[0,19],[10,19],[6,19],[11,20],[1,20],[6,20],[1,21],[12,21],[7,21],[13,22],[2,22],[7,22],[2,23],[14,23],[8,23],[15,24],[3,24],[8,24],[3,18],[16,18],[5,18]],\n\t\"edges_faces\": [[0,1],[0,8],[16,0],[1,18],[11,1],[3,2],[2,26],[15,2],[3,12],[24,3],[4,5],[4,14],[28,4],[5,30],[9,5],[7,6],[6,22],[13,6],[7,10],[20,7],[8,9],[8,17],[31,9],[10,11],[10,21],[19,11],[12,13],[12,25],[23,13],[14,15],[14,29],[27,15],[16,17],[16],[17],[18],[19,18],[19],[20,21],[20],[21],[22],[23,22],[23],[24,25],[24],[25],[26],[27,26],[27],[28,29],[28],[29],[30],[31,30],[31]],\n\t\"edges_assignment\": [\"F\",\"M\",\"M\",\"M\",\"M\",\"F\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\"],\n\t\"faces_vertices\": [[0,4,9],[4,0,10],[4,2,14],[2,4,13],[3,4,15],[4,3,16],[4,1,12],[1,4,11],[4,5,9],[5,4,16],[4,6,11],[6,4,10],[4,7,13],[7,4,12],[4,8,15],[8,4,14],[0,9,17],[9,5,17],[10,0,19],[6,10,19],[1,11,20],[11,6,20],[12,1,21],[7,12,21],[2,13,22],[13,7,22],[14,2,23],[8,14,23],[3,15,24],[15,8,24],[16,3,18],[5,16,18]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,6,7],[5,8,9],[10,11,12],[10,13,14],[15,16,17],[15,18,19],[20,21,1],[20,14,22],[23,24,18],[23,4,25],[26,27,8],[26,17,28],[29,30,11],[29,7,31],[2,32,33],[21,34,32],[3,35,36],[25,36,37],[19,38,39],[24,40,38],[16,41,42],[28,42,43],[9,44,45],[27,46,44],[6,47,48],[31,48,49],[12,50,51],[30,52,50],[13,53,54],[22,54,55]]\n}";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const shadowFilter$1 = function (id_name = "shadow") {
    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    filter.setAttribute("id", id_name);
    const blur = document.createElementNS(SVG_NS, "feGaussianBlur");
    blur.setAttribute("in", "SourceAlpha");
    blur.setAttribute("stdDeviation", "0.01");
    blur.setAttribute("result", "blur");
    const offset = document.createElementNS(SVG_NS, "feOffset");
    offset.setAttribute("in", "blur");
    offset.setAttribute("result", "offsetBlur");
    const flood = document.createElementNS(SVG_NS, "feFlood");
    flood.setAttribute("flood-color", "#000");
    flood.setAttribute("flood-opacity", "0.4");
    flood.setAttribute("result", "offsetColor");
    const composite = document.createElementNS(SVG_NS, "feComposite");
    composite.setAttribute("in", "offsetColor");
    composite.setAttribute("in2", "offsetBlur");
    composite.setAttribute("operator", "in");
    composite.setAttribute("result", "offsetBlur");
    const merge = document.createElementNS(SVG_NS, "feMerge");
    const mergeNode1 = document.createElementNS(SVG_NS, "feMergeNode");
    const mergeNode2 = document.createElementNS(SVG_NS, "feMergeNode");
    mergeNode2.setAttribute("in", "SourceGraphic");
    merge.appendChild(mergeNode1);
    merge.appendChild(mergeNode2);
    filter.appendChild(blur);
    filter.appendChild(offset);
    filter.appendChild(flood);
    filter.appendChild(composite);
    filter.appendChild(merge);
    return filter;
  };

  const EPSILON$2 = Math.pow(2, -52);
  const EDGE_STACK = new Uint32Array(512);
  class Delaunator {
    static from(points, getX = defaultGetX, getY = defaultGetY) {
      const n = points.length;
      const coords = new Float64Array(n * 2);
      for (let i = 0; i < n; i++) {
        const p = points[i];
        coords[2 * i] = getX(p);
        coords[2 * i + 1] = getY(p);
      }
      return new Delaunator(coords);
    }
    constructor(coords) {
      const n = coords.length >> 1;
      if (n > 0 && typeof coords[0] !== 'number') throw new Error('Expected coords to contain numbers.');
      this.coords = coords;
      const maxTriangles = Math.max(2 * n - 5, 0);
      this._triangles = new Uint32Array(maxTriangles * 3);
      this._halfedges = new Int32Array(maxTriangles * 3);
      this._hashSize = Math.ceil(Math.sqrt(n));
      this._hullPrev = new Uint32Array(n);
      this._hullNext = new Uint32Array(n);
      this._hullTri = new Uint32Array(n);
      this._hullHash = new Int32Array(this._hashSize).fill(-1);
      this._ids = new Uint32Array(n);
      this._dists = new Float64Array(n);
      this.update();
    }
    update() {
      const {coords, _hullPrev: hullPrev, _hullNext: hullNext, _hullTri: hullTri, _hullHash: hullHash} =  this;
      const n = coords.length >> 1;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (let i = 0; i < n; i++) {
        const x = coords[2 * i];
        const y = coords[2 * i + 1];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        this._ids[i] = i;
      }
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      let minDist = Infinity;
      let i0, i1, i2;
      for (let i = 0; i < n; i++) {
        const d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
        if (d < minDist) {
          i0 = i;
          minDist = d;
        }
      }
      const i0x = coords[2 * i0];
      const i0y = coords[2 * i0 + 1];
      minDist = Infinity;
      for (let i = 0; i < n; i++) {
        if (i === i0) continue;
        const d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
        if (d < minDist && d > 0) {
          i1 = i;
          minDist = d;
        }
      }
      let i1x = coords[2 * i1];
      let i1y = coords[2 * i1 + 1];
      let minRadius = Infinity;
      for (let i = 0; i < n; i++) {
        if (i === i0 || i === i1) continue;
        const r = circumradius(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);
        if (r < minRadius) {
          i2 = i;
          minRadius = r;
        }
      }
      let i2x = coords[2 * i2];
      let i2y = coords[2 * i2 + 1];
      if (minRadius === Infinity) {
        for (let i = 0; i < n; i++) {
          this._dists[i] = (coords[2 * i] - coords[0]) || (coords[2 * i + 1] - coords[1]);
        }
        quicksort(this._ids, this._dists, 0, n - 1);
        const hull = new Uint32Array(n);
        let j = 0;
        for (let i = 0, d0 = -Infinity; i < n; i++) {
          const id = this._ids[i];
          if (this._dists[id] > d0) {
            hull[j++] = id;
            d0 = this._dists[id];
          }
        }
        this.hull = hull.subarray(0, j);
        this.triangles = new Uint32Array(0);
        this.halfedges = new Uint32Array(0);
        return;
      }
      if (orient(i0x, i0y, i1x, i1y, i2x, i2y)) {
        const i = i1;
        const x = i1x;
        const y = i1y;
        i1 = i2;
        i1x = i2x;
        i1y = i2y;
        i2 = i;
        i2x = x;
        i2y = y;
      }
      const center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
      this._cx = center.x;
      this._cy = center.y;
      for (let i = 0; i < n; i++) {
        this._dists[i] = dist(coords[2 * i], coords[2 * i + 1], center.x, center.y);
      }
      quicksort(this._ids, this._dists, 0, n - 1);
      this._hullStart = i0;
      let hullSize = 3;
      hullNext[i0] = hullPrev[i2] = i1;
      hullNext[i1] = hullPrev[i0] = i2;
      hullNext[i2] = hullPrev[i1] = i0;
      hullTri[i0] = 0;
      hullTri[i1] = 1;
      hullTri[i2] = 2;
      hullHash.fill(-1);
      hullHash[this._hashKey(i0x, i0y)] = i0;
      hullHash[this._hashKey(i1x, i1y)] = i1;
      hullHash[this._hashKey(i2x, i2y)] = i2;
      this.trianglesLen = 0;
      this._addTriangle(i0, i1, i2, -1, -1, -1);
      for (let k = 0, xp, yp; k < this._ids.length; k++) {
        const i = this._ids[k];
        const x = coords[2 * i];
        const y = coords[2 * i + 1];
        if (k > 0 && Math.abs(x - xp) <= EPSILON$2 && Math.abs(y - yp) <= EPSILON$2) continue;
        xp = x;
        yp = y;
        if (i === i0 || i === i1 || i === i2) continue;
        let start = 0;
        for (let j = 0, key = this._hashKey(x, y); j < this._hashSize; j++) {
          start = hullHash[(key + j) % this._hashSize];
          if (start !== -1 && start !== hullNext[start]) break;
        }
        start = hullPrev[start];
        let e = start, q;
        while (q = hullNext[e], !orient(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1])) {
          e = q;
          if (e === start) {
            e = -1;
            break;
          }
        }
        if (e === -1) continue;
        let t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]);
        hullTri[i] = this._legalize(t + 2);
        hullTri[e] = t;
        hullSize++;
        let n = hullNext[e];
        while (q = hullNext[n], orient(x, y, coords[2 * n], coords[2 * n + 1], coords[2 * q], coords[2 * q + 1])) {
          t = this._addTriangle(n, i, q, hullTri[i], -1, hullTri[n]);
          hullTri[i] = this._legalize(t + 2);
          hullNext[n] = n;
          hullSize--;
          n = q;
        }
        if (e === start) {
          while (q = hullPrev[e], orient(x, y, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1])) {
            t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);
            this._legalize(t + 2);
            hullTri[q] = t;
            hullNext[e] = e;
            hullSize--;
            e = q;
          }
        }
        this._hullStart = hullPrev[i] = e;
        hullNext[e] = hullPrev[n] = i;
        hullNext[i] = n;
        hullHash[this._hashKey(x, y)] = i;
        hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
      }
      this.hull = new Uint32Array(hullSize);
      for (let i = 0, e = this._hullStart; i < hullSize; i++) {
        this.hull[i] = e;
        e = hullNext[e];
      }
      this.triangles = this._triangles.subarray(0, this.trianglesLen);
      this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
    }
    _hashKey(x, y) {
      return Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
    }
    _legalize(a) {
      const {_triangles: triangles, _halfedges: halfedges, coords} = this;
      let i = 0;
      let ar = 0;
      while (true) {
        const b = halfedges[a];
        const a0 = a - a % 3;
        ar = a0 + (a + 2) % 3;
        if (b === -1) {
          if (i === 0) break;
          a = EDGE_STACK[--i];
          continue;
        }
        const b0 = b - b % 3;
        const al = a0 + (a + 1) % 3;
        const bl = b0 + (b + 2) % 3;
        const p0 = triangles[ar];
        const pr = triangles[a];
        const pl = triangles[al];
        const p1 = triangles[bl];
        const illegal = inCircle(
          coords[2 * p0], coords[2 * p0 + 1],
          coords[2 * pr], coords[2 * pr + 1],
          coords[2 * pl], coords[2 * pl + 1],
          coords[2 * p1], coords[2 * p1 + 1]);
        if (illegal) {
          triangles[a] = p1;
          triangles[b] = p0;
          const hbl = halfedges[bl];
          if (hbl === -1) {
            let e = this._hullStart;
            do {
              if (this._hullTri[e] === bl) {
                this._hullTri[e] = a;
                break;
              }
              e = this._hullPrev[e];
            } while (e !== this._hullStart);
          }
          this._link(a, hbl);
          this._link(b, halfedges[ar]);
          this._link(ar, bl);
          const br = b0 + (b + 1) % 3;
          if (i < EDGE_STACK.length) {
            EDGE_STACK[i++] = br;
          }
        } else {
          if (i === 0) break;
          a = EDGE_STACK[--i];
        }
      }
      return ar;
    }
    _link(a, b) {
      this._halfedges[a] = b;
      if (b !== -1) this._halfedges[b] = a;
    }
    _addTriangle(i0, i1, i2, a, b, c) {
      const t = this.trianglesLen;
      this._triangles[t] = i0;
      this._triangles[t + 1] = i1;
      this._triangles[t + 2] = i2;
      this._link(t, a);
      this._link(t + 1, b);
      this._link(t + 2, c);
      this.trianglesLen += 3;
      return t;
    }
  }
  function pseudoAngle(dx, dy) {
    const p = dx / (Math.abs(dx) + Math.abs(dy));
    return (dy > 0 ? 3 - p : 1 + p) / 4;
  }
  function dist(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
  }
  function orientIfSure(px, py, rx, ry, qx, qy) {
    const l = (ry - py) * (qx - px);
    const r = (rx - px) * (qy - py);
    return Math.abs(l - r) >= 3.3306690738754716e-16 * Math.abs(l + r) ? l - r : 0;
  }
  function orient(rx, ry, qx, qy, px, py) {
    const sign = orientIfSure(px, py, rx, ry, qx, qy) ||
    orientIfSure(rx, ry, qx, qy, px, py) ||
    orientIfSure(qx, qy, px, py, rx, ry);
    return sign < 0;
  }
  function inCircle(ax, ay, bx, by, cx, cy, px, py) {
    const dx = ax - px;
    const dy = ay - py;
    const ex = bx - px;
    const ey = by - py;
    const fx = cx - px;
    const fy = cy - py;
    const ap = dx * dx + dy * dy;
    const bp = ex * ex + ey * ey;
    const cp = fx * fx + fy * fy;
    return dx * (ey * cp - bp * fy) -
         dy * (ex * cp - bp * fx) +
         ap * (ex * fy - ey * fx) < 0;
  }
  function circumradius(ax, ay, bx, by, cx, cy) {
    const dx = bx - ax;
    const dy = by - ay;
    const ex = cx - ax;
    const ey = cy - ay;
    const bl = dx * dx + dy * dy;
    const cl = ex * ex + ey * ey;
    const d = 0.5 / (dx * ey - dy * ex);
    const x = (ey * bl - dy * cl) * d;
    const y = (dx * cl - ex * bl) * d;
    return x * x + y * y;
  }
  function circumcenter(ax, ay, bx, by, cx, cy) {
    const dx = bx - ax;
    const dy = by - ay;
    const ex = cx - ax;
    const ey = cy - ay;
    const bl = dx * dx + dy * dy;
    const cl = ex * ex + ey * ey;
    const d = 0.5 / (dx * ey - dy * ex);
    const x = ax + (ey * bl - dy * cl) * d;
    const y = ay + (dx * cl - ex * bl) * d;
    return {x, y};
  }
  function quicksort(ids, dists, left, right) {
    if (right - left <= 20) {
      for (let i = left + 1; i <= right; i++) {
        const temp = ids[i];
        const tempDist = dists[temp];
        let j = i - 1;
        while (j >= left && dists[ids[j]] > tempDist) ids[j + 1] = ids[j--];
        ids[j + 1] = temp;
      }
    } else {
      const median = (left + right) >> 1;
      let i = left + 1;
      let j = right;
      swap(ids, median, i);
      if (dists[ids[left]] > dists[ids[right]]) swap(ids, left, right);
      if (dists[ids[i]] > dists[ids[right]]) swap(ids, i, right);
      if (dists[ids[left]] > dists[ids[i]]) swap(ids, left, i);
      const temp = ids[i];
      const tempDist = dists[temp];
      while (true) {
        do i++; while (dists[ids[i]] < tempDist);
        do j--; while (dists[ids[j]] > tempDist);
        if (j < i) break;
        swap(ids, i, j);
      }
      ids[left + 1] = ids[j];
      ids[j] = temp;
      if (right - i + 1 >= j - left) {
        quicksort(ids, dists, i, right);
        quicksort(ids, dists, left, j - 1);
      } else {
        quicksort(ids, dists, left, j - 1);
        quicksort(ids, dists, i, right);
      }
    }
  }
  function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  function defaultGetX(p) {
    return p[0];
  }
  function defaultGetY(p) {
    return p[1];
  }

  const epsilon = 1e-6;
  class Path$1 {
    constructor() {
      this._x0 = this._y0 =
      this._x1 = this._y1 = null;
      this._ = "";
    }
    moveTo(x, y) {
      this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
    }
    closePath() {
      if (this._x1 !== null) {
        this._x1 = this._x0, this._y1 = this._y0;
        this._ += "Z";
      }
    }
    lineTo(x, y) {
      this._ += `L${this._x1 = +x},${this._y1 = +y}`;
    }
    arc(x, y, r) {
      x = +x, y = +y, r = +r;
      const x0 = x + r;
      const y0 = y;
      if (r < 0) throw new Error("negative radius");
      if (this._x1 === null) this._ += `M${x0},${y0}`;
      else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) this._ += "L" + x0 + "," + y0;
      if (!r) return;
      this._ += `A${r},${r},0,1,1,${x - r},${y}A${r},${r},0,1,1,${this._x1 = x0},${this._y1 = y0}`;
    }
    rect(x, y, w, h) {
      this._ += `M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${+w}v${+h}h${-w}Z`;
    }
    value() {
      return this._ || null;
    }
  }

  class Polygon$1 {
    constructor() {
      this._ = [];
    }
    moveTo(x, y) {
      this._.push([x, y]);
    }
    closePath() {
      this._.push(this._[0].slice());
    }
    lineTo(x, y) {
      this._.push([x, y]);
    }
    value() {
      return this._.length ? this._ : null;
    }
  }

  class Voronoi {
    constructor(delaunay, [xmin, ymin, xmax, ymax] = [0, 0, 960, 500]) {
      if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw new Error("invalid bounds");
      this.delaunay = delaunay;
      this._circumcenters = new Float64Array(delaunay.points.length * 2);
      this.vectors = new Float64Array(delaunay.points.length * 2);
      this.xmax = xmax, this.xmin = xmin;
      this.ymax = ymax, this.ymin = ymin;
      this._init();
    }
    update() {
      this.delaunay.update();
      this._init();
      return this;
    }
    _init() {
      const {delaunay: {points, hull, triangles}, vectors} = this;
      const circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
      for (let i = 0, j = 0, n = triangles.length, x, y; i < n; i += 3, j += 2) {
        const t1 = triangles[i] * 2;
        const t2 = triangles[i + 1] * 2;
        const t3 = triangles[i + 2] * 2;
        const x1 = points[t1];
        const y1 = points[t1 + 1];
        const x2 = points[t2];
        const y2 = points[t2 + 1];
        const x3 = points[t3];
        const y3 = points[t3 + 1];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const ex = x3 - x1;
        const ey = y3 - y1;
        const bl = dx * dx + dy * dy;
        const cl = ex * ex + ey * ey;
        const ab = (dx * ey - dy * ex) * 2;
        if (!ab) {
          x = (x1 + x3) / 2 - 1e8 * ey;
          y = (y1 + y3) / 2 + 1e8 * ex;
        }
        else if (Math.abs(ab) < 1e-8) {
          x = (x1 + x3) / 2;
          y = (y1 + y3) / 2;
        } else {
          const d = 1 / ab;
          x = x1 + (ey * bl - dy * cl) * d;
          y = y1 + (dx * cl - ex * bl) * d;
        }
        circumcenters[j] = x;
        circumcenters[j + 1] = y;
      }
      let h = hull[hull.length - 1];
      let p0, p1 = h * 4;
      let x0, x1 = points[2 * h];
      let y0, y1 = points[2 * h + 1];
      vectors.fill(0);
      for (let i = 0; i < hull.length; ++i) {
        h = hull[i];
        p0 = p1, x0 = x1, y0 = y1;
        p1 = h * 4, x1 = points[2 * h], y1 = points[2 * h + 1];
        vectors[p0 + 2] = vectors[p1] = y0 - y1;
        vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
      }
    }
    render(context) {
      const buffer = context == null ? context = new Path$1 : undefined;
      const {delaunay: {halfedges, inedges, hull}, circumcenters, vectors} = this;
      if (hull.length <= 1) return null;
      for (let i = 0, n = halfedges.length; i < n; ++i) {
        const j = halfedges[i];
        if (j < i) continue;
        const ti = Math.floor(i / 3) * 2;
        const tj = Math.floor(j / 3) * 2;
        const xi = circumcenters[ti];
        const yi = circumcenters[ti + 1];
        const xj = circumcenters[tj];
        const yj = circumcenters[tj + 1];
        this._renderSegment(xi, yi, xj, yj, context);
      }
      let h0, h1 = hull[hull.length - 1];
      for (let i = 0; i < hull.length; ++i) {
        h0 = h1, h1 = hull[i];
        const t = Math.floor(inedges[h1] / 3) * 2;
        const x = circumcenters[t];
        const y = circumcenters[t + 1];
        const v = h0 * 4;
        const p = this._project(x, y, vectors[v + 2], vectors[v + 3]);
        if (p) this._renderSegment(x, y, p[0], p[1], context);
      }
      return buffer && buffer.value();
    }
    renderBounds(context) {
      const buffer = context == null ? context = new Path$1 : undefined;
      context.rect(this.xmin, this.ymin, this.xmax - this.xmin, this.ymax - this.ymin);
      return buffer && buffer.value();
    }
    renderCell(i, context) {
      const buffer = context == null ? context = new Path$1 : undefined;
      const points = this._clip(i);
      if (points === null) return;
      context.moveTo(points[0], points[1]);
      let n = points.length;
      while (points[0] === points[n-2] && points[1] === points[n-1] && n > 1) n -= 2;
      for (let i = 2; i < n; i += 2) {
        if (points[i] !== points[i-2] || points[i+1] !== points[i-1])
          context.lineTo(points[i], points[i + 1]);
      }
      context.closePath();
      return buffer && buffer.value();
    }
    *cellPolygons() {
      const {delaunay: {points}} = this;
      for (let i = 0, n = points.length / 2; i < n; ++i) {
        const cell = this.cellPolygon(i);
        if (cell) yield cell;
      }
    }
    cellPolygon(i) {
      const polygon = new Polygon$1;
      this.renderCell(i, polygon);
      return polygon.value();
    }
    _renderSegment(x0, y0, x1, y1, context) {
      let S;
      const c0 = this._regioncode(x0, y0);
      const c1 = this._regioncode(x1, y1);
      if (c0 === 0 && c1 === 0) {
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
      } else if (S = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
        context.moveTo(S[0], S[1]);
        context.lineTo(S[2], S[3]);
      }
    }
    contains(i, x, y) {
      if ((x = +x, x !== x) || (y = +y, y !== y)) return false;
      return this.delaunay._step(i, x, y) === i;
    }
    _cell(i) {
      const {circumcenters, delaunay: {inedges, halfedges, triangles}} = this;
      const e0 = inedges[i];
      if (e0 === -1) return null;
      const points = [];
      let e = e0;
      do {
        const t = Math.floor(e / 3);
        points.push(circumcenters[t * 2], circumcenters[t * 2 + 1]);
        e = e % 3 === 2 ? e - 2 : e + 1;
        if (triangles[e] !== i) break;
        e = halfedges[e];
      } while (e !== e0 && e !== -1);
      return points;
    }
    _clip(i) {
      if (i === 0 && this.delaunay.hull.length === 1) {
        return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
      }
      const points = this._cell(i);
      if (points === null) return null;
      const {vectors: V} = this;
      const v = i * 4;
      return V[v] || V[v + 1]
          ? this._clipInfinite(i, points, V[v], V[v + 1], V[v + 2], V[v + 3])
          : this._clipFinite(i, points);
    }
    _clipFinite(i, points) {
      const n = points.length;
      let P = null;
      let x0, y0, x1 = points[n - 2], y1 = points[n - 1];
      let c0, c1 = this._regioncode(x1, y1);
      let e0, e1;
      for (let j = 0; j < n; j += 2) {
        x0 = x1, y0 = y1, x1 = points[j], y1 = points[j + 1];
        c0 = c1, c1 = this._regioncode(x1, y1);
        if (c0 === 0 && c1 === 0) {
          e0 = e1, e1 = 0;
          if (P) P.push(x1, y1);
          else P = [x1, y1];
        } else {
          let S, sx0, sy0, sx1, sy1;
          if (c0 === 0) {
            if ((S = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null) continue;
            [sx0, sy0, sx1, sy1] = S;
          } else {
            if ((S = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null) continue;
            [sx1, sy1, sx0, sy0] = S;
            e0 = e1, e1 = this._edgecode(sx0, sy0);
            if (e0 && e1) this._edge(i, e0, e1, P, P.length);
            if (P) P.push(sx0, sy0);
            else P = [sx0, sy0];
          }
          e0 = e1, e1 = this._edgecode(sx1, sy1);
          if (e0 && e1) this._edge(i, e0, e1, P, P.length);
          if (P) P.push(sx1, sy1);
          else P = [sx1, sy1];
        }
      }
      if (P) {
        e0 = e1, e1 = this._edgecode(P[0], P[1]);
        if (e0 && e1) this._edge(i, e0, e1, P, P.length);
      } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
        return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
      }
      return P;
    }
    _clipSegment(x0, y0, x1, y1, c0, c1) {
      while (true) {
        if (c0 === 0 && c1 === 0) return [x0, y0, x1, y1];
        if (c0 & c1) return null;
        let x, y, c = c0 || c1;
        if (c & 0b1000) x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax;
        else if (c & 0b0100) x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin;
        else if (c & 0b0010) y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax;
        else y = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin;
        if (c0) x0 = x, y0 = y, c0 = this._regioncode(x0, y0);
        else x1 = x, y1 = y, c1 = this._regioncode(x1, y1);
      }
    }
    _clipInfinite(i, points, vx0, vy0, vxn, vyn) {
      let P = Array.from(points), p;
      if (p = this._project(P[0], P[1], vx0, vy0)) P.unshift(p[0], p[1]);
      if (p = this._project(P[P.length - 2], P[P.length - 1], vxn, vyn)) P.push(p[0], p[1]);
      if (P = this._clipFinite(i, P)) {
        for (let j = 0, n = P.length, c0, c1 = this._edgecode(P[n - 2], P[n - 1]); j < n; j += 2) {
          c0 = c1, c1 = this._edgecode(P[j], P[j + 1]);
          if (c0 && c1) j = this._edge(i, c0, c1, P, j), n = P.length;
        }
      } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
        P = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
      }
      return P;
    }
    _edge(i, e0, e1, P, j) {
      while (e0 !== e1) {
        let x, y;
        switch (e0) {
          case 0b0101: e0 = 0b0100; continue;
          case 0b0100: e0 = 0b0110, x = this.xmax, y = this.ymin; break;
          case 0b0110: e0 = 0b0010; continue;
          case 0b0010: e0 = 0b1010, x = this.xmax, y = this.ymax; break;
          case 0b1010: e0 = 0b1000; continue;
          case 0b1000: e0 = 0b1001, x = this.xmin, y = this.ymax; break;
          case 0b1001: e0 = 0b0001; continue;
          case 0b0001: e0 = 0b0101, x = this.xmin, y = this.ymin; break;
        }
        if ((P[j] !== x || P[j + 1] !== y) && this.contains(i, x, y)) {
          P.splice(j, 0, x, y), j += 2;
        }
      }
      if (P.length > 4) {
        for (let i = 0; i < P.length; i+= 2) {
          const j = (i + 2) % P.length, k = (i + 4) % P.length;
          if (P[i] === P[j] && P[j] === P[k]
          || P[i + 1] === P[j + 1] && P[j + 1] === P[k + 1])
            P.splice(j, 2), i -= 2;
        }
      }
      return j;
    }
    _project(x0, y0, vx, vy) {
      let t = Infinity, c, x, y;
      if (vy < 0) {
        if (y0 <= this.ymin) return null;
        if ((c = (this.ymin - y0) / vy) < t) y = this.ymin, x = x0 + (t = c) * vx;
      } else if (vy > 0) {
        if (y0 >= this.ymax) return null;
        if ((c = (this.ymax - y0) / vy) < t) y = this.ymax, x = x0 + (t = c) * vx;
      }
      if (vx > 0) {
        if (x0 >= this.xmax) return null;
        if ((c = (this.xmax - x0) / vx) < t) x = this.xmax, y = y0 + (t = c) * vy;
      } else if (vx < 0) {
        if (x0 <= this.xmin) return null;
        if ((c = (this.xmin - x0) / vx) < t) x = this.xmin, y = y0 + (t = c) * vy;
      }
      return [x, y];
    }
    _edgecode(x, y) {
      return (x === this.xmin ? 0b0001
          : x === this.xmax ? 0b0010 : 0b0000)
          | (y === this.ymin ? 0b0100
          : y === this.ymax ? 0b1000 : 0b0000);
    }
    _regioncode(x, y) {
      return (x < this.xmin ? 0b0001
          : x > this.xmax ? 0b0010 : 0b0000)
          | (y < this.ymin ? 0b0100
          : y > this.ymax ? 0b1000 : 0b0000);
    }
  }

  const tau = 2 * Math.PI;
  function pointX(p) {
    return p[0];
  }
  function pointY(p) {
    return p[1];
  }
  function collinear$1(d) {
    const {triangles, coords} = d;
    for (let i = 0; i < triangles.length; i += 3) {
      const a = 2 * triangles[i],
            b = 2 * triangles[i + 1],
            c = 2 * triangles[i + 2],
            cross = (coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1])
                  - (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]);
      if (cross > 1e-10) return false;
    }
    return true;
  }
  function jitter(x, y, r) {
    return [x + Math.sin(x + y) * r, y + Math.cos(x - y) * r];
  }
  class Delaunay {
    constructor(points) {
      this._delaunator = new Delaunator(points);
      this.inedges = new Int32Array(points.length / 2);
      this._hullIndex = new Int32Array(points.length / 2);
      this.points = this._delaunator.coords;
      this._init();
    }
    update() {
      this._delaunator.update();
      this._init();
      return this;
    }
    _init() {
      const d = this._delaunator, points = this.points;
      if (d.hull && d.hull.length > 2 && collinear$1(d)) {
        this.collinear = Int32Array.from({length: points.length/2}, (_,i) => i)
          .sort((i, j) => points[2 * i] - points[2 * j] || points[2 * i + 1] - points[2 * j + 1]);
        const e = this.collinear[0], f = this.collinear[this.collinear.length - 1],
          bounds = [ points[2 * e], points[2 * e + 1], points[2 * f], points[2 * f + 1] ],
          r = 1e-8 * Math.sqrt((bounds[3] - bounds[1])**2 + (bounds[2] - bounds[0])**2);
        for (let i = 0, n = points.length / 2; i < n; ++i) {
          const p = jitter(points[2 * i], points[2 * i + 1], r);
          points[2 * i] = p[0];
          points[2 * i + 1] = p[1];
        }
        this._delaunator = new Delaunator(points);
      } else {
        delete this.collinear;
      }
      const halfedges = this.halfedges = this._delaunator.halfedges;
      const hull = this.hull = this._delaunator.hull;
      const triangles = this.triangles = this._delaunator.triangles;
      const inedges = this.inedges.fill(-1);
      const hullIndex = this._hullIndex.fill(-1);
      for (let e = 0, n = halfedges.length; e < n; ++e) {
        const p = triangles[e % 3 === 2 ? e - 2 : e + 1];
        if (halfedges[e] === -1 || inedges[p] === -1) inedges[p] = e;
      }
      for (let i = 0, n = hull.length; i < n; ++i) {
        hullIndex[hull[i]] = i;
      }
      if (hull.length <= 2 && hull.length > 0) {
        this.triangles = new Int32Array(3).fill(-1);
        this.halfedges = new Int32Array(3).fill(-1);
        this.triangles[0] = hull[0];
        this.triangles[1] = hull[1];
        this.triangles[2] = hull[1];
        inedges[hull[0]] = 1;
        if (hull.length === 2) inedges[hull[1]] = 0;
      }
    }
    voronoi(bounds) {
      return new Voronoi(this, bounds);
    }
    *neighbors(i) {
      const {inedges, hull, _hullIndex, halfedges, triangles} = this;
      if (this.collinear) {
        const l = this.collinear.indexOf(i);
        if (l > 0) yield this.collinear[l - 1];
        if (l < this.collinear.length - 1) yield this.collinear[l + 1];
        return;
      }
      const e0 = inedges[i];
      if (e0 === -1) return;
      let e = e0, p0 = -1;
      do {
        yield p0 = triangles[e];
        e = e % 3 === 2 ? e - 2 : e + 1;
        if (triangles[e] !== i) return;
        e = halfedges[e];
        if (e === -1) {
          const p = hull[(_hullIndex[i] + 1) % hull.length];
          if (p !== p0) yield p;
          return;
        }
      } while (e !== e0);
    }
    find(x, y, i = 0) {
      if ((x = +x, x !== x) || (y = +y, y !== y)) return -1;
      const i0 = i;
      let c;
      while ((c = this._step(i, x, y)) >= 0 && c !== i && c !== i0) i = c;
      return c;
    }
    _step(i, x, y) {
      const {inedges, hull, _hullIndex, halfedges, triangles, points} = this;
      if (inedges[i] === -1 || !points.length) return (i + 1) % (points.length >> 1);
      let c = i;
      let dc = (x - points[i * 2]) ** 2 + (y - points[i * 2 + 1]) ** 2;
      const e0 = inedges[i];
      let e = e0;
      do {
        let t = triangles[e];
        const dt = (x - points[t * 2]) ** 2 + (y - points[t * 2 + 1]) ** 2;
        if (dt < dc) dc = dt, c = t;
        e = e % 3 === 2 ? e - 2 : e + 1;
        if (triangles[e] !== i) break;
        e = halfedges[e];
        if (e === -1) {
          e = hull[(_hullIndex[i] + 1) % hull.length];
          if (e !== t) {
            if ((x - points[e * 2]) ** 2 + (y - points[e * 2 + 1]) ** 2 < dc) return e;
          }
          break;
        }
      } while (e !== e0);
      return c;
    }
    render(context) {
      const buffer = context == null ? context = new Path$1 : undefined;
      const {points, halfedges, triangles} = this;
      for (let i = 0, n = halfedges.length; i < n; ++i) {
        const j = halfedges[i];
        if (j < i) continue;
        const ti = triangles[i] * 2;
        const tj = triangles[j] * 2;
        context.moveTo(points[ti], points[ti + 1]);
        context.lineTo(points[tj], points[tj + 1]);
      }
      this.renderHull(context);
      return buffer && buffer.value();
    }
    renderPoints(context, r = 2) {
      const buffer = context == null ? context = new Path$1 : undefined;
      const {points} = this;
      for (let i = 0, n = points.length; i < n; i += 2) {
        const x = points[i], y = points[i + 1];
        context.moveTo(x + r, y);
        context.arc(x, y, r, 0, tau);
      }
      return buffer && buffer.value();
    }
    renderHull(context) {
      const buffer = context == null ? context = new Path$1 : undefined;
      const {hull, points} = this;
      const h = hull[0] * 2, n = hull.length;
      context.moveTo(points[h], points[h + 1]);
      for (let i = 1; i < n; ++i) {
        const h = 2 * hull[i];
        context.lineTo(points[h], points[h + 1]);
      }
      context.closePath();
      return buffer && buffer.value();
    }
    hullPolygon() {
      const polygon = new Polygon$1;
      this.renderHull(polygon);
      return polygon.value();
    }
    renderTriangle(i, context) {
      const buffer = context == null ? context = new Path$1 : undefined;
      const {points, triangles} = this;
      const t0 = triangles[i *= 3] * 2;
      const t1 = triangles[i + 1] * 2;
      const t2 = triangles[i + 2] * 2;
      context.moveTo(points[t0], points[t0 + 1]);
      context.lineTo(points[t1], points[t1 + 1]);
      context.lineTo(points[t2], points[t2 + 1]);
      context.closePath();
      return buffer && buffer.value();
    }
    *trianglePolygons() {
      const {triangles} = this;
      for (let i = 0, n = triangles.length / 3; i < n; ++i) {
        yield this.trianglePolygon(i);
      }
    }
    trianglePolygon(i) {
      const polygon = new Polygon$1;
      this.renderTriangle(i, polygon);
      return polygon.value();
    }
  }
  Delaunay.from = function(points, fx = pointX, fy = pointY, that) {
    return new Delaunay("length" in points
        ? flatArray(points, fx, fy, that)
        : Float64Array.from(flatIterable(points, fx, fy, that)));
  };
  function flatArray(points, fx, fy, that) {
    const n = points.length;
    const array = new Float64Array(n * 2);
    for (let i = 0; i < n; ++i) {
      const p = points[i];
      array[i * 2] = fx.call(that, p, i, points);
      array[i * 2 + 1] = fy.call(that, p, i, points);
    }
    return array;
  }
  function* flatIterable(points, fx, fy, that) {
    let i = 0;
    for (const p of points) {
      yield fx.call(that, p, i, points);
      yield fy.call(that, p, i, points);
      ++i;
    }
  }

  const make_delaunay_vertices = function (graph) {
    if (graph.vertices_coords == null) { return undefined; }
    return new Delaunay.from(graph.vertices_coords);
  };
  const make_voronoi_vertices = function (graph) {
    if (graph.vertices_coords == null) { return undefined; }
    return new Voronoi(new Delaunay.from(graph.vertices_coords));
  };
  const get_delaunay_faces_vertices = function (graph) {
    const t = graph["re:delaunay_vertices"].triangles;
    const l = t.length;
    return Array.from(Array(l / 3))
      .map((_, i) => [t[i * 3 + 0], t[i * 3 + 1], t[i * 3 + 2]]);
  };

  var delaunay = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_delaunay_vertices: make_delaunay_vertices,
    make_voronoi_vertices: make_voronoi_vertices,
    get_delaunay_faces_vertices: get_delaunay_faces_vertices
  });

  const drawDelaunay = function (graph, group) {
    if ("faces_vertices" in graph === false
    || "edges_vertices" in graph === false
    || "vertices_coords" in graph === false) { return; }
    const triangle_vertices = get_delaunay_faces_vertices(graph);
    triangle_vertices.forEach((tv) => {
      const points = tv.map(v => graph.vertices_coords[v]);
      group.polygon(points).setAttribute("style", "stroke:black; fill:#0003; stroke-width:0.003");
    });
  };
  const drawLabels = function (graph, group) {
    if ("faces_vertices" in graph === false
    || "edges_vertices" in graph === false
    || "vertices_coords" in graph === false) { return; }
    const r = bounding_rect(graph);
    const vmin = r[2] > r[3] ? r[3] : r[2];
    const fSize = vmin * 0.04;
    const labels_style = {
      vertices: `fill:#27b;font-family:sans-serif;font-size:${fSize}px;`,
      edges: `fill:#e53;font-family:sans-serif;font-size:${fSize}px;`,
      faces: `fill:black;font-family:sans-serif;font-size:${fSize}px;`,
    };
    const m = [fSize * 0.33, fSize * 0.4];
    graph.vertices_coords
      .map((c, i) => group.text(`${i}`, c[0] - m[0], c[1] + m[1]))
      .forEach(t => t.setAttribute("style", labels_style.vertices));
    graph.edges_vertices
      .map(ev => ev.map(v => graph.vertices_coords[v]))
      .map(verts => math.core.average(verts))
      .map((c, i) => group.text(`${i}`, c[0] - m[0], c[1] + m[1]))
      .forEach(t => t.setAttribute("style", labels_style.edges));
    graph.faces_vertices
      .map(fv => fv.map(v => graph.vertices_coords[v]))
      .map(verts => math.core.average(verts))
      .map((c, i) => group.text(`${i}`, c[0] - m[0], c[1] + m[1]))
      .forEach(t => t.setAttribute("style", labels_style.faces));
  };
  const drawDebug = function (graph, group) {
    const r = bounding_rect(graph);
    const vmin = r[2] > r[3] ? r[3] : r[2];
    const strokeW = vmin * 0.005;
    const debug_style = {
      faces_vertices: `fill:#555;stroke:none;stroke-width:${strokeW};`,
      faces_edges: `fill:#aaa;stroke:none;stroke-width:${strokeW};`,
    };
    graph.faces_vertices
      .map(fv => fv.map(v => graph.vertices_coords[v]))
      .map(face => math.convexPolygon(face).scale(0.666).points)
      .map(points => group.polygon(points))
      .forEach(poly => poly.setAttribute("style", debug_style.faces_vertices));
    graph.faces_edges
      .map(face_edges => face_edges
        .map(edge => graph.edges_vertices[edge])
        .map((vi, i, arr) => {
          const next = arr[(i + 1) % arr.length];
          return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
        }).map(v => graph.vertices_coords[v]))
      .map(face => math.convexPolygon(face).scale(0.333).points)
      .map(points => group.polygon(points))
      .forEach(poly => poly.setAttribute("style", debug_style.faces_edges));
  };
  const drawDiagram = function (graph, group, preferences = {}) {
    const r = bounding_rect(graph);
    const vmin = r[2] > r[3] ? r[3] : r[2];
    const diagrams = graph["re:diagrams"];
    if (diagrams == null) { return; }
    diagrams
      .map(d => d["re:diagram_arrows"])
      .filter(a => a != null)
      .forEach(arrow => arrow
        .map(a => a["re:diagram_arrow_coords"])
        .filter(a => a.length > 0)
        .map((p) => {
          let side = p[0][0] < p[1][0];
          if (Math.abs(p[0][0] - p[1][0]) < 0.1) {
            side = p[0][1] < p[1][1]
              ? p[0][0] < 0.5
              : p[0][0] > 0.5;
          }
          if (Math.abs(p[0][1] - p[1][1]) < 0.1) {
            side = p[0][0] < p[1][0]
              ? p[0][1] > 0.5
              : p[0][1] < 0.5;
          }
          const prefs = {
            side,
            strokeWidth: vmin * 0.02,
          };
          if (preferences.arrowColor) { prefs.color = preferences.arrowColor; }
          return group.arrow(p[0], p[1], prefs)
            .curve(0.3)
            .head({ width: vmin * 0.035, height: vmin * 0.09 })
            .fill("black")
            .stroke("black");
        }));
  };

  const DEFAULT_STYLE = `
line.boundary { stroke: black; }
line.mark { stroke: lightgray; }
line.mountain { stroke: red; }
line.valley { stroke: blue;
  stroke-dasharray: calc(var(--crease-width) * 2) calc(var(--crease-width) * 2);
}
/* polygon { fill: none; stroke: none; stroke-linejoin: bevel; } */
.foldedForm polygon { stroke: black; fill: #8881; }
.foldedForm polygon.front { fill: white; }
.foldedForm polygon.back { fill: lightgray; }
.creasePattern .boundaries polygon { fill: white; stroke: none; }
.creasePattern .faces polygon { fill: none; stroke: none; stroke-linejoin: bevel; }
.foldedForm .boundaries polygon { fill: none; stroke: none; }
.foldedForm line { stroke: none; }
`;
  const DEFAULTS$1 = Object.freeze({
    boundaries: true,
    faces: true,
    edges: true,
    vertices: false,
    diagram: false,
    labels: false,
    debug: false,
    delaunay: false,
    autofit: true,
    padding: 0,
    shadows: false,
    strokeWidth: 0.01,
    style: undefined,
    arrowColor: undefined,
  });
  const parseOptions = function (...args) {
    const keys = Object.keys(DEFAULTS$1);
    const options = {};
    Array(...args)
      .filter(obj => typeof obj === "object")
      .forEach(obj => Object.keys(obj)
        .filter(key => keys.includes(key))
        .forEach((key) => { options[key] = obj[key]; }));
    return options;
  };
  const View = function (graph, ...args) {
    const svg = SVG(...args);
    const svgStyle = svg.stylesheet(DEFAULT_STYLE);
    const defs = svg.defs();
    defs.appendChild(shadowFilter$1("faces_shadow"));
    const groups = {};
    ["boundaries", "faces", "edges", "vertices", "diagram", "labels", "delaunay"
    ].forEach((key) => {
      groups[key] = svg.group();
      groups[key].setAttribute("class", key);
      groups[key].pointerEvents("none");
    });
    groups.delaunay.fill("none");
    groups.delaunay.strokeWidth(0.1);
    groups.delaunay.stroke("red");
    const options = {};
    Object.assign(options, DEFAULTS$1);
    const userDefaults = parseOptions(...args);
    Object.keys(userDefaults).forEach((key) => {
      options[key] = userDefaults[key];
    });
    const fit = function () {
      const r = bounding_rect(graph);
      const vmin = r[2] > r[3] ? r[3] : r[2];
      SVG.setViewBox(svg, r[0], r[1], r[2], r[3], options.padding * vmin);
    };
    const draw = function () {
      const file_classes = (graph.file_classes != null
        ? graph.file_classes : []).join(" ");
      const frame_classes = graph.frame_classes != null
        ? graph.frame_classes : [].join(" ");
      const top_level_classes = [file_classes, frame_classes]
        .filter(s => s !== "")
        .join(" ");
      svg.setAttribute("class", top_level_classes);
      Object.keys(groups).forEach(key => groups[key].removeChildren());
      Object.keys(groups)
        .filter(key => options[key])
        .filter(key => drawFOLD.components.svg[key] !== undefined)
        .forEach(key => drawFOLD.components.svg[key](graph)
          .forEach(o => groups[key].appendChild(o)));
      if (options.autofit) { fit(); }
      if (options.diagram) { drawDiagram(graph, groups.diagram); }
      if (options.labels) { drawLabels(graph, groups.labels); }
      if (options.debug) { drawDebug(graph, groups.labels); }
      if (options.delaunay) { drawDelaunay(graph, groups.delaunay); }
      if (options.shadows) {
        Array.from(groups.faces.childNodes)
          .forEach(f => f.setAttribute("filter", "url(#faces_shadow)"));
      }
      const r = bounding_rect(graph);
      const vmin = r[2] > r[3] ? r[3] : r[2];
      const vmax = r[2] > r[3] ? r[2] : r[3];
      const vavg = (vmin + vmax) / 2;
      const strokeWidth = vavg * options.strokeWidth;
      ["boundaries", "faces", "edges"]
        .forEach(key => groups[key].strokeWidth(strokeWidth));
      if (options.style) {
        svgStyle.setTextContent(DEFAULT_STYLE + options.style);
      }
    };
    Object.defineProperty(svg, "draw", { value: draw });
    Object.defineProperty(svg, "fit", { value: fit });
    Object.defineProperty(svg, "setViewBox", {
      value: (x, y, w, h, padding) => SVG.setViewBox(svg, x, y, w, h, padding)
    });
    Object.defineProperty(svg, "options", { get: () => options });
    Object.defineProperty(svg, "groups", { get: () => groups });
    return svg;
  };

  const unitSquare = {"file_spec":1.1,"file_creator":"","file_author":"","file_classes":["singleModel"],"frame_title":"","frame_attributes":["2D"],"frame_classes":["creasePattern"],"vertices_coords":[[0,0],[1,0],[1,1],[0,1]],"vertices_vertices":[[1,3],[2,0],[3,1],[0,2]],"vertices_faces":[[0],[0],[0],[0]],"edges_vertices":[[0,1],[1,2],[2,3],[3,0]],"edges_faces":[[0],[0],[0],[0]],"edges_assignment":["B","B","B","B"],"edges_foldAngle":[0,0,0,0],"edges_length":[1,1,1,1],"faces_vertices":[[0,1,2,3]],"faces_edges":[[0,1,2,3]]};
  function View3D(...args) {
    let allMeshes = [];
    let scene = new THREE.Scene();
    let _parent;
    let prop = {
      cp: undefined,
      frame: undefined,
      style: {
        vertex_radius: 0.01
      },
    };
    prop.cp = args
      .filter(arg => typeof arg === "object" && arg.vertices_coords != null)
      .shift();
    if (prop.cp == null) { prop.cp = CreasePattern(unitSquare); }
    function bootThreeJS(domParent) {
      var camera = new THREE.PerspectiveCamera(45, domParent.clientWidth/domParent.clientHeight, 0.1, 1000);
      var controls = new THREE.OrbitControls(camera, domParent);
      controls.enableZoom = false;
      camera.position.set(-0.75, 2, -0.025);
      controls.target.set(0.0, 0.0, 0.0);
      controls.addEventListener('change', render);
      var renderer = new THREE.WebGLRenderer({antialias:true});
      if (window.devicePixelRatio !== 1) {
        renderer.setPixelRatio(window.devicePixelRatio);
      }
      renderer.setClearColor("#FFFFFF");
      renderer.setSize(domParent.clientWidth, domParent.clientHeight);
      domParent.appendChild(renderer.domElement);
      var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
      directionalLight2.position.set(20, 20, -100);
      scene.add(directionalLight2);
      var spotLight1 = new THREE.SpotLight(0xffffff, 0.3);
      spotLight1.position.set(50, -200, 100);
      scene.add(spotLight1);
      var spotLight2 = new THREE.SpotLight(0xffffff, 0.3);
      spotLight2.position.set(100, 50, 200);
      scene.add(spotLight2);
      var ambientLight = new THREE.AmbientLight(0xffffff, 0.48);
      scene.add(ambientLight);
      var render = function() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        controls.update();
      };
      render();
      draw();
    }
    const attachToDOM = function() {
      let functions = args.filter((arg) => typeof arg === "function");
      let numbers = args.filter((arg) => !isNaN(arg));
      let element = args.filter((arg) =>
          arg instanceof HTMLElement)
        .shift();
      let idElement = args.filter((a) =>
          typeof a === "string" || a instanceof String)
        .map(str => document.getElementById(str))
        .shift();
      _parent = (element != null
        ? element
        : (idElement != null
          ? idElement
          : document.body));
      bootThreeJS(_parent);
      if (numbers.length >= 2) ;
      if (functions.length >= 1) {
        functions[0]();
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachToDOM);
    } else {
      attachToDOM();
    }
    function draw() {
      var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        flatShading:true,
        shininess:0,
        specular:0xffffff,
        reflectivity:0
      });
      let graph = prop.frame
        ? flatten_frame(prop.cp, prop.frame)
        : prop.cp;
      let faces = foldFileToThreeJSFaces(graph, material);
      let lines = foldFileToThreeJSLines(graph);
      allMeshes.forEach(mesh => scene.remove(mesh));
      allMeshes = [];
      allMeshes.push(faces);
      allMeshes.push(lines);
      allMeshes.forEach(mesh => scene.add(mesh));
    }
    const setCreasePattern = function(cp) {
      prop.cp = cp;
      draw();
      prop.cp.onchange = draw;
    };
    return {
      set cp(c) {
        setCreasePattern(c);
        draw();
      },
      get cp() {
        return prop.cp;
      },
      draw,
      get frame() { return prop.frame; },
      set frame(newValue) {
        prop.frame = newValue;
        draw();
      },
      get frames() {
        let frameZero = JSON.parse(JSON.stringify(prop.cp));
        delete frameZero.file_frames;
        return [frameZero].concat(JSON.parse(JSON.stringify(prop.cp.file_frames)));
      }
    };
    function foldFileToThreeJSFaces(foldFile, material) {
      var geometry = new THREE.BufferGeometry();
      let vertices = foldFile.vertices_coords
        .map(v => [v[0], v[1], (v[2] != undefined ? v[2] : 0)])
        .reduce((prev,curr) => prev.concat(curr), []);
      let normals = foldFile.vertices_coords
        .map(v => [0,0,1])
        .reduce((prev,curr) => prev.concat(curr), []);
      let colors = foldFile.vertices_coords
        .map(v => [1,1,1])
        .reduce((prev,curr) => prev.concat(curr), []);
      let faces = foldFile.faces_vertices
        .map(fv => fv.map((v,i,arr) => [arr[0], arr[i+1], arr[i+2]])
                     .slice(0, fv.length-2))
        .reduce((prev,curr) => prev.concat(curr), [])
        .reduce((prev,curr) => prev.concat(curr), []);
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setIndex(faces);
      if (material == undefined) { material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide}); }
      return new THREE.Mesh(geometry, material);
    }
    function crossVec3(a,b) {
      return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
      ];
    }
    function magVec3(v) {
      return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2) + Math.pow(v[2],2));
    }
    function normalizeVec3(v) {
      let mag = Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2) + Math.pow(v[2],2));
      return [v[0] / mag, v[1] / mag, v[2] / mag];
    }
    function scaleVec3(v, scale) {
      return [v[0]*scale, v[1]*scale, v[2]*scale];
    }
    function cylinderEdgeVertices(edge, radius) {
      let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1], edge[1][2] - edge[0][2]];
      let mag = Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1],2) + Math.pow(vec[2],2));
      if (mag < 1e-10) { throw "degenerate edge"; }
      let normalized = [vec[0] / mag, vec[1] / mag, vec[2] / mag];
      let perp = [
        normalizeVec3(crossVec3(normalized, [1,0,0])),
        normalizeVec3(crossVec3(normalized, [0,1,0])),
        normalizeVec3(crossVec3(normalized, [0,0,1]))
      ].map((v,i) => ({i:i, v:v, mag:magVec3(v)}))
       .filter(v => v.mag > 1e-10)
       .map(obj => obj.v)
       .shift();
      let rotated = [perp];
      for(var i = 1; i < 4; i++) {
        rotated.push(normalizeVec3(crossVec3(rotated[i-1], normalized)));
      }
      let dirs = rotated.map(v => scaleVec3(v, radius));
      return edge
        .map(v => dirs.map(dir => [v[0]+dir[0], v[1]+dir[1], v[2]+dir[2]]))
        .reduce((prev,curr) => prev.concat(curr), []);
    }
    function foldFileToThreeJSLines(foldFile, scale=0.002) {
      let edges = foldFile.edges_vertices.map(ev => ev.map(v => foldFile.vertices_coords[v]));
      edges.forEach(edge => {
        if (edge[0][2] == undefined) { edge[0][2] = 0; }
        if (edge[1][2] == undefined) { edge[1][2] = 0; }
      });
      let colorAssignments = {
        "B": [0.0,0.0,0.0],
        "M": [0.0,0.0,0.0],
        "F": [0.0,0.0,0.0],
        "V": [0.0,0.0,0.0],
      };
      let colors = foldFile.edges_assignment.map(e =>
        [colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e],
        colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e]]
      ).reduce((prev,curr) => prev.concat(curr), [])
       .reduce((prev,curr) => prev.concat(curr), [])
       .reduce((prev,curr) => prev.concat(curr), []);
      let vertices = edges
        .map(edge => cylinderEdgeVertices(edge, scale))
        .reduce((prev,curr) => prev.concat(curr), [])
        .reduce((prev,curr) => prev.concat(curr), []);
      let normals = edges.map(edge => {
        let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1], edge[1][2] - edge[0][2]];
        let mag = Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1],2) + Math.pow(vec[2],2));
        if (mag < 1e-10) { throw "degenerate edge"; }
        let c0 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,-1])), scale);
        let c1 = scaleVec3(normalizeVec3(crossVec3(vec, [0,0,1])), scale);
        return [
          c0, [-c0[2], c0[1], c0[0]],
          c1, [-c1[2], c1[1], c1[0]],
          c0, [-c0[2], c0[1], c0[0]],
          c1, [-c1[2], c1[1], c1[0]]
        ]
      }).reduce((prev,curr) => prev.concat(curr), [])
        .reduce((prev,curr) => prev.concat(curr), []);
      let faces = edges.map((e,i) => [
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
      ]).reduce((prev,curr) => prev.concat(curr), []);
      var geometry = new THREE.BufferGeometry();
      geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geometry.addAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setIndex(faces);
      geometry.computeVertexNormals();
      var material = new THREE.MeshToonMaterial( {
          shininess: 0,
          side: THREE.DoubleSide, vertexColors: THREE.VertexColors
      } );
      return new THREE.Mesh(geometry, material);
    }
  }

  const prepareGraph = function (graph) {
    if ("faces_re:matrix" in graph === false) {
      graph["faces_re:matrix"] = make_faces_matrix(graph, 0);
    }
  };
  const setup = function (origami, svg) {
    prepareGraph(origami);
    let touchFaceIndex = 0;
    let cachedGraph = clone(origami);
    let was_folded = ("vertices_re:unfoldedCoords" in origami === true);
    svg.mousePressed = (mouse) => {
      was_folded = ("vertices_re:unfoldedCoords" in origami === true);
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
        const instruction = axiom2(mouse.pressed, mouse.position);
        origami.crease(instruction.solutions[0], touchFaceIndex);
        if (was_folded) { origami.fold(); }
      }
    };
  };

  const file_spec = 1.1;
  const file_creator = "Rabbit Ear";
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
  const square$1 = function () {
    return Object.assign(
      Object.create(null),
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

  const get_assignment = function (...args) {
    return args.filter(a => typeof a === "string")
      .filter(a => a.length === 1)
      .shift();
  };

  const Edges = function (graph, edges) {
    const valley = function () {
      edges.forEach((i) => { graph.edges_assignment[i] = "V"; });
      return edges;
    };
    const mountain = function () {
      edges.forEach((i) => { graph.edges_assignment[i] = "M"; });
      return edges;
    };
    const mark = function () {
      edges.forEach((i) => { graph.edges_assignment[i] = "F"; });
      return edges;
    };
    Object.defineProperty(edges, "valley", { value: valley });
    Object.defineProperty(edges, "mountain", { value: mountain });
    Object.defineProperty(edges, "mark", { value: mark });
    return edges;
  };

  const MARK_DEFAULTS = {
    rebuild: true,
    change: true,
  };
  const possible_mark_object = function (o) {
    if (typeof o !== "object" || o === null) { return false; }
    const argKeys = Object.keys(o);
    const defaultKeys = Object.keys(MARK_DEFAULTS);
    for (let i = 0; i < argKeys.length; i += 1) {
      if (defaultKeys.includes(argKeys[i])) { return true; }
    }
    return false;
  };
  const get_mark_options = function (...args) {
    const options = args.filter(o => typeof o === "object")
      .filter(o => possible_mark_object(o))
      .shift();
    return options === undefined
      ? clone(MARK_DEFAULTS)
      : Object.assign(clone(MARK_DEFAULTS), options);
  };
  const boundary_methods = function (boundaries) {
    const that = this;
    const clip = function (type, ...args) {
      let p;
      let l;
      switch (type) {
        case "edge": p = math.core.get_vector_of_vectors(...args); break;
        default:
          l = math.core.get_line(...args);
          p = [l.point, l.vector];
          break;
      }
      const func = {
        line: math.core.intersection.convex_poly_line,
        ray: math.core.intersection.convex_poly_ray,
        edge: math.core.intersection.convex_poly_edge
      };
      return boundaries
        .map(b => b.vertices.map(v => that.vertices_coords[v]))
        .map(b => func[type](b, ...p))
        .filter(segment => segment !== undefined);
    };
    boundaries.clipLine = function (...args) { return clip("line", ...args); };
    boundaries.clipRay = function (...args) { return clip("ray", ...args); };
    boundaries.clipEdge = function (...args) { return clip("edge", ...args); };
    return boundaries;
  };
  const Prototype$2 = function (proto = {}) {
    proto.square = function () {
      Object.keys(this).forEach(key => delete this[key]);
      const rect = rectangle(1, 1);
      Object.keys(rect).forEach((key) => { this[key] = rect[key]; });
    };
    proto.regularPolygon = function (sides = 3, radius = 1) {
      Object.keys(this).forEach(key => delete this[key]);
      const rect = regular_polygon(sides, radius);
      Object.keys(rect).forEach((key) => { this[key] = rect[key]; });
    };
    proto.copy = function () {
      return Object.assign(Object.create(Prototype$2()), clone(this));
    };
    const getVertices = function () {
      return transpose_geometry_arrays(this, "vertices");
    };
    const getEdges = function () {
      return transpose_geometry_arrays(this, "edges");
    };
    const getFaces = function () {
      return transpose_geometry_arrays(this, "faces");
    };
    const getBoundaries = function () {
      return boundary_methods.call(this, [get_boundary(this)]);
    };
    const isFolded = function () {
      if ("frame_classes" in this === false) { return undefined; }
      const cpIndex = this.frame_classes.indexOf("creasePattern");
      const foldedIndex = this.frame_classes.indexOf("foldedForm");
      if (cpIndex === -1 && foldedIndex === -1) { return undefined; }
      if (cpIndex !== -1 && foldedIndex !== -1) { return undefined; }
      return (foldedIndex !== -1);
    };
    proto.fragment = function (epsilon = math.core.EPSILON) {
      fragment(this, epsilon);
    };
    proto.rebuild = function (epsilon = math.core.EPSILON) {
      rebuild(this, epsilon);
    };
    proto.clean = function () {
      const cleaned = clean(this);
      Object.keys(cleaned).forEach((key) => { this[key] = cleaned[key]; });
      this["re:delaunay_vertices"] = make_delaunay_vertices(this);
      this["faces_re:matrix"] = make_faces_matrix(this);
      if (this[future_spec.FACES_LAYER] != null && this.faces_vertices != null) {
        if (this[future_spec.FACES_LAYER].length !== this.faces_vertices.length) {
          delete this[future_spec.FACES_LAYER];
        }
      }
    };
    proto.load = function (file, prevent_clear) {
      if (prevent_clear == null || prevent_clear !== true) {
        keys.forEach(key => delete this[key]);
      }
      Object.assign(this, clone(file));
      this.clean();
      this.didChange.forEach(f => f());
    };
    proto.clear = function () {
      remove_non_boundary_edges(this);
      Object.keys(this)
        .filter(s => s.includes("re:"))
        .forEach(key => delete this[key]);
      delete this.vertices_vertices;
      delete this.vertices_faces;
      delete this.edges_faces;
      this.didChange.forEach(f => f());
    };
    proto.nearestVertex = function (...args) {
      const point = math.core.get_vector(...args);
      const index = this["re:delaunay_vertices"] != null
        ? this["re:delaunay_vertices"].find(point[0], point[1])
        : nearest_vertex(this, point);
      const result = transpose_geometry_array_at_index(this, "vertices", index);
      result.index = index;
      return result;
    };
    proto.nearestEdge = function (...args) {
      const index = nearest_edge(this, math.core.get_vector(...args));
      const result = transpose_geometry_array_at_index(this, "edges", index);
      result.index = index;
      return result;
    };
    proto.nearestFace = function (...args) {
      const index = face_containing_point(this, math.core.get_vector(...args));
      if (index === undefined) { return undefined; }
      const result = transpose_geometry_array_at_index(this, "faces", index);
      result.index = index;
      return result;
    };
    proto.nearest = function (...args) {
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
    proto.scale = function (...args) {
      transform_scale(this, ...args);
    };
    const didModifyGraph = function () {
      this.didChange.forEach(f => f());
    };
    proto.segment = function (...args) {
      const s = math.core.flatten_input(...args)
        .filter(n => typeof n === "number");
      const assignment = get_assignment(...args) || "F";
      add_edge(this, s[0], s[1], s[2], s[3], assignment).apply();
      rebuild(this);
      didModifyGraph.call(this);
      const edges = collinear_edges(this, [s[0], s[1]], [s[2] - s[0], s[3] - s[1]]);
      return Edges(this, edges);
    };
    proto.mark = function (...args) {
      const s = math.core.get_vector_of_vectors(...args);
      const options = get_mark_options(...args);
      const assignment = get_assignment(...args) || "F";
      add_edge(this, s[0][0], s[0][1], s[1][0], s[1][1], assignment).apply();
      if (options.rebuild) { rebuild(this); }
      if (options.change) { this.didChange.forEach(f => f()); }
    };
    proto.crease = function (...args) {
      const objects = args.filter(p => typeof p === "object");
      const line = math.core.get_line(args);
      const assignment = get_assignment(...args) || "V";
      const face_index = args.filter(a => a !== null && !isNaN(a)).shift();
      if (!math.core.is_vector(line.point) || !math.core.is_vector(line.vector)) {
        console.warn("fold was not supplied the correct parameters");
        return;
      }
      const folded = fold_through(this,
        line.point,
        line.vector,
        face_index,
        assignment);
      Object.keys(folded).forEach((key) => { this[key] = folded[key]; });
      if ("re:construction" in this === true) {
        if (objects.length > 0 && "axiom" in objects[0] === true) {
          this["re:construction"].axiom = objects[0].axiom;
          this["re:construction"].parameters = objects[0].parameters;
        }
      }
      didModifyGraph.call(this);
    };
    proto.creaseRay = function (...args) {
      const ray = math.ray(args);
      const faces = this.faces_vertices.map(fv => fv.map(v => this.vertices_coords[v]));
      const intersecting = faces
        .map((face, i) => (math.core.intersection
          .convex_poly_ray_exclusive(face, ray.point, ray.vector) === undefined
          ? undefined : i))
        .filter(a => a !== undefined)
        .sort((a, b) => b - a);
      intersecting.forEach(index => split_convex_polygon$1(
        this, index, ray.point, ray.vector, "F"
      ));
    };
    proto.kawasaki = function (...args) {
      const crease = kawasaki_collapse(this, ...args);
      didModifyGraph.call(this);
      return crease;
    };
    Object.defineProperty(proto, "boundaries", { get: getBoundaries });
    Object.defineProperty(proto, "vertices", { get: getVertices });
    Object.defineProperty(proto, "edges", { get: getEdges });
    Object.defineProperty(proto, "faces", { get: getFaces });
    Object.defineProperty(proto, "isFolded", { value: isFolded });
    proto.didChange = [];
    return proto;
  };

  const DEFAULTS$2 = Object.freeze({
    touchFold: false,
  });
  const parseOptions$1 = function (...args) {
    const keys = Object.keys(DEFAULTS$2);
    const prefs = {};
    Array(...args)
      .filter(obj => typeof obj === "object")
      .forEach(obj => Object.keys(obj)
        .filter(key => keys.includes(key))
        .forEach((key) => { prefs[key] = obj[key]; }));
    return prefs;
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
  const Origami = function (...args) {
    const origami = Object.assign(
      Object.create(Prototype$2()),
      args.filter(el => possibleFoldObject(el)).shift() || square$1()
    );
    origami.clean();
    const setFoldedForm = function (isFolded) {
      const wasFolded = origami.isFolded();
      const remove = isFolded ? "creasePattern" : "foldedForm";
      const add = isFolded ? "foldedForm" : "creasePattern";
      if (origami.frame_classes == null) { origami.frame_classes = []; }
      while (origami.frame_classes.indexOf(remove) !== -1) {
        origami.frame_classes.splice(origami.frame_classes.indexOf(remove), 1);
      }
      if (origami.frame_classes.indexOf(add) === -1) {
        origami.frame_classes.push(add);
      }
      const to = isFolded ? "vertices_re:foldedCoords" : "vertices_re:unfoldedCoords";
      const from = isFolded ? "vertices_re:unfoldedCoords" : "vertices_re:foldedCoords";
      if (to in origami === true) {
        origami[from] = origami.vertices_coords;
        origami.vertices_coords = origami[to];
        delete origami[to];
      }
      origami.didChange.forEach(f => f());
    };
    const load = function (data, options) {
      keys.forEach(key => delete origami[key]);
      const fold_file = convert$1(data).fold(options);
      Object.assign(origami, fold_file);
      origami.clean();
      origami.didChange.forEach(f => f());
    };
    const collapse = function (options = {}) {
      if ("faces_re:matrix" in origami === false) {
        origami["faces_re:matrix"] = make_faces_matrix(origami, options.face);
      }
      if ("vertices_re:foldedCoords" in origami === false) {
        origami["vertices_re:foldedCoords"] = make_vertices_coords_folded(origami, null, origami["faces_re:matrix"]);
      }
      setFoldedForm(true);
      return origami;
    };
    const flatten = function () {
      setFoldedForm(false);
      return origami;
    };
    const fold = function (...args) {
      return origami;
    };
    const unfold = function () {
      return origami;
    };
    const get = function (component) {
      const a = transpose_geometry_arrays(origami, component);
      const view = origami.svg || origami.gl;
      Object.defineProperty(a, "visible", {
        get: () => view.options[component],
        set: (v) => {
          view.options[component] = !!v;
          origami.didChange.forEach(f => f());
        },
      });
      if (origami.svg != null) {
        a.forEach((el, i) => {
          el.svg = origami.svg.groups[component].childNodes[i];
        });
      }
      return a;
    };
    const nearest = function (...args2) {
      const plural = {
        vertex: "vertices",
        edge: "edges",
        face: "faces",
      };
      const target = math.core.get_vector(...args2);
      const nears = {
        vertex: origami.nearestVertex(origami, target),
        edge: origami.nearestEdge(origami, target),
        face: origami.nearestFace(origami, target)
      };
      Object.keys(nears)
        .filter(key => nears[key] == null)
        .forEach(key => delete nears[key]);
      if (origami.svg != null) {
        Object.keys(nears).forEach((key) => {
          nears[key].svg = origami.svg.groups[plural[key]].childNodes[nears[key].index];
        });
      }
      return nears;
    };
    const options = {};
    Object.assign(options, DEFAULTS$2);
    const userDefaults = parseOptions$1(...args);
    Object.keys(userDefaults)
      .forEach((key) => { options[key] = userDefaults[key]; });
    Object.defineProperty(origami, "load", { value: load });
    Object.defineProperty(origami, "collapse", { value: collapse });
    Object.defineProperty(origami, "flatten", { value: flatten });
    Object.defineProperty(origami, "fold", { value: fold });
    Object.defineProperty(origami, "unfold", { value: unfold });
    Object.defineProperty(origami, "nearest", { value: nearest });
    Object.defineProperty(origami, "vertices", { get: () => get.call(origami, "vertices") });
    Object.defineProperty(origami, "edges", { get: () => get.call(origami, "edges") });
    Object.defineProperty(origami, "faces", { get: () => get.call(origami, "faces") });
    const exportObject = function () { return JSON.stringify(origami); };
    exportObject.json = function () { return JSON.stringify(origami); };
    exportObject.fold = function () { return JSON.stringify(origami); };
    exportObject.svg = function () {
      if (origami.svg != null) {
        return (new win$1.XMLSerializer()).serializeToString(origami.svg);
      }
      return drawFOLD.svg(origami);
    };
    Object.defineProperty(origami, "snapshot", { get: () => exportObject });
    Object.defineProperty(origami, "export", { get: () => exportObject });
    Object.defineProperty(origami, "options", { get: () => options });
    return origami;
  };
  const init = function (...args) {
    const origami = Origami(...args);
    let view;
    switch (parseOptionsForView(...args)) {
      case "svg":
        view = View(origami, ...args);
        origami.didChange.push(view.draw);
        Object.defineProperty(origami, "svg", { get: () => view });
        if (origami.options.touchFold === true) {
          setup(origami, origami.svg);
        }
        origami.svg.fit();
        origami.svg.draw();
        break;
      case "webgl":
        view = View3D(origami, ...args);
        Object.defineProperty(origami, "canvas", { get: () => view });
        break;
      default: break;
    }
    return origami;
  };

  const get_assignment$1 = function (...args) {
    return args.filter(a => typeof a === "string")
      .filter(a => a.length === 1)
      .shift();
  };

  const Prototype$3 = function (proto = {}) {
    proto.vertices_didChange = function () { };
    proto.edges_didChange = function () { };
    proto.faces_didChange = function () { };
    proto.copy = function () {
      return Object.assign(Object.create(Prototype$3()), clone(this));
    };
    const getVertices = function () {
      return transpose_geometry_arrays(this, "vertices");
    };
    const getEdges = function () {
      return transpose_geometry_arrays(this, "edges");
    };
    const getFaces = function () {
      return transpose_geometry_arrays(this, "faces");
    };
    const getBoundaries = function () {
      return [get_boundary(this)];
    };
    proto.rebuild = function (epsilon = math.core.EPSILON) {
      rebuild(this, epsilon);
    };
    proto.complete = function () {
      complete(this);
    };
    proto.fragment = function (epsilon = math.core.EPSILON) {
      fragment(this, epsilon);
    };
    proto.clean = function () {
      const valid = ("vertices_coords" in this && "vertices_vertices" in this
        && "edges_vertices" in this && "edges_assignment" in this
        && "faces_vertices" in this && "faces_edges" in this);
      if (!valid) {
        clean(this);
      }
    };
    proto.clear = function () {
      remove_non_boundary_edges(this);
      Object.keys(this)
        .filter(s => s.includes("re:"))
        .forEach(key => delete this[key]);
      delete this.vertices_vertices;
      delete this.vertices_faces;
      delete this.edges_faces;
    };
    proto.nearestVertex = function (...args) {
      const index = nearest_vertex(this, math.core.get_vector(...args));
      const result = transpose_geometry_array_at_index(this, "vertices", index);
      result.index = index;
      return result;
    };
    proto.nearestEdge = function (...args) {
      const index = nearest_edge(this, math.core.get_vector(...args));
      const result = transpose_geometry_array_at_index(this, "edges", index);
      result.index = index;
      return result;
    };
    proto.nearestFace = function (...args) {
      const index = face_containing_point(this, math.core.get_vector(...args));
      if (index === undefined) { return undefined; }
      const result = transpose_geometry_array_at_index(this, "faces", index);
      result.index = index;
      return result;
    };
    proto.nearest = function (...args) {
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
    proto.scale = function (...args) {
      transform_scale(this, ...args);
    };
    proto.segment = function (...args) {
      const s = math.core.flatten_input(...args)
        .filter(n => typeof n === "number");
      const assignment = get_assignment$1(...args) || "F";
      add_edge(this, s[0], s[1], s[2], s[3], assignment).apply();
      rebuild(this);
    };
    Object.defineProperty(proto, "boundaries", { get: getBoundaries });
    Object.defineProperty(proto, "vertices", { get: getVertices });
    Object.defineProperty(proto, "edges", { get: getEdges });
    Object.defineProperty(proto, "faces", { get: getFaces });
    return Object.freeze(proto);
  };

  const DEFAULTS$3 = Object.freeze({
    touchFold: false,
  });
  const parseOptions$2 = function (...args) {
    const keys = Object.keys(DEFAULTS$3);
    const prefs = {};
    Array(...args)
      .filter(obj => typeof obj === "object")
      .forEach(obj => Object.keys(obj)
        .filter(key => keys.includes(key))
        .forEach((key) => { prefs[key] = obj[key]; }));
    return prefs;
  };
  const interpreter$1 = {
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
  const parseOptionsForView$1 = function (...args) {
    const viewOptions = args
      .filter(a => typeof a === "object")
      .filter(a => "view" in a === true)
      .shift();
    if (viewOptions === undefined) {
      if (isNode) { return undefined; }
      if (isBrowser) { return "svg"; }
    }
    return interpreter$1[viewOptions.view];
  };
  const Origami$1 = function (...args) {
    const origami = Object.assign(
      Object.create(Prototype$3()),
      args.filter(el => possibleFoldObject(el)).shift() || square$1()
    );
    clean(origami);
    const get = function (component) {
      const a = transpose_geometry_arrays(origami, component);
      const view = origami.svg || origami.gl;
      Object.defineProperty(a, "visible", {
        get: () => view.options[component],
        set: (v) => {
          view.options[component] = !!v;
          origami.didChange.forEach(f => f());
        },
      });
      if (origami.svg != null) {
        a.forEach((el, i) => {
          el.svg = origami.svg.groups[component].childNodes[i];
        });
      }
      return a;
    };
    const nearest = function (...args2) {
      const plural = {
        vertex: "vertices",
        edge: "edges",
        face: "faces",
      };
      const target = math.core.get_vector(...args2);
      const nears = {
        vertex: origami.nearestVertex(origami, target),
        edge: origami.nearestEdge(origami, target),
        face: origami.nearestFace(origami, target)
      };
      Object.keys(nears)
        .filter(key => nears[key] == null)
        .forEach(key => delete nears[key]);
      if (origami.svg != null) {
        Object.keys(nears).forEach((key) => {
          nears[key].svg = origami.svg.groups[plural[key]].childNodes[nears[key].index];
        });
      }
      return nears;
    };
    const options = {};
    Object.assign(options, DEFAULTS$3);
    const userDefaults = parseOptions$2(...args);
    Object.keys(userDefaults)
      .forEach((key) => { options[key] = userDefaults[key]; });
    Object.defineProperty(origami, "nearest", { value: nearest });
    Object.defineProperty(origami, "vertices", { get: () => get.call(origami, "vertices") });
    Object.defineProperty(origami, "edges", { get: () => get.call(origami, "edges") });
    Object.defineProperty(origami, "faces", { get: () => get.call(origami, "faces") });
    const exportObject = function () { return JSON.stringify(origami); };
    exportObject.json = function () { return JSON.stringify(origami); };
    exportObject.fold = function () { return JSON.stringify(origami); };
    exportObject.svg = function () {
      if (origami.svg != null) {
        return (new win$1.XMLSerializer()).serializeToString(origami.svg);
      }
      return drawFOLD.svg(origami);
    };
    Object.defineProperty(origami, "clean", { value: () => clean(origami) });
    Object.defineProperty(origami, "snapshot", { get: () => exportObject });
    Object.defineProperty(origami, "export", { get: () => exportObject });
    Object.defineProperty(origami, "options", { get: () => options });
    return origami;
  };
  const init$1 = function (...args) {
    const origami = Origami$1(...args);
    let view;
    switch (parseOptionsForView$1(...args)) {
      case "svg":
        view = View(origami, ...args);
        Object.defineProperty(origami, "svg", { get: () => view });
        if (origami.options.touchFold === true) {
          setup(origami, origami.svg);
        }
        origami.svg.fit();
        origami.svg.draw();
        break;
      case "webgl":
        view = View3D(origami, ...args);
        Object.defineProperty(origami, "canvas", { get: () => view });
        break;
      default: break;
    }
    return origami;
  };

  const core$1 = Object.create(null);
  Object.assign(core$1,
    frames,
    object,
    collinear,
    keys$1,
    affine,
    validate,
    remove,
    rebuild$1,
    make,
    delaunay,
    marks,
    query$1,
    kawasaki,
    Axioms);
  core$1.build_diagram_frame = build_diagram_frame;
  core$1.add_edge = add_edge;
  core$1.split_edge_run = add_vertex_on_edge$1;
  core$1.apply_run = apply_run_diff;
  core$1.merge_run = merge_run_diffs;
  core$1.apply_axiom = make_axiom_frame;
  core$1.fragment = fragment;
  core$1.clean = clean;
  core$1.validate = Validate;
  const b = {
    empty: JSON.parse(empty),
    square: JSON.parse(square),
    book: JSON.parse(book),
    blintz: JSON.parse(blintz),
    kite: JSON.parse(kite),
    fish: JSON.parse(fish),
    bird: JSON.parse(bird),
    frog: JSON.parse(frog),
  };
  const bases = Object.create(null);
  Object.defineProperty(bases, "empty", { get: () => core$1.clone(b.empty) });
  Object.defineProperty(bases, "square", { get: () => core$1.clone(b.square) });
  Object.defineProperty(bases, "book", { get: () => core$1.clone(b.book) });
  Object.defineProperty(bases, "blintz", { get: () => core$1.clone(b.blintz) });
  Object.defineProperty(bases, "kite", { get: () => core$1.clone(b.kite) });
  Object.defineProperty(bases, "fish", { get: () => core$1.clone(b.fish) });
  Object.defineProperty(bases, "bird", { get: () => core$1.clone(b.bird) });
  Object.defineProperty(bases, "frog", { get: () => core$1.clone(b.frog) });
  const rabbitEar = {
    CreasePattern: init$1,
    Origami: init,
    graph: Graph,
    Voronoi,
    Delaunay,
    svg: SVG,
    fold: fold_through,
    convert: convert$1,
    core: core$1,
    bases,
    math: math.core,
    axiom: axiom,
    equivalent: math.core.equivalent
  };
  Object.keys(math)
    .filter(key => key !== "core")
    .forEach((key) => { rabbitEar[key] = math[key]; });

  return rabbitEar;

}));
