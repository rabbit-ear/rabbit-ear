// MIT open source license, Robby Kraft

import * as Graph from "../fold/graph";
import * as PlanarGraph from "../fold/planargraph";
import * as Origami from "../fold/origami";
import { Polygon } from "../../include/geometry";
import * as Input from "../fold/input";
import squareFoldString from "../bases/square.fold";
import { Vertex, Face, Edge, Crease } from "./components";

const CreasePatternPrototype = function(proto) {
	if(proto == null) {
		proto = {};
	}

	/**
	 * @param {file} is a FOLD object.
	 * @param {prevent_wipe} true and it will import without first clearing
	 */
	const load = function(file, prevent_wipe) {
		if (prevent_wipe == null || prevent_wipe !== true) {
			Graph.all_keys.forEach(key => delete this[key])
		}
		Object.assign(this, JSON.parse(JSON.stringify(file)));
	}
	/**
	 * @return {CreasePattern} a deep copy of this object.
	 */ 
	const copy = function() {
		return CreasePattern(JSON.parse(JSON.stringify(this)));
	}
	/**
	 * this removes all geometry from the crease pattern and returns it
	 * to its original state (and keeps the boundary edges if present)
	 */
	const clear = function() {
		Graph.remove_non_boundary_edges(this);
		if (typeof this.onchange === "function") { this.onchange(); }
	}
	/**
	 * @return {Object} a deep copy of this object in the FOLD format.
	 */ 
	const getFOLD = function() {
		return JSON.parse(JSON.stringify(this));
	}

	// const wipe = function() {
	// 	Graph.all_keys.filter(a => _m[a] != null)
	// 		.forEach(key => delete _m[key]);
	// 	if (typeof this.onchange === "function") { this.onchange(); }
	// }

	// todo: memo these. they're created each time, even if the CP hasn't changed
	const getVertices = function() {
		return (this.vertices_coords || [])
			.map((_,i) => Vertex(this, i));
	}
	const getEdges = function() {
		return (this.edges_vertices || [])
			.map((_,i) => Edge(this, i));
		// return (this.edges_vertices || [])
		// 		.map(e => e.map(ev => this.vertices_coords[ev]))
		// 		.map(e => Geometry.Edge(e));
	}
	const getFaces = function() {
		return (this.faces_vertices || [])
			.map((_,i) => Face(this, i));
		// return (this.faces_vertices || [])
		// 		.map(f => f.map(fv => this.vertices_coords[fv]))
		// 		.map(f => Polygon(f));
	}
	const getBoundary = function() {
		// todo: test this for another reason anyway
		// todo: this only works for unfolded flat crease patterns
		return Polygon(
			Graph.get_boundary_face(this).vertices
				.map(v => this.vertices_coords[v])
		);
	};
	const nearestVertex = function(x, y, z = 0) {
		let index = PlanarGraph.nearest_vertex(this, [x, y, z]);
		return (index != null) ? Vertex(this, index) : undefined;
	}
	const nearestEdge = function(x, y, z = 0) {
		let index = PlanarGraph.nearest_edge(this, [x, y, z]);
		return (index != null) ? Edge(this, index) : undefined;
	}
	const nearestFace = function(x, y, z = 0) {
		let index = PlanarGraph.face_containing_point(this, [x, y, z]);
		return (index != null) ? Face(this, index) : undefined;
	}

	Object.defineProperty(proto, "boundary", { get: getBoundary });
	Object.defineProperty(proto, "vertices", { get: getVertices });
	Object.defineProperty(proto, "edges", { get: getEdges });
	Object.defineProperty(proto, "faces", { get: getFaces });
	Object.defineProperty(proto, "clear", { value: clear });
	Object.defineProperty(proto, "load", { value: load });
	Object.defineProperty(proto, "copy", { value: copy });
	Object.defineProperty(proto, "getFOLD", { value: getFOLD});
	Object.defineProperty(proto, "nearestVertex", { value: nearestVertex });
	Object.defineProperty(proto, "nearestEdge", { value: nearestEdge });
	Object.defineProperty(proto, "nearestFace", { value: nearestFace });
	Object.defineProperty(proto, "connectedGraphs", { get: function() {
		return Graph.connectedGraphs(this);
	}});

	return Object.freeze(proto);
}

/** A graph is a set of nodes and edges connecting them */
const CreasePattern = function() {
	let graph = Object.create(CreasePatternPrototype());

	// parse arguments, look for an input .fold file
	let params = Array.from(arguments);
	let paramsObjs = params.filter(el => typeof el === "object" && el !== null);
	// todo: which key should we check to verify .fold? coords prevents abstract CPs
	let foldObjs = paramsObjs.filter(el => el.vertices_coords != null);

	// unit square is the default base if nothing else is provided
	graph.load( (foldObjs.shift() || JSON.parse(squareFoldString)) );

	/** 
	 * the most important thing this class offers: this component array
	 * each object matches 1:1 a component in the FOLD graph.
	 * each component brings extra functionality to these edges/faces/vertices.
	 * take great care to make sure they are always matching 1:1.
	 * keys are each component's UUID for speedy lookup.
	 */
	let components = {};

	// unclear how best to use frames
	// let frame = 0; // which fold file frame (0 ..< Inf) to display

	// callback for when the crease pattern has been altered
	graph.onchange = undefined;

	const didUpdate = function() {
		if (typeof graph.onchange === "function") {
			graph.onchange();
		}
	}

	Object.defineProperty(graph, "isFolded", { get: function(){
		// try to discern folded state
		if (graph.frame_classes == null) { return false; }
		return graph.frame_classes.includes("foldedState");
	}});

	graph.addVertexOnEdge = function(x, y, oldEdgeIndex) {
		Graph.add_vertex_on_edge(graph, x, y, oldEdgeIndex);
		didUpdate();
	}
	graph.axiom1 = function() {
		let points = Input.get_two_vec2(...arguments);
		if (!points) { throw {name: "TypeError", message: "axiom1 needs 2 points"}; }
		// let line = Geom.core.axiom[1](...points);
		// let crease = Crease(this, crease_line(graph, line[0], line[1]));
		let crease = Crease(this, Origami.axiom1(graph, ...points));
		didUpdate();
		return crease;
	}
	graph.axiom2 = function() {
		let points = Input.get_two_vec2(...arguments);
		if (!points) { throw {name: "TypeError", message: "axiom2 needs 2 points"}; }
		let crease = Crease(this, Origami.axiom2(graph, ...points));
		didUpdate();
		return crease;
	}
	graph.axiom3 = function() {
		let lines = Input.get_two_lines(...arguments);
		if (!lines) { throw {name: "TypeError", message: "axiom3 needs 2 lines"}; }
		let crease = Crease(this, Origami.axiom3(graph, ...lines[0], ...lines[1]));
		didUpdate();
		return crease;
	}
	graph.axiom4 = function() {
		let crease = Crease(this, Origami.axiom4(graph, arguments));
		didUpdate();
		return crease;
	}
	graph.axiom5 = function() {
		let crease = Crease(this, Origami.axiom5(graph, arguments));
		didUpdate();
		return crease;
	}
	graph.axiom6 = function() {
		let crease = Crease(this, Origami.axiom6(graph, arguments));
		didUpdate();
		return crease;
	}
	graph.axiom7 = function() {
		let crease = Crease(this, Origami.axiom7(graph, arguments));
		didUpdate();
		return crease;
	}
	graph.creaseRay = function() {
		let crease = Crease(this, Origami.creaseRay(graph, ...arguments));
		didUpdate();
		return crease;
	}
	graph.creaseSegment = function() {
		let crease = Crease(this, Origami.creaseSegment(graph, ...arguments));
		didUpdate();
		return crease;
	}
	graph.creaseThroughLayers = function(point, vector, face) {
		RabbitEar.fold.origami.crease_folded(graph, point, vector, face);
		didUpdate();
	}
	graph.valleyFold = function(point, vector, face_index) {
		let folded = Origami.crease_through_layers(graph, point, vector, face_index, "V");
		Object.keys(folded).forEach(key => graph[key] = folded[key]);
		didUpdate();
	}
	graph.kawasaki = function() {
		let crease = Crease(this, Origami.kawasaki_collapse(graph, ...arguments));
		didUpdate();
		return crease;
	}

	return graph;

}

export default CreasePattern;
