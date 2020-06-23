RabbitEar.svg(document.querySelector("#canvas-circle-line") || document.body, 500, 500, svg => {

	const boundary = [ [0, 0], [500, 0], [500, 500], [0, 500] ];
	const strokeW = svg.getWidth()*0.01;

	const circle = RabbitEar.circle(250, 250, 150);

	svg.bottomLayer = svg.g();
	svg.circle(250, 250, 150)
		.stroke("#f1c14f")
		.strokeWidth(strokeW)
		.fill("white");

	svg.topLayer = svg.g();

	const touches = svg.controls(2)
		.svg(() => svg.circle().fill("#e35536").radius(strokeW * 3))
		.position(() => [
			Math.random() * svg.getWidth(),
			Math.random() * svg.getHeight()
		]).onChange(() => redraw());

	const redraw = function() {
		svg.topLayer.removeChildren();
		svg.bottomLayer.removeChildren();

		const line = RabbitEar.line.fromPoints(touches);
		let lineOnScreen = RabbitEar.math.intersection.convex_poly_line(boundary, line.origin, line.vector);

		const svgLine = svg.bottomLayer.line(lineOnScreen)
			.stroke("#f1c14f")
			.strokeWidth(strokeW);

		const intersections = circle.intersectionLine(line);
		// const intersections = RabbitEar.math.intersection.circle_line_new(circle.origin, circle.radius, line.origin, line.vector);
		if (intersections === undefined) { return; }
		if (intersections.length == 2) {
			svg.topLayer.line(intersections)
				.stroke("#f1c14f")
				.strokeWidth(strokeW)
				.strokeDasharray("5 10")
				.strokeLinecap("round");
		}

		intersections.map(i => svg.topLayer.circle(i[0], i[1], strokeW * 2)
			.fill("#224c72"));
	}

	redraw();
});
