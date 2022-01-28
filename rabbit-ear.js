/* Rabbit Ear 0.9.2 alpha 2022-01-28 (c) Robby Kraft, MIT License */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ear = factory());
}(this, (function () { 'use strict';

  var root = Object.create(null);

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
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
    if (n === "Map" || n === "Set") return Array.from(o);
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

  var type_of = function type_of(obj) {
    switch (obj.constructor.name) {
      case "vector":
      case "matrix":
      case "segment":
      case "ray":
      case "line":
      case "circle":
      case "ellipse":
      case "rect":
      case "polygon":
        return obj.constructor.name;
    }
    if (_typeof(obj) === "object") {
      if (obj.radius != null) {
        return "circle";
      }
      if (obj.width != null) {
        return "rect";
      }
      if (obj.x != null || typeof obj[0] === "number") {
        return "vector";
      }
      if (obj[0] != null && obj[0].length && (typeof obj[0].x === "number" || typeof obj[0][0] === "number")) {
        return "segment";
      }
      if (obj.vector != null && obj.origin != null) {
        return "line";
      }
    }
    return undefined;
  };
  var resize = function resize(d, v) {
    return v.length === d ? v : Array(d).fill(0).map(function (z, i) {
      return v[i] ? v[i] : z;
    });
  };
  var resize_up = function resize_up(a, b) {
    var size = a.length > b.length ? a.length : b.length;
    return [a, b].map(function (v) {
      return resize(size, v);
    });
  };
  var resize_down = function resize_down(a, b) {
    var size = a.length > b.length ? b.length : a.length;
    return [a, b].map(function (v) {
      return resize(size, v);
    });
  };
  var count_places = function count_places(num) {
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
    if (count_places(crop) === Math.min(places, count_places(num))) {
      return num;
    }
    return crop;
  };
  var is_iterable$1 = function is_iterable(obj) {
    return obj != null && typeof obj[Symbol.iterator] === "function";
  };
  var semi_flatten_arrays$1 = function semi_flatten_arrays() {
    switch (arguments.length) {
      case undefined:
      case 0:
        return Array.from(arguments);
      case 1:
        return is_iterable$1(arguments[0]) && typeof arguments[0] !== "string" ? semi_flatten_arrays.apply(void 0, _toConsumableArray(arguments[0])) : [arguments[0]];
      default:
        return Array.from(arguments).map(function (a) {
          return is_iterable$1(a) ? _toConsumableArray(semi_flatten_arrays(a)) : a;
        });
    }
  };
  var flatten_arrays$1 = function flatten_arrays() {
    switch (arguments.length) {
      case undefined:
      case 0:
        return Array.from(arguments);
      case 1:
        return is_iterable$1(arguments[0]) && typeof arguments[0] !== "string" ? flatten_arrays.apply(void 0, _toConsumableArray(arguments[0])) : [arguments[0]];
      default:
        return Array.from(arguments).map(function (a) {
          return is_iterable$1(a) ? _toConsumableArray(flatten_arrays(a)) : a;
        }).reduce(function (a, b) {
          return a.concat(b);
        }, []);
    }
  };
  var resizers = Object.freeze({
    __proto__: null,
    resize: resize,
    resize_up: resize_up,
    resize_down: resize_down,
    clean_number: clean_number,
    semi_flatten_arrays: semi_flatten_arrays$1,
    flatten_arrays: flatten_arrays$1
  });
  var EPSILON = 1e-6;
  var R2D = 180 / Math.PI;
  var D2R = Math.PI / 180;
  var TWO_PI = Math.PI * 2;
  var constants = Object.freeze({
    __proto__: null,
    EPSILON: EPSILON,
    R2D: R2D,
    D2R: D2R,
    TWO_PI: TWO_PI
  });
  var fn_true = function fn_true() {
    return true;
  };
  var fn_square = function fn_square(n) {
    return n * n;
  };
  var fn_add$1 = function fn_add(a, b) {
    return a + (b || 0);
  };
  var fn_not_undefined = function fn_not_undefined(a) {
    return a !== undefined;
  };
  var fn_and$1 = function fn_and(a, b) {
    return a && b;
  };
  var fn_cat$1 = function fn_cat(a, b) {
    return a.concat(b);
  };
  var fn_vec2_angle = function fn_vec2_angle(v) {
    return Math.atan2(v[1], v[0]);
  };
  var fn_to_vec2 = function fn_to_vec2(a) {
    return [Math.cos(a), Math.sin(a)];
  };
  var fn_equal = function fn_equal(a, b) {
    return a === b;
  };
  var fn_epsilon_equal = function fn_epsilon_equal(a, b) {
    return Math.abs(a - b) < EPSILON;
  };
  var include = function include(n) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return n > -epsilon;
  };
  var exclude = function exclude(n) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return n > epsilon;
  };
  var include_l = fn_true;
  var exclude_l = fn_true;
  var include_r = include;
  var exclude_r = exclude;
  var include_s = function include_s(t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return t > -e && t < 1 + e;
  };
  var exclude_s = function exclude_s(t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return t > e && t < 1 - e;
  };
  var line_limiter = function line_limiter(dist) {
    return dist;
  };
  var ray_limiter = function ray_limiter(dist) {
    return dist < -EPSILON ? 0 : dist;
  };
  var segment_limiter = function segment_limiter(dist) {
    if (dist < -EPSILON) {
      return 0;
    }
    if (dist > 1 + EPSILON) {
      return 1;
    }
    return dist;
  };
  var functions = Object.freeze({
    __proto__: null,
    fn_true: fn_true,
    fn_square: fn_square,
    fn_add: fn_add$1,
    fn_not_undefined: fn_not_undefined,
    fn_and: fn_and$1,
    fn_cat: fn_cat$1,
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
  var Constructors$1 = Object.create(null);
  var identity2x2 = [1, 0, 0, 1];
  var identity2x3 = identity2x2.concat(0, 0);
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
  var make_matrix2_translate = function make_matrix2_translate() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return identity2x2.concat(x, y);
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
  var make_matrix2_reflect = function make_matrix2_reflect(vector) {
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
  var _magnitude = function magnitude(v) {
    return Math.sqrt(v.map(fn_square).reduce(fn_add$1, 0));
  };
  var magnitude2$1 = function magnitude2(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  };
  var mag_squared = function mag_squared(v) {
    return v.map(fn_square).reduce(fn_add$1, 0);
  };
  var _normalize = function normalize(v) {
    var m = _magnitude(v);
    return m === 0 ? v : v.map(function (c) {
      return c / m;
    });
  };
  var normalize2 = function normalize2(v) {
    var m = magnitude2$1(v);
    return m === 0 ? v : [v[0] / m, v[1] / m];
  };
  var _scale = function scale(v, s) {
    return v.map(function (n) {
      return n * s;
    });
  };
  var scale2$1 = function scale2(v, s) {
    return [v[0] * s, v[1] * s];
  };
  var _add = function add(v, u) {
    return v.map(function (n, i) {
      return n + (u[i] || 0);
    });
  };
  var add2$1 = function add2(v, u) {
    return [v[0] + u[0], v[1] + u[1]];
  };
  var _subtract = function subtract(v, u) {
    return v.map(function (n, i) {
      return n - (u[i] || 0);
    });
  };
  var subtract2 = function subtract2(v, u) {
    return [v[0] - u[0], v[1] - u[1]];
  };
  var _dot = function dot(v, u) {
    return v.map(function (_, i) {
      return v[i] * u[i];
    }).reduce(fn_add$1, 0);
  };
  var dot2 = function dot2(v, u) {
    return v[0] * u[0] + v[1] * u[1];
  };
  var _midpoint = function midpoint(v, u) {
    return v.map(function (n, i) {
      return (n + u[i]) / 2;
    });
  };
  var midpoint2 = function midpoint2(v, u) {
    return scale2$1(add2$1(v, u), 0.5);
  };
  var average = function average() {
    var _arguments = arguments;
    if (arguments.length === 0) {
      return [];
    }
    var dimension = arguments[0].length > 0 ? arguments[0].length : 0;
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
  var _lerp = function lerp(v, u, t) {
    var inv = 1.0 - t;
    return v.map(function (n, i) {
      return n * inv + (u[i] || 0) * t;
    });
  };
  var cross2 = function cross2(v, u) {
    return v[0] * u[1] - v[1] * u[0];
  };
  var cross3 = function cross3(v, u) {
    return [v[1] * u[2] - v[2] * u[1], v[2] * u[0] - v[0] * u[2], v[0] * u[1] - v[1] * u[0]];
  };
  var distance = function distance(v, u) {
    return Math.sqrt(v.map(function (_, i) {
      return Math.pow(v[i] - u[i], 2);
    }).reduce(fn_add$1, 0));
  };
  var distance2$1 = function distance2(v, u) {
    var p = v[0] - u[0];
    var q = v[1] - u[1];
    return Math.sqrt(p * p + q * q);
  };
  var distance3 = function distance3(v, u) {
    var a = v[0] - u[0];
    var b = v[1] - u[1];
    var c = v[2] - u[2];
    return Math.sqrt(a * a + b * b + c * c);
  };
  var _flip = function flip(v) {
    return v.map(function (n) {
      return -n;
    });
  };
  var _rotate = function rotate90(v) {
    return [-v[1], v[0]];
  };
  var _rotate2 = function rotate270(v) {
    return [v[1], -v[0]];
  };
  var degenerate = function degenerate(v) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return v.map(function (n) {
      return Math.abs(n);
    }).reduce(fn_add$1, 0) < epsilon;
  };
  var parallel = function parallel(v, u) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return 1 - Math.abs(_dot(_normalize(v), _normalize(u))) < epsilon;
  };
  var parallel2 = function parallel2(v, u) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return Math.abs(cross2(v, u)) < epsilon;
  };
  var algebra$1 = Object.freeze({
    __proto__: null,
    magnitude: _magnitude,
    magnitude2: magnitude2$1,
    mag_squared: mag_squared,
    normalize: _normalize,
    normalize2: normalize2,
    scale: _scale,
    scale2: scale2$1,
    add: _add,
    add2: add2$1,
    subtract: _subtract,
    subtract2: subtract2,
    dot: _dot,
    dot2: dot2,
    midpoint: _midpoint,
    midpoint2: midpoint2,
    average: average,
    lerp: _lerp,
    cross2: cross2,
    cross3: cross3,
    distance: distance,
    distance2: distance2$1,
    distance3: distance3,
    flip: _flip,
    rotate90: _rotate,
    rotate270: _rotate2,
    degenerate: degenerate,
    parallel: parallel,
    parallel2: parallel2
  });
  var identity3x3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  var identity3x4 = Object.freeze(identity3x3.concat(0, 0, 0));
  var is_identity3x4 = function is_identity3x4(m) {
    return identity3x4.map(function (n, i) {
      return Math.abs(n - m[i]) < EPSILON;
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };
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
    return identity3x3.concat(x, y, z);
  };
  var single_axis_rotate = function single_axis_rotate(angle, origin, i0, i1, sgn) {
    var mat = identity3x3.concat([0, 1, 2].map(function (i) {
      return origin[i] || 0;
    }));
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    mat[i0 * 3 + i0] = cos;
    mat[i0 * 3 + i1] = (sgn ? +1 : -1) * sin;
    mat[i1 * 3 + i0] = (sgn ? -1 : +1) * sin;
    mat[i1 * 3 + i1] = cos;
    return mat;
  };
  var make_matrix3_rotateX = function make_matrix3_rotateX(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    return single_axis_rotate(angle, origin, 1, 2, true);
  };
  var make_matrix3_rotateY = function make_matrix3_rotateY(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    return single_axis_rotate(angle, origin, 0, 2, false);
  };
  var make_matrix3_rotateZ = function make_matrix3_rotateZ(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    return single_axis_rotate(angle, origin, 0, 1, true);
  };
  var make_matrix3_rotate = function make_matrix3_rotate(angle) {
    var vector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 1];
    var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0, 0];
    var pos = [0, 1, 2].map(function (i) {
      return origin[i] || 0;
    });
    var _resize = resize(3, _normalize(vector)),
        _resize2 = _slicedToArray(_resize, 3),
        x = _resize2[0],
        y = _resize2[1],
        z = _resize2[2];
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    var t = 1 - c;
    var trans = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
    var trans_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
    return multiply_matrices3(trans_inv, multiply_matrices3([t * x * x + c, t * y * x + z * s, t * z * x - y * s, t * x * y - z * s, t * y * y + c, t * z * y + x * s, t * x * z + y * s, t * y * z - x * s, t * z * z + c, 0, 0, 0], trans));
  };
  var make_matrix3_scale = function make_matrix3_scale(scale) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    return [scale, 0, 0, 0, scale, 0, 0, 0, scale, scale * -origin[0] + origin[0], scale * -origin[1] + origin[1], scale * -origin[2] + origin[2]];
  };
  var make_matrix3_reflectZ = function make_matrix3_reflectZ(vector) {
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
  var vector_origin_form = function vector_origin_form(vector, origin) {
    return {
      vector: vector || [],
      origin: origin || []
    };
  };
  var get_vector = function get_vector() {
    if (arguments[0] instanceof Constructors$1.vector) {
      return arguments[0];
    }
    var list = flatten_arrays$1(arguments);
    if (list.length > 0 && _typeof(list[0]) === "object" && list[0] !== null && !isNaN(list[0].x)) {
      list = ["x", "y", "z"].map(function (c) {
        return list[0][c];
      }).filter(fn_not_undefined);
    }
    return list.filter(function (n) {
      return typeof n === "number";
    });
  };
  var get_vector_of_vectors = function get_vector_of_vectors() {
    return semi_flatten_arrays$1(arguments).map(function (el) {
      return get_vector(el);
    });
  };
  var get_segment = function get_segment() {
    if (arguments[0] instanceof Constructors$1.segment) {
      return arguments[0];
    }
    var args = semi_flatten_arrays$1(arguments);
    if (args.length === 4) {
      return [[args[0], args[1]], [args[2], args[3]]];
    }
    return args.map(function (el) {
      return get_vector(el);
    });
  };
  var get_line = function get_line() {
    var args = semi_flatten_arrays$1(arguments);
    if (args.length === 0) {
      return vector_origin_form([], []);
    }
    if (args[0] instanceof Constructors$1.line || args[0] instanceof Constructors$1.ray || args[0] instanceof Constructors$1.segment) {
      return args[0];
    }
    if (args[0].constructor === Object && args[0].vector !== undefined) {
      return vector_origin_form(args[0].vector || [], args[0].origin || []);
    }
    return typeof args[0] === "number" ? vector_origin_form(get_vector(args)) : vector_origin_form.apply(void 0, _toConsumableArray(args.map(function (a) {
      return get_vector(a);
    })));
  };
  var get_ray = get_line;
  var get_rect_params = function get_rect_params() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    return {
      x: x,
      y: y,
      width: width,
      height: height
    };
  };
  var get_rect = function get_rect() {
    if (arguments[0] instanceof Constructors$1.rect) {
      return arguments[0];
    }
    var list = flatten_arrays$1(arguments);
    if (list.length > 0 && _typeof(list[0]) === "object" && list[0] !== null && !isNaN(list[0].width)) {
      return get_rect_params.apply(void 0, _toConsumableArray(["x", "y", "width", "height"].map(function (c) {
        return list[0][c];
      }).filter(fn_not_undefined)));
    }
    var numbers = list.filter(function (n) {
      return typeof n === "number";
    });
    var rect_params = numbers.length < 4 ? [,,].concat(_toConsumableArray(numbers)) : numbers;
    return get_rect_params.apply(void 0, _toConsumableArray(rect_params));
  };
  var get_circle_params = function get_circle_params() {
    var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return {
      radius: radius,
      origin: [].concat(args)
    };
  };
  var get_circle = function get_circle() {
    if (arguments[0] instanceof Constructors$1.circle) {
      return arguments[0];
    }
    var vectors = get_vector_of_vectors(arguments);
    var numbers = flatten_arrays$1(arguments).filter(function (a) {
      return typeof a === "number";
    });
    if (arguments.length === 2) {
      if (vectors[1].length === 1) {
        return get_circle_params.apply(void 0, [vectors[1][0]].concat(_toConsumableArray(vectors[0])));
      } else if (vectors[0].length === 1) {
        return get_circle_params.apply(void 0, [vectors[0][0]].concat(_toConsumableArray(vectors[1])));
      } else if (vectors[0].length > 1 && vectors[1].length > 1) {
        return get_circle_params.apply(void 0, [distance2$1.apply(void 0, _toConsumableArray(vectors))].concat(_toConsumableArray(vectors[0])));
      }
    } else {
      switch (numbers.length) {
        case 0:
          return get_circle_params(1, 0, 0, 0);
        case 1:
          return get_circle_params(numbers[0], 0, 0, 0);
        default:
          return get_circle_params.apply(void 0, [numbers.pop()].concat(_toConsumableArray(numbers)));
      }
    }
    return get_circle_params(1, 0, 0, 0);
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
    var mat = flatten_arrays$1(arguments);
    var matrix = _toConsumableArray(identity3x4);
    matrix_map_3x4(mat.length).forEach(function (n, i) {
      if (mat[i] != null) {
        matrix[n] = mat[i];
      }
    });
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
  var array_similarity_test = function array_similarity_test(list, compFunc) {
    return Array.from(Array(list.length - 1)).map(function (_, i) {
      return compFunc(list[0], list[i + 1]);
    }).reduce(fn_and$1, true);
  };
  var equivalent_vector2 = function equivalent_vector2(a, b) {
    return [0, 1].map(function (i) {
      return fn_epsilon_equal(a[i], b[i]);
    }).reduce(fn_and$1, true);
  };
  var equivalent_numbers = function equivalent_numbers() {
    if (arguments.length === 0) {
      return false;
    }
    if (arguments.length === 1 && arguments[0] !== undefined) {
      return equivalent_numbers.apply(void 0, _toConsumableArray(arguments[0]));
    }
    return array_similarity_test(arguments, fn_epsilon_equal);
  };
  var equivalent_vectors = function equivalent_vectors() {
    var args = Array.from(arguments);
    var length = args.map(function (a) {
      return a.length;
    }).reduce(function (a, b) {
      return a > b ? a : b;
    });
    var vecs = args.map(function (a) {
      return resize(length, a);
    });
    return Array.from(Array(arguments.length - 1)).map(function (_, i) {
      return vecs[0].map(function (_, n) {
        return Math.abs(vecs[0][n] - vecs[i + 1][n]) < EPSILON;
      }).reduce(fn_and$1, true);
    }).reduce(fn_and$1, true);
  };
  var equivalent = function equivalent() {
    var list = semi_flatten_arrays$1.apply(void 0, arguments);
    if (list.length < 1) {
      return false;
    }
    var typeofList = _typeof(list[0]);
    if (typeofList === "undefined") {
      return false;
    }
    switch (typeofList) {
      case "number":
        return array_similarity_test(list, fn_epsilon_equal);
      case "boolean":
      case "string":
        return array_similarity_test(list, fn_equal);
      case "object":
        if (list[0].constructor === Array) {
          return equivalent_vectors.apply(void 0, _toConsumableArray(list));
        }
        return array_similarity_test(list, function (a, b) {
          return JSON.stringify(a) === JSON.stringify(b);
        });
      default:
        return undefined;
    }
  };
  var equal = Object.freeze({
    __proto__: null,
    equivalent_vector2: equivalent_vector2,
    equivalent_numbers: equivalent_numbers,
    equivalent_vectors: equivalent_vectors,
    equivalent: equivalent
  });
  var sort_points_along_vector2 = function sort_points_along_vector2(points, vector) {
    return points.map(function (point) {
      return {
        point: point,
        d: point[0] * vector[0] + point[1] * vector[1]
      };
    }).sort(function (a, b) {
      return a.d - b.d;
    }).map(function (a) {
      return a.point;
    });
  };
  var sort$1 = Object.freeze({
    __proto__: null,
    sort_points_along_vector2: sort_points_along_vector2
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
    var index = smallest_comparison_search(point, array_of_points, distance2$1);
    return index === undefined ? undefined : array_of_points[index];
  };
  var nearest_point = function nearest_point(point, array_of_points) {
    var index = smallest_comparison_search(point, array_of_points, distance);
    return index === undefined ? undefined : array_of_points[index];
  };
  var nearest_point_on_line = function nearest_point_on_line(vector, origin, point, limiterFunc) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    origin = resize(vector.length, origin);
    point = resize(vector.length, point);
    var magSquared = mag_squared(vector);
    var vectorToPoint = _subtract(point, origin);
    var dotProd = _dot(vector, vectorToPoint);
    var dist = dotProd / magSquared;
    var d = limiterFunc(dist, epsilon);
    return _add(origin, _scale(vector, d));
  };
  var nearest_point_on_polygon = function nearest_point_on_polygon(polygon, point) {
    var v = polygon.map(function (p, i, arr) {
      return _subtract(arr[(i + 1) % arr.length], p);
    });
    return polygon.map(function (p, i) {
      return nearest_point_on_line(v[i], p, point, segment_limiter);
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
    return _add(origin, _scale(_normalize(_subtract(point, origin)), radius));
  };
  var nearest_point_on_ellipse = function nearest_point_on_ellipse() {
    return false;
  };
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
  var is_counter_clockwise_between = function is_counter_clockwise_between(angle, angleA, angleB) {
    while (angleB < angleA) {
      angleB += TWO_PI;
    }
    while (angle > angleA) {
      angle -= TWO_PI;
    }
    while (angle < angleA) {
      angle += TWO_PI;
    }
    return angle < angleB;
  };
  var clockwise_angle_radians = function clockwise_angle_radians(a, b) {
    while (a < 0) {
      a += TWO_PI;
    }
    while (b < 0) {
      b += TWO_PI;
    }
    while (a > TWO_PI) {
      a -= TWO_PI;
    }
    while (b > TWO_PI) {
      b -= TWO_PI;
    }
    var a_b = a - b;
    return a_b >= 0 ? a_b : TWO_PI - (b - a);
  };
  var counter_clockwise_angle_radians = function counter_clockwise_angle_radians(a, b) {
    while (a < 0) {
      a += TWO_PI;
    }
    while (b < 0) {
      b += TWO_PI;
    }
    while (a > TWO_PI) {
      a -= TWO_PI;
    }
    while (b > TWO_PI) {
      b -= TWO_PI;
    }
    var b_a = b - a;
    return b_a >= 0 ? b_a : TWO_PI - (a - b);
  };
  var clockwise_angle2 = function clockwise_angle2(a, b) {
    var dotProduct = b[0] * a[0] + b[1] * a[1];
    var determinant = b[0] * a[1] - b[1] * a[0];
    var angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) {
      angle += TWO_PI;
    }
    return angle;
  };
  var counter_clockwise_angle2 = function counter_clockwise_angle2(a, b) {
    var dotProduct = a[0] * b[0] + a[1] * b[1];
    var determinant = a[0] * b[1] - a[1] * b[0];
    var angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) {
      angle += TWO_PI;
    }
    return angle;
  };
  var clockwise_bisect2 = function clockwise_bisect2(a, b) {
    return fn_to_vec2(fn_vec2_angle(a) - clockwise_angle2(a, b) / 2);
  };
  var counter_clockwise_bisect2 = function counter_clockwise_bisect2(a, b) {
    return fn_to_vec2(fn_vec2_angle(a) + counter_clockwise_angle2(a, b) / 2);
  };
  var bisect_lines2 = function bisect_lines2(vectorA, originA, vectorB, originB) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var determinant = cross2(vectorA, vectorB);
    var dotProd = _dot(vectorA, vectorB);
    var bisects = determinant > -epsilon ? [counter_clockwise_bisect2(vectorA, vectorB)] : [clockwise_bisect2(vectorA, vectorB)];
    bisects[1] = determinant > -epsilon ? _rotate(bisects[0]) : _rotate2(bisects[0]);
    var numerator = (originB[0] - originA[0]) * vectorB[1] - vectorB[0] * (originB[1] - originA[1]);
    var t = numerator / determinant;
    var normalized = [vectorA, vectorB].map(function (vec) {
      return _normalize(vec);
    });
    var isParallel = Math.abs(cross2.apply(void 0, _toConsumableArray(normalized))) < epsilon;
    var origin = isParallel ? _midpoint(originA, originB) : [originA[0] + vectorA[0] * t, originA[1] + vectorA[1] * t];
    var solution = bisects.map(function (vector) {
      return {
        vector: vector,
        origin: origin
      };
    });
    if (isParallel) {
      delete solution[dotProd > -epsilon ? 1 : 0];
    }
    return solution;
  };
  var counter_clockwise_order_radians = function counter_clockwise_order_radians() {
    var radians = flatten_arrays$1(arguments);
    var counter_clockwise = radians.map(function (_, i) {
      return i;
    }).sort(function (a, b) {
      return radians[a] - radians[b];
    });
    return counter_clockwise.slice(counter_clockwise.indexOf(0), counter_clockwise.length).concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
  };
  var counter_clockwise_order2 = function counter_clockwise_order2() {
    return counter_clockwise_order_radians(get_vector_of_vectors(arguments).map(fn_vec2_angle));
  };
  var counter_clockwise_sectors_radians = function counter_clockwise_sectors_radians() {
    var radians = flatten_arrays$1(arguments);
    var ordered = counter_clockwise_order_radians(radians).map(function (i) {
      return radians[i];
    });
    return ordered.map(function (rad, i, arr) {
      return [rad, arr[(i + 1) % arr.length]];
    }).map(function (pair) {
      return counter_clockwise_angle_radians(pair[0], pair[1]);
    });
  };
  var counter_clockwise_sectors2 = function counter_clockwise_sectors2() {
    return counter_clockwise_sectors_radians(get_vector_of_vectors(arguments).map(fn_vec2_angle));
  };
  var counter_clockwise_subsect_radians = function counter_clockwise_subsect_radians(divisions, angleA, angleB) {
    var angle = counter_clockwise_angle_radians(angleA, angleB) / divisions;
    return Array.from(Array(divisions - 1)).map(function (_, i) {
      return angleA + angle * (i + 1);
    });
  };
  var counter_clockwise_subsect2 = function counter_clockwise_subsect2(divisions, vectorA, vectorB) {
    var angleA = Math.atan2(vectorA[1], vectorA[0]);
    var angleB = Math.atan2(vectorB[1], vectorB[0]);
    return counter_clockwise_subsect_radians(divisions, angleA, angleB).map(fn_to_vec2);
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
    bisect_lines2: bisect_lines2,
    counter_clockwise_order_radians: counter_clockwise_order_radians,
    counter_clockwise_order2: counter_clockwise_order2,
    counter_clockwise_sectors_radians: counter_clockwise_sectors_radians,
    counter_clockwise_sectors2: counter_clockwise_sectors2,
    counter_clockwise_subsect_radians: counter_clockwise_subsect_radians,
    counter_clockwise_subsect2: counter_clockwise_subsect2
  });
  var overlap_line_point = function overlap_line_point(vector, origin, point) {
    var func = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : exclude_l;
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var p2p = _subtract(point, origin);
    var lineMagSq = mag_squared(vector);
    var lineMag = Math.sqrt(lineMagSq);
    if (lineMag < epsilon) {
      return false;
    }
    var cross = cross2(p2p, vector.map(function (n) {
      return n / lineMag;
    }));
    var proj = _dot(p2p, vector) / lineMagSq;
    return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
  };
  var intersect_line_line = function intersect_line_line(aVector, aOrigin, bVector, bOrigin) {
    var aFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : include_l;
    var bFunction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : include_l;
    var epsilon = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : EPSILON;
    var det_norm = cross2(_normalize(aVector), _normalize(bVector));
    if (Math.abs(det_norm) < epsilon) {
      return undefined;
    }
    var determinant0 = cross2(aVector, bVector);
    var determinant1 = -determinant0;
    var a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
    var b2a = [-a2b[0], -a2b[1]];
    var t0 = cross2(a2b, bVector) / determinant0;
    var t1 = cross2(b2a, aVector) / determinant1;
    if (aFunction(t0, epsilon / _magnitude(aVector)) && bFunction(t1, epsilon / _magnitude(bVector))) {
      return _add(aOrigin, _scale(aVector, t0));
    }
    return undefined;
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
    }).reduce(fn_add$1, 0);
  };
  var _centroid = function centroid(points) {
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
  var enclosing_box = function enclosing_box(points) {
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
    return [mins, lengths];
  };
  var enclosing_rectangle = function enclosing_rectangle(points) {
    var box = enclosing_box(points);
    return get_rect_params(box[0][0], box[0][1], box[1][0], box[1][1]);
  };
  var angle_array = function angle_array(count) {
    return Array.from(Array(Math.floor(count))).map(function (_, i) {
      return TWO_PI * (i / count);
    });
  };
  var angles_to_vecs = function angles_to_vecs(angles, radius) {
    return angles.map(function (a) {
      return [radius * Math.cos(a), radius * Math.sin(a)];
    }).map(function (pt) {
      return pt.map(function (n) {
        return clean_number(n, 14);
      });
    });
  };
  var make_regular_polygon = function make_regular_polygon() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return angles_to_vecs(angle_array(sides), radius);
  };
  var make_regular_polygon_side_aligned = function make_regular_polygon_side_aligned() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var halfwedge = Math.PI / sides;
    var angles = angle_array(sides).map(function (a) {
      return a + halfwedge;
    });
    return angles_to_vecs(angles, radius);
  };
  var make_regular_polygon_inradius = function make_regular_polygon_inradius() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return make_regular_polygon(sides, radius / Math.cos(Math.PI / sides));
  };
  var make_regular_polygon_inradius_side_aligned = function make_regular_polygon_inradius_side_aligned() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return make_regular_polygon_side_aligned(sides, radius / Math.cos(Math.PI / sides));
  };
  var make_regular_polygon_side_length = function make_regular_polygon_side_length() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return make_regular_polygon(sides, length / 2 / Math.sin(Math.PI / sides));
  };
  var make_regular_polygon_side_length_side_aligned = function make_regular_polygon_side_length_side_aligned() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return make_regular_polygon_side_aligned(sides, length / 2 / Math.sin(Math.PI / sides));
  };
  var make_polygon_non_collinear = function make_polygon_non_collinear(polygon) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    var edges_vector = polygon.map(function (v, i, arr) {
      return [v, arr[(i + 1) % arr.length]];
    }).map(function (pair) {
      return _subtract(pair[1], pair[0]);
    });
    var vertex_collinear = edges_vector.map(function (vector, i, arr) {
      return [vector, arr[(i + arr.length - 1) % arr.length]];
    }).map(function (pair) {
      return !parallel(pair[1], pair[0], epsilon);
    });
    return polygon.filter(function (vertex, v) {
      return vertex_collinear[v];
    });
  };
  var split_convex_polygon = function split_convex_polygon(poly, lineVector, linePoint) {
    var vertices_intersections = poly.map(function (v, i) {
      var intersection = overlap_line_point(lineVector, linePoint, v, include_l);
      return {
        point: intersection ? v : null,
        at_index: i
      };
    }).filter(function (el) {
      return el.point != null;
    });
    var edges_intersections = poly.map(function (v, i, arr) {
      return {
        point: intersect_line_line(lineVector, linePoint, _subtract(v, arr[(i + 1) % arr.length]), arr[(i + 1) % arr.length], exclude_l, exclude_s),
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
  };
  var recurse_skeleton = function recurse_skeleton(points, lines, bisectors) {
    var intersects = points.map(function (origin, i) {
      return {
        vector: bisectors[i],
        origin: origin
      };
    }).map(function (ray, i, arr) {
      return intersect_line_line(ray.vector, ray.origin, arr[(i + 1) % arr.length].vector, arr[(i + 1) % arr.length].origin, exclude_r, exclude_r);
    });
    var projections = lines.map(function (line, i) {
      return nearest_point_on_line(line.vector, line.origin, intersects[i], function (a) {
        return a;
      });
    });
    if (points.length === 3) {
      return points.map(function (p) {
        return {
          type: "skeleton",
          points: [p, intersects[0]]
        };
      }).concat([{
        type: "perpendicular",
        points: [projections[0], intersects[0]]
      }]);
    }
    var projectionLengths = intersects.map(function (intersect, i) {
      return distance(intersect, projections[i]);
    });
    var shortest = 0;
    projectionLengths.forEach(function (len, i) {
      if (len < projectionLengths[shortest]) {
        shortest = i;
      }
    });
    var solutions = [{
      type: "skeleton",
      points: [points[shortest], intersects[shortest]]
    }, {
      type: "skeleton",
      points: [points[(shortest + 1) % points.length], intersects[shortest]]
    }, {
      type: "perpendicular",
      points: [projections[shortest], intersects[shortest]]
    }];
    var newVector = clockwise_bisect2(_flip(lines[(shortest + lines.length - 1) % lines.length].vector), lines[(shortest + 1) % lines.length].vector);
    var shortest_is_last_index = shortest === points.length - 1;
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
  var straight_skeleton = function straight_skeleton(points) {
    var lines = points.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (side) {
      return {
        vector: _subtract(side[1], side[0]),
        origin: side[0]
      };
    });
    var bisectors = points.map(function (_, i, ar) {
      return [(i - 1 + ar.length) % ar.length, i, (i + 1) % ar.length].map(function (i) {
        return ar[i];
      });
    }).map(function (p) {
      return [_subtract(p[0], p[1]), _subtract(p[2], p[1])];
    }).map(function (v) {
      return clockwise_bisect2.apply(void 0, _toConsumableArray(v));
    });
    return recurse_skeleton(_toConsumableArray(points), lines, bisectors);
  };
  var geometry = Object.freeze({
    __proto__: null,
    circumcircle: circumcircle,
    signed_area: signed_area,
    centroid: _centroid,
    enclosing_box: enclosing_box,
    enclosing_rectangle: enclosing_rectangle,
    make_regular_polygon: make_regular_polygon,
    make_regular_polygon_side_aligned: make_regular_polygon_side_aligned,
    make_regular_polygon_inradius: make_regular_polygon_inradius,
    make_regular_polygon_inradius_side_aligned: make_regular_polygon_inradius_side_aligned,
    make_regular_polygon_side_length: make_regular_polygon_side_length,
    make_regular_polygon_side_length_side_aligned: make_regular_polygon_side_length_side_aligned,
    make_polygon_non_collinear: make_polygon_non_collinear,
    split_convex_polygon: split_convex_polygon,
    convex_hull: convex_hull,
    straight_skeleton: straight_skeleton
  });
  var vector_origin_to_ud = function vector_origin_to_ud(_ref) {
    var vector = _ref.vector,
        origin = _ref.origin;
    var mag = _magnitude(vector);
    var u = _rotate(vector);
    var d = _dot(origin, u) / mag;
    return {
      u: _scale(u, 1 / mag),
      d: d
    };
  };
  var ud_to_vector_origin = function ud_to_vector_origin(_ref2) {
    var u = _ref2.u,
        d = _ref2.d;
    return {
      vector: _rotate2(u),
      origin: _scale(u, d)
    };
  };
  var parameterize = Object.freeze({
    __proto__: null,
    vector_origin_to_ud: vector_origin_to_ud,
    ud_to_vector_origin: ud_to_vector_origin
  });
  var acos_safe = function acos_safe(x) {
    if (x >= 1.0) return 0;
    if (x <= -1.0) return Math.PI;
    return Math.acos(x);
  };
  var rotate_vector2 = function rotate_vector2(center, pt, a) {
    var x = pt[0] - center[0];
    var y = pt[1] - center[1];
    var xRot = x * Math.cos(a) + y * Math.sin(a);
    var yRot = y * Math.cos(a) - x * Math.sin(a);
    return [center[0] + xRot, center[1] + yRot];
  };
  var intersect_circle_circle = function intersect_circle_circle(c1_radius, c1_origin, c2_radius, c2_origin) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var r = c1_radius < c2_radius ? c1_radius : c2_radius;
    var R = c1_radius < c2_radius ? c2_radius : c1_radius;
    var smCenter = c1_radius < c2_radius ? c1_origin : c2_origin;
    var bgCenter = c1_radius < c2_radius ? c2_origin : c1_origin;
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
    var angle = acos_safe((r * r - d * d - R * R) / (-2.0 * d * R));
    var pt1 = rotate_vector2(bgCenter, point, +angle);
    var pt2 = rotate_vector2(bgCenter, point, -angle);
    return [pt1, pt2];
  };
  var intersect_circle_line = function intersect_circle_line(circle_radius, circle_origin, line_vector, line_origin) {
    var line_func = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : include_l;
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;
    var magSq = Math.pow(line_vector[0], 2) + Math.pow(line_vector[1], 2);
    var mag = Math.sqrt(magSq);
    var norm = mag === 0 ? line_vector : line_vector.map(function (c) {
      return c / mag;
    });
    var rot90 = _rotate(norm);
    var bvec = _subtract(line_origin, circle_origin);
    var det = cross2(bvec, norm);
    if (Math.abs(det) > circle_radius + epsilon) {
      return undefined;
    }
    var side = Math.sqrt(Math.pow(circle_radius, 2) - Math.pow(det, 2));
    var f = function f(s, i) {
      return circle_origin[i] - rot90[i] * det + norm[i] * s;
    };
    var results = Math.abs(circle_radius - Math.abs(det)) < epsilon ? [side].map(function (s) {
      return [s, s].map(f);
    }) : [-side, side].map(function (s) {
      return [s, s].map(f);
    });
    var ts = results.map(function (res) {
      return res.map(function (n, i) {
        return n - line_origin[i];
      });
    }).map(function (v) {
      return v[0] * line_vector[0] + line_vector[1] * v[1];
    }).map(function (d) {
      return d / magSq;
    });
    return results.filter(function (_, i) {
      return line_func(ts[i], epsilon);
    });
  };
  var overlap_convex_polygon_point = function overlap_convex_polygon_point(poly, point) {
    var func = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : exclude;
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (s) {
      return cross2(_normalize(_subtract(s[1], s[0])), _subtract(point, s[0]));
    }).map(function (side) {
      return func(side, epsilon);
    }).map(function (s, _, arr) {
      return s === arr[0];
    }).reduce(function (prev, curr) {
      return prev && curr;
    }, true);
  };
  var get_unique_pair = function get_unique_pair(intersections) {
    for (var i = 1; i < intersections.length; i += 1) {
      if (!equivalent_vector2(intersections[0], intersections[i])) {
        return [intersections[0], intersections[i]];
      }
    }
  };
  var intersect_convex_polygon_line_inclusive = function intersect_convex_polygon_line_inclusive(poly, vector, origin) {
    var fn_poly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : include_s;
    var fn_line = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : include_l;
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;
    var intersections = poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (side) {
      return intersect_line_line(_subtract(side[1], side[0]), side[0], vector, origin, fn_poly, fn_line, epsilon);
    }).filter(function (a) {
      return a !== undefined;
    });
    switch (intersections.length) {
      case 0:
        return undefined;
      case 1:
        return [intersections];
      default:
        return get_unique_pair(intersections) || [intersections[0]];
    }
  };
  var intersect_convex_polygon_line = function intersect_convex_polygon_line(poly, vector, origin) {
    var fn_poly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : include_s;
    var fn_line = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : exclude_l;
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;
    var sects = intersect_convex_polygon_line_inclusive(poly, vector, origin, fn_poly, fn_line, epsilon);
    var altFunc;
    switch (fn_line) {
      case exclude_r:
        altFunc = include_r;
        break;
      case exclude_s:
        altFunc = include_s;
        break;
      default:
        return sects;
    }
    var includes = intersect_convex_polygon_line_inclusive(poly, vector, origin, include_s, altFunc, epsilon);
    if (includes === undefined) {
      return undefined;
    }
    var uniqueIncludes = get_unique_pair(includes);
    if (uniqueIncludes === undefined) {
      switch (fn_line) {
        case exclude_l:
          return undefined;
        case exclude_r:
          return overlap_convex_polygon_point(poly, origin, exclude, epsilon) ? includes : undefined;
        case exclude_s:
          return overlap_convex_polygon_point(poly, _add(origin, vector), exclude, epsilon) || overlap_convex_polygon_point(poly, origin, exclude, epsilon) ? includes : undefined;
      }
    }
    return overlap_convex_polygon_point(poly, _midpoint.apply(void 0, _toConsumableArray(uniqueIncludes)), exclude, epsilon) ? uniqueIncludes : sects;
  };
  var intersect_polygon_polygon = function intersect_polygon_polygon(polygon1, polygon2) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    var cp1, cp2, s, e;
    var inside = function inside(p) {
      return (cp2[0] - cp1[0]) * (p[1] - cp1[1]) > (cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon;
    };
    var intersection = function intersection() {
      var dc = [cp1[0] - cp2[0], cp1[1] - cp2[1]],
          dp = [s[0] - e[0], s[1] - e[1]],
          n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
          n2 = s[0] * e[1] - s[1] * e[0],
          n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
      return [(n1 * dp[0] - n2 * dc[0]) * n3, (n1 * dp[1] - n2 * dc[1]) * n3];
    };
    var outputList = polygon1;
    cp1 = polygon2[polygon2.length - 1];
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
        } else if (inside(s)) {
          outputList.push(intersection());
        }
        s = e;
      }
      cp1 = cp2;
    }
    return outputList.length === 0 ? undefined : outputList;
  };
  var intersect_param_form = {
    polygon: function polygon(a) {
      return [a];
    },
    rect: function rect(a) {
      return [a];
    },
    circle: function circle(a) {
      return [a.radius, a.origin];
    },
    line: function line(a) {
      return [a.vector, a.origin];
    },
    ray: function ray(a) {
      return [a.vector, a.origin];
    },
    segment: function segment(a) {
      return [a.vector, a.origin];
    }
  };
  var intersect_func = {
    polygon: {
      polygon: intersect_polygon_polygon,
      line: function line(a, b, fnA, fnB, ep) {
        return intersect_convex_polygon_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [include_s, fnB, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return intersect_convex_polygon_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [include_s, fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return intersect_convex_polygon_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [include_s, fnB, ep]));
      }
    },
    circle: {
      circle: function circle(a, b, fnA, fnB, ep) {
        return intersect_circle_circle.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [ep]));
      },
      line: function line(a, b, fnA, fnB, ep) {
        return intersect_circle_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnB, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return intersect_circle_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return intersect_circle_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnB, ep]));
      }
    },
    line: {
      polygon: function polygon(a, b, fnA, fnB, ep) {
        return intersect_convex_polygon_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [include_s, fnA, ep]));
      },
      circle: function circle(a, b, fnA, fnB, ep) {
        return intersect_circle_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnA, ep]));
      },
      line: function line(a, b, fnA, fnB, ep) {
        return intersect_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return intersect_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return intersect_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      }
    },
    ray: {
      polygon: function polygon(a, b, fnA, fnB, ep) {
        return intersect_convex_polygon_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [include_s, fnA, ep]));
      },
      circle: function circle(a, b, fnA, fnB, ep) {
        return intersect_circle_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnA, ep]));
      },
      line: function line(a, b, fnA, fnB, ep) {
        return intersect_line_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return intersect_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return intersect_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      }
    },
    segment: {
      polygon: function polygon(a, b, fnA, fnB, ep) {
        return intersect_convex_polygon_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [include_s, fnA, ep]));
      },
      circle: function circle(a, b, fnA, fnB, ep) {
        return intersect_circle_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnA, ep]));
      },
      line: function line(a, b, fnA, fnB, ep) {
        return intersect_line_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return intersect_line_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return intersect_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      }
    }
  };
  var similar_intersect_types = {
    polygon: "polygon",
    rect: "polygon",
    circle: "circle",
    line: "line",
    ray: "ray",
    segment: "segment"
  };
  var default_intersect_domain_function = {
    polygon: exclude,
    rect: exclude,
    circle: exclude,
    line: exclude_l,
    ray: exclude_r,
    segment: exclude_s
  };
  var _intersect = function intersect(a, b, epsilon) {
    var type_a = type_of(a);
    var type_b = type_of(b);
    var aT = similar_intersect_types[type_a];
    var bT = similar_intersect_types[type_b];
    var params_a = intersect_param_form[type_a](a);
    var params_b = intersect_param_form[type_b](b);
    var domain_a = a.domain_function || default_intersect_domain_function[type_a];
    var domain_b = b.domain_function || default_intersect_domain_function[type_b];
    return intersect_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
  };
  var convex_polygons_overlap = function convex_polygons_overlap(poly1, poly2) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    for (var p = 0; p < 2; p++) {
      var polyA = p === 0 ? poly1 : poly2;
      var polyB = p === 0 ? poly2 : poly1;
      var _loop2 = function _loop2(i) {
        var origin = polyA[i];
        var vector = _rotate(_subtract(polyA[(i + 1) % polyA.length], polyA[i]));
        var projected = polyB.map(function (p) {
          return _subtract(p, origin);
        }).map(function (v) {
          return _dot(vector, v);
        });
        var other_test_point = polyA[(i + 2) % polyA.length];
        var side_a = _dot(vector, _subtract(other_test_point, origin));
        var side = side_a > 0;
        var one_sided = projected.map(function (dotProd) {
          return side ? dotProd < epsilon : dotProd > -epsilon;
        }).reduce(function (a, b) {
          return a && b;
        }, true);
        if (one_sided) {
          return {
            v: false
          };
        }
      };
      for (var i = 0; i < polyA.length; i++) {
        var _ret2 = _loop2(i);
        if (_typeof(_ret2) === "object") return _ret2.v;
      }
    }
    return true;
  };
  var overlap_circle_point = function overlap_circle_point(radius, origin, point) {
    var func = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : exclude;
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return func(radius - distance2$1(origin, point), epsilon);
  };
  var overlap_line_line = function overlap_line_line(aVector, aOrigin, bVector, bOrigin) {
    var aFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : exclude_l;
    var bFunction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : exclude_l;
    var epsilon = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : EPSILON;
    var denominator0 = cross2(aVector, bVector);
    var denominator1 = -denominator0;
    var a2b = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
    if (Math.abs(denominator0) < epsilon) {
      if (Math.abs(cross2(a2b, aVector)) > epsilon) {
        return false;
      }
      var bPt1 = a2b;
      var bPt2 = _add(bPt1, bVector);
      var aProjLen = _dot(aVector, aVector);
      var bProj1 = _dot(bPt1, aVector) / aProjLen;
      var bProj2 = _dot(bPt2, aVector) / aProjLen;
      var bProjSm = bProj1 < bProj2 ? bProj1 : bProj2;
      var bProjLg = bProj1 < bProj2 ? bProj2 : bProj1;
      var bOutside1 = bProjSm > 1 - epsilon;
      var bOutside2 = bProjLg < epsilon;
      if (bOutside1 || bOutside2) {
        return false;
      }
      return true;
    }
    var b2a = [-a2b[0], -a2b[1]];
    var t0 = cross2(a2b, bVector) / denominator0;
    var t1 = cross2(b2a, aVector) / denominator1;
    return aFunction(t0, epsilon / _magnitude(aVector)) && bFunction(t1, epsilon / _magnitude(bVector));
  };
  var overlap_param_form = {
    polygon: function polygon(a) {
      return [a];
    },
    rect: function rect(a) {
      return [a];
    },
    circle: function circle(a) {
      return [a.radius, a.origin];
    },
    line: function line(a) {
      return [a.vector, a.origin];
    },
    ray: function ray(a) {
      return [a.vector, a.origin];
    },
    segment: function segment(a) {
      return [a.vector, a.origin];
    },
    vector: function vector(a) {
      return [a];
    }
  };
  var overlap_func = {
    polygon: {
      polygon: function polygon(a, b, fnA, fnB, ep) {
        return convex_polygons_overlap.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [ep]));
      },
      vector: function vector(a, b, fnA, fnB, ep) {
        return overlap_convex_polygon_point.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, ep]));
      }
    },
    circle: {
      vector: function vector(a, b, fnA, fnB, ep) {
        return overlap_circle_point.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [exclude, ep]));
      }
    },
    line: {
      line: function line(a, b, fnA, fnB, ep) {
        return overlap_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return overlap_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return overlap_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      vector: function vector(a, b, fnA, fnB, ep) {
        return overlap_line_point.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, ep]));
      }
    },
    ray: {
      line: function line(a, b, fnA, fnB, ep) {
        return overlap_line_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return overlap_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return overlap_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      vector: function vector(a, b, fnA, fnB, ep) {
        return overlap_line_point.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, ep]));
      }
    },
    segment: {
      line: function line(a, b, fnA, fnB, ep) {
        return overlap_line_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return overlap_line_line.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return overlap_line_line.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      vector: function vector(a, b, fnA, fnB, ep) {
        return overlap_line_point.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, ep]));
      }
    },
    vector: {
      polygon: function polygon(a, b, fnA, fnB, ep) {
        return overlap_convex_polygon_point.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, ep]));
      },
      circle: function circle(a, b, fnA, fnB, ep) {
        return overlap_circle_point.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [exclude, ep]));
      },
      line: function line(a, b, fnA, fnB, ep) {
        return overlap_line_point.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return overlap_line_point.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return overlap_line_point.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, ep]));
      },
      vector: function vector(a, b, fnA, fnB, ep) {
        return equivalent_vector2.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [ep]));
      }
    }
  };
  var similar_overlap_types = {
    polygon: "polygon",
    rect: "polygon",
    circle: "circle",
    line: "line",
    ray: "ray",
    segment: "segment",
    vector: "vector"
  };
  var default_overlap_domain_function = {
    polygon: exclude,
    rect: exclude,
    circle: exclude,
    line: exclude_l,
    ray: exclude_r,
    segment: exclude_s,
    vector: exclude_l
  };
  var _overlap = function overlap(a, b, epsilon) {
    var type_a = type_of(a);
    var type_b = type_of(b);
    var aT = similar_overlap_types[type_a];
    var bT = similar_overlap_types[type_b];
    var params_a = overlap_param_form[type_a](a);
    var params_b = overlap_param_form[type_b](b);
    var domain_a = a.domain_function || default_overlap_domain_function[type_a];
    var domain_b = b.domain_function || default_overlap_domain_function[type_b];
    return overlap_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
  };
  var enclose_convex_polygons_inclusive = function enclose_convex_polygons_inclusive(outer, inner) {
    var outerGoesInside = outer.map(function (p) {
      return overlap_convex_polygon_point(inner, p, include);
    }).reduce(function (a, b) {
      return a || b;
    }, false);
    var innerGoesOutside = inner.map(function (p) {
      return overlap_convex_polygon_point(inner, p, include);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
    return !outerGoesInside && innerGoesOutside;
  };
  var line_line_parameter = function line_line_parameter(line_vector, line_origin, poly_vector, poly_origin) {
    var poly_line_func = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : include_s;
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;
    var det_norm = cross2(_normalize(line_vector), _normalize(poly_vector));
    if (Math.abs(det_norm) < epsilon) {
      return undefined;
    }
    var determinant0 = cross2(line_vector, poly_vector);
    var determinant1 = -determinant0;
    var a2b = _subtract(poly_origin, line_origin);
    var b2a = _flip(a2b);
    var t0 = cross2(a2b, poly_vector) / determinant0;
    var t1 = cross2(b2a, line_vector) / determinant1;
    if (poly_line_func(t1, epsilon / _magnitude(poly_vector))) {
      return t0;
    }
    return undefined;
  };
  var line_point_from_parameter = function line_point_from_parameter(vector, origin, t) {
    return _add(origin, _scale(vector, t));
  };
  var get_intersect_parameters = function get_intersect_parameters(poly, vector, origin, poly_line_func, epsilon) {
    return poly.map(function (p, i, arr) {
      return [_subtract(arr[(i + 1) % arr.length], p), p];
    }).map(function (side) {
      return line_line_parameter(vector, origin, side[0], side[1], poly_line_func, epsilon);
    }).filter(fn_not_undefined).sort(function (a, b) {
      return a - b;
    });
  };
  var get_min_max = function get_min_max(numbers, func, scaled_epsilon) {
    var a = 0;
    var b = numbers.length - 1;
    while (a < b) {
      if (func(numbers[a + 1] - numbers[a], scaled_epsilon)) {
        break;
      }
      a++;
    }
    while (b > a) {
      if (func(numbers[b] - numbers[b - 1], scaled_epsilon)) {
        break;
      }
      b--;
    }
    if (a >= b) {
      return undefined;
    }
    return [numbers[a], numbers[b]];
  };
  var clip_line_in_convex_polygon = function clip_line_in_convex_polygon(poly, vector, origin) {
    var fn_poly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : include;
    var fn_line = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : include_l;
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;
    var numbers = get_intersect_parameters(poly, vector, origin, include_s, epsilon);
    if (numbers.length < 2) {
      return undefined;
    }
    var scaled_epsilon = epsilon * 2 / _magnitude(vector);
    var ends = get_min_max(numbers, fn_poly, scaled_epsilon);
    if (ends === undefined) {
      return undefined;
    }
    var ends_clip = ends.map(function (t, i) {
      return fn_line(t) ? t : t < 0.5 ? 0 : 1;
    });
    if (Math.abs(ends_clip[0] - ends_clip[1]) < epsilon * 2 / _magnitude(vector)) {
      return undefined;
    }
    var mid = line_point_from_parameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
    return overlap_convex_polygon_point(poly, mid, fn_poly, epsilon) ? ends_clip.map(function (t) {
      return line_point_from_parameter(vector, origin, t);
    }) : undefined;
  };
  var VectorArgs = function VectorArgs() {
    this.push.apply(this, _toConsumableArray(get_vector(arguments)));
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
      magnitude: function magnitude() {
        return _magnitude(this);
      },
      isEquivalent: function isEquivalent() {
        return equivalent_vectors(this, get_vector(arguments));
      },
      isParallel: function isParallel() {
        return parallel.apply(void 0, _toConsumableArray(resize_up(this, get_vector(arguments))));
      },
      isCollinear: function isCollinear(line) {
        return _overlap(this, line);
      },
      dot: function dot() {
        return _dot.apply(void 0, _toConsumableArray(resize_up(this, get_vector(arguments))));
      },
      distanceTo: function distanceTo() {
        return distance.apply(void 0, _toConsumableArray(resize_up(this, get_vector(arguments))));
      },
      overlap: function overlap(other) {
        return _overlap(this, other);
      }
    },
    vector: {
      copy: function copy() {
        return _toConsumableArray(this);
      },
      normalize: function normalize() {
        return _normalize(this);
      },
      scale: function scale() {
        return _scale(this, arguments[0]);
      },
      flip: function flip() {
        return _flip(this);
      },
      rotate90: function rotate90() {
        return _rotate(this);
      },
      rotate270: function rotate270() {
        return _rotate2(this);
      },
      cross: function cross() {
        return cross3(resize(3, this), resize(3, get_vector(arguments)));
      },
      transform: function transform() {
        return multiply_matrix3_vector3(get_matrix_3x4(arguments), resize(3, this));
      },
      add: function add() {
        return _add(this, resize(this.length, get_vector(arguments)));
      },
      subtract: function subtract() {
        return _subtract(this, resize(this.length, get_vector(arguments)));
      },
      rotateZ: function rotateZ(angle, origin) {
        return multiply_matrix3_vector3(get_matrix_3x4(make_matrix2_rotate(angle, origin)), resize(3, this));
      },
      lerp: function lerp(vector, pct) {
        return _lerp(this, resize(this.length, get_vector(vector)), pct);
      },
      midpoint: function midpoint() {
        return _midpoint.apply(void 0, _toConsumableArray(resize_up(this, get_vector(arguments))));
      },
      bisect: function bisect() {
        return counter_clockwise_bisect2(this, get_vector(arguments));
      }
    }
  };
  var VectorMethods = {};
  Object.keys(table.preserve).forEach(function (key) {
    VectorMethods[key] = table.preserve[key];
  });
  Object.keys(table.vector).forEach(function (key) {
    VectorMethods[key] = function () {
      return Constructors$1.vector.apply(Constructors$1, _toConsumableArray(table.vector[key].apply(this, arguments)));
    };
  });
  var VectorStatic = {
    fromAngle: function fromAngle(angle) {
      return Constructors$1.vector(Math.cos(angle), Math.sin(angle));
    },
    fromAngleDegrees: function fromAngleDegrees(angle) {
      return Constructors$1.vector.fromAngle(angle * D2R);
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
  var Static = {
    fromPoints: function fromPoints() {
      var points = get_vector_of_vectors(arguments);
      return this.constructor({
        vector: _subtract(points[1], points[0]),
        origin: points[0]
      });
    },
    fromAngle: function fromAngle() {
      var angle = arguments[0] || 0;
      return this.constructor({
        vector: [Math.cos(angle), Math.sin(angle)],
        origin: [0, 0]
      });
    },
    perpendicularBisector: function perpendicularBisector() {
      var points = get_vector_of_vectors(arguments);
      return this.constructor({
        vector: _rotate(_subtract(points[1], points[0])),
        origin: average(points[0], points[1])
      });
    }
  };
  var methods$1$1 = {
    isParallel: function isParallel() {
      var arr = resize_up(this.vector, get_line(arguments).vector);
      return parallel.apply(void 0, _toConsumableArray(arr));
    },
    isCollinear: function isCollinear() {
      var line = get_line(arguments);
      return overlap_line_point(this.vector, this.origin, line.origin) && parallel.apply(void 0, _toConsumableArray(resize_up(this.vector, line.vector)));
    },
    isDegenerate: function isDegenerate() {
      var epsilon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : EPSILON;
      return degenerate(this.vector, epsilon);
    },
    reflectionMatrix: function reflectionMatrix() {
      return Constructors$1.matrix(make_matrix3_reflectZ(this.vector, this.origin));
    },
    nearestPoint: function nearestPoint() {
      var point = get_vector(arguments);
      return Constructors$1.vector(nearest_point_on_line(this.vector, this.origin, point, this.clip_function));
    },
    transform: function transform() {
      var dim = this.dimension;
      var r = multiply_matrix3_line3(get_matrix_3x4(arguments), resize(3, this.vector), resize(3, this.origin));
      return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
    },
    translate: function translate() {
      var origin = _add.apply(void 0, _toConsumableArray(resize_up(this.origin, get_vector(arguments))));
      return this.constructor(this.vector, origin);
    },
    intersect: function intersect() {
      return _intersect.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    },
    overlap: function overlap() {
      return _overlap.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    },
    bisect: function bisect(lineType, epsilon) {
      var _this = this;
      var line = get_line(lineType);
      return bisect_lines2(this.vector, this.origin, line.vector, line.origin, epsilon).map(function (line) {
        return _this.constructor(line);
      });
    }
  };
  var Line = {
    line: {
      P: Object.prototype,
      A: function A() {
        var l = get_line.apply(void 0, arguments);
        this.vector = Constructors$1.vector(l.vector);
        this.origin = Constructors$1.vector(resize(this.vector.length, l.origin));
        var ud = vector_origin_to_ud({
          vector: this.vector,
          origin: this.origin
        });
        this.u = ud.u;
        this.d = ud.d;
        Object.defineProperty(this, "domain_function", {
          writable: true,
          value: include_l
        });
      },
      G: {
        dimension: function dimension() {
          return [this.vector, this.origin].map(function (p) {
            return p.length;
          }).reduce(function (a, b) {
            return Math.max(a, b);
          }, 0);
        }
      },
      M: Object.assign({}, methods$1$1, {
        inclusive: function inclusive() {
          this.domain_function = include_l;
          return this;
        },
        exclusive: function exclusive() {
          this.domain_function = exclude_l;
          return this;
        },
        clip_function: function clip_function(dist) {
          return dist;
        },
        svgPath: function svgPath() {
          var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20000;
          var start = _add(this.origin, _scale(this.vector, -length / 2));
          var end = _scale(this.vector, length);
          return "M".concat(start[0], " ").concat(start[1], "l").concat(end[0], " ").concat(end[1]);
        }
      }),
      S: Object.assign({
        ud: function ud() {
          return this.constructor(ud_to_vector_origin(arguments[0]));
        }
      }, Static)
    }
  };
  var Ray = {
    ray: {
      P: Object.prototype,
      A: function A() {
        var ray = get_line.apply(void 0, arguments);
        this.vector = Constructors$1.vector(ray.vector);
        this.origin = Constructors$1.vector(resize(this.vector.length, ray.origin));
        Object.defineProperty(this, "domain_function", {
          writable: true,
          value: include_r
        });
      },
      G: {
        dimension: function dimension() {
          return [this.vector, this.origin].map(function (p) {
            return p.length;
          }).reduce(function (a, b) {
            return Math.max(a, b);
          }, 0);
        }
      },
      M: Object.assign({}, methods$1$1, {
        inclusive: function inclusive() {
          this.domain_function = include_r;
          return this;
        },
        exclusive: function exclusive() {
          this.domain_function = exclude_r;
          return this;
        },
        flip: function flip() {
          return Constructors$1.ray(_flip(this.vector), this.origin);
        },
        scale: function scale(_scale2) {
          return Constructors$1.ray(this.vector.scale(_scale2), this.origin);
        },
        normalize: function normalize() {
          return Constructors$1.ray(this.vector.normalize(), this.origin);
        },
        clip_function: ray_limiter,
        svgPath: function svgPath() {
          var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
          var end = this.vector.scale(length);
          return "M".concat(this.origin[0], " ").concat(this.origin[1], "l").concat(end[0], " ").concat(end[1]);
        }
      }),
      S: Static
    }
  };
  var Segment = {
    segment: {
      P: Array.prototype,
      A: function A() {
        var a = get_segment.apply(void 0, arguments);
        this.push.apply(this, _toConsumableArray([a[0], a[1]].map(function (v) {
          return Constructors$1.vector(v);
        })));
        this.vector = Constructors$1.vector(_subtract(this[1], this[0]));
        this.origin = this[0];
        Object.defineProperty(this, "domain_function", {
          writable: true,
          value: include_s
        });
      },
      G: {
        points: function points() {
          return this;
        },
        magnitude: function magnitude() {
          return _magnitude(this.vector);
        },
        dimension: function dimension() {
          return [this.vector, this.origin].map(function (p) {
            return p.length;
          }).reduce(function (a, b) {
            return Math.max(a, b);
          }, 0);
        }
      },
      M: Object.assign({}, methods$1$1, {
        inclusive: function inclusive() {
          this.domain_function = include_s;
          return this;
        },
        exclusive: function exclusive() {
          this.domain_function = exclude_s;
          return this;
        },
        clip_function: segment_limiter,
        transform: function transform() {
          var dim = this.points[0].length;
          for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            innerArgs[_key2] = arguments[_key2];
          }
          var mat = get_matrix_3x4(innerArgs);
          var transformed_points = this.points.map(function (point) {
            return resize(3, point);
          }).map(function (point) {
            return multiply_matrix3_vector3(mat, point);
          }).map(function (point) {
            return resize(dim, point);
          });
          return Constructors$1.segment(transformed_points);
        },
        translate: function translate() {
          var translate = get_vector(arguments);
          var transformed_points = this.points.map(function (point) {
            return _add.apply(void 0, _toConsumableArray(resize_up(point, translate)));
          });
          return Constructors$1.segment(transformed_points);
        },
        midpoint: function midpoint() {
          return Constructors$1.vector(average(this.points[0], this.points[1]));
        },
        svgPath: function svgPath() {
          var pointStrings = this.points.map(function (p) {
            return "".concat(p[0], " ").concat(p[1]);
          });
          return ["M", "L"].map(function (cmd, i) {
            return "".concat(cmd).concat(pointStrings[i]);
          }).join("");
        }
      }),
      S: {
        fromPoints: function fromPoints() {
          return this.constructor.apply(this, arguments);
        }
      }
    }
  };
  var CircleArgs = function CircleArgs() {
    var circle = get_circle.apply(void 0, arguments);
    this.radius = circle.radius;
    this.origin = Constructors$1.vector.apply(Constructors$1, _toConsumableArray(circle.origin));
  };
  var CircleGetters = {
    x: function x() {
      return this.origin[0];
    },
    y: function y() {
      return this.origin[1];
    },
    z: function z() {
      return this.origin[2];
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
      return Constructors$1.vector(nearest_point_on_circle(this.radius, this.origin, get_vector(arguments)));
    },
    intersect: function intersect(object) {
      return _intersect(this, object);
    },
    overlap: function overlap(object) {
      return _overlap(this, object);
    },
    svgPath: function svgPath() {
      var arcStart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var deltaArc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.PI * 2;
      var info = pathInfo(this.origin[0], this.origin[1], this.radius, this.radius, 0, arcStart, deltaArc);
      var arc1 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x2, info.y2);
      var arc2 = ellipticalArcTo(this.radius, this.radius, 0, info.fa, info.fs, info.x3, info.y3);
      return "M".concat(info.x1, " ").concat(info.y1).concat(arc1).concat(arc2);
    },
    points: function points() {
      var _this2 = this;
      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 128;
      return Array.from(Array(count)).map(function (_, i) {
        return 2 * Math.PI / count * i;
      }).map(function (angle) {
        return [_this2.origin[0] + _this2.radius * Math.cos(angle), _this2.origin[1] + _this2.radius * Math.sin(angle)];
      });
    },
    polygon: function polygon() {
      return Constructors$1.polygon(this.points(arguments[0]));
    },
    segments: function segments() {
      var points = this.points(arguments[0]);
      return points.map(function (point, i) {
        var nextI = (i + 1) % points.length;
        return [point, points[nextI]];
      });
    }
  };
  var CircleStatic = {
    fromPoints: function fromPoints() {
      if (arguments.length === 3) {
        var result = circumcircle.apply(void 0, arguments);
        return this.constructor(result.radius, result.origin);
      }
      return this.constructor.apply(this, arguments);
    },
    fromThreePoints: function fromThreePoints() {
      var result = circumcircle.apply(void 0, arguments);
      return this.constructor(result.radius, result.origin);
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
    return [Constructors$1.vector(center[0] + l * trigX, center[1] + l * trigY), Constructors$1.vector(center[0] - l * trigX, center[1] - l * trigY)];
  };
  var Ellipse = {
    ellipse: {
      A: function A() {
        var numbers = flatten_arrays$1(arguments).filter(function (a) {
          return !isNaN(a);
        });
        var params = resize(5, numbers);
        this.rx = params[0];
        this.ry = params[1];
        this.origin = Constructors$1.vector(params[2], params[3]);
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
        svgPath: function svgPath() {
          var arcStart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var deltaArc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Math.PI * 2;
          var info = pathInfo(this.origin[0], this.origin[1], this.rx, this.ry, this.spin, arcStart, deltaArc);
          var arc1 = ellipticalArcTo(this.rx, this.ry, this.spin / Math.PI * 180, info.fa, info.fs, info.x2, info.y2);
          var arc2 = ellipticalArcTo(this.rx, this.ry, this.spin / Math.PI * 180, info.fa, info.fs, info.x3, info.y3);
          return "M".concat(info.x1, " ").concat(info.y1).concat(arc1).concat(arc2);
        },
        points: function points() {
          var _this3 = this;
          var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 128;
          return Array.from(Array(count)).map(function (_, i) {
            return 2 * Math.PI / count * i;
          }).map(function (angle) {
            return pointOnEllipse(_this3.origin.x, _this3.origin.y, _this3.rx, _this3.ry, _this3.spin, angle);
          });
        },
        polygon: function polygon() {
          return Constructors$1.polygon(this.points(arguments[0]));
        },
        segments: function segments() {
          var points = this.points(arguments[0]);
          return points.map(function (point, i) {
            var nextI = (i + 1) % points.length;
            return [point, points[nextI]];
          });
        }
      },
      S: {}
    }
  };
  var methods$6 = {
    area: function area() {
      return signed_area(this);
    },
    centroid: function centroid() {
      return Constructors$1.vector(_centroid(this));
    },
    enclosingRectangle: function enclosingRectangle() {
      return Constructors$1.rect(enclosing_rectangle(this));
    },
    straightSkeleton: function straightSkeleton() {
      return straight_skeleton(this);
    },
    scale: function scale(magnitude) {
      var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _centroid(this);
      var newPoints = this.map(function (p) {
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
      var centerPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _centroid(this);
      var newPoints = this.map(function (p) {
        var vec = [p[0] - centerPoint[0], p[1] - centerPoint[1]];
        var mag = Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
        var a = Math.atan2(vec[1], vec[0]);
        return [centerPoint[0] + Math.cos(a + angle) * mag, centerPoint[1] + Math.sin(a + angle) * mag];
      });
      return Constructors$1.polygon(newPoints);
    },
    translate: function translate() {
      var vec = get_vector.apply(void 0, arguments);
      var newPoints = this.map(function (p) {
        return p.map(function (n, i) {
          return n + vec[i];
        });
      });
      return this.constructor.fromPoints(newPoints);
    },
    transform: function transform() {
      var m = get_matrix_3x4.apply(void 0, arguments);
      var newPoints = this.map(function (p) {
        return multiply_matrix3_vector3(m, resize(3, p));
      });
      return Constructors$1.polygon(newPoints);
    },
    nearest: function nearest() {
      var point = get_vector.apply(void 0, arguments);
      var result = nearest_point_on_polygon(this, point);
      return result === undefined ? undefined : Object.assign(result, {
        edge: this.sides[result.i]
      });
    },
    split: function split() {
      var line = get_line.apply(void 0, arguments);
      var split_func = split_convex_polygon;
      return split_func(this, line.vector, line.origin).map(function (poly) {
        return Constructors$1.polygon(poly);
      });
    },
    overlap: function overlap() {
      return _overlap.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    },
    intersect: function intersect() {
      return _intersect.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    },
    clip: function clip(line_type, epsilon) {
      var fn_line = line_type.domain_function ? line_type.domain_function : include_l;
      var segment = clip_line_in_convex_polygon(this, line_type.vector, line_type.origin, this.domain_function, fn_line, epsilon);
      return segment ? Constructors$1.segment(segment) : undefined;
    },
    svgPath: function svgPath() {
      var pre = Array(this.length).fill("L");
      pre[0] = "M";
      return "".concat(this.map(function (p, i) {
        return "".concat(pre[i]).concat(p[0], " ").concat(p[1]);
      }).join(""), "z");
    }
  };
  var rectToPoints = function rectToPoints(r) {
    return [[r.x, r.y], [r.x + r.width, r.y], [r.x + r.width, r.y + r.height], [r.x, r.y + r.height]];
  };
  var rectToSides = function rectToSides(r) {
    return [[[r.x, r.y], [r.x + r.width, r.y]], [[r.x + r.width, r.y], [r.x + r.width, r.y + r.height]], [[r.x + r.width, r.y + r.height], [r.x, r.y + r.height]], [[r.x, r.y + r.height], [r.x, r.y]]];
  };
  var Rect = {
    rect: {
      P: Array.prototype,
      A: function A() {
        var r = get_rect.apply(void 0, arguments);
        this.width = r.width;
        this.height = r.height;
        this.origin = Constructors$1.vector(r.x, r.y);
        this.push.apply(this, _toConsumableArray(rectToPoints(this)));
        Object.defineProperty(this, "domain_function", {
          writable: true,
          value: include
        });
      },
      G: {
        x: function x() {
          return this.origin[0];
        },
        y: function y() {
          return this.origin[1];
        },
        center: function center() {
          return Constructors$1.vector(this.origin[0] + this.width / 2, this.origin[1] + this.height / 2);
        }
      },
      M: Object.assign({}, methods$6, {
        inclusive: function inclusive() {
          this.domain_function = include;
          return this;
        },
        exclusive: function exclusive() {
          this.domain_function = exclude;
          return this;
        },
        area: function area() {
          return this.width * this.height;
        },
        segments: function segments() {
          return rectToSides(this);
        },
        svgPath: function svgPath() {
          return "M".concat(this.origin.join(" "), "h").concat(this.width, "v").concat(this.height, "h").concat(-this.width, "Z");
        }
      }),
      S: {
        fromPoints: function fromPoints() {
          return Constructors$1.rect(enclosing_rectangle(get_vector_of_vectors(arguments)));
        }
      }
    }
  };
  var Polygon = {
    polygon: {
      P: Array.prototype,
      A: function A() {
        this.push.apply(this, _toConsumableArray(semi_flatten_arrays$1(arguments)));
        this.sides = this.map(function (p, i, arr) {
          return [p, arr[(i + 1) % arr.length]];
        });
        this.vectors = this.sides.map(function (side) {
          return _subtract(side[1], side[0]);
        });
        Object.defineProperty(this, "domain_function", {
          writable: true,
          value: include
        });
      },
      G: {
        isConvex: function isConvex() {
          return true;
        },
        points: function points() {
          return this;
        }
      },
      M: Object.assign({}, methods$6, {
        inclusive: function inclusive() {
          this.domain_function = include;
          return this;
        },
        exclusive: function exclusive() {
          this.domain_function = exclude;
          return this;
        },
        segments: function segments() {
          return this.sides;
        }
      }),
      S: {
        fromPoints: function fromPoints() {
          return this.constructor.apply(this, arguments);
        },
        regularPolygon: function regularPolygon() {
          return this.constructor(make_regular_polygon.apply(void 0, arguments));
        },
        convexHull: function convexHull() {
          return this.constructor(convex_hull.apply(void 0, arguments));
        }
      }
    }
  };
  var assign$2 = function assign(thisMat, mat) {
    for (var i = 0; i < 12; i += 1) {
      thisMat[i] = mat[i];
    }
    return thisMat;
  };
  var Matrix = {
    matrix: {
      P: Array.prototype,
      A: function A() {
        var _this4 = this;
        get_matrix_3x4(arguments).forEach(function (m) {
          return _this4.push(m);
        });
      },
      G: {},
      M: {
        copy: function copy() {
          return Constructors$1.matrix.apply(Constructors$1, _toConsumableArray(Array.from(this)));
        },
        set: function set() {
          return assign$2(this, get_matrix_3x4(arguments));
        },
        isIdentity: function isIdentity() {
          return is_identity3x4(this);
        },
        multiply: function multiply(mat) {
          return assign$2(this, multiply_matrices3(this, mat));
        },
        determinant: function determinant() {
          return determinant3(this);
        },
        inverse: function inverse() {
          return assign$2(this, invert_matrix3(this));
        },
        translate: function translate(x, y, z) {
          return assign$2(this, multiply_matrices3(this, make_matrix3_translate(x, y, z)));
        },
        rotateX: function rotateX(radians) {
          return assign$2(this, multiply_matrices3(this, make_matrix3_rotateX(radians)));
        },
        rotateY: function rotateY(radians) {
          return assign$2(this, multiply_matrices3(this, make_matrix3_rotateY(radians)));
        },
        rotateZ: function rotateZ(radians) {
          return assign$2(this, multiply_matrices3(this, make_matrix3_rotateZ(radians)));
        },
        rotate: function rotate(radians, vector, origin) {
          var transform = make_matrix3_rotate(radians, vector, origin);
          return assign$2(this, multiply_matrices3(this, transform));
        },
        scale: function scale(amount) {
          return assign$2(this, multiply_matrices3(this, make_matrix3_scale(amount)));
        },
        reflectZ: function reflectZ(vector, origin) {
          var transform = make_matrix3_reflectZ(vector, origin);
          return assign$2(this, multiply_matrices3(this, transform));
        },
        transform: function transform() {
          for (var _len3 = arguments.length, innerArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            innerArgs[_key3] = arguments[_key3];
          }
          return Constructors$1.vector(multiply_matrix3_vector3(this, resize(3, get_vector(innerArgs))));
        },
        transformVector: function transformVector(vector) {
          return Constructors$1.vector(multiply_matrix3_vector3(this, resize(3, get_vector(vector))));
        },
        transformLine: function transformLine() {
          for (var _len4 = arguments.length, innerArgs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            innerArgs[_key4] = arguments[_key4];
          }
          var l = get_line(innerArgs);
          return Constructors$1.line(multiply_matrix3_line3(this, l.vector, l.origin));
        }
      },
      S: {}
    }
  };
  var Definitions = Object.assign({}, Vector, Line, Ray, Segment, Circle, Ellipse, Rect, Polygon, Matrix);
  var create = function create(primitiveName, args) {
    var a = Object.create(Definitions[primitiveName].proto);
    Definitions[primitiveName].A.apply(a, args);
    return a;
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
  Object.assign(Constructors$1, {
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
    Constructors$1[primitiveName].prototype = Proto.prototype;
    Constructors$1[primitiveName].prototype.constructor = Constructors$1[primitiveName];
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
      return Object.defineProperty(Constructors$1[primitiveName], key, {
        value: Definitions[primitiveName].S[key].bind(Constructors$1[primitiveName].prototype)
      });
    });
    Definitions[primitiveName].proto = Proto.prototype;
  });
  var math = Constructors$1;
  math.core = Object.assign(Object.create(null), constants, resizers, getters, functions, algebra$1, equal, sort$1, geometry, radial, matrix2, matrix3, nearest$1, parameterize, {
    enclose_convex_polygons_inclusive: enclose_convex_polygons_inclusive,
    intersect_convex_polygon_line: intersect_convex_polygon_line,
    intersect_polygon_polygon: intersect_polygon_polygon,
    intersect_circle_circle: intersect_circle_circle,
    intersect_circle_line: intersect_circle_line,
    intersect_line_line: intersect_line_line,
    overlap_convex_polygons: convex_polygons_overlap,
    overlap_convex_polygon_point: overlap_convex_polygon_point,
    overlap_line_line: overlap_line_line,
    overlap_line_point: overlap_line_point,
    clip_line_in_convex_polygon: clip_line_in_convex_polygon
  });
  math["typeof"] = type_of;
  math.intersect = _intersect;
  math.overlap = _overlap;

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
    return v;
  };
  var setup_edge = function setup_edge(e, i) {
    edge_coords.call(this, e, i);
    return e;
  };
  var setup_face = function setup_face(f, i) {
    face_simple.call(this, f, i);
    face_coords.call(this, f, i);
    return f;
  };
  var setup = {
    vertices: setup_vertex,
    edges: setup_edge,
    faces: setup_face
  };

  var _undefined$1 = "undefined";
  var _boolean$1 = "boolean";
  var _number$1 = "number";
  var _object$1 = "object";
  var _class$1 = "class";
  var _index = "index";
  var _vertices = "vertices";
  var _edges = "edges";
  var _faces = "faces";
  var _boundaries = "boundaries";
  var _vertices_coords = "vertices_coords";
  var _edges_vertices = "edges_vertices";
  var _faces_vertices = "faces_vertices";
  var _faces_edges = "faces_edges";
  var _edges_assignment = "edges_assignment";
  var _edges_foldAngle = "edges_foldAngle";
  var _frame_classes = "frame_classes";
  var _file_classes = "file_classes";
  var _faces_layer = "faces_layer";
  var _boundary = "boundary";
  var _front = "front";
  var _back = "back";
  var _foldedForm = "foldedForm";
  var _black = "black";
  var _white = "white";
  var _none$1 = "none";
  var _stroke_width = "stroke-width";

  var file_spec = 1.1;
  var file_creator = "Rabbit Ear";
  var fold_keys = {
    file: ["file_spec", "file_creator", "file_author", "file_title", "file_description", "file_classes", "file_frames"],
    frame: ["frame_author", "frame_title", "frame_description", "frame_attributes", "frame_classes", "frame_unit", "frame_parent",
    "frame_inherit"
    ],
    graph: ["vertices_coords", "vertices_vertices", "vertices_faces", "edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length", "faces_vertices", "faces_edges",
    "vertices_edges", "edges_edges", "faces_faces"],
    orders: ["edgeOrders", "faceOrders"]
  };
  var keys = Object.freeze([].concat(fold_keys.file).concat(fold_keys.frame).concat(fold_keys.graph).concat(fold_keys.orders));
  var non_spec_keys = Object.freeze(["edges_vector", "vertices_sectors", "faces_sectors", "faces_matrix"]);
  var edges_assignment_values = Array.from("MmVvBbFfUu");

  var singularize = {
    vertices: "vertex",
    edges: "edge",
    faces: "face"
  };
  var edges_assignment_names = {
    b: "boundary",
    m: "mountain",
    v: "valley",
    f: "mark",
    u: "unassigned"
  };
  edges_assignment_values.forEach(function (key) {
    edges_assignment_names[key.toUpperCase()] = edges_assignment_names[key];
  });
  var edges_assignment_to_lowercase = {};
  edges_assignment_values.forEach(function (key) {
    edges_assignment_to_lowercase[key] = key.toLowerCase();
  });
  var edges_assignment_degrees = {
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
  var edge_assignment_to_foldAngle = function edge_assignment_to_foldAngle(assignment) {
    return edges_assignment_degrees[assignment] || 0;
  };
  var edge_foldAngle_to_assignment = function edge_foldAngle_to_assignment(a) {
    if (a > 0) {
      return "V";
    }
    if (a < 0) {
      return "M";
    }
    return "U";
  };
  var filter_keys_with_suffix = function filter_keys_with_suffix(graph, suffix) {
    return Object.keys(graph).map(function (s) {
      return s.substring(s.length - suffix.length, s.length) === suffix ? s : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
  };
  var filter_keys_with_prefix = function filter_keys_with_prefix(graph, prefix) {
    return Object.keys(graph).map(function (str) {
      return str.substring(0, prefix.length) === prefix ? str : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
  };
  var get_graph_keys_with_prefix = function get_graph_keys_with_prefix(graph, key) {
    return filter_keys_with_prefix(graph, "".concat(key, "_"));
  };
  var get_graph_keys_with_suffix = function get_graph_keys_with_suffix(graph, key) {
    return filter_keys_with_suffix(graph, "_".concat(key));
  };
  var transpose_graph_arrays = function transpose_graph_arrays(graph, geometry_key) {
    var matching_keys = get_graph_keys_with_prefix(graph, geometry_key);
    if (matching_keys.length === 0) {
      return [];
    }
    var len = Math.max.apply(Math, _toConsumableArray(matching_keys.map(function (arr) {
      return graph[arr].length;
    })));
    var geometry = Array.from(Array(len)).map(function () {
      return {};
    });
    matching_keys.forEach(function (key) {
      return geometry.forEach(function (o, i) {
        geometry[i][key] = graph[key][i];
      });
    });
    return geometry;
  };
  var transpose_graph_array_at_index = function transpose_graph_array_at_index(graph, geometry_key, index) {
    var matching_keys = get_graph_keys_with_prefix(graph, geometry_key);
    if (matching_keys.length === 0) {
      return undefined;
    }
    var geometry = {};
    matching_keys.forEach(function (key) {
      geometry[key] = graph[key][index];
    });
    return geometry;
  };
  var fold_object_certainty = function fold_object_certainty() {
    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Object.keys(object).length === 0 ? 0 : [].concat(keys, non_spec_keys).filter(function (key) {
      return object[key];
    }).length / Object.keys(object).length;
  };

  var fold_object = /*#__PURE__*/Object.freeze({
    __proto__: null,
    singularize: singularize,
    edges_assignment_names: edges_assignment_names,
    edges_assignment_to_lowercase: edges_assignment_to_lowercase,
    edges_assignment_degrees: edges_assignment_degrees,
    edge_assignment_to_foldAngle: edge_assignment_to_foldAngle,
    edge_foldAngle_to_assignment: edge_foldAngle_to_assignment,
    filter_keys_with_suffix: filter_keys_with_suffix,
    filter_keys_with_prefix: filter_keys_with_prefix,
    get_graph_keys_with_prefix: get_graph_keys_with_prefix,
    get_graph_keys_with_suffix: get_graph_keys_with_suffix,
    transpose_graph_arrays: transpose_graph_arrays,
    transpose_graph_array_at_index: transpose_graph_array_at_index,
    fold_object_certainty: fold_object_certainty
  });

  var max_arrays_length = function max_arrays_length() {
    for (var _len = arguments.length, arrays = new Array(_len), _key = 0; _key < _len; _key++) {
      arrays[_key] = arguments[_key];
    }
    return Math.max.apply(Math, [0].concat(_toConsumableArray(arrays.filter(function (el) {
      return el !== undefined;
    }).map(function (el) {
      return el.length;
    }))));
  };
  var count = function count(graph, key) {
    return max_arrays_length.apply(void 0, _toConsumableArray(get_graph_keys_with_prefix(graph, key).map(function (key) {
      return graph[key];
    })));
  };
  count.vertices = function (_ref) {
    var vertices_coords = _ref.vertices_coords,
        vertices_faces = _ref.vertices_faces,
        vertices_vertices = _ref.vertices_vertices;
    return max_arrays_length(vertices_coords, vertices_faces, vertices_vertices);
  };
  count.edges = function (_ref2) {
    var edges_vertices = _ref2.edges_vertices,
        edges_edges = _ref2.edges_edges,
        edges_faces = _ref2.edges_faces;
    return max_arrays_length(edges_vertices, edges_edges, edges_faces);
  };
  count.faces = function (_ref3) {
    var faces_vertices = _ref3.faces_vertices,
        faces_edges = _ref3.faces_edges,
        faces_faces = _ref3.faces_faces;
    return max_arrays_length(faces_vertices, faces_edges, faces_faces);
  };

  var fn_and = function fn_and(a, b) {
    return a && b;
  };
  var fn_cat = function fn_cat(a, b) {
    return a.concat(b);
  };
  var fn_def = function fn_def(a) {
    return a !== undefined;
  };
  var fn_add = function fn_add(a, b) {
    return a + b;
  };

  var unique_sorted_integers = function unique_sorted_integers(array) {
    var keys = {};
    array.forEach(function (_int) {
      keys[_int] = true;
    });
    return Object.keys(keys).map(function (n) {
      return parseInt(n);
    }).sort(function (a, b) {
      return a - b;
    });
  };
  var split_circular_array = function split_circular_array(array, indices) {
    indices.sort(function (a, b) {
      return a - b;
    });
    return [array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)), array.slice(indices[0], indices[1] + 1)];
  };
  var get_longest_array = function get_longest_array(arrays) {
    if (arrays.length === 1) {
      return arrays[0];
    }
    var lengths = arrays.map(function (arr) {
      return arr.length;
    });
    var max = 0;
    for (var i = 0; i < arrays.length; i++) {
      if (lengths[i] > lengths[max]) {
        max = i;
      }
    }
    return arrays[max];
  };
  var remove_single_instances = function remove_single_instances(array) {
    var count = {};
    array.forEach(function (n) {
      if (count[n] === undefined) {
        count[n] = 0;
      }
      count[n]++;
    });
    return array.filter(function (n) {
      return count[n] > 1;
    });
  };
  var boolean_matrix_to_indexed_array = function boolean_matrix_to_indexed_array(matrix) {
    return matrix.map(function (row) {
      return row.map(function (value, i) {
        return value === true ? i : undefined;
      }).filter(fn_def);
    });
  };
  var boolean_matrix_to_unique_index_pairs = function boolean_matrix_to_unique_index_pairs(matrix) {
    var pairs = [];
    for (var i = 0; i < matrix.length - 1; i++) {
      for (var j = i + 1; j < matrix.length; j++) {
        if (matrix[i][j]) {
          pairs.push([i, j]);
        }
      }
    }
    return pairs;
  };
  var make_unique_sets_from_self_relational_arrays = function make_unique_sets_from_self_relational_arrays(matrix) {
    var groups = [];
    var recurse = function recurse(index, current_group) {
      if (groups[index] !== undefined) {
        return 0;
      }
      groups[index] = current_group;
      matrix[index].forEach(function (i) {
        return recurse(i, current_group);
      });
      return 1;
    };
    for (var row = 0, group = 0; row < matrix.length; row++) {
      if (!(row in matrix)) {
        continue;
      }
      group += recurse(row, group);
    }
    return groups;
  };
  var make_triangle_pairs = function make_triangle_pairs(array) {
    var pairs = Array(array.length * (array.length - 1) / 2);
    var index = 0;
    for (var i = 0; i < array.length - 1; i++) {
      for (var j = i + 1; j < array.length; j++, index++) {
        pairs[index] = [array[i], array[j]];
      }
    }
    return pairs;
  };
  var circular_array_valid_ranges = function circular_array_valid_ranges(array) {
    var not_undefineds = array.map(function (el) {
      return el !== undefined;
    });
    if (not_undefineds.reduce(function (a, b) {
      return a && b;
    }, true)) {
      return [[0, array.length - 1]];
    }
    var first_not_undefined = not_undefineds.map(function (el, i, arr) {
      return el && !arr[(i - 1 + arr.length) % arr.length];
    });
    var total = first_not_undefined.reduce(function (a, b) {
      return a + (b ? 1 : 0);
    }, 0);
    var starts = Array(total);
    var counts = Array(total).fill(0);
    var index = not_undefineds[0] && not_undefineds[array.length - 1] ? 0 : total - 1;
    not_undefineds.forEach(function (el, i) {
      index = (index + (first_not_undefined[i] ? 1 : 0)) % counts.length;
      counts[index] += not_undefineds[i] ? 1 : 0;
      if (first_not_undefined[i]) {
        starts[index] = i;
      }
    });
    return starts.map(function (s, i) {
      return [s, (s + counts[i] - 1) % array.length];
    });
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

  var remove_geometry_indices = function remove_geometry_indices(graph, key, removeIndices) {
    var geometry_array_size = count(graph, key);
    var removes = unique_sorted_integers(removeIndices);
    var index_map = [];
    var i, j, walk;
    for (i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
      while (i === removes[walk]) {
        index_map[i] = undefined;
        i += 1;
        walk += 1;
      }
      if (i < geometry_array_size) {
        index_map[i] = j;
      }
    }
    get_graph_keys_with_suffix(graph, key).forEach(function (sKey) {
      return graph[sKey].forEach(function (_, i) {
        return graph[sKey][i].forEach(function (v, j) {
          graph[sKey][i][j] = index_map[v];
        });
      });
    });
    removes.reverse();
    get_graph_keys_with_prefix(graph, key).forEach(function (prefix_key) {
      return removes.forEach(function (index) {
        return graph[prefix_key].splice(index, 1);
      });
    });
    return index_map;
  };

  var get_edge_isolated_vertices = function get_edge_isolated_vertices(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices;
    var count = vertices_coords.length;
    var seen = Array(count).fill(false);
    edges_vertices.forEach(function (ev) {
      ev.filter(function (v) {
        return !seen[v];
      }).forEach(function (v) {
        seen[v] = true;
        count -= 1;
      });
    });
    return seen.map(function (s, i) {
      return s ? undefined : i;
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var get_face_isolated_vertices = function get_face_isolated_vertices(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        faces_vertices = _ref2.faces_vertices;
    var count = vertices_coords.length;
    var seen = Array(count).fill(false);
    faces_vertices.forEach(function (fv) {
      fv.filter(function (v) {
        return !seen[v];
      }).forEach(function (v) {
        seen[v] = true;
        count -= 1;
      });
    });
    return seen.map(function (s, i) {
      return s ? undefined : i;
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var get_isolated_vertices = function get_isolated_vertices(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        edges_vertices = _ref3.edges_vertices,
        faces_vertices = _ref3.faces_vertices;
    var count = vertices_coords.length;
    var seen = Array(count).fill(false);
    if (edges_vertices) {
      edges_vertices.forEach(function (ev) {
        ev.filter(function (v) {
          return !seen[v];
        }).forEach(function (v) {
          seen[v] = true;
          count -= 1;
        });
      });
    }
    if (faces_vertices) {
      faces_vertices.forEach(function (fv) {
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

  var vertices_isolated = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get_edge_isolated_vertices: get_edge_isolated_vertices,
    get_face_isolated_vertices: get_face_isolated_vertices,
    get_isolated_vertices: get_isolated_vertices
  });

  var get_circular_edges = function get_circular_edges(_ref) {
    var edges_vertices = _ref.edges_vertices;
    var circular = [];
    for (var i = 0; i < edges_vertices.length; i += 1) {
      if (edges_vertices[i][0] === edges_vertices[i][1]) {
        circular.push(i);
      }
    }
    return circular;
  };

  var get_duplicate_edges = function get_duplicate_edges(_ref) {
    var edges_vertices = _ref.edges_vertices;
    if (!edges_vertices) {
      return [];
    }
    var duplicates = [];
    var map = {};
    for (var i = 0; i < edges_vertices.length; i += 1) {
      var a = "".concat(edges_vertices[i][0], " ").concat(edges_vertices[i][1]);
      var b = "".concat(edges_vertices[i][1], " ").concat(edges_vertices[i][0]);
      if (map[a] !== undefined) {
        duplicates[i] = map[a];
      } else {
        map[a] = i;
        map[b] = i;
      }
    }
    return duplicates;
  };

  var are_vertices_equivalent = function are_vertices_equivalent(a, b) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.core.EPSILON;
    var degree = a.length;
    for (var i = 0; i < degree; i += 1) {
      if (Math.abs(a[i] - b[i]) > epsilon) {
        return false;
      }
    }
    return true;
  };
  var get_duplicate_vertices = function get_duplicate_vertices(_ref) {
    var vertices_coords = _ref.vertices_coords;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var equivalent_matrix = vertices_coords.map(function () {
      return [];
    });
    for (var i = 0; i < vertices_coords.length - 1; i += 1) {
      for (var j = i + 1; j < vertices_coords.length; j += 1) {
        equivalent_matrix[i][j] = are_vertices_equivalent(vertices_coords[i], vertices_coords[j], epsilon);
      }
    }
    var vertices_equivalent = equivalent_matrix.map(function (equiv) {
      return equiv.map(function (el, j) {
        return el ? j : undefined;
      }).filter(function (a) {
        return a !== undefined;
      });
    });
    var clusters = [];
    var visited = Array(vertices_coords.length).fill(false);
    var visitedCount = 0;
    var recurse = function recurse(cluster_index, i) {
      if (visited[i] || visitedCount === vertices_coords.length) {
        return;
      }
      visited[i] = true;
      visitedCount += 1;
      if (!clusters[cluster_index]) {
        clusters[cluster_index] = [];
      }
      clusters[cluster_index].push(i);
      while (vertices_equivalent[i].length > 0) {
        recurse(cluster_index, vertices_equivalent[i][0]);
        vertices_equivalent[i].splice(0, 1);
      }
    };
    for (var _i = 0; _i < vertices_coords.length; _i += 1) {
      recurse(_i, _i);
      if (visitedCount === vertices_coords.length) {
        break;
      }
    }
    return clusters.filter(function (a) {
      return a.length;
    });
  };

  var remove_isolated_vertices = function remove_isolated_vertices(graph) {
    var remove_indices = get_isolated_vertices(graph);
    return {
      map: remove_geometry_indices(graph, _vertices, remove_indices),
      remove: remove_indices
    };
  };
  var remove_circular_edges = function remove_circular_edges(graph) {
    var remove_indices = get_circular_edges(graph);
    if (remove_indices.length) {
      var quick_lookup = {};
      remove_indices.forEach(function (n) {
        quick_lookup[n] = true;
      });
      get_graph_keys_with_suffix(graph, _edges).forEach(function (sKey) {
        return graph[sKey]
        .forEach(function (elem, i) {
          for (var j = elem.length - 1; j >= 0; j -= 1) {
            if (quick_lookup[elem[j]] === true) {
              graph[sKey][i].splice(j, 1);
            }
          }
        });
      });
    }
    return {
      map: remove_geometry_indices(graph, _edges, remove_indices),
      remove: remove_indices
    };
  };
  var remove_duplicate_edges = function remove_duplicate_edges(graph) {
    var duplicates = get_duplicate_edges(graph);
    var remove_indices = Object.keys(duplicates);
    var map = remove_geometry_indices(graph, _edges, remove_indices);
    duplicates.forEach(function (v, i) {
      map[i] = v;
    });
    return {
      map: map,
      remove: remove_indices
    };
  };
  var remove_duplicate_vertices = function remove_duplicate_vertices(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var clusters = get_duplicate_vertices(graph, epsilon);
    var map = [];
    clusters.forEach(function (verts, i) {
      return verts.forEach(function (v) {
        map[v] = i;
      });
    });
    graph.vertices_coords = clusters.map(function (arr) {
      return arr.map(function (i) {
        return graph.vertices_coords[i];
      });
    }).map(function (arr) {
      var _math$core;
      return (_math$core = math.core).average.apply(_math$core, _toConsumableArray(arr));
    });
    get_graph_keys_with_suffix(graph, _vertices).forEach(function (sKey) {
      return graph[sKey].forEach(function (_, i) {
        return graph[sKey][i].forEach(function (v, j) {
          graph[sKey][i][j] = map[v];
        });
      });
    });
    get_graph_keys_with_prefix(graph, _vertices).filter(function (a) {
      return a !== _vertices_coords;
    }).forEach(function (key) {
      return delete graph[key];
    });
    var remove_indices = clusters.map(function (cluster) {
      return cluster.length > 1 ? cluster.slice(1, cluster.length) : undefined;
    }).filter(function (a) {
      return a !== undefined;
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    return {
      map: map,
      remove: remove_indices
    };
  };

  var remove_methods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    remove_isolated_vertices: remove_isolated_vertices,
    remove_circular_edges: remove_circular_edges,
    remove_duplicate_edges: remove_duplicate_edges,
    remove_duplicate_vertices: remove_duplicate_vertices
  });

  var clean = function clean(graph) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (_typeof(options) !== "object" || options.edges !== false) {
      remove_circular_edges(graph);
      remove_duplicate_edges(graph);
    }
    if (_typeof(options) === "object" && options.vertices === true) {
      remove_isolated_vertices(graph);
    }
    return graph;
  };

  var array_in_array_max_number = function array_in_array_max_number(arrays) {
    var max = -1;
    arrays.filter(function (a) {
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
    return max;
  };
  var max_num_in_orders = function max_num_in_orders(array) {
    var max = -1;
    array.forEach(function (el) {
      if (el[0] > max) {
        max = el[0];
      }
      if (el[1] > max) {
        max = el[1];
      }
    });
    return max;
  };
  var ordersArrayNames = {
    edges: "edgeOrders",
    faces: "faceOrders"
  };
  var implied_count = function implied_count(graph, key) {
    return Math.max(
    array_in_array_max_number(get_graph_keys_with_suffix(graph, key).map(function (str) {
      return graph[str];
    })),
    graph[ordersArrayNames[key]] ? max_num_in_orders(graph[ordersArrayNames[key]]) : -1) + 1;
  };
  implied_count.vertices = function (graph) {
    return implied_count(graph, _vertices);
  };
  implied_count.edges = function (graph) {
    return implied_count(graph, _edges);
  };
  implied_count.faces = function (graph) {
    return implied_count(graph, _faces);
  };

  var counter_clockwise_walk = function counter_clockwise_walk(_ref, v0, v1) {
    var vertices_vertices = _ref.vertices_vertices,
        vertices_sectors = _ref.vertices_sectors;
    var walked_edges = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var this_walked_edges = {};
    var face = {
      vertices: [v0],
      edges: [],
      angles: []
    };
    var prev_vertex = v0;
    var this_vertex = v1;
    while (true) {
      var v_v = vertices_vertices[this_vertex];
      var from_neighbor_i = v_v.indexOf(prev_vertex);
      var next_neighbor_i = (from_neighbor_i + v_v.length - 1) % v_v.length;
      var next_vertex = v_v[next_neighbor_i];
      var next_edge_vertices = "".concat(this_vertex, " ").concat(next_vertex);
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
      face.angles.push(vertices_sectors[this_vertex][next_neighbor_i]);
      prev_vertex = this_vertex;
      this_vertex = next_vertex;
    }
  };
  var planar_vertex_walk = function planar_vertex_walk(_ref2) {
    var vertices_vertices = _ref2.vertices_vertices,
        vertices_sectors = _ref2.vertices_sectors;
    var graph = {
      vertices_vertices: vertices_vertices,
      vertices_sectors: vertices_sectors
    };
    var walked_edges = {};
    return vertices_vertices.map(function (adj_verts, v) {
      return adj_verts.map(function (adj_vert) {
        return counter_clockwise_walk(graph, v, adj_vert, walked_edges);
      }).filter(function (a) {
        return a !== undefined;
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
  };

  var walk = /*#__PURE__*/Object.freeze({
    __proto__: null,
    planar_vertex_walk: planar_vertex_walk
  });

  var sort_vertices_counter_clockwise = function sort_vertices_counter_clockwise(_ref, vertices, vertex) {
    var vertices_coords = _ref.vertices_coords;
    return vertices.map(function (v) {
      return vertices_coords[v];
    }).map(function (coord) {
      return math.core.subtract(coord, vertices_coords[vertex]);
    }).map(function (vec) {
      return Math.atan2(vec[1], vec[0]);
    })
    .map(function (angle) {
      return angle > -math.core.EPSILON ? angle : angle + Math.PI * 2;
    }).map(function (a, i) {
      return {
        a: a,
        i: i
      };
    }).sort(function (a, b) {
      return a.a - b.a;
    }).map(function (el) {
      return el.i;
    }).map(function (i) {
      return vertices[i];
    });
  };
  var sort_vertices_along_vector = function sort_vertices_along_vector(_ref2, vertices, vector) {
    var vertices_coords = _ref2.vertices_coords;
    return vertices.map(function (i) {
      return {
        i: i,
        d: math.core.dot(vertices_coords[i], vector)
      };
    }).sort(function (a, b) {
      return a.d - b.d;
    }).map(function (a) {
      return a.i;
    });
  };

  var sort = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sort_vertices_counter_clockwise: sort_vertices_counter_clockwise,
    sort_vertices_along_vector: sort_vertices_along_vector
  });

  var make_vertices_edges$1 = function make_vertices_edges(_ref) {
    var edges_vertices = _ref.edges_vertices;
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
  var make_vertices_edges_sorted = function make_vertices_edges_sorted(_ref2) {
    var edges_vertices = _ref2.edges_vertices,
        vertices_vertices = _ref2.vertices_vertices;
    var edge_map = make_vertices_to_edge_bidirectional({
      edges_vertices: edges_vertices
    });
    return vertices_vertices.map(function (verts, i) {
      return verts.map(function (v) {
        return edge_map["".concat(i, " ").concat(v)];
      });
    });
  };
  var make_vertices_vertices = function make_vertices_vertices(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        vertices_edges = _ref3.vertices_edges,
        edges_vertices = _ref3.edges_vertices;
    if (!vertices_edges) {
      vertices_edges = make_vertices_edges$1({
        edges_vertices: edges_vertices
      });
    }
    var vertices_vertices = vertices_edges.map(function (edges, v) {
      return edges
      .map(function (edge) {
        return edges_vertices[edge].filter(function (i) {
          return i !== v;
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
    });
    return vertices_coords === undefined ? vertices_vertices : vertices_vertices.map(function (verts, i) {
      return sort_vertices_counter_clockwise({
        vertices_coords: vertices_coords
      }, verts, i);
    });
  };
  var make_vertices_faces_simple = function make_vertices_faces_simple(_ref4) {
    var faces_vertices = _ref4.faces_vertices;
    var vertices_faces = Array.from(Array(implied_count.vertices({
      faces_vertices: faces_vertices
    }))).map(function () {
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
  var make_vertices_faces = function make_vertices_faces(_ref5) {
    var vertices_vertices = _ref5.vertices_vertices,
        faces_vertices = _ref5.faces_vertices;
    if (!vertices_vertices) {
      return make_vertices_faces_simple({
        faces_vertices: faces_vertices
      });
    }
    var face_map = make_vertices_to_face({
      faces_vertices: faces_vertices
    });
    return vertices_vertices.map(function (verts, v) {
      return verts.map(function (vert, i, arr) {
        return [arr[(i + 1) % arr.length], v, vert].join(" ");
      });
    }).map(function (keys) {
      return keys.map(function (key) {
        return face_map[key];
      });
    });
  };
  var make_vertices_to_edge_bidirectional = function make_vertices_to_edge_bidirectional(_ref6) {
    var edges_vertices = _ref6.edges_vertices;
    var map = {};
    edges_vertices.map(function (ev) {
      return ev.join(" ");
    }).forEach(function (key, i) {
      map[key] = i;
    });
    edges_vertices.map(function (ev) {
      return "".concat(ev[1], " ").concat(ev[0]);
    }).forEach(function (key, i) {
      map[key] = i;
    });
    return map;
  };
  var make_vertices_to_edge = function make_vertices_to_edge(_ref7) {
    var edges_vertices = _ref7.edges_vertices;
    var map = {};
    edges_vertices.map(function (ev) {
      return ev.join(" ");
    }).forEach(function (key, i) {
      map[key] = i;
    });
    return map;
  };
  var make_vertices_to_face = function make_vertices_to_face(_ref8) {
    var faces_vertices = _ref8.faces_vertices;
    var map = {};
    faces_vertices.forEach(function (face, f) {
      return face.map(function (_, i) {
        return [0, 1, 2].map(function (j) {
          return (i + j) % face.length;
        }).map(function (i) {
          return face[i];
        }).join(" ");
      }).forEach(function (key) {
        map[key] = f;
      });
    });
    return map;
  };
  var make_vertices_vertices_vector = function make_vertices_vertices_vector(_ref9) {
    var vertices_coords = _ref9.vertices_coords,
        vertices_vertices = _ref9.vertices_vertices,
        edges_vertices = _ref9.edges_vertices,
        edges_vector = _ref9.edges_vector;
    if (!edges_vector) {
      edges_vector = make_edges_vector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var edge_map = make_vertices_to_edge({
      edges_vertices: edges_vertices
    });
    return vertices_vertices.map(function (_, a) {
      return vertices_vertices[a].map(function (b) {
        var edge_a = edge_map["".concat(a, " ").concat(b)];
        var edge_b = edge_map["".concat(b, " ").concat(a)];
        if (edge_a !== undefined) {
          return edges_vector[edge_a];
        }
        if (edge_b !== undefined) {
          return math.core.flip(edges_vector[edge_b]);
        }
      });
    });
  };
  var make_vertices_sectors = function make_vertices_sectors(_ref10) {
    var vertices_coords = _ref10.vertices_coords,
        vertices_vertices = _ref10.vertices_vertices,
        edges_vertices = _ref10.edges_vertices,
        edges_vector = _ref10.edges_vector;
    return make_vertices_vertices_vector({
      vertices_coords: vertices_coords,
      vertices_vertices: vertices_vertices,
      edges_vertices: edges_vertices,
      edges_vector: edges_vector
    }).map(function (vectors) {
      return vectors.length === 1
      ? [math.core.TWO_PI]
      : math.core.counter_clockwise_sectors2(vectors);
    });
  };
  var make_edges_edges = function make_edges_edges(_ref11) {
    var edges_vertices = _ref11.edges_vertices,
        vertices_edges = _ref11.vertices_edges;
    return edges_vertices.map(function (verts, i) {
      var side0 = vertices_edges[verts[0]].filter(function (e) {
        return e !== i;
      });
      var side1 = vertices_edges[verts[1]].filter(function (e) {
        return e !== i;
      });
      return side0.concat(side1);
    });
  };
  var make_edges_faces_simple = function make_edges_faces_simple(_ref12) {
    var faces_edges = _ref12.faces_edges;
    var edges_faces = Array.from(Array(implied_count.edges({
      faces_edges: faces_edges
    }))).map(function () {
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
  var make_edges_faces = function make_edges_faces(_ref13) {
    var edges_vertices = _ref13.edges_vertices,
        faces_edges = _ref13.faces_edges;
    if (!edges_vertices) {
      return make_edges_faces_simple({
        faces_edges: faces_edges
      });
    }
    var edges_faces = edges_vertices.map(function (ev) {
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
  var assignment_angles = {
    M: -180,
    m: -180,
    V: 180,
    v: 180
  };
  var make_edges_foldAngle = function make_edges_foldAngle(_ref14) {
    var edges_assignment = _ref14.edges_assignment;
    return edges_assignment.map(function (a) {
      return assignment_angles[a] || 0;
    });
  };
  var make_edges_assignment = function make_edges_assignment(_ref15) {
    var edges_foldAngle = _ref15.edges_foldAngle;
    return edges_foldAngle.map(function (a) {
      if (a === 0) {
        return "F";
      }
      return a < 0 ? "M" : "V";
    });
  };
  var make_edges_coords = function make_edges_coords(_ref16) {
    var vertices_coords = _ref16.vertices_coords,
        edges_vertices = _ref16.edges_vertices;
    return edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    });
  };
  var make_edges_vector = function make_edges_vector(_ref17) {
    var vertices_coords = _ref17.vertices_coords,
        edges_vertices = _ref17.edges_vertices;
    return make_edges_coords({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices
    }).map(function (verts) {
      return math.core.subtract(verts[1], verts[0]);
    });
  };
  var make_edges_length = function make_edges_length(_ref18) {
    var vertices_coords = _ref18.vertices_coords,
        edges_vertices = _ref18.edges_vertices;
    return make_edges_vector({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices
    }).map(function (vec) {
      return math.core.magnitude(vec);
    });
  };
  var make_edges_coords_min_max = function make_edges_coords_min_max(_ref19) {
    var vertices_coords = _ref19.vertices_coords,
        edges_vertices = _ref19.edges_vertices,
        edges_coords = _ref19.edges_coords;
    if (!edges_coords) {
      edges_coords = make_edges_coords({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    return edges_coords.map(function (coords) {
      var mins = coords[0].map(function () {
        return Infinity;
      });
      var maxs = coords[0].map(function () {
        return -Infinity;
      });
      coords.forEach(function (coord) {
        return coord.forEach(function (n, i) {
          if (n < mins[i]) {
            mins[i] = n;
          }
          if (n > maxs[i]) {
            maxs[i] = n;
          }
        });
      });
      return [mins, maxs];
    });
  };
  var make_edges_coords_min_max_exclusive = function make_edges_coords_min_max_exclusive(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var ep = [+epsilon, -epsilon];
    return make_edges_coords_min_max(graph).map(function (min_max) {
      return min_max.map(function (vec, i) {
        return vec.map(function (n) {
          return n + ep[i];
        });
      });
    });
  };
  var make_edges_coords_min_max_inclusive = function make_edges_coords_min_max_inclusive(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var ep = [-epsilon, +epsilon];
    return make_edges_coords_min_max(graph).map(function (min_max) {
      return min_max.map(function (vec, i) {
        return vec.map(function (n) {
          return n + ep[i];
        });
      });
    });
  };
  var make_planar_faces = function make_planar_faces(_ref20) {
    var vertices_coords = _ref20.vertices_coords,
        vertices_vertices = _ref20.vertices_vertices,
        vertices_edges = _ref20.vertices_edges,
        vertices_sectors = _ref20.vertices_sectors,
        edges_vertices = _ref20.edges_vertices,
        edges_vector = _ref20.edges_vector;
    if (!vertices_vertices) {
      vertices_vertices = make_vertices_vertices({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices,
        vertices_edges: vertices_edges
      });
    }
    if (!vertices_sectors) {
      vertices_sectors = make_vertices_sectors({
        vertices_coords: vertices_coords,
        vertices_vertices: vertices_vertices,
        edges_vertices: edges_vertices,
        edges_vector: edges_vector
      });
    }
    var vertices_edges_map = make_vertices_to_edge_bidirectional({
      edges_vertices: edges_vertices
    });
    return planar_vertex_walk({
      vertices_vertices: vertices_vertices,
      vertices_sectors: vertices_sectors
    }).map(function (f) {
      return _objectSpread2(_objectSpread2({}, f), {}, {
        edges: f.edges.map(function (e) {
          return vertices_edges_map[e];
        })
      });
    }).filter(function (face) {
      return face.angles.map(function (a) {
        return Math.PI - a;
      }).reduce(function (a, b) {
        return a + b;
      }, 0) > 0;
    });
  };
  var make_planar_faces_vertices = function make_planar_faces_vertices(graph) {
    return make_planar_faces(graph).map(function (face) {
      return face.vertices;
    });
  };
  var make_planar_faces_edges = function make_planar_faces_edges(graph) {
    return make_planar_faces(graph).map(function (face) {
      return face.edges;
    });
  };
  var make_faces_vertices_from_edges = function make_faces_vertices_from_edges(graph) {
    return graph.faces_edges.map(function (edges) {
      return edges.map(function (edge) {
        return graph.edges_vertices[edge];
      }).map(function (pairs, i, arr) {
        var next = arr[(i + 1) % arr.length];
        return pairs[0] === next[0] || pairs[0] === next[1] ? pairs[1] : pairs[0];
      });
    });
  };
  var make_faces_edges_from_vertices = function make_faces_edges_from_vertices(graph) {
    var map = make_vertices_to_edge_bidirectional(graph);
    return graph.faces_vertices.map(function (face) {
      return face.map(function (v, i, arr) {
        return [v, arr[(i + 1) % arr.length]].join(" ");
      });
    }).map(function (face) {
      return face.map(function (pair) {
        return map[pair];
      });
    });
  };
  var make_faces_faces = function make_faces_faces(_ref22) {
    var faces_vertices = _ref22.faces_vertices;
    var faces_faces = faces_vertices.map(function () {
      return [];
    });
    var edgeMap = {};
    faces_vertices.forEach(function (vertices_index, idx1) {
      var n = vertices_index.length;
      vertices_index.forEach(function (v1, i, vs) {
        var v2 = vs[(i + 1) % n];
        if (v2 < v1) {
          var _ref23 = [v2, v1];
          v1 = _ref23[0];
          v2 = _ref23[1];
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
  var make_faces_center = function make_faces_center(_ref24) {
    var vertices_coords = _ref24.vertices_coords,
        faces_vertices = _ref24.faces_vertices;
    return faces_vertices.map(function (fv) {
      return fv.map(function (v) {
        return vertices_coords[v];
      });
    }).map(function (coords) {
      return math.core.centroid(coords);
    });
  };
  var make_faces_center_quick = function make_faces_center_quick(_ref25) {
    var vertices_coords = _ref25.vertices_coords,
        faces_vertices = _ref25.faces_vertices;
    return faces_vertices.map(function (vertices) {
      return vertices.map(function (v) {
        return vertices_coords[v];
      }).reduce(function (a, b) {
        return [a[0] + b[0], a[1] + b[1]];
      }, [0, 0]).map(function (el) {
        return el / vertices.length;
      });
    });
  };

  var make = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_vertices_edges: make_vertices_edges$1,
    make_vertices_edges_sorted: make_vertices_edges_sorted,
    make_vertices_vertices: make_vertices_vertices,
    make_vertices_faces_simple: make_vertices_faces_simple,
    make_vertices_faces: make_vertices_faces,
    make_vertices_to_edge_bidirectional: make_vertices_to_edge_bidirectional,
    make_vertices_to_edge: make_vertices_to_edge,
    make_vertices_to_face: make_vertices_to_face,
    make_vertices_vertices_vector: make_vertices_vertices_vector,
    make_vertices_sectors: make_vertices_sectors,
    make_edges_edges: make_edges_edges,
    make_edges_faces_simple: make_edges_faces_simple,
    make_edges_faces: make_edges_faces,
    make_edges_foldAngle: make_edges_foldAngle,
    make_edges_assignment: make_edges_assignment,
    make_edges_coords: make_edges_coords,
    make_edges_vector: make_edges_vector,
    make_edges_length: make_edges_length,
    make_edges_coords_min_max: make_edges_coords_min_max,
    make_edges_coords_min_max_exclusive: make_edges_coords_min_max_exclusive,
    make_edges_coords_min_max_inclusive: make_edges_coords_min_max_inclusive,
    make_planar_faces: make_planar_faces,
    make_planar_faces_vertices: make_planar_faces_vertices,
    make_planar_faces_edges: make_planar_faces_edges,
    make_faces_vertices_from_edges: make_faces_vertices_from_edges,
    make_faces_edges_from_vertices: make_faces_edges_from_vertices,
    make_faces_faces: make_faces_faces,
    make_faces_center: make_faces_center,
    make_faces_center_quick: make_faces_center_quick
  });

  var build_assignments_if_needed = function build_assignments_if_needed(graph) {
    var len = graph.edges_vertices.length;
    if (!graph.edges_assignment) {
      graph.edges_assignment = [];
    }
    if (!graph.edges_foldAngle) {
      graph.edges_foldAngle = [];
    }
    if (graph.edges_assignment.length > graph.edges_foldAngle.length) {
      for (var i = graph.edges_foldAngle.length; i < graph.edges_assignment.length; i += 1) {
        graph.edges_foldAngle[i] = edge_assignment_to_foldAngle(graph.edges_assignment[i]);
      }
    }
    if (graph.edges_foldAngle.length > graph.edges_assignment.length) {
      for (var _i = graph.edges_assignment.length; _i < graph.edges_foldAngle.length; _i += 1) {
        graph.edges_assignment[_i] = edge_foldAngle_to_assignment(graph.edges_foldAngle[_i]);
      }
    }
    for (var _i2 = graph.edges_assignment.length; _i2 < len; _i2 += 1) {
      graph.edges_assignment[_i2] = "U";
      graph.edges_foldAngle[_i2] = 0;
    }
  };
  var build_faces_if_needed = function build_faces_if_needed(graph, reface) {
    if (reface === undefined && !graph.faces_vertices && !graph.faces_edges) {
      reface = true;
    }
    if (reface && graph.vertices_coords) {
      var faces = make_planar_faces(graph);
      graph.faces_vertices = faces.map(function (face) {
        return face.vertices;
      });
      graph.faces_edges = faces.map(function (face) {
        return face.edges;
      });
      return;
    }
    if (graph.faces_vertices && graph.faces_edges) {
      return;
    }
    if (graph.faces_vertices && !graph.faces_edges) {
      graph.faces_edges = make_faces_edges_from_vertices(graph);
    } else if (graph.faces_edges && !graph.faces_vertices) {
      graph.faces_vertices = make_faces_vertices_from_edges(graph);
    } else {
      graph.faces_vertices = [];
      graph.faces_edges = [];
    }
  };
  var populate = function populate(graph, reface) {
    if (_typeof(graph) !== "object") {
      return graph;
    }
    if (!graph.edges_vertices) {
      return graph;
    }
    graph.vertices_edges = make_vertices_edges$1(graph);
    graph.vertices_vertices = make_vertices_vertices(graph);
    graph.vertices_edges = make_vertices_edges_sorted(graph);
    build_assignments_if_needed(graph);
    build_faces_if_needed(graph, reface);
    graph.vertices_faces = make_vertices_faces(graph);
    graph.edges_faces = make_edges_faces(graph);
    graph.faces_faces = make_faces_faces(graph);
    return graph;
  };

  var get_edges_vertices_span = function get_edges_vertices_span(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    return make_edges_coords_min_max_inclusive(graph).map(function (min_max, e) {
      return graph.vertices_coords.map(function (vert, v) {
        return vert[0] > min_max[0][0] - epsilon && vert[1] > min_max[0][1] - epsilon && vert[0] < min_max[1][0] + epsilon && vert[1] < min_max[1][1] + epsilon;
      });
    });
  };
  var get_edges_edges_span = function get_edges_edges_span(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        edges_coords = _ref.edges_coords;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var min_max = make_edges_coords_min_max_inclusive({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_coords: edges_coords
    }, epsilon);
    var span_overlaps = edges_vertices.map(function () {
      return [];
    });
    for (var e0 = 0; e0 < edges_vertices.length - 1; e0 += 1) {
      for (var e1 = e0 + 1; e1 < edges_vertices.length; e1 += 1) {
        var outside_of = (min_max[e0][1][0] < min_max[e1][0][0] || min_max[e1][1][0] < min_max[e0][0][0]) && (min_max[e0][1][1] < min_max[e1][0][1] || min_max[e1][1][1] < min_max[e0][0][1]);
        span_overlaps[e0][e1] = !outside_of;
        span_overlaps[e1][e0] = !outside_of;
      }
    }
    for (var i = 0; i < edges_vertices.length; i += 1) {
      span_overlaps[i][i] = true;
    }
    return span_overlaps;
  };

  var span = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get_edges_vertices_span: get_edges_vertices_span,
    get_edges_edges_span: get_edges_edges_span
  });

  var get_collinear_vertices = function get_collinear_vertices(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        edges_coords = _ref.edges_coords;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    if (!edges_coords) {
      edges_coords = edges_vertices.map(function (ev) {
        return ev.map(function (v) {
          return vertices_coords[v];
        });
      });
    }
    var edges_span_vertices = get_edges_vertices_span({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_coords: edges_coords
    }, epsilon);
    for (var e = 0; e < edges_coords.length; e += 1) {
      for (var v = 0; v < vertices_coords.length; v += 1) {
        if (!edges_span_vertices[e][v]) {
          continue;
        }
        edges_span_vertices[e][v] = math.core.overlap_line_point(math.core.subtract(edges_coords[e][1], edges_coords[e][0]), edges_coords[e][0], vertices_coords[v], math.core.exclude_s, epsilon);
      }
    }
    return edges_span_vertices.map(function (verts) {
      return verts.map(function (vert, i) {
        return vert ? i : undefined;
      }).filter(function (i) {
        return i !== undefined;
      });
    });
  };

  var get_edges_edges_intersections = function get_edges_edges_intersections(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        edges_vector = _ref.edges_vector,
        edges_origin = _ref.edges_origin;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    if (!edges_vector) {
      edges_vector = make_edges_vector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    if (!edges_origin) {
      edges_origin = edges_vertices.map(function (ev) {
        return vertices_coords[ev[0]];
      });
    }
    var edges_intersections = edges_vector.map(function () {
      return [];
    });
    var span = get_edges_edges_span({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices
    }, epsilon);
    for (var i = 0; i < edges_vector.length - 1; i += 1) {
      for (var j = i + 1; j < edges_vector.length; j += 1) {
        if (span[i][j] !== true) {
          edges_intersections[i][j] = undefined;
          continue;
        }
        edges_intersections[i][j] = math.core.intersect_line_line(edges_vector[i], edges_origin[i], edges_vector[j], edges_origin[j], math.core.exclude_s, math.core.exclude_s, epsilon);
        edges_intersections[j][i] = edges_intersections[i][j];
      }
    }
    return edges_intersections;
  };

  var merge_simple_nextmaps = function merge_simple_nextmaps() {
    for (var _len = arguments.length, maps = new Array(_len), _key = 0; _key < _len; _key++) {
      maps[_key] = arguments[_key];
    }
    if (maps.length === 0) {
      return;
    }
    var solution = maps[0].map(function (_, i) {
      return i;
    });
    maps.forEach(function (map) {
      return solution.forEach(function (s, i) {
        solution[i] = map[s];
      });
    });
    return solution;
  };
  var merge_nextmaps = function merge_nextmaps() {
    for (var _len2 = arguments.length, maps = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      maps[_key2] = arguments[_key2];
    }
    if (maps.length === 0) {
      return;
    }
    var solution = maps[0].map(function (_, i) {
      return [i];
    });
    maps.forEach(function (map) {
      solution.forEach(function (s, i) {
        return s.forEach(function (indx, j) {
          solution[i][j] = map[indx];
        });
      });
      solution.forEach(function (arr, i) {
        solution[i] = arr.reduce(function (a, b) {
          return a.concat(b);
        }, []).filter(function (a) {
          return a !== undefined;
        });
      });
    });
    return solution;
  };
  var merge_simple_backmaps = function merge_simple_backmaps() {
    for (var _len3 = arguments.length, maps = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      maps[_key3] = arguments[_key3];
    }
    if (maps.length === 0) {
      return;
    }
    var solution = maps[0].map(function (_, i) {
      return i;
    });
    maps.forEach(function (map, i) {
      var next = map.map(function (n) {
        return solution[n];
      });
      solution = next;
    });
    return solution;
  };
  var merge_backmaps = function merge_backmaps() {
    for (var _len4 = arguments.length, maps = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      maps[_key4] = arguments[_key4];
    }
    if (maps.length === 0) {
      return;
    }
    var solution = maps[0].reduce(function (a, b) {
      return a.concat(b);
    }, []).map(function (_, i) {
      return [i];
    });
    maps.forEach(function (map, i) {
      var next = [];
      map.forEach(function (el, j) {
        if (_typeof(el) === _number$1) {
          next[j] = solution[el];
        } else {
          next[j] = el.map(function (n) {
            return solution[n];
          }).reduce(function (a, b) {
            return a.concat(b);
          }, []);
        }
      });
      solution = next;
    });
    return solution;
  };
  var invert_map = function invert_map(map) {
    var inv = [];
    map.forEach(function (n, i) {
      if (n == null) {
        return;
      }
      if (_typeof(n) === _number$1) {
        if (inv[n] !== undefined) {
          if (_typeof(inv[n]) === _number$1) {
            inv[n] = [inv[n], i];
          }
          else {
            inv[n].push(i);
          }
        } else {
          inv[n] = i;
        }
      }
      if (n.constructor === Array) {
        n.forEach(function (m) {
          inv[m] = i;
        });
      }
    });
    return inv;
  };
  var invert_simple_map = function invert_simple_map(map) {
    var inv = [];
    map.forEach(function (n, i) {
      inv[n] = i;
    });
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

  var fragment_graph = function fragment_graph(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var edges_coords = graph.edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return graph.vertices_coords[v];
      });
    });
    var edges_vector = edges_coords.map(function (e) {
      return math.core.subtract(e[1], e[0]);
    });
    var edges_origin = edges_coords.map(function (e) {
      return e[0];
    });
    var edges_intersections = get_edges_edges_intersections({
      vertices_coords: graph.vertices_coords,
      edges_vertices: graph.edges_vertices,
      edges_vector: edges_vector,
      edges_origin: edges_origin
    }, 1e-6);
    var edges_collinear_vertices = get_collinear_vertices({
      vertices_coords: graph.vertices_coords,
      edges_vertices: graph.edges_vertices,
      edges_coords: edges_coords
    }, epsilon);
    if (edges_intersections.reduce(fn_cat, []).filter(fn_def).length === 0 && edges_collinear_vertices.reduce(fn_cat, []).filter(fn_def).length === 0) {
      return;
    }
    var counts = {
      vertices: graph.vertices_coords.length
    };
    edges_intersections.forEach(function (edge) {
      return edge.filter(fn_def).filter(function (a) {
        return a.length === 2;
      }).forEach(function (intersect) {
        var newIndex = graph.vertices_coords.length;
        graph.vertices_coords.push(_toConsumableArray(intersect));
        intersect.splice(0, 2);
        intersect.push(newIndex);
      });
    });
    edges_intersections.forEach(function (edge, i) {
      edge.forEach(function (intersect, j) {
        if (intersect) {
          edges_intersections[i][j] = intersect[0];
        }
      });
    });
    var edges_intersections_flat = edges_intersections.map(function (arr) {
      return arr.filter(fn_def);
    });
    graph.edges_vertices.forEach(function (verts, i) {
      return verts.push.apply(verts, _toConsumableArray(edges_intersections_flat[i]).concat(_toConsumableArray(edges_collinear_vertices[i])));
    });
    graph.edges_vertices.forEach(function (edge, i) {
      graph.edges_vertices[i] = sort_vertices_along_vector({
        vertices_coords: graph.vertices_coords
      }, edge, edges_vector[i]);
    });
    var edge_map = graph.edges_vertices.map(function (edge, i) {
      return Array(edge.length - 1).fill(i);
    }).reduce(fn_cat, []);
    graph.edges_vertices = graph.edges_vertices.map(function (edge) {
      return Array.from(Array(edge.length - 1)).map(function (_, i, arr) {
        return [edge[i], edge[i + 1]];
      });
    }).reduce(fn_cat, []);
    if (graph.edges_assignment && graph.edges_foldAngle && graph.edges_foldAngle.length > graph.edges_assignment.length) {
      for (var i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
        graph.edges_assignment[i] = edge_foldAngle_to_assignment(graph.edges_foldAngle[i]);
      }
    }
    if (graph.edges_assignment) {
      graph.edges_assignment = edge_map.map(function (i) {
        return graph.edges_assignment[i] || "U";
      });
    }
    if (graph.edges_foldAngle) {
      graph.edges_foldAngle = edge_map.map(function (i) {
        return graph.edges_foldAngle[i];
      }).map(function (a, i) {
        return a === undefined ? edge_assignment_to_foldAngle(graph.edges_assignment[i]) : a;
      });
    }
    return {
      vertices: {
        "new": Array.from(Array(graph.vertices_coords.length - counts.vertices)).map(function (_, i) {
          return counts.vertices + i;
        })
      },
      edges: {
        backmap: edge_map
      }
    };
  };
  var fragment_keep_keys = [_vertices_coords, _edges_vertices, _edges_assignment, _edges_foldAngle];
  var fragment = function fragment(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    graph.vertices_coords = graph.vertices_coords.map(function (coord) {
      return coord.slice(0, 2);
    });
    [_vertices, _edges, _faces].map(function (key) {
      return get_graph_keys_with_prefix(graph, key);
    }).reduce(fn_cat, []).filter(function (key) {
      return !fragment_keep_keys.includes(key);
    }).forEach(function (key) {
      return delete graph[key];
    });
    var change = {
      vertices: {},
      edges: {}
    };
    var i;
    for (i = 0; i < 20; i++) {
      var resVert = remove_duplicate_vertices(graph, epsilon / 2);
      var resEdgeDup = remove_duplicate_edges(graph);
      var resEdgeCirc = remove_circular_edges(graph);
      var resFrag = fragment_graph(graph, epsilon);
      if (resFrag === undefined) {
        change.vertices.map = change.vertices.map === undefined ? resVert.map : merge_nextmaps(change.vertices.map, resVert.map);
        change.edges.map = change.edges.map === undefined ? merge_nextmaps(resEdgeDup.map, resEdgeCirc.map) : merge_nextmaps(change.edges.map, resEdgeDup.map, resEdgeCirc.map);
        break;
      }
      var invert_frag = invert_map(resFrag.edges.backmap);
      var edgemap = merge_nextmaps(resEdgeDup.map, resEdgeCirc.map, invert_frag);
      change.vertices.map = change.vertices.map === undefined ? resVert.map : merge_nextmaps(change.vertices.map, resVert.map);
      change.edges.map = change.edges.map === undefined ? edgemap : merge_nextmaps(change.edges.map, edgemap);
    }
    if (i === 20) {
      console.warn("debug warning. fragment reached max iterations");
    }
    return change;
  };

  var add_vertices = function add_vertices(graph, vertices_coords) {
    var _graph$vertices_coord;
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.core.EPSILON;
    if (!graph.vertices_coords) {
      graph.vertices_coords = [];
    }
    if (typeof vertices_coords[0] === "number") {
      vertices_coords = [vertices_coords];
    }
    var vertices_equivalent_vertices = vertices_coords.map(function (vertex) {
      return graph.vertices_coords.map(function (v) {
        return math.core.distance(v, vertex) < epsilon;
      }).map(function (on_vertex, i) {
        return on_vertex ? i : undefined;
      }).filter(function (a) {
        return a !== undefined;
      }).shift();
    });
    var index = graph.vertices_coords.length;
    var unique_vertices = vertices_coords.filter(function (vert, i) {
      return vertices_equivalent_vertices[i] === undefined;
    });
    (_graph$vertices_coord = graph.vertices_coords).push.apply(_graph$vertices_coord, _toConsumableArray(unique_vertices));
    return vertices_equivalent_vertices.map(function (el) {
      return el === undefined ? index++ : el;
    });
  };

  var vef = [_vertices, _edges, _faces];
  var make_vertices_map_and_consider_duplicates = function make_vertices_map_and_consider_duplicates(target, source) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.core.EPSILON;
    var index = target.vertices_coords.length;
    return source.vertices_coords.map(function (vertex) {
      return target.vertices_coords.map(function (v) {
        return math.core.distance(v, vertex) < epsilon;
      }).map(function (on_vertex, i) {
        return on_vertex ? i : undefined;
      }).filter(function (a) {
        return a !== undefined;
      }).shift();
    }).map(function (el) {
      return el === undefined ? index++ : el;
    });
  };
  var get_edges_duplicate_from_source_in_target = function get_edges_duplicate_from_source_in_target(target, source) {
    var source_duplicates = {};
    var target_map = {};
    for (var i = 0; i < target.edges_vertices.length; i += 1) {
      target_map["".concat(target.edges_vertices[i][0], " ").concat(target.edges_vertices[i][1])] = i;
      target_map["".concat(target.edges_vertices[i][1], " ").concat(target.edges_vertices[i][0])] = i;
    }
    for (var _i = 0; _i < source.edges_vertices.length; _i += 1) {
      var index = target_map["".concat(source.edges_vertices[_i][0], " ").concat(source.edges_vertices[_i][1])];
      if (index !== undefined) {
        source_duplicates[_i] = index;
      }
    }
    return source_duplicates;
  };
  var update_suffixes = function update_suffixes(source, suffixes, keys, maps) {
    return keys.forEach(function (geom) {
      return suffixes[geom].forEach(function (key) {
        return source[key].forEach(function (arr, i) {
          return arr.forEach(function (el, j) {
            source[key][i][j] = maps[geom][el];
          });
        });
      });
    });
  };
  var assign$1 = function assign(target, source) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.core.EPSILON;
    var prefixes = {};
    var suffixes = {};
    var maps = {};
    vef.forEach(function (key) {
      prefixes[key] = get_graph_keys_with_prefix(source, key);
      suffixes[key] = get_graph_keys_with_suffix(source, key);
    });
    vef.forEach(function (geom) {
      return prefixes[geom].filter(function (key) {
        return !target[key];
      }).forEach(function (key) {
        target[key] = [];
      });
    });
    maps.vertices = make_vertices_map_and_consider_duplicates(target, source, epsilon);
    update_suffixes(source, suffixes, [_vertices], maps);
    var target_edges_count = count.edges(target);
    maps.edges = Array.from(Array(count.edges(source))).map(function (_, i) {
      return target_edges_count + i;
    });
    var edge_dups = get_edges_duplicate_from_source_in_target(target, source);
    Object.keys(edge_dups).forEach(function (i) {
      maps.edges[i] = edge_dups[i];
    });
    var target_faces_count = count.faces(target);
    maps.faces = Array.from(Array(count.faces(source))).map(function (_, i) {
      return target_faces_count + i;
    });
    update_suffixes(source, suffixes, [_edges, _faces], maps);
    vef.forEach(function (geom) {
      return prefixes[geom].forEach(function (key) {
        return source[key].forEach(function (el, i) {
          var new_index = maps[geom][i];
          target[key][new_index] = el;
        });
      });
    });
    return maps;
  };

  var subgraph = function subgraph(graph, components) {
    var remove_indices = {};
    var sorted_components = {};
    [_faces, _edges, _vertices].forEach(function (key) {
      remove_indices[key] = Array.from(Array(count[key](graph))).map(function (_, i) {
        return i;
      });
      sorted_components[key] = unique_sorted_integers(components[key] || []).reverse();
    });
    Object.keys(sorted_components).forEach(function (key) {
      return sorted_components[key].forEach(function (i) {
        return remove_indices[key].splice(i, 1);
      });
    });
    Object.keys(remove_indices).forEach(function (key) {
      return remove_geometry_indices(graph, key, remove_indices[key]);
    });
    return graph;
  };

  var get_boundary_vertices = function get_boundary_vertices(_ref) {
    var edges_vertices = _ref.edges_vertices,
        edges_assignment = _ref.edges_assignment;
    var vertices = {};
    edges_vertices.forEach(function (v, i) {
      var boundary = edges_assignment[i] === "B" || edges_assignment[i] === "b";
      if (!boundary) {
        return;
      }
      vertices[v[0]] = true;
      vertices[v[1]] = true;
    });
    return Object.keys(vertices).map(function (str) {
      return parseInt(str);
    });
  };
  var empty_get_boundary = function empty_get_boundary() {
    return {
      vertices: [],
      edges: []
    };
  };
  var get_boundary = function get_boundary(_ref2) {
    var vertices_edges = _ref2.vertices_edges,
        edges_vertices = _ref2.edges_vertices,
        edges_assignment = _ref2.edges_assignment;
    if (edges_assignment === undefined) {
      return empty_get_boundary();
    }
    if (!vertices_edges) {
      vertices_edges = make_vertices_edges$1({
        edges_vertices: edges_vertices
      });
    }
    var edges_vertices_b = edges_assignment.map(function (a) {
      return a === "B" || a === "b";
    });
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
      return empty_get_boundary();
    }
    edges_vertices_b[edgeIndex] = false;
    edge_walk.push(edgeIndex);
    vertex_walk.push(edges_vertices[edgeIndex][0]);
    var nextVertex = edges_vertices[edgeIndex][1];
    while (vertex_walk[0] !== nextVertex) {
      vertex_walk.push(nextVertex);
      edgeIndex = vertices_edges[nextVertex].filter(function (v) {
        return edges_vertices_b[v];
      }).shift();
      if (edgeIndex === undefined) {
        return empty_get_boundary();
      }
      if (edges_vertices[edgeIndex][0] === nextVertex) {
        var _edges_vertices$edgeI = _slicedToArray(edges_vertices[edgeIndex], 2);
        nextVertex = _edges_vertices$edgeI[1];
      } else {
        var _edges_vertices$edgeI2 = _slicedToArray(edges_vertices[edgeIndex], 1);
        nextVertex = _edges_vertices$edgeI2[0];
      }
      edges_vertices_b[edgeIndex] = false;
      edge_walk.push(edgeIndex);
    }
    return {
      vertices: vertex_walk,
      edges: edge_walk
    };
  };
  var get_planar_boundary = function get_planar_boundary(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        vertices_edges = _ref3.vertices_edges,
        vertices_vertices = _ref3.vertices_vertices,
        edges_vertices = _ref3.edges_vertices;
    if (!vertices_vertices) {
      vertices_vertices = make_vertices_vertices({
        vertices_coords: vertices_coords,
        vertices_edges: vertices_edges,
        edges_vertices: edges_vertices
      });
    }
    var edge_map = make_vertices_to_edge_bidirectional({
      edges_vertices: edges_vertices
    });
    var edge_walk = [];
    var vertex_walk = [];
    var walk = {
      vertices: vertex_walk,
      edges: edge_walk
    };
    var largestX = -Infinity;
    var first_vertex_i = -1;
    vertices_coords.forEach(function (v, i) {
      if (v[0] > largestX) {
        largestX = v[0];
        first_vertex_i = i;
      }
    });
    if (first_vertex_i === -1) {
      return walk;
    }
    vertex_walk.push(first_vertex_i);
    var first_vc = vertices_coords[first_vertex_i];
    var first_neighbors = vertices_vertices[first_vertex_i];
    var counter_clock_first_i = first_neighbors.map(function (i) {
      return vertices_coords[i];
    }).map(function (vc) {
      return [vc[0] - first_vc[0], vc[1] - first_vc[1]];
    }).map(function (vec) {
      return Math.atan2(vec[1], vec[0]);
    }).map(function (angle) {
      return angle < 0 ? angle + Math.PI * 2 : angle;
    }).map(function (a, i) {
      return {
        a: a,
        i: i
      };
    }).sort(function (a, b) {
      return a.a - b.a;
    }).shift().i;
    var second_vertex_i = first_neighbors[counter_clock_first_i];
    var first_edge_lookup = first_vertex_i < second_vertex_i ? "".concat(first_vertex_i, " ").concat(second_vertex_i) : "".concat(second_vertex_i, " ").concat(first_vertex_i);
    var first_edge = edge_map[first_edge_lookup];
    edge_walk.push(first_edge);
    var prev_vertex_i = first_vertex_i;
    var this_vertex_i = second_vertex_i;
    var protection = 0;
    while (protection < 10000) {
      var next_neighbors = vertices_vertices[this_vertex_i];
      var from_neighbor_i = next_neighbors.indexOf(prev_vertex_i);
      var next_neighbor_i = (from_neighbor_i + 1) % next_neighbors.length;
      var next_vertex_i = next_neighbors[next_neighbor_i];
      var next_edge_lookup = this_vertex_i < next_vertex_i ? "".concat(this_vertex_i, " ").concat(next_vertex_i) : "".concat(next_vertex_i, " ").concat(this_vertex_i);
      var next_edge_i = edge_map[next_edge_lookup];
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

  var apply_matrix_to_graph = function apply_matrix_to_graph(graph, matrix) {
    filter_keys_with_suffix(graph, "coords").forEach(function (key) {
      graph[key] = graph[key].map(function (v) {
        return math.core.resize(3, v);
      }).map(function (v) {
        return math.core.multiply_matrix3_vector3(matrix, v);
      });
    });
    filter_keys_with_suffix(graph, "matrix").forEach(function (key) {
      graph[key] = graph[key].map(function (m) {
        return math.core.multiply_matrices3(m, matrix);
      });
    });
    return graph;
  };
  var transform_scale = function transform_scale(graph, scale) {
    var _math$core;
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var vector = (_math$core = math.core).get_vector.apply(_math$core, args);
    var vector3 = math.core.resize(3, vector);
    var matrix = math.core.make_matrix3_scale(scale, vector3);
    return apply_matrix_to_graph(graph, matrix);
  };
  var transform_translate = function transform_translate(graph) {
    var _math$core2, _math$core3;
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    var vector = (_math$core2 = math.core).get_vector.apply(_math$core2, args);
    var vector3 = math.core.resize(3, vector);
    var matrix = (_math$core3 = math.core).make_matrix3_translate.apply(_math$core3, _toConsumableArray(vector3));
    return apply_matrix_to_graph(graph, matrix);
  };
  var transform_rotateZ = function transform_rotateZ(graph, angle) {
    var _math$core4, _math$core5;
    for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }
    var vector = (_math$core4 = math.core).get_vector.apply(_math$core4, args);
    var vector3 = math.core.resize(3, vector);
    var matrix = (_math$core5 = math.core).make_matrix3_rotateZ.apply(_math$core5, [angle].concat(_toConsumableArray(vector3)));
    return apply_matrix_to_graph(graph, matrix);
  };
  var transform = {
    scale: transform_scale,
    translate: transform_translate,
    rotateZ: transform_rotateZ,
    transform: apply_matrix_to_graph
  };

  var get_face_face_shared_vertices = function get_face_face_shared_vertices(face_a_vertices, face_b_vertices) {
    var hash = {};
    face_b_vertices.forEach(function (v) {
      hash[v] = true;
    });
    var match = face_a_vertices.map(function (v) {
      return hash[v] ? true : false;
    });
    var shared_vertices = [];
    var notShared = match.indexOf(false);
    for (var i = notShared + 1; i < match.length; i += 1) {
      if (match[i]) {
        shared_vertices.push(face_a_vertices[i]);
      }
    }
    for (var _i = 0; _i < notShared; _i += 1) {
      if (match[_i]) {
        shared_vertices.push(face_a_vertices[_i]);
      }
    }
    return shared_vertices;
  };
  var make_face_spanning_tree = function make_face_spanning_tree(_ref) {
    var faces_vertices = _ref.faces_vertices,
        faces_faces = _ref.faces_faces;
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!faces_faces) {
      faces_faces = make_faces_faces({
        faces_vertices: faces_vertices
      });
    }
    if (faces_faces.length === 0) {
      return [];
    }
    var tree = [[{
      face: root_face
    }]];
    var visited_faces = {};
    visited_faces[root_face] = true;
    var _loop = function _loop() {
      var next_level_with_duplicates = tree[tree.length - 1].map(function (current) {
        return faces_faces[current.face].map(function (face) {
          return {
            face: face,
            parent: current.face
          };
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
      var dup_indices = {};
      next_level_with_duplicates.forEach(function (el, i) {
        if (visited_faces[el.face]) {
          dup_indices[i] = true;
        }
        visited_faces[el.face] = true;
      });
      var next_level = next_level_with_duplicates.filter(function (_, i) {
        return !dup_indices[i];
      });
      next_level.map(function (el) {
        return get_face_face_shared_vertices(faces_vertices[el.face], faces_vertices[el.parent]);
      }).forEach(function (ev, i) {
        var edge_vertices = ev.slice(0, 2);
        next_level[i].edge_vertices = edge_vertices;
      });
      tree[tree.length] = next_level;
    };
    do {
      _loop();
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

  var assignment_is_folded = {
    M: true,
    m: true,
    V: true,
    v: true,
    U: true,
    u: true,
    F: false,
    f: false,
    B: false,
    b: false
  };
  var make_edges_is_flat_folded = function make_edges_is_flat_folded(_ref) {
    var edges_vertices = _ref.edges_vertices,
        edges_foldAngle = _ref.edges_foldAngle,
        edges_assignment = _ref.edges_assignment;
    if (edges_assignment === undefined) {
      return edges_foldAngle === undefined ? edges_vertices.map(function (_) {
        return true;
      }) : edges_foldAngle.map(function (angle) {
        return angle < 0 || angle > 0;
      });
    }
    return edges_assignment.map(function (a) {
      return assignment_is_folded[a];
    });
  };
  var multiply_vertices_faces_matrix2 = function multiply_vertices_faces_matrix2(_ref2, faces_matrix) {
    var vertices_coords = _ref2.vertices_coords,
        vertices_faces = _ref2.vertices_faces,
        faces_vertices = _ref2.faces_vertices;
    if (!vertices_faces) {
      vertices_faces = make_vertices_faces({
        faces_vertices: faces_vertices
      });
    }
    var vertices_matrix = vertices_faces.map(function (faces) {
      return faces.filter(function (a) {
        return a != null;
      }).shift();
    }).map(function (face) {
      return face === undefined ? math.core.identity2x3 : faces_matrix[face];
    });
    return vertices_coords.map(function (coord, i) {
      return math.core.multiply_matrix2_vector2(vertices_matrix[i], coord);
    });
  };
  var unassigned_angle = {
    U: true,
    u: true
  };
  var make_faces_matrix = function make_faces_matrix(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        edges_vertices = _ref3.edges_vertices,
        edges_foldAngle = _ref3.edges_foldAngle,
        edges_assignment = _ref3.edges_assignment,
        faces_vertices = _ref3.faces_vertices,
        faces_faces = _ref3.faces_faces;
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!edges_assignment && edges_foldAngle) {
      edges_assignment = make_edges_assignment({
        edges_foldAngle: edges_foldAngle
      });
    }
    if (!edges_foldAngle) {
      if (edges_assignment) {
        edges_foldAngle = make_edges_foldAngle({
          edges_assignment: edges_assignment
        });
      } else {
        edges_foldAngle = Array(edges_vertices.length).fill(0);
      }
    }
    var edge_map = make_vertices_to_edge_bidirectional({
      edges_vertices: edges_vertices
    });
    var faces_matrix = faces_vertices.map(function () {
      return math.core.identity3x4;
    });
    make_face_spanning_tree({
      faces_vertices: faces_vertices,
      faces_faces: faces_faces
    }, root_face).slice(1)
    .forEach(function (level) {
      return level.forEach(function (entry) {
        var _math$core;
        var coords = entry.edge_vertices.map(function (v) {
          return vertices_coords[v];
        });
        var edgeKey = entry.edge_vertices.join(" ");
        var edge = edge_map[edgeKey];
        var foldAngle = unassigned_angle[edges_assignment[edge]] ? Math.PI : edges_foldAngle[edge] * Math.PI / 180;
        var local_matrix = math.core.make_matrix3_rotate(foldAngle,
        (_math$core = math.core).subtract.apply(_math$core, _toConsumableArray(math.core.resize_up(coords[1], coords[0]))),
        coords[0]
        );
        faces_matrix[entry.face] = math.core.multiply_matrices3(faces_matrix[entry.parent], local_matrix);
      });
    });
    return faces_matrix;
  };
  var make_faces_matrix2 = function make_faces_matrix2(_ref4) {
    var vertices_coords = _ref4.vertices_coords,
        edges_vertices = _ref4.edges_vertices,
        edges_foldAngle = _ref4.edges_foldAngle,
        edges_assignment = _ref4.edges_assignment,
        faces_vertices = _ref4.faces_vertices,
        faces_faces = _ref4.faces_faces;
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!edges_foldAngle) {
      if (edges_assignment) {
        edges_foldAngle = make_edges_foldAngle({
          edges_assignment: edges_assignment
        });
      } else {
        edges_foldAngle = Array(edges_vertices.length).fill(0);
      }
    }
    var edges_is_folded = make_edges_is_flat_folded({
      edges_vertices: edges_vertices,
      edges_foldAngle: edges_foldAngle,
      edges_assignment: edges_assignment
    });
    var edge_map = make_vertices_to_edge_bidirectional({
      edges_vertices: edges_vertices
    });
    var faces_matrix = faces_vertices.map(function () {
      return math.core.identity2x3;
    });
    make_face_spanning_tree({
      faces_vertices: faces_vertices,
      faces_faces: faces_faces
    }, root_face).slice(1)
    .forEach(function (level) {
      return level.forEach(function (entry) {
        var coords = entry.edge_vertices.map(function (v) {
          return vertices_coords[v];
        });
        var edgeKey = entry.edge_vertices.join(" ");
        var edge = edge_map[edgeKey];
        var reflect_vector = math.core.subtract2(coords[1], coords[0]);
        var reflect_origin = coords[0];
        var local_matrix = edges_is_folded[edge] ? math.core.make_matrix2_reflect(reflect_vector, reflect_origin) : math.core.identity2x3;
        faces_matrix[entry.face] = math.core.multiply_matrices2(faces_matrix[entry.parent], local_matrix);
      });
    });
    return faces_matrix;
  };

  var faces_matrix = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_edges_is_flat_folded: make_edges_is_flat_folded,
    multiply_vertices_faces_matrix2: multiply_vertices_faces_matrix2,
    make_faces_matrix: make_faces_matrix,
    make_faces_matrix2: make_faces_matrix2
  });

  var make_vertices_coords_folded = function make_vertices_coords_folded(_ref, root_face) {
    var vertices_coords = _ref.vertices_coords,
        vertices_faces = _ref.vertices_faces,
        edges_vertices = _ref.edges_vertices,
        edges_foldAngle = _ref.edges_foldAngle,
        edges_assignment = _ref.edges_assignment,
        faces_vertices = _ref.faces_vertices,
        faces_faces = _ref.faces_faces,
        faces_matrix = _ref.faces_matrix;
    faces_matrix = make_faces_matrix({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_foldAngle: edges_foldAngle,
      edges_assignment: edges_assignment,
      faces_vertices: faces_vertices,
      faces_faces: faces_faces
    }, root_face);
    if (!vertices_faces) {
      vertices_faces = make_vertices_faces({
        faces_vertices: faces_vertices
      });
    }
    var vertices_matrix = vertices_faces.map(function (faces) {
      return faces.filter(function (a) {
        return a != null;
      })
      .shift();
    })
    .map(function (face) {
      return face === undefined ? math.core.identity3x4 : faces_matrix[face];
    });
    return vertices_coords.map(function (coord) {
      return math.core.resize(3, coord);
    }).map(function (coord, i) {
      return math.core.multiply_matrix3_vector3(vertices_matrix[i], coord);
    });
  };
  var make_vertices_coords_flat_folded = function make_vertices_coords_flat_folded(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices,
        edges_foldAngle = _ref2.edges_foldAngle,
        edges_assignment = _ref2.edges_assignment,
        faces_vertices = _ref2.faces_vertices,
        faces_faces = _ref2.faces_faces;
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var edges_is_folded = make_edges_is_flat_folded({
      edges_vertices: edges_vertices,
      edges_foldAngle: edges_foldAngle,
      edges_assignment: edges_assignment
    });
    var vertices_coords_folded = [];
    faces_vertices[root_face].forEach(function (v) {
      vertices_coords_folded[v] = _toConsumableArray(vertices_coords[v]);
    });
    var faces_flipped = [];
    faces_flipped[root_face] = false;
    var edge_map = make_vertices_to_edge_bidirectional({
      edges_vertices: edges_vertices
    });
    make_face_spanning_tree({
      faces_vertices: faces_vertices,
      faces_faces: faces_faces
    }, root_face).slice(1)
    .forEach(function (level, l) {
      return level.forEach(function (entry) {
        var edge_key = entry.edge_vertices.join(" ");
        var edge = edge_map[edge_key];
        var coords = edges_vertices[edge].map(function (v) {
          return vertices_coords_folded[v];
        });
        if (coords[0] === undefined || coords[1] === undefined) {
          return;
        }
        var coords_cp = edges_vertices[edge].map(function (v) {
          return vertices_coords[v];
        });
        var origin_cp = coords_cp[0];
        var vector_cp = math.core.normalize2(math.core.subtract2(coords_cp[1], coords_cp[0]));
        var normal_cp = math.core.rotate90(vector_cp);
        faces_flipped[entry.face] = edges_is_folded[edge] ? !faces_flipped[entry.parent] : faces_flipped[entry.parent];
        var vector_folded = math.core.normalize2(math.core.subtract2(coords[1], coords[0]));
        var origin_folded = coords[0];
        var normal_folded = faces_flipped[entry.face] ? math.core.rotate270(vector_folded) : math.core.rotate90(vector_folded);
        faces_vertices[entry.face].filter(function (v) {
          return vertices_coords_folded[v] === undefined;
        }).forEach(function (v) {
          var coords_cp = vertices_coords[v];
          var to_point = math.core.subtract2(coords_cp, origin_cp);
          var project_norm = math.core.dot(to_point, normal_cp);
          var project_line = math.core.dot(to_point, vector_cp);
          var walk_up = math.core.scale2(vector_folded, project_line);
          var walk_perp = math.core.scale2(normal_folded, project_norm);
          var folded_coords = math.core.add2(math.core.add2(origin_folded, walk_up), walk_perp);
          vertices_coords_folded[v] = folded_coords;
        });
      });
    });
    return vertices_coords_folded;
  };

  var vertices_coords_folded = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_vertices_coords_folded: make_vertices_coords_folded,
    make_vertices_coords_flat_folded: make_vertices_coords_flat_folded
  });

  var explode_faces = function explode_faces(graph) {
    var vertices_coords = graph.faces_vertices.map(function (face) {
      return face.map(function (v) {
        return graph.vertices_coords[v];
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var i = 0;
    var faces_vertices = graph.faces_vertices.map(function (face) {
      return face.map(function (v) {
        return i++;
      });
    });
    return {
      vertices_coords: JSON.parse(JSON.stringify(vertices_coords)),
      faces_vertices: faces_vertices
    };
  };

  var nearest_vertex = function nearest_vertex(_ref, point) {
    var vertices_coords = _ref.vertices_coords;
    if (!vertices_coords) {
      return undefined;
    }
    var p = math.core.resize(vertices_coords[0].length, point);
    var nearest = vertices_coords.map(function (v, i) {
      return {
        d: math.core.distance(p, v),
        i: i
      };
    }).sort(function (a, b) {
      return a.d - b.d;
    }).shift();
    return nearest ? nearest.i : undefined;
  };
  var nearest_edge = function nearest_edge(_ref2, point) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices;
    if (!vertices_coords || !edges_vertices) {
      return undefined;
    }
    var nearest_points = edges_vertices.map(function (e) {
      return e.map(function (ev) {
        return vertices_coords[ev];
      });
    }).map(function (e) {
      return math.core.nearest_point_on_line(math.core.subtract(e[1], e[0]), e[0], point, math.core.segment_limiter);
    });
    return math.core.smallest_comparison_search(point, nearest_points, math.core.distance);
  };
  var face_containing_point = function face_containing_point(_ref3, point) {
    var vertices_coords = _ref3.vertices_coords,
        faces_vertices = _ref3.faces_vertices;
    if (!vertices_coords || !faces_vertices) {
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
      return math.core.overlap_convex_polygon_point(f.face, point);
    }).shift();
    return face === undefined ? undefined : face.i;
  };
  var nearest_face = face_containing_point;

  var nearest = /*#__PURE__*/Object.freeze({
    __proto__: null,
    nearest_vertex: nearest_vertex,
    nearest_edge: nearest_edge,
    face_containing_point: face_containing_point,
    nearest_face: nearest_face
  });

  var clone = function clone(o) {
    var newO;
    var i;
    if (_typeof(o) !== _object$1) {
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

  var find_adjacent_faces_to_edge = function find_adjacent_faces_to_edge(_ref, edge) {
    var vertices_faces = _ref.vertices_faces,
        edges_vertices = _ref.edges_vertices,
        edges_faces = _ref.edges_faces,
        faces_edges = _ref.faces_edges,
        faces_vertices = _ref.faces_vertices;
    if (edges_faces && edges_faces[edge]) {
      return edges_faces[edge];
    }
    var vertices = edges_vertices[edge];
    if (vertices_faces !== undefined) {
      var faces = [];
      for (var i = 0; i < vertices_faces[vertices[0]].length; i += 1) {
        for (var j = 0; j < vertices_faces[vertices[1]].length; j += 1) {
          if (vertices_faces[vertices[0]][i] === vertices_faces[vertices[1]][j]) {
            if (vertices_faces[vertices[0]][i] === undefined) {
              continue;
            }
            faces.push(vertices_faces[vertices[0]][i]);
          }
        }
      }
      return faces;
    }
    if (faces_edges) {
      var _faces = [];
      for (var _i = 0; _i < faces_edges.length; _i += 1) {
        for (var e = 0; e < faces_edges[_i].length; e += 1) {
          if (faces_edges[_i][e] === edge) {
            _faces.push(_i);
          }
        }
      }
      return _faces;
    }
    if (faces_vertices) {
      console.warn("todo: find_adjacent_faces_to_edge");
    }
  };

  var split_edge_into_two = function split_edge_into_two(graph, edge_index, new_vertex) {
    var edge_vertices = graph.edges_vertices[edge_index];
    var new_edges = [{
      edges_vertices: [edge_vertices[0], new_vertex]
    }, {
      edges_vertices: [new_vertex, edge_vertices[1]]
    }];
    new_edges.forEach(function (edge, i) {
      return [_edges_assignment, _edges_foldAngle].filter(function (key) {
        return graph[key] && graph[key][edge_index] !== undefined;
      }).forEach(function (key) {
        edge[key] = graph[key][edge_index];
      });
    });
    if (graph.vertices_coords && (graph.edges_length || graph.edges_vector)) {
      var coords = new_edges.map(function (edge) {
        return edge.edges_vertices.map(function (v) {
          return graph.vertices_coords[v];
        });
      });
      if (graph.edges_vector) {
        new_edges.forEach(function (edge, i) {
          edge.edges_vector = math.core.subtract(coords[i][1], coords[i][0]);
        });
      }
      if (graph.edges_length) {
        new_edges.forEach(function (edge, i) {
          var _math$core;
          edge.edges_length = (_math$core = math.core).distance2.apply(_math$core, _toConsumableArray(coords[i]));
        });
      }
    }
    return new_edges;
  };

  var update_vertices_vertices$1 = function update_vertices_vertices(_ref, vertex, incident_vertices) {
    var vertices_vertices = _ref.vertices_vertices;
    if (!vertices_vertices) {
      return;
    }
    vertices_vertices[vertex] = _toConsumableArray(incident_vertices);
    incident_vertices.forEach(function (v, i, arr) {
      var otherV = arr[(i + 1) % arr.length];
      var otherI = vertices_vertices[v].indexOf(otherV);
      vertices_vertices[v][otherI] = vertex;
    });
  };
  var update_vertices_edges$1 = function update_vertices_edges(_ref2, old_edge, new_vertex, vertices, new_edges) {
    var vertices_edges = _ref2.vertices_edges;
    if (!vertices_edges) {
      return;
    }
    vertices_edges[new_vertex] = _toConsumableArray(new_edges);
    vertices.map(function (v) {
      return vertices_edges[v].indexOf(old_edge);
    }).forEach(function (index, i) {
      vertices_edges[vertices[i]][index] = new_edges[i];
    });
  };
  var update_vertices_faces$1 = function update_vertices_faces(_ref3, vertex, faces) {
    var vertices_faces = _ref3.vertices_faces;
    if (!vertices_faces) {
      return;
    }
    vertices_faces[vertex] = _toConsumableArray(faces);
  };
  var update_edges_faces$1 = function update_edges_faces(_ref4, new_edges, faces) {
    var edges_faces = _ref4.edges_faces;
    if (!edges_faces) {
      return;
    }
    new_edges.forEach(function (edge) {
      return edges_faces[edge] = _toConsumableArray(faces);
    });
  };
  var update_faces_vertices = function update_faces_vertices(_ref5, new_vertex, incident_vertices, faces) {
    var faces_vertices = _ref5.faces_vertices;
    if (!faces_vertices) {
      return;
    }
    faces.map(function (i) {
      return faces_vertices[i];
    }).forEach(function (face) {
      return face.map(function (fv, i, arr) {
        var nextI = (i + 1) % arr.length;
        return fv === incident_vertices[0] && arr[nextI] === incident_vertices[1] || fv === incident_vertices[1] && arr[nextI] === incident_vertices[0] ? nextI : undefined;
      }).filter(function (el) {
        return el !== undefined;
      }).sort(function (a, b) {
        return b - a;
      }).forEach(function (i) {
        return face.splice(i, 0, new_vertex);
      });
    });
  };
  var update_faces_edges = function update_faces_edges(_ref6, old_edge, new_vertex, new_edges, faces) {
    var edges_vertices = _ref6.edges_vertices,
        faces_edges = _ref6.faces_edges;
    if (!faces_edges) {
      return;
    }
    faces.map(function (i) {
      return faces_edges[i];
    }).forEach(function (face) {
      var edgeIndex = face.indexOf(old_edge);
      var prevEdge = face[(edgeIndex + face.length - 1) % face.length];
      var nextEdge = face[(edgeIndex + 1) % face.length];
      var vertices = [[prevEdge, old_edge], [old_edge, nextEdge]].map(function (pairs) {
        var verts = pairs.map(function (e) {
          return edges_vertices[e];
        });
        return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1] ? verts[0][0] : verts[0][1];
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
      var edges = [[vertices[0], new_vertex], [new_vertex, vertices[1]]].map(function (verts) {
        var in0 = verts.map(function (v) {
          return edges_vertices[new_edges[0]].indexOf(v) !== -1;
        }).reduce(function (a, b) {
          return a && b;
        }, true);
        var in1 = verts.map(function (v) {
          return edges_vertices[new_edges[1]].indexOf(v) !== -1;
        }).reduce(function (a, b) {
          return a && b;
        }, true);
        if (in0) {
          return new_edges[0];
        }
        if (in1) {
          return new_edges[1];
        }
        throw new Error("split_edge() bad faces_edges");
      });
      if (edgeIndex === face.length - 1) {
        face.splice(edgeIndex, 1, edges[0]);
        face.unshift(edges[1]);
      } else {
        face.splice.apply(face, [edgeIndex, 1].concat(_toConsumableArray(edges)));
      }
      return edges;
    });
  };

  var split_edge = function split_edge(graph, old_edge, coords) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.core.EPSILON;
    if (graph.edges_vertices.length < old_edge) {
      return {};
    }
    var incident_vertices = graph.edges_vertices[old_edge];
    if (!coords) {
      var _math$core;
      coords = (_math$core = math.core).midpoint.apply(_math$core, _toConsumableArray(incident_vertices));
    }
    var similar = incident_vertices.map(function (v) {
      return graph.vertices_coords[v];
    }).map(function (vert) {
      return math.core.distance(vert, coords) < epsilon;
    });
    if (similar[0]) {
      return {
        vertex: incident_vertices[0],
        edges: {}
      };
    }
    if (similar[1]) {
      return {
        vertex: incident_vertices[1],
        edges: {}
      };
    }
    var vertex = graph.vertices_coords.length;
    graph.vertices_coords[vertex] = coords;
    var new_edges = [0, 1].map(function (i) {
      return i + graph.edges_vertices.length;
    });
    split_edge_into_two(graph, old_edge, vertex).forEach(function (edge, i) {
      return Object.keys(edge).forEach(function (key) {
        graph[key][new_edges[i]] = edge[key];
      });
    });
    update_vertices_vertices$1(graph, vertex, incident_vertices);
    update_vertices_edges$1(graph, old_edge, vertex, incident_vertices, new_edges);
    var incident_faces = find_adjacent_faces_to_edge(graph, old_edge);
    if (incident_faces) {
      update_vertices_faces$1(graph, vertex, incident_faces);
      update_edges_faces$1(graph, new_edges, incident_faces);
      update_faces_vertices(graph, vertex, incident_vertices, incident_faces);
      update_faces_edges(graph, old_edge, vertex, new_edges, incident_faces);
    }
    var edge_map = remove_geometry_indices(graph, _edges, [old_edge]);
    new_edges.forEach(function (_, i) {
      new_edges[i] = edge_map[new_edges[i]];
    });
    edge_map.splice(-2);
    edge_map[old_edge] = new_edges;
    return {
      vertex: vertex,
      edges: {
        map: edge_map,
        "new": new_edges,
        remove: old_edge
      }
    };
  };

  var make_edge = function make_edge(_ref, vertices, face) {
    var _math$core, _math$core2;
    var vertices_coords = _ref.vertices_coords;
    var new_edge_coords = vertices.map(function (v) {
      return vertices_coords[v];
    }).reverse();
    return {
      edges_vertices: _toConsumableArray(vertices),
      edges_foldAngle: 0,
      edges_assignment: "U",
      edges_length: (_math$core = math.core).distance2.apply(_math$core, _toConsumableArray(new_edge_coords)),
      edges_vector: (_math$core2 = math.core).subtract.apply(_math$core2, _toConsumableArray(new_edge_coords)),
      edges_faces: [face, face]
    };
  };
  var rebuild_edge = function rebuild_edge(graph, face, vertices) {
    var edge = graph.edges_vertices.length;
    var new_edge = make_edge(graph, vertices, face);
    Object.keys(new_edge).filter(function (key) {
      return graph[key] !== undefined;
    }).forEach(function (key) {
      graph[key][edge] = new_edge[key];
    });
    return edge;
  };

  var make_faces = function make_faces(_ref, face, vertices) {
    var edges_vertices = _ref.edges_vertices,
        faces_vertices = _ref.faces_vertices,
        faces_edges = _ref.faces_edges;
        _ref.faces_faces;
    var indices = vertices.map(function (el) {
      return faces_vertices[face].indexOf(el);
    });
    var faces = split_circular_array(faces_vertices[face], indices).map(function (fv) {
      return {
        faces_vertices: fv
      };
    });
    if (faces_edges) {
      var vertices_to_edge = make_vertices_to_edge_bidirectional({
        edges_vertices: edges_vertices
      });
      faces.map(function (face) {
        return face.faces_vertices.map(function (fv, i, arr) {
          return "".concat(fv, " ").concat(arr[(i + 1) % arr.length]);
        }).map(function (key) {
          return vertices_to_edge[key];
        });
      }).forEach(function (face_edges, i) {
        faces[i].faces_edges = face_edges;
      });
    }
    return faces;
  };
  var build_faces = function build_faces(graph, face, vertices) {
    var faces = [0, 1].map(function (i) {
      return graph.faces_vertices.length + i;
    });
    make_faces(graph, face, vertices).forEach(function (face, i) {
      return Object.keys(face).forEach(function (key) {
        graph[key][faces[i]] = face[key];
      });
    });
    return faces;
  };

  var split_at_intersections = function split_at_intersections(graph, _ref) {
    var vertices = _ref.vertices,
        edges = _ref.edges;
    var map;
    var split_results = edges.map(function (el) {
      var res = split_edge(graph, map ? map[el.edge] : el.edge, el.coords);
      map = map ? merge_nextmaps(map, res.edges.map) : res.edges.map;
      return res;
    });
    vertices.push.apply(vertices, _toConsumableArray(split_results.map(function (res) {
      return res.vertex;
    })));
    var bkmap;
    split_results.forEach(function (res) {
      res.edges.remove = bkmap ? bkmap[res.edges.remove] : res.edges.remove;
      var inverted = invert_simple_map(res.edges.map);
      bkmap = bkmap ? merge_backmaps(bkmap, inverted) : inverted;
    });
    return {
      vertices: vertices,
      edges: {
        map: map,
        remove: split_results.map(function (res) {
          return res.edges.remove;
        })
      }
    };
  };

  var update_vertices_vertices = function update_vertices_vertices(_ref, edge) {
    var vertices_coords = _ref.vertices_coords,
        vertices_vertices = _ref.vertices_vertices,
        edges_vertices = _ref.edges_vertices;
    var v0 = edges_vertices[edge][0];
    var v1 = edges_vertices[edge][1];
    vertices_vertices[v0] = sort_vertices_counter_clockwise({
      vertices_coords: vertices_coords
    }, vertices_vertices[v0].concat(v1), v0);
    vertices_vertices[v1] = sort_vertices_counter_clockwise({
      vertices_coords: vertices_coords
    }, vertices_vertices[v1].concat(v0), v1);
  };
  var update_vertices_edges = function update_vertices_edges(_ref2, edge) {
    var edges_vertices = _ref2.edges_vertices,
        vertices_edges = _ref2.vertices_edges,
        vertices_vertices = _ref2.vertices_vertices;
    if (!vertices_edges || !vertices_vertices) {
      return;
    }
    var vertices = edges_vertices[edge];
    vertices.map(function (v) {
      return vertices_vertices[v];
    }).map(function (vert_vert, i) {
      return vert_vert.indexOf(vertices[(i + 1) % vertices.length]);
    }).forEach(function (radial_index, i) {
      return vertices_edges[vertices[i]].splice(radial_index, 0, edge);
    });
  };
  var update_vertices_faces = function update_vertices_faces(graph, old_face, new_faces) {
    var vertex_face_map = {};
    new_faces.forEach(function (f, i) {
      return graph.faces_vertices[f].forEach(function (v) {
        if (!vertex_face_map[v]) {
          vertex_face_map[v] = [];
        }
        vertex_face_map[v].push(f);
      });
    });
    graph.faces_vertices[old_face].forEach(function (v) {
      var _graph$vertices_faces;
      var index = graph.vertices_faces[v].indexOf(old_face);
      var replacements = vertex_face_map[v];
      if (index === -1 || !replacements) {
        console.warn("update_vertices_faces not supposed to be here");
        return;
      }
      (_graph$vertices_faces = graph.vertices_faces[v]).splice.apply(_graph$vertices_faces, [index, 1].concat(_toConsumableArray(replacements)));
    });
  };
  var update_edges_faces = function update_edges_faces(graph, old_face, new_edge, new_faces) {
    var edge_face_map = {};
    new_faces.forEach(function (f, i) {
      return graph.faces_edges[f].forEach(function (e) {
        if (!edge_face_map[e]) {
          edge_face_map[e] = [];
        }
        edge_face_map[e].push(f);
      });
    });
    var edges = [].concat(_toConsumableArray(graph.faces_edges[old_face]), [new_edge]);
    edges.forEach(function (e) {
      var _graph$edges_faces$e;
      var replacements = edge_face_map[e];
      var indices = [];
      for (var i = 0; i < graph.edges_faces[e].length; i++) {
        if (graph.edges_faces[e][i] === old_face) {
          indices.push(i);
        }
      }
      if (indices.length === 0 || !replacements) {
        console.warn("update_edges_faces not supposed to be here", index, replacements, JSON.parse(JSON.stringify(graph.edges_faces[e])));
        return;
      }
      indices.reverse().forEach(function (index) {
        return graph.edges_faces[e].splice(index, 1);
      });
      var index = indices[indices.length - 1];
      (_graph$edges_faces$e = graph.edges_faces[e]).splice.apply(_graph$edges_faces$e, [index, 0].concat(_toConsumableArray(replacements)));
    });
  };
  var update_faces_faces = function update_faces_faces(_ref3, old_face, new_faces) {
    var faces_vertices = _ref3.faces_vertices,
        faces_faces = _ref3.faces_faces;
    var incident_faces = faces_faces[old_face];
    var new_faces_vertices = new_faces.map(function (f) {
      return faces_vertices[f];
    });
    var incident_face_face = incident_faces.map(function (f, i) {
      var incident_face_vertices = faces_vertices[f];
      var score = [0, 0];
      for (var n = 0; n < new_faces_vertices.length; n++) {
        var count = 0;
        for (var j = 0; j < incident_face_vertices.length; j++) {
          if (new_faces_vertices[n].indexOf(incident_face_vertices[j]) !== -1) {
            count++;
          }
        }
        score[n] = count;
      }
      if (score[0] >= 2) {
        return new_faces[0];
      }
      if (score[1] >= 2) {
        return new_faces[1];
      }
    });
    new_faces.forEach(function (f, i, arr) {
      faces_faces[f] = [arr[(i + 1) % new_faces.length]];
    });
    incident_faces.forEach(function (f, i) {
      for (var j = 0; j < faces_faces[f].length; j++) {
        if (faces_faces[f][j] === old_face) {
          faces_faces[f][j] = incident_face_face[i];
          faces_faces[incident_face_face[i]].push(f);
        }
      }
    });
  };

  var intersect_convex_face_line = function intersect_convex_face_line(_ref, face, vector, point) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        faces_vertices = _ref.faces_vertices,
        faces_edges = _ref.faces_edges;
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : math.core.EPSILON;
    var face_vertices_indices = faces_vertices[face].map(function (v) {
      return vertices_coords[v];
    }).map(function (coord) {
      return math.core.overlap_line_point(vector, point, coord, function () {
        return true;
      }, epsilon);
    }).map(function (overlap, i) {
      return overlap ? i : undefined;
    }).filter(function (i) {
      return i !== undefined;
    });
    var vertices = face_vertices_indices.map(function (i) {
      return faces_vertices[face][i];
    });
    var vertices_are_neighbors = face_vertices_indices.concat(face_vertices_indices.map(function (i) {
      return i + faces_vertices[face].length;
    })).map(function (n, i, arr) {
      return arr[i + 1] - n === 1;
    }).reduce(function (a, b) {
      return a || b;
    }, false);
    if (vertices_are_neighbors) {
      return undefined;
    }
    if (vertices.length > 1) {
      return {
        vertices: vertices,
        edges: []
      };
    }
    var edges = faces_edges[face].map(function (edge) {
      return edges_vertices[edge].map(function (v) {
        return vertices_coords[v];
      });
    }).map(function (seg) {
      return math.core.intersect_line_line(vector, point, math.core.subtract(seg[1], seg[0]), seg[0], math.core.include_l, math.core.exclude_s, epsilon);
    }).map(function (coords, face_edge_index) {
      return {
        coords: coords,
        edge: faces_edges[face][face_edge_index]
      };
    })
    .filter(function (el) {
      return el.coords !== undefined;
    })
    .filter(function (el) {
      return !vertices.map(function (v) {
        return edges_vertices[el.edge].includes(v);
      }).reduce(function (a, b) {
        return a || b;
      }, false);
    });
    return edges.length + vertices.length === 2 ? {
      vertices: vertices,
      edges: edges
    } : undefined;
  };

  var split_convex_face = function split_convex_face(graph, face, vector, point, epsilon) {
    var intersect = intersect_convex_face_line(graph, face, vector, point, epsilon);
    if (intersect === undefined) {
      return undefined;
    }
    var result = split_at_intersections(graph, intersect);
    result.edges["new"] = rebuild_edge(graph, face, result.vertices);
    update_vertices_vertices(graph, result.edges["new"]);
    update_vertices_edges(graph, result.edges["new"]);
    var faces = build_faces(graph, face, result.vertices);
    update_vertices_faces(graph, face, faces);
    update_edges_faces(graph, face, result.edges["new"], faces);
    update_faces_faces(graph, face, faces);
    var faces_map = remove_geometry_indices(graph, _faces, [face]);
    faces.forEach(function (_, i) {
      faces[i] = faces_map[faces[i]];
    });
    faces_map.splice(-2);
    faces_map[face] = faces;
    result.faces = {
      map: faces_map,
      "new": faces,
      remove: face
    };
    return result;
  };

  var Graph = {};
  Graph.prototype = Object.create(Object.prototype);
  Graph.prototype.constructor = Graph;
  var graphMethods = Object.assign({
    clean: clean,
    populate: populate,
    fragment: fragment,
    subgraph: subgraph,
    assign: assign$1
  }, transform);
  Object.keys(graphMethods).forEach(function (key) {
    Graph.prototype[key] = function () {
      return graphMethods[key].apply(graphMethods, [this].concat(Array.prototype.slice.call(arguments)));
    };
  });
  var graphMethodsRenamed = {
    addVertices: add_vertices,
    splitEdge: split_edge,
    faceSpanningTree: make_face_spanning_tree,
    explodeFaces: explode_faces
  };
  Object.keys(graphMethodsRenamed).forEach(function (key) {
    Graph.prototype[key] = function () {
      return graphMethodsRenamed[key].apply(graphMethodsRenamed, [this].concat(Array.prototype.slice.call(arguments)));
    };
  });
  Graph.prototype.splitFace = function (face) {
    var _math$core;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    var line = (_math$core = math.core).get_line.apply(_math$core, args);
    return split_convex_face(this, face, line.vector, line.origin);
  };
  Graph.prototype.copy = function () {
    return Object.assign(Object.create(this.__proto__), clone(this));
  };
  Graph.prototype.load = function (object) {
    var _this = this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (_typeof(object) !== _object$1) {
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
    }, clone(object));
  };
  Graph.prototype.clear = function () {
    var _this2 = this;
    fold_keys.graph.forEach(function (key) {
      return delete _this2[key];
    });
    fold_keys.orders.forEach(function (key) {
      return delete _this2[key];
    });
    delete this.file_frames;
  };
  Graph.prototype.unitize = function () {
    if (!this.vertices_coords) {
      return;
    }
    var box = math.core.enclosing_box(this.vertices_coords);
    var scale = box[1].map(function (n) {
      return 1 / n;
    });
    var origin = box[0];
    this.vertices_coords = this.vertices_coords.map(function (coord) {
      return math.core.subtract(coord, origin);
    }).map(function (coord) {
      return coord.map(function (n, i) {
        return n * scale[i];
      });
    });
    return this;
  };
  Graph.prototype.folded = function () {
    var vertices_coords = this.faces_matrix2 ? multiply_vertices_faces_matrix2(this, this.faces_matrix2) : make_vertices_coords_folded.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    return Object.assign(Object.create(this.__proto__), Object.assign(clone(this), {
      vertices_coords: vertices_coords,
      frame_classes: [_foldedForm]
    }));
  };
  Graph.prototype.flatFolded = function () {
    var vertices_coords = this.faces_matrix2 ? multiply_vertices_faces_matrix2(this, this.faces_matrix2) : make_vertices_coords_flat_folded.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    return Object.assign(Object.create(this.__proto__), Object.assign(clone(this), {
      vertices_coords: vertices_coords,
      frame_classes: [_foldedForm]
    }));
  };
  var shortenKeys = function shortenKeys(el, i, arr) {
    var _this3 = this;
    var object = Object.create(null);
    Object.keys(el).forEach(function (k) {
      object[k.substring(_this3.length + 1)] = el[k];
    });
    return object;
  };
  var getComponent = function getComponent(key) {
    return transpose_graph_arrays(this, key).map(shortenKeys.bind(key)).map(setup[key].bind(this));
  };
  [_vertices, _edges, _faces].forEach(function (key) {
    return Object.defineProperty(Graph.prototype, key, {
      get: function get() {
        return getComponent.call(this, key);
      }
    });
  });
  Object.defineProperty(Graph.prototype, _boundary, {
    get: function get() {
      var _this4 = this;
      var boundary = get_boundary(this);
      var poly = math.polygon(boundary.vertices.map(function (v) {
        return _this4.vertices_coords[v];
      }));
      Object.keys(boundary).forEach(function (key) {
        poly[key] = boundary[key];
      });
      return Object.assign(poly, boundary);
    }
  });
  var nearestMethods = {
    vertices: nearest_vertex,
    edges: nearest_edge,
    faces: face_containing_point
  };
  Graph.prototype.nearest = function () {
    var _this5 = this;
    var point = math.core.get_vector(arguments);
    var nears = Object.create(null);
    var cache = {};
    [_vertices, _edges, _faces].forEach(function (key) {
      Object.defineProperty(nears, singularize[key], {
        get: function get() {
          if (cache[key] !== undefined) {
            return cache[key];
          }
          cache[key] = nearestMethods[key](_this5, point);
          return cache[key];
        }
      });
      filter_keys_with_prefix(_this5, key).forEach(function (fold_key) {
        return Object.defineProperty(nears, fold_key, {
          get: function get() {
            return _this5[fold_key][nears[singularize[key]]];
          }
        });
      });
    });
    return nears;
  };
  var GraphProto = Graph.prototype;

  var clip = function clip(_ref, line) {
    var vertices_coords = _ref.vertices_coords,
        vertices_edges = _ref.vertices_edges,
        edges_vertices = _ref.edges_vertices,
        edges_assignment = _ref.edges_assignment,
        boundaries_vertices = _ref.boundaries_vertices;
    if (!boundaries_vertices) {
      boundaries_vertices = get_boundary({
        vertices_edges: vertices_edges,
        edges_vertices: edges_vertices,
        edges_assignment: edges_assignment
      }).vertices;
    }
    return math.polygon(boundaries_vertices.map(function (v) {
      return vertices_coords[v];
    })).clip(line);
  };

  var add_edges = function add_edges(graph, edges_vertices) {
    var _graph$edges_vertices;
    if (!graph.edges_vertices) {
      graph.edges_vertices = [];
    }
    if (typeof edges_vertices[0] === "number") {
      edges_vertices = [edges_vertices];
    }
    var indices = edges_vertices.map(function (_, i) {
      return graph.edges_vertices.length + i;
    });
    (_graph$edges_vertices = graph.edges_vertices).push.apply(_graph$edges_vertices, _toConsumableArray(edges_vertices));
    var index_map = remove_duplicate_edges(graph).map;
    return indices.map(function (i) {
      return index_map[i];
    });
  };

  var CreasePattern = {};
  CreasePattern.prototype = Object.create(GraphProto);
  CreasePattern.prototype.constructor = CreasePattern;
  var arcResolution = 96;
  var edges_array = function edges_array(array) {
    var _this = this;
    array.mountain = function () {
      var degrees = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -180;
      array.forEach(function (i) {
        _this.edges_assignment[i] = "M";
        _this.edges_foldAngle[i] = degrees;
      });
      return array;
    };
    array.valley = function () {
      var degrees = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 180;
      array.forEach(function (i) {
        _this.edges_assignment[i] = "V";
        _this.edges_foldAngle[i] = degrees;
      });
      return array;
    };
    array.flat = function () {
      array.forEach(function (i) {
        _this.edges_assignment[i] = "F";
        _this.edges_foldAngle[i] = 0;
      });
      return array;
    };
    return array;
  };
  ["line", "ray", "segment"].forEach(function (type) {
    CreasePattern.prototype[type] = function () {
      var primitive = math[type].apply(math, arguments);
      if (!primitive) {
        return;
      }
      var segment = clip(this, primitive);
      if (!segment) {
        return;
      }
      var vertices = add_vertices(this, segment);
      var edges = add_edges(this, vertices);
      var map = fragment(this).edges.map;
      populate(this);
      return edges_array.call(this, edges.map(function (e) {
        return map[e];
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []));
    };
  });
  ["circle", "ellipse", "rect", "polygon"].forEach(function (fName) {
    CreasePattern.prototype[fName] = function () {
      var _this2 = this;
      var primitive = math[fName].apply(math, arguments);
      if (!primitive) {
        return;
      }
      var segments = primitive.segments(arcResolution).map(function (segment) {
        return math.segment(segment);
      }).map(function (segment) {
        return clip(_this2, segment);
      }).filter(function (a) {
        return a !== undefined;
      });
      if (!segments) {
        return;
      }
      var vertices = [];
      var edges = [];
      segments.forEach(function (segment) {
        var verts = add_vertices(_this2, segment);
        vertices.push.apply(vertices, _toConsumableArray(verts));
        edges.push.apply(edges, _toConsumableArray(add_edges(_this2, verts)));
      });
      var map = fragment(this).edges.map;
      populate(this);
      return edges_array.call(this, edges.map(function (e) {
        return map[e];
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []));
    };
  });
  var CreasePatternProto = CreasePattern.prototype;

  var make_faces_winding_from_matrix = function make_faces_winding_from_matrix(faces_matrix) {
    return faces_matrix.map(function (m) {
      return m[0] * m[4] - m[1] * m[3];
    }).map(function (c) {
      return c >= 0;
    });
  };
  var make_faces_winding_from_matrix2 = function make_faces_winding_from_matrix2(faces_matrix) {
    return faces_matrix.map(function (m) {
      return m[0] * m[3] - m[1] * m[2];
    }).map(function (c) {
      return c >= 0;
    });
  };
  var make_faces_winding = function make_faces_winding(_ref) {
    var vertices_coords = _ref.vertices_coords,
        faces_vertices = _ref.faces_vertices;
    return faces_vertices.map(function (vertices) {
      return vertices.map(function (v) {
        return vertices_coords[v];
      }).map(function (point, i, arr) {
        return [point, arr[(i + 1) % arr.length]];
      }).map(function (pts) {
        return (pts[1][0] - pts[0][0]) * (pts[1][1] + pts[0][1]);
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    }).map(function (face) {
      return face < 0;
    });
  };

  var faces_winding = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_faces_winding_from_matrix: make_faces_winding_from_matrix,
    make_faces_winding_from_matrix2: make_faces_winding_from_matrix2,
    make_faces_winding: make_faces_winding
  });

  var fold_faces_layer = function fold_faces_layer(faces_layer, faces_folding) {
    var new_faces_layer = [];
    var arr = faces_layer.map(function (_, i) {
      return i;
    });
    var folding = arr.filter(function (i) {
      return faces_folding[i];
    });
    var not_folding = arr.filter(function (i) {
      return !faces_folding[i];
    });
    not_folding.sort(function (a, b) {
      return faces_layer[a] - faces_layer[b];
    }).forEach(function (face, i) {
      new_faces_layer[face] = i;
    });
    folding.sort(function (a, b) {
      return faces_layer[b] - faces_layer[a];
    })
    .forEach(function (face, i) {
      new_faces_layer[face] = not_folding.length + i;
    });
    return new_faces_layer;
  };

  var make_face_side = function make_face_side(vector, origin, face_center, face_winding) {
    var center_vector = math.core.subtract2(face_center, origin);
    var determinant = math.core.cross2(vector, center_vector);
    return face_winding ? determinant < 0 : determinant > 0;
  };
  var make_face_center = function make_face_center(graph, face) {
    return !graph.faces_vertices[face] ? [0, 0] : graph.faces_vertices[face].map(function (v) {
      return graph.vertices_coords[v];
    }).reduce(function (a, b) {
      return [a[0] + b[0], a[1] + b[1]];
    }, [0, 0]).map(function (el) {
      return el / graph.faces_vertices[face].length;
    });
  };
  var opposite_lookup = {
    M: "V",
    m: "V",
    V: "M",
    v: "M"
  };
  var get_opposite_assignment = function get_opposite_assignment(assign) {
    return opposite_lookup[assign] || assign;
  };
  var face_snapshot = function face_snapshot(graph, face) {
    return {
      center: graph.faces_center[face],
      matrix: graph.faces_matrix2[face],
      winding: graph.faces_winding[face],
      crease: graph.faces_crease[face],
      side: graph.faces_side[face],
      layer: graph.faces_layer[face]
    };
  };
  var flat_fold = function flat_fold(graph, vector, origin) {
    var assignment = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "V";
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : math.core.EPSILON;
    var opposite_assignment = get_opposite_assignment(assignment);
    populate(graph);
    if (!graph.faces_layer) {
      graph.faces_layer = Array(graph.faces_vertices.length).fill(0);
    }
    graph.faces_center = graph.faces_vertices.map(function (_, i) {
      return make_face_center(graph, i);
    });
    if (!graph.faces_matrix2) {
      graph.faces_matrix2 = make_faces_matrix2(graph, 0);
    }
    graph.faces_winding = make_faces_winding_from_matrix2(graph.faces_matrix2);
    graph.faces_crease = graph.faces_matrix2.map(math.core.invert_matrix2).map(function (matrix) {
      return math.core.multiply_matrix2_line2(matrix, vector, origin);
    });
    graph.faces_side = graph.faces_vertices.map(function (_, i) {
      return make_face_side(graph.faces_crease[i].vector, graph.faces_crease[i].origin, graph.faces_center[i], graph.faces_winding[i]);
    });
    var face0 = face_snapshot(graph, 0);
    var split_changes = graph.faces_vertices.map(function (_, i) {
      return i;
    }).reverse().map(function (i) {
      var face = face_snapshot(graph, i);
      var change = split_convex_face(graph, i, face.crease.vector, face.crease.origin, epsilon);
      if (change === undefined) {
        return undefined;
      }
      graph.edges_assignment[change.edges["new"]] = face.winding ? assignment : opposite_assignment;
      graph.edges_foldAngle[change.edges["new"]] = edge_assignment_to_foldAngle(graph.edges_assignment[change.edges["new"]]);
      var new_faces = change.faces.map[change.faces.remove];
      new_faces.forEach(function (f) {
        graph.faces_center[f] = make_face_center(graph, f);
        graph.faces_side[f] = make_face_side(face.crease.vector, face.crease.origin, graph.faces_center[f], face.winding);
        graph.faces_layer[f] = face.layer;
      });
      return change;
    }).filter(function (a) {
      return a !== undefined;
    });
    var faces_map = merge_nextmaps.apply(void 0, _toConsumableArray(split_changes.map(function (el) {
      return el.faces.map;
    })));
    var edges_map = merge_nextmaps.apply(void 0, _toConsumableArray(split_changes.map(function (el) {
      return el.edges.map;
    }).filter(function (a) {
      return a !== undefined;
    })));
    var faces_remove = split_changes.map(function (el) {
      return el.faces.remove;
    }).reverse();
    graph.faces_layer = fold_faces_layer(graph.faces_layer, graph.faces_side);
    var face0_was_split = faces_map && faces_map[0].length === 2;
    var face0_newIndex = face0_was_split ? faces_map[0].filter(function (f) {
      return graph.faces_side[f];
    }).shift() : 0;
    var face0_preMatrix = face0.matrix;
    if (assignment !== opposite_assignment) {
      face0_preMatrix = !face0_was_split && !graph.faces_side[0] ? face0.matrix : math.core.multiply_matrices2(face0.matrix, math.core.make_matrix2_reflect(face0.crease.vector, face0.crease.origin));
    }
    graph.faces_matrix2 = make_faces_matrix2(graph, face0_newIndex).map(function (matrix) {
      return math.core.multiply_matrices2(face0_preMatrix, matrix);
    });
    delete graph.faces_center;
    delete graph.faces_winding;
    delete graph.faces_crease;
    delete graph.faces_side;
    return {
      faces: {
        map: faces_map,
        remove: faces_remove
      },
      edges: {
        map: edges_map
      }
    };
  };

  var Origami = {};
  Origami.prototype = Object.create(GraphProto);
  Origami.prototype.constructor = Origami;
  Origami.prototype.flatFold = function () {
    var line = math.core.get_line(arguments);
    flat_fold(this, line.vector, line.origin);
    return this;
  };
  var OrigamiProto = Origami.prototype;

  var is_folded_form = function is_folded_form(graph) {
    return graph.frame_classes && graph.frame_classes.includes("foldedForm") || graph.file_classes && graph.file_classes.includes("foldedForm");
  };

  var query = /*#__PURE__*/Object.freeze({
    __proto__: null,
    is_folded_form: is_folded_form
  });

  var join_collinear_edges = function join_collinear_edges(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        vertices_edges = _ref.vertices_edges,
        edges_vector = _ref.edges_vector;
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    if (!edges_vector) {
      edges_vector = make_edges_vector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    if (!vertices_edges) {
      vertices_edges = make_vertices_edges$1({
        edges_vertices: edges_vertices
      });
    }
    var two_adjacencies_vertices = vertices_edges.map(function (ve, i) {
      return ve.length === 2 ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    var adjacencies_are_parallel = two_adjacencies_vertices.map(function (vertex) {
      return vertices_edges[vertex];
    }).map(function (edges) {
      return edges.map(function (edge) {
        return edges_vector[edge];
      });
    }).map(function (vecs) {
      var _math$core;
      return (_math$core = math.core).parallel.apply(_math$core, _toConsumableArray(vecs));
    });
    var vertices_remove = two_adjacencies_vertices.filter(function (vertex, i) {
      return adjacencies_are_parallel[i];
    });
    var joinable_edges = vertices_remove.map(function (v) {
      return vertices_edges[v];
    }).map(function (edges) {
      return edges[0] < edges[1] ? edges : [edges[1], edges[0]];
    });
    var edges_to_join = {};
    for (var i = 0; i < joinable_edges.length; i++) {
      if (edges_to_join[joinable_edges[i][1]] === undefined) {
        edges_to_join[joinable_edges[i][1]] = true;
      } else {
        console.log("WARNING. cannot safely remove edges. some overlaps");
      }
    }
    var edges_keep = joinable_edges.map(function (edges) {
      return edges[0];
    });
    var edges_remove = joinable_edges.map(function (edges) {
      return edges[1];
    });
    var edges_remove_other_vertex = edges_remove.map(function (edge) {
      return edges_vertices[edge];
    }).map(function (vertices, i) {
      if (vertices[0] === vertices_remove[i]) {
        return vertices[1];
      } else if (vertices[1] === vertices_remove[i]) {
        return vertices[0];
      } else {
        console.log("WARNING, removed edge cannot find vertex");
        return undefined;
      }
    });
    edges_keep.forEach(function (edge, i) {
      if (edges_vertices[edge][0] === vertices_remove[i]) {
        edges_vertices[edge][0] = edges_remove_other_vertex[i];
      } else if (edges_vertices[edge][1] === vertices_remove[i]) {
        edges_vertices[edge][1] = edges_remove_other_vertex[i];
      } else {
        console.log("WARNING, joining edges cannot find vertex");
      }
    });
    return {
      vertices: vertices_remove,
      edges: edges_remove
    };
  };

  var make_folded_strip_tacos = function make_folded_strip_tacos(folded_faces, is_circular, epsilon) {
    var faces_center = folded_faces.map(function (ends) {
      return ends ? (ends[0] + ends[1]) / 2 : undefined;
    });
    var locations = [];
    folded_faces.forEach(function (ends, i) {
      if (!ends) {
        return;
      }
      if (!is_circular && i === folded_faces.length - 1) {
        return;
      }
      var fold_end = ends[1];
      var min = fold_end - epsilon * 2;
      var max = fold_end + epsilon * 2;
      var faces = [i, (i + 1) % folded_faces.length];
      var sides = faces.map(function (f) {
        return faces_center[f];
      }).map(function (center) {
        return center > fold_end;
      });
      var taco_type = (!sides[0] && !sides[1]) * 1 + (sides[0] && sides[1]) * 2;
      var match = locations.filter(function (el) {
        return el.min < fold_end && el.max > fold_end;
      }).shift();
      var entry = {
        faces: faces,
        taco_type: taco_type
      };
      if (match) {
        match.pairs.push(entry);
      } else {
        locations.push({
          min: min,
          max: max,
          pairs: [entry]
        });
      }
    });
    return locations.map(function (el) {
      return el.pairs;
    }).filter(function (pairs) {
      return pairs.length > 1;
    }).map(function (pairs) {
      return {
        both: pairs.filter(function (el) {
          return el.taco_type === 0;
        }).map(function (el) {
          return el.faces;
        }),
        left: pairs.filter(function (el) {
          return el.taco_type === 1;
        }).map(function (el) {
          return el.faces;
        }),
        right: pairs.filter(function (el) {
          return el.taco_type === 2;
        }).map(function (el) {
          return el.faces;
        })
      };
    });
  };

  var between = function between(arr, i, j) {
    return i < j ? arr.slice(i + 1, j) : arr.slice(j + 1, i);
  };
  var validate_taco_tortilla_strip = function validate_taco_tortilla_strip(faces_folded, layers_face) {
    var is_circular = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.core.EPSILON;
    var faces_layer = invert_map(layers_face);
    var fold_location = faces_folded.map(function (ends) {
      return ends ? ends[1] : undefined;
    });
    var faces_mins = faces_folded.map(function (ends) {
      return ends ? Math.min.apply(Math, _toConsumableArray(ends)) : undefined;
    }).map(function (n) {
      return n + epsilon;
    });
    var faces_maxs = faces_folded.map(function (ends) {
      return ends ? Math.max.apply(Math, _toConsumableArray(ends)) : undefined;
    }).map(function (n) {
      return n - epsilon;
    });
    var max = faces_layer.length + (is_circular ? 0 : -1);
    var _loop = function _loop(i) {
      var j = (i + 1) % faces_layer.length;
      if (faces_layer[i] === faces_layer[j]) {
        return "continue";
      }
      var layers_between = between(layers_face, faces_layer[i], faces_layer[j]).reduce(fn_cat, []);
      var all_below_min = layers_between.map(function (index) {
        return fold_location[i] < faces_mins[index];
      }).reduce(fn_and, true);
      var all_above_max = layers_between.map(function (index) {
        return fold_location[i] > faces_maxs[index];
      }).reduce(fn_and, true);
      if (!all_below_min && !all_above_max) {
        return {
          v: false
        };
      }
    };
    for (var i = 0; i < max; i += 1) {
      var _ret = _loop(i);
      if (_ret === "continue") continue;
      if (_typeof(_ret) === "object") return _ret.v;
    }
    return true;
  };

  var validate_taco_taco_face_pairs = function validate_taco_taco_face_pairs(face_pair_stack) {
    var pair_stack = remove_single_instances(face_pair_stack);
    var pairs = {};
    var count = 0;
    for (var i = 0; i < pair_stack.length; i++) {
      if (pairs[pair_stack[i]] === undefined) {
        count++;
        pairs[pair_stack[i]] = count;
      }
      else if (pairs[pair_stack[i]] !== undefined) {
        if (pairs[pair_stack[i]] !== count) {
          return false;
        }
        count--;
        pairs[pair_stack[i]] = undefined;
      }
    }
    return true;
  };

  var build_layers = function build_layers(layers_face, faces_pair) {
    return layers_face.map(function (f) {
      return faces_pair[f];
    }).filter(fn_def);
  };
  var validate_layer_solver = function validate_layer_solver(faces_folded, layers_face, taco_face_pairs, circ_and_done, epsilon) {
    var flat_layers_face = math.core.flatten_arrays(layers_face);
    if (!validate_taco_tortilla_strip(faces_folded, layers_face, circ_and_done, epsilon)) {
      return false;
    }
    for (var i = 0; i < taco_face_pairs.length; i++) {
      var pair_stack = build_layers(flat_layers_face, taco_face_pairs[i]);
      if (!validate_taco_taco_face_pairs(pair_stack)) {
        return false;
      }
    }
    return true;
  };

  var change_map = {
    V: true,
    v: true,
    M: true,
    m: true
  };
  var assignments_to_faces_flip = function assignments_to_faces_flip(assignments) {
    var counter = 0;
    var shifted_assignments = assignments.slice(1);
    return [false].concat(shifted_assignments.map(function (a) {
      return change_map[a] ? ++counter : counter;
    }).map(function (count) {
      return count % 2 === 1;
    }));
  };
  var up_down = {
    V: 1,
    v: 1,
    M: -1,
    m: -1
  };
  var upOrDown = function upOrDown(mv, i) {
    return i % 2 === 0 ? up_down[mv] || 0 : -(up_down[mv] || 0);
  };
  var assignments_to_faces_vertical = function assignments_to_faces_vertical(assignments) {
    var iterator = 0;
    return assignments.slice(1).concat([assignments[0]]).map(function (a) {
      var updown = upOrDown(a, iterator);
      iterator += up_down[a] === undefined ? 0 : 1;
      return updown;
    });
  };
  var fold_strip_with_assignments = function fold_strip_with_assignments(faces, assignments) {
    var faces_end = assignments_to_faces_flip(assignments).map(function (flip, i) {
      return faces[i] * (flip ? -1 : 1);
    });
    var cumulative = faces.map(function () {
      return undefined;
    });
    cumulative[0] = [0, faces_end[0]];
    for (var i = 1; i < faces.length; i++) {
      if (assignments[i] === "B" || assignments[i] === "b") {
        break;
      }
      var prev = (i - 1 + faces.length) % faces.length;
      var prev_end = cumulative[prev][1];
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

  var is_boundary = {
    "B": true,
    "b": true
  };
  var single_vertex_solver = function single_vertex_solver(ordered_scalars, assignments) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.core.EPSILON;
    var faces_folded = fold_strip_with_assignments(ordered_scalars, assignments);
    var faces_updown = assignments_to_faces_vertical(assignments);
    var is_circular = assignments.map(function (a) {
      return !is_boundary[a];
    }).reduce(function (a, b) {
      return a && b;
    }, true);
    if (is_circular) {
      var start = faces_folded[0][0];
      var end = faces_folded[faces_folded.length - 1][1];
      if (Math.abs(start - end) > epsilon) {
        return [];
      }
    }
    var taco_face_pairs = make_folded_strip_tacos(faces_folded, is_circular, epsilon).map(function (taco) {
      return [taco.left, taco.right].map(invert_map).filter(function (arr) {
        return arr.length > 1;
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var recurse = function recurse() {
      var layers_face = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [0];
      var face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var layer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var next_face = face + 1;
      var next_dir = faces_updown[face];
      var is_done = face >= ordered_scalars.length - 1;
      var circ_and_done = is_circular && is_done;
      if (!validate_layer_solver(faces_folded, layers_face, taco_face_pairs, circ_and_done, epsilon)) {
        return [];
      }
      if (circ_and_done) {
        var faces_layer = invert_map(layers_face);
        var first_face_layer = faces_layer[0];
        var last_face_layer = faces_layer[face];
        if (next_dir > 0 && last_face_layer > first_face_layer) {
          return [];
        }
        if (next_dir < 0 && last_face_layer < first_face_layer) {
          return [];
        }
      }
      if (is_done) {
        return [layers_face];
      }
      if (next_dir === 0) {
        layers_face[layer] = [next_face].concat(layers_face[layer]);
        return recurse(layers_face, next_face, layer);
      }
      var splice_layers = next_dir === 1 ? Array.from(Array(layers_face.length - layer)).map(function (_, i) {
        return layer + i + 1;
      }) : Array.from(Array(layer + 1)).map(function (_, i) {
        return i;
      });
      var next_layers_faces = splice_layers.map(function (i) {
        return clone(layers_face);
      });
      next_layers_faces.forEach(function (layers, i) {
        return layers.splice(splice_layers[i], 0, next_face);
      });
      return next_layers_faces.map(function (layers, i) {
        return recurse(layers, next_face, splice_layers[i]);
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
    };
    return recurse().map(invert_map);
  };

  var make_vertex_faces_layer = function make_vertex_faces_layer(_ref, vertex, epsilon) {
    var vertices_faces = _ref.vertices_faces,
        vertices_sectors = _ref.vertices_sectors,
        vertices_edges = _ref.vertices_edges,
        edges_assignment = _ref.edges_assignment;
    var faces = vertices_faces[vertex];
    var range = get_longest_array(circular_array_valid_ranges(faces));
    if (range === undefined) {
      return;
    }
    while (range[1] < range[0]) {
      range[1] += faces.length;
    }
    var indices = Array.from(Array(range[1] - range[0] + 1)).map(function (_, i) {
      return (range[0] + i) % faces.length;
    });
    var sectors = indices.map(function (i) {
      return vertices_sectors[vertex][i];
    });
    var assignments = indices.map(function (i) {
      return vertices_edges[vertex][i];
    }).map(function (edge) {
      return edges_assignment[edge];
    });
    var sectors_layer = single_vertex_solver(sectors, assignments, epsilon);
    var faces_layer = sectors_layer.map(invert_map).map(function (arr) {
      return arr.map(function (face) {
        return _typeof(face) !== "object" ? faces[indices[face]] : face.map(function (f) {
          return faces[indices[f]];
        });
      });
    }).map(invert_map);
    faces_layer.face = faces[indices[0]];
    return faces_layer;
  };

  var flip_solutions = function flip_solutions(solutions) {
    var face = solutions.face;
    var flipped = solutions.map(invert_map).map(function (list) {
      return list.reverse();
    }).map(invert_map);
    flipped.face = face;
    return flipped;
  };
  var make_vertices_faces_layer = function make_vertices_faces_layer(graph) {
    var epsilon = arguments.length > 2 ? arguments[2] : undefined;
    if (!graph.vertices_sectors) {
      graph.vertices_sectors = make_vertices_sectors(graph);
    }
    var faces_coloring = make_faces_winding(graph).map(function (c) {
      return !c;
    });
    var vertices_faces_layer = graph.vertices_sectors.map(function (_, vertex) {
      return make_vertex_faces_layer(graph, vertex, epsilon);
    });
    var vertices_solutions_flip = vertices_faces_layer.map(function (solution) {
      return faces_coloring[solution.face];
    });
    return vertices_faces_layer.map(function (solutions, i) {
      return vertices_solutions_flip[i] ? flip_solutions(solutions) : solutions;
    });
  };

  var make_edges_faces_overlap = function make_edges_faces_overlap(_ref2, epsilon) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices,
        edges_vector = _ref2.edges_vector,
        edges_faces = _ref2.edges_faces;
        _ref2.faces_edges;
        var faces_vertices = _ref2.faces_vertices;
    if (!edges_vector) {
      edges_vector = make_edges_vector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var faces_winding = make_faces_winding({
      vertices_coords: vertices_coords,
      faces_vertices: faces_vertices
    });
    var edges_origin = edges_vertices.map(function (verts) {
      return vertices_coords[verts[0]];
    });
    var matrix = edges_vertices.map(function () {
      return Array.from(Array(faces_vertices.length));
    });
    edges_faces.forEach(function (faces, e) {
      return faces.forEach(function (f) {
        matrix[e][f] = false;
      });
    });
    edges_faces.forEach(function (faces, e) {
      return faces.forEach(function (f) {
        matrix[e][f] = false;
      });
    });
    var edges_vertices_coords = edges_vertices.map(function (verts) {
      return verts.map(function (v) {
        return vertices_coords[v];
      });
    });
    var faces_vertices_coords = faces_vertices.map(function (verts) {
      return verts.map(function (v) {
        return vertices_coords[v];
      });
    });
    for (var f = 0; f < faces_winding.length; f++) {
      if (!faces_winding[f]) {
        faces_vertices_coords[f].reverse();
      }
    }
    matrix.forEach(function (row, e) {
      return row.forEach(function (val, f) {
        if (val === false) {
          return;
        }
        var point_in_poly = edges_vertices_coords[e].map(function (point) {
          return math.core.overlap_convex_polygon_point(faces_vertices_coords[f], point, math.core.exclude, epsilon);
        }).reduce(function (a, b) {
          return a || b;
        }, false);
        if (point_in_poly) {
          matrix[e][f] = true;
          return;
        }
        var edge_intersect = math.core.intersect_convex_polygon_line(faces_vertices_coords[f], edges_vector[e], edges_origin[e], math.core.exclude_s, math.core.exclude_s, epsilon);
        if (edge_intersect) {
          matrix[e][f] = true;
          return;
        }
        matrix[e][f] = false;
      });
    });
    return matrix;
  };

  var make_faces_polygon = function make_faces_polygon(_ref, epsilon) {
    var vertices_coords = _ref.vertices_coords,
        faces_vertices = _ref.faces_vertices;
    return faces_vertices.map(function (verts) {
      return verts.map(function (v) {
        return vertices_coords[v];
      });
    }).map(function (polygon) {
      return math.core.make_polygon_non_collinear(polygon, epsilon);
    });
  };

  var make_faces_faces_overlap = function make_faces_faces_overlap(_ref) {
    var vertices_coords = _ref.vertices_coords,
        faces_vertices = _ref.faces_vertices;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var matrix = Array.from(Array(faces_vertices.length)).map(function () {
      return Array.from(Array(faces_vertices.length));
    });
    var faces_polygon = make_faces_polygon({
      vertices_coords: vertices_coords,
      faces_vertices: faces_vertices
    }, epsilon);
    for (var i = 0; i < faces_vertices.length - 1; i++) {
      for (var j = i + 1; j < faces_vertices.length; j++) {
        var overlap = math.core.overlap_convex_polygons(faces_polygon[i], faces_polygon[j],
        epsilon);
        matrix[i][j] = overlap;
        matrix[j][i] = overlap;
      }
    }
    return matrix;
  };

  var make_edges_edges_parallel = function make_edges_edges_parallel(_ref, epsilon) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        edges_vector = _ref.edges_vector;
    if (!edges_vector) {
      edges_vector = make_edges_vector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var edge_count = edges_vector.length;
    var edges_edges_parallel = Array.from(Array(edge_count)).map(function () {
      return Array.from(Array(edge_count));
    });
    for (var i = 0; i < edge_count - 1; i++) {
      for (var j = i + 1; j < edge_count; j++) {
        var p = math.core.parallel(edges_vector[i], edges_vector[j], epsilon);
        edges_edges_parallel[i][j] = p;
        edges_edges_parallel[j][i] = p;
      }
    }
    return edges_edges_parallel;
  };
  var overwrite_edges_overlaps = function overwrite_edges_overlaps(matrix, vectors, origins, func, epsilon) {
    for (var i = 0; i < matrix.length - 1; i++) {
      for (var j = i + 1; j < matrix.length; j++) {
        if (!matrix[i][j]) {
          continue;
        }
        matrix[i][j] = math.core.overlap_line_line(vectors[i], origins[i], vectors[j], origins[j], func, func, epsilon);
        matrix[j][i] = matrix[i][j];
      }
    }
  };
  var make_edges_edges_crossing = function make_edges_edges_crossing(_ref2, epsilon) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices,
        edges_vector = _ref2.edges_vector;
    if (!edges_vector) {
      edges_vector = make_edges_vector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var edges_origin = edges_vertices.map(function (verts) {
      return vertices_coords[verts[0]];
    });
    var matrix = make_edges_edges_parallel({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_vector: edges_vector
    }, epsilon).map(function (row) {
      return row.map(function (b) {
        return !b;
      });
    });
    for (var i = 0; i < matrix.length; i++) {
      matrix[i][i] = undefined;
    }
    overwrite_edges_overlaps(matrix, edges_vector, edges_origin, math.core.exclude_s, epsilon);
    return matrix;
  };
  var make_edges_edges_parallel_overlap = function make_edges_edges_parallel_overlap(_ref3, epsilon) {
    var vertices_coords = _ref3.vertices_coords,
        edges_vertices = _ref3.edges_vertices,
        edges_vector = _ref3.edges_vector;
    if (!edges_vector) {
      edges_vector = make_edges_vector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var edges_origin = edges_vertices.map(function (verts) {
      return vertices_coords[verts[0]];
    });
    var matrix = make_edges_edges_parallel({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_vector: edges_vector
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
    assign: assign$1,
    add_vertices: add_vertices,
    add_edges: add_edges,
    split_edge: split_edge,
    split_face: split_convex_face,
    flat_fold: flat_fold,
    clean: clean,
    get_circular_edges: get_circular_edges,
    get_duplicate_edges: get_duplicate_edges,
    get_duplicate_vertices: get_duplicate_vertices,
    get_collinear_vertices: get_collinear_vertices,
    count: count,
    implied: implied_count,
    fragment: fragment,
    remove: remove_geometry_indices,
    populate: populate,
    subgraph: subgraph,
    explode_faces: explode_faces,
    clip: clip,
    intersect_convex_face_line: intersect_convex_face_line,
    join_collinear_edges: join_collinear_edges,
    make_vertex_faces_layer: make_vertex_faces_layer,
    make_vertices_faces_layer: make_vertices_faces_layer,
    make_edges_faces_overlap: make_edges_faces_overlap,
    make_faces_faces_overlap: make_faces_faces_overlap
  }, make, edges_edges, vertices_coords_folded, face_spanning_tree, faces_matrix, faces_winding,
  transform, boundary, walk, nearest, fold_object, sort, span, maps, query,
  remove_methods, vertices_isolated, arrays);

  var Create = {};
  var make_rect_vertices_coords = function make_rect_vertices_coords(w, h) {
    return [[0, 0], [w, 0], [w, h], [0, h]];
  };
  var make_closed_polygon = function make_closed_polygon(vertices_coords) {
    return populate({
      vertices_coords: vertices_coords,
      edges_vertices: vertices_coords.map(function (_, i, arr) {
        return [i, (i + 1) % arr.length];
      }),
      edges_assignment: Array(vertices_coords.length).fill("B")
    });
  };
  var polygon_names = [null, null, null, "triangle", null, "pentagon", "hexagon", "heptagon", "octogon", "nonagon", "decagon", "hendecagon", "dodecagon"];
  polygon_names.map(function (str, i) {
    return str === null ? i : undefined;
  }).filter(function (a) {
    return a !== undefined;
  }).forEach(function (i) {
    return delete polygon_names[i];
  });
  polygon_names.forEach(function (name, i) {
    Create[name] = function () {
      return make_closed_polygon(math.core.make_regular_polygon_side_length(i));
    };
  });
  Create.square = function () {
    return make_closed_polygon(make_rect_vertices_coords(1, 1));
  };
  Create.rectangle = function () {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return make_closed_polygon(make_rect_vertices_coords(width, height));
  };
  Create.circle = function () {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 90;
    return make_closed_polygon(math.core.make_regular_polygon(sides));
  };
  Create.kite = function () {
    return populate({
      vertices_coords: [[0, 0], [Math.sqrt(2) - 1, 0], [1, 0], [1, 1 - (Math.sqrt(2) - 1)], [1, 1], [0, 1]],
      edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]],
      edges_assignment: Array.from("BBBBBBVVF")
    });
  };

  var Constructors = Object.create(null);
  var ConstructorPrototypes = {
    graph: GraphProto,
    cp: CreasePatternProto,
    origami: OrigamiProto
  };
  var default_graph = {
    graph: function graph() {
      return {};
    },
    cp: Create.square,
    origami: Create.square
  };
  Object.keys(ConstructorPrototypes).forEach(function (name) {
    Constructors[name] = function () {
      var argFolds = Array.from(arguments).filter(function (a) {
        return fold_object_certainty(a);
      })
      .map(function (obj) {
        return JSON.parse(JSON.stringify(obj));
      });
      return populate(Object.assign.apply(Object, [Object.create(ConstructorPrototypes[name]), argFolds.length ? {} : default_graph[name]()].concat(_toConsumableArray(argFolds), [{
        file_spec: file_spec,
        file_creator: file_creator
      }])));
    };
    Constructors[name].prototype = ConstructorPrototypes[name];
    Constructors[name].prototype.constructor = Constructors[name];
    Object.keys(Create).forEach(function (funcName) {
      Constructors[name][funcName] = function () {
        return Constructors[name](Create[funcName].apply(Create, arguments));
      };
    });
  });
  Object.assign(Constructors.graph, graph_methods);

  var intersection_ud = function intersection_ud(line1, line2) {
    var det = math.core.cross2(line1.u, line2.u);
    if (Math.abs(det) < math.core.EPSILON) {
      return undefined;
    }
    var x = line1.d * line2.u[1] - line2.d * line1.u[1];
    var y = line2.d * line1.u[0] - line1.d * line2.u[0];
    return [x / det, y / det];
  };
  var axiom1ud = function axiom1ud(point1, point2) {
    var u = math.core.normalize2(math.core.rotate90(math.core.subtract2(point2, point1)));
    return {
      u: u,
      d: math.core.dot2(math.core.add2(point1, point2), u) / 2.0
    };
  };
  var axiom2ud = function axiom2ud(point1, point2) {
    var u = math.core.normalize2(math.core.subtract2(point2, point1));
    return {
      u: u,
      d: math.core.dot2(math.core.add2(point1, point2), u) / 2.0
    };
  };
  var axiom3ud = function axiom3ud(line1, line2) {
    var intersect = intersection_ud(line1, line2);
    return intersect === undefined ? [{
      u: line1.u,
      d: (line1.d + line2.d * math.core.dot2(line1.u, line2.u)) / 2.0
    }] : [math.core.add2, math.core.subtract2].map(function (f) {
      return math.core.normalize2(f(line1.u, line2.u));
    }).map(function (u) {
      return {
        u: u,
        d: math.core.dot2(intersect, u)
      };
    });
  };
  var axiom4ud = function axiom4ud(line, point) {
    var u = math.core.rotate90(line.u);
    var d = math.core.dot2(point, u);
    return {
      u: u,
      d: d
    };
  };
  var axiom5ud = function axiom5ud(line, point1, point2) {
    var p1base = math.core.dot2(point1, line.u);
    var a = line.d - p1base;
    var c = math.core.distance2(point1, point2);
    if (a > c) {
      return [];
    }
    var b = Math.sqrt(c * c - a * a);
    var a_vec = math.core.scale2(line.u, a);
    var base_center = math.core.add2(point1, a_vec);
    var base_vector = math.core.scale2(math.core.rotate90(line.u), b);
    var mirrors = b < math.core.EPSILON ? [base_center] : [math.core.add2(base_center, base_vector), math.core.subtract2(base_center, base_vector)];
    return mirrors.map(function (pt) {
      return math.core.normalize2(math.core.subtract2(point2, pt));
    }).map(function (u) {
      return {
        u: u,
        d: math.core.dot2(point1, u)
      };
    });
  };
  var cubrt = function cubrt(n) {
    return n < 0 ? -Math.pow(-n, 1 / 3) : Math.pow(n, 1 / 3);
  };
  var polynomial = function polynomial(degree, a, b, c, d) {
    switch (degree) {
      case 1:
        return [-d / c];
      case 2:
        {
          var discriminant = Math.pow(c, 2.0) - 4.0 * b * d;
          if (discriminant < -math.core.EPSILON) {
            return [];
          }
          var q1 = -c / (2.0 * b);
          if (discriminant < math.core.EPSILON) {
            return [q1];
          }
          var q2 = Math.sqrt(discriminant) / (2.0 * b);
          return [q1 + q2, q1 - q2];
        }
      case 3:
        {
          var a2 = b / a;
          var a1 = c / a;
          var a0 = d / a;
          var q = (3.0 * a1 - Math.pow(a2, 2.0)) / 9.0;
          var r = (9.0 * a2 * a1 - 27.0 * a0 - 2.0 * Math.pow(a2, 3.0)) / 54.0;
          var d0 = Math.pow(q, 3.0) + Math.pow(r, 2.0);
          var u = -a2 / 3.0;
          if (d0 > 0.0) {
            var _sqrt_d = Math.sqrt(d0);
            var s = cubrt(r + _sqrt_d);
            var t = cubrt(r - _sqrt_d);
            return [u + s + t];
          }
          if (Math.abs(d0) < math.core.EPSILON) {
            var _s = Math.pow(r, 1.0 / 3.0);
            if (r < 0.0) {
              return [];
            }
            return [u + 2.0 * _s, u - _s];
          }
          var sqrt_d0 = Math.sqrt(-d0);
          var phi = Math.atan2(sqrt_d0, r) / 3.0;
          var r_s = Math.pow(Math.pow(r, 2.0) - d0, 1.0 / 6.0);
          var s_r = r_s * Math.cos(phi);
          var s_i = r_s * Math.sin(phi);
          return [u + 2.0 * s_r, u - s_r - Math.sqrt(3.0) * s_i, u - s_r + Math.sqrt(3.0) * s_i];
        }
      default:
        return [];
    }
  };
  var axiom6ud = function axiom6ud(line1, line2, point1, point2) {
    if (Math.abs(1.0 - math.core.dot2(line1.u, point1) / line1.d) < 0.02) {
      return [];
    }
    var line_vec = math.core.rotate90(line1.u);
    var vec1 = math.core.subtract2(math.core.add2(point1, math.core.scale2(line1.u, line1.d)), math.core.scale2(point2, 2.0));
    var vec2 = math.core.subtract2(math.core.scale2(line1.u, line1.d), point1);
    var c1 = math.core.dot2(point2, line2.u) - line2.d;
    var c2 = 2.0 * math.core.dot2(vec2, line_vec);
    var c3 = math.core.dot2(vec2, vec2);
    var c4 = math.core.dot2(math.core.add2(vec1, vec2), line_vec);
    var c5 = math.core.dot2(vec1, vec2);
    var c6 = math.core.dot2(line_vec, line2.u);
    var c7 = math.core.dot2(vec2, line2.u);
    var a = c6;
    var b = c1 + c4 * c6 + c7;
    var c = c1 * c2 + c5 * c6 + c4 * c7;
    var d = c1 * c3 + c5 * c7;
    var polynomial_degree = 0;
    if (Math.abs(c) > math.core.EPSILON) {
      polynomial_degree = 1;
    }
    if (Math.abs(b) > math.core.EPSILON) {
      polynomial_degree = 2;
    }
    if (Math.abs(a) > math.core.EPSILON) {
      polynomial_degree = 3;
    }
    return polynomial(polynomial_degree, a, b, c, d).map(function (n) {
      return math.core.add2(math.core.scale2(line1.u, line1.d), math.core.scale2(line_vec, n));
    }).map(function (p) {
      return {
        p: p,
        u: math.core.normalize2(math.core.subtract2(p, point1))
      };
    }).map(function (el) {
      return {
        u: el.u,
        d: math.core.dot2(el.u, math.core.midpoint2(el.p, point1))
      };
    });
  };
  var axiom7ud = function axiom7ud(line1, line2, point) {
    var u = math.core.rotate90(line1.u);
    var u_u = math.core.dot2(u, line2.u);
    if (Math.abs(u_u) < math.core.EPSILON) {
      return undefined;
    }
    var a = math.core.dot2(point, u);
    var b = math.core.dot2(point, line2.u);
    var d = (line2.d + 2.0 * a * u_u - b) / (2.0 * u_u);
    return {
      u: u,
      d: d
    };
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

  var axiom1 = function axiom1(point1, point2) {
    var _math$core;
    return {
      vector: math.core.normalize2((_math$core = math.core).subtract2.apply(_math$core, _toConsumableArray(math.core.resize_up(point2, point1)))),
      origin: point1
    };
  };
  var axiom2 = function axiom2(point1, point2) {
    var _math$core2;
    return {
      vector: math.core.normalize2(math.core.rotate90((_math$core2 = math.core).subtract2.apply(_math$core2, _toConsumableArray(math.core.resize_up(point2, point1))))),
      origin: math.core.midpoint2(point1, point2)
    };
  };
  var axiom3 = function axiom3(line1, line2) {
    return math.core.bisect_lines2(line1.vector, line1.origin, line2.vector, line2.origin);
  };
  var axiom4 = function axiom4(line, point) {
    return {
      vector: math.core.rotate90(math.core.normalize2(line.vector)),
      origin: point
    };
  };
  var axiom5 = function axiom5(line, point1, point2) {
    return (math.core.intersect_circle_line(math.core.distance2(point1, point2), point1, line.vector, line.origin, math.core.include_l) || []).map(function (sect) {
      var _math$core3;
      return {
        vector: math.core.normalize2(math.core.rotate90((_math$core3 = math.core).subtract2.apply(_math$core3, _toConsumableArray(math.core.resize_up(sect, point2))))),
        origin: math.core.midpoint2(point2, sect)
      };
    });
  };
  var axiom6 = function axiom6(line1, line2, point1, point2) {
    return axiom6ud(math.core.vector_origin_to_ud(line1), math.core.vector_origin_to_ud(line2), point1, point2).map(math.core.ud_to_vector_origin);
  };
  var axiom7 = function axiom7(line1, line2, point) {
    var _math$core4;
    var intersect = math.core.intersect_line_line(line1.vector, line1.origin, line2.vector, point, math.core.include_l, math.core.include_l);
    return intersect === undefined ? undefined : {
      vector: math.core.normalize2(math.core.rotate90((_math$core4 = math.core).subtract2.apply(_math$core4, _toConsumableArray(math.core.resize_up(intersect, point))))),
      origin: math.core.midpoint2(point, intersect)
    };
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

  var reflect_point$1 = function reflect_point(foldLine, point) {
    var matrix = math.core.make_matrix2_reflect(foldLine.vector, foldLine.origin);
    return math.core.multiply_matrix2_vector2(matrix, point);
  };
  var validate_axiom1_2 = function validate_axiom1_2(params, boundary) {
    return [params.points.map(function (p) {
      return math.core.overlap_convex_polygon_point(boundary, p, ear.math.include);
    }).reduce(function (a, b) {
      return a && b;
    }, true)];
  };
  var validate_axiom3 = function validate_axiom3(params, boundary) {
    var segments = params.lines.map(function (line) {
      return math.core.clip_line_in_convex_polygon(boundary, line.vector, line.origin, math.core.include, math.core.include_l);
    });
    if (segments[0] === undefined || segments[1] === undefined) {
      return [false, false];
    }
    var results = axiom3(params.lines[0], params.lines[1]);
    var results_clip = results.map(function (line) {
      return line === undefined ? undefined : math.core.intersect_convex_polygon_line(boundary, line.vector, line.origin, ear.math.include_s, ear.math.exclude_l);
    });
    var results_inside = [0, 1].map(function (i) {
      return results_clip[i] !== undefined;
    });
    var seg0Reflect = results.map(function (foldLine, i) {
      return foldLine === undefined ? undefined : [reflect_point$1(foldLine, segments[0][0]), reflect_point$1(foldLine, segments[0][1])];
    });
    var reflectMatch = seg0Reflect.map(function (seg, i) {
      return seg === undefined ? false : math.core.overlap_line_point(math.core.subtract(segments[1][1], segments[1][0]), segments[1][0], seg[0], math.core.include_s) || math.core.overlap_line_point(math.core.subtract(segments[1][1], segments[1][0]), segments[1][0], seg[1], math.core.include_s) || math.core.overlap_line_point(math.core.subtract(seg[1], seg[0]), seg[0], segments[1][0], math.core.include_s) || math.core.overlap_line_point(math.core.subtract(seg[1], seg[0]), seg[0], segments[1][1], math.core.include_s);
    });
    return [0, 1].map(function (i) {
      return reflectMatch[i] === true && results_inside[i] === true;
    });
  };
  var validate_axiom4 = function validate_axiom4(params, boundary) {
    var intersect = math.core.intersect_line_line(params.lines[0].vector, params.lines[0].origin, math.core.rotate90(params.lines[0].vector), params.points[0], math.core.include_l, math.core.include_l);
    return [[params.points[0], intersect].filter(function (a) {
      return a !== undefined;
    }).map(function (p) {
      return math.core.overlap_convex_polygon_point(boundary, p, math.core.include);
    }).reduce(function (a, b) {
      return a && b;
    }, true)];
  };
  var validate_axiom5 = function validate_axiom5(params, boundary) {
    var result = axiom5(params.lines[0], params.points[0], params.points[1]);
    if (result.length === 0) {
      return [];
    }
    var testParamPoints = params.points.map(function (point) {
      return math.core.overlap_convex_polygon_point(boundary, point, math.core.include);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
    var testReflections = result.map(function (foldLine) {
      return reflect_point$1(foldLine, params.points[1]);
    }).map(function (point) {
      return math.core.overlap_convex_polygon_point(boundary, point, math.core.include);
    });
    return testReflections.map(function (ref) {
      return ref && testParamPoints;
    });
  };
  var validate_axiom6 = function validate_axiom6(params, boundary) {
    var results = axiom6(params.lines[0], params.lines[1], params.points[0], params.points[1]);
    if (results.length === 0) {
      return [];
    }
    var testParamPoints = params.points.map(function (point) {
      return math.core.overlap_convex_polygon_point(boundary, point, math.core.include);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
    if (!testParamPoints) {
      return results.map(function () {
        return false;
      });
    }
    var testReflect0 = results.map(function (foldLine) {
      return reflect_point$1(foldLine, params.points[0]);
    }).map(function (point) {
      return math.core.overlap_convex_polygon_point(boundary, point, math.core.include);
    });
    var testReflect1 = results.map(function (foldLine) {
      return reflect_point$1(foldLine, params.points[1]);
    }).map(function (point) {
      return math.core.overlap_convex_polygon_point(boundary, point, math.core.include);
    });
    return results.map(function (_, i) {
      return testReflect0[i] && testReflect1[i];
    });
  };
  var validate_axiom7 = function validate_axiom7(params, boundary) {
    var paramPointTest = math.core.overlap_convex_polygon_point(boundary, params.points[0], math.core.include);
    var foldLine = axiom7(params.lines[1], params.lines[0], params.points[0]);
    if (foldLine === undefined) {
      return [false];
    }
    var reflected = reflect_point$1(foldLine, params.points[0]);
    var reflectTest = math.core.overlap_convex_polygon_point(boundary, reflected, math.core.include);
    var paramLineTest = math.core.intersect_convex_polygon_line(boundary, params.lines[1].vector, params.lines[1].origin, math.core.include_s, math.core.include_l) !== undefined;
    return [paramPointTest && reflectTest && paramLineTest];
  };
  var validate_axiom_funcs = [null, validate_axiom1_2, validate_axiom1_2, validate_axiom3, validate_axiom4, validate_axiom5, validate_axiom6, validate_axiom7];
  delete validate_axiom_funcs[0];
  var validate_axiom = function validate_axiom(number, params, obj) {
    var boundary = _typeof(obj) === "object" && obj.vertices_coords ? get_boundary(obj).vertices.map(function (v) {
      return obj.vertices_coords[v];
    }) : obj;
    return validate_axiom_funcs[number](params, boundary);
  };
  Object.keys(validate_axiom_funcs).forEach(function (number) {
    validate_axiom[number] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return validate_axiom.apply(void 0, [number].concat(args));
    };
  });

  var axiom_returns_array = function axiom_returns_array(number) {
    switch (number) {
      case 3:
      case "3":
      case 5:
      case "5":
      case 6:
      case "6":
        return true;
      default:
        return false;
    }
  };
  var check_params = function check_params(params) {
    return {
      points: (params.points || []).map(function (p) {
        return math.core.get_vector(p);
      }),
      lines: (params.lines || []).map(function (l) {
        return math.core.get_line(l);
      }),
      lines_ud: (params.lines || []).map(function (l) {
        return l.u !== undefined && l.d !== undefined ? l : undefined;
      }).filter(function (a) {
        return a !== undefined;
      })
    };
  };
  var axiom_vector_origin = function axiom_vector_origin(number, params) {
    var result = AxiomsVO["axiom".concat(number)].apply(AxiomsVO, _toConsumableArray(params.lines).concat(_toConsumableArray(params.points)));
    var array_results = axiom_returns_array(number) ? result : [result].filter(function (a) {
      return a !== undefined;
    });
    return array_results.map(function (line) {
      return math.line(line);
    });
  };
  var axiom_normal_distance = function axiom_normal_distance(number, params) {
    var result = AxiomsUD["axiom".concat(number, "ud")].apply(AxiomsUD, _toConsumableArray(params.lines_ud).concat(_toConsumableArray(params.points)));
    var array_results = axiom_returns_array(number) ? result : [result].filter(function (a) {
      return a !== undefined;
    });
    return array_results.map(function (line) {
      return math.line.ud(line);
    });
  };
  var axiom_boundaryless = function axiom_boundaryless(number, params) {
    return params.lines_ud.length === params.lines.length ? axiom_normal_distance(number, params) : axiom_vector_origin(number, params);
  };
  var filter_with_boundary = function filter_with_boundary(number, params, solutions, boundary) {
    if (boundary == null) {
      return;
    }
    validate_axiom(number, params, boundary).forEach(function (valid, i) {
      if (!valid) {
        delete solutions[i];
      }
    });
  };
  var axiom = function axiom(number) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var boundary = arguments.length > 2 ? arguments[2] : undefined;
    var parameters = check_params(params);
    var solutions = axiom_boundaryless(number, parameters);
    filter_with_boundary(number, parameters, solutions, boundary);
    return solutions;
  };
  Object.keys(AxiomsVO).forEach(function (key) {
    axiom[key] = AxiomsVO[key];
  });
  Object.keys(AxiomsUD).forEach(function (key) {
    axiom[key] = AxiomsUD[key];
  });
  [1, 2, 3, 4, 5, 6, 7].forEach(function (number) {
    axiom[number] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return axiom.apply(void 0, [number].concat(args));
    };
  });
  axiom.validate = validate_axiom;

  var line_line_for_arrows = function line_line_for_arrows(a, b) {
    return math.core.intersect_line_line(a.vector, a.origin, b.vector, b.origin, math.core.include_l, math.core.include_l);
  };
  var reflect_point = function reflect_point(foldLine, point) {
    var matrix = math.core.make_matrix2_reflect(foldLine.vector, foldLine.origin);
    return math.core.multiply_matrix2_vector2(matrix, point);
  };
  var boundary_for_arrows = function boundary_for_arrows(_ref) {
    var vertices_coords = _ref.vertices_coords;
    return math.core.convex_hull(vertices_coords);
  };
  var widest_perp = function widest_perp(graph, foldLine, point) {
    var boundary = boundary_for_arrows(graph);
    if (point === undefined) {
      var _math$core;
      var foldSegment = math.core.clip_line_in_convex_polygon(boundary, foldLine.vector, foldLine.origin, math.core.exclude, math.core.include_l);
      point = (_math$core = math.core).midpoint.apply(_math$core, _toConsumableArray(foldSegment));
    }
    var perpVector = math.core.rotate270(foldLine.vector);
    var smallest = math.core.clip_line_in_convex_polygon(boundary, perpVector, point, math.core.exclude, math.core.include_l).map(function (pt) {
      return math.core.distance(point, pt);
    }).sort(function (a, b) {
      return a - b;
    }).shift();
    var scaled = math.core.scale(math.core.normalize(perpVector), smallest);
    return math.segment(math.core.add(point, math.core.flip(scaled)), math.core.add(point, scaled));
  };
  var between_2_segments = function between_2_segments(params, segments, foldLine) {
    var _math$line;
    var midpoints = segments.map(function (seg) {
      return math.core.midpoint(seg[0], seg[1]);
    });
    var midpointLine = (_math$line = math.line).fromPoints.apply(_math$line, _toConsumableArray(midpoints));
    var origin = math.intersect(foldLine, midpointLine);
    var perpLine = math.line(foldLine.vector.rotate90(), origin);
    return math.segment(params.lines.map(function (line) {
      return math.intersect(line, perpLine);
    }));
  };
  var between_2_intersecting_segments = function between_2_intersecting_segments(params, intersect, foldLine, boundary) {
    var paramVectors = params.lines.map(function (l) {
      return l.vector;
    });
    var flippedVectors = paramVectors.map(math.core.flip);
    var paramRays = paramVectors.concat(flippedVectors).map(function (vec) {
      return math.ray(vec, intersect);
    });
    var a1 = paramRays.filter(function (ray) {
      return math.core.dot(ray.vector, foldLine.vector) > 0 && math.core.cross2(ray.vector, foldLine.vector) > 0;
    }).shift();
    var a2 = paramRays.filter(function (ray) {
      return math.core.dot(ray.vector, foldLine.vector) > 0 && math.core.cross2(ray.vector, foldLine.vector) < 0;
    }).shift();
    var b1 = paramRays.filter(function (ray) {
      return math.core.dot(ray.vector, foldLine.vector) < 0 && math.core.cross2(ray.vector, foldLine.vector) > 0;
    }).shift();
    var b2 = paramRays.filter(function (ray) {
      return math.core.dot(ray.vector, foldLine.vector) < 0 && math.core.cross2(ray.vector, foldLine.vector) < 0;
    }).shift();
    var rayEndpoints = [a1, a2, b1, b2].map(function (ray) {
      return math.core.intersect_convex_polygon_line(boundary, ray.vector, ray.origin, math.core.exclude_s, math.core.exclude_r).shift().shift();
    });
    var rayLengths = rayEndpoints.map(function (pt) {
      return math.core.distance(pt, intersect);
    });
    var arrowStart = rayLengths[0] < rayLengths[1] ? rayEndpoints[0] : rayEndpoints[1];
    var arrowEnd = rayLengths[0] < rayLengths[1] ? math.core.add(a2.origin, a2.vector.normalize().scale(rayLengths[0])) : math.core.add(a1.origin, a1.vector.normalize().scale(rayLengths[1]));
    var arrowStart2 = rayLengths[2] < rayLengths[3] ? rayEndpoints[2] : rayEndpoints[3];
    var arrowEnd2 = rayLengths[2] < rayLengths[3] ? math.core.add(b2.origin, b2.vector.normalize().scale(rayLengths[2])) : math.core.add(b1.origin, b1.vector.normalize().scale(rayLengths[3]));
    return [math.segment(arrowStart, arrowEnd), math.segment(arrowStart2, arrowEnd2)];
  };
  var axiom_1_arrows = function axiom_1_arrows(params, graph) {
    return axiom(1, params).map(function (foldLine) {
      return [widest_perp(graph, foldLine)];
    });
  };
  var axiom_2_arrows = function axiom_2_arrows(params) {
    return [[math.segment(params.points)]];
  };
  var axiom_3_arrows = function axiom_3_arrows(params, graph) {
    var boundary = boundary_for_arrows(graph);
    var segs = params.lines.map(function (l) {
      return math.core.clip_line_in_convex_polygon(boundary, l.vector, l.origin, math.core.exclude, math.core.include_l);
    });
    var segVecs = segs.map(function (seg) {
      return math.core.subtract(seg[1], seg[0]);
    });
    var intersect = math.core.intersect_line_line(segVecs[0], segs[0][0], segVecs[1], segs[1][0], math.core.exclude_s, math.core.exclude_s);
    return !intersect ? [between_2_segments(params, segs, axiom(3, params).filter(function (a) {
      return a !== undefined;
    }).shift())] : axiom(3, params).map(function (foldLine) {
      return between_2_intersecting_segments(params, intersect, foldLine, boundary);
    });
  };
  var axiom_4_arrows = function axiom_4_arrows(params, graph) {
    return axiom(4, params).map(function (foldLine) {
      return [widest_perp(graph, foldLine, line_line_for_arrows(foldLine, params.lines[0]))];
    });
  };
  var axiom_5_arrows = function axiom_5_arrows(params) {
    return axiom(5, params).map(function (foldLine) {
      return [math.segment(params.points[1], reflect_point(foldLine, params.points[1]))];
    });
  };
  var axiom_6_arrows = function axiom_6_arrows(params) {
    return axiom(6, params).map(function (foldLine) {
      return params.points.map(function (pt) {
        return math.segment(pt, reflect_point(foldLine, pt));
      });
    });
  };
  var axiom_7_arrows = function axiom_7_arrows(params, graph) {
    return axiom(7, params).map(function (foldLine) {
      return [math.segment(params.points[0], reflect_point(foldLine, params.points[0])), widest_perp(graph, foldLine, line_line_for_arrows(foldLine, params.lines[1]))];
    });
  };
  var arrow_functions = [null, axiom_1_arrows, axiom_2_arrows, axiom_3_arrows, axiom_4_arrows, axiom_5_arrows, axiom_6_arrows, axiom_7_arrows];
  delete arrow_functions[0];
  var axiom_arrows = function axiom_arrows(number) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var points = params.points ? params.points.map(function (p) {
      return math.core.get_vector(p);
    }) : undefined;
    var lines = params.lines ? params.lines.map(function (l) {
      return math.core.get_line(l);
    }) : undefined;
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return arrow_functions[number].apply(arrow_functions, [{
      points: points,
      lines: lines
    }].concat(args));
  };
  Object.keys(arrow_functions).forEach(function (number) {
    axiom_arrows[number] = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return axiom_arrows.apply(void 0, [number].concat(args));
    };
  });

  var widest_perpendicular = function widest_perpendicular(polygon, foldLine, point) {
    if (point === undefined) {
      var _math$core;
      var foldSegment = math.core.clip_line_in_convex_polygon(polygon, foldLine.vector, foldLine.origin, math.core.exclude, math.core.include_l);
      if (foldSegment === undefined) {
        return;
      }
      point = (_math$core = math.core).midpoint.apply(_math$core, _toConsumableArray(foldSegment));
    }
    var perpVector = math.core.rotate90(foldLine.vector);
    var smallest = math.core.clip_line_in_convex_polygon(polygon, perpVector, point, math.core.exclude, math.core.include_l).map(function (pt) {
      return math.core.distance(point, pt);
    }).sort(function (a, b) {
      return a - b;
    }).shift();
    var scaled = math.core.scale(math.core.normalize(perpVector), smallest);
    return math.segment(math.core.add(point, math.core.flip(scaled)), math.core.add(point, scaled));
  };
  var simple_arrow = function simple_arrow(graph, line) {
    var hull = math.core.convex_hull(graph.vertices_coords);
    var rect = math.core.enclosing_rectangle(hull);
    var segment = widest_perpendicular(hull, line);
    if (segment === undefined) {
      return undefined;
    }
    var vector = ear.math.subtract(segment[1], segment[0]);
    var length = ear.math.magnitude(vector);
    var direction = ear.math.dot(vector, [1, 0]);
    var vmin = rect.width < rect.height ? rect.width : rect.height;
    segment.head = {
      width: vmin * 0.1,
      height: vmin * 0.15
    };
    segment.bend = direction > 0 ? 0.3 : -0.3;
    segment.padding = length * 0.05;
    return segment;
  };

  var diagram = Object.assign(Object.create(null),
  {
    axiom_arrows: axiom_arrows,
    simple_arrow: simple_arrow
  });

  var make_tortilla_tortilla_edges_crossing = function make_tortilla_tortilla_edges_crossing(graph, edges_faces_side, epsilon) {
    var tortilla_edge_indices = edges_faces_side.map(function (side) {
      return side.length === 2 && side[0] !== side[1];
    }).map(function (bool, i) {
      return bool ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    var edges_crossing_matrix = make_edges_edges_crossing(graph, epsilon);
    var edges_crossing = boolean_matrix_to_indexed_array(edges_crossing_matrix);
    var tortilla_edges_crossing = tortilla_edge_indices.map(function (i) {
      return edges_crossing[i];
    });
    return tortilla_edges_crossing.map(function (edges, i) {
      return {
        tortilla_edge: tortilla_edge_indices[i],
        crossing_edges: edges
      };
    }).filter(function (el) {
      return el.crossing_edges.length;
    });
  };
  var make_tortillas_faces_crossing = function make_tortillas_faces_crossing(graph, edges_faces_side, epsilon) {
    var faces_winding = make_faces_winding(graph);
    var faces_polygon = make_faces_polygon(graph, epsilon);
    for (var i = 0; i < faces_polygon.length; i++) {
      if (!faces_winding[i]) {
        faces_polygon[i].reverse();
      }
    }
    var tortilla_edge_indices = edges_faces_side.map(function (side) {
      return side.length === 2 && side[0] !== side[1];
    }).map(function (bool, i) {
      return bool ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    var edges_coords = tortilla_edge_indices.map(function (e) {
      return graph.edges_vertices[e];
    }).map(function (edge) {
      return edge.map(function (vertex) {
        return graph.vertices_coords[vertex];
      });
    });
    var edges_vector = edges_coords.map(function (coords) {
      return math.core.subtract2(coords[1], coords[0]);
    });
    var matrix = [];
    tortilla_edge_indices.forEach(function (e) {
      matrix[e] = [];
    });
    var result = tortilla_edge_indices.map(function (e, ei) {
      return faces_polygon.map(function (poly, f) {
        return math.core.clip_line_in_convex_polygon(poly, edges_vector[ei], edges_coords[ei][0], math.core.exclude, math.core.exclude_s, epsilon);
      }).map(function (result, f) {
        return result !== undefined;
      });
    });
    result.forEach(function (faces, ei) {
      return faces.forEach(function (overlap, f) {
        if (overlap) {
          matrix[tortilla_edge_indices[ei]].push(f);
        }
      });
    });
    return matrix;
  };
  var make_tortilla_tortilla_faces_crossing = function make_tortilla_tortilla_faces_crossing(graph, edges_faces_side, epsilon) {
    make_tortilla_tortilla_edges_crossing(graph, edges_faces_side, epsilon);
    var tortillas_faces_crossing = make_tortillas_faces_crossing(graph, edges_faces_side, epsilon);
    var tortilla_faces_results = tortillas_faces_crossing.map(function (faces, e) {
      return faces.map(function (face) {
        return [graph.edges_faces[e], [face, face]];
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    return tortilla_faces_results;
  };

  var tortilla_tortilla = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_tortilla_tortilla_edges_crossing: make_tortilla_tortilla_edges_crossing,
    make_tortillas_faces_crossing: make_tortillas_faces_crossing,
    make_tortilla_tortilla_faces_crossing: make_tortilla_tortilla_faces_crossing
  });

  var make_edges_faces_side = function make_edges_faces_side(graph, faces_center) {
    var edges_origin = graph.edges_vertices.map(function (vertices) {
      return graph.vertices_coords[vertices[0]];
    });
    var edges_vector = graph.edges_vertices.map(function (vertices) {
      return math.core.subtract2(graph.vertices_coords[vertices[1]], graph.vertices_coords[vertices[0]]);
    });
    return graph.edges_faces.map(function (faces, i) {
      return faces.map(function (face) {
        return math.core.cross2(math.core.subtract2(faces_center[face], edges_origin[i]), edges_vector[i]);
      }).map(function (cross) {
        return Math.sign(cross);
      });
    });
  };
  var make_tacos_faces_side = function make_tacos_faces_side(graph, faces_center, tacos_edges, tacos_faces) {
    var tacos_edge_coords = tacos_edges.map(function (edges) {
      return graph.edges_vertices[edges[0]].map(function (vertex) {
        return graph.vertices_coords[vertex];
      });
    });
    var tacos_edge_origin = tacos_edge_coords.map(function (coords) {
      return coords[0];
    });
    var tacos_edge_vector = tacos_edge_coords.map(function (coords) {
      return math.core.subtract2(coords[1], coords[0]);
    });
    var tacos_faces_center = tacos_faces.map(function (faces) {
      return faces.map(function (face_pair) {
        return face_pair.map(function (face) {
          return faces_center[face];
        });
      });
    });
    return tacos_faces_center.map(function (faces, i) {
      return faces.map(function (pairs) {
        return pairs.map(function (center) {
          return math.core.cross2(math.core.subtract2(center, tacos_edge_origin[i]), tacos_edge_vector[i]);
        }).map(function (cross) {
          return Math.sign(cross);
        });
      });
    });
  };

  var classify_faces_pair = function classify_faces_pair(pair) {
    if (pair[0] === 1 && pair[1] === -1 || pair[0] === -1 && pair[1] === 1) {
      return "both";
    }
    if (pair[0] === 1 && pair[1] === 1) {
      return "right";
    }
    if (pair[0] === -1 && pair[1] === -1) {
      return "left";
    }
  };
  var is_taco_taco = function is_taco_taco(classes) {
    return classes[0] === classes[1] && classes[0] !== "both";
  };
  var is_tortilla_tortilla = function is_tortilla_tortilla(classes) {
    return classes[0] === classes[1] && classes[0] === "both";
  };
  var is_taco_tortilla = function is_taco_tortilla(classes) {
    return classes[0] !== classes[1] && (classes[0] === "both" || classes[1] === "both");
  };
  var make_taco_tortilla = function make_taco_tortilla(face_pairs, types, faces_side) {
    var direction = types[0] === "left" || types[1] === "left" ? -1 : 1;
    var taco = types[0] === "both" ? _toConsumableArray(face_pairs[1]) : _toConsumableArray(face_pairs[0]);
    var index = types[0] === "both" ? 0 : 1;
    var tortilla = faces_side[index][0] === direction ? face_pairs[index][0] : face_pairs[index][1];
    return {
      taco: taco,
      tortilla: tortilla
    };
  };
  var make_tortilla_tortilla = function make_tortilla_tortilla(face_pairs, tortillas_sides) {
    if (face_pairs === undefined) {
      return undefined;
    }
    return tortillas_sides[0][0] === tortillas_sides[1][0] ? face_pairs : [face_pairs[0], [face_pairs[1][1], face_pairs[1][0]]];
  };
  var make_tacos_tortillas = function make_tacos_tortillas(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var faces_center = make_faces_center(graph);
    var edges_faces_side = make_edges_faces_side(graph, faces_center);
    var edge_edge_overlap_matrix = make_edges_edges_parallel_overlap(graph, epsilon);
    var tacos_edges = boolean_matrix_to_unique_index_pairs(edge_edge_overlap_matrix).filter(function (pair) {
      return pair.map(function (edge) {
        return graph.edges_faces[edge].length > 1;
      }).reduce(function (a, b) {
        return a && b;
      }, true);
    });
    var tacos_faces = tacos_edges.map(function (pair) {
      return pair.map(function (edge) {
        return graph.edges_faces[edge];
      });
    });
    var tacos_faces_side = make_tacos_faces_side(graph, faces_center, tacos_edges, tacos_faces);
    var tacos_types = tacos_faces_side.map(function (faces, i) {
      return faces.map(classify_faces_pair);
    });
    var taco_taco = tacos_types.map(function (pair, i) {
      return is_taco_taco(pair) ? tacos_faces[i] : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    var tortilla_tortilla_aligned = tacos_types.map(function (pair, i) {
      return is_tortilla_tortilla(pair) ? tacos_faces[i] : undefined;
    }).map(function (pair, i) {
      return make_tortilla_tortilla(pair, tacos_faces_side[i]);
    }).filter(function (a) {
      return a !== undefined;
    });
    var tortilla_tortilla_crossing = make_tortilla_tortilla_faces_crossing(graph, edges_faces_side, epsilon);
    var tortilla_tortilla = tortilla_tortilla_aligned.concat(tortilla_tortilla_crossing);
    var taco_tortilla_aligned = tacos_types.map(function (pair, i) {
      return is_taco_tortilla(pair) ? make_taco_tortilla(tacos_faces[i], tacos_types[i], tacos_faces_side[i]) : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    var edges_faces_overlap = make_edges_faces_overlap(graph, epsilon);
    var edges_overlap_faces = boolean_matrix_to_indexed_array(edges_faces_overlap).map(function (faces, e) {
      return edges_faces_side[e].length > 1 && edges_faces_side[e][0] === edges_faces_side[e][1] ? faces : [];
    });
    var taco_tortillas_crossing = edges_overlap_faces.map(function (tortillas, edge) {
      return {
        taco: graph.edges_faces[edge],
        tortillas: tortillas
      };
    }).filter(function (el) {
      return el.tortillas.length;
    });
    var taco_tortilla_crossing = taco_tortillas_crossing.map(function (el) {
      return el.tortillas.map(function (tortilla) {
        return {
          taco: _toConsumableArray(el.taco),
          tortilla: tortilla
        };
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var taco_tortilla = taco_tortilla_aligned.concat(taco_tortilla_crossing).sort(function (a, b) {
      return a.tortilla - b.tortilla;
    });
    return {
      taco_taco: taco_taco,
      tortilla_tortilla: tortilla_tortilla,
      taco_tortilla: taco_tortilla
    };
  };

  var make_transitivity_trios = function make_transitivity_trios(graph, overlap_matrix, faces_winding) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.core.EPSILON;
    if (!overlap_matrix) {
      overlap_matrix = make_faces_faces_overlap(graph, epsilon);
    }
    if (!faces_winding) {
      faces_winding = make_faces_winding(graph);
    }
    var polygons = graph.faces_vertices.map(function (face) {
      return face.map(function (v) {
        return graph.vertices_coords[v];
      });
    });
    polygons.forEach(function (face, i) {
      if (!faces_winding[i]) {
        face.reverse();
      }
    });
    var matrix = graph.faces_vertices.map(function () {
      return [];
    });
    for (var i = 0; i < matrix.length - 1; i++) {
      for (var j = i + 1; j < matrix.length; j++) {
        if (!overlap_matrix[i][j]) {
          continue;
        }
        var polygon = math.core.intersect_polygon_polygon(polygons[i], polygons[j], epsilon);
        if (polygon) {
          matrix[i][j] = polygon;
        }
      }
    }
    var trios = [];
    for (var _i = 0; _i < matrix.length - 1; _i++) {
      for (var _j = _i + 1; _j < matrix.length; _j++) {
        if (!matrix[_i][_j]) {
          continue;
        }
        for (var k = _j + 1; k < matrix.length; k++) {
          if (_i === k || _j === k) {
            continue;
          }
          if (!overlap_matrix[_i][k] || !overlap_matrix[_j][k]) {
            continue;
          }
          var _polygon = math.core.intersect_polygon_polygon(matrix[_i][_j], polygons[k], epsilon);
          if (_polygon) {
            trios.push([_i, _j, k].sort(function (a, b) {
              return a - b;
            }));
          }
        }
      }
    }
    return trios;
  };

  var filter_transitivity = function filter_transitivity(transitivity_trios, tacos_tortillas) {
    var tacos_trios = {};
    tacos_tortillas.taco_taco.map(function (tacos) {
      return [[tacos[0][0], tacos[0][1], tacos[1][0]],
      [tacos[0][0], tacos[0][1], tacos[1][1]],
      [tacos[0][0], tacos[1][0], tacos[1][1]],
      [tacos[0][1], tacos[1][0], tacos[1][1]]
      ];
    }).forEach(function (trios) {
      return trios.map(function (trio) {
        return trio.sort(function (a, b) {
          return a - b;
        }).join(" ");
      }).forEach(function (key) {
        tacos_trios[key] = true;
      });
    });
    tacos_tortillas.taco_tortilla.map(function (el) {
      return [el.taco[0], el.taco[1], el.tortilla];
    }).map(function (trio) {
      return trio.sort(function (a, b) {
        return a - b;
      }).join(" ");
    }).forEach(function (key) {
      tacos_trios[key] = true;
    });
    return transitivity_trios.filter(function (trio) {
      return tacos_trios[trio.join(" ")] === undefined;
    });
  };

  var refactor_pairs = function refactor_pairs(tacos_tortillas, transitivity_trios) {
    var pairs = {};
    pairs.taco_taco = tacos_tortillas.taco_taco.map(function (el) {
      return [[el[0][0], el[0][1]], [el[1][0], el[1][1]], [el[1][0], el[0][1]], [el[0][0], el[1][1]], [el[0][0], el[1][0]], [el[0][1], el[1][1]]];
    });
    pairs.taco_tortilla = tacos_tortillas.taco_tortilla.map(function (el) {
      return [[el.taco[0], el.taco[1]], [el.taco[0], el.tortilla], [el.tortilla, el.taco[1]]];
    });
    pairs.tortilla_tortilla = tacos_tortillas.tortilla_tortilla.map(function (el) {
      return [[el[0][0], el[1][0]], [el[0][1], el[1][1]]];
    });
    pairs.transitivity = transitivity_trios.map(function (el) {
      return [[el[0], el[1]], [el[1], el[2]], [el[2], el[0]]];
    });
    return pairs;
  };
  var make_maps = function make_maps(tacos_face_pairs) {
    return tacos_face_pairs.map(function (face_pairs) {
      var keys_ordered = face_pairs.map(function (pair) {
        return pair[0] < pair[1];
      });
      var face_keys = face_pairs.map(function (pair, i) {
        return keys_ordered[i] ? "".concat(pair[0], " ").concat(pair[1]) : "".concat(pair[1], " ").concat(pair[0]);
      });
      return {
        face_keys: face_keys,
        keys_ordered: keys_ordered
      };
    });
  };
  var make_taco_maps = function make_taco_maps(tacos_tortillas, transitivity_trios) {
    var pairs = refactor_pairs(tacos_tortillas, transitivity_trios);
    return {
      taco_taco: make_maps(pairs.taco_taco),
      taco_tortilla: make_maps(pairs.taco_tortilla),
      tortilla_tortilla: make_maps(pairs.tortilla_tortilla),
      transitivity: make_maps(pairs.transitivity)
    };
  };

  var make_conditions = function make_conditions(graph, overlap_matrix, faces_winding) {
    if (!faces_winding) {
      faces_winding = make_faces_winding(graph);
    }
    if (!overlap_matrix) {
      overlap_matrix = make_faces_faces_overlap(graph);
    }
    var conditions = {};
    var flip = {
      0: 0,
      1: 2,
      2: 1
    };
    boolean_matrix_to_unique_index_pairs(overlap_matrix).map(function (pair) {
      return pair.join(" ");
    }).forEach(function (key) {
      conditions[key] = 0;
    });
    var assignment_direction = {
      M: 1,
      m: 1,
      V: 2,
      v: 2
    };
    graph.edges_faces.forEach(function (faces, edge) {
      var assignment = graph.edges_assignment[edge];
      var local_order = assignment_direction[assignment];
      if (faces.length < 2 || local_order === undefined) {
        return;
      }
      var upright = faces_winding[faces[0]];
      var global_order = upright ? local_order : flip[local_order];
      var key1 = "".concat(faces[0], " ").concat(faces[1]);
      var key2 = "".concat(faces[1], " ").concat(faces[0]);
      if (key1 in conditions) {
        conditions[key1] = global_order;
      }
      if (key2 in conditions) {
        conditions[key2] = flip[global_order];
      }
    });
    return conditions;
  };

  var taco_taco_valid_states = ["111112", "111121", "111222", "112111", "121112", "121222", "122111", "122212", "211121", "211222", "212111", "212221", "221222", "222111", "222212", "222221"];
  var taco_tortilla_valid_states = ["112", "121", "212", "221"];
  var tortilla_tortilla_valid_states = ["11", "22"];
  var transitivity_valid_states = ["112", "121", "122", "211", "212", "221"];
  var check_state = function check_state(states, t, key) {
    var A = Array.from(key).map(function (_char) {
      return parseInt(_char);
    });
    if (A.filter(function (x) {
      return x === 0;
    }).length !== t) {
      return;
    }
    states[t][key] = false;
    var solution = false;
    for (var i = 0; i < A.length; i++) {
      var modifications = [];
      if (A[i] !== 0) {
        continue;
      }
      for (var x = 1; x <= 2; x++) {
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
  var make_lookup = function make_lookup(valid_states) {
    var choose_count = valid_states[0].length;
    var states = Array.from(Array(choose_count + 1)).map(function () {
      return {};
    });
    Array.from(Array(Math.pow(2, choose_count))).map(function (_, i) {
      return i.toString(2);
    }).map(function (str) {
      return Array.from(str).map(function (n) {
        return parseInt(n) + 1;
      }).join("");
    }).map(function (str) {
      return ("11111" + str).slice(-choose_count);
    }).forEach(function (key) {
      states[0][key] = false;
    });
    valid_states.forEach(function (s) {
      states[0][s] = true;
    });
    Array.from(Array(choose_count)).map(function (_, i) {
      return i + 1;
    })
    .map(function (t) {
      return Array.from(Array(Math.pow(3, choose_count))).map(function (_, i) {
        return i.toString(3);
      }).map(function (str) {
        return ("000000" + str).slice(-choose_count);
      }).forEach(function (key) {
        return check_state(states, t, key);
      });
    });
    var outs = [];
    Array.from(Array(choose_count + 1)).map(function (_, i) {
      return choose_count - i;
    }).forEach(function (t) {
      var A = [];
      Object.keys(states[t]).forEach(function (key) {
        var out = states[t][key];
        if (out.constructor === Array) {
          out = out[0];
        }
        A.push([key, out]);
      });
      outs = outs.concat(A);
    });
    outs.sort(function (a, b) {
      return parseInt(a[0]) - parseInt(b[0]);
    });
    var lookup = {};
    outs.forEach(function (el) {
      lookup[el[0]] = Object.freeze(el[1]);
    });
    return Object.freeze(lookup);
  };
  var slow_lookup = {
    taco_taco: make_lookup(taco_taco_valid_states),
    taco_tortilla: make_lookup(taco_tortilla_valid_states),
    tortilla_tortilla: make_lookup(tortilla_tortilla_valid_states),
    transitivity: make_lookup(transitivity_valid_states)
  };

  var taco_types$2 = Object.freeze(Object.keys(slow_lookup));
  var flip$1 = {
    0: 0,
    1: 2,
    2: 1
  };
  var fill_layers_from_conditions = function fill_layers_from_conditions(layers, maps, conditions) {
    return layers.forEach(function (layer, i) {
      return maps[i].face_keys.forEach(function (key, j) {
        if (!(key in conditions)) {
          console.warn(key, "not in conditions");
          return;
        }
        if (conditions[key] !== 0) {
          var orientation = maps[i].keys_ordered[j] ? conditions[key] : flip$1[conditions[key]];
          if (layers[i][j] !== 0 && layers[i][j] !== orientation) {
            throw "fill conflict";
          }
          layers[i][j] = orientation;
        }
      });
    });
  };
  var infer_next_steps = function infer_next_steps(layers, maps, lookup_table) {
    return layers.map(function (layer, i) {
      var map = maps[i];
      var key = layer.join("");
      var next_step = lookup_table[key];
      if (next_step === false) {
        throw "unsolvable";
      }
      if (next_step === true) {
        return;
      }
      if (layer[next_step[0]] !== 0 && layer[next_step[0]] !== next_step[1]) {
        throw "infer conflict";
      }
      layers[i][next_step[0]] = next_step[1];
      var condition_key = map.face_keys[next_step[0]];
      var condition_value = map.keys_ordered[next_step[0]] ? next_step[1] : flip$1[next_step[1]];
      return [condition_key, condition_value];
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var complete_suggestions_loop = function complete_suggestions_loop(layers, maps, conditions, avoid) {
    var next_steps;
    do {
      try {
        for (var t = 0; t < taco_types$2.length; t++) {
          var type = taco_types$2[t];
          fill_layers_from_conditions(layers[type], maps[type], conditions);
        }
        next_steps = taco_types$2.map(function (type) {
          return infer_next_steps(layers[type], maps[type], slow_lookup[type], avoid);
        }).reduce(function (a, b) {
          return a.concat(b);
        }, []);
        next_steps.forEach(function (el) {
          conditions[el[0]] = el[1];
        });
      } catch (error) {
        return false;
      }
    } while (next_steps.length > 0);
    return true;
  };

  var hashCode = function hashCode(string) {
    var hash = 0;
    for (var i = 0; i < string.length; i++) {
      hash = (hash << 5) - hash + string.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  };

  var to_signed_layer_convert = {
    0: 0,
    1: 1,
    2: -1
  };
  var to_unsigned_layer_convert = {
    0: 0,
    1: 1,
    "-1": 2
  };
  var unsigned_to_signed_conditions = function unsigned_to_signed_conditions(conditions) {
    Object.keys(conditions).forEach(function (key) {
      conditions[key] = to_signed_layer_convert[conditions[key]];
    });
    return conditions;
  };
  var signed_to_unsigned_conditions = function signed_to_unsigned_conditions(conditions) {
    Object.keys(conditions).forEach(function (key) {
      conditions[key] = to_unsigned_layer_convert[conditions[key]];
    });
    return conditions;
  };

  var general_global_solver = /*#__PURE__*/Object.freeze({
    __proto__: null,
    unsigned_to_signed_conditions: unsigned_to_signed_conditions,
    signed_to_unsigned_conditions: signed_to_unsigned_conditions
  });

  var count_zeros = function count_zeros(conditions) {
    return Object.keys(conditions).filter(function (key) {
      return conditions[key] === 0;
    }).length;
  };
  var taco_types$1 = Object.freeze(Object.keys(slow_lookup));
  var duplicate_unsolved_layers$1 = function duplicate_unsolved_layers(layers) {
    var duplicate = {};
    taco_types$1.forEach(function (type) {
      duplicate[type] = [];
    });
    taco_types$1.forEach(function (type) {
      return layers[type].forEach(function (layer, i) {
        if (layer.indexOf(0) !== -1) {
          duplicate[type][i] = _toConsumableArray(layer);
        }
      });
    });
    return duplicate;
  };
  var solver_single = function solver_single(graph, maps, conditions) {
    var startDate = new Date();
    var recurse_count = 0;
    var inner_loop_count = 0;
    var successes_hash = {};
    var layers = {
      taco_taco: maps.taco_taco.map(function (el) {
        return Array(6).fill(0);
      }),
      taco_tortilla: maps.taco_tortilla.map(function (el) {
        return Array(3).fill(0);
      }),
      tortilla_tortilla: maps.tortilla_tortilla.map(function (el) {
        return Array(2).fill(0);
      }),
      transitivity: maps.transitivity.map(function (el) {
        return Array(3).fill(0);
      })
    };
    complete_suggestions_loop(layers, maps, conditions);
    var solution;
    var _loop = function _loop() {
      recurse_count++;
      var zero_keys = Object.keys(conditions).map(function (key) {
        return conditions[key] === 0 ? key : undefined;
      }).filter(function (a) {
        return a !== undefined;
      });
      if (zero_keys.length === 0) {
        solution = conditions;
        return "break";
      }
      var avoid = {};
      var successes = zero_keys.map(function (key, i) {
        return [1, 2].map(function (dir) {
          if (avoid[key] && avoid[key][dir]) {
            return;
          }
          var clone_conditions = JSON.parse(JSON.stringify(conditions));
          if (successes_hash[JSON.stringify(clone_conditions)]) {
            console.log("early hash caught!");
            return;
          }
          var clone_layers = duplicate_unsolved_layers$1(layers);
          clone_conditions[key] = dir;
          inner_loop_count++;
          if (!complete_suggestions_loop(clone_layers, maps, clone_conditions)) {
            return undefined;
          }
          Object.keys(clone_conditions).filter(function (key) {
            return conditions[key] === 0;
          }).forEach(function (key) {
            if (!avoid[key]) {
              avoid[key] = {};
            }
            avoid[key][dir] = true;
          });
          return {
            conditions: clone_conditions,
            layers: clone_layers,
            zero_count: count_zeros(clone_conditions)
          };
        }).filter(function (a) {
          return a !== undefined;
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []).sort(function (a, b) {
        return b.zero_count - a.zero_count;
      });
      var unique_successes = successes.map(function (success) {
        return JSON.stringify(success.conditions);
      }).map(function (string) {
        return hashCode(string);
      }).map(function (hash, i) {
        if (successes_hash[hash]) {
          return;
        }
        successes_hash[hash] = successes[i];
        return successes[i];
      }).filter(function (a) {
        return a !== undefined;
      });
      if (!unique_successes.length) {
        console.warn("ran out of successes");
        return {
          v: void 0
        };
      }
      conditions = unique_successes[0].conditions;
      layers = unique_successes[0].layers;
    };
    do {
      var _ret = _loop();
      if (_ret === "break") break;
      if (_typeof(_ret) === "object") return _ret.v;
    } while (solution === undefined);
    unsigned_to_signed_conditions(solution);
    console.log("".concat(Date.now() - startDate, "ms recurse_count"), recurse_count, "inner_loop_count", inner_loop_count);
    return solution;
  };

  var taco_types = Object.freeze(Object.keys(slow_lookup));
  var duplicate_unsolved_layers = function duplicate_unsolved_layers(layers) {
    var duplicate = {};
    taco_types.forEach(function (type) {
      duplicate[type] = [];
    });
    taco_types.forEach(function (type) {
      return layers[type].forEach(function (layer, i) {
        if (layer.indexOf(0) !== -1) {
          duplicate[type][i] = _toConsumableArray(layer);
        }
      });
    });
    return duplicate;
  };
  var precheck = function precheck(layers, maps, face_pair_key, new_dir) {
    try {
      taco_types.forEach(function (taco_type) {
        return layers.forEach(function (layer, i) {
          var map = maps[taco_type][i];
          for (var m = 0; m < map.face_keys.length; m++) {
            if (map.face_keys[m] === face_pair_key) {
              var dir = map.keys_ordered[m] ? new_dir : flip[new_dir];
              var new_layer = _toConsumableArray(layer);
              new_layer[m] = dir;
              var new_layer_key = new_layer.join("");
              if (slow_lookup[taco_type][new_layer_key] === false) {
                console.log("precheck found a fail case", face_pair_key, taco_type, new_layer_key, slow_lookup[type][new_layer_key]);
                throw "precheck";
              }
            }
          }
        });
      });
    } catch (error) {
      return false;
    }
    return true;
  };
  var recursive_solver = function recursive_solver(graph, maps, conditions_start) {
    var startDate = new Date();
    var recurse_count = 0;
    var inner_loop_count = 0;
    var successes_hash = {};
    var recurse = function recurse(layers, conditions) {
      recurse_count++;
      var zero_keys = Object.keys(conditions).map(function (key) {
        return conditions[key] === 0 ? key : undefined;
      }).filter(function (a) {
        return a !== undefined;
      });
      if (zero_keys.length === 0) {
        return [conditions];
      }
      var avoid = {};
      var successes = zero_keys.map(function (key, i) {
        return [1, 2].map(function (dir) {
          if (avoid[key] && avoid[key][dir]) {
            return;
          }
          if (precheck(layers, maps, key, dir)) {
            console.log("precheck caught!");
            return;
          }
          var clone_conditions = JSON.parse(JSON.stringify(conditions));
          if (successes_hash[JSON.stringify(clone_conditions)]) {
            console.log("early hash caught!");
            return;
          }
          var clone_layers = duplicate_unsolved_layers(layers);
          clone_conditions[key] = dir;
          inner_loop_count++;
          if (!complete_suggestions_loop(clone_layers, maps, clone_conditions)) {
            return undefined;
          }
          Object.keys(clone_conditions).filter(function (key) {
            return conditions[key] === 0;
          }).forEach(function (key) {
            if (!avoid[key]) {
              avoid[key] = {};
            }
            avoid[key][dir] = true;
          });
          return {
            conditions: clone_conditions,
            layers: clone_layers
          };
        }).filter(function (a) {
          return a !== undefined;
        });
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
      var unique_successes = successes.map(function (success) {
        return JSON.stringify(success.conditions);
      }).map(function (string) {
        return hashCode(string);
      }).map(function (hash, i) {
        if (successes_hash[hash]) {
          return;
        }
        successes_hash[hash] = successes[i];
        return successes[i];
      }).filter(function (a) {
        return a !== undefined;
      });
      return unique_successes.map(function (success) {
        return recurse(success.layers, success.conditions);
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []);
    };
    var layers_start = {
      taco_taco: maps.taco_taco.map(function (el) {
        return Array(6).fill(0);
      }),
      taco_tortilla: maps.taco_tortilla.map(function (el) {
        return Array(3).fill(0);
      }),
      tortilla_tortilla: maps.tortilla_tortilla.map(function (el) {
        return Array(2).fill(0);
      }),
      transitivity: maps.transitivity.map(function (el) {
        return Array(3).fill(0);
      })
    };
    complete_suggestions_loop(layers_start, maps, conditions_start);
    var certain = conditions_start;
    var solutions = recurse(layers_start, conditions_start);
    solutions.certain = JSON.parse(JSON.stringify(certain));
    for (var i = 0; i < solutions.length; i++) {
      unsigned_to_signed_conditions(solutions[i]);
    }
    unsigned_to_signed_conditions(solutions.certain);
    console.log("".concat(Date.now() - startDate, "ms recurse_count"), recurse_count, "inner_loop_count", inner_loop_count);
    return solutions;
  };

  var dividing_axis = function dividing_axis(graph, line, conditions) {
    var faces_side = make_faces_center_quick(graph).map(function (center) {
      return math.core.subtract2(center, line.origin);
    }).map(function (vector) {
      return math.core.cross2(line.vector, vector);
    }).map(function (cross) {
      return Math.sign(cross);
    });
    var sides = Object.keys(conditions).map(function (key) {
      var pair = key.split(" ");
      if (conditions[key] === 0) {
        return;
      }
      if (conditions[key] === 2) {
        pair.reverse();
      }
      if (faces_side[pair[0]] === 1 && faces_side[pair[1]] === -1) {
        return true;
      }
      if (faces_side[pair[0]] === -1 && faces_side[pair[1]] === 1) {
        return false;
      }
    }).filter(function (a) {
      return a !== undefined;
    });
    var is_valid = sides.reduce(function (a, b) {
      return a && b === sides[0];
    }, true);
    if (!is_valid) {
      console.warn("line is not a dividing axis");
      return;
    }
    var side = sides[0];
    Object.keys(conditions).forEach(function (key) {
      var pair = key.split(" ");
      if (conditions[key] !== 0) {
        return;
      }
      if (faces_side[pair[0]] === faces_side[pair[1]]) {
        return;
      }
      if (faces_side[pair[0]] === 1 && faces_side[pair[1]] === -1) {
        if (side) {
          conditions[key] = 1;
        }
        else {
          conditions[key] = 2;
        }
      }
      if (faces_side[pair[0]] === -1 && faces_side[pair[1]] === 1) {
        if (side) {
          conditions[key] = 2;
        }
        else {
          conditions[key] = 1;
        }
      }
    });
  };

  var dividing_axis$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    dividing_axis: dividing_axis
  });

  var make_maps_and_conditions = function make_maps_and_conditions(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-6;
    var overlap_matrix = make_faces_faces_overlap(graph, epsilon);
    var faces_winding = make_faces_winding(graph);
    var conditions = make_conditions(graph, overlap_matrix, faces_winding);
    var tacos_tortillas = make_tacos_tortillas(graph, epsilon);
    var unfiltered_trios = make_transitivity_trios(graph, overlap_matrix, faces_winding, epsilon);
    var transitivity_trios = filter_transitivity(unfiltered_trios, tacos_tortillas);
    var maps = make_taco_maps(tacos_tortillas, transitivity_trios);
    return {
      maps: maps,
      conditions: conditions
    };
  };
  var one_layer_conditions = function one_layer_conditions(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-6;
    var data = make_maps_and_conditions(graph, epsilon);
    return solver_single(graph, data.maps, data.conditions);
  };
  var all_layer_conditions = function all_layer_conditions(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-6;
    var data = make_maps_and_conditions(graph, epsilon);
    return recursive_solver(graph, data.maps, data.conditions);
  };
  var make_maps_and_conditions_dividing_axis = function make_maps_and_conditions_dividing_axis(folded, cp, line) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1e-6;
    var overlap_matrix = make_faces_faces_overlap(folded, epsilon);
    var faces_winding = make_faces_winding(folded);
    var conditions = make_conditions(folded, overlap_matrix, faces_winding);
    dividing_axis(cp, line, conditions);
    var tacos_tortillas = make_tacos_tortillas(folded, epsilon);
    var unfiltered_trios = make_transitivity_trios(folded, overlap_matrix, faces_winding, epsilon);
    var transitivity_trios = filter_transitivity(unfiltered_trios, tacos_tortillas);
    var maps = make_taco_maps(tacos_tortillas, transitivity_trios);
    return {
      maps: maps,
      conditions: conditions
    };
  };
  var one_layer_conditions_with_axis = function one_layer_conditions_with_axis(folded, cp, line) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1e-6;
    var data = make_maps_and_conditions_dividing_axis(folded, cp, line, epsilon);
    return solver_single(folded, data.maps, data.conditions);
  };
  var all_layer_conditions_with_axis = function all_layer_conditions_with_axis(folded, cp, line) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1e-6;
    var data = make_maps_and_conditions_dividing_axis(folded, cp, line, epsilon);
    return recursive_solver(folded, data.maps, data.conditions);
  };

  var global_layer_solvers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    one_layer_conditions: one_layer_conditions,
    all_layer_conditions: all_layer_conditions,
    one_layer_conditions_with_axis: one_layer_conditions_with_axis,
    all_layer_conditions_with_axis: all_layer_conditions_with_axis
  });

  var conditions_to_matrix = function conditions_to_matrix(conditions) {
    var condition_keys = Object.keys(conditions);
    var face_pairs = condition_keys.map(function (key) {
      return key.split(" ").map(function (n) {
        return parseInt(n);
      });
    });
    var faces = [];
    face_pairs.reduce(function (a, b) {
      return a.concat(b);
    }, []).forEach(function (f) {
      return faces[f] = undefined;
    });
    var matrix = faces.map(function () {
      return [];
    });
    face_pairs
    .map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          a = _ref2[0],
          b = _ref2[1];
      matrix[a][b] = conditions["".concat(a, " ").concat(b)];
      matrix[b][a] = -conditions["".concat(a, " ").concat(b)];
    });
    return matrix;
  };

  var topological_order = function topological_order(conditions) {
    var matrix = conditions_to_matrix(conditions);
    var parent_face_counts = matrix.map(function (row, i) {
      return row.map(function (n) {
        return n === -1 ? 1 : 0;
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    });
    var layers_face = [];
    var num_faces = parent_face_counts.length;
    for (var i = 0; i < num_faces; i++) {
      var top_face = parent_face_counts.indexOf(0);
      if (top_face === -1) {
        console.warn("cycle detected");
        return [];
      }
      layers_face.push(top_face);
      matrix[top_face].forEach(function (dir, i) {
        if (dir === 1) {
          parent_face_counts[i]--;
        }
      });
      delete parent_face_counts[top_face];
    }
    return layers_face.reverse();
  };

  var make_faces_layers = function make_faces_layers(graph, epsilon) {
    var conditions = all_layer_conditions(graph, epsilon);
    return conditions.map(topological_order).map(invert_map);
  };

  var make_faces_layers_async = function make_faces_layers_async(graph, epsilon) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2000;
    var timer = new Promise(function (resolve, reject) {
      setTimeout(function () {
        return reject();
      }, timeout);
    });
    var solver = new Promise(function (resolve, reject) {
      return resolve(all_layer_conditions(graph, epsilon));
    });
    return Promise.race([solver, timer]).then(function (value) {
      return value.map(topological_order).map(invert_map);
    })["catch"](function (err) {
      console.warn("make_faces_layers_async timeout. to increase timeout, use third parameter (graph, epsilon, timeout)");
      return [];
    });
  };

  var faces_layer_to_edges_assignments = function faces_layer_to_edges_assignments(graph, faces_layer) {
    var edges_assignment = [];
    var faces_winding = make_faces_winding(graph);
    var edges_faces = graph.edges_faces ? graph.edges_faces : make_edges_faces(graph);
    edges_faces.forEach(function (faces, e) {
      if (faces.length === 1) {
        edges_assignment[e] = "B";
      }
      if (faces.length === 2) {
        var windings = faces.map(function (f) {
          return faces_winding[f];
        });
        if (windings[0] === windings[1]) {
          return "F";
        }
        var layers = faces.map(function (f) {
          return faces_layer[f];
        });
        var local_dir = layers[0] < layers[1];
        var global_dir = windings[0] ? local_dir : !local_dir;
        edges_assignment[e] = global_dir ? "V" : "M";
      }
    });
    return edges_assignment;
  };

  var edges_assignments = /*#__PURE__*/Object.freeze({
    __proto__: null,
    faces_layer_to_edges_assignments: faces_layer_to_edges_assignments
  });

  var get_unassigned_indices = function get_unassigned_indices(edges_assignment) {
    return edges_assignment.map(function (_, i) {
      return i;
    }).filter(function (i) {
      return edges_assignment[i] === "U" || edges_assignment[i] === "u";
    });
  };
  var maekawa_assignments = function maekawa_assignments(vertices_edges_assignments) {
    var unassigneds = get_unassigned_indices(vertices_edges_assignments);
    var permuts = Array.from(Array(Math.pow(2, unassigneds.length))).map(function (_, i) {
      return i.toString(2);
    }).map(function (l) {
      return Array(unassigneds.length - l.length + 1).join("0") + l;
    }).map(function (str) {
      return Array.from(str).map(function (l) {
        return l === "0" ? "V" : "M";
      });
    });
    var all = permuts.map(function (perm) {
      var array = vertices_edges_assignments.slice();
      unassigneds.forEach(function (index, i) {
        array[index] = perm[i];
      });
      return array;
    });
    if (vertices_edges_assignments.includes("B") || vertices_edges_assignments.includes("b")) {
      return all;
    }
    var count_m = all.map(function (a) {
      return a.filter(function (l) {
        return l === "M" || l === "m";
      }).length;
    });
    var count_v = all.map(function (a) {
      return a.filter(function (l) {
        return l === "V" || l === "v";
      }).length;
    });
    return all.filter(function (_, i) {
      return Math.abs(count_m[i] - count_v[i]) === 2;
    });
  };

  var assignment_solver = function assignment_solver(faces, assignments, epsilon) {
    if (assignments == null) {
      assignments = faces.map(function () {
        return "U";
      });
    }
    var all_assignments = maekawa_assignments(assignments);
    var layers = all_assignments.map(function (assigns) {
      return single_vertex_solver(faces, assigns, epsilon);
    });
    return all_assignments.map(function (_, i) {
      return i;
    }).filter(function (i) {
      return layers[i].length > 0;
    }).map(function (i) {
      return {
        assignment: all_assignments[i],
        layer: layers[i]
      };
    });
  };

  var layer = Object.assign(Object.create(null), {
    make_faces_layers: make_faces_layers,
    make_faces_layers_async: make_faces_layers_async,
    assignment_solver: assignment_solver,
    single_vertex_solver: single_vertex_solver,
    validate_layer_solver: validate_layer_solver,
    validate_taco_taco_face_pairs: validate_taco_taco_face_pairs,
    validate_taco_tortilla_strip: validate_taco_tortilla_strip,
    table: slow_lookup,
    topological_order: topological_order,
    make_conditions: make_conditions,
    conditions_to_matrix: conditions_to_matrix,
    make_tacos_tortillas: make_tacos_tortillas,
    make_folded_strip_tacos: make_folded_strip_tacos,
    make_transitivity_trios: make_transitivity_trios
  }, global_layer_solvers, general_global_solver, edges_assignments, dividing_axis$1, tortilla_tortilla, fold_assignments);

  var odd_assignment = function odd_assignment(assignments) {
    var ms = 0;
    var vs = 0;
    for (var i = 0; i < assignments.length; i += 1) {
      if (assignments[i] === "M" || assignments[i] === "m") {
        ms += 1;
      }
      if (assignments[i] === "V" || assignments[i] === "v") {
        vs += 1;
      }
    }
    for (var _i = 0; _i < assignments.length; _i += 1) {
      if (ms > vs && (assignments[_i] === "V" || assignments[_i] === "v")) {
        return _i;
      }
      if (vs > ms && (assignments[_i] === "M" || assignments[_i] === "m")) {
        return _i;
      }
    }
  };
  var single_vertex_fold_angles = function single_vertex_fold_angles(sectors, assignments) {
    var t = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var odd = odd_assignment(assignments);
    if (odd === undefined) {
      return;
    }
    var a = sectors[(odd + 1) % sectors.length];
    var b = sectors[(odd + 2) % sectors.length];
    var pbc = Math.PI * t;
    var cosE = -Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b) * Math.cos(Math.PI - pbc);
    var res = Math.cos(Math.PI - pbc) - Math.pow(Math.sin(Math.PI - pbc), 2) * Math.sin(a) * Math.sin(b) / (1 - cosE);
    var pab = -Math.acos(res) + Math.PI;
    return odd % 2 === 0 ? [pab, pbc, pab, pbc].map(function (n, i) {
      return odd === i ? -n : n;
    }) : [pbc, pab, pbc, pab].map(function (n, i) {
      return odd === i ? -n : n;
    });
  };

  var alternating_sum = function alternating_sum(numbers) {
    return [0, 1].map(function (even_odd) {
      return numbers.filter(function (_, i) {
        return i % 2 === even_odd;
      }).reduce(fn_add, 0);
    });
  };
  var alternating_sum_difference = function alternating_sum_difference(sectors) {
    var halfsum = sectors.reduce(fn_add, 0) / 2;
    return alternating_sum(sectors).map(function (s) {
      return s - halfsum;
    });
  };
  var kawasaki_solutions_radians = function kawasaki_solutions_radians(radians) {
    return radians
    .map(function (v, i, arr) {
      return [v, arr[(i + 1) % arr.length]];
    }).map(function (pair) {
      var _math$core;
      return (_math$core = math.core).counter_clockwise_angle_radians.apply(_math$core, _toConsumableArray(pair));
    })
    .map(function (_, i, arr) {
      return arr.slice(i + 1, arr.length).concat(arr.slice(0, i));
    })
    .map(function (opposite_sectors) {
      return alternating_sum(opposite_sectors).map(function (s) {
        return Math.PI - s;
      });
    })
    .map(function (kawasakis, i) {
      return radians[i] + kawasakis[0];
    })
    .map(function (angle, i) {
      return math.core.is_counter_clockwise_between(angle, radians[i], radians[(i + 1) % radians.length]) ? angle : undefined;
    });
  };
  var kawasaki_solutions_vectors = function kawasaki_solutions_vectors(vectors) {
    var vectors_radians = vectors.map(function (v) {
      return Math.atan2(v[1], v[0]);
    });
    return kawasaki_solutions_radians(vectors_radians).map(function (a) {
      return a === undefined ? undefined : [Math.cos(a), Math.sin(a)];
    });
  };

  var kawasaki_math = /*#__PURE__*/Object.freeze({
    __proto__: null,
    alternating_sum: alternating_sum,
    alternating_sum_difference: alternating_sum_difference,
    kawasaki_solutions_radians: kawasaki_solutions_radians,
    kawasaki_solutions_vectors: kawasaki_solutions_vectors
  });

  var kawasaki_solutions = function kawasaki_solutions(_ref, vertex) {
    var vertices_coords = _ref.vertices_coords,
        vertices_edges = _ref.vertices_edges,
        edges_vertices = _ref.edges_vertices,
        edges_vectors = _ref.edges_vectors;
    if (!edges_vectors) {
      edges_vectors = make_edges_vector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    if (!vertices_edges) {
      vertices_edges = make_vertices_edges({
        edges_vertices: edges_vertices
      });
    }
    var vectors = vertices_edges[vertex].map(function (i) {
      return edges_vectors[i];
    });
    var sortedVectors = math.core.counter_clockwise_order2(vectors).map(function (i) {
      return vectors[i];
    });
    return kawasaki_solutions_vectors(sortedVectors);
  };

  var kawasaki_graph = /*#__PURE__*/Object.freeze({
    __proto__: null,
    kawasaki_solutions: kawasaki_solutions
  });

  var maekawa_add = {
    M: -1,
    m: -1,
    V: 1,
    v: 1
  };
  var validate_maekawa = function validate_maekawa(_ref) {
    var edges_vertices = _ref.edges_vertices,
        vertices_edges = _ref.vertices_edges,
        edges_assignment = _ref.edges_assignment;
    if (!vertices_edges) {
      vertices_edges = make_vertices_edges$1({
        edges_vertices: edges_vertices
      });
    }
    var vertices_is_boundary = Array(vertices_edges.length).fill(false);
    get_boundary_vertices({
      edges_vertices: edges_vertices,
      edges_assignment: edges_assignment
    }).forEach(function (v) {
      vertices_is_boundary[v] = true;
    });
    var is_valid = vertices_edges.map(function (edges) {
      return edges.map(function (e) {
        return maekawa_add[edges_assignment[e]];
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    }).map(function (sum, e) {
      return vertices_is_boundary[e] || sum === 2 || sum === -2;
    });
    return is_valid.map(function (valid, v) {
      return !valid ? v : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var validate_kawasaki = function validate_kawasaki(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        vertices_vertices = _ref2.vertices_vertices,
        vertices_edges = _ref2.vertices_edges,
        edges_vertices = _ref2.edges_vertices,
        edges_assignment = _ref2.edges_assignment,
        edges_vector = _ref2.edges_vector;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    if (!vertices_vertices) {
      vertices_vertices = make_vertices_vertices({
        vertices_coords: vertices_coords,
        vertices_edges: vertices_edges,
        edges_vertices: edges_vertices
      });
    }
    var vertices_is_boundary = Array(vertices_coords.length).fill(false);
    get_boundary_vertices({
      edges_vertices: edges_vertices,
      edges_assignment: edges_assignment
    }).forEach(function (v) {
      vertices_is_boundary[v] = true;
    });
    var is_valid = make_vertices_sectors({
      vertices_coords: vertices_coords,
      vertices_vertices: vertices_vertices,
      edges_vertices: edges_vertices,
      edges_vector: edges_vector
    }).map(function (sectors) {
      return alternating_sum(sectors);
    }).map(function (pair, v) {
      return vertices_is_boundary[v] || Math.abs(pair[0] - pair[1]) < epsilon;
    });
    return is_valid.map(function (valid, v) {
      return !valid ? v : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
  };

  var validate = /*#__PURE__*/Object.freeze({
    __proto__: null,
    validate_maekawa: validate_maekawa,
    validate_kawasaki: validate_kawasaki
  });

  var vertex = Object.assign(Object.create(null), {
    maekawa_assignments: maekawa_assignments,
    fold_angles4: single_vertex_fold_angles
  }, kawasaki_math, kawasaki_graph, validate);

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
    axioms: axioms,
    folds: folds
  };

  var use = function use(library) {
    if (library == null || typeof library.linker !== "function") {
      return;
    }
    library.linker(this);
  };

  var vertices_circle = function vertices_circle(graph) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var g = root.svg.g();
    if (!graph || !graph.vertices_coords) {
      return g;
    }
    graph.vertices_coords.map(function (v) {
      return root.svg.circle(v[0], v[1], 0.01);
    })
    .forEach(function (v) {
      return g.appendChild(v);
    });
    g.setAttributeNS(null, "fill", _none$1);
    Object.keys(attributes).forEach(function (attr) {
      return g.setAttributeNS(null, attr, attributes[attr]);
    });
    return g;
  };

  var GROUP_FOLDED = {};
  var GROUP_FLAT = {
    stroke: _black
  };
  var STYLE_FOLDED = {};
  var STYLE_FLAT = {
    m: {
      stroke: "red"
    },
    v: {
      stroke: "blue"
    },
    f: {
      stroke: "lightgray"
    }
  };
  var edges_assignment_indices = function edges_assignment_indices(graph) {
    var assignment_indices = {
      u: [],
      f: [],
      v: [],
      m: [],
      b: []
    };
    var lowercase_assignment = graph[_edges_assignment].map(function (a) {
      return edges_assignment_to_lowercase[a];
    });
    graph[_edges_vertices].map(function (_, i) {
      return lowercase_assignment[i] || "u";
    }).forEach(function (a, i) {
      return assignment_indices[a].push(i);
    });
    return assignment_indices;
  };
  var edges_coords = function edges_coords(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices;
    if (!vertices_coords || !edges_vertices) {
      return [];
    }
    return edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    });
  };
  var segment_to_path = function segment_to_path(s) {
    return "M".concat(s[0][0], " ").concat(s[0][1], "L").concat(s[1][0], " ").concat(s[1][1]);
  };
  var edges_path_data = function edges_path_data(graph) {
    return edges_coords(graph).map(function (segment) {
      return segment_to_path(segment);
    }).join("");
  };
  var edges_path_data_assign = function edges_path_data_assign(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices,
        edges_assignment = _ref2.edges_assignment;
    if (!vertices_coords || !edges_vertices) {
      return {};
    }
    if (!edges_assignment) {
      return {
        u: edges_path_data({
          vertices_coords: vertices_coords,
          edges_vertices: edges_vertices
        })
      };
    }
    var data = edges_assignment_indices({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_assignment: edges_assignment
    });
    Object.keys(data).forEach(function (key) {
      data[key] = edges_path_data({
        vertices_coords: vertices_coords,
        edges_vertices: data[key].map(function (i) {
          return edges_vertices[i];
        })
      });
    });
    Object.keys(data).forEach(function (key) {
      if (data[key] === "") {
        delete data[key];
      }
    });
    return data;
  };
  var edges_paths_assign = function edges_paths_assign(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        edges_vertices = _ref3.edges_vertices,
        edges_assignment = _ref3.edges_assignment;
    var data = edges_path_data_assign({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_assignment: edges_assignment
    });
    Object.keys(data).forEach(function (assignment) {
      var path = root.svg.path(data[assignment]);
      path.setAttributeNS(null, _class$1, edges_assignment_names[assignment]);
      data[assignment] = path;
    });
    return data;
  };
  var apply_style$2 = function apply_style(el) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return Object.keys(attributes).forEach(function (key) {
      return el.setAttributeNS(null, key, attributes[key]);
    });
  };
  var edges_paths = function edges_paths(graph) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var group = root.svg.g();
    if (!graph) {
      return group;
    }
    var isFolded = is_folded_form(graph);
    var paths = edges_paths_assign(graph);
    Object.keys(paths).forEach(function (key) {
      paths[key].setAttributeNS(null, _class$1, edges_assignment_names[key]);
      apply_style$2(paths[key], isFolded ? STYLE_FOLDED[key] : STYLE_FLAT[key]);
      apply_style$2(paths[key], attributes[key]);
      apply_style$2(paths[key], attributes[edges_assignment_names[key]]);
      group.appendChild(paths[key]);
      Object.defineProperty(group, edges_assignment_names[key], {
        get: function get() {
          return paths[key];
        }
      });
    });
    apply_style$2(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
    apply_style$2(group, attributes.stroke ? {
      stroke: attributes.stroke
    } : {});
    return group;
  };

  var FACE_STYLE_FOLDED_ORDERED = {
    back: {
      fill: _white
    },
    front: {
      fill: "#ddd"
    }
  };
  var FACE_STYLE_FOLDED_UNORDERED = {
    back: {
      opacity: 0.1
    },
    front: {
      opacity: 0.1
    }
  };
  var FACE_STYLE_FLAT = {
  };
  var GROUP_STYLE_FOLDED_ORDERED = {
    stroke: _black,
    "stroke-linejoin": "bevel"
  };
  var GROUP_STYLE_FOLDED_UNORDERED = {
    stroke: _none$1,
    fill: _black,
    "stroke-linejoin": "bevel"
  };
  var GROUP_STYLE_FLAT = {
    fill: _none$1
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
  var apply_style$1 = function apply_style(el) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return Object.keys(attributes).forEach(function (key) {
      return el.setAttributeNS(null, key, attributes[key]);
    });
  };
  var finalize_faces = function finalize_faces(graph, svg_faces, group, attributes) {
    var isFolded = is_folded_form(graph);
    var orderIsCertain = graph[_faces_layer] != null && graph[_faces_layer].length === graph[_faces_vertices].length;
    var classNames = [[_front], [_back]];
    var faces_winding = make_faces_winding(graph);
    faces_winding.map(function (w) {
      return w ? classNames[0] : classNames[1];
    }).forEach(function (className, i) {
      svg_faces[i].setAttributeNS(null, _class$1, className);
      apply_style$1(svg_faces[i], isFolded ? orderIsCertain ? FACE_STYLE_FOLDED_ORDERED[className] : FACE_STYLE_FOLDED_UNORDERED[className] : FACE_STYLE_FLAT[className]);
      apply_style$1(svg_faces[i], attributes[className]);
    });
    var facesInOrder = orderIsCertain ? faces_sorted_by_layer(graph[_faces_layer]).map(function (i) {
      return svg_faces[i];
    }) : svg_faces;
    facesInOrder.forEach(function (face) {
      return group.appendChild(face);
    });
    Object.defineProperty(group, _front, {
      get: function get() {
        return svg_faces.filter(function (_, i) {
          return faces_winding[i];
        });
      }
    });
    Object.defineProperty(group, _back, {
      get: function get() {
        return svg_faces.filter(function (_, i) {
          return !faces_winding[i];
        });
      }
    });
    apply_style$1(group, isFolded ? orderIsCertain ? GROUP_STYLE_FOLDED_ORDERED : GROUP_STYLE_FOLDED_UNORDERED : GROUP_STYLE_FLAT);
    return group;
  };
  var faces_vertices_polygon = function faces_vertices_polygon(graph) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var g = root.svg.g();
    if (!graph || !graph.vertices_coords || !graph.faces_vertices) {
      return g;
    }
    var svg_faces = graph.faces_vertices.map(function (fv) {
      return fv.map(function (v) {
        return [0, 1].map(function (i) {
          return graph.vertices_coords[v][i];
        });
      });
    }).map(function (face) {
      return root.svg.polygon(face);
    });
    svg_faces.forEach(function (face, i) {
      return face.setAttributeNS(null, _index, i);
    });
    g.setAttributeNS(null, "fill", _white);
    return finalize_faces(graph, svg_faces, g, attributes);
  };
  var faces_edges_polygon = function faces_edges_polygon(graph) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var g = root.svg.g();
    if (!graph || _faces_edges in graph === false || _edges_vertices in graph === false || _vertices_coords in graph === false) {
      return g;
    }
    var svg_faces = graph[_faces_edges].map(function (face_edges) {
      return face_edges.map(function (edge) {
        return graph[_edges_vertices][edge];
      }).map(function (vi, i, arr) {
        var next = arr[(i + 1) % arr.length];
        return vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1];
      }).map(function (v) {
        return [0, 1].map(function (i) {
          return graph[_vertices_coords][v][i];
        });
      });
    }).map(function (face) {
      return root.svg.polygon(face);
    });
    svg_faces.forEach(function (face, i) {
      return face.setAttributeNS(null, _index, i);
    });
    g.setAttributeNS(null, "fill", "white");
    return finalize_faces(graph, svg_faces, g, attributes);
  };

  var FOLDED = {
    fill: _none$1
  };
  var FLAT = {
    stroke: _black,
    fill: _white
  };
  var apply_style = function apply_style(el) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return Object.keys(attributes).forEach(function (key) {
      return el.setAttributeNS(null, key, attributes[key]);
    });
  };
  var boundaries_polygon = function boundaries_polygon(graph) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var g = root.svg.g();
    if (!graph || !graph.vertices_coords || !graph.edges_vertices || !graph.edges_assignment) {
      return g;
    }
    var boundary = get_boundary(graph).vertices.map(function (v) {
      return [0, 1].map(function (i) {
        return graph.vertices_coords[v][i];
      });
    });
    if (boundary.length === 0) {
      return g;
    }
    var poly = root.svg.polygon(boundary);
    poly.setAttributeNS(null, _class$1, _boundary);
    g.appendChild(poly);
    apply_style(g, is_folded_form(graph) ? FOLDED : FLAT);
    Object.keys(attributes).forEach(function (attr) {
      return g.setAttributeNS(null, attr, attributes[attr]);
    });
    return g;
  };

  var faces_draw_function = function faces_draw_function(graph, options) {
    return graph != null && graph[_faces_vertices] != null ? faces_vertices_polygon(graph, options) : faces_edges_polygon(graph, options);
  };
  var svg_draw_func = {
    vertices: vertices_circle,
    edges: edges_paths,
    faces: faces_draw_function,
    boundaries: boundaries_polygon
  };
  var draw_group = function draw_group(key) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    var group = svg_draw_func[key].apply(svg_draw_func, args);
    group.setAttributeNS(null, _class$1, key);
    return group;
  };
  var DrawGroups = function DrawGroups(graph) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return [_boundaries, _faces, _edges, _vertices].map(function (key) {
      return draw_group(key, graph, options[key]);
    });
  };
  [_boundaries, _faces, _edges, _vertices].forEach(function (key) {
    DrawGroups[key] = function (graph) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return draw_group(key, graph, options[key]);
    };
  });

  var fold_classes = function fold_classes(graph) {
    return [graph[_file_classes] ? graph[_file_classes] : [], graph[_frame_classes] ? graph[_frame_classes] : []].reduce(function (a, b) {
      return a.concat(b);
    });
  };

  var linker = function linker(library) {
    library.graph.svg = this;
    var graphProtoMethods = {
      svg: this
    };
    Object.keys(graphProtoMethods).forEach(function (key) {
      library.graph.prototype[key] = function () {
        return graphProtoMethods[key].apply(graphProtoMethods, [this].concat(Array.prototype.slice.call(arguments)));
      };
    });
  };

  var bounding_rect = function bounding_rect(_ref) {
    var vertices_coords = _ref.vertices_coords;
    if (vertices_coords == null || vertices_coords.length <= 0) {
      return undefined;
    }
    var min = Array(2).fill(Infinity);
    var max = Array(2).fill(-Infinity);
    vertices_coords.forEach(function (v) {
      if (v[0] < min[0]) {
        min[0] = v[0];
      }
      if (v[0] > max[0]) {
        max[0] = v[0];
      }
      if (v[1] < min[1]) {
        min[1] = v[1];
      }
      if (v[1] > max[1]) {
        max[1] = v[1];
      }
    });
    var invalid = isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1]);
    return invalid ? undefined : [min[0], min[1], max[0] - min[0], max[1] - min[1]];
  };
  var make_svg_attributes = function make_svg_attributes(graph, options) {
    var setViewBox = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var attributes = {
      overflow: "visible"
    };
    if (!graph) {
      return attributes;
    }
    var viewBox = bounding_rect(graph);
    if (viewBox && setViewBox) {
      attributes.viewBox = viewBox.join(" ");
      var vmax = Math.max(viewBox[2], viewBox[3]);
      attributes[_stroke_width] = vmax / 100;
      attributes.width = viewBox[2];
      attributes.height = viewBox[3];
    }
    attributes[_class$1] = ["origami"].concat(fold_classes(graph)).join(" ");
    return attributes;
  };
  var setR = function setR(group, radius) {
    for (var i = 0; i < group.childNodes.length; i++) {
      group.childNodes[i].setAttributeNS(null, "r", radius);
    }
  };
  var drawInto = function drawInto(element, graph) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var options = args.filter(function (el) {
      return _typeof(el) === _object$1;
    }).shift() || {};
    var setViewBox = args.filter(function (el) {
      return _typeof(el) === _boolean$1;
    }).shift();
    var attrs = make_svg_attributes(graph, options, setViewBox);
    Object.keys(attrs).forEach(function (attr) {
      return element.setAttributeNS(null, attr, attrs[attr]);
    });
    var groups = DrawGroups(graph, options);
    groups.filter(function (group) {
      return group.childNodes.length > 0;
    }).forEach(function (group) {
      return element.appendChild(group);
    });
    if (attrs[_stroke_width]) {
      setR(groups[3], attrs[_stroke_width] * 2);
    }
    Object.keys(DrawGroups).forEach(function (key, i) {
      return Object.defineProperty(element, key, {
        get: function get() {
          return groups[i];
        }
      });
    });
    return element;
  };
  var FOLDtoSVG = function FOLDtoSVG(graph, options, setViewBox) {
    return drawInto(root.svg(), graph, options, setViewBox);
  };
  Object.keys(DrawGroups).forEach(function (key) {
    FOLDtoSVG[key] = DrawGroups[key];
  });
  FOLDtoSVG.drawInto = drawInto;
  Object.defineProperty(FOLDtoSVG, "linker", {
    enumerable: false,
    value: linker.bind(FOLDtoSVG)
  });

  var _NodeNames$v;
  var SVG_Constructor = {
    init: function init() {}
  };
  function SVG() {
    return SVG_Constructor.init.apply(SVG_Constructor, arguments);
  }
  var _class = "class";
  var _function = "function";
  var _undefined = "undefined";
  var _boolean = "boolean";
  var _number = "number";
  var _string = "string";
  var _object = "object";
  var _svg = "svg";
  var _path = "path";
  var _id = "id";
  var _style = "style";
  var _viewBox = "viewBox";
  var _transform = "transform";
  var _points = "points";
  var _stroke = "stroke";
  var _fill = "fill";
  var _none = "none";
  var _arrow = "arrow";
  var _head = "head";
  var _tail = "tail";
  var isBrowser$1 = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== _undefined && _typeof(window.document) !== _undefined;
  var isNode$1 = (typeof process === "undefined" ? "undefined" : _typeof(process)) !== _undefined && process.versions != null && process.versions.node != null;
  var isWebWorker = (typeof self === "undefined" ? "undefined" : _typeof(self)) === _object && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";
  var detect = Object.freeze({
    __proto__: null,
    isBrowser: isBrowser$1,
    isNode: isNode$1,
    isWebWorker: isWebWorker
  });
  var htmlString$1 = "<!DOCTYPE html><title>.</title>";
  var Window$1 = function () {
    var win = {};
    if (isNode$1) {
      var _require = require("@xmldom/xmldom"),
          DOMParser = _require.DOMParser,
          XMLSerializer = _require.XMLSerializer;
      win.DOMParser = DOMParser;
      win.XMLSerializer = XMLSerializer;
      win.document = new DOMParser().parseFromString(htmlString$1, "text/html");
    } else if (isBrowser$1) {
      win = window;
    }
    return win;
  }();
  var NS = "http://www.w3.org/2000/svg";
  var NodeNames = {
    s: ["svg"],
    d: ["defs"],
    h: ["desc", "filter", "metadata", "style", "script", "title", "view"],
    c: ["cdata"],
    g: ["g"],
    v: ["circle", "ellipse", "line", "path", "polygon", "polyline", "rect"],
    t: ["text"],
    i: ["marker", "symbol", "clipPath", "mask"],
    p: ["linearGradient", "radialGradient", "pattern"],
    cT: ["textPath", "tspan"],
    cG: ["stop"],
    cF: ["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]
  };
  var vec = function vec(a, d) {
    return [Math.cos(a) * d, Math.sin(a) * d];
  };
  var arcPath = function arcPath(x, y, radius, startAngle, endAngle) {
    var includeCenter = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    if (endAngle == null) {
      return "";
    }
    var start = vec(startAngle, radius);
    var end = vec(endAngle, radius);
    var arcVec = [end[0] - start[0], end[1] - start[1]];
    var py = start[0] * end[1] - start[1] * end[0];
    var px = start[0] * end[0] + start[1] * end[1];
    var arcdir = Math.atan2(py, px) > 0 ? 0 : 1;
    var d = includeCenter ? "M ".concat(x, ",").concat(y, " l ").concat(start[0], ",").concat(start[1], " ") : "M ".concat(x + start[0], ",").concat(y + start[1], " ");
    d += ["a ", radius, radius, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
    if (includeCenter) {
      d += " Z";
    }
    return d;
  };
  var arcArguments = function arcArguments(a, b, c, d, e) {
    return [arcPath(a, b, c, d, e, false)];
  };
  var Arc = {
    arc: {
      nodeName: _path,
      attributes: ["d"],
      args: arcArguments,
      methods: {
        setArc: function setArc(el) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          return el.setAttribute("d", arcArguments.apply(void 0, args));
        }
      }
    }
  };
  var wedgeArguments = function wedgeArguments(a, b, c, d, e) {
    return [arcPath(a, b, c, d, e, true)];
  };
  var Wedge = {
    wedge: {
      nodeName: _path,
      args: wedgeArguments,
      attributes: ["d"],
      methods: {
        setArc: function setArc(el) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }
          return el.setAttribute("d", wedgeArguments.apply(void 0, args));
        }
      }
    }
  };
  var COUNT = 128;
  var parabolaArguments = function parabolaArguments() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    return Array.from(Array(COUNT + 1)).map(function (_, i) {
      return (i - COUNT) / COUNT * 2 + 1;
    }).map(function (i) {
      return [x + (i + 1) * width * 0.5, y + Math.pow(i, 2) * height];
    });
  };
  var parabolaPathString = function parabolaPathString(a, b, c, d) {
    return [parabolaArguments(a, b, c, d).map(function (n) {
      return "".concat(n[0], ",").concat(n[1]);
    }).join(" ")];
  };
  var Parabola = {
    parabola: {
      nodeName: "polyline",
      attributes: [_points],
      args: parabolaPathString
    }
  };
  var regularPolygonArguments = function regularPolygonArguments(sides, cX, cY, radius) {
    var origin = [cX, cY];
    return Array.from(Array(sides)).map(function (el, i) {
      return 2 * Math.PI * i / sides;
    }).map(function (a) {
      return [Math.cos(a), Math.sin(a)];
    }).map(function (pts) {
      return origin.map(function (o, i) {
        return o + radius * pts[i];
      });
    });
  };
  var polygonPathString = function polygonPathString(sides) {
    var cX = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var cY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var radius = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    return [regularPolygonArguments(sides, cX, cY, radius).map(function (a) {
      return "".concat(a[0], ",").concat(a[1]);
    }).join(" ")];
  };
  var RegularPolygon = {
    regularPolygon: {
      nodeName: "polygon",
      attributes: [_points],
      args: polygonPathString
    }
  };
  var roundRectArguments = function roundRectArguments(x, y, width, height) {
    var cornerRadius = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    if (cornerRadius > width / 2) {
      cornerRadius = width / 2;
    }
    if (cornerRadius > height / 2) {
      cornerRadius = height / 2;
    }
    var w = width - cornerRadius * 2;
    var h = height - cornerRadius * 2;
    var s = "A".concat(cornerRadius, " ").concat(cornerRadius, " 0 0 1");
    return ["M".concat(x + (width - w) / 2, ",").concat(y), "h".concat(w), s, "".concat(x + width, ",").concat(y + (height - h) / 2), "v".concat(h), s, "".concat(x + width - cornerRadius, ",").concat(y + height), "h".concat(-w), s, "".concat(x, ",").concat(y + height - cornerRadius), "v".concat(-h), s, "".concat(x + cornerRadius, ",").concat(y)].join(" ");
  };
  var RoundRect = {
    roundRect: {
      nodeName: _path,
      attributes: ["d"],
      args: roundRectArguments
    }
  };
  var Case = {
    toCamel: function toCamel(s) {
      return s.replace(/([-_][a-z])/ig, function ($1) {
        return $1.toUpperCase().replace("-", "").replace("_", "");
      });
    },
    toKebab: function toKebab(s) {
      return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2").toLowerCase();
    },
    capitalized: function capitalized(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  };
  var is_iterable = function is_iterable(obj) {
    return obj != null && _typeof(obj[Symbol.iterator]) === _function;
  };
  var semi_flatten_arrays = function semi_flatten_arrays() {
    switch (arguments.length) {
      case undefined:
      case 0:
        return Array.from(arguments);
      case 1:
        return is_iterable(arguments[0]) && _typeof(arguments[0]) !== _string ? semi_flatten_arrays.apply(void 0, _toConsumableArray(arguments[0])) : [arguments[0]];
      default:
        return Array.from(arguments).map(function (a) {
          return is_iterable(a) ? _toConsumableArray(semi_flatten_arrays(a)) : a;
        });
    }
  };
  var flatten_arrays = function flatten_arrays() {
    return semi_flatten_arrays(arguments).reduce(function (a, b) {
      return a.concat(b);
    }, []);
  };
  var coordinates = function coordinates() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return args.filter(function (a) {
      return _typeof(a) === _number;
    }).concat(args.filter(function (a) {
      return _typeof(a) === _object && a !== null;
    }).map(function (el) {
      if (_typeof(el.x) === _number) {
        return [el.x, el.y];
      }
      if (_typeof(el[0]) === _number) {
        return [el[0], el[1]];
      }
      return undefined;
    }).filter(function (a) {
      return a !== undefined;
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []));
  };
  var magnitudeSq2 = function magnitudeSq2(a) {
    return Math.pow(a[0], 2) + Math.pow(a[1], 2);
  };
  var magnitude2 = function magnitude2(a) {
    return Math.sqrt(magnitudeSq2(a));
  };
  var distanceSq2 = function distanceSq2(a, b) {
    return magnitudeSq2(sub2(a, b));
  };
  var distance2 = function distance2(a, b) {
    return Math.sqrt(distanceSq2(a, b));
  };
  var add2 = function add2(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
  };
  var sub2 = function sub2(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
  };
  var scale2 = function scale2(a, s) {
    return [a[0] * s, a[1] * s];
  };
  var algebra = Object.freeze({
    __proto__: null,
    magnitudeSq2: magnitudeSq2,
    magnitude2: magnitude2,
    distanceSq2: distanceSq2,
    distance2: distance2,
    add2: add2,
    sub2: sub2,
    scale2: scale2
  });
  var ends = [_tail, _head];
  var stringifyPoint = function stringifyPoint(p) {
    return p.join(",");
  };
  var pointsToPath = function pointsToPath(points) {
    return "M" + points.map(function (pt) {
      return pt.join(",");
    }).join("L") + "Z";
  };
  var makeArrowPaths = function makeArrowPaths(options) {
    var pts = [[0, 1], [2, 3]].map(function (pt) {
      return pt.map(function (i) {
        return options.points[i] || 0;
      });
    });
    var vector = sub2(pts[1], pts[0]);
    var midpoint = add2(pts[0], scale2(vector, 0.5));
    var len = magnitude2(vector);
    var minLength = ends.map(function (s) {
      return options[s].visible ? (1 + options[s].padding) * options[s].height * 2.5 : 0;
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
    if (len < minLength) {
      var minVec = len === 0 ? [minLength, 0] : scale2(vector, minLength / len);
      pts = [sub2, add2].map(function (f) {
        return f(midpoint, scale2(minVec, 0.5));
      });
      vector = sub2(pts[1], pts[0]);
    }
    var perpendicular = [vector[1], -vector[0]];
    var bezPoint = add2(midpoint, scale2(perpendicular, options.bend));
    var bezs = pts.map(function (pt) {
      return sub2(bezPoint, pt);
    });
    var bezsLen = bezs.map(function (v) {
      return magnitude2(v);
    });
    var bezsNorm = bezs.map(function (bez, i) {
      return bezsLen[i] === 0 ? bez : scale2(bez, 1 / bezsLen[i]);
    });
    var vectors = bezsNorm.map(function (norm) {
      return scale2(norm, -1);
    });
    var normals = vectors.map(function (vec) {
      return [vec[1], -vec[0]];
    });
    var pad = ends.map(function (s, i) {
      return options[s].padding ? options[s].padding : options.padding ? options.padding : 0.0;
    });
    var scales = ends.map(function (s, i) {
      return options[s].height * (options[s].visible ? 1 : 0);
    }).map(function (n, i) {
      return n + pad[i];
    });
    var arcs = pts.map(function (pt, i) {
      return add2(pt, scale2(bezsNorm[i], scales[i]));
    });
    vector = sub2(arcs[1], arcs[0]);
    perpendicular = [vector[1], -vector[0]];
    midpoint = add2(arcs[0], scale2(vector, 0.5));
    bezPoint = add2(midpoint, scale2(perpendicular, options.bend));
    var controls = arcs.map(function (arc, i) {
      return add2(arc, scale2(sub2(bezPoint, arc), options.pinch));
    });
    var polyPoints = ends.map(function (s, i) {
      return [add2(arcs[i], scale2(vectors[i], options[s].height)), add2(arcs[i], scale2(normals[i], options[s].width / 2)), add2(arcs[i], scale2(normals[i], -options[s].width / 2))];
    });
    return {
      line: "M".concat(stringifyPoint(arcs[0]), "C").concat(stringifyPoint(controls[0]), ",").concat(stringifyPoint(controls[1]), ",").concat(stringifyPoint(arcs[1])),
      tail: pointsToPath(polyPoints[0]),
      head: pointsToPath(polyPoints[1])
    };
  };
  var setArrowheadOptions = function setArrowheadOptions(element, options, which) {
    if (_typeof(options) === _boolean) {
      element.options[which].visible = options;
    } else if (_typeof(options) === _object) {
      Object.assign(element.options[which], options);
      if (options.visible == null) {
        element.options[which].visible = true;
      }
    } else if (options == null) {
      element.options[which].visible = true;
    }
  };
  var setArrowStyle = function setArrowStyle(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var which = arguments.length > 2 ? arguments[2] : undefined;
    var path = element.getElementsByClassName("".concat(_arrow, "-").concat(which))[0];
    Object.keys(options).map(function (key) {
      return {
        key: key,
        fn: path[Case.toCamel(key)]
      };
    }).filter(function (el) {
      return _typeof(el.fn) === _function;
    }).forEach(function (el) {
      return el.fn(options[el.key]);
    });
  };
  var redraw = function redraw(element) {
    var paths = makeArrowPaths(element.options);
    Object.keys(paths).map(function (path) {
      return {
        path: path,
        element: element.getElementsByClassName("".concat(_arrow, "-").concat(path))[0]
      };
    }).filter(function (el) {
      return el.element;
    }).map(function (el) {
      el.element.setAttribute("d", paths[el.path]);
      return el;
    }).filter(function (el) {
      return element.options[el.path];
    }).forEach(function (el) {
      return el.element.setAttribute("visibility", element.options[el.path].visible ? "visible" : "hidden");
    });
    return element;
  };
  var setPoints$3 = function setPoints$3(element) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }
    element.options.points = coordinates.apply(void 0, _toConsumableArray(flatten_arrays.apply(void 0, args))).slice(0, 4);
    return redraw(element);
  };
  var bend$1 = function bend$1(element, amount) {
    element.options.bend = amount;
    return redraw(element);
  };
  var pinch$1 = function pinch$1(element, amount) {
    element.options.pinch = amount;
    return redraw(element);
  };
  var padding = function padding(element, amount) {
    element.options.padding = amount;
    return redraw(element);
  };
  var head = function head(element, options) {
    setArrowheadOptions(element, options, _head);
    setArrowStyle(element, options, _head);
    return redraw(element);
  };
  var tail = function tail(element, options) {
    setArrowheadOptions(element, options, _tail);
    setArrowStyle(element, options, _tail);
    return redraw(element);
  };
  var getLine = function getLine(element) {
    return element.getElementsByClassName("".concat(_arrow, "-line"))[0];
  };
  var getHead = function getHead(element) {
    return element.getElementsByClassName("".concat(_arrow, "-").concat(_head))[0];
  };
  var getTail = function getTail(element) {
    return element.getElementsByClassName("".concat(_arrow, "-").concat(_tail))[0];
  };
  var methods$5 = {
    setPoints: setPoints$3,
    points: setPoints$3,
    bend: bend$1,
    pinch: pinch$1,
    padding: padding,
    head: head,
    tail: tail,
    getLine: getLine,
    getHead: getHead,
    getTail: getTail
  };
  var endOptions = function endOptions() {
    return {
      visible: false,
      width: 8,
      height: 10,
      padding: 0.0
    };
  };
  var makeArrowOptions = function makeArrowOptions() {
    return {
      head: endOptions(),
      tail: endOptions(),
      bend: 0.0,
      padding: 0.0,
      pinch: 0.618,
      points: []
    };
  };
  var arrowKeys = Object.keys(makeArrowOptions());
  var matchingOptions = function matchingOptions() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    for (var a = 0; a < args.length; a++) {
      if (_typeof(args[a]) !== _object) {
        continue;
      }
      var keys = Object.keys(args[a]);
      for (var i = 0; i < keys.length; i++) {
        if (arrowKeys.includes(keys[i])) {
          return args[a];
        }
      }
    }
  };
  var init = function init(element) {
    element.setAttribute(_class, _arrow);
    var paths = ["line", _tail, _head].map(function (key) {
      return SVG.path().setClass("".concat(_arrow, "-").concat(key)).appendTo(element);
    });
    paths[0].setAttribute(_style, "fill:none;");
    paths[1].setAttribute(_stroke, _none);
    paths[2].setAttribute(_stroke, _none);
    element.options = makeArrowOptions();
    for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      args[_key6 - 1] = arguments[_key6];
    }
    methods$5.setPoints.apply(methods$5, [element].concat(args));
    var options = matchingOptions.apply(void 0, args);
    if (options) {
      Object.keys(options).filter(function (key) {
        return methods$5[key];
      }).forEach(function (key) {
        return methods$5[key](element, options[key]);
      });
    }
    return element;
  };
  var Arrow = {
    arrow: {
      nodeName: "g",
      attributes: [],
      args: function args() {
        return [];
      },
      methods: methods$5,
      init: init
    }
  };
  var makeCurvePath = function makeCurvePath() {
    var endpoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var bend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var pinch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var tailPt = [endpoints[0] || 0, endpoints[1] || 0];
    var headPt = [endpoints[2] || 0, endpoints[3] || 0];
    var vector = sub2(headPt, tailPt);
    var midpoint = add2(tailPt, scale2(vector, 0.5));
    var perpendicular = [vector[1], -vector[0]];
    var bezPoint = add2(midpoint, scale2(perpendicular, bend));
    var tailControl = add2(tailPt, scale2(sub2(bezPoint, tailPt), pinch));
    var headControl = add2(headPt, scale2(sub2(bezPoint, headPt), pinch));
    return "M".concat(tailPt[0], ",").concat(tailPt[1], "C").concat(tailControl[0], ",").concat(tailControl[1], " ").concat(headControl[0], ",").concat(headControl[1], " ").concat(headPt[0], ",").concat(headPt[1]);
  };
  var curveArguments = function curveArguments() {
    return [makeCurvePath(coordinates.apply(void 0, _toConsumableArray(flatten_arrays.apply(void 0, arguments))))];
  };
  var getNumbersFromPathCommand = function getNumbersFromPathCommand(str) {
    return str.slice(1).split(/[, ]+/).map(function (s) {
      return parseFloat(s);
    });
  };
  var getCurveTos = function getCurveTos(d) {
    return d.match(/[Cc][(0-9), .-]+/).map(function (curve) {
      return getNumbersFromPathCommand(curve);
    });
  };
  var getMoveTos = function getMoveTos(d) {
    return d.match(/[Mm][(0-9), .-]+/).map(function (curve) {
      return getNumbersFromPathCommand(curve);
    });
  };
  var getCurveEndpoints = function getCurveEndpoints(d) {
    var move = getMoveTos(d).shift();
    var curve = getCurveTos(d).shift();
    var start = move ? [move[move.length - 2], move[move.length - 1]] : [0, 0];
    var end = curve ? [curve[curve.length - 2], curve[curve.length - 1]] : [0, 0];
    return [].concat(start, end);
  };
  var setPoints$2 = function setPoints$2(element) {
    for (var _len7 = arguments.length, args = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      args[_key7 - 1] = arguments[_key7];
    }
    var coords = coordinates.apply(void 0, _toConsumableArray(flatten_arrays.apply(void 0, args))).slice(0, 4);
    element.setAttribute("d", makeCurvePath(coords, element._bend, element._pinch));
    return element;
  };
  var bend = function bend(element, amount) {
    element._bend = amount;
    return setPoints$2.apply(void 0, [element].concat(_toConsumableArray(getCurveEndpoints(element.getAttribute("d")))));
  };
  var pinch = function pinch(element, amount) {
    element._pinch = amount;
    return setPoints$2.apply(void 0, [element].concat(_toConsumableArray(getCurveEndpoints(element.getAttribute("d")))));
  };
  var methods$4 = {
    setPoints: setPoints$2,
    bend: bend,
    pinch: pinch
  };
  var Curve = {
    curve: {
      nodeName: _path,
      attributes: ["d"],
      args: curveArguments,
      methods: methods$4
    }
  };
  var nodes = {};
  Object.assign(nodes, Arc, Wedge, Parabola, RegularPolygon, RoundRect, Arrow, Curve);
  var customPrimitives = Object.keys(nodes);
  var headerStuff = [NodeNames.h, NodeNames.p, NodeNames.i];
  var drawingShapes = [NodeNames.g, NodeNames.v, NodeNames.t, customPrimitives];
  var folders = {
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
    mask: drawingShapes
  };
  var nodesAndChildren = Object.create(null);
  Object.keys(folders).forEach(function (key) {
    nodesAndChildren[key] = folders[key].reduce(function (a, b) {
      return a.concat(b);
    }, []);
  });
  var viewBoxValue = function viewBoxValue(x, y, width, height) {
    var padding = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var scale = 1.0;
    var d = width / scale - width;
    var X = x - d - padding;
    var Y = y - d - padding;
    var W = width + d * 2 + padding * 2;
    var H = height + d * 2 + padding * 2;
    return [X, Y, W, H].join(" ");
  };
  function viewBox$1() {
    var numbers = coordinates.apply(void 0, _toConsumableArray(flatten_arrays(arguments)));
    if (numbers.length === 2) {
      numbers.unshift(0, 0);
    }
    return numbers.length === 4 ? viewBoxValue.apply(void 0, _toConsumableArray(numbers)) : undefined;
  }
  var cdata = function cdata(textContent) {
    return new Window$1.DOMParser().parseFromString("<root></root>", "text/xml").createCDATASection("".concat(textContent));
  };
  var removeChildren = function removeChildren(element) {
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
    return element;
  };
  var appendTo = function appendTo(element, parent) {
    if (parent != null) {
      parent.appendChild(element);
    }
    return element;
  };
  var setAttributes = function setAttributes(element, attrs) {
    return Object.keys(attrs).forEach(function (key) {
      return element.setAttribute(Case.toKebab(key), attrs[key]);
    });
  };
  var moveChildren = function moveChildren(target, source) {
    while (source.childNodes.length > 0) {
      var node = source.childNodes[0];
      source.removeChild(node);
      target.appendChild(node);
    }
    return target;
  };
  var clearSVG = function clearSVG(element) {
    Array.from(element.attributes).filter(function (a) {
      return a !== "xmlns";
    }).forEach(function (attr) {
      return element.removeAttribute(attr.name);
    });
    return removeChildren(element);
  };
  var assignSVG = function assignSVG(target, source) {
    Array.from(source.attributes).forEach(function (attr) {
      return target.setAttribute(attr.name, attr.value);
    });
    return moveChildren(target, source);
  };
  var dom = {
    removeChildren: removeChildren,
    appendTo: appendTo,
    setAttributes: setAttributes
  };
  var filterWhitespaceNodes = function filterWhitespaceNodes(node) {
    if (node === null) {
      return node;
    }
    for (var i = node.childNodes.length - 1; i >= 0; i -= 1) {
      var child = node.childNodes[i];
      if (child.nodeType === 3 && child.data.match(/^\s*$/)) {
        node.removeChild(child);
      }
      if (child.nodeType === 1) {
        filterWhitespaceNodes(child);
      }
    }
    return node;
  };
  var parse = function parse(string) {
    return new Window$1.DOMParser().parseFromString(string, "text/xml");
  };
  var checkParseError = function checkParseError(xml) {
    var parserErrors = xml.getElementsByTagName("parsererror");
    if (parserErrors.length > 0) {
      throw new Error(parserErrors[0]);
    }
    return filterWhitespaceNodes(xml.documentElement);
  };
  var async = function async(input) {
    return new Promise(function (resolve, reject) {
      if (_typeof(input) === _string || input instanceof String) {
        fetch(input).then(function (response) {
          return response.text();
        }).then(function (str) {
          return checkParseError(parse(str));
        }).then(function (xml) {
          return xml.nodeName === _svg ? xml : xml.getElementsByTagName(_svg)[0];
        }).then(function (svg) {
          return svg == null ? reject("valid XML found, but no SVG element") : resolve(svg);
        })["catch"](function (err) {
          return reject(err);
        });
      } else if (input instanceof Window$1.Document) {
        return asyncDone(input);
      }
    });
  };
  var sync = function sync(input) {
    if (_typeof(input) === _string || input instanceof String) {
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
  var isFilename = function isFilename(input) {
    return _typeof(input) === _string && /^[\w,\s-]+\.[A-Za-z]{3}$/.test(input) && input.length < 10000;
  };
  var Load = function Load(input) {
    return isFilename(input) && isBrowser$1 && _typeof(Window$1.fetch) === _function ? async(input) : sync(input);
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
  var SAVE_OPTIONS = function SAVE_OPTIONS() {
    return {
      download: false,
      output: _string,
      windowStyle: false,
      filename: "image.svg"
    };
  };
  var getWindowStylesheets = function getWindowStylesheets() {
    var css = [];
    if (Window$1.document.styleSheets) {
      for (var s = 0; s < Window$1.document.styleSheets.length; s += 1) {
        var sheet = Window$1.document.styleSheets[s];
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
    }
    return css.join("\n");
  };
  var downloadInBrowser = function downloadInBrowser(filename, contentsAsString) {
    var blob = new Window$1.Blob([contentsAsString], {
      type: "text/plain"
    });
    var a = Window$1.document.createElement("a");
    a.setAttribute("href", Window$1.URL.createObjectURL(blob));
    a.setAttribute("download", filename);
    Window$1.document.body.appendChild(a);
    a.click();
    Window$1.document.body.removeChild(a);
  };
  var save = function save(svg, options) {
    options = Object.assign(SAVE_OPTIONS(), options);
    if (options.windowStyle) {
      var styleContainer = Window$1.document.createElementNS(NS, _style);
      styleContainer.setAttribute("type", "text/css");
      styleContainer.innerHTML = getWindowStylesheets();
      svg.appendChild(styleContainer);
    }
    var source = new Window$1.XMLSerializer().serializeToString(svg);
    var formattedString = vkXML(source);
    if (options.download && isBrowser$1 && !isNode$1) {
      downloadInBrowser(options.filename, formattedString);
    }
    return options.output === _svg ? svg : formattedString;
  };
  var setViewBox = function setViewBox(element) {
    for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
      args[_key8 - 1] = arguments[_key8];
    }
    var viewBox = args.length === 1 && _typeof(args[0]) === _string ? args[0] : viewBox$1.apply(void 0, args);
    if (viewBox) {
      element.setAttribute(_viewBox, viewBox);
    }
    return element;
  };
  var getViewBox = function getViewBox(element) {
    var vb = element.getAttribute(_viewBox);
    return vb == null ? undefined : vb.split(" ").map(function (n) {
      return parseFloat(n);
    });
  };
  var convertToViewBox = function convertToViewBox(svg, x, y) {
    var pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    var svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    return [svgPoint.x, svgPoint.y];
  };
  var viewBox = Object.freeze({
    __proto__: null,
    setViewBox: setViewBox,
    getViewBox: getViewBox,
    convertToViewBox: convertToViewBox
  });
  var loadSVG = function loadSVG(target, data) {
    var result = Load(data);
    if (result == null) {
      return;
    }
    return _typeof(result.then) === _function ? result.then(function (svg) {
      return assignSVG(target, svg);
    }) : assignSVG(target, result);
  };
  var getFrame = function getFrame(element) {
    var viewBox = getViewBox(element);
    if (viewBox !== undefined) {
      return viewBox;
    }
    if (_typeof(element.getBoundingClientRect) === _function) {
      var rr = element.getBoundingClientRect();
      return [rr.x, rr.y, rr.width, rr.height];
    }
    return [];
  };
  var setPadding = function setPadding(element, padding) {
    var viewBox = getViewBox(element);
    if (viewBox !== undefined) {
      setViewBox.apply(void 0, [element].concat(_toConsumableArray([-padding, -padding, padding * 2, padding * 2].map(function (nudge, i) {
        return viewBox[i] + nudge;
      }))));
    }
    return element;
  };
  var bgClass = "svg-background-rectangle";
  var background = function background(element, color) {
    var backRect = Array.from(element.childNodes).filter(function (child) {
      return child.getAttribute(_class) === bgClass;
    }).shift();
    if (backRect == null) {
      backRect = this.Constructor.apply(this, ["rect"].concat(_toConsumableArray(getFrame(element))));
      backRect.setAttribute(_class, bgClass);
      backRect.setAttribute(_stroke, _none);
      element.insertBefore(backRect, element.firstChild);
    }
    backRect.setAttribute(_fill, color);
    return element;
  };
  var findStyleSheet = function findStyleSheet(element) {
    var styles = element.getElementsByTagName(_style);
    return styles.length === 0 ? undefined : styles[0];
  };
  var _stylesheet = function stylesheet(element, textContent) {
    var styleSection = findStyleSheet(element);
    if (styleSection == null) {
      styleSection = this.Constructor(_style);
      element.insertBefore(styleSection, element.firstChild);
    }
    styleSection.textContent = "";
    styleSection.appendChild(cdata(textContent));
    return styleSection;
  };
  var methods$3 = {
    clear: clearSVG,
    size: setViewBox,
    setViewBox: setViewBox,
    getViewBox: getViewBox,
    padding: setPadding,
    background: background,
    getWidth: function getWidth(el) {
      return getFrame(el)[2];
    },
    getHeight: function getHeight(el) {
      return getFrame(el)[3];
    },
    stylesheet: function stylesheet(el, text) {
      return _stylesheet.call(this, el, text);
    },
    load: loadSVG,
    save: save
  };
  var libraries = {
    math: {
      vector: function vector() {
        for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
          args[_key9] = arguments[_key9];
        }
        return [].concat(args);
      }
    }
  };
  var categories = {
    move: ["mousemove", "touchmove"],
    press: ["mousedown", "touchstart"],
    release: ["mouseup", "touchend"]
  };
  var handlerNames = Object.values(categories).reduce(function (a, b) {
    return a.concat(b);
  }, []);
  var off = function off(element, handlers) {
    return handlerNames.forEach(function (handlerName) {
      handlers[handlerName].forEach(function (func) {
        return element.removeEventListener(handlerName, func);
      });
      handlers[handlerName] = [];
    });
  };
  var defineGetter = function defineGetter(obj, prop, value) {
    return Object.defineProperty(obj, prop, {
      get: function get() {
        return value;
      },
      enumerable: true,
      configurable: true
    });
  };
  var assignPress = function assignPress(e, startPoint) {
    ["pressX", "pressY"].filter(function (prop) {
      return !e.hasOwnProperty(prop);
    }).forEach(function (prop, i) {
      return defineGetter(e, prop, startPoint[i]);
    });
    if (!e.hasOwnProperty("press")) {
      var _libraries$math;
      defineGetter(e, "press", (_libraries$math = libraries.math).vector.apply(_libraries$math, _toConsumableArray(startPoint)));
    }
  };
  var TouchEvents = function TouchEvents(element) {
    var startPoint = [];
    var handlers = [];
    Object.keys(categories).forEach(function (key) {
      categories[key].forEach(function (handler) {
        handlers[handler] = [];
      });
    });
    var removeHandler = function removeHandler(category) {
      return categories[category].forEach(function (handlerName) {
        return handlers[handlerName].forEach(function (func) {
          return element.removeEventListener(handlerName, func);
        });
      });
    };
    var categoryUpdate = {
      press: function press(e, viewPoint) {
        startPoint = viewPoint;
        assignPress(e, startPoint);
      },
      release: function release() {},
      move: function move(e, viewPoint) {
        if (e.buttons > 0 && startPoint[0] === undefined) {
          startPoint = viewPoint;
        } else if (e.buttons === 0 && startPoint[0] !== undefined) {
          startPoint = [];
        }
        assignPress(e, startPoint);
      }
    };
    Object.keys(categories).forEach(function (category) {
      var propName = "on" + Case.capitalized(category);
      Object.defineProperty(element, propName, {
        set: function set(handler) {
          return handler == null ? removeHandler(category) : categories[category].forEach(function (handlerName) {
            var handlerFunc = function handlerFunc(e) {
              var pointer = e.touches != null ? e.touches[0] : e;
              if (pointer !== undefined) {
                var viewPoint = convertToViewBox(element, pointer.clientX, pointer.clientY).map(function (n) {
                  return isNaN(n) ? undefined : n;
                });
                ["x", "y"].filter(function (prop) {
                  return !e.hasOwnProperty(prop);
                }).forEach(function (prop, i) {
                  return defineGetter(e, prop, viewPoint[i]);
                });
                if (!e.hasOwnProperty("position")) {
                  var _libraries$math2;
                  defineGetter(e, "position", (_libraries$math2 = libraries.math).vector.apply(_libraries$math2, _toConsumableArray(viewPoint)));
                }
                categoryUpdate[category](e, viewPoint);
              }
              handler(e);
            };
            if (element.addEventListener) {
              handlers[handlerName].push(handlerFunc);
              element.addEventListener(handlerName, handlerFunc);
            }
          });
        },
        enumerable: true
      });
    });
    Object.defineProperty(element, "off", {
      value: function value() {
        return off(element, handlers);
      }
    });
  };
  var UUID = function UUID() {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').concat("aaaaa").substr(0, 5);
  };
  var Animation = function Animation(element) {
    var start;
    var handlers = {};
    var frame = 0;
    var requestId;
    var removeHandlers = function removeHandlers() {
      if (Window$1.cancelAnimationFrame) {
        Window$1.cancelAnimationFrame(requestId);
      }
      Object.keys(handlers).forEach(function (uuid) {
        return delete handlers[uuid];
      });
      start = undefined;
      frame = 0;
    };
    Object.defineProperty(element, "play", {
      set: function set(handler) {
        removeHandlers();
        if (handler == null) {
          return;
        }
        var uuid = UUID();
        var handlerFunc = function handlerFunc(e) {
          if (!start) {
            start = e;
            frame = 0;
          }
          var progress = (e - start) * 0.001;
          handler({
            time: progress,
            frame: frame
          });
          frame += 1;
          if (handlers[uuid]) {
            requestId = Window$1.requestAnimationFrame(handlers[uuid]);
          }
        };
        handlers[uuid] = handlerFunc;
        if (Window$1.requestAnimationFrame) {
          requestId = Window$1.requestAnimationFrame(handlers[uuid]);
        }
      },
      enumerable: true
    });
    Object.defineProperty(element, "stop", {
      value: removeHandlers,
      enumerable: true
    });
  };
  var removeFromParent = function removeFromParent(svg) {
    return svg && svg.parentNode ? svg.parentNode.removeChild(svg) : undefined;
  };
  var possiblePositionAttributes = [["cx", "cy"], ["x", "y"]];
  var controlPoint = function controlPoint(parent) {
    var position = [0, 0];
    var cp = {
      selected: false,
      svg: undefined,
      updatePosition: function updatePosition(input) {
        return input;
      }
    };
    var updateSVG = function updateSVG() {
      if (!cp.svg) {
        return;
      }
      if (!cp.svg.parentNode) {
        parent.appendChild(cp.svg);
      }
      possiblePositionAttributes.filter(function (coords) {
        return cp.svg[coords[0]] != null;
      }).forEach(function (coords) {
        return coords.forEach(function (attr, i) {
          cp.svg.setAttribute(attr, position[i]);
        });
      });
    };
    var proxy = new Proxy(position, {
      set: function set(target, property, value) {
        target[property] = value;
        updateSVG();
        return true;
      }
    });
    var setPosition = function setPosition() {
      coordinates.apply(void 0, _toConsumableArray(flatten_arrays.apply(void 0, arguments))).forEach(function (n, i) {
        position[i] = n;
      });
      updateSVG();
      if (_typeof(position.delegate) === _function) {
        position.delegate.apply(position.pointsContainer, [proxy, position.pointsContainer]);
      }
    };
    position.delegate = undefined;
    position.setPosition = setPosition;
    position.onMouseMove = function (mouse) {
      return cp.selected ? setPosition(cp.updatePosition(mouse)) : undefined;
    };
    position.onMouseUp = function () {
      cp.selected = false;
    };
    position.distance = function (mouse) {
      return Math.sqrt(distanceSq2(mouse, position));
    };
    ["x", "y"].forEach(function (prop, i) {
      return Object.defineProperty(position, prop, {
        get: function get() {
          return position[i];
        },
        set: function set(v) {
          position[i] = v;
        }
      });
    });
    [_svg, "updatePosition", "selected"].forEach(function (key) {
      return Object.defineProperty(position, key, {
        get: function get() {
          return cp[key];
        },
        set: function set(v) {
          cp[key] = v;
        }
      });
    });
    Object.defineProperty(position, "remove", {
      value: function value() {
        removeFromParent(cp.svg);
        position.delegate = undefined;
      }
    });
    return proxy;
  };
  var controls = function controls(svg, number, options) {
    var selected;
    var delegate;
    var points = Array.from(Array(number)).map(function () {
      return controlPoint(svg);
    });
    var protocol = function protocol(point) {
      return _typeof(delegate) === _function ? delegate.call(points, point, selected, points) : undefined;
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
          d: distanceSq2(p, [mouse.x, mouse.y])
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
    svg.onPress = mousePressedHandler;
    svg.onMove = mouseMovedHandler;
    svg.onRelease = mouseReleasedHandler;
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
        points.push(controlPoint(svg));
      }
    });
    points.removeAll = function () {
      while (points.length > 0) {
        points.pop().remove();
      }
    };
    var functionalMethods = {
      onChange: function onChange(func, runOnceAtStart) {
        delegate = func;
        if (runOnceAtStart === true) {
          var index = points.length - 1;
          func.call(points, points[index], index, points);
        }
      },
      position: function position(func) {
        return points.forEach(function (p, i) {
          return p.setPosition(func.call(points, p, i, points));
        });
      },
      svg: function svg(func) {
        return points.forEach(function (p, i) {
          p.svg = func.call(points, p, i, points);
        });
      }
    };
    Object.keys(functionalMethods).forEach(function (key) {
      points[key] = function () {
        if (_typeof(arguments[0]) === _function) {
          functionalMethods[key].apply(functionalMethods, arguments);
        }
        return points;
      };
    });
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
  var applyControlsToSVG = function applyControlsToSVG(svg) {
    svg.controls = function () {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }
      return controls.call.apply(controls, [svg, svg].concat(args));
    };
  };
  var ElementConstructor = new Window$1.DOMParser().parseFromString("<div />", "text/xml").documentElement.constructor;
  var svgDef = {
    svg: {
      args: function args() {
        return [viewBox$1(coordinates.apply(void 0, arguments))].filter(function (a) {
          return a != null;
        });
      },
      methods: methods$3,
      init: function init(element) {
        for (var _len11 = arguments.length, args = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
          args[_key11 - 1] = arguments[_key11];
        }
        args.filter(function (a) {
          return _typeof(a) === _string;
        }).forEach(function (string) {
          return loadSVG(element, string);
        });
        args.filter(function (a) {
          return a != null;
        }).filter(function (arg) {
          return arg instanceof ElementConstructor;
        }).filter(function (el) {
          return _typeof(el.appendChild) === _function;
        }).forEach(function (parent) {
          return parent.appendChild(element);
        });
        TouchEvents(element);
        Animation(element);
        applyControlsToSVG(element);
      }
    }
  };
  var loadGroup = function loadGroup(group) {
    for (var _len12 = arguments.length, sources = new Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
      sources[_key12 - 1] = arguments[_key12];
    }
    var elements = sources.map(function (source) {
      return sync(source);
    }).filter(function (a) {
      return a !== undefined;
    });
    elements.filter(function (element) {
      return element.tagName === _svg;
    }).forEach(function (element) {
      return moveChildren(group, element);
    });
    elements.filter(function (element) {
      return element.tagName !== _svg;
    }).forEach(function (element) {
      return group.appendChild(element);
    });
    return group;
  };
  var gDef = {
    g: {
      init: loadGroup,
      methods: {
        load: loadGroup
      }
    }
  };
  var attributes = Object.assign(Object.create(null), {
    svg: [_viewBox],
    line: ["x1", "y1", "x2", "y2"],
    rect: ["x", "y", "width", "height"],
    circle: ["cx", "cy", "r"],
    ellipse: ["cx", "cy", "rx", "ry"],
    polygon: [_points],
    polyline: [_points],
    path: ["d"],
    text: ["x", "y"],
    mask: [_id],
    symbol: [_id],
    clipPath: [_id, "clip-rule"],
    marker: [_id, "markerHeight", "markerUnits", "markerWidth", "orient", "refX", "refY"],
    linearGradient: ["x1", "x2", "y1", "y2"],
    radialGradient: ["cx", "cy", "r", "fr", "fx", "fy"],
    stop: ["offset", "stop-color", "stop-opacity"],
    pattern: ["patternContentUnits", "patternTransform", "patternUnits"]
  });
  var setRadius = function setRadius(el, r) {
    el.setAttribute(attributes.circle[2], r);
    return el;
  };
  var setOrigin = function setOrigin(el, a, b) {
    _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(flatten_arrays(a, b))).slice(0, 2)).forEach(function (value, i) {
      return el.setAttribute(attributes.circle[i], value);
    });
    return el;
  };
  var fromPoints = function fromPoints(a, b, c, d) {
    return [a, b, distance2([a, b], [c, d])];
  };
  var circleDef = {
    circle: {
      args: function args(a, b, c, d) {
        var coords = coordinates.apply(void 0, _toConsumableArray(flatten_arrays(a, b, c, d)));
        switch (coords.length) {
          case 0:
          case 1:
            return [,,].concat(_toConsumableArray(coords));
          case 2:
          case 3:
            return coords;
          default:
            return fromPoints.apply(void 0, _toConsumableArray(coords));
        }
      },
      methods: {
        radius: setRadius,
        setRadius: setRadius,
        origin: setOrigin,
        setOrigin: setOrigin,
        center: setOrigin,
        setCenter: setOrigin,
        position: setOrigin,
        setPosition: setOrigin
      }
    }
  };
  var setRadii = function setRadii(el, rx, ry) {
    [,, rx, ry].forEach(function (value, i) {
      return el.setAttribute(attributes.ellipse[i], value);
    });
    return el;
  };
  var setCenter = function setCenter(el, a, b) {
    _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(flatten_arrays(a, b))).slice(0, 2)).forEach(function (value, i) {
      return el.setAttribute(attributes.ellipse[i], value);
    });
    return el;
  };
  var ellipseDef = {
    ellipse: {
      args: function args(a, b, c, d) {
        var coords = coordinates.apply(void 0, _toConsumableArray(flatten_arrays(a, b, c, d))).slice(0, 4);
        switch (coords.length) {
          case 0:
          case 1:
          case 2:
            return [,,].concat(_toConsumableArray(coords));
          default:
            return coords;
        }
      },
      methods: {
        radius: setRadii,
        setRadius: setRadii,
        origin: setCenter,
        setOrigin: setCenter,
        center: setCenter,
        setCenter: setCenter,
        position: setCenter,
        setPosition: setCenter
      }
    }
  };
  var Args$1 = function Args$1() {
    return coordinates.apply(void 0, _toConsumableArray(semi_flatten_arrays.apply(void 0, arguments))).slice(0, 4);
  };
  var setPoints$1 = function setPoints$1(element) {
    for (var _len13 = arguments.length, args = new Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
      args[_key13 - 1] = arguments[_key13];
    }
    Args$1.apply(void 0, args).forEach(function (value, i) {
      return element.setAttribute(attributes.line[i], value);
    });
    return element;
  };
  var lineDef = {
    line: {
      args: Args$1,
      methods: {
        setPoints: setPoints$1
      }
    }
  };
  var markerRegEx = /[MmLlSsQqLlHhVvCcSsQqTtAaZz]/g;
  var digitRegEx = /-?[0-9]*\.?\d+/g;
  var pathCommands = {
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
  Object.keys(pathCommands).forEach(function (key) {
    var s = pathCommands[key];
    pathCommands[key.toUpperCase()] = s.charAt(0).toUpperCase() + s.slice(1);
  });
  var parsePathCommands = function parsePathCommands(str) {
    var results = [];
    var match;
    while ((match = markerRegEx.exec(str)) !== null) {
      results.push(match);
    }
    return results.map(function (match) {
      return {
        command: str[match.index],
        index: match.index
      };
    }).reduceRight(function (all, cur) {
      var chunk = str.substring(cur.index, all.length ? all[all.length - 1].index : str.length);
      return all.concat([{
        command: cur.command,
        index: cur.index,
        chunk: chunk.length > 0 ? chunk.substr(1, chunk.length - 1) : chunk
      }]);
    }, []).reverse().map(function (el) {
      var values = el.chunk.match(digitRegEx);
      el.en = pathCommands[el.command];
      el.values = values ? values.map(parseFloat) : [];
      delete el.chunk;
      return el;
    });
  };
  var getD = function getD(el) {
    var attr = el.getAttribute("d");
    return attr == null ? "" : attr;
  };
  var clear = function clear(element) {
    element.removeAttribute("d");
    return element;
  };
  var appendPathCommand = function appendPathCommand(el, command) {
    for (var _len14 = arguments.length, args = new Array(_len14 > 2 ? _len14 - 2 : 0), _key14 = 2; _key14 < _len14; _key14++) {
      args[_key14 - 2] = arguments[_key14];
    }
    el.setAttribute("d", "".concat(getD(el)).concat(command).concat(flatten_arrays.apply(void 0, args).join(" ")));
    return el;
  };
  var getCommands = function getCommands(element) {
    return parsePathCommands(getD(element));
  };
  var methods$2 = {
    addCommand: appendPathCommand,
    appendCommand: appendPathCommand,
    clear: clear,
    getCommands: getCommands,
    get: getCommands,
    getD: function getD(el) {
      return el.getAttribute("d");
    }
  };
  Object.keys(pathCommands).forEach(function (key) {
    methods$2[pathCommands[key]] = function (el) {
      for (var _len15 = arguments.length, args = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
        args[_key15 - 1] = arguments[_key15];
      }
      return appendPathCommand.apply(void 0, [el, key].concat(args));
    };
  });
  var pathDef = {
    path: {
      methods: methods$2
    }
  };
  var setRectSize = function setRectSize(el, rx, ry) {
    [,, rx, ry].forEach(function (value, i) {
      return el.setAttribute(attributes.rect[i], value);
    });
    return el;
  };
  var setRectOrigin = function setRectOrigin(el, a, b) {
    _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(flatten_arrays(a, b))).slice(0, 2)).forEach(function (value, i) {
      return el.setAttribute(attributes.rect[i], value);
    });
    return el;
  };
  var fixNegatives = function fixNegatives(arr) {
    [0, 1].forEach(function (i) {
      if (arr[2 + i] < 0) {
        if (arr[0 + i] === undefined) {
          arr[0 + i] = 0;
        }
        arr[0 + i] += arr[2 + i];
        arr[2 + i] = -arr[2 + i];
      }
    });
    return arr;
  };
  var rectDef = {
    rect: {
      args: function args(a, b, c, d) {
        var coords = coordinates.apply(void 0, _toConsumableArray(flatten_arrays(a, b, c, d))).slice(0, 4);
        switch (coords.length) {
          case 0:
          case 1:
          case 2:
          case 3:
            return fixNegatives([,,].concat(_toConsumableArray(coords)));
          default:
            return fixNegatives(coords);
        }
      },
      methods: {
        origin: setRectOrigin,
        setOrigin: setRectOrigin,
        center: setRectOrigin,
        setCenter: setRectOrigin,
        size: setRectSize,
        setSize: setRectSize
      }
    }
  };
  var styleDef = {
    style: {
      init: function init(el, text) {
        el.textContent = "";
        el.appendChild(cdata(text));
      },
      methods: {
        setTextContent: function setTextContent(el, text) {
          el.textContent = "";
          el.appendChild(cdata(text));
          return el;
        }
      }
    }
  };
  var textDef = {
    text: {
      args: function args(a, b, c) {
        return coordinates.apply(void 0, _toConsumableArray(flatten_arrays(a, b, c))).slice(0, 2);
      },
      init: function init(element, a, b, c, d) {
        var text = [a, b, c, d].filter(function (a) {
          return _typeof(a) === _string;
        }).shift();
        if (text) {
          element.appendChild(Window$1.document.createTextNode(text));
        }
      }
    }
  };
  var makeIDString = function makeIDString() {
    return Array.from(arguments).filter(function (a) {
      return _typeof(a) === _string || a instanceof String;
    }).shift() || UUID();
  };
  var args = function args() {
    return [makeIDString.apply(void 0, arguments)];
  };
  var maskTypes = {
    mask: {
      args: args
    },
    clipPath: {
      args: args
    },
    symbol: {
      args: args
    },
    marker: {
      args: args,
      methods: {
        size: setViewBox,
        setViewBox: setViewBox
      }
    }
  };
  var getPoints = function getPoints(el) {
    var attr = el.getAttribute(_points);
    return attr == null ? "" : attr;
  };
  var polyString = function polyString() {
    var _arguments = arguments;
    return Array.from(Array(Math.floor(arguments.length / 2))).map(function (_, i) {
      return "".concat(_arguments[i * 2 + 0], ",").concat(_arguments[i * 2 + 1]);
    }).join(" ");
  };
  var stringifyArgs = function stringifyArgs() {
    return [polyString.apply(void 0, _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(semi_flatten_arrays.apply(void 0, arguments)))))];
  };
  var setPoints = function setPoints(element) {
    for (var _len16 = arguments.length, args = new Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) {
      args[_key16 - 1] = arguments[_key16];
    }
    element.setAttribute(_points, stringifyArgs.apply(void 0, args)[0]);
    return element;
  };
  var addPoint = function addPoint(element) {
    for (var _len17 = arguments.length, args = new Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
      args[_key17 - 1] = arguments[_key17];
    }
    element.setAttribute(_points, [getPoints(element), stringifyArgs.apply(void 0, args)[0]].filter(function (a) {
      return a !== "";
    }).join(" "));
    return element;
  };
  var Args = function Args() {
    return arguments.length === 1 && _typeof(arguments.length <= 0 ? undefined : arguments[0]) === _string ? [arguments.length <= 0 ? undefined : arguments[0]] : stringifyArgs.apply(void 0, arguments);
  };
  var polyDefs = {
    polyline: {
      args: Args,
      methods: {
        setPoints: setPoints,
        addPoint: addPoint
      }
    },
    polygon: {
      args: Args,
      methods: {
        setPoints: setPoints,
        addPoint: addPoint
      }
    }
  };
  var Spec = Object.assign({}, svgDef, gDef, circleDef, ellipseDef, lineDef, pathDef, rectDef, styleDef, textDef, maskTypes, polyDefs);
  var ManyElements = {
    presentation: ["color", "color-interpolation", "cursor", "direction", "display", "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "image-rendering", "letter-spacing", "opacity", "overflow", "paint-order", "pointer-events", "preserveAspectRatio", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tabindex", "transform-origin", "user-select", "vector-effect", "visibility"],
    animation: ["accumulate", "additive", "attributeName", "begin", "by", "calcMode", "dur", "end", "from", "keyPoints", "keySplines", "keyTimes", "max", "min", "repeatCount", "repeatDur", "restart", "to", "values"],
    effects: ["azimuth", "baseFrequency", "bias", "color-interpolation-filters", "diffuseConstant", "divisor", "edgeMode", "elevation", "exponent", "filter", "filterRes", "filterUnits", "flood-color", "flood-opacity", "in", "in2", "intercept", "k1", "k2", "k3", "k4", "kernelMatrix", "lighting-color", "limitingConeAngle", "mode", "numOctaves", "operator", "order", "pointsAtX", "pointsAtY", "pointsAtZ", "preserveAlpha", "primitiveUnits", "radius", "result", "seed", "specularConstant", "specularExponent", "stdDeviation", "stitchTiles", "surfaceScale", "targetX", "targetY", "type", "xChannelSelector", "yChannelSelector"],
    text: ["dx", "dy", "alignment-baseline", "baseline-shift", "dominant-baseline", "lengthAdjust", "method", "overline-position", "overline-thickness", "rotate", "spacing", "startOffset", "strikethrough-position", "strikethrough-thickness", "text-anchor", "text-decoration", "text-rendering", "textLength", "underline-position", "underline-thickness", "word-spacing", "writing-mode"],
    gradient: ["gradientTransform", "gradientUnits", "spreadMethod"]
  };
  Object.values(NodeNames).reduce(function (a, b) {
    return a.concat(b);
  }, []).filter(function (nodeName) {
    return attributes[nodeName] === undefined;
  }).forEach(function (nodeName) {
    attributes[nodeName] = [];
  });
  [[[_svg, "defs", "g"].concat(NodeNames.v, NodeNames.t), ManyElements.presentation], [["filter"], ManyElements.effects], [NodeNames.cT.concat("text"), ManyElements.text], [NodeNames.cF, ManyElements.effects], [NodeNames.cG, ManyElements.gradient]].forEach(function (pair) {
    return pair[0].forEach(function (key) {
      attributes[key] = attributes[key].concat(pair[1]);
    });
  });
  var getClassList = function getClassList(element) {
    if (element == null) {
      return [];
    }
    var currentClass = element.getAttribute(_class);
    return currentClass == null ? [] : currentClass.split(" ").filter(function (s) {
      return s !== "";
    });
  };
  var classMethods = {
    addClass: function addClass(element, newClass) {
      var classes = getClassList(element).filter(function (c) {
        return c !== newClass;
      });
      classes.push(newClass);
      element.setAttributeNS(null, _class, classes.join(" "));
    },
    removeClass: function removeClass(element, removedClass) {
      var classes = getClassList(element).filter(function (c) {
        return c !== removedClass;
      });
      element.setAttributeNS(null, _class, classes.join(" "));
    },
    setClass: function setClass(element, className) {
      element.setAttributeNS(null, _class, className);
    },
    setId: function setId(element, idName) {
      element.setAttributeNS(null, _id, idName);
    }
  };
  var getAttr = function getAttr(element) {
    var t = element.getAttribute(_transform);
    return t == null || t === "" ? undefined : t;
  };
  var methods$1 = {
    clearTransform: function clearTransform(el) {
      el.removeAttribute(_transform);
      return el;
    }
  };
  ["translate", "rotate", "scale", "matrix"].forEach(function (key) {
    methods$1[key] = function (element) {
      for (var _len18 = arguments.length, args = new Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
        args[_key18 - 1] = arguments[_key18];
      }
      return element.setAttribute(_transform, [getAttr(element), "".concat(key, "(").concat(args.join(" "), ")")].filter(function (a) {
        return a !== undefined;
      }).join(" "));
    };
  });
  var findIdURL = function findIdURL(arg) {
    if (arg == null) {
      return "";
    }
    if (_typeof(arg) === _string) {
      return arg.slice(0, 3) === "url" ? arg : "url(#".concat(arg, ")");
    }
    if (arg.getAttribute != null) {
      var idString = arg.getAttribute(_id);
      return "url(#".concat(idString, ")");
    }
    return "";
  };
  var methods = {};
  ["clip-path", "mask", "symbol", "marker-end", "marker-mid", "marker-start"].forEach(function (attr) {
    methods[Case.toCamel(attr)] = function (element, parent) {
      return element.setAttribute(attr, findIdURL(parent));
    };
  });
  var Nodes = {};
  (_NodeNames$v = NodeNames.v).push.apply(_NodeNames$v, _toConsumableArray(Object.keys(nodes)));
  Object.keys(nodes).forEach(function (node) {
    nodes[node].attributes = nodes[node].attributes === undefined ? _toConsumableArray(ManyElements.presentation) : nodes[node].attributes.concat(ManyElements.presentation);
  });
  Object.assign(Nodes, Spec, nodes);
  Object.keys(NodeNames).forEach(function (key) {
    return NodeNames[key].filter(function (nodeName) {
      return Nodes[nodeName] === undefined;
    }).forEach(function (nodeName) {
      Nodes[nodeName] = {};
    });
  });
  var passthrough = function passthrough() {
    return Array.from(arguments);
  };
  Object.keys(Nodes).forEach(function (key) {
    if (!Nodes[key].nodeName) {
      Nodes[key].nodeName = key;
    }
    if (!Nodes[key].init) {
      Nodes[key].init = passthrough;
    }
    if (!Nodes[key].args) {
      Nodes[key].args = passthrough;
    }
    if (!Nodes[key].methods) {
      Nodes[key].methods = {};
    }
    if (!Nodes[key].attributes) {
      Nodes[key].attributes = attributes[key] || [];
    }
  });
  var assign = function assign(groups, Methods) {
    groups.forEach(function (n) {
      return Object.keys(Methods).forEach(function (method) {
        Nodes[n].methods[method] = function () {
          Methods[method].apply(Methods, arguments);
          return arguments[0];
        };
      });
    });
  };
  assign(flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), classMethods);
  assign(flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), dom);
  assign(flatten_arrays(NodeNames.v, NodeNames.g, NodeNames.s), methods$1);
  assign(flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g), methods);
  var RequiredAttrMap = {
    svg: {
      version: "1.1",
      xmlns: NS
    },
    style: {
      type: "text/css"
    }
  };
  var RequiredAttributes = function RequiredAttributes(element, nodeName) {
    if (RequiredAttrMap[nodeName]) {
      Object.keys(RequiredAttrMap[nodeName]).forEach(function (key) {
        return element.setAttribute(key, RequiredAttrMap[nodeName][key]);
      });
    }
  };
  var bound = {};
  var constructor = function constructor(nodeName) {
    var _Nodes$nodeName, _Nodes$nodeName2;
    for (var _len19 = arguments.length, args = new Array(_len19 > 1 ? _len19 - 1 : 0), _key19 = 1; _key19 < _len19; _key19++) {
      args[_key19 - 1] = arguments[_key19];
    }
    var element = Window$1.document.createElementNS(NS, Nodes[nodeName].nodeName);
    RequiredAttributes(element, nodeName);
    (_Nodes$nodeName = Nodes[nodeName]).init.apply(_Nodes$nodeName, [element].concat(args));
    (_Nodes$nodeName2 = Nodes[nodeName]).args.apply(_Nodes$nodeName2, args).forEach(function (v, i) {
      if (Nodes[nodeName].attributes[i] != null) {
        element.setAttribute(Nodes[nodeName].attributes[i], v);
      }
    });
    Nodes[nodeName].attributes.forEach(function (attribute) {
      Object.defineProperty(element, Case.toCamel(attribute), {
        value: function value() {
          element.setAttribute.apply(element, [attribute].concat(Array.prototype.slice.call(arguments)));
          return element;
        }
      });
    });
    Object.keys(Nodes[nodeName].methods).forEach(function (methodName) {
      return Object.defineProperty(element, methodName, {
        value: function value() {
          var _Nodes$nodeName$metho;
          return (_Nodes$nodeName$metho = Nodes[nodeName].methods[methodName]).call.apply(_Nodes$nodeName$metho, [bound, element].concat(Array.prototype.slice.call(arguments)));
        }
      });
    });
    if (nodesAndChildren[nodeName]) {
      nodesAndChildren[nodeName].forEach(function (childNode) {
        var value = function value() {
          var childElement = constructor.apply(void 0, [childNode].concat(Array.prototype.slice.call(arguments)));
          element.appendChild(childElement);
          return childElement;
        };
        if (Nodes[childNode]["static"]) {
          Object.keys(Nodes[childNode]["static"]).forEach(function (key) {
            value[key] = function () {
              var _Nodes$childNode$stat;
              return (_Nodes$childNode$stat = Nodes[childNode]["static"])[key].apply(_Nodes$childNode$stat, [element].concat(Array.prototype.slice.call(arguments)));
            };
          });
        }
        Object.defineProperty(element, childNode, {
          value: value
        });
      });
    }
    return element;
  };
  bound.Constructor = constructor;
  var elements = {};
  Object.keys(NodeNames).forEach(function (key) {
    return NodeNames[key].forEach(function (nodeName) {
      elements[nodeName] = function () {
        for (var _len20 = arguments.length, args = new Array(_len20), _key20 = 0; _key20 < _len20; _key20++) {
          args[_key20] = arguments[_key20];
        }
        return constructor.apply(void 0, [nodeName].concat(args));
      };
    });
  });
  var link_rabbitear_math = function link_rabbitear_math(svg, ear) {
    ["segment", "circle", "ellipse", "rect", "polygon"].filter(function (key) {
      return ear[key] && ear[key].prototype;
    }).forEach(function (key) {
      ear[key].prototype.svg = function () {
        return svg.path(this.svgPath());
      };
    });
    libraries.math.vector = ear.vector;
  };
  var link_rabbitear_graph = function link_rabbitear_graph(svg, ear) {
    var NODE_NAME = "origami";
    Nodes[NODE_NAME] = {
      nodeName: "svg",
      init: function init(element) {
        var _ear$graph$svg;
        for (var _len21 = arguments.length, args = new Array(_len21 > 1 ? _len21 - 1 : 0), _key21 = 1; _key21 < _len21; _key21++) {
          args[_key21 - 1] = arguments[_key21];
        }
        return (_ear$graph$svg = ear.graph.svg).drawInto.apply(_ear$graph$svg, [element].concat(args));
      },
      args: function args() {
        return [];
      },
      methods: Nodes.svg.methods,
      attributes: Nodes.svg.attributes,
      "static": {}
    };
    Object.keys(ear.graph.svg).forEach(function (key) {
      Nodes[NODE_NAME]["static"][key] = function (element) {
        var _ear$graph$svg2;
        for (var _len22 = arguments.length, args = new Array(_len22 > 1 ? _len22 - 1 : 0), _key22 = 1; _key22 < _len22; _key22++) {
          args[_key22 - 1] = arguments[_key22];
        }
        var child = (_ear$graph$svg2 = ear.graph.svg)[key].apply(_ear$graph$svg2, args);
        element.appendChild(child);
        return child;
      };
    });
    nodesAndChildren[NODE_NAME] = _toConsumableArray(nodesAndChildren.svg);
    nodesAndChildren.svg.push(NODE_NAME);
    nodesAndChildren.g.push(NODE_NAME);
    svg[NODE_NAME] = function () {
      for (var _len23 = arguments.length, args = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
        args[_key23] = arguments[_key23];
      }
      return constructor.apply(void 0, [NODE_NAME].concat(args));
    };
    Object.keys(ear.graph.svg).forEach(function (key) {
      svg[NODE_NAME][key] = ear.graph.svg[key];
    });
  };
  var Linker = function Linker(lib) {
    if (lib.graph && lib.origami) {
      lib.svg = this;
      link_rabbitear_math(this, lib);
      link_rabbitear_graph(this, lib);
    }
  };
  var initialize = function initialize(svg) {
    for (var _len24 = arguments.length, args = new Array(_len24 > 1 ? _len24 - 1 : 0), _key24 = 1; _key24 < _len24; _key24++) {
      args[_key24 - 1] = arguments[_key24];
    }
    args.filter(function (arg) {
      return _typeof(arg) === _function;
    }).forEach(function (func) {
      return func.call(svg, svg);
    });
  };
  SVG_Constructor.init = function () {
    var _arguments2 = arguments;
    var svg = constructor.apply(void 0, [_svg].concat(Array.prototype.slice.call(arguments)));
    if (Window$1.document.readyState === "loading") {
      Window$1.document.addEventListener("DOMContentLoaded", function () {
        return initialize.apply(void 0, [svg].concat(_toConsumableArray(_arguments2)));
      });
    } else {
      initialize.apply(void 0, [svg].concat(Array.prototype.slice.call(arguments)));
    }
    return svg;
  };
  SVG.NS = NS;
  SVG.linker = Linker.bind(SVG);
  Object.assign(SVG, elements);
  SVG.core = Object.assign(Object.create(null), {
    load: Load,
    save: save,
    coordinates: coordinates,
    flatten: flatten_arrays,
    attributes: attributes,
    children: nodesAndChildren,
    cdata: cdata,
    detect: detect
  }, Case, classMethods, dom, algebra, methods$1, viewBox);

  var isBrowser = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== _undefined$1 && _typeof(window.document) !== _undefined$1;
  var isNode = (typeof process === "undefined" ? "undefined" : _typeof(process)) !== _undefined$1 && process.versions != null && process.versions.node != null;
  (typeof self === "undefined" ? "undefined" : _typeof(self)) === _object$1 && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";

  var htmlString = "<!DOCTYPE html><title>.</title>";
  var Window = function () {
    var win = {};
    if (isNode) {
      var _require = require("@xmldom/xmldom"),
          DOMParser = _require.DOMParser,
          XMLSerializer = _require.XMLSerializer;
      win.DOMParser = DOMParser;
      win.XMLSerializer = XMLSerializer;
      win.document = new DOMParser().parseFromString(htmlString, "text/html");
    } else if (isBrowser) {
      win = window;
    }
    return win;
  }();

  var make_faces_geometry = function make_faces_geometry(graph) {
    var THREE = Window.THREE;
    var vertices = graph.vertices_coords.map(function (v) {
      return [v[0], v[1], v[2] || 0];
    }).reduce(fn_cat, []);
    var normals = graph.vertices_coords.map(function (v) {
      return [0, 0, 1];
    }).reduce(fn_cat, []);
    var colors = graph.vertices_coords.map(function (v) {
      return [1, 1, 1];
    }).reduce(fn_cat, []);
    var faces = graph.faces_vertices.map(function (fv) {
      return fv.map(function (v, i, arr) {
        return [arr[0], arr[i + 1], arr[i + 2]];
      }).slice(0, fv.length - 2);
    }).reduce(fn_cat, []).reduce(fn_cat, []);
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(faces);
    return geometry;
  };
  var make_edge_cylinder = function make_edge_cylinder(edge_coords, edge_vector, radius) {
    var end_pad = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    if (math.core.mag_squared(edge_vector) < math.core.EPSILON) {
      return [];
    }
    var normalized = math.core.normalize(edge_vector);
    var perp = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map(function (vec) {
      return math.core.cross3(vec, normalized);
    }).sort(function (a, b) {
      return math.core.magnitude(b) - math.core.magnitude(a);
    }).shift();
    var rotated = [math.core.normalize(perp)];
    for (var i = 1; i < 4; i += 1) {
      rotated.push(math.core.cross3(rotated[i - 1], normalized));
    }
    var dirs = rotated.map(function (v) {
      return math.core.scale(v, radius);
    });
    var nudge = [-end_pad, end_pad].map(function (n) {
      return math.core.scale(normalized, n);
    });
    var coords = end_pad === 0 ? edge_coords : edge_coords.map(function (coord, i) {
      return math.core.add(coord, nudge[i]);
    });
    return coords.map(function (v) {
      return dirs.map(function (dir) {
        return math.core.add(v, dir);
      });
    }).reduce(fn_cat, []);
  };
  var make_edges_geometry = function make_edges_geometry(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        edges_assignment = _ref.edges_assignment,
        edges_coords = _ref.edges_coords,
        edges_vector = _ref.edges_vector;
    var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.002;
    var end_pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var THREE = Window.THREE;
    if (!edges_coords) {
      edges_coords = edges_vertices.map(function (edge) {
        return edge.map(function (v) {
          return vertices_coords[v];
        });
      });
    }
    if (!edges_vector) {
      edges_vector = edges_coords.map(function (edge) {
        return math.core.subtract(edge[1], edge[0]);
      });
    }
    edges_coords = edges_coords.map(function (edge) {
      return edge.map(function (coord) {
        return math.core.resize(3, coord);
      });
    });
    edges_vector = edges_vector.map(function (vec) {
      return math.core.resize(3, vec);
    });
    var colorAssignments = {
      "B": [0.0, 0.0, 0.0],
      "M": [0.0, 0.0, 0.0],
      "F": [0.0, 0.0, 0.0],
      "V": [0.0, 0.0, 0.0]
    };
    var colors = edges_assignment.map(function (e) {
      return [colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e], colorAssignments[e]];
    }).reduce(fn_cat, []).reduce(fn_cat, []).reduce(fn_cat, []);
    var vertices = edges_coords.map(function (coords, i) {
      return make_edge_cylinder(coords, edges_vector[i], scale, end_pad);
    }).reduce(fn_cat, []).reduce(fn_cat, []);
    var normals = edges_vector.map(function (vector) {
      if (math.core.mag_squared(vector) < math.core.EPSILON) {
        throw "degenerate edge";
      }
      var normalized = math.core.normalize(vector);
      math.core.scale(normalized, scale);
      var c0 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0, 0, -1])), scale);
      var c1 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0, 0, 1])), scale);
      return [c0, [-c0[2], c0[1], c0[0]], c1, [-c1[2], c1[1], c1[0]], c0, [-c0[2], c0[1], c0[0]], c1, [-c1[2], c1[1], c1[0]]];
    }).reduce(fn_cat, []).reduce(fn_cat, []);
    var faces = edges_coords.map(function (e, i) {
      return [
      i * 8 + 0, i * 8 + 4, i * 8 + 1, i * 8 + 1, i * 8 + 4, i * 8 + 5, i * 8 + 1, i * 8 + 5, i * 8 + 2, i * 8 + 2, i * 8 + 5, i * 8 + 6, i * 8 + 2, i * 8 + 6, i * 8 + 3, i * 8 + 3, i * 8 + 6, i * 8 + 7, i * 8 + 3, i * 8 + 7, i * 8 + 0, i * 8 + 0, i * 8 + 7, i * 8 + 4,
      i * 8 + 0, i * 8 + 1, i * 8 + 3, i * 8 + 1, i * 8 + 2, i * 8 + 3, i * 8 + 5, i * 8 + 4, i * 8 + 7, i * 8 + 7, i * 8 + 6, i * 8 + 5];
    }).reduce(fn_cat, []);
    var geometry = new THREE.BufferGeometry();
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

  var ear$1 = Object.assign(root, Constructors, {
    math: math.core,
    axiom: axiom,
    diagram: diagram,
    layer: layer,
    vertex: vertex,
    text: text,
    webgl: webgl
  });
  Object.keys(math).filter(function (key) {
    return key !== "core";
  }).forEach(function (key) {
    ear$1[key] = math[key];
  });
  Object.defineProperty(ear$1, "use", {
    enumerable: false,
    value: use.bind(ear$1)
  });
  ear$1.use(FOLDtoSVG);
  ear$1.use(SVG);

  return ear$1;

})));
