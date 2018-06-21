// example
// mouse hover over nodes, faces, edges, sectors to highlight them
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

origami.reset = function(){
	this.cp.clear();

	var scale = 1/12 * 2;

	var xs = [];
	do{
		xs = [];
		for(var i = 0; i < 1; i += Math.random() * (scale/2) + (scale/3)){
			xs.push(i);
		}
	} while(1 - xs[xs.length-1] > (scale/4));
	xs[xs.length-1] = 1;
	// console.log(xs.length);

	var ys = Array.apply(null, Array(xs.length+1)).map(function(){return 0;});
	var upwards = true;
	var horizontal = false;

	for(var i = 0; i <= xs.length; i++){
		if(horizontal){ ys[i] = ys[i-1]; }
		else if(upwards){
			ys[i] -= 10 * scale * ((Math.cos(i*0.9)*0.01 + 0.015 ) * Math.cos(i*0.05) - (Math.cos(i*0.6)*0.005 + 0.0075 ) * Math.cos(i*0.0333));
		} else if(!upwards){ 
			ys[i] += 10 * scale * ((Math.cos(i*0.9)*0.01 + 0.015 ) * Math.cos(i*0.05) + (Math.cos(i*0.6)*0.005 + 0.0075 ) * Math.cos(i*0.0333));
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
	var gap = 0.025 * scale * 12;

	this.cp.crease(new Line(0.5, 0.5 - 3*gap, 1, .04));
	this.cp.crease(new Line(0.5, 0.5 + 3*gap, 1, -.04));
	for(var i = 0; i < xs.length-1; i++){
		this.cp.crease(xs[i], 0.5 - gap - ys[i], xs[i+1], 0.5 - gap - ys[i+1]);
		this.cp.crease(xs[i], 0.5 + gap + ys[i], xs[i+1], 0.5 + gap + ys[i+1]);
	}
	for(var i = 0; i < xs.length; i++){
		// verticals
		this.cp.crease(xs[i], 0.5 - gap - ys[i], xs[i], 0.5 + gap + ys[i]);
		this.cp.creaseAndReflect( new Ray(xs[i], 0.5 - gap - ys[i], 0, -1) );
		this.cp.creaseAndReflect( new Ray(xs[i], 0.5 + gap + ys[i], 0, 1) );
	}



	this.cp.clean();

	origami.draw();
}
origami.reset();

origami.onMouseMove = function(event){
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
