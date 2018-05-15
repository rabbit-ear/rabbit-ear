
var fishSwim = new OrigamiPaper("canvas-fish-base-wobble").blackAndWhite();
fishSwim.setPadding(0.05);
fishSwim.faceLayer.visible = false;

fishSwim.a = 1.0 - Math.sqrt(0.5);
fishSwim.b = Math.sqrt(0.5);

fishSwim.kc = [];

fishSwim.updateFishBase = function(point1, point2){
	// remove edges from last round
	var edge1 = this.cp.nearest( {x:this.a, y:this.a*0.5} ).edge;
	var edge2 = this.cp.nearest( {x:this.b+this.a*0.5, y:this.b} ).edge
	if(edge1.orientation == CreaseDirection.mountain){ this.cp.removeEdge(edge1); }
	if(edge2.orientation == CreaseDirection.mountain){ this.cp.removeEdge(edge2); }
	this.cp.clean();
	this.cp.flatten();

	// shift nodes a little
	var node1 = this.cp.nearest( {x:this.a, y:this.a} ).node;
	var node2 = this.cp.nearest( {x:this.b, y:this.b} ).node;
	node1.x = point1.x;  node1.y = point1.y;
	node2.x = point2.x;  node2.y = point2.y;

	// locate sectors
	var sector1 = this.cp.nearest( {x:this.a, y:this.a*0.5} ).sector;
	var sector2 = this.cp.nearest( {x:this.b+this.a*0.5, y:this.b} ).sector;
	var direction1 = sector1.kawasakiFourth();
	var direction2 = sector2.kawasakiFourth();
	// console.log(sector1);
	// console.log(direction1);
	this.cp.creaseRay(node1, {x:0,y:-1}).mountain();
	// this.cp.creaseRay(node2, {x:1,y:0}).mountain();
	// this.cp.creaseRay(node1, direction1).mountain();
	var crease2 = this.cp.creaseRay(node2, direction2);
	if(crease2 !== undefined){ crease2.mountain(); }
	this.cp.clean();
	this.draw();

	// var direction1 = this.cp.nodes[4].kawasakiFourth(this.kc[0][0], this.kc[0][1]);
	// var direction2 = this.cp.nodes[5].kawasakiFourth(this.kc[1][0], this.kc[1][1]);
	// this.cp.creaseRay(this.cp.nodes[4], direction1).mountain();
	// this.cp.creaseRay(this.cp.nodes[5], direction2).mountain();
	// this.update();
}

fishSwim.reset = function(){
	this.cp.clear();
	this.cp.fishBase();
	this.draw();
}
fishSwim.reset();

fishSwim.onFrame = function(event) { 
	var scale = .02;
	var sp = 1.5;
	var point1 = new XY(this.a + Math.sin(sp*event.time*.8) * scale, this.a + Math.cos(sp*event.time*.895) * scale);
	var point2 = new XY(this.b + Math.sin(sp*event.time*1.2) * scale, this.b + Math.sin(sp*event.time) * scale);
	this.updateFishBase(point1, point2);
	// fishSwim.update();
}
fishSwim.onResize = function(event){ }
fishSwim.onMouseDown = function(event){ }
fishSwim.onMouseUp = function(event){ }
fishSwim.onMouseMove = function(event){ }