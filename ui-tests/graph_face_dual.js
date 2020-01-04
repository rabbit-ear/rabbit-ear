let faceDual = RabbitEar.Origami("canvas-face-dual");
faceDual.cp = RabbitEar.CreasePattern(RabbitEar.bases.frog);
faceDual.load("../files/fold/kraft-sea-turtle.fold", function(){
	faceDual.init();
});

faceDual.groups.vertex.setAttribute("opacity", 0);
// faceDual.groups.face.setAttribute("opacity", 0);

faceDual.init = function() {
	let graph = RabbitEar.Graph();

	faceDual.cp.faces
		.map(f => f.centroid)
		.map(center => graph.newNode({center}));

	RabbitEar.core.make_faces_faces(faceDual.cp).forEach((adj, f1) =>
		adj.forEach(f2 =>
			graph.newEdge(graph.nodes[f1], graph.nodes[f2])
		)
	);

	graph.nodes.map(n =>
		RabbitEar.svg.circle(n.center[0], n.center[1], 0.01)
	).forEach(circle => {
		circle.setAttribute("fill", "#e14929");
		faceDual.appendChild(circle)
	});

	graph.edges.map(e => RabbitEar.svg.line(
		e.nodes[0].center[0],
		e.nodes[0].center[1],
		e.nodes[1].center[0],
		e.nodes[1].center[1])
	).forEach(line => {
		line.setAttribute("stroke", "#e14929");
		line.setAttribute("stroke-width", 0.01);
		line.setAttribute("stroke-linecap", "round");
		faceDual.appendChild(line)
	});

	let faces_coloring = RabbitEar.core.make_faces_coloring(faceDual.cp, 0);

	let faces = faceDual.faces;
	faces_coloring
		.map(color => color ? "#224c72" : "#f1c14f")
		.forEach((color, i) => 
			faces[i].setAttribute("style", "fill:"+color)
		);

}
