let clipPoly = RabbitEar.svg.View("canvas-clip-poly", 500, 500);

clipPoly.STROKE_WIDTH = clipPoly.width * 0.0125;
clipPoly.RADIUS = clipPoly.width * 0.025;

clipPoly.lineLayer = RabbitEar.svg.group();
clipPoly.topLayer = RabbitEar.svg.group();
clipPoly.appendChild(clipPoly.lineLayer);
clipPoly.appendChild(clipPoly.topLayer);

clipPoly.touches = Array.from(Array(2)).map(_ => ({
	pos: [Math.random()*clipPoly.width, Math.random()*clipPoly.height],
	svg: RabbitEar.svg.circle(0, 0, clipPoly.RADIUS)
}));
clipPoly.touches[0].pos = [clipPoly.width*0.5, clipPoly.height*0.5];

clipPoly.polygon = RabbitEar.svg.polygon();
clipPoly.polygon.setAttribute("stroke", "black");
clipPoly.polygon.setAttribute("stroke-width", clipPoly.STROKE_WIDTH);
clipPoly.polygon.setAttribute("fill", "none");
clipPoly.polygon.setAttribute("stroke-linecap", "round");
clipPoly.topLayer.appendChild(clipPoly.polygon);

clipPoly.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	clipPoly.topLayer.appendChild(p.svg);
});

clipPoly.rebuildHull = function(){
	let hullPoints = Array.from(Array(24)).map(_ => {
		let a = Math.random() * Math.PI*2;
		let r = Math.random() * clipPoly.height*0.5;
		return [clipPoly.width*0.5 + r*Math.cos(a), clipPoly.height*0.5 + r*Math.sin(a)];
	});
	clipPoly.hull = RabbitEar.math.Polygon.convexHull(hullPoints);
	let pointsString = clipPoly.hull.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	clipPoly.polygon.setAttribute("points", pointsString);
}
clipPoly.rebuildHull();

clipPoly.redraw = function(){
	clipPoly.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	let vec = [clipPoly.touches[1].pos[0] - clipPoly.touches[0].pos[0], clipPoly.touches[1].pos[1] - clipPoly.touches[0].pos[1]];

	RabbitEar.svg.removeChildren(clipPoly.lineLayer);
	let polys = clipPoly.hull.split(clipPoly.touches[0].pos, vec);
	let colors = ["#195783", "#ecb233"];
	if(polys != null){
		polys.sort((a,b) => b.signedArea() - a.signedArea()).forEach((p,i)=> {
			let poly = RabbitEar.svg.polygon(p.points);
			poly.setAttribute("fill", colors[i%2]);
			clipPoly.lineLayer.appendChild(poly);
		});
	}
}
clipPoly.redraw();

clipPoly.onMouseDown = function(mouse){
	let ep = clipPoly.width / 50;
	let down = clipPoly.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	clipPoly.selected = found;
}

clipPoly.onMouseMove = function(mouse){
	if(mouse.isPressed && clipPoly.selected != null){
		clipPoly.touches[clipPoly.selected].pos = mouse.position;
		clipPoly.redraw();
	}
}
