let hull = RabbitEar.svg.image("canvas-convex-hull", 500, 500);

hull.setup = function() {
	hull.STROKE_WIDTH = hull.w * 0.01;
	hull.RADIUS = hull.w * 0.02;

	hull.polygon = RabbitEar.svg.polygon();
	hull.polygon.setAttribute("stroke", "#ecb233");
	hull.polygon.setAttribute("stroke-width", hull.STROKE_WIDTH);
	hull.polygon.setAttribute("fill", "none");
	hull.polygon.setAttribute("stroke-linecap", "round");
	hull.appendChild(hull.polygon);

	hull.drawLayer = RabbitEar.svg.group();
	hull.appendChild(hull.drawLayer);
	hull.touches = RabbitEar.svg.controls(hull, 12, {radius: hull.RADIUS, fill: "#e44f2a"});
	hull.touches.forEach(t => t.position = [Math.random()*hull.w, Math.random()*hull.h]);
}
hull.setup();

hull.redraw = function(){
	hull.drawLayer.removeChildren();
	hull.poly = RabbitEar.math.ConvexPolygon.convexHull(hull.touches.map(t => t.position));
	let sectors = hull.poly.sectors;
	let bisections = sectors.map(s => s.bisect());
	bisections.map(s => [s.point, s.point.add(s.vector.scale(60))])
		.map(s => hull.drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1]))
		.forEach(l => {
			l.setAttribute("stroke-width", 4);
			l.setAttribute("stroke", "rgb(34, 76, 114)");
		});
	bisections.map(s => [s.point.add(s.vector.scale(60)), s.point.add(s.vector.scale(100))])
		.map(s => hull.drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1]))
		.forEach(l => {
			l.setAttribute("stroke-width", 4);
			l.setAttribute("stroke", "rgb(34, 76, 114)");
			l.setAttribute("stroke-dasharray", "4 4");
		});
	let pointsString = hull.poly.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	hull.polygon.setAttribute("points", pointsString);
}
hull.redraw();

hull.onMouseMove = function(mouse){
	if (mouse.isPressed) {
		hull.redraw();
	}
};
