var nearestPointCallback;

let nearestPoint = RabbitEar.svg.Image("nearest-point", 600, 300);

nearestPoint.setup = function(){
	nearestPoint.backLayer = RabbitEar.svg.group();
	nearestPoint.lineLayer = RabbitEar.svg.group();
	nearestPoint.circleLayer = RabbitEar.svg.group();
	nearestPoint.appendChild(nearestPoint.backLayer);
	nearestPoint.appendChild(nearestPoint.lineLayer);
	nearestPoint.appendChild(nearestPoint.circleLayer);
	nearestPoint.edges = Array.from(Array(12)).map(_ =>
		RabbitEar.math.Edge(
			Math.random()*nearestPoint.width,
			Math.random()*nearestPoint.height,
			Math.random()*nearestPoint.width,
			Math.random()*nearestPoint.height)
	);
	let svgLines = nearestPoint.edges.map(edge => RabbitEar.svg.line(edge.points[0][0], edge.points[0][1], edge.points[1][0], edge.points[1][1]));
	svgLines.forEach(line => line.setAttribute("stroke", "#224c72"));
	svgLines.forEach(line => line.setAttribute("stroke-width", 4));
	svgLines.forEach(line => nearestPoint.lineLayer.appendChild(line));
}

nearestPoint.setup();

nearestPoint.update = function(point) {
	RabbitEar.svg.removeChildren(nearestPoint.circleLayer);
	let points = nearestPoint.edges.map(e => e.nearestPoint(point));
	let circles = points.map(p => RabbitEar.svg.circle(p.x, p.y, 8));
	circles.forEach(c => c.setAttribute("fill", "white"));
	circles.forEach(c => c.setAttribute("stroke", "#224c72"));
	circles.forEach(c => c.setAttribute("stroke-width", 4));
	circles.forEach(c => nearestPoint.circleLayer.appendChild(c));
	
	RabbitEar.svg.removeChildren(nearestPoint.backLayer);
	let connections = points.map(p => RabbitEar.svg.line(p.x, p.y, point[0], point[1]))
	connections.forEach(l => {
		l.setAttribute("stroke", "#f1c14f");
		l.setAttribute("stroke-width", 4);
		l.setAttribute("stroke-linecap", "round");
		l.setAttribute("stroke-dasharray", "4 8");
		nearestPoint.backLayer.appendChild(l);
	});

	if (nearestPointCallback != null) {
		nearestPointCallback({mouse: point});
	}
}

nearestPoint.update([nearestPoint.width/2, nearestPoint.height/2]);

nearestPoint.addEventListener("mousemove", function(mouse){
	nearestPoint.update(mouse.position);
});