
var faceAnim = new OrigamiPaper("canvas-face-anim", new PlanarGraph());
// faceAnim.setPadding(0.05);

faceAnim.reset = function(){
	paper = this.scope; 

	this.NUM_LINES = 30;
	this.aspect = this.canvas.width / this.canvas.height;

	this.g = new PlanarGraph();

	this.g.clear();
	this.g.nodes = [];
	this.g.edges = [];

	this.positions = [];
	this.angles = [];
	for(var i = 0; i < this.NUM_LINES; i++){
		this.positions[i] = new XY(Math.random() * this.aspect - this.aspect*0.4, Math.random());
		this.angles[i] = Math.random() * Math.PI*2;
	}
	for(var i = 0; i < this.NUM_LINES; i += 2){
		this.g.newPlanarEdge(this.positions[i+0].x, this.positions[i+0].y,
		                     this.positions[i+1].x, this.positions[i+1].y);
	}
	this.cp = this.g.duplicate();
	this.draw();
	this.style.mark.strokeColor = {gray:0.0};
	// this.style.mark.strokeWidth = 0.002;
}
faceAnim.reset();

faceAnim.onFrame = function(event) { 
	var mag = .3;
	this.cp = this.g.duplicate();
	for(var i = 0; i < this.NUM_LINES; i++){
		this.cp.nodes[i].x=this.positions[i].x+mag* Math.cos(this.angles[i])*Math.sin(event.time) * (1/this.aspect);
		this.cp.nodes[i].y=this.positions[i].y+mag* Math.sin(this.angles[i])*Math.sin(event.time);
	}
	this.cp.clean();
	this.cp.generateFaces();
	this.draw();
}
faceAnim.onResize = function(event) { }
faceAnim.onMouseDown = function(event){ 
	this.reset();
}
faceAnim.onMouseUp = function(event){ }
faceAnim.onMouseMove = function(event) { }
