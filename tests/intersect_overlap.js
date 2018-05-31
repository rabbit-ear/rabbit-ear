var intersectOverlap = new OrigamiPaper("canvas-intersect-overlap");
intersectOverlap.show.boundary = false;
intersectOverlap.style.mountain.strokeColor = {gray:0.0};

intersectOverlap.reset = function(){
	paper = this.scope;
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	var crease1 = this.cp.crease(Math.random(), Math.random(), Math.random(), Math.random()).mountain();
	var pt1 = crease1.nodes[0].copy().lerp(crease1.nodes[1], Math.random());
	var pt2 = crease1.nodes[0].copy().lerp(crease1.nodes[1], 1.0 + Math.random());
	var crease2 = this.cp.crease(pt1, pt2).valley();
	console.log("parallel " + crease1.parallel(crease2));
	console.log("intersect " + crease1.intersection(crease2));
	var report = this.cp.fragment();
	console.log(report);
	this.draw();
	// this.faceLayer.activate();
	// if(intersect != undefined){
	// 	new this.scope.Shape.Circle({ 
	// 		position: intersect.point,
	// 		radius:0.02,
	// 		fillColor:this.styles.byrne.red,
	// 	});
	// }
}
intersectOverlap.reset();

intersectOverlap.onMouseDown = function(event){
	this.reset();
}
intersectOverlap.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	this.updateStyles();
	if(nearest.edge !== undefined){
		// this.edges[nearest.edge.index].strokeColor = this.styles.byrne.yellow;
		this.edges[nearest.edge.index].bringToFront();
	}
}
