let axiom1 = RabbitEar.Origami("canvas-axiom-1");

axiom1.touches = [
	// {pos: [0.1, 0.5], svg: RabbitEar.svg.circle(0, 0, 0.02)},
	{pos: [0.0, 0.0], svg: RabbitEar.svg.circle(0, 0, 0.02)},
	{pos: [0.2, 0.8], svg: RabbitEar.svg.circle(0, 0, 0.02)},
];
axiom1.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	axiom1.svg.appendChild(p.svg);
});

axiom1.redraw = function(){
	axiom1.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	axiom1.cp = RabbitEar.CreasePattern(RabbitEar.bases.dodecagon);
	let creases = axiom1.cp.axiom1(axiom1.touches[0].pos, axiom1.touches[1].pos);
	creases.forEach(c => c.valley());
	axiom1.draw();
}
axiom1.redraw();

axiom1.onMouseDown = function(mouse){
	let ep = 0.03;
	let down = axiom1.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	axiom1.selected = found;
}

axiom1.onMouseMove = function(mouse){
	if(mouse.isPressed && axiom1.selected != null){
		axiom1.touches[axiom1.selected].pos = mouse.position;
		axiom1.redraw();
	}
}
