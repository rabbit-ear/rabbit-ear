// example
// mouse hover over nodes, faces, edges, sectors to highlight them
var origami = RabbitEar.Origami(RabbitEar.bases.fish, {folding:false});

origami.onMouseMove = function(event) {
	// update returns all components back to their original color
	origami.draw();
	origami.color(event);
}

origami.onMouseDown = function(event) {
	origami.nearest(event).crease.flip();
	origami.color(event);
}

origami.color = function(event) {
	// get all the nearest components to the cursor
	var nearest = origami.nearest(event);
	// console.log(nearest);

	if(nearest.vertex) { nearest.vertex.svg.addClass('fill-yellow'); }
	if(nearest.crease) { nearest.crease.svg.addClass('stroke-yellow'); }
	if(nearest.face) { nearest.face.svg.addClass('fill-red'); }
}
