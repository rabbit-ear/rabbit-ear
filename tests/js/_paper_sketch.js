
var PaperSketch = (function () {

	PaperSketch.prototype.style = {};

	PaperSketch.prototype.styleForCrease = function(orientation){
		if   (orientation == CreaseDirection.mountain){ return this.style.mountain; }
		else if(orientation == CreaseDirection.valley){ return this.style.valley; }
		else if(orientation == CreaseDirection.border){ return this.style.border; }
		return this.style.mark;
	}

	function PaperSketch(canvasName) {
		if(canvasName == undefined) { throw "PaperSketch() init issue"; }
		// holds onto a pointer to the data model
		this.canvasName = canvasName;

		this.initialize();
	}

	var thingy = function(){
		console.log("thingy");
	}

	PaperSketch.prototype.initialize = function(){
		this.canvas = document.getElementById(this.canvasName);
		this.scope = new paper.PaperScope();
		// setup paper scope with canvas
		this.scope.setup(this.canvas);
		zoomView(this.scope, this.canvas.width, this.canvas.height);
		
		this.cp = new CreasePattern();
		this.paperCP = new PaperCreasePattern(this.scope, this.cp);

		// this.scope.view.onFrame = function(event){ this.onFrame(event); }
		this.scope.view.onResize = function(event){    }
		this.scope.view.onMouseMove = function(event){ thingy();}
		this.scope.view.onMouseDown = function(event){ console.log("this");}
		this.reset();
	}

	PaperSketch.prototype.reset = function() {

		var NUM_LINES = 10;

		this.cp.clear();
		for(var i = 0; i < NUM_LINES; i++){
			var crease = this.cp.creaseOnly( new XYPoint(Math.random(), Math.random()), new XYPoint(Math.random(), Math.random()) );
		}
		this.cp.clean();
		this.paperCP.initialize();
	}

	PaperSketch.prototype.update = function () { };
	PaperSketch.prototype.onFrame = function (event) { };
	PaperSketch.prototype.resize = function (event) { };
	PaperSketch.prototype.mouseMove = function (event) { };
	PaperSketch.prototype.mouseDown = function (event) { };

	return PaperSketch;
}());
