var radial_rainbow_callback = undefined;

var radialRay = new PaperCreasePattern(new CreasePattern(), "canvas-radial-rainbow");
radialRay.zoomToFit(0.05);
radialRay.nearestEdgeColor = { gray:0.0 };

radialRay.colorForAngle = function(angle){
	var color = angle / Math.PI * 180;
	while(color < 0){color += 360;}
	return {hue:color, saturation:1.0, brightness:0.9};
}

radialRay.reset = function(){
	radialRay.cp.clear();
	radialRay.cp.nodes = [];
	radialRay.cp.edges = [];
	var angle = 0;
	while(angle < Math.PI*2){
		radialRay.cp.creaseRay(new XYPoint(0.5, 0.5), new XYPoint(Math.cos(angle), Math.sin(angle)));
		angle+= Math.random()*0.2;
	}
	radialRay.cp.cleanDuplicateNodes();
	radialRay.initialize();

	radialRay.planarAdjacent = radialRay.cp.nodes[0].planarAdjacent();
	for(var i = 0; i < radialRay.planarAdjacent.length; i++){
		var edgeIndex = radialRay.planarAdjacent[i].edge.index;
		radialRay.edges[edgeIndex].strokeColor = {gray:0.0};
	}
}
radialRay.reset();

radialRay.onFrame = function(event) { }
radialRay.onResize = function(event) { }
radialRay.onMouseDown = function(event){ }
radialRay.onMouseUp = function(event){ }
radialRay.onMouseMove = function(event) {
	// nearestEdge = nEdge;
	for(var i = 0; i < radialRay.planarAdjacent.length; i++){
		var edgeIndex = radialRay.planarAdjacent[i].edge.index;
		if(radialRay.planarAdjacent[i].edge === radialRay.nearestEdge){
			radialRay.edges[edgeIndex].strokeColor = radialRay.colorForAngle(radialRay.planarAdjacent[i].angle);
			radialRay.edges[edgeIndex].strokeWidth = 0.02;//radialRay.lineWeight*1.5;
			radialRay.edges[edgeIndex].bringToFront();
			if(radial_rainbow_callback != undefined){
				radial_rainbow_callback(radialRay.planarAdjacent[i]);
			}
		}
		else{
			radialRay.edges[edgeIndex].strokeColor = {gray:0.0};
			radialRay.edges[edgeIndex].strokeWidth = 0.01*0.66666;//paperCP.lineWeight*0.66666;
		}
	}
}
