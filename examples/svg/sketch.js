
// var cp = new CreasePattern();
// cp.frogBase();
// var origami = new OrigamiPaper(cp);

var origami = RabbitEar.Origami();
// origami.style.node.radius = 0.005;

// origami.load("../../files/svg/crane.svg");
origami.load("all-shapes.svg");
// origami.load("rects.svg");

// var svg = document.getElementById('mysvg');
// var NS = svg.getAttribute('xmlns');

origami.onMouseMove = function(event){
	// this.update();
	var nearest = origami.nearest(event);
	console.log(nearest);
	// if (nearest.edge != null){
	// 	var svgEdge = document.getElementById("edge-" + nearest.edge.index);
	// 	if(svgEdge != null){
	// 		svgEdge.setAttributeNS(null, 'class', 'stroke-yellow');
	// 	}
	// }

	// this.addClass(this.get(nearest.node), 'fill-yellow');
	// // this.addClass(this.get(nearest.edge), 'stroke-yellow');
	// this.addClass(this.get(nearest.face), 'fill-red');
	// this.addClass(this.get(nearest.sector), 'fill-yellow');
}

origami.onMouseDown = function(event){
	console.log("on mouse down ", event.point);
}

origami.onFrame = function(event){
	// console.log(this.mouse);
	// console.log("on frame ", event);
}

