
var noCross = new OrigamiPaper("canvas-no-crossing");
noCross.setPadding(0.05);

var resetCP;
var refCP;

noCross.load("/files/svg/water_strider_marks.svg", function(e){
	noCross.cp.setMinRectBoundary();
	resetCP = noCross.cp.copy();
	noCross.load("/files/svg/water_strider_lines.svg", function(e){
		noCross.cp.setMinRectBoundary();
		refCP = noCross.cp.copy();
		noCross.draw();
	});
});

noCross.selectNearestEdge = true;

noCross.reset = function(){

}
noCross.reset();

noCross.onFrame = function(event) { }
noCross.onResize = function(event) { }
noCross.onMouseDown = function(event){
	resetCP = this.cp.copy();
}
noCross.onMouseUp = function(event){ }
noCross.onMouseMove = function(event) {
	if(resetCP !== undefined && this.cp.contains(event.point)){
		this.cp = resetCP.copy();
		var creases = this.cp.creaseRayRepeat(new XY(event.point.x, event.point.y), new XY(0,-1));
		creases.forEach(function(el){ if(el !== undefined) el.valley(); })
		// this.cp.clean();
		this.draw();
	} else{
		this.cp = refCP
		this.draw();
	}
}
