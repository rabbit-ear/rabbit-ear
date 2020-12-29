/* Rabbit Ear v0.1.91 (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ear = factory());
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

  var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
  var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
  var isWebWorker = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";

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
      case "junction":
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
    switch (arguments.length) {
      case undefined:
      case 0:
        return Array.from(arguments);
      case 1:
        return is_iterable(arguments[0]) && typeof arguments[0] !== "string" ? flatten_arrays.apply(void 0, _toConsumableArray(arguments[0])) : [arguments[0]];
      default:
        return Array.from(arguments).map(function (a) {
          return is_iterable(a) ? _toConsumableArray(flatten_arrays(a)) : a;
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
    semi_flatten_arrays: semi_flatten_arrays,
    flatten_arrays: flatten_arrays
  });
  var Constructors = Object.create(null);
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
  var R2D = 180 / Math.PI;
  var D2R = Math.PI / 180;
  var TWO_PI = Math.PI * 2;
  var EPSILON = 1e-6;
  var constants = Object.freeze({
    __proto__: null,
    R2D: R2D,
    D2R: D2R,
    TWO_PI: TWO_PI,
    EPSILON: EPSILON
  });
  var fn_square = function fn_square(n) {
    return n * n;
  };
  var fn_add = function fn_add(a, b) {
    return a + (b || 0);
  };
  var fn_not_undefined = function fn_not_undefined(a) {
    return a !== undefined;
  };
  var _magnitude = function magnitude(v) {
    return Math.sqrt(v.map(fn_square).reduce(fn_add, 0));
  };
  var mag_squared = function mag_squared(v) {
    return v.map(fn_square).reduce(fn_add, 0);
  };
  var _normalize = function normalize(v) {
    var m = _magnitude(v);
    return m === 0 ? v : v.map(function (c) {
      return c / m;
    });
  };
  var _scale = function scale(v, s) {
    return v.map(function (n) {
      return n * s;
    });
  };
  var _add = function add(v, u) {
    return v.map(function (n, i) {
      return n + (u[i] || 0);
    });
  };
  var _subtract = function subtract(v, u) {
    return v.map(function (n, i) {
      return n - (u[i] || 0);
    });
  };
  var _dot = function dot(v, u) {
    return v.map(function (_, i) {
      return v[i] * u[i];
    }).reduce(fn_add, 0);
  };
  var _midpoint = function midpoint(v, u) {
    return v.map(function (n, i) {
      return (n + u[i]) / 2;
    });
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
  var cross2 = function cross2(a, b) {
    return a[0] * b[1] - a[1] * b[0];
  };
  var cross3 = function cross3(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
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
    return Math.sqrt(a.map(function (_, i) {
      return Math.pow(a[i] - b[i], 2);
    }).reduce(function (u, v) {
      return u + v;
    }, 0));
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
    return Math.abs(v.reduce(fn_add, 0)) < epsilon;
  };
  var parallel = function parallel(a, b) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return 1 - Math.abs(_dot(_normalize(a), _normalize(b))) < epsilon;
  };
  var alternating_sum = function alternating_sum(numbers) {
    return [0, 1].map(function (even_odd) {
      return numbers.filter(function (_, i) {
        return i % 2 === even_odd;
      }).reduce(fn_add, 0);
    });
  };
  var alternating_deviation = function alternating_deviation(sectors) {
    var halfsum = sectors.reduce(fn_add, 0) / 2;
    return alternating_sum(sectors).map(function (s) {
      return s - halfsum;
    });
  };
  var algebra = Object.freeze({
    __proto__: null,
    magnitude: _magnitude,
    mag_squared: mag_squared,
    normalize: _normalize,
    scale: _scale,
    add: _add,
    subtract: _subtract,
    dot: _dot,
    midpoint: _midpoint,
    average: average,
    lerp: _lerp,
    cross2: cross2,
    cross3: cross3,
    distance2: distance2,
    distance3: distance3,
    distance: distance,
    flip: _flip,
    rotate90: _rotate,
    rotate270: _rotate2,
    degenerate: degenerate,
    parallel: parallel,
    alternating_sum: alternating_sum,
    alternating_deviation: alternating_deviation
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
    var vec = resize(3, _normalize(vector));
    var pos = [0, 1, 2].map(function (i) {
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
    var t = identity3x3.concat(-pos[0], -pos[1], -pos[2]);
    var t_inv = identity3x3.concat(pos[0], pos[1], pos[2]);
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
    if (arguments[0] instanceof Constructors.vector) {
      return arguments[0];
    }
    var list = flatten_arrays(arguments);
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
    return semi_flatten_arrays(arguments).map(function (el) {
      return get_vector(el);
    });
  };
  var get_segment = function get_segment() {
    if (arguments[0] instanceof Constructors.segment) {
      return arguments[0];
    }
    var args = semi_flatten_arrays(arguments);
    if (args.length === 4) {
      return [[args[0], args[1]], [args[2], args[3]]];
    }
    return get_vector_of_vectors(args);
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
    if (arguments[0] instanceof Constructors.rect) {
      return arguments[0];
    }
    var list = flatten_arrays(arguments);
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
    get_matrix_3x4: get_matrix_3x4
  });
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
  var equivalent_vec2 = function equivalent_vec2(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
  };
  var equivalent_numbers = function equivalent_numbers() {
    if (arguments.length === 0) {
      return false;
    }
    if (arguments.length === 1 && arguments[0] !== undefined) {
      return equivalent_numbers.apply(void 0, _toConsumableArray(arguments[0]));
    }
    return array_similarity_test(arguments, fEpsilonEqual);
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
      }).reduce(function (u, v) {
        return u && v;
      }, true);
    }).reduce(function (u, v) {
      return u && v;
    }, true);
  };
  var equivalent = function equivalent() {
    var list = semi_flatten_arrays.apply(void 0, arguments);
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
        return array_similarity_test(list, function (a, b) {
          return JSON.stringify(a) === JSON.stringify(b);
        });
      default:
        return undefined;
    }
  };
  var equal = Object.freeze({
    __proto__: null,
    equivalent_vec2: equivalent_vec2,
    equivalent_numbers: equivalent_numbers,
    equivalent_vectors: equivalent_vectors,
    equivalent: equivalent
  });
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
  var nearest = Object.freeze({
    __proto__: null,
    ray_limiter: ray_limiter,
    segment_limiter: segment_limiter,
    smallest_comparison_search: smallest_comparison_search,
    nearest_point2: nearest_point2,
    nearest_point: nearest_point,
    nearest_point_on_line: nearest_point_on_line,
    nearest_point_on_polygon: nearest_point_on_polygon,
    nearest_point_on_circle: nearest_point_on_circle,
    nearest_point_on_ellipse: nearest_point_on_ellipse
  });
  var include_l = function include_l() {
    return true;
  };
  var include_r = function include_r(t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return t > -e;
  };
  var include_s = function include_s(t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return t > -e && t < 1 + e;
  };
  var exclude_l = function exclude_l() {
    return true;
  };
  var exclude_r = function exclude_r(t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return t > e;
  };
  var exclude_s = function exclude_s(t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return t > e && t < 1 - e;
  };
  var intersect_lines = function intersect_lines(aVector, aOrigin, bVector, bOrigin, compA, compB) {
    var epsilon = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : EPSILON;
    var denominator0 = cross2(aVector, bVector);
    var denominator1 = -denominator0;
    if (Math.abs(cross2(_normalize(aVector), _normalize(bVector))) < epsilon) {
      return undefined;
    }
    var numerator0 = cross2(_subtract(bOrigin, aOrigin), bVector);
    var numerator1 = cross2(_subtract(aOrigin, bOrigin), aVector);
    var t0 = numerator0 / denominator0;
    var t1 = numerator1 / denominator1;
    if (compA(t0, epsilon / _magnitude(aVector)) && compB(t1, epsilon / _magnitude(bVector))) {
      return _add(aOrigin, _scale(aVector, t0));
    }
    return undefined;
  };
  var intersect_line_types = Object.freeze({
    __proto__: null,
    include_l: include_l,
    include_r: include_r,
    include_s: include_s,
    exclude_l: exclude_l,
    exclude_r: exclude_r,
    exclude_s: exclude_s,
    intersect_lines: intersect_lines
  });
  var collinear = function collinear(point, vector, origin, compFunc) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var p2p = _subtract(point, origin);
    var lineMagSq = mag_squared(vector);
    if (Math.sqrt(lineMagSq) < epsilon) {
      return false;
    }
    var lineMag = Math.sqrt(lineMagSq);
    var cross = cross2(p2p, vector.map(function (n) {
      return n / lineMag;
    }));
    var proj = _dot(p2p, vector) / lineMagSq;
    return Math.abs(cross) < epsilon && compFunc(proj, epsilon / lineMag);
  };
  var point_on_line = function point_on_line(point, vector, origin) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return Math.abs(cross2(_subtract(point, origin), _normalize(vector))) < epsilon;
  };
  var point_on_ray_inclusive = function point_on_ray_inclusive(point, vector, origin) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return collinear(point, vector, origin, include_r, epsilon);
  };
  var point_on_ray_exclusive = function point_on_ray_exclusive(point, vector, origin) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return collinear(point, vector, origin, exclude_r, epsilon);
  };
  var point_on_segment_inclusive = function point_on_segment_inclusive(point, pt0, pt1) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return collinear(point, _subtract(pt1, pt0), pt0, include_s, epsilon);
  };
  var point_on_segment_exclusive = function point_on_segment_exclusive(point, pt0, pt1) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return collinear(point, _subtract(pt1, pt0), pt0, exclude_s, epsilon);
  };
  var overlap_point = Object.freeze({
    __proto__: null,
    collinear: collinear,
    point_on_line: point_on_line,
    point_on_ray_inclusive: point_on_ray_inclusive,
    point_on_ray_exclusive: point_on_ray_exclusive,
    point_on_segment_inclusive: point_on_segment_inclusive,
    point_on_segment_exclusive: point_on_segment_exclusive
  });
  var overlap_lines = function overlap_lines(aVector, aOrigin, bVector, bOrigin, compA, compB) {
    var epsilon = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : EPSILON;
    var denominator0 = cross2(aVector, bVector);
    var denominator1 = -denominator0;
    if (Math.abs(denominator0) < epsilon) {
      return collinear(bOrigin, aVector, aOrigin, compA, epsilon) || collinear(bOrigin, _flip(aVector), _add(aOrigin, aVector), compA, epsilon) || collinear(aOrigin, bVector, bOrigin, compB, epsilon) || collinear(aOrigin, _flip(bVector), _add(bOrigin, bVector), compB, epsilon);
    }
    var numerator0 = cross2(_subtract(bOrigin, aOrigin), bVector);
    var numerator1 = cross2(_subtract(aOrigin, bOrigin), aVector);
    var t0 = numerator0 / denominator0;
    var t1 = numerator1 / denominator1;
    return compA(t0, epsilon / _magnitude(aVector)) && compB(t1, epsilon / _magnitude(bVector));
  };
  var overlap_line_line_inclusive = function overlap_line_line_inclusive(aV, aP, bV, bP) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(aV, aP, bV, bP, include_l, include_l, ep);
  };
  var overlap_line_ray_inclusive = function overlap_line_ray_inclusive(aV, aP, bV, bP) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(aV, aP, bV, bP, include_l, include_r, ep);
  };
  var overlap_line_segment_inclusive = function overlap_line_segment_inclusive(aV, aP, b0, b1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(aV, aP, _subtract(b1, b0), b0, include_l, include_s, ep);
  };
  var overlap_ray_ray_inclusive = function overlap_ray_ray_inclusive(aV, aP, bV, bP) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(aV, aP, bV, bP, include_r, include_r, ep);
  };
  var overlap_ray_segment_inclusive = function overlap_ray_segment_inclusive(aV, aP, b0, b1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(aV, aP, _subtract(b1, b0), b0, include_r, include_s, ep);
  };
  var overlap_segment_segment_inclusive = function overlap_segment_segment_inclusive(a0, a1, b0, b1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(_subtract(a1, a0), a0, _subtract(b1, b0), b0, include_s, include_s, ep);
  };
  var overlap_line_line_exclusive = function overlap_line_line_exclusive(aV, aP, bV, bP) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(aV, aP, bV, bP, exclude_l, exclude_l, ep);
  };
  var overlap_line_ray_exclusive = function overlap_line_ray_exclusive(aV, aP, bV, bP) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(aV, aP, bV, bP, exclude_l, exclude_r, ep);
  };
  var overlap_line_segment_exclusive = function overlap_line_segment_exclusive(aV, aP, b0, b1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(aV, aP, _subtract(b1, b0), b0, exclude_l, exclude_s, ep);
  };
  var overlap_ray_ray_exclusive = function overlap_ray_ray_exclusive(aV, aP, bV, bP) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(aV, aP, bV, bP, exclude_r, exclude_r, ep);
  };
  var overlap_ray_segment_exclusive = function overlap_ray_segment_exclusive(aV, aP, b0, b1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(aV, aP, _subtract(b1, b0), b0, exclude_r, exclude_s, ep);
  };
  var overlap_segment_segment_exclusive = function overlap_segment_segment_exclusive(a0, a1, b0, b1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return overlap_lines(_subtract(a1, a0), a0, _subtract(b1, b0), b0, exclude_s, exclude_s, ep);
  };
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
  var point_in_convex_poly_inclusive = function point_in_convex_poly_inclusive(point, poly) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (s) {
      return cross2(_normalize(_subtract(s[1], s[0])), _subtract(point, s[0])) > -epsilon;
    }).map(function (s, _, arr) {
      return s === arr[0];
    }).reduce(function (prev, curr) {
      return prev && curr;
    }, true);
  };
  var point_in_convex_poly_exclusive = function point_in_convex_poly_exclusive(point, poly) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (s) {
      return cross2(_normalize(_subtract(s[1], s[0])), _subtract(point, s[0])) > epsilon;
    }).map(function (s, _, arr) {
      return s === arr[0];
    }).reduce(function (prev, curr) {
      return prev && curr;
    }, true);
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
  var overlap_convex_polygons = function overlap_convex_polygons(poly1, poly2, seg_seg, pt_in_poly, epsilon) {
    var e1 = poly1.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    });
    var e2 = poly2.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    });
    for (var i = 0; i < e1.length; i += 1) {
      for (var j = 0; j < e2.length; j += 1) {
        if (seg_seg(e1[i][0], e1[i][1], e2[j][0], e2[j][1], epsilon)) {
          return true;
        }
      }
    }
    if (pt_in_poly(poly2[0], poly1, epsilon)) {
      return true;
    }
    if (pt_in_poly(poly1[0], poly2, epsilon)) {
      return true;
    }
    return false;
  };
  var overlap_convex_polygons_inclusive = function overlap_convex_polygons_inclusive(poly1, poly2) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return overlap_convex_polygons(poly1, poly2, overlap_segment_segment_inclusive, point_in_convex_poly_inclusive, epsilon);
  };
  var overlap_convex_polygons_exclusive = function overlap_convex_polygons_exclusive(poly1, poly2) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return overlap_convex_polygons(poly1, poly2, overlap_segment_segment_exclusive, point_in_convex_poly_exclusive, epsilon);
  };
  var enclose_convex_polygons_inclusive = function enclose_convex_polygons_inclusive(outer, inner) {
    var outerGoesInside = outer.map(function (p) {
      return point_in_convex_poly_inclusive(p, inner);
    }).reduce(function (a, b) {
      return a || b;
    }, false);
    var innerGoesOutside = inner.map(function (p) {
      return point_in_convex_poly_inclusive(p, inner);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
    return !outerGoesInside && innerGoesOutside;
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
  var quick_equivalent_2 = function quick_equivalent_2(a, b) {
    return Math.abs(a[0] - b[0]) < EPSILON && Math.abs(a[1] - b[1]) < EPSILON;
  };
  var intersect_line_seg_include = function intersect_line_seg_include(vector, origin, pt0, pt1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return intersect_lines(vector, origin, _subtract(pt1, pt0), pt0, include_l, include_s, ep);
  };
  var intersect_line_seg_exclude = function intersect_line_seg_exclude(vector, origin, pt0, pt1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return intersect_lines(vector, origin, _subtract(pt1, pt0), pt0, exclude_l, exclude_s, ep);
  };
  var intersect_ray_seg_include = function intersect_ray_seg_include(vector, origin, pt0, pt1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return intersect_lines(vector, origin, _subtract(pt1, pt0), pt0, include_r, include_s, ep);
  };
  var intersect_ray_seg_exclude = function intersect_ray_seg_exclude(vector, origin, pt0, pt1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return intersect_lines(vector, origin, _subtract(pt1, pt0), pt0, exclude_r, exclude_s, ep);
  };
  var intersect_seg_seg_include = function intersect_seg_seg_include(a0, a1, b0, b1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return intersect_lines(_subtract(a1, a0), a0, _subtract(b1, b0), b0, include_s, include_s, ep);
  };
  var intersect_seg_seg_exclude = function intersect_seg_seg_exclude(a0, a1, b0, b1) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return intersect_lines(_subtract(a1, a0), a0, _subtract(b1, b0), b0, exclude_s, exclude_s, ep);
  };
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
    var radians = Math.atan2(a[1], a[0]) - clockwise_angle2(a, b) / 2;
    return [Math.cos(radians), Math.sin(radians)];
  };
  var counter_clockwise_bisect2 = function counter_clockwise_bisect2(a, b) {
    var radians = Math.atan2(a[1], a[0]) + counter_clockwise_angle2(a, b) / 2;
    return [Math.cos(radians), Math.sin(radians)];
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
  var counter_clockwise_radians_order = function counter_clockwise_radians_order() {
    for (var _len = arguments.length, radians = new Array(_len), _key = 0; _key < _len; _key++) {
      radians[_key] = arguments[_key];
    }
    var counter_clockwise = radians.map(function (_, i) {
      return i;
    }).sort(function (a, b) {
      return radians[a] - radians[b];
    });
    return counter_clockwise.slice(counter_clockwise.indexOf(0), counter_clockwise.length).concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
  };
  var counter_clockwise_vector_order = function counter_clockwise_vector_order() {
    for (var _len2 = arguments.length, vectors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      vectors[_key2] = arguments[_key2];
    }
    return counter_clockwise_radians_order.apply(void 0, _toConsumableArray(vectors.map(function (v) {
      return Math.atan2(v[1], v[0]);
    })));
  };
  var interior_angles = function interior_angles() {
    for (var _len3 = arguments.length, vecs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      vecs[_key3] = arguments[_key3];
    }
    return vecs.map(function (v, i, ar) {
      return counter_clockwise_angle2(v, ar[(i + 1) % ar.length]);
    });
  };
  var kawasaki_solutions_radians = function kawasaki_solutions_radians(radians) {
    return radians.map(function (v, i, arr) {
      return [v, arr[(i + 1) % arr.length]];
    }).map(function (pair) {
      return counter_clockwise_angle_radians.apply(void 0, _toConsumableArray(pair));
    }).map(function (_, i, arr) {
      return arr.slice(i + 1, arr.length).concat(arr.slice(0, i));
    }).map(function (opposite_sectors) {
      return alternating_sum(opposite_sectors).map(function (s) {
        return Math.PI - s;
      });
    }).map(function (kawasakis, i) {
      return radians[i] + kawasakis[0];
    }).map(function (angle, i) {
      return is_counter_clockwise_between(angle, radians[i], radians[(i + 1) % radians.length]) ? angle : undefined;
    });
  };
  var kawasaki_solutions = function kawasaki_solutions(vectors) {
    var vectors_radians = vectors.map(function (v) {
      return Math.atan2(v[1], v[0]);
    });
    return kawasaki_solutions_radians(vectors_radians).map(function (a) {
      return a === undefined ? undefined : [Math.cos(a), Math.sin(a)];
    });
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
    counter_clockwise_radians_order: counter_clockwise_radians_order,
    counter_clockwise_vector_order: counter_clockwise_vector_order,
    interior_angles: interior_angles,
    kawasaki_solutions_radians: kawasaki_solutions_radians,
    kawasaki_solutions: kawasaki_solutions
  });
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
    }).reduce(fn_add, 0);
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
    return get_rect_params.apply(void 0, _toConsumableArray(mins).concat(_toConsumableArray(lengths)));
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
  var split_polygon = function split_polygon() {
    return console.warn("split polygon not done");
  };
  var split_convex_polygon = function split_convex_polygon(poly, lineVector, linePoint) {
    var vertices_intersections = poly.map(function (v, i) {
      var intersection = point_on_line(v, lineVector, linePoint);
      return {
        point: intersection ? v : null,
        at_index: i
      };
    }).filter(function (el) {
      return el.point != null;
    });
    var edges_intersections = poly.map(function (v, i, arr) {
      var intersection = intersect_line_seg_exclude(lineVector, linePoint, v, arr[(i + 1) % arr.length]);
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
  };
  var recurseSkeleton = function recurseSkeleton(points, lines, bisectors) {
    var intersects = points.map(function (origin, i) {
      return {
        vector: bisectors[i],
        origin: origin
      };
    }).map(function (ray, i, arr) {
      return intersect_lines(ray.vector, ray.origin, arr[(i + 1) % arr.length].vector, arr[(i + 1) % arr.length].origin, exclude_r, exclude_r);
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
    return solutions.concat(recurseSkeleton(points, lines, bisectors));
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
    return recurseSkeleton(points, lines, bisectors);
  };
  var geometry = Object.freeze({
    __proto__: null,
    circumcircle: circumcircle,
    signed_area: signed_area,
    centroid: _centroid,
    enclosing_rectangle: enclosing_rectangle,
    make_regular_polygon: make_regular_polygon,
    make_regular_polygon_side_aligned: make_regular_polygon_side_aligned,
    make_regular_polygon_inradius: make_regular_polygon_inradius,
    make_regular_polygon_inradius_side_aligned: make_regular_polygon_inradius_side_aligned,
    make_regular_polygon_side_length: make_regular_polygon_side_length,
    make_regular_polygon_side_length_side_aligned: make_regular_polygon_side_length_side_aligned,
    split_polygon: split_polygon,
    split_convex_polygon: split_convex_polygon,
    convex_hull: convex_hull,
    straight_skeleton: straight_skeleton
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
  var intersect_circle_line = function intersect_circle_line(circleRadius, circleOrigin, vector, origin, func) {
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
    return intersect_circle_line(circle.radius, circle.origin, line.vector, line.origin, line_func, epsilon);
  };
  var circle_ray = function circle_ray(circle, ray) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return intersect_circle_line(circle.radius, circle.origin, ray.vector, ray.origin, ray_func, epsilon);
  };
  var circle_segment = function circle_segment(circle, segment) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return intersect_circle_line(circle.radius, circle.origin, segment.vector, segment.origin, segment_func, epsilon);
  };
  var intersect_circle = Object.freeze({
    __proto__: null,
    circle_circle: circle_circle,
    intersect_circle_line: intersect_circle_line,
    circle_line: circle_line,
    circle_ray: circle_ray,
    circle_segment: circle_segment
  });
  var cuberoot = function cuberoot(x) {
    var y = Math.pow(Math.abs(x), 1 / 3);
    return x < 0 ? -y : y;
  };
  var solveCubic = function solveCubic(a, b, c, d) {
    if (Math.abs(a) < EPSILON) {
      a = b;
      b = c;
      c = d;
      if (Math.abs(a) < EPSILON) {
        a = b;
        b = c;
        if (Math.abs(a) < EPSILON) {
          return [];
        }
        return [-b / a];
      }
      var D = b * b - 4 * a * c;
      if (Math.abs(D) < EPSILON) {
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
    if (Math.abs(p) < EPSILON) {
      roots = [cuberoot(-q)];
    } else if (Math.abs(q) < EPSILON) {
      roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
    } else {
      var _D = q * q / 4 + p * p * p / 27;
      if (Math.abs(_D) < EPSILON) {
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
  var axiom1 = function axiom1(pointA, pointB) {
    return Constructors.line(_normalize(_subtract.apply(void 0, _toConsumableArray(resize_up(pointB, pointA)))), pointA);
  };
  var axiom2 = function axiom2(pointA, pointB) {
    return Constructors.line(_normalize(_rotate2(_subtract.apply(void 0, _toConsumableArray(resize_up(pointB, pointA))))), _midpoint(pointA, pointB));
  };
  var axiom3 = function axiom3(vectorA, originA, vectorB, originB) {
    return bisect_lines2(vectorA, originA, vectorB, originB).map(Constructors.line);
  };
  var axiom4 = function axiom4(vector, point) {
    return Constructors.line(_rotate2(_normalize(vector)), point);
  };
  var axiom5 = function axiom5(vectorA, originA, pointA, pointB) {
    return (intersect_circle_line(distance(pointA, pointB), pointA, vectorA, originA, function () {
      return true;
    }) || []).map(function (sect) {
      return Constructors.line(_normalize(_rotate2(_subtract.apply(void 0, _toConsumableArray(resize_up(sect, pointB))))), _midpoint(pointB, sect));
    });
  };
  var axiom7 = function axiom7(vectorA, originA, vectorB, pointC) {
    var intersect = intersect_lines(vectorA, originA, vectorB, pointC, include_l, include_l);
    return intersect === undefined ? undefined : Constructors.line(_normalize(_rotate2(_subtract.apply(void 0, _toConsumableArray(resize_up(intersect, pointC))))), _midpoint(pointC, intersect));
  };
  var axiom6 = function axiom6(vecA, pointA, vecB, pointB, pointC, pointD) {
    var p1 = pointC[0];
    var q1 = pointC[1];
    if (Math.abs(vecA[0]) > EPSILON) {
      var m1 = vecA[1] / vecA[0];
      var h1 = pointA[1] - m1 * pointA[0];
    } else {
      var k1 = pointA[0];
    }
    var p2 = pointD[0];
    var q2 = pointD[1];
    if (Math.abs(vecB[0]) > EPSILON) {
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
          solutions.push(Constructors.line.fromPoints([0, hF], [1, mF]));
        } else {
          var kG = (u2 + p2) / 2;
          solutions.push(Constructors.line.fromPoints([kG, 0], [0, 1]));
        }
      }
    }
    return solutions;
  };
  var axioms = Object.freeze({
    __proto__: null,
    axiom1: axiom1,
    axiom2: axiom2,
    axiom3: axiom3,
    axiom4: axiom4,
    axiom5: axiom5,
    axiom7: axiom7,
    axiom6: axiom6
  });
  var get_unique_pair = function get_unique_pair(intersections) {
    for (var i = 1; i < intersections.length; i += 1) {
      if (!quick_equivalent_2(intersections[0], intersections[i])) {
        return [intersections[0], intersections[i]];
      }
    }
  };
  var convex_poly_line_intersect = function convex_poly_line_intersect(intersect_func, poly, line1, line2) {
    var ep = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var intersections = poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (el) {
      return intersect_func(line1, line2, el[0], el[1], ep);
    }).filter(function (el) {
      return el != null;
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
  var poly_include_exclude_func = function poly_include_exclude_func(intersect_func, poly, line1, line2, epsilon) {
    var sects = convex_poly_line_intersect(intersect_func, poly, line1, line2, epsilon);
    var altFunc;
    switch (intersect_func) {
      case intersect_line_seg_exclude:
        altFunc = intersect_line_seg_include;
        break;
      case intersect_ray_seg_exclude:
        altFunc = intersect_ray_seg_include;
        break;
      case intersect_seg_seg_exclude:
        altFunc = intersect_seg_seg_include;
        break;
      case intersect_line_seg_include:
      case intersect_ray_seg_include:
      case intersect_seg_seg_include:
      default:
        return sects;
    }
    var includes = convex_poly_line_intersect(altFunc, poly, line1, line2, epsilon);
    if (includes === undefined) {
      return undefined;
    }
    var uniqueIncludes = get_unique_pair(includes);
    if (uniqueIncludes === undefined) {
      switch (intersect_func) {
        case intersect_line_seg_exclude:
          return undefined;
        case intersect_ray_seg_exclude:
          return point_in_convex_poly_exclusive(line2, poly, epsilon) ? includes : undefined;
        case intersect_seg_seg_exclude:
          return point_in_convex_poly_exclusive(line1, poly, epsilon) || point_in_convex_poly_exclusive(line2, poly, epsilon) ? includes : undefined;
      }
    }
    return point_in_convex_poly_exclusive(_midpoint.apply(void 0, _toConsumableArray(uniqueIncludes)), poly, epsilon) ? uniqueIncludes : sects;
  };
  var convex_poly_line_inclusive = function convex_poly_line_inclusive(poly, vec, org) {
    var ep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return poly_include_exclude_func(intersect_line_seg_include, poly, vec, org, ep);
  };
  var convex_poly_line_exclusive = function convex_poly_line_exclusive(poly, vec, org) {
    var ep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return poly_include_exclude_func(intersect_line_seg_exclude, poly, vec, org, ep);
  };
  var convex_poly_ray_inclusive = function convex_poly_ray_inclusive(poly, vec, org) {
    var ep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return poly_include_exclude_func(intersect_ray_seg_include, poly, vec, org, ep);
  };
  var convex_poly_ray_exclusive = function convex_poly_ray_exclusive(poly, vec, org) {
    var ep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return poly_include_exclude_func(intersect_ray_seg_exclude, poly, vec, org, ep);
  };
  var convex_poly_segment_inclusive = function convex_poly_segment_inclusive(poly, pt0, pt1) {
    var ep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return poly_include_exclude_func(intersect_seg_seg_include, poly, pt0, pt1, ep);
  };
  var convex_poly_segment_exclusive = function convex_poly_segment_exclusive(poly, pt0, pt1) {
    var ep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return poly_include_exclude_func(intersect_seg_seg_exclude, poly, pt0, pt1, ep);
  };
  var intersect_polygon = Object.freeze({
    __proto__: null,
    convex_poly_line_inclusive: convex_poly_line_inclusive,
    convex_poly_line_exclusive: convex_poly_line_exclusive,
    convex_poly_ray_inclusive: convex_poly_ray_inclusive,
    convex_poly_ray_exclusive: convex_poly_ray_exclusive,
    convex_poly_segment_inclusive: convex_poly_segment_inclusive,
    convex_poly_segment_exclusive: convex_poly_segment_exclusive
  });
  var convexPolyLine = function convexPolyLine(a, b) {
    return convex_poly_line_exclusive(a, b.vector, b.origin);
  };
  var convexPolyRay = function convexPolyRay(a, b) {
    return convex_poly_ray_exclusive(a, b.vector, b.origin);
  };
  var convexPolySegment = function convexPolySegment(a, b) {
    return convex_poly_segment_exclusive(a, b[0], b[1]);
  };
  var lineFunc = function lineFunc(a, b, compA, compB, epsilon) {
    return intersect_lines(a.vector, a.origin, b.vector, b.origin, compA, compB, epsilon);
  };
  var intersect_func = {
    polygon: {
      line: convexPolyLine,
      ray: convexPolyRay,
      segment: convexPolySegment
    },
    circle: {
      circle: circle_circle,
      line: circle_line,
      ray: circle_ray,
      segment: circle_segment
    },
    line: {
      polygon: function polygon(a, b) {
        return convexPolyLine(b, a);
      },
      circle: function circle(a, b) {
        return circle_line(b, a);
      },
      line: function line(a, b, ep) {
        return lineFunc(a, b, exclude_l, exclude_l, ep);
      },
      ray: function ray(a, b, ep) {
        return lineFunc(a, b, exclude_l, exclude_r, ep);
      },
      segment: function segment(a, b, ep) {
        return lineFunc(a, b, exclude_l, exclude_s, ep);
      }
    },
    ray: {
      polygon: function polygon(a, b) {
        return convexPolyRay(b, a);
      },
      circle: function circle(a, b) {
        return circle_ray(b, a);
      },
      line: function line(a, b, ep) {
        return lineFunc(b, a, exclude_l, exclude_r, ep);
      },
      ray: function ray(a, b, ep) {
        return lineFunc(a, b, exclude_r, exclude_r, ep);
      },
      segment: function segment(a, b, ep) {
        return lineFunc(a, b, exclude_r, exclude_s, ep);
      }
    },
    segment: {
      polygon: function polygon(a, b) {
        return convexPolySegment(b, a);
      },
      circle: function circle(a, b) {
        return circle_segment(b, a);
      },
      line: function line(a, b, ep) {
        return lineFunc(b, a, exclude_l, exclude_s, ep);
      },
      ray: function ray(a, b, ep) {
        return lineFunc(b, a, exclude_r, exclude_s, ep);
      },
      segment: function segment(a, b, ep) {
        return lineFunc(a, b, exclude_s, exclude_s, ep);
      }
    }
  };
  var intersect_types = {
    polygon: "polygon",
    rect: "polygon",
    circle: "circle",
    line: "line",
    ray: "ray",
    segment: "segment"
  };
  var _intersect = function intersect(a, b) {
    var _intersect_func$aT;
    var aT = intersect_types[type_of(a)];
    var bT = intersect_types[type_of(b)];
    return (_intersect_func$aT = intersect_func[aT])[bT].apply(_intersect_func$aT, arguments);
  };
  var overlap = Object.assign(Object.create(null), overlap_lines$1, overlap_point, overlap_polygon);
  var get_unique_pair$1 = function get_unique_pair$1(intersections) {
    for (var i = 1; i < intersections.length; i += 1) {
      if (!quick_equivalent_2(intersections[0], intersections[i])) {
        return [intersections[0], intersections[i]];
      }
    }
  };
  var get_unique_points = function get_unique_points(points) {
    var unique = [];
    for (var i = 0; i < points.length; i += 1) {
      var match = false;
      for (var j = 0; j < unique.length; j += 1) {
        if (quick_equivalent_2(points[i], unique[j])) {
          match = true;
        }
      }
      if (!match) {
        unique.push(points[i]);
      }
    }
    return unique;
  };
  var sortPointsAlongVector = function sortPointsAlongVector(points, vector) {
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
  var collinear_check = function collinear_check(poly, vector, origin) {
    var polyvecs = poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (seg) {
      return _subtract.apply(void 0, _toConsumableArray(seg));
    });
    return polyvecs.map(function (vec, i) {
      return parallel(vec, vector) ? i : undefined;
    }).filter(fn_not_undefined).map(function (i) {
      return point_on_line(origin, polyvecs[i], poly[i]);
    }).reduce(function (a, b) {
      return a || b;
    }, false);
  };
  var clip_intersections = function clip_intersections(intersect_func, poly, line1, line2) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    }).map(function (el) {
      return intersect_func(line1, line2, el[0], el[1], epsilon);
    }).filter(fn_not_undefined);
  };
  var clip_line_in_convex_poly_inclusive = function clip_line_in_convex_poly_inclusive(poly, vector, origin) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    var intersections = clip_intersections(intersect_line_seg_include, poly, vector, origin, epsilon);
    switch (intersections.length) {
      case 0:
      case 1:
        return undefined;
      default:
        return get_unique_pair$1(intersections);
    }
  };
  var clip_line_in_convex_poly_exclusive = function clip_line_in_convex_poly_exclusive(poly, vector, origin) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    var pEx = clip_intersections(intersect_line_seg_exclude, poly, vector, origin, epsilon);
    var pIn = clip_intersections(intersect_line_seg_include, poly, vector, origin, epsilon);
    if (pIn === undefined) {
      return undefined;
    }
    var uniqueIn = get_unique_pair$1(pIn);
    if (uniqueIn === undefined) {
      return undefined;
    }
    return point_in_convex_poly_exclusive(_midpoint.apply(void 0, _toConsumableArray(uniqueIn)), poly, epsilon) ? uniqueIn : undefined;
  };
  var clip_ray_in_convex_poly_inclusive = function clip_ray_in_convex_poly_inclusive(poly, vector, origin) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    var intersections = clip_intersections(intersect_ray_seg_include, poly, vector, origin, epsilon);
    if (intersections.length === 0) {
      return undefined;
    }
    var origin_inside = point_in_convex_poly_inclusive(origin, poly);
    return get_unique_pair$1(intersections) || [origin, intersections[0]];
  };
  var clip_ray_in_convex_poly_exclusive = function clip_ray_in_convex_poly_exclusive(poly, vector, origin) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    var pEx = clip_intersections(intersect_ray_seg_exclude, poly, vector, origin, epsilon);
    var pIn = clip_intersections(intersect_ray_seg_include, poly, vector, origin, epsilon);
    if (pIn === undefined) {
      return undefined;
    }
    var uniqueIn = get_unique_pair$1(pIn);
    if (uniqueIn === undefined) {
      return point_in_convex_poly_exclusive(origin, poly, epsilon) ? [origin, pIn[0]] : undefined;
    }
    return point_in_convex_poly_exclusive(_midpoint.apply(void 0, _toConsumableArray(uniqueIn)), poly, epsilon) ? uniqueIn : undefined;
  };
  var clip_segment_func = function clip_segment_func(poly, seg0, seg1) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    var seg = [seg0, seg1];
    var inclusive_inside = seg.map(function (s) {
      return point_in_convex_poly_inclusive(s, poly, epsilon);
    });
    if (inclusive_inside[0] === true && inclusive_inside[1] === true) {
      return [_toConsumableArray(seg0), _toConsumableArray(seg1)];
    }
    var clip_inclusive = clip_intersections(intersect_seg_seg_include, poly, seg0, seg1, epsilon);
    var clip_inclusive_unique = get_unique_points(clip_inclusive);
    if (clip_inclusive_unique.length === 2) {
      return clip_inclusive_unique;
    } else if (clip_inclusive_unique.length > 2) {
      var sorted = sortPointsAlongVector(clip_inclusive_unique, _subtract(seg1, seg0));
      return [sorted[0], sorted[sorted.length - 1]];
    }
    if (clip_inclusive.length > 0) {
      var exclusive_inside = seg.map(function (s) {
        return point_in_convex_poly_exclusive(s, poly, epsilon);
      });
      if (exclusive_inside[0] === true) {
        return [_toConsumableArray(seg0), clip_inclusive[0]];
      }
      if (exclusive_inside[1] === true) {
        return [_toConsumableArray(seg1), clip_inclusive[0]];
      }
    }
  };
  var clip_segment_in_convex_poly_inclusive = function clip_segment_in_convex_poly_inclusive(poly, seg0, seg1) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    return clip_segment_func(poly, seg0, seg1, epsilon);
  };
  var clip_segment_in_convex_poly_exclusive = function clip_segment_in_convex_poly_exclusive(poly, seg0, seg1) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : EPSILON;
    var segVec = _subtract(seg1, seg0);
    if (collinear_check(poly, segVec, seg0)) {
      return undefined;
    }
    return clip_segment_func(poly, seg0, seg1, epsilon);
  };
  var clip_polygon = Object.freeze({
    __proto__: null,
    clip_line_in_convex_poly_inclusive: clip_line_in_convex_poly_inclusive,
    clip_line_in_convex_poly_exclusive: clip_line_in_convex_poly_exclusive,
    clip_ray_in_convex_poly_inclusive: clip_ray_in_convex_poly_inclusive,
    clip_ray_in_convex_poly_exclusive: clip_ray_in_convex_poly_exclusive,
    clip_segment_in_convex_poly_inclusive: clip_segment_in_convex_poly_inclusive,
    clip_segment_in_convex_poly_exclusive: clip_segment_in_convex_poly_exclusive
  });
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
      magnitude: function magnitude() {
        return _magnitude(this);
      },
      isEquivalent: function isEquivalent() {
        return equivalent_vectors(this, get_vector(arguments));
      },
      isParallel: function isParallel() {
        return parallel.apply(void 0, _toConsumableArray(resize_up(this, get_vector(arguments))));
      },
      dot: function dot() {
        return _dot.apply(void 0, _toConsumableArray(resize_up(this, get_vector(arguments))));
      },
      distanceTo: function distanceTo() {
        return distance.apply(void 0, _toConsumableArray(resize_up(this, get_vector(arguments))));
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
  var LineProto = {};
  LineProto.prototype = Object.create(Object.prototype);
  LineProto.prototype.constructor = LineProto;
  LineProto.prototype.isParallel = function () {
    var arr = resize_up(this.vector, get_line.apply(void 0, arguments).vector);
    return parallel.apply(void 0, _toConsumableArray(arr));
  };
  LineProto.prototype.isDegenerate = function () {
    var epsilon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : EPSILON;
    return degenerate(this.vector, epsilon);
  };
  LineProto.prototype.reflectionMatrix = function () {
    return Constructors.matrix(make_matrix3_reflectZ(this.vector, this.origin));
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
    return _intersect(this, other);
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
        vector: _subtract(points[1], points[0]),
        origin: points[0]
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
        svgPath: function svgPath() {
          var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 20000;
          var start = this.origin.add(this.vector.scale(-length / 2));
          var end = this.vector.scale(length);
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
        flip: function flip() {
          return Constructors.ray(_flip(this.vector), this.origin);
        },
        scale: function scale(_scale2) {
          return Constructors.ray(this.vector.scale(_scale2), this.origin);
        },
        normalize: function normalize() {
          return Constructors.ray(this.vector.normalize(), this.origin);
        },
        clip_function: ray_limiter,
        svgPath: function svgPath() {
          var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10000;
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
        var args = get_segment.apply(void 0, arguments);
        this.points = [Constructors.vector(args[0]), Constructors.vector(args[1])];
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
        clip_function: segment_limiter,
        transform: function transform() {
          var dim = this.points[0].length;
          for (var _len4 = arguments.length, innerArgs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            innerArgs[_key4] = arguments[_key4];
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
        midpoint: function midpoint() {
          return Constructors.vector(average(this.points[0], this.points[1]));
        },
        svgPath: function svgPath() {
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
    var numbers = flatten_arrays(arguments).filter(function (a) {
      return typeof a === "number";
    });
    if (arguments.length === 2) {
      if (vectors[1].length === 1) {
        this.radius = vectors[1][0];
        this.origin = Constructors.vector.apply(Constructors, _toConsumableArray(vectors[0]));
      } else if (vectors[0].length === 1) {
        this.radius = vectors[0][0];
        this.origin = Constructors.vector.apply(Constructors, _toConsumableArray(vectors[1]));
      } else if (vectors[0].length > 1 && vectors[1].length > 1) {
        this.radius = distance2.apply(void 0, _toConsumableArray(vectors));
        this.origin = Constructors.vector.apply(Constructors, _toConsumableArray(vectors[0]));
      }
    } else {
      switch (numbers.length) {
        case 0:
          this.radius = 1;
          this.origin = Constructors.vector(0, 0, 0);
          break;
        case 1:
          this.radius = numbers[0];
          this.origin = Constructors.vector(0, 0, 0);
          break;
        default:
          this.radius = numbers.pop();
          this.origin = Constructors.vector.apply(Constructors, _toConsumableArray(numbers));
          break;
      }
    }
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
      return Constructors.vector(nearest_point_on_circle(this.radius, this.origin, get_vector(arguments)));
    },
    intersect: function intersect(object) {
      return _intersect(this, object);
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
      return Constructors.polygon(this.points(arguments[0]));
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
          return Constructors.polygon(this.points(arguments[0]));
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
  var makeClip = function makeClip(e) {
    return e === undefined ? undefined : Constructors.segment(e);
  };
  var methods = {
    area: function area() {
      return signed_area(this);
    },
    centroid: function centroid() {
      return Constructors.vector(_centroid(this));
    },
    enclosingRectangle: function enclosingRectangle() {
      return Constructors.rect(enclosing_rectangle(this));
    },
    contains: function contains() {
      return point_in_poly(get_vector(arguments), this);
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
      return Constructors.polygon(newPoints);
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
      return Constructors.polygon(newPoints);
    },
    nearest: function nearest() {
      var point = get_vector.apply(void 0, arguments);
      var result = nearest_point_on_polygon(this, point);
      return result === undefined ? undefined : Object.assign(result, {
        edge: this.sides[result.i]
      });
    },
    overlaps: function overlaps() {
      var poly2Points = semi_flatten_arrays(arguments);
      return overlap_convex_polygons_exclusive(this, poly2Points);
    },
    split: function split() {
      var line = get_line.apply(void 0, arguments);
      var split_func = this.isConvex ? split_convex_polygon : split_polygon;
      return split_func(this, line.vector, line.origin).map(function (poly) {
        return Constructors.polygon(poly);
      });
    },
    intersectLine: function intersectLine() {
      var line = get_line.apply(void 0, arguments);
      return convex_poly_line_exclusive(this, line.vector, line.origin);
    },
    intersectRay: function intersectRay() {
      var line = get_line.apply(void 0, arguments);
      return convex_poly_ray_exclusive(this, line.vector, line.origin);
    },
    intersectSegment: function intersectSegment() {
      var seg = get_segment.apply(void 0, arguments);
      return convex_poly_segment_exclusive(this, seg[0], seg[1]);
    },
    clipLine: function clipLine() {
      var line = get_line.apply(void 0, arguments);
      var clip = clip_line_in_convex_poly_exclusive(this, line.vector, line.origin);
      return makeClip(clip);
    },
    clipRay: function clipRay() {
      var ray = get_line.apply(void 0, arguments);
      var clip = clip_ray_in_convex_poly_exclusive(this, ray.vector, ray.origin);
      return makeClip(clip);
    },
    clipSegment: function clipSegment() {
      var seg = get_segment.apply(void 0, arguments);
      var clip = clip_segment_in_convex_poly_exclusive(this, seg[0], seg[1]);
      return makeClip(clip);
    },
    svgPath: function svgPath() {
      var pre = Array(this.length).fill("L");
      pre[0] = "M";
      return "".concat(this.map(function (p, i) {
        return "".concat(pre[i]).concat(p[0], " ").concat(p[1]);
      }).join(""), "z");
    },
    intersect: function intersect(other) {
      return _intersect(this, other);
    }
  };
  var PolygonProto = {};
  PolygonProto.prototype = Object.create(Array.prototype);
  PolygonProto.prototype.constructor = PolygonProto;
  Object.keys(methods).forEach(function (key) {
    PolygonProto.prototype[key] = methods[key];
  });
  var rectToPoints = function rectToPoints(r) {
    return [[r.x, r.y], [r.x + r.width, r.y], [r.x + r.width, r.y + r.height], [r.x, r.y + r.height]];
  };
  var rectToSides = function rectToSides(r) {
    return [[[r.x, r.y], [r.x + r.width, r.y]], [[r.x + r.width, r.y], [r.x + r.width, r.y + r.height]], [[r.x + r.width, r.y + r.height], [r.x, r.y + r.height]], [[r.x, r.y + r.height], [r.x, r.y]]];
  };
  var Rect = {
    rect: {
      P: PolygonProto.prototype,
      A: function A() {
        var r = get_rect.apply(void 0, arguments);
        this.width = r.width;
        this.height = r.height;
        this.origin = Constructors.vector(r.x, r.y);
        this.push.apply(this, _toConsumableArray(rectToPoints(this)));
      },
      G: {
        x: function x() {
          return this.origin[0];
        },
        y: function y() {
          return this.origin[1];
        },
        center: function center() {
          return Constructors.vector(this.origin[0] + this.width / 2, this.origin[1] + this.height / 2);
        }
      },
      M: {
        area: function area() {
          return this.width * this.height;
        },
        segments: function segments() {
          return rectToSides(this);
        },
        svgPath: function svgPath() {
          return "M".concat(this.origin.join(" "), "h").concat(this.width, "v").concat(this.height, "h").concat(-this.width, "Z");
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
        this.push.apply(this, _toConsumableArray(semi_flatten_arrays(arguments)));
        this.sides = this.map(function (p, i, arr) {
          return [p, arr[(i + 1) % arr.length]];
        });
        this.vectors = this.sides.map(function (side) {
          return _subtract(side[1], side[0]);
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
      M: {
        segments: function segments() {
          return this.sides;
        }
      },
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
  var assign = function assign(thisMat, mat) {
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
          return Constructors.matrix.apply(Constructors, _toConsumableArray(Array.from(this)));
        },
        set: function set() {
          return assign(this, get_matrix_3x4(arguments));
        },
        isIdentity: function isIdentity() {
          return is_identity3x4(this);
        },
        multiply: function multiply(mat) {
          return assign(this, multiply_matrices3(this, mat));
        },
        determinant: function determinant() {
          return determinant3(this);
        },
        inverse: function inverse() {
          return assign(this, invert_matrix3(this));
        },
        translate: function translate(x, y, z) {
          return assign(this, multiply_matrices3(this, make_matrix3_translate(x, y, z)));
        },
        rotateX: function rotateX(radians) {
          return assign(this, multiply_matrices3(this, make_matrix3_rotateX(radians)));
        },
        rotateY: function rotateY(radians) {
          return assign(this, multiply_matrices3(this, make_matrix3_rotateY(radians)));
        },
        rotateZ: function rotateZ(radians) {
          return assign(this, multiply_matrices3(this, make_matrix3_rotateZ(radians)));
        },
        rotate: function rotate(radians, vector, origin) {
          var transform = make_matrix3_rotate(radians, vector, origin);
          return assign(this, multiply_matrices3(this, transform));
        },
        scale: function scale(amount) {
          return assign(this, multiply_matrices3(this, make_matrix3_scale(amount)));
        },
        reflectZ: function reflectZ(vector, origin) {
          var transform = make_matrix3_reflectZ(vector, origin);
          return assign(this, multiply_matrices3(this, transform));
        },
        transform: function transform() {
          for (var _len5 = arguments.length, innerArgs = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            innerArgs[_key5] = arguments[_key5];
          }
          return Constructors.vector(multiply_matrix3_vector3(this, resize(3, get_vector(innerArgs))));
        },
        transformVector: function transformVector(vector) {
          return Constructors.vector(multiply_matrix3_vector3(this, resize(3, get_vector(vector))));
        },
        transformLine: function transformLine() {
          for (var _len6 = arguments.length, innerArgs = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            innerArgs[_key6] = arguments[_key6];
          }
          var l = get_line(innerArgs);
          return Constructors.line(multiply_matrix3_line3(this, l.vector, l.origin));
        }
      },
      S: {}
    }
  };
  var invert_order_array = function invert_order_array(arr) {
    var new_arr = [];
    arr.forEach(function (n, i) {
      return new_arr[n] = i;
    });
    return new_arr;
  };
  var Junction = {
    junction: {
      A: function A() {
        var vectors = get_vector_of_vectors(arguments).map(function (v) {
          return Constructors.vector(v);
        });
        var radians = vectors.map(function (v) {
          return Math.atan2(v[1], v[0]);
        });
        var order = counter_clockwise_radians_order.apply(void 0, _toConsumableArray(radians));
        this.vectors = order.map(function (i) {
          return vectors[i];
        });
        this.radians = order.map(function (i) {
          return radians[i];
        });
        this.order = invert_order_array(order);
      },
      G: {
        sectors: function sectors() {
          return this.radians.map(function (n, i, arr) {
            return [n, arr[(i + 1) % arr.length]];
          }).map(function (pair) {
            return counter_clockwise_angle_radians(pair[0], pair[1]);
          });
        }
      },
      M: {
        alternatingAngleSum: function alternatingAngleSum() {
          return alternating_sum(this.sectors);
        }
      },
      S: {
        fromRadians: function fromRadians() {
          var radians = get_vector(arguments);
          return this.constructor(radians.map(function (r) {
            return [Math.cos(r), Math.sin(r)];
          }));
        }
      }
    }
  };
  var Definitions = Object.assign({}, Vector, Line, Ray, Segment, Circle, Ellipse, Rect, Polygon, Matrix, Junction);
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
  var line$1 = function line() {
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
  var junction = function junction() {
    return create("junction", arguments);
  };
  Object.assign(Constructors, {
    vector: vector,
    circle: circle,
    ellipse: ellipse,
    rect: rect,
    polygon: polygon,
    line: line$1,
    ray: ray,
    segment: segment,
    matrix: matrix,
    junction: junction
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
    Definitions[primitiveName].proto = Proto.prototype;
  });
  var math = Constructors;
  math.core = Object.assign(Object.create(null), constants, algebra, equal, geometry, radial, matrix2, matrix3, nearest, axioms, overlap, getters, resizers, intersect_circle, intersect_line_types, intersect_polygon, clip_polygon, {
    intersect_line_seg_include: intersect_line_seg_include,
    intersect_line_seg_exclude: intersect_line_seg_exclude,
    intersect_ray_seg_include: intersect_ray_seg_include,
    intersect_ray_seg_exclude: intersect_ray_seg_exclude,
    intersect_seg_seg_include: intersect_seg_seg_include,
    intersect_seg_seg_exclude: intersect_seg_seg_exclude
  });
  math["typeof"] = type_of;
  math.intersect = _intersect;

  var root = Object.create(null);

  var use = function use(library) {
    if (library == null || typeof library.linker !== "function") {
      return;
    }
    library.linker(this);
  };

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
  var VERTICES = "vertices";
  var EDGES = "edges";
  var FACES = "faces";
  var VERTICES_COORDS = "vertices_coords";
  var EDGES_ASSIGNMENT = "edges_assignment";
  var EDGES_FOLDANGLE = "edges_foldAngle";
  var singularize = {
    vertices: "vertex",
    edges: "edge",
    faces: "face"
  };

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
  var edges_assignment_names = {
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
  var fold_object_certainty = function fold_object_certainty(object) {
    if (_typeof(object) !== "object" || object === null) {
      return 0;
    }
    return keys.filter(function (key) {
      return object[key];
    }).length;
  };

  var fold_object = /*#__PURE__*/Object.freeze({
    __proto__: null,
    edges_assignment_degrees: edges_assignment_degrees,
    edges_assignment_names: edges_assignment_names,
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

  var max_num_in_array_in_arrays = function max_num_in_array_in_arrays(arrays) {
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
  var implied_count = function implied_count(graph, key, ordersKey) {
    return Math.max(
    max_num_in_array_in_arrays(get_graph_keys_with_suffix(graph, key).map(function (str) {
      return graph[str];
    })),
    graph[ordersKey] ? max_num_in_orders(graph[ordersKey]) : -1) + 1;
  };
  implied_count.vertices = function (graph) {
    return implied_count(graph, "vertices");
  };
  implied_count.edges = function (graph) {
    return implied_count(graph, "edges", "edgeOrders");
  };
  implied_count.faces = function (graph) {
    return implied_count(graph, "faces", "faceOrders");
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

  var make_vertices_edges = function make_vertices_edges(_ref) {
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
      vertices_edges = make_vertices_edges({
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
  var make_vertices_faces = function make_vertices_faces(_ref4) {
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
  var make_vertices_faces_sorted = function make_vertices_faces_sorted(_ref5) {
    var vertices_vertices = _ref5.vertices_vertices,
        faces_vertices = _ref5.faces_vertices;
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
      }).filter(function (a) {
        return a !== undefined;
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
      var _math$core;
      return vectors.length === 1
      ? [math.core.TWO_PI]
      : (_math$core = math.core).interior_angles.apply(_math$core, _toConsumableArray(vectors));
    });
  };
  var make_vertices_coords_folded = function make_vertices_coords_folded(_ref11, root_face) {
    var vertices_coords = _ref11.vertices_coords,
        vertices_faces = _ref11.vertices_faces,
        edges_vertices = _ref11.edges_vertices,
        edges_foldAngle = _ref11.edges_foldAngle,
        edges_assignment = _ref11.edges_assignment,
        faces_vertices = _ref11.faces_vertices,
        faces_faces = _ref11.faces_faces,
        faces_matrix = _ref11.faces_matrix;
    if (!faces_matrix || root_face !== undefined) {
      faces_matrix = make_faces_matrix({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices,
        edges_foldAngle: edges_foldAngle,
        edges_assignment: edges_assignment,
        faces_vertices: faces_vertices,
        faces_faces: faces_faces
      }, root_face);
    }
    if (!vertices_faces) {
      vertices_faces = make_vertices_faces({
        faces_vertices: faces_vertices
      });
    }
    var vertices_matrix = vertices_faces.map(function (faces) {
      return faces[0];
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
  var make_edges_edges = function make_edges_edges(_ref12) {
    var edges_vertices = _ref12.edges_vertices,
        vertices_edges = _ref12.vertices_edges;
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
  var make_edges_faces = function make_edges_faces(_ref13) {
    var faces_edges = _ref13.faces_edges;
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
  var make_edges_vector = function make_edges_vector(_ref16) {
    var vertices_coords = _ref16.vertices_coords,
        edges_vertices = _ref16.edges_vertices;
    return edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    }).map(function (verts) {
      return math.core.subtract(verts[1], verts[0]);
    });
  };
  var make_edges_length = function make_edges_length(_ref17) {
    var vertices_coords = _ref17.vertices_coords,
        edges_vertices = _ref17.edges_vertices;
    return make_edges_vector({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices
    }).map(function (vec) {
      return math.core.magnitude(vec);
    });
  };
  var make_edges_coords_min_max = function make_edges_coords_min_max(_ref18) {
    var vertices_coords = _ref18.vertices_coords,
        edges_vertices = _ref18.edges_vertices,
        edges_coords = _ref18.edges_coords;
    if (!edges_coords) {
      edges_coords = edges_vertices.map(function (ev) {
        return ev.map(function (v) {
          return vertices_coords[v];
        });
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
  var make_planar_faces = function make_planar_faces(_ref19) {
    var vertices_coords = _ref19.vertices_coords,
        vertices_vertices = _ref19.vertices_vertices,
        vertices_edges = _ref19.vertices_edges,
        vertices_sectors = _ref19.vertices_sectors,
        edges_vertices = _ref19.edges_vertices,
        edges_vector = _ref19.edges_vector;
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
  var make_faces_vertices = function make_faces_vertices(graph) {
    return make_planar_faces(graph).map(function (face) {
      return face.vertices;
    });
  };
  var make_faces_edges = function make_faces_edges(graph) {
    return make_planar_faces(graph).map(function (face) {
      return face.edges;
    });
  };
  var make_faces_faces = function make_faces_faces(_ref20) {
    var faces_vertices = _ref20.faces_vertices;
    var faces_faces = faces_vertices.map(function () {
      return [];
    });
    var edgeMap = {};
    faces_vertices.forEach(function (vertices_index, idx1) {
      var n = vertices_index.length;
      vertices_index.forEach(function (v1, i, vs) {
        var v2 = vs[(i + 1) % n];
        if (v2 < v1) {
          var _ref21 = [v2, v1];
          v1 = _ref21[0];
          v2 = _ref21[1];
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
  var make_face_spanning_tree = function make_face_spanning_tree(_ref22) {
    var faces_vertices = _ref22.faces_vertices,
        faces_faces = _ref22.faces_faces;
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
        next_level[i].edge_vertices = ev.slice(0, 2);
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
  var make_faces_matrix = function make_faces_matrix(_ref23) {
    var vertices_coords = _ref23.vertices_coords,
        edges_vertices = _ref23.edges_vertices,
        edges_foldAngle = _ref23.edges_foldAngle,
        edges_assignment = _ref23.edges_assignment,
        faces_vertices = _ref23.faces_vertices,
        faces_faces = _ref23.faces_faces;
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
        var _math$core2;
        var verts = entry.edge_vertices.map(function (v) {
          return vertices_coords[v];
        });
        var edgeKey = entry.edge_vertices.join(" ");
        var edge = edge_map[edgeKey];
        var local_matrix = math.core.make_matrix3_rotate(edges_foldAngle[edge] * Math.PI / 180,
        (_math$core2 = math.core).subtract.apply(_math$core2, _toConsumableArray(math.core.resize_up(verts[1], verts[0]))),
        verts[0]
        );
        faces_matrix[entry.face] = math.core.multiply_matrices3(faces_matrix[entry.parent], local_matrix);
      });
    });
    return faces_matrix;
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
  var make_faces_coloring_from_matrix = function make_faces_coloring_from_matrix(_ref25) {
    var faces_matrix = _ref25.faces_matrix;
    return faces_matrix.map(function (m) {
      return m[0] * m[4] - m[1] * m[3];
    }).map(function (c) {
      return c >= 0;
    });
  };
  var make_faces_coloring = function make_faces_coloring(_ref26) {
    var faces_vertices = _ref26.faces_vertices,
        faces_faces = _ref26.faces_faces;
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var coloring = [];
    coloring[root_face] = true;
    make_face_spanning_tree({
      faces_vertices: faces_vertices,
      faces_faces: faces_faces
    }, root_face).forEach(function (level, i) {
      return level.forEach(function (entry) {
        coloring[entry.face] = i % 2 === 0;
      });
    });
    return coloring;
  };

  var make = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_vertices_edges: make_vertices_edges,
    make_vertices_edges_sorted: make_vertices_edges_sorted,
    make_vertices_vertices: make_vertices_vertices,
    make_vertices_faces: make_vertices_faces,
    make_vertices_faces_sorted: make_vertices_faces_sorted,
    make_vertices_to_edge_bidirectional: make_vertices_to_edge_bidirectional,
    make_vertices_to_edge: make_vertices_to_edge,
    make_vertices_to_face: make_vertices_to_face,
    make_vertices_vertices_vector: make_vertices_vertices_vector,
    make_vertices_sectors: make_vertices_sectors,
    make_vertices_coords_folded: make_vertices_coords_folded,
    make_edges_edges: make_edges_edges,
    make_edges_faces: make_edges_faces,
    make_edges_foldAngle: make_edges_foldAngle,
    make_edges_assignment: make_edges_assignment,
    make_edges_vector: make_edges_vector,
    make_edges_length: make_edges_length,
    make_edges_coords_min_max: make_edges_coords_min_max,
    make_edges_coords_min_max_exclusive: make_edges_coords_min_max_exclusive,
    make_edges_coords_min_max_inclusive: make_edges_coords_min_max_inclusive,
    make_planar_faces: make_planar_faces,
    make_faces_vertices: make_faces_vertices,
    make_faces_edges: make_faces_edges,
    make_faces_faces: make_faces_faces,
    get_face_face_shared_vertices: get_face_face_shared_vertices,
    make_face_spanning_tree: make_face_spanning_tree,
    make_faces_matrix: make_faces_matrix,
    make_faces_center: make_faces_center,
    make_faces_coloring_from_matrix: make_faces_coloring_from_matrix,
    make_faces_coloring: make_faces_coloring
  });

  var get_boundary = function get_boundary(_ref) {
    var vertices_edges = _ref.vertices_edges,
        edges_vertices = _ref.edges_vertices,
        edges_assignment = _ref.edges_assignment;
    if (edges_assignment === undefined) {
      return {
        vertices: [],
        edges: []
      };
    }
    if (!vertices_edges) {
      vertices_edges = make_vertices_edges({
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
      return {
        vertices: [],
        edges: []
      };
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
        return {
          vertices: [],
          edges: []
        };
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
  var get_planar_boundary = function get_planar_boundary(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        vertices_edges = _ref2.vertices_edges,
        vertices_vertices = _ref2.vertices_vertices,
        edges_vertices = _ref2.edges_vertices;
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
    get_boundary: get_boundary,
    get_planar_boundary: get_planar_boundary
  });

  var prepare_clip_func_params = function prepare_clip_func_params(object, type) {
    switch (type) {
      case "line":
      case "ray":
        return [object.vector, object.origin];
      case "segment":
        return [object[0], object[1]];
      default:
        return [];
    }
  };
  var clip_line = function clip_line(_ref, line) {
    var vertices_coords = _ref.vertices_coords,
        vertices_edges = _ref.vertices_edges,
        edges_vertices = _ref.edges_vertices,
        edges_assignment = _ref.edges_assignment,
        boundaries_vertices = _ref.boundaries_vertices;
    var type = math["typeof"](line);
    var func = math.core["clip_".concat(type, "_in_convex_poly_exclusive")];
    if (func) {
      if (!boundaries_vertices) {
        boundaries_vertices = get_boundary({
          vertices_edges: vertices_edges,
          edges_vertices: edges_vertices,
          edges_assignment: edges_assignment
        }).vertices;
      }
      var polygon = boundaries_vertices.map(function (v) {
        return vertices_coords[v];
      });
      return func.apply(void 0, [polygon].concat(_toConsumableArray(prepare_clip_func_params(line, type))));
    }
  };

  var clip = /*#__PURE__*/Object.freeze({
    __proto__: null,
    clip_line: clip_line
  });

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
      return math.core.point_in_poly(point, f.face);
    }).shift();
    return face === undefined ? undefined : face.i;
  };
  var nearest_face = face_containing_point;

  var nearest$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    nearest_vertex: nearest_vertex,
    nearest_edge: nearest_edge,
    face_containing_point: face_containing_point,
    nearest_face: nearest_face
  });

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
        if (typeof el === "number") {
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
      if (typeof n === "number") {
        if (inv[n] !== undefined) {
          if (typeof inv[n] === "number") {
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
  var invert_array = function invert_array(a) {
    var b = [];
    a.forEach(function (n, i) {
      b[n] = i;
    });
    return b;
  };

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

  var set_edges_angles = function set_edges_angles(graph) {
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
  var populate = function populate(graph) {
    if (_typeof(graph) !== "object") {
      return;
    }
    if (!graph.edges_vertices) {
      return;
    }
    graph.vertices_edges = make_vertices_edges(graph);
    graph.vertices_vertices = make_vertices_vertices(graph);
    graph.vertices_edges = make_vertices_edges_sorted(graph);
    if (graph.vertices_coords) {
      graph.edges_vector = make_edges_vector(graph);
      graph.vertices_sectors = make_vertices_sectors(graph);
    }
    set_edges_angles(graph);
    if (graph.vertices_coords) {
      var faces = make_planar_faces(graph);
      graph.faces_vertices = faces.map(function (face) {
        return face.vertices;
      });
      graph.faces_edges = faces.map(function (face) {
        return face.edges;
      });
      graph.faces_angles = faces.map(function (face) {
        return face.angles;
      });
    } else {
      graph.faces_vertices = [];
      graph.faces_edges = [];
    }
    graph.vertices_faces = graph.vertices_vertices ? make_vertices_faces_sorted(graph) : make_vertices_faces(graph);
    graph.edges_faces = make_edges_faces(graph);
    graph.faces_faces = make_faces_faces(graph);
    if (graph.vertices_coords) {
      graph.faces_matrix = make_faces_matrix(graph);
    }
    return graph;
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

  var vef = ["vertices", "edges", "faces"];
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
    update_suffixes(source, suffixes, ["vertices"], maps);
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
    update_suffixes(source, suffixes, ["edges", "faces"], maps);
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

  var subgraph = function subgraph(graph, components) {
    var remove_indices = {};
    var sorted_components = {};
    ["faces", "edges", "vertices"].forEach(function (key) {
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

  var fn_and = function fn_and(a, b) {
    return a && b;
  };
  var fn_cat = function fn_cat(a, b) {
    return a.concat(b);
  };
  var fn_def = function fn_def(a) {
    return a !== undefined;
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
      map: remove_geometry_indices(graph, VERTICES, remove_indices),
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
      get_graph_keys_with_suffix(graph, EDGES).forEach(function (sKey) {
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
      map: remove_geometry_indices(graph, EDGES, remove_indices),
      remove: remove_indices
    };
  };
  var remove_duplicate_edges = function remove_duplicate_edges(graph) {
    var duplicates = get_duplicate_edges(graph);
    var remove_indices = Object.keys(duplicates);
    var map = remove_geometry_indices(graph, EDGES, remove_indices);
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
    get_graph_keys_with_suffix(graph, VERTICES).forEach(function (sKey) {
      return graph[sKey].forEach(function (_, i) {
        return graph[sKey][i].forEach(function (v, j) {
          graph[sKey][i][j] = map[v];
        });
      });
    });
    get_graph_keys_with_prefix(graph, VERTICES).filter(function (a) {
      return a !== VERTICES_COORDS;
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
        edges_span_vertices[e][v] = math.core.point_on_segment_exclusive(vertices_coords[v], edges_coords[e][0], edges_coords[e][1], epsilon);
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
        edges_intersections[i][j] = math.core.intersect_lines(edges_vector[i], edges_origin[i], edges_vector[j], edges_origin[j], math.core.exclude_s, math.core.exclude_s, epsilon);
        edges_intersections[j][i] = edges_intersections[i][j];
      }
    }
    return edges_intersections;
  };

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
    if (graph.edges_assignment) {
      graph.edges_assignment = edge_map.map(function (i) {
        return graph.edges_assignment[i] || "U";
      });
    }
    if (graph.edges_foldAngle) {
      graph.edges_foldAngle = edge_map.map(function (i) {
        return graph.edges_foldAngle[i] || 0;
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
  var fragment_keep_keys = ["vertices_coords", "edges_vertices", "edges_assignment", "edges_foldAngle"];
  var fragment = function fragment(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    graph.vertices_coords = graph.vertices_coords.map(function (coord) {
      return coord.slice(0, 2);
    });
    [VERTICES, EDGES, FACES].map(function (key) {
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

  var clone = function clone(o) {
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

  var add_vertices_split_edges = function add_vertices_split_edges(graph, vertices_coords) {
    var new_indices = add_vertices(graph, vertices_coords);
    var edges = graph.edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return graph.vertices_coords[v];
      });
    });
    var vertices_edge_collinear = vertices_coords.map(function (v) {
      return edges.map(function (edge) {
        return math.core.point_on_segment_exclusive(v, edge[0], edge[1]);
      }).map(function (on_edge, i) {
        return on_edge ? i : undefined;
      }).filter(function (a) {
        return a !== undefined;
      }).shift();
    });
    var remove_indices = vertices_edge_collinear.filter(function (vert_edge) {
      return vert_edge !== undefined;
    });
    var new_edges = vertices_edge_collinear.map(function (e, i) {
      return {
        e: e,
        i: i
      };
    }).filter(function (el) {
      return el.e !== undefined;
    }).map(function (el) {
      var edge = transpose_graph_array_at_index(graph, "edges", el.e);
      return [edge, clone(edge)].map(function (obj, i) {
        return Object.assign(obj, {
          edges_vertices: [graph.edges_vertices[el.e][i], new_indices[el.i]]
        });
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var edges_length = count.edges(graph);
    var diff = {
      "new": {
        edges: []
      }
    };
    new_edges.forEach(function (new_edge, i) {
      return Object.keys(new_edge).forEach(function (key) {
        if (graph[key] === undefined) {
          graph[key] = [];
        }
        graph[key][edges_length + i] = new_edge[key];
        diff["new"].edges[i] = edges_length + i;
      });
    });
    remove_geometry_indices(graph, "edges", remove_indices);
    return new_indices;
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
  };

  var update_vertices_vertices = function update_vertices_vertices(_ref, vertex, incident_vertices) {
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
  var update_vertices_edges = function update_vertices_edges(_ref2, vertices, old_edge, new_vertex, new_edges) {
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
  var update_vertices_faces = function update_vertices_faces(_ref3, vertex, faces) {
    var vertices_faces = _ref3.vertices_faces;
    if (!vertices_faces) {
      return;
    }
    vertices_faces[vertex] = _toConsumableArray(faces);
  };
  var update_faces_vertices = function update_faces_vertices(_ref4, faces, new_vertex, incident_vertices) {
    var faces_vertices = _ref4.faces_vertices;
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
  var update_faces_edges = function update_faces_edges(_ref5, faces, new_vertex, new_edges, old_edge) {
    var edges_vertices = _ref5.edges_vertices,
        faces_edges = _ref5.faces_edges;
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
  };
  var split_edge_into_two = function split_edge_into_two(graph, edge_index, new_vertex) {
    var edge_vertices = graph.edges_vertices[edge_index];
    var new_edges = [{
      edges_vertices: [edge_vertices[0], new_vertex]
    }, {
      edges_vertices: [new_vertex, edge_vertices[1]]
    }];
    new_edges.forEach(function (edge, i) {
      [EDGES_ASSIGNMENT, EDGES_FOLDANGLE].filter(function (key) {
        return graph[key] !== undefined && graph[key][edge_index] !== undefined;
      }).forEach(function (key) {
        return edge[key] = graph[key][edge_index];
      });
      if (graph.edges_faces && graph.edges_faces[edge_index] !== undefined) {
        edge.edges_faces = _toConsumableArray(graph.edges_faces[edge_index]);
      }
      if (graph.edges_vector) {
        var verts = edge.edges_vertices.map(function (v) {
          return graph.vertices_coords[v];
        });
        edge.edges_vector = math.core.subtract(verts[1], verts[0]);
      }
      if (graph.edges_length) {
        var _math$core;
        var _verts = edge.edges_vertices.map(function (v) {
          return graph.vertices_coords[v];
        });
        edge.edges_length = (_math$core = math.core).distance2.apply(_math$core, _toConsumableArray(_verts));
      }
    });
    return new_edges;
  };
  var split_edge = function split_edge(graph, old_edge, coords) {
    if (graph.edges_vertices.length < old_edge) {
      return undefined;
    }
    var incident_vertices = graph.edges_vertices[old_edge];
    if (!coords) {
      var _math$core2;
      coords = (_math$core2 = math.core).midpoint.apply(_math$core2, _toConsumableArray(incident_vertices));
    }
    var similar = incident_vertices.map(function (v) {
      return graph.vertices_coords[v];
    }).map(function (vert) {
      return math.core.distance(vert, coords) < math.core.EPSILON;
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
    update_vertices_vertices(graph, vertex, incident_vertices);
    update_vertices_edges(graph, incident_vertices, old_edge, vertex, new_edges);
    var incident_faces = find_adjacent_faces_to_edge(graph, old_edge);
    if (incident_faces) {
      update_vertices_faces(graph, vertex, incident_vertices);
      update_faces_vertices(graph, incident_faces, vertex, incident_vertices);
      update_faces_edges(graph, incident_faces, vertex, new_edges, old_edge);
    }
    var edge_map = remove_geometry_indices(graph, EDGES, [old_edge]);
    new_edges.forEach(function (_, i) {
      new_edges[i] = edge_map[new_edges[i]];
    });
    edge_map.splice(-2);
    edge_map[old_edge] = new_edges;
    return {
      vertex: vertex,
      edges: {
        map: edge_map,
        remove: old_edge
      }
    };
  };

  var intersect_face_with_line = function intersect_face_with_line(_ref, face, vector, origin) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        faces_vertices = _ref.faces_vertices,
        faces_edges = _ref.faces_edges;
    var face_vertices_indices = faces_vertices[face].map(function (v) {
      return vertices_coords[v];
    }).map(function (coord) {
      return math.core.point_on_line(coord, vector, origin);
    }).map(function (collinear, i) {
      return collinear ? i : undefined;
    }).filter(function (i) {
      return i !== undefined;
    }).slice(0, 2);
    var vertices = face_vertices_indices.map(function (face_vertex_index) {
      return {
        vertex: faces_vertices[face][face_vertex_index],
        face_vertex_index: face_vertex_index
      };
    });
    if (vertices.length > 1) {
      var non_loop_distance = face_vertices_indices[1] - face_vertices_indices[0];
      var index_distance = non_loop_distance < 0 ? non_loop_distance + faces_vertices[face].length : non_loop_distance;
      if (index_distance === 1) {
        return undefined;
      }
      return {
        vertices: vertices,
        edges: []
      };
    }
    var edges = faces_edges[face].map(function (edge) {
      return edges_vertices[edge].map(function (v) {
        return vertices_coords[v];
      });
    }).map(function (edge_coords) {
      var _math$core;
      return (_math$core = math.core).intersect_line_seg_exclude.apply(_math$core, [vector, origin].concat(_toConsumableArray(edge_coords)));
    }).map(function (coords, face_edge_index) {
      return {
        coords: coords,
        face_edge_index: face_edge_index,
        edge: faces_edges[face][face_edge_index]
      };
    }).filter(function (el) {
      return el.coords !== undefined;
    }).slice(0, 2);
    if (vertices.length > 0 && edges.length > 0) {
      return {
        vertices: vertices,
        edges: edges
      };
    }
    if (edges.length > 1) {
      return {
        vertices: [],
        edges: edges
      };
    }
    return undefined;
  };

  var update_vertices_vertices$1 = function update_vertices_vertices(_ref, edge) {
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
  var make_edge = function make_edge(_ref2, vertices, faces) {
    var _math$core, _math$core2;
    var vertices_coords = _ref2.vertices_coords;
    var new_edge_coords = vertices.map(function (v) {
      return vertices_coords[v];
    }).reverse();
    return {
      edges_vertices: _toConsumableArray(vertices),
      edges_foldAngle: 0,
      edges_assignment: "U",
      edges_length: (_math$core = math.core).distance2.apply(_math$core, _toConsumableArray(new_edge_coords)),
      edges_vector: (_math$core2 = math.core).subtract.apply(_math$core2, _toConsumableArray(new_edge_coords)),
      edges_faces: _toConsumableArray(faces)
    };
  };
  var split_circular_array = function split_circular_array(array, indices) {
    indices.sort(function (a, b) {
      return a - b;
    });
    return [array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)), array.slice(indices[0], indices[1] + 1)];
  };
  var make_faces = function make_faces(_ref3, face, vertices) {
    var edges_vertices = _ref3.edges_vertices,
        faces_vertices = _ref3.faces_vertices;
    var vertices_to_edge = make_vertices_to_edge_bidirectional({
      edges_vertices: edges_vertices
    });
    var indices = vertices.map(function (el) {
      return faces_vertices[face].indexOf(el);
    });
    return split_circular_array(faces_vertices[face], indices).map(function (face_vertices) {
      return {
        faces_vertices: face_vertices,
        faces_edges: face_vertices.map(function (fv, i, arr) {
          return "".concat(fv, " ").concat(arr[(i + 1) % arr.length]);
        }).map(function (key) {
          return vertices_to_edge[key];
        })
      };
    });
  };
  var split_convex_face = function split_convex_face(graph, face, vector, origin) {
    var intersect = intersect_face_with_line(graph, face, vector, origin);
    if (intersect === undefined) {
      return undefined;
    }
    var vertices = intersect.vertices.map(function (el) {
      return el.vertex;
    });
    var changes = [];
    intersect.edges.map(function (el, i, arr) {
      el.edge = changes.length ? changes[0].edges.map[el.edge] : el.edge;
      changes.push(split_edge(graph, el.edge, el.coords));
    });
    vertices.push.apply(vertices, _toConsumableArray(changes.map(function (result) {
      return result.vertex;
    })));
    var edge = graph.edges_vertices.length;
    var faces = [0, 1].map(function (i) {
      return graph.faces_vertices.length + i - 1;
    });
    var new_edge = make_edge(graph, vertices, faces);
    Object.keys(new_edge).filter(function (key) {
      return graph[key] !== undefined;
    }).forEach(function (key) {
      graph[key][edge] = new_edge[key];
    });
    update_vertices_vertices$1(graph, edge);
    var new_faces = make_faces(graph, face, vertices);
    var faces_map = remove_geometry_indices(graph, "faces", [face]);
    new_faces.forEach(function (new_face, i) {
      return Object.keys(new_face).filter(function (key) {
        return graph[key] !== undefined;
      }).forEach(function (key) {
        graph[key][faces[i]] = new_face[key];
      });
    });
    graph.vertices_faces = make_vertices_faces(graph);
    graph.edges_faces = make_edges_faces(graph);
    graph.faces_faces = make_faces_faces(graph);
    if (changes.length === 2) {
      var inverse_map = invert_array(changes[0].edges.map);
      changes[1].edges.remove = inverse_map[changes[1].edges.remove];
    }
    faces_map[face] = faces;
    return {
      vertices: vertices,
      faces: {
        map: faces_map,
        remove: face
      },
      edges: {
        map: merge_nextmaps.apply(void 0, _toConsumableArray(changes.map(function (res) {
          return res.edges.map;
        }))),
        "new": edge,
        remove: changes.map(function (el) {
          return el.edges.remove;
        })
      }
    };
  };

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

  var get_face_sidedness = function get_face_sidedness(vector, origin, face_center, face_color) {
    var vec2 = [face_center[0] - origin[0], face_center[1] - origin[1]];
    var det = vector[0] * vec2[1] - vector[1] * vec2[0];
    return face_color ? det > 0 : det < 0;
  };
  var make_face_center_fast = function make_face_center_fast(graph, face_index) {
    if (!graph.faces_vertices[face_index]) {
      return [0, 0];
    }
    return graph.faces_vertices[face_index].map(function (v) {
      return graph.vertices_coords[v];
    }).reduce(function (a, b) {
      return [a[0] + b[0], a[1] + b[1]];
    }, [0, 0]).map(function (el) {
      return el / graph.faces_vertices[face_index].length;
    });
  };
  var prepare_graph_crease = function prepare_graph_crease(graph, vector, point, face_index) {
    var faceCount = count.faces(graph);
    var faceCountArray = Array.from(Array(faceCount));
    if (!graph["faces_re:layer"]) {
      graph["faces_re:layer"] = Array(faceCount).fill(0);
    }
    graph["faces_re:preindex"] = faceCountArray.map(function (_, i) {
      return i;
    });
    if (!graph.faces_matrix) {
      graph.faces_matrix = make_faces_matrix(graph, face_index);
    }
    graph.faces_coloring = make_faces_coloring_from_matrix(graph);
    graph["faces_re:creases"] = graph.faces_matrix.map(function (mat) {
      return math.core.invert_matrix3(mat);
    }).map(function (mat) {
      return math.core.multiply_matrix3_line3(mat, vector, point);
    });
    graph.faces_center = faceCountArray.map(function (_, i) {
      return make_face_center_fast(graph, i);
    });
    graph["faces_re:sidedness"] = faceCountArray.map(function (_, i) {
      return get_face_sidedness(graph["faces_re:creases"][i].vector, graph["faces_re:creases"][i].origin, graph.faces_center[i], graph.faces_coloring[i]);
    });
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
  var opposingCrease = function opposingCrease(assign) {
    return opposite_assignment[assign] || assign;
  };
  var flat_fold = function flat_fold(graph, vector, point, face_index) {
    var assignment = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "V";
    var opposite_crease = opposingCrease(assignment);
    if (face_index == null) {
      var containing_point = face_containing_point(graph, point);
      face_index = containing_point === undefined ? 0 : containing_point;
    }
    vector = math.core.resize(3, vector);
    point = math.core.resize(3, point);
    prepare_graph_crease(graph, vector, point, face_index);
    var folded = clone(graph);
    folded.vertices_coords.forEach(function (coord) {
      return coord.splice(2);
    });
    var faces_split = Array.from(Array(count.faces(graph))).map(function (_, i) {
      return i;
    }).reverse().map(function (i) {
      var face_color = folded.faces_coloring[i];
      var change = split_convex_face(folded, i, folded["faces_re:creases"][i].vector, folded["faces_re:creases"][i].origin);
      if (change === undefined) {
        return undefined;
      }
      folded.edges_assignment[change.edges["new"]] = face_color ? assignment : opposite_crease;
      folded.edges_foldAngle[change.edges["new"]] = face_color ? edges_assignment_degrees[assignment] || 0 : edges_assignment_degrees[opposite_crease] || 0;
      var new_faces = change.faces.map[change.faces.remove];
      new_faces.forEach(function (f) {
        folded.faces_center[f] = make_face_center_fast(folded, f);
        folded["faces_re:sidedness"][f] = get_face_sidedness(graph["faces_re:creases"][change.faces.remove].vector, graph["faces_re:creases"][change.faces.remove].origin, folded.faces_center[f], graph.faces_coloring[change.faces.remove]);
        folded["faces_re:layer"][f] = graph["faces_re:layer"][change.faces.remove];
        folded["faces_re:preindex"][f] = graph["faces_re:preindex"][change.faces.remove];
      });
      return change;
    }).reverse();
    folded["faces_re:layer"] = fold_faces_layer(folded["faces_re:layer"], folded["faces_re:sidedness"]);
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
    var face_0_preMatrix = graph.faces_matrix[0];
    if (assignment === "M" || assignment === "m" || assignment === "V" || assignment === "v") {
      face_0_preMatrix = faces_split[0] === undefined && !graph["faces_re:sidedness"][0] ? graph.faces_matrix[0] : math.core.multiply_matrices3(graph.faces_matrix[0], math.core.make_matrix3_reflectZ(graph["faces_re:creases"][0].vector, graph["faces_re:creases"][0].origin));
    }
    var folded_faces_matrix = make_faces_matrix(folded, face_0_newIndex).map(function (m) {
      return math.core.multiply_matrices3(face_0_preMatrix, m);
    });
    folded.faces_coloring = make_faces_coloring_from_matrix({
      faces_matrix: folded_faces_matrix
    });
    var crease_0 = math.core.multiply_matrix3_line3(face_0_preMatrix, graph["faces_re:creases"][0].vector, graph["faces_re:creases"][0].origin);
    var fold_direction = math.core.normalize(math.core.rotate270(crease_0.vector));
    var split_points = faces_split.map(function (change, i) {
      return change === undefined ? undefined : folded.edges_vertices[change.edges["new"]].map(function (v) {
        return folded.vertices_coords[v];
      }).map(function (p) {
        return math.core.multiply_matrix3_vector3(graph.faces_matrix[i], p);
      });
    })
    .filter(function (a) {
      return a !== undefined;
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    folded["re:construction"] = split_points.length === 0 ? {
      type: "flip",
      direction: fold_direction
    } : {
      type: "fold",
      assignment: assignment,
      direction: fold_direction,
      edge: two_furthest_points(split_points)
    };
    folded.faces_matrix = folded_faces_matrix;
    folded["vertices_re:foldedCoords"] = make_vertices_coords_folded(folded, face_0_newIndex);
    folded.faces_matrix = folded_faces_matrix;
    delete graph["faces_re:creases"];
    delete folded["faces_re:creases"];
    delete graph["faces_re:sidedness"];
    delete folded["faces_re:sidedness"];
    delete graph["faces_re:preindex"];
    delete folded["faces_re:preindex"];
    delete graph.faces_coloring;
    delete folded.faces_coloring;
    delete graph.faces_center;
    delete folded.faces_center;
    return folded;
  };

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

  var invert_array$1 = function invert_array(a) {
    var b = [];
    a.forEach(function (x, i) {
      b[x] = i;
    });
    return b;
  };
  var up_down_map = {
    V: 1,
    v: 1,
    M: -1,
    m: -1
  };
  var upOrDown = function upOrDown(mv, i) {
    return i % 2 === 0 ? up_down_map[mv] : -up_down_map[mv];
  };
  var between = function between(arr, i, j) {
    return i < j ? arr.slice(i + 1, j) : arr.slice(j + 1, i);
  };
  var get_sectors_layer = function get_sectors_layer(sectors, assignments) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.core.EPSILON;
    var pointer = 0;
    var fold_location = sectors.map(function (sec, i) {
      return i % 2 === 0 ? sec : -sec;
    })
    .map(function (move) {
      return pointer += move;
    });
    var sector_mins = fold_location.map(function (sec, i, arr) {
      return i % 2 === 0 ? arr[(i + arr.length - 1) % arr.length] : sec;
    }).map(function (n) {
      return n + epsilon;
    });
    var sector_maxs = fold_location.map(function (sec, i, arr) {
      return i % 2 === 0 ? sec : arr[(i + arr.length - 1) % arr.length];
    }).map(function (n) {
      return n - epsilon;
    });
    var test = function test(layering) {
      var index_of_index = [];
      layering.forEach(function (layer, i) {
        index_of_index[layer] = i;
      });
      var max = layering.length + (layering.length === sectors.length ? 0 : -1);
      var _loop = function _loop(i) {
        var j = (i + 1) % layering.length;
        var layers_between = between(layering, index_of_index[i], index_of_index[j]);
        var all_below_min = layers_between.map(function (index) {
          return fold_location[i] < sector_mins[index];
        }).reduce(fn_and, true);
        var all_above_max = layers_between.map(function (index) {
          return fold_location[i] > sector_maxs[index];
        }).reduce(fn_and, true);
        if (!all_below_min && !all_above_max) {
          return {
            v: false
          };
        }
      };
      for (var i = 0; i < max; i += 1) {
        var _ret = _loop(i);
        if (_typeof(_ret) === "object") return _ret.v;
      }
      return true;
    };
    var final_test = function final_test(stack) {
      var inverted_stack = invert_array$1(stack);
      var res = inverted_stack[0] > inverted_stack[inverted_stack.length - 1] ? assignments[0] === "M" : assignments[0] === "V";
      return res;
    };
    var recurse = function recurse() {
      var stack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var iter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var currentLayer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      stack = stack.slice(0, currentLayer).concat([iter], stack.slice(currentLayer, stack.length));
      if (!test(stack)) {
        return [];
      }
      if (iter >= sectors.length - 1) {
        return final_test(stack) ? [stack] : [];
      }
      var next_dir = upOrDown(assignments[(iter + 1) % sectors.length], iter);
      var spliceIndices = next_dir === 1 ? Array.from(Array(stack.length - currentLayer)).map(function (_, i) {
        return currentLayer + i + 1;
      }) : Array.from(Array(currentLayer + 1)).map(function (_, i) {
        return i;
      });
      return spliceIndices.map(function (i) {
        return recurse(stack, iter + 1, i);
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []).map(invert_array$1);
    };
    return recurse();
  };

  var get_unassigneds = function get_unassigneds(edges_assignment) {
    return edges_assignment.map(function (_, i) {
      return i;
    }).filter(function (i) {
      return edges_assignment[i] === "U" || edges_assignment[i] === "u";
    });
  };
  var all_possible_assignments = function all_possible_assignments(assignments) {
    var unassigneds = get_unassigneds(assignments);
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
      var array = assignments.slice();
      unassigneds.forEach(function (index, i) {
        array[index] = perm[i];
      });
      return array;
    });
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
  var assignment_solver = function assignment_solver(sectors, assignments) {
    if (assignments == null) {
      assignments = sectors.map(function () {
        return "U";
      });
    }
    var possibilities = all_possible_assignments(assignments);
    var layers = possibilities.map(function (assigns) {
      return get_sectors_layer(sectors, assigns);
    });
    return possibilities.map(function (_, i) {
      return i;
    }).filter(function (i) {
      return layers[i].length > 0;
    }).map(function (i) {
      return {
        assignment: possibilities[i],
        layer: layers[i]
      };
    });
  };

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

  var graph_methods = Object.assign(Object.create(null), {
    assign: assign$1,
    add_vertices: add_vertices,
    add_vertices_split_edges: add_vertices_split_edges,
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
    layer_solver: get_sectors_layer,
    assignment_solver: assignment_solver,
    single_vertex_fold_angles: single_vertex_fold_angles
  }, make,
  clip,
  transform, boundary, walk, nearest$1, fold_object, sort, span, maps,
  remove_methods, vertices_isolated);

  var best_fit_arrow = function best_fit_arrow(graph, crease) {
    var _math$core;
    var boundary = get_boundary(graph).vertices;
    var segment = clip_line(graph, crease);
    var midpoint = (_math$core = math.core).midpoint.apply(_math$core, _toConsumableArray(segment));
    var perp = {
      vector: math.core.rotate90(crease.vector),
      origin: crease.origin
    };
    var perp_segment = clip_line(graph, perp);
    return perp_segment;
  };
  var one_crease_arrow = function one_crease_arrow(graph, crease, axiom_number, params) {
    if (axiom_number == null || params == null) {
      return best_fit_arrow(graph, crease);
    }
    return best_fit_arrow(graph, crease);
  };

  var arrows = /*#__PURE__*/Object.freeze({
    __proto__: null,
    one_crease_arrow: one_crease_arrow
  });

  var line_line = function line_line(a, b) {
    return math.core.intersect_lines(a.vector, a.origin, b.vector, b.origin, math.core.include_l, math.core.include_l);
  };
  var reflect_point = function reflect_point(foldLine, point) {
    var intersect = math.core.intersect_lines(foldLine.vector, foldLine.origin, math.core.rotate270(foldLine.vector), point, math.core.include_l, math.core.include_l);
    var vec = math.core.subtract(intersect, point);
    return math.core.add(intersect, vec);
  };
  var boundary_for_arrows = function boundary_for_arrows(_ref) {
    var vertices_coords = _ref.vertices_coords;
    return math.core.convex_hull(vertices_coords);
  };
  var widest_perp = function widest_perp(graph, foldLine, point) {
    var boundary = boundary_for_arrows(graph);
    if (point === undefined) {
      var _math$core;
      var foldSegment = math.core.clip_line_in_convex_poly_exclusive(boundary, foldLine.vector, foldLine.origin);
      point = (_math$core = math.core).midpoint.apply(_math$core, _toConsumableArray(foldSegment));
    }
    var perpVector = math.core.rotate270(foldLine.vector);
    var smallest = math.core.clip_line_in_convex_poly_exclusive(boundary, perpVector, point).map(function (pt) {
      return math.core.distance(point, pt);
    }).sort(function (a, b) {
      return a - b;
    }).shift();
    var scaled = math.core.scale(math.core.normalize(perpVector), smallest);
    return [math.core.add(point, math.core.flip(scaled)), math.core.add(point, scaled)];
  };
  var axiom_1_arrows = function axiom_1_arrows(params, foldLine, graph) {
    return [widest_perp(graph, foldLine)];
  };
  var axiom_2_arrows = function axiom_2_arrows(params) {
    return [params.points];
  };
  var axiom_3_arrows = function axiom_3_arrows(params, foldLine, graph) {
    var arrowStart, arrowEnd, arrowStart2, arrowEnd2;
    var boundary = boundary_for_arrows(graph);
    var paramSeg = params.lines.map(function (l) {
      return math.core.clip_line_in_convex_poly_exclusive(boundary, l.vector, l.origin);
    });
    var paramIntersect = math.core.intersect_seg_seg_exclude(paramSeg[0][0], paramSeg[0][1], paramSeg[1][0], paramSeg[1][1]);
    if (!paramIntersect) {
      var _math$line;
      var midpoints = paramSeg.map(function (seg) {
        return math.core.midpoint(seg[0], seg[1]);
      });
      var midpointLine = (_math$line = math.line).fromPoints.apply(_math$line, _toConsumableArray(midpoints));
      var origin = math.intersect(foldLine, midpointLine);
      var perpLine = math.line(foldLine.vector.rotate90(), origin);
      var arrowPoints = params.lines.map(function (line) {
        return math.intersect(line, perpLine);
      });
      arrowStart = arrowPoints[0];
      arrowEnd = arrowPoints[1];
    } else {
      var paramVectors = params.lines.map(function (l) {
        return l.vector;
      });
      var flippedVectors = paramVectors.map(math.core.flip);
      var paramRays = paramVectors.concat(flippedVectors).map(function (vec) {
        return math.ray(vec, paramIntersect);
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
        return math.core.convex_poly_ray_exclusive(boundary, ray.vector, ray.origin).shift().shift();
      });
      var rayLengths = rayEndpoints.map(function (pt) {
        return math.core.distance(pt, paramIntersect);
      });
      if (rayLengths[0] < rayLengths[1]) {
        arrowStart = rayEndpoints[0];
        arrowEnd = math.core.add(a2.origin, a2.vector.normalize().scale(rayLengths[0]));
      } else {
        arrowStart = rayEndpoints[1];
        arrowEnd = math.core.add(a1.origin, a1.vector.normalize().scale(rayLengths[1]));
      }
      if (rayLengths[2] < rayLengths[3]) {
        arrowStart2 = rayEndpoints[2];
        arrowEnd2 = math.core.add(b2.origin, b2.vector.normalize().scale(rayLengths[2]));
      } else {
        arrowStart2 = rayEndpoints[3];
        arrowEnd2 = math.core.add(b1.origin, b1.vector.normalize().scale(rayLengths[3]));
      }
    }
    return arrowStart2 === undefined ? [[arrowStart, arrowEnd]] : [[arrowStart, arrowEnd], [arrowStart2, arrowEnd2]];
  };
  var axiom_4_arrows = function axiom_4_arrows(params, foldLine, graph) {
    return [widest_perp(graph, foldLine, line_line(foldLine, params.lines[0]))];
  };
  var axiom_5_arrows = function axiom_5_arrows(params, foldLine) {
    return [[params.points[1], reflect_point(foldLine, params.points[1])]];
  };
  var axiom_6_arrows = function axiom_6_arrows(params, foldLine) {
    return params.points.map(function (pt) {
      return [pt, reflect_point(foldLine, pt)];
    });
  };
  var axiom_7_arrows = function axiom_7_arrows(params, foldLine, graph) {
    return [[params.points[0], reflect_point(foldLine, params.points[0])], widest_perp(graph, foldLine, line_line(foldLine, params.lines[1]))];
  };
  var axiom_arrows = [null, axiom_1_arrows, axiom_2_arrows, axiom_3_arrows, axiom_4_arrows, axiom_5_arrows, axiom_6_arrows, axiom_7_arrows];
  delete axiom_arrows[0];

  var diagram = Object.assign(Object.create(null), arrows, {
    axiom_arrows: axiom_arrows
  });

  var Constructors$1 = Object.create(null);

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

  var GraphProto = {};
  GraphProto.prototype = Object.create(Object.prototype);
  var graphMethods = Object.assign({
    clean: clean,
    populate: populate,
    fragment: fragment,
    subgraph: subgraph,
    assign: assign$1
  }, transform);
  Object.keys(graphMethods).forEach(function (key) {
    GraphProto.prototype[key] = function () {
      return graphMethods[key].apply(graphMethods, [this].concat(Array.prototype.slice.call(arguments)));
    };
  });
  GraphProto.prototype.copy = function () {
    return Object.assign(Object.create(GraphProto), clone(this));
  };
  GraphProto.prototype.load = function (object) {
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
    }, clone(object));
  };
  GraphProto.prototype.clear = function () {
    var _this2 = this;
    fold_keys.graph.forEach(function (key) {
      return delete _this2[key];
    });
    fold_keys.orders.forEach(function (key) {
      return delete _this2[key];
    });
    delete this.file_frames;
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
  ["vertices", "edges", "faces"].forEach(function (key) {
    return Object.defineProperty(GraphProto.prototype, key, {
      get: function get() {
        return getComponent.call(this, key);
      }
    });
  });
  Object.defineProperty(GraphProto.prototype, "junctions", {
    get: function get() {
      return make_vertices_vertices_vector(this).map(function (vectors) {
        return math.junction.apply(math, _toConsumableArray(vectors));
      });
    }
  });
  Object.defineProperty(GraphProto.prototype, "boundary", {
    get: function get() {
      var _this4 = this;
      var boundary = get_boundary(this);
      var poly = math.polygon(boundary.vertices.map(function (v) {
        return _this4.vertices_coords[v];
      }));
      Object.keys(boundary).forEach(function (key) {
        poly[key] = boundary[key];
      });
      return poly;
    }
  });
  var nearestMethods = {
    vertices: nearest_vertex,
    edges: nearest_edge,
    faces: face_containing_point
  };
  var nearestElement = function nearestElement(key) {
    var _math$core;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    var point = (_math$core = math.core).get_vector.apply(_math$core, args);
    var index = nearestMethods[key](this, point);
    var result = transpose_graph_array_at_index(this, key, index);
    setup[key].call(this, result, index);
    result.index = index;
    return result;
  };
  GraphProto.prototype.nearest = function () {
    var _arguments = arguments,
        _this5 = this;
    var nears = Object.create(null);
    ["vertices", "edges", "faces"].forEach(function (key) {
      return Object.defineProperty(nears, singularize[key], {
        get: function get() {
          return nearestElement.call.apply(nearestElement, [_this5, key].concat(_toConsumableArray(_arguments)));
        }
      });
    });
    return nears;
  };
  var GraphProto$1 = GraphProto.prototype;

  var PlanarGraphProto = {};
  PlanarGraphProto.prototype = Object.create(GraphProto$1);
  var arcResolution = 96;
  ["line", "ray", "segment"].forEach(function (type) {
    PlanarGraphProto.prototype[type] = function () {
      var primitive = math[type].apply(math, arguments);
      if (!primitive) {
        return;
      }
      var segment = clip_line(this, line);
      if (!segment) {
        return;
      }
      var vertices = add_vertices(this, segment);
      var edges = add_edges(this, vertices);
      fragment(this);
      populate(this);
    };
  });
  ["circle", "ellipse", "rect", "polygon"].forEach(function (fName) {
    PlanarGraphProto.prototype[fName] = function () {
      var _this = this;
      var primitive = math[fName].apply(math, arguments);
      if (!primitive) {
        return;
      }
      var segments = primitive.segments(arcResolution).map(function (segment) {
        return math.segment(segment);
      }).map(function (segment) {
        return clip_line(_this, segment);
      }).filter(function (a) {
        return a !== undefined;
      });
      if (!segments) {
        return;
      }
      segments.forEach(function (segment) {
        var vertices = add_vertices(_this, segment);
        var edges = add_edges(_this, vertices);
      });
      fragment(this);
      populate(this);
    };
  });

  var CreasePatternProto = {};
  CreasePatternProto.prototype = Object.create(GraphProto$1);
  var arcResolution$1 = 96;
  ["line", "ray", "segment"].forEach(function (type) {
    CreasePatternProto.prototype[type] = function () {
      var primitive = math[type].apply(math, arguments);
      if (!primitive) {
        return;
      }
      var segment = clip_line(this, primitive);
      if (!segment) {
        return;
      }
      var vertices = add_vertices(this, segment);
      var edges = add_edges(this, vertices);
      var map = fragment(this).edges.map;
      populate(this);
      return edges.map(function (e) {
        return map[e];
      });
    };
  });
  ["circle", "ellipse", "rect", "polygon"].forEach(function (fName) {
    CreasePatternProto.prototype[fName] = function () {
      var _this = this;
      var primitive = math[fName].apply(math, arguments);
      if (!primitive) {
        return;
      }
      var segments = primitive.segments(arcResolution$1).map(function (segment) {
        return math.segment(segment);
      }).map(function (segment) {
        return clip_line(_this, segment);
      }).filter(function (a) {
        return a !== undefined;
      });
      if (!segments) {
        return;
      }
      var vertices = [];
      var edges = [];
      segments.forEach(function (segment) {
        var verts = add_vertices(_this, segment);
        vertices.push.apply(vertices, _toConsumableArray(verts));
        edges.push.apply(edges, _toConsumableArray(add_edges(_this, verts)));
      });
      var map = fragment(this).edges.map;
      populate(this);
      return edges.map(function (e) {
        return map[e];
      });
    };
  });
  var CreasePatternProto$1 = CreasePatternProto.prototype;

  var make_polygon_vertices = function make_polygon_vertices(i) {
    return i === 4 ? [[0, 0], [1, 0], [1, 1], [0, 1]] : math.core.make_regular_polygon(i, 0.5 / Math.sin(Math.PI / i));
  };
  var Create = {};
  var polygon_names = [null, null, null, "triangle", "square", "pentagon", "hexagon", "heptagon", "octogon", "nonagon", "decagon", "hendecagon", "dodecagon"];
  [0, 1, 2].forEach(function (i) {
    delete polygon_names[i];
  });
  var create_init = function create_init(graph) {
    return populate(graph);
  };
  polygon_names.forEach(function (name, i) {
    var arr = Array.from(Array(i));
    Create[name] = function () {
      return create_init({
        vertices_coords: make_polygon_vertices(i),
        edges_vertices: arr.map(function (_, i) {
          return [i, (i + 1) % arr.length];
        }),
        edges_assignment: arr.map(function () {
          return "B";
        })
      });
    };
  });
  Create.circle = function () {
    var edge_count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 90;
    return create_init({
      vertices_coords: math.core.make_regular_polygon(edge_count, 1),
      edges_vertices: Array.from(Array(edge_count)).map(function (_, i, arr) {
        return [i, (i + 1) % arr.length];
      }),
      edges_assignment: Array.from(Array(edge_count)).map(function () {
        return "B";
      })
    });
  };
  Create.kite = function () {
    return create_init({
      vertices_coords: [[0, 0], [Math.sqrt(2) - 1, 0], [1, 0], [1, 1 - (Math.sqrt(2) - 1)], [1, 1], [0, 1]],
      edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]],
      edges_assignment: ["B", "B", "B", "B", "B", "B", "V", "V", "F"]
    });
  };

  var axioms$1 = [null, math.core.axiom1, math.core.axiom2, math.core.axiom3, math.core.axiom4, math.core.axiom5, math.core.axiom6, math.core.axiom7];
  delete axioms$1[0];
  var sort_axiom_params = function sort_axiom_params(number, points, lines) {
    switch (number) {
      case "1":
      case "2":
      case 1:
      case 2:
        return points;
      case "3":
      case 3:
        return [lines[0].vector, lines[0].origin, lines[1].vector, lines[1].origin];
      case "4":
      case 4:
        return [lines[0].vector, points[0]];
      case "5":
      case 5:
        return [lines[0].vector, lines[0].origin, points[0], points[1]];
      case "6":
      case 6:
        return [lines[0].vector, lines[0].origin, lines[1].vector, lines[1].origin, points[0], points[1]];
      case "7":
      case 7:
        return [lines[0].vector, lines[0].origin, lines[1].vector, points[0]];
    }
    return [];
  };
  var axiom = function axiom(number, params) {
    return axioms$1[number].apply(axioms$1, _toConsumableArray(sort_axiom_params(number, params.points.map(function (p) {
      return math.core.get_vector(p);
    }), params.lines.map(function (l) {
      return math.core.get_line(l);
    }))));
  };
  Object.keys(axioms$1).forEach(function (key) {
    axiom[key] = axioms$1[key];
  });

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
  var en = [
  	null,
  	"fold a line through two points",
  	"fold two points together",
  	"fold two lines together",
  	"fold a line on top of itself, creasing through a point",
  	"fold a point to a line, creasing through another point",
  	"fold a point to a line and another point to another line",
  	"fold a point to a line and another line onto itself"
  ];
  var es = [
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
  var zh = [
  	null,
  	"通過兩點折一條線",
  	"將兩點折疊起來",
  	"將兩條線折疊在一起",
  	"通過一個點折疊一條線在自身上面",
  	"將一個點，通過另一個點折疊成一條線，",
  	"將一個點折疊為一條線，再將另一個點折疊到另一條線",
  	"將一個點折疊成一條線，另一條線折疊到它自身上"
  ];
  var axioms$2 = {
  	ar: ar,
  	de: de,
  	en: en,
  	es: es,
  	fr: fr,
  	hi: hi,
  	jp: jp,
  	ko: ko,
  	ms: ms,
  	pt: pt,
  	ru: ru,
  	tr: tr,
  	vi: vi,
  	zh: zh
  };

  var es$1 = {
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
  var en$1 = {
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
  var zh$1 = {
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
  	es: es$1,
  	en: en$1,
  	zh: zh$1
  };

  var text = {
    axioms: axioms$2,
    folds: folds
  };

  var htmlString = "<!DOCTYPE html><title>.</title>";
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

  var make_faces_geometry = function make_faces_geometry(graph) {
    var THREE = win.THREE;
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
      throw "degenerate edge";
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
    var THREE = win.THREE;
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
      var scaled = math.core.scale(normalized, scale);
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

  var foldToThree = /*#__PURE__*/Object.freeze({
    __proto__: null,
    make_faces_geometry: make_faces_geometry,
    make_edges_geometry: make_edges_geometry
  });

  var _NodeNames$v;
  var keys$1 = ["number", "object", "transform", "class", "style", "function", "string", "undefined", "boolean", "path", "svg", "id", "viewBox"];
  var Keys = {};
  keys$1.forEach(function (key) {
    return Keys[key] = key;
  });
  var isBrowser$1 = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== Keys.undefined && _typeof(window.document) !== Keys.undefined;
  var isNode$1 = (typeof process === "undefined" ? "undefined" : _typeof(process)) !== Keys.undefined && process.versions != null && process.versions.node != null;
  var isWebWorker$1 = (typeof self === "undefined" ? "undefined" : _typeof(self)) === Keys.object && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";
  var detect = Object.freeze({
    __proto__: null,
    isBrowser: isBrowser$1,
    isNode: isNode$1,
    isWebWorker: isWebWorker$1
  });
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
      nodeName: "path",
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
      nodeName: "path",
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
      attributes: ["points"],
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
      attributes: ["points"],
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
      nodeName: "path",
      attributes: ["d"],
      args: roundRectArguments
    }
  };
  var is_iterable$1 = function is_iterable(obj) {
    return obj != null && _typeof(obj[Symbol.iterator]) === Keys["function"];
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
  var coordinates = function coordinates() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return args.filter(function (a) {
      return _typeof(a) === Keys.number;
    }).concat(args.filter(function (a) {
      return _typeof(a) === Keys.object && a !== null;
    }).map(function (el) {
      if (_typeof(el.x) === Keys.number) {
        return [el.x, el.y];
      }
      if (_typeof(el[0]) === Keys.number) {
        return [el[0], el[1]];
      }
      return undefined;
    }).filter(function (a) {
      return a !== undefined;
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []));
  };
  var add = function add(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
  };
  var sub = function sub(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
  };
  var scale = function scale(a, s) {
    return [a[0] * s, a[1] * s];
  };
  var curveArguments = function curveArguments() {
    var params = coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1.apply(void 0, arguments)));
    var endpoints = params.slice(0, 4);
    if (!endpoints.length) {
      return [""];
    }
    var o_curve = params[4] || 0;
    var o_pinch = params[5] || 0.5;
    var tailPt = [endpoints[0], endpoints[1]];
    var headPt = [endpoints[2], endpoints[3]];
    var vector = sub(headPt, tailPt);
    var midpoint = add(tailPt, scale(vector, 0.5));
    var perpendicular = [vector[1], -vector[0]];
    var bezPoint = add(midpoint, scale(perpendicular, o_curve));
    var tailControl = add(tailPt, scale(sub(bezPoint, tailPt), o_pinch));
    var headControl = add(headPt, scale(sub(bezPoint, headPt), o_pinch));
    return ["M".concat(tailPt[0], ",").concat(tailPt[1], "C").concat(tailControl[0], ",").concat(tailControl[1], " ").concat(headControl[0], ",").concat(headControl[1], " ").concat(headPt[0], ",").concat(headPt[1])];
  };
  var getEndpoints = function getEndpoints(element) {
    var d = element.getAttribute("d");
    if (d == null || d === "") {
      return [];
    }
    return [d.slice(d.indexOf("M") + 1, d.indexOf("C")).split(","), d.split(" ").pop().split(",")].map(function (p) {
      return p.map(function (n) {
        return parseFloat(n);
      });
    });
  };
  var bend = function bend(element, amount) {
    element.setAttribute("d", curveArguments.apply(void 0, _toConsumableArray(getEndpoints(element)).concat([amount])));
    return element;
  };
  var methods$1 = {
    bend: bend
  };
  var Curve = {
    curve: {
      nodeName: "path",
      attributes: ["d"],
      args: curveArguments,
      methods: methods$1
    }
  };
  var nodes = {};
  Object.assign(nodes, Arc, Wedge, Parabola, RegularPolygon, RoundRect, Curve);
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
  var children = Object.freeze(nodesAndChildren);
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
  function viewBox() {
    var numbers = coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1(arguments)));
    if (numbers.length === 2) {
      numbers.unshift(0, 0);
    }
    return numbers.length === 4 ? viewBoxValue.apply(void 0, _toConsumableArray(numbers)) : undefined;
  }
  var cdata = function cdata(textContent) {
    return new win$1.DOMParser().parseFromString("<root></root>", "text/xml").createCDATASection("".concat(textContent));
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
    return new win$1.DOMParser().parseFromString(string, "text/xml");
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
      if (_typeof(input) === Keys.string || input instanceof String) {
        fetch(input).then(function (response) {
          return response.text();
        }).then(function (str) {
          return checkParseError(parse(str));
        }).then(function (xml) {
          return xml.nodeName === "svg" ? xml : xml.getElementsByTagName("svg")[0];
        }).then(function (svg) {
          return svg == null ? reject("valid XML found, but no SVG element") : resolve(svg);
        })["catch"](function (err) {
          return reject(err);
        });
      } else if (input instanceof win$1.Document) {
        return asyncDone(input);
      }
    });
  };
  var sync = function sync(input) {
    if (_typeof(input) === Keys.string || input instanceof String) {
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
    return _typeof(input) === Keys.string && /^[\w,\s-]+\.[A-Za-z]{3}$/.test(input) && input.length < 10000;
  };
  var Load = function Load(input) {
    return isFilename(input) && isBrowser$1 && _typeof(win$1.fetch) === Keys["function"] ? async(input) : sync(input);
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
      output: Keys.string,
      windowStyle: false,
      filename: "image.svg"
    };
  };
  var getWindowStylesheets = function getWindowStylesheets() {
    var css = [];
    if (win$1.document.styleSheets) {
      for (var s = 0; s < win$1.document.styleSheets.length; s += 1) {
        var sheet = win$1.document.styleSheets[s];
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
    var blob = new win$1.Blob([contentsAsString], {
      type: "text/plain"
    });
    var a = win$1.document.createElement("a");
    a.setAttribute("href", win$1.URL.createObjectURL(blob));
    a.setAttribute("download", filename);
    win$1.document.body.appendChild(a);
    a.click();
    win$1.document.body.removeChild(a);
  };
  var save = function save(svg, options) {
    options = Object.assign(SAVE_OPTIONS(), options);
    if (options.windowStyle) {
      var styleContainer = win$1.document.createElementNS(NS, Keys.style);
      styleContainer.setAttribute("type", "text/css");
      styleContainer.innerHTML = getWindowStylesheets();
      svg.appendChild(styleContainer);
    }
    var source = new win$1.XMLSerializer().serializeToString(svg);
    var formattedString = vkXML(source);
    if (options.download && isBrowser$1 && !isNode$1) {
      downloadInBrowser(options.filename, formattedString);
    }
    return options.output === "svg" ? svg : formattedString;
  };
  var setViewBox = function setViewBox(element) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }
    var viewBox$1 = args.length === 1 && typeof args[0] === "string" ? args[0] : viewBox.apply(void 0, args);
    if (viewBox$1) {
      element.setAttribute(Keys.viewBox, viewBox$1);
    }
    return element;
  };
  var getViewBox = function getViewBox(element) {
    var vb = element.getAttribute(Keys.viewBox);
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
  var viewBox$1 = Object.freeze({
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
    return _typeof(result.then) === Keys["function"] ? result.then(function (svg) {
      return assignSVG(target, svg);
    }) : assignSVG(target, result);
  };
  var getFrame = function getFrame(element) {
    var viewBox = getViewBox(element);
    if (viewBox !== undefined) {
      return viewBox;
    }
    if (_typeof(element.getBoundingClientRect) === Keys["function"]) {
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
      return child.getAttribute(Keys["class"]) === bgClass;
    }).shift();
    if (backRect == null) {
      backRect = this.Constructor.apply(this, ["rect"].concat(_toConsumableArray(getFrame(element))));
      backRect.setAttribute(Keys["class"], bgClass);
      backRect.setAttribute("stroke", "none");
      element.insertBefore(backRect, element.firstChild);
    }
    backRect.setAttribute("fill", color);
    return element;
  };
  var findStyleSheet = function findStyleSheet(element) {
    var styles = element.getElementsByTagName(Keys.style);
    return styles.length === 0 ? undefined : styles[0];
  };
  var _stylesheet = function stylesheet(element, textContent) {
    var styleSection = findStyleSheet(element);
    if (styleSection == null) {
      styleSection = this.Constructor(Keys.style);
      element.insertBefore(styleSection, element.firstChild);
    }
    styleSection.textContent = "";
    styleSection.appendChild(cdata(textContent));
    return styleSection;
  };
  var methods$1$1 = {
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
      press: function press() {},
      release: function release() {},
      move: function move(e, viewPoint) {
        if (e.buttons > 0 && startPoint[0] === undefined) {
          startPoint = viewPoint;
        } else if (e.buttons === 0 && startPoint[0] !== undefined) {
          startPoint = [];
        }
        ["startX", "startY"].filter(function (prop) {
          return !e.hasOwnProperty(prop);
        }).forEach(function (prop, i) {
          return defineGetter(e, prop, startPoint[i]);
        });
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
      if (win$1.cancelAnimationFrame) {
        win$1.cancelAnimationFrame(requestId);
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
            requestId = win$1.requestAnimationFrame(handlers[uuid]);
          }
        };
        handlers[uuid] = handlerFunc;
        if (win$1.requestAnimationFrame) {
          requestId = win$1.requestAnimationFrame(handlers[uuid]);
        }
      },
      enumerable: true
    });
    Object.defineProperty(element, "stop", {
      value: removeHandlers,
      enumerable: true
    });
  };
  var distanceSq2 = function distanceSq2(a, b) {
    return Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2);
  };
  var distance2$1 = function distance2(a, b) {
    return Math.sqrt(distanceSq2(a, b));
  };
  var math$1 = Object.freeze({
    __proto__: null,
    distanceSq2: distanceSq2,
    distance2: distance2$1
  });
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
      coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1.apply(void 0, arguments))).forEach(function (n, i) {
        position[i] = n;
      });
      updateSVG();
      if (typeof position.delegate === "function") {
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
    ["svg", "updatePosition", "selected"].forEach(function (key) {
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
      return typeof delegate === "function" ? delegate.call(points, point, selected, points) : undefined;
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
        if (typeof arguments[0] === "function") {
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
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      return controls.call.apply(controls, [svg, svg].concat(args));
    };
  };
  var ElementConstructor = new win$1.DOMParser().parseFromString("<div />", "text/xml").documentElement.constructor;
  var svg = {
    svg: {
      args: function args() {
        return [viewBox(coordinates.apply(void 0, arguments))].filter(function (a) {
          return a != null;
        });
      },
      methods: methods$1$1,
      init: function init(element) {
        for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          args[_key6 - 1] = arguments[_key6];
        }
        args.filter(function (a) {
          return _typeof(a) === Keys.string;
        }).forEach(function (string) {
          return loadSVG(element, string);
        });
        args.filter(function (a) {
          return a != null;
        }).filter(function (arg) {
          return arg instanceof ElementConstructor;
        }).filter(function (el) {
          return _typeof(el.appendChild) === Keys["function"];
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
    for (var _len7 = arguments.length, sources = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
      sources[_key7 - 1] = arguments[_key7];
    }
    var elements = sources.map(function (source) {
      return sync(source);
    }).filter(function (a) {
      return a !== undefined;
    });
    elements.filter(function (element) {
      return element.tagName === Keys.svg;
    }).forEach(function (element) {
      return moveChildren(group, element);
    });
    elements.filter(function (element) {
      return element.tagName !== Keys.svg;
    }).forEach(function (element) {
      return group.appendChild(element);
    });
    return group;
  };
  var g = {
    g: {
      init: loadGroup,
      methods: {
        load: loadGroup
      }
    }
  };
  var attributes = Object.assign(Object.create(null), {
    svg: ["viewBox"],
    line: ["x1", "y1", "x2", "y2"],
    rect: ["x", "y", "width", "height"],
    circle: ["cx", "cy", "r"],
    ellipse: ["cx", "cy", "rx", "ry"],
    polygon: ["points"],
    polyline: ["points"],
    path: ["d"],
    text: ["x", "y"],
    mask: ["id"],
    symbol: ["id"],
    clipPath: ["id", "clip-rule"],
    marker: ["id", "markerHeight", "markerUnits", "markerWidth", "orient", "refX", "refY"],
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
    _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1(a, b))).slice(0, 2)).forEach(function (value, i) {
      return el.setAttribute(attributes.circle[i], value);
    });
    return el;
  };
  var fromPoints = function fromPoints(a, b, c, d) {
    return [a, b, distance2$1([a, b], [c, d])];
  };
  var circle$1 = {
    circle: {
      args: function args(a, b, c, d) {
        var coords = coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1(a, b, c, d)));
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
    _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1(a, b))).slice(0, 2)).forEach(function (value, i) {
      return el.setAttribute(attributes.ellipse[i], value);
    });
    return el;
  };
  var ellipse$1 = {
    ellipse: {
      args: function args(a, b, c, d) {
        var coords = coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1(a, b, c, d))).slice(0, 4);
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
  var Args = function Args(a, b, c, d) {
    return coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1(a, b, c, d))).slice(0, 4);
  };
  var setPoints = function setPoints(element, a, b, c, d) {
    Args(a, b, c, d).forEach(function (value, i) {
      return element.setAttribute(attributes.line[i], value);
    });
    return element;
  };
  var line$2 = {
    line: {
      args: Args,
      methods: {
        setPoints: setPoints
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
    for (var _len8 = arguments.length, args = new Array(_len8 > 2 ? _len8 - 2 : 0), _key8 = 2; _key8 < _len8; _key8++) {
      args[_key8 - 2] = arguments[_key8];
    }
    el.setAttribute("d", "".concat(getD(el)).concat(command).concat(flatten_arrays$1.apply(void 0, args).join(" ")));
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
      for (var _len9 = arguments.length, args = new Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
        args[_key9 - 1] = arguments[_key9];
      }
      return appendPathCommand.apply(void 0, [el, key].concat(args));
    };
  });
  var path = {
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
    _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1(a, b))).slice(0, 2)).forEach(function (value, i) {
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
  var rect$1 = {
    rect: {
      args: function args(a, b, c, d) {
        var coords = coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1(a, b, c, d))).slice(0, 4);
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
  var style = {
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
  var text$1 = {
    text: {
      args: function args(a, b, c) {
        return coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1(a, b, c))).slice(0, 2);
      },
      init: function init(element, a, b, c, d) {
        var text = [a, b, c, d].filter(function (a) {
          return _typeof(a) === Keys.string;
        }).shift();
        if (text) {
          element.appendChild(win$1.document.createTextNode(text));
        }
      }
    }
  };
  var makeIDString = function makeIDString() {
    return Array.from(arguments).filter(function (a) {
      return _typeof(a) === Keys.string || a instanceof String;
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
    var attr = el.getAttribute("points");
    return attr == null ? "" : attr;
  };
  var polyString = function polyString() {
    var _arguments = arguments;
    return Array.from(Array(Math.floor(arguments.length / 2))).map(function (_, i) {
      return "".concat(_arguments[i * 2 + 0], ",").concat(_arguments[i * 2 + 1]);
    }).join(" ");
  };
  var stringifyArgs = function stringifyArgs() {
    return [polyString.apply(void 0, _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(flatten_arrays$1.apply(void 0, arguments)))))];
  };
  var setPoints$1 = function setPoints$1(element) {
    for (var _len10 = arguments.length, args = new Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
      args[_key10 - 1] = arguments[_key10];
    }
    element.setAttribute("points", stringifyArgs.apply(void 0, args)[0]);
    return element;
  };
  var addPoint = function addPoint(element) {
    for (var _len11 = arguments.length, args = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
      args[_key11 - 1] = arguments[_key11];
    }
    element.setAttribute("points", [getPoints(element), stringifyArgs.apply(void 0, args)[0]].filter(function (a) {
      return a !== "";
    }).join(" "));
    return element;
  };
  var Args$1 = function Args$1() {
    return arguments.length === 1 && _typeof(arguments.length <= 0 ? undefined : arguments[0]) === Keys.string ? [arguments.length <= 0 ? undefined : arguments[0]] : stringifyArgs.apply(void 0, arguments);
  };
  var polys = {
    polyline: {
      args: Args$1,
      methods: {
        setPoints: setPoints$1,
        addPoint: addPoint
      }
    },
    polygon: {
      args: Args$1,
      methods: {
        setPoints: setPoints$1,
        addPoint: addPoint
      }
    }
  };
  var Spec = Object.assign({}, svg, g, circle$1, ellipse$1, line$2, path, rect$1, style, text$1, maskTypes, polys);
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
  [[["svg", "defs", "g"].concat(NodeNames.v, NodeNames.t), ManyElements.presentation], [["filter"], ManyElements.effects], [NodeNames.cT.concat("text"), ManyElements.text], [NodeNames.cF, ManyElements.effects], [NodeNames.cG, ManyElements.gradient]].forEach(function (pair) {
    return pair[0].forEach(function (key) {
      attributes[key] = attributes[key].concat(pair[1]);
    });
  });
  var getClassList = function getClassList(element) {
    if (element == null) {
      return [];
    }
    var currentClass = element.getAttribute(Keys["class"]);
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
      element.setAttributeNS(null, Keys["class"], classes.join(" "));
    },
    removeClass: function removeClass(element, removedClass) {
      var classes = getClassList(element).filter(function (c) {
        return c !== removedClass;
      });
      element.setAttributeNS(null, Keys["class"], classes.join(" "));
    },
    setClass: function setClass(element, className) {
      element.setAttributeNS(null, Keys["class"], className);
    },
    setId: function setId(element, idName) {
      element.setAttributeNS(null, Keys.id, idName);
    }
  };
  var getAttr = function getAttr(element) {
    var t = element.getAttribute(Keys.transform);
    return t == null || t === "" ? undefined : t;
  };
  var methods$3 = {
    clearTransform: function clearTransform(el) {
      el.removeAttribute(Keys.transform);
      return el;
    }
  };
  ["translate", "rotate", "scale", "matrix"].forEach(function (key) {
    methods$3[key] = function (element) {
      for (var _len12 = arguments.length, args = new Array(_len12 > 1 ? _len12 - 1 : 0), _key12 = 1; _key12 < _len12; _key12++) {
        args[_key12 - 1] = arguments[_key12];
      }
      return element.setAttribute(Keys.transform, [getAttr(element), "".concat(key, "(").concat(args.join(" "), ")")].filter(function (a) {
        return a !== undefined;
      }).join(" "));
    };
  });
  var findIdURL = function findIdURL(arg) {
    if (arg == null) {
      return "";
    }
    if (_typeof(arg) === Keys.string) {
      return arg.slice(0, 3) === "url" ? arg : "url(#".concat(arg, ")");
    }
    if (arg.getAttribute != null) {
      var idString = arg.getAttribute(Keys.id);
      return "url(#".concat(idString, ")");
    }
    return "";
  };
  var methods$4 = {};
  ["clip-path", "mask", "symbol", "marker-end", "marker-mid", "marker-start"].forEach(function (attr) {
    methods$4[Case.toCamel(attr)] = function (element, parent) {
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
  var assign$2 = function assign(groups, Methods) {
    groups.forEach(function (n) {
      return Object.keys(Methods).forEach(function (method) {
        Nodes[n].methods[method] = function () {
          Methods[method].apply(Methods, arguments);
          return arguments[0];
        };
      });
    });
  };
  assign$2(flatten_arrays$1(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), classMethods);
  assign$2(flatten_arrays$1(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), dom);
  assign$2(flatten_arrays$1(NodeNames.v, NodeNames.g, NodeNames.s), methods$3);
  assign$2(flatten_arrays$1(NodeNames.t, NodeNames.v, NodeNames.g), methods$4);
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
    for (var _len13 = arguments.length, args = new Array(_len13 > 1 ? _len13 - 1 : 0), _key13 = 1; _key13 < _len13; _key13++) {
      args[_key13 - 1] = arguments[_key13];
    }
    var element = win$1.document.createElementNS(NS, Nodes[nodeName].nodeName);
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
    if (children[nodeName]) {
      children[nodeName].forEach(function (childNode) {
        Object.defineProperty(element, childNode, {
          value: function value() {
            var childElement = constructor.apply(void 0, [childNode].concat(Array.prototype.slice.call(arguments)));
            element.appendChild(childElement);
            return childElement;
          }
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
        for (var _len14 = arguments.length, args = new Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
          args[_key14] = arguments[_key14];
        }
        return constructor.apply(void 0, [nodeName].concat(args));
      };
    });
  });
  var Linker = function Linker(ear) {
    var svg = this;
    var keys = ["segment", "circle", "ellipse", "rect", "polygon"];
    keys.filter(function (key) {
      return ear[key] && ear[key].prototype;
    }).forEach(function (key) {
      ear[key].prototype.svg = function () {
        return svg.path(this.svgPath());
      };
    });
    ear.svg = svg;
  };
  var initialize = function initialize(svg) {
    for (var _len15 = arguments.length, args = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
      args[_key15 - 1] = arguments[_key15];
    }
    args.filter(function (arg) {
      return _typeof(arg) === Keys["function"];
    }).forEach(function (func) {
      return func.call(svg, svg);
    });
  };
  var SVG = function SVG() {
    var _arguments2 = arguments;
    var svg = constructor.apply(void 0, [Keys.svg].concat(Array.prototype.slice.call(arguments)));
    if (win$1.document.readyState === "loading") {
      win$1.document.addEventListener("DOMContentLoaded", function () {
        return initialize.apply(void 0, [svg].concat(_toConsumableArray(_arguments2)));
      });
    } else {
      initialize.apply(void 0, [svg].concat(Array.prototype.slice.call(arguments)));
    }
    return svg;
  };
  Object.assign(SVG, elements);
  SVG.NS = NS;
  SVG.linker = Linker.bind(SVG);
  SVG.core = Object.assign(Object.create(null), {
    load: Load,
    save: save,
    coordinates: coordinates,
    flatten: flatten_arrays$1,
    attributes: attributes,
    children: children,
    cdata: cdata,
    detect: detect
  }, Case, classMethods, dom, math$1, methods$3, viewBox$1);
  var possibleFoldObject = function possibleFoldObject(object) {
    if (_typeof(object) !== "object") {
      return false;
    }
    var foldKeys = ["vertices_coords", "edges_vertices", "faces_vertices", "faces_edges"];
    return Object.keys(object).map(function (key) {
      return foldKeys.includes(key);
    }).reduce(function (a, b) {
      return a || b;
    }, false);
  };
  var getFoldObject = function getFoldObject(array) {
    return array.filter(function (a) {
      return possibleFoldObject(a);
    }).shift();
  };
  SVG.use = function (library) {
    var oldInit = Nodes.svg.init;
    Nodes.svg.init = function (element) {
      for (var _len16 = arguments.length, args = new Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) {
        args[_key16 - 1] = arguments[_key16];
      }
      var fold_object = getFoldObject(args);
      if (fold_object) {
        var options = library.options.apply(library, args);
        library.render_into_svg(element, fold_object, options);
      }
      return oldInit.apply(void 0, [element].concat(args));
    };
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
  var vertices = "vertices";
  var edges = "edges";
  var faces = "faces";
  var boundaries = "boundaries";
  var boundary$1 = "boundary";
  var mountain = "mountain";
  var valley = "valley";
  var mark = "mark";
  var unassigned = "unassigned";
  var creasePattern = "creasePattern";
  var front = "front";
  var back = "back";
  var svg$1 = "svg";
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
  var vertices_coords = "vertices_coords";
  var edges_vertices = "edges_vertices";
  var faces_vertices = "faces_vertices";
  var faces_edges = "faces_edges";
  var edges_assignment = "edges_assignment";
  var faces_re_layer = "faces_re:layer";
  var frame_classes = "frame_classes";
  var file_classes = "file_classes";
  var foldedForm = "foldedForm";
  var isBrowser$2 = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== _undefined && _typeof(window.document) !== _undefined;
  var isNode$2 = (typeof process === "undefined" ? "undefined" : _typeof(process)) !== _undefined && process.versions != null && process.versions.node != null;
  var htmlString$2 = "<!DOCTYPE html><title>.</title>";
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
  var NS$1 = "http://www.w3.org/2000/svg";
  var g$1 = function g() {
    return win$2.document[createElementNS](NS$1, "g");
  };
  var defs = function defs() {
    return win$2.document[createElementNS](NS$1, "defs");
  };
  var style$1 = function style() {
    var s = win$2.document[createElementNS](NS$1, "style");
    s[setAttributeNS](null, "type", "text/css");
    return s;
  };
  var line$3 = function line(x1, y1, x2, y2) {
    var shape = win$2.document[createElementNS](NS$1, "line");
    shape[setAttributeNS](null, "x1", x1);
    shape[setAttributeNS](null, "y1", y1);
    shape[setAttributeNS](null, "x2", x2);
    shape[setAttributeNS](null, "y2", y2);
    return shape;
  };
  var circle$2 = function circle(x, y, radius) {
    var shape = win$2.document[createElementNS](NS$1, "circle");
    shape[setAttributeNS](null, "cx", x);
    shape[setAttributeNS](null, "cy", y);
    shape[setAttributeNS](null, "r", radius);
    return shape;
  };
  var polygon$1 = function polygon(pointsArray) {
    var shape = win$2.document[createElementNS](NS$1, "polygon");
    var pointsString = pointsArray.map(function (p) {
      return "".concat(p[0], ",").concat(p[1]);
    }).join(" ");
    shape[setAttributeNS](null, "points", pointsString);
    return shape;
  };
  var path$1 = function path(d) {
    var p = win$2.document[createElementNS](NS$1, "path");
    p[setAttributeNS](null, "d", d);
    return p;
  };
  var SVG$1 = {
    NS: NS$1,
    g: g$1,
    defs: defs,
    style: style$1,
    line: line$3,
    circle: circle$2,
    polygon: polygon$1,
    path: path$1
  };
  var libraries = {
    SVG: SVG$1
  };
  var linker = function linker(parent) {};
  var use$1 = function use(library) {
    if (library.NS) {
      libraries.SVG = library;
    }
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
  var recursive_assign = function recursive_assign(target, source) {
    Object.keys(source).forEach(function (key) {
      if (_typeof(source[key]) === object && source[key] !== null) {
        if (!(key in target)) {
          target[key] = {};
        }
        recursive_assign(target[key], source[key]);
      } else if (_typeof(target) === object && !(key in target)) {
        target[key] = source[key];
      }
    });
    return target;
  };
  var get_object = function get_object(input) {
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
        return {};
      }
    }
    return {};
  };
  var make_vertices_edges$1 = function make_vertices_edges(graph) {
    if (!graph[edges_vertices]) {
      return undefined;
    }
    var vertices_edges = [];
    graph[edges_vertices].forEach(function (ev, i) {
      return ev.forEach(function (v) {
        if (vertices_edges[v] === undefined) {
          vertices_edges[v] = [];
        }
        vertices_edges[v].push(i);
      });
    });
    return vertices_edges;
  };
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
  var get_boundary$1 = function get_boundary(graph) {
    if (graph[edges_assignment] == null) {
      return {
        vertices: [],
        edges: []
      };
    }
    var edges_vertices_b = graph[edges_assignment].map(function (a) {
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
        circle: {
          r: vmin / 200
        },
        boundaries: {
          fill: white
        },
        faces: {
          stroke: none,
          front: {
            fill: lightgray
          },
          back: {
            fill: white
          },
          foldedForm: {
            stroke: black
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
          fill: black
        }
      }
    });
  };
  var make_options = function make_options() {
    var graph = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var bounds = bounding_rect(graph);
    var vmin = Math.min(bounds[2], bounds[3]);
    recursive_assign(options, Options(vmin));
    if (options.shadows) {
      recursive_assign(options, {
        attributes: {
          faces: {
            front: {
              filter: "url(#shadow)"
            },
            back: {
              filter: "url(#shadow)"
            }
          }
        }
      });
    }
    return options;
  };
  var boundaries_polygon = function boundaries_polygon(graph) {
    if (vertices_coords in graph === false || edges_vertices in graph === false || edges_assignment in graph === false) {
      return [];
    }
    var boundary$1$1 = get_boundary$1(graph).vertices.map(function (v) {
      return [0, 1].map(function (i) {
        return graph[vertices_coords][v][i];
      });
    });
    if (boundary$1$1.length === 0) {
      return [];
    }
    var p = libraries.SVG.polygon(boundary$1$1);
    p[setAttributeNS](null, _class, boundary$1);
    return [p];
  };
  var vertices_circle = function vertices_circle(graph, options) {
    if (vertices_coords in graph === false) {
      return [];
    }
    var svg_vertices = graph[vertices_coords].map(function (v) {
      return libraries.SVG.circle(v[0], v[1], 0.01);
    });
    svg_vertices.forEach(function (c, i) {
      return c[setAttributeNS](null, index, i);
    });
    return svg_vertices;
  };
  var edges_assignment_names$1 = {
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
  var edges_coords = function edges_coords(graph) {
    if (graph[edges_vertices] == null || graph[vertices_coords] == null) {
      return [];
    }
    return graph[edges_vertices].map(function (ev) {
      return ev.map(function (v) {
        return graph[vertices_coords][v];
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
      return d === undefined ? [] : [libraries.SVG.path(d)];
    }
    var ds = edges_by_assignment_paths_data(graph);
    return Object.keys(ds).map(function (assignment) {
      var p = libraries.SVG.path(ds[assignment]);
      p[setAttributeNS](null, _class, edges_assignment_names$1[assignment]);
      return p;
    });
  };
  var edges_line = function edges_line(graph) {
    var lines = edges_coords(graph).map(function (e) {
      return libraries.SVG.line(e[0][0], e[0][1], e[1][0], e[1][1]);
    });
    lines.forEach(function (l, i) {
      return l[setAttributeNS](null, index, i);
    });
    make_edges_assignment_names(graph).forEach(function (a, i) {
      return lines[i][setAttributeNS](null, _class, a);
    });
    return lines;
  };
  var subtract = function subtract(v, u) {
    return v.map(function (n, i) {
      return n - (u[i] || 0);
    });
  };
  var cross2$1 = function cross2(a, b) {
    return a[0] * b[1] - a[1] * b[0];
  };
  var math$2 = {
    core: {
      subtract: subtract,
      cross2: cross2$1
    }
  };
  var get_faces_winding = function get_faces_winding(graph) {
    return graph.faces_vertices.map(function (fv) {
      return fv.map(function (v) {
        return graph.vertices_coords[v];
      }).map(function (c, i, arr) {
        return [c, arr[(i + 1) % arr.length], arr[(i + 2) % arr.length]];
      }).map(function (tri) {
        return math$2.core.cross2(math$2.core.subtract(tri[1], tri[0]), math$2.core.subtract(tri[2], tri[1]));
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    });
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
  var finalize_faces = function finalize_faces(graph, svg_faces) {
    var isFoldedForm = _typeof(graph.frame_classes) === object && graph.frame_classes !== null && !graph.frame_classes.includes(creasePattern);
    var orderIsCertain = graph[faces_re_layer] != null && graph[faces_re_layer].length === graph[faces_vertices].length;
    var classNames = [[front], [back]].map(function (arr) {
      if (isFoldedForm) {
        arr.push("foldedForm");
      }
      return arr;
    }).map(function (arr) {
      return arr.join(" ");
    });
    get_faces_winding(graph).map(function (c) {
      return c < 0 ? classNames[0] : classNames[1];
    }).forEach(function (className, i) {
      return svg_faces[i][setAttributeNS](null, _class, className);
    });
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
        return [0, 1].map(function (i) {
          return graph[vertices_coords][v][i];
        });
      });
    }).map(function (face) {
      return libraries.SVG.polygon(face);
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
        return [0, 1].map(function (i) {
          return graph[vertices_coords][v][i];
        });
      });
    }).map(function (face) {
      return libraries.SVG.polygon(face);
    });
    svg_faces.forEach(function (face, i) {
      return face[setAttributeNS](null, index, i);
    });
    return finalize_faces(graph, svg_faces);
  };
  var component_classes = {
    vertices: [],
    edges: [unassigned, mark, valley, mountain, boundary$1],
    faces: [front, back, foldedForm],
    boundaries: []
  };
  var style_component = function style_component(group, _ref, component) {
    var attributes = _ref.attributes;
    var classes = component_classes[component] || [];
    Array.from(group.childNodes).filter(function (child) {
      return attributes[child.nodeName];
    }).forEach(function (child) {
      return Object.keys(attributes[child.nodeName]).forEach(function (attr) {
        return child[setAttributeNS](null, attr, attributes[child.nodeName][attr]);
      });
    });
    Object.keys(attributes[component]).filter(function (key) {
      return !classes.includes(key);
    }).forEach(function (key) {
      return group[setAttributeNS](null, key, attributes[component][key]);
    });
    if (classes.length === 0) {
      return;
    }
    Array.from(group.childNodes).forEach(function (child) {
      return Object.keys(attributes[component][child.getAttribute(_class)] || {}).forEach(function (key) {
        return child[setAttributeNS](null, key, attributes[component][child.getAttribute(_class)][key]);
      });
    });
  };
  var faces_draw_function = function faces_draw_function(graph) {
    return graph[faces_vertices] != null ? faces_vertices_polygon(graph) : faces_edges_polygon(graph);
  };
  var draw_func = {
    vertices: vertices_circle,
    edges: edges_path,
    faces: faces_draw_function,
    boundaries: boundaries_polygon
  };
  var render_components = function render_components(graph) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!options.attributes) {
      options.attributes = {};
    }
    return [boundaries, faces, edges, vertices].filter(function (key) {
      return options[key] === true;
    }).map(function (key) {
      var group = libraries.SVG.g();
      group[setAttributeNS](null, _class, key);
      draw_func[key](graph, options).forEach(function (a) {
        return group[appendChild](a);
      });
      style_component(group, options, key);
      return group;
    }).filter(function (group) {
      return group.childNodes.length > 0;
    });
  };
  var document = win$2.document;
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
    var filter = document[createElementNS](libraries.SVG.NS, "filter");
    filter[setAttributeNS](null, "width", two_hundred);
    filter[setAttributeNS](null, "height", two_hundred);
    filter[setAttributeNS](null, "id", id_name);
    var gaussian = document[createElementNS](libraries.SVG.NS, "feGaussianBlur");
    gaussian[setAttributeNS](null, _in, "SourceAlpha");
    gaussian[setAttributeNS](null, "stdDeviation", options.blur);
    gaussian[setAttributeNS](null, result, blur);
    var offset = document[createElementNS](libraries.SVG.NS, "feOffset");
    offset[setAttributeNS](null, _in, blur);
    offset[setAttributeNS](null, result, offsetBlur);
    var flood = document[createElementNS](libraries.SVG.NS, "feFlood");
    flood[setAttributeNS](null, "flood-color", options.color);
    flood[setAttributeNS](null, "flood-opacity", options.opacity);
    flood[setAttributeNS](null, result, offsetColor);
    var composite = document[createElementNS](libraries.SVG.NS, "feComposite");
    composite[setAttributeNS](null, _in, offsetColor);
    composite[setAttributeNS](null, "in2", offsetBlur);
    composite[setAttributeNS](null, "operator", _in);
    composite[setAttributeNS](null, result, offsetBlur);
    var merge = document[createElementNS](libraries.SVG.NS, "feMerge");
    var mergeNode1 = document[createElementNS](libraries.SVG.NS, feMergeNode);
    var mergeNode2 = document[createElementNS](libraries.SVG.NS, feMergeNode);
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
  var make_defs = function make_defs(graph, options) {
    var bounds = bounding_rect(graph);
    var vmin = Math.min(bounds[2], bounds[3]);
    var defs = libraries.SVG.defs();
    if (options.stylesheet != null) {
      var _style = libraries.SVG.style();
      defs[appendChild](_style);
      var strokeVar = options.attributes.svg[stroke_width] ? options.attributes.svg[stroke_width] : vmin / 200;
      var cdata = new win$2.DOMParser().parseFromString("<xml></xml>", "application/xml").createCDATASection("\n* { --".concat(stroke_width, ": ").concat(strokeVar, "; }\n").concat(options.stylesheet));
      _style[appendChild](cdata);
    }
    if (options.shadows != null) {
      var shadowOptions = _typeof(options.shadows) === object && options.shadows !== null ? options.shadows : {
        blur: vmin / 200
      };
      defs[appendChild](shadowFilter(shadowOptions));
    }
    return options.stylesheet != null || options.shadows != null ? defs : undefined;
  };
  var graph_classes = function graph_classes(graph) {
    var file_classes$1 = (graph[file_classes] != null ? graph[file_classes] : []).join(" ");
    var frame_classes$1 = (graph[frame_classes] != null ? graph[frame_classes] : []).join(" ");
    return [file_classes$1, frame_classes$1].filter(function (s) {
      return s !== "";
    }).join(" ");
  };
  var makeViewBox = function makeViewBox(x, y, width, height) {
    var padding = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var scale = 1.0;
    var d = width / scale - width;
    var X = x - d - padding;
    var Y = y - d - padding;
    var W = width + d * 2 + padding * 2;
    var H = height + d * 2 + padding * 2;
    return [X, Y, W, H].join(" ");
  };
  var make_svg_attributes = function make_svg_attributes(graph, options) {
    var bounds = bounding_rect(graph);
    var vmin = Math.min(bounds[2], bounds[3]);
    var attributes = {
      viewBox: makeViewBox.apply(void 0, _toConsumableArray(bounds).concat([options.padding]))
    };
    var classValue = graph_classes(graph);
    if (classValue !== "") {
      attributes[_class] = classValue;
    }
    Object.assign(attributes, options.attributes.svg);
    return attributes;
  };
  var render_into_svg = function render_into_svg(svg) {
    var graph = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    make_options(graph, options);
    var defs = make_defs(graph, options);
    if (defs) {
      svg[appendChild](defs);
    }
    render_components(graph, options).forEach(function (group) {
      return svg[appendChild](group);
    });
    var attrs = make_svg_attributes(graph, options);
    Object.keys(attrs).forEach(function (attr) {
      return svg[setAttributeNS](null, attr, attrs[attr]);
    });
    return svg;
  };
  var svg$1$1 = function svg$1$1() {
    var svgImage = win$2.document[createElementNS](libraries.SVG.NS, svg$1);
    svgImage.setAttribute("version", "1.1");
    svgImage.setAttribute("xmlns", libraries.SVG.NS);
    return svgImage;
  };
  var FoldToSvg = function FoldToSvg(arg) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var graph = get_object(arg);
    make_options(graph, options);
    var element = render_into_svg(svg$1$1(), graph, options);
    if (options.output === svg$1) {
      return element;
    }
    var stringified = new win$2.XMLSerializer().serializeToString(element);
    var beautified = vkXML$1(stringified);
    return beautified;
  };
  Object.assign(FoldToSvg, {
    render_into_svg: render_into_svg,
    render_components: render_components,
    options: make_options,
    boundaries_polygon: boundaries_polygon,
    vertices_circle: vertices_circle,
    edges_path_data: edges_path_data,
    edges_by_assignment_paths_data: edges_by_assignment_paths_data,
    edges_path: edges_path,
    edges_line: edges_line,
    faces_vertices_polygon: faces_vertices_polygon,
    faces_edges_polygon: faces_edges_polygon,
    linker: linker.bind(FoldToSvg),
    use: use$1
  });

  var ConstructorPrototypes = {
    graph: GraphProto$1,
    cp: CreasePatternProto$1
  };
  Object.keys(ConstructorPrototypes).forEach(function (name) {
    Constructors$1[name] = function () {
      return Object.assign.apply(Object, [Object.create(ConstructorPrototypes[name])].concat(_toConsumableArray(Array.from(arguments).filter(function (a) {
        return fold_object_certainty(a);
      }).map(function (obj) {
        return JSON.parse(JSON.stringify(obj));
      })), [
      {
        file_spec: file_spec,
        file_creator: file_creator
      }]));
    };
    Constructors$1[name].prototype = ConstructorPrototypes[name];
    Constructors$1[name].prototype.constructor = Constructors$1[name];
    Object.keys(Create).forEach(function (funcName) {
      Constructors$1[name][funcName] = function () {
        return Constructors$1[name](Create[funcName].apply(Create, arguments));
      };
    });
  });
  Object.assign(Constructors$1.graph, graph_methods);
  var Ear = Object.assign(root, Constructors$1, {
    math: math.core,
    axiom: axiom,
    diagram: diagram,
    text: text,
    webgl: foldToThree
  });
  Object.defineProperty(Ear, "use", {
    enumerable: false,
    value: use.bind(Ear)
  });
  Object.keys(math).filter(function (key) {
    return key !== "core";
  }).forEach(function (key) {
    Ear[key] = math[key];
  });
  SVG.use(FoldToSvg);
  FoldToSvg.use(SVG);
  Ear.use(SVG);
  Ear.use(FoldToSvg);

  return Ear;

})));
