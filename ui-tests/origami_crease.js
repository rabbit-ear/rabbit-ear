var creaseEdge = RabbitEar.Origami();

creaseEdge.redraw = function(){
	let p = [[Math.random(), Math.random()], [Math.random(), Math.random()]];
	creaseEdge.cp.axiom1(p[0], p[1]).valley();
}
creaseEdge.redraw();

creaseEdge.addEventListener("mousedown", function(mouse){
	creaseEdge.redraw();
})
creaseEdge.addEventListener("mouseup", function(mouse){});
creaseEdge.addEventListener("mousemove", function(mouse){});
