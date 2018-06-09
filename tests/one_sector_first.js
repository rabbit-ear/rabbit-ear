var oneSector = new OrigamiPaper("canvas-one-sector", new CreasePattern().setBoundary([new XY(-1.0,-1.0),new XY(1.0,-1.0),new XY(1.0,1.0),new XY(-1.0,1.0)]));

oneSector.style.mountain.strokeWidth = 0.03;
oneSector.style.valley.strokeWidth = 0.03;
oneSector.style.mountain.strokeColor = oneSector.styles.byrne.yellow;
oneSector.style.valley.dashArray = null;
oneSector.style.valley.strokeColor = oneSector.styles.byrne.red;
oneSector.cp.edges = oneSector.cp.edges.filter(function(el){ return el.orientation !== CreaseDirection.border});
oneSector.style.selected.node.fillColor = oneSector.styles.byrne.yellow;
oneSector.style.selected.node.radius = 0.04;


oneSector.validNodes = [];
oneSector.draggingNode = undefined;
oneSector.arcLayer = new oneSector.scope.Layer();
oneSector.arcLayer.sendToBack();
oneSector.backgroundLayer.sendToBack();
// oneSector.edgeLayer.bringToFront();
// oneSector.mouseDragLayer.bringToFront();

oneSector.updateAngles = function(){
	this.arcLayer.activate();
	this.arcLayer.removeChildren();
	var nodes = this.validNodes.map(function(el){return new XY(el.x, el.y);});

	var sector = new Sector(this.centerNode, this.validNodes);

	var small = sector.bisect().direction;
	// bisect smaller angle
	var arc1Pts = [ new XY(this.validNodes[0].x, this.validNodes[0].y), small, new XY(this.validNodes[1].x, this.validNodes[1].y) ];
	for(var i = 0; i < 3; i++){ arc1Pts[i] = arc1Pts[i].normalize().scale(0.5); }
	// draw things
	var smallArc = new this.scope.Path.Arc(arc1Pts[0], arc1Pts[1], arc1Pts[2]);
	smallArc.add(new this.scope.Point(0.0, 0.0));
	smallArc.closed = true;
	// var smallLine = new this.scope.Path({segments:[[0.0, 0.0], [small.x,small.y]], closed:true});

	// Object.assign(smallLine, this.style.mountain);
	// Object.assign(smallLine, {strokeColor:this.styles.byrne.yellow});
	Object.assign(smallArc, this.style.mountain);
	Object.assign(smallArc, {strokeColor:null, fillColor:this.styles.byrne.blue});
}

oneSector.reset = function(){
	var angles = [Math.random()*Math.PI*2, Math.random()*Math.PI*2];
	var creases = [
		this.cp.crease(new XY(0.0, 0.0), new XY(0.8*Math.cos(angles[0]), 0.8*Math.sin(angles[0]))).mountain(),
		this.cp.crease(new XY(0.0, 0.0), new XY(0.8*Math.cos(angles[1]), 0.8*Math.sin(angles[1]))).valley()
	];
	this.cp.clean();
	this.validNodes = [
		creases[0].uncommonNodeWithEdge(creases[1]),
		creases[1].uncommonNodeWithEdge(creases[0])
	];
	this.centerNode = creases[0].commonNodeWithEdge(creases[1]);
	this.draw();
	this.updateAngles();
}
oneSector.reset();

oneSector.onFrame = function(event) { }
oneSector.onResize = function(event) { }
oneSector.onMouseDown = function(event){
	var nearest = this.cp.nearest(event.point);
	if(this.validNodes.filter(function(e){return e === nearest.node;},this).length > 0){
		this.draggingNode = nearest.node;
	}
}
oneSector.onMouseUp = function(event){
	this.draggingNode = undefined;
}
oneSector.onMouseMove = function(event){
	if(this.draggingNode !== undefined){
		this.draggingNode.x = event.point.x;
		this.draggingNode.y = event.point.y;
	}
	this.update();
	this.updateAngles();
}
oneSector.onMouseDidBeginDrag = function(event){ }
