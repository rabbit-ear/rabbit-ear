let bisect = RabbitEar.svg.image("canvas-bisect", 500, 500);

bisect.NUM_WEDGES = 2;
bisect.STROKE_WIDTH = bisect.h * 0.0125;
bisect.RADIUS = bisect.h * 0.033333;

bisect.reset = function(){
	bisect.touches = Array.from(Array(bisect.NUM_WEDGES)).map(_ => {
		let a = Math.random() * Math.PI * 2;
		let r = bisect.h * 0.45;
		return {
			pos: [bisect.w/2 + Math.cos(a) * r, bisect.h/2 + Math.sin(a) * r],
			svg: RabbitEar.svg.circle(0, 0, bisect.RADIUS)
		};
	});
	bisect.wedges = bisect.touches.map(_ => RabbitEar.svg.wedge(0,0,0,0,0));
	bisect.bisectLines = bisect.touches.map(_ => RabbitEar.svg.line(0,0,0,0));
	bisect.removeChildren();
	let wColors = ["#195783", "#ecb233"];
	bisect.wedges.forEach((w,i) => {
		w.setAttribute("fill", wColors[i%2]);
		bisect.appendChild(w);
	});
	bisect.touches.forEach(p => {
		p.svg.setAttribute("fill", "#e44f2a");
		bisect.appendChild(p.svg);
	});
	let lColors = ["#e44f2a", "black"];
	bisect.bisectLines.forEach((p,i) => {
		p.setAttribute("stroke", lColors[i%2]);
		p.setAttribute("stroke-width", bisect.STROKE_WIDTH);
		bisect.appendChild(p);
	});
}
bisect.reset();

bisect.update = function(){
	let angles = bisect.touches.map(el => Math.atan2(el.pos[1] - bisect.h/2, el.pos[0] - bisect.w/2));
	let vecs = angles.map(a => [Math.cos(a), Math.sin(a)]);
	let centerX = bisect.w * 0.5;
	let centerY = bisect.h * 0.5;
	let r1 = bisect.h * 0.333;
	let r2 = bisect.h * 0.475;
	bisect.touches.forEach(el => {
		el.svg.setAttribute("cx", el.pos[0]);
		el.svg.setAttribute("cy", el.pos[1]);
	});
	bisect.wedges.forEach((w,i,a) => {
		RabbitEar.svg.setArc(w, centerX, centerY, r1,
			Math.atan2(vecs[i][1], vecs[i][0]),
			Math.atan2(vecs[(i+1)%a.length][1], vecs[(i+1)%a.length][0]),
			true
		);
	});
	let bisects = RabbitEar.math.core.geometry.bisect_vectors(vecs[0], vecs[1]);
	bisects.forEach((vec,i) => {
		bisect.bisectLines[i].setAttribute("x1", centerX + vec[0] * (r1*1.05) );
		bisect.bisectLines[i].setAttribute("y1", centerY + vec[1] * (r1*1.05) );
		bisect.bisectLines[i].setAttribute("x2", centerX + vec[0] * r2);
		bisect.bisectLines[i].setAttribute("y2", centerY + vec[1] * r2);
	});
}
bisect.update();

bisect.onMouseDown = function(mouse){
	function distanceToMouse(a) { return Math.sqrt(Math.pow(a[0]-mouse[0],2)+Math.pow(a[1]-mouse[1],2)); }
	bisect.selected = bisect.touches.slice().sort((a,b) => distanceToMouse(a.pos) - distanceToMouse(b.pos)).shift();
};

bisect.onMouseMove = function(mouse){
	if(mouse.isPressed && bisect.selected != null){
		bisect.selected.pos = mouse.position;
		bisect.update();
	}
};
