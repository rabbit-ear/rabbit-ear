let lBis = RabbitEar.svg.image("canvas-line-bisect", 600, 300);

lBis.setup = function() {
	lBis.colors = ["black", "black"];//["#ecb233", "#e44f2a", "#195783"];
	lBis.lines = [lBis.line(), lBis.line()];
	lBis.controls = RabbitEar.svg.controls(lBis, 4, {radius:6});
	let pos = [
		[lBis.w*0.5 - 50, lBis.h*0.5 - 50],
		[lBis.w*0.5 + 50, lBis.h*0.5 - 50],
		[lBis.w*0.5 - 50, lBis.h*0.5 + 50],
		[lBis.w*0.5 + 50, lBis.h*0.5 + 50],
	]
	lBis.controls.forEach((c,i) => c.position = pos[i]);
	// lBis.controls.forEach((c,i) => c.position = [
	// 	Math.random()*lBis.w*0.8 + lBis.w*0.1,
	// 	Math.random()*lBis.h*0.8 + lBis.h*0.1
	// ]);
	lBis.controls.forEach((c,i) => 
		c.circle.setAttribute("fill", "none")//lBis.colors[Math.floor(i/2)%3])
	);
	lBis.lines.forEach((l,i) => {
		l.setAttribute("stroke", lBis.colors[i%3]);
		l.setAttribute("stroke-width", 7);
		l.setAttribute("stroke-linecap", "round");
	});
	let p = 1000;
	lBis.boundary = RabbitEar.math.Polygon([
		[-p, -p], [lBis.w+p, -p], [lBis.w+p, lBis.h+p], [-p, lBis.h+p]
	]);
	lBis.arrowLayer = lBis.group();
	lBis.lineLayer = lBis.group();
}

lBis.redraw = function() {
	lBis.lineLayer.removeChildren();
	lBis.arrowLayer.removeChildren();
	let lineA = RabbitEar.math.Line.fromPoints(lBis.controls[0].position, lBis.controls[1].position);
	let lineB = RabbitEar.math.Line.fromPoints(lBis.controls[2].position, lBis.controls[3].position);
	let segments = [
		lBis.boundary.clipLine(lineA),
		lBis.boundary.clipLine(lineB)
	];
	segments.forEach((segment, i) => segment.forEach((p, j) => {
		lBis.lines[i].setAttribute("x"+(j+1), p[0]);
		lBis.lines[i].setAttribute("y"+(j+1), p[1]);
	}));
	let bisects = RabbitEar.math.core.geometry.bisect_lines2(lineA.point, lineA.vector, lineB.point, lineB.vector);

	let linelines = bisects.map(b => RabbitEar.math.Line(b[0][0], b[0][1], b[1][0], b[1][1]));
	let bColors = ["#ecb233", "#e44f2a"];
	let lineSegs = linelines.map((l,i) => ({l:lBis.boundary.clipLine(l), c:bColors[i%2]})).filter(el => el.l !== undefined)
	lineSegs.map(el => {
		let l = lBis.lineLayer.line(el.l[0][0], el.l[0][1], el.l[1][0], el.l[1][1]);
		l.setAttribute("stroke", el.c);
		l.setAttribute("stroke-width", 7);
		l.setAttribute("stroke-linecap", "round");
		return l;
	})

	let controls = lBis.controls.map(c => RabbitEar.math.Vector(c.position));

	let arrows = [
		drawArrow(controls[0], controls[1]),
		drawArrow(controls[2], controls[3])
	]
	arrows.forEach(a => lBis.arrowLayer.appendChild(a));

	// if (lineB.vector.cross(lineA.vector).reduce((a,b)=>a+b,0) < 0){
	if (lineB.vector.dot(lineA.vector) < 0){
		arrows.forEach(a => a.setAttribute("fill", "#e44f2a"))
		arrows.forEach(a => a.setAttribute("stroke", "#e44f2a"))
	} else {
		arrows.forEach(a => a.setAttribute("fill", "#ecb233"))
		arrows.forEach(a => a.setAttribute("stroke", "#ecb233"))
	}

}

lBis.onMouseMove = function(mouse){
	if (mouse.isPressed) {
		lBis.redraw();
	}
};

const drawArrow = function(start, end) {
	let arrow_head = 18;
	let arrow = RabbitEar.svg.group();
	let line = arrow.line(start[0], start[1], end[0], end[1])
	line.setAttribute("stroke-width", 3);
	line.setAttribute("stroke-dasharray", "2 4");
	line.setAttribute("stroke-linecap", "round");
	let arrowVector = end.subtract(start).normalize();
	let arrowNormal = arrowVector.rotateZ90();
	// black triangle
	let blackSegments = [
		end.add(arrowNormal.scale(-(arrow_head+13)*0.375)),
		end.add(arrowNormal.scale((arrow_head+13)*0.375)),
		end.add(arrowVector.scale((arrow_head+13)))
	];
	let blackShift = arrowVector.rotateZ180().scale(3);
	blackSegments = blackSegments.map(s => s.add(blackShift));
	let blackPoly = arrow.polygon(blackSegments);
	blackPoly.setAttribute("stroke", "none");
	blackPoly.setAttribute("fill", "#000");
	// light triangle
	let segments = [
		end.add(arrowNormal.scale(-arrow_head*0.375)),
		end.add(arrowNormal.scale(arrow_head*0.375)),
		end.add(arrowVector.scale(arrow_head))
	];
	arrow.polygon(segments).setAttribute("stroke", "none");
	return arrow;
}

lBis.setup();
lBis.redraw();
