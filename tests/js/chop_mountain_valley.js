
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

    PaperSketch.prototype.initialize = function(){
		this.canvas = document.getElementById(this.canvasName);
		this.scope = new paper.PaperScope();
		// setup paper scope with canvas
		this.scope.setup(canvas);
		zoomView(this.scope, canvas.width, canvas.height);
		
		this.cp = new CreasePattern();
		this.paperCP = new PaperCreasePattern(this.scope, cp);

		reset();
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
    PaperSketch.prototype.onResize = function (event) { };
    PaperSketch.prototype.onMouseMove = function (event) { };
    PaperSketch.prototype.onMouseDown = function (event) { };

	scope.view.onFrame = function(event){ this.onFrame(event); }
	scope.view.onResize = function(event){ this.onResize(event); }
	scope.view.onMouseMove = function(event){ this.onMouseMove(event); }
	scope.view.onMouseDown = function(event){ this.onMouseDown(event); }

	return PaperSketch;
}());

function chop_mountain_valley(){
	var canvas = document.getElementById('canvas-chop-mountain-valley');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);
	
	var cp = new CreasePattern();
	var paperCP = new PaperCreasePattern(scope, cp);

	var nearestEdge = undefined;
	var nearestNode = undefined;

	var NUM_LINES = 10;

	function resetCP(){
		cp.clear();
		for(var i = 0; i < NUM_LINES; i++){
			var crease = cp.creaseOnly( new XYPoint(Math.random(), Math.random()), new XYPoint(Math.random(), Math.random()) );
			if(Math.random() < 0.5){ crease.mountain(); } 
			else{                    crease.valley(); }
		}
		cp.clean();
		paperCP.initialize();
	}
	resetCP();

	scope.view.onFrame = function(event){ }
	scope.view.onResize = function(event){
		paper = scope;
		zoomView(scope, canvas.width, canvas.height);
	}
	scope.view.onMouseMove = function(event){ 
		mousePos = event.point;
		var nEdge = cp.getNearestEdge( mousePos.x, mousePos.y ).edge;
		if(nearestEdge !== nEdge){
			nearestEdge = nEdge;
			for(var i = 0; i < cp.edges.length; i++){
				if(nearestEdge != undefined && nearestEdge === cp.edges[i]){
					paperCP.edges[i].strokeColor = { hue:0, saturation:0.8, brightness:1 };
				} else{
					Object.assign(paperCP.edges[i], paperCP.styleForCrease(cp.edges[i].orientation));
				}
			}
		}
	}

	scope.view.onMouseDown = function(event){
		paper = scope;
		resetCP();
	}

}  chop_mountain_valley();