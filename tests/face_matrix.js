
var adjFaceMatrix = new OrigamiPaper("canvas-face-matrix");
// adjFaceMatrix.setPadding(0.05);
// adjFaceMatrix.show.faces = false;

var red = {hue:0.04*360, saturation:0.87, brightness:0.90 };
var blue = {hue:0.53*360, saturation:0.82, brightness:0.28 };
adjFaceMatrix.style.valley.strokeColor = blue;
adjFaceMatrix.style.mountain.strokeColor = blue;
adjFaceMatrix.treeLineLayer = new adjFaceMatrix.scope.Layer();

adjFaceMatrix.reset = function(){
	this.load("../files/svg/crane.svg", function(){
		adjFaceMatrix.cp.flatten();
		adjFaceMatrix.makeFacePathLines();
	});
}
adjFaceMatrix.reset();

adjFaceMatrix.makeFacePathLines = function(startingFace){
	if(startingFace === undefined){
		var bounds = this.cp.bounds();
		startingFace = this.cp.nearest(bounds.size.width * 0.5, bounds.size.height*0.5).face;
	}
	if(startingFace === undefined){ return; }
	var tree = startingFace.adjacentFaceTree();

	this.draw();
	this.treeLineLayer.activate();
	this.treeLineLayer.removeChildren();

	function recurseAndDraw(tree){
		var parent = tree.parent.obj;
		var face = tree.obj;
		var path = new adjFaceMatrix.scope.Path({segments: [parent.centroid(),face.centroid()], closed: false, strokeWidth:0.01, strokeColor:red });
		tree.children.forEach(function(child){ recurseAndDraw(child); });
	}
	tree.children.forEach(function(tree){ recurseAndDraw(tree); });
}

adjFaceMatrix.onFrame = function(event) { }
adjFaceMatrix.onResize = function(event) { }
adjFaceMatrix.onMouseDown = function(event){ }
adjFaceMatrix.onMouseUp = function(event){ }
adjFaceMatrix.onMouseMove = function(event) {
	if(event === undefined) return;
	var startingFace = this.cp.nearest(event.point.x, event.point.y).face;
	if(startingFace !== undefined){
		this.makeFacePathLines(startingFace);
	}
}
