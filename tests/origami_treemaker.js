let origami = RabbitEar.Origami();
origami.drawLayer = origami.group();

origami.graph = RabbitEar.graph();
origami.newestNode = origami.graph.newNode({position: [0.5, 0.5]});

origami.redraw = function() {
	origami.draw();
	origami.drawLayer.removeChildren();
	origami.graph.nodes
		.map(n => origami.drawLayer.circle(n.position[0], n.position[1], 0.02))
		// .forEach(c => c.setAttribute("fill"))
	origami.graph.edges
		.map(e => e.nodes.map(n => n.position))
		.map(e => origami.drawLayer.line(e[0][0], e[0][1], e[1][0], e[1][1]))
		.forEach(line => {
			line.setAttribute("stroke-width", 0.01);
			line.setAttribute("stroke", "black");
		});
}
origami.redraw();

origami.onMouseDown = function(mouse) {
	let touchedNode = origami.graph.nodes
		.map(n => Math.sqrt(Math.pow(n.position[0] - mouse[0],2) + Math.pow(n.position[1] - mouse[1],2)))
		.map((d,i) => d < 0.03 ? i : undefined)
		.filter(el => el !== undefined)
		.shift();
	if (touchedNode != null) {
		origami.selected = origami.graph.nodes[touchedNode];
		origami.newestNode = origami.selected;
	} else {
		let newNode = origami.graph.newNode({position: mouse});
		origami.graph.newEdge(origami.newestNode, newNode);
		origami.newestNode = newNode;
		origami.selected = newNode;
	}
}

origami.onMouseMove = function(mouse) {
	if (origami.selected != null) {
		origami.selected.position = mouse;
		origami.redraw();
	}
}

origami.onMouseUp = function(mouse) {
	origami.selected = undefined;
}