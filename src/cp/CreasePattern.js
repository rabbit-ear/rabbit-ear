// MIT open source license, Robby Kraft

import * as Graph from "../fold/graph";
import * as PlanarGraph from "../fold/planargraph";
import * as Origami from "../fold/origami";
import { Polygon } from "../../include/geometry";
import * as Args from "../convert/arguments";
import { Vertex, Face, Edge, Crease } from "./components";
import * as Convert from "../convert/convert";
import * as Make from "../fold/make";
import * as File from "../fold/file";

const appendRabbitEarExtensions = function(graph) {
	if (graph.faces_vertices.length === 1) {
		graph["re:faces_layer"] = [0]
	}
}

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
		appendRabbitEarExtensions(_this);
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
			return Object.assign(Object.create(null), JSON.parse(JSON.stringify(_this)));
		} catch(error){
			console.warn("could not parse Crease Pattern into JSON", error);
		}
	}

	const svg = function(cssRules) {
		return Convert.fold_to_svg(_this);
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
	};
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
	};
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
	};
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
	};
	const nearestEdge = function(x, y, z = 0) {
		let index = PlanarGraph.nearest_edge(_this, [x, y, z]);
		return (index != null) ? Edge(_this, index) : undefined;
	};
	const nearestFace = function(x, y, z = 0) {
		let index = PlanarGraph.face_containing_point(_this, [x, y, z]);
		return (index != null) ? Face(_this, index) : undefined;
	};

	const getFacesAtPoint = function(x, y, z = 0) {

	};

	const getFoldedFacesAtPoint = function() {
		let point = Args.get_vec(...arguments);
		return getFoldedForm().faces_vertices
			.map((fv,i) => ({face: fv.map(v => folded.vertices_coords[v]), i: i}))
			.filter((f,i) => Geom.core.intersection.point_in_poly(f.face, point))
			.map(f => f.i);
	};

	const getTopFoldedFaceAtPoint = function() {
		let faces = getFoldedFacesAtPoint(...arguments);
		return topmost_face(_this, faces);
	}

	const getFoldedForm = function() {
		let foldedFrame = _this.file_frames
			.filter(f => f.frame_classes.includes("foldedForm"))
			.filter(f => f.vertices_coords.length === _this.vertices_coords.length)
			.shift();
		return foldedFrame != null
			? File.merge_frame(_this, foldedFrame)
			: undefined;
	}


	// updates
	const didModifyGraph = function() {
		// remove file_frames which were dependent on this geometry. we can
		// no longer guarantee they match. alternatively we could mark them invalid
		
		// _this.file_frames = _this.file_frames
		// 	.filter(ff => !(ff.frame_inherit === true && ff.frame_parent === 0));
		
		// broadcast update to handler if attached
		if (typeof _this.onchange === "function") {
			_this.onchange();
		}
	};
	// fold methods
	const valleyFold = function(point, vector, face_index) {
		if (!Args.is_vector(point) || !Args.is_vector(vector) || !Args.is_number(face_index)) {
			console.warn("valleyFold was not supplied the correct parameters");
			return;
		}
		let folded = Origami.crease_through_layers(_this, point, vector, face_index, "V");
		Object.keys(folded).forEach(key => _this[key] = folded[key]);
		delete _this["re:faces_matrix"];
		didModifyGraph();
	};

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
		let crease = Crease(_this, Origami["axiom"+number](_this, ...args));
		didModifyGraph();
		return crease;
	};
	const axiom1 = function() { return axiom.call(_this, [1, arguments]); };
	const axiom2 = function() { return axiom.call(_this, [2, arguments]); };
	const axiom3 = function() { return axiom.call(_this, [3, arguments]); };
	const axiom4 = function() { return axiom.call(_this, [4, arguments]); };
	const axiom5 = function() { return axiom.call(_this, [5, arguments]); };
	const axiom6 = function() { return axiom.call(_this, [6, arguments]); };
	const axiom7 = function() { return axiom.call(_this, [7, arguments]); };

	const addVertexOnEdge = function(x, y, oldEdgeIndex) {
		Graph.add_vertex_on_edge(_this, x, y, oldEdgeIndex);
		didModifyGraph();
	};

	const creaseLine = function() {
		let crease = Crease(this, Origami.crease_line(_this, ...arguments));
		didModifyGraph();
		return crease;
	};
	const creaseRay = function() {
		let crease = Crease(this, Origami.creaseRay(_this, ...arguments));
		didModifyGraph();
		return crease;
	};
	const creaseSegment = function() {
		let crease = Crease(this, Origami.creaseSegment(_this, ...arguments));
		didModifyGraph();
		return crease;
	};
	const creaseThroughLayers = function(point, vector, face) {
		RabbitEar.fold.origami.crease_folded(_this, point, vector, face);
		didModifyGraph();
	};
	const kawasaki = function() {
		let crease = Crease(this, Origami.kawasaki_collapse(_this, ...arguments));
		didModifyGraph();
		return crease;
	};

	Object.defineProperty(proto, "getFoldedForm", { value: getFoldedForm });

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

	Object.defineProperty(proto, "axiom1", { value: axiom1 });
	Object.defineProperty(proto, "axiom2", { value: axiom2 });
	Object.defineProperty(proto, "axiom3", { value: axiom3 });
	Object.defineProperty(proto, "axiom4", { value: axiom4 });
	Object.defineProperty(proto, "axiom5", { value: axiom5 });
	Object.defineProperty(proto, "axiom6", { value: axiom6 });
	Object.defineProperty(proto, "axiom7", { value: axiom7 });
	Object.defineProperty(proto, "valleyFold", { value: valleyFold });
	Object.defineProperty(proto, "addVertexOnEdge", { value: addVertexOnEdge });
	Object.defineProperty(proto, "creaseLine", { value: creaseLine });
	Object.defineProperty(proto, "creaseRay", { value: creaseRay });
	Object.defineProperty(proto, "creaseSegment", { value: creaseSegment });
	Object.defineProperty(proto, "creaseThroughLayers", { value: creaseThroughLayers });
	Object.defineProperty(proto, "kawasaki", { value: kawasaki });
	
	Object.defineProperty(proto, "isFolded", { get: function(){
		// todo, this is a heuristic function. can incorporate more cases
		if (_this.frame_classes == null) { return false; }
		return _this.frame_classes.includes("foldedForm");
	}});

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
	// todo: which key should we check to verify .fold? coords prevents abstract CPs
	let foldObjs = Array.from(arguments)
		.filter(el => typeof el === "object" && el !== null)
		.filter(el => el.vertices_coords != null);
	// unit square is the default base if nothing else is provided
	graph.load( (foldObjs.shift() || Make.square()) );

	// callback for when the crease pattern has been altered
	graph.onchange = undefined;

	return graph;
}

CreasePattern.square = function() {
	return CreasePattern();
}
CreasePattern.rectangle = function(width = 1, height = 1) {
	return CreasePattern(Make.rectangle(width, height));
}
CreasePattern.regularPolygon = function(sides, radius = 1) {
	if (sides == null) {
		console.warn("regularPolygon requires number of sides parameter");
	}
	return CreasePattern(Make.regular_polygon(sides, radius));
}

export default CreasePattern;
