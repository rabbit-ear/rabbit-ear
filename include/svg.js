/* SVG (c) Robby Kraft, MIT License */
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

var isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
var isWebWorker = (typeof self === "undefined" ? "undefined" : _typeof(self)) === "object" && self.constructor && self.constructor.name === "DedicatedWorkerGlobalScope";

var htmlString = "<!DOCTYPE html><title>a</title>";
var win = {};

if (isNode) {
  var _require = require("xmldom"),
      DOMParser$1 = _require.DOMParser,
      XMLSerializer$1 = _require.XMLSerializer;

  win.DOMParser = DOMParser$1;
  win.XMLSerializer = XMLSerializer$1;
  win.document = new DOMParser$1().parseFromString(htmlString, "text/html");
} else if (isBrowser) {
  win.DOMParser = window.DOMParser;
  win.XMLSerializer = window.XMLSerializer;
  win.document = window.document;
}

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

var removeChildren = function removeChildren(parent) {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};
var getWidth = function getWidth(svg) {
  var w = parseInt(svg.getAttributeNS(null, "width"), 10);
  return w != null && !isNaN(w) ? w : svg.getBoundingClientRect().width;
};
var getHeight = function getHeight(svg) {
  var h = parseInt(svg.getAttributeNS(null, "height"), 10);
  return h != null && !isNaN(h) ? h : svg.getBoundingClientRect().height;
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

var downloadInBrowser = function downloadInBrowser(filename, contentsAsString) {
  var blob = new window.Blob([contentsAsString], {
    type: "text/plain"
  });
  var a = document.createElement("a");
  a.setAttribute("href", window.URL.createObjectURL(blob));
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
};

var getPageCSS = function getPageCSS() {
  var css = [];

  for (var s = 0; s < document.styleSheets.length; s += 1) {
    var sheet = document.styleSheets[s];

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
var save = function save(svg) {
  var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "image.svg";
  var includeDOMCSS = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (includeDOMCSS) {
    var styleContainer = document.createElementNS("http://www.w3.org/2000/svg", "style");
    styleContainer.setAttribute("type", "text/css");
    styleContainer.innerHTML = getPageCSS();
    svg.appendChild(styleContainer);
  }

  var source = new XMLSerializer().serializeToString(svg);
  var formattedString = vkXML(source);

  if (window != null) {
    downloadInBrowser(filename, formattedString);
  } else {
    console.warn("save() meant for in-browser use");
  }
};

var load = function load(input, callback) {
  if (typeof input === "string" || input instanceof String) {
    var xml = new DOMParser().parseFromString(input, "text/xml");
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
      return new DOMParser().parseFromString(str, "text/xml");
    }).then(function (svgData) {
      var allSVGs = svgData.getElementsByTagName("svg");

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

var DOM = /*#__PURE__*/Object.freeze({
  removeChildren: removeChildren,
  getWidth: getWidth,
  getHeight: getHeight,
  addClass: addClass,
  removeClass: removeClass,
  setClass: setClass,
  setID: setID,
  getPageCSS: getPageCSS,
  save: save,
  load: load
});

var setViewBox = function setViewBox(svg, x, y, width, height) {
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
  setViewBox(svg, 0, 0, width, height);
};

var getViewBox = function getViewBox(svg) {
  var vb = svg.getAttribute("viewBox");
  return vb == null ? undefined : vb.split(" ").map(function (n) {
    return parseFloat(n);
  });
};
var scaleViewBox = function scaleViewBox(svg, scale) {
  var origin_x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var origin_y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  if (scale < 1e-8) {
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
  setViewBox(svg, new_top_left.x, new_top_left.y, new_bot_right.x - new_top_left.x, new_bot_right.y - new_top_left.y);
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

var ViewBox = /*#__PURE__*/Object.freeze({
  setViewBox: setViewBox,
  getViewBox: getViewBox,
  scaleViewBox: scaleViewBox,
  translateViewBox: translateViewBox,
  convertToViewBox: convertToViewBox
});

var attachClassMethods = function attachClassMethods(element) {
  var el = element;

  el.removeChildren = function () {
    return removeChildren(element);
  };

  el.addClass = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return addClass.apply(DOM, [element].concat(args));
  };

  el.removeClass = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return removeClass.apply(DOM, [element].concat(args));
  };

  el.setClass = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return setClass.apply(DOM, [element].concat(args));
  };

  el.setID = function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return setID.apply(DOM, [element].concat(args));
  };
};
var attachViewBoxMethods = function attachViewBoxMethods(element) {
  var el = element;
  ["setViewBox", "getViewBox", "scaleViewBox", "translateViewBox", "convertToViewBox"].forEach(function (func) {
    el[func] = function () {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return ViewBox[func].apply(ViewBox, [el].concat(args));
    };
  });
};
var attachAppendableMethods = function attachAppendableMethods(element, methods) {
  var el = element;
  Object.keys(methods).forEach(function (key) {
    el[key] = function () {
      var g = methods[key].apply(methods, arguments);
      element.appendChild(g);
      return g;
    };
  });
};

var svgNS = "http://www.w3.org/2000/svg";
var setPoints = function setPoints(polygon, pointsArray) {
  if (pointsArray == null || pointsArray.constructor !== Array) {
    return;
  }

  var pointsString = pointsArray.map(function (el) {
    return el.constructor === Array ? el : [el.x, el.y];
  }).reduce(function (prev, curr) {
    return "".concat(prev).concat(curr[0], ",").concat(curr[1], " ");
  }, "");
  polygon.setAttributeNS(null, "points", pointsString);
};
var setArc = function setArc(shape, x, y, radius, startAngle, endAngle) {
  var includeCenter = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
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
};
var line = function line(x1, y1, x2, y2) {
  var shape = win.document.createElementNS(svgNS, "line");

  if (x1) {
    shape.setAttributeNS(null, "x1", x1);
  }

  if (y1) {
    shape.setAttributeNS(null, "y1", y1);
  }

  if (x2) {
    shape.setAttributeNS(null, "x2", x2);
  }

  if (y2) {
    shape.setAttributeNS(null, "y2", y2);
  }

  attachClassMethods(shape);
  return shape;
};
var circle = function circle(x, y, radius) {
  var shape = win.document.createElementNS(svgNS, "circle");

  if (x) {
    shape.setAttributeNS(null, "cx", x);
  }

  if (y) {
    shape.setAttributeNS(null, "cy", y);
  }

  if (radius) {
    shape.setAttributeNS(null, "r", radius);
  }

  attachClassMethods(shape);
  return shape;
};
var ellipse = function ellipse(x, y, rx, ry) {
  var shape = win.document.createElementNS(svgNS, "ellipse");

  if (x) {
    shape.setAttributeNS(null, "cx", x);
  }

  if (y) {
    shape.setAttributeNS(null, "cy", y);
  }

  if (rx) {
    shape.setAttributeNS(null, "rx", rx);
  }

  if (ry) {
    shape.setAttributeNS(null, "ry", ry);
  }

  attachClassMethods(shape);
  return shape;
};
var rect = function rect(x, y, width, height) {
  var shape = win.document.createElementNS(svgNS, "rect");

  if (x) {
    shape.setAttributeNS(null, "x", x);
  }

  if (y) {
    shape.setAttributeNS(null, "y", y);
  }

  if (width) {
    shape.setAttributeNS(null, "width", width);
  }

  if (height) {
    shape.setAttributeNS(null, "height", height);
  }

  attachClassMethods(shape);
  return shape;
};
var polygon = function polygon(pointsArray) {
  var shape = win.document.createElementNS(svgNS, "polygon");
  setPoints(shape, pointsArray);
  attachClassMethods(shape);
  return shape;
};
var polyline = function polyline(pointsArray) {
  var shape = win.document.createElementNS(svgNS, "polyline");
  setPoints(shape, pointsArray);
  attachClassMethods(shape);
  return shape;
};
var bezier = function bezier(fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
  var pts = [[fromX, fromY], [c1X, c1Y], [c2X, c2Y], [toX, toY]].map(function (p) {
    return p.join(",");
  });
  var d = "M ".concat(pts[0], " C ").concat(pts[1], " ").concat(pts[2], " ").concat(pts[3]);
  var shape = win.document.createElementNS(svgNS, "path");
  shape.setAttributeNS(null, "d", d);
  attachClassMethods(shape);
  return shape;
};
var text = function text(textString, x, y) {
  var shape = win.document.createElementNS(svgNS, "text");
  shape.innerHTML = textString;
  shape.setAttributeNS(null, "x", x);
  shape.setAttributeNS(null, "y", y);
  attachClassMethods(shape);
  return shape;
};
var wedge = function wedge(x, y, radius, angleA, angleB) {
  var shape = win.document.createElementNS(svgNS, "path");
  setArc(shape, x, y, radius, angleA, angleB, true);
  attachClassMethods(shape);
  return shape;
};
var arc = function arc(x, y, radius, angleA, angleB) {
  var shape = win.document.createElementNS(svgNS, "path");
  setArc(shape, x, y, radius, angleA, angleB, false);
  attachClassMethods(shape);
  return shape;
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
  return polygon(points);
};

var svgNS$1 = "http://www.w3.org/2000/svg";
var straightArrow = function straightArrow(startPoint, endPoint, options) {
  var p = {
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
    end: true
  };

  if (_typeof(options) === "object" && options !== null) {
    Object.assign(p, options);
  }

  var arrowFill = ["stroke:none", "fill:".concat(p.color), p.fillStyle, "pointer-events:none"].filter(function (a) {
    return a !== "";
  }).join(";");
  var arrowStroke = ["fill:none", "stroke:".concat(p.color), "stroke-width:".concat(p.strokeWidth), p.strokeStyle].filter(function (a) {
    return a !== "";
  }).join(";");
  var thinStroke = Math.floor(p.strokeWidth * 3) / 10;
  var thinSpace = Math.floor(p.strokeWidth * 6) / 10;
  var highlightStroke = ["fill:none", "stroke:".concat(p.highlight), "stroke-width:".concat(p.strokeWidth * 0.5), "stroke-dasharray:".concat(thinStroke, " ").concat(thinSpace), "stroke-linecap:round", p.strokeStyle].filter(function (a) {
    return a !== "";
  }).join(";");
  var highlightFill = ["stroke:none", "fill:".concat(p.highlight), p.fillStyle, "pointer-events:none"].filter(function (a) {
    return a !== "";
  }).join(";");
  var start = startPoint;
  var end = endPoint;
  var vec = [end[0] - start[0], end[1] - start[1]];
  var arrowLength = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1]);
  var arrowVector = [vec[0] / arrowLength, vec[1] / arrowLength];
  var arrow90 = [arrowVector[1], -arrowVector[0]];
  start = [startPoint[0] + arrowVector[0] * (p.start ? 1 : 0) * p.padding, startPoint[1] + arrowVector[1] * (p.start ? 1 : 0) * p.padding];
  end = [endPoint[0] - arrowVector[0] * (p.end ? 1 : 0) * p.padding, endPoint[1] - arrowVector[1] * (p.end ? 1 : 0) * p.padding];
  var endHead = [[end[0] + arrow90[0] * p.width, end[1] + arrow90[1] * p.width], [end[0] - arrow90[0] * p.width, end[1] - arrow90[1] * p.width], [end[0] + arrowVector[0] * p.length, end[1] + arrowVector[1] * p.length]];
  var startHead = [[start[0] - arrow90[0] * p.width, start[1] - arrow90[1] * p.width], [start[0] + arrow90[0] * p.width, start[1] + arrow90[1] * p.width], [start[0] - arrowVector[0] * p.length, start[1] - arrowVector[1] * p.length]];
  var arrow = win.document.createElementNS(svgNS$1, "g");
  var l = line(start[0], start[1], end[0], end[1]);
  l.setAttribute("style", arrowStroke);
  arrow.appendChild(l);

  if (p.end) {
    var endArrowPoly = polygon(endHead);
    endArrowPoly.setAttribute("style", arrowFill);
    arrow.appendChild(endArrowPoly);
  }

  if (p.start) {
    var startArrowPoly = polygon(startHead);
    startArrowPoly.setAttribute("style", arrowFill);
    arrow.appendChild(startArrowPoly);
  }

  if (p.highlight !== undefined) {
    var hScale = 0.6;
    var centering = [arrowVector[0] * p.length * 0.09, arrowVector[1] * p.length * 0.09];
    var endHeadHighlight = [[centering[0] + end[0] + arrow90[0] * (p.width * hScale), centering[1] + end[1] + arrow90[1] * (p.width * hScale)], [centering[0] + end[0] - arrow90[0] * (p.width * hScale), centering[1] + end[1] - arrow90[1] * (p.width * hScale)], [centering[0] + end[0] + arrowVector[0] * (p.length * hScale), centering[1] + end[1] + arrowVector[1] * (p.length * hScale)]];
    var startHeadHighlight = [[-centering[0] + start[0] - arrow90[0] * (p.width * hScale), -centering[1] + start[1] - arrow90[1] * (p.width * hScale)], [-centering[0] + start[0] + arrow90[0] * (p.width * hScale), -centering[1] + start[1] + arrow90[1] * (p.width * hScale)], [-centering[0] + start[0] - arrowVector[0] * (p.length * hScale), -centering[1] + start[1] - arrowVector[1] * (p.length * hScale)]];
    var highline = line(start[0], start[1], end[0], end[1]);
    highline.setAttribute("style", highlightStroke);
    arrow.appendChild(highline);

    if (p.end) {
      var endArrowHighlight = polygon(endHeadHighlight);
      endArrowHighlight.setAttribute("style", highlightFill);
      arrow.appendChild(endArrowHighlight);
    }

    if (p.start) {
      var startArrowHighlight = polygon(startHeadHighlight);
      startArrowHighlight.setAttribute("style", highlightFill);
      arrow.appendChild(startArrowHighlight);
    }
  }

  return arrow;
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
  var arrowGroup = win.document.createElementNS(svgNS$1, "g");
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

var svgNS$2 = "http://www.w3.org/2000/svg";
var drawMethods = {
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
  straightArrow: straightArrow,
  arcArrow: arcArrow,
  regularPolygon: regularPolygon
};
var setupSVG = function setupSVG(svgImage) {
  attachClassMethods(svgImage);
  attachViewBoxMethods(svgImage);
  attachAppendableMethods(svgImage, drawMethods);
};
var svg = function svg() {
  var svgImage = win.document.createElementNS(svgNS$2, "svg");
  svgImage.setAttribute("version", "1.1");
  svgImage.setAttribute("xmlns", svgNS$2);
  setupSVG(svgImage);
  return svgImage;
};
var group = function group() {
  var g = win.document.createElementNS(svgNS$2, "g");
  attachClassMethods(g);
  attachAppendableMethods(g, drawMethods);
  return g;
};
var style = function style() {
  var s = win.document.createElementNS(svgNS$2, "style");
  s.setAttribute("type", "text/css");
  return s;
};
drawMethods.group = group;

var Names = {
  begin: "onMouseDown",
  enter: "onMouseEnter",
  leave: "onMouseLeave",
  move: "onMouseMove",
  end: "onMouseUp",
  scroll: "onScroll"
};

var Pointer = function Pointer(node) {
  var _node = node;

  var _pointer = Object.create(null);

  Object.assign(_pointer, {
    isPressed: false,
    position: [0, 0],
    pressed: [0, 0],
    drag: [0, 0],
    prev: [0, 0],
    x: 0,
    y: 0
  });

  var getPointer = function getPointer() {
    var m = _pointer.position.slice();

    Object.keys(_pointer).filter(function (key) {
      return _typeof(key) === "object";
    }).forEach(function (key) {
      return m[key] = _pointer[key].slice();
    });
    Object.keys(_pointer).filter(function (key) {
      return _typeof(key) !== "object";
    }).forEach(function (key) {
      return m[key] = _pointer[key];
    });
    return Object.freeze(m);
  };

  var setPosition = function setPosition(clientX, clientY) {
    _pointer.position = convertToViewBox(_node, clientX, clientY);
    _pointer.x = _pointer.position[0];
    _pointer.y = _pointer.position[1];
  };

  var didRelease = function didRelease(clientX, clientY) {
    _pointer.isPressed = false;
  };

  var didPress = function didPress(clientX, clientY) {
    _pointer.isPressed = true;
    _pointer.pressed = convertToViewBox(_node, clientX, clientY);
    setPosition(clientX, clientY);
  };

  var didMove = function didMove(clientX, clientY) {
    _pointer.prev = _pointer.position;
    setPosition(clientX, clientY);

    if (_pointer.isPressed) {
      updateDrag();
    }
  };

  var updateDrag = function updateDrag() {
    _pointer.drag = [_pointer.position[0] - _pointer.pressed[0], _pointer.position[1] - _pointer.pressed[1]];
    _pointer.drag.x = _pointer.drag[0];
    _pointer.drag.y = _pointer.drag[1];
  };

  var _this = {};
  Object.defineProperty(_this, "getPointer", {
    value: getPointer
  });
  Object.defineProperty(_this, "didMove", {
    value: didMove
  });
  Object.defineProperty(_this, "didPress", {
    value: didPress
  });
  Object.defineProperty(_this, "didRelease", {
    value: didRelease
  });
  Object.defineProperty(_this, "node", {
    set: function set(n) {
      _node = n;
    }
  });
  return _this;
};

function Events (node) {
  var _node;

  var _pointer = Pointer(node);

  var _events = {};

  var fireEvents = function fireEvents(event, events) {
    if (events == null) {
      return;
    }

    if (events.length > 0) {
      event.preventDefault();
    }

    var mouse = _pointer.getPointer();

    events.forEach(function (f) {
      return f(mouse);
    });
  };

  var mouseMoveHandler = function mouseMoveHandler(event) {
    var events = _events[Names.move];

    _pointer.didMove(event.clientX, event.clientY);

    fireEvents(event, events);
  };

  var mouseDownHandler = function mouseDownHandler(event) {
    var events = _events[Names.begin];

    _pointer.didPress(event.clientX, event.clientY);

    fireEvents(event, events);
  };

  var mouseUpHandler = function mouseUpHandler(event) {
    mouseMoveHandler(event);
    var events = _events[Names.end];

    _pointer.didRelease(event.clientX, event.clientY);

    fireEvents(event, events);
  };

  var mouseLeaveHandler = function mouseLeaveHandler(event) {
    var events = _events[Names.leave];

    _pointer.didMove(event.clientX, event.clientY);

    fireEvents(event, events);
  };

  var mouseEnterHandler = function mouseEnterHandler(event) {
    var events = _events[Names.enter];

    _pointer.didMove(event.clientX, event.clientY);

    fireEvents(event, events);
  };

  var touchStartHandler = function touchStartHandler(event) {
    var events = _events[Names.begin];
    var touch = event.touches[0];

    if (touch == null) {
      return;
    }

    _pointer.didPress(touch.clientX, touch.clientY);

    fireEvents(event, events);
  };

  var touchEndHandler = function touchEndHandler(event) {
    var events = _events[Names.end];

    _pointer.didRelease();

    fireEvents(event, events);
  };

  var touchMoveHandler = function touchMoveHandler(event) {
    var events = _events[Names.move];
    var touch = event.touches[0];

    if (touch == null) {
      return;
    }

    _pointer.didMove(touch.clientX, touch.clientY);

    fireEvents(event, events);
  };

  var scrollHandler = function scrollHandler(event) {
    var events = _events[Names.scroll];
    var e = {
      deltaX: event.deltaX,
      deltaY: event.deltaY,
      deltaZ: event.deltaZ
    };
    e.position = convertToViewBox(_node, event.clientX, event.clientY);
    e.x = e.position[0];
    e.y = e.position[1];

    if (events == null) {
      return;
    }

    if (events.length > 0) {
      event.preventDefault();
    }

    events.forEach(function (f) {
      return f(e);
    });
  };

  var _animate, _intervalID, _animationFrame;

  var updateAnimationHandler = function updateAnimationHandler(handler) {
    if (_animate != null) {
      clearInterval(_intervalID);
    }

    _animate = handler;

    if (_animate != null) {
      _animationFrame = 0;
      _intervalID = setInterval(function () {
        var animObj = {
          "time": _node.getCurrentTime(),
          "frame": _animationFrame++
        };

        _animate(animObj);
      }, 1000 / 60);
    }
  };

  var handlers = {
    mouseup: mouseUpHandler,
    mousedown: mouseDownHandler,
    mousemove: mouseMoveHandler,
    mouseleave: mouseLeaveHandler,
    mouseenter: mouseEnterHandler,
    touchend: touchEndHandler,
    touchmove: touchMoveHandler,
    touchstart: touchStartHandler,
    touchcancel: touchEndHandler,
    wheel: scrollHandler
  };

  var addEventListener = function addEventListener(eventName, func) {
    if (typeof func !== "function") {
      throw "must supply a function type to addEventListener";
    }

    if (_events[eventName] === undefined) {
      _events[eventName] = [];
    }

    _events[eventName].push(func);
  };

  var attachHandlers = function attachHandlers(element) {
    Object.keys(handlers).forEach(function (key) {
      return element.addEventListener(key, handlers[key], false);
    });
    updateAnimationHandler(_animate);
  };

  var removeHandlers = function removeHandlers(element) {
    Object.keys(handlers).forEach(function (key) {
      return element.removeEventListener(key, handlers[key], false);
    });

    if (_animate != null) {
      clearInterval(_intervalID);
    }
  };

  var setup = function setup(node) {
    if (_node != null && typeof node.removeEventListener === "function") {
      removeHandlers(_node);
    }

    _node = node;
    _pointer.node = _node;
    Object.keys(Names).map(function (key) {
      return Names[key];
    }).forEach(function (key) {
      Object.defineProperty(_node, key, {
        set: function set(handler) {
          addEventListener(key, handler);
        }
      });
    });
    Object.defineProperty(_node, "animate", {
      set: function set(handler) {
        updateAnimationHandler(handler);
      }
    });
    Object.defineProperty(_node, "mouse", {
      get: function get() {
        return _pointer.getPointer();
      }
    });
    Object.defineProperty(_node, "pointer", {
      get: function get() {
        return _pointer.getPointer();
      }
    });

    if (typeof _node.addEventListener === "function") {
      attachHandlers(_node);
    }
  };

  setup(node);
  return {
    setup: setup,
    addEventListener: addEventListener,
    remove: function remove() {
      removeHandlers(_node);
    }
  };
}

var getElement = function getElement() {
  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  var element = params.filter(function (arg) {
    return arg instanceof HTMLElement;
  }).shift();
  var idElement = params.filter(function (a) {
    return typeof a === "string" || a instanceof String;
  }).map(function (str) {
    return win.document.getElementById(str);
  }).shift();

  if (element != null) {
    return element;
  }

  return idElement != null ? idElement : win.document.body;
};

var initSize = function initSize(svgElement, params) {
  var numbers = params.filter(function (arg) {
    return !isNaN(arg);
  });

  if (numbers.length >= 2) {
    svgElement.setAttributeNS(null, "width", numbers[0]);
    svgElement.setAttributeNS(null, "height", numbers[1]);
    setViewBox(svgElement, 0, 0, numbers[0], numbers[1]);
  } else if (svgElement.getAttribute("viewBox") == null) {
    var rect = svgElement.getBoundingClientRect();
    setViewBox(svgElement, 0, 0, rect.width, rect.height);
  }
};

var attachSVGMethods = function attachSVGMethods(element) {
  Object.defineProperty(element, "w", {
    get: function get() {
      return getWidth(element);
    },
    set: function set(w) {
      return element.setAttributeNS(null, "width", w);
    }
  });
  Object.defineProperty(element, "h", {
    get: function get() {
      return getHeight(element);
    },
    set: function set(h) {
      return element.setAttributeNS(null, "height", h);
    }
  });

  element.getWidth = function () {
    return getWidth(element);
  };

  element.getHeight = function () {
    return getHeight(element);
  };

  element.setWidth = function (w) {
    return element.setAttributeNS(null, "width", w);
  };

  element.setHeight = function (h) {
    return element.setAttributeNS(null, "height", h);
  };

  element.save = function () {
    var filename = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "image.svg";
    return save(element, filename);
  };

  element.load = function (data, callback) {
    load(data, function (newSVG, error) {
      var parent = element.parentNode;

      if (newSVG != null) {
        newSVG.events = element.events;
        setupSVG(newSVG);

        if (newSVG.events == null) {
          newSVG.events = Events(newSVG);
        } else {
          newSVG.events.setup(newSVG);
        }

        attachSVGMethods(newSVG);

        if (parent != null) {
          parent.insertBefore(newSVG, element);
        }

        element.remove();
        element = newSVG;
      }

      if (callback != null) {
        callback(element, error);
      }
    });
  };
};

var svgImage = function svgImage() {
  for (var _len2 = arguments.length, params = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    params[_key2] = arguments[_key2];
  }

  var image = svg();
  initSize(image, params);
  attachSVGMethods(image);
  image.events = Events(image);

  var setup = function setup() {
    initSize(image, params);
    var parent = getElement.apply(void 0, params);

    if (parent != null) {
      parent.appendChild(image);
    }

    params.filter(function (arg) {
      return typeof arg === "function";
    }).forEach(function (func) {
      return func();
    });
  };

  if (win.document.readyState === "loading") {
    win.document.addEventListener("DOMContentLoaded", setup);
  } else {
    setup();
  }

  return image;
};

var controlPoint = function controlPoint(parent) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (options.radius == null) {
    options.radius = 1;
  }

  if (options.fill == null) {
    options.fill = "#000";
  }

  if (options.stroke == null) {
    options.stroke = "none";
  }

  var c = circle(0, 0, options.radius);
  c.setAttribute("style", "fill:".concat(options.fill, ";stroke:").concat(options.stroke, ";"));
  var position = [0, 0];
  var selected = false;

  if (parent != null) {
    parent.appendChild(c);
  }

  var setPosition = function setPosition(x, y) {
    position[0] = x;
    position[1] = y;
    c.setAttribute("cx", x);
    c.setAttribute("cy", y);
  };

  if ("position" in options) {
    var pos = options.position;

    if (pos[0] != null) {
      setPosition.apply(void 0, _toConsumableArray(pos));
    } else if (pos.x != null) {
      setPosition(pos.x, pos.y);
    }
  }

  var updatePosition = function updatePosition(input) {
    return input;
  };

  var onMouseMove = function onMouseMove(mouse) {
    if (selected) {
      var _pos = updatePosition(mouse);

      setPosition(_pos[0], _pos[1]);
    }
  };

  var onMouseUp = function onMouseUp() {
    selected = false;
  };

  var distance = function distance(mouse) {
    return Math.sqrt(Math.pow(mouse[0] - position[0], 2) + Math.pow(mouse[1] - position[1], 2));
  };

  var remove = function remove() {
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

    get position() {
      return [].concat(position);
    },

    onMouseUp: onMouseUp,
    onMouseMove: onMouseMove,
    distance: distance,
    remove: remove,

    set positionDidUpdate(method) {
      updatePosition = method;
    },

    set selected(value) {
      selected = true;
    }

  };
};

var controls = function controls(parent, number, options) {
  if (options == null) {
    options = {};
  }

  if (options.parent == null) {
    options.parent = parent;
  }

  if (options.radius == null) {
    options.radius = 1;
  }

  if (options.fill == null) {
    options.fill = "#000000";
  }

  var points = Array.from(Array(number)).map(function () {
    return controlPoint(options.parent, options);
  });
  var selected;

  var mouseDownHandler = function mouseDownHandler(event) {
    event.preventDefault();
    var mouse = convertToViewBox(parent, event.clientX, event.clientY);

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

  var mouseMoveHandler = function mouseMoveHandler(event) {
    event.preventDefault();
    var mouse = convertToViewBox(parent, event.clientX, event.clientY);
    points.forEach(function (p) {
      return p.onMouseMove(mouse);
    });
  };

  var mouseUpHandler = function mouseUpHandler(event) {
    event.preventDefault();
    points.forEach(function (p) {
      return p.onMouseUp();
    });
    selected = undefined;
  };

  var touchDownHandler = function touchDownHandler(event) {
    event.preventDefault();
    var touch = event.touches[0];

    if (touch == null) {
      return;
    }

    var pointer = convertToViewBox(parent, touch.clientX, touch.clientY);

    if (!(points.length > 0)) {
      return;
    }

    selected = points.map(function (p, i) {
      return {
        i: i,
        d: p.distance(pointer)
      };
    }).sort(function (a, b) {
      return a.d - b.d;
    }).shift().i;
    points[selected].selected = true;
  };

  var touchMoveHandler = function touchMoveHandler(event) {
    event.preventDefault();
    var touch = event.touches[0];

    if (touch == null) {
      return;
    }

    var pointer = convertToViewBox(parent, touch.clientX, touch.clientY);
    points.forEach(function (p) {
      return p.onMouseMove(pointer);
    });
  };

  var touchUpHandler = function touchUpHandler(event) {
    event.preventDefault();
    points.forEach(function (p) {
      return p.onMouseUp();
    });
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
    get: function get() {
      return selected;
    }
  });
  Object.defineProperty(points, "selected", {
    get: function get() {
      return points[selected];
    }
  });
  Object.defineProperty(points, "removeAll", {
    value: function value() {
      points.forEach(function (tp) {
        return tp.remove();
      });
      points.splice(0, points.length);
      selected = undefined;
    }
  });
  Object.defineProperty(points, "add", {
    value: function value(opt) {
      points.push(controlPoint(parent, opt));
    }
  });
  return points;
};

export { svg, group, style, line, circle, ellipse, rect, polygon, polyline, bezier, text, wedge, arc, setPoints, setArc, regularPolygon, straightArrow, arcArrow, setViewBox, getViewBox, scaleViewBox, translateViewBox, convertToViewBox, removeChildren, save, load, svgImage as image, controls, controlPoint };
