let foldPoly = RabbitEar.svg.Image("canvas-fold-poly", 500, 500);
// foldPoly.svg.setAttribute("style", "height:90vmin; width:90vmin;");

foldPoly.STROKE_WIDTH = foldPoly.width * 0.0125;
foldPoly.RADIUS = foldPoly.width * 0.025;

foldPoly.lineLayer = RabbitEar.svg.group();
foldPoly.topLayer = RabbitEar.svg.group();
foldPoly.appendChild(foldPoly.lineLayer);
foldPoly.appendChild(foldPoly.topLayer);

foldPoly.touches = Array.from(Array(2)).map(_ => ({
	pos: [Math.random()*foldPoly.width, Math.random()*foldPoly.height],
	svg: RabbitEar.svg.circle(0, 0, foldPoly.RADIUS)
}));
foldPoly.touches[0].pos = [foldPoly.width*0.5, foldPoly.height*0.5];

foldPoly.polygon = RabbitEar.svg.polygon();
foldPoly.polygon.setAttribute("stroke", "black");
foldPoly.polygon.setAttribute("stroke-width", foldPoly.STROKE_WIDTH);
foldPoly.polygon.setAttribute("stroke-linecap", "round");
foldPoly.polygon.setAttribute("fill", "none");
// foldPoly.topLayer.appendChild(foldPoly.polygon);

foldPoly.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	foldPoly.topLayer.appendChild(p.svg);
});

foldPoly.rebuildHull = function(){
	let hullPoints = Array.from(Array(24)).map(_ => {
		let a = Math.random() * Math.PI*2;
		let r = Math.random() * foldPoly.height*0.5;
		return [foldPoly.width*0.5 + r*Math.cos(a), foldPoly.height*0.5 + r*Math.sin(a)];
	});
	foldPoly.hull = RabbitEar.math.ConvexPolygon.convexHull(hullPoints);
	let pointsString = foldPoly.hull.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	foldPoly.polygon.setAttribute("points", pointsString);
}
foldPoly.rebuildHull();


foldPoly.redraw = function(){
	foldPoly.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	let vec = [foldPoly.touches[1].pos[0] - foldPoly.touches[0].pos[0], foldPoly.touches[1].pos[1] - foldPoly.touches[0].pos[1]];

	RabbitEar.svg.removeChildren(foldPoly.lineLayer);
	let polys = foldPoly.hull.split(foldPoly.touches[0].pos, vec);

	let colors = ["#195783", "#ecb233"];
	// if(polys != null){
	// 	polys.forEach((p,i)=> {
	// 		let poly = RabbitEar.svg.polygon(p);
	// 		poly.setAttribute("fill", colors[i%2]);
	// 		foldPoly.lineLayer.appendChild(poly);
	// 	});
	// }
	if (polys != null){
		polys.sort((a,b) => b.signedArea() - a.signedArea());
		if (polys.length > 1) {
			let matrix = RabbitEar.math.Matrix.makeReflection(vec, foldPoly.touches[0].pos);
			let reflectedPoints = polys[1].points
				.map(p => matrix.transform(p))
				.map(p => [p[0], p[1]]);
			polys[1] = RabbitEar.math.ConvexPolygon(reflectedPoints);
		}
		polys.forEach((p,i)=> {
			let poly = RabbitEar.svg.polygon(p.points);
			poly.setAttribute("fill", colors[i%2]);
			poly.setAttribute("stroke", "black");
			poly.setAttribute("stroke-width", foldPoly.STROKE_WIDTH);
			poly.setAttribute("stroke-linecap", "round");
			foldPoly.lineLayer.appendChild(poly);
		});
	}
}
foldPoly.redraw();

foldPoly.onMouseDown = function(mouse){
	let ep = foldPoly.width / 50;
	let down = foldPoly.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	foldPoly.selected = found;
}

foldPoly.onMouseMove = function(mouse){
	if(mouse.isPressed && foldPoly.selected != null){
		foldPoly.touches[foldPoly.selected].pos = mouse.position;
		foldPoly.redraw();
	}
}
