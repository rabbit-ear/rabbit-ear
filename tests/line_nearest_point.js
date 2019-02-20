let nearestPoint = RabbitEar.svg.Image("nearest-point", 1000, 300);
let lineLayer = RabbitEar.svg.group();
let circleLayer = RabbitEar.svg.group();
nearestPoint.appendChild(lineLayer);
nearestPoint.appendChild(circleLayer);

let edges = Array.from(Array(20)).map(_ =>
	RabbitEar.math.Edge(
		Math.random()*nearestPoint.width,
		Math.random()*nearestPoint.height,
		Math.random()*nearestPoint.width,
		Math.random()*nearestPoint.height)
);

let svgLines = edges.map(edge => RabbitEar.svg.line(edge.points[0][0], edge.points[0][1], edge.points[1][0], edge.points[1][1]));
svgLines.forEach(line => line.setAttribute("stroke", "black"));
svgLines.forEach(line => line.setAttribute("stroke-width", 4));
svgLines.forEach(line => lineLayer.appendChild(line));

nearestPoint.onMouseMove = function(mouse) {
	RabbitEar.svg.removeChildren(circleLayer);
	let points = edges.map(e => e.nearestPoint(mouse));
	let circles = points.map(p => RabbitEar.svg.circle(p.x, p.y, 10));
	circles.forEach(c => c.setAttribute("fill", "white"));
	circles.forEach(c => c.setAttribute("stroke", "black"));
	circles.forEach(c => c.setAttribute("stroke-width", 4));
	circles.forEach(c => circleLayer.appendChild(c));
}