/* Rabbit Ear v0.1.91 (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.RabbitEar = factory());
}(this, (function () { 'use strict';

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
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

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

  var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
  var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
  var isWebWorker = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";

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
    return m === 0 ? v : v.map(function (c) {
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

  var algebra = Object.freeze({
    __proto__: null,
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

  var multiply_matrix2_vector2 = function multiply_matrix2_vector2(matrix, vector) {
    return [matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4], matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]];
  };

  var multiply_matrix2_line2 = function multiply_matrix2_line2(matrix, origin, vector) {
    return {
      origin: [matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4], matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]],
      vector: [matrix[0] * vector[0] + matrix[2] * vector[1], matrix[1] * vector[0] + matrix[3] * vector[1]]
    };
  };

  var multiply_matrices2 = function multiply_matrices2(m1, m2) {
    return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
  };

  var matrix2_determinant = function matrix2_determinant(m) {
    return m[0] * m[3] - m[1] * m[2];
  };

  var invert_matrix2 = function invert_matrix2(m) {
    var det = matrix2_determinant(m);

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

  var matrix2_core = Object.freeze({
    __proto__: null,
    multiply_matrix2_vector2: multiply_matrix2_vector2,
    multiply_matrix2_line2: multiply_matrix2_line2,
    multiply_matrices2: multiply_matrices2,
    matrix2_determinant: matrix2_determinant,
    invert_matrix2: invert_matrix2,
    make_matrix2_translate: make_matrix2_translate,
    make_matrix2_scale: make_matrix2_scale,
    make_matrix2_rotate: make_matrix2_rotate,
    make_matrix2_reflection: make_matrix2_reflection
  });

  var multiply_matrix3_vector3 = function multiply_matrix3_vector3(m, vector) {
    return [m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9], m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10], m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]];
  };

  var multiply_matrix3_line3 = function multiply_matrix3_line3(m, origin, vector) {
    return {
      origin: [m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9], m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10], m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11]],
      vector: [m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2], m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2], m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2]]
    };
  };

  var multiply_matrices3 = function multiply_matrices3(m1, m2) {
    return [m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2], m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2], m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2], m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5], m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5], m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5], m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8], m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8], m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8], m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9], m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10], m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11]];
  };

  var matrix3_determinant = function matrix3_determinant(m) {
    return m[0] * m[4] * m[8] - m[0] * m[7] * m[5] - m[3] * m[1] * m[8] + m[3] * m[7] * m[2] + m[6] * m[1] * m[5] - m[6] * m[4] * m[2];
  };

  var invert_matrix3 = function invert_matrix3(m) {
    var det = matrix3_determinant(m);

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

  var matrix3_core = Object.freeze({
    __proto__: null,
    multiply_matrix3_vector3: multiply_matrix3_vector3,
    multiply_matrix3_line3: multiply_matrix3_line3,
    multiply_matrices3: multiply_matrices3,
    matrix3_determinant: matrix3_determinant,
    invert_matrix3: invert_matrix3,
    make_matrix3_translate: make_matrix3_translate,
    make_matrix3_rotateX: make_matrix3_rotateX,
    make_matrix3_rotateY: make_matrix3_rotateY,
    make_matrix3_rotateZ: make_matrix3_rotateZ,
    make_matrix3_rotate: make_matrix3_rotate,
    make_matrix3_scale: make_matrix3_scale,
    make_matrix3_reflectionZ: make_matrix3_reflectionZ
  });

  var countPlaces = function countPlaces(num) {
    var m = "".concat(num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);

    if (!m) {
      return 0;
    }

    return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
  };

  var clean_number = function clean_number(num) {
    var places = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
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

  var flatten_input = function flatten_input() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
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
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
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
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
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
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return semi_flatten_input(args).map(function (el) {
      return get_vector(el);
    });
  };

  var identity2 = [1, 0, 0, 1, 0, 0];
  var identity3 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];

  var get_matrix2 = function get_matrix2() {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
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

  var get_matrix3 = function get_matrix3() {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    var m = get_vector(args);

    if (m === undefined) {
      return undefined;
    }

    switch (m.length) {
      case 4:
        return [m[0], m[1], 0, 0, m[2], m[3], 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

      case 6:
        return [m[0], m[1], 0, m[2], m[3], 0, 0, 0, 1, m[4], m[5], 0];

      case 9:
        return [m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], 0, 0, 0];

      case 12:
        return m;

      case 16:
        return [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10], m[12], m[13], m[14]];
    }

    if (m.length > 12) {
      return [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10], m[12], m[13], m[14]];
    }

    if (m.length < 12) {
      return identity3.map(function (n, i) {
        return m[i] || n;
      });
    }

    return undefined;
  };

  function get_segment() {
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
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

    if (params.length === 0) {
      return {
        vector: [],
        origin: []
      };
    }

    if (!isNaN(params[0]) && numbers.length >= 4) {
      return {
        origin: [params[0], params[1]],
        vector: [params[2], params[3]]
      };
    }

    if (arrays.length > 0) {
      if (arrays.length === 1) {
        return get_line.apply(void 0, _toConsumableArray(arrays[0]));
      }

      if (arrays.length === 2) {
        return {
          origin: [arrays[0][0], arrays[0][1]],
          vector: [arrays[1][0], arrays[1][1]]
        };
      }

      if (arrays.length === 4) {
        return {
          origin: [arrays[0], arrays[1]],
          vector: [arrays[2], arrays[3]]
        };
      }
    }

    if (params[0].constructor === Object) {
      var vector = [],
          origin = [];

      if (params[0].vector != null) {
        vector = get_vector(params[0].vector);
      } else if (params[0].direction != null) {
        vector = get_vector(params[0].direction);
      }

      if (params[0].origin != null) {
        origin = get_vector(params[0].origin);
      } else if (params[0].point != null) {
        origin = get_vector(params[0].point);
      }

      return {
        origin: origin,
        vector: vector
      };
    }

    return {
      origin: [],
      vector: []
    };
  }

  function get_ray() {
    return get_line.apply(void 0, arguments);
  }

  function get_two_vec2() {
    for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      args[_key9] = arguments[_key9];
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
    for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
      args[_key10] = arguments[_key10];
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
    for (var _len11 = arguments.length, args = new Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
      args[_key11] = arguments[_key11];
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
    var list = get_vector_of_vectors.apply(void 0, arguments);

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
    for (var _len12 = arguments.length, args = new Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
      args[_key12] = arguments[_key12];
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

      case "string":
        return array_similarity_test(list, function (a, b) {
          return a === b;
        });

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

  var equal = Object.freeze({
    __proto__: null,
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

  var query = Object.freeze({
    __proto__: null,
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

  var line_line_comp = function line_line_comp() {
    return true;
  };

  var line_ray_comp = function line_ray_comp(t0, t1) {
    return t1 >= -EPSILON;
  };

  var line_segment_comp = function line_segment_comp(t0, t1) {
    return t1 >= -EPSILON && t1 <= 1 + EPSILON;
  };

  var ray_ray_comp = function ray_ray_comp(t0, t1) {
    return t0 >= -EPSILON && t1 >= -EPSILON;
  };

  var ray_segment_comp = function ray_segment_comp(t0, t1) {
    return t0 >= -EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
  };

  var segment_segment_comp$1 = function segment_segment_comp$1(t0, t1) {
    return t0 >= -EPSILON && t0 <= 1 + EPSILON && t1 >= -EPSILON && t1 <= 1 + EPSILON;
  };

  var line_ray_comp_exclusive = function line_ray_comp_exclusive(t0, t1) {
    return t1 > EPSILON;
  };

  var line_segment_comp_exclusive = function line_segment_comp_exclusive(t0, t1) {
    return t1 > EPSILON && t1 < 1 - EPSILON;
  };

  var ray_ray_comp_exclusive = function ray_ray_comp_exclusive(t0, t1) {
    return t0 > EPSILON && t1 > EPSILON;
  };

  var ray_segment_comp_exclusive = function ray_segment_comp_exclusive(t0, t1) {
    return t0 > EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
  };

  var segment_segment_comp_exclusive = function segment_segment_comp_exclusive(t0, t1) {
    return t0 > EPSILON && t0 < 1 - EPSILON && t1 > EPSILON && t1 < 1 - EPSILON;
  };

  var limit_line = function limit_line(dist) {
    return dist;
  };

  var limit_ray = function limit_ray(dist) {
    return dist < -EPSILON ? 0 : dist;
  };

  var limit_segment = function limit_segment(dist) {
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

  var line_segment = function line_segment(origin, vec, segment0, segment1, epsilon) {
    var segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
    return intersection_function(origin, vec, segment0, segmentVec, line_segment_comp, epsilon);
  };

  var ray_ray = function ray_ray(aPt, aVec, bPt, bVec, epsilon) {
    return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp, epsilon);
  };

  var ray_segment = function ray_segment(rayPt, rayVec, segment0, segment1, epsilon) {
    var segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
    return intersection_function(rayPt, rayVec, segment0, segmentVec, ray_segment_comp, epsilon);
  };

  var segment_segment = function segment_segment(a0, a1, b0, b1, epsilon) {
    var aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    var bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return intersection_function(a0, aVec, b0, bVec, segment_segment_comp$1, epsilon);
  };

  var line_ray_exclusive = function line_ray_exclusive(linePt, lineVec, rayPt, rayVec, epsilon) {
    return intersection_function(linePt, lineVec, rayPt, rayVec, line_ray_comp_exclusive, epsilon);
  };

  var line_segment_exclusive = function line_segment_exclusive(origin, vec, segment0, segment1, epsilon) {
    var segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
    return intersection_function(origin, vec, segment0, segmentVec, line_segment_comp_exclusive, epsilon);
  };

  var ray_ray_exclusive = function ray_ray_exclusive(aPt, aVec, bPt, bVec, epsilon) {
    return intersection_function(aPt, aVec, bPt, bVec, ray_ray_comp_exclusive, epsilon);
  };

  var ray_segment_exclusive = function ray_segment_exclusive(rayPt, rayVec, segment0, segment1, epsilon) {
    var segmentVec = [segment1[0] - segment0[0], segment1[1] - segment0[1]];
    return intersection_function(rayPt, rayVec, segment0, segmentVec, ray_segment_comp_exclusive, epsilon);
  };

  var segment_segment_exclusive = function segment_segment_exclusive(a0, a1, b0, b1, epsilon) {
    var aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    var bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return intersection_function(a0, aVec, b0, bVec, segment_segment_comp_exclusive, epsilon);
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

  var circle_segment = function circle_segment(center, radius, p0, p1) {
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

    return undefined;
  };

  var quick_equivalent_2 = function quick_equivalent_2(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
  };

  var convex_poly_line = function convex_poly_line(poly, linePoint, lineVector) {
    var intersections = poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (el) {
      return line_segment(linePoint, lineVector, el[0], el[1]);
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

  var convex_poly_ray_exclusive = function convex_poly_ray_exclusive(poly, linePoint, lineVector) {
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

  var intersection = Object.freeze({
    __proto__: null,
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
    for (var _len13 = arguments.length, vectors = new Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
      vectors[_key13] = arguments[_key13];
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
    for (var _len14 = arguments.length, vectors = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
      vectors[_key14] = arguments[_key14];
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

      var _dot = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];

      delete array[_dot > 0 ? 1 : 0];
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
      var intersection = line_segment_exclusive(linePoint, lineVector, v, arr[(i + 1) % arr.length]);
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
      var intersection = line_segment_exclusive(linePoint, lineVector, v, arr[(i + 1) % arr.length]);
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

  var VectorPrototype = function VectorPrototype(subtype) {
    var proto = [];
    var Type = subtype;
    var that;

    var bind = function bind(theother) {
      that = theother;
    };

    var vecNormalize = function vecNormalize() {
      return Type(normalize(that));
    };

    var vecDot = function vecDot() {
      for (var _len15 = arguments.length, args = new Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
        args[_key15] = arguments[_key15];
      }

      var vec = get_vector(args);
      return this.length > vec.length ? dot(vec, that) : dot(that, vec);
    };

    var cross = function cross() {
      for (var _len16 = arguments.length, args = new Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
        args[_key16] = arguments[_key16];
      }

      var b = get_vector(args);
      var a = that.slice();

      if (a[2] == null) {
        a[2] = 0;
      }

      if (b[2] == null) {
        b[2] = 0;
      }

      return Type(cross3(a, b));
    };

    var distanceTo = function distanceTo() {
      for (var _len17 = arguments.length, args = new Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
        args[_key17] = arguments[_key17];
      }

      var vec = get_vector(args);
      var length = that.length < vec.length ? that.length : vec.length;
      var sum = Array.from(Array(length)).map(function (_, i) {
        return Math.pow(that[i] - vec[i], 2);
      }).reduce(function (prev, curr) {
        return prev + curr;
      }, 0);
      return Math.sqrt(sum);
    };

    var transform = function transform() {
      for (var _len18 = arguments.length, args = new Array(_len18), _key18 = 0; _key18 < _len18; _key18++) {
        args[_key18] = arguments[_key18];
      }

      var m = get_matrix2(args);
      return Type(multiply_matrix2_vector2(m, that));
    };

    var add = function add() {
      for (var _len19 = arguments.length, args = new Array(_len19), _key19 = 0; _key19 < _len19; _key19++) {
        args[_key19] = arguments[_key19];
      }

      var vec = get_vector(args);
      return Type(that.map(function (v, i) {
        return v + vec[i];
      }));
    };

    var subtract = function subtract() {
      for (var _len20 = arguments.length, args = new Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
        args[_key20] = arguments[_key20];
      }

      var vec = get_vector(args);
      return Type(that.map(function (v, i) {
        return v - vec[i];
      }));
    };

    var rotateZ = function rotateZ(angle, origin) {
      var m = make_matrix2_rotate(angle, origin);
      return Type(multiply_matrix2_vector2(m, that));
    };

    var rotateZ90 = function rotateZ90() {
      return Type(-that[1], that[0]);
    };

    var rotateZ180 = function rotateZ180() {
      return Type(-that[0], -that[1]);
    };

    var rotateZ270 = function rotateZ270() {
      return Type(that[1], -that[0]);
    };

    var flip = function flip() {
      return Type.apply(void 0, _toConsumableArray(that.map(function (n) {
        return -n;
      })));
    };

    var reflect = function reflect() {
      for (var _len21 = arguments.length, args = new Array(_len21), _key21 = 0; _key21 < _len21; _key21++) {
        args[_key21] = arguments[_key21];
      }

      var ref = get_line(args);
      var m = make_matrix2_reflection(ref.vector, ref.origin);
      return Type(multiply_matrix2_vector2(m, that));
    };

    var lerp = function lerp(vector, pct) {
      var vec = get_vector(vector);
      var inv = 1.0 - pct;
      var length = that.length < vec.length ? that.length : vec.length;
      var components = Array.from(Array(length)).map(function (_, i) {
        return that[i] * pct + vec[i] * inv;
      });
      return Type(components);
    };

    var isEquivalent = function isEquivalent() {
      for (var _len22 = arguments.length, args = new Array(_len22), _key22 = 0; _key22 < _len22; _key22++) {
        args[_key22] = arguments[_key22];
      }

      var vec = get_vector(args);
      var sm = that.length < vec.length ? that : vec;
      var lg = that.length < vec.length ? vec : that;
      return equivalent(sm, lg);
    };

    var isParallel = function isParallel() {
      for (var _len23 = arguments.length, args = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
        args[_key23] = arguments[_key23];
      }

      var vec = get_vector(args);
      var sm = that.length < vec.length ? that : vec;
      var lg = that.length < vec.length ? vec : that;
      return parallel(sm, lg);
    };

    var scale = function scale(mag) {
      return Type(that.map(function (v) {
        return v * mag;
      }));
    };

    var midpoint = function midpoint() {
      for (var _len24 = arguments.length, args = new Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
        args[_key24] = arguments[_key24];
      }

      var vec = get_vector(args);
      var sm = that.length < vec.length ? that.slice() : vec;
      var lg = that.length < vec.length ? vec : that.slice();

      for (var i = sm.length; i < lg.length; i += 1) {
        sm[i] = 0;
      }

      return Type(lg.map(function (_, i) {
        return (sm[i] + lg[i]) * 0.5;
      }));
    };

    var bisect = function bisect() {
      for (var _len25 = arguments.length, args = new Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
        args[_key25] = arguments[_key25];
      }

      var vec = get_vector(args);
      return bisect_vectors(that, vec).map(function (b) {
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
    Object.defineProperty(proto, "flip", {
      value: flip
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
        return Type.apply(void 0, _toConsumableArray(that));
      }
    });
    Object.defineProperty(proto, "magnitude", {
      get: function get() {
        return magnitude(that);
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

    for (var _len26 = arguments.length, args = new Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
      args[_key26] = arguments[_key26];
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

  Vector.withAngle = function (angle) {
    return Vector(Math.cos(angle), Math.sin(angle));
  };

  var Matrix2 = function Matrix2() {
    var matrix = [1, 0, 0, 1, 0, 0];

    for (var _len27 = arguments.length, args = new Array(_len27), _key27 = 0; _key27 < _len27; _key27++) {
      args[_key27] = arguments[_key27];
    }

    var argsMatrix = get_matrix2(args);

    if (argsMatrix !== undefined) {
      argsMatrix.forEach(function (n, i) {
        matrix[i] = n;
      });
    }

    var multiply = function multiply() {
      for (var _len28 = arguments.length, innerArgs = new Array(_len28), _key28 = 0; _key28 < _len28; _key28++) {
        innerArgs[_key28] = arguments[_key28];
      }

      return Matrix2(multiply_matrices2(matrix, get_matrix2(innerArgs)).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var determinant = function determinant() {
      return clean_number(matrix2_determinant(matrix));
    };

    var inverse = function inverse() {
      return Matrix2(invert_matrix2(matrix).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var translate = function translate(x, y) {
      var transform = make_matrix2_translate(x, y);
      return Matrix2(multiply_matrices2(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var scale = function scale() {
      var transform = make_matrix2_scale.apply(void 0, arguments);
      return Matrix2(multiply_matrices2(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var rotate = function rotate() {
      var transform = make_matrix2_rotate.apply(void 0, arguments);
      return Matrix2(multiply_matrices2(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var reflect = function reflect() {
      var transform = make_matrix2_reflection.apply(void 0, arguments);
      return Matrix2(multiply_matrices2(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transform = function transform() {
      for (var _len29 = arguments.length, innerArgs = new Array(_len29), _key29 = 0; _key29 < _len29; _key29++) {
        innerArgs[_key29] = arguments[_key29];
      }

      var v = get_vector(innerArgs);
      return Vector(multiply_matrix2_vector2(matrix, v).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transformVector = function transformVector(vector) {
      return Matrix2(multiply_matrix2_vector2(matrix, vector).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transformLine = function transformLine(origin, vector) {
      return Matrix2(multiply_matrix2_line2(matrix, origin, vector).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    Object.defineProperty(matrix, "multiply", {
      value: multiply
    });
    Object.defineProperty(matrix, "determinant", {
      value: determinant
    });
    Object.defineProperty(matrix, "inverse", {
      value: inverse
    });
    Object.defineProperty(matrix, "translate", {
      value: translate
    });
    Object.defineProperty(matrix, "scale", {
      value: scale
    });
    Object.defineProperty(matrix, "rotate", {
      value: rotate
    });
    Object.defineProperty(matrix, "reflect", {
      value: reflect
    });
    Object.defineProperty(matrix, "transform", {
      value: transform
    });
    Object.defineProperty(matrix, "transformVector", {
      value: transformVector
    });
    Object.defineProperty(matrix, "transformLine", {
      value: transformLine
    });
    return Object.freeze(matrix);
  };

  Matrix2.makeIdentity = function () {
    return Matrix2(1, 0, 0, 1, 0, 0);
  };

  Matrix2.makeTranslation = function (x, y) {
    return Matrix2(make_matrix2_translate(x, y));
  };

  Matrix2.makeRotation = function (angle_radians, origin) {
    return Matrix2(make_matrix2_rotate(angle_radians, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix2.makeScale = function (x, y, origin) {
    return Matrix2(make_matrix2_scale(x, y, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix2.makeReflection = function (vector, origin) {
    return Matrix2(make_matrix2_reflection(vector, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  var Matrix = function Matrix() {
    var matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];

    for (var _len30 = arguments.length, args = new Array(_len30), _key30 = 0; _key30 < _len30; _key30++) {
      args[_key30] = arguments[_key30];
    }

    var argsMatrix = get_matrix3(args);

    if (argsMatrix !== undefined) {
      argsMatrix.forEach(function (n, i) {
        matrix[i] = n;
      });
    }

    var multiply = function multiply() {
      for (var _len31 = arguments.length, innerArgs = new Array(_len31), _key31 = 0; _key31 < _len31; _key31++) {
        innerArgs[_key31] = arguments[_key31];
      }

      return Matrix(multiply_matrices3(matrix, get_matrix3(innerArgs)).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var determinant = function determinant() {
      return clean_number(matrix3_determinant(matrix), 13);
    };

    var inverse = function inverse() {
      return Matrix(invert_matrix3(matrix).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var translate = function translate(x, y, z) {
      var transform = make_matrix3_translate(x, y, z);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var rotateX = function rotateX(angle_radians) {
      var transform = make_matrix3_rotateX(angle_radians);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var rotateY = function rotateY(angle_radians) {
      var transform = make_matrix3_rotateY(angle_radians);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var rotateZ = function rotateZ(angle_radians) {
      var transform = make_matrix3_rotateZ(angle_radians);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var rotate = function rotate(angle_radians, vector, origin) {
      var transform = make_matrix3_rotate(angle_radians, vector, origin);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var scale = function scale(amount) {
      var transform = make_matrix3_scale(amount);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var reflectZ = function reflectZ(vector, origin) {
      var transform = make_matrix3_reflectionZ(vector, origin);
      return Matrix(multiply_matrices3(matrix, transform).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transform = function transform() {
      for (var _len32 = arguments.length, innerArgs = new Array(_len32), _key32 = 0; _key32 < _len32; _key32++) {
        innerArgs[_key32] = arguments[_key32];
      }

      var v = get_vector(innerArgs);
      return Vector(multiply_matrix3_vector3(v, matrix).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transformVector = function transformVector(vector) {
      return Matrix(multiply_matrix3_vector3(matrix, vector).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    var transformLine = function transformLine(origin, vector) {
      return Matrix(multiply_matrix3_line3(matrix, origin, vector).map(function (n) {
        return clean_number(n, 13);
      }));
    };

    Object.defineProperty(matrix, "multiply", {
      value: multiply
    });
    Object.defineProperty(matrix, "determinant", {
      value: determinant
    });
    Object.defineProperty(matrix, "inverse", {
      value: inverse
    });
    Object.defineProperty(matrix, "translate", {
      value: translate
    });
    Object.defineProperty(matrix, "rotateX", {
      value: rotateX
    });
    Object.defineProperty(matrix, "rotateY", {
      value: rotateY
    });
    Object.defineProperty(matrix, "rotateZ", {
      value: rotateZ
    });
    Object.defineProperty(matrix, "rotate", {
      value: rotate
    });
    Object.defineProperty(matrix, "scale", {
      value: scale
    });
    Object.defineProperty(matrix, "reflectZ", {
      value: reflectZ
    });
    Object.defineProperty(matrix, "transform", {
      value: transform
    });
    Object.defineProperty(matrix, "transformVector", {
      value: transformVector
    });
    Object.defineProperty(matrix, "transformLine", {
      value: transformLine
    });
    return Object.freeze(matrix);
  };

  Matrix.makeIdentity = function () {
    return Matrix(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0);
  };

  Matrix.makeTranslation = function (x, y, z) {
    return Matrix(make_matrix3_translate(x, y, z));
  };

  Matrix.makeRotationX = function (angle_radians) {
    return Matrix(make_matrix3_rotateX(angle_radians).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix.makeRotationY = function (angle_radians) {
    return Matrix(make_matrix3_rotateY(angle_radians).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix.makeRotationZ = function (angle_radians) {
    return Matrix(make_matrix3_rotateZ(angle_radians).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix.makeRotation = function (angle_radians, vector, origin) {
    return Matrix(make_matrix3_rotate(angle_radians, vector, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix.makeScale = function (amount, origin) {
    return Matrix(make_matrix3_scale(amount, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  Matrix.makeReflectionZ = function (vector, origin) {
    return Matrix(make_matrix3_reflectionZ(vector, origin).map(function (n) {
      return clean_number(n, 13);
    }));
  };

  function Prototype(subtype, prototype) {
    var proto = prototype != null ? prototype : {};

    var compare_to_line = function compare_to_line(t0, t1) {
      var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
      return this.compare_function(t0, epsilon) && true;
    };

    var compare_to_ray = function compare_to_ray(t0, t1) {
      var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
      return this.compare_function(t0, epsilon) && t1 >= -epsilon;
    };

    var compare_to_segment = function compare_to_segment(t0, t1) {
      var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
      return this.compare_function(t0, epsilon) && t1 >= -epsilon && t1 <= 1 + epsilon;
    };

    var isParallel = function isParallel(line, epsilon) {
      if (line.vector == null) {
        throw new Error("isParallel() argument is missing a vector");
      }

      var this_is_smaller = this.vector.length < line.vector.length;
      var sm = this_is_smaller ? this.vector : line.vector;
      var lg = this_is_smaller ? line.vector : this.vector;
      return parallel(sm, lg);
    };

    var isDegenerate = function isDegenerate() {
      return degenerate(this.vector);
    };

    var reflection = function reflection() {
      return Matrix2.makeReflection(this.vector, this.origin);
    };

    var nearestPoint = function nearestPoint() {
      for (var _len33 = arguments.length, args = new Array(_len33), _key33 = 0; _key33 < _len33; _key33++) {
        args[_key33] = arguments[_key33];
      }

      var point = get_vector(args);
      return Vector(nearest_point_on_line(this.origin, this.vector, point, this.clip_function));
    };

    var intersect = function intersect(other) {
      var _this = this;

      return intersection_function(this.origin, this.vector, other.origin, other.vector, function (t0, t1) {
        var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
        return _this.compare_function(t0, epsilon) && other.compare_function(t1, epsilon);
      });
    };

    var intersectLine = function intersectLine() {
      for (var _len34 = arguments.length, args = new Array(_len34), _key34 = 0; _key34 < _len34; _key34++) {
        args[_key34] = arguments[_key34];
      }

      var line = get_line(args);
      return intersection_function(this.origin, this.vector, line.origin, line.vector, compare_to_line.bind(this));
    };

    var intersectRay = function intersectRay() {
      for (var _len35 = arguments.length, args = new Array(_len35), _key35 = 0; _key35 < _len35; _key35++) {
        args[_key35] = arguments[_key35];
      }

      var ray = get_ray(args);
      return intersection_function(this.origin, this.vector, ray.origin, ray.vector, compare_to_ray.bind(this));
    };

    var intersectSegment = function intersectSegment() {
      for (var _len36 = arguments.length, args = new Array(_len36), _key36 = 0; _key36 < _len36; _key36++) {
        args[_key36] = arguments[_key36];
      }

      var edge = get_segment(args);
      var edgeVec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1]];
      return intersection_function(this.origin, this.vector, edge[0], edgeVec, compare_to_segment.bind(this));
    };

    var bisectLine = function bisectLine() {
      for (var _len37 = arguments.length, args = new Array(_len37), _key37 = 0; _key37 < _len37; _key37++) {
        args[_key37] = arguments[_key37];
      }

      var line = get_line(args);
      return bisect_lines2(this.origin, this.vector, line.origin, line.vector);
    };

    var bisectRay = function bisectRay() {
      for (var _len38 = arguments.length, args = new Array(_len38), _key38 = 0; _key38 < _len38; _key38++) {
        args[_key38] = arguments[_key38];
      }

      var ray = get_ray(args);
      return bisect_lines2(this.origin, this.vector, ray.origin, ray.vector);
    };

    var bisectSegment = function bisectSegment() {
      for (var _len39 = arguments.length, args = new Array(_len39), _key39 = 0; _key39 < _len39; _key39++) {
        args[_key39] = arguments[_key39];
      }

      var s = get_segment(args);
      var vector = [s[1][0] - s[0][0], s[1][1] - s[0][1]];
      return bisect_lines2(this.origin, this.vector, s[0], vector);
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
    Object.defineProperty(proto, "intersectSegment", {
      value: intersectSegment
    });
    Object.defineProperty(proto, "bisectLine", {
      value: bisectLine
    });
    Object.defineProperty(proto, "bisectRay", {
      value: bisectRay
    });
    Object.defineProperty(proto, "bisectSegment", {
      value: bisectSegment
    });
    return Object.freeze(proto);
  }

  var Line = function Line() {
    for (var _len40 = arguments.length, args = new Array(_len40), _key40 = 0; _key40 < _len40; _key40++) {
      args[_key40] = arguments[_key40];
    }

    var _get_line = get_line(args),
        origin = _get_line.origin,
        vector = _get_line.vector;

    var transform = function transform() {
      for (var _len41 = arguments.length, innerArgs = new Array(_len41), _key41 = 0; _key41 < _len41; _key41++) {
        innerArgs[_key41] = arguments[_key41];
      }

      var mat = get_matrix2(innerArgs);
      var line = multiply_matrix2_line2(mat, origin, vector);
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
    line.origin = Vector(origin);
    line.vector = Vector(vector);
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
    for (var _len42 = arguments.length, args = new Array(_len42), _key42 = 0; _key42 < _len42; _key42++) {
      args[_key42] = arguments[_key42];
    }

    var points = get_two_vec2(args);
    return Line({
      origin: points[0],
      vector: normalize([points[1][0] - points[0][0], points[1][1] - points[0][1]])
    });
  };

  Line.perpendicularBisector = function () {
    for (var _len43 = arguments.length, args = new Array(_len43), _key43 = 0; _key43 < _len43; _key43++) {
      args[_key43] = arguments[_key43];
    }

    var points = get_two_vec2(args);
    var vec = normalize([points[1][0] - points[0][0], points[1][1] - points[0][1]]);
    return Line({
      origin: average(points[0], points[1]),
      vector: [vec[1], -vec[0]]
    });
  };

  var Ray = function Ray() {
    for (var _len44 = arguments.length, args = new Array(_len44), _key44 = 0; _key44 < _len44; _key44++) {
      args[_key44] = arguments[_key44];
    }

    var _get_line2 = get_line(args),
        origin = _get_line2.origin,
        vector = _get_line2.vector;

    var transform = function transform() {
      for (var _len45 = arguments.length, innerArgs = new Array(_len45), _key45 = 0; _key45 < _len45; _key45++) {
        innerArgs[_key45] = arguments[_key45];
      }

      var mat = get_matrix2(innerArgs);
      var vec_translated = vector.map(function (vec, i) {
        return vec + origin[i];
      });
      var new_origin = multiply_matrix2_vector2(mat, origin);
      var new_vector = multiply_matrix2_vector2(mat, vec_translated).map(function (vec, i) {
        return vec - new_origin[i];
      });
      return Ray(new_origin, new_vector);
    };

    var rotate180 = function rotate180() {
      return Ray(origin[0], origin[1], -vector[0], -vector[1]);
    };

    var proto = Prototype.bind(this);
    var ray = Object.create(proto(Ray));

    var compare_function = function compare_function(t0, ep) {
      return t0 >= -ep;
    };

    Object.defineProperty(ray, "origin", {
      get: function get() {
        return Vector(origin);
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
    for (var _len46 = arguments.length, args = new Array(_len46), _key46 = 0; _key46 < _len46; _key46++) {
      args[_key46] = arguments[_key46];
    }

    var points = get_two_vec2(args);
    return Ray({
      origin: points[0],
      vector: normalize([points[1][0] - points[0][0], points[1][1] - points[0][1]])
    });
  };

  var Segment = function Segment() {
    for (var _len47 = arguments.length, args = new Array(_len47), _key47 = 0; _key47 < _len47; _key47++) {
      args[_key47] = arguments[_key47];
    }

    var inputs = get_two_vec2(args);
    var proto = Prototype.bind(this);
    var vecPts = inputs.length > 0 ? inputs.map(function (p) {
      return Vector(p);
    }) : undefined;

    if (vecPts === undefined) {
      return undefined;
    }

    var segment = Object.create(proto(Segment, vecPts));

    var transform = function transform() {
      for (var _len48 = arguments.length, innerArgs = new Array(_len48), _key48 = 0; _key48 < _len48; _key48++) {
        innerArgs[_key48] = arguments[_key48];
      }

      var mat = get_matrix2(innerArgs);
      var transformed_points = segment.map(function (point) {
        return multiply_matrix2_vector2(mat, point);
      });
      return Segment(transformed_points);
    };

    var scale = function scale(magnitude) {
      var mid = average(segment[0], segment[1]);
      var transformed_points = segment.map(function (p) {
        return p.lerp(mid, magnitude);
      });
      return Segment(transformed_points);
    };

    var vector = function vector() {
      return Vector(segment[1][0] - segment[0][0], segment[1][1] - segment[0][1]);
    };

    var midpoint = function midpoint() {
      return Vector(average(segment[0], segment[1]));
    };

    var magnitude = function magnitude() {
      return Math.sqrt(Math.pow(segment[1][0] - segment[0][0], 2) + Math.pow(segment[1][1] - segment[0][1], 2));
    };

    var compare_function = function compare_function(t0, ep) {
      return t0 >= -ep && t0 <= 1 + ep;
    };

    Object.defineProperty(segment, "origin", {
      get: function get() {
        return segment[0];
      }
    });
    Object.defineProperty(segment, "vector", {
      get: function get() {
        return vector();
      }
    });
    Object.defineProperty(segment, "midpoint", {
      value: midpoint
    });
    Object.defineProperty(segment, "magnitude", {
      get: function get() {
        return magnitude();
      }
    });
    Object.defineProperty(segment, "transform", {
      value: transform
    });
    Object.defineProperty(segment, "scale", {
      value: scale
    });
    Object.defineProperty(segment, "compare_function", {
      value: compare_function
    });
    Object.defineProperty(segment, "clip_function", {
      value: limit_segment
    });
    return segment;
  };

  var Circle = function Circle() {
    var origin;
    var radius;

    for (var _len49 = arguments.length, args = new Array(_len49), _key49 = 0; _key49 < _len49; _key49++) {
      args[_key49] = arguments[_key49];
    }

    var numbers = args.filter(function (param) {
      return !isNaN(param);
    });
    var vectors = get_two_vec2(args);

    if (numbers.length === 3) {
      origin = Vector(numbers[0], numbers[1]);

      var _numbers = _slicedToArray(numbers, 3);

      radius = _numbers[2];
    } else if (vectors.length === 2) {
      radius = distance2.apply(void 0, _toConsumableArray(vectors));
      origin = Vector.apply(void 0, _toConsumableArray(vectors[0]));
    }

    var intersectionLine = function intersectionLine() {
      for (var _len50 = arguments.length, innerArgs = new Array(_len50), _key50 = 0; _key50 < _len50; _key50++) {
        innerArgs[_key50] = arguments[_key50];
      }

      var line = get_line(innerArgs);
      var p2 = [line.origin[0] + line.vector[0], line.origin[1] + line.vector[1]];
      var result = circle_line(origin, radius, line.origin, p2);
      return result === undefined ? undefined : result.map(function (i) {
        return Vector(i);
      });
    };

    var intersectionRay = function intersectionRay() {
      for (var _len51 = arguments.length, innerArgs = new Array(_len51), _key51 = 0; _key51 < _len51; _key51++) {
        innerArgs[_key51] = arguments[_key51];
      }

      var ray = get_ray(innerArgs);
      var result = circle_ray(origin, radius, ray[0], ray[1]);
      return result === undefined ? undefined : result.map(function (i) {
        return Vector(i);
      });
    };

    var intersectionSegment = function intersectionSegment() {
      for (var _len52 = arguments.length, innerArgs = new Array(_len52), _key52 = 0; _key52 < _len52; _key52++) {
        innerArgs[_key52] = arguments[_key52];
      }

      var segment = get_two_vec2(innerArgs);
      var result = circle_segment(origin, radius, segment[0], segment[1]);
      return result === undefined ? undefined : result.map(function (i) {
        return Vector(i);
      });
    };

    return {
      intersectionLine: intersectionLine,
      intersectionRay: intersectionRay,
      intersectionSegment: intersectionSegment,

      get origin() {
        return origin;
      },

      get x() {
        return origin[0];
      },

      get y() {
        return origin[1];
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
      return Vector(Math.cos(bisected), Math.sin(bisected));
    };

    var subsect_sector = function subsect_sector(divisions) {
      return subsect(divisions, vectors[0], vectors[1]).map(function (vec) {
        return Vector(vec[0], vec[1]);
      });
    };

    var contains = function contains() {
      for (var _len53 = arguments.length, args = new Array(_len53), _key53 = 0; _key53 < _len53; _key53++) {
        args[_key53] = arguments[_key53];
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

  function Prototype$1(subtype) {
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
        return Sector(b, a, center);
      });
    };

    var contains = function contains() {
      for (var _len54 = arguments.length, args = new Array(_len54), _key54 = 0; _key54 < _len54; _key54++) {
        args[_key54] = arguments[_key54];
      }

      return point_in_poly(get_vector(args), this.points);
    };

    var polyCentroid = function polyCentroid() {
      return centroid(this.points);
    };

    var nearest = function nearest() {
      for (var _len55 = arguments.length, args = new Array(_len55), _key55 = 0; _key55 < _len55; _key55++) {
        args[_key55] = arguments[_key55];
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

    var clipSegment = function clipSegment() {
      for (var _len56 = arguments.length, args = new Array(_len56), _key56 = 0; _key56 < _len56; _key56++) {
        args[_key56] = arguments[_key56];
      }

      var edge = get_segment(args);
      var e = convex_poly_segment(this.points, edge[0], edge[1]);
      return e === undefined ? undefined : Segment(e);
    };

    var clipLine = function clipLine() {
      for (var _len57 = arguments.length, args = new Array(_len57), _key57 = 0; _key57 < _len57; _key57++) {
        args[_key57] = arguments[_key57];
      }

      var line = get_line(args);
      var e = convex_poly_line(this.points, line.origin, line.vector);
      return e === undefined ? undefined : Segment(e);
    };

    var clipRay = function clipRay() {
      for (var _len58 = arguments.length, args = new Array(_len58), _key58 = 0; _key58 < _len58; _key58++) {
        args[_key58] = arguments[_key58];
      }

      var line = get_line(args);
      var e = convex_poly_ray(this.points, line.origin, line.vector);
      return e === undefined ? undefined : Segment(e);
    };

    var split = function split() {
      for (var _len59 = arguments.length, args = new Array(_len59), _key59 = 0; _key59 < _len59; _key59++) {
        args[_key59] = arguments[_key59];
      }

      var line = get_line(args);
      return split_polygon(this.points, line.origin, line.vector).map(function (poly) {
        return Type(poly);
      });
    };

    var scale = function scale(magnitude) {
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
      for (var _len60 = arguments.length, args = new Array(_len60), _key60 = 0; _key60 < _len60; _key60++) {
        args[_key60] = arguments[_key60];
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
      for (var _len61 = arguments.length, args = new Array(_len61), _key61 = 0; _key61 < _len61; _key61++) {
        args[_key61] = arguments[_key61];
      }

      var m = get_matrix2(args);
      var newPoints = this.points.map(function (p) {
        return Vector(multiply_matrix2_vector2(m, p));
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
    Object.defineProperty(proto, "clipSegment", {
      value: clipSegment
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
        return sectors.call(this);
      }
    });
    Object.defineProperty(proto, "signedArea", {
      value: area
    });
    return Object.freeze(proto);
  }

  var Polygon = function Polygon() {
    for (var _len62 = arguments.length, args = new Array(_len62), _key62 = 0; _key62 < _len62; _key62++) {
      args[_key62] = arguments[_key62];
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
      return Segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]);
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
    for (var _len63 = arguments.length, args = new Array(_len63), _key63 = 0; _key63 < _len63; _key63++) {
      args[_key63] = arguments[_key63];
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
      return Segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]);
    });
    var proto = Prototype$1.bind(this);
    var polygon = Object.create(proto(ConvexPolygon));

    var split = function split() {
      for (var _len64 = arguments.length, innerArgs = new Array(_len64), _key64 = 0; _key64 < _len64; _key64++) {
        innerArgs[_key64] = arguments[_key64];
      }

      var line = get_line(innerArgs);
      return split_convex_polygon(points, line.origin, line.vector).map(function (poly) {
        return ConvexPolygon(poly);
      });
    };

    var overlaps = function overlaps() {
      for (var _len65 = arguments.length, innerArgs = new Array(_len65), _key65 = 0; _key65 < _len65; _key65++) {
        innerArgs[_key65] = arguments[_key65];
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
    var origin;
    var width;
    var height;

    for (var _len66 = arguments.length, args = new Array(_len66), _key66 = 0; _key66 < _len66; _key66++) {
      args[_key66] = arguments[_key66];
    }

    var params = Array.from(args);
    var numbers = params.filter(function (param) {
      return !isNaN(param);
    });
    var arrays = params.filter(function (param) {
      return param.constructor === Array;
    });

    if (numbers.length === 4) {
      origin = Vector(numbers.slice(0, 2));

      var _numbers2 = _slicedToArray(numbers, 4);

      width = _numbers2[2];
      height = _numbers2[3];
    }

    if (arrays.length === 1) {
      arrays = arrays[0];
    }

    if (arrays.length === 2) {
      if (typeof arrays[0][0] === "number") {
        origin = Vector(arrays[0].slice());
        width = arrays[1][0];
        height = arrays[1][1];
      }
    }

    var points = [[origin[0], origin[1]], [origin[0] + width, origin[1]], [origin[0] + width, origin[1] + height], [origin[0], origin[1] + height]];
    var proto = Prototype$1.bind(this);
    var rect = Object.create(proto(Rectangle));

    var scale = function scale(magnitude, center_point) {
      var center = center_point != null ? center_point : [origin[0] + width, origin[1] + height];
      var x = origin[0] + (center[0] - origin[0]) * (1 - magnitude);
      var y = origin[1] + (center[1] - origin[1]) * (1 - magnitude);
      return Rectangle(x, y, width * magnitude, height * magnitude);
    };

    var rotate = function rotate() {
      var _ConvexPolygon;

      return (_ConvexPolygon = ConvexPolygon(points)).rotate.apply(_ConvexPolygon, arguments);
    };

    var transform = function transform() {
      for (var _len67 = arguments.length, innerArgs = new Array(_len67), _key67 = 0; _key67 < _len67; _key67++) {
        innerArgs[_key67] = arguments[_key67];
      }

      return ConvexPolygon(points).transform(innerArgs);
    };

    Object.defineProperty(rect, "points", {
      get: function get() {
        return points;
      }
    });
    Object.defineProperty(rect, "origin", {
      get: function get() {
        return origin;
      }
    });
    Object.defineProperty(rect, "width", {
      get: function get() {
        return width;
      }
    });
    Object.defineProperty(rect, "height", {
      get: function get() {
        return height;
      }
    });
    Object.defineProperty(rect, "area", {
      get: function get() {
        return width * height;
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
    for (var _len68 = arguments.length, args = new Array(_len68), _key68 = 0; _key68 < _len68; _key68++) {
      args[_key68] = arguments[_key68];
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

    return {
      sectors: sectors,
      angles: angles,

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
  Object.assign(core, algebra, matrix2_core, matrix3_core, geometry, query, equal);
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
  var math = {
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
    core: core
  };

  var file_spec = 1.1;
  var file_creator = "Rabbit Ear";
  var future_spec = {
    FACES_MATRIX: "faces_re:matrix",
    FACES_LAYER: "faces_re:layer",
    SECTORS_VERTICES: "re:sectors_vertices",
    SECTORS_EDGES: "re:sectors_edges",
    SECTORS_ANGLES: "re:sectors_angles",
    VERTICES_SECTORS_VERTICES: "vertices_re:sectors_vertices"
  };
  var fold_keys = {
    file: ["file_spec", "file_creator", "file_author", "file_title", "file_description", "file_classes", "file_frames"],
    frame: ["frame_author", "frame_title", "frame_description", "frame_attributes", "frame_classes", "frame_unit", "frame_parent", "frame_inherit"],
    graph: ["vertices_coords", "vertices_vertices", "vertices_faces", "edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length", "faces_vertices", "faces_edges", "vertices_edges", "edges_edges", "faces_faces"],
    orders: ["edgeOrders", "faceOrders"]
  };
  var file_classes = ["singleModel", "multiModel", "animation", "diagrams"];
  var frame_classes = ["creasePattern", "foldedForm", "graph", "linkage"];
  var frame_attributes = ["2D", "3D", "abstract", "manifold", "nonManifold", "orientable", "nonOrientable", "selfTouching", "nonSelfTouching", "selfIntersecting", "nonSelfIntersecting"];
  var keys = Object.freeze([].concat(fold_keys.file).concat(fold_keys.frame).concat(fold_keys.graph).concat(fold_keys.orders));
  var edges_assignment_values = ["B", "b", "M", "m", "V", "v", "F", "f", "U", "u"];
  var edges_assignment_names = {
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
  var assignment_angles = {
    M: -180,
    m: -180,
    V: 180,
    v: 180
  };
  var FOLDED_FORM = "foldedForm";
  var CREASE_PATTERN = "creasePattern";
  var edge_assignment_to_foldAngle = function edge_assignment_to_foldAngle(assignment) {
    return assignment_angles[assignment] || 0;
  };
  var get_geometry_keys_with_prefix = function get_geometry_keys_with_prefix(graph, key) {
    var prefix = "".concat(key, "_");
    return Object.keys(graph).map(function (str) {
      return str.substring(0, prefix.length) === prefix ? str : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
  };
  var get_geometry_keys_with_suffix = function get_geometry_keys_with_suffix(graph, key) {
    var suffix = "_".concat(key);
    return Object.keys(graph).map(function (s) {
      return s.substring(s.length - suffix.length, s.length) === suffix ? s : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
  };
  var get_keys_with_ending = function get_keys_with_ending(graph, string) {
    return Object.keys(graph).map(function (s) {
      return s.substring(s.length - string.length, s.length) === string ? s : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
  };
  var transpose_geometry_arrays = function transpose_geometry_arrays(graph, geometry_key) {
    var matching_keys = get_geometry_keys_with_prefix(graph, geometry_key);

    if (matching_keys.length === 0) {
      return [];
    }

    var len = Math.max.apply(Math, _toConsumableArray(matching_keys.map(function (arr) {
      return graph[arr].length;
    })));
    var geometry = Array.from(Array(len)).map(function () {
      return {};
    });
    matching_keys.map(function (k) {
      return {
        "long": k,
        "short": k.substring(geometry_key.length + 1)
      };
    }).forEach(function (key) {
      return geometry.forEach(function (o, i) {
        geometry[i][key["short"]] = graph[key["long"]][i];
      });
    });
    return geometry;
  };
  var transpose_geometry_array_at_index = function transpose_geometry_array_at_index(graph, geometry_key, index) {
    var matching_keys = get_geometry_keys_with_prefix(graph, geometry_key);

    if (matching_keys.length === 0) {
      return [];
    }

    var geometry = {};
    matching_keys.map(function (k) {
      return {
        "long": k,
        "short": k.substring(geometry_key.length + 1)
      };
    }).forEach(function (key) {
      geometry[key["short"]] = graph[key["long"]][index];
    });
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
    get_geometry_keys_with_prefix: get_geometry_keys_with_prefix,
    get_geometry_keys_with_suffix: get_geometry_keys_with_suffix,
    get_keys_with_ending: get_keys_with_ending,
    transpose_geometry_arrays: transpose_geometry_arrays,
    transpose_geometry_array_at_index: transpose_geometry_array_at_index
  });

  var arrayOfType = function arrayOfType(array) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "number";
    var test = true;
    array.forEach(function (a) {
      if (_typeof(a) !== type) {
        test = false;
        return;
      }
    });
    return test;
  };
  var arrayOfArrayOfType = function arrayOfArrayOfType(array) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "number";
    var test = true;
    array.forEach(function (arr) {
      arr.forEach(function (a) {
        if (_typeof(a) !== type) {
          test = false;
          return;
        }
      });
    });
    return test;
  };

  var arrayOfArrayOfIsNotNaN = function arrayOfArrayOfIsNotNaN(array) {
    return array.map(function (arr) {
      return arr.map(function (n) {
        return !isNaN(n);
      }).reduce(function (a, b) {
        return a && b;
      }, true);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };

  var arrayOfArrayCompareFunc = function arrayOfArrayCompareFunc(array, func) {
    return array.map(function (arr) {
      return arr.map(function (n) {
        return func(n);
      }).reduce(function (a, b) {
        return a && b;
      }, true);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };

  var Validate = {};

  Validate.vertices_coords = function (_ref) {
    var vertices_coords = _ref.vertices_coords;
    return vertices_coords != null && arrayOfArrayOfType(vertices_coords, "number") && arrayOfArrayOfIsNotNaN(vertices_coords);
  };

  Validate.vertices_vertices = function (_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        vertices_vertices = _ref2.vertices_vertices,
        edges_vertices = _ref2.edges_vertices;

    if (vertices_vertices == null) {
      return false;
    }

    var vert_vert_count = vertices_vertices.map(function (a) {
      return a.length;
    }).reduce(function (a, b) {
      return a + b;
    }, 0);

    if (Math.abs(vert_vert_count * 1 - edges_vertices.length * 2) > 1) {
      console.warn("Validate.vertices_vertices, expected array length deviated by more than 1");
    }

    if (vertices_vertices != null) {
      if (vertices_vertices.length !== vertices_coords.length) {
        return false;
      }

      var vv_edge_test = vertices_vertices.map(function (vv, i) {
        return vv.map(function (v2) {
          return [i, v2];
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
      return vv_edge_test.map(function (ve) {
        return edges_vertices.filter(function (e) {
          return ve[0] === e[0] && ve[1] === e[1] || ve[0] === e[1] && ve[1] === e[0];
        }).length > 0;
      }).map(function (b, i) {
        return {
          test: b,
          i: i
        };
      }).filter(function (el) {
        return !el.test;
      }).length === 0;
    }

    return false;
  };

  Validate.vertices_faces = function (_ref3) {
    var vertices_faces = _ref3.vertices_faces,
        faces_vertices = _ref3.faces_vertices;
    return faces_vertices != null && vertices_faces != null && vertices_faces.map(function (vert, i) {
      return vert.map(function (vf) {
        return {
          test: faces_vertices[vf].indexOf(i) !== -1,
          face: vf,
          i: i
        };
      }).filter(function (el) {
        return !el.test;
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []).length === 0;
  };

  Validate.edges_vertices = function (_ref4) {
    var vertices_coords = _ref4.vertices_coords,
        edges_vertices = _ref4.edges_vertices;

    if (vertices_coords == null) {
      return true;
    }

    var vert_size = vertices_coords.length;
    return edges_vertices != null && arrayOfArrayOfType(edges_vertices, "number") && arrayOfArrayOfIsNotNaN(edges_vertices) && arrayOfArrayCompareFunc(edges_vertices, function (n) {
      return n < vert_size;
    });
  };

  Validate.edges_faces = function (_ref5) {
    var edges_faces = _ref5.edges_faces,
        faces_edges = _ref5.faces_edges;
    return false;
  };

  Validate.faces_faces = function (graph) {
    return false;
  };

  Validate.vertices_edges = function (graph) {
    return false;
  };

  Validate.edges_assignment = function (_ref6) {
    var edges_vertices = _ref6.edges_vertices,
        edges_assignment = _ref6.edges_assignment;
    return edges_vertices != null && edges_assignment != null && edges_assignment.length === edges_vertices.length && edges_assignment.filter(function (v) {
      return edges_assignment_values.includes(v);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };

  Validate.edges_foldAngle = function (graph) {
    return false;
  };

  Validate.edges_length = function (graph) {
    return false;
  };

  Validate.faces_vertices = function (_ref7) {
    var vertices_faces = _ref7.vertices_faces,
        faces_vertices = _ref7.faces_vertices;

    if (vertices_faces != null) {
      return faces_vertices.map(function (face, i) {
        return face.map(function (vf) {
          return {
            test: vertices_faces[vf].indexOf(i) !== -1,
            face: vf,
            i: i
          };
        }).filter(function (el) {
          return !el.test;
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []).length === 0;
    }

    return false;
  };

  Validate.faces_edges = function (graph) {
    return false;
  };

  var possibleFoldObject = function possibleFoldObject(input) {
    if (_typeof(input) !== "object" || input === null) {
      return 0;
    }

    var inputKeys = Object.keys(input);

    if (inputKeys.length === 0) {
      return 0;
    }

    return inputKeys.map(function (key) {
      return keys.includes(key);
    }).reduce(function (a, b) {
      return a + (b ? 1 : 0);
    }, 0) / inputKeys.length;
  };
  var validate_first = function validate_first(graph) {
    var prefix_suffix = {
      vertices: ["coords", "vertices", "faces"],
      edges: ["vertices", "faces", "assignment", "foldAngle", "length"],
      faces: ["vertices", "edges"]
    };
    ["vertices_coords", "vertices_vertices", "vertices_faces", "edges_vertices", "edges_faces", "faces_vertices", "faces_edges"].filter(function (a) {
      return a in graph;
    }).forEach(function (key) {
      if (graph[key].map(function (a) {
        return a.filter(function (b) {
          return b == null;
        }).length > 0;
      }).reduce(function (a, b) {
        return a || b;
      }, false)) {
        throw new Error("".concat(key, " contains a null"));
      }
    });
    ["edges_assignment", "edges_foldAngle", "edges_length"].filter(function (a) {
      return a in graph;
    }).forEach(function (key) {
      if (graph[key].filter(function (a) {
        return a == null;
      }).length > 0) {
        throw new Error("".concat(key, " contains a null"));
      }
    });
    var arraysLengthTest = Object.keys(prefix_suffix).map(function (key) {
      return {
        prefix: key,
        suffixes: prefix_suffix[key]
      };
    }).map(function (el) {
      return el.suffixes.map(function (suffix) {
        return "".concat(el.prefix, "_").concat(suffix);
      }).filter(function (key) {
        return graph[key] != null;
      }).map(function (key, _, arr) {
        return graph[key].length === graph[arr[0]].length;
      }).reduce(function (a, b) {
        return a && b;
      }, true);
    }).reduce(function (a, b) {
      return a && b;
    }, true);

    if (!arraysLengthTest) {
      throw new Error("validate failed: arrays with common keys have mismatching lengths");
    }

    var l = {
      vertices: graph.vertices_coords.length,
      edges: graph.edges_vertices.length,
      faces: graph.faces_vertices.length || graph.faces_edges.length
    };
    var arraysIndexTest = Object.keys(prefix_suffix).map(function (key) {
      return {
        prefix: key,
        suffixes: prefix_suffix[key]
      };
    }).map(function (el) {
      return el.suffixes.map(function (suffix) {
        return {
          key: "".concat(el.prefix, "_").concat(suffix),
          suffix: suffix
        };
      }).filter(function (ell) {
        return graph[ell.key] != null && l[ell.suffix] != null;
      }).map(function (ell) {
        return {
          key: ell.key,
          test: graph[ell.key].reduce(function (prev, curr) {
            return curr.reduce(function (a, b) {
              return a && b < l[ell.suffix];
            }, true);
          }, true)
        };
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    arraysIndexTest.filter(function (el) {
      return !el.test;
    }).forEach(function (el) {
      console.log(graph);
      throw new Error("".concat(el.key, " contains a index too large, larger than the reference array to which it points"));
    });

    if ("vertices_vertices" in graph) {
      var vv_edge_test = graph.vertices_vertices.map(function (vv, i) {
        return vv.map(function (v2) {
          return [i, v2];
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
      var ev_test_fails = vv_edge_test.map(function (ve) {
        return graph.edges_vertices.filter(function (e) {
          return ve[0] === e[0] && ve[1] === e[1] || ve[0] === e[1] && ve[1] === e[0];
        }).length > 0;
      }).map(function (b, i) {
        return {
          test: b,
          i: i
        };
      }).filter(function (el) {
        return !el.test;
      });

      if (ev_test_fails.length > 0) {
        throw new Error("vertices_vertices at index ".concat(ev_test_fails[0].i, " declares an edge that doesn't exist in edges_vertices"));
      }
    }

    if ("vertices_faces" in graph) {
      var v_f_test = graph.vertices_faces.map(function (vert, i) {
        return vert.map(function (vf) {
          return {
            test: graph.faces_vertices[vf].indexOf(i) !== -1,
            face: vf,
            i: i
          };
        }).filter(function (el) {
          return !el.test;
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);

      if (v_f_test.length > 0) {
        throw new Error("vertex ".concat(v_f_test[0].i, " in vertices_faces connects to face ").concat(v_f_test[0].face, ", whereas in faces_vertices this same connection in reverse doesn't exist."));
      }
    }

    if ("edges_faces" in graph) {
      var e_f_test = graph.edges_faces.map(function (edge, i) {
        return edge.map(function (ef) {
          return {
            test: graph.faces_edges[ef].indexOf(i) !== -1,
            face: ef,
            i: i
          };
        }).filter(function (el) {
          return !el.test;
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);

      if (e_f_test.length > 0) {
        throw new Error("edges_faces ".concat(e_f_test[0].i, " connects to face ").concat(e_f_test[0].face, ", whereas in faces_edges this same connection in reverse doesn't exist."));
      }
    }

    if ("faces_vertices" in graph && "vertices_faces" in graph) {
      var f_v_test = graph.faces_vertices.map(function (face, i) {
        return face.map(function (vf) {
          return {
            test: graph.vertices_faces[vf].indexOf(i) !== -1,
            face: vf,
            i: i
          };
        }).filter(function (el) {
          return !el.test;
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
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

  var htmlString = "<!DOCTYPE html><title> </title>";

  var win = function () {
    var w = {};

    if (isNode) {
      var _require = require("xmldom"),
          DOMParser = _require.DOMParser,
          XMLSerializer = _require.XMLSerializer;

      w.DOMParser = DOMParser;
      w.XMLSerializer = XMLSerializer;
      w.document = new DOMParser().parseFromString(htmlString, "text/html");
    } else if (isBrowser) {
      w = window;
    }

    return w;
  }();

  var possibleFileName = function possibleFileName(string) {
    return string.length < 128 && string.indexOf(".") !== -1;
  };

  var possibleSVG = function possibleSVG(xml) {
    return xml.tagName === "svg" || xml.getElementsByTagName("svg").length > 0;
  };

  var possibleORIPA = function possibleORIPA(xml) {
    var objects = xml.getElementsByTagName("object");

    if (objects.length > 0) {
      return Array.from(objects).filter(function (o) {
        return o.className === "oripa.DataSet";
      }).length > 0;
    }

    return false;
  };

  var supported = {
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

  var load = function load() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length <= 0) {
      throw new Error("convert(), load(), missing a file as a parameter");
    }

    var data = args[0];
    var filetype;

    if (args.length >= 2 && typeof args[1] === "string") {
      filetype = supported[args[1]];

      if (filetype === undefined) {
        throw new Error("expected a file type (like 'svg'), ".concat(args[1], " is unsupported"));
      }
    }

    if (filetype !== undefined) {
      if (typeof data === "string") {
        switch (filetype) {
          case "fold":
            return {
              data: JSON.parse(data),
              type: filetype
            };

          case "svg":
          case "oripa":
            return {
              data: new win.DOMParser().parseFromString(data, "text/xml").documentElement,
              type: filetype
            };

          default:
            return {
              data: data,
              type: filetype
            };
        }
      } else {
        return {
          data: data,
          type: filetype
        };
      }
    }

    var datatype = _typeof(data);

    if (datatype === "string") {
      try {
        var fold = JSON.parse(data);

        if (possibleFoldObject(fold) > 0) {
          return {
            data: fold,
            type: "fold"
          };
        }
      } catch (err) {
        var xml = new win.DOMParser().parseFromString(data, "text/xml").documentElement;

        if (xml.getElementsByTagName("parsererror").length > 0) {
          if (possibleFileName(data)) {
            throw new Error("did you provide a file name? please load the file first and pass in the data.");
          } else {
            throw new Error("unable to load file. tried XML, JSON");
          }
        } else {
          if (possibleSVG(xml)) {
            return {
              data: xml,
              type: "svg"
            };
          }

          if (possibleORIPA(xml)) {
            return {
              data: xml,
              type: "oripa"
            };
          }

          return undefined;
        }
      }

      return undefined;
    }

    if (datatype === "object") {
      try {
        var _fold = JSON.parse(JSON.stringify(data));

        return {
          data: _fold,
          type: "fold"
        };
      } catch (err) {
        if (typeof data.getElementsByTagName === "function") {
          if (possibleSVG(data)) {
            return {
              data: data,
              type: "svg"
            };
          }

          if (possibleORIPA(data)) {
            return {
              data: data,
              type: "oripa"
            };
          }

          return undefined;
        }

        return undefined;
      }
    }

    return undefined;
  };

  var coords = "coords";
  var vertices = "vertices";
  var edges = "edges";
  var faces = "faces";
  var boundaries = "boundaries";
  var frame = "frame";
  var file = "file";
  var vertices_coords = "".concat(vertices, "_").concat(coords);
  var edges_vertices = "".concat(edges, "_").concat(vertices);
  var faces_vertices = "".concat(faces, "_").concat(vertices);
  var faces_edges = "".concat(faces, "_").concat(edges);
  var edges_assignment = "".concat(edges, "_assignment");
  var faces_re_coloring = "".concat(faces, "_re:coloring");
  var faces_re_matrix = "".concat(faces, "_re:matrix");
  var faces_re_layer = "".concat(faces, "_re:layer");
  var frame_parent = "".concat(frame, "_parent");
  var frame_inherit = "".concat(frame, "_inherit");
  var frame_classes$1 = "".concat(frame, "_classes");
  var file_frames = "".concat(file, "_frames");
  var file_classes$1 = "".concat(file, "_classes");
  var boundary = "boundary";
  var mountain = "mountain";
  var valley = "valley";
  var mark = "mark";
  var unassigned = "unassigned";
  var creasePattern = "creasePattern";
  var front = "front";
  var back = "back";
  var _class = "class";
  var index = "index";
  var object = "object";
  var string = "string";
  var _function = "function";
  var _undefined = "undefined";
  var black = "black";
  var white = "white";
  var lightgray = "lightgray";
  var stroke_width = "stroke-width";
  var createElementNS = "createElementNS";
  var setAttributeNS = "setAttributeNS";
  var appendChild = "appendChild";

  var isBrowser$1 = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== _undefined && _typeof(window.document) !== _undefined;

  var isNode$1 = (typeof process === "undefined" ? "undefined" : _typeof(process)) !== _undefined && process.versions != null && process.versions.node != null;
  var htmlString$1 = "<!DOCTYPE html><title>.</title>";

  var win$1 = function () {
    var w = {};

    if (isNode$1) {
      var _require = require("xmldom"),
          DOMParser = _require.DOMParser,
          XMLSerializer = _require.XMLSerializer;

      w.DOMParser = DOMParser;
      w.XMLSerializer = XMLSerializer;
      w.document = new DOMParser().parseFromString(htmlString$1, "text/html");
    } else if (isBrowser$1) {
      w = window;
    }

    return w;
  }();

  var svgNS = "http://www.w3.org/2000/svg";

  var svg = function svg() {
    var svgImage = win$1.document[createElementNS](svgNS, "svg");
    svgImage.setAttribute("version", "1.1");
    svgImage.setAttribute("xmlns", svgNS);
    return svgImage;
  };

  var group = function group(parent) {
    var g = win$1.document[createElementNS](svgNS, "g");

    if (parent) {
      parent[appendChild](g);
    }

    return g;
  };

  var defs = function defs(parent) {
    var defs = win$1.document[createElementNS](svgNS, "defs");

    if (parent) {
      parent[appendChild](defs);
    }

    return defs;
  };

  var style = function style(parent) {
    var s = win$1.document[createElementNS](svgNS, "style");
    s[setAttributeNS](null, "type", "text/css");

    if (parent) {
      parent[appendChild](s);
    }

    return s;
  };

  var setViewBox = function setViewBox(svg, x, y, width, height) {
    var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var scale = 1.0;
    var d = width / scale - width;
    var X = x - d - padding;
    var Y = y - d - padding;
    var W = width + d * 2 + padding * 2;
    var H = height + d * 2 + padding * 2;
    var viewBoxString = [X, Y, W, H].join(" ");
    svg[setAttributeNS](null, "viewBox", viewBoxString);
  };

  var line = function line(x1, y1, x2, y2) {
    var shape = win$1.document[createElementNS](svgNS, "line");
    shape[setAttributeNS](null, "x1", x1);
    shape[setAttributeNS](null, "y1", y1);
    shape[setAttributeNS](null, "x2", x2);
    shape[setAttributeNS](null, "y2", y2);
    return shape;
  };

  var circle = function circle(x, y, radius) {
    var shape = win$1.document[createElementNS](svgNS, "circle");
    shape[setAttributeNS](null, "cx", x);
    shape[setAttributeNS](null, "cy", y);
    shape[setAttributeNS](null, "r", radius);
    return shape;
  };

  var polygon = function polygon(pointsArray) {
    var shape = win$1.document[createElementNS](svgNS, "polygon");
    var pointsString = pointsArray.map(function (p) {
      return "".concat(p[0], ",").concat(p[1]);
    }).join(" ");
    shape[setAttributeNS](null, "points", pointsString);
    return shape;
  };

  var path = function path(d) {
    var p = win$1.document[createElementNS](svgNS, "path");
    p[setAttributeNS](null, "d", d);
    return p;
  };

  var vertices_circle = function vertices_circle(graph, options) {
    if (vertices_coords in graph === false) {
      return [];
    }

    var radius = options && options.radius ? options.radius : 0.01;
    var svg_vertices = graph[vertices_coords].map(function (v) {
      return circle(v[0], v[1], radius);
    });
    svg_vertices.forEach(function (c, i) {
      return c[setAttributeNS](null, index, i);
    });
    return svg_vertices;
  };

  var edges_assignment_names$1 = {
    B: boundary,
    b: boundary,
    M: mountain,
    m: mountain,
    V: valley,
    v: valley,
    F: mark,
    f: mark,
    U: unassigned,
    u: unassigned
  };
  var edges_assignment_to_lowercase = {
    B: "b",
    b: "b",
    M: "m",
    m: "m",
    V: "v",
    v: "v",
    F: "f",
    f: "f",
    U: "u",
    u: "u"
  };

  var edges_coords = function edges_coords(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices;

    if (edges_vertices == null || vertices_coords == null) {
      return [];
    }

    return edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    });
  };

  var edges_indices_classes = function edges_indices_classes(graph) {
    var assignment_indices = {
      u: [],
      f: [],
      v: [],
      m: [],
      b: []
    };
    graph[edges_assignment].map(function (a) {
      return edges_assignment_to_lowercase[a];
    }).forEach(function (a, i) {
      return assignment_indices[a].push(i);
    });
    return assignment_indices;
  };

  var make_edges_assignment_names = function make_edges_assignment_names(graph) {
    return graph[edges_vertices] == null || graph[edges_assignment] == null || graph[edges_vertices].length !== graph[edges_assignment].length ? [] : graph[edges_assignment].map(function (a) {
      return edges_assignment_names$1[a];
    });
  };

  var segment_to_path = function segment_to_path(s) {
    return "M".concat(s[0][0], " ").concat(s[0][1], "L").concat(s[1][0], " ").concat(s[1][1]);
  };

  var edges_path_data = function edges_path_data(graph) {
    var path_data = edges_coords(graph).map(function (segment) {
      return segment_to_path(segment);
    }).join("");
    return path_data === "" ? undefined : path_data;
  };

  var edges_by_assignment_paths_data = function edges_by_assignment_paths_data(graph) {
    if (graph[edges_vertices] == null || graph[vertices_coords] == null || graph[edges_assignment] == null) {
      return [];
    }

    var segments = edges_coords(graph);
    var assignment_sorted_edges = edges_indices_classes(graph);
    var paths = Object.keys(assignment_sorted_edges).map(function (assignment) {
      return assignment_sorted_edges[assignment].map(function (i) {
        return segments[i];
      });
    }).map(function (segments) {
      return segments.map(function (segment) {
        return segment_to_path(segment);
      }).join("");
    });
    var result = {};
    Object.keys(assignment_sorted_edges).map(function (key, i) {
      if (paths[i] !== "") {
        result[key] = paths[i];
      }
    });
    return result;
  };

  var edges_path = function edges_path(graph) {
    if (graph[edges_assignment] == null) {
      var d = edges_path_data(graph);
      return d === undefined ? [] : [path(d)];
    }

    var ds = edges_by_assignment_paths_data(graph);
    return Object.keys(ds).map(function (assignment) {
      var p = path(ds[assignment]);
      p[setAttributeNS](null, _class, edges_assignment_names$1[assignment]);
      return p;
    });
  };

  var edges_line = function edges_line(graph) {
    var lines = edges_coords(graph).map(function (e) {
      return line(e[0][0], e[0][1], e[1][0], e[1][1]);
    });
    lines.forEach(function (l, i) {
      return l[setAttributeNS](null, index, i);
    });
    make_edges_assignment_names(graph).forEach(function (a, i) {
      return lines[i][setAttributeNS](null, _class, a);
    });
    return lines;
  };

  var make_vertices_edges = function make_vertices_edges(_ref2) {
    var edges_vertices = _ref2.edges_vertices;

    if (!edges_vertices) {
      return undefined;
    }

    var vertices_edges = [];
    edges_vertices.forEach(function (ev, i) {
      return ev.forEach(function (v) {
        if (vertices_edges[v] === undefined) {
          vertices_edges[v] = [];
        }

        vertices_edges[v].push(i);
      });
    });
    return vertices_edges;
  };

  var make_faces_faces = function make_faces_faces(_ref3) {
    var faces_vertices = _ref3.faces_vertices;

    if (!faces_vertices) {
      return undefined;
    }

    var nf = faces_vertices.length;
    var faces_faces = Array.from(Array(nf)).map(function () {
      return [];
    });
    var edgeMap = {};
    faces_vertices.forEach(function (vertices_index, idx1) {
      if (vertices_index === undefined) {
        return;
      }

      var n = vertices_index.length;
      vertices_index.forEach(function (v1, i, vs) {
        var v2 = vs[(i + 1) % n];

        if (v2 < v1) {
          var _ref4 = [v2, v1];
          v1 = _ref4[0];
          v2 = _ref4[1];
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

  var make_vertex_pair_to_edge_map = function make_vertex_pair_to_edge_map(_ref5) {
    var edges_vertices = _ref5.edges_vertices;

    if (!edges_vertices) {
      return {};
    }

    var map = {};
    edges_vertices.map(function (ev) {
      return ev.sort(function (a, b) {
        return a - b;
      }).join(" ");
    }).forEach(function (key, i) {
      map[key] = i;
    });
    return map;
  };

  var make_face_walk_tree = function make_face_walk_tree(graph) {
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var edge_map = make_vertex_pair_to_edge_map(graph);
    var new_faces_faces = make_faces_faces(graph);

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

  var make_faces_coloring_from_faces_matrix = function make_faces_coloring_from_faces_matrix(faces_matrix) {
    return faces_matrix.map(function (m) {
      return m[0] * m[3] - m[1] * m[2];
    }).map(function (c) {
      return c >= 0;
    });
  };

  var make_faces_coloring = function make_faces_coloring(graph) {
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var coloring = [];
    coloring[root_face] = true;
    make_face_walk_tree(graph, root_face).forEach(function (level, i) {
      return level.forEach(function (entry) {
        coloring[entry.face] = i % 2 === 0;
      });
    });
    return coloring;
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
    var coloring = graph[faces_re_coloring];

    if (coloring == null) {
      coloring = faces_re_matrix in graph ? make_faces_coloring_from_faces_matrix(graph[faces_re_matrix]) : make_faces_coloring(graph, 0);
    }

    return coloring.map(function (c) {
      return c ? front : back;
    });
  };

  var finalize_faces = function finalize_faces(graph, svg_faces) {
    var isFoldedForm = _typeof(graph.frame_classes) === object && graph.frame_classes !== null && !graph.frame_classes.includes(creasePattern);
    var orderIsCertain = graph[faces_re_layer] != null && graph[faces_re_layer].length === graph[faces_vertices].length;

    if (orderIsCertain && isFoldedForm) {
      make_faces_sidedness(graph).forEach(function (side, i) {
        return svg_faces[i][setAttributeNS](null, _class, side);
      });
    }

    return orderIsCertain ? faces_sorted_by_layer(graph[faces_re_layer]).map(function (i) {
      return svg_faces[i];
    }) : svg_faces;
  };

  var faces_vertices_polygon = function faces_vertices_polygon(graph) {
    if (faces_vertices in graph === false || vertices_coords in graph === false) {
      return [];
    }

    var svg_faces = graph[faces_vertices].map(function (fv) {
      return fv.map(function (v) {
        return graph[vertices_coords][v];
      });
    }).map(function (face) {
      return polygon(face);
    });
    svg_faces.forEach(function (face, i) {
      return face[setAttributeNS](null, index, i);
    });
    return finalize_faces(graph, svg_faces);
  };

  var faces_edges_polygon = function faces_edges_polygon(graph) {
    if (faces_edges in graph === false || edges_vertices in graph === false || vertices_coords in graph === false) {
      return [];
    }

    var svg_faces = graph[faces_edges].map(function (face_edges) {
      return face_edges.map(function (edge) {
        return graph[edges_vertices][edge];
      }).map(function (vi, i, arr) {
        var next = arr[(i + 1) % arr.length];
        return vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1];
      }).map(function (v) {
        return graph[vertices_coords][v];
      });
    }).map(function (face) {
      return polygon(face);
    });
    svg_faces.forEach(function (face, i) {
      return face[setAttributeNS](null, index, i);
    });
    return finalize_faces(graph, svg_faces);
  };

  function vkXML(text, step) {
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

  var bounding_rect = function bounding_rect(graph) {
    if (graph[vertices_coords] == null || graph[vertices_coords].length <= 0) {
      return [0, 0, 0, 0];
    }

    var dimension = graph[vertices_coords][0].length;
    var min = Array(dimension).fill(Infinity);
    var max = Array(dimension).fill(-Infinity);
    graph[vertices_coords].forEach(function (v) {
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

  var get_boundary = function get_boundary(graph) {
    if (graph[edges_assignment] == null) {
      return {
        vertices: [],
        edges: []
      };
    }

    var edges_vertices_b = graph[edges_assignment].map(function (a) {
      return a === "B" || a === "b";
    });
    var vertices_edges = make_vertices_edges(graph);
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
    vertex_walk.push(graph[edges_vertices][edgeIndex][0]);
    var nextVertex = graph[edges_vertices][edgeIndex][1];

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

      if (graph[edges_vertices][edgeIndex][0] === nextVertex) {
        var _graph$edges_vertices = _slicedToArray(graph[edges_vertices][edgeIndex], 2);

        nextVertex = _graph$edges_vertices[1];
      } else {
        var _graph$edges_vertices2 = _slicedToArray(graph[edges_vertices][edgeIndex], 1);

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

  var clone = function clone(o) {
    var newO;
    var i;

    if (_typeof(o) !== object) {
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

  var recursive_freeze = function recursive_freeze(input) {
    Object.freeze(input);

    if (input === undefined) {
      return input;
    }

    Object.getOwnPropertyNames(input).filter(function (prop) {
      return input[prop] !== null && (_typeof(input[prop]) === object || _typeof(input[prop]) === _function) && !Object.isFrozen(input[prop]);
    }).forEach(function (prop) {
      return recursive_freeze(input[prop]);
    });
    return input;
  };

  var flatten_frame = function flatten_frame(fold_file, frame_num) {
    if (file_frames in fold_file === false || fold_file[file_frames].length < frame_num) {
      return fold_file;
    }

    var dontCopy = [frame_parent, frame_inherit];
    var memo = {
      visited_frames: []
    };

    var recurse = function recurse(recurse_fold, frame, orderArray) {
      if (memo.visited_frames.indexOf(frame) !== -1) {
        throw new Error("flatten error:cycle");
      }

      memo.visited_frames.push(frame);
      orderArray = [frame].concat(orderArray);

      if (frame === 0) {
        return orderArray;
      }

      if (recurse_fold[file_frames][frame - 1].frame_inherit && recurse_fold[file_frames][frame - 1].frame_parent != null) {
        return recurse(recurse_fold, recurse_fold[file_frames][frame - 1].frame_parent, orderArray);
      }

      return orderArray;
    };

    return recurse(fold_file, frame_num, []).map(function (frame) {
      if (frame === 0) {
        var swap = fold_file[file_frames];
        fold_file[file_frames] = null;
        var copy = clone(fold_file);
        fold_file[file_frames] = swap;
        delete copy[file_frames];
        dontCopy.forEach(function (key) {
          return delete copy[key];
        });
        return copy;
      }

      var outerCopy = clone(fold_file[file_frames][frame - 1]);
      dontCopy.forEach(function (key) {
        return delete outerCopy[key];
      });
      return outerCopy;
    }).reduce(function (prev, curr) {
      return Object.assign(prev, curr);
    }, {});
  };

  var all_classes = function all_classes(graph) {
    var file_classes$1$1 = (graph[file_classes$1] != null ? graph[file_classes$1] : []).join(" ");
    var frame_classes$1$1 = (graph[frame_classes$1] != null ? graph[frame_classes$1] : []).join(" ");
    return [file_classes$1$1, frame_classes$1$1].filter(function (s) {
      return s !== "";
    }).join(" ");
  };

  var document = win$1.document;
  var shadow_defaults = Object.freeze({
    blur: 0.005,
    opacity: 0.3,
    color: black
  });
  var result = "result";
  var _in = "in";
  var blur = "blur";
  var offsetColor = "offsetColor";
  var offsetBlur = "offsetBlur";
  var feMergeNode = "feMergeNode";
  var two_hundred = "200%";

  var shadowFilter = function shadowFilter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : shadow_defaults;
    var id_name = "shadow";

    if (_typeof(options) !== object || options === null) {
      options = {};
    }

    Object.keys(shadow_defaults).filter(function (key) {
      return !(key in options);
    }).forEach(function (key) {
      options[key] = shadow_defaults[key];
    });
    var filter = document[createElementNS](svgNS, "filter");
    filter[setAttributeNS](null, "width", two_hundred);
    filter[setAttributeNS](null, "height", two_hundred);
    filter[setAttributeNS](null, "id", id_name);
    var gaussian = document[createElementNS](svgNS, "feGaussianBlur");
    gaussian[setAttributeNS](null, _in, "SourceAlpha");
    gaussian[setAttributeNS](null, "stdDeviation", options.blur);
    gaussian[setAttributeNS](null, result, blur);
    var offset = document[createElementNS](svgNS, "feOffset");
    offset[setAttributeNS](null, _in, blur);
    offset[setAttributeNS](null, result, offsetBlur);
    var flood = document[createElementNS](svgNS, "feFlood");
    flood[setAttributeNS](null, "flood-color", options.color);
    flood[setAttributeNS](null, "flood-opacity", options.opacity);
    flood[setAttributeNS](null, result, offsetColor);
    var composite = document[createElementNS](svgNS, "feComposite");
    composite[setAttributeNS](null, _in, offsetColor);
    composite[setAttributeNS](null, "in2", offsetBlur);
    composite[setAttributeNS](null, "operator", _in);
    composite[setAttributeNS](null, result, offsetBlur);
    var merge = document[createElementNS](svgNS, "feMerge");
    var mergeNode1 = document[createElementNS](svgNS, feMergeNode);
    var mergeNode2 = document[createElementNS](svgNS, feMergeNode);
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

  var none = "none";
  var five_hundred_px = "500px";

  var Options = function Options() {
    var vmin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return recursive_freeze({
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
          "stroke-width": vmin / 200
        },
        boundaries: {
          fill: white
        },
        faces: {
          stroke: none,
          front: {
            stroke: black,
            fill: lightgray
          },
          back: {
            stroke: black,
            fill: white
          }
        },
        edges: {
          boundary: {},
          mountain: {
            stroke: "red"
          },
          valley: {
            stroke: "blue"
          },
          mark: {
            stroke: lightgray
          },
          unassigned: {
            stroke: lightgray
          }
        },
        vertices: {
          stroke: none,
          fill: black,
          r: vmin / 200
        }
      }
    });
  };

  var recursive_fill = function recursive_fill(target, source) {
    Object.keys(source).forEach(function (key) {
      if (_typeof(source[key]) === object && source[key] !== null) {
        if (!(key in target)) {
          target[key] = {};
        }

        recursive_fill(target[key], source[key]);
      } else if (_typeof(target) === object && !(key in target)) {
        target[key] = source[key];
      }
    });
  };

  var boundaries_polygon = function boundaries_polygon(graph) {
    if (vertices_coords in graph === false || edges_vertices in graph === false || edges_assignment in graph === false) {
      return [];
    }

    var boundary$1 = get_boundary(graph).vertices.map(function (v) {
      return graph[vertices_coords][v];
    });

    if (boundary$1.length === 0) {
      return [];
    }

    var p = polygon(boundary$1);
    p[setAttributeNS](null, _class, boundary);
    return [p];
  };

  var faces_draw_function = function faces_draw_function(graph) {
    return graph[faces_vertices] != null ? faces_vertices_polygon(graph) : faces_edges_polygon(graph);
  };

  var component_draw_function = {
    vertices: vertices_circle,
    edges: edges_path,
    faces: faces_draw_function,
    boundaries: boundaries_polygon
  };

  var fold_to_svg = function fold_to_svg(input) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var graph = typeof options.file_frame === "number" ? flatten_frame(input, options.file_frame) : input;
    var bounds = bounding_rect(graph);
    var vmin = Math.min(bounds[2], bounds[3]);
    recursive_fill(options, Options(vmin));
    var svg$1 = svg();
    setViewBox.apply(void 0, [svg$1].concat(_toConsumableArray(bounds), [options.padding]));
    var classValue = all_classes(graph);

    if (classValue !== "") {
      svg$1[setAttributeNS](null, _class, classValue);
    }

    Object.keys(options.attributes.svg).forEach(function (style) {
      return svg$1[setAttributeNS](null, style, options.attributes.svg[style]);
    });
    var defs$1 = options.stylesheet != null || options.shadows != null ? defs(svg$1) : undefined;

    if (options.stylesheet != null) {
      var style$1 = style(defs$1);
      var strokeVar = options.attributes.svg[stroke_width] ? options.attributes.svg[stroke_width] : vmin / 200;
      var cdata = new win$1.DOMParser().parseFromString("<xml></xml>", "application/xml").createCDATASection("\n* { --".concat(stroke_width, ": ").concat(strokeVar, "; }\n").concat(options.stylesheet));
      style$1[appendChild](cdata);
    }

    if (options.shadows != null) {
      var shadowOptions = _typeof(options.shadows) === object && options.shadows !== null ? options.shadows : {
        blur: vmin / 200
      };
      defs$1[appendChild](shadowFilter(shadowOptions));
    }

    var groups = {};
    [boundaries, edges, faces, vertices].filter(function (key) {
      return options[key] === true;
    }).forEach(function (key) {
      groups[key] = group();
      groups[key][setAttributeNS](null, _class, key);
    });
    Object.keys(groups).filter(function (key) {
      return component_draw_function[key] !== undefined;
    }).forEach(function (key) {
      return component_draw_function[key](graph, options).forEach(function (a) {
        return groups[key][appendChild](a);
      });
    });
    Object.keys(groups).filter(function (key) {
      return groups[key].childNodes.length > 0;
    }).forEach(function (key) {
      return svg$1[appendChild](groups[key]);
    });

    if (groups.edges) {
      var edgeClasses = [unassigned, mark, valley, mountain, boundary];
      Object.keys(options.attributes.edges).filter(function (key) {
        return !edgeClasses.includes(key);
      }).forEach(function (key) {
        return groups.edges[setAttributeNS](null, key, options.attributes.edges[key]);
      });
      Array.from(groups.edges.childNodes).forEach(function (child) {
        return Object.keys(options.attributes.edges[child.getAttribute(_class)] || {}).forEach(function (key) {
          return child[setAttributeNS](null, key, options.attributes.edges[child.getAttribute(_class)][key]);
        });
      });
    }

    if (groups.faces) {
      var faceClasses = [front, back];
      Object.keys(options.attributes.faces).filter(function (key) {
        return !faceClasses.includes(key);
      }).forEach(function (key) {
        return groups.faces[setAttributeNS](null, key, options.attributes.faces[key]);
      });
      Array.from(groups.faces.childNodes).forEach(function (child) {
        return Object.keys(options.attributes.faces[child.getAttribute(_class)] || {}).forEach(function (key) {
          return child[setAttributeNS](null, key, options.attributes.faces[child.getAttribute(_class)][key]);
        });
      });

      if (options.shadows != null) {
        Array.from(groups.faces.childNodes).forEach(function (f) {
          return f[setAttributeNS](null, "filter", "url(#shadow)");
        });
      }
    }

    if (groups.vertices) {
      Object.keys(options.attributes.vertices).filter(function (key) {
        return key !== "r";
      }).forEach(function (key) {
        return groups.vertices[setAttributeNS](null, key, options.attributes.vertices[key]);
      });
      Array.from(groups.vertices.childNodes).forEach(function (child) {
        return child[setAttributeNS](null, "r", options.attributes.vertices.r);
      });
    }

    if (groups.boundaries) {
      Object.keys(options.attributes.boundaries).forEach(function (key) {
        return groups.boundaries[setAttributeNS](null, key, options.attributes.boundaries[key]);
      });
    }

    if (options.output === "svg") {
      return svg$1;
    }

    var stringified = new win$1.XMLSerializer().serializeToString(svg$1);
    var beautified = vkXML(stringified);
    return beautified;
  };

  var getObject = function getObject(input) {
    if (input == null) {
      return {};
    }

    if (_typeof(input) === object && input !== null) {
      return input;
    }

    if (_typeof(input) === string || input instanceof String) {
      try {
        var obj = JSON.parse(input);
        return obj;
      } catch (error) {
        throw error;
      }
    }

    throw new TypeError("input requires ".concat(string, " or ").concat(object));
  };

  var FoldToSvg = function FoldToSvg(input, options) {
    try {
      var fold = getObject(input);
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

  var geom = {},
      modulo = function modulo(a, b) {
    return (+a % (b = +b) + b) % b;
  };

  geom.EPS = 0.000001;

  geom.sum = function (a, b) {
    return a + b;
  };

  geom.min = function (a, b) {
    if (a < b) {
      return a;
    } else {
      return b;
    }
  };

  geom.max = function (a, b) {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };

  geom.all = function (a, b) {
    return a && b;
  };

  geom.next = function (start, n, i) {
    if (i == null) {
      i = 1;
    }

    return modulo(start + i, n);
  };

  geom.rangesDisjoint = function (arg, arg1) {
    var a1, a2, b1, b2, ref, ref1;
    a1 = arg[0], a2 = arg[1];
    b1 = arg1[0], b2 = arg1[1];
    return b1 < (ref = Math.min(a1, a2)) && ref > b2 || b1 > (ref1 = Math.max(a1, a2)) && ref1 < b2;
  };

  geom.topologicalSort = function (vs) {
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

  geom.visit = function (v, list) {
    var k, len, ref, u;
    v.visited = true;
    ref = v.children;

    for (k = 0, len = ref.length; k < len; k++) {
      u = ref[k];

      if (!!u.visited) {
        continue;
      }

      u.parent = v;
      list = geom.visit(u, list);
    }

    return list.concat([v]);
  };

  geom.magsq = function (a) {
    return geom.dot(a, a);
  };

  geom.mag = function (a) {
    return Math.sqrt(geom.magsq(a));
  };

  geom.unit = function (a, eps) {
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

  geom.ang2D = function (a, eps) {
    if (eps == null) {
      eps = geom.EPS;
    }

    if (geom.magsq(a) < eps) {
      return null;
    }

    return Math.atan2(a[1], a[0]);
  };

  geom.mul = function (a, s) {
    var i, k, len, results;
    results = [];

    for (k = 0, len = a.length; k < len; k++) {
      i = a[k];
      results.push(i * s);
    }

    return results;
  };

  geom.linearInterpolate = function (t, a, b) {
    return geom.plus(geom.mul(a, 1 - t), geom.mul(b, t));
  };

  geom.plus = function (a, b) {
    var ai, i, k, len, results;
    results = [];

    for (i = k = 0, len = a.length; k < len; i = ++k) {
      ai = a[i];
      results.push(ai + b[i]);
    }

    return results;
  };

  geom.sub = function (a, b) {
    return geom.plus(a, geom.mul(b, -1));
  };

  geom.dot = function (a, b) {
    var ai, i;
    return function () {
      var k, len, results;
      results = [];

      for (i = k = 0, len = a.length; k < len; i = ++k) {
        ai = a[i];
        results.push(ai * b[i]);
      }

      return results;
    }().reduce(geom.sum);
  };

  geom.distsq = function (a, b) {
    return geom.magsq(geom.sub(a, b));
  };

  geom.dist = function (a, b) {
    return Math.sqrt(geom.distsq(a, b));
  };

  geom.closestIndex = function (a, bs) {
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

  geom.dir = function (a, b) {
    return geom.unit(geom.sub(b, a));
  };

  geom.ang = function (a, b) {
    var ref, ua, ub, v;
    ref = function () {
      var k, len, ref, results;
      ref = [a, b];
      results = [];

      for (k = 0, len = ref.length; k < len; k++) {
        v = ref[k];
        results.push(geom.unit(v));
      }

      return results;
    }(), ua = ref[0], ub = ref[1];

    if (!(ua != null && ub != null)) {
      return null;
    }

    return Math.acos(geom.dot(ua, ub));
  };

  geom.cross = function (a, b) {
    var i, j, ref, ref1;

    if (a.length === (ref = b.length) && ref === 2) {
      return a[0] * b[1] - a[1] * b[0];
    }

    if (a.length === (ref1 = b.length) && ref1 === 3) {
      return function () {
        var k, len, ref2, ref3, results;
        ref2 = [[1, 2], [2, 0], [0, 1]];
        results = [];

        for (k = 0, len = ref2.length; k < len; k++) {
          ref3 = ref2[k], i = ref3[0], j = ref3[1];
          results.push(a[i] * b[j] - a[j] * b[i]);
        }

        return results;
      }();
    }

    return null;
  };

  geom.parallel = function (a, b, eps) {
    var ref, ua, ub, v;

    if (eps == null) {
      eps = geom.EPS;
    }

    ref = function () {
      var k, len, ref, results;
      ref = [a, b];
      results = [];

      for (k = 0, len = ref.length; k < len; k++) {
        v = ref[k];
        results.push(geom.unit(v));
      }

      return results;
    }(), ua = ref[0], ub = ref[1];

    if (!(ua != null && ub != null)) {
      return null;
    }

    return 1 - Math.abs(geom.dot(ua, ub)) < eps;
  };

  geom.rotate = function (a, u, t) {
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
      results.push(function () {
        var l, len1, ref2, results1;
        ref2 = [ct, -st * u[p[2]], st * u[p[1]]];
        results1 = [];

        for (i = l = 0, len1 = ref2.length; l < len1; i = ++l) {
          q = ref2[i];
          results1.push(a[p[i]] * (u[p[0]] * u[p[i]] * (1 - ct) + q));
        }

        return results1;
      }().reduce(geom.sum));
    }

    return results;
  };

  geom.interiorAngle = function (a, b, c) {
    var ang;
    ang = geom.ang2D(geom.sub(a, b)) - geom.ang2D(geom.sub(c, b));
    return ang + (ang < 0 ? 2 * Math.PI : 0);
  };

  geom.turnAngle = function (a, b, c) {
    return Math.PI - geom.interiorAngle(a, b, c);
  };

  geom.triangleNormal = function (a, b, c) {
    return geom.unit(geom.cross(geom.sub(b, a), geom.sub(c, b)));
  };

  geom.polygonNormal = function (points, eps) {
    var i, p;

    if (eps == null) {
      eps = geom.EPS;
    }

    return geom.unit(function () {
      var k, len, results;
      results = [];

      for (i = k = 0, len = points.length; k < len; i = ++k) {
        p = points[i];
        results.push(geom.cross(p, points[geom.next(i, points.length)]));
      }

      return results;
    }().reduce(geom.plus), eps);
  };

  geom.twiceSignedArea = function (points) {
    var i, v0, v1;
    return function () {
      var k, len, results;
      results = [];

      for (i = k = 0, len = points.length; k < len; i = ++k) {
        v0 = points[i];
        v1 = points[geom.next(i, points.length)];
        results.push(v0[0] * v1[1] - v1[0] * v0[1]);
      }

      return results;
    }().reduce(geom.sum);
  };

  geom.polygonOrientation = function (points) {
    return Math.sign(geom.twiceSignedArea(points));
  };

  geom.sortByAngle = function (points, origin, mapping) {
    if (origin == null) {
      origin = [0, 0];
    }

    if (mapping == null) {
      mapping = function mapping(x) {
        return x;
      };
    }

    origin = mapping(origin);
    return points.sort(function (p, q) {
      var pa, qa;
      pa = geom.ang2D(geom.sub(mapping(p), origin));
      qa = geom.ang2D(geom.sub(mapping(q), origin));
      return pa - qa;
    });
  };

  geom.segmentsCross = function (arg, arg1) {
    var p0, p1, q0, q1;
    p0 = arg[0], q0 = arg[1];
    p1 = arg1[0], q1 = arg1[1];

    if (geom.rangesDisjoint([p0[0], q0[0]], [p1[0], q1[0]]) || geom.rangesDisjoint([p0[1], q0[1]], [p1[1], q1[1]])) {
      return false;
    }

    return geom.polygonOrientation([p0, q0, p1]) !== geom.polygonOrientation([p0, q0, q1]) && geom.polygonOrientation([p1, q1, p0]) !== geom.polygonOrientation([p1, q1, q0]);
  };

  geom.parametricLineIntersect = function (arg, arg1) {
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

  geom.segmentIntersectSegment = function (s1, s2) {
    var ref, s, t;
    ref = geom.parametricLineIntersect(s1, s2), s = ref[0], t = ref[1];

    if (s != null && 0 <= s && s <= 1 && 0 <= t && t <= 1) {
      return geom.linearInterpolate(s, s1[0], s1[1]);
    } else {
      return null;
    }
  };

  geom.lineIntersectLine = function (l1, l2) {
    var ref, s, t;
    ref = geom.parametricLineIntersect(l1, l2), s = ref[0], t = ref[1];

    if (s != null) {
      return geom.linearInterpolate(s, l1[0], l1[1]);
    } else {
      return null;
    }
  };

  geom.pointStrictlyInSegment = function (p, s, eps) {
    var v0, v1;

    if (eps == null) {
      eps = geom.EPS;
    }

    v0 = geom.sub(p, s[0]);
    v1 = geom.sub(p, s[1]);
    return geom.parallel(v0, v1, eps) && geom.dot(v0, v1) < 0;
  };

  geom.centroid = function (points) {
    return geom.mul(points.reduce(geom.plus), 1.0 / points.length);
  };

  geom.basis = function (ps, eps) {
    var d, ds, n, ns, p, x, y, z;

    if (eps == null) {
      eps = geom.EPS;
    }

    if (function () {
      var k, len, results;
      results = [];

      for (k = 0, len = ps.length; k < len; k++) {
        p = ps[k];
        results.push(p.length !== 3);
      }

      return results;
    }().reduce(geom.all)) {
      return null;
    }

    ds = function () {
      var k, len, results;
      results = [];

      for (k = 0, len = ps.length; k < len; k++) {
        p = ps[k];

        if (geom.distsq(p, ps[0]) > eps) {
          results.push(geom.dir(p, ps[0]));
        }
      }

      return results;
    }();

    if (ds.length === 0) {
      return [];
    }

    x = ds[0];

    if (function () {
      var k, len, results;
      results = [];

      for (k = 0, len = ds.length; k < len; k++) {
        d = ds[k];
        results.push(geom.parallel(d, x, eps));
      }

      return results;
    }().reduce(geom.all)) {
      return [x];
    }

    ns = function () {
      var k, len, results;
      results = [];

      for (k = 0, len = ds.length; k < len; k++) {
        d = ds[k];
        results.push(geom.unit(geom.cross(d, x)));
      }

      return results;
    }();

    ns = function () {
      var k, len, results;
      results = [];

      for (k = 0, len = ns.length; k < len; k++) {
        n = ns[k];

        if (n != null) {
          results.push(n);
        }
      }

      return results;
    }();

    z = ns[0];
    y = geom.cross(z, x);

    if (function () {
      var k, len, results;
      results = [];

      for (k = 0, len = ns.length; k < len; k++) {
        n = ns[k];
        results.push(geom.parallel(n, z, eps));
      }

      return results;
    }().reduce(geom.all)) {
      return [x, y];
    }

    return [x, y, z];
  };

  geom.above = function (ps, qs, n, eps) {
    var pn, qn, ref, v, vs;

    if (eps == null) {
      eps = geom.EPS;
    }

    ref = function () {
      var k, len, ref, results;
      ref = [ps, qs];
      results = [];

      for (k = 0, len = ref.length; k < len; k++) {
        vs = ref[k];
        results.push(function () {
          var l, len1, results1;
          results1 = [];

          for (l = 0, len1 = vs.length; l < len1; l++) {
            v = vs[l];
            results1.push(geom.dot(v, n));
          }

          return results1;
        }());
      }

      return results;
    }(), pn = ref[0], qn = ref[1];

    if (qn.reduce(geom.max) - pn.reduce(geom.min) < eps) {
      return 1;
    }

    if (pn.reduce(geom.max) - qn.reduce(geom.min) < eps) {
      return -1;
    }

    return 0;
  };

  geom.separatingDirection2D = function (t1, t2, n, eps) {
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

  geom.separatingDirection3D = function (t1, t2, eps) {
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

  geom.circleCross = function (d, r1, r2) {
    var x, y;
    x = (d * d - r2 * r2 + r1 * r1) / d / 2;
    y = Math.sqrt(r1 * r1 - x * x);
    return [x, y];
  };

  geom.creaseDir = function (u1, u2, a, b, eps) {
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

  geom.quadSplit = function (u, p, d, t) {
    if (geom.magsq(p) > d * d) {
      throw new Error("STOP! Trying to split expansive quad.");
    }

    return geom.mul(u, (d * d - geom.magsq(p)) / 2 / (d * Math.cos(t) - geom.dot(u, p)));
  };

  var filter = {};

  var indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i;
    }

    return -1;
  };

  filter.edgesAssigned = function (fold, target) {
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

  filter.mountainEdges = function (fold) {
    return filter.edgesAssigned(fold, 'M');
  };

  filter.valleyEdges = function (fold) {
    return filter.edgesAssigned(fold, 'V');
  };

  filter.flatEdges = function (fold) {
    return filter.edgesAssigned(fold, 'F');
  };

  filter.boundaryEdges = function (fold) {
    return filter.edgesAssigned(fold, 'B');
  };

  filter.unassignedEdges = function (fold) {
    return filter.edgesAssigned(fold, 'U');
  };

  filter.keysStartingWith = function (fold, prefix) {
    var key, results;
    results = [];

    for (key in fold) {
      if (key.slice(0, prefix.length) === prefix) {
        results.push(key);
      }
    }

    return results;
  };

  filter.keysEndingWith = function (fold, suffix) {
    var key, results;
    results = [];

    for (key in fold) {
      if (key.slice(-suffix.length) === suffix) {
        results.push(key);
      }
    }

    return results;
  };

  filter.remapField = function (fold, field, old2new) {
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

      fold[key] = function () {
        var len2, m, results;
        results = [];

        for (m = 0, len2 = new2old.length; m < len2; m++) {
          old = new2old[m];
          results.push(fold[key][old]);
        }

        return results;
      }();
    }

    ref1 = filter.keysEndingWith(fold, "_" + field);

    for (m = 0, len2 = ref1.length; m < len2; m++) {
      key = ref1[m];

      fold[key] = function () {
        var len3, n, ref2, results;
        ref2 = fold[key];
        results = [];

        for (n = 0, len3 = ref2.length; n < len3; n++) {
          array = ref2[n];
          results.push(function () {
            var len4, o, results1;
            results1 = [];

            for (o = 0, len4 = array.length; o < len4; o++) {
              old = array[o];
              results1.push(old2new[old]);
            }

            return results1;
          }());
        }

        return results;
      }();
    }

    return fold;
  };

  filter.remapFieldSubset = function (fold, field, keep) {
    var id, old2new, value;
    id = 0;

    old2new = function () {
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
    }();

    filter.remapField(fold, field, old2new);
    return old2new;
  };

  filter.numType = function (fold, type) {
    var counts, key, value;

    counts = function () {
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
    }();

    if (!counts.length) {
      counts = function () {
        var k, len, ref, results;
        ref = filter.keysEndingWith(fold, "_" + type);
        results = [];

        for (k = 0, len = ref.length; k < len; k++) {
          key = ref[k];
          results.push(1 + Math.max.apply(Math, fold[key]));
        }

        return results;
      }();
    }

    if (counts.length) {
      return Math.max.apply(Math, counts);
    } else {
      return 0;
    }
  };

  filter.numVertices = function (fold) {
    return filter.numType(fold, 'vertices');
  };

  filter.numEdges = function (fold) {
    return filter.numType(fold, 'edges');
  };

  filter.numFaces = function (fold) {
    return filter.numType(fold, 'faces');
  };

  filter.removeDuplicateEdges_vertices = function (fold) {
    var edge, id, key, old2new, seen, v, w;
    seen = {};
    id = 0;

    old2new = function () {
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
    }();

    filter.remapField(fold, 'edges', old2new);
    return old2new;
  };

  filter.edges_verticesIncident = function (e1, e2) {
    var k, len, v;

    for (k = 0, len = e1.length; k < len; k++) {
      v = e1[k];

      if (indexOf.call(e2, v) >= 0) {
        return v;
      }
    }

    return null;
  };

  var RepeatedPointsDS = function () {
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

    RepeatedPointsDS.prototype.lookup = function (coord) {
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

    RepeatedPointsDS.prototype.key = function (coord) {
      var key, x, xr, y, yr;
      x = coord[0], y = coord[1];
      xr = Math.round(x / this.epsilon);
      yr = Math.round(y / this.epsilon);
      return key = xr + "," + yr;
    };

    RepeatedPointsDS.prototype.insert = function (coord) {
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
  }();

  filter.collapseNearbyVertices = function (fold, epsilon) {
    var coords, old2new, vertices;
    vertices = new RepeatedPointsDS([], epsilon);

    old2new = function () {
      var k, len, ref, results;
      ref = fold.vertices_coords;
      results = [];

      for (k = 0, len = ref.length; k < len; k++) {
        coords = ref[k];
        results.push(vertices.insert(coords));
      }

      return results;
    }();

    return filter.remapField(fold, 'vertices', old2new);
  };

  filter.maybeAddVertex = function (fold, coords, epsilon) {
    var i;
    i = geom.closestIndex(coords, fold.vertices_coords);

    if (i != null && epsilon >= geom.dist(coords, fold.vertices_coords[i])) {
      return i;
    } else {
      return fold.vertices_coords.push(coords) - 1;
    }
  };

  filter.addVertexLike = function (fold, oldVertexIndex) {
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

  filter.addEdgeLike = function (fold, oldEdgeIndex, v1, v2) {
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

  filter.addVertexAndSubdivide = function (fold, coords, epsilon) {
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

        s = function () {
          var l, len1, results;
          results = [];

          for (l = 0, len1 = e.length; l < len1; l++) {
            u = e[l];
            results.push(fold.vertices_coords[u]);
          }

          return results;
        }();

        if (geom.pointStrictlyInSegment(coords, s)) {
          iNew = filter.addEdgeLike(fold, i, v, e[1]);
          changedEdges.push(i, iNew);
          e[1] = v;
        }
      }
    }

    return [v, changedEdges];
  };

  filter.removeLoopEdges = function (fold) {
    var edge;
    return filter.remapFieldSubset(fold, 'edges', function () {
      var k, len, ref, results;
      ref = fold.edges_vertices;
      results = [];

      for (k = 0, len = ref.length; k < len; k++) {
        edge = ref[k];
        results.push(edge[0] !== edge[1]);
      }

      return results;
    }());
  };

  filter.subdivideCrossingEdges_vertices = function (fold, epsilon, involvingEdgesFrom) {
    var addEdge, changedEdges, cross, crossI, e, e1, e2, i, i1, i2, k, l, len, len1, len2, len3, m, n, old2new, p, ref, ref1, ref2, ref3, s, s1, s2, u, v, vertices;
    changedEdges = [[], []];

    addEdge = function addEdge(v1, v2, oldEdgeIndex, which) {
      var eNew;
      eNew = filter.addEdgeLike(fold, oldEdgeIndex, v1, v2);
      return changedEdges[which].push(oldEdgeIndex, eNew);
    };

    i = involvingEdgesFrom != null ? involvingEdgesFrom : 0;

    while (i < fold.edges_vertices.length) {
      e = fold.edges_vertices[i];

      s = function () {
        var k, len, results;
        results = [];

        for (k = 0, len = e.length; k < len; k++) {
          u = e[k];
          results.push(fold.vertices_coords[u]);
        }

        return results;
      }();

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

      s1 = function () {
        var l, len1, results;
        results = [];

        for (l = 0, len1 = e1.length; l < len1; l++) {
          v = e1[l];
          results.push(fold.vertices_coords[v]);
        }

        return results;
      }();

      ref1 = fold.edges_vertices.slice(0, i1);

      for (i2 = l = 0, len1 = ref1.length; l < len1; i2 = ++l) {
        e2 = ref1[i2];

        s2 = function () {
          var len2, m, results;
          results = [];

          for (m = 0, len2 = e2.length; m < len2; m++) {
            v = e2[m];
            results.push(fold.vertices_coords[v]);
          }

          return results;
        }();

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

      changedEdges[i] = function () {
        var len3, n, ref3, results;
        ref3 = changedEdges[i];
        results = [];

        for (n = 0, len3 = ref3.length; n < len3; n++) {
          e = ref3[n];
          results.push(old2new[e]);
        }

        return results;
      }();
    }

    old2new = filter.removeLoopEdges(fold);
    ref3 = [0, 1];

    for (n = 0, len3 = ref3.length; n < len3; n++) {
      i = ref3[n];

      changedEdges[i] = function () {
        var len4, o, ref4, results;
        ref4 = changedEdges[i];
        results = [];

        for (o = 0, len4 = ref4.length; o < len4; o++) {
          e = ref4[o];
          results.push(old2new[e]);
        }

        return results;
      }();
    }

    if (involvingEdgesFrom != null) {
      return changedEdges;
    } else {
      return changedEdges[0].concat(changedEdges[1]);
    }
  };

  filter.addEdgeAndSubdivide = function (fold, v1, v2, epsilon) {
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

      if (e[0] === v1 && e[1] === v2 || e[0] === v2 && e[1] === v1) {
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

  filter.cutEdges = function (fold, es) {
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

  filter.edges_vertices_to_vertices_vertices = function (fold) {
    var edge, k, len, numVertices, ref, v, vertices_vertices, w;
    numVertices = filter.numVertices(fold);

    vertices_vertices = function () {
      var k, ref, results;
      results = [];

      for (v = k = 0, ref = numVertices; 0 <= ref ? k < ref : k > ref; v = 0 <= ref ? ++k : --k) {
        results.push([]);
      }

      return results;
    }();

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
      modulo$1 = function modulo(a, b) {
    return (+a % (b = +b) + b) % b;
  },
      hasProp = {}.hasOwnProperty;

  convert.edges_vertices_to_vertices_vertices_unsorted = function (fold) {
    fold.vertices_vertices = filter.edges_vertices_to_vertices_vertices(fold);
    return fold;
  };

  convert.edges_vertices_to_vertices_vertices_sorted = function (fold) {
    convert.edges_vertices_to_vertices_vertices_unsorted(fold);
    return convert.sort_vertices_vertices(fold);
  };

  convert.edges_vertices_to_vertices_edges_sorted = function (fold) {
    convert.edges_vertices_to_vertices_vertices_sorted(fold);
    return convert.vertices_vertices_to_vertices_edges(fold);
  };

  convert.sort_vertices_vertices = function (fold) {
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
      geom.sortByAngle(neighbors, v, function (x) {
        return fold.vertices_coords[x];
      });
    }

    return fold;
  };

  convert.vertices_vertices_to_faces_vertices = function (fold) {
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

    ref1 = function () {
      var results;
      results = [];

      for (key in next) {
        results.push(key);
      }

      return results;
    }();

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

      if (w != null && geom.polygonOrientation(function () {
        var len3, m, results;
        results = [];

        for (m = 0, len3 = face.length; m < len3; m++) {
          x = face[m];
          results.push(fold.vertices_coords[x]);
        }

        return results;
      }()) > 0) {
        fold.faces_vertices.push(face);
      }
    }

    return fold;
  };

  convert.vertices_edges_to_faces_vertices_edges = function (fold) {
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

        if (e2 != null && geom.polygonOrientation(function () {
          var len4, n, results;
          results = [];

          for (n = 0, len4 = vertices.length; n < len4; n++) {
            x = vertices[n];
            results.push(fold.vertices_coords[x]);
          }

          return results;
        }()) > 0) {
          fold.faces_vertices.push(vertices);
          fold.faces_edges.push(edges);
        }
      }
    }

    return fold;
  };

  convert.edges_vertices_to_faces_vertices = function (fold) {
    convert.edges_vertices_to_vertices_vertices_sorted(fold);
    return convert.vertices_vertices_to_faces_vertices(fold);
  };

  convert.edges_vertices_to_faces_vertices_edges = function (fold) {
    convert.edges_vertices_to_vertices_edges_sorted(fold);
    return convert.vertices_edges_to_faces_vertices_edges(fold);
  };

  convert.vertices_vertices_to_vertices_edges = function (fold) {
    var edge, edgeMap, i, j, len, ref, ref1, v1, v2, vertex, vertices;
    edgeMap = {};
    ref = fold.edges_vertices;

    for (edge = j = 0, len = ref.length; j < len; edge = ++j) {
      ref1 = ref[edge], v1 = ref1[0], v2 = ref1[1];
      edgeMap[v1 + "," + v2] = edge;
      edgeMap[v2 + "," + v1] = edge;
    }

    return fold.vertices_edges = function () {
      var k, len1, ref2, results;
      ref2 = fold.vertices_vertices;
      results = [];

      for (vertex = k = 0, len1 = ref2.length; k < len1; vertex = ++k) {
        vertices = ref2[vertex];
        results.push(function () {
          var l, ref3, results1;
          results1 = [];

          for (i = l = 0, ref3 = vertices.length; 0 <= ref3 ? l < ref3 : l > ref3; i = 0 <= ref3 ? ++l : --l) {
            results1.push(edgeMap[vertex + "," + vertices[i]]);
          }

          return results1;
        }());
      }

      return results;
    }();
  };

  convert.faces_vertices_to_faces_edges = function (fold) {
    var edge, edgeMap, face, i, j, len, ref, ref1, v1, v2, vertices;
    edgeMap = {};
    ref = fold.edges_vertices;

    for (edge = j = 0, len = ref.length; j < len; edge = ++j) {
      ref1 = ref[edge], v1 = ref1[0], v2 = ref1[1];
      edgeMap[v1 + "," + v2] = edge;
      edgeMap[v2 + "," + v1] = edge;
    }

    return fold.faces_edges = function () {
      var k, len1, ref2, results;
      ref2 = fold.faces_vertices;
      results = [];

      for (face = k = 0, len1 = ref2.length; k < len1; face = ++k) {
        vertices = ref2[face];
        results.push(function () {
          var l, ref3, results1;
          results1 = [];

          for (i = l = 0, ref3 = vertices.length; 0 <= ref3 ? l < ref3 : l > ref3; i = 0 <= ref3 ? ++l : --l) {
            results1.push(edgeMap[vertices[i] + "," + vertices[(i + 1) % vertices.length]]);
          }

          return results1;
        }());
      }

      return results;
    }();
  };

  convert.faces_vertices_to_edges = function (mesh) {
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
      mesh.faces_edges.push(function () {
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
      }());
    }

    return mesh;
  };

  convert.deepCopy = function (fold) {
    var copy, item, j, key, len, ref, results, value;

    if ((ref = _typeof(fold)) === 'number' || ref === 'string' || ref === 'boolean') {
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

  convert.toJSON = function (fold) {
    var key, obj, value;
    return "{\n" + function () {
      var results;
      results = [];
      var keys = Object.keys(fold);

      for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        key = keys[keyIndex];
        value = fold[key];
        results.push("  " + JSON.stringify(key) + ": " + (Array.isArray(value) ? "[\n" + function () {
          var j, len, results1;
          results1 = [];

          for (j = 0, len = value.length; j < len; j++) {
            obj = value[j];
            results1.push("    " + JSON.stringify(obj));
          }

          return results1;
        }().join(',\n') + "\n  ]" : JSON.stringify(value)));
      }

      return results;
    }().join(',\n') + "\n}\n";
  };

  convert.extensions = {};
  convert.converters = {};

  convert.getConverter = function (fromExt, toExt) {
    if (fromExt === toExt) {
      return function (x) {
        return x;
      };
    } else {
      return convert.converters["" + fromExt + toExt];
    }
  };

  convert.setConverter = function (fromExt, toExt, converter) {
    convert.extensions[fromExt] = true;
    convert.extensions[toExt] = true;
    return convert.converters["" + fromExt + toExt] = converter;
  };

  convert.convertFromTo = function (data, fromExt, toExt) {
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

  convert.convertFrom = function (data, fromExt) {
    return convert.convertFromTo(data, fromExt, '.fold');
  };

  convert.convertTo = function (data, toExt) {
    return convert.convertFromTo(data, '.fold', toExt);
  };

  var oripa = {};
  oripa.type2fold = {
    0: 'F',
    1: 'B',
    2: 'M',
    3: 'V'
  };
  oripa.fold2type = {};
  var ref = oripa.type2fold;

  for (var x in ref) {
    var y = ref[x];
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

  oripa.toFold = function (oripaStr, isDOMObject) {
    var children, fold, j, k, l, len, len1, len2, len3, len4, line, lines, m, n, nodeSpec, object, oneChildSpec, oneChildText, prop, property, ref1, ref2, ref3, ref4, ref5, subproperty, top, type, vertex, x0, x1, xml, y0, y1;
    fold = {
      vertices_coords: [],
      edges_vertices: [],
      edges_assignment: [],
      file_creator: 'oripa2fold'
    };

    vertex = function vertex(x, y) {
      var v;
      v = fold.vertices_coords.length;
      fold.vertices_coords.push([parseFloat(x), parseFloat(y)]);
      return v;
    };

    nodeSpec = function nodeSpec(node, type, key, value) {
      if (type != null && node.tagName !== type) {
        console.warn("ORIPA file has " + node.tagName + " where " + type + " was expected");
        return null;
      } else if (key != null && (!node.hasAttribute(key) || value != null && node.getAttribute(key) !== value)) {
        console.warn("ORIPA file has " + node.tagName + " with " + key + " = " + node.getAttribute(key) + " where " + value + " was expected");
        return null;
      } else {
        return node;
      }
    };

    children = function children(node) {
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

    oneChildSpec = function oneChildSpec(node, type, key, value) {
      var sub;
      sub = children(node);

      if (sub.length !== 1) {
        console.warn("ORIPA file has " + node.tagName + " with " + node.childNodes.length + " children, not 1");
        return null;
      } else {
        return nodeSpec(sub[0], type, key, value);
      }
    };

    oneChildText = function oneChildText(node) {
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

    xml = isDOMObject === true ? oripaStr : new DOMParser().parseFromString(oripaStr, 'text/xml').documentElement;
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

                    if (x0 != null && x1 != null && y0 != null && y1 != null) {
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
            console.warn("Ignoring " + property.tagName + " " + top.getAttribute('property') + " in ORIPA file");
          }
        }
      }
    }

    filter.collapseNearbyVertices(fold, oripa.POINT_EPS);
    filter.subdivideCrossingEdges_vertices(fold, oripa.POINT_EPS);
    convert.edges_vertices_to_faces_vertices(fold);
    return fold;
  };

  oripa.fromFold = function (fold) {
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

    lines = function () {
      var j, len, ref2, results;
      ref2 = fold.edges_vertices;
      results = [];

      for (ei = j = 0, len = ref2.length; j < len; ei = ++j) {
        edge = ref2[ei];

        vs = function () {
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
        }();

        results.push({
          x0: vs[0][0],
          y0: vs[0][1],
          x1: vs[1][0],
          y1: vs[1][1],
          type: oripa.fold2type[fold.edges_assignment[ei]] || oripa.fold2type_default
        });
      }

      return results;
    }();

    s += (".\n  <void property=\"lines\"> \n   <array class=\"oripa.OriLineProxy\" length=\"" + lines.length + "\"> \n").slice(2);

    for (i = j = 0, len = lines.length; j < len; i = ++j) {
      line = lines[i];
      s += (".\n    <void index=\"" + i + "\"> \n     <object class=\"oripa.OriLineProxy\"> \n      <void property=\"type\"> \n       <int>" + line.type + "</int> \n      </void> \n      <void property=\"x0\"> \n       <double>" + line.x0 + "</double> \n      </void> \n      <void property=\"x1\"> \n       <double>" + line.x1 + "</double> \n      </void> \n      <void property=\"y0\"> \n       <double>" + line.y0 + "</double> \n      </void> \n      <void property=\"y1\"> \n       <double>" + line.y1 + "</double> \n      </void> \n     </object> \n    </void> \n").slice(2);
    }

    s += ".\n   </array> \n  </void> \n </object> \n</java> \n".slice(2);
    return s;
  };

  var isBrowser$2 = typeof window !== "undefined" && typeof window.document !== "undefined";
  var isNode$2 = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
  var isWebWorker$1 = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";

  var htmlString$2 = "<!DOCTYPE html><title> </title>";

  var win$2 = function () {
    var w = {};

    if (isNode$2) {
      var _require = require("xmldom"),
          DOMParser = _require.DOMParser,
          XMLSerializer = _require.XMLSerializer;

      w.DOMParser = DOMParser;
      w.XMLSerializer = XMLSerializer;
      w.document = new DOMParser().parseFromString(htmlString$2, "text/html");
    } else if (isBrowser$2) {
      w = window;
    }

    return w;
  }();

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

  var css_color_names = Object.keys(css_colors);

  var hexToComponents = function hexToComponents(h) {
    var r = 0;
    var g = 0;
    var b = 0;
    var a = 255;

    if (h.length === 4) {
      r = "0x".concat(h[1]).concat(h[1]);
      g = "0x".concat(h[2]).concat(h[2]);
      b = "0x".concat(h[3]).concat(h[3]);
    } else if (h.length === 7) {
      r = "0x".concat(h[1]).concat(h[2]);
      g = "0x".concat(h[3]).concat(h[4]);
      b = "0x".concat(h[5]).concat(h[6]);
    } else if (h.length === 5) {
      r = "0x".concat(h[1]).concat(h[1]);
      g = "0x".concat(h[2]).concat(h[2]);
      b = "0x".concat(h[3]).concat(h[3]);
      a = "0x".concat(h[4]).concat(h[4]);
    } else if (h.length === 9) {
      r = "0x".concat(h[1]).concat(h[2]);
      g = "0x".concat(h[3]).concat(h[4]);
      b = "0x".concat(h[5]).concat(h[6]);
      a = "0x".concat(h[7]).concat(h[8]);
    }

    return [+(r / 255), +(g / 255), +(b / 255), +(a / 255)];
  };

  var color_to_assignment = function color_to_assignment(string) {
    if (string == null || typeof string !== "string") {
      return "U";
    }

    var c = [0, 0, 0, 1];

    if (string[0] === "#") {
      c = hexToComponents(string);
    } else if (css_color_names.indexOf(string) !== -1) {
      c = hexToComponents(css_colors[string]);
    }

    var ep = 0.05;

    if (c[0] < ep && c[1] < ep && c[2] < ep) {
      return "U";
    }

    if (c[0] > c[1] && c[0] - c[2] > ep) {
      return "M";
    }

    if (c[2] > c[1] && c[2] - c[0] > ep) {
      return "V";
    }

    return "U";
  };

  var EPSILON$1 = 1e-6;

  var magnitude$1 = function magnitude(v) {
    var sum = v.map(function (component) {
      return component * component;
    }).reduce(function (prev, curr) {
      return prev + curr;
    }, 0);
    return Math.sqrt(sum);
  };

  var normalize$1 = function normalize(v) {
    var m = magnitude$1(v);
    return m === 0 ? v : v.map(function (c) {
      return c / m;
    });
  };

  var equivalent$1 = function equivalent(a, b) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON$1;

    for (var i = 0; i < a.length; i += 1) {
      if (Math.abs(a[i] - b[i]) > epsilon) {
        return false;
      }
    }

    return true;
  };

  var segment_segment_comp_exclusive$1 = function segment_segment_comp_exclusive(t0, t1) {
    return t0 > EPSILON$1 && t0 < 1 - EPSILON$1 && t1 > EPSILON$1 && t1 < 1 - EPSILON$1;
  };

  var intersection_function$1 = function intersection_function(aPt, aVec, bPt, bVec, compFunc) {
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON$1;

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

  var segment_segment_exclusive$1 = function segment_segment_exclusive(a0, a1, b0, b1, epsilon) {
    var aVec = [a1[0] - a0[0], a1[1] - a0[1]];
    var bVec = [b1[0] - b0[0], b1[1] - b0[1]];
    return intersection_function$1(a0, aVec, b0, bVec, segment_segment_comp_exclusive$1, epsilon);
  };

  var point_on_edge_exclusive = function point_on_edge_exclusive(point, edge0, edge1) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON$1;
    var edge0_1 = [edge0[0] - edge1[0], edge0[1] - edge1[1]];
    var edge0_p = [edge0[0] - point[0], edge0[1] - point[1]];
    var edge1_p = [edge1[0] - point[0], edge1[1] - point[1]];
    var dEdge = Math.sqrt(edge0_1[0] * edge0_1[0] + edge0_1[1] * edge0_1[1]);
    var dP0 = Math.sqrt(edge0_p[0] * edge0_p[0] + edge0_p[1] * edge0_p[1]);
    var dP1 = Math.sqrt(edge1_p[0] * edge1_p[0] + edge1_p[1] * edge1_p[1]);
    return Math.abs(dEdge - dP0 - dP1) < epsilon;
  };

  var math$1 = {
    core: {
      EPSILON: EPSILON$1,
      magnitude: magnitude$1,
      normalize: normalize$1,
      equivalent: equivalent$1,
      point_on_edge_exclusive: point_on_edge_exclusive,
      intersection: {
        segment_segment_exclusive: segment_segment_exclusive$1
      }
    }
  };

  var max_array_length = function max_array_length() {
    for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
      arrays[_key] = arguments[_key];
    }

    return Math.max.apply(Math, _toConsumableArray(arrays.filter(function (el) {
      return el !== undefined;
    }).map(function (el) {
      return el.length;
    })));
  };

  var vertices_count = function vertices_count(_ref) {
    var vertices_coords = _ref.vertices_coords,
        vertices_faces = _ref.vertices_faces,
        vertices_vertices = _ref.vertices_vertices;
    return max_array_length([], vertices_coords, vertices_faces, vertices_vertices);
  };

  var edges_count = function edges_count(_ref2) {
    var edges_vertices = _ref2.edges_vertices,
        edges_faces = _ref2.edges_faces;
    return max_array_length([], edges_vertices, edges_faces);
  };

  var faces_count = function faces_count(_ref3) {
    var faces_vertices = _ref3.faces_vertices,
        faces_edges = _ref3.faces_edges;
    return max_array_length([], faces_vertices, faces_edges);
  };

  var get_geometry_length = {
    vertices: vertices_count,
    edges: edges_count,
    faces: faces_count
  };

  var remove_geometry_key_indices = function remove_geometry_key_indices(graph, key, removeIndices) {
    var geometry_array_size = get_geometry_length[key](graph);
    var removes = Array(geometry_array_size).fill(false);
    removeIndices.forEach(function (v) {
      removes[v] = true;
    });
    var s = 0;
    var index_map = removes.map(function (remove) {
      return remove ? --s : s;
    });

    if (removeIndices.length === 0) {
      return index_map;
    }

    var prefix = "".concat(key, "_");
    var suffix = "_".concat(key);
    var graph_keys = Object.keys(graph);
    var prefixKeys = graph_keys.map(function (str) {
      return str.substring(0, prefix.length) === prefix ? str : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
    var suffixKeys = graph_keys.map(function (str) {
      return str.substring(str.length - suffix.length, str.length) === suffix ? str : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
    suffixKeys.forEach(function (sKey) {
      return graph[sKey].forEach(function (_, i) {
        return graph[sKey][i].forEach(function (v, j) {
          graph[sKey][i][j] += index_map[v];
        });
      });
    });
    prefixKeys.forEach(function (pKey) {
      graph[pKey] = graph[pKey].filter(function (_, i) {
        return !removes[i];
      });
    });
    return index_map;
  };

  var edges_vertices_equivalent = function edges_vertices_equivalent(a, b) {
    return a[0] === b[0] && a[1] === b[1] || a[0] === b[1] && a[1] === b[0];
  };

  var make_edges_collinearVertices = function make_edges_collinearVertices(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math$1.core.EPSILON;
    var edges = edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    });
    return edges.map(function (e) {
      return vertices_coords.filter(function (v) {
        return math$1.core.point_on_edge_exclusive(v, e[0], e[1], epsilon);
      });
    });
  };

  var make_edges_alignment = function make_edges_alignment(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices;
    var edges = edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    });
    var edges_vector = edges.map(function (e) {
      return [e[1][0] - e[0][0], e[1][1] - e[0][1]];
    });
    var edges_magnitude = edges_vector.map(function (e) {
      return Math.sqrt(e[0] * e[0] + e[1] * e[1]);
    });
    var edges_normalized = edges_vector.map(function (e, i) {
      return [e[0] / edges_magnitude[i], e[1] / edges_magnitude[i]];
    });
    return edges_normalized.map(function (e) {
      return Math.abs(e[0]) > 0.707;
    });
  };

  var make_edges_intersections = function make_edges_intersections(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        edges_vertices = _ref3.edges_vertices;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math$1.core.EPSILON;
    var edge_count = edges_vertices.length;
    var edges = edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    });
    var crossings = Array.from(Array(edge_count - 1)).map(function () {
      return [];
    });

    for (var i = 0; i < edges.length - 1; i += 1) {
      for (var j = i + 1; j < edges.length; j += 1) {
        crossings[i][j] = math$1.core.intersection.segment_segment_exclusive(edges[i][0], edges[i][1], edges[j][0], edges[j][1], epsilon);
      }
    }

    var edges_intersections = Array.from(Array(edge_count)).map(function () {
      return [];
    });

    for (var _i = 0; _i < edges.length - 1; _i += 1) {
      for (var _j = _i + 1; _j < edges.length; _j += 1) {
        if (crossings[_i][_j] != null) {
          edges_intersections[_i].push(crossings[_i][_j]);

          edges_intersections[_j].push(crossings[_i][_j]);
        }
      }
    }

    return edges_intersections;
  };

  var fragment = function fragment(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math$1.core.EPSILON;

    var horizSort = function horizSort(a, b) {
      return a[0] - b[0];
    };

    var vertSort = function vertSort(a, b) {
      return a[1] - b[1];
    };

    var edges_alignment = make_edges_alignment(graph);
    var edges = graph.edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return graph.vertices_coords[v];
      });
    });
    edges.forEach(function (e, i) {
      return e.sort(edges_alignment[i] ? horizSort : vertSort);
    });
    var edges_intersections = make_edges_intersections(graph, epsilon);
    var edges_collinearVertices = make_edges_collinearVertices(graph, epsilon);
    var new_edges_vertices = edges_intersections.map(function (a, i) {
      return a.concat(edges_collinearVertices[i]);
    });
    new_edges_vertices.forEach(function (e, i) {
      return e.sort(edges_alignment[i] ? horizSort : vertSort);
    });
    var new_edges = new_edges_vertices.map(function (ev) {
      return Array.from(Array(ev.length - 1)).map(function (_, i) {
        return [ev[i], ev[i + 1]];
      });
    });
    new_edges = new_edges.map(function (edgeGroup) {
      return edgeGroup.filter(function (e) {
        return false === e.map(function (_, i) {
          return Math.abs(e[0][i] - e[1][i]) < epsilon;
        }).reduce(function (a, b) {
          return a && b;
        }, true);
      });
    });
    var edge_map = new_edges.map(function (edge, i) {
      return edge.map(function () {
        return i;
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var vertices_coords = new_edges.map(function (edge) {
      return edge.reduce(function (a, b) {
        return a.concat(b);
      }, []);
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var counter = 0;
    var edges_vertices = new_edges.map(function (edge) {
      return edge.map(function () {
        return [counter++, counter++];
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var vertices_equivalent = Array.from(Array(vertices_coords.length)).map(function () {
      return [];
    });

    for (var i = 0; i < vertices_coords.length - 1; i += 1) {
      for (var j = i + 1; j < vertices_coords.length; j += 1) {
        vertices_equivalent[i][j] = math$1.core.equivalent(vertices_coords[i], vertices_coords[j], epsilon);
      }
    }

    var vertices_map = vertices_coords.map(function () {
      return undefined;
    });
    vertices_equivalent.forEach(function (row, i) {
      return row.forEach(function (eq, j) {
        if (eq) {
          vertices_map[j] = vertices_map[i] === undefined ? i : vertices_map[i];
        }
      });
    });
    var vertices_remove = vertices_map.map(function (m) {
      return m !== undefined;
    });
    vertices_map.forEach(function (map, i) {
      if (map === undefined) {
        vertices_map[i] = i;
      }
    });
    edges_vertices.forEach(function (edge, i) {
      return edge.forEach(function (v, j) {
        edges_vertices[i][j] = vertices_map[v];
      });
    });
    var edges_equivalent = Array.from(Array(edges_vertices.length)).map(function () {
      return [];
    });

    for (var _i2 = 0; _i2 < edges_vertices.length - 1; _i2 += 1) {
      for (var _j2 = _i2 + 1; _j2 < edges_vertices.length; _j2 += 1) {
        edges_equivalent[_i2][_j2] = edges_vertices_equivalent(edges_vertices[_i2], edges_vertices[_j2]);
      }
    }

    var edges_map = edges_vertices.map(function () {
      return undefined;
    });
    edges_equivalent.forEach(function (row, i) {
      return row.forEach(function (eq, j) {
        if (eq) {
          edges_map[i] = edges_map[j] === undefined ? j : edges_map[j];
        }
      });
    });
    var edges_dont_remove = edges_map.map(function (m) {
      return m === undefined;
    });
    edges_map.forEach(function (map, i) {
      if (map === undefined) {
        edges_map[i] = i;
      }
    });
    var edges_vertices_cl = edges_vertices.filter(function (_, i) {
      return edges_dont_remove[i];
    });
    var edge_map_cl = edge_map.filter(function (_, i) {
      return edges_dont_remove[i];
    });
    var flat = {
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices_cl
    };

    if ("edges_assignment" in graph === true) {
      flat.edges_assignment = edge_map_cl.map(function (i) {
        return graph.edges_assignment[i];
      });
    }

    if ("edges_foldAngle" in graph === true) {
      flat.edges_foldAngle = edge_map_cl.map(function (i) {
        return graph.edges_foldAngle[i];
      });
    }

    var vertices_remove_indices = vertices_remove.map(function (rm, i) {
      return rm ? i : undefined;
    }).filter(function (i) {
      return i !== undefined;
    });
    remove_geometry_key_indices(flat, "vertices", vertices_remove_indices);
    return flat;
  };

  var make_vertex_pair_to_edge_map$1 = function make_vertex_pair_to_edge_map(_ref) {
    var edges_vertices = _ref.edges_vertices;
    var map = {};
    edges_vertices.map(function (ev) {
      return ev.sort(function (a, b) {
        return a - b;
      }).join(" ");
    }).forEach(function (key, i) {
      map[key] = i;
    });
    return map;
  };

  var boundary_vertex_walk = function boundary_vertex_walk(_ref, startIndex, neighbor_index) {
    var vertices_vertices = _ref.vertices_vertices;
    var walk = [startIndex, neighbor_index];

    while (walk[0] !== walk[walk.length - 1] && walk[walk.length - 1] !== walk[walk.length - 2]) {
      var next_v_v = vertices_vertices[walk[walk.length - 1]];
      var next_i_v_v = next_v_v.indexOf(walk[walk.length - 2]);
      var next_v = next_v_v[(next_i_v_v + 1) % next_v_v.length];
      walk.push(next_v);
    }

    walk.pop();
    return walk;
  };

  var search_boundary = function search_boundary(graph) {
    if (graph.vertices_coords == null || graph.vertices_coords.length < 1) {
      return [];
    }

    var startIndex = 0;

    for (var i = 1; i < graph.vertices_coords.length; i += 1) {
      if (graph.vertices_coords[i][1] < graph.vertices_coords[startIndex][1]) {
        startIndex = i;
      }
    }

    if (startIndex === -1) {
      return [];
    }

    var adjacent = graph.vertices_vertices[startIndex];
    var adjacent_vectors = adjacent.map(function (a) {
      return [graph.vertices_coords[a][0] - graph.vertices_coords[startIndex][0], graph.vertices_coords[a][1] - graph.vertices_coords[startIndex][1]];
    });
    var adjacent_dot_products = adjacent_vectors.map(function (v) {
      return math$1.core.normalize(v);
    }).map(function (v) {
      return v[0];
    });
    var neighbor_index = -1;
    var counter_max = -Infinity;

    for (var _i = 0; _i < adjacent_dot_products.length; _i += 1) {
      if (adjacent_dot_products[_i] > counter_max) {
        neighbor_index = _i;
        counter_max = adjacent_dot_products[_i];
      }
    }

    var vertices = boundary_vertex_walk(graph, startIndex, adjacent[neighbor_index]);
    var edgeMap = make_vertex_pair_to_edge_map$1(graph);
    var vertices_pairs = vertices.map(function (_, i, arr) {
      return [arr[i], arr[(i + 1) % arr.length]].sort(function (a, b) {
        return a - b;
      }).join(" ");
    });
    var edges = vertices_pairs.map(function (p) {
      return edgeMap[p];
    });
    return edges;
  };

  function vkXML$1(text, step) {
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

  var isBrowser$3 = typeof window !== "undefined" && typeof window.document !== "undefined";
  var isNode$3 = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
  var htmlString$3 = "<!DOCTYPE html><title> </title>";

  var win$3 = function () {
    var w = {};

    if (isNode$3) {
      var _require = require("xmldom"),
          DOMParser = _require.DOMParser,
          XMLSerializer = _require.XMLSerializer;

      w.DOMParser = DOMParser;
      w.XMLSerializer = XMLSerializer;
      w.document = new DOMParser().parseFromString(htmlString$3, "text/html");
    } else if (isBrowser$3) {
      w = window;
    }

    return w;
  }();

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

  function parse(path) {
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

  function Bezier(ax, ay, bx, by, cx, cy, dx, dy) {
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

  function Arc(x0, y0, rx, ry, xAxisRotate, LargeArcFlag, SweepFlag, x, y) {
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

  function LinearPosition(x0, x1, y0, y1) {
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

  function PathProperties(svgString) {
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
    var RESOLUTION = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64;
    var attrs = getAttributes(circle, ["cx", "cy", "r"]);
    var cx = parseFloat(attrs[0]);
    var cy = parseFloat(attrs[1]);
    var r = parseFloat(attrs[2]);
    return Array.from(Array(RESOLUTION)).map(function (_, i) {
      return [cx + r * Math.cos(i / RESOLUTION * Math.PI * 2), cy + r * Math.sin(i / RESOLUTION * Math.PI * 2)];
    }).map(function (_, i, arr) {
      return [arr[i][0], arr[i][1], arr[(i + 1) % arr.length][0], arr[(i + 1) % arr.length][1]];
    });
  };

  var svg_ellipse_to_segments = function svg_ellipse_to_segments(ellipse) {
    var RESOLUTION = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64;
    var attrs = getAttributes(ellipse, ["cx", "cy", "rx", "ry"]);
    var cx = parseFloat(attrs[0]);
    var cy = parseFloat(attrs[1]);
    var rx = parseFloat(attrs[2]);
    var ry = parseFloat(attrs[3]);
    return Array.from(Array(RESOLUTION)).map(function (_, i) {
      return [cx + rx * Math.cos(i / RESOLUTION * Math.PI * 2), cy + ry * Math.sin(i / RESOLUTION * Math.PI * 2)];
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
    var RESOLUTION = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 128;
    var d = path.getAttribute("d");
    var prop = PathProperties(d);
    var length = prop.getTotalLength();
    var isClosed = d[d.length - 1] === "Z" || d[d.length - 1] === "z";
    var segmentLength = isClosed ? length / RESOLUTION : length / (RESOLUTION - 1);
    var pathsPoints = Array.from(Array(RESOLUTION)).map(function (_, i) {
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
  var attributes = {
    line: ["x1", "y1", "x2", "y2"],
    rect: ["x", "y", "width", "height"],
    circle: ["cx", "cy", "r"],
    ellipse: ["cx", "cy", "rx", "ry"],
    polygon: ["points"],
    polyline: ["points"],
    path: ["d"]
  };

  var flattenTree = function flattenTree(element) {
    if (element.tagName === "g" || element.tagName === "svg") {
      if (element.childNodes == null) {
        return [];
      }

      return Array.from(element.childNodes).map(function (child) {
        return flattenTree(child);
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
    }

    return [element];
  };

  var multiply_line_matrix2 = function multiply_line_matrix2(line, matrix) {
    return [line[0] * matrix[0] + line[1] * matrix[2] + matrix[4], line[0] * matrix[1] + line[1] * matrix[3] + matrix[5], line[2] * matrix[0] + line[3] * matrix[2] + matrix[4], line[2] * matrix[1] + line[3] * matrix[3] + matrix[5]];
  };

  var multiply_matrices2$1 = function multiply_matrices2(m1, m2) {
    return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
  };

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

  var transformStringToMatrix = function transformStringToMatrix(string) {
    return parseTransform(string).map(function (el) {
      return matrixForm(el.transform, el.parameters);
    }).filter(function (a) {
      return a !== undefined;
    }).reduce(function (a, b) {
      return multiply_matrices2$1(a, b);
    }, [1, 0, 0, 1, 0, 0]);
  };

  var get_transform_as_matrix = function get_transform_as_matrix(element) {
    if (typeof element.getAttribute !== "function") {
      return [1, 0, 0, 1, 0, 0];
    }

    var transformAttr = element.getAttribute("transform");

    if (transformAttr != null && transformAttr !== "") {
      return transformStringToMatrix(transformAttr);
    }

    return [1, 0, 0, 1, 0, 0];
  };

  var apply_nested_transforms = function apply_nested_transforms(element) {
    var stack = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [1, 0, 0, 1, 0, 0];
    var local = multiply_matrices2$1(stack, get_transform_as_matrix(element));
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

  var attribute_list = function attribute_list(element) {
    return Array.from(element.attributes).filter(function (a) {
      return attributes[element.tagName].indexOf(a.name) === -1;
    });
  };

  var objectifyAttributeList = function objectifyAttributeList(list) {
    var obj = {};
    list.forEach(function (a) {
      obj[a.nodeName] = a.value;
    });
    return obj;
  };

  var segmentize = function segmentize(input) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var RESOLUTION = _typeof(options.resolution) === "object" ? options.resolution : {};

    if (typeof options.resolution === "number") {
      ["circle", "ellipse", "path"].forEach(function (k) {
        RESOLUTION[k] = options.resolution;
      });
    }

    apply_nested_transforms(input);
    var elements = flattenTree(input);
    var lineSegments = elements.filter(function (el) {
      return parseable.indexOf(el.tagName) !== -1;
    }).map(function (el) {
      return parsers[el.tagName](el, RESOLUTION[el.tagName]).map(function (unit) {
        return multiply_line_matrix2(unit, el.matrix);
      }).map(function (unit) {
        return [].concat(_toConsumableArray(unit), [attribute_list(el)]);
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
    return lineSegments;
  };

  var svgNS$1 = "http://www.w3.org/2000/svg";
  var svgAttributes = ["version", "xmlns", "contentScriptType", "contentStyleType", "baseProfile", "class", "externalResourcesRequired", "x", "y", "width", "height", "viewBox", "preserveAspectRatio", "zoomAndPan", "style"];
  var headerTagNames = {
    "defs": true,
    "metadata": true,
    "title": true,
    "desc": true,
    "style": true
  };

  var segmentsToSVG = function segmentsToSVG(lineSegments, inputSVG) {
    var newSVG = win$3.document.createElementNS(svgNS$1, "svg");

    if (inputSVG !== undefined) {
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
    }

    if (newSVG.getAttribute("xmlns") === null) {
      newSVG.setAttribute("xmlns", svgNS$1);
    }

    Array.from(inputSVG.childNodes).filter(function (el) {
      return headerTagNames[el.tagName];
    }).map(function (el) {
      return el.cloneNode(true);
    }).forEach(function (el) {
      return newSVG.appendChild(el);
    });
    lineSegments.forEach(function (s) {
      var line = win$3.document.createElementNS(svgNS$1, "line");
      attributes.line.forEach(function (attr, i) {
        return line.setAttributeNS(null, attr, s[i]);
      });

      if (s[4] != null) {
        Object.keys(s[4]).forEach(function (key) {
          return line.setAttribute(key, s[4][key]);
        });
      }

      newSVG.appendChild(line);
    });
    return newSVG;
  };

  var defaults = Object.freeze({
    input: "string",
    output: "string",
    resolution: Object.freeze({
      circle: 64,
      ellipse: 64,
      path: 128
    })
  });

  var xmlStringToDOM = function xmlStringToDOM(input) {
    return typeof input === "string" || input instanceof String ? new win$3.DOMParser().parseFromString(input, "text/xml").documentElement : input;
  };

  var Segmentize = function Segmentize(input) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaults;
    var inputSVG = options.input === "svg" ? input : xmlStringToDOM(input);
    var lineSegments = segmentize(inputSVG, options);

    if (options.output === "data") {
      return lineSegments;
    }

    var newSVG = segmentsToSVG(lineSegments, inputSVG);

    if (options.output === "svg") {
      return newSVG;
    }

    var stringified = new win$3.XMLSerializer().serializeToString(newSVG);
    return vkXML$1(stringified);
  };

  var FOLD = {
    convert: convert
  };
  var assignment_foldAngle = {
    V: 180,
    v: 180,
    M: -180,
    m: -180
  };

  var assignment_to_foldAngle = function assignment_to_foldAngle(assignment) {
    return assignment_foldAngle[assignment] || 0;
  };

  var emptyFOLD = function emptyFOLD() {
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

  var svg_to_fold = function svg_to_fold(svg, options) {
    var pre_frag = emptyFOLD();
    var v0 = pre_frag.vertices_coords.length;
    var segments = Segmentize(svg, {
      output: "data"
    });
    pre_frag.vertices_coords = segments.map(function (s) {
      return [[s[0], s[1]], [s[2], s[3]]];
    }).reduce(function (a, b) {
      return a.concat(b);
    }, pre_frag.vertices_coords);
    pre_frag.edges_vertices = segments.map(function (_, i) {
      return [v0 + i * 2, v0 + i * 2 + 1];
    });
    pre_frag.edges_assignment = segments.map(function (a) {
      return a[4];
    }).map(function (attrs) {
      return attrs != null ? color_to_assignment(attrs.stroke) : "U";
    });
    var graph = fragment(pre_frag, options.epsilon);
    FOLD.convert.edges_vertices_to_vertices_vertices_sorted(graph);
    FOLD.convert.vertices_vertices_to_faces_vertices(graph);
    FOLD.convert.faces_vertices_to_faces_edges(graph);
    graph.edges_foldAngle = graph.edges_assignment.map(function (a) {
      return assignment_to_foldAngle(a);
    });

    if (options.boundary !== false) {
      search_boundary(graph).forEach(function (edgeIndex) {
        graph.edges_assignment[edgeIndex] = "B";
      });
    }

    return graph;
  };

  var SVGtoFOLD = function SVGtoFOLD(input) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof input === "string") {
      var svg = new win$2.DOMParser().parseFromString(input, "text/xml").documentElement;
      return svg_to_fold(svg, options);
    }

    return svg_to_fold(input, options);
  };

  SVGtoFOLD.core = {
    segmentize: function segmentize() {},
    fragment: fragment
  };

  var from_to = function from_to(data, from, to) {
    for (var _len = arguments.length, args = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      args[_key - 3] = arguments[_key];
    }

    switch (from) {
      case "fold":
        switch (to) {
          case "fold":
            return data;

          case "oripa":
            return oripa.fromFold(data);

          case "svg":
            return FoldToSvg.apply(void 0, [data].concat(args));
        }

        break;

      case "oripa":
        switch (to) {
          case "fold":
            return oripa.toFold(data, true);

          case "oripa":
            return data;

          case "svg":
            return FoldToSvg.apply(void 0, [oripa.toFold(data, true)].concat(args));
        }

        break;

      case "svg":
        switch (to) {
          case "fold":
            return SVGtoFOLD.apply(void 0, [data].concat(args));

          case "oripa":
            return oripa.fromFold(SVGtoFOLD.apply(void 0, [data].concat(args)));

          case "svg":
            return data;
        }

        break;
    }

    return undefined;
  };

  var capitalized = function capitalized(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  var permute = function permute(string) {
    var lower = string.toLowerCase();
    var upper = string.toUpperCase();
    var capital = capitalized(lower);
    var variations = [lower, upper, capital];
    var prefixes = ["", "to", "into"];
    return prefixes.map(function (pre) {
      return variations.map(function (v) {
        return pre + v;
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
  };

  var convert$1 = function convert() {
    var loaded = load.apply(void 0, arguments);
    var c = {};
    ["fold", "svg", "oripa"].forEach(function (filetype) {
      return permute(filetype).forEach(function (key) {
        return Object.defineProperty(c, key, {
          value: function value() {
            for (var _len = arguments.length, o = new Array(_len), _key = 0; _key < _len; _key++) {
              o[_key] = arguments[_key];
            }

            return from_to.apply(void 0, [loaded.data, loaded.type, filetype].concat(o));
          }
        });
      });
    });
    return c;
  };

  var metadata = function metadata() {
    var complete = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return !complete ? {
      file_spec: file_spec,
      file_creator: file_creator
    } : {
      file_spec: file_spec,
      file_creator: file_creator,
      file_author: "",
      file_title: "",
      file_description: "",
      file_classes: [],
      file_frames: [],
      frame_description: "",
      frame_attributes: [],
      frame_classes: [],
      frame_unit: ""
    };
  };

  var default_re_extensions = function default_re_extensions() {
    var number_faces = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return {
      "faces_re:layer": Array.from(Array(number_faces)).map(function (_, i) {
        return i;
      }),
      "faces_re:matrix": Array.from(Array(number_faces)).map(function () {
        return [1, 0, 0, 1, 0, 0];
      })
    };
  };

  var cp_type = function cp_type() {
    return {
      file_classes: ["singleModel"],
      frame_attributes: ["2D"],
      frame_classes: ["creasePattern"]
    };
  };

  var square_graph = function square_graph() {
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
      faces_edges: [[0, 1, 2, 3]]
    };
  };

  var empty = function empty() {
    var prototype = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    return Object.assign(Object.create(prototype), metadata());
  };
  var square = function square() {
    var prototype = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    return Object.assign(Object.create(prototype), metadata(), cp_type(), square_graph(), default_re_extensions(1));
  };
  var rectangle = function rectangle() {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var graph = square_graph();
    graph.vertices_coords = [[0, 0], [width, 0], [width, height], [0, height]];
    graph.edges_length = [width, height, width, height];
    return Object.assign(Object.create(null), metadata(), cp_type(), graph, default_re_extensions(1));
  };
  var regular_polygon = function regular_polygon(sides) {
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var arr = Array.from(Array(sides));
    var angle = 2 * Math.PI / sides;
    var sideLength = math.core.clean_number(Math.sqrt(Math.pow(radius - radius * Math.cos(angle), 2) + Math.pow(radius * Math.sin(angle), 2)));
    var graph = {
      vertices_coords: arr.map(function (_, i) {
        return angle * i;
      }).map(function (a) {
        return [math.core.clean_number(radius * Math.cos(a)), math.core.clean_number(radius * Math.sin(a))];
      }),
      vertices_vertices: arr.map(function (_, i) {
        return [(i + 1) % arr.length, (i + arr.length - 1) % arr.length];
      }),
      vertices_faces: arr.map(function () {
        return [0];
      }),
      edges_vertices: arr.map(function (_, i) {
        return [i, (i + 1) % arr.length];
      }),
      edges_faces: arr.map(function () {
        return [0];
      }),
      edges_assignment: arr.map(function () {
        return "B";
      }),
      edges_foldAngle: arr.map(function () {
        return 0;
      }),
      edges_length: arr.map(function () {
        return sideLength;
      }),
      faces_vertices: [arr.map(function (_, i) {
        return i;
      })],
      faces_edges: [arr.map(function (_, i) {
        return i;
      })]
    };
    return Object.assign(Object.create(null), metadata(), cp_type(), graph, default_re_extensions(1));
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
  var recursive_freeze$1 = function recursive_freeze(input) {
    Object.freeze(input);

    if (input === undefined) {
      return input;
    }

    Object.getOwnPropertyNames(input).filter(function (prop) {
      return input[prop] !== null && (_typeof(input[prop]) === "object" || typeof input[prop] === "function") && !Object.isFrozen(input[prop]);
    }).forEach(function (prop) {
      return recursive_freeze(input[prop]);
    });
    return input;
  };

  var object$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clone: clone$1,
    recursive_freeze: recursive_freeze$1
  });

  var make_vertices_edges$1 = function make_vertices_edges(_ref) {
    var edges_vertices = _ref.edges_vertices;

    if (!edges_vertices) {
      return undefined;
    }

    var vertices_edges = [];
    edges_vertices.forEach(function (ev, i) {
      return ev.forEach(function (v) {
        if (vertices_edges[v] === undefined) {
          vertices_edges[v] = [];
        }

        vertices_edges[v].push(i);
      });
    });
    return vertices_edges;
  };
  var make_edges_vertices = function make_edges_vertices(_ref2) {
    var edges_vertices = _ref2.edges_vertices,
        faces_edges = _ref2.faces_edges;

    if (!edges_vertices || !faces_edges) {
      return undefined;
    }

    var edges_faces = Array.from(Array(edges_vertices.length)).map(function () {
      return [];
    });
    faces_edges.forEach(function (face, f) {
      var hash = [];
      face.forEach(function (edge) {
        hash[edge] = f;
      });
      hash.forEach(function (fa, e) {
        return edges_faces[e].push(fa);
      });
    });
    return edges_faces;
  };
  var make_faces_faces$1 = function make_faces_faces(_ref3) {
    var faces_vertices = _ref3.faces_vertices;

    if (!faces_vertices) {
      return undefined;
    }

    var nf = faces_vertices.length;
    var faces_faces = Array.from(Array(nf)).map(function () {
      return [];
    });
    var edgeMap = {};
    faces_vertices.forEach(function (vertices_index, idx1) {
      if (vertices_index === undefined) {
        return;
      }

      var n = vertices_index.length;
      vertices_index.forEach(function (v1, i, vs) {
        var v2 = vs[(i + 1) % n];

        if (v2 < v1) {
          var _ref4 = [v2, v1];
          v1 = _ref4[0];
          v2 = _ref4[1];
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
  var make_edges_edges = function make_edges_edges(_ref5) {
    var edges_vertices = _ref5.edges_vertices,
        vertices_edges = _ref5.vertices_edges;

    if (!edges_vertices || !vertices_edges) {
      return undefined;
    }

    return edges_vertices.map(function (ev, i) {
      var vert0 = ev[0];
      var vert1 = ev[1];
      var side0 = vertices_edges[vert0].filter(function (e) {
        return e !== i;
      });
      var side1 = vertices_edges[vert1].filter(function (e) {
        return e !== i;
      });
      return side0.concat(side1);
    });
  };
  var make_edges_faces = function make_edges_faces(_ref6) {
    var edges_vertices = _ref6.edges_vertices,
        faces_edges = _ref6.faces_edges;

    if (!edges_vertices || !faces_edges) {
      return undefined;
    }

    var edges_faces = Array.from(Array(edges_vertices.length)).map(function () {
      return [];
    });
    faces_edges.forEach(function (face, f) {
      var hash = [];
      face.forEach(function (edge) {
        hash[edge] = f;
      });
      hash.forEach(function (fa, e) {
        return edges_faces[e].push(fa);
      });
    });
    return edges_faces;
  };
  var make_edges_length = function make_edges_length(_ref7) {
    var vertices_coords = _ref7.vertices_coords,
        edges_vertices = _ref7.edges_vertices;

    if (!vertices_coords || !edges_vertices) {
      return undefined;
    }

    return edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    }).map(function (edge) {
      var _math$core;

      return (_math$core = math.core).distance.apply(_math$core, _toConsumableArray(edge));
    });
  };
  var assignment_angles$1 = {
    M: -180,
    m: -180,
    V: 180,
    v: 180
  };
  var make_edges_foldAngle = function make_edges_foldAngle(_ref8) {
    var edges_assignment = _ref8.edges_assignment;

    if (!edges_assignment) {
      return undefined;
    }

    return edges_assignment.map(function (a) {
      return assignment_angles$1[a] || 0;
    });
  };
  var make_vertex_pair_to_edge_map$2 = function make_vertex_pair_to_edge_map(_ref9) {
    var edges_vertices = _ref9.edges_vertices;

    if (!edges_vertices) {
      return {};
    }

    var map = {};
    edges_vertices.map(function (ev) {
      return ev.sort(function (a, b) {
        return a - b;
      }).join(" ");
    }).forEach(function (key, i) {
      map[key] = i;
    });
    return map;
  };
  var make_vertices_faces = function make_vertices_faces(_ref10) {
    var vertices_coords = _ref10.vertices_coords,
        faces_vertices = _ref10.faces_vertices;

    if (!vertices_coords || !faces_vertices) {
      return undefined;
    }

    var vertices_faces = Array.from(Array(vertices_coords.length)).map(function () {
      return [];
    });
    faces_vertices.forEach(function (face, f) {
      var hash = [];
      face.forEach(function (vertex) {
        hash[vertex] = f;
      });
      hash.forEach(function (fa, v) {
        return vertices_faces[v].push(fa);
      });
    });
    return vertices_faces;
  };
  var make_face_walk_tree$1 = function make_face_walk_tree(graph) {
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var edge_map = make_vertex_pair_to_edge_map$2(graph);
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

  var is_mark = function is_mark(a) {
    return a === "f" || a === "F" || a === "u" || a === "U";
  };

  var make_faces_matrix = function make_faces_matrix(graph, root_face) {
    if (graph.faces_vertices == null || graph.edges_vertices == null) {
      return undefined;
    }

    var skip_marks = "edges_assignment" in graph === true;
    var edge_fold = skip_marks ? graph.edges_assignment.map(function (a) {
      return !is_mark(a);
    }) : graph.edges_vertices.map(function () {
      return true;
    });
    var faces_matrix = graph.faces_vertices.map(function () {
      return [1, 0, 0, 1, 0, 0];
    });
    make_face_walk_tree$1(graph, root_face).forEach(function (level) {
      level.filter(function (entry) {
        return entry.parent != null;
      }).forEach(function (entry) {
        var verts = entry.edge_vertices.map(function (v) {
          return graph.vertices_coords[v];
        });
        var vec = [verts[1][0] - verts[0][0], verts[1][1] - verts[0][1]];
        var local = edge_fold[entry.edge] ? math.core.make_matrix2_reflection(vec, verts[0]) : [1, 0, 0, 1, 0, 0];
        faces_matrix[entry.face] = math.core.multiply_matrices2(faces_matrix[entry.parent], local);
      });
    });
    return faces_matrix;
  };
  var make_faces_matrix_inv = function make_faces_matrix_inv(graph, root_face) {
    var edge_fold = "edges_assignment" in graph === true ? graph.edges_assignment.map(function (a) {
      return !is_mark(a);
    }) : graph.edges_vertices.map(function () {
      return true;
    });
    var faces_matrix = graph.faces_vertices.map(function () {
      return [1, 0, 0, 1, 0, 0];
    });
    make_face_walk_tree$1(graph, root_face).forEach(function (level) {
      level.filter(function (entry) {
        return entry.parent != null;
      }).forEach(function (entry) {
        var verts = entry.edge_vertices.map(function (v) {
          return graph.vertices_coords[v];
        });
        var vec = [verts[1][0] - verts[0][0], verts[1][1] - verts[0][1]];
        var local = edge_fold[entry.edge] ? math.core.make_matrix2_reflection(vec, verts[0]) : [1, 0, 0, 1, 0, 0];
        faces_matrix[entry.face] = math.core.multiply_matrices2(local, faces_matrix[entry.parent]);
      });
    });
    return faces_matrix;
  };
  var make_vertices_coords_folded = function make_vertices_coords_folded(graph, face_stationary, faces_matrix) {
    if (graph.vertices_coords == null || graph.faces_vertices == null) {
      return undefined;
    }

    if (face_stationary == null) {
      face_stationary = 0;
    }

    if (faces_matrix == null) {
      faces_matrix = make_faces_matrix(graph, face_stationary);
    } else {
      var face_array = graph.faces_vertices != null ? graph.faces_vertices : graph.faces_edges;
      var facesCount = face_array != null ? face_array.length : 0;

      if (faces_matrix.length !== facesCount) {
        faces_matrix = make_faces_matrix(graph, face_stationary);
      }
    }

    var vertex_in_face = graph.vertices_coords.map(function (v, i) {
      for (var f = 0; f < graph.faces_vertices.length; f += 1) {
        if (graph.faces_vertices[f].includes(i)) {
          return f;
        }
      }

      return face_stationary;
    });
    return graph.vertices_coords.map(function (point, i) {
      return math.core.multiply_matrix2_vector2(faces_matrix[vertex_in_face[i]], point).map(function (n) {
        return math.core.clean_number(n);
      });
    });
  };
  var make_vertices_isBoundary = function make_vertices_isBoundary(graph) {
    var vertices_edges = make_vertices_edges$1(graph);
    var edges_isBoundary = graph.edges_assignment.map(function (a) {
      return a === "b" || a === "B";
    });
    return vertices_edges.map(function (edges) {
      return edges.map(function (e) {
        return edges_isBoundary[e];
      }).reduce(function (a, b) {
        return a || b;
      }, false);
    });
  };
  var make_faces_coloring_from_faces_matrix$1 = function make_faces_coloring_from_faces_matrix(faces_matrix) {
    return faces_matrix.map(function (m) {
      return m[0] * m[3] - m[1] * m[2];
    }).map(function (c) {
      return c >= 0;
    });
  };
  var make_faces_coloring$1 = function make_faces_coloring(graph) {
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var coloring = [];
    coloring[root_face] = true;
    make_face_walk_tree$1(graph, root_face).forEach(function (level, i) {
      return level.forEach(function (entry) {
        coloring[entry.face] = i % 2 === 0;
      });
    });
    return coloring;
  };

  var make = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_vertices_edges: make_vertices_edges$1,
    make_edges_vertices: make_edges_vertices,
    make_faces_faces: make_faces_faces$1,
    make_edges_edges: make_edges_edges,
    make_edges_faces: make_edges_faces,
    make_edges_length: make_edges_length,
    make_edges_foldAngle: make_edges_foldAngle,
    make_vertex_pair_to_edge_map: make_vertex_pair_to_edge_map$2,
    make_vertices_faces: make_vertices_faces,
    make_face_walk_tree: make_face_walk_tree$1,
    make_faces_matrix: make_faces_matrix,
    make_faces_matrix_inv: make_faces_matrix_inv,
    make_vertices_coords_folded: make_vertices_coords_folded,
    make_vertices_isBoundary: make_vertices_isBoundary,
    make_faces_coloring_from_faces_matrix: make_faces_coloring_from_faces_matrix$1,
    make_faces_coloring: make_faces_coloring$1
  });

  var max_array_length$1 = function max_array_length() {
    for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
      arrays[_key] = arguments[_key];
    }

    return Math.max.apply(Math, _toConsumableArray(arrays.filter(function (el) {
      return el !== undefined;
    }).map(function (el) {
      return el.length;
    })));
  };

  var vertices_count$1 = function vertices_count(_ref) {
    var vertices_coords = _ref.vertices_coords,
        vertices_faces = _ref.vertices_faces,
        vertices_vertices = _ref.vertices_vertices;
    return max_array_length$1([], vertices_coords, vertices_faces, vertices_vertices);
  };
  var edges_count$1 = function edges_count(_ref2) {
    var edges_vertices = _ref2.edges_vertices,
        edges_faces = _ref2.edges_faces;
    return max_array_length$1([], edges_vertices, edges_faces);
  };
  var faces_count$1 = function faces_count(_ref3) {
    var faces_vertices = _ref3.faces_vertices,
        faces_edges = _ref3.faces_edges;
    return max_array_length$1([], faces_vertices, faces_edges);
  };
  var implied_vertices_count = function implied_vertices_count(_ref4) {
    var faces_vertices = _ref4.faces_vertices,
        edges_vertices = _ref4.edges_vertices;
    var max = -1;
    [faces_vertices, edges_vertices].filter(function (a) {
      return a !== undefined;
    }).forEach(function (arr) {
      return arr.forEach(function (el) {
        return el.forEach(function (e) {
          if (e > max) {
            max = e;
          }
        });
      });
    });
    return max + 1;
  };
  var implied_edges_count = function implied_edges_count(_ref5) {
    var faces_edges = _ref5.faces_edges,
        vertices_edges = _ref5.vertices_edges,
        edgeOrders = _ref5.edgeOrders;
    var max = -1;
    [faces_edges, vertices_edges].filter(function (a) {
      return a !== undefined;
    }).forEach(function (arr) {
      return arr.forEach(function (el) {
        return el.forEach(function (e) {
          if (e > max) {
            max = e;
          }
        });
      });
    });

    if (edgeOrders !== undefined) {
      edgeOrders.forEach(function (eo) {
        return eo.forEach(function (e, i) {
          if (i !== 2 && e > max) {
            max = e;
          }
        });
      });
    }

    return max + 1;
  };
  var implied_faces_count = function implied_faces_count(_ref6) {
    var vertices_faces = _ref6.vertices_faces,
        edges_faces = _ref6.edges_faces,
        facesOrders = _ref6.facesOrders;
    var max = -1;
    [vertices_faces, edges_faces].filter(function (a) {
      return a !== undefined;
    }).forEach(function (arr) {
      return arr.forEach(function (el) {
        return el.forEach(function (f) {
          if (f > max) {
            max = f;
          }
        });
      });
    });

    if (facesOrders !== undefined) {
      facesOrders.forEach(function (fo) {
        return fo.forEach(function (f, i) {
          if (i !== 2 && f > max) {
            max = f;
          }
        });
      });
    }

    return max + 1;
  };
  var nearest_vertex = function nearest_vertex(_ref7, point) {
    var vertices_coords = _ref7.vertices_coords;

    if (vertices_coords === undefined || vertices_coords.length === 0) {
      return undefined;
    }

    var p = _toConsumableArray(point);

    if (p[2] == null) {
      p[2] = 0;
    }

    return vertices_coords.map(function (v) {
      return v.map(function (n, i) {
        return Math.pow(n - p[i], 2);
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    }).map(function (n, i) {
      return {
        d: Math.sqrt(n),
        i: i
      };
    }).sort(function (a, b) {
      return a.d - b.d;
    }).shift().i;
  };
  var nearest_edge = function nearest_edge(_ref8, point) {
    var vertices_coords = _ref8.vertices_coords,
        edges_vertices = _ref8.edges_vertices;

    if (vertices_coords == null || vertices_coords.length === 0 || edges_vertices == null || edges_vertices.length === 0) {
      return undefined;
    }

    var edge_limit = function edge_limit(dist) {
      if (dist < -math.core.EPSILON) {
        return 0;
      }

      if (dist > 1 + math.core.EPSILON) {
        return 1;
      }

      return dist;
    };

    var nearest_points = edges_vertices.map(function (e) {
      return e.map(function (ev) {
        return vertices_coords[ev];
      });
    }).map(function (e) {
      return [e[0], [e[1][0] - e[0][0], e[1][1] - e[0][1]]];
    }).map(function (line) {
      return math.core.nearest_point_on_line(line[0], line[1], point, edge_limit);
    }).map(function (p, i) {
      return {
        p: p,
        i: i,
        d: math.core.distance2(point, p)
      };
    });
    var shortest_index;
    var shortest_distance = Infinity;

    for (var i = 0; i < nearest_points.length; i += 1) {
      if (nearest_points[i].d < shortest_distance) {
        shortest_index = i;
        shortest_distance = nearest_points[i].d;
      }
    }

    return shortest_index;
  };
  var face_containing_point = function face_containing_point(_ref9, point) {
    var vertices_coords = _ref9.vertices_coords,
        faces_vertices = _ref9.faces_vertices;

    if (vertices_coords == null || vertices_coords.length === 0 || faces_vertices == null || faces_vertices.length === 0) {
      return undefined;
    }

    var face = faces_vertices.map(function (fv, i) {
      return {
        face: fv.map(function (v) {
          return vertices_coords[v];
        }),
        i: i
      };
    }).filter(function (f) {
      return math.core.point_in_poly(point, f.face);
    }).shift();
    return face == null ? undefined : face.i;
  };
  var folded_faces_containing_point = function folded_faces_containing_point(_ref10, point, faces_matrix) {
    var vertices_coords = _ref10.vertices_coords,
        faces_vertices = _ref10.faces_vertices;
    var transformed_points = faces_matrix.map(function (m) {
      return math.core.multiply_matrix2_vector2(m, point);
    });
    return faces_vertices.map(function (fv, i) {
      return {
        face: fv.map(function (v) {
          return vertices_coords[v];
        }),
        i: i
      };
    }).filter(function (f, i) {
      return math.core.intersection.point_in_poly(transformed_points[i], f.face);
    }).map(function (f) {
      return f.i;
    });
  };
  var faces_containing_point = function faces_containing_point(_ref11, point) {
    var vertices_coords = _ref11.vertices_coords,
        faces_vertices = _ref11.faces_vertices;
    return faces_vertices.map(function (fv, i) {
      return {
        face: fv.map(function (v) {
          return vertices_coords[v];
        }),
        i: i
      };
    }).filter(function (f) {
      return math.core.point_in_poly(point, f.face);
    }).map(function (f) {
      return f.i;
    });
  };
  var topmost_face = function topmost_face(graph, faces) {
    if (faces == null) {
      faces = Array.from(Array(faces_count$1(graph))).map(function (_, i) {
        return i;
      });
    }

    if (faces.length === 0) {
      return undefined;
    }

    if (faces.length === 1) {
      return faces[0];
    }

    var faces_in_order = graph["faces_re:layer"].map(function (layer, i) {
      return {
        layer: layer,
        i: i
      };
    }).sort(function (a, b) {
      return b.layer - a.layer;
    }).map(function (el) {
      return el.i;
    });

    for (var i = 0; i < faces_in_order.length; i += 1) {
      if (faces.includes(faces_in_order[i])) {
        return faces_in_order[i];
      }
    }

    return undefined;
  };
  var get_collinear_vertices = function get_collinear_vertices(_ref12) {
    var edges_vertices = _ref12.edges_vertices,
        vertices_coords = _ref12.vertices_coords;
    var vertices_edges = make_vertices_edges$1({
      edges_vertices: edges_vertices
    });
    return Array.from(Array(vertices_coords.length)).map(function (_, i) {
      return i;
    }).filter(function () {
      return vertices_edges.length === 2;
    }).map(function (v) {
      var edges = vertices_edges[v];
      var a = edges[0][0] === v ? edges[0][1] : edges[0][0];
      var b = edges[1][0] === v ? edges[1][1] : edges[1][0];
      var av = math.core.distance2(vertices_coords[a], vertices_coords[v]);
      var bv = math.core.distance2(vertices_coords[b], vertices_coords[v]);
      var ab = math.core.distance2(vertices_coords[a], vertices_coords[b]);
      return Math.abs(ab - av - bv) < math.core.EPSILON ? v : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var get_isolated_vertices = function get_isolated_vertices(_ref13) {
    var edges_vertices = _ref13.edges_vertices,
        vertices_coords = _ref13.vertices_coords;
    var vertices_size = vertices_coords.length;
    var isolated = Array(vertices_size).fill(true);
    var set_count = vertices_size;

    for (var i = 0; i < edges_vertices.length && set_count > 0; i += 1) {
      for (var e = 0; e < edges_vertices[i].length; e += 1) {
        var v = edges_vertices[i][e];

        if (isolated[v]) {
          set_count -= 1;
          isolated[v] = false;
        }
      }
    }

    if (set_count === 0) {
      return [];
    }

    return isolated.map(function (el, i) {
      return el ? i : undefined;
    }).filter(function (el) {
      return el !== undefined;
    });
  };
  var get_duplicate_vertices = function get_duplicate_vertices(_ref14) {
    var vertices_coords = _ref14.vertices_coords;
    var vertices_equivalent = Array.from(Array(vertices_coords.length)).map(function () {
      return [];
    });

    for (var i = 0; i < vertices_coords.length - 1; i += 1) {
      for (var j = i + 1; j < vertices_coords.length; j += 1) {
        vertices_equivalent[i][j] = math.core.equivalent_vectors(vertices_coords[i], vertices_coords[j]);
      }
    }

    var vertices_map = vertices_coords.map(function () {
      return undefined;
    });
    vertices_equivalent.forEach(function (row, i) {
      return row.forEach(function (eq, j) {
        if (eq) {
          vertices_map[j] = vertices_map[i] === undefined ? i : vertices_map[i];
        }
      });
    });
    var vertices_remove = vertices_map.map(function (m) {
      return m !== undefined;
    });
    vertices_map.forEach(function (map, i) {
      if (map === undefined) {
        vertices_map[i] = i;
      }
    });
    return vertices_remove.map(function (rm, i) {
      return rm ? i : undefined;
    }).filter(function (i) {
      return i !== undefined;
    });
  };
  var get_duplicate_edges = function get_duplicate_edges(_ref15) {
    var edges_vertices = _ref15.edges_vertices;

    var equivalent2 = function equivalent2(a, b) {
      return a[0] === b[0] && a[1] === b[1] || a[0] === b[1] && a[1] === b[0];
    };

    var edges_equivalent = Array.from(Array(edges_vertices.length)).map(function () {
      return [];
    });

    for (var i = 0; i < edges_vertices.length - 1; i += 1) {
      for (var j = i + 1; j < edges_vertices.length; j += 1) {
        edges_equivalent[i][j] = equivalent2(edges_vertices[i], edges_vertices[j]);
      }
    }

    var edges_map = [];
    edges_equivalent.forEach(function (row, i) {
      return row.forEach(function (eq, j) {
        if (eq) {
          edges_map[j] = edges_map[i] === undefined ? i : edges_map[i];
        }
      });
    });
    return edges_map;
  };
  var get_duplicate_edges_old = function get_duplicate_edges_old(graph) {
    var equivalent2 = function equivalent2(a, b) {
      return a[0] === b[0] && a[1] === b[1] || a[0] === b[1] && a[1] === b[0];
    };

    var edges_equivalent = Array.from(Array(graph.edges_vertices.length)).map(function () {
      return [];
    });

    for (var i = 0; i < graph.edges_vertices.length - 1; i += 1) {
      for (var j = i + 1; j < graph.edges_vertices.length; j += 1) {
        edges_equivalent[i][j] = equivalent2(graph.edges_vertices[i], graph.edges_vertices[j]);
      }
    }

    var edges_map = graph.edges_vertices.map(function () {
      return undefined;
    });
    edges_equivalent.forEach(function (row, i) {
      return row.forEach(function (eq, j) {
        if (eq) {
          edges_map[j] = edges_map[i] === undefined ? i : edges_map[i];
        }
      });
    });
    var edges_remove = edges_map.map(function (m) {
      return m !== undefined;
    });
    edges_map.forEach(function (map, i) {
      if (map === undefined) {
        edges_map[i] = i;
      }
    });
    return edges_remove.map(function (rm, i) {
      return rm ? i : undefined;
    }).filter(function (i) {
      return i !== undefined;
    });
  };
  var find_collinear_face_edges = function find_collinear_face_edges(edge, face_vertices, vertices_coords) {
    var face_edge_geometry = face_vertices.map(function (v) {
      return vertices_coords[v];
    }).map(function (v, i, arr) {
      return [v, arr[(i + 1) % arr.length]];
    });
    return edge.map(function (endPt) {
      var i = face_edge_geometry.map(function (edgeVerts, edgeI) {
        return {
          index: edgeI,
          edge: edgeVerts
        };
      }).filter(function (e) {
        return math.core.intersection.point_on_edge(e.edge[0], e.edge[1], endPt);
      }).shift().index;
      return [face_vertices[i], face_vertices[(i + 1) % face_vertices.length]].sort(function (a, b) {
        return a - b;
      });
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

  var max_array_length$2 = function max_array_length() {
    for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
      arrays[_key] = arguments[_key];
    }

    return Math.max.apply(Math, _toConsumableArray(arrays.filter(function (el) {
      return el !== undefined;
    }).map(function (el) {
      return el.length;
    })));
  };

  var vertices_count$2 = function vertices_count(_ref) {
    var vertices_coords = _ref.vertices_coords,
        vertices_faces = _ref.vertices_faces,
        vertices_vertices = _ref.vertices_vertices;
    return max_array_length$2([], vertices_coords, vertices_faces, vertices_vertices);
  };

  var edges_count$2 = function edges_count(_ref2) {
    var edges_vertices = _ref2.edges_vertices,
        edges_faces = _ref2.edges_faces;
    return max_array_length$2([], edges_vertices, edges_faces);
  };

  var faces_count$2 = function faces_count(_ref3) {
    var faces_vertices = _ref3.faces_vertices,
        faces_edges = _ref3.faces_edges;
    return max_array_length$2([], faces_vertices, faces_edges);
  };

  var get_geometry_length$1 = {
    vertices: vertices_count$2,
    edges: edges_count$2,
    faces: faces_count$2
  };

  var remove_geometry_key_indices$1 = function remove_geometry_key_indices(graph, key, removeIndices) {
    var geometry_array_size = get_geometry_length$1[key](graph);
    var removes = Array(geometry_array_size).fill(false);
    removeIndices.forEach(function (v) {
      removes[v] = true;
    });
    var s = 0;
    var index_map = removes.map(function (remove) {
      return remove ? --s : s;
    });

    if (removeIndices.length === 0) {
      return index_map;
    }

    var prefix = "".concat(key, "_");
    var suffix = "_".concat(key);
    var graph_keys = Object.keys(graph);
    var prefixKeys = graph_keys.map(function (str) {
      return str.substring(0, prefix.length) === prefix ? str : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
    var suffixKeys = graph_keys.map(function (str) {
      return str.substring(str.length - suffix.length, str.length) === suffix ? str : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
    suffixKeys.forEach(function (sKey) {
      return graph[sKey].forEach(function (_, i) {
        return graph[sKey][i].forEach(function (v, j) {
          graph[sKey][i][j] += index_map[v];
        });
      });
    });
    prefixKeys.forEach(function (pKey) {
      graph[pKey] = graph[pKey].filter(function (_, i) {
        return !removes[i];
      });
    });
    return index_map;
  };

  var bounding_rect$1 = function bounding_rect(_ref) {
    var vertices_coords = _ref.vertices_coords;

    if (vertices_coords == null || vertices_coords.length <= 0) {
      return [0, 0, 0, 0];
    }

    var dimension = vertices_coords[0].length;
    var min = Array(dimension).fill(Infinity);
    var max = Array(dimension).fill(-Infinity);
    vertices_coords.forEach(function (v) {
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
  var get_boundary$1 = function get_boundary(graph) {
    if (graph.edges_assignment == null) {
      return {
        vertices: [],
        edges: []
      };
    }

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

  var are_vertices_equivalent = function are_vertices_equivalent(a, b) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.core.EPSILON;
    var max = a.length < 2 ? a.length : 2;

    for (var i = 0; i < max; i += 1) {
      if (Math.abs(a[i] - b[i]) > epsilon) {
        return false;
      }
    }

    return true;
  };

  var point_on_edge_exclusive$1 = function point_on_edge_exclusive(point, edge0, edge1) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.core.EPSILON;
    var edge0_1 = [edge0[0] - edge1[0], edge0[1] - edge1[1]];
    var edge0_p = [edge0[0] - point[0], edge0[1] - point[1]];
    var edge1_p = [edge1[0] - point[0], edge1[1] - point[1]];
    var dEdge = Math.sqrt(edge0_1[0] * edge0_1[0] + edge0_1[1] * edge0_1[1]);
    var dP0 = Math.sqrt(edge0_p[0] * edge0_p[0] + edge0_p[1] * edge0_p[1]);
    var dP1 = Math.sqrt(edge1_p[0] * edge1_p[0] + edge1_p[1] * edge1_p[1]);
    return Math.abs(dEdge - dP0 - dP1) < epsilon;
  };

  var edges_vertices_equivalent$1 = function edges_vertices_equivalent(a, b) {
    return a[0] === b[0] && a[1] === b[1] || a[0] === b[1] && a[1] === b[0];
  };

  var make_edges_collinearVertices$1 = function make_edges_collinearVertices(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var edges = edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    });
    return edges.map(function (e) {
      return vertices_coords.filter(function (v) {
        return point_on_edge_exclusive$1(v, e[0], e[1], epsilon);
      });
    });
  };

  var make_edges_alignment$1 = function make_edges_alignment(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices;
    var edges = edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    });
    var edges_vector = edges.map(function (e) {
      return [e[1][0] - e[0][0], e[1][1] - e[0][1]];
    });
    var edges_magnitude = edges_vector.map(function (e) {
      return Math.sqrt(e[0] * e[0] + e[1] * e[1]);
    });
    var edges_normalized = edges_vector.map(function (e, i) {
      return [e[0] / edges_magnitude[i], e[1] / edges_magnitude[i]];
    });
    return edges_normalized.map(function (e) {
      return Math.abs(e[0]) > 0.707;
    });
  };

  var make_edges_intersections$1 = function make_edges_intersections(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        edges_vertices = _ref3.edges_vertices;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var edge_count = edges_vertices.length;
    var edges = edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    });
    var crossings = Array.from(Array(edge_count - 1)).map(function () {
      return [];
    });

    for (var i = 0; i < edges.length - 1; i += 1) {
      for (var j = i + 1; j < edges.length; j += 1) {
        crossings[i][j] = math.core.intersection.segment_segment_exclusive(edges[i][0], edges[i][1], edges[j][0], edges[j][1], epsilon);
      }
    }

    var edges_intersections = Array.from(Array(edge_count)).map(function () {
      return [];
    });

    for (var _i = 0; _i < edges.length - 1; _i += 1) {
      for (var _j = _i + 1; _j < edges.length; _j += 1) {
        if (crossings[_i][_j] != null) {
          edges_intersections[_i].push(crossings[_i][_j]);

          edges_intersections[_j].push(crossings[_i][_j]);
        }
      }
    }

    return edges_intersections;
  };

  var fragment$1 = function fragment(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;

    var horizSort = function horizSort(a, b) {
      return a[0] - b[0];
    };

    var vertSort = function vertSort(a, b) {
      return a[1] - b[1];
    };

    var edges_alignment = make_edges_alignment$1(graph);
    var edges = graph.edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return graph.vertices_coords[v];
      });
    });
    edges.forEach(function (e, i) {
      return e.sort(edges_alignment[i] ? horizSort : vertSort);
    });
    var edges_intersections = make_edges_intersections$1(graph, epsilon);
    var edges_collinearVertices = make_edges_collinearVertices$1(graph, epsilon);
    var new_edges_vertices = edges_intersections.map(function (a, i) {
      return a.concat(edges_collinearVertices[i]);
    });
    new_edges_vertices.forEach(function (e, i) {
      return e.sort(edges_alignment[i] ? horizSort : vertSort);
    });
    var new_edges_vertices_cleaned = new_edges_vertices.map(function (ev) {
      return ev.filter(function (e, i, arr) {
        return !are_vertices_equivalent(e, arr[(i + 1) % arr.length]);
      });
    }).filter(function (edge) {
      return edge.length;
    });
    var new_edges = new_edges_vertices_cleaned.map(function (ev) {
      return Array.from(Array(ev.length - 1)).map(function (_, i) {
        return [ev[i], ev[i + 1]];
      });
    });
    var TEST_A = new_edges.length;
    new_edges = new_edges.map(function (edgeGroup) {
      return edgeGroup.filter(function (e) {
        return false === e.map(function (_, i) {
          return Math.abs(e[0][i] - e[1][i]) < epsilon;
        }).reduce(function (a, b) {
          return a && b;
        }, true);
      });
    });
    var TEST_B = new_edges.length;

    if (TEST_A !== TEST_B) {
      console.log("fragment() remove degenerate edges is needed!");
    }

    var edge_map = new_edges.map(function (edge, i) {
      return edge.map(function () {
        return i;
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var vertices_coords = new_edges.map(function (edge) {
      return edge.reduce(function (a, b) {
        return a.concat(b);
      }, []);
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var counter = 0;
    var edges_vertices = new_edges.map(function (edge) {
      return edge.map(function () {
        return [counter++, counter++];
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var vertices_equivalent = Array.from(Array(vertices_coords.length)).map(function () {
      return [];
    });

    for (var i = 0; i < vertices_coords.length - 1; i += 1) {
      for (var j = i + 1; j < vertices_coords.length; j += 1) {
        vertices_equivalent[i][j] = are_vertices_equivalent(vertices_coords[i], vertices_coords[j], epsilon);
      }
    }

    var vertices_map = vertices_coords.map(function () {
      return undefined;
    });
    vertices_equivalent.forEach(function (row, i) {
      return row.forEach(function (eq, j) {
        if (eq) {
          vertices_map[j] = vertices_map[i] === undefined ? i : vertices_map[i];
        }
      });
    });
    var vertices_remove = vertices_map.map(function (m) {
      return m !== undefined;
    });
    vertices_map.forEach(function (map, i) {
      if (map === undefined) {
        vertices_map[i] = i;
      }
    });
    edges_vertices.forEach(function (edge, i) {
      return edge.forEach(function (v, j) {
        edges_vertices[i][j] = vertices_map[v];
      });
    });
    var edges_equivalent = Array.from(Array(edges_vertices.length)).map(function () {
      return [];
    });

    for (var _i2 = 0; _i2 < edges_vertices.length - 1; _i2 += 1) {
      for (var _j2 = _i2 + 1; _j2 < edges_vertices.length; _j2 += 1) {
        edges_equivalent[_i2][_j2] = edges_vertices_equivalent$1(edges_vertices[_i2], edges_vertices[_j2]);
      }
    }

    var edges_map = edges_vertices.map(function () {
      return undefined;
    });
    edges_equivalent.forEach(function (row, i) {
      return row.forEach(function (eq, j) {
        if (eq) {
          edges_map[i] = edges_map[j] === undefined ? j : edges_map[j];
        }
      });
    });
    edges_map.forEach(function (e, i) {
      if (e !== undefined) {
        if (["B", "b"].includes(graph.edges_assignment[i])) {
          graph.edges_assignment[e] = "B";
        }
      }
    });
    var edges_dont_remove = edges_map.map(function (m) {
      return m === undefined;
    });
    edges_map.forEach(function (map, i) {
      if (map === undefined) {
        edges_map[i] = i;
      }
    });
    var edges_vertices_cl = edges_vertices.filter(function (_, i) {
      return edges_dont_remove[i];
    });
    var edge_map_cl = edge_map.filter(function (_, i) {
      return edges_dont_remove[i];
    });
    var flat = {
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices_cl
    };

    if (graph.edges_assignment != null) {
      flat.edges_assignment = edge_map_cl.map(function (i) {
        return graph.edges_assignment[i] || "U";
      });
    }

    if (graph.edges_foldAngle != null) {
      flat.edges_foldAngle = edge_map_cl.map(function (i, j) {
        return graph.edges_foldAngle[i] || edge_assignment_to_foldAngle(flat.edges_assignment[j]);
      });
    }

    var vertices_remove_indices = vertices_remove.map(function (rm, i) {
      return rm ? i : undefined;
    }).filter(function (i) {
      return i !== undefined;
    });
    remove_geometry_key_indices$1(flat, "vertices", vertices_remove_indices);
    fold_keys.graph.forEach(function (key) {
      return delete graph[key];
    });
    Object.assign(graph, flat);
  };

  var need = function need(graph) {
    for (var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      keys[_key - 1] = arguments[_key];
    }

    return keys.map(function (key) {
      switch (key) {
        case "vertices_coords":
        case "edges_vertices":
          return graph[key] != null;

        case "vertices_vertices":
          convert.edges_vertices_to_vertices_vertices_sorted(graph);
          return true;

        case "vertices_edges":
          graph.vertices_edges = make_vertices_edges$1(graph);
          return true;

        default:
          return false;
      }
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };

  var collinear_vertices = function collinear_vertices(graph, point, vector) {
    return graph.vertices_coords.map(function (vert) {
      return vert.map(function (n, i) {
        return n - point[i];
      });
    }).map(function (vert) {
      return vert[0] * vector[1] - vert[1] * vector[0];
    }).map(function (det, i) {
      return Math.abs(det) < math.core.EPSILON ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var collinear_edges = function collinear_edges(graph, point, vector) {
    var hash = {};
    collinear_vertices(graph, point, vector).forEach(function (v) {
      hash[v] = true;
    });
    convert.edges_vertices_to_vertices_vertices_sorted(graph);
    return graph.edges_vertices.map(function (ev) {
      return hash[ev[0]] && hash[ev[1]] && graph.vertices_vertices[ev[0]].includes(ev[1]);
    }).map(function (collinear, i) {
      return collinear ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
  };

  var are_vertices_collinear = function are_vertices_collinear(graph, verts) {
    if (verts.length < 3) {
      return false;
    }

    var coords = verts.map(function (v) {
      return graph.vertices_coords[v];
    });
    var dimension = Array.from(Array(coords[0].length));
    var a = dimension.map(function (_, i) {
      return coords[1][i] - coords[0][i];
    });
    var b = dimension.map(function (_, i) {
      return coords[2][i] - coords[0][i];
    });
    return Math.abs(a[0] * b[1] - a[1] * b[0]) < math.core.EPSILON;
  };

  var remove_collinear_vertices = function remove_collinear_vertices(graph, collinear) {
    var new_edges = [];
    collinear.forEach(function (co) {
      var vertices = co.vertices,
          edges = co.edges;
      var assignment = co.assignments[0];
      remove_geometry_key_indices$1(graph, "edges", edges);
      new_edges.push({
        vertices: vertices,
        assignment: assignment
      });
    });
    new_edges.forEach(function (el) {
      var index = graph.edges_vertices.length;
      graph.edges_vertices[index] = el.vertices;
      graph.edges_assignment[index] = el.assignment;
    });
    remove_geometry_key_indices$1(graph, "vertices", collinear.map(function (c) {
      return c.vertex;
    }));
  };

  var remove_all_collinear_vertices = function remove_all_collinear_vertices(graph) {
    need(graph, "vertices_vertices", "vertices_edges");
    var pairs_verts = graph.vertices_vertices.map(function (adj, i) {
      return adj.length === 2 ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    var collinear_verts = pairs_verts.map(function (v) {
      return [v].concat(graph.vertices_vertices[v]);
    }).map(function (verts) {
      return are_vertices_collinear(graph, verts) ? {
        vertex: verts[0],
        vertices: [verts[1], verts[2]],
        edges: graph.vertices_edges[verts[0]]
      } : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    collinear_verts.forEach(function (v) {
      v.assignments = v.edges.map(function (e) {
        return graph.edges_assignment[e].toUpperCase();
      });
    });
    collinear_verts.forEach(function (v) {
      v.valid = v.assignments.map(function (a) {
        return a === v.assignments[0];
      }).reduce(function (a, b) {
        return a && b;
      }, true);
    });
    var toRemove = collinear_verts.filter(function (v) {
      return v.valid;
    });
    remove_collinear_vertices(graph, toRemove);
    return toRemove.length > 0;
  };

  var collinear = /*#__PURE__*/Object.freeze({
    __proto__: null,
    collinear_vertices: collinear_vertices,
    collinear_edges: collinear_edges,
    remove_all_collinear_vertices: remove_all_collinear_vertices
  });

  var find_edge_isolated_vertices = function find_edge_isolated_vertices(graph) {
    if (graph.vertices_coords == null) {
      return [];
    }

    var count = graph.vertices_coords.length;
    var seen = Array(count).fill(false);

    if (graph.edges_vertices) {
      graph.edges_vertices.forEach(function (ev) {
        ev.filter(function (v) {
          return !seen[v];
        }).forEach(function (v) {
          seen[v] = true;
          count -= 1;
        });
      });
    }

    return seen.map(function (s, i) {
      return s ? undefined : i;
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var find_face_isolated_vertices = function find_face_isolated_vertices(graph) {
    if (graph.vertices_coords == null) {
      return [];
    }

    var count = graph.vertices_coords.length;
    var seen = Array(count).fill(false);

    if (graph.faces_vertices) {
      graph.faces_vertices.forEach(function (fv) {
        fv.filter(function (v) {
          return !seen[v];
        }).forEach(function (v) {
          seen[v] = true;
          count -= 1;
        });
      });
    }

    return seen.map(function (s, i) {
      return s ? undefined : i;
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var find_isolated_vertices = function find_isolated_vertices(graph) {
    if (graph.vertices_coords == null) {
      return [];
    }

    var count = graph.vertices_coords.length;
    var seen = Array(count).fill(false);

    if (graph.edges_vertices) {
      graph.edges_vertices.forEach(function (ev) {
        ev.filter(function (v) {
          return !seen[v];
        }).forEach(function (v) {
          seen[v] = true;
          count -= 1;
        });
      });
    }

    if (graph.faces_vertices) {
      graph.faces_vertices.forEach(function (fv) {
        fv.filter(function (v) {
          return !seen[v];
        }).forEach(function (v) {
          seen[v] = true;
          count -= 1;
        });
      });
    }

    return seen.map(function (s, i) {
      return s ? undefined : i;
    }).filter(function (a) {
      return a !== undefined;
    });
  };

  var isolated = /*#__PURE__*/Object.freeze({
    __proto__: null,
    find_edge_isolated_vertices: find_edge_isolated_vertices,
    find_face_isolated_vertices: find_face_isolated_vertices,
    find_isolated_vertices: find_isolated_vertices
  });

  var DEFAULTS = Object.freeze({
    circular: true,
    duplicate: true
  });

  var removeCircularEdges = function removeCircularEdges(graph) {
    var circular = graph.edges_vertices.map(function (ev, i) {
      return ev[0] === ev[1] ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    remove_geometry_key_indices$1(graph, "edges", circular);
  };

  var edges_similar = function edges_similar(graph, e0, e1) {
    return graph.edges_vertices[e0][0] === graph.edges_vertices[e1][0] && graph.edges_vertices[e0][1] === graph.edges_vertices[e1][1] || graph.edges_vertices[e0][0] === graph.edges_vertices[e1][1] && graph.edges_vertices[e0][1] === graph.edges_vertices[e1][0];
  };

  var removeDuplicateEdges = function removeDuplicateEdges(graph) {
    var duplicates = graph.edges_vertices.map(function (ev, i) {
      for (var j = i + 1; j < graph.edges_vertices - 1 - i; j += 1) {
        if (edges_similar(graph, i, j)) {
          return j;
        }
      }

      return undefined;
    });
    remove_geometry_key_indices$1(graph, "edges", duplicates);
  };

  var clean = function clean(graph, options) {
    if (_typeof(options) !== "object") {
      options = {};
    }

    Object.keys(DEFAULTS).filter(function (key) {
      return !(key in options);
    }).forEach(function (key) {
      options[key] = DEFAULTS[key];
    });

    if (options.circular === true) {
      removeCircularEdges(graph);
    }

    if (options.duplicate === true) {
      removeDuplicateEdges(graph);
    }

    if (options.collinear === true) {
      remove_all_collinear_vertices(graph);

      if (options.circular === true) {
        removeCircularEdges(graph);
      }

      if (options.duplicate === true) {
        removeDuplicateEdges(graph);
      }
    }

    if (options.isolated === true) {
      remove_geometry_key_indices$1(graph, "vertices", find_isolated_vertices(graph));
    }
  };

  var are_vertices_equivalent$1 = function are_vertices_equivalent(a, b) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.core.EPSILON;

    if (a.length !== b.length) {
      return false;
    }

    for (var i = 0; i < a.length; i += 1) {
      if (Math.abs(a[i] - b[i]) > epsilon) {
        return false;
      }
    }

    return true;
  };

  var similar_vertices_coords = function similar_vertices_coords(target, source, epsilon) {
    var sourceMap = source.vertices_coords.map(function () {
      return undefined;
    });

    for (var i = 0; i < target.vertices_coords.length; i += 1) {
      for (var j = 0; j < source.vertices_coords.length; j += 1) {
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

  var populate = function populate(graph) {
    if (_typeof(graph) !== "object") {
      return;
    }

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
      var edges_faces = make_edges_faces(graph);

      if (edges_faces !== undefined) {
        graph.edges_faces = edges_faces;
      }
    }

    if (graph.vertices_faces == null) {
      var vertices_faces = make_vertices_faces(graph);

      if (vertices_faces !== undefined) {
        graph.vertices_faces = vertices_faces;
      }
    }

    if (graph.edges_length == null) {
      var edges_length = make_edges_length(graph);

      if (edges_length !== undefined) {
        graph.edges_length = edges_length;
      }
    }

    if (graph.edges_foldAngle == null && graph.edges_assignment != null) {
      graph.edges_foldAngle = graph.edges_assignment.map(function (a) {
        return edge_assignment_to_foldAngle(a);
      });
    }

    if (graph.edges_assignment == null && graph.edges_foldAngle != null) {
      graph.edges_assignment = graph.edges_foldAngle.map(function (a) {
        if (a === 0) {
          return "F";
        }

        if (a < 0) {
          return "M";
        }

        if (a > 0) {
          return "V";
        }

        return "U";
      });
    }

    if (graph.faces_faces == null) {
      var faces_faces = make_faces_faces$1(graph);

      if (faces_faces !== undefined) {
        graph.faces_faces = faces_faces;
      }
    }

    if (graph.vertices_edges == null) {
      var vertices_edges = make_vertices_edges$1(graph);

      if (vertices_edges !== undefined) {
        graph.vertices_edges = vertices_edges;
      }
    }

    if (graph.edges_edges == null) {
      var edges_edges = make_edges_edges(graph);

      if (edges_edges !== undefined) {
        graph.edges_edges = edges_edges;
      }
    }
  };

  var join = function join(target, source) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.core.EPSILON;
    var sourceMap = similar_vertices_coords(target, source, epsilon);
    var additional_vertices_coords = source.vertices_coords.filter(function (_, i) {
      return sourceMap[i] === undefined;
    });
    var new_index = target.vertices_coords.length;

    for (var i = 0; i < sourceMap.length; i += 1) {
      if (sourceMap[i] === undefined) {
        sourceMap[i] = new_index;
        new_index += 1;
      }
    }

    var additional_edges_vertices = source.edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return sourceMap[v];
      });
    });
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
    fragment$1(target);
    populate(target);
    return target;
  };

  var rebuild = function rebuild(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    fold_keys.orders.forEach(function (key) {
      return delete graph[key];
    });
    fold_keys.graph.filter(function (key) {
      return key !== "vertices_coords";
    }).filter(function (key) {
      return key !== "edges_vertices";
    }).filter(function (key) {
      return key !== "edges_assignment";
    }).filter(function (key) {
      return key !== "edges_foldAngle";
    }).forEach(function (key) {
      return delete graph[key];
    });
    Object.keys(graph).filter(function (s) {
      return s.includes("re:");
    }).forEach(function (key) {
      return delete graph[key];
    });

    if (graph.edges_assignment != null && graph.edges_foldAngle != null) {
      delete graph.edges_foldAngle;
    }

    populate(graph);
  };

  var apply_matrix_to_graph = function apply_matrix_to_graph(graph, matrix) {
    get_keys_with_ending(graph, "coords").forEach(function (key) {
      graph[key] = graph[key].map(function (v) {
        return math.core.multiply_matrix2_vector2(matrix, v);
      });
    });
    get_keys_with_ending(graph, "matrix").forEach(function (key) {
      graph[key] = graph[key].map(function (m) {
        return math.core.multiply_matrices2(m, matrix);
      });
    });
  };

  var transform_scale = function transform_scale(graph, sx, sy) {
    if (typeof sx === "number" && sy === undefined) {
      sy = sx;
    }

    var matrix = math.core.make_matrix2_scale(sx, sy);
    apply_matrix_to_graph(graph, matrix);
  };
  var transform_translate = function transform_translate(graph, dx, dy) {
    var matrix = math.core.make_matrix2_translate(dx, dy);
    apply_matrix_to_graph(graph, matrix);
  };
  var transform_matrix = function transform_matrix(graph, matrix) {
    apply_matrix_to_graph(graph, matrix);
  };

  var affine = /*#__PURE__*/Object.freeze({
    __proto__: null,
    transform_scale: transform_scale,
    transform_translate: transform_translate,
    transform_matrix: transform_matrix
  });

  var Changed = function Changed() {
    var isPaused = false;
    var changed = {};

    changed.update = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (isPaused) {
        return;
      }

      changed.handlers.forEach(function (f) {
        return f.apply(void 0, args);
      });
    };

    changed.handlers = [];
    Object.defineProperty(changed, "pause", {
      get: function get() {
        return isPaused;
      },
      set: function set(pause) {
        isPaused = pause;

        if (!isPaused) {
          changed.update();
        }
      }
    });
    return Object.freeze(changed);
  };

  var vertex_degree = function vertex_degree(v, i) {
    var graph = this;
    Object.defineProperty(v, "degree", {
      get: function get() {
        return graph.vertices_vertices && graph.vertices_vertices[i] ? graph.vertices_vertices[i].length : null;
      }
    });
  };

  var edge_coords = function edge_coords(e, i) {
    var graph = this;
    Object.defineProperty(e, "coords", {
      get: function get() {
        if (!graph.edges_vertices || !graph.edges_vertices[i] || !graph.vertices_coords) {
          return undefined;
        }

        return graph.edges_vertices[i].map(function (v) {
          return graph.vertices_coords[v];
        });
      }
    });
  };

  var face_simple = function face_simple(f, i) {
    var graph = this;
    Object.defineProperty(f, "simple", {
      get: function get() {
        if (!graph.faces_vertices || !graph.faces_vertices[i]) {
          return null;
        }

        for (var j = 0; j < f.length - 1; j += 1) {
          for (var k = j + 1; k < f.length; k += 1) {
            if (graph.faces_vertices[i][j] === graph.faces_vertices[i][k]) {
              return false;
            }
          }
        }

        return true;
      }
    });
  };

  var face_coords = function face_coords(f, i) {
    var graph = this;
    Object.defineProperty(f, "coords", {
      get: function get() {
        if (!graph.faces_vertices || !graph.faces_vertices[i] || !graph.vertices_coords) {
          return undefined;
        }

        return graph.faces_vertices[i].map(function (v) {
          return graph.vertices_coords[v];
        });
      }
    });
  };

  var setup_vertex = function setup_vertex(v, i) {
    vertex_degree.call(this, v, i);
  };

  var setup_edge = function setup_edge(e, i) {
    edge_coords.call(this, e, i);
  };

  var setup_face = function setup_face(f, i) {
    face_simple.call(this, f, i);
    face_coords.call(this, f, i);
  };

  var Prototype$2 = function Prototype() {
    var proto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    proto.changed = Changed();

    proto.load = function (object) {
      var _this = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (_typeof(object) !== "object") {
        return;
      }

      if (options.append !== true) {
        keys.forEach(function (key) {
          return delete _this[key];
        });
      }

      Object.assign(this, {
        file_spec: file_spec,
        file_creator: file_creator
      }, clone$1(object));
      this.changed.update(this.load);
    };

    proto.join = function (object, epsilon) {
      join(this, object, epsilon);
      this.changed.update(this.join);
    };

    proto.clear = function () {
      var _this2 = this;

      fold_keys.graph.forEach(function (key) {
        return delete _this2[key];
      });
      fold_keys.orders.forEach(function (key) {
        return delete _this2[key];
      });
      this.changed.update(this.clear);
    };

    proto.copy = function () {
      return Object.assign(Object.create(Prototype()), clone$1(this));
    };

    proto.clean = function (options) {
      clean(this, options);
      this.changed.update(this.clean);
    };

    proto.populate = function () {
      populate(this);
      this.changed.update(this.populate);
    };

    proto.fragment = function () {
      var epsilon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e-6;
      fragment$1(this, epsilon);
      this.changed.update(this.fragment);
    };

    proto.rebuild = function () {
      var epsilon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1e-6;
      rebuild(this, epsilon);
      this.changed.update(this.rebuild);
    };

    proto.translate = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      transform_translate.apply(affine, [this].concat(args));
      this.changed.update(this.translate);
    };

    proto.scale = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      transform_scale.apply(affine, [this].concat(args));
      this.changed.update(this.scale);
    };

    var getVertices = function getVertices() {
      var transposed = transpose_geometry_arrays(this, "vertices");
      var vertices = transposed.length !== 0 ? transposed : Array.from(Array(implied_vertices_count(this))).map(function () {
        return {};
      });
      vertices.forEach(setup_vertex.bind(this));
      return vertices;
    };

    var getEdges = function getEdges() {
      var edges = transpose_geometry_arrays(this, "edges");
      edges.forEach(setup_edge.bind(this));
      return edges;
    };

    var getFaces = function getFaces() {
      var faces = transpose_geometry_arrays(this, "faces");
      faces.forEach(setup_face.bind(this));
      return faces;
    };

    var getBounds = function getBounds() {
      return math.rectangle.apply(math, _toConsumableArray(bounding_rect$1(this)));
    };

    proto.nearestVertex = function () {
      var _math$core;

      var index = nearest_vertex(this, (_math$core = math.core).get_vector.apply(_math$core, arguments));
      var result = transpose_geometry_array_at_index(this, "vertices", index);
      setup_vertex.call(this, result, index);
      result.index = index;
      return result;
    };

    proto.nearestEdge = function () {
      var _math$core2;

      var index = nearest_edge(this, (_math$core2 = math.core).get_vector.apply(_math$core2, arguments));
      var result = transpose_geometry_array_at_index(this, "edges", index);
      setup_edge.call(this, result, index);
      result.index = index;
      return result;
    };

    proto.nearestFace = function () {
      var _math$core3;

      var index = face_containing_point(this, (_math$core3 = math.core).get_vector.apply(_math$core3, arguments));

      if (index === undefined) {
        return undefined;
      }

      var result = transpose_geometry_array_at_index(this, "faces", index);
      setup_face.call(this, result, index);
      result.index = index;
      return result;
    };

    proto.nearest = function () {
      var _math$core4;

      var target = (_math$core4 = math.core).get_vector.apply(_math$core4, arguments);

      var nears = {
        vertex: this.nearestVertex(this, target),
        edge: this.nearestEdge(this, target),
        face: this.nearestFace(this, target)
      };
      Object.keys(nears).filter(function (key) {
        return nears[key] == null;
      }).forEach(function (key) {
        return delete nears[key];
      });
      return nears;
    };

    Object.defineProperty(proto, "vertices", {
      get: getVertices
    });
    Object.defineProperty(proto, "edges", {
      get: getEdges
    });
    Object.defineProperty(proto, "faces", {
      get: getFaces
    });
    Object.defineProperty(proto, "bounds", {
      get: getBounds
    });
    return Object.freeze(proto);
  };

  var new_vertex = function new_vertex(graph, x, y) {
    if (graph.vertices_coords === undefined) {
      return undefined;
    }

    var vertices_count = graph.vertices_coords.length;
    graph.vertices_coords[vertices_count] = [x, y];
    return vertices_count;
  };

  var add_vertex_on_edge = function add_vertex_on_edge(graph, x, y, old_edge_index) {
    if (graph.edges_vertices.length < old_edge_index) {
      return undefined;
    }

    var new_vertex_index = new_vertex(graph, x, y);
    var incident_vertices = graph.edges_vertices[old_edge_index];

    if (graph.vertices_vertices == null) {
      graph.vertices_vertices = [];
    }

    graph.vertices_vertices[new_vertex_index] = clone$1(incident_vertices);
    incident_vertices.forEach(function (v, i, arr) {
      var otherV = arr[(i + 1) % arr.length];
      var otherI = graph.vertices_vertices[v].indexOf(otherV);
      graph.vertices_vertices[v][otherI] = new_vertex_index;
    });

    if (graph.edges_faces != null && graph.edges_faces[old_edge_index] != null) {
      graph.vertices_faces[new_vertex_index] = clone$1(graph.edges_faces[old_edge_index]);
    }

    var new_edges = [{
      edges_vertices: [incident_vertices[0], new_vertex_index]
    }, {
      edges_vertices: [new_vertex_index, incident_vertices[1]]
    }];
    new_edges.forEach(function (e, i) {
      e.i = graph.edges_vertices.length + i;
    });
    ["edges_faces", "edges_assignment", "edges_foldAngle"].filter(function (key) {
      return graph[key] != null && graph[key][old_edge_index] != null;
    }).forEach(function (key) {
      new_edges[0][key] = clone$1(graph[key][old_edge_index]);
      new_edges[1][key] = clone$1(graph[key][old_edge_index]);
    });
    new_edges.forEach(function (el, i) {
      var _math$core;

      var verts = el.edges_vertices.map(function (v) {
        return graph.vertices_coords[v];
      });
      new_edges[i].edges_length = (_math$core = math.core).distance2.apply(_math$core, _toConsumableArray(verts));
    });
    new_edges.forEach(function (edge) {
      return Object.keys(edge).filter(function (key) {
        return key !== "i";
      }).filter(function (key) {
        return graph[key] !== undefined;
      }).forEach(function (key) {
        graph[key][edge.i] = edge[key];
      });
    });
    var incident_faces_indices = graph.edges_faces[old_edge_index];
    var incident_faces_vertices = incident_faces_indices.map(function (i) {
      return graph.faces_vertices[i];
    });
    var incident_faces_edges = incident_faces_indices.map(function (i) {
      return graph.faces_edges[i];
    });
    incident_faces_vertices.forEach(function (face) {
      return face.map(function (fv, i, arr) {
        var nextI = (i + 1) % arr.length;
        return fv === incident_vertices[0] && arr[nextI] === incident_vertices[1] || fv === incident_vertices[1] && arr[nextI] === incident_vertices[0] ? nextI : undefined;
      }).filter(function (el) {
        return el !== undefined;
      }).sort(function (a, b) {
        return b - a;
      }).forEach(function (i) {
        return face.splice(i, 0, new_vertex_index);
      });
    });
    incident_faces_edges.forEach(function (face) {
      var edgeIndex = face.indexOf(old_edge_index);
      var prevEdge = face[(edgeIndex + face.length - 1) % face.length];
      var nextEdge = face[(edgeIndex + 1) % face.length];
      var vertices = [[prevEdge, old_edge_index], [old_edge_index, nextEdge]].map(function (pairs) {
        var verts = pairs.map(function (e) {
          return graph.edges_vertices[e];
        });
        return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1] ? verts[0][0] : verts[0][1];
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
      var edges = [[vertices[0], new_vertex_index], [new_vertex_index, vertices[1]]].map(function (verts) {
        var in0 = verts.map(function (v) {
          return new_edges[0].edges_vertices.indexOf(v) !== -1;
        }).reduce(function (a, b) {
          return a && b;
        }, true);
        var in1 = verts.map(function (v) {
          return new_edges[1].edges_vertices.indexOf(v) !== -1;
        }).reduce(function (a, b) {
          return a && b;
        }, true);

        if (in0) {
          return new_edges[0].i;
        }

        if (in1) {
          return new_edges[1].i;
        }

        throw new Error("something wrong with input graph's faces_edges construction");
      });

      if (edgeIndex === face.length - 1) {
        face.splice(edgeIndex, 1, edges[0]);
        face.unshift(edges[1]);
      } else {
        face.splice.apply(face, [edgeIndex, 1].concat(_toConsumableArray(edges)));
      }

      return edges;
    });
    var edge_map = remove_geometry_key_indices$1(graph, "edges", [old_edge_index]);
    return {
      vertices: {
        "new": [{
          index: new_vertex_index
        }]
      },
      edges: {
        map: edge_map,
        replace: [{
          old: old_edge_index,
          "new": new_edges.map(function (el) {
            return el.i;
          })
        }]
      }
    };
  };

  var merge_maps = function merge_maps(a, b) {
    var aRemoves = [];

    for (var i = 1; i < a.length; i++) {
      if (a[i] !== a[i - 1]) {
        aRemoves.push(i);
      }
    }

    for (var _i = 1; _i < b.length; _i++) {
      if (b[_i] !== b[_i - 1]) ;
    }

    var bCopy = b.slice();
    aRemoves.forEach(function (i) {
      return bCopy.splice(i, 0, i === 0 ? 0 : bCopy[i - 1]);
    });
    return a.map(function (v, i) {
      return v + bCopy[i];
    });
  };

  var split_convex_polygon$1 = function split_convex_polygon(graph, faceIndex, linePoint, lineVector) {
    var _math$core;

    var crease_assignment = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "F";
    var vertices_intersections = graph.faces_vertices[faceIndex].map(function (fv) {
      return graph.vertices_coords[fv];
    }).map(function (v) {
      return math.core.point_on_line(linePoint, lineVector, v) ? v : undefined;
    }).map(function (point, i) {
      return {
        point: point,
        i_face: i,
        i_vertices: graph.faces_vertices[faceIndex][i]
      };
    }).filter(function (el) {
      return el.point !== undefined;
    });
    var edges_intersections = graph.faces_edges[faceIndex].map(function (ei) {
      return graph.edges_vertices[ei];
    }).map(function (edge) {
      return edge.map(function (e) {
        return graph.vertices_coords[e];
      });
    }).map(function (edge) {
      return math.core.intersection.line_segment_exclusive(linePoint, lineVector, edge[0], edge[1]);
    }).map(function (point, i) {
      return {
        point: point,
        i_face: i,
        i_edges: graph.faces_edges[faceIndex][i]
      };
    }).filter(function (el) {
      return el.point !== undefined;
    });
    var new_v_indices = [];
    var edge_map = Array(graph.edges_vertices.length).fill(0);

    if (edges_intersections.length === 2) {
      new_v_indices = edges_intersections.map(function (el, i, arr) {
        var diff = add_vertex_on_edge(graph, el.point[0], el.point[1], el.i_edges);
        arr.slice(i + 1).filter(function (ell) {
          return diff.edges.map[ell.i_edges] != null;
        }).forEach(function (ell) {
          ell.i_edges += diff.edges.map[ell.i_edges];
        });
        edge_map = merge_maps(edge_map, diff.edges.map);
        return diff.vertices["new"][0].index;
      });
    } else if (edges_intersections.length === 1 && vertices_intersections.length === 1) {
      var a = vertices_intersections.map(function (el) {
        return el.i_vertices;
      });
      var b = edges_intersections.map(function (el, i, arr) {
        var diff = add_vertex_on_edge(graph, el.point[0], el.point[1], el.i_edges);
        arr.slice(i + 1).filter(function (ell) {
          return diff.edges.map[ell.i_edges] != null;
        }).forEach(function (ell) {
          ell.i_edges += diff.edges.map[ell.i_edges];
        });
        edge_map = diff.edges.map;
        return diff.vertices["new"][0].index;
      });
      new_v_indices = a.concat(b);
    } else if (vertices_intersections.length === 2) {
      new_v_indices = vertices_intersections.map(function (el) {
        return el.i_vertices;
      });
      var face_v = graph.faces_vertices[faceIndex];
      var v_i = vertices_intersections;
      var match_a = face_v[(v_i[0].i_face + 1) % face_v.length] === v_i[1].i_vertices;
      var match_b = face_v[(v_i[1].i_face + 1) % face_v.length] === v_i[0].i_vertices;

      if (match_a || match_b) {
        return {};
      }
    } else {
      return {};
    }

    var new_face_v_indices = new_v_indices.map(function (el) {
      return graph.faces_vertices[faceIndex].indexOf(el);
    }).sort(function (a, b) {
      return a - b;
    });
    var new_faces = [{}, {}];
    new_faces[0].vertices = graph.faces_vertices[faceIndex].slice(new_face_v_indices[1]).concat(graph.faces_vertices[faceIndex].slice(0, new_face_v_indices[0] + 1));
    new_faces[1].vertices = graph.faces_vertices[faceIndex].slice(new_face_v_indices[0], new_face_v_indices[1] + 1);
    new_faces[0].edges = graph.faces_edges[faceIndex].slice(new_face_v_indices[1]).concat(graph.faces_edges[faceIndex].slice(0, new_face_v_indices[0])).concat([graph.edges_vertices.length]);
    new_faces[1].edges = graph.faces_edges[faceIndex].slice(new_face_v_indices[0], new_face_v_indices[1]).concat([graph.edges_vertices.length]);
    new_faces[0].index = graph.faces_vertices.length;
    new_faces[1].index = graph.faces_vertices.length + 1;
    var new_edges = [{
      index: graph.edges_vertices.length,
      vertices: _toConsumableArray(new_v_indices),
      assignment: crease_assignment,
      foldAngle: edge_assignment_to_foldAngle(crease_assignment),
      length: (_math$core = math.core).distance2.apply(_math$core, _toConsumableArray(new_v_indices.map(function (v) {
        return graph.vertices_coords[v];
      }))),
      faces: [graph.faces_vertices.length, graph.faces_vertices.length + 1]
    }];
    var edges_count = graph.edges_vertices.length;
    var faces_count = graph.faces_vertices.length;
    new_faces.forEach(function (face, i) {
      return Object.keys(face).filter(function (suffix) {
        return suffix !== "index";
      }).forEach(function (suffix) {
        graph["faces_".concat(suffix)][faces_count + i] = face[suffix];
      });
    });
    new_edges.forEach(function (edge, i) {
      return Object.keys(edge).filter(function (suffix) {
        return suffix !== "index";
      }).filter(function (suffix) {
        return graph["edges_".concat(suffix)] !== undefined;
      }).forEach(function (suffix) {
        graph["edges_".concat(suffix)][edges_count + i] = edge[suffix];
      });
    });
    new_edges.forEach(function (edge) {
      var a = edge.vertices[0];
      var b = edge.vertices[1];
      graph.vertices_vertices[a].push(b);
      graph.vertices_vertices[b].push(a);
    });
    var v_f_map = {};
    graph.faces_vertices.map(function (face, i) {
      return {
        face: face,
        i: i
      };
    }).filter(function (el) {
      return el.i === faces_count || el.i === faces_count + 1;
    }).forEach(function (el) {
      return el.face.forEach(function (v) {
        if (v_f_map[v] == null) {
          v_f_map[v] = [];
        }

        v_f_map[v].push(el.i);
      });
    });
    graph.vertices_faces.forEach(function (vf, i) {
      var indexOf = vf.indexOf(faceIndex);

      while (indexOf !== -1) {
        var _graph$vertices_faces;

        (_graph$vertices_faces = graph.vertices_faces[i]).splice.apply(_graph$vertices_faces, [indexOf, 1].concat(_toConsumableArray(v_f_map[i])));

        indexOf = vf.indexOf(faceIndex);
      }
    });
    var e_f_map = {};
    graph.faces_edges.map(function (face, i) {
      return {
        face: face,
        i: i
      };
    }).filter(function (el) {
      return el.i === faces_count || el.i === faces_count + 1;
    }).forEach(function (el) {
      return el.face.forEach(function (e) {
        if (e_f_map[e] == null) {
          e_f_map[e] = [];
        }

        e_f_map[e].push(el.i);
      });
    });
    graph.edges_faces.forEach(function (ef, i) {
      var indexOf = ef.indexOf(faceIndex);

      while (indexOf !== -1) {
        var _graph$edges_faces$i;

        (_graph$edges_faces$i = graph.edges_faces[i]).splice.apply(_graph$edges_faces$i, [indexOf, 1].concat(_toConsumableArray(e_f_map[i])));

        indexOf = ef.indexOf(faceIndex);
      }
    });
    var faces_map = remove_geometry_key_indices$1(graph, "faces", [faceIndex]);
    return {
      faces: {
        map: faces_map,
        replace: [{
          old: faceIndex,
          "new": new_faces
        }]
      },
      edges: {
        "new": new_edges,
        map: edge_map
      }
    };
  };

  var foldLayers = function foldLayers(faces_layer, faces_folding) {
    var folding_i = faces_layer.map(function (el, i) {
      return faces_folding[i] ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    var not_folding_i = faces_layer.map(function (el, i) {
      return !faces_folding[i] ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    var sorted_folding_i = folding_i.slice().sort(function (a, b) {
      return faces_layer[a] - faces_layer[b];
    });
    var sorted_not_folding_i = not_folding_i.slice().sort(function (a, b) {
      return faces_layer[a] - faces_layer[b];
    });
    var new_faces_layer = [];
    sorted_not_folding_i.forEach(function (layer, i) {
      new_faces_layer[layer] = i;
    });
    var topLayer = sorted_not_folding_i.length;
    sorted_folding_i.reverse().forEach(function (layer, i) {
      new_faces_layer[layer] = topLayer + i;
    });
    return new_faces_layer;
  };

  var construction_flip = function construction_flip(direction_vector) {
    return {
      type: "flip",
      direction: direction_vector
    };
  };

  var get_face_sidedness = function get_face_sidedness(point, vector, face_center, face_color) {
    var vec2 = [face_center[0] - point[0], face_center[1] - point[1]];
    var det = vector[0] * vec2[1] - vector[1] * vec2[0];
    return face_color ? det > 0 : det < 0;
  };

  var make_face_center_fast = function make_face_center_fast(graph, face_index) {
    return graph.faces_vertices[face_index].map(function (v) {
      return graph.vertices_coords[v];
    }).reduce(function (a, b) {
      return [a[0] + b[0], a[1] + b[1]];
    }, [0, 0]).map(function (el) {
      return el / graph.faces_vertices[face_index].length;
    });
  };

  var prepare_to_fold = function prepare_to_fold(graph, point, vector, face_index) {
    var faceCount = faces_count$1(graph);
    graph["faces_re:preindex"] = Array.from(Array(faceCount)).map(function (_, i) {
      return i;
    });

    if ("faces_re:matrix" in graph === false) {
      graph["faces_re:matrix"] = make_faces_matrix(graph, face_index);
    }

    graph["faces_re:coloring"] = make_faces_coloring_from_faces_matrix$1(graph["faces_re:matrix"]);
    graph["faces_re:creases"] = graph["faces_re:matrix"].map(function (mat) {
      return math.core.invert_matrix2(mat);
    }).map(function (mat) {
      return math.core.multiply_matrix2_line2(mat, point, vector);
    });
    graph["faces_re:center"] = Array.from(Array(faceCount)).map(function (_, i) {
      return make_face_center_fast(graph, i);
    });
    graph["faces_re:sidedness"] = Array.from(Array(faceCount)).map(function (_, i) {
      return get_face_sidedness(graph["faces_re:creases"][i].origin, graph["faces_re:creases"][i].vector, graph["faces_re:center"][i], graph["faces_re:coloring"][i]);
    });
  };

  var prepare_extensions = function prepare_extensions(graph) {
    var facesCount = faces_count$1(graph);

    if (graph["faces_re:layer"] == null) {
      graph["faces_re:layer"] = Array(facesCount).fill(0);
    }
  };

  var two_furthest_points = function two_furthest_points(points) {
    var top = [0, -Infinity];
    var left = [Infinity, 0];
    var right = [-Infinity, 0];
    var bottom = [0, Infinity];
    points.forEach(function (p) {
      if (p[0] < left[0]) {
        left = p;
      }

      if (p[0] > right[0]) {
        right = p;
      }

      if (p[1] < bottom[1]) {
        bottom = p;
      }

      if (p[1] > top[1]) {
        top = p;
      }
    });
    var t_to_b = Math.abs(top[1] - bottom[1]);
    var l_to_r = Math.abs(right[0] - left[0]);
    return t_to_b > l_to_r ? [bottom, top] : [left, right];
  };

  var opposite_assignment = {
    "M": "V",
    "m": "V",
    "V": "M",
    "v": "M"
  };

  var opposingCrease = function opposingCrease(assignment) {
    return opposite_assignment[assignment] || assignment;
  };

  var fold_through = function fold_through(graph, point, vector, face_index) {
    var assignment = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "V";
    var opposite_crease = opposingCrease(assignment);

    if (face_index == null) {
      var containing_point = face_containing_point(graph, point);
      face_index = containing_point === undefined ? 0 : containing_point;
    }

    prepare_extensions(graph);
    prepare_to_fold(graph, point, vector, face_index);
    var folded = clone$1(graph);
    var faces_split = Array.from(Array(faces_count$1(graph))).map(function (_, i) {
      return i;
    }).reverse().map(function (i) {
      var diff = split_convex_polygon$1(folded, i, folded["faces_re:creases"][i].origin, folded["faces_re:creases"][i].vector, folded["faces_re:coloring"][i] ? assignment : opposite_crease);

      if (diff == null || diff.faces == null) {
        return undefined;
      }

      diff.faces.replace.forEach(function (replace) {
        return replace["new"].map(function (el) {
          return el.index;
        }).map(function (index) {
          return index + diff.faces.map[index];
        }).forEach(function (i) {
          folded["faces_re:center"][i] = make_face_center_fast(folded, i);
          folded["faces_re:sidedness"][i] = get_face_sidedness(graph["faces_re:creases"][replace.old].origin, graph["faces_re:creases"][replace.old].vector, folded["faces_re:center"][i], graph["faces_re:coloring"][replace.old]);
          folded["faces_re:layer"][i] = graph["faces_re:layer"][replace.old];
          folded["faces_re:preindex"][i] = graph["faces_re:preindex"][replace.old];
        });
      });
      return {
        index: i,
        length: diff.edges["new"][0].length,
        edge: diff.edges["new"][0].vertices.map(function (v) {
          return folded.vertices_coords[v];
        })
      };
    }).reverse();
    folded["faces_re:layer"] = foldLayers(folded["faces_re:layer"], folded["faces_re:sidedness"]);
    var face_0_newIndex = faces_split[0] === undefined ? 0 : folded["faces_re:preindex"].map(function (pre, i) {
      return {
        pre: pre,
        "new": i
      };
    }).filter(function (obj) {
      return obj.pre === 0;
    }).filter(function (obj) {
      return folded["faces_re:sidedness"][obj["new"]];
    }).shift()["new"];
    var face_0_preMatrix = graph["faces_re:matrix"][0];

    if (assignment === "M" || assignment === "m" || assignment === "V" || assignment === "v") {
      face_0_preMatrix = faces_split[0] === undefined && !graph["faces_re:sidedness"][0] ? graph["faces_re:matrix"][0] : math.core.multiply_matrices2(graph["faces_re:matrix"][0], math.core.make_matrix2_reflection(graph["faces_re:creases"][0].vector, graph["faces_re:creases"][0].origin));
    }

    var folded_faces_matrix = make_faces_matrix(folded, face_0_newIndex).map(function (m) {
      return math.core.multiply_matrices2(face_0_preMatrix, m);
    });
    folded["faces_re:coloring"] = make_faces_coloring_from_faces_matrix$1(folded_faces_matrix);
    var crease_0 = math.core.multiply_matrix2_line2(face_0_preMatrix, graph["faces_re:creases"][0].origin, graph["faces_re:creases"][0].vector);
    var fold_direction = math.core.normalize([crease_0.vector[1], -crease_0.vector[0]]);
    var split_points = faces_split.map(function (el, i) {
      return el === undefined ? undefined : el.edge.map(function (p) {
        return math.core.multiply_matrix2_vector2(graph["faces_re:matrix"][i], p);
      });
    }).filter(function (a) {
      return a !== undefined;
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    folded["re:construction"] = split_points.length === 0 ? construction_flip(fold_direction) : {
      type: "fold",
      assignment: assignment,
      direction: fold_direction,
      edge: two_furthest_points(split_points)
    };
    folded["vertices_re:foldedCoords"] = make_vertices_coords_folded(folded, face_0_newIndex, folded_faces_matrix);
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

  var axiom_instructions = JSON.parse(text_axioms);

  var get_instructions_for_axiom = function get_instructions_for_axiom(axiom_number) {
    if (isNaN(axiom_number) || axiom_number == null || axiom_number < 1 || axiom_number > 7) {
      return undefined;
    }

    var instructions = {};
    Object.keys(axiom_instructions).forEach(function (key) {
      instructions[key] = axiom_instructions[key][axiom_number];
    });
    return instructions;
  };

  var make_instructions = function make_instructions(construction) {
    var axiom = construction.axiom || 0;

    if (!isNaN(axiom) && axiom != null && axiom > 0 && axiom < 8) {
      return get_instructions_for_axiom(axiom);
    }

    if ("assignment" in construction) {
      return {
        en: "".concat(edges_assignment_names[construction.assignment], " fold")
      };
    }

    return {
      en: ""
    };
  };

  var make_arrow_coords = function make_arrow_coords(construction, graph) {
    var axiom = construction.axiom || 0;
    var crease_edge = construction.edge;
    var arrow_vector = construction.direction;
    var axiom_frame = construction;

    if (axiom === 2) {
      return [axiom_frame.parameters.points[1], axiom_frame.parameters.points[0]];
    }

    if (axiom === 5) {
      return [axiom_frame.parameters.points[1], axiom_frame.test.points_reflected[1]];
    }

    if (axiom === 7) {
      return [axiom_frame.parameters.points[0], axiom_frame.test.points_reflected[0]];
    }

    var crease_vector = [crease_edge[1][0] - crease_edge[0][0], crease_edge[1][1] - crease_edge[0][1]];
    var crossing;

    switch (axiom) {
      case 4:
        crossing = math.core.nearest_point_on_line(crease_edge[0], crease_vector, axiom_frame.parameters.lines[0][0], function (a) {
          return a;
        });
        break;

      case 7:
        crossing = math.core.nearest_point_on_line(crease_edge[0], crease_vector, axiom_frame.parameters.points[0], function (a) {
          return a;
        });
        break;

      default:
        crossing = math.core.average(crease_edge[0], crease_edge[1]);
        break;
    }
    var boundary = get_boundary$1(graph).vertices.map(function (v) {
      return graph.vertices_coords[v];
    });
    var perpClipEdge = math.core.intersection.convex_poly_line(boundary, crossing, arrow_vector);

    if (perpClipEdge === undefined) {
      return [];
    }

    var short_length = [perpClipEdge[0], perpClipEdge[1]].map(function (n) {
      return math.core.distance2(n, crossing);
    }).sort(function (a, b) {
      return a - b;
    }).shift();

    if (axiom === 7) {
      short_length = math.core.distance2(construction.parameters.points[0], crossing);
    }

    var short_vector = arrow_vector.map(function (v) {
      return v * short_length;
    });
    return [crossing.map(function (c, i) {
      return c - short_vector[i];
    }), crossing.map(function (c, i) {
      return c + short_vector[i];
    })];
  };

  var build_diagram_frame = function build_diagram_frame(graph) {
    var c = graph["re:construction"];

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
          "re:diagram_instructions": {
            en: "flip over"
          }
        };

      case "fold":
        return {
          "re:diagram_lines": [{
            "re:diagram_line_classes": [edges_assignment_names[c.assignment]],
            "re:diagram_line_coords": c.edge
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
        return {
          error: "construction type (".concat(c.type, ") not yet defined")
        };
    }
  };

  var apply_run_diff = function apply_run_diff(graph, diff) {
    var lengths = {
      vertices: vertices_count$1(graph),
      edges: edges_count$1(graph),
      faces: faces_count$1(graph)
    };

    if (diff["new"]) {
      Object.keys(diff["new"]).forEach(function (type) {
        return diff["new"][type].forEach(function (newElem, i) {
          return Object.keys(newElem).forEach(function (key) {
            graph[key][lengths[type] + i] = newElem[key];
          });
        });
      });
    }

    if (diff.update) {
      Object.keys(diff.update).forEach(function (i) {
        return Object.keys(diff.update[i]).forEach(function (key) {
          graph[key][i] = diff.update[i][key];
        });
      });
    }

    if (diff.remove) {
      if (diff.remove.faces) {
        remove_geometry_key_indices$1(graph, "faces", diff.remove.faces);
      }

      if (diff.remove.edges) {
        remove_geometry_key_indices$1(graph, "edges", diff.remove.edges);
      }

      if (diff.remove.vertices) {
        remove_geometry_key_indices$1(graph, "vertices", diff.remove.vertices);
      }
    }

    return diff;
  };
  var merge_run_diffs = function merge_run_diffs(graph, target, source) {
    var vertices_length = vertices_count$1(graph);
    var edges_length = edges_count$1(graph);
    var faces_length = faces_count$1(graph);
    var target_new_vertices_length = 0;
    var target_new_edges_length = 0;
    var target_new_faces_length = 0;

    if (target["new"] !== undefined) {
      if (target["new"].vertices !== undefined) {
        target_new_vertices_length = target["new"].vertices.length;
      }

      if (target["new"].edges !== undefined) {
        target_new_edges_length = target["new"].edges.length;
      }

      if (target["new"].faces !== undefined) {
        target_new_faces_length = target["new"].faces.length;
      }
    }

    var augment_map = {
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
      }
    };
    var all_source = [];

    if (source["new"] !== undefined) {
      Object.keys(source["new"]).forEach(function (category) {
        source["new"][category].forEach(function (newEl, i) {
          ["vertices", "edges", "faces"].forEach(function (key) {
            var suffix = "_".concat(key);
            var suffixKeys = Object.keys(newEl).map(function (str) {
              return str.substring(str.length - suffix.length, str.length) === suffix ? str : undefined;
            }).filter(function (str) {
              return str !== undefined;
            });
            suffixKeys.forEach(function (suffixKey) {
              source["new"][category][i][suffixKey].forEach(function (n, j) {
                if (source["new"][category][i][suffixKey][j] >= augment_map[category].length) {
                  source["new"][category][i][suffixKey][j] += augment_map[category].change;
                }
              });
            });
          });
        });
        all_source = all_source.concat(source["new"].vertices);
      });
    }

    var merge = {};

    if (target["new"] !== undefined) {
      merge["new"] = target["new"];
    }

    if (target.update !== undefined) {
      merge.update = target.update;
    }

    if (target.remove !== undefined) {
      merge.remove = target.remove;
    }

    if (source["new"] !== undefined) {
      if (source["new"].vertices !== undefined) {
        if (merge["new"].vertices === undefined) {
          merge["new"].vertices = [];
        }

        merge["new"].vertices = merge["new"].vertices.concat(source["new"].vertices);
      }

      if (source["new"].edges !== undefined) {
        if (merge["new"].edges === undefined) {
          merge["new"].edges = [];
        }

        merge["new"].edges = merge["new"].edges.concat(source["new"].edges);
      }

      if (source["new"].faces !== undefined) {
        if (merge["new"].faces === undefined) {
          merge["new"].faces = [];
        }

        merge["new"].faces = merge["new"].faces.concat(source["new"].faces);
      }
    }

    if (source.update !== undefined) {
      Object.keys(source.update).forEach(function (i) {
        if (merge.update[i] == null) {
          merge.update[i] = source.update[i];
        } else {
          var keys1 = Object.keys(merge.update[i]);
          var keys2 = Object.keys(source.update[i]);
          var overlap = keys1.filter(function (key1key) {
            return keys2.includes(key1key);
          });

          if (overlap.length > 0) {
            var str = overlap.join(", ");
            console.warn("cannot merge. two diffs contain overlap at ".concat(str));
            return;
          }

          Object.assign(merge.update[i], source.update[i]);
        }
      });
    }

    if (source.remove !== undefined) {
      if (source.remove.vertices !== undefined) {
        if (merge.remove.vertices === undefined) {
          merge.remove.vertices = [];
        }

        merge.remove.vertices = merge.remove.vertices.concat(source.remove.vertices);
      }

      if (source.remove.edges !== undefined) {
        if (merge.remove.edges === undefined) {
          merge.remove.edges = [];
        }

        merge.remove.edges = merge.remove.edges.concat(source.remove.edges);
      }

      if (source.remove.faces !== undefined) {
        if (merge.remove.faces === undefined) {
          merge.remove.faces = [];
        }

        merge.remove.faces = merge.remove.faces.concat(source.remove.faces);
      }
    }

    Object.assign(target, source);
  };

  var copy_properties = function copy_properties(graph, geometry_prefix, index) {
    var prefixKeys = get_geometry_keys_with_prefix(graph, geometry_prefix);
    var result = {};
    prefixKeys.forEach(function (key) {
      result[key] = graph[key][index];
    });
    return result;
  };

  var add_edge = function add_edge(graph, a, b, c, d) {
    var assignment = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "U";
    var edge = math.segment(a, b, c, d);
    var endpoints_vertex_equivalent = [0, 1].map(function (ei) {
      return graph.vertices_coords.map(function (v) {
        return Math.sqrt(Math.pow(edge[ei][0] - v[0], 2) + Math.pow(edge[ei][1] - v[1], 2));
      }).map(function (dist, i) {
        return dist < math.core.EPSILON ? i : undefined;
      }).filter(function (el) {
        return el !== undefined;
      }).shift();
    });
    var edges = graph.edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return graph.vertices_coords[v];
      });
    });
    var endpoints_edge_collinear = [0, 1].map(function (ei) {
      return edges.map(function (e) {
        return math.core.point_on_segment(e[0], e[1], edge[ei]);
      }).map(function (on_edge, i) {
        return on_edge ? i : undefined;
      }).filter(function (e) {
        return e !== undefined;
      }).shift();
    });
    var vertices_origin = [0, 1].map(function (i) {
      if (endpoints_vertex_equivalent[i] !== undefined) {
        return "vertex";
      }

      if (endpoints_edge_collinear[i] !== undefined) {
        return "edge";
      }

      return "new";
    });
    var result = {
      "new": {
        vertices: [],
        edges: [{
          edges_vertices: []
        }]
      },
      remove: {
        edges: []
      }
    };
    var vertices_length = vertices_count$1(graph);

    var append_vertex = function append_vertex(i) {
      result["new"].vertices.push({
        vertices_coords: [edge[i][0], edge[i][1]]
      });
      vertices_length += 1;
      result["new"].edges[0].edges_vertices[i] = vertices_length - 1;
    };

    [0, 1].forEach(function (i) {
      switch (vertices_origin[i]) {
        case "vertex":
          result["new"].edges[0].edges_vertices[i] = endpoints_vertex_equivalent[i];
          break;

        case "edge":
          {
            append_vertex(i);
            var e = copy_properties(graph, "edges", endpoints_edge_collinear[i]);
            [clone$1(e), clone$1(e)].forEach(function (o, j) {
              o.edges_vertices = [graph.edges_vertices[endpoints_edge_collinear[i]][j], vertices_length - 1];
              result["new"].edges.push(o);
            });
            result.remove.edges.push(endpoints_edge_collinear[i]);
          }
          break;

        default:
          append_vertex(i);
          break;
      }
    });
    result["new"].edges.filter(function (e) {
      return e.edges_assignment === undefined;
    }).forEach(function (e) {
      e.edges_assignment = assignment;
    });

    result.apply = function () {
      return apply_run_diff(graph, result);
    };

    return result;
  };

  var isFoldedState = function isFoldedState(graph) {
    if (graph == null || graph.frame_classes == null || _typeof(graph.frame_classes) !== "object") {
      return undefined;
    }

    if (graph.frame_classes.includes(FOLDED_FORM)) {
      return true;
    }

    if (graph.frame_classes.includes(CREASE_PATTERN)) {
      return false;
    }

    return undefined;
  };

  var isBrowser$4 = typeof window !== "undefined" && typeof window.document !== "undefined";
  var isNode$4 = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
  var htmlString$4 = "<!DOCTYPE html><title> </title>";

  var win$4 = function () {
    var w = {};

    if (isNode$4) {
      var _require = require("xmldom"),
          DOMParser = _require.DOMParser,
          XMLSerializer = _require.XMLSerializer;

      w.DOMParser = DOMParser;
      w.XMLSerializer = XMLSerializer;
      w.document = new DOMParser().parseFromString(htmlString$4, "text/html");
    } else if (isBrowser$4) {
      w = window;
    }

    return w;
  }();

  function vkXML$2(text, step) {
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

  var NS = "http://www.w3.org/2000/svg";

  var downloadInBrowser = function downloadInBrowser(filename, contentsAsString) {
    var blob = new win$4.Blob([contentsAsString], {
      type: "text/plain"
    });
    var a = win$4.document.createElement("a");
    a.setAttribute("href", win$4.URL.createObjectURL(blob));
    a.setAttribute("download", filename);
    win$4.document.body.appendChild(a);
    a.click();
    win$4.document.body.removeChild(a);
  };

  var getPageCSS = function getPageCSS() {
    var css = [];

    for (var s = 0; s < win$4.document.styleSheets.length; s += 1) {
      var sheet = win$4.document.styleSheets[s];

      try {
        var rules = "cssRules" in sheet ? sheet.cssRules : sheet.rules;

        for (var r = 0; r < rules.length; r += 1) {
          var rule = rules[r];

          if ("cssText" in rule) {
            css.push(rule.cssText);
          } else {
            css.push("".concat(rule.selectorText, " {\n").concat(rule.style.cssText, "\n}\n"));
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }

    return css.join("\n");
  };

  var SAVE_OPTIONS = function SAVE_OPTIONS() {
    return {
      output: "string",
      windowStyle: false,
      filename: "image.svg"
    };
  };

  var save = function save(svg, options) {
    if (typeof options === "string" || options instanceof String) {
      var filename = options;
      options = SAVE_OPTIONS();
      options.filename = filename;
    } else if (_typeof(options) !== "object" || options === null) {
      options = SAVE_OPTIONS();
    } else {
      var newOptions = SAVE_OPTIONS();
      Object.keys(options).forEach(function (key) {
        newOptions[key] = options[key];
      });
      options = newOptions;
    }

    if (options.windowStyle) {
      var styleContainer = win$4.document.createElementNS(NS, "style");
      styleContainer.setAttribute("type", "text/css");
      styleContainer.innerHTML = getPageCSS();
      svg.appendChild(styleContainer);
    }

    var source = new win$4.XMLSerializer().serializeToString(svg);
    var formattedString = vkXML$2(source);

    if (isBrowser$4 && !isNode$4) {
      downloadInBrowser(options.filename, formattedString);
    }

    return options.output === "svg" ? svg : formattedString;
  };

  var load$1 = function load(input, callback) {
    if (typeof input === "string" || input instanceof String) {
      var xml = new win$4.DOMParser().parseFromString(input, "text/xml");
      var parserErrors = xml.getElementsByTagName("parsererror");

      if (parserErrors.length === 0) {
        var parsedSVG = xml.documentElement;

        if (callback != null) {
          callback(parsedSVG);
        }

        return parsedSVG;
      }

      fetch(input).then(function (response) {
        return response.text();
      }).then(function (str) {
        return new win$4.DOMParser().parseFromString(str, "text/xml");
      }).then(function (svgData) {
        var allSVGs = svgData.getElementsByTagName("svg");

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
    load: load$1
  });

  var bindSVGMethodsTo = function bindSVGMethodsTo(svg, environment) {
    Object.getOwnPropertyNames(svg).filter(function (p) {
      return typeof svg[p] === "function";
    }).forEach(function (name) {
      environment[name] = svg[name].bind(svg);
    });
    var forbidden = ["svg", "style", "setPoints", "setArc", "setEllipticalArc", "setBezier"];
    Object.keys(win$4.SVG).filter(function (key) {
      return environment[key] === undefined;
    }).filter(function (key) {
      return forbidden.indexOf(key) === -1;
    }).forEach(function (key) {
      environment[key] = win$4.SVG[key];
    });
    Object.defineProperty(win$4, "mousePressed", {
      set: function set(value) {
        svg.mousePressed = value;
      },
      get: function get() {
        return svg.mousePressed;
      }
    });
    Object.defineProperty(win$4, "mouseReleased", {
      set: function set(value) {
        svg.mouseReleased = value;
      },
      get: function get() {
        return svg.mouseReleased;
      }
    });
    Object.defineProperty(win$4, "mouseMoved", {
      set: function set(value) {
        svg.mouseMoved = value;
      },
      get: function get() {
        return svg.mouseMoved;
      }
    });
    Object.defineProperty(win$4, "scroll", {
      set: function set(value) {
        svg.scroll = value;
      },
      get: function get() {
        return svg.scroll;
      }
    });
    Object.defineProperty(win$4, "animate", {
      set: function set(value) {
        svg.animate = value;
      },
      get: function get() {
        return svg.animate;
      }
    });
    Object.defineProperty(win$4, "fps", {
      set: function set(value) {
        svg.fps = value;
      },
      get: function get() {
        return svg.fps;
      }
    });
  };

  var globalize = function globalize(svg) {
    var element = svg;

    if (element == null) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      element = win$4.SVG.apply(win$4, args);
    }

    bindSVGMethodsTo(element, win$4);
    return element;
  };

  var getViewBox = function getViewBox(svg) {
    var vb = svg.getAttribute("viewBox");
    return vb == null ? undefined : vb.split(" ").map(function (n) {
      return parseFloat(n);
    });
  };

  var setViewBox$1 = function setViewBox(svg, x, y, width, height) {
    var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    var scale = 1.0;
    var d = width / scale - width;
    var X = x - d - padding;
    var Y = y - d - padding;
    var W = width + d * 2 + padding * 2;
    var H = height + d * 2 + padding * 2;
    var viewBoxString = [X, Y, W, H].join(" ");
    svg.setAttributeNS(null, "viewBox", viewBoxString);
  };

  var setDefaultViewBox = function setDefaultViewBox(svg) {
    var size = svg.getBoundingClientRect();
    var width = size.width === 0 ? 640 : size.width;
    var height = size.height === 0 ? 480 : size.height;
    setViewBox$1(svg, 0, 0, width, height);
  };

  var convertToViewBox = function convertToViewBox(svg, x, y) {
    var pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    var svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    var array = [svgPoint.x, svgPoint.y];
    array.x = svgPoint.x;
    array.y = svgPoint.y;
    return array;
  };

  var translateViewBox = function translateViewBox(svg, dx, dy) {
    var viewBox = getViewBox(svg);

    if (viewBox == null) {
      setDefaultViewBox(svg);
    }

    viewBox[0] += dx;
    viewBox[1] += dy;
    svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
  };

  var scaleViewBox = function scaleViewBox(svg, scale) {
    var origin_x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var origin_y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    if (Math.abs(scale) < 1e-8) {
      scale = 0.01;
    }

    var matrix = svg.createSVGMatrix().translate(origin_x, origin_y).scale(1 / scale).translate(-origin_x, -origin_y);
    var viewBox = getViewBox(svg);

    if (viewBox == null) {
      setDefaultViewBox(svg);
    }

    var top_left = svg.createSVGPoint();
    var bot_right = svg.createSVGPoint();

    var _viewBox = _slicedToArray(viewBox, 2);

    top_left.x = _viewBox[0];
    top_left.y = _viewBox[1];
    bot_right.x = viewBox[0] + viewBox[2];
    bot_right.y = viewBox[1] + viewBox[3];
    var new_top_left = top_left.matrixTransform(matrix);
    var new_bot_right = bot_right.matrixTransform(matrix);
    setViewBox$1(svg, new_top_left.x, new_top_left.y, new_bot_right.x - new_top_left.x, new_bot_right.y - new_top_left.y);
  };

  var ViewBox = Object.freeze({
    __proto__: null,
    getViewBox: getViewBox,
    setViewBox: setViewBox$1,
    convertToViewBox: convertToViewBox,
    translateViewBox: translateViewBox,
    scaleViewBox: scaleViewBox
  });

  var Pointer = function Pointer(node) {
    var pointer = Object.create(null);
    Object.assign(pointer, {
      isPressed: false,
      position: [0, 0],
      pressed: [0, 0],
      drag: [0, 0],
      previous: [0, 0],
      x: 0,
      y: 0
    });
    var _ref = [0, 0];
    pointer.position.x = _ref[0];
    pointer.position.y = _ref[1];
    var _ref2 = [0, 0];
    pointer.pressed.x = _ref2[0];
    pointer.pressed.y = _ref2[1];
    var _ref3 = [0, 0];
    pointer.drag.x = _ref3[0];
    pointer.drag.y = _ref3[1];
    var _ref4 = [0, 0];
    pointer.previous.x = _ref4[0];
    pointer.previous.y = _ref4[1];

    var copyPointer = function copyPointer() {
      var m = pointer.position.slice();
      Object.keys(pointer).filter(function (key) {
        return _typeof(key) === "object";
      }).forEach(function (key) {
        m[key] = pointer[key].slice();
      });
      Object.keys(pointer).filter(function (key) {
        return _typeof(key) !== "object";
      }).forEach(function (key) {
        m[key] = pointer[key];
      });
      return Object.freeze(m);
    };

    var setPosition = function setPosition(clientX, clientY) {
      pointer.position = convertToViewBox(node, clientX, clientY);

      var _pointer$position = _slicedToArray(pointer.position, 2);

      pointer.x = _pointer$position[0];
      pointer.y = _pointer$position[1];
    };

    var updateDrag = function updateDrag() {
      pointer.drag = [pointer.position[0] - pointer.pressed[0], pointer.position[1] - pointer.pressed[1]];

      var _pointer$drag = _slicedToArray(pointer.drag, 2);

      pointer.drag.x = _pointer$drag[0];
      pointer.drag.y = _pointer$drag[1];
    };

    var thisPointer = {};

    var move = function move(clientX, clientY) {
      var isPressed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (isPressed && !pointer.isPressed) {
        pointer.pressed = convertToViewBox(node, clientX, clientY);
      }

      pointer.isPressed = isPressed;
      pointer.previous = pointer.position;
      setPosition(clientX, clientY);

      if (pointer.isPressed) {
        updateDrag();
      } else {
        pointer.drag = [0, 0];
        pointer.pressed = [0, 0];

        var _pointer$drag2 = _slicedToArray(pointer.drag, 2);

        pointer.drag.x = _pointer$drag2[0];
        pointer.drag.y = _pointer$drag2[1];

        var _pointer$pressed = _slicedToArray(pointer.pressed, 2);

        pointer.pressed.x = _pointer$pressed[0];
        pointer.pressed.y = _pointer$pressed[1];
      }

      return thisPointer;
    };

    var release = function release() {
      pointer.isPressed = false;
      return thisPointer;
    };

    Object.defineProperty(thisPointer, "release", {
      value: release
    });
    Object.defineProperty(thisPointer, "move", {
      value: move
    });
    Object.defineProperty(thisPointer, "get", {
      value: copyPointer
    });
    return thisPointer;
  };

  var Touches = function Touches(node) {
    var pointer = Pointer(node);
    var handlers = {
      mousemove: [],
      touchmove: [],
      mousedown: [],
      touchstart: [],
      mouseup: [],
      touchend: [],
      scroll: [],
      mouseleave: [],
      mouseover: [],
      touchcancel: []
    };

    var clear = function clear() {
      Object.keys(handlers).forEach(function (key) {
        return handlers[key].forEach(function (f) {
          return node.removeEventListener(key, f);
        });
      });
      Object.keys(handlers).forEach(function (key) {
        handlers[key] = [];
      });
    };

    var onMouseMove = function onMouseMove(handler, event) {
      event.preventDefault();
      var e = pointer.move(event.clientX, event.clientY, event.buttons > 0).get();
      handler(e);
      return e;
    };

    var onTouchMove = function onTouchMove(handler, event) {
      event.preventDefault();
      var e = pointer.move(event.touches[0].clientX, event.touches[0].clientY, true).get();
      handler(e);
      return e;
    };

    var onMouseDown = function onMouseDown(handler, event) {
      event.preventDefault();
      var e = pointer.move(event.clientX, event.clientY, true).get();
      handler(e);
      return e;
    };

    var onTouchStart = function onTouchStart(handler, event) {
      event.preventDefault();
      var e = pointer.move(event.touches[0].clientX, event.touches[0].clientY, true).get();
      handler(e);
      return e;
    };

    var onEnd = function onEnd(handler, event) {
      event.preventDefault();
      var e = pointer.release().get();
      handler(e);
      return e;
    };

    var onScroll = function onScroll(handler, event) {
      var e = {
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaZ: event.deltaZ
      };
      e.position = convertToViewBox(node, event.clientX, event.clientY);

      var _e$position = _slicedToArray(e.position, 2);

      e.x = _e$position[0];
      e.y = _e$position[1];
      event.preventDefault();
      handler(e);
      return e;
    };

    Object.defineProperty(node, "mouse", {
      get: function get() {
        return pointer.get();
      },
      enumerable: true
    });
    Object.defineProperty(node, "mouseMoved", {
      set: function set(handler) {
        var mouseFunc = function mouseFunc(event) {
          return onMouseMove(handler, event);
        };

        var touchFunc = function touchFunc(event) {
          return onTouchMove(handler, event);
        };

        handlers.mousemove.push(mouseFunc);
        handlers.touchmove.push(mouseFunc);
        node.addEventListener("mousemove", mouseFunc);
        node.addEventListener("touchmove", touchFunc);
      },
      enumerable: true
    });
    Object.defineProperty(node, "mousePressed", {
      set: function set(handler) {
        var mouseFunc = function mouseFunc(event) {
          return onMouseDown(handler, event);
        };

        var touchFunc = function touchFunc(event) {
          return onTouchStart(handler, event);
        };

        handlers.mousedown.push(mouseFunc);
        handlers.touchstart.push(touchFunc);
        node.addEventListener("mousedown", mouseFunc);
        node.addEventListener("touchstart", touchFunc);
      },
      enumerable: true
    });
    Object.defineProperty(node, "mouseReleased", {
      set: function set(handler) {
        var mouseFunc = function mouseFunc(event) {
          return onEnd(handler, event);
        };

        var touchFunc = function touchFunc(event) {
          return onEnd(handler, event);
        };

        handlers.mouseup.push(mouseFunc);
        handlers.touchend.push(touchFunc);
        node.addEventListener("mouseup", mouseFunc);
        node.addEventListener("touchend", touchFunc);
      },
      enumerable: true
    });
    Object.defineProperty(node, "scroll", {
      set: function set(handler) {
        var scrollFunc = function scrollFunc(event) {
          return onScroll(handler, event);
        };

        handlers.mouseup.push(scrollFunc);
        node.addEventListener("scroll", scrollFunc);
      },
      enumerable: true
    });
    return {
      clear: clear,
      pointer: pointer
    };
  };

  var DEFAULT_DELAY = 1000 / 60;

  var Animate = function Animate(node) {
    var timers = [];
    var frameNumber;
    var delay = DEFAULT_DELAY;
    var func;

    var clear = function clear() {
      while (timers.length > 0) {
        clearInterval(timers.shift());
      }

      func = undefined;
    };

    var start = function start() {
      if (typeof func !== "function") {
        return;
      }

      timers.push(setInterval(function () {
        func({
          time: node.getCurrentTime(),
          frame: frameNumber += 1
        });
      }, delay));
    };

    var setLoop = function setLoop(handler) {
      clear();
      func = handler;

      if (typeof func === "function") {
        frameNumber = 0;
        start();
      }
    };

    var validateMillis = function validateMillis(m) {
      var parsed = parseFloat(m);

      if (!isNaN(parsed) && isFinite(parsed)) {
        return parsed;
      }

      return DEFAULT_DELAY;
    };

    var setFPS = function setFPS(fps) {
      clear();
      delay = validateMillis(1000 / fps);
      start();
    };

    Object.defineProperty(node, "animate", {
      set: function set(handler) {
        return setLoop(handler);
      },
      enumerable: true
    });
    Object.defineProperty(node, "clear", {
      value: function value() {
        return clear();
      },
      enumerable: true
    });
    return {
      clear: clear,
      setLoop: setLoop,
      setFPS: setFPS
    };
  };

  var Events = function Events(node) {
    var animate = Animate(node);
    var touches = Touches(node);
    Object.defineProperty(node, "stopAnimations", {
      value: animate.clear,
      enumerated: true
    });
    Object.defineProperty(node, "freeze", {
      value: function value() {
        touches.clear();
        animate.clear();
      },
      enumerated: true
    });
    Object.defineProperty(node, "fps", {
      set: function set(fps) {
        return animate.setFPS(fps);
      },
      enumerated: true
    });
  };

  var controlPoint = function controlPoint(parent) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var position = [0, 0];
    var selected = false;
    var svg;

    var updateSVG = function updateSVG() {
      if (svg != null) {
        if (svg.parentNode == null) {
          parent.appendChild(svg);
        }

        svg.setAttribute("cx", position[0]);
        svg.setAttribute("cy", position[1]);
      }
    };

    var proxy = new Proxy(position, {
      set: function set(target, property, value, receiver) {
        target[property] = value;
        updateSVG();
        return true;
      }
    });

    var setPosition = function setPosition() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (args.length === 0) {
        return;
      }

      var root = _typeof(args[0]);

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
        position.delegate.apply(position.pointsContainer, [proxy, position.pointsContainer]);
      }
    };

    setPosition(options.position);

    var updatePosition = function updatePosition(input) {
      return input;
    };

    var onMouseMove = function onMouseMove(mouse) {
      if (selected) {
        setPosition(updatePosition(mouse));
      }
    };

    var onMouseUp = function onMouseUp() {
      selected = false;
    };

    var distance = function distance(mouse) {
      return [0, 1].map(function (i) {
        return mouse[i] - position[i];
      }).map(function (e) {
        return Math.pow(e, 2);
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    };

    position.delegate = undefined;
    position.setPosition = setPosition;
    position.onMouseMove = onMouseMove;
    position.onMouseUp = onMouseUp;
    position.distance = distance;
    Object.defineProperty(position, "x", {
      get: function get() {
        return position[0];
      },
      set: function set(newValue) {
        position[0] = newValue;
      }
    });
    Object.defineProperty(position, "y", {
      get: function get() {
        return position[1];
      },
      set: function set(newValue) {
        position[1] = newValue;
      }
    });
    Object.defineProperty(position, "svg", {
      get: function get() {
        return svg;
      },
      set: function set(newSVG) {
        svg = newSVG;
      }
    });
    Object.defineProperty(position, "positionDidUpdate", {
      set: function set(method) {
        updatePosition = method;
      }
    });
    Object.defineProperty(position, "selected", {
      set: function set(value) {
        selected = value;
      }
    });
    Object.defineProperty(position, "remove", {
      value: function value() {
        if (svg != null) {
          svg.parentNode.removeChild(svg);
        }
      }
    });
    return proxy;
  };

  var controls = function controls(svg, number, options) {
    var selected;
    var delegate;
    var points = Array.from(Array(number)).map(function () {
      return controlPoint(svg, options);
    });
    points.forEach(function (pt, i) {
      if (_typeof(options) === "object" && typeof options.position === "function") {
        pt.setPosition(options.position(i));
      }
    });

    var protocol = function protocol(point) {
      if (typeof delegate === "function") {
        delegate.call(points, points, point);
      }
    };

    points.forEach(function (p) {
      p.delegate = protocol;
      p.pointsContainer = points;
    });

    var mousePressedHandler = function mousePressedHandler(mouse) {
      if (!(points.length > 0)) {
        return;
      }

      selected = points.map(function (p, i) {
        return {
          i: i,
          d: p.distance(mouse)
        };
      }).sort(function (a, b) {
        return a.d - b.d;
      }).shift().i;
      points[selected].selected = true;
    };

    var mouseMovedHandler = function mouseMovedHandler(mouse) {
      points.forEach(function (p) {
        return p.onMouseMove(mouse);
      });
    };

    var mouseReleasedHandler = function mouseReleasedHandler() {
      points.forEach(function (p) {
        return p.onMouseUp();
      });
      selected = undefined;
    };

    svg.mousePressed = mousePressedHandler;
    svg.mouseMoved = mouseMovedHandler;
    svg.mouseReleased = mouseReleasedHandler;
    Object.defineProperty(points, "selectedIndex", {
      get: function get() {
        return selected;
      }
    });
    Object.defineProperty(points, "selected", {
      get: function get() {
        return points[selected];
      }
    });
    Object.defineProperty(points, "add", {
      value: function value(opt) {
        points.push(controlPoint(svg, opt));
      }
    });

    points.removeAll = function () {
      while (points.length > 0) {
        points.pop().remove();
      }
    };

    points.onChange = function (func, runOnceAtStart) {
      if (typeof func === "function") {
        delegate = func;

        if (runOnceAtStart === true) {
          func.call(points, points, undefined);
        }
      }

      return points;
    };

    points.position = function (func) {
      if (typeof func === "function") {
        points.forEach(function (p, i) {
          return p.setPosition(func.call(points, i));
        });
      }

      return points;
    };

    points.svg = function (func) {
      if (typeof func === "function") {
        points.forEach(function (p, i) {
          p.svg = func.call(points, i);
        });
      }

      return points;
    };

    points.parent = function (parent) {
      if (parent != null && parent.appendChild != null) {
        points.forEach(function (p) {
          parent.appendChild(p.svg);
        });
      }

      return points;
    };

    return points;
  };

  var is_iterable$1 = function is_iterable(obj) {
    return obj != null && typeof obj[Symbol.iterator] === "function";
  };

  var flatten_input$1 = function flatten_input() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    switch (args.length) {
      case undefined:
      case 0:
        return args;

      case 1:
        return is_iterable$1(args[0]) && typeof args[0] !== "string" ? flatten_input.apply(void 0, _toConsumableArray(args[0])) : [args[0]];

      default:
        return Array.from(args).map(function (a) {
          return is_iterable$1(a) ? _toConsumableArray(flatten_input(a)) : a;
        }).reduce(function (a, b) {
          return a.concat(b);
        }, []);
    }
  };

  var setPoints = function setPoints(shape) {
    for (var _len4 = arguments.length, pointsArray = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      pointsArray[_key4 - 1] = arguments[_key4];
    }

    var flat = flatten_input$1.apply(void 0, pointsArray);
    var pointsString = "";

    if (typeof flat[0] === "number") {
      pointsString = Array.from(Array(Math.floor(flat.length / 2))).reduce(function (a, b, i) {
        return "".concat(a).concat(flat[i * 2], ",").concat(flat[i * 2 + 1], " ");
      }, "");
    }

    if (_typeof(flat[0]) === "object") {
      if (typeof flat[0].x === "number") {
        pointsString = flat.reduce(function (prev, curr) {
          return "".concat(prev).concat(curr.x, ",").concat(curr.y, " ");
        }, "");
      }

      if (typeof flat[0][0] === "number") {
        pointsString = flat.reduce(function (prev, curr) {
          return "".concat(prev).concat(curr[0], ",").concat(curr[1], " ");
        }, "");
      }
    }

    shape.setAttributeNS(null, "points", pointsString);
    return shape;
  };

  var setLinePoints = function setLinePoints(shape) {
    for (var _len5 = arguments.length, pointsArray = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      pointsArray[_key5 - 1] = arguments[_key5];
    }

    var flat = flatten_input$1.apply(void 0, pointsArray);
    var points = [];

    if (typeof flat[0] === "number") {
      points = flat;
    }

    if (_typeof(flat[0]) === "object") {
      if (typeof flat[0].x === "number") {
        points = flat.map(function (p) {
          return [p[0], p[1]];
        }).reduce(function (a, b) {
          return a.concat(b);
        }, []);
      }

      if (typeof flat[0][0] === "number") {
        points = flat.reduce(function (a, b) {
          return a.concat(b);
        }, []);
      }
    }

    if (points[0] != null) {
      shape.setAttributeNS(null, "x1", points[0]);
    }

    if (points[1] != null) {
      shape.setAttributeNS(null, "y1", points[1]);
    }

    if (points[2] != null) {
      shape.setAttributeNS(null, "x2", points[2]);
    }

    if (points[3] != null) {
      shape.setAttributeNS(null, "y2", points[3]);
    }

    return shape;
  };

  var setCenter = function setCenter(shape) {
    for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      args[_key6 - 1] = arguments[_key6];
    }

    var flat = flatten_input$1.apply(void 0, args);

    if (typeof flat[0] === "number") {
      if (flat[0] != null) {
        shape.setAttributeNS(null, "cx", flat[0]);
      }

      if (flat[1] != null) {
        shape.setAttributeNS(null, "cy", flat[1]);
      }
    }

    if (typeof flat.x === "number") {
      if (flat.x != null) {
        shape.setAttributeNS(null, "cx", flat.x);
      }

      if (flat.y != null) {
        shape.setAttributeNS(null, "cy", flat.y);
      }
    }

    return shape;
  };

  var setArc = function setArc(shape, x, y, radius, startAngle, endAngle) {
    var includeCenter = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

    if (endAngle == null) {
      return undefined;
    }

    var start = [x + Math.cos(startAngle) * radius, y + Math.sin(startAngle) * radius];
    var vecStart = [Math.cos(startAngle) * radius, Math.sin(startAngle) * radius];
    var vecEnd = [Math.cos(endAngle) * radius, Math.sin(endAngle) * radius];
    var arcVec = [vecEnd[0] - vecStart[0], vecEnd[1] - vecStart[1]];
    var py = vecStart[0] * vecEnd[1] - vecStart[1] * vecEnd[0];
    var px = vecStart[0] * vecEnd[0] + vecStart[1] * vecEnd[1];
    var arcdir = Math.atan2(py, px) > 0 ? 0 : 1;
    var d = includeCenter ? "M ".concat(x, ",").concat(y, " l ").concat(vecStart[0], ",").concat(vecStart[1], " ") : "M ".concat(start[0], ",").concat(start[1], " ");
    d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");

    if (includeCenter) {
      d += " Z";
    }

    shape.setAttributeNS(null, "d", d);
    return shape;
  };

  var setEllipticalArc = function setEllipticalArc(shape, x, y, rX, rY, startAngle, endAngle) {
    var includeCenter = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

    if (endAngle == null) {
      return undefined;
    }

    var start = [x + Math.cos(startAngle) * rX, y + Math.sin(startAngle) * rY];
    var vecStart = [Math.cos(startAngle) * rX, Math.sin(startAngle) * rY];
    var vecEnd = [Math.cos(endAngle) * rX, Math.sin(endAngle) * rY];
    var arcVec = [vecEnd[0] - vecStart[0], vecEnd[1] - vecStart[1]];
    var py = vecStart[0] * vecEnd[1] - vecStart[1] * vecEnd[0];
    var px = vecStart[0] * vecEnd[0] + vecStart[1] * vecEnd[1];
    var arcdir = Math.atan2(py, px) > 0 ? 0 : 1;
    var d = includeCenter ? "M ".concat(x, ",").concat(y, " l ").concat(vecStart[0], ",").concat(vecStart[1], " ") : "M ".concat(start[0], ",").concat(start[1], " ");
    d += ["a ", rX, rY, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");

    if (includeCenter) {
      d += " Z";
    }

    shape.setAttributeNS(null, "d", d);
    return shape;
  };

  var setBezier = function setBezier(shape, fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
    if (toY == null) {
      return undefined;
    }

    var pts = [[fromX, fromY], [c1X, c1Y], [c2X, c2Y], [toX, toY]].map(function (p) {
      return p.join(",");
    });
    var d = "M ".concat(pts[0], " C ").concat(pts[1], " ").concat(pts[2], " ").concat(pts[3]);
    shape.setAttributeNS(null, "d", d);
    return shape;
  };

  var setArrowPoints = function setArrowPoints(shape) {
    var children = Array.from(shape.childNodes);
    var path = children.filter(function (node) {
      return node.tagName === "path";
    }).shift();
    var polys = ["svg-arrow-head", "svg-arrow-tail"].map(function (c) {
      return children.filter(function (n) {
        return n.getAttribute("class") === c;
      }).shift();
    });

    for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      args[_key7 - 1] = arguments[_key7];
    }

    var flat = flatten_input$1.apply(void 0, args);
    var endpoints = [];

    if (typeof flat[0] === "number") {
      endpoints = flat;
    }

    if (_typeof(flat[0]) === "object") {
      if (typeof flat[0].x === "number") {
        endpoints = flat.map(function (p) {
          return [p[0], p[1]];
        }).reduce(function (a, b) {
          return a.concat(b);
        }, []);
      }

      if (typeof flat[0][0] === "number") {
        endpoints = flat.reduce(function (a, b) {
          return a.concat(b);
        }, []);
      }
    }

    if (!endpoints.length && shape.endpoints != null) {
      endpoints = shape.endpoints;
    }

    if (!endpoints.length) {
      return shape;
    }

    shape.endpoints = endpoints;
    var o = shape.options;
    var tailPt = [endpoints[0], endpoints[1]];
    var headPt = [endpoints[2], endpoints[3]];
    var vector = [headPt[0] - tailPt[0], headPt[1] - tailPt[1]];
    var midpoint = [tailPt[0] + vector[0] / 2, tailPt[1] + vector[1] / 2];
    var len = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
    var minLength = (o.tail.visible ? (1 + o.tail.padding) * o.tail.height * 2.5 : 0) + (o.head.visible ? (1 + o.head.padding) * o.head.height * 2.5 : 0);

    if (len < minLength) {
      var minVec = len === 0 ? [minLength, 0] : [vector[0] / len * minLength, vector[1] / len * minLength];
      tailPt = [midpoint[0] - minVec[0] * 0.5, midpoint[1] - minVec[1] * 0.5];
      headPt = [midpoint[0] + minVec[0] * 0.5, midpoint[1] + minVec[1] * 0.5];
      vector = [headPt[0] - tailPt[0], headPt[1] - tailPt[1]];
    }

    var perpendicular = [vector[1], -vector[0]];
    var bezPoint = [midpoint[0] + perpendicular[0] * o.curve, midpoint[1] + perpendicular[1] * o.curve];
    var bezTail = [bezPoint[0] - tailPt[0], bezPoint[1] - tailPt[1]];
    var bezHead = [bezPoint[0] - headPt[0], bezPoint[1] - headPt[1]];
    var bezTailLen = Math.sqrt(Math.pow(bezTail[0], 2) + Math.pow(bezTail[1], 2));
    var bezHeadLen = Math.sqrt(Math.pow(bezHead[0], 2) + Math.pow(bezHead[1], 2));
    var bezTailNorm = bezTailLen === 0 ? bezTail : [bezTail[0] / bezTailLen, bezTail[1] / bezTailLen];
    var bezHeadNorm = bezTailLen === 0 ? bezHead : [bezHead[0] / bezHeadLen, bezHead[1] / bezHeadLen];
    var tailVector = [-bezTailNorm[0], -bezTailNorm[1]];
    var headVector = [-bezHeadNorm[0], -bezHeadNorm[1]];
    var tailNormal = [tailVector[1], -tailVector[0]];
    var headNormal = [headVector[1], -headVector[0]];
    var tailArc = [tailPt[0] + bezTailNorm[0] * o.tail.height * ((o.tail.visible ? 1 : 0) + o.tail.padding), tailPt[1] + bezTailNorm[1] * o.tail.height * ((o.tail.visible ? 1 : 0) + o.tail.padding)];
    var headArc = [headPt[0] + bezHeadNorm[0] * o.head.height * ((o.head.visible ? 1 : 0) + o.head.padding), headPt[1] + bezHeadNorm[1] * o.head.height * ((o.head.visible ? 1 : 0) + o.head.padding)];
    vector = [headArc[0] - tailArc[0], headArc[1] - tailArc[1]];
    perpendicular = [vector[1], -vector[0]];
    midpoint = [tailArc[0] + vector[0] / 2, tailArc[1] + vector[1] / 2];
    bezPoint = [midpoint[0] + perpendicular[0] * o.curve, midpoint[1] + perpendicular[1] * o.curve];
    var tailControl = [tailArc[0] + (bezPoint[0] - tailArc[0]) * o.pinch, tailArc[1] + (bezPoint[1] - tailArc[1]) * o.pinch];
    var headControl = [headArc[0] + (bezPoint[0] - headArc[0]) * o.pinch, headArc[1] + (bezPoint[1] - headArc[1]) * o.pinch];
    var tailPolyPts = [[tailArc[0] + tailNormal[0] * -o.tail.width, tailArc[1] + tailNormal[1] * -o.tail.width], [tailArc[0] + tailNormal[0] * o.tail.width, tailArc[1] + tailNormal[1] * o.tail.width], [tailArc[0] + tailVector[0] * o.tail.height, tailArc[1] + tailVector[1] * o.tail.height]];
    var headPolyPts = [[headArc[0] + headNormal[0] * -o.head.width, headArc[1] + headNormal[1] * -o.head.width], [headArc[0] + headNormal[0] * o.head.width, headArc[1] + headNormal[1] * o.head.width], [headArc[0] + headVector[0] * o.head.height, headArc[1] + headVector[1] * o.head.height]];
    path.setAttribute("d", "M".concat(tailArc[0], ",").concat(tailArc[1], "C").concat(tailControl[0], ",").concat(tailControl[1], ",").concat(headControl[0], ",").concat(headControl[1], ",").concat(headArc[0], ",").concat(headArc[1]));

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
  var attributes$1 = ["accumulate", "additive", "alignment-baseline", "amplitude", "attributeName", "azimuth", "baseFrequency", "baseline-shift", "baseProfile", "bbox", "begin", "bias", "by", "CSection", "calcMode", "cap-height", "clip", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "contentScriptType", "contentStyleType", "cursor", "DSection", "decelerate", "descent", "diffuseConstant", "direction", "display", "divisor", "dominant-baseline", "dur", "ESection", "edgeMode", "elevation", "enable-background", "end", "exponent", "externalResourcesRequired", "FSection", "fill", "fill-opacity", "fill-rule", "filter", "filterRes", "filterUnits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "format", "from", "fr", "fx", "fy", "GSection", "g1", "g2", "glyph-name", "glyph-orientation-horizontal", "glyph-orientation-vertical", "glyphRef", "gradientTransform", "gradientUnits", "HSection", "hanging", "href", "hreflang", "horiz-adv-x", "horiz-origin-x", "ISection", "image-rendering", "in", "in2", "intercept", "k1", "k2", "k3", "k4", "kernelMatrix", "keyPoints", "keySplines", "keyTimes", "LSection", "lang", "letter-spacing", "lighting-color", "limitingConeAngle", "local", "MSection", "marker-end", "marker-mid", "marker-start", "markerHeight", "markerUnits", "markerWidth", "mathematical", "max", "media", "method", "min", "mode", "NSection", "name", "numOctaves", "OSection", "opacity", "operator", "order", "orient", "overflow", "overline-position", "overline-thickness", "PSection", "paint-order", "patternContentUnits", "patternTransform", "patternUnits", "pointer-events", "pointsAtX", "pointsAtY", "pointsAtZ", "preserveAlpha", "preserveAspectRatio", "primitiveUnits", "RSection", "radius", "refX", "refY", "rendering-intent", "repeatCount", "repeatDur", "requiredFeatures", "restart", "result", "SSection", "seed", "shape-rendering", "spacing", "specularConstant", "specularExponent", "spreadMethod", "startOffset", "stdDeviation", "stemh", "stemv", "stitchTiles", "stop-color", "stop-opacity", "strikethrough-position", "strikethrough-thickness", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "surfaceScale", "TSection", "tabindex", "tableValues", "target", "targetX", "targetY", "text-anchor", "text-decoration", "text-rendering", "to", "transform-origin", "type", "USection", "u1", "u2", "underline-position", "underline-thickness", "unicode", "unicode-range", "units-per-em", "user-select", "VSection", "v-alphabetic", "v-hanging", "v-ideographic", "v-mathematical", "values", "vector-effect", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "viewTarget", "visibility", "WSection", "widths", "word-spacing", "writing-mode", "XSection", "xChannelSelector", "YSection", "yChannelSelector", "ZSection"];

  var removeChildren = function removeChildren(parent) {
    while (parent.lastChild) {
      parent.removeChild(parent.lastChild);
    }
  };

  var appendTo = function appendTo(element, parent) {
    if (parent != null) {
      parent.appendChild(element);
    }

    return element;
  };

  var toKebab = function toKebab(string) {
    return string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2").toLowerCase();
  };

  var setAttributes = function setAttributes(element, attributes) {
    Object.keys(attributes).forEach(function (key) {
      element.setAttribute(toKebab(key), attributes[key]);
    });
    return element;
  };

  var getClassList = function getClassList(xmlNode) {
    var currentClass = xmlNode.getAttribute("class");
    return currentClass == null ? [] : currentClass.split(" ").filter(function (s) {
      return s !== "";
    });
  };

  var addClass = function addClass(xmlNode, newClass) {
    if (xmlNode == null) {
      return xmlNode;
    }

    var classes = getClassList(xmlNode).filter(function (c) {
      return c !== newClass;
    });
    classes.push(newClass);
    xmlNode.setAttributeNS(null, "class", classes.join(" "));
    return xmlNode;
  };

  var removeClass = function removeClass(xmlNode, removedClass) {
    if (xmlNode == null) {
      return xmlNode;
    }

    var classes = getClassList(xmlNode).filter(function (c) {
      return c !== removedClass;
    });
    xmlNode.setAttributeNS(null, "class", classes.join(" "));
    return xmlNode;
  };

  var setClass = function setClass(xmlNode, className) {
    xmlNode.setAttributeNS(null, "class", className);
    return xmlNode;
  };

  var setID = function setID(xmlNode, idName) {
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

  var setTransform = function setTransform(element, transform) {
    if (_typeof(transform) === "object") {
      element.setAttribute("transform", transform.join(" "));
    } else if (typeof transform === "string") {
      element.setAttribute("transform", transform);
    }
  };

  var getTransform = function getTransform(element) {
    var trans = element.getAttribute("transform");
    return trans == null ? undefined : trans.split(" ");
  };

  var translate = function translate(element, tx, ty) {
    var trans = getTransform(element) || [];
    trans.push("translate(".concat(tx, ", ").concat(ty, ")"));
    setTransform(element, trans);
    return element;
  };

  var rotate = function rotate(element, angle) {
    var trans = getTransform(element) || [];
    trans.push("rotate(".concat(angle, ")"));
    setTransform(element, trans);
    return element;
  };

  var scale = function scale(element, sx, sy) {
    var trans = getTransform(element) || [];
    trans.push("scale(".concat(sx, ", ").concat(sy, ")"));
    setTransform(element, trans);
    return element;
  };

  var clearTransforms = function clearTransforms(element) {
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

  var d = function d(element) {
    var attr = element.getAttribute("d");

    if (attr == null) {
      attr = "";
    }

    return attr;
  };

  var append = function append(element, command) {
    for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
      args[_key8 - 2] = arguments[_key8];
    }

    var params = flatten_input$1(args).join(",");
    element.setAttribute("d", "".concat(d(element)).concat(command).concat(params));
    return element;
  };

  var command = function command(element, cmd) {
    for (var _len9 = arguments.length, args = new Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
      args[_key9 - 2] = arguments[_key9];
    }

    return append.apply(void 0, [element, cmd].concat(args));
  };

  var moveTo = function moveTo(element) {
    for (var _len10 = arguments.length, args = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
      args[_key10 - 1] = arguments[_key10];
    }

    return append.apply(void 0, [element, "M"].concat(args));
  };

  var _moveTo = function _moveTo(element) {
    for (var _len11 = arguments.length, args = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
      args[_key11 - 1] = arguments[_key11];
    }

    return append.apply(void 0, [element, "m"].concat(args));
  };

  var lineTo = function lineTo(element) {
    for (var _len12 = arguments.length, args = new Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
      args[_key12 - 1] = arguments[_key12];
    }

    return append.apply(void 0, [element, "L"].concat(args));
  };

  var _lineTo = function _lineTo(element) {
    for (var _len13 = arguments.length, args = new Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
      args[_key13 - 1] = arguments[_key13];
    }

    return append.apply(void 0, [element, "l"].concat(args));
  };

  var verticalLineTo = function verticalLineTo(element, y) {
    return append(element, "V", y);
  };

  var _verticalLineTo = function _verticalLineTo(element, y) {
    return append(element, "v", y);
  };

  var horizontalLineTo = function horizontalLineTo(element, x) {
    return append(element, "H", x);
  };

  var _horizontalLineTo = function _horizontalLineTo(element, x) {
    return append(element, "h", x);
  };

  var ellipseTo = function ellipseTo(element) {
    for (var _len14 = arguments.length, args = new Array(_len14 > 1 ? _len14 - 1 : 0), _key14 = 1; _key14 < _len14; _key14++) {
      args[_key14 - 1] = arguments[_key14];
    }

    return append.apply(void 0, [element, "A"].concat(args));
  };

  var _ellipseTo = function _ellipseTo(element) {
    for (var _len15 = arguments.length, args = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
      args[_key15 - 1] = arguments[_key15];
    }

    return append.apply(void 0, [element, "a"].concat(args));
  };

  var curveTo = function curveTo(element) {
    for (var _len16 = arguments.length, args = new Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) {
      args[_key16 - 1] = arguments[_key16];
    }

    return append.apply(void 0, [element, "C"].concat(args));
  };

  var _curveTo = function _curveTo(element) {
    for (var _len17 = arguments.length, args = new Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
      args[_key17 - 1] = arguments[_key17];
    }

    return append.apply(void 0, [element, "c"].concat(args));
  };

  var smoothCurveTo = function smoothCurveTo(element) {
    for (var _len18 = arguments.length, args = new Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
      args[_key18 - 1] = arguments[_key18];
    }

    return append.apply(void 0, [element, "S"].concat(args));
  };

  var _smoothCurveTo = function _smoothCurveTo(element) {
    for (var _len19 = arguments.length, args = new Array(_len19 > 1 ? _len19 - 1 : 0), _key19 = 1; _key19 < _len19; _key19++) {
      args[_key19 - 1] = arguments[_key19];
    }

    return append.apply(void 0, [element, "s"].concat(args));
  };

  var quadCurveTo = function quadCurveTo(element) {
    for (var _len20 = arguments.length, args = new Array(_len20 > 1 ? _len20 - 1 : 0), _key20 = 1; _key20 < _len20; _key20++) {
      args[_key20 - 1] = arguments[_key20];
    }

    return append.apply(void 0, [element, "Q"].concat(args));
  };

  var _quadCurveTo = function _quadCurveTo(element) {
    for (var _len21 = arguments.length, args = new Array(_len21 > 1 ? _len21 - 1 : 0), _key21 = 1; _key21 < _len21; _key21++) {
      args[_key21 - 1] = arguments[_key21];
    }

    return append.apply(void 0, [element, "q"].concat(args));
  };

  var smoothQuadCurveTo = function smoothQuadCurveTo(element) {
    for (var _len22 = arguments.length, args = new Array(_len22 > 1 ? _len22 - 1 : 0), _key22 = 1; _key22 < _len22; _key22++) {
      args[_key22 - 1] = arguments[_key22];
    }

    return append.apply(void 0, [element, "T"].concat(args));
  };

  var _smoothQuadCurveTo = function _smoothQuadCurveTo(element) {
    for (var _len23 = arguments.length, args = new Array(_len23 > 1 ? _len23 - 1 : 0), _key23 = 1; _key23 < _len23; _key23++) {
      args[_key23 - 1] = arguments[_key23];
    }

    return append.apply(void 0, [element, "t"].concat(args));
  };

  var close = function close(element) {
    return append(element, "Z");
  };

  var clear = function clear(element) {
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

  var attachStyleMethods = function attachStyleMethods(element) {
    element.appendTo = function (arg) {
      return appendTo(element, arg);
    };
  };

  var attachAppendableMethods = function attachAppendableMethods(element, methods) {
    Object.keys(methods).filter(function (key) {
      return element[key] === undefined;
    }).forEach(function (key) {
      element[key] = function () {
        var g = methods[key].apply(methods, arguments);
        element.appendChild(g);
        return g;
      };
    });
  };

  var attachArrowMethods = function attachArrowMethods(element) {
    element.head = function (options) {
      if (_typeof(options) === "object") {
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

    element.tail = function (options) {
      if (_typeof(options) === "object") {
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

    element.curve = function (amount) {
      element.options.curve = amount;
      setArrowPoints(element);
      return element;
    };

    element.pinch = function (amount) {
      element.options.pinch = amount;
      setArrowPoints(element);
      return element;
    };
  };

  var attachPathMethods = function attachPathMethods(element) {
    Object.keys(Path).filter(function (key) {
      return element[key] === undefined;
    }).forEach(function (key) {
      element[key] = function () {
        for (var _len24 = arguments.length, args = new Array(_len24), _key24 = 0; _key24 < _len24; _key24++) {
          args[_key24] = arguments[_key24];
        }

        return Path[key].apply(Path, [element].concat(args));
      };
    });
  };

  var attachDOMMethods = function attachDOMMethods(element) {
    Object.keys(DOM).filter(function (key) {
      return element[key] === undefined;
    }).forEach(function (key) {
      element[key] = function () {
        for (var _len25 = arguments.length, args = new Array(_len25), _key25 = 0; _key25 < _len25; _key25++) {
          args[_key25] = arguments[_key25];
        }

        return DOM[key].apply(DOM, [element].concat(args));
      };
    });
  };

  var attachTransformMethods = function attachTransformMethods(element) {
    Object.keys(Transform).filter(function (key) {
      return element[key] === undefined;
    }).forEach(function (key) {
      element[key] = function () {
        for (var _len26 = arguments.length, args = new Array(_len26), _key26 = 0; _key26 < _len26; _key26++) {
          args[_key26] = arguments[_key26];
        }

        return Transform[key].apply(Transform, [element].concat(args));
      };
    });
  };

  var attachViewBoxMethods = function attachViewBoxMethods(element) {
    Object.keys(ViewBox).filter(function (key) {
      return element[key] === undefined;
    }).forEach(function (key) {
      element[key] = function () {
        for (var _len27 = arguments.length, args = new Array(_len27), _key27 = 0; _key27 < _len27; _key27++) {
          args[_key27] = arguments[_key27];
        }

        return ViewBox[key].apply(ViewBox, [element].concat(args));
      };
    });
  };

  var toCamel = function toCamel(s) {
    return s.replace(/([-_][a-z])/ig, function ($1) {
      return $1.toUpperCase().replace("-", "").replace("_", "");
    });
  };

  var attachFunctionalStyleSetters = function attachFunctionalStyleSetters(element) {
    attributes$1.filter(function (key) {
      return element[toCamel(key)] === undefined;
    }).forEach(function (key) {
      element[toCamel(key)] = function () {
        for (var _len28 = arguments.length, args = new Array(_len28), _key28 = 0; _key28 < _len28; _key28++) {
          args[_key28] = arguments[_key28];
        }

        element.setAttribute.apply(element, [key].concat(args));
        return element;
      };
    });
  };

  var attachClipMaskMakers = function attachClipMaskMakers(element, primitives) {
    if (element.clipPath === undefined) {
      element.clipPath = function () {
        var c = primitives.clipPath.apply(primitives, arguments);
        element.appendChild(c);
        return c;
      };
    }

    if (element.mask === undefined) {
      element.mask = function () {
        var m = primitives.mask.apply(primitives, arguments);
        element.appendChild(m);
        return m;
      };
    }
  };

  var findIdURL = function findIdURL(arg) {
    if (arg == null) {
      return undefined;
    }

    if (typeof arg === "string") {
      return arg.slice(0, 3) === "url" ? arg : "url(#".concat(arg, ")");
    }

    if (arg.getAttribute != null) {
      var idString = arg.getAttribute("id");
      return "url(#".concat(idString, ")");
    }

    return "url(#)";
  };

  var attachClipMaskAttributes = function attachClipMaskAttributes(element) {
    if (element.clipPath === undefined) {
      element.clipPath = function (parent) {
        var value = findIdURL(parent);

        if (value === undefined) {
          return element;
        }

        element.setAttribute("clip-path", value);
        return element;
      };
    }

    if (element.mask === undefined) {
      element.mask = function (parent) {
        var value = findIdURL(parent);

        if (value === undefined) {
          return element;
        }

        element.setAttribute("mask", value);
        return element;
      };
    }
  };

  var preparePrimitive = function preparePrimitive(element) {
    attachFunctionalStyleSetters(element);
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachClipMaskAttributes(element);

    if (element.tagName === "path") {
      attachPathMethods(element);
    }
  };

  var prepareArrow = function prepareArrow(element) {
    attachFunctionalStyleSetters(element);
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachClipMaskAttributes(element);
    attachArrowMethods(element);
  };

  var prepareText = function prepareText(element) {
    attachFunctionalStyleSetters(element);
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachClipMaskAttributes(element);
  };

  var prepareSVG = function prepareSVG(element, primitives) {
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachViewBoxMethods(element);
    attachFunctionalStyleSetters(element);
    attachClipMaskMakers(element, primitives);
    attachAppendableMethods(element, primitives);
  };

  var prepareGroup = function prepareGroup(element, primitives) {
    attachFunctionalStyleSetters(element);
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachClipMaskAttributes(element);
    attachAppendableMethods(element, primitives);
  };

  var prepareMaskClipPath = function prepareMaskClipPath(element, primitives) {
    attachFunctionalStyleSetters(element);
    attachDOMMethods(element);
    attachTransformMethods(element);
    attachClipMaskAttributes(element);
    attachAppendableMethods(element, primitives);
  };

  var prepareStyle = function prepareStyle(element) {
    attachStyleMethods(element);
  };

  var prepare = function prepare(type, element, primitiveList) {
    switch (type) {
      case "svg":
        prepareSVG(element, primitiveList);
        break;

      case "primitive":
        preparePrimitive(element);
        break;

      case "arrow":
        prepareArrow(element);
        break;

      case "defs":
      case "group":
        prepareGroup(element, primitiveList);
        break;

      case "text":
        prepareText(element);
        break;

      case "clipPath":
      case "mask":
        prepareMaskClipPath(element, primitiveList);
        break;

      case "style":
        prepareStyle(element);
        break;

      default:
        console.warn("prepare missing valid type (svg, group..");
        break;
    }
  };

  var line$1 = function line() {
    var shape = win$4.document.createElementNS(NS, "line");

    for (var _len29 = arguments.length, endpoints = new Array(_len29), _key29 = 0; _key29 < _len29; _key29++) {
      endpoints[_key29] = arguments[_key29];
    }

    setLinePoints.apply(void 0, [shape].concat(endpoints));
    prepare("primitive", shape);

    shape.setPoints = function () {
      for (var _len30 = arguments.length, args = new Array(_len30), _key30 = 0; _key30 < _len30; _key30++) {
        args[_key30] = arguments[_key30];
      }

      return setLinePoints.apply(void 0, [shape].concat(args));
    };

    return shape;
  };

  var circle$1 = function circle(x, y, radius) {
    var shape = win$4.document.createElementNS(NS, "circle");
    setCenter(shape, x, y);

    if (radius != null) {
      shape.setAttributeNS(null, "r", radius);
    }

    prepare("primitive", shape);

    shape.setCenter = function () {
      for (var _len31 = arguments.length, args = new Array(_len31), _key31 = 0; _key31 < _len31; _key31++) {
        args[_key31] = arguments[_key31];
      }

      return setCenter.apply(void 0, [shape].concat(args));
    };

    shape.setRadius = function (r) {
      shape.setAttributeNS(null, "r", r);
      return shape;
    };

    shape.radius = function (r) {
      shape.setAttributeNS(null, "r", r);
      return shape;
    };

    return shape;
  };

  var ellipse = function ellipse(x, y, rx, ry) {
    var shape = win$4.document.createElementNS(NS, "ellipse");

    if (x != null) {
      shape.setAttributeNS(null, "cx", x);
    }

    if (y != null) {
      shape.setAttributeNS(null, "cy", y);
    }

    if (rx != null) {
      shape.setAttributeNS(null, "rx", rx);
    }

    if (ry != null) {
      shape.setAttributeNS(null, "ry", ry);
    }

    prepare("primitive", shape);
    return shape;
  };

  var rect = function rect(x, y, width, height) {
    var shape = win$4.document.createElementNS(NS, "rect");

    if (x != null) {
      shape.setAttributeNS(null, "x", x);
    }

    if (y != null) {
      shape.setAttributeNS(null, "y", y);
    }

    if (width != null) {
      shape.setAttributeNS(null, "width", width);
    }

    if (height != null) {
      shape.setAttributeNS(null, "height", height);
    }

    prepare("primitive", shape);
    return shape;
  };

  var polygon$1 = function polygon() {
    var shape = win$4.document.createElementNS(NS, "polygon");

    for (var _len32 = arguments.length, pointsArray = new Array(_len32), _key32 = 0; _key32 < _len32; _key32++) {
      pointsArray[_key32] = arguments[_key32];
    }

    setPoints.apply(void 0, [shape].concat(pointsArray));
    prepare("primitive", shape);

    shape.setPoints = function () {
      for (var _len33 = arguments.length, args = new Array(_len33), _key33 = 0; _key33 < _len33; _key33++) {
        args[_key33] = arguments[_key33];
      }

      return setPoints.apply(void 0, [shape].concat(args));
    };

    return shape;
  };

  var polyline = function polyline() {
    var shape = win$4.document.createElementNS(NS, "polyline");

    for (var _len34 = arguments.length, pointsArray = new Array(_len34), _key34 = 0; _key34 < _len34; _key34++) {
      pointsArray[_key34] = arguments[_key34];
    }

    setPoints.apply(void 0, [shape].concat(pointsArray));
    prepare("primitive", shape);

    shape.setPoints = function () {
      for (var _len35 = arguments.length, args = new Array(_len35), _key35 = 0; _key35 < _len35; _key35++) {
        args[_key35] = arguments[_key35];
      }

      return setPoints.apply(void 0, [shape].concat(args));
    };

    return shape;
  };

  var path$1 = function path(d) {
    var shape = win$4.document.createElementNS(NS, "path");

    if (d != null) {
      shape.setAttributeNS(null, "d", d);
    }

    prepare("primitive", shape);
    return shape;
  };

  var bezier = function bezier(fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
    var shape = win$4.document.createElementNS(NS, "path");
    setBezier(shape, fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY);
    prepare("primitive", shape);

    shape.setBezier = function () {
      for (var _len36 = arguments.length, args = new Array(_len36), _key36 = 0; _key36 < _len36; _key36++) {
        args[_key36] = arguments[_key36];
      }

      return setBezier.apply(void 0, [shape].concat(args));
    };

    return shape;
  };

  var text = function text(textString, x, y) {
    var shape = win$4.document.createElementNS(NS, "text");
    shape.innerHTML = textString;

    if (x) {
      shape.setAttributeNS(null, "x", x);
    }

    if (y) {
      shape.setAttributeNS(null, "y", y);
    }

    prepare("text", shape);
    return shape;
  };

  var arc = function arc(x, y, radius, angleA, angleB) {
    var shape = win$4.document.createElementNS(NS, "path");
    setArc(shape, x, y, radius, angleA, angleB, false);
    prepare("primitive", shape);

    shape.setArc = function () {
      for (var _len37 = arguments.length, args = new Array(_len37), _key37 = 0; _key37 < _len37; _key37++) {
        args[_key37] = arguments[_key37];
      }

      return setArc.apply(void 0, [shape].concat(args));
    };

    return shape;
  };

  var wedge = function wedge(x, y, radius, angleA, angleB) {
    var shape = win$4.document.createElementNS(NS, "path");
    setArc(shape, x, y, radius, angleA, angleB, true);
    prepare("primitive", shape);

    shape.setArc = function () {
      for (var _len38 = arguments.length, args = new Array(_len38), _key38 = 0; _key38 < _len38; _key38++) {
        args[_key38] = arguments[_key38];
      }

      return setArc.apply(void 0, [shape].concat(args));
    };

    return shape;
  };

  var arcEllipse = function arcEllipse(x, y, rx, ry, angleA, angleB) {
    var shape = win$4.document.createElementNS(NS, "path");
    setEllipticalArc(shape, x, y, rx, ry, angleA, angleB, false);
    prepare("primitive", shape);

    shape.setArc = function () {
      for (var _len39 = arguments.length, args = new Array(_len39), _key39 = 0; _key39 < _len39; _key39++) {
        args[_key39] = arguments[_key39];
      }

      return setEllipticalArc.apply(void 0, [shape].concat(args));
    };

    return shape;
  };

  var wedgeEllipse = function wedgeEllipse(x, y, rx, ry, angleA, angleB) {
    var shape = win$4.document.createElementNS(NS, "path");
    setEllipticalArc(shape, x, y, rx, ry, angleA, angleB, true);
    prepare("primitive", shape);

    shape.setArc = function () {
      for (var _len40 = arguments.length, args = new Array(_len40), _key40 = 0; _key40 < _len40; _key40++) {
        args[_key40] = arguments[_key40];
      }

      return setEllipticalArc.apply(void 0, [shape].concat(args));
    };

    return shape;
  };

  var parabola = function parabola(x, y, width, height) {
    var COUNT = 128;
    var iter = Array.from(Array(COUNT + 1)).map(function (_, i) {
      return (i - COUNT) / COUNT * 2 + 1;
    });
    var ptsX = iter.map(function (i) {
      return x + (i + 1) * width * 0.5;
    });
    var ptsY = iter.map(function (i) {
      return y + Math.pow(i, 2) * height;
    });
    var points = iter.map(function (_, i) {
      return [ptsX[i], ptsY[i]];
    });
    return polyline(points);
  };

  var regularPolygon = function regularPolygon(cX, cY, radius, sides) {
    var halfwedge = 2 * Math.PI / sides * 0.5;
    var r = Math.cos(halfwedge) * radius;
    var points = Array.from(Array(sides)).map(function (el, i) {
      var a = -2 * Math.PI * i / sides + halfwedge;
      var x = cX + r * Math.sin(a);
      var y = cY + r * Math.cos(a);
      return [x, y];
    });
    return polygon$1(points);
  };

  var roundRect = function roundRect(x, y, width, height) {
    var cornerRadius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    if (cornerRadius > width / 2) {
      cornerRadius = width / 2;
    }

    if (cornerRadius > height / 2) {
      cornerRadius = height / 2;
    }

    var w = width - cornerRadius * 2;
    var h = height - cornerRadius * 2;
    var pathString = "M".concat(x + (width - w) / 2, " ").concat(y, " h").concat(w, " A").concat(cornerRadius, " ").concat(cornerRadius, " 0 0 1 ").concat(x + width, " ").concat(y + (height - h) / 2, " v").concat(h, " A").concat(cornerRadius, " ").concat(cornerRadius, " 0 0 1 ").concat(x + width - cornerRadius, " ").concat(y + height, " h").concat(-w, " A").concat(cornerRadius, " ").concat(cornerRadius, " 0 0 1 ").concat(x, " ").concat(y + height - cornerRadius, " v").concat(-h, " A").concat(cornerRadius, " ").concat(cornerRadius, " 0 0 1 ").concat(x + cornerRadius, " ").concat(y, " ");
    return path$1(pathString);
  };

  var arrow = function arrow() {
    var shape = win$4.document.createElementNS(NS, "g");
    var tailPoly = win$4.document.createElementNS(NS, "polygon");
    var headPoly = win$4.document.createElementNS(NS, "polygon");
    var arrowPath = win$4.document.createElementNS(NS, "path");
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
      head: {
        width: 0.5,
        height: 2,
        visible: false,
        padding: 0.0
      },
      tail: {
        width: 0.5,
        height: 2,
        visible: false,
        padding: 0.0
      },
      curve: 0.0,
      pinch: 0.618,
      endpoints: []
    };

    for (var _len41 = arguments.length, args = new Array(_len41), _key41 = 0; _key41 < _len41; _key41++) {
      args[_key41] = arguments[_key41];
    }

    setArrowPoints.apply(void 0, [shape].concat(args));
    prepare("arrow", shape);

    shape.setPoints = function () {
      for (var _len42 = arguments.length, a = new Array(_len42), _key42 = 0; _key42 < _len42; _key42++) {
        a[_key42] = arguments[_key42];
      }

      return setArrowPoints.apply(void 0, [shape].concat(a));
    };

    return shape;
  };

  var primitives = Object.freeze({
    __proto__: null,
    line: line$1,
    circle: circle$1,
    ellipse: ellipse,
    rect: rect,
    polygon: polygon$1,
    polyline: polyline,
    path: path$1,
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
  var constructorsSVG = {};
  var constructorsGroup = {};
  var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  var randomString = function randomString() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    return Array.from(Array(count)).map(function () {
      return Math.floor(Math.random() * abc.length);
    }).map(function (i) {
      return abc[i];
    }).reduce(function (a, b) {
      return "".concat(a).concat(b);
    }, "");
  };

  var generateUUID = function generateUUID() {
    var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    return prefix + randomString(count);
  };

  var svg$1 = function svg() {
    var svgImage = win$4.document.createElementNS(NS, "svg");
    svgImage.setAttribute("version", "1.1");
    svgImage.setAttribute("xmlns", NS);
    prepare("svg", svgImage, constructorsSVG);
    return svgImage;
  };

  var group$1 = function group() {
    var g = win$4.document.createElementNS(NS, "g");
    prepare("group", g, constructorsGroup);
    return g;
  };

  var defs$1 = function defs() {
    var d = win$4.document.createElementNS(NS, "defs");
    prepare("defs", d, constructorsGroup);
    return d;
  };

  var cdata = function cdata(textContent) {
    var c = new win$4.DOMParser().parseFromString("<root></root>", "text/xml").createCDATASection("".concat(textContent));
    return c;
  };

  var style$1 = function style(textContent) {
    var s = win$4.document.createElementNS(NS, "style");
    s.setAttribute("type", "text/css");
    prepare("style", s);

    s.setTextContent = function (newText) {
      s.textContent = "";
      s.appendChild(cdata(newText));
    };

    s.appendChild(cdata(textContent));
    return s;
  };

  var clipPath = function clipPath() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : generateUUID(8, "clip-");
    var clip = win$4.document.createElementNS(NS, "clipPath");
    clip.setAttribute("id", id);
    prepare("clipPath", clip, constructorsGroup);
    return clip;
  };

  var mask = function mask() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : generateUUID(8, "mask-");
    var msk = win$4.document.createElementNS(NS, "mask");
    msk.setAttribute("id", id);
    prepare("mask", msk, constructorsGroup);
    return msk;
  };

  var createElement = function createElement(tagName) {
    return win$4.document.createElementNS(NS, tagName);
  };

  var setConstructors = function setConstructors(elements) {
    Object.keys(elements).filter(function (key) {
      return key !== "svg";
    }).forEach(function (key) {
      constructorsSVG[key] = elements[key];
    });
    Object.keys(elements).filter(function (key) {
      return key !== "svg";
    }).filter(function (key) {
      return key !== "defs";
    }).filter(function (key) {
      return key !== "style";
    }).filter(function (key) {
      return key !== "clipPath";
    }).filter(function (key) {
      return key !== "mask";
    }).forEach(function (key) {
      constructorsGroup[key] = elements[key];
    });
  };

  var root = Object.freeze({
    __proto__: null,
    setConstructors: setConstructors,
    svg: svg$1,
    group: group$1,
    defs: defs$1,
    clipPath: clipPath,
    mask: mask,
    style: style$1,
    createElement: createElement
  });
  var ElementConstructor = new win$4.DOMParser().parseFromString("<div />", "text/xml").documentElement.constructor;

  var findWindowBooleanParam = function findWindowBooleanParam() {
    for (var _len43 = arguments.length, params = new Array(_len43), _key43 = 0; _key43 < _len43; _key43++) {
      params[_key43] = arguments[_key43];
    }

    var objects = params.filter(function (arg) {
      return _typeof(arg) === "object";
    }).filter(function (o) {
      return typeof o.window === "boolean";
    });
    return objects.reduce(function (a, b) {
      return a.window || b.window;
    }, false);
  };

  var findElementInParams = function findElementInParams() {
    for (var _len44 = arguments.length, params = new Array(_len44), _key44 = 0; _key44 < _len44; _key44++) {
      params[_key44] = arguments[_key44];
    }

    var element = params.filter(function (arg) {
      return arg instanceof ElementConstructor;
    }).shift();
    var idElement = params.filter(function (a) {
      return typeof a === "string" || a instanceof String;
    }).map(function (str) {
      return win$4.document.getElementById(str);
    }).shift();

    if (element != null) {
      return element;
    }

    return idElement != null ? idElement : win$4.document.body;
  };

  var initSize = function initSize(svgElement, params) {
    var numbers = params.filter(function (arg) {
      return !isNaN(arg);
    });
    var viewBox = svgElement.getAttribute("viewBox");

    if (numbers.length >= 4) {
      svgElement.setAttributeNS(null, "width", numbers[2]);
      svgElement.setAttributeNS(null, "height", numbers[3]);
      setViewBox$1(svgElement, numbers[0], numbers[1], numbers[2], numbers[3]);
    } else if (numbers.length >= 2) {
      svgElement.setAttributeNS(null, "width", numbers[0]);
      svgElement.setAttributeNS(null, "height", numbers[1]);
      setViewBox$1(svgElement, 0, 0, numbers[0], numbers[1]);
    } else if (viewBox == null) {
      var frame = svgElement.getBoundingClientRect();
      setViewBox$1(svgElement, 0, 0, frame.width, frame.height);
    } else if (viewBox.split(" ").filter(function (n) {
      return n === "0" || n === 0;
    }).length === 4) {
      var _frame = svgElement.getBoundingClientRect();

      setViewBox$1(svgElement, 0, 0, _frame.width, _frame.height);
    }
  };

  var getWidth = function getWidth(element) {
    var viewBox = getViewBox(element);

    if (viewBox == null) {
      return undefined;
    }

    return viewBox[2];
  };

  var getHeight = function getHeight(element) {
    var viewBox = getViewBox(element);

    if (viewBox == null) {
      return undefined;
    }

    return viewBox[3];
  };

  var setWidth = function setWidth(element, w) {
    var viewBox = getViewBox(element);
    viewBox[2] = w;
    return setViewBox$1.apply(void 0, [element].concat(_toConsumableArray(viewBox)));
  };

  var setHeight = function setHeight(element, h) {
    var viewBox = getViewBox(element);
    viewBox[3] = h;
    return setViewBox$1.apply(void 0, [element].concat(_toConsumableArray(viewBox)));
  };

  var size = function size(element) {
    for (var _len45 = arguments.length, args = new Array(_len45 > 1 ? _len45 - 1 : 0), _key45 = 1; _key45 < _len45; _key45++) {
      args[_key45 - 1] = arguments[_key45];
    }

    if (args.length === 2 && typeof args[0] === "number" && typeof args[1] === "number") {
      setViewBox$1.apply(void 0, [element, 0, 0].concat(args));
    } else if (args.length === 4 && _typeof(args.map(function (a) {
      return typeof a === "number";
    }).reduce(function (a, b) {
      return a && b;
    }, true))) {
      setViewBox$1.apply(void 0, [element].concat(args));
    }
  };

  var getFrame = function getFrame(element) {
    var viewBox = getViewBox(element);

    if (viewBox !== undefined) {
      return viewBox;
    }

    if (typeof element.getBoundingClientRect === "function") {
      var rr = element.getBoundingClientRect();
      return [rr.x, rr.y, rr.width, rr.height];
    }

    return [0, 0, 0, 0];
  };

  var background = function background(element, color) {
    var setParent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (setParent === true) {
      var parent = element.parentElement;

      if (parent != null) {
        parent.setAttribute("style", "background-color: ".concat(color));
      }
    }

    var backRect = Array.from(element.childNodes).filter(function (child) {
      return child.getAttribute("class") === "svg-background-rectangle";
    }).shift();

    if (backRect != null) {
      backRect.setAttribute("fill", color);
    } else {
      backRect = rect.apply(void 0, _toConsumableArray(getFrame(element))).fill(color).setClass("svg-background-rectangle");
      element.insertBefore(backRect, element.firstChild);
    }
  };

  var findStyleSheet = function findStyleSheet(element) {
    var children = Array.from(element.childNodes);
    var topLevel = children.filter(function (child) {
      return child.getAttribute("tagName") === "style";
    }).shift();

    if (topLevel) {
      return topLevel;
    }

    var defs = children.filter(function (child) {
      return child.getAttribute("tagName") === "defs";
    }).shift();

    if (defs == null) {
      return defs;
    }

    var insideDefs = Array.from(defs.childNodes).filter(function (child) {
      return child.getAttribute("tagName") === "style";
    }).shift();

    if (insideDefs != null) {
      return insideDefs;
    }

    return undefined;
  };

  var stylesheet = function stylesheet(element, textContent) {
    var styleSection = findStyleSheet(element);

    if (styleSection == null) {
      styleSection = style$1(textContent);
      element.insertBefore(styleSection, element.firstChild);
    } else {
      styleSection.setTextContent(textContent);
    }

    return styleSection;
  };

  var replaceWithSVG = function replaceWithSVG(oldSVG, newSVG) {
    Array.from(oldSVG.attributes).forEach(function (attr) {
      return oldSVG.removeAttribute(attr.name);
    });
    removeChildren(oldSVG);
    Array.from(newSVG.childNodes).forEach(function (node) {
      newSVG.removeChild(node);
      oldSVG.appendChild(node);
    });
    Array.from(newSVG.attributes).forEach(function (attr) {
      return oldSVG.setAttribute(attr.name, attr.value);
    });
  };

  var SVG = function SVG() {
    for (var _len46 = arguments.length, params = new Array(_len46), _key46 = 0; _key46 < _len46; _key46++) {
      params[_key46] = arguments[_key46];
    }

    var element = svg$1();
    Events(element);

    element.controls = function () {
      for (var _len47 = arguments.length, args = new Array(_len47), _key47 = 0; _key47 < _len47; _key47++) {
        args[_key47] = arguments[_key47];
      }

      return controls.apply(void 0, [element].concat(args));
    };

    element.getWidth = function () {
      return getWidth(element);
    };

    element.getHeight = function () {
      return getHeight(element);
    };

    element.setWidth = function () {
      for (var _len48 = arguments.length, args = new Array(_len48), _key48 = 0; _key48 < _len48; _key48++) {
        args[_key48] = arguments[_key48];
      }

      return setWidth.apply(void 0, [element].concat(args));
    };

    element.setHeight = function () {
      for (var _len49 = arguments.length, args = new Array(_len49), _key49 = 0; _key49 < _len49; _key49++) {
        args[_key49] = arguments[_key49];
      }

      return setHeight.apply(void 0, [element].concat(args));
    };

    element.background = function () {
      for (var _len50 = arguments.length, args = new Array(_len50), _key50 = 0; _key50 < _len50; _key50++) {
        args[_key50] = arguments[_key50];
      }

      return background.apply(void 0, [element].concat(args));
    };

    element.size = function () {
      for (var _len51 = arguments.length, args = new Array(_len51), _key51 = 0; _key51 < _len51; _key51++) {
        args[_key51] = arguments[_key51];
      }

      return size.apply(void 0, [element].concat(args));
    };

    element.save = function (options) {
      return save(element, options);
    };

    element.load = function (data, callback) {
      load$1(data, function (newSVG, error) {
        if (newSVG != null) {
          replaceWithSVG(element, newSVG);
        }

        if (callback != null) {
          callback(element, error);
        }
      });
    };

    element.stylesheet = function (textContent) {
      return stylesheet(element, textContent);
    };

    var initialize = function initialize() {
      var parent = findElementInParams.apply(void 0, params);

      if (parent != null) {
        parent.appendChild(element);
      }

      initSize(element, params);

      if (findWindowBooleanParam.apply(void 0, params)) {
        globalize(element);
      }

      params.filter(function (arg) {
        return typeof arg === "function";
      }).forEach(function (func) {
        return func.call(element, element);
      });
    };

    if (win$4.document.readyState === "loading") {
      win$4.document.addEventListener("DOMContentLoaded", initialize);
    } else {
      initialize();
    }

    return element;
  };

  var constructors = {};
  Object.assign(constructors, root, primitives);
  delete constructors.setConstructors;
  setConstructors(constructors);
  var elements = {};
  Object.keys(primitives).forEach(function (key) {
    elements[key] = primitives[key];
  });
  Object.keys(root).filter(function (key) {
    return key !== "setConstructors";
  }).forEach(function (key) {
    elements[key] = root[key];
  });
  delete elements.svg;
  Object.keys(elements).forEach(function (key) {
    SVG[key] = elements[key];
  });
  Object.keys(geometryMods).forEach(function (key) {
    SVG[key] = geometryMods[key];
  });
  Object.keys(ViewBox).forEach(function (key) {
    SVG[key] = ViewBox[key];
  });
  Object.keys(File).forEach(function (key) {
    SVG[key] = File[key];
  });
  SVG.NS = NS;

  var test_axiom1_2 = function test_axiom1_2(axiom_frame, poly) {
    var points = axiom_frame.parameters.points;
    axiom_frame.valid = math.core.point_in_convex_poly(points[0], poly) && math.core.point_in_convex_poly(points[1], poly);
    axiom_frame.valid_solutions = [axiom_frame.valid];
  };

  var test_axiom3 = function test_axiom3(axiom_frame, poly) {
    var Xing = math.core.intersection;
    var lines = axiom_frame.parameters.lines;
    var a = Xing.convex_poly_line(poly, lines[0][0], lines[0][1]);
    var b = Xing.convex_poly_line(poly, lines[1][0], lines[1][1]);
    axiom_frame.valid = a !== undefined && b !== undefined;
    axiom_frame.valid_solutions = axiom_frame.solutions.map(function (s) {
      return s === undefined ? false : Xing.convex_poly_line(poly, s[0], s[1]) !== undefined;
    });
  };

  var test_axiom4 = function test_axiom4(axiom_frame, poly) {
    var params = axiom_frame.parameters;
    var overlap = math.core.intersection.line_line(params.lines[0][0], params.lines[0][1], params.points[0], [params.lines[0][1][1], -params.lines[0][1][0]]);

    if (overlap === undefined) {
      axiom_frame.valid = false;
      axiom_frame.valid_solutions = [false];
    }

    axiom_frame.valid = math.core.point_in_convex_poly(overlap, poly) && math.core.point_in_convex_poly(params.points[0], poly);
    axiom_frame.valid_solutions = [axiom_frame.valid];
  };

  var test_axiom5 = function test_axiom5(axiom_frame, poly) {
    if (axiom_frame.solutions.length === 0) {
      axiom_frame.valid = false;
      axiom_frame.valid_solutions = [false, false];
      return;
    }

    var params = axiom_frame.parameters;
    axiom_frame.test = {};
    axiom_frame.test.points_reflected = axiom_frame.solutions.map(function (s) {
      return math.core.make_matrix2_reflection(s[1], s[0]);
    }).map(function (m) {
      return math.core.multiply_matrix2_vector2(m, params.points[1]);
    });
    axiom_frame.valid = math.core.point_in_convex_poly(params.points[0], poly) && math.core.point_in_convex_poly(params.points[1], poly);
    axiom_frame.valid_solutions = axiom_frame.test.points_reflected.map(function (p) {
      return math.core.point_in_convex_poly(p, poly);
    });
  };

  var test_axiom6 = function test_axiom6(axiom_frame, poly) {
    var Xing = math.core.intersection;
    var solutions_inside = axiom_frame.solutions.map(function (s) {
      return Xing.convex_poly_line(poly, s[0], s[1]);
    }).filter(function (a) {
      return a !== undefined;
    });

    if (solutions_inside.length === 0) {
      axiom_frame.valid = false;
      axiom_frame.valid_solutions = [false, false, false];
      return;
    }

    var lines = axiom_frame.parameters.lines;
    var a = Xing.convex_poly_line(poly, lines[0][0], lines[0][1]);
    var b = Xing.convex_poly_line(poly, lines[1][0], lines[1][1]);
    var params = axiom_frame.parameters;
    axiom_frame.test = {};
    axiom_frame.test.points_reflected = axiom_frame.solutions.map(function (s) {
      return math.core.make_matrix2_reflection(s[1], s[0]);
    }).map(function (m) {
      return params.points.map(function (p) {
        return math.core.multiply_matrix2_vector2(m, p);
      });
    }).reduce(function (prev, curr) {
      return prev.concat(curr);
    }, []);
    axiom_frame.valid = a !== undefined && b !== undefined && math.core.point_in_convex_poly(params.points[0], poly) && math.core.point_in_convex_poly(params.points[1], poly);
    axiom_frame.valid_solutions = axiom_frame.solutions.map(function (solution, i) {
      return [axiom_frame.test.points_reflected[i * 2], axiom_frame.test.points_reflected[i * 2 + 1]];
    }).map(function (p) {
      return math.core.point_in_convex_poly(p[0], poly) && math.core.point_in_convex_poly(p[1], poly);
    });

    while (axiom_frame.valid_solutions.length < 3) {
      axiom_frame.valid_solutions.push(false);
    }
  };

  var test_axiom7 = function test_axiom7(axiom_frame, poly) {
    if (axiom_frame.solutions.length === 0) {
      axiom_frame.valid = false;
      axiom_frame.valid_solutions = [false];
    }

    var solution = axiom_frame.solutions[0];
    var params = axiom_frame.parameters;
    var m = math.core.make_matrix2_reflection(solution[1], solution[0]);
    var reflected = math.core.multiply_matrix2_vector2(m, params.points[0]);
    var intersect = math.core.intersection.line_line(params.lines[1][0], params.lines[1][1], solution[0], solution[1]);
    axiom_frame.test = {
      points_reflected: [reflected]
    };
    axiom_frame.valid = math.core.point_in_convex_poly(params.points[0], poly) && math.core.point_in_convex_poly(reflected, poly) && math.core.point_in_convex_poly(intersect, poly);
    axiom_frame.valid_solutions = [axiom_frame.valid];
  };

  var test = [null, test_axiom1_2, test_axiom1_2, test_axiom3, test_axiom4, test_axiom5, test_axiom6, test_axiom7];

  var apply_axiom_in_polygon = function apply_axiom_in_polygon(axiom_frame, poly) {
    test[axiom_frame.axiom].call(null, axiom_frame, poly);
    return axiom_frame;
  };

  var make_axiom_frame = function make_axiom_frame(axiom, solutions, parameters) {
    var solution = {
      axiom: axiom,
      parameters: parameters,
      solutions: solutions
    };
    Object.defineProperty(solution, "apply", {
      value: function value() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return apply_axiom_in_polygon.apply(void 0, [solution].concat(args));
      }
    });
    return solution;
  };

  var Params = function Params(number) {
    var _math$core;

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var params = (_math$core = math.core).semi_flatten_input.apply(_math$core, args);

    switch (number) {
      case 1:
      case 2:
        {
          if (params.length === 1 && _typeof(params[0]) === "object" && params[0] !== null) {
            if (params[0].points == null) {
              throw new Error("axiom .points property needed");
            }

            return params[0].points.map(function (p) {
              return math.core.get_vector(p);
            });
          }

          if (params.length === 2) {
            return params.map(function (p) {
              return math.core.get_vector(p);
            });
          }

          if (params.length === 4 && typeof params[0] === "number") {
            return [[params[0], params[1]], [params[2], params[3]]];
          }
        }
        break;

      case 3:
        {
          if (params.length === 1 && _typeof(params[0]) === "object" && params[0] !== null) {
            if (params[0].lines != null && params[0].lines.length > 0) {
              var lines = params[0].lines.map(function (l) {
                return math.core.get_line(l);
              });
              return [lines[0].origin, lines[0].vector, lines[1].origin, lines[1].vector];
            }

            if (params[0].points != null && params[0].vectors != null) {
              var points = params[0].points.map(function (p) {
                return math.core.get_vector(p);
              });
              var vectors = params[0].vectors.map(function (p) {
                return math.core.get_vector(p);
              });
              return [points[0], vectors[0], points[1], vectors[1]];
            }
          }
        }
        break;

      case 4:
        {
          if (params.length === 1 && _typeof(params[0]) === "object" && params[0] !== null) {
            if (params[0].lines != null && params[0].lines.length > 0 && params[0].points != null && params[0].points.length > 0) {
              var _lines = params[0].lines.map(function (l) {
                return math.core.get_line(l);
              });

              var _points = params[0].points.map(function (p) {
                return math.core.get_vector(p);
              });

              return [_lines[0].origin, _lines[0].vector, _points[0]];
            }
          }
        }
        break;

      case 5:
        {
          if (params.length === 1 && _typeof(params[0]) === "object" && params[0] !== null) {
            if (params[0].lines != null && params[0].lines.length > 0 && params[0].points != null && params[0].points.length > 0) {
              var _lines2 = params[0].lines.map(function (l) {
                return math.core.get_line(l);
              });

              var _points2 = params[0].points.map(function (p) {
                return math.core.get_vector(p);
              });

              return [_lines2[0].origin, _lines2[0].vector, _points2[0], _points2[1]];
            }
          }
        }
        break;

      case 6:
        {
          if (params.length === 1 && _typeof(params[0]) === "object" && params[0] !== null) {
            if (params[0].lines != null && params[0].lines.length > 0 && params[0].points != null && params[0].points.length > 0) {
              var _lines3 = params[0].lines.map(function (l) {
                return math.core.get_line(l);
              });

              var _points3 = params[0].points.map(function (p) {
                return math.core.get_vector(p);
              });

              return [_lines3[0].origin, _lines3[0].vector, _lines3[1].origin, _lines3[1].vector, _points3[0], _points3[1]];
            }
          }
        }
        break;

      case 7:
        {
          if (params.length === 1 && _typeof(params[0]) === "object" && params[0] !== null) {
            if (params[0].lines != null && params[0].lines.length > 0 && params[0].points != null && params[0].points.length > 0) {
              var _lines4 = params[0].lines.map(function (l) {
                return math.core.get_line(l);
              });

              var _points4 = params[0].points.map(function (p) {
                return math.core.get_vector(p);
              });

              return [_lines4[0].origin, _lines4[0].vector, _lines4[1].origin, _lines4[1].vector, _points4[0]];
            }
          }
        }
        break;
    }

    return args;
  };

  var axiom1 = function axiom1(pointA, pointB) {
    var dimensions = Math.min(pointA.length, pointB.length);
    var vector = Array.from(Array(dimensions)).map(function (_, i) {
      return pointB[i] - pointA[i];
    });
    var normalized = math.core.normalize(vector);
    var solution = math.line(pointA, normalized);
    var parameters = {
      points: [math.vector(pointA), math.vector(pointB)]
    };
    return make_axiom_frame(1, [solution], parameters);
  };
  var axiom2 = function axiom2(pointA, pointB) {
    var mid = [(pointA[0] + pointB[0]) / 2, (pointA[1] + pointB[1]) / 2];
    var vector = Array.from(Array(2)).map(function (_, i) {
      return pointB[i] - pointA[i];
    });
    var normalized = math.core.normalize(vector);
    var solution = math.line(mid, [normalized[1], -normalized[0]]);
    var parameters = {
      points: [math.vector(pointA), math.vector(pointB)]
    };
    return make_axiom_frame(2, [solution], parameters);
  };
  var axiom3 = function axiom3(pointA, vectorA, pointB, vectorB) {
    var parameters = {
      lines: [math.line(pointA, vectorA), math.line(pointB, vectorB)]
    };
    var solutions = math.core.bisect_lines2(pointA, vectorA, pointB, vectorB).map(function (l) {
      return math.line(l[0], l[1]);
    });
    return make_axiom_frame(3, solutions, parameters);
  };
  var axiom4 = function axiom4(pointA, vectorA, pointB) {
    var norm = math.core.normalize(vectorA);
    var solution = math.line(_toConsumableArray(pointB), [norm[1], -norm[0]]);
    var parameters = {
      points: [math.vector(pointB)],
      lines: [math.line(pointA, vectorA)]
    };
    return make_axiom_frame(4, [solution], parameters);
  };
  var axiom5 = function axiom5(pointA, vectorA, pointB, pointC) {
    var radius = Math.sqrt(Math.pow(pointB[0] - pointC[0], 2) + Math.pow(pointB[1] - pointC[1], 2));
    var pointA2 = [pointA[0] + vectorA[0], pointA[1] + vectorA[1]];
    var sect = math.core.intersection.circle_line(pointB, radius, pointA, pointA2) || [];
    var solutions = sect.map(function (s) {
      var mid = math.core.midpoint2(pointC, s);
      var vec = math.core.normalize(s.map(function (_, i) {
        return s[i] - pointC[i];
      }));
      return math.line(mid, [-vec[1], vec[0]]);
    });
    var parameters = {
      points: [math.vector(pointB), math.vector(pointC)],
      lines: [math.line(pointA, vectorA)]
    };
    return make_axiom_frame(5, solutions, parameters);
  };
  var axiom7 = function axiom7(pointA, vectorA, pointB, vectorB, pointC) {
    var parameters = {
      points: [math.vector(pointC)],
      lines: [math.line(pointA, vectorA), math.line(pointB, vectorB)]
    };
    var sect = math.core.intersection.line_line(pointB, vectorB, pointC, vectorA);

    if (sect === undefined) {
      return make_axiom_frame(7, parameters, []);
    }

    var mid = math.core.midpoint2(pointC, sect);
    var vec = math.core.normalize(pointC.map(function (_, i) {
      return sect[i] - pointC[i];
    }));
    var solution = math.line(mid, [-vec[1], vec[0]]);
    return make_axiom_frame(7, [solution], parameters);
  };

  var cuberoot = function cuberoot(x) {
    var y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };

  var solveCubic = function solveCubic(a, b, c, d) {
    if (Math.abs(a) < 1e-8) {
      a = b;
      b = c;
      c = d;

      if (Math.abs(a) < 1e-8) {
        a = b;
        b = c;

        if (Math.abs(a) < 1e-8) {
          return [];
        }

        return [-b / a];
      }

      var D = b * b - 4 * a * c;

      if (Math.abs(D) < 1e-8) {
        return [-b / (2 * a)];
      }

      if (D > 0) {
        return [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)];
      }

      return [];
    }

    var p = (3 * a * c - b * b) / (3 * a * a);
    var q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    var roots;

    if (Math.abs(p) < 1e-8) {
      roots = [cuberoot(-q)];
    } else if (Math.abs(q) < 1e-8) {
      roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
    } else {
      var _D = q * q / 4 + p * p * p / 27;

      if (Math.abs(_D) < 1e-8) {
        roots = [-1.5 * q / p, 3 * q / p];
      } else if (_D > 0) {
        var u = cuberoot(-q / 2 - Math.sqrt(_D));
        roots = [u - p / (3 * u)];
      } else {
        var _u = 2 * Math.sqrt(-p / 3);

        var t = Math.acos(3 * q / p / _u) / 3;
        var k = 2 * Math.PI / 3;
        roots = [_u * Math.cos(t), _u * Math.cos(t - k), _u * Math.cos(t - 2 * k)];
      }
    }

    for (var i = 0; i < roots.length; i += 1) {
      roots[i] -= b / (3 * a);
    }

    return roots;
  };

  var axiom6 = function axiom6(pointA, vecA, pointB, vecB, pointC, pointD) {
    var p1 = pointC[0];
    var q1 = pointC[1];

    if (Math.abs(vecA[0]) > math.core.EPSILON) {
      var m1 = vecA[1] / vecA[0];
      var h1 = pointA[1] - m1 * pointA[0];
    } else {
      var k1 = pointA[0];
    }

    var p2 = pointD[0];
    var q2 = pointD[1];

    if (Math.abs(vecB[0]) > math.core.EPSILON) {
      var m2 = vecB[1] / vecB[0];
      var h2 = pointB[1] - m2 * pointB[0];
    } else {
      var k2 = pointB[0];
    }

    if (m1 !== undefined && m2 !== undefined) {
      var a1 = m1 * m1 + 1;
      var b1 = 2 * m1 * h1;
      var c1 = h1 * h1 - p1 * p1 - q1 * q1;
      var a2 = m2 * m2 + 1;
      var b2 = 2 * m2 * h2;
      var c2 = h2 * h2 - p2 * p2 - q2 * q2;
      var a0 = m2 * p1 + (h1 - q1);
      var b0 = p1 * (h2 - q2) - p2 * (h1 - q1);
      var c0 = m2 - m1;
      var d0 = m1 * p2 + (h2 - q2);
      var z = m1 * p1 + (h1 - q1);
    } else if (m1 === undefined && m2 === undefined) {
      a1 = 1;
      b1 = 0;
      c1 = k1 * k1 - p1 * p1 - q1 * q1;
      a2 = 1;
      b2 = 0;
      c2 = k2 * k2 - p2 * p2 - q2 * q2;
      a0 = k1 - p1;
      b0 = q1 * (k2 - p2) - q2 * (k1 - p1);
      c0 = 0;
      d0 = k2 - p2;
      z = a0;
    } else {
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

      a1 = m1 * m1 + 1;
      b1 = 2 * m1 * h1;
      c1 = h1 * h1 - p1 * p1 - q1 * q1;
      a2 = 1;
      b2 = 0;
      c2 = k2 * k2 - p2 * p2 - q2 * q2;
      a0 = p1;
      b0 = (h1 - q1) * (k2 - p2) - p1 * q2;
      c0 = 1;
      d0 = -m1 * (k2 - p2) - q2;
      z = m1 * p1 + (h1 - q1);
    }

    var a3 = a1 * a0 * a0 + b1 * a0 * c0 + c1 * c0 * c0;
    var b3 = 2 * a1 * a0 * b0 + b1 * (a0 * d0 + b0 * c0) + 2 * c1 * c0 * d0;
    var c3 = a1 * b0 * b0 + b1 * b0 * d0 + c1 * d0 * d0;
    var a4 = a2 * c0 * z;
    var b4 = (a2 * d0 + b2 * c0) * z - a3;
    var c4 = (b2 * d0 + c2 * c0) * z - b3;
    var d4 = c2 * d0 * z - c3;
    var roots = solveCubic(a4, b4, c4, d4);
    var solutions = [];

    if (roots != undefined && roots.length > 0) {
      for (var i = 0; i < roots.length; ++i) {
        if (m1 !== undefined && m2 !== undefined) {
          var u2 = roots[i];
          var v2 = m2 * u2 + h2;
        } else if (m1 === undefined && m2 === undefined) {
          v2 = roots[i];
          u2 = k2;
        } else {
          v2 = roots[i];
          u2 = k2;
        }

        if (v2 != q2) {
          var mF = -1 * (u2 - p2) / (v2 - q2);
          var hF = (v2 * v2 - q2 * q2 + u2 * u2 - p2 * p2) / (2 * (v2 - q2));
          solutions.push(math.line([0, hF], [1, mF]));
        } else {
          var kG = (u2 + p2) / 2;
          solutions.push(math.line([kG, 0], [0, 1]));
        }
      }
    }

    var parameters = {
      points: [math.vector(pointC), math.vector(pointD)],
      lines: [math.line(pointA, vecA), math.line(pointB, vecB)]
    };
    return make_axiom_frame(6, solutions, parameters);
  };
  var order, irootMax, q1, q2, S, Sr, Si, U;

  var CubeRoot = function CubeRoot(x) {
    return x >= 0 ? Math.pow(x, 1 / 3) : -Math.pow(-x, 1 / 3);
  };

  var axiom6RefFinder = function axiom6RefFinder(pointA, vecA, pointB, vecB, pointC, pointD) {
    order = 0;
    irootMax = 0;
    q1 = 0;
    q2 = 0;
    S = 0;
    Sr = 0;
    Si = 0;
    U = 0;
    var results = [axiom6RefFinderFunc(pointA, vecA, pointB, vecB, pointC, pointD, 0), axiom6RefFinderFunc(pointA, vecA, pointB, vecB, pointC, pointD, 1), axiom6RefFinderFunc(pointA, vecA, pointB, vecB, pointC, pointD, 2)];
    return results.filter(function (c) {
      return c != null;
    });
  };
  var axiom6RefFinderFunc = function axiom6RefFinderFunc(pointA, vecA, pointB, vecB, pointC, pointD, iroot) {
    var pA = math.core.get_vector(pointA);
    var pB = math.core.get_vector(pointB);
    var pC = math.core.get_vector(pointC);
    var pD = math.core.get_vector(pointD);
    var vA = math.core.get_vector(vecA);
    var vB = math.core.get_vector(vecB);
    var p1 = pC;
    var l1 = math.line(pA, vA);
    var u1 = [-vA[1], vA[0]];
    var d1 = l1.nearestPoint(0, 0).magnitude;
    var p2 = pD;
    var l2 = math.line(pB, vB);
    var u2 = [-vB[1], vB[0]];
    var d2 = l2.nearestPoint(0, 0).magnitude;

    if (math.core.dot(u1, l1.nearestPoint(0, 0)) < 0) {
      u1 = [vA[1], -vA[0]];
    }

    if (math.core.dot(u2, l2.nearestPoint(0, 0)) < 0) {
      u2 = [vB[1], -vB[0]];
    }

    var u1p = [u1[1], -u1[0]];

    if (Math.abs(p1[0] - p2[0]) < math.core.EPSILON && Math.abs(p1[1] - p2[1]) < math.core.EPSILON) {
      return;
    }

    var rc = 0;

    switch (iroot) {
      case 0:
        var v1 = [p1[0] + d1 * u1[0] - 2 * p2[0], p1[1] + d1 * u1[1] - 2 * p2[1]];
        var v2 = [d1 * u1[0] - p1[0], d1 * u1[1] - p1[1]];
        var c1 = math.core.dot(p2, u2) - d2;
        var c2 = math.core.dot(v2, u1p) * 2;
        var c3 = math.core.dot(v2, v2);
        var c4 = math.core.dot(v1.map(function (_, i) {
          return v1[i] + v2[i];
        }), u1p);
        var c5 = math.core.dot(v1, v2);
        var c6 = math.core.dot(u1p, u2);
        var c7 = math.core.dot(v2, u2);
        var a = c6;
        var b = c1 + c4 * c6 + c7;
        var c = c1 * c2 + c5 * c6 + c4 * c7;
        var d = c1 * c3 + c5 * c7;

        if (Math.abs(a) > math.core.EPSILON) {
          order = 3;
        } else if (Math.abs(b) > math.core.EPSILON) {
          order = 2;
        } else if (Math.abs(c) > math.core.EPSILON) {
          order = 1;
        } else {
          order = 0;
        }

        switch (order) {
          case 0:
            return;

          case 1:
            rc = -d / c;
            break;

          case 2:
            var disc = Math.pow(c, 2) - 4 * b * d;
            q1 = -c / (2 * b);

            if (disc < 0) {
              irootMax = -1;
              return;
            } else if (Math.abs(disc) < math.core.EPSILON) {
              irootMax = 0;
              rc = q1;
            } else {
              irootMax = 1;
              q2 = Math.sqrt(disc) / (2 * b);
              rc = q1 + q2;
            }

            break;

          case 3:
            var a2 = b / a;
            var a1 = c / a;
            var a0 = d / a;
            var Q = (3 * a1 - Math.pow(a2, 2)) / 9;
            var R = (9 * a2 * a1 - 27 * a0 - 2 * Math.pow(a2, 3)) / 54;
            var D = Math.pow(Q, 3) + Math.pow(R, 2);
            U = -a2 / 3;

            if (D > 0) {
              irootMax = 0;
              var rD = Math.sqrt(D);
              S = CubeRoot(R + rD);
              var T = CubeRoot(R - rD);
              rc = U + S + T;
            } else if (Math.abs(D) < math.core.EPSILON) {
              irootMax = 1;
              S = Math.pow(R, 1 / 3);
              rc = U + 2 * S;
            } else {
              irootMax = 2;

              var _rD = Math.sqrt(-D);

              var phi = Math.atan2(_rD, R) / 3;
              var rS = Math.pow(Math.pow(R, 2) - D, 1 / 6);
              Sr = rS * Math.cos(phi);
              Si = rS * Math.sin(phi);
              rc = U + 2 * Sr;
            }

            break;
        }

        break;

      case 1:
        if (irootMax < 1) {
          return;
        }

        switch (order) {
          case 2:
            rc = q1 - q2;
            break;

          case 3:
            if (irootMax === 1) {
              rc = U - S;
            } else {
              rc = U - Sr - Math.sqrt(3) * Si;
            }

            break;
        }

        break;

      case 2:
        if (irootMax < 2) return;

        switch (order) {
          case 3:
            rc = U - Sr + Math.sqrt(3) * Si;
            break;
        }

        break;
    }

    var p1p = [d1 * u1[0] + rc * u1p[0], d1 * u1[1] + rc * u1p[1]];
    var l_u = math.core.normalize([p1p[0] - p1[0], p1p[1] - p1[1]]);
    var l_d = math.core.dot(l_u, math.core.midpoint2(p1p, p1));
    var creasePoint = [l_d * l_u[0], l_d * l_u[1]];
    var creaseVector = [-l_u[1], l_u[0]];
    return [creasePoint, creaseVector];
  };
  var axiom = function axiom(number) {
    for (var _len = arguments.length, parameters = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      parameters[_key - 1] = arguments[_key];
    }

    var params = Params.apply(void 0, [number].concat(parameters));

    switch (number) {
      case 1:
        return axiom1.apply(void 0, _toConsumableArray(params));

      case 2:
        return axiom2.apply(void 0, _toConsumableArray(params));

      case 3:
        return axiom3.apply(void 0, _toConsumableArray(params));

      case 4:
        return axiom4.apply(void 0, _toConsumableArray(params));

      case 5:
        return axiom5.apply(void 0, _toConsumableArray(params));

      case 6:
        return axiom6.apply(void 0, _toConsumableArray(params));

      case 7:
        return axiom7.apply(void 0, _toConsumableArray(params));

      default:
        return undefined;
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

  var prepareGraph = function prepareGraph(graph) {
    if ("faces_re:matrix" in graph === false) {
      graph["faces_re:matrix"] = make_faces_matrix(graph, 0);
    }
  };

  var setup = function setup(origami, svg) {
    prepareGraph(origami);
    var touchFaceIndex = 0;
    var cachedGraph = clone$1(origami);
    var was_folded = origami.isFolded;
    var viewBox = svg.getViewBox();

    svg.mouseReleased = function (mouse) {
      return undefined;
    };

    svg.mousePressed = function (mouse) {
      viewBox = svg.getViewBox();
      was_folded = origami.isFolded;
      cachedGraph = clone$1(origami);
      var param = {
        faces_vertices: origami.faces_vertices,
        "faces_re:layer": origami["faces_re:layer"]
      };
      param.vertices_coords = was_folded ? origami["vertices_re:foldedCoords"] || origami.vertices_coords : origami["vertices_re:unfoldedCoords"] || origami.vertices_coords;
      var faces_containing = faces_containing_point(param, mouse);
      var top_face = topmost_face(param, faces_containing);
      touchFaceIndex = top_face == null ? 0 : top_face;

      if (was_folded) {
        cachedGraph.vertices_coords = origami["vertices_re:unfoldedCoords"].slice();
      }
    };

    svg.mouseMoved = function (mouse) {
      if (mouse.isPressed) {
        origami.load(cachedGraph);
        var instruction = axiom2([mouse.position[0], mouse.position[1]], [mouse.pressed[0], mouse.pressed[1]]);
        origami.fold(instruction.solutions[0], touchFaceIndex);

        if (was_folded) {
          origami["vertices_re:unfoldedCoords"] = origami.vertices_coords;
          origami.vertices_coords = origami["vertices_re:foldedCoords"];
          delete origami["vertices_re:foldedCoords"];
          origami.draw();
          svg.setViewBox.apply(svg, _toConsumableArray(viewBox));
        }
      }
    };
  };

  var FoldToSvgOptionKeys = ["input", "output", "padding", "file_frame", "stylesheet", "shadows", "boundaries", "faces", "edges", "vertices", "attributes"];

  var possibleFoldToSvgOptions = function possibleFoldToSvgOptions(input) {
    if (_typeof(input) !== "object" || input === null) {
      return 0;
    }

    var inputKeys = Object.keys(input);

    if (inputKeys.length === 0) {
      return 0;
    }

    return inputKeys.map(function (key) {
      return FoldToSvgOptionKeys.includes(key);
    }).reduce(function (a, b) {
      return a + (b ? 1 : 0);
    }, 0) / inputKeys.length;
  };

  var parseOptionsForFoldToSvg = function parseOptionsForFoldToSvg() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.filter(function (a) {
      return possibleFoldToSvgOptions(a) > 0.1;
    }).sort(function (a, b) {
      return possibleFoldToSvgOptions(b) - possibleFoldToSvgOptions(a);
    }).shift();
  };

  var interpreter = {
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
    "3D": "webgl"
  };

  var parseOptionsForView = function parseOptionsForView() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var viewOptions = args.filter(function (a) {
      return _typeof(a) === "object";
    }).filter(function (a) {
      return "view" in a === true;
    }).shift();

    if (viewOptions === undefined) {
      if (isNode) {
        return undefined;
      }

      if (isBrowser) {
        return "svg";
      }
    }

    return interpreter[viewOptions.view];
  };

  var SVGView = function SVGView(origami) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    var noCallbackArgs = args.filter(function (arg) {
      return typeof arg !== "function";
    });
    var svg = SVG.apply(void 0, _toConsumableArray(noCallbackArgs));
    var argumentOptions = parseOptionsForFoldToSvg.apply(void 0, args);
    var options = argumentOptions == null ? {
      output: "svg"
    } : Object.assign(argumentOptions, {
      output: "svg"
    });
    var layerNames = ["boundaries", "edges", "faces", "vertices"];

    var fit = function fit() {
      var r = bounding_rect$1(origami);
      svg.setViewBox.apply(svg, _toConsumableArray(r));
    };

    var getComponent = function getComponent(component) {
      var group = Array.from(svg.childNodes).filter(function (node) {
        return component === node.getAttribute("class");
      }).shift();
      return group === undefined ? [] : Array.from(group.childNodes);
    };

    var draw = function draw(innerArgumentOptions) {
      var drawOptions = innerArgumentOptions == null ? options : Object.assign(innerArgumentOptions, {
        output: "svg"
      });
      var newSVG = FoldToSvg(origami, JSON.parse(JSON.stringify(drawOptions)));
      var newSVGChildren = Array.from(newSVG.childNodes);
      var newSVGGroups = layerNames.map(function (string) {
        return newSVGChildren.filter(function (node) {
          return string === node.getAttribute("class");
        }).shift();
      }).filter(function (node) {
        return node !== undefined;
      });
      var oldSVGChildren = Array.from(svg.childNodes);
      var oldSVGGroups = layerNames.map(function (string) {
        return oldSVGChildren.filter(function (node) {
          return string === node.getAttribute("class");
        }).shift();
      }).filter(function (node) {
        return node !== undefined;
      });

      if (oldSVGGroups.length > 0) {
        newSVGGroups.forEach(function (node) {
          return svg.insertBefore(node, oldSVGGroups[0]);
        });
      } else {
        newSVGGroups.forEach(function (node) {
          return svg.appendChild(node);
        });
      }

      oldSVGGroups.forEach(function (node) {
        return svg.removeChild(node);
      });
      newSVGGroups.forEach(function (node) {
        return node.setAttribute("pointer-events", "none");
      });
      Array.from(newSVG.attributes).forEach(function (attr) {
        return svg.setAttribute(attr.name, attr.value);
      });
    };

    fit();
    draw();
    origami.changed.handlers.push(function (caller) {
      return draw();
    });
    Object.defineProperty(origami, "draw", {
      value: draw
    });
    Object.defineProperty(origami, "svg", {
      get: function get() {
        return svg;
      }
    });
    Object.defineProperty(svg, "vertices", {
      get: function get() {
        return getComponent("vertices");
      }
    });
    Object.defineProperty(svg, "edges", {
      get: function get() {
        return getComponent("edges");
      }
    });
    Object.defineProperty(svg, "faces", {
      get: function get() {
        return getComponent("faces");
      }
    });
    Object.defineProperty(svg, "boundaries", {
      get: function get() {
        return getComponent("boundaries");
      }
    });

    if (options.touchFold === true) {
      setup(origami, origami.svg);
    }

    var sendCallback = function sendCallback() {
      args.filter(function (arg) {
        return typeof arg === "function";
      }).forEach(function (func) {
        return func.call(origami, origami);
      });
    };

    if (win.document.readyState === "loading") {
      win.document.addEventListener("DOMContentLoaded", sendCallback);
    } else {
      sendCallback();
    }
  };

  var View = function View(origami) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }

    switch (parseOptionsForView.apply(void 0, args)) {
      case "svg":
        SVGView.apply(void 0, [origami].concat(args));
        break;
    }
  };

  var get_assignment = function get_assignment() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.filter(function (a) {
      return typeof a === "string";
    }).filter(function (a) {
      return a.length === 1;
    }).shift();
  };

  var boundary_clips = function boundary_clips(b, i) {
    var graph = this;
    Object.defineProperty(b, "clipLine", {
      value: function value() {
        var _math$core, _math$core2;

        return [math.core.intersection.convex_poly_line(b.vertices.map(function (v) {
          return graph.vertices_coords[v];
        }), (_math$core = math.core).get_line.apply(_math$core, arguments).origin, (_math$core2 = math.core).get_line.apply(_math$core2, arguments).vector)];
      }
    });
    Object.defineProperty(b, "clipRay", {
      value: function value() {
        var _math$core3, _math$core4;

        return [math.core.intersection.convex_poly_ray(b.vertices.map(function (v) {
          return graph.vertices_coords[v];
        }), (_math$core3 = math.core).get_line.apply(_math$core3, arguments).origin, (_math$core4 = math.core).get_line.apply(_math$core4, arguments).vector)];
      }
    });
    Object.defineProperty(b, "clipSegment", {
      value: function value() {
        var _math$core$intersecti, _math$core5;

        return [(_math$core$intersecti = math.core.intersection).convex_poly_segment.apply(_math$core$intersecti, [b.vertices.map(function (v) {
          return graph.vertices_coords[v];
        })].concat(_toConsumableArray((_math$core5 = math.core).get_vector_of_vectors.apply(_math$core5, arguments))))];
      }
    });
  };

  var boundary_coords = function boundary_coords(b, i) {
    var graph = this;
    Object.defineProperty(b, "coords", {
      get: function get() {
        if (!b.vertices || !graph.vertices_coords) {
          return undefined;
        }

        return b.vertices.map(function (v) {
          return graph.vertices_coords[v];
        });
      }
    });
  };

  var setup_boundary = function setup_boundary(b, i) {
    boundary_coords.call(this, b, i);
    boundary_clips.call(this, b, i);
  };

  var getBoundaries = function getBoundaries() {
    var boundaries = [get_boundary$1(this)];
    boundaries.forEach(setup_boundary.bind(this));
    return boundaries;
  };

  var FACES_MATRIX = "faces_re:matrix";
  var FACES_LAYER = "faces_re:layer";

  var removeLayerInformation = function removeLayerInformation(graph) {
    if (graph[FACES_LAYER]) {
      delete graph[FACES_LAYER];
    }

    if (graph[FACES_MATRIX]) {
      delete graph[FACES_MATRIX];
    }
  };

  var get_assignment$1 = function get_assignment() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.filter(function (a) {
      return typeof a === "string";
    }).filter(function (a) {
      return a.length === 1;
    }).shift();
  };

  var lastTriggerUpdate = new Date().getTime();
  var triggerUpdateTimer;

  var triggerUpdate = function triggerUpdate() {
    var now = new Date().getTime();

    if (now - lastTriggerUpdate < 100) {
      lastTriggerUpdate = now;
      triggerUpdateTimer = setTimeout(triggerUpdate, 200);
      clearTimeout(triggerUpdateTimer);
    }
  };

  var addLineType = function addLineType(getFunc, clipFunc) {
    var _this = this;

    for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    var l = getFunc.apply(void 0, args);
    var assignment = get_assignment$1.apply(void 0, args) || "F";
    var poly = get_boundary$1(this).vertices.map(function (v) {
      return _this.vertices_coords[v];
    });
    var c = clipFunc(poly, l);

    if (c === undefined) {
      return false;
    }

    this.vertices_coords.push(c[0], c[1]);
    this.edges_vertices.push([this.vertices_coords.length - 2, this.vertices_coords.length - 1]);
    this.edges_assignment.push(assignment);

    if (triggerUpdate()) {
      return false;
    }

    fragment$1(this);
    populate(this);
    removeLayerInformation(this);
    return true;
  };

  var segment$1 = function segment() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return addLineType.call.apply(addLineType, [this, math.core.get_segment, function (poly, l) {
      return math.core.intersection.convex_poly_segment(poly, l[0], l[1]);
    }].concat(args));
  };
  var ray = function ray() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return addLineType.call.apply(addLineType, [this, math.core.get_line, function (poly, r) {
      return math.core.intersection.convex_poly_ray(poly, r.origin, r.vector);
    }].concat(args));
  };
  var line$2 = function line() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }

    return addLineType.call.apply(addLineType, [this, math.core.get_line, function (poly, l) {
      return math.core.intersection.convex_poly_line(poly, l.origin, l.vector);
    }].concat(args));
  };

  var VERTICES_FOLDED_COORDS = "vertices_re:foldedCoords";
  var VERTICES_UNFOLDED_COORDS = "vertices_re:unfoldedCoords";
  var FACES_MATRIX$1 = "faces_re:matrix";

  var setFoldedForm = function setFoldedForm(graph, isFolded) {
    if (graph.frame_classes == null) {
      graph.frame_classes = [];
    }

    var wasFolded = isFoldedState(graph);

    if (isFolded === wasFolded) {
      return;
    }

    graph.frame_classes = graph.frame_classes.filter(function (c) {
      return ![CREASE_PATTERN, FOLDED_FORM].includes(c);
    }).concat([isFolded ? FOLDED_FORM : CREASE_PATTERN]);

    if (isFolded) {
      if (!(VERTICES_FOLDED_COORDS in graph)) {
        if (graph.faces_vertices == null) {
          populate(graph);
        }

        graph[FACES_MATRIX$1] = make_faces_matrix(graph, 0);
        graph[VERTICES_FOLDED_COORDS] = make_vertices_coords_folded(graph, null, graph[FACES_MATRIX$1]);
      }

      graph[VERTICES_UNFOLDED_COORDS] = graph.vertices_coords;
      graph.vertices_coords = graph[VERTICES_FOLDED_COORDS];
      delete graph[VERTICES_FOLDED_COORDS];
    } else {
      if (graph[VERTICES_UNFOLDED_COORDS] == null) {
        return;
      }

      graph[VERTICES_FOLDED_COORDS] = graph.vertices_coords;
      graph.vertices_coords = graph[VERTICES_UNFOLDED_COORDS];
      delete graph[VERTICES_UNFOLDED_COORDS];
    }
  };

  var svg_to_png = function svg_to_png(svgElement, callback, options) {
    if (isNode) {
      return;
    }

    var canvas = win.document.createElement("canvas");
    canvas.setAttribute("width", "2048");
    canvas.setAttribute("height", "2048");
    var ctx = canvas.getContext("2d");
    var DOMURL = win.URL || win.webkitURL;
    svgElement.setAttribute("width", "2048");
    svgElement.setAttribute("height", "2048");
    var svgString = new win.XMLSerializer().serializeToString(svgElement);
    var svg = new win.Blob([svgString], {
      type: "image/svg+xml;charset=utf-8"
    });
    var img = new win.Image();
    var url = DOMURL.createObjectURL(svg);

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(function (blob) {
        if (typeof callback === "function") {
          callback(blob);
        }

        DOMURL.revokeObjectURL(url);
      }, "image/png");
    };

    img.src = url;
  };

  var export_object = function export_object(graph) {
    var exportObject = function exportObject() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length === 0) {
        return JSON.stringify(graph);
      }

      switch (args[0]) {
        case "oripa":
          return convert$1(graph, "fold").oripa();

        case "svg":
          return convert$1(graph, "fold").svg();

        case "png":
          return function () {
            var callback = undefined;
            var promise = {
              then: function then(async) {
                if (isNode) {
                  async("png rendering requires running in the browser. unsupported in node js");
                }

                callback = async;
              }
            };
            svg_to_png.apply(void 0, [convert$1(graph, "fold").svg({
              output: "svg"
            }), function (png) {
              if (png === undefined) {
                return;
              }

              promise.data = png;

              if (typeof callback === "function") {
                callback(png);
              }
            }].concat(args));
            return promise;
          }();

        default:
          return JSON.stringify(graph);
      }
    };

    exportObject.json = function () {
      return JSON.stringify(graph);
    };

    exportObject.fold = function () {
      return JSON.stringify(graph);
    };

    exportObject.svg = function () {
      return convert$1(graph, "fold").svg();
    };

    exportObject.oripa = function () {
      return convert$1(graph, "fold").oripa();
    };

    exportObject.png = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return function () {
        var callback = undefined;
        var promise = {
          then: function then(async) {
            if (isNode) {
              async("png rendering requires running in the browser. unsupported in node js");
            }

            callback = async;
          }
        };
        svg_to_png.apply(void 0, [convert$1(graph, "fold").svg({
          output: "svg"
        }), function (png) {
          if (png === undefined) {
            return;
          }

          promise.data = png;

          if (typeof callback === "function") {
            callback(png);
          }
        }].concat(args));
        return promise;
      }();
    };

    return exportObject;
  };

  var extensions = ["faces_re:matrix", "faces_re:layer"];
  var DEFAULTS$1 = Object.freeze({
    touchFold: false
  });

  var parseOptions = function parseOptions() {
    var keys = Object.keys(DEFAULTS$1);
    var prefs = {};
    Array.apply(void 0, arguments).filter(function (obj) {
      return _typeof(obj) === "object";
    }).forEach(function (obj) {
      return Object.keys(obj).filter(function (key) {
        return keys.includes(key);
      }).forEach(function (key) {
        prefs[key] = obj[key];
      });
    });
    return prefs;
  };

  var Origami = function Origami() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var origami = Object.assign(Object.create(Prototype$2()), args.filter(function (a) {
      return possibleFoldObject(a) > 0;
    }).sort(function (a, b) {
      return possibleFoldObject(b) - possibleFoldObject(a);
    }).shift() || square());

    var load = function load(object) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var foldObject = convert$1(object).fold();

      if (options.append !== true) {
        keys.forEach(function (key) {
          return delete origami[key];
        });
        extensions.forEach(function (key) {
          return delete origami[key];
        });
      }

      Object.assign(origami, {
        file_spec: file_spec,
        file_creator: file_creator
      }, clone$1(foldObject));
      origami.changed.update(origami.load);
    };

    var crease = function crease() {
      for (var _len2 = arguments.length, methodArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        methodArgs[_key2] = arguments[_key2];
      }

      var objects = methodArgs.filter(function (p) {
        return _typeof(p) === "object";
      });
      var line = math.core.get_line(methodArgs);
      var assignment = get_assignment.apply(void 0, methodArgs) || "V";
      var face_index = methodArgs.filter(function (a) {
        return a !== null && !isNaN(a);
      }).shift();

      if (!math.core.is_vector(line.origin) || !math.core.is_vector(line.vector)) {
        console.warn("fold was not supplied the correct parameters");
        return;
      }

      var folded = fold_through(origami, line.origin, line.vector, face_index, assignment);
      Object.keys(folded).filter(function (key) {
        return typeof origami[key] !== "function";
      }).forEach(function (key) {
        origami[key] = folded[key];
      });

      if ("re:construction" in origami === true) {
        if (objects.length > 0 && "axiom" in objects[0] === true) {
          origami["re:construction"].axiom = objects[0].axiom;
          origami["re:construction"].parameters = objects[0].parameters;
        }

        origami["re:diagrams"] = [build_diagram_frame(origami)];
      }
    };

    var line = function line() {
      var _CreasePattern$line;

      for (var _len3 = arguments.length, methodArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        methodArgs[_key3] = arguments[_key3];
      }

      if ((_CreasePattern$line = line$2).call.apply(_CreasePattern$line, [origami].concat(methodArgs))) {
        origami.changed.update(line);
      }
    };

    var ray$1 = function ray$1() {
      var _CreasePattern$ray;

      for (var _len4 = arguments.length, methodArgs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        methodArgs[_key4] = arguments[_key4];
      }

      if ((_CreasePattern$ray = ray).call.apply(_CreasePattern$ray, [origami].concat(methodArgs))) {
        origami.changed.update(ray$1);
      }
    };

    var segment = function segment() {
      var _CreasePattern$segmen;

      for (var _len5 = arguments.length, methodArgs = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        methodArgs[_key5] = arguments[_key5];
      }

      if ((_CreasePattern$segmen = segment$1).call.apply(_CreasePattern$segmen, [origami].concat(methodArgs))) {
        origami.changed.update(segment);
      }
    };

    var fold = function fold() {
      if (arguments.length > 0) {
        crease.apply(void 0, arguments);
        origami.changed.update(origami.fold);
        return origami;
      } else {
        setFoldedForm(origami, true);
        origami.changed.update(origami.fold);
        return origami;
      }
    };

    var unfold = function unfold() {
      setFoldedForm(origami, false);
      origami.changed.update(origami.unfold);
      return origami;
    };

    var options = {};
    Object.assign(options, DEFAULTS$1);
    var userDefaults = parseOptions.apply(void 0, args);
    Object.keys(userDefaults).forEach(function (key) {
      options[key] = userDefaults[key];
    });
    Object.defineProperty(origami, "boundaries", {
      get: function get() {
        return getBoundaries.call(origami);
      }
    });
    Object.defineProperty(origami, "load", {
      value: load
    });
    Object.defineProperty(origami, "isFolded", {
      get: function get() {
        return isFoldedState(origami);
      }
    });
    Object.defineProperty(origami, "fold", {
      value: fold
    });
    Object.defineProperty(origami, "unfold", {
      value: unfold
    });
    Object.defineProperty(origami, "export", {
      get: function get() {
        return export_object(origami);
      }
    });
    Object.defineProperty(origami, "line", {
      value: line
    });
    Object.defineProperty(origami, "ray", {
      value: ray$1
    });
    Object.defineProperty(origami, "segment", {
      value: segment
    });
    View.apply(void 0, [origami].concat(args));
    return origami;
  };

  Origami.empty = function () {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
    }

    return Origami.apply(void 0, [empty()].concat(args));
  };

  Origami.square = function () {
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
    }

    return Origami.apply(void 0, [square()].concat(args));
  };

  Origami.rectangle = function (width, height) {
    for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
      args[_key8 - 2] = arguments[_key8];
    }

    return Origami.apply(void 0, [rectangle(width, height)].concat(args));
  };

  Origami.regularPolygon = function () {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    for (var _len9 = arguments.length, args = new Array(_len9 > 2 ? _len9 - 2 : 0), _key9 = 2; _key9 < _len9; _key9++) {
      args[_key9 - 2] = arguments[_key9];
    }

    return Origami.apply(void 0, [regular_polygon(sides, radius)].concat(args));
  };

  var Graph = function Graph() {
    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Object.assign(Object.create(Prototype$2()), empty(), object, {
      file_spec: file_spec,
      file_creator: file_creator
    });
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
  var merge_frame = function merge_frame(fold_file, frame) {
    var dontCopy = ["frame_parent", "frame_inherit"];
    var copy = clone$1(frame);
    dontCopy.forEach(function (key) {
      return delete copy[key];
    });
    var swap = fold_file.file_frames;
    fold_file.file_frames = null;
    var fold = clone$1(fold_file);
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

  var copy_without_marks = function copy_without_marks(graph) {
    var edges_vertices = graph.edges_vertices.filter(function (_, i) {
      return graph.edges_assignment[i] !== "F" && graph.edges_assignment[i] !== "f";
    });
    var edges_assignment = graph.edges_assignment.filter(function (ea) {
      return ea !== "F" && ea !== "f";
    });
    var copy = clone$1(graph);
    Object.keys(copy).filter(function (key) {
      return key.substring(0, 9) === "vertices_";
    }).forEach(function (key) {
      return delete copy[key];
    });
    Object.keys(copy).filter(function (key) {
      return key.substring(0, 6) === "edges_";
    }).forEach(function (key) {
      return delete copy[key];
    });
    Object.keys(copy).filter(function (key) {
      return key.substring(0, 6) === "faces_";
    }).forEach(function (key) {
      return delete copy[key];
    });
    var rebuilt = Object.assign(copy, {
      vertices_coords: graph.vertices_coords,
      edges_vertices: edges_vertices,
      edges_assignment: edges_assignment
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

  var select_vertices = function select_vertices(graph, poly_points) {
    var polygon = math.convexPolygon(poly_points);
    var contains = graph.vertices_coords.map(function (v) {
      return polygon.contains(v);
    });
    return graph.vertices_coords.map(function (_, i) {
      return i;
    }).filter(function (i) {
      return contains[i];
    });
  };
  var select_edges = function select_edges(graph, poly_points) {
    var segments = graph.edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return graph.vertices_coords[v];
      });
    });
    var polygon = math.convexPolygon(poly_points);
    var overlaps = segments.map(function (s) {
      return polygon.overlaps(s);
    });
    return segments.map(function (_, i) {
      return i;
    }).filter(function (i) {
      return overlaps[i];
    });
  };

  var select = /*#__PURE__*/Object.freeze({
    __proto__: null,
    select_vertices: select_vertices,
    select_edges: select_edges
  });

  var alternating_sum = function alternating_sum() {
    for (var _len = arguments.length, numbers = new Array(_len), _key = 0; _key < _len; _key++) {
      numbers[_key] = arguments[_key];
    }

    return [0, 1].map(function (even_odd) {
      return numbers.filter(function (_, i) {
        return i % 2 === even_odd;
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    });
  };
  var kawasaki_flatness = function kawasaki_flatness() {
    return alternating_sum.apply(void 0, arguments).map(function (a) {
      return a < 0 ? a + Math.PI * 2 : a;
    }).map(function (a) {
      return Math.PI - a;
    }).map(function (n) {
      return math.core.clean_number(n, 14);
    });
  };
  var vertex_adjacent_vectors = function vertex_adjacent_vectors(graph, vertex) {
    return graph.vertices_vertices[vertex].map(function (v) {
      return [graph.vertices_coords[v][0] - graph.vertices_coords[vertex][0], graph.vertices_coords[v][1] - graph.vertices_coords[vertex][1]];
    });
  };
  var vertex_sectorAngles = function vertex_sectorAngles(graph, vertex) {
    return vertex_adjacent_vectors(graph, vertex).map(function (v, i, arr) {
      return math.core.counter_clockwise_angle2(arr[i], arr[(i + 1) % arr.length]);
    });
  };
  var vertex_kawasaki_flatness = function vertex_kawasaki_flatness(graph, vertex) {
    return kawasaki_flatness.apply(void 0, _toConsumableArray(vertex_sectorAngles(graph, vertex)));
  };
  var make_vertices_sectorAngles = function make_vertices_sectorAngles(graph) {
    return Array.from(Array(graph.vertices_coords.length)).map(function (_, i) {
      return vertex_sectorAngles(graph, i);
    });
  };
  var make_vertices_kawasaki_flatness = function make_vertices_kawasaki_flatness(graph) {
    return Array.from(Array(graph.vertices_coords.length)).map(function (_, i) {
      return vertex_kawasaki_flatness(graph, i);
    });
  };
  var make_vertices_kawasaki = function make_vertices_kawasaki(graph) {
    var vertices_isBoundary = make_vertices_isBoundary(graph);
    var vertices_flatness = Array.from(Array(graph.vertices_coords.length)).map(function (_, i) {
      return vertices_isBoundary[i] ? [0, 0] : vertex_kawasaki_flatness(graph, i);
    });
    return vertices_flatness;
  };
  var make_vertices_nudge_matrix = function make_vertices_nudge_matrix(graph) {
    var arrayVerticesLength = Array.from(Array(graph.vertices_coords.length));
    var vertices_flatness = make_vertices_kawasaki(graph);
    var vertices_vertices = graph.vertices_vertices;
    var vertices_adjVecs = arrayVerticesLength.map(function (_, i) {
      return vertex_adjacent_vectors(graph, i);
    });
    var vertices_nudge_matrix = arrayVerticesLength.map(function () {
      return [];
    });
    vertices_flatness.forEach(function (flatness, i) {
      if (flatness[0] === 0) {
        return;
      }

      vertices_vertices[i].forEach(function (vv, vvi) {
        vertices_nudge_matrix[i][vv] = [-vertices_adjVecs[i][vvi][1] * flatness[vvi % 2], vertices_adjVecs[i][vvi][0] * flatness[vvi % 2]];
      });
    });
    return vertices_nudge_matrix;
  };
  var kawasaki_test = function kawasaki_test(graph) {
    var EPSILON = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;

    if (graph.vertices_coords == null) {
      return false;
    }

    if (graph.vertices_vertices == null) ;

    return make_vertices_kawasaki(graph).map(function (k) {
      return k.map(function (n) {
        return Math.abs(n) < EPSILON;
      }).reduce(function (a, b) {
        return a && b;
      }, true);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };
  var make_vertices_nudge = function make_vertices_nudge(graph) {
    var matrix = make_vertices_nudge_matrix(graph);
    var largestMagnitude = matrix.map(function (list) {
      return list.reduce(function (prev, b) {
        var magnitude = b.length === 0 ? 0 : math.core.magnitude(b);
        return prev > magnitude ? prev : magnitude;
      }, 0);
    });
    var matrix_row_normalized = matrix.map(function (list, i) {
      return list.map(function (el) {
        return math.core.magnitude(el) / largestMagnitude[i];
      });
    });
    var matrix_inverted = matrix_row_normalized.map(function (a) {
      return a.map(function (b) {
        return 1 / b;
      });
    });
    var matrix_weighted = matrix.map(function (row, i) {
      return row.map(function (vec, j) {
        return vec.map(function (n) {
          return n * matrix_inverted[i][j];
        });
      });
    });
    var vertices_nudge = matrix_weighted.map(function (row) {
      return row.reduce(function (a, b) {
        return [a[0] + b[0], a[1] + b[1]];
      }, [0, 0]);
    });
    return vertices_nudge;
  };
  var kawasaki_solutions_radians = function kawasaki_solutions_radians(vectors_radians) {
    return vectors_radians.map(function (v, i, ar) {
      return math.core.counter_clockwise_angle2_radians(v, ar[(i + 1) % ar.length]);
    }).map(function (_, i, arr) {
      return arr.slice(i + 1, arr.length).concat(arr.slice(0, i));
    }).map(function (opposite_sectors) {
      return kawasaki_flatness.apply(void 0, _toConsumableArray(opposite_sectors));
    }).map(function (kawasakis, i) {
      return vectors_radians[i] + kawasakis[0];
    }).map(function (angle, i) {
      return math.core.is_counter_clockwise_between(angle, vectors_radians[i], vectors_radians[(i + 1) % vectors_radians.length]) ? angle : undefined;
    });
  };
  var kawasaki_solutions = function kawasaki_solutions() {
    for (var _len2 = arguments.length, vectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      vectors[_key2] = arguments[_key2];
    }

    var vectors_radians = vectors.map(function (v) {
      return Math.atan2(v[1], v[0]);
    });
    return kawasaki_solutions_radians.apply(void 0, _toConsumableArray(vectors_radians)).map(function (a) {
      return a === undefined ? undefined : [math.core.clean_number(Math.cos(a), 14), math.core.clean_number(Math.sin(a), 14)];
    });
  };
  function kawasaki_collapse(graph, vertex, face) {
    var crease_direction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "F";
    var kawasakis = kawasaki_solutions(graph, vertex);
    var origin = graph.vertices_coords[vertex];
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

  var replace_edge = function replace_edge(graph, edge_index) {
    for (var _len = arguments.length, new_edges = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      new_edges[_key - 2] = arguments[_key];
    }

    var prefix = "edges_";
    var prefixKeys = Object.keys(graph).map(function (str) {
      return str.substring(0, prefix.length) === prefix ? str : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
    var edges = Array.from(Array(new_edges.length)).map(function () {
      return {};
    });
    new_edges.forEach(function (_, i) {
      return prefixKeys.filter(function (pKey) {
        return graph[pKey][edge_index] !== undefined;
      }).forEach(function (pKey) {
        edges[i][pKey] = graph[pKey][edge_index];
      });
    });
    new_edges.forEach(function (edge, i) {
      return Object.keys(edge).forEach(function (key) {
        edges[i][key] = new_edges[i][key];
      });
    });
    return edges;
  };

  var edge_split_rebuild_vertices_vertices = function edge_split_rebuild_vertices_vertices(graph, edge_vertices, new_vertex_index) {
    var update = [];
    edge_vertices.forEach(function (vert) {
      update[vert] = {};
    });
    var edges_vertices_other_vertex = [1, 0].map(function (i) {
      return edge_vertices[i];
    });
    edge_vertices.forEach(function (vert, i) {
      update[vert].vertices_vertices = graph.vertices_vertices[vert] !== undefined ? _toConsumableArray(graph.vertices_vertices[vert]) : [edges_vertices_other_vertex[i]];
    });
    var other_index_of = edge_vertices.map(function (v, i) {
      return update[v].vertices_vertices.indexOf(edges_vertices_other_vertex[i]);
    });
    edge_vertices.forEach(function (vert, i) {
      update[vert].vertices_vertices[other_index_of[i]] = new_vertex_index;
    });
    return update;
  };

  var face_insert_vertex_between_edge = function face_insert_vertex_between_edge(face_vertices, edge_vertices, new_vertex_index) {
    var len = face_vertices.length;
    var spliceIndices = face_vertices.map(function (fv, i, arr) {
      return fv === edge_vertices[0] && arr[(i + 1) % len] === edge_vertices[1] || fv === edge_vertices[1] && arr[(i + 1) % len] === edge_vertices[0] ? (i + 1) % len : undefined;
    }).filter(function (el) {
      return el !== undefined;
    });
    var new_face_vertices = [];
    var modI = 0;

    for (var i = 0; i < len + spliceIndices.length; i += 1) {
      if (spliceIndices.includes(i)) {
        modI -= 1;
        new_face_vertices[i] = new_vertex_index;
      } else {
        new_face_vertices[i] = face_vertices[i + modI];
      }
    }

    return new_face_vertices;
  };

  var edges_common_vertex = function edges_common_vertex(graph) {
    for (var _len2 = arguments.length, edges = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      edges[_key2 - 1] = arguments[_key2];
    }

    var v = edges.map(function (e) {
      return graph.edges_vertices[e];
    });
    return v[0][0] === v[1][0] || v[0][0] === v[1][1] ? v[0][0] : v[0][1];
  };

  var face_replace_edge_with_two_edges = function face_replace_edge_with_two_edges(graph, face_edges, old_edge_index, new_vertex_index, new_edge_index_0, new_edge_index_1, new_edge_vertices_0, new_edge_vertices_1) {
    var len = face_edges.length;
    var edge_in_face_edges_index = face_edges.indexOf(old_edge_index);
    var three_edges = [face_edges[(edge_in_face_edges_index + len - 1) % len], old_edge_index, face_edges[(edge_in_face_edges_index + 1) % len]];
    var ordered_verts = [0, 1].map(function (i) {
      return edges_common_vertex(graph, three_edges[i], three_edges[i + 1]);
    });
    var new_edges_indices = new_edge_vertices_0[0] === ordered_verts[0] || new_edge_vertices_0[1] === ordered_verts[0] ? [new_edge_index_0, new_edge_index_1] : [new_edge_index_1, new_edge_index_0];
    var new_face_edges = face_edges.slice();

    if (edge_in_face_edges_index === len - 1) {
      new_face_edges.splice(edge_in_face_edges_index, 1, new_edges_indices[0]);
      new_face_edges.unshift(new_edges_indices[1]);
    } else {
      new_face_edges.splice.apply(new_face_edges, [edge_in_face_edges_index, 1].concat(new_edges_indices));
    }

    return new_face_edges;
  };

  var add_vertex_on_edge$1 = function add_vertex_on_edge(graph, x, y, old_edge_index) {
    var vertices_length = graph.vertices_coords.length;
    var edges_length = graph.edges_vertices.length;

    if (edges_length < old_edge_index) {
      return undefined;
    }

    var result = {
      remove: {
        edges: [old_edge_index]
      },
      update: edge_split_rebuild_vertices_vertices(graph, graph.edges_vertices[old_edge_index], vertices_length),
      "new": {
        vertices: [{
          vertices_coords: [x, y],
          vertices_vertices: _toConsumableArray(graph.edges_vertices[old_edge_index]),
          vertices_faces: graph.edges_faces ? graph.edges_faces[old_edge_index] : undefined
        }],
        edges: replace_edge.apply(void 0, [graph, old_edge_index].concat(_toConsumableArray(graph.edges_vertices[old_edge_index].map(function (ev) {
          return {
            edges_vertices: [ev, vertices_length]
          };
        })))),
        faces: []
      }
    };

    if (graph.edges_faces) {
      graph.edges_faces[old_edge_index].forEach(function (i) {
        if (result.update[i] === undefined) {
          result.update[i] = {};
        }

        result.update[i].faces_vertices = face_insert_vertex_between_edge(graph.faces_vertices[i], graph.edges_vertices[old_edge_index], vertices_length);
        result.update[i].faces_edges = face_replace_edge_with_two_edges(graph, graph.faces_edges[i], old_edge_index, vertices_length, edges_length, edges_length + 1, result["new"].edges[0].edges_vertices, result["new"].edges[1].edges_vertices);
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

  var core$1 = Object.create(null);
  Object.assign(core$1, frames, object$1, collinear, isolated, keys$1, affine, validate, similar, make, marks, select, query$1, kawasaki, Axioms);
  core$1.build_diagram_frame = build_diagram_frame;
  core$1.add_edge = add_edge;
  core$1.split_edge_run = add_vertex_on_edge$1;
  core$1.apply_run = apply_run_diff;
  core$1.merge_run = merge_run_diffs;
  core$1.apply_axiom = make_axiom_frame;
  core$1.fragment = fragment$1;
  core$1.clean = clean;
  core$1.join = join;
  core$1.remove = remove_geometry_key_indices$1;
  core$1.rebuild = rebuild;
  core$1.populate = populate;
  core$1.validate = Validate;
  var b = {
    empty: JSON.parse(empty$1),
    square: JSON.parse(square$1),
    book: JSON.parse(book),
    blintz: JSON.parse(blintz),
    kite: JSON.parse(kite),
    fish: JSON.parse(fish),
    bird: JSON.parse(bird),
    frog: JSON.parse(frog)
  };
  var bases = Object.create(null);
  Object.defineProperty(bases, "empty", {
    get: function get() {
      return core$1.clone(b.empty);
    }
  });
  Object.defineProperty(bases, "square", {
    get: function get() {
      return core$1.clone(b.square);
    }
  });
  Object.defineProperty(bases, "book", {
    get: function get() {
      return core$1.clone(b.book);
    }
  });
  Object.defineProperty(bases, "blintz", {
    get: function get() {
      return core$1.clone(b.blintz);
    }
  });
  Object.defineProperty(bases, "kite", {
    get: function get() {
      return core$1.clone(b.kite);
    }
  });
  Object.defineProperty(bases, "fish", {
    get: function get() {
      return core$1.clone(b.fish);
    }
  });
  Object.defineProperty(bases, "bird", {
    get: function get() {
      return core$1.clone(b.bird);
    }
  });
  Object.defineProperty(bases, "frog", {
    get: function get() {
      return core$1.clone(b.frog);
    }
  });
  var rabbitEar = {
    origami: Origami,
    graph: Graph,
    svg: SVG,
    fold: fold_through,
    convert: convert$1,
    core: core$1,
    bases: bases,
    text: {
      axioms: JSON.parse(text_axioms)
    },
    math: math.core,
    axiom: axiom,
    equivalent: math.core.equivalent
  };
  Object.keys(math).filter(function (key) {
    return key !== "core";
  }).forEach(function (key) {
    rabbitEar[key] = math[key];
  });

  return rabbitEar;

})));
