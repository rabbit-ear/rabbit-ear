var rayReflect = new OrigamiPaper("canvas-ray-reflect");
rayReflect.lineLayer = new rayReflect.scope.Layer();
// rayReflect.cp.setSymmetryLine(new XY(0.5, 0.0), new XY(0.5, 1.0));

rayReflect.reset = function(){
	this.lineLayer.removeChildren();
	for(var i = 0; i < 5; i++){
		this.cp.crease(Math.random(), Math.random(), Math.random(), Math.random());
	}
	this.cp.clean();
	this.draw();
}
rayReflect.reset();

rayReflect.onFrame = function(event) { }
rayReflect.onResize = function(event) { }
rayReflect.onMouseDown = function(event){ }
rayReflect.onMouseUp = function(event){
	this.lineLayer.removeChildren();
	var allEdges = this.cp.edges.map(function(el){
		return new Edge(new XY(el.nodes[0].x, el.nodes[0].y), new XY(el.nodes[1].x, el.nodes[1].y));
	})
	var newLines = reflectRayRepeat(this.mouse.pressed, this.mouseVector, allEdges);
	for(var i = 0 ;i < newLines.length; i++){
		var line = newLines[i];
		this.cp.crease(line.nodes[0].x, line.nodes[0].y, line.nodes[1].x, line.nodes[1].y);
	}
	this.draw();
}
rayReflect.onMouseMove = function(event) {
	this.lineLayer.activate();
	this.lineLayer.removeChildren();
	if(this.mouse.isPressed){
		this.mouseVector = this.mouse.position.subtract(this.mouse.pressed).normalize();
		this.drawArrowLine(this.mouse.pressed, this.mouseVector);
		// lines
		var allEdges = this.cp.edges.map(function(el){
			return new Edge(new XY(el.nodes[0].x, el.nodes[0].y), new XY(el.nodes[1].x, el.nodes[1].y));
		})
		var newLines = reflectRayRepeat(this.mouse.pressed, this.mouseVector, allEdges);
		for(var i = 0 ;i < newLines.length; i++){
			var line = newLines[i];
			var path = new this.scope.Path({segments: [line.nodes[0], line.nodes[1]], closed: false });
			path.strokeColor = {gray:0.5};
			path.strokeWidth = 0.005;
		}
		this.draw();
	}
}

rayReflect.drawArrowLine = function(origin, vector){
	var length = 0.025;
	var arrowSize = 0.05;
	vector = vector.normalize();
	var normal = vector.rotate90();
	var endPoint = origin.add(vector.scale(length));
	var path = new this.scope.Path({segments: [origin, endPoint], closed: false });
	path.strokeColor = {gray:0.0};
	path.strokeWidth = 0.01;

	var arrowhead = new this.scope.Path({segments: [
		endPoint.add(normal.scale(-arrowSize*0.375)), 
		endPoint.add(normal.scale(arrowSize*0.375)), 
		origin.add(vector.scale(length+arrowSize))
		], closed: true });
	arrowhead.fillColor = {gray:0.0};
	arrowhead.strokeColor = null;
}
