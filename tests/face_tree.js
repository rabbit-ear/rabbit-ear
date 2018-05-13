// a face's adjacent face tree

var face_tree_callback = undefined;

var faceTree = new OrigamiPaper("canvas-face-tree");
faceTree.setPadding(0.05);
// faceTree.select.edge = true;
// faceTree.edgeLayer.bringToFront();
// faceTree.boundaryLayer.bringToFront();

faceTree.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.cp.birdBase();
	this.cp.clean();
	this.cp.flatten();

	console.log(this.cp.faces[0].adjacentFaceTree());

	this.draw();
}
faceTree.reset();

faceTree.onFrame = function(event) { }
faceTree.onResize = function(event) { }
faceTree.onMouseDown = function(event){
	// this.refreshFaces();
}
faceTree.onMouseUp = function(event){ 
	// this.refreshFaces();
	// this.nearest.edge = undefined;
	// this.selected.edges = [];
	// this.update();
}
faceTree.onMouseMove = function(event) {
	// this.refreshFaces();
	// if(face_tree_callback != undefined){
	// 	face_tree_callback({'edge':faceTree.nearest.edge});
	// }
}

faceTree.refreshFaces = function(){
	// var faces = [];
	// if(this.nearest.edge === undefined) return;
	// if(!this.mouse.pressed){
	// 	faces = this.nearest.edge.adjacentFaces();
	// } else {
	// 	var edges = [];
	// 	if(this.nearest.edge != undefined) {
	// 		edges.push(this.nearest.edge);
	// 		edges = edges.concat(this.nearest.edge.adjacentEdges());
	// 	}
	// 	this.selected.edges = edges;
	// 	this.update();
	// 	for(var i = 0; i < edges.length; i++){ 
	// 		faces = faces.concat(edges[i].adjacentFaces());
	// 	}
	// 	faces.removeDuplicates(function(a,b){ return a.equivalent(b); });
	// }
	// this.makeFaces(faces);
}

faceTree.makeFaces = function(faces){
	// this.faceLayer.activate();
	// this.faceLayer.removeChildren();
	// for(var i = 0; i < faces.length; i++){
	// 	var color = 100 + 200 * i/faces.length;
	// 	new this.scope.Path({
	// 			fillColor: { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 },
	// 			segments: faces[i].nodes,
	// 			closed: true
	// 	});
	// }
}
