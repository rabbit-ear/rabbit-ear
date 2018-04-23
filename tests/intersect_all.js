var intersectAllCallback = undefined;

var intersectAll = new OrigamiPaper("canvas-intersect-all");

intersectAll.style.circleStyle = { radius: 0.015, strokeWidth: null, fillColor: {gray:0.0} };
intersectAll.style.valley.strokeColor = {gray:0.0};
intersectAll.style.valley.dashArray = null;

intersectAll.handleLayer = new intersectAll.scope.Layer();
intersectAll.handleLayer.activate();
intersectAll.marks = [];
for(var i = 0; i < 6; i++){ 
	intersectAll.marks.push(new intersectAll.scope.Shape.Circle(intersectAll.style.circleStyle));
}
intersectAll.marks[0].position = [0.9, 0.56];
intersectAll.marks[1].position = [0.7, 0.53];
intersectAll.marks[2].position = [0.9, 0.44];
intersectAll.marks[3].position = [0.7, 0.47];
intersectAll.marks[4].position = [0.15, 0.3];
intersectAll.marks[5].position = [0.15, 0.7];

intersectAll.intersectionLayer = new intersectAll.scope.Layer();
intersectAll.handleLayer.moveBelow(intersectAll.edgeLayer);
intersectAll.intersectionLayer.moveBelow(intersectAll.edgeLayer);
intersectAll.selectedLayer = new intersectAll.scope.Layer();
intersectAll.selectedLayer.activate();

intersectAll.reset = function(){
	paper = this.scope;
	var xys = this.marks.map(function(el){ return new XY(el.position.x, el.position.y); });

	var line = new Line(xys[0], xys[1].subtract(xys[0]));
	var ray = new Ray(xys[2], xys[3].subtract(xys[2]));
	var edge = new Edge(xys[4], xys[5]);

	this.cp.clear();
	this.cp.creaseThroughPoints(line.origin, line.origin.add(line.direction)).valley();
	this.cp.creaseRay(ray.origin, ray.direction).valley();
	this.cp.crease(edge.nodes[0], edge.nodes[1]).valley();
	this.draw();

	this.intersectionLayer.activate();
	this.intersectionLayer.removeChildren();

	var intersections = [
		intersectionLineRay(line, ray),
		intersectionLineEdge(line, edge),
		intersectionRayEdge(ray, edge)];

	var intersectParts = [
		[line, ray],
		[line, edge],
		[ray, edge],
	];

	for(var inter = 0; inter < intersections.length; inter++){
		var intersection = intersections[inter];
		if(intersection !== undefined){

			var interRadius = 0.04;

			var vec0 = intersectParts[inter][0].vector();
			var vec1 = intersectParts[inter][1].vector();

			var fourPoints = [
				intersection.add(vec0.normalize().scale(interRadius)),
				intersection.add(vec1.normalize().scale(interRadius)),
				intersection.subtract(vec0.normalize().scale(interRadius)),
				intersection.subtract(vec1.normalize().scale(interRadius))
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
			var fillColors = [this.styles.byrne.yellow, this.styles.byrne.red];
			for(var i = 0; i < 4; i++){
				var fillArc = new this.scope.Path.Arc(arcPoints[i][0], arcPoints[i][1], arcPoints[i][2]);
				fillArc.add(intersection);
				fillArc.closed = true;
				fillArc.strokeWidth = null;
				fillArc.fillColor = fillColors[i%2];
			}
		} // intersction !== undefined
	}
	if(intersectAllCallback !== undefined){
		var event = {
			"edge": [this.marks[4].position, this.marks[5].position],
			"ray": [this.marks[2].position, this.marks[3].position],
			"line": [this.marks[0].position, this.marks[1].position]
		};
		intersectAllCallback(event);
	}
}
intersectAll.reset();

intersectAll.onFrame = function(event) { }
intersectAll.onResize = function(event) { }
intersectAll.onMouseDown = function(event){
	this.selectedNode = undefined;
	this.marks.forEach(function(el){
		if(pointsSimilar(event.point, el.position,0.05)){this.selectedNode = el;}
	},this);
}
intersectAll.onMouseUp = function(event){
	this.selectedNode = undefined;
}
intersectAll.onMouseMove = function(event) {
	var selectedNodePosition = undefined;
	if(this.selectedNode === undefined){
		for(var i = 0; i < this.marks.length; i++){
			if(pointsSimilar(event.point, this.marks[i].position,0.05)){
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
		var circle = new this.scope.Shape.Circle(this.style.circleStyle);
		circle.fillColor = this.styles.byrne.yellow;
		circle.position = selectedNodePosition;		
	}
}
