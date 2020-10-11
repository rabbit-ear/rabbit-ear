const boundary = ear.rect(svg.getWidth(), svg.getHeight());
const strokeW = svg.getWidth()*0.01;

const radius = Math.min(svg.getWidth() / 3, svg.getHeight() / 3);
const circle = ear.circle(boundary.center, radius);

const bottomLayer = svg.g();
circle.svg()
	.appendTo(svg)
	.stroke("#fb4")
	.strokeWidth(strokeW)
	.fill("white");
const topLayer = svg.g();

svg.controls(2)
	.svg(() => svg.circle().fill("#e53").radius(strokeW * 3))
	.position(() => [
		Math.random() * svg.getWidth(),
		Math.random() * svg.getHeight()
	]).onChange((p, i, pts) => {
		topLayer.removeChildren();
		bottomLayer.removeChildren();

		const line = ear.line.fromPoints(...pts);
		ear.segment(...boundary.intersect(line))
			.svg()
			.appendTo(bottomLayer)
			.stroke("#fb4")
			.strokeWidth(strokeW);

		const intersections = circle.intersect(line);
		if (intersections === undefined) { return; }
		if (intersections.length === 2) {
			topLayer.line(intersections)
				.stroke("#fb4")
				.strokeWidth(strokeW)
				.strokeDasharray("5 10")
				.strokeLinecap("round");
		}

		intersections.map(i => topLayer.circle(i[0], i[1], strokeW * 2).fill("#158"));
	}, true);
