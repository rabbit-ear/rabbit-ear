var intersectRays = new OrigamiPaper("canvas-intersect-rays");

intersectRays.style.circleStyle = { radius: 0.015, strokeWidth: null, fillColor: {gray:0.0} };
intersectRays.style.valley.strokeColor = {gray:0.0};
intersectRays.style.valley.dashArray = null;

intersectRays.handleLayer = new intersectRays.scope.Layer();
intersectRays.handleLayer.activate();
intersectRays.marks = [];
for(var i = 0; i < 4; i++){ 
	intersectRays.marks.push(new intersectRays.scope.Shape.Circle(intersectRays.style.circleStyle));
}
intersectRays.marks[0].position = [0.25, 0.3];
intersectRays.marks[1].position = [0.425, 0.7];
intersectRays.marks[2].position = [0.5, 0.7];
intersectRays.marks[3].position = [0.5, 0.3];

intersectRays.intersectionLayer = new intersectRays.scope.Layer();
intersectRays.handleLayer.moveBelow(intersectRays.edgeLayer);
intersectRays.intersectionLayer.moveBelow(intersectRays.edgeLayer);
intersectRays.selectedLayer = new intersectRays.scope.Layer();
intersectRays.selectedLayer.activate();

//1.7 - 2.1
setTimeout(function(){
	console.time("okay");
	for(var i = 0; i < 10000; i++){
		{};
	}
	console.timeEnd("okay");
},500);

intersectRays.reset = function(){
	var xys = this.marks.map(function(el){return new XY(el.position.x, el.position.y);});
	var ray0 = xys[1].subtract(xys[0]);
	var ray1 = xys[3].subtract(xys[2]);


	this.cp.clear();
	// this.cp.creaseRay(xys[0], ray0);//.valley();
	// this.cp.creaseRay(xys[2], ray1);//.valley();
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
		var fillColors = [this.styles.byrne.blue, this.styles.byrne.red];
		for(var i = 0; i < 4; i++){
			var fillArc = new this.scope.Path.Arc(arcPoints[i][0], arcPoints[i][1], arcPoints[i][2]);
			fillArc.add(intersection);
			fillArc.closed = true;
			fillArc.strokeWidth = null;
			fillArc.fillColor = fillColors[i%2];
		}
	}
}
intersectRays.reset();

intersectRays.onFrame = function(event) { }
intersectRays.onResize = function(event) { }
intersectRays.onMouseDown = function(event){
	this.selectedNode = undefined;
	this.marks.forEach(function(el){
		if(pointsSimilar(event.point, el.position,0.05)){this.selectedNode = el;}
	},this);
}
intersectRays.onMouseUp = function(event){
	this.selectedNode = undefined;
}
intersectRays.onMouseMove = function(event) {
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
