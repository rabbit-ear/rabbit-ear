var axiom5 = new OrigamiPaper("canvas-axiom-5").setPadding(0.05);
axiom5.circleStyle = {radius: 0.02, strokeWidth: 0.01, strokeColor:axiom5.styles.byrne.blue};
axiom5.axiomStrokeColors = [axiom5.styles.byrne.red, axiom5.styles.byrne.yellow];

axiom5.redraw = function(){
	this.cp.clear();
	var edge = this.cp.creaseThroughPoints(this.touchPoints[0].position, this.touchPoints[1].position).mark();
	var newCreases = this.cp.creasePointToLine(this.touchPoints[2].position, this.touchPoints[3].position, edge);
	newCreases.forEach(function(el){ el.valley(); });
	this.draw();
	newCreases.forEach(function(c, i){
		this.edges[ c.index ].strokeColor = this.axiomStrokeColors[i];
	},this);
	// algorithm helper visuals
	var radius = Math.sqrt( Math.pow(this.touchPoints[3].position.x - this.touchPoints[2].position.x,2) + Math.pow(this.touchPoints[3].position.y - this.touchPoints[2].position.y,2));
	var circle = new Circle(this.touchPoints[2].position, radius);
	var line = new Edge(this.touchPoints[0].position, this.touchPoints[1].position);
	var markers = circle.intersection(line);
	markers.forEach(function(m,i){
		var circle = new this.scope.Shape.Circle({
			center: [m.x, m.y], radius: 0.02, strokeWidth:0.01,
			strokeColor: this.axiomStrokeColors[i]
		})
		circle.strokeColor.alpha = 0.5;
	},this);
}

axiom5.reset = function(){
	[[0.0, 0.0],
	 [1.0, 1.0],
	 [1.0, 0.25],
	 [0.5, 0.0]].forEach(function(point){ this.makeTouchPoint(point, this.circleStyle); },this);
	this.redraw();
}
axiom5.reset();

axiom5.onFrame = function(event) { }
axiom5.onResize = function(event) { }
axiom5.onMouseMove = function(event) {
	if(this.mouse.isPressed){ this.redraw(); }
}
axiom5.onMouseDown = function(event){ }
axiom5.onMouseUp = function(event){ }
