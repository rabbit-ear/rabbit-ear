// a edge's adjacent faces

var edge_adjacent_faces_callback = undefined;

var edgeFaces = new PaperCreasePattern("canvas-edge-adjacent-faces");
edgeFaces.zoomToFit(0.05);
edgeFaces.selectNearestEdge = true;
edgeFaces.edgeLayer.bringToFront();
edgeFaces.boundaryLayer.bringToFront();

edgeFaces.reset = function(){
	this.cp.clear();
	this.cp.birdBase();
	this.cp.clean();
	this.initialize();
}
edgeFaces.reset();

edgeFaces.onFrame = function(event) { }
edgeFaces.onResize = function(event) { }
edgeFaces.onMouseDown = function(event){
	this.refreshFaces();
}
edgeFaces.onMouseUp = function(event){ 
	this.refreshFaces();
	this.nearestEdge = undefined;
	this.selected.edges = [];
	this.update();
}
edgeFaces.onMouseMove = function(event) {
	this.refreshFaces();
	if(edge_adjacent_faces_callback != undefined){
		edge_adjacent_faces_callback({'edge':edgeFaces.nearestEdge});
	}
}

edgeFaces.refreshFaces = function(){
	var faces = [];
	if(this.nearestEdge === undefined) return;
	if(!this.mouseDown){
		faces = this.nearestEdge.adjacentFaces();
	} else {
		var edges = [];
		if(this.nearestEdge != undefined) {
			edges.push(this.nearestEdge);
			edges = edges.concat(this.nearestEdge.adjacentEdges());
		}
		this.selected.edges = edges;
		this.update();
		for(var i = 0; i < edges.length; i++){ 
			faces = faces.concat(edges[i].adjacentFaces());
		}
		arrayRemoveDuplicates(faces, function(a,b){ return a.equivalent(b); });
	}
	this.makeFaces(faces);
}

edgeFaces.makeFaces = function(faces){
	this.faceLayer.activate();
	this.faceLayer.removeChildren();
	for(var i = 0; i < faces.length; i++){
		var color = 100 + 200 * i/faces.length;
		new this.scope.Path({
				fillColor: { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 },
				segments: faces[i].nodes,
				closed: true
		});
	}
}
