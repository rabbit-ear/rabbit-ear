
var loadSVGSketch = new OrigamiPaper("canvas-load-svg");
loadSVGSketch.zoomToFit(0.05);

loadSVG("/tests/svg/crane.svg", function(e){ 
	loadSVGSketch.cp = e;
	loadSVGSketch.initialize();
});

loadSVGSketch.selectNearestEdge = true;

loadSVGSketch.reset = function(){
	loadSVGSketch.cp.clear();
	loadSVGSketch.initialize();
}
loadSVGSketch.reset();

loadSVGSketch.onFrame = function(event) { }
loadSVGSketch.onResize = function(event) { }
loadSVGSketch.onMouseDown = function(event){ }
loadSVGSketch.onMouseUp = function(event){ }
loadSVGSketch.onMouseMove = function(event) { }

