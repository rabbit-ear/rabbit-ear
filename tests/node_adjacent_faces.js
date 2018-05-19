// a node's adjacent faces
var node_adjacent_faces_callback = undefined;

var nodeFaces = new OrigamiPaper("canvas-node-adjacent-faces").blackAndWhite().setPadding(0.05);
nodeFaces.style.node.radius = 0.02;
nodeFaces.style.node.fillColor = {hue:0, saturation:1, brightness:1};
nodeFaces.show.faces = true;
nodeFaces.show.sectors = false;

nodeFaces.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.cp.birdBase();
	this.draw();
}
nodeFaces.reset();

nodeFaces.onFrame = function(event){ }
nodeFaces.onResize = function(event){ }
nodeFaces.onMouseDown = function(event){ }
nodeFaces.onMouseUp = function(event){ }
nodeFaces.onMouseMove = function(event){
	var nearest = this.cp.nearest(event.point);
	if(nearest.face === undefined){ return; }
	var adjacent = nearest.node.adjacentFaces();
	this.highlightParts(nearest.node, adjacent);
	if(node_adjacent_faces_callback != undefined){
		node_adjacent_faces_callback({'node':nearest.node});
	}
}
nodeFaces.highlightParts = function(node, faces){
	// this.nodes.forEach(function(el){ el.visible = false; },this);
	// this.nodes[node.index].visible = true;

	this.faces.forEach(function(el){ el.fillColor = this.style.face.fillColor; },this);
	for(var i = 0; i < faces.length; i++){
		this.faces[ faces[i].index ].fillColor = {hue:i/faces.length*36, saturation:0.9, brightness:0.9};
	}
}
