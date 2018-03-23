var intersectRaySeg = new OrigamiPaper("canvas-intersect-ray-segment");

intersectRaySeg.style.circleStyle = { radius: 0.015, strokeWidth: null, fillColor: {gray:0.0} };
intersectRaySeg.style.valley.strokeColor = {gray:0.0};
intersectRaySeg.style.valley.dashArray = null;

intersectRaySeg.handleLayer = new intersectRaySeg.scope.Layer();
intersectRaySeg.handleLayer.activate();
intersectRaySeg.marks = [];
for(var i = 0; i < 4; i++){ 
	intersectRaySeg.marks.push(new intersectRaySeg.scope.Shape.Circle(intersectRaySeg.style.circleStyle));
}
intersectRaySeg.marks[0].position = [0.25, 0.3];
intersectRaySeg.marks[1].position = [0.425, 0.7];
intersectRaySeg.marks[2].position = [0.5, 0.7];
intersectRaySeg.marks[3].position = [0.5, 0.3];

intersectRaySeg.intersectionLayer = new intersectRaySeg.scope.Layer();
intersectRaySeg.handleLayer.moveBelow(intersectRaySeg.edgeLayer);
intersectRaySeg.intersectionLayer.moveBelow(intersectRaySeg.edgeLayer);
intersectRaySeg.selectedLayer = new intersectRaySeg.scope.Layer();
intersectRaySeg.selectedLayer.activate();

intersectRaySeg.reset = function(){
	var xys = this.marks.map(function(el){ return new XY(el.position.x, el.position.y); });
	var ray0 = xys[1].subtract(xys[0]);
	var ray1 = xys[3].subtract(xys[2]);

	// console.log(ray0);

	// console.log(this.cp.boundary);

	this.cp.clear();
	this.cp.creaseRay(xys[0], ray0);//.valley();
	this.cp.crease(xys[2],xys[3]);//.valley();
	this.draw();

	this.intersectionLayer.activate();
	this.intersectionLayer.removeChildren();
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
intersectRaySeg.reset();

intersectRaySeg.onFrame = function(event) { }
intersectRaySeg.onResize = function(event) { }
intersectRaySeg.onMouseDown = function(event){
	this.selectedNode = undefined;
	this.marks.forEach(function(el){
		if(pointsSimilar(event.point, el.position,0.05)){this.selectedNode = el;}
	},this);
}
intersectRaySeg.onMouseUp = function(event){
	this.selectedNode = undefined;
}
intersectRaySeg.onMouseMove = function(event) {
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
