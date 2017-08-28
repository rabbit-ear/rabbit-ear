
var mirror = new PaperCreasePattern("canvas-mirror");
mirror.zoomToFit(0.05);

// mirror.selectNearestEdge = true;
mirror.style.mark.strokeColor = {gray:0};

mirror.reset = function(){
	this.cp.clear();
	this.cp.diagonalSymmetry();
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
mirror.reset();

mirror.onFrame = function(event) { }
mirror.onResize = function(event) { }
mirror.onMouseDown = function(event){ 
	mirror.reset();
}
mirror.onMouseUp = function(event){ }
mirror.onMouseMove = function(event) { }
