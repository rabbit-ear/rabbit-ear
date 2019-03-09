let hull = RabbitEar.svg.Image("canvas-convex-hull", 500, 500);

hull.STROKE_WIDTH = hull.width * 0.01;
hull.RADIUS = hull.width * 0.02;

hull.polygon = RabbitEar.svg.polygon();
hull.polygon.setAttribute("stroke", "#ecb233");
hull.polygon.setAttribute("stroke-width", hull.STROKE_WIDTH);
hull.polygon.setAttribute("fill", "none");
hull.polygon.setAttribute("stroke-linecap", "round");
hull.appendChild(hull.polygon);

hull.dotLayer = RabbitEar.svg.group();
hull.appendChild(hull.dotLayer);

hull.touches = Array.from(Array(12)).map(_ => ({
	pos: [Math.random()*hull.width, Math.random()*hull.height],
	svg: RabbitEar.svg.circle(0, 0, hull.RADIUS)
}));

hull.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	hull.appendChild(p.svg);
});

hull.rebuildHull = function(){
	let convexHull = RabbitEar.math.core.geometry.convex_hull(hull.touches.map(t => t.pos));
	let pointsString = convexHull.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	hull.polygon.setAttribute("points", pointsString);
}

hull.redraw = function(){
	hull.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	hull.rebuildHull();
}
hull.redraw();

hull.addEventListener("mousedown", function(mouse){
	let ep = hull.width / 50;
	let down = hull.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	hull.selected = found;
});

hull.addEventListener("mousemove", function(mouse){
	if(mouse.isPressed && hull.selected != null){
		hull.touches[hull.selected].pos = mouse.position;
		hull.redraw();
	}
});
