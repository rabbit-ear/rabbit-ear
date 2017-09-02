
var chopCross = new OrigamiPaper("canvas-chop-cross-many");
chopCross.zoomToFit(0.05);

chopCross.selectNearestNode = true;
chopCross.selectNearestEdge = true;

chopCross.reset = function(){
	var NUM_LINES = 30;
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	var firstEdge = this.cp.crease( 0.0, 0.5, 1.0, 0.5 );
	var v = .8/(NUM_LINES-1);
	for(var i = 0; i < NUM_LINES; i++){
		var x = .1 + .8*(i/(NUM_LINES-1));
		this.cp.crease( x + Math.random()*v-v*0.5, 0.25 + Math.random()*v-v*0.5, 
		                     x + Math.random()*v-v*0.5, 0.75 + Math.random()*v-v*0.5 );
	}
	var lowerEdge = this.cp.crease( 0.0, 0.6, 1.0, 0.6 );
	var crossings = this.cp.fragment();
	this.initialize();
}
chopCross.reset();

chopCross.onFrame = function(event) { }
chopCross.onResize = function(event) { }
chopCross.onMouseDown = function(event){ this.reset(); }
chopCross.onMouseUp = function(event){ }
chopCross.onMouseMove = function(event) { }
