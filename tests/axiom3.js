let axiom3 = RabbitEar.Origami("canvas-axiom-3");

axiom3.touches = [
	{pos: [0.1, 0.5], svg: RabbitEar.svg.circle(0, 0, 0.02)},
	{pos: [0.9, 0.5], svg: RabbitEar.svg.circle(0, 0, 0.02)},
	{pos: [0.2, 0.4], svg: RabbitEar.svg.circle(0, 0, 0.02)},
	{pos: [0.7, 0.8], svg: RabbitEar.svg.circle(0, 0, 0.02)},
];
axiom3.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	axiom3.svg.appendChild(p.svg);
});

axiom3.redraw = function(){
	axiom3.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	axiom3.cp = RabbitEar.CreasePattern(RabbitEar.bases.square);
	let pointA = axiom3.touches[0].pos;
	let vectorA = [axiom3.touches[1].pos[0] - axiom3.touches[0].pos[0], 
	               axiom3.touches[1].pos[1] - axiom3.touches[0].pos[1]];
	let pointB = axiom3.touches[2].pos;
	let vectorB = [axiom3.touches[3].pos[0] - axiom3.touches[2].pos[0], 
	               axiom3.touches[3].pos[1] - axiom3.touches[2].pos[1]];
	let creases = axiom3.cp.axiom3(pointA, vectorA, pointB, vectorB);
	console.log(creases);
	creases.forEach(c => c.valley());
	axiom3.draw();
}
axiom3.redraw();

axiom3.onMouseDown = function(mouse){
	let ep = 0.03;
	let down = axiom3.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	axiom3.selected = found;
}

axiom3.onMouseMove = function(mouse){
	if(mouse.isPressed && axiom3.selected != null){
		axiom3.touches[axiom3.selected].pos = mouse.position;
		axiom3.redraw();
	}
}
