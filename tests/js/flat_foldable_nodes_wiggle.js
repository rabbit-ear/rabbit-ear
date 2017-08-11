var flat_foldable_nodes_wiggle_callback;

function flat_foldable_nodes_wiggle(){
	var canvas = document.getElementById('canvas-flat-foldable-nodes-wiggle');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

	var cp;
	var paperCP;
	
	var nearestNode = undefined;
	var movingNode = undefined;
	var movingNodeOriginalLocation = undefined;

	var mouseNodeLayer = new paper.Layer();
	mouseNodeLayer.activate();
	mouseNodeLayer.removeChildren();
	var nodeCircle = new paper.Shape.Circle({
		center: [0, 0],
		radius: 0.02,
		strokeWidth: 0.005,
		strokeColor: { hue:0, saturation:0, brightness:0 }
	});

	loadSVG("/tests/svg/sea-turtle-errors.svg", function(e){ 
		cp = e;
		paperCP = new PaperCreasePattern(scope, cp);
		colorNodesFlatFoldable();
		for(var i = 0; i < paperCP.nodes.length; i++){ paperCP.nodes[i].radius = 0.02; }
	});

	var nearestEdge = undefined;

	function colorNodesFlatFoldable(){
		for(var i = 0; i < cp.nodes.length; i++){
			var color = { hue:130, saturation:0.8, brightness:0.7, alpha:0.5 }
			if( !cp.nodes[i].flatFoldable() ){ color = { hue:0, saturation:0.8, brightness:1, alpha:0.5 } }
			paperCP.nodes[i].fillColor = color;
		}
	}

	scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height);
	}
	scope.view.onMouseMove = function(event){ 
		paper = scope;
		if(movingNode != undefined){
			movingNode.x = event.point.x;
			movingNode.y = event.point.y;
			nodeCircle.position = movingNode;
			paperCP.update();
			if(cp != undefined){ colorNodesFlatFoldable(); }
		} else{
			var nNode = cp.getNearestNode( event.point.x, event.point.y );
			if(nearestNode !== nNode){
				nearestNode = nNode;
				nodeCircle.position = nearestNode;
				if(flat_foldable_nodes_wiggle_callback != undefined){
					flat_foldable_nodes_wiggle_callback({'point':event.point, 'node':nearestNode.index, 'valid':nearestNode.flatFoldable()});					
				}
			}
		}
	}
	scope.view.onMouseDown = function(event){
		paper = scope;
		movingNode = cp.getNearestNode( event.point.x, event.point.y );
		movingNodeOriginalLocation = new XYPoint(movingNode.x, movingNode.y);
	}
	scope.view.onMouseUp = function(event){
		paper = scope;
		if(movingNode != undefined && movingNodeOriginalLocation != undefined){
			movingNode.x = movingNodeOriginalLocation.x;
			movingNode.y = movingNodeOriginalLocation.y;
			nodeCircle.position = movingNode;
			movingNode = undefined;
			movingNodeOriginalLocation = undefined;
			paperCP.update();
			if(cp != undefined){ colorNodesFlatFoldable(); }
		}
	}
} flat_foldable_nodes_wiggle();
