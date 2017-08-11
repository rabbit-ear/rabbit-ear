
function chop_cross_many(){
	var canvas = document.getElementById('canvas-chop-cross-many');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

var cp;
var paperCP;

	cp = new CreasePattern();
	paperCP = new PaperCreasePattern(scope, cp);

	var nearestEdge = undefined;
	var nearestNode = undefined;

	var NUM_LINES = 30;

	var mouseNodeLayer = new paper.Layer();
	mouseNodeLayer.activate();
	mouseNodeLayer.removeChildren();
	var nodeCircle = new paper.Shape.Circle({
		center: [0, 0],
		radius: 0.01,
		fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
	});

	function resetCP(){
		cp.clear();
		cp.nodes = [];
		cp.edges = [];
		var firstEdge = cp.creaseOnly(new XYPoint(0.0, 0.5), new XYPoint(1.0, 0.5));
		var v = .8/(NUM_LINES-1);
		for(var i = 0; i < NUM_LINES; i++){
			var x = .1 + .8*(i/(NUM_LINES-1));
			cp.creaseOnly(
				new XYPoint(x + Math.random()*v-v*0.5, 0.25 + Math.random()*v-v*0.5), 
				new XYPoint(x + Math.random()*v-v*0.5, 0.75 + Math.random()*v-v*0.5)
			);
		}
		var lowerEdge = cp.creaseOnly(new XYPoint(0.0, 0.6), new XYPoint(1.0, 0.6));
		var crossings = cp.chop();
		// var crossings = cp.chopAllCrossingsWithEdge(lowerEdge);
		// console.log(crossings);
		// console.log(crossings.length + " crossings");
		paperCP.initialize();
	}
	resetCP();

	scope.view.onFrame = function(event){ }
	scope.view.onResize = function(event){
		paper = scope;
		zoomView(scope, canvas.width, canvas.height);
	}
	scope.view.onMouseMove = function(event){ 
		mousePos = event.point;
		var nNode = cp.getNearestNode( mousePos.x, mousePos.y );
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		if(nearestNode !== nNode){
			nearestNode = nNode;
			nodeCircle.position.x = nearestNode.x;
			nodeCircle.position.y = nearestNode.y;
			// console.log("Node: " + nearestNode);
		}
		if(nearestEdge !== nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < cp.edges.length; i++){
				if(nearestEdge != undefined && nearestEdge === cp.edges[i]){
					// paperCP.edges[i].strokeWidth = paperCP.lineWeight*2;
					paperCP.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
				} else{
					// paperCP.edges[i].strokeWidth = paperCP.lineWeight;
					paperCP.edges[i].strokeColor = paperCP.styleForCrease(cp.edges[i].orientation).strokeColor;
				}
			}
			// console.log("Edge: " + nearestEdge);
		}
	}

	scope.view.onMouseDown = function(event){
		paper = scope;
		resetCP();
	}

}  chop_cross_many();