let polySplit = RabbitEar.svg.Image("canvas-split-poly", 500, 500);

polySplit.STROKE_WIDTH = polySplit.width * 0.0125;
polySplit.RADIUS = polySplit.width * 0.025;

polySplit.lineLayer = RabbitEar.svg.group();
polySplit.topLayer = RabbitEar.svg.group();
polySplit.appendChild(polySplit.lineLayer);
polySplit.appendChild(polySplit.topLayer);

polySplit.touches = Array.from(Array(2)).map(_ => ({
	pos: [Math.random()*polySplit.width, Math.random()*polySplit.height],
	svg: RabbitEar.svg.circle(0, 0, polySplit.RADIUS)
}));
polySplit.touches[0].pos = [polySplit.width*0.5, polySplit.height*0.5];

// polySplit.polygon = RabbitEar.svg.polygon();
// polySplit.polygon.setAttribute("stroke", "black");
// polySplit.polygon.setAttribute("stroke-width", polySplit.STROKE_WIDTH);
// polySplit.polygon.setAttribute("fill", "none");
// polySplit.polygon.setAttribute("stroke-linecap", "round");
// polySplit.topLayer.appendChild(polySplit.polygon);

polySplit.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	polySplit.topLayer.appendChild(p.svg);
});

polySplit.rebuildHull = function(){
	let hullPoints = Array.from(Array(24)).map(_ => {
		let a = Math.random() * Math.PI*2;
		let r = Math.random() * polySplit.height*0.5;
		return [polySplit.width*0.5 + r*Math.cos(a), polySplit.height*0.5 + r*Math.sin(a)];
	});
	polySplit.hull = RabbitEar.math.ConvexPolygon.convexHull(hullPoints);
	let pointsString = polySplit.hull.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	// polySplit.polygon.setAttribute("points", pointsString);
}
polySplit.rebuildHull();

polySplit.redraw = function(){
	polySplit.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	let vec = [polySplit.touches[1].pos[0] - polySplit.touches[0].pos[0], 
	           polySplit.touches[1].pos[1] - polySplit.touches[0].pos[1]];

	RabbitEar.svg.removeChildren(polySplit.lineLayer);
	let polys = polySplit.hull.split(polySplit.touches[0].pos, vec);
	let colors = ["#ecb233", "#195783"];
	if(polys != null){
		polys.sort((a,b) => b.area - a.area).forEach((p,i)=> {
			let poly = RabbitEar.svg.polygon(p.scale(0.8).points);
			poly.setAttribute("fill", colors[i%2]);
			poly.setAttribute("stroke", "black");
			poly.setAttribute("stroke-width", polySplit.STROKE_WIDTH);
			poly.setAttribute("stroke-linecap", "round");
			polySplit.lineLayer.appendChild(poly);
		});
	}
}
polySplit.redraw();

polySplit.onMouseDown = function(mouse){
	let ep = polySplit.width / 50;
	let down = polySplit.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	polySplit.selected = found;
}

polySplit.onMouseMove = function(mouse){
	if(mouse.isPressed && polySplit.selected != null){
		polySplit.touches[polySplit.selected].pos = mouse.position;
		polySplit.redraw();
	}
}
