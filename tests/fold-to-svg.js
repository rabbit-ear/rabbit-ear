/* (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.FoldToSvg = factory());
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
  var frame_classes = "".concat(frame, "_classes");
  var file_frames = "".concat(file, "_frames");
  var file_classes = "".concat(file, "_classes");
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

  var isBrowser = (typeof window === "undefined" ? "undefined" : _typeof(window)) !== _undefined && _typeof(window.document) !== _undefined;

  var isNode = (typeof process === "undefined" ? "undefined" : _typeof(process)) !== _undefined && process.versions != null && process.versions.node != null;
  var isWebWorker = (typeof self === "undefined" ? "undefined" : _typeof(self)) === object && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";

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

  var svgNS = "http://www.w3.org/2000/svg";
  var svg = function svg() {
    var svgImage = win.document[createElementNS](svgNS, "svg");
    svgImage.setAttribute("version", "1.1");
    svgImage.setAttribute("xmlns", svgNS);
    return svgImage;
  };
  var g = function g(parent) {
    var g = win.document[createElementNS](svgNS, "g");

    if (parent) {
      parent[appendChild](g);
    }

    return g;
  };
  var defs = function defs(parent) {
    var defs = win.document[createElementNS](svgNS, "defs");

    if (parent) {
      parent[appendChild](defs);
    }

    return defs;
  };
  var style = function style(parent) {
    var s = win.document[createElementNS](svgNS, "style");
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
    var shape = win.document[createElementNS](svgNS, "line");
    shape[setAttributeNS](null, "x1", x1);
    shape[setAttributeNS](null, "y1", y1);
    shape[setAttributeNS](null, "x2", x2);
    shape[setAttributeNS](null, "y2", y2);
    return shape;
  };
  var circle = function circle(x, y, radius) {
    var shape = win.document[createElementNS](svgNS, "circle");
    shape[setAttributeNS](null, "cx", x);
    shape[setAttributeNS](null, "cy", y);
    shape[setAttributeNS](null, "r", radius);
    return shape;
  };
  var polygon = function polygon(pointsArray) {
    var shape = win.document[createElementNS](svgNS, "polygon");
    var pointsString = pointsArray.map(function (p) {
      return "".concat(p[0], ",").concat(p[1]);
    }).join(" ");
    shape[setAttributeNS](null, "points", pointsString);
    return shape;
  };
  var path = function path(d) {
    var p = win.document[createElementNS](svgNS, "path");
    p[setAttributeNS](null, "d", d);
    return p;
  };

  var SVG = /*#__PURE__*/Object.freeze({
    __proto__: null,
    svgNS: svgNS,
    svg: svg,
    g: g,
    defs: defs,
    style: style,
    setViewBox: setViewBox,
    line: line,
    circle: circle,
    polygon: polygon,
    path: path
  });

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

  var edges_assignment_names = {
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
      return edges_assignment_names[a];
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
      p[setAttributeNS](null, _class, edges_assignment_names[assignment]);
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

  var make_vertices_edges = function make_vertices_edges(_ref) {
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
  var make_vertex_pair_to_edge_map = function make_vertex_pair_to_edge_map(_ref9) {
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

  var attach = function attach(parent) {
    var FoldtoSVG = this;

    var thisToSVG = function thisToSVG() {
      return FoldtoSVG.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    if (parent.graph) { parent.graph.prototype.svg = thisToSVG; }
  };

  function vkXML (text, step) {
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
        var _graph$K$edges_vertic = _slicedToArray(graph[edges_vertices][edgeIndex], 2);

        nextVertex = _graph$K$edges_vertic[1];
      } else {
        var _graph$K$edges_vertic2 = _slicedToArray(graph[edges_vertices][edgeIndex], 1);

        nextVertex = _graph$K$edges_vertic2[0];
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
    var file_classes$1 = (graph[file_classes] != null ? graph[file_classes] : []).join(" ");
    var frame_classes$1 = (graph[frame_classes] != null ? graph[frame_classes] : []).join(" ");
    return [file_classes$1, frame_classes$1].filter(function (s) {
      return s !== "";
    }).join(" ");
  };

  var document = win.document;
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
  var Options = (function () {
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
  });

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
    setViewBox.apply(SVG, [svg$1].concat(_toConsumableArray(bounds), [options.padding]));
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
      var cdata = new win.DOMParser().parseFromString("<xml></xml>", "application/xml").createCDATASection("\n* { --".concat(stroke_width, ": ").concat(strokeVar, "; }\n").concat(options.stylesheet));
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
      groups[key] = g();
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

    var stringified = new win.XMLSerializer().serializeToString(svg$1);
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
  FoldToSvg.linker = attach.bind(FoldToSvg);

  return FoldToSvg;

})));
