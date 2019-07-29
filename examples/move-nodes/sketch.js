// example
// split screen: crease pattern and folded form

var div = document.getElementsByClassName('row')[0];
var origami = RabbitEar.Origami(div, RabbitEar.bases.frog);
var folded = RabbitEar.Origami(div, origami.cp);

origami.onMouseMove = function(event) {
	origami.draw();

	let nearest = origami.nearest(event);

	if(nearest.vertex) { origami.addClass(nearest.vertex.svg, 'fill-yellow'); }
	if(nearest.edge) { origami.addClass(nearest.edge.svg, 'stroke-yellow'); }
	if(nearest.face) { origami.addClass(nearest.face.svg, 'fill-red'); }

	if(origami.selected){
		origami.cp.vertices_coords[origami.selected.index] = [event.x, event.y];
		origami.draw();
		folded.cp = JSON.parse(JSON.stringify(origami.cp));
		folded.fold();
	}
}
origami.onMouseDown = function(event) {
	origami.selected = origami.nearest(event).vertex;
}
origami.onMouseUp = function() {
	origami.selected = undefined;
}
