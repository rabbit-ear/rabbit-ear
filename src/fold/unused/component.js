/**
 * the goal of this is to condense all the geometry information from a FOLD
 * object into 3 arrays (vertices, edges, faces), each one coalescing
 * information from across their relevant geometry.
 *
 */

import math from "../../../include/math";

// USE STATIC INITIALIZERS

const makeUUID = function () {
  // there is a non-zero chance this generates duplicate strings
  const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return Array.from(Array(24))
    .map(() => Math.floor(Math.random() * digits.length))
    .map(i => digits[i])
    .join("");
};

/**
 * this is meant to be a prototype
 * a component relates 1:1 to something in the FOLD graph, vertex/edge/face.
 */
const component = function (proto) { //, options) {
  if (proto == null) {
    // proto = {};
    return undefined;
    // use the static initializers
  }
  const _this = Object.create(proto);
  _this.uuid = makeUUID();
  const disable = function () {
    // Object.setPrototypeOf(_this, null);
    // Object.getOwnPropertyNames(_this)
    //   .forEach(key => delete _this[key]);
  };
  Object.defineProperty(_this, "disable", { value: disable });
  return _this;
};

const vertexPrototype = function (graph, index) {
  const point = math.vector(graph.vertices_coords[index]);
  const _this = Object.create(point);
  return _this;
};

const facePrototype = function (graph, index) {
  const points = graph.faces_vertices[index]
    .map(fv => graph.vertices_coords[fv]);
  const face = math.polygon(points);
  const _this = Object.create(face);
  return _this;
};

const edgePrototype = function (graph, index) {
  const points = graph.edges_vertices[index]
    .map(ev => graph.vertices_coords[ev]);
  const edge = math.segment(points);

  // const _this = Object.create(Component(edge, {graph, index}))
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
    else { return; } // don't trigger the callback
    this.graph.onchange.forEach(f => f());
  };
  const remove = function () { };
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
  // Object.defineProperty(_this, "remove", {value: remove});
  Object.defineProperty(_this, "addVertexOnEdge", {
    configurable: true, value: addVertexOnEdge
  });
  return _this;
};


component.vertex = function (graph, index) {
  const proto = vertexPrototype.bind(this);
  let v = component(proto(graph, index));
  Object.defineProperty(v, "robby", { configurable: true, value: "hi" });

  // v.robby = "hi";
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

export default component;
/**
 * in each of these, properties should be set to configurable so that
 * the object can be disabled, and all property keys erased.
 */

// consider this: a crease can be an ARRAY of edges.
// this way one crease is one crease. it's more what a person expects.
// one crease can == many edges.
const creasePrototype = function (graph, indices) {
  // const _this = Object.create(Component(edge, {graph, index}))
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
    else { return; } // don't trigger the callback
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
  // const addVertexOnEdge = function (x, y) {
  //  let thisEdge = this.index;
  //  graph.addVertexOnEdge(x, y, thisEdge);
  // }

  // Object.create(Component())
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
