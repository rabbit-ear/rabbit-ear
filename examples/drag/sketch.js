let div = document.querySelectorAll('.row')[0];
let origami = RabbitEar.Origami(div);
let folded = RabbitEar.Origami(div);
folded.preferences.autofit = false;

folded.lastCP = JSON.parse(JSON.stringify(RabbitEar.bases.square));
folded.dotLayer = folded.group();

folded.onMouseMove = function(mouse) {
	folded.dotLayer.removeChildren();
	let c = folded.dotLayer.circle(mouse.x, mouse.y, 0.02);
	c.setAttribute("fill", "red");
	if (mouse.isPressed) {
		origami.cp = RabbitEar.CreasePattern(origami.lastCP);
		// origami.cp.axiom2(mouse.pressed, mouse.position);
		let points = [
			RabbitEar.math.Vector(mouse.pressed),
			RabbitEar.math.Vector(mouse.position)
		];
		let midpoint = points[0].midpoint(points[1]);
		let vector = points[1].subtract(points[0]);
		origami.cp.faces_layer = [0];
		// origami.cp.creaseThroughLayers(midpoint, vector.rotateZ90());
		origami.cp.valleyFold(midpoint, vector.rotateZ90(), vector.rotateZ180());
	}
	folded.cp = RabbitEar.CreasePattern(origami.cp.json);
	folded.fold();
}