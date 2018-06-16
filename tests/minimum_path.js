minPath = new OrigamiPaper("canvas-minimum-path").load("../files/svg/crane.svg", function(cp){
	minPath.reset(cp);
});
minPath.show.boundary = false;

minPath.reset = function(minCP){
	paper = this.scope;
	var polylines = minCP.polylines();
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.draw();
	polylines.forEach(function(polyline, i){
		polyline.edges().forEach(function(edge){
			var path = new this.scope.Path({segments: edge.nodes, closed: false });
			path.strokeWidth = 0.01;
			path.strokeColor = {hue:360*i/polylines.length, saturation:0.85, lightness: 0.6};
		},this);
	},this)
}
