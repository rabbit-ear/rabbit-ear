var sketch_intro = function(p) {
	var paperSize = 250;
	var g = new PlanarGraph();
	p.wiggle = true;
	p.reset = function(){
		g.clear();
		g.fishBase();
	}
	p.setup = function(){
		canvas = p.createCanvas(paperSize, paperSize);
		p.reset();
	}
	p.draw = function() {
		/︎/ update
		if(p.wiggle){
			var mag = 0.005;
			var speed = 0.001;
			for(var i = 0; i < g.nodes.length; i++){
				var boundary = g.nodes[i].isBoundary;
				if(boundary == undefined){
					// g.nodes[i].x += -0.0005 + 0.001 * p.noise(i*31.111+p.millis()*0.0002);
					// g.nodes[i].y += -0.0005 + 0.001 * p.noise(i*44.22+10+p.millis()*0.0002);
				} else if(boundary == 1 || boundary == 3){
					g.nodes[i].x += -mag*0.5 + mag * p.noise(i*31.111+p.millis()*speed);
				} else if(boundary == 2 || boundary == 4){
					g.nodes[i].y += -mag*0.5 + mag * p.noise(i*44.22+10+p.millis()*speed);
				}
				if(g.nodes[i].x < 0.0) g.nodes[i].x = 0.0;
				if(g.nodes[i].x > 1.0) g.nodes[i].x = 1.0;
				if(g.nodes[i].y < 0.0) g.nodes[i].y = 0.0;
				if(g.nodes[i].y > 1.0) g.nodes[i].y = 1.0;
			}
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