let axiom2 = RabbitEar.Origami();
let drawGroup = RabbitEar.svg.group();
axiom2.svg.appendChild(drawGroup);

axiom2.points = [[Math.random(),Math.random()], [Math.random(),Math.random()]];

axiom2.redraw = function(){
	RabbitEar.svg.removeChildren(drawGroup);
	axiom2.points.forEach(p => RabbitEar.svg.circle(p[0], p[1], 0.015, "touch", null, drawGroup));
	let crease = RabbitEar.fold.axiom2(RabbitEar.bases.unitSquare, axiom2.points[0], axiom2.points[1]);
	let newCP = RabbitEar.fold.clip_edges_with_line(RabbitEar.fold.clone(RabbitEar.bases.unitSquare), crease[0], crease[1]);
	newCP.edges_assignment[newCP.edges_assignment.length-1] = "V";
	axiom2.cp = newCP;
}
axiom2.redraw();

axiom2.onMouseMove = function(mouse){
	if(mouse.isPressed && axiom2.selected != null){
		axiom2.points[axiom2.selected] = mouse.position;
		axiom2.redraw();
	}
}

axiom2.onMouseDown = function(mouse){
	let ep = 5e-2;
	let down = axiom2.points.map(p => Math.abs(mouse.x - p[0]) < ep && Math.abs(mouse.y - p[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	axiom2.selected = found;
}