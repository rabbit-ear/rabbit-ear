let creaseThrough = RabbitEar.Origami("canvas-faces-chop");
let folded = RabbitEar.Origami("canvas-faces-chop-folded");
folded.isFolded = true;

creaseThrough.controls = RabbitEar.svg.controls(creaseThrough, 2, {radius:0.02, fill: "#e44f2a"});
creaseThrough.controls.forEach(c => c.position = [Math.random(), Math.random()]);

creaseThrough.masterCP = RabbitEar.bases.blintzDistorted;
creaseThrough.cp = RabbitEar.CreasePattern(creaseThrough.masterCP);

let cpFaces = creaseThrough.faces;
let highlightedFace = 0;

creaseThrough.update = function() {
	let line = RabbitEar.math.Line.fromPoints(creaseThrough.controls[0].position, creaseThrough.controls[1].position);
	let cp = JSON.parse(JSON.stringify(creaseThrough.masterCP));
	RabbitEar.fold.origami.crease_folded(cp, line.point, line.vector, 4);
	creaseThrough.cp = RabbitEar.CreasePattern(cp);
	let foldedCP = RabbitEar.fold.origami.fold_without_layering(cp, creaseThrough.nearest(0.5, 0.5).face.index);
	folded.cp = RabbitEar.CreasePattern(foldedCP);
}
creaseThrough.update();


creaseThrough.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		creaseThrough.update();
	}
}

