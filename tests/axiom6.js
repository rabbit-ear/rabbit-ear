var axiom6 = new OrigamiPaper("canvas-axiom-6").setPadding(0.05);
axiom6.circleStyle = {radius: 0.02, strokeWidth: 0.01, strokeColor:axiom6.styles.byrne.blue};
axiom6.axiomStrokeColors = [axiom6.style.valley.strokeColor,  axiom6.styles.byrne.red,  axiom6.styles.byrne.yellow, axiom6.styles.byrne.blue ]

axiom6.redraw = function(){
	this.cp.clear();
	var a = this.cp.creaseThroughPoints(this.touchPoints[0].position, this.touchPoints[1].position).mark();
	var b = this.cp.creaseThroughPoints(this.touchPoints[2].position, this.touchPoints[3].position).mark();
	var newCreases = this.cp.creasePointsToLines(this.touchPoints[4].position, this.touchPoints[5].position, a, b);
	newCreases.forEach(function(el){ el.valley(); });
	this.draw();
	
	for (var i = 0; i < newCreases.length; ++i) {
		this.edges[ newCreases[i].index ].strokeColor = this.axiomStrokeColors[i];
		
		// algorithm helper visuals
		for (var j = 0; j <= 1; ++j) {
			var perp = new Line(this.touchPoints[j + 4].position, newCreases[i].vector().rotate90());
			var line = new Edge(this.touchPoints[2 * j].position, this.touchPoints[2 * j + 1].position);
			var marker = perp.intersection(line);
			if (marker != undefined)
			{
				var circle = new this.scope.Shape.Circle({
					center: [marker.x, marker.y], radius: 0.02, strokeWidth:0.01,
					strokeColor: this.axiomStrokeColors[i]
				});
				circle.strokeColor.alpha = 0.5;
			}
		}
	}
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
