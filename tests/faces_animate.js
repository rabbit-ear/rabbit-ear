
var faceAnim = new OrigamiPaper("canvas-faces-animate", new PlanarGraph());
faceAnim.show.faces = true;
faceAnim.style.face.fillColor = faceAnim.styles.byrne.darkBlue;

faceAnim.reset = function(){
	this.NUM_LINES = 30;
	this.aspect = this.canvas.width / this.canvas.height;
	var pad = 0.2;
	this.setBounds(-pad, -pad, this.aspect + pad*2, 1 + pad*2);
	this.g = new PlanarGraph();
	this.g.clear();
	this.positions = [];
	this.angles = [];
	for(var i = 0; i < this.NUM_LINES; i++){
		this.positions[i] = new XY(Math.random() * this.aspect, Math.random());
		this.angles[i] = Math.random() * Math.PI*2;
	}
	for(var i = 0; i < this.NUM_LINES; i += 2){
		this.g.newPlanarEdge(this.positions[i+0].x, this.positions[i+0].y,
		                     this.positions[i+1].x, this.positions[i+1].y);
	}
	this.cp = this.g.copy();
	this.draw();
}
faceAnim.reset();

faceAnim.onFrame = function(event) { 
	var spd = 0.7;
	var mag = .3;
	var off = 6.28/this.NUM_LINES;
	this.cp = this.g.copy();
	for(var i = 0; i < this.NUM_LINES; i++){
		this.cp.nodes[i].x=this.positions[i].x+mag* Math.cos(this.angles[i])*Math.sin(spd*event.time+off*i) * (1/this.aspect);
		this.cp.nodes[i].y=this.positions[i].y+mag* Math.sin(this.angles[i])*Math.sin(spd*event.time+off*i);
	}
	this.cp.flatten();
	this.draw();
}
faceAnim.onResize = function(event) { }
faceAnim.onMouseDown = function(event){ 
	this.reset();
}
faceAnim.onMouseUp = function(event){ }
faceAnim.onMouseMove = function(event) { }
