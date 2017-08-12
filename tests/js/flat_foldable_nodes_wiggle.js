var flat_foldable_nodes_wiggle_callback;
var flat_foldable_nodes_callback;

var ffMoveNode = new PaperCreasePattern(new CreasePattern(), "canvas-flat-foldable-nodes-wiggle");
ffMoveNode.zoomToFit(0.05);

nearestNode = undefined;
ffMoveNode.movingNode = undefined;
ffMoveNode.mNodeOriginalLocation = undefined;
ffMoveNode.nNode = undefined;

loadSVG("/tests/svg/sea-turtle-errors.svg", function(e){ 
	ffMoveNode.cp = e;
	ffMoveNode.initialize();
	ffMoveNode.nodeLayer.visible = true;
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

ffMoveNode.nearestNodeColor = { gray:0, alpha:0 };
ffMoveNode.nearestNodeCircle.radius = 0.02;
ffMoveNode.nearestNodeCircle.strokeWidth = 0.005;
ffMoveNode.nearestNodeCircle.strokeColor = { gray:0 };

ffMoveNode.reset = function(){
	ffMoveNode.cp.clear();
	ffMoveNode.initialize();
}
ffMoveNode.reset();

ffMoveNode.onFrame = function(event) { }
ffMoveNode.onResize = function(event) { }
ffMoveNode.onMouseDown = function(event){ 
	ffMoveNode.movingNode = ffMoveNode.cp.getNearestNode( event.point.x, event.point.y );
	ffMoveNode.mNodeOriginalLocation = new XYPoint(ffMoveNode.movingNode.x, ffMoveNode.movingNode.y);
}
ffMoveNode.onMouseUp = function(event){ 
	if(ffMoveNode.movingNode != undefined && ffMoveNode.mNodeOriginalLocation != undefined){
		ffMoveNode.movingNode.x = ffMoveNode.mNodeOriginalLocation.x;
		ffMoveNode.movingNode.y = ffMoveNode.mNodeOriginalLocation.y;
		ffMoveNode.nearestNodeCircle.position = ffMoveNode.movingNode;
		ffMoveNode.movingNode = undefined;
		ffMoveNode.mNodeOriginalLocation = undefined;
		ffMoveNode.update();
		if(ffMoveNode.cp != undefined){ ffMoveNode.colorNodesFlatFoldable(); }
	}
}
ffMoveNode.onMouseMove = function(event) { 
	if(ffMoveNode.movingNode != undefined){
		ffMoveNode.movingNode.x = event.point.x;
		ffMoveNode.movingNode.y = event.point.y;
		ffMoveNode.nearestNodeCircle.position = ffMoveNode.movingNode;
		ffMoveNode.update();
		if(ffMoveNode.cp != undefined){ ffMoveNode.colorNodesFlatFoldable(); }
	} else{
		var nNode = ffMoveNode.cp.getNearestNode( event.point.x, event.point.y );
		if(nearestNode !== nNode){
			nearestNode = nNode;
			ffMoveNode.nearestNodeCircle.position = nearestNode;
		}
	}
	if(flat_foldable_nodes_wiggle_callback != undefined){
		flat_foldable_nodes_wiggle_callback({'point':event.point, 'node':nearestNode.index, 'valid':nearestNode.flatFoldable()});
	}
}




// function flat_foldable_nodes_wiggle(){
// 	var canvas = document.getElementById('canvas-flat-foldable-nodes-wiggle');
// 	var scope = new paper.PaperScope();
// 	// setup paper scope with canvas
// 	scope.setup(canvas);
// 	zoomView(scope, canvas.width, canvas.height);

// 	var cp;
// 	var paperCP;
	
// 	var nearestNode = undefined;
// 	var movingNode = undefined;
// 	var movingNodeOriginalLocation = undefined;

// 	var mouseNodeLayer = new paper.Layer();
// 	mouseNodeLayer.activate();
// 	mouseNodeLayer.removeChildren();
// 	var nodeCircle = new paper.Shape.Circle({
// 		center: [0, 0], radius: 0.02, strokeWidth: 0.005, strokeColor: { gray:0 }
// 	});

// 	scope.view.onFrame = function(event) { }
// 	scope.view.onResize = function(event) {
// 		paper = scope;
// 		zoomView(scope, canvas.width, canvas.height);
// 	}
// 	scope.view.onMouseMove = function(event){ 
// 		paper = scope;
// 		if(movingNode != undefined){
// 			movingNode.x = event.point.x;
// 			movingNode.y = event.point.y;
// 			nodeCircle.position = movingNode;
// 			paperCP.update();
// 			if(cp != undefined){ colorNodesFlatFoldable(); }
// 		} else{
// 			var nNode = cp.getNearestNode( event.point.x, event.point.y );
// 			if(nearestNode !== nNode){
// 				nearestNode = nNode;
// 				nodeCircle.position = nearestNode;
// 				if(flat_foldable_nodes_wiggle_callback != undefined){
// 					flat_foldable_nodes_wiggle_callback({'point':event.point, 'node':nearestNode.index, 'valid':nearestNode.flatFoldable()});					
// 				}
// 			}
// 		}
// 	}
// 	scope.view.onMouseDown = function(event){
// 		paper = scope;
// 		movingNode = cp.getNearestNode( event.point.x, event.point.y );
// 		movingNodeOriginalLocation = new XYPoint(movingNode.x, movingNode.y);
// 	}
// 	scope.view.onMouseUp = function(event){
// 		paper = scope;
// 		if(movingNode != undefined && movingNodeOriginalLocation != undefined){
// 			movingNode.x = movingNodeOriginalLocation.x;
// 			movingNode.y = movingNodeOriginalLocation.y;
// 			nodeCircle.position = movingNode;
// 			movingNode = undefined;
// 			movingNodeOriginalLocation = undefined;
// 			paperCP.update();
// 			if(cp != undefined){ colorNodesFlatFoldable(); }
// 		}
// 	}
// } flat_foldable_nodes_wiggle();
