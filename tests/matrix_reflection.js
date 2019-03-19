let reflect = RabbitEar.svg.image("canvas-reflection", 800, 300);

reflect.reflectLayer = RabbitEar.svg.group();
reflect.appendChild(reflect.reflectLayer);

reflect.touches = [
	{pos: [Math.random()*reflect.width, Math.random()*reflect.height], svg: RabbitEar.svg.circle(0, 0, 8)},
	{pos: [Math.random()*reflect.width, Math.random()*reflect.height], svg: RabbitEar.svg.circle(0, 0, 8)},
];
reflect.touches.forEach(p => {
	p.svg.setAttribute("fill", "#e44f2a");
	reflect.appendChild(p.svg);
});

reflect.points = Array.from(Array(24)).map((_,i) => {
	let x = Math.random()*reflect.width;
	let y = Math.random()*reflect.height;
	let circle = RabbitEar.svg.circle(x, y, 4);
	circle.setAttribute("fill", "#195783");
	reflect.appendChild(circle);
	return { pos: [x,y], svg: circle };
});

reflect.line = RabbitEar.svg.line(0,0,0,0);
reflect.line.setAttribute("stroke", "#e44f2a");
reflect.line.setAttribute("stroke-width", 3);
reflect.line.setAttribute("stroke-dasharray", "6 6");
reflect.line.setAttribute("stroke-linecap", "round");
reflect.appendChild(reflect.line);


reflect.drawReflections = function(){
	RabbitEar.svg.removeChildren(reflect.reflectLayer);

	let vec = [
		reflect.touches[1].pos[0] - reflect.touches[0].pos[0],
		reflect.touches[1].pos[1] - reflect.touches[0].pos[1]
	];
	let matrix = RabbitEar.math.Matrix2.makeReflection(vec, reflect.touches[0].pos);
	reflect.points.forEach(p => {
		let newPos = matrix.transform(p.pos);
		// console.log(newPos);
		let circle = RabbitEar.svg.circle(newPos.x, newPos.y, 4);
		circle.setAttribute("fill", "#ecb233");
		reflect.reflectLayer.appendChild(circle);
	})
}

reflect.redraw = function(){
	reflect.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
		reflect.line.setAttribute("x"+(i+1), p.pos[0]);
		reflect.line.setAttribute("y"+(i+1), p.pos[1]);
	});
	reflect.drawReflections();
}
reflect.redraw();

reflect.addEventListener("mousedown", function(mouse){
	let ep = reflect.width / 50;
	let down = reflect.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	reflect.selected = found;
});

reflect.addEventListener("mousemove", function(mouse){
	if(mouse.isPressed && reflect.selected != null){
		reflect.touches[reflect.selected].pos = mouse.position;
		reflect.redraw();
	}
});
