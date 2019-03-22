let axiom3 = RabbitEar.Origami("canvas-axiom-3");

axiom3.setup = function() {
	axiom3.lineLayer = RabbitEar.svg.group();
	axiom3.appendChild(axiom3.lineLayer);
	// create 4 UI-control points
	axiom3.controls = RabbitEar.svg
		.controls(axiom3, 4, { radius: 0.02, fill: "#e44f2a" });
	axiom3.controls.forEach(c => c.position = [Math.random(), Math.random()]);
}
axiom3.setup();

// called once at the beginning. build a square with random crease marks
axiom3.reset = function() {
	axiom3.cp = RabbitEar.CreasePattern(RabbitEar.bases.square);
	for (let i = 0; i < 5; i++) {
		axiom3.axiom2([Math.random(), Math.random()], [Math.random()-0.5, Math.random()-0.5]);
	}
	axiom3.base = axiom3.cp.json;
}
axiom3.reset();

// called after the control-points change
axiom3.redraw = function() {
	RabbitEar.svg.removeChildren(axiom3.lineLayer);
	let lines = Array.from(Array(axiom3.controls.length/2))
		.map((c,i) => [
			axiom3.controls[(i*2)].position,
			axiom3.controls[(i*2)+1].position
		]).map(p => RabbitEar.math.Line.fromPoints(p[0], p[1]));
	let boundary = RabbitEar.math.ConvexPolygon([[0,0], [1,0], [1,1], [0,1]]);
	let edges = lines.map(l => boundary.clipLine(l));
	edges.map(e => RabbitEar.svg.line(e[0][0], e[0][1], e[1][0], e[1][1]))
		.forEach(l => {
			l.setAttribute("stroke", "#f1c14f");
			l.setAttribute("stroke-width", 0.01);
			axiom3.lineLayer.appendChild(l);
		});

	axiom3.cp = RabbitEar.CreasePattern(axiom3.base);
	axiom3.axiom3(lines[0], lines[1]).valley();
	axiom3.draw();
}
axiom3.redraw();

axiom3.onMouseMove = function(mouse) {
	if(mouse.isPressed) {
		axiom3.redraw();
	}
}
