var red = {hue:0.04*360, saturation:0.87, brightness:0.90 };
var yellow = {hue:0.12*360, saturation:0.88, brightness:0.93 };
var blue = {hue:0.53*360, saturation:0.82, brightness:0.28 };
var black = {hue:0, saturation:0, brightness:0 };

var project = new OrigamiPaper("canvas-intersect-ray-segment");
var strokeWidth = 0.01;
project.style.valley = { strokeColor: blue, strokeWidth: strokeWidth }

project.circleStyle = { radius: 0.025, strokeWidth: null, fillColor: blue };
project.marks = [];
project.circleLayer = new project.scope.Layer();
project.circleLayer.activate();
for(var i = 0; i < 4; i++){ 
	project.marks.push(new project.scope.Shape.Circle(project.circleStyle));
}
project.handle = [];
project.marks[0].position = [0.1, 0.5];
project.marks[1].position = [0.4, 0.5];
project.marks[2].position = [0.5, 0.7];  //[0.2118009640404385, 0.8910193519031978];
project.marks[3].position = [0.5, 0.3];  //[0.2118009640404385, 0.4530776777716162];

project.rayLayer = new project.scope.Layer();
// project.edgeLayer.bringToFront();
// project.boundaryLayer.bringToFront();

project.reset = function(){
	var xys = this.marks.map(function(el){ return new XY(el.position.x, el.position.y); });
	var ray0 = xys[1].subtract(xys[0]);
	var ray1 = xys[3].subtract(xys[2]);

	this.cp.clear();
	this.cp.creaseRay(xys[0], ray0).valley();
	this.cp.crease(xys[2],xys[3]).valley();
	this.draw();

	this.rayLayer.activate();
	this.rayLayer.removeChildren();
	var intersection = rayLineSegmentIntersection(xys[0], ray0, xys[2], xys[3]);
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
		var fillColors = [black, yellow];
		var arcColors = [yellow, red];
		for(var i = 0; i < 4; i++){
			// var fillArc = new this.scope.Path.Arc(arcPoints[i][0], arcPoints[i][1], arcPoints[i][2]);
			// fillArc.add(intersection);
			// fillArc.closed = true;
			// fillArc.strokeWidth = null;
			// fillArc.fillColor = fillColors[i%2];

			var smallArc = new this.scope.Path.Arc(arcPoints[i][0], arcPoints[i][1], arcPoints[i][2]);
			smallArc.strokeWidth = 0.01;
			smallArc.strokeColor = arcColors[i%2];
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
	this.marks.forEach(function(el){
		if(pointsSimilar(event.point, el.position)){ el.fillColor = yellow; }
		else{ el.fillColor = blue; }
	},this);
	if(this.selectedNode != undefined){
		this.selectedNode.position = event.point;
		this.reset();
	}
}
