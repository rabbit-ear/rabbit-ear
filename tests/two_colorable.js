var twoColorable = new OrigamiPaper("canvas-two-colorable").setPadding(0);
// twoColorable.style.sector.scale = 0.25;
// twoColorable.style.face.fillColor = {gray:1.0}

twoColorable.load("../files/svg/crane.svg", function(){
	twoColorable.reset();
});

twoColorable.reset = function(){
	// this.cp.frogBase();
	this.cp.flatten();
	this.draw();
	for(var i = 0; i < this.boundaryLayer.children.length; i++){
		this.boundaryLayer.children[i].strokeColor = null;
	}
	for(var i = 0; i < this.edges.length; i++){
		this.edges[i].strokeColor = null;
	}

	var red = {hue:0.04*360, saturation:0.87, brightness:0.90 };
	var yellow = {hue:0.12*360, saturation:0.88, brightness:0.93 };
	var blue = {hue:0.53*360, saturation:0.82, brightness:0.28 };
	var black = {hue:0, saturation:0, brightness:0 };

	var colors = [yellow, blue];

	var adjFaceTree = this.cp.faces[0].adjacentFaceTree();
	var faceRank = adjFaceTree.rank;
	for(var i = 0; i < faceRank.length; i++){
		// var color = { hue:0, saturation:1.0, brightness:i%2, alpha:1.0 };
		for(var j = 0; j < faceRank[i].length; j++){
			var faceIndex = faceRank[i][j].index;
			this.faces[faceIndex].fillColor = colors[i%2];
		}
	}

}
twoColorable.reset();

twoColorable.onFrame = function(event) { }
twoColorable.onResize = function(event) { }
twoColorable.onMouseDown = function(event){ }
twoColorable.onMouseUp = function(event){ }
twoColorable.onMouseMove = function(event) { }
