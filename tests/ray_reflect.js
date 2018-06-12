var rayReflect = new OrigamiPaper("canvas-ray-reflect");
rayReflect.lineLayer = new rayReflect.scope.Layer();
rayReflect.arrowLayer = new rayReflect.scope.Layer();
rayReflect.style.valley.strokeWidth = 0.005;
rayReflect.style.valley.dashArray = [0.012, 0.006];

// rayReflect.reset = function(){
// 	rayReflect.load("/files/svg/waves2.svg", function(){
// 		rayReflect.draw();
// 	});
// }
// rayReflect.reset();

rayReflect.onFrame = function(event) { }
rayReflect.onResize = function(event) { }
rayReflect.onMouseDown = function(event){ }
rayReflect.onMouseUp = function(event){
	this.lineLayer.removeChildren();
	this.arrowLayer.removeChildren();
	var allEdges = this.cp.edges.map(function(el){ return el.copy(); });
	var ray = new Ray(new XY(this.mouse.pressed.x, this.mouse.pressed.y), this.mouseVector);
	var newEdges = new Polyline().rayReflectRepeat(ray, allEdges).edges();
	for(var i = 0; i < newEdges.length; i++){
		var line = newEdges[i];
		this.cp.crease(line.nodes[0].x, line.nodes[0].y, line.nodes[1].x, line.nodes[1].y).valley();
	}
	this.draw();
}
rayReflect.onMouseMove = function(event) {
	if(this.mouse.isPressed){
		this.mouseVector = new XY(this.mouse.position.x-this.mouse.pressed.x,this.mouse.position.y-this.mouse.pressed.y).normalize();
		this.drawArrowLine(new XY(this.mouse.pressed.x, this.mouse.pressed.y), this.mouseVector);
		// lines
		this.lineLayer.activate();
		this.lineLayer.removeChildren();
		var allEdges = this.cp.edges.map(function(el){
			return new Edge(new XY(el.nodes[0].x, el.nodes[0].y), new XY(el.nodes[1].x, el.nodes[1].y));
		})
		var ray = new Ray(this.mouse.pressed, this.mouseVector);
		var newEdges = new Polyline().rayReflectRepeat(ray, allEdges).edges();
		for(var i = 0 ;i < newEdges.length; i++){
			var line = newEdges[i];
			var path = new this.scope.Path({segments: [line.nodes[0], line.nodes[1]], closed: false });
			path.strokeColor = {gray:0.5};
			path.strokeWidth = 0.0025;
		}
		this.draw();
	}
}

rayReflect.drawArrowLine = function(origin, vector){
	this.arrowLayer.activate();
	this.arrowLayer.removeChildren();
	var length = 0.025;
	var arrowSize = 0.033;
	var arrowheadLength = 0.05
	vector = vector.normalize();
	var normal = vector.rotate90();
	var endPoint = origin.add(vector.scale(length));
	var path = new this.scope.Path({segments: [origin, endPoint], closed: false });
	path.strokeColor = {gray:0.0};
	path.strokeWidth = 0.01;

	var arrowhead = new this.scope.Path({segments: [
		endPoint.add(normal.scale(-arrowSize*0.375)), 
		endPoint.add(normal.scale(arrowSize*0.375)), 
		origin.add(vector.scale(length+arrowheadLength))
		], closed: true });
	arrowhead.fillColor = {gray:0.0};
	arrowhead.strokeColor = null;
}
