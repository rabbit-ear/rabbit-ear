var _11_merge_duplicates = function( p ) {
	p.callback = undefined;  // three arguments: number of nodes, number of edges, merge-point-{x:_,y:_}

	var paperSize = 250;
	var WIDTH = paperSize;
	var HEIGHT = paperSize;

	var g = new PlanarGraph();

	var numEdges = 5;

	var flashFades = [];

	p.reset = function(){
		g.clear();
		for(var i = 0; i < numEdges; i++){
			var x1pos = Math.random();
			var y1pos = Math.random();
			var x2pos = Math.random();
			var y2pos = Math.random();
			g.newPlanarEdge( x1pos, y1pos, x2pos, y2pos );
			g.nodes[g.nodes.length-1]['offset'] = {'x':Math.random()*80,'y':Math.random()*80};
			g.nodes[g.nodes.length-1]['speed'] = {'x':Math.random()*80,'y':Math.random()*80};
			g.nodes[g.nodes.length-2]['offset'] = {'x':Math.random()*80,'y':Math.random()*80};
			g.nodes[g.nodes.length-2]['speed'] = {'x':Math.random()*80,'y':Math.random()*80};
		}
		if(p.callback != undefined){
			p.callback(g.nodes.length, g.edges.length, undefined);
		}
	}
	p.setup = function(){
		canvas = p.createCanvas(WIDTH, HEIGHT);
		p.reset();
	}
	var t = 0;
	p.draw = function() {
		// update
		t += 1;
		for(var i = 0; i < g.nodes.length; i++){
			g.nodes[i].x = 0.5+0.4*Math.cos(t*g.nodes[i].speed.x * 0.0003 + g.nodes[i].offset.x);
			g.nodes[i].y = 0.5+0.4*Math.sin(t*g.nodes[i].speed.y * 0.0003 + g.nodes[i].offset.y);
		}
		var mergeDataArray = g.cleanDuplicateNodes(0.0075);
		if(mergeDataArray != undefined && mergeDataArray.length){
			for(var i = 0; i < mergeDataArray.length; i++){
				var mergeData = mergeDataArray[i];
				mergeData['brightness'] = 1.0;
				flashFades.push(mergeData);
				if(p.callback != undefined){
					p.callback(g.nodes.length, g.edges.length, {'x':mergeData.x, 'y':mergeData.y});
				}
			}
		}
		// remove flashes if they are 
		if(flashFades.length){
			for(var i = flashFades.length-1; i >= 0; i--){
				flashFades[i].brightness -= .1;
				if(flashFades[i].brightness <= 0){
					flashFades.splice(i, 1);
				}
			}
		}

		//draw
		p.clear();
		p.applyMatrix(paperSize, 0, 0, paperSize, WIDTH*0.5-paperSize*0.5, HEIGHT*0.5-paperSize*0.5);

		p.background(255);
		// draw graph
		p.fill(0);
		p.stroke(0);
		p.strokeWeight(.01);
		drawGraphPoints(p, g);
		drawGraphLines(p, g);
		// drawCoordinateFrame(p);

		// draw flashes for joins
		for(var i = 0; i < flashFades.length; i++){
			var ff = flashFades[i].brightness;
			p.fill(0,0,0,ff*255);
			p.noStroke();
			p.ellipse(flashFades[i].x, flashFades[i].y, 0.2 - 0.2*ff, 0.2 - 0.2*ff);
		}
	}
	p.mousePressed = function(){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was pressed inside of canvas
		}
	}
	p.mouseReleased = function(event){
		var mouseXScaled = p.mouseX / paperSize;
		var mouseYScaled = p.mouseY / paperSize;
		if(mouseXScaled < 0.0 || mouseXScaled > 1.0) mouseXScaled = undefined;
		if(mouseYScaled < 0.0 || mouseYScaled > 1.0) mouseYScaled = undefined;
		if(mouseXScaled != undefined && mouseYScaled != undefined){
			// mouse was released inside of canvas
			p.reset();
		} else{
			// console.log(g.edges);
		}
	}
};