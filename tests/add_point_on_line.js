
let tttop = RabbitEar.Origami(RabbitEar.bases.kite);

let cp = RabbitEar.bases.kite;

let origami = RabbitEar.Origami(cp);

origami.onMouseDown = function(event) {
	let nearest = origami.nearest(event);
	origami.cp.addVertexOnEdge(event.x, event.y, nearest.crease);
	// origami.draw();
	console.log(origami.cp);
}

