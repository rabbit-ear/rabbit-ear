
var twistTriangle = new OrigamiPaper("canvas-twist-triangle");
twistTriangle.setPadding(0.05);
// twistTriangle.select.edge = true;

twistTriangle.reset = function(){
	paper = this.scope; 
	var sectors;
	var centerNode;
	// make 3 fan lines with a good sized interior angle between them
	// do{
		// this.cp.clear();
		// this.cp.nodes = [];
		// this.cp.edges = [];
		// for(var i = 0; i < 3; i++){
		// 	var angle = Math.random()*Math.PI*2;
		// 	this.cp.creaseRay(new XY(0.5, 0.5), new XY(Math.cos(angle), Math.sin(angle))).mountain();
		// }
		// this.cp.clean();
		// centerNode = this.cp.nearest(0.5, 0.5).node;
		// sectors = centerNode.sectors();
		// var tooSmall = false;
		// for(var i = 0; i < sectors.length; i++){ if(sectors[i].angle() < Math.PI*0.5) tooSmall = true; }
	// } while(tooSmall);

	// manual input
	var angle = [
		(360 - 345) * Math.PI / 180,
		(360 - 225) * Math.PI / 180,
		(360 - 120) * Math.PI / 180
	];
	this.cp.creaseRay(new XY(0.5, 0.5), new XY(Math.cos(angle[0]), Math.sin(angle[0]))).mountain();
	this.cp.creaseRay(new XY(0.5, 0.5), new XY(Math.cos(angle[1]), Math.sin(angle[1]))).mountain();
	this.cp.creaseRay(new XY(0.5, 0.5), new XY(Math.cos(angle[2]), Math.sin(angle[2]))).mountain();
	// flipped
	// this.cp.creaseRay(new XY(0.5, 0.5), new XY(-Math.cos(angle[0]), Math.sin(angle[0]))).mountain();
	// this.cp.creaseRay(new XY(0.5, 0.5), new XY(-Math.cos(angle[1]), Math.sin(angle[1]))).mountain();
	// this.cp.creaseRay(new XY(0.5, 0.5), new XY(-Math.cos(angle[2]), Math.sin(angle[2]))).mountain();


	this.cp.clean();
	centerNode = this.cp.nearest(0.5, 0.5).node;
	sectors = centerNode.junction().sectors;

	var vectors = sectors.map(function(el){ return centerNode.junction().kawasakiFourth(el); });

	var newTriNodes = [];

	for(var i = 0; i < vectors.length; i++){
		var ray = this.cp.creaseRay(centerNode, vectors[i]);
		this.cp.clean();
		// 2 crease lines for every original fan line
		var commonNode = sectors[i].edges[0].commonNodeWithEdge(sectors[i].edges[1]);
		var center = new XY(commonNode.x, commonNode.y);
		var vec1 = sectors[i].edges[0].vector(commonNode);
		var vec2 = vec1.rotate180();
		var dir = ray.vector(commonNode);
		var l = 0.2;
		var newSpot = new XY(center.x+l*Math.cos(dir),center.y+l*Math.sin(dir));
		this.cp.creaseRayUntilIntersection(new Ray(newSpot, vec1));//.valley();
		var e = this.cp.creaseRayUntilIntersection(new Ray(newSpot, vec2));//.valley();
		// if( newSpot.equivalent(e.nodes[0]) ){ newTriNodes.push(e.nodes[1]); }
		// if( newSpot.equivalent(e.nodes[1]) ){ newTriNodes.push(e.nodes[0]); }
	}
	this.cp.clean();

	var newAdj = centerNode.adjacentEdges();
	for(var i = newAdj.length-1; i >= 0; i--){
		// this.cp.removeEdge(newAdj[i]);
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
	// for(var i = twistTriangle.cp.edges.length-1; i >= 0; i--){
	// 	if(twistTriangle.cp.edges[i] !== undefined && twistTriangle.cp.edges[i].orientation === CreaseDirection.mark){ 
	// 		twistTriangle.cp.removeEdge(twistTriangle.cp.edges[i]); 
	// 	}
	// }

	twistTriangle.draw();
}

twistTriangle.reset();

twistTriangle.onFrame = function(event) { }
twistTriangle.onResize = function(event) { }
twistTriangle.onMouseDown = function(event){ 
	twistTriangle.reset();
}
twistTriangle.onMouseUp = function(event){ }
twistTriangle.onMouseMove = function(event) { }
