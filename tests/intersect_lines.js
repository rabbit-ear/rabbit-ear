var intersectLines = new OrigamiPaper("canvas-intersect-lines");

intersectLines.style.circleStyle = { radius: 0.015, strokeWidth: null, fillColor: {gray:0.0} };
intersectLines.style.valley.strokeColor = {gray:0.0};
intersectLines.style.valley.dashArray = null;

intersectLines.handleLayer = new intersectLines.scope.Layer();
intersectLines.handleLayer.activate();
intersectLines.marks = [];
for(var i = 0; i < 4; i++){ 
	intersectLines.marks.push(new intersectLines.scope.Shape.Circle(intersectLines.style.circleStyle));
}
intersectLines.marks[0].position = [0.25, 0.3];
intersectLines.marks[1].position = [0.75, 0.7];
intersectLines.marks[2].position = [0.5, 0.7];
intersectLines.marks[3].position = [0.5, 0.3];

intersectLines.intersectionLayer = new intersectLines.scope.Layer();
intersectLines.handleLayer.moveBelow(intersectLines.edgeLayer);
intersectLines.intersectionLayer.moveBelow(intersectLines.edgeLayer);
intersectLines.selectedLayer = new intersectLines.scope.Layer();
intersectLines.selectedLayer.activate();

intersectLines.reset = function(){
	var xys = this.marks.map(function(el){ return new XY(el.position.x, el.position.y); });
	var ray0 = xys[1].subtract(xys[0]);
	var ray1 = xys[3].subtract(xys[2]);

	this.cp.clear();
	this.cp.creaseThroughPoints(xys[0], xys[1]).valley();
	this.cp.creaseThroughPoints(xys[2], xys[3]).valley();
	this.draw();

	this.intersectionLayer.activate();
	this.intersectionLayer.removeChildren();
	var intersection = intersectionLineLine(new Line(xys[0], xys[1]), new Line(xys[2], xys[3]));
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
		var fillColors = [this.styles.byrne.yellow, this.styles.byrne.red];
		for(var i = 0; i < 4; i++){
			var fillArc = new this.scope.Path.Arc(arcPoints[i][0], arcPoints[i][1], arcPoints[i][2]);
			fillArc.add(intersection);
			fillArc.closed = true;
			fillArc.strokeWidth = null;
			fillArc.fillColor = fillColors[i%2];
		}
	}
}
intersectLines.reset();

intersectLines.onFrame = function(event) { }
intersectLines.onResize = function(event) { }
intersectLines.onMouseDown = function(event){
	this.selectedNode = undefined;
	this.marks.forEach(function(el){
		if(pointsSimilar(event.point, el.position, 0.05)){this.selectedNode = el;}
	},this);
}
intersectLines.onMouseUp = function(event){
	this.selectedNode = undefined;
}
intersectLines.onMouseMove = function(event) {
	var selectedNodePosition = undefined;
	if(this.selectedNode === undefined){
		for(var i = 0; i < this.marks.length; i++){
			if(pointsSimilar(event.point, this.marks[i].position, 0.05)){
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
