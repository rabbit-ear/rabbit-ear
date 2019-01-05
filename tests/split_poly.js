let splitPoly = RabbitEar.svg.Image("canvas-split-poly", 500, 500);

splitPoly.STROKE_WIDTH = splitPoly.width * 0.0125;
splitPoly.RADIUS = splitPoly.width * 0.025;

splitPoly.lineLayer = RabbitEar.svg.group();
splitPoly.topLayer = RabbitEar.svg.group();
splitPoly.appendChild(splitPoly.lineLayer);
splitPoly.appendChild(splitPoly.topLayer);

splitPoly.touches = Array.from(Array(2)).map(_ => ({
	pos: [Math.random()*splitPoly.width, Math.random()*splitPoly.height],
	svg: RabbitEar.svg.circle(0, 0, splitPoly.RADIUS)
}));
splitPoly.touches[0].pos = [splitPoly.width*0.5, splitPoly.height*0.5];

// splitPoly.polygon = RabbitEar.svg.polygon();
// splitPoly.polygon.setAttribute("stroke", "black");
// splitPoly.polygon.setAttribute("stroke-width", splitPoly.STROKE_WIDTH);
// splitPoly.polygon.setAttribute("fill", "none");
// splitPoly.polygon.setAttribute("stroke-linecap", "round");
// splitPoly.topLayer.appendChild(splitPoly.polygon);

splitPoly.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	splitPoly.topLayer.appendChild(p.svg);
});

splitPoly.rebuildHull = function(){
	let hullPoints = Array.from(Array(24)).map(_ => {
		let a = Math.random() * Math.PI*2;
		let r = Math.random() * splitPoly.height*0.5;
		return [splitPoly.width*0.5 + r*Math.cos(a), splitPoly.height*0.5 + r*Math.sin(a)];
	});
	splitPoly.hull = RabbitEar.math.ConvexPolygon.convexHull(hullPoints);
	let pointsString = splitPoly.hull.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	// splitPoly.polygon.setAttribute("points", pointsString);
}
splitPoly.rebuildHull();

splitPoly.redraw = function(){
	splitPoly.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	let vec = [splitPoly.touches[1].pos[0] - splitPoly.touches[0].pos[0], 
	           splitPoly.touches[1].pos[1] - splitPoly.touches[0].pos[1]];

	RabbitEar.svg.removeChildren(splitPoly.lineLayer);
	let polys = splitPoly.hull.split(splitPoly.touches[0].pos, vec);
	let colors = ["#ecb233", "#195783"];
	if(polys != null){
		polys.sort((a,b) => b.signedArea() - a.signedArea()).forEach((p,i)=> {
			let poly = RabbitEar.svg.polygon(p.scale(0.8).points);
			poly.setAttribute("fill", colors[i%2]);
			poly.setAttribute("stroke", "black");
			poly.setAttribute("stroke-width", splitPoly.STROKE_WIDTH);
			poly.setAttribute("stroke-linecap", "round");
			splitPoly.lineLayer.appendChild(poly);
		});
	}
}
splitPoly.redraw();

splitPoly.onMouseDown = function(mouse){
	let ep = splitPoly.width / 50;
	let down = splitPoly.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	splitPoly.selected = found;
}

splitPoly.onMouseMove = function(mouse){
	if(mouse.isPressed && splitPoly.selected != null){
		splitPoly.touches[splitPoly.selected].pos = mouse.position;
		splitPoly.redraw();
	}
}
