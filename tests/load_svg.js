
var loadSVGSketch = new OrigamiPaper("canvas-load-svg");
loadSVGSketch.setPadding(0.05);

loadSVGSketch.load("/files/svg/crane.svg", function(){ 
	loadSVGSketch.draw();
});

loadSVGSketch.select.edge = true;

loadSVGSketch.reset = function(){
	paper = this.scope; 
	loadSVGSketch.cp.clear();
	loadSVGSketch.draw();
}
loadSVGSketch.reset();

loadSVGSketch.onFrame = function(event) { }
loadSVGSketch.onResize = function(event) { }
loadSVGSketch.onMouseDown = function(event){ }
loadSVGSketch.onMouseUp = function(event){ }
loadSVGSketch.onMouseMove = function(event) { }

