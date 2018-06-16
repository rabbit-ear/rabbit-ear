var edge_winding_callback = undefined;

var edgeWinding = new OrigamiPaper("canvas-edge-winding").setPadding(0.05);
edgeWinding.show.boundary = false;
edgeWinding.style.mark.strokeColor = {gray:0.0};
edgeWinding.style.mark.strokeWidth = 0.0025;
edgeWinding.centerNode;

edgeWinding.colorForAngle = function(angle){
	var color = angle / Math.PI * 180;
	while(color < 0){color += 360;}
	return {hue:color, saturation:1.0, brightness:0.9};
}
edgeWinding.reset = function(){
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	var angle = 0;
	while(angle < Math.PI*2 - 0.1){
		var len = 0.4 + Math.random()*0.1;
		this.cp.newPlanarEdge(0.5, 0.5, 0.5+len*Math.cos(angle), 0.5+len*Math.sin(angle) );
		angle+= Math.random()*0.3 + 0.1;
	}
	this.cp.flatten();
	this.draw();
	this.centerNode = this.cp.nearest(0.5, 0.5).node;
	this.adjacentEdges = this.centerNode.junction().edges;
}
edgeWinding.reset();

edgeWinding.onFrame = function(event){ }
edgeWinding.onResize = function(event){ }
edgeWinding.onMouseDown = function(event){ this.reset(); }
edgeWinding.onMouseUp = function(event){ }
edgeWinding.onMouseMove = function(event){
	this.updateStyles();
	var nearestEdge = this.cp.nearest(event.point).edge;
	if(nearestEdge == undefined){ return; }
	var vec = nearestEdge.vector(this.centerNode);
	var angle = Math.atan2(vec.y, vec.x);
	// this.edges[ nearestEdge.index ].strokeColor = this.colorForAngle(angle);
	this.edges[ nearestEdge.index ].strokeColor = this.styles.byrne.red;
	this.edges[ nearestEdge.index ].strokeWidth = 0.015;
	this.edges[ nearestEdge.index ].bringToFront();
	var indexIn = this.adjacentEdges.indexOf(nearestEdge);
	var nextEdge = this.centerNode.junction().clockwiseEdge(nearestEdge);
	if(nextEdge != undefined){ this.edges[ nextEdge.index ].strokeWidth = 0.015; }
	var nextIndexIn = this.adjacentEdges.indexOf(nextEdge);
	var nextVec = nextEdge.vector(this.centerNode);
	var nextAngle = Math.atan2(nextVec.y, nextVec.x);
	var prevEdge = this.centerNode.junction().counterClockwiseEdge(nearestEdge);
	if(prevEdge != undefined){ 
		this.edges[ prevEdge.index ].strokeWidth = 0.015;
		this.edges[ prevEdge.index ].strokeColor = this.styles.byrne.blue;
	}
	var prevIndexIn = this.adjacentEdges.indexOf(prevEdge);
	var prevVec = prevEdge.vector(this.centerNode);
	var prevAngle = Math.atan2(prevVec.y, prevVec.x);
	if(edge_winding_callback != undefined){
		edge_winding_callback({node:this.centerNode, angle:angle, edge:nearestEdge, index:indexIn, nextEdge:nextEdge, nextIndex:nextIndexIn, nextAngle:nextAngle, prevEdge:prevEdge, prevIndex:prevIndexIn, prevAngle:prevAngle,});
	}
}
