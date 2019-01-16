let axiom2 = RabbitEar.Origami("canvas-axiom-2");

axiom2.touches = [
	{pos: [0.1, 0.5], svg: RabbitEar.svg.circle(0, 0, 0.02)},
	{pos: [0.9, 0.5], svg: RabbitEar.svg.circle(0, 0, 0.02)},
];
axiom2.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	axiom2.svg.appendChild(p.svg);
});

axiom2.redraw = function(){
	axiom2.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	axiom2.cp = RabbitEar.CreasePattern(RabbitEar.bases.square);
	let creases = axiom2.cp.axiom2(axiom2.touches[0].pos, axiom2.touches[1].pos);
	creases.forEach(c => c.valley());
	axiom2.draw();
}
axiom2.redraw();

axiom2.onMouseDown = function(mouse){
	let ep = 0.03;
	let down = axiom2.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	axiom2.selected = found;
}

axiom2.onMouseMove = function(mouse){
	if(mouse.isPressed && axiom2.selected != null){
		axiom2.touches[axiom2.selected].pos = mouse.position;
		axiom2.redraw();
	}
}
