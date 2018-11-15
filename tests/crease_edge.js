var creaseEdge = RabbitEar.Origami();

creaseEdge.redraw = function(){
	var edge = RabbitEar.Math.Edge(Math.random(), Math.random(), Math.random(), Math.random());
	let p = edge.endpoints;

	let result = RabbitEar.fold.add_edge(RabbitEar.bases.unitSquare, p[0], p[1]);
	console.log(result);
	result.edges_assignment.push("V");
	creaseEdge.cp = result;

	// this.cp.clear();
	// this.cp.crease(edge).mountain();

	// this.draw();
}
creaseEdge.redraw();

creaseEdge.onMouseDown = function(event){ }
creaseEdge.onMouseUp = function(event){ }
creaseEdge.onMouseMove = function(event){ }
