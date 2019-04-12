let axiom2 = RabbitEar.Origami("canvas-axiom-2");

// create 2 UI-control points
axiom2.touches = [
	{pos: [0.0, 0.5], svg: axiom2.circle(0, 0, 0.02)},
	{pos: [1.0, 0.5], svg: axiom2.circle(0, 0, 0.02)},
];
axiom2.touches.forEach(p => p.svg.setAttribute("fill", "#e44f2a"));

// called once at the beginning. build a square with random crease marks
axiom2.reset = function() {
	axiom2.cp = RabbitEar.CreasePattern(RabbitEar.bases.square);
	for (let i = 0; i < 5; i++) {
		axiom2.axiom2([Math.random(), Math.random()], [Math.random()-0.5, Math.random()-0.5]);
	}
	axiom2.base = axiom2.cp.getFOLD();
}
axiom2.reset();

// called after the control-points change
axiom2.redraw = function() {
	axiom2.touches.forEach((p,i) => ["cx","cy"].forEach((c,ci) => p.svg.setAttribute(c, p.pos[ci])));
	axiom2.cp = RabbitEar.CreasePattern(axiom2.base);
	axiom2.axiom2(axiom2.touches[0].pos, axiom2.touches[1].pos).valley();
	axiom2.draw();
}
axiom2.redraw();

axiom2.onMouseDown = function(mouse){
	let ep = 0.03;
	let down = axiom2.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	axiom2.selected = found;
};

axiom2.onMouseMove = function(mouse){
	if(mouse.isPressed && axiom2.selected != null){
		axiom2.touches[axiom2.selected].pos = mouse.position;
		axiom2.redraw();
	}
};
