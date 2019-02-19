var creaseEdge = RabbitEar.Origami();

creaseEdge.redraw = function(){
	let p = [[Math.random(), Math.random()], [Math.random(), Math.random()]];
	creaseEdge.cp.axiom1(p[0], p[1]).valley();
}
creaseEdge.redraw();

creaseEdge.onMouseDown = function(mouse){
	creaseEdge.redraw();
}
creaseEdge.onMouseUp = function(mouse){ }
creaseEdge.onMouseMove = function(mouse){ }
