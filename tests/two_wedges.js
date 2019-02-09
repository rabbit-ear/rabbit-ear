let twoArcs = RabbitEar.svg.Image("canvas-bisect", 500, 500);

twoArcs.NUM_LINES = 2;

twoArcs.reset = function(){
	twoArcs.touches = Array.from(Array(twoArcs.NUM_LINES)).map(_ => (
		{pos: [Math.random()*twoArcs.width, Math.random()*twoArcs.height], svg: RabbitEar.svg.circle(0, 0, 8)}
	));
	twoArcs.lines = twoArcs.touches.map(_ => RabbitEar.svg.line(0,0,0,0));
	twoArcs.wedges = twoArcs.touches.map(_ => RabbitEar.svg.wedge(0,0,0,0,0));

	twoArcs.removeChildren();
	let colors = ["#195783", "#ecb233", "#e44f2a"];
	twoArcs.wedges.forEach((w,i) => {
		w.setAttribute("fill", colors[i%3]);
		twoArcs.appendChild(w);
	});
	twoArcs.lines.forEach(l => {
		l.setAttribute("stroke", "black");
		l.setAttribute("stroke-width", 3);
		l.setAttribute("stroke-linecap", "round");
		twoArcs.appendChild(l);
	});
	twoArcs.touches.forEach(p => {
		p.svg.setAttribute("fill", "#e44f2a");
		twoArcs.appendChild(p.svg);
	});
}
twoArcs.reset();

twoArcs.update = function(){
	let angles = twoArcs.touches.map(el => Math.atan2(el.pos[1] - twoArcs.height/2, el.pos[0] - twoArcs.width/2));
	let vecs = angles.map(a => [Math.cos(a), Math.sin(a)]);

	let centerX = twoArcs.width * 0.5;
	let centerY = twoArcs.height * 0.5;
	let r = twoArcs.height / 3;
	twoArcs.touches.forEach(el => {
		el.svg.setAttribute("cx", el.pos[0]);
		el.svg.setAttribute("cy", el.pos[1]);
	});
	twoArcs.lines.forEach((l,i) => {
		l.setAttribute("x1", centerX);
		l.setAttribute("y1", centerY);
		l.setAttribute("x2", centerX + vecs[i][0] * r);
		l.setAttribute("y2", centerY + vecs[i][1] * r);
	});
	twoArcs.wedges.forEach((w,i,a) => {
		RabbitEar.svg.setArc(w, centerX, centerY,
			twoArcs.width * 0.25,
			Math.atan2(vecs[i][1], vecs[i][0]),
			Math.atan2(vecs[(i+1)%a.length][1], vecs[(i+1)%a.length][0]),
			true
		);
	});
}
twoArcs.update();


twoArcs.onMouseDown = function(mouse){
	let ep = twoArcs.width / 50;
	let down = twoArcs.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	twoArcs.selected = found;
}

twoArcs.onMouseMove = function(mouse){
	if(mouse.isPressed && twoArcs.selected != null){
		twoArcs.touches[twoArcs.selected].pos = mouse.position;
		twoArcs.update();
	}
}
