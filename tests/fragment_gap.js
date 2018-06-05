var fragmentCollinear = new OrigamiPaper("canvas-fragment-collinear").setPadding(0.025);
fragmentCollinear.show.boundary = false;

fragmentCollinear.fill = function(numLines){
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	if(numLines == undefined){ numLines = 10; }
	this.cp.crease(0.5, 0.0, 0.5, 1.0);
	for(var i = 0; i < numLines; i++){
		var y = .05 + .9*(i/(numLines-1));
		var x = (1-Math.cos(Math.PI*2*i/(numLines-1)))*0.5;
		this.cp.crease(0.5+x*0.01, y, 0.55+x*0.5, y);
	}
}
fragmentCollinear.reset = function(){
	this.fill();
	this.cp.clean(0.02);
	this.draw();
}
fragmentCollinear.reset();

fragmentCollinear.onFrame = function(event){ }
fragmentCollinear.onResize = function(event){ }
fragmentCollinear.onMouseDown = function(event){
	this.fill();
	this.draw();
}
fragmentCollinear.onMouseUp = function(event){
	this.reset();
}
fragmentCollinear.onMouseMove = function(event){
	if(!this.mouse.isPressed){
		this.update();
		var nearest = this.cp.nearest(event.point);
		if(nearest.edge){ this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.yellow; }	
	}
}
