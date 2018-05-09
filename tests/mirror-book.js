
var mirrorB = new OrigamiPaper("canvas-mirror-book");
mirrorB.setPadding(0.05);

// mirrorB.select.edge = true;
mirrorB.style.mark.strokeColor = {gray:0};

mirrorB.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.cp.noSymmetry();
	this.cp.creaseEdgeToEdge(this.cp.rightEdge(), this.cp.leftEdge())[0].valley();
	this.cp.bookSymmetry();
	var centers = [new XY(0.3 + 0.3*Math.random(), 0.3 + 0.3*Math.random()), new XY(0.3 + 0.3*Math.random(), 0.3 + 0.3*Math.random())];
	var rad = [0.1 + Math.random()*0.66, 0.1 + Math.random()*0.66];
	var freq = [0.2 + Math.random(), 0.2 + Math.random()];
	var phase = [Math.random()*Math.PI*2, Math.random()*Math.PI*2];
	var count = map(Math.pow(Math.random(),4), 0, 1, 2, 5);
	for(var i = 0; i < count; i++){
		var a = {x: centers[0].x + rad[0]*Math.cos(freq[0]*i+phase[0]), 
		         y: centers[0].y + rad[0]*Math.sin(freq[0]*i+phase[0])};
		var b = {x: centers[1].x + rad[1]*Math.cos(freq[1]*i+phase[1]),
		         y: centers[1].y + rad[1]*Math.sin(freq[1]*i+phase[1])};
		this.cp.creaseThroughPoints(a, b);
	}
	// this.cp.clean();
	this.draw();
}
mirrorB.reset();

mirrorB.onFrame = function(event) { }
mirrorB.onResize = function(event) { }
mirrorB.onMouseDown = function(event){ 
	mirrorB.reset();
}
mirrorB.onMouseUp = function(event){ }
mirrorB.onMouseMove = function(event) { }
