let clipLineCallback = undefined;

let clipLine = RabbitEar.svg.image("canvas-clip-line", 500, 500);

clipLine.setup = function() {
	clipLine.STROKE_WIDTH = clipLine.w * 0.0125;
	clipLine.RADIUS = clipLine.w * 0.025;

	clipLine.backLayer = RabbitEar.svg.group();
	clipLine.appendChild(clipLine.backLayer);

	clipLine.polygon = RabbitEar.svg.polygon();
	clipLine.polygon.setAttribute("stroke", "#f1c14f");
	clipLine.polygon.setAttribute("stroke-width", clipLine.STROKE_WIDTH);
	clipLine.polygon.setAttribute("fill", "white");
	clipLine.polygon.setAttribute("stroke-linecap", "round");
	clipLine.appendChild(clipLine.polygon);

	clipLine.topLayer = RabbitEar.svg.group();
	clipLine.appendChild(clipLine.topLayer);

	clipLine.touches = RabbitEar.svg.controls(clipLine, 2, {
		radius: clipLine.RADIUS*1.5,
		fill: "#e44f2a"
	});
	clipLine.touches.forEach(p =>
		p.position = [Math.random()*clipLine.w, Math.random()*clipLine.h]
	);
	clipLine.touches[0].position = [clipLine.w*0.5, clipLine.h*0.5];

	clipLine.boundary = [ [0, 0], [500, 0], [500, 500], [0, 500] ];
}
clipLine.setup();

clipLine.rebuildHull = function(){
	let hullPoints = Array.from(Array(24)).map(_ => {
		let a = Math.random() * Math.PI*2;
		let r = Math.random() * clipLine.h*0.5;
		return [clipLine.w*0.5 + r*Math.cos(a), clipLine.h*0.5 + r*Math.sin(a)];
	});
	clipLine.hull = RabbitEar.Polygon.convexHull(hullPoints);
	let pointsString = clipLine.hull.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
	clipLine.polygon.setAttribute("points", pointsString);
}
clipLine.rebuildHull();

clipLine.redraw = function(){

	let vec = [
		clipLine.touches[1].position[0] - clipLine.touches[0].position[0],
		clipLine.touches[1].position[1] - clipLine.touches[0].position[1]
	];
	RabbitEar.svg.removeChildren(clipLine.backLayer);
	let backLine = RabbitEar.Line(clipLine.touches[1].position, vec);
	let backEdge = RabbitEar.math.intersection.clip_line_in_convex_poly(clipLine.boundary, backLine.point, backLine.vector);
	let backEdgeSVG = RabbitEar.svg.line(backEdge[0][0], backEdge[0][1], backEdge[1][0], backEdge[1][1]);
	backEdgeSVG.setAttribute("stroke", "#f1c14f");
	backEdgeSVG.setAttribute("stroke", "#f1c14f");
	backEdgeSVG.setAttribute("stroke-width", clipLine.STROKE_WIDTH);
	backEdgeSVG.setAttribute("stroke-linecap", "round");
	clipLine.backLayer.appendChild(backEdgeSVG);

	let edge = clipLine.hull.clipLine(clipLine.touches[0].position, vec);

	RabbitEar.svg.removeChildren(clipLine.topLayer);
	if(edge != null){
		let l = RabbitEar.svg.line(edge[0][0], edge[0][1], edge[1][0], edge[1][1]);
		l.setAttribute("stroke", "#f1c14f");
		l.setAttribute("stroke-width", clipLine.STROKE_WIDTH);
		l.setAttribute("stroke-linecap", "round");
		l.setAttribute("stroke-dasharray", clipLine.STROKE_WIDTH + " " + clipLine.STROKE_WIDTH*2);
		clipLine.topLayer.appendChild(l);
		let endpoints = [
			RabbitEar.svg.circle(edge[0][0], edge[0][1], clipLine.RADIUS),
			RabbitEar.svg.circle(edge[1][0], edge[1][1], clipLine.RADIUS)
		];
		endpoints.forEach(c => {
			c.setAttribute("fill", "#224c72");
			clipLine.topLayer.appendChild(c);
		})
	}
	if (clipLineCallback !== undefined) {
		clipLineCallback({edge})
	}
}
clipLine.redraw();

clipLine.onMouseMove = function(mouse){
	if (mouse.isPressed) {
		clipLine.redraw();
	}
};
