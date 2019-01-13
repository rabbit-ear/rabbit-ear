
let tttop = RabbitEar.Origami(RabbitEar.bases.kite);

let cp = RabbitEar.bases.kite;

let origami = RabbitEar.Origami(cp);

origami.onMouseDown = function(event) {
	let nearest = origami.nearest(event);
	RabbitEar.fold.graph.add_vertex_on_edge(cp, event.x, event.y, nearest.crease);
	origami.cp = cp;
}

