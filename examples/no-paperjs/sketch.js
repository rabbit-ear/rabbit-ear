
// var origami = new OrigamiPaper();
var cp = new CreasePattern();
cp.frogBase();
var origami = new OrigamiPaper(cp);

// var svg = document.getElementById('mysvg');
// var NS = svg.getAttribute('xmlns');

origami.onMouseMove = function(point){
	this.update();
	var edge = this.cp.nearest(point).edge;
	if (edge != undefined){
		var svgEdge = document.getElementById("edge-" + edge.index);
		if(svgEdge != undefined){
			svgEdge.setAttributeNS(null, 'class', 'highlighted');
		}
	}
}

origami.onMouseDown = function(point){
	console.log("on mouse down ", point);
}


origami.onFrame = function(event){
	// console.log("on frame ", event);
}

origami.load("crane.svg");