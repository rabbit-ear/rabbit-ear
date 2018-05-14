
var foldedState = new OrigamiFold("canvas-folded", cp);

// foldedState.load("/files/svg/fish-base-tanaka.svg", function(){ 
foldedState.load("/files/svg/crane.svg", function(){ 
	foldedState.cp.flatten();
	foldedState.draw();
});

// foldedState.cp.birdBase();
// foldedState.draw();

foldedState.onFrame = function(event) { }
foldedState.onResize = function(event) { }
foldedState.onMouseDown = function(event){ }
foldedState.onMouseUp = function(event){ }
foldedState.onMouseMove = function(event) { }
