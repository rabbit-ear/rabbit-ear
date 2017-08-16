
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
			this.cp.creaseRay(new XYPoint(0.5, 0.5), new XYPoint(Math.cos(angle), Math.sin(angle))).mountain();
		}
		this.cp.clean();
		centerNode = this.cp.getNearestNode(0.5, 0.5);
		interiorAngles = centerNode.interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i].angle < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);

	this.initialize();
}
ffSingle.reset();

ffSingle.rebuild = function(){
	// make 3 fan lines with a good sized interior angle between them
	var centerNode;
	do{
		this.cp.clear();
		this.cp.nodes = [];
		this.cp.edges = [];
		for(var i = 0; i < 3; i++){
			var angle = this.angles[i];  //small difference here
			this.cp.creaseRay(new XYPoint(0.5, 0.5), new XYPoint(Math.cos(angle), Math.sin(angle))).mountain();
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
	// for(var i = 0; i < this.cp.edges.length; i++){ this.cp.edges[i].mark(); }
	var angle = this.cp.getNearestInteriorAngle(event.point.x, event.point.y);
	if(angle == undefined || angle.edges == undefined) return;

	// angle.edges[0].mountain();
	// angle.edges[1].valley();

	if(angle.edges.length == 2){
		var newAngle = this.cp.findFlatFoldable(angle);
		this.cp.creaseRay(new XYPoint(angle.node.x, angle.node.y), new XYPoint(Math.cos(newAngle), Math.sin(newAngle))).valley();
	}
	this.cp.clean();
	this.initialize();

	var centerNode = this.cp.getNearestNode(0.5, 0.5);
}
