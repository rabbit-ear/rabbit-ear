let xing = RabbitEar.svg.image("canvas-intersection", 500, 500);

xing.NUM_LINES = 4;

xing.lines = Array.from(Array(xing.NUM_LINES))
	.map(_ => RabbitEar.svg.line(0,0,0,0));

xing.lines.forEach(l => {
	l.setAttribute("stroke", "#ecb233");
	l.setAttribute("stroke-width", 3);
	l.setAttribute("stroke-dasharray", "6 6");
	l.setAttribute("stroke-linecap", "round");
	xing.appendChild(l);
});

xing.touches = Array.from(Array(xing.NUM_LINES*2)).map(_ => (
	{pos: [Math.random()*xing.width, Math.random()*xing.height], svg: RabbitEar.svg.circle(0, 0, 8)}
));

xing.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	xing.appendChild(p.svg);
});

xing.intersectionLayer = RabbitEar.svg.group();
xing.appendChild(xing.intersectionLayer);

xing.redraw = function(){
	xing.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
		xing.lines[parseInt(i/2)].setAttribute("x"+(i%2+1), p.pos[0]);
		xing.lines[parseInt(i/2)].setAttribute("y"+(i%2+1), p.pos[1]);
	});
	RabbitEar.svg.removeChildren(xing.intersectionLayer);
	var intersections = [];
	for(var i = 0; i < xing.NUM_LINES-1; i++){
		for(var j = i+1; j < xing.NUM_LINES; j++){
			let inter = RabbitEar.math.core.intersection.edge_edge(
				xing.touches[i*2].pos, xing.touches[i*2+1].pos,
				xing.touches[j*2].pos, xing.touches[j*2+1].pos
			);
			if(inter != null){ intersections.push(inter); }
		}
	}
	intersections.forEach(p => {
		let r1 = 3.5;
		let r2 = 13;
		for(var i = 0; i < 6; i++){
			var a = Math.PI*2/6 * i;
			let aster = RabbitEar.svg.line(
				p[0]+r1*Math.cos(a), p[1]+r1*Math.sin(a),
				p[0]+r2*Math.cos(a), p[1]+r2*Math.sin(a)
			);
			aster.setAttribute("stroke", "#195783");
			aster.setAttribute("stroke-width", 4);
			xing.intersectionLayer.appendChild(aster);
		}
		// let circle = RabbitEar.svg.circle(p[0], p[1], 8);
		// circle.setAttribute("fill", "#195783");
		// xing.intersectionLayer.appendChild(circle);
	});
}
xing.redraw();

xing.addEventListener("mousedown", function(mouse){
	let ep = xing.width / 50;
	let down = xing.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	xing.selected = found;
});

xing.addEventListener("mousemove", function(mouse){
	if(mouse.isPressed && xing.selected != null){
		xing.touches[xing.selected].pos = mouse.position;
		xing.redraw();
	}
});
