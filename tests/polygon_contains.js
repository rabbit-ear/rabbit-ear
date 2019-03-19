let contains = RabbitEar.svg.image("canvas-polygon-contains", 500, 500);

contains.STROKE_WIDTH = contains.width * 0.01;
contains.RADIUS = contains.width * 0.02;

contains.polygon = RabbitEar.svg.polygon();
contains.polygon.setAttribute("fill", "#ecb233");
contains.polygon.setAttribute("stroke", "none");
contains.appendChild(contains.polygon);

contains.dotLayer = RabbitEar.svg.group();
contains.appendChild(contains.dotLayer);

contains.touches = Array.from(Array(6)).map(_ => ({
	pos: [Math.random()*contains.width, Math.random()*contains.height],
	svg: RabbitEar.svg.circle(0, 0, contains.RADIUS)
}));

contains.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	contains.appendChild(p.svg);
});

contains.rebuildHull = function(){
	let dots = Array.from(Array(12)).map(_ => {
		let r = contains.height*0.45;
		let a = Math.random()*Math.PI*2;
		return [contains.width*0.5 + Math.cos(a) * r, contains.height*0.5 + Math.sin(a) * r];
	});
	contains.hull = RabbitEar.math.Polygon.convexHull(dots);
	let pointsString = contains.hull.points
		.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	contains.polygon.setAttribute("points", pointsString);
}
contains.rebuildHull();

contains.redraw = function(){
	contains.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
		let fillColor = contains.hull.contains(p.pos) ? "#e44f2a" : "black";
		p.svg.setAttribute("fill", fillColor);
	});
}
contains.redraw();

contains.addEventListener("mousedown", function(mouse){
	let ep = contains.width / 25;
	let down = contains.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	contains.selected = found;
});

contains.addEventListener("mousemove", function(mouse){
	if(mouse.isPressed && contains.selected != null){
		contains.touches[contains.selected].pos = mouse.position;
		contains.redraw();
	}
});
