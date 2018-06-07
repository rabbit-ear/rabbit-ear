var axiom4 = new OrigamiPaper("canvas-axiom-4").setPadding(0.05);
axiom4.circleStyle = {radius: 0.02, strokeWidth: 0.01, strokeColor:axiom4.styles.byrne.blue};
axiom4.style.valley.strokeColor = axiom4.styles.byrne.red;

axiom4.redraw = function(){
	this.cp.clear();
	var edge = this.cp.creaseThroughPoints(this.touchPoints[0].position, this.touchPoints[1].position).mark();
	this.cp.creasePerpendicularThroughPoint(edge, this.touchPoints[2].position).valley();
	this.draw();
}
axiom4.reset = function(){
	[[0.0, 0.0],
	[1.0, 1.0],
	[1.0, 0.5]].forEach(function(point){ this.makeTouchPoint(point, this.circleStyle); },this);
	this.redraw();
}
axiom4.reset();

axiom4.onFrame = function(event){ }
axiom4.onResize = function(event){ }
axiom4.onMouseMove = function(event){
	if(this.mouse.isPressed){ this.redraw(); }
}
axiom4.onMouseDown = function(event){ }
axiom4.onMouseUp = function(event){ }
