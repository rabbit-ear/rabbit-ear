/* Math (c) Robby Kraft, MIT License */
var magnitude = function magnitude(v) {
  return Math.sqrt(v.map(function (n) {
    return n * n;
  }).reduce(function (a, b) {
    return a + b;
  }, 0));
};
var normalize = function normalize(v) {
  var m = magnitude(v);
  return m === 0 ? v : v.map(function (c) {
    return c / m;
  });
};
var scale = function scale(v, s) {
  return v.map(function (n) {
    return n * s;
  });
};
var add = function add(v, u) {
  return v.map(function (n, i) {
    return n + u[i];
  });
};
var subtract = function subtract(v, u) {
  return v.map(function (n, i) {
    return n - u[i];
  });
};
var dot = function dot(v, u) {
  return v.map(function (_, i) {
    return v[i] * u[i];
  }).reduce(function (a, b) {
    return a + b;
  }, 0);
};
var midpoint = function midpoint(v, u) {
  return v.map(function (n, i) {
    return (n + u[i]) / 2;
  });
};
var average = function average() {
  var _arguments = arguments;
  var dimension = arguments.length > 0 ? arguments[0].length : 0;
  var sum = Array(dimension).fill(0);
  Array.from(arguments).forEach(function (vec) {
    return sum.forEach(function (_, i) {
      sum[i] += vec[i] || 0;
    });
  });
  return sum.map(function (n) {
    return n / _arguments.length;
  });
};
var lerp = function lerp(v, u, t) {
  var inv = 1.0 - t;
  return v.map(function (n, i) {
    return n * inv + u[i] * t;
  });
};
var cross2 = function cross2(a, b) {
  return a[0] * b[1] - a[1] * b[0];
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
  return Math.sqrt(Array.from(Array(a.length)).map(function (_, i) {
    return Math.pow(a[i] - b[i], 2);
  }).reduce(function (u, v) {
    return u + v;
  }, 0));
};
var rotate90 = function rotate90(v) {
  return [-v[1], v[0]];
};
var flip = function flip(v) {
  return v.map(function (n) {
    return -n;
  });
};
var rotate270 = function rotate270(v) {
  return [-v[1], v[0]];
};

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

function _typeof(obj) {
  "@babel/helpers - typeof";

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
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
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

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var Constructors = {};

var identity2x2 = [1, 0, 0, 1];
var identity2x3 = [1, 0, 0, 1, 0, 0];
var multiply_matrix2_vector2 = function multiply_matrix2_vector2(matrix, vector) {
  return [matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4], matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]];
};
var multiply_matrix2_line2 = function multiply_matrix2_line2(matrix, vector, origin) {
  return {
    vector: [matrix[0] * vector[0] + matrix[2] * vector[1], matrix[1] * vector[0] + matrix[3] * vector[1]],
    origin: [matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4], matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]]
  };
};
var multiply_matrices2 = function multiply_matrices2(m1, m2) {
  return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
};
var determinant2 = function determinant2(m) {
  return m[0] * m[3] - m[1] * m[2];
};
var invert_matrix2 = function invert_matrix2(m) {
  var det = determinant2(m);

  if (Math.abs(det) < 1e-6 || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
    return undefined;
  }

  return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
};
var make_matrix2_translate = function make_matrix2_translate(x, y) {
  return [1, 0, 0, 1, x, y];
};
var make_matrix2_scale = function make_matrix2_scale(x, y) {
  var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
  return [x, 0, 0, y, x * -origin[0] + origin[0], y * -origin[1] + origin[1]];
};
var make_matrix2_rotate = function make_matrix2_rotate(angle) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return [cos, sin, -sin, cos, origin[0], origin[1]];
};
var make_matrix2_reflection = function make_matrix2_reflection(vector) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
  var angle = Math.atan2(vector[1], vector[0]);
  var cosAngle = Math.cos(angle);
  var sinAngle = Math.sin(angle);
  var cos_Angle = Math.cos(-angle);
  var sin_Angle = Math.sin(-angle);
  var a = cosAngle * cos_Angle + sinAngle * sin_Angle;
  var b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
  var c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
  var d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
  var tx = origin[0] + a * -origin[0] + -origin[1] * c;
  var ty = origin[1] + b * -origin[0] + -origin[1] * d;
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

var identity3x3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
var identity3x4 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
var multiply_matrix3_vector3 = function multiply_matrix3_vector3(m, vector) {
  return [m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9], m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10], m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]];
};
var multiply_matrix3_line3 = function multiply_matrix3_line3(m, vector, origin) {
  return {
    vector: [m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2], m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2], m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2]],
    origin: [m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9], m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10], m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11]]
  };
};
var multiply_matrices3 = function multiply_matrices3(m1, m2) {
  return [m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2], m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2], m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2], m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5], m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5], m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5], m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8], m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8], m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8], m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9], m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10], m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11]];
};
var determinant3 = function determinant3(m) {
  return m[0] * m[4] * m[8] - m[0] * m[7] * m[5] - m[3] * m[1] * m[8] + m[3] * m[7] * m[2] + m[6] * m[1] * m[5] - m[6] * m[4] * m[2];
};
var invert_matrix3 = function invert_matrix3(m) {
  var det = determinant3(m);

  if (Math.abs(det) < 1e-6 || isNaN(det) || !isFinite(m[9]) || !isFinite(m[10]) || !isFinite(m[11])) {
    return undefined;
  }

  var inv = [m[4] * m[8] - m[7] * m[5], -m[1] * m[8] + m[7] * m[2], m[1] * m[5] - m[4] * m[2], -m[3] * m[8] + m[6] * m[5], m[0] * m[8] - m[6] * m[2], -m[0] * m[5] + m[3] * m[2], m[3] * m[7] - m[6] * m[4], -m[0] * m[7] + m[6] * m[1], m[0] * m[4] - m[3] * m[1], -m[3] * m[7] * m[11] + m[3] * m[8] * m[10] + m[6] * m[4] * m[11] - m[6] * m[5] * m[10] - m[9] * m[4] * m[8] + m[9] * m[5] * m[7], m[0] * m[7] * m[11] - m[0] * m[8] * m[10] - m[6] * m[1] * m[11] + m[6] * m[2] * m[10] + m[9] * m[1] * m[8] - m[9] * m[2] * m[7], -m[0] * m[4] * m[11] + m[0] * m[5] * m[10] + m[3] * m[1] * m[11] - m[3] * m[2] * m[10] - m[9] * m[1] * m[5] + m[9] * m[2] * m[4]];
  var invDet = 1.0 / det;
  return inv.map(function (n) {
    return n * invDet;
  });
};
var make_matrix3_translate = function make_matrix3_translate() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return [1, 0, 0, 0, 1, 0, 0, 0, 1, x, y, z];
};
var make_matrix3_rotateX = function make_matrix3_rotateX(angle) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return [1, 0, 0, 0, cos, sin, 0, -sin, cos, origin[0] || 0, origin[1] || 0, origin[2] || 0];
};
var make_matrix3_rotateY = function make_matrix3_rotateY(angle) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return [cos, 0, -sin, 0, 1, 0, sin, 0, cos, origin[0] || 0, origin[1] || 0, origin[2] || 0];
};
var make_matrix3_rotateZ = function make_matrix3_rotateZ(angle) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  return [cos, sin, 0, -sin, cos, 0, 0, 0, 1, origin[0] || 0, origin[1] || 0, origin[2] || 0];
};
var make_matrix3_rotate = function make_matrix3_rotate(angle) {
  var vector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 1];
  var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 0];
  var vec = normalize(vector);
  var pos = Array.from(Array(3)).map(function (n, i) {
    return origin[i] || 0;
  });

  var _vec = _slicedToArray(vec, 3),
      a = _vec[0],
      b = _vec[1],
      c = _vec[2];

  var cos = Math.cos(angle);
  var sin = Math.sin(angle);
  var d = Math.sqrt(vec[1] * vec[1] + vec[2] * vec[2]);
  var b_d = Math.abs(d) < 1e-6 ? 0 : b / d;
  var c_d = Math.abs(d) < 1e-6 ? 1 : c / d;
  var t = [1, 0, 0, 0, 1, 0, 0, 0, 1, pos[0], pos[1], pos[2]];
  var t_inv = [1, 0, 0, 0, 1, 0, 0, 0, 1, -pos[0], -pos[1], -pos[2]];
  var rx = [1, 0, 0, 0, c_d, b_d, 0, -b_d, c_d, 0, 0, 0];
  var rx_inv = [1, 0, 0, 0, c_d, -b_d, 0, b_d, c_d, 0, 0, 0];
  var ry = [d, 0, a, 0, 1, 0, -a, 0, d, 0, 0, 0];
  var ry_inv = [d, 0, -a, 0, 1, 0, a, 0, d, 0, 0, 0];
  var rz = [cos, sin, 0, -sin, cos, 0, 0, 0, 1, 0, 0, 0];
  return multiply_matrices3(t_inv, multiply_matrices3(rx_inv, multiply_matrices3(ry_inv, multiply_matrices3(rz, multiply_matrices3(ry, multiply_matrices3(rx, t))))));
};
var make_matrix3_scale = function make_matrix3_scale(scale) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
  return [scale, 0, 0, 0, scale, 0, 0, 0, scale, scale * -origin[0] + origin[0], scale * -origin[1] + origin[1], scale * -origin[2] + origin[2]];
};
var make_matrix3_reflectionZ = function make_matrix3_reflectionZ(vector) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
  var angle = Math.atan2(vector[1], vector[0]);
  var cosAngle = Math.cos(angle);
  var sinAngle = Math.sin(angle);
  var cos_Angle = Math.cos(-angle);
  var sin_Angle = Math.sin(-angle);
  var a = cosAngle * cos_Angle + sinAngle * sin_Angle;
  var b = cosAngle * -sin_Angle + sinAngle * cos_Angle;
  var c = sinAngle * cos_Angle + -cosAngle * sin_Angle;
  var d = sinAngle * -sin_Angle + -cosAngle * cos_Angle;
  var tx = origin[0] + a * -origin[0] + -origin[1] * c;
  var ty = origin[1] + b * -origin[0] + -origin[1] * d;
  return [a, b, 0, c, d, 0, 0, 0, 0, tx, ty, 0];
};
var make_matrix3_reflection = function make_matrix3_reflection(vector) {
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

var R2D = 180 / Math.PI;
var D2R = Math.PI / 180;
var Typeof = function Typeof(obj) {
  if (_typeof(obj) === "object") {
    if (obj.radius != null) {
      return "circle";
    }

    if (obj.width != null) {
      return "rectangle";
    }

    if (obj.x != null) {
      return "vector";
    }

    if (obj.rotate180 != null) {
      return "ray";
    }

    if (obj[0] != null && obj[0].length && obj[0].x != null) {
      return "segment";
    }

    if (obj.vector != null && obj.origin != null) {
      return "line";
    }
  }

  return undefined;
};

var vector_origin_form = function vector_origin_form(vector, origin) {
  return {
    vector: vector || [],
    origin: origin || []
  };
};

var lengthSort = function lengthSort(a, b) {
  return [a, b].sort(function (m, n) {
    return m.length - n.length;
  });
};
var resize = function resize(d, v) {
  return Array(d).fill(0).map(function (z, i) {
    return v[i] ? v[i] : z;
  });
};
var resizeUp = function resizeUp(a, b) {
  var size = a.length > b.length ? a.length : b.length;
  return [a, b].map(function (v) {
    return resize(size, v);
  });
};
var resizeDown = function resizeDown(a, b) {
  var size = a.length > b.length ? b.length : a.length;
  return [a, b].map(function (v) {
    return resize(size, v);
  });
};

var countPlaces = function countPlaces(num) {
  var m = "".concat(num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

  if (!m) {
    return 0;
  }

  return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};

var clean_number = function clean_number(num) {
  var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;

  if (typeof num !== "number") {
    return num;
  }

  var crop = parseFloat(num.toFixed(places));

  if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
    return num;
  }

  return crop;
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
var semi_flatten_arrays = function semi_flatten_arrays() {
  switch (arguments.length) {
    case undefined:
    case 0:
      return Array.from(arguments);

    case 1:
      return is_iterable(arguments[0]) && typeof arguments[0] !== "string" ? semi_flatten_arrays.apply(void 0, _toConsumableArray(arguments[0])) : [arguments[0]];

    default:
      return Array.from(arguments).map(function (a) {
        return is_iterable(a) ? _toConsumableArray(semi_flatten_arrays(a)) : a;
      });
  }
};
var flatten_arrays = function flatten_arrays() {
  var arr = semi_flatten_arrays(arguments);
  return arr.length > 1 ? arr.reduce(function (a, b) {
    return a.concat(b);
  }, []) : arr;
};
var get_vector = function get_vector() {
  if (arguments[0] instanceof Constructors.vector) {
    return arguments[0];
  }

  var list = flatten_arrays(arguments);

  if (list.length > 0 && _typeof(list[0]) === "object" && list[0] !== null && !isNaN(list[0].x)) {
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
  return semi_flatten_arrays(arguments).map(function (el) {
    return get_vector(el);
  });
};
var get_segment = function get_segment() {
  if (arguments[0] instanceof Constructors.segment) {
    return arguments[0];
  }

  if (arguments.length === 4) {
    return [[arguments[0], arguments[1]], [arguments[2], arguments[3]]];
  }

  return get_vector_of_vectors(arguments);
};
var get_line = function get_line() {
  var args = semi_flatten_arrays(arguments);

  if (args.length === 0) {
    return vector_origin_form([], []);
  }

  if (args[0] instanceof Constructors.line || args[0] instanceof Constructors.ray || args[0] instanceof Constructors.segment) {
    return args[0];
  }

  if (args[0].constructor === Object) {
    return vector_origin_form(args[0].vector || [], args[0].origin || []);
  }

  return typeof args[0] === "number" ? vector_origin_form(get_vector(args)) : vector_origin_form.apply(void 0, _toConsumableArray(args.map(function (a) {
    return get_vector(a);
  })));
};
var rect_form = function rect_form() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
};
var get_rect = function get_rect() {
  if (arguments[0] instanceof Constructors.rect) {
    return arguments[0];
  }

  var list = flatten_arrays(arguments);

  if (list.length > 0 && _typeof(list[0]) === "object" && list[0] !== null && !isNaN(list[0].width)) {
    return rect_form.apply(void 0, _toConsumableArray(["width", "height", "x", "y"].map(function (c) {
      return list[0][c];
    }).filter(function (a) {
      return a !== undefined;
    })));
  }

  return rect_form.apply(void 0, _toConsumableArray(list.filter(function (n) {
    return typeof n === "number";
  })));
};
var maps_3x4 = [[0, 1, 3, 4, 9, 10], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11]];
[11, 7, 3].forEach(function (i) {
  return delete maps_3x4[2][i];
});

var matrix_map_3x4 = function matrix_map_3x4(len) {
  var i;
  if (len < 8) i = 0;else if (len < 13) i = 1;else i = 2;
  return maps_3x4[i];
};

var get_matrix_3x4 = function get_matrix_3x4() {
  var mat = flatten_arrays(arguments);

  var matrix = _toConsumableArray(identity3x4);

  matrix_map_3x4(mat.length).filter(function (_, i) {
    return mat[i] != null;
  }).forEach(function (n, i) {
    matrix[n] = mat[i];
  });
  return matrix;
};
var get_matrix2 = function get_matrix2() {
  var m = get_vector(arguments);

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
    return identity2x3.map(function (n, i) {
      return m[i] || n;
    });
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

var EPSILON = 1e-6;

var fEqual = function fEqual(a, b) {
  return a === b;
};

var fEpsilonEqual = function fEpsilonEqual(a, b) {
  return Math.abs(a - b) < EPSILON;
};

var array_similarity_test = function array_similarity_test(list, compFunc) {
  return Array.from(Array(list.length - 1)).map(function (_, i) {
    return compFunc(list[0], list[i + 1]);
  }).reduce(function (a, b) {
    return a && b;
  }, true);
};

var equivalent_arrays_of_numbers = function equivalent_arrays_of_numbers() {};
var equivalent_numbers = function equivalent_numbers() {
  if (arguments.length === 0) {
    return false;
  }

  if (arguments.length === 1 && arguments[0] !== undefined) {
    return equivalent_numbers.apply(void 0, _toConsumableArray(arguments[0]));
  }

  return array_similarity_test(arguments, fEpsilonEqual);
};
var equivalent_vectors = function equivalent_vectors(a, b) {
  var vecs = resizeUp(a, b);
  return vecs[0].map(function (_, i) {
    return Math.abs(vecs[0][i] - vecs[1][i]) < EPSILON;
  }).reduce(function (u, v) {
    return u && v;
  }, true);
};
var equivalent_vectors_old = function equivalent_vectors_old() {
  var list = get_vector_of_vectors.apply(void 0, arguments);

  if (list.length === 0) {
    return false;
  }

  if (list.length === 1 && list[0] !== undefined) {
    return equivalent_vectors.apply(void 0, _toConsumableArray(list[0]));
  }

  var dimension = list[0].length;
  var dim_array = Array.from(Array(dimension));

  for (var i = 1; i < list.length; i += 1) {
    if (_typeof(list[i - 1]) !== _typeof(list[i])) {
      return false;
    }
  }

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
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var list = semi_flatten_arrays(args);

  if (list.length < 1) {
    return false;
  }

  var typeofList = _typeof(list[0]);

  if (typeofList === "undefined") {
    return false;
  }

  switch (typeofList) {
    case "number":
      return array_similarity_test(list, fEpsilonEqual);

    case "boolean":
    case "string":
      return array_similarity_test(list, fEqual);

    case "object":
      if (list[0].constructor === Array) {
        return equivalent_vectors.apply(void 0, _toConsumableArray(list));
      }

      console.warn("comparing array of objects for equivalency by slow JSON.stringify with no epsilon check");
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
  __proto__: null,
  EPSILON: EPSILON,
  equivalent_arrays_of_numbers: equivalent_arrays_of_numbers,
  equivalent_numbers: equivalent_numbers,
  equivalent_vectors: equivalent_vectors,
  equivalent_vectors_old: equivalent_vectors_old,
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

var segment_segment_comp = function segment_segment_comp(t0, t1) {
  return t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
};

var segment_segment_overlap = function segment_segment_overlap(a0, a1, b0, b1) {
  var aVec = [a1[0] - a0[0], a1[1] - a0[1]];
  var bVec = [b1[0] - b0[0], b1[1] - b0[1]];
  return overlap_function(a0, aVec, b0, bVec, segment_segment_comp);
};
var degenerate = function degenerate(v) {
  return Math.abs(v.reduce(function (a, b) {
    return a + b;
  }, 0)) < EPSILON;
};
var parallel = function parallel(a, b) {
  return 1 - Math.abs(dot(normalize(a), normalize(b))) < EPSILON;
};
var is_identity3x4 = function is_identity3x4(m) {
  return identity3x4.map(function (n, i) {
    return Math.abs(n - m[i]) < EPSILON;
  }).reduce(function (a, b) {
    return a && b;
  }, true);
};
var point_on_line = function point_on_line(linePoint, lineVector, point) {
  var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
  var pointPoint = [point[0] - linePoint[0], point[1] - linePoint[1]];
  var cross = pointPoint[0] * lineVector[1] - pointPoint[1] * lineVector[0];
  return Math.abs(cross) < epsilon;
};
var point_on_segment = function point_on_segment(seg0, seg1, point) {
  var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
  var seg0_1 = [seg0[0] - seg1[0], seg0[1] - seg1[1]];
  var seg0_p = [seg0[0] - point[0], seg0[1] - point[1]];
  var seg1_p = [seg1[0] - point[0], seg1[1] - point[1]];
  var dEdge = Math.sqrt(seg0_1[0] * seg0_1[0] + seg0_1[1] * seg0_1[1]);
  var dP0 = Math.sqrt(seg0_p[0] * seg0_p[0] + seg0_p[1] * seg0_p[1]);
  var dP1 = Math.sqrt(seg1_p[0] * seg1_p[0] + seg1_p[1] * seg1_p[1]);
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
      if (segment_segment_overlap(e1[i][0], e1[i][1], e2[j][0], e2[j][1])) {
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

var comp_l_l = function comp_l_l() {
  return true;
};
var comp_l_r = function comp_l_r(t0, t1) {
  return t1 >= -EPSILON;
};
var comp_l_s = function comp_l_s(t0, t1) {
  return t1 >= -EPSILON && t1 <= 1 + EPSILON;
};
var comp_r_r = function comp_r_r(t0, t1) {
  return t0 >= -EPSILON && t1 >= -EPSILON;
};
var comp_r_s = function comp_r_s(t0, t1) {
  return t0 >= -EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
};
var comp_s_s = function comp_s_s(t0, t1) {
  return t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
};
var exclude_l_r = function exclude_l_r(t0, t1) {
  return t1 > EPSILON;
};
var exclude_l_s = function exclude_l_s(t0, t1) {
  return t1 > EPSILON && t1 < 1 - EPSILON;
};
var exclude_r_r = function exclude_r_r(t0, t1) {
  return t0 > EPSILON && t1 > EPSILON;
};
var exclude_r_s = function exclude_r_s(t0, t1) {
  return t0 > EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
};
var exclude_s_s = function exclude_s_s(t0, t1) {
  return t0 > EPSILON && t0 < 1 - EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
};
var intersect = function intersect(a, b, compFunc) {
  var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
  var denominator0 = cross2(a.vector, b.vector);

  if (Math.abs(denominator0) < epsilon) {
    return undefined;
  }

  var denominator1 = -denominator0;
  var numerator0 = cross2([b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]], b.vector);
  var numerator1 = cross2([a.origin[0] - b.origin[0], a.origin[1] - b.origin[1]], a.vector);
  var t0 = numerator0 / denominator0;
  var t1 = numerator1 / denominator1;

  if (compFunc(t0, t1, epsilon)) {
    return [a.origin[0] + a.vector[0] * t0, a.origin[1] + a.vector[1] * t0];
  }

  return undefined;
};

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
  intersect: intersect
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
  for (var _len2 = arguments.length, vecs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    vecs[_key2] = arguments[_key2];
  }

  return vecs.map(function (v, i, ar) {
    return counter_clockwise_angle2(v, ar[(i + 1) % ar.length]);
  });
};

var bisect_vectors = function bisect_vectors(a, b) {
  var aV = normalize(a);
  var bV = normalize(b);
  return dot(aV, bV) < -1 + EPSILON ? [-aV[1], aV[0]] : normalize(add(aV, bV));
};
var bisect_lines2 = function bisect_lines2(vectorA, pointA, vectorB, pointB) {
  var denominator = vectorA[0] * vectorB[1] - vectorB[0] * vectorA[1];

  if (Math.abs(denominator) < EPSILON) {
    var solution = [[vectorA[0], vectorA[1]], midpoint(pointA, pointB)];
    var array = [solution, solution];
    var dt = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
    delete array[dt > 0 ? 1 : 0];
    return array;
  }

  var numerator = (pointB[0] - pointA[0]) * vectorB[1] - vectorB[0] * (pointB[1] - pointA[1]);
  var t = numerator / denominator;
  var origin = [pointA[0] + vectorA[0] * t, pointA[1] + vectorA[1] * t];
  var bisects = [bisect_vectors(vectorA, vectorB)];
  bisects[1] = rotate90(bisects[0]);
  return bisects.map(function (vector) {
    return {
      vector: vector,
      origin: origin
    };
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
var circumcircle = function circumcircle(a, b, c) {
  var A = b[0] - a[0];
  var B = b[1] - a[1];
  var C = c[0] - a[0];
  var D = c[1] - a[1];
  var E = A * (a[0] + b[0]) + B * (a[1] + b[1]);
  var F = C * (a[0] + c[0]) + D * (a[1] + c[1]);
  var G = 2 * (A * (c[1] - b[1]) - B * (c[0] - b[0]));

  if (Math.abs(G) < EPSILON) {
    var minx = Math.min(a[0], b[0], c[0]);
    var miny = Math.min(a[1], b[1], c[1]);

    var _dx = (Math.max(a[0], b[0], c[0]) - minx) * 0.5;

    var _dy = (Math.max(a[1], b[1], c[1]) - miny) * 0.5;

    return {
      origin: [minx + _dx, miny + _dy],
      radius: Math.sqrt(_dx * _dx + _dy * _dy)
    };
  }

  var origin = [(D * E - B * F) / G, (A * F - C * E) / G];
  var dx = origin[0] - a[0];
  var dy = origin[1] - a[1];
  return {
    origin: origin,
    radius: Math.sqrt(dx * dx + dy * dy)
  };
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
  var mins = Array(points[0].length).fill(Infinity);
  var maxs = Array(points[0].length).fill(-Infinity);
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
  return rect_form.apply(void 0, _toConsumableArray(lengths).concat(_toConsumableArray(mins)));
};
var make_regular_polygon = function make_regular_polygon(sides) {
  var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
  var halfwedge = 2 * Math.PI / sides / 2;
  var r = radius / Math.cos(halfwedge);
  return Array.from(Array(Math.floor(sides))).map(function (_, i) {
    var a = -(2 * Math.PI * i) / sides + halfwedge;
    var px = clean_number(x + r * Math.sin(a), 14);
    var py = clean_number(y + r * Math.cos(a), 14);
    return [px, py];
  });
};

var line_segment_exclusive = function line_segment_exclusive(lineVector, linePoint, segmentA, segmentB) {
  var pt = segmentA;
  var vec = [segmentB[0] - segmentA[0], segmentB[1] - segmentA[1]];
  return intersect(linePoint, lineVector, pt, vec, exclude_l_s);
};

var split_polygon = function split_polygon(poly, lineVector, linePoint) {
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
    var intersection = line_segment_exclusive(lineVector, linePoint, v, arr[(i + 1) % arr.length]);
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
var split_convex_polygon = function split_convex_polygon(poly, lineVector, linePoint) {
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
    var intersection = line_segment_exclusive(lineVector, linePoint, v, arr[(i + 1) % arr.length]);
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
      var distance = Math.sqrt(Math.pow(hull[h][0] - el.node[0], 2) + Math.pow(hull[h][1] - el.node[1], 2));
      el.distance = distance;
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

var lerp$1 = function lerp(a, b, t) {
  return a * (1 - t) + b * t;
};
var cosine = function cosine(a, b, t) {
  var t2 = (1 - Math.cos(t * Math.PI)) / 2;
  return a * (1 - t2) + b * t2;
};
var cubic = function cubic(a, b, c, d, t) {
  var t2 = t * t;
  var e0 = d - c - a + b;
  var e1 = a - b - e0;
  var e2 = c - a;
  var e3 = b;
  return e0 * t * t2 + e1 * t2 + e2 * t + e3;
};
var catmull_rom = function catmull_rom(a, b, c, d, t) {
  var t2 = t * t;
  var e0 = -0.5 * a + 1.5 * b - 1.5 * c + 0.5 * d;
  var e1 = a - 2.5 * b + 2 * c - 0.5 * d;
  var e2 = -0.5 * a + 0.5 * c;
  var e3 = b;
  return e0 * t * t2 + e1 * t2 + e2 * t + e3;
};
var hermite = function hermite(a, b, c, d, t) {
  var tension = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var bias = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  var t2 = t * t;
  var t3 = t2 * t;
  var m0 = (b - a) * (1 + bias) * (1 - tension) / 2;
  m0 += (c - b) * (1 - bias) * (1 - tension) / 2;
  var m1 = (c - b) * (1 + bias) * (1 - tension) / 2;
  m1 += (d - c) * (1 - bias) * (1 - tension) / 2;
  var e0 = 2 * t3 - 3 * t2 + 1;
  var e1 = t3 - 2 * t2 + t;
  var e2 = t3 - t2;
  var e3 = -2 * t3 + 3 * t2;
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
var nearest_point_on_line = function nearest_point_on_line(lineVec, linePoint, point, limiterFunc) {
  var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
  var magSquared = Math.pow(lineVec[0], 2) + Math.pow(lineVec[1], 2);
  var vectorToPoint = [0, 1].map(function (_, i) {
    return point[i] - linePoint[i];
  });
  var dot = [0, 1].map(function (_, i) {
    return lineVec[i] * vectorToPoint[i];
  }).reduce(function (a, b) {
    return a + b;
  }, 0);
  var dist = dot / magSquared;
  var d = limiterFunc(dist, epsilon);
  return [0, 1].map(function (_, i) {
    return linePoint[i] + lineVec[i] * d;
  });
};

var seg_limiter = function seg_limiter(dist) {
  if (dist < -EPSILON) {
    return 0;
  }

  if (dist > 1 + EPSILON) {
    return 1;
  }

  return dist;
};

var nearest_point_on_polygon = function nearest_point_on_polygon(polygon, point) {
  var v = polygon.map(function (p, i, arr) {
    return subtract(arr[(i + 1) % arr.length], p);
  });
  return polygon.map(function (p, i) {
    return nearest_point_on_line(v[i], p, point, seg_limiter);
  }).map(function (p, i) {
    return {
      point: p,
      i: i,
      distance: distance(p, point)
    };
  }).sort(function (a, b) {
    return a.distance - b.distance;
  }).shift();
};
var nearest_point_on_circle = function nearest_point_on_circle(radius, origin, point) {
  return add(origin, scale(normalize(subtract(point, origin)), radius));
};
var nearest_point_on_ellipse = function nearest_point_on_ellipse() {
  return false;
};

var nearest = /*#__PURE__*/Object.freeze({
  __proto__: null,
  nearest_point2: nearest_point2,
  nearest_point: nearest_point,
  nearest_point_on_line: nearest_point_on_line,
  nearest_point_on_polygon: nearest_point_on_polygon,
  nearest_point_on_circle: nearest_point_on_circle,
  nearest_point_on_ellipse: nearest_point_on_ellipse
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
  for (var _len2 = arguments.length, radians = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    radians[_key2] = arguments[_key2];
  }

  return radians.map(function (v, i, ar) {
    return counter_clockwise_angle2_radians(v, ar[(i + 1) % ar.length]);
  }).map(function (_, i, arr) {
    return arr.slice(i + 1, arr.length).concat(arr.slice(0, i));
  }).map(function (opposite_sectors) {
    return kawasaki_sector_score.apply(void 0, _toConsumableArray(opposite_sectors));
  }).map(function (kawasakis, i) {
    return radians[i] + kawasakis[0];
  }).map(function (angle, i) {
    return is_counter_clockwise_between(angle, radians[i], radians[(i + 1) % radians.length]) ? angle : undefined;
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
  __proto__: null,
  alternating_sum: alternating_sum,
  kawasaki_sector_score: kawasaki_sector_score,
  kawasaki_solutions_radians: kawasaki_solutions_radians,
  kawasaki_solutions: kawasaki_solutions
});

var acossafe = function acossafe(x) {
  if (x >= 1.0) return 0;
  if (x <= -1.0) return Math.PI;
  return Math.acos(x);
};

var rotatePoint = function rotatePoint(fp, pt, a) {
  var x = pt[0] - fp[0];
  var y = pt[1] - fp[1];
  var xRot = x * Math.cos(a) + y * Math.sin(a);
  var yRot = y * Math.cos(a) - x * Math.sin(a);
  return [fp[0] + xRot, fp[1] + yRot];
};

var circle_circle = function circle_circle(c1, c2) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
  var r = c1.radius < c2.radius ? c1.radius : c2.radius;
  var R = c1.radius < c2.radius ? c2.radius : c1.radius;
  var smCenter = c1.radius < c2.radius ? c1.origin : c2.origin;
  var bgCenter = c1.radius < c2.radius ? c2.origin : c1.origin;
  var vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
  var d = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));

  if (d < epsilon) {
    return undefined;
  }

  var point = vec.map(function (v, i) {
    return v / d * R + bgCenter[i];
  });

  if (Math.abs(R + r - d) < epsilon || Math.abs(R - (r + d)) < epsilon) {
    return [point];
  }

  if (d + r < R || R + r < d) {
    return undefined;
  }

  var angle = acossafe((r * r - d * d - R * R) / (-2.0 * d * R));
  var pt1 = rotatePoint(bgCenter, point, +angle);
  var pt2 = rotatePoint(bgCenter, point, -angle);
  return [pt1, pt2];
};

var circle_line_func = function circle_line_func(circleRadius, circleOrigin, vector, origin, func) {
  var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;
  var magSq = Math.pow(vector[0], 2) + Math.pow(vector[1], 2);
  var mag = Math.sqrt(magSq);
  var norm = mag === 0 ? vector : vector.map(function (c) {
    return c / mag;
  });
  var rot90 = [-norm[1], norm[0]];
  var bvec = [origin[0] - circleOrigin[0], origin[1] - circleOrigin[1]];
  var det = bvec[0] * norm[1] - norm[0] * bvec[1];

  if (Math.abs(det) > circleRadius + epsilon) {
    return undefined;
  }

  var side = Math.sqrt(Math.pow(circleRadius, 2) - Math.pow(det, 2));

  var f = function f(s, i) {
    return circleOrigin[i] - rot90[i] * det + norm[i] * s;
  };

  var results = Math.abs(circleRadius - Math.abs(det)) < epsilon ? [side].map(function (s) {
    return [s, s].map(f);
  }) : [-side, side].map(function (s) {
    return [s, s].map(f);
  });
  var ts = results.map(function (res) {
    return res.map(function (n, i) {
      return n - origin[i];
    });
  }).map(function (v) {
    return v[0] * vector[0] + vector[1] * v[1];
  }).map(function (d) {
    return d / magSq;
  });
  return results.filter(function (_, i) {
    return func(ts[i], epsilon);
  });
};

var line_func = function line_func() {
  return true;
};

var ray_func = function ray_func(n, epsilon) {
  return n > -epsilon;
};

var segment_func = function segment_func(n, epsilon) {
  return n > -epsilon && n < 1 + epsilon;
};

var circle_line = function circle_line(circle, line) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
  return circle_line_func(circle.radius, circle.origin, line.vector, line.origin, line_func, epsilon);
};
var circle_ray = function circle_ray(circle, ray) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
  return circle_line_func(circle.radius, circle.origin, ray.vector, ray.origin, ray_func, epsilon);
};
var circle_segment = function circle_segment(circle, segment) {
  var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
  return circle_line_func(circle.radius, circle.origin, segment.vector, segment.origin, segment_func, epsilon);
};

var IntersectionCircle = /*#__PURE__*/Object.freeze({
  __proto__: null,
  circle_circle: circle_circle,
  circle_line: circle_line,
  circle_ray: circle_ray,
  circle_segment: circle_segment
});

var determ2 = function determ2(a, b) {
  return a[0] * b[1] - b[0] * a[1];
};

var intersect_line_seg = function intersect_line_seg(origin, vector, pt0, pt1) {
  var a = {
    origin: origin,
    vector: vector
  };
  var b = {
    origin: pt0,
    vector: [[pt1[0] - pt0[0]], [pt1[1] - pt0[1]]]
  };
  return intersect(a, b, comp_l_s);
};

var quick_equivalent_2 = function quick_equivalent_2(a, b) {
  return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
};

var convex_poly_circle = function convex_poly_circle(poly, center, radius) {
  return [];
};
var convex_poly_line = function convex_poly_line(poly, lineVector, linePoint) {
  var intersections = poly.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  }).map(function (el) {
    return intersect_line_seg(linePoint, lineVector, el[0], el[1]);
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
var convex_poly_ray = function convex_poly_ray(poly, lineVector, linePoint) {
  var intersections = poly.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  }).map(function (el) {
    return ray_segment(linePoint, lineVector, el[0], el[1]);
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
var convex_poly_segment = function convex_poly_segment(poly, segmentA, segmentB) {
  var intersections = poly.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  }).map(function (el) {
    return segment_segment_exclusive(segmentA, segmentB, el[0], el[1]);
  }).filter(function (el) {
    return el != null;
  });
  var aInsideExclusive = point_in_convex_poly_exclusive(segmentA, poly);
  var bInsideExclusive = point_in_convex_poly_exclusive(segmentB, poly);
  var aInsideInclusive = point_in_convex_poly(segmentA, poly);
  var bInsideInclusive = point_in_convex_poly(segmentB, poly);

  if (intersections.length === 0 && (aInsideExclusive || bInsideExclusive)) {
    return [segmentA, segmentB];
  }

  if (intersections.length === 0 && aInsideInclusive && bInsideInclusive) {
    return [segmentA, segmentB];
  }

  switch (intersections.length) {
    case 0:
      return aInsideExclusive ? [_toConsumableArray(segmentA), _toConsumableArray(segmentB)] : undefined;

    case 1:
      return aInsideInclusive ? [_toConsumableArray(segmentA), intersections[0]] : [_toConsumableArray(segmentB), intersections[0]];

    case 2:
      return intersections;

    default:
      throw new Error("clipping segment in a convex polygon resulting in 3 or more points");
  }
};
var convex_poly_ray_exclusive = function convex_poly_ray_exclusive(poly, lineVector, linePoint) {
  var intersections = poly.map(function (p, i, arr) {
    return [p, arr[(i + 1) % arr.length]];
  }).map(function (el) {
    return ray_segment_exclusive(linePoint, lineVector, el[0], el[1]);
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

var IntersectionPolygon = /*#__PURE__*/Object.freeze({
  __proto__: null,
  determ2: determ2,
  convex_poly_circle: convex_poly_circle,
  convex_poly_line: convex_poly_line,
  convex_poly_ray: convex_poly_ray,
  convex_poly_segment: convex_poly_segment,
  convex_poly_ray_exclusive: convex_poly_ray_exclusive
});

var intersect_func = {
  circle: {
    circle: circle_circle,
    line: circle_line,
    ray: circle_ray,
    segment: circle_segment
  },
  line: {
    poly: function poly(a, b) {
      return convex_poly_line(b, a);
    },
    circle: function circle(a, b) {
      return circle_line(b, a);
    },
    line: function line(a, b) {
      return intersect(a, b, comp_l_l);
    },
    ray: function ray(a, b, c) {
      return intersect(a, b, c === false ? exclude_l_r : comp_l_r);
    },
    segment: function segment(a, b, c) {
      return intersect(a, b, c === false ? exclude_l_s : comp_l_s);
    }
  },
  ray: {
    poly: function poly(a, b) {
      return convex_poly_ray(b, a);
    },
    circle: function circle(a, b) {
      return circle_ray(b, a);
    },
    line: function line(a, b, c) {
      return intersect(b, a, c === false ? exclude_l_r : comp_l_r);
    },
    ray: function ray(a, b, c) {
      return intersect(a, b, c === false ? exclude_r_r : comp_r_r);
    },
    segment: function segment(a, b, c) {
      return intersect(a, b, c === false ? exclude_r_s : comp_r_s);
    }
  },
  segment: {
    poly: function poly(a, b) {
      return convex_poly_segment(b, a);
    },
    circle: function circle(a, b) {
      return circle_segment(b, a);
    },
    line: function line(a, b, c) {
      return intersect(b, a, c === false ? exclude_l_s : comp_l_s);
    },
    ray: function ray(a, b, c) {
      return intersect(b, a, c === false ? exclude_r_s : comp_r_s);
    },
    segment: function segment(a, b, c) {
      return intersect(a, b, c === false ? exclude_s_s : comp_s_s);
    }
  }
};

var intersect$1 = function intersect(a, b, c) {
  var aT = Typeof(a);
  var bT = Typeof(b);
  return intersect_func[aT][bT](a, b, c);
};

var VectorArgs = function VectorArgs() {
  var _this = this;

  get_vector(arguments).forEach(function (n) {
    return _this.push(n);
  });
};

var VectorGetters = {
  x: function x() {
    return this[0];
  },
  y: function y() {
    return this[1];
  },
  z: function z() {
    return this[2];
  }
};

var table = {
  preserve: {
    magnitude: function magnitude$1() {
      return magnitude(this);
    },
    isEquivalent: function isEquivalent() {
      return equivalent_vectors(this, get_vector(arguments));
    },
    isParallel: function isParallel() {
      return parallel.apply(void 0, _toConsumableArray(resizeUp(this, get_vector(arguments))));
    },
    dot: function dot$1() {
      return dot.apply(void 0, _toConsumableArray(resizeUp(this, get_vector(arguments))));
    },
    distanceTo: function distanceTo() {
      return distance.apply(void 0, _toConsumableArray(resizeUp(this, get_vector(arguments))));
    }
  },
  vector: {
    copy: function copy() {
      return _toConsumableArray(this);
    },
    normalize: function normalize$1() {
      return normalize(this);
    },
    scale: function scale$1() {
      return scale(this, arguments[0]);
    },
    flip: function flip$1() {
      return flip(this);
    },
    rotate90: function rotate90$1() {
      return rotate90(this);
    },
    rotate270: function rotate270$1() {
      return rotate270(this);
    },
    cross: function cross() {
      return cross3(resize(3, this), resize(3, get_vector(arguments)));
    },
    transform: function transform() {
      return multiply_matrix3_vector3(get_matrix_3x4(arguments), resize(3, this));
    },
    add: function add$1() {
      return add(this, resize(this.length, get_vector(arguments)));
    },
    subtract: function subtract$1() {
      return subtract(this, resize(this.length, get_vector(arguments)));
    },
    rotateZ: function rotateZ(angle, origin) {
      return multiply_matrix3_vector3(get_matrix_3x4(make_matrix2_rotate(angle, origin)), this);
    },
    lerp: function lerp$1(vector, pct) {
      return lerp(this, resize(this.length, get_vector(vector)), pct);
    },
    midpoint: function midpoint$1() {
      return midpoint.apply(void 0, _toConsumableArray(resizeUp(this, get_vector(arguments))));
    },
    bisect: function bisect() {
      return bisect_vectors(this, get_vector(arguments));
    }
  }
};
var VectorMethods = {};
Object.keys(table.preserve).forEach(function (key) {
  VectorMethods[key] = table.preserve[key];
});
Object.keys(table.vector).forEach(function (key) {
  VectorMethods[key] = function () {
    return Constructors.vector.apply(Constructors, _toConsumableArray(table.vector[key].apply(this, arguments)));
  };
});

var VectorStatic = {
  fromAngle: function fromAngle(angle) {
    return Constructors.vector(Math.cos(angle), Math.sin(angle));
  },
  fromAngleDegrees: function fromAngleDegrees(angle) {
    return Constructors.vector.fromAngle(angle * D2R);
  }
};

var Vector = {
  vector: {
    P: Array.prototype,
    A: VectorArgs,
    G: VectorGetters,
    M: VectorMethods,
    S: VectorStatic
  }
};

var LineProto = function LineProto() {};

LineProto.prototype.isParallel = function () {
  var arr = resizeUp(this.vector, get_line.apply(void 0, arguments).vector);
  console.log(arguments, this.vector, get_line.apply(void 0, arguments).vector, arr);
  return parallel.apply(void 0, _toConsumableArray(arr));
};

LineProto.prototype.isDegenerate = function () {
  return degenerate(this.vector);
};

LineProto.prototype.reflection = function () {
  return Constructors.matrix(make_matrix2_reflection(this.vector, this.origin));
};

LineProto.prototype.nearestPoint = function () {
  var point = get_vector(arguments);
  return Constructors.vector(nearest_point_on_line(this.vector, this.origin, point, this.clip_function));
};

LineProto.prototype.transform = function () {
  var dim = this.dimension;
  var r = multiply_matrix3_line3(get_matrix_3x4(arguments), resize(3, this.vector), resize(3, this.origin));
  return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
};

LineProto.prototype.intersect = function (other) {
  return intersect$1(this, other);
};

LineProto.prototype.bisect = function () {
  var line = get_line(arguments);
  return bisect_lines2(this.vector, this.origin, line.vector, line.origin);
};

Object.defineProperty(LineProto.prototype, "dimension", {
  get: function get() {
    return [this.vector, this.origin].map(function (p) {
      return p.length;
    }).reduce(function (a, b) {
      return Math.max(a, b);
    }, 0);
  }
});

var Static = {
  fromPoints: function fromPoints() {
    var points = get_vector_of_vectors(arguments);
    return this.constructor({
      vector: subtract(points[1], points[0]),
      origin: points[0]
    });
  },
  perpendicularBisector: function perpendicularBisector() {
    var points = get_vector_of_vectors(arguments);
    return this.constructor({
      vector: rotate90(subtract(points[1], points[0])),
      origin: average(points[0], points[1])
    });
  }
};

var Line = {
  line: {
    P: LineProto.prototype,
    A: function A() {
      var l = get_line.apply(void 0, arguments);
      this.vector = Constructors.vector(l.vector);
      this.origin = Constructors.vector(resize(this.vector.length, l.origin));
    },
    G: {
      length: function length() {
        return Infinity;
      }
    },
    M: {
      clip_function: function clip_function(dist) {
        return dist;
      },
      path: function path() {
        var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
        var start = this.origin.add(this.vector.scale(-length));
        var end = this.vector.scale(length * 2);
        return "M".concat(start[0], " ").concat(start[1], "l").concat(end[0], " ").concat(end[1]);
      }
    },
    S: Static
  }
};

var Ray = {
  ray: {
    P: LineProto.prototype,
    A: function A() {
      var ray = get_line.apply(void 0, arguments);
      this.vector = Constructors.vector(ray.vector);
      this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
    },
    G: {
      length: function length() {
        return Infinity;
      }
    },
    M: {
      rotate180: function rotate180() {
        return Constructors.ray(this.origin[0], this.origin[1], -this.vector[0], -this.vector[1]);
      },
      clip_function: function clip_function(dist) {
        return dist < -EPSILON ? 0 : dist;
      },
      path: function path() {
        var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
        var end = this.vector.scale(length);
        return "M".concat(this.origin[0], " ").concat(this.origin[1], "l").concat(end[0], " ").concat(end[1]);
      }
    },
    S: Static
  }
};

var Segment = {
  segment: {
    P: LineProto.prototype,
    A: function A() {
      this.points = get_segment.apply(void 0, arguments).map(function (p) {
        return Constructors.vector(p);
      });
      this.vector = this.points[1].subtract(this.points[0]);
      this.origin = this.points[0];
    },
    G: {
      0: function _() {
        return this.points[0];
      },
      1: function _() {
        return this.points[1];
      },
      length: function length() {
        return this.vector.magnitude();
      }
    },
    M: {
      clip_function: function clip_function(dist) {
        if (dist < -EPSILON) {
          return 0;
        }

        if (dist > 1 + EPSILON) {
          return 1;
        }

        return dist;
      },
      transform: function transform() {
        var dim = this.dimension;

        for (var _len = arguments.length, innerArgs = new Array(_len), _key = 0; _key < _len; _key++) {
          innerArgs[_key] = arguments[_key];
        }

        var mat = get_matrix_3x4(innerArgs);
        var transformed_points = this.points.map(function (point) {
          return resize(3, point);
        }).map(function (point) {
          return multiply_matrix3_vector3(mat, point);
        }).map(function (point) {
          return resize(dim, point);
        });
        return Constructors.segment(transformed_points);
      },
      scale: function scale(magnitude) {
        var mid = average(this.points[0], this.points[1]);
        var transformed_points = this.points.map(function (p) {
          return p.lerp(mid, magnitude);
        });
        return Constructors.segment(transformed_points);
      },
      midpoint: function midpoint() {
        return Constructors.vector(average(this.points[0], this.points[1]));
      },
      path: function path() {
        var pointStrings = this.points.map(function (p) {
          return "".concat(p[0], " ").concat(p[1]);
        });
        return ["M", "L"].map(function (cmd, i) {
          return "".concat(cmd).concat(pointStrings[i]);
        }).join("");
      }
    },
    S: {
      fromPoints: function fromPoints() {
        return this.constructor.apply(this, arguments);
      }
    }
  }
};

var CircleArgs = function CircleArgs() {
  var vectors = get_vector_of_vectors(arguments);
  var numbers = resize(3, flatten_arrays(arguments));

  if (vectors.length === 2) {
    this.radius = distance2.apply(void 0, _toConsumableArray(vectors));
    this.origin = Constructors.vector.apply(Constructors, _toConsumableArray(vectors[0]));
  } else {
    this.radius = numbers[0];
    this.origin = Constructors.vector(numbers[1], numbers[2]);
  }
};

var CircleGetters = {
  x: function x() {
    return this.origin[0];
  },
  y: function y() {
    return this.origin[1];
  }
};

var pointOnEllipse = function pointOnEllipse(cx, cy, rx, ry, zRotation, arcAngle) {
  var cos_rotate = Math.cos(zRotation);
  var sin_rotate = Math.sin(zRotation);
  var cos_arc = Math.cos(arcAngle);
  var sin_arc = Math.sin(arcAngle);
  return [cx + cos_rotate * rx * cos_arc + -sin_rotate * ry * sin_arc, cy + sin_rotate * rx * cos_arc + cos_rotate * ry * sin_arc];
};
var pathInfo = function pathInfo(cx, cy, rx, ry, zRotation, arcStart_, deltaArc_) {
  var arcStart = arcStart_;

  if (arcStart < 0 && !isNaN(arcStart)) {
    while (arcStart < 0) {
      arcStart += Math.PI * 2;
    }
  }

  var deltaArc = deltaArc_ > Math.PI * 2 ? Math.PI * 2 : deltaArc_;
  var start = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart);
  var middle = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc / 2);
  var end = pointOnEllipse(cx, cy, rx, ry, zRotation, arcStart + deltaArc);
  var fa = deltaArc / 2 > Math.PI ? 1 : 0;
  var fs = deltaArc / 2 > 0 ? 1 : 0;
  return {
    x1: start[0],
    y1: start[1],
    x2: middle[0],
    y2: middle[1],
    x3: end[0],
    y3: end[1],
    fa: fa,
    fs: fs
  };
};

var cln = function cln(n) {
  return clean_number(n, 4);
};

var ellipticalArcTo = function ellipticalArcTo(rx, ry, phi_degrees, fa, fs, endX, endY) {
  return "A".concat(cln(rx), " ").concat(cln(ry), " ").concat(cln(phi_degrees), " ").concat(cln(fa), " ").concat(cln(fs), " ").concat(cln(endX), " ").concat(cln(endY));
};

var CircleMethods = {
  nearestPoint: function nearestPoint() {
    return Constructors.vector(nearest_point_on_circle(this.radius, this.origin, get_vector(arguments)));
  },
  intersect: function intersect(object) {
    return intersect$1(this, object);
  },
  path: function path() {
    var arcStart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var deltaArc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.PI * 2;
    var info = pathInfo(this.origin[0], this.origin[1], this.radius, this.radius, 0, arcStart, deltaArc);
    var arc1 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x2, info.y2);
    var arc2 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x3, info.y3);
    return "M".concat(info.x1, " ").concat(info.y1).concat(arc1).concat(arc2);
  }
};

var CircleStatic = {
  fromPoints: function fromPoints() {
    return this.constructor.apply(this, arguments);
  },
  fromThreePoints: function fromThreePoints() {
    var result = circumcircle.apply(void 0, arguments);
    return this.constructor.apply(this, _toConsumableArray(result.origin).concat([result.radius]));
  }
};

var Circle = {
  circle: {
    A: CircleArgs,
    G: CircleGetters,
    M: CircleMethods,
    S: CircleStatic
  }
};

var getFoci = function getFoci(center, rx, ry, spin) {
  var order = rx > ry;
  var lsq = order ? Math.pow(rx, 2) - Math.pow(ry, 2) : Math.pow(ry, 2) - Math.pow(rx, 2);
  var l = Math.sqrt(lsq);
  var trigX = order ? Math.cos(spin) : Math.sin(spin);
  var trigY = order ? Math.sin(spin) : Math.cos(spin);
  return [Constructors.vector(center[0] + l * trigX, center[1] + l * trigY), Constructors.vector(center[0] - l * trigX, center[1] - l * trigY)];
};

var Ellipse = {
  ellipse: {
    A: function A() {
      var numbers = flatten_arrays(arguments).filter(function (a) {
        return !isNaN(a);
      });
      var params = resize(5, numbers);
      this.rx = params[0];
      this.ry = params[1];
      this.origin = Constructors.vector(params[2], params[3]);
      this.spin = params[4];
      this.foci = getFoci(this.origin, this.rx, this.ry, this.spin);
    },
    G: {
      x: function x() {
        return this.origin[0];
      },
      y: function y() {
        return this.origin[1];
      }
    },
    M: {
      nearestPoint: function nearestPoint() {
        return Constructors.vector(nearest_point_on_ellipse(this.origin, this.radius, get_vector(arguments)));
      },
      intersect: function intersect(object) {
        return intersect$1(this, object);
      },
      path: function path() {
        var arcStart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var deltaArc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.PI * 2;
        var info = pathInfo(this.origin[0], this.origin[1], this.rx, this.ry, this.spin, arcStart, deltaArc);
        var arc1 = ellipticalArcTo(this.rx, this.ry, this.spin / Math.PI * 180, info.fa, info.fs, info.x2, info.y2);
        var arc2 = ellipticalArcTo(this.rx, this.ry, this.spin / Math.PI * 180, info.fa, info.fs, info.x3, info.y3);
        return "M".concat(info.x1, " ").concat(info.y1).concat(arc1).concat(arc2);
      }
    },
    S: {}
  }
};

var methods = {
  area: function area() {
    return signed_area(this.points);
  },
  centroid: function centroid$1() {
    return Constructors.vector(centroid(this.points));
  },
  enclosingRectangle: function enclosingRectangle() {
    return Constructors.rect(enclosing_rectangle(this.points));
  },
  contains: function contains() {
    return point_in_poly(get_vector(arguments), this.points);
  },
  scale: function scale(magnitude) {
    var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(this.points);
    var newPoints = this.points.map(function (p) {
      return [0, 1].map(function (_, i) {
        return p[i] - center[i];
      });
    }).map(function (vec) {
      return vec.map(function (_, i) {
        return center[i] + vec[i] * magnitude;
      });
    });
    return this.constructor.fromPoints(newPoints);
  },
  rotate: function rotate(angle) {
    var centerPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : centroid(this.points);
    var newPoints = this.points.map(function (p) {
      var vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
      var mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
      var a = Math.atan2(vec[1], vec[0]);
      return [centerPoint[0] + Math.cos(a + angle) * mag, centerPoint[1] + Math.sin(a + angle) * mag];
    });
    return Constructors.polygon(newPoints);
  },
  translate: function translate() {
    var vec = get_vector(arguments);
    var newPoints = this.points.map(function (p) {
      return p.map(function (n, i) {
        return n + vec[i];
      });
    });
    return this.constructor.fromPoints(newPoints);
  },
  transform: function transform() {
    var m = get_matrix_3x4(arguments);
    var newPoints = this.points.map(function (p) {
      return multiply_matrix3_vector3(m, resize(3, p));
    });
    return Constructors.polygon(newPoints);
  },
  sectors: function sectors() {
    return this.points.map(function (p, i, arr) {
      var prev = (i + arr.length - 1) % arr.length;
      var next = (i + 1) % arr.length;
      var center = p;
      var a = arr[prev].map(function (n, j) {
        return n - center[j];
      });
      var b = arr[next].map(function (n, j) {
        return n - center[j];
      });
      return Constructors.sector(b, a, center);
    });
  },
  nearest: function nearest() {
    var point = get_vector(arguments);
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
  },
  overlaps: function overlaps() {
    var poly2Points = semi_flatten_arrays(arguments);
    return convex_polygons_overlap(this.points, poly2Points);
  },
  split: function split() {
    var line = get_line(arguments);
    var split_func = this.convex ? split_convex_polygon : split_polygon;
    return split_func(this.points, line.vector, line.origin).map(function (poly) {
      return Constructors.polygon(poly);
    });
  },
  clipSegment: function clipSegment() {
    var edge = get_segment(arguments);
    var e = convex_poly_segment(this.points, edge[0], edge[1]);
    return e === undefined ? undefined : Constructors.segment(e);
  },
  clipLine: function clipLine() {
    var line = get_line(arguments);
    var e = convex_poly_line(this.points, line.vector, line.origin);
    return e === undefined ? undefined : Constructors.segment(e);
  },
  clipRay: function clipRay() {
    var line = get_line(arguments);
    var e = convex_poly_ray(this.points, line.vector, line.origin);
    return e === undefined ? undefined : Constructors.segment(e);
  },
  path: function path() {
    var pre = Array(this.points.length).fill("L");
    pre[0] = "M";
    return "".concat(this.points.map(function (p, i) {
      return "".concat(pre[i]).concat(p[0], " ").concat(p[1]);
    }).join(""), "z");
  }
};

var PolygonProto = function PolygonProto() {
  this.points = [];
};

Object.keys(methods).forEach(function (key) {
  PolygonProto.prototype[key] = methods[key];
});

var rectToPoints = function rectToPoints(r) {
  return [[r.x, r.y], [r.x + r.width, r.y], [r.x + r.width, r.y + r.height], [r.x, r.y + r.height]];
};

var Rect = {
  rect: {
    P: PolygonProto.prototype,
    A: function A() {
      var r = get_rect.apply(void 0, arguments);
      this.width = r.width;
      this.height = r.height;
      this.origin = Constructors.vector(r.x, r.y);
      this.points = rectToPoints(this);
    },
    G: {
      x: function x() {
        return this.origin[0];
      },
      y: function y() {
        return this.origin[1];
      }
    },
    M: {
      area: function area() {
        return this.width * this.height;
      }
    },
    S: {
      fromPoints: function fromPoints() {
        return Constructors.rect(enclosing_rectangle(get_vector_of_vectors(arguments)));
      }
    }
  }
};

var Polygon = {
  polygon: {
    P: PolygonProto.prototype,
    A: function A() {
      this.points = semi_flatten_arrays(arguments).map(function (v) {
        return Constructors.vector(v);
      });
      this.sides = this.points.map(function (p, i, arr) {
        return [p, arr[(i + 1) % arr.length]];
      }).map(function (ps) {
        return Constructors.segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]);
      });
    },
    G: {
      isConvex: function isConvex() {
        return true;
      }
    },
    M: {},
    S: {
      fromPoints: function fromPoints() {
        return this.constructor.apply(this, arguments);
      },
      regularPolygon: function regularPolygon(sides) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        return this.constructor(make_regular_polygon(sides, x, y, radius));
      },
      convexHull: function convexHull(points) {
        var includeCollinear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        return this.constructor(convex_hull(points, includeCollinear));
      }
    }
  }
};

var Matrix = {
  matrix: {
    P: Array.prototype,
    A: function A() {
      var _this = this;

      get_matrix_3x4(arguments).forEach(function (m) {
        return _this.push(m);
      });
    },
    G: {},
    M: {
      isIdentity: function isIdentity() {
        return is_identity3x4(this);
      },
      multiply: function multiply() {
        return Constructors.matrix(multiply_matrices3(this, get_matrix_3x4(arguments)).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      determinant: function determinant() {
        return clean_number(determinant3(this), 13);
      },
      inverse: function inverse() {
        return Constructors.matrix(invert_matrix3(this).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      translate: function translate(x, y, z) {
        return Constructors.matrix(multiply_matrices3(this, make_matrix3_translate(x, y, z)).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      rotateX: function rotateX(radians) {
        return Constructors.matrix(multiply_matrices3(this, make_matrix3_rotateX(radians)).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      rotateY: function rotateY(radians) {
        return Constructors.matrix(multiply_matrices3(this, make_matrix3_rotateY(radians)).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      rotateZ: function rotateZ(radians) {
        return Constructors.matrix(multiply_matrices3(this, make_matrix3_rotateZ(radians)).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      rotate: function rotate(radians, vector, origin) {
        var transform = make_matrix3_rotate(radians, vector, origin);
        return Constructors.matrix(multiply_matrices3(this, transform).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      scale: function scale(amount) {
        return Constructors.matrix(multiply_matrices3(this, make_matrix3_scale(amount)).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      reflectZ: function reflectZ(vector, origin) {
        var transform = make_matrix3_reflectionZ(vector, origin);
        return Constructors.matrix(multiply_matrices3(this, transform).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      transform: function transform() {
        for (var _len = arguments.length, innerArgs = new Array(_len), _key = 0; _key < _len; _key++) {
          innerArgs[_key] = arguments[_key];
        }

        return Constructors.vector(multiply_matrix3_vector3(get_vector(innerArgs), this).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      transformVector: function transformVector(vector) {
        return Constructors.matrix(multiply_matrix3_vector3(this, vector).map(function (n) {
          return clean_number(n, 13);
        }));
      },
      transformLine: function transformLine(origin, vector) {
        return Constructors.matrix(multiply_matrix3_line3(this, origin, vector).map(function (n) {
          return clean_number(n, 13);
        }));
      }
    },
    S: {}
  }
};

var Definitions = Object.assign({}, Vector, Line, Ray, Segment, Circle, Ellipse, Rect, Polygon, Matrix);

var create = function create(primitiveName, args) {
  var a = Object.create(Definitions[primitiveName].proto);
  Definitions[primitiveName].A.apply(a, args);
  return Object.freeze(a);
};

var vector = function vector() {
  return create("vector", arguments);
};

var circle = function circle() {
  return create("circle", arguments);
};

var ellipse = function ellipse() {
  return create("ellipse", arguments);
};

var rect = function rect() {
  return create("rect", arguments);
};

var polygon = function polygon() {
  return create("polygon", arguments);
};

var line = function line() {
  return create("line", arguments);
};

var ray = function ray() {
  return create("ray", arguments);
};

var segment = function segment() {
  return create("segment", arguments);
};

var matrix = function matrix() {
  return create("matrix", arguments);
};

Object.assign(Constructors, {
  vector: vector,
  circle: circle,
  ellipse: ellipse,
  rect: rect,
  polygon: polygon,
  line: line,
  ray: ray,
  segment: segment,
  matrix: matrix
});
Object.keys(Definitions).forEach(function (primitiveName) {
  var Proto = {};
  Proto.prototype = Definitions[primitiveName].P != null ? Object.create(Definitions[primitiveName].P) : Object.create(Object.prototype);
  Proto.prototype.constructor = Proto;
  Constructors[primitiveName].prototype = Proto.prototype;
  Constructors[primitiveName].prototype.constructor = Constructors[primitiveName];
  Object.keys(Definitions[primitiveName].G).forEach(function (key) {
    return Object.defineProperty(Proto.prototype, key, {
      get: Definitions[primitiveName].G[key]
    });
  });
  Object.keys(Definitions[primitiveName].M).forEach(function (key) {
    return Object.defineProperty(Proto.prototype, key, {
      value: Definitions[primitiveName].M[key]
    });
  });
  Object.keys(Definitions[primitiveName].S).forEach(function (key) {
    return Object.defineProperty(Constructors[primitiveName], key, {
      value: Definitions[primitiveName].S[key].bind(Constructors[primitiveName].prototype)
    });
  });
  Object.freeze(Proto.prototype);
  Definitions[primitiveName].proto = Proto.prototype;
});

var math = Constructors;
math.core = Object.assign({}, algebra, equal, geometry, interpolation, matrix2, matrix3, nearest, query, Arguments, origami);
math.intersect = intersect$1;
math.intersect.circle = IntersectionCircle;
math.intersect.lines = IntersectionLines;
math.intersect.polygon = IntersectionPolygon;

export default math;
