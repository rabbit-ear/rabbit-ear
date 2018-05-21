
var sJoint = new OrigamiPaper("canvas-single-joint");
sJoint.setPadding(0.05);

sJoint.reset = function(){
	paper = this.scope; 
	var sectors;
	var centerNode;
	// make 3 fan lines with a good sized interior angle between them
	do{
		this.cp.clear();
		this.cp.nodes = [];
		this.cp.edges = [];
		for(var i = 0; i < 3; i++){
			var angle = Math.random()*Math.PI*2;
			this.cp.creaseRay(new XY(0.5, 0.5), new XY(Math.cos(angle), Math.sin(angle))).mountain();
		}
		this.cp.clean();
		centerNode = this.cp.nearest(0.5, 0.5).node;
		sectors = centerNode.junction().sectors;
		var tooSmall = false;
		for(var i = 0; i < sectors.length; i++){ if(sectors[i].angle() < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);

	var vectors = [];
	for(var i = 0; i < sectors.length; i++){
		var solution = centerNode.junction().kawasakiFourth(sectors[i]);
		vectors.push(solution);
	}

	for(var i = 0; i < vectors.length; i++){
		var ray = this.cp.creaseRay(centerNode, vectors[i]);
		this.cp.clean();
		// 2 crease lines for every original fan line
		var commonNode = sectors[i].edges[0].commonNodeWithEdge(sectors[i].edges[1]);
		var center = new XY(commonNode.x, commonNode.y);
		var vec1 = sectors[i].edges[0].vector(commonNode);
		var vec2 = sectors[i].edges[1].vector(commonNode);
		var dir = ray.vector(commonNode);
		var l = 0.2;
		this.cp.creaseRay(new XY(center.x + l*Math.cos(dir), center.y + l*Math.sin(dir)), vec1);//.valley();
		this.cp.creaseRay(new XY(center.x + l*Math.cos(dir), center.y + l*Math.sin(dir)), vec2);//.valley();
	}
	this.cp.clean();
	var newAdj = centerNode.adjacentEdges();
	// set the fan angle bisectors to valley
	for(var i = 0; i < newAdj.length; i++){
		if(newAdj[i].orientation === undefined){ newAdj[i].valley(); }
	}
	// remove extra marks
	// for(var i = this.cp.edges.length-1; i >= 0; i--){
	// 	if(this.cp.edges[i].orientation === CreaseDirection.mark){ 
	// 		this.cp.removeEdge(this.cp.edges[i]); 
	// 	}
	// }

	this.draw();
}
sJoint.reset();

sJoint.onFrame = function(event){ }
sJoint.onResize = function(event){ }
sJoint.onMouseDown = function(event){ 
	sJoint.reset();
}
sJoint.onMouseUp = function(event){ }
sJoint.onMouseMove = function(event){ }
