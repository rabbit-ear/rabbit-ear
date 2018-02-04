var turtle_shell_callback;

var turtleShell = new OrigamiPaper("canvas-turtle-shell");
turtleShell.setPadding(0.05);
	
turtleShell.makeFlatFoldableIndicators = function(){
	turtleShell.nodeLayer.visible = true;
	turtleShell.nodeLayer.activate();
	turtleShell.nodeLayer.removeChildren();
	for(var i = 0; i < turtleShell.cp.nodes.length; i++){
		var color = { hue:130, saturation:0.8, brightness:0.7, alpha:0.5 }
		if( !turtleShell.cp.nodes[i].flatFoldable() ){ color = { hue:0, saturation:0.8, brightness:1, alpha:0.5 } }
		var nodeCircle = new turtleShell.scope.Shape.Circle({
			center: [turtleShell.cp.nodes[i].x, turtleShell.cp.nodes[i].y],
			radius: 0.02,
			fillColor: color
		});
	}
}

turtleShell.reset = function(){
	loadSVG("/files/svg/turtle-shell.svg", function(e){ 
		// shellTrace = e;
		turtleShell.cp = e;
		turtleShell.draw();
		// paperCP = new OrigamiPaper(scope, shellTrace);
		// nodeLayer.bringToFront();
		turtleShell.makeFlatFoldableIndicators();
	});
}
turtleShell.reset();

turtleShell.onFrame = function(event) { }
turtleShell.onResize = function(event) { }
turtleShell.onMouseDown = function(event){ }
turtleShell.onMouseUp = function(event){ }
turtleShell.onMouseMove = function(event) { }
