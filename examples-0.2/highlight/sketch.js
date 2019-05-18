// example
// mouse hover over vertices, edges, faces to highlight them

// todo: bring back sectors

var origami = RabbitEar.Origami({padding:0.05});
origami.vertices.visible = true;
origami.load("../../files/fold/crane.fold");

origami.onMouseMove = function(event) {

	origami.vertices.forEach(v => v.svg.style = "");
	origami.edges.forEach(e => e.svg.style = "");
	origami.faces.forEach(f => f.svg.style = "");

	// get all the nearest components to the cursor
	var nearest = origami.nearest(event);

	if (nearest.vertex) { nearest.vertex.svg.style = "fill:#357;stroke:#357"; }
	if (nearest.edge) { nearest.edge.svg.style = "stroke:#ec3"; }
	if (nearest.face) { nearest.face.svg.style = "fill:#e53"; }
}
