var origami = RabbitEar.Origami();

// origami.load("../../files/svg/crane.svg");
origami.load("all-shapes.svg");

origami.onMouseMove = function(event){
	origami.draw();
	var nearest = origami.nearest(event);
	if(nearest.vertex) { origami.addClass(nearest.vertex.svg, 'fill-yellow'); }
	if(nearest.edge) { origami.addClass(nearest.edge.svg, 'stroke-yellow'); }
	if(nearest.face) { origami.addClass(nearest.face.svg, 'fill-red'); }
}
