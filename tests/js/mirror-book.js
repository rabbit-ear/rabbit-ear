
var mirrorB = new PaperCreasePattern("canvas-mirror-book");
mirrorB.zoomToFit(0.05);

// mirrorB.selectNearestEdge = true;
mirrorB.style.mark.strokeColor = {gray:0};

mirrorB.reset = function(){
	this.cp.clear();
	this.cp.bookSymmetry();
	var centers = [new XY(Math.random(), Math.random()), new XY(Math.random(), Math.random())];
	var rad = [0.2 + Math.random(), 0.2 + Math.random()];
	var freq = [0.2 + Math.random(), 0.2 + Math.random()];
	var phase = [Math.random()*Math.PI*2, Math.random()*Math.PI*2];
	for(var i = 0; i < 8; i++){
		var a = {x: centers[0].x + rad[0]*Math.cos(freq[0]*i+phase[0]), 
		         y: centers[0].y + rad[0]*Math.sin(freq[0]*i+phase[0])};
		var b = {x: centers[1].x + rad[1]*Math.cos(freq[1]*i+phase[1]),
		         y: centers[1].y + rad[1]*Math.sin(freq[1]*i+phase[1])};
		this.cp.creaseThroughPoints(a, b);
	}
	// this.cp.clean();
	this.initialize();
}
mirrorB.reset();

mirrorB.onFrame = function(event) { }
mirrorB.onResize = function(event) { }
mirrorB.onMouseDown = function(event){ 
	mirrorB.reset();
}
mirrorB.onMouseUp = function(event){ }
mirrorB.onMouseMove = function(event) { }
