function axiom7(){
	var canvas = document.getElementById('canvas-axiom-7');
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
		center: [0.5, 0.0], radius: 0.02, strokeWidth:0.01,
		strokeColor: { hue:220, saturation:0.6, brightness:1 }
	});
	var mark2 = new scope.Shape.Circle({
		center: [1.0, 1.0], radius: 0.02, strokeWidth:0.01,
		strokeColor: { hue:220, saturation:0.6, brightness:1 }
	});
	var mark3 = new scope.Shape.Circle({
		center: [0.0, 0.75], radius: 0.02, strokeWidth:0.01,
		strokeColor: { hue:220, saturation:0.6, brightness:1 }
	});
	var mark4 = new scope.Shape.Circle({
		center: [1.0, 0.75], radius: 0.02, strokeWidth:0.01,
		strokeColor: { hue:220, saturation:0.6, brightness:1 }
	});
	var mark5 = new scope.Shape.Circle({
		center: [0.5, 0.5], radius: 0.02, strokeWidth:0.01,
		strokeColor: { hue:220, saturation:0.6, brightness:1 }
	});
	var crease1 = cp.creaseThroughPoints(mark1.position, mark2.position).mountain();
	var crease2 = cp.creaseThroughPoints(mark3.position, mark4.position).mountain();
	cp.creasePerpendicularPointOntoLine(mark5.position, crease1, crease2).valley();
	paperCP.initialize();

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
			var crease1 = cp.creaseThroughPoints(mark1.position, mark2.position).mountain();
			var crease2 = cp.creaseThroughPoints(mark3.position, mark4.position).mountain();
			cp.creasePerpendicularPointOntoLine(mark5.position, crease1, crease2).valley();
			paperCP.initialize();
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
		else if(mousePos.x - eps < mark5.position.x && mousePos.x + eps > mark5.position.x && 
		        mousePos.y - eps < mark5.position.y && mousePos.y + eps > mark5.position.y){
		   	selected = mark5;
		}
		else{ selected = undefined; }
	}
	scope.view.onMouseUp = function(event){
		selected = undefined;
	}
} axiom7();
