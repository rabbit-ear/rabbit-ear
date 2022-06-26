/* Rabbit Ear 0.9.xx alpha 2022-05-13 (c) Kraft, MIT License */

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

  var _undefined = "undefined";
  var _number = "number";
  var _object = "object";
  var _class = "class";
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
  var _faces_layer = "faces_layer";
  var _boundary = "boundary";
  var _front = "front";
  var _back = "back";
  var _foldedForm = "foldedForm";
  var _black = "black";
  var _white = "white";
  var _none = "none";

  var isBrowser$1 = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== _undefined && _typeof(window.document) !== _undefined;
  (typeof process === "undefined" ? "undefined" : _typeof(process)) !== _undefined && process.versions != null && process.versions.node != null;
  var isWebWorker = (typeof self === "undefined" ? "undefined" : _typeof(self)) === _object && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";

  var errorMessages = [];
  errorMessages[10] = "\"error 010: window\" not set. if using node/deno, include package @xmldom/xmldom, set to the main export ( ear.window = xmldom; )";

  var windowContainer = {
    window: undefined
  };
  var buildDocument = function buildDocument(newWindow) {
    return new newWindow.DOMParser().parseFromString("<!DOCTYPE html><title>.</title>", "text/html");
  };
  var setWindow$1 = function setWindow(newWindow) {
    if (!newWindow.document) {
      newWindow.document = buildDocument(newWindow);
    }
    windowContainer.window = newWindow;
    return windowContainer.window;
  };
  if (isBrowser$1) {
    windowContainer.window = window;
  }
  var RabbitEarWindow = function RabbitEarWindow() {
    if (windowContainer.window === undefined) {
      throw errorMessages[10];
    }
    return windowContainer.window;
  };

  var root = Object.create(null);

  var typeOf = function typeOf(obj) {
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
  var cleanNumber = function cleanNumber(num) {
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
  var isIterable = function isIterable(obj) {
    return obj != null && typeof obj[Symbol.iterator] === "function";
  };
  var semiFlattenArrays = function semiFlattenArrays() {
    switch (arguments.length) {
      case undefined:
      case 0:
        return Array.from(arguments);
      case 1:
        return isIterable(arguments[0]) && typeof arguments[0] !== "string" ? semiFlattenArrays.apply(void 0, _toConsumableArray(arguments[0])) : [arguments[0]];
      default:
        return Array.from(arguments).map(function (a) {
          return isIterable(a) ? _toConsumableArray(semiFlattenArrays(a)) : a;
        });
    }
  };
  var flattenArrays = function flattenArrays() {
    switch (arguments.length) {
      case undefined:
      case 0:
        return Array.from(arguments);
      case 1:
        return isIterable(arguments[0]) && typeof arguments[0] !== "string" ? flattenArrays.apply(void 0, _toConsumableArray(arguments[0])) : [arguments[0]];
      default:
        return Array.from(arguments).map(function (a) {
          return isIterable(a) ? _toConsumableArray(flattenArrays(a)) : a;
        }).reduce(function (a, b) {
          return a.concat(b);
        }, []);
    }
  };
  var resizers = Object.freeze({
    __proto__: null,
    resize: resize,
    resizeUp: resizeUp,
    resizeDown: resizeDown,
    cleanNumber: cleanNumber,
    semiFlattenArrays: semiFlattenArrays,
    flattenArrays: flattenArrays
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
  var fnTrue = function fnTrue() {
    return true;
  };
  var fnSquare = function fnSquare(n) {
    return n * n;
  };
  var fnAdd = function fnAdd(a, b) {
    return a + (b || 0);
  };
  var fnNotUndefined = function fnNotUndefined(a) {
    return a !== undefined;
  };
  var fnAnd = function fnAnd(a, b) {
    return a && b;
  };
  var fnCat = function fnCat(a, b) {
    return a.concat(b);
  };
  var fnVec2Angle = function fnVec2Angle(v) {
    return Math.atan2(v[1], v[0]);
  };
  var fnToVec2 = function fnToVec2(a) {
    return [Math.cos(a), Math.sin(a)];
  };
  var fnEqual = function fnEqual(a, b) {
    return a === b;
  };
  var fnEpsilonEqual = function fnEpsilonEqual(a, b) {
    return Math.abs(a - b) < EPSILON;
  };
  var fnEpsilonEqualVectors = function fnEpsilonEqualVectors(a, b) {
    for (var i = 0; i < Math.max(a.length, b.length); i++) {
      if (!fnEpsilonEqual(a[i] || 0, b[i] || 0)) {
        return false;
      }
    }
    return true;
  };
  var include = function include(n) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return n > -epsilon;
  };
  var exclude = function exclude(n) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return n > epsilon;
  };
  var includeL$1 = fnTrue;
  var excludeL = fnTrue;
  var includeR = include;
  var excludeR = exclude;
  var includeS = function includeS(t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return t > -e && t < 1 + e;
  };
  var excludeS = function excludeS(t) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : EPSILON;
    return t > e && t < 1 - e;
  };
  var lineLimiter = function lineLimiter(dist) {
    return dist;
  };
  var rayLimiter = function rayLimiter(dist) {
    return dist < -EPSILON ? 0 : dist;
  };
  var segmentLimiter = function segmentLimiter(dist) {
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
    fnTrue: fnTrue,
    fnSquare: fnSquare,
    fnAdd: fnAdd,
    fnNotUndefined: fnNotUndefined,
    fnAnd: fnAnd,
    fnCat: fnCat,
    fnVec2Angle: fnVec2Angle,
    fnToVec2: fnToVec2,
    fnEqual: fnEqual,
    fnEpsilonEqual: fnEpsilonEqual,
    fnEpsilonEqualVectors: fnEpsilonEqualVectors,
    include: include,
    exclude: exclude,
    includeL: includeL$1,
    excludeL: excludeL,
    includeR: includeR,
    excludeR: excludeR,
    includeS: includeS,
    excludeS: excludeS,
    lineLimiter: lineLimiter,
    rayLimiter: rayLimiter,
    segmentLimiter: segmentLimiter
  });
  var Constructors = Object.create(null);
  var identity2x2 = [1, 0, 0, 1];
  var identity2x3 = identity2x2.concat(0, 0);
  var multiplyMatrix2Vector2 = function multiplyMatrix2Vector2(matrix, vector) {
    return [matrix[0] * vector[0] + matrix[2] * vector[1] + matrix[4], matrix[1] * vector[0] + matrix[3] * vector[1] + matrix[5]];
  };
  var multiplyMatrix2Line2 = function multiplyMatrix2Line2(matrix, vector, origin) {
    return {
      vector: [matrix[0] * vector[0] + matrix[2] * vector[1], matrix[1] * vector[0] + matrix[3] * vector[1]],
      origin: [matrix[0] * origin[0] + matrix[2] * origin[1] + matrix[4], matrix[1] * origin[0] + matrix[3] * origin[1] + matrix[5]]
    };
  };
  var multiplyMatrices2 = function multiplyMatrices2(m1, m2) {
    return [m1[0] * m2[0] + m1[2] * m2[1], m1[1] * m2[0] + m1[3] * m2[1], m1[0] * m2[2] + m1[2] * m2[3], m1[1] * m2[2] + m1[3] * m2[3], m1[0] * m2[4] + m1[2] * m2[5] + m1[4], m1[1] * m2[4] + m1[3] * m2[5] + m1[5]];
  };
  var determinant2 = function determinant2(m) {
    return m[0] * m[3] - m[1] * m[2];
  };
  var invertMatrix2 = function invertMatrix2(m) {
    var det = determinant2(m);
    if (Math.abs(det) < 1e-6 || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
      return undefined;
    }
    return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
  };
  var makeMatrix2Translate = function makeMatrix2Translate() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return identity2x2.concat(x, y);
  };
  var makeMatrix2Scale = function makeMatrix2Scale(x, y) {
    var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [0, 0];
    return [x, 0, 0, y, x * -origin[0] + origin[0], y * -origin[1] + origin[1]];
  };
  var makeMatrix2Rotate = function makeMatrix2Rotate(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0];
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    return [cos, sin, -sin, cos, origin[0], origin[1]];
  };
  var makeMatrix2Reflect = function makeMatrix2Reflect(vector) {
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
    multiplyMatrix2Vector2: multiplyMatrix2Vector2,
    multiplyMatrix2Line2: multiplyMatrix2Line2,
    multiplyMatrices2: multiplyMatrices2,
    determinant2: determinant2,
    invertMatrix2: invertMatrix2,
    makeMatrix2Translate: makeMatrix2Translate,
    makeMatrix2Scale: makeMatrix2Scale,
    makeMatrix2Rotate: makeMatrix2Rotate,
    makeMatrix2Reflect: makeMatrix2Reflect
  });
  var _magnitude = function magnitude(v) {
    return Math.sqrt(v.map(fnSquare).reduce(fnAdd, 0));
  };
  var magnitude2 = function magnitude2(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  };
  var magSquared = function magSquared(v) {
    return v.map(fnSquare).reduce(fnAdd, 0);
  };
  var _normalize = function normalize(v) {
    var m = _magnitude(v);
    return m === 0 ? v : v.map(function (c) {
      return c / m;
    });
  };
  var normalize2 = function normalize2(v) {
    var m = magnitude2(v);
    return m === 0 ? v : [v[0] / m, v[1] / m];
  };
  var _scale = function scale(v, s) {
    return v.map(function (n) {
      return n * s;
    });
  };
  var scale2 = function scale2(v, s) {
    return [v[0] * s, v[1] * s];
  };
  var _add = function add(v, u) {
    return v.map(function (n, i) {
      return n + (u[i] || 0);
    });
  };
  var add2 = function add2(v, u) {
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
    }).reduce(fnAdd, 0);
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
    return scale2(add2(v, u), 0.5);
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
    }).reduce(fnAdd, 0));
  };
  var distance2 = function distance2(v, u) {
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
    }).reduce(fnAdd, 0) < epsilon;
  };
  var parallel = function parallel(v, u) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return 1 - Math.abs(_dot(_normalize(v), _normalize(u))) < epsilon;
  };
  var parallel2 = function parallel2(v, u) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : EPSILON;
    return Math.abs(cross2(v, u)) < epsilon;
  };
  var algebra = Object.freeze({
    __proto__: null,
    magnitude: _magnitude,
    magnitude2: magnitude2,
    magSquared: magSquared,
    normalize: _normalize,
    normalize2: normalize2,
    scale: _scale,
    scale2: scale2,
    add: _add,
    add2: add2,
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
    distance2: distance2,
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
  var isIdentity3x4 = function isIdentity3x4(m) {
    return identity3x4.map(function (n, i) {
      return Math.abs(n - m[i]) < EPSILON;
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };
  var multiplyMatrix3Vector3 = function multiplyMatrix3Vector3(m, vector) {
    return [m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2] + m[9], m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2] + m[10], m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2] + m[11]];
  };
  var multiplyMatrix3Line3 = function multiplyMatrix3Line3(m, vector, origin) {
    return {
      vector: [m[0] * vector[0] + m[3] * vector[1] + m[6] * vector[2], m[1] * vector[0] + m[4] * vector[1] + m[7] * vector[2], m[2] * vector[0] + m[5] * vector[1] + m[8] * vector[2]],
      origin: [m[0] * origin[0] + m[3] * origin[1] + m[6] * origin[2] + m[9], m[1] * origin[0] + m[4] * origin[1] + m[7] * origin[2] + m[10], m[2] * origin[0] + m[5] * origin[1] + m[8] * origin[2] + m[11]]
    };
  };
  var multiplyMatrices3 = function multiplyMatrices3(m1, m2) {
    return [m1[0] * m2[0] + m1[3] * m2[1] + m1[6] * m2[2], m1[1] * m2[0] + m1[4] * m2[1] + m1[7] * m2[2], m1[2] * m2[0] + m1[5] * m2[1] + m1[8] * m2[2], m1[0] * m2[3] + m1[3] * m2[4] + m1[6] * m2[5], m1[1] * m2[3] + m1[4] * m2[4] + m1[7] * m2[5], m1[2] * m2[3] + m1[5] * m2[4] + m1[8] * m2[5], m1[0] * m2[6] + m1[3] * m2[7] + m1[6] * m2[8], m1[1] * m2[6] + m1[4] * m2[7] + m1[7] * m2[8], m1[2] * m2[6] + m1[5] * m2[7] + m1[8] * m2[8], m1[0] * m2[9] + m1[3] * m2[10] + m1[6] * m2[11] + m1[9], m1[1] * m2[9] + m1[4] * m2[10] + m1[7] * m2[11] + m1[10], m1[2] * m2[9] + m1[5] * m2[10] + m1[8] * m2[11] + m1[11]];
  };
  var determinant3 = function determinant3(m) {
    return m[0] * m[4] * m[8] - m[0] * m[7] * m[5] - m[3] * m[1] * m[8] + m[3] * m[7] * m[2] + m[6] * m[1] * m[5] - m[6] * m[4] * m[2];
  };
  var invertMatrix3 = function invertMatrix3(m) {
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
  var makeMatrix3Translate = function makeMatrix3Translate() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var z = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return identity3x3.concat(x, y, z);
  };
  var singleAxisRotate = function singleAxisRotate(angle, origin, i0, i1, sgn) {
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
  var makeMatrix3RotateX = function makeMatrix3RotateX(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    return singleAxisRotate(angle, origin, 1, 2, true);
  };
  var makeMatrix3RotateY = function makeMatrix3RotateY(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    return singleAxisRotate(angle, origin, 0, 2, false);
  };
  var makeMatrix3RotateZ = function makeMatrix3RotateZ(angle) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    return singleAxisRotate(angle, origin, 0, 1, true);
  };
  var makeMatrix3Rotate = function makeMatrix3Rotate(angle) {
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
    return multiplyMatrices3(trans_inv, multiplyMatrices3([t * x * x + c, t * y * x + z * s, t * z * x - y * s, t * x * y - z * s, t * y * y + c, t * z * y + x * s, t * x * z + y * s, t * y * z - x * s, t * z * z + c, 0, 0, 0], trans));
  };
  var makeMatrix3Scale = function makeMatrix3Scale() {
    var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0, 0, 0];
    return [scale, 0, 0, 0, scale, 0, 0, 0, scale, scale * -origin[0] + origin[0], scale * -origin[1] + origin[1], scale * -origin[2] + origin[2]];
  };
  var makeMatrix3ReflectZ = function makeMatrix3ReflectZ(vector) {
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
    isIdentity3x4: isIdentity3x4,
    multiplyMatrix3Vector3: multiplyMatrix3Vector3,
    multiplyMatrix3Line3: multiplyMatrix3Line3,
    multiplyMatrices3: multiplyMatrices3,
    determinant3: determinant3,
    invertMatrix3: invertMatrix3,
    makeMatrix3Translate: makeMatrix3Translate,
    makeMatrix3RotateX: makeMatrix3RotateX,
    makeMatrix3RotateY: makeMatrix3RotateY,
    makeMatrix3RotateZ: makeMatrix3RotateZ,
    makeMatrix3Rotate: makeMatrix3Rotate,
    makeMatrix3Scale: makeMatrix3Scale,
    makeMatrix3ReflectZ: makeMatrix3ReflectZ
  });
  var vectorOriginForm = function vectorOriginForm(vector, origin) {
    return {
      vector: vector || [],
      origin: origin || []
    };
  };
  var getVector = function getVector() {
    if (arguments[0] instanceof Constructors.vector) {
      return arguments[0];
    }
    var list = flattenArrays(arguments);
    if (list.length > 0 && _typeof(list[0]) === "object" && list[0] !== null && !isNaN(list[0].x)) {
      list = ["x", "y", "z"].map(function (c) {
        return list[0][c];
      }).filter(fnNotUndefined);
    }
    return list.filter(function (n) {
      return typeof n === "number";
    });
  };
  var getVectorOfVectors = function getVectorOfVectors() {
    return semiFlattenArrays(arguments).map(function (el) {
      return getVector(el);
    });
  };
  var getSegment = function getSegment() {
    if (arguments[0] instanceof Constructors.segment) {
      return arguments[0];
    }
    var args = semiFlattenArrays(arguments);
    if (args.length === 4) {
      return [[args[0], args[1]], [args[2], args[3]]];
    }
    return args.map(function (el) {
      return getVector(el);
    });
  };
  var getLine$1 = function getLine() {
    var args = semiFlattenArrays(arguments);
    if (args.length === 0) {
      return vectorOriginForm([], []);
    }
    if (args[0] instanceof Constructors.line || args[0] instanceof Constructors.ray || args[0] instanceof Constructors.segment) {
      return args[0];
    }
    if (args[0].constructor === Object && args[0].vector !== undefined) {
      return vectorOriginForm(args[0].vector || [], args[0].origin || []);
    }
    return typeof args[0] === "number" ? vectorOriginForm(getVector(args)) : vectorOriginForm.apply(void 0, _toConsumableArray(args.map(function (a) {
      return getVector(a);
    })));
  };
  var getRay = getLine$1;
  var getRectParams = function getRectParams() {
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
  var getRect = function getRect() {
    if (arguments[0] instanceof Constructors.rect) {
      return arguments[0];
    }
    var list = flattenArrays(arguments);
    if (list.length > 0 && _typeof(list[0]) === "object" && list[0] !== null && !isNaN(list[0].width)) {
      return getRectParams.apply(void 0, _toConsumableArray(["x", "y", "width", "height"].map(function (c) {
        return list[0][c];
      }).filter(fnNotUndefined)));
    }
    var numbers = list.filter(function (n) {
      return typeof n === "number";
    });
    var rect_params = numbers.length < 4 ? [,,].concat(_toConsumableArray(numbers)) : numbers;
    return getRectParams.apply(void 0, _toConsumableArray(rect_params));
  };
  var getCircleParams = function getCircleParams() {
    var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return {
      radius: radius,
      origin: [].concat(args)
    };
  };
  var getCircle = function getCircle() {
    if (arguments[0] instanceof Constructors.circle) {
      return arguments[0];
    }
    var vectors = getVectorOfVectors(arguments);
    var numbers = flattenArrays(arguments).filter(function (a) {
      return typeof a === "number";
    });
    if (arguments.length === 2) {
      if (vectors[1].length === 1) {
        return getCircleParams.apply(void 0, [vectors[1][0]].concat(_toConsumableArray(vectors[0])));
      } else if (vectors[0].length === 1) {
        return getCircleParams.apply(void 0, [vectors[0][0]].concat(_toConsumableArray(vectors[1])));
      } else if (vectors[0].length > 1 && vectors[1].length > 1) {
        return getCircleParams.apply(void 0, [distance2.apply(void 0, _toConsumableArray(vectors))].concat(_toConsumableArray(vectors[0])));
      }
    } else {
      switch (numbers.length) {
        case 0:
          return getCircleParams(1, 0, 0, 0);
        case 1:
          return getCircleParams(numbers[0], 0, 0, 0);
        default:
          return getCircleParams.apply(void 0, [numbers.pop()].concat(_toConsumableArray(numbers)));
      }
    }
    return getCircleParams(1, 0, 0, 0);
  };
  var maps_3x4 = [[0, 1, 3, 4, 9, 10], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], [0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11]];
  [11, 7, 3].forEach(function (i) {
    return delete maps_3x4[2][i];
  });
  var matrixMap3x4 = function matrixMap3x4(len) {
    var i;
    if (len < 8) i = 0;else if (len < 13) i = 1;else i = 2;
    return maps_3x4[i];
  };
  var getMatrix3x4 = function getMatrix3x4() {
    var mat = flattenArrays(arguments);
    var matrix = _toConsumableArray(identity3x4);
    matrixMap3x4(mat.length)
    .forEach(function (n, i) {
      if (mat[i] != null) {
        matrix[n] = mat[i];
      }
    });
    return matrix;
  };
  var getters = Object.freeze({
    __proto__: null,
    getVector: getVector,
    getVectorOfVectors: getVectorOfVectors,
    getSegment: getSegment,
    getLine: getLine$1,
    getRay: getRay,
    getRectParams: getRectParams,
    getRect: getRect,
    getCircle: getCircle,
    getMatrix3x4: getMatrix3x4
  });
  var equal = Object.freeze({
    __proto__: null
  });
  var sortPointsAlongVector2 = function sortPointsAlongVector2(points, vector) {
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
    sortPointsAlongVector2: sortPointsAlongVector2
  });
  var smallestComparisonSearch = function smallestComparisonSearch(obj, array, compare_func) {
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
  var nearestPoint2 = function nearestPoint2(point, array_of_points) {
    var index = smallestComparisonSearch(point, array_of_points, distance2);
    return index === undefined ? undefined : array_of_points[index];
  };
  var nearestPoint = function nearestPoint(point, array_of_points) {
    var index = smallestComparisonSearch(point, array_of_points, distance);
    return index === undefined ? undefined : array_of_points[index];
  };
  var nearestPointOnLine = function nearestPointOnLine(vector, origin, point, limiterFunc) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    origin = resize(vector.length, origin);
    point = resize(vector.length, point);
    var magSq = magSquared(vector);
    var vectorToPoint = _subtract(point, origin);
    var dotProd = _dot(vector, vectorToPoint);
    var dist = dotProd / magSq;
    var d = limiterFunc(dist, epsilon);
    return _add(origin, _scale(vector, d));
  };
  var nearestPointOnPolygon = function nearestPointOnPolygon(polygon, point) {
    var v = polygon.map(function (p, i, arr) {
      return _subtract(arr[(i + 1) % arr.length], p);
    });
    return polygon.map(function (p, i) {
      return nearestPointOnLine(v[i], p, point, segmentLimiter);
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
  var nearestPointOnCircle = function nearestPointOnCircle(radius, origin, point) {
    return _add(origin, _scale(_normalize(_subtract(point, origin)), radius));
  };
  var nearest$1 = Object.freeze({
    __proto__: null,
    smallestComparisonSearch: smallestComparisonSearch,
    nearestPoint2: nearestPoint2,
    nearestPoint: nearestPoint,
    nearestPointOnLine: nearestPointOnLine,
    nearestPointOnPolygon: nearestPointOnPolygon,
    nearestPointOnCircle: nearestPointOnCircle
  });
  var isCounterClockwiseBetween = function isCounterClockwiseBetween(angle, floor, ceiling) {
    while (ceiling < floor) {
      ceiling += TWO_PI;
    }
    while (angle > floor) {
      angle -= TWO_PI;
    }
    while (angle < floor) {
      angle += TWO_PI;
    }
    return angle < ceiling;
  };
  var clockwiseAngleRadians = function clockwiseAngleRadians(a, b) {
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
  var counterClockwiseAngleRadians = function counterClockwiseAngleRadians(a, b) {
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
  var clockwiseAngle2 = function clockwiseAngle2(a, b) {
    var dotProduct = b[0] * a[0] + b[1] * a[1];
    var determinant = b[0] * a[1] - b[1] * a[0];
    var angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) {
      angle += TWO_PI;
    }
    return angle;
  };
  var counterClockwiseAngle2 = function counterClockwiseAngle2(a, b) {
    var dotProduct = a[0] * b[0] + a[1] * b[1];
    var determinant = a[0] * b[1] - a[1] * b[0];
    var angle = Math.atan2(determinant, dotProduct);
    if (angle < 0) {
      angle += TWO_PI;
    }
    return angle;
  };
  var clockwiseBisect2 = function clockwiseBisect2(a, b) {
    return fnToVec2(fnVec2Angle(a) - clockwiseAngle2(a, b) / 2);
  };
  var counterClockwiseBisect2 = function counterClockwiseBisect2(a, b) {
    return fnToVec2(fnVec2Angle(a) + counterClockwiseAngle2(a, b) / 2);
  };
  var clockwiseSubsectRadians = function clockwiseSubsectRadians(divisions, angleA, angleB) {
    var angle = clockwiseAngleRadians(angleA, angleB) / divisions;
    return Array.from(Array(divisions - 1)).map(function (_, i) {
      return angleA + angle * (i + 1);
    });
  };
  var counterClockwiseSubsectRadians = function counterClockwiseSubsectRadians(divisions, angleA, angleB) {
    var angle = counterClockwiseAngleRadians(angleA, angleB) / divisions;
    return Array.from(Array(divisions - 1)).map(function (_, i) {
      return angleA + angle * (i + 1);
    });
  };
  var clockwiseSubsect2 = function clockwiseSubsect2(divisions, vectorA, vectorB) {
    var angleA = Math.atan2(vectorA[1], vectorA[0]);
    var angleB = Math.atan2(vectorB[1], vectorB[0]);
    return clockwiseSubsectRadians(divisions, angleA, angleB).map(fnToVec2);
  };
  var counterClockwiseSubsect2 = function counterClockwiseSubsect2(divisions, vectorA, vectorB) {
    var angleA = Math.atan2(vectorA[1], vectorA[0]);
    var angleB = Math.atan2(vectorB[1], vectorB[0]);
    return counterClockwiseSubsectRadians(divisions, angleA, angleB).map(fnToVec2);
  };
  var bisectLines2 = function bisectLines2(vectorA, originA, vectorB, originB) {
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var determinant = cross2(vectorA, vectorB);
    var dotProd = _dot(vectorA, vectorB);
    var bisects = determinant > -epsilon ? [counterClockwiseBisect2(vectorA, vectorB)] : [clockwiseBisect2(vectorA, vectorB)];
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
  var counterClockwiseOrderRadians = function counterClockwiseOrderRadians() {
    var radians = Array.from(arguments).flat();
    var counter_clockwise = radians.map(function (_, i) {
      return i;
    }).sort(function (a, b) {
      return radians[a] - radians[b];
    });
    return counter_clockwise.slice(counter_clockwise.indexOf(0), counter_clockwise.length).concat(counter_clockwise.slice(0, counter_clockwise.indexOf(0)));
  };
  var counterClockwiseOrder2 = function counterClockwiseOrder2() {
    return counterClockwiseOrderRadians(semiFlattenArrays(arguments).map(fnVec2Angle));
  };
  var counterClockwiseSectorsRadians = function counterClockwiseSectorsRadians() {
    var radians = Array.from(arguments).flat();
    var ordered = counterClockwiseOrderRadians(radians).map(function (i) {
      return radians[i];
    });
    return ordered.map(function (rad, i, arr) {
      return [rad, arr[(i + 1) % arr.length]];
    }).map(function (pair) {
      return counterClockwiseAngleRadians(pair[0], pair[1]);
    });
  };
  var counterClockwiseSectors2 = function counterClockwiseSectors2() {
    return counterClockwiseSectorsRadians(getVectorOfVectors(arguments).map(fnVec2Angle));
  };
  var radial = Object.freeze({
    __proto__: null,
    isCounterClockwiseBetween: isCounterClockwiseBetween,
    clockwiseAngleRadians: clockwiseAngleRadians,
    counterClockwiseAngleRadians: counterClockwiseAngleRadians,
    clockwiseAngle2: clockwiseAngle2,
    counterClockwiseAngle2: counterClockwiseAngle2,
    clockwiseBisect2: clockwiseBisect2,
    counterClockwiseBisect2: counterClockwiseBisect2,
    clockwiseSubsectRadians: clockwiseSubsectRadians,
    counterClockwiseSubsectRadians: counterClockwiseSubsectRadians,
    clockwiseSubsect2: clockwiseSubsect2,
    counterClockwiseSubsect2: counterClockwiseSubsect2,
    bisectLines2: bisectLines2,
    counterClockwiseOrderRadians: counterClockwiseOrderRadians,
    counterClockwiseOrder2: counterClockwiseOrder2,
    counterClockwiseSectorsRadians: counterClockwiseSectorsRadians,
    counterClockwiseSectors2: counterClockwiseSectors2
  });
  var overlapLinePoint = function overlapLinePoint(vector, origin, point) {
    var func = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : excludeL;
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    var p2p = _subtract(point, origin);
    var lineMagSq = magSquared(vector);
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
  var intersectLineLine = function intersectLineLine(aVector, aOrigin, bVector, bOrigin) {
    var aFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : includeL$1;
    var bFunction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : includeL$1;
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
  var signedArea = function signedArea(points) {
    return 0.5 * points.map(function (el, i, arr) {
      var next = arr[(i + 1) % arr.length];
      return el[0] * next[1] - next[0] * el[1];
    }).reduce(fnAdd, 0);
  };
  var _centroid = function centroid(points) {
    var sixthArea = 1 / (6 * signedArea(points));
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
  var _boundingBox = function boundingBox(points) {
    var padding = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var min = Array(points[0].length).fill(Infinity);
    var max = Array(points[0].length).fill(-Infinity);
    points.forEach(function (point) {
      return point.forEach(function (c, i) {
        if (c < min[i]) {
          min[i] = c - padding;
        }
        if (c > max[i]) {
          max[i] = c + padding;
        }
      });
    });
    var span = max.map(function (max, i) {
      return max - min[i];
    });
    return {
      min: min,
      max: max,
      span: span
    };
  };
  var angleArray = function angleArray(count) {
    return Array.from(Array(Math.floor(count))).map(function (_, i) {
      return TWO_PI * (i / count);
    });
  };
  var anglesToVecs = function anglesToVecs(angles, radius) {
    return angles.map(function (a) {
      return [radius * Math.cos(a), radius * Math.sin(a)];
    }).map(function (pt) {
      return pt.map(function (n) {
        return cleanNumber(n, 14);
      });
    });
  };
  var makePolygonCircumradius = function makePolygonCircumradius() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return anglesToVecs(angleArray(sides), radius);
  };
  var makePolygonCircumradiusSide = function makePolygonCircumradiusSide() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var halfwedge = Math.PI / sides;
    var angles = angleArray(sides).map(function (a) {
      return a + halfwedge;
    });
    return anglesToVecs(angles, radius);
  };
  var makePolygonInradius = function makePolygonInradius() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return makePolygonCircumradius(sides, radius / Math.cos(Math.PI / sides));
  };
  var makePolygonInradiusSide = function makePolygonInradiusSide() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return makePolygonCircumradiusSide(sides, radius / Math.cos(Math.PI / sides));
  };
  var makePolygonSideLength = function makePolygonSideLength() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return makePolygonCircumradius(sides, length / 2 / Math.sin(Math.PI / sides));
  };
  var makePolygonSideLengthSide = function makePolygonSideLengthSide() {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return makePolygonCircumradiusSide(sides, length / 2 / Math.sin(Math.PI / sides));
  };
  var makePolygonNonCollinear = function makePolygonNonCollinear(polygon) {
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
  var pleatParallel = function pleatParallel(count, a, b) {
    var origins = Array.from(Array(count - 1)).map(function (_, i) {
      return (i + 1) / count;
    }).map(function (t) {
      return _lerp(a.origin, b.origin, t);
    });
    var vector = _toConsumableArray(a.vector);
    return origins.map(function (origin) {
      return {
        origin: origin,
        vector: vector
      };
    });
  };
  var pleatAngle = function pleatAngle(count, a, b) {
    var origin = intersectLineLine(a.vector, a.origin, b.vector, b.origin);
    var vectors = clockwiseAngle2(a.vector, b.vector) < counterClockwiseAngle2(a.vector, b.vector) ? clockwiseSubsect2(count, a.vector, b.vector) : counterClockwiseSubsect2(count, a.vector, b.vector);
    return vectors.map(function (vector) {
      return {
        origin: origin,
        vector: vector
      };
    });
  };
  var pleat = function pleat(count, a, b) {
    var lineA = getLine$1(a);
    var lineB = getLine$1(b);
    return parallel(lineA.vector, lineB.vector) ? pleatParallel(count, lineA, lineB) : pleatAngle(count, lineA, lineB);
  };
  var splitConvexPolygon = function splitConvexPolygon(poly, lineVector, linePoint) {
    var vertices_intersections = poly.map(function (v, i) {
      var intersection = overlapLinePoint(lineVector, linePoint, v, includeL$1);
      return {
        point: intersection ? v : null,
        at_index: i
      };
    }).filter(function (el) {
      return el.point != null;
    });
    var edges_intersections = poly.map(function (v, i, arr) {
      return {
        point: intersectLineLine(lineVector, linePoint, _subtract(v, arr[(i + 1) % arr.length]), arr[(i + 1) % arr.length], excludeL, excludeS),
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
  var _convexHull = function convexHull(points) {
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
      var angles = sorted
      .filter(function (el) {
        return !(Math.abs(el[0] - hull[h][0]) < epsilon && Math.abs(el[1] - hull[h][1]) < epsilon);
      })
      .map(function (el) {
        var angle = Math.atan2(hull[h][1] - el[1], hull[h][0] - el[0]);
        while (angle < ang) {
          angle += Math.PI * 2;
        }
        return {
          node: el,
          angle: angle,
          distance: undefined
        };
      })
      .sort(function (a, b) {
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
      })
      .map(function (el) {
        var distance = Math.sqrt(Math.pow(hull[h][0] - el.node[0], 2) + Math.pow(hull[h][1] - el.node[1], 2));
        el.distance = distance;
        return el;
      })
      .sort(function (a, b) {
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
    var intersects = points
    .map(function (origin, i) {
      return {
        vector: bisectors[i],
        origin: origin
      };
    }).map(function (ray, i, arr) {
      return intersectLineLine(ray.vector, ray.origin, arr[(i + 1) % arr.length].vector, arr[(i + 1) % arr.length].origin, excludeR, excludeR);
    });
    var projections = lines.map(function (line, i) {
      return nearestPointOnLine(line.vector, line.origin, intersects[i], function (a) {
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
    },
    {
      type: "perpendicular",
      points: [projections[shortest], intersects[shortest]]
    }
    ];
    var newVector = clockwiseBisect2(_flip(lines[(shortest + lines.length - 1) % lines.length].vector), lines[(shortest + 1) % lines.length].vector);
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
  var _straightSkeleton = function straightSkeleton(points) {
    var lines = points.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    })
    .map(function (side) {
      return {
        vector: _subtract(side[1], side[0]),
        origin: side[0]
      };
    });
    var bisectors = points
    .map(function (_, i, ar) {
      return [(i - 1 + ar.length) % ar.length, i, (i + 1) % ar.length].map(function (i) {
        return ar[i];
      });
    })
    .map(function (p) {
      return [_subtract(p[0], p[1]), _subtract(p[2], p[1])];
    })
    .map(function (v) {
      return clockwiseBisect2.apply(void 0, _toConsumableArray(v));
    });
    return recurseSkeleton(_toConsumableArray(points), lines, bisectors);
  };
  var geometry = Object.freeze({
    __proto__: null,
    circumcircle: circumcircle,
    signedArea: signedArea,
    centroid: _centroid,
    boundingBox: _boundingBox,
    makePolygonCircumradius: makePolygonCircumradius,
    makePolygonCircumradiusSide: makePolygonCircumradiusSide,
    makePolygonInradius: makePolygonInradius,
    makePolygonInradiusSide: makePolygonInradiusSide,
    makePolygonSideLength: makePolygonSideLength,
    makePolygonSideLengthSide: makePolygonSideLengthSide,
    makePolygonNonCollinear: makePolygonNonCollinear,
    pleat: pleat,
    splitConvexPolygon: splitConvexPolygon,
    convexHull: _convexHull,
    straightSkeleton: _straightSkeleton
  });
  var makeNormalDistanceLine = function makeNormalDistanceLine(_ref) {
    var vector = _ref.vector,
        origin = _ref.origin;
    var mag = _magnitude(vector);
    var normal = _rotate(vector);
    var distance = _dot(origin, normal) / mag;
    return {
      normal: _scale(normal, 1 / mag),
      distance: distance
    };
  };
  var makeVectorOriginLine = function makeVectorOriginLine(_ref2) {
    var normal = _ref2.normal,
        distance = _ref2.distance;
    return {
      vector: _rotate2(normal),
      origin: _scale(normal, distance)
    };
  };
  var parameterize = Object.freeze({
    __proto__: null,
    makeNormalDistanceLine: makeNormalDistanceLine,
    makeVectorOriginLine: makeVectorOriginLine
  });
  var acosSafe = function acosSafe(x) {
    if (x >= 1.0) return 0;
    if (x <= -1.0) return Math.PI;
    return Math.acos(x);
  };
  var rotateVector2 = function rotateVector2(center, pt, a) {
    var x = pt[0] - center[0];
    var y = pt[1] - center[1];
    var xRot = x * Math.cos(a) + y * Math.sin(a);
    var yRot = y * Math.cos(a) - x * Math.sin(a);
    return [center[0] + xRot, center[1] + yRot];
  };
  var intersectCircleCircle = function intersectCircleCircle(c1_radius, c1_origin, c2_radius, c2_origin) {
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
    var angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
    var pt1 = rotateVector2(bgCenter, point, +angle);
    var pt2 = rotateVector2(bgCenter, point, -angle);
    return [pt1, pt2];
  };
  var intersectCircleLine = function intersectCircleLine(circle_radius, circle_origin, line_vector, line_origin) {
    var line_func = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : includeL$1;
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
    })
    : [-side, side].map(function (s) {
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
  var overlapConvexPolygonPoint = function overlapConvexPolygonPoint(poly, point) {
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
  var getUniquePair = function getUniquePair(intersections) {
    for (var i = 1; i < intersections.length; i += 1) {
      if (!fnEpsilonEqualVectors(intersections[0], intersections[i])) {
        return [intersections[0], intersections[i]];
      }
    }
  };
  var intersectConvexPolygonLineInclusive = function intersectConvexPolygonLineInclusive(poly, vector, origin) {
    var fn_poly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : includeS;
    var fn_line = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : includeL$1;
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;
    var intersections = poly.map(function (p, i, arr) {
      return [p, arr[(i + 1) % arr.length]];
    })
    .map(function (side) {
      return intersectLineLine(_subtract(side[1], side[0]), side[0], vector, origin, fn_poly, fn_line, epsilon);
    }).filter(function (a) {
      return a !== undefined;
    });
    switch (intersections.length) {
      case 0:
        return undefined;
      case 1:
        return [intersections];
      default:
        return getUniquePair(intersections) || [intersections[0]];
    }
  };
  var intersectConvexPolygonLine = function intersectConvexPolygonLine(poly, vector, origin) {
    var fn_poly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : includeS;
    var fn_line = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : excludeL;
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;
    var sects = intersectConvexPolygonLineInclusive(poly, vector, origin, fn_poly, fn_line, epsilon);
    var altFunc;
    switch (fn_line) {
      case excludeR:
        altFunc = includeR;
        break;
      case excludeS:
        altFunc = includeS;
        break;
      default:
        return sects;
    }
    var includes = intersectConvexPolygonLineInclusive(poly, vector, origin, includeS, altFunc, epsilon);
    if (includes === undefined) {
      return undefined;
    }
    var uniqueIncludes = getUniquePair(includes);
    if (uniqueIncludes === undefined) {
      switch (fn_line) {
        case excludeL:
          return undefined;
        case excludeR:
          return overlapConvexPolygonPoint(poly, origin, exclude, epsilon) ? includes : undefined;
        case excludeS:
          return overlapConvexPolygonPoint(poly, _add(origin, vector), exclude, epsilon) || overlapConvexPolygonPoint(poly, origin, exclude, epsilon) ? includes : undefined;
      }
    }
    return overlapConvexPolygonPoint(poly, _midpoint.apply(void 0, _toConsumableArray(uniqueIncludes)), exclude, epsilon) ? uniqueIncludes : sects;
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
      line: function line(a, b, fnA, fnB, ep) {
        return intersectConvexPolygonLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [includeS, fnB, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return intersectConvexPolygonLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [includeS, fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return intersectConvexPolygonLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [includeS, fnB, ep]));
      }
    },
    circle: {
      circle: function circle(a, b, fnA, fnB, ep) {
        return intersectCircleCircle.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [ep]));
      },
      line: function line(a, b, fnA, fnB, ep) {
        return intersectCircleLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnB, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return intersectCircleLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return intersectCircleLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnB, ep]));
      }
    },
    line: {
      polygon: function polygon(a, b, fnA, fnB, ep) {
        return intersectConvexPolygonLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [includeS, fnA, ep]));
      },
      circle: function circle(a, b, fnA, fnB, ep) {
        return intersectCircleLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnA, ep]));
      },
      line: function line(a, b, fnA, fnB, ep) {
        return intersectLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return intersectLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return intersectLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      }
    },
    ray: {
      polygon: function polygon(a, b, fnA, fnB, ep) {
        return intersectConvexPolygonLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [includeS, fnA, ep]));
      },
      circle: function circle(a, b, fnA, fnB, ep) {
        return intersectCircleLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnA, ep]));
      },
      line: function line(a, b, fnA, fnB, ep) {
        return intersectLineLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return intersectLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return intersectLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      }
    },
    segment: {
      polygon: function polygon(a, b, fnA, fnB, ep) {
        return intersectConvexPolygonLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [includeS, fnA, ep]));
      },
      circle: function circle(a, b, fnA, fnB, ep) {
        return intersectCircleLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnA, ep]));
      },
      line: function line(a, b, fnA, fnB, ep) {
        return intersectLineLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return intersectLineLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return intersectLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
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
    line: excludeL,
    ray: excludeR,
    segment: excludeS
  };
  var _intersect = function intersect(a, b, epsilon) {
    var type_a = typeOf(a);
    var type_b = typeOf(b);
    var aT = similar_intersect_types[type_a];
    var bT = similar_intersect_types[type_b];
    var params_a = intersect_param_form[type_a](a);
    var params_b = intersect_param_form[type_b](b);
    var domain_a = a.domain_function || default_intersect_domain_function[type_a];
    var domain_b = b.domain_function || default_intersect_domain_function[type_b];
    return intersect_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
  };
  var overlapConvexPolygons = function overlapConvexPolygons(poly1, poly2) {
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
  var overlapCirclePoint = function overlapCirclePoint(radius, origin, point) {
    var func = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : exclude;
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : EPSILON;
    return func(radius - distance2(origin, point), epsilon);
  };
  var overlapLineLine = function overlapLineLine(aVector, aOrigin, bVector, bOrigin) {
    var aFunction = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : excludeL;
    var bFunction = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : excludeL;
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
        return overlapConvexPolygons.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [ep]));
      },
      vector: function vector(a, b, fnA, fnB, ep) {
        return overlapConvexPolygonPoint.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, ep]));
      }
    },
    circle: {
      vector: function vector(a, b, fnA, fnB, ep) {
        return overlapCirclePoint.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [exclude, ep]));
      }
    },
    line: {
      line: function line(a, b, fnA, fnB, ep) {
        return overlapLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return overlapLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return overlapLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      vector: function vector(a, b, fnA, fnB, ep) {
        return overlapLinePoint.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, ep]));
      }
    },
    ray: {
      line: function line(a, b, fnA, fnB, ep) {
        return overlapLineLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return overlapLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return overlapLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      vector: function vector(a, b, fnA, fnB, ep) {
        return overlapLinePoint.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, ep]));
      }
    },
    segment: {
      line: function line(a, b, fnA, fnB, ep) {
        return overlapLineLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return overlapLineLine.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, fnA, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return overlapLineLine.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, fnB, ep]));
      },
      vector: function vector(a, b, fnA, fnB, ep) {
        return overlapLinePoint.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [fnA, ep]));
      }
    },
    vector: {
      polygon: function polygon(a, b, fnA, fnB, ep) {
        return overlapConvexPolygonPoint.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, ep]));
      },
      circle: function circle(a, b, fnA, fnB, ep) {
        return overlapCirclePoint.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [exclude, ep]));
      },
      line: function line(a, b, fnA, fnB, ep) {
        return overlapLinePoint.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, ep]));
      },
      ray: function ray(a, b, fnA, fnB, ep) {
        return overlapLinePoint.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, ep]));
      },
      segment: function segment(a, b, fnA, fnB, ep) {
        return overlapLinePoint.apply(void 0, _toConsumableArray(b).concat(_toConsumableArray(a), [fnB, ep]));
      },
      vector: function vector(a, b, fnA, fnB, ep) {
        return fnEpsilonEqualVectors.apply(void 0, _toConsumableArray(a).concat(_toConsumableArray(b), [ep]));
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
    line: excludeL,
    ray: excludeR,
    segment: excludeS,
    vector: excludeL
  };
  var _overlap = function overlap(a, b, epsilon) {
    var type_a = typeOf(a);
    var type_b = typeOf(b);
    var aT = similar_overlap_types[type_a];
    var bT = similar_overlap_types[type_b];
    var params_a = overlap_param_form[type_a](a);
    var params_b = overlap_param_form[type_b](b);
    var domain_a = a.domain_function || default_overlap_domain_function[type_a];
    var domain_b = b.domain_function || default_overlap_domain_function[type_b];
    return overlap_func[aT][bT](params_a, params_b, domain_a, domain_b, epsilon);
  };
  var enclosingPolygonPolygon = function enclosingPolygonPolygon(outer, inner) {
    var fnInclusive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : include;
    var outerGoesInside = outer.map(function (p) {
      return overlapConvexPolygonPoint(inner, p, fnInclusive);
    }).reduce(function (a, b) {
      return a || b;
    }, false);
    var innerGoesOutside = inner.map(function (p) {
      return overlapConvexPolygonPoint(inner, p, fnInclusive);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
    return !outerGoesInside && innerGoesOutside;
  };
  var overlapBoundingBoxes = function overlapBoundingBoxes(box1, box2) {
    var dimensions = box1.min.length > box2.min.length ? box2.min.length : box1.min.length;
    for (var d = 0; d < dimensions; d++) {
      if (box1.min[d] > box2.max[d] || box1.max[d] < box2.min[d]) {
        return false;
      }
    }
    return true;
  };
  var lineLineParameter = function lineLineParameter(lineVector, lineOrigin, polyVector, polyOrigin) {
    var polyLineFunc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : includeS;
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;
    var det_norm = cross2(_normalize(lineVector), _normalize(polyVector));
    if (Math.abs(det_norm) < epsilon) {
      return undefined;
    }
    var determinant0 = cross2(lineVector, polyVector);
    var determinant1 = -determinant0;
    var a2b = _subtract(polyOrigin, lineOrigin);
    var b2a = _flip(a2b);
    var t0 = cross2(a2b, polyVector) / determinant0;
    var t1 = cross2(b2a, lineVector) / determinant1;
    if (polyLineFunc(t1, epsilon / _magnitude(polyVector))) {
      return t0;
    }
    return undefined;
  };
  var linePointFromParameter = function linePointFromParameter(vector, origin, t) {
    return _add(origin, _scale(vector, t));
  };
  var getIntersectParameters = function getIntersectParameters(poly, vector, origin, polyLineFunc, epsilon) {
    return poly
    .map(function (p, i, arr) {
      return [_subtract(arr[(i + 1) % arr.length], p), p];
    }).map(function (side) {
      return lineLineParameter(vector, origin, side[0], side[1], polyLineFunc, epsilon);
    }).filter(fnNotUndefined).sort(function (a, b) {
      return a - b;
    });
  };
  var getMinMax = function getMinMax(numbers, func, scaled_epsilon) {
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
  var clipLineConvexPolygon = function clipLineConvexPolygon(poly, vector, origin) {
    var fnPoly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : include;
    var fnLine = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : includeL$1;
    var epsilon = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : EPSILON;
    var numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
    if (numbers.length < 2) {
      return undefined;
    }
    var scaled_epsilon = epsilon * 2 / _magnitude(vector);
    var ends = getMinMax(numbers, fnPoly, scaled_epsilon);
    if (ends === undefined) {
      return undefined;
    }
    var ends_clip = ends.map(function (t, i) {
      return fnLine(t) ? t : t < 0.5 ? 0 : 1;
    });
    if (Math.abs(ends_clip[0] - ends_clip[1]) < epsilon * 2 / _magnitude(vector)) {
      return undefined;
    }
    var mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
    return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon) ? ends_clip.map(function (t) {
      return linePointFromParameter(vector, origin, t);
    }) : undefined;
  };
  var clipPolygonPolygon = function clipPolygonPolygon(polygon1, polygon2) {
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
  var VectorArgs = function VectorArgs() {
    this.push.apply(this, _toConsumableArray(getVector(arguments)));
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
        return fnEpsilonEqualVectors(this, getVector(arguments));
      },
      isParallel: function isParallel() {
        return parallel.apply(void 0, _toConsumableArray(resizeUp(this, getVector(arguments))));
      },
      isCollinear: function isCollinear(line) {
        return _overlap(this, line);
      },
      dot: function dot() {
        return _dot.apply(void 0, _toConsumableArray(resizeUp(this, getVector(arguments))));
      },
      distanceTo: function distanceTo() {
        return distance.apply(void 0, _toConsumableArray(resizeUp(this, getVector(arguments))));
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
        return cross3(resize(3, this), resize(3, getVector(arguments)));
      },
      transform: function transform() {
        return multiplyMatrix3Vector3(getMatrix3x4(arguments), resize(3, this));
      },
      add: function add() {
        return _add(this, resize(this.length, getVector(arguments)));
      },
      subtract: function subtract() {
        return _subtract(this, resize(this.length, getVector(arguments)));
      },
      rotateZ: function rotateZ(angle, origin) {
        return multiplyMatrix3Vector3(getMatrix3x4(makeMatrix2Rotate(angle, origin)), resize(3, this));
      },
      lerp: function lerp(vector, pct) {
        return _lerp(this, resize(this.length, getVector(vector)), pct);
      },
      midpoint: function midpoint() {
        return _midpoint.apply(void 0, _toConsumableArray(resizeUp(this, getVector(arguments))));
      },
      bisect: function bisect() {
        return counterClockwiseBisect2(this, getVector(arguments));
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
  var Static = {
    fromPoints: function fromPoints() {
      var points = getVectorOfVectors(arguments);
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
      var points = getVectorOfVectors(arguments);
      return this.constructor({
        vector: _rotate(_subtract(points[1], points[0])),
        origin: average(points[0], points[1])
      });
    }
  };
  var LinesMethods = {
    isParallel: function isParallel() {
      var arr = resizeUp(this.vector, getLine$1(arguments).vector);
      return parallel.apply(void 0, _toConsumableArray(arr));
    },
    isCollinear: function isCollinear() {
      var line = getLine$1(arguments);
      return overlapLinePoint(this.vector, this.origin, line.origin) && parallel.apply(void 0, _toConsumableArray(resizeUp(this.vector, line.vector)));
    },
    isDegenerate: function isDegenerate() {
      var epsilon = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : EPSILON;
      return degenerate(this.vector, epsilon);
    },
    reflectionMatrix: function reflectionMatrix() {
      return Constructors.matrix(makeMatrix3ReflectZ(this.vector, this.origin));
    },
    nearestPoint: function nearestPoint() {
      var point = getVector(arguments);
      return Constructors.vector(nearestPointOnLine(this.vector, this.origin, point, this.clip_function));
    },
    transform: function transform() {
      var dim = this.dimension;
      var r = multiplyMatrix3Line3(getMatrix3x4(arguments), resize(3, this.vector), resize(3, this.origin));
      return this.constructor(resize(dim, r.vector), resize(dim, r.origin));
    },
    translate: function translate() {
      var origin = _add.apply(void 0, _toConsumableArray(resizeUp(this.origin, getVector(arguments))));
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
      var line = getLine$1(lineType);
      return bisectLines2(this.vector, this.origin, line.vector, line.origin, epsilon).map(function (line) {
        return _this.constructor(line);
      });
    }
  };
  var Line = {
    line: {
      P: Object.prototype,
      A: function A() {
        var l = getLine$1.apply(void 0, arguments);
        this.vector = Constructors.vector(l.vector);
        this.origin = Constructors.vector(resize(this.vector.length, l.origin));
        var alt = makeNormalDistanceLine({
          vector: this.vector,
          origin: this.origin
        });
        this.normal = alt.normal;
        this.distance = alt.distance;
        Object.defineProperty(this, "domain_function", {
          writable: true,
          value: includeL$1
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
      M: Object.assign({}, LinesMethods, {
        inclusive: function inclusive() {
          this.domain_function = includeL$1;
          return this;
        },
        exclusive: function exclusive() {
          this.domain_function = excludeL;
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
        fromNormalDistance: function fromNormalDistance() {
          return this.constructor(makeVectorOriginLine(arguments[0]));
        }
      }, Static)
    }
  };
  var Ray = {
    ray: {
      P: Object.prototype,
      A: function A() {
        var ray = getLine$1.apply(void 0, arguments);
        this.vector = Constructors.vector(ray.vector);
        this.origin = Constructors.vector(resize(this.vector.length, ray.origin));
        Object.defineProperty(this, "domain_function", {
          writable: true,
          value: includeR
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
      M: Object.assign({}, LinesMethods, {
        inclusive: function inclusive() {
          this.domain_function = includeR;
          return this;
        },
        exclusive: function exclusive() {
          this.domain_function = excludeR;
          return this;
        },
        flip: function flip() {
          return Constructors.ray(_flip(this.vector), this.origin);
        },
        scale: function scale(_scale2) {
          return Constructors.ray(this.vector.scale(_scale2), this.origin);
        },
        normalize: function normalize() {
          return Constructors.ray(this.vector.normalize(), this.origin);
        },
        clip_function: rayLimiter,
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
        var a = getSegment.apply(void 0, arguments);
        this.push.apply(this, _toConsumableArray([a[0], a[1]].map(function (v) {
          return Constructors.vector(v);
        })));
        this.vector = Constructors.vector(_subtract(this[1], this[0]));
        this.origin = this[0];
        Object.defineProperty(this, "domain_function", {
          writable: true,
          value: includeS
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
      M: Object.assign({}, LinesMethods, {
        inclusive: function inclusive() {
          this.domain_function = includeS;
          return this;
        },
        exclusive: function exclusive() {
          this.domain_function = excludeS;
          return this;
        },
        clip_function: segmentLimiter,
        transform: function transform() {
          var dim = this.points[0].length;
          for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            innerArgs[_key2] = arguments[_key2];
          }
          var mat = getMatrix3x4(innerArgs);
          var transformed_points = this.points.map(function (point) {
            return resize(3, point);
          }).map(function (point) {
            return multiplyMatrix3Vector3(mat, point);
          }).map(function (point) {
            return resize(dim, point);
          });
          return Constructors.segment(transformed_points);
        },
        translate: function translate() {
          var translate = getVector(arguments);
          var transformed_points = this.points.map(function (point) {
            return _add.apply(void 0, _toConsumableArray(resizeUp(point, translate)));
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
      }),
      S: {
        fromPoints: function fromPoints() {
          return this.constructor.apply(this, arguments);
        }
      }
    }
  };
  var CircleArgs = function CircleArgs() {
    var circle = getCircle.apply(void 0, arguments);
    this.radius = circle.radius;
    this.origin = Constructors.vector.apply(Constructors, _toConsumableArray(circle.origin));
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
    return cleanNumber(n, 4);
  };
  var ellipticalArcTo = function ellipticalArcTo(rx, ry, phi_degrees, fa, fs, endX, endY) {
    return "A".concat(cln(rx), " ").concat(cln(ry), " ").concat(cln(phi_degrees), " ").concat(cln(fa), " ").concat(cln(fs), " ").concat(cln(endX), " ").concat(cln(endY));
  };
  var CircleMethods = {
    nearestPoint: function nearestPoint() {
      return Constructors.vector(nearestPointOnCircle(this.radius, this.origin, getVector(arguments)));
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
        var numbers = flattenArrays(arguments).filter(function (a) {
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
      S: {
      }
    }
  };
  var PolygonMethods = {
    area: function area() {
      return signedArea(this);
    },
    centroid: function centroid() {
      return Constructors.vector(_centroid(this));
    },
    boundingBox: function boundingBox() {
      return _boundingBox(this);
    },
    straightSkeleton: function straightSkeleton() {
      return _straightSkeleton(this);
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
      var vec = getVector.apply(void 0, arguments);
      var newPoints = this.map(function (p) {
        return p.map(function (n, i) {
          return n + vec[i];
        });
      });
      return this.constructor.fromPoints(newPoints);
    },
    transform: function transform() {
      var m = getMatrix3x4.apply(void 0, arguments);
      var newPoints = this.map(function (p) {
        return multiplyMatrix3Vector3(m, resize(3, p));
      });
      return Constructors.polygon(newPoints);
    },
    nearest: function nearest() {
      var point = getVector.apply(void 0, arguments);
      var result = nearestPointOnPolygon(this, point);
      return result === undefined ? undefined : Object.assign(result, {
        edge: this.sides[result.i]
      });
    },
    split: function split() {
      var line = getLine$1.apply(void 0, arguments);
      var split_func = splitConvexPolygon;
      return split_func(this, line.vector, line.origin).map(function (poly) {
        return Constructors.polygon(poly);
      });
    },
    overlap: function overlap() {
      return _overlap.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    },
    intersect: function intersect() {
      return _intersect.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    },
    clip: function clip(line_type, epsilon) {
      var fn_line = line_type.domain_function ? line_type.domain_function : includeL$1;
      var segment = clipLineConvexPolygon(this, line_type.vector, line_type.origin, this.domain_function, fn_line, epsilon);
      return segment ? Constructors.segment(segment) : undefined;
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
        var r = getRect.apply(void 0, arguments);
        this.width = r.width;
        this.height = r.height;
        this.origin = Constructors.vector(r.x, r.y);
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
          return Constructors.vector(this.origin[0] + this.width / 2, this.origin[1] + this.height / 2);
        }
      },
      M: Object.assign({}, PolygonMethods, {
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
          var box = _boundingBox(getVectorOfVectors(arguments));
          return Constructors.rect(box.min[0], box.min[1], box.span[0], box.span[1]);
        }
      }
    }
  };
  var Polygon = {
    polygon: {
      P: Array.prototype,
      A: function A() {
        this.push.apply(this, _toConsumableArray(semiFlattenArrays(arguments)));
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
          return undefined;
        },
        points: function points() {
          return this;
        }
      },
      M: Object.assign({}, PolygonMethods, {
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
          return this.constructor(makePolygonCircumradius.apply(void 0, arguments));
        },
        convexHull: function convexHull() {
          return this.constructor(_convexHull.apply(void 0, arguments));
        }
      }
    }
  };
  var Polyline = {
    polyline: {
      P: Array.prototype,
      A: function A() {
        this.push.apply(this, _toConsumableArray(semiFlattenArrays(arguments)));
      },
      G: {
        points: function points() {
          return this;
        }
      },
      M: {
        svgPath: function svgPath() {
          var pre = Array(this.length).fill("L");
          pre[0] = "M";
          return "".concat(this.map(function (p, i) {
            return "".concat(pre[i]).concat(p[0], " ").concat(p[1]);
          }).join(""));
        }
      },
      S: {
        fromPoints: function fromPoints() {
          return this.constructor.apply(this, arguments);
        }
      }
    }
  };
  var array_assign = function array_assign(thisMat, mat) {
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
        getMatrix3x4(arguments).forEach(function (m) {
          return _this4.push(m);
        });
      },
      G: {},
      M: {
        copy: function copy() {
          return Constructors.matrix.apply(Constructors, _toConsumableArray(Array.from(this)));
        },
        set: function set() {
          return array_assign(this, getMatrix3x4(arguments));
        },
        isIdentity: function isIdentity() {
          return isIdentity3x4(this);
        },
        multiply: function multiply(mat) {
          return array_assign(this, multiplyMatrices3(this, mat));
        },
        determinant: function determinant() {
          return determinant3(this);
        },
        inverse: function inverse() {
          return array_assign(this, invertMatrix3(this));
        },
        translate: function translate(x, y, z) {
          return array_assign(this, multiplyMatrices3(this, makeMatrix3Translate(x, y, z)));
        },
        rotateX: function rotateX(radians) {
          return array_assign(this, multiplyMatrices3(this, makeMatrix3RotateX(radians)));
        },
        rotateY: function rotateY(radians) {
          return array_assign(this, multiplyMatrices3(this, makeMatrix3RotateY(radians)));
        },
        rotateZ: function rotateZ(radians) {
          return array_assign(this, multiplyMatrices3(this, makeMatrix3RotateZ(radians)));
        },
        rotate: function rotate(radians, vector, origin) {
          var transform = makeMatrix3Rotate(radians, vector, origin);
          return array_assign(this, multiplyMatrices3(this, transform));
        },
        scale: function scale(amount) {
          return array_assign(this, multiplyMatrices3(this, makeMatrix3Scale(amount)));
        },
        reflectZ: function reflectZ(vector, origin) {
          var transform = makeMatrix3ReflectZ(vector, origin);
          return array_assign(this, multiplyMatrices3(this, transform));
        },
        transform: function transform() {
          for (var _len3 = arguments.length, innerArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            innerArgs[_key3] = arguments[_key3];
          }
          return Constructors.vector(multiplyMatrix3Vector3(this, resize(3, getVector(innerArgs))));
        },
        transformVector: function transformVector(vector) {
          return Constructors.vector(multiplyMatrix3Vector3(this, resize(3, getVector(vector))));
        },
        transformLine: function transformLine() {
          for (var _len4 = arguments.length, innerArgs = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            innerArgs[_key4] = arguments[_key4];
          }
          var l = getLine$1(innerArgs);
          return Constructors.line(multiplyMatrix3Line3(this, l.vector, l.origin));
        }
      },
      S: {}
    }
  };
  var Definitions = Object.assign({}, Vector, Line, Ray, Segment, Circle, Ellipse, Rect, Polygon, Polyline, Matrix
  );
  var create = function create(primitiveName, args) {
    var a = Object.create(Definitions[primitiveName].proto);
    Definitions[primitiveName].A.apply(a, args);
    return a;
  };
  var vector = function vector() {
    return create("vector", arguments);
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
  var polyline = function polyline() {
    return create("polyline", arguments);
  };
  var matrix = function matrix() {
    return create("matrix", arguments);
  };
  Object.assign(Constructors, {
    vector: vector,
    line: line,
    ray: ray,
    segment: segment,
    circle: circle,
    ellipse: ellipse,
    rect: rect,
    polygon: polygon,
    polyline: polyline,
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
    Definitions[primitiveName].proto = Proto.prototype;
  });
  var math = Constructors;
  math.core = Object.assign(Object.create(null), constants, resizers, getters, functions, algebra, equal, sort$1, geometry, radial,
  matrix2, matrix3, nearest$1, parameterize, {
    enclosingPolygonPolygon: enclosingPolygonPolygon,
    intersectConvexPolygonLine: intersectConvexPolygonLine,
    intersectCircleCircle: intersectCircleCircle,
    intersectCircleLine: intersectCircleLine,
    intersectLineLine: intersectLineLine,
    overlapConvexPolygons: overlapConvexPolygons,
    overlapConvexPolygonPoint: overlapConvexPolygonPoint,
    overlapBoundingBoxes: overlapBoundingBoxes,
    overlapLineLine: overlapLineLine,
    overlapLinePoint: overlapLinePoint,
    clipLineConvexPolygon: clipLineConvexPolygon,
    clipPolygonPolygon: clipPolygonPolygon
  });
  math["typeof"] = typeOf;
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

  var file_spec = 1.1;
  var file_creator = "Rabbit Ear";
  var foldKeys = {
    file: ["file_spec", "file_creator", "file_author", "file_title", "file_description", "file_classes", "file_frames"],
    frame: ["frame_author", "frame_title", "frame_description", "frame_attributes", "frame_classes", "frame_unit", "frame_parent",
    "frame_inherit"
    ],
    graph: ["vertices_coords", "vertices_vertices", "vertices_faces", "edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length", "faces_vertices", "faces_edges",
    "vertices_edges", "edges_edges", "faces_faces"],
    orders: ["edgeOrders", "faceOrders"]
  };
  var keys = Object.freeze([].concat(foldKeys.file).concat(foldKeys.frame).concat(foldKeys.graph).concat(foldKeys.orders));
  var keysOutOfSpec = Object.freeze(["edges_vector", "vertices_sectors", "faces_sectors", "faces_matrix"]);
  var edgesAssignmentValues = Array.from("MmVvBbFfUu");

  var singularize = {
    vertices: "vertex",
    edges: "edge",
    faces: "face"
  };
  var pluralize = {
    vertex: "vertices",
    edge: "edges",
    face: "faces"
  };
  var edgesAssignmentNames = {
    b: "boundary",
    m: "mountain",
    v: "valley",
    f: "flat",
    u: "unassigned"
  };
  edgesAssignmentValues.forEach(function (key) {
    edgesAssignmentNames[key.toUpperCase()] = edgesAssignmentNames[key];
  });
  var edgesAssignmentDegrees = {
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
  var edgeAssignmentToFoldAngle = function edgeAssignmentToFoldAngle(assignment) {
    return edgesAssignmentDegrees[assignment] || 0;
  };
  var edgeFoldAngleToAssignment = function edgeFoldAngleToAssignment(a) {
    if (a > math.core.EPSILON) {
      return "V";
    }
    if (a < -math.core.EPSILON) {
      return "M";
    }
    return "U";
  };
  var edgeFoldAngleIsFlat = function edgeFoldAngleIsFlat(angle) {
    return math.core.fnEpsilonEqual(0, angle) || math.core.fnEpsilonEqual(-180, angle) || math.core.fnEpsilonEqual(180, angle);
  };
  var edgesFoldAngleAreAllFlat = function edgesFoldAngleAreAllFlat(_ref) {
    var edges_foldAngle = _ref.edges_foldAngle;
    if (!edges_foldAngle) {
      return true;
    }
    for (var i = 0; i < edges_foldAngle.length; i++) {
      if (!edgeFoldAngleIsFlat(edges_foldAngle[i])) {
        return false;
      }
    }
    return true;
  };
  var filterKeysWithSuffix = function filterKeysWithSuffix(graph, suffix) {
    return Object.keys(graph).map(function (s) {
      return s.substring(s.length - suffix.length, s.length) === suffix ? s : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
  };
  var filterKeysWithPrefix = function filterKeysWithPrefix(obj, prefix) {
    return Object.keys(obj).map(function (str) {
      return str.substring(0, prefix.length) === prefix ? str : undefined;
    }).filter(function (str) {
      return str !== undefined;
    });
  };
  var getGraphKeysWithPrefix = function getGraphKeysWithPrefix(graph, key) {
    return filterKeysWithPrefix(graph, "".concat(key, "_"));
  };
  var getGraphKeysWithSuffix = function getGraphKeysWithSuffix(graph, key) {
    return filterKeysWithSuffix(graph, "_".concat(key));
  };
  var transposeGraphArrays = function transposeGraphArrays(graph, geometry_key) {
    var matching_keys = getGraphKeysWithPrefix(graph, geometry_key);
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
  var transposeGraphArrayAtIndex = function transposeGraphArrayAtIndex(graph, geometry_key, index) {
    var matching_keys = getGraphKeysWithPrefix(graph, geometry_key);
    if (matching_keys.length === 0) {
      return undefined;
    }
    var geometry = {};
    matching_keys.forEach(function (key) {
      geometry[key] = graph[key][index];
    });
    return geometry;
  };
  var isFoldObject = function isFoldObject() {
    var object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Object.keys(object).length === 0 ? 0 : [].concat(keys, keysOutOfSpec).filter(function (key) {
      return object[key];
    }).length / Object.keys(object).length;
  };

  var fold_spec = /*#__PURE__*/Object.freeze({
    __proto__: null,
    singularize: singularize,
    pluralize: pluralize,
    edgesAssignmentNames: edgesAssignmentNames,
    edgesAssignmentDegrees: edgesAssignmentDegrees,
    edgeAssignmentToFoldAngle: edgeAssignmentToFoldAngle,
    edgeFoldAngleToAssignment: edgeFoldAngleToAssignment,
    edgeFoldAngleIsFlat: edgeFoldAngleIsFlat,
    edgesFoldAngleAreAllFlat: edgesFoldAngleAreAllFlat,
    filterKeysWithSuffix: filterKeysWithSuffix,
    filterKeysWithPrefix: filterKeysWithPrefix,
    getGraphKeysWithPrefix: getGraphKeysWithPrefix,
    getGraphKeysWithSuffix: getGraphKeysWithSuffix,
    transposeGraphArrays: transposeGraphArrays,
    transposeGraphArrayAtIndex: transposeGraphArrayAtIndex,
    isFoldObject: isFoldObject
  });

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
  var getVerticesClusters = function getVerticesClusters(_ref) {
    var vertices_coords = _ref.vertices_coords;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    if (!vertices_coords) {
      return [];
    }
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
    return max_arrays_length.apply(void 0, _toConsumableArray(getGraphKeysWithPrefix(graph, key).map(function (key) {
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

  var uniqueIntegers = function uniqueIntegers(array) {
    var keys = {};
    array.forEach(function (_int) {
      keys[_int] = true;
    });
    return Object.keys(keys).map(function (n) {
      return parseInt(n);
    });
  };
  var uniqueSortedIntegers = function uniqueSortedIntegers(array) {
    return uniqueIntegers(array).sort(function (a, b) {
      return a - b;
    });
  };
  var splitCircularArray = function splitCircularArray(array, indices) {
    indices.sort(function (a, b) {
      return a - b;
    });
    return [array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)), array.slice(indices[0], indices[1] + 1)];
  };
  var getLongestArray = function getLongestArray(arrays) {
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
  var removeSingleInstances = function removeSingleInstances(array) {
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
  var booleanMatrixToIndexedArray = function booleanMatrixToIndexedArray(matrix) {
    return matrix.map(function (row) {
      return row.map(function (value, i) {
        return value === true ? i : undefined;
      }).filter(function (a) {
        return a !== undefined;
      });
    });
  };
  var booleanMatrixToUniqueIndexPairs = function booleanMatrixToUniqueIndexPairs(matrix) {
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
  var makeSelfRelationalArrayClusters = function makeSelfRelationalArrayClusters(matrix) {
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
  var circularArrayValidRanges = function circularArrayValidRanges(array) {
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
    uniqueIntegers: uniqueIntegers,
    uniqueSortedIntegers: uniqueSortedIntegers,
    splitCircularArray: splitCircularArray,
    getLongestArray: getLongestArray,
    removeSingleInstances: removeSingleInstances,
    booleanMatrixToIndexedArray: booleanMatrixToIndexedArray,
    booleanMatrixToUniqueIndexPairs: booleanMatrixToUniqueIndexPairs,
    makeSelfRelationalArrayClusters: makeSelfRelationalArrayClusters,
    circularArrayValidRanges: circularArrayValidRanges
  });

  var removeGeometryIndices = function removeGeometryIndices(graph, key, removeIndices) {
    var geometry_array_size = count(graph, key);
    var removes = uniqueSortedIntegers(removeIndices);
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
    getGraphKeysWithSuffix(graph, key).forEach(function (sKey) {
      return graph[sKey].forEach(function (_, i) {
        return graph[sKey][i].forEach(function (v, j) {
          graph[sKey][i][j] = index_map[v];
        });
      });
    });
    removes.reverse();
    getGraphKeysWithPrefix(graph, key).forEach(function (prefix_key) {
      return removes.forEach(function (index) {
        return graph[prefix_key].splice(index, 1);
      });
    });
    return index_map;
  };

  var replaceGeometryIndices = function replaceGeometryIndices(graph, key, replaceIndices) {
    var geometry_array_size = count(graph, key);
    var removes = Object.keys(replaceIndices).map(function (n) {
      return parseInt(n);
    });
    var replaces = uniqueSortedIntegers(removes);
    var index_map = [];
    var i, j, walk;
    for (i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
      while (i === replaces[walk]) {
        index_map[i] = index_map[replaceIndices[replaces[walk]]];
        if (index_map[i] === undefined) {
          console.log("replace() found an undefined", index_map);
        }
        i += 1;
        walk += 1;
      }
      if (i < geometry_array_size) {
        index_map[i] = j;
      }
    }
    getGraphKeysWithSuffix(graph, key).forEach(function (sKey) {
      return graph[sKey].forEach(function (_, i) {
        return graph[sKey][i].forEach(function (v, j) {
          graph[sKey][i][j] = index_map[v];
        });
      });
    });
    replaces.reverse();
    getGraphKeysWithPrefix(graph, key).forEach(function (prefix_key) {
      return replaces.forEach(function (index) {
        return graph[prefix_key].splice(index, 1);
      });
    });
    return index_map;
  };

  var getDuplicateVertices = function getDuplicateVertices(graph, epsilon) {
    return getVerticesClusters(graph, epsilon).filter(function (arr) {
      return arr.length > 1;
    });
  };
  var getEdgeIsolatedVertices = function getEdgeIsolatedVertices(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices;
    if (!vertices_coords || !edges_vertices) {
      return [];
    }
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
  var getFaceIsolatedVertices = function getFaceIsolatedVertices(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        faces_vertices = _ref2.faces_vertices;
    if (!vertices_coords || !faces_vertices) {
      return [];
    }
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
  var getIsolatedVertices = function getIsolatedVertices(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        edges_vertices = _ref3.edges_vertices,
        faces_vertices = _ref3.faces_vertices;
    if (!vertices_coords) {
      return [];
    }
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
  var removeIsolatedVertices = function removeIsolatedVertices(graph, remove_indices) {
    if (!remove_indices) {
      remove_indices = getIsolatedVertices(graph);
    }
    return {
      map: removeGeometryIndices(graph, _vertices, remove_indices),
      remove: remove_indices
    };
  };
  var removeDuplicateVertices = function removeDuplicateVertices(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var replace_indices = [];
    var remove_indices = [];
    var clusters = getVerticesClusters(graph, epsilon).filter(function (arr) {
      return arr.length > 1;
    });
    clusters.forEach(function (cluster) {
      for (var i = 1; i < cluster.length; i++) {
        replace_indices[cluster[i]] = cluster[0];
        remove_indices.push(cluster[i]);
      }
    });
    clusters.map(function (arr) {
      return arr.map(function (i) {
        return graph.vertices_coords[i];
      });
    }).map(function (arr) {
      var _math$core;
      return (_math$core = math.core).average.apply(_math$core, _toConsumableArray(arr));
    }).forEach(function (point, i) {
      graph.vertices_coords[clusters[i][0]] = point;
    });
    return {
      map: replaceGeometryIndices(graph, _vertices, replace_indices),
      remove: remove_indices
    };
  };

  var verticesViolations = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getDuplicateVertices: getDuplicateVertices,
    getEdgeIsolatedVertices: getEdgeIsolatedVertices,
    getFaceIsolatedVertices: getFaceIsolatedVertices,
    getIsolatedVertices: getIsolatedVertices,
    removeIsolatedVertices: removeIsolatedVertices,
    removeDuplicateVertices: removeDuplicateVertices
  });

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
  var countImplied = function countImplied(graph, key) {
    return Math.max(
    array_in_array_max_number(getGraphKeysWithSuffix(graph, key).map(function (str) {
      return graph[str];
    })),
    graph[ordersArrayNames[key]] ? max_num_in_orders(graph[ordersArrayNames[key]]) : -1) + 1;
  };
  countImplied.vertices = function (graph) {
    return countImplied(graph, _vertices);
  };
  countImplied.edges = function (graph) {
    return countImplied(graph, _edges);
  };
  countImplied.faces = function (graph) {
    return countImplied(graph, _faces);
  };

  var counterClockwiseWalk = function counterClockwiseWalk(_ref, v0, v1) {
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
      if (vertices_sectors) {
        face.angles.push(vertices_sectors[this_vertex][next_neighbor_i]);
      }
      prev_vertex = this_vertex;
      this_vertex = next_vertex;
    }
  };
  var planarVertexWalk = function planarVertexWalk(_ref2) {
    var vertices_vertices = _ref2.vertices_vertices,
        vertices_sectors = _ref2.vertices_sectors;
    var graph = {
      vertices_vertices: vertices_vertices,
      vertices_sectors: vertices_sectors
    };
    var walked_edges = {};
    return vertices_vertices.map(function (adj_verts, v) {
      return adj_verts.map(function (adj_vert) {
        return counterClockwiseWalk(graph, v, adj_vert, walked_edges);
      }).filter(function (a) {
        return a !== undefined;
      });
    }).flat();
  };
  var filterWalkedBoundaryFace = function filterWalkedBoundaryFace(walked_faces) {
    return walked_faces.filter(function (face) {
      return face.angles.map(function (a) {
        return Math.PI - a;
      }).reduce(function (a, b) {
        return a + b;
      }, 0) > 0;
    });
  };

  var walk = /*#__PURE__*/Object.freeze({
    __proto__: null,
    counterClockwiseWalk: counterClockwiseWalk,
    planarVertexWalk: planarVertexWalk,
    filterWalkedBoundaryFace: filterWalkedBoundaryFace
  });

  var sortVerticesCounterClockwise = function sortVerticesCounterClockwise(_ref, vertices, vertex) {
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
  var sortVerticesAlongVector = function sortVerticesAlongVector(_ref2, vertices, vector) {
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
    sortVerticesCounterClockwise: sortVerticesCounterClockwise,
    sortVerticesAlongVector: sortVerticesAlongVector
  });

  var makeVerticesEdgesUnsorted = function makeVerticesEdgesUnsorted(_ref) {
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
  var makeVerticesEdges = function makeVerticesEdges(_ref2) {
    var edges_vertices = _ref2.edges_vertices,
        vertices_vertices = _ref2.vertices_vertices;
    var edge_map = makeVerticesToEdgeBidirectional({
      edges_vertices: edges_vertices
    });
    return vertices_vertices.map(function (verts, i) {
      return verts.map(function (v) {
        return edge_map["".concat(i, " ").concat(v)];
      });
    });
  };
  var makeVerticesVertices = function makeVerticesVertices(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        vertices_edges = _ref3.vertices_edges,
        edges_vertices = _ref3.edges_vertices;
    if (!vertices_edges) {
      vertices_edges = makeVerticesEdgesUnsorted({
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
      return sortVerticesCounterClockwise({
        vertices_coords: vertices_coords
      }, verts, i);
    });
  };
  var makeVerticesFacesUnsorted = function makeVerticesFacesUnsorted(_ref4) {
    var vertices_coords = _ref4.vertices_coords,
        faces_vertices = _ref4.faces_vertices;
    if (!faces_vertices) {
      return vertices_coords.map(function () {
        return [];
      });
    }
    var vertices_faces = vertices_coords !== undefined ? vertices_coords.map(function () {
      return [];
    }) : Array.from(Array(countImplied.vertices({
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
  var makeVerticesFaces = function makeVerticesFaces(_ref5) {
    var vertices_coords = _ref5.vertices_coords,
        vertices_vertices = _ref5.vertices_vertices,
        faces_vertices = _ref5.faces_vertices;
    if (!faces_vertices) {
      return vertices_coords.map(function () {
        return [];
      });
    }
    if (!vertices_vertices) {
      return makeVerticesFacesUnsorted({
        vertices_coords: vertices_coords,
        faces_vertices: faces_vertices
      });
    }
    var face_map = makeVerticesToFace({
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
  var makeVerticesToEdgeBidirectional = function makeVerticesToEdgeBidirectional(_ref6) {
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
  var makeVerticesToEdge = function makeVerticesToEdge(_ref7) {
    var edges_vertices = _ref7.edges_vertices;
    var map = {};
    edges_vertices.map(function (ev) {
      return ev.join(" ");
    }).forEach(function (key, i) {
      map[key] = i;
    });
    return map;
  };
  var makeVerticesToFace = function makeVerticesToFace(_ref8) {
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
  var makeVerticesVerticesVector = function makeVerticesVerticesVector(_ref9) {
    var vertices_coords = _ref9.vertices_coords,
        vertices_vertices = _ref9.vertices_vertices,
        edges_vertices = _ref9.edges_vertices,
        edges_vector = _ref9.edges_vector;
    if (!edges_vector) {
      edges_vector = makeEdgesVector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var edge_map = makeVerticesToEdge({
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
  var makeVerticesSectors = function makeVerticesSectors(_ref10) {
    var vertices_coords = _ref10.vertices_coords,
        vertices_vertices = _ref10.vertices_vertices,
        edges_vertices = _ref10.edges_vertices,
        edges_vector = _ref10.edges_vector;
    return makeVerticesVerticesVector({
      vertices_coords: vertices_coords,
      vertices_vertices: vertices_vertices,
      edges_vertices: edges_vertices,
      edges_vector: edges_vector
    }).map(function (vectors) {
      return vectors.length === 1
      ? [math.core.TWO_PI]
      : math.core.counterClockwiseSectors2(vectors);
    });
  };
  var makeEdgesEdges = function makeEdgesEdges(_ref11) {
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
  var makeEdgesFacesUnsorted = function makeEdgesFacesUnsorted(_ref12) {
    var edges_vertices = _ref12.edges_vertices,
        faces_edges = _ref12.faces_edges;
    var edges_faces = edges_vertices !== undefined ? edges_vertices.map(function () {
      return [];
    }) : Array.from(Array(countImplied.edges({
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
  var makeEdgesFaces = function makeEdgesFaces(_ref13) {
    var vertices_coords = _ref13.vertices_coords,
        edges_vertices = _ref13.edges_vertices,
        edges_vector = _ref13.edges_vector,
        faces_vertices = _ref13.faces_vertices,
        faces_edges = _ref13.faces_edges,
        faces_center = _ref13.faces_center;
    if (!edges_vertices) {
      return makeEdgesFacesUnsorted({
        faces_edges: faces_edges
      });
    }
    if (!edges_vector) {
      edges_vector = makeEdgesVector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var edges_origin = edges_vertices.map(function (pair) {
      return vertices_coords[pair[0]];
    });
    if (!faces_center) {
      faces_center = makeFacesCenter({
        vertices_coords: vertices_coords,
        faces_vertices: faces_vertices
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
    edges_faces.forEach(function (faces, e) {
      var faces_cross = faces.map(function (f) {
        return faces_center[f];
      }).map(function (center) {
        return math.core.subtract2(center, edges_origin[e]);
      }).map(function (vector) {
        return math.core.cross2(vector, edges_vector[e]);
      });
      faces.sort(function (a, b) {
        return faces_cross[a] - faces_cross[b];
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
  var makeEdgesFoldAngle = function makeEdgesFoldAngle(_ref14) {
    var edges_assignment = _ref14.edges_assignment;
    return edges_assignment.map(function (a) {
      return assignment_angles[a] || 0;
    });
  };
  var makeEdgesAssignment = function makeEdgesAssignment(_ref15) {
    var edges_foldAngle = _ref15.edges_foldAngle;
    return edges_foldAngle.map(function (a) {
      if (a === 0) {
        return "F";
      }
      return a < 0 ? "M" : "V";
    });
  };
  var makeEdgesCoords = function makeEdgesCoords(_ref16) {
    var vertices_coords = _ref16.vertices_coords,
        edges_vertices = _ref16.edges_vertices;
    return edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    });
  };
  var makeEdgesVector = function makeEdgesVector(_ref17) {
    var vertices_coords = _ref17.vertices_coords,
        edges_vertices = _ref17.edges_vertices;
    return makeEdgesCoords({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices
    }).map(function (verts) {
      return math.core.subtract(verts[1], verts[0]);
    });
  };
  var makeEdgesLength = function makeEdgesLength(_ref18) {
    var vertices_coords = _ref18.vertices_coords,
        edges_vertices = _ref18.edges_vertices;
    return makeEdgesVector({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices
    }).map(function (vec) {
      return math.core.magnitude(vec);
    });
  };
  var makeEdgesBoundingBox = function makeEdgesBoundingBox(_ref19) {
    var vertices_coords = _ref19.vertices_coords,
        edges_vertices = _ref19.edges_vertices,
        edges_coords = _ref19.edges_coords;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!edges_coords) {
      edges_coords = makeEdgesCoords({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    return edges_coords.map(function (coords) {
      return math.core.boundingBox(coords, epsilon);
    });
  };
  var makePlanarFaces = function makePlanarFaces(_ref20) {
    var vertices_coords = _ref20.vertices_coords,
        vertices_vertices = _ref20.vertices_vertices,
        vertices_edges = _ref20.vertices_edges,
        vertices_sectors = _ref20.vertices_sectors,
        edges_vertices = _ref20.edges_vertices,
        edges_vector = _ref20.edges_vector;
    if (!vertices_vertices) {
      vertices_vertices = makeVerticesVertices({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices,
        vertices_edges: vertices_edges
      });
    }
    if (!vertices_sectors) {
      vertices_sectors = makeVerticesSectors({
        vertices_coords: vertices_coords,
        vertices_vertices: vertices_vertices,
        edges_vertices: edges_vertices,
        edges_vector: edges_vector
      });
    }
    var vertices_edges_map = makeVerticesToEdgeBidirectional({
      edges_vertices: edges_vertices
    });
    return filterWalkedBoundaryFace(planarVertexWalk({
      vertices_vertices: vertices_vertices,
      vertices_sectors: vertices_sectors
    })).map(function (f) {
      return _objectSpread2(_objectSpread2({}, f), {}, {
        edges: f.edges.map(function (e) {
          return vertices_edges_map[e];
        })
      });
    });
  };
  var makeFacesVerticesFromEdges = function makeFacesVerticesFromEdges(graph) {
    return graph.faces_edges.map(function (edges) {
      return edges.map(function (edge) {
        return graph.edges_vertices[edge];
      }).map(function (pairs, i, arr) {
        var next = arr[(i + 1) % arr.length];
        return pairs[0] === next[0] || pairs[0] === next[1] ? pairs[1] : pairs[0];
      });
    });
  };
  var makeFacesEdgesFromVertices = function makeFacesEdgesFromVertices(graph) {
    var map = makeVerticesToEdgeBidirectional(graph);
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
  var makeFacesFaces = function makeFacesFaces(_ref21) {
    var faces_vertices = _ref21.faces_vertices;
    var faces_faces = faces_vertices.map(function () {
      return [];
    });
    var edgeMap = {};
    faces_vertices.map(function (face, f) {
      return face.map(function (v0, i, arr) {
        var v1 = arr[(i + 1) % face.length];
        if (v1 < v0) {
          var _ref22 = [v1, v0];
          v0 = _ref22[0];
          v1 = _ref22[1];
        }
        var key = "".concat(v0, " ").concat(v1);
        if (edgeMap[key] === undefined) {
          edgeMap[key] = {};
        }
        edgeMap[key][f] = true;
      });
    });
    Object.values(edgeMap).map(function (obj) {
      return Object.keys(obj);
    }).filter(function (arr) {
      return arr.length > 1;
    }).forEach(function (pair) {
      faces_faces[pair[0]].push(parseInt(pair[1]));
      faces_faces[pair[1]].push(parseInt(pair[0]));
    });
    return faces_faces;
  };
  var makeFacesPolygon = function makeFacesPolygon(_ref23, epsilon) {
    var vertices_coords = _ref23.vertices_coords,
        faces_vertices = _ref23.faces_vertices;
    return faces_vertices.map(function (verts) {
      return verts.map(function (v) {
        return vertices_coords[v];
      });
    }).map(function (polygon) {
      return math.core.makePolygonNonCollinear(polygon, epsilon);
    });
  };
  var makeFacesPolygonQuick = function makeFacesPolygonQuick(_ref24) {
    var vertices_coords = _ref24.vertices_coords,
        faces_vertices = _ref24.faces_vertices;
    return faces_vertices.map(function (verts) {
      return verts.map(function (v) {
        return vertices_coords[v];
      });
    });
  };
  var makeFacesCenter = function makeFacesCenter(_ref25) {
    var vertices_coords = _ref25.vertices_coords,
        faces_vertices = _ref25.faces_vertices;
    return faces_vertices.map(function (fv) {
      return fv.map(function (v) {
        return vertices_coords[v];
      });
    }).map(function (coords) {
      return math.core.centroid(coords);
    });
  };
  var makeFacesCenterQuick = function makeFacesCenterQuick(_ref26) {
    var vertices_coords = _ref26.vertices_coords,
        faces_vertices = _ref26.faces_vertices;
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
    makeVerticesEdgesUnsorted: makeVerticesEdgesUnsorted,
    makeVerticesEdges: makeVerticesEdges,
    makeVerticesVertices: makeVerticesVertices,
    makeVerticesFacesUnsorted: makeVerticesFacesUnsorted,
    makeVerticesFaces: makeVerticesFaces,
    makeVerticesToEdgeBidirectional: makeVerticesToEdgeBidirectional,
    makeVerticesToEdge: makeVerticesToEdge,
    makeVerticesToFace: makeVerticesToFace,
    makeVerticesVerticesVector: makeVerticesVerticesVector,
    makeVerticesSectors: makeVerticesSectors,
    makeEdgesEdges: makeEdgesEdges,
    makeEdgesFacesUnsorted: makeEdgesFacesUnsorted,
    makeEdgesFaces: makeEdgesFaces,
    makeEdgesFoldAngle: makeEdgesFoldAngle,
    makeEdgesAssignment: makeEdgesAssignment,
    makeEdgesCoords: makeEdgesCoords,
    makeEdgesVector: makeEdgesVector,
    makeEdgesLength: makeEdgesLength,
    makeEdgesBoundingBox: makeEdgesBoundingBox,
    makePlanarFaces: makePlanarFaces,
    makeFacesVerticesFromEdges: makeFacesVerticesFromEdges,
    makeFacesEdgesFromVertices: makeFacesEdgesFromVertices,
    makeFacesFaces: makeFacesFaces,
    makeFacesPolygon: makeFacesPolygon,
    makeFacesPolygonQuick: makeFacesPolygonQuick,
    makeFacesCenter: makeFacesCenter,
    makeFacesCenterQuick: makeFacesCenterQuick
  });

  var getCircularEdges = function getCircularEdges(_ref) {
    var edges_vertices = _ref.edges_vertices;
    var circular = [];
    for (var i = 0; i < edges_vertices.length; i += 1) {
      if (edges_vertices[i][0] === edges_vertices[i][1]) {
        circular.push(i);
      }
    }
    return circular;
  };
  var getDuplicateEdges = function getDuplicateEdges(_ref2) {
    var edges_vertices = _ref2.edges_vertices;
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
  var spliceRemoveValuesFromSuffixes = function spliceRemoveValuesFromSuffixes(graph, suffix, remove_indices) {
    var remove_map = {};
    remove_indices.forEach(function (n) {
      remove_map[n] = true;
    });
    getGraphKeysWithSuffix(graph, suffix).forEach(function (sKey) {
      return graph[sKey]
      .forEach(function (elem, i) {
        for (var j = elem.length - 1; j >= 0; j--) {
          if (remove_map[elem[j]] === true) {
            graph[sKey][i].splice(j, 1);
          }
        }
      });
    });
  };
  var removeCircularEdges = function removeCircularEdges(graph, remove_indices) {
    if (!remove_indices) {
      remove_indices = getCircularEdges(graph);
    }
    if (remove_indices.length) {
      spliceRemoveValuesFromSuffixes(graph, _edges, remove_indices);
    }
    return {
      map: removeGeometryIndices(graph, _edges, remove_indices),
      remove: remove_indices
    };
  };
  var removeDuplicateEdges = function removeDuplicateEdges(graph, replace_indices) {
    if (!replace_indices) {
      replace_indices = getDuplicateEdges(graph);
    }
    var remove = Object.keys(replace_indices).map(function (n) {
      return parseInt(n);
    });
    var map = replaceGeometryIndices(graph, _edges, replace_indices);
    if (remove.length) {
      if (graph.vertices_edges || graph.vertices_vertices || graph.vertices_faces) {
        graph.vertices_edges = makeVerticesEdgesUnsorted(graph);
        graph.vertices_vertices = makeVerticesVertices(graph);
        graph.vertices_edges = makeVerticesEdges(graph);
        graph.vertices_faces = makeVerticesFaces(graph);
      }
    }
    return {
      map: map,
      remove: remove
    };
  };

  var edgesViolations = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getCircularEdges: getCircularEdges,
    getDuplicateEdges: getDuplicateEdges,
    removeCircularEdges: removeCircularEdges,
    removeDuplicateEdges: removeDuplicateEdges
  });

  var mergeSimpleNextmaps = function mergeSimpleNextmaps() {
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
  var mergeNextmaps = function mergeNextmaps() {
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
  var mergeSimpleBackmaps = function mergeSimpleBackmaps() {
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
  var mergeBackmaps = function mergeBackmaps() {
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
        if (_typeof(el) === _number) {
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
  var invertMap = function invertMap(map) {
    var inv = [];
    map.forEach(function (n, i) {
      if (n == null) {
        return;
      }
      if (_typeof(n) === _number) {
        if (inv[n] !== undefined) {
          if (_typeof(inv[n]) === _number) {
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
  var invertSimpleMap = function invertSimpleMap(map) {
    var inv = [];
    map.forEach(function (n, i) {
      inv[n] = i;
    });
    return inv;
  };

  var maps = /*#__PURE__*/Object.freeze({
    __proto__: null,
    mergeSimpleNextmaps: mergeSimpleNextmaps,
    mergeNextmaps: mergeNextmaps,
    mergeSimpleBackmaps: mergeSimpleBackmaps,
    mergeBackmaps: mergeBackmaps,
    invertMap: invertMap,
    invertSimpleMap: invertSimpleMap
  });

  var clean = function clean(graph, epsilon) {
    var change_v1 = removeDuplicateVertices(graph, epsilon);
    var change_e1 = removeCircularEdges(graph);
    var change_e2 = removeDuplicateEdges(graph);
    var change_v2 = removeIsolatedVertices(graph);
    var change_v1_backmap = invertSimpleMap(change_v1.map);
    var change_v2_remove = change_v2.remove.map(function (e) {
      return change_v1_backmap[e];
    });
    var change_e1_backmap = invertSimpleMap(change_e1.map);
    var change_e2_remove = change_e2.remove.map(function (e) {
      return change_e1_backmap[e];
    });
    return {
      vertices: {
        map: mergeSimpleNextmaps(change_v1.map, change_v2.map),
        remove: change_v1.remove.concat(change_v2_remove)
      },
      edges: {
        map: mergeSimpleNextmaps(change_e1.map, change_e2.map),
        remove: change_e1.remove.concat(change_e2_remove)
      }
    };
  };

  var validate_references = function validate_references(graph) {
    var counts = {
      vertices: count.vertices(graph),
      edges: count.edges(graph),
      faces: count.faces(graph)
    };
    var implied = {
      vertices: countImplied.vertices(graph),
      edges: countImplied.edges(graph),
      faces: countImplied.faces(graph)
    };
    return {
      vertices: counts.vertices >= implied.vertices,
      edges: counts.edges >= implied.edges,
      faces: counts.faces >= implied.faces
    };
  };
  var validate$1 = function validate(graph, epsilon) {
    var duplicate_edges = getDuplicateEdges(graph);
    var circular_edges = getCircularEdges(graph);
    var isolated_vertices = getIsolatedVertices(graph);
    var duplicate_vertices = getDuplicateVertices(graph, epsilon);
    var references = validate_references(graph);
    var is_perfect = duplicate_edges.length === 0 && circular_edges.length === 0 && isolated_vertices.length === 0 && references.vertices && references.edges && references.faces;
    var summary = is_perfect ? "valid" : "problematic";
    return {
      summary: summary,
      vertices: {
        isolated: isolated_vertices,
        duplicate: duplicate_vertices,
        references: references.vertices
      },
      edges: {
        circular: circular_edges,
        duplicate: duplicate_edges,
        references: references.edges
      },
      faces: {
        references: references.faces
      }
    };
  };

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
        graph.edges_foldAngle[i] = edgeAssignmentToFoldAngle(graph.edges_assignment[i]);
      }
    }
    if (graph.edges_foldAngle.length > graph.edges_assignment.length) {
      for (var _i = graph.edges_assignment.length; _i < graph.edges_foldAngle.length; _i += 1) {
        graph.edges_assignment[_i] = edgeFoldAngleToAssignment(graph.edges_foldAngle[_i]);
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
      var faces = makePlanarFaces(graph);
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
      graph.faces_edges = makeFacesEdgesFromVertices(graph);
    } else if (graph.faces_edges && !graph.faces_vertices) {
      graph.faces_vertices = makeFacesVerticesFromEdges(graph);
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
    graph.vertices_edges = makeVerticesEdgesUnsorted(graph);
    graph.vertices_vertices = makeVerticesVertices(graph);
    graph.vertices_edges = makeVerticesEdges(graph);
    build_assignments_if_needed(graph);
    build_faces_if_needed(graph, reface);
    graph.vertices_faces = makeVerticesFaces(graph);
    graph.edges_faces = makeEdgesFacesUnsorted(graph);
    graph.faces_faces = makeFacesFaces(graph);
    return graph;
  };

  var getEdgesVerticesOverlappingSpan = function getEdgesVerticesOverlappingSpan(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    return makeEdgesBoundingBox(graph, epsilon).map(function (min_max) {
      return graph.vertices_coords.map(function (vert) {
        return vert[0] > min_max.min[0] && vert[1] > min_max.min[1] && vert[0] < min_max.max[0] && vert[1] < min_max.max[1];
      });
    });
  };
  var getEdgesEdgesOverlapingSpans = function getEdgesEdgesOverlapingSpans(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        edges_coords = _ref.edges_coords;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var min_max = makeEdgesBoundingBox({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_coords: edges_coords
    }, epsilon);
    var span_overlaps = edges_vertices.map(function () {
      return [];
    });
    for (var e0 = 0; e0 < edges_vertices.length - 1; e0 += 1) {
      for (var e1 = e0 + 1; e1 < edges_vertices.length; e1 += 1) {
        var outside_of = (min_max[e0].max[0] < min_max[e1].min[0] || min_max[e1].max[0] < min_max[e0].min[0]) && (min_max[e0].max[1] < min_max[e1].min[1] || min_max[e1].max[1] < min_max[e0].min[1]);
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
    getEdgesVerticesOverlappingSpan: getEdgesVerticesOverlappingSpan,
    getEdgesEdgesOverlapingSpans: getEdgesEdgesOverlapingSpans
  });

  var getOppositeVertices$1 = function getOppositeVertices(graph, vertex, edges) {
    edges.forEach(function (edge) {
      if (graph.edges_vertices[edge][0] === vertex && graph.edges_vertices[edge][1] === vertex) {
        console.warn("removePlanarVertex circular edge");
      }
    });
    return edges.map(function (edge) {
      return graph.edges_vertices[edge][0] === vertex ? graph.edges_vertices[edge][1] : graph.edges_vertices[edge][0];
    });
  };
  var isVertexCollinear = function isVertexCollinear(graph, vertex) {
    var _math$core;
    var edges = graph.vertices_edges[vertex];
    if (edges === undefined || edges.length !== 2) {
      return false;
    }
    var vertices = getOppositeVertices$1(graph, vertex, edges);
    var vectors = [[vertices[0], vertex], [vertex, vertices[1]]].map(function (verts) {
      return verts.map(function (v) {
        return graph.vertices_coords[v];
      });
    }).map(function (segment) {
      return math.core.subtract(segment[1], segment[0]);
    }).map(function (vector) {
      return math.core.normalize(vector);
    });
    return math.core.fnEpsilonEqual(1.0, (_math$core = math.core).dot.apply(_math$core, _toConsumableArray(vectors)));
  };
  var getVerticesEdgesOverlap = function getVerticesEdgesOverlap(_ref) {
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
    var edges_span_vertices = getEdgesVerticesOverlappingSpan({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_coords: edges_coords
    }, epsilon);
    for (var e = 0; e < edges_coords.length; e += 1) {
      for (var v = 0; v < vertices_coords.length; v += 1) {
        if (!edges_span_vertices[e][v]) {
          continue;
        }
        edges_span_vertices[e][v] = math.core.overlapLinePoint(math.core.subtract(edges_coords[e][1], edges_coords[e][0]), edges_coords[e][0], vertices_coords[v], math.core.excludeS, epsilon);
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

  var vertices_collinear = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isVertexCollinear: isVertexCollinear,
    getVerticesEdgesOverlap: getVerticesEdgesOverlap
  });

  var makeEdgesLineParallelOverlap = function makeEdgesLineParallelOverlap(_ref, vector, point) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices;
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.core.EPSILON;
    var normalized = math.core.normalize2(vector);
    var edges_origin = edges_vertices.map(function (ev) {
      return vertices_coords[ev[0]];
    });
    var edges_vector = edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return vertices_coords[v];
      });
    }).map(function (edge) {
      return math.core.subtract2(edge[1], edge[0]);
    });
    var overlap = edges_vector.map(function (vec) {
      return math.core.parallel2(vec, vector, epsilon);
    });
    for (var e = 0; e < edges_vertices.length; e++) {
      if (!overlap[e]) {
        continue;
      }
      if (math.core.equivalentVector2(edges_origin[e], point)) {
        overlap[e] = true;
        continue;
      }
      var vec = math.core.normalize2(math.core.subtract2(edges_origin[e], point));
      var dot = Math.abs(math.core.dot2(vec, normalized));
      overlap[e] = Math.abs(1.0 - dot) < epsilon;
    }
    return overlap;
  };
  var makeEdgesSegmentIntersection = function makeEdgesSegmentIntersection(_ref2, point1, point2) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices,
        edges_coords = _ref2.edges_coords;
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.core.EPSILON;
    if (!edges_coords) {
      edges_coords = makeEdgesCoords({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var segment_box = math.core.boundingBox([point1, point2], epsilon);
    var segment_vector = math.core.subtract2(point2, point1);
    return makeEdgesBoundingBox({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_coords: edges_coords
    }, epsilon).map(function (box) {
      return math.core.overlapBoundingBoxes(segment_box, box);
    }).map(function (overlap, i) {
      return overlap ? math.core.intersectLineLine(segment_vector, point1, math.core.subtract2(edges_coords[i][1], edges_coords[i][0]), edges_coords[i][0], math.core.includeS, math.core.includeS, epsilon) : undefined;
    });
  };
  var makeEdgesEdgesIntersection = function makeEdgesEdgesIntersection(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        edges_vertices = _ref3.edges_vertices,
        edges_vector = _ref3.edges_vector,
        edges_origin = _ref3.edges_origin;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    if (!edges_vector) {
      edges_vector = makeEdgesVector({
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
    var span = getEdgesEdgesOverlapingSpans({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices
    }, epsilon);
    for (var i = 0; i < edges_vector.length - 1; i += 1) {
      for (var j = i + 1; j < edges_vector.length; j += 1) {
        if (span[i][j] !== true) {
          edges_intersections[i][j] = undefined;
          continue;
        }
        edges_intersections[i][j] = math.core.intersectLineLine(edges_vector[i], edges_origin[i], edges_vector[j], edges_origin[j], math.core.excludeS, math.core.excludeS, epsilon);
        edges_intersections[j][i] = edges_intersections[i][j];
      }
    }
    return edges_intersections;
  };
  var intersectConvexFaceLine = function intersectConvexFaceLine(_ref4, face, vector, point) {
    var vertices_coords = _ref4.vertices_coords,
        edges_vertices = _ref4.edges_vertices,
        faces_vertices = _ref4.faces_vertices,
        faces_edges = _ref4.faces_edges;
    var epsilon = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : math.core.EPSILON;
    var face_vertices_indices = faces_vertices[face].map(function (v) {
      return vertices_coords[v];
    }).map(function (coord) {
      return math.core.overlapLinePoint(vector, point, coord, function () {
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
      return math.core.intersectLineLine(vector, point, math.core.subtract(seg[1], seg[0]), seg[0], math.core.includeL, math.core.excludeS, epsilon);
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

  var intersect = /*#__PURE__*/Object.freeze({
    __proto__: null,
    makeEdgesLineParallelOverlap: makeEdgesLineParallelOverlap,
    makeEdgesSegmentIntersection: makeEdgesSegmentIntersection,
    makeEdgesEdgesIntersection: makeEdgesEdgesIntersection,
    intersectConvexFaceLine: intersectConvexFaceLine
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
    var edges_intersections = makeEdgesEdgesIntersection({
      vertices_coords: graph.vertices_coords,
      edges_vertices: graph.edges_vertices,
      edges_vector: edges_vector,
      edges_origin: edges_origin
    }, 1e-6);
    var edges_collinear_vertices = getVerticesEdgesOverlap({
      vertices_coords: graph.vertices_coords,
      edges_vertices: graph.edges_vertices,
      edges_coords: edges_coords
    }, epsilon);
    if (edges_intersections.flat().filter(function (a) {
      return a !== undefined;
    }).length === 0 && edges_collinear_vertices.flat().filter(function (a) {
      return a !== undefined;
    }).length === 0) {
      return;
    }
    var counts = {
      vertices: graph.vertices_coords.length
    };
    edges_intersections.forEach(function (edge) {
      return edge.filter(function (a) {
        return a !== undefined;
      }).filter(function (a) {
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
      return arr.filter(function (a) {
        return a !== undefined;
      });
    });
    graph.edges_vertices.forEach(function (verts, i) {
      return verts.push.apply(verts, _toConsumableArray(edges_intersections_flat[i]).concat(_toConsumableArray(edges_collinear_vertices[i])));
    });
    graph.edges_vertices.forEach(function (edge, i) {
      graph.edges_vertices[i] = sortVerticesAlongVector({
        vertices_coords: graph.vertices_coords
      }, edge, edges_vector[i]);
    });
    var edge_map = graph.edges_vertices.map(function (edge, i) {
      return Array(edge.length - 1).fill(i);
    }).flat();
    graph.edges_vertices = graph.edges_vertices.map(function (edge) {
      return Array.from(Array(edge.length - 1)).map(function (_, i, arr) {
        return [edge[i], edge[i + 1]];
      });
    }).flat();
    if (graph.edges_assignment && graph.edges_foldAngle && graph.edges_foldAngle.length > graph.edges_assignment.length) {
      for (var i = graph.edges_assignment.length; i < graph.edges_foldAngle.length; i += 1) {
        graph.edges_assignment[i] = edgeFoldAngleToAssignment(graph.edges_foldAngle[i]);
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
        return a === undefined ? edgeAssignmentToFoldAngle(graph.edges_assignment[i]) : a;
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
      return getGraphKeysWithPrefix(graph, key);
    }).flat().filter(function (key) {
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
      var resVert = removeDuplicateVertices(graph, epsilon / 2);
      var resEdgeDup = removeDuplicateEdges(graph);
      var resEdgeCirc = removeCircularEdges(graph);
      var resFrag = fragment_graph(graph, epsilon);
      if (resFrag === undefined) {
        change.vertices.map = change.vertices.map === undefined ? resVert.map : mergeNextmaps(change.vertices.map, resVert.map);
        change.edges.map = change.edges.map === undefined ? mergeNextmaps(resEdgeDup.map, resEdgeCirc.map) : mergeNextmaps(change.edges.map, resEdgeDup.map, resEdgeCirc.map);
        break;
      }
      var invert_frag = invertMap(resFrag.edges.backmap);
      var edgemap = mergeNextmaps(resEdgeDup.map, resEdgeCirc.map, invert_frag);
      change.vertices.map = change.vertices.map === undefined ? resVert.map : mergeNextmaps(change.vertices.map, resVert.map);
      change.edges.map = change.edges.map === undefined ? edgemap : mergeNextmaps(change.edges.map, edgemap);
    }
    if (i === 20) {
      console.warn("fragment reached max iterations");
    }
    return change;
  };

  var getBoundaryVertices = function getBoundaryVertices(_ref) {
    var edges_vertices = _ref.edges_vertices,
        edges_assignment = _ref.edges_assignment;
    return uniqueIntegers(edges_vertices.filter(function (_, i) {
      return edges_assignment[i] === "B" || edges_assignment[i] === "b";
    }).flat());
  };
  var emptyBoundaryObject = function emptyBoundaryObject() {
    return {
      vertices: [],
      edges: []
    };
  };
  var getBoundary = function getBoundary(_ref2) {
    var vertices_edges = _ref2.vertices_edges,
        edges_vertices = _ref2.edges_vertices,
        edges_assignment = _ref2.edges_assignment;
    if (edges_assignment === undefined) {
      return emptyBoundaryObject();
    }
    if (!vertices_edges) {
      vertices_edges = makeVerticesEdgesUnsorted({
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
      return emptyBoundaryObject();
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
        return emptyBoundaryObject();
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
  var getPlanarBoundary = function getPlanarBoundary(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        vertices_edges = _ref3.vertices_edges,
        vertices_vertices = _ref3.vertices_vertices,
        edges_vertices = _ref3.edges_vertices;
    if (!vertices_vertices) {
      vertices_vertices = makeVerticesVertices({
        vertices_coords: vertices_coords,
        vertices_edges: vertices_edges,
        edges_vertices: edges_vertices
      });
    }
    var edge_map = makeVerticesToEdgeBidirectional({
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
    getBoundaryVertices: getBoundaryVertices,
    getBoundary: getBoundary,
    getPlanarBoundary: getPlanarBoundary
  });

  var apply_matrix_to_graph = function apply_matrix_to_graph(graph, matrix) {
    filterKeysWithSuffix(graph, "coords").forEach(function (key) {
      graph[key] = graph[key].map(function (v) {
        return math.core.resize(3, v);
      }).map(function (v) {
        return math.core.multiplyMatrix3Vector3(matrix, v);
      });
    });
    filterKeysWithSuffix(graph, "matrix").forEach(function (key) {
      graph[key] = graph[key].map(function (m) {
        return math.core.multiplyMatrices3(m, matrix);
      });
    });
    return graph;
  };
  var transform_scale = function transform_scale(graph, scale) {
    var _math$core;
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    var vector = (_math$core = math.core).getVector.apply(_math$core, args);
    var vector3 = math.core.resize(3, vector);
    var matrix = math.core.makeMatrix3Scale(scale, vector3);
    return apply_matrix_to_graph(graph, matrix);
  };
  var transform_translate = function transform_translate(graph) {
    var _math$core2, _math$core3;
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    var vector = (_math$core2 = math.core).getVector.apply(_math$core2, args);
    var vector3 = math.core.resize(3, vector);
    var matrix = (_math$core3 = math.core).makeMatrix3Translate.apply(_math$core3, _toConsumableArray(vector3));
    return apply_matrix_to_graph(graph, matrix);
  };
  var transform_rotateZ = function transform_rotateZ(graph, angle) {
    var _math$core4, _math$core5;
    for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }
    var vector = (_math$core4 = math.core).getVector.apply(_math$core4, args);
    var vector3 = math.core.resize(3, vector);
    var matrix = (_math$core5 = math.core).makeMatrix3RotateZ.apply(_math$core5, [angle].concat(_toConsumableArray(vector3)));
    return apply_matrix_to_graph(graph, matrix);
  };
  var transform = {
    scale: transform_scale,
    translate: transform_translate,
    rotateZ: transform_rotateZ,
    transform: apply_matrix_to_graph
  };

  var getFaceFaceSharedVertices = function getFaceFaceSharedVertices(face_a_vertices, face_b_vertices) {
    var hash = {};
    face_b_vertices.forEach(function (v) {
      hash[v] = true;
    });
    var match = face_a_vertices.map(function (v) {
      return hash[v] ? true : false;
    });
    var shared_vertices = [];
    var notShared = match.indexOf(false);
    var already_added = {};
    for (var i = notShared + 1; i < match.length; i += 1) {
      if (match[i] && !already_added[face_a_vertices[i]]) {
        shared_vertices.push(face_a_vertices[i]);
        already_added[face_a_vertices[i]] = true;
      }
    }
    for (var _i = 0; _i < notShared; _i += 1) {
      if (match[_i] && !already_added[face_a_vertices[_i]]) {
        shared_vertices.push(face_a_vertices[_i]);
        already_added[face_a_vertices[_i]] = true;
      }
    }
    return shared_vertices;
  };
  var makeFaceSpanningTree = function makeFaceSpanningTree(_ref) {
    var faces_vertices = _ref.faces_vertices,
        faces_faces = _ref.faces_faces;
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!faces_faces) {
      faces_faces = makeFacesFaces({
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
        return getFaceFaceSharedVertices(faces_vertices[el.face], faces_vertices[el.parent]);
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

  var faceSpanningTree = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getFaceFaceSharedVertices: getFaceFaceSharedVertices,
    makeFaceSpanningTree: makeFaceSpanningTree
  });

  var multiplyVerticesFacesMatrix2 = function multiplyVerticesFacesMatrix2(_ref, faces_matrix) {
    var vertices_coords = _ref.vertices_coords,
        vertices_faces = _ref.vertices_faces,
        faces_vertices = _ref.faces_vertices;
    if (!vertices_faces) {
      vertices_faces = makeVerticesFaces({
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
      return math.core.multiplyMatrix2Vector2(vertices_matrix[i], coord);
    });
  };
  var unassigned_angle = {
    U: true,
    u: true
  };
  var makeFacesMatrix = function makeFacesMatrix(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices,
        edges_foldAngle = _ref2.edges_foldAngle,
        edges_assignment = _ref2.edges_assignment,
        faces_vertices = _ref2.faces_vertices,
        faces_faces = _ref2.faces_faces;
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!edges_assignment && edges_foldAngle) {
      edges_assignment = makeEdgesAssignment({
        edges_foldAngle: edges_foldAngle
      });
    }
    if (!edges_foldAngle) {
      if (edges_assignment) {
        edges_foldAngle = makeEdgesFoldAngle({
          edges_assignment: edges_assignment
        });
      } else {
        edges_foldAngle = Array(edges_vertices.length).fill(0);
      }
    }
    var edge_map = makeVerticesToEdgeBidirectional({
      edges_vertices: edges_vertices
    });
    var faces_matrix = faces_vertices.map(function () {
      return math.core.identity3x4;
    });
    makeFaceSpanningTree({
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
        var local_matrix = math.core.makeMatrix3Rotate(foldAngle,
        (_math$core = math.core).subtract.apply(_math$core, _toConsumableArray(math.core.resizeUp(coords[1], coords[0]))),
        coords[0]
        );
        faces_matrix[entry.face] = math.core.multiplyMatrices3(faces_matrix[entry.parent], local_matrix);
      });
    });
    return faces_matrix;
  };
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
  var makeEdgesIsFolded = function makeEdgesIsFolded(_ref3) {
    var edges_vertices = _ref3.edges_vertices,
        edges_foldAngle = _ref3.edges_foldAngle,
        edges_assignment = _ref3.edges_assignment;
    if (edges_assignment === undefined) {
      return edges_foldAngle === undefined ? edges_vertices.map(function (_) {
        return true;
      }) : edges_foldAngle.map(function (angle) {
        return angle < -math.core.EPSILON || angle > math.core.EPSILON;
      });
    }
    return edges_assignment.map(function (a) {
      return assignment_is_folded[a];
    });
  };
  var makeFacesMatrix2 = function makeFacesMatrix2(_ref4) {
    var vertices_coords = _ref4.vertices_coords,
        edges_vertices = _ref4.edges_vertices,
        edges_foldAngle = _ref4.edges_foldAngle,
        edges_assignment = _ref4.edges_assignment,
        faces_vertices = _ref4.faces_vertices,
        faces_faces = _ref4.faces_faces;
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!edges_foldAngle) {
      if (edges_assignment) {
        edges_foldAngle = makeEdgesFoldAngle({
          edges_assignment: edges_assignment
        });
      } else {
        edges_foldAngle = Array(edges_vertices.length).fill(0);
      }
    }
    var edges_is_folded = makeEdgesIsFolded({
      edges_vertices: edges_vertices,
      edges_foldAngle: edges_foldAngle,
      edges_assignment: edges_assignment
    });
    var edge_map = makeVerticesToEdgeBidirectional({
      edges_vertices: edges_vertices
    });
    var faces_matrix = faces_vertices.map(function () {
      return math.core.identity2x3;
    });
    makeFaceSpanningTree({
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
        var local_matrix = edges_is_folded[edge] ? math.core.makeMatrix2Reflect(reflect_vector, reflect_origin) : math.core.identity2x3;
        faces_matrix[entry.face] = math.core.multiplyMatrices2(faces_matrix[entry.parent], local_matrix);
      });
    });
    return faces_matrix;
  };

  var facesMatrix = /*#__PURE__*/Object.freeze({
    __proto__: null,
    multiplyVerticesFacesMatrix2: multiplyVerticesFacesMatrix2,
    makeFacesMatrix: makeFacesMatrix,
    makeEdgesIsFolded: makeEdgesIsFolded,
    makeFacesMatrix2: makeFacesMatrix2
  });

  var makeVerticesCoordsFolded = function makeVerticesCoordsFolded(_ref, root_face) {
    var vertices_coords = _ref.vertices_coords,
        vertices_faces = _ref.vertices_faces,
        edges_vertices = _ref.edges_vertices,
        edges_foldAngle = _ref.edges_foldAngle,
        edges_assignment = _ref.edges_assignment,
        faces_vertices = _ref.faces_vertices,
        faces_faces = _ref.faces_faces,
        faces_matrix = _ref.faces_matrix;
    faces_matrix = makeFacesMatrix({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_foldAngle: edges_foldAngle,
      edges_assignment: edges_assignment,
      faces_vertices: faces_vertices,
      faces_faces: faces_faces
    }, root_face);
    if (!vertices_faces) {
      vertices_faces = makeVerticesFaces({
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
      return math.core.multiplyMatrix3Vector3(vertices_matrix[i], coord);
    });
  };
  var makeVerticesCoordsFlatFolded = function makeVerticesCoordsFlatFolded(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices,
        edges_foldAngle = _ref2.edges_foldAngle,
        edges_assignment = _ref2.edges_assignment,
        faces_vertices = _ref2.faces_vertices,
        faces_faces = _ref2.faces_faces;
    var root_face = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var edges_is_folded = makeEdgesIsFolded({
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
    var edge_map = makeVerticesToEdgeBidirectional({
      edges_vertices: edges_vertices
    });
    makeFaceSpanningTree({
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

  var verticesCoordsFolded = /*#__PURE__*/Object.freeze({
    __proto__: null,
    makeVerticesCoordsFolded: makeVerticesCoordsFolded,
    makeVerticesCoordsFlatFolded: makeVerticesCoordsFlatFolded
  });

  var makeFacesWindingFromMatrix = function makeFacesWindingFromMatrix(faces_matrix) {
    return faces_matrix.map(function (m) {
      return m[0] * m[4] - m[1] * m[3];
    }).map(function (c) {
      return c >= 0;
    });
  };
  var makeFacesWindingFromMatrix2 = function makeFacesWindingFromMatrix2(faces_matrix) {
    return faces_matrix.map(function (m) {
      return m[0] * m[3] - m[1] * m[2];
    }).map(function (c) {
      return c >= 0;
    });
  };
  var makeFacesWinding = function makeFacesWinding(_ref) {
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

  var facesWinding = /*#__PURE__*/Object.freeze({
    __proto__: null,
    makeFacesWindingFromMatrix: makeFacesWindingFromMatrix,
    makeFacesWindingFromMatrix2: makeFacesWindingFromMatrix2,
    makeFacesWinding: makeFacesWinding
  });

  var explodeFaces = function explodeFaces(graph) {
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
  var explodeShrinkFaces = function explodeShrinkFaces(_ref) {
    var vertices_coords = _ref.vertices_coords,
        faces_vertices = _ref.faces_vertices;
    var shrink = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.333;
    var graph = explodeFaces({
      vertices_coords: vertices_coords,
      faces_vertices: faces_vertices
    });
    var faces_winding = makeFacesWinding(graph);
    var faces_vectors = graph.faces_vertices.map(function (vertices) {
      return vertices.map(function (v) {
        return graph.vertices_coords[v];
      });
    }).map(function (points) {
      return points.map(function (p, i, arr) {
        return math.core.subtract2(p, arr[(i + 1) % arr.length]);
      });
    });
    var faces_centers = makeFacesCenterQuick({
      vertices_coords: vertices_coords,
      faces_vertices: faces_vertices
    });
    var faces_point_distances = faces_vertices.map(function (vertices) {
      return vertices.map(function (v) {
        return vertices_coords[v];
      });
    }).map(function (points, f) {
      return points.map(function (point) {
        return math.core.distance2(point, faces_centers[f]);
      });
    });
    console.log("faces_point_distances", faces_point_distances);
    var faces_bisectors = faces_vectors.map(function (vectors, f) {
      return vectors.map(function (vector, i, arr) {
        return [vector, math.core.flip(arr[(i - 1 + arr.length) % arr.length])];
      }).map(function (pair) {
        var _math$core, _math$core2;
        return faces_winding[f] ? (_math$core = math.core).counterClockwiseBisect2.apply(_math$core, _toConsumableArray(pair)) : (_math$core2 = math.core).clockwiseBisect2.apply(_math$core2, _toConsumableArray(pair));
      });
    }).map(function (vectors, f) {
      return vectors.map(function (vector, i) {
        return math.core.scale(vector, faces_point_distances[f][i]);
      });
    });
    graph.faces_vertices.forEach(function (vertices, f) {
      return vertices.forEach(function (v, i) {
        graph.vertices_coords[v] = math.core.add2(graph.vertices_coords[v], math.core.scale2(faces_bisectors[f][i], -shrink));
      });
    });
    return graph;
  };

  var explodeFacesMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    explodeFaces: explodeFaces,
    explodeShrinkFaces: explodeShrinkFaces
  });

  var nearestVertex = function nearestVertex(_ref, point) {
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
  var nearestEdge = function nearestEdge(_ref2, point) {
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
      return math.core.nearestPointOnLine(math.core.subtract(e[1], e[0]), e[0], point, math.core.segmentLimiter);
    });
    return math.core.smallestComparisonSearch(point, nearest_points, math.core.distance);
  };
  var faceContainingPoint = function faceContainingPoint(_ref3, point) {
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
      return math.core.overlapConvexPolygonPoint(f.face, point);
    }).shift();
    return face === undefined ? undefined : face.i;
  };
  var nearestFace = function nearestFace(graph, point) {
    var face = faceContainingPoint(graph, point);
    if (face !== undefined) {
      return face;
    }
    if (graph.edges_faces) {
      var edge = nearestEdge(graph, point);
      var faces = graph.edges_faces[edge];
      if (faces.length === 1) {
        return faces[0];
      }
      if (faces.length > 1) {
        var faces_center = makeFacesCenterQuick({
          vertices_coords: graph.vertices_coords,
          faces_vertices: faces.map(function (f) {
            return graph.faces_vertices[f];
          })
        });
        var distances = faces_center.map(function (center) {
          return math.core.distance(center, point);
        });
        var shortest = 0;
        for (var i = 0; i < distances.length; i++) {
          if (distances[i] < distances[shortest]) {
            shortest = i;
          }
        }
        return faces[shortest];
      }
    }
  };

  var nearest = /*#__PURE__*/Object.freeze({
    __proto__: null,
    nearestVertex: nearestVertex,
    nearestEdge: nearestEdge,
    faceContainingPoint: faceContainingPoint,
    nearestFace: nearestFace
  });

  var clone = function clone(o) {
    var newO;
    var i;
    if (_typeof(o) !== _object) {
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

  var addVertices = function addVertices(graph, vertices_coords) {
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

  var findAdjacentFacesToEdge = function findAdjacentFacesToEdge(_ref, edge) {
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
      console.warn("todo: findAdjacentFacesToEdge");
    }
  };

  var splitEdgeIntoTwo = function splitEdgeIntoTwo(graph, edge_index, new_vertex) {
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

  var update_vertices_vertices$2 = function update_vertices_vertices(_ref, vertex, incident_vertices) {
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
  var update_vertices_sectors = function update_vertices_sectors(_ref2, vertex) {
    var vertices_coords = _ref2.vertices_coords,
        vertices_vertices = _ref2.vertices_vertices,
        vertices_sectors = _ref2.vertices_sectors;
    if (!vertices_sectors) {
      return;
    }
    vertices_sectors[vertex] = vertices_vertices[vertex].length === 1 ? [math.core.TWO_PI] : math.core.counterClockwiseSectors2(vertices_vertices[vertex].map(function (v) {
      return math.core.subtract2(vertices_coords[v], vertices_coords[vertex]);
    }));
  };
  var update_vertices_edges$2 = function update_vertices_edges(_ref3, old_edge, new_vertex, vertices, new_edges) {
    var vertices_edges = _ref3.vertices_edges;
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
  var update_vertices_faces$1 = function update_vertices_faces(_ref4, vertex, faces) {
    var vertices_faces = _ref4.vertices_faces;
    if (!vertices_faces) {
      return;
    }
    vertices_faces[vertex] = _toConsumableArray(faces);
  };
  var update_edges_faces$1 = function update_edges_faces(_ref5, new_edges, faces) {
    var edges_faces = _ref5.edges_faces;
    if (!edges_faces) {
      return;
    }
    new_edges.forEach(function (edge) {
      return edges_faces[edge] = _toConsumableArray(faces);
    });
  };
  var update_faces_vertices = function update_faces_vertices(_ref6, new_vertex, incident_vertices, faces) {
    var faces_vertices = _ref6.faces_vertices;
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
  var update_faces_edges_with_vertices = function update_faces_edges_with_vertices(_ref7, faces) {
    var edges_vertices = _ref7.edges_vertices,
        faces_vertices = _ref7.faces_vertices,
        faces_edges = _ref7.faces_edges;
    var edge_map = makeVerticesToEdgeBidirectional({
      edges_vertices: edges_vertices
    });
    faces.map(function (f) {
      return faces_vertices[f].map(function (vertex, i, arr) {
        return [vertex, arr[(i + 1) % arr.length]];
      }).map(function (pair) {
        return edge_map[pair.join(" ")];
      });
    }).forEach(function (edges, i) {
      faces_edges[faces[i]] = edges;
    });
  };

  var splitEdge = function splitEdge(graph, old_edge, coords) {
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
    splitEdgeIntoTwo(graph, old_edge, vertex).forEach(function (edge, i) {
      return Object.keys(edge).forEach(function (key) {
        graph[key][new_edges[i]] = edge[key];
      });
    });
    update_vertices_vertices$2(graph, vertex, incident_vertices);
    update_vertices_sectors(graph, vertex);
    update_vertices_edges$2(graph, old_edge, vertex, incident_vertices, new_edges);
    var incident_faces = findAdjacentFacesToEdge(graph, old_edge);
    if (incident_faces) {
      update_vertices_faces$1(graph, vertex, incident_faces);
      update_edges_faces$1(graph, new_edges, incident_faces);
      update_faces_vertices(graph, vertex, incident_vertices, incident_faces);
      update_faces_edges_with_vertices(graph, incident_faces);
    }
    var edge_map = removeGeometryIndices(graph, _edges, [old_edge]);
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
    var faces = splitCircularArray(faces_vertices[face], indices).map(function (fv) {
      return {
        faces_vertices: fv
      };
    });
    if (faces_edges) {
      var vertices_to_edge = makeVerticesToEdgeBidirectional({
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
      var res = splitEdge(graph, map ? map[el.edge] : el.edge, el.coords);
      map = map ? mergeNextmaps(map, res.edges.map) : res.edges.map;
      return res;
    });
    vertices.push.apply(vertices, _toConsumableArray(split_results.map(function (res) {
      return res.vertex;
    })));
    var bkmap;
    split_results.forEach(function (res) {
      res.edges.remove = bkmap ? bkmap[res.edges.remove] : res.edges.remove;
      var inverted = invertSimpleMap(res.edges.map);
      bkmap = bkmap ? mergeBackmaps(bkmap, inverted) : inverted;
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

  var warning = "splitFace potentially given a non-convex face";
  var update_vertices_vertices$1 = function update_vertices_vertices(_ref, edge) {
    var vertices_coords = _ref.vertices_coords,
        vertices_vertices = _ref.vertices_vertices,
        edges_vertices = _ref.edges_vertices;
    var v0 = edges_vertices[edge][0];
    var v1 = edges_vertices[edge][1];
    vertices_vertices[v0] = sortVerticesCounterClockwise({
      vertices_coords: vertices_coords
    }, vertices_vertices[v0].concat(v1), v0);
    vertices_vertices[v1] = sortVerticesCounterClockwise({
      vertices_coords: vertices_coords
    }, vertices_vertices[v1].concat(v0), v1);
  };
  var update_vertices_edges$1 = function update_vertices_edges(_ref2, edge) {
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
    var vertices_replacement_faces = {};
    new_faces.forEach(function (f, i) {
      return graph.faces_vertices[f].forEach(function (v) {
        if (!vertices_replacement_faces[v]) {
          vertices_replacement_faces[v] = [];
        }
        vertices_replacement_faces[v].push(f);
      });
    });
    graph.faces_vertices[old_face].forEach(function (v) {
      var _graph$vertices_faces;
      var index = graph.vertices_faces[v].indexOf(old_face);
      var replacements = vertices_replacement_faces[v];
      if (index === -1 || !replacements) {
        console.warn(warning);
        return;
      }
      (_graph$vertices_faces = graph.vertices_faces[v]).splice.apply(_graph$vertices_faces, [index, 1].concat(_toConsumableArray(replacements)));
    });
  };
  var update_edges_faces = function update_edges_faces(graph, old_face, new_edge, new_faces) {
    var edges_replacement_faces = {};
    new_faces.forEach(function (f, i) {
      return graph.faces_edges[f].forEach(function (e) {
        if (!edges_replacement_faces[e]) {
          edges_replacement_faces[e] = [];
        }
        edges_replacement_faces[e].push(f);
      });
    });
    var edges = [].concat(_toConsumableArray(graph.faces_edges[old_face]), [new_edge]);
    edges.forEach(function (e) {
      var _graph$edges_faces$e;
      var replacements = edges_replacement_faces[e];
      var indices = [];
      for (var i = 0; i < graph.edges_faces[e].length; i++) {
        if (graph.edges_faces[e][i] === old_face) {
          indices.push(i);
        }
      }
      if (indices.length === 0 || !replacements) {
        console.warn(warning);
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

  var splitFace = function splitFace(graph, face, vector, point, epsilon) {
    var intersect = intersectConvexFaceLine(graph, face, vector, point, epsilon);
    if (intersect === undefined) {
      return undefined;
    }
    var result = split_at_intersections(graph, intersect);
    result.edges["new"] = rebuild_edge(graph, face, result.vertices);
    update_vertices_vertices$1(graph, result.edges["new"]);
    update_vertices_edges$1(graph, result.edges["new"]);
    var faces = build_faces(graph, face, result.vertices);
    update_vertices_faces(graph, face, faces);
    update_edges_faces(graph, face, result.edges["new"], faces);
    update_faces_faces(graph, face, faces);
    var faces_map = removeGeometryIndices(graph, _faces, [face]);
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
    validate: validate$1,
    populate: populate,
    fragment: fragment,
    addVertices: addVertices,
    splitEdge: splitEdge,
    faceSpanningTree: makeFaceSpanningTree,
    explodeFaces: explodeFaces,
    explodeShrinkFaces: explodeShrinkFaces
  }, transform);
  Object.keys(graphMethods).forEach(function (key) {
    Graph.prototype[key] = function () {
      return graphMethods[key].apply(graphMethods, [this].concat(Array.prototype.slice.call(arguments)));
    };
  });
  Graph.prototype.splitFace = function (face) {
    var _math$core;
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    var line = (_math$core = math.core).getLine.apply(_math$core, args);
    return splitFace(this, face, line.vector, line.origin);
  };
  Graph.prototype.copy = function () {
    return Object.assign(Object.create(this.__proto__), clone(this));
  };
  Graph.prototype.clear = function () {
    var _this = this;
    foldKeys.graph.forEach(function (key) {
      return delete _this[key];
    });
    foldKeys.orders.forEach(function (key) {
      return delete _this[key];
    });
    delete this.file_frames;
    return this;
  };
  Graph.prototype.boundingBox = function () {
    return math.rect.fromPoints(this.vertices_coords);
  };
  Graph.prototype.unitize = function () {
    if (!this.vertices_coords) {
      return;
    }
    var box = math.core.bounding_box(this.vertices_coords);
    var longest = Math.max.apply(Math, _toConsumableArray(box.span));
    var scale = longest === 0 ? 1 : 1 / longest;
    var origin = box.min;
    this.vertices_coords = this.vertices_coords.map(function (coord) {
      return math.core.subtract(coord, origin);
    }).map(function (coord) {
      return coord.map(function (n, i) {
        return n * scale;
      });
    });
    return this;
  };
  Graph.prototype.folded = function () {
    var vertices_coords = this.faces_matrix2 ? multiplyVerticesFacesMatrix2(this, this.faces_matrix2) : makeVerticesCoordsFolded.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    return Object.assign(
    Object.create(this.__proto__), Object.assign(clone(this), {
      vertices_coords: vertices_coords,
      frame_classes: [_foldedForm]
    }));
  };
  Graph.prototype.flatFolded = function () {
    var vertices_coords = this.faces_matrix2 ? multiplyVerticesFacesMatrix2(this, this.faces_matrix2) : makeVerticesCoordsFlatFolded.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    return Object.assign(
    Object.create(this.__proto__), Object.assign(clone(this), {
      vertices_coords: vertices_coords,
      frame_classes: [_foldedForm]
    }));
  };
  var shortenKeys = function shortenKeys(el, i, arr) {
    var _this2 = this;
    var object = Object.create(null);
    Object.keys(el).forEach(function (k) {
      object[k.substring(_this2.length + 1)] = el[k];
    });
    return object;
  };
  var getComponent = function getComponent(key) {
    return transposeGraphArrays(this, key).map(shortenKeys.bind(key)).map(setup[key].bind(this));
  };
  [_vertices, _edges, _faces].forEach(function (key) {
    return Object.defineProperty(Graph.prototype, key, {
      enumerable: true,
      get: function get() {
        return getComponent.call(this, key);
      }
    });
  });
  Object.defineProperty(Graph.prototype, _boundary, {
    enumerable: true,
    get: function get() {
      var _this3 = this;
      var boundary = getBoundary(this);
      var poly = boundary.vertices.map(function (v) {
        return _this3.vertices_coords[v];
      });
      Object.keys(boundary).forEach(function (key) {
        poly[key] = boundary[key];
      });
      return Object.assign(poly, boundary);
    }
  });
  var nearestMethods = {
    vertices: nearestVertex,
    edges: nearestEdge,
    faces: nearestFace
  };
  Graph.prototype.nearest = function () {
    var _this4 = this;
    var point = math.core.getVector(arguments);
    var nears = Object.create(null);
    var cache = {};
    [_vertices, _edges, _faces].forEach(function (key) {
      Object.defineProperty(nears, singularize[key], {
        enumerable: true,
        get: function get() {
          if (cache[key] !== undefined) {
            return cache[key];
          }
          cache[key] = nearestMethods[key](_this4, point);
          return cache[key];
        }
      });
      filterKeysWithPrefix(_this4, key).forEach(function (fold_key) {
        return Object.defineProperty(nears, fold_key, {
          enumerable: true,
          get: function get() {
            return _this4[fold_key][nears[singularize[key]]];
          }
        });
      });
    });
    return nears;
  };
  var GraphProto = Graph.prototype;

  var clip = function clip(graph, line) {
    var polygon = getBoundary(graph).vertices.map(function (v) {
      return graph.vertices_coords[v];
    });
    var vector = line.vector ? line.vector : ear.math.subtract2(line[1], line[0]);
    var origin = line.origin ? line.origin : line[0];
    var fn_line = line.domain_function ? line.domain_function : includeL;
    return math.core.clipLineConvexPolygon(polygon, vector, origin, math.core.include, fn_line);
  };

  var addEdges = function addEdges(graph, edges_vertices) {
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
    var index_map = removeDuplicateEdges(graph).map;
    return indices.map(function (i) {
      return index_map[i];
    });
  };

  var add_segment_edges = function add_segment_edges(graph, segment_vertices, pre_edge_map) {
    var unfiltered_segment_edges_vertices = Array.from(Array(segment_vertices.length - 1)).map(function (_, i) {
      return [segment_vertices[i], segment_vertices[i + 1]];
    });
    var seg_not_exist_yet = unfiltered_segment_edges_vertices.map(function (verts) {
      return verts.join(" ");
    }).map(function (str, i) {
      return pre_edge_map[str] === undefined;
    });
    var segment_edges_vertices = unfiltered_segment_edges_vertices.filter(function (_, i) {
      return seg_not_exist_yet[i];
    });
    var segment_edges = Array.from(Array(segment_edges_vertices.length)).map(function (_, i) {
      return graph.edges_vertices.length + i;
    });
    segment_edges.forEach(function (e, i) {
      graph.edges_vertices[e] = segment_edges_vertices[i];
    });
    if (graph.edges_assignment) {
      segment_edges.forEach(function (e) {
        graph.edges_assignment[e] = "U";
      });
    }
    if (graph.edges_foldAngle) {
      segment_edges.forEach(function (e) {
        graph.edges_foldAngle[e] = 0;
      });
    }
    for (var i = 0; i < segment_vertices.length; i++) {
      var vertex = segment_vertices[i];
      var prev = seg_not_exist_yet[i - 1] ? segment_vertices[i - 1] : undefined;
      var next = seg_not_exist_yet[i] ? segment_vertices[i + 1] : undefined;
      var new_adjacent_vertices = [prev, next].filter(function (a) {
        return a !== undefined;
      });
      var previous_vertices_vertices = graph.vertices_vertices[vertex] ? graph.vertices_vertices[vertex] : [];
      var unsorted_vertices_vertices = previous_vertices_vertices.concat(new_adjacent_vertices);
      graph.vertices_vertices[vertex] = sortVerticesCounterClockwise(graph, unsorted_vertices_vertices, segment_vertices[i]);
    }
    var edge_map = makeVerticesToEdgeBidirectional(graph);
    var _loop = function _loop(_i) {
      var vertex = segment_vertices[_i];
      graph.vertices_edges[vertex] = graph.vertices_vertices[vertex].map(function (v) {
        return edge_map["".concat(vertex, " ").concat(v)];
      });
    };
    for (var _i = 0; _i < segment_vertices.length; _i++) {
      _loop(_i);
    }
    segment_vertices.map(function (center) {
      return graph.vertices_vertices[center].length === 1 ? [math.core.TWO_PI] : math.core.counterClockwiseSectors2(graph.vertices_vertices[center].map(function (v) {
        return math.core.subtract2(graph.vertices_coords[v], graph.vertices_coords[center]);
      }));
    }).forEach(function (sectors, i) {
      graph.vertices_sectors[segment_vertices[i]] = sectors;
    });
    return segment_edges;
  };
  var addPlanarSegment = function addPlanarSegment(graph, point1, point2) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.core.EPSILON;
    if (!graph.vertices_sectors) {
      graph.vertices_sectors = makeVerticesSectors(graph);
    }
    var segment = [point1, point2].map(function (p) {
      return [p[0], p[1]];
    });
    var segment_vector = math.core.subtract2(segment[1], segment[0]);
    var intersections = makeEdgesSegmentIntersection(graph, segment[0], segment[1], epsilon);
    var intersected_edges = intersections.map(function (pt, e) {
      return pt === undefined ? undefined : e;
    }).filter(function (a) {
      return a !== undefined;
    }).sort(function (a, b) {
      return a - b;
    });
    var faces_map = {};
    intersected_edges.forEach(function (e) {
      return graph.edges_faces[e].forEach(function (f) {
        faces_map[f] = true;
      });
    });
    var intersected_faces = Object.keys(faces_map).map(function (s) {
      return parseInt(s);
    }).sort(function (a, b) {
      return a - b;
    });
    var splitEdge_results = intersected_edges.reverse().map(function (edge) {
      return splitEdge(graph, edge, intersections[edge], epsilon);
    });
    var splitEdge_vertices = splitEdge_results.map(function (el) {
      return el.vertex;
    });
    var endpoint_vertices = addVertices(graph, segment, epsilon);
    var new_vertex_hash = {};
    splitEdge_vertices.forEach(function (v) {
      new_vertex_hash[v] = true;
    });
    endpoint_vertices.forEach(function (v) {
      new_vertex_hash[v] = true;
    });
    var new_vertices = Object.keys(new_vertex_hash).map(function (n) {
      return parseInt(n);
    });
    var segment_vertices = sortVerticesAlongVector(graph, new_vertices, segment_vector);
    var edge_map = makeVerticesToEdgeBidirectional(graph);
    var segment_edges = add_segment_edges(graph, segment_vertices, edge_map);
    segment_edges.forEach(function (e) {
      var v = graph.edges_vertices[e];
      edge_map["".concat(v[0], " ").concat(v[1])] = e;
      edge_map["".concat(v[1], " ").concat(v[0])] = e;
    });
    var face_walk_start_pairs = segment_vertices.map(function (v, i) {
      return graph.vertices_vertices[v].map(function (adj_v) {
        return [[adj_v, v], [v, adj_v]];
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var walked_edges = {};
    var all_walked_faces = face_walk_start_pairs.map(function (pair) {
      return counterClockwiseWalk(graph, pair[0], pair[1], walked_edges);
    }).filter(function (a) {
      return a !== undefined;
    });
    var walked_faces = filterWalkedBoundaryFace(all_walked_faces);
    removeGeometryIndices(graph, "faces", intersected_faces);
    var new_faces = walked_faces.map(function (_, i) {
      return graph.faces_vertices.length + i;
    });
    if (graph.faces_vertices) {
      new_faces.forEach(function (f, i) {
        graph.faces_vertices[f] = walked_faces[i].vertices;
      });
    }
    if (graph.faces_edges) {
      new_faces.forEach(function (f, i) {
        graph.faces_edges[f] = walked_faces[i].edges.map(function (pair) {
          return edge_map[pair];
        });
      });
    }
    if (graph.faces_angles) {
      new_faces.forEach(function (f, i) {
        graph.faces_angles[f] = walked_faces[i].faces_angles;
      });
    }
    if (graph.vertices_faces) {
      graph.vertices_faces = makeVerticesFaces(graph);
    }
    if (graph.edges_faces) {
      graph.edges_faces = makeEdgesFacesUnsorted(graph);
    }
    if (graph.faces_faces) {
      graph.faces_faces = makeFacesFaces(graph);
    }
    if (graph.vertices_coords.length !== graph.vertices_vertices.length || graph.vertices_coords.length !== graph.vertices_edges.length || graph.vertices_coords.length !== graph.vertices_faces.length) {
      console.warn("vertices mismatch", JSON.parse(JSON.stringify(graph)));
    }
    if (graph.edges_vertices.length !== graph.edges_faces.length || graph.edges_vertices.length !== graph.edges_assignment.length) {
      console.warn("edges mismatch", JSON.parse(JSON.stringify(graph)));
    }
    if (graph.faces_vertices.length !== graph.faces_edges.length || graph.faces_vertices.length !== graph.faces_faces.length) {
      console.warn("faces mismatch", JSON.parse(JSON.stringify(graph)));
    }
    return segment_edges;
  };

  var update_vertices_vertices = function update_vertices_vertices(_ref, vertices) {
    var vertices_vertices = _ref.vertices_vertices;
    var other = [vertices[1], vertices[0]];
    vertices.map(function (v, i) {
      return vertices_vertices[v].indexOf(other[i]);
    }).forEach(function (index, i) {
      return vertices_vertices[vertices[i]].splice(index, 1);
    });
  };
  var update_vertices_edges = function update_vertices_edges(_ref2, edge, vertices) {
    var vertices_edges = _ref2.vertices_edges;
    vertices.map(function (v, i) {
      return vertices_edges[v].indexOf(edge);
    }).forEach(function (index, i) {
      return vertices_edges[vertices[i]].splice(index, 1);
    });
  };
  var join_faces = function join_faces(graph, faces, edge, vertices) {
    [faces[1], faces[0]];
    var faces_edge_index = faces.map(function (f) {
      return graph.faces_edges[f].indexOf(edge);
    });
    var faces_vertices_index = [];
    faces.forEach(function (face, f) {
      return graph.faces_vertices[face].forEach(function (v, i, arr) {
        var next = arr[(i + 1) % arr.length];
        if (v === vertices[0] && next === vertices[1] || v === vertices[1] && next === vertices[0]) {
          faces_vertices_index[f] = i;
        }
      });
    });
    if (faces_vertices_index[0] === undefined || faces_vertices_index[1] === undefined) {
      console.warn("removePlanarEdge error joining faces");
    }
    var edges_len_before = faces.map(function (f) {
      return graph.faces_edges[f].length;
    });
    var vertices_len_before = faces.map(function (f) {
      return graph.faces_vertices[f].length;
    });
    var edges_len_after = edges_len_before.map(function (len) {
      return len - 1;
    });
    var vertices_len_after = vertices_len_before.map(function (len) {
      return len - 1;
    });
    var faces_edge_keep = faces_edge_index.map(function (e, i) {
      return (e + 1) % edges_len_before[i];
    });
    var faces_vertex_keep = faces_vertices_index.map(function (v, i) {
      return (v + 1) % vertices_len_before[i];
    });
    var new_faces_edges = faces.map(function (face, f) {
      return Array.from(Array(edges_len_after[f])).map(function (_, i) {
        return (faces_edge_keep[f] + i) % edges_len_before[f];
      }).map(function (index) {
        return graph.faces_edges[face][index];
      });
    });
    var new_faces_vertices = faces.map(function (face, f) {
      return Array.from(Array(vertices_len_after[f])).map(function (_, i) {
        return (faces_vertex_keep[f] + i) % vertices_len_before[f];
      }).map(function (index) {
        return graph.faces_vertices[face][index];
      });
    });
    var new_faces_faces = faces.map(function (f) {
      return graph.faces_faces[f];
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []).filter(function (f) {
      return f !== faces[0] && f !== faces[1];
    });
    return {
      vertices: new_faces_vertices[0].concat(new_faces_vertices[1]),
      edges: new_faces_edges[0].concat(new_faces_edges[1]),
      faces: new_faces_faces
    };
  };
  var removePlanarEdge = function removePlanarEdge(graph, edge) {
    var vertices = _toConsumableArray(graph.edges_vertices[edge]).sort(function (a, b) {
      return b - a;
    });
    var faces = _toConsumableArray(graph.edges_faces[edge]);
    update_vertices_vertices(graph, vertices);
    update_vertices_edges(graph, edge, vertices);
    var vertices_should_remove = vertices.map(function (v) {
      return graph.vertices_vertices[v].length === 0;
    });
    var remove_vertices = vertices.filter(function (vertex, i) {
      return vertices_should_remove[i];
    });
    if (faces.length === 2 && faces[0] !== faces[1]) {
      var new_face = graph.faces_vertices.length;
      var new_face_data = join_faces(graph, faces, edge, vertices);
      graph.faces_vertices.push(new_face_data.vertices);
      graph.faces_edges.push(new_face_data.edges);
      graph.faces_faces.push(new_face_data.faces);
      graph.vertices_faces.forEach(function (arr, i) {
        var already_added = false;
        arr.forEach(function (face, j) {
          if (face === faces[0] || face === faces[1]) {
            graph.vertices_faces[i][j] = new_face;
            already_added ? arr.splice(i, 1) : arr.splice(i, 1, new_face);
            already_added = true;
          }
        });
      });
      graph.edges_faces.forEach(function (arr, i) {
        return arr.forEach(function (face, j) {
          if (face === faces[0] || face === faces[1]) {
            graph.edges_faces[i][j] = new_face;
          }
        });
      });
      graph.faces_faces.forEach(function (arr, i) {
        return arr.forEach(function (face, j) {
          if (face === faces[0] || face === faces[1]) {
            graph.faces_faces[i][j] = new_face;
          }
        });
      });
      graph.faces_vertices.forEach(function (fv) {
        return fv.forEach(function (f) {
          if (f === undefined) {
            console.log("FOUND ONE before remove", graph.faces_vertices);
          }
        });
      });
      removeGeometryIndices(graph, "faces", faces);
    }
    if (faces.length === 2 && faces[0] === faces[1] && remove_vertices.length) {
      var face = faces[0];
      graph.faces_vertices[face] = graph.faces_vertices[face].filter(function (v) {
        return !remove_vertices.includes(v);
      }).filter(function (v, i, arr) {
        return v !== arr[(i + 1) % arr.length];
      });
      graph.faces_edges[face] = graph.faces_edges[face].filter(function (e) {
        return e !== edge;
      });
    }
    removeGeometryIndices(graph, "edges", [edge]);
    removeGeometryIndices(graph, "vertices", remove_vertices);
  };

  var getOppositeVertices = function getOppositeVertices(graph, vertex, edges) {
    edges.forEach(function (edge) {
      if (graph.edges_vertices[edge][0] === vertex && graph.edges_vertices[edge][1] === vertex) {
        console.warn("removePlanarVertex circular edge");
      }
    });
    return edges.map(function (edge) {
      return graph.edges_vertices[edge][0] === vertex ? graph.edges_vertices[edge][1] : graph.edges_vertices[edge][0];
    });
  };
  var removePlanarVertex = function removePlanarVertex(graph, vertex) {
    var edges = graph.vertices_edges[vertex];
    var faces = uniqueSortedIntegers(graph.vertices_faces[vertex].filter(function (a) {
      return a != null;
    }));
    if (edges.length !== 2 || faces.length > 2) {
      console.warn("cannot remove non 2-degree vertex yet (e,f)", edges, faces);
      return;
    }
    var vertices = getOppositeVertices(graph, vertex, edges);
    var vertices_reverse = vertices.slice().reverse();
    edges.sort(function (a, b) {
      return a - b;
    });
    vertices.forEach(function (v) {
      var index = graph.vertices_edges[v].indexOf(edges[1]);
      if (index === -1) {
        return;
      }
      graph.vertices_edges[v][index] = edges[0];
    });
    vertices.forEach(function (v, i) {
      var index = graph.vertices_vertices[v].indexOf(vertex);
      if (index === -1) {
        console.warn("removePlanarVertex unknown vertex issue");
        return;
      }
      graph.vertices_vertices[v][index] = vertices_reverse[i];
    });
    graph.edges_vertices[edges[0]] = _toConsumableArray(vertices);
    faces.forEach(function (face) {
      var index = graph.faces_vertices[face].indexOf(vertex);
      if (index === -1) {
        console.warn("removePlanarVertex unknown face_vertex issue");
        return;
      }
      graph.faces_vertices[face].splice(index, 1);
    });
    faces.forEach(function (face) {
      var index = graph.faces_edges[face].indexOf(edges[1]);
      if (index === -1) {
        console.warn("removePlanarVertex unknown face_edge issue");
        return;
      }
      graph.faces_edges[face].splice(index, 1);
    });
    removeGeometryIndices(graph, "vertices", [vertex]);
    removeGeometryIndices(graph, "edges", [edges[1]]);
  };

  var alternatingSum = function alternatingSum(numbers) {
    return [0, 1].map(function (even_odd) {
      return numbers.filter(function (_, i) {
        return i % 2 === even_odd;
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    });
  };
  var alternatingSumDifference = function alternatingSumDifference(sectors) {
    var halfsum = sectors.reduce(function (a, b) {
      return a + b;
    }, 0) / 2;
    return alternatingSum(sectors).map(function (s) {
      return s - halfsum;
    });
  };
  var kawasakiSolutionsRadians = function kawasakiSolutionsRadians(radians) {
    return radians
    .map(function (v, i, arr) {
      return [v, arr[(i + 1) % arr.length]];
    }).map(function (pair) {
      var _math$core;
      return (_math$core = math.core).counterClockwiseAngleRadians.apply(_math$core, _toConsumableArray(pair));
    })
    .map(function (_, i, arr) {
      return arr.slice(i + 1, arr.length).concat(arr.slice(0, i));
    })
    .map(function (opposite_sectors) {
      return alternatingSum(opposite_sectors).map(function (s) {
        return Math.PI - s;
      });
    })
    .map(function (kawasakis, i) {
      return radians[i] + kawasakis[0];
    })
    .map(function (angle, i) {
      return math.core.isCounterClockwiseBetween(angle, radians[i], radians[(i + 1) % radians.length]) ? angle : undefined;
    });
  };
  var kawasakiSolutionsVectors = function kawasakiSolutionsVectors(vectors) {
    var vectors_radians = vectors.map(function (v) {
      return Math.atan2(v[1], v[0]);
    });
    return kawasakiSolutionsRadians(vectors_radians).map(function (a) {
      return a === undefined ? undefined : [Math.cos(a), Math.sin(a)];
    });
  };

  var kawasakiMath = /*#__PURE__*/Object.freeze({
    __proto__: null,
    alternatingSum: alternatingSum,
    alternatingSumDifference: alternatingSumDifference,
    kawasakiSolutionsRadians: kawasakiSolutionsRadians,
    kawasakiSolutionsVectors: kawasakiSolutionsVectors
  });

  var flat_assignment = {
    B: true,
    b: true,
    F: true,
    f: true,
    U: true,
    u: true
  };
  var vertices_flat = function vertices_flat(_ref) {
    var vertices_edges = _ref.vertices_edges,
        edges_assignment = _ref.edges_assignment;
    return vertices_edges.map(function (edges) {
      return edges.map(function (e) {
        return flat_assignment[edges_assignment[e]];
      }).reduce(function (a, b) {
        return a && b;
      }, true);
    }).map(function (valid, i) {
      return valid ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var folded_assignments = {
    M: true,
    m: true,
    V: true,
    v: true
  };
  var maekawa_signs = {
    M: -1,
    m: -1,
    V: 1,
    v: 1
  };
  var validateMaekawa = function validateMaekawa(_ref2) {
    var edges_vertices = _ref2.edges_vertices,
        vertices_edges = _ref2.vertices_edges,
        edges_assignment = _ref2.edges_assignment;
    if (!vertices_edges) {
      vertices_edges = makeVerticesEdgesUnsorted({
        edges_vertices: edges_vertices
      });
    }
    var is_valid = vertices_edges.map(function (edges) {
      return edges.map(function (e) {
        return maekawa_signs[edges_assignment[e]];
      }).filter(function (a) {
        return a !== undefined;
      }).reduce(function (a, b) {
        return a + b;
      }, 0);
    }).map(function (sum) {
      return sum === 2 || sum === -2;
    });
    getBoundaryVertices({
      edges_vertices: edges_vertices,
      edges_assignment: edges_assignment
    }).forEach(function (v) {
      is_valid[v] = true;
    });
    vertices_flat({
      vertices_edges: vertices_edges,
      edges_assignment: edges_assignment
    }).forEach(function (v) {
      is_valid[v] = true;
    });
    return is_valid.map(function (valid, v) {
      return !valid ? v : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var validateKawasaki = function validateKawasaki(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        vertices_vertices = _ref3.vertices_vertices,
        vertices_edges = _ref3.vertices_edges,
        edges_vertices = _ref3.edges_vertices,
        edges_assignment = _ref3.edges_assignment,
        edges_vector = _ref3.edges_vector;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    if (!vertices_vertices) {
      vertices_vertices = makeVerticesVertices({
        vertices_coords: vertices_coords,
        vertices_edges: vertices_edges,
        edges_vertices: edges_vertices
      });
    }
    var is_valid = makeVerticesVerticesVector({
      vertices_coords: vertices_coords,
      vertices_vertices: vertices_vertices,
      edges_vertices: edges_vertices,
      edges_vector: edges_vector
    }).map(function (vectors, v) {
      return vectors.filter(function (_, i) {
        return folded_assignments[edges_assignment[vertices_edges[v][i]]];
      });
    }).map(function (vectors) {
      return vectors.length > 1 ? math.core.counterClockwiseSectors2(vectors) : [0, 0];
    }).map(function (sectors) {
      return alternating_sum(sectors);
    }).map(function (pair, v) {
      return Math.abs(pair[0] - pair[1]) < epsilon;
    });
    getBoundaryVertices({
      edges_vertices: edges_vertices,
      edges_assignment: edges_assignment
    }).forEach(function (v) {
      is_valid[v] = true;
    });
    vertices_flat({
      vertices_edges: vertices_edges,
      edges_assignment: edges_assignment
    }).forEach(function (v) {
      is_valid[v] = true;
    });
    return is_valid.map(function (valid, v) {
      return !valid ? v : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
  };

  var validateSingleVertex = /*#__PURE__*/Object.freeze({
    __proto__: null,
    validateMaekawa: validateMaekawa,
    validateKawasaki: validateKawasaki
  });

  var CreasePattern = {};
  CreasePattern.prototype = Object.create(GraphProto);
  CreasePattern.prototype.constructor = CreasePattern;
  var arcResolution = 96;
  var make_edges_array = function make_edges_array(array) {
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
      var edges = addPlanarSegment(this, segment[0], segment[1]);
      return make_edges_array.call(this, edges);
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
        var verts = addVertices(_this2, segment);
        vertices.push.apply(vertices, _toConsumableArray(verts));
        edges.push.apply(edges, _toConsumableArray(addEdges(_this2, verts)));
      });
      var map = fragment(this).edges.map;
      populate(this);
      return make_edges_array.call(this, edges.map(function (e) {
        return map[e];
      }).reduce(function (a, b) {
        return a.concat(b);
      }, []));
    };
  });
  CreasePattern.prototype.removeEdge = function (edge) {
    var _this3 = this;
    var vertices = this.edges_vertices[edge];
    removePlanarEdge(this, edge);
    vertices.map(function (v) {
      return isVertexCollinear(_this3, v);
    }).map(function (collinear, i) {
      return collinear ? vertices[i] : undefined;
    }).filter(function (a) {
      return a !== undefined;
    }).sort(function (a, b) {
      return b - a;
    }).forEach(function (v) {
      return removePlanarVertex(_this3, v);
    });
    return true;
  };
  CreasePattern.prototype.validate = function (epsilon) {
    var valid = validate$1(this, epsilon);
    valid.vertices.kawasaki = validateKawasaki(this, epsilon);
    valid.vertices.maekawa = validateMaekawa(this);
    if (this.edges_foldAngle) {
      valid.edges.not_flat = this.edges_foldAngle.map(function (angle, i) {
        return edgeFoldAngleIsFlat(angle) ? undefined : i;
      }).filter(function (a) {
        return a !== undefined;
      });
    }
    if (valid.summary === "valid") {
      if (valid.vertices.kawasaki.length || valid.vertices.maekawa.length) {
        valid.summary = "invalid";
      } else if (valid.edges.not_flat.length) {
        valid.summary = "not flat";
      }
    }
    return valid;
  };
  var CreasePatternProto = CreasePattern.prototype;

  var foldFacesLayer = function foldFacesLayer(faces_layer, faces_folding) {
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
  var unfolded_assignment = {
    F: true,
    f: true,
    U: true,
    u: true
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
  var flatFold = function flatFold(graph, vector, origin) {
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
      graph.faces_matrix2 = makeFacesMatrix2(graph, 0);
    }
    graph.faces_winding = makeFacesWindingFromMatrix2(graph.faces_matrix2);
    graph.faces_crease = graph.faces_matrix2.map(math.core.invertMatrix2).map(function (matrix) {
      return math.core.multiplyMatrix2Line2(matrix, vector, origin);
    });
    graph.faces_side = graph.faces_vertices.map(function (_, i) {
      return make_face_side(graph.faces_crease[i].vector, graph.faces_crease[i].origin, graph.faces_center[i], graph.faces_winding[i]);
    });
    var vertices_coords_folded = multiplyVerticesFacesMatrix2(graph, graph.faces_matrix2);
    var collinear_edges = makeEdgesLineParallelOverlap({
      vertices_coords: vertices_coords_folded,
      edges_vertices: graph.edges_vertices
    }, vector, origin, epsilon).map(function (is_collinear, e) {
      return is_collinear ? e : undefined;
    }).filter(function (e) {
      return e !== undefined;
    }).filter(function (e) {
      return unfolded_assignment[graph.edges_assignment[e]];
    });
    collinear_edges.map(function (e) {
      return graph.edges_faces[e].find(function (f) {
        return f != null;
      });
    }).map(function (f) {
      return graph.faces_winding[f];
    }).map(function (winding) {
      return winding ? assignment : opposite_assignment;
    }).forEach(function (assignment, e) {
      graph.edges_assignment[collinear_edges[e]] = assignment;
      graph.edges_foldAngle[collinear_edges[e]] = edgeAssignmentToFoldAngle(assignment);
    });
    var face0 = face_snapshot(graph, 0);
    var split_changes = graph.faces_vertices.map(function (_, i) {
      return i;
    }).reverse().map(function (i) {
      var face = face_snapshot(graph, i);
      var change = splitFace(graph, i, face.crease.vector, face.crease.origin, epsilon);
      if (change === undefined) {
        return undefined;
      }
      graph.edges_assignment[change.edges["new"]] = face.winding ? assignment : opposite_assignment;
      graph.edges_foldAngle[change.edges["new"]] = edgeAssignmentToFoldAngle(graph.edges_assignment[change.edges["new"]]);
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
    var faces_map = mergeNextmaps.apply(void 0, _toConsumableArray(split_changes.map(function (el) {
      return el.faces.map;
    })));
    var edges_map = mergeNextmaps.apply(void 0, _toConsumableArray(split_changes.map(function (el) {
      return el.edges.map;
    }).filter(function (a) {
      return a !== undefined;
    })));
    var faces_remove = split_changes.map(function (el) {
      return el.faces.remove;
    }).reverse();
    graph.faces_layer = foldFacesLayer(graph.faces_layer, graph.faces_side);
    var face0_was_split = faces_map && faces_map[0].length === 2;
    var face0_newIndex = face0_was_split ? faces_map[0].filter(function (f) {
      return graph.faces_side[f];
    }).shift() : 0;
    var face0_preMatrix = face0.matrix;
    if (assignment !== opposite_assignment) {
      face0_preMatrix = !face0_was_split && !graph.faces_side[0] ? face0.matrix : math.core.multiplyMatrices2(face0.matrix, math.core.makeMatrix2Reflect(face0.crease.vector, face0.crease.origin));
    }
    graph.faces_matrix2 = makeFacesMatrix2(graph, face0_newIndex).map(function (matrix) {
      return math.core.multiplyMatrices2(face0_preMatrix, matrix);
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
    var line = math.core.getLine(arguments);
    flatFold(this, line.vector, line.origin);
    return this;
  };
  var OrigamiProto = Origami.prototype;

  var isFoldedForm = function isFoldedForm(graph) {
    return graph.frame_classes && graph.frame_classes.includes("foldedForm") || graph.file_classes && graph.file_classes.includes("foldedForm");
  };

  var query = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isFoldedForm: isFoldedForm
  });

  var makeEdgesFacesOverlap = function makeEdgesFacesOverlap(_ref, epsilon) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        edges_vector = _ref.edges_vector,
        edges_faces = _ref.edges_faces;
        _ref.faces_edges;
        var faces_vertices = _ref.faces_vertices;
    if (!edges_vector) {
      edges_vector = makeEdgesVector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var faces_winding = makeFacesWinding({
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
          return math.core.overlapConvexPolygonPoint(faces_vertices_coords[f], point, math.core.exclude, epsilon);
        }).reduce(function (a, b) {
          return a || b;
        }, false);
        if (point_in_poly) {
          matrix[e][f] = true;
          return;
        }
        var edge_intersect = math.core.intersectConvexPolygonLine(faces_vertices_coords[f], edges_vector[e], edges_origin[e], math.core.excludeS, math.core.excludeS, epsilon);
        if (edge_intersect) {
          matrix[e][f] = true;
          return;
        }
        matrix[e][f] = false;
      });
    });
    return matrix;
  };
  var makeFacesFacesOverlap = function makeFacesFacesOverlap(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        faces_vertices = _ref2.faces_vertices;
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var matrix = Array.from(Array(faces_vertices.length)).map(function () {
      return Array.from(Array(faces_vertices.length));
    });
    var faces_polygon = makeFacesPolygon({
      vertices_coords: vertices_coords,
      faces_vertices: faces_vertices
    }, epsilon);
    for (var i = 0; i < faces_vertices.length - 1; i++) {
      for (var j = i + 1; j < faces_vertices.length; j++) {
        var overlap = math.core.overlapConvexPolygons(faces_polygon[i], faces_polygon[j], epsilon);
        matrix[i][j] = overlap;
        matrix[j][i] = overlap;
      }
    }
    return matrix;
  };

  var overlap = /*#__PURE__*/Object.freeze({
    __proto__: null,
    makeEdgesFacesOverlap: makeEdgesFacesOverlap,
    makeFacesFacesOverlap: makeFacesFacesOverlap
  });

  var makeEdgesEdgesParallel = function makeEdgesEdgesParallel(_ref, epsilon) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        edges_vector = _ref.edges_vector;
    if (!edges_vector) {
      edges_vector = makeEdgesVector({
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
  var overwriteEdgesOverlaps = function overwriteEdgesOverlaps(matrix, vectors, origins, func, epsilon) {
    for (var i = 0; i < matrix.length - 1; i++) {
      for (var j = i + 1; j < matrix.length; j++) {
        if (!matrix[i][j]) {
          continue;
        }
        matrix[i][j] = math.core.overlapLineLine(vectors[i], origins[i], vectors[j], origins[j], func, func, epsilon);
        matrix[j][i] = matrix[i][j];
      }
    }
  };
  var makeEdgesEdgesCrossing = function makeEdgesEdgesCrossing(_ref2, epsilon) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices,
        edges_vector = _ref2.edges_vector;
    if (!edges_vector) {
      edges_vector = makeEdgesVector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var edges_origin = edges_vertices.map(function (verts) {
      return vertices_coords[verts[0]];
    });
    var matrix = makeEdgesEdgesParallel({
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
    overwriteEdgesOverlaps(matrix, edges_vector, edges_origin, math.core.excludeS, epsilon);
    return matrix;
  };
  var makeEdgesEdgesParallelOverlap = function makeEdgesEdgesParallelOverlap(_ref3, epsilon) {
    var vertices_coords = _ref3.vertices_coords,
        edges_vertices = _ref3.edges_vertices,
        edges_vector = _ref3.edges_vector;
    if (!edges_vector) {
      edges_vector = makeEdgesVector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    var edges_origin = edges_vertices.map(function (verts) {
      return vertices_coords[verts[0]];
    });
    var matrix = makeEdgesEdgesParallel({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_vector: edges_vector
    }, epsilon);
    overwriteEdgesOverlaps(matrix, edges_vector, edges_origin, math.core.excludeS, epsilon);
    return matrix;
  };

  var edgesEdges = /*#__PURE__*/Object.freeze({
    __proto__: null,
    makeEdgesEdgesParallel: makeEdgesEdgesParallel,
    makeEdgesEdgesCrossing: makeEdgesEdgesCrossing,
    makeEdgesEdgesParallelOverlap: makeEdgesEdgesParallelOverlap
  });

  var subgraph = function subgraph(graph, components) {
    var remove_indices = {};
    var sorted_components = {};
    [_faces, _edges, _vertices].forEach(function (key) {
      remove_indices[key] = Array.from(Array(count[key](graph))).map(function (_, i) {
        return i;
      });
      sorted_components[key] = uniqueSortedIntegers(components[key] || []).reverse();
    });
    Object.keys(sorted_components).forEach(function (key) {
      return sorted_components[key].forEach(function (i) {
        return remove_indices[key].splice(i, 1);
      });
    });
    var res = JSON.parse(JSON.stringify(graph));
    Object.keys(remove_indices).forEach(function (key) {
      return removeGeometryIndices(res, key, remove_indices[key]);
    });
    return res;
  };

  var graph_methods = Object.assign(Object.create(null), {
    count: count,
    countImplied: countImplied,
    validate: validate$1,
    clean: clean,
    populate: populate,
    remove: removeGeometryIndices,
    replace: replaceGeometryIndices,
    removePlanarVertex: removePlanarVertex,
    removePlanarEdge: removePlanarEdge,
    addVertices: addVertices,
    addEdges: addEdges,
    splitEdge: splitEdge,
    splitFace: splitFace,
    flatFold: flatFold,
    addPlanarSegment: addPlanarSegment,
    subgraph: subgraph,
    clip: clip,
    fragment: fragment,
    getVerticesClusters: getVerticesClusters,
    clone: clone
  }, make, boundary, walk, nearest, fold_spec, sort, span, maps, query, intersect, overlap, transform, verticesViolations, edgesViolations, vertices_collinear,
  edgesEdges, verticesCoordsFolded, faceSpanningTree, facesMatrix, facesWinding, explodeFacesMethods, arrays);

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
  Create.square = function () {
    var scale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return make_closed_polygon(make_rect_vertices_coords(scale, scale));
  };
  Create.rectangle = function () {
    var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return make_closed_polygon(make_rect_vertices_coords(width, height));
  };
  Create.polygon = function () {
    var sides = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return make_closed_polygon(math.core.makePolygonCircumradius(sides, radius));
  };
  Create.kite = function () {
    return populate({
      vertices_coords: [[0, 0], [Math.sqrt(2) - 1, 0], [1, 0], [1, 1 - (Math.sqrt(2) - 1)], [1, 1], [0, 1]],
      edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]],
      edges_assignment: Array.from("BBBBBBVVF")
    });
  };

  var ObjectConstructors = Object.create(null);
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
    ObjectConstructors[name] = function () {
      var argFolds = Array.from(arguments).filter(function (a) {
        return isFoldObject(a);
      })
      .map(function (obj) {
        return JSON.parse(JSON.stringify(obj));
      });
      return populate(Object.assign.apply(Object, [Object.create(ConstructorPrototypes[name]), argFolds.length ? {} : default_graph[name]()].concat(_toConsumableArray(argFolds), [{
        file_spec: file_spec,
        file_creator: file_creator
      }])));
    };
    ObjectConstructors[name].prototype = ConstructorPrototypes[name];
    ObjectConstructors[name].prototype.constructor = ObjectConstructors[name];
    Object.keys(Create).forEach(function (funcName) {
      ObjectConstructors[name][funcName] = function () {
        return ObjectConstructors[name](Create[funcName].apply(Create, arguments));
      };
    });
  });
  Object.assign(ObjectConstructors.graph, graph_methods);

  var intersectionUD = function intersectionUD(line1, line2) {
    var det = math.core.cross2(line1.normal, line2.normal);
    if (Math.abs(det) < math.core.EPSILON) {
      return undefined;
    }
    var x = line1.distance * line2.normal[1] - line2.distance * line1.normal[1];
    var y = line2.distance * line1.normal[0] - line1.distance * line2.normal[0];
    return [x / det, y / det];
  };
  var normalAxiom1 = function normalAxiom1(point1, point2) {
    var normal = math.core.normalize2(math.core.rotate90(math.core.subtract2(point2, point1)));
    return {
      normal: normal,
      distance: math.core.dot2(math.core.add2(point1, point2), normal) / 2.0
    };
  };
  var normalAxiom2 = function normalAxiom2(point1, point2) {
    var normal = math.core.normalize2(math.core.subtract2(point2, point1));
    return {
      normal: normal,
      distance: math.core.dot2(math.core.add2(point1, point2), normal) / 2.0
    };
  };
  var normalAxiom3 = function normalAxiom3(line1, line2) {
    var intersect = intersectionUD(line1, line2);
    return intersect === undefined ? [{
      normal: line1.normal,
      distance: (line1.distance + line2.distance * math.core.dot2(line1.normal, line2.normal)) / 2.0
    }] : [math.core.add2, math.core.subtract2].map(function (f) {
      return math.core.normalize2(f(line1.normal, line2.normal));
    }).map(function (normal) {
      return {
        normal: normal,
        distance: math.core.dot2(intersect, normal)
      };
    });
  };
  var normalAxiom4 = function normalAxiom4(line, point) {
    var normal = math.core.rotate90(line.normal);
    var distance = math.core.dot2(point, normal);
    return {
      normal: normal,
      distance: distance
    };
  };
  var normalAxiom5 = function normalAxiom5(line, point1, point2) {
    var p1base = math.core.dot2(point1, line.normal);
    var a = line.distance - p1base;
    var c = math.core.distance2(point1, point2);
    if (a > c) {
      return [];
    }
    var b = Math.sqrt(c * c - a * a);
    var a_vec = math.core.scale2(line.normal, a);
    var base_center = math.core.add2(point1, a_vec);
    var base_vector = math.core.scale2(math.core.rotate90(line.normal), b);
    var mirrors = b < math.core.EPSILON ? [base_center] : [math.core.add2(base_center, base_vector), math.core.subtract2(base_center, base_vector)];
    return mirrors.map(function (pt) {
      return math.core.normalize2(math.core.subtract2(point2, pt));
    }).map(function (normal) {
      return {
        normal: normal,
        distance: math.core.dot2(point1, normal)
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
  var normalAxiom6 = function normalAxiom6(line1, line2, point1, point2) {
    if (Math.abs(1.0 - math.core.dot2(line1.normal, point1) / line1.distance) < 0.02) {
      return [];
    }
    var line_vec = math.core.rotate90(line1.normal);
    var vec1 = math.core.subtract2(math.core.add2(point1, math.core.scale2(line1.normal, line1.distance)), math.core.scale2(point2, 2.0));
    var vec2 = math.core.subtract2(math.core.scale2(line1.normal, line1.distance), point1);
    var c1 = math.core.dot2(point2, line2.normal) - line2.distance;
    var c2 = 2.0 * math.core.dot2(vec2, line_vec);
    var c3 = math.core.dot2(vec2, vec2);
    var c4 = math.core.dot2(math.core.add2(vec1, vec2), line_vec);
    var c5 = math.core.dot2(vec1, vec2);
    var c6 = math.core.dot2(line_vec, line2.normal);
    var c7 = math.core.dot2(vec2, line2.normal);
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
      return math.core.add2(math.core.scale2(line1.normal, line1.distance), math.core.scale2(line_vec, n));
    }).map(function (p) {
      return {
        p: p,
        normal: math.core.normalize2(math.core.subtract2(p, point1))
      };
    }).map(function (el) {
      return {
        normal: el.normal,
        distance: math.core.dot2(el.normal, math.core.midpoint2(el.p, point1))
      };
    });
  };
  var normalAxiom7 = function normalAxiom7(line1, line2, point) {
    var normal = math.core.rotate90(line1.normal);
    var norm_norm = math.core.dot2(normal, line2.normal);
    if (Math.abs(norm_norm) < math.core.EPSILON) {
      return undefined;
    }
    var a = math.core.dot2(point, normal);
    var b = math.core.dot2(point, line2.normal);
    var distance = (line2.distance + 2.0 * a * norm_norm - b) / (2.0 * norm_norm);
    return {
      normal: normal,
      distance: distance
    };
  };

  var AxiomsND = /*#__PURE__*/Object.freeze({
    __proto__: null,
    normalAxiom1: normalAxiom1,
    normalAxiom2: normalAxiom2,
    normalAxiom3: normalAxiom3,
    normalAxiom4: normalAxiom4,
    normalAxiom5: normalAxiom5,
    normalAxiom6: normalAxiom6,
    normalAxiom7: normalAxiom7
  });

  var axiom1 = function axiom1(point1, point2) {
    var _math$core;
    return {
      vector: math.core.normalize2((_math$core = math.core).subtract2.apply(_math$core, _toConsumableArray(math.core.resizeUp(point2, point1)))),
      origin: point1
    };
  };
  var axiom2 = function axiom2(point1, point2) {
    var _math$core2;
    return {
      vector: math.core.normalize2(math.core.rotate90((_math$core2 = math.core).subtract2.apply(_math$core2, _toConsumableArray(math.core.resizeUp(point2, point1))))),
      origin: math.core.midpoint2(point1, point2)
    };
  };
  var axiom3 = function axiom3(line1, line2) {
    return math.core.bisectLines2(line1.vector, line1.origin, line2.vector, line2.origin);
  };
  var axiom4 = function axiom4(line, point) {
    return {
      vector: math.core.rotate90(math.core.normalize2(line.vector)),
      origin: point
    };
  };
  var axiom5 = function axiom5(line, point1, point2) {
    return (math.core.intersectCircleLine(math.core.distance2(point1, point2), point1, line.vector, line.origin, math.core.include_l) || []).map(function (sect) {
      var _math$core3;
      return {
        vector: math.core.normalize2(math.core.rotate90((_math$core3 = math.core).subtract2.apply(_math$core3, _toConsumableArray(math.core.resizeUp(sect, point2))))),
        origin: math.core.midpoint2(point2, sect)
      };
    });
  };
  var axiom6 = function axiom6(line1, line2, point1, point2) {
    return normalAxiom6(math.core.makeNormalDistanceLine(line1), math.core.makeNormalDistanceLine(line2), point1, point2).map(math.core.makeVectorOriginLine);
  };
  var axiom7 = function axiom7(line1, line2, point) {
    var _math$core4;
    var intersect = math.core.intersectLineLine(line1.vector, line1.origin, line2.vector, point, math.core.include_l, math.core.include_l);
    return intersect === undefined ? undefined : {
      vector: math.core.normalize2(math.core.rotate90((_math$core4 = math.core).subtract2.apply(_math$core4, _toConsumableArray(math.core.resizeUp(intersect, point))))),
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

  var arrayify = function arrayify(axiomNumber, solutions) {
    switch (axiomNumber) {
      case 3:
      case "3":
      case 5:
      case "5":
      case 6:
      case "6":
        return solutions;
      default:
        return [solutions];
    }
  };

  var reflectPoint = function reflectPoint(foldLine, point) {
    var matrix = math.core.makeMatrix2Reflect(foldLine.vector, foldLine.origin);
    return math.core.multiplyMatrix2Vector2(matrix, point);
  };
  var validateAxiom1 = function validateAxiom1(params, boundary) {
    return params.points.map(function (p) {
      return math.core.overlapConvexPolygonPoint(boundary, p, math.core.include);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };
  var validateAxiom2 = validateAxiom1;
  var validateAxiom3 = function validateAxiom3(params, boundary, results) {
    var segments = params.lines.map(function (line) {
      return math.core.clipLineConvexPolygon(boundary, line.vector, line.origin, math.core.include, math.core.includeL);
    });
    if (segments[0] === undefined || segments[1] === undefined) {
      return [false, false];
    }
    var results_clip = results.map(function (line) {
      return line === undefined ? undefined : math.core.clipLineConvexPolygon(boundary, line.vector, line.origin, math.core.include, math.core.includeL);
    });
    var results_inside = [0, 1].map(function (i) {
      return results_clip[i] !== undefined;
    });
    var seg0Reflect = results.map(function (foldLine, i) {
      return foldLine === undefined ? undefined : [reflectPoint(foldLine, segments[0][0]), reflectPoint(foldLine, segments[0][1])];
    });
    var reflectMatch = seg0Reflect.map(function (seg, i) {
      return seg === undefined ? false : math.core.overlapLinePoint(math.core.subtract(segments[1][1], segments[1][0]), segments[1][0], seg[0], math.core.includeS) || math.core.overlapLinePoint(math.core.subtract(segments[1][1], segments[1][0]), segments[1][0], seg[1], math.core.includeS) || math.core.overlapLinePoint(math.core.subtract(seg[1], seg[0]), seg[0], segments[1][0], math.core.includeS) || math.core.overlapLinePoint(math.core.subtract(seg[1], seg[0]), seg[0], segments[1][1], math.core.includeS);
    });
    return [0, 1].map(function (i) {
      return reflectMatch[i] === true && results_inside[i] === true;
    });
  };
  var validateAxiom4 = function validateAxiom4(params, boundary) {
    var intersect = math.core.intersect_line_line(params.lines[0].vector, params.lines[0].origin, math.core.rotate90(params.lines[0].vector), params.points[0], math.core.includeL, math.core.includeL);
    return [params.points[0], intersect].filter(function (a) {
      return a !== undefined;
    }).map(function (p) {
      return math.core.overlapConvexPolygonPoint(boundary, p, math.core.include);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
  };
  var validateAxiom5 = function validateAxiom5(params, boundary, results) {
    if (results.length === 0) {
      return [];
    }
    var testParamPoints = params.points.map(function (point) {
      return math.core.overlapConvexPolygonPoint(boundary, point, math.core.include);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
    var testReflections = results.map(function (foldLine) {
      return reflectPoint(foldLine, params.points[1]);
    }).map(function (point) {
      return math.core.overlapConvexPolygonPoint(boundary, point, math.core.include);
    });
    return testReflections.map(function (ref) {
      return ref && testParamPoints;
    });
  };
  var validateAxiom6 = function validateAxiom6(params, boundary, results) {
    if (results.length === 0) {
      return [];
    }
    var testParamPoints = params.points.map(function (point) {
      return math.core.overlapConvexPolygonPoint(boundary, point, math.core.include);
    }).reduce(function (a, b) {
      return a && b;
    }, true);
    if (!testParamPoints) {
      return results.map(function () {
        return false;
      });
    }
    var testReflect0 = results.map(function (foldLine) {
      return reflectPoint(foldLine, params.points[0]);
    }).map(function (point) {
      return math.core.overlapConvexPolygonPoint(boundary, point, math.core.include);
    });
    var testReflect1 = results.map(function (foldLine) {
      return reflectPoint(foldLine, params.points[1]);
    }).map(function (point) {
      return math.core.overlapConvexPolygonPoint(boundary, point, math.core.include);
    });
    return results.map(function (_, i) {
      return testReflect0[i] && testReflect1[i];
    });
  };
  var validateAxiom7 = function validateAxiom7(params, boundary, result) {
    var paramPointTest = math.core.overlapConvexPolygonPoint(boundary, params.points[0], math.core.include);
    if (result === undefined) {
      return [false];
    }
    var reflected = reflectPoint(result, params.points[0]);
    var reflectTest = math.core.overlapConvexPolygonPoint(boundary, reflected, math.core.include);
    var paramLineTest = math.core.intersectConvexPolygonLine(boundary, params.lines[1].vector, params.lines[1].origin, math.core.includeS, math.core.includeL) !== undefined;
    return [paramPointTest && reflectTest && paramLineTest];
  };
  var validate = function validate(number, params, boundary, result) {
    return arrayify(number, [null, validateAxiom1, validateAxiom2, validateAxiom3, validateAxiom4, validateAxiom5, validateAxiom6, validateAxiom7][number](params, boundary, result));
  };

  var Validate = /*#__PURE__*/Object.freeze({
    __proto__: null,
    validateAxiom1: validateAxiom1,
    validateAxiom2: validateAxiom2,
    validateAxiom3: validateAxiom3,
    validateAxiom4: validateAxiom4,
    validateAxiom5: validateAxiom5,
    validateAxiom6: validateAxiom6,
    validateAxiom7: validateAxiom7,
    validate: validate
  });

  var paramsVecsToNorms = function paramsVecsToNorms(params) {
    return {
      points: params.points,
      lines: params.lines.map(math.core.makeVectorOriginLine)
    };
  };
  var spreadParams = function spreadParams(params) {
    var lines = params.lines ? params.lines : [];
    var points = params.points ? params.points : [];
    return [].concat(_toConsumableArray(lines), _toConsumableArray(points));
  };
  var axiomInBoundary = function axiomInBoundary(number) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var boundary = arguments.length > 2 ? arguments[2] : undefined;
    var solutions = arrayify(number, AxiomsVO["axiom".concat(number)].apply(AxiomsVO, _toConsumableArray(spreadParams(params))));
    if (boundary) {
      arrayify(number, Validate["validateAxiom".concat(number)](params, boundary, solutions)).forEach(function (valid, i) {
        return valid ? i : undefined;
      }).filter(function (a) {
        return a !== undefined;
      }).forEach(function (i) {
        return delete solutions[i];
      });
    }
    return solutions;
  };
  var normalAxiomInBoundary = function normalAxiomInBoundary(number) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var boundary = arguments.length > 2 ? arguments[2] : undefined;
    var solutions = arrayify(number, AxiomsND["normalAxiom".concat(number)].apply(AxiomsND, _toConsumableArray(spreadParams(params))));
    if (boundary) {
      arrayify(number, Validate["validateAxiom".concat(number)](paramsVecsToNorms(params), boundary, solutions)).forEach(function (valid, i) {
        return valid ? i : undefined;
      }).filter(function (a) {
        return a !== undefined;
      }).forEach(function (i) {
        return delete solutions[i];
      });
    }
    return solutions;
  };

  var BoundaryAxioms = /*#__PURE__*/Object.freeze({
    __proto__: null,
    axiomInBoundary: axiomInBoundary,
    normalAxiomInBoundary: normalAxiomInBoundary
  });

  var axiom = function axiom(number) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var boundary = arguments.length > 2 ? arguments[2] : undefined;
    return axiomInBoundary(number, params, boundary);
  };
  Object.keys(AxiomsVO).forEach(function (key) {
    axiom[key] = AxiomsVO[key];
  });
  Object.keys(AxiomsND).forEach(function (key) {
    axiom[key] = AxiomsND[key];
  });
  Object.keys(BoundaryAxioms).forEach(function (key) {
    axiom[key] = BoundaryAxioms[key];
  });
  Object.keys(Validate).forEach(function (key) {
    axiom[key] = Validate[key];
  });

  var line_line_for_arrows = function line_line_for_arrows(a, b) {
    return math.core.intersectLineLine(a.vector, a.origin, b.vector, b.origin, math.core.includeL, math.core.includeL);
  };
  var diagram_reflect_point = function diagram_reflect_point(foldLine, point) {
    var matrix = math.core.makeMatrix2Reflect(foldLine.vector, foldLine.origin);
    return math.core.multiplyMatrix2Vector2(matrix, point);
  };
  var boundary_for_arrows = function boundary_for_arrows(_ref) {
    var vertices_coords = _ref.vertices_coords;
    return math.core.convexHull(vertices_coords);
  };
  var widest_perp = function widest_perp(graph, foldLine, point) {
    var boundary = boundary_for_arrows(graph);
    if (point === undefined) {
      var _math$core;
      var foldSegment = math.core.clipLineConvexPolygon(boundary, foldLine.vector, foldLine.origin, math.core.exclude, math.core.includeL);
      point = (_math$core = math.core).midpoint.apply(_math$core, _toConsumableArray(foldSegment));
    }
    var perpVector = math.core.rotate270(foldLine.vector);
    var smallest = math.core.clipLineConvexPolygon(boundary, perpVector, point, math.core.exclude, math.core.includeL).map(function (pt) {
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
      return math.core.intersectConvexPolygonLine(boundary, ray.vector, ray.origin, math.core.excludeS, math.core.excludeR).shift().shift();
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
      return math.core.clipLineConvexPolygon(boundary, l.vector, l.origin, math.core.exclude, math.core.includeL);
    });
    var segVecs = segs.map(function (seg) {
      return math.core.subtract(seg[1], seg[0]);
    });
    var intersect = math.core.intersectLineLine(segVecs[0], segs[0][0], segVecs[1], segs[1][0], math.core.excludeS, math.core.excludeS);
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
      return [math.segment(params.points[1], diagram_reflect_point(foldLine, params.points[1]))];
    });
  };
  var axiom_6_arrows = function axiom_6_arrows(params) {
    return axiom(6, params).map(function (foldLine) {
      return params.points.map(function (pt) {
        return math.segment(pt, diagram_reflect_point(foldLine, pt));
      });
    });
  };
  var axiom_7_arrows = function axiom_7_arrows(params, graph) {
    return axiom(7, params).map(function (foldLine) {
      return [math.segment(params.points[0], diagram_reflect_point(foldLine, params.points[0])), widest_perp(graph, foldLine, line_line_for_arrows(foldLine, params.lines[1]))];
    });
  };
  var arrow_functions = [null, axiom_1_arrows, axiom_2_arrows, axiom_3_arrows, axiom_4_arrows, axiom_5_arrows, axiom_6_arrows, axiom_7_arrows];
  delete arrow_functions[0];
  var axiomArrows = function axiomArrows(number) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var points = params.points ? params.points.map(function (p) {
      return math.core.getVector(p);
    }) : undefined;
    var lines = params.lines ? params.lines.map(function (l) {
      return math.core.getLine(l);
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
    axiomArrows[number] = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return axiomArrows.apply(void 0, [number].concat(args));
    };
  });

  var widest_perpendicular = function widest_perpendicular(polygon, foldLine, point) {
    if (point === undefined) {
      var _math$core;
      var foldSegment = math.core.clipLineConvexPolygon(polygon, foldLine.vector, foldLine.origin, math.core.exclude, math.core.includeL);
      if (foldSegment === undefined) {
        return;
      }
      point = (_math$core = math.core).midpoint.apply(_math$core, _toConsumableArray(foldSegment));
    }
    var perpVector = math.core.rotate90(foldLine.vector);
    var smallest = math.core.clipLineConvexPolygon(polygon, perpVector, point, math.core.exclude, math.core.includeL).map(function (pt) {
      return math.core.distance(point, pt);
    }).sort(function (a, b) {
      return a - b;
    }).shift();
    var scaled = math.core.scale(math.core.normalize(perpVector), smallest);
    return math.segment(math.core.add(point, math.core.flip(scaled)), math.core.add(point, scaled));
  };
  var simpleArrow = function simpleArrow(graph, line) {
    var hull = math.core.convexHull(graph.vertices_coords);
    var box = math.core.boundingBox(hull);
    var segment = widest_perpendicular(hull, line);
    if (segment === undefined) {
      return undefined;
    }
    var vector = math.core.subtract(segment[1], segment[0]);
    var length = math.core.magnitude(vector);
    var direction = math.core.dot(vector, [1, 0]);
    var vmin = box.span[0] < box.span[1] ? box.span[0] : box.span[1];
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
    axiom_arrows: axiomArrows,
    simple_arrow: simpleArrow
  });

  var makeTortillaTortillaEdgesCrossing = function makeTortillaTortillaEdgesCrossing(graph, edges_faces_side, epsilon) {
    var tortilla_edge_indices = edges_faces_side.map(function (side) {
      return side.length === 2 && side[0] !== side[1];
    }).map(function (bool, i) {
      return bool ? i : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    var edges_crossing_matrix = makeEdgesEdgesCrossing(graph, epsilon);
    var edges_crossing = booleanMatrixToIndexedArray(edges_crossing_matrix);
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
  var makeTortillasFacesCrossing = function makeTortillasFacesCrossing(graph, edges_faces_side, epsilon) {
    var faces_winding = makeFacesWinding(graph);
    var faces_polygon = makeFacesPolygon(graph, epsilon);
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
        return math.core.clipLineConvexPolygon(poly, edges_vector[ei], edges_coords[ei][0], math.core.exclude, math.core.excludeS, epsilon);
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
  var makeTortillaTortillaFacesCrossing = function makeTortillaTortillaFacesCrossing(graph, edges_faces_side, epsilon) {
    makeTortillaTortillaEdgesCrossing(graph, edges_faces_side, epsilon);
    var tortillas_faces_crossing = makeTortillasFacesCrossing(graph, edges_faces_side, epsilon);
    var tortilla_faces_results = tortillas_faces_crossing.map(function (faces, e) {
      return faces.map(function (face) {
        return [graph.edges_faces[e], [face, face]];
      });
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    return tortilla_faces_results;
  };

  var tortillaTortilla = /*#__PURE__*/Object.freeze({
    __proto__: null,
    makeTortillaTortillaEdgesCrossing: makeTortillaTortillaEdgesCrossing,
    makeTortillasFacesCrossing: makeTortillasFacesCrossing,
    makeTortillaTortillaFacesCrossing: makeTortillaTortillaFacesCrossing
  });

  var makeEdgesFacesSide = function makeEdgesFacesSide(graph, faces_center) {
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
  var makeTacosFacesSide = function makeTacosFacesSide(graph, faces_center, tacos_edges, tacos_faces) {
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
  var makeTacosTortillas = function makeTacosTortillas(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : math.core.EPSILON;
    var faces_center = makeFacesCenter(graph);
    var edges_faces_side = makeEdgesFacesSide(graph, faces_center);
    var edge_edge_overlap_matrix = makeEdgesEdgesParallelOverlap(graph, epsilon);
    var tacos_edges = booleanMatrixToUniqueIndexPairs(edge_edge_overlap_matrix).filter(function (pair) {
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
    var tacos_faces_side = makeTacosFacesSide(graph, faces_center, tacos_edges, tacos_faces);
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
    var tortilla_tortilla_crossing = makeTortillaTortillaFacesCrossing(graph, edges_faces_side, epsilon);
    var tortilla_tortilla = tortilla_tortilla_aligned.concat(tortilla_tortilla_crossing);
    var taco_tortilla_aligned = tacos_types.map(function (pair, i) {
      return is_taco_tortilla(pair) ? make_taco_tortilla(tacos_faces[i], tacos_types[i], tacos_faces_side[i]) : undefined;
    }).filter(function (a) {
      return a !== undefined;
    });
    var edges_faces_overlap = makeEdgesFacesOverlap(graph, epsilon);
    var edges_overlap_faces = booleanMatrixToIndexedArray(edges_faces_overlap).map(function (faces, e) {
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

  var makeTransitivityTrios = function makeTransitivityTrios(graph, overlap_matrix, faces_winding) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.core.EPSILON;
    if (!overlap_matrix) {
      overlap_matrix = makeFacesFacesOverlap(graph, epsilon);
    }
    if (!faces_winding) {
      faces_winding = makeFacesWinding(graph);
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
        var polygon = math.core.clipPolygonPolygon(polygons[i], polygons[j], epsilon);
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
          var _polygon = math.core.clipPolygonPolygon(matrix[_i][_j], polygons[k], epsilon);
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

  var filterTransitivity = function filterTransitivity(transitivity_trios, tacos_tortillas) {
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
  var unsignedToSignedConditions = function unsignedToSignedConditions(conditions) {
    Object.keys(conditions).forEach(function (key) {
      conditions[key] = to_signed_layer_convert[conditions[key]];
    });
    return conditions;
  };
  var signedToUnsignedConditions = function signedToUnsignedConditions(conditions) {
    Object.keys(conditions).forEach(function (key) {
      conditions[key] = to_unsigned_layer_convert[conditions[key]];
    });
    return conditions;
  };

  var globalSolverGeneral = /*#__PURE__*/Object.freeze({
    __proto__: null,
    unsignedToSignedConditions: unsignedToSignedConditions,
    signedToUnsignedConditions: signedToUnsignedConditions
  });

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
  var makeTacoMaps = function makeTacoMaps(tacos_tortillas, transitivity_trios) {
    var pairs = refactor_pairs(tacos_tortillas, transitivity_trios);
    return {
      taco_taco: make_maps(pairs.taco_taco),
      taco_tortilla: make_maps(pairs.taco_tortilla),
      tortilla_tortilla: make_maps(pairs.tortilla_tortilla),
      transitivity: make_maps(pairs.transitivity)
    };
  };

  var makeConditions = function makeConditions(graph, overlap_matrix, faces_winding) {
    if (!faces_winding) {
      faces_winding = makeFacesWinding(graph);
    }
    if (!overlap_matrix) {
      overlap_matrix = makeFacesFacesOverlap(graph);
    }
    var conditions = {};
    var flip_condition = {
      0: 0,
      1: 2,
      2: 1
    };
    booleanMatrixToUniqueIndexPairs(overlap_matrix).map(function (pair) {
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
      var global_order = upright ? local_order : flip_condition[local_order];
      var key1 = "".concat(faces[0], " ").concat(faces[1]);
      var key2 = "".concat(faces[1], " ").concat(faces[0]);
      if (key1 in conditions) {
        conditions[key1] = global_order;
      }
      if (key2 in conditions) {
        conditions[key2] = flip_condition[global_order];
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
  var flip_conditions = {
    0: 0,
    1: 2,
    2: 1
  };
  var fill_layers_from_conditions = function fill_layers_from_conditions(layers, maps, conditions, fill_indices) {
    var changed = {};
    var iterators = fill_indices ? fill_indices : Object.keys(layers);
    iterators.forEach(function (i) {
      return maps[i].face_keys.forEach(function (key, j) {
        if (!(key in conditions)) {
          console.warn(key, "not in conditions");
          return;
        }
        if (conditions[key] !== 0) {
          var orientation = maps[i].keys_ordered[j] ? conditions[key] : flip_conditions[conditions[key]];
          if (layers[i][j] !== 0 && layers[i][j] !== orientation) {
            throw "fill conflict";
          }
          layers[i][j] = orientation;
          changed[i] = true;
        }
      });
    });
    return changed;
  };
  var infer_next_steps = function infer_next_steps(layers, maps, lookup_table, changed_indices) {
    var iterators = changed_indices ? changed_indices : Object.keys(layers);
    return iterators.map(function (i) {
      var map = maps[i];
      var key = layers[i].join("");
      var next_step = lookup_table[key];
      if (next_step === false) {
        throw "unsolvable";
      }
      if (next_step === true) {
        return;
      }
      if (layers[i][next_step[0]] !== 0 && layers[i][next_step[0]] !== next_step[1]) {
        throw "infer conflict";
      }
      layers[i][next_step[0]] = next_step[1];
      var condition_key = map.face_keys[next_step[0]];
      var condition_value = map.keys_ordered[next_step[0]] ? next_step[1] : flip_conditions[next_step[1]];
      return [condition_key, condition_value];
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var completeSuggestionsLoop = function completeSuggestionsLoop(layers, maps, conditions, pair_layer_map) {
    var next_steps;
    var next_steps_indices = {};
    do {
      try {
        (function () {
          var fill_changed = {};
          taco_types$2.forEach(function (taco_type) {
            fill_changed[taco_type] = {};
          });
          for (var t = 0; t < taco_types$2.length; t++) {
            var type = taco_types$2[t];
            fill_changed[type] = fill_layers_from_conditions(layers[type], maps[type], conditions, next_steps_indices[type]);
          }
          taco_types$2.forEach(function (type) {
            fill_changed[type] = Object.keys(fill_changed[type]);
          });
          next_steps = taco_types$2.flatMap(function (type) {
            return infer_next_steps(layers[type], maps[type], slow_lookup[type], fill_changed[type]);
          });
          next_steps.forEach(function (el) {
            conditions[el[0]] = el[1];
          });
          taco_types$2.forEach(function (type) {
            next_steps_indices[type] = {};
          });
          taco_types$2.forEach(function (taco_type) {
            return next_steps.forEach(function (el) {
              return pair_layer_map[taco_type][el[0]].forEach(function (i) {
                next_steps_indices[taco_type][i] = true;
              });
            });
          });
          taco_types$2.forEach(function (type) {
            next_steps_indices[type] = Object.keys(next_steps_indices[type]);
          });
        })();
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
  var singleSolver = function singleSolver(graph, maps, conditions) {
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
    var pair_layer_map = {};
    taco_types$1.forEach(function (taco_type) {
      pair_layer_map[taco_type] = {};
    });
    taco_types$1.forEach(function (taco_type) {
      return Object.keys(conditions).forEach(function (pair) {
        pair_layer_map[taco_type][pair] = [];
      });
    });
    taco_types$1.forEach(function (taco_type) {
      return maps[taco_type].forEach(function (el, i) {
        return el.face_keys.forEach(function (pair) {
          pair_layer_map[taco_type][pair].push(i);
        });
      });
    });
    if (!completeSuggestionsLoop(layers, maps, conditions, pair_layer_map)) {
      return undefined;
    }
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
          if (!completeSuggestionsLoop(clone_layers, maps, clone_conditions, pair_layer_map)) {
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
        console.warn("layer solver, no solutions found");
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
    unsignedToSignedConditions(solution);
    var duration = Date.now() - startDate;
    if (duration > 50) {
      console.log("".concat(duration, "ms recurse_count"), recurse_count, "inner_loop_count", inner_loop_count);
    }
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
  var recursiveSolver = function recursiveSolver(graph, maps, conditions_start) {
    var startDate = new Date();
    var recurse_count = 0;
    var inner_loop_count = 0;
    var avoidcount = 0;
    var failguesscount = 0;
    var clone_time = 0;
    var solve_time = 0;
    var pair_layer_map = {};
    taco_types.forEach(function (taco_type) {
      pair_layer_map[taco_type] = {};
    });
    taco_types.forEach(function (taco_type) {
      return Object.keys(conditions_start).forEach(function (pair) {
        pair_layer_map[taco_type][pair] = [];
      });
    });
    taco_types.forEach(function (taco_type) {
      return maps[taco_type].forEach(function (el, i) {
        return el.face_keys.forEach(function (pair) {
          pair_layer_map[taco_type][pair].push(i);
        });
      });
    });
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
            avoidcount++;
            return;
          }
          var clone_start = new Date();
          var clone_conditions = JSON.parse(JSON.stringify(conditions));
          clone_time += Date.now() - clone_start;
          var clone_layers = duplicate_unsolved_layers(layers);
          clone_conditions[key] = dir;
          inner_loop_count++;
          var solve_start = new Date();
          if (!completeSuggestionsLoop(clone_layers, maps, clone_conditions, pair_layer_map)) {
            failguesscount++;
            solve_time += Date.now() - solve_start;
            return;
          }
          solve_time += Date.now() - solve_start;
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
      return successes
      .map(function (success) {
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
    if (!completeSuggestionsLoop(layers_start, maps, conditions_start, pair_layer_map)) {
      return [];
    }
    var solutions_before = recurse(layers_start, conditions_start);
    var successes_hash = {};
    var solutions = solutions_before.map(function (conditions) {
      return JSON.stringify(conditions);
    }).map(function (string) {
      return hashCode(string);
    }).map(function (hash, i) {
      if (successes_hash[hash]) {
        return;
      }
      successes_hash[hash] = solutions_before[i];
      return solutions_before[i];
    }).filter(function (a) {
      return a !== undefined;
    });
    for (var i = 0; i < solutions.length; i++) {
      unsignedToSignedConditions(solutions[i]);
    }
    var duration = Date.now() - startDate;
    if (duration > 50) {
      console.log("".concat(duration, "ms recurses"), recurse_count, "inner loops", inner_loop_count, "avoided", avoidcount, "bad guesses", failguesscount, "solutions ".concat(solutions_before.length, "/").concat(solutions.length), "durations: clone, solve", clone_time, solve_time);
    }
    return solutions;
  };

  var dividingAxis = function dividingAxis(graph, line, conditions) {
    var faces_side = makeFacesCenterQuick(graph).map(function (center) {
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

  var makeMapsAndConditions = function makeMapsAndConditions(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-6;
    var overlap_matrix = makeFacesFacesOverlap(graph, epsilon);
    var facesWinding = makeFacesWinding(graph);
    var conditions = makeConditions(graph, overlap_matrix, facesWinding);
    var tacos_tortillas = makeTacosTortillas(graph, epsilon);
    var unfiltered_trios = makeTransitivityTrios(graph, overlap_matrix, facesWinding, epsilon);
    var transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
    var maps = makeTacoMaps(tacos_tortillas, transitivity_trios);
    return {
      maps: maps,
      conditions: conditions
    };
  };
  var oneLayerConditions = function oneLayerConditions(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-6;
    var data = makeMapsAndConditions(graph, epsilon);
    var solution = singleSolver(graph, data.maps, data.conditions);
    return solution;
  };
  var allLayerConditions = function allLayerConditions(graph) {
    var epsilon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1e-6;
    var data = makeMapsAndConditions(graph, epsilon);
    var solutions = recursiveSolver(graph, data.maps, data.conditions);
    solutions.certain = unsignedToSignedConditions(JSON.parse(JSON.stringify(data.conditions)));
    return solutions;
  };
  var makeMapsAndConditionsDividingAxis = function makeMapsAndConditionsDividingAxis(folded, cp, line) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1e-6;
    var overlap_matrix = makeFacesFacesOverlap(folded, epsilon);
    var faces_winding = makeFacesWinding(folded);
    var conditions = makeConditions(folded, overlap_matrix, faces_winding);
    dividingAxis(cp, line, conditions);
    var tacos_tortillas = makeTacosTortillas(folded, epsilon);
    var unfiltered_trios = makeTransitivityTrios(folded, overlap_matrix, faces_winding, epsilon);
    var transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
    var maps = makeTacoMaps(tacos_tortillas, transitivity_trios);
    return {
      maps: maps,
      conditions: conditions
    };
  };
  var oneLayerConditionsWithAxis = function oneLayerConditionsWithAxis(folded, cp, line) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1e-6;
    var data = makeMapsAndConditionsDividingAxis(folded, cp, line, epsilon);
    var solution = singleSolver(folded, data.maps, data.conditions);
    return solution;
  };
  var allLayerConditionsWithAxis = function allLayerConditionsWithAxis(folded, cp, line) {
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1e-6;
    var data = makeMapsAndConditionsDividingAxis(folded, cp, line, epsilon);
    var solutions = recursiveSolver(folded, data.maps, data.conditions);
    solutions.certain = unsignedToSignedConditions(JSON.parse(JSON.stringify(data.conditions)));
    return solutions;
  };

  var globalSolvers = /*#__PURE__*/Object.freeze({
    __proto__: null,
    oneLayerConditions: oneLayerConditions,
    allLayerConditions: allLayerConditions,
    oneLayerConditionsWithAxis: oneLayerConditionsWithAxis,
    allLayerConditionsWithAxis: allLayerConditionsWithAxis
  });

  var topologicalOrder = function topologicalOrder(conditions, graph) {
    if (!conditions) {
      return [];
    }
    var faces_children = [];
    Object.keys(conditions).map(function (key) {
      var pair = key.split(" ").map(function (n) {
        return parseInt(n);
      });
      if (conditions[key] === -1) {
        pair.reverse();
      }
      if (faces_children[pair[0]] === undefined) {
        faces_children[pair[0]] = [];
      }
      faces_children[pair[0]].push(pair[1]);
    });
    if (graph && graph.faces_vertices) {
      graph.faces_vertices.forEach(function (_, f) {
        if (faces_children[f] === undefined) {
          faces_children[f] = [];
        }
      });
    }
    var layers_face = [];
    var faces_visited = [];
    var protection = 0;
    for (var f = 0; f < faces_children.length; f++) {
      if (faces_visited[f]) {
        continue;
      }
      var stack = [f];
      while (stack.length && protection < faces_children.length * 2) {
        var stack_end = stack[stack.length - 1];
        if (faces_children[stack_end].length) {
          var next = faces_children[stack_end].pop();
          if (!faces_visited[next]) {
            stack.push(next);
          }
          continue;
        } else {
          layers_face.push(stack_end);
          faces_visited[stack_end] = true;
          stack.pop();
        }
        protection++;
      }
    }
    if (protection >= faces_children.length * 2) {
      console.warn("fix protection in topological order");
    }
    return layers_face;
  };

  var makeFacesLayer = function makeFacesLayer(graph, epsilon) {
    var conditions = oneLayerConditions(graph, epsilon);
    return invertMap(topologicalOrder(conditions, graph));
  };

  var makeFacesLayers = function makeFacesLayers(graph, epsilon) {
    return allLayerConditions(graph, epsilon).map(function (conditions) {
      return topologicalOrder(conditions, graph);
    }).map(invertMap);
  };

  var flipFacesLayer = function flipFacesLayer(faces_layer) {
    return invertMap(invertMap(faces_layer).reverse());
  };

  var facesLayerToEdgesAssignments = function facesLayerToEdgesAssignments(graph, faces_layer) {
    var edges_assignment = [];
    var faces_winding = makeFacesWinding(graph);
    var edges_faces = graph.edges_faces ? graph.edges_faces : makeEdgesFaces(graph);
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

  var edgesAssignments = /*#__PURE__*/Object.freeze({
    __proto__: null,
    facesLayerToEdgesAssignments: facesLayerToEdgesAssignments
  });

  var conditionsToMatrix = function conditionsToMatrix(conditions) {
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

  var makeFoldedStripTacos = function makeFoldedStripTacos(folded_faces, is_circular, epsilon) {
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
  var validateTacoTortillaStrip = function validateTacoTortillaStrip(faces_folded, layers_face) {
    var is_circular = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var epsilon = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : math.core.EPSILON;
    var faces_layer = invertMap(layers_face);
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
      var layers_between = between(layers_face, faces_layer[i], faces_layer[j]).flat();
      var all_below_min = layers_between.map(function (index) {
        return fold_location[i] < faces_mins[index];
      }).reduce(function (a, b) {
        return a && b;
      }, true);
      var all_above_max = layers_between.map(function (index) {
        return fold_location[i] > faces_maxs[index];
      }).reduce(function (a, b) {
        return a && b;
      }, true);
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

  var validateTacoTacoFacePairs = function validateTacoTacoFacePairs(face_pair_stack) {
    var pair_stack = removeSingleInstances(face_pair_stack);
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
    }).filter(function (a) {
      return a !== undefined;
    });
  };
  var validateLayerSolver = function validateLayerSolver(faces_folded, layers_face, taco_face_pairs, circ_and_done, epsilon) {
    var flat_layers_face = math.core.flattenArrays(layers_face);
    if (!validateTacoTortillaStrip(faces_folded, layers_face, circ_and_done, epsilon)) {
      return false;
    }
    for (var i = 0; i < taco_face_pairs.length; i++) {
      var pair_stack = build_layers(flat_layers_face, taco_face_pairs[i]);
      if (!validateTacoTacoFacePairs(pair_stack)) {
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
  var assignmentsToFacesFlip = function assignmentsToFacesFlip(assignments) {
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
  var assignmentsToFacesVertical = function assignmentsToFacesVertical(assignments) {
    var iterator = 0;
    return assignments.slice(1).concat([assignments[0]]).map(function (a) {
      var updown = upOrDown(a, iterator);
      iterator += up_down[a] === undefined ? 0 : 1;
      return updown;
    });
  };
  var foldStripWithAssignments = function foldStripWithAssignments(faces, assignments) {
    var faces_end = assignmentsToFacesFlip(assignments).map(function (flip, i) {
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

  var foldAssignments = /*#__PURE__*/Object.freeze({
    __proto__: null,
    assignmentsToFacesFlip: assignmentsToFacesFlip,
    assignmentsToFacesVertical: assignmentsToFacesVertical,
    foldStripWithAssignments: foldStripWithAssignments
  });

  var is_boundary = {
    "B": true,
    "b": true
  };
  var singleVertexSolver = function singleVertexSolver(ordered_scalars, assignments) {
    var epsilon = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : math.core.EPSILON;
    var faces_folded = foldStripWithAssignments(ordered_scalars, assignments);
    var faces_updown = assignmentsToFacesVertical(assignments);
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
    var taco_face_pairs = makeFoldedStripTacos(faces_folded, is_circular, epsilon).map(function (taco) {
      return [taco.left, taco.right].map(invertMap).filter(function (arr) {
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
      if (!validateLayerSolver(faces_folded, layers_face, taco_face_pairs, circ_and_done, epsilon)) {
        return [];
      }
      if (circ_and_done) {
        var faces_layer = invertMap(layers_face);
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
    return recurse().map(invertMap);
  };

  var get_unassigned_indices = function get_unassigned_indices(edges_assignment) {
    return edges_assignment.map(function (_, i) {
      return i;
    }).filter(function (i) {
      return edges_assignment[i] === "U" || edges_assignment[i] === "u";
    });
  };
  var maekawaAssignments = function maekawaAssignments(vertices_edges_assignments) {
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

  var assignmentSolver = function assignmentSolver(faces, assignments, epsilon) {
    if (assignments == null) {
      assignments = faces.map(function () {
        return "U";
      });
    }
    var all_assignments = maekawaAssignments(assignments);
    var layers = all_assignments.map(function (assigns) {
      return singleVertexSolver(faces, assigns, epsilon);
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
    makeFacesLayer: makeFacesLayer,
    makeFacesLayers: makeFacesLayers,
    flipFacesLayer: flipFacesLayer,
    assignmentSolver: assignmentSolver,
    singleVertexSolver: singleVertexSolver,
    validateLayerSolver: validateLayerSolver,
    validateTacoTacoFacePairs: validateTacoTacoFacePairs,
    validateTacoTortillaStrip: validateTacoTortillaStrip,
    table: slow_lookup,
    makeConditions: makeConditions,
    makeTacoMaps: makeTacoMaps,
    recursiveSolver: recursiveSolver,
    singleSolver: singleSolver,
    dividingAxis: dividingAxis,
    topologicalOrder: topologicalOrder,
    conditionsToMatrix: conditionsToMatrix,
    makeTacosTortillas: makeTacosTortillas,
    makeFoldedStripTacos: makeFoldedStripTacos,
    makeTransitivityTrios: makeTransitivityTrios
  }, globalSolvers, globalSolverGeneral, edgesAssignments, tortillaTortilla, foldAssignments);

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
  var foldAngles4 = function foldAngles4(sectors, assignments) {
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

  var kawasakiSolutions = function kawasakiSolutions(_ref, vertex) {
    var vertices_coords = _ref.vertices_coords,
        vertices_edges = _ref.vertices_edges,
        edges_vertices = _ref.edges_vertices,
        edges_vectors = _ref.edges_vectors;
    if (!edges_vectors) {
      edges_vectors = makeEdgesVector({
        vertices_coords: vertices_coords,
        edges_vertices: edges_vertices
      });
    }
    if (!vertices_edges) {
      vertices_edges = makeVerticesEdgesUnsorted({
        edges_vertices: edges_vertices
      });
    }
    var vectors = vertices_edges[vertex].map(function (i) {
      return edges_vectors[i];
    });
    var sortedVectors = math.core.counterClockwiseOrder2(vectors).map(function (i) {
      return vectors[i];
    });
    return kawasakiSolutionsVectors(sortedVectors);
  };

  var kawasakiGraph = /*#__PURE__*/Object.freeze({
    __proto__: null,
    kawasakiSolutions: kawasakiSolutions
  });

  var singleVertex = Object.assign(Object.create(null), {
    maekawaAssignments: maekawaAssignments,
    foldAngles4: foldAngles4
  }, kawasakiMath, kawasakiGraph, validateSingleVertex);

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
  var axioms = {
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

  var fold = {
  	es: "doblez"
  };
  var sink = {
  };
  var blintz = {
  	zh: "坐墊基"
  };
  var squash = {
  	zh: "壓摺"
  };
  var instructions = {
  	fold: fold,
  	"valley fold": {
  	es: "doblez de valle",
  	zh: "谷摺"
  },
  	"mountain fold": {
  	es: "doblez de montaña",
  	zh: "山摺"
  },
  	"inside reverse fold": {
  	zh: "內中割摺"
  },
  	"outside reverse fold": {
  	zh: "外中割摺"
  },
  	sink: sink,
  	"open sink": {
  	zh: "開放式沉壓摺"
  },
  	"closed sink": {
  	zh: "封閉式沉壓摺"
  },
  	"rabbit ear": {
  	zh: "兔耳摺"
  },
  	"double rabbit ear": {
  	zh: "雙兔耳摺"
  },
  	"petal fold": {
  	zh: "花瓣摺"
  },
  	blintz: blintz,
  	squash: squash,
  	"flip over": {
  	es: "dale la vuelta a tu papel"
  }
  };

  var text = {
    axioms: axioms,
    instructions: instructions
  };

  var use = function use(library) {
    if (library == null || typeof library.linker !== "function") {
      return;
    }
    library.linker(this);
  };

  var verticesCircle = function verticesCircle(graph) {
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
    g.setAttributeNS(null, "fill", _none);
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
    M: {
      stroke: "red"
    },
    m: {
      stroke: "red"
    },
    V: {
      stroke: "blue"
    },
    v: {
      stroke: "blue"
    },
    F: {
      stroke: "lightgray"
    },
    f: {
      stroke: "lightgray"
    }
  };
  var edgesAssignmentIndices = function edgesAssignmentIndices(graph) {
    var assignment_indices = {
      u: [],
      f: [],
      v: [],
      m: [],
      b: []
    };
    var lowercase_assignment = graph[_edges_assignment].map(function (a) {
      return a.toLowerCase();
    });
    graph[_edges_vertices].map(function (_, i) {
      return lowercase_assignment[i] || "u";
    }).forEach(function (a, i) {
      return assignment_indices[a].push(i);
    });
    return assignment_indices;
  };
  var edgesCoords = function edgesCoords(_ref) {
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
  var segmentToPath = function segmentToPath(s) {
    return "M".concat(s[0][0], " ").concat(s[0][1], "L").concat(s[1][0], " ").concat(s[1][1]);
  };
  var edgesPathData = function edgesPathData(graph) {
    return edgesCoords(graph).map(function (segment) {
      return segmentToPath(segment);
    }).join("");
  };
  var edgesPathDataAssign = function edgesPathDataAssign(_ref2) {
    var vertices_coords = _ref2.vertices_coords,
        edges_vertices = _ref2.edges_vertices,
        edges_assignment = _ref2.edges_assignment;
    if (!vertices_coords || !edges_vertices) {
      return {};
    }
    if (!edges_assignment) {
      return {
        u: edgesPathData({
          vertices_coords: vertices_coords,
          edges_vertices: edges_vertices
        })
      };
    }
    var data = edgesAssignmentIndices({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_assignment: edges_assignment
    });
    Object.keys(data).forEach(function (key) {
      data[key] = edgesPathData({
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
  var edgesPathsAssign = function edgesPathsAssign(_ref3) {
    var vertices_coords = _ref3.vertices_coords,
        edges_vertices = _ref3.edges_vertices,
        edges_assignment = _ref3.edges_assignment;
    var data = edgesPathDataAssign({
      vertices_coords: vertices_coords,
      edges_vertices: edges_vertices,
      edges_assignment: edges_assignment
    });
    Object.keys(data).forEach(function (assignment) {
      var path = root.svg.path(data[assignment]);
      path.setAttributeNS(null, _class, edgesAssignmentNames[assignment]);
      data[assignment] = path;
    });
    return data;
  };
  var applyStyle = function applyStyle(el) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return Object.keys(attributes).forEach(function (key) {
      return el.setAttributeNS(null, key, attributes[key]);
    });
  };
  var edgesPaths = function edgesPaths(graph) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var group = root.svg.g();
    if (!graph) {
      return group;
    }
    var isFolded = isFoldedForm(graph);
    var paths = edgesPathsAssign(graph);
    Object.keys(paths).forEach(function (key) {
      paths[key].setAttributeNS(null, _class, edgesAssignmentNames[key]);
      applyStyle(paths[key], isFolded ? STYLE_FOLDED[key] : STYLE_FLAT[key]);
      applyStyle(paths[key], attributes[key]);
      applyStyle(paths[key], attributes[edgesAssignmentNames[key]]);
      group.appendChild(paths[key]);
      Object.defineProperty(group, edgesAssignmentNames[key], {
        get: function get() {
          return paths[key];
        }
      });
    });
    applyStyle(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
    applyStyle(group, attributes.stroke ? {
      stroke: attributes.stroke
    } : {});
    return group;
  };
  var angleToOpacity = function angleToOpacity(foldAngle) {
    return Math.abs(foldAngle) / 180;
  };
  var edgesLines = function edgesLines(graph) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var group = root.svg.g();
    if (!graph) {
      return group;
    }
    var isFolded = isFoldedForm(graph);
    var edges_assignment = (graph.edges_assignment ? graph.edges_assignment : makeEdgesAssignment(graph)).map(function (assign) {
      return assign.toLowerCase();
    });
    var groups_by_key = {};
    ["b", "m", "v", "f", "u"].forEach(function (k) {
      var child_group = root.svg.g();
      group.appendChild(child_group);
      child_group.setAttributeNS(null, _class, edgesAssignmentNames[k]);
      applyStyle(child_group, isFolded ? STYLE_FOLDED[k] : STYLE_FLAT[k]);
      applyStyle(child_group, attributes[edgesAssignmentNames[k]]);
      Object.defineProperty(group, edgesAssignmentNames[k], {
        get: function get() {
          return child_group;
        }
      });
      groups_by_key[k] = child_group;
    });
    var lines = graph.edges_vertices.map(function (ev) {
      return ev.map(function (v) {
        return graph.vertices_coords[v];
      });
    }).map(function (l) {
      return root.svg.line(l[0][0], l[0][1], l[1][0], l[1][1]);
    });
    if (graph.edges_foldAngle) {
      lines.forEach(function (line, i) {
        var angle = graph.edges_foldAngle[i];
        if (angle === 0 || angle === 180 || angle === -180) {
          return;
        }
        line.setAttributeNS(null, "opacity", angleToOpacity(angle));
      });
    }
    lines.forEach(function (line, i) {
      return groups_by_key[edges_assignment[i]].appendChild(line);
    });
    applyStyle(group, isFolded ? GROUP_FOLDED : GROUP_FLAT);
    applyStyle(group, attributes.stroke ? {
      stroke: attributes.stroke
    } : {});
    return group;
  };
  var drawEdges = function drawEdges(graph, attributes) {
    return edgesFoldAngleAreAllFlat(graph) ? edgesPaths(graph, attributes) : edgesLines(graph, attributes);
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
    stroke: _none,
    fill: _black,
    "stroke-linejoin": "bevel"
  };
  var GROUP_STYLE_FLAT = {
    fill: _none
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
    var isFolded = isFoldedForm(graph);
    var orderIsCertain = graph[_faces_layer] != null && graph[_faces_layer].length === graph[_faces_vertices].length;
    var classNames = [[_front], [_back]];
    var faces_winding = makeFacesWinding(graph);
    faces_winding.map(function (w) {
      return w ? classNames[0] : classNames[1];
    }).forEach(function (className, i) {
      svg_faces[i].setAttributeNS(null, _class, className);
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
  var facesVerticesPolygon = function facesVerticesPolygon(graph) {
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
  var facesEdgesPolygon = function facesEdgesPolygon(graph) {
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
    fill: _none
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
  var boundariesPolygon = function boundariesPolygon(graph) {
    var attributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var g = root.svg.g();
    if (!graph || !graph.vertices_coords || !graph.edges_vertices || !graph.edges_assignment) {
      return g;
    }
    var boundary = getBoundary(graph).vertices.map(function (v) {
      return [0, 1].map(function (i) {
        return graph.vertices_coords[v][i];
      });
    });
    if (boundary.length === 0) {
      return g;
    }
    var poly = root.svg.polygon(boundary);
    poly.setAttributeNS(null, _class, _boundary);
    g.appendChild(poly);
    apply_style(g, isFoldedForm(graph) ? FOLDED : FLAT);
    Object.keys(attributes).forEach(function (attr) {
      return g.setAttributeNS(null, attr, attributes[attr]);
    });
    return g;
  };

  var facesDrawFunction = function facesDrawFunction(graph, options) {
    return graph != null && graph[_faces_vertices] != null ? facesVerticesPolygon(graph, options) : facesEdgesPolygon(graph, options);
  };
  var svg_draw_func = {
    vertices: verticesCircle,
    edges: drawEdges,
    faces: facesDrawFunction,
    boundaries: boundariesPolygon
  };
  var drawGroup = function drawGroup(key, graph, options) {
    var group = options === false ? root.svg.g() : svg_draw_func[key](graph, options);
    group.setAttributeNS(null, _class, key);
    return group;
  };
  var DrawGroups = function DrawGroups(graph) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return [_boundaries, _faces, _edges, _vertices].map(function (key) {
      return drawGroup(key, graph, options[key]);
    });
  };
  [_boundaries, _faces, _edges, _vertices].forEach(function (key) {
    DrawGroups[key] = function (graph) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return drawGroup(key, graph, options[key]);
    };
  });

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

  var DEFAULT_STROKE_WIDTH = 1 / 100;
  var DEFAULT_CIRCLE_RADIUS = 1 / 50;
  var getBoundingRect = function getBoundingRect(_ref) {
    var vertices_coords = _ref.vertices_coords;
    if (vertices_coords == null || vertices_coords.length === 0) {
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
  var getViewBox$1 = function getViewBox(graph) {
    var viewBox = getBoundingRect(graph);
    return viewBox === undefined ? "" : viewBox.join(" ");
  };
  var setR = function setR(group, radius) {
    for (var i = 0; i < group.childNodes.length; i++) {
      group.childNodes[i].setAttributeNS(null, "r", radius);
    }
  };
  var findSVGInParents = function findSVGInParents(element) {
    if ((element.nodeName || "").toUpperCase() === "SVG") {
      return element;
    }
    return element.parentNode ? findSVGInParents(element.parentNode) : undefined;
  };
  var applyTopLevelOptions = function applyTopLevelOptions(element, groups, graph, options) {
    if (!(options.strokeWidth || options.viewBox || groups[3].length)) {
      return;
    }
    var bounds = getBoundingRect(graph);
    var vmax = bounds ? Math.max(bounds[2], bounds[3]) : 1;
    var svgElement = findSVGInParents(element);
    if (svgElement && options.viewBox) {
      var viewBoxValue = bounds ? bounds.join(" ") : "0 0 1 1";
      svgElement.setAttributeNS(null, "viewBox", viewBoxValue);
    }
    if (options.strokeWidth || options["stroke-width"]) {
      var strokeWidth = options.strokeWidth ? options.strokeWidth : options["stroke-width"];
      var strokeWidthValue = typeof strokeWidth === "number" ? vmax * strokeWidth : vmax * DEFAULT_STROKE_WIDTH;
      element.setAttributeNS(null, "stroke-width", strokeWidthValue);
    }
    if (groups[3].length) {
      var radius = typeof options.radius === "number" ? vmax * options.radius : vmax * DEFAULT_CIRCLE_RADIUS;
      setR(groups[3], radius);
    }
  };
  var drawInto = function drawInto(element, graph) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var groups = DrawGroups(graph, options);
    groups.filter(function (group) {
      return group.childNodes.length > 0;
    }).forEach(function (group) {
      return element.appendChild(group);
    });
    applyTopLevelOptions(element, groups, graph, options);
    Object.keys(DrawGroups).filter(function (key) {
      return element[key] == null;
    }).forEach(function (key, i) {
      return Object.defineProperty(element, key, {
        get: function get() {
          return groups[i];
        }
      });
    });
    return element;
  };
  var FOLDtoSVG = function FOLDtoSVG(graph, options) {
    return drawInto(root.svg(), graph, options);
  };
  Object.keys(DrawGroups).forEach(function (key) {
    FOLDtoSVG[key] = DrawGroups[key];
  });
  FOLDtoSVG.drawInto = drawInto;
  FOLDtoSVG.getViewBox = getViewBox$1;
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
  var str_class = "class";
  var str_function = "function";
  var str_undefined = "undefined";
  var str_boolean = "boolean";
  var str_number = "number";
  var str_string = "string";
  var str_object = "object";
  var str_svg = "svg";
  var str_path = "path";
  var str_id = "id";
  var str_style = "style";
  var str_viewBox = "viewBox";
  var str_transform = "transform";
  var str_points = "points";
  var str_stroke = "stroke";
  var str_fill = "fill";
  var str_none = "none";
  var str_arrow = "arrow";
  var str_head = "head";
  var str_tail = "tail";
  var isBrowser = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== str_undefined && _typeof(window.document) !== str_undefined;
  var isNode = (typeof process === "undefined" ? "undefined" : _typeof(process)) !== str_undefined && process.versions != null && process.versions.node != null;
  var svgErrors = [];
  svgErrors[10] = "\"error 010: window\" not set. if using node/deno, include package @xmldom/xmldom, set to the main export ( ear.window = xmldom; )";
  var svgWindowContainer = {
    window: undefined
  };
  var buildHTMLDocument = function buildHTMLDocument(newWindow) {
    return new newWindow.DOMParser().parseFromString("<!DOCTYPE html><title>.</title>", "text/html");
  };
  var setWindow = function setWindow(newWindow) {
    if (!newWindow.document) {
      newWindow.document = buildHTMLDocument(newWindow);
    }
    svgWindowContainer.window = newWindow;
    return svgWindowContainer.window;
  };
  if (isBrowser) {
    svgWindowContainer.window = window;
  }
  var SVGWindow = function SVGWindow() {
    if (svgWindowContainer.window === undefined) {
      throw svgErrors[10];
    }
    return svgWindowContainer.window;
  };
  var NS = "http://www.w3.org/2000/svg";
  var NodeNames = {
    s: [
    "svg"],
    d: [
    "defs"
    ],
    h: [
    "desc",
    "filter",
    "metadata",
    "style",
    "script",
    "title",
    "view"
    ],
    c: [
    "cdata"],
    g: [
    "g"
    ],
    v: [
    "circle", "ellipse", "line", "path", "polygon", "polyline", "rect"],
    t: [
    "text"],
    i: [
    "marker",
    "symbol",
    "clipPath",
    "mask"
    ],
    p: [
    "linearGradient",
    "radialGradient",
    "pattern"
    ],
    cT: [
    "textPath",
    "tspan"
    ],
    cG: [
    "stop"
    ],
    cF: [
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feDropShadow",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence"
    ]
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
      nodeName: str_path,
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
      nodeName: str_path,
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
      attributes: [str_points],
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
      attributes: [str_points],
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
    return [["M".concat(x + (width - w) / 2, ",").concat(y), "h".concat(w), s, "".concat(x + width, ",").concat(y + (height - h) / 2), "v".concat(h), s, "".concat(x + width - cornerRadius, ",").concat(y + height), "h".concat(-w), s, "".concat(x, ",").concat(y + height - cornerRadius), "v".concat(-h), s, "".concat(x + cornerRadius, ",").concat(y)].join(" ")];
  };
  var RoundRect = {
    roundRect: {
      nodeName: str_path,
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
  var svg_is_iterable = function svg_is_iterable(obj) {
    return obj != null && _typeof(obj[Symbol.iterator]) === str_function;
  };
  var svg_semi_flatten_arrays = function svg_semi_flatten_arrays() {
    switch (arguments.length) {
      case undefined:
      case 0:
        return Array.from(arguments);
      case 1:
        return svg_is_iterable(arguments[0]) && _typeof(arguments[0]) !== str_string ? svg_semi_flatten_arrays.apply(void 0, _toConsumableArray(arguments[0])) : [arguments[0]];
      default:
        return Array.from(arguments).map(function (a) {
          return svg_is_iterable(a) ? _toConsumableArray(svg_semi_flatten_arrays(a)) : a;
        });
    }
  };
  var coordinates = function coordinates() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return args.filter(function (a) {
      return _typeof(a) === str_number;
    }).concat(args.filter(function (a) {
      return _typeof(a) === str_object && a !== null;
    }).map(function (el) {
      if (_typeof(el.x) === str_number) {
        return [el.x, el.y];
      }
      if (_typeof(el[0]) === str_number) {
        return [el[0], el[1]];
      }
      return undefined;
    }).filter(function (a) {
      return a !== undefined;
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []));
  };
  var svg_magnitudeSq2 = function svg_magnitudeSq2(a) {
    return Math.pow(a[0], 2) + Math.pow(a[1], 2);
  };
  var svg_magnitude2 = function svg_magnitude2(a) {
    return Math.sqrt(svg_magnitudeSq2(a));
  };
  var svg_distanceSq2 = function svg_distanceSq2(a, b) {
    return svg_magnitudeSq2(svg_sub2(a, b));
  };
  var svg_distance2 = function svg_distance2(a, b) {
    return Math.sqrt(svg_distanceSq2(a, b));
  };
  var svg_add2 = function svg_add2(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
  };
  var svg_sub2 = function svg_sub2(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
  };
  var svg_scale2 = function svg_scale2(a, s) {
    return [a[0] * s, a[1] * s];
  };
  var svg_algebra = Object.freeze({
    __proto__: null,
    svg_magnitudeSq2: svg_magnitudeSq2,
    svg_magnitude2: svg_magnitude2,
    svg_distanceSq2: svg_distanceSq2,
    svg_distance2: svg_distance2,
    svg_add2: svg_add2,
    svg_sub2: svg_sub2,
    svg_scale2: svg_scale2
  });
  var ends = [str_tail, str_head];
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
    var vector = svg_sub2(pts[1], pts[0]);
    var midpoint = svg_add2(pts[0], svg_scale2(vector, 0.5));
    var len = svg_magnitude2(vector);
    var minLength = ends.map(function (s) {
      return options[s].visible ? (1 + options[s].padding) * options[s].height * 2.5 : 0;
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
    if (len < minLength) {
      var minVec = len === 0 ? [minLength, 0] : svg_scale2(vector, minLength / len);
      pts = [svg_sub2, svg_add2].map(function (f) {
        return f(midpoint, svg_scale2(minVec, 0.5));
      });
      vector = svg_sub2(pts[1], pts[0]);
    }
    var perpendicular = [vector[1], -vector[0]];
    var bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, options.bend));
    var bezs = pts.map(function (pt) {
      return svg_sub2(bezPoint, pt);
    });
    var bezsLen = bezs.map(function (v) {
      return svg_magnitude2(v);
    });
    var bezsNorm = bezs.map(function (bez, i) {
      return bezsLen[i] === 0 ? bez : svg_scale2(bez, 1 / bezsLen[i]);
    });
    var vectors = bezsNorm.map(function (norm) {
      return svg_scale2(norm, -1);
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
      return svg_add2(pt, svg_scale2(bezsNorm[i], scales[i]));
    });
    vector = svg_sub2(arcs[1], arcs[0]);
    perpendicular = [vector[1], -vector[0]];
    midpoint = svg_add2(arcs[0], svg_scale2(vector, 0.5));
    bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, options.bend));
    var controls = arcs.map(function (arc, i) {
      return svg_add2(arc, svg_scale2(svg_sub2(bezPoint, arc), options.pinch));
    });
    var polyPoints = ends.map(function (s, i) {
      return [svg_add2(arcs[i], svg_scale2(vectors[i], options[s].height)), svg_add2(arcs[i], svg_scale2(normals[i], options[s].width / 2)), svg_add2(arcs[i], svg_scale2(normals[i], -options[s].width / 2))];
    });
    return {
      line: "M".concat(stringifyPoint(arcs[0]), "C").concat(stringifyPoint(controls[0]), ",").concat(stringifyPoint(controls[1]), ",").concat(stringifyPoint(arcs[1])),
      tail: pointsToPath(polyPoints[0]),
      head: pointsToPath(polyPoints[1])
    };
  };
  var setArrowheadOptions = function setArrowheadOptions(element, options, which) {
    if (_typeof(options) === str_boolean) {
      element.options[which].visible = options;
    } else if (_typeof(options) === str_object) {
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
    var path = element.getElementsByClassName("".concat(str_arrow, "-").concat(which))[0];
    Object.keys(options).map(function (key) {
      return {
        key: key,
        fn: path[Case.toCamel(key)]
      };
    }).filter(function (el) {
      return _typeof(el.fn) === str_function;
    }).forEach(function (el) {
      return el.fn(options[el.key]);
    });
  };
  var redraw = function redraw(element) {
    var paths = makeArrowPaths(element.options);
    Object.keys(paths).map(function (path) {
      return {
        path: path,
        element: element.getElementsByClassName("".concat(str_arrow, "-").concat(path))[0]
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
    element.options.points = coordinates.apply(void 0, _toConsumableArray(svg_semi_flatten_arrays.apply(void 0, args))).slice(0, 4);
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
    setArrowheadOptions(element, options, str_head);
    setArrowStyle(element, options, str_head);
    return redraw(element);
  };
  var tail = function tail(element, options) {
    setArrowheadOptions(element, options, str_tail);
    setArrowStyle(element, options, str_tail);
    return redraw(element);
  };
  var getLine = function getLine(element) {
    return element.getElementsByClassName("".concat(str_arrow, "-line"))[0];
  };
  var getHead = function getHead(element) {
    return element.getElementsByClassName("".concat(str_arrow, "-").concat(str_head))[0];
  };
  var getTail = function getTail(element) {
    return element.getElementsByClassName("".concat(str_arrow, "-").concat(str_tail))[0];
  };
  var ArrowMethods = {
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
      if (_typeof(args[a]) !== str_object) {
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
    element.setAttribute(str_class, str_arrow);
    var paths = ["line", str_tail, str_head].map(function (key) {
      return SVG.path().setClass("".concat(str_arrow, "-").concat(key)).appendTo(element);
    });
    paths[0].setAttribute(str_style, "fill:none;");
    paths[1].setAttribute(str_stroke, str_none);
    paths[2].setAttribute(str_stroke, str_none);
    element.options = makeArrowOptions();
    for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      args[_key6 - 1] = arguments[_key6];
    }
    ArrowMethods.setPoints.apply(ArrowMethods, [element].concat(args));
    var options = matchingOptions.apply(void 0, args);
    if (options) {
      Object.keys(options).filter(function (key) {
        return ArrowMethods[key];
      }).forEach(function (key) {
        return ArrowMethods[key](element, options[key]);
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
      methods: ArrowMethods,
      init: init
    }
  };
  var svg_flatten_arrays = function svg_flatten_arrays() {
    return svg_semi_flatten_arrays(arguments).reduce(function (a, b) {
      return a.concat(b);
    }, []);
  };
  var makeCurvePath = function makeCurvePath() {
    var endpoints = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var bend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var pinch = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;
    var tailPt = [endpoints[0] || 0, endpoints[1] || 0];
    var headPt = [endpoints[2] || 0, endpoints[3] || 0];
    var vector = svg_sub2(headPt, tailPt);
    var midpoint = svg_add2(tailPt, svg_scale2(vector, 0.5));
    var perpendicular = [vector[1], -vector[0]];
    var bezPoint = svg_add2(midpoint, svg_scale2(perpendicular, bend));
    var tailControl = svg_add2(tailPt, svg_scale2(svg_sub2(bezPoint, tailPt), pinch));
    var headControl = svg_add2(headPt, svg_scale2(svg_sub2(bezPoint, headPt), pinch));
    return "M".concat(tailPt[0], ",").concat(tailPt[1], "C").concat(tailControl[0], ",").concat(tailControl[1], " ").concat(headControl[0], ",").concat(headControl[1], " ").concat(headPt[0], ",").concat(headPt[1]);
  };
  var curveArguments = function curveArguments() {
    return [makeCurvePath(coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays.apply(void 0, arguments))))];
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
    var coords = coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays.apply(void 0, args))).slice(0, 4);
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
  var curve_methods = {
    setPoints: setPoints$2,
    bend: bend,
    pinch: pinch
  };
  var Curve = {
    curve: {
      nodeName: str_path,
      attributes: ["d"],
      args: curveArguments,
      methods: curve_methods
    }
  };
  var nodes = {};
  Object.assign(nodes,
  Arc, Wedge, Parabola, RegularPolygon, RoundRect, Arrow, Curve);
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
    var numbers = coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays(arguments)));
    if (numbers.length === 2) {
      numbers.unshift(0, 0);
    }
    return numbers.length === 4 ? viewBoxValue.apply(void 0, _toConsumableArray(numbers)) : undefined;
  }
  var cdata = function cdata(textContent) {
    return new (SVGWindow().DOMParser)().parseFromString("<root></root>", "text/xml").createCDATASection("".concat(textContent));
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
    return new (SVGWindow().DOMParser)().parseFromString(string, "text/xml");
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
      if (_typeof(input) === str_string || input instanceof String) {
        fetch(input).then(function (response) {
          return response.text();
        }).then(function (str) {
          return checkParseError(parse(str));
        }).then(function (xml) {
          return xml.nodeName === str_svg ? xml : xml.getElementsByTagName(str_svg)[0];
        }).then(function (svg) {
          return svg == null ? reject("valid XML found, but no SVG element") : resolve(svg);
        })["catch"](function (err) {
          return reject(err);
        });
      } else if (input instanceof SVGWindow().Document) {
        return asyncDone(input);
      }
    });
  };
  var sync = function sync(input) {
    if (_typeof(input) === str_string || input instanceof String) {
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
    return _typeof(input) === str_string && /^[\w,\s-]+\.[A-Za-z]{3}$/.test(input) && input.length < 10000;
  };
  var Load = function Load(input) {
    return isFilename(input) && isBrowser && _typeof(SVGWindow().fetch) === str_function ? async(input) : sync(input);
  };
  function vkXML(text, step) {
    var ar = text.replace(/>\s{0,}</g, "><").replace(/</g, "~::~<").replace(/\s*xmlns\:/g, "~::~xmlns:")
    .split("~::~");
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
    return str[0] === "\n" ? str.slice(1) : str;
  }
  var SAVE_OPTIONS = function SAVE_OPTIONS() {
    return {
      download: false,
      output: str_string,
      windowStyle: false,
      filename: "image.svg"
    };
  };
  var getWindowStylesheets = function getWindowStylesheets() {
    var css = [];
    if (SVGWindow().document.styleSheets) {
      for (var s = 0; s < SVGWindow().document.styleSheets.length; s += 1) {
        var sheet = SVGWindow().document.styleSheets[s];
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
    var blob = new (SVGWindow().Blob)([contentsAsString], {
      type: "text/plain"
    });
    var a = SVGWindow().document.createElement("a");
    a.setAttribute("href", SVGWindow().URL.createObjectURL(blob));
    a.setAttribute("download", filename);
    SVGWindow().document.body.appendChild(a);
    a.click();
    SVGWindow().document.body.removeChild(a);
  };
  var save = function save(svg, options) {
    options = Object.assign(SAVE_OPTIONS(), options);
    if (options.windowStyle) {
      var styleContainer = SVGWindow().document.createElementNS(NS, str_style);
      styleContainer.setAttribute("type", "text/css");
      styleContainer.innerHTML = getWindowStylesheets();
      svg.appendChild(styleContainer);
    }
    var source = new (SVGWindow().XMLSerializer)().serializeToString(svg);
    var formattedString = vkXML(source);
    if (options.download && isBrowser && !isNode) {
      downloadInBrowser(options.filename, formattedString);
    }
    return options.output === str_svg ? svg : formattedString;
  };
  var setViewBox = function setViewBox(element) {
    for (var _len8 = arguments.length, args = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
      args[_key8 - 1] = arguments[_key8];
    }
    var viewBox = args.length === 1 && _typeof(args[0]) === str_string ? args[0] : viewBox$1.apply(void 0, args);
    if (viewBox) {
      element.setAttribute(str_viewBox, viewBox);
    }
    return element;
  };
  var getViewBox = function getViewBox(element) {
    var vb = element.getAttribute(str_viewBox);
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
    return _typeof(result.then) === str_function ? result.then(function (svg) {
      return assignSVG(target, svg);
    }) : assignSVG(target, result);
  };
  var getFrame = function getFrame(element) {
    var viewBox = getViewBox(element);
    if (viewBox !== undefined) {
      return viewBox;
    }
    if (_typeof(element.getBoundingClientRect) === str_function) {
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
      return child.getAttribute(str_class) === bgClass;
    }).shift();
    if (backRect == null) {
      backRect = this.Constructor.apply(this, ["rect", null].concat(_toConsumableArray(getFrame(element))));
      backRect.setAttribute(str_class, bgClass);
      backRect.setAttribute(str_stroke, str_none);
      element.insertBefore(backRect, element.firstChild);
    }
    backRect.setAttribute(str_fill, color);
    return element;
  };
  var findStyleSheet = function findStyleSheet(element) {
    var styles = element.getElementsByTagName(str_style);
    return styles.length === 0 ? undefined : styles[0];
  };
  var _stylesheet = function stylesheet(element, textContent) {
    var styleSection = findStyleSheet(element);
    if (styleSection == null) {
      styleSection = this.Constructor(str_style);
      element.insertBefore(styleSection, element.firstChild);
    }
    styleSection.textContent = "";
    styleSection.appendChild(cdata(textContent));
    return styleSection;
  };
  var methods$1 = {
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
    release: ["mouseup", "touchend"],
    leave: ["mouseleave", "touchcancel"]
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
      leave: function leave() {},
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
      if (SVGWindow().cancelAnimationFrame) {
        SVGWindow().cancelAnimationFrame(requestId);
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
            requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
          }
        };
        handlers[uuid] = handlerFunc;
        if (SVGWindow().requestAnimationFrame) {
          requestId = SVGWindow().requestAnimationFrame(handlers[uuid]);
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
      coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays.apply(void 0, arguments))).forEach(function (n, i) {
        position[i] = n;
      });
      updateSVG();
      if (_typeof(position.delegate) === str_function) {
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
      return Math.sqrt(svg_distanceSq2(mouse, position));
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
    [str_svg, "updatePosition", "selected"].forEach(function (key) {
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
      return _typeof(delegate) === str_function ? delegate.call(points, point, selected, points) : undefined;
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
          d: svg_distanceSq2(p, [mouse.x, mouse.y])
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
        if (_typeof(arguments[0]) === str_function) {
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
  var svgDef = {
    svg: {
      args: function args() {
        return [viewBox$1(coordinates.apply(void 0, arguments))].filter(function (a) {
          return a != null;
        });
      },
      methods: methods$1,
      init: function init(element) {
        for (var _len11 = arguments.length, args = new Array(_len11 > 1 ? _len11 - 1 : 0), _key11 = 1; _key11 < _len11; _key11++) {
          args[_key11 - 1] = arguments[_key11];
        }
        args.filter(function (a) {
          return _typeof(a) === str_string;
        }).forEach(function (string) {
          return loadSVG(element, string);
        });
        args.filter(function (a) {
          return a != null;
        })
        .filter(function (el) {
          return _typeof(el.appendChild) === str_function;
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
      return element.tagName === str_svg;
    }).forEach(function (element) {
      return moveChildren(group, element);
    });
    elements.filter(function (element) {
      return element.tagName !== str_svg;
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
    svg: [str_viewBox],
    line: ["x1", "y1", "x2", "y2"],
    rect: ["x", "y", "width", "height"],
    circle: ["cx", "cy", "r"],
    ellipse: ["cx", "cy", "rx", "ry"],
    polygon: [str_points],
    polyline: [str_points],
    path: ["d"],
    text: ["x", "y"],
    mask: [str_id],
    symbol: [str_id],
    clipPath: [str_id, "clip-rule"
    ],
    marker: [str_id, "markerHeight", "markerUnits", "markerWidth", "orient", "refX", "refY"],
    linearGradient: ["x1",
    "x2",
    "y1",
    "y2"
    ],
    radialGradient: ["cx",
    "cy",
    "r",
    "fr",
    "fx",
    "fy"
    ],
    stop: ["offset", "stop-color", "stop-opacity"],
    pattern: ["patternContentUnits",
    "patternTransform",
    "patternUnits"
    ]
  });
  var setRadius = function setRadius(el, r) {
    el.setAttribute(attributes.circle[2], r);
    return el;
  };
  var setOrigin = function setOrigin(el, a, b) {
    _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays(a, b))).slice(0, 2)).forEach(function (value, i) {
      return el.setAttribute(attributes.circle[i], value);
    });
    return el;
  };
  var fromPoints = function fromPoints(a, b, c, d) {
    return [a, b, svg_distance2([a, b], [c, d])];
  };
  var circleDef = {
    circle: {
      args: function args(a, b, c, d) {
        var coords = coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays(a, b, c, d)));
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
    _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays(a, b))).slice(0, 2)).forEach(function (value, i) {
      return el.setAttribute(attributes.ellipse[i], value);
    });
    return el;
  };
  var ellipseDef = {
    ellipse: {
      args: function args(a, b, c, d) {
        var coords = coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays(a, b, c, d))).slice(0, 4);
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
    return coordinates.apply(void 0, _toConsumableArray(svg_semi_flatten_arrays.apply(void 0, arguments))).slice(0, 4);
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
    el.setAttribute("d", "".concat(getD(el)).concat(command).concat(svg_flatten_arrays.apply(void 0, args).join(" ")));
    return el;
  };
  var getCommands = function getCommands(element) {
    return parsePathCommands(getD(element));
  };
  var path_methods = {
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
    path_methods[pathCommands[key]] = function (el) {
      for (var _len15 = arguments.length, args = new Array(_len15 > 1 ? _len15 - 1 : 0), _key15 = 1; _key15 < _len15; _key15++) {
        args[_key15 - 1] = arguments[_key15];
      }
      return appendPathCommand.apply(void 0, [el, key].concat(args));
    };
  });
  var pathDef = {
    path: {
      methods: path_methods
    }
  };
  var setRectSize = function setRectSize(el, rx, ry) {
    [,, rx, ry].forEach(function (value, i) {
      return el.setAttribute(attributes.rect[i], value);
    });
    return el;
  };
  var setRectOrigin = function setRectOrigin(el, a, b) {
    _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays(a, b))).slice(0, 2)).forEach(function (value, i) {
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
        var coords = coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays(a, b, c, d))).slice(0, 4);
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
        return coordinates.apply(void 0, _toConsumableArray(svg_flatten_arrays(a, b, c))).slice(0, 2);
      },
      init: function init(element, a, b, c, d) {
        var text = [a, b, c, d].filter(function (a) {
          return _typeof(a) === str_string;
        }).shift();
        if (text) {
          element.appendChild(SVGWindow().document.createTextNode(text));
        }
      }
    }
  };
  var makeIDString = function makeIDString() {
    return Array.from(arguments).filter(function (a) {
      return _typeof(a) === str_string || a instanceof String;
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
    var attr = el.getAttribute(str_points);
    return attr == null ? "" : attr;
  };
  var polyString = function polyString() {
    var _arguments = arguments;
    return Array.from(Array(Math.floor(arguments.length / 2))).map(function (_, i) {
      return "".concat(_arguments[i * 2 + 0], ",").concat(_arguments[i * 2 + 1]);
    }).join(" ");
  };
  var stringifyArgs = function stringifyArgs() {
    return [polyString.apply(void 0, _toConsumableArray(coordinates.apply(void 0, _toConsumableArray(svg_semi_flatten_arrays.apply(void 0, arguments)))))];
  };
  var setPoints = function setPoints(element) {
    for (var _len16 = arguments.length, args = new Array(_len16 > 1 ? _len16 - 1 : 0), _key16 = 1; _key16 < _len16; _key16++) {
      args[_key16 - 1] = arguments[_key16];
    }
    element.setAttribute(str_points, stringifyArgs.apply(void 0, args)[0]);
    return element;
  };
  var addPoint = function addPoint(element) {
    for (var _len17 = arguments.length, args = new Array(_len17 > 1 ? _len17 - 1 : 0), _key17 = 1; _key17 < _len17; _key17++) {
      args[_key17 - 1] = arguments[_key17];
    }
    element.setAttribute(str_points, [getPoints(element), stringifyArgs.apply(void 0, args)[0]].filter(function (a) {
      return a !== "";
    }).join(" "));
    return element;
  };
  var Args = function Args() {
    return arguments.length === 1 && _typeof(arguments.length <= 0 ? undefined : arguments[0]) === str_string ? [arguments.length <= 0 ? undefined : arguments[0]] : stringifyArgs.apply(void 0, arguments);
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
  var Spec = Object.assign({}, svgDef, gDef, circleDef, ellipseDef, lineDef, pathDef, rectDef, styleDef, textDef,
  maskTypes, polyDefs);
  var ManyElements = {
    presentation: ["color", "color-interpolation", "cursor",
    "direction",
    "display",
    "fill", "fill-opacity", "fill-rule", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "image-rendering",
    "letter-spacing", "opacity", "overflow", "paint-order", "pointer-events", "preserveAspectRatio", "shape-rendering", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tabindex", "transform-origin",
    "user-select",
    "vector-effect", "visibility"],
    animation: ["accumulate",
    "additive",
    "attributeName",
    "begin", "by", "calcMode", "dur", "end", "from", "keyPoints",
    "keySplines", "keyTimes", "max", "min", "repeatCount", "repeatDur", "restart", "to",
    "values"],
    effects: ["azimuth",
    "baseFrequency", "bias", "color-interpolation-filters", "diffuseConstant", "divisor", "edgeMode", "elevation", "exponent", "filter", "filterRes", "filterUnits", "flood-color", "flood-opacity", "in",
    "in2",
    "intercept",
    "k1",
    "k2",
    "k3",
    "k4",
    "kernelMatrix",
    "lighting-color", "limitingConeAngle", "mode", "numOctaves", "operator", "order", "pointsAtX", "pointsAtY", "pointsAtZ", "preserveAlpha", "primitiveUnits", "radius", "result", "seed", "specularConstant", "specularExponent", "stdDeviation", "stitchTiles", "surfaceScale", "targetX",
    "targetY",
    "type",
    "xChannelSelector",
    "yChannelSelector"],
    text: [
    "dx",
    "dy",
    "alignment-baseline",
    "baseline-shift", "dominant-baseline", "lengthAdjust",
    "method",
    "overline-position", "overline-thickness", "rotate",
    "spacing", "startOffset",
    "strikethrough-position", "strikethrough-thickness", "text-anchor", "text-decoration", "text-rendering", "textLength",
    "underline-position", "underline-thickness", "word-spacing", "writing-mode"],
    gradient: ["gradientTransform",
    "gradientUnits",
    "spreadMethod"
    ]
  };
  Object.values(NodeNames).reduce(function (a, b) {
    return a.concat(b);
  }, []).filter(function (nodeName) {
    return attributes[nodeName] === undefined;
  }).forEach(function (nodeName) {
    attributes[nodeName] = [];
  });
  [[[str_svg, "defs", "g"].concat(NodeNames.v, NodeNames.t), ManyElements.presentation], [["filter"], ManyElements.effects], [NodeNames.cT.concat("text"), ManyElements.text],
  [NodeNames.cF, ManyElements.effects], [NodeNames.cG, ManyElements.gradient]].forEach(function (pair) {
    return pair[0].forEach(function (key) {
      attributes[key] = attributes[key].concat(pair[1]);
    });
  });
  var getClassList = function getClassList(element) {
    if (element == null) {
      return [];
    }
    var currentClass = element.getAttribute(str_class);
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
      element.setAttributeNS(null, str_class, classes.join(" "));
    },
    removeClass: function removeClass(element, removedClass) {
      var classes = getClassList(element).filter(function (c) {
        return c !== removedClass;
      });
      element.setAttributeNS(null, str_class, classes.join(" "));
    },
    setClass: function setClass(element, className) {
      element.setAttributeNS(null, str_class, className);
    },
    setId: function setId(element, idName) {
      element.setAttributeNS(null, str_id, idName);
    }
  };
  var getAttr = function getAttr(element) {
    var t = element.getAttribute(str_transform);
    return t == null || t === "" ? undefined : t;
  };
  var TransformMethods = {
    clearTransform: function clearTransform(el) {
      el.removeAttribute(str_transform);
      return el;
    }
  };
  ["translate", "rotate", "scale", "matrix"].forEach(function (key) {
    TransformMethods[key] = function (element) {
      for (var _len18 = arguments.length, args = new Array(_len18 > 1 ? _len18 - 1 : 0), _key18 = 1; _key18 < _len18; _key18++) {
        args[_key18 - 1] = arguments[_key18];
      }
      return element.setAttribute(str_transform, [getAttr(element), "".concat(key, "(").concat(args.join(" "), ")")].filter(function (a) {
        return a !== undefined;
      }).join(" "));
    };
  });
  var findIdURL = function findIdURL(arg) {
    if (arg == null) {
      return "";
    }
    if (_typeof(arg) === str_string) {
      return arg.slice(0, 3) === "url" ? arg : "url(#".concat(arg, ")");
    }
    if (arg.getAttribute != null) {
      var idString = arg.getAttribute(str_id);
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
  var assignMethods = function assignMethods(groups, Methods) {
    groups.forEach(function (n) {
      return Object.keys(Methods).forEach(function (method) {
        Nodes[n].methods[method] = function () {
          Methods[method].apply(Methods, arguments);
          return arguments[0];
        };
      });
    });
  };
  assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), classMethods);
  assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g, NodeNames.s, NodeNames.p, NodeNames.i, NodeNames.h, NodeNames.d), dom);
  assignMethods(svg_flatten_arrays(NodeNames.v, NodeNames.g, NodeNames.s), TransformMethods);
  assignMethods(svg_flatten_arrays(NodeNames.t, NodeNames.v, NodeNames.g), methods);
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
  var constructor = function constructor(nodeName, parent) {
    var _Nodes$nodeName, _Nodes$nodeName2;
    for (var _len19 = arguments.length, args = new Array(_len19 > 2 ? _len19 - 2 : 0), _key19 = 2; _key19 < _len19; _key19++) {
      args[_key19 - 2] = arguments[_key19];
    }
    var element = SVGWindow().document.createElementNS(NS, Nodes[nodeName].nodeName);
    if (parent) {
      parent.appendChild(element);
    }
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
          return constructor.apply(void 0, [childNode, element].concat(Array.prototype.slice.call(arguments)));
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
        return constructor.apply(void 0, [nodeName, null].concat(args));
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
      nodeName: "g",
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
      methods: Nodes.g.methods,
      attributes: Nodes.g.attributes,
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
    nodesAndChildren[NODE_NAME] = _toConsumableArray(nodesAndChildren.g);
    nodesAndChildren.svg.push(NODE_NAME);
    nodesAndChildren.g.push(NODE_NAME);
    svg[NODE_NAME] = function () {
      for (var _len23 = arguments.length, args = new Array(_len23), _key23 = 0; _key23 < _len23; _key23++) {
        args[_key23] = arguments[_key23];
      }
      return constructor.apply(void 0, [NODE_NAME, null].concat(args));
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
      return _typeof(arg) === str_function;
    }).forEach(function (func) {
      return func.call(svg, svg);
    });
  };
  SVG_Constructor.init = function () {
    var _arguments2 = arguments;
    var svg = constructor.apply(void 0, [str_svg, null].concat(Array.prototype.slice.call(arguments)));
    if (SVGWindow().document.readyState === "loading") {
      SVGWindow().document.addEventListener("DOMContentLoaded", function () {
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
    flatten: svg_flatten_arrays,
    attributes: attributes,
    children: nodesAndChildren,
    cdata: cdata
  }, Case, classMethods, dom, svg_algebra, TransformMethods, viewBox);
  Object.defineProperty(SVG, "window", {
    enumerable: false,
    set: function set(value) {
      return setWindow(value);
    }
  });

  var make_faces_geometry = function make_faces_geometry(graph) {
    var _window = RabbitEarWindow(),
        THREE = _window.THREE;
    var vertices = graph.vertices_coords.map(function (v) {
      return [v[0], v[1], v[2] || 0];
    }).flat();
    var normals = graph.vertices_coords.map(function (v) {
      return [0, 0, 1];
    }).flat();
    var colors = graph.vertices_coords.map(function (v) {
      return [1, 1, 1];
    }).flat();
    var faces = graph.faces_vertices.map(function (fv) {
      return fv.map(function (v, i, arr) {
        return [arr[0], arr[i + 1], arr[i + 2]];
      }).slice(0, fv.length - 2);
    }).flat(2);
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(faces);
    return geometry;
  };
  var make_edge_cylinder = function make_edge_cylinder(edge_coords, edge_vector, radius) {
    var end_pad = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
    if (math.core.magSquared(edge_vector) < math.core.EPSILON) {
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
    }).flat();
  };
  var make_edges_geometry = function make_edges_geometry(_ref) {
    var vertices_coords = _ref.vertices_coords,
        edges_vertices = _ref.edges_vertices,
        edges_assignment = _ref.edges_assignment,
        edges_coords = _ref.edges_coords,
        edges_vector = _ref.edges_vector;
    var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.002;
    var end_pad = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var _window2 = RabbitEarWindow(),
        THREE = _window2.THREE;
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
    }).flat(3);
    var vertices = edges_coords.map(function (coords, i) {
      return make_edge_cylinder(coords, edges_vector[i], scale, end_pad);
    }).flat(2);
    var normals = edges_vector.map(function (vector) {
      if (math.core.magSquared(vector) < math.core.EPSILON) {
        throw "degenerate edge";
      }
      var normalized = math.core.normalize(vector);
      math.core.scale(normalized, scale);
      var c0 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0, 0, -1])), scale);
      var c1 = math.core.scale(math.core.normalize(math.core.cross3(vector, [0, 0, 1])), scale);
      return [c0, [-c0[2], c0[1], c0[0]], c1, [-c1[2], c1[1], c1[0]], c0, [-c0[2], c0[1], c0[0]], c1, [-c1[2], c1[1], c1[0]]];
    }).flat(2);
    var faces = edges_coords.map(function (e, i) {
      return [
      i * 8 + 0, i * 8 + 4, i * 8 + 1, i * 8 + 1, i * 8 + 4, i * 8 + 5, i * 8 + 1, i * 8 + 5, i * 8 + 2, i * 8 + 2, i * 8 + 5, i * 8 + 6, i * 8 + 2, i * 8 + 6, i * 8 + 3, i * 8 + 3, i * 8 + 6, i * 8 + 7, i * 8 + 3, i * 8 + 7, i * 8 + 0, i * 8 + 0, i * 8 + 7, i * 8 + 4,
      i * 8 + 0, i * 8 + 1, i * 8 + 3, i * 8 + 1, i * 8 + 2, i * 8 + 3, i * 8 + 5, i * 8 + 4, i * 8 + 7, i * 8 + 7, i * 8 + 6, i * 8 + 5];
    }).flat();
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

  var ear$1 = Object.assign(root, ObjectConstructors, {
    math: math.core,
    axiom: axiom,
    diagram: diagram,
    layer: layer,
    singleVertex: singleVertex,
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
  if (!isWebWorker) {
    ear$1.use(FOLDtoSVG);
    ear$1.use(SVG);
  }
  Object.defineProperty(ear$1, "window", {
    enumerable: false,
    set: function set(value) {
      setWindow$1(value);
      SVG.window = value;
    }
  });

  return ear$1;

})));
