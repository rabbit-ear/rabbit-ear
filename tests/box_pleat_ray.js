
var boxPleating = new OrigamiPaper("canvas-box-pleat-ray").setPadding(0.075);
var resetCP, refCP;

boxPleating.load("/files/svg/water_strider_marks.svg", function(e){
	boxPleating.cp.setMinRectBoundary();
	resetCP = boxPleating.cp.copy();
	boxPleating.load("/files/svg/water_strider_lines.svg", function(e){
		boxPleating.cp.setMinRectBoundary();
		refCP = boxPleating.cp.copy();
		boxPleating.draw();
	});
});

boxPleating.onFrame = function(event){ }
boxPleating.onResize = function(event){ }
boxPleating.onMouseDown = function(event){
	resetCP = this.cp.copy();
}
boxPleating.onMouseUp = function(event){ }
boxPleating.onMouseMove = function(event){
	if(resetCP !== undefined && this.cp.contains(event.point)){
		this.cp = resetCP.copy();
		var creases = this.cp.creaseRayRepeat(new Ray(event.point.x, event.point.y, 0,-1));
		creases.forEach(function(el){ if(el !== undefined) el.valley(); })
		// this.cp.clean();
		this.draw();
	} else{
		this.cp = refCP
		this.draw();
	}
}
