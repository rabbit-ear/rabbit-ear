var project = new OrigamiPaper("canvas-intersect-rays");

var strokeWidth = 0.01;

var black = {hue:0, saturation:0, brightness:0 };
var red = {hue:0.04*360, saturation:0.87, brightness:0.90 };
var yellow = {hue:0.12*360, saturation:0.88, brightness:0.93 };
var darkBlue = {hue:0.53*360, saturation:0.82, brightness:0.28 };
var blue = {hue:0.57*360, saturation:0.74, brightness:0.61};
var circleStyle = { radius: 0.015, strokeWidth: null, fillColor: black };

project.style.valley = { strokeColor: black, strokeWidth: strokeWidth }

project.handleLayer = new project.scope.Layer();
project.handleLayer.activate();
project.marks = [];
for(var i = 0; i < 4; i++){ 
	project.marks.push(new project.scope.Shape.Circle(circleStyle));
}
project.marks[0].position = [0.1, 0.5];
project.marks[1].position = [0.4, 0.5];
project.marks[2].position = [0.5, 0.7];
project.marks[3].position = [0.5, 0.3];

project.intersectionLayer = new project.scope.Layer();
project.handleLayer.moveBelow(project.edgeLayer);
project.intersectionLayer.moveBelow(project.edgeLayer);
project.selectedLayer = new project.scope.Layer();
project.selectedLayer.activate();

project.reset = function(){
	var xys = this.marks.map(function(el){ return new XY(el.position.x, el.position.y); });
	var ray0 = xys[1].subtract(xys[0]);
	var ray1 = xys[3].subtract(xys[2]);

	this.cp.clear();
	this.cp.creaseRay(xys[0], ray0).valley();
	this.cp.creaseRay(xys[2], ray1).valley();
	this.draw();

	this.intersectionLayer.activate();
	this.intersectionLayer.removeChildren();
	var intersection = rayRayIntersection(xys[0], ray0, xys[2], ray1);
	if(intersection !== undefined){

		var interRadius = 0.04;

		var fourPoints = [
			intersection.add(ray0.normalize().scale(interRadius)),
			intersection.add(ray1.normalize().scale(interRadius)),
			intersection.subtract(ray0.normalize().scale(interRadius)),
			intersection.subtract(ray1.normalize().scale(interRadius))
		];
		var arcPoints = [];
		fourPoints.forEach(function(el, i){
			var nextI = (i+1)%fourPoints.length;
			var b = bisect(el.subtract(intersection), fourPoints[nextI].subtract(intersection))[0];
			var arcMidPoint = b.normalize().scale(interRadius).add(intersection);
			var thesePoints = [ fourPoints[i],
			                    arcMidPoint,
			                    fourPoints[nextI] ];
			arcPoints.push(thesePoints);
		});
		var fillColors = [blue, red];
		var arcColors = [yellow, red];
		for(var i = 0; i < 4; i++){
			var fillArc = new this.scope.Path.Arc(arcPoints[i][0], arcPoints[i][1], arcPoints[i][2]);
			fillArc.add(intersection);
			fillArc.closed = true;
			fillArc.strokeWidth = null;
			fillArc.fillColor = fillColors[i%2];

			if(isValidPoint(arcPoints[i][1])){
				// var smallArc = new this.scope.Path.Arc(arcPoints[i][0], arcPoints[i][1], arcPoints[i][2]);
				// smallArc.strokeWidth = 0.02;
				// smallArc.strokeColor = red;//arcColors[i%2];
			}
		}
	}
}
project.reset();

project.onFrame = function(event) { }
project.onResize = function(event) { }
project.onMouseDown = function(event){
	this.selectedNode = undefined;
	this.marks.forEach(function(el){
		if(pointsSimilar(event.point, el.position)){this.selectedNode = el;}
	},this);
}
project.onMouseUp = function(event){
	this.selectedNode = undefined;
}
project.onMouseMove = function(event) {
	var selectedNodePosition = undefined;
	if(this.selectedNode === undefined){
		for(var i = 0; i < this.marks.length; i++){
			if(pointsSimilar(event.point, this.marks[i].position)){
				selectedNodePosition = this.marks[i].position;
				break;
			}
		}
	} else {
		selectedNodePosition = this.selectedNode.position;
		this.selectedNode.position = event.point;
		this.reset();
	}
	this.selectedLayer.activate();
	this.selectedLayer.removeChildren();
	if(selectedNodePosition !== undefined){
		var circle = new project.scope.Shape.Circle(circleStyle);
		circle.strokeWidth = null;
		circle.fillColor = yellow;
		circle.position = selectedNodePosition;		
	}
}
