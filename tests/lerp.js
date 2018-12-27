let lerps = RabbitEar.svg.Image("canvas-lerp", 500, 500);

lerps.dotLayer = RabbitEar.svg.group();
lerps.curveLayer = RabbitEar.svg.group();
lerps.svg.appendChild(lerps.curveLayer);
lerps.svg.appendChild(lerps.dotLayer);

lerps.reset = function(){
	RabbitEar.svg.removeChildren(lerps.dotLayer);
	lerps.touches = Array.from(Array(3)).map(_ => (
		{pos: [Math.random()*lerps.width * 0.8 + lerps.width*0.1,
		       Math.random()*lerps.height * 0.8 + lerps.height*0.1],
		 svg: RabbitEar.svg.circle(0, 0, 12)})
	);

	lerps.lerpDot = {
		pos: [Math.random()*lerps.width + lerps.getViewBox()[0],
		      Math.random()*lerps.height + lerps.getViewBox()[1]],
		svg: RabbitEar.svg.circle(0, 0, 12)
	};

	lerps.controlPoints = [
		{pos: [0, 0], svg: RabbitEar.svg.circle(0, 0, 12)},
		{pos: [0, 0], svg: RabbitEar.svg.circle(0, 0, 12)}
	];
	lerps.controlLine = RabbitEar.svg.line(0, 0, 0, 0);

	lerps.touches.forEach(p => {
		p.svg.setAttribute("fill", "#e44f2a");
		lerps.dotLayer.appendChild(p.svg);
	});

	lerps.lerpDot.svg.setAttribute("fill", "#ecb233");
	lerps.dotLayer.appendChild(lerps.lerpDot.svg);

	lerps.controlPoints.forEach(p => {
		p.svg.setAttribute("fill", "#195783");
		lerps.dotLayer.appendChild(p.svg);
	});

	lerps.curve = RabbitEar.svg.bezier(0, 0, 0, 0, 0, 0, 0, 0);
	lerps.curve.setAttribute("stroke", "#ecb233");
	lerps.curve.setAttribute("stroke-width", 5);
	lerps.curve.setAttribute("fill", "none");
	lerps.curveLayer.appendChild(lerps.curve);

	lerps.controlLine.setAttribute("stroke", "#195783");
	lerps.controlLine.setAttribute("stroke-width", 5);
	lerps.controlLine.setAttribute("stroke-linecap", "round");
	lerps.controlLine.setAttribute("stroke-dasharray", "7 10");
	lerps.controlLine.setAttribute("fill", "none");
	lerps.curveLayer.appendChild(lerps.controlLine);

}


lerps.update = function(){

	lerps.touches.forEach((p,i) => {
		p.svg.setAttribute("cx", p.pos[0]);
		p.svg.setAttribute("cy", p.pos[1]);
	});

	let mid1 = [
		(lerps.touches[2].pos[0]*0.666 + lerps.touches[0].pos[0]*0.333),
		(lerps.touches[2].pos[1]*0.666 + lerps.touches[0].pos[1]*0.333)
	];
	let mid2 = [
		(lerps.touches[2].pos[0]*0.666 + lerps.touches[1].pos[0]*0.333),
		(lerps.touches[2].pos[1]*0.666 + lerps.touches[1].pos[1]*0.333)
	];

	let d = "M " + lerps.touches[0].pos[0] + "," + lerps.touches[0].pos[1] 
		+ " C " + mid1[0] + "," + mid1[1] + " " 
		+ mid2[0] + "," + mid2[1] + " " 
		+ lerps.touches[1].pos[0] + "," + lerps.touches[1].pos[1];
	// let d = "M " + fromX + "," + fromY + " C " + c1X + "," + c1Y + " " + c2X + "," + c2Y + " " + toX + "," + toY;
	lerps.curve.setAttribute("d", d);
}


lerps.onMouseDown = function(mouse){
	let ep = lerps.width / 50;
	let down = lerps.touches.map(p => Math.abs(mouse.x - p.pos[0]) < ep && Math.abs(mouse.y - p.pos[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	lerps.selected = found;
}

lerps.onMouseMove = function(mouse){
	if(mouse.isPressed && lerps.selected != null){
		lerps.touches[lerps.selected].pos = mouse.position;
		lerps.update();
	}
}

lerps.animate = function(event){
	let phase = Math.sin(event.time) * 0.5 + 0.5;
	let vecs = lerps.touches.map(el => RabbitEar.math.Vector(el.pos))
	lerps.ctrlLerps = [
		vecs[0].lerp(vecs[2], phase),
		vecs[2].lerp(vecs[1], phase)
	];
	lerps.controlPoints.forEach((p,i) => {
		p.svg.setAttribute("cx", lerps.ctrlLerps[i].x);
		p.svg.setAttribute("cy", lerps.ctrlLerps[i].y);
	});

	let lerp = lerps.ctrlLerps[0].lerp(lerps.ctrlLerps[1], phase);
	lerps.lerpDot.svg.setAttribute("cx", lerp.x);
	lerps.lerpDot.svg.setAttribute("cy", lerp.y);

	lerps.controlLine.setAttribute("x1", lerps.ctrlLerps[0].x);
	lerps.controlLine.setAttribute("y1", lerps.ctrlLerps[0].y);
	lerps.controlLine.setAttribute("x2", lerps.ctrlLerps[1].x);
	lerps.controlLine.setAttribute("y2", lerps.ctrlLerps[1].y);
}

lerps.reset();
lerps.update();
