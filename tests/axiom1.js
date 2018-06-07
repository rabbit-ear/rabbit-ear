var axiom1 = new OrigamiPaper("canvas-axiom-1").setPadding(0.05);
axiom1.circleStyle = {radius: 0.02, strokeWidth: 0.01, strokeColor:axiom1.styles.byrne.blue};
axiom1.style.valley.strokeColor = axiom1.styles.byrne.red;

axiom1.redraw = function(){
	this.cp.clear();
	var crease = this.cp.creaseThroughPoints(this.touchPoints[0].position, this.touchPoints[1].position);
	if(crease){ crease.valley(); }
	this.draw();
}
axiom1.reset = function(){
	[[0.0, 0.0],[1.0, 1.0]].forEach(function(point){ this.makeTouchPoint(point, this.circleStyle); },this);
	this.redraw();
}
axiom1.reset();

axiom1.onFrame = function(event){ }
axiom1.onResize = function(event){ }
axiom1.onMouseMove = function(event){
	if(this.mouse.isPressed){ this.redraw(); }
}
axiom1.onMouseDown = function(event){ }
axiom1.onMouseUp = function(event){ }
