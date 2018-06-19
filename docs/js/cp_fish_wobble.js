
var fishSwim = new OrigamiPaper("canvas-fish-base-wobble").blackAndWhite().setPadding(0.05);

fishSwim.a = 1.0 - Math.sqrt(0.5);
fishSwim.b = Math.sqrt(0.5);

fishSwim.updateFishBase = function(point1, point2){
	// remove edges from last round
	var edge1 = this.cp.nearest( {x:this.a, y:this.a*0.5} ).edge;
	var edge2 = this.cp.nearest( {x:this.b+this.a*0.5, y:this.b} ).edge;
	if(edge1.orientation == CreaseDirection.valley){ this.cp.removeEdge(edge1); }
	if(edge2.orientation == CreaseDirection.valley){ this.cp.removeEdge(edge2); }
	this.cp.clean();

	// shift nodes a little
	var junction1 = this.cp.nearest( {x:this.a, y:this.a} ).junction;
	var junction2 = this.cp.nearest( {x:this.b, y:this.b} ).junction;
	var node1 = junction1.origin;
	var node2 = junction2.origin;
	node1.x = point1.x;  node1.y = point1.y;
	node2.x = point2.x;  node2.y = point2.y;

	// locate sectors
	var sector1 = junction1.sectors.filter(function(sector){ return sector.contains({x:0.5, y:0.0}); },this).shift();
	var sector2 = junction2.sectors.filter(function(sector){ return sector.contains({x:1.0, y:0.5}); },this).shift();
	sector1.kawasakiCollapse().crease().valley();
	sector2.kawasakiCollapse().crease().valley();
	this.cp.clean();
	this.draw();
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
}
fishSwim.onResize = function(event){ }
fishSwim.onMouseDown = function(event){ }
fishSwim.onMouseUp = function(event){ }
fishSwim.onMouseMove = function(event){ }