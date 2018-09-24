var div = document.getElementsByClassName('row')[0];
var origami = new OrigamiPaper(div);
var folded = new OrigamiFold(div);
// folded.style = { face:{ fillColor:{ gray:0.0, alpha:0.2 } } };
folded.mouseZoom = false;
folded.rotation = 180;

function updateFoldedState(cp){
	folded.cp = cp.copy();
	var topFace = folded.cp.nearest(0.5, 0.002).face;
	folded.draw( topFace );
	// folded.draw();
}

origami.updateCenter = function(point){
	this.centerNode.x = point.x;
	this.centerNode.y = point.y;
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
		this.updateCenter(event.point);
	}
}

origami.onMouseDown = function(event){
	this.updateCenter(event.point);
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
	var valleyCreases = this.template.edges.filter(function(el){return el.orientation == 3;});
	this.centerNode = valleyCreases[0].commonNodeWithEdge(valleyCreases[1]);
	this.cp = this.template.copy();
	this.cp.crease(this.centerpoint[0], this.centerpoint[1], 1, 1).mountain();
	updateFoldedState(this.cp);
	this.draw();

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
origami.reset();
