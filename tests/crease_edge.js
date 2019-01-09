var creaseEdge = RabbitEar.Origami();

creaseEdge.redraw = function(){
	let p = [[Math.random(), Math.random()], [Math.random(), Math.random()]];
	let result = RabbitEar.fold.axiom1(RabbitEar.bases.square, p[0], p[1]);
	result.edges_assignment.push("V");
	creaseEdge.cp = result;
}
creaseEdge.redraw();

creaseEdge.onMouseDown = function(mouse){
	creaseEdge.redraw();
}
creaseEdge.onMouseUp = function(mouse){ }
creaseEdge.onMouseMove = function(mouse){ }
