// MIT open source license, Robby Kraft

import * as Graph from "../fold/graph";
import * as PlanarGraph from "../fold/planargraph";
import * as Origami from "../fold/origami";
import { Polygon } from "../../include/geometry";
import * as Args from "../convert/arguments";
import squareFoldString from "../bases/square.fold";
import { Vertex, Face, Edge, Crease } from "./components";
import * as File from "../convert/file";

const CreasePatternPrototype = function(proto) {
	if(proto == null) {
		proto = {};
	}

	/** 
	 * the most important thing this class offers: this component array
	 * each object matches 1:1 a component in the FOLD graph.
	 * when a graph component gets removed, its corresponding object deletes
	 * itself so even if the user holds onto it, it no longer points to anything.
	 * each component brings extra functionality to these edges/faces/vertices.
	 * take great care to make sure they are always matching 1:1.
	 * keys are each component's UUID for speedy lookup.
	 */
	let components = {
		vertices: [],
		edges: [],
		faces: [],
		// boundary: {},
	};

	let _this;

	const bind = function(that){
		_this = that;
	}

	/**
	 * @param {file} is a FOLD object.
	 * @param {prevent_wipe} true and it will import without first clearing
	 */
	const load = function(file, prevent_wipe) {
		if (prevent_wipe == null || prevent_wipe !== true) {
			Graph.all_keys.forEach(key => delete _this[key])
		}
		Object.assign(_this, JSON.parse(JSON.stringify(file)));
	}
	/**
	 * @return {CreasePattern} a deep copy of this object.
	 */ 
	const copy = function() {
		return CreasePattern(JSON.parse(JSON.stringify(_this)));
	}
	/**
	 * this removes all geometry from the crease pattern and returns it
	 * to its original state (and keeps the boundary edges if present)
	 */
	const clear = function() {
		Graph.remove_non_boundary_edges(_this);
		if (typeof _this.onchange === "function") { _this.onchange(); }
	}
	/**
	 * @return {Object} a deep copy of this object in the FOLD format.
	 */ 
	const json = function() {
		try {
			return JSON.parse(JSON.stringify(_this));
		} catch(error){
			console.warn("could not parse Crease Pattern into JSON", error);
		}
	}

	const svg = function(cssRules) {
		return File.fold_to_svg(_this);
	}

	// const wipe = function() {
	// 	Graph.all_keys.filter(a => _m[a] != null)
	// 		.forEach(key => delete _m[key]);
	// 	if (typeof this.onchange === "function") { this.onchange(); }
	// }

	// todo: memo these. they're created each time, even if the CP hasn't changed
	const getVertices = function() {
		components.vertices
			.filter(v => v.disable !== undefined)
			.forEach(v => v.disable());
		components.vertices = (_this.vertices_coords || [])
			.map((_,i) => Vertex(_this, i));
		return components.vertices;
	}
	const getEdges = function() {
		components.edges
			.filter(e => e.disable !== undefined)
			.forEach(e => e.disable());
		components.edges = (_this.edges_vertices || [])
			.map((_,i) => Edge(_this, i));
		return components.edges;
		// return (this.edges_vertices || [])
		// 		.map(e => e.map(ev => this.vertices_coords[ev]))
		// 		.map(e => Geometry.Edge(e));
	}
	const getFaces = function() {
		components.faces
			.filter(f => f.disable !== undefined)
			.forEach(f => f.disable());
		components.faces = (_this.faces_vertices || [])
			.map((_,i) => Face(_this, i));
		return components.faces;
		// return (this.faces_vertices || [])
		// 		.map(f => f.map(fv => this.vertices_coords[fv]))
		// 		.map(f => Polygon(f));
	}
	const getBoundary = function() {
		// todo: test this for another reason anyway
		// todo: this only works for unfolded flat crease patterns
		return Polygon(
			Graph.get_boundary_face(_this).vertices
				.map(v => _this.vertices_coords[v])
		);
	};
	const nearestVertex = function(x, y, z = 0) {
		let index = PlanarGraph.nearest_vertex(_this, [x, y, z]);
		return (index != null) ? Vertex(_this, index) : undefined;
	}
	const nearestEdge = function(x, y, z = 0) {
		let index = PlanarGraph.nearest_edge(_this, [x, y, z]);
		return (index != null) ? Edge(_this, index) : undefined;
	}
	const nearestFace = function(x, y, z = 0) {
		let index = PlanarGraph.face_containing_point(_this, [x, y, z]);
		return (index != null) ? Face(_this, index) : undefined;
	}

	Object.defineProperty(proto, "boundary", { get: getBoundary });
	Object.defineProperty(proto, "vertices", { get: getVertices });
	Object.defineProperty(proto, "edges", { get: getEdges });
	Object.defineProperty(proto, "faces", { get: getFaces });
	Object.defineProperty(proto, "clear", { value: clear });
	Object.defineProperty(proto, "load", { value: load });
	Object.defineProperty(proto, "copy", { value: copy });
	Object.defineProperty(proto, "bind", { value: bind });
	Object.defineProperty(proto, "json", { get: json });
	Object.defineProperty(proto, "nearestVertex", { value: nearestVertex });
	Object.defineProperty(proto, "nearestEdge", { value: nearestEdge });
	Object.defineProperty(proto, "nearestFace", { value: nearestFace });
	Object.defineProperty(proto, "svg", { value: svg });
	// Object.defineProperty(proto, "connectedGraphs", { get: function() {
	// 	return Graph.connectedGraphs(this);
	// }});

	return Object.freeze(proto);
}

/** A graph is a set of nodes and edges connecting them */
const CreasePattern = function() {
	let proto = CreasePatternPrototype();
	let graph = Object.create(proto);
	proto.bind(graph);

	// parse arguments, look for an input .fold file
	let params = Array.from(arguments);
	let paramsObjs = params.filter(el => typeof el === "object" && el !== null);
	// todo: which key should we check to verify .fold? coords prevents abstract CPs
	let foldObjs = paramsObjs.filter(el => el.vertices_coords != null);

	// unit square is the default base if nothing else is provided
	graph.load( (foldObjs.shift() || JSON.parse(squareFoldString)) );

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
		return graph.frame_classes.includes("foldedForm");
	}});

	graph.addVertexOnEdge = function(x, y, oldEdgeIndex) {
		Graph.add_vertex_on_edge(graph, x, y, oldEdgeIndex);
		didUpdate();
	}
	const axiom = function(number, params) {
		let args;
		switch(number) {
			case 1: args = Args.get_two_vec2(params); break;
			case 2: args = Args.get_two_vec2(params); break;
			case 3: args = Args.get_two_lines(params); break;
			case 4: args = Args.get_two_lines(params); break;
			case 5: args = Args.get_two_lines(params); break;
			case 6: args = Args.get_two_lines(params); break;
			case 7: args = Args.get_two_lines(params); break;
		}
		if (args === undefined) {
			throw "axiom " + number + " was not provided with the correct inputs";
		}
		let crease = Crease(this, Origami["axiom"+number](graph, ...args));
		didUpdate();
		return crease;
	}

	graph.axiom1 = function() { return axiom.call(this, [1, arguments]); }
	graph.axiom2 = function() { return axiom.call(this, [2, arguments]); }
	graph.axiom3 = function() { return axiom.call(this, [3, arguments]); }
	graph.axiom4 = function() { return axiom.call(this, [4, arguments]); }
	graph.axiom5 = function() { return axiom.call(this, [5, arguments]); }
	graph.axiom6 = function() { return axiom.call(this, [6, arguments]); }
	graph.axiom7 = function() { return axiom.call(this, [7, arguments]); }
	graph.creaseLine = function() {
		let crease = Crease(this, Origami.crease_line(graph, ...arguments));
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
	graph.rectangle = function() {
		// remove boundary
		// add new boundary
	}

	return graph;

}

export default CreasePattern;
