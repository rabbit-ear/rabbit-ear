
var adjFaceMatrix = new OrigamiPaper("canvas-face-tree");

var edgeStyle = { strokeColor: {gray:1.0}, strokeWidth: 0.002, dashArray: null };
Object.assign(adjFaceMatrix.style.valley, edgeStyle);
Object.assign(adjFaceMatrix.style.mountain, edgeStyle);
Object.assign(adjFaceMatrix.style.mark, edgeStyle);
Object.assign(adjFaceMatrix.style.border, edgeStyle);
adjFaceMatrix.style.backgroundColor = adjFaceMatrix.styles.byrne.darkBlue;
adjFaceMatrix.style.boundary.strokeColor = {gray:0.0, alpha:0.0}
adjFaceMatrix.show.faces = true;
// one: cool black face boundary effect
// adjFaceMatrix.style.face.fillColor = {gray:0.0};
// adjFaceMatrix.style.face.scale = 0.7;
// two: filled face color gradient
adjFaceMatrix.style.face.fillColor = {hue:0, saturation:0.9, brightness:0.9};
adjFaceMatrix.style.face.scale = 1.0;


adjFaceMatrix.treeLineLayer = new adjFaceMatrix.scope.Layer();

adjFaceMatrix.reset = function(){
	this.load("../files/svg/crane.svg", function(){
	// this.load("../files/svg/butterfly-tanaka.svg", function(){
		adjFaceMatrix.colorFaces();
		adjFaceMatrix.makeFacePathLines();
	});
}
adjFaceMatrix.reset();

adjFaceMatrix.colorFaces = function(startingFace){
	if(startingFace === undefined){
		var bounds = this.cp.bounds();
		startingFace = this.cp.nearest(bounds.size.width * 0.5, bounds.size.height*0.5).face;
	}
	if(startingFace === undefined){ return; }

	function recurseAndFindDepth(tree, depth){
		return tree.children
			.map(function(child){ return recurseAndFindDepth(child, depth+1); })
			.reduce(function(prev, curr){ return (prev > curr) ? prev : curr; }, depth);
	}

	var tree = startingFace.adjacentFaceTree();
	var totalDepth = recurseAndFindDepth(tree, 0);
	
	var depthColors = [];
	for(var i = 0; i < totalDepth; i++){
		// one: cool black face boundary effect
		// var hue = 14.4;
		// var brightScale = 1.0 - i/totalDepth*2;
		// if(brightScale < 0){ brightScale = 0; }
		// depthColors.push({hue:hue, saturation:0.87, brightness:0.90*brightScale });
		// two: filled face color gradient
		var hue = 14.4;//i/totalDepth*36;
		var brightScale = 1.0 - i/totalDepth;
		if(brightScale < 0){ brightScale = 0; }
		depthColors.push({hue:hue, saturation:0.9, brightness:0.9*brightScale});
	}
	function recurseAndDraw(tree, depth){
		var parent = tree.parent.obj;
		var face = tree.obj;
		adjFaceMatrix.faces[ tree.obj.index ].fillColor = depthColors[depth];
		tree.children.forEach(function(child){ recurseAndDraw(child, depth+1); });
	}
	adjFaceMatrix.faces[ tree.obj.index ].fillColor = depthColors[0];
	tree.children.forEach(function(tree){ recurseAndDraw(tree, 0); });
}

adjFaceMatrix.makeFacePathLines = function(startingFace){
	if(startingFace === undefined){
		var bounds = this.cp.bounds();
		startingFace = this.cp.nearest(bounds.size.width * 0.5, bounds.size.height*0.5).face;
	}
	if(startingFace === undefined){ return; }
	this.treeLineLayer.activate();
	this.treeLineLayer.removeChildren();
	var tree = startingFace.adjacentFaceTree();
	function recurseAndDraw(tree, depth){
		var parent = tree.parent.obj;
		var face = tree.obj;
		var path = new adjFaceMatrix.scope.Path({segments: [parent.centroid(),face.centroid()], closed: false, strokeWidth:0.006, strokeColor:{hue:43.2, saturation:0.88, brightness:0.93 } });
		tree.children.forEach(function(child){ recurseAndDraw(child, depth+1); });
	}
	tree.children.forEach(function(tree){ recurseAndDraw(tree, 0); });
}

adjFaceMatrix.onFrame = function(event){ }
adjFaceMatrix.onResize = function(event){ }
adjFaceMatrix.onMouseDown = function(event){
	this.onMouseMove(event);
}
adjFaceMatrix.onMouseUp = function(event){ }
adjFaceMatrix.onMouseMove = function(event) {
	if(event === undefined) return;
	var startingFace = this.cp.nearest(event.point.x, event.point.y).face;
	if(startingFace !== undefined){
		this.colorFaces(startingFace);
		this.treeLineLayer.removeChildren();
		if(!this.mouse.isPressed){
			this.makeFacePathLines(startingFace);
		}
	}
}
