minPath = new OrigamiPaper("canvas-minimum-path").setPadding(0.05).load("../files/svg/crane.svg", function(cp){
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
		new this.scope.Path({segments:polyline.nodes,closed:false,strokeColor:{gray:0.0},strokeWidth:0.01 });
	},this)
	polylines.forEach(function(polyline, i){
		var path = new this.scope.Path({segments: polyline.nodes, closed: false, strokeWidth: 0.02 });
		path.smooth({ type: 'catmull-rom', factor: 0.01 });
		if(i == 0){ path.strokeColor = {hue:205.2, saturation:0.74, brightness:0.61}; }
		else { path.strokeColor = {hue:14.4, saturation:0.87, brightness:0.9 }; }
	},this)
}
