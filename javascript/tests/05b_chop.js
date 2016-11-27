var test05b = function(p){
	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();	
	var intersections = [];

	function fullPageCreases(){
		g.clear();
		for(var i = 0; i < 6; i++){
			var edge1 = Math.floor(Math.random()*4);
			var edge2 = (edge1+2)%4;
			var x1, y2, x2, y2;
			if(edge1 == 0 || edge1 == 2) x1 = Math.random()
			else if(edge1 == 1)          x1 = 1;
			else if(edge1 == 3)          x1 = 0;
			if(edge1 == 1 || edge1 == 3) y1 = Math.random();
			else if(edge1 == 0)          y1 = 1;
			else if(edge1 == 2)          y1 = 0;
			if(edge2 == 0 || edge2 == 2) x2 = Math.random()
			else if(edge2 == 1)          x2 = 1;
			else if(edge2 == 3)          x2 = 0;
			if(edge2 == 1 || edge2 == 3) y2 = Math.random();
			else if(edge2 == 0)          y2 = 1;
			else if(edge2 == 2)          y2 = 0;
			g.addEdgeWithVertices(x1, y1, x2, y2);
		}
		g.cleanup();
	}

	function reset(){
		fullPageCreases();
		intersections = g.getAllEdgeIntersections();
	}

	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.strokeWeight(.01);
		reset();
	}

	function chop(){
		g.cleanup();
		console.log('chopping, Edge count: ' + g.edges.length);
		// we're going to be iterating and removing elements at the same time (!)
		// we will remove edges. we only add to nodes array. nodes indices are preserved.
		intersections = g.getAllEdgeIntersectionsDetailed();
		var iterations = 0;
		while(intersections != undefined && intersections.length > 0){
			var i = 0
			var node1a = intersections[i]['edge1NodeA'];
			var node1b = intersections[i]['edge1NodeB'];
			var node2a = intersections[i]['edge2NodeA'];
			var node2b = intersections[i]['edge2NodeB'];
			var intersection = intersections[i].location;

			if(g.areNodesAdjacent(node1a, node1b) && g.areNodesAdjacent(node2a, node2b)){
				g.removeEdgeBetween(node1a, node1b);
				g.removeEdgeBetween(node2a, node2b);
				var newIntersectionVertexIndex = g.nodes.length;
				// g.nodes.push({x:intersection.x, y:intersection.y});
				g.addEdgeFromVertex(node1a, intersection.x, intersection.y);
				g.addEdgeFromExistingVertices(node1b, newIntersectionVertexIndex);
				g.addEdgeFromExistingVertices(node2a, newIntersectionVertexIndex);
				g.addEdgeFromExistingVertices(node2b, newIntersectionVertexIndex);
			}
			
			iterations += 1;
			g.cleanup();
			intersections = g.getAllEdgeIntersectionsDetailed();
			if(intersections.length > 300) {
				console.log(intersections);
				console.log('BREAK LENGTH');
				return;
			}
			if(iterations > 200){
				console.log(intersections);
				console.log('BREAK ITERATIONS');
				return;
			}
		}

		g.cleanup();
		intersections = [];
		console.log('done, new Edge count: ' + g.edges.length);
	}

	// function chop(){
	// 	g.cleanup();
	// 	console.log('chopping, Edge count: ' + g.edges.length);
	// 	// we're going to be iterating and removing elements at the same time (!)
	// 	// we will remove edges. we only add to nodes array. nodes indices are preserved.
	// 	intersections = g.getAllEdgeIntersectionsDetailed();
	// 	var iterations = 0;
	// 	while(intersections != undefined && intersections.length > 0){
	// 			if(iterations > 100){
	// 				console.log('--- NEW ROUND ---');
	// 			}
	// 		for(var i = intersections.length-1; i >= 0; i--){
	// 			var node1a = intersections[i]['edge1NodeA'];
	// 			var node1b = intersections[i]['edge1NodeB'];
	// 			var node2a = intersections[i]['edge2NodeA'];
	// 			var node2b = intersections[i]['edge2NodeB'];
	// 			var intersection = intersections[i].location;
	// 			if(iterations > 100){
	// 				console.log(node1a + ' ' + node1b + ' ' + node2a + ' ' + node2b + ' x:' + intersection.x + ' y:' + intersection.y);
	// 			}

	// 			if(g.areNodesAdjacent(node1a, node1b) && g.areNodesAdjacent(node2a, node2b)){
	// 				g.removeEdgeBetween(node1a, node1b);
	// 				g.removeEdgeBetween(node2a, node2b);
	// 				var newIntersectionVertexIndex = g.nodes.length;
	// 				// g.nodes.push({x:intersection.x, y:intersection.y});
	// 				g.addEdgeFromVertex(node1a, intersection.x, intersection.y);
	// 				g.addEdgeFromExistingVertices(node1b, newIntersectionVertexIndex);
	// 				g.addEdgeFromExistingVertices(node2a, newIntersectionVertexIndex);
	// 				g.addEdgeFromExistingVertices(node2b, newIntersectionVertexIndex);
	// 			}
	// 		}
	// 		iterations += 1;
	// 		g.cleanup();
	// 		intersections = g.getAllEdgeIntersectionsDetailed();
	// 		if(intersections.length > 300) {
	// 			console.log(intersections);
	// 			console.log('BREAK LENGTH');
	// 			return;
	// 		}
	// 		if(iterations > 200){
	// 			console.log(intersections);
	// 			console.log('BREAK ITERATIONS');
	// 			return;
	// 		}
	// 	}

	// 	g.cleanup();
	// 	intersections = [];
	// 	console.log('done, new Edge count: ' + g.edges.length);		
	// }

	p.draw = function() {
		// draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);
		
		p.fill(0, 0, 0);
		p.stroke(0, 0, 0);
		drawCoordinateFrame(p);
		drawGraphPoints(p, g);
		p.stroke(0, 0, 0, 30);
		drawGraphLines(p, g);
		for(var i = 0; i < intersections.length; i++){
			p.fill(255, 0, 0);
			p.noStroke();
			p.ellipse(intersections[i].x, intersections[i].y, .03, .03);
		}
	}

	p.mouseReleased = function(){
		reset();
	}

	p.mousePressed = function(){
		chop();
	}
};