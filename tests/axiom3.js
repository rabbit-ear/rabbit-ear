var axiom3 = new OrigamiPaper("canvas-axiom-3").setPadding(0.05);
axiom3.circleStyle = {radius: 0.02, strokeWidth: 0.01, strokeColor:axiom3.styles.byrne.blue};
axiom3.style.valley.strokeColor = axiom3.styles.byrne.red;

axiom3.redraw = function(){
	this.cp.clear();
	var a = this.cp.creaseThroughPoints(this.selectable[0].position, this.selectable[1].position).mark();
	var b = this.cp.creaseThroughPoints(this.selectable[2].position, this.selectable[3].position).mark();
	var edges = this.cp.creaseEdgeToEdge(a, b);
	edges.forEach(function(el){el.valley();});
	this.draw();
	if(edges.length >= 2){
		this.edges[edges[1].index].strokeColor = this.styles.byrne.yellow;
	}
}
axiom3.reset = function(){
	this.makeControlPoints(4, this.circleStyle);
	[[0.0, 0.0],
	 [1.0, 1.0],
	 [0.3333, 1.0],
	 [1.0, 0.3333] ].forEach(function(el,i){this.selectable[i].position = el;},this);
	this.redraw();
}
axiom3.reset();

axiom3.onFrame = function(event){ }
axiom3.onResize = function(event){ }
axiom3.onMouseMove = function(event){
	if(this.mouse.isPressed){ this.redraw(); }
}
axiom3.onMouseDown = function(event){ }
axiom3.onMouseUp = function(event){ }
