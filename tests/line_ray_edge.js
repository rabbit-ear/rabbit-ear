let lre = RabbitEar.svg.Image("canvas-line-ray-edge", 600, 300);

lre.lineLayer = RabbitEar.svg.group();
lre.appendChild(lre.lineLayer);

lre.minB = -100;
lre.maxB = lre.width + 100
lre.boundary = RabbitEar.math.Polygon([
	[lre.minB, lre.minB],
	[lre.maxB, lre.minB],
	[lre.maxB, lre.maxB],
	[lre.minB, lre.maxB]
]);

lre.touches = Array.from(Array(6)).map(_ => (
	{pos: [Math.random()*lre.width*0.8  + lre.width*0.1,
	       Math.random()*lre.height*0.8 + lre.height*0.1], 
	svg: RabbitEar.svg.circle(0, 0, 8)}
));
lre.lineColors = ["#ecb233", "#195783", "#e44f2a"]
lre.touches.forEach((p,i) => {
	p.svg.setAttribute("fill", lre.lineColors[parseInt(i/2)%3]);
	lre.appendChild(p.svg);
});

lre.lines = [
	RabbitEar.svg.line(0,0,0,0),
	RabbitEar.svg.line(0,0,0,0),
	RabbitEar.svg.line(0,0,0,0),
];
lre.lines.forEach((l,i) => {
	l.setAttribute("stroke", lre.lineColors[i%3]);
	l.setAttribute("stroke-width", 3);
	l.setAttribute("stroke-dasharray", "6 6");
	l.setAttribute("stroke-linecap", "round");
	lre.appendChild(l);
});

lre.redraw = function(){
	lre.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
		lre.lines[parseInt(i/2)].setAttribute("x"+(i%2+1), p.pos[0]);
		lre.lines[parseInt(i/2)].setAttribute("y"+(i%2+1), p.pos[1]);
	});
	let line = RabbitEar.math.Line.withPoints(lre.touches[0].pos, lre.touches[1].pos)
	let clipLine = lre.boundary.clipLine(line);
	lre.lines[0].setAttribute("x1", clipLine[0][0]);
	lre.lines[0].setAttribute("y1", clipLine[0][1]);
	lre.lines[0].setAttribute("x2", clipLine[1][0]);
	lre.lines[0].setAttribute("y2", clipLine[1][1]);

	let ray = RabbitEar.math.Ray.withPoints(lre.touches[2].pos, lre.touches[3].pos);
	let clipRay = lre.boundary.clipRay(ray);
	lre.lines[1].setAttribute("x1", clipRay[0][0]);
	lre.lines[1].setAttribute("y1", clipRay[0][1]);
	lre.lines[1].setAttribute("x2", clipRay[1][0]);
	lre.lines[1].setAttribute("y2", clipRay[1][1]);

}
lre.redraw();

lre.onMouseDown = function(mouse){
	let ep = lre.width / 50;
	let down = lre.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	lre.selected = found;
}

lre.onMouseMove = function(mouse){
	if(mouse.isPressed && lre.selected != null){
		lre.touches[lre.selected].pos = mouse.position;
		lre.redraw();
	}
}
