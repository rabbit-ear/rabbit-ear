let view11 = RabbitEar.svg.View("canvas-bisect", 500, 500);

view11.NUM_LINES = 2;

view11.reset = function(){
	view11.touches = Array.from(Array(view11.NUM_LINES)).map(_ => (
		{pos: [Math.random()*view11.width, Math.random()*view11.height], svg: RabbitEar.svg.circle(0, 0, 8)}
	));
	view11.lines = view11.touches.map(_ => RabbitEar.svg.line(0,0,0,0));
	view11.wedges = view11.touches.map(_ => RabbitEar.svg.wedge(0,0,0,0,0));
	view11.bisectDots = view11.touches.map(_ => RabbitEar.svg.circle(0,0,8));

	view11.removeChildren();
	let colors = ["#195783", "#ecb233"];
	view11.wedges.forEach((w,i) => {
		w.setAttribute("fill", colors[i%2]);
		view11.appendChild(w);
	});
	view11.lines.forEach(l => {
		l.setAttribute("stroke", "black");
		l.setAttribute("stroke-width", 3);
		l.setAttribute("stroke-linecap", "round");
		view11.appendChild(l);
	});
	view11.touches.forEach(p => {
		p.svg.setAttribute("fill", "#e44f2a");
		view11.appendChild(p.svg);
	});
	view11.bisectDots.forEach((p,i) => {
		p.setAttribute("fill", colors[(i+1)%2]);
		view11.appendChild(p);
	});
}
view11.reset();

view11.update = function(){
	let angles = view11.touches.map(el => Math.atan2(el.pos[1] - view11.height/2, el.pos[0] - view11.width/2));
	let vecs = angles.map(a => [Math.cos(a), Math.sin(a)]);

	let centerX = view11.width * 0.5;
	let centerY = view11.height * 0.5;
	let r = view11.height / 3;
	view11.touches.forEach(el => {
		el.svg.setAttribute("cx", el.pos[0]);
		el.svg.setAttribute("cy", el.pos[1]);
	});
	view11.lines.forEach((l,i) => {
		l.setAttribute("x1", centerX);
		l.setAttribute("y1", centerY);
		l.setAttribute("x2", centerX + vecs[i][0] * r);
		l.setAttribute("y2", centerY + vecs[i][1] * r);
	});
	view11.wedges.forEach((w,i,a) => {
		RabbitEar.svg.setArc(w, centerX, centerY,
			view11.width * 0.25,
			Math.atan2(vecs[i][1], vecs[i][0]),
			Math.atan2(vecs[(i+1)%a.length][1], vecs[(i+1)%a.length][0]),
			true
		);
	});

	let bisects = RabbitEar.math.core.bisect_vectors(vecs[0], vecs[1]);
	bisects.forEach((vec,i) => {
		view11.bisectDots[i].setAttribute("cx", centerX + vec[0] * r*1.1);
		view11.bisectDots[i].setAttribute("cy", centerY + vec[1] * r*1.1);
	})
	console.log(bisects);

}
view11.update();

view11.onMouseDown = function(mouse){
	let ep = view11.width / 50;
	let down = view11.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	view11.selected = found;
}

view11.onMouseMove = function(mouse){
	if(mouse.isPressed && view11.selected != null){
		view11.touches[view11.selected].pos = mouse.position;
		view11.update();
	}
}
