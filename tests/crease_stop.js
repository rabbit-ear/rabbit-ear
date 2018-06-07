var creaseStopCallback = undefined;
var creaseStop = new OrigamiPaper("canvas-crease-stop");

creaseStop.style.valley.strokeColor = creaseStop.styles.byrne.red;
creaseStop.style.valley.dashArray = null;
creaseStop.style.mountain.strokeColor = creaseStop.styles.byrne.yellow;
creaseStop.style.mark.strokeColor = creaseStop.styles.byrne.blue;
creaseStop.style.mark.strokeWidth = creaseStop.style.mountain.strokeWidth;

creaseStop.reset = function(){
	this.cp.clear();
	[...Array(6)].forEach(function(el){
		this.makeTouchPoint([Math.random(), Math.random()], {radius:0.015,strokeWidth:0.01,strokeColor:{gray:0.0},fillColor:{gray:1.0}})
	},this);
}
creaseStop.reset();

creaseStop.updateCreases = function(){
	this.cp.clear();
	var edge = new Edge(this.touchPoints[0].position, this.touchPoints[1].position);
	var ray = new Ray(this.touchPoints[2].position, new XY(this.touchPoints[3].position.x-this.touchPoints[2].position.x, this.touchPoints[3].position.y-this.touchPoints[2].position.y));
	var line = new Line(this.touchPoints[4].position, new XY(this.touchPoints[5].position.x-this.touchPoints[4].position.x, this.touchPoints[5].position.y-this.touchPoints[4].position.y));
	
	var edgeCrease = this.cp.creaseAndStop(edge);
	var rayCrease = this.cp.creaseAndStop(ray);
	var lineCrease = this.cp.creaseAndStop(line);
	if(edgeCrease){ edgeCrease.valley(); }
	if(rayCrease){ rayCrease.mountain(); }
	if(lineCrease){ lineCrease.mark(); }

	this.draw();

	if(creaseStopCallback !== undefined){
		var points = this.touchPoints.map(function(el){return {'x':el.position.x, 'y':el.position.y}});
		points[3] = {'x':points[3].x-points[2].x, 'y':points[3].y-points[2].y};
		points[5] = {'x':points[5].x-points[4].x, 'y':points[5].y-points[4].y};
		var data = {'points':points};
		creaseStopCallback(data);
	}
}
creaseStop.updateCreases();

creaseStop.onFrame = function(event){ }
creaseStop.onResize = function(event){ }
creaseStop.onMouseDown = function(event){ }
creaseStop.onMouseUp = function(event){ }
creaseStop.onMouseMove = function(event){ if(this.mouse.isDragging){ this.updateCreases(); } }
