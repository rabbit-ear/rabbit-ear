
var fishSwim = new OrigamiPaper("canvas-fish-base-wobble").blackAndWhite();
fishSwim.setPadding(0.05);
fishSwim.faceLayer.visible = false;

fishSwim.a = Math.sqrt(0.5);
fishSwim.b = 1.0 - Math.sqrt(0.5);

fishSwim.kc = [];

fishSwim.updateFishBase = function(point1, point2){
	var edge1 = this.cp.edges[this.cp.edges.length-1];
	var edge2 = this.cp.edges[this.cp.edges.length-2];
	this.cp.removeEdge(edge1);
	this.cp.removeEdge(edge2);

	this.cp.nodes[4].x = point1.x;
	this.cp.nodes[4].y = point1.y;
	this.cp.nodes[5].x = point2.x;
	this.cp.nodes[5].y = point2.y;

	var direction1 = this.cp.nodes[4].kawasakiFourth(this.kc[0][0], this.kc[0][1]);
	var direction2 = this.cp.nodes[5].kawasakiFourth(this.kc[1][0], this.kc[1][1]);
	this.cp.creaseRay(this.cp.nodes[4], direction1).mountain();
	this.cp.creaseRay(this.cp.nodes[5], direction2).mountain();
	this.update();
}

fishSwim.reset = function(){
	this.cp.clear();
	// center
	this.cp.crease(0,1,1,0).mountain();
	// NW half
	this.cp.newCrease(0,1, this.b, this.b).valley();
	this.cp.newCrease(1,0, this.b, this.b).valley();
	this.cp.newCrease(0,0, this.b, this.b).valley();
	// SE half
	this.cp.newCrease(0,1, this.a, this.a).valley();
	this.cp.newCrease(1,0, this.a, this.a).valley();
	this.cp.newCrease(1,1, this.a, this.a).valley();
	this.cp.clean();
	var a0 = this.cp.getNearestEdgeConnectingPoints(new XY(0,1), new XY(this.b,this.b));
	var a1 = this.cp.getNearestEdgeConnectingPoints(new XY(0,0), new XY(this.b,this.b));
	var b0 = this.cp.getNearestEdgeConnectingPoints(new XY(0,1), new XY(this.a,this.a));
	var b1 = this.cp.getNearestEdgeConnectingPoints(new XY(1,1), new XY(this.a,this.a));
	this.kc = [[a0,a1],[b0,b1]];
	this.cp.newCrease(this.b, this.b, this.b, 0);
	this.cp.newCrease(this.a, this.a, 1, this.a);
	this.draw();
}
fishSwim.reset();

fishSwim.onFrame = function(event) { 
	var scale = .02;
	var sp = 1.5;
	var point1 = new XY(this.b + Math.sin(sp*event.time*1.2) * scale, this.b + Math.sin(sp*event.time) * scale);
	var point2 = new XY(this.a + Math.sin(sp*event.time*.8) * scale, this.a + Math.cos(sp*event.time*.895) * scale);
	this.updateFishBase(point1, point2);
	// fishSwim.update();
}
fishSwim.onResize = function(event) { }
fishSwim.onMouseDown = function(event){ }
fishSwim.onMouseUp = function(event){ }
fishSwim.onMouseMove = function(event) {
	// for(var j = 0; j < fishSwim.faceLayer.children.length; j++){
	// 	fishSwim.faceLayer.children[j].fillColor.alpha = 0.001;
	// }
	// var hitResult = fishSwim.faceLayer.hitTest(event.point);
	// if(hitResult != null && hitResult.item != null){
	// 	hitResult.item.fillColor.alpha = 0.2;
	// }
}