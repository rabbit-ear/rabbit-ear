
var ffSingle = new PaperCreasePattern("canvas-flat-foldable-single");
ffSingle.masterCP = new CreasePattern();

ffSingle.rebuild = function(){
	this.cp = this.masterCP.duplicate();
	this.cp.clean();
	this.initialize();
}

ffSingle.reset = function(){
	// make 3 fan lines with a good sized interior angle between them
	var center = new XYPoint(0.5, 0.5);
	do{
		this.masterCP.clear();
		this.masterCP.nodes = [];
		this.masterCP.edges = [];
		for(var i = 0; i < 3; i++){
			var angle = Math.random()*Math.PI*2;
			this.masterCP.creaseRay(center, new XYPoint(Math.cos(angle), Math.sin(angle))).mountain();
		}
		this.masterCP.clean();
		var centerNode = this.masterCP.getNearestNode(0.5, 0.5);
		interiorAngles = centerNode.interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i].angle < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);
	this.masterCP.clean();
	this.rebuild();
}
ffSingle.reset();

ffSingle.onFrame = function(event) { }
ffSingle.onResize = function(event) { }
ffSingle.onMouseDown = function(event){
	this.reset();
}
ffSingle.onMouseUp = function(event){ }
ffSingle.onMouseMove = function(event) {
	this.rebuild();
	var angle = this.cp.getNearestInteriorAngle(event.point.x, event.point.y);
	if(angle == undefined || angle.edges == undefined) return;
	if(angle.edges.length == 2){
		var newAngle = this.cp.findFlatFoldable(angle);
		this.cp.creaseRay(new XYPoint(angle.node.x, angle.node.y), 
		                  new XYPoint(Math.cos(newAngle), Math.sin(newAngle))).valley();
	}
	this.cp.clean();
	this.initialize();
}
