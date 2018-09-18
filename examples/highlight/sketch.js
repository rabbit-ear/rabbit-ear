// example
// mouse hover over nodes, faces, edges, sectors to highlight them
var cp = new CreasePattern().frogBase();
var origami = new OrigamiPaper(cp);

origami.onMouseMove = function(event){
	// update returns all components back to their original color
	this.update();
	// now we set the colors of the components we want

	// get all the nearest components to the cursor
	var nearest = this.cp.nearest(event.point);

	// get() gives us the SVG element that corresponds to the crease pattern data component
	this.addClass(this.get(nearest.node), 'fill-dark-blue');
	this.addClass(this.get(nearest.edge), 'stroke-yellow');
	this.addClass(this.get(nearest.face), 'fill-red');
	this.addClass(this.get(nearest.sector), 'fill-blue');
}
