var div = document.getElementsByClassName('row')[0];
var origami = RabbitEar.Origami(div);
var folded = RabbitEar.Origami(div);
let masterCP = JSON.parse(JSON.stringify(RabbitEar.bases.square));

origami.boot = function() {
	origami.masterCP = {
		"file_spec": 1.1,
		"file_creator": "",
		"file_author": "",
		"file_classes": ["singleModel"],
		"frame_title": "",
		"frame_attributes": ["2D"],
		"frame_classes": ["creasePattern"],
		"vertices_coords": [[0,0], [1,0], [1,1], [0,1], [0.5,0.5]],
		"vertices_vertices": [[1,3], [2,0], [3,1], [0,2], [0,1,3]],
		"vertices_faces": [[0,2], [0,1], [1], [1,2], [0,1,2]],
		"edges_vertices": [[0,1], [1,2], [2,3], [3,0], [0,4], [1,4], [3,4]],
		"edges_faces": [[0], [1], [1], [2], [2,0], [0,1], [1,2]],
		"edges_assignment": ["B","B","B","B","V","V","V"],
		"edges_foldAngle": [0, 0, 0, 0, 180, 180, 180],
		"edges_length": [1, 1, 1, 1, 0.70710678, 0.70710678, 0.70710678],
		"faces_vertices": [[0,1,4], [1,2,3,4], [3,0,4]],
		"faces_edges": [[0,5,4], [1,2,6,5], [3,4,6]]
	};
	origami.cp = RabbitEar.CreasePattern(origami.masterCP);
}
origami.boot();

// folded.mouseZoom = false;
// folded.rotation = 180;
origami.midVertex = 4;

function updateFoldedState(cp){
	folded.cp = cp.copy();
	var topFace = folded.nearest(0.5, 0.002).face;
	folded.draw(topFace);
}

function kawasaki_from_even(array) {
	let even_sum = array.filter((_,i) => i%2 === 0).reduce((a,b) => a+b, 0);
	let odd_sum = array.filter((_,i) => i%2 === 1).reduce((a,b) => a+b, 0);
	// if (even_sum > Math.PI) { return undefined; }
	return [Math.PI - even_sum, Math.PI - odd_sum];
}

let vertex_adjacent_vectors = function(graph, vertex) {
	let adjacent = origami.cp.vertices_vertices[vertex];
	return adjacent.map(v => [
		origami.cp.vertices_coords[v][0] - origami.cp.vertices_coords[vertex][0],
		origami.cp.vertices_coords[v][1] - origami.cp.vertices_coords[vertex][1]
	]);
}

let sector_angles = function(graph, vertex) {
	let adjacent = origami.cp.vertices_vertices[vertex];
	let vectors = adjacent.map(v => [
		origami.cp.vertices_coords[v][0] - origami.cp.vertices_coords[vertex][0],
		origami.cp.vertices_coords[v][1] - origami.cp.vertices_coords[vertex][1]
	]);
	let vectors_as_angles = vectors.map(v => Math.atan2(v[1], v[0]));
	return vectors.map((v,i,arr) => {
		let nextV = arr[(i+1)%arr.length];
		return RabbitEar.math.core.geometry.counter_clockwise_angle2(v, nextV);
	});
}

function kawasaki(graph, vertex) {
	let vectors = vertex_adjacent_vectors(graph, vertex);
	let vectors_as_angles = vectors.map(v => Math.atan2(v[1], v[0]));
	let ks = vectors.map((v,i,arr) => {
		let nextV = arr[(i+1)%arr.length];
		return RabbitEar.math.core.geometry.counter_clockwise_angle2(v, nextV);
	}).map((_, i, arr) => {
		let a = arr.slice();
		a.splice(i,1);
		return a;
	}).map(a => kawasaki_from_even(a));
console.log(ks);
	return ks.map((kawasakis, i, arr) =>
		(kawasakis == null
			? undefined
			: vectors_as_angles[i] + kawasakis[1])
	);
}

origami.updateCenter = function(point){
	origami.cp = RabbitEar.CreasePattern(origami.masterCP);
	origami.cp.vertices_coords[origami.midVertex] = [point.x, point.y];
	origami.draw();

	var a = {x:0,y:0};
	var b = {x:1,y:1};
	var cross = (b.x - a.x)*(origami.cp.vertices_coords[origami.midVertex][1] - a.y) > (b.y - a.y)*(origami.cp.vertices_coords[origami.midVertex][0] - a.x);
	if((b.x - a.x)*(origami.cp.vertices_coords[origami.midVertex][1] - a.y) > (b.y - a.y)*(origami.cp.vertices_coords[origami.midVertex][0] - a.x)){
		origami.cp.edges_assignment[4] = "V";
		// cornerCrease.valley(); kawasakiCrease.mountain();
	} else{
		origami.cp.edges_assignment[4] = "M";
		// kawasakiCrease.valley(); cornerCrease.mountain();
	}
	// updateFoldedState(origami.cp);

	let center = origami.cp.vertices_coords[origami.midVertex];
	let kawasakis = kawasaki(origami.cp, origami.midVertex)
	let cp = origami.cp.json();
	let kawasaki_vec = kawasakis.map(a => [Math.cos(a), Math.sin(a)]);

	RabbitEar.fold.planargraph.split_convex_polygon(cp, 1, center, kawasaki_vec[1], "M");

	origami.cp = RabbitEar.CreasePattern(cp);
	
	kawasakis.forEach(vector => {
		// RabbitEar.fold.origami.crease_line(origami.cp, center, vector)

		// let primaryLine = Geom.Line(center, vector);
		// let coloring = Graph.face_coloring(graph, face_index);
		// PlanarGraph.make_faces_matrix_inv(graph, face_index)
		// 	.map(m => primaryLine.transform(m))
		// 	.reverse()
		// 	.forEach((line, reverse_i, arr) => {
		// 		let i = arr.length - 1 - reverse_i;
		// 		PlanarGraph.split_convex_polygon(graph, i, center, vector, coloring[i] ? "M" : "V");
		// 	});
	});

	origami.draw();
}

origami.onMouseMove = function(mouse){
	if(mouse.isPressed){
		origami.updateCenter(mouse);
	}
}

origami.onMouseDown = function(mouse){
	origami.updateCenter(mouse);
}

origami.updateCenter({x:0.5, y:0.505});
