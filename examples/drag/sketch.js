let div = document.querySelectorAll('.row')[0];
let origami = RabbitEar.Origami(div);
let folded = RabbitEar.Origami(div);
folded.preferences.autofit = false;

let lastStep = JSON.parse(JSON.stringify(RabbitEar.bases.square));
folded.dotLayer = folded.group();

folded.onMouseMove = function(mouse) {
	folded.dotLayer.removeChildren();
	let c = folded.dotLayer.circle(mouse.x, mouse.y, 0.02);
	c.setAttribute("fill", "red");
	if (mouse.isPressed) {
		origami.cp = RabbitEar.CreasePattern(lastStep);

		let points = [
			RabbitEar.math.Vector(mouse.pressed),
			RabbitEar.math.Vector(mouse.position)
		];
		let midpoint = points[0].midpoint(points[1]);
		let vector = points[1].subtract(points[0]);

		origami.cp.valleyFold(midpoint, vector.rotateZ270());
	}
	folded.cp = RabbitEar.CreasePattern(origami.cp.json);
	folded.fold();
}

folded.onMouseUp = function(mouse) {
	lastStep = JSON.parse(JSON.stringify(origami.cp));
	folded.updateViewBox();
}
