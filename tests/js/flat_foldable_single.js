
var ffSingle = new PaperCreasePattern("canvas-flat-foldable-single");
// ffSingle.zoomToFit(0.05);
ffSingle.cp = new CreasePattern();

ffSingle.reset = function(){

	// make 3 fan lines with a good sized interior angle between them
	do{
		this.cp.clear();
		this.cp.nodes = [];
		this.cp.edges = [];
		this.angles = [];
	
		for(var i = 0; i < 3; i++){
			var angle = Math.random()*Math.PI*2;
			this.angles[i] = angle;
			this.cp.creaseRay(new XYPoint(0.5, 0.5), new XYPoint(Math.cos(angle), Math.sin(angle))).valley();
		}
		this.cp.clean();
		centerNode = this.cp.getNearestNode(0.5, 0.5);
		interiorAngles = centerNode.interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i].angle < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);

	this.initialize();
	// console.log("flatFoldable: " + centerNode.flatFoldable());
	console.log(centerNode.kawasaki());
}
ffSingle.reset();

ffSingle.rebuild = function(){
	// make 3 fan lines with a good sized interior angle between them
	do{
		this.cp.clear();
		this.cp.nodes = [];
		this.cp.edges = [];
		for(var i = 0; i < 3; i++){
			var angle = this.angles[i];  //small difference here
			this.cp.creaseRay(new XYPoint(0.5, 0.5), new XYPoint(Math.cos(angle), Math.sin(angle))).valley();
		}
		this.cp.clean();
		centerNode = this.cp.getNearestNode(0.5, 0.5);
		interiorAngles = centerNode.interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i].angle < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);
	this.cp.clean();

}

ffSingle.onFrame = function(event) { }
ffSingle.onResize = function(event) { }
ffSingle.onMouseDown = function(event){
	// console.log(event);
	this.reset();
	// console.log(edges);
}
ffSingle.onMouseUp = function(event){ }
ffSingle.onMouseMove = function(event) {
	this.rebuild();
	for(var i = 0; i < this.cp.edges.length; i++){ this.cp.edges[i].mark(); }
	var angle = this.cp.getNearestInteriorAngle(event.point.x, event.point.y);
	if(angle == undefined || angle.edges == undefined) return;

	// console.log(angle);
	
	angle.edges[0].mountain();
	angle.edges[1].valley();

	// var edges = this.cp.getNearestEdges(event.point.x, event.point.y, 2);
	// if(edges.length && edges[0] != undefined) edges[0].edge.mountain();
	// if(edges.length && edges[1] != undefined) edges[1].edge.valley();
	// if(edges.length == 2){
	// 	var centerNode = this.cp.getNearestNode(0.5, 0.5);
	// 	var angle0 = edges[0].edge.absoluteAngle(centerNode);
	// 	var angle1 = edges[1].edge.absoluteAngle(centerNode);
	// 	var interior;
	// 	if(clockwiseAngleFrom(angle0, angle1) < clockwiseAngleFrom(angle1, angle0)){
	// 		interior = new InteriorAngle(edges[1].edge, edges[0].edge);
	// 	} else{
	// 		interior = new InteriorAngle(edges[0].edge, edges[1].edge);
	// 	}
	// 	var newAngle = this.cp.findFlatFoldable(interior);
	// 	this.cp.creaseRay(new XYPoint(interior.node.x, interior.node.y), new XYPoint(Math.cos(newAngle), Math.sin(newAngle))).mark();
	// }
	// this.cp.clean();
	this.initialize();
}
