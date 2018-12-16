let clipPoly2 = RabbitEar.svg.View("canvas-clip-poly", 500, 500);

clipPoly2.STROKE_WIDTH = clipPoly2.width * 0.0125;
clipPoly2.RADIUS = clipPoly2.width * 0.025;

clipPoly2.lineLayer = RabbitEar.svg.group();
clipPoly2.topLayer = RabbitEar.svg.group();
clipPoly2.appendChild(clipPoly2.lineLayer);
clipPoly2.appendChild(clipPoly2.topLayer);

clipPoly2.touches = Array.from(Array(2)).map(_ => ({
	pos: [Math.random()*clipPoly2.width, Math.random()*clipPoly2.height],
	svg: RabbitEar.svg.circle(0, 0, clipPoly2.RADIUS)
}));
clipPoly2.touches[0].pos = [clipPoly2.width*1.0, clipPoly2.height*1.0];
clipPoly2.touches[1].pos = [clipPoly2.width*0.0, clipPoly2.height*0.0];

clipPoly2.polygon = RabbitEar.svg.polygon();
clipPoly2.polygon.setAttribute("stroke", "black");
clipPoly2.polygon.setAttribute("stroke-width", clipPoly2.STROKE_WIDTH);
clipPoly2.polygon.setAttribute("fill", "none");
clipPoly2.polygon.setAttribute("stroke-linecap", "round");
clipPoly2.topLayer.appendChild(clipPoly2.polygon);

clipPoly2.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	clipPoly2.topLayer.appendChild(p.svg);
});

clipPoly2.rebuildHull = function(){
	let hullPoints = [ [0,0], [0,500], [500,500], [500,0] ];
	clipPoly2.hull = RabbitEar.math.Polygon.convexHull(hullPoints);
	let pointsString = clipPoly2.hull.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	clipPoly2.polygon.setAttribute("points", pointsString);
}
clipPoly2.rebuildHull();

clipPoly2.redraw = function(){
	clipPoly2.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	let vec = [clipPoly2.touches[1].pos[0] - clipPoly2.touches[0].pos[0], clipPoly2.touches[1].pos[1] - clipPoly2.touches[0].pos[1]];

	RabbitEar.svg.removeChildren(clipPoly2.lineLayer);
	let polys = RabbitEar.math.core.split_convex_polygon(clipPoly2.hull.points, clipPoly2.touches[0].pos, vec);
	let colors = ["#195783", "#ecb233"];
	if(polys != null){
		polys.forEach((p,i)=> {
			let poly = RabbitEar.svg.polygon(p);
			poly.setAttribute("fill", colors[i%2]);
			clipPoly2.lineLayer.appendChild(poly);
		});
	}
}
clipPoly2.redraw();

clipPoly2.onMouseDown = function(mouse){
	let ep = clipPoly2.width / 50;
	let down = clipPoly2.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	clipPoly2.selected = found;
}

clipPoly2.onMouseMove = function(mouse){
	if(mouse.isPressed && clipPoly2.selected != null){
		clipPoly2.touches[clipPoly2.selected].pos = mouse.position;
		clipPoly2.redraw();
	}
}
