let view9 = RabbitEar.svg.View("canvas-clipping", 500, 500);

view9.polygon = RabbitEar.svg.polygon();
view9.polygon.setAttribute("stroke", "black");
view9.polygon.setAttribute("stroke-width", 3);
view9.polygon.setAttribute("fill", "none");
view9.polygon.setAttribute("stroke-linecap", "round");
view9.appendChild(view9.polygon);

view9.lineLayer = RabbitEar.svg.group();
view9.appendChild(view9.lineLayer);

view9.touches = Array.from(Array(2)).map(_ => ({
	pos: [Math.random()*view9.width, Math.random()*view9.height],
	svg: RabbitEar.svg.circle(0, 0, 8)
}));
view9.touches[0].pos = [view9.width*0.5, view9.height*0.5];

view9.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	view9.appendChild(p.svg);
});

view9.rebuildHull = function(){
	let hullPoints = Array.from(Array(24)).map(_ => {
		let a = Math.random() * Math.PI*2;
		let r = Math.random() * view9.height*0.5;
		return [view9.width*0.5 + r*Math.cos(a), view9.height*0.5 + r*Math.sin(a)];
	});
	view9.hull = RabbitEar.math.Polygon.convexHull(hullPoints);
	let pointsString = view9.hull.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	view9.polygon.setAttribute("points", pointsString);
}
view9.rebuildHull();

view9.redraw = function(){
	view9.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	let vec = [view9.touches[1].pos[0] - view9.touches[0].pos[0], view9.touches[1].pos[1] - view9.touches[0].pos[1]];
	let edge = view9.hull.clipLine(view9.touches[0].pos, vec);
	RabbitEar.svg.removeChildren(view9.lineLayer);
	if(edge != null){
		let l = RabbitEar.svg.line(edge[0][0], edge[0][1], edge[1][0], edge[1][1]);
		l.setAttribute("stroke", "#ecb233");
		l.setAttribute("stroke-width", 3);
		l.setAttribute("stroke-linecap", "round");
		view9.lineLayer.appendChild(l);
	}
}
view9.redraw();

view9.onMouseDown = function(mouse){
	let ep = view9.width / 50;
	let down = view9.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	view9.selected = found;
}

view9.onMouseMove = function(mouse){
	if(mouse.isPressed && view9.selected != null){
		view9.touches[view9.selected].pos = mouse.position;
		view9.redraw();
	}
}
