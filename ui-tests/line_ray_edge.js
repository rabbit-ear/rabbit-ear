let lre = RabbitEar.svg("canvas-line-ray-edge", 600, 300);

lre.setup = function() {
	lre.lineLayer = lre.g();
	lre.colors = ["#ecb233", "#195783", "#e44f2a"]
	lre.lines = [lre.line(), lre.line(), lre.line()];
	lre.controls = RabbitEar.svg.controls(lre, 6, {radius:8});
	lre.controls.forEach(c => c.position = [
		Math.random()*lre.w*0.8 + lre.w*0.1,
		Math.random()*lre.h*0.8 + lre.h*0.1
	]);
	lre.controls.forEach((c,i) => 
		c.circle.setAttribute("fill", lre.colors[Math.floor(i/2)%3])
	);
	lre.lines.forEach((l,i) => {
		l.setAttribute("stroke", lre.colors[i%3]);
		l.setAttribute("stroke-width", 3);
		l.setAttribute("stroke-linecap", "round");
	});
	let p = 1000;
	lre.boundary = RabbitEar.polygon([
		[-p, -p], [lre.w+p, -p], [lre.w+p, lre.h+p], [-p, lre.h+p]
	]);
}
lre.setup();

lre.redraw = function(){
	let segments = Array.from(Array(3)).map((_,i) => [
		[lre.controls[(i*2)+0].position[0], lre.controls[(i*2)+0].position[1]],
		[lre.controls[(i*2)+1].position[0], lre.controls[(i*2)+1].position[1]]
	]);
	let line = RabbitEar.Line.fromPoints(lre.controls[0].position, lre.controls[1].position);
	let ray = RabbitEar.Ray.fromPoints(lre.controls[2].position, lre.controls[3].position);
	segments[0] = lre.boundary.clipLine(line);
	segments[1] = lre.boundary.clipRay(ray);
	segments.forEach((segment, i) => segment.forEach((p, j) => {
		lre.lines[i].setAttribute("x"+(j+1), p[0]);
		lre.lines[i].setAttribute("y"+(j+1), p[1]);
	}));
}
lre.redraw();

lre.onMouseMove = function(mouse){
	if (mouse.isPressed) {
		lre.redraw();
	}
};
