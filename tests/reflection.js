let view5 = RabbitEar.svg.View("canvas-reflection", 800, 300);

view5.reflectLayer = RabbitEar.svg.group();
view5.appendChild(view5.reflectLayer);

view5.touches = [
	{pos: [Math.random()*view5.width, Math.random()*view5.height], svg: RabbitEar.svg.circle(0, 0, 8)},
	{pos: [Math.random()*view5.width, Math.random()*view5.height], svg: RabbitEar.svg.circle(0, 0, 8)},
];
view5.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	view5.appendChild(p.svg);
});

view5.points = Array.from(Array(24)).map((_,i) => {
	let x = Math.random()*view5.width;
	let y = Math.random()*view5.height;
	let circle = RabbitEar.svg.circle(x, y, 4);
	circle.setAttribute("fill", "#195783");
	view5.appendChild(circle);
	return { pos: [x,y], svg: circle };
});

view5.line = RabbitEar.svg.line(0,0,0,0);
view5.line.setAttribute("stroke", "#e44f2a");
view5.line.setAttribute("stroke-width", 3);
view5.line.setAttribute("stroke-dasharray", "6 6");
view5.line.setAttribute("stroke-linecap", "round");
view5.appendChild(view5.line);


view5.drawReflections = function(){
	RabbitEar.svg.removeChildren(view5.reflectLayer);

	let vec = [
		view5.touches[1].pos[0] - view5.touches[0].pos[0],
		view5.touches[1].pos[1] - view5.touches[0].pos[1]
	];
	let matrix = RabbitEar.math.Matrix.makeReflection(vec, view5.touches[0].pos);
	view5.points.forEach(p => {
		let newPos = matrix.transform(p.pos);
		// console.log(newPos);
		let circle = RabbitEar.svg.circle(newPos.x, newPos.y, 4);
		circle.setAttribute("fill", "#ecb233");
		view5.reflectLayer.appendChild(circle);
	})
}

view5.redraw = function(){
	view5.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
		view5.line.setAttribute("x"+(i+1), p.pos[0]);
		view5.line.setAttribute("y"+(i+1), p.pos[1]);
	});
	view5.drawReflections();
}
view5.redraw();

view5.onMouseDown = function(mouse){
	let ep = view5.width / 50;
	let down = view5.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	view5.selected = found;
}

view5.onMouseMove = function(mouse){
	if(mouse.isPressed && view5.selected != null){
		view5.touches[view5.selected].pos = mouse.position;
		view5.redraw();
	}
}
