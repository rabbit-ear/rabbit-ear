var origami = new OrigamiPaper("canvas");
// origami.show.sectors = true;

origami.reset = function(){
	this.cp.clear();

	this.cp.setBoundary([0,1,2].map(function(el){return [Math.random(), Math.random()];},this));
	var tri = new Triangle(this.cp.nodes.map(function(n){ return new XY(n.x, n.y); },this));
	var inc = tri.incenter();

	var edgeLengths = this.cp.edges.map(function(e){ return e.length(); },this);

	var circles = this.cp.nodes.map(function(n){
		return 0.5 * n.adjacentEdges()
			.map(function(e){ return edgeLengths[e.index]; })
			.sort(function(a,b){ return a-b; })
			.shift()
	},this);
	// console.log(circles);

	var bisectLines = this.cp.nodes.map(function(n){ return new Edge(n.x, n.y, inc.x, inc.y); },this);

	var rays = this.cp.nodes
		.map(function(n, i){
			return n.adjacentNodes().map(function(adjN){
				var vec = new XY(adjN.x - n.x, adjN.y - n.y);
				var vec90 = vec.rotate90();
				var vec270 = vec.rotate270();
				var origin = n.add(vec.normalize().scale(circles[i]));
				// var origin = n.lerp(adjN, 0.5);
				var towardCenter = new XY(inc.x - origin.x, inc.y - origin.y);
				var reflect = bisectLines[i].reflectionMatrix();
				// crease and reflect, but just only over the center lines
				if(vec90.dot(towardCenter) > 0){
					return [
						new Ray(origin, vec90),
						new Ray(origin, vec90).transform(reflect)
					];
				}
				else if(vec270.dot(towardCenter) > 0){
					return [
						new Ray(origin, vec270),
						new Ray(origin, vec270).transform(reflect)
					];
				}
			},this);
		},this);



	bisectLines.forEach(function(e){
		this.cp.crease(e);
	},this);

	rays.forEach(function(rs){
		rs.forEach(function(raypairs){
			// console.log(ray);
			raypairs.forEach(function(ray){
				this.cp.creaseAndStop(ray);
			},this);
		},this);
	},this);

	this.cp.clean();
	this.draw();
}
origami.reset();

origami.onFrame = function(event){ }
origami.onResize = function(event){ }
origami.onMouseDown = function(event){ this.reset(); }
origami.onMouseUp = function(event){ }
origami.onMouseMove = function(event){ }
