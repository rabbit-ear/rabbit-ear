
var foldedState = new OrigamiPaper("canvas-folded", cp);

// loadSVG("/tests/svg/sea-turtle-base.svg", function(cp){ 
loadSVG("/tests/svg/crane.svg", function(cp){ 
	// foldedState = new OrigamiPaper("canvas-folded", cp);
	foldedState.cp = cp;
	// foldedState.cp = new CreasePattern().birdBase();;
	foldedState.cp.generateFaces();
	foldedState.initialize();
	foldedState.zoomToFit(0.05);
	foldedState.fold();
});

foldedState.fold = function(){
	// var answer = this.cp.adjacentFaceTree(this.cp.faces[40]);

	// var rani = Math.floor(Math.random()*this.cp.faces.length);
	// var answer = this.cp.adjacentFaceTree(this.cp.faces[rani]);
	var answer = this.cp.adjacentFaceTree(this.cp.faces[33]);
	// console.log(rani);

	var folded = [];
	this.foldedLayer = new this.scope.Layer();
	this.foldedLayer.removeChildren();
	this.foldedLayer.activate();

	for(var i = 0; i < answer.faces.length; i++){
		var face = answer.faces[i].face;
		var matrix = answer.faces[i].global;
		var segments = [];
		for(var p = 0; p < face.nodes.length; p++){
			segments.push( new XY(face.nodes[p].x, face.nodes[p].y ).transform(matrix) );
		}
		var face = new this.scope.Path({segments:segments,closed:true});
		var color = 100 + 200 * i/this.cp.faces.length;
		// face.fillColor = { hue:color, saturation:1.0, brightness:1.0, alpha:0.2 };
		face.fillColor = { gray:0.0, alpha:0.05 };
		this.faces.push( face );
	}

	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.initialize();
	this.boundaryLayer.visible = false;

}

foldedState.onFrame = function(event) { }
foldedState.onResize = function(event) { }
foldedState.onMouseDown = function(event){ }
foldedState.onMouseUp = function(event){ }
foldedState.onMouseMove = function(event) { }
