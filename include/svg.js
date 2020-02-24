/* SVG (c) Robby Kraft, MIT License */
const isBrowser = typeof window !== "undefined"
  && typeof window.document !== "undefined";
const isNode = typeof process !== "undefined"
  && process.versions != null
  && process.versions.node != null;

const htmlString = "<!DOCTYPE html><title> </title>";
const win = (function () {
  let w = {};
  if (isNode) {
    const { DOMParser, XMLSerializer } = require("xmldom");
    w.DOMParser = DOMParser;
    w.XMLSerializer = XMLSerializer;
    w.document = new DOMParser().parseFromString(htmlString, "text/html");
  } else if (isBrowser) {
    w = window;
  }
  return w;
}());

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

var NS = "http://www.w3.org/2000/svg";

const downloadInBrowser = function (filename, contentsAsString) {
  const blob = new win.Blob([contentsAsString], { type: "text/plain" });
  const a = win.document.createElement("a");
  a.setAttribute("href", win.URL.createObjectURL(blob));
  a.setAttribute("download", filename);
  win.document.body.appendChild(a);
  a.click();
  win.document.body.removeChild(a);
};
const getPageCSS = function () {
  const css = [];
  for (let s = 0; s < win.document.styleSheets.length; s += 1) {
    const sheet = win.document.styleSheets[s];
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
const SAVE_OPTIONS = () => ({
  output: "string",
  windowStyle: false,
  filename: "image.svg"
});
const save = function (svg, options) {
  if (typeof options === "string" || options instanceof String) {
    const filename = options;
    options = SAVE_OPTIONS();
    options.filename = filename;
  } else if (typeof options !== "object" || options === null) {
    options = SAVE_OPTIONS();
  } else {
    const newOptions = SAVE_OPTIONS();
    Object.keys(options).forEach((key) => { newOptions[key] = options[key]; });
    options = newOptions;
  }
  if (options.windowStyle) {
    const styleContainer = win.document.createElementNS(NS, "style");
    styleContainer.setAttribute("type", "text/css");
    styleContainer.innerHTML = getPageCSS();
    svg.appendChild(styleContainer);
  }
  const source = (new win.XMLSerializer()).serializeToString(svg);
  const formattedString = vkXML(source);
  if (isBrowser && !isNode) {
    downloadInBrowser(options.filename, formattedString);
  }
  return (options.output === "svg" ? svg : formattedString);
};
const load = function (input, callback) {
  if (typeof input === "string" || input instanceof String) {
    const xml = (new win.DOMParser()).parseFromString(input, "text/xml");
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
      .then(str => (new win.DOMParser())
        .parseFromString(str, "text/xml"))
      .then((svgData) => {
        const allSVGs = svgData.getElementsByTagName("svg");
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

var File = /*#__PURE__*/Object.freeze({
  __proto__: null,
  save: save,
  load: load
});

const bindSVGMethodsTo = function (svg, environment) {
  Object.getOwnPropertyNames(svg)
    .filter(p => typeof svg[p] === "function")
    .forEach((name) => { environment[name] = svg[name].bind(svg); });
  const forbidden = ["svg", "style", "setPoints", "setArc", "setEllipticalArc", "setBezier"];
  Object.keys(win.SVG)
    .filter(key => environment[key] === undefined)
    .filter(key => forbidden.indexOf(key) === -1)
    .forEach((key) => { environment[key] = win.SVG[key]; });
  Object.defineProperty(win, "mousePressed", {
    set: (value) => { svg.mousePressed = value; },
    get: () => svg.mousePressed
  });
  Object.defineProperty(win, "mouseReleased", {
    set: (value) => { svg.mouseReleased = value; },
    get: () => svg.mouseReleased
  });
  Object.defineProperty(win, "mouseMoved", {
    set: (value) => { svg.mouseMoved = value; },
    get: () => svg.mouseMoved
  });
  Object.defineProperty(win, "scroll", {
    set: (value) => { svg.scroll = value; },
    get: () => svg.scroll
  });
  Object.defineProperty(win, "animate", {
    set: (value) => { svg.animate = value; },
    get: () => svg.animate
  });
  Object.defineProperty(win, "fps", {
    set: (value) => { svg.fps = value; },
    get: () => svg.fps
  });
};
const globalize = function (svg, ...args) {
  let element = svg;
  if (element == null) {
    element = win.SVG(...args);
  }
  bindSVGMethodsTo(element, win);
  return element;
};

const getViewBox = function (svg) {
  const vb = svg.getAttribute("viewBox");
  return (vb == null
    ? undefined
    : vb.split(" ").map(n => parseFloat(n)));
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
const translateViewBox = function (svg, dx, dy) {
  const viewBox = getViewBox(svg);
  if (viewBox == null) {
    setDefaultViewBox(svg);
  }
  viewBox[0] += dx;
  viewBox[1] += dy;
  svg.setAttributeNS(null, "viewBox", viewBox.join(" "));
};
const scaleViewBox = function (svg, scale, origin_x = 0, origin_y = 0) {
  if (Math.abs(scale) < 1e-8) { scale = 0.01; }
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

var ViewBox = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getViewBox: getViewBox,
  setViewBox: setViewBox,
  convertToViewBox: convertToViewBox,
  translateViewBox: translateViewBox,
  scaleViewBox: scaleViewBox
});

const Pointer = function (node) {
  const pointer = Object.create(null);
  Object.assign(pointer, {
    isPressed: false,
    position: [0, 0],
    pressed: [0, 0],
    drag: [0, 0],
    previous: [0, 0],
    x: 0,
    y: 0
  });
  [pointer.position.x, pointer.position.y] = [0, 0];
  [pointer.pressed.x, pointer.pressed.y] = [0, 0];
  [pointer.drag.x, pointer.drag.y] = [0, 0];
  [pointer.previous.x, pointer.previous.y] = [0, 0];
  const copyPointer = function () {
    const m = pointer.position.slice();
    Object.keys(pointer)
      .filter(key => typeof key === "object")
      .forEach((key) => { m[key] = pointer[key].slice(); });
    Object.keys(pointer)
      .filter(key => typeof key !== "object")
      .forEach((key) => { m[key] = pointer[key]; });
    return Object.freeze(m);
  };
  const setPosition = function (clientX, clientY) {
    pointer.position = convertToViewBox(node, clientX, clientY);
    [pointer.x, pointer.y] = pointer.position;
  };
  const updateDrag = function () {
    pointer.drag = [
      pointer.position[0] - pointer.pressed[0],
      pointer.position[1] - pointer.pressed[1]
    ];
    [pointer.drag.x, pointer.drag.y] = pointer.drag;
  };
  const thisPointer = {};
  const move = function (clientX, clientY, isPressed = false) {
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
      [pointer.drag.x, pointer.drag.y] = pointer.drag;
      [pointer.pressed.x, pointer.pressed.y] = pointer.pressed;
    }
    return thisPointer;
  };
  const release = function () {
    pointer.isPressed = false;
    return thisPointer;
  };
  Object.defineProperty(thisPointer, "release", { value: release });
  Object.defineProperty(thisPointer, "move", { value: move });
  Object.defineProperty(thisPointer, "get", { value: copyPointer });
  return thisPointer;
};

const Touches = function (node) {
  const pointer = Pointer(node);
  const handlers = {
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
  const clear = () => {
    Object.keys(handlers)
      .forEach(key => handlers[key]
        .forEach(f => node.removeEventListener(key, f)));
    Object.keys(handlers).forEach((key) => { handlers[key] = []; });
  };
  const onMouseMove = (handler, event) => {
    event.preventDefault();
    const e = pointer
      .move(event.clientX, event.clientY, event.buttons > 0)
      .get();
    handler(e);
    return e;
  };
  const onTouchMove = (handler, event) => {
    event.preventDefault();
    const e = pointer
      .move(event.touches[0].clientX, event.touches[0].clientY, true)
      .get();
    handler(e);
    return e;
  };
  const onMouseDown = (handler, event) => {
    event.preventDefault();
    const e = pointer
      .move(event.clientX, event.clientY, true)
      .get();
    handler(e);
    return e;
  };
  const onTouchStart = (handler, event) => {
    event.preventDefault();
    const e = pointer
      .move(event.touches[0].clientX, event.touches[0].clientY, true)
      .get();
    handler(e);
    return e;
  };
  const onEnd = (handler, event) => {
    event.preventDefault();
    const e = pointer.release().get();
    handler(e);
    return e;
  };
  const onScroll = function (handler, event) {
    const e = {
      deltaX: event.deltaX,
      deltaY: event.deltaY,
      deltaZ: event.deltaZ,
    };
    e.position = convertToViewBox(node, event.clientX, event.clientY);
    [e.x, e.y] = e.position;
    event.preventDefault();
    handler(e);
    return e;
  };
  Object.defineProperty(node, "mouse", {
    get: () => pointer.get(),
    enumerable: true
  });
  Object.defineProperty(node, "mouseMoved", {
    set: (handler) => {
      const mouseFunc = event => onMouseMove(handler, event);
      const touchFunc = event => onTouchMove(handler, event);
      handlers.mousemove.push(mouseFunc);
      handlers.touchmove.push(mouseFunc);
      node.addEventListener("mousemove", mouseFunc);
      node.addEventListener("touchmove", touchFunc);
    },
    enumerable: true
  });
  Object.defineProperty(node, "mousePressed", {
    set: (handler) => {
      const mouseFunc = event => onMouseDown(handler, event);
      const touchFunc = event => onTouchStart(handler, event);
      handlers.mousedown.push(mouseFunc);
      handlers.touchstart.push(touchFunc);
      node.addEventListener("mousedown", mouseFunc);
      node.addEventListener("touchstart", touchFunc);
    },
    enumerable: true
  });
  Object.defineProperty(node, "mouseReleased", {
    set: (handler) => {
      const mouseFunc = event => onEnd(handler, event);
      const touchFunc = event => onEnd(handler, event);
      handlers.mouseup.push(mouseFunc);
      handlers.touchend.push(touchFunc);
      node.addEventListener("mouseup", mouseFunc);
      node.addEventListener("touchend", touchFunc);
    },
    enumerable: true
  });
  Object.defineProperty(node, "scroll", {
    set: (handler) => {
      const scrollFunc = event => onScroll(handler, event);
      handlers.mouseup.push(scrollFunc);
      node.addEventListener("scroll", scrollFunc);
    },
    enumerable: true
  });
  return {
    clear,
    pointer
  };
};

const DEFAULT_DELAY = 1000 / 60;
const Animate = function (node) {
  const timers = [];
  let frameNumber;
  let delay = DEFAULT_DELAY;
  let func;
  const clear = () => {
    while (timers.length > 0) {
      clearInterval(timers.shift());
    }
    func = undefined;
  };
  const start = () => {
    if (typeof func !== "function") { return; }
    timers.push(setInterval(() => {
      func({
        time: node.getCurrentTime(),
        frame: frameNumber += 1
      });
    }, delay));
  };
  const setLoop = (handler) => {
    clear();
    func = handler;
    if (typeof func === "function") {
      frameNumber = 0;
      start();
    }
  };
  const validateMillis = (m) => {
    const parsed = parseFloat(m);
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed;
    }
    return DEFAULT_DELAY;
  };
  const setFPS = (fps) => {
    clear();
    delay = validateMillis(1000 / fps);
    start();
  };
  Object.defineProperty(node, "animate", {
    set: handler => setLoop(handler),
    enumerable: true
  });
  Object.defineProperty(node, "clear", {
    value: () => clear(),
    enumerable: true,
  });
  return {
    clear,
    setLoop,
    setFPS
  };
};

const Events = function (node) {
  const animate = Animate(node);
  const touches = Touches(node);
  Object.defineProperty(node, "stopAnimations", {
    value: animate.clear,
    enumerated: true
  });
  Object.defineProperty(node, "freeze", {
    value: () => {
      touches.clear();
      animate.clear();
    },
    enumerated: true
  });
  Object.defineProperty(node, "fps", {
    set: fps => animate.setFPS(fps),
    enumerated: true
  });
};

const controlPoint = function (parent, options = {}) {
  const position = [0, 0];
  let selected = false;
  let svg;
  const updateSVG = () => {
    if (svg != null) {
      if (svg.parentNode == null) { parent.appendChild(svg); }
      svg.setAttribute("cx", position[0]);
      svg.setAttribute("cy", position[1]);
    }
  };
  const proxy = new Proxy(position, {
    set: (target, property, value, receiver) => {
      target[property] = value;
      updateSVG();
      return true;
    }
  });
  const setPosition = function (...args) {
    if (args.length === 0) { return; }
    const root = typeof args[0];
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
  let updatePosition = input => input;
  const onMouseMove = function (mouse) {
    if (selected) {
      setPosition(updatePosition(mouse));
    }
  };
  const onMouseUp = () => { selected = false; };
  const distance = mouse => ([0, 1]
    .map(i => mouse[i] - position[i])
    .map(e => e ** 2)
    .reduce((a, b) => a + b, 0));
  position.delegate = undefined;
  position.setPosition = setPosition;
  position.onMouseMove = onMouseMove;
  position.onMouseUp = onMouseUp;
  position.distance = distance;
  Object.defineProperty(position, "x", {
    get: () => position[0],
    set: (newValue) => { position[0] = newValue; }
  });
  Object.defineProperty(position, "y", {
    get: () => position[1],
    set: (newValue) => { position[1] = newValue; }
  });
  Object.defineProperty(position, "svg", {
    get: () => svg,
    set: (newSVG) => { svg = newSVG; }
  });
  Object.defineProperty(position, "positionDidUpdate", {
    set: (method) => { updatePosition = method; }
  });
  Object.defineProperty(position, "selected", {
    set: (value) => { selected = value; }
  });
  Object.defineProperty(position, "remove", {
    value: () => {
      if (svg != null) { svg.parentNode.removeChild(svg); }
    }
  });
  return proxy;
};
const controls = function (svg, number, options) {
  let selected;
  let delegate;
  const points = Array.from(Array(number))
    .map(() => controlPoint(svg, options));
  points.forEach((pt, i) => {
    if (typeof options === "object"
      && typeof options.position === "function") {
      pt.setPosition(options.position(i));
    }
  });
  const protocol = function (point) {
    if (typeof delegate === "function") {
      delegate.call(points, points, point);
    }
  };
  points.forEach((p) => {
    p.delegate = protocol;
    p.pointsContainer = points;
  });
  const mousePressedHandler = function (mouse) {
    if (!(points.length > 0)) { return; }
    selected = points
      .map((p, i) => ({ i, d: p.distance(mouse) }))
      .sort((a, b) => a.d - b.d)
      .shift()
      .i;
    points[selected].selected = true;
  };
  const mouseMovedHandler = function (mouse) {
    points.forEach(p => p.onMouseMove(mouse));
  };
  const mouseReleasedHandler = function () {
    points.forEach(p => p.onMouseUp());
    selected = undefined;
  };
  svg.mousePressed = mousePressedHandler;
  svg.mouseMoved = mouseMovedHandler;
  svg.mouseReleased = mouseReleasedHandler;
  Object.defineProperty(points, "selectedIndex", { get: () => selected });
  Object.defineProperty(points, "selected", { get: () => points[selected] });
  Object.defineProperty(points, "add", {
    value: (opt) => {
      points.push(controlPoint(svg, opt));
    },
  });
  points.removeAll = () => {
    while (points.length > 0) {
      points.pop().remove();
    }
  };
  points.onChange = function (func, runOnceAtStart) {
    if (typeof func === "function") {
      delegate = func;
      if (runOnceAtStart === true) { func.call(points, points, undefined); }
    }
    return points;
  };
  points.position = function (func) {
    if (typeof func === "function") {
      points.forEach((p, i) => p.setPosition(func.call(points, i)));
    }
    return points;
  };
  points.svg = function (func) {
    if (typeof func === "function") {
      points.forEach((p, i) => { p.svg = func.call(points, i); });
    }
    return points;
  };
  points.parent = function (parent) {
    if (parent != null && parent.appendChild != null) {
      points.forEach((p) => { parent.appendChild(p.svg); });
    }
    return points;
  };
  return points;
};

const is_iterable = obj => obj != null
  && typeof obj[Symbol.iterator] === "function";
const flatten_input = function (...args) {
  switch (args.length) {
    case undefined:
    case 0: return args;
    case 1: return is_iterable(args[0]) && typeof args[0] !== "string"
      ? flatten_input(...args[0])
      : [args[0]];
    default:
      return Array.from(args)
        .map(a => (is_iterable(a)
          ? [...flatten_input(a)]
          : a))
        .reduce((a, b) => a.concat(b), []);
  }
};

const setPoints = function (shape, ...pointsArray) {
  const flat = flatten_input(...pointsArray);
  let pointsString = "";
  if (typeof flat[0] === "number") {
    pointsString = Array.from(Array(Math.floor(flat.length / 2)))
      .reduce((a, b, i) => `${a}${flat[i * 2]},${flat[i * 2 + 1]} `, "");
  }
  if (typeof flat[0] === "object") {
    if (typeof flat[0].x === "number") {
      pointsString = flat.reduce((prev, curr) => `${prev}${curr.x},${curr.y} `, "");
    }
    if (typeof flat[0][0] === "number") {
      pointsString = flat.reduce((prev, curr) => `${prev}${curr[0]},${curr[1]} `, "");
    }
  }
  shape.setAttributeNS(null, "points", pointsString);
  return shape;
};
const setLinePoints = function (shape, ...pointsArray) {
  const flat = flatten_input(...pointsArray);
  let points = [];
  if (typeof flat[0] === "number") {
    points = flat;
  }
  if (typeof flat[0] === "object") {
    if (typeof flat[0].x === "number") {
      points = flat.map(p => [p[0], p[1]]).reduce((a, b) => a.concat(b), []);
    }
    if (typeof flat[0][0] === "number") {
      points = flat.reduce((a, b) => a.concat(b), []);
    }
  }
  if (points[0] != null) { shape.setAttributeNS(null, "x1", points[0]); }
  if (points[1] != null) { shape.setAttributeNS(null, "y1", points[1]); }
  if (points[2] != null) { shape.setAttributeNS(null, "x2", points[2]); }
  if (points[3] != null) { shape.setAttributeNS(null, "y2", points[3]); }
  return shape;
};
const setCenter = function (shape, ...args) {
  const flat = flatten_input(...args);
  if (typeof flat[0] === "number") {
    if (flat[0] != null) { shape.setAttributeNS(null, "cx", flat[0]); }
    if (flat[1] != null) { shape.setAttributeNS(null, "cy", flat[1]); }
  }
  if (typeof flat.x === "number") {
    if (flat.x != null) { shape.setAttributeNS(null, "cx", flat.x); }
    if (flat.y != null) { shape.setAttributeNS(null, "cy", flat.y); }
  }
  return shape;
};
const setArc = function (shape, x, y, radius,
  startAngle, endAngle, includeCenter = false) {
  if (endAngle == null) { return undefined; }
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
  return shape;
};
const setEllipticalArc = function (shape, x, y, rX, rY,
  startAngle, endAngle, includeCenter = false) {
  if (endAngle == null) { return undefined; }
  const start = [
    x + Math.cos(startAngle) * rX,
    y + Math.sin(startAngle) * rY];
  const vecStart = [
    Math.cos(startAngle) * rX,
    Math.sin(startAngle) * rY];
  const vecEnd = [
    Math.cos(endAngle) * rX,
    Math.sin(endAngle) * rY];
  const arcVec = [vecEnd[0] - vecStart[0], vecEnd[1] - vecStart[1]];
  const py = vecStart[0] * vecEnd[1] - vecStart[1] * vecEnd[0];
  const px = vecStart[0] * vecEnd[0] + vecStart[1] * vecEnd[1];
  const arcdir = (Math.atan2(py, px) > 0 ? 0 : 1);
  let d = (includeCenter
    ? `M ${x},${y} l ${vecStart[0]},${vecStart[1]} `
    : `M ${start[0]},${start[1]} `);
  d += ["a ", rX, rY, 0, arcdir, 1, arcVec[0], arcVec[1]].join(" ");
  if (includeCenter) { d += " Z"; }
  shape.setAttributeNS(null, "d", d);
  return shape;
};
const setBezier = function (shape, fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
  if (toY == null) { return undefined; }
  const pts = [[fromX, fromY], [c1X, c1Y], [c2X, c2Y], [toX, toY]]
    .map(p => p.join(","));
  const d = `M ${pts[0]} C ${pts[1]} ${pts[2]} ${pts[3]}`;
  shape.setAttributeNS(null, "d", d);
  return shape;
};
const setArrowPoints = function (shape, ...args) {
  const children = Array.from(shape.childNodes);
  const path = children.filter(node => node.tagName === "path").shift();
  const polys = ["svg-arrow-head", "svg-arrow-tail"]
    .map(c => children.filter(n => n.getAttribute("class") === c).shift());
  const flat = flatten_input(...args);
  let endpoints = [];
  if (typeof flat[0] === "number") {
    endpoints = flat;
  }
  if (typeof flat[0] === "object") {
    if (typeof flat[0].x === "number") {
      endpoints = flat.map(p => [p[0], p[1]]).reduce((a, b) => a.concat(b), []);
    }
    if (typeof flat[0][0] === "number") {
      endpoints = flat.reduce((a, b) => a.concat(b), []);
    }
  }
  if (!endpoints.length && shape.endpoints != null) {
    endpoints = shape.endpoints;
  }
  if (!endpoints.length) { return shape; }
  shape.endpoints = endpoints;
  const o = shape.options;
  let tailPt = [endpoints[0], endpoints[1]];
  let headPt = [endpoints[2], endpoints[3]];
  let vector = [headPt[0] - tailPt[0], headPt[1] - tailPt[1]];
  let midpoint = [tailPt[0] + vector[0] / 2, tailPt[1] + vector[1] / 2];
  const len = Math.sqrt((vector[0] ** 2) + (vector[1] ** 2));
  const minLength = (
    (o.tail.visible ? (1 + o.tail.padding) * o.tail.height * 2.5 : 0)
  + (o.head.visible ? (1 + o.head.padding) * o.head.height * 2.5 : 0)
  );
  if (len < minLength) {
    const minVec = len === 0
      ? [minLength, 0]
      : [vector[0] / len * minLength, vector[1] / len * minLength];
    tailPt = [midpoint[0] - minVec[0] * 0.5, midpoint[1] - minVec[1] * 0.5];
    headPt = [midpoint[0] + minVec[0] * 0.5, midpoint[1] + minVec[1] * 0.5];
    vector = [headPt[0] - tailPt[0], headPt[1] - tailPt[1]];
  }
  let perpendicular = [vector[1], -vector[0]];
  let bezPoint = [
    midpoint[0] + perpendicular[0] * o.curve,
    midpoint[1] + perpendicular[1] * o.curve
  ];
  const bezTail = [bezPoint[0] - tailPt[0], bezPoint[1] - tailPt[1]];
  const bezHead = [bezPoint[0] - headPt[0], bezPoint[1] - headPt[1]];
  const bezTailLen = Math.sqrt((bezTail[0] ** 2) + (bezTail[1] ** 2));
  const bezHeadLen = Math.sqrt((bezHead[0] ** 2) + (bezHead[1] ** 2));
  const bezTailNorm = bezTailLen === 0
    ? bezTail
    : [bezTail[0] / bezTailLen, bezTail[1] / bezTailLen];
  const bezHeadNorm = bezTailLen === 0
    ? bezHead
    : [bezHead[0] / bezHeadLen, bezHead[1] / bezHeadLen];
  const tailVector = [-bezTailNorm[0], -bezTailNorm[1]];
  const headVector = [-bezHeadNorm[0], -bezHeadNorm[1]];
  const tailNormal = [tailVector[1], -tailVector[0]];
  const headNormal = [headVector[1], -headVector[0]];
  const tailArc = [
    tailPt[0] + bezTailNorm[0] * o.tail.height * ((o.tail.visible ? 1 : 0) + o.tail.padding),
    tailPt[1] + bezTailNorm[1] * o.tail.height * ((o.tail.visible ? 1 : 0) + o.tail.padding)
  ];
  const headArc = [
    headPt[0] + bezHeadNorm[0] * o.head.height * ((o.head.visible ? 1 : 0) + o.head.padding),
    headPt[1] + bezHeadNorm[1] * o.head.height * ((o.head.visible ? 1 : 0) + o.head.padding)
  ];
  vector = [headArc[0] - tailArc[0], headArc[1] - tailArc[1]];
  perpendicular = [vector[1], -vector[0]];
  midpoint = [tailArc[0] + vector[0] / 2, tailArc[1] + vector[1] / 2];
  bezPoint = [
    midpoint[0] + perpendicular[0] * o.curve,
    midpoint[1] + perpendicular[1] * o.curve
  ];
  const tailControl = [
    tailArc[0] + (bezPoint[0] - tailArc[0]) * o.pinch,
    tailArc[1] + (bezPoint[1] - tailArc[1]) * o.pinch
  ];
  const headControl = [
    headArc[0] + (bezPoint[0] - headArc[0]) * o.pinch,
    headArc[1] + (bezPoint[1] - headArc[1]) * o.pinch
  ];
  const tailPolyPts = [
    [tailArc[0] + tailNormal[0] * -o.tail.width, tailArc[1] + tailNormal[1] * -o.tail.width],
    [tailArc[0] + tailNormal[0] * o.tail.width, tailArc[1] + tailNormal[1] * o.tail.width],
    [tailArc[0] + tailVector[0] * o.tail.height, tailArc[1] + tailVector[1] * o.tail.height]
  ];
  const headPolyPts = [
    [headArc[0] + headNormal[0] * -o.head.width, headArc[1] + headNormal[1] * -o.head.width],
    [headArc[0] + headNormal[0] * o.head.width, headArc[1] + headNormal[1] * o.head.width],
    [headArc[0] + headVector[0] * o.head.height, headArc[1] + headVector[1] * o.head.height]
  ];
  path.setAttribute("d", `M${tailArc[0]},${tailArc[1]}C${tailControl[0]},${tailControl[1]},${headControl[0]},${headControl[1]},${headArc[0]},${headArc[1]}`);
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

var geometryMods = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setPoints: setPoints,
  setLinePoints: setLinePoints,
  setCenter: setCenter,
  setArc: setArc,
  setEllipticalArc: setEllipticalArc,
  setBezier: setBezier,
  setArrowPoints: setArrowPoints
});

var attributes = [
  "accumulate",
  "additive",
  "alignment-baseline",
  "amplitude",
  "attributeName",
  "azimuth",
  "baseFrequency",
  "baseline-shift",
  "baseProfile",
  "bbox",
  "begin",
  "bias",
  "by",
  "CSection",
  "calcMode",
  "cap-height",
  "clip",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "contentScriptType",
  "contentStyleType",
  "cursor",
  "DSection",
  "decelerate",
  "descent",
  "diffuseConstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "ESection",
  "edgeMode",
  "elevation",
  "enable-background",
  "end",
  "exponent",
  "externalResourcesRequired",
  "FSection",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterRes",
  "filterUnits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "format",
  "from",
  "fr",
  "fx",
  "fy",
  "GSection",
  "g1",
  "g2",
  "glyph-name",
  "glyph-orientation-horizontal",
  "glyph-orientation-vertical",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "HSection",
  "hanging",
  "href",
  "hreflang",
  "horiz-adv-x",
  "horiz-origin-x",
  "ISection",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k1",
  "k2",
  "k3",
  "k4",
  "kernelMatrix",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "LSection",
  "lang",
  "letter-spacing",
  "lighting-color",
  "limitingConeAngle",
  "local",
  "MSection",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "mathematical",
  "max",
  "media",
  "method",
  "min",
  "mode",
  "NSection",
  "name",
  "numOctaves",
  "OSection",
  "opacity",
  "operator",
  "order",
  "orient",
  "overflow",
  "overline-position",
  "overline-thickness",
  "PSection",
  "paint-order",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointer-events",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "RSection",
  "radius",
  "refX",
  "refY",
  "rendering-intent",
  "repeatCount",
  "repeatDur",
  "requiredFeatures",
  "restart",
  "result",
  "SSection",
  "seed",
  "shape-rendering",
  "spacing",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stemh",
  "stemv",
  "stitchTiles",
  "stop-color",
  "stop-opacity",
  "strikethrough-position",
  "strikethrough-thickness",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "surfaceScale",
  "TSection",
  "tabindex",
  "tableValues",
  "target",
  "targetX",
  "targetY",
  "text-anchor",
  "text-decoration",
  "text-rendering",
  "to",
  "transform-origin",
  "type",
  "USection",
  "u1",
  "u2",
  "underline-position",
  "underline-thickness",
  "unicode",
  "unicode-range",
  "units-per-em",
  "user-select",
  "VSection",
  "v-alphabetic",
  "v-hanging",
  "v-ideographic",
  "v-mathematical",
  "values",
  "vector-effect",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "viewTarget",
  "visibility",
  "WSection",
  "widths",
  "word-spacing",
  "writing-mode",
  "XSection",
  "xChannelSelector",
  "YSection",
  "yChannelSelector",
  "ZSection",
];

const removeChildren = function (parent) {
  while (parent.lastChild) {
    parent.removeChild(parent.lastChild);
  }
};
const appendTo = function (element, parent) {
  if (parent != null) {
    parent.appendChild(element);
  }
  return element;
};
const toKebab = string => string
  .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  .replace(/([A-Z])([A-Z])(?=[a-z])/g, "$1-$2")
  .toLowerCase();
const setAttributes = function (element, attributes) {
  Object.keys(attributes).forEach((key) => {
    element.setAttribute(toKebab(key), attributes[key]);
  });
  return element;
};
const getClassList = function (xmlNode) {
  const currentClass = xmlNode.getAttribute("class");
  return (currentClass == null
    ? []
    : currentClass.split(" ").filter(s => s !== ""));
};
const addClass = function (xmlNode, newClass) {
  if (xmlNode == null) {
    return xmlNode;
  }
  const classes = getClassList(xmlNode)
    .filter(c => c !== newClass);
  classes.push(newClass);
  xmlNode.setAttributeNS(null, "class", classes.join(" "));
  return xmlNode;
};
const removeClass = function (xmlNode, removedClass) {
  if (xmlNode == null) {
    return xmlNode;
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

var DOM = /*#__PURE__*/Object.freeze({
  __proto__: null,
  removeChildren: removeChildren,
  appendTo: appendTo,
  setAttributes: setAttributes,
  addClass: addClass,
  removeClass: removeClass,
  setClass: setClass,
  setID: setID
});

const setTransform = function (element, transform) {
  if (typeof transform === "object") {
    element.setAttribute("transform", transform.join(" "));
  } else if (typeof transform === "string") {
    element.setAttribute("transform", transform);
  }
};
const getTransform = function (element) {
  const trans = element.getAttribute("transform");
  return (trans == null
    ? undefined
    : trans.split(" "));
};
const translate = function (element, tx, ty) {
  const trans = getTransform(element) || [];
  trans.push(`translate(${tx}, ${ty})`);
  setTransform(element, trans);
  return element;
};
const rotate = function (element, angle) {
  const trans = getTransform(element) || [];
  trans.push(`rotate(${angle})`);
  setTransform(element, trans);
  return element;
};
const scale = function (element, sx, sy) {
  const trans = getTransform(element) || [];
  trans.push(`scale(${sx}, ${sy})`);
  setTransform(element, trans);
  return element;
};
const clearTransforms = function (element) {
  element.setAttribute("transform", "");
  return element;
};

var Transform = /*#__PURE__*/Object.freeze({
  __proto__: null,
  translate: translate,
  rotate: rotate,
  scale: scale,
  clearTransforms: clearTransforms
});

const d = function (element) {
  let attr = element.getAttribute("d");
  if (attr == null) { attr = ""; }
  return attr;
};
const append = function (element, command, ...args) {
  const params = flatten_input(args).join(",");
  element.setAttribute("d", `${d(element)}${command}${params}`);
  return element;
};
const command = (element, cmd, ...args) => append(element, cmd, ...args);
const moveTo = (element, ...args) => append(element, "M", ...args);
const _moveTo = (element, ...args) => append(element, "m", ...args);
const lineTo = (element, ...args) => append(element, "L", ...args);
const _lineTo = (element, ...args) => append(element, "l", ...args);
const verticalLineTo = (element, y) => append(element, "V", y);
const _verticalLineTo = (element, y) => append(element, "v", y);
const horizontalLineTo = (element, x) => append(element, "H", x);
const _horizontalLineTo = (element, x) => append(element, "h", x);
const ellipseTo = (element, ...args) => append(element, "A", ...args);
const _ellipseTo = (element, ...args) => append(element, "a", ...args);
const curveTo = (element, ...args) => append(element, "C", ...args);
const _curveTo = (element, ...args) => append(element, "c", ...args);
const smoothCurveTo = (element, ...args) => append(element, "S", ...args);
const _smoothCurveTo = (element, ...args) => append(element, "s", ...args);
const quadCurveTo = (element, ...args) => append(element, "Q", ...args);
const _quadCurveTo = (element, ...args) => append(element, "q", ...args);
const smoothQuadCurveTo = (element, ...args) => append(element, "T", ...args);
const _smoothQuadCurveTo = (element, ...args) => append(element, "t", ...args);
const close = element => append(element, "Z");
const clear = (element) => {
  element.setAttribute("d", "");
  return element;
};

var Path = /*#__PURE__*/Object.freeze({
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

const attachStyleMethods = function (element) {
  element.appendTo = arg => appendTo(element, arg);
};
const attachAppendableMethods = function (element, methods) {
  Object.keys(methods)
    .filter(key => element[key] === undefined)
    .forEach((key) => {
      element[key] = function (...args) {
        const g = methods[key](...args);
        element.appendChild(g);
        return g;
      };
    });
};
const attachArrowMethods = function (element) {
  element.head = (options) => {
    if (typeof options === "object") {
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
  element.tail = (options) => {
    if (typeof options === "object") {
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
  element.curve = (amount) => {
    element.options.curve = amount;
    setArrowPoints(element);
    return element;
  };
  element.pinch = (amount) => {
    element.options.pinch = amount;
    setArrowPoints(element);
    return element;
  };
};
const attachPathMethods = function (element) {
  Object.keys(Path).filter(key => element[key] === undefined).forEach((key) => {
    element[key] = (...args) => Path[key](element, ...args);
  });
};
const attachDOMMethods = function (element) {
  Object.keys(DOM).filter(key => element[key] === undefined).forEach((key) => {
    element[key] = (...args) => DOM[key](element, ...args);
  });
};
const attachTransformMethods = function (element) {
  Object.keys(Transform).filter(key => element[key] === undefined).forEach((key) => {
    element[key] = (...args) => Transform[key](element, ...args);
  });
};
const attachViewBoxMethods = function (element) {
  Object.keys(ViewBox).filter(key => element[key] === undefined).forEach((key) => {
    element[key] = (...args) => ViewBox[key](element, ...args);
  });
};
const toCamel = s => s
  .replace(/([-_][a-z])/ig, $1 => $1
    .toUpperCase()
    .replace("-", "")
    .replace("_", ""));
const attachFunctionalStyleSetters = function (element) {
  attributes.filter(key => element[toCamel(key)] === undefined)
    .forEach((key) => {
      element[toCamel(key)] = (...args) => {
        element.setAttribute(key, ...args);
        return element;
      };
    });
};
const attachClipMaskMakers = function (element, primitives) {
  if (element.clipPath === undefined) {
    element.clipPath = (...args) => {
      const c = primitives.clipPath(...args);
      element.appendChild(c);
      return c;
    };
  }
  if (element.mask === undefined) {
    element.mask = (...args) => {
      const m = primitives.mask(...args);
      element.appendChild(m);
      return m;
    };
  }
};
const findIdURL = function (arg) {
  if (arg == null) { return undefined; }
  if (typeof arg === "string") {
    return arg.slice(0, 3) === "url"
      ? arg
      : `url(#${arg})`;
  }
  if (arg.getAttribute != null) {
    const idString = arg.getAttribute("id");
    return `url(#${idString})`;
  }
  return "url(#)";
};
const attachClipMaskAttributes = function (element) {
  if (element.clipPath === undefined) {
    element.clipPath = function (parent) {
      const value = findIdURL(parent);
      if (value === undefined) { return element; }
      element.setAttribute("clip-path", value);
      return element;
    };
  }
  if (element.mask === undefined) {
    element.mask = function (parent) {
      const value = findIdURL(parent);
      if (value === undefined) { return element; }
      element.setAttribute("mask", value);
      return element;
    };
  }
};

const preparePrimitive = function (element) {
  attachFunctionalStyleSetters(element);
  attachDOMMethods(element);
  attachTransformMethods(element);
  attachClipMaskAttributes(element);
  if (element.tagName === "path") {
    attachPathMethods(element);
  }
};
const prepareArrow = function (element) {
  attachFunctionalStyleSetters(element);
  attachDOMMethods(element);
  attachTransformMethods(element);
  attachClipMaskAttributes(element);
  attachArrowMethods(element);
};
const prepareText = function (element) {
  attachFunctionalStyleSetters(element);
  attachDOMMethods(element);
  attachTransformMethods(element);
  attachClipMaskAttributes(element);
};
const prepareSVG = function (element, primitives) {
  attachDOMMethods(element);
  attachTransformMethods(element);
  attachViewBoxMethods(element);
  attachFunctionalStyleSetters(element);
  attachClipMaskMakers(element, primitives);
  attachAppendableMethods(element, primitives);
};
const prepareGroup = function (element, primitives) {
  attachFunctionalStyleSetters(element);
  attachDOMMethods(element);
  attachTransformMethods(element);
  attachClipMaskAttributes(element);
  attachAppendableMethods(element, primitives);
};
const prepareMaskClipPath = function (element, primitives) {
  attachFunctionalStyleSetters(element);
  attachDOMMethods(element);
  attachTransformMethods(element);
  attachClipMaskAttributes(element);
  attachAppendableMethods(element, primitives);
};
const prepareStyle = function (element) {
  attachStyleMethods(element);
};
const prepare = function (type, element, primitiveList) {
  switch (type) {
    case "svg": prepareSVG(element, primitiveList); break;
    case "primitive": preparePrimitive(element); break;
    case "arrow": prepareArrow(element); break;
    case "defs":
    case "group": prepareGroup(element, primitiveList); break;
    case "text": prepareText(element); break;
    case "clipPath":
    case "mask": prepareMaskClipPath(element, primitiveList); break;
    case "style": prepareStyle(element); break;
    default: console.warn("prepare missing valid type (svg, group.."); break;
  }
};

const line = function (...endpoints) {
  const shape = win.document.createElementNS(NS, "line");
  setLinePoints(shape, ...endpoints);
  prepare("primitive", shape);
  shape.setPoints = (...args) => setLinePoints(shape, ...args);
  return shape;
};
const circle = function (x, y, radius) {
  const shape = win.document.createElementNS(NS, "circle");
  setCenter(shape, x, y);
  if (radius != null) { shape.setAttributeNS(null, "r", radius); }
  prepare("primitive", shape);
  shape.setCenter = (...args) => setCenter(shape, ...args);
  shape.setRadius = (r) => { shape.setAttributeNS(null, "r", r); return shape; };
  shape.radius = (r) => { shape.setAttributeNS(null, "r", r); return shape; };
  return shape;
};
const ellipse = function (x, y, rx, ry) {
  const shape = win.document.createElementNS(NS, "ellipse");
  if (x != null) { shape.setAttributeNS(null, "cx", x); }
  if (y != null) { shape.setAttributeNS(null, "cy", y); }
  if (rx != null) { shape.setAttributeNS(null, "rx", rx); }
  if (ry != null) { shape.setAttributeNS(null, "ry", ry); }
  prepare("primitive", shape);
  return shape;
};
const rect = function (x, y, width, height) {
  const shape = win.document.createElementNS(NS, "rect");
  if (x != null) { shape.setAttributeNS(null, "x", x); }
  if (y != null) { shape.setAttributeNS(null, "y", y); }
  if (width != null) { shape.setAttributeNS(null, "width", width); }
  if (height != null) { shape.setAttributeNS(null, "height", height); }
  prepare("primitive", shape);
  return shape;
};
const polygon = function (...pointsArray) {
  const shape = win.document.createElementNS(NS, "polygon");
  setPoints(shape, ...pointsArray);
  prepare("primitive", shape);
  shape.setPoints = (...args) => setPoints(shape, ...args);
  return shape;
};
const polyline = function (...pointsArray) {
  const shape = win.document.createElementNS(NS, "polyline");
  setPoints(shape, ...pointsArray);
  prepare("primitive", shape);
  shape.setPoints = (...args) => setPoints(shape, ...args);
  return shape;
};
const path = function (d) {
  const shape = win.document.createElementNS(NS, "path");
  if (d != null) { shape.setAttributeNS(null, "d", d); }
  prepare("primitive", shape);
  return shape;
};
const bezier = function (fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY) {
  const shape = win.document.createElementNS(NS, "path");
  setBezier(shape, fromX, fromY, c1X, c1Y, c2X, c2Y, toX, toY);
  prepare("primitive", shape);
  shape.setBezier = (...args) => setBezier(shape, ...args);
  return shape;
};
const text = function (textString, x, y) {
  const shape = win.document.createElementNS(NS, "text");
  shape.innerHTML = textString;
  if (x) { shape.setAttributeNS(null, "x", x); }
  if (y) { shape.setAttributeNS(null, "y", y); }
  prepare("text", shape);
  return shape;
};
const arc = function (x, y, radius, angleA, angleB) {
  const shape = win.document.createElementNS(NS, "path");
  setArc(shape, x, y, radius, angleA, angleB, false);
  prepare("primitive", shape);
  shape.setArc = (...args) => setArc(shape, ...args);
  return shape;
};
const wedge = function (x, y, radius, angleA, angleB) {
  const shape = win.document.createElementNS(NS, "path");
  setArc(shape, x, y, radius, angleA, angleB, true);
  prepare("primitive", shape);
  shape.setArc = (...args) => setArc(shape, ...args);
  return shape;
};
const arcEllipse = function (x, y, rx, ry, angleA, angleB) {
  const shape = win.document.createElementNS(NS, "path");
  setEllipticalArc(shape, x, y, rx, ry, angleA, angleB, false);
  prepare("primitive", shape);
  shape.setArc = (...args) => setEllipticalArc(shape, ...args);
  return shape;
};
const wedgeEllipse = function (x, y, rx, ry, angleA, angleB) {
  const shape = win.document.createElementNS(NS, "path");
  setEllipticalArc(shape, x, y, rx, ry, angleA, angleB, true);
  prepare("primitive", shape);
  shape.setArc = (...args) => setEllipticalArc(shape, ...args);
  return shape;
};
const parabola = function (x, y, width, height) {
  const COUNT = 128;
  const iter = Array.from(Array(COUNT + 1))
    .map((_, i) => (i - (COUNT)) / COUNT * 2 + 1);
  const ptsX = iter.map(i => x + (i + 1) * width * 0.5);
  const ptsY = iter.map(i => y + (i ** 2) * height);
  const points = iter.map((_, i) => [ptsX[i], ptsY[i]]);
  return polyline(points);
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
const roundRect = function (x, y, width, height, cornerRadius = 0) {
  if (cornerRadius > width / 2) { cornerRadius = width / 2; }
  if (cornerRadius > height / 2) { cornerRadius = height / 2; }
  const w = width - cornerRadius * 2;
  const h = height - cornerRadius * 2;
  const pathString = `M${x + (width - w) / 2} ${y} h${w} A${cornerRadius} ${cornerRadius} 0 0 1 ${x + width} ${y + (height - h) / 2} v${h} A${cornerRadius} ${cornerRadius} 0 0 1 ${x + width - cornerRadius} ${y + height} h${-w} A${cornerRadius} ${cornerRadius} 0 0 1 ${x} ${y + height - cornerRadius} v${-h} A${cornerRadius} ${cornerRadius} 0 0 1 ${x + cornerRadius} ${y} `;
  return path(pathString);
};
const arrow = function (...args) {
  const shape = win.document.createElementNS(NS, "g");
  const tailPoly = win.document.createElementNS(NS, "polygon");
  const headPoly = win.document.createElementNS(NS, "polygon");
  const arrowPath = win.document.createElementNS(NS, "path");
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
    head: { width: 0.5, height: 2, visible: false, padding: 0.0 },
    tail: { width: 0.5, height: 2, visible: false, padding: 0.0 },
    curve: 0.0,
    pinch: 0.618,
    endpoints: [],
  };
  setArrowPoints(shape, ...args);
  prepare("arrow", shape);
  shape.setPoints = (...a) => setArrowPoints(shape, ...a);
  return shape;
};

var primitives = /*#__PURE__*/Object.freeze({
  __proto__: null,
  line: line,
  circle: circle,
  ellipse: ellipse,
  rect: rect,
  polygon: polygon,
  polyline: polyline,
  path: path,
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

const constructorsSVG = {};
const constructorsGroup = {};
const abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const randomString = function (count = 0) {
  return Array.from(Array(count))
    .map(() => Math.floor(Math.random() * abc.length))
    .map(i => abc[i]).reduce((a, b) => `${a}${b}`, "");
};
const generateUUID = function (count = 16, prefix = "") {
  return prefix + randomString(count);
};
const svg = function () {
  const svgImage = win.document.createElementNS(NS, "svg");
  svgImage.setAttribute("version", "1.1");
  svgImage.setAttribute("xmlns", NS);
  prepare("svg", svgImage, constructorsSVG);
  return svgImage;
};
const group = function () {
  const g = win.document.createElementNS(NS, "g");
  prepare("group", g, constructorsGroup);
  return g;
};
const defs = function () {
  const d = win.document.createElementNS(NS, "defs");
  prepare("defs", d, constructorsGroup);
  return d;
};
const cdata = function (textContent) {
  const c = (new win.DOMParser())
    .parseFromString("<root></root>", "text/xml")
    .createCDATASection(`${textContent}`);
  return c;
};
const style = function (textContent) {
  const s = win.document.createElementNS(NS, "style");
  s.setAttribute("type", "text/css");
  prepare("style", s);
  s.setTextContent = (newText) => { s.textContent = ""; s.appendChild(cdata(newText)); };
  s.appendChild(cdata(textContent));
  return s;
};
const clipPath = function (id = generateUUID(8, "clip-")) {
  const clip = win.document.createElementNS(NS, "clipPath");
  clip.setAttribute("id", id);
  prepare("clipPath", clip, constructorsGroup);
  return clip;
};
const mask = function (id = generateUUID(8, "mask-")) {
  const msk = win.document.createElementNS(NS, "mask");
  msk.setAttribute("id", id);
  prepare("mask", msk, constructorsGroup);
  return msk;
};
const createElement = function (tagName) {
  return win.document.createElementNS(NS, tagName);
};
const setConstructors = function (elements) {
  Object.keys(elements)
    .filter(key => key !== "svg")
    .forEach((key) => { constructorsSVG[key] = elements[key]; });
  Object.keys(elements)
    .filter(key => key !== "svg")
    .filter(key => key !== "defs")
    .filter(key => key !== "style")
    .filter(key => key !== "clipPath")
    .filter(key => key !== "mask")
    .forEach((key) => { constructorsGroup[key] = elements[key]; });
};

var root = /*#__PURE__*/Object.freeze({
  __proto__: null,
  setConstructors: setConstructors,
  svg: svg,
  group: group,
  defs: defs,
  clipPath: clipPath,
  mask: mask,
  style: style,
  createElement: createElement
});

const ElementConstructor = (new win.DOMParser())
  .parseFromString("<div />", "text/xml").documentElement.constructor;
const findWindowBooleanParam = function (...params) {
  const objects = params
    .filter(arg => typeof arg === "object")
    .filter(o => typeof o.window === "boolean");
  return objects.reduce((a, b) => a.window || b.window, false);
};
const findElementInParams = function (...params) {
  const element = params.filter(arg => arg instanceof ElementConstructor).shift();
  const idElement = params
    .filter(a => typeof a === "string" || a instanceof String)
    .map(str => win.document.getElementById(str))
    .shift();
  if (element != null) { return element; }
  return (idElement != null
    ? idElement
    : win.document.body);
};
const initSize = function (svgElement, params) {
  const numbers = params.filter(arg => !isNaN(arg));
  const viewBox = svgElement.getAttribute("viewBox");
  if (numbers.length >= 4) {
    svgElement.setAttributeNS(null, "width", numbers[2]);
    svgElement.setAttributeNS(null, "height", numbers[3]);
    setViewBox(svgElement, numbers[0], numbers[1], numbers[2], numbers[3]);
  } else if (numbers.length >= 2) {
    svgElement.setAttributeNS(null, "width", numbers[0]);
    svgElement.setAttributeNS(null, "height", numbers[1]);
    setViewBox(svgElement, 0, 0, numbers[0], numbers[1]);
  } else if (viewBox == null) {
    const frame = svgElement.getBoundingClientRect();
    setViewBox(svgElement, 0, 0, frame.width, frame.height);
  } else if (viewBox.split(" ").filter(n => n === "0" || n === 0).length === 4) {
    const frame = svgElement.getBoundingClientRect();
    setViewBox(svgElement, 0, 0, frame.width, frame.height);
  }
};
const getWidth = function (element) {
  const viewBox = getViewBox(element);
  if (viewBox == null) { return undefined; }
  return viewBox[2];
};
const getHeight = function (element) {
  const viewBox = getViewBox(element);
  if (viewBox == null) { return undefined; }
  return viewBox[3];
};
const setWidth = function (element, w) {
  const viewBox = getViewBox(element);
  viewBox[2] = w;
  return setViewBox(element, ...viewBox);
};
const setHeight = function (element, h) {
  const viewBox = getViewBox(element);
  viewBox[3] = h;
  return setViewBox(element, ...viewBox);
};
const size = function (element, ...args) {
  if (args.length === 2
    && typeof args[0] === "number"
    && typeof args[1] === "number"
  ) {
    setViewBox(element, 0, 0, ...args);
  } else if (args.length === 4
    && typeof args.map(a => typeof a === "number")
      .reduce((a, b) => a && b, true)
  ) {
    setViewBox(element, ...args);
  }
};
const getFrame = function (element) {
  const viewBox = getViewBox(element);
  if (viewBox !== undefined) {
    return viewBox;
  }
  if (typeof element.getBoundingClientRect === "function") {
    const rr = element.getBoundingClientRect();
    return [rr.x, rr.y, rr.width, rr.height];
  }
  return [0, 0, 0, 0];
};
const background = function (element, color, setParent = false) {
  if (setParent === true) {
    const parent = element.parentElement;
    if (parent != null) {
      parent.setAttribute("style", `background-color: ${color}`);
    }
  }
  let backRect = Array.from(element.childNodes)
    .filter(child => child.getAttribute("class") === "svg-background-rectangle")
    .shift();
  if (backRect != null) {
    backRect.setAttribute("fill", color);
  } else {
    backRect = rect(...getFrame(element))
      .fill(color)
      .setClass("svg-background-rectangle");
    element.insertBefore(backRect, element.firstChild);
  }
};
const findStyleSheet = function (element) {
  const children = Array.from(element.childNodes);
  const topLevel = children
    .filter(child => child.getAttribute("tagName") === "style")
    .shift();
  if (topLevel) { return topLevel; }
  const defs = children
    .filter(child => child.getAttribute("tagName") === "defs")
    .shift();
  if (defs == null) { return defs; }
  const insideDefs = Array.from(defs.childNodes)
    .filter(child => child.getAttribute("tagName") === "style")
    .shift();
  if (insideDefs != null) { return insideDefs; }
  return undefined;
};
const stylesheet = function (element, textContent) {
  let styleSection = findStyleSheet(element);
  if (styleSection == null) {
    styleSection = style(textContent);
    element.insertBefore(styleSection, element.firstChild);
  } else {
    styleSection.setTextContent(textContent);
  }
  return styleSection;
};
const replaceWithSVG = function (oldSVG, newSVG) {
  Array.from(oldSVG.attributes)
    .forEach(attr => oldSVG.removeAttribute(attr.name));
  removeChildren(oldSVG);
  Array.from(newSVG.childNodes).forEach((node) => {
    newSVG.removeChild(node);
    oldSVG.appendChild(node);
  });
  Array.from(newSVG.attributes)
    .forEach(attr => oldSVG.setAttribute(attr.name, attr.value));
};
const SVG = function (...params) {
  const element = svg();
  Events(element);
  element.controls = (...args) => controls(element, ...args);
  element.getWidth = () => getWidth(element);
  element.getHeight = () => getHeight(element);
  element.setWidth = (...args) => setWidth(element, ...args);
  element.setHeight = (...args) => setHeight(element, ...args);
  element.background = (...args) => background(element, ...args);
  element.size = (...args) => size(element, ...args);
  element.save = (options) => save(element, options);
  element.load = function (data, callback) {
    load(data, (newSVG, error) => {
      if (newSVG != null) { replaceWithSVG(element, newSVG); }
      if (callback != null) { callback(element, error); }
    });
  };
  element.stylesheet = textContent => stylesheet(element, textContent);
  const initialize = function () {
    const parent = findElementInParams(...params);
    if (parent != null) { parent.appendChild(element); }
    initSize(element, params);
    if (findWindowBooleanParam(...params)) {
      globalize(element);
    }
    params.filter(arg => typeof arg === "function")
      .forEach(func => func.call(element, element));
  };
  if (win.document.readyState === "loading") {
    win.document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
  return element;
};

const constructors = {};
Object.assign(constructors, root, primitives);
delete constructors.setConstructors;
setConstructors(constructors);
const elements = {};
Object.keys(primitives).forEach((key) => { elements[key] = primitives[key]; });
Object.keys(root)
  .filter(key => key !== "setConstructors")
  .forEach((key) => { elements[key] = root[key]; });
delete elements.svg;

Object.keys(elements).forEach((key) => { SVG[key] = elements[key]; });
Object.keys(geometryMods).forEach((key) => { SVG[key] = geometryMods[key]; });
Object.keys(ViewBox).forEach((key) => { SVG[key] = ViewBox[key]; });
Object.keys(File).forEach((key) => { SVG[key] = File[key]; });
SVG.NS = NS;

export default SVG;
