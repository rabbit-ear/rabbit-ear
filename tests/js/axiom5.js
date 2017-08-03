function axiom5(){
	var canvas = document.getElementById('canvas-axiom-5');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	var cp = new CreasePattern();
	var paperCP = new PaperCreasePattern(scope, cp);

	var selected = undefined;

	var decorationLayer = new scope.Layer();
	decorationLayer.activate();
	var mark1 = new scope.Shape.Circle({
		center: [0.0, 0.0], radius: 0.02, strokeWidth:0.01,
		strokeColor: { hue:220, saturation:0.6, brightness:1 }
	});
	var mark2 = new scope.Shape.Circle({
		center: [0.5, 1.0], radius: 0.02, strokeWidth:0.01,
		strokeColor: { hue:220, saturation:0.6, brightness:1 }
	});
	var mark3 = new scope.Shape.Circle({
		center: [0.33333, 0.5], radius: 0.02, strokeWidth:0.01,
		strokeColor: { hue:220, saturation:0.6, brightness:1 }
	});
	var mark4 = new scope.Shape.Circle({
		center: [0.66666, 0.5], radius: 0.02, strokeWidth:0.01,
		strokeColor: { hue:220, saturation:0.6, brightness:1 }
	});

	//{ hue:130, saturation:0.8, brightness:0.7 }


	var edge = cp.creaseThroughPoints(mark1.position, mark2.position).mountain();
	var newCreases = cp.creasePointToLine(mark3.position, mark4.position, edge);
	newCreases.forEach(function(el){ el.valley(); });
	paperCP.initialize();
	if(newCreases.length >= 2){
		paperCP.edges[ newCreases[1].index ].strokeColor = { hue:20, saturation:0.6, brightness:1 };
	}
	// algorithm helper visuals
	var radius = Math.sqrt( Math.pow(mark4.position.x - mark3.position.x,2) + Math.pow(mark4.position.y - mark3.position.y,2));
	var markers = circleLineIntersectionAlgorithm(mark3.position, radius, mark1.position, mark2.position);
	if(markers.length >= 2){
		new scope.Shape.Circle({
			center: [markers[0].x, markers[0].y], radius: 0.02, strokeWidth:0.01,
			strokeColor: { hue:130, saturation:0.8, brightness:0.7 }
		});
		new scope.Shape.Circle({
			center: [markers[1].x, markers[1].y], radius: 0.02, strokeWidth:0.01,
			strokeColor: { hue:20, saturation:0.6, brightness:1 }
		});
	}


	// scope.view.onFrame = function(event) { }
	scope.view.onResize = function(event) {
		paper = scope;
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event) {
		mousePos = event.point;
		if(selected != undefined){
			selected.position = mousePos;
			cp.clear();
			var edge = cp.creaseThroughPoints(mark1.position, mark2.position).mountain();
			var newCreases = cp.creasePointToLine(mark3.position, mark4.position, edge);
			newCreases.forEach(function(el){ el.valley(); });
			paperCP.initialize();
			if(newCreases.length >= 2){
				paperCP.edges[ newCreases[1].index ].strokeColor = { hue:20, saturation:0.6, brightness:1 };
			}
			// algorithm helper visuals
			var radius = Math.sqrt( Math.pow(mark4.position.x - mark3.position.x,2) + Math.pow(mark4.position.y - mark3.position.y,2));
			var markers = circleLineIntersectionAlgorithm(mark3.position, radius, mark1.position, mark2.position);
			if(markers.length >= 2){
				new scope.Shape.Circle({
					center: [markers[0].x, markers[0].y], radius: 0.02, strokeWidth:0.01,
					strokeColor: { hue:130, saturation:0.8, brightness:0.7 }
				});
				new scope.Shape.Circle({
					center: [markers[1].x, markers[1].y], radius: 0.02, strokeWidth:0.01,
					strokeColor: { hue:20, saturation:0.6, brightness:1 }
				});
			}
		}
	}
	scope.view.onMouseDown = function(event){
		paper = scope;
		var eps = 0.02;
		mousePos = event.point;
		if(mousePos.x - eps < mark1.position.x && mousePos.x + eps > mark1.position.x && 
		   mousePos.y - eps < mark1.position.y && mousePos.y + eps > mark1.position.y){
		   	selected = mark1;
		}
		else if(mousePos.x - eps < mark2.position.x && mousePos.x + eps > mark2.position.x && 
		        mousePos.y - eps < mark2.position.y && mousePos.y + eps > mark2.position.y){
		   	selected = mark2;
		}
		else if(mousePos.x - eps < mark3.position.x && mousePos.x + eps > mark3.position.x && 
		        mousePos.y - eps < mark3.position.y && mousePos.y + eps > mark3.position.y){
		   	selected = mark3;
		}
		else if(mousePos.x - eps < mark4.position.x && mousePos.x + eps > mark4.position.x && 
		        mousePos.y - eps < mark4.position.y && mousePos.y + eps > mark4.position.y){
		   	selected = mark4;
		}
		else{ selected = undefined; }
	}
	scope.view.onMouseUp = function(event){
		selected = undefined;
	}
} axiom5();
