
var fragmentCollinear = new OrigamiPaper("canvas-fragment-collinear").setPadding(0.025);
fragmentCollinear.show.boundary = false;

fragmentCollinear.fill = function(numLines){
	if(numLines == undefined){ numLines = 10; }
	for(var i = 0; i < numLines; i++){
		var y = .05 + .9*(i/(numLines-1));
		var x = (1-Math.cos(Math.PI*2*i/(numLines-1)))*0.5;
		this.cp.crease(0.5+x*0.01, y, 0.55+x*0.5, y);
	}	
	this.cp.crease(0.5, 0.0, 0.5, 1.0);
}
fragmentCollinear.reset = function(){
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	this.fill();
	var crossings = this.cp.fragment(0.03);
	this.draw();
}
fragmentCollinear.reset();

fragmentCollinear.onFrame = function(event){ }
fragmentCollinear.onResize = function(event){ }
fragmentCollinear.onMouseDown = function(event){ this.reset(); }
fragmentCollinear.onMouseUp = function(event){ }
fragmentCollinear.onMouseMove = function(event){
	this.update();
	// this.cp.nodes.filter(function(node){ return node.degree() < 2; },this)
	//              .forEach(function(node){this.nodes[node.index].fillColor = {alpha:0.0};},this)
	var nearest = this.cp.nearest(event.point);
	if(nearest.edge){ this.edges[ nearest.edge.index ].strokeColor = this.styles.byrne.yellow; }	

}
