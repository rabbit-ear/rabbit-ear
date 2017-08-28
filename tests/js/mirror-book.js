
var mirrorB = new PaperCreasePattern("canvas-mirror-book");
mirrorB.zoomToFit(0.05);

// mirrorB.selectNearestEdge = true;
mirrorB.style.mark.strokeColor = {gray:0};

mirrorB.reset = function(){
	this.cp.clear();
	this.cp.bookSymmetry();
	for(var i = 0; i < 15; i++){
		var home = {x:Math.random(), y:Math.random()};
		if(Math.random() < 0.75 && this.cp.nodes.length > 2){
			var index = Math.floor(Math.random()*this.cp.nodes.length);
			home = this.cp.nodes[ index ];
		}
		var angle = 2*Math.PI / 32 * Math.floor(Math.random()*32);
		var d = Math.random() * 0.5;
		var end = {x:home.x+d*Math.cos(angle), y:home.y+d*Math.sin(angle)};
		this.cp.crease(home, end);
	}
	this.cp.clean();
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
