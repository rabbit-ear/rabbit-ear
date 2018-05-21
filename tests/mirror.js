
var mirror = new OrigamiPaper("canvas-mirror");

mirror.reset = function(){
	this.cp.clear();
	this.cp.diagonalSymmetry();
	var center = new XY(0.5, 0.5);
	var cenPhase = Math.random()*2*Math.PI;
	var cenFreq = Math.random()+0.5;
	var vecPhase = Math.random()*2*Math.PI;
	var vecFreq = Math.random()+0.5;
	for(var i = 0; i < 3; i++){
		var offset = new XY(Math.cos(cenPhase+cenFreq*i), Math.sin(cenPhase+cenFreq*i));
		var line = new Line(center.add(offset.scale(0.2)), new XY(Math.cos(vecPhase+vecFreq*i), Math.sin(vecPhase+vecFreq*i)));
		this.cp.crease(line);
	}
	this.cp.edges.forEach(function(edge){
		if(edge.orientation != CreaseDirection.border){ edge.valley(); }
	},this);
	this.cp.creaseThroughPoints(0,0,1,1);
	this.draw();
}
mirror.reset();

mirror.onFrame = function(event) { }
mirror.onResize = function(event) { }
mirror.onMouseDown = function(event){ 
	mirror.reset();
}
mirror.onMouseUp = function(event){ }
mirror.onMouseMove = function(event) { }
