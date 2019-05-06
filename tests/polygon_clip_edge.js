let clipEdgeCallback = undefined;

let clipEdge = RabbitEar.svg.image("canvas-clip-edge", 500, 500);

function equivalent2(a, b, epsilon = 1e-12) {
	return Math.abs(a[0]-b[0]) < epsilon && Math.abs(a[1]-b[1]) < epsilon;
}

clipEdge.setup = function() {
	clipEdge.STROKE_WIDTH = clipEdge.w * 0.0125;
	clipEdge.RADIUS = clipEdge.w * 0.025;

	clipEdge.backLayer = RabbitEar.svg.group();
	clipEdge.appendChild(clipEdge.backLayer);

	clipEdge.poly = RabbitEar.svg.polygon();
	clipEdge.poly.setAttribute("stroke", "#f1c14f");
	clipEdge.poly.setAttribute("stroke-width", clipEdge.STROKE_WIDTH);
	clipEdge.poly.setAttribute("fill", "white");
	clipEdge.poly.setAttribute("stroke-linecap", "round");
	clipEdge.appendChild(clipEdge.poly);

	clipEdge.topLayer = RabbitEar.svg.group();
	clipEdge.appendChild(clipEdge.topLayer);

	clipEdge.touches = RabbitEar.svg.controls(clipEdge, 2, {
		radius: clipEdge.RADIUS*1.5,
		fill: "#e44f2a"
	});
	clipEdge.touches.forEach(p =>
		p.position = [Math.random()*clipEdge.w, Math.random()*clipEdge.h]
	);
	clipEdge.touches[0].position = [clipEdge.w*0.5, clipEdge.h*0.5];

	clipEdge.boundary = [ [0, 0], [500, 0], [500, 500], [0, 500] ];
}
clipEdge.setup();

clipEdge.rebuildHull = function(){
	let hullPoints = Array.from(Array(24)).map(_ => {
		let a = Math.random() * Math.PI*2;
		let r = Math.random() * clipEdge.h*0.5;
		return [clipEdge.w*0.5 + r*Math.cos(a), clipEdge.h*0.5 + r*Math.sin(a)];
	});
	clipEdge.hull = RabbitEar.Polygon.convexHull(hullPoints);
	let pointsString = clipEdge.hull.points
		.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	clipEdge.poly.setAttribute("points", pointsString);
}
clipEdge.rebuildHull();

clipEdge.redraw = function(){

	RabbitEar.svg.removeChildren(clipEdge.backLayer);
	let backLine = RabbitEar.Edge(
		clipEdge.touches[0].position,
		clipEdge.touches[1].position
	);
	let backEdge = RabbitEar.math.intersection.clip_line_in_convex_poly(clipEdge.boundary, backLine.point, backLine.vector);

	let edge = clipEdge.hull.clipEdge(
		clipEdge.touches[0].position,
		clipEdge.touches[1].position
	);

	RabbitEar.svg.removeChildren(clipEdge.topLayer);
	if(edge != null){
		let l = RabbitEar.svg.line(edge[0][0], edge[0][1], edge[1][0], edge[1][1]);
		l.setAttribute("stroke", "#f1c14f");
		l.setAttribute("stroke-width", clipEdge.STROKE_WIDTH);
		l.setAttribute("stroke-linecap", "round");
		l.setAttribute("stroke-dasharray", clipEdge.STROKE_WIDTH + " " + clipEdge.STROKE_WIDTH*2);
		clipEdge.topLayer.appendChild(l);
		let endpoints = [
			RabbitEar.svg.circle(edge[0][0], edge[0][1], clipEdge.RADIUS),
			RabbitEar.svg.circle(edge[1][0], edge[1][1], clipEdge.RADIUS)
		];
		endpoints.forEach(c => {
			c.setAttribute("fill", "#224c72");
			clipEdge.topLayer.appendChild(c);
		})
		// color the big touches
		if(equivalent2(clipEdge.touches[0].position, edge[0]) ||
			equivalent2(clipEdge.touches[0].position, edge[1])) {
			clipEdge.touches[0].circle.setAttribute("fill", "#224c72");
		} else {
			clipEdge.touches[0].circle.setAttribute("fill", "#e44f2a");
		}
		if(equivalent2(clipEdge.touches[1].position, edge[0]) ||
			equivalent2(clipEdge.touches[1].position, edge[1])) {
			clipEdge.touches[1].circle.setAttribute("fill", "#224c72");
		} else {
			clipEdge.touches[1].circle.setAttribute("fill", "#e44f2a");
		}
	} else {
			clipEdge.touches[0].circle.setAttribute("fill", "#e44f2a");
			clipEdge.touches[1].circle.setAttribute("fill", "#e44f2a");
	}
	if (clipEdgeCallback !== undefined) {
		clipEdgeCallback({edge})
	}
}
clipEdge.redraw();

clipEdge.onMouseMove = function(mouse){
	if (mouse.isPressed) {
		clipEdge.redraw();
	}
};
