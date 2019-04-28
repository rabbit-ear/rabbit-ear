var nearestPointCallback;

let nearestPoint = RabbitEar.svg.image("nearest-point", 600, 300);

nearestPoint.setup = function(){
	nearestPoint.backLayer = RabbitEar.svg.group();
	nearestPoint.lineLayer = RabbitEar.svg.group();
	nearestPoint.circleLayer = RabbitEar.svg.group();
	nearestPoint.appendChild(nearestPoint.backLayer);
	nearestPoint.appendChild(nearestPoint.lineLayer);
	nearestPoint.appendChild(nearestPoint.circleLayer);
	nearestPoint.edges = Array.from(Array(3)).map(_ =>
		RabbitEar.Edge(
			Math.random()*nearestPoint.w,
			Math.random()*nearestPoint.h,
			Math.random()*nearestPoint.w,
			Math.random()*nearestPoint.h)
	);
	let svgLines = nearestPoint.edges.map(edge =>
		RabbitEar.svg.line(edge[0][0], edge[0][1], edge[1][0], edge[1][1])
	);
	svgLines.forEach(line => line.setAttribute("stroke", "#000"));
	svgLines.forEach(line => line.setAttribute("stroke-width", 4));
	svgLines.forEach(line => nearestPoint.lineLayer.appendChild(line));
}

nearestPoint.setup();

nearestPoint.update = function(point) {
	RabbitEar.svg.removeChildren(nearestPoint.circleLayer);
	let points = nearestPoint.edges.map(e => e.nearestPoint(point));
	let circles = points.map(p => RabbitEar.svg.circle(p.x, p.y, 6));
	circles.forEach(c => c.setAttribute("fill", "white"));
	circles.forEach(c => c.setAttribute("stroke", "#000"));
	circles.forEach(c => c.setAttribute("stroke-width", 4));
	circles.forEach(c => nearestPoint.circleLayer.appendChild(c));
	
	RabbitEar.svg.removeChildren(nearestPoint.backLayer);
	let connections = points.map(p => RabbitEar.svg.line(p.x, p.y, point[0], point[1]))
	connections.forEach(l => {
		l.setAttribute("stroke", "#f1c14f");
		l.setAttribute("stroke-width", 4);
		l.setAttribute("stroke-linecap", "round");
		l.setAttribute("stroke-dasharray", "0.1 8");
		nearestPoint.backLayer.appendChild(l);
	});

	if (nearestPointCallback != null) {
		nearestPointCallback({mouse: point});
	}
}

nearestPoint.update([nearestPoint.w/2, nearestPoint.h/2]);

nearestPoint.onMouseMove = function(mouse){
	nearestPoint.update(mouse.position);
};