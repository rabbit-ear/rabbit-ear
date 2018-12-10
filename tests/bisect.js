let view11 = RabbitEar.svg.View("canvas-bisect", 500, 500);

view11.NUM_WEDGES = 2;
view11.STROKE_WIDTH = view11.height * 0.0125;
view11.RADIUS = view11.height * 0.02;

view11.reset = function(){
	view11.touches = Array.from(Array(view11.NUM_WEDGES)).map(_ => {
		let a = Math.random() * Math.PI * 2;
		let r = view11.height * 0.45;
		return {
			pos: [view11.width/2 + Math.cos(a) * r, view11.height/2 + Math.sin(a) * r],
			svg: RabbitEar.svg.circle(0, 0, view11.RADIUS)
		};
	});
	view11.wedges = view11.touches.map(_ => RabbitEar.svg.wedge(0,0,0,0,0));
	view11.bisectLines = view11.touches.map(_ => RabbitEar.svg.line(0,0,0,0));
	view11.removeChildren();
	let wColors = ["#195783", "#ecb233"];
	view11.wedges.forEach((w,i) => {
		w.setAttribute("fill", wColors[i%2]);
		view11.appendChild(w);
	});
	view11.touches.forEach(p => {
		p.svg.setAttribute("fill", "#e44f2a");
		view11.appendChild(p.svg);
	});
	let lColors = ["#e44f2a", "black"];
	view11.bisectLines.forEach((p,i) => {
		p.setAttribute("stroke", lColors[i%2]);
		p.setAttribute("stroke-width", view11.STROKE_WIDTH);
		view11.appendChild(p);
	});
}
view11.reset();

view11.update = function(){
	let angles = view11.touches.map(el => Math.atan2(el.pos[1] - view11.height/2, el.pos[0] - view11.width/2));
	let vecs = angles.map(a => [Math.cos(a), Math.sin(a)]);
	let centerX = view11.width * 0.5;
	let centerY = view11.height * 0.5;
	let r1 = view11.height * 0.333;
	let r2 = view11.height * 0.475;
	view11.touches.forEach(el => {
		el.svg.setAttribute("cx", el.pos[0]);
		el.svg.setAttribute("cy", el.pos[1]);
	});
	view11.wedges.forEach((w,i,a) => {
		RabbitEar.svg.setArc(w, centerX, centerY, r1,
			Math.atan2(vecs[i][1], vecs[i][0]),
			Math.atan2(vecs[(i+1)%a.length][1], vecs[(i+1)%a.length][0]),
			true
		);
	});
	let bisects = RabbitEar.math.core.bisect_vectors(vecs[0], vecs[1]);
	bisects.forEach((vec,i) => {
		view11.bisectLines[i].setAttribute("x1", centerX + vec[0] * (r1*1.05) );
		view11.bisectLines[i].setAttribute("y1", centerY + vec[1] * (r1*1.05) );
		view11.bisectLines[i].setAttribute("x2", centerX + vec[0] * r2);
		view11.bisectLines[i].setAttribute("y2", centerY + vec[1] * r2);
	});
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
