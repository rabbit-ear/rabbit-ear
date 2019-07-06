/**
 * SVG in Javascript (c) Robby Kraft
 */

import { convertToViewBox } from "./viewBox";

// these are the names under which the event handlers live
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
    isPressed: false, // is the mouse button pressed (y/n)
    position: [0,0],  // the current position of the mouse [x,y]
    pressed: [0,0],   // the last location the mouse was pressed
    drag: [0,0],      // vector, displacement from start to now
    prev: [0,0],      // on mouseMoved, the previous location
    x: 0,             //
    y: 0              // -- x and y, copy of position data
  });

  // deep copy mouse object
  const getPointer = function () {
    let m = _pointer.position.slice();
    // if a property is an object it's an array. we can .slice()
    Object.keys(_pointer)
      .filter(key => typeof key === "object")
      .forEach(key => m[key] = _pointer[key].slice());
    Object.keys(_pointer)
      .filter(key => typeof key !== "object")
      .forEach(key => m[key] = _pointer[key]);
    return Object.freeze(m);
  };

  // clientX and clientY are from the browser event data
  const setPosition = function (clientX, clientY) {
    _pointer.position = convertToViewBox(_node, clientX, clientY);
    _pointer.x = _pointer.position[0];
    _pointer.y = _pointer.position[1];
  };

  // touches don't deliver position on release. mouse does
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
    // counting on didMove to have just been called
    // using pointer.position instead of calling convertToViewBox again
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
}

export default function (node) {

  let _node; // this gets set inside setup()
  let _pointer = Pointer(node);
  let _events = {};


  const fireEvents = function (event, events) {
    if (events == null) { return; }
    if (events.length > 0) {
      event.preventDefault();
    }
    let mouse = _pointer.getPointer();
    events.forEach(f => f(mouse));
  }

  // these attach to incoming DOM events
  const mouseMoveHandler = function (event) {
    let events = _events[Names.move];
    _pointer.didMove(event.clientX, event.clientY);
    fireEvents(event, events);
  };
  const mouseDownHandler = function (event) {
    let events = _events[Names.begin];
    _pointer.didPress(event.clientX, event.clientY);
    fireEvents(event, events);
  }
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
    // touchMoveHandler(event); // do we need this
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
    }
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
    // mouse
    mouseup: mouseUpHandler,
    mousedown: mouseDownHandler,
    mousemove: mouseMoveHandler,
    mouseleave: mouseLeaveHandler,
    mouseenter: mouseEnterHandler,
    // touches
    touchend: touchEndHandler,
    touchmove: touchMoveHandler,
    touchstart: touchStartHandler,
    touchcancel: touchEndHandler,
    // wheel
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
};
