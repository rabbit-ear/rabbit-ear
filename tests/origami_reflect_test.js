let sketch = RabbitEar.Origami("canvas-faces-chop");
let folded = RabbitEar.Origami("canvas-faces-chop-folded");
folded.isFolded = true;

sketch.drawLayer = sketch.group();

sketch.controls = RabbitEar.svg.controls(sketch, 2, {radius:0.02, fill: "#e44f2a"});
sketch.controls.forEach(c => c.position = [Math.random(), Math.random()]);
sketch.controls[1].circle.setAttribute("fill", "#000");

let params = Array.from(Array(4)).map(_ => ({
	point: RabbitEar.math.Vector(Math.random(), Math.random()),
	vector: RabbitEar.math.Vector(Math.random(), Math.random())
}));
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

	let faces_matrix = PlanarGraph.make_faces_matrix_inv(graph, face_index);
	let faces_crease_line = faces_matrix.map(m => creaseLine.transform(m));
	let faces_stay_normal = faces_matrix.map(m => stayNormalVec.transform(m));
	let faces_coloring = Graph.faces_coloring(graph, face_index);
	let faces_folding = Array.from(Array(graph.faces_vertices.length));
	let original_face_indices = Array.from(Array(graph.faces_vertices.length)).map((_,i)=>i);

	Array.from(Array(graph.faces_vertices.length))
		.map((_,i) => document.querySelector("#faces").children[i])
		.forEach((face,i) => {
			face.setAttribute("fill", faces_coloring[i] ? "#FFFFFF" : "#f8eed9");
			face.removeAttribute("class");
		});

	faces_crease_line
		.reverse()
		.forEach((line, reverse_i, arr) => {
			let i = arr.length - 1 - reverse_i;

			let face_center = Geom.Vector(graph.faces_vertices[i]
				.map(v => graph.vertices_coords[v])
				.reduce((a,b) => [a[0]+b[0], a[1]+b[1]], [0,0])
				.map(el => el/graph.faces_vertices[i].length)
			);
			let v2 = face_center.subtract(line.point);


			// console.log("comparing " + i, line.point, line.vector, v2);
			let should_fold = faces_coloring[i]
					? line.vector.cross(v2).z > 0
					: line.vector.cross(v2).z < 0;
			// let should_fold = line.vector.cross(v2).z > 0;
			faces_folding[i] = should_fold;
			
			let nearest_point = line.nearestPoint(face_center);
			let vec = line.vector.normalize().scale(0.2);
			let nearest_p2 = nearest_point.add(vec);
			// let color = "hsl(" + parseInt(360*i/faces_crease_line.length) + ", 88%, 45%)";
			let color = should_fold ? "#e44f2a" : "#224c72";
			sketch.labels.face.children[i].setAttribute("fill", color);
			let l = sketch.drawLayer.line(nearest_point[0], nearest_point[1], nearest_p2[0], nearest_p2[1]);
			l.setAttribute("stroke-width", 0.0075);
			l.setAttribute("stroke", color);
			l.setAttribute("stroke-dasharray", "0.0075 0.015");
			l.setAttribute("stroke-linecap", "round");
			let c = sketch.drawLayer.circle(nearest_p2[0], nearest_p2[1], 0.015);
			c.setAttribute("fill", color);
			let t = sketch.drawLayer.text(""+i, nearest_p2[0], nearest_p2[1]-0.02);
			t.setAttribute("fill", color);
			t.setAttribute("style", "font-family: sans-serif; font-size:0.0333px")
		});

	let cpCopy = RabbitEar.CreasePattern(sketch.masterCP);
	console.log("cpCopy", cpCopy)
	cpCopy.valleyFold(creaseLine.point, creaseLine.vector, [1,1], 0);
	folded.cp = cpCopy;
	let notMoving = folded.cp["re:faces_to_move"].indexOf(false) !== -1
		? folded.cp["re:faces_to_move"].indexOf(false)
		: 0;
	folded.fold(notMoving);
}
sketch.update();

sketch.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		sketch.update();
	}
}

