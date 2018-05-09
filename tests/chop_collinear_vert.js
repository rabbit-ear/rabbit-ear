
var chopVert = new OrigamiPaper("canvas-chop-collinear-vert");
chopVert.setPadding(0.05);

chopVert.select.node = true;
chopVert.select.edge = true;

chopVert.reset = function(){
	paper = this.scope; 
	var NUM_LINES = 20;
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.cp.crease(0.5, 0.0, 0.5, 1.0);
	for(var i = 0; i < NUM_LINES; i++){
		var y = .1 + .8*(i/(NUM_LINES-1));
		this.cp.crease(Math.random(), y, 0.5, y);
	}
	var crossings = this.cp.fragment();
	this.draw();
}
chopVert.reset();

chopVert.onFrame = function(event) { }
chopVert.onResize = function(event) { }
chopVert.onMouseDown = function(event){ this.reset(); }
chopVert.onMouseUp = function(event){ }
chopVert.onMouseMove = function(event) { }