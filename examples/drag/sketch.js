let div = document.querySelectorAll('.row')[0];
let origami = RabbitEar.Origami(div);
let folded = RabbitEar.Origami(div);
origami.setViewBox(-0.1, -0.1, 1.2, 1.2);
folded.setViewBox(-0.1, -0.1, 1.2, 1.2);
folded.preferences.autofit = false;
origami.preferences.autofit = false;
folded.fold();

let lastStep = JSON.parse(JSON.stringify(RabbitEar.bases.square));
folded.dotLayer = folded.group();

origami.onMouseUp = function(mouse) {
	lastStep = JSON.parse(JSON.stringify(RabbitEar.bases.square));
	origami.cp = RabbitEar.CreasePattern(lastStep);
	folded.cp = RabbitEar.CreasePattern(lastStep);
	folded.fold();
}

folded.onMouseMove = function(mouse) {
	folded.dotLayer.removeChildren();
	// let c = folded.dotLayer.circle(mouse.x, mouse.y, 0.02);
	// c.setAttribute("fill", "red");
	// c.setAttribute("pointer-events", "none");
	if (mouse.isPressed) {
		origami.cp = RabbitEar.CreasePattern(lastStep);

		let points = [
			RabbitEar.math.Vector(mouse.pressed),
			RabbitEar.math.Vector(mouse.position)
		];
		let midpoint = points[0].midpoint(points[1]);
		let vector = points[1].subtract(points[0]);

		origami.cp.valleyFold(midpoint, vector.rotateZ90());
	}
	folded.cp = RabbitEar.CreasePattern(origami.cp.json);
	folded.fold();
}

folded.onMouseUp = function(mouse) {
	lastStep = JSON.parse(JSON.stringify(origami.cp));
	// folded.updateViewBox();
}
