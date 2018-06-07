var oneSector = new OrigamiPaper("canvas-one-sector", new CreasePattern().setBoundary([new XY(-1.0,-1.0),new XY(1.0,-1.0),new XY(1.0,1.0),new XY(-1.0,1.0)]));

oneSector.show.sectors = true;
oneSector.style.sector.scale = 0.5;
oneSector.style.mountain.strokeWidth = 0.03;
oneSector.style.valley.strokeWidth = 0.03;
oneSector.style.mountain.strokeColor = oneSector.styles.byrne.yellow;
oneSector.style.valley.dashArray = null;
oneSector.style.valley.strokeColor = oneSector.styles.byrne.blue;
// oneSector.cp.edges = oneSector.cp.edges.filter(function(el){ return el.orientation !== CreaseDirection.border});
oneSector.edgeLayer.bringToFront();

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
	this.cp.edges = this.cp.edges.filter(function(el){return el.orientation !== CreaseDirection.border; },this);
	this.cp.flatten();
	this.draw();
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
oneSector.onMouseUp = function(event){  this.draggingNode = undefined;  }
oneSector.onMouseMove = function(event){
	if(this.draggingNode !== undefined){
		this.draggingNode.x = event.point.x;
		this.draggingNode.y = event.point.y;
	}
	this.cp.flatten();
	this.draw();
}
oneSector.onMouseDidBeginDrag = function(event){ }
