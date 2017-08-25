var nearAngleCallback;

var nearAngle = new PaperCreasePattern("canvas-nearest-angle", new PlanarGraph());

nearAngle.reset = function(){
	// make 3 fan lines with a good sized interior angle between them
	var center = new XYPoint(0.5, 0.5);
	var angle = 0;
	while(angle < Math.PI*2){
		var len = 0.5;
		this.cp.newPlanarEdge(0.5, 0.5, 0.5+len*Math.cos(angle), 0.5+len*Math.sin(angle) );
		angle+= Math.PI/7;
	}
	this.cp.cleanDuplicateNodes();
	this.initialize();
	for(var i = 0; i < this.edges.length; i++){ this.edges[i].strokeColor = {gray:0.0}; }
}
nearAngle.reset();

nearAngle.onFrame = function(event) { }
nearAngle.onResize = function(event) { }
nearAngle.onMouseDown = function(event){
	this.reset();
}
nearAngle.onMouseUp = function(event){ }
nearAngle.onMouseMove = function(event) {
	this.update();
	for(var i = 0; i < this.edges.length; i++){ this.edges[i].strokeColor = {gray:0.0}; }
	var angle = this.cp.getNearestInteriorAngle(event.point.x, event.point.y);
	if(angle === undefined) return;
	for(var i = 0; i < angle.edges.length; i++){
		var index = angle.edges[i].index;
		this.edges[ index ].strokeColor = { hue:0, saturation:0.8, brightness:1 };
		this.edges[ index ].bringToFront();
	}
	if(nearAngleCallback != undefined){ nearAngleCallback(event.point); }
}
