
var chopMV = new OrigamiPaper("canvas-chop-mountain-valley");
chopMV.zoomToFit(0.05);

chopMV.selectNearestEdge = true;

chopMV.reset = function(){
	var NUM_LINES = 10;
	this.cp.clear();
	for(var i = 0; i < NUM_LINES; i++){
		var crease = this.cp.crease( Math.random(), Math.random(), Math.random(), Math.random() );
		if(Math.random() < 0.5){ crease.mountain(); } 
		else{                    crease.valley(); }
	}
	this.cp.clean();
	this.initialize();
}
chopMV.reset();

chopMV.onFrame = function(event) { }
chopMV.onResize = function(event) { }
chopMV.onMouseDown = function(event){ this.reset(); }
chopMV.onMouseUp = function(event){ }
chopMV.onMouseMove = function(event) { }


