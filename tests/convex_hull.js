let view8 = RabbitEar.svg.View("canvas-convex-hull", 500, 500);

view8.STROKE_WIDTH = view8.width * 0.01;
view8.RADIUS = view8.width * 0.02;

view8.polygon = RabbitEar.svg.polygon();
view8.polygon.setAttribute("stroke", "#ecb233");
view8.polygon.setAttribute("stroke-width", view8.STROKE_WIDTH);
view8.polygon.setAttribute("fill", "none");
view8.polygon.setAttribute("stroke-linecap", "round");
view8.appendChild(view8.polygon);

view8.dotLayer = RabbitEar.svg.group();
view8.appendChild(view8.dotLayer);

view8.touches = Array.from(Array(12)).map(_ => ({
	pos: [Math.random()*view8.width, Math.random()*view8.height],
	svg: RabbitEar.svg.circle(0, 0, view8.RADIUS)
}));

view8.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	view8.appendChild(p.svg);
});

view8.rebuildHull = function(){
	let hull = RabbitEar.math.core.convex_hull(view8.touches.map(t => t.pos));
	let pointsString = hull.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	view8.polygon.setAttribute("points", pointsString);
}

view8.redraw = function(){
	view8.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	view8.rebuildHull();
}
view8.redraw();

view8.onMouseDown = function(mouse){
	let ep = view8.width / 50;
	let down = view8.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	view8.selected = found;
}

view8.onMouseMove = function(mouse){
	if(mouse.isPressed && view8.selected != null){
		view8.touches[view8.selected].pos = mouse.position;
		view8.redraw();
	}
}
