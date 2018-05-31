var intersectCollinear = new OrigamiPaper("canvas-intersect-collinear");
intersectCollinear.show.boundary = false;

intersectCollinear.reset = function(){
	paper = this.scope;
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	var first = this.cp.crease(Math.random(), Math.random(), Math.random(), Math.random());
	var pt = first.nodes[0].copy().lerp(first.nodes[1], Math.random());
	var second = this.cp.crease(pt, new XY(Math.random(), Math.random()));
	var intersect = first.intersection(second, 0.001);
	this.draw();
	this.faceLayer.activate();
	if(intersect != undefined){
		new this.scope.Shape.Circle({ 
			position: intersect.point,
			radius:0.02,
			fillColor:this.styles.byrne.red,
		});
	}
}
intersectCollinear.reset();

intersectCollinear.onMouseDown = function(event){
	this.reset();
}