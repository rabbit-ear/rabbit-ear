let RE = RabbitEar;
let view = RabbitEar.svg.View("canvas-reflection", 800, 300);

view.reflectLayer = RE.svg.group();
view.appendChild(view.reflectLayer);

view.touches = [
	{pos: [Math.random()*view.width, Math.random()*view.height], svg: RE.svg.circle(0, 0, 4)},
	{pos: [Math.random()*view.width, Math.random()*view.height], svg: RE.svg.circle(0, 0, 4)},
];
view.touches.forEach(p => {
	p.svg.setAttribute("fill", "red");
	view.appendChild(p.svg);
});

view.points = Array.from(Array(24)).map((_,i) => {
	let x = Math.random()*view.width;
	let y = Math.random()*view.height;
	let circle = RE.svg.circle(x, y, 4);
	circle.setAttribute("fill", "black");
	view.appendChild(circle);
	return { pos: [x,y], svg: circle };
});

view.line = RE.svg.line(0,0,0,0);
view.line.setAttribute("stroke", "red");
view.line.setAttribute("stroke-width", 3);
view.line.setAttribute("stroke-dasharray", "6 6");
view.line.setAttribute("stroke-linecap", "round");
view.appendChild(view.line);


view.drawReflections = function(){
	RE.svg.removeChildren(view.reflectLayer);

	let vec = [
		view.touches[1].pos[0] - view.touches[0].pos[0],
		view.touches[1].pos[1] - view.touches[0].pos[1]
	];
	let matrix = RE.Math.Matrix.makeReflection(vec, view.touches[0].pos);
	view.points.forEach(p => {
		let newPos = matrix.transform(p.pos);
		// console.log(newPos);
		let circle = RE.svg.circle(newPos.x, newPos.y, 4);
		circle.setAttribute("fill", "#ccc");
		view.reflectLayer.appendChild(circle);
	})
}

view.redraw = function(){
	view.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
		view.line.setAttribute("x"+(i+1), p.pos[0]);
		view.line.setAttribute("y"+(i+1), p.pos[1]);
	});
	view.drawReflections();
}
view.redraw();

view.onMouseDown = function(mouse){
	let ep = view.width / 50;
	let down = view.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	view.selected = found;
}

view.onMouseMove = function(mouse){
	if(mouse.isPressed && view.selected != null){
		view.touches[view.selected].pos = mouse.position;
		view.redraw();
	}
}
