let div = document.getElementsByClassName('row')[0];
let origami = RabbitEar.Origami(div);
let folded = RabbitEar.Origami(div);

origami.boot = function() {
	origami.threeCorners = {
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
	origami.cp = RabbitEar.CreasePattern(origami.threeCorners);
}
origami.boot();

origami.midVertex = 4;

origami.updateCenter = function(point){
	// check bounds of point
	let ep = 0.01;
	if (point.x < ep) { point.x = ep; }
	if (point.y < ep) { point.y = ep; }
	if (point.x > 1-ep) { point.x = 1-ep; }
	if (point.y > 1-ep) { point.y = 1-ep; }

	// reset back to the 3 crease CP
	origami.cp = RabbitEar.CreasePattern(origami.threeCorners);
	origami.cp.vertices_coords[origami.midVertex] = [point.x, point.y];

	let a = {x:0, y:0};
	let b = {x:1, y:1};
	let poke_through = (b.x - a.x)
		* (origami.cp.vertices_coords[origami.midVertex][1] - a.y)
		> (b.y - a.y)
		* (origami.cp.vertices_coords[origami.midVertex][0] - a.x);

	origami.cp.edges_assignment[6] = poke_through ? "V" : "M";
	origami.cp.edges_assignment[5] = poke_through ? "M" : "V";

	origami.cp.kawasaki(origami.midVertex, 1, "V");
	
	origami.draw();

	let foldedCP = RabbitEar.fold.origami.fold_without_layering(origami.cp.json, 0);
	foldedCP["re:faces_layer"] = poke_through ? [1,0,2,3] : [0,1,3,2];
	folded.cp = RabbitEar.CreasePattern(foldedCP);
}

origami.onMouseMove = function(mouse){
	if(mouse.isPressed){
		origami.updateCenter(mouse);
	}
}

origami.onMouseDown = function(mouse){
	origami.updateCenter(mouse);
}

origami.updateCenter({x:0.4+Math.random()*0.2, y:0.4+Math.random()*0.2});
