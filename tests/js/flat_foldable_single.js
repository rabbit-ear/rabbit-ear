
var ffSingle = new PaperCreasePattern("canvas-flat-foldable-single");
// ffSingle.zoomToFit(0.05);

ffSingle.reset = function(){
	ffSingle.cp.clear();
	// make 3 fan lines with a good sized interior angle between them
	do{
		ffSingle.cp.clear();
		ffSingle.cp.nodes = [];
		ffSingle.cp.edges = [];
		for(var i = 0; i < 3; i++){
			var angle = Math.random()*Math.PI*2;
			ffSingle.cp.creaseRay(new XYPoint(0.5, 0.5), new XYPoint(Math.cos(angle), Math.sin(angle))).valley();
		}
		ffSingle.cp.clean();
		centerNode = ffSingle.cp.getNearestNode(0.5, 0.5);
		interiorAngles = centerNode.interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i].angle < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);

	var pAdjacent = centerNode.planarAdjacent();
	// pAdjacent[0].edge.valley();
	// pAdjacent[1].edge.valley();
	var interior = new InteriorAngle(pAdjacent[1].edge, pAdjacent[0].edge);
	var newAngle = ffSingle.cp.findFlatFoldable(interior);
	ffSingle.cp.creaseRay(new XYPoint(interior.node.x, interior.node.y), new XYPoint(Math.cos(newAngle), Math.sin(newAngle))).mountain();

	ffSingle.cp.clean();
	ffSingle.initialize();
	console.log("flatFoldable: " + centerNode.flatFoldable());
}
ffSingle.reset();

ffSingle.onFrame = function(event) { }
ffSingle.onResize = function(event) { }
ffSingle.onMouseDown = function(event){
	ffSingle.reset();
}
ffSingle.onMouseUp = function(event){ }
ffSingle.onMouseMove = function(event) { }
