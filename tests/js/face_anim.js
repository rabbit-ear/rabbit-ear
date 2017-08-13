
var faceAnim = new PaperCreasePattern("canvas-face-anim", new PlanarGraph());
// faceAnim.zoomToFit(0.05);

faceAnim.reset = function(){

	faceAnim.NUM_LINES = 30;
	var aspect = faceAnim.canvas.width / faceAnim.canvas.height;

	faceAnim.g = new PlanarGraph();

	faceAnim.g.clear();
	faceAnim.g.nodes = [];
	faceAnim.g.edges = [];

	faceAnim.positions = [];
	faceAnim.angles = [];
	for(var i = 0; i < faceAnim.NUM_LINES; i++){
		faceAnim.positions[i] = new XYPoint(Math.random() * aspect, Math.random());
		faceAnim.angles[i] = Math.random() * Math.PI*2;
	}
	for(var i = 0; i < faceAnim.NUM_LINES; i += 2){
		faceAnim.g.newPlanarEdge(faceAnim.positions[i+0].x, faceAnim.positions[i+0].y,
		                         faceAnim.positions[i+1].x, faceAnim.positions[i+1].y);
	}
	faceAnim.cp = faceAnim.g.duplicate();
	faceAnim.initialize();
}
faceAnim.reset();

faceAnim.onFrame = function(event) { 
	var mag = .3;
	faceAnim.cp = faceAnim.g.duplicate();
	for(var i = 0; i < faceAnim.NUM_LINES; i++){
		faceAnim.cp.nodes[i].x=faceAnim.positions[i].x+mag* Math.cos(faceAnim.angles[i])*Math.sin(event.time);
		faceAnim.cp.nodes[i].y=faceAnim.positions[i].y+mag* Math.sin(faceAnim.angles[i])*Math.sin(event.time);
	}
	faceAnim.cp.clean();
	faceAnim.cp.generateFaces();
	faceAnim.initialize();
}
faceAnim.onResize = function(event) { }
faceAnim.onMouseDown = function(event){ 
	faceAnim.reset();
}
faceAnim.onMouseUp = function(event){ }
faceAnim.onMouseMove = function(event) { }
