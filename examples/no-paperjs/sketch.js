
// var cp = new CreasePattern();
// cp.frogBase();
// var origami = new OrigamiPaper(cp);

var origami = new OrigamiPaper();
// origami.load("crane.svg");
// origami.load("kraft-snowflake-i2.svg");
origami.load("all-shapes.svg");



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

