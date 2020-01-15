let axiom1 = RabbitEar.origami("canvas-axiom-1");

// create 2 UI-control points
axiom1.touches = [
	{pos: [0.0, 0.5], svg: axiom1.circle(0, 0, 0.02)},
	{pos: [1.0, 0.5], svg: axiom1.circle(0, 0, 0.02)},
];
axiom1.touches.forEach(p => p.svg.setAttribute("fill", "#e44f2a"));

// called once at the beginning. build a square with random crease marks
axiom1.reset = function() {
	axiom1.cp = RabbitEar.CreasePattern(RabbitEar.bases.square);
	for (let i = 0; i < 5; i++) {
		axiom1.axiom1([Math.random(), Math.random()], [Math.random()-0.5, Math.random()-0.5]);
	}
	axiom1.base = axiom1.cp.getFOLD();
}
axiom1.reset();

// called after the control-points change
axiom1.redraw = function() {
	axiom1.touches.forEach((p,i) => ["cx","cy"].forEach((c,ci) => p.svg.setAttribute(c, p.pos[ci])));
	axiom1.cp = RabbitEar.CreasePattern(axiom1.base);
	axiom1.axiom1(axiom1.touches[0].pos, axiom1.touches[1].pos).valley();
	axiom1.draw();
}
axiom1.redraw();

axiom1.onMouseDown = function(mouse) {
	let ep = 0.03;
	let down = axiom1.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	axiom1.selected = found;
};

axiom1.onMouseMove = function(mouse) {
	if(mouse.isPressed && axiom1.selected != null){
		axiom1.touches[axiom1.selected].pos = mouse.position;
		axiom1.redraw();
	}
};
