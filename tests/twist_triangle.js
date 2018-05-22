
var twistTriangle = new OrigamiPaper("canvas-twist-triangle");

twistTriangle.reset = function(){
	paper = this.scope; 
	var sectors;
	var centerNode;
	// make 3 fan lines with a good sized interior angle between them
	var angles = [];
	do{
		angles = [Math.random()*Math.PI*2];
		angles.push(angles[0] - Math.PI*0.5 - Math.random()*Math.PI*0.5);
		angles.push(angles[1] - Math.PI*0.5 - Math.random()*Math.PI*0.5);
	}while(!angles
		.map(function(angle,i){
			var nextAngle = angles[ (i+1)%angles.length ];
			return clockwiseInteriorAngleRadians(angle, nextAngle);
		},this)
		.map(function(interior){ return interior > Math.PI*0.6; })
		.reduce(function(prev, curr){return prev && curr;},true)
	);
	var vectors = angles.map(function(angle){return new XY(Math.cos(angle), Math.sin(angle));},this);

	// crease vectors
	vectors.map(function(vector){ return new Ray(new XY(0.5, 0.5), vector); },this)
		.map(function(ray){ return this.cp.crease(ray); },this)
		.filter(function(crease){return crease != undefined;},this)
		.forEach(function(crease){ crease.mountain(); },this);

	this.cp.clean();
	centerNode = this.cp.nearest(0.5, 0.5).node;
	sectors = centerNode.junction().sectors;

	var vectors = sectors.map(function(el){ return centerNode.junction().kawasakiFourth(el); });

	var newTriNodes = [];

	this.cp.clean();

	for(var i = 0; i < vectors.length; i++){
		var ray = this.cp.creaseRay(centerNode, vectors[i]);
		// 2 crease lines for every original fan line
		var commonNode = sectors[i].edges[0].commonNodeWithEdge(sectors[i].edges[1]);
		var center = new XY(commonNode.x, commonNode.y);
		var vec1 = sectors[i].edges[0].vector(commonNode);
		var vec2 = vec1.rotate180();
		var l = 0.2;
		var newSpot = new XY(center.x+l*vectors[i].x,center.y+l*vectors[i].y);
		this.cp.creaseRay(new Ray(newSpot, vec1)).valley();
		var e = this.cp.creaseRayUntilIntersection(new Ray(newSpot, vec2));//.valley();
		if( newSpot.equivalent(e.nodes[0]) ){ newTriNodes.push(e.nodes[1]); }
		if( newSpot.equivalent(e.nodes[1]) ){ newTriNodes.push(e.nodes[0]); }
	}
	// this.cp.edges.forEach(function(edge){
	// 	if(edge.orientation != CreaseDirection.mountain && 
	// 	   edge.orientation != CreaseDirection.valley){
	// 		this.cp.removeEdge(edge);
	// 	}
	// },this);
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
