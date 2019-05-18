let origami = RE.Origami("origami", {padding:0.1});
origami.arrowLayer = origami.group();
origami.vertices.visible = true;
origami.touchHistory = []; 

origami.onMouseMove = function(mouse) {
	let nearest = origami.nearest(mouse);
	origami.vertices.map(a => a.svg).forEach(circle => circle.style = "");
	origami.edges.map(a => a.svg).forEach(line => line.style = "");
	// origami.faces.map(a => a.svg).forEach(poly => poly.style = "");
	origami.touchHistory.forEach(near => {
		if (near.vertex) { near.vertex.svg.style = "fill:#e53;stroke:#e53"; }
		if (near.edge) { near.edge.svg.style = "stroke:#e53"; }
	})
	if (nearest.vertex) { nearest.vertex.svg.style = "fill:#ec3;stroke:#ec3"; }
	if (nearest.edge) { nearest.edge.svg.style = "stroke:#ec3"; }
	// if (nearest.face) { nearest.face.svg.style = "fill:#ec3"; }
	origami.decorate(nearest);
}

origami.onMouseDown = function(mouse) {
	origami.touchHistory.push(origami.nearest(mouse));
	origami.perform();
}

origami.perform = function() {
	if (origami.touchHistory.length < 2) { return; }
	// do stuff
	let c = RE.axiom(2, origami.touchHistory[0].vertex, origami.touchHistory[1].vertex);
	origami.crease(c).valley();
	// cleanup
	origami.touchHistory = [];
	origami.arrowLayer.removeChildren();
	origami.draw();
}

origami.decorate = function(nearest) {
	if (origami.touchHistory.length === 0) { return; }
	// do stuff
	origami.arrowLayer.removeChildren();
	if (nearest.vertex.index === origami.touchHistory[0].vertex.index) { return; }
	origami.arrowLayer.arcArrow(
		origami.touchHistory[0].vertex,
		nearest.vertex,
		{color:"#e53"}
	);
}