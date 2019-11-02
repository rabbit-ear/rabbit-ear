let lerpsCallback = undefined;

let lerps = RabbitEar.svg("canvas-lerp", 500, 500);

lerps.reset = function(){
	lerps.curveLayer = lerps.group();

	let startAngle = Math.random()*Math.PI*2;
	let angles = [startAngle];
	angles[1] = angles[0] + Math.random()*Math.PI*0.7 + 1;
	angles[2] = angles[1] + Math.random()*Math.PI*0.7 + 1;
	let radii = [
		(0.3 + 0.7*Math.random()) * lerps.h*0.5,
		(0.3 + 0.7*Math.random()) * lerps.h*0.5,
		(0.3 + 0.7*Math.random()) * lerps.h*0.5
	];

	lerps.controls = RabbitEar.svg.controls(lerps, 3, {fill: "#e44f2a", radius: 12});
	lerps.controls.forEach((c,i) => c.position = [
		lerps.w/2 + Math.cos(angles[i]) * radii[i],
		lerps.h/2 + Math.sin(angles[i]) * radii[i]
	]);

	lerps.curve = lerps.curveLayer.bezier(0, 0, 0, 0, 0, 0, 0, 0);
	lerps.midLine = lerps.curveLayer.line(0, 0, 0, 0);
	lerps.midPoints = [lerps.circle(0,0,12), lerps.circle(0,0,12)];
	lerps.lerpDot = lerps.circle(0, 0, 12);
	lerps.lerpDot.setAttribute("fill", "#ecb233");
	lerps.midPoints.forEach(p => p.setAttribute("fill", "#195783"));
	lerps.curve.setAttribute("stroke", "#ecb233");
	lerps.curve.setAttribute("stroke-width", 5);
	lerps.curve.setAttribute("fill", "none");
	lerps.midLine.setAttribute("stroke", "#195783");
	lerps.midLine.setAttribute("stroke-width", 5);
	lerps.midLine.setAttribute("stroke-linecap", "round");
	lerps.midLine.setAttribute("stroke-dasharray", "7 10");
	lerps.midLine.setAttribute("fill", "none");
}

lerps.update = function(){
	let mid1 = [
		(lerps.controls[2].position[0]*0.666 + lerps.controls[0].position[0]*0.333),
		(lerps.controls[2].position[1]*0.666 + lerps.controls[0].position[1]*0.333)
	];
	let mid2 = [
		(lerps.controls[2].position[0]*0.666 + lerps.controls[1].position[0]*0.333),
		(lerps.controls[2].position[1]*0.666 + lerps.controls[1].position[1]*0.333)
	];
	let d = "M " + lerps.controls[0].position[0] + "," + lerps.controls[0].position[1] 
		+ " C " + mid1[0] + "," + mid1[1] + " " 
		+ mid2[0] + "," + mid2[1] + " " 
		+ lerps.controls[1].position[0] + "," + lerps.controls[1].position[1];
	lerps.curve.setAttribute("d", d);
}

lerps.onMouseMove = function(mouse){
	if (mouse.isPressed) {
		lerps.update();
	}
};

lerps.animate = function(event){
	let phase = Math.sin(event.time) * 0.5 + 0.5;
	let vecs = lerps.controls.map(el => RabbitEar.vector(el.position))
	// let vecs = lerps.touches.map(el => RabbitEar.vector([el.pos[0], el.pos[1]]))
	lerps.ctrlLerps = [
		vecs[0].lerp(vecs[2], phase),
		vecs[2].lerp(vecs[1], phase)
	];
	lerps.midPoints.forEach((p,i) => {
		p.setAttribute("cx", lerps.ctrlLerps[i].x);
		p.setAttribute("cy", lerps.ctrlLerps[i].y);
	});

	let lerp = lerps.ctrlLerps[0].lerp(lerps.ctrlLerps[1], phase);
	lerps.lerpDot.setAttribute("cx", lerp.x);
	lerps.lerpDot.setAttribute("cy", lerp.y);

	lerps.midLine.setAttribute("x1", lerps.ctrlLerps[0].x);
	lerps.midLine.setAttribute("y1", lerps.ctrlLerps[0].y);
	lerps.midLine.setAttribute("x2", lerps.ctrlLerps[1].x);
	lerps.midLine.setAttribute("y2", lerps.ctrlLerps[1].y);

	if (lerpsCallback !== undefined) {
		lerpsCallback({t:phase});
	}
}

lerps.reset();
lerps.update();
