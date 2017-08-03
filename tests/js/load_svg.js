
function load_svg_sketch(){
	var canvas = document.getElementById('canvas-load-svg');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

var cp;
var paperCP;
var svgLayer;

	cp = new CreasePattern();
	paperCP = new PaperCreasePattern(scope, cp);

	var imported = scope.project.importSVG("/tests/svg/crane.svg", function(e){ 
		svgLayer = e;
		console.log(e);
		e.strokeWidth = 0.004;
		var w = e.bounds.size.width;
		var h = e.bounds.size.height;
		var mat = new scope.Matrix(1/w, 0, 0, 1/h, 0, 0);
		e.matrix = mat;

		function recurseAndAdd(childrenArray){
			for(var i = 0; i < childrenArray.length; i++){
				if(childrenArray[i].segments != undefined){ // found a line
					for(var j = 0; j < childrenArray[i].segments.length-1; j++){
						// console.log("adding " + childrenArray[i].segments[j].x + "," + 
						                        // childrenArray[i].segments[j].y);
						cp.creaseOnly(childrenArray[i].segments[j].point, childrenArray[i].segments[j+1].point);
					}
				} else if (childrenArray[i].children != undefined){
					recurseAndAdd(childrenArray[i].children);
				}
			}
		}
		recurseAndAdd(svgLayer.children);
		svgLayer.removeChildren();
		cp.clean();
		cp.chop();
		paperCP.initialize();
	});
	// svgLayer.scale(.01, .01);
	// imported.scale(0.1, 0.1);

	var nearestEdge = undefined;
	// var nearestNode = undefined;

	// var mouseNodeLayer = new scope.Layer();
	// mouseNodeLayer.activate();
	// mouseNodeLayer.removeChildren();
	// var nodeCircle = new scope.Shape.Circle({
	// 	center: [0, 0],
	// 	radius: 0.02,
	// 	fillColor: { hue:0, saturation:0.8, brightness:1 }//{ hue:130, saturation:0.8, brightness:0.7 }
	// });

	scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event){ 
		mousePos = event.point;
		// var nNode = cp.getNearestNode( mousePos.x, mousePos.y );
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		// if(nearestNode !== nNode){
		// 	nearestNode = nNode;
		// 	nodeCircle.position.x = nearestNode.x;
		// 	nodeCircle.position.y = nearestNode.y;
		// }
		if(nearestEdge !== nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < cp.edges.length; i++){
				if(nearestEdge != undefined && nearestEdge === cp.edges[i]){
					// paperCP.edges[i].strokeWidth = paperCP.lineWeight*2;
					paperCP.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
				} else{
					// paperCP.edges[i].strokeWidth = paperCP.lineWeight;
					paperCP.edges[i].strokeColor = paperCP.colorForCrease(cp.edges[i].orientation);
				}
			}
			// console.log("Edge: " + nearestEdge);
		}
	}
	scope.view.onMouseDown = function(event){
		paper = scope;		
	}
} load_svg_sketch();
