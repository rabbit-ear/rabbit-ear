
var sJoint = new OrigamiPaper("canvas-single-joint");
sJoint.setPadding(0.05);

sJoint.reset = function(){
	paper = this.scope; 
	var interiorAngles;
	var centerNode;
	// make 3 fan lines with a good sized interior angle between them
	do{
		sJoint.cp.clear();
		sJoint.cp.nodes = [];
		sJoint.cp.edges = [];
		for(var i = 0; i < 3; i++){
			var angle = Math.random()*Math.PI*2;
			sJoint.cp.creaseRay(new XY(0.5, 0.5), new XY(Math.cos(angle), Math.sin(angle))).mountain();
		}
		sJoint.cp.clean();
		centerNode = sJoint.cp.getNearestNode(0.5, 0.5);
		interiorAngles = centerNode.interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i].angle() < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);

	var angles = [];
	for(var i = 0; i < interiorAngles.length; i++){
		angles.push(cp.findFlatFoldable(interiorAngles[i]));
	}

	for(var i = 0; i < angles.length; i++){
		var ray = sJoint.cp.creaseRay(centerNode, new XY(Math.cos(angles[i]), Math.sin(angles[i])) );
		sJoint.cp.clean();
		// 2 crease lines for every original fan line
		var commonNode = interiorAngles[i].edges[0].commonNodeWithEdge(interiorAngles[i].edges[1]);
		var center = new XY(commonNode.x, commonNode.y);
		var angle1 = interiorAngles[i].edges[0].absoluteAngle(commonNode);
		var angle2 = interiorAngles[i].edges[1].absoluteAngle(commonNode);
		var dir = ray.absoluteAngle(commonNode);
		var l = 0.2;
		sJoint.cp.creaseRay(new XY(center.x + l*Math.cos(dir), center.y + l*Math.sin(dir)), 
		                     new XY(Math.cos(angle1), Math.sin(angle1)) ).valley();
		sJoint.cp.creaseRay(new XY(center.x + l*Math.cos(dir), center.y + l*Math.sin(dir)), 
		                     new XY(Math.cos(angle2), Math.sin(angle2)) ).valley();
	}
	sJoint.cp.clean();
	var newAdj = centerNode.adjacentEdges();
	// set the fan angle bisectors to valley
	for(var i = 0; i < newAdj.length; i++){
		if(newAdj[i].orientation === undefined){ newAdj[i].valley(); }
	}
	// remove extra marks
	for(var i = sJoint.cp.edges.length-1; i >= 0; i--){
		if(sJoint.cp.edges[i].orientation === CreaseDirection.mark){ 
			sJoint.cp.removeEdge(sJoint.cp.edges[i]); 
		}
	}

	sJoint.draw();
}
sJoint.reset();

sJoint.onFrame = function(event) { }
sJoint.onResize = function(event) { }
sJoint.onMouseDown = function(event){ 
	sJoint.reset();
}
sJoint.onMouseUp = function(event){ }
sJoint.onMouseMove = function(event) { }
