let polyFold = RabbitEar.svg.image("canvas-fold-poly", 500, 500);

polyFold.STROKE_WIDTH = polyFold.w * 0.0125;
polyFold.RADIUS = polyFold.w * 0.025;

polyFold.reset = function(){
	polyFold.removeChildren();
	polyFold.paperLayer = RabbitEar.svg.group();
	polyFold.topLayer = RabbitEar.svg.group();
	polyFold.appendChild(polyFold.paperLayer);
	polyFold.appendChild(polyFold.topLayer);

	// make touch points
	polyFold.touches = Array.from(Array(2)).map(_ => ({
		pos: [Math.random()*polyFold.w, Math.random()*polyFold.h],
		svg: RabbitEar.svg.circle(0, 0, polyFold.RADIUS)
	}));
	polyFold.touches[0].pos = [polyFold.w*0.5, polyFold.h*0.5];
	polyFold.touches.forEach(p => {
		p.svg.setAttribute("fill", "#e44f2a");
		polyFold.topLayer.appendChild(p.svg);
	});

	// build paper
	let hullPoints = Array.from(Array(24)).map(_ => {
		let a = Math.random() * Math.PI*2;
		let r = Math.random() * polyFold.h*0.5;
		return [polyFold.w*0.5 + r*Math.cos(a), polyFold.h*0.5 + r*Math.sin(a)];
	});
	polyFold.hull = RabbitEar.math.ConvexPolygon.convexHull(hullPoints);
}

polyFold.redraw = function(){
	polyFold.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	let vec = [polyFold.touches[1].pos[0] - polyFold.touches[0].pos[0],
	           polyFold.touches[1].pos[1] - polyFold.touches[0].pos[1]];

	RabbitEar.svg.removeChildren(polyFold.paperLayer);
	let polys = polyFold.hull.split(polyFold.touches[0].pos, vec);

	let colors = ["#195783", "#ecb233"];

	if (polys != null){
		polys.sort((a,b) => b.area - a.area);
		if (polys.length > 1) {
			let matrix = RabbitEar.math.Matrix2.makeReflection(vec, polyFold.touches[0].pos);
			let reflectedPoints = polys[1].points
				.map(p => matrix.transform(p))
				.map(p => [p[0], p[1]]);
			polys[1] = RabbitEar.math.ConvexPolygon(reflectedPoints);
		}
		polys.forEach((p,i)=> {
			let poly = RabbitEar.svg.polygon(p.points);
			poly.setAttribute("fill", colors[i%2]);
			poly.setAttribute("stroke", "black");
			poly.setAttribute("stroke-width", polyFold.STROKE_WIDTH);
			poly.setAttribute("stroke-linecap", "round");
			polyFold.paperLayer.appendChild(poly);
		});
	}
}

polyFold.onMouseDown = function(mouse){
	let ep = polyFold.w / 50;
	let down = polyFold.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	polyFold.selected = found;
};

polyFold.onMouseMove = function(mouse){
	if(mouse.isPressed && polyFold.selected != null){
		polyFold.touches[polyFold.selected].pos = mouse.position;
		polyFold.redraw();
	}
};


polyFold.reset();
polyFold.redraw();
