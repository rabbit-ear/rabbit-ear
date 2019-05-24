
let origami = RE.Origami("origami", {padding:0.1});
origami.arrowLayer = origami.group();
origami.vertices.visible = true;
origami.touchHistory = []; 
origami.mode = "mode-axiom-3";

origami.onMouseMove = function(mouse) {
	let nearest = origami.nearest(mouse);
	origami.vertices
		.map(a => a.svg)
		.filter(a => a!=null)
		.forEach(circle => circle.style = "");
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
	if (origami.mode === "mode-flip-crease") {
		origami.touchHistory[0].edge.flip();
	}
	if (origami.mode === "mode-remove-crease") {
		// let edges = [origami.touchHistory[0].edge.index];
		// console.log(edges);
		let edgeIndex = origami.touchHistory[0].edge.index;
		let edge_vertices = origami.cp.edges_vertices[edgeIndex];
		let edge_assignment = origami.cp.edges_assignment[edgeIndex];
		if (edge_assignment === "B" || edge_assignment === "b") {
			return ;
		}
		RE.core.remove_edges(origami.cp, [edgeIndex]);
		let collinear = RE.core.vertex_is_collinear(origami.cp, edge_vertices);
		RE.core.remove_collinear_vertices(origami.cp, collinear);
		delete origami.cp.edges_length;
		delete origami.cp.edges_faces;
		delete origami.cp.faces_vertices;
		delete origami.cp.faces_edges;
		delete origami.cp.vertices_faces;
		delete origami.cp.vertices_edges;
		delete origami.cp.vertices_vertices;

		RE.core.clean(origami.cp);
	}	
	// axiom fold
	if (origami.mode.substring(0,11) === "mode-axiom-") {
		if (origami.touchHistory.length < 2) { return; }
		let axiom = parseInt(origami.mode.substring(11,12));
		// console.log(origami.touchHistory[0], origami.touchHistory[1]);
		let creases;
		switch (axiom) {
			case 1:
			case 2: creases = [RE.axiom(axiom, origami.touchHistory[0].vertex,
				 origami.touchHistory[1].vertex)];
				break;
			case 3: creases = RE.axiom(axiom,
				origami.touchHistory[0].edge.point,
				origami.touchHistory[0].edge.vector,
				origami.touchHistory[1].edge.point,
				origami.touchHistory[1].edge.vector);
				break;
			case 4: creases = [RE.axiom(axiom,
				origami.touchHistory[0].edge.point,
				origami.touchHistory[0].edge.vector,
				origami.touchHistory[1].edge.point)];
				break;
		}
		creases.forEach(c => origami.crease(c).valley());
	}
	// cleanup
	origami.touchHistory = [];
	origami.arrowLayer.removeChildren();
	origami.draw();
}

origami.decorate = function(nearest) {
	if (origami.touchHistory.length === 0) { return; }
	// do stuff
	origami.arrowLayer.removeChildren();
	if (nearest.vertex.index === origami.touchHistory[0].vertex.index) {
		return;
	}
	origami.arrowLayer.arcArrow(
		origami.touchHistory[0].vertex,
		nearest.vertex,
		{color:"#e53"}
	);
}

window.onload = function() {
	document.querySelectorAll("[id^=mode]").forEach(b => b.onclick = function(){
		origami.mode = b.id;
		document.querySelectorAll("[id^=mode]")
			.forEach(b => b.className = "button");
		b.className = "button button-red";
	});

	document.querySelectorAll("[id^=switch-origami]")
		.forEach(b => b.onclick = function(){
			let path = b.id.substring(15).split("-");
			origami[path[0]][path[1]] = !origami[path[0]][path[1]];
			origami.draw();
			event.target.className = origami[path[0]][path[1]]
				? "button button-red" : "button";
		});
}
