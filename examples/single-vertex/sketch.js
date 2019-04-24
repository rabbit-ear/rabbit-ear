let div = document.getElementsByClassName('row')[0];
let singleVertex;
singleVertex = RabbitEar.Origami(div, {folding:false}, function(){
	if (singleVertex != null) {
		singleVertex.boot();
		singleVertex.updateCenter({x:0.4+Math.random()*0.2, y:0.4+Math.random()*0.2});
	}
});
let folded = RabbitEar.Origami(div, {folding:false});

singleVertex.boot = function() {
	singleVertex.threeCorners = {
		"file_spec": 1.1,
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
	singleVertex.cp = RabbitEar.CreasePattern(singleVertex.threeCorners);
	singleVertex.preferences.padding = 0.1;
	folded.preferences.padding = 0.1;
}

singleVertex.midVertex = 4;

singleVertex.updateCenter = function(point){
	// check bounds of point
	let ep = 0.01;
	if (point.x < ep) { point.x = ep; }
	if (point.y < ep) { point.y = ep; }
	if (point.x > 1-ep) { point.x = 1-ep; }
	if (point.y > 1-ep) { point.y = 1-ep; }

	// reset back to the 3 crease CP
	singleVertex.cp = RabbitEar.CreasePattern(singleVertex.threeCorners);
	singleVertex.cp.vertices_coords[singleVertex.midVertex] = [point.x, point.y];

	let a = {x:0, y:0};
	let b = {x:1, y:1};
	let poke_through = (b.x - a.x)
		* (singleVertex.cp.vertices_coords[singleVertex.midVertex][1] - a.y)
		> (b.y - a.y)
		* (singleVertex.cp.vertices_coords[singleVertex.midVertex][0] - a.x);

	singleVertex.cp.edges_assignment[4] = poke_through ? "V" : "M";
	singleVertex.cp.edges_assignment[5] = "M";
	singleVertex.cp.kawasaki(singleVertex.midVertex, 1, poke_through ? "V" : "M");
	singleVertex.draw();

	let foldedCP = RabbitEar.core.fold_without_layering(singleVertex.cp.getFOLD(), 0);
	foldedCP["re:faces_layer"] = poke_through ? [1,0,2,3] : [0,1,3,2];
	folded.cp = RabbitEar.CreasePattern(foldedCP);

	Array.from(singleVertex.groups.face.children)
		.forEach(f => f.setAttribute("style", "fill: #ecb233"));
	Array.from(singleVertex.groups.vertex.children)
		.forEach(v => v.setAttribute("style", "fill: none"));
}

singleVertex.onMouseMove = function(mouse){
	if(mouse.isPressed){
		singleVertex.updateCenter(mouse);
	}
}

singleVertex.onMouseDown = function(mouse){
	singleVertex.updateCenter(mouse);
}
