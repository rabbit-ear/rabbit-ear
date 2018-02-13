var flat_foldable_single_callback;

var ffSingle = new OrigamiPaper("canvas-flat-foldable-single");
ffSingle.setPadding(0.05);
ffSingle.masterCP = new CreasePattern();

ffSingle.rebuild = function(){
	this.cp = this.masterCP.copy();
	this.cp.clean();
	this.draw();
}

ffSingle.reset = function(){
	paper = this.scope; 
	// make 3 fan lines with a good sized interior angle between them
	var center = new XY(0.5, 0.5);
	do{
		this.masterCP.clear();
		this.masterCP.nodes = [];
		this.masterCP.edges = [];
		for(var i = 0; i < 3; i++){
			var angle = Math.random()*Math.PI*2;
			this.masterCP.creaseRay(center, new XY(Math.cos(angle), Math.sin(angle))).valley();
		}
		this.masterCP.clean();
		var centerNode = this.masterCP.getNearestNode(0.5, 0.5);
		interiorAngles = centerNode.junction().interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i] < Math.PI*0.5) tooSmall = true; }
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
	var solutionAngle = undefined;
	var angle = undefined;
	if(event.point.x >= 0 && event.point.x <= 1 && event.point.y >= 0 && event.point.y <= 1){
		angle = this.cp.getNearestInteriorAngle(event.point.x, event.point.y);
		console.log(angle);
		if(angle == undefined || angle.edges == undefined) return;
		if(angle.edges.length == 2){
			solutionAngle = angle.creaseFlatFoldable();
			this.cp.creaseRay(new XY(angle.node.x, angle.node.y), 
			                  new XY(Math.cos(solutionAngle), Math.sin(solutionAngle))).mountain();
		}
	}
	this.cp.clean();
	this.draw();
	// for(var i = 0; i < this.edges.length; i++){ this.edges[i].strokeWidth = 0.01; }
	// if(angle != undefined && angle.edges != undefined){
	// 	for(var i = 0; i < angle.edges.length; i++){
	// 		this.edges[ angle.edges[i].index ].strokeWidth = 0.01333;
	// 	}
	// }
	if(flat_foldable_single_callback != undefined){
		flat_foldable_single_callback({'flatFoldable':this.cp.getNearestNode(0.5, 0.5).flatFoldable(), 'solution':solutionAngle, 'angle':angle});
	}
}
