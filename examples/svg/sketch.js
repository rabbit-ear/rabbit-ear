
// var cp = new CreasePattern();
// cp.frogBase();
// var origami = new OrigamiPaper(cp);

var origami = new OrigamiPaper();
origami.style.node.radius = 0.005;

// origami.load("../../files/svg/crane.svg");
origami.load("all-shapes.svg");
// origami.load("rects.svg");

// var svg = document.getElementById('mysvg');
// var NS = svg.getAttribute('xmlns');

origami.onMouseMove = function(point){
	this.update();
	var edge = this.cp.nearest(point).edge;
	if (edge != undefined){
		var svgEdge = document.getElementById("edge-" + edge.index);
		if(svgEdge != undefined){
			svgEdge.setAttributeNS(null, 'class', 'stroke-yellow');
		}
	}
}

origami.onMouseDown = function(point){
	console.log("on mouse down ", point);
}

origami.onFrame = function(event){
	console.log(this.mouse);
	// console.log("on frame ", event);
}

