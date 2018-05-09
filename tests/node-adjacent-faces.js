// a node's adjacent faces

var node_adjacent_faces_callback = undefined;

var nodeFaces = new OrigamiPaper("canvas-node-adjacent-faces").blackAndWhite();
nodeFaces.setPadding(0.05);
nodeFaces.style.selectedNode.fillColor = { hue:220, saturation:0.6, brightness:1 };
nodeFaces.selectNearestNode = true;
nodeFaces.edgeLayer.bringToFront();
nodeFaces.boundaryLayer.bringToFront();
nodeFaces.nodeLayer.bringToFront();
nodeFaces.selected = {};

nodeFaces.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.cp.birdBase();
	this.cp.clean();
	this.cp.generateFaces();
	this.draw();
}
nodeFaces.reset();

nodeFaces.onFrame = function(event) { }
nodeFaces.onResize = function(event) { }
nodeFaces.onMouseDown = function(event){
	this.refreshFaces();
}
nodeFaces.onMouseUp = function(event){
	this.refreshFaces();
	this.nearestNode = undefined;
	this.selected.nodes = [];
	this.update();
}
nodeFaces.onMouseMove = function(event) {
	this.refreshFaces();
	if(node_adjacent_faces_callback != undefined){
		node_adjacent_faces_callback({'node':nodeFaces.nearestNode});
	}
}

nodeFaces.refreshFaces = function(){
	var faces = [];
	var nearest = this.cp.nearest(this.mouse.position);
	// faces = nearest.node.adjacentFaces();
	// this.makeFaces(faces);
	// console.log(nearest);
	if(nearest.face === undefined){return;}
	this.makeFaces( [nearest.face] )
	// if(this.nearestNode === undefined) return;
	// // if(!this.mouse.isPressed){
	// faces = this.nearestNode.adjacentFaces();
	// } 
	// else {
	// 	var nodes = [];
	// 	if(this.nearestNode != undefined) {
	// 		nodes.push(this.nearestNode);
	// 		nodes = nodes.concat(this.nearestNode.adjacentNodes());
	// 	}
	// 	this.selected.nodes = nodes;
	// 	this.update();
	// 	for(var i = 0; i < nodes.length; i++){ 
	// 		faces = faces.concat(nodes[i].adjacentFaces());
	// 	}
	// 	faces.removeDuplicates(function(a,b){ return a.equivalent(b); });
	// }
	// this.makeFaces(faces);
}

nodeFaces.makeFaces = function(faces){
	this.faceLayer.activate();
	this.faceLayer.removeChildren();
	for(var i = 0; i < faces.length; i++){
		var color = 100 + 200 * i/faces.length;
		new this.scope.Path({
				fillColor: { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 },
				segments: faces[i].nodes.map(function(el){return [el.x,el.y];}),
				closed: true
		});
	}
}
