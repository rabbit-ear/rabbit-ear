let origami = RabbitEar.Origami(RabbitEar.bases.kite);

origami.addEventListener("mousedown", function(mouse){
	let nearest = origami.nearest(event);
	origami.cp.addVertexOnEdge(event.x, event.y, nearest.edge.index);
});