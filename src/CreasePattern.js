// MIT open source license, Robby Kraft

import * as Graph from "./fold/graph";
import * as PlanarGraph from "./fold/planargraph";
import * as Origami from "./fold/origami";
import * as Geometry from "../lib/geometry";
import squareFoldString from "./bases/square.fold";
import * as Input from "./fold/input";
import * as Import from "./fold/import";

let cpObjKeys = ["load", "json", "clear", "wipe", "clearGraph", "nearestVertex", "nearestEdge", "nearestFace", "vertex", "edge", "face", "crease", "addVertexOnEdge", "connectedGraphs", "axiom1", "axiom2", "axiom3", "axiom4", "axiom5", "axiom6", "axiom7", "creaseRay"];

/** A graph is a set of nodes and edges connecting them */
export default function() {
	let graph = {}; // the returned object. fold file format spec

	// parse arguments, look for an input .fold file
	let params = Array.from(arguments);
	let paramsObjs = params.filter(el => typeof el === "object" && el !== null);
	// todo: which key should we check to verify .fold? coords prevents abstract CPs
	let foldObjs = paramsObjs.filter(el => el.vertices_coords != null);
	if (foldObjs.length > 0) {
		// expecting the user to have passed in a fold_file.
		// if there are multiple we are only grabbing the first one
		graph = JSON.parse(JSON.stringify(foldObjs.shift()));
	} else {
		// unit square is the default base if nothing else is provided
		graph = JSON.parse(squareFoldString);
	}

	// unclear if we want to use this
	// let frame = 0; // which fold file frame (0 ..< Inf) to display

	// callback for when the crease pattern has been altered
	graph.onchange = undefined;

	graph.load = function(file) {
		// todo: 
		let imported = JSON.parse(JSON.stringify(file));
		// Graph.all_keys.filter(key => graph[key] = undefined) {

		// }
		for (let key in imported) {
			graph[key] = imported[key];
		}
	}
	graph.clear = function() {
		Graph.remove_non_boundary_edges(graph);
		if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	graph.wipe = function() {
		// Graph.all_keys.filter(a => _m[a] != null)
		// 	.forEach(key => delete _m[key]);
		// if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	graph.clearGraph = function() {
		// Graph.keys.graph.filter(a => _m[a] != null)
		// 	.forEach(key => delete _m[key]);
		// if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	graph.nearestVertex = function(x, y, z = 0) {
		let index = PlanarGraph.nearest_vertex(graph, [x, y, z]);
		return (index != null) ? Vertex(this, index) : undefined;
	}
	graph.nearestEdge = function(x, y, z = 0) {
		let index = PlanarGraph.nearest_edge(graph, [x, y, z]);
		return (index != null) ? Edge(this, index) : undefined;
	}
	graph.nearestFace = function(x, y, z = 0) {
		let index = PlanarGraph.face_containing_point(graph, [x, y, z]);
		return (index != null) ? Face(this, index) : undefined;
	}
	graph.vertex = function(index)   { return Vertex(this, index);   }
	graph.edge = function(index)     { return Edge(this, index);     }
	graph.face = function(index)     { return Face(this, index);     }
	graph.crease = function(indices) { return Crease(this, indices); }

	graph.addVertexOnEdge = function(x, y, oldEdgeIndex) {
		Graph.add_vertex_on_edge(graph, x, y, oldEdgeIndex);
		if (typeof graph.onchange === "function") { graph.onchange(); }
	}
	graph.axiom1 = function() {
		let points = Input.get_two_vec2(...arguments);
		if (!points) { throw {name: "TypeError", message: "axiom1 needs 2 points"}; }
		return Crease(this, Origami.axiom1(graph, ...points));
	}
	graph.axiom2 = function() {
		let points = Input.get_two_vec2(...arguments);
		if (!points) { throw {name: "TypeError", message: "axiom2 needs 2 points"}; }
		return Crease(this, Origami.axiom2(graph, ...points));
	}
	graph.axiom3 = function() {
		let lines = Input.get_two_lines(...arguments);
		if (!lines) { throw {name: "TypeError", message: "axiom3 needs 2 lines"}; }
		return Crease(this, Origami.axiom3(graph, ...lines[0], ...lines[1]));
	}
	graph.axiom4 = function() {
		return Crease(this, Origami.axiom4(graph, arguments));
	}
	graph.axiom5 = function() {
		return Crease(this, Origami.axiom5(graph, arguments));
	}
	graph.axiom6 = function() {
		return Crease(this, Origami.axiom6(graph, arguments));
	}
	graph.axiom7 = function() {
		return Crease(this, Origami.axiom7(graph, arguments));
	}
	graph.creaseRay = function() {
		return Crease(this, Origami.creaseRay(graph, ...arguments));
	}
	graph.creaseSegment = function() {
		return Crease(this, Origami.creaseSegment(graph, ...arguments));
	}
	graph.kawasaki = function() {
		return Crease(this, Origami.kawasaki_collapse(graph, ...arguments));
	}
	// getters, setters
	Object.defineProperty(graph, "json", { get: function() {
			let fold_file = Object.create(null);
			Object.assign(fold_file, graph);
			cpObjKeys.forEach(key => delete fold_file[key]);
			return JSON.parse(JSON.stringify(fold_file));
		}
	});
	Object.defineProperty(graph, "boundary", { get: function() {
			let boundaryVertices = Graph.get_boundary_face(graph).vertices
				.map(v => graph.vertices_coords[v]);
			return Geometry.Polygon(boundaryVertices);
		}
	});
	Object.defineProperty(graph, "connectedGraphs", { get: function() {
			return Graph.connectedGraphs(graph);
		}
	});

	return graph;
}

// consider this: a crease can be an ARRAY of edges. 
// this way one crease is one crease. it's more what a person expects.
// one crease can == many edges.
const Crease = function(_graph, _indices) {
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

	return {
		get index() { return _indices; },
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

const Edge = function(_graph, _index) {
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
		mark,
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

