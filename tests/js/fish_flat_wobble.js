var fishCP = new CreasePattern();
// fish base, wobble
function fish_base_flat_wobble(){
	var canvas = document.getElementById('canvas-fish-flat-wobble');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height, 0.5);

	nearFishBase(fishCP);
	var paperCP = new PaperCreasePattern(scope, fishCP);
	var wobble2 = {x:fishCP.nodes[6].x, y:fishCP.nodes[6].y};
	var wobble3 = {x:fishCP.nodes[7].x, y:fishCP.nodes[7].y};

	scope.view.onFrame = function(event) {
		// reset everything
		nearFishBase(fishCP);
		paperCP.initialize();

		var scale = .08;
		var sp = 1.5;
		fishCP.nodes[6].x = wobble2.x + Math.sin(sp*event.time*.8) * scale
		fishCP.nodes[6].y = wobble2.y + Math.cos(sp*event.time*.895) * scale;
		fishCP.nodes[7].x = wobble3.x + Math.sin(sp*event.time*1.2) * scale;
		fishCP.nodes[7].y = wobble3.y + Math.sin(sp*event.time) * scale;
		var topAngles = fishCP.nodes[7].interiorAngles();
		var triTop = topAngles[1];
		var a0 = triTop.angle;
		var a1 = topAngles[0].angle;
		var a2 = topAngles[2].angle;
		var rayAngle = Math.PI - a2;
		var triTopOneEdgeAngle = triTop.edges[0].absoluteAngle(fishCP.nodes[7]);
		fishCP.creaseRay(fishCP.nodes[7], new XYPoint(Math.cos(triTopOneEdgeAngle - rayAngle), Math.sin(triTopOneEdgeAngle - rayAngle)) ).mountain();

		fishCP.clean();

		// console.log(fishCP.nodes[7].flatFoldable());

		paperCP.initialize();
		// paperCP.update();
	}

	scope.view.onResize = function(event) {
		zoomView(scope, canvas.width, canvas.height, 0.5);
	}
	scope.view.onMouseMove = function(event) {
		mousePos = event.point;
	}

} fish_base_flat_wobble();

function nearFishBase(g){
	g.clear();
	g.nodes = [];
	g.edges = [];
	g.addEdgeWithVertices(0.0, 0.0, 0.29289, 0.0).border();
	g.addEdgeWithVertices(0.29289, 0.0, 1.0, 0.0).border();
	g.addEdgeWithVertices(1.0, 0.0, 1.0, 0.70711).border();
	g.addEdgeWithVertices(1.0, 0.70711, 1.0, 1.0).border();
	g.addEdgeWithVertices(1.0, 1.0, 0.0, 1.0).border();
	g.addEdgeWithVertices(0.0, 1.0, 0.0, 0.0).border();
	g.addEdgeWithVertices(1,0, 0,1).mountain();
	g.addEdgeWithVertices(0,1, 0.70711,0.70711).valley();
	g.addEdgeWithVertices(0,1, 0.29289,0.29289).valley();
	g.addEdgeWithVertices(1,0, 0.29289,0.29289).valley();
	g.addEdgeWithVertices(1,0, 0.70711,0.70711).valley();
	g.addEdgeWithVertices(0.29289,0.29289, 0,0).valley();
	g.addEdgeWithVertices(0.70711,0.70711, 1,1).valley();
	// g.addEdgeWithVertices(0.70711,0.70711, 1,0.70711).mountain();
	// g.addEdgeWithVertices(0.29289,0.29289, 0.29289,0).mountain();
	g.clean();
}