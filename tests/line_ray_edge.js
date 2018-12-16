let lre = RabbitEar.svg.View("canvas-line-ray-edge", 500, 500);

lre.lineLayer = RabbitEar.svg.group();
lre.appendChild(lre.lineLayer);

lre.touches = Array.from(Array(6)).map(_ => (
	{pos: [Math.random()*lre.width, Math.random()*lre.height], svg: RabbitEar.svg.circle(0, 0, 8)}
));

lre.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	lre.appendChild(p.svg);
});

lre.lines = [
	RabbitEar.svg.line(0,0,0,0),
	RabbitEar.svg.line(0,0,0,0),
	RabbitEar.svg.line(0,0,0,0),
];
lre.lines.forEach(l => {
	l.setAttribute("stroke", "#e44f2a");
	l.setAttribute("stroke-width", 3);
	l.setAttribute("stroke-dasharray", "6 6");
	l.setAttribute("stroke-linecap", "round");
	lre.appendChild(l);
});

lre.redraw = function(){
	lre.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
		lre.lines[parseInt(i/2)].setAttribute("x"+(i%2+1), p.pos[0]);
		lre.lines[parseInt(i/2)].setAttribute("y"+(i%2+1), p.pos[1]);
	});
}
lre.redraw();

lre.onMouseDown = function(mouse){
	let ep = lre.width / 50;
	let down = lre.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	lre.selected = found;
}

lre.onMouseMove = function(mouse){
	if(mouse.isPressed && lre.selected != null){
		lre.touches[lre.selected].pos = mouse.position;
		lre.redraw();
	}
}
