
var ffSingle = new PaperCreasePattern("canvas-flat-foldable-single");
// ffSingle.zoomToFit(0.05);
ffSingle.cp = new CreasePattern();

ffSingle.reset = function(){

	// make 3 fan lines with a good sized interior angle between them
	do{
		ffSingle.cp.clear();
		ffSingle.cp.nodes = [];
		ffSingle.cp.edges = [];
		ffSingle.angles = [];
	
		for(var i = 0; i < 3; i++){
			var angle = Math.random()*Math.PI*2;
			ffSingle.angles[i] = angle;
			ffSingle.cp.creaseRay(new XYPoint(0.5, 0.5), new XYPoint(Math.cos(angle), Math.sin(angle))).valley();
		}
		ffSingle.cp.clean();
		centerNode = ffSingle.cp.getNearestNode(0.5, 0.5);
		interiorAngles = centerNode.interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i].angle < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);

	ffSingle.initialize();
	// console.log("flatFoldable: " + centerNode.flatFoldable());
	console.log(centerNode.kawasaki());
}
ffSingle.reset();


ffSingle.rebuild = function(){
	// make 3 fan lines with a good sized interior angle between them
	do{
		ffSingle.cp.clear();
		ffSingle.cp.nodes = [];
		ffSingle.cp.edges = [];
		for(var i = 0; i < 3; i++){
			var angle = ffSingle.angles[i];  //small difference here
			ffSingle.cp.creaseRay(new XYPoint(0.5, 0.5), new XYPoint(Math.cos(angle), Math.sin(angle))).valley();
		}
		ffSingle.cp.clean();
		centerNode = ffSingle.cp.getNearestNode(0.5, 0.5);
		interiorAngles = centerNode.interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i].angle < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);
	ffSingle.cp.clean();

}

ffSingle.onFrame = function(event) { }
ffSingle.onResize = function(event) { }
ffSingle.onMouseDown = function(event){
	// console.log(event);
	ffSingle.reset();
	// console.log(edges);
}
ffSingle.onMouseUp = function(event){ }
ffSingle.onMouseMove = function(event) {
	ffSingle.rebuild();

	for(var i = 0; i < ffSingle.cp.edges.length; i++){ ffSingle.cp.edges[i].mark(); }
	var edges = ffSingle.cp.getNearestEdges(event.point.x, event.point.y, 2);
	// for(var i = 0; i < edges.length; i++){
	// 	edges[i].edge.valley();
	// }
	// color the edges differently
	if(edges.length && edges[0] != undefined) edges[0].edge.mountain();
	if(edges.length && edges[1] != undefined) edges[1].edge.valley();

	if(edges.length == 2){
		var centerNode = ffSingle.cp.getNearestNode(0.5, 0.5);
		var angle0 = edges[0].edge.absoluteAngle(centerNode);
		var angle1 = edges[1].edge.absoluteAngle(centerNode);
		var interior;
		if(clockwiseAngleFrom(angle0, angle1) < clockwiseAngleFrom(angle1, angle0)){
			interior = new InteriorAngle(edges[1].edge, edges[0].edge);
		} else{
			interior = new InteriorAngle(edges[0].edge, edges[1].edge);
		}
		var newAngle = ffSingle.cp.findFlatFoldable(interior);
		ffSingle.cp.creaseRay(new XYPoint(interior.node.x, interior.node.y), new XYPoint(Math.cos(newAngle), Math.sin(newAngle))).mark();
	}
	ffSingle.cp.clean();
	ffSingle.initialize();
}
