var polygonClip = new OrigamiPaper("canvas-polygon-clip");

polygonClip.style.circleStyle = { radius: 0.015, strokeWidth: null, fillColor: {gray:0.0} };
polygonClip.style.valley.strokeColor = {gray:0.0};
polygonClip.style.valley.dashArray = null;
polygonClip.boundaryLayer.visible = false;

polygonClip.resetBoundary = function(){
	var points = [];
	for(var i = 0; i < 10; i++){ points.push(new XY(Math.random(), Math.random()));}
	this.cp.setBoundary(points);
	this.draw();
}

polygonClip.reset = function(){
	this.resetBoundary();
	this.cp.clear();
	var poly = [ new Polyline(), new Polyline() ];
	for(var i=0,y=0; y<1; i++,y+=Math.random()/10+0.001){poly[0].nodes.push(new XY(i%2, y));}
	for(var i=0,x=0; x<1; i++,x+=Math.random()/10+0.001){poly[1].nodes.push(new XY(x, i%2));}
	poly.forEach(function(p){
		p.edges().forEach(function(e){
			var crease = this.cp.crease(e);
			if(crease !== undefined){ crease.valley(); }
		},this);
	},this);
	this.cp.edges = this.cp.edges.filter(function(el){ return el.orientation !== CreaseDirection.border; });
	this.draw();
}
polygonClip.reset();

polygonClip.onFrame = function(event){ }
polygonClip.onResize = function(event){ }
polygonClip.onMouseDown = function(event){ this.reset();}
polygonClip.onMouseUp = function(event){ }
polygonClip.onMouseMove = function(event){ }
