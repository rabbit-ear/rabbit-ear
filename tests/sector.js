var sectorProject = new OrigamiPaper("canvas-sector", new CreasePattern().setBoundary([ [-1.0,-1.0], [1.0,-1.0], [1.0,1.0], [-1.0,1.0]]));

sectorProject.style.mountain.strokeWidth = 0.03;
sectorProject.style.valley.strokeWidth = 0.03;
sectorProject.style.mountain.strokeColor = sectorProject.styles.byrne.yellow;
sectorProject.style.valley.dashArray = null;
sectorProject.style.valley.strokeColor = sectorProject.styles.byrne.blue;
sectorProject.style.node.radius = 0.04;
// sectorProject.style.node.fillColor = Object.assign({alpha:0.0}, sectorProject.styles.byrne.red);
sectorProject.style.node.fillColor = {gray:0.0, alpha:0.0};
sectorProject.show.nodes = true;

sectorProject.edgeLayer.bringToFront();
sectorProject.nodeLayer.bringToFront();
sectorProject.show.boundary = false;
sectorProject.arcLayer = new sectorProject.scope.Layer();
sectorProject.arcLayer.sendToBack();

sectorProject.updateSector = function(){
	paper = this.scope;
	this.arcLayer.activate();
	this.arcLayer.removeChildren();
	var vectors = this.cp.edges.map(function(edge){ return edge.vector(this.centerNode); },this);
	var arcMidAngle = Math.atan2(vectors[1].y, vectors[1].x) + clockwiseInteriorAngle(vectors[0], vectors[1]) * 0.5;
	var arcVector = new XY(Math.cos(arcMidAngle), Math.sin(arcMidAngle)).normalize().scale(0.5)
	var mid = this.centerNode.copy().add(arcVector);

	var arc1Pts = [ vectors[0], mid, vectors[1] ];
	for(var i = 0; i < 3; i++){ arc1Pts[i] = arc1Pts[i].normalize().scale(0.5); }
	// draw things
	var smallArc = new this.scope.Path.Arc(arc1Pts[0], arc1Pts[1], arc1Pts[2]);
	smallArc.add(new this.scope.Point(0.0, 0.0));
	smallArc.closed = true;
	Object.assign(smallArc, this.style.mountain);
	Object.assign(smallArc, {strokeColor:null, fillColor:this.styles.byrne.red});

	var dot = new this.scope.Path.Circle(mid.normalize().scale(0.9), 0.04);
	dot.style.fillColor = { gray:0.0, alpha:1.0 };

}

sectorProject.reset = function(){
	this.cp.edges = [];
	this.cp.nodes = [];
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
	this.updateSector();
}
sectorProject.reset();

sectorProject.onFrame = function(event) { }
sectorProject.onResize = function(event) { }
sectorProject.onMouseDown = function(event){
	if(this.validNodes.filter(function(e){return e === this.nearestNode;},this).length > 0){
		this.draggingNode = this.nearestNode;
	}
}
sectorProject.onMouseUp = function(event){ this.draggingNode = undefined; }
sectorProject.onMouseMove = function(event){
	this.nearestNode = this.cp.nearest(event.point).node;
	if(this.draggingNode !== undefined){
		this.draggingNode.x = event.point.x;
		this.draggingNode.y = event.point.y;
	}
	this.update();
	this.updateSector();
	if(this.nearestNode != undefined && this.nearestNode !== this.centerNode){
		this.nodes[ this.nearestNode.index ].fillColor.alpha = 1.0;
	}
}
sectorProject.onMouseDidBeginDrag = function(event){ }
