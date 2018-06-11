var radial_rainbow_callback = undefined;

var radialRay = new OrigamiPaper("canvas-radial-rainbow").setPadding(0.05);
radialRay.show.boundary = false;
radialRay.style.mark.strokeColor = {gray:0.0};
radialRay.style.mark.strokeWidth = 0.0025;
radialRay.centerNode;

radialRay.colorForAngle = function(angle){
	var color = angle / Math.PI * 180;
	while(color < 0){color += 360;}
	return {hue:color, saturation:1.0, brightness:0.9};
}
radialRay.reset = function(){
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	var angle = 0;
	while(angle < Math.PI*2){
		var len = 0.4 + Math.random()*0.1;
		this.cp.newPlanarEdge(0.5, 0.5, 0.5+len*Math.cos(angle), 0.5+len*Math.sin(angle) );
		angle+= Math.random()*0.2 + 0.05;
	}
	this.cp.flatten();
	this.draw();
	this.centerNode = this.cp.nearest(0.5, 0.5).node;
	this.adjacentEdges = this.centerNode.junction().edges;
}
radialRay.reset();

radialRay.onFrame = function(event){ }
radialRay.onResize = function(event){ }
radialRay.onMouseDown = function(event){ this.reset(); }
radialRay.onMouseUp = function(event){ }
radialRay.onMouseMove = function(event){
	this.updateStyles();
	var nearestEdge = this.cp.nearest(event.point).edge;
	if(nearestEdge == undefined){ return; }
	var vec = nearestEdge.vector(this.centerNode);
	var angle = Math.atan2(vec.y, vec.x);
	// this.edges[ nearestEdge.index ].strokeColor = this.colorForAngle(angle);
	this.edges[ nearestEdge.index ].strokeColor = this.styles.byrne.red;
	this.edges[ nearestEdge.index ].strokeWidth = 0.015;//this.lineWeight*1.5;
	this.edges[ nearestEdge.index ].bringToFront();
	var indexIn = this.adjacentEdges.indexOf(nearestEdge);
	if(radial_rainbow_callback != undefined){
		radial_rainbow_callback({node:this.centerNode, angle:angle, edge:nearestEdge, index:indexIn});
	}
}
