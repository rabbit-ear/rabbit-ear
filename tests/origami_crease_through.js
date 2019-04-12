let valleys = RabbitEar.Origami("canvas-faces-chop");
let folded = RabbitEar.Origami("canvas-faces-chop-folded");
folded.isFolded = true;

valleys.drawLayer = valleys.group();

// let cpts = [[0.8, 0.18], [0.2, 0.2]]
let cpts = [[0.3, 0.2], [0.3, 0.3]]

let params = [{
	point: [0.6684523757573304, 0.7068981830977321],
	vector: [0.8305701963995926, 0.0269449235394514]
},{
	// point: [0.5827608218865481, 0.6323193249195302],
	// vector: [0.4901779040449912, 0.7237222669179171]
	point: [0.5827608218865481, 0.6323193249195302],
	vector: [0.4901779040449912, -0.7237222669179171]
}]

for (var i = 0; i < 2; i++) {
	// let point = RabbitEar.math.Vector(Math.random(), Math.random());
	// let vector = RabbitEar.math.Vector(Math.random(), Math.random());
	let point = params[i].point;
	let vector = params[i].vector;
	let stay = RabbitEar.math.Vector(Math.random(), Math.random());
	valleys.cp.valleyFold(point, vector, stay);
	console.log(point, vector);
}

	// let point = RabbitEar.math.Vector(0.2, 0.8);
	// let vector = RabbitEar.math.Vector(1, 1);
	// let stay = RabbitEar.math.Vector(1, -1);
	// valleys.cp.valleyFold(point, vector, stay);


valleys.masterCP = JSON.parse(JSON.stringify(valleys.cp.getFOLD()));
valleys.cp = RabbitEar.CreasePattern(valleys.masterCP);

valleys.controls = RabbitEar.svg.controls(valleys, 2, {radius:0.02, fill: "#e44f2a"});
// valleys.controls.forEach(c => c.position = [Math.random(), Math.random()]);
valleys.controls.forEach((c,i) => c.position = cpts[i]);
valleys.controls[1].circle.setAttribute("fill", "#000");

let yes = true;

valleys.update = function() {
	valleys.drawLayer.removeChildren();

	if(yes){
		valleys.cp = RabbitEar.CreasePattern(valleys.masterCP);
		let line = RabbitEar.math.Line.fromPoints(valleys.controls[0].position, valleys.controls[1].position);
		let cp = JSON.parse(JSON.stringify(valleys.masterCP));
		let points = [
			RabbitEar.math.Vector(valleys.controls[0].position),
			RabbitEar.math.Vector(valleys.controls[1].position)
		];
		let vector = points[1].subtract(points[0]);
		let stayVector = vector.rotateZ90();
		let stayPoint = points[0].midpoint(points[1]).add(stayVector.normalize().scale(0.1));
		valleys.drawLayer.circle(stayPoint[0], stayPoint[1], 0.02).setAttribute("fill", "#224c72");
		valleys.cp.valleyFold(points[0], vector, stayVector);
	}
	folded.cp = RabbitEar.CreasePattern(valleys.cp.getFOLD());
	let notMoving = folded.cp["re:faces_to_move"].indexOf(false);
	console.log("notMoving", notMoving);
	folded.fold(notMoving);
	// let foldedCP = RabbitEar.fold.origami.fold_without_layering(valleys.cp.json, valleys.nearest(0.5, 0.5).face.index);
	// folded.cp = RabbitEar.CreasePattern(foldedCP);
}
valleys.update();

valleys.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		valleys.update();
	}
}
