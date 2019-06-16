/* Rabbit Ear v0.2 (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.RabbitEar = factory());
}(this, (function () { 'use strict';

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
  var make_matrix2_rotation = function make_matrix2_rotation(angle, origin) {
    var a = Math.cos(angle);
    var b = Math.sin(angle);
    var c = -b;
    var d = a;
    var tx = origin != null ? origin[0] : 0;
    var ty = origin != null ? origin[1] : 0;
    return [a, b, c, d, tx, ty];
  };
  var make_matrix2_inverse = function make_matrix2_inverse(m) {
    var det = m[0] * m[3] - m[1] * m[2];
    if (!det || isNaN(det) || !isFinite(m[4]) || !isFinite(m[5])) {
      return undefined;
    }
    return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det, (m[2] * m[5] - m[3] * m[4]) / det, (m[1] * m[4] - m[0] * m[5]) / det];
  };
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
    midpoint2: midpoint2,
    multiply_vector2_matrix2: multiply_vector2_matrix2,
    multiply_line_matrix2: multiply_line_matrix2,
    multiply_matrices2: multiply_matrices2,
    make_matrix2_reflection: make_matrix2_reflection,
    make_matrix2_rotation: make_matrix2_rotation,
    make_matrix2_inverse: make_matrix2_inverse
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
        return is_iterable(args[0]) ? flatten_input.apply(void 0, _toConsumableArray(args[0])) : [args[0]];
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
  var identity = [1, 0, 0, 1, 0, 0];
  var get_matrix2 = function get_matrix2() {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      args[_key5] = arguments[_key5];
    }
    var m = get_vector(args);
    if (m.length === 6) {
      return m;
    }
    if (m.length > 6) {
      return [m[0], m[1], m[3], m[4], m[5], m[6]];
    }
    if (m.length < 6) {
      return identity.map(function (n, i) {
        return m[i] || n;
      });
    }
    return undefined;
  };
  function get_edge() {
    for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      args[_key6] = arguments[_key6];
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
    for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      args[_key7] = arguments[_key7];
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
    for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
      args[_key8] = arguments[_key8];
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
  var equal = Object.freeze({
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
  var query = Object.freeze({
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
  var intersection = Object.freeze({
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
  var origami = Object.freeze({
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
    var matrix = [];
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    get_matrix2(args).forEach(function (n) {
      return matrix.push(n);
    });
    var inverse = function inverse() {
      return Matrix2(make_matrix2_inverse(matrix).map(function (n) {
        return clean_number(n);
      }));
    };
    var multiply = function multiply() {
      for (var _len2 = arguments.length, innerArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        innerArgs[_key2] = arguments[_key2];
      }
      var m2 = get_matrix2(innerArgs);
      return Matrix2(multiply_matrices2(matrix, m2).map(function (n) {
        return clean_number(n);
      }));
    };
    var transform = function transform() {
      for (var _len3 = arguments.length, innerArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        innerArgs[_key3] = arguments[_key3];
      }
      var v = get_vector(innerArgs);
      return Vector(multiply_vector2_matrix2(v, matrix).map(function (n) {
        return clean_number(n);
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
  Object.assign(core, algebra, geometry, query, equal, origami);
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
  var math$1 = {
    vector: Vector,
    matrix2: Matrix2,
    line: Line,
    ray: Ray,
    edge: Edge,
    circle: Circle,
    polygon: Polygon,
    convexPolygon: ConvexPolygon,
    rectangle: Rectangle,
    junction: Junction,
    sector: Sector,
    core: core
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
  const removeChildren = function (parent) {
    while (parent.lastChild) {
      parent.removeChild(parent.lastChild);
    }
  };
  const getWidth = function (svg) {
    const w = parseInt(svg.getAttributeNS(null, "width"), 10);
    return w != null && !isNaN(w) ? w : svg.getBoundingClientRect().width;
  };
  const getHeight = function (svg) {
    const h = parseInt(svg.getAttributeNS(null, "height"), 10);
    return h != null && !isNaN(h) ? h : svg.getBoundingClientRect().height;
  };
  const getClassList = function (xmlNode) {
    const currentClass = xmlNode.getAttribute("class");
    return (currentClass == null
      ? []
      : currentClass.split(" ").filter(s => s !== ""));
  };
  const addClass = function (xmlNode, newClass) {
    if (xmlNode == null) {
      return;
    }
    const classes = getClassList(xmlNode)
      .filter(c => c !== newClass);
    classes.push(newClass);
    xmlNode.setAttributeNS(null, "class", classes.join(" "));
    return xmlNode;
  };
  const removeClass = function (xmlNode, removedClass) {
    if (xmlNode == null) {
      return;
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
  const downloadInBrowser = function (filename, contentsAsString) {
    const blob = new window.Blob([contentsAsString], {type: "text/plain"});
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
      const styleContainer = document.createElementNS("http://www.w3.org/2000/svg", "style");
      styleContainer.setAttribute("type", "text/css");
      styleContainer.innerHTML = getPageCSS();
      svg.appendChild(styleContainer);
    }
    const source = (new XMLSerializer()).serializeToString(svg);
    const formattedString = vkXML(source);
    if (window != null) {
      downloadInBrowser(filename, formattedString);
    } else {
      console.warn("save() meant for in-browser use");
    }
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
            throw "error, valid XML found, but no SVG element";
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
  const getViewBox = function (svg) {
    const vb = svg.getAttribute("viewBox");
    return (vb == null
      ? undefined
      : vb.split(" ").map(n => parseFloat(n)));
  };
  const scaleViewBox = function (svg, scale, origin_x = 0, origin_y = 0) {
    if (scale < 1e-8) { scale = 0.01; }
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
  const translateViewBox = function (svg, dx, dy) {
    const viewBox = getViewBox(svg);
    if (viewBox == null) {
      setDefaultViewBox(svg);
    }
    viewBox[0] += dx;
    viewBox[1] += dy;
    svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
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
  const attachClassMethods = function (element) {
    element.removeChildren = function () {
      return removeChildren(element);
    };
    element.addClass = function (...args) {
      return addClass(element, ...args);
    };
    element.removeClass = function (...args) {
      return removeClass(element, ...args);
    };
    element.setClass = function (...args) {
      return setClass(element, ...args);
    };
    element.setID = function (...args) {
      return setID(element, ...args);
    };
  };
  const attachViewBoxMethods = function (element) {
    element.setViewBox = function (...args) {
      return setViewBox(element, ...args);
    };
    element.getViewBox = function (...args) {
      return getViewBox(element, ...args);
    };
    element.scaleViewBox = function (...args) {
      return scaleViewBox(element, ...args);
    };
    element.translateViewBox = function (...args) {
      return translateViewBox(element, ...args);
    };
    element.convertToViewBox = function (...args) {
      return convertToViewBox(element, ...args);
    };
  };
  const attachAppendableMethods = function (element, methods) {
    Object.keys(methods).forEach((key) => {
      element[key] = function (...args) {
        const g = methods[key](...args);
        element.appendChild(g);
        return g;
      };
    });
  };
  let DOMParser$1 = (typeof window === "undefined" || window === null)
    ? undefined
    : window.DOMParser;
  if (typeof DOMParser$1 === "undefined" || DOMParser$1 === null) {
    DOMParser$1 = require("xmldom").DOMParser;
  }
  let XMLSerializer$1 = (typeof window === "undefined" || window === null)
    ? undefined
    : window.XMLSerializer;
  if (typeof XMLSerializer$1 === "undefined" || XMLSerializer$1 === null) {
    XMLSerializer$1 = require("xmldom").XMLSerializer;
  }
  let document$1 = (typeof window === "undefined" || window === null)
    ? undefined
    : window.document;
  if (typeof document$1 === "undefined" || document$1 === null) {
    document$1 = new DOMParser$1()
      .parseFromString("<!DOCTYPE html><title>a</title>", "text/html");
  }
  const svgNS = "http://www.w3.org/2000/svg";
  const setPoints = function (polygon, pointsArray) {
    if (pointsArray == null || pointsArray.constructor !== Array) {
      return;
    }
    const pointsString = pointsArray.map(el => (el.constructor === Array
      ? el
      : [el.x, el.y]))
      .reduce((prev, curr) => `${prev}${curr[0]},${curr[1]} `, "");
    polygon.setAttributeNS(null, "points", pointsString);
  };
  const setArc = function (shape, x, y, radius,
    startAngle, endAngle, includeCenter = false) {
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
  };
  const line = function (x1, y1, x2, y2) {
    const shape = document$1.createElementNS(svgNS, "line");
    if (x1) { shape.setAttributeNS(null, "x1", x1); }
    if (y1) { shape.setAttributeNS(null, "y1", y1); }
    if (x2) { shape.setAttributeNS(null, "x2", x2); }
    if (y2) { shape.setAttributeNS(null, "y2", y2); }
    attachClassMethods(shape);
    return shape;
  };
  const circle = function (x, y, radius) {
    const shape = document$1.createElementNS(svgNS, "circle");
    if (x) { shape.setAttributeNS(null, "cx", x); }
    if (y) { shape.setAttributeNS(null, "cy", y); }
    if (radius) { shape.setAttributeNS(null, "r", radius); }
    attachClassMethods(shape);
    return shape;
  };
  const ellipse = function (x, y, rx, ry) {
    const shape = document$1.createElementNS(svgNS, "ellipse");
    if (x) { shape.setAttributeNS(null, "cx", x); }
    if (y) { shape.setAttributeNS(null, "cy", y); }
    if (rx) { shape.setAttributeNS(null, "rx", rx); }
    if (ry) { shape.setAttributeNS(null, "ry", ry); }
    attachClassMethods(shape);
    return shape;
  };
  const rect = function (x, y, width, height) {
    const shape = document$1.createElementNS(svgNS, "rect");
    if (x) { shape.setAttributeNS(null, "x", x); }
    if (y) { shape.setAttributeNS(null, "y", y); }
    if (width) { shape.setAttributeNS(null, "width", width); }
    if (height) { shape.setAttributeNS(null, "height", height); }
    attachClassMethods(shape);
    return shape;
  };
  const polygon = function (pointsArray) {
    const shape = document$1.createElementNS(svgNS, "polygon");
    setPoints(shape, pointsArray);
    attachClassMethods(shape);
    return shape;
  };
  const polyline = function (pointsArray) {
    const shape = document$1.createElementNS(svgNS, "polyline");
    setPoints(shape, pointsArray);
    attachClassMethods(shape);
    return shape;
  };
  const bezier = function (fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
    const pts = [[fromX, fromY], [c1X, c1Y], [c2X, c2Y], [toX, toY]]
      .map(p => p.join(","));
    const d = `M ${pts[0]} C ${pts[1]} ${pts[2]} ${pts[3]}`;
    const shape = document$1.createElementNS(svgNS, "path");
    shape.setAttributeNS(null, "d", d);
    attachClassMethods(shape);
    return shape;
  };
  const text = function (textString, x, y) {
    const shape = document$1.createElementNS(svgNS, "text");
    shape.innerHTML = textString;
    shape.setAttributeNS(null, "x", x);
    shape.setAttributeNS(null, "y", y);
    attachClassMethods(shape);
    return shape;
  };
  const wedge = function (x, y, radius, angleA, angleB) {
    const shape = document$1.createElementNS(svgNS, "path");
    setArc(shape, x, y, radius, angleA, angleB, true);
    attachClassMethods(shape);
    return shape;
  };
  const arc = function (x, y, radius, angleA, angleB) {
    const shape = document$1.createElementNS(svgNS, "path");
    setArc(shape, x, y, radius, angleA, angleB, false);
    attachClassMethods(shape);
    return shape;
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
  const svgNS$1 = "http://www.w3.org/2000/svg";
  const straightArrow = function (startPoint, endPoint, options) {
    const p = {
      color: "#000",
      strokeWidth: 0.5,
      strokeStyle: "",
      fillStyle: "",
      highlight: undefined,
      highlightStrokeStyle: "",
      highlightFillStyle: "",
      width: 0.5,
      length: 2,
      padding: 0.0,
      start: false,
      end: true,
    };
    if (typeof options === "object" && options !== null) {
      Object.assign(p, options);
    }
    const arrowFill = [
      "stroke:none",
      `fill:${p.color}`,
      p.fillStyle,
    ].filter(a => a !== "").join(";");
    const arrowStroke = [
      "fill:none",
      `stroke:${p.color}`,
      `stroke-width:${p.strokeWidth}`,
      p.strokeStyle,
    ].filter(a => a !== "").join(";");
    const thinStroke = Math.floor(p.strokeWidth * 3) / 10;
    const thinSpace = Math.floor(p.strokeWidth * 6) / 10;
    const highlightStroke = [
      "fill:none",
      `stroke:${p.highlight}`,
      `stroke-width:${p.strokeWidth * 0.5}`,
      `stroke-dasharray:${thinStroke} ${thinSpace}`,
      "stroke-linecap:round",
      p.strokeStyle,
    ].filter(a => a !== "").join(";");
    const highlightFill = [
      "stroke:none",
      `fill:${p.highlight}`,
      p.fillStyle,
    ].filter(a => a !== "").join(";");
    let start = startPoint;
    let end = endPoint;
    const vec = [end[0] - start[0], end[1] - start[1]];
    const arrowLength = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    const arrowVector = [vec[0] / arrowLength, vec[1] / arrowLength];
    const arrow90 = [arrowVector[1], -arrowVector[0]];
    start = [
      startPoint[0] + arrowVector[0] * (p.start ? 1 : 0) * p.padding,
      startPoint[1] + arrowVector[1] * (p.start ? 1 : 0) * p.padding,
    ];
    end = [
      endPoint[0] - arrowVector[0] * (p.end ? 1 : 0) * p.padding,
      endPoint[1] - arrowVector[1] * (p.end ? 1 : 0) * p.padding,
    ];
    const endHead = [
      [end[0] + arrow90[0] * p.width, end[1] + arrow90[1] * p.width],
      [end[0] - arrow90[0] * p.width, end[1] - arrow90[1] * p.width],
      [end[0] + arrowVector[0] * p.length, end[1] + arrowVector[1] * p.length],
    ];
    const startHead = [
      [start[0] - arrow90[0] * p.width, start[1] - arrow90[1] * p.width],
      [start[0] + arrow90[0] * p.width, start[1] + arrow90[1] * p.width],
      [start[0] - arrowVector[0] * p.length, start[1] - arrowVector[1] * p.length],
    ];
    const arrow = document$1.createElementNS(svgNS$1, "g");
    const l = line(start[0], start[1], end[0], end[1]);
    l.setAttribute("style", arrowStroke);
    arrow.appendChild(l);
    if (p.end) {
      const endArrowPoly = polygon(endHead);
      endArrowPoly.setAttribute("style", arrowFill);
      arrow.appendChild(endArrowPoly);
    }
    if (p.start) {
      const startArrowPoly = polygon(startHead);
      startArrowPoly.setAttribute("style", arrowFill);
      arrow.appendChild(startArrowPoly);
    }
    if (p.highlight !== undefined) {
      const hScale = 0.6;
      const centering = [
        arrowVector[0] * p.length * 0.09,
        arrowVector[1] * p.length * 0.09,
      ];
      const endHeadHighlight = [
        [centering[0] + end[0] + arrow90[0] * (p.width * hScale),
          centering[1] + end[1] + arrow90[1] * (p.width * hScale)],
        [centering[0] + end[0] - arrow90[0] * (p.width * hScale),
          centering[1] + end[1] - arrow90[1] * (p.width * hScale)],
        [centering[0] + end[0] + arrowVector[0] * (p.length * hScale),
          centering[1] + end[1] + arrowVector[1] * (p.length * hScale)],
      ];
      const startHeadHighlight = [
        [-centering[0] + start[0] - arrow90[0] * (p.width * hScale),
          -centering[1] + start[1] - arrow90[1] * (p.width * hScale)],
        [-centering[0] + start[0] + arrow90[0] * (p.width * hScale),
          -centering[1] + start[1] + arrow90[1] * (p.width * hScale)],
        [-centering[0] + start[0] - arrowVector[0] * (p.length * hScale),
          -centering[1] + start[1] - arrowVector[1] * (p.length * hScale)],
      ];
      const highline = line(start[0], start[1], end[0], end[1]);
      highline.setAttribute("style", highlightStroke);
      arrow.appendChild(highline);
      if (p.end) {
        const endArrowHighlight = polygon(endHeadHighlight);
        endArrowHighlight.setAttribute("style", highlightFill);
        arrow.appendChild(endArrowHighlight);
      }
      if (p.start) {
        const startArrowHighlight = polygon(startHeadHighlight);
        startArrowHighlight.setAttribute("style", highlightFill);
        arrow.appendChild(startArrowHighlight);
      }
    }
    return arrow;
  };
  const arcArrow = function (start, end, options) {
    const p = {
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
      fillStyle: "",
    };
    if (typeof options === "object" && options !== null) {
      Object.assign(p, options);
    }
    const arrowFill = [
      "stroke:none",
      `fill:${p.color}`,
      p.fillStyle,
    ].filter(a => a !== "").join(";");
    const arrowStroke = [
      "fill:none",
      `stroke:${p.color}`,
      `stroke-width:${p.strokeWidth}`,
      p.strokeStyle,
    ].filter(a => a !== "").join(";");
    let startPoint = start;
    let endPoint = end;
    let vector = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]];
    let midpoint = [startPoint[0] + vector[0] / 2, startPoint[1] + vector[1] / 2];
    let len = Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]);
    var minLength = (p.start ? (1+p.padding) : 0 + p.end ? (1+p.padding) : 0)
      * p.length * 2.5;
    if (len < minLength) {
      let minVec = [vector[0]/len * minLength, vector[1]/len * minLength];
      startPoint = [midpoint[0]-minVec[0]*0.5, midpoint[1]-minVec[1]*0.5];
      endPoint = [midpoint[0]+minVec[0]*0.5, midpoint[1]+minVec[1]*0.5];
      vector = [endPoint[0]-startPoint[0], endPoint[1]-startPoint[1]];
    }
    let perpendicular = [vector[1], -vector[0]];
    let bezPoint = [
      midpoint[0] + perpendicular[0]*(p.side?1:-1) * p.bend,
      midpoint[1] + perpendicular[1]*(p.side?1:-1) * p.bend
    ];
    let bezStart = [bezPoint[0] - startPoint[0], bezPoint[1] - startPoint[1]];
    let bezEnd = [bezPoint[0] - endPoint[0], bezPoint[1] - endPoint[1]];
    let bezStartLen = Math.sqrt(bezStart[0]*bezStart[0]+bezStart[1]*bezStart[1]);
    let bezEndLen = Math.sqrt(bezEnd[0]*bezEnd[0]+bezEnd[1]*bezEnd[1]);
    let bezStartNorm = [bezStart[0]/bezStartLen, bezStart[1]/bezStartLen];
    let bezEndNorm = [bezEnd[0]/bezEndLen, bezEnd[1]/bezEndLen];
    let startHeadVec = [-bezStartNorm[0], -bezStartNorm[1]];
    let endHeadVec = [-bezEndNorm[0], -bezEndNorm[1]];
    let startNormal = [startHeadVec[1], -startHeadVec[0]];
    let endNormal = [endHeadVec[1], -endHeadVec[0]];
    let arcStart = [
      startPoint[0] + bezStartNorm[0]*p.length*((p.start?1:0)+p.padding),
      startPoint[1] + bezStartNorm[1]*p.length*((p.start?1:0)+p.padding)
    ];
    let arcEnd = [
      endPoint[0] + bezEndNorm[0]*p.length*((p.end?1:0)+p.padding),
      endPoint[1] + bezEndNorm[1]*p.length*((p.end?1:0)+p.padding)
    ];
    vector = [arcEnd[0]-arcStart[0], arcEnd[1]-arcStart[1]];
    perpendicular = [vector[1], -vector[0]];
    midpoint = [arcStart[0] + vector[0]/2, arcStart[1] + vector[1]/2];
    bezPoint = [
      midpoint[0] + perpendicular[0]*(p.side?1:-1) * p.bend,
      midpoint[1] + perpendicular[1]*(p.side?1:-1) * p.bend
    ];
    let controlStart = [
      arcStart[0] + (bezPoint[0] - arcStart[0]) * p.pinch,
      arcStart[1] + (bezPoint[1] - arcStart[1]) * p.pinch
    ];
    let controlEnd = [
      arcEnd[0] + (bezPoint[0] - arcEnd[0]) * p.pinch,
      arcEnd[1] + (bezPoint[1] - arcEnd[1]) * p.pinch
    ];
    let startHeadPoints = [
      [arcStart[0]+startNormal[0]*-p.width, arcStart[1]+startNormal[1]*-p.width],
      [arcStart[0]+startNormal[0]*p.width, arcStart[1]+startNormal[1]*p.width],
      [arcStart[0]+startHeadVec[0]*p.length,arcStart[1]+startHeadVec[1]*p.length]
    ];
    let endHeadPoints = [
      [arcEnd[0]+endNormal[0]*-p.width, arcEnd[1]+endNormal[1]*-p.width],
      [arcEnd[0]+endNormal[0]*p.width, arcEnd[1]+endNormal[1]*p.width],
      [arcEnd[0]+endHeadVec[0]*p.length, arcEnd[1]+endHeadVec[1]*p.length]
    ];
    let arrowGroup = document$1.createElementNS(svgNS$1, "g");
    let arrowArc = bezier(
      arcStart[0], arcStart[1], controlStart[0], controlStart[1],
      controlEnd[0], controlEnd[1], arcEnd[0], arcEnd[1]
    );
    arrowArc.setAttribute("style", arrowStroke);
    arrowGroup.appendChild(arrowArc);
    if (p.start) {
      let startHead = polygon(startHeadPoints);
      startHead.setAttribute("style", arrowFill);
      arrowGroup.appendChild(startHead);
    }
    if (p.end) {
      let endHead = polygon(endHeadPoints);
      endHead.setAttribute("style", arrowFill);
      arrowGroup.appendChild(endHead);
    }
    return arrowGroup;
  };
  const svgNS$2 = "http://www.w3.org/2000/svg";
  const drawMethods = {
    line,
    circle,
    ellipse,
    rect,
    polygon,
    polyline,
    bezier,
    text,
    wedge,
    arc,
    straightArrow,
    arcArrow,
    regularPolygon,
  };
  const setupSVG = function (svgImage) {
    attachClassMethods(svgImage);
    attachViewBoxMethods(svgImage);
    attachAppendableMethods(svgImage, drawMethods);
  };
  const svg = function () {
    const svgImage = document$1.createElementNS(svgNS$2, "svg");
    svgImage.setAttribute("version", "1.1");
    svgImage.setAttribute("xmlns", svgNS$2);
    setupSVG(svgImage);
    return svgImage;
  };
  const group = function () {
    const g = document$1.createElementNS(svgNS$2, "g");
    attachClassMethods(g);
    attachAppendableMethods(g, drawMethods);
    return g;
  };
  const style = function () {
    const s = document$1.createElementNS(svgNS$2, "style");
    s.setAttribute("type", "text/css");
    return s;
  };
  drawMethods.group = group;
  const Names = {
    begin: "onMouseDown",
    enter: "onMouseEnter",
    leave: "onMouseLeave",
    move: "onMouseMove",
    end: "onMouseUp",
    scroll: "onScroll",
  };
  const Pointer = function (node) {
    let _node = node;
    let _pointer = Object.create(null);
    Object.assign(_pointer, {
      isPressed: false,
      position: [0,0],
      pressed: [0,0],
      drag: [0,0],
      prev: [0,0],
      x: 0,
      y: 0
    });
    const getPointer = function () {
      let m = _pointer.position.slice();
      Object.keys(_pointer)
        .filter(key => typeof key === "object")
        .forEach(key => m[key] = _pointer[key].slice());
      Object.keys(_pointer)
        .filter(key => typeof key !== "object")
        .forEach(key => m[key] = _pointer[key]);
      return Object.freeze(m);
    };
    const setPosition = function (clientX, clientY) {
      _pointer.position = convertToViewBox(_node, clientX, clientY);
      _pointer.x = _pointer.position[0];
      _pointer.y = _pointer.position[1];
    };
    const didRelease = function (clientX, clientY) {
      _pointer.isPressed = false;
    };
    const didPress = function (clientX, clientY) {
      _pointer.isPressed = true;
      _pointer.pressed = convertToViewBox(_node, clientX, clientY);
      setPosition(clientX, clientY);
    };
    const didMove = function (clientX, clientY) {
      _pointer.prev = _pointer.position;
      setPosition(clientX, clientY);
      if (_pointer.isPressed) {
        updateDrag();
      }
    };
    const updateDrag = function () {
      _pointer.drag = [_pointer.position[0] - _pointer.pressed[0],
                     _pointer.position[1] - _pointer.pressed[1]];
      _pointer.drag.x = _pointer.drag[0];
      _pointer.drag.y = _pointer.drag[1];
    };
    let _this = {};
    Object.defineProperty(_this, "getPointer", {value: getPointer});
    Object.defineProperty(_this, "didMove", {value: didMove});
    Object.defineProperty(_this, "didPress", {value: didPress});
    Object.defineProperty(_this, "didRelease", {value: didRelease});
    Object.defineProperty(_this, "node", {set: function (n){ _node = n; }});
    return _this;
  };
  function Events (node) {
    let _node;
    let _pointer = Pointer(node);
    let _events = {};
    const fireEvents = function (event, events) {
      if (events == null) { return; }
      if (events.length > 0) {
        event.preventDefault();
      }
      let mouse = _pointer.getPointer();
      events.forEach(f => f(mouse));
    };
    const mouseMoveHandler = function (event) {
      let events = _events[Names.move];
      _pointer.didMove(event.clientX, event.clientY);
      fireEvents(event, events);
    };
    const mouseDownHandler = function (event) {
      let events = _events[Names.begin];
      _pointer.didPress(event.clientX, event.clientY);
      fireEvents(event, events);
    };
    const mouseUpHandler = function (event) {
      mouseMoveHandler(event);
      let events = _events[Names.end];
      _pointer.didRelease(event.clientX, event.clientY);
      fireEvents(event, events);
    };
    const mouseLeaveHandler = function (event) {
      let events = _events[Names.leave];
      _pointer.didMove(event.clientX, event.clientY);
      fireEvents(event, events);
    };
    const mouseEnterHandler = function (event) {
      let events = _events[Names.enter];
      _pointer.didMove(event.clientX, event.clientY);
      fireEvents(event, events);
    };
    const touchStartHandler = function (event) {
      let events = _events[Names.begin];
      let touch = event.touches[0];
      if (touch == null) { return; }
      _pointer.didPress(touch.clientX, touch.clientY);
      fireEvents(event, events);
    };
    const touchEndHandler = function (event) {
      let events = _events[Names.end];
      _pointer.didRelease();
      fireEvents(event, events);
    };
    const touchMoveHandler = function (event) {
      let events = _events[Names.move];
      let touch = event.touches[0];
      if (touch == null) { return; }
      _pointer.didMove(touch.clientX, touch.clientY);
      fireEvents(event, events);
    };
    const scrollHandler = function (event) {
      let events = _events[Names.scroll];
      let e = {
        deltaX: event.deltaX,
        deltaY: event.deltaY,
        deltaZ: event.deltaZ,
      };
      e.position = convertToViewBox(_node, event.clientX, event.clientY);
      e.x = e.position[0];
      e.y = e.position[1];
      if (events == null) { return; }
      if (events.length > 0) {
        event.preventDefault();
      }
      events.forEach(f => f(e));
    };
    let _animate, _intervalID, _animationFrame;
    const updateAnimationHandler = function (handler) {
      if (_animate != null) {
        clearInterval(_intervalID);
      }
      _animate = handler;
      if (_animate != null) {
        _animationFrame = 0;
        _intervalID = setInterval(() => {
          let animObj = {
            "time": _node.getCurrentTime(),
            "frame": _animationFrame++
          };
          _animate(animObj);
        }, 1000/60);
      }
    };
    const handlers = {
      mouseup: mouseUpHandler,
      mousedown: mouseDownHandler,
      mousemove: mouseMoveHandler,
      mouseleave: mouseLeaveHandler,
      mouseenter: mouseEnterHandler,
      touchend: touchEndHandler,
      touchmove: touchMoveHandler,
      touchstart: touchStartHandler,
      touchcancel: touchEndHandler,
      wheel: scrollHandler,
    };
    const addEventListener = function (eventName, func) {
      if (typeof func !== "function") {
        throw "must supply a function type to addEventListener";
      }
      if (_events[eventName] === undefined) {
        _events[eventName] = [];
      }
      _events[eventName].push(func);
    };
    const attachHandlers = function (element) {
      Object.keys(handlers).forEach(key =>
        element.addEventListener(key, handlers[key], false)
      );
      updateAnimationHandler(_animate);
    };
    const removeHandlers = function (element) {
      Object.keys(handlers).forEach(key =>
        element.removeEventListener(key, handlers[key], false)
      );
      if (_animate != null) {
        clearInterval(_intervalID);
      }
    };
    const setup = function (node) {
      if (_node != null) {
        removeHandlers(_node);
      }
      _node = node;
      _pointer.node = _node;
      Object.keys(Names).map(key => Names[key]).forEach(key => {
        Object.defineProperty(_node, key, {
          set: function (handler) { addEventListener(key, handler); }
        });
      });
      Object.defineProperty(_node, "animate", {
        set: function (handler) { updateAnimationHandler(handler); }
      });
      Object.defineProperty(_node, "mouse", {get: function (){ return _pointer.getPointer(); }});
      Object.defineProperty(_node, "pointer", {get: function (){ return _pointer.getPointer(); }});
      attachHandlers(_node);
    };
    setup(node);
    return {
      setup,
      addEventListener,
      remove: function () { removeHandlers(_node); }
    };
  }
  function image () {
    let _svg = svg();
    let params = Array.from(arguments);
    initSize(_svg, params);
    attachSVGMethods(_svg);
    _svg.events = Events(_svg);
    const setup = function () {
      initSize(_svg, params);
      getElement(params).appendChild(_svg);
      params.filter((arg) => typeof arg === "function")
        .forEach((func) => func());
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setup);
    } else {
      setup();
    }
    return _svg;
  }const getElement = function (params) {
    let element = params.filter((arg) =>
        arg instanceof HTMLElement
      ).shift();
    let idElement = params.filter((a) =>
        typeof a === "string" || a instanceof String)
      .map(str => document.getElementById(str))
      .shift();
    return (element != null
      ? element
      : (idElement != null
        ? idElement
        : document.body));
  };
  const initSize = function (svg$$1, params) {
    let numbers = params.filter((arg) => !isNaN(arg));
    if (numbers.length >= 2) {
      svg$$1.setAttributeNS(null, "width", numbers[0]);
      svg$$1.setAttributeNS(null, "height", numbers[1]);
      setViewBox(svg$$1, 0, 0, numbers[0], numbers[1]);
    }
    else if (svg$$1.getAttribute("viewBox") == null) {
      let rect = svg$$1.getBoundingClientRect();
      setViewBox(svg$$1, 0, 0, rect.width, rect.height);
    }
  };
  const attachSVGMethods = function (element) {
    Object.defineProperty(element, "w", {
      get: function (){ return getWidth(element); },
      set: function (w){ element.setAttributeNS(null, "width", w); }
    });
    Object.defineProperty(element, "h", {
      get: function (){ return getHeight(element); },
      set: function (h){ element.setAttributeNS(null, "height", h); }
    });
    element.getWidth = function () { return getWidth(element); };
    element.getHeight = function () { return getHeight(element); };
    element.setWidth = function (w) { element.setAttributeNS(null, "width", w); };
    element.setHeight = function (h) { element.setAttributeNS(null, "height", h); };
    element.save = function (filename = "image.svg") {
      return save(element, filename);
    };
    element.load = function (data, callback) {
      load(data, function (newSVG, error) {
        let parent = element.parentNode;
        if (newSVG != null) {
          newSVG.events = element.events;
          setupSVG(newSVG);
          if (newSVG.events == null) { newSVG.events = Events(newSVG); }
          else { newSVG.events.setup(newSVG); }
          attachSVGMethods(newSVG);
          if (parent != null) { parent.insertBefore(newSVG, element); }
          element.remove();
          element = newSVG;
        }
        if (callback != null) { callback(element, error); }
      });
    };
  };
  const controlPoint = function (parent, options) {
    if (options == null) { options = {}; }
    if (options.radius == null) { options.radius = 1; }
    if (options.fill == null) { options.fill = "#000"; }
    if (options.stroke == null) { options.stroke = "none"; }
    const c = circle(0, 0, options.radius);
    c.setAttribute("style", `fill:${options.fill};stroke:${options.stroke};`);
    const position = [0, 0];
    let selected = false;
    if (parent != null) {
      parent.appendChild(c);
    }
    const setPosition = function (x, y) {
      position[0] = x;
      position[1] = y;
      c.setAttribute("cx", x);
      c.setAttribute("cy", y);
    };
    if ("position" in options) {
      const pos = options.position;
      if (pos[0] != null) {
        setPosition(...pos);
      } else if (pos.x != null) {
        setPosition(pos.x, pos.y);
      }
    }
    let updatePosition = function (input) { return input; };
    const onMouseMove = function (mouse) {
      if (selected) {
        const pos = updatePosition(mouse);
        setPosition(pos[0], pos[1]);
      }
    };
    const onMouseUp = function () {
      selected = false;
    };
    const distance = function (mouse) {
      return Math.sqrt(((mouse[0] - position[0]) ** 2)
        + ((mouse[1] - position[1]) ** 2));
    };
    const remove = function () {
      parent.removeChild(c);
    };
    return {
      circle: c,
      set position(pos) {
        if (pos[0] != null) {
          setPosition(pos[0], pos[1]);
        } else if (pos.x != null) {
          setPosition(pos.x, pos.y);
        }
      },
      get position() { return [...position]; },
      onMouseUp,
      onMouseMove,
      distance,
      remove,
      set positionDidUpdate(method) { updatePosition = method; },
      set selected(value) { selected = true; },
    };
  };
  function controls (parent, number, options) {
    if (options == null) { options = {}; }
    if (options.parent == null) { options.parent = parent; }
    if (options.radius == null) { options.radius = 1; }
    if (options.fill == null) { options.fill = "#000000"; }
    const points = Array.from(Array(number))
      .map(() => controlPoint(options.parent, options));
    let selected;
    const mouseDownHandler = function (event) {
      event.preventDefault();
      const mouse = convertToViewBox(parent, event.clientX, event.clientY);
      if (!(points.length > 0)) { return; }
      selected = points
        .map((p, i) => ({ i, d: p.distance(mouse) }))
        .sort((a, b) => a.d - b.d)
        .shift()
        .i;
      points[selected].selected = true;
    };
    const mouseMoveHandler = function (event) {
      event.preventDefault();
      const mouse = convertToViewBox(parent, event.clientX, event.clientY);
      points.forEach(p => p.onMouseMove(mouse));
    };
    const mouseUpHandler = function (event) {
      event.preventDefault();
      points.forEach(p => p.onMouseUp());
      selected = undefined;
    };
    const touchDownHandler = function (event) {
      event.preventDefault();
      const touch = event.touches[0];
      if (touch == null) { return; }
      const pointer = convertToViewBox(parent, touch.clientX, touch.clientY);
      if (!(points.length > 0)) { return; }
      selected = points
        .map((p, i) => ({ i, d: p.distance(pointer) }))
        .sort((a, b) => a.d - b.d)
        .shift()
        .i;
      points[selected].selected = true;
    };
    const touchMoveHandler = function (event) {
      event.preventDefault();
      const touch = event.touches[0];
      if (touch == null) { return; }
      const pointer = convertToViewBox(parent, touch.clientX, touch.clientY);
      points.forEach(p => p.onMouseMove(pointer));
    };
    const touchUpHandler = function (event) {
      event.preventDefault();
      points.forEach(p => p.onMouseUp());
      selected = undefined;
    };
    parent.addEventListener("touchstart", touchDownHandler, false);
    parent.addEventListener("touchend", touchUpHandler, false);
    parent.addEventListener("touchcancel", touchUpHandler, false);
    parent.addEventListener("touchmove", touchMoveHandler, false);
    parent.addEventListener("mousedown", mouseDownHandler, false);
    parent.addEventListener("mouseup", mouseUpHandler, false);
    parent.addEventListener("mousemove", mouseMoveHandler, false);
    Object.defineProperty(points, "selectedIndex", {
      get: () => selected,
    });
    Object.defineProperty(points, "selected", {
      get: () => points[selected],
    });
    Object.defineProperty(points, "removeAll", {
      value: () => {
        points.forEach(tp => tp.remove());
        points.splice(0, points.length);
        selected = undefined;
      },
    });
    Object.defineProperty(points, "add", {
      value: (opt) => {
        points.push(controlPoint(parent, opt));
      },
    });
    return points;
  }

  var svg$1 = /*#__PURE__*/Object.freeze({
    svg: svg,
    group: group,
    style: style,
    line: line,
    circle: circle,
    ellipse: ellipse,
    rect: rect,
    polygon: polygon,
    polyline: polyline,
    bezier: bezier,
    text: text,
    wedge: wedge,
    arc: arc,
    setPoints: setPoints,
    setArc: setArc,
    regularPolygon: regularPolygon,
    straightArrow: straightArrow,
    arcArrow: arcArrow,
    setViewBox: setViewBox,
    getViewBox: getViewBox,
    scaleViewBox: scaleViewBox,
    translateViewBox: translateViewBox,
    convertToViewBox: convertToViewBox,
    removeChildren: removeChildren,
    save: save,
    load: load,
    image: image,
    controls: controls
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

  var filter$1 = {};
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
  filter$1.edgesAssigned = function(fold, target) {
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
  filter$1.mountainEdges = function(fold) {
    return filter$1.edgesAssigned(fold, 'M');
  };
  filter$1.valleyEdges = function(fold) {
    return filter$1.edgesAssigned(fold, 'V');
  };
  filter$1.flatEdges = function(fold) {
    return filter$1.edgesAssigned(fold, 'F');
  };
  filter$1.boundaryEdges = function(fold) {
    return filter$1.edgesAssigned(fold, 'B');
  };
  filter$1.unassignedEdges = function(fold) {
    return filter$1.edgesAssigned(fold, 'U');
  };
  filter$1.keysStartingWith = function(fold, prefix) {
    var key, results;
    results = [];
    for (key in fold) {
      if (key.slice(0, prefix.length) === prefix) {
        results.push(key);
      }
    }
    return results;
  };
  filter$1.keysEndingWith = function(fold, suffix) {
    var key, results;
    results = [];
    for (key in fold) {
      if (key.slice(-suffix.length) === suffix) {
        results.push(key);
      }
    }
    return results;
  };
  filter$1.remapField = function(fold, field, old2new) {
    var array, i, j, k, key, l, len, len1, len2, m, new2old, old, ref, ref1;
    new2old = [];
    for (i = k = 0, len = old2new.length; k < len; i = ++k) {
      j = old2new[i];
      if (j != null) {
        new2old[j] = i;
      }
    }
    ref = filter$1.keysStartingWith(fold, field + "_");
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
    ref1 = filter$1.keysEndingWith(fold, "_" + field);
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
  filter$1.remapFieldSubset = function(fold, field, keep) {
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
    filter$1.remapField(fold, field, old2new);
    return old2new;
  };
  filter$1.numType = function(fold, type) {
    var counts, key, value;
    counts = (function() {
      var k, len, ref, results;
      ref = filter$1.keysStartingWith(fold, type + "_");
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
        ref = filter$1.keysEndingWith(fold, "_" + type);
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
  filter$1.numVertices = function(fold) {
    return filter$1.numType(fold, 'vertices');
  };
  filter$1.numEdges = function(fold) {
    return filter$1.numType(fold, 'edges');
  };
  filter$1.numFaces = function(fold) {
    return filter$1.numType(fold, 'faces');
  };
  filter$1.removeDuplicateEdges_vertices = function(fold) {
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
    filter$1.remapField(fold, 'edges', old2new);
    return old2new;
  };
  filter$1.edges_verticesIncident = function(e1, e2) {
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
  filter$1.collapseNearbyVertices = function(fold, epsilon) {
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
    return filter$1.remapField(fold, 'vertices', old2new);
  };
  filter$1.maybeAddVertex = function(fold, coords, epsilon) {
    var i;
    i = geom.closestIndex(coords, fold.vertices_coords);
    if ((i != null) && epsilon >= geom.dist(coords, fold.vertices_coords[i])) {
      return i;
    } else {
      return fold.vertices_coords.push(coords) - 1;
    }
  };
  filter$1.addVertexLike = function(fold, oldVertexIndex) {
    var k, key, len, ref, vNew;
    vNew = filter$1.numVertices(fold);
    ref = filter$1.keysStartingWith(fold, 'vertices_');
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
  filter$1.addEdgeLike = function(fold, oldEdgeIndex, v1, v2) {
    var eNew, k, key, len, ref;
    eNew = fold.edges_vertices.length;
    ref = filter$1.keysStartingWith(fold, 'edges_');
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
  filter$1.addVertexAndSubdivide = function(fold, coords, epsilon) {
    var changedEdges, e, i, iNew, k, len, ref, s, u, v;
    v = filter$1.maybeAddVertex(fold, coords, epsilon);
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
          iNew = filter$1.addEdgeLike(fold, i, v, e[1]);
          changedEdges.push(i, iNew);
          e[1] = v;
        }
      }
    }
    return [v, changedEdges];
  };
  filter$1.removeLoopEdges = function(fold) {
    var edge;
    return filter$1.remapFieldSubset(fold, 'edges', (function() {
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
  filter$1.subdivideCrossingEdges_vertices = function(fold, epsilon, involvingEdgesFrom) {
    var addEdge, changedEdges, cross, crossI, e, e1, e2, i, i1, i2, k, l, len, len1, len2, len3, m, n, old2new, p, ref, ref1, ref2, ref3, s, s1, s2, u, v, vertices;
    changedEdges = [[], []];
    addEdge = function(v1, v2, oldEdgeIndex, which) {
      var eNew;
      eNew = filter$1.addEdgeLike(fold, oldEdgeIndex, v1, v2);
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
        if (!filter$1.edges_verticesIncident(e1, e2) && geom.segmentsCross(s1, s2)) {
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
    old2new = filter$1.removeDuplicateEdges_vertices(fold);
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
    old2new = filter$1.removeLoopEdges(fold);
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
  filter$1.addEdgeAndSubdivide = function(fold, v1, v2, epsilon) {
    var changedEdges, changedEdges1, changedEdges2, e, i, iNew, k, len, ref, ref1, ref2, ref3, ref4;
    if (v1.length != null) {
      ref = filter$1.addVertexAndSubdivide(fold, v1, epsilon), v1 = ref[0], changedEdges1 = ref[1];
    }
    if (v2.length != null) {
      ref1 = filter$1.addVertexAndSubdivide(fold, v2, epsilon), v2 = ref1[0], changedEdges2 = ref1[1];
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
      changedEdges = filter$1.subdivideCrossingEdges_vertices(fold, epsilon, iNew);
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
  filter$1.cutEdges = function(fold, es) {
    var b1, b2, boundaries, e, e1, e2, ev, i, i1, i2, ie, ie1, ie2, k, l, len, len1, len2, len3, len4, len5, len6, len7, m, n, neighbor, neighbors, o, q, r, ref, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, t, u1, u2, v, v1, v2, ve, vertices_boundaries;
    vertices_boundaries = [];
    ref = filter$1.boundaryEdges(fold);
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
      e2 = filter$1.addEdgeLike(fold, e1);
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
          v2 = filter$1.addVertexLike(fold, v1);
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
  filter$1.edges_vertices_to_vertices_vertices = function(fold) {
    var edge, k, len, numVertices, ref, v, vertices_vertices, w;
    numVertices = filter$1.numVertices(fold);
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

  var convert$1 = {},
    modulo$1 = function(a, b) { return (+a % (b = +b) + b) % b; },
    hasProp = {}.hasOwnProperty;
  convert$1.edges_vertices_to_vertices_vertices_unsorted = function(fold) {
    fold.vertices_vertices = filter$1.edges_vertices_to_vertices_vertices(fold);
    return fold;
  };
  convert$1.edges_vertices_to_vertices_vertices_sorted = function(fold) {
    convert$1.edges_vertices_to_vertices_vertices_unsorted(fold);
    return convert$1.sort_vertices_vertices(fold);
  };
  convert$1.edges_vertices_to_vertices_edges_sorted = function(fold) {
    convert$1.edges_vertices_to_vertices_vertices_sorted(fold);
    return convert$1.vertices_vertices_to_vertices_edges(fold);
  };
  convert$1.sort_vertices_vertices = function(fold) {
    var neighbors, ref, ref1, ref2, v;
    if (((ref = fold.vertices_coords) != null ? (ref1 = ref[0]) != null ? ref1.length : void 0 : void 0) !== 2) {
      throw new Error("sort_vertices_vertices: Vertex coordinates missing or not two dimensional");
    }
    if (fold.vertices_vertices == null) {
      convert$1.edges_vertices_to_vertices_vertices(fold);
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
  convert$1.vertices_vertices_to_faces_vertices = function(fold) {
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
  convert$1.vertices_edges_to_faces_vertices_edges = function(fold) {
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
        vertices = [filter$1.edges_verticesIncident(fold.edges_vertices[e1], fold.edges_vertices[e2])];
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
  convert$1.edges_vertices_to_faces_vertices = function(fold) {
    convert$1.edges_vertices_to_vertices_vertices_sorted(fold);
    return convert$1.vertices_vertices_to_faces_vertices(fold);
  };
  convert$1.edges_vertices_to_faces_vertices_edges = function(fold) {
    convert$1.edges_vertices_to_vertices_edges_sorted(fold);
    return convert$1.vertices_edges_to_faces_vertices_edges(fold);
  };
  convert$1.vertices_vertices_to_vertices_edges = function(fold) {
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
  convert$1.faces_vertices_to_faces_edges = function(fold) {
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
  convert$1.faces_vertices_to_edges = function(mesh) {
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
  convert$1.deepCopy = function(fold) {
    var copy, item, j, key, len, ref, results, value;
    if ((ref = typeof fold) === 'number' || ref === 'string' || ref === 'boolean') {
      return fold;
    } else if (Array.isArray(fold)) {
      results = [];
      for (j = 0, len = fold.length; j < len; j++) {
        item = fold[j];
        results.push(convert$1.deepCopy(item));
      }
      return results;
    } else {
      copy = {};
      for (key in fold) {
        if (!hasProp.call(fold, key)) continue;
        value = fold[key];
        copy[key] = convert$1.deepCopy(value);
      }
      return copy;
    }
  };
  convert$1.toJSON = function(fold) {
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
  convert$1.extensions = {};
  convert$1.converters = {};
  convert$1.getConverter = function(fromExt, toExt) {
    if (fromExt === toExt) {
      return function(x) {
        return x;
      };
    } else {
      return convert$1.converters["" + fromExt + toExt];
    }
  };
  convert$1.setConverter = function(fromExt, toExt, converter) {
    convert$1.extensions[fromExt] = true;
    convert$1.extensions[toExt] = true;
    return convert$1.converters["" + fromExt + toExt] = converter;
  };
  convert$1.convertFromTo = function(data, fromExt, toExt) {
    var converter;
    if (fromExt[0] !== '.') {
      fromExt = "." + fromExt;
    }
    if (toExt[0] !== '.') {
      toExt = "." + toExt;
    }
    converter = convert$1.getConverter(fromExt, toExt);
    if (converter == null) {
      if (fromExt === toExt) {
        return data;
      }
      throw new Error("No converter from " + fromExt + " to " + toExt);
    }
    return converter(data);
  };
  convert$1.convertFrom = function(data, fromExt) {
    return convert$1.convertFromTo(data, fromExt, '.fold');
  };
  convert$1.convertTo = function(data, toExt) {
    return convert$1.convertFromTo(data, '.fold', toExt);
  };

  const keys_types = {
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
    ]
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
    .concat(keys_types.file)
    .concat(keys_types.frame)
    .concat(keys_types.graph)
    .concat(keys_types.orders));
  const edges_assignment_names = {
    en: {
      B: "boundary", b: "boundary",
      M: "mountain", m: "mountain",
      V: "valley",   v: "valley",
      F: "mark",     f: "mark",
      U: "mark",     u: "mark"
    }
  };
  const edges_assignment_values = [
    "B", "b", "M", "m", "V", "v", "F", "f", "U", "u"
  ];
  const assignment_angles = {
    M: -180,
    m: -180,
    V: 180,
    v: 180
  };
  const edge_assignment_to_foldAngle = function (assignment) {
    return assignment_angles[assignment] || 0;
  };
  const get_keys_matching_prefix = function (graph, key) {
    const prefix = `${key}_`;
    return Object.keys(graph)
      .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
      .filter(str => str !== undefined);
  };
  const get_keys_matching_suffix = function (graph, key) {
    const suffix = `_${key}`;
    return Object.keys(graph)
      .map(s => (s.substring(s.length - suffix.length, s.length) === suffix
        ? s : undefined))
      .filter(str => str !== undefined);
  };
  const invert_geometry_arrays = function (graph, geometry_key) {
    const matching_keys = get_keys_matching_prefix(graph, geometry_key);
    if (matching_keys.length === 0) { return []; }
    const geometry = Array.from(Array(graph[matching_keys[0]].length))
      .map(() => ({}));
    matching_keys
      .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
      .forEach(key => geometry
        .forEach((o, i) => { geometry[i][key.short] = graph[key.long][i]; }));
    return geometry;
  };

  var spec = /*#__PURE__*/Object.freeze({
    keys_types: keys_types,
    file_classes: file_classes,
    frame_classes: frame_classes,
    frame_attributes: frame_attributes,
    keys: keys,
    edges_assignment_names: edges_assignment_names,
    edges_assignment_values: edges_assignment_values,
    edge_assignment_to_foldAngle: edge_assignment_to_foldAngle,
    get_keys_matching_prefix: get_keys_matching_prefix,
    get_keys_matching_suffix: get_keys_matching_suffix,
    invert_geometry_arrays: invert_geometry_arrays
  });

  const makeUUID = function () {
    const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array.from(Array(24))
      .map(() => Math.floor(Math.random() * digits.length))
      .map(i => digits[i])
      .join("");
  };
  const component = function (proto) {
    if (proto == null) {
      return undefined;
    }
    const _this = Object.create(proto);
    _this.uuid = makeUUID();
    const disable = function () {
    };
    Object.defineProperty(_this, "disable", { value: disable });
    return _this;
  };
  const vertexPrototype = function (graph, index) {
    const point = math$1.vector(graph.vertices_coords[index]);
    const _this = Object.create(point);
    return _this;
  };
  const facePrototype = function (graph, index) {
    const points = graph.faces_vertices[index]
      .map(fv => graph.vertices_coords[fv]);
    const face = math$1.polygon(points);
    const _this = Object.create(face);
    return _this;
  };
  const edgePrototype = function (graph, index) {
    const points = graph.edges_vertices[index]
      .map(ev => graph.vertices_coords[ev]);
    const edge = math$1.edge(points);
    const _this = Object.create(edge);
    const is_assignment = function (options) {
      return options.map(l => l === this.graph.edges_assignment[index])
        .reduce((a, b) => a || b, false);
    };
    const is_mountain = function () {
      return is_assignment.call(this, ["M", "m"]);
    };
    const is_valley = function () {
      return is_assignment.call(this, ["V", "v"]);
    };
    const is_boundary = function () {
      return is_assignment.call(this, ["B", "b"]);
    };
    const mountain = function () {
      this.graph.edges_assignment[index] = "M";
      this.graph.edges_foldAngle[index] = -180;
      this.graph.onchange.forEach(f => f());
    };
    const valley = function () {
      this.graph.edges_assignment[index] = "V";
      this.graph.edges_foldAngle[index] = 180;
      this.graph.onchange.forEach(f => f());
    };
    const mark = function () {
      this.graph.edges_assignment[index] = "F";
      this.graph.edges_foldAngle[index] = 0;
      this.graph.onchange.forEach(f => f());
    };
    const flip = function () {
      if (is_mountain.call(this)) { valley.call(this); }
      else if (is_valley.call(this)) { mountain.call(this); }
      else { return; }
      this.graph.onchange.forEach(f => f());
    };
    const addVertexOnEdge = function (x, y) {
      const thisEdge = this.index;
      this.graph.addVertexOnEdge(x, y, thisEdge);
    };
    Object.defineProperty(_this, "mountain", { configurable: true, value: mountain });
    Object.defineProperty(_this, "valley", { configurable: true, value: valley });
    Object.defineProperty(_this, "mark", { configurable: true, value: mark });
    Object.defineProperty(_this, "flip", { configurable: true, value: flip });
    Object.defineProperty(_this, "isBoundary", {
      configurable: true,
      get: function () { return is_boundary.call(this); }
    });
    Object.defineProperty(_this, "isMountain", {
      configurable: true,
      get: function () { return is_mountain.call(this); }
    });
    Object.defineProperty(_this, "isValley", {
      configurable: true,
      get: function () { return is_valley.call(this); }
    });
    Object.defineProperty(_this, "addVertexOnEdge", {
      configurable: true, value: addVertexOnEdge
    });
    return _this;
  };
  component.vertex = function (graph, index) {
    const proto = vertexPrototype.bind(this);
    let v = component(proto(graph, index));
    Object.defineProperty(v, "robby", { configurable: true, value: "hi" });
    return v;
  };
  component.edge = function (graph, index) {
    const proto = edgePrototype.bind(this);
    return component(proto(graph, index));
  };
  component.face = function (graph, index) {
    const proto = facePrototype.bind(this);
    return component(proto(graph, index));
  };
  component.crease = function (graph, index) {
    const proto = creasePrototype.bind(this);
    return component(proto(graph, index));
  };
  const creasePrototype = function (graph, indices) {
    const _this = Object.create(component({}));
    const is_assignment = function (options) {
      return indices
        .map(index => options
          .map(l => l === graph.edges_assignment[index])
          .reduce((a, b) => a || b, false))
        .reduce((a, b) => a || b, false);
    };
    const is_mountain = function () { return is_assignment(["M", "m"]); };
    const is_valley = function () { return is_assignment(["V", "v"]); };
    const flip = function () {
      if (is_mountain()) { valley(); }
      else if (is_valley()) { mountain(); }
      else { return; }
      graph.onchange.forEach(f => f());
    };
    const mountain = function () {
      indices.forEach((index) => { graph.edges_assignment[index] = "M"; });
      indices.forEach((index) => { graph.edges_foldAngle[index] = -180; });
      graph.onchange.forEach(f => f());
    };
    const valley = function () {
      indices.forEach((index) => { graph.edges_assignment[index] = "V"; });
      indices.forEach((index) => { graph.edges_foldAngle[index] = 180; });
      graph.onchange.forEach(f => f());
    };
    const mark = function () {
      indices.forEach((index) => { graph.edges_assignment[index] = "F"; });
      indices.forEach((index) => { graph.edges_foldAngle[index] = 0; });
      graph.onchange.forEach(f => f());
    };
    const remove = function () { };
    Object.defineProperty(_this, "mountain", {
      configurable: true, value: mountain
    });
    Object.defineProperty(_this, "valley", {
      configurable: true, value: valley
    });
    Object.defineProperty(_this, "mark", {
      configurable: true, value: mark
    });
    Object.defineProperty(_this, "flip", {
      configurable: true, value: flip
    });
    Object.defineProperty(_this, "remove", {
      configurable: true, value: remove
    });
    Object.defineProperty(_this, "isMountain", {
      configurable: true,
      get: function () { return is_mountain.call(this); }
    });
    Object.defineProperty(_this, "isValley", {
      configurable: true,
      get: function () { return is_valley.call(this); }
    });
  };

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
    clone: clone,
    recursive_freeze: recursive_freeze
  });

  const append_frame = function (fold_file) {
  };
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
    append_frame: append_frame,
    flatten_frame: flatten_frame,
    merge_frame: merge_frame
  });

  const make_vertices_edges = function (graph) {
    const vertices_edges = graph.vertices_coords.map(() => []);
    graph.edges_vertices.forEach((ev, i) => ev
      .forEach(v => vertices_edges[v].push(i)));
    return vertices_edges;
  };
  const make_faces_faces = function (graph) {
    const nf = graph.faces_vertices.length;
    const faces_faces = Array.from(Array(nf)).map(() => []);
    const edgeMap = {};
    graph.faces_vertices.forEach((vertices_index, idx1) => {
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
  const make_edges_faces = function (graph) {
    const edges_faces = Array
      .from(Array(graph.edges_vertices.length))
      .map(() => []);
    graph.faces_edges.forEach((face, i) => face
      .forEach(edge => edges_faces[edge].push(i)));
    return edges_faces;
  };
  const make_edges_length = function (graph) {
    return graph.edges_vertices
      .map(ev => ev.map(v => graph.vertices_coords[v]))
      .map(edge => math$1.core.distance(...edge));
  };
  const make_vertex_pair_to_edge_map = function (graph) {
    const map = {};
    graph.edges_vertices
      .map(ev => ev.sort((a, b) => a - b).join(" "))
      .forEach((key, i) => { map[key] = i; });
    return map;
  };
  const make_vertices_faces = function (graph) {
    const vertices_faces = Array.from(Array(graph.vertices_coords.length))
      .map(() => []);
    graph.faces_vertices.forEach((face, i) => face
      .forEach(vertex => vertices_faces[vertex].push(i)));
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
          ? math$1.core.make_matrix2_reflection(vec, verts[0])
          : [1, 0, 0, 1, 0, 0];
        faces_matrix[entry.face] = math$1.core
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
          ? math$1.core.make_matrix2_reflection(vec, verts[0])
          : [1, 0, 0, 1, 0, 0];
        faces_matrix[entry.face] = math$1.core
          .multiply_matrices2(local, faces_matrix[entry.parent]);
      });
    });
    return faces_matrix;
  };
  const make_vertices_coords_folded = function (graph, face_stationary, faces_matrix) {
    if (face_stationary == null) { face_stationary = 0; }
    if (faces_matrix == null) {
      faces_matrix = make_faces_matrix(graph, face_stationary);
    }
    const vertex_in_face = graph.vertices_coords.map((v, i) => {
      for (let f = 0; f < graph.faces_vertices.length; f += 1) {
        if (graph.faces_vertices[f].includes(i)) { return f; }
      }
      return undefined;
    });
    return graph.vertices_coords.map((point, i) => math$1.core
      .multiply_vector2_matrix2(point, faces_matrix[vertex_in_face[i]])
      .map(n => math$1.core.clean_number(n)));
  };
  const faces_coloring_from_faces_matrix = function (faces_matrix) {
    return faces_matrix
      .map(m => m[0] * m[3] - m[1] * m[2])
      .map(c => c >= 0);
  };

  var make$1 = /*#__PURE__*/Object.freeze({
    make_vertices_edges: make_vertices_edges,
    make_faces_faces: make_faces_faces,
    make_edges_faces: make_edges_faces,
    make_edges_length: make_edges_length,
    make_vertex_pair_to_edge_map: make_vertex_pair_to_edge_map,
    make_vertices_faces: make_vertices_faces,
    make_face_walk_tree: make_face_walk_tree,
    make_faces_matrix: make_faces_matrix,
    make_faces_matrix_inv: make_faces_matrix_inv,
    make_vertices_coords_folded: make_vertices_coords_folded,
    faces_coloring_from_faces_matrix: faces_coloring_from_faces_matrix
  });

  const max_array_length = function (...arrays) {
    return Math.max(...(arrays
      .filter(el => el !== undefined)
      .map(el => el.length)));
  };
  const vertices_count = function (graph) {
    return max_array_length([], graph.vertices_coords,
      graph.vertices_faces, graph.vertices_vertices);
  };
  const edges_count = function (graph) {
    return max_array_length([], graph.edges_vertices, graph.edges_faces);
  };
  const faces_count = function (graph) {
    return max_array_length([], graph.faces_vertices, graph.faces_edges);
  };
  const implied_vertices_count = function (graph) {
    let max = 0;
    [graph.faces_vertices, graph.edges_vertices]
      .filter(a => a !== undefined)
      .forEach(arr => arr
        .forEach(el => el
          .forEach((e) => {
            if (e > max) { max = e; }
          })));
    return max;
  };
  const implied_edges_count = function (graph) {
    let max = 0;
    [graph.faces_edges, graph.vertices_edges]
      .filter(a => a !== undefined)
      .forEach(arr => arr
        .forEach(el => el
          .forEach((e) => {
            if (e > max) { max = e; }
          })));
    if (graph.edgeOrders !== undefined) {
      graph.edgeOrders.forEach(eo => eo.forEach((e, i) => {
        if (i !== 2 && e > max) { max = e; }
      }));
    }
    return max;
  };
  const implied_faces_count = function (graph) {
    let max = 0;
    [graph.vertices_faces, graph.edges_faces]
      .filter(a => a !== undefined)
      .forEach(arr => arr
        .forEach(el => el
          .forEach((f) => {
            if (f > max) { max = f; }
          })));
    if (graph.facesOrders !== undefined) {
      graph.facesOrders.forEach(fo => fo.forEach((f, i) => {
        if (i !== 2 && f > max) { max = f; }
      }));
    }
    return max;
  };
  const nearest_vertex = function (graph, point) {
    if (graph.vertices_coords === undefined
      || graph.vertices_coords.length === 0) {
      return undefined;
    }
    const p = [...point];
    if (p[2] == null) { p[2] = 0; }
    return graph.vertices_coords
      .map(v => v
        .map((n, i) => (n - p[i]) ** 2)
        .reduce((a, b) => a + b, 0))
      .map((n, i) => ({ d: Math.sqrt(n), i }))
      .sort((a, b) => a.d - b.d)
      .shift()
      .i;
  };
  const nearest_edge = function (graph, point) {
    if (graph.vertices_coords == null || graph.vertices_coords.length === 0
      || graph.edges_vertices == null || graph.edges_vertices.length === 0) {
      return undefined;
    }
    const edge_limit = (dist) => {
      if (dist < -math$1.core.EPSILON) { return 0; }
      if (dist > 1 + math$1.core.EPSILON) { return 1; }
      return dist;
    };
    const nearest_points = graph.edges_vertices
      .map(e => e.map(ev => graph.vertices_coords[ev]))
      .map(e => [e[0], [e[1][0] - e[0][0], e[1][1] - e[0][1]]])
      .map(line => math$1.core.nearest_point_on_line(line[0], line[1], point, edge_limit))
      .map((p, i) => ({ p, i, d: math$1.core.distance2(point, p) }));
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
  const face_containing_point = function (graph, point) {
    if (graph.vertices_coords == null || graph.vertices_coords.length === 0
      || graph.faces_vertices == null || graph.faces_vertices.length === 0) {
      return undefined;
    }
    const face = graph.faces_vertices
      .map((fv, i) => ({ face: fv.map(v => graph.vertices_coords[v]), i }))
      .filter(f => math$1.core.point_in_poly(point, f.face))
      .shift();
    return (face == null ? undefined : face.i);
  };
  const folded_faces_containing_point = function (graph, point, faces_matrix) {
    const transformed_points = faces_matrix
      .map(m => math$1.core.multiply_vector2_matrix2(point, m));
    return graph.faces_vertices
      .map((fv, i) => ({ face: fv.map(v => graph.vertices_coords[v]), i }))
      .filter((f, i) => math$1.core.intersection
        .point_in_poly(transformed_points[i], f.face))
      .map(f => f.i);
  };
  const faces_containing_point = function (graph, point) {
    if (graph.vertices_coords == null || graph.vertices_coords.length === 0
      || graph.faces_vertices == null || graph.faces_vertices.length === 0) {
      return undefined;
    }
    return graph.faces_vertices
      .map((fv, i) => ({ face: fv.map(v => graph.vertices_coords[v]), i }))
      .filter(f => math$1.core.point_in_poly(point, f.face))
      .map(f => f.i);
  };
  const topmost_face$1 = function (graph, faces_options) {
    if (faces_options == null) {
      faces_options = Array.from(Array(faces_count(graph)))
        .map((_, i) => i);
    }
    if (faces_options.length === 0) { return undefined; }
    if (faces_options.length === 1) { return faces_options[0]; }
    const faces_in_order = graph["faces_re:layer"]
      .map((layer, i) => ({ layer, i }))
      .sort((a, b) => b.layer - a.layer)
      .map(el => el.i);
    for (let i = 0; i < faces_in_order.length; i += 1) {
      if (faces_options.includes(faces_in_order[i])) {
        return faces_in_order[i];
      }
    }
    return undefined;
  };
  const bounding_rect = function (graph) {
    if ("vertices_coords" in graph === false
      || graph.vertices_coords.length <= 0) {
      return [0, 0, 0, 0];
    }
    const dimension = graph.vertices_coords[0].length;
    const min = Array(dimension).fill(Infinity);
    const max = Array(dimension).fill(-Infinity);
    graph.vertices_coords.forEach(v => v.forEach((n, i) => {
      if (n < min[i]) { min[i] = n; }
      if (n > max[i]) { max[i] = n; }
    }));
    return (isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1])
      ? [0, 0, 0, 0]
      : [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
  };
  const get_boundary$1 = function (graph) {
    const edges_vertices_b = graph.edges_assignment
      .map(a => a === "B" || a === "b");
    const vertices_edges = make_vertices_edges(graph);
    const edge_walk = [];
    const vertex_walk = [];
    let edgeIndex = -1;
    for (let i = 0; i < edges_vertices_b.length; i += 1) {
      if (edges_vertices_b[i]) { edgeIndex = i; break; }
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
  const get_collinear_vertices = function (graph) {
    const vertices_edges = make_vertices_edges(graph);
    return Array.from(Array(vertices_count(graph)))
      .map((_, i) => i)
      .filter(() => vertices_edges.length === 2)
      .map((vert) => {
        const edges = vertices_edges[vert];
        const a = edges[0][0] === vert ? edges[0][1] : edges[0][0];
        const b = edges[1][0] === vert ? edges[1][1] : edges[1][0];
        const av = math$1.core.distance2(graph.vertices_coords[a],
          graph.vertices_coords[vert]);
        const bv = math$1.core.distance2(graph.vertices_coords[b],
          graph.vertices_coords[vert]);
        const ab = math$1.core.distance2(graph.vertices_coords[a],
          graph.vertices_coords[b]);
        return Math.abs(ab - av - bv) < math$1.core.EPSILON ? vert : undefined;
      })
      .filter(a => a !== undefined);
  };
  const get_isolated_vertices = function (graph) {
    const vertices_size = graph.vertices_coords.length;
    const isolated = Array(vertices_size).fill(true);
    let set_count = vertices_size;
    for (let i = 0; i < graph.edges_vertices.length && set_count > 0; i += 1) {
      for (let e = 0; e < graph.edges_vertices[i].length; e += 1) {
        const v = graph.edges_vertices[i][e];
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
  const get_duplicate_edges = function (graph) {
    const equivalent2 = function (a, b) {
      return (a[0] === b[0] && a[1] === b[1])
          || (a[0] === b[1] && a[1] === b[0]);
    };
    const edges_equivalent = Array.from(Array(edges_count(graph)))
      .map(() => []);
    for (let i = 0; i < graph.edges_vertices.length - 1; i += 1) {
      for (let j = i + 1; j < graph.edges_vertices.length; j += 1) {
        edges_equivalent[i][j] = equivalent2(
          graph.edges_vertices[i],
          graph.edges_vertices[j],
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
  const find_collinear_face_edges = function (edge, face_vertices,
    vertices_coords) {
    const face_edge_geometry = face_vertices
      .map(v => vertices_coords[v])
      .map((v, i, arr) => [v, arr[(i + 1) % arr.length]]);
    return edge.map((endPt) => {
      const i = face_edge_geometry
        .map((edgeVerts, edgeI) => ({ index: edgeI, edge: edgeVerts }))
        .filter(e => math$1.core.intersection
          .point_on_edge(e.edge[0], e.edge[1], endPt))
        .shift()
        .index;
      return [face_vertices[i], face_vertices[(i + 1) % face_vertices.length]]
        .sort((a, b) => a - b);
    });
  };

  var query$1 = /*#__PURE__*/Object.freeze({
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
    topmost_face: topmost_face$1,
    bounding_rect: bounding_rect,
    get_boundary: get_boundary$1,
    get_collinear_vertices: get_collinear_vertices,
    get_isolated_vertices: get_isolated_vertices,
    get_duplicate_edges: get_duplicate_edges,
    find_collinear_face_edges: find_collinear_face_edges
  });

  const get_geometry_length = {
    vertices: vertices_count,
    edges: edges_count,
    faces: faces_count,
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
  const remove_vertices = function (graph, vertices) {
    return remove_geometry_key_indices(graph, "vertices", vertices);
  };
  const remove_edges = function (graph, edges) {
    const index_map = remove_geometry_key_indices(graph, "edges", edges);
    if (graph.edgeOrders !== undefined && graph.edgeOrders.length > 0) {
      graph.edgeOrders.forEach((order, i) => order.forEach((n, j) => {
        graph.edgeOrders[i][j] += (j < 2 ? index_map[n] : 0);
      }));
    }
    return index_map;
  };
  const remove_faces = function (graph, faces) {
    const index_map = remove_geometry_key_indices(graph, "faces", faces);
    if (graph.faceOrders !== undefined && graph.faceOrders.length > 0) {
      graph.faceOrders.forEach((order, i) => order.forEach((n, j) => {
        graph.faceOrders[i][j] += (j < 2 ? index_map[n] : 0);
      }));
    }
    return index_map;
  };
  const remove_isolated_vertices = function (graph) {
    return remove_vertices(graph, get_isolated_vertices(graph));
  };
  const remove_non_boundary_edges = function (graph) {
    const remove_indices = graph.edges_assignment
      .map(a => !(a === "b" || a === "B"))
      .map((a, i) => (a ? i : undefined))
      .filter(a => a !== undefined);
    const edge_map = remove_edges(graph, remove_indices);
    const face = get_boundary$1(graph);
    graph.faces_edges = [face.edges];
    graph.faces_vertices = [face.vertices];
    remove_isolated_vertices(graph);
  };
  const remove_collinear_vertices = function (graph, vertices) {
    const new_edges = [];
    vertices.forEach((vert) => {
      const edges_indices = graph.edges_vertices
        .map((ev, i) => (ev[0] === vert || ev[1] === vert ? i : undefined))
        .filter(a => a !== undefined);
      const edges = edges_indices.map(i => graph.edges_vertices[i]);
      if (edges.length !== 2) { return; }
      const a = edges[0][0] === vert ? edges[0][1] : edges[0][0];
      const b = edges[1][0] === vert ? edges[1][1] : edges[1][0];
      const assignment = graph.edges_assignment[edges_indices[0]];
      const foldAngle = graph.edges_assignment[edges_indices[0]];
      remove_edges(graph, edges_indices);
      new_edges.push({ vertices: [a, b], assignment, foldAngle });
    });
    new_edges.forEach((el) => {
      graph.edges_vertices.push(el.vertices);
      graph.edges_assignment.push(el.assignment);
      graph.edges_foldAngle.push(el.foldAngle);
    });
    remove_vertices(graph, vertices);
  };
  const remove_duplicate_edges = function (graph) {
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
    const edges_remove_indices = edges_remove
      .map((rm, i) => (rm ? i : undefined))
      .filter(i => i !== undefined);
    remove_edges(graph, edges_remove_indices);
  };
  const reindex_subscript = function (
    graph, subscript, old_index, new_index,
  ) {
    Object.keys(graph)
      .filter(key => key.includes(`_${subscript}`))
      .forEach(key => graph[key]
        .forEach((array, outerI) => array
          .forEach((component, innerI) => {
            if (component === old_index) {
              graph[key][outerI][innerI] = new_index;
            }
          })));
    return graph;
  };
  const merge_vertices = function (graph, vertex, removed) {
  };

  var remove = /*#__PURE__*/Object.freeze({
    remove_vertices: remove_vertices,
    remove_edges: remove_edges,
    remove_faces: remove_faces,
    remove_isolated_vertices: remove_isolated_vertices,
    remove_non_boundary_edges: remove_non_boundary_edges,
    remove_collinear_vertices: remove_collinear_vertices,
    remove_duplicate_edges: remove_duplicate_edges,
    reindex_subscript: reindex_subscript,
    merge_vertices: merge_vertices
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
      new_edges[i].edges_length = math$1.core.distance2(...verts);
    });
    new_edges.forEach((edge, i) => Object.keys(edge)
      .filter(key => key !== "i")
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
        throw "something wrong with input graph's faces_edges construction";
      });
      if (edgeIndex === face.length - 1) {
        face.splice(edgeIndex, 1, edges[0]);
        face.unshift(edges[1]);
      } else {
        face.splice(edgeIndex, 1, ...edges);
      }
      return edges;
    });
    const edge_map = remove_edges(graph, [old_edge_index]);
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
      .map(v => (math$1.core.point_on_line(linePoint, lineVector, v)
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
      .map(edge => math$1.core.intersection.line_edge_exclusive(
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
      length: math$1.core.distance2(
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
    const faces_map = remove_faces(graph, [faceIndex]);
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
    const frame0ContainsMatrices = (graph.file_frames != null
      && graph.file_frames.length > 0
      && graph.file_frames[0]["faces_re:matrix"] != null
      && graph.file_frames[0]["faces_re:matrix"].length === faceCount);
    graph["faces_re:matrix"] = frame0ContainsMatrices
      ? clone(graph.file_frames[0]["faces_re:matrix"])
      : make_faces_matrix(graph, face_index);
    graph["faces_re:coloring"] = faces_coloring_from_faces_matrix(
      graph["faces_re:matrix"]
    );
    graph["faces_re:creases"] = graph["faces_re:matrix"]
      .map(mat => math$1.core.make_matrix2_inverse(mat))
      .map(mat => math$1.core.multiply_line_matrix2(point, vector, mat));
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
    if (graph["faces_re:to_move"] == null) {
      graph["faces_re:to_move"] = Array(facesCount).fill(false);
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
        : math$1.core.multiply_matrices2(
          graph["faces_re:matrix"][0],
          math$1.core.make_matrix2_reflection(
            graph["faces_re:creases"][0][1],
            graph["faces_re:creases"][0][0]
          )
        )
      );
    }
    const folded_faces_matrix = make_faces_matrix(folded, face_0_newIndex)
      .map(m => math$1.core.multiply_matrices2(face_0_preMatrix, m));
    folded["faces_re:coloring"] = faces_coloring_from_faces_matrix(
      folded_faces_matrix
    );
    const crease_0 = math$1.core.multiply_line_matrix2(
      graph["faces_re:creases"][0][0],
      graph["faces_re:creases"][0][1],
      face_0_preMatrix
    );
    const fold_direction = math$1.core
      .normalize([crease_0[1][1], -crease_0[1][0]]);
    const split_points = faces_split
      .map((el, i) => (el === undefined ? undefined : el.edge.map(p => math$1.core
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
    const folded_frame = {
      vertices_coords: make_vertices_coords_folded(
        folded,
        face_0_newIndex,
        folded_faces_matrix
      ),
      frame_classes: ["foldedForm"],
      frame_inherit: true,
      frame_parent: 0,
      "faces_re:matrix": folded_faces_matrix
    };
    folded.file_frames = [folded_frame];
    return folded;
  };

  var fold = /*#__PURE__*/Object.freeze({
    default: fold_through
  });

  const vertex_adjacent_vectors = function (graph, vertex) {
    const adjacent = graph.vertices_vertices[vertex];
    return adjacent.map(v => [
      graph.vertices_coords[v][0] - graph.vertices_coords[vertex][0],
      graph.vertices_coords[v][1] - graph.vertices_coords[vertex][1]
    ]);
  };
  function kawasaki_solutions$1(graph, vertex) {
    return math$1.core.kawasaki_solutions(...vertex_adjacent_vectors(graph, vertex));
  }
  function kawasaki_collapse(graph, vertex, face, crease_direction = "F") {
    const kawasakis = kawasaki_solutions$1(graph, vertex);
    const origin = graph.vertices_coords[vertex];
    split_convex_polygon$1(graph, face, origin, kawasakis[face], crease_direction);
  }

  var kawasaki = /*#__PURE__*/Object.freeze({
    kawasaki_solutions: kawasaki_solutions$1,
    kawasaki_collapse: kawasaki_collapse
  });

  const copy_properties = function (graph, geometry_prefix, index) {
    const prefix = `${geometry_prefix}_`;
    const prefixKeys = Object.keys(graph)
      .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
      .filter(str => str !== undefined);
    const result = {};
    prefixKeys.forEach((key) => { result[key] = graph[key][index]; });
    return result;
  };
  const add_edge = function (graph, a, b, c, d) {
    const edge = math$1.edge(a, b, c, d);
    let vertices_length = vertices_count(graph);
    const edges = graph.edges_vertices
      .map(ev => ev.map(v => graph.vertices_coords[v]));
    const endpoints_vertex_equivalent = [0, 1].map(ei => graph.vertices_coords
      .map(v => Math.sqrt(((edge[ei][0] - v[0]) ** 2)
                        + ((edge[ei][1] - v[1]) ** 2)))
      .map((dist, i) => (dist < math$1.core.EPSILON ? i : undefined))
      .filter(el => el !== undefined)
      .shift());
    const endpoints_edge_collinear = [0, 1].map(ei => edges
      .map(e => math$1.core.point_on_edge(e[0], e[1], edge[ei]))
      .map((on_edge, i) => (on_edge ? i : undefined))
      .filter(e => e !== undefined)
      .shift());
    const vertices_origin = [0, 1].map((i) => {
      if (endpoints_vertex_equivalent[i] !== undefined) { return "vertex"; }
      if (endpoints_edge_collinear[i] !== undefined) { return "edge"; }
      return "new";
    });
    const result = {
      new: { vertices: [], edges: [{ edges_vertices: [] }] },
      remove: { edges: [] }
    };
    [0, 1].forEach((i) => {
      switch (vertices_origin[i]) {
        case "vertex":
          result.new.edges[0].edges_vertices[i] = endpoints_vertex_equivalent[i];
          break;
        case "edge":
          result.new.vertices.push({
            vertices_coords: [edge[i][0], edge[i][1]]
          });
          vertices_length += 1;
          result.new.edges[0].edges_vertices[i] = vertices_length - 1;
          const dup = copy_properties(graph, "edges", endpoints_edge_collinear[i]);
          const new_edges_vertices = [{
            edges_vertices: [
              graph.edges_vertices[endpoints_edge_collinear[i]][0],
              vertices_length - 1]
          }, {
            edges_vertices: [
              graph.edges_vertices[endpoints_edge_collinear[i]][1],
              vertices_length - 1]
          }];
          result.new.edges.push(
            Object.assign(Object.assign({}, dup), new_edges_vertices[0]),
            Object.assign(Object.assign({}, dup), new_edges_vertices[1])
          );
          result.remove.edges.push(endpoints_edge_collinear[i]);
          break;
        default:
          result.new.vertices.push({
            vertices_coords: [edge[i][0], edge[i][1]]
          });
          vertices_length += 1;
          result.new.edges[0].edges_vertices[i] = vertices_length - 1;
          break;
      }
    });
    return result;
  };

  const fragment2 = function (inGraph, epsilon = math$1.core.EPSILON) {
    const graph = split_at_crossings(inGraph, epsilon);
    convert$1.edges_vertices_to_vertices_vertices_sorted(graph);
    convert$1.vertices_vertices_to_faces_vertices(graph);
    convert$1.faces_vertices_to_faces_edges(graph);
    return graph;
  };
  const split_at_crossings = function (graph, epsilon = math$1.core.EPSILON) {
    const horizSort = function (a, b) { return a[0] - b[0]; };
    const vertSort = function (a, b) { return a[1] - b[1]; };
    const equivalent = function (a, b) {
      for (let i = 0; i < a.length; i += 1) {
        if (Math.abs(a[i] - b[i]) > epsilon) {
          return false;
        }
      }
      return true;
    };
    const edge_count = graph.edges_vertices.length;
    const edges = graph.edges_vertices.map(ev => [
      graph.vertices_coords[ev[0]],
      graph.vertices_coords[ev[1]],
    ]);
    const edges_vector = edges.map(e => [e[1][0] - e[0][0], e[1][1] - e[0][1]]);
    const edges_magnitude = edges_vector
      .map(e => Math.sqrt(e[0] * e[0] + e[1] * e[1]));
    const edges_normalized = edges_vector
      .map((e, i) => [e[0] / edges_magnitude[i], e[1] / edges_magnitude[i]]);
    const edges_horizontal = edges_normalized.map(e => Math.abs(e[0]) > 0.707);
    const crossings = Array.from(Array(edge_count - 1)).map(() => []);
    for (let i = 0; i < edges.length - 1; i += 1) {
      for (let j = i + 1; j < edges.length; j += 1) {
        crossings[i][j] = math$1.core.intersection.edge_edge_exclusive(
          edges[i][0], edges[i][1],
          edges[j][0], edges[j][1],
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
    edges.forEach((e, i) => e.sort(edges_horizontal[i] ? horizSort : vertSort));
    edges_intersections.forEach((e, i) => e
      .sort(edges_horizontal[i] ? horizSort : vertSort));
    let new_edges = edges_intersections
      .map((e, i) => [edges[i][0], ...e, edges[i][1]])
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
        vertices_equivalent[i][j] = equivalent(
          vertices_coords[i],
          vertices_coords[j],
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
    const flat = {
      vertices_coords,
      edges_vertices,
    };
    const vertices_remove_indices = vertices_remove
      .map((rm, i) => (rm ? i : undefined))
      .filter(i => i !== undefined);
    remove_vertices(flat, vertices_remove_indices);
    return flat;
  };

  const possibleFoldObject = function (fold) {
    const argKeys = Object.keys(fold);
    for (let i = 0; i < argKeys.length; i += 1) {
      if (keys.includes(argKeys[i])) { return true; }
    }
    return false;
  };
  const edges_assignment = function (graph) {
    if ("edges_assignment" in graph === false) {
      return false;
    }
    if (graph.edges_assignment.length !== graph.edges_vertices.length) {
      return false;
    }
    return graph.edges_assignment
      .filter(v => edges_assignment_values.includes(v))
      .reduce((a, b) => a && b, true);
  };
  const validate = function (graph) {
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

  var validate$1 = /*#__PURE__*/Object.freeze({
    possibleFoldObject: possibleFoldObject,
    edges_assignment: edges_assignment,
    validate: validate
  });

  const complete = function (graph) {
    if ("vertices_coords" in graph === false
      || "edges_vertices" in graph === false) { return; }
    if ("vertices_vertices" in graph === false) {
      convert$1.edges_vertices_to_vertices_vertices_sorted(graph);
    }
    if ("faces_vertices" in graph === false) {
      convert$1.vertices_vertices_to_faces_vertices(graph);
    }
    if ("faces_edges" in graph === false) {
      convert$1.faces_vertices_to_faces_edges(graph);
    }
    if ("edges_faces" in graph === false) {
      graph.edges_faces = make_edges_faces(graph);
    }
    if ("vertices_faces" in graph === false) {
      graph.vertices_faces = make_vertices_faces(graph);
    }
    if ("edges_length" in graph === false) {
      graph.edges_length = make_edges_length(graph);
    }
    if ("edges_foldAngle" in graph === false
      && "edges_assignment" in graph === true) {
      graph.edges_foldAngle = graph.edges_assignment
        .map(a => edge_assignment_to_foldAngle(a));
    }
    if ("edges_assignment" in graph === false
      && "edges_foldAngle" in graph === true) {
      graph.edges_assignment = graph.edges_foldAngle.map((a) => {
        if (a === 0) return "F";
        if (a < 0) return "M";
        if (a > 0) return "V";
        return "U";
      });
    }
    if ("faces_faces" in graph === false) {
      graph.faces_faces = make_faces_faces(graph);
    }
    if ("vertices_edges" in graph === false) {
      graph.vertices_edges = make_vertices_edges(graph);
    }
  };
  const rebuild = function (graph, epsilon = math$1.core.EPSILON) {
    ["vertices_vertices", "vertices_edges", "vertices_faces",
      "edges_faces", "edges_edges",
      "faces_vertices", "faces_edges", "faces_faces"].filter(a => a in graph)
      .forEach(key => delete graph[key]);
    const rebuilt = fragment2(graph, epsilon);
    remove_duplicate_edges(rebuilt);
    convert$1.edges_vertices_to_vertices_vertices_sorted(rebuilt);
    convert$1.vertices_vertices_to_faces_vertices(rebuilt);
    convert$1.faces_vertices_to_faces_edges(rebuilt);
    rebuilt.edges_faces = make_edges_faces(rebuilt);
    rebuilt.vertices_faces = make_vertices_faces(rebuilt);
    Object.assign(graph, rebuilt);
    if (!edges_assignment(graph)) {
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
    complete: complete,
    rebuild: rebuild
  });

  const Prototype$2 = function (proto = {}) {
    const json = function () {
      return convert$1.toJSON(this);
    };
    const getVertices = function () {
      return invert_geometry_arrays(this, "vertices");
    };
    const getEdges = function () {
      return invert_geometry_arrays(this, "edges");
    };
    const getFaces = function () {
      return invert_geometry_arrays(this, "faces");
    };
    const getBoundaries = function () {
      return [get_boundary$1(this)];
    };
    proto.rebuild = function (epsilon = math$1.core.EPSILON) {
      rebuild(this, epsilon);
    };
    proto.complete = function () {
      complete(this);
    };
    proto.copy = function () {
      return Object.assign(Object.create(Prototype$2()), clone(this));
    };
    proto.clear = function () {
      remove_non_boundary_edges(this);
      this.onchange.forEach(f => f());
    };
    proto.nearestVertex = function (...args) {
      return nearest_vertex(this, math$1.core.get_vector(...args));
    };
    proto.nearestEdge = function (...args) {
      return nearest_edge(this, math$1.core.get_vector(...args));
    };
    proto.nearestFace = function (...args) {
      return face_containing_point(this, math$1.core.get_vector(...args));
    };
    proto.foldedForm = function () {
      const foldedFrame = this.file_frames
        .filter(f => f.frame_classes.includes("foldedForm"))
        .filter(f => f.vertices_coords.length === this.vertices_coords.length)
        .shift();
      return foldedFrame != null
        ? merge_frame(this, foldedFrame)
        : undefined;
    };
    const didModifyGraph = function () {
      this.onchange.forEach(f => f());
    };
    proto.addVertexOnEdge = function (x, y, oldEdgeIndex) {
      add_vertex_on_edge(this, x, y, oldEdgeIndex);
      didModifyGraph.call(this);
    };
    proto.markFold = function (...args) {
      const objects = args.filter(p => typeof p === "object");
      const line = math$1.core.get_line(args);
      const face_index = args.filter(a => a !== null && !isNaN(a)).shift();
      if (!math$1.core.is_vector(line.point)
        || !math$1.core.is_vector(line.vector)) {
        console.warn("markFold was not supplied the correct parameters");
        return;
      }
      const folded = fold_through(this,
        line.point,
        line.vector,
        face_index,
        "F");
      Object.keys(folded).forEach((key) => { this[key] = folded[key]; });
      if ("re:construction" in this === true) {
        if (objects.length > 0 && "axiom" in objects[0] === true) {
          this["re:construction"].axiom = objects[0].axiom;
          this["re:construction"].parameters = objects[0].parameters;
        }
      }
      delete this["faces_re:matrix"];
      didModifyGraph.call(this);
    };
    proto.valleyFold = function (...args) {
      const objects = args.filter(p => typeof p === "object");
      const line = math$1.core.get_line(args);
      const face_index = args.filter(a => a !== null && !isNaN(a)).shift();
      if (!math$1.core.is_vector(line.point) || !math$1.core.is_vector(line.vector)) {
        console.warn("valleyFold was not supplied the correct parameters");
        return;
      }
      const folded = fold_through(this,
        line.point,
        line.vector,
        face_index,
        "V");
      Object.keys(folded).forEach((key) => { this[key] = folded[key]; });
      if ("re:construction" in this === true) {
        if (objects.length > 0 && "axiom" in objects[0] === true) {
          this["re:construction"].axiom = objects[0].axiom;
          this["re:construction"].parameters = objects[0].parameters;
        }
      }
      delete this["faces_re:matrix"];
      didModifyGraph.call(this);
    };
    proto.creaseRay = function (...args) {
      const ray = math$1.ray(args);
      const faces = this.faces_vertices.map(fv => fv.map(v => this.vertices_coords[v]));
      const intersecting = faces
        .map((face, i) => (math$1.core.intersection
          .convex_poly_ray_exclusive(face, ray.point, ray.vector) === undefined
          ? undefined : i))
        .filter(a => a !== undefined)
        .sort((a, b) => b - a);
      console.log(faces, intersecting);
      intersecting.forEach(index => split_convex_polygon$1(
        this, index, ray.point, ray.vector, "F"
      ));
    };
    proto.creaseSegment = function (...args) {
      const diff = add_edge(this, ...args);
      if (diff === undefined) { return undefined; }
      if (diff.edges_index_map != null) {
        Object.keys(diff.edges_index_map)
          .forEach((i) => {
            this.edges_assignment[i] = this
              .edges_assignment[diff.edges_index_map[i]];
          });
      }
      const edges_remove_count = (diff.edges_to_remove != null)
        ? diff.edges_to_remove.length : 0;
      if (diff.edges_to_remove != null) {
        diff.edges_to_remove.slice()
          .sort((a, b) => b - a)
          .forEach((i) => {
            this.edges_vertices.splice(i, 1);
            this.edges_assignment.splice(i, 1);
          });
      }
      const crease = component.crease(this, [diff.edges_new[0] - edges_remove_count]);
      didModifyGraph.call(this);
      return crease;
    };
    proto.kawasaki = function (...args) {
      const crease = component.crease(this, kawasaki_collapse(this, ...args));
      didModifyGraph.call(this);
      return crease;
    };
    Object.defineProperty(proto, "boundaries", { get: getBoundaries });
    Object.defineProperty(proto, "vertices", { get: getVertices });
    Object.defineProperty(proto, "edges", { get: getEdges });
    Object.defineProperty(proto, "faces", { get: getFaces });
    Object.defineProperty(proto, "json", { get: json });
    proto.onchange = [];
    proto.__rabbit_ear = RabbitEar;
    return Object.freeze(proto);
  };

  const file_spec = 1.1;
  const file_creator = "Rabbit Ear";
  const metadata = function () {
    return {
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
      faces_faces: [[]],
    };
  };
  const square = function () {
    return Object.assign(
      Object.create(null),
      metadata(),
      cp_type(),
      square_graph(),
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
    );
  };
  const regular_polygon = function (sides, radius = 1) {
    const arr = Array.from(Array(sides));
    const angle = 2 * Math.PI / sides;
    const sideLength = math$1.core.clean_number(Math.sqrt(
      ((radius - radius * Math.cos(angle)) ** 2)
      + ((radius * Math.sin(angle)) ** 2),
    ));
    const graph = {
      vertices_coords: arr.map((_, i) => angle * i).map(a => [
        math$1.core.clean_number(radius * Math.cos(a)),
        math$1.core.clean_number(radius * Math.sin(a)),
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
    );
  };

  var create = /*#__PURE__*/Object.freeze({
    square: square,
    rectangle: rectangle,
    regular_polygon: regular_polygon
  });

  const CreasePattern = function (...args) {
    const foldObjs = args
      .filter(el => typeof el === "object" && el !== null)
      .filter(el => possibleFoldObject(el));
    const graph = Object.assign(
      Object.create(Prototype$2()),
      foldObjs.shift() || square()
    );
    const validate_and_clean = function (epsilon = math.core.EPSILON) {
      const valid = ("vertices_coords" in this && "vertices_vertices" in this
        && "edges_vertices" in this && "edges_assignment" in this
        && "faces_vertices" in this && "faces_edges" in this);
      if (!valid) {
        console.log("load() crease pattern missing geometry arrays. rebuilding. geometry indices will change");
        clean(epsilon);
      }
    };
    const svg = function (cssRules) {
    };
    const load = function (file, prevent_wipe) {
      if (prevent_wipe == null || prevent_wipe !== true) {
        keys.forEach(key => delete this[key]);
      }
      Object.assign(this, JSON.parse(JSON.stringify(file)));
      validate_and_clean();
    };
    Object.defineProperty(graph, "load", { value: load });
    Object.defineProperty(graph, "svg", { value: svg });
    return graph;
  };
  CreasePattern.square = function () {
    return CreasePattern(rectangle(1, 1));
  };
  CreasePattern.rectangle = function (width = 1, height = 1) {
    return CreasePattern(rectangle(width, height));
  };
  CreasePattern.regularPolygon = function (sides, radius = 1) {
    if (sides == null) {
      console.warn("regularPolygon requires number of sides parameter");
    }
    return CreasePattern(regular_polygon(sides, radius));
  };

  var length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0};
  var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig;
  function parse(path) {
    var data = [];
  	path.replace(segment, function(_, command, args){
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
  const RES_CIRCLE = 64;
  const RES_PATH = 128;
  const emptyValue = { value: 0 };
  const getAttributes = function(element, attributeList) {
  	let indices = attributeList.map(attr => {
  		for (var i = 0; i < element.attributes.length; i++) {
  			if (element.attributes[i].nodeName === attr) {
  				return i;
  			}
  		}
  	});
  	return indices
  		.map(i => i === undefined ? emptyValue : element.attributes[i])
  		.map(attr => attr.value !== undefined ? attr.value : attr.baseVal.value);
  };
  const svg_line_to_segments = function(line) {
  	return [getAttributes(line, ["x1","y1","x2","y2"])];
  };
  const svg_rect_to_segments = function(rect) {
  	let attrs = getAttributes(rect, ["x","y","width","height"]);
  	let x = parseFloat(attrs[0]);
  	let y = parseFloat(attrs[1]);
  	let width = parseFloat(attrs[2]);
  	let height = parseFloat(attrs[3]);
  	return [
  		[x, y, x+width, y],
  		[x+width, y, x+width, y+height],
  		[x+width, y+height, x, y+height],
  		[x, y+height, x, y]
  	];
  };
  const svg_circle_to_segments = function(circle) {
  	let attrs = getAttributes(circle, ["cx", "cy", "r"]);
  	let cx = parseFloat(attrs[0]);
  	let cy = parseFloat(attrs[1]);
  	let r = parseFloat(attrs[2]);
  	return Array.from(Array(RES_CIRCLE))
  		.map((_,i) => [
  			cx + r*Math.cos(i/RES_CIRCLE*Math.PI*2),
  			cy + r*Math.sin(i/RES_CIRCLE*Math.PI*2)
  		]).map((_,i,arr) => [
  			arr[i][0],
  			arr[i][1],
  			arr[(i+1)%arr.length][0],
  			arr[(i+1)%arr.length][1]
  		]);
  };
  const svg_ellipse_to_segments = function(ellipse) {
  	let attrs = getAttributes(ellipse, ["cx", "cy", "rx", "ry"]);
  	let cx = parseFloat(attrs[0]);
  	let cy = parseFloat(attrs[1]);
  	let rx = parseFloat(attrs[2]);
  	let ry = parseFloat(attrs[3]);
  	return Array.from(Array(RES_CIRCLE))
  		.map((_,i) => [
  			cx + rx*Math.cos(i/RES_CIRCLE*Math.PI*2),
  			cy + ry*Math.sin(i/RES_CIRCLE*Math.PI*2)
  		]).map((_,i,arr) => [
  			arr[i][0],
  			arr[i][1],
  			arr[(i+1)%arr.length][0],
  			arr[(i+1)%arr.length][1]
  		]);
  };
  const pointStringToArray = function(str) {
  	return str.split(" ")
  		.filter(s => s !== "")
  		.map(p => p.split(",")
  			.map(n => parseFloat(n))
  		);
  };
  const svg_polygon_to_segments = function(polygon) {
  	let points = "";
  	for (var i = 0; i < polygon.attributes.length; i++) {
  		if (polygon.attributes[i].nodeName === "points") {
  			points = polygon.attributes[i].value;
  			break;
  		}
  	}
  	return pointStringToArray(points)
  		.map((_,i,a) => [
  			a[i][0],
  			a[i][1],
  			a[(i+1)%a.length][0],
  			a[(i+1)%a.length][1]
  		])
  };
  const svg_polyline_to_segments = function(polyline) {
  	let circularPath = svg_polygon_to_segments(polyline);
  	circularPath.pop();
  	return circularPath;
  };
  const svg_path_to_segments = function(path) {
  	let d = path.getAttribute("d");
  	let prop = PathProperties(d);
  	let length = prop.getTotalLength();
  	let isClosed = (d[d.length-1] === "Z" || d[d.length-1] === "z");
  	let segmentLength = (isClosed
  		? length / RES_PATH
  		: length / (RES_PATH-1));
  	let pathsPoints = Array.from(Array(RES_PATH))
  		.map((_,i) => prop.getPointAtLength(i*segmentLength))
  		.map(p => [p.x, p.y]);
  	let segments = pathsPoints.map((_,i,a) => [
  		a[i][0],
  		a[i][1],
  		a[(i+1)%a.length][0],
  		a[(i+1)%a.length][1]
  	]);
  	if (!isClosed) { segments.pop(); }
  	return segments;
  };
  const parsers = {
  	"line": svg_line_to_segments,
  	"rect": svg_rect_to_segments,
  	"circle": svg_circle_to_segments,
  	"ellipse": svg_ellipse_to_segments,
  	"polygon": svg_polygon_to_segments,
  	"polyline": svg_polyline_to_segments,
  	"path": svg_path_to_segments
  };
  let DOMParser$1$1 = (typeof window === "undefined" || window === null)
  	? undefined
  	: window.DOMParser;
  if (typeof DOMParser$1$1 === "undefined" || DOMParser$1$1 === null) {
  	DOMParser$1$1 = require("xmldom").DOMParser;
  }
  let XMLSerializer$1$1 = (typeof window === "undefined" || window === null)
  	? undefined
  	: window.XMLSerializer;
  if (typeof XMLSerializer$1$1 === "undefined" || XMLSerializer$1$1 === null) {
  	XMLSerializer$1$1 = require("xmldom").XMLSerializer;
  }
  let document$1$1 = (typeof window === "undefined" || window === null)
  	? undefined
  	: window.document;
  if (typeof document$1$1 === "undefined" || document$1$1 === null) {
  	document$1$1 = new DOMParser$1$1()
  		.parseFromString("<!DOCTYPE html><title>a</title>", "text/html");
  }
  const parseable = Object.keys(parsers);
  const shape_attr = {
  	"line": ["x1", "y1", "x2", "y2"],
  	"rect": ["x", "y", "width", "height"],
  	"circle": ["cx", "cy", "r"],
  	"ellipse": ["cx", "cy", "rx", "ry"],
  	"polygon": ["points"],
  	"polyline": ["points"],
  	"path": ["d"]
  };
  const inputIntoXML = function(input) {
  	return (typeof input === "string"
  		? new DOMParser$1$1().parseFromString(input, "text/xml").documentElement
  		: input);
  };
  const flatten_tree = function(element) {
  	if (element.tagName === "g" || element.tagName === "svg") {
  		if (element.childNodes == null) { return []; }
  		return Array.from(element.childNodes)
  			.map(child => flatten_tree(child))
  			.reduce((a,b) => a.concat(b),[]);
  	}
  	return [element];
  };
  const attribute_list = function(element) {
  	return Array.from(element.attributes)
  		.filter(a => shape_attr[element.tagName].indexOf(a.name) === -1);
  };
  const withAttributes = function(input) {
  	let inputSVG = inputIntoXML(input);
  	return flatten_tree(inputSVG)
  		.filter(e => parseable.indexOf(e.tagName) !== -1)
  		.map(e => parsers[e.tagName](e).map(s => {
  			let obj = ({x1:s[0], y1:s[1], x2:s[2], y2:s[3]});
  			attribute_list(e).forEach(a => obj[a.nodeName] = a.value);
  			return obj;
  		}))
  		.reduce((a,b) => a.concat(b), []);
  };
  const get_boundary_vertices = function (graph) {
    let edges_vertices_b = graph.edges_vertices.filter((ev,i) =>
      graph.edges_assignment[i] == "B" ||
      graph.edges_assignment[i] == "b"
    ).map(arr => arr.slice());
    if (edges_vertices_b.length === 0) { return []; }
    let keys = Array.from(Array(graph.vertices_coords.length)).map(_ => []);
    edges_vertices_b.forEach((ev,i) => ev.forEach(e => keys[e].push(i)));
    let edgeIndex = 0;
    let startVertex = edges_vertices_b[edgeIndex].shift();
    let nextVertex = edges_vertices_b[edgeIndex].shift();
    let vertices = [startVertex];
    while (vertices[0] !== nextVertex) {
      vertices.push(nextVertex);
      let whichEdges = keys[nextVertex];
      let thisKeyIndex = keys[nextVertex].indexOf(edgeIndex);
      if (thisKeyIndex === -1) { return; }
      keys[nextVertex].splice(thisKeyIndex, 1);
      let nextEdgeAndIndex = keys[nextVertex]
        .map((el,i) => ({key: el, i: i}))
        .filter(el => el.key !== edgeIndex).shift();
      if (nextEdgeAndIndex == null) { return; }
      keys[nextVertex].splice(nextEdgeAndIndex.i, 1);
      edgeIndex = nextEdgeAndIndex.key;
      let lastEdgeIndex = edges_vertices_b[edgeIndex].indexOf(nextVertex);
      if (lastEdgeIndex === -1) { return; }
      edges_vertices_b[edgeIndex].splice(lastEdgeIndex, 1);
      nextVertex = edges_vertices_b[edgeIndex].shift();
    }
    return vertices;
  };
  const bounding_rect$1 = function (graph) {
    if ("vertices_coords" in graph === false ||
      graph.vertices_coords.length <= 0) {
      return [0,0,0,0];
    }
    let dimension = graph.vertices_coords[0].length;
    let smallest = Array.from(Array(dimension)).map(_ => Infinity);
    let largest = Array.from(Array(dimension)).map(_ => -Infinity);
    graph.vertices_coords.forEach(v => v.forEach((n,i) => {
      if (n < smallest[i]) { smallest[i] = n; }
      if (n > largest[i]) { largest[i] = n; }
    }));
    let x = smallest[0];
    let y = smallest[1];
    let w = largest[0] - smallest[0];
    let h = largest[1] - smallest[1];
    return (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)
      ? [0,0,0,0]
      : [x,y,w,h]);
  };
  const make_faces_faces$1 = function (graph) {
    let nf = graph.faces_vertices.length;
    let faces_faces = Array.from(Array(nf)).map(() => []);
    let edgeMap = {};
    graph.faces_vertices.forEach((vertices_index, idx1) => {
      if (vertices_index === undefined) { return; }
      let n = vertices_index.length;
      vertices_index.forEach((v1, i, vs) => {
        let v2 = vs[(i + 1) % n];
        if (v2 < v1) [v1, v2] = [v2, v1];
        let key = v1 + " " + v2;
        if (key in edgeMap) {
          let idx2 = edgeMap[key];
          faces_faces[idx1].push(idx2);
          faces_faces[idx2].push(idx1);
        } else {
          edgeMap[key] = idx1;
        }
      });
    });
    return faces_faces;
  };
  const faces_matrix_coloring = function (faces_matrix) {
    return faces_matrix
      .map(m => m[0] * m[3] - m[1] * m[2])
      .map(c => c >= 0);
  };
  const faces_coloring = function (graph, root_face = 0){
    let coloring = [];
    coloring[root_face] = true;
    make_face_walk_tree$1(graph, root_face).forEach((level, i) =>
      level.forEach((entry) => coloring[entry.face] = (i % 2 === 0))
    );
    return coloring;
  };
  const make_face_walk_tree$1 = function (graph, root_face = 0){
    let new_faces_faces = make_faces_faces$1(graph);
    if (new_faces_faces.length <= 0) {
      return [];
    }
    var visited = [root_face];
    var list = [[{ face: root_face, parent: undefined, edge: undefined, level: 0 }]];
    do{
      list[list.length] = list[list.length-1].map((current) =>{
        let unique_faces = new_faces_faces[current.face]
          .filter(f => visited.indexOf(f) === -1);
        visited = visited.concat(unique_faces);
        return unique_faces.map(f => ({
          face: f,
          parent: current.face,
          edge: graph.faces_vertices[f]
            .filter(v => graph.faces_vertices[current.face].indexOf(v) !== -1)
            .sort((a,b) => a-b)
        }))
      }).reduce((prev,curr) => prev.concat(curr),[]);
    } while(list[list.length-1].length > 0);
    if(list.length > 0 && list[list.length-1].length == 0){ list.pop(); }
    return list;
  };
  const flatten_frame$1 = function (fold_file, frame_num){
    if ("file_frames" in fold_file === false ||
      fold_file.file_frames.length < frame_num) {
      return fold_file;
    }
    const dontCopy = ["frame_parent", "frame_inherit"];
    var memo = {visited_frames:[]};
    function recurse(fold_file, frame, orderArray) {
      if (memo.visited_frames.indexOf(frame) !== -1) {
        throw "FOLD file_frames encountered a cycle. stopping.";
        return orderArray;
      }
      memo.visited_frames.push(frame);
      orderArray = [frame].concat(orderArray);
      if (frame === 0) { return orderArray; }
      if (fold_file.file_frames[frame - 1].frame_inherit &&
         fold_file.file_frames[frame - 1].frame_parent != null) {
        return recurse(fold_file, fold_file.file_frames[frame - 1].frame_parent, orderArray);
      }
      return orderArray;
    }
    return recurse(fold_file, frame_num, []).map(frame => {
      if (frame === 0) {
        let swap = fold_file.file_frames;
        fold_file.file_frames = null;
        let copy = JSON.parse(JSON.stringify(fold_file));
        fold_file.file_frames = swap;
        delete copy.file_frames;
        dontCopy.forEach(key => delete copy[key]);
        return copy;
      }
      let copy = JSON.parse(JSON.stringify(fold_file.file_frames[frame-1]));
      dontCopy.forEach(key => delete copy[key]);
      return copy;
    }).reduce((prev,curr) => Object.assign(prev,curr),{})
  };
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
  const svg_to_fold = function (svg$$1) {
    let graph = {
      "file_spec": 1.1,
      "file_creator": "Rabbit Ear",
      "file_classes": ["singleModel"],
      "frame_title": "",
      "frame_classes": ["creasePattern"],
      "frame_attributes": ["2D"],
      "vertices_coords": [],
      "vertices_vertices": [],
      "vertices_faces": [],
      "edges_vertices": [],
      "edges_faces": [],
      "edges_assignment": [],
      "edges_foldAngle": [],
      "edges_length": [],
      "faces_vertices": [],
      "faces_edges": [],
    };
    let vl = graph.vertices_coords.length;
    let segments$$1 = withAttributes(svg$$1);
    graph.vertices_coords = segments$$1
      .map(s => [[s.x1, s.y1], [s.x2, s.y2]])
      .reduce((a,b) => a.concat(b), []);
    return graph;
    graph.edges_vertices = segments$$1.map((_,i) => [vl+i*2, vl+i*2+1]);
    graph.edges_assignment = segments$$1.map(l => color_to_assignment(l.stroke));
    graph.edges_foldAngle = graph.edges_assignment.map(a =>
      (a === "M" ? -180 : (a === "V" ? 180 : 0))
    );
    return graph;
  };
  const color_to_assignment = function (string) {
    let c = [0,0,0,1];
    if (string[0] === "#") {
      c = hexToComponents(string);
    } else if (css_color_names.indexOf(string) !== -1) {
      c = hexToComponents(css_colors[string]);
    }
    const ep = 0.05;
    if (c[0] < ep && c[1] < ep && c[2] < ep) { return "F"; }
    if (c[0] > c[1] && (c[0] - c[2]) > ep) { return "V"; }
    if (c[2] > c[1] && (c[2] - c[0]) > ep) { return "M"; }
    return "F";
  };
  const hexToComponents = function (h) {
    let r = 0, g = 0, b = 0, a = 255;
    if (h.length == 4) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];
    } else if (h.length == 7) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
    } else if (h.length == 5) {
      r = "0x" + h[1] + h[1];
      g = "0x" + h[2] + h[2];
      b = "0x" + h[3] + h[3];
      a = "0x" + h[4] + h[4];
    } else if (h.length == 9) {
      r = "0x" + h[1] + h[2];
      g = "0x" + h[3] + h[4];
      b = "0x" + h[5] + h[6];
      a = "0x" + h[7] + h[8];
    }
    return [+(r / 255), +(g / 255), +(b / 255), +(a / 255)];
  };
  const removeChildren$1 = function (parent) {
    while (parent.lastChild) {
      parent.removeChild(parent.lastChild);
    }
  };
  const getClassList$1 = function (xmlNode) {
    const currentClass = xmlNode.getAttribute("class");
    return (currentClass == null
      ? []
      : currentClass.split(" ").filter(s => s !== ""));
  };
  const addClass$1 = function (xmlNode, newClass) {
    if (xmlNode == null) {
      return;
    }
    const classes = getClassList$1(xmlNode)
      .filter(c => c !== newClass);
    classes.push(newClass);
    xmlNode.setAttributeNS(null, "class", classes.join(" "));
    return xmlNode;
  };
  const removeClass$1 = function (xmlNode, removedClass) {
    if (xmlNode == null) {
      return;
    }
    const classes = getClassList$1(xmlNode)
      .filter(c => c !== removedClass);
    xmlNode.setAttributeNS(null, "class", classes.join(" "));
    return xmlNode;
  };
  const setClass$1 = function (xmlNode, className) {
    xmlNode.setAttributeNS(null, "class", className);
    return xmlNode;
  };
  const setID$1 = function (xmlNode, idName) {
    xmlNode.setAttributeNS(null, "id", idName);
    return xmlNode;
  };
  const setViewBox$1 = function (svg, x, y, width, height, padding = 0) {
    const scale = 1.0;
    const d = (width / scale) - width;
    const X = (x - d) - padding;
    const Y = (y - d) - padding;
    const W = (width + d * 2) + padding * 2;
    const H = (height + d * 2) + padding * 2;
    const viewBoxString = [X, Y, W, H].join(" ");
    svg.setAttributeNS(null, "viewBox", viewBoxString);
  };
  const setDefaultViewBox$1 = function (svg) {
    const size = svg.getBoundingClientRect();
    const width = (size.width === 0 ? 640 : size.width);
    const height = (size.height === 0 ? 480 : size.height);
    setViewBox$1(svg, 0, 0, width, height);
  };
  const getViewBox$1 = function (svg) {
    const vb = svg.getAttribute("viewBox");
    return (vb == null
      ? undefined
      : vb.split(" ").map(n => parseFloat(n)));
  };
  const scaleViewBox$1 = function (svg, scale, origin_x = 0, origin_y = 0) {
    if (scale < 1e-8) { scale = 0.01; }
    const matrix = svg.createSVGMatrix()
      .translate(origin_x, origin_y)
      .scale(1 / scale)
      .translate(-origin_x, -origin_y);
    const viewBox = getViewBox$1(svg);
    if (viewBox == null) {
      setDefaultViewBox$1(svg);
    }
    const top_left = svg.createSVGPoint();
    const bot_right = svg.createSVGPoint();
    [top_left.x, top_left.y] = viewBox;
    bot_right.x = viewBox[0] + viewBox[2];
    bot_right.y = viewBox[1] + viewBox[3];
    const new_top_left = top_left.matrixTransform(matrix);
    const new_bot_right = bot_right.matrixTransform(matrix);
    setViewBox$1(svg,
      new_top_left.x,
      new_top_left.y,
      new_bot_right.x - new_top_left.x,
      new_bot_right.y - new_top_left.y);
  };
  const translateViewBox$1 = function (svg, dx, dy) {
    const viewBox = getViewBox$1(svg);
    if (viewBox == null) {
      setDefaultViewBox$1(svg);
    }
    viewBox[0] += dx;
    viewBox[1] += dy;
    svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
  };
  const convertToViewBox$1 = function (svg, x, y) {
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
    const array = [svgPoint.x, svgPoint.y];
    array.x = svgPoint.x;
    array.y = svgPoint.y;
    return array;
  };
  const attachClassMethods$1 = function (element) {
    element.removeChildren = function () {
      return removeChildren$1(element);
    };
    element.addClass = function (...args) {
      return addClass$1(element, ...args);
    };
    element.removeClass = function (...args) {
      return removeClass$1(element, ...args);
    };
    element.setClass = function (...args) {
      return setClass$1(element, ...args);
    };
    element.setID = function (...args) {
      return setID$1(element, ...args);
    };
  };
  const attachViewBoxMethods$1 = function (element) {
    element.setViewBox = function (...args) {
      return setViewBox$1(element, ...args);
    };
    element.getViewBox = function (...args) {
      return getViewBox$1(element, ...args);
    };
    element.scaleViewBox = function (...args) {
      return scaleViewBox$1(element, ...args);
    };
    element.translateViewBox = function (...args) {
      return translateViewBox$1(element, ...args);
    };
    element.convertToViewBox = function (...args) {
      return convertToViewBox$1(element, ...args);
    };
  };
  const attachAppendableMethods$1 = function (element, methods) {
    Object.keys(methods).forEach((key) => {
      element[key] = function (...args) {
        const g = methods[key](...args);
        element.appendChild(g);
        return g;
      };
    });
  };
  let DOMParser$1$1$1 = (typeof window === "undefined" || window === null)
    ? undefined
    : window.DOMParser;
  if (typeof DOMParser$1$1$1 === "undefined" || DOMParser$1$1$1 === null) {
    DOMParser$1$1$1 = require("xmldom").DOMParser;
  }
  let XMLSerializer$1$1$1 = (typeof window === "undefined" || window === null)
    ? undefined
    : window.XMLSerializer;
  if (typeof XMLSerializer$1$1$1 === "undefined" || XMLSerializer$1$1$1 === null) {
    XMLSerializer$1$1$1 = require("xmldom").XMLSerializer;
  }
  let document$1$1$1 = (typeof window === "undefined" || window === null)
    ? undefined
    : window.document;
  if (typeof document$1$1$1 === "undefined" || document$1$1$1 === null) {
    document$1$1$1 = new DOMParser$1$1$1()
      .parseFromString("<!DOCTYPE html><title>a</title>", "text/html");
  }
  const svgNS$1$1 = "http://www.w3.org/2000/svg";
  const setPoints$1 = function (polygon, pointsArray) {
    if (pointsArray == null || pointsArray.constructor !== Array) {
      return;
    }
    const pointsString = pointsArray.map(el => (el.constructor === Array
      ? el
      : [el.x, el.y]))
      .reduce((prev, curr) => `${prev}${curr[0]},${curr[1]} `, "");
    polygon.setAttributeNS(null, "points", pointsString);
  };
  const setArc$1 = function (shape, x, y, radius,
    startAngle, endAngle, includeCenter = false) {
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
  };
  const line$1 = function (x1, y1, x2, y2) {
    const shape = document$1$1$1.createElementNS(svgNS$1$1, "line");
    if (x1) { shape.setAttributeNS(null, "x1", x1); }
    if (y1) { shape.setAttributeNS(null, "y1", y1); }
    if (x2) { shape.setAttributeNS(null, "x2", x2); }
    if (y2) { shape.setAttributeNS(null, "y2", y2); }
    attachClassMethods$1(shape);
    return shape;
  };
  const circle$1 = function (x, y, radius) {
    const shape = document$1$1$1.createElementNS(svgNS$1$1, "circle");
    if (x) { shape.setAttributeNS(null, "cx", x); }
    if (y) { shape.setAttributeNS(null, "cy", y); }
    if (radius) { shape.setAttributeNS(null, "r", radius); }
    attachClassMethods$1(shape);
    return shape;
  };
  const ellipse$1 = function (x, y, rx, ry) {
    const shape = document$1$1$1.createElementNS(svgNS$1$1, "ellipse");
    if (x) { shape.setAttributeNS(null, "cx", x); }
    if (y) { shape.setAttributeNS(null, "cy", y); }
    if (rx) { shape.setAttributeNS(null, "rx", rx); }
    if (ry) { shape.setAttributeNS(null, "ry", ry); }
    attachClassMethods$1(shape);
    return shape;
  };
  const rect$1 = function (x, y, width, height) {
    const shape = document$1$1$1.createElementNS(svgNS$1$1, "rect");
    if (x) { shape.setAttributeNS(null, "x", x); }
    if (y) { shape.setAttributeNS(null, "y", y); }
    if (width) { shape.setAttributeNS(null, "width", width); }
    if (height) { shape.setAttributeNS(null, "height", height); }
    attachClassMethods$1(shape);
    return shape;
  };
  const polygon$1 = function (pointsArray) {
    const shape = document$1$1$1.createElementNS(svgNS$1$1, "polygon");
    setPoints$1(shape, pointsArray);
    attachClassMethods$1(shape);
    return shape;
  };
  const polyline$1 = function (pointsArray) {
    const shape = document$1$1$1.createElementNS(svgNS$1$1, "polyline");
    setPoints$1(shape, pointsArray);
    attachClassMethods$1(shape);
    return shape;
  };
  const bezier$1 = function (fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
    const pts = [[fromX, fromY], [c1X, c1Y], [c2X, c2Y], [toX, toY]]
      .map(p => p.join(","));
    const d = `M ${pts[0]} C ${pts[1]} ${pts[2]} ${pts[3]}`;
    const shape = document$1$1$1.createElementNS(svgNS$1$1, "path");
    shape.setAttributeNS(null, "d", d);
    attachClassMethods$1(shape);
    return shape;
  };
  const text$1 = function (textString, x, y) {
    const shape = document$1$1$1.createElementNS(svgNS$1$1, "text");
    shape.innerHTML = textString;
    shape.setAttributeNS(null, "x", x);
    shape.setAttributeNS(null, "y", y);
    attachClassMethods$1(shape);
    return shape;
  };
  const wedge$1 = function (x, y, radius, angleA, angleB) {
    const shape = document$1$1$1.createElementNS(svgNS$1$1, "path");
    setArc$1(shape, x, y, radius, angleA, angleB, true);
    attachClassMethods$1(shape);
    return shape;
  };
  const arc$1 = function (x, y, radius, angleA, angleB) {
    const shape = document$1$1$1.createElementNS(svgNS$1$1, "path");
    setArc$1(shape, x, y, radius, angleA, angleB, false);
    attachClassMethods$1(shape);
    return shape;
  };
  const regularPolygon$1 = function (cX, cY, radius, sides) {
    const halfwedge = 2 * Math.PI / sides * 0.5;
    const r = Math.cos(halfwedge) * radius;
    const points = Array.from(Array(sides)).map((el, i) => {
      const a = -2 * Math.PI * i / sides + halfwedge;
      const x = cX + r * Math.sin(a);
      const y = cY + r * Math.cos(a);
      return [x, y];
    });
    return polygon$1(points);
  };
  const svgNS$1$1$1 = "http://www.w3.org/2000/svg";
  const straightArrow$1 = function (startPoint, endPoint, options) {
    const p = {
      color: "#000",
      strokeWidth: 0.5,
      strokeStyle: "",
      fillStyle: "",
      highlight: undefined,
      highlightStrokeStyle: "",
      highlightFillStyle: "",
      width: 0.5,
      length: 2,
      padding: 0.0,
      start: false,
      end: true,
    };
    if (typeof options === "object" && options !== null) {
      Object.assign(p, options);
    }
    const arrowFill = [
      "stroke:none",
      `fill:${p.color}`,
      p.fillStyle,
    ].filter(a => a !== "").join(";");
    const arrowStroke = [
      "fill:none",
      `stroke:${p.color}`,
      `stroke-width:${p.strokeWidth}`,
      p.strokeStyle,
    ].filter(a => a !== "").join(";");
    const thinStroke = Math.floor(p.strokeWidth * 3) / 10;
    const thinSpace = Math.floor(p.strokeWidth * 6) / 10;
    const highlightStroke = [
      "fill:none",
      `stroke:${p.highlight}`,
      `stroke-width:${p.strokeWidth * 0.5}`,
      `stroke-dasharray:${thinStroke} ${thinSpace}`,
      "stroke-linecap:round",
      p.strokeStyle,
    ].filter(a => a !== "").join(";");
    const highlightFill = [
      "stroke:none",
      `fill:${p.highlight}`,
      p.fillStyle,
    ].filter(a => a !== "").join(";");
    let start = startPoint;
    let end = endPoint;
    const vec = [end[0] - start[0], end[1] - start[1]];
    const arrowLength = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
    const arrowVector = [vec[0] / arrowLength, vec[1] / arrowLength];
    const arrow90 = [arrowVector[1], -arrowVector[0]];
    start = [
      startPoint[0] + arrowVector[0] * (p.start ? 1 : 0) * p.padding,
      startPoint[1] + arrowVector[1] * (p.start ? 1 : 0) * p.padding,
    ];
    end = [
      endPoint[0] - arrowVector[0] * (p.end ? 1 : 0) * p.padding,
      endPoint[1] - arrowVector[1] * (p.end ? 1 : 0) * p.padding,
    ];
    const endHead = [
      [end[0] + arrow90[0] * p.width, end[1] + arrow90[1] * p.width],
      [end[0] - arrow90[0] * p.width, end[1] - arrow90[1] * p.width],
      [end[0] + arrowVector[0] * p.length, end[1] + arrowVector[1] * p.length],
    ];
    const startHead = [
      [start[0] - arrow90[0] * p.width, start[1] - arrow90[1] * p.width],
      [start[0] + arrow90[0] * p.width, start[1] + arrow90[1] * p.width],
      [start[0] - arrowVector[0] * p.length, start[1] - arrowVector[1] * p.length],
    ];
    const arrow = document$1$1$1.createElementNS(svgNS$1$1$1, "g");
    const l = line$1(start[0], start[1], end[0], end[1]);
    l.setAttribute("style", arrowStroke);
    arrow.appendChild(l);
    if (p.end) {
      const endArrowPoly = polygon$1(endHead);
      endArrowPoly.setAttribute("style", arrowFill);
      arrow.appendChild(endArrowPoly);
    }
    if (p.start) {
      const startArrowPoly = polygon$1(startHead);
      startArrowPoly.setAttribute("style", arrowFill);
      arrow.appendChild(startArrowPoly);
    }
    if (p.highlight !== undefined) {
      const hScale = 0.6;
      const centering = [
        arrowVector[0] * p.length * 0.09,
        arrowVector[1] * p.length * 0.09,
      ];
      const endHeadHighlight = [
        [centering[0] + end[0] + arrow90[0] * (p.width * hScale),
          centering[1] + end[1] + arrow90[1] * (p.width * hScale)],
        [centering[0] + end[0] - arrow90[0] * (p.width * hScale),
          centering[1] + end[1] - arrow90[1] * (p.width * hScale)],
        [centering[0] + end[0] + arrowVector[0] * (p.length * hScale),
          centering[1] + end[1] + arrowVector[1] * (p.length * hScale)],
      ];
      const startHeadHighlight = [
        [-centering[0] + start[0] - arrow90[0] * (p.width * hScale),
          -centering[1] + start[1] - arrow90[1] * (p.width * hScale)],
        [-centering[0] + start[0] + arrow90[0] * (p.width * hScale),
          -centering[1] + start[1] + arrow90[1] * (p.width * hScale)],
        [-centering[0] + start[0] - arrowVector[0] * (p.length * hScale),
          -centering[1] + start[1] - arrowVector[1] * (p.length * hScale)],
      ];
      const highline = line$1(start[0], start[1], end[0], end[1]);
      highline.setAttribute("style", highlightStroke);
      arrow.appendChild(highline);
      if (p.end) {
        const endArrowHighlight = polygon$1(endHeadHighlight);
        endArrowHighlight.setAttribute("style", highlightFill);
        arrow.appendChild(endArrowHighlight);
      }
      if (p.start) {
        const startArrowHighlight = polygon$1(startHeadHighlight);
        startArrowHighlight.setAttribute("style", highlightFill);
        arrow.appendChild(startArrowHighlight);
      }
    }
    return arrow;
  };
  const arcArrow$1 = function (start, end, options) {
    const p = {
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
      fillStyle: "",
    };
    if (typeof options === "object" && options !== null) {
      Object.assign(p, options);
    }
    const arrowFill = [
      "stroke:none",
      `fill:${p.color}`,
      p.fillStyle,
    ].filter(a => a !== "").join(";");
    const arrowStroke = [
      "fill:none",
      `stroke:${p.color}`,
      `stroke-width:${p.strokeWidth}`,
      p.strokeStyle,
    ].filter(a => a !== "").join(";");
    let startPoint = start;
    let endPoint = end;
    let vector = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]];
    let midpoint = [startPoint[0] + vector[0] / 2, startPoint[1] + vector[1] / 2];
    let len = Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]);
    var minLength = (p.start ? (1+p.padding) : 0 + p.end ? (1+p.padding) : 0)
      * p.length * 2.5;
    if (len < minLength) {
      let minVec = [vector[0]/len * minLength, vector[1]/len * minLength];
      startPoint = [midpoint[0]-minVec[0]*0.5, midpoint[1]-minVec[1]*0.5];
      endPoint = [midpoint[0]+minVec[0]*0.5, midpoint[1]+minVec[1]*0.5];
      vector = [endPoint[0]-startPoint[0], endPoint[1]-startPoint[1]];
    }
    let perpendicular = [vector[1], -vector[0]];
    let bezPoint = [
      midpoint[0] + perpendicular[0]*(p.side?1:-1) * p.bend,
      midpoint[1] + perpendicular[1]*(p.side?1:-1) * p.bend
    ];
    let bezStart = [bezPoint[0] - startPoint[0], bezPoint[1] - startPoint[1]];
    let bezEnd = [bezPoint[0] - endPoint[0], bezPoint[1] - endPoint[1]];
    let bezStartLen = Math.sqrt(bezStart[0]*bezStart[0]+bezStart[1]*bezStart[1]);
    let bezEndLen = Math.sqrt(bezEnd[0]*bezEnd[0]+bezEnd[1]*bezEnd[1]);
    let bezStartNorm = [bezStart[0]/bezStartLen, bezStart[1]/bezStartLen];
    let bezEndNorm = [bezEnd[0]/bezEndLen, bezEnd[1]/bezEndLen];
    let startHeadVec = [-bezStartNorm[0], -bezStartNorm[1]];
    let endHeadVec = [-bezEndNorm[0], -bezEndNorm[1]];
    let startNormal = [startHeadVec[1], -startHeadVec[0]];
    let endNormal = [endHeadVec[1], -endHeadVec[0]];
    let arcStart = [
      startPoint[0] + bezStartNorm[0]*p.length*((p.start?1:0)+p.padding),
      startPoint[1] + bezStartNorm[1]*p.length*((p.start?1:0)+p.padding)
    ];
    let arcEnd = [
      endPoint[0] + bezEndNorm[0]*p.length*((p.end?1:0)+p.padding),
      endPoint[1] + bezEndNorm[1]*p.length*((p.end?1:0)+p.padding)
    ];
    vector = [arcEnd[0]-arcStart[0], arcEnd[1]-arcStart[1]];
    perpendicular = [vector[1], -vector[0]];
    midpoint = [arcStart[0] + vector[0]/2, arcStart[1] + vector[1]/2];
    bezPoint = [
      midpoint[0] + perpendicular[0]*(p.side?1:-1) * p.bend,
      midpoint[1] + perpendicular[1]*(p.side?1:-1) * p.bend
    ];
    let controlStart = [
      arcStart[0] + (bezPoint[0] - arcStart[0]) * p.pinch,
      arcStart[1] + (bezPoint[1] - arcStart[1]) * p.pinch
    ];
    let controlEnd = [
      arcEnd[0] + (bezPoint[0] - arcEnd[0]) * p.pinch,
      arcEnd[1] + (bezPoint[1] - arcEnd[1]) * p.pinch
    ];
    let startHeadPoints = [
      [arcStart[0]+startNormal[0]*-p.width, arcStart[1]+startNormal[1]*-p.width],
      [arcStart[0]+startNormal[0]*p.width, arcStart[1]+startNormal[1]*p.width],
      [arcStart[0]+startHeadVec[0]*p.length,arcStart[1]+startHeadVec[1]*p.length]
    ];
    let endHeadPoints = [
      [arcEnd[0]+endNormal[0]*-p.width, arcEnd[1]+endNormal[1]*-p.width],
      [arcEnd[0]+endNormal[0]*p.width, arcEnd[1]+endNormal[1]*p.width],
      [arcEnd[0]+endHeadVec[0]*p.length, arcEnd[1]+endHeadVec[1]*p.length]
    ];
    let arrowGroup = document$1$1$1.createElementNS(svgNS$1$1$1, "g");
    let arrowArc = bezier$1(
      arcStart[0], arcStart[1], controlStart[0], controlStart[1],
      controlEnd[0], controlEnd[1], arcEnd[0], arcEnd[1]
    );
    arrowArc.setAttribute("style", arrowStroke);
    arrowGroup.appendChild(arrowArc);
    if (p.start) {
      let startHead = polygon$1(startHeadPoints);
      startHead.setAttribute("style", arrowFill);
      arrowGroup.appendChild(startHead);
    }
    if (p.end) {
      let endHead = polygon$1(endHeadPoints);
      endHead.setAttribute("style", arrowFill);
      arrowGroup.appendChild(endHead);
    }
    return arrowGroup;
  };
  const svgNS$2$1 = "http://www.w3.org/2000/svg";
  const drawMethods$1 = {
    line: line$1,
    circle: circle$1,
    ellipse: ellipse$1,
    rect: rect$1,
    polygon: polygon$1,
    polyline: polyline$1,
    bezier: bezier$1,
    text: text$1,
    wedge: wedge$1,
    arc: arc$1,
    straightArrow: straightArrow$1,
    arcArrow: arcArrow$1,
    regularPolygon: regularPolygon$1,
  };
  const setupSVG$1 = function (svgImage) {
    attachClassMethods$1(svgImage);
    attachViewBoxMethods$1(svgImage);
    attachAppendableMethods$1(svgImage, drawMethods$1);
  };
  const svg$1$1 = function () {
    const svgImage = document$1$1$1.createElementNS(svgNS$2$1, "svg");
    svgImage.setAttribute("version", "1.1");
    svgImage.setAttribute("xmlns", svgNS$2$1);
    setupSVG$1(svgImage);
    return svgImage;
  };
  const group$1 = function () {
    const g = document$1$1$1.createElementNS(svgNS$2$1, "g");
    attachClassMethods$1(g);
    attachAppendableMethods$1(g, drawMethods$1);
    return g;
  };
  const style$1 = function () {
    const s = document$1$1$1.createElementNS(svgNS$2$1, "style");
    s.setAttribute("type", "text/css");
    return s;
  };
  drawMethods$1.group = group$1;
  const CREASE_NAMES = {
    B: "boundary", b: "boundary",
    M: "mountain", m: "mountain",
    V: "valley",   v: "valley",
    F: "mark",     f: "mark",
    U: "mark",     u: "mark",
  };
  const faces_sorted_by_layer = function (faces_layer) {
    return faces_layer.map((layer, i) => ({ layer, i }))
      .sort((a, b) => a.layer - b.layer)
      .map(el => el.i);
  };
  const make_faces_sidedness = function (graph) {
    let coloring = graph["faces_re:coloring"];
    if (coloring == null) {
      coloring = ("faces_re:matrix" in graph)
        ? faces_matrix_coloring(graph["faces_re:matrix"])
        : faces_coloring(graph, 0);
    }
    return coloring.map(c => (c ? "front" : "back"));
  };
  const finalize_faces = function (graph, svg_faces) {
    const orderIsCertain = graph["faces_re:layer"] != null
      && graph["faces_re:layer"].length === graph.faces_vertices.length;
    if (orderIsCertain) {
      make_faces_sidedness(graph)
        .forEach((side, i) => svg_faces[i].setAttribute("class", side));
    }
    return (orderIsCertain
      ? faces_sorted_by_layer(graph["faces_re:layer"]).map(i => svg_faces[i])
      : svg_faces);
  };
  const make_edge_assignment_names = function (graph) {
    return (graph.edges_vertices == null || graph.edges_assignment == null
      || graph.edges_vertices.length !== graph.edges_assignment.length
      ? []
      : graph.edges_assignment.map(a => CREASE_NAMES[a]));
  };
  const svgBoundaries = function (graph) {
    if ("edges_vertices" in graph === false
      || "vertices_coords" in graph === false) {
      return [];
    }
    const boundary = get_boundary_vertices(graph)
      .map(v => graph.vertices_coords[v]);
    const p = polygon$1(boundary);
    p.setAttribute("class", "boundary");
    return [p];
  };
  const svgVertices = function (graph, options) {
    if ("vertices_coords" in graph === false) {
      return [];
    }
    const radius = options && options.radius ? options.radius : 0.01;
    const svg_vertices = graph.vertices_coords
      .map(v => circle$1(v[0], v[1], radius));
    svg_vertices.forEach((c, i) => c.setAttribute("id", `${i}`));
    return svg_vertices;
  };
  const svgEdges = function (graph) {
    if ("edges_vertices" in graph === false
      || "vertices_coords" in graph === false) {
      return [];
    }
    const svg_edges = graph.edges_vertices
      .map(ev => ev.map(v => graph.vertices_coords[v]))
      .map(e => line$1(e[0][0], e[0][1], e[1][0], e[1][1]));
    svg_edges.forEach((edge, i) => edge.setAttribute("id", `${i}`));
    make_edge_assignment_names(graph)
      .forEach((a, i) => svg_edges[i].setAttribute("class", a));
    return svg_edges;
  };
  const svgFacesVertices = function (graph) {
    if ("faces_vertices" in graph === false
      || "vertices_coords" in graph === false) {
      return [];
    }
    const svg_faces = graph.faces_vertices
      .map(fv => fv.map(v => graph.vertices_coords[v]))
      .map(face => polygon$1(face));
    svg_faces.forEach((face, i) => face.setAttribute("id", `${i}`));
    return finalize_faces(graph, svg_faces);
  };
  const svgFacesEdges = function (graph) {
    if ("faces_edges" in graph === false
      || "edges_vertices" in graph === false
      || "vertices_coords" in graph === false) {
      return [];
    }
    const svg_faces = graph.faces_edges
      .map(face_edges => face_edges
        .map(edge => graph.edges_vertices[edge])
        .map((vi, i, arr) => {
          const next = arr[(i + 1) % arr.length];
          return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
        }).map(v => graph.vertices_coords[v]))
      .map(face => polygon$1(face));
    svg_faces.forEach((face, i) => face.setAttribute("id", `${i}`));
    return finalize_faces(graph, svg_faces);
  };
  const svgFaces = function (graph) {
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
    boundaries: svgBoundaries,
  };
  var defaultStyle = "svg * {\n  stroke-width:var(--crease-width);\n  stroke-linecap:round;\n  stroke:black;\n}\npolygon {fill:none; stroke:none; stroke-linejoin:bevel;}\n.boundary {fill:white; stroke:black;}\n.mark {stroke:#aaa;}\n.mountain {stroke:#f00;}\n.valley{\n  stroke:#00f;\n  stroke-dasharray:calc(var(--crease-width)*2) calc(var(--crease-width)*2);\n}\n.foldedForm .boundary {fill:none;stroke:none;}\n.foldedForm .faces polygon { stroke:black; }\n.foldedForm .faces .front { fill:#fff; }\n.foldedForm .faces .back { fill:#ddd; }\n.foldedForm .creases line { stroke:none; }\n";
  function vkXML$2 (text, step) {
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
  let DOMParser$2 = (typeof window === "undefined" || window === null)
    ? undefined
    : window.DOMParser;
  if (typeof DOMParser$2 === "undefined" || DOMParser$2 === null) {
    DOMParser$2 = require("xmldom").DOMParser;
  }
  let XMLSerializer$2 = (typeof window === "undefined" || window === null)
    ? undefined
    : window.XMLSerializer;
  if (typeof XMLSerializer$2 === "undefined" || XMLSerializer$2 === null) {
    XMLSerializer$2 = require("xmldom").XMLSerializer;
  }
  let document$2 = (typeof window === "undefined" || window === null)
    ? undefined
    : window.document;
  if (typeof document$2 === "undefined" || document$2 === null) {
    document$2 = new DOMParser$2()
      .parseFromString("<!DOCTYPE html><title>a</title>", "text/html");
  }
  const svgNS$3 = "http://www.w3.org/2000/svg";
  const shadowFilter = function (id_name = "shadow") {
    const defs = document$2.createElementNS(svgNS$3, "defs");
    const filter = document$2.createElementNS(svgNS$3, "filter");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    filter.setAttribute("id", id_name);
    const blur = document$2.createElementNS(svgNS$3, "feGaussianBlur");
    blur.setAttribute("in", "SourceAlpha");
    blur.setAttribute("stdDeviation", "0.005");
    blur.setAttribute("result", "blur");
    const offset = document$2.createElementNS(svgNS$3, "feOffset");
    offset.setAttribute("in", "blur");
    offset.setAttribute("result", "offsetBlur");
    const flood = document$2.createElementNS(svgNS$3, "feFlood");
    flood.setAttribute("flood-color", "#000");
    flood.setAttribute("flood-opacity", "0.3");
    flood.setAttribute("result", "offsetColor");
    const composite = document$2.createElementNS(svgNS$3, "feComposite");
    composite.setAttribute("in", "offsetColor");
    composite.setAttribute("in2", "offsetBlur");
    composite.setAttribute("operator", "in");
    composite.setAttribute("result", "offsetBlur");
    const merge = document$2.createElementNS(svgNS$3, "feMerge");
    const mergeNode1 = document$2.createElementNS(svgNS$3, "feMergeNode");
    const mergeNode2 = document$2.createElementNS(svgNS$3, "feMergeNode");
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
    if (graph["re:diagrams"] === undefined) { return; }
    if (graph["re:diagrams"].length === 0) { return; }
    Array.from(graph["re:diagrams"]).forEach((instruction) => {
      if ("re:diagram_lines" in instruction === true) {
        instruction["re:diagram_lines"].forEach((crease) => {
          const creaseClass = ("re:diagram_line_classes" in crease)
            ? crease["re:diagram_line_classes"].join(" ")
            : "valley";
          const pts = crease["re:diagram_line_coords"];
          if (pts !== undefined) {
            const l = line$1(pts[0][0], pts[0][1], pts[1][0], pts[1][1]);
            l.setAttribute("class", creaseClass);
            renderGroup.appendChild(l);
          }
        });
      }
      if ("re:diagram_arrows" in instruction === true) {
        const r = bounding_rect$1(graph);
        const vmin = r[2] > r[3] ? r[3] : r[2];
        const prefs = {
          length: vmin * 0.09,
          width: vmin * 0.035,
          strokeWidth: vmin * 0.02,
        };
        instruction["re:diagram_arrows"].forEach((arrowInst) => {
          if (arrowInst["re:diagram_arrow_coords"].length === 2) {
            const p = arrowInst["re:diagram_arrow_coords"];
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
            prefs.side = side;
            const arrow = arcArrow$1(p[0], p[1], prefs);
            renderGroup.appendChild(arrow);
          }
        });
      }
    });
  }
  const DISPLAY_NAME = {
    vertices: "vertices",
    edges: "creases",
    faces: "faces",
    boundaries: "boundaries",
  };
  function fold_to_svg (fold, options = {}) {
    const _svg = svg$1$1();
    let graph = fold;
    const groups = {
      boundaries: true,
      faces: true,
      edges: true,
      vertices: false,
    };
    const o = {
      width: options.width || "500px",
      height: options.height || "500px",
      style: options.style || true,
      stylesheet: options.stylesheet || defaultStyle,
      shadows: options.shadows || false,
      padding: options.padding || 0,
    };
    if (options != null && options.frame != null) {
      graph = flatten_frame$1(fold, options.frame);
    }
    const file_classes = (graph.file_classes != null
      ? graph.file_classes : []).join(" ");
    const frame_classes = graph.frame_classes != null
      ? graph.frame_classes : [].join(" ");
    const top_level_classes = [file_classes, frame_classes]
      .filter(s => s !== "")
      .join(" ");
    _svg.setAttribute("class", top_level_classes);
    _svg.setAttribute("width", o.width);
    _svg.setAttribute("height", o.height);
    const styleElement = style$1();
    _svg.appendChild(styleElement);
    Object.keys(groups)
      .filter(key => groups[key] === false)
      .forEach(key => delete groups[key]);
    Object.keys(groups).forEach((key) => {
      groups[key] = group$1();
      groups[key].setAttribute("class", DISPLAY_NAME[key]);
      _svg.appendChild(groups[key]);
    });
    Object.keys(groups)
      .forEach(key => components[key](graph)
        .forEach(a => groups[key].appendChild(a)));
    if ("re:diagrams" in graph) {
      const instructionLayer = group$1();
      _svg.appendChild(instructionLayer);
      renderDiagrams(graph, instructionLayer);
    }
    if (o.shadows) {
      const shadow_id = "face_shadow";
      const filter = shadowFilter(shadow_id);
      _svg.appendChild(filter);
      Array.from(groups.faces.childNodes)
        .forEach(f => f.setAttribute("filter", `url(#${shadow_id})`));
    }
    const rect$$1 = bounding_rect$1(graph);
    setViewBox$1(_svg, ...rect$$1, o.padding);
    const vmin = rect$$1[2] > rect$$1[3] ? rect$$1[3] : rect$$1[2];
    const innerStyle = (o.style
      ? `\nsvg { --crease-width: ${vmin * 0.005}; }\n${o.stylesheet}`
      : `\nsvg { --crease-width: ${vmin * 0.005}; }\n`);
    const docu = (new DOMParser$2())
      .parseFromString("<xml></xml>", "application/xml");
    const cdata = docu.createCDATASection(innerStyle);
    styleElement.appendChild(cdata);
    const stringified = (new XMLSerializer$2()).serializeToString(_svg);
    const beautified = vkXML$2(stringified);
    return beautified;
  }
  const convert$2 = {
    components,
    toSVG: (input, options) => {
      if (typeof input === "object" && input !== null) {
        return fold_to_svg(input, options);
      }
      if (typeof input === "string" || input instanceof String) {
        try {
          const obj = JSON.parse(input);
          return fold_to_svg(obj, options);
        } catch (error) {
          throw error;
        }
      }
      return "";
    },
    toFOLD: (input, options) => {
      if (typeof input === "string") {
        const svg = (new DOMParser())
          .parseFromString(input, "text/xml").documentElement;
        return svg_to_fold(svg, options);
      }
      return svg_to_fold(input, options);
    },
  };

  const build_folded_frame = function (graph, face_stationary) {
    if (face_stationary == null) {
      face_stationary = 0;
      console.warn("build_folded_frame was not supplied a stationary face");
    }
    const faces_matrix = make_faces_matrix(graph, face_stationary);
    const vertices_coords = make_vertices_coords_folded(graph, face_stationary, faces_matrix);
    return {
      vertices_coords,
      frame_classes: ["foldedForm"],
      frame_inherit: true,
      frame_parent: 0,
      "faces_re:matrix": faces_matrix
    };
  };

  const pErr = (new window.DOMParser())
    .parseFromString("INVALID", "text/xml")
    .getElementsByTagName("parsererror")[0]
    .namespaceURI;
  const load_file = function (input, callback) {
    const type = typeof input;
    if (type === "object") {
      try {
        const fold = JSON.parse(JSON.stringify(input));
        if (fold.vertices_coords == null) {
          throw new Error("tried FOLD format, got empty object");
        }
        if (callback != null) {
          callback(fold);
        }
        return fold;
      } catch (err) {
        if (input instanceof Element) {
          convert$2.toFOLD(input, (fold) => {
            if (callback != null) { callback(fold); }
          });
          return;
        }
      }
    }
    if (type === "string" || input instanceof String) {
      try {
        let fold = JSON.parse(input);
        if (callback != null) { callback(fold); }
      } catch (err) {
        let xml = (new window.DOMParser()).parseFromString(input, "text/xml");
        if (xml.getElementsByTagNameNS(pErr, "parsererror").length === 0) {
          let parsedSVG = xml.documentElement;
          convert$2.toFOLD(parsedSVG, (fold) => {
            if (callback != null) { callback(fold); }
          });
          return;
        }
        let extension = input.substr((input.lastIndexOf(".") + 1));
        switch (extension) {
          case "fold":
            fetch(input)
              .then(response => response.json())
              .then((data) => {
                if (callback != null) { callback(data); }
              });
            break;
          case "svg":
            load(input, (svg$$1) => {
              convert$2.toFOLD(input, (fold) => {
                if (callback != null) { callback(fold); }
              });
            });
            break;
          case "oripa":
            break;
          default: break;
        }
      }
    }
  };

  const DEFAULTS = Object.freeze({
    autofit: true,
    debug: false,
    folding: false,
    padding: 0,
    shadows: false,
    labels: false,
    diagram: false,
    styleSheet: undefined,
    arrowColor: undefined,
  });
  const DISPLAY_NAME$1 = {
    vertices: "vertices",
    edges: "creases",
    faces: "faces",
    boundaries: "boundaries",
  };
  const drawComponent = {
    vertices: convert$2.components.vertices,
    edges: convert$2.components.edges,
    faces: convert$2.components.faces,
    boundaries: convert$2.components.boundaries,
  };
  const shadowFilter$1 = function (id_name = "shadow") {
    const svgNS = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(svgNS, "defs");
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    filter.setAttribute("id", id_name);
    const blur = document.createElementNS(svgNS, "feGaussianBlur");
    blur.setAttribute("in", "SourceAlpha");
    blur.setAttribute("stdDeviation", "0.01");
    blur.setAttribute("result", "blur");
    const offset = document.createElementNS(svgNS, "feOffset");
    offset.setAttribute("in", "blur");
    offset.setAttribute("result", "offsetBlur");
    const flood = document.createElementNS(svgNS, "feFlood");
    flood.setAttribute("flood-color", "#000");
    flood.setAttribute("flood-opacity", "0.4");
    flood.setAttribute("result", "offsetColor");
    const composite = document.createElementNS(svgNS, "feComposite");
    composite.setAttribute("in", "offsetColor");
    composite.setAttribute("in2", "offsetBlur");
    composite.setAttribute("operator", "in");
    composite.setAttribute("result", "offsetBlur");
    const merge = document.createElementNS(svgNS, "feMerge");
    const mergeNode1 = document.createElementNS(svgNS, "feMergeNode");
    const mergeNode2 = document.createElementNS(svgNS, "feMergeNode");
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
  const parsePreferences = function (...args) {
    const keys = Object.keys(DEFAULTS);
    const prefs = {};
    Array(...args)
      .filter(obj => typeof obj === "object")
      .forEach(obj => Object.keys(obj)
        .filter(key => keys.includes(key))
        .forEach((key) => { prefs[key] = obj[key]; }));
    return prefs;
  };
  function Origami (...args) {
    const _this = image(...args);
    _this.appendChild(shadowFilter$1("faces_shadow"));
    const groups = {};
    ["boundaries", "faces", "edges", "vertices"].forEach((key) => {
      groups[key] = _this.group();
      groups[key].setAttribute("class", DISPLAY_NAME$1[key]);
      groups[key].setAttribute("pointer-events", "none");
      _this.appendChild(groups[key]);
    });
    groups.diagram = _this.group();
    const visible = {
      boundaries: true,
      faces: true,
      edges: true,
      vertices: false,
    };
    const groupLabels = _this.group();
    const prop = {
      cp: undefined,
      frame: undefined,
      style: {
        vertex_radius: 0.01,
      },
    };
    const preferences = {};
    Object.assign(preferences, DEFAULTS);
    const userDefaults = parsePreferences(...args);
    Object.keys(userDefaults)
      .forEach((key) => { preferences[key] = userDefaults[key]; });
    const setCreasePattern = function (cp, frame = undefined) {
      prop.cp = (cp.__rabbit_ear != null)
        ? cp
        : CreasePattern(cp);
      prop.frame = frame;
      draw();
      if (!preferences.autofit) { updateViewBox(); }
      prop.cp.onchange.push(draw);
    };
    const draw = function () {
      const graph = prop.frame
        ? flatten_frame(prop.cp, prop.frame)
        : prop.cp;
      const file_classes = (graph.file_classes != null
        ? graph.file_classes : []).join(" ");
      const frame_classes = graph.frame_classes != null
        ? graph.frame_classes : [].join(" ");
      const top_level_classes = [file_classes, frame_classes]
        .filter(s => s !== "")
        .join(" ");
      _this.setAttribute("class", top_level_classes);
      Object.keys(groups).forEach(key => groups[key].removeChildren());
      groupLabels.removeChildren();
      Object.keys(groups)
        .filter(key => visible[key])
        .forEach(key => drawComponent[key](graph)
          .forEach(o => groups[key].appendChild(o)));
      if (preferences.debug) { drawDebug(graph); }
      if (preferences.labels) { drawLabels(graph); }
      if (preferences.autofit) { updateViewBox(); }
      if (preferences.diagram) { drawDiagram(graph); }
      if (preferences.shadows) {
        Array.from(groups.faces.childNodes).forEach(f =>
          f.setAttribute("filter", "url(#faces_shadow)"));
      }
      let styleElement = _this.querySelector("style");
      if (styleElement == null) {
        const svgNS = "http://www.w3.org/2000/svg";
        styleElement = document.createElementNS(svgNS, "style");
        _this.appendChild(styleElement);
      }
      const r = bounding_rect(graph);
      const vmin = r[2] > r[3] ? r[3] : r[2];
      const creaseStyle = `stroke-width:${vmin * 0.01}`;
      styleElement.innerHTML = `.creases line {${creaseStyle}}`;
      if (preferences.styleSheet) {
        styleElement.innerHTML += preferences.styleSheet;
      }
    };
    const drawLabels = function (graph) {
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
        .map((c, i) => groupLabels.text(`${i}`, c[0] - m[0], c[1] + m[1]))
        .forEach(t => t.setAttribute("style", labels_style.vertices));
      graph.edges_vertices
        .map(ev => ev.map(v => graph.vertices_coords[v]))
        .map(verts => math$1.core.average(verts))
        .map((c, i) => groupLabels.text(`${i}`, c[0] - m[0], c[1] + m[1]))
        .forEach(t => t.setAttribute("style", labels_style.edges));
      graph.faces_vertices
        .map(fv => fv.map(v => graph.vertices_coords[v]))
        .map(verts => math$1.core.average(verts))
        .map((c, i) => groupLabels.text(`${i}`, c[0] - m[0], c[1] + m[1]))
        .forEach(t => t.setAttribute("style", labels_style.faces));
    };
    const drawDebug = function (graph) {
      const r = bounding_rect(graph);
      const vmin = r[2] > r[3] ? r[3] : r[2];
      const strokeW = vmin * 0.005;
      const debug_style = {
        faces_vertices: `fill:#555;stroke:none;stroke-width:${strokeW};`,
        faces_edges: `fill:#aaa;stroke:none;stroke-width:${strokeW};`,
      };
      graph.faces_vertices
        .map(fv => fv.map(v => graph.vertices_coords[v]))
        .map(face => math$1.convexPolygon(face).scale(0.666).points)
        .map(points => groupLabels.polygon(points))
        .forEach(poly => poly.setAttribute("style", debug_style.faces_vertices));
      graph.faces_edges
        .map(face_edges => face_edges
          .map(edge => graph.edges_vertices[edge])
          .map((vi, i, arr) => {
            const next = arr[(i + 1) % arr.length];
            return (vi[1] === next[0] || vi[1] === next[1] ? vi[0] : vi[1]);
          }).map(v => graph.vertices_coords[v]))
        .map(face => math$1.convexPolygon(face).scale(0.333).points)
        .map(points => groupLabels.polygon(points))
        .forEach(poly => poly.setAttribute("style", debug_style.faces_edges));
    };
    const drawDiagram = function (graph) {
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
          .map(p => {
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
            let prefs = {
              side,
              length: vmin*0.09,
              width: vmin*0.035,
              strokeWidth: vmin*0.02,
            };
            if (preferences.arrowColor) { prefs.color = preferences.arrowColor;}
            return groups.diagram.arcArrow(p[0], p[1], prefs);
          })
        );
    };
    const updateViewBox = function () {
      const graph = prop.frame
        ? flatten_frame(prop.cp, prop.frame)
        : prop.cp;
      const r = bounding_rect(graph);
      const vmin = r[2] > r[3] ? r[3] : r[2];
      setViewBox(_this, r[0], r[1], r[2], r[3], preferences.padding * vmin);
    };
    const nearest = function (...methodArgs) {
      const p = math$1.vector(methodArgs);
      const plural = { vertex: "vertices", edge: "edges", face: "faces" };
      const nears = {
        vertex: prop.cp.nearestVertex,
        edge: prop.cp.nearestEdge,
        face: prop.cp.nearestFace,
      };
      Object.keys(nears)
        .forEach((key) => { nears[key] = nears[key].apply(prop.cp, p); });
      Object.keys(nears)
        .filter(key => nears[key] !== undefined)
        .forEach((key) => {
          nears[key].svg = groups[plural[key]].childNodes[nears[key].index];
        });
      return nears;
    };
    const getVertices = function () {
      const { vertices } = prop.cp;
      vertices.forEach((v, i) => { v.svg = groups.vertices.childNodes[i]; });
      Object.defineProperty(vertices, "visible", {
        get: () => visible.vertices,
        set: (v) => { visible.vertices = !!v; draw(); },
      });
      return vertices;
    };
    const getEdges = function () {
      const { edges } = prop.cp;
      edges.forEach((v, i) => { v.svg = groups.edges.childNodes[i]; });
      Object.defineProperty(edges, "visible", {
        get: () => visible.creases,
        set: (v) => { visible.creases = !!v; draw(); },
      });
      return edges;
    };
    const getFaces = function () {
      const { faces } = prop.cp;
      const sortedFaces = Array.from(groups.faces.childNodes).slice()
        .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));
      faces.forEach((v, i) => { v.svg = sortedFaces[i]; });
      Object.defineProperty(faces, "visible", {
        get: () => visible.faces,
        set: (v) => { visible.faces = !!v; draw(); },
      });
      return faces;
    };
    const getBoundary = function () {
      const graph = prop.frame
        ? flatten_frame(prop.cp, prop.frame)
        : prop.cp;
      return math$1.polygon(get_boundary$1(graph).vertices
        .map(v => graph.vertices_coords[v]));
    };
    const load$$1 = function (input, callback) {
      load_file(input, (fold) => {
        setCreasePattern(CreasePattern(fold));
        if (callback != null) { callback(); }
      });
    };
    const fold = function (face) {
      if (prop.cp.file_frames != null
        && prop.cp.file_frames.length > 0
        && prop.cp.file_frames[0]["faces_re:matrix"] != null
        && prop.cp.file_frames[0]["faces_re:matrix"].length
          === prop.cp.faces_vertices.length) ; else {
        if (face == null) { face = 0; }
        const file_frame = build_folded_frame(prop.cp, face);
        if (prop.cp.file_frames == null) { prop.cp.file_frames = []; }
        prop.cp.file_frames.unshift(file_frame);
      }
      prop.frame = 1;
      draw();
    };
    const foldWithoutLayering = function (face) {
      const folded = {};
      folded.frame_classes = ["foldedForm"];
      folded.vertices_coords = make.make_vertices_coords_folded(prop.cp, face);
      setCreasePattern(CreasePattern(folded));
      Array.from(groups.faces.children).forEach(f => f.setClass("face"));
    };
    Object.defineProperty(_this, "frames", {
      get: () => {
        if (prop.cp.file_frames === undefined) {
          return [JSON.parse(JSON.stringify(prop.cp))];
        }
        const frameZero = JSON.parse(JSON.stringify(prop.cp));
        delete frameZero.file_frames;
        const frames = JSON.parse(JSON.stringify(prop.cp.file_frames));
        return [frameZero].concat(frames);
      },
    });
    Object.defineProperty(_this, "frame", {
      get: () => prop.frame,
      set: (newValue) => {
        prop.frame = newValue;
        draw();
      },
    });
    Object.defineProperty(_this, "export", { value: () => {
      let svg$$1 = _this.cloneNode(true);
      svg$$1.setAttribute("x", "0px");
      svg$$1.setAttribute("y", "0px");
      svg$$1.setAttribute("width", "600px");
      svg$$1.setAttribute("height", "600px");
      return save(svg$$1, ...arguments);
    }});
    Object.defineProperty(_this, "cp", {
      get: () => prop.cp,
      set: (cp) => { setCreasePattern(cp); },
    });
    Object.defineProperty(_this, "frameCount", {
      get: () => (prop.cp.file_frames ? prop.cp.file_frames.length : 0),
    });
    let cpSharedMethods = ["crease"];
    cpSharedMethods.forEach(method => Object.defineProperty(_this, method, {
      value: () => prop.cp[method](...arguments),
    }));
    Object.defineProperty(_this, "nearest", { value: nearest });
    Object.defineProperty(_this, "vertices", {
      get: () => getVertices(),
    });
    Object.defineProperty(_this, "edges", {
      get: () => getEdges(),
    });
    Object.defineProperty(_this, "faces", {
      get: () => getFaces(),
    });
    Object.defineProperty(_this, "boundary", {
      get: () => getBoundary(),
    });
    Object.defineProperty(_this, "draw", { value: draw });
    Object.defineProperty(_this, "fold", { value: fold });
    Object.defineProperty(_this, "foldWithoutLayering", {
      value: foldWithoutLayering,
    });
    Object.defineProperty(_this, "load", { value: load$$1 });
    Object.defineProperty(_this, "folded", {
      set: (f) => {
        prop.cp.frame_classes = prop.cp.frame_classes
          .filter(a => a !== "creasePattern");
        prop.cp.frame_classes = prop.cp.frame_classes
          .filter(a => a !== "foldedForm");
        prop.cp.frame_classes.push(f ? "foldedForm" : "creasePattern");
        draw();
      },
    });
    Object.defineProperty(_this, "updateViewBox", { value: updateViewBox });
    _this.preferences = preferences;
    setCreasePattern(CreasePattern(...arguments), 1);
    let prevCP, prevCPFolded, touchFaceIndex;
    _this.events.addEventListener("onMouseDown", function (mouse) {
      if (preferences.folding) {
        try {
          prevCP = JSON.parse(JSON.stringify(prop.cp));
          if (prop.frame == null
            || prop.frame === 0
            || prevCP.file_frames == null) {
            let file_frame = build_folded_frame(prevCP, 0);
            if (prevCP.file_frames == null) { prevCP.file_frames = []; }
            prevCP.file_frames.unshift(file_frame);
          }
          prevCPFolded = flatten_frame(prevCP, 1);
          let faces_containing = faces_containing_point(prevCPFolded, mouse);
          let top_face = topmost_face$1(prevCPFolded, faces_containing);
          touchFaceIndex = (top_face == null)
            ? 0
            : top_face;
        } catch(error) {
          console.warn("problem loading the last fold step", error);
        }
      }
    });
    _this.events.addEventListener("onMouseMove", function (mouse) {
      if (preferences.folding && mouse.isPressed) {
        prop.cp = CreasePattern(prevCP);
        let points = [math$1.vector(mouse.pressed), math$1.vector(mouse.position)];
        let midpoint = points[0].midpoint(points[1]);
        let vector = points[1].subtract(points[0]);
        prop.cp.valleyFold(midpoint, vector.rotateZ90(), touchFaceIndex);
        fold();
      }
    });
    return _this;
  }

  const unitSquare = {"file_spec":1.1,"file_creator":"","file_author":"","file_classes":["singleModel"],"frame_title":"","frame_attributes":["2D"],"frame_classes":["creasePattern"],"vertices_coords":[[0,0],[1,0],[1,1],[0,1]],"vertices_vertices":[[1,3],[2,0],[3,1],[0,2]],"vertices_faces":[[0],[0],[0],[0]],"edges_vertices":[[0,1],[1,2],[2,3],[3,0]],"edges_faces":[[0],[0],[0],[0]],"edges_assignment":["B","B","B","B"],"edges_foldAngle":[0,0,0,0],"edges_length":[1,1,1,1],"faces_vertices":[[0,1,2,3]],"faces_edges":[[0,1,2,3]]};
  function View3D(){
    let args = Array.from(arguments);
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
    prop.cp = args.filter(arg =>
      typeof arg == "object" && arg.vertices_coords != undefined
    ).shift();
    if(prop.cp == undefined){ prop.cp = CreasePattern(unitSquare); }
    function bootThreeJS(domParent){
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
      var render = function(){
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        controls.update();
      };
      render();
      draw();
    }
    const attachToDOM = function(){
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
      if(numbers.length >= 2);
      if(functions.length >= 1){
        functions[0]();
      }
    };
    if(document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachToDOM);
    } else {
      attachToDOM();
    }
    function draw(){
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
    const load = function(input, callback) {
      load_file(input, function(fold) {
        setCreasePattern( CreasePattern(fold) );
        if (callback != null) { callback(); }
      });
    };
    return {
      set cp(c){
        setCreasePattern(c);
        draw();
      },
      get cp(){
        return prop.cp;
      },
      draw,
      load,
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
    function foldFileToThreeJSFaces(foldFile, material){
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
      if(material == undefined){ material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide}); }
      return new THREE.Mesh(geometry, material);
    }
    function crossVec3(a,b){
      return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
      ];
    }
    function magVec3(v){
      return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2) + Math.pow(v[2],2));
    }
    function normalizeVec3(v){
      let mag = Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2) + Math.pow(v[2],2));
      return [v[0] / mag, v[1] / mag, v[2] / mag];
    }
    function scaleVec3(v, scale){
      return [v[0]*scale, v[1]*scale, v[2]*scale];
    }
    function cylinderEdgeVertices(edge, radius){
      let vec = [edge[1][0] - edge[0][0], edge[1][1] - edge[0][1], edge[1][2] - edge[0][2]];
      let mag = Math.sqrt(Math.pow(vec[0],2) + Math.pow(vec[1],2) + Math.pow(vec[2],2));
      if(mag < 1e-10){ throw "degenerate edge"; }
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
      for(var i = 1; i < 4; i++){
        rotated.push(normalizeVec3(crossVec3(rotated[i-1], normalized)));
      }
      let dirs = rotated.map(v => scaleVec3(v, radius));
      return edge
        .map(v => dirs.map(dir => [v[0]+dir[0], v[1]+dir[1], v[2]+dir[2]]))
        .reduce((prev,curr) => prev.concat(curr), []);
    }
    function foldFileToThreeJSLines(foldFile, scale=0.002){
      let edges = foldFile.edges_vertices.map(ev => ev.map(v => foldFile.vertices_coords[v]));
      edges.forEach(edge => {
        if(edge[0][2] == undefined){ edge[0][2] = 0; }
        if(edge[1][2] == undefined){ edge[1][2] = 0; }
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
        if(mag < 1e-10){ throw "degenerate edge"; }
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
  const GraphNode = function (graph) {
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
  const GraphEdge = function (graph, node1, node2) {
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
      node: GraphNode,
      edge: GraphEdge
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

  const test_axiom1_2 = function (axiom_frame, poly) {
    const { points } = axiom_frame.parameters;
    return math$1.core.point_in_convex_poly(points[0], poly)
      && math$1.core.point_in_convex_poly(points[1], poly);
  };
  const test_axiom3 = function (axiom_frame, poly) {
    const Xing = math$1.core.intersection;
    const { lines } = axiom_frame.parameters;
    const a = Xing.convex_poly_line(poly, lines[0][0], lines[0][1]);
    const b = Xing.convex_poly_line(poly, lines[1][0], lines[1][1]);
    return a !== undefined && b !== undefined;
  };
  const test_axiom4 = function (axiom_frame, poly) {
    const params = axiom_frame.parameters;
    const overlap = math$1.core.intersection.line_line(
      params.lines[0][0], params.lines[0][1],
      params.points[0], [params.lines[0][1][1], -params.lines[0][1][0]],
    );
    if (overlap === undefined) { return false; }
    return math$1.core.point_in_convex_poly(overlap, poly)
      && math$1.core.point_in_convex_poly(params.points[0], poly);
  };
  const test_axiom5 = function (axiom_frame, poly) {
    return true;
  };
  const test_axiom6 = function (axiom_frame, poly) {
    return true;
  };
  const test_axiom7 = function (axiom_frame, poly) {
    if (axiom_frame.solutions.length === 0) { return false; }
    const solution = axiom_frame.solutions[0];
    const params = axiom_frame.parameters;
    const m = math$1.core.make_matrix2_reflection(solution[1], solution[0]);
    const reflected = math$1.core.multiply_vector2_matrix2(params.points[0], m);
    const intersect = math$1.core.intersection.line_line(
      params.lines[1][0], params.lines[1][1],
      solution[0], solution[1],
    );
    axiom_frame.test = {
      points_reflected: [reflected],
    };
    return math$1.core.point_in_convex_poly(reflected, poly)
      && math$1.core.point_in_convex_poly(intersect, poly);
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
  const apply_axiom = function (axiom_frame, poly) {
    axiom_frame.valid = test[axiom_frame.axiom].call(null, axiom_frame, poly);
    const polyobject = math$1.polygon(poly);
    axiom_frame.valid_solutions = (axiom_frame.valid
      ? axiom_frame.solutions.map(s => polyobject.clipLine(s))
      : []);
    return axiom_frame;
  };
  const make_axiom_frame = function (axiom, parameters, solutions) {
    const solution = {
      axiom,
      parameters,
      solutions,
    };
    Object.defineProperty(solution, "apply", {
      value: (...args) => apply_axiom(solution, ...args)
    });
    return solution;
  };

  const axiom1 = function (pointA, pointB) {
    const p0 = math$1.core.get_vector(pointA);
    const p1 = math$1.core.get_vector(pointB);
    const vec = p0.map((_, i) => p1[i] - p0[i]);
    const solution = [p0, vec];
    return make_axiom_frame(1, { points: [p0, p1] }, [solution]);
  };
  const axiom2 = function (a, b) {
    const mid = math$1.core.midpoint2(a, b);
    const vec = math$1.core.normalize(a.map((_, i) => b[i] - a[i]));
    const solution = [mid, [vec[1], -vec[0]]];
    return make_axiom_frame(2, { points: [a, b] }, [solution]);
  };
  const axiom3 = function (pointA, vectorA, pointB, vectorB) {
    const parameters = { lines: [[pointA, vectorA], [pointB, vectorB]] };
    const solutions = math$1.core.bisect_lines2(pointA, vectorA, pointB, vectorB);
    return make_axiom_frame(3, parameters, solutions);
  };
  const axiom4 = function (pointA, vectorA, pointB) {
    const norm = math$1.core.normalize(vectorA);
    const solution = [[...pointB], [norm[1], -norm[0]]];
    const parameters = { points: [pointB], lines: [[pointA, vectorA]] };
    return make_axiom_frame(4, parameters, [solution]);
  };
  const axiom5 = function (pointA, vectorA, pointB, pointC) {
    const pA = math$1.core.get_vector(pointA);
    const vA = math$1.core.get_vector(vectorA);
    const pB = math$1.core.get_vector(pointB);
    const pC = math$1.core.get_vector(pointC);
    const radius = Math.sqrt(((pB[0] - pC[0]) ** 2) + ((pB[1] - pC[1]) ** 2));
    const pA2 = [pA[0] + vA[0], pA[1] + vA[1]];
    const sect = math$1.core.intersection.circle_line(pB, radius, pA, pA2) || [];
    const solutions = sect.map((s) => {
      const mid = math$1.core.midpoint2(pC, s);
      const vec = math$1.core.normalize(s.map((_, i) => s[i] - pC[i]));
      return [mid, [vec[1], -vec[0]]];
    });
    const parameters = { points: [pB, pC], lines: [[pA, vA]] };
    return make_axiom_frame(5, parameters, solutions);
  };
  const axiom7 = function (pointA, vectorA, pointB, vectorB, pointC) {
    const pA = math$1.core.get_vector(pointA);
    const pB = math$1.core.get_vector(pointB);
    const pC = math$1.core.get_vector(pointC);
    const vA = math$1.core.get_vector(vectorA);
    const vB = math$1.core.get_vector(vectorB);
    const parameters = { points: [pC], lines: [[pA, vA], [pB, vB]] };
    const sect = math$1.core.intersection.line_line(pA, vA, pC, vB);
    if (sect === undefined) {
      return make_axiom_frame(7, parameters, []);
    }
    const mid = math$1.core.midpoint2(pC, sect);
    const vec = math$1.core.normalize(pC.map((_, i) => sect[i] - pC[i]));
    const solution = [mid, [-vec[1], vec[0]]];
    return make_axiom_frame(7, parameters, [solution]);
  };
  const cuberoot = function (x) {
    var y = Math.pow(Math.abs(x), 1 / 3);
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
      var D = b * b - 4 * a * c;
      if (Math.abs(D) < 1e-8) {
        return [-b / (2 * a)];
      } else if (D > 0) {
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
      var D = q * q / 4 + p * p * p / 27;
      if (Math.abs(D) < 1e-8) {
        roots = [-1.5 * q / p, 3 * q / p];
      } else if (D > 0) {
        var u = cuberoot(-q / 2 - Math.sqrt(D));
        roots = [u - p / (3 * u)];
      } else {
        var u = 2*Math.sqrt(-p/3);
        var t = Math.acos(3*q/p/u)/3;
        var k = 2*Math.PI/3;
        roots = [u*Math.cos(t), u*Math.cos(t-k), u*Math.cos(t-2*k)];
      }
    }
    for (var i = 0; i < roots.length; i++){
      roots[i] -= b/(3*a);
    }
    return roots;
  };
  const axiom6 = function (pointA, vecA, pointB, vecB, pointC, pointD) {
    var p1 = pointC[0];
    var q1 = pointC[1];
    if (Math.abs(vecA[0]) > math$1.core.EPSILON) {
      var m1 = vecA[1] / vecA[0];
      var h1 = pointA[1] - m1 * pointA[0];
    }
    else {
      var k1 = pointA[0];
    }
    var p2 = pointD[0];
    var q2 = pointD[1];
    if (Math.abs(vecB[0]) > math$1.core.EPSILON) {
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
    return make_axiom_frame(6, parameters, solutions);
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
    let pA = math$1.core.get_vector(pointA);
    let pB = math$1.core.get_vector(pointB);
    let pC = math$1.core.get_vector(pointC);
    let pD = math$1.core.get_vector(pointD);
    let vA = math$1.core.get_vector(vecA);
    let vB = math$1.core.get_vector(vecB);
    let p1 = pC;
    let l1 = math$1.line(pA, vA);
    let u1 = [-vA[1], vA[0]];
    let d1 = l1.nearestPoint(0,0).magnitude;
    let p2 = pD;
    let l2 = math$1.line(pB, vB);
    let u2 = [-vB[1], vB[0]];
    let d2 = l2.nearestPoint(0,0).magnitude;
    if (math$1.core.dot(u1,l1.nearestPoint(0,0)) < 0) {
      u1 = [vA[1], -vA[0]];
    }
    if (math$1.core.dot(u2,l2.nearestPoint(0,0)) < 0) {
      u2 = [vB[1], -vB[0]];
    }
    let u1p = [u1[1], -u1[0]];
    if (Math.abs(p1[0] - p2[0]) < math$1.core.EPSILON &&
        Math.abs(p1[1] - p2[1]) < math$1.core.EPSILON) { return; }
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
        let c1 = math$1.core.dot(p2, u2) - d2;
        let c2 = math$1.core.dot(v2, u1p) * 2;
        let c3 = math$1.core.dot(v2, v2);
        let c4 = math$1.core.dot(v1.map((_,i) => v1[i]+v2[i]), u1p);
        let c5 = math$1.core.dot(v1, v2);
        let c6 = math$1.core.dot(u1p, u2);
        let c7 = math$1.core.dot(v2, u2);
        let a = c6;
        let b = c1 + c4 * c6 + c7;
        let c = c1 * c2 + c5 * c6 + c4 * c7;
        let d = c1 * c3 + c5 * c7;
        if (Math.abs(a) > math$1.core.EPSILON) { order = 3; }
        else if (Math.abs(b) > math$1.core.EPSILON) { order = 2; }
        else if (Math.abs(c) > math$1.core.EPSILON) { order = 1; }
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
            else if (Math.abs(disc) < math$1.core.EPSILON) {
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
              else if (Math.abs(D) < math$1.core.EPSILON) {
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
    let l_u = math$1.core.normalize([p1p[0]-p1[0], p1p[1]-p1[1]]);
    let l_d = math$1.core.dot(l_u, math$1.core.midpoint2(p1p, p1));
    let creasePoint = [l_d * l_u[0], l_d * l_u[1]];
    let creaseVector = [-l_u[1], l_u[0]];
    return [creasePoint, creaseVector];
  };
  const axiom = function (number, ...args) {
    switch (number) {
      case 1: return axiom1(...args);
      case 2: return axiom2(...args);
      case 3: return axiom3(...args);
      case 4: return axiom4(...args);
      case 5: return axiom5(...args);
      case 6: return axiom6(...args);
      case 7: return axiom7(...args);
      default: return undefined;
    }
  };

  var Axioms = /*#__PURE__*/Object.freeze({
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
  oripa.toFold = function(oripaStr) {
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
    xml = new DOMParser().parseFromString(oripaStr, 'text/xml');
    ref1 = children(xml.documentElement);
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

  const toFOLD = function (input, callback) {
    return load_file(input, (fold) => {
      if (callback != null) { callback(fold); }
    });
  };
  const toSVG = function (input, callback) {
    let async = false;
    const syncFold = load_file(input, () => {
      if (async) {
        convert$2.toSVG(input, (loadedSVG) => {
          if (callback != null) { callback(loadedSVG); }
        });
      }
    });
    async = true;
    if (syncFold !== undefined) {
      convert$2.toSVG(syncFold, (loadedSVG) => {
        if (callback != null) { callback(loadedSVG); }
      });
    }
  };
  const toORIPA = function (input, callback) {
    const fold = JSON.parse(JSON.stringify(input));
    return oripa.fromFold(fold);
  };



  var add = /*#__PURE__*/Object.freeze({

  });

  var axiom_instructions_data = "{\n  \"ar\": [null,\n    \"اصنع خطاً يمر بنقطتين\",\n    \"اصنع خطاً عن طريق طي نقطة واحدة إلى أخرى\",\n    \"اصنع خطاً عن طريق طي خط واحد على آخر\",\n    \"اصنع خطاً يمر عبر نقطة واحدة ويجعل خطاً واحداً فوق نفسه\",\n    \"اصنع خطاً يمر بالنقطة الأولى ويجعل النقطة الثانية على الخط\",\n    \"اصنع خطاً يجلب النقطة الأولى إلى الخط الأول والنقطة الثانية إلى الخط الثاني\",\n    \"اصنع خطاً يجلب نقطة إلى خط ويجعل خط ثاني فوق نفسه\"\n  ],\n  \"bn\": [null,\n    \"দুটি পয়েন্ট মাধ্যমে পাস যে একটি লাইন করুন\",\n    \"অন্য একটি বিন্দু ভাঁজ দ্বারা একটি লাইন করা\",\n    \"অন্য একটি লাইন ভাঁজ দ্বারা একটি লাইন করুন\",\n    \"একটি বিন্দু যা এক বিন্দু দিয়ে পাস করে এবং নিজের উপরে একটি লাইন এনে দেয়।\",\n    \"প্রথম বিন্দু দিয়ে পাস করে এমন ক্রিজ তৈরি করুন এবং লাইনের দ্বিতীয় বিন্দুটি এনে দিন।\",\n    \"একটি ক্রিজ তৈরি করুন যা প্রথম লাইনের প্রথম বিন্দু এবং দ্বিতীয় লাইনের দ্বিতীয় বিন্দুটি নিয়ে আসে।\",\n    \"একটি ক্রিজ তৈরি করুন যা একটি লাইনে একটি বিন্দু নিয়ে আসে এবং নিজের উপরে দ্বিতীয় লাইন এনে।\"\n  ],\n  \"de\": [null,\n    \"eine Falte machen, die durch zwei Punkte verläuft\",\n    \"eine Falte machen, indem man einen Punkt zu einem anderen faltet\",\n    \"eine Falte durch Falten einer Linie auf eine andere herstellen\",\n    \"eine Falte machen, die durch einen Punkt geht und eine Linie auf sich selbst bringt\",\n    \"eine Falte machen, die durch den ersten Punkt verläuft und den zweiten Punkt auf die Linie bringt\",\n    \"eine Falte machen, die den ersten Punkt auf die erste Linie und den zweiten Punkt auf die zweite Linie bringt\",\n    \"eine Falte machen, die einen Punkt auf eine Linie bringt und eine zweite Linie auf sich selbst bringt\"\n  ],\n  \"de-google\": [null,\n    \"machen Sie eine Falte, die durch zwei Punkte geht\",\n    \"machen Sie eine Falte, indem Sie einen Punkt auf einen anderen falten\",\n    \"machen Sie eine Falte, indem Sie eine Linie auf eine andere falten\",\n    \"machen Sie eine Falte, die durch einen Punkt verläuft und eine Linie auf sich zieht\",\n    \"machen Sie eine Falte, die durch den ersten Punkt verläuft und den zweiten Punkt auf die Linie bringt\",\n    \"machen Sie eine Falte, die den ersten Punkt auf die erste Linie und den zweiten Punkt auf die zweite Linie bringt\",\n    \"machen Sie eine Falte, die einen Punkt auf eine Linie und eine zweite Linie auf sich bringt\"\n  ],\n  \"el\": [null,\n    \"Κάντε μια πτυχή που περνά μέσα από δύο σημεία\",\n    \"Κάντε μια πτυχή διπλώνοντας ένα σημείο στο άλλο\",\n    \"Κάντε μια πτυχή διπλώνοντας μια γραμμή επάνω στην άλλη\",\n    \"Κάντε μια πτυχή που περνάει μέσα από ένα σημείο και φέρνει μια γραμμή στην κορυφή του\",\n    \"Κάντε μια πτυχή που διέρχεται από το πρώτο σημείο και φέρνει το δεύτερο σημείο στη γραμμή\",\n    \"Κάντε μια πτυχή που φέρνει το πρώτο σημείο στην πρώτη γραμμή και το δεύτερο σημείο στη δεύτερη γραμμή\",\n    \"Κάντε μια πτυχή που φέρνει ένα σημείο σε μια γραμμή και φέρνει μια δεύτερη γραμμή πάνω από τον εαυτό της\"\n  ],\n  \"en\": [null,\n    \"make a crease that passes through two points\",\n    \"make a crease by bringing one point onto another\",\n    \"make a crease by bringing one line onto another\",\n    \"make a crease that passes through a point and brings a line on top of itself\",\n    \"make a crease that passes through a point and brings another point onto a line\",\n    \"make a crease that brings the first point to the first line and the second point to the second line\",\n    \"make a crease that brings a point to a line and brings a second line on top of itself\"\n  ],\n  \"es\": [null,\n    \"haga un pliegue que pase por dos puntos\",\n    \"haga un pliegue doblando un punto sobre otro\",\n    \"haga un pliegue doblando una línea sobre otra\",\n    \"hacer un pliegue que pase a través de un punto y traiga una línea encima de sí mismo\",\n    \"haga un pliegue que pase por el primer punto y lleve el segundo punto a la línea\",\n    \"haga un pliegue que lleve el primer punto a la primera línea y el segundo punto a la segunda línea\",\n    \"hacer un pliegue que traiga un punto a una línea y traiga una segunda línea encima de sí mismo\"\n  ],\n  \"es-google\": [null,\n    \"hacer un pliegue que pase por dos puntos\",\n    \"hacer un pliegue doblando un punto a otro\",\n    \"haz un pliegue doblando una línea sobre otra\",\n    \"haz un pliegue que pase a través de un punto y traiga una línea encima de sí misma\",\n    \"haz un pliegue que pase por el primer punto y traiga el segundo punto a la línea\",\n    \"haz un pliegue que traiga el primer punto a la primera línea y el segundo a la segunda línea\",\n    \"hacer un pliegue que traiga un punto a una línea y una segunda línea encima de sí misma\"\n  ],\n  \"fa\": [null,\n    \"برای دو نقطه داده شده p۱ و p۲، تنها یک تا وجود دارد که از هر دو نقطه عبور کند\",\n    \"برای دو نقطه داده شده p۱ و p۲، تنها یک تا وجود دارد که p۱ را برp۲ تصویر کند\",\n    \"برای دو خط داده شده l۱ و l۲ تایی وجود دارد که دو خط را روی هم تصویر کند\",\n    \".برای نقطه داده شده p۱ و خط L۱، تنها یک تای عمود بر L۱ وجود دارد که از p۱ میگذرد\",\n    \".برای نقاط داده شده p۱ و p۲ و خط L۱، تایی وجود دارد که p۱ را بر خط L۱ تصویر می‌کند و از نقطه p۲ نیز می‌گذرد\",\n    \".برای نقاط داده شده p۱ و p۲ و خطوط L۱ و L۲، تایی وجود دارد که p۱را بر L۱ و p۲ را بر L۲ تصویر کند\",\n    \".برای نقطه داده شده p و خطوط L۱ و L۲ تایی وجود دارد که p را بر L۱ تصویر کرده و عمود بر L۲ باشد\"\n  ],\n  \"fi\": [null,\n    \"tee taivutus, joka kulkee kahden pisteen läpi\",\n    \"taivuta taittamalla yksi piste toiseen\",\n    \"leikkaa taittamalla yksi viiva toiseen\",\n    \"tee piste, joka kulkee yhden pisteen läpi ja tuo yhden rivin päälle\",\n    \"tee särmäys, joka kulkee ensimmäisen pisteen läpi ja tuo toisen pisteen viivaan\",\n    \"tee rypytys, joka tuo ensimmäisen pisteen ensimmäiselle riville ja toinen piste toiselle riville\",\n    \"tee taivutus, joka tuo pisteen viivaan ja tuo toisen rivin päälle\"\n  ],\n  \"fr\":[null,\n    \"faire un pli qui passe par deux points\",\n    \"faire un pli en pliant une pointe à l'autre\",\n    \"faire un pli en pliant une ligne sur l'autre\",\n    \"faire un pli qui passe par un point et amène une ligne sur lui-même\",\n    \"faire un pli qui passe par le premier point et amène le deuxième point sur la ligne\",\n    \"faire un pli qui amène le premier point à la première ligne et le deuxième point à la deuxième ligne\",\n    \"faire un pli qui amène un point à une ligne et amène une deuxième ligne sur lui-même\"\n  ],\n  \"fr-google\": [null,\n    \"faire un pli qui passe par deux points\",\n    \"faire un pli en pliant un point à un autre\",\n    \"faire un pli en pliant une ligne sur une autre\",\n    \"faire un pli qui passe par un point et qui amène une ligne au dessus de lui-même\",\n    \"faire un pli qui passe par le premier point et amène le deuxième point sur la ligne\",\n    \"faire un pli qui amène le premier point à la première ligne et le deuxième point à la deuxième ligne\",\n    \"créer un pli qui amène un point à une ligne et une seconde ligne au-dessus de lui-même\"\n  ],\n  \"hi\": [null,\n    \"एक क्रीज़ बनाएँ जो दो स्थानों से गुजरता है।\",\n    \"एक स्थान को दूसरे स्थान पर मोड़कर एक क्रीज़ बनाएँ।\",\n    \"एक रेखा पर दूसरी रेखा को मोड़कर क्रीज़ बनाएँ।\",\n    \"एक क्रीज़ बनाएँ जो एक स्थान से गुजरता है और एक रेखा को स्वयं के ऊपर ले आता है।\",\n    \"एक क्रीज़ बनाएँ जो पहले स्थान से गुजरता है और दूसरे स्थान को रेखा पर ले आता है।\",\n    \"एक क्रीज़ बनाएँ जो पहले स्थान को पहली रेखा पर और दूसरे स्थान को दूसरी रेखा पर ले आता है।\",\n    \"एक क्रीज़ बनाएँ जो एक स्थान को एक रेखा पर ले आता है और दूसरी रेखा को स्वयं के ऊपर ले आता है।\"\n  ],\n  \"in\": [null,\n    \"buat lipatan yang melewati dua titik\",\n    \"buat lipatan dengan melipat satu titik ke titik lainnya\",\n    \"buat lipatan dengan melipat satu baris ke yang lain\",\n    \"buat lipatan yang melewati satu titik dan membawa satu garis di atasnya\",\n    \"buat lipatan yang melewati titik pertama dan membawa titik kedua ke garis\",\n    \"buat lipatan yang membawa titik pertama ke baris pertama dan titik kedua ke baris kedua\",\n    \"buat lipatan yang membawa titik ke garis dan membawa garis kedua di atas dirinya sendiri\"\n  ],\n  \"is\": [null,\n    \"búðu til skreppa sem fer í gegnum tvö stig\",\n    \"stytta með því að brjóta eitt stig í annan\",\n    \"stytta með því að leggja saman eina línu á annan\",\n    \"búðu til skreppa sem fer í gegnum eitt punkt og færir eina línu ofan á sig\",\n    \"búðu til skrefi sem fer í gegnum fyrsta punktinn og færir annað stig á línuna\",\n    \"búðu til skreppa sem færir fyrstu punktinn á fyrstu línuna og seinni punkturinn á annarri línunni\",\n    \"búðu til krækju sem bendir á línu og færir annan línu ofan á sig\"\n  ],\n  \"it\": [null,\n    \"fare una piega che passa attraverso due punti\",\n    \"fare una piega piegando un punto all'altro\",\n    \"fare una piega piegando una linea su un'altra\",\n    \"fare una piega che passa attraverso un punto e porta una linea su se stessa\",\n    \"fare una piega che passa attraverso il primo punto e porta il secondo punto sulla linea\",\n    \"fare una piega che porta il primo punto alla prima linea e il secondo punto alla seconda linea\",\n    \"fare una piega che porta un punto ad una linea e porta una seconda linea su se stessa\"\n  ],\n  \"it-google\": [null,\n    \"crea una piega che passa attraverso due punti\",\n    \"crea una piega piegando un punto a un altro\",\n    \"crea una piega piegando una linea su un'altra\",\n    \"crea una piega che passa attraverso un punto e porta una linea sopra di sé\",\n    \"crea una piega che passa attraverso il primo punto e porta il secondo punto sulla linea\",\n    \"crea una piega che porta il primo punto alla prima riga e il secondo punto alla seconda linea\",\n    \"crea una piega che porta un punto su una linea e porta una seconda linea sopra di sé\"\n  ],\n  \"iw\": [null,\n    \"לעשות קמט שעובר שתי נקודות\",\n    \"לעשות קיפול על ידי קיפול נקודה אחת לאחרת\",\n    \"לעשות קיפול על ידי קיפול שורה אחת על גבי אחרת\",\n    \"לעשות קמט שעובר דרך נקודה אחת ומביא שורה אחת על גבי עצמו\",\n    \"לעשות קיפול שעובר דרך הנקודה הראשונה ומביא את הנקודה השנייה על הקו\",\n    \"לעשות קפל שמביא את הנקודה הראשונה לקו הראשון ואת הנקודה השנייה לקו השני\",\n    \"לעשות קמט שמביא נקודה לקו ומביא שורה שנייה על גבי עצמו\"\n  ],\n  \"jp\": [null,\n    \"2点p1, p2が与えられたとき、2点を通るただ1つの折り方がある\",\n    \"2点p1, p2が与えられたとき、p1をp2に重ねるただ1つの折り方がある\",\n    \"2本の直線l1, l2が与えられたとき、l1をl2に重ねるような折り方がある\",\n    \"1点p1と1本の直線l1が与えられたとき、l1に垂直でp1を通るただ1つの折り方がある\",\n    \"2点p1, p2と1本の直線l1が与えられたとき、p1をl1上に重ね、p2を通る折り方がある\",\n    \"2点p1, p22本の直線l1, l2が与えられたとき、p1をl1上に重ね、かつp2をl2上に重ねる折り方がある\",\n    \"1点pと2本の直線l1, l2が与えられたとき、pをl1に重ね、l2に垂直な折り方がある\"\n  ],\n  \"ko\": [null,\n    \"두 점을 통과하는 주름을 만듭니다\",\n    \"한 점을 다른 점으로 접어 주름을 만듭니다\",\n    \"한 줄을 다른 줄로 접어 주름을 만듭니다\",\n    \"한 점을 통과하여 한 줄을 그 위에 얹는 주름을 만듭니다\",\n    \"첫 번째 점을 통과하고 두 번째 점을 선으로 가져 오는 주름을 만듭니다\",\n    \"첫 번째 점을 두 번째 선으로 가져오고 두 번째 점을 두 번째 선으로 가져 오는 주름을 만듭니다\",\n    \"라인에 포인트를 가져오고 그 위에 두 번째 라인을 가져 오는 주름을 만듭니다\"\n  ],\n  \"ms\": [null,\n    \"membuat lipatan yang melepasi dua mata\",\n    \"membuat lipatan dengan melipat satu mata kepada yang lain\",\n    \"membuat lipatan dengan melipat satu baris ke arah yang lain\",\n    \"membuat lipatan yang melewati satu titik dan membawa satu baris di atas dirinya sendiri\",\n    \"membuat lipatan yang melewati titik pertama dan membawa titik kedua ke garisan\",\n    \"membuat lipatan yang membawa titik pertama ke baris pertama dan titik kedua ke baris kedua\",\n    \"membuat lipatan yang membawa satu titik ke garisan dan membawa garisan kedua di atas dirinya sendiri\"\n  ],\n  \"nl\": [null,\n    \"maak een vouw die door twee punten gaat\",\n    \"maak een vouw door de ene punt naar de andere te vouwen\",\n    \"maak een vouw door de ene lijn op de andere te vouwen\",\n    \"een vouw maken die door één punt gaat en één lijn over zich heen brengt\",\n    \"maak een vouw die door het eerste punt gaat en het tweede punt op de lijn brengt\",\n    \"maak een vouw die het eerste punt naar de eerste lijn en het tweede punt naar de tweede lijn brengt\",\n    \"maak een vouw die een punt naar een lijn brengt en een tweede lijn bovenop zichzelf.\"\n  ],\n  \"nl-google\": [null,\n    \"maak een vouw die door twee punten gaat\",\n    \"maak een vouw door het ene punt naar het andere te vouwen\",\n    \"maak een vouw door de ene lijn op de andere te vouwen\",\n    \"maak een vouw die een punt passeert en één lijn bovenop zichzelf brengt\",\n    \"maak een vouw die door het eerste punt gaat en breng het tweede punt op de lijn\",\n    \"maak een vouw die het eerste punt naar de eerste regel brengt en het tweede naar de tweede lijn\",\n    \"maak een vouw die een punt naar een lijn brengt en een tweede lijn bovenop zichzelf brengt\"\n  ],\n  \"pa\": [null,\n    \"ਇੱਕ ਕਰਜ ਬਣਾਉ ਜੋ ਦੋ ਬਿੰਦੂਆਂ ਦੇ ਵਿੱਚੋਂ ਦੀ ਲੰਘਦਾ ਹੈ\",\n    \"ਇਕ ਬਿੰਦੂ ਤੋਂ ਦੂਜੇ ਨੂੰ ਘਸੀਟ ਕੇ ਇੱਕ ਕਰਜ ਬਣਾਉ\",\n    \"ਇਕ ਲਾਈਨ ਨੂੰ ਦੂਜੇ 'ਤੇ ਘੁਮਾ ਕੇ ਕਰਜ ਬਣਾਉ\",\n    \"ਇੱਕ ਕਰਜ ਬਣਾਉ ਜੋ ਇੱਕ ਬਿੰਦੂ ਤੋਂ ਪਾਰ ਹੋ ਕੇ ਆਪਣੇ ਆਪ ਦੇ ਸਿਖਰ ਤੇ ਇੱਕ ਲਾਈਨ ਲਿਆਉਂਦਾ ਹੈ\",\n    \"ਇੱਕ ਕਰਜ ਬਣਾਉ ਜੋ ਪਹਿਲੇ ਬਿੰਦੂ ਤੋਂ ਲੰਘਦਾ ਹੈ ਅਤੇ ਦੂਜਾ ਬਿੰਦੂ ਲਾਇਨ ਤੇ ਲਿਆਉਂਦਾ ਹੈ\",\n    \"ਇੱਕ ਕਰਜ ਬਣਾਉ ਜੋ ਪਹਿਲੀ ਲਾਈਨ ਲਈ ਪਹਿਲੀ ਪੁਆਇੰਟ ਅਤੇ ਦੂਜੀ ਲਾਈਨ ਨੂੰ ਦੂਜਾ ਬਿੰਦੂ ਲਿਆਏ\",\n    \"ਇੱਕ ਕਰਜ ਬਣਾਉ ਜੋ ਇੱਕ ਲਾਈਨ ਤੇ ਇੱਕ ਬਿੰਦੂ ਲੈ ਕੇ ਆਉਂਦੀ ਹੈ ਅਤੇ ਆਪਣੇ ਆਪ ਦੇ ਸਿਖਰ ਤੇ ਦੂਜੀ ਲਾਈਨ ਲਿਆਉਂਦੀ ਹੈ\"\n  ],\n  \"pt\": [null,\n    \"fazer um vinco que passa por dois pontos\",\n    \"fazer um vinco dobrando um ponto para outro\",\n    \"fazer um vinco dobrando uma linha sobre outra\",\n    \"fazer um vinco que passa por um ponto e traz uma linha em cima de si mesmo\",\n    \"fazer um vinco que passa pelo primeiro ponto e traz o segundo ponto para a linha\",\n    \"fazer um vinco que traz o primeiro ponto para a primeira linha e o segundo ponto para a segunda linha\",\n    \"faça um vinco que traga um ponto para uma linha e traga uma segunda linha em cima de si mesma.\"\n  ],\n  \"pt-google\": [null,\n    \"faça um vinco que passe por dois pontos\",\n    \"faça um vinco dobrando um ponto para outro\",\n    \"faça um vinco dobrando uma linha na outra\",\n    \"faça um vinco que passe por um ponto e coloque uma linha em cima de si\",\n    \"faça um vinco que passe pelo primeiro ponto e coloque o segundo ponto na linha\",\n    \"faça um vinco que traga o primeiro ponto para a primeira linha e o segundo ponto para a segunda linha\",\n    \"faça um vinco que traga um ponto para uma linha e coloque uma segunda linha em cima de si mesma\"\n  ],\n  \"ru\": [null,\n    \"сделайте складку, которая проходит через две точки\",\n    \"сделайте складку, складывая одну точку в другую\",\n    \"сделайте складку, сложив одну линию на другую\",\n    \"сделайте складку, которая проходит через одну точку и накладывает одну линию на себя\",\n    \"создайте складку, которая проходит через первую точку и переносит вторую точку на линию\",\n    \"создайте складку, которая приведет первую точку к первой линии, а вторую - ко второй\",\n    \"сделайте складку, которая приведет точку к линии и наложит вторую линию на себя\"\n  ],\n  \"ru-google\": [null,\n    \"сделать складку, которая проходит через две точки\",\n    \"сделать складку, сложив одну точку в другую\",\n    \"сделать складку, сложив одну линию на другую\",\n    \"сделать складку, которая проходит через одну точку и приносит одну линию поверх себя\",\n    \"сделать складку, которая проходит через первую точку и переносит вторую точку на линию\",\n    \"сделать складку, которая переносит первую точку на первую строку, а вторую точку - на вторую линию\",\n    \"сделать складку, которая приносит точку на линию и ставит вторую линию поверх себя\"\n  ],\n  \"sw\": [null,\n    \"fanya kamba ambayo inapita kwa pointi mbili\",\n    \"fanya kamba kwa kupunja sehemu moja hadi nyingine\",\n    \"fanya kamba kwa kupunja mstari mmoja kwenye mwingine\",\n    \"fanya kamba ambayo hupita kwa njia moja na kuleta mstari mmoja juu ya yenyewe\",\n    \"fanya kamba ambayo inapita kupitia hatua ya kwanza na inaleta hatua ya pili kwenye mstari\",\n    \"fanya kamba inayoleta hatua ya kwanza kwenye mstari wa kwanza na hatua ya pili kwa mstari wa pili\",\n    \"fanya kamba inayoleta uhakika kwa mstari na huleta mstari wa pili juu ya yenyewe\"\n  ],\n  \"th\": [null,\n    \"ทำรอยพับที่ผ่านจุดสองจุด\",\n    \"พับเป็นรอยพับหนึ่งจุด\",\n    \"ทำการพับโดยพับหนึ่งบรรทัดไปยังอีก\",\n    \"ทำการพับที่ผ่านจุดหนึ่งและนำหนึ่งบรรทัดที่ด้านบนของตัวเอง\",\n    \"ทำให้รอยพับที่ผ่านจุดแรกและนำจุดที่สองลงบนเส้น\",\n    \"สร้างรอยพับที่นำจุดแรกไปยังบรรทัดแรกและจุดที่สองไปยังบรรทัดที่สอง\",\n    \"สร้างรอยพับที่นำจุดไปยังบรรทัดและนำบรรทัดที่สองอยู่ด้านบนของตัวเอง\"\n  ],\n  \"tr\": [null,\n    \"iki noktadan geçen bir kırışık yapmak\",\n    \"bir noktayı diğerine katlayarak bir kıvrım yapın\",\n    \"bir çizgiyi diğerine katlayarak bir kırışıklık yapın\",\n    \"bir noktadan geçen ve kendi başına bir satır getiren bir kırışıklık yapın\",\n    \"ilk noktadan geçen ve ikinci noktayı çizgiye getiren bir kıvrım yapın\",\n    \"ilk noktayı ilk satıra, ikinci noktayı ikinci satıra getiren bir kıvrım yapın\",\n    \"bir çizgiyi işaret eden ve kendi üstüne ikinci bir çizgi getiren bir kıvrım yapın\"\n  ],\n  \"ur\": [null,\n    \"ایک ایسی تخلیق کرو جو دو پوائنٹس سے گزرتا ہے\",\n    \"ایک نقطہ ایک دوسرے کو ایک پوائنٹ سے جوڑ کر بنائیں\",\n    \"ایک سطر کو ایک قطار میں ایک دوسرے سے جوڑ کر بنائیں\",\n    \"ایک ایسی تخلیق بناؤ جو ایک پوائنٹ سے گزرتا ہے اور اپنے اوپر سے ایک سطر لاتا ہے\",\n    \"ایک ایسی تخلیق کرو جو پہلی نقطہ نظر سے گزرتا ہے اور دوسرا پوائنٹ لائن پر لاتا ہے\",\n    \"ایک ایسی تخلیق کرو جو پہلی لائن پر پہلی نقطہ اور دوسرا نقطہ دوسری سطر کو پہلی نقطہ لاتا ہے\",\n    \"ایک ایسی تخلیق بناؤ جو ایک نقطہ نقطہ لاتا ہے اور خود کے اوپر دوسری سطر لاتا ہے\"\n  ],\n  \"vi\": [null,\n    \"tạo một nếp gấp đi qua hai điểm\",\n    \"tạo nếp gấp bằng cách gấp một điểm này sang điểm khác\",\n    \"tạo nếp gấp bằng cách gấp một dòng lên một dòng khác\",\n    \"tạo một nếp gấp đi qua một điểm và đưa một đường lên trên chính nó\",\n    \"tạo một nếp gấp đi qua điểm đầu tiên và đưa điểm thứ hai lên đường thẳng\",\n    \"tạo một nếp gấp mang điểm đầu tiên đến dòng đầu tiên và điểm thứ hai cho dòng thứ hai\",\n    \"tạo một nếp gấp mang lại một điểm cho một dòng và đưa một dòng thứ hai lên trên chính nó\"\n  ],\n  \"zh\": [null,\n    \"给定两点 p1 和 p2，有且仅有一条折痕同时过这两点\",\n    \"给定两点 p1 和 p2，有且仅有一种方法把 p1 折到 p2 上\",\n    \"给定两直线 l1 和 l2，可以把 l1 折到 l2 上\",\n    \"给定一点 p1 和一条直线 l1，有且仅有一种方法过 p1 折出 l1 的垂线\",\n    \"给定两点 p1 和 p2 和一条直线 l1，可以沿过 p2 的直线将 p1 折到 l1 上\",\n    \"给定两点 p1 和 p2 和两直线 l1 和 l2，可以一次将 p1 、 p2 分别折到 l1 、 l2 上\",\n    \"给定一点 p 和两直线 l1 和 l2，可以沿着 l2 的垂线将 p1 折到 l1 上\"\n  ]\n}\n";

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
      return { en: `${edges_assignment_names.en[construction.assignment]} fold` };
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
    if (axiom === 7) {
      return [axiom_frame.test.points_reflected[0], axiom_frame.parameters.points[0]];
    }
    const crease_vector = [
      crease_edge[1][0] - crease_edge[0][0],
      crease_edge[1][1] - crease_edge[0][1]
    ];
    let crossing;
    switch (axiom) {
      case 4:
        crossing = math$1.core.nearest_point_on_line(
          crease_edge[0], crease_vector, axiom_frame.parameters.lines[0][0], (a => a)
        );
        break;
      case 7:
        crossing = math$1.core.nearest_point_on_line(
          crease_edge[0], crease_vector, axiom_frame.parameters.points[0], (a => a)
        );
        break;
      default:
        crossing = math$1.core.average(crease_edge[0], crease_edge[1]);
        break;
    }
    const boundary = get_boundary$1(graph).vertices
      .map(v => graph.vertices_coords[v]);
    const perpClipEdge = math$1.core.intersection.convex_poly_line(
      boundary, crossing, arrow_vector
    );
    if (perpClipEdge === undefined) {
      return [];
    }
    let short_length = [perpClipEdge[0], perpClipEdge[1]]
      .map(n => math$1.core.distance2(n, crossing))
      .sort((a, b) => a - b)
      .shift();
    if (axiom === 7) {
      short_length = math$1.core.distance2(construction.parameters.points[0], crossing);
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
          "re:instructions": { en: "flip over" }
        };
      case "fold":
        return {
          "re:diagram_lines": [{
            "re:diagram_line_classes": [edges_assignment_names.en[c.assignment]],
            "re:diagram_line_coords": c.edge,
          }],
          "re:diagram_arrows": [{
            "re:diagram_arrow_classes": [],
            "re:diagram_arrow_coords": make_arrow_coords(c, graph)
          }],
          "re:instructions": make_instructions(c)
        };
      case "squash":
      case "sink":
      case "pleat":
      default:
        return { error: `construction type (${c.type}) not yet defined` };
    }
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
      if (diff.remove.faces) { remove_faces(graph, diff.remove.faces); }
      if (diff.remove.edges) { remove_edges(graph, diff.remove.edges); }
      if (diff.remove.vertices) { remove_vertices(graph, diff.remove.vertices); }
    }
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

  var empty = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_title\": \"\",\n\t\"file_description\": \"\",\n\t\"file_classes\": [],\n\t\"file_frames\": [],\n\n\t\"frame_author\": \"\",\n\t\"frame_title\": \"\",\n\t\"frame_description\": \"\",\n\t\"frame_attributes\": [],\n\t\"frame_classes\": [],\n\t\"frame_unit\": \"\",\n\n\t\"vertices_coords\": [],\n\t\"vertices_vertices\": [],\n\t\"vertices_faces\": [],\n\n\t\"edges_vertices\": [],\n\t\"edges_faces\": [],\n\t\"edges_assignment\": [],\n\t\"edges_foldAngle\": [],\n\t\"edges_length\": [],\n\n\t\"faces_vertices\": [],\n\t\"faces_edges\": [],\n\n\t\"edgeOrders\": [],\n\t\"faceOrders\": []\n}\n";

  var square$1 = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [1,0], [1,1], [0,1]],\n\t\"vertices_vertices\": [[1,3], [2,0], [3,1], [0,2]],\n\t\"vertices_faces\": [[0], [0], [0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,0]],\n\t\"edges_faces\": [[0], [0], [0], [0]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0],\n\t\"edges_length\": [1, 1, 1, 1],\n\t\"faces_vertices\": [[0,1,2,3]],\n\t\"faces_edges\": [[0,1,2,3]]\n}";

  var book = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,1], [0.5,1], [0,1]],\n\t\"vertices_vertices\": [[1,5], [2,4,0], [3,1], [4,2], [5,1,3], [0,4]],\n\t\"vertices_faces\": [[0], [0,1], [1], [1], [1,0], [0]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0], [1,4]],\n\t\"edges_faces\": [[0], [1], [1], [1], [0], [0], [0,1]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180],\n\t\"edges_length\": [0.5, 0.5, 1, 0.5, 0.5, 1, 1],\n\t\"faces_vertices\": [[1,4,5,0], [4,1,2,3]],\n\t\"faces_edges\": [[6,4,5,0], [6,1,2,3]]\n}";

  var blintz = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"blintz base\",\n\t\"frame_attributes\": [\"2D\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"vertices_coords\": [[0,0], [0.5,0], [1,0], [1,0.5], [1,1], [0.5,1], [0,1], [0,0.5]],\n\t\"vertices_vertices\": [[1,7], [2,3,7,0], [3,1], [4,5,1,2], [5,3], [6,7,3,4], [7,5], [0,1,5,6]],\n\t\"vertices_faces\": [[0], [1,4,0], [1], [2,4,1], [2], [3,4,2], [3], [0,4,3]],\n\t\"edges_vertices\": [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,7], [7,0], [1,3], [3,5], [5,7], [7,1]],\n\t\"edges_faces\": [[0], [1], [1], [2], [2], [3], [3], [0], [1,4], [2,4], [3,4], [0,4]],\n\t\"edges_assignment\": [\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"B\",\"V\",\"V\",\"V\",\"V\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.707106781186548, 0.707106781186548, 0.707106781186548, 0.707106781186548],\n\t\"faces_vertices\": [[0,1,7], [2,3,1], [4,5,3], [6,7,5], [1,3,5,7]],\n\t\"faces_edges\": [[0,11,7], [2,8,1], [4,9,3], [6,10,5], [8,9,10,11]],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedForm\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [[0.5,0.5], [0.5,0.0], [0.5,0.5], [1.0,0.5], [0.5,0.5], [0.5,1.0], [0.5,0.5], [0.0,0.5]],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 180, 180, 180, 180],\n\t\t\"faceOrders\": [[0,4,1], [1,4,1], [2,4,1], [3,4,1]]\n\t}]\n}";

  var kite = "{\n\t\"file_spec\": 1.1,\n\t\"file_creator\": \"\",\n\t\"file_author\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_title\": \"kite base\",\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [\n\t\t[0,0],\n\t\t[0.414213562373095,0],\n\t\t[1,0],\n\t\t[1,0.585786437626905],\n\t\t[1,1],\n\t\t[0,1]\n\t],\n\t\"vertices_vertices\": [ [1,5], [2,5,0], [3,5,1], [4,5,2], [5,3], [0,1,2,3,4] ],\n\t\"vertices_faces\": [ [0], [1,0], [2,1], [3,2], [3], [0,1,2,3] ],\n\t\"edges_vertices\": [\n\t\t[0,1],\n\t\t[1,2],\n\t\t[2,3],\n\t\t[3,4],\n\t\t[4,5],\n\t\t[5,0],\n\t\t[5,1],\n\t\t[3,5],\n\t\t[5,2]\n\t],\n\t\"edges_faces\": [[0], [1], [2], [3], [3], [0], [0,1], [3,2], [1,2]],\n\t\"edges_assignment\": [\"B\", \"B\", \"B\", \"B\", \"B\", \"B\", \"V\", \"V\", \"F\"],\n\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 0, 0, 0],\n\t\"edges_length\": [0.414213562373095, 0.585786437626905, 0.585786437626905, 0.414213562373095, 1, 1, 1.082392200292394, 1.082392200292394, 1.414213562373095],\n\t\"faces_vertices\": [\n\t\t[0,1,5],\n\t\t[1,2,5],\n\t\t[2,3,5],\n\t\t[3,4,5]\n\t],\n\t\"faces_edges\": [\n\t\t[0,6,5],\n\t\t[1,8,6],\n\t\t[2,7,8],\n\t\t[3,4,7]\n\t],\n\t\"file_frames\": [{\n\t\t\"frame_classes\": [\"foldedForm\"],\n\t\t\"frame_parent\": 0,\n\t\t\"frame_inherit\": true,\n\t\t\"vertices_coords\": [\n\t\t\t[0.707106781186548,0.292893218813452],\n\t\t\t[1,0],\n\t\t\t[0.707106781186548,0.292893218813452],\n\t\t\t[0,1],\n\t\t\t[0.414213562373095,0],\n\t\t\t[1,0.585786437626905]\n\t\t],\n\t\t\"edges_foldAngle\": [0, 0, 0, 0, 0, 0, 180, 180, 0],\n\t\t\"faceOrders\": [[0,1,1], [3,2,1]]\n\t}]\n}";

  var fish = "{\n  \"file_spec\": 1.1,\n  \"file_creator\": \"\",\n  \"file_author\": \"\",\n  \"file_classes\": [\"singleModel\"],\n  \"frame_title\": \"\",\n  \"frame_classes\": [\"creasePattern\"],\n  \"frame_attributes\": [\"2D\"],\n  \"vertices_coords\": [\n    [0,0],\n    [1,0],\n    [1,1],\n    [0,1],\n    [0.292893218813452,0.292893218813452],\n    [0.707106781186548,0.707106781186548],\n    [0.292893218813452,0],\n    [1,0.707106781186548]\n  ],\n  \"edges_vertices\": [\n  \t[2,3], [3,0], [3,1], [0,4], [1,4], [3,4], [1,5], [2,5], [3,5], [4,6], [0,6], [6,1], [5,7], [1,7], [7,2]\n  ],\n  \"edges_assignment\": [\n  \t\"B\", \"B\", \"F\", \"M\", \"M\", \"M\", \"M\", \"M\", \"M\", \"V\", \"B\", \"B\", \"V\", \"B\", \"B\"\n  ],\n  \"file_frames\": [{\n    \"frame_classes\": [\"foldedForm\"],\n    \"frame_parent\": 0,\n    \"frame_inherit\": true,\n    \"vertices_coords\":[[0.707106781186548,0.292893218813452],[1,0],[0.707106781186548,0.292893218813452],[0,1],[0.292893218813452,0.292893218813452],[0.707106781186548,0.707106781186548],[0.5,0.5],[0.5,0.5]]\n  }],\n  \"vertices_vertices\": [\n    [6,4,3],\n    [7,5,3,4,6],\n    [5,7,3],\n    [0,4,1,5,2],\n    [0,6,1,3],\n    [1,7,2,3],\n    [1,4,0],\n    [1,2,5]\n  ],\n  \"faces_vertices\": [\n    [4,0,6],\n    [3,0,4],\n    [5,1,7],\n    [3,1,5],\n    [4,1,3],\n    [6,1,4],\n    [5,2,3],\n    [7,2,5]\n  ],\n  \"faces_edges\": [\n    [3,10,9],\n    [1,3,5],\n    [6,13,12],\n    [2,6,8],\n    [4,2,5],\n    [11,4,9],\n    [7,0,8],\n    [14,7,12]\n  ],\n  \"edges_faces\": [[6], [1], [3,4], [0,1], [4,5], [1,4], [2,3], [6,7], [3,6], [0,5], [0], [5], [2,7], [2], [7]],\n  \"vertices_faces\": [[0,1], [2,3,4,5], [6,7], [1,3,4,6], [0,1,4,5], [2,3,6,7], [0,5], [2,7]],\n  \"edges_length\": [1, 1, 1.4142135623730951, 0.41421356237309437, 0.7653668647301798, 0.7653668647301798, 0.7653668647301798, 0.41421356237309437, 0.7653668647301798, 0.292893218813452, 0.292893218813452, 0.707106781186548, 0.292893218813452, 0.707106781186548, 0.292893218813452],\n  \"edges_foldAngle\": [0, 0, 0, -180, -180, -180, -180, -180, -180, 180, 0, 0, 180, 0, 0],\n  \"faces_faces\": [\n  \t[1,5], [0,4], [3,7], [2,4,6], [3,1,5], [4,0], [3,7], [6,2]\n  ],\n  \"vertices_edges\": [\n    [1,3,10],\n    [2,4,6,11,13],\n    [0,7,14],\n    [0,1,2,5,8],\n    [3,4,5,9],\n    [6,7,8,12],\n    [9,10,11],\n    [12,13,14]\n  ]\n}\n";

  var bird = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0.207106781186548,0.5],[0.5,0.207106781186548],[0.792893218813452,0.5],[0.5,0.792893218813452],[0.353553390593274,0.646446609406726],[0.646446609406726,0.646446609406726],[0.646446609406726,0.353553390593274],[0.353553390593274,0.353553390593274],[0,0.5],[0.5,0],[1,0.5],[0.5,1]],\n\t\"edges_vertices\": [[3,5],[5,9],[3,9],[3,13],[5,13],[0,5],[0,13],[0,12],[5,12],[4,5],[4,12],[4,9],[0,6],[6,12],[0,14],[6,14],[1,6],[1,14],[1,11],[6,11],[4,6],[4,11],[1,7],[7,11],[1,15],[7,15],[2,7],[2,15],[2,10],[7,10],[4,7],[4,10],[2,8],[8,10],[2,16],[8,16],[3,8],[3,16],[8,9],[4,8]],\n\t\"edges_faces\": [[0,1],[0,5],[21,0],[1],[2,1],[2,3],[2],[3,6],[4,3],[4,5],[11,4],[5,22],[6,7],[6,11],[7],[8,7],[8,9],[8],[9,12],[10,9],[10,11],[17,10],[12,13],[12,17],[13],[14,13],[14,15],[14],[15,18],[16,15],[16,17],[23,16],[18,19],[18,23],[19],[20,19],[20,21],[20],[22,21],[22,23]],\n\t\"edges_assignment\": [\"M\",\"F\",\"V\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"V\",\"F\",\"M\",\"V\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"F\",\"M\",\"F\",\"M\",\"F\",\"B\",\"V\",\"M\",\"B\",\"F\",\"M\"],\n\t\"faces_vertices\": [[3,5,9],[5,3,13],[0,5,13],[5,0,12],[4,5,12],[5,4,9],[0,6,12],[6,0,14],[1,6,14],[6,1,11],[4,6,11],[6,4,12],[1,7,11],[7,1,15],[2,7,15],[7,2,10],[4,7,10],[7,4,11],[2,8,10],[8,2,16],[3,8,16],[8,3,9],[4,8,9],[8,4,10]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,4,6],[5,7,8],[9,8,10],[9,11,1],[12,13,7],[12,14,15],[16,15,17],[16,18,19],[20,19,21],[20,10,13],[22,23,18],[22,24,25],[26,25,27],[26,28,29],[30,29,31],[30,21,23],[32,33,28],[32,34,35],[36,35,37],[36,2,38],[39,38,11],[39,31,33]]\n}";

  var frog = "{\n\t\"file_spec\": 1.1,\n\t\"frame_title\": \"\",\n\t\"file_classes\": [\"singleModel\"],\n\t\"frame_classes\": [\"creasePattern\"],\n\t\"frame_attributes\": [\"2D\"],\n\t\"vertices_coords\": [[0,0],[1,0],[1,1],[0,1],[0.5,0.5],[0,0.5],[0.5,0],[1,0.5],[0.5,1],[0.146446609406726,0.353553390593274],[0.353553390593274,0.146446609406726],[0.646446609406726,0.146446609406726],[0.853553390593274,0.353553390593274],[0.853553390593274,0.646446609406726],[0.646446609406726,0.853553390593274],[0.353553390593274,0.853553390593274],[0.146446609406726,0.646446609406726],[0,0.353553390593274],[0,0.646446609406726],[0.353553390593274,0],[0.646446609406726,0],[1,0.353553390593274],[1,0.646446609406726],[0.646446609406726,1],[0.353553390593274,1]],\n\t\"edges_vertices\": [[0,4],[4,9],[0,9],[0,10],[4,10],[2,4],[2,14],[4,14],[4,13],[2,13],[3,4],[4,15],[3,15],[3,16],[4,16],[1,4],[1,12],[4,12],[4,11],[1,11],[4,5],[5,9],[5,16],[4,6],[6,11],[6,10],[4,7],[7,13],[7,12],[4,8],[8,15],[8,14],[9,17],[0,17],[5,17],[0,19],[10,19],[6,19],[11,20],[1,20],[6,20],[1,21],[12,21],[7,21],[13,22],[2,22],[7,22],[2,23],[14,23],[8,23],[15,24],[3,24],[8,24],[3,18],[16,18],[5,18]],\n\t\"edges_faces\": [[0,1],[0,8],[16,0],[1,18],[11,1],[3,2],[2,26],[15,2],[3,12],[24,3],[4,5],[4,14],[28,4],[5,30],[9,5],[7,6],[6,22],[13,6],[7,10],[20,7],[8,9],[8,17],[31,9],[10,11],[10,21],[19,11],[12,13],[12,25],[23,13],[14,15],[14,29],[27,15],[16,17],[16],[17],[18],[19,18],[19],[20,21],[20],[21],[22],[23,22],[23],[24,25],[24],[25],[26],[27,26],[27],[28,29],[28],[29],[30],[31,30],[31]],\n\t\"edges_assignment\": [\"F\",\"M\",\"M\",\"M\",\"M\",\"F\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"M\",\"M\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\",\"V\",\"B\",\"B\",\"B\",\"V\",\"B\"],\n\t\"faces_vertices\": [[0,4,9],[4,0,10],[4,2,14],[2,4,13],[3,4,15],[4,3,16],[4,1,12],[1,4,11],[4,5,9],[5,4,16],[4,6,11],[6,4,10],[4,7,13],[7,4,12],[4,8,15],[8,4,14],[0,9,17],[9,5,17],[10,0,19],[6,10,19],[1,11,20],[11,6,20],[12,1,21],[7,12,21],[2,13,22],[13,7,22],[14,2,23],[8,14,23],[3,15,24],[15,8,24],[16,3,18],[5,16,18]],\n\t\"faces_edges\": [[0,1,2],[0,3,4],[5,6,7],[5,8,9],[10,11,12],[10,13,14],[15,16,17],[15,18,19],[20,21,1],[20,14,22],[23,24,18],[23,4,25],[26,27,8],[26,17,28],[29,30,11],[29,7,31],[2,32,33],[21,34,32],[3,35,36],[25,36,37],[19,38,39],[24,40,38],[16,41,42],[28,42,43],[9,44,45],[27,46,44],[6,47,48],[31,48,49],[12,50,51],[30,52,50],[13,53,54],[22,54,55]]\n}";

  const convert$3 = {
    toFOLD,
    toSVG,
    toORIPA,
    FOLD_SVG: convert$2,
  };
  const core$1 = Object.create(null);
  Object.assign(core$1,
    frames,
    create,
    object,
    spec,
    validate$1,
    add,
    remove,
    rebuild$1,
    make$1,
    query$1,
    fold,
    kawasaki,
    Axioms);
  core$1.build_diagram_frame = build_diagram_frame;
  core$1.add_edge = add_edge;
  core$1.split_edge_run = add_vertex_on_edge$1;
  core$1.apply_run = apply_run_diff;
  core$1.merge_run = merge_run_diffs;
  core$1.apply_axiom = apply_axiom;
  const b = {
    empty: JSON.parse(empty),
    square: JSON.parse(square$1),
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
    CreasePattern,
    Origami,
    Origami3D: View3D,
    Graph,
    svg: svg$1,
    convert: convert$3,
    core: core$1,
    bases,
    math: math$1.core,
    axiom: axiom,
    foldPrototype: Prototype$2
  };
  Object.keys(math$1)
    .filter(key => key !== "core")
    .forEach((key) => { rabbitEar[key] = math$1[key]; });

  return rabbitEar;

})));
window.re = RabbitEar;
