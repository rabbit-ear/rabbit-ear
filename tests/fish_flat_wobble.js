var fishCP = new CreasePattern();
// fish base, wobble
function fish_base_flat_wobble(){
	var canvas = document.getElementById('canvas-fish-flat-wobble');
	var scope = new paper.PaperScope();
	// setup paper scope with canvas
	scope.setup(canvas);
	zoomView(scope, canvas.width, canvas.height);

	nearFishBase(fishCP);
	var paperCP = new OrigamiPaper(scope, fishCP);
	var wobble2 = {x:fishCP.nodes[6].x, y:fishCP.nodes[6].y};
	var wobble3 = {x:fishCP.nodes[7].x, y:fishCP.nodes[7].y};

	scope.view.onFrame = function(event) {
		// reset everything
		nearFishBase(fishCP);
		paperCP.draw();

		var scale = .04;
		var spd = 1.5;
		fishCP.nodes[6].x = wobble2.x + Math.sin(spd*event.time) * scale
		fishCP.nodes[6].y = wobble2.y + Math.cos(spd*event.time*.895) * scale;
		fishCP.nodes[7].x = wobble3.x - Math.cos(spd*event.time*.895+Math.PI) * scale;
		fishCP.nodes[7].y = wobble3.y - Math.sin(spd*event.time+Math.PI) * scale;

		var topNode = fishCP.nodes[7];
		var topAngles = topNode.interiorAngles();
		var triTop = topAngles[1];
		var a1 = topAngles[0].angle();
		var a2 = topAngles[2].angle();
		var topRayAngle = Math.PI - a2;
		var triTopOneEdgeVector = triTop.edges[0].vector(topNode);
		var triTopOneEdgeAngle = Math.atan2(triTopOneEdgeVector.y, triTopOneEdgeVector.x);
		fishCP.creaseRay(topNode, new XY(Math.cos(triTopOneEdgeAngle - topRayAngle), Math.sin(triTopOneEdgeAngle - topRayAngle)) ).mountain();

		var bottomNode = fishCP.nodes[6];
		var bottomAngles = bottomNode.interiorAngles();
		var triBottom = bottomAngles[1];
		var b1 = bottomAngles[0].angle();
		var b2 = bottomAngles[2].angle();
		var bottomRayAngle = Math.PI - b2;
		var triBottomOneEdgeVec = triBottom.edges[0].vector(bottomNode);
		var triBottomOneEdgeAngle = Math.atan2(triBottomOneEdgeVec.y, triBottomOneEdgeVec.x);
		var bottomVector = new XY(Math.cos(triBottomOneEdgeAngle - bottomRayAngle), Math.sin(triBottomOneEdgeAngle - bottomRayAngle));
		fishCP.creaseRay(bottomNode, bottomVector ).mountain();

		fishCP.clean();

		// console.log(fishCP.nodes[7].flatFoldable());

		paperCP.draw();
		// paperCP.update();
	}

	scope.view.onResize = function(event) {
		zoomView(scope, canvas.width, canvas.height);
	}
	scope.view.onMouseMove = function(event) {
		mousePos = event.point;
	}

} fish_base_flat_wobble();

function nearFishBase(g){
	g.clear();
	g.nodes = [];
	g.edges = [];
	g.newPlanarEdge(0.0, 0.0, 0.29289, 0.0).border();
	g.newPlanarEdge(0.29289, 0.0, 1.0, 0.0).border();
	g.newPlanarEdge(1.0, 0.0, 1.0, 0.70711).border();
	g.newPlanarEdge(1.0, 0.70711, 1.0, 1.0).border();
	g.newPlanarEdge(1.0, 1.0, 0.0, 1.0).border();
	g.newPlanarEdge(0.0, 1.0, 0.0, 0.0).border();
	g.newPlanarEdge(1,0, 0,1).mountain();
	g.newPlanarEdge(0,1, 0.70711,0.70711).valley();
	g.newPlanarEdge(0,1, 0.29289,0.29289).valley();
	g.newPlanarEdge(1,0, 0.29289,0.29289).valley();
	g.newPlanarEdge(1,0, 0.70711,0.70711).valley();
	g.newPlanarEdge(0.29289,0.29289, 0,0).valley();
	g.newPlanarEdge(0.70711,0.70711, 1,1).valley();
	// g.newPlanarEdge(0.70711,0.70711, 1,0.70711).mountain();
	// g.newPlanarEdge(0.29289,0.29289, 0.29289,0).mountain();
	g.clean();
}