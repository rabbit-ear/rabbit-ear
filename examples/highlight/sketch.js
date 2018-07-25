// example
// mouse hover over nodes, faces, edges, sectors to highlight them
var cp = new CreasePattern().frogBase();
var origami = new OrigamiPaper("canvas-cp", cp);

// by default only edges are shown
origami.show.nodes = true;
origami.show.faces = true;
origami.show.sectors = true;

// set all fill colors transparent, only turn on each one upon hover
origami.style.node.fillColor = {alpha:0.0};
origami.style.face.fillColor = {alpha:0.0};
origami.style.sector.fillColors = [{alpha:0.0}, {alpha:0.0}];

// this is required if new components are shown. they didn't yet exist on the canvas
// (todo: this is hard to remember and shouldn't be required. need a work-around)
origami.draw();

origami.onMouseMove = function(event){
	// update() returns all crease lines back to their original color
	origami.update();

	// get the nearest parts of the crease pattern to the mouse point
	var nearest = cp.nearest(event.point);

	// get() will return the paperjs object (line, polygon) that reflects the data model object
	// this paperjs object is what we style
	origami.get(nearest.node).fillColor = this.styles.byrne.darkBlue;
	origami.get(nearest.edge).strokeColor = this.styles.byrne.yellow;
	origami.get(nearest.face).fillColor = this.styles.byrne.red;
	origami.get(nearest.sector).fillColor = this.styles.byrne.blue;
}
