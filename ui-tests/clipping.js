let clipping = RabbitEar.origami("canvas-clipping");
let drawGroup = RabbitEar.svg.g();
clipping.appendChild(drawGroup);

clipping.points = [[Math.random(),Math.random()], [Math.random(),Math.random()]];
clipping.reset = function(){
	clipping.manyEdgesCP = JSON.parse(JSON.stringify(RabbitEar.bases.square));
	clipping.newEdges = [];
	for(var i = 0; i < 10; i++){
		let x = Math.random();
		let y = Math.random();
		let x2 = x + Math.random()*0.4-0.2;
		let y2 = y + Math.random()*0.4-0.2;
		clipping.newEdges.push([ [x,y], [x2,y2] ]);
	}
	clipping.newEdges.forEach(edge =>
		clipping.manyEdgesCP = clipping.cp.axiom1(edge[0], edge[1])
	)
	clipping.cp = clipping.manyEdgesCP;
}
clipping.reset();

clipping.redraw = function(){
	RabbitEar.svg.removeChildren(drawGroup);
	clipping.points.forEach(p => RabbitEar.svg.circle(p[0], p[1], 0.015, "touch", null, drawGroup));

	let lineVector = [0,1].map(i => clipping.points[1][i] - clipping.points[0][i]);
	let edge = RabbitEar.fold.clip_line(clipping.manyEdgesCP, clipping.points[0], lineVector);

	if(edge.length >= 2){
		clipping.cp.edges_assignment[clipping.cp.edges_assignment.length] = "V";
		clipping.cp = clipping.cp.axiom1(edge[0], edge[1]);
	} else {
		clipping.cp = clipping.manyEdgesCP;
	}
}
clipping.redraw();

clipping.onMouseMove = function(mouse){
	if(mouse.isPressed && clipping.selected != null){
		clipping.points[clipping.selected] = mouse.position;
		clipping.redraw();
	}
};

clipping.onMouseDown = function(mouse){
	let ep = 5e-2;
	let down = clipping.points.map(p => Math.abs(mouse.x - p[0]) < ep && Math.abs(mouse.y - p[1]) < ep);
	let found = down.map((b,i) => b ? i : undefined).filter(a => a != undefined).shift();
	clipping.selected = found;
};
