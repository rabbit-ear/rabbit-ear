
var jointTri = new OrigamiPaper("canvas-joint-triangle");
jointTri.zoomToFit(0.05);
// jointTri.selectNearestEdge = true;

jointTri.reset = function(){
	var interiorAngles;
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
		centerNode = this.cp.getNearestNode(0.5, 0.5);
		interiorAngles = centerNode.interiorAngles();
		var tooSmall = false;
		for(var i = 0; i < interiorAngles.length; i++){ if(interiorAngles[i].angle < Math.PI*0.5) tooSmall = true; }
	} while(tooSmall);

	var angles = [];
	for(var i = 0; i < interiorAngles.length; i++){
		angles.push(cp.findFlatFoldable(interiorAngles[i]));
	}

	var newTriNodes = [];

	for(var i = 0; i < angles.length; i++){
		var ray = this.cp.creaseRay(centerNode, new XY(Math.cos(angles[i]), Math.sin(angles[i])) );
		this.cp.clean();
		// 2 crease lines for every original fan line
		var commonNode = interiorAngles[i].edges[0].commonNodeWithEdge(interiorAngles[i].edges[1]);
		var center = new XY(commonNode.x, commonNode.y);
		var angle1 = interiorAngles[i].edges[0].absoluteAngle(commonNode);
		var angle2 = interiorAngles[i].edges[1].absoluteAngle(commonNode);
		var dir = ray.absoluteAngle(commonNode);
		var l = 0.2;
		var newSpot = new XY(center.x+l*Math.cos(dir),center.y+l*Math.sin(dir));
		this.cp.creaseRayUntilIntersection(newSpot,
		                                       new XY(Math.cos(angle1), Math.sin(angle1)) ).valley();
		var e = this.cp.creaseRayUntilIntersection(newSpot,
		                                               new XY(Math.cos(angle1+Math.PI), 
		                                                           Math.sin(angle1+Math.PI)) ).valley();
		if( newSpot.equivalent(e.nodes[0]) ){ newTriNodes.push(e.nodes[1]); }
		if( newSpot.equivalent(e.nodes[1]) ){ newTriNodes.push(e.nodes[0]); }
	}
	this.cp.clean();

	var newAdj = centerNode.adjacentEdges();
	for(var i = newAdj.length-1; i >= 0; i--){
		this.cp.removeEdge(newAdj[i]);
	}

	for(var i = 0; i < newTriNodes.length; i++){
		var nextI = (i+1)%newTriNodes.length;
		this.cp.crease(newTriNodes[i], newTriNodes[nextI]).mountain();
	}

	this.cp.clean();

	// set the fan angle bisectors to valley
	// for(var i = 0; i < newAdj.length; i++){
	// 	if(newAdj[i].orientation === undefined){ newAdj[i].valley(); }
	// }
	// remove extra marks
	for(var i = jointTri.cp.edges.length-1; i >= 0; i--){
		if(jointTri.cp.edges[i].orientation === CreaseDirection.mark){ 
			jointTri.cp.removeEdge(jointTri.cp.edges[i]); 
		}
	}

	jointTri.initialize();
}
jointTri.reset();

jointTri.onFrame = function(event) { }
jointTri.onResize = function(event) { }
jointTri.onMouseDown = function(event){ 
	jointTri.reset();
}
jointTri.onMouseUp = function(event){ }
jointTri.onMouseMove = function(event) { }
