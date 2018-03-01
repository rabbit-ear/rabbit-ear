var project = new OrigamiPaper("canvas-intersect-rays");
project.style.mountain.strokeColor = {hue:0.04*360, saturation:0.87, brightness:0.90 };
project.style.valley.strokeColor = {gray:0.0};

project.circleStyle = { radius: 0.02, strokeWidth: 0.01, strokeColor: { hue:220, saturation:0.6, brightness:1 } };
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

project.reset = function(){
	var xys = this.marks.map(function(el){ return new XY(el.position.x, el.position.y); });
	var ray0 = xys[1].subtract(xys[0]);
	var ray1 = xys[3].subtract(xys[2]);

	this.cp.clear();
	this.cp.creaseRay(xys[0], ray0).mountain();
	this.cp.creaseRay(xys[2], ray1).valley();
	this.draw();

	this.rayLayer.activate();
	this.rayLayer.removeChildren();
	var intersection = rayRayIntersection(xys[0], ray0, xys[2], ray1);
	if(intersection !== undefined){

		console.log(ray0, ray1);
		var fourPoints = [
			intersection.add(ray0.normalize().scale(0.1)),
			intersection.add(ray1.normalize().scale(0.1)),
			intersection.subtract(ray0.normalize().scale(0.1)),
			intersection.subtract(ray1.normalize().scale(0.1))
		];
		var arcPoints = [];
		fourPoints.forEach(function(el, i){
			var nextI = (i+1)%fourPoints.length;
			var b = bisect(el.subtract(intersection), fourPoints[nextI].subtract(intersection))[0];
			var arcMidPoint = b.normalize().scale(0.1).add(intersection);
			var thesePoints = [ fourPoints[i],
			                 arcMidPoint,
			                 fourPoints[nextI] ];
			for(var p = 0; p < 3; p++){
				thesePoints[p] = thesePoints[p].add(arcMidPoint.subtract(intersection).normalize().scale(0.02));
			}
			arcPoints.push(thesePoints);
		});
		var arcColors = [
			{hue:0.12*360, saturation:0.88, brightness:0.93 },
			{hue:0.53*360, saturation:0.82, brightness:0.28 }
		];
		for(var i = 0; i < 4; i++){
			var smallArc = new this.scope.Path.Arc(arcPoints[i][0], arcPoints[i][1], arcPoints[i][2]);
			smallArc.add(intersection.add(arcPoints[i][1].subtract(intersection).normalize().scale(0.02)));
			smallArc.closed = true;
			// smallArc.strokeColor = arcColors[i%2];
			// smallArc.strokeWidth = 0.01;
			smallArc.fillColor = arcColors[i%2];

		}

		// var smallArc = new this.scope.Path.Arc(eightPoints[0], eightPoints[1], eightPoints[2]);
		// smallArc.add(new this.scope.Point(intersection.x, intersection.y));
		// smallArc.closed = true;
		// smallArc.fillColor = {hue:0.53*360, saturation:0.82, brightness:0.28 };

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
