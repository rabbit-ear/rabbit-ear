let sketch = RabbitEar.svg.image("sketch");

let points = sketch.makeTouchPoints(10);

points.forEach(p => p.circle.setAttribute("fill", "#e35536"));
points.forEach((p,i) => p.position = [Math.random()*sketch.width, Math.random()*sketch.height]);

sketch.onMouseMove = function(mouse) {
	if (sketch.touchPoints.selected !== undefined) {
		console.log(sketch.touchPoints.selected);
	}
}
