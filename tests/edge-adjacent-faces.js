// a edge's adjacent faces

var edge_adjacent_faces_callback = undefined;

var edgeFaces = new OrigamiPaper("canvas-edge-adjacent-faces");
edgeFaces.setPadding(0.05);
edgeFaces.select.edge = true;
edgeFaces.edgeLayer.bringToFront();
edgeFaces.boundaryLayer.bringToFront();

edgeFaces.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.cp.birdBase();
	this.cp.clean();
	this.draw();
}
edgeFaces.reset();

edgeFaces.onFrame = function(event) { }
edgeFaces.onResize = function(event) { }
edgeFaces.onMouseDown = function(event){
	this.refreshFaces();
}
edgeFaces.onMouseUp = function(event){ 
	this.refreshFaces();
	this.nearest.edge = undefined;
	this.selected.edges = [];
	this.update();
}
edgeFaces.onMouseMove = function(event) {
	this.refreshFaces();
	if(edge_adjacent_faces_callback != undefined){
		edge_adjacent_faces_callback({'edge':edgeFaces.nearest.edge});
	}
}

edgeFaces.refreshFaces = function(){
	var faces = [];
	if(this.nearest.edge === undefined) return;
	if(!this.mouse.pressed){
		faces = this.nearest.edge.adjacentFaces();
	} else {
		var edges = [];
		if(this.nearest.edge != undefined) {
			edges.push(this.nearest.edge);
			edges = edges.concat(this.nearest.edge.adjacentEdges());
		}
		this.selected.edges = edges;
		this.update();
		for(var i = 0; i < edges.length; i++){ 
			faces = faces.concat(edges[i].adjacentFaces());
		}
		faces.removeDuplicates(function(a,b){ return a.equivalent(b); });
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
