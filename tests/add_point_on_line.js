const newVertex = function(_m, x, y) {
	if (_m.vertices_coords == null) { _m.vertices_coords = []; }
	_m.vertices_coords.push([x,y]);
	return _m.vertices_coords.length-1;
}

function remove_edges(graph, edges){
	// length of index_map is length of the original edges_vertices
	let s = 0, removes = Array( graph.edges_vertices.length ).fill(false);
	edges.forEach(e => removes[e] = true);
	let index_map = removes.map(remove => remove ? --s : s);

	if(edges.length == 0){ return removes; }

	// update every component that points to edges_vertices
	// these arrays do not change their size, only their contents
	if(graph.faces_edges != null){
		graph.faces_edges = graph.faces_edges
			.map(entry => entry.map(v => v + index_map[v]));
	}
	if(graph.edgeOrders != null){
		graph.edgeOrders = graph.edgeOrders
			.map(entry => entry.map((v,i) => {
				if(i == 2) return v;  // exception. orientation. not index.
				return v + index_map[v];
			}));
	}

	// update every array with a 1:1 relationship to edges_ arrays
	// these arrays change their size, their contents are untouched
	if(graph.edges_vertices != null){
		graph.edges_vertices = graph.edges_vertices
			.filter((e,i) => !removes[i])
	}
	if(graph.edges_faces != null){
		graph.edges_faces = graph.edges_faces
			.filter((e,i) => !removes[i])
	}
	if(graph.edges_assignment != null){
		graph.edges_assignment = graph.edges_assignment
			.filter((e,i) => !removes[i])
	}
	if(graph.edges_foldAngle != null){
		graph.edges_foldAngle = graph.edges_foldAngle
			.filter((e,i) => !removes[i])
	}
	if(graph.edges_length != null){
		graph.edges_length = graph.edges_length
			.filter((e,i) => !removes[i])
	}
	return removes;
	// todo: do the same with frames in file_frames where inherit=true
}

const addVertexOnEdge = function(_m, x, y, old_edge_index) {
	if (_m.edges_vertices.length < old_edge_index) { return; }
	// new vertex entries
	// vertices_coords
	let new_vertex_index = newVertex(_m, x, y);
	let incident_vertices = _m.edges_vertices[old_edge_index];
	// vertices_vertices, new vertex
	if (_m.vertices_vertices == null) { _m.vertices_vertices = []; }
	_m.vertices_vertices[new_vertex_index] = [...incident_vertices];
	// vertices_vertices, update incident vertices with new vertex
	incident_vertices.forEach((v,i,arr) => {
		let otherV = arr[(i+1)%arr.length];
		let otherI = _m.vertices_vertices[v].indexOf(otherV);
		_m.vertices_vertices[v][otherI] = new_vertex_index;
	})
	// vertices_faces
	if (_m.edges_faces != null && _m.edges_faces[old_edge_index] != null) {
		_m.vertices_faces[new_vertex_index] = [..._m.edges_faces[old_edge_index]];
	}
	// new edges entries
	// set edges_vertices
	let new_edges = [
		{ edges_vertices: [incident_vertices[0], new_vertex_index] },
		{ edges_vertices: [new_vertex_index, incident_vertices[1]] }
	];
	// set new index in edges_ arrays
	new_edges.forEach((e,i) => e.i = _m.edges_vertices.length+i);
	// copy over relevant data if it exists
	["edges_faces", "edges_assignment", "edges_foldAngle"]
		.filter(key => _m[key] != null && _m[key][old_edge_index] != null)
		.forEach(key => {
			// todo, copy these arrays
			new_edges[0][key] = _m[key][old_edge_index];
			new_edges[1][key] = _m[key][old_edge_index];
		});

	// todo: recalculate "edges_length"
	// todo: copy over edgeOrders. don't need to do this with faceOrders

	new_edges.forEach((edge,i) =>
		Object.keys(edge)
			.filter(key => key !== "i")
			.forEach(key => _m[key][edge.i] = edge[key])
	);
	let incident_faces_indices = _m.edges_faces[old_edge_index];
	let face_edges = _m.faces_edges

	let incident_faces_edges = incident_faces_indices.map(i => _m.faces_edges[i]);
	let incident_faces_vertices = incident_faces_indices.map(i => _m.faces_vertices[i]);

	// faces_vertices
	// because Javascript, this is a pointer and modifies the master graph
	incident_faces_vertices.forEach(face => 
		face.map((fv,i,arr) => {
			let nextI = (i+1)%arr.length;
			return (fv === incident_vertices[0] && arr[nextI] === incident_vertices[1]) ||
			       (fv === incident_vertices[1] && arr[nextI] === incident_vertices[0])
				? nextI : undefined;
		}).filter(el => el !== undefined)
		.sort((a,b) => b-a)
		.forEach(i => face.splice(i,0,new_vertex_index))
	);

	// faces_edges
	incident_faces_edges.forEach((face,i,arr) => {
		// there should be 2 faces in this array, incident to the removed edge
		// find the location of the removed edge in this face
		let edgeIndex = face.indexOf(old_edge_index);
		// the previous and next edge in this face, counter-clockwise
		let prevEdge = face[(edgeIndex+face.length-1)%face.length];
		let nextEdge = face[(edgeIndex+1)%face.length];
		let vertices = [
			[prevEdge, old_edge_index],
			[old_edge_index, nextEdge]
		].map(pairs => {
			let verts = pairs.map(e => _m.edges_vertices[e])
			return verts[0][0] === verts[1][0] || verts[0][0] === verts[1][1]
				? verts[0][0] : verts[0][1]; 
		}).reduce((a,b) => a.concat(b),[])
		let edges = [
			[vertices[0], new_vertex_index],
			[new_vertex_index, vertices[1]]
		].map(verts => {
			let in0 = verts.map(v => new_edges[0].edges_vertices.indexOf(v) !== -1)
				.reduce((a,b) => a && b, true);
			let in1 = verts.map(v => new_edges[1].edges_vertices.indexOf(v) !== -1)
				.reduce((a,b) => a && b, true);
			if(in0) { return new_edges[0].i; }
			if(in1) { return new_edges[1].i; }
			throw "something wrong with faces_edges construction";
		})
		face.splice(edgeIndex, 1, ...edges);
		return edges;
	});

// remove old data
	// ["edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle", "edges_length"]
	// 	.filter(key => _m[key] != null)
	// 	.forEach(key => _m[key][old_edge_index] = undefined);

	remove_edges(_m, [old_edge_index]);
}

let cp = RabbitEar.bases.kite;

let origami = RabbitEar.Origami(cp);

origami.onMouseDown = function(event) {
	let nearest = origami.nearest(event);
	addVertexOnEdge(cp, event.x, event.y, nearest.crease);
	origami.cp = cp;
}

