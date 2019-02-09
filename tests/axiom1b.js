let axiom1 = RabbitEar.Origami("canvas-axiom-1b");
axiom1.drawGroup = RabbitEar.svg.group();
axiom1.svg.appendChild(axiom1.drawGroup);

axiom1.points = [ [0.25, 0.25], [0.7, 0.75] ];

axiom1.redraw = function(){
	RabbitEar.svg.removeChildren(axiom1.drawGroup);
	axiom1.points.forEach(p => RabbitEar.svg.circle(p[0], p[1], 0.015, "touch", null, axiom1.drawGroup));
	let linePoint = axiom1.points[0];
	let lineVector = [0,1].map(i => axiom1.points[1][i] - axiom1.points[0][i]);
	let newCP = RabbitEar.fold.clip_edges_with_line(RabbitEar.fold.clone(RabbitEar.bases.square), linePoint, lineVector);
	newCP.edges_assignment[newCP.edges_assignment.length-1] = "V";
	axiom1.cp = newCP;
}
axiom1.redraw();

axiom1.onMouseMove = function(mouse){
	if(mouse.isPressed && axiom1.selected != null){
		axiom1.points[axiom1.selected] = mouse.position;
		axiom1.redraw();
	}
}

axiom1.onMouseDown = function(mouse){
	let ep = 5e-2;
	let down = axiom1.points.map(p => Math.abs(mouse.x - p[0]) < ep && Math.abs(mouse.y - p[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	axiom1.selected = found;
}