
var PaperSketch = (function () {

	function PaperSketch(canvasName) {
		if(canvasName == undefined) { throw "PaperSketch(canvas) needs a canvas"; }
		this.canvasName = canvasName;

		this.init();
	}

	PaperSketch.prototype.init = function(){
		this.canvas = document.getElementById(this.canvasName);
		this.scope = new paper.PaperScope();
		// setup paper scope with canvas
		this.scope.setup(this.canvas);
		zoomView(this.scope, this.canvas.width, this.canvas.height);
		
		this.cp = new CreasePattern();
		this.paperCP = new PaperCreasePattern(this.scope, this.cp);

		var that = this;
		this.scope.view.onFrame = function(event){     that.onFrame(event); }
		this.scope.view.onResize = function(event){    that.onResize(event); }
		this.scope.view.onMouseMove = function(event){ that.onMouseMove(event); }
		this.scope.view.onMouseDown = function(event){ that.onMouseDown(event); }		
	}

	PaperSketch.prototype.setup = function() { }
	PaperSketch.prototype.update = function () { };

	PaperSketch.prototype.onFrame = function (event) { };
	PaperSketch.prototype.onResize = function (event) { 
		zoomView(this.scope, this.canvas.width, this.canvas.height);
	};
	PaperSketch.prototype.onMouseMove = function (event) { };
	PaperSketch.prototype.onMouseDown = function (event) { };

	return PaperSketch;
}());
