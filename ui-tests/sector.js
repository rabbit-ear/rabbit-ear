let sectors = RabbitEar.svg("canvas-sectors", 500, 500);

sectors.NUM_LINES = 2;

sectors.reset = function(){
	sectors.touches = Array.from(Array(sectors.NUM_LINES)).map(_ => (
		{pos: [Math.random()*sectors.w, Math.random()*sectors.h], svg: RabbitEar.svg.circle(0, 0, 8)}
	));
	sectors.lines = sectors.touches.map(_ => RabbitEar.svg.line(0,0,0,0));
	sectors.wedges = sectors.touches.map(_ => RabbitEar.svg.wedge(0,0,0,0,0));

	sectors.removeChildren();
	let colors = ["#195783", "#ecb233", "#e44f2a"];
	sectors.wedges.forEach((w,i) => {
		w.setAttribute("fill", colors[i%3]);
		sectors.appendChild(w);
	});
	sectors.lines.forEach(l => {
		l.setAttribute("stroke", "black");
		l.setAttribute("stroke-width", 3);
		l.setAttribute("stroke-linecap", "round");
		sectors.appendChild(l);
	});
	sectors.touches.forEach(p => {
		p.svg.setAttribute("fill", "#e44f2a");
		sectors.appendChild(p.svg);
	});
}
sectors.reset();

sectors.update = function(){
	let angles = sectors.touches.map(el => Math.atan2(el.pos[1] - sectors.h/2, el.pos[0] - sectors.w/2));
	let vecs = angles.map(a => [Math.cos(a), Math.sin(a)]);

	let centerX = sectors.w * 0.5;
	let centerY = sectors.h * 0.5;
	let r = sectors.h / 3;
	sectors.touches.forEach(el => {
		el.svg.setAttribute("cx", el.pos[0]);
		el.svg.setAttribute("cy", el.pos[1]);
	});
	sectors.lines.forEach((l,i) => {
		l.setAttribute("x1", centerX);
		l.setAttribute("y1", centerY);
		l.setAttribute("x2", centerX + vecs[i][0] * r);
		l.setAttribute("y2", centerY + vecs[i][1] * r);
	});
	sectors.wedges.forEach((w,i,a) => {
		RabbitEar.svg.setArc(w, centerX, centerY,
			sectors.w * 0.25,
			Math.atan2(vecs[i][1], vecs[i][0]),
			Math.atan2(vecs[(i+1)%a.length][1], vecs[(i+1)%a.length][0]),
			true
		);
	});
}
sectors.update();


sectors.onMouseDown = function(mouse){
	let ep = sectors.w / 50;
	let down = sectors.touches.map(p => 
		Math.abs(mouse.x - p.pos[0]) < ep &&
		Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	sectors.selected = found;
};

sectors.onMouseMove = function(mouse){
	if(mouse.isPressed && sectors.selected != null){
		sectors.touches[sectors.selected].pos = mouse.position;
		sectors.update();
	}
};
