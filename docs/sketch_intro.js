var sketch_intro = function(p) {
	var paperSize = 250;
	var g = new CreasePattern();
	p.wiggle = true;
	var nodeStarts = [];
	p.reset = function(){
		g.clear();
		g.fishBase();
		nodeStarts = [];
		for(var i = 0; i < g.nodes.length; i++){
			nodeStarts.push(g.nodes[i]);
		}
	}
	p.setup = function(){
		canvas = p.createCanvas(paperSize, paperSize);
		p.reset();
	}
	p.draw = function() {
		// update
		if(p.wiggle){
			var mag = 0.1;
			var speed = 0.0002;
			var t1 = 1+p.millis()*speed;
			var t2 = 6+p.millis()*speed;
			var t3 = 17+p.millis()*speed;
			var t4 = 29+p.millis()*speed;
			g.nodes[3] = {'x':(nodeStarts[3].x + mag * (p.noise(t1)*2-1.0) ), 
			              'y':(nodeStarts[3].y + mag * (p.noise(t2)*2-1.0) ) };
			g.nodes[2] = {'x':(nodeStarts[2].x + mag * (p.noise(t3)*2-1.0) ), 
			              'y':(nodeStarts[2].y + mag * (p.noise(t4)*2-1.0) ) };
			// for(var i = 0; i < g.nodes.length; i++){
			// 	var boundary = g.nodes[i].isBoundary;
			// 	if(boundary == undefined){
			// 		g.nodes[i].x =  0.01 * p.noise(t1);
			// 		g.nodes[i].y = -0.0005 + 0.001 * p.noise(i*44.22+10+p.millis()*0.0002);
			// 	} 
			// }
		}
		// draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, paperSize*0.5-paperSize*0.5, paperSize*0.5-paperSize*0.5);
		p.strokeWeight(.01);
		drawCoordinateFrame(p);
		// drawGraphPoints(p, g);
		drawGraphLines(p, g);
	}
	p.mousePressed = function(){
		p.reset();
	}
};