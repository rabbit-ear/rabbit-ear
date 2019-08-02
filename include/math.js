/* Math (c) Robby Kraft, MIT License */
var magnitude = function magnitude(v) {
  var sum = v.map(function (component) {
    return component * component;
  }).reduce(function (prev, curr) {
    return prev + curr;
  }, 0);
  return Math.sqrt(sum);
};
var normalize = function normalize(v) {
  var m = magnitude(v);
  return v.map(function (c) {
    return c / m;
  });
};
var dot = function dot(a, b) {
  return a.map(function (_, i) {
    return a[i] * b[i];
  }).reduce(function (prev, curr) {
    return prev + curr;
  }, 0);
};
var average = function average() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var dimension = args.length > 0 ? args[0].length : 0;
  var sum = Array(dimension).fill(0);
  args.forEach(function (vec) {
    return sum.forEach(function (_, i) {
      sum[i] += vec[i] || 0;
    });
  });
  return sum.map(function (n) {
    return n / args.length;
  });
};
var cross2 = function cross2(a, b) {
  return [a[0] * b[1], a[1] * b[0]];
};
var cross3 = function cross3(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[0] * b[2] - a[2] * b[0], a[0] * b[1] - a[1] * b[0]];
};
var distance2 = function distance2(a, b) {
  var p = a[0] - b[0];
  var q = a[1] - b[1];
  return Math.sqrt(p * p + q * q);
};
var distance3 = function distance3(a, b) {
  var c = a[0] - b[0];
  var d = a[1] - b[1];
  var e = a[2] - b[2];
  return Math.sqrt(c * c + d * d + e * e);
};
var distance = function distance(a, b) {
  var dimension = a.length;
  var sum = 0;

  for (var i = 0; i < dimension; i += 1) {
    sum += Math.pow(a[i] - b[i], 2);
  }

  return Math.sqrt(sum);
};
var midpoint2 = function midpoint2(a, b) {
  return a.map(function (_, i) {
    return (a[i] + b[i]) / 2;
  });
};

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

var multiply_vector2_matrix2 = function multiply_vector2_matrix2(vector, matrix) {
  return [vector[0] * matrix[0] + vector[1] * matrix[2] + matrix[4], vector[0] * matrix[1] + vector[1] * matrix[3] + matrix[5]];
};
var multiply_line_matrix2 = function multiply_line_matrix2(point, vector, matrix) {
  var new_point = multiply_vector2_matrix2(point, matrix);
  var vec_point = vector.map(function (_, i) {
    return vector[i] + point[i];
  });
  var new_vector = multiply_vector2_matrix2(vec_point, matrix).map(function (vec, i) {
    return vec - new_point[i];
  });
  return [new_point, new_vector];
};
var multiply_matrices2 = function multiply_matrices2(m1, m2) {
  var a = m1[0] * m2[0] + m1[2] * m2[1];
  var c = m1[0] * m2[2] + m1[2] * m2[3];
  var tx = m1[0] * m2[4] + m1[2] * m2[5] + m1[4];
  var b = m1[1] * m2[0] + m1[3] * m2[1];
  var d = m1[1] * m2[2] + m1[3] * m2[3];
  var ty = m1[1] * m2[4] + m1[3] * m2[5] + m1[5];
  return [a, b, c, d, tx, ty];
};
var make_matrix2_translation = function make_matrix2_translation(x, y) {
  return [1, 0, 0, 1, x, y];
};
var make_matrix2_scale = function make_matrix2_scale(ratio) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
  var tx = ratio * -origin[0] + origin[0];
  var ty = ratio * -origin[1] + origin[1];
  return [ratio, 0, 0, ratio, tx, ty];
};
var make_matrix2_rotation = function make_matrix2_rotation(angle) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
  var a = Math.cos(angle);
  var b = Math.sin(angle);
  var c = -b;
  var d = a;
  var tx = origin[0];
  var ty = origin[1];
  return [a, b, c, d, tx, ty];
};
var make_matrix2_reflection = function make_matrix2_reflection(vector, origin) {
  var origin_x = origin && origin[0] ? origin[0] : 0;
  var origin_y = origin && origin[1] ? origin[1] : 0;
  var angle = Math.atan2(vector[1], vector[0]);
  var cosAngle = Math.cos(angle);
  var sinAngle = Math.sin(angle);
  var cos_Angle = Math.cos(-angle);
  var sin_Angle = Math.sin(-angle);
  var a = cosAngle * cos_Angle + sinAngle * sin_Angle;
  var b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
  var c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
  var d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
  var tx = origin_x + a * -origin_x + -origin_y * c;
  var ty = origin_y + b * -origin_x + -origin_y * d;
  return [a, b, c, d, tx, ty];
};
var make_matrix2_inverse = function make_matrix2_inverse(m) {
  var det = m[0] * m[3] - m[1] * m[2];

  if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
    return undefined;
  }

  return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
};
var multiply_vector4_matrix4 = function multiply_vector4_matrix4(v, m) {
  var result = [];
  result[0] = m[0] * v[0] + m[1] * v[1] + m[2] * v[2] + m[3] * v[3];
  result[1] = m[4] * v[0] + m[5] * v[1] + m[6] * v[2] + m[7] * v[3];
  result[2] = m[8] * v[0] + m[9] * v[1] + m[10] * v[2] + m[11] * v[3];
  result[3] = m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3];
  return result;
};
var make_matrix4_scale = function make_matrix4_scale(ratio) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
  var tx = ratio * -origin[0] + origin[0];
  var ty = ratio * -origin[1] + origin[1];
  var tz = ratio * -origin[2] + origin[2];
  return [ratio, 0, 0, 0, 0, ratio, 0, 0, 0, 0, ratio, 0, tx, ty, tz, 1];
};
var make_matrix4_inverse = function make_matrix4_inverse(m) {
  var inv = [];
  inv[0] = m[5] * m[10] * m[15] - m[5] * m[11] * m[14] - m[9] * m[6] * m[15] + m[9] * m[7] * m[14] + m[13] * m[6] * m[11] - m[13] * m[7] * m[10];
  inv[4] = -m[4] * m[10] * m[15] + m[4] * m[11] * m[14] + m[8] * m[6] * m[15] - m[8] * m[7] * m[14] - m[12] * m[6] * m[11] + m[12] * m[7] * m[10];
  inv[8] = m[4] * m[9] * m[15] - m[4] * m[11] * m[13] - m[8] * m[5] * m[15] + m[8] * m[7] * m[13] + m[12] * m[5] * m[11] - m[12] * m[7] * m[9];
  inv[12] = -m[4] * m[9] * m[14] + m[4] * m[10] * m[13] + m[8] * m[5] * m[14] - m[8] * m[6] * m[13] - m[12] * m[5] * m[10] + m[12] * m[6] * m[9];
  inv[1] = -m[1] * m[10] * m[15] + m[1] * m[11] * m[14] + m[9] * m[2] * m[15] - m[9] * m[3] * m[14] - m[13] * m[2] * m[11] + m[13] * m[3] * m[10];
  inv[5] = m[0] * m[10] * m[15] - m[0] * m[11] * m[14] - m[8] * m[2] * m[15] + m[8] * m[3] * m[14] + m[12] * m[2] * m[11] - m[12] * m[3] * m[10];
  inv[9] = -m[0] * m[9] * m[15] + m[0] * m[11] * m[13] + m[8] * m[1] * m[15] - m[8] * m[3] * m[13] - m[12] * m[1] * m[11] + m[12] * m[3] * m[9];
  inv[13] = m[0] * m[9] * m[14] - m[0] * m[10] * m[13] - m[8] * m[1] * m[14] + m[8] * m[2] * m[13] + m[12] * m[1] * m[10] - m[12] * m[2] * m[9];
  inv[2] = m[1] * m[6] * m[15] - m[1] * m[7] * m[14] - m[5] * m[2] * m[15] + m[5] * m[3] * m[14] + m[13] * m[2] * m[7] - m[13] * m[3] * m[6];
  inv[6] = -m[0] * m[6] * m[15] + m[0] * m[7] * m[14] + m[4] * m[2] * m[15] - m[4] * m[3] * m[14] - m[12] * m[2] * m[7] + m[12] * m[3] * m[6];
  inv[10] = m[0] * m[5] * m[15] - m[0] * m[7] * m[13] - m[4] * m[1] * m[15] + m[4] * m[3] * m[13] + m[12] * m[1] * m[7] - m[12] * m[3] * m[5];
  inv[14] = -m[0] * m[5] * m[14] + m[0] * m[6] * m[13] + m[4] * m[1] * m[14] - m[4] * m[2] * m[13] - m[12] * m[1] * m[6] + m[12] * m[2] * m[5];
  inv[3] = -m[1] * m[6] * m[11] + m[1] * m[7] * m[10] + m[5] * m[2] * m[11] - m[5] * m[3] * m[10] - m[9] * m[2] * m[7] + m[9] * m[3] * m[6];
  inv[7] = m[0] * m[6] * m[11] - m[0] * m[7] * m[10] - m[4] * m[2] * m[11] + m[4] * m[3] * m[10] + m[8] * m[2] * m[7] - m[8] * m[3] * m[6];
  inv[11] = -m[0] * m[5] * m[11] + m[0] * m[7] * m[9] + m[4] * m[1] * m[11] - m[4] * m[3] * m[9] - m[8] * m[1] * m[7] + m[8] * m[3] * m[5];
  inv[15] = m[0] * m[5] * m[10] - m[0] * m[6] * m[9] - m[4] * m[1] * m[10] + m[4] * m[2] * m[9] + m[8] * m[1] * m[6] - m[8] * m[2] * m[5];
  var det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

  if (det < 1e-6 && det > -1e-6) {
    return undefined;
  }

  var inverseDeterminant = 1.0 / det;
  return inv.map(function (n) {
    return n * inverseDeterminant;
  });
};
var transpose_matrix4 = function transpose_matrix4(m) {
  return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
};
var multiply_matrices4 = function multiply_matrices4(a, b) {
  return [a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12], a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13], a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14], a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15], a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12], a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13], a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14], a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15], a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12], a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13], a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14], a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15], a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12], a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13], a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14], a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]];
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

var clean_number = function clean_number(num) {
  var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
  return parseFloat(num.toFixed(places));
};
var is_number = function is_number(n) {
  return n != null && !isNaN(n);
};
var is_vector = function is_vector(a) {
  return a != null && a[0] != null && !isNaN(a[0]);
};
var is_iterable = function is_iterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === "function";
};
var flatten_input = function flatten_input() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  switch (args.length) {
    case undefined:
    case 0:
      return args;

    case 1:
      return is_iterable(args[0]) && typeof args[0] !== "string" ? flatten_input.apply(void 0, _toConsumableArray(args[0])) : [args[0]];

    default:
      return Array.from(args).map(function (a) {
        return is_iterable(a) ? _toConsumableArray(flatten_input(a)) : a;
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
  }
};
var semi_flatten_input = function semi_flatten_input() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var list = args;

  while (list.length === 1 && list[0].length) {
    var _list = list;

    var _list2 = _slicedToArray(_list, 1);

    list = _list2[0];
  }

  return list;
};
var get_vector = function get_vector() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var list = flatten_input(args).filter(function (a) {
    return a !== undefined;
  });

  if (list === undefined) {
    return undefined;
  }

  if (list.length === 0) {
    return undefined;
  }

  if (!isNaN(list[0].x)) {
    list = ["x", "y", "z"].map(function (c) {
      return list[0][c];
    }).filter(function (a) {
      return a !== undefined;
    });
  }

  return list.filter(function (n) {
    return typeof n === "number";
  });
};
var get_vector_of_vectors = function get_vector_of_vectors() {
  for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  return semi_flatten_input(args).map(function (el) {
    return get_vector(el);
  });
};
var identity2 = [1, 0, 0, 1, 0, 0];
var identity4 = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
var get_matrix2 = function get_matrix2() {
  for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  var m = get_vector(args);

  if (m === undefined) {
    return undefined;
  }

  if (m.length === 6) {
    return m;
  }

  if (m.length > 6) {
    return [m[0], m[1], m[2], m[3], m[4], m[5]];
  }

  if (m.length < 6) {
    return identity2.map(function (n, i) {
      return m[i] || n;
    });
  }

  return undefined;
};
var get_matrix4 = function get_matrix4() {
  for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }

  var m = get_vector(args);

  if (m === undefined) {
    return undefined;
  }

  if (m.length === 16) {
    return m;
  }

  if (m.length === 9) {
    return [m[0], m[1], m[2], 0, m[3], m[4], m[5], 0, m[6], m[7], m[8], 0, 0, 0, 0, 1];
  }

  if (m.length === 6) {
    return [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, m[4], m[5], 0, 1];
  }

  if (m.length === 4) {
    return [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  if (m.length > 16) {
    return [m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]];
  }

  if (m.length < 16) {
    return identity4.map(function (n, i) {
      return m[i] || n;
    });
  }

  return undefined;
};
function get_edge() {
  for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    args[_key7] = arguments[_key7];
  }

  return get_vector_of_vectors(args);
}
function get_line() {
  var params = Array.from(arguments);
  var numbers = params.filter(function (param) {
    return !isNaN(param);
  });
  var arrays = params.filter(function (param) {
    return param.constructor === Array;
  });

  if (params.length == 0) {
    return {
      vector: [],
      point: []
    };
  }

  if (!isNaN(params[0]) && numbers.length >= 4) {
    return {
      point: [params[0], params[1]],
      vector: [params[2], params[3]]
    };
  }

  if (arrays.length > 0) {
    if (arrays.length === 1) {
      return get_line.apply(void 0, _toConsumableArray(arrays[0]));
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
    var vector = [],
        point = [];

    if (params[0].vector != null) {
      vector = get_vector(params[0].vector);
    } else if (params[0].direction != null) {
      vector = get_vector(params[0].direction);
    }

    if (params[0].point != null) {
      point = get_vector(params[0].point);
    } else if (params[0].origin != null) {
      point = get_vector(params[0].origin);
    }

    return {
      point: point,
      vector: vector
    };
  }

  return {
    point: [],
    vector: []
  };
}
function get_ray() {
  return get_line.apply(void 0, arguments);
}
function get_two_vec2() {
  for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    args[_key8] = arguments[_key8];
  }

  if (args.length === 0) {
    return undefined;
  }

  if (args.length === 1 && args[0] !== undefined) {
    return get_two_vec2.apply(void 0, _toConsumableArray(args[0]));
  }

  var params = Array.from(args);
  var numbers = params.filter(function (param) {
    return !isNaN(param);
  });
  var arrays = params.filter(function (o) {
    return _typeof(o) === "object";
  }).filter(function (param) {
    return param.constructor === Array;
  });

  if (numbers.length >= 4) {
    return [[numbers[0], numbers[1]], [numbers[2], numbers[3]]];
  }

  if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
    return arrays;
  }

  if (arrays.length === 1 && !isNaN(arrays[0][0][0])) {
    return arrays[0];
  }

  return undefined;
}
function get_array_of_vec() {
  for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    args[_key9] = arguments[_key9];
  }

  if (args.length === 0) {
    return undefined;
  }

  if (args.length === 1 && args[0] !== undefined) {
    return get_array_of_vec.apply(void 0, _toConsumableArray(args[0]));
  }

  return Array.from(args);
}
function get_array_of_vec2() {
  var params = Array.from(arguments);
  var arrays = params.filter(function (param) {
    return param.constructor === Array;
  });

  if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
    return arrays;
  }

  if (arrays.length === 1 && arrays[0].length >= 1) {
    return arrays[0];
  }

  return params;
}

var EPSILON = 1e-6;

var array_similarity_test = function array_similarity_test(list, compFunc) {
  return Array.from(Array(list.length - 1)).map(function (_, i) {
    return compFunc(list[0], list[i + 1]);
  }).reduce(function (a, b) {
    return a && b;
  }, true);
};

var equivalent_numbers = function equivalent_numbers() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 0) {
    return false;
  }

  if (args.length === 1 && args[0] !== undefined) {
    return equivalent_numbers.apply(void 0, _toConsumableArray(args[0]));
  }

  return array_similarity_test(args, function (a, b) {
    return Math.abs(a - b) < EPSILON;
  });
};
var equivalent_vectors = function equivalent_vectors() {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var list = get_vector_of_vectors(args);

  if (list.length === 0) {
    return false;
  }

  if (list.length === 1 && list[0] !== undefined) {
    return equivalent_vectors.apply(void 0, _toConsumableArray(list[0]));
  }

  var dimension = list[0].length;
  var dim_array = Array.from(Array(dimension));
  return Array.from(Array(list.length - 1)).map(function (element, i) {
    return dim_array.map(function (_, di) {
      return Math.abs(list[i][di] - list[i + 1][di]) < EPSILON;
    }).reduce(function (prev, curr) {
      return prev && curr;
    }, true);
  }).reduce(function (prev, curr) {
    return prev && curr;
  }, true) && Array.from(Array(list.length - 1)).map(function (_, i) {
    return list[0].length === list[i + 1].length;
  }).reduce(function (a, b) {
    return a && b;
  }, true);
};
var equivalent = function equivalent() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var list = semi_flatten_input(args);

  if (list.length < 1) {
    return false;
  }

  var typeofList = _typeof(list[0]);

  if (typeofList === "undefined") {
    return false;
  }

  if (list[0].constructor === Array) {
    list = list.map(function (el) {
      return semi_flatten_input(el);
    });
  }

  switch (typeofList) {
    case "number":
      return array_similarity_test(list, function (a, b) {
        return Math.abs(a - b) < EPSILON;
      });

    case "boolean":
      return array_similarity_test(list, function (a, b) {
        return a === b;
      });

    case "object":
      if (list[0].constructor === Array) {
        return equivalent_vectors(list);
      }

      console.warn("comparing array of objects for equivalency by slow stringify and no-epsilon");
      return array_similarity_test(list, function (a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
      });

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

var overlap_function = function overlap_function(aPt, aVec, bPt, bVec, compFunc) {
  var det = function det(a, b) {
    return a[0] * b[1] - b[0] * a[1];
  };

  var denominator0 = det(aVec, bVec);
  var denominator1 = -denominator0;
  var numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
  var numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);

  if (Math.abs(denominator0) < EPSILON) {
    return false;
  }

  var t0 = numerator0 / denominator0;
  var t1 = numerator1 / denominator1;
  return compFunc(t0, t1);
};

var edge_edge_comp = function edge_edge_comp(t0, t1) {
  return t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
};

var edge_edge_overlap = function edge_edge_overlap(a0, a1, b0, b1) {
  var aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  var bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return overlap_function(a0, aVec, b0, bVec, edge_edge_comp);
};
var degenerate = function degenerate(v) {
  return Math.abs(v.reduce(function (a, b) {
    return a + b;
  }, 0)) < EPSILON;
};
var parallel = function parallel(a, b) {
  return 1 - Math.abs(dot(normalize(a), normalize(b))) < EPSILON;
};
var point_on_line = function point_on_line(linePoint, lineVector, point) {
  var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
  var pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
  var cross = pointPoint[0] * lineVector[1] - pointPoint[1] * lineVector[0];
  return Math.abs(cross) < epsilon;
};
var point_on_edge = function point_on_edge(edge0, edge1, point) {
  var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
  var edge0_1 = [edge0[0] - edge1[0], edge0[1] - edge1[1]];
  var edge0_p = [edge0[0] - point[0], edge0[1] - point[1]];
  var edge1_p = [edge1[0] - point[0], edge1[1] - point[1]];
  var dEdge = Math.sqrt(edge0_1[0] * edge0_1[0] + edge0_1[1] * edge0_1[1]);
  var dP0 = Math.sqrt(edge0_p[0] * edge0_p[0] + edge0_p[1] * edge0_p[1]);
  var dP1 = Math.sqrt(edge1_p[0] * edge1_p[0] + edge1_p[1] * edge1_p[1]);
  return Math.abs(dEdge - dP0 - dP1) < epsilon;
};
var point_in_poly = function point_in_poly(point, poly) {
  var isInside = false;

  for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    if (poly[i][1] > point[1] != poly[j][1] > point[1] && point[0] < (poly[j][0] - poly[i][0]) * (point[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) {
      isInside = !isInside;
    }
  }

  return isInside;
};
var point_in_convex_poly = function point_in_convex_poly(point, poly) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;

  if (poly == null || !(poly.length > 0)) {
    return false;
  }

  return poly.map(function (p, i, arr) {
    var nextP = arr[(i + 1) % arr.length];
    var a = [nextP[0] - p[0], nextP[1] - p[1]];
    var b = [point[0] - p[0], point[1] - p[1]];
    return a[0] * b[1] - a[1] * b[0] > -epsilon;
  }).map(function (s, i, arr) {
    return s === arr[0];
  }).reduce(function (prev, curr) {
    return prev && curr;
  }, true);
};
var point_in_convex_poly_exclusive = function point_in_convex_poly_exclusive(point, poly) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;

  if (poly == null || !(poly.length > 0)) {
    return false;
  }

  return poly.map(function (p, i, arr) {
    var nextP = arr[(i + 1) % arr.length];
    var a = [nextP[0] - p[0], nextP[1] - p[1]];
    var b = [point[0] - p[0], point[1] - p[1]];
    return a[0] * b[1] - a[1] * b[0] > epsilon;
  }).map(function (s, i, arr) {
    return s === arr[0];
  }).reduce(function (prev, curr) {
    return prev && curr;
  }, true);
};
var convex_polygons_overlap = function convex_polygons_overlap(ps1, ps2) {
  var e1 = ps1.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  });
  var e2 = ps2.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  });

  for (var i = 0; i < e1.length; i += 1) {
    for (var j = 0; j < e2.length; j += 1) {
      if (edge_edge_overlap(e1[i][0], e1[i][1], e2[j][0], e2[j][1])) {
        return true;
      }
    }
  }

  if (point_in_poly(ps2[0], ps1)) {
    return true;
  }

  if (point_in_poly(ps1[0], ps2)) {
    return true;
  }

  return false;
};
var convex_polygon_is_enclosed = function convex_polygon_is_enclosed(inner, outer) {
  var goesInside = outer.map(function (p) {
    return point_in_convex_poly(p, inner);
  }).reduce(function (a, b) {
    return a || b;
  }, false);

  if (goesInside) {
    return false;
  }

  return undefined;
};
var convex_polygons_enclose = function convex_polygons_enclose(inner, outer) {
  var outerGoesInside = outer.map(function (p) {
    return point_in_convex_poly(p, inner);
  }).reduce(function (a, b) {
    return a || b;
  }, false);
  var innerGoesOutside = inner.map(function (p) {
    return point_in_convex_poly(p, inner);
  }).reduce(function (a, b) {
    return a && b;
  }, true);
  return !outerGoesInside && innerGoesOutside;
};
var is_counter_clockwise_between = function is_counter_clockwise_between(angle, angleA, angleB) {
  while (angleB < angleA) {
    angleB += Math.PI * 2;
  }

  while (angle < angleA) {
    angle += Math.PI * 2;
  }

  return angle < angleB;
};

var query = /*#__PURE__*/Object.freeze({
  overlap_function: overlap_function,
  edge_edge_overlap: edge_edge_overlap,
  degenerate: degenerate,
  parallel: parallel,
  point_on_line: point_on_line,
  point_on_edge: point_on_edge,
  point_in_poly: point_in_poly,
  point_in_convex_poly: point_in_convex_poly,
  point_in_convex_poly_exclusive: point_in_convex_poly_exclusive,
  convex_polygons_overlap: convex_polygons_overlap,
  convex_polygon_is_enclosed: convex_polygon_is_enclosed,
  convex_polygons_enclose: convex_polygons_enclose,
  is_counter_clockwise_between: is_counter_clockwise_between
});

var line_line_comp = function line_line_comp() {
  return true;
};

var line_ray_comp = function line_ray_comp(t0, t1) {
  return t1 >= -EPSILON;
};

var line_edge_comp = function line_edge_comp(t0, t1) {
  return t1 >= -EPSILON && t1 <= 1 + EPSILON;
};

var ray_ray_comp = function ray_ray_comp(t0, t1) {
  return t0 >= -EPSILON && t1 >= -EPSILON;
};

var ray_edge_comp = function ray_edge_comp(t0, t1) {
  return t0 >= -EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
};

var edge_edge_comp$1 = function edge_edge_comp(t0, t1) {
  return t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
};

var line_ray_comp_exclusive = function line_ray_comp_exclusive(t0, t1) {
  return t1 > EPSILON;
};

var line_edge_comp_exclusive = function line_edge_comp_exclusive(t0, t1) {
  return t1 > EPSILON && t1 < 1 - EPSILON;
};

var ray_ray_comp_exclusive = function ray_ray_comp_exclusive(t0, t1) {
  return t0 > EPSILON && t1 > EPSILON;
};

var ray_edge_comp_exclusive = function ray_edge_comp_exclusive(t0, t1) {
  return t0 > EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
};

var edge_edge_comp_exclusive = function edge_edge_comp_exclusive(t0, t1) {
  return t0 > EPSILON && t0 < 1 - EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
};

var limit_line = function limit_line(dist) {
  return dist;
};
var limit_ray = function limit_ray(dist) {
  return dist < -EPSILON ? 0 : dist;
};
var limit_edge = function limit_edge(dist) {
  if (dist < -EPSILON) {
    return 0;
  }

  if (dist > 1 + EPSILON) {
    return 1;
  }

  return dist;
};
var intersection_function = function intersection_function(aPt, aVec, bPt, bVec, compFunc) {
  var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;

  function det(a, b) {
    return a[0] * b[1] - b[0] * a[1];
  }

  var denominator0 = det(aVec, bVec);

  if (Math.abs(denominator0) < epsilon) {
    return undefined;
  }

  var denominator1 = -denominator0;
  var numerator0 = det([bPt[0] - aPt[0], bPt[1] - aPt[1]], bVec);
  var numerator1 = det([aPt[0] - bPt[0], aPt[1] - bPt[1]], aVec);
  var t0 = numerator0 / denominator0;
  var t1 = numerator1 / denominator1;

  if (compFunc(t0, t1, epsilon)) {
    return [aPt[0] + aVec[0] * t0, aPt[1] + aVec[1] * t0];
  }

  return undefined;
};
var line_line = function line_line(aPt, aVec, bPt, bVec, epsilon) {
  return intersection_function(aPt, aVec, bPt, bVec, line_line_comp, epsilon);
};
var line_ray = function line_ray(linePt, lineVec, rayPt, rayVec, epsilon) {
  return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp, epsilon);
};
var line_edge = function line_edge(point, vec, edge0, edge1, epsilon) {
  var edgeVec = [edge1[0] - edge0[0], edge1[1] - edge0[1]];
  return intersection_function(point, vec, edge0, edgeVec, line_edge_comp, epsilon);
};
var ray_ray = function ray_ray(aPt, aVec, bPt, bVec, epsilon) {
  return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp, epsilon);
};
var ray_edge = function ray_edge(rayPt, rayVec, edge0, edge1, epsilon) {
  var edgeVec = [edge1[0] - edge0[0], edge1[1] - edge0[1]];
  return intersection_function(rayPt, rayVec, edge0, edgeVec, ray_edge_comp, epsilon);
};
var edge_edge = function edge_edge(a0, a1, b0, b1, epsilon) {
  var aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  var bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return intersection_function(a0, aVec, b0, bVec, edge_edge_comp$1, epsilon);
};
var line_ray_exclusive = function line_ray_exclusive(linePt, lineVec, rayPt, rayVec, epsilon) {
  return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp_exclusive, epsilon);
};
var line_edge_exclusive = function line_edge_exclusive(point, vec, edge0, edge1, epsilon) {
  var edgeVec = [edge1[0] - edge0[0], edge1[1] - edge0[1]];
  return intersection_function(point, vec, edge0, edgeVec, line_edge_comp_exclusive, epsilon);
};
var ray_ray_exclusive = function ray_ray_exclusive(aPt, aVec, bPt, bVec, epsilon) {
  return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp_exclusive, epsilon);
};
var ray_edge_exclusive = function ray_edge_exclusive(rayPt, rayVec, edge0, edge1, epsilon) {
  var edgeVec = [edge1[0] - edge0[0], edge1[1] - edge0[1]];
  return intersection_function(rayPt, rayVec, edge0, edgeVec, ray_edge_comp_exclusive, epsilon);
};
var edge_edge_exclusive = function edge_edge_exclusive(a0, a1, b0, b1, epsilon) {
  var aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  var bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return intersection_function(a0, aVec, b0, bVec, edge_edge_comp_exclusive, epsilon);
};
var circle_line = function circle_line(center, radius, p0, p1) {
  var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
  var x1 = p0[0] - center[0];
  var y1 = p0[1] - center[1];
  var x2 = p1[0] - center[0];
  var y2 = p1[1] - center[1];
  var dx = x2 - x1;
  var dy = y2 - y1;
  var det = x1 * y2 - x2 * y1;
  var det_sq = det * det;
  var r_sq = radius * radius;
  var dr_sq = Math.abs(dx * dx + dy * dy);
  var delta = r_sq * dr_sq - det_sq;

  if (delta < -epsilon) {
    return undefined;
  }

  var suffix = Math.sqrt(r_sq * dr_sq - det_sq);

  function sgn(x) {
    return x < -epsilon ? -1 : 1;
  }

  var solutionA = [center[0] + (det * dy + sgn(dy) * dx * suffix) / dr_sq, center[1] + (-det * dx + Math.abs(dy) * suffix) / dr_sq];

  if (delta > epsilon) {
    var solutionB = [center[0] + (det * dy - sgn(dy) * dx * suffix) / dr_sq, center[1] + (-det * dx - Math.abs(dy) * suffix) / dr_sq];
    return [solutionA, solutionB];
  }

  return [solutionA];
};
var circle_ray = function circle_ray(center, radius, p0, p1) {
  throw "circle_ray has not been written yet";
};
var circle_edge = function circle_edge(center, radius, p0, p1) {
  var r_squared = Math.pow(radius, 2);
  var x1 = p0[0] - center[0];
  var y1 = p0[1] - center[1];
  var x2 = p1[0] - center[0];
  var y2 = p1[1] - center[1];
  var dx = x2 - x1;
  var dy = y2 - y1;
  var dr_squared = dx * dx + dy * dy;
  var D = x1 * y2 - x2 * y1;

  function sgn(x) {
    if (x < 0) {
      return -1;
    }

    return 1;
  }

  var x_1 = (D * dy + sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - D * D)) / dr_squared;
  var x_2 = (D * dy - sgn(dy) * dx * Math.sqrt(r_squared * dr_squared - D * D)) / dr_squared;
  var y_1 = (-D * dx + Math.abs(dy) * Math.sqrt(r_squared * dr_squared - D * D)) / dr_squared;
  var y_2 = (-D * dx - Math.abs(dy) * Math.sqrt(r_squared * dr_squared - D * D)) / dr_squared;
  var x1_NaN = isNaN(x_1);
  var x2_NaN = isNaN(x_2);

  if (!x1_NaN && !x2_NaN) {
    return [[x_1 + center[0], y_1 + center[1]], [x_2 + center[0], y_2 + center[1]]];
  }

  if (x1_NaN && x2_NaN) {
    return undefined;
  }

  if (!x1_NaN) {
    return [[x_1 + center[0], y_1 + center[1]]];
  }

  if (!x2_NaN) {
    return [[x_2 + center[0], y_2 + center[1]]];
  }
};

var quick_equivalent_2 = function quick_equivalent_2(a, b) {
  return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
};

var convex_poly_line = function convex_poly_line(poly, linePoint, lineVector) {
  var intersections = poly.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  }).map(function (el) {
    return line_edge(linePoint, lineVector, el[0], el[1]);
  }).filter(function (el) {
    return el != null;
  });

  switch (intersections.length) {
    case 0:
      return undefined;

    case 1:
      return [intersections[0], intersections[0]];

    case 2:
      return intersections;

    default:
      for (var i = 1; i < intersections.length; i += 1) {
        if (!quick_equivalent_2(intersections[0], intersections[i])) {
          return [intersections[0], intersections[i]];
        }
      }

      return undefined;
  }
};
var convex_poly_ray = function convex_poly_ray(poly, linePoint, lineVector) {
  var intersections = poly.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  }).map(function (el) {
    return ray_edge(linePoint, lineVector, el[0], el[1]);
  }).filter(function (el) {
    return el != null;
  });

  switch (intersections.length) {
    case 0:
      return undefined;

    case 1:
      return [linePoint, intersections[0]];

    case 2:
      return intersections;

    default:
      for (var i = 1; i < intersections.length; i += 1) {
        if (!quick_equivalent_2(intersections[0], intersections[i])) {
          return [intersections[0], intersections[i]];
        }
      }

      return undefined;
  }
};
var convex_poly_edge = function convex_poly_edge(poly, edgeA, edgeB) {
  var intersections = poly.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  }).map(function (el) {
    return edge_edge_exclusive(edgeA, edgeB, el[0], el[1]);
  }).filter(function (el) {
    return el != null;
  });
  var aInsideExclusive = point_in_convex_poly_exclusive(edgeA, poly);
  var bInsideExclusive = point_in_convex_poly_exclusive(edgeB, poly);
  var aInsideInclusive = point_in_convex_poly(edgeA, poly);
  var bInsideInclusive = point_in_convex_poly(edgeB, poly);

  if (intersections.length === 0 && (aInsideExclusive || bInsideExclusive)) {
    return [edgeA, edgeB];
  }

  if (intersections.length === 0 && aInsideInclusive && bInsideInclusive) {
    return [edgeA, edgeB];
  }

  switch (intersections.length) {
    case 0:
      return aInsideExclusive ? [_toConsumableArray(edgeA), _toConsumableArray(edgeB)] : undefined;

    case 1:
      return aInsideInclusive ? [_toConsumableArray(edgeA), intersections[0]] : [_toConsumableArray(edgeB), intersections[0]];

    case 2:
      return intersections;

    default:
      throw new Error("clipping edge in a convex polygon resulting in 3 or more points");
  }
};
var convex_poly_ray_exclusive = function convex_poly_ray_exclusive(poly, linePoint, lineVector) {
  var intersections = poly.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  }).map(function (el) {
    return ray_edge_exclusive(linePoint, lineVector, el[0], el[1]);
  }).filter(function (el) {
    return el != null;
  });

  switch (intersections.length) {
    case 0:
      return undefined;

    case 1:
      return [linePoint, intersections[0]];

    case 2:
      return intersections;

    default:
      for (var i = 1; i < intersections.length; i += 1) {
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
  limit_edge: limit_edge,
  intersection_function: intersection_function,
  line_line: line_line,
  line_ray: line_ray,
  line_edge: line_edge,
  ray_ray: ray_ray,
  ray_edge: ray_edge,
  edge_edge: edge_edge,
  line_ray_exclusive: line_ray_exclusive,
  line_edge_exclusive: line_edge_exclusive,
  ray_ray_exclusive: ray_ray_exclusive,
  ray_edge_exclusive: ray_edge_exclusive,
  edge_edge_exclusive: edge_edge_exclusive,
  circle_line: circle_line,
  circle_ray: circle_ray,
  circle_edge: circle_edge,
  convex_poly_line: convex_poly_line,
  convex_poly_ray: convex_poly_ray,
  convex_poly_edge: convex_poly_edge,
  convex_poly_ray_exclusive: convex_poly_ray_exclusive
});

var clockwise_angle2_radians = function clockwise_angle2_radians(a, b) {
  while (a < 0) {
    a += Math.PI * 2;
  }

  while (b < 0) {
    b += Math.PI * 2;
  }

  var a_b = a - b;
  return a_b >= 0 ? a_b : Math.PI * 2 - (b - a);
};
var counter_clockwise_angle2_radians = function counter_clockwise_angle2_radians(a, b) {
  while (a < 0) {
    a += Math.PI * 2;
  }

  while (b < 0) {
    b += Math.PI * 2;
  }

  var b_a = b - a;
  return b_a >= 0 ? b_a : Math.PI * 2 - (a - b);
};
var clockwise_angle2 = function clockwise_angle2(a, b) {
  var dotProduct = b[0] * a[0] + b[1] * a[1];
  var determinant = b[0] * a[1] - b[1] * a[0];
  var angle = Math.atan2(determinant, dotProduct);

  if (angle < 0) {
    angle += Math.PI * 2;
  }

  return angle;
};
var counter_clockwise_angle2 = function counter_clockwise_angle2(a, b) {
  var dotProduct = a[0] * b[0] + a[1] * b[1];
  var determinant = a[0] * b[1] - a[1] * b[0];
  var angle = Math.atan2(determinant, dotProduct);

  if (angle < 0) {
    angle += Math.PI * 2;
  }

  return angle;
};
var counter_clockwise_vector_order = function counter_clockwise_vector_order() {
  for (var _len = arguments.length, vectors = new Array(_len), _key = 0; _key < _len; _key++) {
    vectors[_key] = arguments[_key];
  }

  var vectors_radians = vectors.map(function (v) {
    return Math.atan2(v[1], v[0]);
  });
  var counter_clockwise = Array.from(Array(vectors_radians.length)).map(function (_, i) {
    return i;
  }).sort(function (a, b) {
    return vectors_radians[a] - vectors_radians[b];
  });
  return counter_clockwise.slice(counter_clockwise.indexOf(0), counter_clockwise.length).concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
};
var interior_angles2 = function interior_angles2(a, b) {
  var interior1 = counter_clockwise_angle2(a, b);
  var interior2 = Math.PI * 2 - interior1;
  return [interior1, interior2];
};
var interior_angles = function interior_angles() {
  for (var _len2 = arguments.length, vectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    vectors[_key2] = arguments[_key2];
  }

  return vectors.map(function (v, i, ar) {
    return counter_clockwise_angle2(v, ar[(i + 1) % ar.length]);
  });
};
var bisect_vectors = function bisect_vectors(a, b) {
  var aV = normalize(a);
  var bV = normalize(b);
  var sum = aV.map(function (_, i) {
    return aV[i] + bV[i];
  });
  var vecA = normalize(sum);
  var vecB = aV.map(function (_, i) {
    return -aV[i] + -bV[i];
  });
  return [vecA, normalize(vecB)];
};
var bisect_lines2 = function bisect_lines2(pointA, vectorA, pointB, vectorB) {
  var denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];

  if (Math.abs(denominator) < EPSILON) {
    var solution = [midpoint2(pointA, pointB), [vectorA[0], vectorA[1]]];
    var array = [solution, solution];
    var dot$$1 = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
    delete (dot$$1 > 0 ? array[1] : array[0]);
    return array;
  }

  var numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
  var t = numerator / denominator;
  var x = pointA[0] + vectorA[0] * t;
  var y = pointA[1] + vectorA[1] * t;
  var bisects = bisect_vectors(vectorA, vectorB);
  bisects[1] = [bisects[1][1], -bisects[1][0]];
  return bisects.map(function (el) {
    return [[x, y], el];
  });
};
var subsect_radians = function subsect_radians(divisions, angleA, angleB) {
  var angle = counter_clockwise_angle2(angleA, angleB) / divisions;
  return Array.from(Array(divisions - 1)).map(function (_, i) {
    return angleA + angle * i;
  });
};
var subsect = function subsect(divisions, vectorA, vectorB) {
  var angleA = Math.atan2(vectorA[1], vectorA[0]);
  var angleB = Math.atan2(vectorB[1], vectorB[0]);
  return subsect_radians(divisions, angleA, angleB).map(function (rad) {
    return [Math.cos(rad), Math.sin(rad)];
  });
};
var signed_area = function signed_area(points) {
  return 0.5 * points.map(function (el, i, arr) {
    var next = arr[(i + 1) % arr.length];
    return el[0] * next[1] - next[0] * el[1];
  }).reduce(function (a, b) {
    return a + b;
  }, 0);
};
var centroid = function centroid(points) {
  var sixthArea = 1 / (6 * signed_area(points));
  return points.map(function (el, i, arr) {
    var next = arr[(i + 1) % arr.length];
    var mag = el[0] * next[1] - next[0] * el[1];
    return [(el[0] + next[0]) * mag, (el[1] + next[1]) * mag];
  }).reduce(function (a, b) {
    return [a[0] + b[0], a[1] + b[1]];
  }, [0, 0]).map(function (c) {
    return c * sixthArea;
  });
};
var enclosing_rectangle = function enclosing_rectangle(points) {
  var l = points[0].length;
  var mins = Array.from(Array(l)).map(function () {
    return Infinity;
  });
  var maxs = Array.from(Array(l)).map(function () {
    return -Infinity;
  });
  points.forEach(function (point) {
    return point.forEach(function (c, i) {
      if (c < mins[i]) {
        mins[i] = c;
      }

      if (c > maxs[i]) {
        maxs[i] = c;
      }
    });
  });
  var lengths = maxs.map(function (max, i) {
    return max - mins[i];
  });
  return [mins, lengths];
};
var make_regular_polygon = function make_regular_polygon(sides) {
  var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var halfwedge = 2 * Math.PI / sides * 0.5;
  var r = radius / Math.cos(halfwedge);
  return Array.from(Array(Math.floor(sides))).map(function (_, i) {
    var a = -2 * Math.PI * i / sides + halfwedge;
    var px = clean_number(x + r * Math.sin(a), 14);
    var py = clean_number(y + r * Math.cos(a), 14);
    return [px, py];
  });
};

var smallest_comparison_search = function smallest_comparison_search(obj, array, compare_func) {
  var objs = array.map(function (o, i) {
    return {
      o: o,
      i: i,
      d: compare_func(obj, o)
    };
  });
  var index;
  var smallest_value = Infinity;

  for (var i = 0; i < objs.length; i += 1) {
    if (objs[i].d < smallest_value) {
      index = i;
      smallest_value = objs[i].d;
    }
  }

  return index;
};

var nearest_point2 = function nearest_point2(point, array_of_points) {
  var index = smallest_comparison_search(point, array_of_points, distance2);
  return index === undefined ? undefined : array_of_points[index];
};
var nearest_point = function nearest_point(point, array_of_points) {
  var index = smallest_comparison_search(point, array_of_points, distance);
  return index === undefined ? undefined : array_of_points[index];
};
var nearest_point_on_line = function nearest_point_on_line(linePoint, lineVec, point, limiterFunc) {
  var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
  var magSquared = Math.pow(lineVec[0], 2) + Math.pow(lineVec[1], 2);
  var vectorToPoint = [0, 1].map(function (_, i) {
    return point[i] - linePoint[i];
  });
  var pTo0 = [0, 1].map(function (_, i) {
    return point[i] - linePoint[i];
  });
  var dot$$1 = [0, 1].map(function (_, i) {
    return lineVec[i] * vectorToPoint[i];
  }).reduce(function (a, b) {
    return a + b;
  }, 0);
  var distance$$1 = dot$$1 / magSquared;
  var d = limiterFunc(distance$$1, epsilon);
  return [0, 1].map(function (_, i) {
    return linePoint[i] + lineVec[i] * d;
  });
};
var split_polygon = function split_polygon(poly, linePoint, lineVector) {
  var vertices_intersections = poly.map(function (v, i) {
    var intersection = point_on_line(linePoint, lineVector, v);
    return {
      type: "v",
      point: intersection ? v : null,
      at_index: i
    };
  }).filter(function (el) {
    return el.point != null;
  });
  var edges_intersections = poly.map(function (v, i, arr) {
    var intersection = line_edge_exclusive(linePoint, lineVector, v, arr[(i + 1) % arr.length]);
    return {
      type: "e",
      point: intersection,
      at_index: i
    };
  }).filter(function (el) {
    return el.point != null;
  });
  var sorted = vertices_intersections.concat(edges_intersections).sort(function (a, b) {
    return Math.abs(a.point[0] - b.point[0]) < EPSILON ? a.point[1] - b.point[1] : a.point[0] - b.point[0];
  });
  console.log(sorted);
  return poly;
};
var split_convex_polygon = function split_convex_polygon(poly, linePoint, lineVector) {
  var vertices_intersections = poly.map(function (v, i) {
    var intersection = point_on_line(linePoint, lineVector, v);
    return {
      point: intersection ? v : null,
      at_index: i
    };
  }).filter(function (el) {
    return el.point != null;
  });
  var edges_intersections = poly.map(function (v, i, arr) {
    var intersection = line_edge_exclusive(linePoint, lineVector, v, arr[(i + 1) % arr.length]);
    return {
      point: intersection,
      at_index: i
    };
  }).filter(function (el) {
    return el.point != null;
  });

  if (edges_intersections.length == 2) {
    var sorted_edges = edges_intersections.slice().sort(function (a, b) {
      return a.at_index - b.at_index;
    });
    var face_a = poly.slice(sorted_edges[1].at_index + 1).concat(poly.slice(0, sorted_edges[0].at_index + 1));
    face_a.push(sorted_edges[0].point);
    face_a.push(sorted_edges[1].point);
    var face_b = poly.slice(sorted_edges[0].at_index + 1, sorted_edges[1].at_index + 1);
    face_b.push(sorted_edges[1].point);
    face_b.push(sorted_edges[0].point);
    return [face_a, face_b];
  } else if (edges_intersections.length == 1 && vertices_intersections.length == 1) {
    vertices_intersections[0]["type"] = "v";
    edges_intersections[0]["type"] = "e";
    var sorted_geom = vertices_intersections.concat(edges_intersections).sort(function (a, b) {
      return a.at_index - b.at_index;
    });

    var _face_a = poly.slice(sorted_geom[1].at_index + 1).concat(poly.slice(0, sorted_geom[0].at_index + 1));

    if (sorted_geom[0].type === "e") {
      _face_a.push(sorted_geom[0].point);
    }

    _face_a.push(sorted_geom[1].point);

    var _face_b = poly.slice(sorted_geom[0].at_index + 1, sorted_geom[1].at_index + 1);

    if (sorted_geom[1].type === "e") {
      _face_b.push(sorted_geom[1].point);
    }

    _face_b.push(sorted_geom[0].point);

    return [_face_a, _face_b];
  } else if (vertices_intersections.length == 2) {
    var sorted_vertices = vertices_intersections.slice().sort(function (a, b) {
      return a.at_index - b.at_index;
    });

    var _face_a2 = poly.slice(sorted_vertices[1].at_index).concat(poly.slice(0, sorted_vertices[0].at_index + 1));

    var _face_b2 = poly.slice(sorted_vertices[0].at_index, sorted_vertices[1].at_index + 1);

    return [_face_a2, _face_b2];
  }

  return [poly.slice()];
};
var convex_hull = function convex_hull(points) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
  var INFINITE_LOOP = 10000;
  var sorted = points.slice().sort(function (a, b) {
    return Math.abs(a[1] - b[1]) < epsilon ? a[0] - b[0] : a[1] - b[1];
  });
  var hull = [];
  hull.push(sorted[0]);
  var ang = 0;
  var infiniteLoop = 0;

  var _loop = function _loop() {
    infiniteLoop += 1;
    var h = hull.length - 1;
    var angles = sorted.filter(function (el) {
      return !(Math.abs(el[0] - hull[h][0]) < epsilon && Math.abs(el[1] - hull[h][1]) < epsilon);
    }).map(function (el) {
      var angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);

      while (angle < ang) {
        angle += Math.PI * 2;
      }

      return {
        node: el,
        angle: angle,
        distance: undefined
      };
    }).sort(function (a, b) {
      return a.angle < b.angle ? -1 : a.angle > b.angle ? 1 : 0;
    });

    if (angles.length === 0) {
      return {
        v: undefined
      };
    }

    var rightTurn = angles[0];
    angles = angles.filter(function (el) {
      return Math.abs(rightTurn.angle - el.angle) < epsilon;
    }).map(function (el) {
      var distance$$1 = Math.sqrt(Math.pow(hull[h][0] - el.node[0], 2) + Math.pow(hull[h][1] - el.node[1], 2));
      el.distance = distance$$1;
      return el;
    }).sort(function (a, b) {
      return a.distance < b.distance ? 1 : a.distance > b.distance ? -1 : 0;
    });

    if (hull.filter(function (el) {
      return el === angles[0].node;
    }).length > 0) {
      return {
        v: hull
      };
    }

    hull.push(angles[0].node);
    ang = Math.atan2(hull[h][1] - angles[0].node[1], hull[h][0] - angles[0].node[0]);
  };

  do {
    var _ret = _loop();

    if (_typeof(_ret) === "object") return _ret.v;
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

var alternating_sum = function alternating_sum() {
  for (var _len = arguments.length, angles = new Array(_len), _key = 0; _key < _len; _key++) {
    angles[_key] = arguments[_key];
  }

  return [0, 1].map(function (even_odd) {
    return angles.filter(function (_, i) {
      return i % 2 === even_odd;
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
  });
};
var kawasaki_sector_score = function kawasaki_sector_score() {
  return alternating_sum.apply(void 0, arguments).map(function (a) {
    return a < 0 ? a + Math.PI * 2 : a;
  }).map(function (s) {
    return Math.PI - s;
  });
};
var kawasaki_solutions_radians = function kawasaki_solutions_radians() {
  for (var _len2 = arguments.length, vectors_radians = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    vectors_radians[_key2] = arguments[_key2];
  }

  return vectors_radians.map(function (v, i, ar) {
    return counter_clockwise_angle2_radians(v, ar[(i + 1) % ar.length]);
  }).map(function (_, i, arr) {
    return arr.slice(i + 1, arr.length).concat(arr.slice(0, i));
  }).map(function (opposite_sectors) {
    return kawasaki_sector_score.apply(void 0, _toConsumableArray(opposite_sectors));
  }).map(function (kawasakis, i) {
    return vectors_radians[i] + kawasakis[0];
  }).map(function (angle, i) {
    return is_counter_clockwise_between(angle, vectors_radians[i], vectors_radians[(i + 1) % vectors_radians.length]) ? angle : undefined;
  });
};
var kawasaki_solutions = function kawasaki_solutions() {
  for (var _len3 = arguments.length, vectors = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    vectors[_key3] = arguments[_key3];
  }

  var vectors_radians = vectors.map(function (v) {
    return Math.atan2(v[1], v[0]);
  });
  return kawasaki_solutions_radians.apply(void 0, _toConsumableArray(vectors_radians)).map(function (a) {
    return a === undefined ? undefined : [clean_number(Math.cos(a), 14), clean_number(Math.sin(a), 14)];
  });
};

var origami = /*#__PURE__*/Object.freeze({
  alternating_sum: alternating_sum,
  kawasaki_sector_score: kawasaki_sector_score,
  kawasaki_solutions_radians: kawasaki_solutions_radians,
  kawasaki_solutions: kawasaki_solutions
});

var VectorPrototype = function VectorPrototype(subtype) {
  var proto = [];
  var Type = subtype;

  var _this;

  var bind = function bind(that) {
    _this = that;
  };

  var vecNormalize = function vecNormalize() {
    return Type(normalize(_this));
  };

  var vecDot = function vecDot() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var vec = get_vector(args);
    return this.length > vec.length ? dot(vec, _this) : dot(_this, vec);
  };

  var cross = function cross() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var b = get_vector(args);

    var a = _this.slice();

    if (a[2] == null) {
      a[2] = 0;
    }

    if (b[2] == null) {
      b[2] = 0;
    }

    return Type(cross3(a, b));
  };

  var distanceTo = function distanceTo() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var vec = get_vector(args);
    var length = _this.length < vec.length ? _this.length : vec.length;
    var sum = Array.from(Array(length)).map(function (_, i) {
      return Math.pow(_this[i] - vec[i], 2);
    }).reduce(function (prev, curr) {
      return prev + curr;
    }, 0);
    return Math.sqrt(sum);
  };

  var transform = function transform() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    var m = get_matrix2(args);
    return Type(multiply_vector2_matrix2(_this, m));
  };

  var add = function add() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    var vec = get_vector(args);
    return Type(_this.map(function (v, i) {
      return v + vec[i];
    }));
  };

  var subtract = function subtract() {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    var vec = get_vector(args);
    return Type(_this.map(function (v, i) {
      return v - vec[i];
    }));
  };

  var rotateZ = function rotateZ(angle, origin) {
    var m = make_matrix2_rotation(angle, origin);
    return Type(multiply_vector2_matrix2(_this, m));
  };

  var rotateZ90 = function rotateZ90() {
    return Type(-_this[1], _this[0]);
  };

  var rotateZ180 = function rotateZ180() {
    return Type(-_this[0], -_this[1]);
  };

  var rotateZ270 = function rotateZ270() {
    return Type(_this[1], -_this[0]);
  };

  var reflect = function reflect() {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    var ref = get_line(args);
    var m = make_matrix2_reflection(ref.vector, ref.point);
    return Type(multiply_vector2_matrix2(_this, m));
  };

  var lerp = function lerp(vector, pct) {
    var vec = get_vector(vector);
    var inv = 1.0 - pct;
    var length = _this.length < vec.length ? _this.length : vec.length;
    var components = Array.from(Array(length)).map(function (_, i) {
      return _this[i] * pct + vec[i] * inv;
    });
    return Type(components);
  };

  var isEquivalent = function isEquivalent() {
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    var vec = get_vector(args);
    var sm = _this.length < vec.length ? _this : vec;
    var lg = _this.length < vec.length ? vec : _this;
    return equivalent(sm, lg);
  };

  var isParallel = function isParallel() {
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
    }

    var vec = get_vector(args);
    var sm = _this.length < vec.length ? _this : vec;
    var lg = _this.length < vec.length ? vec : _this;
    return parallel(sm, lg);
  };

  var scale = function scale(mag) {
    return Type(_this.map(function (v) {
      return v * mag;
    }));
  };

  var midpoint = function midpoint() {
    for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
    }

    var vec = get_vector(args);
    var sm = _this.length < vec.length ? _this.slice() : vec;
    var lg = _this.length < vec.length ? vec : _this.slice();

    for (var i = sm.length; i < lg.length; i += 1) {
      sm[i] = 0;
    }

    return Type(lg.map(function (_, i) {
      return (sm[i] + lg[i]) * 0.5;
    }));
  };

  var bisect = function bisect() {
    for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
    }

    var vec = get_vector(args);
    return bisect_vectors(_this, vec).map(function (b) {
      return Type(b);
    });
  };

  Object.defineProperty(proto, "normalize", {
    value: vecNormalize
  });
  Object.defineProperty(proto, "dot", {
    value: vecDot
  });
  Object.defineProperty(proto, "cross", {
    value: cross
  });
  Object.defineProperty(proto, "distanceTo", {
    value: distanceTo
  });
  Object.defineProperty(proto, "transform", {
    value: transform
  });
  Object.defineProperty(proto, "add", {
    value: add
  });
  Object.defineProperty(proto, "subtract", {
    value: subtract
  });
  Object.defineProperty(proto, "rotateZ", {
    value: rotateZ
  });
  Object.defineProperty(proto, "rotateZ90", {
    value: rotateZ90
  });
  Object.defineProperty(proto, "rotateZ180", {
    value: rotateZ180
  });
  Object.defineProperty(proto, "rotateZ270", {
    value: rotateZ270
  });
  Object.defineProperty(proto, "reflect", {
    value: reflect
  });
  Object.defineProperty(proto, "lerp", {
    value: lerp
  });
  Object.defineProperty(proto, "isEquivalent", {
    value: isEquivalent
  });
  Object.defineProperty(proto, "isParallel", {
    value: isParallel
  });
  Object.defineProperty(proto, "scale", {
    value: scale
  });
  Object.defineProperty(proto, "midpoint", {
    value: midpoint
  });
  Object.defineProperty(proto, "bisect", {
    value: bisect
  });
  Object.defineProperty(proto, "copy", {
    value: function value() {
      return Type.apply(void 0, _toConsumableArray(_this));
    }
  });
  Object.defineProperty(proto, "magnitude", {
    get: function get() {
      return magnitude(_this);
    }
  });
  Object.defineProperty(proto, "bind", {
    value: bind
  });
  return proto;
};

var Vector = function Vector() {
  var proto = VectorPrototype(Vector);
  var vector = Object.create(proto);
  proto.bind(vector);

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  get_vector(args).forEach(function (v) {
    return vector.push(v);
  });
  Object.defineProperty(vector, "x", {
    get: function get() {
      return vector[0];
    }
  });
  Object.defineProperty(vector, "y", {
    get: function get() {
      return vector[1];
    }
  });
  Object.defineProperty(vector, "z", {
    get: function get() {
      return vector[2];
    }
  });
  return vector;
};

var Matrix2 = function Matrix2() {
  var matrix = [1, 0, 0, 1, 0, 0];

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var argsMatrix = get_matrix2(args);

  if (argsMatrix !== undefined) {
    argsMatrix.forEach(function (n, i) {
      matrix[i] = n;
    });
  }

  var inverse = function inverse() {
    return Matrix2(make_matrix2_inverse(matrix).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  var multiply = function multiply() {
    for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      innerArgs[_key2] = arguments[_key2];
    }

    var m2 = get_matrix2(innerArgs);
    return Matrix2(multiply_matrices2(matrix, m2).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  var transform = function transform() {
    for (var _len3 = arguments.length, innerArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      innerArgs[_key3] = arguments[_key3];
    }

    var v = get_vector(innerArgs);
    return Vector(multiply_vector2_matrix2(v, matrix).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Object.defineProperty(matrix, "inverse", {
    value: inverse
  });
  Object.defineProperty(matrix, "multiply", {
    value: multiply
  });
  Object.defineProperty(matrix, "transform", {
    value: transform
  });
  return Object.freeze(matrix);
};

Matrix2.makeIdentity = function () {
  return Matrix2(1, 0, 0, 1, 0, 0);
};

Matrix2.makeTranslation = function (tx, ty) {
  return Matrix2(1, 0, 0, 1, tx, ty);
};

Matrix2.makeScale = function () {
  return Matrix2.apply(void 0, _toConsumableArray(make_matrix2_scale.apply(void 0, arguments)));
};

Matrix2.makeRotation = function (angle, origin) {
  return Matrix2(make_matrix2_rotation(angle, origin).map(function (n) {
    return clean_number(n, 13);
  }));
};

Matrix2.makeReflection = function (vector, origin) {
  return Matrix2(make_matrix2_reflection(vector, origin).map(function (n) {
    return clean_number(n, 13);
  }));
};

var Matrix = function Matrix() {
  var matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  var argsMatrix = get_matrix4(args);

  if (argsMatrix !== undefined) {
    argsMatrix.forEach(function (n, i) {
      matrix[i] = n;
    });
  }

  var inverse = function inverse() {
    return Matrix(make_matrix4_inverse(matrix).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  var multiply = function multiply() {
    for (var _len5 = arguments.length, innerArgs = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      innerArgs[_key5] = arguments[_key5];
    }

    var m2 = get_matrix4(innerArgs);
    return Matrix(multiply_matrices4(matrix, m2).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  var transform = function transform() {
    for (var _len6 = arguments.length, innerArgs = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      innerArgs[_key6] = arguments[_key6];
    }

    var v = get_vector(innerArgs);
    return Vector(multiply_vector4_matrix4(v, matrix).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Object.defineProperty(matrix, "inverse", {
    value: inverse
  });
  Object.defineProperty(matrix, "multiply", {
    value: multiply
  });
  Object.defineProperty(matrix, "transform", {
    value: transform
  });
  return Object.freeze(matrix);
};

Matrix.makeIdentity = function () {
  return Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
};

Matrix.makeTranslation = function (tx, ty, tz) {
  return Matrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1);
};

Matrix.makeScale = function () {
  return Matrix.apply(void 0, _toConsumableArray(make_matrix4_scale.apply(void 0, arguments)));
};

function Prototype (subtype, prototype) {
  var proto = prototype != null ? prototype : {};

  var compare_to_line = function compare_to_line(t0, t1) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return this.compare_function(t0, epsilon) && true;
  };

  var compare_to_ray = function compare_to_ray(t0, t1) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return this.compare_function(t0, epsilon) && t1 >= -epsilon;
  };

  var compare_to_edge = function compare_to_edge(t0, t1) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return this.compare_function(t0, epsilon) && t1 >= -epsilon && t1 <= 1 + epsilon;
  };

  var isParallel = function isParallel(line, epsilon) {
    if (line.vector == null) {
      throw "line isParallel(): please ensure object contains a vector";
    }

    var this_is_smaller = this.vector.length < line.vector.length;
    var sm = this_is_smaller ? this.vector : line.vector;
    var lg = this_is_smaller ? line.vector : this.vector;
    return parallel(sm, lg, epsilon);
  };

  var isDegenerate = function isDegenerate() {
    var epsilon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : EPSILON;
    return degenerate(this.vector, epsilon);
  };

  var reflection = function reflection() {
    return Matrix2.makeReflection(this.vector, this.point);
  };

  var nearestPoint = function nearestPoint() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var point = get_vector(args);
    return Vector(nearest_point_on_line(this.point, this.vector, point, this.clip_function));
  };

  var intersect = function intersect(other) {
    var _this = this;

    return intersection_function(this.point, this.vector, other.point, other.vector, function (t0, t1) {
      var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
      return _this.compare_function(t0, epsilon) && other.compare_function(t1, epsilon);
    });
  };

  var intersectLine = function intersectLine() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var line = get_line(args);
    return intersection_function(this.point, this.vector, line.point, line.vector, compare_to_line.bind(this));
  };

  var intersectRay = function intersectRay() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var ray = get_ray(args);
    return intersection_function(this.point, this.vector, ray.point, ray.vector, compare_to_ray.bind(this));
  };

  var intersectEdge = function intersectEdge() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    var edge = get_edge(args);
    var edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
    return intersection_function(this.point, this.vector, edge[0], edgeVec, compare_to_edge.bind(this));
  };

  Object.defineProperty(proto, "isParallel", {
    value: isParallel
  });
  Object.defineProperty(proto, "isDegenerate", {
    value: isDegenerate
  });
  Object.defineProperty(proto, "nearestPoint", {
    value: nearestPoint
  });
  Object.defineProperty(proto, "reflection", {
    value: reflection
  });
  Object.defineProperty(proto, "intersect", {
    value: intersect
  });
  Object.defineProperty(proto, "intersectLine", {
    value: intersectLine
  });
  Object.defineProperty(proto, "intersectRay", {
    value: intersectRay
  });
  Object.defineProperty(proto, "intersectEdge", {
    value: intersectEdge
  });
  return Object.freeze(proto);
}

var Line = function Line() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _get_line = get_line(args),
      point = _get_line.point,
      vector = _get_line.vector;

  var transform = function transform() {
    for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      innerArgs[_key2] = arguments[_key2];
    }

    var mat = get_matrix2(innerArgs);
    var line = multiply_line_matrix2(point, vector, mat);
    return Line(line[0], line[1]);
  };

  var proto = Prototype.bind(this);
  var line = Object.create(proto(Line));

  var compare_function = function compare_function() {
    return true;
  };

  Object.defineProperty(line, "compare_function", {
    value: compare_function
  });
  Object.defineProperty(line, "clip_function", {
    value: limit_line
  });
  Object.defineProperty(line, "point", {
    get: function get() {
      return Vector(point);
    }
  });
  Object.defineProperty(line, "vector", {
    get: function get() {
      return Vector(vector);
    }
  });
  Object.defineProperty(line, "length", {
    get: function get() {
      return Infinity;
    }
  });
  Object.defineProperty(line, "transform", {
    value: transform
  });
  return line;
};

Line.fromPoints = function () {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var points = get_two_vec2(args);
  return Line({
    point: points[0],
    vector: normalize([points[1][0] - points[0][0], points[1][1] - points[0][1]])
  });
};

Line.perpendicularBisector = function () {
  for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  var points = get_two_vec2(args);
  var vec = normalize([points[1][0] - points[0][0], points[1][1] - points[0][1]]);
  return Line({
    point: average(points[0], points[1]),
    vector: [vec[1], -vec[0]]
  });
};

var Ray = function Ray() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _get_line = get_line(args),
      point = _get_line.point,
      vector = _get_line.vector;

  var transform = function transform() {
    for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      innerArgs[_key2] = arguments[_key2];
    }

    var mat = get_matrix2(innerArgs);
    var new_point = multiply_vector2_matrix2(point, mat);
    var vec_point = vector.map(function (vec, i) {
      return vec + point[i];
    });
    var new_vector = multiply_vector2_matrix2(vec_point, mat).map(function (vec, i) {
      return vec - new_point[i];
    });
    return Ray(new_point, new_vector);
  };

  var rotate180 = function rotate180() {
    return Ray(point[0], point[1], -vector[0], -vector[1]);
  };

  var proto = Prototype.bind(this);
  var ray = Object.create(proto(Ray));

  var compare_function = function compare_function(t0, ep) {
    return t0 >= -ep;
  };

  Object.defineProperty(ray, "point", {
    get: function get() {
      return Vector(point);
    }
  });
  Object.defineProperty(ray, "vector", {
    get: function get() {
      return Vector(vector);
    }
  });
  Object.defineProperty(ray, "length", {
    get: function get() {
      return Infinity;
    }
  });
  Object.defineProperty(ray, "transform", {
    value: transform
  });
  Object.defineProperty(ray, "rotate180", {
    value: rotate180
  });
  Object.defineProperty(ray, "compare_function", {
    value: compare_function
  });
  Object.defineProperty(ray, "clip_function", {
    value: limit_ray
  });
  return ray;
};

Ray.fromPoints = function () {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var points = get_two_vec2(args);
  return Ray({
    point: points[0],
    vector: normalize([points[1][0] - points[0][0], points[1][1] - points[0][1]])
  });
};

var Edge = function Edge() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var inputs = get_two_vec2(args);
  var proto = Prototype.bind(this);
  var edge = Object.create(proto(Edge, []));
  var vecPts = inputs.length > 0 ? inputs.map(function (p) {
    return Vector(p);
  }) : undefined;

  if (vecPts === undefined) {
    return undefined;
  }

  vecPts.forEach(function (p, i) {
    edge[i] = p;
  });

  var transform = function transform() {
    for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      innerArgs[_key2] = arguments[_key2];
    }

    var mat = get_matrix2(innerArgs);
    var transformed_points = edge.map(function (point) {
      return multiply_vector2_matrix2(point, mat);
    });
    return Edge(transformed_points);
  };

  var vector = function vector() {
    return Vector(edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]);
  };

  var midpoint = function midpoint() {
    return Vector(average(edge[0], edge[1]));
  };

  var length = function length() {
    return Math.sqrt(Math.pow(edge[1][0] - edge[0][0], 2) + Math.pow(edge[1][1] - edge[0][1], 2));
  };

  var compare_function = function compare_function(t0, ep) {
    return t0 >= -ep && t0 <= 1 + ep;
  };

  Object.defineProperty(edge, "point", {
    get: function get() {
      return edge[0];
    }
  });
  Object.defineProperty(edge, "vector", {
    get: function get() {
      return vector();
    }
  });
  Object.defineProperty(edge, "midpoint", {
    value: midpoint
  });
  Object.defineProperty(edge, "length", {
    get: function get() {
      return length();
    }
  });
  Object.defineProperty(edge, "transform", {
    value: transform
  });
  Object.defineProperty(edge, "compare_function", {
    value: compare_function
  });
  Object.defineProperty(edge, "clip_function", {
    value: limit_edge
  });
  return edge;
};

var Circle = function Circle() {
  var origin;
  var radius;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var params = Array.from(args);
  var numbers = params.filter(function (param) {
    return !isNaN(param);
  });

  if (numbers.length === 3) {
    origin = Vector(numbers[0], numbers[1]);

    var _numbers = _slicedToArray(numbers, 3);

    radius = _numbers[2];
  }

  var intersectionLine = function intersectionLine() {
    for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      innerArgs[_key2] = arguments[_key2];
    }

    var line = get_line(innerArgs);
    var p2 = [line.point[0] + line.vector[0], line.point[1] + line.vector[1]];
    var result = circle_line(origin, radius, line.point, p2);
    return result === undefined ? undefined : result.map(function (i) {
      return Vector(i);
    });
  };

  var intersectionRay = function intersectionRay() {
    for (var _len3 = arguments.length, innerArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      innerArgs[_key3] = arguments[_key3];
    }

    var ray = get_ray(innerArgs);
    var result = circle_ray(origin, radius, ray[0], ray[1]);
    return result === undefined ? undefined : result.map(function (i) {
      return Vector(i);
    });
  };

  var intersectionEdge = function intersectionEdge() {
    for (var _len4 = arguments.length, innerArgs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      innerArgs[_key4] = arguments[_key4];
    }

    var edge = get_two_vec2(innerArgs);
    var result = circle_edge(origin, radius, edge[0], edge[1]);
    return result === undefined ? undefined : result.map(function (i) {
      return Vector(i);
    });
  };

  return {
    intersectionLine: intersectionLine,
    intersectionRay: intersectionRay,
    intersectionEdge: intersectionEdge,

    get origin() {
      return origin;
    },

    get radius() {
      return radius;
    },

    set origin(innerArgs) {
      origin = Vector(innerArgs);
    },

    set radius(newRadius) {
      radius = newRadius;
    }

  };
};

var Sector = function Sector(vectorA, vectorB) {
  var center = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
  var vectors = [get_vector(vectorA), get_vector(vectorB)];

  var bisect = function bisect() {
    var interior_angle = counter_clockwise_angle2(vectors[0], vectors[1]);
    var vectors_radians = vectors.map(function (el) {
      return Math.atan2(el[1], el[0]);
    });
    var bisected = vectors_radians[0] + interior_angle * 0.5;
    return [Math.cos(bisected), Math.sin(bisected)];
  };

  var subsect_sector = function subsect_sector(divisions) {
    return subsect(divisions, vectors[0], vectors[1]).map(function (vec) {
      return [vec[0], vec[1]];
    });
  };

  var contains = function contains() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var point = get_vector(args).map(function (n, i) {
      return n + center[i];
    });
    var cross0 = (point[1] - vectors[0][1]) * -vectors[0][0] - (point[0] - vectors[0][0]) * -vectors[0][1];
    var cross1 = point[1] * vectors[1][0] - point[0] * vectors[1][1];
    return cross0 < 0 && cross1 < 0;
  };

  return {
    contains: contains,
    bisect: bisect,
    subsect: subsect_sector,

    get center() {
      return center;
    },

    get vectors() {
      return vectors;
    },

    get angle() {
      return counter_clockwise_angle2(vectors[0], vectors[1]);
    }

  };
};

Sector.fromVectors = function (vectorA, vectorB) {
  return Sector(vectorA, vectorB);
};

Sector.fromPoints = function (pointA, pointB) {
  var center = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
  var vectors = [pointA, pointB].map(function (p) {
    return p.map(function (_, i) {
      return p[i] - center[i];
    });
  });
  return Sector(vectors[0], vectors[1], center);
};

function Prototype$1 (subtype) {
  var proto = {};
  var Type = subtype;

  var area = function area() {
    return signed_area(this.points);
  };

  var midpoint = function midpoint() {
    return average(this.points);
  };

  var enclosingRectangle = function enclosingRectangle() {
    return enclosing_rectangle(this.points);
  };

  var sectors = function sectors() {
    return this.points.map(function (p, i, a) {
      return [a[(i + a.length - 1) % a.length], a[i], a[(i + 1) % a.length]];
    }).map(function (points) {
      return Sector(points[1], points[2], points[0]);
    });
  };

  var contains = function contains() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return point_in_poly(get_vector(args), this.points);
  };

  var polyCentroid = function polyCentroid() {
    return centroid(this.points);
  };

  var nearest = function nearest() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var point = get_vector(args);
    var points = this.sides.map(function (edge) {
      return edge.nearestPoint(point);
    });
    var lowD = Infinity;
    var lowI;
    points.map(function (p) {
      return distance2(point, p);
    }).forEach(function (d, i) {
      if (d < lowD) {
        lowD = d;
        lowI = i;
      }
    });
    return {
      point: points[lowI],
      edge: this.sides[lowI]
    };
  };

  var clipEdge = function clipEdge() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var edge = get_edge(args);
    var e = convex_poly_edge(this.points, edge[0], edge[1]);
    return e === undefined ? undefined : Edge(e);
  };

  var clipLine = function clipLine() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    var line = get_line(args);
    var e = convex_poly_line(this.points, line.point, line.vector);
    return e === undefined ? undefined : Edge(e);
  };

  var clipRay = function clipRay() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    var line = get_line(args);
    var e = convex_poly_ray(this.points, line.point, line.vector);
    return e === undefined ? undefined : Edge(e);
  };

  var split = function split() {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    var line = get_line(args);
    return split_polygon(this.points, line.point, line.vector).map(function (poly) {
      return Type(poly);
    });
  };

  var scale = function scale(magnitude$$1) {
    var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(this.points);
    var newPoints = this.points.map(function (p) {
      return [0, 1].map(function (_, i) {
        return p[i] - center[i];
      });
    }).map(function (vec) {
      return vec.map(function (_, i) {
        return center[i] + vec[i] * magnitude$$1;
      });
    });
    return Type(newPoints);
  };

  var rotate = function rotate(angle) {
    var centerPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(this.points);
    var newPoints = this.points.map(function (p) {
      var vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
      var mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
      var a = Math.atan2(vec[1], vec[0]);
      return [centerPoint[0] + Math.cos(a + angle) * mag, centerPoint[1] + Math.sin(a + angle) * mag];
    });
    return Type(newPoints);
  };

  var translate = function translate() {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    var vec = get_vector(args);
    var newPoints = this.points.map(function (p) {
      return p.map(function (n, i) {
        return n + vec[i];
      });
    });
    return Type(newPoints);
  };

  var transform = function transform() {
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
    }

    var m = get_matrix2(args);
    var newPoints = this.points.map(function (p) {
      return Vector(multiply_vector2_matrix2(p, m));
    });
    return Type(newPoints);
  };

  Object.defineProperty(proto, "area", {
    value: area
  });
  Object.defineProperty(proto, "centroid", {
    value: polyCentroid
  });
  Object.defineProperty(proto, "midpoint", {
    value: midpoint
  });
  Object.defineProperty(proto, "enclosingRectangle", {
    value: enclosingRectangle
  });
  Object.defineProperty(proto, "contains", {
    value: contains
  });
  Object.defineProperty(proto, "nearest", {
    value: nearest
  });
  Object.defineProperty(proto, "clipEdge", {
    value: clipEdge
  });
  Object.defineProperty(proto, "clipLine", {
    value: clipLine
  });
  Object.defineProperty(proto, "clipRay", {
    value: clipRay
  });
  Object.defineProperty(proto, "split", {
    value: split
  });
  Object.defineProperty(proto, "scale", {
    value: scale
  });
  Object.defineProperty(proto, "rotate", {
    value: rotate
  });
  Object.defineProperty(proto, "translate", {
    value: translate
  });
  Object.defineProperty(proto, "transform", {
    value: transform
  });
  Object.defineProperty(proto, "edges", {
    get: function get() {
      return this.sides;
    }
  });
  Object.defineProperty(proto, "sectors", {
    get: function get() {
      return sectors();
    }
  });
  Object.defineProperty(proto, "signedArea", {
    value: area
  });
  return Object.freeze(proto);
}

var Polygon = function Polygon() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var points = get_vector_of_vectors(args).map(function (p) {
    return Vector(p);
  });

  if (points === undefined) {
    return undefined;
  }

  var sides = points.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  }).map(function (ps) {
    return Edge(ps[0][0], ps[0][1], ps[1][0], ps[1][1]);
  });
  var proto = Prototype$1.bind(this);
  var polygon = Object.create(proto());
  Object.defineProperty(polygon, "points", {
    get: function get() {
      return points;
    }
  });
  Object.defineProperty(polygon, "sides", {
    get: function get() {
      return sides;
    }
  });
  return polygon;
};

Polygon.regularPolygon = function (sides) {
  var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var points = make_regular_polygon(sides, x, y, radius);
  return Polygon(points);
};

Polygon.convexHull = function (points) {
  var includeCollinear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var hull = convex_hull(points, includeCollinear);
  return Polygon(hull);
};

var ConvexPolygon = function ConvexPolygon() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var points = get_array_of_vec(args).map(function (p) {
    return Vector(p);
  });

  if (points === undefined) {
    return undefined;
  }

  var sides = points.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  }).map(function (ps) {
    return Edge(ps[0][0], ps[0][1], ps[1][0], ps[1][1]);
  });
  var proto = Prototype$1.bind(this);
  var polygon = Object.create(proto(ConvexPolygon));

  var split = function split() {
    for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      innerArgs[_key2] = arguments[_key2];
    }

    var line = get_line(innerArgs);
    return split_convex_polygon(points, line.point, line.vector).map(function (poly) {
      return ConvexPolygon(poly);
    });
  };

  var overlaps = function overlaps() {
    for (var _len3 = arguments.length, innerArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      innerArgs[_key3] = arguments[_key3];
    }

    var poly2Points = get_array_of_vec(innerArgs);
    return convex_polygons_overlap(points, poly2Points);
  };

  var scale = function scale(magnitude) {
    var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(polygon.points);
    var newPoints = polygon.points.map(function (p) {
      return [0, 1].map(function (_, i) {
        return p[i] - center[i];
      });
    }).map(function (vec) {
      return vec.map(function (_, i) {
        return center[i] + vec[i] * magnitude;
      });
    });
    return ConvexPolygon(newPoints);
  };

  var rotate = function rotate(angle) {
    var centerPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(polygon.points);
    var newPoints = polygon.points.map(function (p) {
      var vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
      var mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
      var a = Math.atan2(vec[1], vec[0]);
      return [centerPoint[0] + Math.cos(a + angle) * mag, centerPoint[1] + Math.sin(a + angle) * mag];
    });
    return ConvexPolygon(newPoints);
  };

  Object.defineProperty(polygon, "points", {
    get: function get() {
      return points;
    }
  });
  Object.defineProperty(polygon, "sides", {
    get: function get() {
      return sides;
    }
  });
  Object.defineProperty(polygon, "split", {
    value: split
  });
  Object.defineProperty(polygon, "overlaps", {
    value: overlaps
  });
  Object.defineProperty(polygon, "scale", {
    value: scale
  });
  Object.defineProperty(polygon, "rotate", {
    value: rotate
  });
  return polygon;
};

ConvexPolygon.regularPolygon = function (sides) {
  var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var points = make_regular_polygon(sides, x, y, radius);
  return ConvexPolygon(points);
};

ConvexPolygon.convexHull = function (points) {
  var includeCollinear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var hull = convex_hull(points, includeCollinear);
  return ConvexPolygon(hull);
};

var Rectangle = function Rectangle() {
  var _origin;

  var _width;

  var _height;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var params = Array.from(args);
  var numbers = params.filter(function (param) {
    return !isNaN(param);
  });
  var arrays = params.filter(function (param) {
    return param.constructor === Array;
  });

  if (numbers.length === 4) {
    _origin = numbers.slice(0, 2);

    var _numbers = _slicedToArray(numbers, 4);

    _width = _numbers[2];
    _height = _numbers[3];
  }

  if (arrays.length === 1) {
    arrays = arrays[0];
  }

  if (arrays.length === 2) {
    if (typeof arrays[0][0] === "number") {
      _origin = arrays[0].slice();
      _width = arrays[1][0];
      _height = arrays[1][1];
    }
  }

  var points = [[_origin[0], _origin[1]], [_origin[0] + _width, _origin[1]], [_origin[0] + _width, _origin[1] + _height], [_origin[0], _origin[1] + _height]];
  var proto = Prototype$1.bind(this);
  var rect = Object.create(proto(Rectangle));

  var scale = function scale(magnitude, center_point) {
    var center = center_point != null ? center_point : [_origin[0] + _width, _origin[1] + _height];
    var x = _origin[0] + (center[0] - _origin[0]) * (1 - magnitude);
    var y = _origin[1] + (center[1] - _origin[1]) * (1 - magnitude);
    return Rectangle(x, y, _width * magnitude, _height * magnitude);
  };

  var rotate = function rotate() {
    var _ConvexPolygon;

    return (_ConvexPolygon = ConvexPolygon(points)).rotate.apply(_ConvexPolygon, arguments);
  };

  var transform = function transform() {
    for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      innerArgs[_key2] = arguments[_key2];
    }

    return ConvexPolygon(points).transform(innerArgs);
  };

  Object.defineProperty(rect, "origin", {
    get: function get() {
      return _origin;
    }
  });
  Object.defineProperty(rect, "width", {
    get: function get() {
      return _width;
    }
  });
  Object.defineProperty(rect, "height", {
    get: function get() {
      return _height;
    }
  });
  Object.defineProperty(rect, "area", {
    get: function get() {
      return _width * _height;
    }
  });
  Object.defineProperty(rect, "scale", {
    value: scale
  });
  Object.defineProperty(rect, "rotate", {
    value: rotate
  });
  Object.defineProperty(rect, "transform", {
    value: transform
  });
  return rect;
};

var Junction = function Junction() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var vectors = get_vector_of_vectors(args);

  if (vectors === undefined) {
    return undefined;
  }

  var sorted_order = counter_clockwise_vector_order.apply(void 0, _toConsumableArray(vectors));

  var sectors = function sectors() {
    return sorted_order.map(function (i) {
      return vectors[i];
    }).map(function (v, i, arr) {
      return [v, arr[(i + 1) % arr.length]];
    }).map(function (pair) {
      return Sector.fromVectors(pair[0], pair[1]);
    });
  };

  var angles = function angles() {
    return sorted_order.map(function (i) {
      return vectors[i];
    }).map(function (v, i, arr) {
      return [v, arr[(i + 1) % arr.length]];
    }).map(function (pair) {
      return counter_clockwise_angle2(pair[0], pair[1]);
    });
  };

  var alternatingAngleSum = function alternatingAngleSum() {
    return alternating_sum.apply(void 0, _toConsumableArray(angles()));
  };

  var kawasaki_score = function kawasaki_score() {
    return kawasaki_sector_score.apply(void 0, _toConsumableArray(angles()));
  };

  var kawasaki_solutions$$1 = function kawasaki_solutions$$1() {
    return kawasaki_solutions_radians.apply(void 0, _toConsumableArray(angles()));
  };

  return {
    sectors: sectors,
    angles: angles,
    kawasaki_score: kawasaki_score,
    kawasaki_solutions: kawasaki_solutions$$1,
    alternatingAngleSum: alternatingAngleSum,

    get vectors() {
      return vectors;
    },

    get vectorOrder() {
      return _toConsumableArray(sorted_order);
    }

  };
};

Junction.fromVectors = function () {
  return Junction.apply(void 0, arguments);
};

Junction.fromPoints = function (center, edge_adjacent_points) {
  var vectors = edge_adjacent_points.map(function (p) {
    return p.map(function (_, i) {
      return p[i] - center[i];
    });
  });
  return Junction.fromVectors(vectors);
};

var core = Object.create(null);
Object.assign(core, algebra, matrixCore, geometry, query, equal, origami);
core.clean_number = clean_number;
core.is_number = is_number;
core.is_vector = is_vector;
core.is_iterable = is_iterable;
core.flatten_input = flatten_input;
core.semi_flatten_input = semi_flatten_input;
core.get_vector = get_vector;
core.get_vector_of_vectors = get_vector_of_vectors;
core.get_matrix2 = get_matrix2;
core.get_edge = get_edge;
core.get_line = get_line;
core.get_ray = get_ray;
core.get_two_vec2 = get_two_vec2;
core.get_array_of_vec = get_array_of_vec;
core.get_array_of_vec2 = get_array_of_vec2;
core.intersection = intersection;
Object.freeze(core);
var math = {
  vector: Vector,
  matrix2: Matrix2,
  matrix: Matrix,
  line: Line,
  ray: Ray,
  segment: Edge,
  circle: Circle,
  polygon: Polygon,
  convexPolygon: ConvexPolygon,
  rectangle: Rectangle,
  junction: Junction,
  sector: Sector,
  core: core
};

export default math;
