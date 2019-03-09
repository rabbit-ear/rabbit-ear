let clipLine = RabbitEar.svg.Image("canvas-clip-line", 500, 500);

clipLine.STROKE_WIDTH = clipLine.width * 0.0125;
clipLine.RADIUS = clipLine.width * 0.025;

clipLine.polygon = RabbitEar.svg.polygon();
clipLine.polygon.setAttribute("stroke", "black");
clipLine.polygon.setAttribute("stroke-width", clipLine.STROKE_WIDTH);
clipLine.polygon.setAttribute("fill", "none");
clipLine.polygon.setAttribute("stroke-linecap", "round");
clipLine.appendChild(clipLine.polygon);

clipLine.lineLayer = RabbitEar.svg.group();
clipLine.appendChild(clipLine.lineLayer);

clipLine.touches = Array.from(Array(2)).map(_ => ({
	pos: [Math.random()*clipLine.width, Math.random()*clipLine.height],
	svg: RabbitEar.svg.circle(0, 0, clipLine.RADIUS)
}));
clipLine.touches[0].pos = [clipLine.width*0.5, clipLine.height*0.5];

clipLine.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	clipLine.appendChild(p.svg);
});

clipLine.rebuildHull = function(){
	let hullPoints = Array.from(Array(24)).map(_ => {
		let a = Math.random() * Math.PI*2;
		let r = Math.random() * clipLine.height*0.5;
		return [clipLine.width*0.5 + r*Math.cos(a), clipLine.height*0.5 + r*Math.sin(a)];
	});
	clipLine.hull = RabbitEar.math.Polygon.convexHull(hullPoints);
	let pointsString = clipLine.hull.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	clipLine.polygon.setAttribute("points", pointsString);
}
clipLine.rebuildHull();

clipLine.redraw = function(){
	clipLine.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});
	let vec = [clipLine.touches[1].pos[0] - clipLine.touches[0].pos[0], clipLine.touches[1].pos[1] - clipLine.touches[0].pos[1]];
	let edge = clipLine.hull.clipLine(clipLine.touches[0].pos, vec);
	RabbitEar.svg.removeChildren(clipLine.lineLayer);
	if(edge != null){
		let l = RabbitEar.svg.line(edge[0][0], edge[0][1], edge[1][0], edge[1][1]);
		l.setAttribute("stroke", "#ecb233");
		l.setAttribute("stroke-width", clipLine.STROKE_WIDTH);
		l.setAttribute("stroke-linecap", "round");
		clipLine.lineLayer.appendChild(l);
		let endpoints = [
			RabbitEar.svg.circle(edge[0][0], edge[0][1], clipLine.RADIUS),
			RabbitEar.svg.circle(edge[1][0], edge[1][1], clipLine.RADIUS)
		];
		endpoints.forEach(c => {
			c.setAttribute("fill", "#ecb233");
			clipLine.lineLayer.appendChild(c);
		})
	}
}
clipLine.redraw();

clipLine.addEventListener("mousedown", function(mouse){
	let ep = clipLine.width / 50;
	let down = clipLine.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	clipLine.selected = found;
});

clipLine.addEventListener("mousemove", function(mouse){
	if(mouse.isPressed && clipLine.selected != null){
		clipLine.touches[clipLine.selected].pos = mouse.position;
		clipLine.redraw();
	}
});
