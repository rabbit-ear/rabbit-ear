/* Origami Diagrams v0.1 (c) Robby Kraft, MIT License */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.OrigamiDiagrams = factory());
}(this, (function () { 'use strict';

  var defaultPageStyle = "html, body {\n  width: 100%;\n  margin: 0;\n}\nbody {\n  font-family: 'Avenir Next', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n}\n.page-grid {\n  display: grid;\n  grid-template-columns: 25% 25% 25% 25%;\n  grid-template-rows: 250px 250px 264px 264px;\n  grid-auto-rows: 264px;\n}\ndiv.header {\n  height: 400px;\n  padding: 1rem;\n  padding-left: 3rem;\n  padding-top: 2rem;\n  grid-column-start: 2;\n  grid-column-end: 5;\n  grid-row-start: 1;\n  grid-row-end: 3;\n  /* -webkit-print-color-adjust: exact; */\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr 1fr;\n  justify-items: center;\n  align-items: center;\n}\nh1 {\n  font-size: 3.5rem;\n  /*margin-bottom: 2rem;*/\n  text-align: left;\n}\np {\n  font-size: 1rem;\n  width: 100%;\n  /*margin: 1rem 0;*/\n}\nh1, p {\n  margin: 0;\n}\nh1 {\n  width: 100%;\n  border-width: 0 0 1px 0;\n  border-style: solid;\n  border-color: black;\n}\n.small {\n  font-size: 70%;\n  /*margin-top: 2rem;*/\n}\ndiv.step {\n  position: relative;\n  text-align: center;\n}\ndiv.step .number {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 2rem;\n  height: 2rem;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 1rem;\n  font-weight: 400;\n}\ndiv.step svg {\n  margin: auto;\n}\n\n.title {\n  grid-column-start: 1;\n  grid-column-end: 5;\n  grid-row-start: 1;\n  grid-row-end: 2;\n}\n.author {\n  grid-column-start: 1;\n  grid-column-end: 3;\n  grid-row-start: 2;\n  grid-row-end: 3;\n  justify-self: start;\n  align-self: start;\n  text-align: left;\n}\n.description {\n  grid-column-start: 1;\n  grid-column-end: 3;\n  grid-row-start: 2;\n  grid-row-end: 3;\n  justify-self: start;\n  align-self: start;\n  text-align: left;\n  margin-top: 1.5rem;\n  z-index: 3;\n}\n.fold-time {\n  grid-column-start: 3;\n  grid-column-end: 5;\n  grid-row-start: 1;\n  grid-row-end: 2;\n  align-self: center;\n  justify-self: end;\n  text-align: right;\n}\n.size-ratio {\n  grid-column-start: 1;\n  grid-column-end: 2;\n  grid-row-start: 2;\n  grid-row-end: 3;\n  align-self: end;\n}\n.attribution {\n  grid-column-start: 1;\n  grid-column-end: 5;\n  grid-row-start: 4;\n  grid-row-end: 5;\n  align-self: end;\n  text-align: right;\n  position: relative;\n  bottom: -1rem;\n  border-width: 0 0 1px 0;\n  border-style: solid;\n  border-color: black;\n  line-height: 3rem;\n}\n\nsvg.step {\n  height: 210px;\n  width: 210px;\n}\nsvg.header.creasePattern {\n  grid-column-start: 1;\n  grid-column-end: 2;\n  grid-row-start: 3;\n  grid-row-end: 5;\n  justify-self: end;\n  align-self: end;\n  width: 200px;\n  height: 200px;\n}\nsvg.header.foldedForm {\n  grid-column-start: 3;\n  grid-column-end: 5;\n  grid-row-start: 1;\n  grid-row-end: 5;\n  justify-self: end;\n  width: 300px;\n  height: 300px;\n  z-index: 3;\n  margin-top: 2rem;\n}\nsvg.header.foldedForm.scaled {\n  grid-column-start: 2;\n  grid-column-end: 3;\n  grid-row-start: 3;\n  grid-row-end: 5;\n  width: 200px;\n  height: 200px;\n  z-index: 2;\n  justify-self: start;\n  align-self: end;\n  margin-top: initial;\n  margin-left: -3rem;\n}\n\ndiv.step:nth-of-type(2) {\n  grid-column-start: 1;\n  grid-column-end: 2;\n  grid-row-start: 1;\n  grid-row-end: 2;\n  /*align-self: end;*/\n}\n\ndiv.step:nth-of-type(3) {\n  grid-column-start: 1;\n  grid-column-end: 2;\n  grid-row-start: 2;\n  grid-row-end: 3;\n  /*align-self: end;*/\n}\n\n/*\n * --------------------\n * crease pattern style\n * --------------------\n */\n\nsvg { --crease-width: 0.005; }\nsvg * {\n  stroke-width: var(--crease-width);\n  stroke-linecap: round;\n  stroke: black;\n}\npolygon { fill: none; stroke: none; stroke-linejoin: bevel; }\n.boundary { fill: white; stroke: black; }\n.mark { stroke: #AAA; }\n.mountain { stroke: #000; }\n.valley {\n  stroke: #000;\n  stroke-dasharray: calc(var(--crease-width)*2) calc(var(--crease-width)*4);\n}\n.foldedForm .boundary {fill: none; stroke: none;}\n.foldedForm .faces polygon { stroke: #000; }\n.foldedForm .faces .front { fill: white; }\n.foldedForm .faces .back { fill: #dcd8d4; }\n.foldedForm .creases line { stroke: none; }\n.foldedForm .creases { display: none; opacity: 0; }\n.creasePattern .faces { display: none; opacity: 0; }\n.creasePattern .boundary { fill: white; }\n.creasePattern .valley { stroke-dasharray: initial; }\n\nsvg.header.foldedForm.scaled .faces .front { fill: black;}\nsvg.header.foldedForm.scaled .faces .back { fill: black;}\n";

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
  var make_vertices_edges = function make_vertices_edges(graph) {
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
  var get_boundary = function get_boundary(graph) {
    var edges_vertices_b = graph.edges_assignment.map(function (a) {
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
  var bounding_rect = function bounding_rect(graph) {
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
  var make_faces_faces = function make_faces_faces(graph) {
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
  var make_faces_coloring_from_faces_matrix = function make_faces_coloring_from_faces_matrix(faces_matrix) {
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
    make_face_walk_tree(graph, root_face).forEach(function (level, i) {
      level.forEach(function (entry) {
        coloring[entry.face] = i % 2 === 0;
      });
    });
    return coloring;
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
  var flatten_frame = function flatten_frame(fold_file, frame_num) {
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
        var copy = clone(fold_file);
        fold_file.file_frames = swap;
        delete copy.file_frames;
        dontCopy.forEach(function (key) {
          return delete copy[key];
        });
        return copy;
      }
      var outerCopy = clone(fold_file.file_frames[frame - 1]);
      dontCopy.forEach(function (key) {
        return delete outerCopy[key];
      });
      return outerCopy;
    }).reduce(function (prev, curr) {
      return Object.assign(prev, curr);
    }, {});
  };
  var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
  var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
  var isWebWorker = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";
  var htmlString = "<!DOCTYPE html><title>a</title>";
  var win = !isNode && isBrowser ? window : {};
  if (isNode) {
    var _require = require("xmldom"),
        DOMParser = _require.DOMParser,
        XMLSerializer = _require.XMLSerializer;
    win.DOMParser = DOMParser;
    win.XMLSerializer = XMLSerializer;
    win.document = new DOMParser().parseFromString(htmlString, "text/html");
  }
  var svgNS = "http://www.w3.org/2000/svg";
  var svg = function svg() {
    var svgImage = win.document.createElementNS(svgNS, "svg");
    svgImage.setAttribute("version", "1.1");
    svgImage.setAttribute("xmlns", svgNS);
    return svgImage;
  };
  var group = function group() {
    var g = win.document.createElementNS(svgNS, "g");
    return g;
  };
  var style = function style() {
    var s = win.document.createElementNS(svgNS, "style");
    s.setAttribute("type", "text/css");
    return s;
  };
  var setViewBox = function setViewBox(SVG, x, y, width, height) {
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
  var line = function line(x1, y1, x2, y2) {
    var shape = win.document.createElementNS(svgNS, "line");
    shape.setAttributeNS(null, "x1", x1);
    shape.setAttributeNS(null, "y1", y1);
    shape.setAttributeNS(null, "x2", x2);
    shape.setAttributeNS(null, "y2", y2);
    return shape;
  };
  var circle = function circle(x, y, radius) {
    var shape = win.document.createElementNS(svgNS, "circle");
    shape.setAttributeNS(null, "cx", x);
    shape.setAttributeNS(null, "cy", y);
    shape.setAttributeNS(null, "r", radius);
    return shape;
  };
  var polygon = function polygon(pointsArray) {
    var shape = win.document.createElementNS(svgNS, "polygon");
    var pointsString = pointsArray.reduce(function (a, b) {
      return "".concat(a).concat(b[0], ",").concat(b[1], " ");
    }, "");
    shape.setAttributeNS(null, "points", pointsString);
    return shape;
  };
  var bezier = function bezier(fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
    var pts = [[fromX, fromY], [c1X, c1Y], [c2X, c2Y], [toX, toY]].map(function (p) {
      return p.join(",");
    });
    var d = "M ".concat(pts[0], " C ").concat(pts[1], " ").concat(pts[2], " ").concat(pts[3]);
    var shape = win.document.createElementNS(svgNS, "path");
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
    var arrowGroup = win.document.createElementNS(svgNS, "g");
    var arrowArc = bezier(arcStart[0], arcStart[1], controlStart[0], controlStart[1], controlEnd[0], controlEnd[1], arcEnd[0], arcEnd[1]);
    arrowArc.setAttribute("style", arrowStroke);
    arrowGroup.appendChild(arrowArc);
    if (p.start) {
      var startHead = polygon(startHeadPoints);
      startHead.setAttribute("style", arrowFill);
      arrowGroup.appendChild(startHead);
    }
    if (p.end) {
      var endHead = polygon(endHeadPoints);
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
      coloring = "faces_re:matrix" in graph ? make_faces_coloring_from_faces_matrix(graph["faces_re:matrix"]) : faces_coloring(graph, 0);
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
    var boundary = get_boundary(graph).vertices.map(function (v) {
      return graph.vertices_coords[v];
    });
    var p = polygon(boundary);
    p.setAttribute("class", "boundary");
    return [p];
  };
  var svgVertices = function svgVertices(graph, options) {
    if ("vertices_coords" in graph === false) {
      return [];
    }
    var radius = options && options.radius ? options.radius : 0.01;
    var svg_vertices = graph.vertices_coords.map(function (v) {
      return circle(v[0], v[1], radius);
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
      return line(e[0][0], e[0][1], e[1][0], e[1][1]);
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
      return polygon(face);
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
      return polygon(face);
    });
    svg_faces.forEach(function (face, i) {
      return face.setAttribute("id", "".concat(i));
    });
    return finalize_faces(graph, svg_faces);
  };
  var defaultStyle = "svg * {\n  stroke-width: var(--crease-width);\n  stroke-linecap: round;\n  stroke: black;\n}\npolygon { fill: none; stroke: none; stroke-linejoin: bevel; }\n.boundary { fill: white; stroke: black;}\n.mark { stroke: #aaa;}\n.mountain { stroke: #f00;}\n.valley {\n  stroke: #00f;\n  stroke-dasharray: calc(var(--crease-width) * 2) calc(var(--crease-width) * 2);\n}\n.foldedForm .boundary { fill: none;stroke: none; }\n.foldedForm .faces polygon { stroke: black; }\n.foldedForm .faces .front { fill: #fff; }\n.foldedForm .faces .back { fill: #ddd; }\n.foldedForm .creases line { stroke: none; }\n";
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
  var document = win.document;
  var svgNS$1 = "http://www.w3.org/2000/svg";
  var shadowFilter = function shadowFilter() {
    var id_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "shadow";
    var defs = document.createElementNS(svgNS$1, "defs");
    var filter = document.createElementNS(svgNS$1, "filter");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");
    filter.setAttribute("id", id_name);
    var blur = document.createElementNS(svgNS$1, "feGaussianBlur");
    blur.setAttribute("in", "SourceAlpha");
    blur.setAttribute("stdDeviation", "0.005");
    blur.setAttribute("result", "blur");
    var offset = document.createElementNS(svgNS$1, "feOffset");
    offset.setAttribute("in", "blur");
    offset.setAttribute("result", "offsetBlur");
    var flood = document.createElementNS(svgNS$1, "feFlood");
    flood.setAttribute("flood-color", "#000");
    flood.setAttribute("flood-opacity", "0.3");
    flood.setAttribute("result", "offsetColor");
    var composite = document.createElementNS(svgNS$1, "feComposite");
    composite.setAttribute("in", "offsetColor");
    composite.setAttribute("in2", "offsetBlur");
    composite.setAttribute("operator", "in");
    composite.setAttribute("result", "offsetBlur");
    var merge = document.createElementNS(svgNS$1, "feMerge");
    var mergeNode1 = document.createElementNS(svgNS$1, "feMergeNode");
    var mergeNode2 = document.createElementNS(svgNS$1, "feMergeNode");
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
            var l = line(pts[0][0], pts[0][1], pts[1][0], pts[1][1]);
            l.setAttribute("class", creaseClass);
            renderGroup.appendChild(l);
          }
        });
      }
      if ("re:diagram_arrows" in instruction === true) {
        var r = bounding_rect(graph);
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
  var fold_to_svg = function fold_to_svg(fold) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var graph = fold;
    var o = {
      defaults: true,
      width: "500px",
      height: "500px",
      inlineStyle: true,
      stylesheet: defaultStyle,
      shadows: false,
      padding: 0,
      viewBox: null,
      boundaries: true,
      faces: true,
      edges: true,
      vertices: false
    };
    Object.assign(o, options);
    if (o.frame != null) {
      graph = flatten_frame(fold, o.frame);
    }
    if (o.svg == null) {
      o.svg = svg();
    }
    o.svg.setAttribute("class", all_classes(graph));
    o.svg.setAttribute("width", o.width);
    o.svg.setAttribute("height", o.height);
    var styleElement = style();
    o.svg.appendChild(styleElement);
    var groups = {};
    ["boundaries", "faces", "edges", "vertices"].filter(function (key) {
      return o[key];
    }).forEach(function (key) {
      groups[key] = group();
      groups[key].setAttribute("class", DISPLAY_NAME[key]);
      o.svg.appendChild(groups[key]);
    });
    Object.keys(groups).forEach(function (key) {
      return components[key](graph).forEach(function (a) {
        return groups[key].appendChild(a);
      });
    });
    if ("re:diagrams" in graph) {
      var instructionLayer = group();
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
    var rect = bounding_rect(graph);
    if (o.viewBox != null) {
      setViewBox.apply(void 0, [o.svg].concat(_toConsumableArray(o.viewBox), [o.padding]));
    } else {
      setViewBox.apply(void 0, [o.svg].concat(_toConsumableArray(rect), [o.padding]));
    }
    if (o.inlineStyle) {
      var vmin = rect[2] > rect[3] ? rect[3] : rect[2];
      var innerStyle = "\nsvg { --crease-width: ".concat(vmin * 0.005, "; }\n").concat(o.stylesheet);
      var docu = new win.DOMParser().parseFromString("<xml></xml>", "application/xml");
      var cdata = docu.createCDATASection(innerStyle);
      styleElement.appendChild(cdata);
    }
    var stringified = new win.XMLSerializer().serializeToString(o.svg);
    var beautified = vkXML(stringified);
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
  var svg$1 = function svg(input, options) {
    try {
      var fold = getObject(input);
      return fold_to_svg(fold, options);
    } catch (error) {
      throw error;
    }
  };
  var webGL = function webGL() {};
  var drawFOLD = {
    svg: svg$1,
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

  const get_file_value = function (fold_file, key_suffix) {
    if (fold_file[`file_${key_suffix}`] == null) { return ""; }
    return fold_file[`file_${key_suffix}`];
  };
  const add_frame_class = function (frame, class_name) {
    if (frame.frame_classes == null) { frame.frame_classes = []; }
    if (!frame.frame_classes.includes(class_name)) {
      frame.frame_classes.push(class_name);
    }
  };
  const bounding_rect$1 = function (graph) {
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
  const final_frame_of_class = function (fold_file, frame_class) {
    const matching_frames = fold_file.file_frames
      .filter(f => f.frame_classes.includes(frame_class));
    if (matching_frames.length === 0) { return {}; }
    const matching_final = matching_frames
      .filter(f => f.frame_classes.includes("final"))
      .shift();
    if (matching_final !== undefined) { return matching_final; }
    return matching_frames[matching_frames.length - 1];
  };
  const clone$1 = function (o) {
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
        newO[i] = clone$1(o[i]);
      }
      return newO;
    }
    newO = {};
    for (i in o) {
      if (o.hasOwnProperty(i)) {
        newO[i] = clone$1(o[i]);
      }
    }
    return newO;
  };

  const buildPage = function (fold, options) {
    const fold_file = clone$1(fold);
    const steps = fold_file.file_frames
      .filter(frame => frame.frame_classes.includes("diagrams"));
    const finalCP = final_frame_of_class(fold_file, "creasePattern");
    const finalFoldedForm = final_frame_of_class(fold_file, "foldedForm");
    steps.forEach(s => add_frame_class(s, "step"));
    add_frame_class(finalCP, "header");
    add_frame_class(finalFoldedForm, "header");
    let fold_time = Math.floor(steps.length / 4);
    if (fold_time === 0) { fold_time = 1; }
    const foldedFormBounds = bounding_rect$1(finalFoldedForm);
    const size_ratio_float = (foldedFormBounds[2] > foldedFormBounds[3]
      ? foldedFormBounds[2] : foldedFormBounds[3]);
    const size_ratio = `1 : ${size_ratio_float === 1
    ? size_ratio_float
    : size_ratio_float.toFixed(2)}`;
    const sequenceSVGs = steps
      .map(cp => drawFOLD.svg(cp, {
        inlineStyle: false,
        diagram: true,
        padding: 0.15
      }));
    const cpSVG = drawFOLD.svg(finalCP, {
      inlineStyle: false,
      diagram: false,
      padding: 0.02
    });
    const finalSVG = drawFOLD.svg(finalFoldedForm, {
      inlineStyle: false,
      diagram: false,
      padding: 0.02
    });
    finalFoldedForm.frame_classes.push("scaled");
    const finalSVGScaled = drawFOLD.svg(finalFoldedForm, {
      inlineStyle: false,
      diagram: false,
      viewBox: [
        foldedFormBounds[0],
        foldedFormBounds[1] - (1 - foldedFormBounds[3]),
        1, 1]
    });
    const writtenInstructions = sequenceSVGs
      .map((svg, i) => steps[i]["re:diagrams"])
      .filter(a => a != null)
      .map(seq => seq.map(a => a["re:diagram_instructions"])
        .filter(a => a != null)
        .map(inst => inst.en)
        .join("\n"));
    const sequenceHTML = sequenceSVGs
      .reduce((prev, curr, i) => `${prev}
<div class="step">
  <h3 class="number">${(i + 1)}</h3>
  ${curr}
  <p>${(writtenInstructions[i] || "")}</p>
</div>
`, "");
    return `<html>
<head>
<title>Rabbit Ear</title>
<style>
${options.style}
</style>
</head>
<body>
  <div class="page-grid">
    <div class="header">
      ${cpSVG}
      ${finalSVG}
      ${finalSVGScaled}
      <h1 class="title">${get_file_value(fold_file, "title")}</h1>
      <p class="author">designed by ${get_file_value(fold_file, "author")}</p>
      <p class="description">${get_file_value(fold_file, "description")}</p>
      <p class="size-ratio">ratio ${size_ratio}</p>
      <p class="fold-time">fold time<br>${fold_time} ${(fold_time === 1 ? "minute" : "minutes")}</p>
      <p class="attribution small">rabbitEar.org</p>
    </div>
    ${sequenceHTML}
  </div>
</body>
</html>`;
  };

  const DiagramMaker = function (fold_file, options = {}) {
    if (fold_file.length === 0) { return ""; }
    const o = {};
    Object.assign(o, options);
    if (o.shadows == null) { o.shadows = false; }
    if (o.style == null) { o.style = defaultPageStyle; }
    return buildPage(fold_file, o);
  };

  return DiagramMaker;

})));
