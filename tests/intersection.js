var intersectSketchCallback = undefined;

var intersectSketch = RabbitEar.Origami();

// intersectSketch.intersectionLayer = 
// intersectSketch.intersectionLayer.moveBelow(intersectSketch.edgeLayer);

// intersectSketch.drawIntersections = function(line, ray, edge){
// 	paper = this.scope;
// 	this.intersectionLayer.activate();
// 	this.intersectionLayer.removeChildren();
// 	var intersections = [
// 		intersectionLineRay(line, ray),
// 		intersectionLineEdge(line, edge),
// 		intersectionRayEdge(ray, edge)];
// 	var intersectParts = [
// 		[line, ray],
// 		[line, edge],
// 		[ray, edge],
// 	];
// 	for(var inter = 0; inter < intersections.length; inter++){
// 		var intersection = intersections[inter];
// 		if(intersection !== undefined){
// 			var interRadius = 0.04;
// 			var vec0 = intersectParts[inter][0].vector();
// 			var vec1 = intersectParts[inter][1].vector();
// 			var fourPoints = [
// 				intersection.add(vec0.normalize().scale(interRadius)),
// 				intersection.add(vec1.normalize().scale(interRadius)),
// 				intersection.subtract(vec0.normalize().scale(interRadius)),
// 				intersection.subtract(vec1.normalize().scale(interRadius))
// 			];
// 			var arcPoints = [];
// 			fourPoints.forEach(function(el, i){
// 				var nextI = (i+1)%fourPoints.length;
// 				var b = bisectVectors(el.subtract(intersection), fourPoints[nextI].subtract(intersection))[0];
// 				var arcMidPoint = b.normalize().scale(interRadius).add(intersection);
// 				var thesePoints = [ fourPoints[i],
// 				                    arcMidPoint,
// 				                    fourPoints[nextI] ];
// 				arcPoints.push(thesePoints);
// 			});
// 			var fillColors = [this.styles.byrne.yellow, this.styles.byrne.red];
// 			for(var i = 0; i < 4; i++){
// 				var fillArc = new this.scope.Path.Arc(arcPoints[i][0], arcPoints[i][1], arcPoints[i][2]);
// 				fillArc.add(intersection);
// 				fillArc.closed = true;
// 				fillArc.strokeWidth = null;
// 				fillArc.fillColor = fillColors[i%2];
// 			}
// 		}
// 	}
// }

intersectSketch.redraw = function(){
	// var points = this.touchPoints.map(function(el){ return new XY(el.position.x, el.position.y); });
	var line = RabbitEar.Math.Line(this.points[0], this.points[1].subtract(this.points[0]));
	var ray = RabbitEar.Math.Ray(this.points[2], this.points[3].subtract(this.points[2]));
	var edge = RabbitEar.Math.Edge(this.points[4], this.points[5]);

	
	// this.cp.clear();
	// this.cp.crease(line).mountain();
	// this.cp.crease(ray).mountain();
	// this.cp.crease(edge).mountain();
	// this.draw();
	// this.drawIntersections(line, ray, edge);

	if(intersectSketchCallback !== undefined){
		var event = {
			"edge": [this.touchPoints[4].position, this.touchPoints[5].position],
			"ray": [this.touchPoints[2].position, this.touchPoints[3].position],
			"line": [this.touchPoints[0].position, this.touchPoints[1].position]
		};
		intersectSketchCallback(event);
	}
}

intersectSketch.setup = function(){
	this.points = [
		[0.9, 0.56], [0.7, 0.53],
		[0.9, 0.44], [0.7, 0.47],
		[0.15, 0.3], [0.15, 0.7]
	].map((point) => RabbitEar.Math.Vector(point));
	console.log(this.points);
	this.redraw();
}
intersectSketch.setup();

// intersectSketch.animate = function(event){ }
// intersectSketch.onResize = function(event){ }
intersectSketch.onMouseDown = function(event){ }
intersectSketch.onMouseUp = function(event){ }
intersectSketch.onMouseMove = function(event){
	// if(this.mouse.isPressed){
	// 	this.redraw();
	// }
}
