var cp = new CreasePattern()
var origami = new OrigamiPaper("canvas-cp", cp);

// by default only edges are shown
origami.show.nodes = true;
origami.show.faces = true;
origami.show.sectors = true;

// set all fill colors transparent, only turn on each one upon hover
origami.style.node.fillColor = {alpha:0.0};
origami.style.face.fillColor = {alpha:0.0};
origami.style.sector.fillColors = [{alpha:0.0}, {alpha:0.0}];

// this is required if new components are shown. they didn't yet exist on the canvas
// (todo: this is hard to remember and shouldn't be required. need a work-around)
origami.draw();
origami.patternscale = 1/12;

origami.makeTouchPoint(new XY(0, 0.5 - 0.025 * origami.patternscale * 12 ));
origami.makeTouchPoint(new XY(0, 0.5 + 0.025 * origami.patternscale * 12 ));
origami.makeTouchPoint(new XY(0.5, 0.5 - origami.patternscale ));
origami.makeTouchPoint(new XY(0.5, 0.5 + origami.patternscale ));


origami.redraw = function(){
	this.cp.clear();
	var scale = this.patternscale;
	var gap = 0.025 * scale * 12;

	this.cp.crease(new Line(this.touchPoints[2].position.x, this.touchPoints[2].position.y, 1, .04));
	this.cp.crease(new Line(this.touchPoints[3].position.x, this.touchPoints[3].position.y, 1, -.04));
	for(var i = 0; i < this.xs.length-1; i++){
		this.cp.crease(this.xs[i], this.touchPoints[0].position.y - this.ys[i], this.xs[i+1], this.touchPoints[0].position.y - this.ys[i+1]);
		this.cp.crease(this.xs[i], this.touchPoints[1].position.y + this.ys[i], this.xs[i+1], this.touchPoints[1].position.y + this.ys[i+1]);
		this.cp.crease(this.xs[i], this.touchPoints[0].position.y - this.ys[i], this.xs[i], this.touchPoints[1].position.y + this.ys[i]);
		this.cp.creaseAndReflect( new Ray(this.xs[i], this.touchPoints[0].position.y - this.ys[i], 0, -1) );
		this.cp.creaseAndReflect( new Ray(this.xs[i], this.touchPoints[1].position.y + this.ys[i], 0, 1) );
	}

	this.cp.clean();

	origami.draw();	
}


origami.reset = function(){
	this.cp.clear();

	var scale = this.patternscale;


	this.xs = [];
	do{
		this.xs = [];
		for(var i = 0; i < 1; i += Math.random() * (scale/2) + (scale/3)){
			this.xs.push(i);
		}
	} while(1 - this.xs[this.xs.length-1] > (scale/4));
	this.xs[this.xs.length-1] = 1;
	// console.log(this.xs.length);

	this.ys = Array.apply(null, Array(this.xs.length+1)).map(function(){return 0;});
	var upwards = true;
	var horizontal = false;

	for(var i = 0; i <= this.xs.length; i++){
		if(horizontal){ this.ys[i] = this.ys[i-1]; }
		else if(upwards){
			this.ys[i] -= 10 * scale * ((Math.cos(i*0.9)*0.01 + 0.015 ) * Math.cos(i*0.05) - (Math.cos(i*0.6)*0.005 + 0.0075 ) * Math.cos(i*0.0333));
		} else if(!upwards){ 
			this.ys[i] += 10 * scale * ((Math.cos(i*0.9)*0.01 + 0.015 ) * Math.cos(i*0.05) + (Math.cos(i*0.6)*0.005 + 0.0075 ) * Math.cos(i*0.0333));
		}

		if(horizontal){
			horizontal = !horizontal;
			upwards = !upwards;
		} else{
			// horizontal = true;
			if(Math.random() > 0.9){ horizontal = true; }
			else{ upwards = !upwards; }
		}
	}
	this.redraw();
}
origami.reset();

origami.onMouseMove = function(event){
	if(this.mouse.isPressed){
		this.redraw();
	}

	// update() returns all crease lines back to their original color
	origami.update();

	// get the nearest parts of the crease pattern to the mouse point
	var nearest = cp.nearest(event.point);

	// get() will return the paperjs object (line, polygon) that reflects the data model object
	// this paperjs object is what we style
	origami.get(nearest.node).fillColor = this.styles.byrne.darkBlue;
	origami.get(nearest.edge).strokeColor = this.styles.byrne.yellow;
	origami.get(nearest.face).fillColor = this.styles.byrne.red;
	origami.get(nearest.sector).fillColor = this.styles.byrne.blue;
}
