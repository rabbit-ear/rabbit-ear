let sketch = RabbitEar.Origami("canvas-faces-chop");
let folded = RabbitEar.Origami("canvas-faces-chop-folded");
folded.isFolded = true;

sketch.drawLayer = sketch.group();

sketch.controls = RabbitEar.svg.controls(sketch, 2, {radius:0.02, fill: "#e44f2a"});
sketch.controls.forEach(c => c.position = [Math.random(), Math.random()]);
sketch.controls[1].circle.setAttribute("fill", "#000");

let params = Array.from(Array(6)).map(_ => ({
	point: RabbitEar.math.Vector(Math.random(), Math.random()),
	vector: RabbitEar.math.Vector(Math.random(), Math.random())
}));

// let params = [
// 	{point: [0.200133, 0.670124], vector: [0.631504, 0.400134]},
// 	{point: [0.929233, 0.589455], vector: [0.342171, 0.292683]},
// 	{point: [0.937888, 0.917617], vector: [0.329196, 0.431406]},
// 	{point: [0.760438, 0.965996], vector: [0.507460, 0.654924]}
// ];

console.log("this sketch", params);
params.forEach(p => sketch.cp.valleyFold(p.point, p.vector, [1,1]));

sketch.masterCP = JSON.parse(JSON.stringify(sketch.cp.json));
sketch.cp = RabbitEar.CreasePattern(sketch.masterCP);

let PlanarGraph = RabbitEar.fold.planargraph;
let Graph = RabbitEar.fold.graph;
let Geom = RabbitEar.math;

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

	let faces_matrix = PlanarGraph.make_faces_matrix_inv(graph, face_index);
	let faces_crease_line = faces_matrix.map(m => creaseLine.transform(m));
	let faces_stay_normal = faces_matrix.map(m => stayNormalVec.transform(m));
	let faces_coloring = Graph.faces_coloring(graph, face_index);
	// let faces_is_folding = Array.from(Array(faces_count));
	let original_face_indices = Array.from(Array(faces_count)).map((_,i) => i);

	Array.from(Array(faces_count))
		.map((_,i) => document.querySelector("#faces").children[i])
		.forEach((face,i) => {
			face.setAttribute("fill", faces_coloring[i] ? "#ffffff" : "#f8eed9");
			face.removeAttribute("class");
		});

	let faces_center = Array.from(Array(faces_count))
		.map((line, i) => Geom.Vector(graph.faces_vertices[i]
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
	let svg_segment_p0 = Array.from(Array(faces_count))
		.map((_,i) => faces_crease_line[i].nearestPoint(faces_center[i]));
	let svg_segment_p1 = svg_segment_p0
		.map((p, i) => p.add( faces_crease_line[i].vector.normalize().scale(0.2) ));
	let svg_colors = faces_sidedness.map(side => side ? "#e44f2a" : "#224c72");
	svg_segment_p0
		.map((p0, i) => sketch.drawLayer.line(p0[0], p0[1], svg_segment_p1[i][0], svg_segment_p1[i][1]))
		.forEach((line, i) => {
			line.setAttribute("stroke-width", 0.0075);
			line.setAttribute("stroke", svg_colors[i]);
			line.setAttribute("stroke-dasharray", "0.0075 0.015");
			line.setAttribute("stroke-linecap", "round");
		});
	svg_segment_p1
		.map(p1 => sketch.drawLayer.circle(p1[0], p1[1], 0.015))
		.forEach((circle, i) => circle.setAttribute("fill", svg_colors[i]));
	svg_segment_p1
		.map((p1, i) => sketch.drawLayer.text(""+i, p1[0], p1[1]-0.02))
		.forEach((text, i) => {
			text.setAttribute("fill", svg_colors[i]);
			text.setAttribute("style", "font-family: sans-serif; font-size:0.0333px")
		});

	let cpCopy = RabbitEar.CreasePattern(sketch.masterCP);
	cpCopy.valleyFold(creaseLine.point, creaseLine.vector, [1,1], 0);
	folded.cp = cpCopy;
	let notMoving = folded.cp["re:faces_to_move"].indexOf(false) !== -1
		? folded.cp["re:faces_to_move"].indexOf(false)
		: 0;
	folded.fold(notMoving);

	sketch.setViewBox(-0.2, -0.2, 1.4, 1.4);

}
sketch.update();

sketch.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		sketch.update();
	}
}

