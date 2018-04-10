var drawRay = new OrigamiPaper("canvas-draw-ray");
drawRay.lineLayer = new drawRay.scope.Layer();
drawRay.cp.setSymmetryLine(new Line(0.5, 0.0, 0.5, 1.0));

drawRay.reset = function(){
	this.lineLayer.removeChildren();
	// this.cp
	// this.draw();
}
drawRay.reset();

drawRay.onFrame = function(event) { }
drawRay.onResize = function(event) { }
drawRay.onMouseDown = function(event){ }
drawRay.onMouseUp = function(event){
	this.lineLayer.removeChildren();
	this.cp.creaseRayRepeat(this.mouse.pressed, this.mouseVector);
	this.draw();
}
drawRay.onMouseMove = function(event) {
	this.lineLayer.activate();
	this.lineLayer.removeChildren();
	if(this.mouse.isPressed){
		this.mouseVector = this.mouse.position.subtract(this.mouse.pressed).normalize();
		this.drawArrowLine(this.mouse.pressed, this.mouseVector);
	}
}

drawRay.drawArrowLine = function(origin, vector){
	var length = 0.15;
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
