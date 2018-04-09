var pointNormal = new OrigamiPaper("canvas-point-normal");

pointNormal.markLayer = new pointNormal.scope.Layer();

pointNormal.onFrame = function(event){ }
pointNormal.onResize = function(event){ }
pointNormal.onMouseDown = function(event){ this.reset(); }
pointNormal.onMouseUp = function(event){ }
pointNormal.onMouseMove = function(event){
	this.markLayer.activate();
	this.markLayer.removeChildren();
	this.cp.edges
		.filter(function(el){return el.orientation !== CreaseDirection.border;})
		.forEach(function(edge){
			var nearest = edge.nearestPointNormalTo(event.point);
			if(nearest !== undefined){
				new this.scope.Shape.Circle({position:nearest, radius:0.015,strokeWidth:0.01,strokeColor:{gray:0.0},fillColor:{gray:1.0}})
			}

		},this);
}

pointNormal.reset = function(){
	this.cp.clear();
	for(var i = 0; i < 30; i++){
		this.cp.crease(Math.random(), Math.random(), Math.random(), Math.random());
	}
	this.draw();
	this.onMouseMove( {point:(this.mouse.position || {x:0,y:0} )} );
}
pointNormal.reset();
