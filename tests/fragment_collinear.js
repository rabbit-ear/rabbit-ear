
var fragmentCollinear = new OrigamiPaper("canvas-fragment-collinear").setPadding(0.025);
fragmentCollinear.show.boundary = false;

fragmentCollinear.fillHorizontal = function(numLines){
	if(numLines == undefined){ numLines = 20; }
	this.cp.crease(0.0, 0.5, 1.0, 0.5);
	[5,3,7,9,4,2,1,6,8,0].forEach(function(i){
		var x = .1 + .8*(i/(numLines-1));
		this.cp.crease( x, Math.random(), x, 0.5 );
	},this);
	// for(var i = 0; i < numLines; i++){
	// 	var x = .1 + .8*(i/(numLines-1));
	// 	this.cp.crease( x, Math.random(), x, 0.5 );
	// }
}
fragmentCollinear.fillVertical = function(numLines){
	if(numLines == undefined){ numLines = 20; }
	this.cp.crease(0.5, 0.0, 0.5, 1.0);
	for(var i = 0; i < numLines; i++){
		var y = .1 + .8*(i/(numLines-1));
		this.cp.crease(Math.random(), y, 0.5, y);
	}	
}
fragmentCollinear.fillAnglesVertical = function(numLines){
	if(numLines == undefined){ numLines = 12; }
	var pad = 0.1;
	this.cp.crease(0.5, pad, 0.5, 1.0-pad);
	for(var i = 1; i < numLines; i++){
		var pct = (i)/(numLines);
		var edge = this.cp.creaseRay(new XY(0.5, pad + (1.0-pad*2)*pct), new XY(-Math.sin(Math.PI*pct), -Math.cos(Math.PI*pct)));
	}
	for(var i = 1; i < (numLines-1); i++){
		var pct = (i)/(numLines-1);
		var edge = this.cp.creaseRay(new XY(0.5, pad + (1.0-pad*2)*pct), new XY(Math.sin(Math.PI*pct), -Math.cos(Math.PI*pct)));
	}
	this.cp.fragment();
	this.draw();
}
fragmentCollinear.fillAngles45 = function(numLines){
	if(numLines == undefined){ numLines = 12; }
	var pad = 0.1;
	this.cp.crease(0.0, 0.0, 1.0, 1.0);
	for(var i = 1; i < numLines; i++){
		var pct = (i)/(numLines);
		this.cp.creaseRay(new XY(pad + (1.0-pad*2)*pct, pad + (1.0-pad*2)*pct), 
		                  new XY(Math.sin(-Math.PI*0.75+Math.PI*pct), Math.cos(-Math.PI*0.75+Math.PI*pct)));
	}
	for(var i = 1; i < (numLines-1); i++){
		var pct = (i)/(numLines-1);
		this.cp.creaseRay(new XY(pad + (1.0-pad*2)*pct, pad + (1.0-pad*2)*pct), 
		                  new XY(Math.sin(-Math.PI*0.25+Math.PI*pct), -Math.cos(-Math.PI*0.25+Math.PI*pct)));
	}
}

fragmentCollinear.fillDoubleCrossing = function(numLines){
	if(numLines == undefined){ numLines = 30; }
	var firstEdge = this.cp.crease( 0.0, 0.5, 1.0, 0.5 );
	var v = .8/(numLines-1);
	for(var i = 0; i < numLines; i++){
		var x = .1 + .8*(i/(numLines-1));
		this.cp.crease( x + Math.random()*v-v*0.5, 0.25 + Math.random()*v-v*0.5, 
		                x + Math.random()*v-v*0.5, 0.75 + Math.random()*v-v*0.5 );
	}
	var lowerEdge = this.cp.crease( 0.0, 0.6, 1.0, 0.6 );
}


fragmentCollinear.reset = function(){
	this.cp.clear();
	this.cp.nodes = [];
	this.cp.edges = [];
	var select = 4;//parseInt(Math.random()*5);
	switch(select){
		case 0: this.fillVertical(); break;
		case 1: this.fillHorizontal(); break;
		case 2: this.fillAnglesVertical(); break;
		case 3: this.fillAngles45(); break;
		case 4: this.fillDoubleCrossing(); break;
	}
	var crossings = this.cp.fragment();
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
