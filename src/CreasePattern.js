// MIT open source license, Robby Kraft

import * as Graph from "./fold/graph";
import * as PlanarGraph from "./fold/planargraph";
import * as Origami from "./fold/origami";

/** A graph is a set of nodes and edges connecting them */
export default function() {
	let _m = {}; // the data model. fold file format spec

	// let args = Array.from(arguments);
	// let _cp = args.filter(arg =>
	// 	typeof arg == "object" && arg.vertices_coords != undefined
	// ).shift();
	// if(_cp == undefined) { _cp = unitSquare; }

	let params = Array.from(arguments);
	let paramsObj = params.filter(el => typeof el === "object" && el !== null);
	if (paramsObj.length > 0) {
		// expecting the user to have passed in a fold_file.
		// no way of filtering multiple objects right now.
		_m = JSON.parse(JSON.stringify(paramsObj.shift()));
	}

	// this contains keys, like "vertices_vertices", which require rebuilding
	let unclean = {"vertices_coords":[],"vertices_vertices":[],"vertices_faces":[],"edges_vertices":[],"edges_faces":[],"edges_assignment":[],"edges_foldAngle":[],"edges_length":[],"faces_vertices":[],"faces_edges":[],"edgeOrders":[],"faceOrders":[]};

	const load = function(file){ _m = JSON.parse(JSON.stringify(file)); }
	const save = function() {
		let fold_file = Object.create(null);
		Graph.all_keys.filter(key => _m[key] != null)
			.forEach(key =>
				fold_file[key] = JSON.parse(JSON.stringify(_m[key]))
			);
		return fold_file;
	}
	const clear = function() {
		Graph.all_keys.filter(a => _m[a] != null)
			.forEach(key => delete _m[key]);
		if (typeof _onchange === "function") { _onchange(); }
	}
	const clearGraph = function() {
		Graph.keys.graph.filter(a => _m[a] != null)
			.forEach(key => delete _m[key]);
		if (typeof _onchange === "function") { _onchange(); }
	}
	const nearestVertex = function(x, y, z = 0) {
		let index = PlanarGraph.nearest_vertex(_m, [x, y, z]);
		return (index != null) ? Vertex(this, index) : undefined;
	}
	const nearestEdge = function(x, y, z = 0) {
		let index = PlanarGraph.nearest_edge(_m, [x, y, z]);
		return (index != null) ? Crease(this, index) : undefined;
	}
	const nearestFace = function(x, y, z = 0) {
		let index = PlanarGraph.face_containing_point(_m, [x, y, z]);
		return (index != null) ? Face(this, index) : undefined;
	}
	const vertex = function(index) {
		return Vertex(this, index);
	}
	const edge = function(index) {
		return Crease(this, index);
	}
	const face = function(index) {
		return Face(this, index);
	}

	const crease = function() {
		let edge_index = PlanarGraph.add_crease(_m, ...arguments);
		return Crease(this, edge_index);
	}
	const addVertexOnEdge = function(x, y, oldEdgeIndex) {
		Graph.add_vertex_on_edge(_m, x, y, oldEdgeIndex);
		if (typeof _onchange === "function") { _onchange(); }
	}
	const connectedGraphs = function() {
		return Graph.connectedGraphs(_m);
		if (typeof _onchange === "function") { _onchange(); }
	}
	const axiom1 = function() {
		return Origami.axiom1(_m, ...arguments).map(e => Crease(this, e));
	}
	const axiom2 = function() {
		return Origami.axiom2(_m, ...arguments).map(e => Crease(this, e));
	}
	const axiom3 = function() {
		return Origami.axiom3(_m, ...arguments).map(e => Crease(this, e));
	}
	const axiom4 = function() {
		return Origami.axiom4(_m, ...arguments).map(e => Crease(this, e));
	}
	const axiom5 = function() {
		return Origami.axiom5(_m, ...arguments).map(e => Crease(this, e));
	}
	const axiom6 = function() {
		return Origami.axiom6(_m, ...arguments).map(e => Crease(this, e));
	}
	const axiom7 = function() {
		return Origami.axiom7(_m, ...arguments).map(e => Crease(this, e));
	}

	// callback for when the crease pattern has been altered
	let _onchange;

	return {
		set onchange(func) { _onchange = func; },
		get onchange() { return _onchange },
		load,
		save,
		clear,
		clearGraph,
		addVertexOnEdge,
		connectedGraphs,
		vertex,
		edge,
		face,
		nearestVertex,
		nearestEdge,
		nearestFace,
		crease,
		axiom1, axiom2, axiom3, axiom4, axiom5, axiom6, axiom7,
		// fold spec 1.1
		get vertices_coords() { return _m.vertices_coords; },
		get vertices_vertices() { return _m.vertices_vertices; },
		get vertices_faces() { return _m.vertices_faces; },
		get edges_vertices() { return _m.edges_vertices; },
		get edges_faces() { return _m.edges_faces; },
		get edges_assignment() { return _m.edges_assignment; },
		get edges_foldAngle() { return _m.edges_foldAngle; },
		get edges_length() { return _m.edges_length; },
		get faces_vertices() { return _m.faces_vertices; },
		get faces_edges() { return _m.faces_edges; },
		get edgeOrders() { return _m.edgeOrders; },
		get faceOrders() { return _m.faceOrders; },
		get file_frames() { return _m.file_frames; }
	};
}

const Crease = function(_graph, _index) {
	let graph = _graph; // pointer back to the graph;
	let index = _index; // index of this crease in the graph

	const is_assignment = function(options) {
		return options.map(l => l === graph.edges_assignment[index])
			.reduce((a,b) => a || b, false);
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
		graph.edges_assignment[index] = "M";
		graph.edges_foldAngle[index] = -180;
		if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	const valley = function() {
		graph.edges_assignment[index] = "V";
		graph.edges_foldAngle[index] = 180;
		if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	const mark = function() {
		graph.edges_assignment[index] = "F";
		graph.edges_foldAngle[index] = 0;
		if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	const remove = function() { }
	const addVertexOnEdge = function(x, y) {
		let thisEdge = this.index;
		graph.addVertexOnEdge(x, y, thisEdge);
	}

	return {
		get index() { return _index; },
		mountain,
		valley,
		flip,
		get isMountain(){ return is_mountain(); },
		get isValley(){ return is_valley(); },
		remove,
		addVertexOnEdge
	};
}

const Vertex = function(_graph, _index) {
	let graph = _graph; // pointer back to the graph;
	let index = _index; // index of this crease in the graph

	return {
		get index() { return _index; },
	};
}

const Face = function(_graph, _index) {
	let graph = _graph; // pointer back to the graph;
	let index = _index; // index of this crease in the graph

	return {
		get index() { return _index; },
	};
}

