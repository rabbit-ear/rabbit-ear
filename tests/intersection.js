let view10 = RabbitEar.svg.View("canvas-intersection", 500, 500);

view10.NUM_LINES = 7;

view10.lines = Array.from(Array(view10.NUM_LINES))
	.map(_ => RabbitEar.svg.line(0,0,0,0));

view10.lines.forEach(l => {
	l.setAttribute("stroke", "#ecb233");
	l.setAttribute("stroke-width", 3);
	l.setAttribute("stroke-dasharray", "6 6");
	l.setAttribute("stroke-linecap", "round");
	view10.appendChild(l);
});

view10.touches = Array.from(Array(view10.NUM_LINES*2)).map(_ => (
	{pos: [Math.random()*view10.width, Math.random()*view10.height], svg: RabbitEar.svg.circle(0, 0, 8)}
));

view10.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	view10.appendChild(p.svg);
});

view10.intersectionLayer = RabbitEar.svg.group();
view10.appendChild(view10.intersectionLayer);

view10.redraw = function(){
	view10.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
		view10.lines[parseInt(i/2)].setAttribute("x"+(i%2+1), p.pos[0]);
		view10.lines[parseInt(i/2)].setAttribute("y"+(i%2+1), p.pos[1]);
	});
	RabbitEar.svg.removeChildren(view10.intersectionLayer);
	var intersections = [];
	for(var i = 0; i < view10.NUM_LINES-1; i++){
		for(var j = i+1; j < view10.NUM_LINES; j++){
			let inter = RabbitEar.math.intersection.edge_edge(
				view10.touches[i*2].pos, view10.touches[i*2+1].pos,
				view10.touches[j*2].pos, view10.touches[j*2+1].pos
			);
			if(inter != null){ intersections.push(inter); }
		}
	}
	intersections.forEach(p => {
		let circle = RabbitEar.svg.circle(p[0], p[1], 8);
		circle.setAttribute("fill", "#195783");
		view10.intersectionLayer.appendChild(circle);
	});
}
view10.redraw();

view10.onMouseDown = function(mouse){
	let ep = view10.width / 50;
	let down = view10.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	view10.selected = found;
}

view10.onMouseMove = function(mouse){
	if(mouse.isPressed && view10.selected != null){
		view10.touches[view10.selected].pos = mouse.position;
		view10.redraw();
	}
}
