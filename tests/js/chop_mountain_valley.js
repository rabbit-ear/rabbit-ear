
var chopMV = new PaperCreasePattern(new CreasePattern(), "canvas-chop-mountain-valley");
chopMV.zoomToFit(0.05);

// chopMV.nearestNodeColor = { hue:0, saturation:0.8, brightness:1 };
chopMV.nearestEdgeColor = { hue:0, saturation:0.8, brightness:1 };

chopMV.reset = function(){
	var NUM_LINES = 10;
	chopMV.cp.clear();
	for(var i = 0; i < NUM_LINES; i++){
		var crease = chopMV.cp.creaseOnly( new XYPoint(Math.random(), Math.random()), new XYPoint(Math.random(), Math.random()) );
		if(Math.random() < 0.5){ crease.mountain(); } 
		else{                    crease.valley(); }
	}
	chopMV.cp.clean();
	chopMV.initialize();
}
chopMV.reset();

chopMV.onFrame = function(event) { }
chopMV.onResize = function(event) { }
chopMV.onMouseDown = function(event){ chopMV.reset(); }
chopMV.onMouseUp = function(event){ }
chopMV.onMouseMove = function(event) { }


