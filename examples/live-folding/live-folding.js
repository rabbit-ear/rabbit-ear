var foldedState = new OrigamiFold("canvas-2");
var project = new OrigamiPaper("canvas-1");
foldedState.style = { face:{ fillColor:{ gray:0.0, alpha:0.2 } } };
foldedState.rotation = 180;

function updateFoldedState(cp){
	foldedState.cp = cp.copy();
	foldedState.draw( cp.nearest(0.5, 0.002).face );
}

project.onMouseMove = function(event){
	if(this.mouse.isPressed){
		this.centerNode.x = event.point.x;
		this.centerNode.y = event.point.y;
		var junction = this.centerNode.junction();
		var dir = junction.sectors[0].kawasakiCollapse();
		this.cp = this.template.copy();
		this.cp.crease( new Ray(this.centerNode.x, this.centerNode.y, dir.x, dir.y) ).mountain();
		this.cp.flatten();
		updateFoldedState(this.cp);
		this.draw();
	}
}

project.reset = function(){
	this.template = new CreasePattern();
	this.centerpoint = [0.5, 0.48]
	this.endpoints = [
		[0,0],
		[0,1],
		[1,0]
	]
	var creases = this.endpoints.map(function(el){
		return this.template.crease(this.centerpoint[0], this.centerpoint[1], el[0], el[1]);
	},this).filter(function(el){ return el !== undefined; })
		.forEach(function(crease){crease.valley();},this);
	this.template.flatten();
	var valleyCreases = this.template.edges.filter(function(el){return el.orientation==CreaseDirection.valley;});
	this.centerNode = valleyCreases[0].commonNodeWithEdge(valleyCreases[1]);
	this.cp = this.template.copy();
	this.cp.crease(this.centerpoint[0], this.centerpoint[1], 1, 1).mountain();
	updateFoldedState(this.cp);
	this.draw();
}
project.reset();

