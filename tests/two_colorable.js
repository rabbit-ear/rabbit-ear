var twoColorable = new OrigamiPaper("canvas-two-colorable");

twoColorable.load("../files/svg/kraft-fractal-2.svg", function(){
	twoColorable.reset();
});

twoColorable.reset = function(){
	// this.cp.frogBase();
	this.cp.generateFaces();
	this.draw();
	for(var i = 0; i < this.boundaryLayer.children.length; i++){
		this.boundaryLayer.children[i].strokeColor = null;
	}
	for(var i = 0; i < this.edges.length; i++){
		this.edges[i].strokeColor = null;
	}

	var adjFaceTree = this.cp.adjacentFaceTree(this.cp.faces[0]);
	var faceRank = adjFaceTree.rank;
	for(var i = 0; i < faceRank.length; i++){
		var color = { hue:0, saturation:1.0, brightness:i%2, alpha:1.0 };
		for(var j = 0; j < faceRank[i].length; j++){
			var faceIndex = faceRank[i][j].index;
			this.faces[faceIndex].fillColor = color;
		}
	}

}
twoColorable.reset();

twoColorable.onFrame = function(event) { }
twoColorable.onResize = function(event) { }
twoColorable.onMouseDown = function(event){ }
twoColorable.onMouseUp = function(event){ }
twoColorable.onMouseMove = function(event) { }
