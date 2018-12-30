// example
// mouse hover over nodes, faces, edges, sectors to highlight them
var origami = new RabbitEar.Origami(RabbitEar.bases.frog);

origami.onMouseMove = function(event){
	// update returns all components back to their original color
	origami.draw();
	// now we set the colors of the components we want

	// get all the nearest components to the cursor
	var nearest = origami.nearest(event);
	console.log(nearest);

	// get() gives us the SVG element that corresponds to the crease pattern data component
	if(nearest.vertex) { origami.addClass(nearest.vertex, 'fill-yellow'); }
	if(nearest.face) { origami.addClass(nearest.face, 'fill-red'); }
	// origami.addClass(origami.get(nearest.node), 'fill-dark-blue');
	// origami.addClass(origami.get(nearest.edge), 'stroke-yellow');
	// origami.addClass(origami.get(nearest.face), 'fill-red');
	// origami.addClass(origami.get(nearest.sector), 'fill-blue');
}
