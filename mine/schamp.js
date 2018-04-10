var schamp = new OrigamiPaper("canvas");

function bisectRepeat(a, b, limit, iterations){
	if(iterations === undefined){ iterations = 0; }
	var c = bisect(a, b)[0];
	// if(iterations > limit) return [c];
	if(iterations > limit) return [a, b];
	var results1 = bisectRepeat(a, c, limit, iterations+1);
	var results2 = bisectRepeat(b, c, limit, iterations+1);
	return results1.concat(results2);
}

schamp.reset = function(){
	this.cp.clear();
	this.cp.rectangle(1.66,1);
	var size = this.cp.bounds().size;

	var pad = 0.14;

	var origin = new XY(size.width*0.5, pad);
	var lines = bisectRepeat( new XY(1,1), new XY(-1,1), 2);
	lines.forEach(function(el){
		this.cp.creaseThroughPoints(origin, origin.add(el));
	},this);

	var origin2 = origin.add(new XY(-(1.0-pad*2), (1.0-pad*2)));
	var lines = bisectRepeat( new XY(1,-1), new XY(-1,-1), 2);
	lines.forEach(function(el){
		this.cp.creaseThroughPoints(origin2, origin2.add(el));
	},this);

	var origin3 = origin.add(new XY((1.0-pad*2), (1.0-pad*2)));
	var lines = bisectRepeat( new XY(1,-1), new XY(-1,-1), 2);
	lines.forEach(function(el){
		this.cp.creaseThroughPoints(origin3, origin3.add(el));
	},this);

	this.cp.clean();

	var cc = origin.midpoint(origin2);
	var clipLength = 1/(Math.sqrt(2)) * new Ray(cc, new XY(1,1)).clipWithEdges(this.cp.edges).shift().length();

	var rays = [
		new Ray(cc.add(new XY(clipLength, -clipLength)), new XY(0,1)),
		new Ray(cc.add(new XY(clipLength, -clipLength)), new XY(-1,0)),
		new Ray(cc.add(new XY(-clipLength, clipLength)), new XY(1,0)),
		new Ray(cc.add(new XY(-clipLength, clipLength)), new XY(0,-1)),

		new Ray(cc.add(new XY(clipLength*1.5, -clipLength*1.5)), new XY(0,1)),
		new Ray(cc.add(new XY(clipLength*1.5, -clipLength*1.5)), new XY(-1,0)),
		new Ray(cc.add(new XY(-clipLength*1.5, clipLength*1.5)), new XY(1,0)),
		new Ray(cc.add(new XY(-clipLength*1.5, clipLength*1.5)), new XY(0,-1))
	];

	var polylines = rays.map(function(el){
		return new Polyline().rayReflectRepeat(el, this.cp.edges);
	},this);

	// this.cp.creaseRayRepeat( new Ray(cc, new XY(1,1)));
	// this.cp.creaseRayRepeat( new Ray(cc, new XY(-1,-1)));

	polylines.forEach(function(p){
		p.edges().forEach(function(e){
			this.cp.crease(e);
		},this);
	},this);
	
	this.draw();
}
schamp.reset();

schamp.onFrame = function(event){ }
schamp.onResize = function(event){ }
schamp.onMouseDown = function(event){
	this.reset();
}
schamp.onMouseUp = function(event){ }
schamp.onMouseMove = function(event){ }
