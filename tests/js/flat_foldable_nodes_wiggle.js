var flat_foldable_nodes_wiggle_callback;
var flat_foldable_nodes_callback;

var ffMoveNode = new OrigamiPaper("canvas-flat-foldable-nodes-wiggle");
ffMoveNode.zoomToFit(0.05);

nearestNode = undefined;
ffMoveNode.movingNode = undefined;
ffMoveNode.mNodeOriginalLocation = undefined;
ffMoveNode.nNode = undefined;
ffMoveNode.selectNearestNode = true;
ffMoveNode.style.selectedNode = { 
	fillColor: undefined, 
	strokeWidth: 0.005,
	strokeColor: { gray:0 }
}
ffMoveNode.style.nodes = { 
	visible: true,
	fillColor: undefined,
	strokeColor: undefined,
	strokeWidth: 0.0,
	radius: 0.02 
};

// loadSVG("/tests/svg/sea-turtle-errors.svg", function(e){ 
loadSVG("/tests/svg/crane.svg", function(e){ 
	ffMoveNode.cp = e;
	ffMoveNode.initialize();
	if(ffMoveNode.nodeLayer != undefined && ffMoveNode.nodeLayer.moveToFront != undefined) ffMoveNode.nodeLayer.moveToFront();
	ffMoveNode.colorNodesFlatFoldable();
	for(var i = 0; i < ffMoveNode.nodes.length; i++){ ffMoveNode.nodes[i].radius = 0.02; }
});

ffMoveNode.colorNodesFlatFoldable = function(){
	for(var i = 0; i < ffMoveNode.cp.nodes.length; i++){
		var color = { hue:130, saturation:0.8, brightness:0.7, alpha:0.5 }
		if( !ffMoveNode.cp.nodes[i].flatFoldable() ){ color = { hue:0, saturation:0.8, brightness:1, alpha:0.5 } }
		ffMoveNode.nodes[i].fillColor = color;
	}
}

ffMoveNode.reset = function(){
	ffMoveNode.cp.clear();
	ffMoveNode.initialize();
}
ffMoveNode.reset();

ffMoveNode.onFrame = function(event) { }
ffMoveNode.onResize = function(event) { }
ffMoveNode.onMouseDown = function(event){ 
	ffMoveNode.movingNode = ffMoveNode.cp.getNearestNode( event.point.x, event.point.y );
	ffMoveNode.mNodeOriginalLocation = new XY(ffMoveNode.movingNode.x, ffMoveNode.movingNode.y);
	if(ffMoveNode.cp != undefined){ ffMoveNode.colorNodesFlatFoldable(); }
}
ffMoveNode.onMouseUp = function(event){ 
	if(ffMoveNode.movingNode != undefined && ffMoveNode.mNodeOriginalLocation != undefined){
		ffMoveNode.movingNode.x = ffMoveNode.mNodeOriginalLocation.x;
		ffMoveNode.movingNode.y = ffMoveNode.mNodeOriginalLocation.y;
		ffMoveNode.movingNode = undefined;
		ffMoveNode.mNodeOriginalLocation = undefined;
		ffMoveNode.update();
	}
	if(ffMoveNode.cp != undefined){ ffMoveNode.colorNodesFlatFoldable(); }
}
ffMoveNode.onMouseMove = function(event) { 
	if(ffMoveNode.movingNode != undefined){
		ffMoveNode.movingNode.x = event.point.x;
		ffMoveNode.movingNode.y = event.point.y;
		ffMoveNode.update();
	} else{
		var nNode = ffMoveNode.cp.getNearestNode( event.point.x, event.point.y );
		if(nearestNode !== nNode){
			nearestNode = nNode;
		}
	}
	if(ffMoveNode.cp != undefined){ ffMoveNode.colorNodesFlatFoldable(); }
	if(flat_foldable_nodes_wiggle_callback != undefined){
		flat_foldable_nodes_wiggle_callback({'point':event.point, 'node':nearestNode.index, 'valid':nearestNode.flatFoldable()});
	}
}
