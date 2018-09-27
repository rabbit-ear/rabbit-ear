var div = document.getElementsByClassName('row')[0];
var origami = new OrigamiPaper(div);
var folded = new OrigamiFold(div);

folded.mouseZoom = false;
folded.rotation = 180;
origami.centerPoint = {x:0.5, y:0.5};

function updateFoldedState(cp){
	folded.cp = cp.copy();
	var topFace = folded.cp.nearest(0.5, 0.002).face;
	folded.draw( topFace );
}

origami.updateCenter = function(point){
	this.centerPoint.x = point.x;
	this.centerPoint.y = point.y;

	this.cp.clear();
	this.cp.crease(0, 0, this.centerPoint.x, this.centerPoint.y).mountain();
	this.cp.crease(1, 1, this.centerPoint.x, this.centerPoint.y).mountain();
	var cornerCrease = this.cp.crease(1, 0, this.centerPoint.x, this.centerPoint.y);
	var kawasakiCrease = this.cp.kawasakiCollapse(this.centerPoint);
	var a = {x:0,y:0};
	var b = {x:1,y:1};
	var cross = (b.x - a.x)*(this.centerPoint.y - a.y) > (b.y - a.y)*(this.centerPoint.x - a.x);
	// console.log(cross)
	if((b.x - a.x)*(this.centerPoint.y - a.y) > (b.y - a.y)*(this.centerPoint.x - a.x)){ 
		cornerCrease.valley(); kawasakiCrease.mountain();
	} else{
		kawasakiCrease.valley(); cornerCrease.mountain();
	}	
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

origami.updateCenter({x:0.5, y:0.505});
