let sketch = RabbitEar.Origami("canvas-faces-chop");
let folded = RabbitEar.Origami("canvas-faces-chop-folded");
folded.isFolded = true;

sketch.drawLayer = sketch.group();

sketch.controls = RabbitEar.svg.controls(sketch, 2, {radius:0.02, fill: "#e44f2a"});
sketch.controls.forEach(c => c.position = [Math.random(), Math.random()]);
sketch.controls[1].circle.setAttribute("fill", "#000");

let params = Array.from(Array(2)).map(_ => ({
	point: RabbitEar.math.Vector(Math.random(), Math.random()),
	vector: RabbitEar.math.Vector(Math.random(), Math.random())
}));

// let params = [
// 	{ point: [0.594607, 0.795777], vector: [0.754324, 0.753027]},
// 	{ point: [0.611284, 0.884815], vector: [0.878432, 0.164763]},
// 	{ point: [0.180743, 0.925500], vector: [0.825651, 0.013952]},
// 	{ point: [0.278687, 0.682494], vector: [0.136923, 0.559915]}
// ];

params.forEach(p => sketch.cp.valleyFold(p.point, p.vector, 0));

sketch.masterCP = JSON.parse(JSON.stringify(sketch.cp.json));
sketch.cp = RabbitEar.CreasePattern(sketch.masterCP);

sketch.drawArrow = function(start, end) {
	let ARROW_HEAD = 0.0333;
	let arrow = RabbitEar.svg.group();
	let line = arrow.line(start[0], start[1], end[0], end[1])
	line.setAttribute("stroke-width", 0.0075);
	line.setAttribute("stroke-dasharray", "0.0075 0.015");
	line.setAttribute("stroke-linecap", "round");
	let arrowVector = end.subtract(start).normalize();
	let arrowNormal = arrowVector.rotateZ90();
	let segments = [
		end.add(arrowNormal.scale(-ARROW_HEAD*0.375)),
		end.add(arrowNormal.scale(ARROW_HEAD*0.375)),
		end.add(arrowVector.scale(ARROW_HEAD))
	];
	arrow.polygon(segments).setAttribute("stroke", "none");
	return arrow;
}

sketch.update = function() {
	sketch.drawLayer.removeChildren();

	let creaseLine = RabbitEar.math.Line.fromPoints(sketch.controls[0].position, sketch.controls[1].position);
	let stayNormalVec = creaseLine.vector.rotateZ90();
	
	let creaseL = sketch.drawLayer.line(
		sketch.controls[0].position[0],
		sketch.controls[0].position[1],
		sketch.controls[1].position[0],
		sketch.controls[1].position[1],
	);
	creaseL.setAttribute("stroke-width", 0.01);
	creaseL.setAttribute("stroke", "#f1c14f");
	creaseL.setAttribute("stroke-dasharray", "0.01 0.02");
	creaseL.setAttribute("stroke-linecap", "round");

	let graph = sketch.cp.json;
	let face_index = 0;

	let faces_count = graph.faces_vertices.length;

	let faces_matrix = RabbitEar.core.make_faces_matrix_inv(graph, face_index);
	let faces_crease_line = faces_matrix.map(m => creaseLine.transform(m));
	let faces_stay_normal = faces_matrix.map(m => stayNormalVec.transform(m));
	let faces_coloring = RabbitEar.core.faces_coloring(graph, face_index);
	// let faces_is_folding = Array.from(Array(faces_count));
	let original_face_indices = Array.from(Array(faces_count)).map((_,i) => i);

	Array.from(Array(faces_count))
		.map((_,i) => document.querySelector("#faces").children[i])
		.forEach((face,i) => {
			face.setAttribute("fill", faces_coloring[i] ? "#ffffff" : "#f8eed9");
			face.removeAttribute("class");
		});

	let faces_center = Array.from(Array(faces_count))
		.map((line, i) => RabbitEar.math.Vector(graph.faces_vertices[i]
			.map(v => graph.vertices_coords[v])
			.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
			.map(el => el/graph.faces_vertices[i].length)
		));
	let faces_sidedness = Array.from(Array(faces_count))
		.map((_, i) => faces_center[i].subtract(faces_crease_line[i].point))
		.map((v2, i) => faces_coloring[i]
			? faces_crease_line[i].vector.cross(v2).z > 0
			: faces_crease_line[i].vector.cross(v2).z < 0);

	// svg stuff
	let svg_colors = faces_sidedness.map(side => side ? "#e44f2a" : "#224c72");
	let seg_pts = Array.from(Array(faces_count))
		.map((_,i) => faces_crease_line[i].nearestPoint(faces_center[i]))
		.map((p, i) => [
				p.subtract( faces_crease_line[i].vector.normalize().scale(0.1) ),
				p.add( faces_crease_line[i].vector.normalize().scale(0.1) )
			]);
	let arrows = Array.from(Array(faces_count)).map((_,i) => sketch.drawArrow(seg_pts[i][0], seg_pts[i][1]))
	arrows.forEach(a => sketch.drawLayer.appendChild(a));
	arrows.forEach((a, i) => a.setAttribute("fill", svg_colors[i]));
	arrows.forEach((a, i) => a.setAttribute("stroke", svg_colors[i]));

	seg_pts.map((pts, i) => sketch.drawLayer.text(""+i, pts[1][0], pts[1][1]-0.02))
		.forEach((text, i) => {
			text.setAttribute("fill", svg_colors[i]);
			text.setAttribute("style", "font-family: sans-serif; font-size:0.0333px")
		});

	let cpCopy = RabbitEar.CreasePattern(sketch.masterCP);
	cpCopy.valleyFold(creaseLine.point, creaseLine.vector, 0);
	folded.cp = cpCopy;
	let notMoving = folded.cp["re:faces_to_move"].indexOf(false) !== -1
		? folded.cp["re:faces_to_move"].indexOf(false)
		: 0;
	folded.fold(notMoving);
	// Array.from(folded.groups.face.children)
	// 	.forEach((face,i) => {
	// 		face.setAttribute("fill", faces_coloring[i] ? "#ffffff" : "#f1c14f");
	// 		face.setAttribute("stroke", "black");
	// 		face.setAttribute("stroke-width", 0.005);
	// 		face.removeAttribute("class");
	// 	})

	sketch.setViewBox(-0.2, -0.2, 1.4, 1.4);
}
sketch.update();

sketch.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		sketch.update();
	}
}

