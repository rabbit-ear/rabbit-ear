var folded = new OrigamiFold("canvas-2");
var origami = new OrigamiPaper("canvas-1");
folded.style = { face:{ fillColor:{ gray:0.0, alpha:0.2 } } };
folded.mouseZoom = false;
folded.rotation = 180;
folded.style.face.fillColor = {gray:1.0, alpha:0.5};

function updateFoldedState(cp){
	folded.cp = cp.copy();
	var topFace = folded.cp.nearest(0.5, 0.002).face;
	folded.draw( topFace );
	// folded.draw();
}

origami.updateCP = function(){
	var junction = this.centerNode.junction();
	var dir = junction.sectors[2].kawasakiCollapse();
	this.cp = this.template.copy();
	this.cp.crease( dir ).mountain();
	this.cp.clean();
	updateFoldedState(this.cp);
	this.draw();
}

origami.onMouseMove = function(event){
	if(this.mouse.isPressed){
		this.centerNode.x = event.point.x;
		this.centerNode.y = event.point.y;
		this.updateCP();
	}
}

origami.onFrame = function(event){
	if(!this.mouse.isPressed){
		var scale = .2;
		var sp = 0.12345;
		var sp2 = 0.22222;
		var off = 11.111;
		var point = new XY(Math.sin( 6.28 * Math.cos(off + sp*(event.time+6)) ),
		                   Math.cos( 6.28 * Math.cos(off + sp2*(event.time+6)) ));
		this.centerNode.x = 0.5 + point.x * scale;
		this.centerNode.y = 0.5 + point.y * scale;
		this.updateCP();
	}

}

origami.reset = function(){
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
	this.template.clean();
	var valleyCreases = this.template.edges.filter(function(el){return el.orientation==CreaseDirection.valley;});
	this.centerNode = valleyCreases[0].commonNodeWithEdge(valleyCreases[1]);
	this.cp = this.template.copy();
	this.cp.crease(this.centerpoint[0], this.centerpoint[1], 1, 1).mountain();
	updateFoldedState(this.cp);
	this.draw();
}
origami.reset();
