let view12 = RabbitEar.svg.View("canvas-polygon-contains", 500, 500);

view12.STROKE_WIDTH = view12.width * 0.01;
view12.RADIUS = view12.width * 0.02;

view12.polygon = RabbitEar.svg.polygon();
view12.polygon.setAttribute("fill", "#ecb233");
view12.polygon.setAttribute("stroke", "none");
view12.appendChild(view12.polygon);

view12.dotLayer = RabbitEar.svg.group();
view12.appendChild(view12.dotLayer);

view12.touches = Array.from(Array(6)).map(_ => ({
	pos: [Math.random()*view12.width, Math.random()*view12.height],
	svg: RabbitEar.svg.circle(0, 0, view12.RADIUS)
}));

view12.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	view12.appendChild(p.svg);
});

view12.rebuildHull = function(){
	let dots = Array.from(Array(12)).map(_ => {
		let r = view12.height*0.45;
		let a = Math.random()*Math.PI*2;
		return [view12.width*0.5 + Math.cos(a) * r, view12.height*0.5 + Math.sin(a) * r];
	});
	view12.hull = RabbitEar.math.Polygon.convexHull(dots);
	let pointsString = view12.hull.points
		.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	view12.polygon.setAttribute("points", pointsString);
}
view12.rebuildHull();

view12.redraw = function(){
	view12.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
		let fillColor = view12.hull.contains(p.pos) ? "#e44f2a" : "black";
		p.svg.setAttribute("fill", fillColor);
	});
}
view12.redraw();

view12.onMouseDown = function(mouse){
	let ep = view12.width / 25;
	let down = view12.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	view12.selected = found;
}

view12.onMouseMove = function(mouse){
	if(mouse.isPressed && view12.selected != null){
		view12.touches[view12.selected].pos = mouse.position;
		view12.redraw();
	}
}
