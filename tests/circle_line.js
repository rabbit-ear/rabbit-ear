
let circleLine = RabbitEar.svg.image("canvas-circle-line", 500, 500);

circleLine.setup = function() {
	circleLine.boundary = [ [0, 0], [500, 0], [500, 500], [0, 500] ];

	circleLine.strokeW = circleLine.w*0.01;

	circleLine.topLayer = RabbitEar.svg.group();
	circleLine.bottomLayer = RabbitEar.svg.group();
	circleLine.circle = RabbitEar.math.Circle(250, 250, 150);
	let circleSVG = RabbitEar.svg.circle(250, 250, 150);
	circleSVG.setAttribute("stroke", "#f1c14f");
	circleSVG.setAttribute("stroke-width", circleLine.strokeW);
	circleSVG.setAttribute("fill", "white");

	circleLine.appendChild(circleLine.bottomLayer);
	circleLine.appendChild(circleSVG);
	circleLine.appendChild(circleLine.topLayer);

	circleLine.controls = RabbitEar.svg.controls(circleLine, 2, {
		parent: circleLine,
		fill: "#e35536",
		radius: circleLine.strokeW * 3
	});

	circleLine.controls.forEach(p => p.position = [
		Math.random() * circleLine.w,
		Math.random() * circleLine.h
	]);
}
circleLine.setup();

circleLine.redraw = function() {
	RabbitEar.svg.removeChildren(circleLine.topLayer);
	RabbitEar.svg.removeChildren(circleLine.bottomLayer);

	circleLine.line = RabbitEar.math.Line.fromPoints(circleLine.controls.map(p => p.position));
	let lineOnScreen = RabbitEar.math.core.intersection.clip_line_in_convex_poly(circleLine.boundary, circleLine.line.point, circleLine.line.vector);
	let svgLine = RabbitEar.svg.line(
		lineOnScreen[0][0], lineOnScreen[0][1],
		lineOnScreen[1][0], lineOnScreen[1][1]
	);
	svgLine.setAttribute("stroke", "#f1c14f");
	svgLine.setAttribute("stroke-width", circleLine.strokeW);
	circleLine.bottomLayer.appendChild(svgLine);
	let intersections = circleLine.circle.intersectionLine(circleLine.line);
	if (intersections === undefined) { return; }
	if (intersections.length == 2) {
		let svgSegment = RabbitEar.svg.line(
			intersections[0][0], intersections[0][1], 
			intersections[1][0], intersections[1][1]
		);
		svgSegment.setAttribute("stroke", "#f1c14f");
		svgSegment.setAttribute("stroke-width", circleLine.strokeW);
		svgSegment.setAttribute("stroke-dasharray", "5 10");
		svgSegment.setAttribute("stroke-linecap", "round");
		circleLine.topLayer.appendChild(svgSegment);
	}
	intersections.map(i => 
		RabbitEar.svg.circle(i[0], i[1], circleLine.strokeW * 2)
	).forEach(circle => {
		circle.setAttribute("fill", "#224c72");
		circleLine.topLayer.appendChild(circle);
	});
}
circleLine.redraw();

circleLine.onMouseMove = function(mouse){
	if (mouse.isPressed) { circleLine.redraw(); }
};


