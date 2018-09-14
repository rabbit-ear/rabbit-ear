// example
// mouse hover over nodes, faces, edges, sectors to highlight them
var cp = new CreasePattern().frogBase();
var origami = new OrigamiPaper(cp);

origami.onMouseMove = function(event){
	// update returns all components back to their original color
	origami.update();
	// now we set the colors of the components we want

	// get all the nearest components to the cursor
	var nearest = origami.cp.nearest(event);

	// get() gives us the SVG element that corresponds to the crease pattern data component
	origami.get(nearest.node).setAttribute('class', 'fill-dark-blue');
	origami.get(nearest.edge).setAttribute('class', 'stroke-yellow');
	origami.get(nearest.face).setAttribute('class', 'fill-red');
	origami.get(nearest.sector).setAttribute('class', 'fill-blue');

}
