// example
// mouse press to drag nodes around
var cp = new CreasePattern().frogBase();
var origami = new OrigamiPaper("canvas-cp", cp);
var folded = new OrigamiFold("canvas-folded", cp);

origami.show.nodes = true;
origami.show.boundary = false;
origami.style.node.fillColor = {alpha:0.0};
origami.style.node.radius = 0.02;
origami.draw();

origami.onMouseMove = function(event){
	origami.update();
	origami.nearest = origami.cp.nearest(event.point);
	origami.get(origami.nearest.node).fillColor = this.styles.byrne.yellow;
	if(origami.selected){
		origami.selected.x = event.point.x;
		origami.selected.y = event.point.y;
		folded.draw();
	}
}
origami.onMouseDown = function(event){ origami.selected = origami.nearest.node; }
origami.onMouseUp = function(){ origami.selected = undefined; }

document.getElementById("slider").oninput = function(event) {
	let value = document.getElementById("slider").value;
	document.getElementById("value").innerHTML = value;
}