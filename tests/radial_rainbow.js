var radial_rainbow_callback = undefined;

// var radialRay = new OrigamiPaper("canvas-radial-rainbow", new PlanarGraph());
var radialRay = new OrigamiPaper("canvas-radial-rainbow");
radialRay.setPadding(0.05);

radialRay.colorForAngle = function(angle){
	var color = angle / Math.PI * 180;
	while(color < 0){color += 360;}
	return {hue:color, saturation:1.0, brightness:0.9};
}

this.centerNode;

radialRay.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	var angle = 0;
	while(angle < Math.PI*2){
		var len = 0.4 + Math.random()*0.1;
		this.cp.newPlanarEdge(0.5, 0.5, 0.5+len*Math.cos(angle), 0.5+len*Math.sin(angle) );
		angle+= Math.random()*0.2 + 0.05;
	}
	this.cp.cleanDuplicateNodes();
	this.draw();
	this.select.edge = true;
	this.style.selectedEdge = { gray:0.0 };
	this.style.mark.strokeColor = { gray:0.0 };
	this.centerNode = this.cp.nearest(0.5, 0.5).node;
	this.adjacentEdges = this.centerNode.junction().edges;
	for(var i = 0; i < this.adjacentEdges.length; i++){
		var edgeIndex = this.adjacentEdges[i].index;
		this.edges[edgeIndex].strokeColor = {gray:0.0};
	}
}
radialRay.reset();

radialRay.onFrame = function(event) { }
radialRay.onResize = function(event) { }
radialRay.onMouseDown = function(event){ radialRay.reset(); }
radialRay.onMouseUp = function(event){ }
radialRay.onMouseMove = function(event) {
	var nearest = this.cp.nearest(event.point);
	for(var i = 0; i < radialRay.adjacentEdges.length; i++){
		var edgeIndex = radialRay.adjacentEdges[i].index;
		if(radialRay.adjacentEdges[i] === nearest.edge){
			radialRay.edges[edgeIndex].strokeColor = radialRay.colorForAngle(radialRay.adjacentEdges[i].absoluteAngle());
			radialRay.edges[edgeIndex].strokeWidth = 0.02;//radialRay.lineWeight*1.5;
			radialRay.edges[edgeIndex].bringToFront();
			if(radial_rainbow_callback != undefined){
				radial_rainbow_callback({node:this.centerNode,angle:radialRay.adjacentEdges[i].absoluteAngle(this.centerNode),edge:radialRay.adjacentEdges[i]});
			}
		}
		else{
			radialRay.edges[edgeIndex].strokeColor = {gray:0.0};
			radialRay.edges[edgeIndex].strokeWidth = 0.01*0.66666;//paperCP.lineWeight*0.66666;
		}
	}
}
