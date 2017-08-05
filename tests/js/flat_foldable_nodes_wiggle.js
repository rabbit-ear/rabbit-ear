var flat_foldable_nodes_wiggle_callback;

function flat_foldable_nodes_wiggle(){
	var canvas = document.getElementById('canvas-flat-foldable-nodes-wiggle');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp;
	var paperCP;
	
	var nearestNode = undefined;
	var movingNode = undefined;
	var movingNodeOriginalLocation = undefined;
	
	var nodeLayer = new scope.Layer();

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
		nodeLayer.bringToFront();
		makeFlatFoldableIndicators();
	});

	var nearestEdge = undefined;

	function makeFlatFoldableIndicators(){
		nodeLayer.activate();
		nodeLayer.removeChildren();
		for(var i = 0; i < cp.nodes.length; i++){
			var color = { hue:130, saturation:0.8, brightness:0.7, alpha:0.5 }
			if( !cp.nodes[i].flatFoldable() ){ color = { hue:0, saturation:0.8, brightness:1, alpha:0.5 } }
			var nodeCircle = new scope.Shape.Circle({
				center: [cp.nodes[i].x, cp.nodes[i].y],
				radius: 0.02,
				fillColor: color
			});
		}		
	}

	scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event){ 
		paper = scope;
		if(movingNode != undefined){
			movingNode.x = event.point.x;
			movingNode.y = event.point.y;
			nodeCircle.position.x = movingNode.x;
			nodeCircle.position.y = movingNode.y;
			if(cp != undefined){ makeFlatFoldableIndicators(); }
		} else{
			var nNode = cp.getNearestNode( event.point.x, event.point.y );
			if(nearestNode !== nNode){
				nearestNode = nNode;
				nodeCircle.position.x = nearestNode.x;
				nodeCircle.position.y = nearestNode.y;
				if(flat_foldable_nodes_wiggle_callback != undefined){
					flat_foldable_nodes_wiggle_callback({'point':event.point, 'node':nearestNode.index, 'valid':nearestNode.flatFoldable()});					
				}
			}
		}
		paperCP.initialize();
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
			nodeCircle.position.x = movingNode.x;
			nodeCircle.position.y = movingNode.y;
			movingNode = undefined;
			movingNodeOriginalLocation = undefined;
			if(cp != undefined){ makeFlatFoldableIndicators(); }
			paperCP.initialize();
		}
	}
} flat_foldable_nodes_wiggle();
