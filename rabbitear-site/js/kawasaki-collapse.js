var origami = new OrigamiPaper("row");
var folded = new OrigamiFold("row");

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
	// var junction = this.centerNode.junction();
	// var dir = junction.sectors[2].kawasakiCollapse();
	// this.cp = this.template.copy();
	// this.cp.crease( dir ).mountain();
	// this.cp.clean();
	this.cp.clear();
	this.cp.crease(0, 0, this.centerNode.x, this.centerNode.y).mountain();
	this.cp.crease(1, 1, this.centerNode.x, this.centerNode.y).mountain();
	var cornerCrease = this.cp.crease(1, 0, this.centerNode.x, this.centerNode.y);
	var kawasakiCrease = this.cp.kawasakiCollapse(this.centerNode);
	var a = {x:0,y:0};
	var b = {x:1,y:1};
	var cross = (b.x - a.x)*(this.centerNode.y - a.y) > (b.y - a.y)*(this.centerNode.x - a.x);
	// console.log(cross)
	if((b.x - a.x)*(this.centerNode.y - a.y) > (b.y - a.y)*(this.centerNode.x - a.x)){ 
		cornerCrease.valley(); kawasakiCrease.mountain();
	} else{
		kawasakiCrease.valley(); cornerCrease.mountain();
	}	
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

origami.animate = function(event){
	if(!this.mouse.isPressed){
		var scale = .2;
		var sp = 0.12345;
		var sp2 = 0.22222;
		var off = 11.111;
		var point = {x: Math.sin( 6.28 * Math.cos(off + sp*(event.time+6)) ),
		             y: Math.cos( 6.28 * Math.cos(off + sp2*(event.time+6)) )};
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
	// var valleyCreases = this.template.edges.filter(function(el){return el.orientation==CreaseDirection.valley;});
	var valleyCreases = this.template.edges.filter(function(el){return el.orientation == 3;});
	this.centerNode = valleyCreases[0].commonNodeWithEdge(valleyCreases[1]);
	this.cp = this.template.copy();
	this.cp.crease(this.centerpoint[0], this.centerpoint[1], 1, 1).mountain();
	updateFoldedState(this.cp);
	this.draw();
}
origami.reset();
