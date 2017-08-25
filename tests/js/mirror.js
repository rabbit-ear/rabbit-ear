
var mirror = new PaperCreasePattern("canvas-mirror");
mirror.zoomToFit(0.05);

mirror.selectNearestEdge = true;

mirror.reset = function(){
	this.cp.clear();
	this.cp.diagonalSymmetry();
	for(var i = 0; i < 5; i++){
		this.cp.newCrease(Math.random(), Math.random(), Math.random(), Math.random());
	}
	this.cp.clean();
	this.initialize();
}
mirror.reset();

mirror.onFrame = function(event) { }
mirror.onResize = function(event) { }
mirror.onMouseDown = function(event){ 
	mirror.reset();
}
mirror.onMouseUp = function(event){ }
mirror.onMouseMove = function(event) { }
