var axiom2 = new OrigamiPaper("canvas-axiom-2").setPadding(0.05);
axiom2.circleStyle = {radius: 0.02, strokeWidth: 0.01, strokeColor:axiom2.styles.byrne.blue};
axiom2.style.valley.strokeColor = axiom2.styles.byrne.red;

axiom2.redraw = function(){
	this.cp.clear();
	var crease = this.cp.creasePointToPoint(this.selectable[0].position, this.selectable[1].position);
	if(crease){ crease.valley(); }
	this.draw();
}
axiom2.reset = function(){
	this.makeControlPoints(2, this.circleStyle);
	[[0.0, 0.0],[1.0, 1.0]].forEach(function(el,i){this.selectable[i].position = el;},this);
	this.redraw();
}
axiom2.reset();

axiom2.onFrame = function(event){ }
axiom2.onResize = function(event){ }
axiom2.onMouseMove = function(event){
	if(this.mouse.isPressed){ this.redraw(); }
}
axiom2.onMouseDown = function(event){ }
axiom2.onMouseUp = function(event){ }
