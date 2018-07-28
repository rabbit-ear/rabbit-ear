var axiom7 = new OrigamiPaper("canvas-axiom-7").setPadding(0.05);
axiom7.circleStyle = {radius: 0.02, strokeWidth: 0.01, strokeColor:axiom7.styles.byrne.blue};
axiom7.style.valley.strokeColor = axiom7.styles.byrne.red;

axiom7.redraw = function(){
	axiom7.cp.clear();
	var crease1 = this.cp.creaseThroughPoints(this.touchPoints[0].position, this.touchPoints[1].position).mark();
	var crease2 = this.cp.creaseThroughPoints(this.touchPoints[2].position, this.touchPoints[3].position).mark();
	this.cp.creasePerpendicularPointOntoLine(this.touchPoints[4].position, crease1, crease2).valley();
	this.draw();
}
axiom7.reset = function(){
	[[1.0, 0.0],
	 [0.5, 1.0],
	 [0.0, 0.0],
	 [1.0, 1.0],
	 [0.5, 0.0]].forEach(function(point){ this.makeTouchPoint(point, this.circleStyle); },this);
	this.redraw();
}
axiom7.reset();

axiom7.onFrame = function(event){ }
axiom7.onResize = function(event){ }
axiom7.onMouseMove = function(event){
	if(this.mouse.isPressed){ this.redraw(); }
}
axiom7.onMouseDown = function(event){ }
axiom7.onMouseUp = function(event){ }
