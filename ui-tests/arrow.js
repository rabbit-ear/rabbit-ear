let arrowsStyle = RE.svg.image("canvas-arrows-style", 1,1, {padding:0.1});
arrowsStyle.drawLayer = arrowsStyle.g();

arrowsStyle.styles = [{
	color: "#000",
	strokeWidth: 0.04,
	width: 0.06,
	length: 0.12,
	bend: 0,
	padding: 0.3,
},
{
	color: "#eb3",
	strokeWidth: 0.02,
	width: 0.05,
	length: 0.05,
	bend: 0.8,
	padding: 0.5,
	side: false,
},
{
	color: "#e53",
	start: true,
	strokeStyle: "stroke-dasharray:0.02 0.02 0.001 0.02;stroke-linecap:round"
}]

arrowsStyle.controls = RE.svg.controls(arrowsStyle, 0);
Array.from(Array(arrowsStyle.styles.length*2))
	.map(_ => [Math.random(), Math.random()])
	.map(p => ({position: p, radius: 0.02, fill:"#e53"}))
	.forEach(options => arrowsStyle.controls.add(options));

arrowsStyle.redraw = function() {
	let c = arrowsStyle.controls;
	arrowsStyle.drawLayer.removeChildren();
	arrowsStyle.styles.forEach((s,i) =>
		arrowsStyle.drawLayer.arcArrow(
			c[i*2+0].position,
			c[i*2+1].position,
			arrowsStyle.styles[i]
		)
	);
}
arrowsStyle.redraw();

arrowsStyle.onMouseMove = function(mouse) {
	if (mouse.isPressed) {
		arrowsStyle.redraw();
	}
}