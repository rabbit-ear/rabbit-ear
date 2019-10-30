let view = RabbitEar.svg("canvas", 500, 500);

view.touches = [
	{pos: [0, 250], svg: RabbitEar.svg.circle(0, 0, 8)},
	{pos: [500, 250], svg: RabbitEar.svg.circle(0, 0, 8)},
];
view.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	view.appendChild(p.svg);
});

view.lines = [
	RabbitEar.svg.line(0,0,0,0),
];
view.lines.forEach(l => {
	l.setAttribute("stroke", "#e44f2a");
	l.setAttribute("stroke-width", 3);
	l.setAttribute("stroke-dasharray", "6 6");
	l.setAttribute("stroke-linecap", "round");
	view.appendChild(l);
});

view.redraw = function(){
	view.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
		view.lines[parseInt(i/2)].setAttribute("x"+(i%2+1), p.pos[0]);
		view.lines[parseInt(i/2)].setAttribute("y"+(i%2+1), p.pos[1]);
	});
}
view.redraw();

view.onMouseDown = function(mouse){
	let ep = view.width / 50;
	let down = view.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	view.selected = found;
}

view.onMouseMove = function(mouse){
	if(mouse.isPressed && view.selected != null){
		view.touches[view.selected].pos = mouse.position;
		view.redraw();
	}
}
