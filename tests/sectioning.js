var project = new OrigamiPaper("canvas", new CreasePattern().setBoundary([new XY(-1.0,-1.0),new XY(1.0,-1.0),new XY(1.0,1.0),new XY(-1.0,1.0)]));
project.style.mountain.strokeWidth = 0.02;
project.style.mountain.strokeColor = { gray:0.0, alpha:1.0 };
project.cp.edges = project.cp.edges.filter(function(el){ return el.orientation !== CreaseDirection.border});

var validNodes = [];
var draggingNode = undefined;
project.arcLayer = new project.scope.Layer();
project.arcLayer.sendToBack();
project.backgroundLayer.sendToBack();
// project.edgeLayer.bringToFront();
// project.mouseDragLayer.bringToFront();

project.updateAngles = function(){
	this.arcLayer.activate();
	this.arcLayer.removeChildren();
	var nodes = validNodes.map(function(el){return new XY(el.x, el.y);});
	var bisections = bisectVectors(nodes[0], nodes[1]);
	var small = bisections[0];
	var large = bisections[1];
	// bisect smaller angle
	var arc1Pts = [ new XY(validNodes[0].x, validNodes[0].y), small, new XY(validNodes[1].x, validNodes[1].y) ];
	for(var i = 0; i < 3; i++){ arc1Pts[i] = arc1Pts[i].normalize().scale(0.15); }
	// bisect larger angle
	var arc2Pts = [ new XY(validNodes[0].x, validNodes[0].y), large, new XY(validNodes[1].x, validNodes[1].y) ];
	for(var i = 0; i < 3; i++){ arc2Pts[i] = arc2Pts[i].normalize().scale(0.2); }
	// draw things
	var smallArc = new this.scope.Path.Arc(arc1Pts[0], arc1Pts[1], arc1Pts[2]);
	var largeArc = new this.scope.Path.Arc(arc2Pts[0], arc2Pts[1], arc2Pts[2]);
	var smallLine = new this.scope.Path({segments:[[0.0, 0.0], [small.x,small.y]], closed:true});
	var largeLine = new this.scope.Path({segments:[[0.0, 0.0], [large.x,large.y]], closed:true});
	Object.assign(smallLine, this.style.valley);
	Object.assign(largeLine, this.style.valley);
	Object.assign(largeLine, {strokeColor:{ hue:0, saturation:0.8, brightness:1 }});
	Object.assign(smallArc, this.style.mountain);
	Object.assign(largeArc, this.style.mountain);
	Object.assign(smallArc, {strokeColor:{ hue:50, saturation:0.9, brightness:0.9 }});
	Object.assign(largeArc, {strokeColor:{ hue:50, saturation:0.9, brightness:0.9 }});
}

project.reset = function(){
	var creases = [
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random(), Math.random())).mountain(),
		this.cp.crease(new XY(0.0, 0.0), new XY(Math.random(), Math.random())).mountain()
	];
	this.cp.clean();
	validNodes = [
		creases[0].uncommonNodeWithEdge(creases[1]),
		creases[1].uncommonNodeWithEdge(creases[0])
	];
	this.draw();
}
project.reset();

project.onFrame = function(event) { }
project.onResize = function(event) { }
project.onMouseDown = function(event){
	if(validNodes.filter(function(e){return e===this.nearest.node;}).length > 0){
		draggingNode = this.nearest.node;
	}
}
project.onMouseUp = function(event){
	draggingNode = undefined;
}
project.onMouseMove = function(event){
	if(draggingNode !== undefined){
		draggingNode.x = event.point.x;
		draggingNode.y = event.point.y;
	}
	this.update();
	this.updateAngles();
}
project.onMouseDidBeginDrag = function(event){ }
