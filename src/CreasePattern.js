// MIT open source license, Robby Kraft

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

	// todo: callback hooks for when certain properties of the data structure have been altered
	let didChange = undefined; // callback function

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
	}
	const clearGeometry = function() {
		Graph.keys.graph.filter(a => _m[a] != null)
			.forEach(key => delete _m[key]);
	}
	const addVertexOnEdge = function(x, y, oldEdgeIndex) {
		return Graph.add_vertex_on_edge(_m, x, y, oldEdgeIndex);
	}
	const connectedGraphs = function() {
		return Graph.connectedGraphs(_m);
	}

	return {
		// get scale() { return _scale; },
		// set onMouseMove(handler) { _onmousemove = handler; },
		get nodes() { return _nodes; },
		get edges() { return _edges.map(e => e.nodes.map(n => n.index)) },
		didChange,
		load,
		save,
		clear,
		clearGeometry,
		addVertexOnEdge,
		connectedGraphs,
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
