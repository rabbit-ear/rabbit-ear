var nearestNodesCallback = undefined;

var nearNodeSketch = new OrigamiPaper("canvas-nearest-nodes", new PlanarGraph());
nearNodeSketch.show.nodes = false;
nearNodeSketch.style.node.radius = 0.004;
nearNodeSketch.pathLinesLayer = new paper.Layer();
nearNodeSketch.pathLinesLayer.activate();
nearNodeSketch.pathLinesLayer.removeChildren();

nearNodeSketch.onFrame = function(event) { }
nearNodeSketch.onResize = function(event) { }
nearNodeSketch.onMouseDown = function(event){
	nearNodeSketch.show.nodes = true;
	this.draw();
}
nearNodeSketch.onMouseUp = function(event){
	nearNodeSketch.show.nodes = false;
	this.draw();
}
nearNodeSketch.onMouseMove = function(event) {
	var nodeCount = 30;
	var nodes = this.cp.nearestNodes(nodeCount, event.point.x, event.point.y );
	this.pathLinesLayer.activate();
	this.pathLinesLayer.removeChildren();
	if(nodes != undefined && nodes.length > 0){
		for(var i = nodes.length-1; i >= 0 ; i--){
			new paper.Path({
				segments: [ nodes[i], event.point ],
				strokeColor: {gray:0.0, alpha:1.0 - i/nodes.length},
				strokeWidth: 0.003,
				closed: false
			});
		}
	}
	if(nearestNodesCallback != undefined){
		nearestNodesCallback( {count:nodeCount,point:event.point} );
	}
}

nearNodeSketch.reset = function(){
	paper = this.scope; 
	var NUM_NODES = 300;
	var aspect = this.canvas.width / this.canvas.height;
	this.cp.clear();
	for(var i = 0; i < NUM_NODES; i++){
		this.cp.newPlanarNode(Math.random()*aspect, Math.random());
	}
	this.draw();
	this.onMouseMove({point:{x:this.cp.bounds().size.width*0.5, y:this.cp.bounds().size.height*0.5}});
}
nearNodeSketch.reset();
