
var fragmentMV = new OrigamiPaper("canvas-chop-mountain-valley").setPadding(0.025);

fragmentMV.reset = function(numLines){
	if(numLines == undefined){ numLines = 15; }
	this.cp.clear();
	for(var i = 0; i < numLines; i++){
		var crease = this.cp.crease( Math.random(), Math.random(), Math.random(), Math.random() );
		if(i < numLines*0.5){ crease.mountain(); } 
		else{                 crease.valley(); }
	}
	this.cp.fragment();
	this.draw();
}
fragmentMV.reset();

fragmentMV.onFrame = function(event){ }
fragmentMV.onResize = function(event){ }
fragmentMV.onMouseDown = function(event){ this.reset(); }
fragmentMV.onMouseUp = function(event){ }
fragmentMV.onMouseMove = function(event){
	this.update();
	var nearest = this.cp.nearest(event.point);
	if(nearest.edge){
		this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.yellow;
	}
}


