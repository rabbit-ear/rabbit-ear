import * as Geometry from "../../include/geometry.js";

const makeUUID = function() {
	// there is a non-zero chance this generates duplicate strings
	const digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	return Array.from(Array(24))
		.map(_ => Math.floor(Math.random()*digits.length))
		.map(i => digits[i])
		.join('');
}

/**
 * this is meant to be a prototype
 * a component relates 1:1 to something in the FOLD graph, vertex/edge/face.
 */
const Component = function(proto, options) {
	if(proto == null) {
		proto = {};
	}
	if (options != null) {
		proto.graph = options.graph; // pointer back to the graph
		proto.index = options.index; // index of this crease in the graph
	}
	proto.uuid = makeUUID();

	const disable = function() {
		Object.setPrototypeOf(this, null);
		Object.getOwnPropertyNames(this)
			.forEach(key => delete this[key]);
	}
	Object.defineProperty(proto, "disable", { value: disable});
	return Object.freeze(proto);
}

/**
 * in each of these, properties should be set to configurable so that
 * the object can be disabled, and all property keys erased.
 */

export const Vertex = function(graph, index) {
	let point = Geometry.Vector(graph.vertices_coords[index]);
	let _this = Object.create(Component(point, {graph, index}))
	return _this;
}

export const Face = function(graph, index) {
	let points = graph.faces_vertices[index]
		.map(fv => graph.vertices_coords[fv]);
	let face = Geometry.Polygon(points);
	let _this = Object.create(Component(face, {graph, index}))
	return _this;
}

export const Edge = function(graph, index) {

	let points = graph.edges_vertices[index]
		.map(ev => graph.vertices_coords[ev]);
	let edge = Geometry.Edge(points);

	let _this = Object.create(Component(edge, {graph, index}))

	const is_assignment = function(options) {
		return options.map(l => l === this.graph.edges_assignment[index])
			.reduce((a,b) => a || b, false);
	}
	const is_mountain = function() {
		return is_assignment.call(this, ["M", "m"]);
	}
	const is_valley = function() {
		return is_assignment.call(this, ["V", "v"]);
	}
	const is_boundary = function() {
		return is_assignment.call(this, ["B", "b"]);
	}

	const flip = function() {
		if (is_mountain.call(this)) { valley.call(this); }
		else if (is_valley.call(this)) { mountain.call(this); }
		else { return; } // don't trigger the callback
		if (typeof this.graph.onchange === "function") { this.graph.onchange(); }
	}
	const mountain = function() {
		this.graph.edges_assignment[index] = "M";
		this.graph.edges_foldAngle[index] = -180;
		if (typeof this.graph.onchange === "function") { this.graph.onchange(); }
	}
	const valley = function() {
		this.graph.edges_assignment[index] = "V";
		this.graph.edges_foldAngle[index] = 180;
		if (typeof this.graph.onchange === "function") { this.graph.onchange(); }
	}
	const mark = function() {
		this.graph.edges_assignment[index] = "F";
		this.graph.edges_foldAngle[index] = 0;
		if (typeof this.graph.onchange === "function") { this.graph.onchange(); }
	}
	const remove = function() { }
	const addVertexOnEdge = function(x, y) {
		let thisEdge = this.index;
		this.graph.addVertexOnEdge(x, y, thisEdge);
	}

	Object.defineProperty(_this, "mountain", {configurable: true, value: mountain});
	Object.defineProperty(_this, "valley", {configurable: true, value: valley});
	Object.defineProperty(_this, "mark", {configurable: true, value: mark});
	Object.defineProperty(_this, "flip", {configurable: true, value: flip});
	Object.defineProperty(_this, "isBoundary", {
		configurable: true,
		get: function(){ return is_boundary.call(this); }
	});
	Object.defineProperty(_this, "isMountain", {
		configurable: true,
		get: function(){ return is_mountain.call(this); }
	});
	Object.defineProperty(_this, "isValley", {
		configurable: true,
		get: function(){ return is_valley.call(this); }
	});
	// Object.defineProperty(_this, "remove", {value: remove});
	Object.defineProperty(_this, "addVertexOnEdge", {configurable: true, value: addVertexOnEdge});
	return _this;
}


// consider this: a crease can be an ARRAY of edges. 
// this way one crease is one crease. it's more what a person expects.
// one crease can == many edges.
export const Crease = function(_graph, _indices) {
	let graph = _graph; // pointer back to the graph;
	let indices = _indices; // indices of this crease in the graph

	const is_assignment = function(options) {
		return indices.map(index => options
				.map(l => l === graph.edges_assignment[index])
				.reduce((a,b) => a || b, false)
			).reduce((a,b) => a || b, false);
	}
	const is_mountain = function() { return is_assignment(["M", "m"]); }
	const is_valley = function() { return is_assignment(["V", "v"]); }

	const flip = function() {
		if (is_mountain()) { valley(); }
		else if (is_valley()) { mountain(); }
		else { return; } // don't trigger the callback
		if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	const mountain = function() {
		indices.forEach(index => graph.edges_assignment[index] = "M");
		indices.forEach(index => graph.edges_foldAngle[index] = -180);
		if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	const valley = function() {
		indices.forEach(index => graph.edges_assignment[index] = "V");
		indices.forEach(index => graph.edges_foldAngle[index] = 180);
		if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	const mark = function() {
		indices.forEach(index => graph.edges_assignment[index] = "F");
		indices.forEach(index => graph.edges_foldAngle[index] = 0);
		if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	const remove = function() { }
	// const addVertexOnEdge = function(x, y) {
	// 	let thisEdge = this.index;
	// 	graph.addVertexOnEdge(x, y, thisEdge);
	// }

	// Object.create(Component())

	return {
		mountain,
		valley,
		mark,
		flip,
		get isMountain(){ return is_mountain(); },
		get isValley(){ return is_valley(); },
		remove
		// addVertexOnEdge
	};
}
