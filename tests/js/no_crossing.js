
var noCross = new OrigamiPaper("canvas-no-crossing");
noCross.zoomToFit(0.05);

var resetCP;
var refCP;

noCross.load("/tests/svg/water_strider_marks.svg", function(e){
	noCross.cp.setMinRectBoundary();
	resetCP = noCross.cp.duplicate();
	noCross.load("/tests/svg/water_strider_lines.svg", function(e){
		noCross.cp.setMinRectBoundary();
		refCP = noCross.cp.duplicate();
		noCross.init();
	});
});

noCross.selectNearestEdge = true;

noCross.reset = function(){

}
noCross.reset();

noCross.onFrame = function(event) { }
noCross.onResize = function(event) { }
noCross.onMouseDown = function(event){
	resetCP = this.cp.duplicate();
}
noCross.onMouseUp = function(event){ }
noCross.onMouseMove = function(event) {
	if(resetCP !== undefined && this.cp.contains(event.point)){
		this.cp = resetCP.duplicate();
		var creases = this.cp.creaseRayRepeat(new XY(event.point.x, event.point.y), new XY(0,-1));
		creases.forEach(function(el){ if(el !== undefined) el.valley(); })
		// this.cp.clean();
		this.init();
	} else{
		this.cp = refCP
		this.init();
	}
}
