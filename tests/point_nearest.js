var pointNearest = new OrigamiPaper("canvas-point-nearest");

pointNearest.markLayer = new pointNearest.scope.Layer();

pointNearest.onFrame = function(event){ }
pointNearest.onResize = function(event){ }
pointNearest.onMouseDown = function(event){ this.reset(); }
pointNearest.onMouseUp = function(event){ }
pointNearest.onMouseMove = function(event){
	this.markLayer.activate();
	this.markLayer.removeChildren();
	this.cp.edges
		.filter(function(el){return el.orientation !== CreaseDirection.border;})
		.forEach(function(edge){
			var nearest = edge.nearestPoint(event.point);
			if(nearest !== undefined){
				new this.scope.Shape.Circle({position:nearest, radius:0.015,strokeWidth:0.01,strokeColor:{gray:0.0},fillColor:{gray:1.0}})
			}

		},this);
}

pointNearest.reset = function(){
	this.cp.clear();
	for(var i = 0; i < 30; i++){
		this.cp.crease(Math.random(), Math.random(), Math.random(), Math.random());
	}
	this.draw();
	this.onMouseMove( {point:(this.mouse.position || {x:0,y:0} )} );
}
pointNearest.reset();
