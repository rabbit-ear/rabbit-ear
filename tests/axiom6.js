var axiom6 = new OrigamiPaper("canvas-axiom-6").setPadding(0.05);
axiom6.circleStyle = {radius: 0.02, strokeWidth: 0.01, strokeColor:axiom6.styles.byrne.blue};
axiom6.axiomStrokeColors = [axiom6.styles.byrne.red, axiom6.styles.byrne.yellow, axiom6.styles.byrne.blue];

axiom6.redraw = function(){
	this.cp.clear();
	var a = this.cp.creaseThroughPoints(this.touchPoints[0].position, this.touchPoints[1].position).mark();
	var b = this.cp.creaseThroughPoints(this.touchPoints[2].position, this.touchPoints[3].position).mark();
	var newCreases = this.cp.creasePointsToLines(this.touchPoints[4].position, this.touchPoints[5].position, a, b);
	newCreases.forEach(function(el){ el.valley(); });
	this.draw();
	newCreases.forEach(function(crease,i){
		this.edges[ crease.index ].strokeColor = this.axiomStrokeColors[i];
		// algorithm helper visuals
		[0,1].map(function(j){
			var perp = new Line(this.touchPoints[j + 4].position, crease.vector().rotate90());
			var line = new Edge(this.touchPoints[2 * j].position, this.touchPoints[2 * j + 1].position);
			return {point: perp.intersection(line), color: Object.assign({alpha:0.5},this.axiomStrokeColors[i])};
		},this)
		.filter(function(el){ return el.point != undefined; },this)
		.forEach(function(el){
			new this.scope.Shape.Circle({center:[el.point.x, el.point.y], radius: 0.02, strokeWidth:0.01, strokeColor: el.color});
		},this);
	},this);
}
axiom6.reset = function(){
	[[0.0, 0.0],
	 [1.0, 1.0],
	 [0.0, 0.75],
	 [1.0, 0.5],
	 [1.0, 0.25],
	 [0.5, 0.0]].forEach(function(point){ this.makeTouchPoint(point, this.circleStyle); },this);
	this.redraw();
}
axiom6.reset();

axiom6.onFrame = function(event) { }
axiom6.onResize = function(event) { }
axiom6.onMouseMove = function(event) {
	if(this.mouse.isPressed){ this.redraw(); }
}
axiom6.onMouseDown = function(event){ }
axiom6.onMouseUp = function(event){ }
