let betweenPoints = RabbitEar.Origami();

betweenPoints.points = [ [0.25, 0.25], [0.75, 0.75] ];
// let drawGroup = RabbitEar.svg.group();
// betweenPoints.svg.appendChild(drawGroup);

betweenPoints.redraw = function(){
	// RabbitEar.svg.removeChildren(drawGroup);
	// betweenPoints.points.forEach(p => RabbitEar.svg.circle(p[0], p[1], 0.015, "touch", null, drawGroup));

	betweenPoints.cp.edges_assignment.push("V");
	betweenPoints.cp = RabbitEar.fold.betweenPoints(RabbitEar.bases.square, betweenPoints.points[0], betweenPoints.points[1]);
}
betweenPoints.redraw();



betweenPoints.onMouseMove = function(mouse){
	if(mouse.isPressed && betweenPoints.selected != null){
		console.log(mouse);
		betweenPoints.points[betweenPoints.selected] = mouse.position;
		betweenPoints.redraw();
	}
}

betweenPoints.onMouseDown = function(mouse){
	let ep = 5e-2;
	let down = betweenPoints.points.map(p => Math.abs(mouse.x - p[0]) < ep && Math.abs(mouse.y - p[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	betweenPoints.selected = found;
}