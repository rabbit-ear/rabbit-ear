var polygonClip = new OrigamiPaper("canvas-polygon-clip");

polygonClip.style.circleStyle = { radius: 0.015, strokeWidth: null, fillColor: {gray:0.0} };
polygonClip.style.valley.strokeColor = {gray:0.0};
polygonClip.style.valley.dashArray = null;

polygonClip.handleLayer = new polygonClip.scope.Layer();
polygonClip.handleLayer.activate();
polygonClip.marks = [];
for(var i = 0; i < 6; i++){ 
	polygonClip.marks.push(new polygonClip.scope.Shape.Circle(polygonClip.style.circleStyle));
}
polygonClip.marks[0].position = [0.10, 0.10];
polygonClip.marks[1].position = [0.15, 0.15];
polygonClip.marks[2].position = [0.90, 0.10];
polygonClip.marks[3].position = [0.85, 0.15];
polygonClip.marks[4].position = [0.10, 0.666];
polygonClip.marks[5].position = [0.90, 0.666];

polygonClip.handleLayer.moveBelow(polygonClip.edgeLayer);
polygonClip.selectedLayer = new polygonClip.scope.Layer();
polygonClip.selectedLayer.activate();

polygonClip.resetBoundary = function(){
	var points = [];
	for(var i = 0; i < 10; i++){ points.push(new XY(Math.random(), Math.random()));}
	this.cp.setBoundary(points);
	this.draw();	
}
polygonClip.resetBoundary();

var noCrease = new Crease(undefined, undefined, undefined);

polygonClip.reset = function(){
	var xys = this.marks.map(function(el){ return new XY(el.position.x, el.position.y); });

	var line = new Line(xys[0], xys[1]);
	var ray = new Ray(xys[2], xys[3].subtract(xys[2]));
	var edge = new Edge(xys[4], xys[5]);

	this.cp.clear();
	(this.cp.creaseThroughPoints(line.nodes[0], line.nodes[1]) || noCrease).valley();
	(this.cp.creaseRay(ray.origin, ray.direction) || noCrease).valley();
	(this.cp.crease(edge.nodes[0], edge.nodes[1]) || noCrease).valley();
	this.draw();
}
polygonClip.reset();

polygonClip.onFrame = function(event) { }
polygonClip.onResize = function(event) { }
polygonClip.onMouseDown = function(event){
	this.selectedNode = undefined;
	this.marks.forEach(function(el){
		if(pointsSimilar(event.point, el.position,0.05)){this.selectedNode = el;}
	},this);
}
polygonClip.onMouseUp = function(event){
	this.selectedNode = undefined;
}
polygonClip.onMouseMove = function(event) {
	var selectedNodePosition = undefined;
	if(this.selectedNode === undefined){
		for(var i = 0; i < this.marks.length; i++){
			if(pointsSimilar(event.point, this.marks[i].position,0.05)){
				selectedNodePosition = this.marks[i].position;
				break;
			}
		}
	} else {
		selectedNodePosition = this.selectedNode.position;
		this.selectedNode.position = event.point;
		this.reset();
	}
	this.selectedLayer.activate();
	this.selectedLayer.removeChildren();
	if(selectedNodePosition !== undefined){
		var circle = new this.scope.Shape.Circle(this.style.circleStyle);
		circle.fillColor = this.styles.byrne.yellow;
		circle.position = selectedNodePosition;		
	}
}
