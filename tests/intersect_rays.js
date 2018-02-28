var project = new OrigamiPaper("canvas");

project.rayLayer = new project.scope.Layer();
project.circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };
project.marks = [];
project.circleLayer = new project.scope.Layer();
project.circleLayer.activate();
for(var i = 0; i < 4; i++){ 
	project.marks.push(new project.scope.Shape.Circle(project.circleStyle));
}
project.marks[0].position = [0.9, 0.9];
project.marks[1].position = [0.7, 0.7];
project.marks[2].position = [0.5, 0.9];
project.marks[3].position = [0.5, 0.7];

// project.drawArrowLine = function(origin, vector){
// 	var arrowSize = 0.05;

// 	var length = vector.magnitude();
// 	vector = vector.normalize();
// 	var normal = vector.rotate90();
// 	var endPoint = origin.add(vector.scale(length));
// 	var path = new this.scope.Path({segments: [origin, endPoint], closed: false });
// 	path.strokeColor = {gray:0.0};
// 	path.strokeWidth = 0.01;

// 	var arrowhead = new this.scope.Path({segments: [
// 		endPoint.add(normal.scale(-arrowSize*0.375)), 
// 		endPoint.add(normal.scale(arrowSize*0.375)), 
// 		origin.add(vector.scale(length+arrowSize))
// 		], closed: true });
// 	arrowhead.fillColor = {gray:0.0};
// 	arrowhead.strokeColor = null;
// }

project.reset = function(){
	var xys = this.marks.map(function(el){ return new XY(el.position.x, el.position.y); });
	var ray0 = xys[1].subtract(xys[0]);
	var ray1 = xys[3].subtract(xys[2]);

	this.cp.clear();
	this.cp.creaseRay(xys[0], ray0).valley();
	this.cp.creaseRay(xys[2], ray1).valley();
	this.draw();

	// this.rayLayer.activate();
	// this.rayLayer.removeChildren();
	// project.drawArrowLine(xys[0], ray0);
	// project.drawArrowLine(xys[2], ray1);
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
