var red = {hue:0.04*360, saturation:0.87, brightness:0.90 };
var yellow = {hue:0.12*360, saturation:0.88, brightness:0.93 };
var blue = {hue:0.53*360, saturation:0.82, brightness:0.28 };
var black = {hue:0, saturation:0, brightness:0 };

var project = new OrigamiPaper("canvas-intersect-rays");
var strokeWidth = 0.01;
project.style.valley = {
				strokeColor: blue,
				// dashArray: [strokeWidth*0.2, strokeWidth*1.8],
				// dashArray: undefined,
				strokeWidth: strokeWidth,
				// strokeCap : 'square'
			}

project.circleStyle = { radius: 0.03, strokeWidth: null, fillColor: blue };
project.marks = [];
project.circleLayer = new project.scope.Layer();
project.circleLayer.activate();
for(var i = 0; i < 4; i++){ 
	project.marks.push(new project.scope.Shape.Circle(project.circleStyle));
}
project.handle = [];
project.marks[0].position = [0.9, 0.9];
project.marks[1].position = [0.7, 0.7];
project.marks[2].position = [0.2118009640404385, 0.8910193519031978];//[0.5, 0.9];
project.marks[3].position = [0.2118009640404385, 0.4530776777716162];//[0.5, 0.7];

project.rayLayer = new project.scope.Layer();
project.edgeLayer.bringToFront();
project.boundaryLayer.bringToFront();

project.reset = function(){
	var xys = this.marks.map(function(el){ return new XY(el.position.x, el.position.y); });
	var ray0 = xys[1].subtract(xys[0]);
	var ray1 = xys[3].subtract(xys[2]);

	this.cp.clear();
	this.cp.creaseRay(xys[0], ray0).valley();
	this.cp.creaseRay(xys[2], ray1).valley();
	this.draw();

	this.rayLayer.activate();
	this.rayLayer.removeChildren();
	var intersection = rayRayIntersection(xys[0], ray0, xys[2], ray1);
	if(intersection !== undefined){

		var interRadius = 0.05;

		// console.log(ray0, ray1);
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
		var arcColors = [yellow, red];
		for(var i = 0; i < 4; i++){
			var smallArc = new this.scope.Path.Arc(arcPoints[i][0], arcPoints[i][1], arcPoints[i][2]);
			// smallArc.add(intersection);
			smallArc.closed = false;
			smallArc.strokeWidth = 0.02;
			smallArc.strokeColor = arcColors[i%2];
		}
	}

	var fullLine0 = this.cp.clipLineInBoundary(xys[0], xys[1]);
	var fullLine1 = this.cp.clipLineInBoundary(xys[2], xys[3]);
	var path0 = new this.scope.Path({segments: fullLine0, closed: false });
	Object.assign(path0, this.style.mountain);
	path0.strokeColor = { gray:1.0 };
	path0.strokeWidth = path0.strokeWidth * 2.0;
	var path1 = new this.scope.Path({segments: fullLine1, closed: false });
	Object.assign(path1, this.style.mountain);
	path1.strokeColor = { gray:1.0 };
	path1.strokeWidth = path1.strokeWidth * 2.0;

}
project.reset();

project.onFrame = function(event) { }
project.onResize = function(event) { }
project.onMouseDown = function(event){
	this.selectedNode = undefined;
	this.marks.forEach(function(el){
		if(pointsSimilar(event.point, el.position)){this.selectedNode = el;}
	},this);
	// for(var i = 0; i < this.marks.length; i++){
	// 	if(pointsSimilar(event.point, this.marks[i].position)){ this.selectedNode = this.marks[i];return;}
	// }
}
project.onMouseUp = function(event){
	this.selectedNode = undefined;
}
project.onMouseMove = function(event) {
	if(this.selectedNode != undefined){
		this.selectedNode.position = event.point;
		this.reset();
	}
}
