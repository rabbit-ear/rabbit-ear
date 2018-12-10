let view13 = RabbitEar.svg.View("canvas-clip-poly", 500, 500);

view13.STROKE_WIDTH = view13.width * 0.0125;
view13.RADIUS = view13.width * 0.025;

view13.lineLayer = RabbitEar.svg.group();
view13.topLayer = RabbitEar.svg.group();
view13.appendChild(view13.lineLayer);
view13.appendChild(view13.topLayer);

view13.touches = Array.from(Array(2)).map(_ => ({
	pos: [Math.random()*view13.width, Math.random()*view13.height],
	svg: RabbitEar.svg.circle(0, 0, view13.RADIUS)
}));
view13.touches[0].pos = [view13.width*0.5, view13.height*0.5];

view13.polygon = RabbitEar.svg.polygon();
view13.polygon.setAttribute("stroke", "black");
view13.polygon.setAttribute("stroke-width", view13.STROKE_WIDTH);
view13.polygon.setAttribute("fill", "none");
view13.polygon.setAttribute("stroke-linecap", "round");
view13.topLayer.appendChild(view13.polygon);

view13.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	view13.topLayer.appendChild(p.svg);
});

view13.rebuildHull = function(){
	let hullPoints = Array.from(Array(24)).map(_ => {
		let a = Math.random() * Math.PI*2;
		let r = Math.random() * view13.height*0.5;
		return [view13.width*0.5 + r*Math.cos(a), view13.height*0.5 + r*Math.sin(a)];
	});
	view13.hull = RabbitEar.math.Polygon.convexHull(hullPoints);
	let pointsString = view13.hull.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	view13.polygon.setAttribute("points", pointsString);
}
view13.rebuildHull();

view13.redraw = function(){
	view13.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	let vec = [view13.touches[1].pos[0] - view13.touches[0].pos[0], view13.touches[1].pos[1] - view13.touches[0].pos[1]];

	RabbitEar.svg.removeChildren(view13.lineLayer);
	let polys = RabbitEar.math.core.split_convex_polygon(view13.hull.points, view13.touches[0].pos, vec);
	let colors = ["#195783", "#ecb233"];
	if(polys != null){
		polys.forEach((p,i)=> {
			let poly = RabbitEar.svg.polygon(p);
			poly.setAttribute("fill", colors[i%2]);
			view13.lineLayer.appendChild(poly);
		});
	}
}
view13.redraw();

view13.onMouseDown = function(mouse){
	let ep = view13.width / 50;
	let down = view13.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	view13.selected = found;
}

view13.onMouseMove = function(mouse){
	if(mouse.isPressed && view13.selected != null){
		view13.touches[view13.selected].pos = mouse.position;
		view13.redraw();
	}
}
