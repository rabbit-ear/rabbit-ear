var radial_rainbow_callback = undefined;

var radialRay = new OrigamiPaper("canvas-radial-rainbow", new PlanarGraph());
radialRay.setPadding(0.05);

radialRay.colorForAngle = function(angle){
	var color = angle / Math.PI * 180;
	while(color < 0){color += 360;}
	return {hue:color, saturation:1.0, brightness:0.9};
}

radialRay.reset = function(){
	paper = this.scope; 
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	var angle = 0;
	while(angle < Math.PI*2){
		var len = 0.4 + Math.random()*0.1;
		this.cp.newPlanarEdge(0.5, 0.5, 0.5+len*Math.cos(angle), 0.5+len*Math.sin(angle) );
		angle+= Math.random()*0.2 + 0.05;
	}
	this.cp.cleanDuplicateNodes();
	this.draw();
	this.selectNearestEdge = true;
	this.style.selectedEdge = { gray:0.0 };
	this.style.mark.strokeColor = { gray:0.0 };
	this.planarAdjacent = this.cp.getNearestNode(0.5, 0.5).planarAdjacent();
	console.log(this.cp.getNearestNode(0.5, 0.5));
	console.log(this.planarAdjacent);
	for(var i = 0; i < this.planarAdjacent.length; i++){
		var edgeIndex = this.planarAdjacent[i].edge.index;
		this.edges[edgeIndex].strokeColor = {gray:0.0};
	}
}
radialRay.reset();

radialRay.onFrame = function(event) { }
radialRay.onResize = function(event) { }
radialRay.onMouseDown = function(event){ radialRay.reset(); }
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
